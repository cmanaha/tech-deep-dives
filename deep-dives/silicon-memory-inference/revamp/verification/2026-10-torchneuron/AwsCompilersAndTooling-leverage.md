# Leverage pass: AWS Compilers and Kernel Tooling (TorchNeuron update, Neuron SDK 2.33.0)

Status: COMPLETE

Run: 2026-10-24, headless. Standard: `deep-dives/efa/revamp/leverage-pass-standard.md` (binding), with
`deep-dives/efa/revamp/section-shape-standard.md` and the repo `CLAUDE.md`. Input: the fact-checked
section (`AwsCompilersAndTooling.md` in this directory, Gate 3 8/10), at HEAD bdc101e.

Files in scope: `src/sections/AwsCompilersAndTooling.tsx`, `src/sources/AwsCompilersAndTooling.ts`,
`src/components/TorchNeuronStackDiagram.tsx`, `src/components/AwsCompilerStack.tsx`. No other section
imports either component (grep). Only the section file was edited. No source record changed and neither
diagram changed.

## Scores (1 to 5, scored as a reader)

| Axis | Before | After | Why it moved or held |
| --- | --- | --- | --- |
| Mental model | 4 | 4 | Strong before: one NEFF per op against one per graph, the NEFF as the schedule, NKI as a custom call. The pass made the TorchNeuron h2 a single model (the package and pin facts moved out) and gave the h1 front-end model its dated consequence. The four-stage compiler block is still descriptive and has no predictive hook. The model was not deepened. |
| Practical leverage | 4 | 5 | The porting h2 is now an ordered checklist: install and pin, port, prove in eager, compile, boundary. The serving and training blocks open with the decision instead of the mechanism. The fallback check comes before the evidence for it. The profiling h2 description names the moment a reader reaches for it. |
| Rigor | 4 | 4 | Fixed: "A new shape means a new compile." had no citation. It now carries `torchNeuron233`, fetched this pass. One suspected inference ("therefore does not change how vLLM Neuron compiles") was checked and is stated on the cited page. Still open: unchanged claims cite 2.32.0 pages (fact-check backlog). |
| Accuracy | 5 | 5 | No claim changed scope. Every sourced number, the three doc-code conflicts, every hedge and the vendor attributions are intact, and some moved. |
| Economy | 3 | 3 | Prose went from 3,409 to 3,403 words, and the default reading path (disclosures closed) from 3,118 to 3,053. The duplicated NKI how-to and two narrated provenance clauses are gone. Citation stacking and the overall length remain. |

## Per-block answers (meaning to reader / model / leverage)

