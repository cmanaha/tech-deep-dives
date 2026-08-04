# Adversarial verification: EFA reshape pass 2

Reviewer: adversarial. Date 2026-08-02. Ground truth: `git HEAD` (398ef60).
Scope: 20 modified files under `deep-dives/efa/src/sections/`.
Method: mechanical extraction and set-diff of citations, facts and hedges from
`git show HEAD:<path>` against the working tree, plus targeted reads.
No file was modified. No build or gate was run.

Diff volume: 2,390 insertions, 2,524 deletions across 20 files.

## Verdict table

| # | Check | Verdict |
|---|-------|---------|
| 1 | Lost citations | **1 violation** (Libfabric orphaned one code source) |
| 2 | Lost or altered facts | **3 violations** (1 symbol, 1 version value, 1 operator-facing fact) |
| 3 | Hedge scope (the known trap) | **PASS, 0 violations** |
| 4 | Negative results weakened | **PASS** on both required items; 1 advisory |
| 5 | Unknowns quietly answered | **PASS, all open** |
| 6 | Banned numbers reintroduced | **PASS on reintroduction**; 7 pre-existing banned rows still render in Sources.tsx |
| 7 | Doc-versus-code conflicts survived | **PASS**, 24/24, `conflict` strings byte-identical |
| 8 | Did the pass achieve its goal | **Mostly PASS**; 5 residual negative-definition / page-methodology constructions |

---

## Check 1 — Lost citations

**Method.** Parsed each file's `const code` / `const docs` blocks (including
`driversRef`/`libfabricRef`-style helper resolution) and resolved every
`code.X` / `docs.Y` usage to a full identity string
(`repo@ref:path#lines`, or the doc URL). Diffed the *used* sets HEAD versus
working. Cross-checked with a component-agnostic sweep over every `https?://`
literal, every `repo:` / `ref:` / `path:` / `lines:` value, and every
`doc={...}` / `code={...}` usage expression.

**Result:**

- Distinct doc URLs: **0 lost** across all 20 files.
- Distinct repos, refs (SHA/tag) and line ranges: **0 lost** except one, below.
- Total `<SourceRef>` tags 913 → 894. Per-file reductions are
  SageMaker.tsx -15, Libfabric.tsx -3, NetworkComparison.tsx -2,
  EKSIntegration.tsx +1. Every one of those reductions except the Libfabric
  case is a duplicate tag pointing at a source still cited elsewhere in the
  same file, which is the deliberate SageMaker merge and is fine.

**VIOLATION 1 (medium).** `deep-dives/efa/src/sections/Libfabric.tsx` orphaned
`ofiwg/libfabric@v2.6.0:prov/efa/docs/efa_fabric_comparison.md#L271`.

- HEAD `Libfabric.tsx:79` defined `fabricComparison: lfab('prov/efa/docs/efa_fabric_comparison.md', 'L271')`.
- HEAD `Libfabric.tsx:843` used it on the sentence "The provider's own feature
  comparison agrees, listing the GPU Direct Async domain ops extension as
  unsupported on efa and supported on efa-direct".
- Both the definition and the usage are gone. The working paragraph is
  `Libfabric.tsx:847-856`. The file no longer cites that document anywhere.
- The only remaining mention of the file across all 20 sections is a plain
  string inside a `conflict=` prop at `DataPath.tsx:701`, which names lines
  281-282, not L271, and is not a pinned `CodeRef`.

Collateral in the same edit: the enumerated GDA function table
(`query_addr`, `query_qp_wqs`, `query_cq`, `cq_open_ext`, `get_mr_lkey`,
`cntr_open_ext`) was compressed to prose at `Libfabric.tsx:848-852`. Two of
those six symbols survive further down at `Libfabric.tsx:863-866`; four do not
appear anywhere in the working tree.

---

## Check 2 — Lost or altered facts

**All eleven priority facts verified present and unchanged:**

