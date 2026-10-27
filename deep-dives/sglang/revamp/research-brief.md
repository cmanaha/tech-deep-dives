# Research brief: SGLang deep dive at v0.5.22 (shared by every research agent)

Research date: **2026-10-24**. Use it as the accessed date on every citation.

## Pins

- SGLang tag `v0.5.22` = commit `baa9befa381511cd4d56f83980951e5a45fffc6d` (tag object `35ce3132`,
  released 2026-10-19). Source tree: `/tmp/sglang-src` (read-only; never run code from it).
- Release notes v0.5.16 to v0.5.22: `/tmp/sglang-release-notes/<tag>.md`.
- Pin evidence, repo scale and the code map: `deep-dives/sglang/research/2026-10/00-pin-and-map.md`.
  Read it first.
- Sibling dive: `deep-dives/vllm/` is pinned to vLLM `v0.31.0` (commit `db9527a4`). The SGLang reader
  already knows it. Where SGLang and vLLM differ, name the vLLM section that covers the vLLM side
  (section titles are in `deep-dives/vllm/src/App.tsx`) instead of re-explaining vLLM.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang`. You write only the one
research file named in your task, under `deep-dives/sglang/research/2026-10/`. Edit nothing else.

## Standards (read before you start)

- `deep-dives/efa/revamp/source-authority-standard.md`: code at a pinned ref is the authority;
  official docs second; code comments, docstrings and in-repo READMEs are orientation only; blogs
  are inspiration. Where code and docs disagree, code wins and the conflict is a finding worth
  publishing.
- `deep-dives/efa/revamp/section-shape-standard.md`: content earns its place by building a mental
  model or being practical to know. Use it to judge what deserves coverage.

## Your job

You are a RESEARCH agent for a NEW deep dive. There is no section text yet. Your register is the
fact base the authors will write from, so it lists the facts the dive should state, each verified.
Read the code at `/tmp/sglang-src` (grep, sed -n, wc -l) and the docs source under
`/tmp/sglang-src/docs/docs/`. Use the web only for facts outside the SGLang tree (AWS docs, papers,
project blogs, other repos).

Verify against code, not release notes or docs. Release notes and docs tell you where to look. A
default value, flag name, env var, class, function, file path, line range or behaviour gets checked
by opening the file at the tag. Cite the exact lines.

### Claim register format (mandatory)

One table per topic block, columns:

| # | Claim (short) | Location (file:line at v0.5.22) | Verdict | Evidence (pinned URL + tier) | Fact to ship (reader-ready wording) |

Verdicts, adapted for a new dive:
- **CORRECT**: a docs, blog, paper or release-note claim that the code at v0.5.22 confirms.
- **NEW**: a fact read from code (or docs where code cannot show it) that the dive should state.
- **STALE**: a widely repeated claim (docs page, paper, older blog, the vLLM dive's description of
  SGLang) that was true once and is not at v0.5.22. Give the v0.5.22 fact.
- **WRONG**: a claim that contradicts its own source or the code. Give the correct fact.
- **UNKNOWN**: you could not verify it. Say what you tried. An UNKNOWN does not ship as fact.

Add a column value or note **DOC-CODE** where documentation and code disagree; give both sides.

Evidence URLs:
- SGLang code: `https://github.com/sgl-project/sglang/blob/v0.5.22/<path>#L<a>-L<b>` (tag-pinned;
  paths from the repo root, e.g. `python/sglang/srt/managers/scheduler.py`). Never `/blob/main/` or
  `/tree/main/`. Line numbers from `/tmp/sglang-src`.
- SGLang docs: cite the tag-pinned source `https://github.com/sgl-project/sglang/blob/v0.5.22/docs/docs/<section>/<page>.mdx#L<a>-L<b>`
  and give the rendered page `https://docs.sglang.io/docs/<section>/<page>` as a second URL. The
  rendered site is unversioned.
- Other GitHub projects: pin to a release tag or commit SHA you resolved today with `gh api`.
- arXiv: use `https://arxiv.org/abs/<id>vN` or `https://arxiv.org/html/<id>vN`, always with the
  version (vN). The export API rate-limits; do not use it.
- Tier labels: Tier 1 = source code at a pinned ref, official docs, API reference, official release
  notes. Tier 2 = project or vendor blog, talk, product page (performance numbers there are vendor
  or project claims and are labelled as such). Tier 3 = third-party analysis (for example
  SemiAnalysis), papers, press. Tier 4 = tutorials, never cited as fact.
- A third-party source that states a fact a first-party source can confirm: cite the first-party
  source for the fact, keep the third-party one only for its opinion or analysis, attributed.

### Every register must also contain

1. **Mental models** for your area: 2 to 5 one-line models a reader can predict behaviour from, each
   tied to register rows.
2. **Practical knobs**: the flags, env vars, defaults and metrics a reader would set or watch, each
   with its default at v0.5.22 and the code line that sets it. Note defaults that differ from docs.
3. **Diagram candidates**: 1 to 3 diagrams that would carry a mental model better than prose. For
   each: what it asserts, the shape (sequence, timeline, tree, box-and-arrow), the labels, and the
   register rows that back every label or number.
4. **Codebase walk material**: for the "Inside the Codebase" tabs, an ordered reading path through
   your area's files at v0.5.22 (file, line range, what to look at, why it matters), 5 to 12 stops.
5. **Where SGLang differs from vLLM** in your area (design choice, not benchmark), with the vLLM
   dive section title that covers the vLLM side. Benchmark numbers only as attributed claims.
6. **Section recommendation**: the section(s) this material supports, what each should open with,
   and its likely depth tag (overview, mechanism, practical).

### Execution rules (a usage-limit stop can kill you at any moment)

- **Write incrementally.** Within your first three tool calls, create your register file with a
  header and empty topic tables. Each time you finish a topic block, write it to the file
  immediately (append with a Bash heredoc or rewrite with Write). Never hold more than one block
  only in memory. What is on disk must be usable if you are stopped.
- Be economical: batch checks into combined shell commands (one `grep -n` over several patterns,
  one `wc -l` over many files). Aim for well under 150 tool calls.
- You may run background subagents of your own; if you do, give them this brief's privacy rule and
  have them write to disk.

### Rules

- **Privacy: never put personal data (names, email addresses, account ids) in any request, header,
  User-Agent, URL or query string.** If a site demands a contact address (for example SEC EDGAR),
  use a Wayback Machine copy or skip the source.
- Preserve hedge scope. "Not found in `python/sglang/srt/mem_cache` at v0.5.22" is a finding; "does
  not exist" is a claim you can only make for the tree you searched, so name the tree and record
  the grep command.
- Do not cite a docstring, comment or README as proof of behaviour. Read the code it describes.
- Vendor and project performance numbers are claims. Record who claims them, where, and the
  conditions they state. Never restate one as a measurement.
- Keep the register factual and dense. No narrative of how you worked.
- Return to the orchestrator ONLY a summary of at most 250 words: row counts by verdict, the five
  facts most worth shipping, the strongest mental model, DOC-CODE conflicts found, and every
  UNKNOWN you could not resolve.
