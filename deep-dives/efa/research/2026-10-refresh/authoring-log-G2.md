# Authoring log G2: mechanism sections (October 2026 refresh)

STATUS: COMPLETE (checks run 2026-10-23; see Checks)

Files owned: `DataPath.tsx`, `SrdProtocol.tsx`, `EnaVsEfa.tsx`, `Libfabric.tsx` (all under
`deep-dives/efa/src/sections/`). Edited against commit b39b4d3 state (HEAD e6179ae). No commits.

## Files done

- DataPath.tsx
- SrdProtocol.tsx
- EnaVsEfa.tsx
- Libfabric.tsx

## Verification method (Tier 0, this pass)

Every changed or new citation was fetched at its new pin and read, not taken from the register:
shallow sparse clones of `ofiwg/libfabric` v2.7.0 (tag commit 9011331b), `aws/aws-ofi-nccl` v1.22.0
(80c6d325), `amzn/amzn-drivers` at 9d5ca4021f7c9f8421e404c1e89edb0b1325372c (`git describe`
= efa_linux_3.4.0); raw fetches of `torvalds/linux` v7.3 `drivers/infiniband/hw/efa/efa_main.c`,
`NVIDIA/nccl` v2.32.3-1 `src/plugin/gin.cc` and `src/include/nccl_device/core.h`, libfabric v2.6.0
`prov/efa/src/efa_env.c`; `ChangeLog.md` stream-extracted from
`aws-efa-installer-1.51.0.tar.gz` (ETag eedd7db2cd3951ccae03e07d135acb7d, same as `latest`).
All requests used curl/gh/git defaults; no personal data sent. Read-only: nothing from the
downloads was executed.

## Pin moves applied

| File | Constant | Old | New | Citations |
|---|---|---|---|---|
| DataPath.tsx | `AMZN` | b99452b70756b1b394b1e7ff238d4efbdca44c5b | 9d5ca4021f7c9f8421e404c1e89edb0b1325372c (efa_linux_3.4.0) | 16: 11 re-lined, 5 unchanged; +1 new (`p2pAlign`) |
| DataPath.tsx | `LINUX` | 2d2338c93da79b3bfe4b6099a931d9468d539952 | v7.3 | 1 re-lined (`mainlineOps` L369-L413) |
| DataPath.tsx | `LF` | v2.6.0 | v2.7.0 | 13: 12 re-lined (`mrCacheOpen` also moves to `src/rdm/efa_rdm_domain.c`), 1 unchanged |
| DataPath.tsx | `READ` split | one date 2026-08-01 for code and docs | code `READ` 2026-10-23; docs `DOC_READ` 2026-08-01; `docs.changelog` 2026-10-23 (re-read) | n/a |
| SrdProtocol.tsx | `DRIVERS` | b99452b7... | 9d5ca402... | 12: 3 re-lined (`modifyQp`, `netStats`, `enaEthtoolOps`), 9 unchanged |
| SrdProtocol.tsx | `LIBFABRIC` | v2.6.0 | v2.7.0 | 20: 9 re-lined, 11 unchanged; +1 new (`manMrAbort`) |
| SrdProtocol.tsx | `tune8kTo16` | bd987ab20e57 (short) | bd987ab20e57292f55589b30a2fc40c0ace3338c (same commit, full SHA) | 1 |
| SrdProtocol.tsx | `CODE_READ` | 2026-08-01 | 2026-10-23 | covers both historical commit pins (re-fetched by 01 at r23) |
| SrdProtocol.tsx | comment above `DRIVERS` | names efa_linux_3.3.0 / r3.3.0 | names efa_linux_3.4.0 / r3.4.0 | n/a |
| EnaVsEfa.tsx | `DRIVERS_SHA` | b99452b7... | 9d5ca402... | 24: 4 re-lined (`efaDriver`, `efaIbDevice`, `efaUserMap`, `efaSqDesc`), 20 unchanged |
| EnaVsEfa.tsx | read date | `READ` 2026-08-01 for all | new `DRIVERS_READ` 2026-10-23 for `drv()`; `READ` 2026-08-01 kept for docs and `mtuCheck` (amzn-ec2-ena-utilities, not re-verified) | n/a |
| Libfabric.tsx | `LIBFABRIC_TAG` | v2.6.0 | v2.7.0 | 31 existing: 16 re-lined or re-pathed (`cacheOpen` moves to `prov/efa/src/rdm/efa_rdm_domain.c`; `gdaTable` L868-L897 replaced by `gdaOpen` L792-L812), 15 unchanged (the whole-file `man` cite included); +7 new (`manModes`, `envUnregistered`, `envHighPps` at v2.6.0, `cntrOpen`, `modifyEp`, `context2Info`, `context2User`) |
| Libfabric.tsx | `PLUGIN_TAG` | v1.20.0 | v1.22.0 | 7 existing: `ginOpen` and `platformEnv` re-lined, `ginSwitch` removed (cited code no longer exists), 4 unchanged; +6 new (`ginBuild`, `ginDeviceType`, `ginExport`, `gdakiGate`, `gdakiRefuse`, `paramGdaki`) |
| Libfabric.tsx | `NCCL_TAG` (new) | none | v2.32.3-1 | +3 new (`ncclGinOrder`, `ncclGinType`, `ncclGinTypes`) |
| Libfabric.tsx | `READ` | 2026-08-01 | 2026-10-23 (code only; `ACCESSED` for docs unchanged) | n/a |

