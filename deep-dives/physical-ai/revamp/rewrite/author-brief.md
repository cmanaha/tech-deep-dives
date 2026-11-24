# Author brief: prose rewrite of one section (Physical AI dive)

You are rewriting the prose of ONE section of the Physical AI deep dive so it reads at the quality of the two
reference dives. You own the files your task names and nothing else. Work from the repository root (your
working directory is inside the worktree; the dive is `deep-dives/physical-ai/`).

## Hard rules

- Edit only: your section file in `src/sections/`, `revamp/claims/<id>.md`, `revamp/glossary/<id>.json`, and your
  report file. Not `App.tsx`, not other sections, not `src/components/`, `src/lib/`, the registers, the tools.
- No git write commands (the orchestrator commits). Never run `pnpm build` (it writes the shared `dist/`).
  No AWS API calls, no SSH, no messages. No web requests are needed; if you make one, never put personal data
  (names, email addresses, account ids) in any request, header, User-Agent, URL or query string, and give any
  subagent that rule verbatim.
- The talk this dive grew from has a session code (the letters C-M-P followed by the digits 4-0-7). It never
  appears in any file. No local paths, hostnames or personal data in any file: the repository is public.
- Save your section file to disk early and refine in place. The process can stop at any moment.

## Read, in this order

1. `deep-dives/physical-ai/revamp/style-contract.md`, all of it. It is the contract. Your section's row in its
   table is the claim you must prove; its title is already in your h1.
2. `CLAUDE.md` at the repo root (Writing Style, Section Shape, Explaining Concepts, Acronym Standard) and
   `docs/standards/explaining-concepts.md`.
3. `deep-dives/physical-ai/revamp/authoring-brief.md` sections 5 to 9: the mechanics (the `Cite` component, the
   citation check, `Toy` and `Derived`, figures, the gates, the check tool). Its prose guidance is superseded by
   the style contract.
4. The reference writing, end to end, as a reader sees it (rendered text): every file in `/tmp/pai-rw/ref/silicon/`
   and `/tmp/pai-rw/ref/rl/`. Read them for how they open, how a number is delivered, how a term is built, how a
   section ends. They are the bar.
5. Your section as it is now: the source file, and its rendered text in `/tmp/pai-text-before/<nn>-<id>.txt`.
6. Your section's register entries: `revamp/claims/<id>.md` lists claim and register ID; the entries are in
   `research/2026-11/*.md` (search for the ID). Read each entry you cite or want to cite: the claim, the verbatim
   quote, "Use in dive", and any "Wave 2" or "Wave 3" line under it (a correction there overrides the claim).
   Read the register's "Teaching material" and "Mental models" parts for your section: that is where level 400
   depth comes from.
7. The sections yours leans on or feeds (your task names them), so terms are built once and nothing contradicts.

## What the rewrite is

Rewrite the argument and the sentences. Keep the depth and add to it: the reader starts at level 100 to 200 and
must leave at level 400 (mechanism, numbers, failure modes, configuration choices and why). This is neither a
cut nor a simplification. Where the section stops at a description, deepen it from the registers.

You may change: every word of prose, the h1 description, h2 and h3 titles and descriptions, captions, panel
headers, the order of blocks, what sits in an `ExpandableSection`, splitting and merging blocks, cutting text that
earns nothing, a figure's labels or caption (small changes), removing a figure that only decorates.

You may not change: a fact or number; which register entry a citation points at; a scope or date qualifier
(never drop or widen one); a vendor's or author's figure into a plain fact; a placeholder's meaning; the section
id; the h1 title text (propose a better one in your report if you have it); a formula's content; a media
capture; a configuration snippet's content; a figure's drawing (no rebuilds). No claim without a register entry.
If level 400 needs a fact the registers lack, leave it out and name it in your report.

Keep the dive's lens: the SO-101 arm, the block-in-cup thread task (wording from `src/lib/task.ts`), the loop,
the fifteen workloads, the machine parts and the five shapes. They are the argument, not a list to walk.

## Verify

Use the slug and port your task gives you.

```bash
cd deep-dives/physical-ai
npx vite build --outDir /tmp/pai-dist-<slug> --emptyOutDir
node revamp/tools/check-section.mjs --dist /tmp/pai-dist-<slug> --port <port> --out /tmp/pai-shots-<slug> --sections <id>
cd ../.. && pnpm --filter @tech-deep-dives/physical-ai typecheck && pnpm --filter @tech-deep-dives/physical-ai lint
bash scripts/gates/no-ai-tells.sh; bash scripts/gates/svg-a11y.sh; bash scripts/gates/pre-overflow.sh; bash scripts/gates/pinned-refs.sh
node deep-dives/physical-ai/revamp/tools/check-renumber.mjs
```

The check tool must print no finding for your section at 1440 and 390 (citations resolve, every number appears
in the entry cited in its block, no overflow, no console error). If you touched a figure's labels or caption, or
moved a figure, read its PNG at both widths. Errors in files other authors are editing are not yours.

Then run the style contract's section 11 self-check honestly, including the search for banned phrases. Read your
rendered section top to bottom once as the level 100 reader and once as an expert, and fix what you find.

Update `revamp/claims/<id>.md` (one line per factual claim: `claim | register ID`) and `revamp/glossary/<id>.json`
to match the new text.

## Report

Write `/tmp/pai-rw/reports/<id>.md` (at most 300 words): the claim the section now proves and its anchor number;
what you deepened and from which entries; anything in the contract's row for your section that the registers do
not support; any register entry you think is wrong or missing; cross-references to other sections whose claim
you relied on; the last line of the check tool at each width; the last lines of typecheck and lint. Return the
same text as your final message.
