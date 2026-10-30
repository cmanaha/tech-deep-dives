// Generate deep-dives/rl-agentic-loops/sources.md from the <Cite> citations in src/.
//
//   node deep-dives/rl-agentic-loops/revamp/tools/gen-sources.mjs          # write sources.md
//   node deep-dives/rl-agentic-loops/revamp/tools/gen-sources.mjs --check  # exit 1 if sources.md is stale
//
// Every inline citation in the dive goes through the Cite component, so the
// page itself is the source of truth for what is cited. This script reads it
// back out: tier, URL, visible title and accessed date, grouped by tier and
// deduplicated by URL (line fragments on code links collapse to the file).
// The curated Sources appendix array is merged in as well.
// Same tree in, same file out. Adapted from the SGLang dive's generator: adds Tier 0 (our
// experiments), groups Tier 3 papers by venue, and fails on an arXiv link without a version.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const DIVE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(DIVE, 'src');
const OUT = path.join(DIVE, 'sources.md');
const ts = createRequire(path.join(DIVE, 'package.json'))('typescript');

const citeSrc = fs.readFileSync(path.join(SRC, 'components/Cite.tsx'), 'utf8');
// Every `export const NAME = '...'` in Cite.tsx (tags, SHAs, the accessed date) is a constant
// the sections may use in hrefs.
const CONSTS = Object.fromEntries([...citeSrc.matchAll(/export const ([A-Z0-9_]+) = '([^']+)';/g)].map((m) => [m[1], m[2]]));
const DEFAULT_ACCESSED = CONSTS.ACCESSED;
const DIVE_REPO_SHA = CONSTS.DIVE_REPO_SHA;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
    return p.endsWith('.tsx') ? [p] : [];
  });
}


function codeTitle(url) {
  const m = url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:blob|tree)\/([^/]+)\/(.+)$/);
  return m ? `${m[1]} @ ${m[2]}: ${m[3]}` : null;
}

function attr(attrs, name) {
  const at = attrs.search(new RegExp(`(^|\\s)${name}=`));
  if (at < 0) return null;
  let i = attrs.indexOf('=', at) + 1;
  const open = attrs[i];
  if (open === '"' || open === "'") {
    const close = attrs.indexOf(open, i + 1);
    return attrs.slice(i, close + 1);
  }
  if (open !== '{') return null;
  let depth = 0;
  for (let j = i; j < attrs.length; j += 1) {
    if (attrs[j] === '{') depth += 1;
    else if (attrs[j] === '}') {
      depth -= 1;
      if (depth === 0) return attrs.slice(i, j + 1);
    }
  }
  return null;
}

