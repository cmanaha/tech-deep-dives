#!/usr/bin/env bash
# scripts/gates/pinned-refs.sh — Tier 1 deterministic pinned-code-reference gate.
#
# Usage:
#   bash scripts/gates/pinned-refs.sh
#
# Scans the src/ of every deep dive that opted in via .gates.json
# ("pinned-refs": true) for GitHub URLs that point at a moving branch:
#
#   /blob/main/    /blob/master/    /tree/main/    /tree/master/
#
# Those are failures. A code citation on a branch is unverifiable: the file
# can move, the line can shift, the function can be deleted, and the claim in
# the deep dive silently stops matching the source it cites. Per the
# CLAUDE.md "Fact-Checking & Sources Standard", Tier 1 source-code citations
# have to stay re-verifiable, which means pinning to something immutable:
#
#   /blob/<40-char-commit-sha>/path/to/file.c#L120-L145
#   /blob/v1.9.2/path/to/file.c
#
# Both a commit SHA and a release tag are accepted (a tag can technically be
# moved, but it is a deliberate, visible act, unlike a branch advancing).
#
# Reports file:line and the offending URL. Exits 1 on any hit, 0 otherwise.
# Same input = same verdict.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

GATE="pinned-refs"

# Characters legal in the URLs we care about. Kept as an allow-list so the
# pattern needs no shell quoting gymnastics for quotes and backticks.
URL_CHARS='[A-Za-z0-9._~:/?#@!$&*+,;=%-]'
RE_UNPINNED="(https?://)?(www\.)?github\.com/${URL_CHARS}*/(blob|tree)/(main|master)/${URL_CHARS}*"

HITS=0

dives=()
while IFS= read -r d; do
  [[ -n "$d" ]] && dives+=("$d")
done < <(gates_opted_in "$GATE")

if [[ ${#dives[@]} -eq 0 ]]; then
  gate_skip "$GATE: no deep dive opted in (add deep-dives/{topic}/.gates.json)"
  exit 0
fi

for dive in "${dives[@]}"; do
  gate_step "$GATE: $dive"

  files=()
  while IFS= read -r -d '' f; do
    files+=("$f")
  done < <(gates_find_src "$dive")

  if [[ ${#files[@]} -eq 0 ]]; then
    gate_warn "no files under $dive/src"
    continue
  fi

  for f in "${files[@]}"; do
    while IFS= read -r raw; do
      [[ -n "$raw" ]] || continue
      line="${raw%%:*}"
      url="${raw#*:}"
      gate_hit "$f:$line  unpinned reference  $url"
      HITS=$((HITS + 1))
    done < <(grep -noIE "$RE_UNPINNED" "$f" || true)
  done
done

if [[ "$HITS" -gt 0 ]]; then
  gate_fail "$GATE: $HITS branch-pinned GitHub reference(s) — pin each to a commit SHA or release tag"
  exit 1
fi

gate_pass "$GATE: all GitHub code references pinned across ${#dives[@]} opted-in deep dive(s)"
