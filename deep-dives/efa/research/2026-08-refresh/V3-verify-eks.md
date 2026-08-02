# V3 Adversarial Verification: `03-efa-eks.md`

**Verifier stance:** refute, not confirm.
**Date:** 2026-08-01
**Methodology:** code is the only authority. Every AMI claim resolved against build scripts, packer templates, package manifests, and API models at a pinned commit. AWS documentation used only as a secondary cross-check; where docs and code disagree, code wins and the disagreement is recorded as a finding.

## Pinned revisions used throughout

| Artifact | Revision | Retrieved |
| --- | --- | --- |
| `awslabs/amazon-eks-ami` `main` HEAD | `c029c3d71745a3b3ab202ada94626e7e44c38152` (2026-07-31T19:58:13Z) | 2026-08-01 |
| `templates/al2023/provisioners/install-efa.sh` last-touching commit | `ac5f340c56a9a6943808c9201da87adec9edb1da` (2026-07-08T16:57:30Z, "fix: erase efa-nv-peermem on non-NVIDIA AMIs (#2756)") | 2026-08-01 |
| `aws-efa-installer-latest.tar.gz` from `https://efa-installer.amazonaws.com` | `env.sh:1` → `EFA_INSTALLER_VERSION=1.49.0` | 2026-08-01 |
| `aws/eks-charts` `stable/aws-dranet` sole commit | `c043cef46c7e` (2026-04-30T20:04:32Z) | 2026-08-01 |
| `kubernetes-sigs/dranet` `main` HEAD | `88a1dcd9050160a491be7f476d1d6fcafc9daeb3` (2026-08-01T09:31:22Z) | 2026-08-01 |
| `NVIDIA/k8s-device-plugin` tags `v0.18.2`, `v0.19.0` | released 2026-01-23, 2026-03-17 | 2026-08-01 |
| `boto/botocore` `develop` `botocore/data/batch/2016-08-10/service-2.json` | AWS Batch API model | 2026-08-01 |

> Note on repo naming: the brief says "aws/eks-ami". The actual repository is **`awslabs/amazon-eks-ami`**. There is no `aws/eks-ami`.

---

## Verdict table

| # | Claim | Verdict |
| --- | --- | --- |
| 1 | EKS AMI runs `efa_installer.sh --minimal`; ships only efa kmod + rdma-core | **PARTLY-CORRECT** |
| 2 | `hostNetwork: true` not required; no AWS source says it; belongs to the plugin DaemonSet | **REFUTED** (as worded) |
| 3 | `eks/aws-dranet`, `efa.networking.k8s.aws`, 2026-04-30, recommended 1.34+, not on Karpenter/Auto Mode | **CONFIRMED** |
| 4 | p5 32 EFA = 8 GPUs x 4 per PCIe root, via `resource.kubernetes.io/pcieRoot` | **PARTLY-CORRECT** (attribute confirmed; 8x4 is inference) |
| 5 | NVIDIA plugin v0.19.0+ defaults `--mofed-enabled=true`, mounts uverbs into GPU containers | **CONFIRMED** (and incomplete: also mounts `rdma_cm`) |
| 6 | AWS Batch MNP jobs are ECS-only, not on EKS with EFA | **CONFIRMED** (stronger evidence than the doc cited) |
| 7 | `aws-samples/aws-efa-eks` archived; `awsome-distributed-training` moved to `awslabs/awsome-distributed-ai` | **CONFIRMED** (one date is misattributed) |

---

## CLAIM 1 (centrepiece): `efa_installer.sh --minimal`

**Verdict: PARTLY-CORRECT.** The install invocation is exactly right. Three sub-claims around it are wrong, incomplete, or over-scoped.

### 1a. The invocation: CONFIRMED

Repo `awslabs/amazon-eks-ami`, commit `ac5f340c56a9a6943808c9201da87adec9edb1da`, file `templates/al2023/provisioners/install-efa.sh`, **line 53**, literal text:

```
sudo ./efa_installer.sh --minimal -y
```

Guard, **line 6**:

```
if [ "$ENABLE_EFA" != "true" ]; then
```

Post-install, **line 63**:

```
if [ "${ENABLE_ACCELERATOR:-}" != "nvidia" ]; then
```

File is 65 lines total. The research doc's quoted excerpt is accurate.

### 1b. What `--minimal` actually excludes: the doc quote is INCOMPLETE, code is authoritative

The research doc sources `--minimal` to an EC2 doc sentence: "To install the EFA software **without Libfabric and Open MPI**". That is the doc's wording and it understates the flag.

`aws-efa-installer` **1.49.0** (`env.sh:1`), `efa_installer.sh` **line 69**, the installer's own usage string, verbatim:

```
 -m, --minimal          Only install kernel module and rdma-core, do not install libfabric, mpi, or the NCCL plugin.
```

The enforcing code, `efa_installer.sh` **lines 908-916**, verbatim:

