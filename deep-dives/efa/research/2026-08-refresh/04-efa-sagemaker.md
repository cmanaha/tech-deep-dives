# EFA + Amazon SageMaker AI — Research Report

**Research date / accessed:** 2026-08-01
**Scope:** How EFA integrates with SageMaker Training Jobs, SageMaker HyperPod (Slurm + EKS), SMDDP, SageMaker Model Parallel, and SageMaker inference.
**Author note:** Every fact below carries a URL and a tier. Where sources are silent the entry says `UNKNOWN`. Nothing is estimated.

## Tier legend

- **T1** — Official AWS documentation, AWS API reference, AWS "What's New" posts, official AWS source code (`aws/sagemaker-python-sdk`, `aws/deep-learning-containers`).
- **T2** — AWS blogs and re:Invent talks (first-party but not formal spec).
- **T3** — Third-party technical analysis. (None used as load-bearing fact in this report.)
- **T4** — Never cited as fact. (None.)

---

## 0. Baseline in the existing deep dive

Grep of `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/efa/` for `sagemaker` returns **7 lines total**:

| File | Line | Content |
|---|---|---|
| `sources.md` | 25 | Source #21 SageMaker Data Parallel Library (accessed 2026-03-22) |
| `sources.md` | 26 | Source #22 SageMaker Expert Parallelism (accessed 2026-03-22) |
| `src/sections/Sources.tsx` | 17-18 | Same two sources registered |
| `src/sections/Sources.tsx` | 187 | Glossary entry: SMDDP |
| `src/sections/DecisionGuide.tsx` | 313-316 | One `Alert type="info"` block |

There is **no SageMaker section**. Coverage is effectively zero.

### Correction needed in existing content (`DecisionGuide.tsx` lines 312-317)

Current text:

> **For startups on SageMaker:** SageMaker Training automatically configures EFA, placement groups, and NCCL when you select EFA-capable instances. The SMDDP (SageMaker Distributed Data Parallel) library optimizes AllGather with a mesh topology that reduces GPU SM usage from 24 to under 9 — freeing compute for your model.

Findings against that text:

1. **"placement groups"** — **UNVERIFIED**. No AWS source found states SageMaker Training uses EC2 placement groups for training jobs. The nearest T1 statement is different and weaker: "SageMaker AI still launches all instances for a given job within a single subnet (a single Availability Zone) to keep them physically close and minimize inter-node latency." ([T1] https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html, accessed 2026-08-01). Recommend deleting "placement groups" or replacing with the single-subnet/single-AZ claim.
2. **"automatically configures EFA ... and NCCL"** — **PARTLY TRUE, needs qualification**. True for AWS-managed DLCs launched via the SDK launchers, and only for instance types on a hardcoded allowlist (Section 2.3). Not true for bring-your-own containers, where you install the whole stack yourself (Section 2.1).
3. **"SMDDP ... reduces GPU SM usage from 24 to under 9"** — **VERIFIED but scoped**. T1 states NCCL takes up to 24 SMs and SMDDP fewer than 9, explicitly on P4d/P4de A100s (108 SMs each) ([T1] https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html, accessed 2026-08-01). The claim currently sits in a paragraph about "Stage 4: Scale ... P5/Trn2", where SMDDP is not supported at all (Section 4). This is the single most misleading sentence in the current deep dive.

---

## 1. Executive summary

**Verified facts in this report: 72** (enumerated inline; each carries URL + tier + accessed date).

Three headline findings:

1. **EFA on SageMaker Training Jobs is neither "opt-in" nor "automatic" in the way people assume. It is implicit-by-instance-type in the API and allowlist-gated in the SDK.** The `CreateTrainingJob` API has **no EFA parameter at all**. Whether NCCL actually rides EFA depends on (a) the container carrying libfabric + aws-ofi-nccl, and (b) a hardcoded instance-type allowlist inside the SageMaker Python SDK container drivers that has not been updated for P5e, P5en, P6-B200, P6-B300, P6e-GB200, or Trn2.

2. **SMDDP is a legacy library. It supports only P3dn, P4d, and P4de. It does not support P5 or anything newer, and it has not shipped a release since October 2024.** Anyone reading "SMDDP is the AWS-optimized collective library" and reaching for it on P5/P6 will find it does not apply. On modern instances the answer is plain NCCL over aws-ofi-nccl over EFA.

3. **Negative result: EFA is not exposed for SageMaker AI managed real-time inference endpoints.** No EFA field exists on `ProductionVariant` or `InferenceComponent`, and no AWS documentation describes cross-instance collective communication for managed endpoints. Multi-node, EFA-backed inference on SageMaker exists **only** on HyperPod (EKS orchestration) via the HyperPod Inference Operator's Disaggregated Prefill and Decode feature.

---

## 2. SageMaker Training Jobs

### 2.1 The bring-your-own-container path (what the docs actually document)

The canonical page is titled "Run Training with EFA" and is written entirely from the perspective of **adding EFA to your own container**.

- **[T1]** "SageMaker AI provides integration with EFA devices to accelerate High Performance Computing (HPC) and machine learning applications... You can add EFA integration to an existing Docker container that you bring to SageMaker AI." — https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-training-efa.html (accessed 2026-08-01)
- **[T1]** "Your container must download and install the EFA software... Any tools like MPI and NCCL must be installed and managed inside the container to be used as part of your EFA-enabled training job." — same URL.
- **[T1]** The documented Dockerfile installs EFA with `./efa_installer.sh -y --skip-kmod -g`, then builds NCCL from source and `aws-ofi-nccl` with `--with-libfabric=/opt/amazon/efa --with-mpi=/opt/amazon/openmpi --with-cuda=/usr/local/cuda`. The doc's example pins are stale: `NCCL_VERSION=2.7.8`, `EFA_VERSION=1.30.0`, `BRANCH_OFI=1.1.1`. — same URL.
- **[T1]** "When using PyTorch with EFA on your container, the NCCL version of your container should match the NCCL version of your PyTorch installation. To verify the PyTorch NCCL version, use `torch.cuda.nccl.version()`." — same URL.
- **[T1]** Device exposure: "The EFA device is mounted to the container as `/dev/infiniband/uverbs0`... On P4d instances, the container has access to 4 EFA devices: `/dev/infiniband/uverbs0` through `uverbs3`." — same URL.
- **[T1]** Traffic split: "Your container handles regular TCP traffic among peers through the default Elastic Network Interfaces (ENI), while handling OFI (kernel bypass) traffic through the EFA device." — same URL.

> **Gotcha:** This doc still names `ModelTrainer` for job submission but its EFA/NCCL/OFI version pins date to roughly 2023. Do not reproduce those pins in the deep dive; use the DLC pins in Section 3 instead.

**UNKNOWN:** The doc does not enumerate how many EFA devices are exposed on P5, P5e, P5en, P6, or Trn2 training instances. Only the P4d count (4) is stated. Do not extrapolate.

### 2.2 The managed-DLC path

- **[T1]** "When you create a ModelTrainer object, the object sets up distributed training infrastructure, runs the `CreateTrainingJob` API in the backend, finds the Region where your current session is running, and pulls one of the pre-built AWS deep learning container prepackaged with a number of libraries including deep learning frameworks, distributed training frameworks, and **the EFA driver**." — https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training-get-started.html (accessed 2026-08-01)
- **[T1]** "To reduce communication overhead, make sure that you configure instances, VPC subnet, and data storage in the same AWS Region and Availability Zone." — same URL.
- **[T1]** Doc staleness signal worth calling out: as of 2026-08-01 this same page still says "to achieve the most performant distributed training job in SageMaker AI, we recommend P4d and P4de instances equipped with NVIDIA A100 GPUs." — same URL. That recommendation is two-plus GPU generations behind the instance types the training API accepts (Section 2.4).

### 2.3 The instance-type allowlist (the most important gotcha in this whole report)

The SageMaker Python SDK ships container-side driver scripts that set the EFA environment variables at job launch. These use a **hardcoded allowlist**, not a capability query.

**[T1]** `aws/sagemaker-python-sdk`, `sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py` (branch `master`, retrieved 2026-08-01 via GitHub API):

```python
SM_EFA_NCCL_INSTANCES = [
    "ml.g4dn.8xlarge",
    "ml.g4dn.12xlarge",
    "ml.g5.48xlarge",
    "ml.p3dn.24xlarge",
    "ml.p4d.24xlarge",
    "ml.p4de.24xlarge",
    "ml.p5.48xlarge",
    "ml.trn1.32xlarge",
]

SM_EFA_RDMA_INSTANCES = [
    "ml.p4d.24xlarge",
    "ml.p4de.24xlarge",
    "ml.trn1.32xlarge",
]
```

(The identical constants appear in `sagemaker-core/src/sagemaker/core/modules/train/container_drivers/common/utils.py` and in both `remote_function/runtime_environment/bootstrap_runtime_environment.py` copies.)

**[T1]** `sagemaker-train/src/sagemaker/train/container_drivers/distributed_drivers/torchrun_driver.py` — the `torchrun` path:

```python
def setup_env():
    """Setup the environment variables for PyTorch distributed training"""
    instance_type = os.environ["SM_CURRENT_INSTANCE_TYPE"]
    network_interface_name = os.environ.get("SM_NETWORK_INTERFACE_NAME", "eth0")
    if instance_type in SM_EFA_NCCL_INSTANCES:
        # Enable EFA use
        os.environ["FI_PROVIDER"] = "efa"
    if instance_type in SM_EFA_RDMA_INSTANCES:
        # Use EFA's RDMA functionality for one-sided and two-sided transfer
        os.environ["FI_EFA_USE_DEVICE_RDMA"] = "1"
        os.environ["RDMAV_FORK_SAFE"] = "1"
    os.environ["NCCL_SOCKET_IFNAME"] = str(network_interface_name)
    os.environ["NCCL_PROTO"] = "simple"
```

**[T1]** `sagemaker-train/src/sagemaker/train/container_drivers/distributed_drivers/mpi_utils.py` — the `mpirun` path builds the same settings as `-x` flags:

```python
    instance_type = os.environ["SM_CURRENT_INSTANCE_TYPE"]
    # EFA settings
    if instance_type in SM_EFA_NCCL_INSTANCES:
        mpirun_command.extend(["-x", "FI_PROVIDER=efa"])
        # Use simple protocol to handle the out-of-order data delivery from EFA
        mpirun_command.extend(["-x", "NCCL_PROTO=simple"])

    if instance_type in SM_EFA_RDMA_INSTANCES:
        # Use EFA's RDMA functionality for one-sided and two-sided transfer
        mpirun_command.extend(["-x", "FI_EFA_USE_DEVICE_RDMA=1"])
```

**What this means, stated carefully:**

- **Verified:** On `ml.p5e.48xlarge`, `ml.p5en.48xlarge`, `ml.p6-b200.48xlarge`, `ml.p6-b300.48xlarge`, `ml.p6e-gb200.36xlarge`, `ml.trn2.48xlarge`, `ml.g6e.*`, and `ml.g7e.*`, these SDK driver scripts do **not** set `FI_PROVIDER=efa`, do **not** set `FI_EFA_USE_DEVICE_RDMA=1`, and do **not** set `RDMAV_FORK_SAFE=1`. All of these instance types are accepted by `ResourceConfig` (Section 2.4).
- **Verified:** Even on P5.48xlarge, `FI_EFA_USE_DEVICE_RDMA=1` is not set, because P5 is absent from `SM_EFA_RDMA_INSTANCES`. Contrast with the DLC's own EFA test harness, which explicitly does set it for P5 (Section 3.3).
- **[SPECULATIVE, flag as such if used]** Whether an unset `FI_PROVIDER` degrades to TCP depends on libfabric's own provider selection, which normally picks `efa` when the device and `aws-ofi-nccl` are present. The report does not assert silent TCP fallback as fact. What can be asserted as fact is that the explicit, documented, AWS-recommended settings are not applied on those instance types by the SDK.

