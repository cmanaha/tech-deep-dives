#!/usr/bin/env node
// revamp/tools/check-renumber.mjs: confirm that every in-dive "section N" reference points to
// the section its sentence means, after the 24-to-27 renumbering of the fine-tuning rebuild.
//
// Usage, from the dive directory:
//   node revamp/tools/check-renumber.mjs            # check; exit 1 on any failure
//   node revamp/tools/check-renumber.mjs --review   # also write the unconfirmed references to
//                                                   # revamp/tools/renumber-review.md
//   node revamp/tools/check-renumber.mjs --accept   # record the current unconfirmed references
//                                                   # as reviewed (after reading the review file)
//
// Each reference is confirmed in one of three ways, in this order:
//   1. Title: "section 8, What RL Does to a Model" or "section 8 (What RL ...)" must name the
//      title App.tsx gives section 8, in full or by its part before a colon. A wrong title
//      fails, whatever else holds.
//   2. Map: the renumber script rewrote it (renumber-ledger.json holds the sentence, the old and
//      the new numbers), the sentence still reads the same, and new = OLD_TO_NEW[old].
//   3. Review: text written in the new numbering (sections 1, 2, 3, 4, 11 and the light edits)
//      has no old number to map from. Its references are read by a person or agent against the
//      section list, and recorded in renumber-reviewed.json keyed by file, number and sentence.
//      Any later change to that sentence drops the record and the reference must be read again.
// Also checked: every number is 1 to 27, and each section file's h1 number matches its place
// in App.tsx.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OLD_TO_NEW, findRefs, lineOf, sentenceAt } from './section-refs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dive = path.resolve(here, '../..');
const ledgerPath = path.join(here, 'renumber-ledger.json');
const reviewedPath = path.join(here, 'renumber-reviewed.json');
const reviewOut = path.join(here, 'renumber-review.md');
const args = process.argv.slice(2);

