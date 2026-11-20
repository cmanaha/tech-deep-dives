# Claims: section 25, Choosing

claim | register ID

AWS's post of 19 November 2026 trains three policies on an SO-101 dataset; Training Jobs for a fully managed service, HyperPod for a team that already runs Kubernetes or Slurm and wants a persistent cluster | F09-81
The post reports 3.4 to 10.9 hours on one GPU per post-training run (single-GPU jobs of 3 to 11 hours) | F09-82
No AWS page comparing Batch, HyperPod and EKS side by side for these workloads was located during this research; the decision path is the dive's own reading | F09-110
The RTX renderer requires RT cores; G families are compatible and P-family GPUs are not (G7 is a further RT-core family per the entry's wave 2 line) | F06-60
A Batch compute environment holds no instances when the queue is empty | F09-13
An array job is one submission that spawns up to 10,000 children | F09-5
HyperPod is scheduled with Slurm or EKS and replaces faulty hardware automatically | F09-22
Spot gives two minutes' warning on a best-effort basis; not for work "tightly coupled between instance nodes"; be flexible across at least 10 instance types | F09-95
A Capacity Block for ML is a prepaid reservation with fixed start and end, booked up to eight weeks ahead, lasting up to six months | F09-90
A SageMaker training plan is the same kind of reservation for SageMaker targets; its list names P types | F09-34
Diagram 25.1: a unit of lost work under 30 minutes is Spot-safe | F09-11
Diagram 25.1 and the market block: the Capacity Blocks list and the training plans list read on 2026-11-20 name no G-family type | F09-91, F09-35
The five shapes and their three properties | F08-78
HyperPod pays for "many concurrent jobs, continuous synthetic generation, reserved capacity, and the tens-of-nodes tail where failures are statistically frequent" | F09-112
Telexistence fine-tuned a 14 billion parameter model on one reserved eight-GPU node; the post names no job scheduler | F09-88
Batch guidance on Spot: split or checkpoint into parts of 30 minutes or less | F09-11
Spot Instance Advisor file last modified 20 March 2026: 5 of 8 G6e sizes in N. Virginia above 20%; 4 of 6 G7e sizes in Ohio under 5%; no rows for G7 | F09-96
In EKS Auto Mode nodes drain 10 minutes before EC2 begins terminating; EC2 terminates 30 minutes before the block ends | F09-50
RobCo lists ml.g6.12xlarge and ml.g6e.12xlarge in one GPU node pool and reports no more multi-hour waits | F09-86
EKS Hybrid Nodes bill at most 32 vCPUs per node since 18 November 2026 | F09-116
NVIDIA's Jetson Linux is not in the Hybrid Nodes validated operating system list | F09-52
Since 18 November 2026 AWS Deadline Cloud supports G7 in service-managed fleets, On-Demand or Spot | F09-117
P6e-GB300 UltraServers are obtained through an AWS sales representative | F09-99
No Rubin-based EC2 instance family is named or documented as of 20 November 2026 | F08-55
The fifteen workloads and the part each fills first | F08-76
Row 1: a Step Functions task can submit a Batch job; Graviton C8g and M8g Spot | F09-100, F09-97
Row 2: Batch Spot retry on a reclaimed host; children of 30 minutes or less | F09-10, F09-11
Row 3: AWS's Cosmos 3 architecture puts its curator on Batch | F09-84
Row 4: most eight-GPU sizes give 24 vCPUs per GPU, which is 12 physical cores | F08-57
Row 5: CPU physics belongs on CPU instances (price-performance per part); Graviton Spot | F08-85, F09-97
Row 6: headless Newton physics needs no RTX hardware; Training Jobs for one-off runs, Batch for back-to-back runs | F06-51, F09-73
Row 7: G family only for RTX rendering; G7 not supported in EKS Auto Mode as of November 2026 | F06-60, F09-49
Row 8: G6e and G7e sizes in AWS's runs; AWS documents both Training Jobs and Batch for a single-GPU fine-tune | F09-82, F09-114
Row 9: LeWorldModel's authors report a single GPU for a few hours and name no GPU | F03-31
Row 10: array job per checkpoint and seed; RLWRLD evaluates on g6e | F09-5, F09-87
Row 11: the engine build runs on the target device and is GPU-specific; Greengrass delivers components | F07-8, F07-84
Row 12: a Jetson on the robot is a Greengrass core device (our reading) | F09-127
Row 13: g7e.2xlarge or p5.4xlarge for one-GPU Nano inference; Batch named for offline work | F09-84, F09-113
Row 14: P5en and P6-B200 in AWS's sizing table; the case for a persistent cluster; Spot ruled out for tightly coupled work | F09-84, F09-112, F09-95
Row 15: UltraServer blocks list P6e-GB200; P6e-GB300 through a sales representative | F09-91, F09-99
G7e and G7 are sold as On-Demand, Spot and under Savings Plans | F09-98
An ODCR holds capacity for a named type in one Availability Zone at the On-Demand rate whether used or not; ODCRs cover G instances | F09-94, F09-40
Method: units per hour divided by the price of the whole instance | F08-82
No EC2 instance was measured by us; our cards are single runs of stand-in programs on two edge machines | F08-73
One workload can change shape with scale while loading the same part | F08-80
