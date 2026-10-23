# Authoring log G3: NCCL and training (October 2026 refresh, wave 1)

STATUS: COMPLETE (both owned files edited, all checks pass)

Files owned: `src/sections/NcclOverEfa.tsx`, `src/sections/AIMLTraining.tsx`.
Baseline: commit b39b4d3 (line numbers in the registers). I re-read the code on 2026-10-23 at the new pins. Files came from
raw.githubusercontent.com with curl's default User-Agent, and directory listings from `gh api`; no personal data was sent.
Every CodeRef in both files was then resolved mechanically against the fetched sources at its pinned ref
(first and last cited line printed and read): all resolve. The two whole-file refs `topology/p4d-24xl-topo.xml` and
`topology/g5.48xl-topo.xml` are confirmed by the `gh api` listing of `topology/` at v1.22.0. That listing holds
Makefile.am, g5.48xl-topo.xml, p4d-24xl-topo.xml and p4de-24xl-topo.xml.

## Files done

- `src/sections/AIMLTraining.tsx` (163 lines changed in the diff stat)
- `src/sections/NcclOverEfa.tsx` (330 lines changed in the diff stat)

Prose length, approximate word count of rendered text: NcclOverEfa 4011 to about 4107 (+2.4%), AIMLTraining 1686 to
about 1736 (+3.0%). The brief asked for flat or falling. I trimmed several times. The residue is new facts the
register made mandatory: P-07 chunk size, P-08 three-row split plus NCCL_IB_HCA, P-10 eager default, N-09 GIN
selection, the GDAKI how-to, and the A3 rewrites, which replace one wrong sentence with a cited mechanism.

## Pin moves applied

| Constant | Old | New | Files |
| --- | --- | --- | --- |
| PLUGIN_TAG (aws/aws-ofi-nccl) | v1.20.0 | v1.22.0 | both |
| NCCL_TAG (NVIDIA/nccl) | v2.30.4-1 | v2.32.3-1 | both |
| LIBFABRIC_TAG (ofiwg/libfabric) | v2.6.0 | v2.7.0 | both |
| Code read date | 2026-08-02 | 2026-10-23 | both (READ / REFRESHED) |
| PLUGIN_GIN_SPLIT | (new) | v1.21.0 | NcclOverEfa, one ref: first release with the v14 GDAKI export |

Kept unchanged: NCCL_221 (v2.21.5-1) and NCCL_222 (v2.22.3-1) for the historical tuner-symbol refs, and the three
plugin commit pins (segfaultFix, v2Guard faf2e8f2, v6HeadersImport), which keep read date 2026-08-02 through
READ_HISTORICAL.

NCCL citations moved out of `src/enqueue.cc` and `src/graph/tuning.cc` into `src/tuning/` at v2.32.3-1:
ncclEnvParse (cost_model.cc L306-L345), ncclEnableFlags (cost_model.cc L371-L384), ncclDropCandidate
(cost_model.cc L470-L497), ncclValidList (tuning.cc L128-L149), ncclInitTable (tuning.cc L204-L209), ncclUpdateTable
(tuning.cc L210-L216), ncclCallOrder (tuning.cc L202-L231), ncclPickMin (tuning.cc L155-L173). ncclChunk is new, at
`src/enqueue/enqueue.cc` L2355-L2365. ncclZeroBw and ncclAlgoTime were removed because the mechanism they cited
(zeroed bandwidth) does not exist at v2.32.3-1.

Plugin ranges re-derived at v1.22.0. I compared each moved range against the old one line by line (37 ranges, all
identical content) and corrected three where the register's range did not cover the claim:
- tunerV2: L140-L159, not L140-L158, because L159 closes the function.
- sortRails: L1089-L1119, not L1087-L1119.
- ncclSearchSort: L254-L283, not L251-L291, because the function starts at L254.

