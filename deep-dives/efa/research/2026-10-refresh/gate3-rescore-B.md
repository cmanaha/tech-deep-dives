STATUS: COMPLETE (summary table at the end)

# Gate 3 re-score, group B (after commit 6b46869)

Independent re-scorer. Scope: AIMLTraining, InstanceSupport, Pricing, NcclOverEfa, Operations, TopologyApi.
Pass under review: commit 6b46869 ("apply Gate 3 corrections and the leverage pass to the matrix, pricing, NCCL, training, operations and topology sections").
BEFORE scores: research/2026-10-refresh/gate3-B.md.
Standards: revamp/section-shape-standard.md, revamp/leverage-pass-standard.md, CLAUDE.md "Writing Style: No AI Tells".

---

## 1. AIMLTraining.tsx (EFA for AI/ML Training)

Line numbers are the file as of 6b46869 (the working tree matches it for this file).

### AFTER Gate 3 score: 7 / 10 (BEFORE 6)

- All three BEFORE accuracy flags are closed: the opener now says training grows more communication-bound as it scales (L137), tensor parallelism is allreduce and cited to the Megatron-LM paper (L182-184, verified: "two all-reduces in the forward path and two in the backward path"), and the Neuron path is scoped to Trainium (L251). Hedges are scoped (L288-289, L474-475), the Trainium h2 now names a decision (L242), and three internals sentences plus the cmpScore guide correction are gone (prose about 4.5% shorter).
- Still below 8: the TP and PP characterisation one paragraph below the new citation (L189-191) is inverted relative to the Megatron-LM authors, the "Under the Hood" disclosure still carries the version-by-version tuner account that the file's own header (L18-20) assigns to NCCL over EFA, and the prerequisite Alerts carry uncited numbers and outcomes.
- The pass also introduced two citation-scope regressions (GPUDirect Async lost its efa-direct condition; the packaged topology list now hangs on a citation that cannot name the types).

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 4 | 4 | 3 | 3 | 3 |
| AFTER | 4 | 4 | 3 | 4 | 3 |

- Mental model 4: the four traffic shapes now read correctly in the intro (L152-156), but the strategy-to-fabric mapping (latency for TP, bandwidth for PP) is still the wrong model, and the hybrid layout exists only as prose.
- Practical leverage 4: env-var paragraph now leads with the list (L325-330), Trainium h2 names the pick; the two lines worth setting still sit inside a collapsed disclosure.
- Rigor 3: TP claim gained a tier-3 citation and two hedges were scoped, but two new citation-scope defects arrived (below), and the DP volume formula (L163), TP/PP characterisation (L189-191), SRD multi-path claim (L205-206), Fabric Manager outcome (L427-429) and disk figures (L432-434) remain uncited.
- Accuracy 4: the three flagged defects are fixed; the TP/PP latency-versus-bandwidth paragraph remains contrary to the source this section now cites (see remaining correction 1), and the GPUDirect Async sentence now reads unconditional where the code makes it efa-direct only.
- Economy 3: modest cut; the Algorithm selection paragraph (L400-411) still duplicates NcclOverEfa L975-978.

### Pass verdict

Not a successful leverage pass by the standard's test: model and leverage held rather than rose. It was a successful corrections pass (accuracy +1, economy held, rigor held). The leverage verbs were used mainly for deletion.

### Regressions introduced by 6b46869

