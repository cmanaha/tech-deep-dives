# EFA on Amazon EKS — Research Refresh

> **CORRECTION, added 2026-08-02, then itself corrected.** This document cites
> `aws/aws-eks-best-practices` `aiml_networking.adoc` on the `master` branch.
> An initial reading concluded the quotes were fabricated, because at `master`
> (head `71a660c6`) that file is a 55-line pre-2026-07-30 revision containing
> none of them. That conclusion was wrong. The repository's default branch is
> `mainline`, and at commit `828f285d` (2026-07-30, two days before the access
> date here) every quoted passage is present verbatim.
>
> So this is a wrong-branch pin, not a misattribution. The content is sound and
> the claims stand. The fix is to re-pin these references to `828f285d` rather
> than to remove them. The published section had already re-sourced the same
> corrections from the EC2 User Guide `efa-start.html`, and the citation
> re-verification pass confirms no `aws-eks-best-practices` citation ships in
> the dive at all.
>
> Wider gap this exposed: `research/**.md` carries 65 branch-pinned GitHub URLs
> (`/blob/main/`, `/blob/master/`) that neither `scripts/gates/pinned-refs.sh`
> nor `scripts/audit/verify-citations.sh` covers, because both scan `src/` only.
> This defect class is invisible to the current gates.

**Researched:** 2026-08-01
**Scope:** How EFA (Elastic Fabric Adapter) integrates with Amazon EKS, with emphasis on the EKS AMI layer.
**Target artifact:** `deep-dives/efa/src/sections/EKSIntegration.tsx` (currently ~318 prose words)

## Sourcing conventions used in this document

| Tier | Meaning | Used here |
| --- | --- | --- |
| Tier 1 | Official AWS docs, AWS API reference, official AWS source repos (`awslabs/amazon-eks-ami`, `aws/eks-charts`, `aws/karpenter-provider-aws`, `awslabs/awsome-distributed-ai`, `awslabs/ai-on-eks`) | Primary basis |
| Tier 2 | AWS blogs, AWS best-practices guides, re:Invent talks | `aws/aws-eks-best-practices` |
| Tier 3 | Third-party | Not used |
| Tier 4 | Tutorials / random blogs | Not used |

Every fact below carries a source URL and `accessed 2026-08-01`. Where sources are silent I write **UNKNOWN**. Where they disagree I write **CONTRADICTION**.

---

## 1. The EKS AMI layer (the part Carlos wants done properly)

### 1.1 Which AMI variants exist, and which ship EFA

**[TIER 1]** The EKS-optimized accelerated AMI variants and the instance types they cover:

| EKS AMI variant | EC2 instance types |
| --- | --- |
| AL2023 x86_64 NVIDIA | p6-b300, p6-b200, p5, p5e, p5en, p4d, p4de, p3, p3dn, g7e, gr6, g6, g6e, g6f, gr6f, g5, g4dn |
| AL2023 ARM NVIDIA | p6e-gb200, p6e-gb300, g5g |
| AL2023 x86_64 Neuron | inf1, inf2, trn1, trn2 |
| Bottlerocket x86_64 aws-k8s-nvidia | p6-b300, p6-b200, p5, p5e, p5en, p4d, p4de, p3, p3dn, g7e, gr6, g6, g6e, g6f, gr6f, g5, g4dn |
| Bottlerocket aarch64/arm64 aws-k8s-nvidia | g5g |
| Bottlerocket x86_64 aws-k8s | inf1, inf2, trn1, trn2 |

Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** AL2 lineage is over. "Amazon EKS stopped publishing EKS-optimized Amazon Linux 2 (AL2) AMIs on November 26, 2025. AL2023 and Bottlerocket based AMIs for Amazon EKS are available for all supported Kubernetes versions including 1.33 and higher."
Sources:
- https://github.com/awslabs/amazon-eks-ami (README.md) — Tier 1 — accessed 2026-08-01
- https://docs.aws.amazon.com/eks/latest/userguide/eks-ami-build-scripts.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** The `awslabs/amazon-eks-ami` repo now carries only one Packer template directory: `templates/al2023`. There is no `templates/al2` directory in `main`. (The AL2 usage doc `doc/usage/al2.md` survives with a deprecation banner but the build template is gone.)
Source: https://github.com/awslabs/amazon-eks-ami/tree/main/templates — Tier 1 — accessed 2026-08-01

**[TIER 1]** "Any newly created managed node groups in clusters on version `1.30` or newer will automatically default to using AL2023 as the node operating system."
Source: https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

### 1.2 What is actually preinstalled — and the `--minimal` detail that matters most

**[TIER 1]** The EKS AL2023 NVIDIA AMI contents, beyond the standard EKS AMI components:
- NVIDIA driver
- NVIDIA CUDA user mode driver
- NVIDIA container toolkit
- NVIDIA fabric manager
- NVIDIA persistenced
- NVIDIA IMEX driver
- NVIDIA NVLink Subnet Manager
- **EFA minimal (kernel module and rdma-core)**

Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** The EKS AL2023 Neuron AMI contents, beyond standard:
- Neuron driver (`aws-neuronx-dkms`)
- Neuron tools (`aws-neuronx-tools`)
- **EFA minimal (kernel module and rdma-core)**

Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Bottlerocket: "The minimal dependencies for EFA (kernel module and rdma-core) are installed in **all** Bottlerocket variants."
Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 1] The mechanism.** The AMI build runs the standard AWS EFA installer with the `--minimal` flag:

```bash
# templates/al2023/provisioners/install-efa.sh (verbatim excerpt)
if [ "$ENABLE_EFA" != "true" ]; then
  exit 0
fi
EFA_VERSION="latest"
EFA_PACKAGE="aws-efa-installer-${EFA_VERSION}.tar.gz"
EFA_URL="https://efa-installer.amazonaws.com"
...
tar -xf ${EFA_PACKAGE} && cd aws-efa-installer
sudo ./efa_installer.sh --minimal -y
...
# Erase efa-nv-peermem on non-NVIDIA AMIs. It owns efa_nv_peermem.conf and loads the
# nvidia kmod at boot, which fails where there is no nvidia driver.
if [ "${ENABLE_ACCELERATOR:-}" != "nvidia" ]; then
  sudo rpm -e --nodeps efa-nv-peermem 2> /dev/null || true
fi
```

Source: https://github.com/awslabs/amazon-eks-ami/blob/main/templates/al2023/provisioners/install-efa.sh — Tier 1 — accessed 2026-08-01

Note the GPG verification step: the script imports `aws-efa-installer.key`, downloads the `.sig`, and `exit 2`s on `gpg --verify` failure. It also swaps `gnupg2-minimal` for `gnupg2-full` for the duration of the build (AL2023 issue #243) and swaps back afterwards.

**[TIER 1] What `--minimal` means.** From the EC2 EFA getting-started guide: "To install the EFA software **without Libfabric and Open MPI**, run the following command. `$ sudo ./efa_installer.sh -y --minimal`". The full (non-minimal) install puts "Libfabric ... to `/opt/amazon/efa`. Open MPI 4.1 ... to `/opt/amazon/openmpi`. Open MPI 5 ... to `/opt/amazon/openmpi5`."
Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html — Tier 1 — accessed 2026-08-01

**This is the load-bearing fact for the whole section.** The EKS AMI gives you the kernel driver, the device nodes, and `rdma-core`. It does **not** give you libfabric, Open MPI, aws-ofi-nccl, or NCCL. Those live in your container image. The host owns the hardware plane; the container owns the user-space fabric stack.

**[TIER 1] aws-ofi-nccl is now bundled with the EFA installer** (in the full install, not `--minimal`). The AWS reference NCCL-tests Dockerfile comment: "EFA 1.48 ships the OFI NCCL plugin at `/opt/amazon/ofi-nccl/lib/` (no arch subdir). Keep the legacy `x86_64/aarch64` entries for back-compat with images rebuilt against older EFA installers." The README variable table marks `AWS_OFI_NCCL_VERSION` as "*(deprecated)* — AWS OFI NCCL plugin is now bundled with EFA installer".
Sources:
- https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/nccl-tests.Dockerfile — Tier 1 — accessed 2026-08-01
- https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/README.md — Tier 1 — accessed 2026-08-01

### 1.3 Concrete component versions in a shipped AMI (AL2023, release v20260728)

**[TIER 1]** From the `awslabs/amazon-eks-ami` release notes for **v20260728** (published 2026-07-29), Kubernetes 1.36 table:

| Package | AL2023_x86_64_NVIDIA | AL2023_x86_64_NEURON | AL2023_x86_64_STANDARD | AL2023_ARM_64_NVIDIA | AL2023_ARM_64_STANDARD |
| --- | --- | --- | --- | --- | --- |
| `amazon-ssm-agent` | 3.3.4624.0-1.amzn2023 (all variants) | | | | |
| `aws-neuronx-dkms` | — | 2.29.0.0-dkms | — | — | — |
| `containerd` | 2.2.5-1.amzn2023.0.1 (all variants) | | | | |
| **`efa`** | **3.1.0-1.amzn2023 (all five variants)** | | | | |
| `ena` | 2.17.2g (all variants) | | | | |
| `kernel6.18` | 6.18.38-76.139.amzn2023 (all variants) | | | | |
| `kmod-nvidia-latest-dkms` | 580.159.03-1.amzn2023 | — | — | 580.159.03-1.el9 | — |
| `nvidia-container-toolkit` | 1.19.1-1 | — | — | 1.19.1-1 | — |
| `runc` | 1.3.5-1.amzn2023.0.2 (all variants) | | | | |

Source: https://github.com/awslabs/amazon-eks-ami/releases (tag `v20260728`) — Tier 1 — accessed 2026-08-01

**[TIER 1]** AMI naming pattern from the same release: `amazon-eks-node-al2023-x86_64-nvidia-1.36-v20260728`, `amazon-eks-node-al2023-x86_64-neuron-1.36-v20260728`, `amazon-eks-node-al2023-arm64-nvidia-1.36-v20260728`, etc. AMI type identifiers are `AL2023_x86_64_NVIDIA`, `AL2023_x86_64_NEURON`, `AL2023_ARM_64_NVIDIA`, `AL2023_x86_64_STANDARD`, `AL2023_ARM_64_STANDARD`.
Source: https://github.com/awslabs/amazon-eks-ami/releases — Tier 1 — accessed 2026-08-01

**[TIER 1]** Kernel version varies by Kubernetes minor: K8s 1.36 builds on `kernel-6.18`, K8s 1.33-1.35 on `kernel-6.12`, K8s 1.31-1.32 on `kernel-6.12` (ARM NVIDIA) / `kernel-6.1` (x86 standard, neuron). Base source AMI is `al2023-ami-minimal-2023.12.20260727.0-kernel-<ver>-<arch>`.
Source: https://github.com/awslabs/amazon-eks-ami/releases (v20260728 AMI Details table) — Tier 1 — accessed 2026-08-01

**[TIER 1]** Driver policy statements worth quoting in the app:
- "The EKS-optimized AL2023 NVIDIA AMIs support kernel 6.12 for Kubernetes versions 1.33 and above, and the NVIDIA driver 580 version for all Kubernetes versions. The NVIDIA 580 driver is required to use CUDA 13+."
- "When building custom AMIs with the EKS-optimized AMIs as the base, it is not recommended or supported to run an operating system upgrade (i.e. `dnf upgrade`) or upgrade any of the Kubernetes or GPU packages that are included in the EKS-optimized AMIs, as this risks breaking component compatibility."
- "When building custom AMIs for GPU instances, it is recommended to build separate custom AMIs for each instance type generation and family that you will run. The EKS-optimized accelerated AMIs selectively install drivers and packages at runtime based on the underlying instance type generation and family."

Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 1] G7 gap (live, as of 2026-08-01).** "The G7 EC2 instance type requires NVIDIA driver version 595 or later. The EKS-optimized accelerated AMIs currently include NVIDIA driver version 580, which does not support G7 instances. To use G7 instances with Amazon EKS, you must build a custom AMI with NVIDIA driver version 595 using the EKS AMI build scripts." With Karpenter, AWS recommends excluding the `g7` family from NodePools using automatic AMI selection.
Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

