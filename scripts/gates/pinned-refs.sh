#!/usr/bin/env bash
# scripts/gates/pinned-refs.sh — Tier 1 deterministic pinned-code-reference gate.
#
# Usage:
#   bash scripts/gates/pinned-refs.sh
#
# Scans for GitHub URLs that point at a moving branch:
#
#   /blob/main/    /blob/master/    /tree/main/    /tree/master/
#
# Two independent scopes, each with its own .gates.json key:
#
#   "pinned-refs"          -> deep-dives/{topic}/src/**
#   "pinned-refs-research" -> deep-dives/{topic}/research/**/*.md
#
# The keys are separate so a dive can gate its shipped source without being
# blocked by a research backlog, and so turning the research scan on for one
# dive does not fail every other dive at once. Same ratchet model as the rest
# of the gates (see _common.sh).
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
# Why research/ is in scope at all: the research markdown is where a claim is
# first attached to a URL, and every citation in src/ is copied out of it. A
# branch pin there is the same defect one step upstream. It is also the exact
# failure that produced the aws-eks-best-practices scare: a repo whose default
# branch is "mainline" was cited on "master", the quotes were absent on that
# stale branch, and the research read as fabricated when it was not.
#
# Reports file:line and the offending URL. Exits 1 on any hit, 0 otherwise.
# Same input = same verdict.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

GATE="pinned-refs"
GATE_RESEARCH="pinned-refs-research"

# Characters legal in the URLs we care about. Kept as an allow-list so the
# pattern needs no shell quoting gymnastics for quotes and backticks.
URL_CHARS='[A-Za-z0-9._~:/?#@!$&*+,;=%-]'
RE_UNPINNED="(https?://)?(www\.)?github\.com/${URL_CHARS}*/(blob|tree)/(main|master)/${URL_CHARS}*"

HITS=0
SCANNED=0

# scan_file <path> -> prints one gate_hit per branch-pinned URL, bumps HITS
scan_file() {
  local f="$1" raw line url
  while IFS= read -r raw; do
    [[ -n "$raw" ]] || continue
    line="${raw%%:*}"
    url="${raw#*:}"
    gate_hit "$f:$line  unpinned reference  $url"
    HITS=$((HITS + 1))
  done < <(grep -noIE "$RE_UNPINNED" "$f" || true)
}

# ---------- scope 1: shipped source ----------

src_dives=()
while IFS= read -r d; do
  [[ -n "$d" ]] && src_dives+=("$d")
done < <(gates_opted_in "$GATE")

for dive in "${src_dives[@]}"; do
  gate_step "$GATE: $dive/src"

  files=()
  while IFS= read -r -d '' f; do
    files+=("$f")
  done < <(gates_find_src "$dive")

  if [[ ${#files[@]} -eq 0 ]]; then
    gate_warn "no files under $dive/src"
    continue
  fi

  for f in "${files[@]}"; do
    scan_file "$f"
    SCANNED=$((SCANNED + 1))
  done
done

# ---------- scope 2: research markdown ----------

research_dives=()
while IFS= read -r d; do
  [[ -n "$d" ]] && research_dives+=("$d")
done < <(gates_opted_in "$GATE_RESEARCH")

for dive in "${research_dives[@]}"; do
  gate_step "$GATE_RESEARCH: $dive/research"

  if [[ ! -d "$dive/research" ]]; then
    gate_warn "no $dive/research directory"
    continue
  fi

  files=()
  while IFS= read -r -d '' f; do
    files+=("$f")
  done < <(find "$dive/research" -type f -name '*.md' -print0 2>/dev/null)

  if [[ ${#files[@]} -eq 0 ]]; then
    gate_warn "no markdown under $dive/research"
    continue
  fi

  for f in "${files[@]}"; do
    scan_file "$f"
    SCANNED=$((SCANNED + 1))
  done
done

# ---------- verdict ----------

if [[ ${#src_dives[@]} -eq 0 && ${#research_dives[@]} -eq 0 ]]; then
  gate_skip "$GATE: no deep dive opted in (add deep-dives/{topic}/.gates.json)"
  exit 0
fi

if [[ "$HITS" -gt 0 ]]; then
  gate_fail "$GATE: $HITS branch-pinned GitHub reference(s) across $SCANNED file(s) — pin each to a commit SHA or release tag"
  exit 1
fi

gate_pass "$GATE: all GitHub references pinned across $SCANNED file(s) (${#src_dives[@]} src, ${#research_dives[@]} research)"
