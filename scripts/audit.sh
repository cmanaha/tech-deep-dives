#!/usr/bin/env bash
# scripts/audit.sh — Session-runner for deeper validation of tech-deep-dives.
#
# Usage:
#   bash scripts/audit.sh                        # show help, list available checks
#   bash scripts/audit.sh --with-playwright      # run deterministic browser-DOM invariants
#   bash scripts/audit.sh --with-agents          # run LLM-driven advisory audits
#   bash scripts/audit.sh --with-playwright --with-agents   # both
#   bash scripts/audit.sh --help                 # full usage
#
# WHEN TO USE THIS:
# This is the "be thorough this session" runner. Call it from a coding
# session with Claude when you want deeper validation than ci.sh provides.
# Outputs land in deep-dives/{topic}/audit-reports/ as markdown artifacts
# you can read after the run, NOT as in-context streams that bloat the
# session.
#
# WHAT THIS IS NOT:
# - Not part of ci.sh (which is fast/deterministic only)
# - Not invoked by .github/workflows/ (CI is owned separately)
# - Not a merge-blocker
#
# Two runner backends:
#
#   --with-playwright
#     Deterministic browser-level invariants (Tier 1 rendered-DOM gates).
#     No LLM. Same input => same verdict. Tests live in:
#       deep-dives/{topic}/playwright/gate-*.test.ts
#     Findings: routing integrity, deep-link wiring, no hydration warnings,
#     React Flow node-overlap invariants, content overflow, responsive
#     collapse, single-active-nav.
#
#   --with-agents
#     LLM-driven advisory audits (Tier 2 — discovery layer).
#     Three agent types: render-auditor, diagram-auditor, route-auditor.
#     Each writes structured markdown to disk, never streams findings into
#     orchestrator context. Findings inform new deterministic gates.
#
# RATCHET PRINCIPLE:
# Every time --with-agents finds a real bug, encode it as a deterministic
# gate (Playwright test or eslint rule). The agent surface shrinks over
# time as more bug classes become scripted. Agents stay as the frontier
# detector; deterministic gates are the ratchet that locks gains in.
#
# See docs/adr/0004-agent-driven-quality-gates.md for the full discipline.

set -euo pipefail

WITH_PLAYWRIGHT=0
WITH_AGENTS=0

usage() {
  sed -n '2,46p' "$0"
}

if [[ $# -eq 0 ]]; then
  usage
  echo
  echo "audit.sh: no flags given. Pick --with-playwright, --with-agents, or both."
  exit 0
fi

for arg in "$@"; do
  case "$arg" in
    --with-playwright) WITH_PLAYWRIGHT=1 ;;
    --with-agents) WITH_AGENTS=1 ;;
    --help|-h) usage; exit 0 ;;
    *)
      echo "audit.sh: unknown argument: $arg" >&2
      echo "use --help for usage" >&2
      exit 2
      ;;
  esac
done

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() {
  printf '\n\033[1;36m==> %s\033[0m\n' "$1"
}

note() {
  printf '\033[1;33m[NOTE]\033[0m %s\n' "$1"
}

fail() {
  printf '\n\033[1;31m[FAIL]\033[0m %s\n' "$1" >&2
  exit 1
}

# ---------- Tier 1 deterministic browser invariants ----------

run_playwright() {
  step "playwright deterministic gates"
  local runner="scripts/audit/run-playwright.sh"
  if [[ ! -x "$runner" ]]; then
    note "$runner not present yet."
    note "Phase 2 backlog: install @playwright/test, write playwright.config.ts,"
    note "and add gate-*.test.ts files. The runner script will dispatch them and"
    note "write per-test markdown reports under deep-dives/{topic}/audit-reports/playwright/."
    return 0
  fi
  bash "$runner" || fail "playwright invariants"
}

# ---------- Tier 2 agent-driven advisory audits ----------

run_agents() {
  step "agent-driven advisory audits"
  local runner="scripts/audit/run-agents.sh"
  if [[ ! -x "$runner" ]]; then
    note "$runner not present yet."
    note "Phase 3 backlog: build .claude/skills/render-audit-section.md and the"
    note "matching agent definitions in .claude/agents/, then this runner dispatches"
    note "render-auditor, diagram-auditor, route-auditor in parallel. Each writes"
    note "structured markdown under deep-dives/{topic}/audit-reports/{render,diagrams,routes}/."
    note ""
    note "Skills planned (per docs/adr/0004-agent-driven-quality-gates.md):"
    note "  - render-audit-section: per-section Playwright DOM audit + report"
    note "  - diagram-audit-reactflow: React Flow invariants + report"
    note "  - route-integrity-check: nav-href to DOM-id consistency + deep-link smoke"
    note ""
    note "Build via skill-creator + agent-builder plugins (eval-driven)."
    return 0
  fi
  bash "$runner" || fail "agent audits"
}

# ---------- dispatch ----------

if [[ "$WITH_PLAYWRIGHT" -eq 1 ]]; then
  run_playwright
fi

if [[ "$WITH_AGENTS" -eq 1 ]]; then
  run_agents
fi

printf '\n\033[1;32m[DONE]\033[0m audit complete\n'
