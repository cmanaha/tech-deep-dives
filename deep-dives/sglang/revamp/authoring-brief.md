# Authoring brief: SGLang dive at v0.5.22 (shared by every authoring agent)

Research date and accessed date for every citation you add: **2026-10-24**.

Repo root: `/Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang`. You own exactly one
section file, named in your task. Edit nothing else (not `App.tsx`, not the glossary, not
`sources.md`, not another section). Background mode and subagents are allowed; give any subagent the
privacy rule below.

**Privacy: never put personal data (names, email addresses, account ids) in any request, header,
User-Agent, URL or query string.** If a site demands a contact address, use a Wayback copy or skip it.

## Inputs, in reading order

1. `CLAUDE.md` at the repo root: "Writing Style: No AI Tells", "Diagram Standards", "Section Shape",
   "Acronym Standard".
2. `deep-dives/efa/revamp/section-shape-standard.md` (the governing test) and
   `deep-dives/efa/revamp/leverage-pass-standard.md` (the four verbs; never assert; attribution in the
   link).
3. `deep-dives/efa/revamp/source-authority-standard.md` (code is the authority).
4. `deep-dives/efa/revamp/diagram-plan.md`, section 1 only (lines 15-216): the SVG contract.
5. `deep-dives/sglang/SCOPE.md`: the thesis, your section's block (depth, payoff, content order,
   mental model, diagram), and the "Review notes" at the end.
6. The register rows your block cites, under `deep-dives/sglang/research/2026-10/`. Each register ends
   with an "Errata from the scope review" list where one exists; errata override the row.
   `deep-dives/sglang/reviews/scope-review-factual.md` records which conditions each claim must keep.
7. Source tree `/tmp/sglang-src` (v0.5.22, read-only, never execute code from it) for anything you
   must re-check. If `/tmp/sglang-src` is missing, recreate it:
   `mkdir -p /tmp/sglang-src && gh api repos/sgl-project/sglang/tarball/v0.5.22 > /tmp/sglang-v0.5.22.tar.gz && tar -xzf /tmp/sglang-v0.5.22.tar.gz --strip-components=1 -C /tmp/sglang-src`.
8. A finished sibling section for structure: `deep-dives/vllm/src/sections/PrefixCaching.tsx`
   (Container with an h1 Header and description, then h2 Containers, diagrams as module-private
   functions above the export, `ExpandableSection` for evidence).

## What the reader must get

- The page describes SGLang **as it is at v0.5.22**, for a technical reader meeting it for the first
  time. No changelog voice: no "Correction:", no "previously", no "now" meaning "since an earlier
  version of this page", no "what changed" boxes. A version is fine when it is the fact the reader
  needs ("removed in v0.5.22", "available from v0.5.21").
- The h1 Header description states the payoff and ends with the provenance
  "(verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)".