| Fact | Location(s) in working tree |
|---|---|
| 32 / 33 / 32 counts | `EfaDevice.tsx:394`, `EfaDevice.tsx:492` |
| p99 factor of ten | 7 occurrences: `Overview.tsx:78`, `Overview.tsx:159`, `NetworkComparison.tsx:214`, `NetworkComparison.tsx:291`, `SrdProtocol.tsx:1125`, `SrdProtocol.tsx:1236`, `HPC.tsx` chain |
| recvwin 16 vs 16384 | `Libfabric.tsx:1038`, `Libfabric.tsx:1046`, `SrdProtocol.tsx:1064-1083`, `SrdProtocol.tsx:1112` |
| Nitro-to-EFA generation mapping | All four pairs, identical counts HEAD vs work: `EfaDevice.tsx:810-811`, `InstanceSupport.tsx:24-27`, `InstanceSupport.tsx:38-39`, `InstanceSupport.tsx:350-352` |
| p5.48xlarge 55.04 | `Pricing.tsx:271`, `Pricing.tsx:391` (repeated once more than HEAD, per rule 9) |
| p4d 21.957642 | `Pricing.tsx:271` |
| June 2025 cut | `Pricing.tsx:270`, `Pricing.tsx:390` |
| FSx 100 / 700 / 1200 Gbps ceilings | `StorageDataPaths.tsx:186`, `:227`, `:347`, `:359`, `:653`; literal counts identical HEAD vs work |
| SMDDP three instance types | `SageMaker.tsx:566`, `:592`, `:1281-1287`; occurrence counts rose 5→7, 8→11, 8→11 |
| SMDDP 2024-10-17 release | `SageMaker.tsx:613` ("SMDDP v2.5.0, October 17, 2024"), `SageMaker.tsx:1296-1297` |
| Driver r2.12.0 | `DataPath.tsx:558` |

**VIOLATION 2 (medium).** `Libfabric.tsx:939-945` — the literal symbol
`efa_rdm_ep.c` and the fact attached to it were deleted. HEAD
`Libfabric.tsx:934` read: "The same applies to efa_rdm_ep.c, which was split
into a header plus two implementation files." Neither the filename nor the
split survives anywhere in the working tree. This is the same class of silent
symbol deletion the previous round was caught on. The surrounding paragraph was
otherwise only reframed.

**VIOLATION 3 (low, but a value change).** `SageMaker.tsx:1160` — the version
string changed from `1.48` to `1.48.0`. HEAD `SageMaker.tsx:1208` and
`SageMaker.tsx:1210` both read "EFA installer 1.48 and later". Work reads "for
EFA installer 1.48.0 and later". The citation (`code.dlcNgc`) is unchanged, so
the rewritten value is not what the cited source was quoted as saying. A
reframing pass may not add a patch component to a version.

**VIOLATION 4 (low).** `SageMaker.tsx:1074-1080` — deleted without replacement:
"The status string you will see is a message about repairing the training
cluster due to hardware failure." (HEAD `SageMaker.tsx:1122-1123`). This is
operator-facing and passes the practical-to-know test; it is the string a
reader greps for mid-incident. The `docs.repair` citation survives on the
preceding sentence, so no source was orphaned, but the fact is gone.

**Advisory.** `AIMLInference.tsx:96` — the "30 to 50%" figure was removed from
the warning that debunks it. HEAD `AIMLInference.tsx:98` read "A figure in the
30 to 50% range circulates"; work reads "A percentage figure circulates". The
hedge and the citation survive, but the reader can no longer recognise which
figure is being warned about. This moves in the right direction for check 6 and
the wrong direction for usefulness.

---

## Check 3 — Hedge scope (highest priority)

**PASS. Zero scopes dropped.** This is the check the previous round failed, and
this pass did not repeat it.

