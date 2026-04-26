#!/usr/bin/env bash
# scripts/ci.sh — Local development quality-gate entry point for tech-deep-dives
#
# Usage:
#   bash scripts/ci.sh   # run all deterministic gates
#
# Scope: this script is for LOCAL development sessions (Carlos + Claude
# coding sessions). It runs ONLY fast, deterministic, no-network,
# no-LLM gates so it can be invoked freely without surprises:
#
#   typecheck → lint → unit tests → build → html-validate
#
# Same input => same verdict, every time. No flakiness.
#
# What this script intentionally does NOT do:
#   - Playwright invariant tests (live in scripts/audit.sh, opt-in)
#   - Agent-driven advisory audits (also in scripts/audit.sh, opt-in)
#   - External link checks (network-dependent, run separately)
#   - GitHub Actions integration (CI is owned by Carlos and stays minimal)
#
# Those validations belong to a separate session-runner: scripts/audit.sh.
# CI workflows in .github/workflows/ are not driven by this script.

set -euo pipefail

case "${1:-}" in
  --help|-h)
    sed -n '2,21p' "$0"
    exit 0
    ;;
  '')
    ;;
  *)
    echo "ci.sh: unknown argument: $1" >&2
    echo "use --help for usage" >&2
    exit 2
    ;;
esac

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

step "html validation (built dist/index.html)"
bash scripts/gates/html-validate.sh || fail "html validation"

printf '\n\033[1;32m[PASS]\033[0m all deterministic gates green\n'