1. **L205-207, scope dropped from a code-backed condition (strengthened scope).** BEFORE: "the libfabric EFA provider exposes it as FI_EFA_GDA_OPS on the efa-direct fabric [gdaOps][gdaOpsDirect]". AFTER: "EFA also supports GPUDirect Async [gdaOps]". The deleted citation is the one that carries the condition: libfabric v2.7.0 `prov/efa/src/efa_domain.c` L803-808 returns `-FI_EOPNOTSUPP` with "Only efa direct supports FI_EFA_GDA_OPS" (fetched). The remaining `gdaOps` (fi_ext_efa.h L11) is a `#define` of the ops name and cannot bear an unconditional "EFA supports". The same section tells the reader NCCL uses RDM endpoints (L346-347), so the unscoped sentence invites a wrong inference. (The BEFORE scorer's own proposed text dropped this condition; the applier followed it.)
   Fix: restore `gdaOpsDirect: lfab('prov/efa/src/efa_domain.c', 'L803-L808'),` to `code`, and write: "EFA also supports GPUDirect Async on the efa-direct fabric only{' '}<SourceRef ... code={code.gdaOps} /><SourceRef ... code={code.gdaOpsDirect} />, which the aws-ofi-nccl plugin consumes through ..."
2. **L447-448, citation asked to bear a list it does not contain.** AFTER: "a packaged file on p4d, p4de and g5.48xlarge [topoEnv]". `topoEnv` (platform-aws.cpp L764-790 at v1.22.0, fetched) is the mechanism (if NCCL_TOPO_FILE is unset and the platform row has a topology, set it); the three type names live in the platform table at L89-91 (p4d), L103-105 (p4de) and L248-250 (g5.48xlarge). BEFORE carried two of the three by the XML-file citations the pass deleted (`topoP4d`, `topoG5`). The prose also dropped "at v1.22.0" from the packaged-file claim; the tag survives only in the link.
   Fix: add `topoRows: plugin('src/platform-aws.cpp', 'L88-L105')` and `topoRowG5: plugin('src/platform-aws.cpp', 'L248-L250')`, and write: "a packaged file on p4d, p4de and g5.48xlarge at v1.22.0{' '}<SourceRef ... code={code.topoRows} /><SourceRef ... code={code.topoRowG5} /><SourceRef ... code={code.topoEnv} />".
3. **L286-287, NCCL expansion moved into a collapsed disclosure, and still not at first use.** The pass moved the expansion from visible prose (BEFORE L313) into the closed "Neuron collectives" ExpandableSection, following the BEFORE scorer's correction 4. A reader who does not open it meets "NCCL" unexpanded in the h2 at L299 and the prose at L305. The true first use in reading order is L210 ("The NCCL over EFA section"), which both the BEFORE scorer and the pass missed.
   Fix: L210-211 "The section on NCCL (NVIDIA Collective Communications Library) over EFA has the conditions a job has to meet to use it." and L286-287 back to "the CUDA and NCCL path".

No new unsourced assertions found otherwise. Every other added sentence traces to BEFORE text or to the fetched Megatron-LM paper. No changelog voice, no em-dash, en-dash range, curly quote or banned word (grep clean). The Neuron, GDRCopy and scaling-efficiency hedges were weakened, which is permitted.

### Remaining corrections (missed by the pass)

1. **L188-192, accuracy: TP and PP characterisation inverted relative to the Megatron-LM authors.** "Tensor parallelism is latency-sensitive (many small messages) and pipeline parallelism is bandwidth-sensitive (large activation tensors). EFA serves both: low latency for TP (Tensor Parallelism), high bandwidth for PP (Pipeline Parallelism)." [Tier 3: Narayanan et al., arXiv:2104.04473, fetched 2026-10-23] says the opposite about where the cost sits: "tensor model parallelism is best within a node (DGX A100 server) due to its expensive all-reduce communication. Pipeline model parallelism, on the other hand, uses much cheaper point-to-point communication that can be performed across nodes". The section's own hybrid column (L224-228) already gives the right model.
   Re-express to: "Those allreduces run inside every layer, which is why the hybrid layout below keeps TP (Tensor Parallelism) on NVLink. Pipeline parallelism sends activations point-to-point only between stages, which is far cheaper{' '}<SourceRef provenance="documented" doc={docs.megatronGpu} label="tier 3: paper" />, so PP (Pipeline Parallelism) is the split that crosses nodes over EFA." with `megatronGpu: { title: 'Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM (arXiv:2104.04473)', url: 'https://arxiv.org/abs/2104.04473', tier: 3, accessed: '2026-10-23' }`.
   Then L193-195 StatusIndicator: "EFA carries the pipeline stages between nodes; keep TP on NVLink". And L155-156: "Find your strategy below and you know what the fabric has to carry." (the "bandwidth or latency" promise rested on the inverted paragraph).
2. **L400-411, economy and the file's own sourcing rule (L18-20): version-by-version tuner account duplicated from NCCL over EFA (L975-978 there).** Re-express to the consequence: "<strong>Algorithm selection:</strong> the <code>aws-ofi-nccl</code> tuner makes the algorithm and protocol combinations it prefers cheaper in <code>collCostTable</code>, and NCCL still picks the minimum. On NCCL 2.22.3 and later, setting <code>NCCL_ALGO</code> narrows the table rather than disabling the tuner{' '}<SourceRef ... code={code.tunerV3} /><SourceRef ... code={code.tunerV6} />. The NCCL over EFA section has the version-by-version account." Then drop `tunerV2` from `code`.
3. **L431-435, CLAUDE.md sources standard: uncited numbers ("10-20 GiB", "30 GiB") and an uncited outcome ("fails silently").** The rule is cite or flag visually. Nothing in the section sources them. Delete the Disk space Alert (the pass may delete), or cite it to a fetched page if one carries the figures.
4. **L426-429, uncited outcome in an error Alert.** "A mismatch takes all 8 GPUs out of inter-GPU operations." has no source. Delete that sentence, keep the exact-match instruction, and backlog an NVIDIA Fabric Manager user guide citation.
5. **Reorder, L314-323: the two lines worth setting are the stack container's practical payoff and sit behind a closed disclosure.** Move the `<pre>` block and its one-sentence lead ("Two lines earn a place in the launcher. They make the plugin report what it loaded and let libfabric say what it selected.") out of the ExpandableSection to sit directly under the stack paragraph (after L312). Rename the disclosure "The rest of the usual EFA environment block".
6. **Regression fixes 1 to 3 above.**

What holds AIMLTraining below 8, in priority order: remaining correction 1 (accuracy), regressions 1 and 2 (rigor), remaining correction 2 (economy), remaining correction 5 (leverage), remaining corrections 3 and 4 (rigor).

### Backlog

- A rendered hybrid-layout diagram (TP on NVLink inside a node; PP and DP across EFA).
- Land the 70 ms against 2.2 s figure a second time in the scaling-efficiency container (rule 9).
- A citation for the data-parallel volume formula (L163) and for "multi-path routing of SRD handles asymmetric traffic well" (L205-206), or delete the SRD sentence.

---

## 2. InstanceSupport.tsx (Instance Support Matrix)

Reader-visible rows also from `src/data/instances.ts` (one row note changed, L688).

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- Both BEFORE accuracy flags are closed with text that traces to the section's own diagram and cards: the opener now says the Nitro version decides the EFA generation "apart from the RDMA exceptions the generation cards name", and the peak "steps up" 400 / 3,200 / 3,200 / 6,400 (L150-156). All three corrections landed (L503, L467-469, instances.ts L688), and all five leverage candidates were applied as proposed.
- The reorders work: the P6e-GB200 disclosure opens on its verdict (L390-391) and closes on the number to size on, 1,600 Gbps (L402-406); the Trn3 disclosure leads with the networking answer and folds "no Trn3 row" into one sentence (L440-446). The provenance triple (headings in prose, SourceRef, diagram footnote) is down to one sentence (L347-349).
- A high 8. It is held there by citation defects in text the pass did not touch, and by one model that still exists only as prose. The P6e-GB200 bandwidth reconciliation (L412-414) is still our arithmetic presented between two cited facts without a label, the 25 Gbps floor (L152-153) hangs on a citation that does not list those types, and the two-axis sharing model (L490-497) is still a dense index list in prose.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 4 | 5 | 4 | 4 | 4 |
| AFTER | 4 | 5 | 4 | 5 | 4 |

- Accuracy 5: the "straight line" and "every row" overstatements are gone; spot-checked the P6e-GB200 and P6-B300 figures against the efaAcc page (fetched 2026-10-23): 17 cards, NCI pairs sharing a 400 Gbps physical NIC, GPU pairs [1,3] [5,7] [9,11] [13,15] at 400 Gbps, the 4 x 400 / 8 x 200 layouts, and P6-B300 6,400 Gbps with a 350 Gbps ENA-only primary card all match.
- Economy 4: the Trn3 chip-compute paragraph stays (sourced numbers the pass may not trade), now second inside a closed disclosure, which is the right place for it.

### Pass verdict

Succeeded as a corrections pass (accuracy 4 to 5, nothing lost). As a leverage pass it held rather than raised: leverage was already at 5 and model held at 4. No rigor spent.

### Regressions introduced by 6b46869

None found. Every changed sentence traces to BEFORE text or to the section's own diagram, cards and warning (the 1,600 Gbps in L404 traces to L410). Hedges were weakened only (L467-469). No changelog voice, no AI tells (grep clean). Acronyms: RDMA and EFA keep their first-use expansions (L147, L150-151); VPC is expanded at L509.

### Remaining corrections (missed by the pass)

1. **L412-414, inference between two cited facts without a label (leverage standard check 3).** "These reconcile: 3,200 Gbps is total physical card capacity, and the 1,600 Gbps EFA ceiling comes from the GPU sharing topology."
   Replace with: "Our arithmetic reconciles them from the sharing rules below: eight physical cards at 400 Gbps each give 3,200 Gbps, and four GPU-shared pairs at 400 Gbps each give the 1,600 Gbps EFA ceiling." (Both factors trace to L491-493.)
2. **L152-154, citation cannot bear the low end of the range.** "EFA-capable types run from 25 Gbps at the small end (g6.8xlarge, gr6.8xlarge, vt1.24xlarge) to 6,400 Gbps on p6-b300.48xlarge [efaAcc]". The fetched efaAcc page names none of g6.8xlarge, gr6.8xlarge or vt1 (zero matches); it does carry the P6-B300 6,400 Gbps. The section already cites `docs.ac` for vt1.24xlarge at 25 Gbps (L325-326).
   Replace with: "... from 25 Gbps at the small end (g6.8xlarge, gr6.8xlarge, vt1.24xlarge){' '}<SourceRef provenance="documented" doc={docs.ac} /> to 6,400 Gbps on p6-b300.48xlarge{' '}<SourceRef provenance="documented" doc={docs.efaAcc} />". Confirm the g6 and gr6 rows on the `ac` page before attaching.
3. **L409-411, the 3,200 Gbps and 17-card figure attributed in prose to the accelerated computing page carries no citation of its own** (the only SourceRef in the Alert is `efaAcc`, which says "up to 17 network cards" and 1,600 Gbps, not 3,200). Attribution case 4 keeps the prose attribution legal, but the number is still uncited. Attach `<SourceRef provenance="documented" doc={docs.ac} />` after "17 network cards." (BEFORE listed this in backlog; it is a written-rule item: every quantitative claim carries an inline citation.)

### Backlog

- A small diagram of the P6e-GB200 two sharing axes (L490-497).
- A Trn3 row once a trn3 instance type appears in the EFA tables.

---

## 3. Pricing.tsx (Pricing Analysis)

Reader-visible rows also from `src/data/pricing.ts` (unchanged by 6b46869).

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- Every BEFORE correction, accuracy flag and leverage candidate landed: "MarketOption filter" (L282), "every On-Demand rate" (L307), "Families with no Spot support" and "Families with Spot support" (L314, L328), the Spot hedge scoped (L304-306), the three negations gone (L167, L171, old L337), VPC expanded and the attribution narration removed (L457-459). The final-day clock now ends on the two times the reader schedules against (L389-391), and the block-hour percentages moved out of the footer into the main container (L396-399).
- The filter recipe now follows "The practical rule" (L278-286) instead of preceding the answer, and the version string appears once in prose plus the history table.
- Held at 8 by two small defects the pass introduced (SKU now used twice before its expansion; the new h2 description is repeated almost word for word by the paragraph under it) and by the "What EFA itself costs" table, which still attaches the EFA page to rows it cannot bear.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 4 | 5 | 4 | 4 | 4 |
| AFTER | 4 | 5 | 4 | 5 | 4 |

- Accuracy 5: the four BEFORE flags are fixed; derived percentages unchanged (BEFORE verified them).
- Economy 4: version repetition fixed; offset by the h2/body duplication (L114 against L122-124), and the Outposts and P4d cross-type sentence (L459-461) and the placement-group quote (L464-470, also the InstanceSupport closing Alert) still do not bear on price.

### Pass verdict

Succeeded as a corrections pass (accuracy 4 to 5). As a leverage pass it held: model 4 and leverage 5 unchanged, though the clock times and the promoted block-hour line are real leverage gains inside an already-5 axis. No rigor spent.

### Regressions introduced by 6b46869

1. **L41 and L192, SKU now used before its expansion.** Moving the filter paragraph from the h1 container to L278-286 moved "SKU (stock keeping unit)" below two earlier uses: the "What EFA itself costs" table row "The same SKU is billed whether or not you attach an EFA." (L41) and "an hpc7a rate quoted under a us-east-1 heading is a SKU that does not exist" (L192).
   Fix: L41 "The same SKU (stock keeping unit) is billed whether or not you attach an EFA."; L282-283 "the same SKU also has a MarketOption=CapacityBlock row priced at zero".
2. **L114 against L122-124, the new h2 description is repeated by the first paragraph.** Description: "What a Gbps of EFA costs on each family, the number that decides between network-optimized instances and the accelerator premium". Body: "What a Gbps of EFA bandwidth costs on each family is the number that decides whether you scale out on cheap network-optimized instances or pay the accelerator premium." (The pass applied the BEFORE scorer's description and kept the sentence it was drawn from.)
   Fix: L122-124 becomes "The rates are us-east-1, Linux, Shared tenancy, On-Demand." only.

No new unsourced assertions: "11:00 UTC" and "10:30 UTC" trace to L375-386, and the promoted percentages keep their "Our arithmetic" label and `derived` badge. No hedge widened, no sourced number or conflict deleted (the UltraServer 60-versus-40-minute disagreement stays at L386-389), no changelog voice, no AI tells (grep clean).

### Remaining corrections (missed by the pass)

1. **L42-43 with L102, citation cannot bear two of the four rows.** The Source column attaches `EFA_DOC` to every row, including "A placement group is a scheduling constraint with no line item." and "EFA-capable types skew toward the largest size in each family." The EFA pricing sentence ("at no additional cost") bears rows 1 and 2 only. (BEFORE listed this under rigor and backlog; the leverage standard's check 2 makes it a correction.)
   Fix: row 4 note becomes "You pay for the instances." (delete the uncited skew claim), and give the Source column a per-row value: `cell: (item) => item.component === 'Cluster placement group' ? <Box color="text-body-secondary">No source</Box> : <SourceRef provenance="documented" doc={EFA_DOC} />`, or delete the placement-group row if no placement-group pricing page is cited.
2. **L470, uncited judgement after a verbatim quote.** "Skipping it is legal and usually a mistake." The first half restates the quote; "usually a mistake" is our reading with no source.
   Replace with: "Skipping it is allowed." or delete the sentence (the quote already carries "we do recommend").
3. **L396-399, promoted percentages lost their expiry date.** In the footer they sat beside "The current prices are scheduled to be updated next in January, 2027." In the main container they read as standing figures, which works against the section's own model at L273 ("A price is a claim with an expiry date").
   Replace with: "Our arithmetic, Tier 2 block rate over Tier 1 us-east-1 On-Demand rate, at the block rates scheduled to change in January 2027: a block hour costs 99.8% of On-Demand on p6-b200 and p5en, 90.7% on p6-b300 and 86.8% on p5 <DerivedBadge />."

### Backlog

- A rendered timeline of the Capacity Block final day (11:30 end, 11:00 instance-type start, 10:30 UltraServer, the two warning times that disagree).
- A sourced Spot rate path, with its own date.
- Delete the Outposts and P4d cross-type sentence (L459-461) here, since InstanceSupport carries it in the placement Alert.

---

## 4. NcclOverEfa.tsx (NCCL over EFA: the aws-ofi-nccl Plugin)

### AFTER Gate 3 score: 8 / 10 (BEFORE 7)

- All six corrections and both accuracy flags landed. Flag B was resolved with evidence rather than a guess: the Alert now scopes hand-pointing NCCL_TUNER_PLUGIN to NCCL 2.19 and 2.20 "which look up the v1 tuner symbol" and to plugin releases before v1.20.0 (L699-703). Spot-checked: NCCL v2.19.3-1 and v2.20.5-1 `src/include/nccl_tuner.h` L53 both `#define NCCL_TUNER_PLUGIN_SYMBOL "ncclTunerPlugin_v1"`, and aws-ofi-nccl v1.22.0 RELEASENOTES.md L91, under the "# v1.20.0" heading at L75, reads "Removed tuner v1 plugin support".
- Leverage candidates 1 to 4 landed: the GDAKI container now opens on three sentences and the four conditions, with the symbol detail in a disclosure (L1228-1255); the filter-and-tuner composition is the visible Alert's last line (L978-980); OFI_NCCL_EAGER_MAX_SIZE now says what to do with it (L723-725); the cmpScore disclosure is gone. Candidate 5 (an NCCL_IB_HCA override hook) was not applied.
- Held at 8 by economy: prose fell only about 1.5%, and three duplications the BEFORE scorer named remain (below).

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 5 | 5 | 4 | 3 |
| AFTER | 5 | 5 | 5 | 5 | 3 |

- Accuracy 5: h2 description now matches the body's "three plus the instance type" (L1128 against L1165-1166); the 2.19/2.20 scope is now cited and correct.
- Economy 3: still carries the release-note archaeology disclosure on the v1.20.0 segfault fix (L1055-1076), the "Where AWS documentation ends" disclosure that repeats L619-621, and the NCCL_TUNER_PLUGIN explanation twice (Alert L692-704, which grew, and table row L529-532). "actually" still appears seven times, four of them in headers (L820, L956, L1056, L1178).

### Pass verdict

Succeeded as far as the ceiling allows: model and leverage were already 5 and held, accuracy rose to 5, rigor held at 5 with two new citations that bear their claims. Economy did not improve, which is the one axis the pass could have moved and mostly left alone.

### Regressions introduced by 6b46869

None found.
- New citations `ncclSymbol219`, `ncclSymbol220` and `releaseNotesV120` (L700-703) each bear exactly what the sentence asks of them (fetched above).
- The demoted GDAKI lead keeps `ncclGinProxySkip` on "NCCL 2.32.3 runs the host-proxy path itself" (L1231-1233); NCCL v2.32.3-1 `src/plugin/gin.cc` L164-170 logs "Skipping external proxy plugin ... using NCCL GIN proxy over RMA backend", so it bears the sentence.
- Diagram 1 now spells out Scalable Reliable Datagram (L213) and drops the acronym, so no expansion is owed. GIN, RMA, RDMA and DMI are expanded at first use (L1140, L1245, L724-725, L800).
- The deleted cmpScore disclosure was a third-party-guide-versus-code correction, not an AWS documentation-versus-code conflict, so the pass was allowed to drop it. The research file keeps it.
- No changelog voice, no AI tells (grep clean).

### Remaining corrections (missed by the pass)

1. **L1150-1151, uncited claim in the drift list (CLAUDE.md: every claim citable).** "Too-new NCCL against a too-old plugin: NCCL looks for a network plugin symbol beyond the exported range and falls back to its own transport." NCCL v2.32.3-1 `src/plugin/net.cc` L40-42 lists versions 12 down to 6, and L333-337 register the internal IB and socket plugins (fetched).
   Fix: append `<SourceRef provenance="code-derived" code={code.ncclNetVersions} />` after "falls back to its own transport", and add `ncclNetInternal: nccl('src/plugin/net.cc', 'L333-L337')` beside it.

### Economy edits the pass could still make (delete / re-express; not rule corrections)

- Delete the "Where AWS documentation ends" disclosure (L632-645). Move its one practical sentence into the intro: L621 "... so this section reads it out of the plugin at release tag v1.22.0. Re-check it against the tag you are running."
- Delete L697-698 ("On EC2 the plugin's CUDA build also sets NCCL_TUNER_PLUGIN ...") from the Alert, or the matching clause from the table row at L529-532. The Alert and the row say the same thing.
- Header re-expressions: L1178 "Reading the NCCL debug lines that answer a question"; L956 "The tuner: what it does"; L820 "What the platform table sets, per family".

### Backlog

- A rendered flow of the cost-table pipeline (filter, initialise, modelled times, tuner vote, minimum).
- A rendered gate chain for the four GDAKI conditions.
- BEFORE leverage candidate 5 (an NCCL_IB_HCA you set wins and is logged, L844).

---

## 5. Operations.tsx (Operations, Observability and Failure Modes)

### AFTER Gate 3 score: 8 / 10 (BEFORE 8)

- Everything the BEFORE scorer listed landed: the eleven corrections, both accuracy flags and the five leverage candidates. Five absence claims are scoped to "located during this research" (L676-677, L714, L814, L1107, L1141, L1308), the vendor_part_id Alert puts each citation on the fact it bears (L674-679), and the AMI, MPI, SRD, EKS, VPC and MOFED expansions moved forward. The h2 description no longer claims an order the table does not have (L1047).
- Flag B was resolved from code rather than by experiment. The old comment, "it is almost always the security group", is now "It is local: no provider matched" (L795), with a five-citation paragraph (L798-809). I spot-checked all five at libfabric v2.7.0: `fi_errno.h` L107 `FI_ENODATA ENODATA /* No data available */`; `fi_getinfo.3.md` L66-67 "info will be set to NULL and the call will return -FI_ENODATA"; `pingpong.c` L1489-1490 calls fi_getinfo with NULL node and service; L503 sets control port 47592; L1781 runs `pp_ctrl_init` before `pp_getinfo`. All five bear their claims.
- Held at 8. One accuracy defect sits in text the pass rewrote (the topology file is not written on every P5-and-later type), plus one universal claim built from a grep, and the economy items the BEFORE scorer named.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 5 | 4 | 4 | 4 |
| AFTER | 5 | 5 | 4 | 4 | 4 |

- Rigor 4 (closer to 5 than before): the six widened absence claims and the 12-line-table-bears-an-absence citation are fixed. Still at 4 for "registers an InfiniBand device and nothing else" (L1022), the conflict SourceRef sitting on the installer clause (L761-768), and the new unlabelled inference at L807-809.
- Accuracy 4: BEFORE flags A and B are fixed. Held at 4 by remaining correction 1. The plugin writes its topology only when `max_group_size > 1` (aws-ofi-nccl v1.22.0 `nccl_ofi_rdma.cpp` L7204, fetched). The rewritten "On P5 and later" (L1134) and the topo row (L522) therefore cover types where it does not. [SPECULATIVE on which types: P6-B200 has 8 EFA cards for 8 GPUs, and the platform comment at platform-aws.cpp L169-170 describes it as "2 GPUs and 2 NICs per PCIe switch". The AI/ML Training section (L449-450) lists only P5, P5en and P6-B300 for the written file.]
- Economy 4: prose grew about 1% (the -61 paragraph earns it). The qkey_viol paragraph (L1008-1015) and the topology explanation in both the table row and the disclosure remain.

### Pass verdict

Succeeded as a corrections pass, and it resolved an accuracy flag with checkable code evidence instead of rewording around it. As a leverage pass it held: model and leverage were already 5. Accuracy did not reach 5 because the BEFORE scorer's own replacement text ("On P5 and later") carried a scope error that the pass adopted.

### Regressions introduced by 6b46869

1. **L807-809, low: a new inference with no label, slightly wider than its evidence.** "So the error points at the EFA device or the -p and -e flags, and a peer the security group blocks would fail earlier, at that control connection." The cited code shows the TCP control connection on port 47592 comes before fi_getinfo. It shows nothing about a security group that admits TCP but not all traffic, which the section's own table calls too narrow (L539). That case passes the control connection.
   Replace with: "Our reading of that order: the error points at the EFA device or the -p and -e flags, and a security group that blocks the control port fails earlier, at that control connection."

Nothing else regressed. The new sentences in the vendor_part_id Alert, the version column (L1191-1193), the channel Alert (L1199) and the checksum Alert (L1241-1242) all trace to text already in the section. No sourced number, conflict or UNKNOWN was deleted (all three UNKNOWNs survive with narrower scope). No changelog voice, no AI tells (grep clean).

### Remaining corrections (missed by the pass)

1. **L1134-1136 and L521-522, accuracy: the topology file is written only where a GPU has more than one EFA device.** L1134 says "On P5 and later the plugin writes a NCCL topology into an anonymous in-memory file". The gate is `if (this->topo->max_group_size > 1)` (nccl_ofi_rdma.cpp L7204).
   Add `topoGate: plugin('src/nccl_ofi_rdma.cpp', 'L7199-L7210')` and replace with: "Where a GPU has more than one EFA device, the plugin writes a NCCL topology into an anonymous in-memory file and points NCCL_TOPO_FILE at it, unless the variable is already set{' '}<SourceRef ... code={code.topoMemfd} /><SourceRef ... code={code.topoGate} />;". In the topo row (L522): "Leave NCCL_TOPO_FILE unset so the plugin can write its own into a memfd wherever a GPU has more than one EFA device. The static XML files that ship with the plugin cover p4d, p4de and g5.48xl only."
2. **L1022, a universal claim built from a local search (shape rule 14).** "The EFA driver registers an InfiniBand device and nothing else." The cited evidence is a grep for three strings, which supports "no network device", not "nothing else".
   Replace with: "The EFA driver registers an InfiniBand device and no network device."
3. **L761-768, a citation attached to a clause it cannot bear.** The doc-code-conflict SourceRef (sample "fabric: EFA-fe80::..." against `efa.h` L62-63) follows "installer 1.51.0 ships 2.7.0amzn2.0", which only `docs.installer` bears.
   Fix: "... and installer 1.51.0 ships 2.7.0amzn2.0{' '}<SourceRef provenance="documented" doc={docs.installer} />. The line shows which of the two fabrics you got{' '}<SourceRef provenance="doc-code-conflict" ... />."
4. **L476 and L585, acronyms rendered before their expansion in the same table row.** The counter group cell "Network (SRD)" renders before the meaning cell that expands SRD. The failure table renders the "Correct configuration" column first, so "EKS Auto Mode leaves it off." (L585) precedes "EKS (Elastic Kubernetes Service)" in the detect cell (L584).
   Fix: `group: 'Network (SRD, Scalable Reliable Datagram)'` with "times SRD traffic timed out" in the meaning cell; and L585 "EKS (Elastic Kubernetes Service) Auto Mode leaves it off." with "the EKS guide gives ..." in L584.

### Backlog

- A logged two-node fi_pingpong experiment for both security-group cases (blocks everything, admits TCP only), to replace the inference in regression 1 with a Tier 0 result.
- A node-level collector snippet for the five network counters on EKS.
- One shared topology explanation referenced from NCCL over EFA, AI/ML Training and this section.
- Delete or demote the qkey_viol paragraph (L1008-1015): it explains an absence the reader cannot act on.

---

## 6. TopologyApi.tsx (The EC2 Instance Topology API)

### AFTER Gate 3 score: 9 / 10 (BEFORE 8)

- All five corrections, all three accuracy flags and all four leverage candidates landed, plus two hedges the BEFORE scorer did not list (L692-694, L1385-1386). The Karpenter paragraph now leads with what a Karpenter user needs (the labels are there, L1297-1298) and keeps the v1.15.0 scope on the search result (L1301-1302). The h2 descriptions say "topology-aware scheduling turned off" (L1219) and name the tree-or-block decision (L1090).
- Flag C was resolved with evidence. "Placement group membership through the launch template" now reads "through the EC2NodeClass placementGroupSelector, which it writes into the launch templates it generates", with two new code citations. Spot-checked at karpenter-provider-aws v1.15.0: `pkg/apis/v1/ec2nodeclass.go` L57-61 declares `PlacementGroupSelector`, and `pkg/providers/launchtemplate/launchtemplate.go` L157-175 resolves the placement group and passes `pgID` into launch template resolution. Both bear the sentence.
- Not 10 because two universal absence claims survive next to text the pass scoped, and an uncited superlative sits in the most-read Alert.

### Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| BEFORE | 5 | 5 | 4 | 4 | 4 |
| AFTER | 5 | 5 | 4 | 5 | 4 |

- Accuracy 5: header count (L1048), h2 description (L1219) and the Karpenter mechanism (L1305-1309) are all now correct.
- Rigor 4: the pass scoped five absence claims. Two remain unscoped (L694-695, L1402-1403), plus the uncited superlative at L805-806.
- Economy 4: the duplicate p6e-gb200 contradiction and the duplicate code comment are gone. Prose grew about 0.6% from the Karpenter evidence.

### Pass verdict

Succeeded. Model and leverage were already 5 and held, accuracy rose to 5 with checkable code evidence, rigor held, economy held. This is the cleanest application in the batch.

### Regressions introduced by 6b46869

None found. The new Karpenter citations bear their sentence. The reordered Karpenter paragraph keeps the release scope. "can cache a wrong answer" (L914) weakens the source hedge. The header recount ("three pages", L1048) matches its body. No changelog voice, no AI tells (grep clean). PCS is now expanded at first use (L1203-1204).

### Remaining corrections (missed by the pass)

1. **L694-695, a universal claim left behind a sentence the pass scoped.** After L692-694 became "No AWS mapping ... was located during this research", the next sentence still says "Any page that tells you layer iii is a top-of-rack switch is inferring it", which claims more than the research can support (shape rule 14).
   Replace with: "Treat any page that names layer iii a top-of-rack switch as inference unless it cites an AWS source."
2. **L1402-1403, the same absence stated without scope.** "Nothing in the documentation binds layer i, ii or iii to a spine, aggregation or leaf tier."
   Replace with: "No documentation binding layer i, ii or iii to a spine, aggregation or leaf tier was located during this research."
3. **L805-806, an uncited frequency superlative (CLAUDE.md: every claim citable; BEFORE listed it in backlog).** "This is the single most common way topology-aware ranking ends up doing nothing." Nothing in the section measures frequency.
   Delete the sentence. The previous one ("Omit the flag and the sort is discarded silently, with no warning and no error.") carries the action.

### Backlog

- A rendered consumer-chain diagram (API response, rank map, topology.conf, Kubernetes labels).
- A logged API call confirming whether the live response returns the string "null" for CapacityBlockId.
- A source for "The tool is recommended for static compute clusters." (L1131), which carries no SourceRef.

---

## Comparison with the applier's log (gate3-apply-B.md, read after scoring)

| Section | Applier AFTER (score; MM/PL/R/A/E) | Re-scorer AFTER (score; MM/PL/R/A/E) | Where we differ |
|---|---|---|---|
| AIMLTraining | 7; 4/4/4/4/4 | 7; 4/4/3/4/3 | The applier knowingly left "Tensor parallelism is latency-sensitive (many small messages)" because no source had been fetched. I fetched Narayanan et al. (arXiv:2104.04473), and it puts the expensive traffic on TP, not PP (remaining correction 1). The applier's log records dropping efa-direct and the `topoP4d`/`topoG5` citations as a cross-section dedup. Its claim-set self-check does not record that this left the GPUDirect Async sentence unconditional and the packaged-file list on `topoEnv`, which cannot bear it (regressions 1 and 2). The log says NCCL was expanded at "first prose use", but L210 comes first (regression 3). The Under the Hood disclosure still duplicates the tuner account, so I hold economy at 3. |
| InstanceSupport | 8; 4/5/4/5/4 | 8; 4/5/4/5/4 | Agree. The applier correctly widened the BEFORE scorer's "five named RDMA exceptions" to cover both rungs. I add that the 25 Gbps floor is cited to a page that does not list those types. |
| Pricing | 8; 4/5/4/5/4 | 8; 4/5/4/5/4 | Agree on scores. The applier re-expressed the first paragraph on purpose, to keep the scope next to the table. That paragraph now repeats the new h2 description, and moving the filter paragraph pushed the SKU expansion below two earlier uses (regressions 1 and 2). |
| NcclOverEfa | 8; 5/5/5/5/4 | 8; 5/5/5/5/3 | Economy only. The applier skipped LC5 with a sound reason. I still count the three named duplications and the segfault-archaeology disclosure against economy. |
| Operations | 8; 5/5/5/5/4 | 8; 5/5/4/4/4 | The applier treats "would" as labelling the security-group clause as our reading. I count it as a low regression because it is still unlabelled and wider than its evidence. Accuracy: the applier adopted the BEFORE scorer's "On P5 and later" for the generated topology file. The gate is `max_group_size > 1`, and the AI/ML Training section's own list (P5, P5en, P6-B300) excludes P6-B200 (remaining correction 1). The applier did not flag "registers an InfiniBand device and nothing else" or the misplaced conflict SourceRef. |
| TopologyApi | 8; 5/5/5/5/4 | 9; 5/5/4/5/4 | I score the section higher overall and rigor lower. The two scoped hedges left their sibling universal claims standing (L694-695, L1402-1403), and the "single most common way" superlative is still uncited. The applier listed the superlative as backlog. |

The applier's fetch evidence checked out everywhere I re-fetched it: the NCCL 2.19/2.20 tuner symbol, the v1.20.0 release note, the libfabric pingpong order and errno, the Karpenter placementGroupSelector, and the Megatron-LM allreduce count.

---

## Summary

| Section | BEFORE score | AFTER score | AFTER axes (MM/PL/R/A/E) | BEFORE axes | Regressions from 6b46869 | Remaining corrections | Pass verdict (leverage standard) |
|---|---|---|---|---|---|---|---|
| AIMLTraining | 6 | 7 | 4/4/3/4/3 | 4/4/3/3/3 | 3 (GPUDirect Async scope dropped; topology list on a citation that cannot bear it; NCCL expansion moved into a closed disclosure and still not at first use) | 5 | Corrections pass succeeded; leverage pass did not (model and leverage held, accuracy 4) |
| InstanceSupport | 8 | 8 | 4/5/4/5/4 | 4/5/4/4/4 | 0 | 3 | Succeeded as corrections (accuracy to 5); leverage held at ceiling, model held |
| Pricing | 8 | 8 | 4/5/4/5/4 | 4/5/4/4/4 | 2 (SKU used before its expansion; h2 description repeated by the body) | 3 | Succeeded as corrections (accuracy to 5); leverage held at ceiling |
| NcclOverEfa | 7 | 8 | 5/5/5/5/3 | 5/5/5/4/3 | 0 | 1 | Succeeded (accuracy to 5, model and leverage at ceiling); economy not moved |
| Operations | 8 | 8 | 5/5/4/4/4 | 5/5/4/4/4 | 1 (low: unlabelled security-group inference) | 4 | Succeeded as corrections; accuracy held at 4 by the adopted "P5 and later" topology scope |
| TopologyApi | 8 | 9 | 5/5/4/5/4 | 5/5/4/4/4 | 0 | 3 | Succeeded (accuracy to 5, everything else held) |

- Batch AFTER average: 8.0 (BEFORE 7.5). No section below 7.
- Gate 3: the score thresholds are met, but only at the margin, and Gate 3 also requires all corrections resolved. It is not met until the 6 regressions and 19 remaining corrections above are closed. AIMLTraining remaining correction 1 is an accuracy fix and goes first.
- Patterns across the batch:
  - Scope losses in this pass came from dedup deletions that removed the citation carrying a condition (AIMLTraining GPUDirect Async, AIMLTraining packaged topology list).
  - Hedges scoped in one sentence left a sibling universal claim standing (TopologyApi L694-695 and L1402-1403).
  - Acronym expansions moved to the first source-order use rather than the first rendered use (AIMLTraining NCCL into a closed disclosure; Operations SRD and EKS in a row whose earlier column renders first; Pricing SKU).
- Spot-check fetches (2026-10-23, no personal data in any request): raw.githubusercontent.com for aws/aws-ofi-nccl v1.22.0, ofiwg/libfabric v2.7.0, NVIDIA/nccl v2.19.3-1, v2.20.5-1 and v2.32.3-1, and aws/karpenter-provider-aws v1.15.0; docs.aws.amazon.com efa-acc-inst-types.html; ar5iv.labs.arxiv.org and arxiv.org/html for arXiv:1909.08053 and arXiv:2104.04473.

STATUS: COMPLETE
