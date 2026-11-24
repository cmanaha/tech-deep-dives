#!/usr/bin/env node
// revamp/tools/check-renumber.mjs: confirm the 30-section numbering holds everywhere.
//   node revamp/tools/check-renumber.mjs        exit 1 on any finding
// Checks: sections.json is 1..30 in order; every section file's h1 is "N. Title"; src/lib/sections.ts,
// playwright/lib/sections.ts and App.tsx carry the same list; every "section N" reference points at an
// existing section, and where a title follows the number ("section 24, Orchestrating ...") it is the
// title of that section; no file still prints a retired title; Getting Started's labels, parts and
// routes cover exactly 1..30; every ledger rewrite is still present.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REF, RETITLED } from './renumber.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const DIVE = path.resolve(here, '../..');
const secs = JSON.parse(fs.readFileSync(path.join(here, 'sections.json'), 'utf8'));
const bad = [];
const N = secs.length;
if (N !== 30) bad.push(`sections.json has ${N} sections, expected 30`);
secs.forEach((s, i) => { if (s.n !== i + 1) bad.push(`sections.json: ${s.id} has n=${s.n} at position ${i + 1}`); });
const read = (p) => fs.readFileSync(path.join(DIVE, p), 'utf8');
const norm = (t) => t.replace(/\s+/g, ' ');
const app = read('src/App.tsx'); const lib = read('src/lib/sections.ts'); const pw = read('playwright/lib/sections.ts');
const RETIRED = ['Orchestrating It on AWS', '25. Choosing', '26. Glossary and Sources'];
let refs = 0;
for (const s of secs) {
  const file = `src/sections/${s.comp}.tsx`;
  if (!fs.existsSync(path.join(DIVE, file))) { bad.push(`${file} is missing`); continue; }
  const src = read(file);
  if (!src.includes(`${s.n}. ${s.title}`)) bad.push(`${file}: h1 "${s.n}. ${s.title}" not found`);
  const row = `{ id: '${s.id}', title: '${s.n}. ${s.title}' }`;
  if (!lib.includes(row)) bad.push(`src/lib/sections.ts lacks ${row}`);
  if (!pw.includes(row)) bad.push(`playwright/lib/sections.ts lacks ${row}`);
  if (!app.includes(`'${s.id}': ${s.comp},`) || !app.includes(`import('./sections/${s.comp}')`)) bad.push(`App.tsx does not route ${s.id} to ${s.comp}`);
  const flat = norm(src);
  for (const r of RETIRED) if (flat.includes(r)) bad.push(`${file}: retired title "${r}"`);
  for (const m of flat.matchAll(REF)) {
    const nums = m[2].match(/\d+/g).map(Number);
    refs += nums.length;
    for (const n of nums) if (n < 1 || n > N) bad.push(`${file}: "${m[0]}" points outside 1..${N}`);
    // "section 24, Orchestrating Physical AI on AWS": a title after a single number must be that section's title.
    if (nums.length === 1) {
      const after = flat.slice(m.index + m[0].length, m.index + m[0].length + 90);
      const t = after.match(/^, ([A-Z][^.;:()<{]*)/);
      if (t) {
        // A cross-reference names a section by its short name, the part of the title before the colon.
        const shortName = (x) => (x?.title ?? '').split(':')[0];
        const target = shortName(secs[nums[0] - 1]);
        const said = t[1].trim();
        const other = secs.find((x) => x.n !== nums[0] && said.startsWith(shortName(x)));
        if (other && !said.startsWith(target)) bad.push(`${file}: "section ${nums[0]}, ${said.slice(0, 40)}" names section ${other.n}'s title`);
      }
    }
  }
}
const gs = read('src/sections/GettingStarted.tsx');
const short = [...gs.matchAll(/^\s{2}(\d+): '/gm)].map((m) => Number(m[1]));
if (short.join() !== secs.map((s) => s.n).join()) bad.push(`GettingStarted SHORT covers ${short.join(',')}`);
const parts = [...gs.matchAll(/\{ name: '[^']+', sections: \[([\d, ]+)\] \}/g)].flatMap((m) => m[1].split(',').map(Number));
if (parts.join() !== secs.map((s) => s.n).join()) bad.push(`GettingStarted PARTS cover ${parts.join(',')}`);
for (const m of gs.matchAll(/tag: '\w', text: '[^']+', sections: \[([\d, ]+)\]/g)) for (const n of m[1].split(',').map(Number)) if (n < 1 || n > N) bad.push(`GettingStarted route names section ${n}`);
if (!gs.includes(`<Nav>${N}</Nav> sections`)) bad.push('GettingStarted does not say the section count');
const ledger = JSON.parse(fs.readFileSync(path.join(here, 'renumber-ledger.json'), 'utf8'));
for (const l of ledger.filter((x) => x.kind === 'h1')) if (!read(`src/sections/${l.file}`).includes(l.new)) bad.push(`${l.file}: ledger h1 "${l.new}" is gone`);
for (const [id, title] of Object.entries(RETITLED)) if (secs.find((s) => s.id === id)?.title !== title) bad.push(`${id} is not titled "${title}"`);
for (const p of ['README.md']) { const t = read(p); if (/\b26 sections\b|26-section/.test(t)) bad.push(`${p} still says 26 sections`); }
for (const b of bad) console.log(b);
console.log(bad.length ? `${bad.length} finding(s)` : `renumber check clean: ${N} sections, ${refs} section references, ${ledger.length} ledger rewrites`);
process.exit(bad.length ? 1 : 0);