### 1.4 CONTRADICTION: does the *standard* (non-accelerated) AL2023 EKS AMI have EFA?

- **Side A [TIER 1, docs]:** "The EKS-optimized AL2023 accelerated AMIs (NVIDIA and Neuron) and all Bottlerocket AMIs include the host-level components required to use EFA." — this phrasing scopes EFA to the *accelerated* AL2023 variants.
  Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01
- **Side B [TIER 1, build source + release notes]:** `templates/al2023/variables-default.json` sets `"enable_efa": "true"` as the **default for every AL2023 build**, with no accelerator gate; `install-efa.sh` only checks `$ENABLE_EFA`, not `$ENABLE_ACCELERATOR`. Release v20260728 lists package `efa 3.1.0-1.amzn2023` spanning all five AL2023 variants, including `AL2023_x86_64_STANDARD` and `AL2023_ARM_64_STANDARD`.
  Sources: https://github.com/awslabs/amazon-eks-ami/blob/main/templates/al2023/variables-default.json , https://github.com/awslabs/amazon-eks-ami/blob/main/templates/al2023/provisioners/install-efa.sh , https://github.com/awslabs/amazon-eks-ami/releases — Tier 1 — accessed 2026-08-01

**Resolution:** the code and release notes say the EFA kernel package is present on standard AL2023 EKS AMIs too; the prose docs scope the *support statement* to the accelerated variants. Safest framing for the app: "every published AL2023 EKS AMI in release v20260728 carries the `efa` kernel package; AWS documents EFA support only for the accelerated (NVIDIA, Neuron) and Bottlerocket variants." Do not claim standard AL2023 is a supported EFA path.

Note also that `install-efa.sh` explicitly `rpm -e`'s `efa-nv-peermem` on non-NVIDIA AMIs, which is evidence AWS deliberately runs the EFA install on non-NVIDIA variants.

### 1.5 How to inspect what is actually in the AMI

**[TIER 1]**
- `dnf list installed` on a running instance: "You can find the list of installed packages and their versions on a running EC2 instance with the `dnf list installed` command." (https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html)
- `fi_info -p efa -t FI_EP_RDM` confirms libfabric + EFA provider. Expected output shape:
  ```
  provider: efa
      fabric: EFA-fe80::94:3dff:fe89:1b70
      domain: efa_0-rdm
      version: 2.0
      type: FI_EP_RDM
      protocol: FI_PROTO_EFA
  ```
  (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html)
  **Caveat to state in the app:** on an EKS AL2023 AMI this command will *not* work on the host, because `--minimal` skipped libfabric. Run it inside the workload container instead.
- Build-time introspection: `make help` and the template variable tables at https://awslabs.github.io/amazon-eks-ami/usage/al2023/ (https://docs.aws.amazon.com/eks/latest/userguide/eks-ami-build-scripts.html)
- Release-notes diffing: https://github.com/awslabs/amazon-eks-ami/releases carries a per-release package version table per AMI type.

**[TIER 1]** Rebuilding the same AMI yourself:
```bash
make k8s=1.36 os_distro=al2023 \
  enable_accelerator=nvidia \
  nvidia_driver_major_version=580 \
  enable_efa=true
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/eks-ami-build-scripts.html — Tier 1 — accessed 2026-08-01

The Makefile composes the AMI name from `AMI_VARIANT`: `amazon-eks` + `-al2023` + (`-arm64`) + (`-fips`) + (`-$(enable_accelerator)`), producing e.g. `amazon-eks-al2023-nvidia-node-1.36-v20260801`.
Source: https://github.com/awslabs/amazon-eks-ami/blob/main/Makefile — Tier 1 — accessed 2026-08-01

### 1.6 What you still have to install yourself

**[TIER 1]** "The EKS AL2023 and Bottlerocket AMIs **do not include** the EFA DRA driver or EFA device plugin, and these must be installed separately on your cluster before deploying workloads."
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Also not in the AL2023 NVIDIA AMI: "The EKS-optimized AL2023 NVIDIA AMIs do not include the NVIDIA Kubernetes device plugin or the NVIDIA DRA driver, and these must be installed separately." (Bottlerocket NVIDIA *does* include the NVIDIA device plugin.)
Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Not in the AL2023 Neuron AMI: "The EKS-optimized AL2023 Neuron AMIs do not include the Neuron DRA driver, Neuron Kubernetes device plugin, or the Neuron Kubernetes scheduler extension."
Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

**[TIER 2]** In the container image: "Ensure your container image includes NCCL and the aws-ofi-nccl plugin (which enables NCCL to use EFA via libfabric). MPI may also be required depending on your training framework's launcher."
Source: https://github.com/aws/aws-eks-best-practices/blob/master/latest/bpg/aiml/aiml_networking.adoc — Tier 2 — accessed 2026-08-01

**[TIER 1] Reference container stack** (AWS's own NCCL-tests image, current defaults):

| Component | Version |
| --- | --- |
| CUDA base | 13.0.2 (`nvcr.io/nvidia/cuda:13.0.2-devel-ubuntu22.04`) |
| GDRCopy | v2.5.2 |
| EFA installer | 1.48.0 (full install, inside container) |
| aws-ofi-nccl | bundled with EFA installer (variable deprecated) |
| NCCL | v2.30.4-1 |
| nccl-tests | v2.18.3 |

`LD_LIBRARY_PATH` in that image: `/usr/local/cuda/extras/CUPTI/lib64:/opt/amazon/openmpi/lib:/opt/nccl/build/lib:/opt/amazon/efa/lib:/opt/amazon/ofi-nccl/lib:/opt/amazon/ofi-nccl/lib/aarch64-linux-gnu:/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu:/usr/local/lib`
`PATH`: `/opt/amazon/openmpi/bin/:/opt/amazon/efa/bin:/usr/bin:/usr/local/bin`
The image is built with `NVCC_GENCODE` covering `sm_80`, `sm_86`, `sm_89`, `sm_90`, `sm_100`, `sm_103` (A100, Ada, H100/H200, B200/GB200, B300/GB300). PTX is not embedded.
Sources: https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/nccl-tests.Dockerfile , https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/README.md — Tier 1 — accessed 2026-08-01

**[TIER 1]** Latest published EFA installer version referenced by EC2 docs: **1.49.0** (`https://efa-installer.amazonaws.com/aws-efa-installer-1.49.0.tar.gz`). GPG fingerprint to verify: `4E90 91BC BB97 A96B 26B1 5E59 A054 80B1 DD2D 3CCC`. Since EFA installer 1.48.0 there is a `--check-signatures` flag that verifies each individual RPM/DEB.
Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** aws-ofi-nccl standalone releases (if you pin it rather than take the bundled one): v1.20.0 (2026-06-25), v1.19.2 (2026-05-16), v1.19.1 (2026-05-05), v1.19.0 (2026-04-10), v1.18.0 (2026-01-21).
Source: https://github.com/aws/aws-ofi-nccl/releases — Tier 1 — accessed 2026-08-01

---

## 2. Two device-management mechanisms (this is the 2026 headline)

**[TIER 1]** "Amazon EKS supports two mechanisms for managing EFA devices in EKS clusters: the **EFA Dynamic Resource Allocation (DRA) driver (DRANET)** and the **EFA device plugin**."

"It's recommended to use the EFA DRA driver (DRANET) for new deployments on EKS clusters running Kubernetes version 1.34 or later with EKS managed node groups or self-managed node groups."

"The EFA DRA driver is **not supported with Karpenter or EKS Auto Mode**. Use the EFA device plugin with Karpenter and EKS Auto Mode."

Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

### 2.1 Comparison table (verbatim from AWS)

| Feature | EFA DRA driver | EFA device plugin |
| --- | --- | --- |
| Minimum Kubernetes version | 1.34 | All EKS-supported Kubernetes versions |
| EKS Compute | Managed node groups, self-managed nodes | EKS Auto Mode, Karpenter, managed node groups, self-managed nodes |
| EKS-optimized AMIs | AL2023 (NVIDIA, Neuron), Bottlerocket | AL2023 (NVIDIA, Neuron), Bottlerocket |
| Device advertisement | Rich attributes via `ResourceSlice` objects including device type, topology, and PCIe locality | Integer count of `vpc.amazonaws.com/efa` extended resources |
| GPU-EFA affinity | DRA-native topology-awareness | Automatic topology-awareness (EKS-optimized AL2023 AMIs only) |
| Neuron-EFA affinity | DRA-native topology-awareness | Automatic topology-awareness (EKS-optimized AL2023 AMIs only) |
| Device sharing | Multiple Pods can share the same EFA device through shared `ResourceClaim` references | Not supported. Each EFA device is exclusively allocated to one Pod. |

Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** "Do not install the EFA DRA driver on nodes where the EFA device plugin is running. The two mechanisms cannot coexist on the same node." (upstream tracking: Kubernetes KEP-5004)
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

---

## 3. `aws-efa-k8s-device-plugin` — what it advertises and how it installs

### 3.1 Resource name and semantics

**[TIER 1]** "The EFA Kubernetes device plugin advertises EFA devices as `vpc.amazonaws.com/efa` extended resources. You request EFA devices in container resource requests and limits."
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** The chart's own NOTES.txt, verbatim: `EFA device plugin is installed, it can be requested as 'vpc.amazonaws.com/efa' resource.`
Source: https://github.com/aws/eks-charts/blob/master/stable/aws-efa-k8s-device-plugin/templates/NOTES.txt — Tier 1 — accessed 2026-08-01

**[TIER 1]** Verification commands and expected output:
```bash
kubectl get nodes "-o=custom-columns=NAME:.metadata.name,EFA:.status.allocatable.vpc\.amazonaws\.com/efa"
# NAME                                           EFA
# ip-192-168-11-225.us-west-2.compute.internal   4
# ip-192-168-24-96.us-west-2.compute.internal    4
```
Also visible under node `Capacity:` / `Allocatable:` as `vpc.amazonaws.com/efa: 4`.
Sources: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html , https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

### 3.2 How many devices per instance type

**[TIER 1]** "You can assign up to one EFA per network card. An EFA counts as a network interface. To see how many EFAs are available for each instance type that has EFA, see the Network cards list in the Amazon EC2 User Guide."
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**Important nuance:** the advertised count is the number of EFA devices **actually attached at launch**, not the instance-type maximum. `eksctl efaEnabled: true` attaches all of them; Karpenter without a `networkInterfaces` block "will launch instances with all EFA devices configured"; a hand-written launch template attaches exactly what you list.
Sources: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html , https://github.com/aws/karpenter-provider-aws/blob/main/designs/efa-for-static-capacity.md — Tier 1 — accessed 2026-08-01

Per-instance network-card counts from EC2 docs (Tier 1, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html, accessed 2026-08-01):

