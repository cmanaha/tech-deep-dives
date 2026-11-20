#!/usr/bin/env node
// revamp/tools/check-section.mjs: render sections of a built dive and check them.
//
//   npx vite build --outDir /tmp/pai-dist-<slug> --emptyOutDir
//   node revamp/tools/check-section.mjs --dist /tmp/pai-dist-<slug> --port 44xx \
//        --out /tmp/pai-shots-<slug> --sections jepa,world-models [--widths 1440,390] [--no-shots]
//   node revamp/tools/check-section.mjs --all --report revamp/check-report.md   (uses dist/)
//
// For every section at every width, with every expandable panel open:
//   1. diagrams: text overlapping text, text outside its box, text clipped by the viewBox
//      (in viewBox units); every step of an animated figure is probed
//   2. layout: page-level horizontal overflow; console errors and page errors
//   3. citations: every <Cite id> resolves to a register entry; every number in a block that
//      carries a citation appears in the text of the entries cited in that block; every number in
//      a block without a citation appears in an entry cited somewhere in the section.
//      Numbers inside <Toy> / <Derived>, citation labels and integers up to 12 are skipped.
//   4. stubs: a section that is still a stub is reported.
// Writes <out>/<section>-<width>.png, one PNG per diagram and one per animation step.
// Exit code 1 when any finding exists.
//
// Playwright is resolved from the EFA dive, which declares @playwright/test.

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { DIVE, loadEntries } from './registers.mjs';

const require = createRequire(path.resolve(DIVE, '../efa/package.json'));
const { chromium } = require('@playwright/test');

const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i += 1) {
  if (!argv[i].startsWith('--')) continue;
  const next = argv[i + 1];
  if (next === undefined || next.startsWith('--')) args[argv[i].slice(2)] = true;
  else { args[argv[i].slice(2)] = next; i += 1; }
}
const ALL = JSON.parse(fs.readFileSync(path.join(DIVE, 'revamp/tools/sections.json'), 'utf8'));
const sections = args.all ? ALL.map((s) => s.id) : String(args.sections ?? '').split(',').filter(Boolean);
const widths = String(args.widths ?? '1440,390').split(',').map(Number);
const out = args.out ?? '/tmp/pai-shots';
const shots = !args['no-shots'];
if (shots) fs.mkdirSync(out, { recursive: true });

const viteRequire = createRequire(path.join(DIVE, 'package.json'));
const { preview } = await import(viteRequire.resolve('vite'));
const server = await preview({
  root: DIVE,
  build: args.dist ? { outDir: path.resolve(args.dist) } : undefined,
  preview: { port: Number(args.port ?? 4470), strictPort: false, host: '127.0.0.1' },
});
const url = server.resolvedUrls.local[0];

const entries = loadEntries();
const NUM = /(?<![A-Za-z0-9.\-_/#])(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?/g;
function tokens(text) {
  const t = text.replace(/\d+(?:\.\d+){2,}/g, ' '); // version strings such as 4.0.1
  const set = new Set();
  for (const m of t.matchAll(NUM)) {
    const raw = (m[1] + (m[2] ?? '')).replace(/,/g, '');
    const v = Number(raw);
    if (Number.isFinite(v)) set.add(String(v));
  }
  return set;
}
const entryTokens = {};
function allowedFor(ids) {
  const set = new Set();
  const seen = new Set();
  const stack = [...ids];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id) || !entries[id]) continue;
    seen.add(id);
    entryTokens[id] ??= tokens(entries[id].text);
    for (const t of entryTokens[id]) set.add(t);
    for (const i of entries[id].inputs ?? []) stack.push(i);
  }
  return set;
}

const OVERLAP_TOL = 2;
const CLIP_TOL = 1;

async function expandAll(page) {
  for (let pass = 0; pass < 6; pass += 1) {
    const opened = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return 0;
      const targets = Array.from(main.querySelectorAll('[aria-expanded="false"]')).filter(
        (el) => !el.closest('nav') && (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') && el.getBoundingClientRect().width > 0,
      );
      targets.forEach((el) => el.click());
      return targets.length;
    });
    if (opened === 0) break;
    await page.waitForTimeout(250);
  }
}