- Every h2 Header description states the payoff (the reader's moment or result), not the topic.
- Open with two or three sentences on what the thing is and why it matters, before the mechanism.
  Frame it as a challenge to meet, never "The problem:".
- Define things by what they are. No "not X, but Y" flourishes.
- Land the section's strongest number at least twice. End on the reader's next action.
- No key-takeaways boxes. Demote long evidence, code walkthroughs and doc-versus-code conflicts into
  `ExpandableSection`.
- Where SGLang differs from vLLM, say so in one line and link the vLLM dive section by its title with a
  plain navigational link: `<Link href="../vllm/">vLLM dive, section 5: Paged KV Cache & Block Tables</Link>`
  (not `Cite`; it is navigation, not evidence). Do not re-explain vLLM.
- Section length: aim for 1,200 to 2,500 words of reader text. Shorter is fine when the block is
  short. Reframe rather than pad.

## Citations: use the dive's `Cite` component

`import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl, sglangDocsUrl } from '../components/Cite';`
(from `sections/codebase/` use `'../../components/Cite'`). It renders a tier badge, the external
link and "(accessed DATE)".

```tsx
<Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/radix_cache.py', 'L120-L160')}>radix_cache.py L120-L160</Cite>
<Cite tier={1} href={sglangTreeUrl('python/sglang/srt/disaggregation')}>disaggregation/</Cite>
<Cite tier={1} href={sglangDocsSrcUrl('advanced_features/hicache', 'L10-L40')}>SGLang docs: HiCache (v0.5.22 source)</Cite>
<Cite tier={2} href="https://lmsys.org/blog/...">LMSYS blog, 2024-01-17 (project claim)</Cite>
<Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/fields/schedule.py', 'L40')} kind="code">schedule.py L40</Cite>
<Cite tier={1} href={sglangDocsSrcUrl('advanced_features/hicache', 'L88')} kind="doc-code-conflict">docs page that disagrees</Cite>
```

- Every quantitative claim, default, flag behaviour and version-specific fact carries a `Cite` from
  its register row. If a number has no row and you cannot verify it in `/tmp/sglang-src` or a fetched
  source, it does not ship.
- `kind="code"` marks a fact read from source that no doc states. `kind="doc-code-conflict"` marks
  the docs side of a conflict; cite the code side next to it.
- Docs claims cite the tag-pinned `.mdx` via `sglangDocsSrcUrl` (the rendered site is unversioned).
  A rendered `sglangDocsUrl` link may be added as navigation.
- Other GitHub projects: the tag or SHA the register pinned. Never `/blob/main/`, `/tree/main/`,
  `/blob/master/`.
- Vendor and project performance numbers stay attributed in the sentence and carry their stated
  conditions ("LMSYS reports ... on 96 H100 GPUs with ..."). Never flatten one into a measurement.
- Conditions the register attaches stay attached: "read from source, not run", "AWS sample claim",
  "project claim", "not located during this research", "[our reading]" (render as plain words such
  as "our reading of the code", not brackets).
- Attribution belongs in the link, except the four load-bearing cases in the leverage standard.
- Preserve the scope of every hedge.

## Prose rules the gate enforces (`scripts/gates/no-ai-tells.sh`)

The gate scans the **whole `.tsx` file**, including comments, constants and URLs, except text inside
`<code>` and `<pre>`. So: no em-dash (character or `&mdash;`), no en-dash ranges, straight quotes only
(no curly characters, no `&ldquo;` `&rdquo;` `&lsquo;` `&rsquo;`; use `&quot;` and `&apos;` in JSX
text), and none of: delve, tapestry, seamless, robust, leverage, boasts, underscores, pivotal,
harness, unlock, supercharge, realm, landscape, testament, game-changer, cutting-edge,
best-in-class (any inflection). If a URL you must cite contains one of those words, do not cite it;
report it to the orchestrator. Also avoid the rhetorical tics in CLAUDE.md and emoji.

Expand every niche acronym on first use in your file: e.g. "ZMQ (ZeroMQ)", "DP (data parallelism)",
"MLA (multi-head latent attention)", "EP (expert parallelism)", "PD (prefill/decode)", "TBO
(two-batch overlap)", "EPLB (expert-parallel load balancer)", "LWS (LeaderWorkerSet)", "RBG
(RoleBasedGroup)", "EFA (Elastic Fabric Adapter)", "NIXL (NVIDIA Inference Xfer Library)", "EOS (end
of sequence)", "MHA and GQA (multi-head and grouped-query attention)", "SM90 (compute capability
9.0, Hopper)" for each SM code, "FA3 (FlashAttention 3)", "MTP (multi-token prediction)", "NCCL
(NVIDIA Collective Communications Library)", "IPC (inter-process communication)", "CP and DCP
(context parallelism, decode context parallelism)", "TTFT (time to first token)", "ITL (inter-token
latency)", "EPD (encoder-prefill-decode disaggregation)", "LMSYS (Large Model Systems
Organization)", "GIN (NCCL GPU-Initiated Networking)", "NVSHMEM (NVIDIA's OpenSHMEM library)", "VMM
(CUDA virtual memory management)", "EBNF (Extended Backus-Naur Form)", "CVE (Common Vulnerabilities
and Exposures)", "FCFS (first-come-first-served)", "LoRA (low-rank adaptation)", "MoE (mixture of
experts)". Take EFA-GDA and UCCL-EP expansions from the AWS source the register cites; never invent
one. Common computing acronyms (CPU, GPU, API, HTTP) need no expansion. Report every acronym you
used to the orchestrator so the glossary can list it.

## Section plan v2 rules (from the scope reviews)

- The section numbers and titles are SCOPE.md v2 (28 sections). Your task names your number.
- Every mechanism section ends with one "Against vLLM" line drawn from its register 10 A row, naming
  the vLLM dive section by its title (the SCOPE block says which). Map vLLM terms where the reader
  first meets them: retraction is SGLang's name for preemption; DeepEP "normal" is the counterpart of
  vLLM's high-throughput mode; TBO is the counterpart of vLLM's DBO (dual-batch overlap);
  `--mem-fraction-static` is a different quantity from `--gpu-memory-utilization`.
- Your SCOPE block's "Strongest number:" line names the figure to land at least twice.
- Do not write register labels as reader text ("DOC-CODE conflict"). Write "The documentation says X;
  v0.5.22's code does Y, so set Z", with the docs side cited `kind="doc-code-conflict"`.
- vLLM dive section titles, for links (pinned v0.31.0): 1. Thesis & Framing; 2. The Inference
  Workload; 3. The V1 Engine Architecture; 4. Scheduler & Continuous Batching; 5. Paged KV Cache &
  Block Tables; 6. Automatic Prefix Caching; 7. KV-Cache Offloading & Tiers; 8. Quantization &
  Precision; 9. Distributed Inference; 10. Disaggregated Prefill / Decode; 11. Speculative Decoding;
  12. The OpenAI-Compatible Server; 13. LoRA & Multi-Adapter Serving; 14. Inside the Codebase; 15.
  Orchestration: Ray & Ray Serve LLM; 16. Kubernetes: Production-Stack & Router; 17. Kubernetes:
  llm-d, KServe & Gateway API; 18. NVIDIA Dynamo & the Ecosystem; 19. Gateways & Application Layer;
  20. Observability & Benchmarking; 21. vLLM on AWS Neuron; 22. vLLM on AWS GPUs, EFA & NIXL; 23. EC2
  Topology & Placement Groups; 24. vLLM on Amazon EKS; 25. vLLM on SageMaker & vs Bedrock; 26. When
  Not vLLM; 27. Operations & Failure Modes; 28. Decision Guide. EFA dive sections are linked as
  `<Link href="../efa/">EFA dive: libfabric and the EFA Provider</Link>`.
- Links to other sections of this dive are plain text ("section 15, PD Disaggregation"): the app has
  no in-page anchors.

JSX: raw `<` and `>` in text fail lint; write `&lt;` `&gt;` or wrap in `<code>`. Every `<pre>` carries
`style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}` (gate `pre-overflow`).

## Diagrams

- Contract: `viewBox`, `style={{ width: '100%', height: 'auto' }}`, `role="img"`,
  `aria-labelledby="<slug>-title"` naming exactly ONE id that matches a `<title id="<slug>-title">`
  inside that svg. Optional `<desc id="<slug>-desc">` with `aria-describedby`. Prefix every class name
  and marker id with the diagram slug. Paint a light background rect first so text never relies on
  the page colour (dark mode). Fonts at least 10px, `sans-serif` explicit. No ASCII art. Ids must be
  unique across the app: prefix slugs with your section id (e.g. `radix-tree-title`).
- Every number inside a diagram matches a cited claim in the prose. Schematic diagrams carry an
  "Illustrative, not measured" caption in a `Box variant="small"` below the SVG.
- Phone legibility: a 900-unit viewBox scales by about 0.37 at a 390px viewport. If the smallest label
  would paint under 8px there, wrap the SVG in `<div style={{ overflowX: 'auto' }}>` and give it
  `style={{ width: '100%', minWidth: 640, height: 'auto' }}`, or split it.
- **Verify the rendered output** of every diagram you add. Build into a private directory and run the
  harness (use the port and slug from your task so parallel agents do not collide; never run
  `pnpm build`, it writes the shared `dist/`):

  ```bash
  cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang/deep-dives/sglang
  npx vite build --outDir /tmp/sglang-dist-<slug> --emptyOutDir
  node revamp/tools/shoot.mjs --dist /tmp/sglang-dist-<slug> --port <port> \
       --out /tmp/sglang-shots-<slug> --sections <section-id> [--tabs "<Tab label>|<Tab label>"]
  ```

  It prints text overlaps and clipping in viewBox units and writes full-page PNGs at 1440 and 390 plus
  one PNG per diagram. Read the PNGs of every diagram you touched with the Read tool. Fix every
  collision, clip or illegible label and re-run until the report is clean and the PNGs look right.

## Checks before you report done

```bash
cd /Users/carlos/workspace/git_repositories/tech-deep-dives-wt/sglang
pnpm --filter @tech-deep-dives/sglang typecheck
pnpm --filter @tech-deep-dives/sglang lint
grep -nE '/(blob|tree)/(main|master)/' <your file>                              # must print nothing
grep -nE '—|&mdash;|&ndash;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|[‘’“”]' <your file>    # must print nothing
grep -noiE '(^|[^[:alnum:]_-])(delve|tapestry|seamless|robust|leverag|boast|underscore|pivotal|harness|unlock|supercharg|realm|landscape|testament|game-chang|cutting-edge|best-in-class)' <your file>  # must print nothing
```

Typecheck and lint may report errors in files other agents are editing at the same moment. Only
errors in your file are yours to fix.

## Self-check and report

Diff the claim set: list every assertion in your text with the register row or file:line it came
from. Anything without a source comes out.

Return to the orchestrator only (at most 200 words): what the reader now gets from the section, the
number of cited claims, diagrams added and the harness result (overlap/clip counts at 1440 and 390),
the acronyms you expanded, any register item you could not resolve, and the exact result lines of
typecheck and lint.