| Instance | Network cards | Documented EFA layout | Bandwidth notes |
| --- | --- | --- | --- |
| `p5.48xlarge`, `p5e.48xlarge` | 32 | 1 ENA on NCI 0/DI 0; EFA-only on NCI 0/DI 1 and NCI 1-31/DI 0 → **32 EFA devices** | 3,200 Gbps total; up to 800 Gbps of that for IP |
| `p6-b200.48xlarge` | 8 | 1 ENA on NCI 0/DI 0; EFA-only on NCI 0/DI 1 and NCI 1-7/DI 0 → **8 EFA devices** | 3,200 Gbps total; up to 1,600 Gbps ENA; each card 400 Gbps EFA / 200 Gbps ENA |
| `p6-b300.48xlarge` | 17 | 1 ENA on NCI 0/DI 0 (350 Gbps max); EFA-only on NCI 1-16/DI 0 → **16 EFA devices** | up to 6,400 Gbps EFA, up to 3,870 Gbps ENA |
| `p6e-gb200.36xlarge` | up to 17 | EFA-only supported on NCI [1,3,5,7,9,11,13,15]; NCI [2,4,6,8,10,12,14,16] do up to 200 Gbps ENA or EFA. Recommended: 4 EFA-only interfaces at 400 Gbps each, or 8 at 200 Gbps each → **1,600 Gbps** | NCI pairs share a physical NIC; NCI pairs [1,3],[5,7],[9,11],[13,15] share a GPU |
| `p4d.24xlarge` | UNKNOWN from the pages fetched (EKS walkthrough uses p4d but does not state the count) | — | — |

**CONTRADICTION on p5 device count in AWS's own example:** the EKS node-efa walkthrough narrates "each worker requests eight GPUs, 5120Mi of `hugepages-2Mi`, **four EFAs**, and 8000Mi of memory, which effectively means each worker consumes all the resources of a `p5.48xlarge` instance", while the YAML immediately below it requests `vpc.amazonaws.com/efa: 32` and `memory: 32000Mi`. The YAML matches the 32-network-card reality of p5.48xlarge; the prose does not.
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

### 3.3 DaemonSet install (Helm, current path)

**[TIER 1]**
```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install efa eks/aws-efa-k8s-device-plugin -n kube-system
kubectl get daemonset -n kube-system efa-aws-efa-k8s-device-plugin
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Chart metadata as of 2026-08-01: chart `version: v0.5.30`, `appVersion: v0.5.20`, image `602401143452.dkr.ecr.us-west-2.amazonaws.com/eks/aws-efa-k8s-device-plugin:v0.5.20`.
Source: https://github.com/aws/eks-charts/blob/master/stable/aws-efa-k8s-device-plugin/Chart.yaml — Tier 1 — accessed 2026-08-01

**[TIER 1]** Recent chart/image release cadence (commits on `stable/aws-efa-k8s-device-plugin/values.yaml`): 0.5.13 (2025-12-25), 0.5.17 (2026-03-26), 0.5.18 (2026-04-29), 0.5.19 (2026-05-22), 0.5.20 (2026-06-12); instance-type list refreshed 2026-07-21.
Source: https://github.com/aws/eks-charts/commits/master/stable/aws-efa-k8s-device-plugin — Tier 1 — accessed 2026-08-01

**[TIER 1] The plugin's own pod spec** (this is what people confuse with the *workload* pod spec):
- `hostNetwork: true`
- `priorityClassName: system-node-critical`
- `automountServiceAccountToken: false`
- toleration on `CriticalAddonsOnly`
- `securityContext`: `privileged: true`, `allowPrivilegeEscalation: true`, `runAsNonRoot: false`, `runAsUser: 0`
- hostPath mounts: `/var/lib/kubelet/device-plugins`, `/dev/infiniband/`, `/opt/aws/neuron/` (`DirectoryOrCreate`)
- node affinity: `node.kubernetes.io/instance-type In <long EFA instance list>` **AND** `eks.amazonaws.com/compute-type NotIn [auto]`
- resource requests: `cpu: 10m`, `memory: 20Mi`

Source: https://github.com/aws/eks-charts/blob/master/stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml — Tier 1 — accessed 2026-08-01

The `eks.amazonaws.com/compute-type NotIn [auto]` affinity is notable: the community chart deliberately excludes EKS Auto Mode nodes, because Auto Mode manages that component itself.

**[TIER 1]** The chart's `supportedInstanceLabels.values` list is an explicit allowlist of ~300 instance types (c5n through c9gd, g4dn through g7e, hpc6a/hpc7a/hpc7g/hpc8a, i3en/i4i/i7i/i8g, inf1, m5dn through m9gd, p3dn/p4d/p4de/p5/p5e/p5en/p6-b200/p6-b300/p6e-gb200/p6e-gb300, r5dn through r8in, trn1/trn1n/trn2/trn2u, u7i/u7in, vt1, x2idn/x8i...). If your new instance type is not in the list, the DaemonSet will not schedule there until the chart is bumped.
Source: https://github.com/aws/eks-charts/blob/master/stable/aws-efa-k8s-device-plugin/values.yaml — Tier 1 — accessed 2026-08-01

### 3.4 Automatic (older, kubectl) install path via eksctl

**[TIER 1]** "When `efaEnabled` is set to `true` in the nodegroup configuration, `eksctl` will also automatically deploy the EFA device plugin on the nodes." The resulting DaemonSet is named `aws-efa-k8s-device-plugin-daemonset` in `kube-system`, pods labeled `name=aws-efa-k8s-device-plugin`.
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[STALE REFERENCE — flag this]** The AWS NCCL-tests README still points readers at `https://github.com/aws-samples/aws-efa-eks` for the device plugin. That repo is **archived**, last pushed 2024-10-15.
Sources: https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/README.md , GitHub API `repos/aws-samples/aws-efa-eks` (`"archived": true`) — Tier 1 — accessed 2026-08-01

### 3.5 The NVIDIA MOFED collision (new, high-value operational gotcha)

**[TIER 1]** "Starting with NVIDIA `k8s-device-plugin` v0.19.0, the `--mofed-enabled` flag defaults to `true`, which causes the NVIDIA device plugin to mount all `/dev/infiniband/uverbs*` devices into containers requesting GPUs. This conflicts with the EFA device plugin, which should be the component managing EFA device allocation at `/dev/infiniband`. ... Workloads requesting fewer than all EFA devices on a node are impacted because the NVIDIA device plugin claims all `uverbs` devices by default."

Fix:
```bash
helm upgrade --install nvdp nvdp/nvidia-device-plugin \
    --namespace nvidia --create-namespace \
    --set gfd.enabled=true \
    --set mofedEnabled=false
```
With the GPU Operator:
```bash
helm upgrade --install gpu-operator nvidia/gpu-operator \
    --namespace gpu-operator \
    --set 'devicePlugin.env[0].name=MOFED_ENABLED' \
    --set 'devicePlugin.env[0].value=false'
```
"EKS Auto Mode does not enable MOFED by default and is not affected by this issue."
Upstream: https://github.com/NVIDIA/k8s-device-plugin/issues/1692
Sources: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html , https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Related: "When using the NVIDIA GPU operator with the EKS-optimized AL2023 NVIDIA AMIs, you must disable the operator installation of the driver and toolkit, as these are already included in the EKS AMIs."
Source: https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — Tier 1 — accessed 2026-08-01

---

## 4. EFA DRA driver (DRANET) — the Kubernetes 1.34+ path

**[TIER 1]** "The EFA DRA driver is built in the upstream DRANET project (https://github.com/kubernetes-sigs/dranet), which provides cloud-aware network device management for Kubernetes DRA. ... The EFA DRA driver advertises EFA devices as `ResourceSlice` objects with the driver name `dra.net` and the `DeviceClass` name `efa.networking.k8s.aws`. The EFA DRA driver runs as a DaemonSet on each node and automatically discovers EFA devices."
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1] Install:**
```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-dranet eks/aws-dranet --namespace kube-system
kubectl get daemonset -n kube-system aws-dranet
kubectl get deviceclass                      # → efa.networking.k8s.aws
kubectl get resourceslices --field-selector spec.driver=dra.net
kubectl logs -n kube-system -l app=aws-dranet
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Chart facts: `aws-dranet` chart `version: 1.0.0`, `appVersion: v1.2.0-eksbuild.2`, image `602401143452.dkr.ecr.us-west-2.amazonaws.com/eks/dranet:v1.2.0-eksbuild.2`. Chart first landed in `aws/eks-charts` on **2026-04-30** ("Add aws-dranet helm chart for DRA network driver (#1322)"). Unlike the EFA device plugin, its `securityContext` is `privileged: false`, `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities.drop: [ALL]`, `seccompProfile: RuntimeDefault`.
Sources: https://github.com/aws/eks-charts/tree/master/stable/aws-dranet , https://github.com/aws/eks-charts/commits/master/stable/aws-dranet — Tier 1 — accessed 2026-08-01

**[TIER 1] Basic claim:**
```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: single-efa-claim
spec:
  spec:
    devices:
      requests:
      - name: efa
        exactly:
          deviceClassName: efa.networking.k8s.aws
          count: 1
---
apiVersion: v1
kind: Pod
metadata:
  name: efa-workload
spec:
  containers:
  - name: app
    resources:
      claims:
      - name: efa-device
  resourceClaims:
  - name: efa-device
    resourceClaimTemplateName: single-efa-claim
```

**[TIER 1] Topology-aware EFA↔GPU pairing** using `matchAttribute: "resource.kubernetes.io/pcieRoot"`:
```yaml
      requests:
      - name: 1-efa
        exactly: { deviceClassName: efa.networking.k8s.aws, count: 1 }
      - name: 1-gpu
        exactly: { deviceClassName: gpu.nvidia.com, count: 1 }
      constraints:
      - requests: ["1-gpu", "1-efa"]
        matchAttribute: "resource.kubernetes.io/pcieRoot"
```

**[TIER 1] `allocationMode: All`** solves the "I don't know how many EFAs share a PCIe root with this GPU" problem: "on `p5.48xlarge` instances there are four EFA devices that share the same PCIe root with one GPU. To allocate these groups of EFA devices with aligned GPUs, even if you do not know the exact EFA-GPU device mapping and count of aligned EFA devices, you can configure your `ResourceClaimTemplate` with `allocationMode: All` for the EFA devices." (`ExactCount` is the default.)

**This is the arithmetic that reconciles the "4 EFAs" prose with the "32 EFAs" YAML in §3.2:** p5.48xlarge has 8 GPUs × 4 EFA devices per PCIe root = 32 EFA devices.

**[TIER 1] Neuron pairing** uses `resource.aws.com/devicegroupN_id` attributes: `devicegroup1_id` = a single Neuron device, `devicegroup4_id` = a group of 4 connected devices, likewise `devicegroup8_id` and `devicegroup16_id`. "Choose the `matchAttribute` that matches the device `count` in your request."

**[TIER 1] Device sharing across Pods** requires a named `ResourceClaim` (not a `ResourceClaimTemplate`): "All Pods that reference the same `ResourceClaim` share access to the same allocated EFA devices and are scheduled to the same node where those devices are available. ... If a referenced `ResourceClaim` does not exist, the Pods remain in a pending state until the claim is created. ... The `ResourceClaim` lifecycle is independent of the Pods."

All of §4 sourced to https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

---

## 5. Pod spec requirements — what is actually required vs folklore

### 5.1 Resource requests / limits

**[TIER 1]** Device-plugin path, minimal shape:
```yaml
resources:
  limits:
    vpc.amazonaws.com/efa: 4
    hugepages-2Mi: ...
  requests:
    vpc.amazonaws.com/efa: 4
    hugepages-2Mi: ...
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

`vpc.amazonaws.com/efa` is an extended resource, so requests and limits must be equal (standard Kubernetes rule for extended resources). AWS's examples always set both identically.

### 5.2 Hugepages