**Verification instruction for the deep dive:** do not trust the launcher. Grep the job's CloudWatch log for the strings in Section 3.3.

### 2.4 API surface: there is no EFA knob (negative result)

**[T1]** `ResourceConfig` (the `CreateTrainingJob` compute block) has exactly these members: `InstanceCount`, `InstanceGroups`, `InstancePlacementConfig`, `InstanceType`, `KeepAlivePeriodInSeconds`, `TrainingPlanArn`, `VolumeKmsKeyId`, `VolumeSizeInGB`. **No EFA field exists.** — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ResourceConfig.html (accessed 2026-08-01)

**[T1]** `InstancePlacementConfig` is documented as "Configuration for how training job instances are placed and allocated within UltraServers. **Only applicable for UltraServer capacity.**" — same URL. This is the only placement control on training jobs, and it is UltraServer-scoped. It is not an EC2 placement group.

**[T1]** `ResourceConfig.InstanceType` valid values include (EFA-relevant subset): `ml.p3dn.24xlarge`, `ml.p4d.24xlarge`, `ml.p4de.24xlarge`, `ml.p5.48xlarge`, `ml.p5e.48xlarge`, `ml.p5en.48xlarge`, `ml.p5.4xlarge`, `ml.p6-b200.48xlarge`, `ml.p6-b300.48xlarge`, `ml.p6e-gb200.36xlarge`, `ml.trn1.32xlarge`, `ml.trn1n.32xlarge`, `ml.trn2.48xlarge`, `ml.g5.48xlarge`, `ml.g6.48xlarge`, `ml.g6e.48xlarge`, `ml.g7e.48xlarge`, `ml.c5n.18xlarge`. — same URL.

> **Framing for the deep dive:** EFA on SageMaker Training is *implicit-by-instance-type at the infrastructure layer* and *allowlist-gated at the software layer*. There is no "enable EFA: true". That asymmetry is the whole story.

### 2.5 Required environment variables

**[T2]** AWS ML blog "Training large language models on Amazon SageMaker: Best practices" lists what you set in your own container:

- `FI_PROVIDER="efa"` — specifies the fabric interface provider
- `NCCL_PROTO=simple` — "currently, the EFA provider doesn't support LL protocols; enabling them could lead to data corruption"
- `FI_EFA_USE_DEVICE_RDMA=1` — "uses the device's RDMA functionality for one-sided and two-sided transfer"
- `NCCL_LAUNCH_MODE="PARALLEL"`
- `NCCL_NET_SHARED_COMMS="0"`

— https://aws.amazon.com/blogs/machine-learning/training-large-language-models-on-amazon-sagemaker-best-practices/ (accessed 2026-08-01)

**[T2]** Same source: "In our experience, using EFA is a requirement to get satisfactory multi-node LLM training performance."

**CONTRADICTION (worth showing in the deep dive):** The blog [T2] recommends `NCCL_LAUNCH_MODE=PARALLEL` and `NCCL_NET_SHARED_COMMS=0`. The SDK's own driver code [T1] sets **neither**. The SDK sets only `FI_PROVIDER`, `FI_EFA_USE_DEVICE_RDMA`, `RDMAV_FORK_SAFE`, `NCCL_SOCKET_IFNAME`, `NCCL_PROTO`. Present both, labelled.

### 2.6 Resiliency on training jobs (fabric-adjacent)

- **[T2]** "Cluster health checks — Before your job starts, SageMaker runs GPU health checks and **verifies NCCL communication** on GPU instances, replacing any faulty instances if necessary... Health checks are currently enabled for P and G GPU-based instance types." — https://aws.amazon.com/blogs/machine-learning/training-large-language-models-on-amazon-sagemaker-best-practices/ (accessed 2026-08-01)
- **[T1]** "SageMaker AI will attempt to repair the cluster up to `10` times. If the cluster repair is successful, SageMaker AI will automatically restart the training job from the previous checkpoint... You are not billed for the cluster repair process. Cluster repairs will not initiate unless your training job fails." Status string surfaced: `Repairing training cluster due to hardware failure`. — https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html (accessed 2026-08-01)

**UNKNOWN:** Whether the pre-job NCCL verification specifically exercises the EFA path (versus falling back to TCP and still passing) is not stated by any source found. Do not assert.

---

## 3. What the Deep Learning Containers ship

All from `aws/deep-learning-containers` on GitHub, branch `main`, retrieved 2026-08-01 via the GitHub API. **[T1]** throughout.

### 3.1 Version pins

**Base image `docker/base/cu132/Dockerfile`:**

```dockerfile
ARG NCCL_VERSION="2.29.7-1"
# EFA installer 1.49.0 vends libfabric 2.4.0amzn5.0 and aws-ofi-nccl 1.20.0.
ARG EFA_VERSION="1.49.0"
ARG GDRCOPY_VERSION="2.6"
```

That comment is the single most useful line in the whole DLC repo for this deep dive: it states the EFA-installer-to-component mapping explicitly.

**PyTorch 2.13 SageMaker training image**, `.github/config/image/pytorch/2.13-sagemaker-cuda.yml`:

```yaml
  prod_image: "pytorch:2.13-cu133-amzn2023-sagemaker"
  cuda_version: "13.3.0"
  torch_version: "2.13.0"
  nccl_version: "2.30.7-1"
  efa_version: "1.49.0"
  gdrcopy_version: "2.6"
  deepspeed_version: "0.19.2"
  transformer_engine_version: "2.17.0"
```

The EC2 variant (`2.13-ec2-cuda.yml`) carries identical `nccl_version`, `efa_version`, and `gdrcopy_version`; only the build target (`sagemaker` vs `runtime`) and entrypoint differ. The SageMaker stage entrypoint is `["bash", "-m", "start_with_right_hostname.sh"]`; the EC2 stage uses `/usr/local/bin/entrypoint.sh`.

### 3.2 How the EFA stack is installed and wired

**`scripts/docker/common/install_efa_amzn2023.sh`:**

```bash
    ./efa_installer.sh -y --skip-kmod --skip-limit-conf --no-verify ${EFA_EXTRA_ARGS}
```

- `--skip-kmod` — the container does **not** install the EFA kernel module. It relies on the host. This is the structural reason an EFA container is portable but host-coupled.
- For EFA >= 1.48.0 the script adds `--disable-ngc`, with this comment: "EFA 1.48+ auto-detects NGC containers via `/opt/nvidia/nvidia_entrypoint.sh` (present in `nvidia/cuda:*-amzn2023` bases) and then skips the AL2023 `libnccl-ofi` RPM. Force the standard install with `--disable-ngc`." This is a real, non-obvious footgun for anyone building their own EFA container on an NGC base.
- The script writes container-wide NCCL defaults:

```bash
    echo NCCL_DEBUG=INFO >> /etc/nccl.conf
    echo NCCL_SOCKET_IFNAME=^docker0,lo >> /etc/nccl.conf
```

  Note it does **not** write `FI_PROVIDER`. That is set at launch time by the SDK driver (Section 2.3). The two layers are decoupled.
- The plugin path moved at EFA 1.44.0. The script's own check:

```bash
    if [[ "$EFA_VERSION" > "1.44.0" ]] || [[ "$EFA_VERSION" == "1.44.0" ]]; then
        OFI_LIB_DIR="/opt/amazon/ofi-nccl/lib64/"
        NCCL_NET_SO="$OFI_LIB_DIR/libnccl-net-ofi.so"
    else
        OFI_LIB_DIR="/opt/amazon/ofi-nccl/lib/${ARCH}-linux-gnu"
        NCCL_NET_SO="$OFI_LIB_DIR/libnccl-net.so"
    fi
```

  `libnccl-net.so` -> `libnccl-net-ofi.so` and `lib/<arch>-linux-gnu` -> `lib64`. Anyone with a hardcoded plugin path from an older build breaks silently on upgrade.
- It also installs OpenMPI wrappers (`mpirun` shim adding `--allow-run-as-root`), sets `hwloc_base_binding_policy = none` and `rmaps_base_mapping_policy = slot` in `openmpi-mca-params.conf`, and installs sshd with `StrictHostKeyChecking no` for multi-node.

**Runtime search paths (`docker/pytorch/Dockerfile.cuda`, both `runtime` and `sagemaker` stages):**

```dockerfile
ENV PATH="/opt/venv/bin:/opt/amazon/openmpi/bin:/opt/amazon/efa/bin:/usr/local/cuda/bin:${PATH}" \
  LD_LIBRARY_PATH=".../nvidia/nccl/lib:/opt/amazon/ofi-nccl/lib64:/opt/amazon/openmpi/lib:/opt/amazon/openmpi/lib64:/opt/amazon/efa/lib:/opt/amazon/efa/lib64:/usr/local/cuda/lib64:..."
```

**Also shipped:** `all_reduce_perf` from `NVIDIA/nccl-tests`, built into the image with the comment "used by CI EFA tests and available to customers for verifying EFA/NCCL connectivity before training." Useful, concrete, and citable.

One more DLC quirk worth a callout: the `cuda-runtime` base ships versioned `libcudart` but not the unversioned symlink, and "NCCL OFI plugin `dlopen()`s `libcudart.so` and fails without it" — so the Dockerfile creates the symlink explicitly.

### 3.3 How to verify EFA is actually being used (authoritative recipe)

Two independent T1 recipes.

**(a) From inside the container, device presence** — https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-training-efa.html (accessed 2026-08-01):

```
/opt/amazon/efa/bin/fi_info -p efa
```

Expected output includes `provider: efa`, `domain: efa_0-rdm`, `type: FI_EP_RDM`, `protocol: FI_PROTO_EFA`.

**(b) From the NCCL log, transport confirmation** — `aws/deep-learning-containers`, `test/efa/scripts/nccl_allreduce.sh` (accessed 2026-08-01). This is AWS's own gate, and it is the best "is EFA really on" checklist that exists:

```bash
validate_all_reduce_performance_logs(){
    grep "aws-ofi-nccl" ${TRAINING_LOG} || { echo "aws-ofi-nccl is not working"; exit 1; }
    grep -i "NET/OFI Selected provider is efa" ${TRAINING_LOG} || { echo "EFA provider not selected"; exit 1; }
    grep -E "Using network (AWS )?Libfabric" ${TRAINING_LOG} || { echo "Libfabric not active"; exit 1; }
    if [[ ${INSTANCE_TYPE} == p4d* || ${INSTANCE_TYPE} == p5* ]]; then
        grep "NCCL_TOPO_FILE set by environment to" ${TRAINING_LOG}
        grep -E "NET/(AWS )?Libfabric/0/GDRDMA" ${TRAINING_LOG}
    fi
}
```

So the four log signatures are:
1. `aws-ofi-nccl` present at all
2. `NET/OFI Selected provider is efa`
3. `Using network Libfabric` (or `Using network AWS Libfabric`)
4. `NET/Libfabric/0/GDRDMA` (or `NET/AWS Libfabric/0/GDRDMA`) — GPUDirect RDMA active, checked on P4d/P5

Plus a `NCCL_TOPO_FILE set by environment to` check on P4d/P5.

The same script's `mpirun` invocation is a clean reference for the full env set:

