# Fact check fc09-aws-b (sections 23, 24, 25), 2026-10-31

Files: `src/sections/Storage.tsx`, `src/sections/SlurmFamily.tsx`, `src/sections/KubernetesFamily.tsx`;
claims lists `revamp/claims/storage.md`, `revamp/claims/slurm.md`, `revamp/claims/kubernetes.md`.

Status: complete. Gate 3 scores: Storage.tsx 8, SlurmFamily.tsx 8, KubernetesFamily.tsx 9 (rationale under each table).

Evidence read anonymously (curl with its default user agent, no identifying header, no account token):
- Raw files from raw.githubusercontent.com at the pinned refs: Megatron-LM `core_v0.20.0`
  (`megatron/core/datasets/indexed_dataset.py`, `gpt_dataset.py`, `tools/preprocess_data.py`,
  `megatron/core/distributed/distributed_data_parallel_config.py`, `docs/user-guide/features/dist_optimizer.md`);
  PyTorch `v2.15.0` `torch/distributed/checkpoint/filesystem.py`; s3-connector-for-pytorch `v1.5.0`
  (c4f482629523d8fd2ec6080f70bda5966f90d89a) `README.md`, `dcp/s3_file_system.py`, `_s3client/s3client_config.py`;
  mountpoint-s3 `mountpoint-s3-1.24.0` (12fec077f06acf931309fdab7e7433d5fd2ae189) `doc/SEMANTICS.md`; metaseq
  f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7 `27_percent_update.md`; awsome-distributed-ai
  3a1002576ccef26e66ba714303b10ccdaa645691 (70B FSDP sbatch, gpu-cluster-healthcheck README); Kueue README at
  14b792888dcb30cf055bf2618b6260a4989cf85f (`git ls-remote`: v0.20.4 peels to it); Kubeflow Trainer README at
  658725bdae5c7e3a0854d93ac6ff492e109a22ab (= tag v2.3.0); JobSet README at v0.13.0
  (24816853e905d39ad1ecbbf757e7636c0cbc60a7); sagemaker-hyperpod-recipes 2.0.11
  (a6030c319908c8a1b74cb619b00476f8e6baa04f) `checkpointless_llama3_70b_pretrain.yaml`. aws-parallelcluster tag
  v3.16.2 confirmed with `git ls-remote` (1937c1a3968d6ffa98459b35516a85a2ac166332).