The tuner chunk-size range is L2345-L2375 (the function ends at L2375). releaseNotes is L12-L14 (v1.22.0), and
releaseNotesV120 is L90-L91 (the v1.20.0 entries for the tuner segfault fix and tuner v1 removal).

New keys:
- NcclOverEfa: ibHcaNote, paramEager, tunerPluginEnv, tunerChunk, regionTwoNodes, ncclChunk, ncclNetVersions,
  ncclEnableFlags, ncclDropCandidate, ncclValidList, ginProxyExports, ginGdakiExport, ginGdakiExportFirst,
  ginGdakiType, ginBuild, ginOpen, ginPlatformGate, ginCounterDecision, paramGdakiCounter, ncclGinVersions,
  ncclGinLoad, ncclGinType, ncclGinProxySkip, ncclGinTypes, gdaOpsDirect, releaseNotesV120.
- AIMLTraining: railObjects, railConnMsg, railCount, railAvInsert, topoDiscover, topoEnv, tunerPluginEnv,
  tunerPluginCall, gdrProbe, hmemProps, ptrSupport, gdrForce, paramEager, ginBuild, gdaOpsDirect, rdmCaps, rdmSize;
  doc neuronCollectives.

Removed keys:
- NcclOverEfa: ginSwitch, ginExport, paramGin (all OFI_NCCL_GIN_TYPE, gone at v1.21.0), ncclZeroBw, ncclAlgoTime.
- AIMLTraining: rdma (whole-file cite, replaced by the four multi-rail anchors).

## Diagrams touched

- NcclOverEfa PluginStackDiagram caption now reads "Layer boundaries and variable prefixes read from aws-ofi-nccl
  v1.22.0 and NCCL v2.32.3-1." Same length.
- NcclOverEfa KnobLayersDiagram: the chip `OFI_NCCL_GIN_TYPE` (status evidence) became
  `OFI_NCCL_GDAKI_EFA_HW_COUNTER` (status never). Row packing still gives two lines. Line 2 is about 611 of 620
  viewBox units wide, so there is no overflow. svg-a11y and pre-overflow pass. The Playwright overflow gate was not
  run (barred by the brief).

## CLAIM DIFF

Code URLs are pinned. PL = https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/, NC =
https://github.com/NVIDIA/nccl/blob/v2.32.3-1/, LF = https://github.com/ofiwg/libfabric/blob/v2.7.0/. Tier T1 code
unless stated. The release notes are a T1 first-party document used for orientation and version facts only.

