# Leverage pass fc02-arithmetic: sections 4, 5 and 6

Reviewer pass 2, 2026-10-31, run on the files after the pass 1 corrections. Verbs used: delete, reorder, demote, re-express. Nothing asserted.

## Before-scores (after pass 1, before pass 2)

| File | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| Arithmetic.tsx (section 4) | 4 | 4 | 5 | 5 | 3 |
| MemoryBudget.tsx (section 5) | 4 | 4 | 5 | 5 | 3 |
| Precision.tsx (section 6) | 4 | 4 | 5 | 5 | 4 |

Reasons: section 4 builds the 6ND-and-denominator model well and ends on a calculator, but at about 2,830 words it carries supporting evidence (parameter-basis bullets, the DGX Spark denominator story, the FP8 vendor rows, the 8B and 70B card ratios) inline, between the argument and the reader's next step. Section 5 has the same shape around the optimizer alternatives and the activation evidence. Section 6 is denser and already demotes most evidence.

## Section 4, Arithmetic.tsx: three questions per block

| Block | 1. What it means to the reader | 2. Mental model, and is it visible | 3. How the reader uses it | Action |
|---|---|---|---|---|
| h1 intro | One estimate starts every reservation and budget in the dive, and it checks out against Llama 3 405B | FLOPs are fixed by N and D; time needs a peak and a share of it | Frames the sizing work that follows | Kept |
| MFU and the identity | Gives the formula the dive sizes runs with, and the 297,000 H100-hours example | `time = 6ND / (accelerators x dense peak x MFU)`, shown as a code line; MFU against HFU | Turns any model, token count and fleet into hours | Kept; the Megatron-LM form is already in an expandable |
| Attention | Says when 6N undercounts | Attention grows with s while 6N stays fixed; the diagram and the share table carry it | Price each stage at its own sequence length | Kept (pass 1 corrected the 8,192-token share sentence) |
| Which parameters and FLOPs | Makes two MFU figures comparable | Three choices behind every MFU: which N, which attention term, whether recomputation counts | Check the three before setting your MFU against a published one; convert tokens per second between counts | Kept; each bullet is one of the three choices |
| Dense peak | Picks the denominator | Dense is half the printed sparse figure; a framework's table is a denominator you have to read | Read the denominator in the log; convert a TorchTitan Trainium2 MFU with x 632 / 667; divide FP8 by the FP8 dense peak | Demoted the DGX Spark run (a worked case of the rule just stated) into "Our DGX Spark run: one step against a measured and a missing denominator"; deleted its opener, which the header now carries |
| Check against 405B | How far to trust the estimate | The estimate is a steady-state floor; published hours run 1.1 to 1.3 times it | Read Calculator A's hours as the floor | Demoted the 8B and 70B card ratios (upper bounds, supporting) into "The same card's 8B and 70B hours"; moved the single-data-point hedge and the floor sentence to the end of the block so it ends on the reader's next action |
| How many tokens | Sets D | About 20 tokens per parameter for compute-optimal; served models train far past it | Choose D before pricing | Kept |
| Calculator A, A2 and A5 | Runs the identity on the reader's own plan | Every assumption visible | Replace the 40% with a measured step | Kept |

## Section 5, MemoryBudget.tsx: three questions per block

| Block | 1. What it means to the reader | 2. Mental model, and is it visible | 3. How the reader uses it | Action |
|---|---|---|---|---|
| h1 intro | Whether the model fits before launch | Four parts: state, activations, logits, buffers | Frames the levers | Kept |
| Model state | Prices the state before any token | 2 + 2 + 12 = 16 bytes, 18 with FP32 gradients; the optimizer table shows the alternatives | State the gradient dtype with every total; pick an optimizer row | Kept; the per-row provenance is already in an expandable |
| Activations and logits | Sizes the part that grows with tokens | sbh per layer, moved by two code choices; logits as a second term | Check the attention kernel and the SwiGLU; budget the logits at their peak | Kept; E1's method and the eager-attention arithmetic are already in an expandable |
| Levers | Closes a gap at the lowest price | Each lever divides one part and pays elsewhere; the lever table and the bar diagram carry it | Shard first for 8B; recompute or use TP with SP for 70B | Kept; E2's recompute cost is already in an expandable |
| Beyond the formula | Plans for memory no formula counts | Buffers, fragmentation and the allocator sit outside the formula | 75% headroom target; allocator settings; read allocator counters rather than `nvidia-smi` | Kept; the TorchTitan 70B peak is the payoff the h2 names |
| Calculator B and A2 | Runs the formulas on the reader's layout | Per-rank peak at the first or last stage | Compare with the first measured step | Kept |

