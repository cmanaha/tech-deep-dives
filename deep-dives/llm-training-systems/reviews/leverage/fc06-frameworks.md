# Leverage pass fc06-frameworks (sections 15, 16, 27), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Four verbs only (delete, reorder, demote,
re-express); no assertion. Run after the fact-check fixes in `reviews/factcheck/fc06-frameworks.md`; the
post-fact-check state is saved in `/tmp/lts-fc-fc06-preleverage/` for the claim-set diff.

## Before-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| FrameworkMap.tsx | 5 | 4 | 5 | 5 | 2 |
| FineTuning.tsx | 4 | 5 | 5 | 5 | 4 |
| Trainium.tsx | 4 | 4 | 5 | 5 | 3 |

Rendered word counts (text outside SVG and code blocks, measured in the built page at 1440 px):
FrameworkMap 4,099 words visible with every disclosure closed, 4,356 with all open; FineTuning 2,706
and 3,158; Trainium 3,600 and 3,979. These include table cells and Cite labels. Economy is FrameworkMap's
weak axis: only 257 of its words sit behind a disclosure, and supporting evidence (a project's
collection list, a one-layer test, an index of defaults owned elsewhere) sits in the argument's path.

## Three questions per substantial block

Q1 is what the block means to the reader, Q2 the mental model and whether it is visible, Q3 how the
reader uses it.

### FrameworkMap.tsx (section 15, The Framework Map)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | Defines a framework and says why the names churn | Three engines, many front ends; stated in prose, drawn in the map below | Frames the choice: pick the engine first |
| Three engines, and the front ends on top | Names what each engine does and which front end sits on which | Engine plus front end; the map diagram makes it visible | Lets the reader place any framework they meet and know whose defaults apply |
| Split and Nanotron (expandable) | The evidence behind the split, and why Nanotron is off the map | Supporting | For the reader who checks our reading |
| One idea, four names | Translates ZeRO stages across engines | Stage 1, 2, 3 under four names; the table makes it visible | Compare memory numbers across frameworks; two of the four start off |
| Read the maturity label | Says how far to trust each API, at a pinned tag | Alpha, experimental, prototype; the maturity table makes it visible | Pin the release and its nightlies; read NeMo 2 tutorials as history; follow AWS's replacement for NxD Training |
| NeMo's pivot (expandable, new) | The README title and collection list behind the pivot | Supporting | For the reader who checks |
| What each engine implements | Matches parallelism and precision to framework versions | FP8 on H100 through Transformer Engine; the implementation table | Choose a framework for a precision; TorchTitan v0.4.0 removed legacy Float8 |
| DeepSpeed's FP8 test (expandable, new) | The one-layer test behind the composition claim | Supporting | For the reader who checks |
| Resharding | Decides when a layout change must be planned | Reshard at load, after the fact, or across DP only; prose with three bold leads | Save fully reshardable before a TP, PP or EP change; `--no-load-optim` otherwise |
| Documented workflow (expandable) | The doc-code conflict on the resume flag | Supporting evidence for the conflict | The error strings are failure signatures to recognise |
| Configuration, launchers and the AWS images | Defaults that differ between front ends, and the image versions | FSDP1 against FSDP2 by default; config table | Write the FSDP version down; check the log for the CP warning; re-read a default at the image's version |
| Three questions | The chooser and the ending | Engine first, then front end, then version | Pin, then take the degrees to section 14 |
| Four defaults (expandable, new) | An index of defaults owned elsewhere | Supporting | Four settings to check, each with its owning section |

### FineTuning.tsx (section 16, Fine-Tuning & Post-Training Runs)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | What fine-tuning changes: the memory budget | Freeze the base, shrink the state | Frames the sizing and the framework choice |
| What a frozen base leaves in memory | The per-parameter figures and the 70B worked case | 16, 2 and 0.5 bytes per parameter; the bars diagram makes it visible | Pick full, LoRA or QLoRA by GPU count; activations become the part to plan |
| How the 70B figures are counted (expandable) | Arithmetic and LLaMA-Factory's estimate | Supporting | Check a published estimate against the floor |
| Fine-tuning frameworks configure an engine | Axolotl and LLaMA-Factory as front ends | Front end over engine, carried from section 15 | The engine's version decides the defaults |
| RL is an inference job inside a training job | Which training engine each RL framework reuses | Rollout engine plus training engine; the engine table | Read an RL run's sharding and checkpoints from its training engine |
| Where AWS's recipes start you | The recipes' shape and one recipe's node count | A recipe's node count sits above the memory floor | Start from a recipe and read its size as a working configuration |
| Size your run, then pick the engine | The sizer widget and the engine grouping | Floor first, then engine | Size the GPUs, then pin the engine beside the front end |

No block failed the three questions and no block carries evidence in the argument's path that a
disclosure would serve better: the two expandables already hold the arithmetic and the per-row reads.
No edit.

### Trainium.tsx (section 27, Trainium: The Neuron Path)

