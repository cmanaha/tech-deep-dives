# V1 - Adversarial Verification of 01-efa-core.md (EFA Core Claims 1-6)

**Verification date:** 2026-08-01
**Method:** Full local clones read at pinned commits. Code is the only authority. In-repo comments, README, SRD.txt and design docs used for orientation only, never as proof. AWS documentation used as secondary check.
**Posture:** Adversarial. Default verdict is REFUTED unless code at a specific line proves otherwise.

## Pinned sources

| Repo | Ref | SHA | Date |
|---|---|---|---|
| `amzn/amzn-drivers` | `master` HEAD | `b99452b70756b1b394b1e7ff238d4efbdca44c5b` | 2026-07-28 18:24:30 +0300 ("linux/efa: Bump driver version to 3.3.0") |
| `ofiwg/libfabric` | tag `v2.6.0` | `5de2d6a2df83595bcc38531cb91bf59495559495` | 2026-06-19 16:18:35 -0700 |
| `aws/aws-ofi-nccl` | tag `v1.20.0` | `a2a6d08ea98296f99596b5c18b30b8a20d74f609` | 2026-06-24 10:25:48 -0700 |
| `torvalds/linux` | `master` | `2d2338c93da79b3bfe4b6099a931d9468d539952` | fetched 2026-08-01; last change under `drivers/infiniband/hw/efa` = `9e7e6633458362db72427b48effad8d759131c35`, 2026-06-18 |
| `NVIDIA/nccl` | tags `v2.21.5-1`, `v2.22.3-1`, `v2.29.7-1`, `v2.30.3-1`, `master` | (tag refs) | - |

---

## VERDICT TABLE

| # | Claim (abbreviated) | Verdict |
|---|---|---|
| 1 | RDMA Read/Write are native hardware opcodes, not software-emulated; evidence = `EFA_IO_RDMA_READ=1`/`EFA_IO_RDMA_WRITE=2`. RDMA WRITE generation? | **PARTLY-CORRECT** |
| 2 | Kernel driver implements post_send/post_recv/poll_cq in 798-line `efa_data_verbs.c`, in `efa_dev_ops` under `#ifdef HAVE_EFA_KVERBS`, landed r2.12.0. Compiled in by default? | **PARTLY-CORRECT** (and: it IS on by default) |
| 3 | Fourth generation: EFA v4 / Nitro v6, device id `0xefa4`, driver r3.3.0 | **PARTLY-CORRECT** |
| 4 | `NCCL_ALGO`/`NCCL_PROTO` no longer disables the aws-ofi-nccl tuner for NCCL 2.22.3+ | **PARTLY-CORRECT** |
| 5 | GPUDirect Async supported via `FI_EFA_GDA_OPS` on the efa-direct fabric | **PARTLY-CORRECT** |
| 6 | Data Path Direct: libfabric posts WQEs and polls CQs without rdma-core at all | **REFUTED** as worded |

---

## CLAIM 1 - RDMA Read/Write are native hardware opcodes

### VERDICT: PARTLY-CORRECT

**The conclusion is right. The cited evidence does not, on its own, prove it. And the source-of-truth line is a different one.**

### 1a. The enum exists exactly as quoted - CONFIRMED

`amzn/amzn-drivers` @ `b99452b70` - `kernel/linux/efa/src/efa_io_defs.h:23-34`:

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

The opcode is a 4-bit field inside the TX descriptor control byte. `efa_io_defs.h:93`:

```
	 * 3:0 : op_type - enum efa_io_send_op_type
```

The research report's downstream line citations are also exactly correct. `efa_data_verbs.c:354-365`:

```c
		switch (wr->opcode) {
		case IB_WR_RDMA_READ:
			opcode = EFA_IO_RDMA_READ;
...
		case IB_WR_RDMA_WRITE_WITH_IMM:
			efa_set_imm_data(wr, md);
			fallthrough;
		case IB_WR_RDMA_WRITE:
			opcode = EFA_IO_RDMA_WRITE;
```

and the completion decode at `efa_data_verbs.c:627-633`:

```c
		switch (op_type) {
		case EFA_IO_RDMA_WRITE:
			wc->opcode = IB_WC_RDMA_WRITE;
			break;
		case EFA_IO_RDMA_READ:
			wc->opcode = IB_WC_RDMA_READ;
```

### 1b. Does the enum PROVE hardware support? - NOT BY ITSELF