- arXiv HTML at the versioned ids the Cites carry: 2407.21783v3 (Sec 3.3.1, Table 4), 2204.02311v5 (Appendix B),
  2402.15627v1 (Sec 4.4). PaLM's venue: JMLR 24(240):1-113, 2023, on the journal's own page
  (https://jmlr.org/papers/v24/22-1144.html).
- AWS and Slurm pages fetched 2026-10-31 (list per file below). Price files: AmazonFSx 20260911124432
  (USE1-Storage.SSD.1000 $0.600 per GB-month), AWSPCS 20261027150327 (Small $0.5825, Medium $3.2579, AdvNode
  $0.64), AmazonSageMaker 20261029165009 ($66.048 per Cluster ml.p5.48xlarge hour), AmazonEC2 20261029175634
  ($55.04 per On Demand Linux p5.48xlarge hour); the two CSVs streamed and grepped, not stored.
- Every derived number in the three files recomputed by bundling `src/lib/presets.ts`, `runtime.ts`,
  `checkpoint.ts` and `memory.ts` with esbuild 0.25.12 and running them under node: 934.99 tokens/s per GPU,
  239,356 tokens/s, 17.52 s per step, 0.957 MB/s, 29.9 KB/s, 3.74 KB/s, 8B 8,215 and 8.41 MB/s, 405B 164.3 and
  10.77 MB/s, 987.75 GB, 3.858 GB per GPU, 30.87 GB per instance, 16.46 GB/s, 19,200 GiB, $11,520 / $12,370,
  52.7 s, 0.766 GB/s, 21.48 min, 1,200 GiB, $720, 842.9 s (14.0 min), ratios 17,195 and 800.4, 0.514 GB/s and
  4.12 Gbps, 1.40% of host memory, 117,750 parts and 33.6 s; EC2 $1,268,122, HyperPod premium $253,624 (20.0%),
  PCS Small $15,165 (1.2%), Medium $17,091 (1.3%), difference $1,926; Auto Mode $60,870, cluster $72, 4.8%,
  A4 $330; checkpointless state 19.84 GB and 26.46 GB per GPU, extra 6.61 GB, 846.6 GB across 128 GPUs. Every
  one matches what the page prints.

Every-group items: no text in the three files prices a cross-instance collective, mentions ZeRO-2 under
accumulation, the Xid alert rule's bucket set, 41 sbh, Korthikanti or ZeRO++. Section 25 names Xid 79 only as
the error AWS's validation procedure injects (EKS GPU node repair page), which does not contradict section 29's
rule. The pinned Llama 3.1 metadata revisions and the FSx offer file 20260911124432 are untouched.

## Storage.tsx (section 23, Storage for Training)

About 75 claim lines plus every derived number checked. Non-CONFIRMED: WRONG 3, UNSUPPORTED 1, OVERREACH 4,
STALE 1. Pages read: FSx `ssd-storage`, `performance`, `using-fsx-lustre`, `efa-file-systems`, `importing-files`,
`fsx-data-repositories`; S3 `optimizing-performance`, `s3-express-performance`,
`directory-bucket-high-performance`, `mountpoint`; EC2 `ac.html` (instance store and memory tables),
`instance-store-lifetime`; SageMaker `managed-tier-checkpointing`.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "The whole job takes in about 239,000: one training step ..." | Storage.tsx:554-557 | WRONG (prose: the number has no unit) | Calculator A: 239,356 tokens/s for the job | "about 239,000 tokens per second" |
| 2 | S3 Connector default part size 8 MiB cited to s3client_config.py L13-L25 | Storage.tsx:61-66, :811-813 | WRONG (line range) | s3client_config.py at v1.5.0: docstring L14-L18 ("8MiB by default"), the default `part_size: int = 8 * 1024 * 1024` is L26, outside the cited range | range L14-L26 in the constant and the Cite label; claims line updated |
| 3 | Connector emulates rename with copy and delete, kind="code", cited to s3_file_system.py L150-L160 | Storage.tsx:67-72, :882-884 | UNSUPPORTED (cited lines are the docstring only) | s3_file_system.py L150-L165 docstring; the code is L181-L188 (`self._client.copy_object(...)` then `self._delete_with_retry(...)`) | range L150-L188 so the Cite carries the code; claims line updated |
| 4 | "A single client reads at up to 100 Gbps without EFA, 700 Gbps over EFA and 1,200 Gbps with GPUDirect Storage", then compared with the per-instance write rate | Storage.tsx:783-790 | WRONG (scope narrowed to reads, then applied to writes) | FSx performance page, "Throughput to individual client instances": "Maximum throughput per client, Gbps" for any traffic | "A single client instance moves up to ..." |
| 5 | A DRA created with the import option "imports the metadata of every object in the bucket" | Storage.tsx:724-728 | OVERREACH (bucket for linked repository) | FSx importing-files page: "imports metadata for all objects in the data repository" (the linked S3 path) | "of every object in the linked repository" |
| 6 | Instance store "8 x 3,800 GB on p5, p5e, p5en, p6-b200 and p6-b300 instances ... 4 x 1,900 GB on trn1 and trn2" | Storage.tsx:893-895 | OVERREACH (family scope; p5.4xlarge has 1 x 3,800 GB, trn1.2xlarge 1 x 474 GB, trn2.3xlarge 1 x 470 GB) | EC2 accelerated computing instance store table: p5/p5e/p5en/p6-b200/p6-b300 .48xlarge 8 x 3800 GB, p6e-gb200.36xlarge 3 x 7500 GB, trn1.32xlarge, trn1n.32xlarge, trn2.48xlarge, trn2u.48xlarge 4 x 1900 GB | named the 48xlarge, 36xlarge and 32xlarge sizes |
| 7 | "OPT-175B's restarts stalled when downloads ... started hanging" | Storage.tsx:691-693 | OVERREACH (stalled for delayed) | metaseq 27_percent_update.md L19: downloads "would start hanging nondeterministically, which then delayed training recovery even further" | "OPT-175B's restarts were delayed when ..." |
| 8 | PaLM Cite venue "preprint" | Storage.tsx:535 | STALE | JMLR page: "PaLM: Scaling Language Modeling with Pathways ... 24(240):1-113, 2023" | venue="JMLR 2023"; other sections still print "preprint" (Arithmetic, GettingStarted, ThreeBudgets, TrainingStep, the glossary): reported |
| 9 | Known item: dcp.save into Mountpoint on a general purpose bucket fails at its last step, ours and not run | Storage.tsx:874-880 | CONFIRMED as labelled | filesystem.py v2.15.0 L762-L798 (`finish` writes `.metadata.tmp`, L798 `self.fs.rename`), L537-L541 (`Path.rename`); the only rename in the file (grep); SEMANTICS.md L8, L20-L21 | label kept: "In our reading of both ... (not run)" |
| 10 | Known item (fc09): EBS without expansion in section 25 | n/a here | n/a | Storage.tsx does not use EBS | see KubernetesFamily.tsx |
| 11 | h1 description says "S3 Connector for PyTorch" and "Mountpoint for Amazon S3" before the body expands S3 | Storage.tsx:496, :507 | prose (acronym order) | the h1 description renders first | "the Amazon S3 (Simple Storage Service) Connector for PyTorch v1.5.0" in the h1; the body now says "Amazon S3" |

CONFIRMED (count about 66), among them: 6N FLOPs per token (PaLM App. B "6N matmul FLOPs per token seen");
70,553,706,496, 8,030,261,248, 405,853,388,800 parameters (presets, pinned metadata); 38% to 43% and 400
TFLOPs on 16,384 GPUs (Llama 3 v3 Table 4, rows 1 to 3); 2 TB/s sustainable, 7 TB/s peak and "the highly
bursty checkpoint writes that saturate the storage fabric for short durations" (Sec 3.3.1); Megatron
`.bin`/`.idx` (preprocess_data.py L170-L177), `_MMapBinReader` with `numpy.memmap` (indexed_dataset.py
L392-L402), `optimal_dtype` uint16 below 65,500 (L114-L126), the S3 reader docstring L612-L618 and the
`assert not object_storage_config` / `assert not mmap` code L716-L724; index cache under
`path_prefix/cache/GPTDataset_indices`, rank 0 builds on a miss (gpt_dataset.py L505-L545); MegaScale Sec 4.4
(critical path, HDFS bandwidth the bottleneck, one worker per data-parallel group reads and broadcasts); the
992 files of about 1.7 GB; S3 3,500/5,500 per partitioned prefix, gradual scaling, 503 Slow Down;
`S3MapDataset` lists every object at first access (README L74-L79); FSx SSD 125/250/500/1,000 MBps per TiB,
burst read credits, PERSISTENT-1000 lists no disk burst, lower of network and disk for writes and uncached
reads; persistent replaces a failed server within minutes while requests retry, scratch gives "an immediate
I/O error"; EFA on Persistent 2 with a metadata configuration, chosen at creation, same AZ, Nitro v4 or later
excluding trn2; lazy load on first access, preload in parallel; no backups when linked to S3; Express One Zone
200,000 reads and 100,000 writes per directory bucket by default, more through AWS Support, 99.95% within one
AZ; connector README L7-L15 ("without first saving to local storage") and L327-L350; `S3StorageWriter`
subclasses `FileSystemWriter` with `thread_count: int = 1` (L271-L303); `class FileSystemWriter(_FileSystemWriter,
BlockingAsyncStager)` (filesystem.py L973); Mountpoint L3, L8, L20-L21, L84-L85; AWS recommends FSx for Lustre
for full POSIX (S3 Mountpoint guide); instance store data does not persist on stop, hibernate or terminate;
2,048 GiB on p5.48xlarge; tiered checkpointing CPU memory primary tier, replication to adjacent nodes, S3 as a
persistent tier; FSx $0.600 per GB-month (offer 20260911124432); every derived number listed above.

Prose: no em-dash, en-dash range, curly quote or banned word; acronyms S3, FSx (product name, glossary
"Amazon FSx"), NVMe, FLOPs, EC2, MFU, BF16, TFLOPS, EFA, DCP, POSIX expanded at first use in reading order;
no register ID printed; no changelog voice.

**Gate 3 score: 8/10.** Every derived number recomputes and every vendor figure matches its page; the
corrections were two citation line ranges, a missing unit, three scope words (bucket, family, stalled) and a
stale venue, none of which moved a number the reader acts on.

## SlurmFamily.tsx (section 24, The Slurm Family)

About 62 claim lines plus the fee arithmetic checked. Non-CONFIRMED: WRONG 1, OVERREACH 4, prose 1 (acronym
order). Pages read: Slurm 26.05 `slurm.conf` and `sbatch`; ParallelCluster what-is and support policy, plus three
more guide pages for the banner (install-v3, slurm-workload-manager-v3, troubleshooting-v3: all five carry it);
DLAMI Base OSS GPU AMI release 20261027; PCS slurm-versions, custom AMI, PCS-ready DLAMI, sample-AMI release notes,
cluster size, Capacity Blocks, custom cluster settings, Slurm reboot, reboot FAQ, instance replaced after reboot,
`toc-contents.json` (206 titles, none with "health"), pricing page; HyperPod Slurm overview, auto-resume, deep
health checks, cluster health check, health monitoring agent, EKS deep health checks, multi-head, Slurm FAQ;
training plans; EC2 Capacity Blocks; the three What's New posts (Jun 18, Jul 13, Apr 23 2026); SageMaker pricing
example #16.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | "SchedMD ships a Slurm major every six months and PCS supports each for about 18 months ..., 13.5 to 14.7 months after it reaches PCS ..., so a PCS cluster takes a major upgrade about once a year" | SlurmFamily.tsx:858-860 | OVERREACH (derived arithmetic printed as the page's statement) | PCS Slurm versions page states only "releases a new major version at regular intervals" and the dates: 25.05 5/29/2025, 10/16/2025, 11/30/2026; 25.11 11/6/2025, 4/9/2026, 5/31/2027; 26.05 5/26/2026, 9/10/2026, 11/30/2027 (18.0 to 18.8 months; 13.5, 13.7, 14.7 months) | labelled "our arithmetic from the page's dates" |
| 2 | Custom AMI "must carry the PCS agent and a compatible Slurm, installed with AWS's installers" | SlurmFamily.tsx:834-838 | OVERREACH | PCS custom AMI page: "You must use AWS-provided installers to install the AWS PCS software ... We recommend you use AWS-provided installers to install Slurm ... but you can install Slurm on your own" | agent "installed with AWS's installer" (required); Slurm installer "recommended" |
| 3 | HyperPod "billed for as long as the cluster exists, idle included", cited to pricing example 16 | SlurmFamily.tsx:1080-1084 | OVERREACH (inference presented as the example's statement) | SageMaker pricing, example #16: a 4-instance cluster provisioned for 30 days is billed 720 hours x 4 x $10.18; the example says nothing about idle time | "billed for every hour the cluster is provisioned, idle or busy, our reading of pricing example 16" |
| 4 | PCS fee "to run the controller" | SlurmFamily.tsx:1101-1103 | OVERREACH (attribution of the fee) | PCS price list: $0.5825 per controller-hour and $0.64 per advanced instance-hour; 0.5825 x 720 = $419 against 0.64 x 32 x 720 = $14,746 of the $15,165 (our arithmetic) | "almost all of it the per-instance node-management fee, to run the controller and its node groups" |
| 5 | "a P6e-GB200 UltraServer block's instances must be stopped at least 60 minutes before its end" | SlurmFamily.tsx:1131-1133 | WRONG (stop for terminate) | EC2 Capacity Blocks: "For P6e-GB200 UltraServer Capacity Blocks, you must terminate your instances at least 60 minutes before the Capacity Block end time" | "must be terminated" |
| 6 | AMI and DLAMI first appear unexpanded in diagram 1 (cells and title), ahead of the prose expansion | SlurmFamily.tsx:174, :194, :205 against :753 | prose (acronym order) | Acronym Standard: first occurrence in reading order | expanded "AMI (Amazon Machine Image)" and "DLAMI (Deep Learning AMI)" in the sentence that introduces the diagram; the later sentence keeps the short forms |
| 7 | Known cross-check: PCS node replacement (fc08's section 20 item) | SlurmFamily.tsx:884-900 | CONFIRMED | PCS reboot page: "Other reboot methods (Amazon EC2 console, AWS CLI, automated patches, or system maintenance) cause AWS PCS to consider the EC2 instance unhealthy and replace it"; reboot FAQ: nextstate=DOWN "will be marked as unhealthy after reboot and trigger instance replacement"; drain and requeue with `scontrol reboot ASAP` then `scontrol requeue` | none; section 20's cell is fc08's |
| 8 | U06-1 hedge: "more than 16 nodes" quoted against the auto-resume page and FAQ | SlurmFamily.tsx:1013-1028 | CONFIRMED | HyperPod Slurm overview: "after faulty nodes are replaced with healthy ones in clusters with more than 16 nodes"; auto-resume page quote matches; neither it nor the FAQ states a node count (grep) | hedge kept |
| 9 | Spare-node reading (resume waits for deep checks only when no other node is free) | SlurmFamily.tsx:1030-1039 | CONFIRMED, labelled ours | deep health checks page, "Auto-resume behavior with deep health checks": the job "can be scheduled on any other available node in the cluster. The job only waits if no other nodes are available" | label kept |

CONFIRMED (count about 53), among them: slurmd registers with slurmctld (slurm.conf "before it registers with
the slurmctld daemon"); one `--nodes` value is minimum and maximum; `--requeue` reruns the batch script "from its
beginning with the same job ID", JobRequeue sets the default; HealthCheckProgram as root on nodes not
NOT_RESPONDING, HealthCheckInterval default zero disables, must exist on every compute node, acts only by its own
commands, killed after HealthCheckTimeout, default 60; the 70B sbatch (L6, L10, L18 GPUS_PER_NODE=8, L67-L73 c10d,
L91-L97 checkpoint_freq 1000, max_steps 30, resume from ./checkpoints, L104-L109 /opt/sagemaker_cluster);
health-check suite README L1-L5 and its file list (DCGM level 4, multi-node NCCL all_reduce, EFA loopback, Slurm
prolog, sbatch wrappers); DLAMI 20261027 with nvidia_driver 595.112.07 and efa_version 1.51.0; ParallelCluster
charges nothing itself, 3.16.x to 02/20/2028, banner on all five pages sampled; PCS patches the controller
automatically, EOL rules, 25.05 EOL 11/30/2026; PCS-ready DLAMI on Ubuntu 24.04 with agent and several Slurm
versions, no ML framework; no Neuron AMI on the sample-AMI or PCS-ready DLAMI pages (zero matches); Small 32,
Medium 512, Large 2,048, size fixed at creation; supported settings include HealthCheckProgram,
HealthCheckInterval, HealthCheckNodeState, JobRequeue, Prolog, Epilog, and no HealthCheckTimeout (our reading
kept); Capacity Blocks one per node group, instances terminated at expiry, queued jobs pending; PCS P6e support
with the topology plugin (What's New Jun 18, 2026); HyperPod DLAMI with lifecycle scripts; custom AMIs on
HyperPod's base AMI (Jul 13, 2026); backup controllers take over; the six agent-managed slurm.conf parameters and
"We strongly recommend that you DON'T change these parameters"; HMA same checks on both orchestrators; HMA
check list; agent on Slurm since September 11, 2025 with an AMI update; InstanceStress, InstanceConnectivity,
~45-90, ~2-5 and ~5-15 minutes, maintenance reservation, failed node replaced and re-checked, GPU only;
Trainium deep checks on the EKS page only; automatic recovery default, drain on fault and replace when jobs
exit, `--auto-resume=1` restarts after replacement, nodes always replaced under auto-resume, jobs without it
exit; the three-line script; exclusive allocation and one srun, `$SLURM_JOB_NODELIST` may be outdated, GRES
nodes requeue from the beginning, auto-resume on a non-zero step exit; training plan on HyperPod one hour;
Capacity Block termination 11:00 UTC on the final day, end 11:30; all prices and fee arithmetic. Sibling links:
EFA dive section 7 is "The EC2 Instance Topology API" (efa/src/App.tsx).

Prose: no em-dash, en-dash range, curly quote or banned word. Acronyms in reading order after the fix: EC2, PCS,
FSDP, AMI, DLAMI, EFA, HPC, EKS, DCGM, NCCL, GRES, UTC.

**Gate 3 score: 8/10.** Prices, fee arithmetic, health-check timings and the auto-resume behaviour all match
first-party pages; the corrections were one wrong verb (stopped for terminated) and four places where our
reading or arithmetic was not marked as ours, now labelled.

## KubernetesFamily.tsx (section 25, The Kubernetes Family)

About 71 claim lines plus every derived number checked. Non-CONFIRMED: OVERREACH 1, plus 4 prose fixes
(acronyms). Pages read: EKS User Guide `ml-compute-management`, `ml-node-groups`, `ml-validate-gpu-node-repair`,
`ml-workload-topology`, `device-management-neuron`, `ml-eks-optimized-ami`, `kubernetes-versions`; EKS Best
Practices (AI/ML compute); EKS price list; AWS Batch `eks`, `multi-node-parallel-jobs`, MNP run, EFA, shared
compute, pricing; SageMaker `sagemaker-hyperpod-eks`, task governance, training operator and its usage page,
elastic training, checkpointless training, checkpointless in-process recovery, checkpointless release notes,
HyperPod EKS AMI releases, node recovery; What's New posts for task governance (Dec 4, 2024), the training
operator (Jun 30, 2025), checkpointless training (Dec 3, 2025) and gang scheduling (Apr 8, 2026). Code: Kueue
README at 14b7928 (v0.20.4), Kubeflow Trainer README at 658725b (v2.3.0), JobSet README at v0.13.0, Megatron
`distributed_data_parallel_config.py` L38-L41 and `dist_optimizer.md` L14-L20 at core_v0.20.0, recipe
`checkpointless_llama3_70b_pretrain.yaml` at 2.0.11. Latest tags by anonymous `git ls-remote`: Kueue v0.20.4,
JobSet v0.13.0, Trainer v2.3.0, Volcano v1.16.0, so no pin is stale.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| 1 | Recovery tries in-process, then process-level, "and a job-level restart only for a catastrophic failure such as several nodes failing at once" | KubernetesFamily.tsx:1319-1322 | OVERREACH ("only" drops the page's own failure table) | in-process recovery page: the prose says job-level "only in the event of a catastrophic failure (e.g., multiple nodes fail at the same time)", while its table assigns Job Level Restart to "Permanent node/GPU hardware failure", which is the trigger diagram 2 already prints | "a job-level restart, with the failed node replaced, for a permanent node or GPU failure or a catastrophic one such as several nodes failing at once"; claims line updated |
| 2 | Known item: EBS not expanded | KubernetesFamily.tsx:1283 | prose (acronym) | first and only use | "EBS (Amazon Elastic Block Store) storage" |
| 3 | EKS expanded in the body after the h1 description uses it | KubernetesFamily.tsx:791, :809 | prose (acronym order) | the h1 description renders first | expansion moved into the h1 description |
| 4 | AMI, DRA and NCCL appear in diagram 1 chips and the container bar before their prose expansions | KubernetesFamily.tsx:245-266, :831-844, :912 | prose (acronym order) | the diagram renders before the paragraphs that expanded them | expanded in the paragraph above the diagram; later expansions removed |
| 5 | HBM in the h2 title, never expanded | KubernetesFamily.tsx:1303 | prose (acronym) | first use | "HBM (high-bandwidth memory)" |

CONFIRMED (count about 66), among them: the default scheduler places pods one at a time, gang scheduling with
all-or-nothing admission recommended; `network-node-layer-1` to `-4`, bottom layer 3 or 4, layer 2 widens the
pool, best effort, guaranteed by a Capacity Block or cluster placement group; Auto Mode, Karpenter and node
groups, reserved capacity first; 30 minutes, the 40-minute drain for scheduled scaling on managed node groups,
custom launch template, subnet in the block's AZ; node repair waits in the page's worked example (10 and 30
minutes), no drain before Karpenter v1.15.0, stops when too many nodes are unhealthy, Xid 79 injection;
AL2023 AMIs lack the NVIDIA device plugin, Bottlerocket includes it, EFA device plugin separate, the AMI carries
the EFA kernel module and rdma-core, CUDA from the container; Neuron DRA on 1.34 and later, groups of 1/4/8/16,
not on Auto Mode, EFA locality; consolidation, WhenEmpty with consolidateAfter 60m; $2.64192 Auto Mode
p5.48xlarge-hour, $0.10 per cluster-hour, $0.50 extended support; Batch overlay model, no operators, scale to
zero by default, MNP gang scheduling, 1,000 instances, one instance type, one pod per node, AMI and Kubernetes
updates the customer's, EFA in one cluster placement group, no Batch charge; HyperPod 1-to-1 mapping,
PyTorchJob auto-resume, automatic node recovery, health agent label, taint and condition, DCGM level 4, EFA and
NCCL deep checks, Neuron hardware and NCCOM tests; task governance lend, borrow and preempt, gang scheduling
pulls back a partly ready job; operator Kubernetes 1.28 to 1.33, Kueue v0.12.2 or v0.12.3, PyTorch 2.4.0 to
2.7.1, sample 3 restarts in 21,600 s then 1 job-level restart, the 300 s hang rule; HyperPod EKS AMI of
2026-10-16 for Kubernetes 1.31 to 1.36; EKS standard 1.34 to 1.37 and extended 1.31 to 1.33; elastic training
on operator v1.2 and above, "does not currently support checkpointless training"; checkpointless on operator
v1.2.0 or above with NeMo, v1.0.0 on 2025-12-03, v1.0.1 on 2026-04-10, NCCL 2.27.5 and aws-ofi-nccl 1.16.0;
`num_distributed_optimizer_instances` at least 2, "roughly the equivalent of one DCP checkpoint size"; Megatron
L38-L41 ("the factor by which the DP domain is sharded") and `6 + 12/d`; recipe L15 devices 8, L16 16 nodes,
L36 TP 8, L37 PP 4, L45 two optimizer instances, L97-L98, L112; What's New "upwards of 95% training goodput"
kept as a vendor claim; Kueue L19-L26 (quota for all Pods by default, TAS, fair sharing with borrowing and
optional preemption), L40 (PyTorchJob deprecated, migrate to TrainJob or JobSet), L108-L117 (production use,
`v1beta2`); Trainer L21-L24 (Kueue and Volcano for topology-aware scheduling), L61-L63, L102-L108, L104
("currently in alpha status, and APIs may change"); JobSet L19 (maximum restarts, whole set recreated, "When no
failure policy is specified, if any job fails, the JobSet simply fails"), L33-L35 (`v1alpha2`); every derived
number listed above.

Prose: no em-dash, en-dash range, curly quote or banned word. Acronyms in reading order after the fix: EKS,
EFA, AMI, DRA, NCCL, EC2, DCGM, Xid, DCP, FP32, TP, PP, DP, BF16, HBM, EBS (CUDA, GPU, API, SDK common).

**Gate 3 score: 9/10.** One scope word in the recovery ladder prose and five acronym-order fixes; every price,
version window, recipe line and memory figure matches its first-party source at the pinned refs.
