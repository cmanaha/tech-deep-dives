// Generate deep-dives/vllm/sources.md from the <Cite> citations in src/.
//
//   node deep-dives/vllm/revamp/tools/gen-sources.mjs          # write sources.md
//   node deep-dives/vllm/revamp/tools/gen-sources.mjs --check  # exit 1 if sources.md is stale
//
// Every inline citation in the dive goes through the Cite component, so the
// page itself is the source of truth for what is cited. This script reads it
// back out: tier, URL, visible title and accessed date, grouped by tier and
// deduplicated by URL (line fragments on code links collapse to the file).
// The curated Sources appendix array is merged in as well.
// Same tree in, same file out.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIVE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(DIVE, 'src');
const OUT = path.join(DIVE, 'sources.md');

const citeSrc = fs.readFileSync(path.join(SRC, 'components/Cite.tsx'), 'utf8');
const TAG = citeSrc.match(/VLLM_TAG = '([^']+)'/)[1];
const SHA = citeSrc.match(/VLLM_SHA = '([^']+)'/)[1];
const DEFAULT_ACCESSED = citeSrc.match(/ACCESSED = '([^']+)'/)[1];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
    return p.endsWith('.tsx') ? [p] : [];
  });
}

function fileConstants(text) {
  // const NAME = 'literal' | "literal" | `literal` (no interpolation), possibly on the next line.
  const out = {};
  const re = /const\s+([A-Z][A-Z0-9_]*)\s*=\s*\n?\s*(['"`])([^'"`$]*)\2/g;
  let m;
  while ((m = re.exec(text))) out[m[1]] = m[3];
  return out;
}

function resolveHref(raw, consts) {
  let m = raw.match(/^"([^"]+)"$/) || raw.match(/^'([^']+)'$/) || raw.match(/^\{\s*["']([^"']+)["']\s*\}$/);
  if (m) return m[1];
  m = raw.match(/^\{\s*`([^`]+)`\s*\}$/);
  if (m) {
    const v = m[1].replace(/\$\{([A-Z][A-Z0-9_]*)\}/g, (_, k) => (k in consts ? consts[k] : `\u0000${k}`));
    return v.includes('\u0000') || v.includes('${') ? null : v;
  }
  m = raw.match(/^\{\s*([A-Z][A-Z0-9_]*)\s*\}$/);
  if (m) return consts[m[1]] ?? null;
  m = raw.match(/^\{\s*vllmUrl\(\s*(?:['"]([^'"]+)['"]|([A-Z][A-Z0-9_]*))(?:\s*,\s*['"]([^'"]+)['"])?\s*,?\s*\)\s*\}$/);
  if (m) {
    const p = m[1] ?? consts[m[2]];
    return p ? `https://github.com/vllm-project/vllm/blob/${TAG}/${p}${m[3] ? `#${m[3]}` : ''}` : null;
  }
  m = raw.match(/^\{\s*vllmDocsUrl\(\s*['"]([^'"]+)['"]\s*,?\s*\)\s*\}$/);
  if (m) return `https://docs.vllm.ai/en/${TAG}/${m[1].replace(/^\//, '')}`;
  return null;
}

function codeTitle(url) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:blob|tree)\/([^/]+)\/(.+)$/);
  return m ? `${m[1]} @ ${m[2]}: ${m[3]}` : null;
}

function attr(attrs, name) {
  const at = attrs.search(new RegExp(`(^|\\s)${name}=`));
  if (at < 0) return null;
  let i = attrs.indexOf('=', at) + 1;
  const open = attrs[i];
  if (open === '"' || open === "'") {
    const close = attrs.indexOf(open, i + 1);
    return attrs.slice(i, close + 1);
  }
  if (open !== '{') return null;
  let depth = 0;
  for (let j = i; j < attrs.length; j += 1) {
    if (attrs[j] === '{') depth += 1;
    else if (attrs[j] === '}') {
      depth -= 1;
      if (depth === 0) return attrs.slice(i, j + 1);
    }
  }
  return null;
}