| file:line | New text (short) | Source (pinned) + tier | Register row |
| --- | --- | --- | --- |
| AIMLTraining.tsx:212-216 | FI_EFA_GDA_OPS on efa-direct; the plugin consumes it through the GDAKI export of its GIN subsystem, built whenever libfabric and CUDA supply what it needs | LF prov/efa/src/fi_ext_efa.h#L11, LF prov/efa/src/efa_domain.c#L803-L808, PL src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L1256-L1274, PL configure.ac#L343-L351 [T1 code] | A3 ginGdaki/gdaOps, P-02 |
| AIMLTraining.tsx:284-289 | Header "dedicated collectives communication (CC) cores"; "Each NeuronCore has dedicated CC cores, synchronization processors that orchestrate collective communication" | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html [T1 doc, read 2026-10-23] | B-36, acronym CC |
| AIMLTraining.tsx:233-234 | NVLink 4th and 5th generation figures kept unchanged; NVLink doc accessed date set to 2026-10-23 | NVIDIA NVLink page [T1 doc] | B-30 |
| AIMLTraining.tsx:332-341 | "The other variables in the usual EFA environment block apply to the 2023 plugin releases." / "Leave NCCL_TUNER_PLUGIN unset too: on EC2 the plugin's CUDA build sets it to its own library" | PL src/platform-aws.cpp#L603-L661, #L757-L761 [T1 code] | A3 drift 4, changelog voice :305 |
| AIMLTraining.tsx:358-360 | RDM capability, size and ordering sentence re-cited to three separate ranges | LF prov/efa/src/efa_prov_info.c#L642-L649, #L622-L625, #L569-L572 [T1 code] | A3 rdmOrder |
| AIMLTraining.tsx:369 | hmem thresholds re-cited to the CUDA case only | LF prov/efa/src/efa_hmem.c#L62-L92 [T1 code] | A3 hmemThresholds |
| AIMLTraining.tsx:376-377 | eager fi_send path "off by default on the plugin's RDMA protocol at v1.22.0" | PL include/nccl_ofi_param.h#L223-L229 [T1 code] | P-10 |
| AIMLTraining.tsx:383-394 | Each rail has its own endpoint, AV and CQ; the connect message carries every rail's endpoint name; the receiver checks rail counts match and inserts each into that rail's AV, so a communicator spans every rail; file named nccl_ofi_rdma.c before the v1.15.0 move to C++ | PL include/nccl_ofi_rdma.h#L1414-L1457, PL src/nccl_ofi_rdma.cpp#L5983-L5990, #L5100-L5107, #L4904-L4920 [T1 code] | A3 drift 1, changelog voice :357-358 |
| AIMLTraining.tsx:396-410 | GPU memory support is decided once per process via FI_OPT_CUDA_API_PERMITTED on the first endpoint; with it CUDA pointers advertised, without it host pointers only and NCCL's Simple protocol; cuPointerGetAttributes resolved at init | PL src/nccl_ofi_ofiutils.cpp#L345-L372, PL src/nccl_ofi_net.cpp#L488-L492, #L405-L410, PL src/nccl_ofi_interface_nvidia.cpp#L95-L98, PL src/nccl_ofi_cuda.cpp#L238, #L607-L625 [T1 code] | A3 drift 2 (see deviation below) |
| AIMLTraining.tsx:436 | GDRCopy alert: "without it the plugin offers NCCL host buffers only" (was host staging) | PL src/nccl_ofi_interface_nvidia.cpp#L95-L98 [T1 code] | A3 host staging |
| AIMLTraining.tsx:459-472 | "Getting NCCL_TOPO_FILE right: leave it unset"; three files at v1.22.0; plugin points NCCL_TOPO_FILE at the match when unset; on P5 and later builds topology on the running instance and reorders EFA devices within each GPU's group | PL topology/ (gh api listing), PL src/platform-aws.cpp#L764-L790, PL src/nccl_ofi_topo.cpp#L934, PL src/platform-aws.cpp#L1089-L1119 [T1 code] | A3 drift 3, changelog voice :424-426 |
| NcclOverEfa.tsx:271 | Diagram caption pins v1.22.0 and v2.32.3-1 | pins [T1 code] | pin move |
| NcclOverEfa.tsx:312 | Knob chip OFI_NCCL_GDAKI_EFA_HW_COUNTER, status never | PL include/nccl_ofi_param.h#L379-L399 [T1 code] | P-01 |
| NcclOverEfa.tsx:501 | FI_EFA_USE_DEVICE_RDMA row: "with later releases" (was "with current software") | PL doc/efa-env-var.md#L28-L69 [T1 code] | changelog voice |
| NcclOverEfa.tsx:560 | Log meaning: "the plugin pointed NCCL_TOPO_FILE at it" | PL src/platform-aws.cpp#L764-L790 [T1 code] | A3 NCCL_TOPO_FILE owner |
| NcclOverEfa.tsx:614, 636 | Intro and "Where AWS documentation ends" read the plugin at v1.22.0 | pin [T1 code] | P-05 (version string) |
| NcclOverEfa.tsx:656 | one binary serves NCCL 2.17.1 through at least 2.32.3, which loads the same range | NC src/plugin/net.cc#L40-L42 [T1 code] | pin move (N-05 neighbour) |
| NcclOverEfa.tsx:686-692 | tuner bundled in the net plugin; "On EC2 the plugin's CUDA build also sets NCCL_TUNER_PLUGIN to its own library unless you set it first"; manual path scoped to NCCL 2.19 and 2.20 | PL src/Makefile.am#L169-L199, PL src/platform-aws.cpp#L603-L661 [T1 code] | A3 drift 4 (NCCL_TUNER_PLUGIN owner) |
| NcclOverEfa.tsx:699 | Env h2 description "The settings worth making, and the ones the plugin already owns for you" | n/a (description) | changelog voice |
| NcclOverEfa.tsx:712-713 | "OFI_NCCL_EAGER_MAX_SIZE defaults to -1, which turns eager messages off on the RDMA protocol" | PL include/nccl_ofi_param.h#L223-L229 [T1 code] | P-10 |
| NcclOverEfa.tsx:746-749 | BUFFSIZE conflict lists p6-b300; "On each of those platforms" (scope narrowed: p3dn, p5.4xlarge and g5 rows carry no env) | PL src/platform-aws.cpp#L87-L308, NC src/init.cc#L1006 [T1 code] | P-09, N-06 |
| NcclOverEfa.tsx:825-833 | p5en, p6-b200, p6-b300 separate entries at 35 microseconds; p5en and p6-b200 add NCCL_NETDEVS_POLICY max:1; p6-b200 and p6-b300 set NCCL_IB_HCA to invalid so NCCL's IB transports skip the baseboard ConnectX-7 bridge | PL src/platform-aws.cpp#L87-L308, #L81-L85 [T1 code] | P-08 |
| NcclOverEfa.tsx:955 | "NCCL then picks the lowest-cost candidate that remains" | NC src/tuning/tuning.cc#L155-L173 [T1 code] | N-03 |
| NcclOverEfa.tsx:986 | Tuner platform constants p5/p5e, p5en, p6-b200, p6-b300, unknown (unchanged, re-pinned) | PL include/tuner/nccl_ofi_tuner_process_config.h#L30-L53 [T1 code] | P-12 |
| NcclOverEfa.tsx:1001-1010 | NCCL 2.32.3 uses v6; through v6 the tuner can set chunk size, v1.22.0 does so only on p5en for two algorithm/protocol pairs at one rank per node; v1 removal cites v1.20.0 notes | NC src/include/plugin/nccl_tuner.h#L25, PL src/tuner/nccl_ofi_tuner.cpp#L190-L246, PL src/tuner/nccl_ofi_regions.cpp#L2345-L2375, NC src/enqueue/enqueue.cc#L2355-L2365, PL RELEASENOTES.md#L90-L91 [T1 code; notes T1 doc] | N-05, P-07, P-06 |
| NcclOverEfa.tsx:1022-1032 | Filter mechanism: env parsed into per-function enable flags at communicator setup; excluded combos get -1.0 and stay out of the candidate list; then init table to IGNORE, fill remaining, call tuner, pick minimum; tuner skips IGNORE cells | NC src/tuning/cost_model.cc#L306-L345, #L371-L384, #L470-L497, NC src/tuning/tuning.cc#L128-L149, #L204-L209, #L210-L216, #L202-L231, NC src/include/plugin/nccl_tuner.h#L43-L44, PL src/tuner/nccl_ofi_regions.cpp#L2173-L2196 [T1 code] | N-01, N-02, N-04 |
| NcclOverEfa.tsx:1050 | Segfault fix cites v1.20.0 release notes | PL RELEASENOTES.md#L90-L91 [T1 doc] | P-06 |
| NcclOverEfa.tsx:1094-1100 | cmpScore and search sort re-cited; selection path "in src/tuning" | NC src/graph/search.cc#L190-L212, #L254-L283 [T1 code] | N-07, pin move |
| NcclOverEfa.tsx:1112 | "GDR (GPUDirect RDMA)" first-use expansion | n/a | acronym GDR |
| NcclOverEfa.tsx:1144-1150 | v1.22.0 tested with NCCL v2.32.3-1, backward compatible to 2.17.1, tested with libfabric 2.7.0amzn2.0, min 1.11.0 to build, 1.22.0 for AWS support, 2.6.0 for the kernel-initiated GIN path | https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/RELEASENOTES.md#L12-L14 [T1 doc, orientation] | P-11 |
| NcclOverEfa.tsx:1212 | "it also reports the fabric" (was "it now also reports") | PL src/nccl_ofi_net.cpp#L644-L654 [T1 code] | changelog voice |
| NcclOverEfa.tsx:1231-1233 | h2 "GPUDirect Async: getting the GDAKI path" and payoff description | n/a | P-01 decision (rewrite around how to get GDAKI) |
| NcclOverEfa.tsx:1238-1250 | Proxy GIN exports v11/v13 "Libfabric"; GDAKI separate export from v1.21.0, interface v14, Libfabric_GDAKI, EFA_GDA type 5; NCCL 2.32.3 skips an external proxy export, so GDAKI is the only GIN path the plugin supplies | PL src/rdma/gin/nccl_ofi_gin_api.cpp#L566-L617, https://github.com/aws/aws-ofi-nccl/blob/v1.21.0/src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L1225-L1226, PL src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L1256-L1274, #L143, NC src/include/nccl_device/core.h#L74-L78, NC src/plugin/gin.cc#L164-L170 [T1 code] | P-01, P-03, N-09 |
| NcclOverEfa.tsx:1254-1262 | Instance: hardware completion counter declared only for p5en, p6-b200, p6-b300; elsewhere refused and logged; OFI_NCCL_GDAKI_EFA_HW_COUNTER is a bring-up override, leave at auto | PL src/platform-aws.cpp#L87-L308, PL src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L663-L668, PL src/platform-aws.cpp#L432-L448, PL include/nccl_ofi_param.h#L379-L399 [T1 code] | P-01 |
| NcclOverEfa.tsx:1264-1268 | Build: configure includes GDAKI automatically when libfabric and CUDA supply it, otherwise proxy-only and says so | PL configure.ac#L343-L351 [T1 code] | P-02 |
| NcclOverEfa.tsx:1270-1278 | Fabric: opens FI_EFA_GDA_OPS on the proxy's domain per rail; ops offered only on efa-direct; failure message names two causes | PL src/rdma/gin/nccl_ofi_gin_gdaki.cpp#L588-L681, LF prov/efa/src/fi_ext_efa.h#L11, LF prov/efa/src/efa_domain.c#L803-L808 [T1 code] | P-04 |
| NcclOverEfa.tsx:1280-1284 | NCCL: 2.32.3 tries v14 before v13, so a GDAKI build hands NCCL its GDAKI export; NCCL_GIN_TYPE=5 restricts to EFA_GDA, which forces GDAKI | NC src/plugin/gin.cc#L24-L26, #L79-L83, #L141-L147 [T1 code] | N-09 |
| NcclOverEfa.tsx:1323-1326 | "Jobs of two nodes or fewer are skipped by design and left to NCCL's own tuning, because the regions are not defined for them" | PL src/tuner/nccl_ofi_regions.cpp#L2162-L2167 [T1 code] | P-06 neighbour (range fix) |

