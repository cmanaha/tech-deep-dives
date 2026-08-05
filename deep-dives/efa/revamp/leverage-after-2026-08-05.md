# Leverage Pass Review, 2026-08-05 (after)

Scored as a reader, not an author. Staff-level engineer / SA, knows networking and
distributed systems, evaluating EFA or operating a cluster that has it. Did not
write these and does not care what they cost to produce.

Sections scored: `src/sections/Libfabric.tsx` (1151 lines),
`src/sections/SrdProtocol.tsx` (1298 lines), `src/sections/EfaDevice.tsx` (907 lines).
Scored independently. `leverage-baseline-2026-08-05.md` was not read.

---

## Score table

| Section | Mental model | Practical leverage | Rigor | Accuracy | Economy | Total |
|---|---|---|---|---|---|---|
| EfaDevice.tsx | 5 | 5 | 4 | 5 | 4 | 23 |
| Libfabric.tsx | 4 | 5 | 4 | 5 | 3 | 21 |
| SrdProtocol.tsx | 5 | 4 | 3 | 5 | 3 | 20 |

---

## Libfabric.tsx

### 1. Mental model — 4

The two-fabric split is a real model and it is load-bearing: "Same device, same
driver, two different amounts of software between your call and the wire" (L515).
The protocol ladder plus the stripe composition is the best generative idea in the
file, because it tells me the number that meets the ladder is not the number I
think it is: "the number that meets the ladder is a per-rail stripe on the order of
the minimum stripe size ... rather than the multi-megabyte buffer the collective
started with" (L787-790). After that I can predict what an unfamiliar middleware
will hit.

Held to 4 because the ladder is given as branch conditions, never as a rationale. I
learn that the read-based branch is checked first and needs four conditions, but not
*why* a read-based protocol is the right answer for large accelerator transfers.
Without that I can reproduce the branch, not reason about a case the branch does not
cover. The endpoint-type block is a capability list, not a model.

### 2. Practical leverage — 5

Highest command density of the three. Six numbered `fi_info` / logging invocations
(L570-595) that each state what a null result means: "If this prints nothing,
efa-direct is not available here and every 'use efa-direct' instruction is moot."
Three greps against `ofi_*.log` with the severity and the consequence attached
(L899-912) — the memhooks pair is the best of them, because it separates the benign
info-level fallback from the fatal pinned case. Three abort strings quoted verbatim
so the tail of a dead job names the cause (L951-959). A deprecated-name list to grep
old launch scripts for (L1140-1145). The tunables table is 12 rows where 5 are
badged "do not set" — that is negative leverage, but it is real: it stops me
copying `FI_PROVIDER=efa` and `RDMAV_FORK_SAFE` out of a 2021 blog post.

The mechanism-to-signal connection is made explicitly in the one place it matters
most: "The silent one is the registration cache. Turn it off on a send with no
application-supplied descriptor and the read-based branch stops being eligible, with
no log line at any level" (L809-812). That is a mechanism connected to the absence
of a signal, which is harder and more useful than connecting it to a counter.

### 3. Rigor — 4

66 SourceRefs, code pinned to `v2.6.0`, doc-versus-code conflicts carried as typed
conflicts with both sides named, editorial judgement labelled "Our reading" inside
the table cells rather than laundered into the prose. That is above the bar.

Deductions:

- **Citation does not support the claim.** "The ofiwg project has released v2.6.0,
  and every code citation in this section is pinned to that tag" (L980-983) is cited
  to `code.man` = `man/fi_efa.7.md`, whole file, no line range. A man page at a tag
  is evidence the tag exists; it is not evidence of a release. The second half of the
  sentence is a statement about this page and needs no citation at all.
- **One-sided conflict citation.** The `FI_EFA_SHM_AV_SIZE` conflict (L1125-1129)
  attaches only `code.envDefaults` (the initialiser). The help-text side of the
  conflict, which is the whole point, is uncited. The receive-window conflict
  immediately above it cites both sides properly, so this is inconsistency inside one
  paragraph.
- **Unlabelled derivation.** "Three entries per device, so 96 on a 32-device instance
  before any hint trims them" (L542-543) sits between two `code.provOrder` citations
  and reads as sourced. It is multiplication.
