# Gate 3 re-score: AIMLTraining.tsx (EFA for AI/ML Training), after commit 78ad2ec

Independent re-scorer. Read-only on the section; this report is the only file written.

- Section: `deep-dives/efa/src/sections/AIMLTraining.tsx`. The working tree matches commit 78ad2ec ("close the re-score findings in the matrix, pricing, NCCL, training, operations and topology sections") for this file. All line numbers below are for that file.
- Prior scores: 6 before the Gate 3 pass, and 7 after it in `gate3-rescore-B.md` (the group B re-score, section 1, "What holds AIMLTraining below 8").
- Standards applied: `revamp/section-shape-standard.md`, `revamp/leverage-pass-standard.md` (five axes), and the "Writing Style: No AI Tells" section of CLAUDE.md.
- Gate 3 is the quality gate: no section below 7, an average of at least 8, and all corrections resolved.
- Deterministic checks run 2026-10-23: `scripts/gates/no-ai-tells.sh` PASS, `scripts/gates/pinned-refs.sh` PASS. A grep found no em-dash, en-dash range, curly quote, banned word or changelog voice in the file.
- Fetches made 2026-10-23 with the curl default User-Agent, sending no personal data: both Megatron-LM papers via ar5iv; pinned aws-ofi-nccl v1.22.0, libfabric v2.7.0 and nccl-tests v2.21.1 files; the EC2 "Get started with EFA and NCCL" page; the AWS Neuron collectives page; the NVIDIA Fabric Manager User Guide.

---

## AFTER Gate 3 score: 8 / 10 (was 7 after the first Gate 3 pass, 6 before it)

- The central model now holds and is cited. TP's per-layer allreduces stay on NVLink, PP's cheaper point-to-point handoffs cross nodes, and DP's per-step allreduce sizes the fabric as bytes over bandwidth. The two launcher lines sit in the open, and every item in the 7-score report's "holds it below 8" list is closed.
- It is an 8 at the margin rather than a 9. Four pre-existing defects stand: the `fi_read` mapping contradicts the plugin and provider code; the Fabric Manager exact-match rule is uncited and unscoped (NVIDIA scopes it to drivers before release 620); "Neuron CCL calls libfabric directly" is uncited and in tension with the plugin's Neuron build; and the closing "measure it" step does not say which ratio to compute.
- 78ad2ec introduced three low-severity regressions: one duplicated sentence, one header echo, and one citation now adjacent to a clause it cannot bear. Gate 3's "all corrections resolved" condition is not met until the items below close.

## Axes

| | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| After the first Gate 3 pass (gate3-rescore-B) | 4 | 4 | 3 | 4 | 3 |
| After 78ad2ec (this re-score) | 4 | 4 | 4 | 4 | 4 |

- **Mental model 4.** The strategy-to-placement model is now right and traceable to Narayanan et al. The hybrid layout still exists only as prose, which holds it at 4 (the diagram is on the backlog).
- **Practical leverage 4.** `NCCL_DEBUG` and `FI_LOG_LEVEL` are visible, and the section says to leave `NCCL_TOPO_FILE` and `NCCL_TUNER_PLUGIN` unset. The Trn1n pick and the sizing method are clear. The final action (L487-490) is ambiguous about which ratio is the efficiency (remaining C4).
- **Rigor 4, up from 3.** Both citation-scope regressions from the first pass are fixed and verified. The TP/PP claim carries a tier-3 citation that bears it. The uncited disk figures and the uncited Fabric Manager outcome are gone. Still uncited: the DP volume formula (L171), the SRD multi-path claim (L215), Neuron calling libfabric (L262), the Fabric Manager rule (L436-437) and the nouveau steps (L440-442). There is also one new citation-adjacency defect (R3).
- **Accuracy 4.** The TP/PP inversion is fixed. The `fi_read` bullet (L386) misattributes the runting-read protocol (C1), and the Fabric Manager rule is right only for drivers before release 620 (C2).
- **Economy 4, up from 3.** The tuner version history moved to its owner section and the Disk-space Alert is gone. The prose is about 1.3% shorter (2,228 to 2,199 words, tags stripped). Two small duplications arrived (R1, R2), and one pre-existing duplicate GDRCopy pointer remains (C10).