```
		if [ ${MINIMAL} -eq 1 ]; then
			if [[ ${package_name} = *"libfabric"* ||
				${package_name} = *"openmpi"* ||
				${package_name} = *"libnccl-ofi"* ||
				${package_name} = *"efa-profile"* ]]; then
				echo skipping ${package_name} because of minimal installation
				continue
			fi
		fi
```

So `--minimal` excludes **four** package families, not two: `libfabric*`, `openmpi*`, `libnccl-ofi*` (the aws-ofi-nccl plugin), and **`efa-profile`**.

Two consequences the research doc misses:

1. **`efa-profile` is absent.** That package owns the `/etc/profile.d` and `ld.so.conf` entries for `/opt/amazon/efa`. Its absence is confirmed by the installer's own verification path, `efa_installer.sh` **lines 1258-1259**, which calls `verify_package_file_installation "efa-profile" ...` only inside an `if [ ${MINIMAL} -eq 0 ]` block (line 1236). Practical effect: even if a user later hand-installs libfabric on the host, nothing wires it into the default library or PATH search.
2. **The `--minimal` flag also disables the self-test.** `efa_installer.sh` **lines 1268-1271**:
   ```
   	if [ ${MINIMAL} -eq 1 ]; then
   		echo "Minimal installation does not include libfabric, skipping test."
   		return
   ```
   This is direct first-party corroboration for the research doc's §1.5 caveat that `fi_info -p efa` cannot work on the host.

### 1c. "ships only the efa kernel module plus rdma-core": UNDERSTATED

Derived from `package_list.txt` in installer 1.49.0, filtering `RPMS/ALINUX2023/x86_64/` non-debug entries through the exclusion list at lines 908-916. rdma-core is skipped **only** by `--skip-rdma-core` (lines 930-935), not by `--minimal`.

Packages the AL2023 EKS AMI actually receives:

```
efa-config-1.18-1.amzn2023.noarch.rpm
efa-driver/efa-3.1.0-1.amzn2023.x86_64.rpm
efa-nv-peermem-1.2.3-1.amzn2023.x86_64.rpm
rdma-core/ibacm-63.0-1.amzn2023.x86_64.rpm
rdma-core/infiniband-diags-63.0-1.amzn2023.x86_64.rpm
rdma-core/infiniband-diags-compat-63.0-1.amzn2023.x86_64.rpm
rdma-core/libibumad-63.0-1.amzn2023.x86_64.rpm
rdma-core/libibverbs-63.0-1.amzn2023.x86_64.rpm
rdma-core/libibverbs-utils-63.0-1.amzn2023.x86_64.rpm
rdma-core/librdmacm-63.0-1.amzn2023.x86_64.rpm
rdma-core/librdmacm-utils-63.0-1.amzn2023.x86_64.rpm
rdma-core/python3-pyverbs-63.0-1.amzn2023.x86_64.rpm
rdma-core/rdma-core-63.0-1.amzn2023.x86_64.rpm
rdma-core/rdma-core-devel-63.0-1.amzn2023.x86_64.rpm
```

Packages skipped by `--minimal`:

```
efa-profile-1.7-1.amzn2023.noarch.rpm
libfabric-aws-2.4.0amzn5.0-1.amzn2023.x86_64.rpm
libfabric-aws-devel-2.4.0amzn5.0-1.amzn2023.x86_64.rpm
libnccl-ofi-1.20.0-1.amzn2023.x86_64.rpm
openmpi40-aws-4.1.7-3.x86_64.rpm
openmpi50-aws-5.0.9amzn1-11.x86_64.rpm
pmix-aws-4.2.8-13.x86_64.rpm
prrte-aws-3.0.6-13.x86_64.rpm
```

Corrections this forces:

- The AMI has a **full rdma-core userspace toolchain**, including `ibv_devinfo` (`libibverbs-utils`), `infiniband-diags`, `python3-pyverbs`, and `rdma-core-devel`. Saying "only the efa kernel module plus rdma-core" is technically true but reads as far more minimal than reality. Useful for the app: you *can* enumerate EFA devices on the host with `ibv_devinfo`, you just cannot use `fi_info`.
- `efa-config` and `efa-nv-peermem` also survive `--minimal`. The `rpm -e efa-nv-peermem` at `install-efa.sh:63` is direct proof that `--minimal` installed it in the first place.
- **`aws-ofi-nccl` IS shipped by the installer as `libnccl-ofi-1.20.0`** and is excluded specifically by `--minimal`. The research doc §1.2 says aws-ofi-nccl bundling is "in the full install, not `--minimal`" and cites a Dockerfile comment. Code confirms it, and the exact RPM name and version are now available: `libnccl-ofi-1.20.0-1.amzn2023`. This also cross-checks §1.6's aws-ofi-nccl release list (v1.20.0, 2026-06-25).
- **NCCL is never installed by the EFA installer in any mode.** `package_list.txt` contains no NCCL package. Listing "NCCL" among things `--minimal` withholds conflates two different absences: aws-ofi-nccl is withheld *by the flag*; NCCL is absent *because the EFA installer never had it*. The research doc's line 100 ("It does not give you libfabric, Open MPI, aws-ofi-nccl, or NCCL") is factually true about the AMI but implies a single cause. Reword.

