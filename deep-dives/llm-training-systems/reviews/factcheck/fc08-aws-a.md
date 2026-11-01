# Fact check fc08-aws-a (sections 20, 21, 22), 2026-10-31

Files: `src/sections/AwsOwnership.tsx` (section 20, Who Owns What on AWS), `src/sections/AwsHardware.tsx`
(section 21), `src/sections/CapacityCost.tsx` (section 22); claims lists `revamp/claims/aws-ownership.md`,
`revamp/claims/aws-hardware.md`, `revamp/claims/capacity-cost.md`.

Evidence read anonymously (no account token, no identifying header): AWS documentation pages, What's New posts
and Price List files fetched with plain curl and converted to text (`/tmp/lts-fc-fc08-text/`); the SageMaker
Price List CSVs for us-east-1 and us-east-2 (offer 20261029165009), the EC2 us-east-1 CSV (offer
20261029175634, training rows), the PCS (20261027150327) and EKS (20261027191639) offer files; GitHub files by
shallow clone or raw.githubusercontent.com at the pinned refs the Cites carry (Kueue 14b79288 = v0.20.4 by
`git ls-remote`, Kubeflow Trainer 658725bd = v2.3.0, SageMaker Python SDK 94899a91 = v3.28.0, HyperPod recipes
a6030c31 = 2.0.11).

## AwsOwnership.tsx (section 20, Who Owns What on AWS)

