# 2026-10 refresh: software stack (01)

Date convention: (r18) = read 2026-10-18, first session. (r23) = read 2026-10-23, after resume.
All GitHub URLs pinned to a tag or SHA.

STATUS: IN PROGRESS

## 1. Source inventory

| Repo | Pin in dive | Latest release (date) | Compare |
|---|---|---|---|
| amzn/amzn-drivers (EFA) | b99452b70756b1b394b1e7ff238d4efbdca44c5b = tag efa_linux_3.3.0 (2026-07-28) | efa_linux_3.4.0 = 9d5ca4021f7c9f8421e404c1e89edb0b1325372c (2026-10-14); also efa_linux_3.3.1 = f7ba3059356b13fdabfd61cb35aa0ed7059a81e8 (2026-09-06). 3.4.0 commit is master HEAD (r18) | https://github.com/amzn/amzn-drivers/compare/efa_linux_3.3.0...efa_linux_3.4.0 |
| amzn/amzn-drivers (ENA) | same SHA (tree held ena 2.17.2-era code) | ena_linux_2.17.4 = d495b74a599d958a59464ef95d59e00537fbd0bd (2026-09-30); ena_linux_2.17.3 = ac95ee5d7a925d67ec01d669cfdcfe2e62310f99 (2026-09-03) (r18) | https://github.com/amzn/amzn-drivers/compare/b99452b70756b1b394b1e7ff238d4efbdca44c5b...efa_linux_3.4.0 |
| linux-rdma/rdma-core | no pinned citation in src (installer component only) | v65.0 (2026-09-06); v64.0 (2026-07-08) (r18) | https://github.com/linux-rdma/rdma-core/compare/v63.0...v65.0 |
| ofiwg/libfabric | v2.6.0 (2026-06-22) | v2.7.0 (2026-09-18) (r18) | https://github.com/ofiwg/libfabric/compare/v2.6.0...v2.7.0 |
| aws/aws-ofi-nccl | v1.20.0 (2026-06-25) | v1.21.1 (2026-08-20); v1.21.0 (2026-08-17) (r18) | https://github.com/aws/aws-ofi-nccl/compare/v1.20.0...v1.21.1 |
| NVIDIA/nccl | v2.30.4-1, v2.28.9-1, v2.30.7-1 (Sources.tsx id 32) | v2.32.3-1 (2026-09-17); v2.31.2-1 (2026-08-11) (r18) | https://github.com/NVIDIA/nccl/compare/v2.30.4-1...v2.32.3-1 |
| EFA installer | 1.49.0 (2026-06-27) | 1.50.0 (2026-08-21) (r18) | n/a (tarball) |
| torvalds/linux | 2d2338c93da79b3bfe4b6099a931d9468d539952 | pending | pending |

Citation inventory (r18): the extractor inside `scripts/audit/verify-citations.sh`, run
standalone with no network over `deep-dives/efa/src`, yields 192 in-scope code citations:
amzn-drivers @ efa_linux_3.3.0 SHA 38
Counts per ref (r18): libfabric v2.6.0: 57; aws-ofi-nccl v1.20.0: 71; nccl v2.30.4-1: 13; nccl v2.28.9-1: 4; plus single-SHA citations (libfabric 7232f8af, bd987ab2; aws-ofi-nccl 3c2e20cf, d2040033, faf2e8f2; nccl v2.21.5-1, v2.22.3-1; torvalds/linux 2d2338c9: 1). No rdma-core citation is pinned in src.

## Per-repo findings

### EFA installer (r18)