function cleanTitle(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\{' '\}/g, ' ')
    .replace(/\{["'`]([^"'`]*)["'`]\}/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const entries = new Map();
const unresolved = [];
const badArxiv = [];

// Citation hrefs are often built from constants (`const DOCS = sglangDocsUrl('...')`,
// template literals, small helper functions), so the generator parses each file with the
// TypeScript compiler and evaluates the side-effect-free subset of expressions the dive
// uses: string and template literals, identifiers, `+`, property access, object literals,
// calls to the sglang*Url helpers and to local functions whose body is `const` bindings
// and one return. Anything else
// is reported as unresolved rather than guessed.
const SK = ts.SyntaxKind;
const FAIL = Symbol('unresolved');
const COMPLETE = Symbol('complete');
const BASE = {
  ...CONSTS,
  arxiv: (id) => `https://arxiv.org/abs/${id}`,
  gh: (repo, ref, p, l) => `https://github.com/${repo}/blob/${ref}/${String(p).replace(/^\//, '')}${l ? `#${l}` : ''}`,
  ghTree: (repo, ref, d = '') => {
    const dd = String(d).replace(/^\//, '');
    return `https://github.com/${repo}/tree/${ref}${dd ? `/${dd}` : ''}`;
  },
  researchUrl: (p) =>
    `https://github.com/cmanaha/tech-deep-dives/blob/${DIVE_REPO_SHA}/deep-dives/rl-agentic-loops/research/${String(p).replace(/^\//, '')}`,
};
BASE.E0_URL = BASE.researchUrl('2026-10/E0-spark-smoke.md');

function propName(name, env) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  if (ts.isComputedPropertyName(name)) return eva(name.expression, env);
  return FAIL;
}

function makeFn(node, env) {
  const params = node.parameters.map((p) => (ts.isIdentifier(p.name) ? p.name.text : null));
  let body = node.body;
  // A block body may hold `const` bindings before its single trailing `return`.
  let locals = [];
  if (body && ts.isBlock(body)) {
    const stmts = body.statements;
    const last = stmts[stmts.length - 1];
    const lead = stmts.slice(0, -1);
    const plain = lead.every((st) => ts.isVariableStatement(st));
    body = last && ts.isReturnStatement(last) && last.expression && plain ? last.expression : null;
    locals = plain ? lead.flatMap((st) => st.declarationList.declarations) : [];
  }
  if (!body) return FAIL;
  return (...args) => {
    const scope = Object.create(env);
    params.forEach((p, i) => {
      if (p) scope[p] = args[i];
    });
    for (const d of locals) {
      if (!ts.isIdentifier(d.name) || !d.initializer) throw new Error('unresolved');
      const lv = eva(d.initializer, scope);
      if (lv === FAIL) throw new Error('unresolved');
      scope[d.name.text] = lv;
    }
    const v = eva(body, scope);
    if (v === FAIL) throw new Error('unresolved');
    return v;
  };
}

function eva(node, env) {
  switch (node.kind) {
    case SK.StringLiteral:
    case SK.NoSubstitutionTemplateLiteral:
      return node.text;
    case SK.NumericLiteral:
      return Number(node.text);
    case SK.TemplateExpression: {
      let out = node.head.text;
      for (const span of node.templateSpans) {
        const v = eva(span.expression, env);
        if (v === FAIL) return FAIL;
        out += String(v) + span.literal.text;
      }
      return out;
    }
    case SK.Identifier:
      return node.text in env ? env[node.text] : FAIL;
    case SK.ParenthesizedExpression:
    case SK.AsExpression:
    case SK.SatisfiesExpression:
    case SK.NonNullExpression:
      return eva(node.expression, env);
    case SK.BinaryExpression: {
      if (node.operatorToken.kind !== SK.PlusToken) return FAIL;
      const a = eva(node.left, env);
      const b = eva(node.right, env);
      return a === FAIL || b === FAIL ? FAIL : a + b;
    }
    case SK.PropertyAccessExpression:
    case SK.ElementAccessExpression: {
      const obj = eva(node.expression, env);
      const key = ts.isPropertyAccessExpression(node) ? node.name.text : eva(node.argumentExpression, env);
      if (obj === FAIL || key === FAIL || obj === null || typeof obj !== 'object') return FAIL;
      return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : FAIL;
    }
    case SK.ObjectLiteralExpression: {
      const obj = {};
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop)) {
          const k = propName(prop.name, env);
          const v = eva(prop.initializer, env);
          if (k !== FAIL && v !== FAIL) obj[k] = v;
        } else if (ts.isShorthandPropertyAssignment(prop)) {
          const v = eva(prop.name, env);
          if (v !== FAIL) obj[prop.name.text] = v;
        }
      }
      return obj;
    }
    case SK.CallExpression: {
      const fn = eva(node.expression, env);
      if (typeof fn !== 'function') return FAIL;
      const args = node.arguments.map((a) => eva(a, env));
      if (args.includes(FAIL)) return FAIL;
      try {
        return fn(...args);
      } catch {
        return FAIL;
      }
    }
    case SK.ConditionalExpression: {
      const c = eva(node.condition, env);
      if (c === FAIL) return FAIL;
      return eva(c ? node.whenTrue : node.whenFalse, env);
    }
    case SK.ArrayLiteralExpression:
      return node.elements.map((el) => eva(el, env));
    case SK.ArrowFunction:
    case SK.FunctionExpression:
      return makeFn(node, env);
    default:
      return FAIL;
  }
}