**[TIER 1]** "An important consideration required for adopting EFA with Kubernetes is configuring and managing Huge Pages as a resource in the cluster. ... Amazon EC2 instances with the EFA driver installed **pre-allocate 5128 2MiB Huge Pages**, which you can request as resources to consume in your job specifications."
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

AWS's own p5 manifests request `hugepages-2Mi: 5120Mi` (2,560 pages), i.e. roughly half of the 5,128 pre-allocated pages. Worth noting the gap: the number requested (5120Mi) is **not** the number pre-allocated (5128 pages = 10,256Mi).

**[TIER 1] Bottlerocket** does not pre-allocate; you set it via sysctl in user data:
```yaml
    bottlerocket:
      enableAdminContainer: true
      settings:
        kernel:
          sysctl:
            "vm.nr_hugepages": "3000"  # 3000 * 2Mi = 6000Mi hugepages
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1] Counterexample worth showing:** the GB200 NCCL-test manifest requests **no hugepages at all** — only `nvidia.com/gpu: 4`, `vpc.amazonaws.com/efa: 4`, `memory: 32000Mi`. So hugepages are not universally required in practice.
Source: https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/kubernetes/nccl-tests-gb200.yaml — Tier 1 — accessed 2026-08-01

### 5.3 `hostNetwork` — the current app is WRONG here

**Sources are unanimous in the negative direction:** none of the AWS-authored EFA workload manifests set `hostNetwork: true`, and no AWS documentation states that EFA requires it.

Evidence:
- EKS docs MPIJob example (`node-efa.html`): worker pod spec has `nodeSelector`, `containers`, `volumes`. No `hostNetwork`, no `dnsPolicy`.
- EKS docs device-plugin pod example (`device-management-efa.html`): `spec.containers[].resources` only. No `hostNetwork`.
- `awsome-distributed-ai/micro-benchmarks/nccl-tests/kubernetes/nccl-tests.yaml`: no `hostNetwork`.
- `awsome-distributed-ai/.../nccl-tests-gb200.yaml`: no `hostNetwork`.
- `aws-samples/sample-llm-inference-on-eks` LeaderWorkerSet manifests for DeepSeek-V3.2 / GLM on p5/p5en: no `hostNetwork`; they set `NCCL_SOCKET_IFNAME: eth0`, i.e. explicitly pod-network.
- `aws/eks-charts` EFA **device plugin** DaemonSet does set `hostNetwork: true` — but that is the plugin itself, not the workload.

Sources: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html , https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html , https://github.com/awslabs/awsome-distributed-ai/tree/main/micro-benchmarks/nccl-tests/kubernetes , https://github.com/aws-samples/sample-llm-inference-on-eks/tree/main/k8s-manifest/lws , https://github.com/aws/eks-charts/blob/master/stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml — Tier 1 — accessed 2026-08-01

**Verdict:** the current `EKSIntegration.tsx` comment `hostNetwork: true # Required for EFA` and the entire `hostNetwork requirement` alert are unsupported by any Tier 1 source and contradicted by every AWS-authored manifest. EFA device access comes from the device plugin injecting `/dev/infiniband/uverbs*` into the container, not from sharing the host network namespace.

### 5.4 `securityContext` / `IPC_LOCK`

**UNKNOWN in AWS documentation.** No AWS doc page fetched states an `IPC_LOCK` requirement for EFA pods on EKS.

**[TIER 1, sample code]** AWS sample manifests do add it. The `sample-llm-inference-on-eks` p5 manifests use:
```yaml
          securityContext:
            privileged: true # not required for EFA (the device plugin injects the devices when the pod requests vpc.amazonaws.com/efa); kept as-is
            capabilities:
              add:
              - IPC_LOCK
```
The inline comment in AWS's own sample is itself the clearest available statement: **`privileged` is not required for EFA.** `IPC_LOCK` is present but uncommented, so its necessity is not documented.
Source: https://github.com/aws-samples/sample-llm-inference-on-eks/blob/main/k8s-manifest/lws/lws-deepseek-v3.2-tp16-p5.yaml — Tier 1 — accessed 2026-08-01

Same manifests also mount the devices explicitly:
```yaml
          volumeMounts:
            - name: efa-devices
              mountPath: /dev/infiniband
```

Recommended framing for the app: "AWS's own inference samples add `IPC_LOCK` (memory pinning for RDMA registration) and mount `/dev/infiniband`, but no AWS documentation states either is required. `privileged: true` is explicitly annotated as *not* required in AWS's sample."

### 5.5 Shared memory

**[TIER 1]** AWS's NCCL manifests use a `hostPath` `/dev/shm` mount, not an `emptyDir` medium `Memory`:
```yaml
          volumeMounts:
          - name: shmem
            mountPath: /dev/shm
          volumes:
          - name: shmem
            hostPath:
              path: /dev/shm
```
Sources: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html , https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/kubernetes/nccl-tests.yaml — Tier 1 — accessed 2026-08-01

The current app uses `emptyDir: {medium: Memory, sizeLimit: 64Gi}`. That is a legitimate alternative pattern but is not what AWS ships. Worth showing both and explaining the tradeoff (emptyDir counts against the pod's memory limit; hostPath does not).

### 5.6 Environment variables that AWS actually sets

**[TIER 1]** From the EKS docs MPIJob launcher:
`PATH=$PATH:/opt/amazon/efa/bin:/usr/bin`, `NCCL_DEBUG=INFO`, `NCCL_BUFFSIZE=8388608`, `NCCL_P2P_NET_CHUNKSIZE=524288`, `NCCL_TUNER_PLUGIN=/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu/libnccl-ofi-tuner.so`, plus mpirun flags `--mca pml ^cm,ucx --mca btl tcp,self --mca btl_tcp_if_exclude lo,docker0,veth_def_agent`.
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** From `awsome-distributed-ai` nccl-tests: `FI_PROVIDER=efa`, `FI_EFA_FORK_SAFE=1`, `NCCL_DEBUG=INFO`. GB200 variant adds `NCCL_NVLS_ENABLE=1`, `NCCL_MNNVL_ENABLE=1`.
Source: https://github.com/awslabs/awsome-distributed-ai/tree/main/micro-benchmarks/nccl-tests/kubernetes — Tier 1 — accessed 2026-08-01

**[TIER 1]** From `sample-llm-inference-on-eks` (SGLang on p5): `FI_PROVIDER=efa`, `FI_EFA_USE_DEVICE_RDMA=1`, `NCCL_NET_PLUGIN=ofi`, `NCCL_TUNER_PLUGIN=ofi`, `NCCL_SOCKET_IFNAME=eth0`, `NCCL_P2P_LEVEL=NVL`.
Source: https://github.com/aws-samples/sample-llm-inference-on-eks/blob/main/k8s-manifest/lws/lws-deepseek-v3.2-tp16-p5.yaml — Tier 1 — accessed 2026-08-01

**`NCCL_TOPO_FILE`: UNKNOWN.** No AWS EKS documentation or AWS-authored manifest fetched sets or mentions `NCCL_TOPO_FILE`. The current app's claim that you must mount "the correct `NCCL_TOPO_FILE`" is unsupported.

---

## 6. Node group setup

### 6.1 Hard requirements vs recommendations

**[TIER 2, EKS Best Practices Guide — authored by AWS, dated 2025-05-30]**
- "When provisioning EFA-capable nodes, the instances that need to communicate must be in the same Availability Zone (**hard requirement**)."
- "Additionally, AWS recommends launching all EFA-enabled instances in a cluster placement group to minimize the physical distance between them within that single AZ, which gives you the lowest possible latency. **A placement group is not required for EFA to function, but is strongly recommended for optimal performance.**"
- "All EFA instances must be in the same security group with a **self-referencing rule allowing ALL traffic to/from itself. Without this, EFA traffic fails silently.**"

Source: https://github.com/aws/aws-eks-best-practices/blob/master/latest/bpg/aiml/aiml_networking.adoc — Tier 2 — accessed 2026-08-01

**[TIER 1]** EC2 docs agree on placement groups: "It is not an absolute requirement to launch your EFA-enabled instances into a cluster placement group. However, we do recommend running your EFA-enabled instances in a cluster placement group as it launches the instances into a low-latency group in a single Availability Zone."
Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html — Tier 1 — accessed 2026-08-01

**Note for the app:** the current section lists "Cluster placement group for the node group" as a flat setup requirement. That over-states it. Same-AZ is the hard requirement; placement group is strongly recommended.

**[TIER 1]** Security group rule shape (EC2 docs, Step 1): inbound rule Type = All traffic, Source type = Custom, source = the security group's own ID; outbound rule Type = All traffic, Destination = the same security group ID. The EKS launch-template example repeats: "The security group must allow all inbound and outbound traffic to and from itself to enable EFA OS-bypass functionality."
Sources: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html , https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

### 6.2 eksctl

**[TIER 1]** Minimum version: `eksctl` **0.215.0** or later.
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Working config (verbatim from EKS docs):
```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: my-efa-cluster
  region: region-code
  version: "1.XX"
iam:
  withOIDC: true
availabilityZones: ["us-west-2a", "us-west-2c"]
managedNodeGroups:
  - name: my-efa-ng
    instanceType: p5.48xlarge
    minSize: 1
    desiredCapacity: 2
    maxSize: 3
    availabilityZones: ["us-west-2a"]     # single AZ
    volumeSize: 300
    privateNetworking: true
    efaEnabled: true
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** What `efaEnabled: true` does, verbatim: "all interfaces are configured with interface type `EFA`, an EFA-specific security group is created, and the EFA device plugin is installed on the cluster."
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** eksctl also supports explicit placement groups alongside `efaEnabled`:
```yaml
    efaEnabled: true
    placement:
      groupName: eks-efa-testing
```
Source: https://github.com/eksctl-io/eksctl/blob/main/userdocs/src/usage/nodegroup-managed.md — Tier 1 — accessed 2026-08-01

**[TIER 1] eksctl limitation (still true):** "You can't use `eksctl` to create nodes and node groups that use EFA-only interfaces." AWS's guidance: "If you need to customize the per-device EFA configuration when using `eksctl`, it is recommended to use eksctl's support for launch templates."
Sources: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html , https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** Bottlerocket via eksctl: "Bottlerocket AMI version 1.28.0 and later include official support for EFA. To use Bottlerocket for EFA-enabled nodes, specify `amiFamily: Bottlerocket` in your configuration. If you need to use a custom AMI ID, you must use standard `nodeGroups` instead of `managedNodeGroups`." Also: "eksctl automatically installs the NVIDIA Kubernetes device plugin on each instance for you when using Amazon Linux 2. This is not necessary for Bottlerocket, as the NVIDIA device plugin is built into Bottlerocket's EKS NVIDIA variant."
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

### 6.3 Managed node groups / self-managed with launch templates

**[TIER 1]** Launch template shape for a P6-B200 (1 ENA + 8 EFA-only). Critical gotcha: **"Do not specify `SubnetId` in the launch template when using EKS managed node groups. EKS requires that all subnets are specified through the `CreateNodegroup` API and rejects launch templates that include subnet configuration."**
```json
{
  "LaunchTemplateName": "efa-launch-template",
  "LaunchTemplateData": {
    "InstanceType": "p6-b200.48xlarge",
    "NetworkInterfaces": [
      { "NetworkCardIndex": 0, "DeviceIndex": 0, "InterfaceType": "interface", "Groups": ["sg-..."] },
      { "NetworkCardIndex": 0, "DeviceIndex": 1, "InterfaceType": "efa-only",  "Groups": ["sg-..."] },
      { "NetworkCardIndex": 1, "DeviceIndex": 0, "InterfaceType": "efa-only",  "Groups": ["sg-..."] },
      ... NetworkCardIndex 2..7 ...
    ]
  }
}
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1] EFA-only prerequisites:** "To create nodes that can have EFA-only interfaces, you must use a custom EC2 Launch Template and set the `InterfaceType` to `efa-only`. In your custom Launch Template, you can't set the network card `0` to an EFA-only interface, as that is the primary network card and network interface of the EC2 instance. You must have VPC CNI version `1.18.5` or later for EFA-only interfaces. If you are using Amazon Linux 2, ami version has to be `v20240928` or later for EFA-only interfaces."
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

