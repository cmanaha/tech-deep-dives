# Leverage pass fc04-pp-cp-ep (sections 10, 11, 12), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Four verbs only (delete, reorder, demote,
re-express); no assertion. Run after the fact-check fixes in `reviews/factcheck/fc04-pp-cp-ep.md`.

## Before-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| PipelineParallel.tsx | 5 | 4 | 5 | 5 | 3 |
| ContextParallel.tsx | 5 | 4 | 5 | 5 | 3 |
| ExpertParallel.tsx | 4 | 4 | 5 | 5 | 3 |

Economy is the weak axis in all three: each runs about 2,400 to 2,700 words of reader text, above the
2,500 target, with supporting evidence (production layer splits, framework code lines, a placement
assumption, a documentation-versus-code walkthrough) sitting in the argument's path.

## Three questions per substantial block

Q1 is what the block means to the reader, Q2 the mental model and whether it is visible, Q3 how
the reader uses it.

### PipelineParallel.tsx (section 10, Pipeline Parallelism & the Bubble)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Says what PP splits and that the cost is idle time, not bandwidth | Depth split, cheap hand-offs; prose is enough | Frames the decision: PP crosses instances, TP does not |
| Stages, micro-batches and the bubble | Gives the reader the formula they will size with, and the denominator trap in quoted percentages | Bubble = (p - 1) / m; visible in the schedule chart below | Lets the reader compare any quoted bubble figure; first/last-stage lightening is a setting to look for |
| Uneven stages (expandable) | Production splits and the three frameworks' flags, for the reader configuring one | Ends are lighter; supporting evidence, not a model | Exact flags and defaults in Megatron Core, TorchTitan, DeepSpeed |
| Three schedules on four stages | Shows what each schedule buys and pays | GPipe holds m, 1F1B holds p, interleaving divides by v; carried by the interactive chart | Choose 1F1B or interleaved; m must be a multiple of p |
| Later schedules (expandable) | Zero Bubble, DualPipe, Llama 3's N, and which framework ships which | Split backward into input and weight gradients; supporting depth | Schedule names PyTorch accepts; Megatron's remainder error is a failure signature to recognise |
| The split that crosses instances | Shows the pipeline's traffic is about a tenth of a percent of its compute | P2P per boundary is bsh/t; prose plus the arithmetic expandable | Place stages on separate instances with confidence; v multiplies the sends |
| What a pipeline divides | Stops the reader adding stages to fix activations | Stage 1 holds L layers' worth at any p; the degree table makes it visible | Decide between more stages and recomputation; the first stage is the one to watch for OOM |
| Size the bubble for your layout | The procedure and the worked 70B numbers | Order: smallest p, then m or v | Exact Megatron and TorchTitan settings; TorchTitan's default of one micro-batch is the trap, stated with its fix |

### ContextParallel.tsx (section 11, Context Parallelism)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Names when the reader needs CP and the three designs | Split the sequence, attention is the only cross-token step | Sets the choice: ring, all-to-all, all-gather |
| What CP divides | Shows CP divides activations and leaves weights whole, priced on the 70B example | Activations / CP degree; prose with calculator figures | Fit a long sequence: 426 GB without levers, recomputation or CP to bring it back |
| Three ways to move keys and values | Lets the reader match the design to heads and mask | Three cards plus the slice grid diagram make it visible | Ulysses stops at the KV-head count (8 for Llama 3.1); document masks go to all-gather |
| How DeepSpeed splits heads under GQA (expandable, new) | The code lines behind the KV-head cap, for the reader who checks | Supporting evidence | Know the rejection and uneven split before configuring Ulysses |
| Bytes per attention layer (expandable) | The arithmetic behind the byte counts | Supporting | Reproduce the comparison at another shape |
| When the ring hides its transfer | The section's one ratio: c >= F/B | Long sequences hide their own communication; stated as the model in the text | 2.2K tokens per GPU over NVLink, 19.8K over EFA, /8 under GQA: check before counting on overlap |
| Where the thresholds come from (expandable) | Derivation, and now the TP 8 placement reasoning | Supporting | Tells the reader when the EFA figure applies to their placement |
| Add CP when the activations do not fit | The ordered procedure and the 131,072-token comparison | TP with SP first, then CP nested next to TP | Exact ordering and design choice; ends on running section 14's calculator |

### ExpertParallel.tsx (section 12, Mixture of Experts: Expert Parallelism)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | What training adds to MoE: EP, the exchanges, the second grid | Experts spread, tokens travel | Frames placement and grid sizing |
| Dispatch and combine | Puts a byte count on the exchange before placement | Bytes follow k and h, not the expert count; prose with the worked figures | Price an MoE layer's traffic per token; capacity factor sizes each expert's intake |
| Cross the slow link once | DeepSeek-V3's node-limited routing as a pattern to borrow | Cross the network once per node, fan out on NVLink; diagram makes it visible | Cap nodes per token; AWS's NVLink to EFA ratio is steeper (nine times) |
| An MoE model runs two layouts at once | The reader must size two grids that share only PP | Attention grid TP x CP x DP x PP, expert grid ETP x EP x EDP x PP; prose only (see backlog) | Check both products against the world size; set ETP explicitly |
| The guide's DeepSeek-V3 row (expandable, new) | The documentation-versus-code walkthrough, for the reader who checks | Supporting evidence for the conflict stated in the body | Shows the failure the body warns about, with Calculator C's check |
| Set the expert grid | The procedure | Keep EP x ETP in NVLink, prefer EP over TP for experts | Dispatcher choice, overlap flags, two candidate grids to measure |
| Overlap requirements (expandable) | Megatron's checks for the overlap flag | Supporting | The conditions and the CUDA_DEVICE_MAX_CONNECTIONS warning are failure signatures |