async function openSection(page, sec) {
  await page.goto(`${url}#${sec.id}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    (n) => (document.querySelector('main h1')?.textContent ?? '').trim().startsWith(`${n}.`),
    sec.n,
    { timeout: 45000 },
  );
  await page.waitForLoadState('networkidle');
  await expandAll(page);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForTimeout(300);
}

function probe(page) {
  return page.evaluate(
    ({ OVERLAP_TOL, CLIP_TOL }) => {
      const main = document.querySelector('main');
      const findings = [];
      const svgs = Array.from(main.querySelectorAll('svg')).filter((svg) => svg.querySelector('text') && svg.getBoundingClientRect().width > 0);
      svgs.forEach((svg, index) => {
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const inv = ctm.inverse();
        const title = (svg.querySelector(':scope > title')?.textContent ?? '').slice(0, 60);
        const vb = svg.viewBox?.baseVal;
        const visible = (el) => {
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none') return false;
          for (let n = el; n && n !== svg; n = n.parentElement) if (Number(getComputedStyle(n).opacity) < 0.05) return false;
          return el.getBoundingClientRect().width > 0;
        };
        const toUser = (r) => {
          const a = new DOMPoint(r.left, r.top).matrixTransform(inv);
          const b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
          return { l: Math.min(a.x, b.x), t: Math.min(a.y, b.y), r: Math.max(a.x, b.x), b: Math.max(a.y, b.y) };
        };
        const texts = Array.from(svg.querySelectorAll('text'))
          .filter((t) => !t.closest('defs') && visible(t))
          .map((t) => ({ text: (t.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 50), px: t.getBoundingClientRect().height, ...toUser(t.getBoundingClientRect()) }));
        const rects = Array.from(svg.querySelectorAll('rect'))
          .filter((el) => !el.closest('defs') && visible(el))
          .map((el) => toUser(el.getBoundingClientRect()))
          .filter((r) => vb && r.r - r.l < vb.width * 0.95);
        for (let i = 0; i < texts.length; i += 1) {
          const p = texts[i];
          const cy = (p.t + p.b) / 2;
          const cx = (p.l + p.r) / 2;
          for (const box of rects) {
            const centred = cx > box.l && cx < box.r && cy > box.t && cy < box.b;
            if (centred && (p.l < box.l - CLIP_TOL || p.r > box.r + CLIP_TOL)) {
              findings.push({ index, title, kind: 'box-overflow', a: p.text });
              break;
            }
          }
          if (vb && vb.width > 0 && (p.l < vb.x - CLIP_TOL || p.t < vb.y - CLIP_TOL || p.r > vb.x + vb.width + CLIP_TOL || p.b > vb.y + vb.height + CLIP_TOL)) {
            findings.push({ index, title, kind: 'clip', a: p.text });
          }
          // A line of text painted under about 7px tall cannot be read on a phone.
          if (p.px > 0 && p.px < 8.5) findings.push({ index, title, kind: 'tiny-text', a: `${p.text} (${p.px.toFixed(1)}px line)` });
          for (let j = i + 1; j < texts.length; j += 1) {
            const q = texts[j];
            const ox = Math.min(p.r, q.r) - Math.max(p.l, q.l);
            const oy = Math.min(p.b, q.b) - Math.max(p.t, q.t);
            if (ox > OVERLAP_TOL && oy > OVERLAP_TOL) findings.push({ index, title, kind: 'overlap', a: p.text, b: q.text });
          }
        }
      });
      const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth + 1;
      return { count: svgs.length, findings, overflow };
    },
    { OVERLAP_TOL, CLIP_TOL },
  );
}

function collectClaims(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    const BLOCK = '[data-claim], figure, tr, li, p, dd, dt, h1, h2, h3, h4';
    const SKIP = '[data-cite-id], [data-num], button, nav, script, style, [data-placeholder] strong, [aria-hidden="true"]';
    const blocks = new Map();
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const el = node.parentElement;
      if (!el || el.closest(SKIP)) continue;
      const text = node.nodeValue ?? '';
      if (!/\d/.test(text)) continue;
      const block = el.closest(BLOCK) ?? el.closest('div') ?? main;
      if (!blocks.has(block)) blocks.set(block, []);
      blocks.get(block).push(text);
    }
    const res = [];
    for (const [block, texts] of blocks) {
      const ids = new Set(Array.from(block.querySelectorAll('[data-cite-id]')).map((c) => c.getAttribute('data-cite-id')));
      const fig = block.closest('[data-cites]');
      for (const id of (fig?.getAttribute('data-cites') ?? '').split(/\s+/).filter(Boolean)) ids.add(id);
      res.push({ tag: block.tagName.toLowerCase(), text: texts.join(' ').replace(/\s+/g, ' ').trim(), cites: [...ids], full: (block.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 160) });
    }
    const allCites = Array.from(main.querySelectorAll('[data-cite-id]')).map((c) => c.getAttribute('data-cite-id'));
    for (const f of main.querySelectorAll('[data-cites]')) allCites.push(...(f.getAttribute('data-cites') ?? '').split(/\s+/).filter(Boolean));
    return {
      blocks: res,
      allCites,
      missing: Array.from(main.querySelectorAll('[data-cite-missing]')).map((c) => c.getAttribute('data-cite-id')),
      stub: Boolean(main.querySelector('[data-stub]')),
      mathErrors: Array.from(main.querySelectorAll('.katex-error')).map((e) => (e.getAttribute('title') ?? e.textContent ?? '').slice(0, 120)),
      plainFormulas: Array.from(main.querySelectorAll('code')).map((c) => c.textContent ?? '').filter((t) => /[=≈].*(\\|\^|_\{|\bsum\b|\bE\[)/.test(t) && !c.closest('pre')).map((t) => t.slice(0, 80)),
      brokenMedia: Array.from(main.querySelectorAll('figure[data-capture] img')).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
      captures: main.querySelectorAll('figure[data-capture]').length,
      mediaNoProvenance: Array.from(main.querySelectorAll('figure[data-capture]')).filter((f) => !f.querySelector('[data-num="provenance"]')).length,
      placeholders: main.querySelectorAll('[data-placeholder]').length,
      animated: main.querySelectorAll('figure[data-animated]').length,
      words: (main.innerText ?? '').split(/\s+/).length,
    };
  });
}

const browser = await chromium.launch();
const report = [];
let bad = 0;
const summary = [];
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 200)}`));
    for (const id of sections) {
      const sec = ALL.find((s) => s.id === id);
      if (!sec) { console.log(`unknown section ${id}`); bad += 1; continue; }
      consoleErrors.length = 0;
      const lines = [];
      await openSection(page, sec);
      if (shots) await page.screenshot({ path: `${out}/${id}-${width}.png`, fullPage: true });
      const res = await probe(page);
      const findings = res.findings.map((f) => `[${f.kind}] svg${f.index} "${f.title}": "${f.a}"${f.b ? ` x "${f.b}"` : ''}`);
      if (res.overflow) findings.push('[page-overflow] the page scrolls sideways');
      if (shots) {
        const svgs = page.locator('main svg:has(text)');
        const n = await svgs.count();
        for (let i = 0; i < n; i += 1) {
          const el = svgs.nth(i);
          if ((await el.boundingBox())?.width) await el.screenshot({ path: `${out}/${id}-${width}-svg${i}.png` });
        }
      }
      // Animated figures: walk every step, probe and shoot each.
      const figs = page.locator('main figure[data-animated]');
      const nf = await figs.count();
      for (let i = 0; i < nf; i += 1) {
        const fig = figs.nth(i);
        const reset = fig.getByRole('button', { name: /^Back to the first step/ });
        if (await reset.isEnabled()) await reset.click();
        for (let k = 0; k < 60; k += 1) {
          await page.waitForTimeout(450);
          const r = await probe(page);
          for (const f of r.findings) {
            const line = `[${f.kind}] animation ${i} step ${k + 1}, svg${f.index} "${f.title}": "${f.a}"${f.b ? ` x "${f.b}"` : ''}`;
            if (!findings.includes(line) && !findings.some((x) => x.endsWith(line.split(', svg')[1] ?? '\u0000'))) findings.push(line);
          }
          if (r.overflow && !findings.includes('[page-overflow] the page scrolls sideways')) findings.push('[page-overflow] the page scrolls sideways');
          if (shots) {
            const svg = fig.locator('svg').first();
            if ((await svg.count()) && (await svg.boundingBox())?.width) await svg.screenshot({ path: `${out}/${id}-${width}-anim${i}-step${k + 1}.png` });
          }
          const next = fig.getByRole('button', { name: /^Next step/ });
          if (!(await next.isEnabled())) break;
          await next.click();
        }
      }
      const claims = await collectClaims(page);
      if (claims.stub) findings.push('[stub] the section is still a stub');
      for (const m of claims.missing) findings.push(`[cite] unresolved register ID ${m}`);
      for (const m of claims.mathErrors) findings.push(`[math] formula does not parse: ${m}`);
      for (const m of claims.brokenMedia) findings.push(`[capture] image did not load: ${m}`);
      if (claims.mediaNoProvenance) findings.push(`[capture] ${claims.mediaNoProvenance} capture(s) without a provenance line`);
      const sectionIds = [...new Set(claims.allCites)];
      for (const c of sectionIds) if (!entries[c]) findings.push(`[cite] ${c} is not a register entry`);
      const sectionAllowed = allowedFor(sectionIds);
      // Section 26 is generated from the registers and the per-section glossaries: its own numbers are
      // counts of its lists, so the number check does not apply to it.
      if (width === widths[0] && id !== 'sources') {
        for (const b of claims.blocks) {
          const nums = [...tokens((b.tag === 'h1' ? b.text.replace(/^\s*\d+\.\s/, ' ') : b.text).replace(/\b[Ss]ections?\s+\d+(?:(?:\s*,\s*|\s+to\s+|\s+and\s+|\s*,\s*and\s+)\d+)*/g, ' '))].filter((n) => !(Number.isInteger(Number(n)) && Number(n) <= 12));
          if (!nums.length) continue;
          const allowed = b.cites.length ? allowedFor(b.cites) : sectionAllowed;
          const miss = nums.filter((n) => !allowed.has(n));
          if (miss.length) {
            findings.push(`[number] ${miss.join(', ')} not in ${b.cites.length ? `the entries cited in this block (${b.cites.join(' ')})` : 'any entry cited in the section (block has no citation)'}: <${b.tag}> "${b.full}"`);
          }
        }
      }
      for (const e of [...new Set(consoleErrors)]) findings.push(`[console] ${e}`);
      const status = findings.length ? `${findings.length} FINDING(S)` : 'ok';
      lines.push(`${id} @${width}: ${res.count} diagram(s), ${claims.animated} animated, ${sectionIds.length} cited entries, ${claims.placeholders} placeholder(s), ~${claims.words} words, ${status}`);
      for (const f of findings) lines.push(`  ${f}`);
      console.log(lines.join('\n'));
      report.push(...lines);
      summary.push({ id, n: sec.n, width, diagrams: res.count, animated: claims.animated, cites: sectionIds, placeholders: claims.placeholders, words: claims.words, findings: findings.length });
      if (findings.length) bad += 1;
    }
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
if (args.report) fs.writeFileSync(path.resolve(String(args.report)), `# Section check report\n\n\`\`\`\n${report.join('\n')}\n\`\`\`\n`);
if (args.json) fs.writeFileSync(path.resolve(String(args.json)), JSON.stringify(summary, null, 1));
console.log(bad ? `\n${bad} section view(s) with findings` : '\nall clean');
process.exit(bad ? 1 : 0);
