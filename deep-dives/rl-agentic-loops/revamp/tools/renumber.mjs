#!/usr/bin/env node
// revamp/tools/renumber.mjs: renumber the dive's in-dive section references from the
// 24-section order to the 27-section order (the fine-tuning rebuild, 2026-11-07).
//
// Usage, from the dive directory:
//   node revamp/tools/renumber.mjs [--dry] src/sections/A.tsx src/sections/B.tsx ...
//
// For each file it rewrites, through OLD_TO_NEW in section-refs.mjs:
//   - the h1 Header's leading "N. " (the section's own number);
//   - every "section N" / "sections N to M" / "sections N, M and P" reference in prose,
//     diagram labels and strings, except references into cited papers (see section-refs.mjs).
// Run it once per file, on text still in the old numbering. Files written in the new
// numbering (the reworked sections 1 and 2 and the new sections 3, 4 and 11) are not passed.
//
// Writes revamp/tools/renumber-ledger.json: one entry per rewritten reference (file, line,
// old and new text, and the sentence after the rewrite), which check-renumber.mjs uses to
// confirm each scripted reference against the map. Prints counts per file.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OLD_TO_NEW, findRefs, lineOf, sentenceAt } from './section-refs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ledgerPath = path.join(here, 'renumber-ledger.json');
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const files = args.filter((a) => !a.startsWith('--'));
if (files.length === 0) {
  console.error('usage: renumber.mjs [--dry] file...');
  process.exit(2);
}

const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : [];
let total = 0;
let totalSkipped = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const edits = []; // { index, length, text }
  const h1 = /(variant="h1"[\s\S]*?>\s*)(\d+)(\.\s)/.exec(src);
  if (h1) {
    const idx = h1.index + h1[1].length;
    const oldN = Number(h1[2]);
    edits.push({ index: idx, length: h1[2].length, text: String(OLD_TO_NEW[oldN]), kind: 'h1', oldN });
  }
  const refs = findRefs(src);
  let skipped = 0;
  for (const r of refs) {
    if (r.skipped) {
      skipped++;
      continue;
    }
    for (const n of r.numbers) {
      const nn = OLD_TO_NEW[n.value];
      if (nn === undefined) throw new Error(`${file}:${lineOf(src, n.index)} section ${n.value} has no mapping`);
      edits.push({ index: n.index, length: String(n.value).length, text: String(nn), kind: 'ref', oldN: n.value, refIndex: r.index });
    }
  }
  edits.sort((a, b) => b.index - a.index);
  let out = src;
  for (const e of edits) out = out.slice(0, e.index) + e.text + out.slice(e.index + e.length);
  // Ledger entries carry the sentence as it reads after the rewrite.
  const refEdits = edits.filter((e) => e.kind === 'ref');
  const byRef = new Map();
  for (const e of refEdits) {
    if (!byRef.has(e.refIndex)) byRef.set(e.refIndex, []);
    byRef.get(e.refIndex).push(e);
  }
  // Offsets shift by the length change of every edit before them.
  const shift = (i) =>
    edits.filter((e) => e.index < i).reduce((acc, e) => acc + e.text.length - e.length, 0);
  for (const [refIndex, es] of byRef) {
    const newIndex = refIndex + shift(refIndex);
    ledger.push({
      file: path.basename(file),
      line: lineOf(out, newIndex),
      old: es.map((e) => e.oldN).sort((a, b) => a - b),
      new: es.map((e) => Number(e.text)).sort((a, b) => a - b),
      sentence: sentenceAt(out, newIndex),
    });
  }
  total += refEdits.length;
  totalSkipped += skipped;
  console.log(
    `${path.basename(file)}: h1 ${h1 ? `${h1[2]} -> ${OLD_TO_NEW[Number(h1[2])]}` : 'none'}, ${byRef.size} references (${refEdits.length} numbers) rewritten, ${skipped} skipped as citations`
  );
  if (!dry) writeFileSync(file, out);
}
if (!dry) writeFileSync(ledgerPath, JSON.stringify(ledger, null, 1) + '\n');
console.log(`total: ${total} numbers rewritten, ${totalSkipped} citation matches skipped${dry ? ' (dry run)' : ''}`);