Deviations from the pin-move table (all deliberate, all verified at the new ref):

- `Libfabric.tsx` `platformEnv`: L139-L246, not the table's L139-L220. The sentence names "the
  later p-series entries", and the p-series catch-all row is L221-L246 at v1.22.0.
- `Libfabric.tsx` `ncclGinType`: L141-L148 (register P-01 says L141-L147; L148 is the closing brace).
- `Libfabric.tsx` `manEndpoints` no longer carries the FI_MSG_PREFIX / wait-object claim: those
  sentences are at `man/fi_efa.7.md` L70-L78 at both tags, so they now cite the new `manModes`.
- `DataPath.tsx` `p2p`: L2854 (call site, now `efa_p2p_get_and_validate`), plus new `p2pAlign`
  L2785-L2813 for the helper.

## CLAIM DIFF

Line numbers are in the edited files. Tiers: [T1 code] pinned source, [T1 doc] AWS page,
[T1 artefact] AWS tarball, [orientation] in-repo man page or comment, [T0] our check.

| file:line | New or changed text (short) | Source (pinned) + tier | Register row |
|---|---|---|---|
| DataPath.tsx:514-517 | Kernel work per resource: QP (queue pair), PD (protection domain), MR (memory region), AH (address handle), mapping the device BARs (Base Address Registers) | existing claim, re-expressed for acronyms; same facts as the column below (`controlOps` https://github.com/amzn/amzn-drivers/blob/9d5ca4021f7c9f8421e404c1e89edb0b1325372c/kernel/linux/efa/src/efa_main.c#L476-L549) [T1 code] | 04 acronyms (QP, PD, MR, AH, BAR) |
| DataPath.tsx:739-740 | BAR expansion dropped at second use | n/a (wording) | 04 acronyms |
| DataPath.tsx:748 | h3 "Low-latency queue descriptors: write-combined" (LLQ expanded in the paragraph below) | n/a (wording) | 04 acronyms (LLQ) |
| DataPath.tsx:834-837 | P2P registration fails when buffer address and registered virtual address sit at different offsets within the P2P page size | https://github.com/amzn/amzn-drivers/blob/9d5ca4021f7c9f8421e404c1e89edb0b1325372c/kernel/linux/efa/src/efa_verbs.c#L2785-L2813 (check at L2801; caller L2854 falls through to `err_free` when the helper returns NULL) [T1 code] | D-05 |
| DataPath.tsx:568-570 | Mainline ops table stops at control plane; no data-path file (unchanged text, re-pinned) | https://github.com/torvalds/linux/blob/v7.3/drivers/infiniband/hw/efa/efa_main.c#L369-L413; directory listing at v7.3 has no data-path file [T1 code] | K-01 |
| DataPath.tsx:868 | Alert header "A design note in the same repository lists Send as the only supported operation" | `kernel/linux/efa/SRD.txt` L59 at 9d5ca402; single commit 9c4730045d0f (2019-02-20) touches the file, so "written in 2019 and never revised" holds [T0 via gh api] | 04 changelog voice (DataPath:858); U-7 settled |
| DataPath.tsx:875 | conflict string "still reads" becomes "reads" | as above | 04 changelog voice |
| DataPath.tsx:883-884 | "The installer flag for it has been a no-op since 2021, because the driver enables the support by default" | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html, installer 1.14.0, October 2021: "Make -g, --enable-gdr in efa_installer.sh as a no-op option as the latest efa kernel driver enables GDR support by default" [T1 doc, read 2026-10-23] | 04 changelog voice (DataPath:873) |
| DataPath.tsx:884-885 | "GDRCopy (the GPUDirect RDMA copy library)" | acronym gloss only | 04 acronyms (GDRCopy) |
| SrdProtocol.tsx:574 | "one Availability Zone (AZ)" | expansion only; placed at the first rendered use (triage table), not :796 as the sweep suggested | 04 acronyms (AZ) |
| SrdProtocol.tsx:601-609 | New triage row: FI_EFA_ERR_PEER_ABORTED (4127), verbatim string "Operation aborted because the peer closed its memory registration or endpoint mid-transfer"; means "peer cancelled the transfer ... expected when the peer aborts in-flight operations"; next "look at the peer's teardown; libfabric 2.7.0 or later on both sides, with an older peer a memory-region abort is undefined" | https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_errno.h#L109-L112 [T1 code]; help string https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_strerror.c#L63-L110 (case at L101-L104) [T1 code]; https://github.com/ofiwg/libfabric/blob/v2.7.0/man/fi_efa.7.md#L146-L151 [orientation] | L-10 |
| SrdProtocol.tsx:750-755 | Caption: 4124, 4126 and 4127 are libfabric's own; 4127 reports a peer that cancelled the transfer; the man page leaves an abort by memory-region close undefined unless both peers run 2.7.0+ | same three refs (`provErrnos`, new `manMrAbort`) | L-09, L-10 |
| SrdProtocol.tsx:1080-1095 | Paragraph order: current fact (default 16, code wins) now second, ahead of units and history | re-ordered, claims unchanged | 04 changelog voice (SrdProtocol:1082-1090) |
| SrdProtocol.tsx:1089 | conflict string "line 188" becomes "line 189" | https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_env.c#L189-L190 [T1 code] | L-06 |
| SrdProtocol.tsx:1092 | "Both lines are in the same file" replaces "The two citations are eight lines apart in the same file" | efa_env.c L18 and L189-L190 at v2.7.0 (L18 and L188-L189 at v2.6.0): 171 lines apart, so the old count was wrong at both pins [T1 code] | correction found during re-pin (not in register) |
| SrdProtocol.tsx:1107-1116 | History paragraph led by "Why the help text says 16384": that was the default before two tuning commits, Oct 2025 (8192, pool 1024 to 16) and Nov 2025 (16) | commit 7232f8af12d0a7ad54cc571529e37c006cb3bc92 (author date 2025-10-16), bd987ab20e57292f55589b30a2fc40c0ace3338c (author date 2025-11-18) [T1 code] | 04 changelog voice |
| SrdProtocol.tsx:1123 | "Unset is the supported answer on libfabric 2.7.0" (was "on current libfabric") | default 16 at https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/rdm/efa_rdm_peer.h#L12 [T1 code] | dated-word fix |
| EnaVsEfa.tsx:300 | Diagram label "Mapped send queue" (was "Mapped SQ ring") | wording only | 04 acronyms (SQ) |
| EnaVsEfa.tsx:440 | Table note "Two AWS pages give different scopes, see below" (was "Scope is contested") | wording only | B-21 |
| EnaVsEfa.tsx:704-705 | "any modern NIC (network interface card) driver" | expansion only | 04 acronyms (NIC) |
| EnaVsEfa.tsx:1026-1027 | "The two pages give different scopes, and the driver cannot settle which one AWS means, because it only reads counters" | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html ("within the same Availability Zone to achieve up to 25 Gbps") and https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html ("from 5 Gbps up to 25 Gbps within the same Region"), both re-read 2026-10-23 [T1 doc]; `srdGet` unchanged | B-21 |
| Libfabric.tsx:573 | Plugin comment: on libfabric 2.4+ the proxy selects efa-direct by matching the first entry (unchanged text, re-pinned) | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L588-L681 (comment L593-L596) [T1 code] | P-04 (pin only) |
| Libfabric.tsx:630-634 | FI_EFA_USE_HW_CNTR and FI_EFA_USE_SQ_REQ_ID_64_BIT never appear in the fi_info help list (read straight from the environment), both default 1 in libfabric 2.7.0; HW_CNTR puts efa-direct counters on the device's hardware completion counters | https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_env.c#L11-L47 (L45-L46) and #L49-L66 [T1 code]; https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_cntr.c#L136-L147 (hardware counter first, software fallback; `efa_cntr_open` is the base-domain `cntr_open`, efa_domain.c L38) [T1 code] | L-11 |
| Libfabric.tsx:636-638 | That function also read FI_EFA_ENABLE_HIGH_PPS in 2.6.0 and drops it in 2.7.0 | https://github.com/ofiwg/libfabric/blob/v2.6.0/prov/efa/src/efa_env.c#L62-L65 [T1 code]; v2.7.0 #L49-L66 [T1 code]; [T0] grep of v2.7.0 `prov/`, `man/`, `include/`, `src/` finds no `FI_EFA_ENABLE_HIGH_PPS` (only the separate `FI_EFA_WR_HIGH_PPS` flag in tests) | L-11 |
| Libfabric.tsx:690-693 | DGRAM: requires FI_MSG_PREFIX, no wait objects, now cited to the Modes and wait-object lines | https://github.com/ofiwg/libfabric/blob/v2.7.0/man/fi_efa.7.md#L70-L78 [orientation, existing pattern] | citation fix found during re-pin |
| Libfabric.tsx:707-717 | FI_CONTEXT2 optional on efa-direct from libfabric 2.7.0 although the man page lists it as required; without it the endpoint leaves the context buffer alone and disables inject (doc-code-conflict, code wins) | code: https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_user_info.c#L555-L581 and https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_prov_info.c#L241-L245 [T1 code]; conflicting doc: https://github.com/ofiwg/libfabric/blob/v2.7.0/man/fi_efa.7.md#L75-L78 [orientation] | L-05 |
| Libfabric.tsx:729-731 | FI_EFA_GDA_OPS handler returns not-supported on other fabrics (unchanged text, re-pointed) | https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_domain.c#L792-L812 [T1 code] | L-04 |
| Libfabric.tsx:731-734 | FI_EFA_MODIFY_EP_OPS returns a call that changes an endpoint's attributes after enable, efa-direct only | https://github.com/ofiwg/libfabric/blob/v2.7.0/prov/efa/src/efa_domain.c#L813-L822 [T1 code]; man L588-L600 [orientation, not cited] | L-12 |
| Libfabric.tsx:735-738 | aws-ofi-nccl v1.22.0 builds its kernel-initiated GIN (GPU-Initiated Networking) plugin with no configure flag when libfabric declares FI_EFA_GDA_OPS, the completion-counter interface is present and CUDA is the device interface | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/configure.ac#L343-L351 [T1 code] | P-02 |
| Libfabric.tsx:738-742 | Exported as `ncclGinPlugin_v14`, device type 5 | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L1256-L1274 and #L143 [T1 code]; https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/include/nccl_device/core.h#L74-L78 (`NCCL_GIN_TYPE_EFA_GDA = 5`) [T1 code] | P-01 |
| Libfabric.tsx:742-744 | NCCL tries v14 first; NCCL_GIN_TYPE=5 forces it | https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/plugin/gin.cc#L24-L26 (version order {14, 13}) and #L141-L148 (type filter) [T1 code] | P-01 |
| Libfabric.tsx:745-750 | Plugin allows it only on p5en, p6-b200, p6-b300 (rows with `efa_hw_comp_cntr = true`), refuses elsewhere with "gin GDAKI: not supported on this platform" | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/platform-aws.cpp#L139-L246 (true at L165, L189, L210) and #L432-L448; https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L663-L667 [T1 code] | P-01, P-04 |
| Libfabric.tsx:750-752 | "The instance type is the switch, and OFI_NCCL_GDAKI_EFA_HW_COUNTER is a bring-up override of it" | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/include/nccl_ofi_param.h#L379-L399 [T1 code]; behaviour in `config_gdaki_domain` L432-L448 | P-01 |
| Libfabric.tsx (removed) | "aws-ofi-nccl v1.20.0 is opt-in twice over ... OFI_NCCL_GIN_TYPE ... has a build problem" | cited code (`nccl_ofi_gin_api.cpp` L90-L118 at v1.20.0) does not exist at v1.22.0 [T0 grep: no OFI_NCCL_GIN_TYPE in v1.22.0 src/include/doc] | P-01, P-02 |
| Libfabric.tsx:770-771 | "host, CUDA, ROCr (the AMD ROCm runtime) or Neuron" | acronym gloss; libfabric `man/fi_mr.3.md` L819-L820 names FI_HMEM_ROCR as "AMD ROCR interfaces" [orientation, not cited] | 04 acronyms (ROCr, flagged for 01) |
| Libfabric.tsx:830-831 | Plugin inserts NCCL_BUFFSIZE / NCCL_P2P_NET_CHUNKSIZE on p5, p5e, p5en, p6-b200, p6-b300 and the later p-series entries | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/src/platform-aws.cpp#L139-L246 (BUFFSIZE at L148, L173, L191, L212, L240) [T1 code] | P-09 (as it lands in Libfabric) |
| Libfabric.tsx:1041-1044 | "The ofiwg project has released v2.7.0, and the libfabric citations in this section are pinned to that tag, apart from one that shows 2.6.0 behaviour" | `man` whole-file cite at v2.7.0 [T1 code] | pin move |
| Libfabric.tsx:1045-1049 | "EFA installer 1.51.0, whose tarball is dated October 22, 2026, upgrades to libfabric 2.7.0amzn2.0, along with EFA driver 3.3.1, rdma-core 65.0 and AWS OFI NCCL Plugin 1.22.0. The amzn suffix marks an AWS fork of upstream v2.7.0 carrying backports." | https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz `ChangeLog.md` "[1.51.0] - Oct 2026"; Last-Modified Thu, 22 Oct 2026 21:41:21 GMT [T1 artefact, read 2026-10-23] | I-03 |
| Libfabric.tsx:1053-1057 | Alert: "2.7.0amzn2.0 and upstream 2.7.0 share a base version, and the version strings are still comparable only within a channel" | re-expression of the existing channel argument with the new versions; no new source | I-03, I-05 framing |

Claims checked and left unchanged in text (re-pin only): D-04, D-06, D-07, L-01, L-02, L-03, L-07,
L-08, L-13, every ENA citation, every SRD stat citation.

## Register rows deliberately skipped

- **D-08 (MR PCIe relaxed ordering).** No block in my four files discusses the `fi_mr_reg` flag or
  MR access-flag API surface (DataPath's registration container covers pinning and keys only), so
  per the decision it is skipped. Also: the driver half is set in `efa_data_verbs.c` (the
  kernel-verbs fast-registration path) and I did not establish whether a userspace
  `ibv_reg_mr` with relaxed ordering reaches the device through `efa_reg_mr`; any future
  one-liner should settle that first. Backlog item already exists in REVAMP-2026-10.md.
- **K-02 (mainline gained 0xefa4 in Linux 7.3).** Neither DataPath nor EnaVsEfa contrasts mainline
  with out-of-tree device ids (EnaVsEfa's id list and the PCI-id question cite amzn-drivers only),
  so there is nothing to update. Verified at v7.3: `efa_main.c` L16-L20 defines 0xefa0 to 0xefa4.
- **04 GRO (EnaVsEfa:742).** Sweep marks it acceptable (expanded in the same Alert body). Left.
- **GDAKI acronym (04, Libfabric:685).** No authoritative expansion was located (NCCL source only
  uses the token; the plugin's doc calls the mode "EFA-GDA (Elastic Fabric Adapter - GPU Direct
  Async)"). The prose describes it as the "kernel-initiated GIN plugin" and uses GDAKI only inside
  code identifiers and the quoted error string.
- **AZ placement.** Applied at SrdProtocol:574 (first rendered use in nav order) rather than :796.

## Requests for the orchestrator (Sources.tsx, sources.md, README.md) and other groups

1. **Sources/fact-check re-pins** for rows citing my files: amzn-drivers 9d5ca402 (efa_linux_3.4.0),
   libfabric v2.7.0, aws-ofi-nccl v1.22.0, linux v7.3, NCCL v2.32.3-1 (new in Libfabric.tsx).
2. **New source entry**: EFA installer 1.51.0 tarball `ChangeLog.md`
   (https://efa-installer.amazonaws.com/aws-efa-installer-1.51.0.tar.gz, Tier 1 artefact, read
   2026-10-23). Libfabric.tsx no longer cites the EC2 changelog page; DataPath.tsx still does
   (installer 1.14.0 no-op row, re-read 2026-10-23).
3. **New doc-code conflict for the appendix/fact-check list**: L-05 FI_CONTEXT2 (man page Modes
   L75-L78 vs `efa_user_info.c` L555-L581, `efa_prov_info.c` L241-L245 at v2.7.0).
4. **Glossary** (Sources.tsx): add or confirm GIN (GPU-Initiated Networking), AZ (Availability
   Zone), NIC (network interface card), ROCr (AMD ROCm runtime), BAR (Base Address Register),
   GDRCopy. Keep QP, PD, MR, AH, LLQ entries.
5. **For G6 (StorageDataPaths.tsx:1018)**: NIC is now expanded at EnaVsEfa.tsx:704, so the
   "(network interface card)" expansion at StorageDataPaths:1018 can be dropped (sweep row NIC).
6. **Diagram touched**: EnaVsEfa `WhoHoldsThePenDiagram` lane B label "Mapped SQ ring" became
   "Mapped send queue" (text only, same box, 12px/600, 17 chars in a 180-unit box). Please check
   it in the 1440 and 390 screenshots.
7. **Ratchet note** (01 already proposes it): `Libfabric.tsx` `envHighPps` is built by spreading
   `lfab()` and overriding `ref: 'v2.6.0'`; a citation extractor keyed on the factory call will
   read it as v2.7.0 unless it handles the override.

## Checks (2026-10-23, foreground, from the worktree root)

- `pnpm --filter @tech-deep-dives/efa typecheck`: first run exit 2, with 5 errors all in
  `NcclOverEfa.tsx` (G3's file, mid-edit) and none in mine; final run after my last edit exit 0.
- `pnpm --filter @tech-deep-dives/efa lint`: exit 0.
- `pnpm --filter @tech-deep-dives/efa test`: exit 0 (2 files, 12 tests).
- `bash scripts/gates/no-ai-tells.sh`: exit 0.
- `bash scripts/gates/svg-a11y.sh`: exit 0.
- `bash scripts/gates/pinned-refs.sh`: exit 0.
- `bash scripts/gates/pre-overflow.sh`: exit 0.

## Length

Rough word counts (tags stripped, citation-factory lines excluded), HEAD to edited: DataPath
+83, SrdProtocol +99, EnaVsEfa +37, Libfabric about +300 including code, comments, SourceRef
props and the FI_CONTEXT2 conflict string. Reader prose grew mainly through the rows the
decisions required (L-05, L-10, L-11, L-12, the GIN rewrite, the acronym sentence). The stale
GDAKI opt-in text was removed rather than kept alongside; no existing correct content was cut to
offset the growth.

STATUS: COMPLETE
