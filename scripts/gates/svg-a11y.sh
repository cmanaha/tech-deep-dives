#!/usr/bin/env bash
# scripts/gates/svg-a11y.sh — Tier 1 deterministic inline-SVG accessibility gate.
#
# Usage:
#   bash scripts/gates/svg-a11y.sh
#
# Enforces the CLAUDE.md "Diagram Standards" accessibility rule against every
# <svg> in the src/**/*.tsx of every deep dive that opted in via .gates.json
# ("svg-a11y": true). Dives without that opt-in are skipped silently.
#
# Every inline <svg> must have:
#   1. role="img"                                        -> hard requirement
#   2. an accessible name, one of:
#        a. aria-labelledby="X" plus a <title id="X"> inside the same <svg>
#           (the form CLAUDE.md prefers, because the title is also visible to
#           tooling that reads the SVG standalone)
#        b. aria-label="..."                             -> WARNING, not a failure
#
# Failure cases:
#   - no role="img"
#   - neither aria-labelledby nor aria-label
#   - aria-labelledby pointing at an id no <title> in that <svg> declares
#     (a dangling reference is worse than no reference: it reads as done)
#
# Reports file:line of the opening <svg>. Exits 1 on any failure. Warnings do
# not affect the exit code. Same input = same verdict.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

GATE="svg-a11y"

# ---------- svg analyser ----------
#
# Emits one record per <svg> element: "FAIL <line> <message>" or
# "WARN <line> <message>". Silent for compliant elements.

read -r -d '' ANALYSE_SVG <<'AWK' || true
function analyse(buf, start,   gt, opentag, hasrole, hasarialabel, haslabelledby, titlewired, id, titleRe) {
  gt = index(buf, ">")
  opentag = (gt > 0) ? substr(buf, 1, gt) : buf

  hasrole      = (opentag ~ /role[[:space:]]*=[[:space:]]*["']img["']/)
  hasarialabel = (opentag ~ /aria-label[[:space:]]*=[[:space:]]*["'][^"']+["']/)

  haslabelledby = 0
  titlewired = 0
  if (match(opentag, /aria-labelledby[[:space:]]*=[[:space:]]*"[^"]+"/)) {
    haslabelledby = 1
    id = substr(opentag, RSTART, RLENGTH)
    sub(/^aria-labelledby[[:space:]]*=[[:space:]]*"/, "", id)
    sub(/"$/, "", id)
    titleRe = "<title[^>]*id[[:space:]]*=[[:space:]]*\"" id "\""
    if (buf ~ titleRe) titlewired = 1
  }

  if (!hasrole) {
    printf "FAIL %d <svg> is missing role=\"img\"\n", start
  }

  if (haslabelledby && !titlewired) {
    printf "FAIL %d <svg> aria-labelledby=\"%s\" has no matching <title id=\"%s\">\n", start, id, id
  } else if (!haslabelledby && hasarialabel) {
    printf "WARN %d <svg> uses aria-label only; a <title> wired via aria-labelledby is preferred\n", start
  } else if (!haslabelledby && !hasarialabel) {
    printf "FAIL %d <svg> has no accessible name (needs <title> + aria-labelledby, or aria-label)\n", start
  }
}

BEGIN { insvg = 0 }
{
  if (!insvg) {
    p = index($0, "<svg")
    if (p == 0) next
    c = substr($0, p + 4, 1)
    if (c != "" && c != " " && c != "\t" && c != ">" && c != "/") next
    insvg = 1
    start = FNR
    buf = substr($0, p)
  } else {
    buf = buf " " $0
  }

  if (index(buf, "</svg>") > 0) {
    analyse(buf, start)
    insvg = 0
  }
}
END {
  if (insvg) printf "FAIL %d unterminated <svg> element\n", start
}
AWK

# ---------- scan ----------

FAILURES=0
WARNINGS=0
CHECKED=0

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
  done < <(gates_find_src "$dive" -name '*.tsx')

  if [[ ${#files[@]} -eq 0 ]]; then
    gate_warn "no .tsx files under $dive/src"
    continue
  fi

  for f in "${files[@]}"; do
    grep -q '<svg' "$f" || continue
    CHECKED=$((CHECKED + 1))
    while IFS= read -r record; do
      [[ -n "$record" ]] || continue
      verdict="${record%% *}"
      rest="${record#* }"
      line="${rest%% *}"
      message="${rest#* }"
      if [[ "$verdict" == "FAIL" ]]; then
        gate_hit "$f:$line  $message"
        FAILURES=$((FAILURES + 1))
      else
        gate_warn "$f:$line  $message"
        WARNINGS=$((WARNINGS + 1))
      fi
    done < <(awk "$ANALYSE_SVG" "$f")
  done
done

if [[ "$WARNINGS" -gt 0 ]]; then
  gate_note "$GATE: $WARNINGS aria-label-only warning(s) — not blocking"
fi

if [[ "$FAILURES" -gt 0 ]]; then
  gate_fail "$GATE: $FAILURES inaccessible <svg> element(s) — see CLAUDE.md 'Diagram Standards'"
  exit 1
fi

gate_pass "$GATE: all inline <svg> accessible across $CHECKED file(s) in ${#dives[@]} opted-in deep dive(s)"