function cleanTitle(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\{' '\}/g, ' ')
    .replace(/\{["'`]([^"'`]*)["'`]\}/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const entries = new Map();
const unresolved = [];
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(SRC, file);
  const consts = fileConstants(text);
  const re = /<Cite\s+([\s\S]*?)>([\s\S]*?)<\/Cite>/g;
  let m;
  while ((m = re.exec(text))) {
    const attrs = m[1];
    if (attrs.includes('{...')) continue;
    const tierRaw = attr(attrs, 'tier');
    const hrefRaw = attr(attrs, 'href');
    const tier = tierRaw ? Number(tierRaw.replace(/[{}"']/g, '')) : NaN;
    const href = hrefRaw ? resolveHref(hrefRaw.trim(), consts) : null;
    if (!href || !tier) {
      unresolved.push(`${rel}: ${attrs.slice(0, 80)}`);
      continue;
    }
    const accessedRaw = attr(attrs, 'accessed');
    const accessed = accessedRaw ? accessedRaw.replace(/[{}"']/g, '') : DEFAULT_ACCESSED;
    // One row per (file URL, tier): a source cited at two tiers stays visible as both.
    const url = href.replace(/#L[0-9-L]+$/, '');
    const key = `${tier} ${url}`;
    const e = entries.get(key) ?? { url, tier, titles: new Set(), accessed: new Set(), files: new Set() };
    e.titles.add(cleanTitle(m[2]));
    e.accessed.add(accessed);
    e.files.add(rel.replace(/\.tsx$/, ''));
    entries.set(key, e);
  }
}

// The in-app Sources appendix (GlossaryAndSources.tsx) is a curated bibliography kept as a
// `Source[]` array. Its entries join the table so sources.md lists everything the app cites.
{
  const file = path.join(SRC, 'sections/GlossaryAndSources.tsx');
  const text = fs.readFileSync(file, 'utf8');
  const unq = (v) => v.replace(/\\'/g, "'");
  const re = /\{ id: \d+, title: '((?:[^'\\]|\\.)*)', url: '([^']+)', tier: (\d), type: '[^']+', accessDate: '([^']+)' \}/g;
  let m;
  let n = 0;
  while ((m = re.exec(text))) {
    n += 1;
    const tier = Number(m[3]);
    const url = m[2];
    const key = `${tier} ${url}`;
    const e = entries.get(key) ?? { url, tier, titles: new Set(), accessed: new Set(), files: new Set() };
    e.titles.add(unq(m[1]));
    e.accessed.add(m[4]);
    e.files.add('Sources appendix');
    entries.set(key, e);
  }
  if (n === 0) unresolved.push('sections/GlossaryAndSources.tsx: no Source[] entries matched');
}

const tierHead = {
  1: 'Tier 1: source code at a pinned ref, official documentation, API reference, release notes',
  2: 'Tier 2: vendor and project blogs, talks, product pages (vendor figures are vendor claims)',
  3: 'Tier 3: third-party analysis, papers, press',
  4: 'Tier 4: tutorials and unverified posts (orientation only, never cited as fact)',
};

const lines = [
  '# vLLM deep dive: sources',
  '',
  `Generated from the inline citations in \`src/\` by \`revamp/tools/gen-sources.mjs\`. Do not edit by hand;`,
  'change the citation in the section and regenerate.',
  '',
  `Code citations are pinned to vLLM \`${TAG}\` (commit \`${SHA}\`). Code links below are listed per file;`,
  'the sections link to exact line ranges. Tiers follow CLAUDE.md "Fact-Checking & Sources Standard".',
  '',
];
for (const tier of [1, 2, 3, 4]) {
  const rows = [...entries.values()].filter((e) => e.tier === tier).sort((a, b) => a.url.localeCompare(b.url));
  if (rows.length === 0) continue;
  lines.push(`## ${tierHead[tier]}`, '', `${rows.length} sources.`, '');
  lines.push('| Source | Accessed | Cited in |', '| --- | --- | --- |');
  for (const e of rows) {
    const titles = [...e.titles].filter(Boolean);
    const title = (codeTitle(e.url) ?? titles.sort((a, b) => a.length - b.length)[0] ?? e.url).replace(/\|/g, '\\|');
    const acc = [...e.accessed].sort().join(', ');
    const files = [...e.files].sort().join(', ');
    lines.push(`| [${title}](${e.url}) | ${acc} | ${files} |`);
  }
  lines.push('');
}
const out = lines.join('\n');

if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== out) {
    console.error('sources.md is stale: run node deep-dives/vllm/revamp/tools/gen-sources.mjs');
    process.exit(1);
  }
  console.log(`sources.md up to date (${entries.size} sources)`);
} else {
  fs.writeFileSync(OUT, out);
  console.log(`wrote ${OUT}: ${entries.size} sources`);
}
if (unresolved.length) {
  console.error(`${unresolved.length} citation(s) with an href the generator could not resolve:`);
  unresolved.slice(0, 20).forEach((u) => console.error(`  ${u}`));
}
