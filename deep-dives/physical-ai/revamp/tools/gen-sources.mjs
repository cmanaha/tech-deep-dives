// Build the data behind section 26 and the cited part of sources.md.
//
//   node revamp/tools/gen-sources.mjs          write src/data/cited-sources.json, src/data/glossary.json, sources.md
//   node revamp/tools/gen-sources.mjs --check  exit 1 if a cited ID has no register entry, a cited
//                                              source is missing from sources.md, or the files are stale
//
// The page is the source of truth for what is cited: every citation is a <Cite id="F0N-M"> or a
// figure's cites="..." prop. Each ID is resolved through the claim registers to its pinned source.
// Entries that only join other entries are replaced by their inputs.
import fs from 'node:fs';
import path from 'node:path';
import { DIVE, loadEntries } from './registers.mjs';

const CHECK = process.argv.includes('--check');
const SRC = path.join(DIVE, 'src');
const entries = loadEntries();
const SECTIONS = JSON.parse(fs.readFileSync(path.join(DIVE, 'revamp/tools/sections.json'), 'utf8'));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
    return p.endsWith('.tsx') ? [p] : [];
  });
}
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/\{'([^']*)'\}/g, '$1').replace(/\{[^}]*\}/g, '')
  .replace(/&amp;/g, '&').replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

