# Git Authorship: Findings and Plan

Investigated 2026-08-01. Status: **NOT YET APPLIED** — awaiting Carlos's review.

## Premise check

The request was "change the whole history so all commits are authored by my user."
Direct inspection shows **the premise does not hold**: `main` is already fully
authored by Carlos and already free of Claude attribution.

Evidence (all from direct `git log` inspection of this repo):

- `main` has 52 commits. Author on 51 of them: `Carlos Manzanedo Rueda <carlos@cmanaha.com>`.
- Scanning every commit message body on `main` for `Co-Authored-By: Claude`,
  `Generated with [Claude Code]`, and `via [Happy]` returns **zero hits**.
- A history rewrite was already performed once, around 2026-03-22. The evidence is
  the leftover `refs/original/*` refs that `git filter-branch` writes as its safety net.

## What actually still carries Claude attribution

Exactly 11 commits, and they exist **only** in two stale backup refs:

```
refs/original/refs/heads/main          -> a9e6651
refs/original/refs/remotes/origin/main -> a9e6651
```

Verified reachability:
- `git rev-list --all --not main` = 11 commits
- `git rev-list a9e6651 --not main` = 11 commits
- `git rev-list --all --not main a9e6651` = 0 commits

So those 11 are reachable from nothing except `refs/original`. They are the
pre-rewrite originals, carrying the full trailer block:

```
Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
```

These are what make `git log --all | grep Claude` look alarming. They are not on
`main`, were never pushed as `main`, and are not in the GitHub history.

## The one real blemish on main

A single commit, the GitHub web-UI merge of PR #1:

```
d65693b  author:    Carlos Manzanedo Rueda <c.manaha@gmail.com>
         committer: GitHub <noreply@github.com>
         silicon-memory-inference: add Section 15 Edge Shared-Memory Silicon (#1)
```

Wrong author email (gmail instead of the canonical cmanaha.com) and a `GitHub`
committer. Cosmetic, but it is the only inconsistency in the published history.

## Options

**Option A — ref cleanup only (recommended).** Delete the two `refs/original/*`
refs. This orphans all 11 trailer commits immediately. No history rewrite, no SHA
changes, no force-push, nothing to coordinate with GitHub. Reversible from the
bundle if ever needed. Leaves the `d65693b` email blemish in place.

```
git update-ref -d refs/original/refs/heads/main
git update-ref -d refs/original/refs/remotes/origin/main
git reflog expire --expire=now --all && git gc --prune=now
```

**Option B — ref cleanup plus full normalization.** Everything in A, plus a
`git filter-repo` mailmap pass to rewrite `d65693b`'s author/committer to the
canonical identity. This rewrites that commit and every descendant, changing SHAs,
and therefore **requires `git push --force` to origin** — which is on Carlos's
denied-commands list and must be run by him, not by the agent.

A dry run of Option B was completed on a throwaway mirror clone at
`/tmp/tdd-rw2.git` and verified:
- 52/52 commits author AND committer = `Carlos Manzanedo Rueda <carlos@cmanaha.com>`
- `main^{tree}` hash **identical** to the live repo, so zero content change
- only residual "claude" string matches are legitimate prose (the filename
  `CLAUDE.md`, and the sentence "Carlos + Claude coding sessions" inside the
  `ci.sh` commit body, which is an accurate description, not an authorship claim)

## Safety net already in place

- Backup branch: `backup/pre-efa-revamp-2026-08-01` (points at pre-session `main`)
- Full bundle of all refs: `/tmp/tech-deep-dives-backup-2026-08-01.bundle` (25 MB)

## Open question for Carlos

Whether the two prose mentions of "Claude" in commit bodies (`b94eb57`, `f57aa31`,
and the `CLAUDE.md` filename references) should also be scrubbed. They are accurate
descriptions of the project's tooling, not authorship attribution, so the default
recommendation is to leave them.
