# Wave 2 brief: refutation pass and gap fill (shared by all six agents)

Date of this pass and accessed date for every source you fetch: **2026-10-31**.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/training`. Dive:
`deep-dives/llm-training-systems/`. You own exactly one output file, named in your task, under
`deep-dives/llm-training-systems/research/2026-10/`. Edit nothing else: not `SCOPE.md`, not the
registers, not `RESEARCH-GUIDE.md`, not another agent's file, nothing in other dives. The
orchestrator applies your verdicts to the scope. Run no git command that changes state (no commit,
add, stash, checkout, reset). Do not ssh anywhere and run no experiment. Do not start subagents.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header,
User-Agent, URL or query string.** If a site demands a contact address (SEC EDGAR, some APIs), use a
Wayback copy or skip the source.

## Purpose

Gate 1, checks 2 and 3 (`RESEARCH-GUIDE.md` section 7). Every number in the scope's thesis and in the
section paragraphs you are assigned gets a verdict against its primary source at the pinned version.
The aim is to refute: look for the reading under which the scope's sentence is false, too broad, or
attached to the wrong model, accelerator, sequence length, batch, precision, version or condition.
SCOPE.md is v2: three reviewers read v1 and their fixes were applied, and no one has read the changed
sentences since. Treat every sentence as unchecked unless R2 matched it verbatim.

## Inputs

1. `CLAUDE.md` at the repo root: "Fact-Checking & Sources Standard", the tier ladder, and "Section
   Shape" (hedges keep their scope).
2. `deep-dives/efa/revamp/source-authority-standard.md` (code over docs over blogs; vendor claims stay
   labelled).
3. `deep-dives/llm-training-systems/SCOPE.md`: the thesis and your assigned sections.
4. `deep-dives/llm-training-systems/RESEARCH-GUIDE.md`: section 2 (wave 2 questions), section 4
   (evidence bar per claim type), section 6 (UNKNOWN register with the approved triage).
5. The register rows each sentence cites, in `research/2026-10/0N-*.md`, and the worked-numbers
   sections ("01 W7", "02 section 3.2"). Each row carries the pinned source and a verbatim quote.
6. `reviews/2026-10/R2-factual-grounding.md`: 46 claims already checked at the primary source on
   2026-10-30. For a number R2 matched with a verbatim quote, you may carry that verdict (write
   "HOLDS (R2 #n, quote matched 2026-10-30)") without re-fetching, unless the scope's current wording
   adds a condition R2 did not check. Spot re-fetch at least two of them.
7. `reviews/2026-10/R1-newcomer.md` and `R3-outcome-fit.md` for the reasons behind v2's edits.

## Method

- Fetch the primary source at the pinned version: `arxiv.org/abs/<id>vN` or `arxiv.org/html/<id>vN`
  (the export API rate-limits; always pin vN; a paper's HTML may lack tables, then use
  `arxiv.org/pdf/<id>vN`), GitHub code at the tag or 40-character SHA the register names (`gh api`
  or `raw.githubusercontent.com/<org>/<repo>/<tag>/<path>`, never `main`), first-party docs pages
  (docs.aws.amazon.com, docs.pytorch.org, docs.nvidia.com, awsdocs-neuron), AWS Price List offer
  files for prices.
- One row per number (or per numeric claim when several numbers share one sentence and one source).
  Also check the non-numeric load-bearing assertions in your sections where a register row is the
  only support (a default value, a maturity label, a status such as "generally available since", a
  named mechanism, "not located").
- Recompute every `[derived]` figure and show the arithmetic in the row. A derived figure that does
  not reproduce within rounding is WRONG.
- Verdicts:
  - **HOLDS**: the source says it, with the scope's conditions.
  - **SCOPE NARROWER**: the source says it only under a condition the scope drops (model, accelerator,
    sequence length, batch, precision, version, "vendor claim", "preprint", "estimated"). Give the
    re-hedged replacement sentence.
  - **WRONG**: the source contradicts it, or the number is not there, or the arithmetic does not
    reproduce. Give the corrected replacement sentence and the quote.
  - **UNVERIFIABLE**: the source cannot be fetched or does not resolve. Say what you tried. The
    orchestrator decides whether the claim ships.
- Watch for: a figure from v1 of a paper where vN changed it; a peer-reviewed label without a venue on
  the arXiv record or the venue's page; a default that moved between the register's tag and a newer
  one; a vendor claim written as fact; a cross-model comparison written as same-model; GB against GiB;
  dense against sparse peaks.
- Replacement text follows the repo's writing rules: no em-dash or en-dash characters, straight quotes,
  none of the banned vocabulary in CLAUDE.md, declarative sentences.

## Output file format (write to disk as you go; sessions can stop without warning)

```markdown
# Wave 2 refutation: <area>