### 1d. WHICH AMI variants: all AL2023 variants (research doc §1.4 is CORRECT)

Three independent code-level confirmations that EFA is not gated on the accelerator:

1. `install-efa.sh:6` gates on `$ENABLE_EFA` only. `ENABLE_ACCELERATOR` is read at line 63 solely to *remove* `efa-nv-peermem`, which presupposes the EFA install already ran on non-NVIDIA builds.
2. `templates/al2023/variables-default.json` **line 17**: `"enable_efa": "true"`. Checked `variables-1.31.json` through `variables-1.35.json`: **zero** occurrences of `enable_efa` in any of them, so nothing overrides the default.
3. `templates/al2023/template.json` **lines 276-291** registers the provisioner unconditionally, passing both `ENABLE_ACCELERATOR` (line 287) and `ENABLE_EFA` (line 288). Packer shell provisioners have no conditional here.

Release `v20260728` (published 2026-07-29T23:31:38Z) confirms the artifact: in every per-Kubernetes-version package table, the `efa` row is `<td>efa</td><td colspan="5">3.1.0-1.amzn2023</td>`. The `colspan="5"` spans the headers `AL2023_x86_64_NVIDIA | AL2023_x86_64_NEURON | AL2023_x86_64_STANDARD | AL2023_ARM_64_NVIDIA | AL2023_ARM_64_STANDARD`. **The standard (non-accelerated) AL2023 EKS AMIs carry the `efa` package.**

The research doc's §1.4 resolution and its recommended framing stand as written. Keep it.

### 1e. SCOPE ERROR: the claim over-generalises to Bottlerocket

This is the material defect. The claim as written says "**The EKS AMI** runs `efa_installer.sh --minimal`". Bottlerocket EKS AMIs do not.

- Code search across the entire `bottlerocket-os` organisation for `efa_installer`: **0 results**. Bottlerocket never executes `efa_installer.sh`.
- The EFA kernel module is a Bottlerocket-built RPM, one per kernel: `bottlerocket-os/bottlerocket-kernel-kit` ships `packages/kmod-6.1-efa`, `packages/kmod-6.12-efa`, `packages/kmod-6.18-efa`.
- `packages/kmod-6.18-efa/kmod-6.18-efa.spec` (branch `develop`), verbatim head:
  ```
  %global efa_installer_ver 1.47.0
  ...
  Name: %{_cross_os}kmod-6.18-efa
  Version: 3.0.0
  ...
  Source0: https://efa-installer.amazonaws.com/aws-efa-installer-%{efa_installer_ver}.tar.gz
  ...
  %prep
  tar -xf %{S:0}
  rpm2cpio aws-efa-installer/RPMS/ALINUX2023/%{_cross_arch}/efa-driver/efa-*.%{_cross_arch}.rpm | cpio -idmu './usr/src/efa-*'
  ```
  Bottlerocket downloads the same tarball but only to `rpm2cpio` the driver **sources** out of it and compile the module itself against its own kernel.
- rdma-core is likewise a Bottlerocket-built package: `bottlerocket-os/bottlerocket-core-kit` `packages/rdma-core/rdma-core.spec`, **line 109**: `# Exclude specific RDMA providers (keeping only libefa)`.

Two publishable consequences:

1. **Mechanism differs, and so do versions.** AL2023 pulls `EFA_VERSION="latest"` at build time (`install-efa.sh:14`), landing `efa-3.1.0-1.amzn2023`. Bottlerocket pins installer **1.47.0** and builds kmod **3.0.0**. These are different EFA driver versions on two AMI families AWS documents as equivalent.
2. **Bottlerocket's rdma-core is deliberately narrower than AL2023's.** AL2023 gets the stock rdma-core suite with all providers plus `ibacm`, `infiniband-diags`, `python3-pyverbs`, `rdma-core-devel`. Bottlerocket strips every provider except `libefa`. Host-side debugging tooling is not the same on the two families.

### 1f. DOC-vs-CODE DISAGREEMENT (publishable)

`https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html`, verbatim:

> "The EKS-optimized AL2023 accelerated AMIs (NVIDIA and Neuron) and all Bottlerocket AMIs include the host-level components required to use EFA, specifically the components installed by the [aws-efa-installer]."

Code says Bottlerocket never runs `aws-efa-installer`. The doc is describing outcome-equivalence in mechanism language. **Code wins:** Bottlerocket reaches a similar end state (efa kmod + an EFA-only rdma-core) by an independent build, at a different pinned installer version.

### 1g. Corrected wording for Claim 1