Claims checked: 93 (the claims list after this pass; 90 before). Non-CONFIRMED: 10, all fixed: OVERREACH 7, UNSUPPORTED 3.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | Training jobs: the repair page describes no screening before the job starts (cell implies none exists) | AwsOwnership.tsx:262 | OVERREACH | https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_InfraCheckConfig.html ("A SageMaker-provided health check tests the health of instance hardware and cluster network connectivity"; `EnableInfraCheck`, Required: No; no timing stated) | Added the opt-in InfraCheckConfig sentence with its hedge (timing not documented), worded as section 26 words it (AwsOwnership.tsx:270) |
| 2 | "Team queues, priorities and fair share come from AWS Batch service jobs" | AwsOwnership.tsx:247 | UNSUPPORTED (fair share) | https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html ("submit training jobs with priorities to configurable queues"; no fair share on the page) | "and fair share" removed (:251) |
| 3 | "inside it any launcher works" | AwsOwnership.tsx:332 | OVERREACH | https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html ("other distributed training frameworks and packages such as PyTorch DistributedDataParallel (DDP), torchrun, MPI (mpirun), and parameter server") | "you can also run other launchers, such as torchrun and mpirun" (:342) |
| 4 | PCS node replacement "Yours" (nothing replaces a node) | AwsOwnership.tsx:568 | OVERREACH (known item) | https://docs.aws.amazon.com/pcs/latest/userguide/troubleshooting_instance-terminated-after-reboot.html ("AWS PCS automatically terminates and replaces the instance"); https://docs.aws.amazon.com/pcs/latest/userguide/slurm-reboot-faq.html ("If you specify nextstate=DOWN, the node will be marked as unhealthy after reboot and trigger instance replacement") | Cell narrowed to "You decide; PCS replaces" with both Cites; deciding a node is bad stays yours, our reading (:570). The two echoes changed with it: MATRIX_TITLE "your team runs them on your own Slurm and on PCS" (:1342-1346) and the family paragraph "PCS takes the controller" (:1800-1801) |
| 5 | PCS: "SchedMD ships a major version every six months and PCS supports each for about 18 months" | AwsOwnership.tsx:658 | OVERREACH (derived, printed as the page's statement) | https://docs.aws.amazon.com/pcs/latest/userguide/slurm-versions.html (page says "at regular intervals"; table dates 23.11 to 26.05 at six-month spacing, 25.05 5/29/2025 to EOL 11/30/2026 = 18 months, 26.05 5/26/2026 to 11/30/2027) | Re-expressed as the table's dates, labelled our arithmetic (:685) |
| 6 | Self-managed EKS capacity "with reserved capacity used first" | AwsOwnership.tsx:904 | OVERREACH (all three options) | https://docs.aws.amazon.com/eks/latest/userguide/ml-compute-management.html ("EKS Auto Mode and Karpenter always provision reserved capacity (ODCRs and Capacity Blocks) first") | Scoped to Auto Mode and Karpenter (:925) |
| 7 | HyperPod EKS: "task governance installs and configures Kueue" | AwsOwnership.tsx:1133 | UNSUPPORTED at the cited page | Governance page has 0 Kueue hits; https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-setup-task-governance.html ("HyperPod task governance EKS add-on installs Kueue for your HyperPod EKS clusters") | Split: governance page keeps allocations, priorities, borrowing, preemption; new Cite to the setup page for the Kueue install (:1159) |
| 8 | Admission paragraph: "HyperPod EKS installs Kueue for you through task governance" | AwsOwnership.tsx:2001 | UNSUPPORTED at the cited page | as row 7 | Cite moved to the task governance setup page (:1996) |
| 9 | "Kubeflow calls TrainJob alpha" | AwsOwnership.tsx:891 | OVERREACH (minor) | https://github.com/kubeflow/trainer/blob/658725bdae5c7e3a0854d93ac6ff492e109a22ab/README.md#L104 ("Kubeflow Trainer project is currently in alpha status, and APIs may change") | "Kubeflow Trainer, which serves TrainJob, is in alpha with APIs that may change" (:912) |
| 10 | Script item 2: "On EKS node groups, schedule scale-to-zero more than 30 minutes before the end" | AwsOwnership.tsx:2108 | OVERREACH (managed node groups) | https://docs.aws.amazon.com/eks/latest/userguide/ml-node-groups.html (managed node groups "automatically create a scheduled scaling policy that drains the node group 40 minutes before the reservation ends"; "Don't edit or delete this scheduled action"; self-managed: "Schedule scale-to-zero more than 30 minutes before the end time"). Cross-section condition: 40 minutes for managed node groups (section 25) | "a managed node group scales itself to zero 40 minutes before the end, and self-managed nodes need a scheduled scale-to-zero more than 30 minutes before it" (:2125) |

CONFIRMED (83 claim lines), by group: CreateTrainingJob ResourceConfig; Docker image on deployed instances; warm pools
(3,600 s, 28 days, billable); repair page (GPU only, reboot or replace, 10 attempts, not billed, restart from the
previous checkpoint); RetryStrategy 1 to 30; managed Spot (local path to S3, no On-Demand fallback); training
plans (not interchangeable); SDK v3 ModelTrainer replaces Estimator (README.rst at 94899a91); SMP v2.8.0 dated
April 01, 2025; recipes 2.0.11 have no Trainium recipe or launcher, and both tutorial paths are absent from the
tree; ParallelCluster (pay for resources only, PCS banner, 3.16.x to 02/20/2028); PCS (patch updates, sizes 32,
512, 2,048 at creation, no "health" entry in the TOC, AMI pages name no agent, one block per node group,
terminate at expiry, queued jobs pending, EFA driver in the AMI, PCS-ready DLAMI has no frameworks, AMI notes no
Neuron, advanced tier for P and Trn, controller 0.5825, 3.2579, 6.5426 per hour, 0.64 and 0.08 per
instance-hour); Slurm 25.05 EOL 11/30/2026; sbatch --requeue (initiated from its beginning); HyperPod (Slurm DLAMI
and lifecycle scripts, "more than 16 nodes" on the overview, HMA checks and labels, taint, condition, same
checks on both orchestrators; automatic recovery default; auto-resume semantics; agent since September 11, 2025;
deep checks DCGM level 4 about 45 to 90 minutes, NCCL test, EKS Neuron checks; operator matrix, Kueue v0.12.2
and v0.12.3, 300 s, numRestartBeforeFullJobRestart; release notes 2026-04-16 and AMI pages; custom AMI What's
New Jul 13, 2026); EKS (repair, topology, Neuron DRA 1.34 and later not in Auto Mode, AMI contents, versions
1.34 to 1.37 standard, 1.31 to 1.33 extended, 0.10 and 0.50 per cluster-hour, Auto Mode 2.64192 per
p5.48xlarge-hour, node groups recommended for predictable training); Kueue README (all-or-nothing, TAS, fair
sharing, PyTorchJob deprecated); Batch (overlay, minimum zero, labels and taints, On-Demand and Spot, no AMI or
K8s update, MNP is gang scheduling, 1,000 instances, one type, one pod per node, retries 1 to 10 incl. EC2
instance failure, EFA page, no Batch charge); DLAMI base 20261027 (EFA 1.51.0, ofi_nccl 1.22.0); Capacity Block
and training-plan edges (11:00 and 11:30 UTC, P6e-GB200 60 minutes, plan 30 minutes and one hour); every
computed dollar figure in the cost paragraph recomputed from `presets.ts`.

Cross-section conditions: Capacity Block edges, the Trainium deep-check scope (EKS only), the 40-minute managed
node group drain (now matching section 25) and the 40% MFU assumption all hold. Register IDs are not printed.

## AwsHardware.tsx (section 21, Training Hardware on AWS)

Claims checked: 66. Non-CONFIRMED: 3, all fixed: WRONG 3.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | ZeRO Cite venue "preprint" | AwsHardware.tsx:1310 | WRONG (coordinator item) | Crossref 10.1109/SC41405.2020.00024 | venue="SC 2020" (:1311) |
| 2 | TorchTitan Neuron 64-ranks Cite anchored L206-L208 | AwsHardware.tsx:73, 1061 | WRONG (anchor stops one line short: "ranks per node: 16 Trainium2 devices with 4 logical cores each" is L209) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L206-L209 | Anchor and Cite text L206-L209 (fc06 found the same sentence; this file now matches it) |
| 3 | "Two generally available products have no row", while the table has a Trn3 Gen2 UltraServer row | AwsHardware.tsx:1111 | WRONG (internal contradiction; the paragraph means AWS's pages) | the GROUPS rows in the same file; ac.html and the Capacity Blocks pricing page have 0 "gb300" and 0 "trn3" hits | "Two generally available products are missing from AWS's specification and price pages." (:1112) |

CONFIRMED (63): every ac.html cell the page prints (8 GPUs per P instance; HBM 40, 80, 80, 141, 141, 179, 268, 185 GiB; trn1 and trn1n 32 GiB; trn2 "8192 GiB (16 x 512 GiB)"; p6-b300 "2148 GiB (8 x 268 GiB)"; p6e-gb200 "4 x NVIDIA B200 GPU"; network 4x 100, 3200, 3200, 3200, 3200, 6400, 3200, 8x 100, 16x 100, 16x 200 Gigabit; NVMe 8 x 1000, 8 x 3800, 3 x 7500, 4 x 1900 GB; Spot "No" for P6e-GB200 and Trn2u); product pages (P4 600 GB/s NVSwitch, P5 900 GB/s and "3,200 Gbps of EFA networking", P6 "1.8 TBp/s of bandwidth per GPU", "up to 72 Blackwell GPUs within one NVLink domain", "only available in UltraServers", "400 GB ps per GPU of EFAv4 networking for a total of 28.8 Tbps per P6e-GB200 UltraServer", 28,800 and 14,400 table cells, "1440 GB" prose with 1,432, 740 and 2,144 table cells, P6e-GB300 1.5x memory and FP4 without sparsity; Trn1 768 GB/s; Trn2 3.2 Tbps EFAv3, 96 GB, 1.5 TB, "Trn2 UltraServers are available now"; Trn3 "NeuronLink-v4 with 2TB/s of bandwidth per" chip; UltraServers page "(available in preview)"); Neuron 2.33 (trn2-arch "4x4, 2D Torus topology", four trn2u.48xlarge, same-coordinate ring, 96 / 1,536 / 6,144 GiB; Trainium2 eight NeuronCore-v3, 667 and 1,299 dense, 1.28 TB/s; NeuronCore-v3 79 and 158; neither page states a clock; Trainium3 671, 2,517 MXFP8, 144 GiB, 2.56 TB/s; trn3-arch Gen1 64 and Gen2 144, 36 servers of 4, "replacing the previous 2D-torus architecture", "optimized for Mixture of Experts models and autoregressive inference serving", 2,048 GiB/s, 12,800 and 28,800 Gbps, 256, 320 and 128 GB/s; Trainium 190 TFLOPS and 32 GiB); NVIDIA (A100 BF16 312; H100 and H200 1,979 and 3,958 "With sparsity"; HGX B300 and B200 FP16/BF16 36 PFLOPS and FP8 72 PFLOPS sparse per eight GPUs, "Dense is 1/2 sparse spec shown", NVLink 1.8 TB/s per GPU, 1.4 TB per HGX B200; GB200 NVL72 360 and 720 PFLOPS sparse, "Dense is one-half sparse spec shown", 372 GB per superchip); What's New posts both "Posted on: Dec 2, 2025", general availability, GB300 "contact your AWS sales representative"; about-pytorch-neuron.rst L115-L118 at 10832bbc ("bfloat16 is the training baseline", "FP8 and MXFP8 require Trainium 3"); awsome-distributed-training nccl-tests README L206-L243 at 3a100257 (2 x p5.48xlarge, 17179869184 B at 487.09 GB/s busbw); Hugging Face metadata at revision 349b2ddb (safetensors total 70,553,706,496, re-fetched); Capacity Blocks guide lists Trn2 UltraServer blocks in us-east-2.

Every derived number was recomputed by bundling `src/lib/presets.ts`, `memory.ts` and `parallelism.ts` with esbuild 0.25.12 under node: 1,128,859,303,936 bytes = 1,128.9 GB; floor p4d 343.6 GB and 3.29, p5 687.2 and 1.64, p5en 1,211.2 and 0.93, p6-b200 1,537.6 and 0.73, p6-b300 2,302.1 and 0.49, trn1 549.8 and 2.05, trn2 1,649.3 and 0.68; 1.76 at 80 GB per H100; EFA shares 50, 400, 800, 200, 800 (p6e-gb200), 200 (Trn3); 24 GiB per rank; section 14 example 2 at 85.0 GB against the 105.75 GB target (75% of 141) and the H100's 80 GB; 11% (2,500 / 2,250), 7% (GiB and GB), 76% (141 / 80), 50% (268 / 179), 1.94x (2,517 / 1,299), 632 and 1,264 (5% and 3%), 5.3 (512 / 96).

Known item: the P6e-GB200 EFA conflict (3,200 Gbps per instance on ac.html against 28.8 Tbps per 72-GPU UltraServer, 400 per GPU, on the P6 page) is printed as a documentation conflict, and the table and calculators take 3,200. Kept.

Cross-section conditions: cross-instance collectives priced per instance (400 GB/s for a p5.48xlarge, the "two 400s" paragraph); the 40% MFU default is not used here; no MFU claim about Trainium2 is made.

## CapacityCost.tsx (section 22, Capacity & Cost)

Claims checked: 66 (64 before). Non-CONFIRMED: 5, all fixed: WRONG 1, UNSUPPORTED 1, OVERREACH 3. Library gap reported: presets.ts lacks the p4d, p4de and trn1 training plan rows (row 1).

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | SageMaker table prints "none published" for training plans on p4d, p4de and trn1 | CapacityCost.tsx:622, 696 | WRONG | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv (USE1-TrainingPlanUpfrontFee: ml.p4d.24xlarge $15.6055, ml.p4de.24xlarge $23.42412, ml.trn1.32xlarge $10.9618, each 1.15 times the block rate) | The training plan column's missing-row label reads "not in this data" (true of the calculator data the table says it reads); "none published" stays for the other columns, where it holds. presets.ts lacks the three rows: reported to the orchestrator |
| 2 | An ODCR "bills whether it is used or not" (cited to the ODCR overview) | CapacityCost.tsx:1321 | UNSUPPORTED at the cited page | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-reservations-pricing-billing.html ("Capacity Reservations are charged at the equivalent On-Demand rate whether you run instances in reserved capacity or not") | Sentence split, new Cite to the billing page (:1328) |
| 3 | "a launch template written for a cluster placement group drops it" | CapacityCost.tsx:1369 | OVERREACH (implies EC2 strips it) | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html ("You can't specify a placement group when you launch instances into a Capacity Block") | "a launch template for a block must leave the placement group out" (:1373) |
| 4 | "EKS node groups on a block scale to zero more than 30 minutes before the end" | CapacityCost.tsx:1475 | OVERREACH | as section 20 row 10 | Managed node groups 40 minutes on their own, self-managed more than 30 (:1479) |
| 5 | "No first-party MFU for dense Llama-class training on H200 or Trainium2 was located" | CapacityCost.tsx:1658 | OVERREACH (hedge wider than the research) | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/get-started/setup-torchtitan-neuron.rst#L84 (sample log "mfu: 16.54%", Qwen3 8B on 64 ranks); orchestrator wording | "No first-party MFU benchmark for dense Llama-class training ..." (:1659) |

CONFIRMED (61): On-Demand quotas (P and Trn default 0; 192 vCPUs per p5.48xlarge; 6,144 for 32); ODCR one Availability Zone and future-dated families C, G, I, M, R, T, U, X; 8 weeks ahead and 30 minutes; block steps (1-day to 14, 7-day to 182) and plan steps (1 to 182 by the day); plan quantities 1 to 64; quota above the count; not interchangeable; up to 64 per block and 256 per organization on a date (2,048 GPUs); 64-instance blocks not for all types and Regions; no cancel, move or split; UltraClusters; outside On-Demand limits; Spot (two-minute notice; Spot support "No" for P6e-GB200 and Trn2u on ac.html); A0 conflict (p5e.48xlarge ✓ in us-east-1 in the guide, no rate on the pricing page or the us-east-1 Price List); edges (11:30 end, 11:00 and 60 minutes, plan 30 minutes and one hour, the expiration environment variable in milliseconds, PCS terminate at expiry, "might fail, based on your Slurm settings", queued jobs pending); every rate in both tables against the Price List CSVs and the pricing page; ratios (block 0.998 to 0.443; training job 1.15; HyperPod 1.20, 1.18, 1.15; plan 1.15 times the block); UpfrontFee, prevailing rate, January 2027 update, supply and demand, no Savings Plans or RI; managed Spot (no Spot rate, Billable over Training, not comparable to EC2 Spot history, "up to 90%" as a vendor claim, no On-Demand fallback); PCS 0.5825, 3.2579, 6.5426 and 0.64; EKS 0.10, 0.50 and 2.64192 (4.8% of On-Demand); node groups for predictable training; HyperPod pricing exclusions; Llama 3.1 model card L104-L154 at v0.2.0 (7.0M H100-hours, no per-stage split); Llama 3 Table 4 (43%, 41%, 38%; "38-43%") in 2407.21783v3, venue "preprint" correct. Register rows not re-opened, cited at 2026-10-30: trn2.48xlarge On-Demand $103.157 in Hyderabad and no On-Demand rate in any US Region (all-Regions file, 6 GB), p5e.48xlarge On-Demand $63.296 in Ohio.

Every computed figure recomputed with `estimateRun` and `priceRun` under node: 4,456,399 H100-hours (4.46M), $30.7M On-Demand, $26.6M blocks, $30.6M training plan, 90.67 days (91), 91-day blocks (13 seven-day steps), $26.7M for the windows, 7.0M / 4.46M = 1.57 (printed 1.6), $48.2M and 142 days; H100-hour $6.88 and $5.97; peak PFLOP-hour $3.14 (trn1 block), $3.35 (trn2 block, Ohio), $4.23 (u-p6e-gb200x72), $6.03 (p5 block); trn2 block 63% and plan 58% below the training-job rate.

Cross-section conditions: Capacity Block edges and the training-plan edges match section 20; the EKS managed node group drain now matches section 25's 40 minutes; the default MFU of 40% is labelled an assumption everywhere it prints.

## Prose and format checks, all three files

No em-dash, en-dash range, curly quote or banned word in the new text (gate run below). Acronyms in new text are already expanded earlier in each file (EKS, PCS, ODCR, MFU). No changelog voice. Register IDs are not printed. Attribution sits in the links; "AWS states savings of up to 90%" keeps its attribution because the Cite is a vendor claim.

## Gate 3 scores (after fixes)

| file | score | rationale |
|---|---|---|
| AwsOwnership.tsx | 8 | Ten overreaches and citation slips across 93 claims, all fixed; the matrix and its expandables now match their sources. Long main path, which Pass 2 addresses. |
| AwsHardware.tsx | 9 | Three small errors (venue, line anchor, one contradictory sentence), all fixed; every derived number recomputed and matching. The doc conflicts are labelled and the table states which figure it takes. |
| CapacityCost.tsx | 8 | One printed table cell class was wrong because the shared presets lack three training-plan rows; the label is now true, but the three rates stay off the page until presets.ts gains them. The other five fixes are wording and citation scope. |

## Known items for fc08

- Section 20 PCS node replacement: narrowed (section 20 row 4).
- Section 20 training-jobs screening: the opt-in InfraCheckConfig note added with its timing hedge (row 1), and
  echoed in the two-recoveries paragraph during Pass 2.
- Section 21 P6e-GB200 EFA conflict: kept as a documentation conflict; the table takes 3,200.
- Every-group items: cross-instance collectives priced per instance (section 21 holds it); ZeRO-2 and the Xid
  alert rule do not appear in these files; venues set only where confirmed (ZeRO "SC 2020" by Crossref; Llama 3
  stays "preprint"); TorchTitan SwiGLU not referenced; the pinned Llama 3.1 metadata (re-fetched, matches) and
  FSx links untouched; the Trainium2 MFU wording is "no first-party MFU benchmark" (section 22 row 5).

## Reported to the orchestrator (files this group does not own)

- `src/lib/presets.ts`: no `trainingPlan` rows for p4d.24xlarge ($15.6055), p4de.24xlarge ($23.42412) and
  trn1.32xlarge ($10.9618), us-east-1 AmazonSageMaker offer 20261029165009, USE1-TrainingPlanUpfrontFee. Once
  added, section 22's SageMaker table fills them with no section change.
- Glossary: no new acronyms introduced by these fixes.

## Harness and checks

Harness (tables and the matrix touched): `npx vite build --outDir /tmp/lts-dist-fc08 --emptyOutDir`, then
`shoot.mjs --port 4708 --sections aws-ownership,aws-hardware,capacity-cost`: one SVG per section at 1440 and
390, all "ok". Matrix PNGs read at both widths: the new PCS cell ("You decide; PCS replaces") fits its box with
no overlap. Section 22 rate tables read at 1440: every printed rate, ratio and "not in this data" cell matches
the recomputation. The 390 matrix PNG shows the page's sticky breadcrumb over the top of the element capture, a
capture artifact, not an SVG collision.

- typecheck: `tsc --noEmit`, exit 0, no output.
- lint: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output.
- test: `Test Files  6 passed (6)`, `Tests  168 passed (168)`.
- gates: no-ai-tells PASS, pinned-refs PASS, svg-a11y PASS, pre-overflow PASS.
