#!/usr/bin/env bash
# scripts/audit/run-playwright.sh — Tier 2 deterministic browser-DOM gates.
#
# Usage:
#   bash scripts/audit/run-playwright.sh              # every dive that has gates
#   bash scripts/audit/run-playwright.sh efa          # one dive
#   bash scripts/audit/run-playwright.sh --help
#
# Dispatched by scripts/audit.sh --with-playwright. Deliberately NOT part of
# scripts/ci.sh: ADR-004 puts Playwright in the session runner because it needs
# a real browser and takes minutes rather than seconds, and ci.sh has to stay
# fast enough to run on every save.
#
# For each dive that ships a playwright.config.ts and a playwright/ directory:
#
#   1. build the dive, so the gates measure the production output rather than
#      whatever happened to be in dist/ from an earlier session
#   2. hand off to `playwright test`, which brings up both servers itself
#      (vite preview over dist/, plus a vite dev server that gate-no-console
#      -errors needs because React strips its warnings from a production build)
#   3. the gates write their own per-gate markdown to
#      deep-dives/{topic}/audit-reports/playwright/gate-{name}-{viewport}.md
#   4. print the verdict table so the console says what the files say
#
# Same input gives the same verdict. No LLM anywhere in this path.
#
# Exit status, matching the convention scripts/audit/verify-citations.sh set:
#   0  every gate green
#   1  a gate found problems, which is a content defect worth acting on
#   2  the gates could not run at all (no dive opted in, chromium missing, or
#      the dive failed to build). Not a content defect, so audit.sh records it
#      as UNVERIFIABLE rather than as a failure.
#
# See docs/adr/0004-agent-driven-quality-gates.md.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

GATE="playwright"

usage() {
  sed -n '2,34p' "$0"
}

case "${1:-}" in
  --help|-h) usage; exit 0 ;;
esac

# ---------- which dives ----------
#
# A dive opts in by shipping playwright.config.ts plus a playwright/ directory
# with at least one gate-*.test.ts. Same ratchet argument as _common.sh: a dive
# joins when its gates are written, and never silently drops out.

collect_dives() {
  local requested="${1:-}" dive
  for dive in deep-dives/*/; do
    dive="${dive%/}"
    [[ -f "$dive/playwright.config.ts" ]] || continue
    compgen -G "$dive/playwright/gate-*.test.ts" >/dev/null || continue
    if [[ -n "$requested" && "$(basename "$dive")" != "$requested" ]]; then
      continue
    fi
    printf '%s\n' "$dive"
  done
}

dives=()
while IFS= read -r d; do
  [[ -n "$d" ]] && dives+=("$d")
done < <(collect_dives "${1:-}")

if [[ ${#dives[@]} -eq 0 ]]; then
  if [[ -n "${1:-}" ]]; then
    gate_fail "$GATE: no deep dive named '${1}' with playwright.config.ts and playwright/gate-*.test.ts"
  else
    gate_skip "$GATE: no deep dive ships playwright.config.ts plus playwright/gate-*.test.ts yet"
  fi
  exit 2
fi

# ---------- browser presence ----------
#
# Failing here with the install command is far more useful than letting
# Playwright fail 30 seconds later inside a worker.

check_browser() {
  local dive="$1" loc found=0 missing=0
  while IFS= read -r loc; do
    found=1
    [[ -d "$loc" ]] || missing=1
  done < <(cd "$dive" && pnpm exec playwright install chromium --dry-run 2>/dev/null |
    awk '/Install location:/ { print $3 }')

  if [[ "$found" -eq 0 || "$missing" -eq 1 ]]; then
    gate_fail "$GATE: chromium is not installed for $dive"
    gate_note "run: (cd $dive && pnpm exec playwright install chromium)"
    return 1
  fi
  return 0
}

# ---------- run ----------

FAILED=0
UNRUNNABLE=0

for dive in "${dives[@]}"; do
  topic="$(basename "$dive")"
  gate_step "$GATE: $topic"

  check_browser "$dive" || { UNRUNNABLE=1; continue; }

  gate_note "building $topic so the gates measure what ships"
  if ! pnpm --filter "./$dive" run build >/dev/null 2>&1; then
    gate_fail "$GATE: $topic failed to build, so there is nothing to serve"
    UNRUNNABLE=1
    continue
  fi

  reports="$dive/audit-reports/playwright"
  rm -rf "$reports"
  mkdir -p "$reports"

  # playwright.config.ts owns the servers: vite preview over dist/ for the
  # gates that measure shipped output, and a vite dev server for the console
  # gate. Starting them here as well would just fight it.
  if (cd "$dive" && pnpm exec playwright test); then
    gate_pass "$GATE: $topic, all gates green"
  else
    gate_fail "$GATE: $topic, one or more gates failed"
    FAILED=1
  fi

  # ---------- verdict table ----------

  if compgen -G "$reports/gate-*.md" >/dev/null; then
    printf '\n'
    gate_note "reports in $reports"
    for report in "$reports"/gate-*.md; do
      name="$(basename "$report" .md)"
      line="$(grep -m1 '^Status: ' "$report" || true)"
      verdict="$(printf '%s' "$line" | sed -E 's/^Status: \*\*([A-Z]+)\*\*.*/\1/')"
      count="$(printf '%s' "$line" | sed -E 's/.*\(([0-9]+) finding.*/\1/')"
      if [[ "$verdict" == "PASS" ]]; then
        gate_pass "  $name"
      else
        gate_hit "  $name: $count finding(s)"
      fi
    done
    printf '\n'
  else
    gate_warn "$topic produced no markdown reports, which means the gates did not reach their reporting step"
    FAILED=1
  fi
done

if [[ "$FAILED" -ne 0 ]]; then
  gate_fail "$GATE: see the per-gate markdown for detail"
  exit 1
fi

if [[ "$UNRUNNABLE" -ne 0 ]]; then
  gate_fail "$GATE: could not run for at least one deep dive"
  exit 2
fi

gate_pass "$GATE: ${#dives[@]} deep dive(s) green"
