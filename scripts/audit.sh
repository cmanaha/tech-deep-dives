#!/usr/bin/env bash
# scripts/audit.sh — Session-runner for deeper validation of tech-deep-dives.
#
# Usage:
#   bash scripts/audit.sh                        # show help, list available checks
#   bash scripts/audit.sh --with-playwright      # run deterministic browser-DOM invariants
#   bash scripts/audit.sh --with-citations       # re-verify every citation over the network
#   bash scripts/audit.sh --with-agents          # run LLM-driven advisory audits
#   bash scripts/audit.sh --with-playwright --with-agents   # any combination
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
# Three runner backends:
#
#   --with-playwright
#     Deterministic browser-level invariants (Tier 1 rendered-DOM gates).
#     No LLM. Same input => same verdict. Tests live in:
#       deep-dives/{topic}/playwright/gate-*.test.ts
#     Gates shipped so far, each run at 1440 and at 390 wide:
#       gate-routes             every nav section mounts real content rather
#                               than a Suspense spinner that never resolves
#       gate-content-overflow   nothing spills horizontally out of its box
#       gate-svg-overlap        no <text> in a hand-authored inline SVG
#                               collides with another or falls outside the
#                               viewBox, measured in viewBox user units
#       gate-no-console-errors  no console error, uncaught page error or React
#                               warning while visiting every section
#     Runner: scripts/audit/run-playwright.sh
#     Opt in per dive by shipping playwright.config.ts plus playwright/.
#
#   --with-citations
#     Deterministic citation re-verification over the network (Tier 1.5 in
#     docs/verification/2026-08-01/P5-verification-harness-design.md). No LLM.
#     Every documentation URL is fetched and classified, and every pinned code
#     reference is re-fetched at its exact ref to confirm the file is there and
#     long enough for the cited line range. This lives here rather than in
#     ci.sh because ci.sh excludes network-dependent checks by contract: a
#     verdict that depends on a remote server cannot be a Tier 1 gate.
#     Runner: scripts/audit/verify-citations.sh
#     Opt-in per dive via deep-dives/{topic}/.gates.json "verify-citations".
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
WITH_CITATIONS=0
WITH_AGENTS=0
STATUS=0

usage() {
  sed -n '2,65p' "$0"
}

if [[ $# -eq 0 ]]; then
  usage
  echo
  echo "audit.sh: no flags given. Pick --with-playwright, --with-citations, --with-agents, or any combination."
  exit 0
fi

for arg in "$@"; do
  case "$arg" in
    --with-playwright) WITH_PLAYWRIGHT=1 ;;
    --with-citations) WITH_CITATIONS=1 ;;
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
  local runner="scripts/audit/run-playwright.sh" rc=0
  if [[ ! -f "$runner" ]]; then
    fail "$runner is missing"
  fi
  bash "$runner" || rc=$?
  case "$rc" in
    0) ;;
    1) note "playwright gates found problems; see deep-dives/{topic}/audit-reports/playwright/"
       STATUS=1 ;;
    2) note "playwright gates could not run (no dive opted in, chromium missing, or the dive failed to build): UNVERIFIABLE" ;;
    *) fail "playwright gates exited $rc" ;;
  esac
}

# ---------- Tier 1.5 deterministic networked citation checks ----------
#
# Real dispatch, not a placeholder. Exit codes follow the P5 design:
# 0 clean, 1 findings, 2 could not run. A 2 is not a content defect, so it is
# recorded and the run continues; a 1 is carried to audit.sh's own exit status
# so the result is scriptable. Neither blocks a commit: ADR-004 keeps the
# merge path free of this tier.

run_citations() {
  step "citation re-verification (deterministic, networked)"
  local runner="scripts/audit/verify-citations.sh" rc=0
  if [[ ! -f "$runner" ]]; then
    fail "$runner is missing"
  fi
  bash "$runner" || rc=$?
  case "$rc" in
    0) ;;
    1) note "citation check found dead or missing citations; see the per-dive report"
       STATUS=1 ;;
    2) note "citation check could not run (no network, missing tool, or no dive opted in): UNVERIFIABLE" ;;
    *) fail "citation re-verification exited $rc" ;;
  esac
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

if [[ "$WITH_CITATIONS" -eq 1 ]]; then
  run_citations
fi

if [[ "$WITH_AGENTS" -eq 1 ]]; then
  run_agents
fi

if [[ "$STATUS" -ne 0 ]]; then
  printf '\n\033[1;33m[DONE]\033[0m audit complete with findings\n'
else
  printf '\n\033[1;32m[DONE]\033[0m audit complete\n'
fi
exit "$STATUS"
