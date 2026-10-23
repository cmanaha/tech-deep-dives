# 2026-10 refresh: software stack (01)

Date convention: (r18) = read 2026-10-18, first session. (r23) = read 2026-10-23, after resume.
All GitHub URLs pinned to a tag or SHA.

STATUS: COMPLETE

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
| torvalds/linux | 2d2338c93da79b3bfe4b6099a931d9468d539952 (2026-08-01, during 7.2-rc6) | v7.3 = c03c1a14507dfaf8b856c2608f9ac216021fc222 (tag object 091b0638..., 2026-10-18) (r23); master HEAD 734bef54 (2026-10-23) is in the 7.4 merge window | https://github.com/torvalds/linux/compare/2d2338c93da79b3bfe4b6099a931d9468d539952...v7.3 |

Inventory addendum (r23): releases published after the r18 rows above: EFA installer 1.51.0
(tarball Last-Modified 2026-10-22; not yet in the EC2 changelog page at r23) and
aws/aws-ofi-nccl v1.22.0 (2026-10-21). rdma-core v65.0: `refs/tags/v65.0` points at object
`58e40801bfed5a8befc0881594820fa0a0baa4a1`. Full citation counts in `src/` (r23, after
adding the function-form factories the extractor misses): amzn-drivers 74, libfabric 77
(plus 2 historical commit pins), aws-ofi-nccl 71 (plus 3 commit pins), nccl 17 on
v2.30.4-1/v2.28.9-1 (plus 2 historical tags and the v2.30.7-1 Sources URL), torvalds/linux 1.

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

### amzn/amzn-drivers, completion (r23)

Re-derivation of the citation set. The 38 citations counted above are the ones the
`verify-citations.sh` extractor sees: `Operations.tsx` (17), `EfaDevice.tsx` (5) and
`DataPath.tsx` (16), all built with arrow-function factories. The extractor misses the
`function drv(path, lines)` factory in `EnaVsEfa.tsx` (24 citations) and the
`function driversRef(path, lines)` factory in `SrdProtocol.tsx` (12 citations), so the true
amzn-drivers total in `src/` is 74, all on `b99452b70756b1b394b1e7ff238d4efbdca44c5b`. The same
gap hides 20 `libfabricRef(...)` citations in `SrdProtocol.tsx` (libfabric total 77, not 57).
Worth a ratchet: the extractor should parse `function name(path, lines) { return {...} }`.

Method: every cited file fetched with curl (default User-Agent) from
raw.githubusercontent.com at both SHAs; the cited block compared line-for-line; when it
differs, the exact block searched for in the new file; when absent, the range mapped by diff
alignment and the change read by hand.

All 74 at `9d5ca4021f7c9f8421e404c1e89edb0b1325372c` (efa_linux_3.4.0):

| Result | Count | Which |
|---|---|---|
| Same lines, same content | 44 | 15 in Operations/EfaDevice/DataPath (as listed above), 20 of 24 in EnaVsEfa, 9 of 12 in SrdProtocol |
| Whole-file or directory cite, unchanged | 2 | `conf/configure-dkms.sh` (identical), `kernel/linux/efa/src` (directory) |
| Moved, identical content | 21 | 15 in Operations/EfaDevice/DataPath, 4 in EnaVsEfa (all EFA files), 2 in SrdProtocol |
| Content changed at the cited lines | 3 | `efa_verbs.c` L2814 (DataPath `p2p`), `efa_main.c` L42-L53 (Operations), `efa_admin_cmds_defs.h` L215-L250 (SrdProtocol `modifyQp`) |
| Whole-file cite whose file changed | 4 | `conf/dkms.conf` x2 (3.3.0 -> 3.4.0), `RELEASENOTES.md` x2 (3.3.1 and 3.4.0 entries added; earlier entries intact) |

Reconciliation with the earlier tally (18 same / 13 moved / 3 changed): over the same 38
citations this pass finds 17 unchanged (15 line ranges, `configure-dkms.sh`, the `src`
directory), 15 moved, and 6 changed (2 line ranges plus 4 whole-file cites). The earlier counts
sum to 34 and appear to have counted `dkms.conf` once and `RELEASENOTES.md` as unchanged. The
per-citation rows in the pin-move table below are authoritative.

Changed-content details:

