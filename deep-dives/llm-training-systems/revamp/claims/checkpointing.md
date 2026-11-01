# Claims: section 18, Checkpointing

File: `src/sections/Checkpointing.tsx`. Re-opened on 2026-10-31 (raw files at the pinned tags, fetched with no identifying headers): PyTorch v2.15.0 `state_dict_saver.py`, `staging.py`, `filesystem.py`, `distributed_c10d.py` and `docs/source/distributed.checkpoint.md`; TorchTitan v0.4.0 `checkpointer/dcp.py`, `checkpointer/base.py` and `training_engine.py`; Megatron Core core_v0.20.0 `arguments.py` and `config/training_config.py`; s3torchconnector v1.5.0 `s3client_config.py`, `dcp/s3_file_system.py`, `dcp/s3_prefix_strategy.py` and `README.md`; the AWS S3, S3 Express, FSx performance and HyperPod tiered-checkpointing pages. Wave 2 (`research/2026-10/wave2-reliability.md`) re-read on 2026-10-31 the FSx SSD and CreateFileSystem pages, the HyperPod setup page and What's New post, the PyPI 1.1.3 package, 2410.21680v2, 2407.21783v3, 2402.15627v1, the Gemini blog, metaseq `27_percent_update.md` and the EC2 accelerated-instance page, so those carry 2026-10-31. ByteCheckpoint 2407.20143v4 (Sec 2.1) and its NSDI 2025 venue were re-read by fc07 on 2026-10-31 and carry that date. Cited from the register without re-opening, with `accessed="2026-10-30"`: the AmazonFSx price file (T00-1), the EC2 price list, the Capacity Blocks page and the On-Demand quota page. Venues confirmed by fc07 on 2026-10-31: Revisiting Reliability is HPCA 2025 (HPCA 2025 main program page and Crossref 10.1109/HPCA61900.2025.00096, pp. 1259-1274), so its Cites carry venue="HPCA 2025"; MegaScale NSDI 2024 (USENIX proceedings page). ZeRO is SC 2020 (Crossref 10.1109/SC41405.2020.00024).

Every worked number on the page is computed at render time by `src/lib/checkpoint.ts` (Calculator D) and `src/lib/runtime.ts` (Calculator A); the values below were also checked by bundling the libraries with esbuild and running them under node. Reference job: Llama 3.1 70B, 70,553,706,496 parameters, 14 bytes per parameter, 32 p5.48xlarge (256 H100), r_f 6.50 per thousand node-days, u_0 600 s, step 17.523 s (Calculator A: 512 x 8,192 tokens, 989.5 TFLOPS, MFU 0.40, attention 'none').

Format: claim | source URL | register, wave 2 row or experiment

## Introduction (h1)

- 70B on 256 H100: about 2 hours between 60 s saves, 21.5 minutes between asynchronous saves that block 2 s | derived, Calculator D (`checkpointPlan`), formula https://arxiv.org/abs/2410.21680v2 Eq. 3 | 04 W3, W4-18, build-log "ETTR and intervals"
- A synchronous job stops when any node fails; every stop rolls back to the newest complete checkpoint | mental model, section 17 and https://arxiv.org/abs/2410.21680v2 Sec II-D | T04-9

## What a checkpoint holds