Adversarial reading: an enum in a driver header is, on its face, a software namespace. `efa_io_defs.h` is the shared device/driver I/O descriptor definition, which is stronger than an ordinary internal enum (these values are written into the descriptor bytes that get DMA'd to the device), but the enum's existence still proves nothing about whether any given EFA device will execute the opcode.

**The decisive code is elsewhere: the device itself reports RDMA read/write as capability bits over the admin queue.**

`kernel/linux/efa/src/efa_admin_cmds_defs.h:726-743` (inside `feature_device_attr_desc`):

```
	 * 0 : rdma_read - If set, RDMA Read is supported on
	 *    TX queues
	 * 1 : rnr_retry - If set, RNR retry is supported on
	 *    modify QP command
	 * 2 : data_polling_128 - If set, 128 bytes data
	 *    polling is supported
	 * 3 : rdma_write - If set, RDMA Write is supported
	 *    on TX queues
	 * 4 : unsolicited_write_recv - If set, unsolicited
	 *    write with imm. receive is supported
...
	u32 device_caps;

	/* Max RDMA transfer size in bytes */
```

with the accessor masks at `efa_admin_cmds_defs.h:1296` and `:1299`:

```c
#define EFA_ADMIN_FEATURE_DEVICE_ATTR_DESC_RDMA_READ_MASK   BIT(0)
#define EFA_ADMIN_FEATURE_DEVICE_ATTR_DESC_RDMA_WRITE_MASK  BIT(3)
```

This is a device-reported feature descriptor with a `max_rdma_size` field, not a software constant. It proves two things at once:
1. RDMA Read and RDMA Write are hardware TX-queue operations, not a software protocol layered on Send.
2. They are **negotiated per device**, so a blanket "EFA hardware does RDMA" is itself an overstatement without the generation qualifier.

### 1c. RDMA WRITE generation: Nitro v4+, NOT Nitro v6 - AWS docs

`https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` (accessed 2026-08-01), verbatim:

> "EFA supports RDMA (Remote Direct Memory Access) write on most supported instance types that have Nitro version 4 and later. RDMA read is supported on all instances with Nitro version 4 and later."

The per-generation tables corroborate: under "Nitro v4 (EFA v2)", `p5.48xlarge`, `p5e.48xlarge`, `trn1.32xlarge`, `trn1n.32xlarge`, `m6i.32xlarge`, `c7i.48xlarge`, `hpc7a.96xlarge` etc. all show `RDMA read support = Yes | RDMA write support = Yes`.

Exceptions the tables show, worth publishing:
- Nitro v3 (EFA v1): `p4d.24xlarge` and `p4de.24xlarge` are `Yes | No` (read yes, write no). Every other Nitro v3 row is `No | No`.
- Nitro v5 (EFA v3): `c7gn.16xlarge`, `c7gn.metal`, `hpc7g.4xlarge`, `hpc7g.8xlarge`, `hpc7g.16xlarge` are `Yes | No`.

So "RDMA write is Nitro v6" is **REFUTED**. The 01-efa-core research already reaches this conclusion in W-3; that part is independently confirmed here.

### Corrected wording to publish

> RDMA Read and RDMA Write are native EFA device operations, not a software protocol built on Send. The EFA device reports them as capability bits in its admin-queue device attributes (`rdma_read` = bit 0, `rdma_write` = bit 3 of `device_caps`, `amzn/amzn-drivers` `kernel/linux/efa/src/efa_admin_cmds_defs.h:726-743`, masks at lines 1296 and 1299), alongside a `max_rdma_size` limit, and the driver encodes them as descriptor opcodes `EFA_IO_RDMA_READ = 1` and `EFA_IO_RDMA_WRITE = 2` (`efa_io_defs.h:23-34`) in the 4-bit `op_type` field of the TX descriptor. Because the capability is device-reported, support is per generation: AWS documents RDMA read on all Nitro v4 and later instances (plus `p4d`/`p4de` on Nitro v3), and RDMA write on most Nitro v4 and later, with `c7gn` and `hpc7g` on Nitro v5 as documented read-only exceptions.

---

## CLAIM 2 - Kernel driver now implements post_send/post_recv/poll_cq

### VERDICT: PARTLY-CORRECT

Every individual sub-fact checks out for the out-of-tree amzn-drivers module. The claim is overstated in one important way: it says "the kernel driver", and that is not true of the driver shipped inside mainline Linux.

### 2a. File exists, line count is exact - CONFIRMED

`amzn/amzn-drivers` @ `b99452b70` - `kernel/linux/efa/src/efa_data_verbs.c` = **798 lines** (verified `wc -l`, 20763 bytes).

Function definitions in that file:
- `efa_data_verbs.c:324` / `:327` - `int efa_post_send(struct ib_qp *ibqp, ...)` (two prototypes under a kernel-version conditional for `const struct ib_send_wr`)
- `efa_data_verbs.c:453` / `:456` - `int efa_post_recv(...)`
- `efa_data_verbs.c:704` - `int efa_poll_cq(struct ib_cq *ibcq, int nwc, struct ib_wc *wc)`
- `efa_data_verbs.c:752` - `int efa_req_notify_cq(struct ib_cq *ibcq, enum ib_cq_notify_flags flags)`
- `efa_data_verbs.c:779` - `int efa_map_mr_sg(struct ib_mr *ibmr, ...)`

### 2b. Ops registration and ifdef guard - CONFIRMED, line numbers off by 2

The table is `static const struct ib_device_ops efa_dev_ops` at `efa_main.c:460`. The kverbs block is at `efa_main.c:551-559`, not 549-558 as the research report states:

```c
551	#ifdef HAVE_EFA_KVERBS
552		.get_dma_mr = efa_get_dma_mr,
553		.alloc_mr = efa_alloc_fast_mr,
554		.map_mr_sg = efa_map_mr_sg,
555		.post_send = efa_post_send,
556		.post_recv = efa_post_recv,
557		.poll_cq = efa_poll_cq,
558		.req_notify_cq = efa_req_notify_cq,
559	#endif
```

`ib_set_device_ops(&dev->ibdev, &efa_dev_ops);` at `efa_main.c:655`.

**The research report missed a second registration site.** For older kernels that lack `ib_set_device_ops`, the same seven ops are assigned directly, `efa_main.c:680-687`:

```c
680	#ifdef HAVE_EFA_KVERBS
681		dev->ibdev.get_dma_mr = efa_get_dma_mr;
682		dev->ibdev.alloc_mr = efa_alloc_fast_mr;
683		dev->ibdev.map_mr_sg = efa_map_mr_sg;
684		dev->ibdev.post_send = efa_post_send;
685		dev->ibdev.post_recv = efa_post_recv;
686		dev->ibdev.poll_cq = efa_poll_cq;
687		dev->ibdev.req_notify_cq = efa_req_notify_cq;
```

### 2c. Landed in r2.12.0 - CONFIRMED

- Adding commit: `30efa4f8f24ed9b9426713c67588ff6a03a0381c`, 2024-10-01, "linux/efa: Add kernel verbs support" (first commit to add `kernel/linux/efa/src/efa_data_verbs.c`).
- `git merge-base --is-ancestor 30efa4f8f b4e058d3a92bd43153895b21b005cfaf9f90e55c` returns true. `b4e058d3a` = "linux/efa: Bump driver version to 2.12.0", 2024-10-01.
- `kernel/linux/efa/RELEASENOTES.md:85-86`:
  ```
  ## r2.12.0 release notes
  * Introduce EFA kernel verbs support
  ```

### 2d. Is it COMPILED IN by default? - YES. This does not rescue the original OS-bypass claim.

The caller's hypothesis was that if `HAVE_EFA_KVERBS` were off by default, the original "the kernel driver does not implement post_send" claim might still stand. It is **on** by default.

`kernel/linux/efa/CMakeLists.txt:36`:
```cmake
set(ENABLE_KVERBS ON CACHE BOOL "Enable kernel verbs support")
```

`kernel/linux/efa/src/CMakeLists.txt:13-14`:
```cmake
if(ENABLE_KVERBS)
  list(APPEND efa_sources efa_verbs.h efa_data_verbs.c)
endif()
```

`kernel/linux/efa/src/CMakeLists.txt:30-32`:
```cmake
if(ENABLE_KVERBS)
  config_define(HAVE_EFA_KVERBS)
  message("-- Kernel verbs support enabled")
endif()
```

And the DKMS path that `efa_installer.sh` actually uses does not override it. `kernel/linux/efa/conf/configure-dkms.sh`:
```bash
$CMAKE -DKERNEL_VER=${kernelver} ..
```
No `-DENABLE_KVERBS=OFF`. `grep -rn "ENABLE_KVERBS" rpm/ debian/` returns nothing. `conf/dkms.conf` carries `PACKAGE_VERSION="3.3.0"`.

**Conclusion:** on any host that installed the EFA driver via `efa_installer.sh`, `efa_data_verbs.c` is compiled in and `post_send`/`post_recv`/`poll_cq`/`req_notify_cq` are live entries in `efa_dev_ops`.

### 2e. NEW FINDING - the mainline in-tree Linux driver does NOT have these ops

`torvalds/linux` @ `2d2338c93` (`drivers/infiniband/hw/efa` last touched by `9e7e66334`, 2026-06-18):

- `drivers/infiniband/hw/efa/efa_verbs.c` (2289 lines): `grep -n "post_send\|post_recv\|poll_cq\|req_notify_cq"` returns **zero matches**.
- `drivers/infiniband/hw/efa/efa_main.c:365-403`: the `static const struct ib_device_ops efa_dev_ops` table contains `alloc_pd`, `create_qp`, `modify_qp`, `reg_user_mr`, `reg_user_mr_dmabuf`, `query_port_speed` and so on, with **no** `post_send`, `post_recv`, `poll_cq` or `req_notify_cq`.
- There is no `efa_data_verbs.c` in the mainline tree at all.

So the sentence "the kernel driver NOW implements post_send/post_recv/poll_cq" is true of the amzn-drivers out-of-tree module (which is what AWS ships and what the installer builds) and **false** of the driver a stock distro kernel carries. Publishing it unqualified would be wrong for anyone on an unmodified upstream kernel.

### 2f. What this does and does not mean for OS bypass

Neither reading changes the userspace story. `ib_device_ops.post_send` is the in-kernel verbs entry point, reachable only by in-kernel RDMA consumers (ULPs). A libfabric application still never enters the kernel on the data path. The 01-efa-core report's F-13/W-2 nuance is correct on this point; only its scoping ("the kernel driver") needs tightening.

### Corrected wording to publish

> Since driver r2.12.0 (commit `30efa4f8f`, 2024-10-01, release note "Introduce EFA kernel verbs support"), the **out-of-tree** `amzn/amzn-drivers` EFA module implements a full kernel data path in a 798-line `kernel/linux/efa/src/efa_data_verbs.c`: `efa_post_send` (line 324), `efa_post_recv` (line 453), `efa_poll_cq` (line 704), `efa_req_notify_cq` (line 752). These are registered in `efa_dev_ops` at `efa_main.c:551-558` (and again directly on `dev->ibdev` at `efa_main.c:680-687` for older kernels), guarded by `#ifdef HAVE_EFA_KVERBS`. That guard is **enabled by default**: `CMakeLists.txt:36` sets `ENABLE_KVERBS ON`, and the DKMS build script `conf/configure-dkms.sh` does not override it, so every `efa_installer.sh` install compiles it in. The driver that ships inside mainline Linux is different: at `torvalds/linux` master, `drivers/infiniband/hw/efa/efa_main.c` has no `post_send`, `post_recv`, `poll_cq` or `req_notify_cq` in its `efa_dev_ops` table and there is no `efa_data_verbs.c`. In both cases this is the kernel-verbs path for in-kernel RDMA consumers. A userspace libfabric application still never enters the kernel on the data path.

---

## CLAIM 3 - EFA v4 / Nitro v6, device id 0xefa4, driver r3.3.0

### VERDICT: PARTLY-CORRECT

### 3a. `0xefa4` in source - CONFIRMED

`amzn/amzn-drivers` @ `b99452b70` - `kernel/linux/efa/src/efa_main.c:27-38`:

```c
27	#define PCI_DEV_ID_EFA0_VF 0xefa0
28	#define PCI_DEV_ID_EFA1_VF 0xefa1
29	#define PCI_DEV_ID_EFA2_VF 0xefa2
30	#define PCI_DEV_ID_EFA3_VF 0xefa3
31	#define PCI_DEV_ID_EFA4_VF 0xefa4
...
34		{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA0_VF) },
35		{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA1_VF) },
36		{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA2_VF) },
37		{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA3_VF) },
38		{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA4_VF) },
```

### 3b. Driver release r3.3.0 - CONFIRMED

- Adding commit: `350308a3ed5e953c098fcad449de3838dab1caeb`, 2026-07-28, "linux/efa: Add EFA 0xefa4 PCI ID".
- Version bump commit the same day: `b99452b70`, "linux/efa: Bump driver version to 3.3.0". The previous bump is `64788ef7c` "Bump driver version to 3.1.0" (2026-05-11). There is no r3.2.0 entry in `RELEASENOTES.md` and no r3.2.0 bump commit.
- `RELEASENOTES.md:6-12` (r3.3.0) includes verbatim: `* Add 0xefa4 device support` and `* Support reporting 800 and 1600 Gbps link speed`.
- `conf/dkms.conf`: `PACKAGE_VERSION="3.3.0"`.

### 3c. Two caveats the research understates

**(i) r3.3.0 is not shipping.** There is no release tag; r3.3.0 exists only as master HEAD. Per the EFA installer changelog, installer 1.49.0 (June 27, 2026) ships EFA driver **3.1.0**, which predates the `0xefa4` commit by two months. Anyone running `efa_installer.sh` today does not have `0xefa4` support. The research does flag this skew in C-3 but then presents `0xefa4` and r3.3.0 as current fact in F-11/F-56.

**(ii) The `0xefa4` to "EFA v4 / Nitro v6" mapping is inference, not a sourced fact.** No line in `amzn/amzn-drivers` or in the AWS user guide maps a PCI device ID to an "EFA version" or a "Nitro version". The driver defines **five** device IDs (`0xefa0` through `0xefa4`); AWS documents **four** EFA versions (v1 through v4). Those two sequences cannot both be a 1:1 mapping. `ofiwg/libfabric` treats `0xefa0` as its own case (`prov/efa/src/efa_device.c:521-526`, `efa_device_use_sub_cq()` returns `vendor_part_id == 0xefa0`), which is consistent with `0xefa0` being the original c5n/p3dn-era part and the AWS "EFA v1" label covering both `0xefa0` and `0xefa1`. Publishing "device id `0xefa4` = EFA v4" without a label is an unsourced derivation.

The AWS side of the claim is separately solid: `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` does present exactly four tabs, and the fourth is literally headed "Nitro v6 (EFA v4)", listing `p6-b200.48xlarge`, `p6-b300.48xlarge`, `g7`/`g7e`, `m8i`/`c8i`/`r8i`/`x8i`, `m9g`/`c9g`, `hpc8a.96xlarge`, `i8ge.48xlarge`, `m8gb`/`c8gb`/`r8gb`, `m8gn`/`c8gn`/`r8gn`, `m8a`/`c8a`/`r8a`, `x8aedz`, all `Yes | Yes` for RDMA read/write.

### Corrected wording to publish

> A fourth EFA generation exists. AWS documents it as "Nitro v6 (EFA v4)" and lists `p6-b200.48xlarge`, `p6-b300.48xlarge`, `g7`/`g7e`, `m8i`/`c8i`/`r8i`/`x8i`, `m9g`/`c9g`, `hpc8a.96xlarge` and `i8ge` under it, all with RDMA read and RDMA write. On the driver side, a fifth PCI device ID `PCI_DEV_ID_EFA4_VF 0xefa4` was added at `amzn/amzn-drivers` `kernel/linux/efa/src/efa_main.c:31` by commit `350308a3e` (2026-07-28) and released in driver r3.3.0, alongside 800 and 1600 Gbps link-speed reporting. Two caveats: r3.3.0 is master HEAD only, and the shipping EFA installer 1.49.0 (June 27, 2026) still carries driver 3.1.0, which predates the `0xefa4` commit. And no AWS source maps a PCI device ID to an EFA version number; the driver carries five IDs (`0xefa0` to `0xefa4`) against four documented EFA versions, so treating `0xefa4` as "EFA v4" is an inference, not a documented equivalence. [SPECULATIVE on the ID-to-generation mapping.]

---

## CLAIM 4 - NCCL_ALGO/NCCL_PROTO no longer disables the tuner for NCCL 2.22.3+

### VERDICT: PARTLY-CORRECT

The operational outcome is right. Three of the supporting statements in 01-efa-core (F-41, W-6) are wrong.

### 4a. The bailout exists in exactly one function - CONFIRMED

`aws/aws-ofi-nccl` @ `a2a6d08ea` (v1.20.0). `grep -rn "NCCL_ALGO\|NCCL_PROTO" src include` finds exactly one `getenv` guard: `src/tuner/nccl_ofi_tuner.cpp:145`, inside `nccl_ofi_tuner_init_v2` (defined at line 138):

```c
138	static ncclResult_t nccl_ofi_tuner_init_v2(size_t nRanks, size_t nNodes, ncclDebugLogger_t logFunction, void **context)
139	{
140		/*
141		 * NCCL parses these variables and applies user filters inside its
142		 * current tuner logic. The tuner_v2 does not support setting these
143		 * variables and so the internal tuner will be used instead.
144		 */
145		if (getenv("NCCL_ALGO") || getenv("NCCL_PROTO")) {
```

### 4b. The v3 and v6 entry points have no such check - CONFIRMED

`src/tuner/nccl_ofi_tuner.cpp`:
- `:183-184` - `NCCL_OFI_EXPORT_SYMBOL ncclTuner_v3_t ncclTunerPlugin_v3 = {.name = "nccl_ofi_tuner", .init = nccl_ofi_tuner_init,` (the plain init at line 47, no env check)
- `:189-194` - `nccl_ofi_tuner_init_v6` body is a single `return nccl_ofi_tuner_init(nRanks, nNodes, logFunction, ctx);`
- `:223-224` - `NCCL_OFI_EXPORT_SYMBOL ncclTuner_v6_t ncclTunerPlugin_v6 = {.name = "nccl_ofi_tuner", .init = nccl_ofi_tuner_init_v6,`
- `:255-256` - `ncclTunerPlugin_v2` uses `nccl_ofi_tuner_init_v2`

### 4c. `should_use_ofi_tuner()` - CONFIRMED, three conditions, none env-var

`include/tuner/nccl_ofi_tuner_process_config.h:75-79`:

```c
	bool should_use_ofi_tuner() const {
		return platform_type != nullptr &&
		       !use_internal_tuner &&
		       !force_num_rails_set;
	}
```

with the documented contract at lines 66-74 ("Platform type is available (AWS platform detected)", "'Internal' force is not set by env variable", "OFI_NCCL_FORCE_NUM_RAILS is not set"). Called from `src/tuner/nccl_ofi_tuner.cpp:69`.

### 4d. NCCL 2.22.3 mapping - CONFIRMED from NCCL source, not inferred

- `NVIDIA/nccl` @ `v2.21.5-1`, `src/include/nccl_tuner.h:54` `} ncclTuner_v2_t;` and `:58` `#define NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v2"`
- `NVIDIA/nccl` @ `v2.22.3-1`, `src/include/nccl_tuner.h:56` `} ncclTuner_v3_t;` and `:60` `#define NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v3"`
- `NVIDIA/nccl` @ `v2.29.7-1`, `src/include/plugin/nccl_tuner.h:24` `#define NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v5"`
- `NVIDIA/nccl` @ `v2.30.3-1`, `src/include/plugin/nccl_tuner.h:25` `#define NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v6"`

So tuner v3 is primary from NCCL 2.22.3, and v6 from NCCL 2.30.3. Both mappings in the research report are correct.

### 4e. THREE CORRECTIONS to the research report

**(i) "No longer" is wrong. The v3 path never had the check.** Reading older tags in the same repo:

- `v1.13.0-aws`, `src/tuner/nccl_ofi_tuner.c:175-176`: `const ncclTuner_v3_t ncclTunerPlugin_v3 = {.name = "nccl_ofi_tuner", .init = nccl_ofi_tuner_init,` and `:205-206` v2 uses the same plain init. The only `getenv("NCCL_ALGO")` is at `:251`, inside `nccl_ofi_tuner_init_v1` (v1 struct at `:277-278`).
- `v1.16.0`, `src/tuner/nccl_ofi_tuner.cpp`: same shape (v3 at `:193-194`, v2 at `:223-224` both plain init; getenv at `:269` in the v1 init).
- `v1.18.0` and `v1.19.2`: v2 switched to `nccl_ofi_tuner_init_v2` with its own getenv guard; v3 still plain init.

The commit that introduced the v2 guard states its own scope: `faf2e8f2ef9bcbac3ff1fb2f626e96e7a98bc60d`, 2025-08-22, **"Updating tuner v1/v2 to fallback on internal when algo/proto is set"**. v1 and v2 only. The v3 tuner interface has never had the bailout in any release going back to at least v1.13.0-aws.

**(ii) The segfault corroboration in F-41/W-6 is REFUTED.** The report argues: "the v1.20.0 release notes list 'Fixed tuner segfault when NCCL_ALGO or NCCL_PROTO is explicitly set' as a bug fix - a segfault is only reachable if the tuner is running." The commit shows the opposite. `d204003337ff4e66d28bc7463d9570b18bd1ad49`, 2026-05-20, "tuner: Fix segfault when NCCL_ALGO or NCCL_PROTO is set":

```diff
@@ -143,6 +143,9 @@ static ncclResult_t nccl_ofi_tuner_init_v2(...)
 	if (getenv("NCCL_ALGO") || getenv("NCCL_PROTO")) {
+		if (ofi_log_function == NULL) {
+			ofi_log_function = logFunction;
+		}
 		NCCL_OFI_INFO(NCCL_INIT | NCCL_TUNING, "The tuner plugin can not be loaded when "
```

The crash was *inside the bailout*: the early return skipped `nccl_ofi_tuner_init`, which is where `ofi_log_function` gets assigned (`src/tuner/nccl_ofi_tuner.cpp:51-53`), so `NCCL_OFI_INFO` dereferenced a null log function pointer. The segfault happened precisely when the tuner was declining to run, not while running. The inference must be dropped.

**(iii) The same commit removed a v6 bailout that never shipped.** The second hunk of `d204003` deletes an identical `getenv("NCCL_ALGO") || getenv("NCCL_PROTO")` block from `nccl_ofi_tuner_init_v6`. That block was introduced with the v6 headers in `3c2e20cfb73dc22e29eb2996d260f9b91108b8e8` (2026-04-20, "Import NCCL tuner_v5 and tuner_v6 API Headers"). `git tag --contains` shows both commits land only in `v1.20.0`, and `v1.19.2` has no `nccl_ofi_tuner_init_v6` at all. So no shipped release ever had a v6 bailout. Describing v6 as "no such check" is correct for HEAD but should not be presented as longstanding behaviour.

### 4f. Bonus correction on mechanism direction

F-41 says "the tuner still loads and still zeroes `collCostTable` cells; NCCL then applies the user's env-var filter on top of the tuner's cost table". The code shows the opposite order. NCCL pre-marks filtered-out cells and the tuner reads those marks and skips them. `src/tuner/nccl_ofi_regions.cpp:2095-2103`:

```c
	/* Check all regions */
	for (size_t i = 0; i < region_ctx->num_regions[collType] && in_out < 0; i++) {
		algorithm = region_ctx->regions[collType][i].algorithm;
		protocol = region_ctx->regions[collType][i].protocol;
		if (algorithm >= numAlgo || protocol >= numProto ||
		    table[algorithm][protocol] == NCCL_ALGO_PROTO_IGNORE) {
			/* Either NCCL says this combination is not valid/applicable or the algorithm or protocol is
			 * not in the table, hence it is not supported by this NCCL version. */
			continue;
		}
```

The tuner respects the user's `NCCL_ALGO`/`NCCL_PROTO` filter. It will not zero the cost of a combination NCCL has already marked `NCCL_ALGO_PROTO_IGNORE`.

### Corrected wording to publish

> Setting `NCCL_ALGO` or `NCCL_PROTO` does not disable the aws-ofi-nccl tuner on any modern NCCL. The bailout lives in exactly one function, `nccl_ofi_tuner_init_v2` (`src/tuner/nccl_ofi_tuner.cpp:145` at v1.20.0), which serves only the v2 tuner interface (NCCL 2.21.x; `NVIDIA/nccl` v2.21.5-1 `src/include/nccl_tuner.h:58` defines `NCCL_TUNER_PLUGIN_SYMBOL` as `"ncclTunerPlugin_v2"`). The v3 interface, primary from NCCL 2.22.3 (`nccl_tuner.h:60` at v2.22.3-1), and the v6 interface, primary from NCCL 2.30.3, both bind `.init` to the plain `nccl_ofi_tuner_init` with no env-var check (lines 183-184 and 223-224). `TunerProcessConfig::should_use_ofi_tuner()` (`include/tuner/nccl_ofi_tuner_process_config.h:75-79`) gates on three conditions only: AWS platform detected, `NCCL_OFI_TUNER_TYPE` not forced to Internal, and `OFI_NCCL_FORCE_NUM_RAILS` unset. This is not a recent regression: the v3 entry point has never carried the check, and the commit that added the guard says so in its own subject line, "Updating tuner v1/v2 to fallback on internal when algo/proto is set" (`faf2e8f`, 2025-08-22). What the tuner does do is respect the filter: NCCL marks disallowed (algorithm, protocol) cells as `NCCL_ALGO_PROTO_IGNORE` before calling in, and the region tuner skips those cells rather than zeroing them (`src/tuner/nccl_ofi_regions.cpp:2099-2101`). The real disable switches are `NCCL_OFI_TUNER_TYPE=Internal` and `OFI_NCCL_FORCE_NUM_RAILS`.

Do **not** publish the "segfault proves the tuner was running" argument. It is refuted by `d204003`.

---

## CLAIM 5 - GPUDirect Async via FI_EFA_GDA_OPS on efa-direct

### VERDICT: PARTLY-CORRECT

The feature exists in code, gated to efa-direct exactly as claimed. Two corrections: what is exposed is narrower than "GDA support", and the research's scoping caveat about aws-ofi-nccl is factually wrong.

### 5a. In libfabric source, not just the man page - CONFIRMED

`ofiwg/libfabric` @ `v2.6.0` (`5de2d6a2d`):

- `prov/efa/src/fi_ext_efa.h:11` - `#define FI_EFA_GDA_OPS "efa gda ops"`
- `prov/efa/src/fi_ext_efa.h:91-107` - the `struct fi_efa_ops_gda` definition, matching the man page block exactly (`query_addr`, `query_qp_wqs`, `query_cq`, `cq_open_ext`, `get_mr_lkey`, `cntr_open_ext`)
- `prov/efa/src/efa_domain.c:868-874` - the populated table:
  ```c
  static struct fi_efa_ops_gda efa_ops_gda = {
  	.query_addr = efa_domain_query_addr,
  	.query_qp_wqs = efa_domain_query_qp_wqs,
  	.query_cq = efa_domain_query_cq,
  	.cq_open_ext = efa_domain_cq_open_ext,
  	.get_mr_lkey = efa_domain_get_mr_lkey,
  	.cntr_open_ext = efa_domain_cntr_open_ext,
  };
  ```
- `prov/efa/src/efa_domain.c:888-896` - the efa-direct gate, in `efa_domain_ops_open`:
  ```c
  	if (strcmp(ops_name, FI_EFA_GDA_OPS) == 0) {
  		efa_domain = container_of(fid, struct efa_domain, util_domain.domain_fid.fid);
  		if (efa_domain->info_type != EFA_INFO_DIRECT) {
  			EFA_WARN(FI_LOG_DOMAIN, "Only efa direct supports FI_EFA_GDA_OPS\n");
  			return -FI_EOPNOTSUPP;
  		}
  
  		*ops = &efa_ops_gda;
  ```

Man page text at `man/fi_efa.7.md:285-286` (typo "fabirc" is in the source). Feature matrix at `prov/efa/docs/efa_fabric_comparison.md:271` and prose at `:280`.

### 5b. What is actually exposed - narrower than "GDA support"

Every entry in `fi_efa_ops_gda` is a **query or an extended-open**, not a data-path operation. libfabric does not perform GPU-initiated posting itself. It hands a GPU-side consumer the raw handles needed to build and ring WQEs from device code: the AH number / remote QPN / remote qkey (`query_addr`), the SQ and RQ buffer, doorbell, entry size and depth (`query_qp_wqs`), the CQ buffer and doorbell (`query_cq`), the MR local key (`get_mr_lkey`), plus CQ and completion-counter opens that can be backed by external (GPU) memory. Saying "GPUDirect Async is now supported" without that qualifier reads as end-to-end support inside libfabric, which it is not.

### 5c. NEW FINDING - the research's aws-ofi-nccl caveat is REFUTED

The 01-efa-core report states in F-29 and W-4: "A repo-wide grep of `aws/aws-ofi-nccl` @ v1.20.0 for `FI_EFA_GDA` / `efa-direct` returns zero matches, so the NCCL plugin does not consume it" and recommends publishing "GDA is exposed by libfabric on `efa-direct` but is not wired into the NCCL plugin today."

**That is wrong.** `aws/aws-ofi-nccl` @ `a2a6d08ea` (v1.20.0) contains an entire GIN (GPU-Initiated Networking) / GDAKI subsystem that consumes it:

- `src/rdma/gin/nccl_ofi_gin_gdaki.cpp:153-155`:
  ```c
  		int ret = fi_open_ops(&ofi_domain->fid, FI_EFA_GDA_OPS, 0,
  				      reinterpret_cast<void **>(&gda_ops), nullptr);
  ```
- `src/rdma/gin/nccl_ofi_gin_gdaki.cpp:164` - `ret = gda_ops->query_qp_wqs(ctx->endpoint.ep, &sq_attr, &rq_attr);`
- `src/rdma/gin/nccl_ofi_gin_gdaki.cpp:171` - `ret = gda_ops->query_cq(ctx->endpoint.cq, &efa_cq_attr);`
- `src/rdma/gin/nccl_ofi_gin_gdaki_resources.cpp:183` - takes `struct fi_efa_ops_gda *gda_ops` as a parameter
- The in-file comment at `nccl_ofi_gin_gdaki.cpp:115-120` states the dependency explicitly: "On libfabric 2.4+ the proxy plugin selects the 'efa-direct' fabric ... That domain exposes FI_EFA_GDA_OPS."
- Step 3 comment at `:148-150`: "Open FI_EFA_GDA_OPS on the reused domain and query the SQ / RQ / CQ attributes needed to populate the GPU-resident QP / CQ descriptors."

Whole subsystem: `src/rdma/gin/` (7 files) and `include/rdma/gin/` (9 headers). It is exported as `extern ncclGin_v13_t nccl_ofi_gin_gdaki_plugin;` (`include/rdma/gin/nccl_ofi_gin_gdaki.h:16`) against NCCL's GIN v13 interface (`3rd-party/nccl/cuda/include/nccl/gin_v13.h`), and it is **opt-in by env var**: `src/rdma/gin/nccl_ofi_gin_api.cpp:103-113` switches on `ofi_nccl_gin_type` and logs "gin: GDAKI mode enabled (OFI_NCCL_GIN_TYPE=GDAKI)".

The original research's grep almost certainly missed `src/rdma/gin/` (it is a subdirectory, not top-level `src/*.cpp`).

### Corrected wording to publish

> GPUDirect Async is reachable on EFA, through the libfabric EFA provider's `efa-direct` fabric. `fi_open_ops(domain, FI_EFA_GDA_OPS, ...)` returns a `struct fi_efa_ops_gda` table (`ofiwg/libfabric` v2.6.0, `prov/efa/src/fi_ext_efa.h:11` and `:91`, populated at `prov/efa/src/efa_domain.c:868-874`), and the provider rejects the request on the `efa` fabric with `-FI_EOPNOTSUPP` and the log line "Only efa direct supports FI_EFA_GDA_OPS" (`efa_domain.c:888-895`). What that table exposes is queries, not a data path: the remote AH number, QPN and qkey; the send and receive work-queue buffers, doorbells, entry sizes and depths; the CQ buffer and doorbell; the MR local key; plus CQ and completion-counter opens that can be backed by external GPU memory. A GPU-side consumer uses those handles to build and ring WQEs from device code. `aws-ofi-nccl` v1.20.0 does consume this: its GIN / GDAKI subsystem (`src/rdma/gin/nccl_ofi_gin_gdaki.cpp:153`) opens `FI_EFA_GDA_OPS` on an efa-direct domain and calls `query_qp_wqs` and `query_cq` to populate GPU-resident QP and CQ descriptors, exported as an `ncclGin_v13_t` plugin and enabled with `OFI_NCCL_GIN_TYPE=GDAKI`.

---

## CLAIM 6 - Data Path Direct posts WQEs and polls CQs without rdma-core at all

### VERDICT: REFUTED as worded

The feature is real. The words "without rdma-core at all" are false, and the code says so in its own comments.

### 6a. The implementation calls rdma-core - DECISIVE

`ofiwg/libfabric` @ `v2.6.0` - `prov/efa/src/efa_data_path_direct.c`:

- Line 32: `#include <infiniband/efadv.h>`
- Lines 17 and 20-24 (file header comment):
  ```
   * - Integration with rdma-core's efadv query interfaces
  ...
   * The implementation leverages rdma-core's efadv (EFA device-specific)
   * interfaces to query hardware queue attributes and map hardware buffers
   * for direct access. This bypasses the standard libfabric completion
   * processing path to provide optimized performance for latency-sensitive
   * applications.
  ```
- Lines 81-83, inside `efa_data_path_direct_qp_initialize`:
  ```c
  	/* Query hardware work queue attributes from rdma-core */
  	ret = efadv_query_qp_wqs(efa_qp->ibv_qp, &sq_attr, &rq_attr,
  			 sizeof(rq_attr));
  ```
- Lines 185-187, inside `efa_data_path_direct_cq_initialize`:
  ```c
  	/* Query hardware completion queue attributes from rdma-core */
  	ret = efadv_query_cq(ibv_cq_ex_to_cq(ibv_cq->ibv_cq_ex), &attr,
  		     sizeof(attr));
  ```
- Lines 130-132: "This function does not unmap hardware buffers as those are managed by the underlying rdma-core library and will be cleaned up when the IBV queue pair is destroyed"
- Line 68 cross-references rdma-core's own implementation: "See also rdma-core/providers/efa/verbs.c: efa_setup_qp"

### 6b. It is compile-gated on rdma-core having those functions

`prov/efa/configure.m4:317-322`:

```
	AS_IF([test "$have_efadv_query_qp_wqs" = "1" -a "$have_efadv_query_cq" = "1"],
		[have_efa_data_path_direct=1],
		[have_efa_data_path_direct=0])
	AC_DEFINE_UNQUOTED([HAVE_EFA_DATA_PATH_DIRECT],
		[$have_efa_data_path_direct],
		[Indicates if data path direct is available (requires both QUERY_QP_WQS and QUERY_CQ)])
```

Data Path Direct is not merely compatible with rdma-core; it **requires a recent rdma-core** to exist at all.

### 6c. What it actually bypasses - the data-path verbs calls

`prov/efa/src/efa_data_path_ops.h` shows the dispatch. Each wrapper picks the direct implementation or falls back to libibverbs:

```c
216		if (qp->data_path_direct_enabled)
217			return efa_data_path_direct_post_recv(qp, wr, bad);
218	#endif
219		return ibv_post_recv(qp->ibv_qp, wr, bad);
```

```c
241		if (qp->data_path_direct_enabled)
242			return efa_data_path_direct_post_send(qp, sge_list, inline_data_list, data_count,
...
245		return efa_ibv_post_send(qp, sge_list, inline_data_list, data_count,
```

with the same pattern for `post_read` (`:267-268`), `post_write` (`:294-295`) and the entire CQ read family (`:306` through `:389`).

libfabric's **own env-var help text** states the scope correctly. `prov/efa/src/efa_env.c:244-248`:

```c
	fi_param_define(
		&efa_prov, "use_data_path_direct", FI_PARAM_BOOL,
		"Use the direct data path implementation that bypasses rdma-core on data path, including"
		"the CQ polling and TX/RX submissions, when it's available. Setting this variable as 0"
		"will disable this feature (Default: %d)",
		efa_env.use_data_path_direct);
```

"bypasses rdma-core **on data path**". Default is on: `efa_env.c:41` `.use_data_path_direct = true,`. Disable with `FI_EFA_USE_DATA_PATH_DIRECT=0`.

### 6d. Two additional gates the research does not mention

- **Auto-disabled on first-generation hardware.** `efa_data_path_direct.c:181` returns early if `!efa_env.use_data_path_direct || efa_device_use_sub_cq()`, and `prov/efa/src/efa_device.c:521-526`:
  ```c
  bool efa_device_use_sub_cq(void)
  {
  	uint32_t vendor_part_id;
  	vendor_part_id = g_efa_selected_device_list[0].ibv_attr.vendor_part_id;
  	return vendor_part_id == 0xefa0;
  }
  ```
  So Data Path Direct is off on `0xefa0` parts (the original c5n / p3dn generation).
- **Disabled on CQs with a wait object** when rdma-core lacks a doorbell field in `efadv_cq_attr`. `prov/efa/src/efa_cq.c:1091-1102`:
  ```c
  #if HAVE_EFA_DATA_PATH_DIRECT
  	#if HAVE_EFADV_CQ_ATTR_DB
  		efa_data_path_direct_cq_initialize(ibv_cq);
  	#else
  		if (attr->wait_obj == FI_WAIT_NONE) {
  			efa_data_path_direct_cq_initialize(ibv_cq);
  		} else {
  			ibv_cq->data_path_direct_enabled = false;
  			EFA_INFO(FI_LOG_CQ, "Direct CQ data path is not "
  					    "enabled with wait object.\n");
  		}
  ```

### Corrected wording to publish

> Data Path Direct moves WQE construction and CQE parsing out of rdma-core and into libfabric itself, for the data path only. When it is active, `fi_send` / `fi_read` / `fi_write` no longer call `ibv_post_send`, and completion processing no longer calls into libibverbs: libfabric writes the descriptor into the mapped send-queue buffer using the same `efa_io_defs.h` formats the kernel driver uses, rings the doorbell directly, and reads CQEs out of the mapped completion-queue buffer. The fallback path is one branch away in `prov/efa/src/efa_data_path_ops.h` (lines 216-219, 241-245, 267-268, 294-295 and the CQ readers at 306-389), which still call `ibv_post_recv` and friends when the feature is off. What it does not do is remove rdma-core. Setup goes through it: `efadv_query_qp_wqs` (`prov/efa/src/efa_data_path_direct.c:82`) and `efadv_query_cq` (`:186`) are the calls that hand libfabric the queue buffers, doorbells and entry sizes, the QP and CQ are still created through libibverbs, and rdma-core still owns and unmaps those buffers (`efa_data_path_direct.c:130-132`). The build gate makes the dependency explicit: `HAVE_EFA_DATA_PATH_DIRECT` is only set when rdma-core provides both `efadv_query_qp_wqs` and `efadv_query_cq` (`prov/efa/configure.m4:317-322`). It is on by default (`FI_EFA_USE_DATA_PATH_DIRECT`, `prov/efa/src/efa_env.c:41`), and turns itself off on first-generation `0xefa0` devices (`prov/efa/src/efa_device.c:521-526`).

---

## DOC-VERSUS-CODE CONTRADICTIONS FOUND

The project asked for these to be surfaced and published.

### CONTRA-1. `efa_fabric_comparison.md` overstates Data Path Direct; the code and the env help contradict it

- **In-repo doc**, `ofiwg/libfabric` v2.6.0, `prov/efa/docs/efa_fabric_comparison.md:281-282`:
  > "**Data Path Direct**: A recent improvement to implement the WQE post and CQ poll directly in Libfabric without rdma-core API. It is now enabled in both fabrics"
- **Code, same repo**, `prov/efa/src/efa_data_path_direct.c:32, 82, 186` calls `efadv_query_qp_wqs` and `efadv_query_cq`, both rdma-core APIs, and its own file comment (lines 20-24) says the implementation "leverages rdma-core's efadv ... interfaces".
- **Code, same repo**, `prov/efa/src/efa_env.c:245-246` says "bypasses rdma-core **on data path**, including the CQ polling and TX/RX submissions".

Resolution: the code wins. The comparison doc's unqualified "without rdma-core API" is wrong. 01-efa-core F-20 quotes the doc verbatim and inherits the error.

### CONTRA-2. `SRD.txt` still says send-only; the driver in the same repo has RDMA opcodes and device capability bits

- **In-repo doc**, `amzn/amzn-drivers`, `kernel/linux/efa/SRD.txt`:
  > "Currently only Send operation is supported, but nothing precludes RDMA operations support in future (with weak memory consistency)."
- **Code, same repo**: `efa_io_defs.h:23-34` (`EFA_IO_RDMA_READ = 1`, `EFA_IO_RDMA_WRITE = 2`), `efa_admin_cmds_defs.h:726-732` and `:1296`/`:1299` (device-reported `rdma_read` / `rdma_write` capability bits), `efa_data_verbs.c:354-372` (opcode encode), `RELEASENOTES.md` r2.4.0 "Add RDMA write support" and r3.3.0 "Add support for inline WRITE operation".

Resolution: `SRD.txt` is a stale 2019-era spec document. 01-efa-core already identifies this as C-2; independently confirmed. Anyone citing `SRD.txt` for "send-only" is citing an unmaintained file.

### CONTRA-3. The out-of-tree driver and the in-tree driver disagree about whether EFA has a kernel data path

- `amzn/amzn-drivers` `kernel/linux/efa/src/efa_main.c:551-558` registers `post_send`, `post_recv`, `poll_cq`, `req_notify_cq` (default-on).
- `torvalds/linux` `drivers/infiniband/hw/efa/efa_main.c:365-403` registers none of them, and there is no `efa_data_verbs.c` in that tree.
- The same divergence covers device IDs: amzn-drivers has `0xefa0` through `0xefa4` (`efa_main.c:27-31`); mainline has `0xefa0` through `0xefa3` only (`efa_main.c:16-19`).

Resolution: not a bug, a shipping-vehicle difference. Any statement about "the EFA kernel driver" needs to say which one.

### CONTRA-4. Research report versus code: the aws-ofi-nccl GDA scoping claim

- **01-efa-core F-29 / W-4**: "A repo-wide grep of `aws/aws-ofi-nccl` @ v1.20.0 for `FI_EFA_GDA` / `efa-direct` returns zero matches, so the NCCL plugin does not consume it."
- **Code**: `aws/aws-ofi-nccl` @ `a2a6d08ea`, `src/rdma/gin/nccl_ofi_gin_gdaki.cpp:153` calls `fi_open_ops(..., FI_EFA_GDA_OPS, ...)`; `:164` and `:171` call `query_qp_wqs` and `query_cq`; `src/rdma/gin/nccl_ofi_gin_gdaki_resources.cpp:183` takes `struct fi_efa_ops_gda *`.

Resolution: the research report's grep was incomplete. Do not publish the "not wired into the NCCL plugin today" line.

---

## MINOR PRECISION DEFECTS IN 01-efa-core.md

| Ref | Issue | Correction |
|---|---|---|
| F-13, W-2 | `efa_dev_ops` line range given as 549-558 | Actual range is `efa_main.c:551-558` (with `#endif` at 559) |
| F-13, W-2 | Only one registration site described | There is a second at `efa_main.c:680-687` (direct `dev->ibdev.*` assignment for kernels without `ib_set_device_ops`) |
| F-13 | Called "the `ib_device_ops` table" | The symbol is `efa_dev_ops`, declared `static const struct ib_device_ops` at `efa_main.c:460` |
| F-11 | Implies device-ID-to-EFA-version is documented | No source maps them; five IDs (`0xefa0`-`0xefa4`) against four documented EFA versions |
| F-41, W-6 | "Fixed tuner segfault ... a segfault is only reachable if the tuner is running" | Refuted. Commit `d204003` shows the crash was inside the bailout, from a null `ofi_log_function` |
| F-41 | "NCCL then applies the user's env-var filter on top of the tuner's cost table" | Reversed. NCCL marks cells `NCCL_ALGO_PROTO_IGNORE` first; the tuner skips them (`nccl_ofi_regions.cpp:2099-2101`) |
| F-41, W-6 | "no longer" framing | The v3 entry point has never had the check, back to at least v1.13.0-aws |
| F-29, W-4 | "zero grep hits for `FI_EFA_GDA` / `efa-direct` in the plugin" | False. See CONTRA-4 |
| F-20 | Quotes "without rdma-core API" as fact | In-repo doc contradicts in-repo code. See CONTRA-1 |
| F-10, F-53 | r3.3.0 presented as the current driver | r3.3.0 is master HEAD with no release tag; installer 1.49.0 ships 3.1.0. Also note there is no r3.2.0 in `RELEASENOTES.md` |

---

## THINGS I COULD NOT VERIFY

- **`aws-ofi-nccl` does not export `ncclTunerPlugin_v5`.** `grep -rn "ncclTunerPlugin_v5\|ncclTuner_v5_t" src include` at v1.20.0 returns nothing, although `3rd-party/nccl/cuda/include/nccl/tuner_v5.h` is vendored and NCCL 2.29.7-1 looks for `"ncclTunerPlugin_v5"`. Whether NCCL 2.29.x falls back to the v3 symbol was not traced. Flagging, not asserting.
- **Mainline Linux was read at `master`, not a pinned release tag.** The SHA is recorded (`2d2338c93`) but master moves; re-pin before publishing anything that depends on it.

---

## PROVENANCE

All repository claims above were read from local clones at the pinned SHAs in the table at the top of this file, not from web renderings. AWS documentation was fetched from `docs.aws.amazon.com` on 2026-08-01 and is labelled as secondary throughout; where AWS documentation and code disagree, code is treated as authoritative and the disagreement is recorded under DOC-VERSUS-CODE CONTRADICTIONS.