Method: extracted all 52 lines added by this pass containing
`no AWS` / `nothing` / `never` / `does not exist` / `is not available` /
`no source` / `none` / `no such` / `no evidence` / `no published`, excluding SVG
and comment noise, and matched each against HEAD. Separately, extracted every
removed line containing a scope marker (`was located`, `during this research`,
`found`, `in the documentation`, `read for this page`, `were read`, `checked`,
`fetched`) and confirmed the scope survives.

Scopes confirmed preserved verbatim:

- `SageMaker.tsx:1303-1305` — "No AWS deprecation notice was found, so treat SMDDP as frozen"
- `SageMaker.tsx:908-910` — "No AWS source found states that training jobs use EC2 cluster placement groups"
- `SageMaker.tsx:1080-1082` — "No source found states whether that pre-flight check exercises the EFA path"
- `SageMaker.tsx:1091-1093` — "is not addressed by any AWS source found"
- `AIMLInference.tsx:96-98` — "No benchmark that supports it was located during this research"
- `NetworkComparison.tsx:293-294` — "no NVIDIA page stating them was located"
- `TopologyApi.tsx:1475-1476` — "No AWS benchmark quantifying the gain from topology-aware ranking was located"
- `TopologyApi.tsx:1007` — "Throttle defaults: UNKNOWN. No AWS page located during this research"
- `EnaVsEfa.tsx:1054` — "No source in the repository states that mapping"
- `EnaVsEfa.tsx:1071-1073` — "the fetched documentation does not address it"
- `StorageDataPaths.tsx:1205-1210` — the CRT scope paragraph, verbatim, including
  "The C++ and Rust bindings and the Java SDK transfer manager were not read."

Two changes moved in the *safe* direction:

- `EKSIntegration.tsx:1156` — HEAD "No AWS source states a reason." → work
  "No AWS source states a reason for those three." Narrowed.
- `EfaDevice.tsx:817` — HEAD header "the mapping you have seen quoted does not
  exist" → work "no AWS source maps one to the other". A universal claim about
  the world was replaced with a sourcing claim. Improvement.

One structural change that looks like a loss but is not: TopologyApi's summary
list of open gaps went from five bullets to three (`TopologyApi.tsx:1470-1492`).
The two dropped bullets both survive in the body of the same file — throttle
defaults at `TopologyApi.tsx:1007-1015`, and the unmeasured cost of the
hard-coded index defect at `TopologyApi.tsx:717-719`. Deduplication, not
deletion.

---

## Check 4 — Negative results

**Required sentence, verbatim, PASS.** `SageMaker.tsx:1752-1760`:

> Absence of documentation is not the same as documented absence. No AWS page
> found says EFA is not available on real-time endpoints. What can be asserted
> with confidence is narrower and still decisive: the API has no EFA control,
> the managed inference image specification lists no EFA stack, and every AWS
> scaling recommendation for endpoints is either intra-instance or
> replica-based.

Byte-identical to HEAD, with the `docs.dpd` citation and the "five instance
types, in a single Availability Zone" clause intact.

