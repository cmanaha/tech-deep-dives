# Authoring brief: vLLM dive refresh to v0.31.0 (shared by every authoring agent)

Research date and accessed date for every citation you add or re-verify: **2026-10-16**.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm`. You own exactly one
section file, named in your task. Edit nothing else. Background mode and subagents are allowed.

## Inputs, in reading order

1. `CLAUDE.md` at the repo root: "Writing Style: No AI Tells", "Diagram Standards",
   "Section Shape", "Acronym Standard".
2. `deep-dives/efa/revamp/section-shape-standard.md` (the governing test) and
   `deep-dives/efa/revamp/leverage-pass-standard.md` (the four verbs; never assert).
3. `deep-dives/efa/revamp/source-authority-standard.md` (code is the authority).
4. `deep-dives/efa/revamp/diagram-plan.md`, section 1 only (lines 15-216): the SVG contract.
5. `deep-dives/vllm/revamp/REVAMP-PLAN.md`: the "Cross-file facts every author uses the same way"
   block (mandatory), then your file's rows (verdicts, treatment, diagram inventory).
6. Your file's claim register under `deep-dives/vllm/research/2026-10-refresh/` (named in your
   task). Every STALE and WRONG verdict gets fixed. Every NEW item the plan assigns to your file
   gets added. UNKNOWN items do not ship as fact.
7. Source trees: `/tmp/vllm-new` (v0.31.0, the pin) for anything you must re-check.

## What the reader must get

- The page describes vLLM **as it is at v0.31.0**, for a technical reader meeting it for the first
  time. Update content in place. No changelog voice anywhere in reader text: no "Correction:", no
  "previously", no "now" used to mean "since the last revision", no "as of the last revision", no
  "updated in", no "what changed" boxes. A version is fine when it is the fact the reader needs
  ("available from v0.29", "removal targeted for v0.32").
- The provenance line(s) near the top that say which commit the section was verified against must
  name `v0.31.0` (commit `db9527a4`) and the date 2026-10-16.
- Keep length flat or shorter unless the plan assigns new material. Reframe, do not pad.
- Every h2 / Header description states the payoff. End each section on the reader's next action.
- No key-takeaways boxes. Demote long evidence into `ExpandableSection`.

## Citations: use the dive's `Cite` component

`import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';` (from `codebase/` use
`'../../components/Cite'`). It renders a tier badge, the external link, and "(accessed DATE)".

```tsx
<Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L40-L52')}>scheduler.py L40-L52</Cite>
<Cite tier={1} href={vllmDocsUrl('design/prefix_caching.html')}>vLLM docs: Prefix caching</Cite>
<Cite tier={2} href="https://blog.vllm.ai/...">vLLM blog: V1 alpha (project claim)</Cite>
<Cite tier={1} href={vllmUrl('vllm/envs.py', 'L88')} kind="code">envs.py L88</Cite>
<Cite tier={1} href="https://docs..." kind="doc-code-conflict">docs page that disagrees</Cite>
```

- Convert every existing inline citation link in your file (`<Link external href=...>... (accessed
  ...)</Link>`) to `<Cite>`, with the correct tier. Plain navigational links that are not evidence
  (for example a "see the EFA dive" cross-link) stay as `Link`.
- vLLM code links go through `vllmUrl(path, 'L<a>-L<b>')` with line numbers read from
  `/tmp/vllm-new`. No `/blob/main/`, `/tree/main/`, or old-SHA (`15652a6b`) URL may remain.
  A directory link uses `https://github.com/vllm-project/vllm/tree/v0.31.0/<dir>`.
- vLLM docs links use `vllmDocsUrl(page)` (versioned v0.31.0 docs) when that page exists
  (`curl -s -o /dev/null -w '%{http_code}' -L <url>` returns 200); otherwise `/en/stable/`.
- Other GitHub projects: pin to the tag or SHA the register resolved.
- Every quantitative claim carries a `Cite`. Vendor performance numbers stay attributed as vendor
  claims in the sentence ("the vLLM team reports up to 1.7x", "AWS's product page lists"). If a
  number has no source in the register or the code, it does not ship.
- Attribution belongs in the link, except the four load-bearing cases in the leverage standard.
- Preserve the scope of every hedge.

## Prose rules the gate enforces (`scripts/gates/no-ai-tells.sh`)

No em-dash (character or `&mdash;`), no en-dash ranges, straight quotes only (no `&ldquo;`
`&rdquo;` `&lsquo;` `&rsquo;` entities, no curly characters; use `"` inside JSX text, or `&quot;`
if needed, and `'` or `&apos;`), none of the banned words (delve, tapestry, seamless, robust,
leverage, boasts, underscores, pivotal, harness, unlock, supercharge, realm, landscape,
testament, game-changer, cutting-edge, best-in-class). Code inside `<code>`/`<pre>` is exempt.
Expand every niche acronym on first use in the file.

## Diagrams

- Contract: `viewBox`, `style={{ width: '100%', height: 'auto' }}`, `role="img"`,
  `aria-labelledby="<slug>-title"` naming exactly ONE id that matches a `<title id="<slug>-title">`
  (the svg-a11y gate cannot resolve a space-separated id list). If you need a long description add
  `<desc id="<slug>-desc">` and `aria-describedby="<slug>-desc"`. Diagram-unique class prefixes and
  marker ids. Light background rect so text never relies on the page colour. Font minimum 10px,
  `sans-serif` explicit. No ASCII art.
- Every number inside a diagram corresponds to a cited claim in the surrounding prose. Schematic
  diagrams carry an "Illustrative, not measured" caption below the SVG.
- Phone legibility: if the smallest label would paint under 8px at a 390px viewport (a 900-unit
  viewBox scales by about 0.37 there), wrap the SVG in `<div style={{ overflowX: 'auto' }}>` and
  give the svg `style={{ width: '100%', minWidth: 640, height: 'auto' }}` so it scrolls instead of
  shrinking, or split it.
- **Verify rendered output** for every diagram you add or change. Build into a private directory
  and run the audit harness:

  ```bash
  cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm/deep-dives/vllm
  npx vite build --outDir /tmp/vllm-dist-<your-slug> --emptyOutDir
  node /tmp/vllm-shoot.mjs --dist /tmp/vllm-dist-<your-slug> --port <your-port> \
       --out /tmp/vllm-shots-<your-slug> --sections <section-id> [--tabs "<Tab label>"]
  ```

  It prints overlaps and clipping measured in viewBox units and writes PNGs at 1440 and 390.
  Read the PNGs of every diagram you touched with the Read tool. Fix every collision or clip and
  re-run until the report is clean. Use the port and slug from your task so parallel agents do not
  collide. Do NOT run `pnpm build` (it writes the shared `dist/`).

## Checks before you report done

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/vllm
pnpm --filter @tech-deep-dives/vllm typecheck
pnpm --filter @tech-deep-dives/vllm lint
grep -nE '/(blob|tree)/(main|master)/|15652a6b' <your file>     # must print nothing
grep -nE '—|&mdash;|&ndash;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|[‘’“”]' <your file>  # must print nothing outside code
```

Typecheck and lint may report errors in files other agents are editing at the same moment. Only
errors in your file are yours to fix.

## Self-check (leverage standard) and report

Diff the claim set: list every assertion in your new text that was not in the old text, with the
source it came from (register row or file:line). Anything without a source comes out.

Return to the orchestrator only (at most 200 words): what the reader now gets from the section,
claims changed (count), diagrams changed or added and the harness result, any register item you
could not resolve, and the exact result lines of typecheck and lint.