### 6.4 Version matrix (all Tier 1, all from EKS docs, accessed 2026-08-01)

| Component | Minimum | Why |
| --- | --- | --- |
| AWS CLI | 2.12.3+ or 1.27.160+ | node-efa prerequisites |
| Amazon VPC CNI | 1.7.10+ | "before launching worker nodes that support multiple Elastic Fabric Adapters, such as the `p4d` or `p5`" |
| Amazon VPC CNI | 1.18.5+ | EFA-only interfaces |
| eksctl | 0.215.0+ | `efaEnabled` node groups |
| EFA device plugin | v0.5.6+ | p6-b200 instances |
| Bottlerocket | 1.28.0+ | official EFA support |
| AL2 AMI (legacy) | v20240928+ | EFA-only interfaces |
| Kubernetes | 1.34+ | EFA DRA driver (DRANET) |
| Karpenter | v1.11+ | `networkInterfaces` on `EC2NodeClass` |

Sources: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html , https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html

### 6.5 Karpenter

**[TIER 1] Two modes.**
1. **Dynamic (no `networkInterfaces` set):** "When using Karpenter without specifying `networkInterfaces` in your `NodeClass`, instances created for Pods requesting `vpc.amazonaws.com/efa` have all interfaces configured with interface type `EFA`."
2. **Static (`networkInterfaces` set):** "When `networkInterfaces` is configured, instances launched by the `NodePool` referencing the `NodeClass` use this configuration regardless of whether Pods request `vpc.amazonaws.com/efa` resources." Added in **Karpenter v1.11**.

Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1] EC2NodeClass** (v1 API):
```yaml
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: efa-node-class
spec:
  networkInterfaces:
  - { networkCardIndex: 0, deviceIndex: 0, interfaceType: interface }
  - { networkCardIndex: 0, deviceIndex: 1, interfaceType: efa-only }
  - { networkCardIndex: 1, deviceIndex: 0, interfaceType: efa-only }
  # ... through networkCardIndex 7 for p6-b200
```
Interface types: `interface` = "Standard ENA (Elastic Network Adapter) interface providing IP connectivity"; `efa-only` = "EFA interface that provides only the EFA device for RDMA communication without consuming an IP address".
Sources: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html , https://karpenter.sh/docs/concepts/nodeclasses/#specnetworkinterfaces — Tier 1 — accessed 2026-08-01

**[TIER 1] Karpenter design-doc constraints** (CEL validation on the API):
1. the primary network interface must be `interfaceType: interface` (ENA)
2. no duplicate network card + device index combinations
3. `deviceIndex` and `networkCardIndex` must be non-negative
4. only 1 EFA device per network card

Plus these documented limitations:
- **Node initialization gap:** "With static NodeClass configurations, the EFA resource is not injected into the NodeClaim as a resource requirement, so nodes will initialize even if the EFA plugin doesn't register the external resource." (Dynamic EFA provisioning *does* wait, preventing `ResourceNotRegistered` errors.)
- **EFA interface type unsupported:** "This design will only support ENA and EFA-only interface types. We have not identified a use case for EFA interface type over the recommended pattern of configuring ENA on one device index and EFA-only on the other."
- **Max pods math changes:** `max pods = max number of ENIs * (IPv4 Addresses per ENI - 1) + 2`, and "The max number of ENIs is calculated only for the primary network card (network card 0). If an EFA-only interface is configured on this network card, then the available ENI count is reduced by 1."
- **Prefix delegation:** "EFA-only interfaces cannot be configured with an IP prefix count and attempting to do so causes `ec2:RunInstance` calls to fail. To handle this, Karpenter will not set prefix counts for any EFA-only interfaces."
- **Drift:** "When an EC2NodeClass's `networkInterfaces` configuration changes, Karpenter will drift existing nodes."
- **Not shipped:** an `interfacePolicy: bandwidthOptimized | ipOptimized` shorthand was considered and deferred. A `karpenter.k8s.aws/instance-efa-count` well-known label was also considered and **not** shipped at launch, because "Karpenter currently does not support scheduling with dynamic label applications."

Source: https://github.com/aws/karpenter-provider-aws/blob/main/designs/efa-for-static-capacity.md — Tier 1 — accessed 2026-08-01

**[TIER 1]** Karpenter `EC2NodeClass` also has `placementGroupSelector` (cluster / partition / spread strategies) and beta `capacityReservationSelectorTerms` for ODCRs.
Source: https://karpenter.sh/docs/concepts/nodeclasses/ — Tier 1 — accessed 2026-08-01

**[TIER 2] Karpenter operational guidance for EFA jobs:**
- Pin to an AZ via `nodeSelector`/pod affinity on `topology.kubernetes.io/zone`.
- "Prevent disruption of multi-node training jobs. Use PDBs or `karpenter.sh/do-not-disrupt: "true"` annotations on training pods. Without this, Karpenter's consolidation may attempt to replace or move EFA workloads mid-job, disrupting the entire distributed training run. Set `consolidationPolicy: WhenEmpty` on the NodePool."
- "Set appropriate expiration. Configure `expireAfter` on the NodePool to a value longer than your longest training job, or disable it for training NodePools entirely. A node expiring mid-training terminates the job."
- For Capacity Blocks for ML: "placement is handled automatically via UltraClusters — no manual placement group is needed. Note that, in this case, the AZ is already locked."

Source: https://github.com/aws/aws-eks-best-practices/blob/master/latest/bpg/aiml/aiml_networking.adoc — Tier 2 — accessed 2026-08-01

**[TIER 2] Spot + EFA correlated-interruption warning** (good, non-obvious material):
"EFA requires all communicating nodes to reside in the same Availability Zone, and AWS recommends placing them in a cluster placement group for optimal latency. This co-location introduces *correlated interruption risk*: instances share underlying physical infrastructure within the same AZ (and even more so within a placement group), so a single capacity reclamation event can affect multiple instances simultaneously — potentially interrupting your entire multi-node training job at once rather than a single node. This is fundamentally different from Spot usage without EFA constraints, where nodes can be spread across AZs and interruptions are statistically independent."
Source: https://github.com/aws/aws-eks-best-practices/blob/master/latest/bpg/aiml/aiml_networking.adoc — Tier 2 — accessed 2026-08-01

### 6.6 EKS Auto Mode (2026 material, absent from the current app)

**[TIER 1]** "In EKS Auto Mode, you configure EFA network interfaces using the `advancedNetworking.networkInterfaces` field in the `NodeClass` (`eks.amazonaws.com/v1`)."

```yaml
apiVersion: eks.amazonaws.com/v1
kind: NodeClass
metadata:
  name: efa-node-class
spec:
  role: MyNodeRole
  subnetSelectorTerms:
    - tags: { Name: "private-subnet" }
  securityGroupSelectorTerms:
    - tags: { Name: "efa-security-group" }
  placementGroupSelector:
    name: "ml-training-pg"
  advancedNetworking:
    networkInterfaces:
    - { deviceIndex: 0, interfaceType: interface, networkCardIndex: 0, secondaryIPv4PrefixCount: 1 }
    - { networkCardIndex: 0, deviceIndex: 1, interfaceType: efa-only }
    - { networkCardIndex: 1, deviceIndex: 0, interfaceType: efa-only }
    - { networkCardIndex: 2, deviceIndex: 0, interfaceType: efa-only }
    - { networkCardIndex: 3, deviceIndex: 0, interfaceType: efa-only }
```
Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1] Auto Mode constraints on static network interfaces:**
- "The primary ENI (`networkCardIndex: 0`, `deviceIndex: 0`) must use `interfaceType: interface`."
- "`secondaryIPv4Count` (each unit provides 1 IP address) or `secondaryIPv4PrefixCount` (each unit provides a /28 prefix with 16 IP addresses). Only one of these can be used per interface, and they are only supported on `networkCardIndex: 0`. They cannot be used on `efa-only` interfaces."
- "When `networkInterfaces` is configured, EKS Auto Mode does not attach additional IPs, prefixes, or ENIs after instance launch. Only the interfaces and IP addresses configured at launch are available to Pods. You must plan your pod density based on the number of IPs configured."
- "IPv6 is not supported with statically defined network interfaces. `associatePublicIPAddress` is not compatible when more than one network interface is defined, so nodes using multiple interfaces cannot have public IPs."
- "This feature can be used with static capacity node pools to maintain pre-warmed, EFA-ready nodes for distributed training and inference workloads."

Source: https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html (Static Network Interface Configuration) — Tier 1 — accessed 2026-08-01

**[TIER 1] Placement-group edge cases in Auto Mode** (excellent, hard-to-find operational content):
- **Cluster PG AZ pinning:** "Once the first instance launches into a cluster placement group, the PG is pinned to that AZ. If your NodePool allows multiple AZs, parallel launches during initial scale-up may race: one succeeds and pins the AZ, the rest fail with capacity errors. Pin the AZ in your NodePool requirements to avoid transient failures."
- **Spread PG 7-instance limit:** replacement launch fails at capacity, drifted node stays running; "No fallback outside the placement group"; workaround is `consolidationPolicy: WhenEmpty`, but "drift always uses replace-then-delete regardless of consolidation policy, so drift remains blocked at capacity."
- **Consolidation can move pods out of a placement group** unless pods carry a `nodeSelector` on `eks.amazonaws.com/placement-group-id`.
- **Deleted PG:** "If a `NodeClass` references a placement group that does not exist or has been deleted, no instances are launched. ... If a placement group is deleted while nodes are running, existing nodes are marked as drifted and remain running indefinitely."

Source: https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html — Tier 1 — accessed 2026-08-01

### 6.7 IP address conservation on many-NIC nodes

**[TIER 1]** "EFA-enabled instances such as `p5.48xlarge` and `p6-b200.48xlarge` support many network interfaces. By default, the Amazon VPC CNI allocates IP addresses across all IP-enabled attached ENIs, which can consume a large number of IP addresses from your subnet even when those addresses are not actively used by Pods. On instances with dozens of network interfaces, this can quickly exhaust your subnet's available IP space."

Mitigations, verbatim:
1. "configure your network interfaces to use `efa-only` for all interfaces except the primary. EFA-only interfaces are dedicated to RDMA traffic and do not have IP addresses assigned, so they do not consume addresses from your subnet."
2. "Set the `WARM_IP_TARGET` and `WARM_ENI_TARGET` environment variables on the `aws-node` DaemonSet."

Caveat: "The `WARM_ENI_TARGET` and `WARM_IP_TARGET` settings are cluster-wide and apply to all nodes managed by the VPC CNI. There is currently no way to set different values per node group or instance type." (feedback: containers-roadmap issue #1834)

Source: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 2]** Best-practices version adds `MINIMUM_IP_TARGET` and points at https://github.com/aws/amazon-vpc-cni-k8s/blob/master/docs/eni-and-ip-target.md
Source: https://github.com/aws/aws-eks-best-practices/blob/master/latest/bpg/aiml/aiml_networking.adoc — Tier 2 — accessed 2026-08-01

---

## 7. Multi-NIC: how 32 EFA interfaces surface in Kubernetes