// ---- Section list from App.tsx ------------------------------------------------------------
const app = readFileSync(path.join(dive, 'src/App.tsx'), 'utf8');
const titles = {};
const idToNumber = {};
for (const m of app.matchAll(/\{ id: '([^']+)', title: '(\d+)\. ((?:[^'\\]|\\.)*)' \}/g)) {
  titles[Number(m[2])] = m[3].replace(/\\'/g, "'");
  idToNumber[m[1]] = Number(m[2]);
}
const count = Object.keys(titles).length;
const idToComponent = {};
for (const m of app.matchAll(/^\s*'?([\w-]+)'?: (\w+),$/gm)) idToComponent[m[1]] = m[2];
const componentToFile = {};
for (const m of app.matchAll(/const (\w+) = React\.lazy\(\(\) =>\s*import\('\.\/sections\/(\w+)'\)/g)) {
  componentToFile[m[1]] = `${m[2]}.tsx`;
}

const norm = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&apos;/g, "'")
    .replace(/[^A-Za-z0-9&' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
const titleNorm = Object.fromEntries(Object.entries(titles).map(([n, t]) => [n, norm(t)]));
// A title with a colon may be given by its part before the colon ("section 11, Distillation or RL").
const shortNorm = Object.fromEntries(
  Object.entries(titles).map(([n, t]) => [n, t.includes(':') ? norm(t.split(':')[0]) : null]),
);
const firstWords = (s, k) => s.split(' ').slice(0, k).join(' ');

const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : [];
const reviewed = existsSync(reviewedPath) ? JSON.parse(readFileSync(reviewedPath, 'utf8')) : [];
const key = (file, nums, sentence) => `${file}|${nums.join(',')}|${sentence}`;
const ledgerKeys = new Map(ledger.map((e) => [key(e.file, e.new, e.sentence), e]));
const reviewedKeys = new Set(reviewed.map((e) => key(e.file, e.numbers, e.sentence)));

const failures = [];
const unconfirmed = [];

// Titles the rebuild retired. A reference that still names one passes the map check (its
// number is right) but tells the reader the old name, so any occurrence fails.
const RETIRED_TITLES = [
  'One Loop, Three Places to Keep What It Learns',
  'From Preferences to Rewards',
  'Choosing a Text Loop, a Hybrid or a Weight Update',
  'RL & Learning Loops on AWS',
];
const tally = { title: 0, map: 0, review: 0, skipped: 0, files: 0, h1: 0 };

for (const [id, n] of Object.entries(idToNumber)) {
  const file = componentToFile[idToComponent[id]];
  if (!file) {
    failures.push(`App.tsx: no section file for id ${id}`);
    continue;
  }
  const src = readFileSync(path.join(dive, 'src/sections', file), 'utf8');
  tally.files++;
  // h1 number and title
  const h1 = /variant="h1"[\s\S]*?>\s*(\d+)\.\s+([^<]+?)\s*</.exec(src);
  if (!h1 || Number(h1[1]) !== n || norm(h1[2]) !== titleNorm[n]) {
    failures.push(`${file}: h1 reads "${h1 ? `${h1[1]}. ${h1[2]}` : 'none'}", App.tsx has "${n}. ${titles[n]}"`);
  } else tally.h1++;

  const flatSrc = src.replace(/&amp;/g, '&').replace(/&apos;/g, "'").replace(/\s+/g, ' ');
  for (const t of RETIRED_TITLES) {
    if (flatSrc.includes(t)) failures.push(`${file}: names the retired title "${t}"`);
  }
  for (const r of findRefs(src)) {
    if (r.skipped) {
      tally.skipped++;
      continue;
    }
    const nums = r.numbers.map((x) => x.value);
    const where = `${file}:${lineOf(src, r.index)}`;
    const bad = nums.filter((v) => !(v >= 1 && v <= count));
    if (bad.length) {
      failures.push(`${where}: section ${bad.join(', ')} does not exist (1 to ${count})`);
      continue;
    }
    // 1. Title given right after a single number?
    const after = src.slice(r.index + r.length, r.index + r.length + 160);
    const tm = /^(?:,\s*|\s*\(|:\s*)((?:[A-Z]|&quot;)[^.;)<{]*)/.exec(after);
    if (nums.length === 1 && tm) {
      const given = norm(tm[1]);
      const want = titleNorm[nums[0]];
      // A title is given when its first three words match the start of any section title.
      const namesSome = Object.values(titleNorm).some((t) => given && firstWords(given, 3) === firstWords(t, 3));
      if (namesSome) {
        const short = shortNorm[nums[0]];
        const ok =
          want.startsWith(given) ||
          given.startsWith(want) ||
          firstWords(given, 4) === firstWords(want, 4) ||
          (short !== null && given.startsWith(short));
        if (!ok) failures.push(`${where}: "section ${nums[0]}, ${tm[1].trim()}" but section ${nums[0]} is "${titles[nums[0]]}"`);
        else tally.title++;
        continue;
      }
    }
    const sentence = sentenceAt(src, r.index);
    // 2. Scripted by the map, sentence unchanged?
    const led = ledgerKeys.get(key(file, [...nums].sort((a, b) => a - b), sentence));
    if (led) {
      const mapped = led.old.map((o) => OLD_TO_NEW[o]).sort((a, b) => a - b);
      if (mapped.join(',') !== [...nums].sort((a, b) => a - b).join(',')) {
        failures.push(`${where}: map says ${led.old.join(',')} -> ${mapped.join(',')}, text has ${nums.join(',')}`);
      } else tally.map++;
      continue;
    }
    // 3. Reviewed?
    if (reviewedKeys.has(key(file, nums, sentence))) {
      tally.review++;
      continue;
    }
    unconfirmed.push({ file, line: lineOf(src, r.index), numbers: nums, sentence });
  }
}

if (args.includes('--review') || args.includes('--accept')) {
  const lines = ['# References awaiting review', '', 'Read each sentence against the section list and confirm the number points to the section it means.', ''];
  lines.push('| # | Section | Title |', '|---|---|---|');
  for (const [n, t] of Object.entries(titles)) lines.push(`| ${n} | ${n} | ${t} |`);
  lines.push('');
  for (const u of unconfirmed) lines.push(`- ${u.file}:${u.line} [${u.numbers.join(', ')}] ${u.sentence}`);
  writeFileSync(reviewOut, lines.join('\n') + '\n');
  console.log(`wrote ${unconfirmed.length} unconfirmed references to ${path.relative(dive, reviewOut)}`);
}
if (args.includes('--accept')) {
  const merged = [...reviewed, ...unconfirmed.map(({ file, numbers, sentence }) => ({ file, numbers, sentence }))];
  writeFileSync(reviewedPath, JSON.stringify(merged, null, 1) + '\n');
  console.log(`recorded ${unconfirmed.length} references as reviewed`);
  tally.review += unconfirmed.length;
  unconfirmed.length = 0;
}

console.log(
  `sections: ${count} in App.tsx, ${tally.files} files, ${tally.h1} h1 headers match; references confirmed by title ${tally.title}, by map ${tally.map}, by review ${tally.review}; ${tally.skipped} skipped as citations or other dives`
);
for (const u of unconfirmed) failures.push(`${u.file}:${u.line}: section ${u.numbers.join(', ')} not confirmed (run --review): ${u.sentence.slice(0, 120)}`);
if (failures.length) {
  console.log(`FAIL: ${failures.length}`);
  for (const f of failures) console.log(`  ${f}`);
  process.exit(1);
}
console.log('PASS');