function fileEnv(sf) {
  const env = Object.create(BASE);
  const decls = [];
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) decls.push(n);
    else if (ts.isFunctionDeclaration(n) && n.name) decls.push(n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  // Two passes so a constant may refer to one declared later in the file.
  for (let pass = 0; pass < 2; pass += 1) {
    for (const d of decls) {
      const name = d.name.text;
      if (Object.prototype.hasOwnProperty.call(env, name)) continue;
      const v = ts.isFunctionDeclaration(d) ? makeFn(d, env) : eva(d.initializer, env);
      if (v !== FAIL) env[name] = v;
    }
  }
  return env;
}

function jsxText(node, env) {
  let out = '';
  const visit = (n) => {
    if (ts.isJsxText(n)) out += n.text;
    else if (ts.isJsxExpression(n) && n.expression) {
      const v = eva(n.expression, env);
      if (typeof v === 'string') out += v;
    } else ts.forEachChild(n, visit);
  };
  node.children.forEach(visit);
  return out;
}

function bindParams(fn, value, env) {
  // Bind a function's first parameter (a plain name or a destructuring pattern) to `value`.
  const scope = Object.create(env);
  const p = fn.parameters[0];
  if (!p || value === FAIL || value === null || typeof value !== 'object') return scope;
  if (ts.isIdentifier(p.name)) scope[p.name.text] = value;
  else if (ts.isObjectBindingPattern(p.name)) {
    for (const el of p.name.elements) {
      const key = el.propertyName ? el.propertyName.getText() : el.name.getText();
      // An absent prop is bound as undefined, as it is at runtime.
      scope[el.name.getText()] = Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined;
    }
  }
  return scope;
}

function jsxProps(opening, env) {
  const props = {};
  let complete = true;
  for (const a of opening.attributes.properties) {
    if (ts.isJsxSpreadAttribute(a)) continue;
    const init = a.initializer;
    const v = !init ? true : ts.isStringLiteral(init) ? init.text : init.expression ? eva(init.expression, env) : FAIL;
    if (v !== FAIL) props[a.name.getText()] = v;
    else complete = false;
  }
  Object.defineProperty(props, COMPLETE, { value: complete });
  return props;
}

// Scopes a Cite with prop-dependent attributes can be evaluated in: the rows of a Cloudscape
// Table (`cell: (i) => <Cite href={i.href}>` with `items={[...]}`), the elements of
// `array.map((x) => <Cite ...>)`, and every use of a local wrapper component in the same file.
function candidateScopes(n, sf, env, wrapperUses) {
  for (let a = n.parent; a; a = a.parent) {
    if (!(ts.isArrowFunction(a) || ts.isFunctionExpression(a) || ts.isFunctionDeclaration(a))) continue;
    if (ts.isFunctionDeclaration(a) && a.name && /^[A-Z]/.test(a.name.text)) {
      return (wrapperUses.get(a.name.text) ?? []).map((props) => bindParams(a, props, env));
    }
    const call = a.parent;
    if (call && ts.isCallExpression(call) && ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === 'map') {
      const arr = eva(call.expression.expression, env);
      if (Array.isArray(arr)) return arr.map((el) => bindParams(a, el, env));
    }
    for (let b = a.parent; b; b = b.parent) {
      if (ts.isJsxAttribute(b) && b.name.getText(sf) === 'columnDefinitions') {
        const items = b.parent.properties.find((q) => ts.isJsxAttribute(q) && q.name.getText(sf) === 'items');
        const arr = items && items.initializer && items.initializer.expression ? eva(items.initializer.expression, env) : FAIL;
        return Array.isArray(arr) ? arr.map((el) => bindParams(a, el, env)) : [];
      }
      if (ts.isJsxElement(b) || ts.isSourceFile(b)) break;
    }
    return [];
  }
  return [];
}