> The AL2023 EKS AMI build runs `sudo ./efa_installer.sh --minimal -y` (`awslabs/amazon-eks-ami`, `templates/al2023/provisioners/install-efa.sh:53`). Per the installer's own usage text at `efa_installer.sh:69` and its exclusion logic at lines 908-916, `--minimal` skips `libfabric`, `openmpi`, `libnccl-ofi` (aws-ofi-nccl), and `efa-profile`. What lands on the node is the `efa` kernel driver, `efa-config`, `efa-nv-peermem`, and the full `rdma-core` userspace stack. No libfabric, no MPI, no aws-ofi-nccl, and no `/opt/amazon/efa` profile wiring. NCCL was never in the EFA installer at all. Because `install-efa.sh` gates only on `$ENABLE_EFA` and `variables-default.json:17` sets it `"true"` with no per-version override, this applies to **every** AL2023 variant, standard included. Bottlerocket reaches a comparable state by a different route: it compiles `kmod-<kernel>-efa` from driver sources extracted out of a pinned installer 1.47.0 tarball and builds its own `rdma-core` trimmed to `libefa` only. [SPECULATIVE] The 3.1.0-vs-3.0.0 driver version gap between the two AMI families is a real artifact of the two build paths, but no AWS source comments on it.

---

## CLAIM 2: `hostNetwork: true` and EFA workload pods

**Verdict: REFUTED as worded.** The claim has three parts. One survives, two do not.

### What survives

"`hostNetwork: true` is not *required* for EFA workload pods" holds. I found no AWS source asserting a requirement, and the full text of `device-management-efa.html` contains **no occurrence of `hostNetwork` or "host network"** anywhere on the page, including in its own workload pod example. The research doc's list of AWS manifests that omit `hostNetwork` is accurate.

### What is REFUTED

"**no AWS source says this**" and "**it belongs to the device plugin DaemonSet**" are both wrong. Three AWS-authored manifests set `hostNetwork` on genuine *workload* pods that also request `vpc.amazonaws.com/efa`:

1. **`aws/sagemaker-hyperpod-checkpointless-training`**, `examples/llama3/launch/pretrain_llama3_70b_p5.yaml` (branch `main`):
   - line 15: `kind: HyperPodPyTorchJob`
   - line 34: `hostNetwork: True`
   - lines 55, 59: `vpc.amazonaws.com/efa: 32`

   This is a p5 pretraining workload in the `aws` GitHub org, not a device plugin.

2. **`aws/sagemaker-hyperpod-recipes`**, `launcher/nemo/k8s_templates/training/training.yaml` (branch `main`):
   - lines 4, 7: `kind: HyperPodPyTorchJob` / `kind: PyTorchJob`
   - lines 79-80:
     ```
               {{- if $config.hostNetwork }}
               hostNetwork: {{ $config.hostNetwork }}
     ```
   - lines 157, 173: `vpc.amazonaws.com/efa: {{ $config.numEFADevices }}`

   AWS ships `hostNetwork` as a first-class, user-settable knob on EFA training jobs. The same pattern appears in `launcher/nova/k8s_templates/SFT/training.yaml` and in four `tests/**/k8s_baseline_artifacts/**/training.yaml` golden files.

3. **`aws-samples/aws-do-eks`**, `Container-Root/eks/deployment/inference/agentic-ai/nemotron/ultra/agg/lws.yaml-template`:
   - line 8: `kind: LeaderWorkerSet`
   - lines 30-31 and 147-148: `hostNetwork: true` with `dnsPolicy: ClusterFirstWithHostNet`
   - lines 57, 174: `capabilities: add: ["IPC_LOCK"]`
   - lines 130, 135, 216, 221: `vpc.amazonaws.com/efa: "${EFA_PER_WORKER}"`

   This is the strongest counterexample: an inference workload combining `hostNetwork`, `ClusterFirstWithHostNet`, `IPC_LOCK`, and EFA requests, which is precisely the pattern the research doc labels folklore.

### Secondary correction

The research doc says `hostNetwork: true` "belongs to the device plugin DaemonSet". Both device-layer DaemonSets set it, not just one:
- `aws/eks-charts` `stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml` **line 64**: `hostNetwork: true`
- `aws/eks-charts` `stable/aws-dranet/templates/daemonset.yaml` **line 35**: `hostNetwork: true`

### Corrected wording for Claim 2

> `hostNetwork: true` is not required for EFA. No AWS documentation states a requirement, the word does not appear on `device-management-efa.html` at all, and AWS's NCCL-test manifests, its EKS docs MPIJob example, and the `sample-llm-inference-on-eks` LeaderWorkerSets all run EFA on the pod network (the latter explicitly sets `NCCL_SOCKET_IFNAME: eth0`). But it is not folklore either: AWS's own SageMaker HyperPod recipes expose `hostNetwork` as a supported option on EFA training jobs (`aws/sagemaker-hyperpod-recipes`, `launcher/nemo/k8s_templates/training/training.yaml:79-80`), the checkpointless-training p5 example hard-codes `hostNetwork: True` alongside `vpc.amazonaws.com/efa: 32`, and `aws-samples/aws-do-eks` pairs it with `dnsPolicy: ClusterFirstWithHostNet` for multi-node inference. [SPECULATIVE] The likely motivation is rendezvous and control-plane traffic (`GLOO_SOCKET_IFNAME`, torchrun master addressing), not EFA data path, since EFA reaches the container through injected `/dev/infiniband` device nodes regardless of network namespace. No AWS source states the reason.