```bash
mpirun -x FI_PROVIDER="efa" -x FI_EFA_FORK_SAFE=1 -n $NODES -N $GPU_COUNT --hostfile $NUM_HOSTS_FILE \
    -x NCCL_DEBUG=INFO ${USE_DEVICE_RDMA_ARG} -x NCCL_PROTO=simple -x NCCL_ALGO=ring -x RDMAV_FORK_SAFE=1 \
    -x PATH -x LD_LIBRARY_PATH=... \
    -x NCCL_SOCKET_IFNAME=^lo --mca pml ^cm --mca btl tcp,self --mca btl_tcp_if_exclude lo,docker0 --bind-to none \
    /usr/local/bin/all_reduce_perf -b 8 -e 1G -f 2 -g 1 -c 1 -n 100
```

with

```bash
if [[ ${INSTANCE_TYPE} == p4d.24xlarge || ${INSTANCE_TYPE} == p4de.24xlarge || ${INSTANCE_TYPE} == p5.48xlarge ]]; then
    USE_DEVICE_RDMA_ARG="-x FI_EFA_USE_DEVICE_RDMA=1"
fi
```

**Note the inconsistency, and flag it in the deep dive:** the DLC test harness sets `FI_EFA_USE_DEVICE_RDMA=1` on **p5.48xlarge**; the SageMaker Python SDK's `SM_EFA_RDMA_INSTANCES` does **not** include P5. Two AWS-owned repos disagree about P5.

**Diagnostics the same script collects** (useful as a troubleshooting checklist): `nvidia-smi -L`, `ldconfig -p | grep libnccl`, `ldd /usr/local/bin/all_reduce_perf`, `fi_info -p efa`, `ls -la /opt/amazon/ofi-nccl/lib*/libnccl-net*.so`, `ls /etc/ld.so.conf.d/`.

**Performance gate:** the DLC CI asserts in-place algbw at the 1 GiB message size is `>= 3` GB/s across 2 nodes. (`PERFORMANCE_THRESHOLD="3"` in `nccl_allreduce.sh`.) This is a CI floor, not a performance target — say so if quoted.

**[T1]** The DLC EFA integration test runs on **2x p4d.24xlarge** (`test/efa/test_efa.py`: "Launches 2x p4d.24xlarge with EFA, runs NCCL all_reduce_perf across nodes, and verifies EFA transport is used (not sockets)"), and optionally exercises "NIXL's libfabric backend (packaging smoke test + multi-node disaggregated prefill/decode)" when `RUN_NIXL_TESTS=1`. Accessed 2026-08-01.

---

## 4. SMDDP (SageMaker Distributed Data Parallel) — the big negative result

### 4.1 Supported instance types

**[T1]** "The SMDDP library requires one of the following instance types."

| Instance type |
|---|
| `ml.p3dn.24xlarge`* |
| `ml.p4d.24xlarge` |
| `ml.p4de.24xlarge` |

"* The SMDDP library has discontinued support for optimizing its collective communication operations on P3 instances. While you can still utilize the SMDDP optimized `AllReduce` collective on `ml.p3dn.24xlarge` instances, there will be no further development support to enhance performance on this instance type. Note that the SMDDP optimized `AllGather` collective is **only available for P4 instances**."

— https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html (accessed 2026-08-01)

**[T1]** FAQ, stated independently: "The SMDDP library only supports GPU instances, more specifically, P4d and P4de instances with NVIDIA A100 GPUs and EFA." — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-faq.html (accessed 2026-08-01)

**[T1]** Confirmed a third time in the SDK source, `aws/sagemaker-python-sdk` `src/sagemaker/fw_utils.py` at tag `v2.257.0` (accessed 2026-08-01):

```python
SM_DATAPARALLEL_SUPPORTED_INSTANCE_TYPES = (
    "ml.p3.16xlarge",
    "ml.p3dn.24xlarge",
    "ml.p4d.24xlarge",
    "ml.p4de.24xlarge",
    "local_gpu",
)
```

**NEGATIVE RESULT (headline):** SMDDP supports **no P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn1, Trn2, G5, G6, G6e, or G7e instance**. On every instance type AWS currently markets for frontier training, SMDDP is not an option. The AWS-optimized collective story on modern hardware is plain NCCL over `aws-ofi-nccl` over EFA.

### 4.2 It is also frozen

**[T1]** Latest entry in the SMDDP release notes is **v2.5.0, dated October 17, 2024** (PyTorch v2.4.1 with CUDA v12.1). — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html (accessed 2026-08-01)

**[T1]** Latest SageMaker model parallelism library release is **v2.6.0, dated October 17, 2024**. — https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html (accessed 2026-08-01)

**[T1]** TensorFlow support: "The SMDDP library discontinued support for TensorFlow and is no longer available in DLCs for TensorFlow later than v2.11.0." — https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html (accessed 2026-08-01)

**[T1]** SMP v1.x is labelled "(Archived) SageMaker model parallelism library v1.x" in the current docs. — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel.html (accessed 2026-08-01)

### 4.3 How SMDDP relates to NCCL over EFA (the mechanism, for a diagram)

SMDDP does **not** bypass EFA. It bypasses **NCCL**, and talks to EFA itself through libfabric.

**[T1]** SMDDP `AllGather` mechanism on P4d — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html (accessed 2026-08-01):

1. "It transfers data between instances (inter-node) through the Elastic Fabric Adapter (EFA) network **with a mesh topology**... Compared to the NCCL ring or tree topology that involves multiple packet hops, SMDDP avoids accumulating latency from multiple hops as it only needs one hop. SMDDP implements a network rate control algorithm that balances the workload to each communication peer in a mesh topology and achieves a higher global network throughput."
2. "It adopts low-latency GPU memory copy library based on NVIDIA GPUDirect RDMA technology (**GDRCopy**) to coordinate local NVLink and EFA network traffic... the SMDDP library is able to pipeline the intra-node and inter-node data movement."
3. "It reduces the usage of GPU streaming multiprocessors... P4d and P4de instances are equipped with NVIDIA A100 GPUs, which each have **108 streaming multiprocessors**. While NCCL takes up to **24** streaming multiprocessors to run collective operations, SMDDP uses fewer than **9**."

**[T1]** SMDDP `AllReduce` mechanism: "*Leverages CPUs*: The library uses CPUs to `AllReduce` gradients, offloading this task from the GPUs. *Improved GPU usage*: The cluster's GPUs focus on computing gradients." — same URL.

**[T2]** Framed bluntly by AWS: "we used NVIDIA Collective Communications Library (NCCL) for these collectives. However, **NCCL is a general purpose collective communications library not designed for AWS infrastructure, which leads to sub-optimal performance even with EFA enabled**." — https://aws.amazon.com/blogs/machine-learning/new-performance-improvements-in-amazon-sagemaker-model-parallel-library/ (accessed 2026-08-01)

**[T1]** Activation is a two-line process-group swap:

```python
import torch.distributed as dist
import smdistributed.dataparallel.torch.torch_smddp
dist.init_process_group(backend="smddp")  # Replacing "nccl"
```

— https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-smddp-allgather.html (accessed 2026-08-01). Same page: "It supports any training frameworks such as SageMaker Model Parallelism Library, PyTorch FSDP, and DeepSpeed."

**[T1]** SMDDP's own SG requirement: "To properly run distributed training on the EFA-enabled instance types, you should enable traffic between the instances by setting up the security group of your VPC to allow all inbound and outbound traffic to and from the security group itself." — https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html (accessed 2026-08-01)

**[T1]** SMDDP still uses MPI and NCCL underneath for parts of the stack: "The SageMaker AI distributed data parallel library employs Message Passing Interface (MPI)... and uses NVIDIA's NCCL library for GPU-level communication." Custom flags via `custom_mpi_options`, e.g. `{'smdistributed':{'dataparallel':{'enabled': True, "custom_mpi_options": "-verbose -x NCCL_DEBUG=VERSION"}}}`. — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-config.html (accessed 2026-08-01)

**[T1]** Also worth citing: "There's a CPU memory leak issue from a gradual CPU memory increase while training with SMDDP `AllReduce` in DDP mode." (Known issue, SMDDP v2.0.1 release notes.) — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html (accessed 2026-08-01)

---

## 5. SageMaker HyperPod

### 5.1 EFA configuration on the cluster API

**[T1]** `ClusterNetworkInterface.InterfaceType`, valid values `efa | efa-only`:

- `efa` — "An EFA with ENA interface, which provides both the EFA device for low-latency, high-throughput communication and the ENA device for IP networking."
- `efa-only` — "An EFA-only interface, which provides only the EFA device capabilities without the ENA device for traditional IP networking."

Required: No. — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterNetworkInterface.html (accessed 2026-08-01)

**[T1]** `AdditionalEnis.efa_enis` — "A list of Elastic Fabric Adapter (EFA) ENIs associated with the instance." (Returned by the cluster-node describe path.) — https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/SageMaker/Types/AdditionalEnis.html (accessed 2026-08-01)

**Launch dating [T1], AWS What's New:**
- **June 2026** — "Amazon SageMaker HyperPod now supports EFA-only network interfaces for cluster instance groups... With EFA-only, users can maximize the number of EFA interfaces dedicated to low-latency, high-throughput inter-node communication **without encountering IP exhaustion**. To enable EFA-only, users must specify `efa-only` in the ClusterNetworkInterface configuration when creating or updating their HyperPod cluster via the CreateCluster/UpdateCluster API. This option is available in all AWS Regions where Amazon SageMaker HyperPod is supported." — https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-sagemaker-hyperpod-efa-only/ (accessed 2026-08-01)
- **October 2024** — the underlying EC2 capability: "AWS has introduced a new 'EFA-only' interface type for Elastic Fabric Adapter (EFA), decoupling it from the Elastic Network Adapter (ENA)... Previously, each EFA interface was associated with an ENA device, consuming an IP address, leading to scaling limitations and IP routing challenges in Linux." — https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/ (accessed 2026-08-01)
- **July 2026** — the EKS-side counterpart: "Amazon EKS now supports EFA and placement groups on Amazon EKS Auto Mode and Karpenter." — https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-eks-efa-placement-groups/ (accessed 2026-08-01)

So the HyperPod story is: EC2 shipped EFA-only in Oct 2024; HyperPod exposed it ~20 months later in June 2026. Good timeline material for a diagram.

### 5.2 Security group and VPC requirements

**[T1]** "If you want to create a HyperPod cluster with EFA-enabled instances, make sure that you set up a security group to allow **all inbound and outbound traffic to and from the security group itself**." — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html (accessed 2026-08-01)

**[T1]** HyperPod on EKS networking requirements: "SageMaker HyperPod requires the Amazon VPC Container Network Interface (CNI) plug-in version **1.18.3 or later**. AWS VPC CNI plugin for Kubernetes is the **only CNI supported** by SageMaker HyperPod. The type of the subnet in your VPC must be **private** for HyperPod clusters." Supported Kubernetes versions: 1.30 through 1.35. — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html (accessed 2026-08-01)

**[T1]** For training-job VPC mode (contrast, non-HyperPod): "By default, SageMaker Training Jobs run in a SageMaker AI-managed network environment and do not require VPC configuration." When you do set `VpcConfig`, "SageMaker AI still launches all instances for a given job within a single subnet (a single Availability Zone) to keep them physically close and minimize inter-node latency. The additional subnets only broaden the options SageMaker AI can choose from. They do not spread one job's instances across Availability Zones." — https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html (accessed 2026-08-01)

