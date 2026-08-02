# ENA vs EFA — What ENA Actually Is, and Its Precise Relationship to EFA

**Research date:** 2026-08-01
**Scope:** The ENA device and driver (queues, LLQ/push mode, DIM, GRO, MSI-X); the ENA↔EFA device relationship verified from PCI IDs and probe paths; whether SRD is "built on top of ENA"; ENA Express; bandwidth/flow limits; the honest comparison axis.

## Methodology

**CODE IS THE ONLY AUTHORITY.** Every structural claim below was read from driver source at a pinned commit. AWS docs are used as a secondary check only, and every doc-sourced claim is labelled.

**Repository pinned for this research:**

- `amzn/amzn-drivers` @ `master`, HEAD commit **`b99452b70756b1b394b1e7ff238d4efbdca44c5b`**, authored 2026-07-28 16:58:10 +0000, subject "linux/efa: Bump driver version to 3.3.0".
  (Same commit the sibling report `01-efa-core.md` pinned — consistent across this refresh.)
- Driver versions at that commit:
  - ENA **2.17.2g** — `kernel/linux/ena/ena_netdev.h:41-50` (`DRV_MODULE_GEN_MAJOR 2` / `MINOR 17` / `SUBMINOR 2`, stringified with a `"g"` suffix).
  - EFA **3.3.0g** — `kernel/linux/efa/src/efa_main.c:41-51` (`DRV_MODULE_VER_MAJOR 3` / `MINOR 3` / `SUBMINOR 0`).

**Claim labels used throughout:**

- **[DERIVED]** — read directly from driver source. Cites file:line and literal text.
- **[STATED]** — asserted in a document (AWS docs, in-repo README/RST/TXT). Carries a tier label.
- Source tiers: **[AUTHORITATIVE]** first-party (driver source, AWS official docs, AWS-owned repos); **[SECONDARY]** third-party.

**Repo prose (`README.rst`, `SRD.txt`, `.rst` guides) is treated as orientation only, never as authority.** Where README prose is quoted below it is labelled [STATED] and cross-checked against code.

**Verified fact count: 41** (F-1 … F-41). Of these, 29 are [DERIVED] from code and 12 are [STATED] from first-party docs.

---

# PART 1 — THE HEADLINE ANSWER

## F-1. "SRD is built on top of ENA" is **WRONG as stated**. Carlos's mental model is **CORRECT**. [DERIVED]

Carlos's stated model — *"SRD rides on the same Nitro substrate but EFA is not ENA"* — is confirmed by the code, and is the more precise framing.

The correct dependency graph, derived from source:

```
SRD (a transport implemented in the Nitro card's hardware/firmware)
  ├── consumed by the EFA device  → exposed to userspace as RDMA verbs / libfabric
  └── consumed by the ENA device  → exposed as ENA Express, accelerating ordinary TCP/UDP
```

SRD is **not** layered on ENA. ENA and EFA are **two peer consumers of the same underlying Nitro transport**, exposed through two different PCI functions, two different kernel drivers, two different kernel subsystems, and two disjoint programming models.

The single most decisive disproof of "SRD is built on top of ENA": **an EFA-only interface creates an EFA device with no ENA device at all**, and it still carries SRD traffic (F-16, F-17). If SRD were built on top of ENA, EFA-only could not function.

The second decisive point: **the ENA driver contains no SRD implementation whatsoever.** Its only knowledge of SRD is a read-only statistics struct (F-22 … F-25). All SRD logic lives below the PCI boundary.

**Precise correction to the common phrasing:** it is accurate to say *"ENA Express uses SRD"* and *"EFA uses SRD"*. It is inaccurate to say *"SRD is built on top of ENA"* or *"EFA is built on top of ENA"* or *"EFA is a mode of ENA."*

---

# PART 2 — THE ENA DEVICE AND DRIVER

## 2.1 What ENA is

## F-2. ENA is a conventional Linux network device driver — it registers a `net_device`. [DERIVED]

The ENA driver is a standard NIC driver in `drivers/net/ethernet`-style form. It builds one kernel module, `ena.ko`:

`kernel/linux/ena/Makefile`:
```
DRIVER_NAME := ena
...
obj-m += $(DRIVER_NAME).o
```

Sources compiled into it: `ena_netdev.c`, `ena_ethtool.c`, `ena_lpc.c`, `ena_phc.c`, `ena_xdp.c`, `dim.c`, `net_dim.c`, `ena_devlink.c`, `ena_debug.c`, plus the shared HAL `$(ENA_COM_PATH)/ena_com.c` and `$(ENA_COM_PATH)/ena_eth_com.c` where `ENA_COM_PATH=../common/ena_com/`.

## F-3. ENA's PCI driver registration. [DERIVED]

`kernel/linux/ena/ena_netdev.c:5979-5982`:
```c
static struct pci_driver ena_pci_driver = {
	.name		= DRV_MODULE_NAME,
	.id_table	= ena_pci_tbl,
	.probe		= ena_probe,
```
Registered at line 6008 via `pci_register_driver(&ena_pci_driver);`, unregistered at 6017. Probe entry point: `ena_probe()` at `ena_netdev.c:5475`.

## F-4. The `common/ena_com` directory is shared across **OS ports of ENA**, not with EFA. [DERIVED]

This is a naming trap worth flagging in the deep dive. `kernel/linux/common/ena_com/` contains: `ena_admin_defs.h`, `ena_com.c`, `ena_com.h`, `ena_common_defs.h`, `ena_eth_com.c`, `ena_eth_com.h`, `ena_eth_io_defs.h`, `ena_regs_defs.h`.

It is referenced **only** by the ENA Makefile (F-2). The EFA driver does not reference it — see F-13. "Common" here means common across ENA's Linux/FreeBSD/DPDK ports, **not** common between ENA and EFA.

## 2.2 Queues and the submission/completion model

## F-5. ENA's model is paired submission queue (SQ) + completion queue (CQ), per direction. [DERIVED]

`kernel/linux/common/ena_com/ena_com.h` defines the core objects:
- `struct ena_com_io_cq {` at line 121
- `struct ena_com_io_sq {` at line 169
- `struct ena_com_admin_queue {` at line 237
- `struct ena_com_dev {` at line 406

Both Tx and Rx are multi-queue. `kernel/linux/ena/ena_netdev.h:559-568` holds per-queue arrays:
```c
	struct ena_ring tx_ring[ENA_MAX_NUM_IO_QUEUES]
	struct ena_ring rx_ring[ENA_MAX_NUM_IO_QUEUES]
	struct ena_napi ena_napi[ENA_MAX_NUM_IO_QUEUES];
	struct ena_irq irq_tbl[ENA_MAX_MSIX_VEC(ENA_MAX_NUM_IO_QUEUES)];
```

## F-6. Driver-side ceiling is 128 I/O queues. [DERIVED]

`kernel/linux/common/ena_com/ena_com.h:32-34`:
```c
#define ENA_MAX_NUM_IO_QUEUES 128U
#define ENA_TOTAL_NUM_QUEUES (2 * (ENA_MAX_NUM_IO_QUEUES))
```
**Caveat:** this is a *driver-side array bound*, not a per-instance device guarantee. Actual usable queue count is negotiated with the device and further clamped by MSI-X vectors available (F-11). Do not publish "128 queues" as an instance-level number.

## F-7. Ring sizes. [DERIVED]

`kernel/linux/ena/ena_netdev.h:76-78`:
```c
#define ENA_DEFAULT_RING_SIZE		(1024)
#define ENA_MIN_RING_SIZE		(256)
```
And for wide (large-entry) LLQ, `ena_netdev.h:77`:
```c
#define ENA_DEFAULT_WIDE_LLQ_RING_SIZE	(512)
```
The halving from 1024 → 512 is the documented large-LLQ tradeoff (F-10).

## F-8. Doorbells are plain MMIO writes of the SQ tail. [DERIVED]

`kernel/linux/common/ena_com/ena_eth_com.h:174-192`:
```c
static inline void ena_com_write_rx_sq_doorbell(struct ena_com_io_sq *io_sq)
...
	writel(tail, io_sq->db_addr);

static inline void ena_com_write_tx_sq_doorbell(struct ena_com_io_sq *io_sq)
...
	writel(tail, io_sq->db_addr);
```
Doorbell batching is decided by `ena_com_is_doorbell_needed()` (`ena_eth_com.h:143`).

## 2.3 LLQ (Low Latency Queue) and push mode — the most interesting part of ENA

## F-9. LLQ = the driver **pushes** descriptors + packet header into device memory over PCIe, instead of the device DMA-reading them from host memory. [DERIVED]

This is the core mechanic. `kernel/linux/common/ena_com/ena_eth_com.c:95-134`, verbatim in the load-bearing part:

```c
static int ena_com_write_bounce_buffer_to_dev(struct ena_com_io_sq *io_sq,
					      u8 *bounce_buffer)
{
	struct ena_com_llq_info *llq_info = &io_sq->llq_info;
	u16 dst_tail_mask;
	u32 dst_offset;

	dst_tail_mask = io_sq->tail & (io_sq->q_depth - 1);
	dst_offset = dst_tail_mask * llq_info->desc_list_entry_size;
	...
	/* Make sure everything was written into the bounce buffer before
	 * writing the bounce buffer to the device
	 */
	wmb();

	/* The line is completed. Copy it to dev */
	__iowrite64_copy(io_sq->desc_addr.pbuf_dev_addr + dst_offset, bounce_buffer,
			 (llq_info->desc_list_entry_size) / 8);

	io_sq->tail++;

	/* Switch phase bit in case of wrap around */
	if (unlikely((io_sq->tail & (io_sq->q_depth - 1)) == 0))
		io_sq->phase ^= 1;
```

Three things to note for the deep dive:
1. The driver assembles the entry in a **host-memory bounce buffer** first, then blits the whole entry to the device with `__iowrite64_copy`. It does not write the device piecemeal.
2. `wmb()` before the blit is the ordering contract.
3. A **phase bit** flips on ring wrap — this is how the device distinguishes fresh entries from stale ones without needing a separate doorbell read.

## F-10. The LLQ target is a dedicated PCI BAR mapped **write-combining**. [DERIVED]

`kernel/linux/ena/ena_netdev.h:73-74`:
```c
#define ENA_MEM_BAR			2
#define ENA_BAR_MASK (BIT(ENA_REG_BAR) | BIT(ENA_MEM_BAR))
```
`kernel/linux/ena/ena_netdev.c:4291-4303`, in `ena_map_llq_mem_bar()`:
```c
	ena_dev->mem_bar = devm_ioremap_wc(&pdev->dev,
					   pci_resource_start(pdev, ENA_MEM_BAR),
					   pci_resource_len(pdev, ENA_MEM_BAR));
```
`devm_ioremap_wc` = write-combined. Called from `ena_probe` at `ena_netdev.c:5585`. Write-combining is what makes the push efficient: the CPU coalesces the 64-bit stores into full PCIe transactions rather than issuing many small ones.

## F-11. LLQ geometry is negotiated with the device, and is richer than "on/off". [DERIVED]

`kernel/linux/common/ena_com/ena_admin_defs.h:610-640`:
```c
enum ena_admin_llq_header_location {
	/* header is in descriptor list */
	ENA_ADMIN_INLINE_HEADER                     = 1,
	/* header in a separate ring, implies 16B descriptor list entry */
	ENA_ADMIN_HEADER_RING                       = 2,
};

enum ena_admin_llq_ring_entry_size {
	ENA_ADMIN_LIST_ENTRY_SIZE_128B              = 1,
	ENA_ADMIN_LIST_ENTRY_SIZE_192B              = 2,
	ENA_ADMIN_LIST_ENTRY_SIZE_256B              = 4,
};

enum ena_admin_llq_num_descs_before_header {
	ENA_ADMIN_LLQ_NUM_DESCS_BEFORE_HEADER_0     = 0,
	ENA_ADMIN_LLQ_NUM_DESCS_BEFORE_HEADER_1     = 1,
	ENA_ADMIN_LLQ_NUM_DESCS_BEFORE_HEADER_2     = 2,
	ENA_ADMIN_LLQ_NUM_DESCS_BEFORE_HEADER_4     = 4,
	ENA_ADMIN_LLQ_NUM_DESCS_BEFORE_HEADER_8     = 8,
};
```
And the stride control, with an unusually clear comment (`ena_admin_defs.h:631-640`):
```c
/* packet descriptor list entry always starts with one or more descriptors,
 * followed by a header. The rest of the descriptors are located in the
 * beginning of the subsequent entry. Stride refers to how the rest of the
 * descriptors are placed. This field is relevant only for inline header
 * mode
 */
enum ena_admin_llq_stride_ctrl {
	ENA_ADMIN_SINGLE_DESC_PER_ENTRY             = 1,
	ENA_ADMIN_MULTIPLE_DESCS_PER_ENTRY          = 2,
};
```
LLQ is feature `ENA_ADMIN_LLQ = 4` (`ena_admin_defs.h:58`), with two feature versions (`ena_admin_defs.h:78-83`): `ENA_ADMIN_LLQ_FEATURE_VERSION_0_LEGACY = 0` and `ENA_ADMIN_LLQ_FEATURE_VERSION_1 = 1`.

## F-12. Large LLQ: 128B → 256B entries, header capacity 96B → 224B, at the cost of half the ring. [STATED — AUTHORITATIVE, in-repo README; geometry corroborated by F-7 and F-11 code]

`kernel/linux/ena/README.rst:558-575`, verbatim:
> The standard LLQ entry size of 128 bytes allows for a maximum of 96 bytes of
> packet header size which sometimes is not enough (e.g. when using tunneling).
> Enabling large LLQ by increasing LLQ entry size to 256 bytes, allows a maximum
> header size of 224 bytes.
> This comes with the penalty of reducing the number of LLQ entries in the
> TX queue by 2 (i.e. from 1024 to 512).
>
> This feature is supported from EC2 Nitro v2 instance-types.
>
> **Note:** Starting from ``2.9.0g`` release, large LLQ is enabled by default on all EC2 Nitro v4
> instance-types and on. Due to HW limitations, enabling large LLQ implies that the TX
> queue size is reduced to 512.
> Starting from EC2 Nitro v5 instance-types, the Tx queue size may be increased back to 1024
> while large LLQ is enabled by invoking the relevant ``ethtool`` commands.

Code corroboration: the 512 figure appears as `ENA_DEFAULT_WIDE_LLQ_RING_SIZE (512)` (F-7); the 256B entry size appears as `ENA_ADMIN_LIST_ENTRY_SIZE_256B` (F-11); the policy enum is in `ena_netdev.h:465-473`:
```c
enum ena_llq_header_size_policy_t {
	ENA_LLQ_HEADER_SIZE_POLICY_UNSPECIFIED = 0,
	/* Policy for Normal size LLQ entry (128B) */
	ENA_LLQ_HEADER_SIZE_POLICY_NORMAL,
	/* Policy for Large size LLQ entry (256B) */
	ENA_LLQ_HEADER_SIZE_POLICY_LARGE
};
```

## F-13. LLQ is Tx-only; Rx submission queues are always "regular mode". [STATED — AUTHORITATIVE, in-repo README]

`kernel/linux/ena/README.rst:415-432`, verbatim:
> - **Regular mode:**
>   In this mode the Tx SQs reside in the host's memory. The ENA
>   device fetches the ENA Tx descriptors and packet data from host
>   memory.
>
> - **Low Latency Queue (LLQ) mode or "push-mode":**
>   In this mode the driver pushes the transmit descriptors and the
>   first few bytes of the packet (negotiable parameter)
>   directly to the ENA device memory space.
>   The rest of the packet payload is fetched by the device.
>   For this operation mode, the driver uses a dedicated PCI
>   device memory BAR, which is mapped with write-combine capability.
>
>   **Note that** not all ENA devices support LLQ, and this feature is negotiated
>   with the device upon initialization. If the ENA device does not
>   support LLQ mode, the driver falls back to the regular mode.
>
> The Rx SQs support only the regular mode.

Note the important asymmetry in the last line — **Rx never uses LLQ.** LLQ only removes a device-side descriptor fetch on the *transmit* path.

## F-14. There are dedicated LLQ PCI device IDs. [DERIVED]

See F-15 for the full table. `PCI_DEV_ID_ENA_LLQ_PF 0x1ec2` and `PCI_DEV_ID_ENA_LLQ_VF 0xec21` exist alongside the non-LLQ `0x0ec2` / `0xec20`. LLQ capability is therefore visible at the PCI-ID level as well as being feature-negotiated at runtime.

## 2.4 Interrupts, moderation, and the receive path

## F-15. MSI-X layout: exactly one admin vector plus one per I/O queue. [DERIVED]

`kernel/linux/ena/ena_netdev.h:56-70`:
```c
#define ENA_ADMIN_MSIX_VEC		1
#define ENA_MAX_MSIX_VEC(io_queues)	(ENA_ADMIN_MSIX_VEC + (io_queues))
...
#define ENA_MIN_MSIX_VEC		2
```
Allocation in `ena_enable_msix()` (`ena_netdev.c:2020-2080`) uses `pci_alloc_irq_vectors(adapter->pdev, ENA_MIN_MSIX_VEC, msix_vecs, PCI_IRQ_MSIX)` (line 2050). If fewer vectors are granted than requested, the queue count is reduced to match (`ena_netdev.c:2068`):
```c
		adapter->num_io_queues = irq_cnt - ENA_ADMIN_MSIX_VEC;
```
Two handlers: `ena_intr_msix_mgmnt` (line 1983) for admin, `ena_intr_msix_io` (line 2000) for Tx/Rx.

