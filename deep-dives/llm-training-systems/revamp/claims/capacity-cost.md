# Claims: section 22, Capacity & Cost

File: `src/sections/CapacityCost.tsx`. Re-opened on 2026-10-31 (default accessed date): EC2 On-Demand Instance quotas, EC2 Capacity Blocks for ML (guide and considerations), Find and purchase Capacity Blocks, the AWS CLI reference for `describe-capacity-block-offerings`, EC2 On-Demand Capacity Reservations, SageMaker training plans, Training plans utilization for training jobs, SageMaker managed Spot training, the EC2 accelerated instance specification page (Spot column, via wave 2), Amazon EKS accelerated compute management (via wave 2), the AWS Price List AmazonEC2 all-Regions file (via wave 2, W5-7), and the PCS and EKS Price List files (via wave 2, W5-2, W5-4). Register rows cited without re-opening carry `accessed="2026-10-30"`: the Capacity Blocks pricing and billing pages, the Spot interruption notice page, the EKS node groups for Capacity Blocks page, the PCS Capacity Blocks page, the SageMaker AI pricing page, the AWS Price List AmazonEC2 us-east-1 and us-east-2 files, the AmazonSageMaker us-east-1 and us-east-2 files, the PCS cluster-size page, and the NVIDIA A100, GB200 and Neuron Trainium and Trainium2 pages. Every rate, hour, dollar and day figure on the page is read from `src/lib/presets.ts` (`PRICES`, `PCS_FEES`, `EKS_FEES`, `DEFAULT_MFU`) or computed by `src/lib/runtime.ts` (`estimateRun`, `priceRun`) at render time; the reserved-window figures call `priceRun` with whole-window hours.

Format: claim | source URL | register, wave 2 row or experiment

## h1 and introduction

