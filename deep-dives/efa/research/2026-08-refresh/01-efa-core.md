# EFA Core Technology Refresh — Research Report

**Research date:** 2026-08-01
**Scope:** SRD protocol internals, efa kernel driver (amzn-drivers), libfabric EFA provider data path, EFA device generations, GPUDirect RDMA/Async, aws-ofi-nccl plugin + tuner, current version numbers, 2025-2026 features.
**Verification targets:** `deep-dives/efa/src/sections/Architecture.tsx`, `deep-dives/efa/src/sections/AIMLTraining.tsx`

**Source tiers used:**
- **Tier 1** = official AWS documentation, official source code repositories (`amzn/amzn-drivers`, `ofiwg/libfabric`, `aws/aws-ofi-nccl`), AWS API reference
- **Tier 2** = AWS blogs, re:Invent talks
- **Tier 3** = third-party analysis, academic papers
- **Tier 4** = tutorials/blogs (never cited as fact)

**Repository states pinned during this research:**
- `amzn/amzn-drivers` @ `master`, HEAD commit `b99452b707` "linux/efa: Bump driver version to 3.3.0", authored 2026-07-28T15:24:30Z
- `ofiwg/libfabric` @ tag `v2.6.0`, published 2026-06-22T15:20:56Z
- `aws/aws-ofi-nccl` @ tag `v1.20.0`, published 2026-06-25T04:54:50Z

---

## PART 1 — VERIFIED FACTS

### 1.1 SRD (Scalable Reliable Datagram) Protocol Internals

**F-1. SRD is the transport protocol behind the EFA device; the AWS user guide states this as the device's defining capability.**
> "The EFA device provides capabilities like built-in OS-bypass and congestion control through the Scalable Reliable Datagram (SRD) protocol."

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

**F-2. The canonical SRD QP-type specification is shipped in the driver repo as `SRD.txt` and has NOT been substantively updated for RDMA operations.** The file still reads:
> "Currently only Send operation is supported, but nothing precludes RDMA operations support in future (with weak memory consistency)."

This is now **historically stale within the repo itself** — the same repository's driver code implements `EFA_IO_RDMA_READ` and `EFA_IO_RDMA_WRITE` (see F-9). `SRD.txt` documents the original 2019-era SRD QP semantics and has not been revised.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/SRD.txt — Tier 1 — accessed 2026-08-01

**F-3. SRD QP scalability math, verbatim from `SRD.txt`:**
> "With the Reliable Connected (RC) Transport Service, the number of QPs and connection contexts required per endnode to achieve full process to process connectivity is equal to N*p*p (where N is the number of nodes in the cluster and p the number of processes per node)."
> "Reliable Datagram (RD) model reduces the number of QPs required for full connectivity in the scenario above to p"

Note the units: these are **per endnode** figures, not cluster totals.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/SRD.txt — Tier 1 — accessed 2026-08-01

**F-4. SRD provides reliable, out-of-order delivery without segmentation.** Verbatim:
> "As RD, SRD QPs provide reliable delivery. Unlike RD (and similar to UD) SRD QPs provide out-of-order delivery without segmentation support."

**SRD is a RELIABLE transport at the hardware level.** Any claim that EFA hardware is "unreliable datagram" and that libfabric adds reliability is wrong.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/SRD.txt — Tier 1 — accessed 2026-08-01

**F-5. SRD hardware-level error semantics.** `SRD.txt` documents SRD-specific work-completion errors: "Bad Dest QP Error" (responder rejected because destination QP does not exist or is in error state) and "SRD RNR error" (Receive Queue has no posted WRs; "Requester does not perform any retries"). Plus an unaffiliated async event: "Remote Unresponsive Event - The local transport timeout was exceeded while trying to send messages to a specific destination (AH)."

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/SRD.txt — Tier 1 — accessed 2026-08-01

**F-6. SRD address model: no EE contexts; each Send WR carries an AH (Address Handle) which is implicitly associated with an SRD context.** Verbatim: "Instead of EE context, each SRD WR includes the AH (Address Handle) of the remote destination (as in UD). Each AH is implicitly associated with an SRD context."

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/SRD.txt — Tier 1 — accessed 2026-08-01

**F-7. The 64-path packet-spraying figure is confirmed by AWS.** Verbatim from the AWS HPC Blog:
> "SRD can push all the packets making up a block of data all at once, over all the possible pathways in our fabric (in practice, for memory reasons, we choose 64 paths at a time from the hundreds or even thousands available)."

Same source on tail latency:
> "we relaxed the requirement for in-order packet delivery in the belief that if it's necessary we can re-assert it in the higher layers of the stack. The p99 tail latency plummeted (by around a factor of 10)."

Source: https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/ — Tier 2 — accessed 2026-08-01

**F-8. SRD is used well beyond EFA — confirmed for EBS io2 Block Express and ENA Express.**
- EBS: "Block Express servers communicate with Nitro-based instances using the Scalable Reliable Datagram (SRD) networking protocol. This interface is implemented in the Nitro Card dedicated for Amazon EBS I/O function on the host hardware of the instance." Source: https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html — Tier 1 — accessed 2026-08-01
- ENA Express: "ENA Express is powered by AWS Scalable Reliable Datagram (SRD) technology... Increases the maximum bandwidth a single flow can use from 5 Gbps up to 25 Gbps within the same Region, up to the aggregate instance limit." ENA Express now supports **cross-AZ within the same Region** ("you can communicate between two EC2 instances in the same Availability Zone or across Availability Zones within the same Region"), excluding South America (São Paulo), Middle East (Bahrain), Middle East (UAE), and Local Zones. Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html — Tier 1 — accessed 2026-08-01

Important scoping note: the "5 Gbps → 25 Gbps single flow" figure is an **ENA Express** statistic, not a general EFA/SRD statistic.

**F-9. SRD supports both two-sided and one-sided RDMA at the hardware level.** libfabric's own EFA provider design doc states verbatim:
> "The EFA NIC supports both two-sided and one-sided RDMA using a proprietary protocol called Scalable Reliable Datagram (SRD)"

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/docs/efa_fabric_comparison.md — Tier 1 — accessed 2026-08-01

---

### 1.2 The efa Kernel Driver (amzn-drivers)

**F-10. Current driver version at HEAD is `r3.3.0`.** Release notes list, verbatim, for r3.3.0:
- "Add Completion Counters support"
- "Add support for creating QP and SQ that use 64-bit work request ids"
- "Add support for 128-byte send queue WQEs"
- "Add support for inline WRITE operation"
- "Add 0xefa4 device support"
- "Support reporting 800 and 1600 Gbps link speed"
- "Expose link speed in Gbps using a new query verbs"
- "Add checksum validation on Admin responses"
- "Add driver support for >4GB MR page size"
- "Add driver mechanism for reusing AH device objects"

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/RELEASENOTES.md — Tier 1 — accessed 2026-08-01

**F-11. Device IDs map to EFA generations.** Driver release notes record PCI device ID additions:
- `0xefa3` added in r2.12.0
- `0xefa4` added in r3.3.0

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/RELEASENOTES.md — Tier 1 — accessed 2026-08-01

**F-12. RDMA Write was added to the kernel driver in r2.4.0; RDMA write statistics in r2.5.0; inline WRITE in r3.3.0.** Verbatim entries: r2.4.0 — "Add RDMA write support", "Add data polling support"; r2.5.0 — "Add RDMA write statistics"; r2.10.0 — "Introduce QP with unsolicited write with immediate receive"; r3.3.0 — "Add support for inline WRITE operation".

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/RELEASENOTES.md — Tier 1 — accessed 2026-08-01

**F-13. CRITICAL CHANGE — the kernel driver NOW implements `post_send`, `post_recv`, and `poll_cq`.** Driver release notes r2.12.0: "Introduce EFA kernel verbs support". At HEAD there is a dedicated 798-line source file `kernel/linux/efa/src/efa_data_verbs.c` implementing `efa_post_send`, `efa_post_recv`, `efa_poll_cq`, `efa_req_notify_cq`, `efa_map_mr_sg`, and `efa_set_page`.

These are registered in the `ib_device_ops` table in `efa_main.c` (lines 549-558 at HEAD), guarded by `#ifdef HAVE_EFA_KVERBS`:

```c
#ifdef HAVE_EFA_KVERBS
	.get_dma_mr = efa_get_dma_mr,
	.alloc_mr = efa_alloc_fast_mr,
	.map_mr_sg = efa_map_mr_sg,
	.post_send = efa_post_send,
	.post_recv = efa_post_recv,
	.poll_cq = efa_poll_cq,
	.req_notify_cq = efa_req_notify_cq,
#endif
```

**Essential nuance:** this is the **kernel-verbs path for in-kernel RDMA consumers**. It does not change the userspace OS-bypass model. A userspace application using libfabric still never enters the kernel on the data path. But the statement "the kernel driver intentionally does NOT implement post_send/post_recv/poll_cq" is no longer factually true at HEAD.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_main.c and https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_data_verbs.c — Tier 1 — accessed 2026-08-01

**F-14. RDMA Read and RDMA Write are native hardware opcodes, not software emulation.** From the hardware I/O descriptor definitions shared between device and driver:

```c
enum efa_io_send_op_type {
	/* send message */
	EFA_IO_SEND                                 = 0,
	/* RDMA read */
	EFA_IO_RDMA_READ                            = 1,
	/* RDMA write */
	EFA_IO_RDMA_WRITE                           = 2,
	/* Fast MR registration */
	EFA_IO_FAST_REG                             = 3,
	/* Fast MR invalidation */
	EFA_IO_FAST_INV                             = 4,
};
```

`efa_data_verbs.c` maps `IB_WR_RDMA_READ → EFA_IO_RDMA_READ` (line 355-356) and `IB_WR_RDMA_WRITE → EFA_IO_RDMA_WRITE` (line 364-365), and decodes completions back (`EFA_IO_RDMA_WRITE → IB_WC_RDMA_WRITE`, line 628-629).

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_io_defs.h and `.../src/efa_data_verbs.c` — Tier 1 — accessed 2026-08-01

**F-15. BAR regions and UARN scoping still exist at HEAD.** `efa.h` declares `reg_bar_addr`/`reg_bar_len`, `mem_bar_addr`/`mem_bar_len`, `db_bar_addr`/`db_bar_len`, the `__iomem` pointers `mem_bar` and `db_bar`, and `u16 uarn` fields on both ucontext and QP structs.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa.h — Tier 1 — accessed 2026-08-01

**F-16. Phase-bit lockless CQ polling is confirmed in source.** `efa_data_verbs.c`:
```c
static int efa_cqe_is_pending(struct efa_io_cdesc_common *cqe_common, int phase)
{
	return EFA_GET(&cqe_common->flags, EFA_IO_CDESC_COMMON_PHASE) == phase;
}
```
with `sub_cq->phase = 1 - sub_cq->phase;` on wrap, and the send queue setting `EFA_IO_TX_META_DESC_PHASE` from `qp->sq.wq.phase`.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_data_verbs.c — Tier 1 — accessed 2026-08-01