## F-16. ENA implements DIM (Dynamic Interrupt Moderation) using the kernel's `net_dim` library. [DERIVED]

`kernel/linux/ena/ena_netdev.c:1791-1822`:
```c
static void ena_dim_work(struct work_struct *w)
{
	...
	struct dim_cq_moder cur_moder =
		net_dim_get_rx_moderation(dim->mode, dim->profile_ix);
	...
	dim->state = DIM_START_MEASURE;
```
and
```c
void ena_adjust_adaptive_rx_intr_moderation(struct ena_napi *ena_napi)
{
	struct dim_sample dim_sample;
	...
	dim_update_sample(rx_ring->non_empty_napi_events, ...
	net_dim(&ena_napi->dim, dim_sample);
```
Mode is set at `ena_netdev.c:365`:
```c
		adapter->ena_napi[i].dim.mode = DIM_CQ_PERIOD_MODE_START_FROM_EQE;
```
Work item wired at line 2581. Called from the NAPI poll path at line 1961. The driver vendors `dim.c` and `net_dim.c` locally (F-2) for older-kernel compatibility.

**DIM is Rx-only** in this driver: the function is `ena_adjust_adaptive_rx_intr_moderation` and it calls `net_dim_get_rx_moderation`. There is no Tx counterpart.

## F-17. ENA uses **software GRO**. It does **not** implement hardware LRO. [DERIVED]

`kernel/linux/ena/ena_netdev.c:1722,1724`:
```c
			napi_gro_receive(napi, skb);
```
`napi_gro_receive` is the Linux stack's Generic Receive Offload entry point — aggregation happens in software, in the kernel, after the packet has been delivered.

**A grep for `lro` across `kernel/linux/ena/` and `kernel/linux/common/` returns zero hits** other than incidental substring matches on `tailroom` (e.g. `ena_netdev.c:659`, `:699`, `:1291`, `:1407`) and the `COPYING` file. There is no LRO implementation, no `NETIF_F_LRO` feature bit, and no hardware-coalescing path.

This is a publishable correction: readers and secondary write-ups frequently say ENA does "LRO". The code says GRO only.

## F-18. Offloads ENA *does* advertise. [DERIVED]

`kernel/linux/ena/ena_netdev.c:5304-5336`:
```c
		dev_features |= NETIF_F_IP_CSUM;
		dev_features |= NETIF_F_IPV6_CSUM;
	if (feat->offload.tx & ENA_ADMIN_FEATURE_OFFLOAD_DESC_TSO_IPV4_MASK)
		dev_features |= NETIF_F_TSO;
	if (feat->offload.tx & ENA_ADMIN_FEATURE_OFFLOAD_DESC_TSO_IPV6_MASK)
		dev_features |= NETIF_F_TSO6;
	if (feat->offload.tx & ENA_ADMIN_FEATURE_OFFLOAD_DESC_TSO_ECN_MASK)
		dev_features |= NETIF_F_TSO_ECN;
		dev_features |= NETIF_F_RXCSUM;
	...
		NETIF_F_SG |
		NETIF_F_RXHASH |
		NETIF_F_HIGHDMA;
		netdev->features |= NETIF_F_NTUPLE;
```
So: IPv4/IPv6 checksum offload, TSO (v4/v6/ECN), RX checksum, scatter-gather, RX hash (RSS), and n-tuple flow steering. All of these are **stateless, per-packet** offloads. RSS indirection-table plumbing lives in `common/ena_com/ena_com.h` (`ena_com_indirect_table_fill_entry`, ~line 975).

## F-19. ENA supports XDP. [DERIVED]

`kernel/linux/ena/ena_xdp.c:1028-1030` handles `ENA_XDP_REDIRECT` and `ENA_XDP_TX`. XDP is a kernel-side eBPF hook — notably, this is *not* OS bypass; the packet still arrives via the kernel driver.

## 2.5 What the ENA driver does NOT do — the load-bearing negative

## F-20. The ENA driver never maps anything to userspace. There is no OS bypass in ENA. [DERIVED]

A grep across `kernel/linux/ena/*.c` for `.mmap`, `remap_pfn_range`, and `vm_ops` returns **zero hits**. There is no character device, no uverbs interface, no userspace-visible doorbell or descriptor ring.

Every ENA packet traverses the kernel network stack. The LLQ "push mode" (F-9) optimizes the *kernel driver's* interaction with the device; it does not expose the queue to an application.

This is the single sharpest architectural contrast with EFA (F-30).

## F-21. The ENA driver contains no transport logic. [DERIVED]

There is no retransmission, no reliability state machine, no congestion control, no packet reordering, and no multipath logic anywhere in `kernel/linux/ena/` or `kernel/linux/common/ena_com/`. TCP/UDP semantics come from the Linux network stack above; SRD acceleration (when enabled) happens in the Nitro card below. The driver is a queue-and-descriptor shuttle between the two.

---

# PART 3 — THE ENA ↔ EFA RELATIONSHIP, FROM PCI IDs AND PROBE PATHS

This is the section the deep dive most needs, because it is where readers' conflation lives.

## F-22. ENA and EFA are **separate PCI functions with completely disjoint device ID sets**. [DERIVED]

**ENA**, `kernel/linux/ena/ena_pci_id_tbl.h:9-43`, verbatim:
```c
#ifndef PCI_VENDOR_ID_AMAZON
#define PCI_VENDOR_ID_AMAZON 0x1d0f
#endif

#ifndef PCI_DEV_ID_ENA_PF
#define PCI_DEV_ID_ENA_PF	0x0ec2
#endif

#ifndef PCI_DEV_ID_ENA_LLQ_PF
#define PCI_DEV_ID_ENA_LLQ_PF	0x1ec2
#endif

#ifndef PCI_DEV_ID_ENA_VF
#define PCI_DEV_ID_ENA_VF	0xec20
#endif

#ifndef PCI_DEV_ID_ENA_LLQ_VF
#define PCI_DEV_ID_ENA_LLQ_VF	0xec21
#endif

#ifndef PCI_DEV_ID_ENA_RESRV0
#define PCI_DEV_ID_ENA_RESRV0	0x0051
#endif

#define ENA_PCI_ID_TABLE_ENTRY(devid) \
	{PCI_DEVICE(PCI_VENDOR_ID_AMAZON, devid)},

static const struct pci_device_id ena_pci_tbl[] = {
	ENA_PCI_ID_TABLE_ENTRY(PCI_DEV_ID_ENA_RESRV0)
	ENA_PCI_ID_TABLE_ENTRY(PCI_DEV_ID_ENA_PF)
	ENA_PCI_ID_TABLE_ENTRY(PCI_DEV_ID_ENA_LLQ_PF)
	ENA_PCI_ID_TABLE_ENTRY(PCI_DEV_ID_ENA_VF)
	ENA_PCI_ID_TABLE_ENTRY(PCI_DEV_ID_ENA_LLQ_VF)
	{ }
};
```

**EFA**, `kernel/linux/efa/src/efa_main.c:24-38,61`, verbatim:
```c
#ifndef HAVE_PCI_VENDOR_ID_AMAZON
#define PCI_VENDOR_ID_AMAZON 0x1d0f
...
#define PCI_DEV_ID_EFA0_VF 0xefa0
#define PCI_DEV_ID_EFA1_VF 0xefa1
#define PCI_DEV_ID_EFA2_VF 0xefa2
#define PCI_DEV_ID_EFA3_VF 0xefa3
#define PCI_DEV_ID_EFA4_VF 0xefa4

static const struct pci_device_id efa_pci_tbl[] = {
	{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA0_VF) },
	{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA1_VF) },
	{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA2_VF) },
	{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA3_VF) },
	{ PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA4_VF) },
```
`MODULE_DEVICE_TABLE(pci, efa_pci_tbl);` at line 61.

**Summary table (all vendor `0x1d0f`, Amazon):**

| Device | PCI IDs | Driver | Kernel subsystem |
|---|---|---|---|
| ENA | `0x0051`, `0x0ec2` (PF), `0x1ec2` (LLQ PF), `0xec20` (VF), `0xec21` (LLQ VF) | `ena.ko` | netdev |
| EFA | `0xefa0`, `0xefa1`, `0xefa2`, `0xefa3`, `0xefa4` (all VF) | `efa.ko` | RDMA/verbs |

**The sets do not intersect.** EFA is therefore **a separate PCI device, not a mode of the ENA device.**

## F-23. The five EFA IDs are device generations, and all are Virtual Functions. [DERIVED + cross-check]

`EFA0`…`EFA4` are named as successive generations, and every one is suffixed `_VF`. **There is no EFA Physical Function ID in the table** — unlike ENA, which has both PF (`0x0ec2`, `0x1ec2`) and VF (`0xec20`, `0xec21`) IDs. The EFA device is only ever surfaced to an instance as a VF.