**[TIER 1] The chain, end to end:**
1. EC2 attaches N network interfaces at launch (launch template / `NodeClass` / eksctl `efaEnabled`).
2. Each `efa-only` or `EFA with ENA` interface creates a `/dev/infiniband/uverbs*` device on the host.
3. The AL2023 / Bottlerocket AMI's `efa` kernel module + `rdma-core` make those device nodes real.
4. The EFA device plugin DaemonSet (hostPath-mounting `/dev/infiniband/`) counts them and advertises `vpc.amazonaws.com/efa: N` in node Capacity/Allocatable.
5. A pod requesting `vpc.amazonaws.com/efa: N` gets those device nodes injected.
6. libfabric inside the container enumerates them (`fi_info -p efa`) as `efa_0-rdm`, `efa_1-rdm`, ...
7. aws-ofi-nccl maps NCCL rings/channels onto them.

Sources: https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html , https://github.com/aws/eks-charts/blob/master/stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml , https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html — Tier 1 — accessed 2026-08-01

**[TIER 1] Bandwidth is shared, not additive.** For p5: "`p5.48xlarge` and `p5e.48xlarge` instances support 32 network cards and have a total network bandwidth capacity of 3,200 Gbps, of which up to 800 Gbps can be utilized for IP network traffic. Because EFA and IP network traffic share the same underlying resources, bandwidth used by one will reduce the bandwidth that is available to the other. ... if you use 400 Gbps for IP bandwidth, you can achieve up to 2,800 Gbps of EFA bandwidth at the same time."
Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html — Tier 1 — accessed 2026-08-01

**[TIER 1] The two canonical p5 layouts:**
- **Use case 1 (save IPs):** ENA on NCI 0/DI 0; EFA-only on NCI 0/DI 1; EFA-only on NCI 1-31/DI 0. Result: "up to 3200 Gbps of EFA networking bandwidth and up to 100 Gbps of IP networking bandwidth with one private IP address." Also "helps to avoid potential Linux IP issues, such as disallowed auto-assignment of public IP addresses and IP routing challenges (hostname to IP address mapping issues and source IP address mismatches)."
- **Use case 2 (max EFA + IP):** ENA on NCI 0/DI 0; EFA-only on NCI 0/DI 1 and NCI 1,2,3/DI 0; then in each of the NCI subsets [4-7], [8-11], [12-15], [16-19], [20-23], [24-27], [28-31], one ENA (DI 1) and four EFA-only (DI 0). Result: "up to 3200 Gbps of EFA networking bandwidth and up to 800 Gbps of IP networking bandwidth with 8 private IP address. You can't auto-assign public IP addresses with this configuration."

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html — Tier 1 — accessed 2026-08-01

**[TIER 1] P6e-GB200 is genuinely different** (worth its own callout): up to 17 network cards. Primary NCI 0 = up to 100 Gbps ENA. NCIs [1,3,5,7,9,11,13,15] support EFA-only at 400 Gbps. NCIs [2,4,6,8,10,12,14,16] support up to 200 Gbps ENA or EFA. NCI pairs [1,2], [3,4], ... [15,16] share a physical NIC (400 Gbps each). GPU-to-NCI pairs [1,3], [5,7], [9,11], [13,15] share a GPU (400 Gbps each). Recommendation: "Add an EFA-only network interface to only one NCI in each group to achieve 400 Gbps per network interface (4 EFA network interfaces x 400 Gbps)" or "Add an EFA-only network interface to each NCI in each group to achieve 200 Gbps per network interface (8 EFA network interfaces x 200 Gbps)" — either way 1,600 Gbps total.
Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html — Tier 1 — accessed 2026-08-01

This explains the AWS GB200 NCCL manifest requesting only `vpc.amazonaws.com/efa: 4` with the comment `#p6e has 4 NICs`.
Source: https://github.com/awslabs/awsome-distributed-ai/blob/main/micro-benchmarks/nccl-tests/kubernetes/nccl-tests-gb200.yaml — Tier 1 — accessed 2026-08-01

---

## 8. Operators, NCCL tests, blueprints

### 8.1 Kubeflow MPI Operator

**[TIER 1]** EKS docs recommend the Kubeflow MPI Operator for NCCL tests: "For the NCCL tests you can apply the Kubeflow MPI Operator. The MPI Operator makes it easy to run Allreduce-style distributed training on Kubernetes."
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** `kubeflow/mpi-operator` is active. Releases: v0.8.2 (2026-07-03), v0.8.0 (2026-02-17), v0.7.0 (2025-10-30), v0.6.0 (2024-10-16). API version used in all AWS manifests: `kubeflow.org/v2beta1`, `kind: MPIJob`.
Source: https://github.com/kubeflow/mpi-operator/releases — Tier 1 — accessed 2026-08-01

**[TIER 1]** `kubeflow/trainer` (the v2 successor to the Training Operator) is at v2.3.0-rc.3 (2026-07-24). AWS EKS EFA docs do not reference it.
Source: https://github.com/kubeflow/trainer/releases — Tier 1 — accessed 2026-08-01

**Note:** the current app's claim "The `PyTorchJob` CRD supports EFA natively" is not stated in any AWS doc. PyTorchJob has no EFA-specific field; EFA works because you put `vpc.amazonaws.com/efa` in the worker pod template's resources, same as any other pod. Reframe as "any operator that lets you set container resources works: MPIJob, PyTorchJob, LeaderWorkerSet, RayJob."

**[TIER 1] LeaderWorkerSet** is what AWS's own multi-node inference samples use for EFA on p5/p5en (`leaderworkerset.x-k8s.io/v1`), pairing `vpc.amazonaws.com/efa: 16` with `nvidia.com/gpu: 8` per replica for TP=16 across 2 nodes.
Source: https://github.com/aws-samples/sample-llm-inference-on-eks/tree/main/k8s-manifest/lws — Tier 1 — accessed 2026-08-01

### 8.2 NCCL tests on EKS

**[TIER 1]** The EKS docs walkthrough uses the public image `public.ecr.aws/hpc-cloud/nccl-tests:latest` and points to https://github.com/aws-samples/awsome-distributed-training/tree/main/micro-benchmarks/nccl-tests.
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[STALE LINK — flag this]** That repo has been renamed/moved: `aws-samples/awsome-distributed-training` now resolves to **`awslabs/awsome-distributed-ai`** ("Collection of best practices, reference architectures, model training examples and utilities to train large models on AWS"), last pushed 2026-07-31.
Source: GitHub API `repos/aws-samples/awsome-distributed-training` → `awslabs/awsome-distributed-ai` — Tier 1 — accessed 2026-08-01

**[TIER 1]** Expected job topology: 1 launcher pod + N worker pods, `slotsPerWorker: 8`, `mpirun -np 16 -N 8` for 2 × p5.48xlarge, running `/opt/nccl-tests/build/all_reduce_perf -b 8 -e 16G -f 2 -g 1 -c 1 -n 100`.
Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** A HyperPod-authored EFA stack validation recipe exists (`efa-versions.py`), checking EFA installer version, libfabric version, aws-ofi-nccl version, NCCL version, NVIDIA driver, CUDA, and enumerating EFA interfaces (`rdmap0s29-rdm`, `rdmap1s29-rdm`, ...) and `/dev/infiniband` uverbs devices. Runnable as a plain `batch/v1 Job` requesting `vpc.amazonaws.com/efa: 32`.
Source: https://github.com/awslabs/ai-on-sagemaker-hyperpod/blob/main/website/docs/00-eks-orchestration/validation-and-testing/environment-validation/efa-validation.md — Tier 1 — accessed 2026-08-01

### 8.3 AI on EKS / Data on EKS

**[TIER 1]** `awslabs/ai-on-eks` is the active blueprint repo (last pushed 2026-07-29). Its Terraform declares:
```hcl
efa_instance_types = ["p5.48xlarge", "p5e.48xlarge", "p5en.48xlarge",
                      "p6-b200.48xlarge", "p6-b300.48xlarge", "p6e-gb200.36xlarge"]

module "efa_network_interfaces" {
  source   = "./modules/efa-networkinterfaces-generator"
  for_each = { for inst in local.efa_instance_types : inst => inst }
  instance_type = each.value
  use_case      = var.efa_network_interfaces_policy
}
```
and on managed node groups: `enable_efa_support = true` with the comment "Add security group rules on the node group security group to allow EFA traffic".
Source: https://github.com/awslabs/ai-on-eks/blob/main/infra/base/terraform/eks.tf — Tier 1 — accessed 2026-08-01

The `efa-networkinterfaces-generator` module implements the same bandwidth-optimized vs IP-optimized policy split that Karpenter's design doc describes but did not ship.

**[TIER 1]** `awslabs/data-on-eks` is still active (not archived, last pushed 2026-08-01). AI on EKS's landing page links to it as a companion ("Explore Data on EKS"). Framing: Data on EKS = data platforms, AI on EKS = AI/ML.
Sources: GitHub API `repos/awslabs/data-on-eks` , https://awslabs.github.io/ai-on-eks/ — Tier 1 — accessed 2026-08-01

### 8.4 SageMaker HyperPod on EKS

**[TIER 1]** "SageMaker HyperPod is a SageMaker AI-managed service that enables large-scale training of foundation models on long-running and resilient compute clusters, integrating with Amazon EKS for orchestrating the HyperPod compute resources." Architecture: "a 1-to-1 mapping between an EKS cluster (control plane) and a HyperPod cluster (worker nodes) within a VPC". Admin features: provisioning resilient clusters attached to an EKS control plane, dynamic capacity management, `kubectl`/SSM/SSH access, resiliency (basic health checks, deep health checks, health-monitoring agent, PyTorch job auto-resume), and observability integrations.
Source: https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html — Tier 1 — accessed 2026-08-01

**[TIER 1]** HyperPod-on-EKS workloads use the same `vpc.amazonaws.com/efa` resource; AWS's HyperPod EKS docs list "EFA device plugin deployed" as a prerequisite for their validation and FSDP recipes.
Sources: https://github.com/awslabs/ai-on-sagemaker-hyperpod/tree/main/website/docs/00-eks-orchestration — Tier 1 — accessed 2026-08-01

**UNKNOWN:** whether HyperPod automatically installs the EFA device plugin on cluster creation. Not stated in the pages fetched.

### 8.5 AWS Batch on EKS — the current app's claim does not hold up

**[TIER 1]** The AWS Batch on EKS overview page lists no multi-node parallel (MNP) support; MNP is documented only in ECS terms: "AWS Batch multi-node parallel jobs use the Amazon ECS `awsvpc` network mode, which gives your multi-node parallel job containers the same networking properties as Amazon EC2 instances." The MNP compute-environment considerations page discusses only ECS constructs (`awsvpc`, ECS security-group behavior, launch templates) and never mentions EKS.
Sources: https://docs.aws.amazon.com/batch/latest/userguide/eks.html , https://docs.aws.amazon.com/batch/latest/userguide/multi-node-parallel-jobs.html , https://docs.aws.amazon.com/batch/latest/userguide/mnp-ce.html — Tier 1 — accessed 2026-08-01

**Verdict:** the current app says "AWS Batch can orchestrate multi-node parallel jobs on EKS with EFA. Batch handles placement group allocation and job scheduling." No AWS source supports MNP on EKS. Mark as **UNKNOWN / likely wrong** and cut it, or replace with the Batch-on-EKS facts that are documented ("AWS Batch conducts this orchestration external to your clusters using an 'overlay' model... there are no Kubernetes components to install"). Do not assert EFA + MNP on EKS.

---

## 9. What is wrong, stale, or missing in `src/sections/EKSIntegration.tsx`

File: `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/efa/src/sections/EKSIntegration.tsx`

### 9.1 Factually wrong (must fix)

