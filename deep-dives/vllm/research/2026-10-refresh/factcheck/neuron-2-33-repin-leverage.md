# neuron-2-33-repin-leverage: leverage pass on AwsNeuron.tsx (nav id `neuron`)

Status: DONE (2026-10-24). One file edited (`AwsNeuron.tsx`); nothing committed, no git state touched.

Standard applied: `deep-dives/efa/revamp/leverage-pass-standard.md` (four verbs: delete, reorder,
demote, re-express; no assert), `deep-dives/efa/revamp/section-shape-standard.md`, repo `CLAUDE.md`.
Input: the section at HEAD `bdc101e` after the re-pin and fact-check
(`neuron-2-33-repin.md`, Gate 3 8/10; register `09-neuron-2-33-repin.md`).
File owned: `deep-dives/vllm/src/sections/AwsNeuron.tsx`. Nothing committed.

## Scores (1 to 5)

| Axis | Before | After |
| --- | --- | --- |
| Mental model | 4 | 4 |
| Practical leverage | 4 | 5 |
| Rigor | 5 | 5 |
| Accuracy | 5 | 5 |
| Economy | 3 | 4 |

- **Mental model 4 to 4.** The model was already strong and is unchanged in content: one serving surface over
  two plugin lines, a compile layer with its own copy of the TorchNeuron lowering, a cache gated by the route
  variable, a vLLM 0.29.0 pin. The pass makes it easier to find (the model h2 now holds only the model and the
  diagram; the entry-point mechanism sits next to the log line it explains), but the compile-path and cache
  model (route variable, then cache on or off, then where the NEFFs land) still exists only as prose. A
  diagram would carry it better; that is new scope, logged under "For the orchestrator".
- **Practical leverage 4 to 5.** The startup knobs (`VLLM_NEURON_BACKEND`, `TORCH_DEVICE_BACKEND_AUTOLOAD=0`,
  `VLLM_CACHE_ROOT`, `TORCH_CACHING_PRECOMPILE=0`, `TORCH_NEURONX_NEFF_CACHE_DIR`, the activation log line)
  now have their own h2, which leads with what it configures and sits next to "Configure it the Neuron way",
  after the reader has picked a line and checked features. That is the order the h1 description already
  listed. Each h2 now ends on something to do or check: the pin alert, "check the model's recipe", the
  platform log line, the 0.5.x translation, "design a new deployment from what the 1.x plugin lists", the
  next step.
- **Rigor 5 to 5.** No claim, citation, scope or hedge changed. 85 Cites before and after, all with the
  same targets and labels. One edit was reverted during the self-check because it widened a scope (below).
