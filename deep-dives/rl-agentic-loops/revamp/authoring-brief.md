# Authoring brief: RL and agentic learning loops (shared by every authoring agent)

Research date and accessed date for every citation you add: **2026-10-30** (the `ACCESSED`
default of the `Cite` component). A register row read earlier keeps 2026-10-30 as long as you
re-open its source; if you cite a row without re-opening the source, pass the register's
`accessed` date explicitly.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build`. You own exactly
one section file, named in your task (plus, only where the task says so, one helper module and its
test). Edit nothing else: not `App.tsx`, not the glossary, not `sources.md`, not another section, not
`SCOPE.md`, not the registers. Background mode and subagents are allowed; give any subagent the privacy
rule below.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header,
User-Agent, URL or query string.** If a site demands a contact address, use a Wayback copy or skip it.

## Inputs, in reading order

1. `CLAUDE.md` at the repo root: "Writing Style: No AI Tells", "Diagram Standards", "Section Shape",
   "Acronym Standard", "Fact-Checking & Sources Standard".
2. `deep-dives/efa/revamp/section-shape-standard.md` (the governing test) and
   `deep-dives/efa/revamp/leverage-pass-standard.md` (the four verbs; never assert; attribution in the
   link).
3. `deep-dives/efa/revamp/source-authority-standard.md` (code is the authority; hedges keep scope).
4. `deep-dives/efa/revamp/diagram-plan.md`, section 1 only (lines 15-216): the SVG contract.
5. `deep-dives/rl-agentic-loops/SCOPE.md`: the thesis, your section's block (depth, payoff, content
   order, mental model, diagram), and the review notes at the end. The scope is the contract: build what
   the block promises, in its order, and nothing it does not promise.
6. The wave 2 verdict files `deep-dives/rl-agentic-loops/research/2026-10/wave2-*.md`. A verdict there
   (SCOPE NARROWER, WRONG, new finding) overrides the register row it names. Search them for every
   register ID your block cites.
7. The register rows your block cites, in `research/2026-10/01-*.md` to `06-*.md`. Each row has the
   pinned source and a verbatim quote. The quote is your evidence; re-open the source for anything the
   quote does not settle.
8. `RESEARCH-GUIDE.md` section 6 (UNKNOWN register with its Gate 1 triage): an UNKNOWN marked
   accept-as-hedge ships with its hedge text; cut-the-claim does not ship.
9. A finished sibling section for structure: `deep-dives/sglang/src/sections/RlRollout.tsx`
   (Container with an h1 Header and description, then h2 Containers, diagrams as module-private
   functions above the export, `ExpandableSection` for evidence).

## What the reader must get

- The reader is a technical lead who knows inference engines, GPUs, prompts and agent loops in
  practice and has no formal RL background (scope section 2). Define every RL term at first use in your
  section, even if an earlier section defined it: one clause is enough ("the advantage, how much better
  an attempt did than expected").
- The page reads as current for a reader meeting it for the first time. No changelog voice: no
  "Correction:", no "previously", no "an earlier version", no "what changed" boxes.
- The h1 Header text is the section's navigation title exactly, starting with its number (for example
  `7. RLVR &amp; GRPO`; see the titles list below and `src/App.tsx`). The screenshot harness waits for it.
- The h1 Header description states the payoff and ends with the provenance "(sources read
  2026-10-30)". If the section cites framework code, name the pinned versions instead, for example
  "(TRL v1.16.0 and verl v0.9.1, read 2026-10-30)".
- Every h2 Header description states the payoff (the reader's moment or result), not the topic.
- Open with two or three sentences on what the thing is and why it matters, before the mechanism.
  Frame it as a challenge to meet, never "The problem:".
- Define things by what they are. No "not X, but Y" flourishes.
- Land the section's strongest number at least twice (the scope block names it, or pick the figure the
  section's argument rests on). End on the reader's next action, reached by ordering blocks so the
  payoff lands last. No key-takeaways boxes, no summary box.
- Demote supporting evidence, long derivations, catalogues and disputes into `ExpandableSection`.
- Section length: aim for 1,200 to 2,500 words of reader text (sections 1, 2 and 24 may be shorter).
  Reframe rather than pad.
- Links to other sections of this dive are plain text ("section 8, What RL Does to a Model"): the app
  has no in-page anchors. Links to sibling dives are plain navigational `Link`s, never `Cite`:
  `<Link href="../vllm/">vLLM dive, section 4: Scheduler &amp; Continuous Batching</Link>`,
  `<Link href="../sglang/">SGLang dive, section 13: SGLang as an RL Rollout Engine</Link>`. The scope's
  "Caching dive" is not published; for prefix caching link
  `<Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>`, and for the DGX Spark
  hardware `<Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>`.
  Published sibling dives: `../efa/`, `../silicon-memory-inference/`, `../vllm/`, `../sglang/`; link
  nothing else. Do not re-explain what a sibling dive covers.

### Section titles (for cross-references)

1 One Loop, Three Places to Keep What It Learns; 2 Getting Started; 3 The Language Model Is Already a
Policy; 4 Policy Gradient; 5 Two Leashes: PPO's Clip & the KL; 6 From Preferences to Rewards; 7 RLVR &
GRPO; 8 What RL Does to a Model; 9 Agentic RL; 10 The Reward Is a Proxy; 11 A Text Loop Is RL on the
Context; 12 Verbal Reinforcement & Self-Correction; 13 Memories, Playbooks & Skill Libraries; 14
Optimising the Prompt; 15 Your Loops Through the RL Lens; 16 Hybrids; 17 Where Words Fall Short; 18
What Lives in Weights & What Lives in Context; 19 An RL Step Is an Inference Job Inside a Training Job;
20 Cost per Improvement; 21 Side by Side on a DGX Spark; 22 Choosing a Text Loop, a Hybrid or a Weight
Update; 23 RL & Learning Loops on AWS; 24 Glossary & Sources.

## Evidence markers: how the scope's labels render on the page

| Scope label | On the page |
| --- | --- |
| `(F03-61)` register ID | A `Cite` to the pinned source the row names. Never print a register ID. |
| `[derived]` | Plain words: "our arithmetic from the paper's figures", with the arithmetic in an `ExpandableSection` or the sentence. |
| `[our reading]` | Plain words: "our reading of these studies" or "our reading of the code", never brackets. |
| `[vendor claim]` | Attribute in the sentence ("Agentica and Together AI report ...") and pass `kind="vendor-claim"`. |
| Tier 2 lab blog | Attribute in the sentence when the number is the lab's own claim ("Thinking Machines argue ..."). |
| Cross-model | Say so in the sentence: "a cross-model comparison: the text loop ran on a 671B model, the RL model is 32B". |
| Hedges | Keep their scope word for word in meaning: "not located in this research" never becomes "does not exist"; "in their runs" stays. |

## Citations: use the dive's `Cite` component

`import { Cite, arxiv, gh, ghTree, TRL_TAG, VERL_TAG } from '../components/Cite';` (see the file for
the full list of pinned tags). It renders a tier badge, an optional kind or venue badge, the external
link and "(accessed DATE)".

```tsx
<Cite tier={3} href={arxiv('2507.19457v2')} venue="preprint">GEPA, Table 1</Cite>
<Cite tier={3} href={arxiv('2504.13837v5')} venue="NeurIPS 2025">Yue et al., Figure 2</Cite>
<Cite tier={1} href={gh('huggingface/trl', TRL_TAG, 'trl/trainer/grpo_config.py', 'L801-L835')}>TRL grpo_config.py L801-L835</Cite>
<Cite tier={2} href="https://thinkingmachines.ai/blog/lora/">Thinking Machines, LoRA Without Regret (lab blog)</Cite>
<Cite tier={2} href="https://..." kind="vendor-claim">DeepSWE post (Agentica and Together AI)</Cite>
<Cite tier={1} href="https://docs.aws.amazon.com/...">Bedrock user guide: reinforcement fine-tuning</Cite>
<Cite tier={0} href={E0_URL}>E0 log: GRPO smoke test on a DGX Spark</Cite>
```

- Tiers: 0 = our experiments; 1 = code at a pinned tag or SHA, official framework docs, first-party AWS
  docs and pricing; 2 = first-party lab or vendor posts and talks (their performance numbers stay
  claims); 3 = papers (pass `venue` = the confirmed venue, or `"preprint"`) and third-party analysis.
  Tier 4 sources are never cited.
- Every quantitative claim, default, flag behaviour and version-specific fact carries a `Cite` built
  from its register row (or wave 2 row). If a number has no row and you cannot verify it at a fetched
  pinned source, it does not ship.
- arXiv links always carry the version (`arxiv('2402.03300v3')`); the sources generator fails on an
  unversioned arXiv URL. GitHub links always go through `gh()` / `ghTree()` with a tag or 40-character
  SHA; never `/blob/main/`, `/tree/main/`, `/blob/master/`.
- `kind="code"` marks a fact read from source that no doc states; `kind="doc-code-conflict"` marks the
  docs side of a conflict (cite the code side next to it); `kind="vendor-claim"` marks a vendor or
  lab performance figure.
- Attribution belongs in the link, except the four load-bearing cases in the leverage standard
  (silence is the claim; two sources disagree; the verb carries strength such as "AWS recommends"; the
  attribution grades the source and no citation carries it). Never flatten a vendor or lab claim into
  declarative prose.

## Prose rules the gate enforces (`scripts/gates/no-ai-tells.sh`)

The gate scans the **whole `.tsx` file**, including comments, constants and URLs, except text inside
`<code>` and `<pre>`. So: no em-dash (character or `&mdash;`), no en-dash ranges, straight quotes only
(no curly characters, no `&ldquo;` `&rdquo;` `&lsquo;` `&rsquo;`; use `&quot;` and `&apos;` in JSX
text), and none of: delve, tapestry, seamless, robust, leverage, boasts, underscores, pivotal,
harness, unlock, supercharge, realm, landscape, testament, game-changer, cutting-edge,
best-in-class (any inflection). "Harness" appears in some paper vocabulary ("test harness", "evaluation
harness"): write "test suite" or "evaluation setup" instead. If a URL you must cite contains a banned
word, do not cite it; report it to the orchestrator. Avoid the rhetorical tics in CLAUDE.md and emoji.

Expand every niche acronym on first use in your file, for example: "RL (reinforcement learning)", "RLHF
(RL from human feedback)", "RLVR (RL with verifiable rewards)", "SFT (supervised fine-tuning)", "PPO
(Proximal Policy Optimization)", "GRPO (Group Relative Policy Optimization)", "KL (Kullback-Leibler
divergence)", "DPO (Direct Preference Optimization)", "LoRA (Low-Rank Adaptation)", "MoE
(mixture of experts)", "GEPA (Genetic-Pareto)", "ACE (Agentic Context Engineering)", "TRL
(Transformers Reinforcement Learning, Hugging Face's post-training library)", "RFT (reinforcement
fine-tuning)", "PRM (process reward model)", "ORM (outcome reward model)", "ICL (in-context learning)".
Take expansions from the wave 2 U23 results; never invent one. Common computing acronyms (CPU, GPU, API,
HTTP, LLM) need no expansion. Gloss each benchmark at first use (AIME, MATH-500, SWE-Bench Verified,
HumanEval, HotPotQA, WebArena, RULER, chrF). Report every acronym you used so the glossary lists it.

JSX: raw `<` and `>` in text fail lint; write `&lt;` `&gt;` or wrap in `<code>`. Every `<pre>` carries
`style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}` (gate `pre-overflow`). Equations: write
them in plain text inside `<code>` (for example `<code>gradient = A * grad log pi(y | x)</code>`) or as
an inline SVG; no LaTeX and no new math dependency.

## Diagrams

- Contract: `viewBox`, `style={{ width: '100%', height: 'auto' }}`, `role="img"`,
  `aria-labelledby="<slug>-title"` naming exactly ONE id that matches a `<title id="<slug>-title">`
  inside that svg. Optional `<desc id="<slug>-desc">` with `aria-describedby`. Prefix every class name
  and marker id with the diagram slug. Paint a light background rect first so text never relies on the
  page colour (dark mode). Fonts at least 10px, `sans-serif` explicit. No ASCII art. Ids must be unique
  across the app: prefix slugs with your section id (for example `rlvr-group-title`).
- Every number inside a diagram matches a cited claim in the prose. Schematic diagrams (for example the
  pass@k curves of section 8) carry an "Illustrative, not measured" caption in a `Box variant="small"`
  below the SVG.
- Phone legibility: a 900-unit viewBox scales by about 0.37 at a 390px viewport. If the smallest label
  would paint under 8px there, wrap the SVG in `<div style={{ overflowX: 'auto' }}>` and give it
  `style={{ width: '100%', minWidth: 640, height: 'auto' }}`, or split it.
- **Verify the rendered output** of every diagram you add. Build into a private directory and run the
  harness (use the port and slug from your task so parallel agents do not collide; never run
  `pnpm build`, it writes the shared `dist/`):

  ```bash
  cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build/deep-dives/rl-agentic-loops
  npx vite build --outDir /tmp/rl-dist-<slug> --emptyOutDir
  node revamp/tools/shoot.mjs --dist /tmp/rl-dist-<slug> --port <port> \
       --out /tmp/rl-shots-<slug> --sections <section-id>
  ```

  It prints text overlaps and clipping in viewBox units and writes full-page PNGs at 1440 and 390 plus
  one PNG per diagram. Read the PNGs of every diagram you touched with the Read tool. Fix every
  collision, clip or illegible label and re-run until the report is clean and the PNGs look right.

## Checks before you report done

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/rl-build
pnpm --filter @tech-deep-dives/rl-agentic-loops typecheck
pnpm --filter @tech-deep-dives/rl-agentic-loops lint
grep -nE '/(blob|tree)/(main|master)/' <your file>                              # must print nothing
grep -nE 'arxiv\.org/(abs|html|pdf)/[0-9]{4}\.[0-9]{4,5}([^v0-9]|$)' <your file> # must print nothing
grep -nE '—|&mdash;|&ndash;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|[‘’“”]' <your file>    # must print nothing
grep -noiE '(^|[^[:alnum:]_-])(delve|tapestry|seamless|robust|leverag|boast|underscore|pivotal|harness|unlock|supercharg|realm|landscape|testament|game-chang|cutting-edge|best-in-class)' <your file>  # must print nothing
bash scripts/gates/no-ai-tells.sh && bash scripts/gates/svg-a11y.sh && bash scripts/gates/pre-overflow.sh
```

Typecheck and lint may report errors in files other agents are editing at the same moment. Only errors
in your file are yours to fix.

## Save early

Sessions can stop without warning (usage limits). Write a first complete draft of your file to disk as
soon as you have one, then refine it in place, so a stop loses as little as possible.

## Self-check and report

Diff the claim set: list every assertion in your text with the register row, wave 2 row or
file:line it came from. Anything without a source comes out. Append that list to
`deep-dives/rl-agentic-loops/revamp/claims/<section-id>.md` (you own that file too): one line per
claim, `claim | source URL | register or wave 2 row`. The fact checkers start from it.

Return to the orchestrator only (at most 200 words): what the reader now gets from the section, the
number of cited claims, diagrams added and the harness result (overlap/clip counts at 1440 and 390),
the acronyms you expanded, any register item you could not resolve, and the exact result lines of
typecheck and lint.