| block | Q1 meaning | Q2 model, visible? | Q3 leverage |
|---|---|---|---|
| Intro | What changes on Trainium and why the current stack is hard to find | Same step, different software and rank unit | Frames the path: start from what AWS validated |
| The training stack | Which stack AWS supports and what ended | TorchTitan Neuron on TorchNeuron beside the GPU stack; the stack diagram | Install the current stack; recognise NxD Training material; test PP yourself |
| NxD notices (expandable) | The dated notices | Supporting | For the reader who checks |
| Counting ranks the Neuron way | The rank unit, memory per rank and placement | 64 ranks of 24 GiB, TP 4 on one chip | Set NGPU=64; size with section 14 using 64 and 24 GiB |
| BF16 on Trainium2, and where to buy | Precision limit and prices | BF16 only at 2.33.0; peak price per PFLOP-hour | Plan BF16; buy a Capacity Block in Ohio |
| What each AWS path gives | Who builds what on each path | Path table | Pick the path; bring the training stack on every one |
| The two published sample steps | What a first step should look like and how to read its MFU | 158 per rank, 632 per chip against 667 | Convert the printed MFU before comparing; compare a first step with the trn2 sample |
| Fork search (expandable, new) | Where the benchmark search looked | Supporting evidence for the hedge | For the reader who checks |
| Start the run | The ordered procedure | One node, two nodes, then measure | Exact commands and order |

## Edits (four verbs only)

1. FrameworkMap.tsx, demote: the Nanotron sentence and its two Cites move from the post-training
   paragraph into the existing expandable, retitled "Where the split into engines and front ends comes
   from, and where Nanotron fits".
2. FrameworkMap.tsx, demote: the NeMo README title and the v3.0.0 collection list move into a new
   expandable, "NeMo's pivot in its own repository". The body keeps the pivot quote (same NEMO_SPEECH
   Cite), the move to Bridge, AutoModel and NeMo RL, "read NeMo 2 tutorials as history (our reading)",
   torchtune, NxD Training and AWS's recommendation, each with its Cite.
3. FrameworkMap.tsx, demote: DeepSpeed's one-layer FP8 test moves into a new expandable, "DeepSpeed's FP8
   test". The body keeps "no FP8 switch" and the hedge "no full-model FP8 recipe for DeepSpeed was
   located in this research", with its scope.
4. FrameworkMap.tsx, demote and reorder: the index of four defaults owned by other sections moves into a
   new expandable after the chooser's lead-in, so the h2 runs lead-in, chooser, next action.
5. Trainium.tsx, demote: the fork's benchmarks folder, CI workflows and tests README move into a new
   expandable, "Where the fork was searched for a benchmark". The body keeps "AWS publishes no Trainium2
   throughput or MFU benchmark for TorchTitan Neuron in the Neuron 2.33 docs or the fork", its scope
   unchanged.

Protected items held: every Cite kept with its sentence; doc-code-conflict and vendor-claim kinds
unchanged; venues unchanged by this pass; "Illustrative, not measured" caption and "A5 protocol (not yet
run)" untouched; hedge scopes unchanged ("was located in this research", "our reading", "our
arithmetic"); strongest numbers and their repetition untouched (64 ranks per trn2.48xlarge, 632 against
667 TFLOPS, the 70B 15 H100 to one).

## Claim-set diff (after against `/tmp/lts-fc-fc06-preleverage/`, the post-fact-check state)

Assertions in the after that are not in the before: none. The five new or retitled disclosure titles
restate the content they hold. The NeMo README title sentence now opens "At v3.0.0 the NVIDIA/NeMo
README is titled", the before's "The NVIDIA/NeMo repository at v3.0.0 is titled", same Cite; "its
collections are now" lost "now". Assertions deleted: none. Cites deleted: none (NEMO_SPEECH now
appears twice, once with each half of the sentence it used to carry). FineTuning.tsx: no change.

Rendered words with disclosures closed: FrameworkMap 4,099 to 3,932; Trainium 3,600 to 3,537;
FineTuning 2,706 unchanged. With all disclosures open each total is within 31 words of the before.

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| FrameworkMap.tsx | 5 | 4 | 5 | 5 | 3 |
| FineTuning.tsx | 4 | 5 | 5 | 5 | 4 |
| Trainium.tsx | 4 | 4 | 5 | 5 | 3 |

FrameworkMap's economy rises a point: four pieces of supporting evidence now sit one click away and the
last h2 ends on the chooser and the next action. It stays at 3 rather than 4 because its three wide
tables carry most of its words (about 1,200), and they are the reference a reader uses. Demoting a table
is a scope call for the orchestrator, not a correction. Trainium's demotion is small (63 words), so its
economy holds at 3. Accuracy holds at 5 in all three.

## Verification after the pass

- typecheck: `tsc --noEmit`, exit 0. lint: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0.
- test: "Test Files 6 passed (6)", "Tests 165 passed (165)".
- Gates: no-ai-tells, pinned-refs, svg-a11y and pre-overflow all PASS.
- Harness (vite build to /tmp/lts-dist-fc06, shoot.mjs on port 4706, every ExpandableSection opened):
  frameworks, fine-tuning and trainium each 1 SVG, all "ok" at 1440 and 390, no overflow reported. No
  diagram was touched. The two text-only changes were checked by reading element screenshots at
  both widths: the sample-steps container (`/tmp/lts-shots-fc06/el-sample-*.png`) and the configuration
  table (`el-config-*.png`). The sample lines scroll sideways at 390 inside their `pre`, the house style.
