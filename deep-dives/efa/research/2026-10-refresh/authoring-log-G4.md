# Authoring log G4: EFA Device and Operations (October 2026 refresh, wave 2)

STATUS: COMPLETE (both files edited, all checks green)

Files owned: `src/sections/EfaDevice.tsx`, `src/sections/Operations.tsx`.
Baseline: commit e6179ae. For these two files it is identical to b39b4d3, so the register line numbers apply.
Re-verification by this agent, 2026-10-23, all with curl's default User-Agent or `gh` (no personal data in any
request): k8s-device-plugin `main.go` at v0.19.0, v0.19.2, v0.19.3, v0.20.1; NCCL v2.32.3-1 `src/debug.cc`,
`src/include/debug.h`, `src/include/nccl_common.h`, `src/plugin/net.cc`, `src/init.cc`,
`src/transport/net_socket.cc`; the 1.51.0 tarball streamed and only `ChangeLog.md` and `efa_installer.sh`
extracted (read as text, not run); the EC2 EFA changelog page; the EKS device-management-efa page (and the
node-efa.html 301); amzn-drivers `RELEASENOTES.md`, `dkms.conf`, `efa_main.c`, `efa_verbs.c`,
`efa_admin_cmds_defs.h`, `efa_io_defs.h`, `efa_data_verbs.c` at 9d5ca402 (3.4.0) and f7ba3059 (3.3.1); all 32
files of `kernel/linux/efa/src` at 9d5ca402 for the no-netdev grep; boundary lines of every moved libfabric and
aws-ofi-nccl citation in these two files; `gh api` for the aws/libfabric v2.7.0amzn2.0 release and the
ofiwg compare v2.7.0...1daf10bb.

## Files done

- src/sections/EfaDevice.tsx
- src/sections/Operations.tsx

Length (reader prose after `export function`, tags and SourceRefs stripped): EfaDevice 2925 -> 2925 words, plus
5 words cut from the host-requirements table. Operations 3250 -> 3251 words; the failure table strings grew by
about 15 words, almost all in the mofed row (the revert and the doc conflict need naming).

Diagrams touched: one. Operations `FailureLayerMapDiagram` mofed chip (Operations.tsx:324), labels
"NVIDIA plugin v0.19.0 to v0.19.2" / "mofed claims the uverbs nodes". Chip is 200 px wide at 10 px sans-serif;
with Arial advance widths the lines measure about 145 px and 138 px (27 px and 31 px clearance per side). No other
geometry changed. Needs the orchestrator's screenshot check at 1440 and 390.

## Pin moves applied

| File | Constant | Old | New | Citations |
|---|---|---|---|---|
| EfaDevice.tsx | DRIVER_SHA | b99452b70756b1b394b1e7ff238d4efbdca44c5b | 9d5ca4021f7c9f8421e404c1e89edb0b1325372c (efa_linux_3.4.0) | 5: pciIds L27-L39 (same), queryDevice L350-L359 (same), registerMr L2628-L2636 -> L2636-L2644, dkms and RELEASENOTES whole-file |
| EfaDevice.tsx | PLUGIN_TAG | v1.20.0 | v1.22.0 | 3: railContract L82-L97 -> L84-L99; sortRails L961-L991 -> L1089-L1119; guidByDeviceId L939-L959 -> L1042-L1062 |
| EfaDevice.tsx | LIBFABRIC_TAG | v2.6.0 | v2.7.0 | 1: subCq efa_device.c L520-L526 -> L604-L610 |
| Operations.tsx | DRIVER_SHA | b99452b7... | 9d5ca402... | 17: fillPort L3652-L3656 -> L3694-L3698; getHwStats L3708-L3715 -> L3750-L3757; netStatsStruct L664-L674 -> L627-L637; basicStatsStruct L620-L632 -> L583-L595; driverSrc, portStats, deviceStats, kverbsStats, statsTypes, modVersion (content: minor 3 -> 4), pciIds L27-L38, sysfsP2p, nvP2pString, neuronP2pString, enaEthtool unchanged lines; dkms and RELEASENOTES whole-file |
| Operations.tsx | LIBFABRIC_TAG | v2.6.0 | v2.7.0 | 8: linkAddr L346-L356 -> L357-L367; mrCacheLimits L141-L152 -> L185-L196; mrCacheMonitor L111-L126 -> L155-L170; forkAbort L30-L60 -> L31-L61; mrCacheEnv L1054-L1080 -> L1098-L1124; fabricNames, fabricAssign, pingpong unchanged |
| Operations.tsx | PLUGIN_TAG | v1.20.0 | v1.22.0 | 5: topoMemfd L239-L299 -> L235-L295; topoDefer L665-L687 -> L768-L790; selectedProvider, pluginName, envVarDoc unchanged |
| Operations.tsx | NCCL_TAG | v2.28.9-1 | v2.32.3-1 | 4 moved: usingNetwork init.cc L428 -> L557; internalPlugins net.cc L322-L337 -> L320-L339; pluginFailed net.cc L225 -> L229 (now `ATTN(...)`); socketName net_socket.cc L720-L721 -> L694-L695. 1 added: debugLevels debug.cc L146-L156 |
| Operations.tsx | (new) nvdp builder | n/a | NVIDIA/k8s-device-plugin v0.19.0, v0.19.3, v0.20.1 | 3 added: main.go L116-L121 @v0.19.0, L114-L118 @v0.19.3, L115-L119 @v0.20.1 |

