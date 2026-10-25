# Rendered pass, sections 1 to 24 and 28

Date: 2026-10-24. Scope: section ids `thesis` to `ecosystem` and `sources`. Sections 25 to 27
(`ops`, `decision`, `codebase`) are out of scope; another pass owns them.

## Method

- Build: `npx vite build --outDir /tmp/sglang-dist-rp<n>` (never `pnpm build`).
- Harness: `node revamp/tools/shoot.mjs` at 1440 and 390. It reports text overlaps and
  viewBox clipping per diagram in viewBox units, and writes full-page and per-diagram PNGs.
- Extra probe (session tool, not committed): browser console warnings and errors, SVG text
  rendered under 8 CSS px, elements that pass the viewport with no scrolling ancestor, raw
  HTML entities or `undefined`/`NaN` in visible text, links whose text is a bare URL, and
  expanded ExpandableSections with an empty body. At 390 it also shoots every diagram that
  sits in a horizontal scroll container at full width, because the harness's element shot
  crops those to the visible part.
- A dev-server sweep at 1440 over all 25 sections captured no React warning or error
  (React development build, console capture verified with an injected `console.warn`).
- Every full-page PNG was cut into tiles (1600 px at 1440, 1400 px at 390) and read, plus
  every diagram PNG at both widths.

## Baseline (before fixes)

Harness: every section `ok` at 1440 and 390, 0 overlaps, 0 clips, no horizontal page
overflow. Probe: 0 findings at either width (no console messages, no text under 8 px, no
viewport overflow, no entities, no bare-URL links, no empty expandables). Those baseline runs
left some ExpandableSections closed (see the harness note), so they under-measured; the
defects below came from reading the PNGs, none from the automated counts.

## Per section

Counts are harness overlap/clip at 1440 and 390, after fixes.

### 1. Thesis & Framing (`thesis`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: three-zone map renders clean at 1440 (1238 px wide); at 390 it sits in a horizontal scroll container at 640 px, smallest label 8.5 px. Expandable "Where each shared default sits" opens with its citation list. No overflow, entities or bare URLs.
- Fixed: nothing needed.

### 2. Getting Started (`getting-started`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: reading map checked on all five tabs (All routes, A, M, W, V) at both widths; connectors clear every label, the 6-to-15 and 12-to-25 routes stay distinct. At 390 the map scrolls at 760 px, smallest label 8.3 px. The nine-row settings table and the code blocks scroll inside their own containers at 390. Expandable "Why the second answer is one token short" has its body (it showed collapsed in the multi-section baseline run, a harness timing race; a single-section run opens it).
- Fixed: nothing needed.

### 3. The SGLang Runtime (`runtime`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: process-ring diagram clean at both widths (390: scroll container, labels at or above 8 px). Both tables scroll at 390. Three expandables (least-loaded methods, attention-DP port map, Rust frontend routes) open with content.
- Fixed: nothing needed.

### 4. The Scheduler (`scheduler`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: plain-versus-overlap loop lanes and the admission bar plus new_token_ratio chart render clean at 1440; at 390 both scroll at 640 px with labels at or above 8 px, no label touches the decay line, the retraction marker or the dashed cap and floor. Log-format code block and the four-column "What you see" table scroll inside their containers at 390. Both expandables open with content.
- Fixed: nothing needed.

### 5. RadixAttention & the Radix Cache (`radix`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: three diagrams (the multi-section baseline counted 2 because the "Design intent" expandable did not open in time; a single-section run opens it and measures all 3). Lock-and-evict tree and hit-as-index-copy diagram clean at both widths, phone labels at or above 8 px in their scroll containers. In the fork-onto-tree diagram the three `branch N: gen` arrows all ended on one point above `forks.join()`, so the three arrowheads stacked into one dark blot. Policy table and knobs table scroll inside their containers at 390.
- Fixed: `src/sections/RadixCache.tsx`, ForkOntoTreeDiagram: the branch-to-join arrows now end at x 150, 210 and 270 on the join box, one arrowhead each.

### 6. KV Memory & the Defaults Your GPU Picks (`kv-memory`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: memory-bar diagram clean at both widths (phone copy scrolls at minWidth 640; smallest label about 9.4 px). All four tables scroll horizontally at 390 with column minWidths; the startup-line `<pre>` scrolls. Both ExpandableSections render their bodies at 390.
- Fixed: nothing needed.

