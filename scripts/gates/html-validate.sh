#!/usr/bin/env bash
# scripts/gates/html-validate.sh — Tier 1 deterministic HTML validation gate.
#
# Runs html-validate against every deep-dive's built index.html plus the
# workspace-root index.html files that may ship to GH Pages. Config in
# .htmlvalidate.json at repo root.
#
# Catches bugs like:
#   - raw `&` in a <title> tag (needs &amp;)
#   - unclosed tags
#   - invalid attribute values
#   - WCAG-level structural mistakes
#
# Exits non-zero on any violation. Same input = same verdict.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# Collect all built index.html files across deep-dives.
# Build must have run first (ci.sh runs `pnpm build` before this gate).
targets=()
while IFS= read -r -d '' file; do
  targets+=("$file")
done < <(find deep-dives -path '*/dist/index.html' -print0 2>/dev/null)

# Also include source index.html files — hand-authored, likely place for
# raw-HTML bugs like `&` in <title>. Skip the template's index.html since
# it contains intentional placeholder syntax.
while IFS= read -r -d '' file; do
  case "$file" in
    */deep-dives/_template/index.html) continue ;;
  esac
  targets+=("$file")
done < <(find deep-dives -maxdepth 3 -name index.html -not -path '*/dist/*' -not -path '*/node_modules/*' -print0 2>/dev/null)

if [[ "${#targets[@]}" -eq 0 ]]; then
  echo "html-validate: no index.html targets found — did the build run?"
  exit 1
fi

echo "html-validate: auditing ${#targets[@]} file(s)"
for t in "${targets[@]}"; do
  echo "  - ${t#$ROOT/}"
done

pnpm exec html-validate "${targets[@]}"