- `efa_verbs.c` L2814 (cited for "the driver takes the peer-to-peer path when the registered
  range resolves to accelerator memory"). At 3.3.0 the line is
  `mr->p2pmem = efa_p2p_get(dev, mr, start, length);` inside `efa_reg_mr` (not
  `efa_reg_user_mr_dmabuf` as noted earlier in this file; the enclosing function at both SHAs
  is `efa_reg_mr`, L2776 old / L2816 new). At 3.4.0 the call site is L2854 and reads
  `mr->p2pmem = efa_p2p_get_and_validate(dev, mr, start, length, virt_addr);`. The helper
  (L2785-L2813) calls `efa_p2p_get` (L2791), then rejects the buffer unless
  `start % pg_sz == virt_addr % pg_sz` (L2801), the 3.3.1 note "Prevent use of wrongly aligned
  VA in P2P memory registration". The page's claim still holds; the new fact is the alignment
  check.
- `efa_main.c` L42-L53: `DRV_MODULE_VER_MINOR` 3 -> 4, so the module reports 3.4.0.
- `efa_admin_cmds_defs.h` L215-L250 (`efa_admin_modify_qp_cmd`): same fields in the same order,
  now at L209-L244; the closing line becomes `} __attribute__((__packed__));`. Part of the
  128-byte admin command rework in 3.3.1. No claim impact.

ENA code under the same SHA: the ENA tree at `9d5ca402` is identical to tag `ena_linux_2.17.4`
(`d495b74a...`); `gh api .../compare/ena_linux_2.17.4...9d5ca402` shows 10 commits, all under
`kernel/linux/efa/`. The old pin carried ENA 2.17.2 (`ena_netdev.h` `DRV_MODULE_GEN_SUBMINOR` 2
-> 4). Every ENA citation in `EnaVsEfa.tsx` (14) and `SrdProtocol.tsx` (6) and `Operations.tsx`
(1) holds at the same lines, except `ena_ethtool.c` L2020-L2022 (`enaEthtoolOps`), which moved
to L2022-L2024 with identical content. `EnaVsEfa.tsx` makes no ENA version claim.

Tag check at r23: `git/matching-refs/tags/efa_linux_3` lists 3.0.0, 3.1.0, 3.3.0, 3.3.1, 3.4.0;
master HEAD is still `9d5ca402` (committed 2026-10-14). No newer EFA driver release.

Pin recommendation: move all five constants (`Operations.tsx` `DRIVER_SHA`, `EfaDevice.tsx`
`DRIVER_SHA`, `DataPath.tsx` `AMZN`, `EnaVsEfa.tsx` `DRIVERS_SHA`, `SrdProtocol.tsx` `DRIVERS`)
to `9d5ca4021f7c9f8421e404c1e89edb0b1325372c`. Every one of the 74 citations has a verified
path:lines at the new SHA (pin-move table). The move forces prose edits: every "r3.3.0" that
describes the repository becomes "r3.4.0" (claim register D-01 to D-05). Alternative if the
dive prefers to cite what the current installer builds: efa_linux_3.3.1 (`f7ba3059...`), which
installer 1.51.0 ships; that SHA was not line-verified in this pass.

### EFA installer 1.51.0 (r23, new since r18)

- `aws-efa-installer-1.51.0.tar.gz` now returns 200 (Last-Modified Thu, 22 Oct 2026 21:41:21 GMT,
  ETag eedd7db2cd3951ccae03e07d135acb7d), and `aws-efa-installer-latest.tar.gz` carries the same
  ETag, so `latest` is 1.51.0 [Tier 1 artefact, r23]. 1.50.0 is unchanged (ETag
  e5a5178944b1f1112f3b2eb3b15ca5a7).
- The EC2 User Guide changelog page (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html)
  still lists 1.50.0 as the newest row at r23. The documentation lags the artefact by at least a
  day.
- `ChangeLog.md` inside the 1.51.0 tarball, verbatim:

  > ## [1.51.0] - Oct 2026
  > - Discontinue support for Debian 11. The last EFA installer version supporting Debian 11 is 1.50.0.
  > - Upgrade to Open MPI 4.1.8
  > - Upgrade to OpenPMIx 5.0.9 and PRRTE 3.0.12, the versions Open MPI 5.0.9 bundles
  > - Upgrade to efa driver 3.3.1
  > - Upgrade to rdma-core 65.0
  > - Upgrade to libfabric 2.7.0amzn2.0
  > - Upgrade to OFI NCCL Plugin 1.22.0

- Package listing (ALINUX2023 aarch64, same versions on x86_64) [Tier 1 artefact]:
  efa-3.3.1-1, libfabric-aws 2.7.0amzn2.0, libnccl-ofi 1.22.0-1, rdma-core 65.0-1,
  openmpi40-aws 4.1.8, openmpi50-aws 5.0.9amzn1, pmix-aws 5.0.9, prrte-aws 3.0.12,
  efa-nv-peermem 1.2.3, efa-config 1.18, efa-profile 1.7. OS directories: ALINUX2023, RHEL10,
  ROCKYLINUX8, ROCKYLINUX9, SUSE, DEBIAN12, DEBIAN13, UBUNTU2204, UBUNTU2404, UBUNTU2604
  (DEBIAN11 gone).
- Consequence: the shipping installer now carries libfabric 2.7.0amzn2.0 and the OFI NCCL plugin
  1.22.0, which is newer than the v1.21.1 target named for this refresh. aws/aws-ofi-nccl
  v1.22.0 was published 2026-10-21 (`gh release list`). This pass therefore re-verifies
  aws-ofi-nccl citations at v1.22.0 as well as v1.21.1.
- Installer-versus-repository gap at r23: EFA driver 3.3.1 (installer) vs efa_linux_3.4.0
  (repository); libfabric 2.7.0amzn2.0 (installer, AWS fork) vs v2.7.0 (upstream); plugin 1.22.0
  in both.
- `efa_installer.sh` 1.50.0 vs 1.51.0 diff (both extracted from the tarballs, read as text, not
  run): a Debian 11 refusal at the top (exits with "Error: Debian 11 is no longer supported by
  the EFA installer"), removal of the DEBIAN11 package paths, and one behaviour change: when NGC
  handling is active (auto-detected, `--enable-ngc` or `--build-ngc`) and the container is not
  Ubuntu 22.04/24.04/26.04, the script prints "This container is not Ubuntu. NGC container
  support currently targets Ubuntu-based images..." and falls back to a standard install
  (`NGC=0`, `NGC_BUILD=0`). The set of `--long` options is identical (37 distinct `--` strings
  in both), and the `--minimal` exclusion block (libfabric, openmpi, libnccl-ofi, efa-profile)
  is byte-identical. The dive's `--minimal` and `--skip-kmod` descriptions therefore still hold
  at 1.51.0.
### ofiwg/libfabric v2.6.0 -> v2.7.0 (r23)

v2.7.0 was released 2026-09-18 (tag commit `9011331bb34bb90b38a7aad53857df4430c5db45`; v2.6.0 is
`5de2d6a2df83595bcc38531cb91bf59495559495`). Installer 1.51.0 ships the AWS fork
2.7.0amzn2.0. Sources: `NEWS.md` at v2.7.0 (EFA section, about 200 entries; changelog text is
orientation only per the source-authority standard) and the code at both tags (shallow sparse
clones of `prov/efa`, `prov/util`, `man`, `include`, `src`, plus raw fetches for every cited file).

Citation sweep, all 77 libfabric citations on v2.6.0 (57 seen by the extractor plus 20 in
`SrdProtocol.tsx`): 31 same lines, 1 whole-file cite identical (`man/fi_pingpong.1.md`), 33
moved with identical content, 11 changed at the cited lines, 1 whole-file cite whose file grew
(`man/fi_efa.7.md`, 722 -> 841 lines). Every cited path still exists except that the MR-cache
open block moved to a new file, `prov/efa/src/rdm/efa_rdm_domain.c` (NEWS: "Split efa_rdm_domain
and efa_domain into separate files"). Every changed citation has a replacement range in the
pin-move table.

Claim checks at v2.7.0 (code read, r23):

- Data Path Direct default and scope: unchanged. `efa_env.c` L42 `.use_data_path_direct = true`;
  help text L249-L253 still "bypasses rdma-core on data path, including the CQ polling and TX/RX
  submissions". The QP initialiser still calls `efadv_query_qp_wqs` (`efa_data_path_direct.c`
  L83) and the build gate still requires both `efadv_query_qp_wqs` and `efadv_query_cq`
  (`configure.m4` L329-L334). The fallback branch to verbs is intact (`efa_data_path_ops.h`
  L223-L226). rdma-core still owns setup; the "data path only" scope holds. CORRECT.
- First-generation device gate for the direct path: identical block at `efa_device.c`
  L604-L610 (was L520-L526). CORRECT.
- GPUDirect Async: `FI_EFA_GDA_OPS` still returns `-FI_EOPNOTSUPP` with "Only efa direct supports
  FI_EFA_GDA_OPS" on any non-efa-direct domain (`efa_domain.c` L803-L812); the `efa_ops_gda`
  table (query_addr, query_qp_wqs, query_cq, cq_open_ext, get_mr_lkey, cntr_open_ext) is
  unchanged at L691-L698. Man page text unchanged apart from a typo fix, now L339-L359.
  CORRECT.
- NEW: a second efa-direct-only domain extension, `FI_EFA_MODIFY_EP_OPS`, returning
  `fi_efa_ops_modify_ep` with `modify_ep(ep, ep_attr, attr_mask)` to change endpoint attributes
  after enable; documented in `man/fi_efa.7.md` L588-L600 and implemented as
  `efa_domain_modify_ep` (`efa_domain.c` L718 onward). Its doc comment says it is
  efa-direct only because on efa-rdm the QKEY doubles as the connection ID cached by peers.
- STALE, and now a doc-code conflict: "efa-direct ... requires the FI_CONTEXT2 mode"
  (`Libfabric.tsx` L668). At v2.7.0 the code makes FI_CONTEXT2 optional on efa-direct and DGRAM:
  `efa_prov_info.c` L241-L245 "Neither efa-direct nor DGRAM requires FI_CONTEXT2
  unconditionally; it is advertised conditionally in efa_get_user_info() based on whether the
  application requested it (or passed NULL hints)", and `efa_user_info.c` L555-L581
  (`efa_user_info_set_context2`): without FI_CONTEXT2 the endpoint does not touch the caller's
  context buffer and inject is disabled (`inject_size = 0`; a nonzero inject_size hint makes the
  info be rejected). NEWS: "Allow efa-direct without FI_CONTEXT2 for GDA usecase". The man page
  Modes paragraph (`man/fi_efa.7.md` L75-L78) still says efa-direct requires FI_CONTEXT2. Code
  wins. Side note: the dive cites `manEndpoints` (L33-L57) for this, but the FI_CONTEXT2
  sentence is in the Modes paragraph (L75-L78 at both tags), so the citation range was off even
  at v2.6.0.
- Receive-window doc-code conflict: still present. Help text "(Default: 16384)" at `efa_env.c`
  L189-L190 (define starts at L189, was L188); initialiser `.recvwin_size =
  EFA_RDM_PEER_DEFAULT_REORDER_BUFFER_SIZE` still at L18; `efa_rdm_peer.h` L12 still `(16)`.
  The slot computation `exp_msg_id % efa_env.recvwin_size` is now `efa_rdm_peer.c` L518 (was
  L320). CORRECT, but the `conflict=` string in `SrdProtocol.tsx` L1098 hard-codes "line 188",
  which becomes line 189 at v2.7.0.
- Shared-memory AV size doc-code conflict: still present (help "(Default 128)", initialiser
  `.shm_av_size = 256` at L17). CORRECT.
- Historical commits `7232f8af` and `bd987ab2` (recvwin 16384 -> 8192 -> 16): re-fetched at r23,
  `efa_rdm_peer.h` reads `(8192)` at line 13 and `(16)` at line 12 respectively. CORRECT; these
  are commit pins and need no move.
- MR cache opens only when the application did not set FI_MR_LOCAL and the cache is enabled,
  with the "Explicit memory registrations from external application should never go in the MR
  cache" comment: unchanged in substance, moved to `rdm/efa_rdm_domain.c` L55-L68 inside
  `efa_rdm_domain_init` (it was in `efa_domain_init_rdm`, so it was RDM-only before as well).
  CORRECT.
- Protocol selection (`efa_rdm_msg.c` select-RTM function) and the threshold constants
  (`efa.h` now L87-L90): same logic; only a domain accessor rename. CORRECT.
- Every `FI_EFA_*` environment variable the dive names (19 distinct names: USE_DEVICE_RDMA,
  FORK_SAFE, USE_HUGE_PAGE, RUNT_SIZE, RECVWIN_SIZE, INTER_MIN_READ_MESSAGE_SIZE,
  MR_MAX_CACHED_COUNT, MR_CACHE_ENABLE, INTER_MAX_MEDIUM_MESSAGE_SIZE, ZCPY_RX_SEED,
  USE_DATA_PATH_DIRECT, TX_IOV_LIMIT, TRACK_MR, SHM_AV_SIZE, SET_CUDA_SYNC_MEMOPS,
  RX_IOV_LIMIT, MTU_SIZE, MR_MAX_CACHED_SIZE, ENABLE_SHM_TRANSFER) still appears in the
  provider or util code at v2.7.0, in the same number of files (TRACK_MR in more). None was
  removed.
- Error vocabulary: 4124 ESTABLISHED_RECV_UNRESP and 4126 UNESTABLISHED_RECV_UNRESP unchanged.
  NEW: 4127 PEER_ABORTED, "Operation aborted because the peer closed its memory registration or
  endpoint mid-transfer" (`efa_errno.h` L112), with a help string in `efa_strerror.c`. It comes
  with a PEER_ERROR control packet and a "receiver decides" abort model; `man/fi_efa.7.md`
  L146-L151 states MR-abort behaviour is undefined unless both peers run libfabric 2.7.0 or
  later.

Defaults and knobs that changed (not named in the dive, but a reader tuning or debugging the
provider would act on them):

- `FI_EFA_USE_HW_CNTR` default 0 -> 1 (`efa_env.c` L45; read unregistered via `getenv` at
  L59-L61, so it does not appear in `fi_info -e`). NEWS: "Turn on hardware counter by default".
- `FI_EFA_ENABLE_HIGH_PPS` removed (v2.6.0 read it via `getenv("FI_EFA_ENABLE_HIGH_PPS")` at `efa_env.c` L63; gone at v2.7.0).
  NEWS: "Remove the pps feature flag gate".
- `FI_EFA_USE_SQ_REQ_ID_64_BIT`, new, default 1, unregistered (`efa_env.c` L46, L63-L65). Pairs
  with the driver's 64-bit SQ request id capability (`sq_64_bit_req_id`, device_caps bit 10).
- `FI_EFA_RDM_TXE_POOL_SIZE`, new registered parameter (`efa_env.c` define L245-L247, read L136,
  default `EFA_RDM_TXE_POOL_SIZE_DEFAULT` = `EFA_RDM_TXE_POOL_MAX_CNT`, `rdm/efa_rdm_ope.h` L255).
- `FI_EFA_MR_RELAXED_ORDERING`, a new provider-specific `fi_mr_reg` flag (bit 61), documented
  at `man/fi_efa.7.md` L264-L270: by default the device orders all data transactions to an MR;
  the flag gives that up. This is the userspace half of the driver 3.4.0 "MR PCIe relaxed
  ordering" change.
### aws/aws-ofi-nccl v1.20.0 -> v1.21.1 and v1.22.0 (r23)

Releases since the pin: v1.21.0 (2026-08-17), v1.21.1 (2026-08-20), v1.22.0 (2026-10-21, after
the r18 inventory was taken). Installer 1.51.0 ships libnccl-ofi 1.22.0, so this pass verifies
all 71 citations at both v1.21.1 and v1.22.0 and recommends v1.22.0.

Release notes (GitHub releases, in-repo text: orientation only, then checked in code):

- v1.21.0: tested with NCCL v2.31.2-1, backward compatible with NCCL v2.17.1 and later; tested
  with libfabric v2.6.0amzn1.0; requires libfabric 1.11.0 to build and 1.22.0 for AWS-specific
  support. Adds GPU-Initiated Networking in two modes, host-proxy and "Kernel backend (EFA
  GDA)"; the notes say the kernel backend "is opt-in via `NCCL_GIN_TYPE=5`" and requires NCCL
  2.31.2-1+, GDRCopy 2.5+ and libfabric 2.6.0+. Known limitations: fixed signal count per NIC
  (EFA hardware completion counters), Put and signal only. Also: P5en chunk-size tuning for
  AllGather PAT/Simple and Tree/LL128; a Security Group misconfiguration warning on error
  completions.
- v1.21.1: build fix for `--enable-cudart-dynamic`; EFA GDA source vendored instead of a git
  submodule.
- v1.22.0: tested with NCCL v2.32.3-1 (backward compatible to v2.17.1) and libfabric
  v2.7.0amzn2.0. "Disabled eager message path in the rdma protocol by default." Fix for GIN
  setup hangs on P6-B200 and P6-B300 caused by NCCL's internal GIN backend trying to use the
  GPU baseboard's ConnectX-7 bridges. New PAT tuner regions for P5en, P6-B200 and P6-B300.
  Grace Blackwell flush fix (C2C path).

Citation sweep: 71 citations on v1.20.0. At v1.22.0: 27 same lines, 4 whole-file cites
identical (`topology/p4d-24xl-topo.xml`, `topology/g5.48xl-topo.xml`, `doc/efa-env-var.md` x2),
28 moved with identical content, 11 changed, 1 whole-file cite whose file changed
(`src/nccl_ofi_rdma.cpp`, 7627 -> 7464 lines). At v1.21.1 the same 11 are changed and the
split is 28 same / 27 moved. No cited path vanished at either tag. The three single-SHA
citations (`3c2e20cf`, `d2040033`, `faf2e8f2`) are historical commits and need no move.

Claim checks at v1.22.0 (code, r23):

- STALE: OFI_NCCL_GIN_TYPE no longer exists (removed by v1.21.0; absent at v1.21.1 and
  v1.22.0). At v1.20.0 `include/nccl_ofi_param.h` L388-L389 defined `GIN_TYPE` (PROXY|GDAKI,
  default PROXY) and `src/rdma/gin/nccl_ofi_gin_api.cpp` L90-L118 overwrote the exported v13
  GIN symbol with the GDAKI table when it was set. At v1.22.0 that switch is gone
  (`nccl_ofi_gin_api.cpp` L90 is now just the closing brace of the preceding block), and the
  same param slot holds `OFI_NCCL_GDAKI_EFA_HW_COUNTER` (AUTO|ON|OFF, default AUTO;
  `nccl_ofi_param.h` L379-L399), which the header comment calls "an override / escape hatch,
  NOT a general enable switch" for whether GDAKI uses the EFA hardware completion counter.
- STALE: "exported against NCCL's GPU-initiated networking interface at version 13" for GDAKI.
  At v1.22.0 the proxy GIN plugin is exported as `ncclGinPlugin_v11` and `ncclGinPlugin_v13`,
  both named "Libfabric" (`nccl_ofi_gin_api.cpp` L566, L595), and GDAKI is a separate export,
  `ncclGinPlugin_v14` named "Libfabric_GDAKI" (`src/rdma/gin/nccl_ofi_gin_gdaki.cpp`
  L1256-L1274). The header line cited as `ginExport` (`include/rdma/gin/nccl_ofi_gin_gdaki.h`
  L15, `extern ncclGin_v13_t nccl_ofi_gin_gdaki_plugin;`) no longer exists.
- STALE: "The plugin must be built with the GDAKI option". The `--enable-gdaki` configure flag
  is gone; `configure.ac` L343-L351 at v1.22.0 sets `HAVE_GDAKI=1` automatically when libfabric
  declares `FI_EFA_GDA_OPS`, the completion-counter ABI is present and the device interface is
  CUDA, otherwise "building proxy-only GIN". Which GIN plugin NCCL binds is now NCCL's choice
  (see the NCCL section).
- NEW: per-platform GDAKI gate. The platform table gains `efa_hw_comp_cntr` (true only for
  p5en, p6-b200, p6-b300 at v1.22.0), and `nccl_ofi_gin_gdaki.cpp` refuses with "gin GDAKI: not
  supported on this platform; cannot create a GDAKI context here" (L665-L667) before
  opening `FI_EFA_GDA_OPS` per rail (L671-L678).
- CORRECT, moved: the GDAKI open reuses the proxy plugin's libfabric domains, with the comment
  that on libfabric 2.4+ the proxy selects efa-direct and that domain exposes FI_EFA_GDA_OPS,
  and a failed open throws "(libfabric too old, or proxy selected non-efa-direct fabric)".
  Now per rail, at `nccl_ofi_gin_gdaki.cpp` L588-L681. CORRECT with new lines.
- Tuner and NCCL_ALGO/NCCL_PROTO: unchanged in substance. The only `getenv("NCCL_ALGO") ||
  getenv("NCCL_PROTO")` bailout is still in `nccl_ofi_tuner_init_v2` (L140-L158); v3 binds the
  plain initialiser (L184-L188) and v6 has no env check. Exported tuner symbols are still v2, v3
  and v6. CORRECT. NEW: the v6 table now sets `.getChunkSize = nccl_ofi_tuner_get_chunk_size`
  (L242-L246; was `nullptr`), so on NCCL 2.30.3+ the plugin can also override chunk size where
  its context provides `get_chunk_size_internal`; otherwise it returns success and NCCL keeps
  its own chunk size (L224-L239).
- Net plugin exports unchanged: `ncclNetPlugin_v6` through `ncclNetPlugin_v12`
  (`src/nccl_ofi_interface_nvidia.cpp` L661-L830, same lines). CORRECT.
- STALE: "p5en and p6-b200 share an entry" (NcclOverEfa.tsx L797). At v1.22.0 they are separate
  rows (`platform-aws.cpp` `.name = "p5en"` L156, then p6-b200, then p6-b300). Both keep 35 us
  latency, RDMA protocol and `NCCL_NETDEVS_POLICY=max:1`; the NETDEVS comment now sits in the
  p5en entry and still says "platforms with 2 GPUs and 2 NICs per PCIe switch, such as P5en
  and P6-B200" (L166-L171). NEW: p6-b200 and p6-b300 inject `NCCL_IB_HCA=invalid`, with a header
  comment (L81-L85) that P6-B200 and P6-B300 expose the GPU baseboard's ConnectX-7 bridge as
  active InfiniBand devices not connected to other nodes, so NCCL's internal IB transports must
  be kept off them. p6-b300 has its own row since v1.21.x (at v1.20.0 it fell through to the
  p-series catch-all); it does not set NETDEVS_POLICY.
- CORRECT: p4d/p4de, p5/p5e, the p-series catch-all (comment still names P6e-GB200 and later,
  L225), g5, g7e, Trainium and Inferentia rows carry the same injected variables as at
  v1.20.0, plus `efa_hw_comp_cntr = false`.
- NEW default: `OFI_NCCL_EAGER_MAX_SIZE` 8192 -> -1, "Setting this to -1 disables eager
  messages entirely. Default is disabled" (`nccl_ofi_param.h` L223-L229 at v1.22.0; was L227
  `8192` at v1.20.0). The dive lists the variable (NcclOverEfa.tsx L290) without a default.
- Unchanged defaults for the other plugin variables the dive names: `OFI_NCCL_PROTOCOL`
  default SENDRECV in the param header (L121; platform rows still override to RDMA),
  `OFI_NCCL_TUNER_TYPE` default REGION (L269), `OFI_NCCL_FORCE_NUM_RAILS` 0 (L306).