### 7. HiCache: GPU, Host & Storage (`hicache`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: tier diagram clean at both widths (minWidth 680 scroll at 390, no collisions; the demotion arrow and its label stay clear). Bring-up table scrolls at 390; both `<pre>` blocks scroll; all four ExpandableSections render their bodies at 390.
- Fixed: nothing needed.

### 8. Attention Backends & Kernels (`kernels`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: selection diagram clean at both widths (minWidth 740 scroll at 390). Four Cloudscape tables had no column `minWidth`, so at 390 they squeezed instead of scrolling: the page-size and kernel-source tables wrapped to one or two words per line, the "Coverage by platform" table broke words mid-character into a 40 px column (the section's 390 page was 22,761 px tall), and in the knobs table the code column took the full width and left the other three columns about 10 px wide.
- Fixed: `AttentionBackends.tsx`, added column `minWidth` to the page-size table (170/240/200), the kernel-source table (150/240/200/200), the platform table (path 280, source 200) and the knobs table (220/170/220/190), so each scrolls horizontally at 390 like the other sections' tables. 1440 layout unchanged; 390 page now 13 tiles instead of 18.

### 9. Quantization & KV Precision (`quant`)
- Harness 1440: 0/0; 390: 0/0 (no diagrams). Probe: 0.
- Seen: both tables (format floor table, KV dtype table) carry column minWidths and scroll horizontally at 390; all four ExpandableSections render their bodies at both widths; no entities, no bare URLs. Long inline code such as `quantization_config.quant_method` wraps mid-token at 390, which is normal browser wrapping.
- Fixed: nothing needed.

### 10. Structured Output (`structured`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 findings at either width.
- Seen: constrained-step diagram clean at both widths (phone renders it 680 px wide in a scroll container, smallest label about 8.3 px). Three Cloudscape tables scroll horizontally at 390 inside their own wrapper. Both ExpandableSections ("The 2024 jump-forward figures", "Where this lives in code") render full bodies once opened. The shared harness had left them collapsed (see note at the end of this log), so they were read from a re-shoot with a 1.5 s settle wait.
- Fixed: nothing needed.

### 11. Speculative Decoding (`spec-decode`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 findings at either width.
- Seen: one-round diagram clean at both widths (680 px wide on the phone in a scroll container). At 390 the "Where this lives in code" table had no column minWidths, so Cloudscape squeezed its three columns to about 70 to 110 px and file names, code identifiers and plain words broke mid-word ("speculative_ / hook.py", "decide / d", "matte / rs"). The algorithm-menu table (columns 131 to 171 px) and the two-column combinations table fit without mid-word breaks. The launch `<pre>` scrolls horizontally.
- Fixed: `SpeculativeDecoding.tsx`, "Where this lives in code" table: added `minWidth` 220/220/180 to its three columns, matching the same table in section 10. At 390 the table now scrolls horizontally inside its wrapper with whole words; 1440 is unchanged.

### 12. Talking to SGLang: APIs, LoRA adapters and the admin plane (`apis`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 findings at either width.
- Seen: one-port diagram clean at both widths (680 px wide on the phone in a scroll container, no label under 8 px). All four tables carry column minWidths and scroll inside their own wrapper at 390. The "Why /server_info carries the keys" expandable renders its body. Long inline code tokens (`SGLANG_ENABLE_HEALTH_ENDPOINT_GENERATION=false`) break mid-token on the phone, which keeps them inside the column rather than overflowing.
- Fixed: nothing needed.

### 13. SGLang as an RL Rollout Engine (`rl`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 findings at either width.
- Seen: refit-bracket diagram clean at both widths (640 px wide on the phone in a scroll container, smallest label about 8.3 px). The three tables carry column minWidths and scroll in their own wrapper at 390. The two `<pre>` blocks (launch line, refit call sequence) scroll horizontally at 390 (`overflowX: 'auto'`). All three expandables render full bodies.
- Fixed: nothing needed.

### 14. Parallelism: TP, DP Attention & EP (`parallelism`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 (no console messages, no viewport overflow, no entities, no bare-URL links, no empty expandables; smallest phone SVG text 8.8 px).
- Seen: one SVG (one replica on two 8-GPU nodes) clean at both widths; the dashed network line sits behind the MoE exchange box by design. At 390 the diagram scrolls inside its wrapper (rendered 720 px). Launch-flags and axis tables scroll inside the Cloudscape table wrapper; the launch-line code block scrolls in its `pre`. Both ExpandableSections open with content.
- Fixed: nothing needed.