- Latest is 1.50.0, released August 21, 2026 [Tier 1 doc: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html]. Components per the doc: libfabric 2.6.0amzn1.0, EFA driver 3.3.0, rdma-core 64.0, AWS OFI NCCL Plugin 1.21.1. It discontinues Amazon Linux 2; the last installer supporting AL2 is 1.49.0.
- Tarball check: aws-efa-installer-latest.tar.gz and aws-efa-installer-1.50.0.tar.gz carry the same ETag (e5a5178944b1f1112f3b2eb3b15ca5a7, Last-Modified 2026-08-21). aws-efa-installer-1.51.0.tar.gz returns 403 (not published at r18).
- Tarball package listing for 1.50.0 [Tier 1 artefact]: efa 3.3.0-1, efa-config 1.18, efa-profile 1.7, efa-nv-peermem 1.2.3, libfabric-aws 2.6.0amzn1.0, libnccl-ofi 1.21.1-1, rdma-core 64.0amzn0, openmpi40-aws 4.1.7, openmpi50-aws 5.0.9amzn1. OS directories: ALINUX2023, DEBIAN11, DEBIAN12, DEBIAN13, RHEL10, ROCKYLINUX8, ROCKYLINUX9, SUSE, UBUNTU2204, UBUNTU2404, UBUNTU2604 (no ALINUX2).
- efa_installer.sh 1.49.0 vs 1.50.0 diff: the only functional change is an AL2 refusal at the top of the script (exits with 'Amazon Linux 2 is no longer supported by the EFA installer') and removal of the ALINUX2 package paths. No flag was added or removed, so --skip-kmod, --skip-rdma-core, --minimal, --build-ngc behaviour is unchanged between 1.49.0 and 1.50.0.
- 1.49.0 (June 27, 2026) components per the same doc: libfabric 2.4.0amzn5.0, EFA driver 3.1.0, rdma-core 63.0, OFI NCCL 1.20.0. Matches the dive.
- 1.48.0 (April 14, 2026): libfabric 2.4.0amzn3.0, libnccl-ofi 1.19.0. 1.47.0 (January 29, 2026): libfabric 2.4.0amzn1.0, libnccl-ofi 1.18.0, rdma-core 61.0, efa driver 3.0.0, Open MPI 5.0.9amzn1. 1.45.1 (November 26, 2025): libfabric 2.3.1amzn3.0.


### amzn/amzn-drivers (r23)

Pin in the dive: `b99452b70756b1b394b1e7ff238d4efbdca44c5b`, which is exactly the commit tag
`efa_linux_3.3.0` points to (verified: `gh api repos/amzn/amzn-drivers/commits/efa_linux_3.3.0`
returns that SHA, committed 2026-07-28, subject "linux/efa: Bump driver version to 3.3.0").

Newer EFA releases: `efa_linux_3.3.1` = `f7ba3059356b13fdabfd61cb35aa0ed7059a81e8` (2026-09-06),
`efa_linux_3.4.0` = `9d5ca4021f7c9f8421e404c1e89edb0b1325372c` (2026-10-14, and the master HEAD
commit at read time). 30 commits between 3.3.0 and 3.4.0, 37 files touched, covering the
FreeBSD ENA driver (2.8.4), the Linux ENA driver (2.17.3, 2.17.4) and the Linux EFA driver.