- Llama 3.1 70B on 15T tokens at an assumed 40% MFU: about $30.7M On-Demand, $26.6M on Capacity Blocks, 91 days at 2,048 GPUs (h1 description, intro, worked bill, calculator default) | derived (estimateRun, priceRun on p5.48xlarge, 256 instances) | W5-12; 01 W8; build-log "default MFU"
- One H100-hour costs $6.88 On-Demand and $5.97 in a Capacity Block on p5.48xlarge in N. Virginia | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv and https://aws.amazon.com/ec2/capacityblocks/pricing/ [derived: 55.04 / 8, 47.757 / 8] | T05-20; T05-22; W5-6; W5-8
- 40% MFU is an assumption (section 4's default), 4.46M H100-hours for the reference run | derived (estimateRun, full-N 6N, attention none) | build-log "default MFU"; U01-5; W5-12

## Capacity first

- Running On-Demand P and Trn instance quotas default to 0 vCPUs, counted per family per Region | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31; W5-13
- p5.48xlarge has 192 vCPUs; 32 instances need 6,144 [derived] | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-2
- A raised quota reserves nothing [our reading] | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31
- ODCR holds capacity in one Availability Zone; future-dated ODCRs limited to C, G, I, M, R, T, U and X families | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html | T05-28; W5-14
- An ODCR is charged at the On-Demand rate whether instances run in it or not | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-pricing-billing.html | fc08 (the overview page does not state it)
- For P and Trn an ODCR protects only capacity already held [our reading] | same as above | T05-28
- Capacity Blocks and training plans: up to 8 weeks ahead, start in as little as 30 minutes | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html and https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T05-26; T05-29; W5-15
- Block length: 1-day steps to 14 days, then 7-day steps to 182 | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html | T05-26; W5-15
- Plan length: 1-day steps from 1 to 182 days; quantities 1, 2, 4, 8, 16, 32 or 64 | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T05-29
- A plan needs a SageMaker service quota above its instance count; it serves only the target bought for (training jobs cannot move to HyperPod) | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html (opened 2026-10-31) | T06-30
- Up to 64 instances per block; 256 instances per organization across blocks on a date; 2,048 GPUs on eight-GPU instances [derived] | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-26; W5-17
- Wall-clock floor on blocks is accelerator-hours over 2,048: 91 days for the reference run [derived] | derived (priceRun) | W5-12
- No self-serve path past 256 instances located; whether training plans count against the 256 is not stated | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | W5-17; U05-5 (hedged)
- A block cannot be cancelled, moved or split; instances placed close together inside EC2 UltraClusters; no placement group, so a launch template for a block leaves it out; outside the On-Demand quota | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-26; T05-27; T05-31
- Spot: two-minute interruption notice | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html | T05-30
- Spot exists for P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300, Trn1, Trn1n, Trn2; not for P6e-GB200 or Trn2 UltraServer instances | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-30; W5-18
- One reclaimed node stops every rank of a synchronous job, so a Spot interruption counts as a failure in section 17's arithmetic [our reading] | section 17 | T05-30
- A0 protocol (not yet run): Capacity Blocks Region table lists p5e.48xlarge in us-east-1 while the pricing page and the us-east-1 Price List carry no p5e block rate there | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html, https://aws.amazon.com/ec2/capacityblocks/pricing/, us-east-1 EC2 index.csv | C05-6; U05-7; A0
- trn2.48xlarge block rows only for Ohio and Hyderabad in the Price List | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/index.csv | W5-7; U05-3
- A0 prediction: none stated by the research guide; cost $0, no teardown | research guide section 5 | A0

## The window's edge

- Blocks and training plans end at 11:30 UTC on the final day | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html and https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T05-27; T05-29; W5-15
- EC2 begins terminating block instances at 11:00 UTC; P6e-GB200 UltraServer instances must be terminated at least 60 minutes before the end | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-27; W5-16
- A training plan terminates instances 30 minutes before the end for training jobs and one hour before for HyperPod | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html (opened 2026-10-31) | T05-29; T06-30
- Diagram: clock times are the documented edges; bars and save times schematic | as the two rows above | T05-27; T05-29
- Training jobs on a plan read `SAGEMAKER_CURRENT_CAPACITY_BLOCK_EXPIRATION_TIMESTAMP`, in milliseconds | https://docs.aws.amazon.com/sagemaker/latest/dg/training-plan-utilization-for-training-jobs.html (opened 2026-10-31) | new source, this section
- EKS managed node groups on a block scale to zero 40 minutes before the end on their own; self-managed nodes need a scheduled scale-to-zero more than 30 minutes before | https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html | T06-42; fc08 (matches section 25)
- PCS: an expiring block terminates the node group's instances, running jobs may fail depending on Slurm settings, queued jobs wait; one block per node group | https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks.html | T06-34
- Back-to-back blocks need a node group per block in the same queue or a launch template naming the next block [our reading] | same as above | T06-34
- Last save starts one save time plus a margin before the edge [our reading] | sections 18, 19 | W5-16

## What an hour costs

- Rate tables: EC2 On-Demand and Capacity Block per instance-hour (UltraServer-hour for GB200), SageMaker training job, HyperPod node and training plan rates, each with its Region, read 2026-10-30; a missing training plan row reads "not in this data", since the us-east-1 Price List also prices p4d ($15.6055), p4de ($23.42412) and trn1 ($10.9618) plans that presets.ts lacks | us-east-1 EC2 index.csv; https://aws.amazon.com/ec2/capacityblocks/pricing/; us-east-1 and us-east-2 AmazonSageMaker index.csv | T05-20; T05-21; T05-22; T05-23; T05-24; W5-6; W5-8; W5-11; W5-19
- Every N. Virginia block rate is at or below On-Demand, 0.998 (p5en, p6-b200) to 0.443 (trn1); p5.48xlarge $47.757 against $55.04 [derived] | as above | T05-22; W5-8
- Block outside Savings Plans and Reserved Instance discounts, paid up front | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-pricing-billing.html | T05-22; C05-7
- Pricing page: one rate per type and Region, next updated January 2027, charged at the rate prevailing at purchase; billing page: supply and demand at purchase | https://aws.amazon.com/ec2/capacityblocks/pricing/ and https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-pricing-billing.html | C05-7; W5-9
- `describe-capacity-block-offerings` returns `UpfrontFee`, start date and Availability Zone per offering | https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-offerings.html (opened 2026-10-31) | C05-7; new source, this section
- Training job 1.15x EC2 On-Demand; HyperPod 1.20x on P5 and P6, 1.18x P4d and P4de, 1.15x Trn1 and Trn1n; training plan 1.15x the block rate, up front, usage at $0.00 | us-east-1 AmazonSageMaker index.csv | T05-23; T05-24; W5-1; W5-10
- A training plan is a block bought through SageMaker at the training-job premium [our reading] | as above | T05-24
- trn2.48xlarge: no EC2 On-Demand in any US Region; Ohio block $35.7608; only EC2 On-Demand rate is Hyderabad $103.157 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/index.csv | T05-21; W5-7; U05-3 (closed by wave 2)
- ml.trn2.48xlarge Ohio: $97.52 training job, $101.76 HyperPod; block 63% and plan ($41.12492) 58% below the training-job rate [derived] | us-east-2 AmazonSageMaker index.csv | T05-24; W5-7
- Managed Spot: no Spot rate (Price List lists Spot training at the On-Demand rate); saving per job is 1 minus BillableTimeInSeconds over TrainingTimeInSeconds, not comparable to EC2 Spot price history; up to 90% [vendor claim]; runs only on Spot and waits | https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html (opened 2026-10-31) | T05-25; U05-4
- PCS: $0.5825, $3.2579, $6.5426 per controller-hour (Small up to 32, Medium 512, Large 2,048 instances) plus $0.64 per P or Trn instance-hour | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json and https://docs.aws.amazon.com/pcs/latest/userguide/working-with_clusters_size.html | T06-35; T06-36; W5-2; W5-31
- EKS: $0.10 per cluster-hour standard, $0.50 more on extended support; Auto Mode $2.64192 per p5.48xlarge-hour, 4.8% of On-Demand [derived] | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json | T06-40; T06-41; W5-4
- EKS guide names node groups best for training workloads with predictable sizing | https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html | T06-41; W5-39
- HyperPod: no separate service fee in the material read; bills instances while the cluster exists; pricing excludes EKS, FSx for Lustre and S3 charges | https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18

## Two worked bills

- $ per peak BF16 PFLOP-hour: Trn1 $3.14, Trn2 $3.35 (Ohio), P6e-GB200 $4.23 (Dallas Local Zone, NVL72 per-GPU peak), p5.48xlarge block $6.03; full table [derived] | rates as above; peaks from NVIDIA H100, HGX, GB200, A100 and Neuron Trainium, Trainium2 pages | W5-11; T05-13; T05-14; T05-15; T05-16; T05-17; T05-19
- No first-party MFU benchmark for dense Llama-class training on H200 or Trainium2 located (a Neuron 2.33 setup guide prints 16.54% MFU in a sample log, Qwen3 8B on 64 ranks, which is not a benchmark) | wave2-step-maths; https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/get-started/setup-torchtitan-neuron.rst#L84 | U01-5; build-log "default MFU"; fc08 (orchestrator wording)
- 70B 15T: 4.46M H100-hours, $30.7M On-Demand, $26.6M blocks, training plan $30.6M [derived] | derived (priceRun) | W5-12; W5-10
- 91 days at 2,048 GPUs: four blocks of 64, each 91 days (13 seven-day steps), $26.7M for the reserved windows [derived] | derived (priceRun on whole-window hours) | W5-12; T05-26
- Blocks of 64 instances not offered for every type in every Region | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-26
- Model card: 7.0M H100-hours for Llama 3.1 70B, 1.6 times the estimate, no split by stage | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md#L104-L154 | T01-7; W1-15; U01-3 (hedged)
- 7.0M H100-hours: $48.2M On-Demand, 142 days at 2,048 GPUs, inside one 182-day reservation [derived] | derived (priceRun) | W5-12
- Llama 3 405B published hours 1.1 to 1.3 times the 6ND estimate (section 4); read the estimate as a floor [our reading] | https://github.com/meta-llama/llama-models/blob/v0.2.0/models/llama3_1/MODEL_CARD.md#L104-L154 | T01-7; W1-14

## Calculator A: the cost panel

- Panel uses estimateRun and priceRun, section 4's default count (full-N 6N, no attention term), so the two sections agree | src/lib/runtime.ts | 01 W8
- Warnings: more than 64 instances need several blocks, 256 is the organization ceiling, a plan's largest quantity is 64, windows past 182 days | as the limits rows above | T05-26; T05-29
- Managed Spot discount is user-entered; PCS size auto-selects the smallest that fits | src/lib/runtime.ts | U05-4; T06-35
- HyperPod bills for as long as the cluster exists; the panel prices only the run's hours | https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18
- Fees add to an EC2 line; a HyperPod cluster on EKS also pays the EKS cluster fee because HyperPod pricing excludes attached services [our reading of the exclusion] | https://aws.amazon.com/sagemaker/ai/pricing/ | T06-18; T06-2
- Request the Running On-Demand P or Trn instances quota in Service Quotas, 192 vCPUs per p5.48xlarge | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31; W5-13
- CLI example: 64 p5.48xlarge for 91 days (2,184 hours) | https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-capacity-block-offerings.html (opened 2026-10-31) | T05-26

## Unresolved

- U05-5: training plans and the 256-instance ceiling, hedged on the page.
- U05-7 and A0: p5e.48xlarge blocks in us-east-1; shipped as "A0 protocol (not yet run)".
- U01-3: what the model card's 7.0M hours include; hedged.
- Library gaps (reported, not edited): `priceRun` prices run hours, not whole reserved windows; the Capacity Block and training plan limits (64, 256, 182 days, step rules) are not in presets; library notes and errors carry register IDs, which the page strips.
- fc08: presets.ts has no `trainingPlan` rows for p4d.24xlarge, p4de.24xlarge and trn1.32xlarge, which the us-east-1 AmazonSageMaker Price List (20261029165009) prices at $15.6055, $23.42412 and $10.9618 (TrainingPlanUpfrontFee); reported to the orchestrator.