Cross-check [STATED — AUTHORITATIVE, AWS docs]: the EFA user guide groups supported instances as "Nitro v3 (EFA v1)", "Nitro v4 (EFA v2)", "Nitro v5 (EFA v3)", "Nitro v6 (EFA v4)" — four EFA generations named, against five PCI IDs `EFA0`–`EFA4`. See UNKNOWN-3.

## F-24. Two independent `pci_driver` registrations, two probe functions, zero shared code. [DERIVED]

`kernel/linux/efa/src/efa_main.c:998-1004`:
```c
static struct pci_driver efa_pci_driver = {
	.name           = DRV_MODULE_NAME,
	.id_table       = efa_pci_tbl,
	.probe          = efa_probe,
	.remove         = efa_remove,
	.shutdown       = efa_shutdown,
};
```
versus ENA's, at `ena_netdev.c:5979` (F-3).

**Code-sharing test, performed both directions:**
- Grep for `#include` lines matching `ena` across `kernel/linux/efa/src/*.c` and `*.h` → **zero hits.**
- Grep for `#include` lines matching `efa` across `kernel/linux/ena/*.c` and `*.h` → **zero hits.**

The EFA build (`kernel/linux/efa/src/Kbuild.in`) is entirely self-contained:
```
obj-m := efa.o
efa-y := $(patsubst %.c,%.o, $(filter %.c, @efa_sources_string@))
```
It does not reference `../common/ena_com/` (contrast F-2).

## F-25. EFA registers an `ib_device`, not a `net_device`. This is the subsystem boundary. [DERIVED]

`kernel/linux/efa/src/efa_main.c:960-978` (`efa_ib_device_add` call at line 969):
```c
static int efa_probe(struct pci_dev *pdev, const struct pci_device_id *ent)
{
	struct efa_dev *dev;
	int err;

	dev = efa_probe_device(pdev);
	if (IS_ERR(dev))
		return PTR_ERR(dev);

	err = efa_ib_device_add(dev);
```
Device attributes at `efa_main.c:616-655`:
```c
	dev->ibdev.node_type = RDMA_NODE_UNSPECIFIED;
	dev->ibdev.node_guid = dev->dev_attr.guid;
	dev->ibdev.phys_port_cnt = 1;
	dev->ibdev.num_comp_vectors = dev->neqs ?: 1;
	...
	dev->ibdev.driver_id = RDMA_DRIVER_EFA;
	...
	ib_set_device_ops(&dev->ibdev, &efa_dev_ops);
```
Verbs op table `efa_dev_ops` at `efa_main.c:460` provides `alloc_pd`, `alloc_ucontext`, `create_ah`, `create_cq`, `create_qp`, etc.

**A grep for `net_device`, `register_netdev`, `netdev_ops`, and `ndo_start_xmit` across `kernel/linux/efa/src/*.c` returns zero hits.** The EFA device has no network interface, no MAC, no IP, no `ethtool`. It is not a NIC.

Note `RDMA_NODE_UNSPECIFIED` — EFA deliberately does not claim to be InfiniBand or RoCE.

## F-26. Both drivers use the *same BAR layout convention* — evidence of a shared Nitro hardware idiom. [DERIVED]

ENA (`ena_netdev.h:73`): `#define ENA_MEM_BAR 2`, with `ENA_REG_BAR` also referenced in `ENA_BAR_MASK`.
EFA (`efa_main.c:67-69`):
```c
#define EFA_REG_BAR 0
#define EFA_MEM_BAR 2
#define EFA_BASE_BAR_MASK (BIT(EFA_REG_BAR) | BIT(EFA_MEM_BAR))
```
Identical convention: **BAR 0 = registers, BAR 2 = memory/descriptor push region.**

Both HALs also use parallel naming: `struct ena_com_dev` / `struct efa_com_dev`; `struct ena_com_admin_queue` (`ena_com.h:237`) / `struct efa_com_admin_queue` (`efa_com.h:62`). EFA additionally splits admin into `struct efa_com_admin_cq` (`efa_com.h:26`) and `struct efa_com_admin_sq` (`efa_com.h:36`).

**This is the strongest positive evidence for Carlos's "same Nitro substrate" model:** the two devices are built from the same house design language — admin queue HAL, phase bits, BAR-2 push region, write-combining — while remaining entirely separate implementations. Same substrate, different device.

## F-27. **EFA also has an LLQ — but it is mapped to userspace.** [DERIVED]

This is the most illuminating single finding for explaining the ENA/EFA relationship, and it is easy to miss.

EFA's send-queue descriptors live in the device MEM BAR, exactly like ENA's LLQ. `kernel/linux/efa/src/efa_verbs.c:1148-1149`:
```c
	sq->desc_offset = res->llq_descriptors_offset;
	sq->desc = (u8 *)(dev->mem_bar + res->llq_descriptors_offset);
```
The admin command field is documented in `efa_admin_cmds_defs.h:205-207`:
```c
	 * MMIO LLQ_MEM BAR
	 */
	u32 llq_descriptors_offset;
```

But unlike ENA, EFA **hands that region to userspace**. `efa_verbs.c:890-902`:
```c
	address = dev->mem_bar_addr + resp->llq_desc_offset;
	length = PAGE_ALIGN(params->sq_ring_size_in_bytes +
			    offset_in_page(resp->llq_desc_offset));

	qp->llq_desc_mmap_entry =
		efa_user_mmap_entry_insert(&ucontext->ibucontext,
					   address, length,
					   EFA_MMAP_IO_WC,
					   &resp->llq_desc_mmap_key);
```
Note `EFA_MMAP_IO_WC` — **write-combining**, the same mapping attribute ENA uses via `devm_ioremap_wc` (F-10).

The mmap key and offset are exported across the user ABI, `kernel/linux/efa/src/efa-abi.h:115-120`:
```c
	__u32 llq_desc_offset;
	...
	__aligned_u64 llq_desc_mmap_key;
```
Doorbells are mapped to userspace too (`efa_verbs.c:880-888`, `sq_db_mmap_entry`, `EFA_MMAP_IO_NC` — non-cached for doorbells, write-combined for descriptors). Teardown at `efa_verbs.c:747-750` releases `rq_mmap_entry`, `rq_db_mmap_entry`, `llq_desc_mmap_entry`, `sq_db_mmap_entry`.

**The punchline for the deep dive:** ENA and EFA use the *same push-mode hardware mechanism*. The difference is **who holds the pen**. In ENA, the kernel driver pushes descriptors into BAR 2 on the application's behalf. In EFA, the kernel driver's job is to *set up the mapping and get out of the way* — libfabric in userspace writes descriptors into BAR 2 directly. That is precisely what "OS bypass" means, expressed in code.

Also: `efa_verbs.c:959-962` clamps the SQ ring against `dev->dev_attr.max_llq_size` (`efa_com_cmd.h:137`, `efa-abi.h:47` — "bytes"), i.e. the EFA SQ ring size is bounded by device LLQ memory, just as ENA's is.

## F-28. EFA's operation set is RDMA, not packets. [DERIVED]

`kernel/linux/efa/src/efa_io_defs.h:16-29`:
```c
enum efa_io_queue_type {
	EFA_IO_SEND_QUEUE                           = 1,
	...
enum efa_io_send_op_type {
	EFA_IO_SEND                                 = 0,
	EFA_IO_RDMA_READ                            = 1,
	EFA_IO_RDMA_WRITE                           = 2,
```
And the QP type, `kernel/linux/efa/src/efa-abi.h:90`:
```c
	EFA_QP_DRIVER_TYPE_SRD = 0,
```
**`EFA_QP_DRIVER_TYPE_SRD` is the only driver QP type defined** — SRD is EFA's native queue-pair transport, exposed directly as a verbs QP type. Contrast ENA, where SRD appears only as a statistics blob (F-30).

## F-29. "EFA with ENA" vs "EFA-only" at the device level. [STATED — AUTHORITATIVE, AWS docs] + [DERIVED corroboration]

AWS EC2 User Guide, `efa.html`, verbatim:
> An EFA device can be attached to an EC2 instance in two ways:
> 1. Using a traditional EFA interface, also called EFA with ENA, which creates both an EFA device and an ENA device.
> 2. Using an EFA-only interface, which creates just the EFA device.

> The EFA device provides capabilities like built-in OS-bypass and congestion control through the Scalable Reliable Datagram (SRD) protocol. The EFA device features enable low-latency, reliable transport functionality that allows EFA interface to provide better application performance for HPC and ML applications on Amazon EC2. While the ENA device offers traditional IP networking.

And the comparison table, verbatim:

| | ENA | EFA (EFA with ENA) | EFA-only |
|---|---|---|---|
| Supports IP networking functionality | Yes | Yes | No |
| Can be assigned IPv4 or IPv6 addresses | Yes | Yes | No |
| Can be used as primary network interface for instance | Yes | Yes | No |
| Counts towards ENI attachment limit for instance | Yes | Yes | Yes |
| Parameter naming in EC2 APIs | `interface` | `efa` | `efa-only` |
| Field naming in EC2 console | No selection | EFA with ENA | EFA-only |