No change in pass 2. Each main-flow passage still standing carries a protected item (a hedge scope, a documentation-versus-code statement, a Tier 0 result, or the 128.5 GB figure and its repeat) or is the payoff its h2 names.

## Section 6, Precision.tsx: three questions per block

| Block | 1. What it means to the reader | 2. Mental model, and is it visible | 3. How the reader uses it | Action |
|---|---|---|---|---|
| h1 intro | Which precision the chip runs, and what each step down costs | Peak doubles per step down; state does not shrink | Frames the choice | Kept |
| A narrow format needs a scale | Reads every format as values times a scale | FP16 loss scaling as the first case | Recognise what a recipe has to manage | Kept |
| Where the scale lives | Predicts a recipe's needs from one question | Values per scale: model, tensor, 32, 16; the diagram carries it | Choose a recipe by granularity | Kept |
| Published runs | Sets expectations for loss | Measured gaps for FP8 and NVFP4 | Decide how much validation a step down needs | Kept |
| Accelerator and framework | Matches format to chip and framework | Capability gates in code; framework reach | Pick the framework that reaches the recipe; note the unset-recipe default changes between p5 and p6-b200 | Kept (pass 1 added the TorchAO README conflict, which is protected content) |
| Compute bill and state | Budgets a step down | At most half the hours, same state | 297,000 to about 148,500 H100-hours for 70B | Kept |
| Choose the format | Leaves with flags per accelerator | The format per accelerator follows from the gates above | Copy the flags | Kept; the reference table is already in an expandable |

No change in pass 2. Evidence already sits in three expandables, and the block order already ends on the flags.

## Claim-set diff against HEAD

Assertions present after both passes and absent before, each with its source:

- Section 4: attention is 7% to 22% of per-token FLOPs at 8,192 tokens (computed from the page's own BARS constants, Calculator A's flopsPerToken); the embedding is charged 4 x d_model FLOPs per token (Kaplan et al. Table 1, already cited); 632 = 79 per core over eight cores (TorchTitan v0.4.0 tools/utils.py L111-L232 and the Trainium2 page, both already on the page); about 5.5% and `MFU against 667 = printed MFU x 632 / 667` (our arithmetic, same wording as section 27); the A5 trainer prints MFU against 632 per chip (https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan/tools/utils.py#L194-L206, fetched and cited in pass 1); MegaScale venue NSDI 2024 (USENIX proceedings page).
- Section 5: TorchTitan v0.4.0's Llama 3 config wraps the SwiGLU in a `torch.compile` region by default (https://github.com/pytorch/torchtitan/blob/v0.4.0/torchtitan/models/llama3/model.py#L87-L89 and activation.py#L34-L66, fetched and cited in pass 1); FP16 in the ZeRO paper (Section 3.1, already cited).
- Section 6: the TorchTitan MXFP8 README lists TorchAO 0.18.0 or later (README#L25-L29, already cited on the page as L1-L36); "a nightly satisfies both", labelled our reading; NVFP4 gate (TE quantization.py L151-L187, already on the page); `--bf16` and the distributed optimizer (Megatron guide L244-L253, already cited); "for Qwen3" (neuron_mxfp8.md L1-L16, already cited).

Pass 2 itself added no assertion: it moved two passages verbatim into expandables, moved two sentences to the end of their block, and deleted one opener sentence.

## After-scores

| File | Mental model | Practical leverage | Rigor | Accuracy | Economy |
|---|---|---|---|---|---|
| Arithmetic.tsx (section 4) | 4 | 4 | 5 | 5 | 4 |
| MemoryBudget.tsx (section 5) | 4 | 4 | 5 | 5 | 3 |
| Precision.tsx (section 6) | 4 | 4 | 5 | 5 | 4 |

Section 4's main flow now reads rule, conversion, action in its denominator and 405B blocks, with the worked case and the upper-bound ratios one click away. Accuracy holds at 5 in all three files.