**Documented-absence-of-control framing, PASS.** The section reads as a control
surface with a boundary, not as an AWS non-support statement:
`SageMaker.tsx:1720-1731` ("No EFA field appears within it, no field for
sharding one model across instances, and no EFA, libfabric or aws-ofi-nccl
stack in any image description"), and `SageMaker.tsx:1771` ("Treat SMP for
inference as undocumented rather than unsupported").

**Advisory.** HEAD `SageMaker.tsx:1805-1808` carried an explicit guard sentence
that has been deleted: "Each is stated as documented absence of control, which
is what the evidence supports, rather than as an AWS statement of non-support,
which no source provides." The Alert at `SageMaker.tsx:1752` still carries the
load, so the finding is not weakened. But the standard's own distinction is now
implicit only, which removes the guard against a future editor drifting.

**SMDDP frozen, not deprecated, PASS.** `SageMaker.tsx:1273` header "SMDDP: a
P4-era library, frozen since October 2024". `SageMaker.tsx:1303-1305` "No AWS
deprecation notice was found, so treat SMDDP as frozen: still documented, still
scoped to those three instance types, unchanged since October 2024." The word
"deprecated" appears nowhere in connection with SMDDP.

---

## Check 5 — Unknowns quietly answered

**PASS. None resolved.**

EnaVsEfa's three, all still under a container headed "Three questions that stay
open" at `EnaVsEfa.tsx:1007-1015`:

1. ENA Express 25 Gbps same-AZ versus same-Region — `EnaVsEfa.tsx:1018-1043`.
   Both AWS quotations preserved verbatim, both citations intact, closes on
   "confirm it before you build on it".
2. 0xefa0 to 0xefa4 mapping — `EnaVsEfa.tsx:1045-1059`. **Still not asserted.**
   "No source in the repository states that mapping ... so do not infer a
   generation from a device ID." Corroborated independently at
   `EfaDevice.tsx:817-828`, which calls the equivalence "unsourced inference".
3. ENA Express on the ENA half of an EFA attachment — `EnaVsEfa.tsx:1061-1075`.
   Body byte-identical to HEAD; only the `headerDescription` was reframed.

Operations' six UNKNOWN markers, all present: `Operations.tsx:24` (file
comment), `:577`, `:743`, `:1052`, `:1090`, `:1252`. HEAD had the same six at
`:24, :575, :741, :1044, :1082, :1245`.

TopologyApi's AWS-versus-AWS contradictions, all open:

- p6e-gb200 node depth — `TopologyApi.tsx:745-762`, conflict string unchanged.
- EKS labelling scope — `TopologyApi.tsx:1396-1414`, conflict string unchanged,
  including "No EKS User Guide page enumerating
  topology.k8s.aws/network-node-layer-* as a standard managed node group label
  was located."
- Three capacity-reservation limits — `TopologyApi.tsx:1110-1145`, both conflict
  strings and all three values (10, 100, 20/100) byte-identical to HEAD.

---

## Check 6 — Banned numbers

**No banned number was reintroduced into any body section.** Swept for
`85 to 95` / `85-95`, `40 to 60` / `40-60`, `90%+`, `4x`, `extra-linear`,
`super-linear`, `200 cores`, `2.05`, `1.2x`, `ConnectX`, MoE gap,
`30 to 50`, `P99.9`, `85%`, and every microsecond figure. The 19 body sections
are clean. The only microsecond figures present are the plugin's own
per-platform latency hints (`NcclOverEfa.tsx:572, 820, 826, 832, 844, 1212`),
which are cited configuration constants and not measurements, plus explicitly
hedged prose ("tens of microseconds", `EnaVsEfa.tsx:795`, `SrdProtocol.tsx:1276`).

This pass also correctly deleted one banned row: HEAD `Sources.tsx:127`
"90%+ scaling efficiency with EFA vs 40-60% without".

**FINDING (medium, pre-existing, not introduced by this pass).** Seven banned
claims still render in the Sources appendix fact-check table. `Sources.tsx:266`
passes `factChecks` into `<SourcesAppendix>`, so these are on the page:

- `Sources.tsx:55` — `~100+ microseconds TCP kernel overhead per message`
- `Sources.tsx:56` — `~15 microseconds EFA MPI ping-pong latency` (a microsecond latency figure presented as measured)
- `Sources.tsx:69` — `P99.9 latency 85% reduction versus TCP`
- `Sources.tsx:87` — `85-95% scaling efficiency with EFA on P5 for DDP`
- `Sources.tsx:88` — `40-60% scaling efficiency without EFA at same scale`
- `Sources.tsx:106` — `4x improvement in CFD scaling over ENA`
- `Sources.tsx:109` — `Up to 2.05x MD speedup at 2 instances vs ENA`

