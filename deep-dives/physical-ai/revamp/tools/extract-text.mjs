#!/usr/bin/env node
// revamp/tools/extract-text.mjs: write the rendered text of every section (all panels open) to
// <out>/<nn>-<id>.txt, for the accuracy and reader reviews.
//   node revamp/tools/extract-text.mjs --dist dist --out /tmp/pai-text [--port 4490]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { DIVE } from './registers.mjs';

const require = createRequire(path.resolve(DIVE, '../efa/package.json'));
const { chromium } = require('@playwright/test');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const out = arg('out', '/tmp/pai-text');
fs.mkdirSync(out, { recursive: true });
const ALL = JSON.parse(fs.readFileSync(path.join(DIVE, 'revamp/tools/sections.json'), 'utf8'));
const viteRequire = createRequire(path.join(DIVE, 'package.json'));
const { preview } = await import(viteRequire.resolve('vite'));
const server = await preview({ root: DIVE, build: { outDir: path.resolve(arg('dist', 'dist')) }, preview: { port: Number(arg('port', 4490)), strictPort: false, host: '127.0.0.1' } });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const sec of ALL) {
  await page.goto(`${url}#${sec.id}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction((n) => (document.querySelector('main h1')?.textContent ?? '').trim().startsWith(`${n}.`), sec.n, { timeout: 45000 });
  await page.waitForLoadState('networkidle');
  for (let pass = 0; pass < 6; pass += 1) {
    const opened = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('main [aria-expanded="false"]')).filter((el) => !el.closest('nav') && (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') && el.getBoundingClientRect().width > 0);
      t.forEach((el) => el.click());
      return t.length;
    });
    if (!opened) break;
    await page.waitForTimeout(250);
  }
  const text = await page.evaluate(() => {
    const main = document.querySelector('main');
    const h1 = main.querySelector('h1');
    let root = h1;
    while (root.parentElement && root.parentElement !== main) root = root.parentElement;
    // Diagram text is part of what the reader sees: list each svg's labels after its title.
    const parts = [root.innerText];
    root.querySelectorAll('svg[role="img"]').forEach((svg) => {
      const title = svg.querySelector('title')?.textContent ?? '';
      const labels = Array.from(svg.querySelectorAll('text')).map((t) => t.textContent.trim()).filter(Boolean);
      parts.push(`\n[DIAGRAM] ${title}\n[DIAGRAM LABELS] ${labels.join(' | ')}`);
    });
    return parts.join('\n');
  });
  fs.writeFileSync(path.join(out, `${String(sec.n).padStart(2, '0')}-${sec.id}.txt`), text);
}
await browser.close();
await server.httpServer.close();
console.log(`wrote ${ALL.length} files to ${out}`);
process.exit(0);
