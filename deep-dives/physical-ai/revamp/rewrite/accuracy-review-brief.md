# Accuracy review of rewritten sections (Physical AI deep dive)

You check accuracy only. Style is not your concern. Repository root is your working directory's worktree; the
dive is `deep-dives/physical-ai/`. Never put personal data (names, email addresses, account ids) in any request,
header, User-Agent, URL or query string. No web requests are needed: check against the registers in the
repository. Do not edit any file except your review file. No git write commands. Do not run `pnpm build`.

The sections named in your task were rewritten for prose quality. A rewrite may NOT: introduce a claim with no
register entry; change a number; change which register entry a citation points at so that the entry no longer
supports the sentence; drop or widen a scope or date qualifier ("the pages read on 2026-11-20 document no ...",
"single run", "illustration", "the shipped task picks the cube up"); turn a vendor's or author's own figure into
a plain fact (its owner must stay in the sentence: "NVIDIA reports", "the authors report"); state our own
derivation as a sourced fact; print a dollar figure.

## Inputs

- The rewritten section source: `src/sections/<Comp>.tsx` (the task gives the names). Citations are
  `<Cite id="F0x-nn">label</Cite>`, figures carry `cites="..."`, `<Toy>` marks an invented illustration and
  `<Derived>` marks our arithmetic.
- The rendered text before the rewrite: `/tmp/pai-text-before/<nn>-<id>.txt`. The rendered text after: the task
  gives the path. Use the pair to see what changed.
- The registers: `research/2026-11/*.md`. Find an entry by its ID (for example `F02-17`). Read the claim, the
  verbatim quote, "Use in dive", and any "Wave 2" or "Wave 3" line under it: a correction there overrides the
  claim sentence. `src/data/registry.json` maps every ID to its source, tier and provenance.
- `git diff 9957515 -- deep-dives/physical-ai/src/sections/<Comp>.tsx` shows the exact change.

## Method

For each section: go through the rewritten text sentence by sentence. For every factual claim, number, date,
version, quote, and qualifier: find the citation in the same block, open the register entry, and confirm the
entry supports the sentence as written (the number, the unit, the subject, the scope, the owner). Check
arithmetic by redoing it. Check every sentence that is new or materially reworded against the before text: is
anything now claimed that was not claimed before, and does an entry support it? Check that uncited general
statements are either common computing knowledge the dive's reader has, a consequence the text derives in view,
or supported by an entry cited elsewhere in the section. Check cross-references to other sections: does the
section named contain what the sentence says it contains (titles in `revamp/tools/sections.json`; other sections'
sources are in `src/sections/`)?

## Output

Write to the output path the task gives you, as you go. One part per section. For each finding: severity
(`error`: wrong, unsupported, or a qualifier lost; `minor`: imprecise but not misleading), the sentence quoted
exactly, the register ID, what the entry says, and the fix in one line. End each section with the count of claims
checked and the count of findings. If a section has none, say "no findings" and list what you checked.

Final message: per section, the counts and the one-line statement of each `error`, at most 250 words.