**F-17. Other notable driver capabilities added 2024-2026** (all verbatim from RELEASENOTES.md):
- r2.17.0: "Add Network HW statistics counters", "Add CQ with external memory support"
- r2.17.3: "Support P2P with NVIDIA 580 drivers"
- r2.13.0: "Add an option to create QP with specific service level", "Report link speed according to device parameters"
- r2.8.0: "Introduce Query MR support", "Expose underlying interconnects used to reach memory regions"
- r2.6.0: "Enable Nvidia GDR using P2P on up-to-date kernels", "Expose accelerator memory P2P provider in sysfs"

The driver also carries Neuron P2P support (`efa_neuronmem.c`) and NVIDIA P2P shims (`efa_nvmem_v1.c`, `efa_nvmem_v2.c`, `nv-p2p.h`, `nv-p2p_v2.h`).

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/RELEASENOTES.md, directory listing of `kernel/linux/efa/src` — Tier 1 — accessed 2026-08-01

---

### 1.3 libfabric EFA Provider Data Path

**F-18. MAJOR NEW FEATURE — libfabric now exposes TWO fabric names for RDM endpoints: `efa` and `efa-direct`.** Verbatim from the man page:
> "For reliable datagram (RDM) EP type, it supports two fabric names: `efa` and `efa-direct`. The `efa` fabric implements a set of wire protocols to support more capabilities and features beyond the EFA device capabilities. The `efa-direct` fabric, on the contrary, offloads all libfabric data plane calls to the device directly without wire protocols."

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_efa.7.md — Tier 1 — accessed 2026-08-01

**F-19. `efa-direct` workflow is a 1:1 WQE mapping with no internal staging.** Verbatim from the provider's own comparison doc:
> "**Tx Post:** Constructs Work Queue Entry (WQE) directly from application calls (`fi_*` functions). Maintains 1-to-1 mapping between WQE and libfabric call. Only performs two operations before data is sent to the NIC: 1. Construct WQE 2. Ring the doorbell (when required)"
> "**Rx Post:** No internal Rx buffers - each `fi_recv` call is constructed as WQE and posted directly to device... Zero-copy receive path with direct data placement"

`efa-direct` limits: MSG max size = device MTU (~8 KiB); RMA max size = device max RDMA size (~1 GB); requires `FI_CONTEXT2` and `FI_MR_LOCAL`; no `FI_TAGGED`, no `FI_ATOMIC`, no `FI_DIRECTED_RECV`, no `FI_MULTI_RECV`, no message ordering, no `fi_cancel`.

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/docs/efa_fabric_comparison.md — Tier 1 — accessed 2026-08-01

**F-20. MAJOR NEW FEATURE — "Data Path Direct": libfabric now posts WQEs and polls CQs itself, bypassing the rdma-core API.** Verbatim from the comparison doc:
> "**Data Path Direct**: A recent improvement to implement the WQE post and CQ poll directly in Libfabric without rdma-core API. It is now enabled in both fabrics"

Implemented in `prov/efa/src/efa_data_path_direct.c` / `.h` (plus `efa_data_path_direct_entry.h`, `_internal.h`, `_structs.h`, `efa_data_path_ops.h`). The header describes it as: "Direct CQ operations provide a high-performance path for completion processing by bypassing the standard libfabric completion queue abstraction and directly accessing hardware completion queues."

Timeline (from AWS EFA installer changelog): "Optimize WQE post in data path direct path" shipped in installer 1.45.0 (Nov 17, 2025); "Enable data path direct for efa-rdm protocol path" shipped in installer 1.46.0 (Dec 12, 2025).

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/src/efa_data_path_direct.h, `.../docs/efa_fabric_comparison.md`, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html — Tier 1 — accessed 2026-08-01

**F-21. "Util CQ Bypass" is a second new fast-path optimization, enabled on `efa-direct` only.** Verbatim: "**Util CQ Bypass** Another improvement to get rid of the CQE staging in util CQ".

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/docs/efa_fabric_comparison.md — Tier 1 — accessed 2026-08-01

**F-22. RDMA Read/Write are NOT software-emulated when the device supports them.** Verbatim from the comparison doc, describing the `efa` fabric's RMA path:
> "**Note**: For RMA operations (`fi_read`/`fi_write`), such workflow still applies, but when device RDMA is available, the data goes directly to/from user buffers without internal staging or copying."

And from the man page env-var section:
> "If the firmware supports RDMA write, device RDMA write will always be used." (`FI_EFA_INTER_MIN_READ_WRITE_SIZE` description)

What IS still software-emulated in the `efa` fabric: `FI_TAGGED`, `FI_ATOMIC`, and `FI_DIRECTED_RECV` ("efa provides support through software emulation, efa-direct lacks support"), and `FI_HMEM` when NIC-GPU peer-to-peer is unavailable.

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/docs/efa_fabric_comparison.md, https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_efa.7.md — Tier 1 — accessed 2026-08-01

**F-23. `FI_EFA_USE_DEVICE_RDMA` semantics and defaults.** Verbatim from the man page:
> "The default behavior for RDMA transfers depends on API version. For API >= 1.18 RDMA is enabled by default on any hardware which supports it. For API<1.18, RDMA is enabled by default only on certain newer hardware revisions."
> "- When set to 0/false/no/off, libfabric will emulate all fi_rma operations instead of offloading them to the EFA network device."
> "- If not set, RDMA operations will occur when available based on RDMA device ID/version."

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_efa.7.md — Tier 1 — accessed 2026-08-01

**F-24. All `rxr_*`-prefixed source files and symbols are GONE.** The EFA provider was renamed to the `efa_rdm_*` namespace. `grep -rln "rxr_pkt_post_ctrl"` over `ofiwg/libfabric` @ v2.6.0 returns zero matches. The RDM sources now live at `prov/efa/src/rdm/efa_rdm_*.c`.

Source: `git clone --branch v2.6.0 https://github.com/ofiwg/libfabric`, grep over `prov/efa` — Tier 1 — accessed 2026-08-01

**F-25. `efa_rdm_ep.c` no longer exists.** The RDM endpoint code is split into `efa_rdm_ep.h`, `efa_rdm_ep_fiops.c` (59,179 bytes), and `efa_rdm_ep_utils.c` (30,305 bytes).

Source: https://github.com/ofiwg/libfabric/tree/v2.6.0/prov/efa/src/rdm — Tier 1 — accessed 2026-08-01

**F-26. `cuda_is_addr_cuda_accessible` no longer exists anywhere in libfabric.** Repo-wide grep @ v2.6.0 returns zero matches. `efa_rdm_ep_use_p2p` DOES still exist (called from `efa_rdm_pke_utils.c:68`, `:250` and `efa_rdm_rma.c:133`).

Source: `git clone --branch v2.6.0 https://github.com/ofiwg/libfabric`, repo-wide grep — Tier 1 — accessed 2026-08-01

**F-27. Protocol selection for GPU memory: only eager and runting-read are supported — CONFIRMED, but the source location has moved.** The actual mechanism is in `prov/efa/src/efa_hmem.c`, function `efa_hmem_info_init_protocol_thresholds()`:

```c
	case FI_HMEM_CUDA:
	case FI_HMEM_ROCR:
		info->runt_size = EFA_DEFAULT_RUNT_SIZE;
		info->max_medium_msg_size = 0;
		info->min_read_msg_size = efa_max_eager_msg_size_with_largest_header() + 1;
		...
		         "but only eager and runting read protocols are supported for %s over EFA.\n",
```

Setting `max_medium_msg_size = 0` is what disables the medium protocol for CUDA/ROCr and Neuron memory. The provider emits a warning if `FI_EFA_INTER_MAX_MEDIUM_MESSAGE_SIZE` is set on those interfaces. **The source does not state a reason** (no claim about "GPU memory cannot be used as an inline source").

The four two-sided protocols are named in `efa_rdm_msg_select_rtm()` (`prov/efa/src/rdm/efa_rdm_msg.c:42`): "Four types of protocol can be used: eager, medium, longcts, longread."

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/src/efa_hmem.c, `.../src/rdm/efa_rdm_msg.c` — Tier 1 — accessed 2026-08-01

**F-28. New provider-specific features in libfabric 2.x:**
- `FI_EFA_WR_HIGH_PPS` operation flag — "hint the device to optimize for higher message rate" on RDMA write ops
- `FI_OPT_EFA_HOMOGENEOUS_PEERS` — skips handshake establishment when all peers are identical
- `FI_OPT_EFA_USE_UNSOLICITED_WRITE_RECV` — RDMA-write-with-immediate does not consume an Rx buffer on the target (default true)
- `FI_OPT_EFA_WRITE_IN_ORDER_ALIGNED_128_BYTES` / `FI_OPT_EFA_SENDRECV_IN_ORDER_ALIGNED_128_BYTES`
- `FI_EFA_FEATURE_OPS` — runtime feature-query extension (`"mixed_hmem_iov"`, efa-direct only)
- Hardware completion counters via `cntr_open_ext`, "backed by MSI-X(Message Signaled Interrupts Extended) hardware counters on the EFA device", supporting external memory via VA or DMA-BUF
- Zero-copy receive mode: "Support for the zero-copy mode was deprecated in Libfabric v2.6"
- `FI_AV_MAP` deprecated in libfabric 2.x (falls back to `FI_AV_TABLE` with a warning)

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_efa.7.md — Tier 1 — accessed 2026-08-01

---

### 1.4 GPUDirect RDMA and GPUDirect Async

**F-29. MAJOR — GPUDirect Async (GDA) IS now supported on EFA via libfabric, on the `efa-direct` fabric.** Verbatim from the man page:
> "To enable GPU Direct Async (GDA), which allows the GPU to interact directly with the NIC, request `FI_EFA_GDA_OPS` in the `name` parameter with efa-direct fabirc." [sic — typo is in the source]

The exposed function table:
```c
struct fi_efa_ops_gda {
	int (*query_addr)(struct fid_ep *ep_fid, fi_addr_t addr, uint16_t *ahn,
			  uint16_t *remote_qpn, uint32_t *remote_qkey);
	int (*query_qp_wqs)(struct fid_ep *ep_fid, struct fi_efa_wq_attr *sq_attr, struct fi_efa_wq_attr *rq_attr);
	int (*query_cq)(struct fid_cq *cq_fid, struct fi_efa_cq_attr *cq_attr);
	int (*cq_open_ext)(...);
	uint64_t (*get_mr_lkey)(struct fid_mr *mr);
	int (*cntr_open_ext)(...);
```

The feature matrix confirms scope: "GPU Direct Async (GDA) domain ops extension | efa ❌ | efa-direct ✓" and "efa-direct provides query operations for address, queue pair, and completion queue attributes. efa fabric doesn't support these operations."

**Scoping caveat:** GDA is exposed at the **libfabric layer for `efa-direct` only**. A repo-wide grep of `aws/aws-ofi-nccl` @ v1.20.0 for `FI_EFA_GDA` / `efa-direct` returns zero matches, so the NCCL plugin does not consume it.

Source: https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_efa.7.md, `.../prov/efa/docs/efa_fabric_comparison.md`, grep over `aws/aws-ofi-nccl` @ v1.20.0 — Tier 1 — accessed 2026-08-01

**F-30. GPUDirect RDMA prerequisites per aws-ofi-nccl:** "For GPUDirect RDMA support, the plugin also requires `FI_HMEM` support, as well as RDMA support."

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/README.md — Tier 1 — accessed 2026-08-01