**Recommendation:** keep the W1 correction in §9.1 (the app's `# Required for EFA` comment is still wrong) but delete the absolutist "no AWS source says this". It is false and a reader can disprove it in one search.

---

## CLAIM 3: EFA DRA driver (DRANET)

**Verdict: CONFIRMED.** Every sub-claim verified. Two enrichments.

| Sub-claim | Evidence | Verdict |
| --- | --- | --- |
| Chart is `eks/aws-dranet` | `aws/eks-charts` `stable/aws-dranet/Chart.yaml`: `name: aws-dranet`, `version: 1.0.0`, `appVersion: "v1.2.0-eksbuild.2"` | CONFIRMED |
| DeviceClass `efa.networking.k8s.aws` | `stable/aws-dranet/values.yaml`, `deviceClass.name: efa.networking.k8s.aws`. Doc verbatim: "the `DeviceClass` name `efa.networking.k8s.aws`" | CONFIRMED (code + doc agree) |
| Added 2026-04-30 | `gh api repos/aws/eks-charts/commits?path=stable/aws-dranet` returns exactly one commit: `c043cef46c7e`, `2026-04-30T20:04:32Z`, "Add aws-dranet helm chart for DRA network driver (#1322)" | CONFIRMED |
| Recommended on K8s 1.34+ | Doc verbatim: "It's recommended to use the EFA DRA driver (DRANET) for new deployments on EKS clusters running Kubernetes version 1.34 or later with EKS managed node groups or self-managed node groups." | CONFIRMED |
| Not supported on Karpenter or EKS Auto Mode | Doc verbatim: "The EFA DRA driver is not supported with Karpenter or EKS Auto Mode. Use the EFA device plugin with Karpenter and EKS Auto Mode." | CONFIRMED |

### Enrichment 1: the chart has not been touched since it landed

`stable/aws-dranet` has exactly **one** commit in its history. The chart is at `version: 1.0.0` three months after introduction, still pinning `dranet:v1.2.0-eksbuild.2`, while upstream `kubernetes-sigs/dranet` has since shipped v1.3.0 (2026-05-28) and v1.4.0 (2026-07-17). [SPECULATIVE] This is a version-lag signal worth stating in the app: AWS's recommended path is pinned two upstream minors behind.

### Enrichment 2: the Auto Mode exclusion is enforced in code, the Karpenter exclusion is not

`stable/aws-dranet/templates/daemonset.yaml` node affinity (around lines 55-68) mirrors the device plugin chart:

```
                - key: eks.amazonaws.com/compute-type
                  operator: NotIn
                  values:
                  - auto
```

So Auto Mode nodes are mechanically excluded from scheduling the DaemonSet. **Nothing in the chart blocks Karpenter-provisioned nodes.** A Karpenter node whose instance type is in `supportedInstanceLabels.values` will happily run `aws-dranet`. The Karpenter half of AWS's statement is a support-policy assertion, not an enforced constraint. Frame it that way in the app so readers do not assume a guardrail exists.

Also worth capturing, the chart's CEL device filter, verbatim from `values.yaml`:

```
filter: >-
  "dra.net/pciDevice" in attributes && attributes["dra.net/pciDevice"].StringValue == "Elastic Fabric Adapter (EFA)"
```

---

## CLAIM 4: p5 32 EFA = 8 GPUs x 4 per PCIe root

**Verdict: PARTLY-CORRECT.** The attribute name is confirmed in code. The 8x4 decomposition is an inference presented as fact.

### The attribute name: CONFIRMED IN CODE

`kubernetes/kubernetes`, `staging/src/k8s.io/dynamic-resource-allocation/deviceattribute/attribute.go`, **lines 25 and 32**, verbatim:

```
	// StandardDeviceAttributePrefix is the prefix used for standard device attributes.
	StandardDeviceAttributePrefix = "resource.kubernetes.io/"
...
	StandardDeviceAttributePCIeRoot resourceapi.QualifiedName = StandardDeviceAttributePrefix + "pcieRoot"
```

Concatenation yields exactly `resource.kubernetes.io/pcieRoot`. The doc comment at lines 29-31 specifies the value format: "a string value in the format `pci<domain>:<bus>`".

Consumed by DRANET at `kubernetes-sigs/dranet` `main` (`88a1dcd`), `pkg/inventory/db.go`, **lines 835-841**:

```
		if _, hasAttr := devices[i].Attributes[deviceattribute.StandardDeviceAttributePCIeRoot]; !hasAttr {
			pcieRootAttr, err := deviceattribute.GetPCIeRootAttributeByPCIBusID(*pciAddrAttr.StringValue)
			if err != nil {
				klog.Errorf("Could not get PCIe root for PCI device %s: %v", normalizedAddr, err)
			} else {
				devices[i].Attributes[pcieRootAttr.Name] = pcieRootAttr.Value
			}
		}
```

DRANET does not define its own attribute name. It reuses the upstream Kubernetes standard constant, which is why the NVIDIA GPU DRA driver and DRANET can be constrained against each other at all. DRANET's own docs state this explicitly (`site/content/docs/user/aws-eks-efa.md` line 12): "Both the NVIDIA GPU DRA driver (`gpu.nvidia.com`) and dranet (`dra.net`) publish the `resource.kubernetes.io/pcieRoot` attribute for the devices they manage."

### The 4-per-root pairing: STATED by AWS

`device-management-efa.html`, verbatim:

> "For example, on `p5.48xlarge` instances there are four EFA devices that share the same PCIe root with one GPU."

The research doc quotes this correctly.

### The 8x4=32 decomposition: INFERRED, not stated

No AWS source, and no DRANET source, states that a p5.48xlarge has eight such groups. AWS states the local ratio (4 EFA : 1 GPU on a shared root). The research doc multiplies by the known 8-GPU count to reach 32, and presents the result twice as settled fact:

- line 423: "**This is the arithmetic that reconciles the '4 EFAs' prose with the '32 EFAs' YAML in §3.2:** p5.48xlarge has 8 GPUs × 4 EFA devices per PCIe root = 32 EFA devices."
- line 901 (M4): "the p5 arithmetic (8 GPUs × 4 EFAs per PCIe root = 32)"

The arithmetic is sound and almost certainly right, but it is derivation, not citation. It also does something subtler: it uses the inference to *resolve* the §3.2 CONTRADICTION between AWS's "four EFAs" prose and its own `vpc.amazonaws.com/efa: 32` YAML. That is an inference doing load-bearing reconciliation work on a documented contradiction, which is exactly the case that needs a label.

Note the two "four"s are different quantities and should not be conflated in the app: the §3.2 prose "four EFAs" is a (wrong) per-*worker-pod* request count, while the §4 "four EFA devices" is a per-*PCIe-root* topology fact. They coincide numerically by accident.

### Corroborating hardware evidence (does not prove 8 groups)

DRANET ships a measured p5-class result, `site/content/docs/user/aws-eks-efa.md` lines 114-118:

| Claim | GPU | EFA | GDR | Bus BW |
|---|---|---|---|---|
| `gpu-efa-aligned` | gpu-0 (`pci0000:10`) | rdmap16s27 (`pci0000:10`) | Yes | ~11.35 GB/s |
| `gpu-efa-unaligned` | gpu-0 (`pci0000:10`) | rdmap160s27 (`pci0000:a0`) | No | ~6.04 GB/s |

> "Cross-PCIe-root placement degrades performance by roughly 1.9x with the same GPU and EFA count."

This shows at least two distinct PCIe roots (`pci0000:10`, `pci0000:a0`) and quantifies the cost of misalignment. It does not enumerate eight. It is excellent material for the app on its own merits, since it turns the topology argument from theory into a measured 1.9x.

### Corrected wording for Claim 4

> DRA pins EFA to GPU with `matchAttribute: "resource.kubernetes.io/pcieRoot"`, the upstream Kubernetes standard device attribute (`k8s.io/dynamic-resource-allocation/deviceattribute/attribute.go:32`), published by both the NVIDIA GPU DRA driver and DRANET. AWS states that "on `p5.48xlarge` instances there are four EFA devices that share the same PCIe root with one GPU", which is why `allocationMode: All` exists. **[SPECULATIVE]** Given p5.48xlarge has 8 GPUs and 32 EFA devices, that ratio implies eight groups of one GPU plus four EFAs; AWS documents the ratio, not the grouping count.

---

## CLAIM 5: NVIDIA `k8s-device-plugin` MOFED default

**Verdict: CONFIRMED in code.** One incompleteness.

### The default flipped exactly at v0.19.0

`NVIDIA/k8s-device-plugin` tag **`v0.19.0`**, `cmd/nvidia-device-plugin/main.go`, **lines 116-121**, verbatim:

```
		&cli.BoolFlag{
			Name:    "mofed-enabled",
			Value:   true,
			Usage:   "ensure that containers that request NVIDIA GPU resources are started with MOFED support",
			EnvVars: []string{"MOFED_ENABLED"},
		},
```

Same block at tag **`v0.18.2`**, **lines 114-118**, verbatim:

```
		&cli.BoolFlag{
			Name:    "mofed-enabled",
			Usage:   "ensure that containers that request NVIDIA GPU resources are started with MOFED support",
			EnvVars: []string{"MOFED_ENABLED"},
		},
```

No `Value:` field in v0.18.2, so the `urfave/cli` `BoolFlag` takes the Go zero value `false`. The `Value: true` line is the entire delta. Release dates: v0.18.2 2026-01-23, v0.19.0 2026-03-17. AWS's doc statement is exactly right.

### The device-mount behaviour: CONFIRMED in code, across two repos

Call chain:

1. `NVIDIA/k8s-device-plugin` v0.19.0, `cmd/nvidia-device-plugin/plugin-manager.go` **line 59**:
   ```
   		cdi.WithMofedEnabled(*config.Flags.MOFEDEnabled),
   ```
2. `NVIDIA/k8s-device-plugin` v0.19.0, `internal/cdi/cdi.go` **lines 154-156**:
   ```
   	if c.mofedEnabled {
   		c.additionalModes = append(c.additionalModes, "mofed")
   	}
   ```
   followed by `nvcdi.New(..., nvcdi.WithMode(mode))` at lines 158-164.
3. `NVIDIA/nvidia-container-toolkit` `main`, `internal/discover/mofed.go` **lines 24-36**, the complete function:
   ```go
   // NewMOFEDDiscoverer creates a discoverer for MOFED devices.
   func NewMOFEDDiscoverer(logger logger.Interface, driver *root.Driver) (Discover, error) {
   	devices := NewCharDeviceDiscoverer(
   		logger,
   		driver.DevRoot,
   		[]string{
   			"/dev/infiniband/uverbs*",
   			"/dev/infiniband/rdma_cm",
   		},
   	)

   	return devices, nil
   }
   ```

### Incompleteness to fix

Both AWS's doc and the research doc say the plugin mounts "all `/dev/infiniband/uverbs*` devices". The code mounts **`/dev/infiniband/uverbs*` and `/dev/infiniband/rdma_cm`**. The glob is unconditional over the whole `uverbs*` namespace, which is the mechanism behind AWS's warning that partial-EFA workloads break: the discoverer has no notion of which EFA devices the pod was allocated.

### Corrected wording for Claim 5

> Starting with `NVIDIA/k8s-device-plugin` v0.19.0 (2026-03-17), `--mofed-enabled` defaults to `true` (`cmd/nvidia-device-plugin/main.go:118`; the flag had no default value in v0.18.2 and therefore defaulted to `false`). When enabled, the plugin adds the `nvcdi` "mofed" mode (`internal/cdi/cdi.go:154-156`), whose discoverer unconditionally injects every `/dev/infiniband/uverbs*` device **plus `/dev/infiniband/rdma_cm`** into any container requesting a GPU (`NVIDIA/nvidia-container-toolkit`, `internal/discover/mofed.go:26-33`). Because the glob is not scoped to the pod's EFA allocation, a workload requesting fewer than all EFA devices on a node still receives all of them, which collides with the EFA device plugin's exclusive allocation model. Set `mofedEnabled=false` (chart) or `MOFED_ENABLED=false` (GPU Operator).

---

## CLAIM 6: AWS Batch MNP is ECS-only

**Verdict: CONFIRMED**, on stronger evidence than the research doc used. The research doc argued from absence ("the Batch on EKS page lists no MNP support"). The API model states it affirmatively.

`boto/botocore` `develop`, `botocore/data/batch/2016-08-10/service-2.json`:

- Shape `NodeProperties`, `documentation`, verbatim: *"An object that represents the node properties of a multi-node parallel job. **Node properties can't be specified for Amazon EKS based job definitions.**"*
- `RegisterJobDefinitionRequest.nodeProperties`, `documentation`, verbatim: *"An object with properties specific to multi-node parallel jobs. If you specify node properties for a job, it becomes a multi-node parallel job. ... **If the job runs on Amazon EKS resources, then you must not specify nodeProperties.**"*
- `nodeProperties` (job-definition context), verbatim: *"When `nodeProperties` is used in the job definition, it can't be used in addition to `containerProperties`, `ecsProperties`, or `eksProperties`."*

Since MNP is *defined* by the presence of `nodeProperties`, and `nodeProperties` is mutually exclusive with `eksProperties`, MNP on EKS is not expressible in the API. Confirmed.

Doc cross-check, `mnp-ce.html`, verbatim: *"AWS Batch multi-node parallel jobs use the Amazon ECS `awsvpc` network mode, which gives your multi-node parallel job containers the same networking properties as Amazon EC2 instances."* Neither `multi-node-parallel-jobs.html` nor `mnp-ce.html` contains the string "EFA", "Elastic Fabric Adapter", "EKS", or "Kubernetes".

### A trap the research doc should record

The API model **does** contain an `eksProperties` member on the `NodeRangeProperty` shape:

```
NodeRangeProperty members: ['targetNodes', 'container', 'instanceTypes', 'ecsProperties', 'eksProperties', 'consumableResourceProperties']
```

Its documentation is the uninformative *"This is an object that represents the properties of the node range for a multi-node parallel job."* Anyone reading the AWS SDK model or generated SDK types (rather than the docs) would reasonably conclude MNP-on-EKS is supported. It is contradicted by `NodeProperties`' own documentation string in the same file. Worth publishing as a concrete example of why "the SDK has a field for it" is not evidence of support.

Also note `mnp-ce.html` independently corroborates two of the research doc's §6.1 points, for a *different* service: MNP requires a cluster placement group in a single AZ, and MNP is not supported on Spot. That is a nice parallel to the EFA-on-EKS placement and Spot guidance.

---

## CLAIM 7: repository states

**Verdict: CONFIRMED**, with one date misattribution.

`gh api repos/aws-samples/aws-efa-eks`:
```
full_name=aws-samples/aws-efa-eks archived=true disabled=false pushed_at=2024-10-15T19:59:27Z archived_at=null default_branch=main
```
Archived: confirmed.

`gh api repos/aws-samples/awsome-distributed-training`:
```
full_name=awslabs/awsome-distributed-ai archived=false disabled=false pushed_at=2026-07-31T23:11:34Z archived_at=null default_branch=main
```
The API follows the rename redirect and returns `awslabs/awsome-distributed-ai`. This is a transfer plus rename, not an archive, and the target is actively maintained (pushed 2026-07-31). Confirmed.

### Misattribution to fix

The research doc writes, twice (lines 329-330 and 1037): *"That repo is **archived**, last pushed 2024-10-15"* and *"`aws-samples/aws-efa-eks` — **archived**, last pushed 2024-10-15"*. The first phrasing is fine. But §9.2 S7 (line 892) compresses it to *"`aws-samples/aws-efa-eks` is archived (2024-10-15)"*, which reads as the archive date. `archived_at` is **null** in the API. 2024-10-15 is the last push. The archive date is not retrievable from the repo API and should be marked UNKNOWN rather than implied. Fix S7 to "archived; last pushed 2024-10-15, archive date UNKNOWN".

---

## Incidental findings outside the seven claims

Recorded because they affect the same sections. Not exhaustively verified.

1. **Chart versions in §3.3 confirmed.** `aws/eks-charts` `stable/aws-efa-k8s-device-plugin/Chart.yaml`: `version: v0.5.30`, `appVersion: "v0.5.20"`. Matches the research doc. The daemonset's `hostNetwork: true` is at line 64 and the `eks.amazonaws.com/compute-type` affinity key at line 60, both as described.

2. **No `variables-1.36.json` exists.** `templates/al2023/` contains `variables-1.28.json` through `variables-1.35.json` plus `variables-default.json`. Release `v20260728` nonetheless publishes a "Source AMI Name (K8s 1.36)" column. [SPECULATIVE] 1.36 presumably falls through to `variables-default.json`. The research doc's §1.3 K8s 1.36 package table is consistent with the release notes regardless; this is a template-layout observation, not a contradiction.

3. **Release `v20260728` publish timestamp** is `2026-07-29T23:31:38Z`, matching the research doc's "published 2026-07-29".

4. **`efa-nv-peermem` version** is `1.2.3-1.amzn2023` in installer 1.49.0. The research doc mentions the package by name but not its version; useful if the app discusses GPUDirect on the host.

5. **Research doc UNKNOWN #4 is now partially answerable.** It asks how EFA kmod `3.1.0-1.amzn2023` maps to installer versions. Installer **1.49.0**'s `package_list.txt` ships exactly `efa-driver/efa-3.1.0-1.amzn2023.x86_64.rpm`. So installer 1.49.0 carries kmod 3.1.0, and Bottlerocket's pinned installer 1.47.0 carries kmod 3.0.0 (`kmod-6.18-efa.spec`, `Version: 3.0.0`). Two data points, not a full mapping, but the UNKNOWN can be narrowed rather than left blank.

---

## Summary of what was inference presented as fact

| Location | Presented as | Actually |
| --- | --- | --- |
| line 423, line 901 (M4) | "p5.48xlarge has 8 GPUs × 4 EFA devices per PCIe root = 32 EFA devices", used to resolve a documented contradiction | AWS states only the 4:1 ratio on a shared root. The count of eight groups is derived from the known GPU count. Label `[SPECULATIVE]`. |
| line 474, line 486, W1 | "no AWS source says this"; `hostNetwork` "belongs to the *plugin's* DaemonSet, not workloads" | Three AWS-authored workload manifests set `hostNetwork` alongside `vpc.amazonaws.com/efa`. Claim of universal absence is false. |
| line 100, line 968 (D1), line 976 (D2) | `--minimal` withholds "libfabric, Open MPI, aws-ofi-nccl, or NCCL", sourced to a doc sentence naming only Libfabric and Open MPI | Code names four exclusions including `efa-profile`. NCCL is not in the installer at all, so its absence has a different cause. Doc quote does not support the four-item list; installer code does. |
| Claim 1 as briefed ("The EKS AMI runs...") | applies to the EKS AMI generally | applies to AL2023 templates only. Bottlerocket never runs `efa_installer.sh`. |
| line 892 (S7) | "`aws-samples/aws-efa-eks` is archived (2024-10-15)" | 2024-10-15 is `pushed_at`. `archived_at` is null. Archive date UNKNOWN. |
| line 334, line 900 (M3) | MOFED mounts "all `/dev/infiniband/uverbs*` devices" (faithful to AWS doc) | Code also mounts `/dev/infiniband/rdma_cm`. Doc is incomplete; code is authoritative. |
