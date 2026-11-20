#!/usr/bin/env bash
# revamp/tools/check-hygiene.sh: nothing private, no session code, no dollar figure in the dive or its build.
# Exit 1 when any pattern matches. Run from the dive directory after a build.
set -u
cd "$(dirname "$0")/../.."
CODE="$(printf 'CM%s' 'P')[ -]?40""7"
EX=(--exclude-dir=node_modules --exclude-dir=test-results --exclude-dir=playwright-report --exclude=*.map --exclude=*.png --exclude=*.jpg --exclude=*.mp4 --exclude=*.webm --exclude=*.woff --exclude=*.woff2 --exclude=*.ttf --exclude=tsconfig.tsbuildinfo --exclude=check-hygiene.sh)
bad=0
run() { # label, pattern, paths...
  local label="$1" pat="$2"; shift 2
  local out; out="$(grep -rInE "${EX[@]}" -e "$pat" "$@" 2>/dev/null | cut -c1-200 | head -8)"
  if [ -n "$out" ]; then echo "[$label]"; echo "$out"; bad=1; fi
}
ALL=(src public index.html dist README.md SCOPE.md sources.md RESEARCH-GUIDE.md revamp research)
run "session code" "$CODE" "${ALL[@]}"
run "home path" "/Users/[a-z]|/home/(carlos|ubuntu|nvidia|jetson|ec2-user)/" "${ALL[@]}"
run "host or tailnet" "\.ts\.net|tail[0-9a-f]{5,}|[a-z0-9]+-[a-z0-9-]+\.local\b|macbook" src public index.html dist README.md SCOPE.md sources.md revamp research
run "ip address" "\b(10|100|172|192)\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\b" src public index.html README.md SCOPE.md sources.md revamp
run "email" "[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com|org|net|io)\b" src public index.html README.md SCOPE.md revamp
run "account id" "\b[0-9]{12}\b" src public
# Dollar figures: reader-facing text only (the registers quote first-party pages and are not shipped).
run "dollar figure" "(\\$|USD ?)[0-9]" src public index.html
[ "$bad" = 0 ] && echo "hygiene clean"
exit $bad