| # | Line(s) | Current claim | Correction | Source |
| --- | --- | --- | --- | --- |
| W1 | 44, 60, 122-128 | `hostNetwork: true` is "Required for EFA"; whole warning Alert built on it | Not required. No AWS doc says so. Zero AWS-authored EFA workload manifests use it. The device plugin injects `/dev/infiniband/uverbs*` into the container. `hostNetwork: true` belongs to the *plugin's* DaemonSet, not workloads. AWS inference samples explicitly use pod networking (`NCCL_SOCKET_IFNAME=eth0`). | node-efa.html; device-management-efa.html; awsome-distributed-ai nccl-tests; sample-llm-inference-on-eks; eks-charts daemonset.yaml |
| W2 | 141-147 | "AWS Batch can orchestrate multi-node parallel jobs on EKS with EFA. Batch handles placement group allocation" | Unsupported. Batch MNP is documented only on ECS (`awsvpc`). Batch-on-EKS docs never mention MNP or EFA. | batch/eks.html; batch/multi-node-parallel-jobs.html; batch/mnp-ce.html |
| W3 | 46 | "Correct `NCCL_TOPO_FILE` mounted" listed as a Kubernetes component requirement | UNKNOWN. No AWS EKS doc or AWS-authored EFA manifest sets `NCCL_TOPO_FILE`. Topology alignment on EKS is handled by the AL2023 AMI automatically (device plugin) or by DRA `matchAttribute: resource.kubernetes.io/pcieRoot`. | device-management-efa.html |
| W4 | 34 | "Cluster placement group for the node group" listed as a flat requirement | Over-stated. Same-AZ is the hard requirement; cluster placement group is strongly recommended but not required for EFA to function. | aws-eks-best-practices aiml_networking.adoc; efa-start.html |
| W5 | 36 | "EFA kernel driver installed (Amazon Linux 2/2023 includes it)" | AL2 EKS AMIs stopped being published 2025-11-26. And this understates the nuance: what ships is `efa_installer --minimal` (kernel module + rdma-core only), not the full EFA stack. | amazon-eks-ami README; install-efa.sh; ml-eks-optimized-ami.html |
| W6 | 133-138 | "The `PyTorchJob` CRD supports EFA natively" | No AWS source. PyTorchJob has no EFA-specific field; EFA works via ordinary container resource requests in the worker template. | (absence across all fetched AWS docs) |
| W7 | 68, 73 | Comment `# Request all EFA interfaces (p5)` next to `vpc.amazonaws.com/efa: 32` | Correct for p5.48xlarge, but the app never explains that the count is per-instance-type and varies (p6-b200 = 8, p6-b300 = 16, p6e-gb200 = 4 recommended). Reads as a universal number. | efa-acc-inst-types.html; nccl-tests-gb200.yaml |

### 9.2 Stale (2025-era content, superseded)

| # | Issue |
| --- | --- |
| S1 | **No mention of the EFA DRA driver (DRANET)** — AWS's *recommended* mechanism for K8s 1.34+ on managed/self-managed node groups. `DeviceClass: efa.networking.k8s.aws`, driver `dra.net`, chart `eks/aws-dranet` (added to eks-charts 2026-04-30). Entirely absent. |
| S2 | **No mention of EKS Auto Mode.** `NodeClass` `advancedNetworking.networkInterfaces`, `placementGroupSelector`, static capacity node pools, and the fact that the DRA driver is *not* supported on Auto Mode. Entirely absent. |
| S3 | **Karpenter is entirely absent.** `EC2NodeClass.spec.networkInterfaces` (v1.11+), dynamic vs static EFA modes, max-pods recomputation, drift, prefix-delegation incompatibility, do-not-disrupt/consolidation guidance. |
| S4 | **"Version Requirements" panel is incomplete and mixes tiers.** Missing: K8s 1.34 for DRA, Karpenter v1.11, current device-plugin chart v0.5.30 / appVersion v0.5.20, EFA kernel package 3.1.0 in AMI v20260728. |
| S5 | The Alert claiming "eksctl does not support configuring EFA-only interfaces directly" is still **true** but the recommended workaround has been updated: AWS now points at eksctl's launch-template support, not just "roll your own launch template". |
| S6 | Shared-memory example uses `emptyDir: {medium: Memory}`; AWS ships `hostPath: /dev/shm`. Not wrong, but not the reference pattern. |
| S7 | No mention that `aws-samples/aws-efa-eks` is archived (2024-10-15) and `aws-samples/awsome-distributed-training` moved to `awslabs/awsome-distributed-ai`. Anyone following old links lands wrong. |

### 9.3 Missing (high-value, would carry the section)

| # | Gap |
| --- | --- |
| M1 | **The AMI story entirely.** Which variants (`AL2023_x86_64_NVIDIA`, `AL2023_ARM_64_NVIDIA`, `AL2023_x86_64_NEURON`, Bottlerocket `aws-k8s-nvidia`), AL2 EOL date, what `--minimal` means, exact package versions, how to inspect (`dnf list installed`, release-notes tables, `make k8s=... enable_efa=true`). This is Carlos's explicit ask and the section currently has one parenthetical. |
| M2 | **The host/container split.** The single most useful mental model: kernel module + rdma-core on the host; libfabric + aws-ofi-nccl + NCCL + MPI in the container. |
| M3 | **The NVIDIA MOFED conflict** (`k8s-device-plugin` v0.19.0+ defaults `--mofed-enabled=true`, steals `/dev/infiniband/uverbs*`). Silent, painful, and brand new. |
| M4 | **DRA topology-aware EFA↔GPU pairing**, including `allocationMode: All` and the p5 arithmetic (8 GPUs × 4 EFAs per PCIe root = 32). |
| M5 | **IP address exhaustion** on many-NIC nodes: `efa-only` for everything but the primary, `WARM_IP_TARGET`/`WARM_ENI_TARGET`, and the caveat that those are cluster-wide only. |
| M6 | **Placement-group operational edge cases** in Auto Mode: cluster PG AZ pinning race, spread PG 7-instance limit blocking drift replacement, deleted PG behaviour. |
| M7 | **Spot + EFA correlated interruption risk** — same AZ + same placement group means interruptions are correlated, not independent. |
| M8 | **The p6e-GB200 NIC topology** (17 NCIs, paired NCIs sharing physical NICs and GPUs, 4×400 vs 8×200 Gbps) plus its NCCL manifest using `nvidia.com/gpu.clique` topologyKey and NVIDIA `ComputeDomain`. |
| M9 | **The launch-template `SubnetId` trap** for managed node groups. |
| M10 | **Verification commands**: `kubectl get nodes -o=custom-columns=...vpc\.amazonaws\.com/efa`, `kubectl get deviceclass`, `kubectl get resourceslices --field-selector spec.driver=dra.net`, `fi_info -p efa -t FI_EP_RDM` (in-container, not on host). |
| M11 | **AI on EKS** as the current blueprint home, including its `efa-networkinterfaces-generator` Terraform module and `efa_instance_types` list. |
| M12 | **HyperPod on EKS** 1-to-1 control-plane/worker mapping and the EFA validation recipe. |

---

## 10. Proposed section outline

Working title: **"EFA on EKS: the AMI, the device layer, and the pod contract"**

1. **Getting started: the shortest working path** (h2)
   Twelve lines of eksctl + one helm install + one MPIJob. The "if you do nothing else" path. Answers Carlos's brief header question ("I'm already on EKS, what do I change?") before any depth.

2. **The layer cake: who owns what** (h2)
   Bold framing → *Diagram D1* → prose. EC2 attaches NICs → AMI provides kernel module + rdma-core → device plugin/DRA advertises → pod requests → container's libfabric + aws-ofi-nccl drive it. The single most important idea: the host does not have libfabric.

3. **The EKS AMI** (h2) — the centrepiece Carlos asked for
   - 3.1 AMI variants table (AL2023 NVIDIA x86/ARM, AL2023 Neuron, Bottlerocket nvidia/aws-k8s) and the 2025-11-26 AL2 EOL.
   - 3.2 What is inside: the component list verbatim, with **EFA minimal (kernel module and rdma-core)** highlighted.
   - 3.3 `efa_installer.sh --minimal` — code block from `install-efa.sh`, plus the EC2 doc sentence that defines `--minimal`. *Diagram D2.*
   - 3.4 Concrete versions table from release v20260728 (efa 3.1.0, nvidia 580.159.03, containerd 2.2.5, kernel 6.18/6.12).
   - 3.5 How to inspect (`dnf list installed`, release notes, `make help`, `fi_info` inside the container).
   - 3.6 What you still install: EFA device plugin *or* DRA driver, NVIDIA/Neuron device plugin, and the container-side fabric stack.
   - 3.7 ExpandableSection: rebuilding it yourself (`make k8s=1.36 os_distro=al2023 enable_accelerator=nvidia enable_efa=true`), plus the "don't `dnf upgrade` a derived AMI" and "build per instance generation" rules, plus the live G7/driver-595 gap.
   - 3.8 Alert: the standard-vs-accelerated EFA contradiction, stated as a contradiction.

4. **Two ways to expose EFA to Kubernetes** (h2)
   Bold framing → AWS's comparison table (DRA vs device plugin) → ColumnLayout of the two install paths → *Diagram D3*. Include the "cannot coexist on the same node" rule and the Karpenter/Auto-Mode exclusion.

5. **The device plugin in detail** (h2)
   `vpc.amazonaws.com/efa`, chart v0.5.30 / image v0.5.20, helm install, the DaemonSet's own security posture, the instance-type allowlist gotcha, the `compute-type NotIn [auto]` affinity, verification commands.

6. **The DRA driver in detail** (h2)
   `dra.net` / `efa.networking.k8s.aws`, ResourceClaimTemplate vs ResourceClaim, `matchAttribute: resource.kubernetes.io/pcieRoot`, `allocationMode: All`, Neuron `devicegroupN_id`, device sharing across pods.

7. **The pod contract: what is actually required** (h2)
   Two-column "required / not required" panel. Required: matching requests+limits on `vpc.amazonaws.com/efa`; hugepages where the instance pre-allocates them; a container image with libfabric + aws-ofi-nccl + NCCL. Not required: `hostNetwork`, `privileged`. Undocumented-but-common: `IPC_LOCK`, explicit `/dev/infiniband` mount. Corrected pod spec + the env vars AWS actually sets. Alert correcting the `hostNetwork` folklore explicitly.