**F-31. `FI_EFA_USE_DEVICE_RDMA=1` should NOT be set on modern stacks.** Verbatim from the plugin's own EFA cheatsheet:
> "`FI_EFA_USE_DEVICE_RDMA=1` — Do not set for libfabric>=1.18.0 and aws-ofi-nccl>=1.7.0. It's not harmful to set it on p4/p5 instances with the newer software, but you just don't have to set it."

Same doc: `FI_PROVIDER=efa` and `NCCL_PROTO=simple` are documented as needed only for "aws-ofi-nccl<=1.5.0". `FI_EFA_FORK_SAFE=1` is "Not needed anymore." `RDMAV_FORK_SAFE=1` — "Do not use... on newer kernels, where `RDMAV_FORK_SAFE=1` can break things."

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/doc/efa-env-var.md — Tier 1 — accessed 2026-08-01

**F-32. GDRCopy is a documented install step but the EFA installer's GDR flag became a no-op in 2021.** The AWS NCCL getting-started guide has "Step 4: Install GDRCopy" as a discrete step before "Step 5: Install the EFA software". Separately, the EFA installer changelog for version 1.14.0 (October 2021) reads: "Make `-g, --enable-gdr` in `efa_installer.sh` as a no-op option as the latest efa kernel driver enables GDR support by default." aws-ofi-nccl carries its own optional GDRCopy integration in `src/nccl_ofi_gdrcopy.cpp` (dlopen-based: `gdr_open`, `gdr_pin_buffer`, `gdr_map`).

**GDRCopy and GPUDirect RDMA are different things.** GPUDirect RDMA (NIC DMA to/from GPU memory) is enabled by the EFA kernel driver's P2P support. GDRCopy is a separate library for low-latency CPU access to GPU memory mappings.

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html, https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/nccl_ofi_gdrcopy.cpp — Tier 1 — accessed 2026-08-01

---

### 1.5 EFA Device Generations (v1 / v2 / v3 / v4)

**F-33. There are now FOUR EFA generations, mapped to Nitro versions.** The AWS user guide organizes supported instance types under exactly these four tabs:

| Nitro version | EFA version | Representative instance types | RDMA read | RDMA write |
|---|---|---|---|---|
| Nitro v6 | **EFA v4** | `p6-b200.48xlarge`, `p6-b300.48xlarge`, `m8i`, `c8i`, `r8i`, `m9g`, `c9g`, `g7`, `g7e`, `hpc8a.96xlarge`, `i8ge` | Yes | Yes |
| Nitro v5 | EFA v3 | `p5en.48xlarge`, `p6e-gb200.36xlarge`, `trn2.48xlarge`, `trn2u.48xlarge`, `m8g`, `c8g`, `r8g`, `x8g`, `i8g`, `i7ie`, `c7gn`, `hpc7g` | Yes | Yes (except `c7gn` and `hpc7g`: **No**) |
| Nitro v4 | EFA v2 | `p5.48xlarge`, `p5.4xlarge`, `p5e.48xlarge`, `trn1.32xlarge`, `trn1n.32xlarge`, `m6i`/`m7i`, `c6i`/`c7i`, `g6`, `g6e`, `f2.48xlarge`, `i7i`, `hpc6a`, `hpc7a`, `u7i*` | Yes | Yes |
| Nitro v3 | EFA v1 | `c5n`, `p3dn.24xlarge`, `p4d.24xlarge`, `p4de.24xlarge`, `g4dn`, `g5`, `i3en`, `m5n`/`m5dn`/`m5zn`, `r5n`/`r5dn`, `inf1`, `dl2q`, `vt1`, `x2iezn` | `p4d`/`p4de`: **Yes**; all others: No | No |

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

**F-34. The summary statement in the user guide overview:**
> "EFA supports RDMA (Remote Direct Memory Access) write on most supported instance types that have Nitro version 4 and later. RDMA read is supported on all instances with Nitro version 4 and later."

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

**F-35. Driver r3.3.0 adds reporting for 800 and 1600 Gbps link speeds** ("Support reporting 800 and 1600 Gbps link speed"), consistent with EFA v4 / `0xefa4` hardware.

Source: https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/RELEASENOTES.md — Tier 1 — accessed 2026-08-01

**F-36. Network card counts and per-instance EFA bandwidth (Tier 1, current):**

| Instance | Network cards | EFA bandwidth | Notes |
|---|---|---|---|
| `p4d.24xlarge` / `p4de.24xlarge` | 4 | — | |
| `p5.48xlarge` / `p5e.48xlarge` | 32 | — | |
| `p5en.48xlarge` | 16 | — | |
| `p6-b200.48xlarge` | 8 | 3,200 Gbps total | 8 GPUs; 400 Gbps EFA + 200 Gbps ENA per card; up to 1,600 Gbps ENA |
| `p6-b300.48xlarge` | 17 | up to 6,400 Gbps | 8 GPUs; card 0 is ENA-only at up to 350 Gbps; cards 1-16 up to 400 Gbps EFA / 220 Gbps ENA; up to 3,870 Gbps ENA |
| `p6e-gb200.36xlarge` | 17 | up to 1,600 Gbps recommended | NCIs 1,3,5,...,15 are EFA-only @ 400 Gbps; NCIs 2,4,...,16 up to 200 Gbps ENA or EFA; paired NCIs share a physical NIC (400 Gbps each) and paired NCIs [1,3],[5,7],[9,11],[13,15] share a GPU (400 Gbps per GPU) |
| `trn1.32xlarge` | 8 | — | |
| `trn1n.32xlarge` | 16 | — | |
| `trn2.48xlarge` / `trn2u.48xlarge` | 16 | — | |

Rule: "You can assign only one EFA or EFA-only network interface per network card. The primary network interface can't be an EFA-only network interface."

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html (Network cards section), https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html — Tier 1 — accessed 2026-08-01

**F-37. Current EFA limitations, verbatim:**
- "RDMA write is not supported with all instance types."
- "EFA traffic between P4d/P4de/DL1 instances and other instance types is currently not supported."
- "Instance types that support multiple network cards can be configured with one EFA per network card. All other supported instance types support only one EFA per instance."
- "`c7g.16xlarge`, `m7g.16xlarge`, and `r7g.16xlarge` Dedicated Instances and Dedicated Hosts are not supported when an EFA is attached."
- "EFA traffic can't cross Availability Zones or VPCs."
- "EFA traffic is not routable."
- "EFA is not supported on AWS Outposts."
- Windows: EFA device supported only for AWS CDI SDK applications; EFA-only interfaces are not supported by CDI on Windows or Linux.

Note: **no subnet-crossing restriction is listed.** The only network-boundary limits are AZ and VPC.

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

**F-38. Supported operating systems (current):** Amazon Linux 2023; RHEL 8, 9, and 10; Debian 11, 12, and 13; Rocky Linux 8 and 9; Ubuntu 22.04, 24.04, and 26.04; SUSE Linux Enterprise 15 SP2 and later. (Both x86_64 and arm64.)

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

---

### 1.6 aws-ofi-nccl Plugin and Tuner

**F-39. Current plugin release is v1.20.0 (published 2026-06-25).** Release notes state it "has been tested with NCCL v2.28.9-1, NCCL v2.29.7-1, and NCCL v2.30.4-1 while maintaining backward compatibility with older NCCL versions (NCCL v2.17.1 and later)" and "has been tested with Libfabric v2.4.0amzn5.0. The plugin requires at least Libfabric v1.11.0, and compiling AWS-specific support requires at least Libfabric v1.22.0."

Source: https://github.com/aws/aws-ofi-nccl/releases/tag/v1.20.0 — Tier 1 — accessed 2026-08-01

**F-40. The tuner manipulates `collCostTable` — CONFIRMED, mechanism unchanged.** In `src/tuner/nccl_ofi_regions.cpp`, `region_get_coll_info_internal_v3()`:
```c
	float(*table)[NCCL_NUM_PROTOCOLS] = (float(*)[NCCL_NUM_PROTOCOLS])collCostTable;
	...
		if (algorithm >= numAlgo || protocol >= numProto ||
		    table[algorithm][protocol] == NCCL_ALGO_PROTO_IGNORE) {
			continue;
		}
		in_out = is_inside_region(p, &region_ctx->regions[collType][i]);
		if (in_out >= 0) {
			table[algorithm][protocol] = 0.0;
```
The tuner sets the cost of its preferred (algorithm, protocol) cell to `0.0`, making it the cheapest option. It never sets `NCCL_ALGO`/`NCCL_PROTO` directly.

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_regions.cpp — Tier 1 — accessed 2026-08-01

**F-41. CRITICAL — setting `NCCL_ALGO`/`NCCL_PROTO` NO LONGER disables the tuner on modern NCCL.** The env-var bailout exists in exactly ONE place: `nccl_ofi_tuner_init_v2()`, the **tuner v2 interface** (NCCL 2.21.5):
```c
static ncclResult_t nccl_ofi_tuner_init_v2(...)
{
	if (getenv("NCCL_ALGO") || getenv("NCCL_PROTO")) {
		... "The tuner plugin can not be loaded when explicitly choosing an algorithm or protocol with NCCL_ALGO/NCCL_PROTO. Defaulting to internal tuner."
		*context = nullptr;
		return ncclSuccess;
	}
	return nccl_ofi_tuner_init(nRanks, nNodes, logFunction, context);
}
```
`ncclTunerPlugin_v3` (NCCL 2.22.3+) and `ncclTunerPlugin_v6` (NCCL 2.30.3+) both call `nccl_ofi_tuner_init` / `nccl_ofi_tuner_init_v6` directly with **no such check**. `TunerProcessConfig::should_use_ofi_tuner()` gates on three conditions only: AWS platform detected, `NCCL_OFI_TUNER_TYPE` not forced to Internal, and `OFI_NCCL_FORCE_NUM_RAILS` not set. `NCCL_ALGO`/`NCCL_PROTO` are not among them.

Corroborated by the v1.20.0 release notes bug-fix line: "Fixed tuner segfault when `NCCL_ALGO` or `NCCL_PROTO` is explicitly set" — a segfault only occurs if the tuner is running. v1.20.0 also "Removed tuner v1 plugin support".

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_tuner.cpp, `.../include/tuner/nccl_ofi_tuner_process_config.h`, https://github.com/aws/aws-ofi-nccl/releases/tag/v1.20.0 — Tier 1 — accessed 2026-08-01

**F-42. There are now TWO tuner backends — Region and Model — selected at runtime.** From `nccl_ofi_tuner.cpp`: "Choose 'Region' over 'Model' when both are supported. TUNER_TYPE env variable is ignored if the forced tuner type is not supported by the given platform, nRanks and nNodes." The region tuner skips entirely at small scale: "Skip when two nodes or lesser because the regions are not well defined and fallback to NCCL's internal tunings" (`region_ctx->dims.num_nodes <= 2`).

Recognized tuner platforms (from `TunerProcessConfig`): `p5.48xlarge` and `p5e.48xlarge` → `NCCL_OFI_TUNER_P5_P5E`; `p5en.48xlarge` → `NCCL_OFI_TUNER_P5EN`; `p6-b200.48xlarge` → `NCCL_OFI_TUNER_P6`; `p6-b300.48xlarge` → `NCCL_OFI_TUNER_P6_B300`; everything else → `NCCL_OFI_TUNER_UNKNOWN`. **P4d/P4de are not tuner platforms.**

