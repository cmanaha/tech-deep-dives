# Claims: section 31, Bring-Up: From One Node to the Full Run

File: `src/sections/BringUp.tsx`. Re-opened on 2026-10-31 (default accessed date): TorchTitan v0.4.0 `docs/debugging.md`, `README.md` and `torchtitan/models/common/flops.py`; nccl-tests v2.21.1 `doc/PERFORMANCE.md`; `aws-samples/awsome-distributed-training` at 3a1002576ccef26e66ba714303b10ccdaa645691 (`README.md`, `micro-benchmarks/nccl-tests/README.md`, `validation/gpu-cluster-healthcheck/README.md`); aws-ofi-nccl v1.21.1 `src/nccl_ofi_net.cpp`; libfabric v2.6.0 `man/fi_info.1.md`; the NCCL 2.32.3 environment-variable page; NVIDIA's Xid catalog; the EC2 On-Demand quota and Capacity Blocks pages; the SageMaker training plans page; the HyperPod Slurm and EKS deep-health-check pages and AMI release notes; the HyperPod checkpointless and SMP release notes; the EKS accelerated AMI page and amazon-eks-ami release v20261031; the PCS-ready DLAMI page; the Deep Learning Containers release v2.16-pt-ec2-2.10.0-tr-gpu-py313; and the EKS Best Practices AI/ML observability page. Register rows cited without re-opening carry `accessed="2026-10-30"`: the OPT-175B 27% logbook (metaseq), the DLAMI base release 20261027, the DLC PyTorch 2.14 build configuration, NeMo v2.7.3 Auto Configurator README, the Ultra-Scale Playbook, the NVIDIA H100 page and Understanding Stragglers (2505.05713v2). The p5.48xlarge NVLink, EFA-per-instance and EFA-per-GPU figures come from `src/lib/presets.ts` (`rankFacts(INSTANCES['p5.48xlarge'])`), the 40% MFU and 75% headroom from `DEFAULT_MFU` and `DEFAULT_HEADROOM`, and every tokens-per-second figure from `src/lib/runtime.ts` (`estimateRun`), all read at render time.

Format: claim | source URL | register, wave 2 row or experiment

## Introduction and the ladder

