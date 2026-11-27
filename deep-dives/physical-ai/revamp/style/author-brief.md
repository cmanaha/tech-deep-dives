# Author brief: one section of the Physical AI dive in plain technical English

You rewrite the reader-facing prose of ONE section of the Physical AI deep dive. Work only in the folder
the repository root (the dive is `deep-dives/physical-ai/`).
Other authors are editing other sections in the same folder at the same time.

## Read first, all of it (nothing else is needed)

1. `docs/standards/plain-technical-english.md`: the rules.
2. `deep-dives/physical-ai/revamp/style/section-1-reference.md`: the model text, and the term table. Use the
   right-hand column of that table everywhere.
3. Your section file, in full, and your glossary file `deep-dives/physical-ai/revamp/glossary/<id>.json`.

Do not read other dives, the registers, old reviews or the retired style contract.

## The goal

The owner, Carlos: "All the sentences must be written in technical English where the language uses simple
constructions and terms to simplify the understanding. That doesn't mean we hide the technical complexity, but we
keep the language complexity low, building sentences that all have full meaning by themselves." The live text reads
like a page of maxims ("The part of the machine a job exhausts first picks its instance"), and a human technical
reader grades it about 2 out of 10. The reference text grades about 8. Your section must read like the reference on
the first write. It gets one review and no second round.

## What you change

- Every reader-facing sentence in your file: paragraphs, h2 and h3 titles and their descriptions, the h1
  description, captions, table headers and cells, list items, `ExpandableSection` headers, alert text, and the
  label and step strings of figures defined in your file.
- Block order inside the section where it helps; split long paragraphs; use a list for parallel items.
- Remove bookkeeping from the prose: "our reading", "our grouping", "our arithmetic", "(sources read 2026-11-20)",
  counts of sources read, sentences about the page itself. The `Cite` chip carries the source.
- Replace coined words with standard terms (the table in the reference). In particular "shape" becomes
  "workload type", and the five types are named Independent tasks, Long single-machine runs, Multi-node training,
  Always-on streams and Real-time on the robot.
- The definitions in your glossary file: plain sentences, the same terms.

## What you must not change

- The h1 title text `N. Title`, and any other section's title. Cross-references stay in the form
  "section N, Short Name", where the short name is the part of that section's title before the colon, as in
  `deep-dives/physical-ai/revamp/tools/sections.json`.
- Facts, numbers, units, formulas, the content of code and configuration snippets, the meaning of placeholders,
  media captures, how figures are built, section ids, imports. Every `<Cite id="...">` you keep stays attached to
  the same fact; you may move it to the end of the sentence that states the fact.
- No new facts. If a sentence would need a fact your section does not already contain, leave it out.
- Hedges keep their scope, in plain English. "The lists read on 2026-11-20 name no G-family type" becomes "As of
  November 2026, the lists name no G-family type." A vendor's or author's figure keeps its owner ("NVIDIA
  reports"). Our own measurements say once, plainly, that they are ours and single runs ("We measured ... in a
  single run").
- Any file other than your section file and your glossary file.

## JSX and the repository gates

- Keep the file's conventions for entities (`&apos;`, `&quot;`), straight quotes only, no em-dash (the character
  or `&mdash;`), no en-dash, no raw `<` or `>` in text (use `&lt;` and `&gt;`).
- Banned words: delve, tapestry, seamless, robust, leverage, boasts, underscores, pivotal, harness, unlock,
  supercharge, realm, landscape, testament, game-changer, cutting-edge, best-in-class.
- The file must still compile: balanced tags, every component still imported, nothing removed that the file still
  uses.
- Never run git commands that write (add, commit, stash, checkout, reset, restore), `pnpm install`, a build or a
  dev server.
- Never put personal data (names, email addresses, account ids) in any request, header, URL or query string.

## Work order

1. Read the inputs above.
2. Rewrite the file in place. Approach it hard on the first write.
3. Self-check. Read each sentence alone: does it carry its full meaning, use standard terms, make a person or a
   tool the subject of a decision, give the purpose before the step? No maxims, no fragments, no chains of glosses
   after a name. Then search your file for: `our reading`, `our arithmetic`, `sources read`, `shape`,
   `exhausts first`, `fills first`, `the part `, `market`, `beside the`, `taken back`, `Spot is open`,
   `Spot is closed`, `Nodes that talk`, `On the robot's clock`. Rewrite each hit unless it is a legitimate use.
4. One review. Start ONE fresh subagent (subagent_type `general-purpose`, run in the foreground, model `opus`) with
   this prompt, filled in: "Follow
   deep-dives/physical-ai/revamp/style/reviewer-brief.md.
   Section file: <absolute path of your section file>. Write your review to
   deep-dives/physical-ai/revamp/reviews/plain/<id>.md.
   Never put personal data in any request." Wait for it to finish.
5. Fix every finding that is right. If the score is below 8, fix all of them carefully. Do not run a second review.
6. Final message, at most 120 words: the reviewer's score, anything you could not resolve, and any fact you think
   may have drifted.