**Date:** 2026-10-31. **Agent:** W<n>. **Sections:** <list>. **Sources fetched:** <count>.

## Verdicts

| # | Scope location | Claim as written (short) | Register | Source (pinned URL) | Verdict | Quote or arithmetic | Replacement text (for SCOPE NARROWER / WRONG) |
|---|---|---|---|---|---|---|---|

## Gap-fill findings

### G<n>. <question> (RESEARCH-GUIDE wave 2 question / UNKNOWN Uxx-y)
- Finding, with pinned URL, tier, verbatim quote.
- New register-style entry if it adds a claim the dive can use (claim, location, evidence, tier,
  use in dive).

## UNKNOWN results

| ID | Result (closed / narrowed / accept-as-hedge / cut) | Evidence (pinned URL, quote) | Text the page should carry |
|---|---|---|---|

## Summary
Counts per verdict; the WRONG and SCOPE NARROWER items in one line each.
```

Write the header and the first rows within your first few fetches, then append. Keep quotes verbatim
(render em-dashes as " - " and curly quotes as straight quotes, as the registers do). Use row IDs
`W<n>-<k>` so the orchestrator can cite them.

## Budget

At most 70 fetches. Return to the orchestrator at most 150 words: counts per verdict, each WRONG item
in one line, and which UNKNOWNs you closed.

## Assignments

- **W1, `wave2-step-maths.md`.** The thesis's arithmetic and sections 1 to 6 (register 01). Recompute
  every [derived] figure (6ND for 405B, the 30.84M GPU-hours ratio, 128.5 GB, 36.5 GB, 4.2 GB logits,
  3.95e14 FLOPs per 8K sequence, the 297,000 H100-hours and 48 days, attention shares 12.5% and 22%,
  57K and 29K crossovers, the 7% embedding overstatement, 2.9 and 1.6 times, 1,870 tokens per
  parameter, 1,128.9 GB and about 1,270 GB, 148,500 FP8 hours). Close U01-6 (fused cross-entropy that
  avoids FP32 logits: Transformer Engine v2.21.0 and Megatron Core core_v0.20.0 code), U01-7 (the OCP
  Microscaling spec v1.0 itself), U01-12 (optimizer state layouts in code: bitsandbytes 8-bit Adam,
  Megatron Core optimizer, Muon). Wave 2 half of U01-5: does any first-party source publish achieved
  MFU for dense Llama-class training on B200, H200 or Trainium2 (MLPerf Training results pages,
  NVIDIA or AWS performance pages)?
- **W2, `wave2-parallelism.md`.** Sections 7 to 14 (register 02). Recompute both worked examples of
  02 section 3.2 (70B on 256 H100, both layouts) and section 8's 8B example (373, 24, 156, 3 GB and
  the factors 15 and 50; 498 GB with FP32 reduce). Independently recompute section 14's second worked
  example, Llama 3.1 70B on four p5en.48xlarge (32 H200, 141 GB): ZeRO-1 and ZeRO-2 at 308.7 and
  172.0 GB, flat FSDP 32's 70% EFA share, HSDP's 141.1 GB, TP 8 x DP 4 with ZeRO-1 at about 85 GB
  (103 GB with FP32 gradients), TP 8 x PP 2 x DP 2 at about 67 GB. Close U02-1 (DDP default bucket
  size in `torch/nn/parallel/distributed.py` at v2.15.0), U02-2 (Ulysses head bound and GQA handling
  in `deepspeed/sequence/layer.py` at v0.19.9), U02-5 (TorchTitan benchmark sequence length and
  default degrees at v0.4.0), U02-13 (FSDP hybrid-sharding cross-host formula, 2304.11277v2 Sec
  3.2.2), U02-14 (peer-reviewed parallelism planners or simulators that could cross-check Calculator
  C). Also: which frameworks support uneven first and last pipeline stages and under which settings
  (Megatron Core core_v0.20.0, TorchTitan v0.4.0, DeepSpeed v0.19.9), and how DeepSeek-V3 split 61
  layers across 16 stages; whether launchers other than Megatron Core (torchrun with TorchTitan's
  device mesh, DeepSpeed) number ranks so consecutive ranks share an instance.
- **W3, `wave2-frameworks.md`.** Sections 15, 16 and 27 (register 03). Re-check every maturity label
  and every default against the tag. Close U03-3 (loading a `dp_reshardable` Megatron checkpoint under
  new TP or PP: `distrib_optimizer.py` load path at core_v0.20.0), U03-6 (Zero Bubble or DualPipe-style
  overlap in Megatron Core: `combined_1f1b.py` and the MoE README at core_v0.20.0), U03-7 (frameworks
  installed in the AWS PyTorch training DLC and the Neuron 2.33 DLAMI), and the wave 2 half of U03-4
  (TorchTitan Neuron throughput, PP, 70B and Trn3 MXFP8 from the fork's tests, CI and docs at
  release-2.33.0 or its tag).
- **W4, `wave2-reliability.md`.** Sections 17, 18, 19 and 23 (register 04). Recompute 04 W1 to W3 and
  W5 (MTTF bands, Young-Daly intervals 2.0 h and 21.5 min, ETTR 0.982, 0.996, 0.79, 0.88, 0.93,
  16.5 GB/s, 16.5 TiB and about $10,000 a month, 1 MB/s and 11 MB/s). Close U04-1 (Llama 3 Table 5:
  compare 2407.21783v1 and v3 for "148" against "30.1%"), U04-4 (read the `amzn-sagemaker-checkpointing`
  1.1.3 wheel from PyPI: does it require a CPU backend in the process group, and does AWS's tiered
  checkpointing example pass one), U04-5 (NCCL run-to-run determinism in NCCL's own documentation at
  a pinned release), U04-7 (FSx for Lustre "MBps": decimal or binary, and burst behaviour, from the
  FSx performance pages), U04-8 (s3torchconnector multipart part size at v1.5.0), U04-11 (venue and
  year for MegaScale and the ByteDance straggler study, from USENIX program pages).
- **W5, `wave2-aws.md`.** Sections 20, 21, 22, 24, 25, 26 and 28 (registers 05 and 06). Re-read every
  price on its offer file or pricing page and every status line on its page; recompute every [derived]
  dollar figure ($47.757, ratios 0.998x and 0.443x, $3.14, $3.35, $4.23, $6.03 per PFLOP-hour, $30.7M,
  $26.6M, 91 days, $15,165, $60,870, $60,942, $8,454 per day, $253,624, 1.64, 0.93 and 0.68 nodes).
  Close U05-3 (trn2.48xlarge On-Demand on EC2 in any Region: filter the EC2 offer files), U05-4
  (managed Spot pricing for training jobs), U05-6 (EFA and aws-ofi-nccl versions in the PyTorch 2.14
  training DLC), U06-1 (HyperPod Slurm auto-resume "more than 16 nodes"), U06-3 (SMP v2 with SDK v3
  `ModelTrainer`), U06-4 (training-job resiliency outside Spot and plans; the Trainium training-job
  tutorial), U06-7 (Batch on EKS GPU health and EFA for multi-node parallel jobs), U06-8 (launch date
  of Batch service jobs for SageMaker), U06-9 (EKS Best Practices AI/ML section contents), U06-10 (a
  PCS AMI with the Neuron stack), U06-11 (HyperPod deep health checks on Trainium), U06-12 (launch
  dates of HyperPod features, from AWS What's New). Also: what each AWS path documents about the NCCL
  and EFA versions it pins (HyperPod DLAMI, PCS-ready DLAMI, training-job DLCs, EKS-optimized
  accelerated AMI), so section 31's bring-up can name them.
- **W6, `wave2-observability.md`.** Sections 29, 30 and 31 (register 07). Re-read the PyTorch defaults
  of T07-5 to T07-11 in `ProcessGroupNCCL.hpp`, `ProcessGroupNCCL.cpp` and the flight recorder at
  v2.15.0 (timeout, heartbeat, dump on timeout, buffer size, the version that made dumping default).
  Recompute 07 W1 (8,200 and 935 tokens per second at 40% MFU; 4,000 tokens per second near 20%) and
  07 W2 (about 11 minutes and 6%). Close U07-3 (documentation half: the HyperPod observability
  add-on's metrics reference, does its default mode export the DCGM fields its own alerts use),
  U07-4 (is a single-node smoke run before scale-out a stated first-party practice: TorchTitan docs,
  the awsome-distributed-training README at a pinned SHA, the HyperPod recipes README at 2.0.11),
  U07-5 (which breakdowns Holistic Trace Analysis v0.6.1 computes, `hta/trace_analysis.py` at its
  tag), U07-6 (recommended Nsight Systems and `NCCL_DEBUG` settings and their overhead, NCCL
  environment variables page at a pinned NCCL version and the Nsight Systems user guide), U07-8
  (Neuron counterparts to the NCCL watchdog and flight recorder in Neuron 2.33 documentation).
