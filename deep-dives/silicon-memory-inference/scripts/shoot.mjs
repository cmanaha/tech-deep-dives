#!/usr/bin/env node
// scripts/shoot.mjs: screenshot sections of the built dive and probe every
// inline SVG for text collisions and viewBox clipping.
//
// Usage (after `pnpm build`; the script serves dist/ itself with Vite's
// preview server unless --url points at one already running):
//   node scripts/shoot.mjs --sections hbm,hbf --widths 1440,390 \
//     --out /tmp/silicon-shots [--dist /tmp/my-dist]
//
// --dist serves a build from another directory, so parallel authors can each
// run `pnpm exec vite build --outDir /tmp/my-dist` without clobbering dist/.
//
// Writes <out>/<section>-<width>.png (full page) and
// <out>/<section>-<width>-svg<N>.png (one per diagram), then prints any text
// pair whose boxes overlap by more than 2 viewBox units on both axes and any
// text that falls outside the viewBox. Exit code 1 when a finding exists.
//
// Playwright is resolved from the EFA dive, which declares @playwright/test,
// so this dive does not need its own copy.

import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(here, '../../efa/package.json'));
const { chromium } = require('@playwright/test');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), all[i + 1]]);
    return acc;
  }, [])
);
let url = args.url;
let server = null;
if (!url) {
  const viteRequire = createRequire(path.resolve(here, '../package.json'));
  const { preview } = await import(viteRequire.resolve('vite'));
  server = await preview({
    root: path.resolve(here, '..'),
    build: args.dist ? { outDir: path.resolve(args.dist) } : undefined,
    preview: { port: 4317, strictPort: false },
  });
  url = server.resolvedUrls.local[0];
}
const sections = (args.sections ?? '').split(',').filter(Boolean);
const widths = (args.widths ?? '1440,390').split(',').map(Number);
const out = args.out ?? '/tmp/silicon-shots';
mkdirSync(out, { recursive: true });

const OVERLAP_TOL = 2;
const CLIP_TOL = 1;

async function openSection(page, id) {
  const link = page.locator(`a[href="#${id}"]`).first();
  if (!(await link.isVisible())) {
    const toggle = page.locator('button[class*="awsui_navigation-toggle"]').first();
    if (await toggle.isVisible()) {
      await toggle.click();
      await link.waitFor({ state: 'visible', timeout: 15000 });
    }
  }
  await link.click();
  await page.waitForFunction(
    (target) => {
      const cur = document.querySelector('a[href^="#"][aria-current="page"]');
      return cur?.getAttribute('href') === `#${target}` && document.querySelector('main h1');
    },
    id,
    { timeout: 45000 }
  );
  await page.waitForLoadState('networkidle');
  // Open every ExpandableSection so diagrams inside them are measured.
  for (let pass = 0; pass < 6; pass += 1) {
    const opened = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return 0;
      const targets = Array.from(main.querySelectorAll('[aria-expanded="false"]')).filter(
        (el) =>
          !el.closest('nav') &&
          (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') &&
          el.getBoundingClientRect().width > 0
      );
      targets.forEach((el) => el.click());
      return targets.length;
    });
    if (opened === 0) break;
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.waitForTimeout(300);
}

async function probe(page) {
  return page.evaluate(
    ({ OVERLAP_TOL, CLIP_TOL }) => {
      const main = document.querySelector('main');
      const findings = [];
      const svgs = Array.from(main.querySelectorAll('svg')).filter(
        (svg) => svg.querySelector('text') && svg.getBoundingClientRect().width > 0
      );
      svgs.forEach((svg, index) => {
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const inv = ctm.inverse();
        const title = (svg.querySelector(':scope > title')?.textContent ?? '').slice(0, 60);
        const vb = svg.viewBox?.baseVal;
        const texts = Array.from(svg.querySelectorAll('text'))
          .filter((t) => !t.closest('defs') && t.getBoundingClientRect().width > 0)
          .map((t) => {
            const r = t.getBoundingClientRect();
            const a = new DOMPoint(r.left, r.top).matrixTransform(inv);
            const b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
            return {
              text: (t.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 50),
              l: Math.min(a.x, b.x),
              t: Math.min(a.y, b.y),
              r: Math.max(a.x, b.x),
              b: Math.max(a.y, b.y),
            };
          });
        const toUser = (r) => {
          const a = new DOMPoint(r.left, r.top).matrixTransform(inv);
          const b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
          return { l: Math.min(a.x, b.x), t: Math.min(a.y, b.y), r: Math.max(a.x, b.x), b: Math.max(a.y, b.y) };
        };
        const rects = Array.from(svg.querySelectorAll('rect'))
          .filter((el) => !el.closest('defs'))
          .map((el) => toUser(el.getBoundingClientRect()))
          .filter((r) => vb && r.r - r.l < vb.width * 0.95);
        for (let i = 0; i < texts.length; i += 1) {
          const p = texts[i];
          // Text that starts inside a box and runs out of it on either side.
          const cy = (p.t + p.b) / 2;
          for (const box of rects) {
            const cx = (p.l + p.r) / 2;
            const centred = cx > box.l && cx < box.r && cy > box.t && cy < box.b;
            if (centred && (p.l < box.l - CLIP_TOL || p.r > box.r + CLIP_TOL)) {
              findings.push({ index, title, kind: 'box-overflow', a: p.text });
              break;
            }
          }
          if (vb && vb.width > 0) {
            if (
              p.l < vb.x - CLIP_TOL ||
              p.t < vb.y - CLIP_TOL ||
              p.r > vb.x + vb.width + CLIP_TOL ||
              p.b > vb.y + vb.height + CLIP_TOL
            ) {
              findings.push({ index, title, kind: 'clip', a: p.text });
            }
          }
          for (let j = i + 1; j < texts.length; j += 1) {
            const q = texts[j];
            const ox = Math.min(p.r, q.r) - Math.max(p.l, q.l);
            const oy = Math.min(p.b, q.b) - Math.max(p.t, q.t);
            if (ox > OVERLAP_TOL && oy > OVERLAP_TOL) {
              findings.push({ index, title, kind: 'overlap', a: p.text, b: q.text });
            }
          }
        }
      });
      const overflow =
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) >
        window.innerWidth + 1;
      return { count: svgs.length, findings, overflow };
    },
    { OVERLAP_TOL, CLIP_TOL }
  );
}

const browser = await chromium.launch();
let bad = 0;
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main h1', { timeout: 45000 });
    for (const id of sections) {
      await openSection(page, id);
      await page.screenshot({ path: `${out}/${id}-${width}.png`, fullPage: true });
      const svgs = page.locator('main svg:has(text)');
      const n = await svgs.count();
      for (let i = 0; i < n; i += 1) {
        const el = svgs.nth(i);
        if ((await el.boundingBox())?.width) {
          await el.screenshot({ path: `${out}/${id}-${width}-svg${i}.png` });
        }
      }
      const res = await probe(page);
      const status = res.findings.length || res.overflow ? 'FINDINGS' : 'ok';
      console.log(`${id} @${width}: ${res.count} diagram(s), ${status}${res.overflow ? ', page overflows horizontally' : ''}`);
      for (const f of res.findings) {
        console.log(`  [${f.kind}] svg${f.index} "${f.title}": "${f.a}"${f.b ? ` x "${f.b}"` : ''}`);
      }
      if (res.findings.length || res.overflow) bad += 1;
    }
    await page.close();
  }
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.httpServer.close(resolve));
}
process.exit(bad ? 1 : 0);
