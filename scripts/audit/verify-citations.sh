#!/usr/bin/env bash
# scripts/audit/verify-citations.sh: Tier 1.5 citation re-verification check.
#
# Usage:
#   bash scripts/audit/verify-citations.sh                 # every opted-in dive
#   bash scripts/audit/verify-citations.sh --dive efa      # one dive
#   bash scripts/audit/verify-citations.sh --list          # extract only, no network
#   bash scripts/audit/verify-citations.sh --delay 2.0     # slower pacing
#   bash scripts/audit/verify-citations.sh --help
#
# WHAT THIS IS
# ------------
# Deterministic and network-dependent, with no LLM anywhere in the loop. That
# is Tier 1.5 in docs/verification/2026-08-01/P5-verification-harness-design.md
# section 0.1, and it is why this file lives under scripts/audit/ rather than
# in scripts/ci.sh. ci.sh states in its own header that it excludes external
# link checks because they need the network, and a gate that depends on a
# remote server cannot keep the same-input-same-verdict contract that ADR-004
# demands of Tier 1. Here the run is advisory: it reports, it never blocks a
# commit.
#
# It answers two questions that nothing else in the repo answers:
#
#   1. Does every cited documentation URL still resolve?
#   2. Does every pinned code reference still exist at the ref we pinned, and
#      does the file have at least as many lines as the range we quote?
#
# Question 2 is the one that matters most. A citation to a file that is not
# present at the pinned ref is a misattribution: the claim was written against
# something, but not against the thing we told the reader to check.
#
# RESEARCH SCOPE
# --------------
# By default this reads src/ only. That leaves the research markdown, where a
# claim is first bound to a URL, unchecked. Set "pinned-refs-research": true in
# the dive's .gates.json and research/**/*.md joins the scan.
#
# The research pass extracts GitHub blob and tree URLs only, as pinned code
# references. It deliberately does not sweep every documentation URL in the
# research: that would add a few hundred network probes per run for link rot in
# working notes, and drown the code-reference findings that are the point. The
# defect this closes is the one that produced the aws-eks-best-practices scare,
# where a repo whose default branch is "mainline" was cited on "master" and the
# quoted passages were absent there. A URL carrying "main" or "master" instead
# of a ref is caught deterministically upstream by scripts/gates/pinned-refs.sh
# under the same key; this pass is the networked half, confirming the pinned
# path still exists at the pinned ref.
#
# WHAT IT EXTRACTS
# ----------------
# Both citation shapes used across the portfolio, from src/**/*.tsx and
# src/**/*.ts of the target dive:
#
#   SourceRef prop form   doc={{ url: '...', tier: 1, accessed: '...' }}
#                         code={{ repo: '...', ref: '...', path: '...', lines: '...' }}
#   Builder form          const lfab = (path, lines): CodeRef => ({ repo, ref, ... })
#                         then lfab('man/fi_efa.7.md', 'L12-L26')
#   Helper call form      doc('title', 'https://...', 1)
#   Plain link form       <Link external href="https://...">
#   Bare literal form     any https URL inside a string or template literal
#
# The builder form is the reason the extractor is a small parser rather than a
# grep. Most EFA code citations never write repo or ref at the call site: the
# call passes a path and a line range to a factory that carries the repo and
# the pinned tag. A grep for "repo:" finds 37 of them and misses the rest.
#
# CLASSIFICATION
# --------------
# Documentation URL, after following redirects with a browser User-Agent:
#
#   OK          final status 2xx, no redirect, or a redirect that kept the
#               original last path segment (https upgrade, trailing slash,
#               locale insertion)
#   REDIRECT    2xx after a redirect that preserved the target page
#   ROT         2xx after a redirect that dropped the requested page and
#               landed on a shorter path or a site index. The page is gone,
#               the server just declines to say 404
#   DEAD        404 or 410
#   BLOCKED     401, 403 or 429. The server refused us, not the page
#   ERROR       5xx after one retry
#   TIMEOUT     no response inside the timeout
#
# Pinned code reference, fetched from raw.githubusercontent.com at the exact
# ref (never the default branch):
#
#   OK             file present at the ref, and long enough for the cited range
#   SHORT          file present, but shorter than the highest cited line
#   PATH-MISSING   ref resolves, file does not exist at it. The misattribution
#                  case. Confirmed against the REST commits API
#   REF-MISSING    the ref itself does not resolve in that repo
#   MISSING        fetch returned 404 and the API check was inconclusive
#   BLOCKED        rate limited after retry
#   ERROR          any other transport failure
#
# RATE LIMITING
# -------------
# GitHub answers 429 to unauthenticated bursts. Every request is spaced by
# --delay (default 1.0s, 1.5s against GitHub hosts), raw.githubusercontent.com
# is preferred over the REST API for file content, and the REST API is called
# only to classify a failure that already happened. Set GITHUB_TOKEN in the
# environment to raise the API allowance.
#
# OUTPUT
# ------
# deep-dives/{topic}/audit-reports/verification/citations-{YYYY-MM-DD}.md
# plus a short summary on stdout. Findings land on disk, per ADR-004.
#
# EXIT CODES (P5 section 2 convention)
#   0  every citation resolved
#   1  at least one dead URL, or a code reference missing at its pinned ref
#   2  the check could not run (no network, missing curl or node, no targets)
#
# OPT-IN
# ------
# Reads the same deep-dives/{topic}/.gates.json as the Tier 1 gates, under the
# key "verify-citations". A dive without that key is skipped, so the ratchet
# turns one dive at a time.

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/gates/_common.sh
. "scripts/gates/_common.sh"