No block answered none of the three questions, so nothing was deleted. Every block that carries
supporting evidence rather than a model or a decision now sits in an expandable or already did.

## Edits (four verbs only)

1. PipelineParallel.tsx, demote: the Llama 3 405B 7 + 14 x 8 + 7 split and the DeepSeek-V3 61
   layers on 16 stages sentences, with their five Cites, move from the body into the uneven-stages
   expandable (retitled to name the two production splits). Re-express: "that is" becomes "one layer
   fewer at each end is", restating the body's Llama 3 Section 3.3.2 claim the sentence now sits
   apart from.
2. ContextParallel.tsx, demote: the DeepSpeed code-line chain under GQA (L544-L547 key-tensor head
   count, L286-L288 uneven split, no replication path) moves into a new expandable "How DeepSpeed
   v0.19.9 splits heads under GQA". The body keeps the cap (L35-L37), the 8 KV heads and the
   Ulysses-stops-at-8 conclusion.
3. ContextParallel.tsx, demote and re-express: the TP 8 placement reasoning (Megatron CP overview
   L19, 50 GB/s per GPU, eight rings on 400 GB/s) moves from the body into "Where the thresholds come
   from"; its scoping sentence ("assumes one member of each CP group per instance, which is what TP 8
   gives") is folded into the body's 19.8K sentence so the hedge scope stays on the number.
4. ExpertParallel.tsx, demote and reorder: the guide's DeepSeek-V3 row, the 2,048 product and the
   three Calculator C world-size bullets move into a new expandable "The guide's DeepSeek-V3 row,
   checked against the code". The body keeps the doc-code-conflict Cite (L174-L180) and gains the
   conclusion first: "under the code the guide's own DeepSeek-V3 row holds only with ETP 1". The
   closing action ("The code is the authority: check both grids, and set ETP rather than inherit it")
   stays the last block of that h2.

Protected items held: every Cite kept with its sentence; both doc-code-conflict Cites kept with
`kind="doc-code-conflict"` (the conflict is stated in the body, the worked row in the expandable);
venues unchanged; "Illustrative, not measured" captions untouched; hedge scopes ("by our arithmetic",
"our reading", "No Zero Bubble or DualPipe pipeline schedule was located") unchanged; each section's
strongest number and its repetition untouched (PP bubble 4.7% to 0.94%, CP about 4% of compute, EP
about 172 KB per token per layer).

## Claim-set diff (after against `/tmp/lts-fc-fc04-preleverage/`, the post-fact-check state)

Assertions in the after that are not in the before, with the source they came from:

- PP "one layer fewer at each end": restates the body's Llama 3 Section 3.3.2 claim, same Cite on the
  page. No new fact.
- CP "Why the EFA figure applies with TP 8": a lead-in to the moved paragraph; the claim is the
  before's "assumes one member of each CP group per instance, which is what TP 8 gives", now in the
  body sentence. No new fact.
- CP "DeepSpeed takes the head count from the key tensor": the before's sentence, same L544-L547 Cite.
- EP "under the code the guide's own DeepSeek-V3 row holds only with ETP 1": the before's "Under the
  code the row holds only with ETP 1", moved ahead of its evidence; Calculator C's check follows in
  the expandable. No new fact.

Assertions deleted: none. Cites deleted: none. Body prose fell by about 55 words (PP), 117 (CP) and
78 (EP); total reader text is unchanged within 11 words per file (the moved lead-ins).

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| PipelineParallel.tsx | 5 | 4 | 5 | 5 | 4 |
| ContextParallel.tsx | 5 | 4 | 5 | 5 | 4 |
| ExpertParallel.tsx | 4 | 4 | 5 | 5 | 4 |

Economy rises a point in each file: the argument now runs from claim to claim, with production
splits, code-line chains, a placement derivation and a documentation walkthrough one click away.
Mental model and practical leverage hold rather than rise. Every h2 description already names the
reader's decision, and each block already states its setting or failure signature, so no
re-expression was needed to surface a hidden hook. Rigor holds at 5 (no Cite traded). Accuracy holds
at 5.

## Backlog (enhancement, not applied)

- ExpertParallel.tsx: the two-grid model (attention TP x CP x DP x PP against expert ETP x EP x EDP x
  PP, sharing PP) exists only as prose. A small inline SVG of the two grids on the DeepSeek-V3
  degrees would likely raise mental model to 5. New diagram, so new scope.

## Verification after the pass

- typecheck: `tsc --noEmit`, exit 0. lint: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0.
- test: "Test Files 6 passed (6)", "Tests 165 passed (165)".
- Gates: no-ai-tells, pinned-refs, svg-a11y and pre-overflow all PASS.
- Harness (vite build to /tmp/lts-dist-fc04, shoot.mjs on port 4704, every ExpandableSection opened):
  pipeline 1 SVG, context-parallel 4, expert-parallel 1, all "ok" at 1440 and 390, no horizontal
  page overflow.