- Mixed-precision Adam keeps 16 bytes per parameter: 2 for the 16-bit weights (fp16 in the paper; BF16 is the same two bytes), 2 gradients, 12 optimizer state (FP32 master, two moments) | https://arxiv.org/abs/1910.02054v3 (Section 3.1; SC 2020 per Crossref 10.1109/SC41405.2020.00024) | T01-9
- TorchTitan's checkpoint manager names five states (model, optimizer, lr_scheduler, dataloader, train_state) plus optional ema; no gradient | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/base.py#L36-L41 | T04-23 (lines re-read 2026-10-31)
- 12 to 14 bytes per parameter (14 with BF16 weights beside the FP32 master, 12 when the master is the only weight copy) [our reading of T01-9's components] | https://arxiv.org/abs/1910.02054v3 | 04 W2, W4-16
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B | T01-3
- 70B checkpoint 987.75 GB at 14 bytes, 846.6 GB at 12; 3.86 GB per GPU on 256; 30.9 GB per instance [derived] | Calculator D `checkpointSize` | 04 W2, W4-16, W4-38
- OPT-175B downloaded 1.6 TB in 992 files of about 1.7 GB on each restart | https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/27_percent_update.md#L19 | T04-18, W4-31
- Llama 3's checkpoint ran from 1 MB to 4 GB per GPU | https://arxiv.org/abs/2407.21783v3 (Sec 3.3.1, "Storage") | T04-5, W4-31
- A checkpoint must also hold the data loader (with its token buffer), RNG state, global step and learning-rate scheduler | https://arxiv.org/abs/2407.20143v4 (Sec 2.1) | T04-35
- TorchTitan v0.4.0 saves model, optimizer, data loader, scheduler and train state (step count, tokens seen); no RNG state in its checkpoint manager | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/base.py#L36-L41, train state contents https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/training_engine.py#L884-L885 | T04-23

## How often to save

- Diagram: synchronous and asynchronous saves against one failure; schematic, no numbers, captioned "Illustrative, not measured" | mental model | T04-9, T04-20, T04-22
- dt* = sqrt(2 w_cp / (N_nodes r_f)); MTTF = 1 / (N_nodes r_f) | https://arxiv.org/abs/2410.21680v2 (Eq. 3) | T04-9, W4-17
- ETTR = productive runtime over wallclock; E[ETTR] ~ (1 - N_nodes r_f (u_0 + dt/2)) / (1 + w_cp/dt) for long, high-priority runs | https://arxiv.org/abs/2410.21680v2 (Sec II-D; Appendix A, Eq. 10) | T04-9, W4-17
- A save 30 times cheaper wants an interval about 5.5 times shorter (sqrt 30 = 5.48; 7,060 / 1,289 s) [derived] | Calculator D | 04 W3
- RSC-1 measured 6.50 failures per thousand node-days | https://arxiv.org/abs/2410.21680v2 (Sec III) | T04-8, W4-1
- Job MTTF 4.8 days for 32 nodes at 6.50 [derived] | Calculator D `jobMttfSeconds` | 04 W1, W4-2
- Meta's restart overhead u_0 about 5 to 20 minutes on its clusters | https://arxiv.org/abs/2410.21680v2 (Sec III, "Approximating E[ETTR] analytically") | T04-9, W4-19
- Step time 17.5 s from Calculator A at an assumed 40% MFU, 512 x 8,192 tokens | `src/lib/runtime.ts` `estimateRun`; MFU range https://arxiv.org/abs/2407.21783v3 (Table 4) | 04 W3, build-log "default MFU"
- Table: 256 GPUs, 60 s save: 2.0 h, 403 steps, ETTR 0.982 [derived] | Calculator D | 04 W3, W4-18
- Table: 256 GPUs, 2 s save: 21.5 min, 74 steps, ETTR 0.995 [derived] | Calculator D | 04 W3, W4-18, G9
- Table: 16,384 GPUs, 60 s: 14.7 min, 0.79; 2 s: 2.7 min, 0.88; 2 s with 5-minute restart: 2.7 min, 0.93 [derived] | Calculator D | 04 W3, W4-19
- Save design moves the interval by 5.5x and ETTR by about 1.4 points (0.982 against 0.995) [derived] | Calculator D | 04 W3 reading, W4-18
- Interval 1.2 h at RSC-1's worst month (17.5) and 3.3 h at RSC-2's 2.34 [derived]; rates from the paper | Calculator D; https://arxiv.org/abs/2410.21680v2 (Sec II-E, Sec III) | T04-8
- 16,384 GPUs: MTTF 1.8 h; a 10-minute restart alone caps ETTR near 0.91 [derived] | Calculator D; 04 W3 reading | 04 W3, W4-19
- 16K rows indicative: MTTF below the regime Meta checked against Monte Carlo (job MTTF about 0.1 day or more, within about 5%); intervals 2.7 to 14.7 min under three times the 10-minute restart, while Appendix A assumes dt much longer than u_0 | https://arxiv.org/abs/2410.21680v2 (Sec III; Appendix A) | W4-19, G5, orchestrator wording note
- 256-GPU asynchronous interval (21.5 min) is also under three restart times; the calculator flags it | Calculator D warning `intervalNotMuchLongerThanRestart` | G5
- Young (1974) and Daly (2006) not read (publisher access); formula cited through Meta, whose references name both | https://arxiv.org/abs/2410.21680v2 (Eq. 3 and references) | T04-10, U04-2 hedge
- Appendix A assumptions: dt >> u_0, w_cp, q and R >> u_0, q, dt_cp, w_cp | https://arxiv.org/abs/2410.21680v2 (Appendix A) | T04-9, W4-17
- Maximising Eq. 10 directly for 16K, 60 s: 783 s instead of 883 s, ETTR 0.787 instead of 0.786 [derived] | wave 2 arithmetic | G5
- Failure counting: jobs above 128 GPUs with NODE_FAIL, or FAILED with a critical health check in the last 10 minutes | https://arxiv.org/abs/2410.21680v2 (Sec III) | T04-8

## The storage a save needs

- Synchronous write rate = bytes / w_cp: 16.5 GB/s for 60 s; 0.51 GB/s, 4.1 Gbps per instance [derived] | Calculator D | 04 W2, W4-20
- Asynchronous: bytes over a drain budget no longer than the interval: 0.77 GB/s for 21.5 min [derived; budget inside one interval is our reading] | Calculator D | 04 W2, G9
- FSx for Lustre SSD disk throughput 125, 250, 500, 1,000 MBps per TiB by tier | https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html | T04-29, W4-21
- Writes run at the lower of network and disk throughput | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | T04-29
- 60 s save needs about 16 TiB at PERSISTENT-1000 (two significant digits) [derived] | Calculator D | W4-21, U04-7 hedge
- SSD capacity 1,200 GiB, 2,400 GiB, then increments of 2,400 GiB; file system 19,200 GiB (16,800 GiB if MB binary) [derived] | https://docs.aws.amazon.com/fsx/latest/APIReference/API_CreateFileSystem.html | W4-21, G6
- On the order of $10,000 to $12,000 a month at $0.600 per GB-month, us-east-1 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.json (offer 20260911124432) | T00-1, W4-21
- AWS does not define MB in bytes on the pages read; two significant digits | ssd-storage.html, performance.html | U04-7 (accept-as-hedge), G6
- Burst documented for reads; none listed for PERSISTENT-1000; size writes on baseline | https://docs.aws.amazon.com/fsx/latest/LustreGuide/ssd-storage.html | U04-7, G6
- Per-client ceilings 100 Gbps without EFA, 700 Gbps with EFA | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | T04-30, W4-34
- AWS recommends EFA above 10 GBps | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | T04-30, T05-36
- Uncached reads also run at the lower of network and disk throughput | https://docs.aws.amazon.com/fsx/latest/LustreGuide/performance.html | T04-29
- NEW derived: 1,200 GiB PERSISTENT-1000 gives about 1.2 GB/s and reads 988 GB in about 14 minutes; 19,200 GiB reads it in about 53 s [derived, two significant digits, MB = 10^6 B] | arithmetic from T04-29 and Calculator D's provisioned size | new, not in the register
- NEW derived: TorchTitan keeps the latest 10 checkpoints by default; about 9 TiB for 70B [derived] | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/base.py#L580 | T04-23, 04 W2
- S3 at least 3,500 PUT/s per partitioned prefix; scaling gradual with 503 Slow Down | https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html | T04-27, W4-35
- s3torchconnector v1.5.0 default part size 8 MiB | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/_s3client/s3client_config.py#L14-L26 | U04-8 closed, W4-22
- 117,750 part uploads, about 34 s at one prefix [derived; each part a PUT is our reading]. Calculator rounds up from exact bytes (117,750); the register's 117,749 uses the rounded 987.75 GB | Calculator D | W4-22, orchestrator note
- S3StorageWriter defaults to one I/O thread per rank | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/dcp/s3_file_system.py#L271-L303 | T04-26
- Default prefix `__{rank}_` sits under the shared path and does not spread writes over partitions [our reading] | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/s3torchconnector/src/s3torchconnector/dcp/s3_prefix_strategy.py#L25-L31 | T04-26
- Round-robin, binary and hexadecimal prefix strategies avoid 503 throttling | https://github.com/awslabs/s3-connector-for-pytorch/blob/v1.5.0/README.md#L197-L205 | T04-26
- S3 Express One Zone directory buckets up to 100,000 writes/s by default; about 1.2 s for the same parts [derived] | https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html | T04-28, W4-35

## Asynchronous and tiered saves in code

- DCP saves from all ranks in parallel, at least one file per rank, reshards at load | https://github.com/pytorch/pytorch/blob/v2.15.0/docs/source/distributed.checkpoint.md#L8-L14 | T04-19
- async_save stages to CPU memory, then saves in a background thread or process | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/state_dict_saver.py (docstring) | T04-20
- Bare async_save builds DefaultStager(StagingOptions(False, False, False, False)) | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/state_dict_saver.py#L306-L321 | T04-21, C04-2, W4-13
- StagingOptions defaults all four to True (doc side of the conflict) | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/staging.py#L104-L130 | T04-21, C04-2
- FileSystemWriter is a BlockingAsyncStager; S3StorageWriter extends it; every bare path blocks for the copy | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/filesystem.py#L973 | W4-13, G3
- E4: 4.03 GB state dict on one GB10: bare async_save blocked 35.86, 36.20, 8.81 s; dcp.save 4.35, 2.54, 2.60 s; pinned stager about a millisecond | https://github.com/cmanaha/tech-deep-dives/blob/b0194661bd4b1be854e3cbeaa0b53fa2dd7058b3/deep-dives/llm-training-systems/research/2026-10/E4-spark-checkpoint-staging.md | E4
- GB10 unified memory: timings do not transfer to H100; API behaviour does | E4 caveat | E4
- TorchTitan default mode `disabled` | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/dcp.py#L138 | T04-22
- `async` calls async_save with no stager; `async_with_pinned_mem` uses a separate process | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/dcp.py#L317-L338 | T04-22
- Pinned mode's DefaultStager turns all four options on | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/dcp.py#L453-L474 | T04-22
- Waits for staging at the next optimizer step | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/training_engine.py#L872-L876 | T04-22
- Megatron --async-save defaults to False (`async_save: bool = False`) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/training_config.py#L551-L552 | T04-38
- Megatron --async-save turned off with a rank-0 warning without --use-persistent-ckpt-worker | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/arguments.py#L1808-L1814 | T04-38, C04-4
- Docstring: async save only with torch_dist (doc side) | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/training_config.py#L551-L552 | T04-38
- Validation accepts torch_dcp and fsdp_dtensor with NVIDIA Resiliency Extension | https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/megatron/training/config/training_config.py#L692-L699 | T04-38
- Body summary: production systems land checkpoints first in host memory (own or peers') and take the remote-storage write off the critical path (own host memory and a background write: MegaScale; peers' memory with remote storage as backstop: Gemini) | https://arxiv.org/abs/2402.15627v1 (Sec 4.4), https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training | T04-14, T04-33
- Expandable "Two in-memory designs" (demoted by fc07 leverage pass): MegaScale: pinned host memory in several seconds (only critical-path part), background write to HDFS, one reader per DP group broadcasts at recovery | https://arxiv.org/abs/2402.15627v1 (Sec 4.4), NSDI 2024 | T04-14, W4-9, G8
- Expandable: Gemini (Rice University and AWS, SOSP 2023): copies into peers' memory in groups of typically two or three; remote storage the backstop; schedules traffic into idle gaps between collectives | https://www.amazon.science/blog/more-efficient-recovery-from-failures-during-large-ml-model-training | T04-33, T04-34, W4-39
- Expandable: Gemini authors report checkpointing every iteration and over 92% less lost time (vendor claim) | same blog | T04-33
- HyperPod managed tiered checkpointing GA 2025-09-08 on EKS | https://aws.amazon.com/about-aws/whats-new/2025/09/managed-tiered-checkpointing-amazon-sagemaker-hyperpod/ | T04-31, W4-14
- CPU memory primary tier, replicates to adjacent nodes, persists to S3 | https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing.html | T04-31, T06-15 (re-opened 2026-10-31)
- Opt-in; InstanceMemoryAllocationPercentage 20 to 100 | https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing-setup.html | T04-31
- p5.48xlarge 2,048 GiB host memory; 30.9 GB is 1.4%; 20% minimum holds about 14 copies [derived] | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-2, W4-38
- amzn-sagemaker-checkpointing 1.1.3 is a DCP storage plugin with no process-group code | https://pypi.org/project/amzn-sagemaker-checkpointing/1.1.3/ (sdist read by wave 2) | U04-4 closed, G1
- AWS example: NCCL-only process group, async_save with no stager (doc side) | https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing-setup.html (Step 3) | T04-32, C04-3, W4-15
- PyTorch v2.15.0 rejects a process group without a CPU backend | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/checkpoint/state_dict_saver.py#L299-L304 | T04-32, C04-3
- E4 reproduced the AssertionError with init_process_group("nccl") | E4 URL above | E4
- With a CPU backend added, the bare call blocks for the whole copy | E4; G1 | E4, G1
- No explicit backend registers only the detected accelerator's backend at v2.15.0 [code reading] | https://github.com/pytorch/pytorch/blob/v2.15.0/torch/distributed/distributed_c10d.py#L1056-L1066 | G2
- Example's state dict: model, optimizer, step, epoch only | https://docs.aws.amazon.com/sagemaker/latest/dg/managed-tier-checkpointing-setup.html (Step 3) | T04-32
- E4 conditions: one rank, cpu:gloo,cuda:nccl, 30 FP32 tensors, 4.03 GB, local NVMe, FileSystemWriter, three saves in one process; table of blocking/staged/total times; reference copies 28.09 s then 0.068 s pageable, 0.068 s pinned; host had about 68 of 121 GB in use | E4 URL above | E4
- A3 protocol (not yet run): dcp.save, bare and pinned async_save of 8B state (112 GB) to EFA-enabled FSx PERSISTENT-1000 4.8 TiB and S3 via s3torchconnector v1.5.0, two p5.48xlarge, about 2 hours | https://github.com/cmanaha/tech-deep-dives/blob/b0194661bd4b1be854e3cbeaa0b53fa2dd7058b3/deep-dives/llm-training-systems/RESEARCH-GUIDE.md (section 5) | A3, U04-9
- A3 prediction (our reading): dcp.save to FSx at least about 23 s at about 4.8 GB/s [derived] | arithmetic from T04-29 | A3
- A3 cost: 2 x 2 x $55.04 = $220 On-Demand; FSx 8 h about $32 to $35; shared 7-hour window $771 On-Demand or $2,292 Capacity Block at $47.757; quota starts at 0 vCPUs; Capacity Block binding price is the one quoted at purchase | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv; https://aws.amazon.com/ec2/capacityblocks/pricing/; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html; AmazonFSx price file | T05-20, T05-22, T05-31, T00-1, RESEARCH-GUIDE section 5

## Calculator D

- UI hosts `checkpointPlan`, `checkpointSize`, `checkpointBytesPerParameter` from `src/lib/checkpoint.ts`; no formula re-implemented; warnings come from the library | `src/lib/checkpoint.ts` | calculators-spec
- Presets: 70B on 256 H100 synchronous 60 s; asynchronous 2 s. Failure presets 2.34, 6.50, 17.5 | `src/lib/presets.ts` `FAILURE_RATES`; https://arxiv.org/abs/2410.21680v2 | T04-8
- Step-time default from Calculator A at 40% MFU, inside Llama 3's measured 38% to 43% | https://arxiv.org/abs/2407.21783v3 (Table 4) | build-log "default MFU"
- H100 dense BF16 peak 989.5 TFLOPS, half NVIDIA's "with sparsity" figure (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/ | T05 rows (as section 4)
- Blocking time an assumption; MegaScale's pinned copy takes several seconds | https://arxiv.org/abs/2402.15627v1 (Sec 4.4) | T04-14
- TorchTitan default interval 500 steps = 2.4 h at 17.5 s; near 403, almost 7 times 74 [derived] | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/components/checkpointer/base.py#L556 | T04-23, 04 W3

## Not shipped

- RSC-1 / RSC-2 are named but not expanded: no expansion located in the sources read.
- Section length is above the brief's 2,500-word aim once the three expandables (formula limits, E4 conditions, A3 protocol) are counted; the main body is near it.