**[T1] / [T2] gotcha — inter-container traffic encryption:** "Enabling inter-container traffic encryption can increase training time, especially if you are using distributed deep learning algorithms... For affected algorithms, adding this additional level of security also increases cost." — https://docs.aws.amazon.com/sagemaker/latest/dg/train-encrypt.html (accessed 2026-08-01). **[T2]** adds the concrete network requirement: "ensure that your security groups are configured to permit **UDP traffic over port 500** and that you have set `EnableInterContainerTrafficEncryption` to `True`." — https://aws.amazon.com/blogs/machine-learning/building-secure-machine-learning-environments-with-amazon-sagemaker/ (accessed 2026-08-01)

**UNKNOWN:** No AWS source found states what `EnableInterContainerTrafficEncryption=True` does to EFA/OS-bypass traffic specifically (whether EFA traffic is tunnelled, excluded, or the feature is incompatible). This is a genuinely interesting open question. Mark it UNKNOWN; do not speculate in reader-facing text.

### 5.3 The HyperPod AMI and its EFA stack

**[T1]** "These enhancements are built upon the following base Deep Learning AMIs (DLAMIs): AWS Deep Learning Base GPU AMI (Ubuntu 20.04) for orchestration with Slurm. Amazon Linux 2 or Amazon Linux 2023 based AMI for orchestration with Amazon EKS." — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami.html (accessed 2026-08-01). (The Slurm release-notes page says Ubuntu 22.04; see the CONTRADICTION below.)

**[T1] AMI support policy — EFA is a first-class, versioned component of the AMI contract.** "This support policy applies to the following HyperPod AMI components: **EFA (Elastic Fabric Adapter)**, NVIDIA Driver, **NCCL (aws-ofi-nccl)**, CUDA, OS Kernel. The policy defines the window during which HyperPod will ship security patches for a given AMI version."

Support windows: Major = 12 months, Minor = 6 months, Patch = until a new patch version is released. "HyperPod AMI major version releases involve upgrading core components (EFA, NVIDIA driver, NCCL, CUDA, OS kernel) to new major versions. These releases may introduce breaking changes, such as NVIDIA driver changes from 570.x to 580.x, that require workload validation."

HyperPod **EKS** AMI version table:

| AMI version | Latest patch | Supported EKS versions | EFA Installer | NVIDIA Driver | CUDA | OS Kernel | First released |
|---|---|---|---|---|---|---|---|
| 1.3.x | 1.3.0 | 1.30-1.35 | **1.47.0** | 580.167.08 | 12.8 | 6.1.x | June 29, 2026 |
| 1.2.x | 1.2.0 | 1.30-1.35 | **1.47.0** | 580.159.04 | 12.8 | 6.1.x | June 26, 2026 |
| 1.1.x | 1.1.6 | 1.30-1.35 | **1.47.0** | 580.126.09 | 12.8 | 6.1.x | April 23, 2026 |
| 1.0.x | 1.0.3 | 1.30-1.34 | **1.47.0** | 580.150 | 12.8 | 6.1.x | January 25, 2026 |

"1.x.x supported until January 2027." "Does this policy apply to custom AMIs? **No.**"

— https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ami-support-policy.html (accessed 2026-08-01)

**[T1] HyperPod Slurm AMI release, July 09, 2026** (both ARM64 and x86_64):

- EFA Installer version: **1.47.0**
- `rdma-core` version: 61.0-1
- NVIDIA Driver: 580.159.04
- CUDA versions present: 12.6, 12.8, 12.9, 13.0 (default 13.0 on ARM64, 12.9 on x86_64)
- Slurm: 25.11.4
- Linux Kernel: 6.8.0-1057-aws, Glibc 2.35
- Containerd v2.2.5, FSx Lustre client 2.15.6-1fsx32, `nvidia-imex` 580.159.04-1ubuntu1

Prior release **March 30, 2026** carried EFA Installer **1.45.1** and `rdma-core` **60.0-1**, so the 1.45.1 -> 1.47.0 bump lands between March 30 and April 23, 2026.

An older, still-published entry (**August 12, 2025**) documents per-CUDA-directory compiled NCCL versions: "For CUDA directory of 12.4, compiled NCCL Version 2.22.3+CUDA12.4... 12.6 -> 2.24.3+CUDA12.6... 12.8 -> 2.27.5+CUDA12.8."

— https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html (accessed 2026-08-01)

**CONTRADICTION (both T1, both AWS docs, accessed 2026-08-01):**
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ref.html says "SageMaker HyperPod runs a DLAMI based on: AWS Deep Learning Base GPU AMI (**Ubuntu 20.04**) for orchestration with Slurm. **Amazon Linux 2** based AMI for orchestration with Amazon EKS."
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html says "These HyperPod AMIs are built upon AWS Deep Learning Base GPU AMI (**Ubuntu 22.04**)."
- https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami.html says "**Amazon Linux 2 or Amazon Linux 2023**" for EKS.

The release-notes page is the more current of the three (it documents a May 13, 2025 Ubuntu 20.04 -> 22.04 migration explicitly). Present the contradiction rather than picking silently.

**[T1] Custom AMI constraints:** "Custom AMIs must contain **only the root snapshot**. Additional snapshots are not supported and will cause cluster creation or update operations to fail with a validation exception." "`ImageId` in `update-cluster` is **immutable**. For patching existing instance groups, you must use `UpdateClusterSoftware` with `ImageId`." "Custom AMIs must be built using HyperPod's public base AMIs to maintain compatibility with distributed training libraries and cluster management capabilities." — https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-hyperpod-enhances-ml-infrastructure-with-scalability-and-customizability/ [T2] and https://aws.amazon.com/about-aws/whats-new/2025/08/sagemaker-hyperpod-support-custom-ami/ [T1] (both accessed 2026-08-01)

### 5.4 Health checks that cover the fabric

This is the strongest "EFA is a first-class managed concern" evidence in the whole SageMaker surface.

**[T1] Deep health check inventory** — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html (accessed 2026-08-01):

*Instance-level:*

| Category | Utility | Instance compatibility | Description |
|---|---|---|---|
| Accelerator | GPU/NVLink count | GPU | Verifies GPU/NVLink counts |
| Accelerator | DCGM diagnostics level 4 | GPU | NVIDIA DCGM diagnostics at level 4, including additional memory tests |
| Accelerator | Neuron sysfs | Trainium | Reads counters from Neuron sysfs |
| Accelerator | Neuron hardware check | Trainium | Runs a training workload and verifies results |
| Accelerator | NCCOM local test | Trainium | Collective communication on single Trainium nodes |
| **Network** | **EFA** | **GPU and Trainium** | **"Runs latency and bandwidth benchmarking on the attached EFA device."** |

*Cluster-level:*

| Category | Utility | Compatibility | Description |
|---|---|---|---|
| Accelerator | NCCL test | GPU | "Verifies the performance of collective communication operations on multiple NVIDIA GPUs" |
| Accelerator | NCCOM cluster test | Trainium | Same for multiple Trainium nodes |

**[T1] Real log output (quote verbatim in the deep dive — it is unusually concrete):**

```
# EFA Loopback Test
2024-08-20T22:26:28Z    info    EFA Loopback check passed for device: rdmap0s29 . Output summary is MaxBw: 58.590000, AvgBw: 32.420000, MaxTypicalLat: 30.870000, MinTypicalLat: 20.080000, AvgLat: 21.630000
```

And a cluster-level failure, which is a fabric-bandwidth threshold failure:

```json
{
    "level": "error",
    "ts": "2024-06-18T21:15:22Z",
    "msg": "Encountered FaultyInstance. Replace the Instance. Region: us-west-2, InstanceType: p4d.24xlarge. ERROR:Bandwidth has less than threshold: Expected minimum threshold :80,NCCL Test output Bw: 30"
}
```

Log locations: cluster-level in CloudWatch at `/aws/sagemaker/Clusters/<cluster_name>/<cluster_id>`, stream `DeepHealthCheckResults/<log_stream_id>`; instance-level at `/var/log/aws/clusters/sagemaker-deep-health-check.log` on each node.

On-demand invocation: `StartClusterHealthCheck` API.

**Flexible instance group behaviour [T1], same URL:** "Instance-level deep health checks run only on eligible GPU instance types. CPU instance types within a flexible instance group are skipped. Cluster-level connectivity tests (such as NCCL AllReduce) run **only between instances of the same type** within the instance group."

**[T1] Cost of the check:** "the new instance goes through the deep health check process (instance level stress tests) for **about a couple of hours**." AWS gives three configurations depending on whether you have spare nodes; in the no-spare-capacity case they recommend disabling deep health checks post-creation, because the ~2-hour check delays node replacement. — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-config-tips.html (accessed 2026-08-01)

**[T2] EKS framing:** "**Deep health checks** – This is a managed health check for stress testing GPUs and AWS Trainium instances, as well as performing Elastic Fabric Adapter (EFA) [checks]. These checks can be run during the cluster creation, update, or node replacement phases, and can be enabled or disabled through HyperPod APIs." — https://aws.amazon.com/blogs/machine-learning/introducing-amazon-eks-support-in-amazon-sagemaker-hyperpod/ (accessed 2026-08-01)

**[T1] Node labels:** passing nodes get `sagemaker.amazonaws.com/node-health-status: Schedulable`; failing nodes "will be terminated and replaced." — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-labels.html (accessed 2026-08-01)

**[T1] EFA observability:** HyperPod's cluster metrics include a **Network** category sourced from the **EFA Exporter**, **not enabled by default** (advanced mode only). Doc points at https://github.com/awslabs/awsome-distributed-ai/blob/cb99a28a85c8333ddbad004221230dac967ddbab/4.validation_and_observability/3.efa-node-exporter/README.md . — https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-cluster-metrics.html (accessed 2026-08-01)

> **Gotcha for the deep dive:** EFA metrics on HyperPod are opt-in. Teams debugging fabric issues frequently do not have the exporter running.

### 5.5 Auto-resume on failure

- **[T1]** "During cluster creation or update, cluster admin users can select the node (instance) recovery option between `Automatic` (Recommended) and `None` at the cluster level. If set to `Automatic`, SageMaker HyperPod reboots or replaces faulty nodes automatically. Automatic node recovery runs when issues are found from health-monitoring agent, basic health checks, and deep health checks." — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html (accessed 2026-08-01)
- **[T2]** Slurm mechanism: "Slurm jobs in SageMaker HyperPod are monitored using a SageMaker custom Slurm plugin using the **SPANK framework**. When a training job fails, SageMaker HyperPod will inspect the cluster health through a suite of health checks. If a faulty node is found in the cluster, the SageMaker HyperPod will automatically remove the node from the cluster, replace it with a healthy node, and restart the training job." — https://aws.amazon.com/blogs/machine-learning/introducing-amazon-sagemaker-hyperpod-to-train-foundation-models-at-scale/ (accessed 2026-08-01)
- **[T2]** The idiom, verbatim from an AWS blog's `sbatch`:

```bash
AUTO_RESUME=""
if [ -d "/opt/sagemaker_cluster" ]; then
  echo "Detected Hyperpod cluster.. enabling --auto-resume=1"
  AUTO_RESUME="--auto-resume=1"
fi
srun ${AUTO_RESUME} -l ${TORCHRUN} "${TORCHRUN_ARGS[@]}" $TRAIN_SCRIPT "${TRAINING_ARGS[@]}"
```
— https://aws.amazon.com/blogs/machine-learning/accelerate-pre-training-of-mistrals-mathstral-model-with-highly-resilient-clusters-on-amazon-sagemaker-hyperpod/ (accessed 2026-08-01)
- **[T2]** EKS mechanism: "**Job auto resume** – SageMaker HyperPod provides a job auto resume capability using the **Kubeflow Training Operator** for PyTorch... The extension makes sure the job waits and restarts after the node is replaced." — https://aws.amazon.com/blogs/machine-learning/introducing-amazon-eks-support-in-amazon-sagemaker-hyperpod/ (accessed 2026-08-01)