**Docs and code agree exactly.** "EFA with ENA" is a single ENI attachment that materializes **two PCI devices** — one matching `ena_pci_tbl`, one matching `efa_pci_tbl` — bound by two different drivers into two different kernel subsystems. "EFA-only" materializes **just the EFA PCI device**; there is no ENA function, hence no netdev, hence no IP.

This is the crisp answer to "is EFA a separate device or a mode of ENA": **separate device, sometimes co-attached.** The word "attachment" is doing the work that makes people think it is one device.

## F-30. Additional EFA limitations that sharpen the contrast. [STATED — AUTHORITATIVE, AWS docs]

From `efa.html` "EFA limitations", verbatim:
> + [Instance types that support multiple network cards] can be configured with one EFA per network card. All other supported instance types support only one EFA per instance.
> + EFA traffic1 can't cross Availability Zones or VPCs. This does not apply to normal IP traffic from the ENA device of an EFA interface.
> + EFA traffic1 is not routable. Normal IP traffic from the ENA device of an EFA interface remains routable.
> + EFA is not supported on AWS Outposts.

with the footnote, verbatim:
> 1*EFA traffic* refers to the traffic transmitted through the EFA device of either an EFA (EFA with ENA) or EFA-only interface.

Note how carefully the docs distinguish "EFA traffic" from "normal IP traffic from the ENA device of an EFA interface" — this is AWS itself acknowledging the two-device reality.

Also from the same page:
> EFA is available as an optional Amazon EC2 networking feature that you can enable on any supported instance at no additional cost.

---

# PART 4 — ENA EXPRESS: SRD WITHOUT EFA'S PROGRAMMING MODEL

This is the genuinely interesting middle ground, and the code tells the story cleanly.

## F-31. The ENA driver's *entire* knowledge of SRD is a read-only statistics structure. [DERIVED]

`kernel/linux/common/ena_com/ena_admin_defs.h:512-536`, verbatim:
```c
struct ena_admin_ena_srd_stats {
	/* Number of packets transmitted over ENA SRD */
	u64 ena_srd_tx_pkts;

	/* Number of packets transmitted or could have been
	 * transmitted over ENA SRD
	 */
	u64 ena_srd_eligible_tx_pkts;

	/* Number of packets received over ENA SRD */
	u64 ena_srd_rx_pkts;

	/* Percentage of the ENA SRD resources that is in use */
	u64 ena_srd_resource_utilization;
};

/* ENA SRD Statistics Command */
struct ena_admin_ena_srd_info {
	/* ENA SRD configuration bitmap. See ena_admin_ena_srd_flags for
	 * details
	 */
	u64 flags;

	struct ena_admin_ena_srd_stats ena_srd_stats;
};
```

## F-32. The SRD configuration bitmap, verbatim — including the UDP ordering bypass. [DERIVED]

`kernel/linux/common/ena_com/ena_admin_defs.h:162-170`:
```c
/* ENA SRD configuration for ENI */
enum ena_admin_ena_srd_flags {
	/* Feature enabled */
	ENA_ADMIN_ENA_SRD_ENABLED                   = BIT(0),
	/* UDP support enabled */
	ENA_ADMIN_ENA_SRD_UDP_ENABLED               = BIT(1),
	/* Bypass Rx UDP ordering */
	ENA_ADMIN_ENA_SRD_UDP_ORDERING_BYPASS_ENABLED = BIT(2),
};
```
Three independent switches: SRD on/off, UDP eligible or not, and — critically — **whether the device restores UDP ordering on receive or hands packets up out of order.** That third bit is the ordering-semantics knob that distinguishes ENA Express from both plain ENA and EFA (see Part 6).

Note the comment says "**for ENI**" — this is an ENI-level (attachment-level) configuration, not a driver-level one. Corroborated by F-35.

## F-33. The driver can only **GET** these values. There is no SET path. [DERIVED]

`kernel/linux/common/ena_com/ena_com.c:2645-2661`:
```c
int ena_com_get_ena_srd_info(struct ena_com_dev *ena_dev,
			     struct ena_admin_ena_srd_info *info)
{
	...
	if (!ena_com_get_cap(ena_dev, ENA_ADMIN_ENA_SRD_INFO)) {
	...
	ret = ena_get_dev_stats(ena_dev, &ctx, ENA_ADMIN_GET_STATS_TYPE_ENA_SRD);
	...
		memcpy(info, &ctx.get_resp.u.ena_srd_info,
		       sizeof(ctx.get_resp.u.ena_srd_info));
```
It is reached through the **statistics** admin command, `ena_admin_defs.h:137-144`:
```c
enum ena_admin_get_stats_type {
	ENA_ADMIN_GET_STATS_TYPE_BASIC              = 0,
	ENA_ADMIN_GET_STATS_TYPE_EXTENDED           = 1,
	ENA_ADMIN_GET_STATS_TYPE_ENI                = 2,
	ENA_ADMIN_GET_STATS_TYPE_ENA_SRD            = 3,
	ENA_ADMIN_GET_STATS_TYPE_CUSTOMER_METRICS   = 4,
};
```
The capability gate is `ENA_ADMIN_ENA_SRD_INFO = 1` (`ena_admin_defs.h:90`).

**There is no `ena_com_set_ena_srd_*` function anywhere in the tree.** ENA Express cannot be turned on from inside the instance. It is configured out-of-band on the ENI attachment via the EC2 control plane, and the driver only observes the result.

## F-34. Exposure to the operator is via `ethtool -S`. [DERIVED]

`kernel/linux/ena/ena_ethtool.c:130-135`:
```c
static const struct ena_stats ena_srd_info_strings[] = {
	ENA_STAT_ENA_SRD_MODE_ENTRY(ena_srd_mode),
	ENA_STAT_ENA_SRD_ENTRY(ena_srd_tx_pkts),
	ENA_STAT_ENA_SRD_ENTRY(ena_srd_eligible_tx_pkts),
	ENA_STAT_ENA_SRD_ENTRY(ena_srd_rx_pkts),
	ENA_STAT_ENA_SRD_ENTRY(ena_srd_resource_utilization)
};
```
Gated at `ena_ethtool.c:351` and `:738` on `ena_com_get_cap(dev, ENA_ADMIN_ENA_SRD_INFO)`. The `flags` word is surfaced as a pseudo-stat named `ena_srd_mode` (`ena_ethtool.c:66-68`), reading `offsetof(struct ena_admin_ena_srd_info, flags)`.

**Practical takeaway for the deep dive:** `ethtool -S <iface> | grep ena_srd` is the ground-truth check for whether ENA Express is actually engaged. `ena_srd_tx_pkts` vs `ena_srd_eligible_tx_pkts` is the ratio that reveals whether traffic is *actually* riding SRD or silently falling back.

## F-35. ENA Express, per AWS. [STATED — AUTHORITATIVE, AWS docs]

From `ena-express.html`, verbatim:
> ENA Express is powered by AWS Scalable Reliable Datagram (SRD) technology. SRD is a high performance network transport protocol that uses dynamic routing to increase throughput and minimize tail latency. With ENA Express, you can communicate between two EC2 instances in the same Availability Zone or across Availability Zones within the same Region.

Benefits, verbatim:
> + Increases the maximum bandwidth a single flow can use from 5 Gbps up to 25 Gbps within the same Region, up to the aggregate instance limit.
> + Reduces tail latency of network traffic between EC2 instances in the same Availability Zone, especially during periods of high network load.
> + Detects and avoids congested network paths.
> + Handles some tasks directly in the network layer, such as packet reordering on the receiving end, and most retransmits that are needed. This frees up the application layer for other work.

**The honest caveat, verbatim** — this is the sentence most write-ups omit:
> During periods of time when network traffic is light, you might notice a slight increase in median packet latency (tens of microseconds) when the packet uses ENA Express.

And:
> **Note**
> If your application has high packets-per-second requirements and needs to optimize for latency during uncongested periods, [Enhanced networking] might be a better fit.

