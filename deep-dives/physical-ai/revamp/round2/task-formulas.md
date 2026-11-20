# Task: typeset the formulas of your sections as real mathematics, and add the ones the mechanism has

Work in this git worktree, dive directory `deep-dives/physical-ai/`. Today is 2026-11-20. FIRST read
`revamp/authoring-brief.md` in full (it binds: reader, evidence and `Cite` rules, prose rules, the check tool,
return format; its sentence "no LaTeX, no math dependency" is lifted by this task), `CLAUDE.md` at the repo root
("Explaining Concepts"), `docs/standards/explaining-concepts.md` (the worked KL example shows the bar), and
`src/components/Math.tsx`. Never put personal data (names, email addresses, account ids, hostnames, home-directory
paths) in any request, header, User-Agent, URL or query string; give any subagent that rule verbatim. No git write
commands, never run `pnpm build`, no AWS calls, no SSH, no messages. No dollar figures. The talk's session code
(letters C-M-P, digits 4-0-7) never appears.

The owner's words: "I would like to see formulas properly. I would like to see proper formulas."

You own the section files named in your task and ONE new register file named there. Edit nothing else.

## The components

```tsx
import { Formula, M } from '../components/Math';

<Formula name="Behaviour cloning loss" tex={String.raw`\mathcal{L}_{\mathrm{BC}}(\theta) = \frac{1}{N}\sum_{i=1}^{N} \lVert \pi_\theta(o_i) - a_i \rVert_1`} source={<Cite id="F02-9">ACT paper, section IV</Cite>} />
... the policy <M>{String.raw`\pi_\theta`}</M> maps an observation <M>o_t</M> to ...
```

`Formula` is a displayed equation with a short name and its source. `M` is inline. Always pass TeX through
`String.raw` so backslashes survive. KaTeX renders it; a TeX error shows up as a `[math]` finding in the check
tool. Keep displayed formulas short enough to read on a phone: split a long one into two lines with
`\begin{aligned} ... \end{aligned}`, or into two formulas.

## What to do in each section you own

1. **Convert.** Every formula or symbolic expression now written as plain text or inside `<code>` becomes `Formula`
   or `M`. Real code, configuration keys, CLI flags, variable names from a codebase (`chunk_size = 100`) and
   arithmetic with units written as a sentence stay as they are: `<code>` is for code. An arithmetic line worth
   displaying ("4,096 arms x 16 steps x 3,000 iterations") may become a `Formula` if it reads better; the numbers
   in it must still come from the cited entries, so keep the `Cite` beside it and wrap the block so the number
   check still sees those numbers as cited prose (leave such arithmetic as text if in doubt).
2. **Add the formulas the mechanism has** (your task lists them). Take each from its source paper or code, in the
   source's notation unless the page already uses another, and cite the source at a pinned version. If the
   registers (`research/2026-11/0N-*.md`) already hold an entry for that paper and location, cite it. If not, fetch
   the paper's arXiv abstract page and the PDF or HTML at an explicit version (v1, v2, ...) and add an entry to
   YOUR new register file in the register entry format (see `research/2026-11/09-aws-orchestration.md` for the
   format: `**F11-<n>. claim**`, `- Location:`, `- Verdict: NEW`, `- Evidence: <URL> | Tier 3, paper (venue or
   preprint) | definition | "<verbatim quote or the equation in words>" (accessed 2026-11-20)`, `- Use in dive:`),
   using only the ID range your task gives. Then run `node revamp/tools/gen-registry.mjs` so `Cite` resolves it.
   Never write a formula from memory: have the source open, and record the equation number.
3. **Explain, in this order, for every formula: intuition, then formula, then decomposition.** Say in plain words
   what is going on. Define every symbol at or before the formula, never after. Show the formula. Then say which
   term carries which part of the intuition. Where the idea is hard, add a worked example with small numbers the
   reader can redo by hand, labelled as an illustration (`<Toy>`). A citation marker never splits a definition.
4. **Do not overdo it.** The owner: "I don't want you to overdo things." One formula per mechanism, the one the
   field actually uses. No derivations. A section gains at most about 250 words per added formula. Do not touch
   prose that has nothing to do with a formula.

## Checks

```bash
cd deep-dives/physical-ai
pnpm typecheck && pnpm lint
(cd ../.. && bash scripts/gates/no-ai-tells.sh && bash scripts/gates/svg-a11y.sh && bash scripts/gates/pre-overflow.sh && bash scripts/gates/pinned-refs.sh)
npx vite build --outDir /tmp/pai-dist-<slug> --emptyOutDir
node revamp/tools/check-section.mjs --dist /tmp/pai-dist-<slug> --port <port> --out /tmp/pai-shots-<slug> --sections <ids>
```

The check must print `ok` for each of your sections at 1440 and 390. Read the full-page PNG of each section at 390
(`<out>/<id>-390.png`) and look at every formula: nothing clipped, nothing overflowing the page, symbols legible.
The `no-ai-tells` gate scans the whole file: no em-dash, no en-dash, straight quotes, no banned words; TeX strings
are scanned too, so write `\text{...}` content plainly.

Save after each section. If resumed, read your files and continue; do not redo finished sections.

Return at most 200 words: per section, formulas converted and formulas added (name and source); new register
entries; the check tool's last line per section at both widths; typecheck and lint last lines; anything you could
not source.
