// Build src/data/registry.json from the claim registers: one record per entry with the pinned
// source URL, tier, venue and provenance kind. The Cite component resolves register IDs here.
//   node revamp/tools/gen-registry.mjs
import fs from 'node:fs';
import path from 'node:path';
import { DIVE, loadEntries } from './registers.mjs';

const entries = loadEntries();
const out = {};
let bad = 0;
for (const e of Object.values(entries)) {
  const synth = !e.url && e.tier !== 0;
  if (!synth && !Number.isFinite(e.tier)) { console.error(`no tier: ${e.id}`); bad += 1; continue; }
  const rec = { t: synth ? -1 : e.tier };
  if (e.url) rec.u = e.url; else if (!synth) rec.l = e.local;
  if (synth) rec.i = [...new Set(e.inputs)].filter((x) => entries[x] && x !== e.id);
  if (e.venue) rec.v = e.venue;
  if (e.kind) rec.k = e.kind;
  out[e.id] = rec;
}
const sorted = Object.fromEntries(Object.keys(out).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).map((k) => [k, out[k]]));
fs.writeFileSync(path.join(DIVE, 'src/data/registry.json'), JSON.stringify(sorted, null, 0).replace(/},"/g, '},\n"') + '\n');
console.log(`${Object.keys(sorted).length} entries written, ${bad} without tier`);