1. h1 "What the stack is": which of two front ends your framework and instance take / two front ends converge on neuronx-cc, NEFF and Runtime (React Flow diagram below carries it) / choose TorchNeuron or the XLA build by PyTorch version and instance, now with the 2.34 end date.
2. h1 "The NEFF is the schedule": why tuning on Trainium happens before the run / compile-time scheduling, no run-time warp scheduler / points the reader at flags, graph and kernels, which are the next three h2s.
3. Compiler stack diagram and four stages: what neuronx-cc does to the graph / four ordered stages, visible in the React Flow / understanding only, so that NKI's entry point makes sense.
4. "NKI enters at the back end": what an NKI kernel buys you / skips stages 1 to 3 (the green edge in the diagram) / tells the reader which decisions become theirs when they write NKI.
5. Components and versions (disclosure): what to pin for 2.33.0 / none / version pinning and the NxD Inference absence. Already demoted.
6. TorchNeuron intro: what TorchNeuron is before it is dissected / a standard PyTorch device through PrivateUse1 / installing the package is enough, no import needed.
7. TorchNeuronStackDiagram and caption: the whole TorchNeuron model in one picture / eager per op, compile per graph, NKI into both, XLA lane, c10d / the reader can locate where their code lands. Caption now states the code provenance of -O1 and -O2 in one clause.
8. "Eager mode compiles one NEFF per operator": what eager costs / per-op NEFF, cache keyed by shape, dtype and stride, HBM between ops / predicts recompiles on new shapes; the concatenation knob.
9. "torch.compile compiles one NEFF per graph": why to compile / graph-level NEFF at -O2, graph breaks lose context / motivates fullgraph and the compile checklist.
10. "NKI kernels enter both paths as custom ops": how a kernel joins either path / custom call inside the graph's NEFF, no graph break / understanding only here. The how-to now lives once, in the section's closing block.
11. Collectives: how distributed PyTorch runs / c10d "neuron", collective cores in a node and EFA between nodes / configure TP in NeuronCores; FSDP needs no change.
12. "One package name, two products" (moved to open the porting h2): what to install / one package name covering two products / pin torch-neuronx to the PyTorch version; the package will not refuse an unsupported instance.
13. "Port by changing the device": the minimum code change / device string swap / exact edits, and the torch_xla exit.
14. "Prove the model in eager mode, then compile it" plus the new disclosure: how to find CPU fallbacks / fallback is silent for unimplemented ops / read `get_fallback_ops()`, or set `..._ONLY_FOR_UNIMPLEMENTED_OPS=1`. The doc-doc and doc-code conflict sits one click away.
15. Practice 1 code block: the checklist as runnable code / none / copy and run.
16. "Compile with static shapes and full graphs": the compile rules / static shapes, forced breaks / dynamic=False set by hand, fullgraph, mode, MoE experts outside the compiled region, hot-region fallback.
17. "The 2.33.0 support boundary": what will not work yet / none / avoid sparse, func, nested, distributions, FP8 on Trn2, forward-mode AD.
18. "How mature the beta is" (disclosure): how far to trust the beta / none / gauge risk from attributed vendor figures and one Tier 3 run with its disclosure. Already demoted.
19. Matmul precision: why an FP32 model's matmuls stay FP32 / auto-cast default since 2.27.0 / the exact flags and where to pass them, with TorchNeuron's dtype route.
20. XLA compile cache: why each machine recompiles / cache key = flags plus graph / share via `NEURON_COMPILE_CACHE_URL`.
21. TorchNeuron NEFF cache: the same for TorchNeuron / key includes compiler version / FSx mount, local lock dir, the disable variable that is actually read.
22. Environment code block: the three settings as code / none / copy.
23. Serving (decision moved first): what to serve on / vLLM Neuron carries its own lowering / migrate off NxD Inference before 2.34; set `TORCH_DEVICE_BACKEND_AUTOLOAD=0`; pin by tag.
24. Training (recommendation moved first): what to train on / none new / TorchNeuron with FSDP2 and DTensor; TorchTitan Neuron and TRL specifics.
25. "The order is fixed; the timing varies": why to profile a static schedule / fixed order with variable timing / understanding, so the profiling tools make sense.
26. Three tools: which tool for which question / none / pick neuron-ls, neuron-top or Neuron Explorer; the capture command rename.
27. "From inside a TorchNeuron job": how to profile TorchNeuron / per-engine tracks colored by PyTorch op / torch.profiler with PrivateUse1; budget about 5 GB of HBM for device mode.
28. "Fleet health is a separate tool": node health / none / Observer daemon, `nobs`, Prometheus endpoint.
29. Profiling closing sentence: the order in which to use the tools / none / a workflow.
30. "What NKI is" and "When to reach for it": whether to write a kernel / explicit SBUF/PSUM placement against Triton's managed memory / check the NKI Library first; write your own when the profile shows a bottleneck.
31. "Develop on a CPU, then time the NEFF": how to iterate without hardware / none / simulator, then nrtpy timing.
32. "Then call it from PyTorch" (section close): how to ship the kernel / none / call directly; wrap in `nki_op` only for autograd or a named op; register the backward pass. This is the reader's next action.

## Edits

All in `src/sections/AwsCompilersAndTooling.tsx`. Line numbers refer to the after file. Rendered-text
diff checked sentence by sentence against the before build.