The P6-B200 path also overrides channel count: for TreeLL128 AllReduce at 4-32 MB with 8 ranks per node, it calls `calculateBestNChannelTree()`.

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_tuner.cpp, `.../src/tuner/nccl_ofi_regions.cpp`, `.../include/tuner/nccl_ofi_tuner_process_config.h` — Tier 1 — accessed 2026-08-01

**F-43. `NCCL_TUNER_PLUGIN` no longer needs to be set on NCCL 2.21+.** Verbatim comment in `src/Makefile.am`:
> "Different versions of NCCL have different tuner loading behaviors:
>  2.19 - 2.20    Tuner only loaded if NCCL_TUNER_PLUGIN is set to a filename
>  2.21 -         First look for NCCL_TUNER_PLUGIN, then look for tuner interface in the net plugin
> By bundling the tuner in the net plugin, we cause the tuner to be used by default on NCCL 2.21 or later."

Two library names are built for compatibility: `libnccl-ofi-tuner.so` (legacy AWS name) and `libnccl-tuner-ofi.so` (NCCL's standardized `libnccl-tuner-<interface>` format).

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/Makefile.am — Tier 1 — accessed 2026-08-01

**F-44. Default net-plugin library name changed to `libnccl-net-ofi.so`** (installer 1.42.0 / plugin 1.15.0): "Changed default plugin library name to libnccl-net-ofi.so, and by default create symlink from libnccl-net-ofi.so to libnccl-net.so to maintain backward compatibility. This allows users to set NCCL_NET_PLUGIN=ofi to force NCCL to use the OFI plugin."

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html — Tier 1 — accessed 2026-08-01

**F-45. `sort_rails()` still exists — but it moved and became a virtual platform method.** Now at `src/platform-aws.cpp:975` (`void PlatformAWS::sort_rails(struct fi_info **info_list, size_t num_rails, size_t num_groups)`), declared virtual on `Platform` in `include/nccl_ofi_platform.h:97`, and invoked from `src/nccl_ofi_topo.cpp:1004`.

Source: `git clone --branch v1.20.0 https://github.com/aws/aws-ofi-nccl`, grep — Tier 1 — accessed 2026-08-01

**F-46. Shipped NCCL topology XML files @ v1.20.0: `p4d-24xl-topo.xml`, `p4de-24xl-topo.xml`, and `g5.48xl-topo.xml`.** (Three files, not two.) There is still no P5/P5en/P6 topology XML.

Source: https://github.com/aws/aws-ofi-nccl/tree/v1.20.0/topology — Tier 1 — accessed 2026-08-01

**F-47. The plugin explicitly discourages `NCCL_BUFFSIZE` and `NCCL_MIN_CHANNELS` tuning.** Verbatim from `doc/efa-env-var.md`:
> "`NCCL_BUFFSIZE=xxx` — Recommend to leave it out to use the default."
> "`NCCL_MIN_CHANNELS=xxx` — Recommend to leave it out to use the default. For e.g., on p4d/p4de, the number of channels should be 8, which is the minimum for a 4-NIC platform. The reduction message is split by number of GPUs in the job, then the number of channels, so having more channels than necessary causes smaller messages which causes EFA to be starved for data."
> "`NCCL_SOCKET_NTHREADS` — Not applicable for EFA."
> "`NCCL_NSOCKS_PERTHREAD` — Not applicable for EFA."

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/doc/efa-env-var.md — Tier 1 — accessed 2026-08-01

**F-48. `cuPointerGetAttribute` is now `cuPointerGetAttributes` (plural), resolved dynamically.** `src/nccl_ofi_cuda.cpp:84` declares it with a minimum CUDA version of 7000; line 290 calls `pfn_cuPointerGetAttributes(2, attributes, data, (CUdeviceptr)ptr)`.

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/nccl_ofi_cuda.cpp — Tier 1 — accessed 2026-08-01

**F-49. The plugin code base was migrated from C to C++** (installer 1.42.0 / plugin 1.15.0: "Migrated plugin code base from C to C++"). All `.c` files under `src/` are now `.cpp` — including `nccl_ofi_rdma.cpp`.

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html, https://github.com/aws/aws-ofi-nccl/tree/v1.20.0/src — Tier 1 — accessed 2026-08-01

**F-50. NCCL does NOT consume the EC2 instance topology API — CONFIRMED, still true.** The plugin's own `doc/topology-aware.md` places `DescribeInstanceTopology` consumption squarely at the scheduler layer: the AWS `ec2-topology-aware-for-slurm` tool "queries the Amazon EC2 Instance Topology API to generate a topology configuration file, named **topology.conf**", and EKS "automatically discovers and exposes their network topology information as node labels" for pod placement.

Source: https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/doc/topology-aware.md — Tier 1 — accessed 2026-08-01

**F-51. New plugin features in v1.18.0 - v1.20.0:**
- v1.20.0: NCCL multi-receive support ("improves alltoall performance... enabled automatically and requires no user configuration changes"); NCCL v2.30 net v12 plugin interface; `--enable-ngc-v1-compat` build option; `NCCL_OFI_EAGER_MAX_SIZE` no longer needs `-1` for multi-recv ("Eager sends are now auto-detected based on libfabric provider capability (`mixed_hmem_iov`). Default remains `8192`")
- v1.19.0 (via installer 1.48.0): "Fixed NCCL topology generation for GB200 in Docker containers"; "Reduced QP utilization on NIC 0 during initialization"; "Improved tuner algorithm choices for P6-B200 and P6-B300 instance types"
- v1.18.0 (via installer 1.47.0): "P6-B300 support: added custom tuner decisions for P6-B300"; "default to RDMA protocol on Trn1 and default to SENDRECV protocol on g7e.8xlarge"; "Dynamic platform selection: added feature to enable AWS optimizations at runtime based on presence of AWS NICs. This allows a single plugin binary to be used for both AWS and non-AWS platforms."; "Redesigned threading model to support multi-threaded applications without requiring a separate Libfabric domain for each thread."
- v1.17.2 (via installer 1.45.0): "Added support for g7e instance family"; "Fixed an issue where NCCL could erroneously attempt to use a GPUDirect RDMA path on platforms that support DMA-BUF"

Source: https://github.com/aws/aws-ofi-nccl/releases/tag/v1.20.0, https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html — Tier 1 — accessed 2026-08-01

---

### 1.7 Current Version Numbers (as of 2026-08-01)

**F-52. EFA installer release history and component versions:**

| EFA installer | Release date | Bundled components |
|---|---|---|
| **1.49.0 (latest)** | June 27, 2026 | libfabric **2.4.0amzn5.0**, EFA driver **3.1.0**, rdma-core **63.0**, AWS OFI NCCL Plugin **1.20.0**. Discontinues openSUSE Leap support. |
| 1.48.0 | April 14, 2026 | libfabric 2.4.0amzn3.0, libnccl-ofi 1.19.0. Adds RHEL 10 support, Debian 12 + RHEL 10 OFI NCCL plugin, per-package RPM/DEB signature verification. |
| 1.47.0 | January 29, 2026 | libfabric 2.4.0amzn1.0, libnccl-ofi 1.18.0, rdma-core 61.0, efa driver 3.0.0, Open MPI 5.0.9amzn1 |
| 1.46.0 | December 12, 2025 | libfabric 2.3.1amzn4.0 ("Enable data path direct for efa-rdm protocol path", ROCr HMEM, `FI_OPT_EFA_USE_UNSOLICITED_WRITE_RECV`), efa-nv-peermem 1.2.3, Debian 13 support |
| 1.45.1 | November 26, 2025 | libfabric 2.3.1amzn3.0 |
| 1.45.0 | November 17, 2025 | rdma-core 60.amzn0, libfabric 2.3.1amzn2.0, libnccl-ofi 1.17.2 |
| 1.44.0 | October 29, 2025 | rdma-core 59.amzn0, libfabric 2.3.1amzn1.0, Open MPI 5.0.8amzn1, libnccl-ofi 1.17.1 |
| 1.43.3 | October 1, 2025 | efa driver 2.17.3 |
| 1.43.0 | July 25, 2025 | libnccl-ofi 1.16.1, efa driver 2.17.2, rdma-core 58.amzn0. "Enable optimizations for Graviton platforms". Deprecates Ubuntu 20.04. |
| 1.42.0 | June 6, 2025 | libnccl-ofi 1.15.0 (P6-B200 platform support, C→C++ migration), libfabric 2.1.0amzn3.0 |

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html — Tier 1 — accessed 2026-08-01

**F-53. Upstream component versions (independent of the AWS installer):**

| Component | Latest release | Date |
|---|---|---|
| `ofiwg/libfabric` | **v2.6.0** | 2026-06-22 |
| `aws/aws-ofi-nccl` | **v1.20.0** | 2026-06-25 |
| `amzn/amzn-drivers` efa | **r3.3.0** (master HEAD, commit `b99452b707`) | 2026-07-28 |
| AWS EFA installer | **1.49.0** | 2026-06-27 |

Note the skew: installer 1.49.0 ships EFA driver **3.1.0** and libfabric **2.4.0amzn5.0**, while upstream HEAD is driver **3.3.0** and libfabric **2.6.0**. AWS ships an `amzn`-suffixed fork of libfabric (`github.com/aws/libfabric`, e.g. tag `v2.4.0amzn5.0`), not upstream `ofiwg` tags.

libfabric release cadence: v2.0.0 (2024-12-13), v2.1.0 (2025-03-15), v2.2.0 (2025-06-30), v2.3.0 (2025-09-15), v2.3.1 (2025-10-20), v2.4.0 (2025-12-15), v2.5.0 (2026-03-20), v2.5.1 (2026-04-13), v2.6.0 (2026-06-22).

Source: GitHub Releases API for `ofiwg/libfabric`, `aws/aws-ofi-nccl`; https://github.com/amzn/amzn-drivers commits API; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html — Tier 1 — accessed 2026-08-01

**F-54. Supported interfaces and libraries (current minimums):** Open MPI 4.1 and later; Intel MPI 2019 Update 5 and later; NCCL 2.4.2 and later; **NIXL 1.0.0 and later**; AWS Neuron SDK 2.3 and later. "NCCL and MPI integrate with Libfabric 1.7.0 and later. NIXL integrates with Libfabric 1.21.0 and later."

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

---

### 1.8 New EFA Features Announced 2025-2026

**F-55. NIXL (NVIDIA Inference Xfer Library) support for disaggregated inference.** EFA now has a dedicated getting-started guide. "NIXL is a high-throughput, low-latency communication library designed specifically for disaggregated inference workloads. NIXL can be used together with EFA and Libfabric to support KV-cache transfer between prefill and decode nodes, and it enables efficient KV-cache movement between various storage layers." Requirements: Ubuntu 24.04 or 22.04 base AMIs only; NIXL 1.0.0+. The guide includes a "Step 14: Test disaggregated inference serving over vLLM (Optional)".

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html — Tier 1 — accessed 2026-08-01

**F-56. EFA v4 / Nitro v6 generation** — see F-33, F-11, F-35. New instance families with EFA v4 include `p6-b200`, `p6-b300`, `g7`, `g7e`, `m8i`/`c8i`/`r8i`/`x8i` and variants, `m9g`/`c9g` (Graviton), `hpc8a.96xlarge`, `i8ge`, `m8gb`/`c8gb`/`r8gb`, `m8gn`/`c8gn`/`r8gn`.

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — Tier 1 — accessed 2026-08-01

**F-57. Summary of the 2025-2026 feature wave** (all Tier 1, sourced above):
1. `efa-direct` fabric (libfabric) — F-18, F-19
2. Data Path Direct — WQE post + CQ poll without rdma-core — F-20
3. Util CQ Bypass — F-21
4. GPUDirect Async (GDA) domain ops on `efa-direct` — F-29
5. Hardware completion counters backed by MSI-X, with external-memory (VA or DMA-BUF) backing — F-28, driver r3.3.0 "Add Completion Counters support"
6. Unsolicited write receive (no Rx buffer consumed for RDMA-write-with-immediate) — F-28
7. `FI_EFA_WR_HIGH_PPS` message-rate hint flag — F-28
8. NIXL support for disaggregated inference — F-55
9. Blocking CQ read (`fi_cq_sread`) with wait objects on RDM endpoints — installer 1.47.0
10. QP service-level / traffic-class support (`FI_TC_LOW_LATENCY`) — driver r2.13.0, fi_efa man page
11. NCCL multi-receive (alltoall improvement) — F-51
12. Region + Model dual tuner backends with per-platform P5/P5en/P6-B200/P6-B300 regions — F-42
13. Dynamic platform selection (single plugin binary for AWS and non-AWS) — F-51
14. 64-bit work request IDs, 128-byte SQ WQEs, inline RDMA WRITE, >4 GB MR page size — driver r3.3.0, F-10
15. EFA-only interface type (announced Oct 24, 2024, still the current mechanism) — Source: https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/ — Tier 1 — accessed 2026-08-01

**F-58. EFA-only interface rationale, verbatim from the AWS announcement:**
> "EFA-only interfaces solve these challenges as the EFA device is not assigned an IP address because it uses the Scalable Reliable Datagram (SRD) protocol, which operates over MAC addresses. EFA-only interfaces can only be configured as a secondary interface, with the primary interface being either EFA coupled with ENA or just ENA, since ENA is required for TCP/IP VPC routing."

Source: https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/ — Tier 1 — accessed 2026-08-01

**F-59. EKS EFA-only requirements confirmed unchanged:** "You must have VPC CNI version `1.18.5` or later for EFA-only interfaces. If you are using Amazon Linux 2, ami version has to be `v20240928` or later for EFA-only interfaces." Also: "You can't use `eksctl` to create nodes and node groups that use EFA-only interfaces."

Source: https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — Tier 1 — accessed 2026-08-01

---

## PART 2 — STALE-OR-WRONG EXISTING CLAIMS

Total assessed: **34 claims**. Verdict distribution: **7 WRONG**, **12 STALE**, **15 CORRECT** (correct ones listed in Part 2.3 for completeness).

### 2.1 WRONG — factually incorrect at current HEAD

---

**W-1. `Architecture.tsx:155-162` — "Send-only in hardware; RDMA Read and Write are emulated in software"**

Current text:
> "**Send-only in hardware:** SRD hardware only implements Send operations. RDMA Read and Write are **emulated in software** by the libfabric EFA provider — the provider issues a Send to the remote side, which performs the memory operation and sends a response. This is a deliberate simplification: keep hardware simple, handle complexity in software. (Source: `rxr_pkt_post_ctrl` in ofiwg/libfabric EFA provider)"

**What's wrong (three separate errors):**
1. The EFA device has native RDMA Read and RDMA Write opcodes: `EFA_IO_RDMA_READ = 1`, `EFA_IO_RDMA_WRITE = 2` in `efa_io_defs.h` (F-14). The kernel driver added RDMA write in r2.4.0 and inline WRITE in r3.3.0 (F-12).
2. libfabric's own design doc says "The EFA NIC supports both two-sided and one-sided RDMA using a proprietary protocol called Scalable Reliable Datagram (SRD)" and "when device RDMA is available, the data goes directly to/from user buffers without internal staging or copying" (F-9, F-22).
3. The cited symbol `rxr_pkt_post_ctrl` **does not exist** anywhere in libfabric at v2.6.0. The entire `rxr_*` namespace was renamed to `efa_rdm_*` (F-24).

**Correct value:** RDMA Read and RDMA Write are native SRD hardware operations on Nitro v4+ (EFA v2+) devices. What IS still software-emulated in the `efa` fabric is `FI_TAGGED`, `FI_ATOMIC`, `FI_DIRECTED_RECV`, and `FI_HMEM` when NIC-GPU P2P is unavailable. RDMA is only emulated when `FI_EFA_USE_DEVICE_RDMA=0` is explicitly set, or on EFA v1 hardware that lacks the capability.

**Correct source citation:** `prov/efa/docs/efa_fabric_comparison.md` and `prov/efa/src/rdm/efa_rdm_rma.c` in `ofiwg/libfabric`; `kernel/linux/efa/src/efa_io_defs.h` in `amzn/amzn-drivers`.

---

**W-2. `Architecture.tsx:231-239` — "The kernel driver intentionally does NOT implement post_send, post_recv, or poll_cq"**

Current text:
> "**Proof of true OS bypass:** The kernel driver `efa_verbs.c` intentionally does NOT implement `post_send`, `post_recv`, or `poll_cq` — these are the hot-path data operations. They exist only in the user-space library (`libefa`). ... (Source: `efa_verbs.c` in amzn/amzn-drivers — search for the verb table and note the NULL entries.)"

**What's wrong:** At `amzn/amzn-drivers` master HEAD (2026-07-28, driver r3.3.0), all three ARE implemented, in a dedicated 798-line file `kernel/linux/efa/src/efa_data_verbs.c`, and registered in `efa_dev_ops` in `efa_main.c` lines 549-558 under `#ifdef HAVE_EFA_KVERBS`. The feature landed in driver r2.12.0 ("Introduce EFA kernel verbs support"). There are no "NULL entries" in the verb table to point at; the ops are simply compiled out when `HAVE_EFA_KVERBS` is undefined.

Secondary error: the file cited (`efa_verbs.c`) never contained the ops table anyway — `efa_dev_ops` is defined in `efa_main.c`.

**Correct value:** The kernel driver now implements `post_send`/`post_recv`/`poll_cq`/`req_notify_cq` **for in-kernel RDMA consumers only** (the kernel-verbs path, `HAVE_EFA_KVERBS`). Userspace OS-bypass is unaffected: a libfabric application still never enters the kernel on the data path — it writes WQEs to the mmap'd `mem_bar` (LLQ), rings the `db_bar` doorbell, and polls the DMA-coherent CQ buffer by phase bit. The honest framing is now: "the userspace data path never calls into the kernel; the kernel's own post_send/poll_cq exist for in-kernel ULPs, not for your application."

---

**W-3. `Architecture.tsx:50-52` — "RDMA read (Nitro v4+) and RDMA write (Nitro v6)"**

Current text:
> "Note: EFA does support RDMA read operations (Nitro v4+) and RDMA write (Nitro v6) over SRD"

**What's wrong:** RDMA write is available on **Nitro v4 (EFA v2)**, not Nitro v6. The AWS user guide's instance tables show RDMA write = Yes for essentially all Nitro v4 instances (`m6a`, `c6a`, `p5.48xlarge`, `p5e.48xlarge`, `trn1`, `trn1n`, `hpc7a`, etc.).

**Correct value, verbatim from AWS:** "EFA supports RDMA (Remote Direct Memory Access) write on most supported instance types that have Nitro version 4 and later. RDMA read is supported on all instances with Nitro version 4 and later."

Two exceptions worth calling out: `p4d.24xlarge` / `p4de.24xlarge` are Nitro v3 (EFA v1) yet support RDMA read (write: No). `c7gn` and `hpc7g` are Nitro v5 (EFA v3) yet support RDMA read only (write: No).

---

**W-4. `AIMLTraining.tsx:74-76` — "EFA does not support GPUDirect Async"**

Current text:
> "EFA also does not support GPUDirect Async, which some MoE optimizations rely on."

**What's wrong:** libfabric v2.6.0 exposes a GPUDirect Async domain-ops extension. Verbatim: "To enable GPU Direct Async (GDA), which allows the GPU to interact directly with the NIC, request `FI_EFA_GDA_OPS` in the `name` parameter with efa-direct fabirc." The feature matrix in the provider's comparison doc lists "GPU Direct Async (GDA) domain ops extension" as supported on `efa-direct`.

**Correct value:** GDA is supported on EFA, but only through the `efa-direct` fabric of the libfabric EFA provider, via the `fi_efa_ops_gda` function table (`query_addr`, `query_qp_wqs`, `query_cq`, `cq_open_ext`, `get_mr_lkey`, `cntr_open_ext`). It is NOT available on the `efa` (wire-protocol) fabric, and `aws-ofi-nccl` v1.20.0 does not use it (zero grep hits for `FI_EFA_GDA` / `efa-direct` in the plugin). So the practical statement for a NCCL user is: "GDA is exposed by libfabric on `efa-direct` but is not wired into the NCCL plugin today."

---

**W-5. `AIMLTraining.tsx:166-171` — "RMA emulation on top of EFA's unreliable datagram hardware"**

Current text:
> "**RDM (Reliable Datagram Message) vs DGRAM (Datagram) endpoints:** NCCL uses RDM endpoints, not raw DGRAM. RDM adds software-layer reliability, message tagging, and RMA (Remote Memory Access) emulation on top of EFA's unreliable datagram hardware. ... (Source: `efa_rdm_ep.c` in ofiwg/libfabric)"

**What's wrong (three errors):**
1. **EFA hardware is reliable.** `SRD.txt`: "As RD, SRD QPs provide reliable delivery. Unlike RD (and similar to UD) SRD QPs provide out-of-order delivery without segmentation support." The libfabric man page: "EFA provides reliable and unreliable datagram send/receive with direct hardware access from userspace (OS bypass)" — DGRAM endpoints are the unreliable ones; RDM endpoints run over SRD, which is reliable in hardware. The `efa` fabric does not add reliability; it adds ordering (`FI_ORDER_SAS`), segmentation for unlimited message size, tagging, atomics, and directed receive.
2. RMA is not emulated when device RDMA is available (see W-1).
3. `efa_rdm_ep.c` **does not exist** at v2.6.0; the code is in `efa_rdm_ep.h`, `efa_rdm_ep_fiops.c`, and `efa_rdm_ep_utils.c`.

**Correct value:** RDM endpoints run over SRD's hardware-reliable transport. The `efa` fabric layers on ordering guarantees, unlimited message size (via segmentation in software), `FI_TAGGED`, `FI_ATOMIC`, `FI_DIRECTED_RECV`, and `FI_MULTI_RECV` — all listed as software emulations in `efa_fabric_comparison.md`. It does not add reliability.

---

**W-6. `AIMLTraining.tsx:228-234` — "Setting NCCL_ALGO or NCCL_PROTO env vars disables the tuner entirely"**

Current text:
> "Setting `NCCL_ALGO` or `NCCL_PROTO` env vars **disables the tuner entirely**. (Source: NVIDIA/nccl `search.cc`, aws-ofi-nccl `tuner/nccl_ofi_tuner.cpp`)"

**What's wrong:** At `aws-ofi-nccl` v1.20.0, the `NCCL_ALGO`/`NCCL_PROTO` bailout exists in exactly one function: `nccl_ofi_tuner_init_v2()`, serving the **tuner v2 interface** (NCCL 2.21.5). `ncclTunerPlugin_v3` (NCCL 2.22.3+) and `ncclTunerPlugin_v6` (NCCL 2.30.3+) call `nccl_ofi_tuner_init` / `nccl_ofi_tuner_init_v6` with no such check, and `TunerProcessConfig::should_use_ofi_tuner()` does not consult those env vars.

Confirming evidence: the v1.20.0 release notes list "Fixed tuner segfault when `NCCL_ALGO` or `NCCL_PROTO` is explicitly set" as a bug fix — a segfault is only reachable if the tuner is running.

**Correct value:** Setting `NCCL_ALGO`/`NCCL_PROTO` disables the aws-ofi-nccl tuner only on the **v2 tuner interface** (NCCL 2.21.x). On NCCL 2.22.3+ (tuner v3) and NCCL 2.30.3+ (tuner v6), the tuner still loads and still zeroes `collCostTable` cells; NCCL then applies the user's env-var filter on top of the tuner's cost table. Prior to v1.20.0 this combination could segfault. The actual disable switches are `NCCL_OFI_TUNER_TYPE=Internal` and `OFI_NCCL_FORCE_NUM_RAILS`.

---

**W-7. `AIMLTraining.tsx:243-245` — "GDRCopy required; without it, GPU-to-NIC transfers fall back to staged copies through host memory"**

Current text:
> "**GDRCopy required:** GPUDirect RDMA (GDRCopy v2.4+) must be installed before running NCCL with EFA on any P-series instance. Without it, GPU-to-NIC transfers fall back to staged copies through host memory."

**What's wrong:** The parenthetical equates GDRCopy with GPUDirect RDMA. They are different mechanisms. GPUDirect RDMA (the NIC DMA-ing to/from GPU memory) is provided by the EFA kernel driver's P2P support and has been enabled by default since driver ~1.14: the EFA installer changelog for 1.14.0 (October 2021) states "Make `-g, --enable-gdr` in `efa_installer.sh` as a no-op option as the latest efa kernel driver enables GDR support by default." Consequently, GPU-to-NIC transfers do NOT fall back to host staging merely because GDRCopy is absent. Host staging happens when NIC-GPU **peer-to-peer** is unavailable (that is what `efa_rdm_ep_use_p2p` gates, and what `FI_HMEM` bounce-buffering handles).

The "v2.4+" version floor is also not stated in any Tier 1 source I could find (see UNKNOWN register U-4).

**Correct value:** GDRCopy is a documented install step in the AWS NCCL and NIXL getting-started guides (Step 4 in both), and aws-ofi-nccl carries optional dlopen-based GDRCopy integration in `src/nccl_ofi_gdrcopy.cpp`. But GPUDirect RDMA itself is enabled by the EFA kernel driver P2P path, not by GDRCopy. Recommend rewriting as: "GDRCopy is a documented step in the AWS install guide and gives the CPU a low-latency mapping into GPU memory. It is distinct from GPUDirect RDMA, which the EFA kernel driver enables by default. Host-memory staging occurs when NIC-GPU peer-to-peer is unavailable, not when GDRCopy is missing."

---

### 2.2 STALE — was true, no longer current, or source reference has rotted

---

**S-1. `AIMLTraining.tsx:143-144` — env-var block: `FI_PROVIDER=efa` and `FI_EFA_USE_DEVICE_RDMA=1`**

Current text:
```
FI_PROVIDER=efa                    # Tell libfabric to use EFA
FI_EFA_USE_DEVICE_RDMA=1           # GPUDirect RDMA (required on P4d, default on P5+)
```

**Stale because:** The plugin's own cheatsheet says `FI_EFA_USE_DEVICE_RDMA=1` — "Do not set for libfabric>=1.18.0 and aws-ofi-nccl>=1.7.0." And `FI_PROVIDER=efa` is listed as needed only for "aws-ofi-nccl<=1.5.0". Current shipping stack is libfabric 2.4.0amzn5.0 / aws-ofi-nccl 1.20.0.

Additional error: the comment mislabels `FI_EFA_USE_DEVICE_RDMA` as "GPUDirect RDMA". It controls whether libfabric offloads `fi_rma` to device RDMA versus emulating it — orthogonal to GPU memory access.

**Correct value:** On any current stack neither variable should be set. If the deep dive wants to show them, they belong in a "legacy stacks only" block with the version gates spelled out.

---

**S-2. `AIMLTraining.tsx:147` — `NCCL_TUNER_PLUGIN=/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu/libnccl-ofi-tuner.so`**

**Stale because:** `src/Makefile.am` documents: "2.21 - First look for NCCL_TUNER_PLUGIN, then look for tuner interface in the net plugin. By bundling the tuner in the net plugin, we cause the tuner to be used by default on NCCL 2.21 or later." Explicit `NCCL_TUNER_PLUGIN` was only required on NCCL 2.19-2.20.

**Correct value:** On NCCL 2.21+, the tuner is found inside the net plugin automatically and `NCCL_TUNER_PLUGIN` need not be set. Two library names now ship: `libnccl-ofi-tuner.so` (legacy) and `libnccl-tuner-ofi.so` (NCCL's standardized naming). The net plugin default name is now `libnccl-net-ofi.so`, with a compat symlink to `libnccl-net.so`, and `NCCL_NET_PLUGIN=ofi` forces its use.

---

**S-3. `AIMLTraining.tsx:154-155` — `NCCL_BUFFSIZE=8388608` and `NCCL_MIN_NCHANNELS=4` presented as "Performance tuning"**

**Stale/contradicted because:** aws-ofi-nccl `doc/efa-env-var.md` says of `NCCL_BUFFSIZE`: "Recommend to leave it out to use the default," and of `NCCL_MIN_CHANNELS`: "Recommend to leave it out to use the default... having more channels than necessary causes smaller messages which causes EFA to be starved for data."

Also, the variable name in the file is `NCCL_MIN_NCHANNELS`; the plugin doc discusses `NCCL_MIN_CHANNELS`. Both exist in NCCL but the doc's guidance is the same either way.

**Correct value:** Recommend the defaults. If the section wants a tuning knob list, the plugin's own list of "not applicable for EFA" variables (`NCCL_SOCKET_NTHREADS`, `NCCL_NSOCKS_PERTHREAD`) is more useful and is Tier 1.

---

**S-4. `AIMLTraining.tsx:216-223` — "aws-ofi-nccl ships XML files for P4d and P4de only"**

Current text:
> "`aws-ofi-nccl` ships XML files for P4d and P4de only. P5/P5en have NO topology XML — the plugin uses `sort_rails()` to software-reorder NIC assignments instead. (Source: `aws/aws-ofi-nccl topology/` directory)"

**Stale because:** `topology/` at v1.20.0 contains **three** XML files: `p4d-24xl-topo.xml`, `p4de-24xl-topo.xml`, and `g5.48xl-topo.xml`.

**Still correct:** P5/P5en/P6 have no topology XML, and `sort_rails()` is the mechanism. But its location moved: it is now `PlatformAWS::sort_rails()` at `src/platform-aws.cpp:975`, a virtual override of `Platform::sort_rails()` (`include/nccl_ofi_platform.h:97`), invoked from `src/nccl_ofi_topo.cpp:1004`.

---

**S-5. `AIMLTraining.tsx:174-179` — GPU protocol restriction: correct claim, wrong source and unsupported rationale**

Current text:
> "When the source or destination is GPU memory (detected via `cuda_is_addr_cuda_accessible`), libfabric restricts to only eager and runt-read protocols — the medium-message rendezvous protocol is skipped entirely. This is because GPU memory cannot be used as an inline source for the medium protocol's copy semantics. (Source: `efa_rdm_ep_use_p2p` in ofiwg/libfabric)"

**Stale/wrong in three parts:**
1. `cuda_is_addr_cuda_accessible` **does not exist** anywhere in libfabric v2.6.0 (repo-wide grep: zero matches).
2. The real mechanism is `efa_hmem_info_init_protocol_thresholds()` in `prov/efa/src/efa_hmem.c`, which sets `info->max_medium_msg_size = 0` for `FI_HMEM_CUDA` / `FI_HMEM_ROCR` / `FI_HMEM_NEURON`. The provider's own warning string is: "only eager and runting read protocols are supported for %s over EFA."
3. The stated rationale ("GPU memory cannot be used as an inline source for the medium protocol's copy semantics") appears nowhere in the source. It should be dropped or marked speculative.

**Still correct:** The behavioral claim (GPU memory uses eager + runting-read only; medium is skipped) is confirmed. `efa_rdm_ep_use_p2p` does still exist and is a real gate — just not the one that disables medium.

---

**S-6. `AIMLTraining.tsx:192-198` — "(Source: `nccl_ofi_rdma.c` in aws/aws-ofi-nccl)"**

**Stale because:** The plugin was migrated from C to C++ in v1.15.0 (installer 1.42.0, June 2025). The file is now `src/nccl_ofi_rdma.cpp`, and rail-related code additionally lives under `src/rdma/`.

---

**S-7. `AIMLTraining.tsx:201-206` — "The plugin calls `cuPointerGetAttribute`"**

**Stale because:** The symbol is now `cuPointerGetAttributes` (plural), dynamically resolved: declared at `src/nccl_ofi_cuda.cpp:84` (`DECLARE_CUDA_FUNCTION(cuPointerGetAttributes, 7000)`), resolved at line 157, called at line 290.

Also worth adding: v1.17.2 fixed "an issue where NCCL could erroneously attempt to use a GPUDirect RDMA path on platforms that support DMA-BUF" — DMA-BUF is now a first-class alternative registration path (driver `reg_user_mr_dmabuf`, `src/nccl_ofi_dmabuf.cpp`).

---

**S-8. `Architecture.tsx:163-168` — "No message segmentation in hardware"**

Current text:
> "**No message segmentation in hardware:** Large messages are not segmented by the NIC. Libfabric handles segmentation and reassembly entirely in software..."

**Stale/incomplete because:** True for MSG operations (device MTU ~8 KiB) and for the `efa` fabric generally. But for RMA the device natively handles up to `max_rdma_size` (~1 GB per the fabric comparison doc), so a 512 MB `fi_write` on `efa-direct` is a single hardware operation with no libfabric segmentation. And `efa-direct` performs no segmentation at all — it exposes device limits directly and rejects anything larger.

**Correct value:** Segmentation in software applies to the `efa` fabric. `SRD.txt` confirms the hardware property ("out-of-order delivery without segmentation support") for messages, but RMA operations are bounded by the device's max RDMA size (~1 GB), not by the ~8 KiB MTU.

---

**S-9. `Architecture.tsx:170-174` — QP scalability arithmetic**

Current text:
> "A cluster of N nodes with p processes each needs only N×p QPs total — compared to N×p² for RC (connected) QPs."

**Imprecise because:** `SRD.txt` gives these as **per-endnode** figures: RC requires "N*p*p" QPs *per endnode*; RD/SRD reduces it "to p" *per endnode*. The tsx text mixes a cluster total (N×p) against a per-node figure (N×p²), which understates the RC blowup by a factor of N.

**Correct value:** Per endnode: RC = N·p², SRD = p. Cluster-wide: RC = N²·p², SRD = N·p.

---

**S-10. `Architecture.tsx:183-186` — "All EBS io2 volumes use SRD"**

Current text:
> "All EBS io2 volumes use SRD for storage traffic."

**Overstated because:** AWS documentation attributes SRD specifically to **io2 Block Express**: "`io2` Block Express volumes are built on the next generation of Amazon EBS storage server architecture... Block Express servers communicate with Nitro-based instances using the Scalable Reliable Datagram (SRD) networking protocol."

**Correct value:** io2 **Block Express** uses SRD. (In practice all io2 volumes are now Block Express, but the documentation attributes the protocol to the Block Express architecture, not to the io2 volume type generically — cite it that way.)

Second half of the same paragraph — ENA Express / `EnaSrdSpecification` — is correct, but the deep dive should add that ENA Express now supports **cross-AZ within the same Region**, with three excluded Regions (São Paulo, Bahrain, UAE) and no Local Zone support.

---

**S-11. `Architecture.tsx:303-305` — "EFA installer puts Open MPI 4.1 + 5.0 at `/opt/amazon/openmpi`"**

**Stale because:** Installer 1.47.0 upgraded to **Open MPI 5.0.9amzn1** (1.44.0 shipped 5.0.8amzn1). Installer 1.30.0 documents Open MPI 5.0.x installed at `/opt/amazon/openmpi5` by default, alongside OpenPMIx at `/opt/amazon/pmix` and PRRTE at `/opt/amazon/prrte`. So there are two distinct paths, not one, and the version is 5.0.9 not "5.0".

**Correct value:** Open MPI 4.1.x at `/opt/amazon/openmpi`, Open MPI 5.0.9amzn1 at `/opt/amazon/openmpi5`, plus OpenPMIx at `/opt/amazon/pmix` and PRRTE at `/opt/amazon/prrte`.

---

**S-12. `AIMLTraining.tsx:132-137` — "Set `NCCL_TOPO_FILE` to the correct topology file for your instance type"**

**Stale because:** Only three instance types ship a topology XML at all (`p4d`, `p4de`, `g5.48xl` — F-46). For P5/P5en/P6 there is no file to point `NCCL_TOPO_FILE` at; the plugin generates topology and reorders rails at runtime via `nccl_ofi_topo.cpp` + `PlatformAWS::sort_rails()`. Installer 1.48.0 also notes a fix for "NCCL topology generation for GB200 in Docker containers where NUMA nodes disconnected from Package nodes caused incorrect topology generation" — i.e. generation, not a static file.

**Correct value:** On P5 and newer, do not set `NCCL_TOPO_FILE`; the plugin discovers and sorts rails itself. The static XML files are a P4d/P4de/g5 legacy path.

---

### 2.3 STILL CORRECT — verified against current sources

| Location | Claim | Verification |
|---|---|---|
| `Architecture.tsx:34-35` | 64-path packet spraying | AWS HPC Blog: "we choose 64 paths at a time from the hundreds or even thousands available" (F-7) |
| `Architecture.tsx:120-123` | SRD origin is the IEEE Micro 2020 paper by Shalev et al., not NSDI | Confirmed — libfabric's own comparison doc links `ieeexplore.ieee.org/document/9167399` for SRD (F-9) |
| `Architecture.tsx:136-140` | Out-of-order delivery, decoupling reliability from ordering, eliminating head-of-line blocking | `SRD.txt` verbatim (F-4); AWS HPC Blog on relaxing in-order delivery (F-7) |
| `Architecture.tsx:203-230` | Three BAR regions: `db_bar` (doorbells), `mem_bar` (LLQ descriptors), DMA-coherent RQ/CQ buffers; UARN per-process scoping | `efa.h` declares all of these at HEAD (F-15) |
| `Architecture.tsx:241-246` | Phase-bit lockless CQ polling | `efa_cqe_is_pending()` + `sub_cq->phase = 1 - sub_cq->phase` in `efa_data_verbs.c` (F-16) |
| `Architecture.tsx:248-253` | PD lkey/rkey + UARN hardware-enforced isolation | `efa.h` `uarn` fields; PD ops in `efa_dev_ops` (F-15) |
| `Architecture.tsx:176-180` | NCCL does NOT call `DescribeInstanceTopology`; that is the scheduler layer's job | `doc/topology-aware.md` (F-50) |
| `Architecture.tsx:78` | Up to 6,400 Gbps on P6-B300 | "P6-B300 instances have a total network bandwidth capacity of up to 6400 Gbps for EFA traffic" (F-36) |
| `Architecture.tsx:263-278` | EFA-with-ENA vs EFA-only; EFA-only cannot be the primary network card | AWS user guide comparison table + `efa-acc-inst-types.html` (F-36, F-58) |
| `Architecture.tsx:275` | EFA-only requires VPC CNI v1.18.5+ on EKS | EKS user guide verbatim (F-59) |
| `Architecture.tsx:296-298` | NIXL requires libfabric 1.21.0+ | "NIXL integrates with Libfabric 1.21.0 and later." (F-54) |
| `Architecture.tsx:321-325` | Self-referencing security group allowing all traffic is mandatory | "An EFA requires a security group that allows all inbound and outbound traffic to and from the security group itself." (F-32 source) |
| `Architecture.tsx:331-334` | Cross-subnet within an AZ works; cannot cross AZ or VPC | Current limitations list only AZ and VPC boundaries; no subnet restriction (F-37) |
| `Architecture.tsx:336-339` | One EFA per network card; P5 = 32 cards, P5en = 16 cards | Network cards table (F-36) |
| `AIMLTraining.tsx:249-251` | `nvidia-fabricmanager` required on P4d/P5 | "(`p4d.24xlarge` and `p5.48xlarge` only) Start the Nvidia Fabric Manager service... Nvidia Fabric Manager is required for NV Switch Management." (F-32 source) |
| `AIMLTraining.tsx:228-232` (first half) | Tuner modifies `collCostTable[][]` rather than setting `NCCL_ALGO`/`NCCL_PROTO` | `table[algorithm][protocol] = 0.0;` in `nccl_ofi_regions.cpp` (F-40) |

---

## PART 3 — UNKNOWN REGISTER

Numbers and claims in the existing content that I could **not** trace to a Tier 1 or Tier 2 source. Per the sourcing protocol these are recorded as UNKNOWN rather than estimated.

**U-1. `Architecture.tsx:34` — "reduce per-message latency to ~15μs"**
No AWS source found stating a ~15 µs figure for EFA. **UNKNOWN.** AWS marketing materials describe EFA as "lower and more consistent latency" without a number. Recommend either sourcing this to a specific published benchmark (and labelling it Tier 3) or removing the number.

**U-2. `Architecture.tsx:150-153` — "~100x faster retransmission than the RFC 6298 minimum of 200ms"**
Not found in any AWS documentation or in `SRD.txt`. Likely derived from the IEEE Micro 2020 paper (paywalled; not fetched during this research). **UNKNOWN pending direct verification against the paper.** If retained, cite the paper explicitly with page/section and label Tier 3.

**U-3. `Architecture.tsx:189-192` — "P99.9 tail latency of tens of microseconds — an 85% reduction versus TCP"**
The AWS HPC Blog states **p99** (not p99.9) "plummeted (by around a factor of 10)" — a ~90% reduction, at a different percentile. See Contradiction C-1. The specific "P99.9" and "85%" figures are **UNKNOWN**.

**U-4. `AIMLTraining.tsx:243` — "GDRCopy v2.4+"**
The AWS NCCL getting-started guide has a "Step 4: Install GDRCopy" but I did not retrieve a minimum-version statement from it in this pass. The `v2.4+` floor is **UNKNOWN**. (Fetch `efa-start-nccl.html` chars 15568-17177 to resolve.)

**U-5. `Architecture.tsx:126-131` — "manipulating UDP source ports in the encapsulation header" and "monitors RTT on each path at sub-millisecond resolution"**
The 64-path count is confirmed (F-7), but the specific mechanism (UDP source-port entropy) and the RTT sampling resolution are **UNKNOWN** from Tier 1/Tier 2 sources. These are plausible and widely repeated but I found no AWS statement of them. Likely from the IEEE Micro paper — verify there or label as Tier 3 / SPECULATIVE.

**U-6. `Architecture.tsx:141-148` — "congestion control algorithm is closest to TIMELY/Swift"**
This is an analytical comparison, not an AWS claim. **SPECULATIVE** — should be labelled as such. AWS documents only that SRD provides "congestion control" and "Detects and avoids congested network paths" (ENA Express doc).

**U-7. `AIMLTraining.tsx:320-323` — "85-95% scaling efficiency on P5, 40-60% without EFA"**
**UNKNOWN.** No AWS source found. If retained, needs a specific benchmark citation with instance type, model, and node count.

**U-8. `AIMLTraining.tsx:74-76` — "EFA falls slightly short of InfiniBand ConnectX-7 on the specific message sizes used in MoE dispatch-and-combine"**
**UNKNOWN.** No source. This is a comparative performance claim requiring a benchmark citation. Note that the second half of this bullet (GPUDirect Async) is now outright wrong (W-4).

**U-9. `Architecture.tsx:286-290` / `AIMLTraining.tsx:286-290` — P5en total EFA bandwidth of 3,200 Gbps; Trn2 3,200 Gbps; Trn2 UltraServer 12.8 Tbps**
Network card counts are confirmed (P5en = 16, Trn2 = 16) but the per-instance aggregate EFA bandwidth figures were **not re-verified** in this pass. `efa-acc-inst-types.html` documents P5/P5e, P6-B200, P6e-GB200, and P6-B300 in detail but has no P5en or Trn2 section. Recommend sourcing from the EC2 instance-types pages.

**U-10. `AIMLTraining.tsx:209-213` — "Lazy QP creation: the actual hardware QP is created at `fi_enable`"**
Plausible and consistent with libfabric's endpoint lifecycle, but **not verified** in this pass. The relevant code is `efa_base_ep.c` / `efa_rdm_ep_fiops.c` in `prov/efa/src`.

**U-11. `AIMLTraining.tsx:186-189` — immediate data "bit-packs `comm_id + seq_num + segment_count` into a single 64-bit value"**
**Not verified** in this pass. Note that EFA CQ data width was recently a bug: installer 1.45.1 fixed "bug that truncated cq_data to 2 bytes while provider advertised support for 4 bytes" — which suggests EFA immediate/CQ data is **4 bytes**, not 64 bits. This claim needs re-checking against `nccl_ofi_rdma.cpp` and may be wrong.

**U-12. `Architecture.tsx:293-298` — the exact `efa` vs `efa-direct` fabric selection used by NIXL**
The AWS docs confirm NIXL + libfabric 1.21.0+, but which fabric NIXL requests is **UNKNOWN** from the sources fetched.

---

## PART 4 — CONTRADICTIONS

**C-1. Tail latency percentile and magnitude.**
- **[Tier 2 — AWS HPC Blog]** "The p99 tail latency plummeted (by around a factor of 10)." → p99, ~90% reduction. Source: https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/
- **[Existing deep-dive content, `Architecture.tsx:189-192`, unsourced]** "P99.9 tail latency of tens of microseconds — an 85% reduction versus TCP."

Different percentile (p99 vs p99.9) and different magnitude (10x vs 85%). Recommend replacing the deep dive's figure with the AWS-attributable p99 / factor-of-10 statement, or sourcing the p99.9 number to the IEEE Micro paper explicitly.

**C-2. `SRD.txt` versus the driver's own code on RDMA support.**
- **[Tier 1 — `amzn/amzn-drivers` `SRD.txt`]** "Currently only Send operation is supported, but nothing precludes RDMA operations support in future (with weak memory consistency)."
- **[Tier 1 — `amzn/amzn-drivers` `efa_io_defs.h`, same repository]** `EFA_IO_RDMA_READ = 1`, `EFA_IO_RDMA_WRITE = 2`; and `RELEASENOTES.md` r2.4.0 "Add RDMA write support", r3.3.0 "Add support for inline WRITE operation".

**Resolution:** `SRD.txt` is a stale specification document that has not been revised since RDMA operations shipped. The code and release notes are authoritative. **Anyone citing `SRD.txt` for "send-only" is citing an unmaintained doc** — this is very likely the origin of the deep dive's W-1 error.

**C-3. EFA driver version: upstream HEAD versus AWS installer.**
- **[Tier 1 — `amzn/amzn-drivers` master]** driver r3.3.0, commit `b99452b707`, 2026-07-28
- **[Tier 1 — AWS EFA installer changelog]** installer 1.49.0 (June 27, 2026) ships "EFA driver 3.1.0"

**Resolution:** Not a true contradiction — upstream moves ahead of the packaged installer. r3.3.0 landed a month after installer 1.49.0 shipped. When stating "the current EFA driver," specify which: what you get from `efa_installer.sh` today (3.1.0) or what is in the repo (3.3.0).

**C-4. libfabric version: upstream `ofiwg` versus AWS fork.**
- **[Tier 1 — `ofiwg/libfabric`]** v2.6.0, 2026-06-22
- **[Tier 1 — AWS EFA installer changelog]** installer 1.49.0 ships "libfabric 2.4.0amzn5.0"

**Resolution:** AWS ships a fork (`github.com/aws/libfabric`) with `amzn` suffixes, carrying backports ahead of the corresponding upstream point release. `2.4.0amzn5.0` is not the same code as upstream `v2.4.0`. Deep-dive text must not present a single "current libfabric version."

**C-5. Recommended NCCL environment variables.**
- **[Tier 1 — `aws/aws-ofi-nccl` `doc/efa-env-var.md`]** `NCCL_BUFFSIZE` and `NCCL_MIN_CHANNELS`: "Recommend to leave it out to use the default." `FI_EFA_USE_DEVICE_RDMA=1`: "Do not set for libfabric>=1.18.0 and aws-ofi-nccl>=1.7.0."
- **[Existing deep-dive content, `AIMLTraining.tsx:142-155`]** presents `FI_PROVIDER=efa`, `FI_EFA_USE_DEVICE_RDMA=1`, `NCCL_BUFFSIZE=8388608`, `NCCL_MIN_NCHANNELS=4` as current recommended settings.

**Resolution:** The plugin's own documentation is authoritative and contradicts the deep dive on every one of those four. See S-1 and S-3.

---

## PART 5 — SOURCES

### Tier 1 — Official AWS documentation and official source repositories

**AWS documentation** (all accessed 2026-08-01):
1. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html — EFA overview, EFA basics, supported interfaces/libraries, supported instance types by Nitro/EFA version, supported operating systems, EFA limitations, pricing
2. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html — EFA installer release notes, versions 1.4.0 through 1.49.0
3. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html — Multi-network-card configuration; P5/P5e, P6-B200, P6e-GB200, P6-B300 EFA layouts and bandwidth
4. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html — NCCL getting started, GDRCopy step, Fabric Manager, security group requirements
5. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html — NIXL getting started, disaggregated inference, vLLM test
6. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html — Network cards table (per-instance network card counts)
7. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html — ENA Express / SRD, 5→25 Gbps single flow, cross-AZ support
8. https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html — io2 Block Express uses SRD
9. https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html — EFA and EFA-only on EKS, VPC CNI 1.18.5+
10. https://aws.amazon.com/about-aws/whats-new/2024/10/aws-efa-updates-scalability-ai-ml-applications/ — EFA-only interface announcement (Oct 24, 2024)

**Source repositories** (all accessed 2026-08-01):
11. https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/SRD.txt — SRD QP-type specification
12. https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/RELEASENOTES.md — EFA kernel driver release notes through r3.3.0
13. https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_main.c — `efa_dev_ops` ib_device_ops table
14. https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_data_verbs.c — `efa_post_send`, `efa_post_recv`, `efa_poll_cq`, phase-bit polling
15. https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa_io_defs.h — `enum efa_io_send_op_type` hardware opcodes
16. https://github.com/amzn/amzn-drivers/blob/master/kernel/linux/efa/src/efa.h — BAR regions, UARN
17. https://github.com/ofiwg/libfabric/blob/v2.6.0/man/fi_efa.7.md — EFA provider man page: `efa` vs `efa-direct`, GDA ops, env vars, `fi_setopt` options
18. https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/docs/efa_fabric_comparison.md — `efa` vs `efa-direct` feature matrix, data path direct, util CQ bypass, RDMA offload
19. https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/src/efa_data_path_direct.h — Data Path Direct interface
20. https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/src/efa_hmem.c — per-HMEM-interface protocol thresholds (CUDA: eager + runting read only)
21. https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/src/rdm/efa_rdm_msg.c — `efa_rdm_msg_select_rtm()` protocol selection
22. https://github.com/ofiwg/libfabric/tree/v2.6.0/prov/efa/src/rdm — RDM source listing (confirms `rxr_*` rename, absence of `efa_rdm_ep.c`)
23. https://github.com/aws/aws-ofi-nccl/releases/tag/v1.20.0 — plugin v1.20.0 release notes
24. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_tuner.cpp — tuner v2/v3/v6 entry points, `NCCL_ALGO`/`NCCL_PROTO` handling
25. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/tuner/nccl_ofi_regions.cpp — `collCostTable` manipulation
26. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/include/tuner/nccl_ofi_tuner_process_config.h — `should_use_ofi_tuner()`, tuner platform detection
27. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/doc/efa-env-var.md — EFA environment-variable cheatsheet
28. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/doc/topology-aware.md — topology-aware scheduling, `DescribeInstanceTopology` at the scheduler layer
29. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/Makefile.am — tuner loading behaviour by NCCL version
30. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/platform-aws.cpp — `PlatformAWS::sort_rails()`
31. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/src/nccl_ofi_cuda.cpp — `cuPointerGetAttributes`
32. https://github.com/aws/aws-ofi-nccl/blob/v1.20.0/README.md — GPUDirect RDMA requirements (`FI_HMEM` + RDMA support)
33. https://github.com/aws/aws-ofi-nccl/tree/v1.20.0/topology — shipped topology XML files
34. GitHub Releases API: `https://api.github.com/repos/ofiwg/libfabric/releases`, `https://api.github.com/repos/aws/aws-ofi-nccl/releases` — release tags and dates
35. GitHub Commits API: `https://api.github.com/repos/amzn/amzn-drivers/commits?path=kernel/linux/efa` — HEAD commit and date

### Tier 2 — AWS blogs

36. https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/ — SRD design rationale, 64 paths, p99 factor-of-10, Ethernet-based transport
37. https://aws.amazon.com/blogs/storage/storage-for-i-o-intensive-sql-server-using-amazon-ebs-io2-block-express/ — SRD vs TCP/InfiniBand/RoCE, multi-path, Nitro card implementation
38. https://aws.amazon.com/blogs/hpc/how-we-enabled-uncompressed-live-video-with-cdi-over-efa/ — CDI over EFA, SRD as multipath self-healing transport
39. https://aws.amazon.com/ebs/provisioned-iops/ — io2 Block Express + SRD
40. https://aws.amazon.com/media-services/resources/cdi/ — EFA/SRD description
41. https://docs.aws.amazon.com/wellarchitected/2023-04-10/framework/perf_select_network_protocols.html — PERF05-BP05, when to use SRD

### Tier 3 — Academic

42. https://ieeexplore.ieee.org/document/9167399 — Shalev et al., "A Cloud-Optimized Transport Protocol for Elastic and Scalable HPC," IEEE Micro, 2020. **Referenced by libfabric's own EFA provider documentation as the SRD paper.** NOT fetched during this research (paywalled). Several UNKNOWN-register items (U-2, U-3, U-5) would likely be resolved by it.

### Tier 4 — none used

No tutorials or third-party blogs were cited as fact in this report.

---

## PART 6 — RECOMMENDED CONTENT ADDITIONS

Material discovered during this research that has no counterpart in the current deep dive and is worth adding:

1. **`efa` vs `efa-direct` fabrics** — the single biggest structural change in the libfabric EFA provider since the deep dive was written. Full feature matrix available at F-19 / source 18. Directly relevant to the "Software Stack" container in `Architecture.tsx`.
2. **Data Path Direct** — libfabric now posts WQEs and polls CQs without going through rdma-core. This is the sharper version of the "OS bypass" story the deep dive is trying to tell, and it is genuinely new (installer 1.45.0-1.46.0, late 2025). It replaces W-2 as the compelling "how deep does the bypass go" narrative.
3. **EFA v4 / Nitro v6** — an entire device generation absent from the current content, along with 800/1600 Gbps link-speed reporting in driver r3.3.0.
4. **Kernel verbs path (`HAVE_EFA_KVERBS`)** — the correct, more interesting version of the OS-bypass discussion: the kernel driver now has a data path, and it exists for in-kernel consumers while userspace continues to bypass it entirely.
5. **Hardware completion counters backed by MSI-X**, with external memory (VA or DMA-BUF) backing, including GPU-memory-backed counters — new in driver r3.3.0 and libfabric 2.6.0.
6. **Region vs Model tuner backends**, per-platform region definitions for P5/P5en/P6-B200/P6-B300, and the `num_nodes <= 2` fallback. The current content describes a single monolithic tuner.
7. **NIXL / disaggregated inference** — first-class AWS documentation now exists, including a vLLM walkthrough. `AIMLInference.tsx` was not in scope for this refresh but should be checked.
8. **DMA-BUF as a registration path** (driver `reg_user_mr_dmabuf`, plugin `nccl_ofi_dmabuf.cpp`, ROCm 7.x fixes in v1.20.0) — an alternative to the nv-peermem/P2P path.
9. **Multi-receive support** (v1.20.0, alltoall performance, auto-enabled) — relevant to the MoE discussion in `AIMLTraining.tsx` that currently ends on the now-wrong GDA claim.
10. **`FI_EFA_WR_HIGH_PPS`** and **unsolicited write receive** — two device-level capabilities exposed as libfabric knobs that did not exist when the deep dive was written.