- GIN file counts the dive quotes ("seven implementation files under src/rdma/gin and nine
  headers"): 7 and 9 at v1.20.0, v1.21.0, v1.21.1 and v1.22.0 (contents API, r23). CORRECT.
### NVIDIA/nccl v2.30.4-1 / v2.28.9-1 / v2.30.7-1 -> v2.32.3-1 (r23)

v2.32.3-1 was released 2026-09-17 (tag commit `12df1a11afad322be5a204a2db890161cbf8131d`;
v2.30.4-1 is `1933fdd6360a8bfccaa0166bd71bce363d32e5b6`). aws-ofi-nccl v1.22.0 states it was
tested with it. Scope here is only what the dive claims. Method: raw fetch of every cited file
plus shallow sparse clones of `src/` at both tags.

Citation sweep (17 on v2.30.4-1 and v2.28.9-1): 1 same line (`nccl_tuner.h` L25, the
`NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v6"` define), 2 moved, 7 whose file no longer exists
at the old path, 7 changed. The two historical pins (`v2.21.5-1` `nccl_tuner.h` L58, `v2.22.3-1`
`nccl_tuner.h` L60) describe old releases on purpose and need no move.

The large change: NCCL 2.32 moved algorithm/protocol selection into a new `src/tuning/`
directory. `src/enqueue.cc` is now `src/enqueue/enqueue.cc` and no longer holds the cost table;
`src/graph/tuning.cc` is gone, replaced by `src/tuning/tuning.cc`, `cost_model.cc`,
`tuning_general.cc` and per-algorithm model files. Claim checks:

- "Your filter is applied first ... before the tuner is ever called": holds in substance, new
  mechanism. NCCL_PROTO, NCCL_ALGO (and new NCCL_SYM_KERNEL) are parsed once at communicator
  init into per-function enable arrays (`src/tuning/cost_model.cc` L306-L345,
  `ncclTuningCostModelInit`), which clear `tuningContext.enabled[id][func]` for excluded
  combinations (L371-L384). At selection time each candidate is modelled, and a disabled one is
  dropped with `timeUs = NCCL_TUNING_IGNORE` (L470-L497). Only when a tuner is loaded does NCCL
  build the algorithm-by-protocol table, initialised to NCCL_TUNING_IGNORE and filled from the
  surviving candidates (`src/tuning/tuning.cc` L204-L216), call `tuner->getCollInfo`
  (L219-L222), copy the tuner's values back (L224-L229) and select (L231). STALE in wording:
  "parses ... at tuning time" (now at init) and "zeroes the modelled bandwidth for every disabled
  combination, which makes the time lookup return -1.0" (now: disabled candidates are excluded
  and marked NCCL_TUNING_IGNORE directly). The order (user filter, then tuner, then pick) is
  CORRECT.
- NCCL_ALGO_PROTO_IGNORE is still -1.0: `src/include/plugin/nccl_tuner.h` L43-L44 now reads
  `#define NCCL_TUNING_IGNORE -1.0` and `#define NCCL_ALGO_PROTO_IGNORE NCCL_TUNING_IGNORE`.
  CORRECT, new lines.
- "NCCL then scans the table and picks the lowest non-ignored cost": the pick is now
  `ncclTuningSelectBestTuning` (`tuning.cc` L155-L173), lowest `selectionTimeUs` if set, else
  `timeUs`, over the candidate list. Excluded combinations are not in that list, so they cannot
  be picked. The function has no explicit `>= 0` guard, unlike the old `topoGetAlgoInfo`
  (`table[a][p] >= 0.0`). [SPECULATIVE] A tuner that writes -1.0 into a cell that was a valid
  candidate would make that cell the minimum rather than remove it; not tested, and the
  aws-ofi-nccl region tuner sets its chosen cell to 0.0 rather than disabling others, so it is
  unaffected either way. Wording "lowest non-ignored" becomes "lowest-cost remaining candidate".
- Tuner plugin API: still v6 (`NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v6"`, nccl_tuner.h
  L25, unchanged); loaders for v2 to v6 remain (`src/plugin/tuner/tuner_v2.cc` ... `tuner_v6.cc`).
  CORRECT.
- Net plugin API: loaders for v6 through v12 (`src/plugin/net/net_v6.cc` ... `net_v12.cc`); v12
  is current. aws-ofi-nccl v1.22.0 exports v6 to v12. CORRECT, no new net API version.
- NEW, GIN plugin API: `NCCL_GIN_PLUGIN_SYMBOL ncclGinPlugin_v14` (`src/include/plugin/nccl_gin.h`
  L37), with a v13 loader kept (`src/plugin/gin/gin_v13.cc`). Selection is by
  `NCCL_GIN_TYPE` (`ncclParamGinType`, default -1 = any; `src/plugin/gin.cc` L141-L147) matched
  against each plugin's `netDeviceType`. Type values (`src/include/nccl_device/core.h` L74-L78):
  PROXY 2, GDAKI 3, GPI 4, EFA_GDA 5. aws-ofi-nccl v1.22.0's GDAKI plugin reports
  `NCCL_NET_DEVICE_GIN_EFA_GDA` (`nccl_ofi_gin_gdaki.cpp` L143), which is why its release notes
  say `NCCL_GIN_TYPE=5`. Also NEW: NCCL skips an external plugin of type PROXY and uses its own
  "GIN proxy over RMA backend" instead (`src/plugin/gin.cc` L164-L169), so the aws-ofi-nccl
  proxy GIN export is not what NCCL 2.32 uses for proxy mode. [Code-derived; not tested on a host.]
- Internal fallback plugins: still IB then Socket appended after the external list
  (`src/plugin/net.cc` L332-L333 on Linux). CORRECT. "Failed to initialize NET plugin %s" is
  still logged with the same text, now via `ATTN(...)` (net.cc L229) instead of `INFO`. NCCL 2.32
  adds an ATTN debug level described as "Prints error messages plus informational notices"
  (`src/debug.cc` L48). Which NCCL_DEBUG setting is the minimum that shows the line was not
  established (UNKNOWN).
- "Using network %s" still logged at `src/init.cc` L557 (was L428 at v2.28.9-1). CORRECT.
- NCCL_BUFFSIZE default 4 MiB: `#define DEFAULT_BUFFSIZE (1 << 22) /* 4MiB */` at `src/init.cc`
  L1006. CORRECT, new lines.
- `cmpScore` ordering (interBw, interPciBw, interNhops, intraBw, intraNhops) and the "quickly
  converge ... even if it eventually times out" comment: unchanged, reformatted, now
  `src/graph/search.cc` L190-L212; `ncclTopoSearchNextGpuSort` L251-L291. CORRECT.
- `Sources.tsx` id 32 cites `https://github.com/NVIDIA/nccl/blob/v2.30.7-1/src/graph/search.cc`.
  The file exists at v2.32.3-1 with the same `cmpScore` body; a move to
  `.../blob/v2.32.3-1/src/graph/search.cc` is safe.
### torvalds/linux mainline EFA driver and linux-rdma/rdma-core (r23)

Mainline: the dive pins `2d2338c93da79b3bfe4b6099a931d9468d539952` (a 2026-08-01 merge during
7.2-rc6). Latest mainline release at r23 is v7.3 (commit
`c03c1a14507dfaf8b856c2608f9ac216021fc222`, "Linux 7.3", 2026-10-18). Read
`drivers/infiniband/hw/efa/` at both refs.

- Device IDs. At the old pin mainline defines 0xefa0 through 0xefa3 only
  (`efa_main.c` L16-L19). At v7.3 it defines and registers 0xefa0 through 0xefa4
  (`efa_main.c` L16-L20, `PCI_VDEVICE(AMAZON, PCI_DEV_ID_EFA4_VF)` at L27), from commit
  `6a57af838b1a` "RDMA/efa: Add EFA 0xefa4 PCI ID" (committer date 2026-07-14, merged for 7.3).
  Any statement that mainline stops at 0xefa3 is STALE from v7.3. The dive itself makes no such
  statement: every 0xefa4 sentence in `Operations.tsx` and `EfaDevice.tsx` cites amzn-drivers.
- Kernel-verbs data path in mainline: still absent. v7.3 `efa_dev_ops` (`efa_main.c`
  L369-L413) has no `post_send`, `post_recv`, `poll_cq` or `req_notify_cq`, and the directory
  holds no data-path source file (v7.3 files: Kconfig, Makefile, efa.h, efa_admin_cmds_defs.h,
  efa_admin_defs.h, efa_ah_cache.c/.h (new), efa_com.c/.h, efa_com_cmd.c/.h,
  efa_common_defs.h, efa_io_defs.h, efa_main.c, efa_regs_defs.h, efa_verbs.c). The DataPath
  claim "Its device operations table stops at the control plane, and the tree carries no EFA
  data-path source file" is CORRECT at v7.3.