**[T1] LIVE KNOWN ISSUE, worth surfacing prominently (dated May 27, 2026, still published as of 2026-08-01):**

> "**Known issue: auto-resume on Slurm 25.11:** Auto-resume has known issues on SageMaker HyperPod clusters running Slurm 25.11. Jobs submitted with auto-resume enabled are **not guaranteed to resume on the node that is replaced** after a node fault. Instead the affected jobs are **requeued**. A fix is under investigation."

— https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html (accessed 2026-08-01)

This matters for EFA specifically: requeue instead of in-place resume means the topology-aware placement is recomputed, so a job can land on a different set of nodes with different fabric locality.

**UNKNOWN:** No source found states whether an EFA-only (as opposed to GPU) fault triggers node replacement in steady state, or only at check time. The deep health check covers EFA; the continuous health-monitoring agent's documented coverage is "memory exhaustion, disk failures, GPU anomalies, kernel deadlocks, container runtime issues, and out-of-memory (OOM) crashes" [T2, EKS blog] — EFA is not in that list. Flag as UNKNOWN rather than asserting a gap.

### 5.6 Topology awareness

**[T1]** — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html (accessed 2026-08-01)

- Three named sources of data-transfer overhead: GPU-to-GPU (NVLink, intra-instance), GPU-to-CPU (NUMA; "in a typical EC2 instance architecture like p5.48xlarge, there are two different system buses, each with a CPU and 4 GPUs"), and "Network communications between instances: Instances transfer data through a chain of network switches. The shortest path typically corresponds to the lowest latency."
- **Automatic, no configuration:** "When you create a HyperPod Slurm cluster, the system inspects all instance groups and their associated instance types, identifies the GPU communication characteristics of each instance type, and configures Slurm with the appropriate topology plugin. This process runs automatically and does not require any configuration."
- **File format depends on Slurm version:** "On Slurm 25.11 and later, topology is defined in a `topology.yaml` file, which is the source of truth and supports multiple topology definitions and per-partition assignment. On Slurm 24.x, topology is defined in a `topology.conf` file with a single cluster-wide topology."
- **Plugin selection:** `topology/tree` for hierarchical interconnects, "This includes instance types such as `ml.p5.48xlarge`, `ml.p5e.48xlarge`, and `ml.p5en.48xlarge`." `topology/block` for UltraServers, "Block topology is used for UltraServer instance types such as `ml.p6e-gb200.36xlarge`."
- Real generated `topology.conf` on Slurm 24.x (note the `nn-` network-node IDs, which come straight from the EC2 instance topology API):

```
SwitchName=nn-6fe9d8a965d34d181 Switches=nn-0b53107754517bf0e
SwitchName=nn-0b53107754517bf0e Switches=nn-424c855d4ad825aa4,nn-95acd7c656329fc30
SwitchName=nn-424c855d4ad825aa4 Nodes=ip-10-1-111-198
SwitchName=nn-95acd7c656329fc30 Nodes=ip-10-1-53-231
```

- Job-level controls: `sbatch --switch=1` (tree), `--segment=N` and `--exclusive=topo` (block).
- **Partition-level resolution rules (Slurm 25.11+), verbatim:** all-UltraServer partition -> `block`; all topology-capable and not all-UltraServer -> `tree`; mixed UltraServer + other topology-capable -> `tree`; any instance type without network topology support -> no assignment, inherits cluster-wide `flat`.
- **Flat default is the silent-degradation case:** "if any non-topology compute group is present, `flat` is the default." A single non-topology-capable instance group demotes the whole cluster default.
- Instance types supporting network topology: "accelerated computing families such as G6e, G7e, P4d, P4de, P5, P5e, P5en, and P6e-GB200, as well as AWS Trainium families such as Trn1, Trn1n, and Trn2."
- **EKS labels:** `topology.kubernetes.io/region`, `topology.kubernetes.io/zone`, `topology.k8s.aws/network-node-layer-1|2|3`, `topology.k8s.aws/ultraserver-id`. "up to four network node layers."
- UltraServer shape: "An UltraServer contains up to 18 p6e-gb200.36xlarge instances, with 4 GPUs on each instance. All GPUs across all nodes are interconnected through NVLink switches, enabling data transfer between any two GPUs **without using network interfaces**." (i.e. inside an UltraServer domain, EFA is not the transport.)

**[T1]** Task-governance topology-aware scheduling requires "HyperPod task governance is **v1.2.2-eksbuild.1 or higher**" and supports: `ml.p3dn.24xlarge`, `ml.p4d.24xlarge`, `ml.p4de.24xlarge`, `ml.p5.48xlarge`, `ml.p5e.48xlarge`, `ml.p5en.48xlarge`, `ml.p6e-gb200.36xlarge`, `ml.p6-b300.48xlarge`, `ml.trn1.2xlarge`, `ml.trn1.32xlarge`, `ml.trn1n.32xlarge`, `ml.trn2.48xlarge`, `ml.trn2u.48xlarge`. — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html (accessed 2026-08-01)

> Note the asymmetry worth a callout: `ml.p6-b200.48xlarge` appears in the DPD-supported list (Section 6.1) but **not** in the task-governance topology list, while `ml.p6-b300.48xlarge` appears in both.

**[T1]** Launch date: "Amazon SageMaker HyperPod now supports automatic Slurm topology management" — https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/ (accessed 2026-08-01). "topology-aware scheduling is enabled by default and requires no configuration."

**[T2]** UltraServer topology framing: "For UltraServer compute nodes, Amazon EC2 exposes which instances belong to the same UltraServer... With Slurm orchestration, SageMaker HyperPod automatically enables the topology plugin and creates a `topology.conf` file with the respective `BlockName`, `Nodes`, and `BlockSizes` to match your UltraServer capacity." — https://aws.amazon.com/blogs/machine-learning/train-and-deploy-ai-models-at-trillion-parameter-scale-with-amazon-sagemaker-hyperpod-support-for-p6e-gb200-ultraservers/ (accessed 2026-08-01)

### 5.7 EFA on the EKS side of HyperPod

**[T2]** "Running multi-node distributed training requires various resources... such as device plugins, CSI drivers, and Training Operators, to be pre-deployed on the EKS cluster... **HyperPodHelmCharts** simplify the process using Helm." — https://aws.amazon.com/blogs/machine-learning/introducing-amazon-eks-support-in-amazon-sagemaker-hyperpod/ (accessed 2026-08-01)

**[T1]** EKS EFA resource models — https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html (accessed 2026-08-01):

| Feature | EFA DRA driver | EFA device plugin |
|---|---|---|
| Minimum Kubernetes version | 1.34 | All EKS-supported versions |
| EKS Compute | Managed node groups, self-managed nodes | EKS Auto Mode, Karpenter, managed node groups, self-managed nodes |
| Device advertisement | Rich attributes via `ResourceSlice` (device type, topology, PCIe locality) | Integer count of `vpc.amazonaws.com/efa` extended resources |
| GPU-EFA affinity | DRA-native topology-awareness | Automatic topology-awareness (EKS-optimized AL2023 AMIs only) |
| Device sharing | Multiple Pods can share an EFA device via shared `ResourceClaim` | **Not supported.** Each EFA device exclusively allocated to one Pod |

DRA `matchAttribute` example that pins EFA to the same PCIe root as the GPU:

```yaml
        constraints:
        - requests: ["1-gpu", "1-efa"]
          matchAttribute: "resource.kubernetes.io/pcieRoot"
```

and for Neuron, `resource.aws.com/devicegroup4_id` (with `devicegroup1/4/8/16_id` variants for 1, 4, 8, 16 connected Neuron devices).

**[T2]** EFA count verification on EKS: `kubectl get nodes -o=custom-columns=NAME:.metadata.name,EFA:.status.allocatable.vpc\\.amazonaws\\.com/efa` with expected values "P4d or p4de: 4, P5: 32." — https://aws.amazon.com/blogs/machine-learning/configure-and-verify-a-distributed-training-cluster-with-aws-deep-learning-containers-on-amazon-eks/ (accessed 2026-08-01)

**[T2]** Same source: the log line confirming EFA in a K8s NCCL test is `NCCL INFO NET/OFI Selected Provider is efa`. — https://aws.amazon.com/blogs/machine-learning/distributed-training-with-amazon-eks-and-torch-distributed-elastic/ (accessed 2026-08-01)

**[T2]** DRA driver background: "The EFA DRA driver, built in the upstream **DRANET** project... publishes PCIe and device group topology information so Kubernetes can place EFA interfaces close to their associated AWS Trainium or NVIDIA GPU devices." — https://aws.amazon.com/blogs/containers/simplify-ai-infrastructure-for-aws-trainium-and-elastic-fabric-adapter-with-kubernetes-dynamic-resource-allocation/ (accessed 2026-08-01)

**[T1]** Flexible instance groups (April 2026): "customers can define an ordered list of instance types using the `InstanceRequirements` parameter and provide multiple subnets across availability zones... Training customers benefit from multi-subnet distribution **within an availability zone** to avoid subnet exhaustion." EKS orchestrator only. — https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/ (accessed 2026-08-01)

---

## 6. Inference — the negative results, stated precisely

### 6.1 Where EFA IS used: HyperPod Inference Operator, Disaggregated Prefill and Decode (DPD)

This is the one place in SageMaker where EFA demonstrably carries inference traffic.

**[T1]** "Disaggregated Prefill and Decode **requires EFA-capable instances with GPU-Direct RDMA support**. The following instance types are supported: `ml.p5.48xlarge`, `ml.p5e.48xlarge`, `ml.p5en.48xlarge`, `ml.p6-b200.48xlarge`, `ml.p6-b300.48xlarge`. **Other instance types are not supported for DPD.**"

Also required: "A worker image that includes vLLM, LMCache, NVIDIA NIXL, and **the EFA libfabric provider**." Supported images: `public.ecr.aws/deep-learning-containers/vllm:server-hyperpod-cuda-v1.1` or `lmcache/vllm-openai:v0.4.3`. "Both images include LMCache 0.4.3, vLLM 0.19.0, and NIXL 1.0.0." Requires "HyperPod Inference Operator **version 3.2 or later**. DPD is not supported on earlier versions."

— https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-dpd.html (accessed 2026-08-01)

**[T2]** The four-layer transport stack, quoted: "KV cache transfer uses a four-layer stack (**LMCache PD -> NIXL -> `libfabric` -> EFA**) that HyperPod composes end-to-end... NIXL provides a unified memory abstraction across GPU, CPU, and remote peers and selects the right RDMA operation. The `libfabric` provider exposes EFA as kernel-bypass, GPU-Direct RDMA, keeping the host CPU off the data path."

Quantified: "on `ml.p5.48xlarge` with 3,200 Gbps of EFA, an 8,000-token transfer for Llama 3.3 70B takes **single-digit milliseconds**."

Placement constraint: "instances are required to be located within the **same Availability Zone (AZ)** for EFA high-bandwidth communication."

Explicit negative about G-family: "Although G6, G6e, and G7e instance families do support EFA with RDMA read/write, performance on multi-GPU instances is **bottlenecked by GPU-to-GPU communication over PCIe**."

