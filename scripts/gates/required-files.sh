#!/usr/bin/env bash
# scripts/gates/required-files.sh — Tier 1 deterministic per-dive file gate.
#
# Usage:
#   bash scripts/gates/required-files.sh
#
# Every deep dive that opted in via .gates.json ("required-files": true) must
# ship the two files the CLAUDE.md "Deep Dive Standards" section mandates:
#
#   README.md    topic summary, key takeaways, sources
#   sources.md   every authoritative source with URL and access date
#
# Present is not enough: each has to be non-empty. An empty sources.md is a
# deep dive with no audit trail, which is exactly the state the sources
# standard exists to prevent.
#
# Reports which files are missing or empty. Exits 1 on any failure, 0
# otherwise. Same input = same verdict.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

GATE="required-files"
REQUIRED=(README.md sources.md)

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
  for name in "${REQUIRED[@]}"; do
    path="$dive/$name"
    if [[ ! -f "$path" ]]; then
      gate_hit "$path  missing"
      HITS=$((HITS + 1))
    elif [[ ! -s "$path" ]]; then
      gate_hit "$path  present but empty"
      HITS=$((HITS + 1))
    fi
  done
done

if [[ "$HITS" -gt 0 ]]; then
  gate_fail "$GATE: $HITS required file(s) missing or empty — see CLAUDE.md 'Deep Dive Standards'"
  exit 1
fi

gate_pass "$GATE: README.md and sources.md present in ${#dives[@]} opted-in deep dive(s)"