- NEW in mainline 7.3: completion counters. `efa_dev_ops` gains `create_comp_cntr`,
  `destroy_comp_cntr`, `modify_comp_cntr`, `qp_attach_comp_cntr` and `query_comp_cntr_caps`,
  plus `INIT_RDMA_OBJ_SIZE(ib_comp_cntr, ...)` (commit `0e8e94c15091` "RDMA/efa: Add Completion
  Counters support"). These are control-plane object operations, so they do not change the
  claim above. They are the kernel half of the counters libfabric 2.7.0 turns on by default and
  aws-ofi-nccl GDAKI depends on.
- Pin recommendation: move `DataPath.tsx` `LINUX` to tag `v7.3` (or SHA
  `c03c1a14507dfaf8b856c2608f9ac216021fc222`), citation `drivers/infiniband/hw/efa/efa_main.c`
  L369-L413. Verified.

rdma-core: no citation in `src/` is pinned to it. Two facts that touch the dive's claims:

- The userspace EFA provider's PCI match table (`providers/efa/efa.c` `efa_table`) lists
  0xefa0-0xefa3 at v63.0 (installer 1.49.0) and adds 0xefa4 at v64.0 (installer 1.50.0); v65.0
  (installer 1.51.0) keeps 0xefa0-0xefa4 (L22-L26). The first entry in every version is
  `VERBS_DRIVER_ID(RDMA_DRIVER_EFA)` (L21), so the provider also binds by kernel driver id.
  Whether an rdma-core older than v64.0 fails to bind on an 0xefa4 host is UNKNOWN
  ([SPECULATIVE] the driver-id match probably covers it on any kernel that reports the id).
- v65.0 adds `efadv_create_comp_cntr` (`providers/efa/efadv.h` L228), the userspace entry point
  for the completion counters above. `efadv_query_qp_wqs` and `efadv_query_cq`, the two queries
  the libfabric Data Path Direct build gate requires, are present at v63.0, v64.0 and v65.0.
  The DataPath claim that rdma-core still owns setup is unaffected.
## Claim register

Verdicts: CORRECT (holds at the newest ref), STALE (was true at the old pin or date, no longer),
WRONG (was not true at the old pin either), NEW (a fact the page lacks that a reader would act
on), UNKNOWN (could not be settled in this pass). Tiers: [T1 code] source at a pinned ref,
[T1 doc] official AWS documentation, [T1 artefact] AWS-published tarball, [orientation]
in-repo release notes or changelog text (not proof of behaviour per the source-authority
standard), [SPECULATIVE] our inference. All reads r23 unless marked r18.

AL = amzn-drivers at `9d5ca4021f7c9f8421e404c1e89edb0b1325372c` (efa_linux_3.4.0);
LF = libfabric v2.7.0; PL = aws-ofi-nccl v1.22.0; NC = nccl v2.32.3-1; LX = linux v7.3.
URL prefixes: AL = https://github.com/amzn/amzn-drivers/blob/9d5ca4021f7c9f8421e404c1e89edb0b1325372c/ ;
LF = https://github.com/ofiwg/libfabric/blob/v2.7.0/ ; PL = https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/ ;
NC = https://github.com/NVIDIA/nccl/blob/v2.32.3-1/ ; LX = https://github.com/torvalds/linux/blob/v7.3/

| ID | Claim on the page (short) | Location | Verdict | Evidence (pinned) + tier | Replacement text or fact |
|---|---|---|---|---|---|
| I-01 | Installer 1.49.0 (June 27, 2026) ships libfabric 2.4.0amzn5.0, driver 3.1.0, rdma-core 63.0, plugin 1.20.0; "what a host built today carries" | Operations.tsx:1105-1108 | STALE | https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz `ChangeLog.md` and package list [T1 artefact]; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html newest row 1.50.0 [T1 doc] | Latest installer is 1.51.0 (tarball dated Oct 22, 2026): EFA driver 3.3.1, libfabric 2.7.0amzn2.0, rdma-core 65.0, OFI NCCL plugin 1.22.0, Open MPI 4.1.8 and 5.0.9amzn1. The EC2 changelog page lists 1.50.0 (Aug 21, 2026: libfabric 2.6.0amzn1.0, driver 3.3.0, rdma-core 64.0, plugin 1.21.1) as newest at r23; cite the tarball changelog until the page catches up |
| I-02 | Same 1.49.0 component list, "what efa_installer.sh puts on a host today" | EfaDevice.tsx:706-710 | STALE | as I-01 | as I-01 |
| I-03 | "shipped" badge: installer 1.49.0 upgrades to libfabric 2.4.0amzn5.0 | Libfabric.tsx:982-985 | STALE | as I-01 | Installer 1.51.0 ships libfabric 2.7.0amzn2.0 (an AWS fork of upstream v2.7.0) |
| I-04 | "Installer 1.49.0 ships driver 3.1.0 while the repository is at r3.3.0"; 1.49.0 hosts lack 0xefa4 | Operations.tsx:1127-1130 | STALE | as I-01; AL `kernel/linux/efa/conf/dkms.conf#L2` [T1 code] | The gap is now installer 1.51.0 driver 3.3.1 vs repository r3.4.0. 0xefa4 ships in every installer from 1.50.0 (driver 3.3.0). The 1.49.0 statement stays true but is no longer the current example |
| I-05 | Driver gap 3.1.0 vs r3.3.0; userspace gap 2.4.0amzn5.0 vs upstream v2.6.0 | EfaDevice.tsx:730-735 | STALE | as I-01 and I-04 | Driver: 3.3.1 (installer) vs r3.4.0 (repository). Userspace: 2.7.0amzn2.0 (installer) vs v2.7.0 (upstream), same base version for the first time in this dive's history |
| I-06 | "r3.3.0 is not in the shipping installer" | EfaDevice.tsx:779-782 | STALE | as I-01 | r3.3.0 shipped in installer 1.50.0; 1.51.0 ships 3.3.1. "0xefa4 was added in driver r3.3.0 alongside 800 and 1600 Gbps link-speed reporting" still holds |
| I-07 | Header: the two channels "disagree by two releases right now" | Operations.tsx:1092 | STALE | as I-04 | Driver channels now differ by one minor release (3.3.1 vs 3.4.0) |
| I-08 | "None of that is in the installer" (0xefa4, 800/1600 Gbps, completion counters, MR pages above 4 GB) | Operations.tsx:1116-1120 | STALE | as I-01 | All of it is in installer 1.50.0 and later (driver 3.3.0 / 3.3.1) |
| I-09 | `--minimal` excludes exactly libfabric, openmpi, libnccl-ofi and efa-profile; flags as described | EKSIntegration.tsx:409, 750 | CORRECT | `efa_installer.sh` in the 1.50.0 and 1.51.0 tarballs: identical `--minimal` block and identical set of 37 long options [T1 artefact] | None for the mechanism. "versions read from 1.49.0" (L419) and "libnccl-ofi-1.20.0" (L763) are scoped to 1.49.0 and correct as scoped; current is libnccl-ofi 1.22.0 |
| I-10 | Checksum example uses aws-efa-installer-1.49.0.tar.gz | Operations.tsx:1157 | STALE | as I-01 | Use 1.51.0 in the example, or a placeholder version |
| I-11 | (absent) Installer drops Debian 11; NGC handling falls back to a standard install on non-Ubuntu containers | n/a | NEW | 1.51.0 `ChangeLog.md` and `efa_installer.sh` diff vs 1.50.0 [T1 artefact] | 1.51.0 refuses Debian 11 (last supporting version 1.50.0). With NGC handling active on a non-Ubuntu container it prints "This container is not Ubuntu..." and installs the standard packages, including the NCCL plugin |
| D-01 | amzn-drivers tree "is at" / "carries" driver r3.3.0 (DKMS config) | Operations.tsx:1116; EfaDevice.tsx:718 | STALE | AL `kernel/linux/efa/conf/dkms.conf#L2` `PACKAGE_VERSION="3.4.0"`; AL `kernel/linux/efa/src/efa_main.c#L42-L53` minor 4 [T1 code] | The tree is at r3.4.0 (tag efa_linux_3.4.0, Oct 14, 2026), whose notes add MR PCIe relaxed ordering, RQ/CQ contiguous allocation and two admin-queue race fixes; r3.3.1 (Sep 6, 2026) added 128-byte admin commands |
| D-02 | Driver defines and registers five PCI ids 0xefa0-0xefa4 (61344-61348) | EfaDevice.tsx:770; Operations.tsx:601; EnaVsEfa.tsx:411 | CORRECT | AL `kernel/linux/efa/src/efa_main.c#L27-L39` [T1 code] | none |
| D-03 | r3.3.0 release notes: 0xefa4, 800/1600 Gbps reporting, completion counters, 64-bit WR ids, 128-byte SQ WQEs, inline RDMA write, MR page sizes above 4 GB | EfaDevice.tsx:681, 718-724 | CORRECT | AL `kernel/linux/efa/RELEASENOTES.md` (r3.3.0 entry intact) [orientation] | none |
| D-04 | Kernel-verbs data-path file (post_send, post_recv, poll_cq, req notify), registered behind a kverbs guard that is ON by default and left on by the DKMS script | DataPath.tsx:546-557 | CORRECT | AL `kernel/linux/efa/src/efa_data_verbs.c#L331-L763`, `efa_main.c#L553-L561`, `CMakeLists.txt#L36`, `conf/configure-dkms.sh` [T1 code] | none (new lines only) |
| D-05 | Driver takes the P2P path when the registered range is accelerator memory | DataPath.tsx:821-827 | CORRECT | AL `kernel/linux/efa/src/efa_verbs.c#L2854` and `#L2785-L2813` [T1 code] | Add: since r3.3.1 the P2P registration is rejected unless the buffer address and the IOVA share the same offset within the P2P page size (`efa_p2p_get_and_validate`, L2801) |
| D-06 | RDMA read/write are device operations gated by device capability bits | DataPath.tsx (deviceCaps, capMasks) | CORRECT | AL `kernel/linux/efa/src/efa_admin_cmds_defs.h#L689-L709` and `#L1230-L1233` [T1 code] | none |
| D-07 | ENA and SRD-stat citations (ENA PCI ids, SRD stats, ethtool hooks, LLQ) | EnaVsEfa.tsx:36-59; SrdProtocol.tsx:48-60 | CORRECT | AL tree; ENA code at the new SHA is identical to tag ena_linux_2.17.4 [T1 code] | none; only `ena_ethtool.c` L2020-L2022 moves to L2022-L2024 |
| D-08 | (absent) MR PCIe relaxed ordering | n/a | NEW | AL `kernel/linux/efa/src/efa_io_defs.h` (`flags_2`, `relaxed_ordering_enable`) and `efa_data_verbs.c` [T1 code]; LF `prov/efa/src/fi_ext_efa.h#L157` `FI_EFA_MR_RELAXED_ORDERING (1ULL << 61)` [T1 code]; LF `man/fi_efa.7.md#L264-L270` [orientation] | Driver r3.4.0 can register MRs with PCIe relaxed ordering; libfabric 2.7.0 exposes it as the `fi_mr_reg` flag FI_EFA_MR_RELAXED_ORDERING. By default the device orders all data transactions to an MR; the flag gives up that guarantee |
| L-01 | Data Path Direct on by default, disabled with FI_EFA_USE_DATA_PATH_DIRECT=0, bypasses rdma-core on the data path only | Libfabric.tsx:1032-1038; DataPath.tsx:660-666 | CORRECT | LF `prov/efa/src/efa_env.c#L42` and `#L249-L253`; `prov/efa/src/efa_data_path_ops.h#L223-L226` [T1 code] | none |
| L-02 | rdma-core still owns setup (`efadv_query_qp_wqs`, query CQ); build gate needs both queries | DataPath.tsx:669-678 | CORRECT | LF `prov/efa/src/efa_data_path_direct.c#L83-L101`; `prov/efa/configure.m4#L329-L334` [T1 code] | none |
| L-03 | Direct path turns itself off on first-generation devices (vendor part id) | DataPath.tsx:697-700 | CORRECT | LF `prov/efa/src/efa_device.c#L605-L610` [T1 code] | none |
| L-04 | FI_EFA_GDA_OPS on efa-direct only; handler returns not-supported on other fabrics | Libfabric.tsx:676-683 | CORRECT | LF `prov/efa/src/efa_domain.c#L691-L698` and `#L792-L812`; `man/fi_efa.7.md#L339-L359` [T1 code] | none |
| L-05 | efa-direct "requires the FI_CONTEXT2 mode" | Libfabric.tsx:668 | STALE (and now a doc-code conflict) | LF `prov/efa/src/efa_prov_info.c#L241-L245`, `prov/efa/src/efa_user_info.c#L555-L581` [T1 code] vs LF `man/fi_efa.7.md#L75-L78` [orientation] | From libfabric 2.7.0, FI_CONTEXT2 is optional on efa-direct: without it the endpoint does not use the caller's context buffer and inject is disabled (inject_size 0). The man page still says it is required; the code wins. Cite the Modes paragraph, not L33-L57 |
| L-06 | Receive-window help says 16384, initialiser is 16 (doc-code conflict) | Libfabric.tsx:1109-1118; SrdProtocol.tsx:1098 | CORRECT | LF `prov/efa/src/efa_env.c#L189-L190` and `#L18`; `prov/efa/src/rdm/efa_rdm_peer.h#L12` [T1 code] | none; the conflict string's "line 188" becomes "line 189" |
| L-07 | SHM AV size help says 128, initialiser 256 | Libfabric.tsx:1120-1126 | CORRECT | LF `prov/efa/src/efa_env.c#L17` and `#L187-L188` [T1 code] | none |
| L-08 | MR cache opens only without FI_MR_LOCAL and with the cache enabled | Libfabric.tsx:841-845; DataPath.tsx:789-791 | CORRECT | LF `prov/efa/src/rdm/efa_rdm_domain.c#L55-L68` [T1 code] | none; path changes (file split) |
| L-09 | Error codes 4124 and 4126 are libfabric's own unresponsive-receiver codes | SrdProtocol.tsx:740-743 | CORRECT | LF `prov/efa/src/efa_errno.h#L109-L112` [T1 code] | none |
| L-10 | (absent) New provider error 4127 PEER_ABORTED and the MR-abort contract | n/a | NEW | LF `prov/efa/src/efa_errno.h#L112`; `man/fi_efa.7.md#L146-L151` [T1 code / orientation] | 4127 PEER_ABORTED: "Operation aborted because the peer closed its memory registration or endpoint mid-transfer". MR-abort behaviour is undefined unless both peers run libfabric 2.7.0 or later |
| L-11 | (absent) Hardware counters on by default; high-PPS gate removed; 64-bit SQ request ids on | n/a | NEW | LF `prov/efa/src/efa_env.c#L45-L46` and `#L57-L66` [T1 code] | FI_EFA_USE_HW_CNTR now defaults to 1 and FI_EFA_USE_SQ_REQ_ID_64_BIT (new) to 1; both are read with getenv and do not appear in `fi_info -e`. FI_EFA_ENABLE_HIGH_PPS no longer exists |
| L-12 | (absent) Endpoint modification extension on efa-direct | n/a | NEW | LF `prov/efa/src/efa_domain.c#L813-L822`; `man/fi_efa.7.md#L588-L600` [T1 code] | `fi_open_ops(..., FI_EFA_MODIFY_EP_OPS, ...)` returns `modify_ep(ep, attr, mask)` to change endpoint attributes after enable; efa-direct only, -FI_EOPNOTSUPP elsewhere |
| L-13 | Every FI_EFA_* variable the dive names | various | CORRECT | LF tree grep, 19 names present in the same files [T1 code] | none |
| P-01 | GDAKI selected by OFI_NCCL_GIN_TYPE=GDAKI; plugin overwrites the exported GIN symbol | NcclOverEfa.tsx:1219-1226; Libfabric.tsx:684-690 | STALE | PL `include/nccl_ofi_param.h#L379-L399`; PL `src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L1256-L1274`; NC `src/plugin/gin.cc#L141-L147` [T1 code] | OFI_NCCL_GIN_TYPE was removed in v1.21.0. GDAKI is a separate export, `ncclGinPlugin_v14` "Libfabric_GDAKI", reporting device type EFA_GDA (5); NCCL picks it, and NCCL_GIN_TYPE=5 forces it. The plugin knob that remains is OFI_NCCL_GDAKI_EFA_HW_COUNTER (auto/on/off), an override for completion-counter use, not an enable switch |
| P-02 | "Plugin must be built with the GDAKI option" | NcclOverEfa.tsx:1220; Libfabric.tsx:685-686 | STALE | PL `configure.ac#L343-L351` [T1 code] | No configure flag: GDAKI is built automatically when libfabric declares FI_EFA_GDA_OPS, the completion-counter ABI is present and CUDA is the device interface; otherwise the build is proxy-only GIN |
| P-03 | GDAKI exported against NCCL's GIN interface version 13 | NcclOverEfa.tsx:1218 | STALE | PL `src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L1256`; PL `src/rdma/gin/nccl_ofi_gin_api.cpp#L566` and `#L595`; NC `src/include/plugin/nccl_gin.h#L37` [T1 code] | GDAKI: GIN v14. Proxy GIN: v11 and v13, name "Libfabric". NCCL 2.32 GIN API is v14 |
| P-04 | GDAKI reuses the proxy's efa-direct domain, opens FI_EFA_GDA_OPS, throws "(libfabric too old, or proxy selected non-efa-direct fabric)" | NcclOverEfa.tsx:1201-1214 | CORRECT | PL `src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L588-L681` [T1 code] | Now per rail; add the platform gate: GDAKI refuses on platforms without `efa_hw_comp_cntr` (true only for p5en, p6-b200, p6-b300) |
| P-05 | GIN subsystem: 7 implementation files, 9 headers | NcclOverEfa.tsx:1198-1200 | CORRECT | GitHub contents API at v1.22.0 [T1 code] | "consumer of the libfabric feature at release tag v1.20.0" becomes v1.22.0 |
| P-06 | Only tuner v2 bails out on NCCL_ALGO/NCCL_PROTO; v3 and v6 use the plain initialiser; plugin exports v2, v3, v6 | NcclOverEfa.tsx:930-936, 968-972; AIMLTraining.tsx | CORRECT | PL `src/tuner/nccl_ofi_tuner.cpp#L140-L158`, `#L184-L188`, `#L242-L246`, `#L273-L277` [T1 code] | none |
| P-07 | (absent) v6 tuner now overrides chunk size | n/a | NEW | PL `src/tuner/nccl_ofi_tuner.cpp#L224-L246` [T1 code] | `getChunkSize` is implemented (was nullptr): where the tuner context has a chunk-size function, NCCL 2.30.3+ takes the plugin's chunk size; otherwise NCCL keeps its own |
| P-08 | "p5en and p6-b200 share an entry" | NcclOverEfa.tsx:797-800 | STALE | PL `src/platform-aws.cpp#L139-L220` [T1 code] | p5en, p6-b200 and p6-b300 are separate rows. p5en and p6-b200 keep 35 us latency and NCCL_NETDEVS_POLICY=max:1; p6-b200 and p6-b300 also inject NCCL_IB_HCA=invalid so NCCL's internal IB transports skip the baseboard ConnectX-7 bridge (L81-L85) |
| P-09 | Platform-table values for p4d/p4de, p5/p5e, p-series catch-all, Trainium, Inferentia; NCCL_BUFFSIZE=8388608 and NCCL_P2P_NET_CHUNKSIZE=524288 inserted | NcclOverEfa.tsx:788-812; Libfabric.tsx:766-770 | CORRECT | PL `src/platform-aws.cpp#L87-L308` [T1 code] | Add p6-b300 to the list of rows that inject both values |
| P-10 | (absent) Eager path off by default | n/a | NEW | PL `include/nccl_ofi_param.h#L223-L229` [T1 code]; v1.22.0 release notes [orientation] | OFI_NCCL_EAGER_MAX_SIZE default changed from 8192 to -1 (eager messages disabled) in the RDMA protocol |
| P-11 | "Release v1.20.0 was tested with NCCL v2.28.9-1, v2.29.7-1, v2.30.4-1 ... libfabric 2.4.0" | NcclOverEfa.tsx:1104-1110 | CORRECT (scoped to v1.20.0) | PL `RELEASENOTES.md#L75-L81` [orientation] | At the new pin: v1.22.0 was tested with NCCL v2.32.3-1 and libfabric v2.7.0amzn2.0; backward compatible with NCCL v2.17.1+; same libfabric minimums (1.11.0 build, 1.22.0 AWS support); GIN kernel path needs libfabric 2.6.0+ |
| P-12 | Tuner maps product name to five platform constants (p5/p5e, p5en, p6-b200, p6-b300, unknown) | NcclOverEfa.tsx:953-957 | CORRECT | PL `include/tuner/nccl_ofi_tuner_process_config.h#L30-L53` [T1 code] | none |
| N-01 | NCCL parses NCCL_ALGO/NCCL_PROTO "at tuning time" and "zeroes the modelled bandwidth", making the time lookup return -1.0 | NcclOverEfa.tsx:984-992 | STALE (mechanism) | NC `src/tuning/cost_model.cc#L306-L345`, `#L371-L384`, `#L470-L497` [T1 code] | NCCL 2.32 parses the variables once at communicator init into per-function enable flags; at selection a disabled combination is dropped and marked NCCL_TUNING_IGNORE (-1.0). The outcome the dive describes (filter first, tuner second) is unchanged |
| N-02 | Order: init table, fill modelled times, call tuner, pick minimum | NcclOverEfa.tsx:991-995 | CORRECT (new code location) | NC `src/tuning/tuning.cc#L202-L231` [T1 code] | Cite src/tuning/tuning.cc; src/enqueue.cc and src/graph/tuning.cc no longer exist at these paths |
| N-03 | NCCL "picks the lowest non-ignored cost" | NcclOverEfa.tsx:923-925 | STALE (wording) | NC `src/tuning/tuning.cc#L155-L173` [T1 code] | NCCL picks the lowest-cost remaining candidate. [SPECULATIVE] no explicit >= 0 guard remains, so a tuner writing -1.0 into a valid cell would not remove it; the AWS tuner sets 0.0 and is unaffected |
| N-04 | NCCL_ALGO_PROTO_IGNORE is -1.0 | NcclOverEfa.tsx:990 | CORRECT | NC `src/include/plugin/nccl_tuner.h#L43-L44` [T1 code] | none |
| N-05 | NCCL 2.30.4 uses tuner v6 | NcclOverEfa.tsx:968-970 | CORRECT | NC `src/include/plugin/nccl_tuner.h#L25` [T1 code] | NCCL 2.32.3 also binds v6 |
| N-06 | NCCL default NCCL_BUFFSIZE is 4 MiB | NcclOverEfa.tsx:720 | CORRECT | NC `src/init.cc#L1006` [T1 code] | none |
| N-07 | cmpScore ordering and "converge even if it times out" comment | NcclOverEfa.tsx:1052-1060; AIMLTraining.tsx | CORRECT | NC `src/graph/search.cc#L190-L212`, `#L251-L291` [T1 code] | none |
| N-08 | NCCL appends internal IB and Socket plugins after external ones; logs "Failed to initialize NET plugin" | Operations.tsx:762-765, 780-783 | CORRECT | NC `src/plugin/net.cc#L332-L333`, `#L229` [T1 code] | Same text, now logged at the new ATTN level instead of INFO |
| N-09 | (absent) NCCL GIN selection | n/a | NEW | NC `src/plugin/gin.cc#L141-L169`; `src/include/nccl_device/core.h#L74-L78` [T1 code] | NCCL_GIN_TYPE picks a GIN backend by device type (PROXY 2, GDAKI 3, GPI 4, EFA_GDA 5). NCCL 2.32 skips an external plugin's proxy GIN and runs its own GIN proxy over the RMA backend |
| K-01 | Mainline driver's ops table stops at the control plane; no data-path file | DataPath.tsx:561-564 | CORRECT | LX `drivers/infiniband/hw/efa/efa_main.c#L369-L413` [T1 code] | none; mainline 7.3 adds five completion-counter ops, all control-plane |
| K-02 | (implicit) mainline device ids | not claimed on the page | NEW | LX `drivers/infiniband/hw/efa/efa_main.c#L16-L20`, `#L27` [T1 code] | Mainline gained 0xefa4 in Linux 7.3 (Oct 18, 2026); at the old pin it stopped at 0xefa3 |
| R-01 | (implicit) userspace provider device match | not claimed on the page | UNKNOWN | https://github.com/linux-rdma/rdma-core/blob/v65.0/providers/efa/efa.c#L20-L27 [T1 code] | rdma-core added 0xefa4 to its PCI table in v64.0 (installer 1.50.0); the table also matches by kernel driver id, so practical impact for rdma-core 63.0 on an 0xefa4 host is not established |
## Pin-move table

Columns: file:line of the citation | constant and cited file/lines | old ref | new ref |
path:lines at new ref | verified. "verified yes" means the cited block was fetched at both refs
and compared line-for-line (r23).
Pin recommendations (r23). Every citation on every pin below was re-fetched at the new ref and
compared line by line, so each move satisfies the pin policy. Moves that point at changed code
also need the prose changes in the claim register.

| Repo | Constants to change | Old ref | New ref | Citations verified | Prose changes required first |
|---|---|---|---|---|---|
| amzn/amzn-drivers | Operations.tsx `DRIVER_SHA`, EfaDevice.tsx `DRIVER_SHA`, DataPath.tsx `AMZN`, EnaVsEfa.tsx `DRIVERS_SHA`, SrdProtocol.tsx `DRIVERS` | b99452b70756b1b394b1e7ff238d4efbdca44c5b (efa_linux_3.3.0) | 9d5ca4021f7c9f8421e404c1e89edb0b1325372c (efa_linux_3.4.0) | 74 of 74 | D-01 ("r3.3.0" -> "r3.4.0" wherever it describes the repository); D-05 optional |
| ofiwg/libfabric | Operations/EfaDevice/Libfabric/AIMLTraining/NcclOverEfa `LIBFABRIC_TAG`, DataPath `LF`, SrdProtocol `LIBFABRIC` | v2.6.0 | v2.7.0 | 77 of 77 (2 commit pins kept) | L-05 (FI_CONTEXT2); the `conflict=` string line number in L-06 |
| aws/aws-ofi-nccl | `PLUGIN_TAG` in AIMLTraining, EfaDevice, Libfabric, NcclOverEfa, Operations; TopologyApi inline `ref: 'v1.20.0'` x2 | v1.20.0 | v1.22.0 (v1.21.1 also verified) | 71 of 71 (3 commit pins kept) | P-01, P-02, P-03, P-08; `ginSwitch`, `paramGin`, `ginExport` must be re-pointed to the replacement evidence, because the cited code no longer exists |
| NVIDIA/nccl | `NCCL_TAG` in AIMLTraining and NcclOverEfa (v2.30.4-1) and Operations (v2.28.9-1); Sources.tsx id 32 URL (v2.30.7-1) | v2.30.4-1, v2.28.9-1, v2.30.7-1 | v2.32.3-1 | 17 of 17 plus the Sources URL (`NCCL_221`, `NCCL_222` kept) | N-01, N-03; seven citations change path (`src/enqueue.cc` and `src/graph/tuning.cc` -> `src/tuning/`) |
| torvalds/linux | DataPath.tsx `LINUX` | 2d2338c93da79b3bfe4b6099a931d9468d539952 | v7.3 (c03c1a14507dfaf8b856c2608f9ac216021fc222) | 1 of 1 | none |

Comments in source that name the old release (for example `Operations.tsx` L36 "One of the three
NCCL releases aws-ofi-nccl v1.20.0 states it was tested against", and the "Master has since moved
past it" comment above `DRIVER_SHA`) need to move with the constants.
### amzn/amzn-drivers (74 citations, efa_linux_3.3.0 -> efa_linux_3.4.0)

| File:line | Constant, citation | Old ref | New ref | Path:lines at new ref | Verified |
|---|---|---|---|---|---|
| DataPath.tsx:47 | AMZN `efa_data_verbs.c` L324-L756 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_data_verbs.c:L331-L763 | yes (moved) |
| DataPath.tsx:48 | AMZN `efa_main.c` L551-L559 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L553-L561 | yes (moved) |
| DataPath.tsx:49 | AMZN `efa_main.c` L474-L547 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L476-L549 | yes (moved) |
| DataPath.tsx:50 | AMZN `CMakeLists.txt` L36 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/CMakeLists.txt:L36 | yes |
| DataPath.tsx:51 | AMZN `configure-dkms.sh` - | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/conf/configure-dkms.sh (file identical) | yes |
| DataPath.tsx:52 | AMZN `efa_io_defs.h` L23-L93 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_io_defs.h:L23-L93 | yes |
| DataPath.tsx:53 | AMZN `efa_admin_cmds_defs.h` L726-L746 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L689-L709 | yes (moved) |
| DataPath.tsx:54 | AMZN `efa_admin_cmds_defs.h` L1296-L1299 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L1230-L1233 | yes (moved) |
| DataPath.tsx:55 | AMZN `efa_verbs.c` L40-L42 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L40-L42 | yes |
| DataPath.tsx:56 | AMZN `efa_verbs.c` L879-L923 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L880-L924 | yes (moved) |
| DataPath.tsx:57 | AMZN `efa_verbs.c` L1763-L1775 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L1765-L1777 | yes (moved) |
| DataPath.tsx:58 | AMZN `efa_verbs.c` L3343-L3382 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L3385-L3424 | yes (moved) |
| DataPath.tsx:59 | AMZN `efa.h` L89-L99 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa.h:L89-L99 | yes |
| DataPath.tsx:60 | AMZN `efa_verbs.c` L1333 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L1334 | yes (moved) |
| DataPath.tsx:61 | AMZN `efa_verbs.c` L2814 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L2854 (call site in efa_reg_mr, now `efa_p2p_get_and_validate`); helper body L2785-L2813, inner `efa_p2p_get` call L2791 | yes (content changed) |
| DataPath.tsx:62 | AMZN `efa_verbs.c` L2707-L2754 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L2715-L2762 | yes (moved) |
| EfaDevice.tsx:82 | DRIVER_SHA `efa_main.c` L27-L39 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L27-L39 | yes |
| EfaDevice.tsx:83 | DRIVER_SHA `efa_verbs.c` L350-L359 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L350-L359 | yes |
| EfaDevice.tsx:84 | DRIVER_SHA `efa_verbs.c` L2628-L2636 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L2636-L2644 | yes (moved) |
| EfaDevice.tsx:85 | DRIVER_SHA `dkms.conf` - | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/conf/dkms.conf (whole-file cite; content changed, see claim register) | yes (content changed) |
| EfaDevice.tsx:86 | DRIVER_SHA `RELEASENOTES.md` - | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/RELEASENOTES.md (whole-file cite; content changed, see claim register) | yes (content changed) |
| Operations.tsx:94 | DRIVER_SHA `src` - | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/ (directory exists) | yes |
| Operations.tsx:95 | DRIVER_SHA `efa_verbs.c` L74-L96 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L74-L96 | yes |
| Operations.tsx:96 | DRIVER_SHA `efa_verbs.c` L54-L66 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L54-L66 | yes |
| Operations.tsx:97 | DRIVER_SHA `efa_verbs.c` L68-L72 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L68-L72 | yes |
| Operations.tsx:98 | DRIVER_SHA `efa_verbs.c` L3652-L3656 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L3694-L3698 | yes (moved) |
| Operations.tsx:99 | DRIVER_SHA `efa_verbs.c` L3708-L3715 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L3750-L3757 | yes (moved) |
| Operations.tsx:100 | DRIVER_SHA `efa_admin_cmds_defs.h` L664-L674 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L627-L637 | yes (moved) |
| Operations.tsx:101 | DRIVER_SHA `efa_admin_cmds_defs.h` L620-L632 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L583-L595 | yes (moved) |
| Operations.tsx:102 | DRIVER_SHA `efa_admin_cmds_defs.h` L70-L76 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L70-L76 | yes |
| Operations.tsx:103 | DRIVER_SHA `efa_main.c` L42-L53 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L42-L53 (DRV_MODULE_VER_MINOR 3 -> 4) | yes (content changed) |
| Operations.tsx:104 | DRIVER_SHA `efa_main.c` L27-L38 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L27-L38 | yes |
| Operations.tsx:105 | DRIVER_SHA `efa_sysfs.c` L34-L51 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_sysfs.c:L34-L51 | yes |
| Operations.tsx:106 | DRIVER_SHA `efa_nvmem_impl.h` L294-L306 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_nvmem_impl.h:L294-L306 | yes |
| Operations.tsx:107 | DRIVER_SHA `efa_neuronmem.c` L157-L166 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_neuronmem.c:L157-L166 | yes |
| Operations.tsx:108 | DRIVER_SHA `dkms.conf` - | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/conf/dkms.conf (whole-file cite; content changed, see claim register) | yes (content changed) |
| Operations.tsx:109 | DRIVER_SHA `RELEASENOTES.md` - | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/RELEASENOTES.md (whole-file cite; content changed, see claim register) | yes (content changed) |
| Operations.tsx:110 | DRIVER_SHA `ena_ethtool.c` L113-L119 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_ethtool.c:L113-L119 | yes |
| EnaVsEfa.tsx:36 | DRIVERS_SHA `ena_pci_id_tbl.h` L9-L43 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_pci_id_tbl.h:L9-L43 | yes |
| EnaVsEfa.tsx:37 | DRIVERS_SHA `efa_main.c` L27-L40 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L27-L40 | yes |
| EnaVsEfa.tsx:38 | DRIVERS_SHA `ena_netdev.c` L5979-L5982 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.c:L5979-L5982 | yes |
| EnaVsEfa.tsx:39 | DRIVERS_SHA `efa_main.c` L998-L1004 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L1003-L1009 | yes (moved) |
| EnaVsEfa.tsx:40 | DRIVERS_SHA `Makefile` L1-L17 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/Makefile:L1-L17 | yes |
| EnaVsEfa.tsx:41 | DRIVERS_SHA `Kbuild.in` L1-L2 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/Kbuild.in:L1-L2 | yes |
| EnaVsEfa.tsx:42 | DRIVERS_SHA `efa_main.c` L616-L655 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L618-L657 | yes (moved) |
| EnaVsEfa.tsx:43 | DRIVERS_SHA `efa-abi.h` L90 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa-abi.h:L90 | yes |
| EnaVsEfa.tsx:44 | DRIVERS_SHA `ena_netdev.h` L72-L74 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.h:L72-L74 | yes |
| EnaVsEfa.tsx:45 | DRIVERS_SHA `efa_main.c` L67-L69 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_main.c:L67-L69 | yes |
| EnaVsEfa.tsx:46 | DRIVERS_SHA `ena_eth_com.c` L95-L134 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_eth_com.c:L95-L134 | yes |
| EnaVsEfa.tsx:47 | DRIVERS_SHA `ena_netdev.c` L4291-L4303 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.c:L4291-L4303 | yes |
| EnaVsEfa.tsx:48 | DRIVERS_SHA `efa_verbs.c` L890-L902 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L891-L903 | yes (moved) |
| EnaVsEfa.tsx:49 | DRIVERS_SHA `efa_verbs.c` L1148-L1149 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L1149-L1150 | yes (moved) |
| EnaVsEfa.tsx:50 | DRIVERS_SHA `efa-abi.h` L115-L120 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa-abi.h:L115-L120 | yes |
| EnaVsEfa.tsx:51 | DRIVERS_SHA `ena_netdev.h` L76-L78 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.h:L76-L78 | yes |
| EnaVsEfa.tsx:52 | DRIVERS_SHA `ena_netdev.h` L56-L70 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.h:L56-L70 | yes |
| EnaVsEfa.tsx:53 | DRIVERS_SHA `ena_netdev.c` L1791-L1822 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.c:L1791-L1822 | yes |
| EnaVsEfa.tsx:54 | DRIVERS_SHA `ena_netdev.c` L1722-L1724 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.c:L1722-L1724 | yes |
| EnaVsEfa.tsx:55 | DRIVERS_SHA `ena_netdev.c` L5304-L5336 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_netdev.c:L5304-L5336 | yes |
| EnaVsEfa.tsx:56 | DRIVERS_SHA `ena_admin_defs.h` L512-L536 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_admin_defs.h:L512-L536 | yes |
| EnaVsEfa.tsx:57 | DRIVERS_SHA `ena_admin_defs.h` L162-L170 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_admin_defs.h:L162-L170 | yes |
| EnaVsEfa.tsx:58 | DRIVERS_SHA `ena_com.c` L2645-L2661 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_com.c:L2645-L2661 | yes |
| EnaVsEfa.tsx:59 | DRIVERS_SHA `ena_ethtool.c` L130-L135 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_ethtool.c:L130-L135 | yes |
| SrdProtocol.tsx:48 | DRIVERS `efa_io_defs.h` L87-L151 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_io_defs.h:L87-L151 | yes |
| SrdProtocol.tsx:49 | DRIVERS `efa_admin_cmds_defs.h` L215-L250 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L209-L244 (same fields; closing line now `} __attribute__((__packed__));`) | yes (content changed, cosmetic) |
| SrdProtocol.tsx:50 | DRIVERS `efa_admin_cmds_defs.h` L664-L674 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_admin_cmds_defs.h:L627-L637 | yes (moved) |
| SrdProtocol.tsx:51 | DRIVERS `efa_verbs.c` L74-L96 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_verbs.c:L74-L96 | yes |
| SrdProtocol.tsx:52 | DRIVERS `efa_io_defs.h` L36-L70 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_io_defs.h:L36-L70 | yes |
| SrdProtocol.tsx:53 | DRIVERS `ena_admin_defs.h` L512-L536 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_admin_defs.h:L512-L536 | yes |
| SrdProtocol.tsx:54 | DRIVERS `ena_admin_defs.h` L163-L170 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_admin_defs.h:L163-L170 | yes |
| SrdProtocol.tsx:55 | DRIVERS `ena_com.c` L2645-L2661 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_com.c:L2645-L2661 | yes |
| SrdProtocol.tsx:56 | DRIVERS `ena_com.h` L794-L801 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/common/ena_com/ena_com.h:L794-L801 | yes |
| SrdProtocol.tsx:58 | DRIVERS `ena_ethtool.c` L130-L136 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_ethtool.c:L130-L136 | yes |
| SrdProtocol.tsx:59 | DRIVERS `ena_ethtool.c` L2020-L2022 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/ena/ena_ethtool.c:L2022-L2024 | yes (moved) |
| SrdProtocol.tsx:60 | DRIVERS `efa_com_cmd.h` L127-L136 | b99452b7 (efa_linux_3.3.0) | 9d5ca402 (efa_linux_3.4.0) | kernel/linux/efa/src/efa_com_cmd.h:L127-L136 | yes |
### ofiwg/libfabric (77 citations, v2.6.0 -> v2.7.0)

| File:line | Constant, citation | Old ref | New ref | Path:lines at new ref | Verified |
|---|---|---|---|---|---|
| AIMLTraining.tsx:66 | LIBFABRIC_TAG `fi_ext_efa.h` L11 | v2.6.0 | v2.7.0 | prov/efa/src/fi_ext_efa.h:L11 | yes |
| AIMLTraining.tsx:67 | LIBFABRIC_TAG `efa_hmem.c` L54-L95 | v2.6.0 | v2.7.0 | prov/efa/src/efa_hmem.c:L54-L95 | yes |
| AIMLTraining.tsx:68 | LIBFABRIC_TAG `efa_prov_info.c` L633-L640 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov_info.c:L642-L649 | yes (moved) |
| DataPath.tsx:74 | LF `efa_data_path_direct.c` L82-L100 | v2.6.0 | v2.7.0 | prov/efa/src/efa_data_path_direct.c:L83-L101 (same `efadv_query_qp_wqs` call at L83; `efa_data_path_direct_wq_initialize` for the RQ gains a `false` argument) | yes (content changed) |
| DataPath.tsx:75 | LF `efa_data_path_direct.c` L186-L200 | v2.6.0 | v2.7.0 | prov/efa/src/efa_data_path_direct.c:L191-L205 | yes (moved) |
| DataPath.tsx:76 | LF `efa_data_path_direct.c` L130-L132 | v2.6.0 | v2.7.0 | prov/efa/src/efa_data_path_direct.c:L135-L137 | yes (moved) |
| DataPath.tsx:77 | LF `configure.m4` L317-L322 | v2.6.0 | v2.7.0 | prov/efa/configure.m4:L329-L334 | yes (moved) |
| DataPath.tsx:78 | LF `efa_env.c` L244-L249 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L249-L254 | yes (moved) |
| DataPath.tsx:79 | LF `efa_env.c` L41 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L42 | yes (moved) |
| DataPath.tsx:80 | LF `efa_data_path_ops.h` L216-L219 | v2.6.0 | v2.7.0 | prov/efa/src/efa_data_path_ops.h:L223-L226 | yes (moved) |
| DataPath.tsx:81 | LF `efa_data_path_direct_entry.h` L435-L445 | v2.6.0 | v2.7.0 | prov/efa/src/efa_data_path_direct_entry.h:L440-L450 (block occurs 3 times; this one is inside `efa_data_path_direct_post_send`, as before) | yes (moved) |
| DataPath.tsx:82 | LF `efa_device.c` L521-L526 | v2.6.0 | v2.7.0 | prov/efa/src/efa_device.c:L605-L610 | yes (moved) |
| DataPath.tsx:83 | LF `efa_domain.c` L115-L127 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_domain.c:L56-L68 (file split; same condition, now `rdm_domain->cache`, inside `efa_rdm_domain_init`) | yes (content changed) |
| DataPath.tsx:84 | LF `efa_rdm_mr.c` L28-L38 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_mr.c:L72-L82 | yes (moved) |
| DataPath.tsx:85 | LF `efa_env.c` L194-L201 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L195-L202 | yes (moved) |
| DataPath.tsx:86 | LF `efa_env.c` L24 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L24 | yes |
| EfaDevice.tsx:90 | LIBFABRIC_TAG `efa_device.c` L520-L526 | v2.6.0 | v2.7.0 | prov/efa/src/efa_device.c:L604-L610 | yes (moved) |
| Libfabric.tsx:56 | LIBFABRIC_TAG `fi_efa.7.md` - | v2.6.0 | v2.7.0 | man/fi_efa.7.md (whole-file cite; content changed, see claim register) | yes (content changed) |
| Libfabric.tsx:57 | LIBFABRIC_TAG `fi_efa.7.md` L12-L26 | v2.6.0 | v2.7.0 | man/fi_efa.7.md:L12-L26 | yes |
| Libfabric.tsx:58 | LIBFABRIC_TAG `fi_efa.7.md` L33-L57 | v2.6.0 | v2.7.0 | man/fi_efa.7.md:L33-L57 | yes |
| Libfabric.tsx:59 | LIBFABRIC_TAG `fi_efa.7.md` L81-L85 | v2.6.0 | v2.7.0 | man/fi_efa.7.md:L81-L85 | yes |
| Libfabric.tsx:60 | LIBFABRIC_TAG `fi_efa.7.md` L285-L305 | v2.6.0 | v2.7.0 | man/fi_efa.7.md:L339-L359 (same text under a new `### FI_EFA_GDA_OPS` heading at L337; typo "fabirc" fixed) | yes (content changed) |
| Libfabric.tsx:61 | LIBFABRIC_TAG `fi_efa.7.md` L676-L681 | v2.6.0 | v2.7.0 | man/fi_efa.7.md:L795-L800 | yes (moved) |
| Libfabric.tsx:62 | LIBFABRIC_TAG `fabric.7.md` L172-L195 | v2.6.0 | v2.7.0 | man/fabric.7.md:L172-L195 | yes |
| Libfabric.tsx:63 | LIBFABRIC_TAG `fabric.7.md` L211-L221 | v2.6.0 | v2.7.0 | man/fabric.7.md:L211-L221 | yes |
| Libfabric.tsx:64 | LIBFABRIC_TAG `fi_info.1.md` L72-L90 | v2.6.0 | v2.7.0 | man/fi_info.1.md:L72-L90 | yes |
| Libfabric.tsx:65 | LIBFABRIC_TAG `log.c` L179-L181 | v2.6.0 | v2.7.0 | src/log.c:L179-L181 | yes |
| Libfabric.tsx:66 | LIBFABRIC_TAG `efa_prov.c` L93-L176 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov.c:L93-L176 | yes |
| Libfabric.tsx:67 | LIBFABRIC_TAG `efa_user_info.c` L626-L668 | v2.6.0 | v2.7.0 | prov/efa/src/efa_user_info.c:L802-L844 | yes (moved) |
| Libfabric.tsx:68 | LIBFABRIC_TAG `efa.h` L62-L63 | v2.6.0 | v2.7.0 | prov/efa/src/efa.h:L62-L63 | yes |
| Libfabric.tsx:69 | LIBFABRIC_TAG `efa.h` L89-L92 | v2.6.0 | v2.7.0 | prov/efa/src/efa.h:L87-L90 | yes (moved) |
| Libfabric.tsx:70 | LIBFABRIC_TAG `efa_rdm_msg.c` L46-L102 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_msg.c:L47-L103 (same logic; accessor renamed to `efa_rdm_ep_rdm_domain`) | yes (content changed) |
| Libfabric.tsx:71 | LIBFABRIC_TAG `efa_rdm_msg.c` L209-L212 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_msg.c:L210-L213 | yes (moved) |
| Libfabric.tsx:72 | LIBFABRIC_TAG `efa_hmem.c` L40-L116 | v2.6.0 | v2.7.0 | prov/efa/src/efa_hmem.c:L40-L116 | yes |
| Libfabric.tsx:73 | LIBFABRIC_TAG `efa_env.c` L170-L262 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L171-L267 (adds `rdm_txe_pool_size`; typo fixes; recvwin help still "(Default: 16384)" at L189-L190, data-path-direct help unchanged at L249-L253) | yes (content changed) |
| Libfabric.tsx:74 | LIBFABRIC_TAG `efa_env.c` L11-L46 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L11-L47 (`use_hw_cntr` 0 -> 1; `enable_high_pps` removed; `rdm_txe_pool_size` and `use_sq_req_id_64_bit = 1` added; `shm_av_size = 256` and `recvwin_size` lines unchanged at L17-L18) | yes (content changed) |
| Libfabric.tsx:75 | LIBFABRIC_TAG `efa_env.c` L79-L96 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L79-L96 | yes |
| Libfabric.tsx:76 | LIBFABRIC_TAG `efa_env.c` L257-L261 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L262-L266 | yes (moved) |
| Libfabric.tsx:77 | LIBFABRIC_TAG `efa_domain.c` L114-L127 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_domain.c:L55-L68 (file split; same condition, now `rdm_domain->cache`) | yes (content changed) |
| Libfabric.tsx:78 | LIBFABRIC_TAG `efa_rdm_mr.c` L64-L169 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_mr.c:L108-L213 | yes (moved) |
| Libfabric.tsx:79 | LIBFABRIC_TAG `efa_rdm_mr.c` L111-L124 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_mr.c:L155-L168 | yes (moved) |
| Libfabric.tsx:80 | LIBFABRIC_TAG `efa_rdm_mr.c` L166-L167 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_mr.c:L210-L211 | yes (moved) |
| Libfabric.tsx:81 | LIBFABRIC_TAG `util_mem_monitor.c` L244-L270 | v2.6.0 | v2.7.0 | prov/util/src/util_mem_monitor.c:L244-L270 | yes |
| Libfabric.tsx:82 | LIBFABRIC_TAG `util_mr_cache.c` L48-L54 | v2.6.0 | v2.7.0 | prov/util/src/util_mr_cache.c:L48-L54 | yes |
| Libfabric.tsx:83 | LIBFABRIC_TAG `efa_fork_support.c` L12-L62 | v2.6.0 | v2.7.0 | prov/efa/src/efa_fork_support.c:L13-L63 | yes (moved) |
| Libfabric.tsx:84 | LIBFABRIC_TAG `efa_fork_support.c` L157-L192 | v2.6.0 | v2.7.0 | prov/efa/src/efa_fork_support.c:L158-L193 | yes (moved) |
| Libfabric.tsx:85 | LIBFABRIC_TAG `efa_rdm_peer.h` L12 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_peer.h:L12 | yes |
| Libfabric.tsx:86 | LIBFABRIC_TAG `efa_domain.c` L868-L897 | v2.6.0 | v2.7.0 | prov/efa/src/efa_domain.c:L691-L698 (`efa_ops_gda` table, unchanged) and L792-L812 (`efa_domain_ops_open` GDA branch, unchanged); `efa_domain_modify_ep` (new) sits between them; new `FI_EFA_MODIFY_EP_OPS` branch follows at L813-L822 | yes (content changed) |
| NcclOverEfa.tsx:144 | LIBFABRIC_TAG `fi_ext_efa.h` L11 | v2.6.0 | v2.7.0 | prov/efa/src/fi_ext_efa.h:L11 | yes |
| Operations.tsx:111 | LIBFABRIC_TAG `efa.h` L62-L63 | v2.6.0 | v2.7.0 | prov/efa/src/efa.h:L62-L63 | yes |
| Operations.tsx:112 | LIBFABRIC_TAG `efa_prov.c` L106-L133 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov.c:L106-L133 | yes |
| Operations.tsx:113 | LIBFABRIC_TAG `efa_prov_info.c` L346-L356 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov_info.c:L357-L367 | yes (moved) |
| Operations.tsx:114 | LIBFABRIC_TAG `efa_rdm_mr.c` L141-L152 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_mr.c:L185-L196 | yes (moved) |
| Operations.tsx:115 | LIBFABRIC_TAG `efa_rdm_mr.c` L111-L126 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_mr.c:L155-L170 | yes (moved) |
| Operations.tsx:116 | LIBFABRIC_TAG `efa_fork_support.c` L30-L60 | v2.6.0 | v2.7.0 | prov/efa/src/efa_fork_support.c:L31-L61 | yes (moved) |
| Operations.tsx:117 | LIBFABRIC_TAG `fi_pingpong.1.md` - | v2.6.0 | v2.7.0 | man/fi_pingpong.1.md (file identical) | yes |
| Operations.tsx:118 | LIBFABRIC_TAG `fi_mr.3.md` L1054-L1080 | v2.6.0 | v2.7.0 | man/fi_mr.3.md:L1098-L1124 | yes (moved) |
| SrdProtocol.tsx:62 | LIBFABRIC `efa_errno.h` L58-L75 | v2.6.0 | v2.7.0 | prov/efa/src/efa_errno.h:L58-L75 | yes |
| SrdProtocol.tsx:63 | LIBFABRIC `efa_errno.h` L109-L111 | v2.6.0 | v2.7.0 | prov/efa/src/efa_errno.h:L109-L112 (4124 and 4126 unchanged; new 4127 PEER_ABORTED at L112) | yes (content changed) |
| SrdProtocol.tsx:64 | LIBFABRIC `efa_strerror.c` L63-L105 | v2.6.0 | v2.7.0 | prov/efa/src/efa_strerror.c:L63-L110 (adds a help case for FI_EFA_ERR_PEER_ABORTED) | yes (content changed) |
| SrdProtocol.tsx:65 | LIBFABRIC `efa_rdm_util.c` L111-L144 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_util.c:L111-L144 | yes |
| SrdProtocol.tsx:66 | LIBFABRIC `efa_rdm_ope.c` L649-L655 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_ope.c:L675-L681 | yes (moved) |
| SrdProtocol.tsx:67 | LIBFABRIC `efa_prov.h` L13 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov.h:L13 | yes |
| SrdProtocol.tsx:68 | LIBFABRIC `fabric.7.md` L174-L221 | v2.6.0 | v2.7.0 | man/fabric.7.md:L174-L221 | yes |
| SrdProtocol.tsx:69 | LIBFABRIC `efa_env.c` L36 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L36 | yes |
| SrdProtocol.tsx:70 | LIBFABRIC `efa_prov_info.c` L26 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov_info.c:L26 | yes |
| SrdProtocol.tsx:71 | LIBFABRIC `efa_prov_info.c` L633-L640 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov_info.c:L642-L649 | yes (moved) |
| SrdProtocol.tsx:72 | LIBFABRIC `efa_prov_info.c` L677-L680 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov_info.c:L686-L689 | yes (moved) |
| SrdProtocol.tsx:73 | LIBFABRIC `efa_prov_info.c` L102-L108 | v2.6.0 | v2.7.0 | prov/efa/src/efa_prov_info.c:L102-L108 | yes |
| SrdProtocol.tsx:74 | LIBFABRIC `efa_rdm_peer.h` L95-L114 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_peer.h:L106-L125 (robuf and overflow_pke_list unchanged; comments now say the RNR backoff and handshake queues hang off `efa_rdm_ep`, not `efa_domain`) | yes (content changed) |
| SrdProtocol.tsx:75 | LIBFABRIC `efa_rdm_peer.h` L12 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_peer.h:L12 | yes |
| SrdProtocol.tsx:76 | LIBFABRIC `efa_env.c` L18 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L18 | yes |
| SrdProtocol.tsx:77 | LIBFABRIC `efa_env.c` L188-L189 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L189-L190 | yes (moved) |
| SrdProtocol.tsx:78 | LIBFABRIC `efa_rdm_peer.h` L46-L66 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_peer.h:L46-L66 | yes |
| SrdProtocol.tsx:79 | LIBFABRIC `efa_rdm_peer.c` L31 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_peer.c:L40 | yes (moved) |
| SrdProtocol.tsx:80 | LIBFABRIC `efa_rdm_peer.c` L320 | v2.6.0 | v2.7.0 | prov/efa/src/rdm/efa_rdm_peer.c:L518 | yes (moved) |
| SrdProtocol.tsx:96 | LIBFABRIC `efa_env.c` L28 | v2.6.0 | v2.7.0 | prov/efa/src/efa_env.c:L28 | yes |

| SrdProtocol.tsx:82 | `tune16kTo8k` commit pin | 7232f8af12d0a7ad54cc571529e37c006cb3bc92 | keep (historical commit) | prov/efa/src/rdm/efa_rdm_peer.h (L13 reads `(8192)`) | yes |
| SrdProtocol.tsx:88 | `tune8kTo16` commit pin | bd987ab20e57 | keep (historical commit; consider expanding to the full 40-char SHA) | prov/efa/src/rdm/efa_rdm_peer.h (L12 reads `(16)`) | yes |
### aws/aws-ofi-nccl (71 citations, v1.20.0 -> v1.22.0; v1.21.1 line given where it differs)

| File:line | Constant, citation | Old ref | New ref | Path:lines at new ref | Verified |
|---|---|---|---|---|---|
| AIMLTraining.tsx:55 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L138-L156 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L140-L158 | yes (moved) |
| AIMLTraining.tsx:56 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L182-L186 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L184-L188 | yes (moved) |
| AIMLTraining.tsx:57 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L188-L227 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L190-L246 (v6 block; adds `nccl_ofi_tuner_get_chunk_size` L224-L239 and `.getChunkSize` is no longer nullptr, L242-L246) | yes (content changed) |
| AIMLTraining.tsx:59 | PLUGIN_TAG `nccl_ofi_rdma.cpp` - | v1.20.0 | v1.22.0 | src/nccl_ofi_rdma.cpp (whole-file cite; content changed, see claim register) | yes (content changed) |
| AIMLTraining.tsx:60 | PLUGIN_TAG `platform-aws.cpp` L959-L991 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L1087-L1119; v1.21.1: L1061-L1093 | yes (moved) |
| AIMLTraining.tsx:61 | PLUGIN_TAG `p4d-24xl-topo.xml` - | v1.20.0 | v1.22.0 | topology/p4d-24xl-topo.xml (file identical) | yes |
| AIMLTraining.tsx:62 | PLUGIN_TAG `g5.48xl-topo.xml` - | v1.20.0 | v1.22.0 | topology/g5.48xl-topo.xml (file identical) | yes |
| AIMLTraining.tsx:63 | PLUGIN_TAG `nccl_ofi_cuda.cpp` L84 | v1.20.0 | v1.22.0 | src/nccl_ofi_cuda.cpp:L105; v1.21.1: L89 | yes (moved) |
| AIMLTraining.tsx:64 | PLUGIN_TAG `nccl_ofi_cuda.cpp` L290 | v1.20.0 | v1.22.0 | src/nccl_ofi_cuda.cpp:L618; v1.21.1: L581 | yes (moved) |
| AIMLTraining.tsx:65 | PLUGIN_TAG `nccl_ofi_gin_gdaki.cpp` L145-L175 | v1.20.0 | v1.22.0 | src/rdma/gin/nccl_ofi_gin_gdaki.cpp:L588-L681 (rewritten per rail; same domain reuse and FI_EFA_GDA_OPS open, error text unchanged at L675-L678; new platform gate L665-L667) (v1.21.1 line range not hand-verified for this changed block) | yes (content changed) |
| AIMLTraining.tsx:69 | PLUGIN_TAG `efa-env-var.md` L28-L69 | v1.20.0 | v1.22.0 | doc/efa-env-var.md:L28-L69 | yes |
| EfaDevice.tsx:87 | PLUGIN_TAG `nccl_ofi_platform.h` L82-L97 | v1.20.0 | v1.22.0 | include/nccl_ofi_platform.h:L84-L99 | yes (moved) |
| EfaDevice.tsx:88 | PLUGIN_TAG `platform-aws.cpp` L961-L991 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L1089-L1119; v1.21.1: L1063-L1093 | yes (moved) |
| EfaDevice.tsx:89 | PLUGIN_TAG `platform-aws.cpp` L939-L959 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L1042-L1062; v1.21.1: L1016-L1036 | yes (moved) |
| Libfabric.tsx:87 | PLUGIN_TAG `nccl_ofi_gin_gdaki.cpp` L112-L174 | v1.20.0 | v1.22.0 | src/rdma/gin/nccl_ofi_gin_gdaki.cpp:L588-L681 (rewritten per rail; same domain reuse and FI_EFA_GDA_OPS open, error text unchanged at L675-L678) (v1.21.1 line range not hand-verified for this changed block) | yes (content changed) |
| Libfabric.tsx:88 | PLUGIN_TAG `nccl_ofi_gin_api.cpp` L90-L118 | v1.20.0 | v1.22.0 | REMOVED: the OFI_NCCL_GIN_TYPE switch no longer exists. Replacement evidence: GDAKI exported separately as `ncclGinPlugin_v14` "Libfabric_GDAKI" at src/rdma/gin/nccl_ofi_gin_gdaki.cpp:L1256-L1274; proxy as v11/v13 at src/rdma/gin/nccl_ofi_gin_api.cpp:L566 and L595; build gate configure.ac:L343-L351 | yes (cited code removed) |
| Libfabric.tsx:89 | PLUGIN_TAG `platform-aws.cpp` L129-L167 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L139-L220 (p5/p5e, p5en, p6-b200, p6-b300 rows; p5en and p6-b200 now separate; NCCL_BUFFSIZE and NCCL_P2P_NET_CHUNKSIZE values unchanged) (v1.21.1 line range not hand-verified for this changed block) | yes (content changed) |
| Libfabric.tsx:90 | PLUGIN_TAG `nccl_ofi_environ.h` L47-L58 | v1.20.0 | v1.22.0 | include/nccl_ofi_environ.h:L47-L58 | yes |
| Libfabric.tsx:91 | PLUGIN_TAG `nccl_ofi_scheduler.cpp` L77-L133 | v1.20.0 | v1.22.0 | src/nccl_ofi_scheduler.cpp:L77-L133 | yes |
| Libfabric.tsx:92 | PLUGIN_TAG `nccl_ofi_param.h` L157-L166 | v1.20.0 | v1.22.0 | include/nccl_ofi_param.h:L157-L166 | yes |
| Libfabric.tsx:93 | PLUGIN_TAG `efa-env-var.md` - | v1.20.0 | v1.22.0 | doc/efa-env-var.md (file identical) | yes |
| NcclOverEfa.tsx:74 | PLUGIN_TAG `nccl_ofi_interface_nvidia.cpp` L661-L830 | v1.20.0 | v1.22.0 | src/nccl_ofi_interface_nvidia.cpp:L661-L830 | yes |
| NcclOverEfa.tsx:75 | PLUGIN_TAG `nccl_ofi_interface_neuron.cpp` L323-L390 | v1.20.0 | v1.22.0 | src/nccl_ofi_interface_neuron.cpp:L323-L390 | yes |
| NcclOverEfa.tsx:76 | PLUGIN_TAG `Makefile.am` L160-L190 | v1.20.0 | v1.22.0 | src/Makefile.am:L169-L199; v1.21.1: L196-L226 | yes (moved) |
| NcclOverEfa.tsx:77 | PLUGIN_TAG `Makefile.am` L11 | v1.20.0 | v1.22.0 | src/Makefile.am:L10; v1.21.1: L11 | yes (moved) |
| NcclOverEfa.tsx:78 | PLUGIN_TAG `nccl_ofi_net.cpp` L188-L195 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L188-L195 | yes |
| NcclOverEfa.tsx:79 | PLUGIN_TAG `nccl_ofi_net.cpp` L644-L654 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L644-L654 | yes |
| NcclOverEfa.tsx:80 | PLUGIN_TAG `nccl_ofi_net.cpp` L622-L625 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L622-L625 | yes |
| NcclOverEfa.tsx:81 | PLUGIN_TAG `nccl_ofi_net.cpp` L963-L969 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L963-L969 | yes |
| NcclOverEfa.tsx:82 | PLUGIN_TAG `nccl_ofi_net.cpp` L405-L412 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L405-L412 | yes |
| NcclOverEfa.tsx:84 | PLUGIN_TAG `platform-aws.cpp` L584-L597 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L687-L700; v1.21.1: L661-L674 | yes (moved) |
| NcclOverEfa.tsx:85 | PLUGIN_TAG `platform-aws.cpp` L81-L250 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L87-L308 (whole table; adds `efa_hw_comp_cntr` per row, splits p5en/p6-b200, adds p6-b300 row and `NCCL_IB_HCA=invalid` on p6-b200/p6-b300) (v1.21.1 line range not hand-verified for this changed block) | yes (content changed) |
| NcclOverEfa.tsx:86 | PLUGIN_TAG `platform-aws.cpp` L43-L48 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L43-L48 | yes |
| NcclOverEfa.tsx:87 | PLUGIN_TAG `nccl_ofi_system.cpp` L110-L140 | v1.20.0 | v1.22.0 | src/nccl_ofi_system.cpp:L110-L140 | yes |
| NcclOverEfa.tsx:88 | PLUGIN_TAG `nccl_ofi_system.cpp` L23-L24 | v1.20.0 | v1.22.0 | src/nccl_ofi_system.cpp:L23-L24 | yes |
| NcclOverEfa.tsx:89 | PLUGIN_TAG `platform-aws.cpp` L694-L709 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L797-L812; v1.21.1: L771-L786 | yes (moved) |
| NcclOverEfa.tsx:91 | PLUGIN_TAG `platform-aws.cpp` L661-L687 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L764-L790; v1.21.1: L738-L764 | yes (moved) |
| NcclOverEfa.tsx:92 | PLUGIN_TAG `nccl_ofi_rdma.cpp` L234-L303 | v1.20.0 | v1.22.0 | src/nccl_ofi_rdma.cpp:L230-L299; v1.21.1: L229-L298 | yes (moved) |
| NcclOverEfa.tsx:93 | PLUGIN_TAG `nccl_ofi_rdma.cpp` L7396-L7407 | v1.20.0 | v1.22.0 | src/nccl_ofi_rdma.cpp:L7199-L7210; v1.21.1: L7147-L7158 | yes (moved) |
| NcclOverEfa.tsx:94 | PLUGIN_TAG `nccl_ofi_topo.cpp` L1149-L1172 | v1.20.0 | v1.22.0 | src/nccl_ofi_topo.cpp:L1346-L1369; v1.21.1: L1259-L1282 | yes (moved) |
| NcclOverEfa.tsx:95 | PLUGIN_TAG `nccl_ofi_topo.cpp` L1128-L1145 | v1.20.0 | v1.22.0 | src/nccl_ofi_topo.cpp:L1325-L1342; v1.21.1: L1238-L1255 | yes (moved) |
| NcclOverEfa.tsx:96 | PLUGIN_TAG `nccl_ofi_topo.cpp` L998-L1005 | v1.20.0 | v1.22.0 | src/nccl_ofi_topo.cpp:L1195-L1202; v1.21.1: L1108-L1115 | yes (moved) |
| NcclOverEfa.tsx:97 | PLUGIN_TAG `platform-aws.cpp` L959-L991 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L1087-L1119; v1.21.1: L1061-L1093 | yes (moved) |
| NcclOverEfa.tsx:98 | PLUGIN_TAG `nccl_ofi_platform.h` L75-L97 | v1.20.0 | v1.22.0 | include/nccl_ofi_platform.h:L77-L99 | yes (moved) |
| NcclOverEfa.tsx:100 | PLUGIN_TAG `nccl_ofi_environ.h` L36-L58 | v1.20.0 | v1.22.0 | include/nccl_ofi_environ.h:L36-L58 | yes |
| NcclOverEfa.tsx:101 | PLUGIN_TAG `nccl_ofi_environ.h` L101-L110 | v1.20.0 | v1.22.0 | include/nccl_ofi_environ.h:L101-L110 | yes |
| NcclOverEfa.tsx:102 | PLUGIN_TAG `nccl_ofi_net.cpp` L412 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L412 | yes |
| NcclOverEfa.tsx:103 | PLUGIN_TAG `nccl_ofi_param.cpp` L10-L20 | v1.20.0 | v1.22.0 | src/nccl_ofi_param.cpp:L10-L20 | yes |
| NcclOverEfa.tsx:104 | PLUGIN_TAG `nccl_ofi_param.h` L266-L305 | v1.20.0 | v1.22.0 | include/nccl_ofi_param.h:L268-L307; v1.21.1: L267-L306 | yes (moved) |
| NcclOverEfa.tsx:105 | PLUGIN_TAG `nccl_ofi_param.h` L374-L390 | v1.20.0 | v1.22.0 | REMOVED: `GIN_TYPE` param gone; the slot now holds `GDAKI_EFA_HW_COUNTER` (AUTO|ON|OFF, default AUTO) at include/nccl_ofi_param.h:L379-L399 (v1.21.1 line range not hand-verified for this changed block) | yes (cited code removed) |
| NcclOverEfa.tsx:107 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L138-L156 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L140-L158 | yes (moved) |
| NcclOverEfa.tsx:108 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L182-L186 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L184-L188 | yes (moved) |
| NcclOverEfa.tsx:109 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L188-L227 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L190-L246 (v6 block; adds `nccl_ofi_tuner_get_chunk_size` L224-L239 and `.getChunkSize` is no longer nullptr, L242-L246) | yes (content changed) |
| NcclOverEfa.tsx:110 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L254-L258 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L273-L277 | yes (moved) |
| NcclOverEfa.tsx:111 | PLUGIN_TAG `nccl_ofi_tuner.cpp` L47-L72 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_tuner.cpp:L47-L72 | yes |
| NcclOverEfa.tsx:112 | PLUGIN_TAG `nccl_ofi_tuner_process_config.h` L66-L79 | v1.20.0 | v1.22.0 | include/tuner/nccl_ofi_tuner_process_config.h:L66-L79 | yes |
| NcclOverEfa.tsx:113 | PLUGIN_TAG `nccl_ofi_tuner_process_config.h` L85-L111 | v1.20.0 | v1.22.0 | include/tuner/nccl_ofi_tuner_process_config.h:L85-L111 | yes |
| NcclOverEfa.tsx:114 | PLUGIN_TAG `nccl_ofi_tuner_process_config.h` L30-L53 | v1.20.0 | v1.22.0 | include/tuner/nccl_ofi_tuner_process_config.h:L30-L53 | yes |
| NcclOverEfa.tsx:115 | PLUGIN_TAG `nccl_ofi_regions.cpp` L2094-L2117 | v1.20.0 | v1.22.0 | src/tuner/nccl_ofi_regions.cpp:L2173-L2196; v1.21.1: L2105-L2128 | yes (moved) |
| NcclOverEfa.tsx:141 | PLUGIN_TAG `nccl_ofi_gin_gdaki.cpp` L145-L175 | v1.20.0 | v1.22.0 | src/rdma/gin/nccl_ofi_gin_gdaki.cpp:L588-L681 (rewritten per rail; same domain reuse and FI_EFA_GDA_OPS open, error text unchanged at L675-L678; new platform gate L665-L667) (v1.21.1 line range not hand-verified for this changed block) | yes (content changed) |
| NcclOverEfa.tsx:142 | PLUGIN_TAG `nccl_ofi_gin_api.cpp` L90-L118 | v1.20.0 | v1.22.0 | REMOVED: the OFI_NCCL_GIN_TYPE switch no longer exists. Replacement evidence: src/rdma/gin/nccl_ofi_gin_gdaki.cpp:L1256-L1274 (`ncclGinPlugin_v14`), src/rdma/gin/nccl_ofi_gin_api.cpp:L566 and L595 (proxy v11/v13), configure.ac:L343-L351 (automatic HAVE_GDAKI) | yes (cited code removed) |
| NcclOverEfa.tsx:143 | PLUGIN_TAG `nccl_ofi_gin_gdaki.h` L15 | v1.20.0 | v1.22.0 | REMOVED: `extern ncclGin_v13_t nccl_ofi_gin_gdaki_plugin;` no longer in the header. Replacement: src/rdma/gin/nccl_ofi_gin_gdaki.cpp:L1256 (`ncclGinPlugin_v14`) | yes (cited code removed) |
| NcclOverEfa.tsx:146 | PLUGIN_TAG `RELEASENOTES.md` L10-L16 | v1.20.0 | v1.22.0 | RELEASENOTES.md:L75-L81; v1.21.1: L55-L61 | yes (moved) |
| NcclOverEfa.tsx:147 | PLUGIN_TAG `efa-env-var.md` L28-L69 | v1.20.0 | v1.22.0 | doc/efa-env-var.md:L28-L69 | yes |
| Operations.tsx:119 | PLUGIN_TAG `nccl_ofi_net.cpp` L643-L646 | v1.20.0 | v1.22.0 | src/nccl_ofi_net.cpp:L643-L646 | yes |
| Operations.tsx:120 | PLUGIN_TAG `nccl_ofi_interface_nvidia.cpp` L802-L803 | v1.20.0 | v1.22.0 | src/nccl_ofi_interface_nvidia.cpp:L802-L803 | yes |
| Operations.tsx:121 | PLUGIN_TAG `nccl_ofi_rdma.cpp` L239-L299 | v1.20.0 | v1.22.0 | src/nccl_ofi_rdma.cpp:L235-L295; v1.21.1: L234-L294 | yes (moved) |
| Operations.tsx:122 | PLUGIN_TAG `platform-aws.cpp` L665-L687 | v1.20.0 | v1.22.0 | src/platform-aws.cpp:L768-L790; v1.21.1: L742-L764 | yes (moved) |
| Operations.tsx:123 | PLUGIN_TAG `efa-env-var.md` - | v1.20.0 | v1.22.0 | doc/efa-env-var.md (file identical) | yes |
| TopologyApi.tsx:158 | inline ref `hostfile-topologify.py` L110-L125 | v1.20.0 | v1.22.0 | contrib/scripts/topology_aware/hostfile-topologify.py:L110-L125 | yes |
| TopologyApi.tsx:165 | inline ref `topology-aware.md` L122-L149 | v1.20.0 | v1.22.0 | doc/topology-aware.md:L122-L149 | yes |
| NcclOverEfa.tsx:117-123 | `pluginCommit` d2040033, faf2e8f2, 3c2e20cf | historical commits | keep | src/tuner/nccl_ofi_tuner.cpp at each commit | not re-fetched (commit pins are immutable; extractor run at r18 resolved them) |
### NVIDIA/nccl (17 citations; v2.30.4-1 and v2.28.9-1 -> v2.32.3-1)

| File:line | Constant, citation | Old ref | New ref | Path:lines at new ref | Verified |
|---|---|---|---|---|---|
| AIMLTraining.tsx:58 | NCCL_TAG (v2.30.4-1) `search.cc` L181-L202 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/graph/search.cc:L190-L212 (comment and `cmpScore` reformatted only; same ordering) | yes (moved, whitespace only) |
| NcclOverEfa.tsx:126 | NCCL_TAG (v2.30.4-1) `nccl_tuner.h` L43 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/include/plugin/nccl_tuner.h:L43-L44 (`#define NCCL_TUNING_IGNORE -1.0`, `#define NCCL_ALGO_PROTO_IGNORE NCCL_TUNING_IGNORE`; value unchanged) | yes (content changed, value same) |
| NcclOverEfa.tsx:127 | NCCL_TAG (v2.30.4-1) `nccl_tuner.h` L25 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/include/plugin/nccl_tuner.h:L25 | yes |
| NcclOverEfa.tsx:130 | NCCL_TAG (v2.30.4-1) `enqueue.cc` L1893-L1899 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/tuning.cc:L204-L209 (`generalTable` initialised to NCCL_TUNING_IGNORE, built only when a tuner is loaded); file moved: src/enqueue.cc no longer exists | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:131 | NCCL_TAG (v2.30.4-1) `enqueue.cc` L1903-L1938 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/tuning.cc:L210-L216 (table filled from the list of valid tunings) and src/tuning/cost_model.cc:L470-L497 (each candidate modelled; disabled or zero-time candidates dropped) | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:132 | NCCL_TAG (v2.30.4-1) `enqueue.cc` L2052-L2066 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/tuning.cc:L202-L231 (compute all valid tunings, then `tuner->getCollInfo` L219-L222, copy back L224-L229, then select L231) | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:133 | NCCL_TAG (v2.30.4-1) `enqueue.cc` L1940-L1960 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/tuning.cc:L155-L173 (`ncclTuningSelectBestTuning`: lowest `selectionTimeUs`, or `timeUs` when no selection time is set) | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:134 | NCCL_TAG (v2.30.4-1) `tuning.cc` L416-L435 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/cost_model.cc:L306-L345 (NCCL_PROTO / NCCL_ALGO / NCCL_SYM_KERNEL parsed into per-function enable arrays in `ncclTuningCostModelInit`); file moved: src/graph/tuning.cc no longer exists | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:135 | NCCL_TAG (v2.30.4-1) `tuning.cc` L486-L506 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/cost_model.cc:L371-L384 (per-model `enabled[i][f]` cleared and re-set from the enable arrays for forced functions) | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:136 | NCCL_TAG (v2.30.4-1) `tuning.cc` L593-L599 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/tuning/cost_model.cc:L480-L496 (disabled candidate -> `timeUs = NCCL_TUNING_IGNORE`, `valid = 0`) | yes (moved file, code rewritten) |
| NcclOverEfa.tsx:137 | NCCL_TAG (v2.30.4-1) `search.cc` L181-L202 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/graph/search.cc:L190-L212 (comment and `cmpScore` reformatted only; same ordering) | yes (moved, whitespace only) |
| NcclOverEfa.tsx:138 | NCCL_TAG (v2.30.4-1) `search.cc` L241-L280 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/graph/search.cc:L251-L291 (`ncclTopoSearchNextGpuSort` reformatted only) | yes (moved, whitespace only) |
| NcclOverEfa.tsx:139 | NCCL_TAG (v2.30.4-1) `init.cc` L781-L786 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/init.cc:L1003-L1009 (`DEFAULT_BUFFSIZE (1 << 22) /* 4MiB */` at L1006) | yes (moved, reformatted) |
| Operations.tsx:124 | NCCL_TAG (v2.28.9-1) `init.cc` L428 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/init.cc:L557 | yes (moved) |
| Operations.tsx:125 | NCCL_TAG (v2.28.9-1) `net.cc` L322-L337 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/plugin/net.cc:L320-L339 (`ncclNetPluginRegisterInternal` for ncclNetIb then ncclNetSocket at L332-L333, after the external plugin list) | yes (content changed, same behaviour) |
| Operations.tsx:126 | NCCL_TAG (v2.28.9-1) `net.cc` L225 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/plugin/net.cc:L229 (`ATTN("Failed to initialize NET plugin %s", ...)`, was INFO) | yes (content changed, same text) |
| Operations.tsx:127 | NCCL_TAG (v2.28.9-1) `net_socket.cc` L720-L721 | v2.30.4-1 / v2.28.9-1 | v2.32.3-1 | src/transport/net_socket.cc:L694-L695 | yes (moved) |
| Sources.tsx:31 | id 32 doc URL `src/graph/search.cc` | v2.30.7-1 | v2.32.3-1 | src/graph/search.cc (whole file; cmpScore L202-L212) | yes |
| NcclOverEfa.tsx:128 | `NCCL_221` `nccl_tuner.h` L58 | v2.21.5-1 | keep (historical by design) | - | not needed |
| NcclOverEfa.tsx:129 | `NCCL_222` `nccl_tuner.h` L60 | v2.22.3-1 | keep (historical by design) | - | not needed |
### torvalds/linux (1 citation)

| File:line | Constant, citation | Old ref | New ref | Path:lines at new ref | Verified |
|---|---|---|---|---|---|
| DataPath.tsx:65 | LINUX `efa_main.c` L365-L403 (`mainlineOps`) | 2d2338c93da79b3bfe4b6099a931d9468d539952 | v7.3 (c03c1a14507dfaf8b856c2608f9ac216021fc222) | drivers/infiniband/hw/efa/efa_main.c:L369-L413 (adds 5 comp_cntr ops; still no data-path ops) | yes (content changed, claim holds) |
## UNKNOWN list

1. Whether an rdma-core older than v64.0 (installer 1.49.0 ships 63.0) fails to bind the EFA
   provider on a host whose device is 0xefa4. The provider table matches by kernel driver id
   first and by PCI id second; behaviour on a real host was not tested (R-01).
2. Which NCCL_DEBUG setting is the minimum that prints "Failed to initialize NET plugin" in NCCL
   2.32, now that the line is logged with ATTN instead of INFO (N-08).
3. [SPECULATIVE] Whether NCCL 2.32's `ncclTuningSelectBestTuning` would select a valid
   candidate that a tuner overwrote with -1.0. Read from code only; not exercised (N-03).
4. When the EC2 User Guide EFA changelog page will list 1.51.0. At r23 the tarball and its
   in-tarball `ChangeLog.md` exist, the documentation page does not show it (I-01).
5. Whether NCCL 2.32, when it skips an external proxy GIN plugin in favour of its own GIN proxy
   over the RMA backend, still uses aws-ofi-nccl for the RMA transport on EFA. Read from code
   only (`src/plugin/gin.cc` L164-L169); not traced further (N-09).
6. The v1.21.1 line ranges for the 11 changed aws-ofi-nccl citations were not hand-verified;
   only v1.22.0 ranges were. The recommendation is v1.22.0, so this blocks nothing.
7. efa_linux_3.3.1 (`f7ba3059...`, the driver installer 1.51.0 ships) was not line-verified;
   only 3.3.0 and 3.4.0 were.
8. Scope not covered here: installer versions quoted in `SageMaker.tsx` (DLC pins at 1.49.0 and
   1.47.0) belong to the integrations area (`03-integrations.md`) and were not re-checked.

Note on the earlier half of this file: the r23 completion section corrects two statements made
before the resume. The P2P call cited at `efa_verbs.c` L2814 sits in `efa_reg_mr`, not
`efa_reg_user_mr_dmabuf`, and the earlier 18/13/3 tally does not reconcile to 38; the
per-citation pin-move rows supersede both.

STATUS: COMPLETE