The topology alert in NcclOverEfa also lost its rebuttal clause ("which is the opposite of what the old advice
promises"). That is a voice-only change with no new claim.

## Deviations from the registers (code wins)

- A3 drift 2 replacement says "decided once per device". In code `support_gdr` is a single global
  (PL src/nccl_ofi_net.cpp L68), set on the first endpoint (PL src/nccl_ofi_ofiutils.cpp L345-L372). The page says
  "once per process".
- A3 drift 3 cites nccl_ofi_topo.cpp L737 at v1.20.0. The equivalent hwloc load at v1.22.0 is L934.
- Register P-08 range L139-L220 is replaced by the whole table L87-L308 plus the IB_HCA comment L81-L85, because the
  claim spans three rows and the comment explains the invalid value.

## Requested orchestrator changes (Sources.tsx, sources.md, README.md)

1. sources.md rows 17, 33 and 34 still say aws-ofi-nccl v1.20.0 and 2026-08-02. Sources.tsx is already at v1.22.0 and
   2026-10-23, so sources.md needs to match. Row 32 still says NVIDIA/nccl v2.30.7-1 in sources.md, while Sources.tsx
   says v2.32.3-1.
2. Glossary CC (Sources.tsx L184) already reads "Collectives Communication" with the CC cores description, matching
   B-36. No change needed. Neuron collectives page is already source 19. No change needed.
3. Glossary GIN (Sources.tsx L228): "provides a proxy implementation and a kernel-initiated one" is still accurate. Optional
   addition: NCCL 2.32.3 skips an external plugin's proxy export, so on that release only GDAKI is used.
4. Glossary GDAKI (L229) and GDR (L177) already exist and match the page.
5. Sources.tsx claim map L101 ("P5 and P5en ship no static topology XML; the plugin generates one at run time") is
   consistent with the rewritten text. Optionally add a claim row for "NCCL_GIN_TYPE=5 forces GDAKI" pointing at a
   new code source NVIDIA/nccl src/plugin/gin.cc at v2.32.3-1 if the appendix lists code sources per claim.
6. U-4 (AIMLTraining "Prerequisites" alerts: Fabric Manager version match, 30 GiB disk, nouveau) remain unsourced.
   They are left in place and are out of G3's register scope.
7. The AIMLTraining protocol bullets for fi_send and fi_write carry no source of their own. The plugin's eager path
   calls fi_sendmsg rather than fi_send. Flagged for a later pass, not changed.
8. RMA first expansion lives in Libfabric.tsx (G2's block); GDAKI's first appearance in nav order is in Libfabric.tsx
   before NcclOverEfa expands it (flag from the 04 acronym sweep, G2's file).

## Rows skipped or partly applied, with reasons

- P-05 (GIN subsystem file count, CORRECT): version string moved to v1.22.0. The "seven implementation files and
  nine headers" sentence was cut in the GIN rewrite: it gives the reader neither a mental model nor an action, and a
  directory count has no line-level SourceRef. The queue-attribute detail went with it.
- P-06, P-09, P-12, N-04, N-05, N-06, N-07 (CORRECT): re-pinned only, no text change beyond the scope fix noted on
  P-09.
- N-03: mechanism wording applied. The register's [SPECULATIVE] point (no explicit non-negative guard) is kept out
  of the page per the brief.
- N-08 (internal IB and Socket plugin order, Operations.tsx): ignored per the brief; not a G3 file.
- B-30: 4th and 5th generation NVLink figures kept. The 6th generation was not added.
- NVSwitch acronym finding: optional per the sweep. It is a brand name, so it was left as written.

## Checks (foreground, run from deep-dives/efa or repo root)

- `pnpm --filter @tech-deep-dives/efa lint`: exit 0.
- `pnpm --filter @tech-deep-dives/efa test`: exit 0 (2 files, 12 tests).
- `bash scripts/gates/no-ai-tells.sh`: exit 0.
- `bash scripts/gates/svg-a11y.sh`: exit 0.
- `bash scripts/gates/pinned-refs.sh`: exit 0.
- `bash scripts/gates/pre-overflow.sh`: exit 0.
- `pnpm --filter @tech-deep-dives/efa typecheck`: exit 0 on the final run. An earlier run exited 2 on
  `src/sections/Operations.tsx(517,55)` (`eksNode` missing), another agent's file mid-edit; never an error in G3's files.

STATUS: COMPLETE
