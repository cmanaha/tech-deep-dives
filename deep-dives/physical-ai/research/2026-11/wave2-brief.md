# Wave 2 brief: refutation and freshness pass (shared by the three agents)

Date of this pass and accessed date for every source you fetch: **2026-11-20**.

Repo root: `<repo root>` (a git worktree, branch
`deep-dive/physical-ai`). Dive: `deep-dives/physical-ai/`. You own exactly ONE output file, named in your task, under
`deep-dives/physical-ai/research/2026-11/`. Edit nothing else: not `SCOPE.md`, not the registers, not another agent's
file. Do not commit or run git write commands. The orchestrator applies your verdicts.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header, User-Agent, URL or
query string.** If a site demands a contact address, use another copy of the source or skip it. Any subagent you
start gets this rule verbatim.

**Forbidden:** AWS API calls, SSH, installs, running benchmarks, messages to anyone, writing outside your file. Web
access is read-only. Downloads go in a fresh directory under `/tmp`; execute nothing downloaded.

**Naming:** the dive is "Physical AI". A conference session code (the letters C-M-P followed by 407) appears in the
seed research; it must never appear in your file.

## Purpose

Gate 1, checks 2 and 4 (`RESEARCH-GUIDE.md` section 7). You did not write the registers you check. Your aim is to
**refute**: for each load-bearing claim, find the reading under which the register's sentence is false, too broad,
out of date, or attached to the wrong model, version, device, benchmark or condition. A claim you could not break,
after fetching its source yourself, HOLDS.

The owner's rule: nothing stale. "I don't want to say shit that is like three years old." Today is 2026-11-20 and
your own memory of this field is out of date. Check currency by fetching, never by recall.

## Inputs

1. `CLAUDE.md` at the repo root: "Fact-Checking & Sources Standard" and the tier ladder.
2. `deep-dives/physical-ai/research/2026-11/wave1-brief.md`: the rules the registers were written under.
3. Your three registers (named in your task): header, currency table, pinned sources, every entry.
4. `deep-dives/physical-ai/SCOPE.md`: the sections your registers feed, to judge what is load-bearing.

## What is load-bearing

Every entry that carries a number, a version, a date, a default value, a named capability or limit ("supports",
"requires", "does not support"), a comparison, or a mechanism the section will teach. Skip only pure definitions of
common terms. Expect 50 to 80 rows per register; if a register is larger, check every currency-table row, every
entry with a number, and sample the rest, and say what you skipped.

## Method

- **Fetch the primary source yourself at the pinned version.** arXiv: `https://arxiv.org/pdf/<id>vN` (curl to a
  fresh /tmp directory, `pdftotext`) or `https://arxiv.org/html/<id>vN`; also open `https://arxiv.org/abs/<id>` to
  see whether a later version exists and whether the number changed in it. GitHub: raw files at the tag or
  40-character SHA the register names (`https://raw.githubusercontent.com/<o>/<r>/<sha>/<path>`), and
  `gh api repos/<o>/<r>/releases?per_page=5` for currency. Docs: the page itself.
- **Find the quote.** Search the fetched text for the register's verbatim quote. A quote that is not in the source
  is WRONG (or SCOPE NARROWER if the source says something weaker), whatever the claim's plausibility.
- **Check currency, for every version the register names:** is there a newer first-party release as of 2026-11-20?
  Fetch the releases page, PyPI, the model hub organisation page, the vendor's docs or the AWS What's New feed. If
  yes, the verdict is STALE and you give the newer version, its date and URL, and say whether the claim's substance
  still holds for the newer version (if you can tell from the release notes).
- **Recompute every `[derived]` number** and show the arithmetic.
- **Watch for:** a figure from v1 of a paper that vN changed; "peer-reviewed" without a confirmed venue; a vendor
  claim written as fact; a comparison across publishers written as a like-for-like measurement; a claim about one
  model variant, device or resolution written as general; a documentation statement the code contradicts; a
  capability stated for a family that holds for only some sizes; an AWS feature whose page says preview, a subset of
  Regions, or a launch after the stated date; a source older than 2025 used as support for present practice without
  a history label.
- **Verdicts:**
  - **HOLDS**: the source says it, with the register's conditions, and it is current.
  - **SCOPE NARROWER**: the source says it only under a condition the register drops. Give the replacement sentence.
  - **WRONG**: the source contradicts it, or the number or quote is not there. Give the corrected sentence and quote.
  - **STALE**: superseded by a newer version, release or announcement. Give the newer item, date, URL and the
    replacement sentence.
  - **UNVERIFIABLE**: the source cannot be fetched or does not resolve. Say what you tried.

## Output file format (write to disk as you go; the process can stop without warning)

```markdown
# Wave 2 refutation and freshness: registers <NN, NN, NN>

**Date:** 2026-11-20. **Agent:** W2-<A|B|C>. **Registers:** <files>. **Sources fetched:** <count>.

## Verdicts: register NN

| # | Entry | Claim as written (short) | Source fetched (pinned URL) | Verdict | Quote found (verbatim) or what was found instead | Replacement text (SCOPE NARROWER / WRONG / STALE) |
|---|---|---|---|---|---|---|

(repeat per register)

## Currency checks

| Item | Register says | Newest found 2026-11-20 | Date | URL | Verdict |
|---|---|---|---|---|---|

## UNKNOWN triage proposals

| Register and ID | Proposed triage (close-by-research / close-by-experiment / accept-as-hedge / cut) | Evidence or reason | Hedge text the page should carry, if accepted |
|---|---|---|---|

## Summary
Counts per verdict per register; each WRONG and STALE item in one line; each SCOPE NARROWER in one line.
```

Write the header and the first rows within your first few fetches, then append after every few rows. Keep quotes
verbatim, with long dashes rendered as " - " and curly quotes as straight quotes. Do not use the em-dash or en-dash
character. Do not write `/blob/main/`, `/tree/main/` or the `master` forms of GitHub URLs: a repository gate fails
on them; cite the pinned SHA or tag.

## Budget

About 120 fetches. No subagents unless one question needs a long separate read. Return to the orchestrator at most
200 words: counts per verdict, each WRONG and STALE item in one line, and which UNKNOWNs you propose to close.