---

## Items the 7-score report listed as holding it below 8

| # (gate3-rescore-B) | Item | Status | Evidence |
|---|---|---|---|
| Remaining 1 (accuracy) | TP/PP characterisation inverted against the Megatron-LM authors | **Closed** | L196-202 now: TP allreduces run in every layer, so TP stays on NVLink; PP is cheaper point-to-point, so PP crosses nodes. Cited to `docs.megatronGpu`. The citation bears it (spot-check below). L163 and L204 were updated to match. |
| Regression 1 (rigor) | GPUDirect Async lost its efa-direct condition | **Closed** | L216-218: "on the efa-direct fabric only", with `gdaOps` and `gdaOpsDirect`. libfabric v2.7.0 `prov/efa/src/efa_domain.c` L803-808 (fetched) returns `-FI_EOPNOTSUPP` with "Only efa direct supports FI_EFA_GDA_OPS". |
| Regression 2 (rigor) | Packaged topology list hung on `topoEnv` | **Closed** | L450-454: "at v1.22.0" plus `topoRows` (platform-aws.cpp L88-105: p4d.24xlarge row L89-91, p4de.24xlarge row L103-105) and `topoRowG5` (L248-250: g5.48xlarge, `g5.48xl-topo.xml`). Both fetched and confirmed. |
| Regression 3 (acronym) | NCCL expansion in a closed disclosure, not at first use | **Closed** | L221-222: "The section on NCCL (NVIDIA Collective Communications Library) over EFA". No earlier rendered use exists (L140-220 checked). L298 reverts to "the CUDA and NCCL path". |
| Remaining 2 (economy) | Tuner version history duplicated from NCCL over EFA | **Closed, with a low regression (R3)** | L413-419 is cut to the consequence. `tunerV2` was dropped. The v2 / NCCL 2.21.x fact survives in NcclOverEfa L974-981, so nothing left the dive. |
| Remaining 5 (leverage) | The two launcher lines sat behind a closed disclosure | **Closed, with a low regression (R2)** | L325-332 shows the lead sentence and the `<pre>` in the open. The disclosure was renamed at L334. |
| Remaining 3 (rigor) | Disk-space Alert: uncited "10-20 GiB", "30 GiB", "fails silently" | **Closed** | Alert deleted. AMI was expanded only there and no longer appears in the file (grep). |
| Remaining 4 (rigor) | Fabric Manager "takes all 8 GPUs out" outcome uncited | **Closed as specified** | Sentence deleted. The exact-match instruction that was kept is itself uncited, and the source scopes it (C2 below). |

---

## Megatron-LM citation spot-checks

**`docs.megatron`, L189-192:** "Tensor parallelism splits individual layers across GPUs and adds allreduce operations to every forward and backward pass."
[Tier 3: Shoeybi et al., arXiv:1909.08053, read via ar5iv on 2026-10-23.] The paper says: "This enables us to perform all GEMMs in a simple transformer layer using only two all-reduces in the forward path and two in the backward path". It also says the approach is "requiring only a few extra all-reduce operations added to the forward and backward pass".
**Bears the sentence.** The next sentence about pipeline parallelism (L193-195) sits after this citation and is not covered by it. Narayanan et al. cover it if R1's fix is applied.

**`docs.megatronGpu`, L196-202:** "Those allreduces run inside every layer, which is why the hybrid layout below keeps TP on NVLink. Pipeline parallelism sends activations point-to-point only between stages, which is far cheaper [cite], so PP is the split that crosses nodes over EFA."
[Tier 3: Narayanan et al., arXiv:2104.04473, read via ar5iv on 2026-10-23.] The paper says: "We observe that tensor model parallelism is best within a node (DGX A100 server) due to its expensive all-reduce communication. Pipeline model parallelism, on the other hand, uses much cheaper point-to-point communication that can be performed across nodes without bottlenecking the entire computation." Takeaway #1 reads: "tensor model parallelism should generally be used up to degree g when using g-GPU servers, and then pipeline model parallelism can be used to scale up to larger models across servers".
**Bears the sentence.** "Far cheaper" stands for the paper's "much cheaper". "Over EFA" is our application to EC2, since the paper's cluster is DGX A100 on 200 Gbps HDR InfiniBand. It sits after the citation, so its position marks it as our conclusion. No change needed.