- **Version scope never applied to individual claims.** The section correctly warns
  that the reader's host runs `2.4.0amzn5.0` while every citation is read at `2.6.0`,
  then makes dozens of behavioural claims without scoping any of them to that gap.
  The warning is stated once and never honoured.

### 4. Accuracy — 5

Nothing I can fault. Cross-consistent with EfaDevice on Data Path Direct being the
0xefa0 discriminator, and with SrdProtocol on the reorder constant being 16. The
`FI_EFA_RUNT_SIZE` explanation of why `fi_info` prints 307200 while host memory
starts at 0 (L760-762) resolves a genuinely confusing observation correctly.

### 5. Economy — 3

1151 lines and the value is not evenly spread.

- The GPUDirect Async paragraph (L678-693) spends ~14 lines on a handover mechanism
  and then concedes it is not the reader's problem: "Calling that table is work for
  whoever writes the plugin." Only the last two sentences — the `OFI_NCCL_GIN_TYPE`
  failure signature — are for me.
- "Two more version-scoped behaviours worth carrying" (L1028-1055) is an
  ExpandableSection whose first item ends on "Note the scope in that sentence: on the
  data path, not everywhere," a correction to a misreading nobody made.
- The prose under the stack diagram (L505-516) restates the diagram's own `<title>`
  text nearly clause for clause.
- The `fi_info` ordering paragraph (L531-548) spends a long block on three-pass list
  construction to land one actionable sentence, which arrives in the *next*
  paragraph: put fabric name, domain name and PCI bus id in your hints.

### Single strongest thing