const problems = [];
const cited = new Map(); // id -> { labels:[], sections:Set }
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  const sec = SECTIONS.find((s) => file.endsWith(`/${s.comp}.tsx`));
  const where = sec ? sec.n : 0;
  const note = (id, label) => {
    if (!entries[id]) { problems.push(`${path.relative(DIVE, file)}: ${id} is not a register entry`); return; }
    if (!cited.has(id)) cited.set(id, { labels: [], sections: new Set() });
    const c = cited.get(id);
    if (label) c.labels.push(label);
    if (where) c.sections.add(where);
  };
  for (const m of text.matchAll(/<Cite\s+id="(F\d\d-\d+)"[^>]*>([\s\S]*?)<\/Cite>/g)) note(m[1], decode(m[2]));
  for (const m of text.matchAll(/\bcites=(?:"([^"]*)"|\{'([^']*)'\}|\{`([^`]*)`\})/g)) {
    for (const id of (m[1] ?? m[2] ?? m[3] ?? '').split(/\s+/).filter((t) => t && !t.startsWith('${'))) note(id, null);
  }
  // Data-driven citations: rows that carry their register IDs as data (cites: 'F..' or id: 'F..', src: '...').
  for (const m of text.matchAll(/\bcites:\s*['"]([^'"]*)['"]/g)) for (const id of m[1].split(/\s+/).filter(Boolean)) note(id, null);
  for (const m of text.matchAll(/\bid:\s*'(F\d\d-\d+)'(?:,\s*src:\s*(?:'([^']*)'|"([^"]*)"))?/g)) note(m[1], m[2] ?? m[3] ?? null);
}

// Resolve to sources, replacing synthesis entries by their inputs.
const sources = new Map(); // key -> record
function add(id, via, depth = 0) {
  const e = entries[id];
  if (!e) return;
  const c = cited.get(via);
  if (!e.url && e.tier !== 0) {
    if (depth < 3) for (const i of e.inputs ?? []) if (i !== id) add(i, via, depth + 1);
    return;
  }
  const key = e.url ? e.url.replace(/#.*$/, '') : e.local;
  if (!sources.has(key)) sources.set(key, { tier: e.tier, url: e.url ? key : null, local: e.url ? null : e.local, venue: e.venue, titles: [], ids: new Set(), sections: new Set(), register: e.register.slice(0, 2), accessed: '2026-11-20' });
  const s = sources.get(key);
  s.ids.add(id);
  if (e.accessed && e.accessed > s.accessed) s.accessed = e.accessed;
  if (id === via) for (const l of c.labels) if (!s.titles.includes(l)) s.titles.push(l);
  for (const n of c.sections) s.sections.add(n);
}
for (const id of cited.keys()) add(id, id);

function fallbackTitle(s) {
  if (s.local) return s.local.replace(/^deep-dives\/physical-ai\//, '');
  const gh = s.url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)(?:\/(?:blob|tree)\/([^/]+)\/(.+))?/);
  if (gh) return gh[3] ? `${gh[1]} @ ${gh[2].slice(0, 12)}: ${gh[3]}` : gh[1];
  const ax = s.url.match(/arxiv\.org\/abs\/(\S+)/);
  if (ax) return `arXiv ${ax[1]}`;
  return s.url.replace(/^https?:\/\//, '');
}
const list = [...sources.values()].map((s) => ({
  tier: s.tier,
  url: s.url,
  local: s.local,
  venue: s.venue ?? null,
  title: (s.titles.sort((a, b) => a.length - b.length)[0] ?? fallbackTitle(s)),
  sections: [...s.sections].sort((a, b) => a - b),
  ...(s.accessed !== '2026-11-20' ? { accessed: s.accessed } : {}),
})).sort((a, b) => a.tier - b.tier || (a.url ?? a.local).localeCompare(b.url ?? b.local));

// Glossary: merge the per-section files in section order; the first definition of a term wins.
const gdir = path.join(DIVE, 'revamp/glossary');
const glossary = new Map();
for (const s of SECTIONS) {
  const f = path.join(gdir, `${s.id}.json`);
  if (!fs.existsSync(f)) continue;
  let arr;
  try { arr = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { problems.push(`glossary/${s.id}.json does not parse: ${e.message}`); continue; }
  for (const g of arr) {
    const key = String(g.term).toLowerCase();
    if (!glossary.has(key)) glossary.set(key, { term: g.term, expansion: g.expansion ?? null, meaning: g.meaning, section: s.n });
  }
}
const glist = [...glossary.values()].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

const TIER_HEAD = {
  0: 'Tier 0: our own measurements',
  1: 'Tier 1: source code at a pinned ref, official documentation, API references',
  2: 'Tier 2: first-party vendor and lab posts (their performance figures stay claims)',
  3: 'Tier 3: papers and third-party technical analysis',
};
const MARK = '<!-- research-list: everything below this line is the full research source list, kept by hand -->';
const outPath = path.join(DIVE, 'sources.md');
const old = fs.readFileSync(outPath, 'utf8');
const tail = old.includes(MARK) ? old.slice(old.indexOf(MARK) + MARK.length) : `\n\n# Full research source list\n\nThe sources the nine claim registers read, cited on the page or not.\n\n${old.replace(/^# .*\n/, '')}`;
let md = `# Physical AI: Sources\n\nEvery source below was accessed on 2026-11-20 unless its line gives another date. The first part is generated by \`revamp/tools/gen-sources.mjs\` from the citations on the page: ${list.length} sources behind ${cited.size} cited register entries. The second part is the full list the research read.\n\nTier ladder (repository standard): Tier 0 our experiments; Tier 1 code, official docs and API references; Tier 2 first-party blogs and talks; Tier 3 papers and third-party analysis; Tier 4 tutorials and press, for locating sources only and never cited.\n\n# Sources cited on the page\n`;
for (const t of [0, 1, 2, 3]) {
  const rows = list.filter((s) => s.tier === t);
  if (!rows.length) continue;
  md += `\n## ${TIER_HEAD[t]}\n\n`;
  for (const s of rows) {
    const where = s.sections.length ? ` (sections ${s.sections.join(', ')})` : '';
    md += s.url ? `- ${s.title}${s.venue ? ` [${s.venue}]` : ''}: ${s.url} (accessed ${s.accessed ?? '2026-11-20'})${where}\n` : `- ${s.title}: \`${s.local}\` in this repository${where}\n`;
  }
}
md += `\n${MARK}${tail}`;

const files = [
  [path.join(SRC, 'data/cited-sources.json'), `${JSON.stringify(list, null, 1)}\n`],
  [path.join(SRC, 'data/glossary.json'), `${JSON.stringify(glist, null, 1)}\n`],
  [outPath, md],
];
if (CHECK) {
  for (const [p, content] of files) if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== content) problems.push(`${path.relative(DIVE, p)} is stale: run gen-sources.mjs`);
  const sm = fs.readFileSync(outPath, 'utf8');
  for (const s of list) if (!sm.includes(s.url ?? s.local)) problems.push(`sources.md lacks ${s.url ?? s.local}`);
} else {
  for (const [p, content] of files) fs.writeFileSync(p, content);
}
console.log(`${cited.size} cited register entries, ${list.length} sources (${[0, 1, 2, 3].map((t) => `T${t}: ${list.filter((s) => s.tier === t).length}`).join(', ')}), ${glist.length} glossary terms`);
for (const p of problems) console.log(`PROBLEM ${p}`);
process.exit(problems.length ? 1 : 0);
