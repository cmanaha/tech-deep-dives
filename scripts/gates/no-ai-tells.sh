#!/usr/bin/env bash
# scripts/gates/no-ai-tells.sh — Tier 1 deterministic "no AI tells" prose gate.
#
# Usage:
#   bash scripts/gates/no-ai-tells.sh
#
# Enforces the CLAUDE.md "Writing Style: No AI Tells" section against every
# src/**/*.tsx file of every deep dive that opted in via .gates.json
# ("no-ai-tells": true). Dives without that opt-in are skipped silently.
#
# Rules checked:
#   em-dash        the em-dash character and the &mdash; entity
#   en-dash-range  the en-dash character (or &ndash;) between two digits
#   curly-quote    U+2018 U+2019 U+201C U+201D and the &lsquo;/&rsquo;/
#                  &ldquo;/&rdquo; entities
#   llm-vocabulary delve, tapestry, seamless, robust, leverage (verb forms
#                  only), boasts, underscores, pivotal, harness, unlock,
#                  supercharge, realm, landscape, testament, game-changer,
#                  cutting-edge, best-in-class
#
# False-positive controls:
#   - Content inside <pre>...</pre> and <code>...</code> is blanked out before
#     scanning, both inline spans and multi-line blocks. CLAUDE.md exempts
#     code, config, and real CLI output from the prose rules.
#   - "leverage" matches only the verb forms leverage/leverages/leveraging and
#     never when preceded by a hyphen, so "highest-leverage" is not a hit.
#   Known limitation: <Box variant="code"> blocks are NOT stripped, because
#   their closing </Box> cannot be matched reliably without nesting analysis.
#   Put verbatim CLI output in <pre> or <code> if it trips this gate.
#
# Reports file:line for every hit. Exits 1 on any hit, 0 otherwise.
# Same input = same verdict.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

GATE="no-ai-tells"

# ---------- rule patterns ----------

RE_EM_DASH='(—|&mdash;)'
RE_EN_DASH_RANGE='[0-9][[:space:]]*(–|&ndash;)[[:space:]]*[0-9]'
RE_CURLY_QUOTE='(‘|’|“|”|&lsquo;|&rsquo;|&ldquo;|&rdquo;)'

# Leading [^[:alnum:]_-] is what excludes "highest-leverage" and friends.
RE_LLM_VOCAB='(^|[^[:alnum:]_-])(delve|delves|delved|delving|tapestry|seamless|seamlessly|robust|robustly|robustness|leverage|leverages|leveraging|boast|boasts|boasting|underscore|underscores|underscored|underscoring|pivotal|harness|harnesses|harnessed|harnessing|unlock|unlocks|unlocked|unlocking|supercharge|supercharges|supercharged|supercharging|realm|realms|landscape|landscapes|testament|game-changer|game-changers|game-changing|cutting-edge|best-in-class)([^[:alnum:]_]|$)'

# ---------- <pre>/<code> stripper ----------
#
# Prints exactly one line per input line so grep -n line numbers stay true to
# the original file. Lines (or line fragments) inside a code block come out
# blank.

read -r -d '' STRIP_CODE <<'AWK' || true
BEGIN { inblock = 0 }
{
  line = $0
  # Blank out complete inline spans first. [^<]* rather than .* keeps this
  # non-greedy in practice, so text between two spans on one line survives.
  while (match(line, /<code[^>]*>[^<]*<\/code>/)) {
    line = substr(line, 1, RSTART - 1) " " substr(line, RSTART + RLENGTH)
  }
  while (match(line, /<pre[^>]*>[^<]*<\/pre>/)) {
    line = substr(line, 1, RSTART - 1) " " substr(line, RSTART + RLENGTH)
  }

  if (inblock) {
    if (match(line, closeRe)) {
      line = substr(line, RSTART + RLENGTH)
      inblock = 0
    } else {
      line = ""
    }
  }

  if (!inblock) {
    if (match(line, /<code[^>]*>/)) {
      line = substr(line, 1, RSTART - 1); inblock = 1; closeRe = "</code>"
    } else if (match(line, /<pre[^>]*>/)) {
      line = substr(line, 1, RSTART - 1); inblock = 1; closeRe = "</pre>"
    }
  }

  print line
}
AWK

# ---------- reporting ----------

HITS=0

# report_lines <path> <label>   (grep -n output on stdin)
report_lines() {
  local path="$1" label="$2" raw line content
  while IFS= read -r raw; do
    [[ -n "$raw" ]] || continue
    line="${raw%%:*}"
    content="${raw#*:}"
    content="${content#"${content%%[![:space:]]*}"}"
    if [[ ${#content} -gt 100 ]]; then content="${content:0:100}..."; fi
    gate_hit "$path:$line  [$label]  $content"
    HITS=$((HITS + 1))
  done
}

# report_words <path> <label>   (grep -no output on stdin)
report_words() {
  local path="$1" label="$2" raw line word
  while IFS= read -r raw; do
    [[ -n "$raw" ]] || continue
    line="${raw%%:*}"
    word="${raw#*:}"
    word="$(printf '%s' "$word" | sed -E 's/^[^[:alnum:]]+//; s/[^[:alnum:]-]+$//')"
    [[ -n "$word" ]] || continue
    gate_hit "$path:$line  [$label]  \"$word\""
    HITS=$((HITS + 1))
  done
}

# ---------- scan ----------

dives=()
while IFS= read -r d; do
  [[ -n "$d" ]] && dives+=("$d")
done < <(gates_opted_in "$GATE")

if [[ ${#dives[@]} -eq 0 ]]; then
  gate_skip "$GATE: no deep dive opted in (add deep-dives/{topic}/.gates.json)"
  exit 0
fi

TMP="$(mktemp -t no-ai-tells)"
trap 'rm -f "$TMP"' EXIT

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
    awk "$STRIP_CODE" "$f" >"$TMP"
    report_lines "$f" "em-dash"        < <(grep -nE  "$RE_EM_DASH"        "$TMP" || true)
    report_lines "$f" "en-dash-range"  < <(grep -nE  "$RE_EN_DASH_RANGE"  "$TMP" || true)
    report_lines "$f" "curly-quote"    < <(grep -nE  "$RE_CURLY_QUOTE"    "$TMP" || true)
    report_words "$f" "llm-vocabulary" < <(grep -noiE "$RE_LLM_VOCAB"     "$TMP" || true)
  done
done

if [[ "$HITS" -gt 0 ]]; then
  gate_fail "$GATE: $HITS AI tell(s) found — see CLAUDE.md 'Writing Style: No AI Tells'"
  exit 1
fi

gate_pass "$GATE: no AI tells in ${#dives[@]} opted-in deep dive(s)"