These directly contradict the body. `AIMLTraining.tsx:471-477` states that no
scaling efficiency band traces to a citable benchmark "so this page quotes
neither", while `Sources.tsx:87-88` quotes both. `NetworkComparison.tsx:21` has
a file comment saying P99.9 and the 85% reduction were removed as wrong, while
`Sources.tsx:69` still lists the claim. The pass touched `Sources.tsx` and
removed exactly one of eight banned rows; it should have removed all eight or
none.

---

## Check 7 — Doc-versus-code conflicts

**PASS, complete.** All 24 `provenance="doc-code-conflict"` `SourceRef` tags
survive. Per-file counts are identical HEAD versus working (DataPath 2,
EKSIntegration 2, InstanceSupport 2, Libfabric 3, NcclOverEfa 3, Operations 3,
SageMaker 2, SrdProtocol 1, StorageDataPaths 1, TopologyApi 5). Every
`conflict="..."` prop string is **byte-identical** between HEAD and the working
tree; the set difference in both directions is empty.

Each named item located and still saying code wins:

| Conflict | Location |
|---|---|
| FI_EFA_RECVWIN_SIZE | `Libfabric.tsx:1046`, `SrdProtocol.tsx:1112` |
| FI_EFA_SHM_AV_SIZE | `Libfabric.tsx:1057` |
| efa_fabric_comparison.md | `DataPath.tsx:701` |
| SRD.txt | `DataPath.tsx:866-874` ("It is not one, and the code wins") |
| NCCL_BUFFSIZE | `NcclOverEfa.tsx:753` |
| Tuner fallback log variable name | `NcclOverEfa.tsx:1123` (`NCCL_OFI_TUNER_TYPE`) |
| p6e-gb200 EFA v3 versus v4 | `InstanceSupport.tsx:422` |
| Bottlerocket | `EKSIntegration.tsx:798` |
| AWS Batch SDK model | `EKSIntegration.tsx:1492-1517` |
| P5 FI_EFA_USE_DEVICE_RDMA repo disagreement | `SageMaker.tsx:1032` |
| CRT blog versus code | `StorageDataPaths.tsx:1174` and `:1205-1210`, scoped to the artifacts actually read |

---

## Check 8 — Did the pass achieve its goal

Sampled all 20 files, read 10 in full or near-full (Overview, HPC,
NetworkComparison, Pricing, InstanceSupport, EnaVsEfa, Libfabric,
StorageDataPaths, TopologyApi, SageMaker).

**Achieved:**

- `"The problem:"` openings: **11 → 0**. HEAD had them at AIMLInference:50,
  DataPath:484, EKSIntegration:648, EfaDevice:392, Libfabric:459,
  NcclOverEfa:615, Operations:560, Overview:62, SageMaker:860, SrdProtocol:630,
  TopologyApi:593. None remains.
- h2 headers with no description: **5 → 0**. HEAD had three in
  NetworkComparison.tsx and two in Pricing.tsx.