- Removing nodes that failed repeatedly cut the failure rate of Meta's jobs on 512 or more GPUs from 14% to 4% (h1 description, rung 2 h2 description, rung 2 body) | https://arxiv.org/abs/2410.21680v2 (Section IV-A) | T04-12
- Bring-up is the checks between holding accelerators and the long run; order them so each failure shows at the smallest scale that reveals it | (definition and framing) | our reading
- The ten-rung order, where each rung runs and what it catches (diagram, schematic) | (each rung's sources below) | our reading; T07-35, T07-36, T07-41

## Rungs 1 to 3: capacity, clean nodes and known versions

- The On-Demand quota for P and Trn instances is counted in vCPUs and defaults to 0 | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | T05-31; W6-21
- A Capacity Block for ML starts up to eight weeks ahead and sits outside the On-Demand quota (rung 1 and the closing paragraph) | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-26; T05-31; W6-21
- A SageMaker training plan is bookable up to 8 weeks ahead | https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html | T05-29; W6-21
- OPT-175B nodes came up with NCCL, InfiniBand or ECC faults, replacements were often the same bad machine, and the team added GPU burn-in and automated fabric tests | https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/27_percent_update.md#L12-L17 | T04-17; T07-35
- HyperPod deep health checks: DCGM level 4 about 45 to 90 minutes, EFA loopback about 2 to 5 minutes, multi-node NCCL all-reduce about 5 to 15 minutes; run on provisioning or addition for an instance group with `OnStartDeepHealthChecks`; a failing node is replaced and its replacement checked | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html | T06-5; T07-35; W6-22
- The Slurm deep-check page lists GPU instances only; Trainium deep checks are documented on HyperPod EKS | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | T06-5; U06-11 (EKS page re-opened 2026-10-31)
- AWS's sample health-check suite: a lightweight set of about 15 minutes for prologs and periodic sweeps, an intensive set of 1 to 3 hours (DCGM level 4, multi-node NCCL all-reduce, EFA loopback) that needs the node to itself | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/validation/gpu-cluster-healthcheck/README.md#L60-L98 | NEW (no register row)
- Meta found 40 repeat-failing nodes from historical health-check and job data | https://arxiv.org/abs/2410.21680v2 (Section IV-A) | T04-12
- A per-node record lets a self-run cluster do the same | (inference from T04-12) | our reading
- Section 20 shows which paths screen nodes; on SageMaker training jobs the pre-job check is opt-in | (section 20 health row; section 26, InfraCheckConfig) | wave2-aws G2 via sections 20 and 26
- On every AWS path read, the AMI supplies the EFA kernel driver and the container or customer supplies NCCL and aws-ofi-nccl; only container pages state an NCCL version; the DLAMI base also carries aws-ofi-nccl on the host | (the AWS pages in the expandable list below) | wave2-aws G1
- AWS's nccl-tests container pins EFA installer 1.50.0 (aws-ofi-nccl 1.21.1, libfabric 2.6.0amzn1.0) with NCCL 2.31.2-1, the release the aws-ofi-nccl 1.21.1 notes name as tested | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md#L36-L45 | NEW (no register row)
- Read the versions where the job runs | (G1 pages) | our reading; wave2-aws G1
- `NCCL_DEBUG=VERSION` prints the NCCL version at the start of the program | https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html | NEW (no register row)
- At `NCCL_DEBUG=INFO` aws-ofi-nccl logs "NET/OFI Initializing aws-ofi-nccl <version>" and the libfabric version it loaded, under the INIT subsystem that is on by default | https://github.com/aws/aws-ofi-nccl/blob/v1.21.1/src/nccl_ofi_net.cpp#L188-L195 (and the NCCL 2.32.3 env page for the `INIT,BOOTSTRAP,ENV` default) | NEW (no register row)
- `INFO` is the bring-up logging level | (section 30) | our reading, agrees with section 30
- `fi_info --version` displays libfabric's version information | https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_info.1.md#L89-L90 | NEW (no register row)
- The Deep Learning Containers' PyTorch 2.14 build configuration pins NCCL 2.30.7-1 and installs EFA installer `latest`, so record the image digest | https://github.com/aws/deep-learning-containers/blob/156076c639a310c6e86ddae64a6e1fce8a34087c/.github/config/image/pytorch/2.14-ec2-cuda.yml | T05-44; U05-6; wave2-aws G1
- HyperPod Slurm and EKS AMIs (entries of October 19 and 16, 2026): EFA installer 1.50.0, no NCCL or aws-ofi-nccl version in current entries | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html and https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-eks.html | wave2-aws G1
- EKS-optimized AL2023 accelerated AMI v20261031: `efa` 3.3.1, listed as EFA minimal (kernel module and rdma-core); NCCL not among its components | https://github.com/awslabs/amazon-eks-ami/releases/tag/v20261031 and https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html | wave2-aws G1; T05-45
- PCS-ready DLAMI is built on the Deep Learning Base GPU AMI and carries no AI or ML frameworks; the base's release 20261027 ships EFA installer 1.51.0 and aws-ofi-nccl 1.22.0 | https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html and https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html | wave2-aws G1; T06-33; T05-43
- HyperPod checkpointless training container v1.0.1: NCCL 2.27.5, aws-ofi-nccl 1.16.0, EFA 1.43.0 | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-eks-checkpointless-release-notes.html | wave2-aws G1; T06-14
- SMP v2.8.0 container: NCCL 2.23.4 | https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html | wave2-aws G1; T06-24; T06-25
- Deep Learning Containers PyTorch training release v2.16 (PyTorch 2.10) lists libnccl-ofi without a version and no EFA version | https://github.com/aws/deep-learning-containers/releases/tag/v2.16-pt-ec2-2.10.0-tr-gpu-py313 | wave2-aws G1; U05-6

## Rungs 4 and 5: the collective baseline and the memory check

- nccl-tests: read the largest message sizes, where time measures bandwidth rather than latency | https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md#L5-L12 | NEW (no register row)
- `busbw` is built to be held against the hardware peak whatever the rank count | https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md#L27-L29 | T02-60; T02-61
- The busbw formula assumes each rank has its own bandwidth to the outside world | https://github.com/NVIDIA/nccl-tests/blob/v2.21.1/doc/PERFORMANCE.md#L52 | wave2-parallelism orchestrator addendum
- One p5.48xlarge: hold busbw against 450 GB/s per GPU over NVLink | `src/lib/presets.ts` rankFacts (T05-2) | build-log "Cross-instance pricing"; T05-2
- Two p5.48xlarge: hold algbw x 2(M-1)/M against the instance's 400 GB/s EFA, since busbw counts 16 ranks | `src/lib/presets.ts` rankFacts; section 7 | build-log "Cross-instance pricing"; wave2-parallelism orchestrator addendum; our reading
- AWS's two-p5.48xlarge sample all-reduces 16 GiB in 66,132 microseconds, algbw 259.78 GB/s, busbw 487.09 GB/s, and states no NCCL or EFA version | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/micro-benchmarks/nccl-tests/README.md#L206-L243 | wave2-parallelism orchestrator addendum
- Read per instance that is about 260 GB/s, 65% of 400 GB/s; 66 ms against a 43 ms floor at full EFA rate | (derived in BringUp.tsx from the sample row and presets) | NEW (our arithmetic)
- The measured per-instance figure replaces 400 GB/s wherever sections 7 and 14 divide by it | (sections 7 and 14) | our reading
- An MoE all-to-all is addressed GPU to GPU and each GPU pays its 50 GB/s share | `src/lib/presets.ts` rankFacts; section 7 | build-log "Cross-instance pricing"
- On Trainium the counterpart is AWS's nccom-tests sample | https://github.com/aws-samples/awsome-distributed-training/blob/3a1002576ccef26e66ba714303b10ccdaa645691/README.md#L81-L102 | NEW (no register row)
- HyperPod EKS's deep checks include NCCOM tests | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html | NEW; closes U06-11's Trainium half
- A1 is a protocol in section 7, not yet run | (section 7) | build-log "AWS experiments"
- TorchTitan fake process-group mode: `NGPU` is the logical world size, no NCCL process groups, no peer data, one training step by default; `FAKE_PP_RANK` picks the pipeline stage | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/debugging.md#L35-L75 | U07-4 (narrowed); NEW detail
- Keep model, dtype, batch geometry, degrees, activation checkpointing, FSDP policy and CUDA-graph settings identical to the intended job | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/debugging.md#L104-L125 | U07-4
- Fake execution represents PyTorch-managed parameters, optimizer state, activations, gradients and pipeline buffers, not NCCL communicator allocations, network registration or collective scratch | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/debugging.md#L104-L125 (L121-L125) | U07-4
- A real distributed run is still required for communication, numerical and performance evidence | https://github.com/pytorch/torchtitan/blob/v0.4.0/docs/debugging.md#L18-L31 | U07-4
- Calculator B targets 75% of HBM by default; keep a margin for what fake mode cannot see | `src/lib/presets.ts` DEFAULT_HEADROOM | our reading; calculators-spec Calculator B
- A one-node smoke run of the scaled-down layout; our reading, a stated practice in one first-party quick start and not in the two AWS repositories read | (W6-33, U07-4) | W6-33; U07-4 (accept-as-hedge)
- TorchTitan's quick start trains a debug model on one GPU, then a real recipe on 8 GPUs, then multi-node with Slurm | https://github.com/pytorch/torchtitan/blob/v0.4.0/README.md#L68-L81 and #L246-L248 | U07-4

## Rungs 6 and 7: pick the layout by measurement

- Run Calculator C's two or three layouts as short jobs of a few hundred steps on the training cluster and keep the fastest | (section 14) | W6-34 ("a few hundred steps" our reading)
- NeMo 2.x's Auto Configurator ranked candidates by measured throughput from short jobs and warned some may fail on memory | https://github.com/NVIDIA/NeMo/blob/v2.7.3/examples/llm/auto_configurator/README.md | T02-54; T03-27; W6-34
- In the Ultra-Scale Playbook's sweep, which of TP or PP ran faster flipped as its authors optimised each | https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc | T02-58; W6-34
- If a short job cannot hold the whole cluster, run on part with TP, PP and CP unchanged and recheck fake-mode memory, since a smaller FSDP degree raises memory per rank | (sections 5 and 8) | our reading
- H100 dense BF16 peak 989.5 TFLOPS, half NVIDIA's listed sparse figure | https://www.nvidia.com/en-us/data-center/h100/ | T01-27; T05-14; T02-69
- At 40% MFU, 6N with every parameter and no attention: about 8,200 tokens per second (8B) and 935 (70B) per H100 | `src/lib/runtime.ts` estimateRun | W6-9; W6-35; build-log "The default MFU"
- TorchTitan's MFU column counts attention and leaves out the embedding table | https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/common/flops.py#L20-L51 and #L84-L144 | W6-9; W6-35
- By TorchTitan's count at 8,192 tokens, 40% is about 6,800 (8B) and 820 (70B) | `src/lib/runtime.ts` estimateRun | W6-9; build-log "The default MFU"
- 40% is a labelled assumption inside Llama 3 405B's measured 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Table 4) | T01-6; build-log "The default MFU"
- No first-party MFU for dense Llama-class training on H200 or Trainium2 was located | (research scope) | U01-5; build-log "The default MFU"

## Rungs 8 to 10: restart, scale out, alert

- A checkpoint round trip as a rung, with pass conditions from sections 18 and 19 (loss continuity, data-loader position, blocking and restart times into Calculator D) | (sections 18 and 19) | our reading
- Grow to full world size in steps, comparing per-rank step time and data-loading share | (section 29) | our reading; T07-41
- An all-reduce of S bytes across M instances sends at least 2(M-1)/M x S per instance: S at two, under 2S at any size; latency grows with rank count | (section 7's count) | build-log "Cross-instance pricing"; T02-60; T02-62; our arithmetic
- Stragglers cost 10.4% of allocated GPU-hours in ByteDance's trace of large jobs | https://arxiv.org/abs/2505.05713v2 (Sections 3.1 and 4.1) | T04-47
- The EKS Best Practices Guide flags data loading above 20% of training time | https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html | T07-41
- Alert on any Xid whose immediate bucket in NVIDIA's catalog is RESET_GPU, RESTART_BM or a WORKFLOW_ bucket; the rule is our reading | https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html | build-log "Xid alert rule"; T07-25
- Switch on section 29's alerts and section 30's default-off signals, and check each on a short test job before the long run | (sections 29 and 30) | our reading; agrees with section 30's "step 10 of section 31"

## Your bring-up checklist

- The ten checklist items restate rungs 1 to 10 and their pass sections | (rows above) | as above
- A Capacity Block can be booked up to eight weeks ahead | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | T05-26