| # | Line(s) | Verb | Before | After |
| --- | --- | --- | --- | --- |
| E1 | 178-180 | re-express (repeat of an existing claim) | h1 named the XLA build "deprecated" with no date | adds "Its inference support on Trn2 and Trn3 ends in Neuron 2.34." with `whatsNew233`. The same claim and source already stood in the serving block (before L623-626) and the library h2 description. 2.34 is now the section's repeated number: h1, h2 description, serving block. |
| E2 | 266-267 | re-express | "loads it through the `torch.backends` entry point the package registers" | "loads it through the package's `torch.backends` entry point" |
| E3 | 274-275 | re-express | "The -O1 and -O2 compiler levels are the ones the torch-neuronx source sets at tag v2.33.0, cited below." | "The torch-neuronx source at tag v2.33.0 sets the -O1 and -O2 levels, cited below." |
| E4 | 281 | delete | "In the source, these per-operator compiles run at -O1" | "These per-operator compiles run at -O1". Code provenance is carried by the pinned `tnxEagerOptLevel` link and by the caption (E3). "the level the compiler reference describes as minimizing compile time" is kept: it bounds the claim to the documentation's wording. |
| E5 | 287-288 | re-express (citation attached, source fetched this pass) | "A new shape means a new compile." (no citation) | same sentence, followed by `torchNeuron233` |
| E6 | 305 | delete | "In the source, graph compiles run at -O2" | "Graph compiles run at -O2" |
| E7 | 314-317 | re-express and reorder | "Call a plain @nki.jit kernel on neuron tensors directly, or register it with torch_neuronx.nki_op, which creates a named torch.library custom op; reach for nki_op only when you need autograd or a named operator." | "A plain @nki.jit kernel can be called on neuron tensors directly, and torch_neuronx.nki_op registers one as a named torch.library custom op." The "only when" guidance moved to E14. All four citations stay. |
| E8 | 343-372 (old 341-356) | reorder | "One package name, two products" closed the TorchNeuron h2 | the same block, unchanged, now opens the porting h2. Reading order is the same. Only the h2 boundary moved, so acronym first-use is unaffected. |
| E8b | 350 | re-express | porting h2 description "Change the device string, find the operators ..." | "Pin torch-neuronx to your PyTorch version, change the device, find the operators ...", taken from the moved block's "Install the family that matches your PyTorch version and keep the pin" |
| E9 | 389-408 | demote | the doc-doc conflict (overview "warning" against best practices "silent") and the code reading sat between "at a cost in performance" and the action | the action ("Read `get_fallback_ops()` after a run instead of the log", the `..._ONLY_FOR_UNIMPLEMENTED_OPS=1` switch) follows the fallback sentence directly. The conflict text, verbatim with its four citations, sits in `ExpandableSection` "Why the log is not the check". |
| E10 | 482-483 | re-express (narrated attribution) | "AWS also excludes forward-mode automatic differentiation from the first release." | "The first release also excludes forward-mode automatic differentiation." `pytorchBlog` (T2) still carries provenance. This is a scope statement, not a performance figure. |
| E11 | 616-634 | reorder | serving opened on vLLM Neuron mechanics, and the NxD Inference / PyTorch/XLA end in 2.34 came fourth | the end-of-support sentence and the migration targets open the block. The text is unchanged. |
| E12 | 636-644 | reorder | training opened on the 2.30 and maintenance facts | "On Trn2 and Trn3, train on TorchNeuron, with FSDP2 and DTensor as above." opens the block, followed by the 2.30 and maintenance facts. The text is unchanged. |
| E13 | 667 | re-express | profiling h2 description "The NEFF fixes the instruction order while the timing still varies; torch.profiler and three tools show where the time goes, ..." | "When utilization is lower than you expect, three tools and torch.profiler show where the time went, ...". The trigger comes from the h2's own closing sentence. The order-versus-timing model stays as the first block's bold lead. |
| E14 | 782 | delete | "collection of optimized kernels, here at its 2.32 tag." | "collection of optimized kernels." The page-meta clause about the link's pin goes. The `nkiLibraryRepo` title still names tag 2.32, and the URL stays pinned. |
| E15 | 803-810 | re-express (receives E7's moved guidance) | "call the @nki.jit kernel on neuron tensors directly, or wrap it in torch_neuronx.nki_op for a named custom op that runs in eager mode and inside torch.compile." | "call the @nki.jit kernel on neuron tensors directly. Wrap it in torch_neuronx.nki_op, a named custom op that runs in eager mode and inside torch.compile, only when you need autograd or a named operator." `torchBestPractices` moved with the guidance. The register_autograd sentence keeps its own two citations. |

## Claim-set diff

Assertions in the after that are not in the before: **none.**

The after has these sentences in positions or wordings the before did not. Each traces to the before or
to a source fetched this pass:

- "Its inference support on Trn2 and Trn3 ends in Neuron 2.34." Present in the before at the serving
  block ("PyTorch/XLA inference end support on Trn2 and Trn3 in Neuron 2.34") and in the library h2
  description. Source `whatsNew233`, the same as before.
- The `torchNeuron233` citation on "A new shape means a new compile." The assertion is unchanged; the
  citation is new. The page was fetched 2026-10-24 and reads: "A shape the compiler has not seen before
  compiles on first use; after that the operator is served from the cache."
- "nki_op ... only when you need autograd or a named operator" was moved from the TorchNeuron h2 to the
  close, with `torchBestPractices` ("Wrap the call in @nki_op only when you need autograd or a named
  PyTorch operator", fact-check row 31).
- The porting description's "Pin torch-neuronx to your PyTorch version" restates the moved block's
  install-and-pin sentence (`torchNeuronNotes`, `torchNeuronxRepo`).
- The profiling description's "When utilization is lower than you expect" restates the h2's closing
  sentence.
- The disclosure header "Why the log is not the check" summarises the before's "Read ... after a run
  instead of the log" plus the conflict it introduces.

Scope check: no "was found" became "exists", no searched tree was dropped (the `dynamic=False`,
`TORCH_NEURONX_DISABLE_NEFF_CACHE` and platform-check sentences are untouched), and no inference was
placed between a claim and its citation.

## Reader-visible word counts

Method: build with `vite build`, open `#aws-compilers` in Chromium at 1440 px, open every
ExpandableSection, remove citation badges, then take `innerText` of `main` from the section h1 onward
(side navigation excluded). Inline SVG text and `<pre>` code blocks are counted separately. "Default
path" is the same count with every disclosure left closed. Scripts: `/tmp/lp-awscomp-tools/wc.mjs`,
`wc2.mjs`, `count.py`.

| | Prose, all disclosures open | Prose, default path | Inline SVG labels | Code blocks |
| --- | --- | --- | --- | --- |
| Before (HEAD bdc101e) | 3,409 | 3,118 | 136 | 94 |
| After | 3,403 | 3,053 | 136 | 94 |

## Sources fetched during this pass (accessed 2026-10-24, default curl User-Agent, no personal data)

- `vllmTorchNeuronDesign` (`/en/v2.33.0/vllm-neuron/docs/design/compilation/how_vllm_is_integrated_with_torchneuron.html`,
  HTTP 200). Checked because "The torch-neuronx installed beside it therefore does not change how vLLM Neuron
  compiles" read like inference placed in front of a citation. The page states it: "Because of this, the
  version of torch-neuronx in your environment does not change how vLLM Neuron compiles your model." No
  change needed.
- `torchNeuron233` (`/en/v2.33.0/torch/about-pytorch-neuron.html`, HTTP 200). Checked because "A new shape
  means a new compile." in the eager block carried no citation of its own. The page states: "A shape the
  compiler has not seen before compiles on first use; after that the operator is served from the cache."
  The existing record is attached to the sentence. No source record changed.

## Checks

Run from the dive root unless noted, after the last edit.

| Check | Exit | Notes |
| --- | --- | --- |
| `pnpm exec tsc --noEmit` | 0 | no output |
| `pnpm exec eslint src/sections/AwsCompilersAndTooling.tsx src/sources/AwsCompilersAndTooling.ts src/components/TorchNeuronStackDiagram.tsx --max-warnings 0` | 0 | |
| `pnpm exec vitest run` | 0 | 2 files, 948 tests passed, including the sources.md snapshot (no source record edited) |
| `bash scripts/gates/no-ai-tells.sh` (repo root) | 0 | scanned efa, silicon-memory-inference, vllm |
| `bash scripts/gates/svg-a11y.sh` | 0 | |
| `bash scripts/gates/pinned-refs.sh` | 0 | |
| `bash scripts/gates/pre-overflow.sh` | 0 | |
| `pnpm exec vite build --outDir /tmp/lp-awscomp-dist --emptyOutDir` | 0 | |
| `node scripts/shoot.mjs --sections aws-compilers --widths 1440,390 --out /tmp/lp-awscomp-shots --dist /tmp/lp-awscomp-dist` | 0 | "3 SVG diagram(s), 1 React Flow, ok" at both widths |

PNGs read: `aws-compilers-1440-svg2.png` (TorchNeuronStackDiagram, unchanged) shows no overlap or
clipping. `aws-compilers-390-svg2.png` scrolls sideways inside the 640 px wrapper with labels at full
size, as before. Additional clips of the edited containers (`/tmp/lp-awscomp-shots/c-porting-1440.png`,
`c-porting-390-top.png`, `c-library-1440.png`): the moved block opens the porting h2, "Why the log is not
the check" renders and opens at both widths, the reordered serving and training blocks read cleanly, and
there is no page-level horizontal overflow at 1440 or 390.

## Gate 3

**Score: 8/10** (needs 7). The section now reads forward. The porting h2 runs install, port, prove,
compile, boundary. The library blocks open on the decision and the 2.34 deadline. The fallback conflict
sits behind a disclosure next to the action it supports, and 2.34 is landed three times as the section's
decision date. Every h2 description states a payoff or names the reader's moment, and the section still
closes on the reader's next action (call the kernel from PyTorch). It holds at 8 rather than rising
because economy barely moved: about 3,400 words with sentences that stack four or five citations. The
four-stage compiler block still describes rather than predicts.

## Open items

- **Concurrent edits in this worktree.** During this pass `git diff --stat` showed changes to
  `src/sections/AwsCustomSilicon.tsx`, `src/sections/CommunicationAndScaleOut.tsx` and
  `src/sections/DeterminismAOT.tsx`. This pass did not make them and did not touch them. The checks above
  ran against the tree with those edits present.
- Glossary: no new acronyms. The acronym first-use order is unchanged (E8 moves only an h2 boundary).
- Carried from the fact-check backlog, out of scope for a four-verb pass because each needs a re-fetch and
  a source-record change: unchanged claims still cite 2.32.0 pages; "NKI 0.6.0 adds data-dependent loops"
  in the h1 could be restated against NKI 0.7.0; and TRL's "vLLM doesn't run on Neuron" may need a
  clarifying clause.
- Economy candidates for a later pass: the TorchTitan limits sentence repeats three compile rules from the
  porting h2. Several sentences stack four or five citations (for example the c10d and NEFF-cache blocks),
  and some could be consolidated where one record bears the whole sentence.