CHECK="verify-citations"
RESEARCH_KEY="pinned-refs-research"

# ---------- defaults ----------

DELAY="1.0"          # seconds between documentation requests
GH_DELAY="1.5"       # seconds between github.com requests
HTTP_TIMEOUT=25      # per-request ceiling
ONLY_DIVE=""
LIST_ONLY=0
OUT_OVERRIDE=""
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
TODAY="$(date +%Y-%m-%d)"

usage() { sed -n '2,110p' "$0"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dive) ONLY_DIVE="${2:-}"; shift 2 ;;
    --delay) DELAY="${2:-}"; GH_DELAY="${2:-}"; shift 2 ;;
    --timeout) HTTP_TIMEOUT="${2:-}"; shift 2 ;;
    --out) OUT_OVERRIDE="${2:-}"; shift 2 ;;
    --list) LIST_ONLY=1; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "$CHECK: unknown argument: $1" >&2; echo "use --help for usage" >&2; exit 2 ;;
  esac
done

# ---------- preflight ----------

for bin in curl node awk sed grep; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    gate_fail "$CHECK: $bin is not available; cannot run"
    exit 2
  fi
done

WORK="$(mktemp -d "${TMPDIR:-/tmp}/verify-citations.XXXXXX")"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT INT TERM

# ---------- the extractor ----------
#
# Written out as a Node script rather than inlined with node -e so the quoting
# stays sane: the parser needs backticks, dollar signs and backslashes, and a
# quoted heredoc passes all three through untouched.

EXTRACT="$WORK/extract.mjs"
cat >"$EXTRACT" <<'MJS'
// Extract documentation URLs and pinned code references from one dive.
// Emits TSV on stdout. No network, no LLM, no dependencies.
//
//   DOC \t file \t line \t kind \t url
//   CODE \t file \t line \t repo \t ref \t path \t lines
//
// kind is prop (url: or href), arg (positional string in a helper call),
// or text (a URL inside a template literal or JSX body).
//
// With SCAN_RESEARCH=1 the walk also covers research/**/*.md, from which only
// GitHub blob and tree URLs are taken, as CODE rows. See the RESEARCH SCOPE
// note in the shell header for why the doc sweep stops at src/.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const diveDir = process.argv[2];
const srcDir = join(diveDir, 'src');
const researchDir = join(diveDir, 'research');
const scanResearch = process.env.SCAN_RESEARCH === '1';

function walk(dir, match = /\.(tsx|ts)$/, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e === 'node_modules' || e === 'dist') continue;
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, match, out);
    else if (match.test(e)) out.push(p);
  }
  return out;
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// Module-level string constants, so template literals and identifier
// references can be resolved to a concrete value.
//
// Handles the concatenated form as well as the plain one, because at least one
// citation slug in the EFA dive is split across lines with + to keep a banned
// token out of the prose gate:
//
//   const CONTAINERS_BLOG_SLUG =
//     'unl' +
//     'ocking-...';
//
// A value is recorded only when the whole right-hand side is string literals
// joined by +. Anything else (a function, a call, arithmetic) is left unknown
// rather than half-parsed into a wrong URL.
function stringConsts(text) {
  const map = new Map();
  const re = /^[ \t]*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::\s*string\s*)?=\s*([^;]*?);[ \t]*$/gm;
  const literal = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    let joined = '';
    const residue = m[2].replace(literal, (_full, _q, body) => {
      joined += body;
      return ' ';
    });
    if (joined !== '' && /^[\s +]*$/.test(residue)) map.set(m[1], joined);
  }
  return map;
}

function resolveTemplate(raw, consts) {
  let unresolved = false;
  const out = raw.replace(/\$\{([^}]*)\}/g, (_, expr) => {
    const key = expr.trim();
    if (consts.has(key)) return consts.get(key);
    unresolved = true;
    return '';
  });
  return unresolved ? null : out;
}

const trimUrl = (u) => u.replace(/[.,;:]+$/, '').replace(/\)+$/, '');

// Split a call argument list on top-level commas, respecting quotes.
function splitArgs(s) {
  const args = [];
  let depth = 0, quote = null, cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      cur += c;
      if (c === '\\') { cur += s[++i] ?? ''; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; cur += c; continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    if (c === ')' || c === ']' || c === '}') depth--;
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() !== '') args.push(cur.trim());
  return args;
}

// Read a balanced argument list starting at the index of the open paren.
function readCall(text, openIdx) {
  let depth = 0, quote = null;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') { i++; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return { inner: text.slice(openIdx + 1, i), end: i };
    }
  }
  return null;
}

