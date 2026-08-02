#!/usr/bin/env bash
# scripts/gates/pre-overflow.sh: every <pre> must be able to scroll.
#
# A bare <pre> holds a long line at its natural width and pushes the whole
# document sideways on a phone. Every code block in this repo is expected to
# carry the house style:
#
#   <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
#
# overflowX auto is also what makes the Playwright content-overflow gate treat
# the block as intentional rather than as a layout defect, so the two checks
# agree by construction.
#
# Ratchet origin: a single bare <pre> in AIMLTraining.tsx pushed the training
# section 298px past a 390px viewport on 2026-08-02. It was the only one of
# nine code blocks in the dive missing the style.
#
# Opt-in per dive via deep-dives/{topic}/.gates.json key "pre-overflow".

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

CHECK="pre-overflow"
fails=0
dives=()

while IFS= read -r d; do
  [[ -n "$d" ]] && dives+=("$d")
done < <(gates_opted_in "$CHECK")

if [[ ${#dives[@]} -eq 0 ]]; then
  gate_skip "$CHECK: no deep dive opted in (add deep-dives/{topic}/.gates.json)"
  exit 0
fi

for dir in "${dives[@]}"; do
  gate_step "$CHECK: $dir"
  while IFS= read -r hit; do
    [[ -n "$hit" ]] || continue
    file="${hit%%:*}"
    rest="${hit#*:}"
    line="${rest%%:*}"
    printf '    \033[1;31mx\033[0m %s:%s  bare <pre>, add style overflowX auto\n' "$file" "$line"
    fails=$((fails + 1))
  done < <(grep -rn '<pre>' "$dir/src" --include='*.tsx' 2>/dev/null || true)
done

if [[ "$fails" -gt 0 ]]; then
  gate_fail "$CHECK: $fails bare <pre> block(s); each can push a phone viewport sideways"
  exit 1
fi
gate_pass "$CHECK: every <pre> can scroll across ${#dives[@]} opted-in deep dive(s)"