"Below the routing threshold, the fixed cost of transferring KV cache over EFA RDMA outweighs the benefit of isolating decode. The DPD router sends those requests straight to a decoder."

Routing strategies available: `prefixaware`, `kvaware`, `session`, `roundrobin`.

— https://aws.amazon.com/blogs/machine-learning/disaggregated-prefill-and-decode-for-llm-inference-on-sagemaker-hyperpod/ (published 10 JUL 2026, accessed 2026-08-01)

**[T1]** Launch: "Amazon SageMaker HyperPod now supports disaggregated prefill and decode... DPD is enabled by adding a `pdSpec` section to the existing `InferenceEndpointConfig` custom resource, and is available for SageMaker HyperPod clusters using the **EKS orchestrator on EFA-capable instance types** in all AWS Regions where Amazon SageMaker HyperPod is available." — https://aws.amazon.com/about-aws/whats-new/2026/7/amazon-sagemaker-hyperpod-dpd/ (accessed 2026-08-01)

**[T1]** HyperPod inference generally supports "both single-node and **multi-node inference architectures**," plus a two-tier KV cache ("an L1 cache that uses CPU memory for low-latency local reuse, and an L2 cache that leverages Redis to enable scalable, node-level cache sharing"). — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html (accessed 2026-08-01)

### 6.2 NEGATIVE RESULT: SageMaker AI managed real-time endpoints

**Claim, stated conservatively:** No AWS documentation or API surface found (as of 2026-08-01) exposes EFA, or any cross-instance collective communication, for SageMaker AI managed real-time inference endpoints.

Evidence:

1. **[T1]** `ProductionVariant` (the `CreateEndpointConfig` compute block) members in full: `VariantName`, `AcceleratorType` (deprecated, EI retired), `CapacityReservationConfig`, `ContainerStartupHealthCheckTimeoutInSeconds`, `CoreDumpConfig`, `EnableSSMAccess`, `InferenceAmiVersion`, `InitialInstanceCount`, `InitialVariantWeight`, `InstancePools`, `InstanceType`, plus routing/scaling fields. **No EFA field. No multi-node / model-sharding-across-instances field.** — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ProductionVariant.html (accessed 2026-08-01)
2. **[T1]** `InstancePools` is explicitly about *heterogeneous fallback*, not model sharding: "A list of instance pools for the production variant. Each instance pool specifies an instance type and its priority for provisioning. Use instance pools to configure heterogeneous endpoints that deploy models across multiple instance types." Max 5 items. — same URL. Reinforced by the April 2026 What's New: "When preferred instance types have insufficient capacity, SageMaker AI automatically provisions from the next available option in the list." — https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-ai-inf-auto-inst/ (accessed 2026-08-01)
3. **[T1]** Inference components allocate resources **within one instance**: `ComputeResourceRequirements` takes `MinMemoryRequiredInMb`, `NumberOfCpuCoresRequired`, `NumberOfAcceleratorDevicesRequired`. Scaling is by *copies*: "You can specify how many copies of each model to host... You can scale any inference component copy down to zero." Copies are independent replicas, not shards of one model. — https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints-deploy-models.html (accessed 2026-08-01)
4. **[T2]** The AWS guidance for large FMs on endpoints is explicitly *within-instance* tensor parallelism: "**Foundation model size** – This is suitable for models that can't fit into single ML accelerator's memory and therefore need **multiple accelerators in an instance**." — https://aws.amazon.com/blogs/machine-learning/scale-foundation-model-inference-to-hundreds-of-models-with-amazon-sagemaker-part-1/ (accessed 2026-08-01). And: "sharding a model can improve model latency and throughput only up to a certain limit, beyond which inter-device communication requirements dominate computation time" — with TP degree bounded by "the number of GPUs on the deployment instance type." — https://aws.amazon.com/blogs/machine-learning/benchmark-and-optimize-endpoint-deployment-in-amazon-sagemaker-jumpstart/ (accessed 2026-08-01)
5. **[T1]** Multi-model endpoints are further restricted: "Multi-model endpoints are currently supported for all CPU instances types and on **single-GPU instance types**." — https://docs.aws.amazon.com/sagemaker/latest/dg/multi-model-endpoint-instance.html (accessed 2026-08-01)
6. **[T1]** `InferenceAmiVersion` enumerates the managed inference AMIs by NVIDIA driver + CUDA + container toolkit only. **EFA, libfabric, and aws-ofi-nccl are not mentioned in any of the five AMI descriptions.** — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ProductionVariant.html (accessed 2026-08-01)

**Honest limit on this negative:** absence of documentation is not the same as documented absence. No AWS page found says "EFA is not available on real-time endpoints." What can be asserted with confidence: **the API has no EFA control, the managed inference AMI spec does not list an EFA stack, and every AWS scaling recommendation for endpoints is intra-instance or replica-based.** If the deep dive states this, state it in those terms.

### 6.3 Related-but-not-SageMaker-endpoints data point

**[T2]** Amazon's Rufus ran multi-node inference on Trn1 with EFA, but on **Amazon ECS**, not SageMaker endpoints: "cross-node collectives (such as all gather or all reduce) are managed by the Neuron Distributed Inference (NxDI) library, which uses EFA to deliver high-bandwidth, low-latency inter-node communication." Model inputs broadcast separately "on CPU over standard TCP connections" with the Gloo backend. — https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/ (accessed 2026-08-01)

Useful as a contrast panel: the same EFA-for-inference pattern exists at Amazon scale, just not behind a SageMaker managed endpoint.

### 6.4 SageMaker Model Parallel (SMP) and inference

**UNKNOWN / NOT APPLICABLE.** SMP v2 is a *training* library. No AWS source found describes SMP being used for inference. SMP's relationship to EFA is entirely mediated by SMDDP (Section 4) or by NCCL over EFA. The existing deep-dive source #22 ("SageMaker Expert Parallelism") is an SMP v2 *training* feature.

**[T1]** SMP v2 + SMDDP compatibility, verbatim: "You can use the SageMaker model parallelism library v2 (SMP v2) in conjunction with the SageMaker distributed data parallelism (SMDDP) library that offers the `AllGather` collective communication operation optimized for AWS infrastructure... **Note: The SMDDP library supports P4 and P4de instances.**" Initialization order matters: "you need to initialize PyTorch Distributed with the SMDDP backend first, and then run the SMP initialization." — https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-smddp-allgather.html (accessed 2026-08-01)

---

## 7. Consolidated constraints and gotchas

| # | Gotcha | Tier | Source |
|---|---|---|---|
| 1 | `CreateTrainingJob` has no EFA parameter. EFA is implicit-by-instance-type. | T1 | API_ResourceConfig |
| 2 | SDK driver allowlist `SM_EFA_NCCL_INSTANCES` omits P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn2, G6e, G7e. `FI_PROVIDER=efa` not set there. | T1 | sagemaker-python-sdk source |
| 3 | `SM_EFA_RDMA_INSTANCES` omits P5 entirely, while the DLC's own EFA test sets `FI_EFA_USE_DEVICE_RDMA=1` for P5. Two AWS repos disagree. | T1 | both repos |
| 4 | SMDDP: P3dn/P4d/P4de only. Nothing newer. No release since Oct 2024. | T1 | distributed-data-parallel-support, release notes |
| 5 | SMDDP `AllGather` is P4-only even within the supported set. | T1 | distributed-data-parallel-support |
| 6 | BYOC: `--skip-kmod` means the container needs a host with the EFA kernel driver. Container is not self-sufficient. | T1 | DLC install script |
| 7 | aws-ofi-nccl plugin path and filename changed at EFA installer 1.44.0 (`lib/<arch>-linux-gnu/libnccl-net.so` -> `lib64/libnccl-net-ofi.so`). Hardcoded paths break. | T1 | DLC install script |
| 8 | EFA installer 1.48+ silently skips the AL2023 `libnccl-ofi` RPM on NGC-derived bases unless `--disable-ngc` is passed. | T1 | DLC install script |
| 9 | Container NCCL version must match `torch.cuda.nccl.version()`. | T1 | your-algorithms-training-efa |
| 10 | `NCCL_PROTO=simple` is mandatory: "the EFA provider doesn't support LL protocols; enabling them could lead to data corruption." | T2 | LLM best practices blog |
| 11 | Security group must allow all inbound+outbound to/from itself, both for SMDDP training jobs and for HyperPod EFA clusters. | T1 | two separate docs |
| 12 | Training jobs run in a SageMaker-managed network by default; VPC mode is optional and does not spread one job across AZs. | T1 | train-get-capacity |
| 13 | Inter-container traffic encryption needs UDP/500 and increases distributed training time and cost. Interaction with EFA is UNKNOWN. | T1 + T2 | train-encrypt + secure-ML blog |
| 14 | HyperPod deep health checks take ~2 hours per new instance; AWS recommends disabling them post-creation when you have no spare capacity. | T1 | eks-resiliency-config-tips |
| 15 | HyperPod EFA metrics come from an EFA Exporter that is **not** enabled by default. | T1 | hyperpod-observability-cluster-metrics |
| 16 | HyperPod Slurm auto-resume is broken on Slurm 25.11 (known issue, still open as of the July 2026 notes): jobs requeue instead of resuming on the replaced node. | T1 | hyperpod-release-ami-slurm |
| 17 | A single non-topology-capable instance group demotes the whole HyperPod Slurm cluster default topology to `flat`. | T1 | sagemaker-hyperpod-topology |
| 18 | HyperPod custom AMIs: root snapshot only; `ImageId` immutable in `update-cluster`; AWS AMI support policy does **not** apply to custom AMIs. | T1 + T2 | ami-support-policy, whats-new, HyperPod blog |
| 19 | HyperPod EKS: private subnets only, AWS VPC CNI only, version 1.18.3+. | T1 | eks-prerequisites |
| 20 | EFA device plugin (non-DRA) allocates each EFA device exclusively to one Pod. No sharing. | T1 | EKS device-management-efa |
| 21 | Docs staleness: `distributed-training-get-started` still recommends P4d/P4de as the most performant option for SageMaker distributed training. | T1 | distributed-training-get-started |
| 22 | `ml.p6-b200.48xlarge` is DPD-supported but absent from the task-governance topology-aware instance list. | T1 | two HyperPod docs |

---

## 8. What's new, 2025-2026 (chronological)

