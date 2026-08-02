#!/usr/bin/env bash
# scripts/gates/_common.sh — Shared helpers for the per-dive Tier 1 gates.
#
# Not a gate itself. Sourced by no-ai-tells.sh, svg-a11y.sh, pinned-refs.sh
# and required-files.sh. The leading underscore marks it as "not a gate" so a
# future glob-based runner does not try to execute it.
#
# OPT-IN MODEL
# ------------
# A deep dive is subject to these gates only if it ships a config file:
#
#   deep-dives/{topic}/.gates.json
#   {
#     "gates": {
#       "no-ai-tells":    true,
#       "svg-a11y":       true,
#       "pinned-refs":    true,
#       "required-files": true
#     }
#   }
#
# A dive with no .gates.json is skipped silently by every gate. A gate key
# that is absent or false opts that dive out of that one gate.
#
# Why opt-in: per ADR-004 these gates are a RATCHET, not a wall. Turning them
# on repo-wide the day they land would fail every dive at once and the only
# way back to green would be to delete the gate. Instead each dive opts in as
# its content is cleaned up, and once opted in it can never regress.
#
# See docs/adr/0004-agent-driven-quality-gates.md.

# ---------- output helpers (match the ci.sh house style) ----------

gate_step() { printf '\033[1;36m--> %s\033[0m\n' "$1"; }
gate_hit()  { printf '    \033[1;31mx\033[0m %s\n' "$1"; }
gate_warn() { printf '    \033[1;33m!\033[0m %s\n' "$1"; }
gate_note() { printf '\033[1;33m[NOTE]\033[0m %s\n' "$1"; }
gate_skip() { printf '\033[1;33m[SKIP]\033[0m %s\n' "$1"; }
gate_pass() { printf '\033[1;32m[PASS]\033[0m %s\n' "$1"; }
gate_fail() { printf '\033[1;31m[FAIL]\033[0m %s\n' "$1" >&2; }

# ---------- opt-in resolution ----------

# gates_read_flag <config-path> <gate-name> -> "true" | "false"
gates_read_flag() {
  local cfg="$1" gate="$2"
  if command -v jq >/dev/null 2>&1; then
    jq -r --arg g "$gate" 'if (.gates[$g] == true) then "true" else "false" end' "$cfg"
  elif command -v node >/dev/null 2>&1; then
    node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);process.stdout.write((((j.gates||{})[process.argv[1]])===true)?"true":"false")})' \
      "$gate" <"$cfg"
  else
    printf 'gates: neither jq nor node is available to read %s\n' "$cfg" >&2
    return 1
  fi
}

# gates_opted_in <gate-name> -> one dive directory path per line
gates_opted_in() {
  local gate="$1" cfg dive enabled
  for cfg in deep-dives/*/.gates.json; do
    [[ -e "$cfg" ]] || continue
    dive="${cfg%/.gates.json}"
    enabled="$(gates_read_flag "$cfg" "$gate")"
    if [[ "$enabled" == "true" ]]; then
      printf '%s\n' "$dive"
    fi
  done
  return 0
}

# gates_source_files <dive> <find-name-expr...> -> NUL-separated file list
# Always excludes node_modules/ and dist/.
gates_find_src() {
  local dive="$1"
  shift
  [[ -d "$dive/src" ]] || return 0
  find "$dive/src" \
    -path '*/node_modules/*' -prune -o \
    -path '*/dist/*' -prune -o \
    -type f "$@" -print0 2>/dev/null
}
