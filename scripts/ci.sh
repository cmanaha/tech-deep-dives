#!/usr/bin/env bash
# scripts/ci.sh — Master deterministic quality-gate entry point for tech-deep-dives
#
# Usage:
#   bash scripts/ci.sh              # run all required gates
#   bash scripts/ci.sh --with-links # also run external link check (slow, weekly cron)
#
# Invariant: this script runs only DETERMINISTIC gates. No LLM, no agents.
#   Same input => same verdict, every time.
#
# Agent-driven advisory audits live in scripts/audit.sh (opt-in, never blocks merge).
# See docs/adr/0004-agent-driven-quality-gates.md for the two-tier discipline.

set -euo pipefail

# ---------- configuration ----------
WITH_LINKS=0
for arg in "$@"; do
  case "$arg" in
    --with-links) WITH_LINKS=1 ;;
    --help|-h)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *)
      echo "ci.sh: unknown argument: $arg" >&2
      echo "use --help for usage" >&2
      exit 2
      ;;
  esac
done

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ---------- helpers ----------
step() {
  printf '\n\033[1;36m==> %s\033[0m\n' "$1"
}

fail() {
  printf '\n\033[1;31m[FAIL]\033[0m %s\n' "$1" >&2
  exit 1
}

# ---------- gates ----------

step "typecheck (all workspaces)"
pnpm typecheck || fail "typecheck"

step "lint (all workspaces)"
pnpm lint || fail "lint"

step "unit tests (all workspaces)"
pnpm test || fail "unit tests"

step "build (all deep dives)"
pnpm build || fail "build"

# HTML validation on built artifacts.
# Skipped silently if the gate script isn't present yet (being added incrementally).
if [[ -x scripts/gates/html-validate.sh ]]; then
  step "html validation (dist/index.html)"
  bash scripts/gates/html-validate.sh || fail "html validation"
fi

# Playwright deterministic rendered-DOM invariants.
# Skipped silently if no playwright config is present yet.
if [[ -f deep-dives/efa/playwright.config.ts ]] || [[ -f playwright.config.ts ]]; then
  step "playwright deterministic gates"
  pnpm test:gates || fail "playwright gates"
fi

# External link check — opt-in via flag because external sites flap.
if [[ "$WITH_LINKS" -eq 1 ]]; then
  if [[ -x scripts/gates/link-check.sh ]]; then
    step "external link check"
    bash scripts/gates/link-check.sh || fail "link check"
  else
    echo "ci.sh: --with-links requested but scripts/gates/link-check.sh not yet present" >&2
  fi
fi

printf '\n\033[1;32m[PASS]\033[0m all deterministic gates green\n'