Comments moved with the constants: EfaDevice.tsx:30-34 (tag efa_linux_3.4.0, driver r3.4.0);
Operations.tsx:34-35 (efa_linux_3.4.0; "Master has since moved past it" removed); Operations.tsx:39 ("The NCCL
release aws-ofi-nccl v1.22.0 states it was tested with", per the v1.22.0 release notes). `READ` is 2026-10-23 in
both files (every code citation re-verified at its new pin that day). Docs re-read today carry `REREAD`
(2026-10-23): changelog, installer, installerScript, eksDevice, awsLibfabric. Other docs keep their August dates.

## CLAIM DIFF

Tiers: T1 code = source at a pinned ref; T1 doc = official AWS documentation; T1 artefact = AWS-published
tarball; orientation = in-repo release notes (not proof of behaviour per the source-authority standard; where
the page states a code fact from them, the code check is given). AL = https://github.com/amzn/amzn-drivers/blob/9d5ca4021f7c9f8421e404c1e89edb0b1325372c/ ;
INST = https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz ; CL = https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html ;
EKSD = https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html ; NC = https://github.com/NVIDIA/nccl/blob/v2.32.3-1/ ;
NVDP = https://github.com/NVIDIA/k8s-device-plugin/blob/

### EfaDevice.tsx

| file:line | New text (short) | Source + tier | Register row |
|---|---|---|---|
| EfaDevice.tsx:374 | host-requirements cell: "Bottlerocket does not pre-allocate them." deleted | live EKSD no longer carries it; 03 E17 marks it UNKNOWN (source removed) | 03 E17 (extra, see below) |
| EfaDevice.tsx:666-671 | "pre-allocate 5128 huge pages of 2 MiB each, which you request as hugepages-2Mi resources in your workload specifications"; p5 manifests request 5120Mi; both cites repointed from node-efa.html to EKSD | EKSD T1 doc, read 2026-10-23 ("pre-allocate 5128 pages of 2 MiB, which you request as hugepages-2Mi resources in your workload specifications"; p5.48xlarge YAML `hugepages-2Mi: 5120Mi`). node-efa.html returns 301 to EKSD | 03 E15, E18 (extra) |
| EfaDevice.tsx:92 | eksDevice title "EKS User Guide: Manage EFA devices on Amazon EKS", accessed 2026-10-23 (also backs :590, the four-EFA-per-GPU sentence, re-verified verbatim) | EKSD `<title>` "Manage EFA devices on Amazon EKS" T1 doc | citation hygiene |
| EfaDevice.tsx:702-705 | "Installer 1.50.0 was the first to ship driver 3.3.0, and the next section shows how to tell which driver a host runs" | CL T1 doc: 1.50.0 "Upgrade to EFA driver 3.3.0" (August 21, 2026); 1.49.0 "Upgrade to EFA driver 3.1.0" | I-06 / I-08 (r3.3.0 features now shipped) |
| EfaDevice.tsx:714 | h2 description "Two channels ship EFA software, and they drift apart." ("two releases apart" removed) | n/a (count removed rather than restated) | I-07 analogue |
| EfaDevice.tsx:727-729 | "EFA installer 1.51.0 ships EFA driver 3.3.1, libfabric 2.7.0amzn2.0, rdma-core 65.0 and the AWS OFI (OpenFabrics Interfaces) NCCL plugin 1.22.0" | INST `ChangeLog.md` [1.51.0] entry, T1 artefact | I-02; 04 acronym OFI |
| EfaDevice.tsx:729-731 | "It refuses to run on Debian 11, which 1.50.0 was the last release to support" | INST `ChangeLog.md`: "Discontinue support for Debian 11. The last EFA installer version supporting Debian 11 is 1.50.0."; `efa_installer.sh` L16-L19 exits with "Error: Debian 11 is no longer supported..." T1 artefact | I-11 |
| EfaDevice.tsx:731-734 | "in an NGC (NVIDIA GPU Cloud) container that is not Ubuntu it drops its NGC handling and installs the standard packages, NCCL plugin included" (provenance code-derived, doc = installerScript, label "script") | INST `efa_installer.sh` L1337-L1350: comment "fall back to a standard EFA installation, which still installs the NCCL/OFI plugin from the standard packages", condition `[ $NGC -eq 1 ] && ! is_ubuntu_2204 && ! is_ubuntu_2404 && ! is_ubuntu_2604`, sets NGC=0, NGC_BUILD=0. T1 artefact (code) | I-11 |
| EfaDevice.tsx:739, 742-746 | badge "ahead of the installer"; "The amzn-drivers tree carries driver r3.4.0 ... DKMS configuration"; "Its r3.4.0 release notes add PCIe relaxed ordering for memory regions and contiguous allocation for receive and completion queues, and fix an admin-queue race and an initialisation-order bug" | AL `kernel/linux/efa/conf/dkms.conf` PACKAGE_VERSION="3.4.0" T1 code; AL `kernel/linux/efa/RELEASENOTES.md` r3.4.0 entry (verbatim: "Add MR PCIe relaxed ordering support", "Improve RQ and CQ contiguous memory allocation", "Fix possible race between admin command timeout and completion", "Fix order between events and admin queues creation and IRQ registration") orientation | D-01 (EfaDevice:718) |
| EfaDevice.tsx:752-759 | Alert header "The EFA driver version has two right answers"; "Installer 1.51.0 ships driver 3.3.1. The repository is at r3.4.0 ... one minor release apart ... memory region PCIe relaxed ordering is in the r3.4.0 notes and absent from the 3.3.1 notes"; "The userspace half shares a base version, 2.7.0amzn2.0 from the installer against upstream v2.7.0" | INST ChangeLog (3.3.1, 2.7.0amzn2.0) T1 artefact; AL dkms.conf T1 code; AL RELEASENOTES.md r3.4.0 and r3.3.1 entries, orientation. Code check: `relaxed` appears in AL efa_verbs.c L2626-L2627, efa_data_verbs.c L213-L217, efa_io_defs.h L239 and L450, and nowhere in efa_io_defs.h or efa_data_verbs.c at f7ba3059356b13fdabfd61cb35aa0ed7059a81e8 (efa_linux_3.3.1) | I-05, D-01 |
| EfaDevice.tsx:803-807 | "0xefa4 was added in driver r3.3.0 alongside 800 and 1600 Gbps link-speed reporting, and installer 1.50.0 was the first to ship that driver" (was "r3.3.0 is not in the shipping installer") | AL RELEASENOTES.md r3.3.0 entry ("Add 0xefa4 device support", "Support reporting 800 and 1600 Gbps link speed") orientation; CL 1.50.0 row T1 doc | I-06; D-03 (CORRECT, unchanged part) |
| EfaDevice.tsx:862-863 | "CIDR (Classless Inter-Domain Routing)" | n/a (expansion) | 04 acronym CIDR |
| EfaDevice.tsx:913-914 | "The hard constraint is the Availability Zone. The placement group is the documented way to satisfy it and to keep latency low." (rebuttal of "any page that says" removed) | unchanged citations (efa-start.html, T1 doc) | 04 changelog voice EfaDevice:889-891 / A4(c) |
| EfaDevice.tsx:770, 102 (pciIds) | five PCI ids 0xefa0-0xefa4 unchanged; cite moved to 9d5ca402 L27-L39 | AL `kernel/linux/efa/src/efa_main.c#L27-L39` T1 code (re-read) | D-02 (CORRECT) |

### Operations.tsx

| file:line | New text (short) | Source + tier | Register row |
|---|---|---|---|
| Operations.tsx:324 | diagram chip "NVIDIA plugin v0.19.0 to v0.19.2" / "mofed claims the uverbs nodes" | as the mofed row below | B-29 (diagram label) |
| Operations.tsx:523 | huge-page row cite repointed node-efa.html -> EKSD (claim unchanged: 5128 pages of 2 MiB) | EKSD T1 doc, read 2026-10-23 | 03 E15, E18 (extra) |
| Operations.tsx:548 | "The single Availability Zone that makes EFA fast, and the tighter grouping a cluster placement group adds, make interruptions correlated rather than independent. No counter reports it." | inference, unchanged label (efa.html) | 04 A4(c) wording fix for Operations:514 |
| Operations.tsx:575 | "NVIDIA k8s-device-plugin v0.19.0 to v0.19.2 default mofed-enabled to true, which mounts every /dev/infiniband/uverbs device into GPU containers and conflicts with the EFA device plugin. v0.19.3 (June 2026) through v0.20.1 default it to false; the EKS guide gives the v0.19.0 default with no upper bound." | NVDP v0.19.0/cmd/nvidia-device-plugin/main.go#L116-L121 (`Name: "mofed-enabled", Value: true`) T1 code; NVDP v0.19.3/...main.go#L114-L118 (no Value, so the urfave/cli BoolFlag zero value false) T1 code; NVDP v0.20.1/...main.go#L115-L119 (same) T1 code; v0.19.2 main.go L117-L118 also `Value: true` (checked, not cited); release dates via `gh api`: v0.19.0 2026-03-17, v0.19.2 2026-05-27, v0.19.3 2026-06-22, v0.20.1 2026-09-22. EKSD T1 doc, read 2026-10-23: "Starting with NVIDIA k8s-device-plugin v0.19.0, the --mofed-enabled flag defaults to true, which causes the NVIDIA device plugin to mount all /dev/infiniband/uverbs* devices into containers requesting GPUs" (provenance doc-code-conflict, paired with the v0.19.3 code) | B-29 |
| Operations.tsx:576 | fix "Set mofedEnabled to false on the NVIDIA device plugin chart, or MOFED_ENABLED on the GPU operator, to cover v0.19.0 to v0.19.2. EKS Auto Mode leaves it off." | EKSD: "you must explicitly disable MOFED"; "EKS Auto Mode does not enable MOFED by default and is not affected by this issue" T1 doc | B-29 |
| Operations.tsx:677, 688-689 | sample output and prose: modinfo "3.3.1g", dkms "efa/3.3.1" (was 2.17.3) | INST package list efa-3.3.1-1 / ChangeLog "Upgrade to efa driver 3.3.1" T1 artefact; the g suffix from AL efa_main.c#L42-L53 (DRV_MODULE_VERSION adds "g") T1 code | I-01 follow-on (sample now matches the shipping driver) |
| Operations.tsx:731, 735 | "the block below shows what libfabric prints there"; headerDescription "The documentation and the libfabric code print different things here." | n/a (wording) | 04 changelog voice Operations:686 ("now"); "current" in the header description (extra) |
| Operations.tsx:748 | "That change landed in libfabric v2.1.0, and the installer this section pins ships a later libfabric" | unchanged doc-code-conflict ref; installer 1.51.0 libfabric 2.7.0amzn2.0 per INST | 04 changelog voice Operations:702-703 |
| Operations.tsx:755 | "The line shows which of the two fabrics you got." | n/a | 04 changelog voice Operations:710-711 |
| Operations.tsx:826-829 | "...where NCCL logs Failed to initialize NET plugin, at the ATTN level that NCCL_DEBUG=INFO shows and WARN hides" | NC src/plugin/net.cc#L229 (`ATTN("Failed to initialize NET plugin %s", ...)`) T1 code; NC src/debug.cc#L146-L156 (`ncclDebugLevelToMask`: `if (level >= NCCL_LOG_INFO) mask |= 1u << NCCL_LOG_ATTN`; WARN = 2 sets only WARN) T1 code; enum in NC src/include/nccl_common.h L28-L35 (ATTN = 6, comment "logically between WARN and INFO"); ATTN option text debug.cc L48 | N-08 (settled, not UNKNOWN: NCCL_DEBUG=ATTN or INFO shows the line, WARN does not; the page states only INFO and WARN) |
| Operations.tsx:1138 | h2 description "Two channels give two correct answers to what version am I on. This is how to tell which one you are reading." | n/a | I-07; 04 changelog voice Operations:1092 |
| Operations.tsx:1151-1153 | "EFA installer 1.51.0 ships EFA driver 3.3.1, libfabric 2.7.0amzn2.0, rdma-core 65.0 and AWS OFI NCCL Plugin 1.22.0" ("what a host built today ... carries" removed) | INST ChangeLog.md [1.51.0] T1 artefact | I-01 |
| Operations.tsx:1158-1166 | badge "ahead of the installer"; "The amzn-drivers tree is at driver r3.4.0 ... with release notes adding memory region PCIe relaxed ordering and contiguous receive and completion queue allocation. The 3.3.1 notes list neither." | AL dkms.conf T1 code; AL RELEASENOTES.md r3.4.0 and r3.3.1 entries, orientation (code check as for EfaDevice:752-759) | D-01, I-08 |
| Operations.tsx:1172-1176 | "Installer 1.51.0 ships driver 3.3.1 while the repository is at r3.4.0. Both answers are correct, one minor release apart ... 0xefa4 device support landed in r3.3.0, which installer 1.50.0 was the first to ship" | INST T1 artefact; AL dkms.conf T1 code; AL RELEASENOTES.md r3.3.0 entry, orientation; CL 1.50.0 row T1 doc | I-04 |
| Operations.tsx:1177-1181 | "2.7.0amzn2.0 is an AWS-specific release built from upstream ofiwg commit 1daf10bb, so compare it with other amzn builds rather than with upstream v2.7.0, despite the matching base version" (was "an AWS fork with backports ... not comparable", cited to CL, which does not say it) | https://github.com/aws/libfabric/releases/tag/v2.7.0amzn2.0 T1 (AWS first-party repo): "This AWS-specific release is based on ofiwg/libfabric@1daf10bba33d420b2c833188a33a8dea4ff35a20". Not on the page: `gh api repos/ofiwg/libfabric/compare/v2.7.0...1daf10bb` = ahead 35, behind 0 (commit dated 2026-10-13) | I-05 (userspace half) |
| Operations.tsx:1186-1190 | "map them back ... using the changelog or the ChangeLog.md inside the installer tarball" | INST T1 artefact (ChangeLog.md present in the 1.51.0 tarball; CL tops out at 1.50.0 on 2026-10-23) | I-01 (the documented mapping tool lacks the newest release) |
| Operations.tsx:1206 | `sha256sum aws-efa-installer-1.51.0.tar.gz` | INST T1 artefact | I-10 |
| Operations.tsx:994-999 (driverSrc) | "A search of the whole driver source at the pinned commit for net_device, register_netdev or ethtool returns no matches" now refers to 9d5ca402 | re-run: all 32 files of AL kernel/linux/efa/src (no subdirectories), grep -E 'net_device|register_netdev|ethtool' = no match, T1 code | pin move, claim re-verified |
| Operations.tsx:806-811, 822 (N-08 neighbours) | NCCL appends IB then Socket after external plugins; Socket names itself "Socket"; "Using network %s" | NC src/plugin/net.cc#L320-L339 (L332-L333 register ncclNetIb, ncclNetSocket); NC src/transport/net_socket.cc#L694-L695; NC src/init.cc#L557, T1 code | N-08 (CORRECT) |

## Requested orchestrator changes (Sources.tsx, sources.md, README.md)

1. Glossary: add `{ acronym: 'NGC', fullForm: 'NVIDIA GPU Cloud', description: "NVIDIA's container catalogue; the EFA installer has a separate install path for its Ubuntu-based images" }`. First rendered use is EfaDevice.tsx:731. (The expansion is the conventional one; NVIDIA mostly uses "NGC" alone. Not sourced in this pass.)
2. Sources: add the EFA installer 1.51.0 tarball (ChangeLog.md and efa_installer.sh) if the appendix does not already carry it from G2; add https://github.com/aws/libfabric/releases/tag/v2.7.0amzn2.0; add NVIDIA/k8s-device-plugin `cmd/nvidia-device-plugin/main.go` at v0.19.0, v0.19.3 and v0.20.1; move any NCCL appendix entry to v2.32.3-1 (01 already lists this for source 32).
3. Any appendix or sources.md entry for `eks/latest/userguide/node-efa.html` should repoint to `device-management-efa.html` (301 verified 2026-10-23), title "Manage EFA devices on Amazon EKS".
4. Cross-group, for G5 or the orchestrator (not edited, not my file): SageMaker.tsx:1007-1014 says installers from 1.48 auto-detect NGC containers via /opt/nvidia/nvidia_entrypoint.sh in the nvidia/cuda amzn2023 base images and then skip libnccl-ofi, so "Without the flag you get an EFA install with no NCCL plugin". In 1.51.0 `efa_installer.sh` L1337-L1350, NGC handling on any non-Ubuntu container (amzn2023 included) falls back to the standard install, which includes the NCCL plugin. The claim needs scoping to installers 1.48.0 to 1.50.0.
5. Cross-group, for G2 or the orchestrator: Libfabric.tsx says "The amzn suffix marks an AWS fork of upstream v2.7.0 carrying backports." The aws/libfabric v2.7.0amzn2.0 release names its base as ofiwg commit 1daf10bb, which is 35 commits ahead of the v2.7.0 tag and 0 behind (GitHub compare). It is upstream main past the tag, not v2.7.0 plus backports alone. Worth a check before wave 4.

## Register rows: applied versus skipped

Applied: 01 I-01, I-02, I-04, I-05, I-06, I-07, I-08, I-10, I-11, D-01, N-08; D-02 and D-03 are CORRECT and only moved pins; 04 B-29 (row and diagram label), changelog voice EfaDevice:889-891, Operations:686, :702-703, :710-711, :1092; acronyms OFI and CIDR; 02 O-11 (CORRECT, headings at EfaDevice:783-785 already quote the tab labels without "Using", no change).

Applied beyond the listed rows, all inside my two files:
- 04 A4(c) wording for Operations:514 (Spot row). The register lists it under A4, which is a G6 item, but the text lives in my file and only I can edit it.
- 03 E15/E18: `docs.eksNode` (node-efa.html, now a 301) removed from both files; its three uses repointed to `docs.eksDevice` after confirming both claims (5128 pages, 5120Mi manifests) on the live page.
- 03 E17: deleted the uncited "Bottlerocket does not pre-allocate them." from the EfaDevice host-requirements table. The live docs no longer carry it and the register found no other source.
- EfaDevice h2 description "two releases apart" (same rot as I-07); Operations headerDescription "current libfabric"; Operations sample driver version 2.17.3 -> 3.3.1 so the bring-up example matches the shipping driver.
- The Operations userspace sentence was re-sourced from the EC2 changelog, which does not support "AWS fork with backports", to the aws/libfabric release, which names the base commit. The claim was narrowed to what that page says.

Skipped or placed differently:
- I-11 appears only in EfaDevice. Operations has no passage on installer flags or supported OSes, and the brief asked for one sentence.
- 04 changelog-voice suggestion for Operations:686 ("the output at the installer version this section pins") was re-worded to "what libfabric prints there". The expandable is about libfabric behaviour, not the installer.
- Open MPI 4.1.8 and 5.0.9amzn1 (in the I-01 replacement text) are not added. Neither section listed MPI before, and length had to hold.
- NCCL_DEBUG=ATTN as a quieter setting that still shows the plugin-failure line is code-supported (debug.cc L146-L156) but not added. The page's command uses INFO, which is correct.
- 01 D-05 (optional) is not in my rows.

## UNKNOWN

None left open. N-08's open question (which NCCL_DEBUG value shows the line) is settled by NC src/debug.cc L146-L156: INFO and above, or ATTN, include the ATTN bit, and WARN does not.

## Checks (foreground, repo root, after the final edit)

| Check | Exit |
|---|---|
| pnpm --filter @tech-deep-dives/efa typecheck | 0 |
| pnpm --filter @tech-deep-dives/efa lint | 0 |
| pnpm --filter @tech-deep-dives/efa test | 0 (12 of 12) |
| bash scripts/gates/no-ai-tells.sh | 0 |
| bash scripts/gates/svg-a11y.sh | 0 |
| bash scripts/gates/pinned-refs.sh | 0 |
| bash scripts/gates/pre-overflow.sh | 0 |

No failures came from other agents' files during these runs. Not run, per the brief: build, vite preview, Playwright.

## Network requests and personal data

No personal data went into any request. GitHub reads used `gh` (its configured token in the Authorization header
and nothing else) or curl to raw.githubusercontent.com with curl's default User-Agent. AWS pages and the
installer tarball were fetched with curl's default User-Agent. No request carried the user's email, name or
account details in a header, URL, query or body. Downloaded files live under /tmp/g4-verify, one directory per
source, and were read as text only.

STATUS: COMPLETE