const isStringLiteral = (s) => /^(['"`]).*\1$/s.test(s);
const literalValue = (s) => s.slice(1, -1);

// A call argument can itself be a template literal, as in
//   sdk(`${DRIVERS}/common/utils.py`, 'L45-L60')
// so an argument is expanded against the module constants before it is used
// as a field value. Returns null when a placeholder cannot be filled.
function argValue(a, consts) {
  if (a === undefined) return undefined;
  if (!isStringLiteral(a)) return consts.has(a) ? consts.get(a) : null;
  const inner = literalValue(a);
  if (!a.startsWith('`')) return inner;
  let unresolved = false;
  const out = inner.replace(/\$\{([^}]*)\}/g, (_, expr) => {
    const key = expr.trim();
    if (consts.has(key)) return consts.get(key);
    unresolved = true;
    return '';
  });
  return unresolved ? null : out;
}

// Resolve a bare identifier inside a CodeRef body: a parameter name, taken
// positionally from the call site (or from its default), or a module-level
// constant. Returns null when the value cannot be established.
function resolveIdent(name, params, args, consts) {
  const pIdx = params.findIndex((p) => p.name === name);
  if (pIdx !== -1) {
    if (args[pIdx] !== undefined) return argValue(args[pIdx], consts);
    const d = params[pIdx].def;
    if (d) {
      const dv = argValue(d, consts);
      if (dv !== undefined && dv !== null) return dv;
    }
    return '';
  }
  if (consts.has(name)) return consts.get(name);
  return null;
}

// Resolve one field value from a CodeRef body: string literal, template
// literal, parameter name, or module-level constant.
//
// The template form is load-bearing. Several EFA factories write
// path: `kernel/linux/efa/${path}`, so a resolver that treats a backtick
// string as opaque produces a literal ${path} in every citation it emits.
function resolveField(value, params, args, consts) {
  if (value === undefined || value === null) return '';
  const v = value.trim();
  if (v === '') return '';
  if (v.startsWith('`') && v.endsWith('`')) {
    let unresolved = false;
    const out = v.slice(1, -1).replace(/\$\{([^}]*)\}/g, (_, expr) => {
      const r = resolveIdent(expr.trim(), params, args, consts);
      if (r === null) unresolved = true;
      return r ?? '';
    });
    return unresolved ? '' : out;
  }
  if (isStringLiteral(v)) return literalValue(v);
  const r = resolveIdent(v, params, args, consts);
  return r === null ? '' : r;
}

// Parse the fields of an object literal body such as
//   repo: 'amzn/amzn-drivers', ref: DRIVER_TAG, path, lines, read: READ
function objectFields(body) {
  const fields = {};
  for (const part of splitArgs(body)) {
    const colon = part.indexOf(':');
    if (colon === -1) {
      const name = part.trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) fields[name] = name; // shorthand
      continue;
    }
    fields[part.slice(0, colon).trim()] = part.slice(colon + 1).trim();
  }
  return fields;
}

const rows = [];
const clean = (c) => String(c).replace(/[\t\r\n]+/g, ' ').trim();
const push = (...cells) => rows.push(cells.map(clean).join('\t'));

