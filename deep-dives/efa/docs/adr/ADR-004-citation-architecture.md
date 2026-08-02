# ADR-004: Provenance-Marked Inline Citations

Status: Accepted
Date: 2026-08-01
Related: ADR-002 (freshness verification), root ADR-0004 (two-tier quality gates)

Numbering note: this uses the EFA-local `ADR-00N` sequence, which runs 001 to 003.
It is deliberately not claiming a root `docs/adr/000N` number, because the
portfolio verification design also proposes `0005` and Carlos has not yet ruled
on which takes it. If this decision is promoted repo-wide, it should be
renumbered at that point.

## Context

The EFA deep dive had zero inline citations. It carried a 70-entry fact-check
register in `Sources.tsx`, but a reader in the prose saw no marker at the point
of claim and had to cross-reference by claim text. The register was therefore
invisible in practice.

Three consequences followed, all of which were measured:

1. 14 of 39 sources were orphans, referenced by no fact-check entry.
2. `sources.md` drifted 11 entries behind the app, and all six of the dive's
   dead URLs sat inside that gap.
3. The shared `SourceCitation` component, built for exactly this job, was
   imported by no deep dive at all. Its `id` prop coupled prose to a numeric
   registry, and that coupling is what let the registry and the prose diverge.

A separate and worse problem surfaced during the 2026-08 research pass. The
dive's most distinctive claims came from reading driver and library source, not
from documentation. Some were wrong, and the errors were invisible because
code-derived inference was written in the same voice as documented fact. The
clearest case: the dive stated that RDMA read and write are emulated in software
by the libfabric EFA provider. That traced to `SRD.txt`, an unmaintained 2019
spec document inside `amzn-drivers` whose own repository's code contradicts it.

## Decision

Adopt inline, provenance-marked citations. Every load-bearing claim carries a
marker that is visible without interaction and states which of four categories
it belongs to.

**A. Documented.** AWS states it. Evidence is a documentation URL plus an access
date and a tier.

**B. Code-confirmed.** AWS documents it and the implementation agrees. Both are
cited. This is the strongest category.

**C. Code-derived inference.** No AWS documentation states it; the claim comes
from reading the implementation. Evidence is repository, commit SHA or release
tag, file path, line, and the date read. The rendered page says plainly that
this is our inference and not an AWS statement.

**D. Documentation contradicts the code.** Both are cited, the code is treated as
authoritative, and the stale document is named.

Implemented as `SourceRef` in `shared/src/components/SourceRef.tsx`.

Code references pin to a commit SHA or a release tag, never a branch. A branch
reference cannot be re-verified, because the thing it points at changes. This is
enforced by the `pinned-refs` gate in `scripts/ci.sh`, which rejects `/blob/main/`
and `/tree/master/` style URLs.

## Why not revive SourceCitation

Its `id: number` prop is the defect, not an implementation detail. Coupling prose
to a numeric registry means the prose and the registry can drift, and in this
dive they did. `SourceRef` carries the citation inline, so a claim and its
evidence move together and cannot separate. The old component is left in place
and untouched rather than deleted, since it has no consumers and removing it is
not this ADR's business.

## What happens to the fact-check register

It survives, but its job changes. It is no longer the citation mechanism. It
becomes a bulk audit index: the thing a verification pass iterates over to
re-fetch every cited URL and every pinned file and confirm the quoted line still
says what we claim. That is a mechanical check, which is what makes ADR-002's
freshness verification implementable rather than aspirational.

## Consequences

Positive. A reader can falsify any claim from the rendered page without an
interaction. Category C makes the dive's most valuable and most fallible content
legible as inference. Category D turns documentation-versus-code contradictions
from a private annoyance into published content that documentation cannot offer.
Pinning makes every code citation mechanically re-verifiable.

Negative. Citation metadata is verbose and inflates section line counts
noticeably. Sections written under this standard came in at roughly double their
planned length, and a meaningful share of that is citation metadata rather than
prose.

Neutral. Two citation mechanisms now exist in the repo. The sibling vLLM dive
uses a plain inline link plus an access date, which is a reasonable pattern and
is why that dive hard-codes no prices. Converging the two is out of scope here.

## Alternatives considered

**Keep the fact-check register as the only mechanism.** Rejected: it was already
in place and produced a dive with zero visible citations, 14 orphan sources, and
a sources file 11 entries out of date.

**Copy the vLLM inline-link pattern exactly.** Rejected as insufficient rather
than wrong. It carries URL, tier and date well, but it has no way to say "this is
read out of source and AWS documents nothing", which is precisely the category
that produced this dive's published errors.

**Mark provenance in a comment rather than in the rendered output.** Rejected. The
reader is the one who needs to know whether a claim is documented or inferred. A
comment serves the author, not the audience.
