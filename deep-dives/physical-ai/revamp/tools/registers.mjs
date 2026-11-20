// Shared parser for the claim registers in research/2026-11/0N-*.md.
// An entry starts at a line `**F0N-M. claim**` and runs to the next entry or `## ` heading.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIVE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const REG_DIR = path.join(DIVE, 'research/2026-11');

export function loadEntries() {
  const entries = {};
  const files = fs.readdirSync(REG_DIR).filter((f) => /^0\d-.*\.md$/.test(f)).sort();
  for (const f of files) {
    const raw = fs.readFileSync(path.join(REG_DIR, f), 'utf8');
    // Shorthand such as `TC@8498` "stands for" a pinned URL prefix, defined once in the register.
    const abbr = [...raw.matchAll(/`([A-Za-z]+@[0-9a-f]+)` stands for `(https:[^`]+)`/g)].map((m) => [m[1], m[2]]);
    const lines = raw.split('\n');
    let cur = null;
    for (const line of lines) {
      const m = line.match(/^\*\*(F0\d-\d+)\.\s*(.*)$/);
      if (m) {
        cur = { id: m[1], register: f, claim: m[2].replace(/\*\*\s*$/, ''), lines: [line] };
        entries[cur.id] = cur;
        continue;
      }
      if (/^#{1,4} /.test(line)) { cur = null; continue; }
      if (cur) {
        let l = line;
        if (l.startsWith('- Evidence:')) for (const [a, u] of abbr) l = l.split(a).join(u);
        cur.lines.push(l);
      }
    }
  }
  for (const e of Object.values(entries)) {
    e.text = e.lines.join('\n');
    const ev = e.lines.find((l) => l.startsWith('- Evidence:')) ?? '';
    const body = ev.replace(/^- Evidence:\s*/, '');
    const parts = body.split(' | ');
    const first = parts[0] ?? '';
    const url = first.match(/https?:\/\/[^\s|)>\]]+/)?.[0]?.replace(/[.,;]+$/, '') ?? null;
    const tierPart = parts.slice(0, 3).find((p) => /^Tier \d,|^Tier \d$|^Tier \d /.test(p.trim()) && !/anchors/.test(p)) ?? '';
    const tier = Number(tierPart.match(/Tier (\d)/)?.[1] ?? NaN);
    let venue = null;
    if (tier === 3) {
      const pv = tierPart.match(/peer-reviewed \(([^)]+)\)/);
      if (pv && pv[1].length <= 40) venue = pv[1];
      else if (/preprint/.test(tierPart)) venue = 'preprint';
    }
    e.location = (e.lines.find((l) => l.startsWith('- Location:')) ?? '').replace(/^- Location:\s*/, '');
    const all = e.text;
    let kind = null;
    if (tier === 0) kind = 'our-run';
    else if (/\[vendor claim/.test(all) || /vendor reported|\(vendor\)/.test(parts[2] ?? '')) kind = 'vendor-claim';
    else if (/\[author reported/.test(all) || /author reported/.test(parts[2] ?? '')) kind = 'author-reported';
    if (tier !== 0 && /^\[derived/.test(e.claim)) kind = 'derived';
    else if (tier !== 0 && (/^.{0,140}\[our reading/.test(e.claim) || /was located in this research/.test(e.claim.slice(0, 400)))) kind = 'our-reading';
    // Entries that join or interpret other entries carry no source of their own.
    e.inputs = [];
    if (!url && tier !== 0) {
      kind = /\[derived/.test(e.claim) || /\[derived\]/.test(body) ? 'derived' : 'our-reading';
      const src = e.location + ' ' + body;
      for (const m of (e.lines.find((l) => l.startsWith('- Location:')) + ' ' + body).matchAll(/(F0\d)-(\d+)(?: to (?:F0\d-)?(\d+))?/g)) {
        const a = Number(m[2]); const b = m[3] ? Number(m[3]) : a;
        for (let i = a; i <= b && i - a < 60; i += 1) e.inputs.push(`${m[1]}-${i}`);
      }
      void src;
    }
    e.url = url;
    e.local = url ? null : (first.match(/`([^`]+)`/)?.[1] ?? first.trim().slice(0, 120));
    e.tier = tier;
    e.venue = venue;
    e.kind = kind;
  }
  return entries;
}
