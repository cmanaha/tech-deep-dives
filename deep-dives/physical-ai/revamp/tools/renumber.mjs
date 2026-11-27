#!/usr/bin/env node
// revamp/tools/renumber.mjs: move the dive from the 26-section order to the 30-section order
// (round 2, 2026-11-20: each AWS orchestrator gets its own section).
//
//   node revamp/tools/renumber.mjs [--dry]
//
// OLD_TO_NEW is the whole change: sections 1 to 24 keep their numbers, the four orchestrator
// sections are new at 25 to 28, Choosing moves from 25 to 29 and Glossary and Sources from 26 to 30.
// The script rewrites, in every section file: the h1 "N. Title", and each "section N" /
// "sections N to M" / "sections N, M and P" reference. It then regenerates the three section lists
// (revamp/tools/sections.json is the source; src/lib/sections.ts and playwright/lib/sections.ts follow).
// Run once, on text still in the old numbering. It writes revamp/tools/renumber-ledger.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DIVE = path.resolve(here, '../..');
export const OLD_TO_NEW = Object.fromEntries(Array.from({ length: 26 }, (_, i) => [i + 1, i + 1 <= 24 ? i + 1 : i + 5]));
export const NEW_SECTIONS = [
  { n: 25, id: 'aws-batch', comp: 'AwsBatch', title: 'AWS Batch' },
  { n: 26, id: 'aws-pcs', comp: 'AwsPcs', title: 'AWS Parallel Computing Service' },
  { n: 27, id: 'hyperpod', comp: 'HyperPod', title: 'Amazon SageMaker HyperPod' },
  { n: 28, id: 'eks', comp: 'Eks', title: 'Amazon EKS' },
];
export const RETITLED = { 'aws-orchestration': 'Orchestrating Physical AI on AWS: Which Service Runs Each Workload' };
export const REF = /\b([Ss]ections?)\s+(\d+(?:(?:\s*,\s*and\s+|\s*,\s*|\s+to\s+|\s+and\s+)\d+)*)/g;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dry = process.argv.includes('--dry');
  const jsonPath = path.join(here, 'sections.json');
  const old = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (old.length !== 26) { console.error(`expected the 26-section list, found ${old.length}: already renumbered?`); process.exit(2); }
  const ledger = [];
  const dir = path.join(DIVE, 'src/sections');
  for (const s of old) {
    const file = path.join(dir, `${s.comp}.tsx`);
    let src = fs.readFileSync(file, 'utf8');
    const title = RETITLED[s.id] ?? s.title;
    const h1Old = `${s.n}. ${s.title}`;
    const h1New = `${OLD_TO_NEW[s.n]}. ${title}`;
    if (!src.includes(h1Old)) { console.error(`${s.comp}: h1 "${h1Old}" not found`); process.exit(1); }
    if (h1Old !== h1New) { src = src.split(h1Old).join(h1New); ledger.push({ file: `${s.comp}.tsx`, kind: 'h1', old: h1Old, new: h1New }); }
    src = src.replace(REF, (all, word, list, offset) => {
      const out = list.replace(/\d+/g, (d) => { const nn = OLD_TO_NEW[Number(d)]; if (nn === undefined) throw new Error(`${s.comp}: section ${d} has no mapping`); return String(nn); });
      if (out !== list) ledger.push({ file: `${s.comp}.tsx`, kind: 'ref', line: src.slice(0, offset).split('\n').length, old: `${word} ${list}`, new: `${word} ${out}` });
      return `${word} ${out}`;
    });
    if (!dry) fs.writeFileSync(file, src);
  }
  const next = [...old.map((s) => ({ ...s, n: OLD_TO_NEW[s.n], title: RETITLED[s.id] ?? s.title })), ...NEW_SECTIONS].sort((a, b) => a.n - b.n);
  if (!dry) {
    fs.writeFileSync(jsonPath, `[\n${next.map((s) => ` ${JSON.stringify(s)}`).join(',\n')}\n]\n`);
    const list = next.map((s) => `  { id: '${s.id}', title: '${s.n}. ${s.title.replace(/'/g, "\\'")}' },`).join('\n');
    fs.writeFileSync(path.join(DIVE, 'src/lib/sections.ts'), `/** The ${next.length} sections in reading order. App.tsx and the last section both read this list. */\nexport const sections = [\n${list}\n];\n`);
    fs.writeFileSync(path.join(here, 'renumber-ledger.json'), JSON.stringify(ledger, null, 1) + '\n');
  }
  for (const l of ledger) console.log(`${l.file}${l.line ? `:${l.line}` : ''} ${l.kind}: "${l.old}" -> "${l.new}"`);
  console.log(`${ledger.length} rewrites${dry ? ' (dry run)' : ''}; ${next.length} sections`);
}
