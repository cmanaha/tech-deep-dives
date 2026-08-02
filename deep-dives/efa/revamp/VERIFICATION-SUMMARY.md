# Verification Pass — What Survived, What Did Not

Run 2026-08-01 under the code-is-the-authority rule. Three adversarial verifiers
attacked the first research round; two new code-first research agents covered
ENA and the storage data paths.

## Headline: the verifiers found real errors in our own research

This is the point of the layer. Six of the first round's claims were overstated
and one was flatly wrong. None of this should have shipped as written.

## Verdicts — EFA core (V1)

| Claim | Verdict |
|---|---|
| RDMA Read/Write are native hardware opcodes | PARTLY-CORRECT |
| Kernel driver now implements post_send/poll_cq | PARTLY-CORRECT (and it IS on by default) |
| EFA v4 / Nitro v6, device id 0xefa4 | PARTLY-CORRECT |
| NCCL_ALGO/PROTO no longer disables the tuner | PARTLY-CORRECT |
| GPUDirect Async via FI_EFA_GDA_OPS | PARTLY-CORRECT |
| Data Path Direct runs without rdma-core at all | **REFUTED** |

Corrections that must be carried into the writing:

- **Data Path Direct does NOT eliminate rdma-core.** `efa_data_path_direct.c` calls
  `efadv_query_qp_wqs` and `efadv_query_cq`, both rdma-core, and the build gate
  requires them. libfabric's own env help says it bypasses rdma-core *on the data
  path*. The in-repo `efa_fabric_comparison.md` says "without rdma-core API"
  unqualified. Another doc-vs-code contradiction; code wins; publish both.
- **"Not wired into the NCCL plugin" is false.** aws-ofi-nccl v1.20.0 has a whole
  GIN/GDAKI subsystem that opens `FI_EFA_GDA_OPS`. Do not publish the caveat.
- **The kernel-driver claim needs qualification.** True for out-of-tree amzn-drivers
  (`ENABLE_KVERBS` on by default). FALSE for mainline Linux, where `efa_dev_ops` has
  none of those ops and device IDs stop at `0xefa3`. That divergence is itself content.
- **`0xefa4` = "EFA v4" is unsourced inference**, five device IDs against four
  documented EFA versions. Mark SPECULATIVE or drop.
- **The opcode enum alone does not prove hardware support.** The decisive evidence is
  the device-reported capability bits, which also show support is negotiated per
  device. Strengthen the citation.
- r3.3.0 is master-HEAD only; shipping installer 1.49.0 still carries driver 3.1.0.

## Verdicts — pricing and instances (V2)

All seven claims CONFIRMED, including the $55.04 and $21.957642 figures re-derived
from the bulk price list (Last-Modified 2026-07-28), filtering `MarketOption=OnDemand`
— load-bearing, because a `CapacityBlock` row exists at $0.00 for the same SKU.

But our causal story was wrong: we said prices "fell since the March 2026 vintage."
The March 2026 price list already read $55.04. The figure was roughly nine months
stale when that content shipped. $98.32 and $32.7726 were both genuinely correct
through the May 2025 list; the cut landed in June 2025.

Must NOT ship: all four Spot estimates (fabricated); hpc7a $3.60 (never correct in
any region or year); the Capacity Block "~15% January 2026", "11:30 AM UTC" and
"no cancellation" claims; the `costPerGbps` column; Trn3's "28.8 Tbps" (absent from
the announcement, likely collided with the P6e-GB200 figure).

Two of our own corrections were themselves wrong: the trn2 memory verdict and the
"100 Gbps class" grouping for g4dn/g5/vt1 (actually 25 to 50 Gbps).

## Verdicts — EKS (V3)

| Claim | Verdict |
|---|---|
| AMI runs `efa_installer.sh --minimal` | PARTLY-CORRECT |
| `hostNetwork` not required, no AWS source says it | **REFUTED as worded** |
| aws-dranet chart, DeviceClass, date, support matrix | CONFIRMED |
| p5 = 8 GPUs x 4 EFA per PCIe root | PARTLY-CORRECT (inference) |
| NVIDIA plugin v0.19.0 mofed default | CONFIRMED |
| Batch MNP is ECS-only | CONFIRMED (stronger evidence found) |
| Repo archive/rename states | CONFIRMED (one date misattributed) |

- **"No AWS source says hostNetwork is needed" is disprovable in one search.** Three
  AWS-authored workload manifests set it alongside `vpc.amazonaws.com/efa`, including
  `sagemaker-hyperpod-checkpointless-training` and `sagemaker-hyperpod-recipes`. The
  correct claim is "not required", not "nobody does it."