---

## Regressions introduced by 78ad2ec

Three, all low. There is no new unsourced assertion, no widened hedge, no deleted sourced number, no lost acronym expansion, no changelog voice and no AI tell.

**R1. L193-201, economy: the pipeline point-to-point fact is stated twice in consecutive paragraphs.** L193-195 says "Pipeline parallelism splits layers sequentially and requires point-to-point activation transfers between stages." L198-200 adds "Pipeline parallelism sends activations point-to-point only between stages". The second came from the re-expression applied for gate3-rescore-B remaining 1.
Fix. Replace L193-195 with:
`Pipeline parallelism splits layers sequentially and hands activations{' '}<strong>point-to-point</strong> from one stage to the next.`
Replace L196-202 with:
`Those allreduces run inside every layer, which is why the hybrid layout below keeps TP (Tensor Parallelism) on NVLink. The stage-to-stage handoffs are far cheaper{' '}<SourceRef provenance="documented" doc={docs.megatronGpu} label="tier 3: paper" />, so PP (Pipeline Parallelism) is the split that crosses nodes over EFA.`

**R2. L334 and L337-338, economy: the disclosure header is repeated as the opening words of its only paragraph.** The header "The rest of the usual EFA environment block" is followed by "The rest of the usual EFA environment block either applies only to ...".
Fix. Change L337-338 to:
`These either apply only to plugin releases from 2023 and earlier or are best left at their defaults: <code>FI_PROVIDER=efa</code>{' '}`
The rest of the sentence is unchanged. The "2023" bound is consistent with the GitHub releases: aws-ofi-nccl v1.5.0-aws on 2023-01-26 and v1.7.0-aws on 2023-07-25.

**R3. L415-418, rigor: the tuner citations now sit directly after "narrows the table", which they cannot bear.**
- Before 78ad2ec, `tunerV3` and `tunerV6` bore "v3 and v6 run the tuner either way", and "narrows the table" was an uncited "So ..." conclusion.
- Now the sentence reads "setting NCCL_ALGO narrows the table rather than disabling the tuner [tunerV3][tunerV6]".
- aws-ofi-nccl v1.22.0 `nccl_ofi_tuner.cpp` L184-188 and L190-246 (fetched) show only that v3 and v6 bind to the plain initialiser. The file's only `getenv("NCCL_ALGO")` is in the v2 init at L147.
- The narrowing is NCCL core behaviour. NcclOverEfa cites it to NVIDIA/nccl at L1036-1052.
- The claim is true; the defect is citation scope. The text came from gate3-rescore-B's prescribed wording.

Fix. Replace L415-419 with:
`<code>collCostTable</code>, and NCCL still picks the minimum. On NCCL 2.22.3 and later the tuner runs whether or not <code>NCCL_ALGO</code> is set{' '}<SourceRef provenance="code-derived" code={code.tunerV3} /><SourceRef provenance="code-derived" code={code.tunerV6} />, so setting it narrows the table the tuner sees rather than switching the tuner off. The NCCL over EFA section has the version-by-version account and the NCCL code that does the narrowing.`

---

## Remaining corrections (pre-existing, missed by both earlier passes)

They are listed in priority order. C1 to C4 are what separates a marginal 8 from a solid one.