for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(SRC, file);
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const env = fileEnv(sf);

  // Props passed to each local component, for wrappers that render a Cite from their props.
  const wrapperUses = new Map();
  const collect = (n) => {
    const opening = ts.isJsxElement(n) ? n.openingElement : ts.isJsxSelfClosingElement(n) ? n : null;
    if (opening) {
      const tag = opening.tagName.getText(sf);
      if (/^[A-Z]/.test(tag) && tag !== 'Cite') {
        if (!wrapperUses.has(tag)) wrapperUses.set(tag, []);
        const props = jsxProps(opening, env);
        // A use inside a table cell or a .map() gets one props object per row.
        const rows = props[COMPLETE] ? [] : candidateScopes(n, sf, env, new Map()).map((scope) => jsxProps(opening, scope));
        wrapperUses.get(tag).push(...(rows.length ? rows : [props]));
      }
    }
    ts.forEachChild(n, collect);
  };
  collect(sf);

  const record = (n, opening, scope) => {
    const attrs = jsxProps(opening, scope);
    const tier = Number(attrs.tier);
    const href = attrs.href;
    if (typeof href !== 'string' || !Number.isInteger(tier)) return false;
    if (/arxiv\.org\/(abs|html|pdf)\/\d{4}\.\d{4,5}(?!v\d)/.test(href)) badArxiv.push(`${rel}: ${href}`);
    const accessed = typeof attrs.accessed === 'string' ? attrs.accessed : DEFAULT_ACCESSED;
    // One row per (file URL, tier): a source cited at two tiers stays visible as both.
    const url = href.replace(/#L[0-9-L]+$/, '');
    const key = `${tier} ${url}`;
    const e = entries.get(key) ?? { url, tier, titles: new Set(), accessed: new Set(), files: new Set(), venues: new Set() };
    if (typeof attrs.venue === 'string') e.venues.add(attrs.venue);
    e.titles.add(cleanTitle(ts.isJsxElement(n) ? jsxText(n, scope) : ''));
    e.accessed.add(accessed);
    e.files.add(rel.replace(/^sections\//, '').replace(/\.tsx$/, ''));
    entries.set(key, e);
    return true;
  };

  const visit = (n) => {
    const opening = ts.isJsxElement(n) ? n.openingElement : ts.isJsxSelfClosingElement(n) ? n : null;
    if (opening && opening.tagName.getText(sf) === 'Cite' && !opening.attributes.properties.some(ts.isJsxSpreadAttribute)) {
      if (!record(n, opening, env)) {
        const scopes = candidateScopes(n, sf, env, wrapperUses);
        const ok = scopes.map((scope) => record(n, opening, scope));
        if (ok.length === 0 || ok.includes(false)) {
          const line = sf.getLineAndCharacterOfPosition(opening.getStart(sf)).line + 1;
          unresolved.push(`${rel}:${line}: ${opening.attributes.getText(sf).slice(0, 90)}`);
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

// The in-app Sources appendix (GlossaryAndSources.tsx) is a curated bibliography kept as a
// `Source[]` array. Its entries join the table so sources.md lists everything the app cites.
{
  const file = path.join(SRC, 'sections/GlossaryAndSources.tsx');
  const text = fs.readFileSync(file, 'utf8');
  const unq = (v) => v.replace(/\\'/g, "'");
  const re = /\{ id: \d+, title: '((?:[^'\\]|\\.)*)', url: '([^']+)', tier: (\d), type: '[^']+', accessDate: '([^']+)' \}/g;
  let m;
  let n = 0;
  while ((m = re.exec(text))) {
    n += 1;
    const tier = Number(m[3]);
    const url = m[2];
    const key = `${tier} ${url}`;
    const e = entries.get(key) ?? { url, tier, titles: new Set(), accessed: new Set(), files: new Set(), venues: new Set() };
    e.titles.add(unq(m[1]));
    e.accessed.add(m[4]);
    e.files.add('Sources appendix');
    entries.set(key, e);
  }
  if (n === 0) unresolved.push('sections/GlossaryAndSources.tsx: no Source[] entries matched');
}

const tierHead = {
  0: 'Tier 0: our own experiments (logs in research/)',
  1: 'Tier 1: source code at a pinned ref, official framework documentation, first-party AWS documentation and pricing',
  2: 'Tier 2: first-party lab and vendor posts and talks (their performance figures are claims)',
  3: 'Tier 3: papers (venue or preprint shown) and third-party technical analysis',
  4: 'Tier 4: tutorials, summaries and press (orientation only, never cited as fact)',
};

const lines = [
  '# RL and agentic learning loops deep dive: sources',
  '',
  `Generated from the inline citations in \`src/\` by \`revamp/tools/gen-sources.mjs\`. Do not edit by hand;`,
  'change the citation in the section and regenerate.',
  '',
  `Code citations are pinned to release tags or commits (TRL \`${CONSTS.TRL_TAG}\`, verl \`${CONSTS.VERL_TAG}\`, OpenRLHF`,
  `\`${CONSTS.OPENRLHF_TAG}\`, DSPy \`${CONSTS.DSPY_TAG}\`, gepa \`${CONSTS.GEPA_TAG}\`, autoresearch \`${CONSTS.AUTORESEARCH_SHA}\`, among others),`,
  'and arXiv links to a paper version. Code links are listed per file; the sections link to exact line ranges.',
  'Tiers follow the dive\'s RESEARCH-GUIDE.md section 1. Tier 3 papers show their venue, or "preprint".',
  '',
];
for (const tier of [0, 1, 2, 3, 4]) {
  const rows = [...entries.values()].filter((e) => e.tier === tier).sort((a, b) => a.url.localeCompare(b.url));
  if (rows.length === 0) continue;
  lines.push(`## ${tierHead[tier]}`, '', `${rows.length} sources.`, '');
  lines.push(tier === 3 ? '| Source | Venue | Accessed | Cited in |' : '| Source | Accessed | Cited in |', tier === 3 ? '| --- | --- | --- | --- |' : '| --- | --- | --- |');
  for (const e of rows) {
    const titles = [...e.titles].filter(Boolean);
    const title = (codeTitle(e.url) ?? titles.sort((a, b) => a.length - b.length)[0] ?? e.url).replace(/\|/g, '\\|');
    const acc = [...e.accessed].sort().join(', ');
    const files = [...e.files].sort().join(', ');
    const venue = [...e.venues].sort().join(', ') || 'not stated';
    lines.push(tier === 3 ? `| [${title}](${e.url}) | ${venue} | ${acc} | ${files} |` : `| [${title}](${e.url}) | ${acc} | ${files} |`);
  }
  lines.push('');
}
const out = lines.join('\n');

if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== out) {
    console.error('sources.md is stale: run node deep-dives/rl-agentic-loops/revamp/tools/gen-sources.mjs');
    process.exit(1);
  }
  console.log(`sources.md up to date (${entries.size} sources)`);
} else {
  fs.writeFileSync(OUT, out);
  console.log(`wrote ${OUT}: ${entries.size} sources`);
}
if (badArxiv.length) {
  console.error(`${badArxiv.length} arXiv citation(s) without a version (pin vN):`);
  badArxiv.forEach((u) => console.error(`  ${u}`));
  process.exitCode = 1;
}
if (unresolved.length) {
  console.error(`${unresolved.length} citation(s) with an href the generator could not resolve:`);
  unresolved.slice(0, process.env.ALL ? 100000 : 20).forEach((u) => console.error(`  ${u}`));
}