| Date | Item | Tier | URL |
|---|---|---|---|
| Oct 2024 | EC2 "EFA-only" interface type introduced (decoupled from ENA) | T1 | https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/ |
| Oct 17, 2024 | Last SMDDP release (v2.5.0) and last SMP release (v2.6.0) | T1 | data-parallel-release-notes, model-parallel-release-notes |
| May 13, 2025 | HyperPod Slurm AMI migrates Ubuntu 20.04 -> 22.04 | T1 | hyperpod-release-ami-slurm |
| Aug 2025 | HyperPod custom AMI support (must be built on HyperPod public base AMIs) | T1 | whats-new/2025/08/sagemaker-hyperpod-support-custom-ami/ |
| Aug 2025 | New HyperPod cluster creation experience (quick/custom setup, CFN export) | T1 | whats-new/2025/08/amazon-sagemaker-hyperpod-provides-cluster-setup/ |
| Jan 25, 2026 | HyperPod EKS AMI 1.0.x, EFA Installer 1.47.0 | T1 | ami-support-policy |
| Mar 30, 2026 | HyperPod Slurm AMI still on EFA Installer 1.45.1 | T1 | hyperpod-release-ami-slurm |
| Apr 2026 | HyperPod flexible instance groups (`InstanceRequirements`, multi-subnet) | T1 | whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/ |
| Apr 2026 | HyperPod automatic Slurm topology management (tree/block, auto-reconciled) | T1 | whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/ |
| Apr 2026 | SageMaker AI capacity-aware inference with automatic instance fallback (`InstancePools`) | T1 | whats-new/2026/04/amazon-sagemaker-ai-inf-auto-inst/ |
| Apr 23, 2026 | HyperPod Slurm AMI on EFA Installer 1.47.0, rdma-core 61.0-1 | T1 | hyperpod-release-ami-slurm |
| May 27, 2026 | Known issue published: Slurm 25.11 auto-resume requeues instead of resuming | T1 | hyperpod-release-ami-slurm |
| Jun 2026 | **HyperPod EFA-only network interfaces** (`ClusterNetworkInterface.InterfaceType = efa-only`) | T1 | whats-new/2026/06/amazon-sagemaker-hyperpod-efa-only/ |
| Jul 2026 | **HyperPod Disaggregated Prefill and Decode** (EFA RDMA for KV transfer) | T1 | whats-new/2026/7/amazon-sagemaker-hyperpod-dpd/ |
| Jul 09, 2026 | HyperPod Slurm AMI: Slurm 25.11.4, EFA 1.47.0, NVIDIA 580.159.04, CUDA default 13.0 (ARM64) | T1 | hyperpod-release-ami-slurm |
| Jul 10, 2026 | AWS ML blog publishes the DPD architecture in detail | T2 | disaggregated-prefill-and-decode blog |
| Jul 2026 | EKS adds EFA + placement group support on Auto Mode and Karpenter | T1 | whats-new/2026/07/amazon-eks-efa-placement-groups/ |
| Current | DLC PyTorch 2.13 SageMaker image: NCCL 2.30.7-1, EFA installer 1.49.0, GDRCopy 2.6, CUDA 13.3.0 | T1 | aws/deep-learning-containers |

---

## 9. Proposed section outline

New top-level nav item: **"SageMaker"** (place between `EKSIntegration` and `AIMLTraining`, or immediately after `EKSIntegration`).

File: `deep-dives/efa/src/sections/SageMaker.tsx`

```
## SageMaker and EFA: three different contracts
    Bold framing: SageMaker is not one thing. Training Jobs, HyperPod, and
    Inference each have a different EFA contract, and the differences are
    where people lose weeks.
    -> Diagram 1 (three-lane contract map)
    -> ColumnLayout: Training Jobs | HyperPod | Inference, one line each

## Training Jobs: EFA is implicit, not optional
    ### There is no "enable EFA" flag
        ResourceConfig member list, verbatim. No EFA field.
    ### What actually turns EFA on
        -> Diagram 2 (the four-layer gate)
        The instance type gate -> the container gate -> the env-var gate ->
        the libfabric gate
    ### The allowlist gotcha
        ExpandableSection with SM_EFA_NCCL_INSTANCES / SM_EFA_RDMA_INSTANCES
        verbatim + the torchrun_driver setup_env() snippet
        Table: instance type x in-allowlist? x accepted by ResourceConfig?
    ### Bring your own container
        efa_installer.sh --skip-kmod, /dev/infiniband/uverbs0..3, NCCL version
        match rule

## What the Deep Learning Containers ship
    Version table: DLC image -> CUDA / NCCL / EFA installer / libfabric /
    aws-ofi-nccl / GDRCopy
    ExpandableSection: LD_LIBRARY_PATH and the /opt/amazon layout
    ExpandableSection: three DLC install-script footguns (skip-kmod,
    1.44 path change, 1.48 NGC detection)

## Verifying EFA is actually being used
    The two-step recipe: fi_info -p efa, then the four NCCL log signatures
    Code block: AWS's own validate_all_reduce_performance_logs()
    ExpandableSection: full mpirun reference invocation + diagnostics checklist
    Callout: the DLC CI floor is 3 GB/s algbw at 1 GiB across 2x p4d

## SMDDP: read this before you reach for it
    Bold framing: SMDDP is a P4-era library. On P5 and later there is no
    SMDDP; there is NCCL over aws-ofi-nccl over EFA.
    -> Diagram 3 (SMDDP mesh vs NCCL ring, and the SM-count budget)
    Supported instance table (three rows)
    Frozen-since-Oct-2024 timeline
    ExpandableSection: the mechanism (mesh topology, GDRCopy, 24 SMs -> <9)
    ExpandableSection: the two-line backend swap + known CPU memory leak

## HyperPod: EFA as a managed, versioned component
    ### efa vs efa-only
        The IP-exhaustion problem and the June 2026 fix
    ### The AMI contract
        EFA is one of five components under the support policy
        AMI version table (EFA installer per release)
    ### Deep health checks reach the fabric
        Instance-level EFA latency/bandwidth benchmark + cluster-level NCCL
        Real log output, both pass and fail
        The ~2-hour cost and the three recommended configurations
    ### Topology awareness
        tree vs block, topology.yaml vs topology.conf, the flat-default trap
        EKS labels
    ### Auto-resume, and the Slurm 25.11 known issue

## HyperPod inference: the only place EFA carries inference traffic
    DPD architecture, the LMCache -> NIXL -> libfabric -> EFA stack
    Supported instance list (five types), same-AZ requirement
    The G-family PCIe caveat

## Where EFA is NOT used (negative results)
    StatusIndicator-driven list. Managed real-time endpoints. Multi-model
    endpoints. SMDDP on modern instances. SMP for inference.
    Explicit statement of what is documented absence vs undocumented.

## Getting started: your first EFA-backed SageMaker job
    (per the tech-deep-dive-outline skill's getting-started requirement)
    Five steps, each linking back up: pick an instance type on the allowlist,
    pick a DLC, submit, grep the log for the four signatures, then decide
    Training Job vs HyperPod.

## Decision guide: Training Job or HyperPod?
    Table across: job duration, failure tolerance, topology control,
    fabric observability, inference reuse
```

Also update:
- `Sources.tsx` — add roughly 30 new sources; keep tier grouping.
- `DecisionGuide.tsx` lines 312-317 — apply the three corrections in Section 0.
- `sources.md` — mirror.
- Glossary — add: DPD, NIXL, LMCache, GDRCopy, DRA, SPANK, DCGM, DLC, DLAMI, SMP, ENI (already?), `aws-ofi-nccl`.

---

## 10. Diagram ideas

### Diagram 1 — "Three contracts" lane map (inline SVG)

Three horizontal lanes, one per SageMaker surface, each showing the same four-stage pipeline so the reader can compare like-for-like:

`[ who provisions the ENI ] -> [ who installs libfabric+aws-ofi-nccl ] -> [ who sets FI_PROVIDER ] -> [ who verifies the fabric ]`

- **Training Jobs:** SageMaker service (implicit by instance type) -> AWS DLC *or you* -> SDK container driver, allowlist-gated -> pre-job NCCL check (P and G only)
- **HyperPod:** you, via `ClusterNetworkInterface` (`efa` / `efa-only`) -> HyperPod AMI (versioned, support-policy-covered) -> your job script / operator -> deep health checks (EFA latency+bandwidth, cluster NCCL)
- **Managed endpoints:** greyed-out lane with a "not exposed" badge across all four stages

The visual payoff is that the third lane is empty. That is the negative result rendered as a picture. Colour the "allowlist-gated" cell amber, since it is the silent-failure surface.

### Diagram 2 — "Four gates to EFA on a training job" (inline SVG, vertical funnel)

A funnel where a job falls out at any gate:

1. **Instance gate** — is the type EFA-capable? (accepted by `ResourceConfig`)
2. **Container gate** — does the image carry libfabric + `aws-ofi-nccl` + a matching NCCL? (`--skip-kmod`: host supplies the kernel module)
3. **Env gate** — is the type in `SM_EFA_NCCL_INSTANCES`? (`FI_PROVIDER=efa`, `NCCL_PROTO=simple`) and in `SM_EFA_RDMA_INSTANCES`? (`FI_EFA_USE_DEVICE_RDMA=1`, `RDMAV_FORK_SAFE=1`)
4. **Runtime gate** — does the log say `NET/OFI Selected provider is efa` and `NET/Libfabric/0/GDRDMA`?

Annotate gate 3 with the actual allowlist and a red flag on P5e/P5en/P6/Trn2. Annotate gate 4 with the exact grep strings, so the diagram doubles as a runbook.

### Diagram 3 — "SMDDP mesh vs NCCL ring, and the SM budget" (inline SVG, two panels)

**Left panel:** 4 nodes. NCCL ring/tree drawn as multi-hop arrows around the ring; SMDDP drawn as a full mesh with every pair connected, labelled "one hop." Caption the T1 line: "SMDDP avoids accumulating latency from multiple hops as it only needs one hop."

**Right panel:** a single A100 rendered as a 108-cell grid of streaming multiprocessors, with 24 cells shaded "NCCL collectives" next to 9 cells shaded "SMDDP collectives," and the remainder labelled "model compute."

Overlay a red "P4d / P4de only" band across the whole diagram, with the P5/P6/Trn2 families listed underneath as "not supported." That single band prevents the exact misreading the current `DecisionGuide.tsx` copy invites.

### Diagram 4 (bonus) — "DPD KV transfer stack" (inline SVG, layered)

Prefiller pod and decoder pod on separate `ml.p5.48xlarge` nodes, same AZ, with the four-layer transport drawn as nested bands between them:

`LMCache PD -> NIXL -> libfabric -> EFA (GPUDirect RDMA)`

Annotate the wire with "8,000-token KV transfer, Llama 3.3 70B, single-digit ms at 3,200 Gbps [T2]" and put the intelligent router above with the two paths (long prompt -> prefiller -> decoder; short prompt -> decoder direct).

### Diagram 5 (bonus) — "HyperPod topology resolution" (decision tree, inline SVG)

Partition composition -> plugin choice, straight from the T1 rules: all UltraServer -> `block`; all topology-capable, not all UltraServer -> `tree`; mixed UltraServer + topology-capable -> `tree`; any non-topology-capable group -> `flat`. Terminate the `flat` branch in a warning node, since that is the silent-degradation path.

---

## 11. Open questions / UNKNOWN

1. How many EFA devices are exposed to a training container on P5, P5e, P5en, P6, P6e-GB200, and Trn2? Only the P4d answer (4) is documented. **UNKNOWN.**
2. Does `EnableInterContainerTrafficEncryption=True` tunnel, exclude, or conflict with EFA traffic? **UNKNOWN.** No AWS source addresses it.
3. Does the SageMaker training-job pre-flight "verifies NCCL communication" check exercise the EFA path specifically, or would it pass on TCP fallback? **UNKNOWN.**
4. Does the HyperPod continuous health-monitoring agent (as opposed to deep health checks) detect EFA-only faults? The documented agent coverage list [T2] does not include EFA. **UNKNOWN.**
5. Is SMDDP formally deprecated, or merely unmaintained? No deprecation notice found; the only evidence is a frozen release cadence since Oct 2024 and a supported-instance list that stops at P4de. **Do not call it deprecated.** Say "no release since October 2024; supports no instance type newer than P4de."
6. Why do the SageMaker Python SDK (`SM_EFA_RDMA_INSTANCES`, no P5) and the DLC EFA test (`FI_EFA_USE_DEVICE_RDMA=1` on p5.48xlarge) disagree about P5? **UNKNOWN.** Present as a documented contradiction between two AWS-owned repositories.

