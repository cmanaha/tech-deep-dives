# Claims: section 25, AWS Batch

claim | register ID

A compute environment wraps resources Batch creates in the user's account (Auto Scaling group or Spot Fleet, ECS cluster); Batch takes full control of the instances | F10-1
AWS's Cosmos post gives Batch the offline side: it "provisions GPU compute resources only when inference jobs execute, then terminates instances upon completion" | F10-69
For a job of seconds "the overhead to schedule the batch job might take longer than the runtime of the job itself"; group tasks so each job runs 3 to 5 minutes | F10-42
Batch does not preempt container jobs; "Quota management is the only AWS Batch scheduling algorithm to incorporate preemption", SageMaker Training queues only | F10-34
A GPU request is a whole number of physical GPUs reserved for the container; no fractions | F10-44
Multi-node parallel jobs are not supported on Spot compute environments | F09-8
Multi-node job: main node starts first, others once it is RUNNING; a dead child node is not acted on | F10-50
Multi-node job: nodeProperties, up to 1,000 nodes by default (the ECS cluster instance limit, which can be raised), one instance type for the whole job | F10-49
Job definition: retry strategy, timeout, resources and parameters can be overridden at submission; 24 KiB maximum | F10-43
Default is one attempt with no retry; attempts 1 to 10; no rule matched means retry; AWS_BATCH_JOB_ATTEMPT starts at 1 | F10-52
No timeout unless attemptDurationSeconds is set (minimum 60 seconds); SIGTERM then SIGKILL after 30 seconds; a timed-out job is not retried | F10-46
States SUBMITTED, PENDING, RUNNABLE; a job can stay RUNNABLE indefinitely; an array parent sits in PENDING while children run | F10-23
STARTING covers the image pull and is outside the timeout; duration starts at RUNNING; a failed attempt with attempts left returns to RUNNABLE | F10-24
SUCCEEDED is exit code 0; FAILED after all attempts; state kept at least 7 days; logs in CloudWatch Logs /aws/batch/job | F10-25
Array job: 2 to 10,000 children, index from AWS_BATCH_JOB_ARRAY_INDEX starting at 0, timeout per child, one failed child fails the parent | F09-5
Queue priority matters between queues sharing a compute environment; higher integer evaluated first | F10-20
Up to three compute environments per queue, tried in ascending order, one architecture | F10-21
A later compute environment is scaled up when earlier ones "have reached their maxvCpus" or cannot satisfy the job at the front; a Spot shortage under the ceiling matches neither (open question, not tested) | F10-22
A queue without a scheduling policy is FIFO; a policy turns on fair share | F09-14
A job at the head that cannot be placed blocks the queue; "Job queue blocked" event and statusReason | F10-26
FIFO or fair share is fixed at queue creation | F10-30
Fair share ranks shares by T * weightFactor (T is vCPU usage over a look-back window; weight defaults to 1.0, lower earns more) | F10-31
Compute resource type: EC2, SPOT, FARGATE, FARGATE_SPOT, ECS_MANAGED_INSTANCES | F10-2
Fargate does not run GPU jobs; a new EC2 instance takes a few minutes | F09-1
minvCpus is the floor, maxvCpus the ceiling, desiredvCpus is moved by Batch with queue demand | F10-3
minvCpus 0 is scale to zero; a non-zero floor is a warm pool | F10-38
Batch may exceed maxvCpus by at most one instance | F09-4
The docs recommend not setting desiredvCpus; lowering it is refused | F10-4
Default allocation strategy is BEST_FIT; BEST_FIT blocks infrastructure updates | F10-8
BEST_FIT picks the lowest-cost fitting type and waits for it | F09-3
The bundles optimal, default_x86_64 and default_arm64 contain no GPU family | F10-5
A GPU job in an environment with other families may stay RUNNABLE | F10-6
minScaleDownDelayMinutes: 20 minutes to 1 week; idle instances billed; does not hold a reclaimed Spot instance | F10-40
The scale-down delay lets the next job of a burst skip the instance launch; an empty queue scales to the minimum | F09-13
ECS Managed Instances: AWS manages image, patching, lifecycle; no multi-node jobs, custom images, allocation strategy control or warm pool | F09-2
ECS Managed Instances: draining at day 14; On-Demand must precede Spot in a queue | F10-18
Unmanaged compute environment: Batch schedules into an empty ECS cluster, the user runs the instances | F10-19
g6e.xlarge and g6.xlarge have 1 GPU and 4 vCPUs; g6.xlarge has 16 GiB of memory | F10-7
Spot interruption notice: two minutes, best effort, EventBridge and instance metadata; check every 5 seconds | F10-54
Spot draining is on by default for compute environments created or updated from 9 October 2026; the ECS agent default is off | F10-55
Draining does not stop a running standalone task; no documented signal to the job on the Spot notice (that a Batch job is a standalone task is our reading) | F10-56
After the notice: attempt fails with a Host EC2 status reason, job returns to RUNNABLE at the front, replacement capacity, attempt number rises (our reading) | F10-57
The Host EC2* retry pattern with a catch-all EXIT; a retried job goes to the front of the queue | F09-10
Retried jobs go to the front of the queue; "we recommend that you set at least 1-3 automated retries" | F10-53
Batch scales from queue demand and scales instances for the GPUs requested | F10-37
Three stacked start-up waits; two CloudWatch duration metrics since October 2026 | F10-39
Documented Spot then On-Demand pattern: two queues, EventBridge, Lambda or Step Functions resubmit | F10-12
SubmitJob sample request and arrayProperties.size | F09-130
Parameters and Ref:: substitution in the command | F10-63
Spot guidance: avoid jobs of an hour or more; parts of 30 minutes or less | F09-11
On-Demand when the runtime is more than an hour and interruptions cannot be tolerated | F10-11
S3 Files volume presents a bucket as a file system; EFS volume in the job definition | F10-62
sharedMemorySize is the size of /dev/shm (need for data-loader workers is our reading) | F10-45
AWS's embodied AI series: GR00T fine-tune on Batch, 6000 steps usually up to 2 hours on g6e.4xlarge (author reported) | F09-114
Two pages disagree on the Spot allocation strategy: allocation-strategies page recommends SPOT_PRICE_CAPACITY_OPTIMIZED, Spot best-practices page says choose SPOT_CAPACITY_OPTIMIZED; both say diversify | F10-10
bidPercentage: "For most use cases, we recommend leaving this field empty"; spotIamFleetRole only with BEST_FIT or no strategy | F10-9
First-party GPU Spot precedent on Batch lists g6.xlarge, g6.2xlarge, g5.xlarge | F10-59
updatePolicy.jobExecutionTimeoutMinutes defaults to 30 | F10-16
jobStateTimeLimitActions cancels a job stuck at the head for a capacity reason; 600 to 86,400 seconds; 14400 in AWS's example | F10-27
Compute environment template fields | F09-131
ec2Configuration imageType ECS_AL2023_NVIDIA | F10-13
GPU test job definition and where retryStrategy and timeout sit | F09-129
Batch does not upgrade a compute environment's image; batchImageStatus since 25 March 2026 | F10-14
A 2025 AWS post reaches a Capacity Block through the launch template's market type | F09-17
The user guide lists instance market options among launch template parameters Batch ignores | F10-65
Batch on EKS is an overlay; nodes are labelled and tainted | F09-19
Batch on EKS turns jobs into pods on tainted nodes | F10-61
A service environment puts a Batch queue in front of SageMaker Training jobs | F09-16
Service jobs have an extra SCHEDULED state | F10-60
Up to 20 quota shares per queue lend and reclaim capacity by preemption | F10-35
