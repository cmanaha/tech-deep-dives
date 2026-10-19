# Research brief: vLLM dive refresh to v0.31.0 (shared by every research agent)

Research date: **2026-10-16**. Use it as the accessed date on every citation.

## Pins

- Old pin: vLLM commit `15652a6b703f059767d75e5a511c4a5accf969ad` (2026-06-07). Tree: `/tmp/vllm-old`.
- New pin: vLLM tag `v0.31.0` = commit `db9527a46873454610df6dbedf79a36d6bf1a7f6` (2026-10-02,
  released 2026-10-05). Tree: `/tmp/vllm-new`.
- Release notes for every release between the pins: `/tmp/vllm-release-notes/v0.23.0.md` ... `v0.31.0.md`.
- Pin evidence, repo scale, per-subsystem diff and release-note digest:
  `deep-dives/vllm/research/2026-10-refresh/00-pin-and-diff.md`. Read it first.
- Prior adversarial verification of this dive (findings may still be open):
  `docs/verification/2026-08-01/P1-vllm-code-provenance.md` (code claims),
  `docs/verification/2026-08-01/P2-vllm-aws-facts.md` (AWS claims), `SUMMARY.md`.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm`. Section files live
in `deep-dives/vllm/src/sections/` and `deep-dives/vllm/src/sections/codebase/`.

## Standards (read before you start)

- `deep-dives/efa/revamp/source-authority-standard.md`: code at a pinned ref is the authority;
  official docs second; code comments, docstrings and in-repo READMEs are orientation only;
  blogs are inspiration. Where code and docs disagree, code wins and the conflict is a finding.
- `deep-dives/efa/revamp/section-shape-standard.md`: content earns its place by building a mental
  model or being practical to know. Use it to judge whether a new capability deserves coverage.

## Your job

You are a RESEARCH agent. You do **not** edit any file under `src/`. You read the section files
you own, extract every checkable claim, and verify each against `/tmp/vllm-new` (and the web for
non-vLLM facts). You write ONE markdown file, your claim register, at the path you are given.

Verify against code, not release notes. Release notes tell you where to look. A file path, line
count, class name, function name, default value, env var, CLI flag or behaviour gets checked by
opening the file in `/tmp/vllm-new` (grep, sed -n, wc -l). Cite the exact line.

### Claim register format (mandatory)

One table per section file, columns:

| # | Claim (short quote) | Location (file:line) | Verdict | Evidence (pinned URL + tier) | Replacement text or fact |

Verdicts:
- **CORRECT**: holds at v0.31.0 exactly as written (a line count that moved is STALE, not CORRECT).
- **STALE**: was true at the old pin, not at v0.31.0. Give the v0.31.0 fact.
- **WRONG**: was never true, or contradicts its own cited source. Give the correct fact.
- **NEW**: a fact or capability the section should cover and does not. Explain in one line why it
  passes the mental-model-or-practical test.
- **UNKNOWN**: you could not verify it. Say what you tried. An UNKNOWN does not ship as fact.

Evidence URLs:
- vLLM code: `https://github.com/vllm-project/vllm/blob/v0.31.0/<path>#L<a>-L<b>` (tag-pinned).
  Never `/blob/main/` or `/tree/main/`. Line numbers are from `/tmp/vllm-new`.
- vLLM docs: prefer `https://docs.vllm.ai/en/v0.31.0/<page>` if that versioned page loads
  (check with `curl -sI`), otherwise `https://docs.vllm.ai/en/stable/<page>`, plus accessed 2026-10-16.
- Other GitHub projects: pin to a release tag or commit SHA you resolved via the GitHub API today.
- Tier labels: Tier 1 = source code at a pinned ref, official docs, API reference, official release
  notes. Tier 2 = vendor blog, talk, product page (vendor performance numbers are vendor claims and
  must be labelled as such). Tier 3 = third-party analysis, papers, press. Tier 4 = never cited.

### Every register file must also contain these sections

1. **Pin and link audit.** Every GitHub URL in your files that points at `main`, `master`, or the old
   SHA `15652a6b...`, with its v0.31.0 replacement (tag-pinned, path re-verified to exist). Every
   docs URL that is version-pinned to an old version (e.g. `/en/v0.10.1/`) with its replacement.
   Every "accessed 2026-06-07" style provenance line you find.
2. **Diagram and chart audit.** For every inline SVG, timeline, chart or diagram component in your
   files (search for `function ...Diagram`, `<svg`, `Timeline`, `Chart`, `Tree`): its function name,
   what it asserts, whether it still matches v0.31.0 code, and exactly what must change (labels,
   boxes, arrows, numbers). Note any new diagram the refreshed section would need (only if a mental
   model would otherwise exist only as prose).
3. **Major new capabilities in your area** that the dive does not cover, each with its code
   location at v0.31.0, the release that added it, and a one-line verdict on whether it passes the
   mental-model-or-practical test.
4. **Open findings from the 2026-08-01 verification** (P1/P2) that touch your files: still open,
   fixed by the code change, or moot.
5. **Recommended treatment per section file**: KEEP (pin bump only), EDIT (list the edits), or
   REWRITE (why), with an estimate of the claims that change.

### Execution rules (a previous run lost all work to a session stop)

- **Background mode and subagents are allowed.** Read a background task's result before you report on it.
- **Write incrementally.** Within your first few tool calls, create your register file with a
  header and an empty table per section file. Each time you finish one section file, write its
  table into the file immediately (rewrite the whole file with Write, or append with a Bash
  heredoc). Never hold more than one section file's findings only in memory. If you are stopped,
  what is on disk must be usable.
- Be economical: batch checks into combined shell commands (one `grep -n` over several patterns,
  one `wc -l` over many files). Aim for well under 120 tool calls in total.

### Rules

- Preserve hedge scope. "Not found in `vllm/v1/core` at v0.31.0" is a finding; "does not exist" is
  a claim you can only make for the tree you searched, so name the tree.
- Do not cite a docstring or comment as proof of behaviour. Read the code it describes.
- No universal negatives without the grep command that backs them (record the command).
- Keep your register factual and dense. No narrative of how you worked.
- Write the file with the Write tool. Then return to the orchestrator ONLY a summary of at most
  250 words: verdict counts per file, the five most important changes, recommended treatment per
  file, and any UNKNOWN you could not resolve.