---

## 12. Source list, grouped by tier

### Tier 1 — Official AWS documentation and API reference

1. Run Training with EFA — https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-training-efa.html
2. Get started with distributed training in Amazon SageMaker AI — https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training-get-started.html
3. Get compute capacity for SageMaker Training Jobs — https://docs.aws.amazon.com/sagemaker/latest/dg/train-get-capacity.html
4. Give SageMaker AI Training Jobs Access to Resources in Your Amazon VPC — https://docs.aws.amazon.com/sagemaker/latest/dg/train-vpc.html
5. Protect Communications Between ML Compute Instances in a Distributed Training Job — https://docs.aws.amazon.com/sagemaker/latest/dg/train-encrypt.html
6. Cluster repairs for GPU errors — https://docs.aws.amazon.com/sagemaker/latest/dg/model-checkpoints-cluster-repair.html
7. API_ResourceConfig — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ResourceConfig.html
8. API_ProductionVariant — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ProductionVariant.html
9. API_ClusterNetworkInterface — https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ClusterNetworkInterface.html
10. Aws::SageMaker::Types::AdditionalEnis — https://docs.aws.amazon.com/sdk-for-ruby/v3/api/Aws/SageMaker/Types/AdditionalEnis.html
11. Run distributed training with the SMDDP library — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel.html
12. Introduction to the SMDDP library — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-intro.html
13. Supported frameworks, AWS Regions, and instances types (SMDDP) — https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html
14. SMDDP FAQ — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-faq.html
15. SMDDP configuration tips — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-config.html
16. SMDDP release notes — https://docs.aws.amazon.com/sagemaker/latest/dg/data-parallel-release-notes.html
17. SMP release notes — https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-release-notes.html
18. Compatibility with the SMDDP library (SMP v2) — https://docs.aws.amazon.com/sagemaker/latest/dg/model-parallel-core-features-v2-smddp-allgather.html
19. Amazon SageMaker HyperPod — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod.html
20. Amazon SageMaker HyperPod AMI — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami.html
21. SageMaker HyperPod AMI releases for Slurm — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-release-ami-slurm.html
22. Amazon SageMaker HyperPod AMI support policy — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ami-support-policy.html
23. SageMaker HyperPod references (DLAMI) — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-ref.html
24. Custom AMIs for SageMaker HyperPod clusters — https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-custom-ami-support.html
25. SageMaker HyperPod FAQs (Slurm) — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-faq-slurm.html
26. Deep health checks — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-deep-health-checks.html
27. Suggested resilience configurations — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-config-tips.html
28. Resilience-related Kubernetes labels — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-resiliency-node-labels.html
29. Automatic node recovery and auto-resume — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-resiliency-slurm-auto-resume.html
30. Using topology-aware scheduling in SageMaker HyperPod — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html
31. Topology-aware scheduling in HyperPod task governance — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html
32. Getting started with Amazon EKS support in SageMaker HyperPod — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-prerequisites.html
33. SageMaker HyperPod cluster metrics — https://docs.aws.amazon.com/sagemaker/latest/dg/hyperpod-observability-cluster-metrics.html
34. Deploying models on Amazon SageMaker HyperPod — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html
35. Disaggregated Prefill and Decode for HyperPod inference — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-dpd.html
36. Deploy models for real-time inference — https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints-deploy-models.html
37. Instance recommendations for multi-model endpoint deployments — https://docs.aws.amazon.com/sagemaker/latest/dg/multi-model-endpoint-instance.html
38. Reserve Flexible Training Plans for ML workloads — https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html
39. Manage EFA devices on Amazon EKS — https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html
40. What's New: HyperPod EFA-only network interfaces (Jun 2026) — https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-sagemaker-hyperpod-efa-only/
41. What's New: EFA update for scalability with AI/ML (Oct 2024) — https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/
42. What's New: HyperPod disaggregated prefill and decode (Jul 2026) — https://aws.amazon.com/about-aws/whats-new/2026/7/amazon-sagemaker-hyperpod-dpd/
43. What's New: HyperPod flexible instance groups (Apr 2026) — https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/
44. What's New: HyperPod automatic Slurm topology management (Apr 2026) — https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/
45. What's New: HyperPod custom AMI support (Aug 2025) — https://aws.amazon.com/about-aws/whats-new/2025/08/sagemaker-hyperpod-support-custom-ami/
46. What's New: HyperPod cluster setup experience (Aug 2025) — https://aws.amazon.com/about-aws/whats-new/2025/08/amazon-sagemaker-hyperpod-provides-cluster-setup/
47. What's New: SageMaker AI capacity-aware inference with instance fallback (Apr 2026) — https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-ai-inf-auto-inst/
48. What's New: EKS EFA and placement groups on Auto Mode / Karpenter (Jul 2026) — https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-eks-efa-placement-groups/

### Tier 1 — Official AWS source code (GitHub, retrieved 2026-08-01)

49. `aws/sagemaker-python-sdk` @ `master` — `sagemaker-train/src/sagemaker/train/container_drivers/common/utils.py` (`SM_EFA_NCCL_INSTANCES`, `SM_EFA_RDMA_INSTANCES`)
50. `aws/sagemaker-python-sdk` @ `master` — `sagemaker-train/src/sagemaker/train/container_drivers/distributed_drivers/torchrun_driver.py` (`setup_env()`)
51. `aws/sagemaker-python-sdk` @ `master` — `sagemaker-train/src/sagemaker/train/container_drivers/distributed_drivers/mpi_utils.py` (mpirun EFA flags)
52. `aws/sagemaker-python-sdk` @ tag `v2.257.0` — `src/sagemaker/fw_utils.py` (`SM_DATAPARALLEL_SUPPORTED_INSTANCE_TYPES`, `SMDISTRIBUTED_SUPPORTED_STRATEGIES`, `TRAINIUM_SUPPORTED_DISTRIBUTION_STRATEGIES`)
53. `aws/deep-learning-containers` @ `main` — `docker/base/cu132/Dockerfile` (NCCL 2.29.7-1, EFA 1.49.0 -> libfabric 2.4.0amzn5.0 + aws-ofi-nccl 1.20.0, GDRCopy 2.6)
54. `aws/deep-learning-containers` @ `main` — `docker/pytorch/Dockerfile.cuda` (runtime and sagemaker stages, PATH/LD_LIBRARY_PATH, nccl-tests build)
55. `aws/deep-learning-containers` @ `main` — `.github/config/image/pytorch/2.13-sagemaker-cuda.yml` and `2.13-ec2-cuda.yml`
56. `aws/deep-learning-containers` @ `main` — `scripts/docker/common/install_efa_amzn2023.sh`
57. `aws/deep-learning-containers` @ `main` — `test/efa/scripts/nccl_allreduce.sh`
58. `aws/deep-learning-containers` @ `main` — `test/efa/test_efa.py`
59. `aws/deep-learning-containers` @ `main` — `test/sanity/scripts/check_nccl_efa_gdrcopy.sh`

### Tier 2 — AWS blogs

60. Training large language models on Amazon SageMaker: Best practices — https://aws.amazon.com/blogs/machine-learning/training-large-language-models-on-amazon-sagemaker-best-practices/
61. Disaggregated prefill and decode for LLM inference on SageMaker HyperPod (10 Jul 2026) — https://aws.amazon.com/blogs/machine-learning/disaggregated-prefill-and-decode-for-llm-inference-on-sagemaker-hyperpod/
62. Introducing Amazon EKS support in Amazon SageMaker HyperPod — https://aws.amazon.com/blogs/machine-learning/introducing-amazon-eks-support-in-amazon-sagemaker-hyperpod/
63. Introducing Amazon SageMaker HyperPod to train foundation models at scale — https://aws.amazon.com/blogs/machine-learning/introducing-amazon-sagemaker-hyperpod-to-train-foundation-models-at-scale/
64. Accelerate pre-training of Mistral's Mathstral model with highly resilient clusters on SageMaker HyperPod — https://aws.amazon.com/blogs/machine-learning/accelerate-pre-training-of-mistrals-mathstral-model-with-highly-resilient-clusters-on-amazon-sagemaker-hyperpod/
65. Reduce ML training costs with Amazon SageMaker HyperPod — https://aws.amazon.com/blogs/machine-learning/reduce-ml-training-costs-with-amazon-sagemaker-hyperpod/
66. Amazon SageMaker HyperPod enhances ML infrastructure with scalability and customizability — https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-hyperpod-enhances-ml-infrastructure-with-scalability-and-customizability/
67. Train and deploy AI models at trillion-parameter scale with HyperPod support for P6e-GB200 UltraServers — https://aws.amazon.com/blogs/machine-learning/train-and-deploy-ai-models-at-trillion-parameter-scale-with-amazon-sagemaker-hyperpod-support-for-p6e-gb200-ultraservers/
68. New performance improvements in Amazon SageMaker model parallel library — https://aws.amazon.com/blogs/machine-learning/new-performance-improvements-in-amazon-sagemaker-model-parallel-library/
69. Amazon SageMaker model parallel library now accelerates PyTorch FSDP workloads by up to 20% — https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-model-parallel-library-now-accelerates-pytorch-fsdp-workloads-by-up-to-20/
70. Distributed training and efficient scaling with the SageMaker Model Parallel and Data Parallel Libraries — https://aws.amazon.com/blogs/machine-learning/distributed-training-and-efficient-scaling-with-the-amazon-sagemaker-model-parallel-and-data-parallel-libraries/
71. Configure and verify a distributed training cluster with AWS Deep Learning Containers on Amazon EKS — https://aws.amazon.com/blogs/machine-learning/configure-and-verify-a-distributed-training-cluster-with-aws-deep-learning-containers-on-amazon-eks/
72. Distributed training with Amazon EKS and Torch Distributed Elastic — https://aws.amazon.com/blogs/machine-learning/distributed-training-with-amazon-eks-and-torch-distributed-elastic/
73. Simplify AI infrastructure for AWS Trainium and EFA with Kubernetes Dynamic Resource Allocation — https://aws.amazon.com/blogs/containers/simplify-ai-infrastructure-for-aws-trainium-and-elastic-fabric-adapter-with-kubernetes-dynamic-resource-allocation/
74. Building secure machine learning environments with Amazon SageMaker — https://aws.amazon.com/blogs/machine-learning/building-secure-machine-learning-environments-with-amazon-sagemaker/
75. How Amazon scaled Rufus by building multi-node inference using AWS Trainium chips and vLLM — https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/
76. Scale foundation model inference to hundreds of models with Amazon SageMaker, Part 1 — https://aws.amazon.com/blogs/machine-learning/scale-foundation-model-inference-to-hundreds-of-models-with-amazon-sagemaker-part-1/
77. Benchmark and optimize endpoint deployment in Amazon SageMaker JumpStart — https://aws.amazon.com/blogs/machine-learning/benchmark-and-optimize-endpoint-deployment-in-amazon-sagemaker-jumpstart/
78. Scaling your LLM inference workloads: multi-node deployment with TensorRT-LLM and Triton on Amazon EKS (AWS HPC Blog) — https://aws.amazon.com/blogs/hpc/scaling-your-llm-inference-workloads-multi-node-deployment-with-tensorrt-llm-and-triton-on-amazon-eks/

### Tier 3 — third-party

None used as load-bearing fact in this report.

### Tier 4

None.

---

*All URLs accessed 2026-08-01. Where a claim could not be traced to a first-party source it is marked UNKNOWN and left unstated. Where two AWS-owned sources disagree, both are shown under CONTRADICTION.*