r3.4.0 release notes, verbatim
(https://github.com/amzn/amzn-drivers/blob/efa_linux_3.4.0/kernel/linux/efa/RELEASENOTES.md):

> * Add MR PCIe relaxed ordering support
> * Improve RQ and CQ contiguous memory allocation
> * Fix possible race between admin command timeout and completion
> * Fix order between events and admin queues creation and IRQ registration

r3.3.1 release notes, verbatim (same file):

> * Add support for 128-byte admin commands
> * Fix crash on CQ umem release on some old kernels
> * Fix possible overflow when checking inline data size
> * Limit number of conftests running in parallel to avoid OOM on low memory setups
> * Prevent use of wrongly aligned VA in P2P memory registration

Line-by-line re-verification of all 38 amzn-drivers citations at `efa_linux_3.4.0`: files were
fetched with curl from raw.githubusercontent.com at both SHAs and the cited ranges compared
byte-for-byte. Every cited file still exists; no path vanished. Results:

Same content at the same line numbers (18 citations): CMakeLists.txt L36;
efa_admin_cmds_defs.h L70-L76; efa_io_defs.h L23-L93; efa_main.c L27-L38 and L27-L39;
efa_neuronmem.c L157-L166; efa_nvmem_impl.h L294-L306; efa_sysfs.c L34-L51;
efa_verbs.c L40-L42, L54-L66, L68-L72, L74-L96, L350-L359; efa.h L89-L99;
ena/ena_ethtool.c L113-L119.

Moved, same content at new line numbers (13 citations): see the pin-move table.

Content changed at the cited lines (3 citations): `conf/dkms.conf` (PACKAGE_VERSION 3.3.0 ->
3.4.0), `efa_main.c` L42-L53 (DRV_MODULE_VER_MINOR 3 -> 4), `efa_verbs.c` L2814 (the P2P
registration call was refactored into a new helper `efa_p2p_get_and_validate`, so the single
cited line is now L2791 inside that helper rather than inline in `efa_reg_user_mr_dmabuf`).

Claim checks at efa_linux_3.4.0:

- Device IDs 0xefa0 through 0xefa4: hold unchanged. `efa_main.c` L27-L39 at 3.4.0 still defines
  PCI_DEV_ID_EFA0_VF 0xefa0 through PCI_DEV_ID_EFA4_VF 0xefa4 and lists all five in
  `efa_pci_tbl`. CORRECT.
- RDMA read/write capability bits: hold unchanged. `efa_admin_cmds_defs.h` `device_caps` at new
  L689-L709 still documents bit 0 `rdma_read`, bit 3 `rdma_write`, bit 4
  `unsolicited_write_recv`, bit 5 `event_counters`, bit 10 `sq_64_bit_req_id`. CORRECT.
- kverbs / `efa_data_verbs.c` exists and is substantial: holds. The file grew from 798 to 805
  lines; the cited L324-L756 block is intact and sits at L331-L763. CORRECT.
- Driver version in the repository is r3.3.0: now STALE. The tree is at r3.4.0
  (`conf/dkms.conf` PACKAGE_VERSION="3.4.0", `efa_main.c` DRV_MODULE_VER 3.4.0).
- "0xefa4 landed in r3.3.0, so a host installed from installer 1.49.0 does not carry it": the
  first half still holds, the second half is now STALE in a different way. Installer 1.50.0
  (August 21, 2026) ships EFA driver 3.3.0, so a host built from the current installer does
  carry 0xefa4. The installer-versus-repository gap narrowed from 3.1.0-vs-3.3.0 to
  3.3.0-vs-3.4.0, and the specific example the dive uses to make the gap functional no longer
  applies to the current installer.

New in 3.3.1 and 3.4.0 that a reader might act on:

- MR PCIe relaxed ordering (3.4.0). `efa_io_defs.h` gains a `flags_2` byte in the fast MR
  registration request whose bit 0 is `relaxed_ordering_enable`, plus
  `EFA_IO_FAST_MR_REG_REQ_RELAXED_ORDERING_ENABLE_MASK`; `efa_data_verbs.c` sets it when the
  work request carries `IB_ACCESS_RELAXED_ORDERING`, guarded by
  `#ifdef HAVE_IB_ACCESS_RELAXED_ORDERING`. Verified in the diff between the two SHAs.
- MR permissions are now masked to `IB_ACCESS_LOCAL_WRITE | IB_ACCESS_REMOTE_READ |
  IB_ACCESS_REMOTE_WRITE` before being passed to the device, instead of forwarding the raw
  verbs access flags (`efa_data_verbs.c`, commit "Use device ABI MR permissions instead of
  verbs flags").
- Inline-data size overflow fix (3.3.1): `efa_sge_total_bytes` changed return type and
  accumulator from u32 to u64.
- 128-byte admin command support (3.3.1), which is what shrank `efa_admin_cmds_defs.h` from
  1346 to 1279 lines and moved most of its cited ranges.