**C1. L386, accuracy (medium): `fi_read` is mapped to the runting-read protocol, which belongs to two-sided sends.**
- In libfabric v2.7.0, `fi_read` goes to a device RDMA read or an emulated read: `prov/efa/src/rdm/efa_rdm_rma.c` L140-161 (fetched).
- Runting read is one of the two-sided send protocols: `prov/efa/src/rdm/efa_rdm_ope.c` L873-874 lists "Two-sided here: EAGER/MEDIUM/RUNTREAD/LONGCTS/LONGREAD RTMs". The paragraph above the list (L367-374) already covers that correctly.
- The plugin's own `fi_read` uses are given in aws-ofi-nccl v1.22.0 `src/nccl_ofi_rdma.cpp` L1249-1256 (fetched): "6. READ: flush, eager copy, or RMA read". They are confirmed at L2685-2718 (GPU flush) and L2750-2785 (eager copy).

Fix. Add `readUses: plugin('src/nccl_ofi_rdma.cpp', 'L1249-L1256'),` to `code`, and replace L386 with:
`<li><code>fi_read</code>: an RMA read, which the plugin posts to flush GPU writes, to copy an eager message out of its receive buffer, and for NCCL&apos;s RMA read{' '}<SourceRef provenance="code-derived" code={code.readUses} /></li>`

**C2. L434-438, accuracy and rigor (medium): the Fabric Manager exact-match rule is uncited and broader than its source.**
- [Tier 1: NVIDIA Fabric Manager User Guide, docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html, revision 2.6 dated September 21, 2026, fetched 2026-10-23] says: "For NVIDIA GPU driver releases earlier than 620, the Fabric Manager package version must match the driver package version. Starting with NVIDIA GPU driver release 620, Fabric Manager is versioned standalone."
- [Tier 1: EC2 User Guide, efa-start-nccl.html, fetched 2026-10-23] says "(Instances with NVSwitch, such as P-series multi-GPU instances) Install and start the NVIDIA Fabric Manager." It installs driver 580.167.08, so the exact match applies on AWS's documented path today.
- The page says "matches the NVIDIA kernel module". NVIDIA's term is the driver package version.

Fix. Add this DocRef:
`fabricManager: { title: 'NVIDIA Fabric Manager User Guide', url: 'https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html', tier: 1, accessed: REFRESHED },`
Set `docs.efaNccl.accessed` to `REFRESHED`. Replace the Alert body with:
`<strong>NVIDIA Fabric Manager on NVSwitch instances such as P4d and P5:</strong> install and start the{' '}<code>nvidia-fabricmanager</code> systemd service{' '}<SourceRef provenance="documented" doc={docs.efaNccl} />. On NVIDIA GPU driver releases before 620 its package version must <strong>exactly match</strong> the driver package version; from release 620 Fabric Manager carries its own version{' '}<SourceRef provenance="documented" doc={docs.fabricManager} />.`
Register the new source in `sources.md` and `Sources.tsx`, the same way 78ad2ec registered `megatronGpu`.

**C3. L261-263, rigor (medium; accuracy in doubt): "Neuron CCL calls libfabric directly" has no source, and the pinned plugin source points elsewhere.**
- The Neuron collectives page (Tier 1, fetched 2026-10-23) never mentions libfabric or a plugin. It does say "Inter-node collectives ... traverse network infrastructure via EFA (Elastic Fabric Adapter) connections".
- aws-ofi-nccl v1.22.0 has a Neuron build target. `configure.ac` L129-132 sets `have_device_interface=neuron`. `src/nccl_ofi_interface_neuron.cpp` L323-346 exports `ncclNetPlugin_v6` (plus v5 and v4 to L389) against vendored Neuron headers in `3rd-party/nccl/neuron/include/nccl/`.
- [SPECULATIVE: that the shipping Neuron runtime loads this build was not traced to Neuron documentation in this re-score. Either way, "directly" cannot stand uncited.]
- "Neuron CCL" as a product name is also not on the Neuron page, whose title is "What is Neuron Collective Communication?".