- **Accuracy 5 to 5.** No fact touched. The two re-expressions that changed wording ("the path" to "the
  native route"; "The package registers" to "The plugin registers") point at the same object.
- **Economy 3 to 4.** Reader-visible prose fell 6.3% (8.4% counting diagram text and citation labels), and the
  total with every disclosure open held flat. Code evidence, both doc-code conflicts and the per-row
  provenance now sit behind disclosures. Held at 4 because the cache paragraph is still about 150 words of
  dense, all-practical text, and the section is still close to 2,900 visible words.

## Per-block three answers

Line numbers are the file before this pass (HEAD `bdc101e`). Format: block (lines): 1. what it means
to the reader / 2. the model, and whether it is visible / 3. how the reader uses it. Verdict.

**h1, vLLM on AWS Neuron**

- What it is (321-343): 1. tells the reader the plugin is the route to Trainium / 2. vLLM has no Neuron
  platform, a plugin supplies one; partly visible in the diagram's "Registers through the
  vllm.platform_plugins entry point" / 3. the entry-point detail is what explains the startup log line,
  but it sits four h2s away from it. Keep the introduction; move the entry-point mechanism to the log
  check; strip the "Its README opens:" narration.
- The mental model (344-365): 1. the frame for the whole section / 2. one serving surface over two plugin
  lines; drawn by the stack diagram / 3. tells the reader which line a deployment is on. Keep, leads.
- The version gap (366-378): 1. the section's strongest practical fact / 2. a Neuron server is a
  vLLM 0.29.0 server / 3. read every flag against 0.29.0. Keep; it is landed again in the alert header,
  the decision lists and the next step.
- Cross-references (379-388): 1. map to the hardware, codebase and EFA sections / 2. none / 3. navigation;
  also carries the first KV, EFA and NIXL expansions. Keep.

**h2, Two plugin lines, one serving surface**

- Intro (406-414): 1. sets up the diagram / 2. same top and bottom, different middle; visible in the
  diagram / 3. places a deployment on its line; first NKI, NEFF and XLA expansions. Keep.
- Diagram and caption (415-437): 1. the model in one picture / 2. two stacks side by side / 3. a reader
  can point at their own layer. Keep; `minWidth: 640` left as is.
- Worker, scheduler, model packages, Model Runner V2 (438-462): 1. the code evidence behind four
  diagram lines / 2. the same model the diagram already draws / 3. little beyond the diagram; the
  runner rule and its log line are in the feature matrix. Demote (supporting evidence).
- How it compiles (463-501): 1. what turns a model into NEFFs / 2. TorchDynamo to StableHLO to
  neuronx-cc, one NEFF per bucket; lite carries its own lowering; partly in the diagram's teal box /
  3. a torch-neuronx fix is not evidence the plugin has it; PyTorch 2.13 for a custom image. Keep the
  mechanism and the consequence; demote the "built on the TorchNeuron library" precision conflict.
- Two variables to set before the first start (502-526): 1. the first two knobs / 2. the route is an
  environment choice, and only one package may own the `neuron` device / 3. set
  `VLLM_NEURON_BACKEND=neuron_native`; export `TORCH_DEVICE_BACKEND_AUTOLOAD=0` when torch-neuronx is
  co-installed; the error string identifies the failure. Keep.
- Keep the compile across restarts (527-571): 1. how to avoid recompiling / 2. the cache is gated by
  the route variable and rooted by `VLLM_CACHE_ROOT` / 3. four variables to set or leave, plus the
  multi-node and EPD exception. Keep; demote the `NEURON_COMPILED_ARTIFACTS` doc-code conflict
  (Section Shape rule 7; the fact-check held Gate 3 at 8 on exactly this).
- Check which platform loaded (572-583): 1. confirms the plugin is active / 2. out-of-tree platform
  takes precedence / 3. a log line to grep at startup. Keep; it gains the entry-point mechanism that
  explains it.
- Verdict for the h2: it does two jobs (the model, and the startup configuration), which its own
  description shows ("so you can place ... and set the compile path"). Split: the model stays, the
  compile path becomes its own h2, placed after the feature matrix so the page runs decide, then
  configure, in the order the h1 description already lists.

**h2, Pick the line from the instance family**

- Version table and caption (601-627): 1. the lookup from instance family to line and pin / 2. "each of
  the last three SDK releases moved the pin" / 3. read the vLLM pin from the package name. Keep.
- Trn2 and Trn3 column (630-663): 1. where new work goes / 2. each SDK release has come 41 to 63 days after the last /
  3. which image to start from, and when to re-benchmark. Keep; reorder so the re-read and rerun
  instruction lands last and the vendor 2.5x claim (attributed) motivates it.
- Trn1 and Inf2 column (664-690): 1. the constraint for older capacity / 2. two AWS pages disagree on
  the pin / 3. plan to the 2.28 pin for NxD Inference kernels. Keep (doc-doc conflict, practical).
- Alert, vLLM 0.29.0 on Neuron (693-711): 1. the consequence of the pin for copied commands /
  2. none new / 3. check flags such as `--max-num-active-seqs` against 0.29.0. Keep, and make it the
  h2's last block.
- Three code paths (713-764): 1. where each line lives, and the archived fork / 2. none / 3. avoids the
  archived fork and the old vLLM install page. Already demoted; move above the alert so the h2 ends on
  the action rather than a link list.

**h2, Feature matrix for the 1.x plugin**

- Intro (782-794): 1. check the model first / 2. none / 3. the tested-model list; acronym expansions
  for the table. Keep.
- Table (795-804): 1. the go or no-go per feature / 2. none / 3. rules Trainium in or out. Keep;
  one redundant clause in the pipeline-parallelism note comes out.
- Caption (805-844): 1. "Supported means tested for at least one model" is practical; the rest is the
  provenance of the notes column / 2. none / 3. check the model's recipe. Keep the first sentence
  visible; demote the provenance (it is the only provenance marker for the table rows, so it stays,
  attribution included).
- h2 description: "keeps, gains and loses" names gains the matrix does not show. Delete "gains".

**h2, Configure it the Neuron way**

- 1. Quantization (862-894), 2. Segmented prefill (896-910), 3. NIXL connector (912-947), 4. 0.5.x
  translation (949-960): each 1. a GPU or 0.5.x habit that carries over wrong / 2. small local models
  (Neuron keys in `neuron_config`; prefill and decode never share a batch) / 3. a command, a flag, a
  connector name, a NIXL ceiling. Keep all; already framed as how to get it right.

**h2, Case study: Amazon Rufus on Trainium**

- Intro (978-987): 1. evidence vLLM on Trainium runs at production scale / 2. none / 3. none directly.
  Keep; vendor scale claim stays quoted and attributed.
- Leader, followers, collectives (989-1021): 1. how that deployment is built / 2. leader and follower
  multi-node serving / 3. pattern reference only. Already demoted.
- Alert, what carries over (1023-1031): 1. the reader's takeaway / 2. Rufus is Trn1 plus NxD Inference;
  the 1.x pattern is prefill/decode over EFA / 3. design new work from the 1.x list. Keep; its first
  sentence repeats the intro, so it shrinks to the provenance it carries ("AWS's blog").

**h2, When Trainium for vLLM**

- Lists (1049-1075), capability versus cost (1076-1084), next step (1085-1092): 1. the decision and the
  first commands / 2. capability first, cost by benchmark / 3. the three checks, the image, the two
  variables. Keep; already ends on the reader's next action.

## Edits

Line numbers: "before" is the file at HEAD `bdc101e`; "after" is the edited file.

| # | after file:line | verb | before | after |
| --- | --- | --- | --- | --- |
| E1 | AwsNeuron.tsx:322-327 | re-express | "`vllm-neuron`. Its README opens: "The vLLM Neuron plugin is the recommended serving solution for large language models on AWS Trainium." [README L3]" | "`vllm-neuron`, "the recommended serving solution for large language models on AWS Trainium" [README L3]". Narration removed; the recommendation stays a quotation, so "recommended" still reads as the project's advice |
| E2 | AwsNeuron.tsx:857-866 | reorder | Entry-point sentence ("The package registers `neuron = "vllm_neuron:register"` under the `vllm.platform_plugins` entry-point group [pyproject L25-L26], the group vLLM loads when it resolves which platform it runs on [plugins/__init__.py L21-L23]") in the h1 "What it is" (before 328-336) | Opens "Check which platform loaded", ahead of the log line it explains; "The package" becomes "The plugin". Text and both Cites otherwise unchanged |
| E3 | AwsNeuron.tsx:390 | re-express | Stack h2 description ending "...so you can place any Neuron deployment on its line and set the compile path before the first start" | Ends at "...on its line"; the second payoff moves to the new h2 (E5) |
| E4 | AwsNeuron.tsx:429-455 | demote | Worker class, scheduler, `model`/`nki` packages and Model Runner V2 paragraph inline (before 438-462) | Same paragraph and 5 Cites inside ExpandableSection "Code behind the plugin layer". The diagram's plugin box carries the same four points, and the feature matrix carries the runner rule with its log line |
| E5 | AwsNeuron.tsx:724-879 | reorder | "How it compiles", "Two variables...", "Keep the compile across restarts" and "Check which platform loaded" inside the stack h2 (before 463-583), ahead of "Pick the line" | New h2 "Set the compile path before the first start" after the feature matrix and before "Configure it the Neuron way". Its title reuses the old stack description's phrase; its description is "Which route compiles your model, the variables that select it and keep its NEFFs across restarts, and the log line that confirms the plugin loaded" |
| E6 | AwsNeuron.tsx:756-757 | delete | "The practical consequence is in the integration guide: "vLLM Neuron uses its own copy..."" | ""vLLM Neuron uses its own copy of the lowering, so the two versions can be different" [integration guide]". The link carries the provenance |
| E7 | AwsNeuron.tsx:829-855 | demote | "The release notes headline the path as "built on the TorchNeuron library" [doc-code-conflict]; that holds for the lowering, and not for the package." (before 481-485) and "The features guide also documents `NEURON_COMPILED_ARTIFACTS` ... reads that variable [2 doc-code-conflict Cites]" (before 557-570), both inline | Both inside ExpandableSection "NEURON_COMPILED_ARTIFACTS and the TorchNeuron headline, checked against the code". "also" is dropped, and "the path" becomes "the native route" because the move removed its referent. Scope wording (the three trees searched) and all three conflict Cites are unchanged |
| E8 | AwsNeuron.tsx:773 | re-express | Bold lead "Two variables to set before the first start." | "Two variables to set first." The h2 title now carries "before the first start" |
| E9 | AwsNeuron.tsx:521-532 | reorder | Trn2/Trn3 column: cadence sentence and "re-read the version table and rerun your benchmark at each one", then the GPT-OSS-120B 2.5x claim | The 2.5x claim (still "release notes claim", all conditions intact) comes first, so the column ends on the re-read and rerun instruction |
| E10 | AwsNeuron.tsx:538 | delete | "The 1.x plugin lists Trn2 and Trn3 only." | Removed. The table's Instances column, the column's own h3 ("Trn1 and Inf2: the 0.5.x line only") and the Rufus alert all carry it |
| E11 | AwsNeuron.tsx:564-635 | reorder | "Pick the line" ended on the "Three code paths" disclosure (a link list), after the vLLM 0.29.0 alert | Disclosure moved above the alert, so the h2 ends on "Read every version note in this dive against 0.29.0 before you copy a GPU launch command" |
| E12 | AwsNeuron.tsx:646 | delete | Matrix h2 description "keeps, gains and loses" | "keeps and loses". The matrix shows no gain over GPU vLLM (scope weakened) |
| E13 | AwsNeuron.tsx:196 | delete | Pipeline-parallelism note "Not available; the supported splits are TP, SP, DP, EP and CP." | "The supported splits are TP, SP, DP, EP and CP." The red status badge already says it |
| E14 | AwsNeuron.tsx:677-720 | demote | Matrix caption: the practical sentence plus seven sentences of per-row provenance (8 Cites) inline (before 805-844) | "Supported means tested for at least one model, so check the model's recipe too" stays visible; the per-row provenance moves unchanged into ExpandableSection "Sources behind the notes column". Its attributions stay because they are the only provenance the table rows have (attribution case 4) |
| E15 | AwsNeuron.tsx:1057 | delete + re-express | "The blog is AWS's account of a leader/follower vLLM deployment running on Trainium at very large scale. Its stack runs on Trn1, ..." | "The stack in AWS's blog runs on Trn1, ..." The alert has no Cite, so the provenance and the vendor grading ("AWS's blog") stay; the repeat of the intro and the disclosure header goes |

Reverted during the self-check: removing "The README's" from "The README's end-to-end tested models are ..." in the matrix intro. Without it, a list scoped to the README reads as a general claim about which models were tested, so the scope would have strengthened. The line is back to its before text.

Not changed: the diagram (geometry, text, `<title>`, `minWidth: 640`), every sourced number, both doc-code conflicts and the doc-doc conflict (Trn1/Inf2) apart from E7's move, every hedge scope, all three vendor figures (2x/6x start, 2.5x GPT-OSS-120B, the Rufus scale quotes) and their attribution.

## Claim-set diff

None. Every assertion in the after text was already in the before text. Method: both files normalized
(Cites, tags and entities stripped) and split into sentences. Nine sentences in the after text do not match
the before text verbatim, and each one is accounted for:

| after sentence (short) | why it differs | source it still rests on |
| --- | --- | --- |
| "vLLM reaches AWS Trainium through ... "the recommended serving solution ..."" | E1, quotation shortened to a verbatim substring | vllm-neuron README L3 at v0.29.0.1.2.0 |
| "The plugin registers `neuron = ...` under the `vllm.platform_plugins` entry-point group ..." | E2, moved; "package" became "plugin" | pyproject.toml L25-L26; vLLM v0.31.0 plugins/__init__.py L21-L23 |
| "The features guide documents `NEURON_COMPILED_ARTIFACTS` ..." | E7, "also" dropped | features guide L53-L65; the plugin tree and lite wheel searches (register R13) |
| "The release notes headline the native route as "built on the TorchNeuron library"" | E7, "the path" became "the native route" | v0.29.0.1.2.0 release notes headline: "`torch.compile` support using native PyTorch, built on the TorchNeuron library" (register R8) |
| "Two variables to set first." | E8 | none needed (a heading) |
| "The README lists plugin 0.5.3 ..." | E10, the sentence before it was deleted | unchanged |
| "The supported splits are TP, SP, DP, EP and CP." | E13 | unchanged |
| "The stack in AWS's blog runs on Trn1, ..." | E15 | AWS ML blog, How Amazon scaled Rufus (Tier 2, cited in the same h2) |
| New h2 title and description (E5) | re-expression of the old stack description and of the four moved paragraphs | features guide L38-L40, lite envs.py L80-L138, envs.py L779-L786, vLLM v0.29.0 platforms/__init__.py L270-L272 |

The four disclosure and h2 headers added ("Code behind the plugin layer", "Sources behind the notes column",
"NEURON_COMPILED_ARTIFACTS and the TorchNeuron headline, checked against the code", "Set the compile path
before the first start") label content already on the page. The third keeps the searched-code scope: its body
still names the three trees searched.

## Reader-visible word counts

Measured on the rendered page (Vite build, Playwright, `main` element of `#neuron` at 1440 px; script
`/tmp/lp-neuron-tools/wc.mjs`). "Prose" excludes SVG text and Cite elements (tier badge, label, accessed
date). "Visible" is the default state with every ExpandableSection collapsed; "expanded" opens them all.

| Measure | Before | After | Change |
| --- | --- | --- | --- |
| Reader-visible prose (collapsed, no SVG, no Cite) | 3,077 | 2,883 | -194 (-6.3%) |
| Reader-visible, all text (collapsed, SVG and Cite labels included) | 3,895 | 3,568 | -327 (-8.4%) |
| All prose with disclosures open (no SVG, no Cite) | 3,286 | 3,285 | -1 |
| All text with disclosures open | 4,173 | 4,172 | -1 |
| Cite elements | 85 | 85 | 0 |
| ExpandableSections | 2 | 5 | +3 |
| File lines / `wc -w` on the .tsx (markup included) | 1,097 / 5,742 | 1,129 / 5,788 | +32 / +46 (new container and disclosure markup, not reader text) |

## Checks

Run after the last edit. `deep-dives/vllm` for the first three, the repo root for the rest.

| Check | Exit | Result |
| --- | --- | --- |
| `pnpm exec vite build --outDir /tmp/lp-neuron-dist --emptyOutDir` | 0 | built (chunk-size advisory only) |
| `pnpm exec tsc --noEmit` | 0 | clean |
| `pnpm exec eslint src/sections/AwsNeuron.tsx --max-warnings 0` | 0 | clean |
| `pnpm exec vitest run` | 0 | 1 file, 5 tests passed |
| `node deep-dives/vllm/revamp/tools/gen-sources.mjs --check` | 0 | "sources.md up to date (659 sources)"; not written |
| `bash scripts/gates/no-ai-tells.sh` | 0 | PASS |
| `bash scripts/gates/svg-a11y.sh` | 0 | PASS |
| `bash scripts/gates/pinned-refs.sh` | 0 | PASS |
| `bash scripts/gates/pre-overflow.sh` | 0 | PASS |
| `node deep-dives/silicon-memory-inference/scripts/shoot.mjs --sections neuron --widths 1440,390 --out /tmp/lp-neuron-shots --dist /tmp/lp-neuron-dist` | 0 | "1 SVG diagram(s), ok" at both widths: no text overlap, no box overflow, no viewBox clipping, no horizontal page overflow |

Render read (PNGs read at 1440 and 390, including per-slice clips in `/tmp/lp-neuron-shots/containers/`):
all five ExpandableSections render collapsed by default with their headers visible ("Code behind the plugin
layer", "Three code paths and the status of each", "Sources behind the notes column", "NEURON_COMPILED_ARTIFACTS
and the TorchNeuron headline, checked against the code", "How the Rufus deployment is built"). Opened (harness
full-page shots), each renders its paragraphs and Cites. The new h2 renders between the feature matrix and
"Configure it the Neuron way". At 390 px the long disclosure header wraps to three lines cleanly.

Layout at 390 px, left as instructed: the stack diagram keeps `minWidth: 640` and scrolls sideways inside its
`overflowX: auto` wrapper, so its right-hand column (the 0.5.x line) is off-screen until the reader scrolls.
The six-column version table also scrolls inside its Cloudscape frame at 390 px (Instances and Status columns
off-screen); that was already the case.

## Gate 3

**9 / 10** (fact-check score before this pass: 8 / 10).

The fact-check held Gate 3 at 8 because the stack h2 carried four dense practical paragraphs inline with the
`NEURON_COMPILED_ARTIFACTS` doc-code conflict among them. That h2 now holds only the model and its diagram. The
startup configuration has its own h2, which leads with what it configures and sits where the reader configures
(after picking a line and checking features). Both doc-code conflicts are behind a disclosure whose header
names the variable. Every h2 ends on an action or a check, and the section's strongest number (the vLLM 0.29.0
pin) still lands in the h1, the alert header, the decision lists and the next step. It is not a 10 because the
cache paragraph is still about 150 words of unbroken practical text, the compile and cache model has no picture,
and both the diagram and the version table scroll sideways on a phone.

## For the orchestrator

1. **Diagram at 390 px.** `NeuronStackDiagram` has `minWidth: 640` and scrolls sideways on a phone; left
   unchanged as instructed. A stacked (single-column) mobile variant would be new scope.
2. **Backlog, not a correction:** a small decision diagram for the compile path and cache
   (`VLLM_NEURON_BACKEND` unset, `neuron_native` or `vllm_neuron`, then cache on or off, then where the NEFFs land
   under `VLLM_CACHE_ROOT`, `NEURON_LIBTORCH_CACHE_ROOT` or `TORCH_NEURONX_NEFF_CACHE_DIR`). Every input is
   already sourced on the page. This is the one mental model the section carries only as prose.
3. **Acronym order after the reorder.** The first EPD expansion in reading order is now the feature table's
   "(EPD, encoder disaggregation)"; the cache paragraph's "encoder-disaggregated (EPD)" is a second expansion
   (harmless). The section's MoE expansion now sits inside the collapsed "Code behind the plugin layer"
   disclosure. MoE is expanded earlier in the dive (sections 8 to 15), and the diagram already used MoE before
   that paragraph, so the dive-level rule holds either way.
4. **Minor, unchanged:** the disclosure "Three code paths and the status of each" holds four paragraphs (three
   code paths plus vLLM's own docs). The header is accurate for three of them.
5. **sources.md** is current (`--check` exit 0). No Cite URL or label changed.
6. **Concurrent commit.** Mid-pass, the working tree held another session's uncommitted changes in
   `deep-dives/silicon-memory-inference/src/sections/` (AwsCompilersAndTooling, AwsCustomSilicon,
   CommunicationAndScaleOut, DeterminismAOT). That session committed them on this branch as `42c34fd`
   ("silicon-memory-inference: lead the TorchNeuron blocks with the reader's decision", 10:26 -0700) while this
   pass was running. This pass did not touch them. HEAD is now `42c34fd`, not `bdc101e`; `AwsNeuron.tsx` is
   identical at both commits, so the "before" baseline holds. The final gate run passed either way, and the
   tree now shows only this pass's two files.
7. Register `09-neuron-2-33-repin.md` needs no change: no claim moved between rows.