### 15. PD Disaggregation (`pd`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 (smallest phone SVG text 8.75 px).
- Seen: the rendezvous sequence diagram has no label crossing a lifeline or arrow at either width; at 390 it scrolls (rendered 700 px). Backend table and the minimal-pairing code block scroll at 390. Long metric and env-var names in prose wrap mid-identifier at 390 rather than overflow. Both ExpandableSections open with content.
- Fixed: nothing needed.

### 16. Wide Expert Parallelism (`wide-ep`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 (smallest phone SVG text 8.8 px).
- Seen: the DeepEP-mode-by-step grid (panels A and B) is clean, with the dashed step highlights clear of every cell. At 390 it scrolls (rendered 720 px). The all-to-all backend table and EPLB knobs table scroll at 390 with narrow wrapped columns; the PD launch code block scrolls. All four ExpandableSections open with content.
- Fixed: nothing needed.

### 17. The Model Gateway (`gateway`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 (smallest phone SVG text 8.44 px, "prompt text of").
- Seen: the cache_aware flow diagram (decision boxes, least-loaded and record boxes, gateway-memory tree) is clean at 1440; at 390 it scrolls (rendered 660 px). The policy, knob and operating tables scroll at 390; the PD-mode launch code block scrolls. All four ExpandableSections open with content. The two-column "remembered text or KV events" layout stacks at 390.
- Fixed: nothing needed.

### 18. Multi-Node & Kubernetes Orchestrators (`multinode`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 (no console messages, no text under 8 px, no viewport overflow, no entities, no bare URLs, no empty expandables).
- Seen: PD-on-Kubernetes diagram clean at both widths (labels inside boxes, connector labels clear of lines); at 390 it scrolls inside its `overflowX: auto` wrapper and stays legible. Both tables scroll inside Cloudscape's table wrapper at 390; the LWS flags `<pre>` scrolls on its own. All three ExpandableSections render populated bodies.
- Fixed: nothing needed.

### 19. SGLang on SageMaker AI & HyperPod (`aws-managed`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: four-paths decision tree clean at both widths (edge labels clear of lines, box titles and subtitles inside their boxes); at 390 it scrolls in its `overflowX: auto` wrapper with text at or above 8 px. Boolean-variable table scrolls inside Cloudscape's table wrapper; the boto3 `<pre>` scrolls on its own. Four ExpandableSections render populated bodies.
- Fixed: nothing needed.

### 20. SGLang on EKS & EC2 (`aws-self-managed`)
- Harness 1440: 0/0 (no diagrams); 390: 0/0. Probe: 0.
- Seen: three tables and the EFA resources `<pre>` render cleanly at 1440; at 390 the tables scroll inside Cloudscape's table wrapper (column `minWidth`s already set) and the `<pre>` scrolls on its own. Two ExpandableSections render populated bodies. At 390 the container-settings table has 240 to 380 px tall rows, because its 300 px "Why" column carries long cited text; legible after a horizontal scroll, so left as is.
- Fixed: nothing needed.

### 21. EC2 Instances, Images & GPU-Dependent Behaviour (`ec2`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: instance-map diagram clean at both widths (family groups, legend and footnote clear of each other); at 390 it scrolls in its `overflowX: auto` wrapper with no text under 8 px. Defect at 390: in the "instance specs behind the map" table the three numeric columns had no `minWidth` and collapsed to about 52 px, so their headers wrapped one word per line into a header row about 290 px tall, with blank space beside "Size" and "GPUs". Images and workload tables scroll inside Cloudscape's table wrapper. Both ExpandableSections populated.
- Fixed: `Ec2Instances.tsx`, instance-specs table: `minWidth` 120 on "Memory per GPU (GiB)" and "GPU memory (GiB)", 110 on "Network (Gbps)". At 390 the header is now one normal row (columns 120/120/110 px, table scrolls); at 1440 column widths are unchanged within a few px.

### 22. PD & Wide EP over EFA (`efa`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0 (no console messages, no SVG text under 8 px, no viewport overflow, no entities, no bare-URL links, no empty expandables).
- Seen: 1440 and 390 read in full with all three ExpandableSections open. Two-stacks diagram clean at both widths (720 px minimum width in a scroll container at 390; smallest label 11 px in a 900 viewBox, about 8.8 px rendered). Image-by-route table scrolls inside its Cloudscape wrapper at 390; both bring-up `<pre>` blocks carry `overflowX: auto` and scroll. Long inline code such as `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC` breaks mid-token at 390, which is normal wrapping.
- Fixed: nothing needed.