- No file ends on methodology or a lookup table. All 19 content sections close
  on a reader-action h2 ("Deciding it for your own deployment", "Working
  checklist", "Proving it works", "Choosing a path", "What to settle before you
  launch", "When reading topology changes the outcome", and so on).
- Word count held or fell. Reader-facing text 376,258 → 370,372 characters
  (-1.6%). Only four files grew, all under +0.7% (Libfabric +138 chars,
  Operations +100, DataPath +18, NetworkComparison +2).
- No key-takeaways box anywhere. No `not just X but Y`. No em-dash, en-dash
  range or curly quote in any of the 20 files.

**Residual negative-definition and page-methodology constructions (rules 1, 4, 5):**

- `AIMLTraining.tsx:471` — Alert header "This page quotes no efficiency band,
  and here is why". Reworded this pass from HEAD's "No efficiency percentage is
  published here", so it was touched and left as a negative definition, and it
  is page-methodology voice on top.
- `Operations.tsx:574` — Alert header "Numbers this page does not give you".
  Untouched by the pass. Same two problems.
- `SageMaker.tsx:1071` — headerDescription "Cluster repair is documented in
  detail. Its EFA coverage is not." **Newly written by this pass** and it is a
  negative-definition ellipsis.
- `StorageDataPaths.tsx:810` — h3 description "All rows documented by AWS. No
  code source exists for the service side." Untouched, and it is an unscoped
  absolute existence claim.
- `EnaVsEfa.tsx:483` — "No overlap in either direction." Untouched.
- `HPC.tsx:194` — `<ExpandableSection headerText="HPC-specific EFA considerations">`
  restates the topic and carries no description.

**Meaning changes from negative-to-positive rewrites (all low severity, none an
overstatement of a source):**

- `HPC.tsx:165-167` — HEAD "MPICH works over the same libfabric provider but is
  not on that list, so treat it as unsupported by AWS rather than broken." →
  work "MPICH runs over the same libfabric provider, and AWS support covers the
  two named above." The actionable instruction ("treat it as unsupported by
  AWS") is now only inferable. Weakened, not overstated.
- `Sources.tsx:208` — CRT glossary lost "never over EFA", now "Its traffic is
  TCP on the ENA device". The finding itself survives in StorageDataPaths.
- `Sources.tsx:229` — DMA glossary changed from "does not go through the CPU"
  to "straight to and from host memory". The new phrasing narrows DMA to host
  memory, which is not what DMA means generally.
- `Sources.tsx:191` — UCCL glossary lost "It is not an NVIDIA project", the
  correction that made the entry worth having next to the NIXL warning.

**Checked and found nothing wrong:** the InstanceSupport P6-B300 rewrite
(`InstanceSupport.tsx:441-450`) is arithmetically consistent (17 cards, primary
is ENA-only, 16 x 400 = 6,400). The Pricing reframe of the three unverified
Capacity Block claims (`Pricing.tsx:378-392`) keeps all three claims and the
scoping sentence "None of the three appears in the Capacity Blocks
documentation or on the pricing page" while dropping only the page-history
framing, which is exactly what the standard asks for.

---

## Summary of confirmed violations, most severe first

1. `deep-dives/efa/src/sections/Libfabric.tsx` — orphaned code source
   `ofiwg/libfabric@v2.6.0:prov/efa/docs/efa_fabric_comparison.md#L271`
   (was HEAD `Libfabric.tsx:79` and `:843`). Only lost citation in the dive.
2. `deep-dives/efa/src/sections/Sources.tsx:55,56,69,87,88,106,109` — seven
   banned numbers still render in the fact-check appendix, contradicting
   `AIMLTraining.tsx:471-477` and `NetworkComparison.tsx:21`. Pre-existing, but
   the pass edited this file and removed only one of eight.
3. `deep-dives/efa/src/sections/Libfabric.tsx:939-945` — literal symbol
   `efa_rdm_ep.c` and its split-into-three fact deleted (HEAD `:934`).
4. `deep-dives/efa/src/sections/SageMaker.tsx:1074-1080` — deleted the cluster
   repair status string an operator would grep for (HEAD `:1122-1123`).
5. `deep-dives/efa/src/sections/SageMaker.tsx:1160` — version value changed
   from `1.48` to `1.48.0` under an unchanged citation (HEAD `:1208`, `:1210`).
6. `deep-dives/efa/src/sections/SageMaker.tsx:1071` — new negative-definition
   headerDescription written by this pass.
7. `deep-dives/efa/src/sections/AIMLTraining.tsx:471`,
   `Operations.tsx:574`, `StorageDataPaths.tsx:810`, `EnaVsEfa.tsx:483`,
   `HPC.tsx:194` — surviving negative-definition or page-methodology
   constructions the pass was meant to rewrite.
8. Advisory, `deep-dives/efa/src/sections/SageMaker.tsx` — the explicit
   documented-absence-of-control guard sentence (HEAD `:1805-1808`) was
   deleted; the finding still reads correctly but is no longer self-defending.