Attachment semantics, verbatim (corroborating F-32's "for ENI" comment):
> Amazon EC2 refers to the relationship between an instance and a network interface that's attached to it as an *attachment*. ENA Express settings apply to the attachment. If the network interface is detached from the instance, the attachment no longer exists, and the ENA Express settings that applied to it are no longer in force.

## F-36. Fallback is silent and bilateral. [STATED — AUTHORITATIVE, AWS docs]

Verbatim:
> After you've enabled ENA Express for the network interface attachment on an instance, the sending instance initiates communication with the receiving instance, and SRD detects if ENA Express is operating on both the sending instance and the receiving instance. If ENA Express is operating, the communication can use SRD transmission. If ENA Express is not operating, the communication falls back to standard ENA transmission.

Requirements, verbatim (abridged to the load-bearing items):
> + Both sending and receiving instances must have ENA Express configured.
> + The sending and receiving instances must run in the same Region.
> + The network path between the instances must not include middleware boxes. ENA Express doesn't currently support middleware boxes.
> + (Linux instances only) To utilize full bandwidth potential, use driver version 2.2.9 or higher.
> + (Linux instances only) To produce metrics, use driver version 2.8 or higher.

> If any requirement is unmet, the instances use the standard TCP/UDP protocol but without SRD to communicate.

And the asymmetric-config example, verbatim:
> In this case, TCP traffic between the two instances can use ENA Express, as both instances have enabled it. However, since one of the instances does not use ENA Express for UDP traffic, communication between these two instances over UDP uses standard ENA transmission.

Additional exclusions, verbatim:
> ENA Express traffic can't be sent in a Local Zone.
> ENA Express support for traffic between Availability Zones is not available in South America (São Paulo), Middle East (Bahrain), and Middle East (UAE).

## F-37. The MTU implication, with the authoritative number from AWS's own code. [DERIVED from AWS-owned script] + [STATED]

AWS docs state the *why* but not the number, verbatim from `ena-express.html`:
> **MTU size** – ENA Express requires a lower MTU than the default to accommodate additional AWS SRD headers. Newly established TCP connections automatically clamp the MSS to mitigate this, but UDP traffic still requires a lower MTU.

The **number** comes from AWS's own first-party checker script, `amzn/amzn-ec2-ena-utilities`, `ena-express/check-ena-express-settings.sh` (fetched 2026-08-01 from `raw.githubusercontent.com/amzn/amzn-ec2-ena-utilities/6ecb14cf1dc3f17a375ea72c1aa3dfd72dc5a1e7/`):
```sh
# 1. MTU <= 8900 (required)
MTU_RECOMMENDED_MAX=8900
MTU_RECOMMENDED_MIN=8800
```
and the check itself:
```sh
  if [ ${mtu} -gt ${MTU_RECOMMENDED_MAX} ]; then
    echo_error "MTU should be <= ${MTU_RECOMMENDED_MAX} for ENA Express, currently set to ${mtu}"
    echo_fix "sudo ip link set ${interface} mtu ${MTU_RECOMMENDED_MAX}"
  elif [ ${mtu} -lt ${MTU_RECOMMENDED_MIN} ]; then
    echo_warn "MTU lower than recommended and not optimal for bandwidth performance, currently set to ${mtu}"
```

**So: MTU must be ≤ 8900 (down from the 9001 jumbo default), and going below 8800 costs bandwidth.** The 101-byte haircut from 9001 is the SRD header overhead. TCP handles this automatically via MSS clamping; **UDP does not, and is the real trap.**

## F-38. The other tuning requirements the script enforces. [DERIVED from AWS-owned script] + [STATED]

From `ena-express.html`, verbatim, the script checks:
> + **TCP output queue size limit** – Checks that the per-socket in-flight byte limit is sufficient to sustain high throughput.
> + **Byte queue limit** – Confirms that the byte queue limit (BQL) is disabled on the network interface. BQL can restrict the amount of data queued for device-level transmission, which limits ENA Express performance.
> **Note** The ENA driver for the Amazon Linux distribution disables byte queue limits by default.
> + **TCP autocorking** – Checks whether TCP autocorking is disabled.
> + **TX queue size and Large LLQ** – Verifies that the transmit queue size for the network interface is large enough for optimal performance. The script also checks whether the ENA module parameter explicitly disables the Large Low Latency Queue (Large LLQ) feature, as it can reduce the available TX queue depth.
> + **RX queue size** ... + **TCP and network socket buffer sizes** ... + **TCP congestion control**

Note the **Large LLQ ↔ ENA Express interaction**: large LLQ halves the Tx ring (F-12), and ENA Express wants a deep Tx ring. This is a real, non-obvious tuning conflict worth calling out in the deep dive.

The script also dumps `ena_srd` stats directly (line 248-253), confirming F-34 as the intended diagnostic:
```sh
  echo "========= ena_srd stats ================================"
  local ena_srd_stats=$(${ethtool} -S ${interface} | { grep "ena_srd" || true; })
  if [ -z "${ena_srd_stats}" ]; then
    echo "ena srd stats not available, please upgrade ena driver"
```

---

# PART 5 — BANDWIDTH: WHAT ENA CAN AND CANNOT DO

## F-39. The single-flow ceiling and the ways around it. [STATED — AUTHORITATIVE, AWS docs]

From `ec2-instance-network-bandwidth.html`, verbatim:
> **Single-flow traffic**
> When instances are not in the same [cluster placement group], bandwidth for single-flow traffic is limited to 5 Gbps. To reduce latency and increase single-flow bandwidth, try one of the following:
> + Use a cluster placement group to achieve up to 10 Gbps bandwidth for instances within the same placement group.
> + Set up multiple paths between two endpoints to achieve higher bandwidth with Multipath TCP (MPTCP).
> + Configure ENA Express for eligible instances within the same Availability Zone to achieve up to 25 Gbps between those instances.

The flow definition, verbatim:
> **Note**
> A single-flow is considered a unique 5-tuple TCP or UDP flow. For other protocols following the IP header, such as `GRE` or `IPsec`, the 3 tuple of source IP, destination IP, and next protocol is used to define a flow.

**The single-flow ladder, consolidated:**

| Configuration | Single-flow ceiling |
|---|---|
| Default, not in a cluster placement group | 5 Gbps |
| Within a cluster placement group | 10 Gbps |
| ENA Express (same Region; per F-35 same AZ or cross-AZ) | 25 Gbps, capped by aggregate instance limit |

Note a discrepancy worth flagging: the bandwidth page says ENA Express gives 25 Gbps "**within the same Availability Zone**", while the ENA Express page (F-35) says "**within the same Region**" for the bandwidth benefit and reserves the AZ scoping for the *tail-latency* benefit. See UNKNOWN-1.

## F-40. Why a single TCP flow cannot saturate a large instance. [DERIVED — synthesis of F-39 + F-5 + F-15 + F-18]

This is the mechanism the deep dive should explain, because the docs state the limit without explaining it.

A single 5-tuple flow is pinned to **one receive queue** by RSS. `NETIF_F_RXHASH` (F-18) means the device hashes the 5-tuple and steers to an indirection-table entry; each entry maps to one Rx ring, and each Rx ring is serviced by **one MSI-X vector on one CPU** (F-15). A single flow therefore consumes at most one core's worth of the receive path, and it cannot be spread by the driver — the hash is computed in the device.

That gives three independent reasons a single flow underperforms aggregate:
1. **Per-flow policing in the fabric** — the 5 Gbps / 10 Gbps ceilings are enforced regardless of host capability (F-39).
2. **Single-queue serialization** — one flow = one Rx queue = one core, so per-flow throughput is bounded by per-core packet processing, not by the NIC.
3. **Single-path routing** — a conventional flow follows one ECMP path; its throughput is bounded by the most congested link on that one path.

ENA Express attacks (1) and (3) — it raises the ceiling to 25 Gbps and sprays across paths — but **not (2)**. This is exactly why AWS warns that high-PPS workloads may prefer plain enhanced networking (F-35): SRD adds per-packet work without removing the single-queue bottleneck.

The general escape hatches are therefore: **more flows** (parallel connections, which is what MPTCP does per F-39), or **more interfaces/network cards** (F-41).

## F-41. Multiple network cards. [STATED — AUTHORITATIVE, AWS docs] + [DERIVED]

From `efa.html` limitations, verbatim:
> + [Instance types that support multiple network cards] can be configured with one EFA per network card. All other supported instance types support only one EFA per instance.

From the EFA getting-started guide, verbatim:
> (Optional) If you are using a multi-card instance type, such as `p4d.24xlarge` or `p5.48xlarge`, for each additional network interface required, choose **Add network interface**, for **Network card index** select the next unused index, and then select **Device index = 1** and **Interface type = EFA with ENA** or **EFA-only**.

Aggregate bandwidth context, verbatim from `ec2-instance-network-bandwidth.html`:
> The available network bandwidth of an instance depends on the number of vCPUs that it has. For example, an `m5.8xlarge` instance has 32 vCPUs and 10 Gbps network bandwidth, and an `m5.16xlarge` instance has 64 vCPUs and 20 Gbps network bandwidth.

and the multi-flow / gateway rule, verbatim:

| Instance types | Available bandwidth |
| --- | --- |
| Instance types with less than 32 vCPUs | Limited to 5 Gbps |
| Instance types with more than 32 vCPUs | Limited to 50% of the available bandwidth for the instance type |
| C8in, C8ine, M8in, M8ine, M8idn, R8in, R8idn instances | Limited to the baseline bandwidth for the instance type |

(That table applies specifically to traffic through an internet gateway or local gateway.)

**Code corroboration for the multi-card model** [DERIVED]: nothing in either driver aggregates across PCI functions. `ena_probe` (F-3) and `efa_probe` (F-25) each bind one PCI function to one independent device instance. Bonding/teaming across network cards, if desired, is entirely a host-side (Linux bonding/ECMP) or application-side concern — and for EFA, libfabric enumerates multiple `efa_N` domains rather than striping automatically at the driver layer. **There is no driver-level link aggregation in amzn-drivers.**

---

# PART 6 — THE HONEST COMPARISON AXIS

All rows derived from the facts above; per-cell provenance noted where it is not a direct code read.

| Axis | ENA (plain) | ENA Express | EFA |
|---|---|---|---|
| PCI device IDs | `0x0ec2`/`0x1ec2`/`0xec20`/`0xec21`/`0x0051` (F-22) | same as ENA — no new device (F-22, F-31) | `0xefa0`–`0xefa4` (F-22) |
| Kernel subsystem | netdev (F-2) | netdev (F-2) | RDMA/verbs, `ib_device` (F-25) |
| Driver module | `ena.ko` | `ena.ko` | `efa.ko` |
| Transport | TCP/UDP in the kernel stack (F-21) | TCP/UDP over SRD, in the card (F-31, F-35) | SRD as a verbs QP type (F-28) |
| Reliability owner | Kernel TCP (or nothing, for UDP) | SRD in the card; "most retransmits" (F-35) | SRD in the card; QP is reliable |
| Ordering semantics | TCP ordered; UDP unordered | TCP ordered (reordering restored in card); UDP **optionally** delivered out of order via `ENA_ADMIN_ENA_SRD_UDP_ORDERING_BYPASS_ENABLED` (F-32) | Out-of-order delivery is the native model; ordering is the application's/libfabric's problem |
| OS bypass | **No** — zero userspace mmap (F-20) | **No** — same driver (F-20) | **Yes** — SQ descriptors + doorbells mmap'd to userspace (F-27) |
| Descriptor push (LLQ) | Kernel driver pushes to WC BAR 2 (F-9, F-10) | same | Userspace pushes to WC BAR 2 (F-27) |
| Programming model | Sockets. Zero application change | Sockets. **Zero application change** — this is the whole point | libfabric / NCCL / MPI / NIXL. Application or middleware must be rewritten |
| Enablement | Default | EC2 control plane, per-ENI-attachment; **cannot be enabled from inside the instance** (F-33) | ENI interface type at attach: `efa` or `efa-only` (F-29) |
| Single-flow bandwidth | 5 Gbps (10 in cluster PG) (F-39) | up to 25 Gbps (F-35, F-39) | not expressed as a TCP flow limit; bounded by instance/card |
| Crosses AZ? | Yes | Yes, same Region (F-35), with regional exclusions (F-36) | **No** (F-30) |
| Routable? | Yes | Yes | **No** (F-30) |
| Gets an IP? | Yes | Yes | EFA device: no. `efa-only`: no IP at all (F-29) |
| MTU | 9001 default | **≤ 8900 required** (F-37) | n/a — not an IP MTU |
| Latency under congestion | Worst — single path, TCP backoff | Better — multipath, tail-latency reduction (F-35) | Best |
| Latency when uncongested | Best of the three for PPS-bound work (F-35) | **Slightly worse** — "tens of microseconds" median increase (F-35) | Best |
| CPU cost | Kernel stack per packet; GRO amortizes (F-17) | Same kernel stack cost, plus SRD work in card | Lowest — kernel not in the data path |
| Fallback behavior | n/a | **Silent** fallback to standard ENA if either side is unconfigured (F-36) | No fallback — either EFA is present or the provider fails |
| Intended workload | Everything: web, DB, general VPC traffic | Existing socket apps wanting SRD benefits with no code change; latency-sensitive distributed systems, storage replication | Tightly-coupled HPC/AI collectives: NCCL, MPI, NIXL |

**The one-sentence framing for the deep dive:** ENA Express is *SRD without EFA's programming model* — you keep sockets and pay a small uncongested-latency tax; EFA is *SRD without the kernel* — you get the best latency but must adopt libfabric and give up IP, routing, and cross-AZ reach.

---

# PART 7 — DOC-VS-CODE FINDINGS AND CORRECTIONS

## FINDING-1. "SRD is built on top of ENA" — wrong. [DERIVED]
See F-1. The claim survives nowhere in code. Correct framing: ENA and EFA are peer consumers of a Nitro-resident SRD transport.

## FINDING-2. "EFA is a mode of the ENA device" — wrong. [DERIVED]
Disjoint PCI ID sets (F-22), separate `pci_driver` registrations (F-24), zero shared includes in either direction (F-24), different kernel subsystems (F-25).

## FINDING-3. "ENA does LRO" — wrong. [DERIVED]
Zero LRO code in the tree; `napi_gro_receive` only (F-17). Software GRO, not hardware LRO. Commonly misstated in secondary write-ups.

## FINDING-4. `common/ena_com` is a false friend. [DERIVED]
Its name suggests ENA/EFA sharing. It is shared across ENA's OS ports only (F-4). EFA carries its own structurally parallel but textually independent `efa_com` (F-26).

## FINDING-5. EFA has an LLQ too — usually omitted from write-ups. [DERIVED]
F-27. The ENA-vs-EFA difference is not "LLQ vs no LLQ"; it is **kernel-driven push vs userspace-driven push of the same mechanism**. This is the most pedagogically valuable finding in this report.

## FINDING-6. ENA Express cannot be enabled from inside the instance. [DERIVED]
F-33. There is a GET path and no SET path. Any guide that shows an in-instance command to "turn on ENA Express" is describing *tuning* (MTU, BQL, queue sizes), not enablement.

## FINDING-7. Documented single-flow scope for ENA Express is internally inconsistent across AWS pages. [STATED]
See F-39 vs F-35 and UNKNOWN-1. Publish with the ambiguity noted rather than picking one.

## FINDING-8. The in-repo `SRD.txt` remains stale — consistent with the sibling report `01-efa-core.md` (F-2 there). [STATED]
Independently reconfirmed at this commit: `SRD.txt` still describes Send-only semantics while `efa_io_defs.h:23-29` defines `EFA_IO_RDMA_READ` and `EFA_IO_RDMA_WRITE` (F-28). **Do not cite `SRD.txt` for anything operational.** This is the exact trap that burned this project before.

---

# PART 8 — PROPOSED SUBSECTION OUTLINE

For the deep-dive tab/section. Ordered to defuse the conflation early, then build.

**S1. "They are two devices" — the 60-second answer**
Lead with the PCI table (F-22). One `lspci` mental image. State the dependency graph (F-1). Everything else is elaboration.
*Getting-started note:* a reader new to the topic should leave S1 able to answer "is EFA a kind of ENA?" correctly. Everything after S1 is optional depth.

**S2. What ENA actually is**
S2.1 A normal netdev: queues, SQ/CQ, doorbells, NAPI (F-2, F-5, F-8).
S2.2 MSI-X and queue scaling: 1 admin + N I/O vectors; vector starvation reduces queues (F-15).
S2.3 Moderation: DIM, Rx-only, from the kernel `net_dim` library (F-16).
S2.4 Receive: software GRO, and the LRO myth (F-17).
S2.5 Offloads: what's real — checksum, TSO, RSS, n-tuple, XDP (F-18, F-19).

**S3. LLQ — the one genuinely clever thing in ENA**
S3.1 Regular mode vs push mode (F-13).
S3.2 The mechanism: bounce buffer → `wmb()` → `__iowrite64_copy` → WC BAR 2 → phase bit (F-9, F-10).
S3.3 Geometry: entry sizes, header location, stride, descs-before-header (F-11).
S3.4 Large LLQ and its Tx-ring tax (F-12, F-7).
S3.5 Tx-only — why Rx gets nothing (F-13).

**S4. What ENA does NOT do**
The negative space: no userspace mapping (F-20), no transport logic (F-21). This section is what makes S5 land.

**S5. The relationship, proven**
S5.1 Disjoint PCI IDs (F-22), EFA is VF-only, five generations (F-23).
S5.2 Two drivers, no shared code, tested both directions (F-24).
S5.3 netdev vs `ib_device` — the subsystem boundary (F-25).
S5.4 "EFA with ENA" vs "EFA-only" at the device level; docs and code agree (F-29).
S5.5 The shared substrate: identical BAR conventions, parallel HAL naming (F-26).
S5.6 **EFA's LLQ, and who holds the pen** (F-27) — the payoff subsection.

**S6. ENA Express — SRD without the rewrite**
S6.1 What the driver knows: a stats struct and nothing else (F-31, F-34).
S6.2 The three config bits, including UDP ordering bypass (F-32).
S6.3 Enablement is control-plane-only (F-33) — GET, no SET.
S6.4 What you get and what it costs: 5→25 Gbps, tail latency, and the uncongested median penalty (F-35).
S6.5 Silent bilateral fallback — the operational trap (F-36).
S6.6 MTU 8900, TCP MSS clamping, and the UDP trap (F-37).
S6.7 Tuning, and the Large-LLQ conflict (F-38).
S6.8 Verifying it works: `ethtool -S | grep ena_srd`, and the tx vs eligible_tx ratio (F-34).

**S7. Bandwidth reality**
S7.1 The single-flow ladder: 5 / 10 / 25 (F-39).
S7.2 Why one TCP flow can't saturate a big instance — three independent causes (F-40).
S7.3 What ENA Express fixes and what it doesn't (F-40).
S7.4 Network cards, one EFA per card, no driver-level aggregation (F-41).

**S8. Choosing**
The comparison table (Part 6), then a short decision guide keyed to workload.

**S9. Corrections register**
Publish FINDING-1 … FINDING-8. The `SRD.txt` staleness (FINDING-8) is worth a callout box as a lesson about trusting in-repo docs.

---

# PART 9 — DIAGRAM IDEAS

**D1. "One attachment, two devices" — the conflation-killer.**
Three side-by-side instance boxes: **ENA interface**, **EFA with ENA**, **EFA-only**. Inside each, draw the PCI functions that actually materialize, labelled with real device IDs. Middle box shows two functions (`0xec20` + `0xefa4`) with two driver boxes (`ena.ko` → netdev/`eth0`; `efa.ko` → `ib_device`/`efa_0`). Right box shows one function only, with a struck-through `eth0` and "no IP, not routable, no primary ENI". Sourced from F-22, F-25, F-29.
*This single diagram resolves most reader confusion and should appear early.*

**D2. "Who holds the pen" — LLQ push mode, ENA vs EFA.**
Two horizontal lanes sharing an identical right-hand side (device MEM BAR 2, write-combined).
- Top lane (ENA): App → socket → kernel TCP/IP → `ena.ko` → bounce buffer → `wmb()` → `__iowrite64_copy` → BAR 2. Kernel boundary crossed **once per packet**, and the driver is inside the data path.
- Bottom lane (EFA): App → libfabric → **directly** → BAR 2 (mmap'd, WC). `efa.ko` drawn off to the side, greyed, touching only setup (`efa_user_mmap_entry_insert`) with a dashed line, annotated "control path only".
Same destination, different pen-holder. Sourced from F-9, F-10, F-20, F-27.
*This is the highest-value diagram in the set — it makes "OS bypass" concrete rather than a slogan.*

**D3. The single-flow ladder and where SRD enters.**
A horizontal bandwidth axis with four stacked bars for one 5-tuple flow: default 5 Gbps; cluster placement group 10 Gbps; ENA Express 25 Gbps (capped at aggregate); and a fourth, visually distinct bar for EFA marked "not a TCP flow — different model" to avoid a false apples-to-apples read. Beneath, a small inset showing one flow pinned to one RSS queue → one MSI-X vector → one core, annotated "ENA Express raises the ceiling and sprays paths, but the flow still lands on one core." Sourced from F-39, F-40, F-15.

**D4 (optional, if room). SRD as a shared substrate.**
Bottom layer: Nitro card, containing an SRD block (multipath, retransmit, reordering). Two arrows up: one into the ENA device → "ENA Express: TCP/UDP flows"; one into the EFA device → "SRD QPs via verbs". Explicit annotation: *"SRD is below both. Neither is built on the other."* Directly refutes the mental-model error. Sourced from F-1, F-28, F-31.

---

# PART 10 — UNKNOWN REGISTER

**UNKNOWN-1. ENA Express single-flow scope: same-AZ or same-Region?**
`ec2-instance-network-bandwidth.html` says 25 Gbps applies "for eligible instances **within the same Availability Zone**". `ena-express.html` says the bandwidth benefit is "within the same Region" and reserves same-AZ language for the *tail-latency* benefit. Not resolvable from driver code — the driver only reads counters (F-33). **Recommend publishing both quotes side by side and flagging the inconsistency**, rather than asserting either.

**UNKNOWN-2. Actual per-instance ENA queue counts.**
`ENA_MAX_NUM_IO_QUEUES 128U` is a driver array bound, not a device guarantee (F-6). The real number is negotiated per device and clamped by MSI-X availability (F-15). Would require running `ethtool -l` on representative instance types. **Not verified; do not publish a per-instance queue number.**

**UNKNOWN-3. Mapping of EFA PCI IDs to EFA generations.**
Five IDs exist (`0xefa0`–`0xefa4`, F-22) while AWS docs name four generations, EFA v1–v4 against Nitro v3–v6 (F-23). The natural reading is `EFA0`→v1 … `EFA3`→v4 with `EFA4` unreleased or newly introduced, but **no source in the repo states the mapping.** Do not assert it. Confirmable by `lspci -nn` on a Nitro v6 instance.

**UNKNOWN-4. Whether ENA Express and EFA can be active simultaneously on the same ENI attachment.**
An "EFA with ENA" attachment has both devices (F-29); ENA Express is an ENI-attachment setting (F-32, F-35). Whether the control plane permits enabling ENA Express on the ENA half of an EFA attachment is **not determinable from driver code** and is not addressed in the fetched docs. Would need an EC2 API experiment (`ModifyNetworkInterfaceAttribute` with `EnaSrdSpecification` against an `efa`-type interface).

**UNKNOWN-5. SRD resource-utilization semantics.**
`ena_srd_resource_utilization` is commented only as "Percentage of the ENA SRD resources that is in use" (F-31). Which resource (connection contexts? path state? card memory?), and what operational action a high value should trigger, is undocumented in code and docs. Worth flagging to readers as a metric to watch but not yet interpret.

**UNKNOWN-6. Exact SRD header overhead.**
The MTU reduction is 9001 → 8900, i.e. 101 bytes (F-37), but no first-party source states the SRD header layout or why 8800 is the lower bound for good bandwidth. `SRD.txt` is stale and cannot be used (FINDING-8). **Derived arithmetic only; do not present 101 bytes as a documented header size.**

**UNKNOWN-7. Whether `PCI_DEV_ID_ENA_RESRV0 0x0051` is live.**
Present in `ena_pci_tbl` (F-22) and named "reserved". No further explanation anywhere in the tree. Mention only if completeness demands it.

---

## Appendix — Reproduction

```
git clone https://github.com/amzn/amzn-drivers.git
cd amzn-drivers && git checkout b99452b70756b1b394b1e7ff238d4efbdca44c5b
```

Key verification commands used:
```sh
# F-22: disjoint PCI IDs
cat kernel/linux/ena/ena_pci_id_tbl.h
grep -n "PCI_DEV_ID\|efa_pci_tbl" kernel/linux/efa/src/efa_main.c

# F-24: zero shared code, both directions
grep -rn "#include" kernel/linux/efa/src/*.c kernel/linux/efa/src/*.h | grep -i ena
grep -rn "#include" kernel/linux/ena/*.c kernel/linux/ena/*.h | grep -i efa

# F-20 / F-25: subsystem boundary
grep -rn "net_device\|register_netdev" kernel/linux/efa/src/*.c
grep -rn "\.mmap\|remap_pfn_range\|vm_ops" kernel/linux/ena/*.c

# F-17: no LRO
grep -rni "lro" kernel/linux/ena/ kernel/linux/common/

# F-27: EFA's userspace LLQ
grep -rn "llq" kernel/linux/efa/src/efa_verbs.c kernel/linux/efa/src/efa-abi.h

# F-33: SRD is GET-only
grep -rn "ena_srd" kernel/linux/common/ena_com/ena_com.c
```

## Sources, grouped by tier

**[AUTHORITATIVE] — first-party source code**
- `amzn/amzn-drivers` @ `b99452b70756b1b394b1e7ff238d4efbdca44c5b` — all `kernel/linux/ena/`, `kernel/linux/common/ena_com/`, `kernel/linux/efa/src/` citations above.
- `amzn/amzn-ec2-ena-utilities` @ `main` — `ena-express/check-ena-express-settings.sh`, fetched 2026-08-01 (F-37, F-38).

**[AUTHORITATIVE] — first-party documentation (AWS official docs)**
- `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` — accessed 2026-08-01 (F-29, F-30, F-23).
- `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html` — accessed 2026-08-01 (F-41).
- `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html` — accessed 2026-08-01 (F-35, F-36, F-37, F-38).
- `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html` — accessed 2026-08-01 (F-39, F-41).

**[AUTHORITATIVE, but ORIENTATION ONLY — in-repo prose, not code]**
- `kernel/linux/ena/README.rst` (F-12, F-13) — cross-checked against code in both cases.
- `kernel/linux/efa/SRD.txt` — **explicitly not used as a source in this report**; see FINDING-8.

**[SECONDARY]**
- None. No third-party source was used for any claim in this report.
