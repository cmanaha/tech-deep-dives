# Portfolio Verification — 2026-08-01

First portfolio-wide adversarial verification run. Scope: all three published deep
dives. Run under the code-is-the-authority rule.

Reports: P1 vLLM code provenance, P2 vLLM AWS facts, P3 silicon numbers,
P4 portfolio link rot and citation integrity, P5 verification harness design.
EFA-specific verification lives in `deep-dives/efa/research/2026-08-refresh/V1-V3`.

## Totals

- ~186 substantive claims independently checked (78 silicon, 88 vLLM AWS, 20 vLLM code)
- 258 unique URLs probed for link rot
- Every dive has real defects. The classes differ per dive.

## Per-dive verdict

**vLLM — strongest, and it proves the right pattern.** 17 of 20 code claims held at
the pinned SHA. Critically, `grep '\$[0-9]'` across all five AWS sections returns
zero matches: it routes every price to a first-party page instead of hard-coding
rates. That is exactly why the EFA pricing failure did not reproduce here, and it
should become a portfolio rule.

Two flat refutations to fix: `CodebaseScheduler.tsx:349` says the free-queue tail is
least-recently-used, which is backwards and self-contradicts its own next clause;
and `CodebaseConfig.tsx:72` calls CompilationConfig the "single largest config file"
when it is 1,525 lines against vllm.py's 2,264, contradicting a row in the same table.

13 stale service-behaviour claims, worst being an inverted architecture
recommendation: it says Karpenter cannot create cluster placement groups and
therefore recommends managed node groups instead, but Karpenter v1.14 has
`spec.placementGroupSelector`, GA, no feature gate. Also, it marks SageMaker
vLLM metrics as unavailable and `[SPECULATIVE]`; AWS shipped first-party inference
observability on 2026-06-18, eleven days after the section was written.

Drift: 2,093 commits in 56 days between the pin and HEAD; `vllm/` grew 20% in files
and lines. No architectural claim became false, but every quoted line count is now
off by 5 to 57%.

**silicon-memory-inference — worst of the three.** Of 78 claims: 11 REFUTED,
26 UNSOURCEABLE, 12 PARTLY-CORRECT, only 29 CONFIRMED.

The B300 MIG row is fabricated; NVIDIA publishes no B300 profile table. The KV-cache
derivation is refuted by the formula printed two lines above it (2.68 GB, not "about
5 GB"; batch 32 is 86 GB, not 160 GB, which inverts the "exceeds H200's 141 GB"
conclusion). "First formally verified cloud hypervisor" is refuted by AWS's own page
and contradicts the dive two lines earlier; its 250,000 Isabelle lines appear in no
AWS source. ChipletAndInterconnect's single link does not contain the four figures
attached to it.

Two systematic measurement errors: sparse FLOPS published as dense (NVIDIA marks the
qualifier with an explicit asterisk), and NVLink bidirectional aggregates presented
as one-way (1.8 TB/s is bidirectional; one-way is 900 GB/s), which makes a downstream
latency claim fail at the top of its own stated range.

**EFA — already scheduled for rewrite**, but one new finding matters: its most-cited
source is a Tier 3 personal blog carrying 12 of 70 fact-check entries, including
every core SRD latency number. And zero `href=` exist in any EFA section file, so the
fact-check register is the only citation mechanism and the reader never sees it.

## Portfolio-wide mechanical findings

- **10 dead URLs**: 6 in efa, 3 in silicon, 1 in vLLM. All six efa dead links sit
  inside the 11-source gap where `sources.md` trails the app.
- **28 tier mislabels, all in silicon.** Worst: a Jetson Orin Nano datasheet labelled
  Tier 1 official-docs while hosted on an Iranian reseller mirror, which both the
  title and `sources.md` admit is a mirror. 17 vendor marketing pages at Tier 1,
  including bare homepages.
- **Cross-dive contradiction**: `aws.amazon.com/hpc/efa/` is Tier 2 in efa and
  Tier 1 in silicon.
- **24 prose URLs in silicon are never declared** in its sources array, so they carry
  no tier and no access date.
- **vLLM has no `sources.md` at all**, violating the per-dive contract in CLAUDE.md.

## Two new error classes worth gating

1. **Self-contradiction within a section.** Several of the worst errors contradict
   text two lines away or a cell in their own table. This is mechanically detectable
   and cheap.
2. **Citation-number mismatch** — the linked source does not contain the number
   attached to it. This alone would have caught two silicon errors.

## Harness design (P5)

Nine verifier lenses plus a mandatory re-attack wave, justified by the fact that two
of the EFA pass's own corrections were themselves wrong. Key structural proposal: a
**Tier 1.5** layer, deterministic and networked but LLM-free, because pinned-SHA
re-fetch and price re-derivation are fully deterministic yet need the network, which
`ci.sh` excludes by its own header. That layer is the highest value per dollar and is
the one that would have caught the pricing drift at zero token cost.

Pushback the design makes, and I agree with it: access-date staleness must NOT be a
`ci.sh` gate, because a verdict that changes with the wall clock on an unchanged tree
breaks ADR-004's determinism contract. It becomes a scheduler input instead.

Also: gates must be per-dive opt-in via a config file, because applying them
repo-wide today fails all three dives at once. That is a wall, not a ratchet.

## Open decisions

1. **ADR number collision.** `section-architecture.md` claims `0005` for citation
   architecture; the harness design also claims `0005`. Recommend verification takes
   0005 and citation architecture moves to 0006. Needs Carlos's call.
2. Whether to fix vLLM and silicon now or land the EFA revamp first.
3. `VERIFICATION-SUMMARY.md` from the EFA pass is already a labelled eval corpus:
   roughly 20 positives, 7 confirmed negatives for false-positive rate, and the 2
   wrong-corrections as a trap set. Worth building the agents against it before the
   revamp overwrites its own evidence.