- **`--minimal` excludes four families, not two**: libfabric, openmpi, libnccl-ofi and
  efa-profile. And the AMI does get the full rdma-core suite, so "kmod plus rdma-core"
  understates it. NCCL was never in the installer at all, so bundling it in conflates
  two causes.
- **Bottlerocket never runs `efa_installer.sh`** (zero hits org-wide). It compiles a
  kmod from sources extracted out of a pinned 1.47.0 tarball and builds its own
  rdma-core trimmed to libefa. AWS docs claim it ships "the components installed by
  the aws-efa-installer". Doc-vs-code contradiction, publishable.
- The 8x4 arithmetic is our inference doing load-bearing work. Needs SPECULATIVE.

## New: ENA vs EFA (06) — Carlos's model was right, ours was wrong

"SRD is built on top of ENA" is WRONG as stated. SRD lives in the Nitro card; ENA
(via ENA Express) and EFA are peer consumers of it. Decisive disproof: an EFA-only
interface creates an EFA device with no ENA device at all and still carries SRD.
The ENA driver contains no SRD implementation, only a read-only stats struct.

41 facts, 29 derived from code, pinned to `amzn-drivers@b99452b7`. `SRD.txt`
deliberately not cited.

Best teaching point found, and it was not in the brief: **EFA has an LLQ too — the
difference is who holds the pen.** Both drivers use the same BAR conventions and
write-combined descriptor pushes. In ENA the kernel driver pushes; in EFA the driver
mmaps that same BAR to userspace so libfabric writes descriptors directly. ENA has
zero userspace mmap anywhere. That is OS bypass expressed in code.

Also: ENA does not do LRO (commonly misstated). ENA Express is GET-only to the
driver and cannot be enabled from inside the instance.

## New: storage data paths (07) — Carlos's premise refuted

**FSx for Lustre + EFA is real, but it is Persistent 2 only, and requires a metadata
configuration.** Scratch 1, Scratch 2, Persistent 1 and HDD get no EFA and no GDS.
So "scratch mode" is the ENA-only, 100 Gbps-per-client path, the opposite of the
premise. Per-client ceilings from one AWS table: ENA 100 / EFA 700 / EFA+GDS 1,200
Gbps. GDS is restricted to exactly P5, P5e, P5en and P6-B200. EFA cannot be enabled
on an existing filesystem, and Intelligent-Tiering does not support S3 data
repository associations, so wanting EFA+GDS *and* S3 lazy loading forces Persistent 2 SSD.

**CRT multi-NIC harvesting is real, but 100% manual.** Verified through to
`setsockopt(SO_BINDTODEVICE)`. The CRT never discovers NICs: `getifaddrs` and
`if_nameindex` are absent from all of aws-c-io, and the platform-info source says so
in a TODO. Linux needs kernel 5.7+ or root; not on Windows; API marked experimental.

Doc-vs-code: an AWS Storage Blog claims the CRT auto-tunes to "CPU topology, amount
of memory, and the number and layout of ENA interfaces." Code contradicts three of
the four. **Open item U-5: not yet checked whether the Java/Python bindings do this
above the C client. Must resolve before publishing this finding.**

Confirmed at source level: zero `efa`/`libfabric`/`rdma`/`GPUDirect` hits across all
three CRT repos. There is no EFA path to S3.

## Scope decisions taken

- **Decision Guide dropped.** The "do I need EFA" gate folds into section 1, the
  scenario table into section 9. Most of its content was already redistributed.
- **ENA vs EFA gets its own section.** It is the single most common conflation and
  the LLQ finding is a genuine teaching moment. Folding it into "EFA vs Alternatives"
  would bury it.
- **Storage gets one section**, leading with the scratch-mode correction, the
  100/700/1200 table, "no EFA path to S3", and multi-NIC. CRT internals (part sizing,
  memory ladder, retry buckets) defer to a future storage deep dive.

Net section count: 25.

## Still open

1. U-5 above (CRT bindings NIC discovery) before that doc-vs-code claim ships.
2. Carlos to confirm and extend the source-of-truth repository list.
3. WebSearch is failing in this environment with
   `400 output_config.effort 'xhigh' is not supported when thinking is disabled`.
   Every agent worked around it with WebFetch/curl on raw GitHub, which gave better
   provenance anyway, but it should be fixed.