// ---- research markdown: GitHub blob and tree URLs as pinned code refs -----
//
// A research URL is plain prose, so there is no builder or object literal to
// parse. The shape is the browser URL itself:
//
//   https://github.com/<owner>/<repo>/blob/<ref>/<path>#L12-L26
//   https://github.com/<owner>/<repo>/tree/<ref>/<path>
//
// The ref segment is taken verbatim, including "main" or "master". Those are
// reported here as whatever the checker finds, which for a live branch is
// usually OK. The deterministic gate is the one that rejects a branch ref, and
// it runs first. This pass answers the different question: at the ref actually
// written, is the path still there.
if (scanResearch) {
  const gre = /https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9._-]+\/[A-Za-z0-9._-]+)\/(?:blob|tree)\/([^/\s'"`<>)\]]+)\/([^\s'"`<>)\]]+)/g;
  for (const file of walk(researchDir, /\.md$/)) {
    const rel = relative(diveDir, file);
    const text = readFileSync(file, 'utf8');
    let gm;
    while ((gm = gre.exec(text)) !== null) {
      const repo = gm[1];
      const ref = gm[2];
      let path = trimUrl(gm[3]);
      let lines = '';
      const hash = path.indexOf('#');
      if (hash !== -1) {
        const frag = path.slice(hash + 1);
        path = path.slice(0, hash);
        if (/^L\d+/.test(frag)) lines = frag;
      }
      const q = path.indexOf('?');
      if (q !== -1) path = path.slice(0, q);
      path = path.replace(/\/+$/, '');
      if (path === '') continue;
      push('CODE', rel, lineOf(text, gm.index), repo, ref, path, lines);
    }
  }
}

for (const file of walk(srcDir)) {
  const rel = relative(diveDir, file);
  if (/__tests__/.test(rel)) continue;
  const text = readFileSync(file, 'utf8');
  const consts = stringConsts(text);

  // ---- 1. CodeRef builder factories -------------------------------------
  //
  //   const lfab = (path: string, lines?: string): CodeRef => ({ ... });
  //
  // Record the parameter list and the object body, then blank the body out of
  // a working copy so the inline-object pass below does not re-read it.
  const builders = new Map();
  let masked = text;
  const bre = /const\s+([A-Za-z_$][\w$]*)\s*=\s*\(([^)]*)\)\s*:\s*CodeRef\s*=>\s*\(\{/g;
  let bm;
  while ((bm = bre.exec(text)) !== null) {
    const name = bm[1];
    const params = splitArgs(bm[2]).map((p) => {
      const eq = p.indexOf('=');
      const decl = eq === -1 ? p : p.slice(0, eq);
      const def = eq === -1 ? null : p.slice(eq + 1).trim();
      return { name: decl.split(':')[0].replace('?', '').trim(), def };
    });
    // The body runs from the "({" to its matching "})".
    const openObj = text.indexOf('{', bm.index + bm[0].length - 2);
    let depth = 0, endObj = -1;
    for (let i = openObj; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') { depth--; if (depth === 0) { endObj = i; break; } }
    }
    if (endObj === -1) continue;
    const body = text.slice(openObj + 1, endObj);
    builders.set(name, { params, fields: objectFields(body) });
    masked = masked.slice(0, openObj + 1) + ' '.repeat(endObj - openObj - 1) + masked.slice(endObj);
  }

  // ---- 2. Calls to those factories --------------------------------------
  for (const [name, b] of builders) {
    const cre = new RegExp(`(^|[^\\w$.])${name}\\s*\\(`, 'g');
    let cm;
    while ((cm = cre.exec(text)) !== null) {
      const open = text.indexOf('(', cm.index + cm[0].length - 1);
      const call = readCall(text, open);
      if (!call) continue;
      // Skip the factory's own definition line.
      if (/CodeRef\s*=>/.test(text.slice(call.end, call.end + 40))) continue;
      const args = splitArgs(call.inner);
      const repo = resolveField(b.fields.repo, b.params, args, consts);
      const ref = resolveField(b.fields.ref, b.params, args, consts);
      const path = resolveField(b.fields.path, b.params, args, consts);
      const lines = resolveField(b.fields.lines, b.params, args, consts);
      if (repo && ref && path) push('CODE', rel, lineOf(text, cm.index), repo, ref, path, lines);
    }
  }

  // ---- 3. Inline CodeRef object literals ---------------------------------
  //
  // repo:, ref: and path: written out at the citation site, which is what
  // EKSIntegration.tsx and the data modules do.
  const ire = /repo:\s*(['"])([^'"]+)\1/g;
  let im;
  while ((im = ire.exec(masked)) !== null) {
    const window = masked.slice(im.index, im.index + 400);
    const refM = window.match(/\bref:\s*(?:(['"])([^'"]+)\1|([A-Za-z_$][\w$]*))/);
    const pathM = window.match(/\bpath:\s*(['"])([^'"]+)\1/);
    const linesM = window.match(/\blines:\s*(['"])([^'"]+)\1/);
    if (!refM || !pathM) continue;
    const refVal = refM[2] !== undefined ? refM[2] : (consts.get(refM[3]) ?? `?${refM[3]}`);
    push('CODE', rel, lineOf(masked, im.index), im[2], refVal, pathM[2], linesM ? linesM[2] : '');
  }

  // The set of constant values that are used as template prefixes somewhere in
  // this file, so the URL scan below can tell a base apart from a citation.
  const basePrefixes = new Set();
  for (const [name, value] of consts) {
    if (!/^https?:\/\//.test(value)) continue;
    const interpolated = new RegExp('\\$\\{\\s*' + name + '\\s*\\}');
    if (interpolated.test(text)) basePrefixes.add(trimUrl(value));
  }

  // ---- 4. Documentation URLs --------------------------------------------
  //
  // Every https URL that appears inside a string literal, a template literal
  // or JSX body text. Tagged by the token in front of it so the report can
  // separate a declared citation from a URL that happens to sit in a code
  // sample.
  const ure = /https?:\/\/[^\s'"`<>{}\\]+/g;
  let um;
  while ((um = ure.exec(text)) !== null) {
    // A match that stops right before a ${ is the head of a template literal.
    // The template passes below rebuild it with the constant substituted, so
    // skip the truncated head rather than checking a URL that ends in $.
    if (text[um.index + um[0].length] === '{') continue;
    // A module-level constant that is only ever used as a template prefix is a
    // base, not a citation. Checking it on its own reports rot for a URL no
    // reader is ever sent to, and the obvious "fix" is worse than the finding:
    // on 2026-08-02 rewriting one such base to its redirect target broke five
    // working child citations, because only the bare index redirects.
    if (basePrefixes.has(trimUrl(um[0]))) continue;
    const before = text.slice(Math.max(0, um.index - 60), um.index);
    let kind = 'text';
    if (/\b(?:url|href)\s*[:=]\s*[{('"`]*\s*$/.test(before)) kind = 'prop';
    else if (/[,(]\s*['"`]$/.test(before)) kind = 'arg';
    else if (/['"`]$/.test(before)) kind = 'arg';
    push('DOC', rel, lineOf(text, um.index), kind, trimUrl(um[0]));
  }

  // Template-literal URLs built from a module constant, such as
  //   url: `${EC2_DOC}efa.html`
  const tre = /(url|href)\s*[:=]\s*\{?\s*`([^`]*)`/g;
  let tm;
  while ((tm = tre.exec(text)) !== null) {
    const resolved = resolveTemplate(tm[2], consts);
    if (resolved && /^https?:\/\//.test(resolved)) {
      push('DOC', rel, lineOf(text, tm.index), 'prop', trimUrl(resolved));
    }
  }

  // Helper-call URLs built from a constant, such as
  //   doc('EC2 User Guide', `${EC2_DOC}efa.html`, 1)
  const hre = /`([^`]*\$\{[^`]*)`/g;
  let hm;
  while ((hm = hre.exec(text)) !== null) {
    const resolved = resolveTemplate(hm[1], consts);
    if (resolved && /^https?:\/\//.test(resolved)) {
      push('DOC', rel, lineOf(text, hm.index), 'arg', trimUrl(resolved));
    }
  }
}

process.stdout.write(rows.join('\n') + (rows.length ? '\n' : ''));
MJS

# ---------- HTTP helpers ----------

# http_probe <url> -> "<code>\t<num_redirects>\t<effective_url>"
# HEAD first because it is cheaper; fall back to GET when a server refuses
# HEAD, which several AWS endpoints and GitHub Pages do.
http_probe() {
  local url="$1" out code
  out="$(curl -sS -I -L -o /dev/null \
    --max-time "$HTTP_TIMEOUT" --connect-timeout 10 \
    -A "$UA" -H 'Accept: text/html,application/xhtml+xml,*/*' \
    -w '%{http_code}\t%{num_redirects}\t%{url_effective}' \
    "$url" 2>/dev/null)"
  code="${out%%$'\t'*}"
  if [[ "$code" == "000" || "$code" == "403" || "$code" == "405" || "$code" == "501" || "$code" == "404" ]]; then
    out="$(curl -sS -L -o /dev/null \
      --max-time "$HTTP_TIMEOUT" --connect-timeout 10 \
      -A "$UA" -H 'Accept: text/html,application/xhtml+xml,*/*' \
      -w '%{http_code}\t%{num_redirects}\t%{url_effective}' \
      "$url" 2>/dev/null)"
  fi
  printf '%s' "$out"
}

# url_path <url> -> normalised path, with query, fragment, trailing slash, a
# trailing index.html and a trailing .git all removed. The .git case matters
# because a clone URL and its web URL are the same target.
url_path() {
  printf '%s' "$1" \
    | sed -E 's#^[a-z]+://[^/]+##; s/[?#].*$//; s#\.git$##; s#/index\.html$##; s#/+$##'
}

url_host() { printf '%s' "$1" | sed -E 's#^[a-z]+://##; s#/.*$##'; }

# redirect_verdict <original> <effective> -> "OK" | "REDIRECT" | "ROT"
#
# A redirect is benign when the requested page survives it: an https upgrade,
# a trailing slash, a locale segment. It is rot when the server answered with
# something shorter that no longer contains the requested page, which is how
# AWS and GitHub retire a page without ever returning 404.
redirect_verdict() {
  local from to fpath tpath last
  from="$1"; to="$2"
  # A DOI is a resolver. Landing on a different host with a different path is
  # the whole point of one, so a 2xx from doi.org is a success, not rot.
  case "$(url_host "$from")" in
    doi.org|dx.doi.org|www.doi.org) printf 'REDIRECT'; return ;;
  esac
  fpath="$(url_path "$from")"
  tpath="$(url_path "$to")"
  [[ "$fpath" == "$tpath" ]] && { printf 'OK'; return; }
  if [[ -z "$tpath" || "$tpath" == "/" ]]; then printf 'ROT'; return; fi
  last="${fpath##*/}"
  if [[ -z "$last" ]]; then printf 'REDIRECT'; return; fi
  if [[ "$tpath" == *"$last"* ]]; then printf 'REDIRECT'; else printf 'ROT'; fi
}

# The ${a[@]+"${a[@]}"} form is required, not decoration. macOS ships bash
# 3.2, where expanding an empty array under set -u aborts with "hdr[@]:
# unbound variable". That failure is silent in the middle of a loop and turns
# a healthy directory reference into a reported MISSING, so the guard is the
# difference between a true and a false finding.
gh_api() {
  local url="$1" body="$2" hdr=()
  [[ -n "${GITHUB_TOKEN:-}" ]] && hdr=(-H "Authorization: Bearer $GITHUB_TOKEN")
  curl -sS -o "$body" --max-time "$HTTP_TIMEOUT" --connect-timeout 10 \
    -A "$UA" -H 'Accept: application/vnd.github+json' ${hdr[@]+"${hdr[@]}"} \
    -w '%{http_code}' "$url" 2>/dev/null
}

# gh_classify <repo> <ref> <path> -> DIR | FILE | PATH-MISSING | REF-MISSING | MISSING
#
# Called only after a raw fetch already returned 404, so the REST allowance is
# spent on the few references that need it. The contents API is what separates
# the three ways a raw 404 can happen: the path is a directory (raw serves only
# blobs), the path is absent at a ref that does resolve (the misattribution
# case), or the ref itself does not exist.
gh_classify() {
  local repo="$1" ref="$2" path="$3" body="$WORK/api.json" code
  code="$(gh_api "https://api.github.com/repos/$repo/contents/$path?ref=$ref" "$body")"
  if [[ "$code" == "200" ]]; then
    if head -c 1 "$body" | grep -q '\['; then printf 'DIR'; else printf 'FILE'; fi
    return
  fi
  if [[ "$code" != "404" ]]; then printf 'MISSING'; return; fi
  sleep "$GH_DELAY"
  code="$(gh_api "https://api.github.com/repos/$repo/commits/$ref" "$body")"
  case "$code" in
    200) printf 'PATH-MISSING' ;;
    404|422) printf 'REF-MISSING' ;;
    *) printf 'MISSING' ;;
  esac
}

md_escape() { printf '%s' "$1" | sed 's/|/\\|/g'; }

# ---------- network preflight ----------

if [[ "$LIST_ONLY" -eq 0 ]]; then
  if ! curl -sS -o /dev/null --max-time 15 -A "$UA" https://raw.githubusercontent.com/ 2>/dev/null; then
    gate_fail "$CHECK: no network access to raw.githubusercontent.com; cannot run"
    exit 2
  fi
fi

# ---------- target selection ----------

dives=()
while IFS= read -r d; do
  [[ -n "$d" ]] && dives+=("$d")
done < <(gates_opted_in "$CHECK")

if [[ -n "$ONLY_DIVE" ]]; then
  filtered=()
  for d in "${dives[@]:-}"; do
    [[ "$d" == "deep-dives/$ONLY_DIVE" || "$d" == "$ONLY_DIVE" ]] && filtered+=("$d")
  done
  dives=("${filtered[@]:-}")
  if [[ ${#dives[@]} -eq 0 || -z "${dives[0]:-}" ]]; then
    gate_fail "$CHECK: deep-dives/$ONLY_DIVE has no \"$CHECK\": true in .gates.json"
    exit 2
  fi
fi

if [[ ${#dives[@]} -eq 0 || -z "${dives[0]:-}" ]]; then
  gate_skip "$CHECK: no deep dive opted in (add \"$CHECK\": true to deep-dives/{topic}/.gates.json)"
  exit 2
fi

# ---------- per-dive run ----------

EXIT=0

for dive in "${dives[@]}"; do
  topic="$(basename "$dive")"
  gate_step "$CHECK: $dive"

  # Research markdown joins the scan only when the dive opted into it under
  # its own key, so turning it on for one dive cannot lengthen another's run.
  scan_research=0
  if [[ "$(gates_read_flag "$dive/.gates.json" "$RESEARCH_KEY")" == "true" ]]; then
    if [[ -d "$dive/research" ]]; then
      scan_research=1
      gate_note "research scan on ($RESEARCH_KEY): $dive/research/**/*.md, GitHub code refs only"
    else
      gate_warn "$RESEARCH_KEY is true but $dive/research does not exist"
    fi
  fi

  raw="$WORK/$topic.tsv"
  if ! SCAN_RESEARCH="$scan_research" node "$EXTRACT" "$dive" >"$raw" 2>"$WORK/$topic.err"; then
    gate_fail "$CHECK: extractor failed for $dive"
    sed 's/^/    /' "$WORK/$topic.err" >&2
    EXIT=2
    continue
  fi

  # Unique documentation URLs, with the first file:line that cites each and a
  # citation count. Sorting by URL keeps the run order stable.
  awk -F'\t' '$1=="DOC"{print $5"\t"$2":"$3"\t"$4}' "$raw" | sort >"$WORK/$topic.doc.all"
  awk -F'\t' '{ if (!($1 in seen)) { seen[$1]=$2"\t"$3 } n[$1]++ }
              END { for (u in seen) print u"\t"seen[u]"\t"n[u] }' \
    "$WORK/$topic.doc.all" | sort >"$WORK/$topic.doc.uniq"

  # Unique code references keyed on repo|ref|path, keeping the widest cited
  # line range so one fetch answers every citation of that file.
  #
  # Every field is emitted non-empty, with 0 for "no line cited" and - for "no
  # range string". That is not cosmetic. Bash counts tab as IFS whitespace, so
  # `IFS=$'\t' read` collapses a run of tabs into one delimiter and every field
  # after an empty one shifts left. A citation with no line range would then put
  # a file path where the line number belongs, and the numeric comparison below
  # would evaluate that path as arithmetic.
  awk -F'\t' '$1=="CODE"{ s=($7==""?"-":$7); print $4"\t"$5"\t"$6"\t"s"\t"$2":"$3 }' \
    "$raw" | sort >"$WORK/$topic.code.all"
  awk -F'\t' '
    function maxline(range,   n, a, i, m, v) {
      m = 0; n = split(range, a, /[^0-9]+/)
      for (i = 1; i <= n; i++) { v = a[i] + 0; if (v > m) m = v }
      return m
    }
    { key = $1 "\t" $2 "\t" $3
      ml = maxline($4)
      if (!(key in top) || ml > top[key]) top[key] = ml
      if (!(key in first)) { first[key] = $5; spec[key] = $4 }
      n[key]++ }
    END { for (k in n) print k "\t" (top[k] + 0) "\t" spec[k] "\t" first[k] "\t" n[k] }' \
    "$WORK/$topic.code.all" | sort >"$WORK/$topic.code.uniq"

  n_doc=$(wc -l <"$WORK/$topic.doc.uniq" | tr -d ' ')
  n_code=$(wc -l <"$WORK/$topic.code.uniq" | tr -d ' ')
  n_doc_cites=$(wc -l <"$WORK/$topic.doc.all" | tr -d ' ')
  n_code_cites=$(wc -l <"$WORK/$topic.code.all" | tr -d ' ')

  gate_note "extracted $n_doc_cites doc citations ($n_doc unique URLs), $n_code_cites code citations ($n_code unique files)"

  if [[ "$LIST_ONLY" -eq 1 ]]; then
    printf '\n--- documentation URLs ---\n'
    cat "$WORK/$topic.doc.uniq"
    printf '\n--- code references ---\n'
    cat "$WORK/$topic.code.uniq"
    continue
  fi

  # ---- documentation URL checks ----
  : >"$WORK/$topic.doc.res"
  i=0
  while IFS=$'\t' read -r url origin kind count; do
    [[ -n "$url" ]] || continue
    i=$((i + 1))
    probe="$(http_probe "$url")"
    code="$(printf '%s' "$probe" | cut -f1)"
    eff="$(printf '%s' "$probe" | cut -f3)"
    [[ -z "$eff" ]] && eff="$url"

    case "$code" in
      2*) status="$(redirect_verdict "$url" "$eff")" ;;
      404|410) status="DEAD" ;;
      401|403|429) status="BLOCKED" ;;
      5*)
        sleep 2
        probe="$(http_probe "$url")"
        code="$(printf '%s' "$probe" | cut -f1)"
        eff="$(printf '%s' "$probe" | cut -f3)"
        case "$code" in 2*) status="$(redirect_verdict "$url" "$eff")" ;; 404|410) status="DEAD" ;; *) status="ERROR" ;; esac
        ;;
      000) status="TIMEOUT" ;;
      3*) status="ROT" ;;
      *) status="ERROR" ;;
    esac

    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$status" "$code" "$url" "$eff" "$origin" "$kind" "$count" \
      >>"$WORK/$topic.doc.res"
    [[ "$status" == "DEAD" ]] && gate_hit "$origin  DEAD $code  $url"
    [[ "$status" == "ROT" ]] && gate_warn "$origin  ROT ($code -> $eff)  $url"
    printf '\r    docs %d/%d' "$i" "$n_doc" >&2

    case "$url" in
      *github.com*|*githubusercontent.com*|*github.io*) sleep "$GH_DELAY" ;;
      *) sleep "$DELAY" ;;
    esac
  done <"$WORK/$topic.doc.uniq"
  printf '\r    docs %d/%d done\n' "$i" "$n_doc" >&2

  # ---- pinned code reference checks ----
  : >"$WORK/$topic.code.res"
  i=0
  while IFS=$'\t' read -r repo ref path maxline spec origin count; do
    [[ -n "$repo" ]] || continue
    i=$((i + 1))
    body="$WORK/body.txt"
    rawurl="https://raw.githubusercontent.com/$repo/$ref/$path"
    code="$(curl -sS -L -o "$body" --max-time "$HTTP_TIMEOUT" --connect-timeout 10 \
      -A "$UA" -w '%{http_code}' "$rawurl" 2>/dev/null)"
    [[ -z "$code" ]] && code="000"

    total=0
    detail=""
    [[ "$maxline" =~ ^[0-9]+$ ]] || maxline=0
    case "$code" in
      200)
        total="$(awk 'END{print NR}' "$body")"
        if [[ "$maxline" -gt 0 && "$total" -lt "$maxline" ]]; then
          status="SHORT"
          detail="file has $total lines, citation needs line $maxline"
        else
          status="OK"
          detail="$total lines"
        fi
        ;;
      404)
        case "$(gh_classify "$repo" "$ref" "$path")" in
          DIR) status="DIR"; detail="directory, present at the ref; no line check applies" ;;
          FILE) status="OK"; detail="present at the ref via the contents API" ;;
          PATH-MISSING) status="PATH-MISSING"; detail="ref $ref resolves, $path is not in the tree at it" ;;
          REF-MISSING) status="REF-MISSING"; detail="ref $ref does not resolve in $repo" ;;
          *) status="MISSING"; detail="raw fetch returned 404, API check inconclusive" ;;
        esac
        sleep "$GH_DELAY"
        ;;
      429|403) status="BLOCKED"; detail="rate limited by GitHub"; sleep 5 ;;
      000) status="ERROR"; detail="no response" ;;
      *) status="ERROR"; detail="http $code" ;;
    esac

    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
      "$status" "$repo" "$ref" "$path" "$spec" "$maxline" "$total" "$origin" "$detail" \
      >>"$WORK/$topic.code.res"
    case "$status" in
      PATH-MISSING|REF-MISSING|MISSING) gate_hit "$origin  $status  $repo@$ref $path" ;;
      SHORT) gate_hit "$origin  SHORT  $repo@$ref $path ($detail)" ;;
    esac
    printf '\r    code %d/%d' "$i" "$n_code" >&2
    sleep "$GH_DELAY"
  done <"$WORK/$topic.code.uniq"
  printf '\r    code %d/%d done\n' "$i" "$n_code" >&2

  # ---- counts ----
  count_doc() { awk -F'\t' -v s="$1" '$1==s' "$WORK/$topic.doc.res" | wc -l | tr -d ' '; }
  count_code() { awk -F'\t' -v s="$1" '$1==s' "$WORK/$topic.code.res" | wc -l | tr -d ' '; }

  d_ok=$(count_doc OK); d_redir=$(count_doc REDIRECT); d_rot=$(count_doc ROT)
  d_dead=$(count_doc DEAD); d_block=$(count_doc BLOCKED); d_to=$(count_doc TIMEOUT); d_err=$(count_doc ERROR)
  c_ok=$(count_code OK); c_short=$(count_code SHORT); c_path=$(count_code PATH-MISSING)
  c_ref=$(count_code REF-MISSING); c_miss=$(count_code MISSING); c_block=$(count_code BLOCKED)
  c_err=$(count_code ERROR); c_dir=$(count_code DIR)
  c_ok=$((c_ok + c_dir))

  c_gone=$((c_path + c_ref + c_miss))
  bad=$((d_dead + d_rot + c_gone + c_short))

  # ---- report ----
  outdir="${OUT_OVERRIDE:-$dive/audit-reports/verification}"
  mkdir -p "$outdir"
  report="$outdir/citations-$TODAY.md"
  sha="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

  {
    printf '# Citation re-verification: %s\n\n' "$topic"
    printf 'Run date: %s  \n' "$TODAY"
    printf 'Tree: `%s`  \n' "$sha"
    printf 'Check: `scripts/audit/verify-citations.sh` (Tier 1.5, deterministic, networked, no LLM)  \n'
    printf 'Scope: `%s/src/**/*.tsx` and `*.ts`, excluding tests\n' "$dive"
    if [[ "$scan_research" -eq 1 ]]; then
      printf 'Also: `%s/research/**/*.md`, GitHub blob and tree URLs only (`%s`)\n' "$dive" "$RESEARCH_KEY"
    fi
    printf '\n'

    printf '## Summary\n\n'
    printf '| Metric | Count |\n|---|---|\n'
    printf '| Documentation citations extracted | %s |\n' "$n_doc_cites"
    printf '| Unique documentation URLs checked | %s |\n' "$n_doc"
    printf '| URLs resolving cleanly | %s |\n' "$d_ok"
    printf '| URLs redirecting to the same page | %s |\n' "$d_redir"
    printf '| URLs redirecting to an index (rot) | %s |\n' "$d_rot"
    printf '| URLs dead (404 or 410) | %s |\n' "$d_dead"
    printf '| URLs blocked (401, 403, 429) | %s |\n' "$d_block"
    printf '| URLs timed out | %s |\n' "$d_to"
    printf '| URLs erroring | %s |\n' "$d_err"
    printf '| Code citations extracted | %s |\n' "$n_code_cites"
    printf '| Unique pinned files checked | %s |\n' "$n_code"
    printf '| Files present and long enough at the pinned ref | %s |\n' "$c_ok"
    printf '| Of those, directory references (no line check) | %s |\n' "$c_dir"
    printf '| Files present but shorter than the cited line | %s |\n' "$c_short"
    printf '| Files missing at a ref that does resolve | %s |\n' "$c_path"
    printf '| Refs that do not resolve | %s |\n' "$c_ref"
    printf '| Fetch 404 with an inconclusive API check | %s |\n' "$c_miss"
    printf '| Code fetches blocked | %s |\n' "$c_block"
    printf '| Code fetches erroring | %s |\n\n' "$c_err"

    if [[ "$bad" -gt 0 ]]; then
      printf '## Failures\n\n'
      printf 'Every row below needs a text change or a re-pin.\n\n'
      printf '| Kind | Status | Citation | Cited at | Detail |\n|---|---|---|---|---|\n'
      awk -F'\t' '$1=="DEAD" || $1=="ROT"' "$WORK/$topic.doc.res" \
        | while IFS=$'\t' read -r st cd u eff org kd ct; do
            printf '| doc | %s | `%s` | %s | http %s, final `%s` |\n' \
              "$st" "$(md_escape "$u")" "$org" "$cd" "$(md_escape "$eff")"
          done
      awk -F'\t' '$1!="OK" && $1!="DIR"' "$WORK/$topic.code.res" \
        | while IFS=$'\t' read -r st repo ref path spec ml tot org det; do
            printf '| code | %s | `%s@%s %s%s` | %s | %s |\n' \
              "$st" "$repo" "$ref" "$path" "$([[ "$spec" == "-" ]] || printf ' %s' "$spec")" "$org" "$det"
          done
      printf '\n'
    else
      printf '## Failures\n\nNone. Every documentation URL resolved and every pinned code reference exists at its ref with enough lines for the cited range.\n\n'
    fi

    printf '## Documentation URLs\n\n'
    printf '| Status | HTTP | URL | Cited at | Citations | Final URL |\n|---|---|---|---|---|---|\n'
    sort -t$'\t' -k1,1 "$WORK/$topic.doc.res" \
      | while IFS=$'\t' read -r st cd u eff org kd ct; do
          fin="-"
          [[ "$eff" != "$u" ]] && fin="\`$(md_escape "$eff")\`"
          printf '| %s | %s | `%s` | %s | %s | %s |\n' "$st" "$cd" "$(md_escape "$u")" "$org" "$ct" "$fin"
        done
    printf '\n'

    printf '## Pinned code references\n\n'
    printf '| Status | Repo | Ref | Path | Cited lines | Highest line | File lines | Cited at | Citations |\n|---|---|---|---|---|---|---|---|---|\n'
    sort -t$'\t' -k1,1 -k2,2 "$WORK/$topic.code.res" \
      | while IFS=$'\t' read -r st repo ref path spec ml tot org det; do
          printf '| %s | `%s` | `%s` | `%s` | %s | %s | %s | %s | - |\n' \
            "$st" "$repo" "$ref" "$path" "${spec:--}" "${ml:-0}" "${tot:-0}" "$org"
        done
    printf '\n'

    printf '## Method\n\n'
    printf -- '- Documentation URLs are fetched with curl following redirects, with a browser User-Agent and a %s second gap between requests (%s seconds for GitHub hosts).\n' "$DELAY" "$GH_DELAY"
    printf -- '- A redirect counts as rot when the final path no longer contains the last path segment of the requested URL, or lands on the site root. That is how a retired page is served without a 404.\n'
    printf -- '- Pinned code references are fetched from `raw.githubusercontent.com` at the exact ref, never at the default branch. A 404 is then classified with one call to the REST commits API, which separates a bad ref from a file that is not in the tree at a good ref.\n'
    printf -- '- Line ranges are checked by counting the lines of the fetched file and comparing against the highest line number in the citation. This proves the line exists. It does not prove the line still says what the prose claims, which stays agent work (lens L1 in the P5 design).\n'
    printf -- '- BLOCKED and TIMEOUT are not failures. They mean the server refused or did not answer, which is not evidence about the content.\n\n'

    printf '## Limitations\n\n'
    printf -- '- The extractor resolves module-level string constants and `CodeRef` factory functions. A citation assembled at runtime from a value this check cannot see is skipped rather than guessed at.\n'
    printf -- '- URLs inside code samples are checked alongside declared citations. A dead URL in a sample is still a dead URL, but it is not a provenance defect.\n'
    printf -- '- This check confirms that a citation resolves. It does not confirm that the cited text supports the claim.\n'
  } >"$report"

  gate_note "report: $report"

  if [[ "$bad" -gt 0 ]]; then
    gate_fail "$CHECK: $topic has $d_dead dead URL(s), $d_rot rotted URL(s), $c_gone code reference(s) missing at the pinned ref, $c_short short file(s)"
    EXIT=1
  else
    gate_pass "$CHECK: $topic, $n_doc URLs and $n_code pinned files all resolve"
  fi

  printf '\n  %s: %s doc URLs (%s ok, %s redirect, %s rot, %s dead, %s blocked, %s timeout, %s error)\n' \
    "$topic" "$n_doc" "$d_ok" "$d_redir" "$d_rot" "$d_dead" "$d_block" "$d_to" "$d_err"
  printf '  %s: %s pinned files (%s ok, %s short, %s path-missing, %s ref-missing, %s missing, %s blocked, %s error)\n\n' \
    "$topic" "$n_code" "$c_ok" "$c_short" "$c_path" "$c_ref" "$c_miss" "$c_block" "$c_err"
done

exit "$EXIT"