### 23. SGLang & vLLM Compared (`vs-vllm`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: request-path diagram clean at 1440 and at its 700 px phone minimum (smallest label 11 px in a 900 viewBox, about 8.6 px rendered). Both twelve-row tables scroll horizontally at 390. Every ExpandableSection (the defaults table, the convergence list and all 16 benchmark cards) renders with content at both widths.
- Fixed: nothing needed.

### 24. Ecosystem & Production Users (`ecosystem`)
- Harness 1440: 0/0; 390: 0/0. Probe: 0.
- Seen: family map and evidence ladder clean at 1440 and at their 720 px phone minimum (smallest label 11 px in a 900 viewBox, about 8.8 px rendered); no label crowds a box edge. The release-pin table scrolls horizontally at 390. Both ExpandableSections (three more first-party statements, hardware vendors) render with content.
- Fixed: nothing needed.

### 28. Glossary & Sources (`sources`)
- Harness 1440: 0/0; 390: 0/0 (no diagrams). Probe: 0.
- Seen: intro container clean at both widths. Both tables come from `shared/` (`Glossary`, `SourcesAppendix`) and scroll inside their Cloudscape wrappers, so the page does not overflow. Two rendering defects sit inside `shared/`, outside this pass's files:
  - Glossary: cells do not wrap (no `wrapLines`), so the table is 1773 px wide. At 1440 (1111 px content width with the nav open) the Description column runs off the right edge mid-word ("...or for the KV cach") and needs a sideways scroll; at 390 only Acronym and part of Full Form show.
  - All Sources: the Tier badge wraps to two lines ("Tier" / "1") in its column at 1440, and titles are cut at 390 until scrolled.
- Fixed: nothing in this dive's files; both defects need a change in `shared/src/components/` (Glossary `wrapLines`, a wider Tier column in SourcesAppendix).
- Left for Carlos: (1) the two `shared/` table fixes above, which affect every dive using these components; (2) `SourcesAppendix` copy rendered in this dive carries an em-dash in its header description and in the Tier 4 card, AWS-centric tier definitions ("Official AWS docs...", "AWS blog posts...") that differ from this dive's tier scheme, a Tier 4 card this dive does not use, and tier badge colours (Tier 1 green, Tier 2 blue) that differ from the dive's inline Cite badges (Tier 1 blue, Tier 2 grey). The `no-ai-tells` gate does not scan `shared/`, so it will not catch the em-dash.

## Final sweep (after all fixes)

One build of the final tree (`/tmp/sglang-dist-rp1`), all 25 sections at 1440 and 390:

- Stock `revamp/tools/shoot.mjs`: 50 of 50 runs `ok`, 0 overlaps, 0 clips, no page overflow.
- Harness copy that waits for the section's own `h1` before expanding (see the harness note):
  50 of 50 `ok`, 0 overlaps, 0 clips. It measures 3 diagrams in `radix` where the stock run
  measures 2, because the third sits in the "Design intent" expandable.
- Probe with the same wait: 50 of 50 clean, and no ExpandableSection left closed in any run.

## Harness note

After a section switch, `shoot.mjs` waits for `aria-current` on the nav link and for any
`main h1`. Both can be true while the previous section is still mounted, so its expand-all
loop sometimes clicks nothing in the new section, and the shots and the overlap probe then
miss whatever sits inside ExpandableSections. It hit `getting-started`, `radix`, `kernels`,
`hicache`, `quant`, `structured`, `spec-decode` and `multinode` in multi-section runs. This pass
read every section with every expandable open, using a session copy that also waits until
the `h1` starts with the section's number. `revamp/tools/shoot.mjs` is unchanged; the same
three-line wait would close the gap there.

## Left for Carlos

Both in `shared/`, which this pass did not edit because every dive renders it:

1. `shared/src/components/Glossary.tsx`: the table has no `wrapLines`, so at 1440 the
   Description column runs past the content edge and is cut mid-word (for example "for the
   KV cach") until the reader scrolls sideways. Adding `wrapLines` fixes it.
2. `shared/src/components/SourcesAppendix.tsx`: the Tier badge wraps to two lines ("Tier" /
   "1") in its 60 px column at 1440. Its header text and Tier 4 card also carry an em-dash, its
   tier definitions are AWS-centric, it shows a Tier 4 card this dive does not use, and its
   badge colours differ from the dive's inline Cite badges. The `no-ai-tells` gate does not
   scan `shared/`.