Fix. Add `neuronBuild: plugin('configure.ac', 'L129-L132'),` and `neuronIface: plugin('src/nccl_ofi_interface_neuron.cpp', 'L323-L346'),` to `code`, and replace L261-263 with:
`AWS Trainium and Inferentia2 chips run on the <strong>Neuron SDK</strong>. On Trainium, Neuron collective communication crosses nodes over EFA{' '}<SourceRef provenance="documented" doc={docs.neuronCollectives} />, and the aws-ofi-nccl plugin also builds against the Neuron runtime and exports a network-plugin interface for it{' '}<SourceRef provenance="code-derived" code={code.neuronBuild} /><SourceRef provenance="code-derived" code={code.neuronIface} />.`

**C4. L487-490, leverage and accuracy (medium): the section's closing action does not say which ratio is the efficiency.**
- "Time one step on a single node and one step at your target node count. That ratio, against the node count, is what the network work buys."
- With the per-node batch held constant (the usual DDP case), single-node step time divided by N-node step time is already the efficiency. Dividing again by the node count gives the wrong answer. With the global batch held constant, the opposite holds.
- [SPECULATIVE: our derivation from the section's own definition at L473-474. No new source is needed.]

Fix. Replace L488-489 with:
`So measure it on your own job. Time one step on a single node and one step at your target node count, keeping the per-node batch the same. Single-node step time divided by multi-node step time is your scaling efficiency: 0.9 on 64 nodes is the work of about 58.`
This also lands the section's figure a second time (rule 9).

**C5. L171, rigor (low): the DP volume formula is uncited** (CLAUDE.md sources standard). [Tier 1: NVIDIA/nccl-tests v2.21.1 `doc/PERFORMANCE.md` L50-59, fetched] says "we need 2(n-1) data transfers" and "`t = (S/B) * (2*(n-1)/n)`".
Fix. Add `allreduceBytes: { repo: 'NVIDIA/nccl-tests', ref: 'v2.21.1', path: 'doc/PERFORMANCE.md', lines: 'L50-L59', read: READ },` to `code`, and replace L171 with:
`<strong>allreduce</strong>. Each rank moves at least 2 × model_size × (N-1)/N per step{' '}<SourceRef provenance="code-derived" code={code.allreduceBytes} />.`

**C6. L215-216, rigor (low): "The multi-path routing of SRD handles asymmetric traffic well" is evaluative and uncited.** The SRD section sources spraying across 64 paths, but no source on the page or in the dive says anything about asymmetric traffic.
Fix. Delete that sentence. Change "EFA also supports GPUDirect Async" to "EFA supports GPUDirect Async". Move the expansion to L359: "SRD (Scalable Reliable Datagram) already provides reliability in hardware".

**C7. L439-443, rigor (low): the nouveau steps are uncited, and the method differs from AWS's.** [Tier 1: efa-start-nccl.html, fetched] gives these steps: add nouveau to `/etc/modprobe.d/blacklist.conf`, append `GRUB_CMDLINE_LINUX="rdblacklist=nouveau"`, rebuild the GRUB configuration, and reboot.
Fix. Replace the Alert body with:
`<strong>nouveau driver:</strong> disable it before installing the NVIDIA driver. Add <code>blacklist nouveau</code> to <code>/etc/modprobe.d/blacklist.conf</code>, add <code>rdblacklist=nouveau</code> to <code>GRUB_CMDLINE_LINUX</code>, rebuild the GRUB configuration and reboot{' '}<SourceRef provenance="documented" doc={docs.efaNccl} />.`

**C8. L358-366, accuracy and rigor (low): "NCCL uses RDM endpoints" names the wrong layer, and "Those semantics carry overhead, and they are the ones NCCL expects" is uncited.** The plugin requests the endpoint type: aws-ofi-nccl v1.22.0 `src/nccl_ofi_rdma.cpp` L7083, `hints->ep_attr->type = FI_EP_RDM;` (fetched).
Fix. Add `rdmHint: plugin('src/nccl_ofi_rdma.cpp', 'L7083'),` and replace "NCCL uses RDM endpoints." with:
`the plugin opens RDM endpoints{' '}<SourceRef provenance="code-derived" code={code.rdmHint} />.`
Then delete "Those semantics carry overhead, and they are the ones NCCL expects."

**C9. L183-185, rigor (low): the StatusIndicator "EFA critical: allreduce is the bottleneck" is stronger than the column's own caveat** (L178-181: "ignores ... overlap with compute").
Fix. Change it to `EFA critical: every step's gradient allreduce crosses the fabric`.

**C10. L349-352, economy (low): "Install steps, including GDRCopy, are AWS-documented" repeats the Prerequisites GDRCopy Alert** (L427-428, the same `efaNccl` citation). It also uses narration-style attribution.
Fix. Delete the Box at L349-352.

**C11. L429-432, rigor and voice (low): "enabled by the EFA kernel driver" is uncited, and "so this page quotes none" describes the page rather than the system.**
Fix. Change L429-432 to:
`GPUDirect RDMA is a separate mechanism, and without it the plugin offers NCCL host buffers only{' '}<SourceRef provenance="code-derived" code={code.ptrSupport} />. The guide names no minimum GDRCopy version.`
`ptrSupport`, interface_nvidia.cpp L95-98 (fetched), bears the host-only fallback.

**C12. L232-233, rigor (low): "Modern large model training combines all strategies" is a broad, uncited claim on the section's key layout decision.** Narayanan et al. (above) bear the 3D layout: "pipeline parallelism across multi-GPU servers, tensor parallelism within a multi-GPU server, and data parallelism".
Fix. Replace with:
`Large-model training combines these strategies, and a common layout keeps TP within a node (NVLink) and runs PP + DP (Data Parallelism) across nodes (EFA){' '}<SourceRef provenance="documented" doc={docs.megatronGpu} label="tier 3: paper" />.`

---

## Backlog (carried, out of Gate 3 scope)

- A rendered hybrid-layout diagram: TP on NVLink inside a node, PP and DP across EFA. This is the main lever for mental model 5.
- Land the 2.2 s against 70 ms DP figure a second time in the scaling container (rule 9). C4 lands the 58-of-64 figure; this one is still single-use.
- A "why it matters for MoE" sentence for GPUDirect Async, only if a source ties GIN/GDAKI to all-to-all.

## Sources consulted in this re-score, by tier

- **Tier 1 (first-party docs and pinned source):**
  - EC2 User Guide, "Get started with EFA and NCCL" (efa-start-nccl.html).
  - AWS Neuron "What is Neuron Collective Communication?" (latest tree, Neuron 2.33.0 banner).
  - NVIDIA Fabric Manager User Guide, revision 2.6.
  - aws/aws-ofi-nccl v1.22.0: `src/tuner/nccl_ofi_tuner.cpp`, `src/nccl_ofi_rdma.cpp`, `src/platform-aws.cpp`, `src/nccl_ofi_interface_nvidia.cpp`, `src/nccl_ofi_interface_neuron.cpp`, `src/nccl_ofi_net.cpp`, `src/rdma/gin/nccl_ofi_gin_gdaki.cpp`, `include/nccl_ofi_param.h`, `doc/efa-env-var.md`, `configure.ac`.
  - ofiwg/libfabric v2.7.0: `prov/efa/src/efa_domain.c`, `fi_ext_efa.h`, `efa_prov_info.c`, `efa_hmem.c`, `rdm/efa_rdm_rma.c`, `rdm/efa_rdm_ope.c`.
  - NVIDIA/nccl-tests v2.21.1 `doc/PERFORMANCE.md`.
  - GitHub releases API for aws-ofi-nccl release dates.
- **Tier 3 (papers):**
  - Shoeybi et al., arXiv:1909.08053.
  - Narayanan et al., arXiv:2104.04473.
  - Both read via ar5iv on 2026-10-23.
- **Reused from earlier logs, not re-fetched:**
  - Trn1n, Trn2 and UltraServer figures: `02-instances-pricing.md` O-08, CORRECT.
  - CC cores: `factcheck-FC4.md` T3, HOLDS.
  - NVLink 900 and 1,800 GB/s: `factcheck-FC8.md` N-4, HOLDS. That log notes NVIDIA states the figure as bidirectional.

STATUS: COMPLETE
