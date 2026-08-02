# Adversarial Review: Editorial Reshape Pass, 10 EFA Sections

Date: 2026-08-02
Reviewer posture: adversarial. Ground truth is `git HEAD`. Every claim below was
produced by diffing HEAD against the working tree mechanically, not by reading
the agents' self-reports.

Method:
- Citation sets: extracted every `https?://` literal and every `*Ref('path','Lx-Ly')`
  helper call per file, HEAD vs work, and diffed the sets.
- Citation *uses*: counted every `docs.KEY` / `code.KEY` reference per file and
  diffed the counts, so a source that kept its definition but lost its last
  in-page use would surface.
- Facts: built a multiset of every token matching `[A-Za-z_./-]*\d[\w.%/-]*`
  (numbers, versions, instance types, paths with digits) per file and reported
  every token that disappeared or dropped in count.
- Concepts: built a multiset of every prose word of 5+ characters (JSX tags
  stripped) per file and reported every word that went to zero.
- Everything flagged by those sweeps was then read in full diff context.

## Verdict table

| # | Check | Verdict |
|---|---|---|
| 1 | Lost citations | PASS |
| 2 | Lost or altered facts | 3 findings (1 medium, 2 low) |
| 3 | Reintroduced numbers | PASS |
| 4 | Unknowns quietly answered | PASS on all 8 unknowns; 1 medium systemic finding |
| 5 | Changelog survivors | PASS in scope; out-of-scope leakage reported |
| 6 | Doc-vs-code conflicts survived | PASS, 7 of 7 |
| 7 | Structural claims | PASS on h2 descriptions (55/55); 1 low finding on endings |

Net: the pass did what it said far more faithfully than the brief's risk model
assumed. 8 confirmed issues, one of which (F4) is a real source-authority
regression and is the only one I would insist on before shipping.

---

## Check 1 — Lost citations: PASS

Per-file, the set of distinct documentation URLs and the set of distinct code
refs (repo + ref + path + lines) are **byte-identical between HEAD and the
working tree in all ten files**:

| File | URLs | Code refs |
|---|---|---|
| Overview.tsx | 3 (unchanged) | 0 |
| DataPath.tsx | 3 (unchanged) | 0 (helper-built, unchanged) |
| SrdProtocol.tsx | 10 (unchanged) | 26 (unchanged) |
| EfaDevice.tsx | 3 (unchanged) | 0 |
| Libfabric.tsx | 1 (unchanged) | 0 |
| EnaVsEfa.tsx | 3 (unchanged) | 0 |
| TopologyApi.tsx | 19 (unchanged) | 0 |
| InstanceSupport.tsx | 0 | 0 |
| NcclOverEfa.tsx | 1 (unchanged) | 0 |
| AIMLTraining.tsx | 4 (unchanged) | 0 |

Use-count changes, all four benign:

- `DataPath.tsx` `code.mmapProt` 2 -> 1. This is the only *decrease* anywhere.
  It is the legitimate duplicate loss the brief permits: the second use lived in
  the deleted `Alert type="error" header="Correction: doorbells are not
  write-combined"` block (HEAD DataPath.tsx:718-725). The fact it carried was
  folded into the surviving prose at **DataPath.tsx:767-769** ("the memory BAR
  is the write-combining case in the same switch statement"), which still cites
  `code.mmapProt`. No source lost its last use.
- `SrdProtocol.tsx` `docs.hpcBlog` 6 -> 7 (added, rule 7 repetition).
- `NcclOverEfa.tsx` `code.envCheatsheet` 1 -> 2 and `code.tunerV2` 1 -> 2 (added).

`doc-code-conflict` SourceRef counts are identical per file: DataPath 2,
SrdProtocol 1, Libfabric 3, TopologyApi 5, InstanceSupport 2, NcclOverEfa 3,
Overview/EfaDevice/EnaVsEfa/AIMLTraining 0.

No unused imports were left behind in any of the ten files (checked
component-by-component against `<Name` usage). `Alert` was correctly dropped
from `Overview.tsx` when its last Alert was removed.

---

## Check 2 — Lost or altered facts

### The priority items the brief named: all clean

- **32 / 33 / 32.** Intact and, per rule 7, now repeated three times instead of
  once: EfaDevice.tsx:394, the new h2 description at **EfaDevice.tsx:483**
  ("32, 33, 32 and something that is not a count at all"), and the expanded
  body at **EfaDevice.tsx:508-512**, which also adds the rule-8 consequence line
  ("ask a Kubernetes resource claim for 33 of something the instance has 32
  of"). Supporting figures at EfaDevice.tsx:211, :249, :329, :506 unchanged.
- **p99 factor of ten.** Intact and now repeated: Overview.tsx:79, Overview.tsx:160,
  SrdProtocol.tsx:643, SrdProtocol.tsx:1135 (new), SrdProtocol.tsx:1246 (new h2
  description). Exactly the rule-7 behaviour the standard asked for.
- **recvwin 16 vs 16384.** Fully intact on both pages, including every commit
  SHA and date in the conflict payload: SrdProtocol.tsx:1074-1122 (the entire
  `conflict=` string, with `7232f8af (2025-10-16)` and `bd987ab2 (2025-11-18)`,
  is unchanged) and Libfabric.tsx:1026-1037.
- **EFA generation to Nitro mapping.** Verbatim table headings preserved at
  **InstanceSupport.tsx:345-348**: "Using Nitro v6 (EFA v4), Using Nitro v5 (EFA
  v3), Using Nitro v4 (EFA v2) and Using Nitro v3 (EFA v1)". The five RDMA-write
  exceptions (c7gn.16xlarge, c7gn.metal, hpc7g.4xlarge, hpc7g.8xlarge,
  hpc7g.16xlarge) and the two Nitro v3 RDMA-read types (p4d.24xlarge,
  p4de.24xlarge) all survive at InstanceSupport.tsx:352-359. Also restated at
  EfaDevice.tsx:797-801.
- **p5.48xlarge figures.** All intact: 32 cards / 33 interfaces / 32 EFA devices
  (EfaDevice.tsx:249, :506-512), four EFA devices sharing a PCIe root with one
  GPU (EfaDevice.tsx:576), the eight-groups inference still labelled inference
  (EfaDevice.tsx:582-585).
- **Driver and installer versions.** installer 1.49.0, driver r3.3.0, driver
  3.1.0, libfabric v2.6.0, plugin v1.20.0, NCCL v2.30.4-1 and every pinned
  commit SHA are present and unchanged. One exception, F1 below.

### F1 (MEDIUM) — `r2.12.0` deleted from the site

**DataPath.tsx:548** (was HEAD DataPath.tsx:782).

HEAD:
```
headerDescription="The out-of-tree driver implements post_send, post_recv and poll_cq, and has since r2.12.0"
```
Now:
```
headerDescription="The out-of-tree module AWS ships implements the hot-path verbs. The one inside mainline Linux does not."
```

A fixed-string search for `r2.12.0` across all ten files returns zero hits. It
was also removed from the file comment (HEAD DataPath.tsx:22). This is the only
version number lost anywhere in the pass, and it was the only "since when"
anchor on the claim. Rule 3 says no verified fact leaves. Recommend restoring it
to the headerDescription or to the body sentence at DataPath.tsx:552-556.

### F2 (LOW-MEDIUM) — the literal symbols `post_send`, `post_recv`, `poll_cq` are gone

**DataPath.tsx:548**. Four occurrences at HEAD (line 21 comment, line 782
headerDescription x3), zero now. The body at **DataPath.tsx:553-554** still
describes them in expanded English ("post send, post receive, poll completion
queue and request notify") and the citation `code.kverbs` is intact, so the fact
survives. What is lost is the greppable API symbol: a reader who searches the
page for `post_send` after reading a mailing-list thread now finds nothing.
Reframing should not have cost the identifier.

### F3 (LOW) — a header restates an AWS quote less precisely than the body

**EfaDevice.tsx:571**: `header="AWS documents four EFA devices per GPU. ..."`

What AWS documents, quoted accurately two lines later at **EfaDevice.tsx:575-577**,
is "four EFA devices that share the same PCIe root with one GPU". The header
converts a PCIe-root locality statement into a bare per-GPU ratio and attributes
it to AWS. HEAD's header named the PCIe root explicitly. The body is correct;
only the header overstates.

### Everything else in this check is clean

Outside F1-F3, the numeric/identifier token multiset is unchanged in all ten
files. Count decreases were traced individually and every one is the removal of
a changelog sentence that happened to contain the token, with the token still
present elsewhere in the same file:

- DataPath `1`/`2`/`3` -3: the numbered list in the deleted file comment.
- EfaDevice `4` -1, `8` -1: the reworded Alert header at :571.
- InstanceSupport `v3` -1, `v4` -1, `v6` -1: the deleted "Correction: this page
  had the generation mapping off by one" alert. The mapping itself survives.
- NcclOverEfa `v1.20.0` -1: the deleted "None of those hold at v1.20.0" line.
- AIMLTraining `v2` -1: the deleted file-comment bullet. Body still says "the v2
  entry point".
- TopologyApi `4-layer` -1, `h3` -1: the reworded alert header at :688 and the
  `<Header variant="h3">` that became an `ExpandableSection` headerText at :925.

---

## Check 3 — Reintroduced numbers: PASS

Fixed-string search (not regex, so `4x` and `p5.48` cannot false-match) of
`AIMLTraining.tsx` for: `85`, `95%`, `85 to 95`, `40 to 60`, `4x`, `ConnectX`,
`NIXL`, `30 to 50`, `microsecond`, `scaling-efficiency`. **Zero hits.**

`NetworkComparison.tsx` was not modified by this pass (it is not in the changed
set; `git status` shows it clean), so its removals stand untouched.

The negative guard survives in reader-facing prose at **AIMLTraining.tsx:146-152**:
"No scaling efficiency band for EFA on P5, and none for TCP at the same scale,
traces to a benchmark that can be cited, so this page quotes neither."

### O1 (observation, LOW) — two named guards were dropped

Nothing came back, but the page no longer records *what* was deliberately left
out:

- HEAD AIMLTraining.tsx:187-190 named the removed InfiniBand ConnectX-7
  message-size comparison. `ConnectX` now appears nowhere in the file.
- HEAD AIMLTraining.tsx:220 read `EFA beneficial. No sourced MoE dispatch gap to
  report.` **AIMLTraining.tsx:218** now reads `EFA beneficial: all-to-all volume
  is set by the routing, not by the model size`.
- HEAD Overview.tsx:70-77 carried a reader-facing Alert, "Why there is no
  microsecond figure on this page". It is gone from the rendered page. The guard
  does survive in the file comment at **Overview.tsx:13-18** ("no AWS source
  states a per-message microsecond figure for EFA or for TCP, so none appears
  here. Do not add one without a Tier 1 or Tier 2 citation").

All three deletions are compliant with rule 1 (delete the changelog). The risk
is that the next author has no in-page signal that these figures were removed on
purpose. That is a judgement call for Carlos, not a rule violation.

### O2 (observation, LOW) — agent-facing provenance breadcrumbs removed

Three file comments lost their pointers back to the research that produced the
corrections:

- **Overview.tsx:13-18** no longer cites `research/2026-08-refresh/01-efa-core.md,
  U-1 and U-3`. The behavioural guard itself survives.
- **DataPath.tsx:14-21** no longer enumerates the three corrected claims.
- **AIMLTraining.tsx:13-21** no longer enumerates the four corrections. The facts
  they encoded (`src/tuner/nccl_ofi_tuner.cpp`, `src/graph/search.cc`, "never a
  `src/search.cc`", `FI_EFA_GDA_OPS`) are all still in the reader-facing body,
  verified present.

Under the dual-audience rule these comments are the agent-facing guardrail
against re-litigating settled corrections. Rule 1 targets reader-facing prose;
whether it should have been applied to code comments is arguable.

---

## Check 4 — Unknowns quietly answered: PASS on all eight

### EnaVsEfa: all three open

Relocated from a trailing "What this section does not know" container into
**EnaVsEfa.tsx:1024-1096**, `Three questions that stay open`, description "No
first-party source settles any of these three. Do not size anything on them."

1. **ENA Express 25 Gbps, same-AZ vs same-Region** — EnaVsEfa.tsx:1036-1064.
   Both verbatim AWS quotes intact (the bandwidth guide's "within the same
   Availability Zone ... up to 25 Gbps", the ENA Express guide's "from 5 Gbps up
   to 25 Gbps within the same Region, up to the aggregate instance limit").
   Still unresolved: "These cannot both be the scope, and the driver cannot break
   the tie, because it only reads counters ... If you are sizing on the 25 Gbps
   figure across Availability Zones, confirm it before you build on it."
   The only loss is the meta-sentence "Both quotes are published here and neither
   is picked", which is reviewer voice.
2. **0xefa0 to 0xefa4 mapping** — EnaVsEfa.tsx:1066-1081. **Still not asserted.**
   "No source in the repository states that mapping, and five identifiers against
   four named generations does not reconcile cleanly under any obvious rule, so
   do not infer a generation from a device ID." HEAD's "This page does not assert
   it" became a reader-directed imperative; the assertion is still absent.
3. **ENA Express on the ENA half of an EFA attachment** — EnaVsEfa.tsx:1083-1095,
   textually unchanged. Still "not determinable from driver code".

### TopologyApi: all five gaps and all three contradictions open

Five gaps, relocated into `What no AWS source states` at
**TopologyApi.tsx:1471-1508**: no speedup figure (:1479), no published throttle
defaults (:1483), no layer-to-hardware mapping (:1491), no measured impact for
the hard-coded index defect (:1495), two open contradictions (:1499).

Three contradictions:

1. **p6e-gb200.36xlarge depth, 3 vs 4 layers** — TopologyApi.tsx:742-772.
   Renamed from "Contradiction: how deep is p6e-gb200.36xlarge?" to "AWS states
   the depth of p6e-gb200.36xlarge two ways", description unchanged ("A Tier 1
   page implies three layers, a Tier 2 blog implies four"). Still open:
   "Trust neither number: read the depth from the array length at run time,
   which is correct under either answer."
2. **EKS labelling scope** — TopologyApi.tsx:1400-1430. Renamed, description now
   "AWS says both. The answer decides whether you need the DaemonSet above."
   `doc-code-conflict` payload intact. Still open.
3. **Three AWS pages, three reservation limits** — TopologyApi.tsx:1115-1158.
   Every number survives: API reference max 10 IDs and MaxResults default 10
   range 1 to 10 (:1121-1123); CLI reference max 100 (:1126-1135); User Guide
   examples page default 20 / max 100 (:1136-1144). Both `doc-code-conflict`
   payloads intact. The flag-name disagreement
   (`--capacity-reservation-ids` vs `--capacity-reservation-id`) survives at
   :1155-1158. HEAD already picked the API reference as the one to publish, so
   the "Trust the API reference" rewording at :1146 is a rephrasing of an
   existing pick, not a new resolution. Consistent with HEAD's own "Two open
   contradictions" count.

### F4 (MEDIUM) — hedge-to-assertion drift

This is the one place the pass added claims rather than moving them. Across the
ten files, research-scoped negatives were rewritten as universal negatives.
Aggregate count of scoped-hedge phrases (`was located`, `located during this
research`, `we can cite`, `we have no`, `not measured here`, `in the
documentation`): **16 at HEAD, 1 in the working tree.** TopologyApi alone went
from 7 to 0.

Confirmed sites in TopologyApi.tsx:

| Line | Now reads | HEAD read |
|---|---|---|
| 1001 | "No AWS page publishes a default request rate" | "No AWS page **located during this research** publishes..." |
| 1419 | "No EKS User Guide page **enumerates** topology.k8s.aws/network-node-layer-*..." | "...enumerating ... **was located**" |
| 1425 | "No EKS User Guide page **lists** topology.k8s.aws/network-node-layer as a standard label" | "No EKS User Guide page listing ... **was located**. Until one exists," |
| 1479 | "No AWS benchmark **quantifies** the gain" | "No AWS benchmark quantifying the gain ... **was located**" |
| 1492 | "**Nothing** binds layer i, ii or iii to a spine, aggregation or leaf tier" | "Nothing **in the documentation** binds..." |
| 1497 | "Its cost on a real job is not measured **anywhere**" | "...is not measured **by AWS and is not measured here**" |

Same pattern once each in EfaDevice.tsx, EnaVsEfa.tsx, InstanceSupport.tsx,
NcclOverEfa.tsx, SrdProtocol.tsx and twice in AIMLTraining.tsx. Several of those
are harmless or even improvements, because they re-scope to AWS rather than to
the universe:

- AIMLTraining.tsx:287 "AWS publishes no figure for the resulting speedup" (from
  "we have no AWS figure to quote"): fine, AWS-scoped and checkable.
- AIMLTraining.tsx:148 "traces to a benchmark that can be cited" (from "we can
  cite"): fine, same meaning in passive voice.
- InstanceSupport.tsx:507 "appears here" (from "appears anywhere on this page"):
  trivial.

The four that matter are TopologyApi.tsx:1479, :1492, :1497 and :1001, plus the
two EKS ones at :1419 and :1425. "Not found during this research" is falsifiable
and honest. "Does not exist" is an unfalsifiable universal negative that the
page cannot support. This is precisely the narrative-aggregation drift the
source-authority standard exists to prevent, and it is the one finding in this
review I would fix before shipping. The fix is mechanical: restore the scoping
clause in those six sentences.

Related, lower severity, **EfaDevice.tsx:789 and :805**: the h2 description now
says the quoted PCI-id-to-EFA-version mapping "cannot be right" and the Alert
header says it "does not exist". HEAD said "Do not map PCI device ids to EFA
versions". The body at **EfaDevice.tsx:807-812** is still precise ("no AWS source
and no line of driver source maps a device id to an EFA version number at all",
"the widely repeated equivalence between 0xefa4 and EFA v4 is unsourced
inference"), so the mapping remains unasserted and check 4 still passes. Only
the header and description overreach. Note the tension with EnaVsEfa.tsx:1066-1081,
which holds the same question open more carefully.

---

## Check 5 — Changelog survivors: PASS in scope

Grep across all ten files for `used to`, `previously`, `earlier version`,
`Correction:`, `we were wrong`, `this page said`, `an earlier`, plus a broadened
sweep for `no longer`, `the old (claim|version|argument|phrasing)`, `we
(were|had|now|used|corrected|removed)`, `quietly patched`, `re-hedged`, `got this
(backwards|wrong)`.

Seven hits, all legitimate prose, none of it reviewer voice:

| Site | Text | Judgement |
|---|---|---|
| Overview.tsx:121 | "enables tightly-coupled simulations that were previously cloud-impossible" | Legit. About workloads, not the page. |
| DataPath.tsx:739 | "pages the process no longer owns" | Legit. Memory semantics. |
| DataPath.tsx:871 | "AWS made the installer flag that used to enable it a no-op in 2021" | Legit. AWS's own changelog, cited to `docs.changelog`. |
| SrdProtocol.tsx:990 | "an unresponsive remote that was previously responsive" | Legit. Paraphrasing a driver code comment on `LOCAL_ERROR_UNRESP_REMOTE`. |
| Libfabric.tsx:925 | "used to live under an rxr_ prefix" | Legit. The upstream rename is the section's subject. This is the "stale help string" case the brief pre-cleared. |
| AIMLTraining.tsx:398 | "any citation of nccl_ofi_rdma.c is pointing at a path that no longer exists" | Legit. Upstream C-to-C++ move at v1.15.0. |
| TopologyApi.tsx:1459 | "topology cannot be used to place" | Grep false positive ("used, to place"). |

One additional judgement call: **NcclOverEfa.tsx:1073**, "That reading is wrong,
and the commit says so." This targets an inference the reader is about to make
from the v1.20.0 release notes, not the page's own history. Reader-facing, keep.

### Out of scope, but reported because it undercuts the standard

Genuine changelog voice survives in three sections the pass did not touch:

- **Pricing.tsx:254** `description="Why the previous version of this page was wrong, and what that says about citing prices"`
- **Pricing.tsx:262** "This page used to quote $98.32 for p5.48xlarge and $32.77 for p4d.24xlarge."
- **Pricing.tsx:265** "The old figures were..."
- **Pricing.tsx:350** "An earlier version of this page said EFA requires a cluster placement group."
- **NetworkComparison.tsx:300-301** "The latency row used to give four microsecond figures... The tail-latency row used to say p99.9 and 85%"
- **AIMLInference.tsx:138** "it, we removed it."

The ten files in scope are clean. The site is not. If the standard is meant to
hold site-wide, at least Pricing.tsx and NetworkComparison.tsx need the same
pass.

---

## Check 6 — Doc-vs-code conflicts survived: PASS, 7 of 7

All seven are present, all are behind an appropriate disclosure or alert, and
all still say code wins.

1. **FI_EFA_RECVWIN_SIZE 16 vs 16384.** SrdProtocol.tsx:1074-1122, now an
   `ExpandableSection` (was an `Alert`), headerText unchanged: "Documentation
   contradicts the code: the reorder window default is 16, not 16384".
   Resolution at **SrdProtocol.tsx:1117**: "Code wins. Treat the per-peer
   reorder window as 16 outstanding messages". Full `conflict=` payload
   unchanged including both commit SHAs. Mirrored at Libfabric.tsx:1026-1037,
   "Code wins. Treat the receive window as 16."
2. **FI_EFA_SHM_AV_SIZE 128 vs 256.** Libfabric.tsx:1042-1048. "Code wins again.
   Treat it as 256."
3. **efa_fabric_comparison.md rdma-core qualifier.** DataPath.tsx:685-694.
   "The code wins", `conflict=` string verbatim including "lines 281 to 282".
4. **SRD.txt send-only.** DataPath.tsx:855-866, Alert header reworded from "The
   stale document is in the same repository as the code" to "A file in the same
   repository still says only Send is supported". Resolution at
   **DataPath.tsx:859**: "It is not one, and the code wins". The 2019 date
   survives. Reinforced by the new SrdProtocol.tsx:656-675 ExpandableSection,
   "Why an in-repo specification file is not a source", which also preserves
   `EFA_IO_RDMA_READ` / `EFA_IO_RDMA_WRITE`.
5. **NCCL_BUFFSIZE cheatsheet vs platform table.** NcclOverEfa.tsx:732-746.
   "Code wins:" at :746. `conflict=` payload lists all eight platforms
   (p4d, p4de, p5, p5e, p5en, p6-b200, the p-series catch-all, g7e) and the
   value 8388608, unchanged.
6. **Tuner fallback log variable name.** NcclOverEfa.tsx:1096-1110.
   `NCCL_OFI_TUNER_TYPE` printed vs `OFI_NCCL_TUNER_TYPE` read, with the
   working names `OFI_NCCL_TUNER_TYPE` and `OFI_NCCL_FORCE_NUM_RAILS` still
   given.
7. **p6e-gb200 EFA v3 vs v4.** InstanceSupport.tsx:400-425. Resolution at
   **InstanceSupport.tsx:415-417**: "Trust Nitro v5: two independent Tier 1
   technical documents agree on it. The EFA generation stays flagged as
   contested rather than silently resolved." Both AWS sides still quoted,
   including "up to 28.8 terabits per second of Elastic Fabric Adapter (EFAv4)
   networking".

Two further conflicts not on the brief's list also survive intact:
InstanceSupport.tsx:439-451 (P6-B300 17 cards vs 16 EFA-capable, and the
16 x 400 = 6,400 Gbps arithmetic) and InstanceSupport.tsx:454-467 (trn2.48xlarge
8,192 GiB vs 1.5 TB, memory still left off the row).

The rule-4 demotions were done correctly: conflicts moved behind
`ExpandableSection` disclosures rather than being deleted. Nothing was lost in
the move.

---

## Check 7 — Structural claims

### h2 descriptions: 55 of 55 present

Every `<Header variant="h2">` in all ten files carries a `description`. Zero
missing. Spot-checking claim-shape rather than flat nouns, the pass delivered:

- SrdProtocol.tsx:910 "Why more nodes make the fabric better, not worse"
- SrdProtocol.tsx:1148 "The reason SRD scales, expressed as arithmetic and proved from the descriptor layout"
- EfaDevice.tsx:483 "32, 33, 32 and something that is not a count at all"
- InstanceSupport.tsx:263 "Do not trust this table. Ask the API, in your own region, on the day you need the answer"
- TopologyApi.tsx:627 "Read the array from the end, never from the start"
- EnaVsEfa.tsx:1029 "No first-party source settles any of these three. Do not size anything on them."
- AIMLTraining.tsx:131 "How much of the speedup you are paying for you actually get, and why no published number will tell you"

### Endings: 9 of 10 land on the reader

The two endings the standard called out by name were both fixed:

- **SrdProtocol** ended on `Why this page does not cite SRD.txt` (sourcing
  methodology). It now ends on **SrdProtocol.tsx:1244** `What SRD costs you`,
  closing on the ENA Express middle option and the ordering trade. The
  methodology container was not deleted: it was split into two
  `ExpandableSection`s at SrdProtocol.tsx:656-675 and :678-715, and the entire
  reproducible `git clone` / `grep` block survives verbatim.
- **EfaDevice** ended on a `Device generations` reference table. It now ends on
  **EfaDevice.tsx:875** `Security group, subnets and placement`, closing on the
  cluster-placement-group alert.

The rest:

| File | Last container | Verdict |
|---|---|---|
| Overview.tsx:139 | The 30-second mental model | Pass. Orients and points onward; not methodology, not a table. |
| DataPath.tsx:813 | GPUDirect RDMA | Pass. Ends on the GDRCopy vs GPUDirect RDMA gotcha. |
| SrdProtocol.tsx:1244 | What SRD costs you | Pass. |
| EfaDevice.tsx:875 | Security group, subnets and placement | Pass. |
| Libfabric.tsx:983 | The settings that matter | Pass, weakest. Leads with a lookup table but ends on the actionable "Three FI_EFA variables abort the process on sight" alert (Libfabric.tsx:1050-1058). |
| EnaVsEfa.tsx:1102 | Choosing between them | Pass, textbook. |
| TopologyApi.tsx:1437 | When reading topology changes the outcome | Pass, textbook. |
| InstanceSupport.tsx:515 | Three constraints the table cannot show you | Pass. |
| NcclOverEfa.tsx:1325 | Working checklist | Pass. |
| AIMLTraining.tsx:302 | The NCCL + EFA Stack | **F5, see below.** |

### F5 (LOW) — AIMLTraining moved its payoff away from the ending

**AIMLTraining.tsx:302.** At HEAD this file ended on `Scaling Efficiency: The
Metric That Matters`, which is the cost argument and the closest thing the
section has to a reader payoff ("At 90% efficiency on 64 nodes you pay for 64
and get the work of about 58 ... the nodes you are already paying for stop
idling"). The reshape moved that container to the **top**
(**AIMLTraining.tsx:131**) and the file now ends on `The NCCL + EFA Stack`, a
four-layer mechanism description.

It is not a lookup table and its final element is actionable (the NCCL_TOPO_FILE
gotcha at AIMLTraining.tsx:464-477, "Leave the variable unset there"), so this
is not a rule-5 breach on the letter. But it is the one file where the reorder
moved the "so what do I do" block away from the end rather than toward it, and
the agent's claim that it now ends on the reader is the weakest of the ten.

### F6 (NIT) — stray blank line

**AIMLTraining.tsx:481**, between `</Container>` and `</SpaceBetween>`.
Cosmetic. May or may not survive a formatter.

### Style / gate observations

- No em-dashes, en-dash ranges or curly quotes were introduced. Scanned every
  added line in the full diff for U+2013, U+2014, U+2018, U+2019, U+201C, U+201D:
  zero hits.
- No banned vocabulary introduced. Scanned added lines for the full CLAUDE.md
  ban list: zero hits.
- Line-length drift: lines over 100 characters went 9 -> 32 in Overview.tsx and
  11 -> 31 in AIMLTraining.tsx, while the other eight files stayed flat
  (Libfabric even improved, 50 -> 49). No `.prettierrc` at the repo root and
  HEAD already carries long lines, so this is unlikely to fail a gate, but those
  two files are now visibly formatted differently from their siblings.

---

## Content deleted rather than reframed

Two reader-facing sentences were removed outright. Neither is changelog voice,
so neither is covered by rule 1, and rule 3 says net word count may fall but
facts may not.

### F7 (LOW) — TopologyApi Karpenter warning

**TopologyApi.tsx:1367.** HEAD read:

> That is a genuinely useful constraint set and it is not the same capability.
> Any heading that pairs Karpenter with topology-aware scheduling is claiming
> something the product does not do.

Now reads:

> That is a useful constraint set, and it is not the same capability.

The second sentence is gone. It was the operative warning: it tells the reader
what to distrust when they meet such a heading in the wild.

### F8 (LOW) — NcclOverEfa GPUDirect Async currency note

HEAD NcclOverEfa.tsx:1304-1305:

> Any claim that the feature is exposed by libfabric but unused by the NCCL
> plugin is out of date.

Deleted with no replacement. This one is borderline: "out of date" plausibly
refers to circulating third-party claims rather than to this page's own past, in
which case it is reader-facing and should have stayed. If it was read as
referring to the page's own earlier text, the deletion is compliant.

Also removed and correctly so, for the record: "The plugin ships three static
NCCL topology XML files, **not two**" -> "three static" retained, "not two"
dropped (NcclOverEfa.tsx). The count is the fact; "not two" was the correction.

---

## What I checked and found nothing wrong with

Stated plainly, because the brief asked for it:

- No citation was lost. Not one URL, not one code ref, not one last use.
- No `doc-code-conflict` was dropped, softened away from "code wins", or had its
  `conflict=` payload trimmed.
- No removed figure came back. AIMLTraining and NetworkComparison are clean.
- All eight unknowns are still open and all are still labelled as open.
- The 0xefa0-to-0xefa4 mapping is still not asserted, in either file that
  discusses it.
- Every h2 has a description.
- Eight of ten files ended on methodology or a table at HEAD or already ended
  well; nine of ten now end on the reader.
- No style-gate regressions introduced.
- No unused imports, no dangling references to deleted symbols.

## Recommended actions, in priority order

1. **F4**: restore the scoping clause in the six TopologyApi sentences at
   :1001, :1419, :1425, :1479, :1492, :1497. Mechanical, and it is the only
   finding that trades falsifiability for readability.
2. **F1**: restore `r2.12.0` to DataPath.tsx:548 or into the body at :552-556.
3. **F2**: restore the literal `post_send` / `post_recv` / `poll_cq` symbols
   somewhere in the DataPath body.
4. **F7**: restore the Karpenter warning sentence at TopologyApi.tsx:1367.
5. **F3**: put "share the same PCIe root with" back into the EfaDevice.tsx:571
   header, or drop the "AWS documents" attribution from it.
6. **F5, F6, F8, O1, O2**: judgement calls for Carlos, no action required.
7. Out of scope: Pricing.tsx and NetworkComparison.tsx still carry the
   changelog voice this standard exists to remove.