8. **Node groups: eksctl, managed node groups, Karpenter, Auto Mode** (h2)
   *Diagram D4* (decision tree) → four ExpandableSections, one per path, each with its YAML and its specific gotchas (eksctl can't do EFA-only; launch templates must omit `SubnetId`; Karpenter dynamic vs static + drift + max-pods; Auto Mode static-NIC constraints + placement-group edge cases).

9. **Multi-NIC reality: 32 interfaces, one instance** (h2)
   The p5 32-card layout (both use cases), p6-b200, p6-b300, p6e-GB200's paired-NCI topology. Shared-bandwidth arithmetic. IP exhaustion and `efa-only` as the fix. *Diagram D5* if budget allows.

10. **Proving it works: NCCL tests on EKS** (h2)
    MPI Operator, the reference container stack table, the MPIJob manifest, `all_reduce_perf`, what good output looks like, and the EFA stack validation recipe.

11. **Operating it** (h2)
    Alerts, in priority order: NVIDIA MOFED conflict; Spot + EFA correlated interruption; do-not-disrupt / `expireAfter` / `consolidationPolicy: WhenEmpty`; deleted or full placement groups; IP exhaustion.

12. **Where to get working code** (h2)
    AI on EKS blueprints, `awslabs/awsome-distributed-ai`, HyperPod-on-EKS, and an explicit "these two repos moved" note (archived `aws-efa-eks`, renamed `awsome-distributed-training`).

---

## 11. Diagram ideas

**D1 — "The EFA layer cake on EKS" (inline SVG, 6 horizontal bands).**
Bands, bottom to top, with an ownership gutter down the right side labelled **AWS-managed / AMI / cluster add-on / your image**:
1. EC2 hardware: Nitro card, N network cards (NCI 0..31)
2. Launch config: `interface` on NCI0/DI0, `efa-only` on the rest (sourced from launch template / `NodeClass` / eksctl)
3. **EKS AL2023 accelerated AMI**: `efa` kmod 3.1.0, `rdma-core`, `/dev/infiniband/uverbs*` — annotated "installed via `efa_installer.sh --minimal`" and a red strike-through chip reading "no libfabric, no Open MPI, no aws-ofi-nccl"
4. Cluster add-on: EFA device plugin DaemonSet **or** DRANET DaemonSet → advertises `vpc.amazonaws.com/efa: N` / `ResourceSlice`
5. Pod: `resources.limits.vpc.amazonaws.com/efa: 32`, hugepages
6. **Container image**: libfabric → aws-ofi-nccl → NCCL → PyTorch/SGLang
The whole point of the diagram is that band 3 and band 6 both say "EFA stack" but contain different things, and the gap between them is where every real bug lives.

**D2 — "`--minimal` vs full: what the flag costs you" (inline SVG, side-by-side two-column comparison).**
Left column "`efa_installer.sh -y` (full)": `efa` kmod, `rdma-core`, `libfabric → /opt/amazon/efa`, `Open MPI 4.1 → /opt/amazon/openmpi`, `Open MPI 5 → /opt/amazon/openmpi5`, `aws-ofi-nccl → /opt/amazon/ofi-nccl/lib` (since installer 1.48).
Right column "`efa_installer.sh --minimal -y` (what the EKS AMI runs)": `efa` kmod, `rdma-core` — everything else greyed out with a dashed border.
Bottom band: an arrow from the greyed-out items pointing into a "your container image" box, captioned "the AMI's omission is your Dockerfile's job."

**D3 — "Device plugin vs DRA driver: pick a lane" (React Flow, two-branch graph).**
Root node "Kubernetes version?" → `< 1.34` forces device plugin. `>= 1.34` → "Compute type?" → {EKS Auto Mode, Karpenter} forces device plugin (edge labelled "DRA not supported"); {managed node groups, self-managed} → DRA driver (edge labelled "recommended"). Leaf nodes carry their consequences as chips: device plugin → `vpc.amazonaws.com/efa: N` integer, no device sharing, automatic topology only on AL2023 accelerated AMIs; DRA → `ResourceSlice` with PCIe attributes, `matchAttribute` pinning, shared `ResourceClaim`. A red "cannot coexist on the same node" bar spans both leaves.

**D4 — "Four ways to get EFA NICs onto a node" (inline SVG, four parallel swimlanes converging).**
Lanes: eksctl (`efaEnabled: true`) / managed node group (launch template `NetworkInterfaces[]`) / Karpenter (`EC2NodeClass.spec.networkInterfaces`) / EKS Auto Mode (`NodeClass.advancedNetworking.networkInterfaces`). Each lane shows its YAML key and its one-line limitation chip (eksctl: "no EFA-only"; MNG: "no SubnetId in LT"; Karpenter: "v1.11+, drifts on change"; Auto Mode: "no IPv6, no public IP with >1 NIC"). All four converge on a single node box showing `/dev/infiniband/uverbs0..N`, then into the device-plugin/DRA box, then into `Allocatable: vpc.amazonaws.com/efa: N`.

**D5 (stretch) — "p5.48xlarge NIC map" (inline SVG grid, 32 cells).**
A 4×8 grid of network-card cells, NCI 0-31. Use case 1 rendering: NCI 0 shows two stacked chips (DI0 = ENA blue, DI1 = EFA orange); NCI 1-31 each show one EFA chip. Side panel: "3,200 Gbps EFA / 100 Gbps IP / 1 private IP". A toggle-style second rendering for use case 2 highlights NCI 0,4,8,12,16,20,24,28 with an extra blue ENA chip on DI1 and reads "3,200 Gbps EFA / 800 Gbps IP / 8 private IPs". Caption states the shared-bandwidth rule: total <= 3,200 Gbps, IP <= 800 Gbps. A companion inset can show the p6e-GB200 pairing ([1,2] share a NIC; [1,3] share a GPU) since it is the shape people get wrong.

---

## 12. Source list, grouped by tier

### Tier 1 — official AWS documentation
1. Run machine learning training on Amazon EKS with Elastic Fabric Adapter — https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — accessed 2026-08-01
2. Manage EFA devices on Amazon EKS — https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html — accessed 2026-08-01
3. Manage NVIDIA GPU devices on Amazon EKS — https://docs.aws.amazon.com/eks/latest/userguide/device-management-nvidia.html — accessed 2026-08-01
4. Use EKS-optimized accelerated AMIs for GPU instances — https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html — accessed 2026-08-01
5. Create nodes with optimized Amazon Linux AMIs — https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html — accessed 2026-08-01
6. Build a custom EKS-optimized Amazon Linux AMI — https://docs.aws.amazon.com/eks/latest/userguide/eks-ami-build-scripts.html — accessed 2026-08-01
7. Create a Node Class for Amazon EKS (Static Network Interface Configuration) — https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html — accessed 2026-08-01
8. Get started with EFA and MPI for HPC workloads on Amazon EC2 — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html — accessed 2026-08-01
9. Maximize network bandwidth on Amazon EC2 instances with multiple network cards — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html — accessed 2026-08-01
10. Orchestrating SageMaker HyperPod clusters with Amazon EKS — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks.html — accessed 2026-08-01
11. Amazon EKS compute environments (AWS Batch) — https://docs.aws.amazon.com/batch/latest/userguide/eks.html — accessed 2026-08-01
12. Multi-node parallel jobs (AWS Batch) — https://docs.aws.amazon.com/batch/latest/userguide/multi-node-parallel-jobs.html — accessed 2026-08-01
13. Compute environment considerations for MNP with AWS Batch — https://docs.aws.amazon.com/batch/latest/userguide/mnp-ce.html — accessed 2026-08-01
14. Karpenter EC2NodeClass concepts — https://karpenter.sh/docs/concepts/nodeclasses/ — accessed 2026-08-01

### Tier 1 — official AWS source repositories
15. `awslabs/amazon-eks-ami` README — https://github.com/awslabs/amazon-eks-ami — accessed 2026-08-01
16. `templates/al2023/provisioners/install-efa.sh` — https://github.com/awslabs/amazon-eks-ami/blob/main/templates/al2023/provisioners/install-efa.sh — accessed 2026-08-01
17. `templates/al2023/variables-default.json` — https://github.com/awslabs/amazon-eks-ami/blob/main/templates/al2023/variables-default.json — accessed 2026-08-01
18. `templates/al2023/template.json` — https://github.com/awslabs/amazon-eks-ami/blob/main/templates/al2023/template.json — accessed 2026-08-01
19. `Makefile` (AMI_VARIANT naming) — https://github.com/awslabs/amazon-eks-ami/blob/main/Makefile — accessed 2026-08-01
20. `doc/usage/al2023.md` — https://github.com/awslabs/amazon-eks-ami/blob/main/doc/usage/al2023.md — accessed 2026-08-01
21. Releases, tag `v20260728` (published 2026-07-29) — https://github.com/awslabs/amazon-eks-ami/releases — accessed 2026-08-01
22. `aws/eks-charts` — `stable/aws-efa-k8s-device-plugin/Chart.yaml`, `values.yaml`, `templates/daemonset.yaml`, `templates/NOTES.txt`, `README.md` — https://github.com/aws/eks-charts/tree/master/stable/aws-efa-k8s-device-plugin — accessed 2026-08-01
23. `aws/eks-charts` — `stable/aws-dranet/Chart.yaml`, `values.yaml` — https://github.com/aws/eks-charts/tree/master/stable/aws-dranet — accessed 2026-08-01
24. `aws/karpenter-provider-aws` — `designs/efa-for-static-capacity.md` — https://github.com/aws/karpenter-provider-aws/blob/main/designs/efa-for-static-capacity.md — accessed 2026-08-01
25. `aws/karpenter-provider-aws` — `website/content/en/docs/concepts/nodeclasses.md` — accessed 2026-08-01
26. `eksctl-io/eksctl` — `userdocs/src/usage/nodegroup-managed.md` — https://github.com/eksctl-io/eksctl/blob/main/userdocs/src/usage/nodegroup-managed.md — accessed 2026-08-01
27. `awslabs/awsome-distributed-ai` (formerly `aws-samples/awsome-distributed-training`) — `micro-benchmarks/nccl-tests/` (README.md, nccl-tests.Dockerfile, kubernetes/nccl-tests.yaml, kubernetes/nccl-tests-gb200.yaml) — accessed 2026-08-01
28. `awslabs/ai-on-eks` — `infra/base/terraform/eks.tf` — https://github.com/awslabs/ai-on-eks/blob/main/infra/base/terraform/eks.tf — accessed 2026-08-01
29. `awslabs/ai-on-sagemaker-hyperpod` — `website/docs/00-eks-orchestration/validation-and-testing/environment-validation/efa-validation.md` — accessed 2026-08-01
30. `aws-samples/sample-llm-inference-on-eks` — `k8s-manifest/lws/lws-deepseek-v3.2-tp16-p5.yaml` — accessed 2026-08-01
31. `aws/aws-ofi-nccl` releases — https://github.com/aws/aws-ofi-nccl/releases — accessed 2026-08-01
32. `kubeflow/mpi-operator` releases — https://github.com/kubeflow/mpi-operator/releases — accessed 2026-08-01
33. `kubeflow/trainer` releases — https://github.com/kubeflow/trainer/releases — accessed 2026-08-01
34. AI on EKS site — https://awslabs.github.io/ai-on-eks/ — accessed 2026-08-01

### Tier 2 — AWS best-practices guides
35. EKS Best Practices Guide, AI/ML Networking (authored 2025-05-30, Leah Tucker) — https://github.com/aws/aws-eks-best-practices/blob/master/latest/bpg/aiml/aiml_networking.adoc — accessed 2026-08-01

### Tier 3 / Tier 4
None used.

### Archived or moved (cite only as "this moved")
- `aws-samples/aws-efa-eks` — **archived**, last pushed 2024-10-15
- `aws-samples/awsome-distributed-training` — renamed to `awslabs/awsome-distributed-ai`, last pushed 2026-07-31

---

## 13. Explicit UNKNOWNs (do not fill these with guesses)

1. Number of EFA devices on `p4d.24xlarge` / `p4de.24xlarge` — not stated on any page fetched. (EKS walkthrough uses p4d but gives no count.)
2. Whether `IPC_LOCK` is genuinely required for EFA pods — present in AWS samples, absent from AWS documentation.
3. Whether SageMaker HyperPod on EKS installs the EFA device plugin automatically at cluster creation.
4. What EFA `3.1.0-1.amzn2023` (the kmod RPM version in AMI v20260728) corresponds to in EFA *installer* version terms (installer versions are 1.48.0 / 1.49.0; the kernel package versions independently). No source maps the two.
5. Whether the EFA DRA driver supports Bottlerocket in practice — the comparison table lists Bottlerocket as a supported AMI for the DRA driver, but the NVIDIA DRA driver is explicitly unsupported on Bottlerocket, so the GPU-aligned path there is untestable. AWS does not reconcile this.