The registration-cache-changes-protocol-selection finding, and the fact that it is
stated twice on purpose — first as a branch condition ("either the application passed
a memory descriptor or the registration cache is available", L723-724) and then as
the operator consequence ("with no log line at any level", L810-811). It is a
non-obvious coupling between a memory setting and a wire protocol, it is derived from
code, and it names its own absence of a signal. That is the best single piece of work
across all three files.

### What I would cut first, and how much

The GDA paragraph reduced to its last two sentences, the "Two more version-scoped
behaviours" expandable, the diagram-restating prose under the stack diagram, and the
three-pass `fi_info` internals. Roughly **15 to 18 percent** of the section. None of
it changes a decision.

### Knowledge for its own sake

> "Three entries per device, so 96 on a 32-device instance before any hint trims
> them, and an application that takes the first one gets efa-direct on the first
> device."

True, sourced, arithmetically correct, connected to nothing I would do. I do not
choose the entry; my middleware does.

Second candidate, and the page says so itself:

> "libfabric supplies the address handle, the queue buffers and the doorbells, and
> GPU-side code builds and rings the work queue entries itself ... Calling that table
> is work for whoever writes the plugin."

### Forward or backward

Forward at the open — "This section answers those four in order, then the two that
decide whether the answers apply to your host" (L487-488) is a real forward promise.
It switches **backward at the stack container (L492)** and stays there through
`fi_info` internals and endpoint capability lists. It comes back forward inside each
container, always at the end: the command block at L570, "What you would see, and
what to do about it" at L804, the greps at L899, the tunables table at L1076. The
pattern is backward body, forward tail, repeated six times. A reader who stops
halfway down any container gets mechanism and no consequence.

### Padding / over-explanation / author reassurance

- The "Trust the binary in front of you" Alert (L598-609) takes 11 lines to say "run
  `fi_info -g FI_EFA` on your own host, and log one info-level run per image."
- "Note the scope in that sentence: on the data path, not everywhere." (L1039-1040)
- "That last condition is the one people trip over, and it is why the registration
  cache appears twice in this section." (L728-729) — the page explaining its own
  structure to itself.

---

## SrdProtocol.tsx

### 1. Mental model — 5

The strongest model in the set, and the only one that is stated once and then
*used* four separate times. "SRD keeps reliability and throws ordering away ...
Everything else in this section follows from that single trade" (L672-678) is not a
slogan here: it explains the error-code split, it explains why a rising
retransmission counter is routine, it explains what the reorder buffer costs, and it
reappears at the very end as a per-attachment switch
(`ENA_ADMIN_ENA_SRD_UDP_ORDERING_BYPASS_ENABLED`, "which is this section's whole
trade offered as a per-attachment switch", L1288-1289). That closing move is
excellent.

The best single sentence for prediction: "Head of line blocking did not disappear
with the ordering guarantee. It moved out of the fabric and into one peer's buffer,
where it stalls that peer and nothing else" (L1060-1062). After that I can reason
about a case the page never covers — for example what a single slow receiver does to
an all-to-all, and why it does not cascade.

### 2. Practical leverage — 4

Two artifacts carry it. The triage table (L562-604) is the best operational content
in the dive: five codes, the provider's verbatim string, what it means, what to check
next, and the distinction that matters at 3am — "one of them is a dead node, the
other is almost always a security group" (L747). The counter table (L610-646) is the
right answer to a hard problem: no thresholds exist, so it gives shapes and a
comparison method — "Compare the ratio against tx_pkts, node by node, over the same
window. One node whose ratio sits well above its peers is the signal. The number on
its own is not." The `impaired_remote_conn_events` row explains a class of incident
(slower, never errored) that I have seen and could not previously name.

Held to 4 because roughly 40 percent of the section changes nothing I would do. The
InfiniBand/RoCEv2 comparison, the spraying container, the queue-pair scaling
container and the congestion-control paragraph are model or competitive framing. The
queue-pair container says so honestly ("This block is model, not a knob", L1146), and
that honesty is worth credit under the standard — but it is still 60 lines to
establish "peers are cheap, queue pairs are not."

### 3. Rigor — 3

The lowest of the three, and it is the axis the leverage pass is allowed to spend
from — but these are not the trades the standard permits. The standard says a sourced
number, a doc-versus-code conflict, and a hedge scope are never traded. Two hedge
scopes were.

- **Absolute negative on a citation that cannot carry it.** "The host does not: no
  retransmission logic exists anywhere in the EFA driver, only the code that copies
  these values out of an admin-queue response" (L985-988), cited to
  `code.portStats` = `efa_verbs.c` L74-L96. That is a single stats-copying function.
  A 23-line citation cannot support a universal negative over an entire driver tree.
  The honest form is "no retransmission logic was found in the EFA driver during this
  research." This is the sharpest citation/claim mismatch in the three files.
- **Second absolute negative, same pattern.** "The only accessor is
  `ena_com_get_ena_srd_info()`, with no matching set function anywhere in the tree"
  (L1276-1278), cited to `code.enaSrdGet` = the getter itself. The citation proves the
  getter exists. It cannot prove the setter does not.
- **Inference presented as evidence.** "reporting a retransmission count is only
  possible for a party that performs retransmissions" (L984-985). This is a deductive
  step stated in the same breath as two code citations, and it is not even sound — a
  party can report a count it was handed. The conclusion is almost certainly right;
  the argument is dressed as evidence.
- **Third absolute.** "Beyond that, AWS publishes no algorithm" (L1011-1012). Should
  be "no published algorithm was located."
- **The one block with no citations is the one making a code claim.** The
  "Documentation contradicts the code" expandable (L696-715) asserts that the driver
  defines `EFA_IO_RDMA_READ` and `EFA_IO_RDMA_WRITE` as device opcodes and that the
  device reports both as capability bits — and carries **zero** SourceRefs, in a file
  with 67 of them. The `code.compStatus` and `code.txMeta` refs exist in the file and
  are not used here.

Against that: the `FI_EFA_RECVWIN_SIZE` conflict (L1065-1112) is the best-executed
piece of sourcing in the entire dive. It anticipates the units objection and kills it
with the allocator ("Nothing anywhere multiplies it by a page, a packet size or a
kilobyte"), traces two commits with dates, and carries a conflict string precise
enough to re-verify from scratch. And the counter Alert refuses to invent a number
with a stated reason: "A number invented here would be worse than none, because you
would size an alert to it" (L855-856). That is exactly right.

### 4. Accuracy — 5

Right as far as I can judge. The IEEE Micro attribution is correct and specifically
guarded against the common NSDI misattribution. The Zhu et al. correction (L915-924)
is more careful than most primary treatments — it separates deadlock-as-commonly-
alleged from head-of-line-blocking-as-actually-demonstrated, and does not overclaim.
The recvwin constant agrees with Libfabric's independent reading of the same header.
The queue-pair unit-mixing correction (L1180-1194) is a genuine catch: `N x p` against
`N x p x p` really are counted differently, and the corrected table is right.

### 5. Economy — 3

The longest file and the most diluted.

- The IEEE Micro paragraph (L686-694) spends five lines to tell me a paper exists and
  was not read. If nothing is attributed to it, one line in a sources appendix does
  the same job.
- The SRD.txt expandable (L696-715) debunks a 2019 text file the reader has never
  heard of and would never have found, then spends its second paragraph restating the
  project's sourcing policy: "On this page code at a pinned commit is the authority,
  official documentation is a secondary check ..." That is methodology printed on the
  reader's page.
- The congestion-control paragraph (L1005-1014) resolves to "there is nothing to
  configure." Worth one sentence, not nine.
- The queue-pair scaling container (L1135-1206) is 70 lines for one idea.

### Single strongest thing

The triage table plus its "where you see it, and why the useful half is usually
hidden" follow-up (L773-787). The table alone would be good. What makes it the
strongest thing in the file is that it then tells me the diagnosis I actually want is
info-level only — "A run that did not gets the code without the diagnosis" — and then
prints the verbatim help text so I know what I am missing, and then flags that the
hint names subnets while AWS names the Availability Zone, "so check the security
group first and the Availability Zone second." That is mechanism, signal, log level,
and a corrected ordering of checks, in one block.

### What I would cut first, and how much

The IEEE Micro paragraph, the SRD.txt expandable, the congestion-control paragraph
compressed to one sentence, the `node_type` sentence, and the queue-pair container
reduced to its Alert plus the corrected arithmetic. Roughly **20 to 25 percent**.

### Knowledge for its own sake

> "The EFA driver registers its InfiniBand device with
> `node_type = RDMA_NODE_UNSPECIFIED`, a value that claims membership of neither
> family."

True, sourced to `efa_main.c` L616, and appended to an AWS quote that already made the
point in first-party words. It is a flourish. Nothing branches on `node_type` for me.

Runner-up, whole paragraph:

> "The design is published as Shalev, Ayoub, Bshara and Sabbag ... The paper is
> paywalled and was not read for this page, so nothing here is attributed to it."

### Forward or backward

This is the only section that states its direction and means it: "Those readings come
first below. The mechanism that produces them follows" (L683-684). Containers 1 and 2
are forward, and the reader who stops after the counter table has the whole
operational payload.

It **switches backward at L861** (the InfiniBand/RoCEv2 container) and stays backward
for three containers — comparison, spraying, reorder mechanism, queue-pair scaling.
It returns forward twice: the `FI_EFA_RECVWIN_SIZE` grep Alert (L1114) and the
ENA-Express-versus-EFA choice (L1260-1269). So the shape is forward, then a long
backward middle, then forward at the close. The backward middle is where the economy
score is lost.

### Padding / over-explanation / author reassurance

- "The two citations are eight lines apart in the same file, which is a useful
  reminder that a help string is documentation, not behaviour." (L1106-1109) — the
  page congratulating itself on a find it has already fully explained.
- "Code wins. On this page code at a pinned commit is the authority, official
  documentation is a secondary check, and an in-repo README, comment or specification
  file is a way to find your way around the code." (L710-713) — sourcing policy as
  reader content.
- "The paper is paywalled and was not read for this page, so nothing here is
  attributed to it." (L692-694) — honest, and written for the author's conscience
  rather than the reader's use.
- "Most fabric properties degrade with cluster size. Path diversity improves with it."
  (L976-977) — a nice line, but it is the third statement of the same idea in one
  paragraph.

---

## EfaDevice.tsx

### 1. Mental model — 5

The four-layer / four-owner counting model is the cleanest transferable idea in the
dive, and the section proves it is transferable instead of asserting it. "The 32, 33,
32 result on p5.48xlarge is worth less than the reason for it" (L490) is the correct
instinct, and then the P6-B300 expandable actually runs the model on a second
instance type and validates it with independent arithmetic: "16 times 400 Gbps is
exactly the 6,400 Gbps figure. A sizing sheet quoting 17 EFA interfaces overstates the
fabric by one card and breaks that multiplication, which is the fastest way to spot
the error" (L603-606). That is a model plus a self-check I can apply to an instance
type this page has never heard of. It is the clearest 5 on this axis.

The diagram carries the model rather than decorating it — owner, count, and
read-it-yourself command per layer, in one figure.

Minor gap: I finish the section knowing how the device attaches and how to count it,
and still not knowing what it *is*. That is arguably the next section's job.

### 2. Practical leverage — 5

Almost every block terminates in something I do.

- The attachment-mode choice is a launch parameter, and both sides are argued from
  consequence, not preference: "a 32-card instance costs one private address instead
  of 32. On a large cluster in a fixed subnet that is the difference between fitting
  and not fitting" (L454-456).
- "Size a Kubernetes resource claim from the device count, which is 32 here. A claim
  written from the interface count asks for 33 of something the instance has 32 of"
  (L519-521). That is a specific, common, expensive mistake, named precisely.
- The 5128-versus-5120Mi trap (L649-655) — AWS's own manifests request roughly half
  what AWS pre-allocates, and both numbers appear on the same page.
- `ibv_devinfo` on the instance you have; `modinfo` against the installer changelog.
- The self-referencing security group, with the failure signature attached: "the
  single most common reason a freshly built cluster launches cleanly and then hangs at
  the first collective" (L842-843).
- "Any page that says EFA requires a cluster placement group is stating a
  recommendation as a rule" (L892-894) — this corrects something I have seen in
  internal docs and would have repeated.

### 3. Rigor — 4

The two hardest calls in the section are handled better than anywhere else in the
dive. The eight-groups-of-four grouping: "That multiplication is ours, and it carries
no citation because there is nothing to cite ... It is consistent with both and very
likely correct, but treat the grouping as inferred. If your placement decision depends
on the exact grouping, read it off the running instance" (L577-584). The subnet
argument: "That is an argument from the absence of a stated limit rather than a
positive AWS statement, so treat it as our reading, and keep the Availability Zone
boundary as the hard line" (L867-870). Both name the inference, name its strength, and
name the fallback. That is the standard being met, not gestured at.

Deductions:

- **Uncited claim, and the only one in the file.** "Bottlerocket does not pre-allocate
  them" (L355) sits inside a table cell with no SourceRef. The claim is sourced
  elsewhere in the dive (`EKSIntegration.tsx` L1211 makes the same point), but a
  reader on this page has no way to check it, and it sits in the same cell as an
  AWS-attributed number, which is exactly the tier-mixing the standard forbids.
- **Uncited inference in the same cell.** "Fork-heavy Python data loaders can exhaust
  the pool" — plausible, unsourced, and stated flatly.
- **Table cells carry no citations while the prose they duplicate does.** The
  `hostRequirements` table (L350-365) restates the two h3 blocks below it, and the
  prose versions have `docs.eksNode`, `code.queryDevice` and `code.registerMr`
  attached. The table is the uncited copy of cited material.
- **Casual absolute negatives.** "Read it: nowhere. No AWS API exposes it" (L236) and
  "No AWS document defines the term" (L526). Both should be scoped to the research.
  The section is careful about this everywhere it matters and sloppy where it does not
  — but the standard does not have a "where it does not matter" clause.

### 4. Accuracy — 5

The 16 x 400 = 6,400 check is right. The five-device-ids-against-four-EFA-versions
argument is right and correctly refuses the conclusion everyone else draws: "the
widely repeated equivalence between 0xefa4 and EFA v4 is unsourced inference"
(L780-781). The two device-id branch points (`subCq`, `guidByDeviceId`) are real and
the observation that both split the same way — first three ids on one side — is a
genuine finding, correctly separated from the User Guide's four-way split.

### 5. Economy — 4

Tightest of the three, and the only one where I did not resent the length.

- The `hostRequirements` table (L637-645) is redundant with the two h3 blocks
  immediately following it. It says the same thing first, worse, and without
  citations.
- The closing paragraph of the versions container (L740-745) restates the Alert
  directly above it.
- "32, 33, 32" is landed three times — the h1 paragraph (L384), the diagram
  (L258), and the container intro (L490). The standard asks for one figure landed
  more than once; this is the same figure landed three times in the first third.

### Single strongest thing

The P6-B300 expandable (L589-616). It takes the model the section just built, runs it
on a different instance type, gets an answer, checks the answer with independent
arithmetic, names the specific error the check catches, and then adds the caveat that
the two headline bandwidth figures are not additive. That is the whole leverage-pass
thesis executed in one block: a model, made predictive, made checkable, made
actionable.

### What I would cut first, and how much

The `hostRequirements` table entirely — fold "Bottlerocket does not pre-allocate them"
into the huge-pages prose with the citation the prose already has — and the closing
`modinfo` paragraph. Roughly **5 to 7 percent**. There is very little else to take.

### Knowledge for its own sake

Thinner here than in the other two. The closest:

> "The same function short-circuits when there is at most one device per group, with
> the comment that on P4d or Trainium the topology ordering is assumed sufficient.
> Rail sorting is a many-devices-per-accelerator problem. On instance types with one
> EFA device per accelerator it does nothing."

True, sourced, and connected to nothing I would do — I do not configure rail sorting.
It is correctly demoted into an ExpandableSection, which is the right handling.

### Forward or backward

The most consistently forward of the three, and it starts that way in the h1
description itself: "I have an instance with EFA. What exactly did I attach, how many
of them are there, and what does the host owe the device?" Every container heading is
a decision or a question rather than a subject: "Choosing between EFA-only and EFA
with ENA", "What the host owes the device", "Which generation you are on, and what
branches on it".

It switches backward twice, both briefly and both recovered. The rail expandable
(L524-563) is pure mechanism, but it is demoted behind a disclosure, which is the
correct place for it. The generations container (L749-814) opens backward on PCI
device ids and code branches, then lands forward in its final two sentences: "If you
need to know which EFA generation an instance is, read the User Guide table heading
for its instance type. If you need to know how the software will behave on it, read
the device id" (L810-813). That is the cleanest backward-to-forward recovery in the
three files.

### Padding / over-explanation / author reassurance

Least of the three. The `hostRequirements` table is the main offender, and it reads
as an author wanting a table there rather than a reader needing one. "That is how 32
cards and 33 interfaces produce 32 EFA devices, with somewhere left to put the IP
stack" (L518-519) is the third statement of that arithmetic.

---

## Cross-cutting checks

### Citations that do not support the claim attached to them

1. **`SrdProtocol.tsx` L985-988.** "no retransmission logic exists anywhere in the EFA
   driver" cited to `code.portStats` (`efa_verbs.c` L74-L96), a stats-copying
   function. A 23-line range cannot evidence a tree-wide absence. Worst instance in
   the set.
2. **`SrdProtocol.tsx` L1276-1278.** "no matching set function anywhere in the tree"
   cited to `code.enaSrdGet`, the getter. Same failure shape.
3. **`Libfabric.tsx` L980-983.** "The ofiwg project has released v2.6.0" cited to
   `man/fi_efa.7.md` with no line range. The man page is not the release.
4. **`Libfabric.tsx` L1125-1129.** The `FI_EFA_SHM_AV_SIZE` conflict cites only the
   initialiser. The help-text side of a doc-versus-code conflict is uncited.
5. **`SrdProtocol.tsx` L696-715.** The opcode expandable makes code claims
   (`EFA_IO_RDMA_READ`, `EFA_IO_RDMA_WRITE`, capability bits) with no SourceRef at
   all, in a file carrying 67.

### Numeric thresholds stated without a source

- **`EfaDevice.tsx` L355.** "Bottlerocket does not pre-allocate them" — no citation on
  this page. Adjacent to the AWS-sourced 5128 figure in the same cell.
- **`EfaDevice.tsx` L356.** "Fork-heavy Python data loaders can exhaust the pool" —
  unsourced inference stated as fact.
- Everything else checks out. `Libfabric.tsx` sources 65536 / 1048576 / 307200 /
  131072 / 8388608 / 524288 / 64 / 128 to `envDefine`, `thresholdConsts`,
  `hmemThresholds`, `platformEnv`, `scheduler` and `schedParams`. `SrdProtocol.tsx`
  sources 5 / 10 / 25 Gbps and "tens of microseconds" to AWS docs, and explicitly
  labels the 4,096-versus-16,777,216 derivation as "The multiplication is ours."

### Hedges that sound absolute

Correctly scoped (keep these as the model):

- "No AWS or upstream source located during this research states what a healthy
  protocol mix looks like" (`Libfabric.tsx` L815-816).
- "No AWS source stating a numeric threshold for any of these counters was located
  during this research" (`SrdProtocol.tsx` L853-854).

Over-claimed:

- "no retransmission logic exists anywhere in the EFA driver" (`SrdProtocol.tsx` L985).
- "with no matching set function anywhere in the tree" (`SrdProtocol.tsx` L1277).
- "Beyond that, AWS publishes no algorithm" (`SrdProtocol.tsx` L1011).
- "No AWS document defines the term" (`EfaDevice.tsx` L526).
- "Read it: nowhere. No AWS API exposes it" (`EfaDevice.tsx` L236).
- "no AWS source and no line of driver source maps a device id to an EFA version
  number at all" (`EfaDevice.tsx` L774-777) — the driver-source half is defensible
  because the source was read; the "no AWS source" half is not.

### Duplicated passages across the three files

1. **The installer 1.49.0 sentence, near-verbatim in two sections.**
   `Libfabric.tsx` L984-988: "EFA installer 1.49.0, released June 27, 2026, upgrades
   to libfabric 2.4.0amzn5.0, along with EFA driver 3.1.0, rdma-core 63.0 and AWS OFI
   NCCL Plugin 1.20.0."
   `EfaDevice.tsx` L708-712: "EFA installer 1.49.0, released June 27, 2026, upgrades
   to libfabric 2.4.0amzn5.0, EFA driver 3.1.0, rdma-core 63.0 and AWS OFI NCCL Plugin
   1.20.0, and discontinues support for openSUSE Leap."
   Both then run the same "name the channel before you quote a version" argument, and
   both cross-reference the other section by name — which reads as the author noticing
   the overlap and papering it rather than resolving it. `EfaDevice` owns the driver
   half (3.1.0 vs r3.3.0), `Libfabric` owns the userspace half (2.4.0amzn5.0 vs
   2.6.0). One should state the release and the other should point at it.

2. **The `FI_EFA_RECVWIN_SIZE` 16384-versus-16 conflict, in two sections at two
   depths.** `SrdProtocol.tsx` L1065-1112 gives the full treatment: units argument,
   allocator evidence, two commits with dates, a re-verifiable conflict string.
   `Libfabric.tsx` L1110-1121 gives a compressed version with a different, weaker
   conflict string. A reader taking both sections meets the same conflict twice, the
   second time with less evidence. The `Libfabric` copy should be one sentence and a
   pointer.

3. **`docs.efaOnlyNews` and the MAC-address reason, twice inside `EfaDevice.tsx`** —
   L420-428 ("the EFA device is not assigned an IP address because it uses the
   Scalable Reliable Datagram (SRD) protocol, which operates over MAC addresses") and
   L836-839 ("the EFA device is not assigned an IP address at all because SRD operates
   over MAC addresses"). Same source, same fact, same file, 400 lines apart.

4. **Milder.** The `FI_EFA_USE_HUGE_PAGE` + `FI_EFA_FORK_SAFE` abort appears in
   `Libfabric.tsx` (L929-931, L951-953) and again in `EfaDevice.tsx` L657-662. This one
   is an explicit cross-reference rather than a duplication and is handled acceptably.
   The Availability Zone boundary appears in `SrdProtocol.tsx` L818-820 and
   `EfaDevice.tsx` L856, in different roles (triage versus placement), which is fine.

---

## Ranking

1. **`EfaDevice.tsx`** (23)
2. **`Libfabric.tsx`** (21)
3. **`SrdProtocol.tsx`** (20)

`EfaDevice` wins because it is the only section where the model is proven predictive
on a case the page did not start with (P6-B300, checked by bandwidth arithmetic), and
where almost every block terminates in a launch parameter, a claim size, a command or
a corrected belief. `SrdProtocol` finishes last despite owning both the best mental
model and the best single artifact in the dive (the triage table), because it spends
roughly a quarter of its length on material it admits is not a knob and it breaks the
one rule the leverage pass is explicitly forbidden to trade — twice, in the same
section, by attaching universal negatives to citations that can only evidence a
single function.

The gap between best and worst is not knowledge. All three are accurate and all three
are researched past the point of doubt. The gap is that `EfaDevice` was written from
what the reader is trying to do and `SrdProtocol` was written from how the technology
works, with the operational payload bolted onto the front rather than the section
being built around it.
