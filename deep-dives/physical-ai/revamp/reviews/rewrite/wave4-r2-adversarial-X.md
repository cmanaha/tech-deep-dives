# Adversarial review, batch w4r2 / inX

| file | argument | depth | clarity | sentences | parity | verdict |
|---|---|---|---|---|---|---|
| doc-A | 6 | 6 | 5 | 7 | 6 | distinguishable: weaker. Its premise is wrong (FlashAttention presented as a decode fix), the second half is a list of per-model facts and GPU generations that end in pointers, and keys and values are used before the query or attention has been built. |
| doc-B | 8 | 8 | 6 | 6 | 7 | distinguishable: weaker, narrowly. The argument and depth match the best files, but the editing does not: facts and definitions repeated, provenance clauses throughout, a shape-table row that contradicts its neighbour, no prices in the Spot half. |
| doc-C | 8 | 9 | 8 | 8 | 9 | sets the bar. Intuition, then formula, then decomposition, then toy numbers, every time; defaults set against papers; ends on three numbers the reader writes down. |
| doc-D | 8 | 9 | 7 | 7 | 8 | not distinguishable by quality from the best files. Same method and rigour as doc-C (built terms, a recomputed card, a known-answer test); faults are local: repetition, bookkeeping, a withheld PyTorch setting. |

---

## doc-A: "KV Cache and FlashAttention"

Scores
- argument 6: a thesis arrives in paragraph 2 (KV bytes per token decide how much context fits) and is worked for one model, but the section is two subjects joined by "and", the FlashAttention half is tied to decode by a wrong premise, and the later blocks drift into a per-model list.
- depth 6: the Llama 3.1 70B sizing and the MLA byte count reach level 400; FlashAttention's mechanism stops short of the trick that makes it work, its saving carries no number, PagedAttention has no payoff figure or knob, and no quality cost of KV quantization or MQA is given.
- clarity 5: the reader meets keys, values, heads and "attends" before any of them is built; the query first appears three blocks later; "global cache", "linear attention", RoPE and "conditional softmax rescaling" are named and never explained.
- sentences 7: mostly specific and clean; a few recap lists, "on this page" self-reference, a release-tag date at the weight of a decision, and an ending made of two pointers.
- parity 6: cleaner sentence by sentence than the long files, but shallower and carrying a conceptual error a careful reader would catch.

Findings, most damaging first

1. Quote: "Decode sits far below the ridge point (Roofline and Arithmetic Intensity): every generated token rereads the weights and the keys and values of every earlier token. ... FlashAttention works on the other half of the ratio: it cuts the bytes attention moves through HBM."
   What is wrong: this ties FlashAttention to decode's bandwidth problem. In decode the score matrix per head is one row (1 x seq), so writing it to HBM is negligible; the bytes that dominate decode attention are the K and V reads, which fusion does not reduce. The section's own Trainium example is a prefill kernel. A level 400 reader leaves with a wrong model of where FlashAttention pays.
   Fix: say FlashAttention's HBM saving lands in prefill and training, where the score matrix is seq x seq; say decode attention's bytes are the KV reads, which only the KV levers on this section shrink. That also gives the section the single argument it lacks (decode: shrink KV; prefill: keep the tile on chip).

2. Quote: "Across current models it spans more than 300x, from 327,680 bytes for Llama 3.1 70B ... to 890 bytes of global cache for DeepSeek-V4.1-Flash." with the heading description "Why the attention design, more than the parameter count, decides how much context fits in HBM".
   What is wrong: the headline ratio mixes levers. The 890 B is stored in FP4 (a factor of 4 against the BF16 Llama figure) and excludes a sliding-window cache the section later admits "sits outside that figure" and never sizes. The 368x is therefore partly precision and partly an unmeasured omission, credited to attention design.
   Fix: compare at like precision (890 B at FP4 is roughly 3,560 B at BF16, about 92x from design, if the whole global cache is FP4) and give the sliding-window cache's bytes at a stated context; or lead with DeepSeek-V3's like-for-like 4.7x and keep V4.1-Flash as the extreme with both caveats in one clause.

3. Quote: "Each layer's attention produces a key (K) and a value (V) vector per KV head for every token, and each new token attends to all the earlier ones."
   What is wrong: the level 100 to 200 reader has not been told what attention computes, what a head is, or what "attends" means; the query (Q) first appears in the FlashAttention block ("the queries (Q) times K transposed"). Without the query, the reader cannot see why K and V are worth caching and Q is not.
   Fix: before "What it stores", two sentences: each new token's query is scored against every earlier token's key, and the scores weight those tokens' values; a head is one independent copy of this with its own projections. K and V of past tokens never change, so they are kept; the query is new every step.

4. Quote: "FlashAttention fuses the three into one kernel that streams K and V through on-chip memory in tiles and never writes the score matrix out."
   What is wrong: it omits the reason tiling was hard and how it is solved. Softmax needs a row's maximum and sum over all keys, so a tile-at-a-time kernel must keep a running max and sum and rescale its partial output when a later tile raises the max. Without that, "conditional softmax rescaling" in the Blackwell paragraph refers to something the page never built.
   Fix: one sentence on the running max and sum and the rescale; then the Blackwell paragraph's "conditional" (skip the rescale when the max does not move) reads as a consequence.

5. Quote: "It changes the bytes: fewer cross HBM per FLOP, so arithmetic intensity rises and bandwidth-bound attention finishes sooner."
   What is wrong: the section works every KV number but gives FlashAttention's central claim no number, so "fewer" stays an adjective.
   Fix: work one prefill as an illustration: an 8K x 8K score matrix in BF16 is 8192 x 8192 x 2 = 128 MiB per head per layer, written and read back by unfused attention, against 2 MiB each for that head's Q, K, V and output (8192 x 128 x 2).

6. Quote: "Pick the generation by GPU. FlashAttention-2 supports Ampere, Ada and Hopper GPUs. FlashAttention-3 is a beta built for Hopper (H100) ... FlashAttention-4 ... targets Hopper and Blackwell (H100, B200) ... It ships as betas; fa4-v4.0.0.beta35 came out on 2026-10-14."
   What is wrong: the paragraph promises a pick and does not make one: on an H100 the reader has FA3 and FA4 and no reason to choose. The release-tag date sits at the same weight as the decision (a reference-manual fault). "CuTe DSL (NVIDIA Compilers and Kernel Tooling)" is not an expansion of CuTe and says nothing about what it is.
   Fix: state the choice per GPU and what decides it on Hopper (or say plainly that the choice on Hopper is open and what to measure); move the tag date into the citation; say what CuTe DSL is in a clause (NVIDIA's Python layer for writing tensor-core kernels) or drop it.

7. Quote: "Which one dominates depends on the deployment. On a single GPU, the weights usually take most of the HBM: serving a 13B model on a 40 GB A100, the vLLM authors measured about 65% of memory on weights and close to 30% on KV."
   What is wrong: it contradicts the paragraph above it, where on one H200 the batch's 85.9 GB of KV outweighs 70.6 GB of FP8 weights. "Usually" generalises from one 13B data point, and "the vLLM authors measured" is provenance in the sentence. The eight-GPU sentence then stops before its consequence: "70.6 GB of FP8 weights leave about 1,057 GB for the KV cache and activations."
   Fix: say the split is set by batch x context, not by GPU count, and finish the count: 1,057 GB holds about 3.2 million BF16 tokens of Llama 3.1 70B KV, about 390 requests of 8K (twice that in FP8 KV).

8. Quote: "Kimi K2 keeps the same 512-wide latent." / "Qwen3-Next-80B-A3B keeps a KV cache in 12 of its 48 layers and uses linear attention in the rest."
   What is wrong: a run of model facts at equal weight, none converted to bytes per token or to context held. "Linear attention" is never explained, so the reader cannot tell why those layers need no growing cache. Kimi K2 adds nothing the DeepSeek-V3 row did not.
   Fix: cut Kimi K2; for one hybrid, give its KV bytes at a stated context next to a full-attention model of similar size; one clause on linear attention (a fixed-size running state per layer in place of a per-token cache).

9. Quote: "The heads' keys and values are rebuilt from the latent, and only the latent and the RoPE key are cached, 4.7 times less per token than Llama 3.1 70B."
   What is wrong: MLA is presented as free. Rebuilding K and V costs arithmetic (or a weight-absorption rewrite), and the reason the 64-wide RoPE key is kept apart is not given, so the reader sees an unexplained extra 64. The trade is exactly what the opening roofline frame would explain: decode has idle compute and scarce bytes. "4.7 times less" is also loose phrasing.
   Fix: one sentence on the trade (bytes for arithmetic, which suits decode below the ridge point) and one clause on why position information is cached separately; write "a 4.7th of" or "4.7 times smaller".

10. Quote: "PagedAttention splits the cache into fixed-size blocks ... which brings the waste near zero and raises the batch a given HBM budget can hold."
   What is wrong: the paragraph opens with exact figures for the waste before paging (20.4% to 38.2% used) and closes with "near zero" and no batch or throughput figure after it, from the same paper. No block size or setting is named, and prefix reuse, a large lever, gets half a clause.
   Fix: give the paper's measured waste after paging and its throughput gain, name the block-size setting and its default, and give prefix reuse one sentence on when it pays (shared system prompts).

11. Quote: "Storing the KV in FP8 as well halves it to 42.9 GB, and 113.5 GB fits." / "FP8 and NVFP4 ... KV caches are both supported in TensorRT-LLM, and DeepSeek-V4.1-Flash stores its main KV in FP4."
   What is wrong: KV precision is offered as a free lever. Level 400 needs the failure mode: lower-precision KV and MQA can cost accuracy, and the section says so for MQA only in passing.
   Fix: one sentence on what fewer bits per KV entry risks and how to check it (compare long-context accuracy on your own task before and after).

12. Quote: "Fixed-size blocks let a server fill HBM with live requests, and every lever on this page raises the batch it can hold" / "Every technique on this page raises that cap: fewer KV heads (GQA), a compressed latent (MLA), sliding windows and linear-attention layers, fewer bits per entry, and paging." / "Read the table as the formula at work."
   What is wrong: prose about the page itself and a recap list that works as a key-takeaways box.
   Fix: replace the recap with one worked comparison that uses all the levers: the free HBM of one H200 counted in 8K-token requests for Llama 3.1 70B with BF16 KV, with FP8 KV, and for a GQA 16:1 and an MLA model at the same weight size.

13. Quote: "vLLM and TensorRT-LLM both page the KV cache. In TensorRT-LLM, KvCacheConfig(dtype='fp8') stores the cache in FP8, and NVFP4 KV is also listed."
   What is wrong: repeats the previous block's TensorRT-LLM sentence and gives no vLLM setting, so the "what to configure" header is half answered.
   Fix: drop the repeat; give the vLLM KV dtype and memory-fraction settings beside the TensorRT-LLM one.

14. Quote: "Blackwell shifts the bottleneck toward the softmax. From H200 to B200, dense BF16 tensor throughput per GPU rose 2.3x ..., while the special function units (SFUs) ... went from 4.5 to 5 TeraExponentials/s. NVIDIA notes that ..."
   What is wrong: the decisive ratio is left for the reader to compute (2.3 / 1.11, about 2.1 times fewer exponentials per matrix FLOP), and the principle that explains it, "a fused kernel runs at the pace of its slowest unit", is tacked on after a colon at the end.
   Fix: lead with the principle, state the 2.1x, then FlashAttention-4's answer. Drop "NVIDIA notes that"; the citation carries it.

15. Quote (ending): "Flash as a Cache Tier for Inference sizes host DRAM and local NVMe for that tier and weighs fetching a cached prefix against recomputing it, and the KV Offloading and LMCache section of the vLLM Inference Engine dive covers the software that moves it."
   What is wrong: the section ends on two pointers to other pages. The real action, "host_cache_size (default 0)", is in the sentence before.
   Fix: end on the action and its size: set host_cache_size, sized as tokens to hold x KV bytes per token; put the two pointers on links earlier in the block.

16. Quote (title): "KV Cache and FlashAttention".
   What is wrong: a topic label naming two subjects; the claim the section proves is not in it.
   Fix: a title that states the claim, for example that KV bytes per token, set by attention design, cap the decode batch.

17. Quote: "890 bytes of global cache" (paragraph 2).
   What is wrong: "global cache" is used before anything distinguishes it from a sliding-window cache, which arrives four blocks later.
   Fix: a clause at first use, or move the figure to after the sliding-window block.

---

## doc-B: "20. Fifteen Workloads, Five Shapes: Count the Bottleneck Before You Benchmark"

Scores
- argument 8: the first paragraph hands the reader a tool (demand per unit of work against each part's supply; the first to fill is the bottleneck) and the second works it to 84% with a measured figure and shows the wrong-scale error; the ending turns the tool into a procedure. It loses points because it is two arguments (bottleneck, then Spot shape) joined by an asserted "second question", and the headline tensor-core claim rests on readings the table marks as findings.
- depth 8: level 400 almost throughout: GiB against GB, the AV1 engine list per EC2 family, torchcodec on CPU whatever the card, the 64% idle inference from a 2.8x speedup, AWS_BATCH_JOB_ATTEMPT and the Host EC2* retry rule, the coincidence argument. Missing: any price for Spot or Capacity Blocks, so "how capacity is bought" has no money in it; memory gates treated as fixed where batch size moves them.
- clarity 6: most terms are glossed inline, but the density is high (an 11-part definition table, a 15 x 11 grid with six tag types and a five-sentence legend), and the CPU physics evidence assumes "top-down formula" and "slots" the page never builds.
- sentences 6: many sentences carry a consequence and a number; against that, bookkeeping clauses recur, several facts are stated twice or three times, and the header description is overloaded.
- parity 7: the strongest argument and depth in the batch; a careful reader would still mark it as less edited than the cleanest file (repetition, provenance clauses, a self-contradicting table row).

Findings, most damaging first

1. Quote: "The shape of a job decides whether Spot is open and how its capacity is bought" (heading) and the whole Spot half.
   What is wrong: "how its capacity is bought" is answered without a single price. No Spot discount, no reclaim frequency, no Capacity Block rate, no checkpoint write time. The reader cannot weigh "checkpoint every 30 minutes" against what Spot saves, so the decision the section promises cannot be made from the page.
   Fix: for the SmolVLA example on one L4, give the On-Demand and typical Spot price of the cited size, the time to write one checkpoint, and the expected cost with a reclaim; one sentence for Capacity Blocks on what the up-front payment buys.

2. Quote: "Which units the arithmetic then fills is, by our reading, the tensor cores for a policy's training and its calls and the general units for batched physics, and a counter would settle it."
   What is wrong: this concedes that the tensor-core "first" cells are inferred, yet the grid marks them with the same "first" as cells backed by a measurement or a spec sheet, and the section description sells the result: "see that only about half of them are tensor-core jobs". The headline is weaker than its presentation.
   Fix: mark inferred cells differently from measured or spec-sheet cells (for example "first (read)"), and phrase the headline as what the gates settle: about half the workloads are decided by CPU cores, GPU memory or a video engine before tensor throughput matters.

3. Quote (shape table, row C): "No: a lost node stops the step on every node, back to the last checkpoint" against row B: "Yes, back to the last checkpoint".
   What is wrong: both rows describe the same loss (back to the last checkpoint), so the "No" contradicts the definition of interruptibility given earlier ("how much work a stop loses"). What closes Spot to C is coupling and the Batch rule, which the Spot column already states.
   Fix: C's interruptibility: "Yes, back to the last checkpoint, on every node at once"; leave the Spot column to carry the rule.

4. Quote (shape table, row D): "A standing fleet kept at its size all day, where the other shapes queue jobs."
   What is wrong: the column is "How the capacity is bought" and this row does not say how: Spot, On-Demand, or a Savings Plan for a steady load. The neighbouring Spot column says Spot is open, so the reader cannot tell whether the fleet should be Spot.
   Fix: name the purchase option for a steady fleet and the condition under which Spot fits it (per-item work, a queue that replays the item in flight).

5. Quote: "Record and encode (section 9). The CPU back end of the computer beside the arm."
   What is wrong: the row is assigned to the back end with no counter evidence, while the grid's legend says "A cell across both CPU columns means the evidence names CPU cores without saying which half". The section breaks its own rule on this row.
   Fix: span both CPU columns for record and encode, or cite a counter run.

6. Quotes: "(sources read 2026-11-20)" (header description); "62.3% of its cycles were stalls on memory (our single runs)"; "starting 5 operations a cycle where the X925 starts 10 (single runs)"; "on the evidence we hold, no row fills memory latency first"; "is, by our reading, the tensor cores"; "(to about 10.6%, using a constant borrowed from another Arm core)".
   What is wrong: provenance and method bookkeeping in reader prose, repeated, including in the header description. The citations already carry Tier 0 and single-run labels.
   Fix: one plain clause once, near the first measurement, that our figures are single runs on two machines; delete the rest; move the borrowed-constant caveat into the citation.

7. Quote (CPU physics evidence): "The front-end shares also run high, because our top-down formula counts some cycles lost to mispredicted branches as front end. On the X925 the excess is about 1.6 points of the 12.2% (to about 10.6%, using a constant borrowed from another Arm core); on the A78AE it is not known, so the Jetson's front-end lead of 31.0 - 21.5 = 9.5 points holds only if its excess is smaller than that."
   What is wrong: a method audit inside the evidence for one row. "Top-down formula" and "slots" are not built anywhere on the page, so the level 100 to 200 reader cannot follow it, and the paragraph never reaches what the reader does about CPU physics. Its useful number, 286 times real time on one core, comes last.
   Fix: lead with the consequence (one world per core, so cores are the unit to buy; the X925 steps the humanoid at 286 times real time), give the back-end versus front-end split per core in one sentence, and move the formula caveat to the citation.

8. Repetition. Quotes: "the same L4 GPU comes with 4 vCPUs (virtual CPUs, EC2's unit of processor capacity)" then, about fifteen lines on, "Most eight-GPU sizes give 24 vCPUs (virtual CPUs, EC2's unit of processor capacity) per GPU"; the table's "Most eight-GPU sizes sit at 24 vCPUs per GPU, 12 physical cores" repeated in the next paragraph; "g7.48xlarge 700 Gbps with EFA" followed three sentences later by "EFA, which g7.48xlarge has and the two smaller sizes lack"; GR00T N1.7's 16 GB requirement stated three times and the 149.0 ms median twice.
   What is wrong: this is what "did not have a proper read" looks like: definitions and facts restated because blocks were written separately.
   Fix: define vCPU once; state the 24-per-GPU ratio once; cut the EFA restatement; state 16 GB once in the gate paragraph and refer to "that 16 GB" after.

9. Quote: "A GiB is 1.074 GB, so on the figures as printed 24 GB is 22.4 GiB and 40 GB is 37.3 GiB: the pi0 class cannot be counted on to fit an L4 and fits an L40S."
   What is wrong: the LeRobot figures are "indicative peak memory at a batch of 8", so the gate holds for the stock recipe, not for the model. Batch size, gradient checkpointing and parameter-efficient fine-tuning all move it, and the reader who owns an L4 is told "ruled out" without the knob.
   Fix: one clause: at batch 8 as printed; name the settings that lower peak memory, so "cannot be counted on" reads as a statement about the default.

10. Quote: "The same count settles the computer beside the arm. NVIDIA's GR00T N1.7, a policy of 3 billion parameters, needs a GPU with 16 GB or more for inference"
   What is wrong: this is a lookup, not "the same count". The count the reader would do (3 billion x 2 bytes = 6 GB of BF16 weights) suggests the model could fit in 8 GB, so the stated 16 GB needs a reason.
   Fix: do the count and say what fills the rest (activations, the vision encoder, runtime), or call it the vendor's stated requirement and drop "the same count".

11. Quote: "The fifteen workloads are the jobs behind one SO-101 arm ... Beside recording, training and running the policy, they include world-model training, which teaches a network ...; generative augmentation, in which ...; the engine build, which ...; and closed-loop evaluation, which ..."
   What is wrong: a definition list placed as the opening of the workload block, where the claim ("only about half fill tensor cores first") should open. With "Three properties ... sort the fifteen workloads ... into five shapes" in paragraph 3 and the title's counts, the section repeatedly leads with taxonomy.
   Fix: open the block on the claim and its consequence ("the largest tensor-core instance buys the wrong part"); fold each definition into the evidence row that uses it.

12. Quote (title): "Fifteen Workloads, Five Shapes: Count the Bottleneck Before You Benchmark"; (paragraph 3): "The same unit of work answers the second question, where the job can run and how its capacity is bought."
   What is wrong: the counts in the title carry no claim (the same family as "One Robot, One Loop"). "The second question" refers to a first question the page never posed, and the join between bottleneck and Spot shape is asserted, not shown.
   Fix: keep the claim half of the title; in paragraph 1 pose both questions the unit of work answers (which part fills, and what a stop loses), so paragraph 3 completes a stated plan.

13. Quote (caption): "Read the blue cells marked "first": ... The other cells add what else the job loads: at the same time (also), next (then), instead (or), as a fit it must pass (gate), or in one share of the job (mix). A cell across both CPU columns means ..."
   What is wrong: six tag types and a spanning rule make the grid a reference sheet; the prose below then restates its result. A reader on a phone will not hold the legend.
   Fix: two tags (first, also), with gate folded into GPU memory's "first" and mix stated in the evaluation row's prose.

14. Quotes: "The span is a factor of almost 100." / "Per instance, 6,400 / 2.5 = 2,560 times the small size; per GPU ... 320 times the small size's 2.5." / "12,500 / 125 = 100 times from one end to the other."
   What is wrong: span ratios that decide nothing; the "Size by it for" column already says what each end point is for.
   Fix: keep the end points, cut the ratios.

15. Quote: "sending them once takes 4.4 x 8 / 2.5 = 14 s at 2.5 Gbps and 0.05 s at 700 Gbps. A step of 1 s of arithmetic that waited for that exchange would take 15 s on the small size and 1.05 s on the large one."
   What is wrong: labelled an illustration, but the level 400 reader will size by it. A ring all-reduce moves close to twice the gradient bytes per node, and frameworks overlap the exchange with the backward pass; one effect lengthens the step and the other hides it, and neither is named.
   Fix: one clause: an all-reduce moves about twice this, and overlap with the backward pass hides part of it; the order of magnitude between the sizes stands.

16. Quote: "Its learner does the gradient updates on a GPU without blocking the actor, so it has no deadline of its own; the two talk over the network, so the learner can run on any GPU machine the actor reaches, though by default it shares the actor's."
   What is wrong: the paragraph opens "lands in the same shapes" and leaves the learner without a shape or a Spot answer.
   Fix: name it (shape B, Spot open if it checkpoints) in the same sentence.

17. Quote (table cell, on-robot inference): "first: one policy call per chunk".
   What is wrong: "chunk" is used here and defined only in the Spot block ("its next chunk, the run of actions one call predicts").
   Fix: define it at first use, in the workload paragraph.

---

## doc-C: "4. Learning From Demonstrations: Why Copying Drifts and What Fixed It"

Scores
- argument 8: opens on a claim (copying fails for a reason the loss never sees), works the decision count by paragraph 2, proves the drift with the objective and the bound, and ends on three numbers the reader writes down. It loses points because the opening credits both fixes to the drift when the second fixes a different failure, and the OpenVLA-OFT counter-evidence is raised and then blurred.
- depth 9: the objective's subscript as the mechanism, the T-squared bound decomposed factor by factor, toy numbers redone for chunks, defaults against papers (64/32 against 16/8, 100 passes against 10, n_decoder_layers 1 against 7), the pi0 call split into 46 ms and 27 ms. Gaps: why flow still needs ten steps if its path is straight, why tokens train faster, and what ACT does with z = 0.
- clarity 8: intuition, then symbols, then formula, then decomposition, every time; reused symbols (k, epsilon) are flagged at the switch; "mode" gets its second meaning named. A few terms ("leader arm", "tick", "policy") are used before the page defines them.
- sentences 8: specific and consequential ("Behaviour cloning is regression whose test set is written by its own mistakes"); the main blemish is attribution in the sentence, "authors report" about ten times, plus "our count" and "our reading".
- parity 9: the batch's best-edited file.

Findings, most damaging first

1. Quote: "The worst case grows with the square of the number of decisions the policy takes. Two changes contained it. Every policy described here is built on the first, and most of them on the second." and the title "Why Copying Drifts and What Fixed It".
   What is wrong: the second change (sampling one of several valid motions) does not contain drift; it fixes a different failure, averaging two demonstrated routes into one nobody took. The thesis as written credits a generative head with reducing compounding error, which the body never claims or shows.
   Fix: name two failures and their two fixes in the opening: drift, met by deciding less often; averaging, met by a head that commits to one route. The title can carry both ("Why Copying Drifts, Why It Averages, and What Fixed Each").

2. Quote: "Those two choices are also the bill. The chunk length sets how many times a second the policy is called, and the output stage sets how many network passes each call takes."
   What is wrong: by the section's own later account, calls per second are set by the actions played, not the chunk length ("Your control rate divided by the actions played is calls per second"; pi0 predicts 50 and plays 25). The count of settings also drifts: "two of its settings" in the header description, "three numbers" in the later description and the ending.
   Fix: "The number of actions played per call sets how many times a second the policy is called"; make the header description say three settings, matching the ending.

3. Quote: "On the robot that second network is thrown away and z is set to zero, which gives one consistent way." with the framing "let it draw one answer from the set of good ones ... ACT's style variable (one pass)".
   What is wrong: at run time ACT does not draw anything; with z fixed at zero it is deterministic. Listing it among heads that "draw a sample" misclassifies it, and "gives one consistent way" is asserted without the reason: z = 0 is the centre of the curve both routes' codes were pulled toward, so it is not obvious it selects one route rather than something between them. The level 400 reader is left with a mechanism that does not add up; the evidence for ACT is the authors' ablation, which the next block cites.
   Fix: say what the CVAE actually does: in training it removes the pressure to average, because the route is supplied in z; at run time z = 0 fixes one behaviour and the ablation, not a sampling argument, is the evidence it works. Then list ACT as "commits without sampling" beside the three heads that sample.

4. Quote: "A−ϵ is the velocity along that line, the same at every τ, which is why the path is straight." and "Flow matching is diffusion with a straight path and few steps: 10 in pi0".
   What is wrong: the training target is straight for one noise-demonstration pair, but the network learns one velocity per point averaged over every pair that passes through it, so the learned route bends. The section's own logic ("a step is a straight move, so it follows a straight route exactly however long it is") then implies one step should suffice, and the reader is not told why pi0 takes ten.
   Fix: one sentence: each training pair is straight, the learned field averages many pairs and bends, so a few short steps are still needed; ten is pi0's setting, against a hundred for the diffusion default.

5. Quote: "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law."
   What is wrong: the counter-evidence just given (a plain L1 regression head with chunks raising LIBERO success from 76.5% to 97.1%) bears on the reader's choice of head, and this sentence dissolves it into a vague hedge plus bookkeeping. It also does not say that the comparison changed more than the head (parallel decoding, chunking), so it is not a clean test of sampling.
   Fix: state the consequence: chunking is required; a sampling head matters when the demonstrations split into routes, and on a task with one route per situation a regression head with chunks may be enough, as OpenVLA-OFT's result suggests. Name what else changed in that comparison in one clause.

6. Quotes: "its authors report 80 to 90% success"; "as its authors report, plays 25 of them"; "For pi0 its authors report 73 ms per call"; "the authors report 0.1 s per inference"; "The authors report about 30 tokens per chunk per arm"; "The authors report about 5x fewer training GPU-hours"; "ACT's authors report about 5 hours"; "the FAST authors report about 4 days"; "The ACT authors report that they found the CVAE objective"; "the paper notes, citing earlier work"; "by its own comment".
   What is wrong: provenance in the sentence about a dozen times, each already carried by an "author reported" citation. This is the owner's named fault ("as the authors of the faster model report it"). "report that they found" doubles it.
   Fix: state the figures and let the citation grade them; keep attribution only where the authors' own judgement is the claim (the quoted "essential", "hurt policy performance").

7. Quote: "By our arithmetic from LeRobot's tuning rule, the time of one call, measured on your GPU, has to stay under about half the duration of the chunk it predicts" against, one paragraph earlier, "It has to return before the chunk in play runs out, every time".
   What is wrong: two deadline rules a paragraph apart (half the predicted chunk; before the played actions run out), with no reconciliation, in the block the reader acts on. "By our arithmetic from" is bookkeeping.
   Fix: give one rule and its reason in one sentence (the next call must return before the queue of played actions empties, and LeRobot's threshold puts that at about half the predicted chunk), and drop "By our arithmetic".

8. Quote: "The authors report about 30 tokens per chunk per arm. Against our count of 300 for this arm that is 300 / 30 = 10 times fewer."
   What is wrong: the 300 is a 50-action, 6-joint chunk on this arm; the basis of the authors' 30 (chunk length, joints, control rate) is not stated, so the 10x mixes bases and cannot be checked. "Our count" twice is bookkeeping.
   Fix: give the chunk the 30 tokens describe, and compute the ratio on a like chunk or call it an order of magnitude.

9. Quote: "The trade is training time against run time. The authors report about 5x fewer training GPU-hours than flow-matching pi0".
   What is wrong: the heading promises "cheaper to train" and the run-time side gets a two-cause mechanism, but the training side gets only a number; the reader cannot tell why tokens train faster.
   Fix: one clause on the reason, or say the source gives none.

10. Quote: "The tensors are small. Each camera image goes through ResNet-18, a standard image network. A transformer of width 512 reads its output with the joint angles and emits chunk_size rows of target angles." under a heading promising "the tensors".
   What is wrong: no tensor shape is given; "small" is unsupported.
   Fix: give the input and output shapes on the SO-101 (for example the output chunk as 100 x 6) and the parameter count already used later (about 80M).

11. Quote: "The file's own note says the defaults are set for a two-armed ALOHA robot, so on an SO-101 you set your own inputs and outputs and may shorten the chunk."
   What is wrong: "may shorten the chunk" stops short in the one block about the defaults you type, after the section has computed that the default leaves the arm blind for 3.33 s.
   Fix: give the rule the section already has: choose n_action_steps from the reaction time you need at 30 Hz, and keep chunk_size longer than it.

12. Quote (header description): "(the ACT, Diffusion Policy, pi0 and FAST papers, LeRobot v0.7.0 and the openpi code, read 2026-11-20)".
   What is wrong: a source list in the header description; provenance belongs in the citations.
   Fix: drop it.

13. Quote: "A policy gives the machine two jobs of different shape, training and the call on the arm (section 20, Fifteen Workloads, Five Shapes), and both are matrix arithmetic on a GPU's tensor cores."
   What is wrong: "shape" is used in a sense defined in another section, and the paragraph is three pointers (sections 20, 10, 15) in a row before the ending.
   Fix: say the plain thing (one is a job that ends, the other runs against a deadline for as long as the arm runs) and keep one pointer.

14. Quote: "Sit at the bench with the leader arm of the SO-101 in your hand" and "An illustrative 20-second episode at 30 ticks a second is 600 decisions".
   What is wrong: "leader arm" and "tick" are used without a clause for the reader meeting them here; "policy" is used from the header onwards and defined only in the behaviour-cloning block ("the fitted network is the policy").
   Fix: a clause at first use for each (the leader arm is the copy the person moves while the follower repeats it; a tick is one control period).

15. Quote: "The Diffusion Policy authors call multimodal action distributions "a well-known challenge for policy learning"."
   What is wrong: a quotation that adds authority to an undisputed point and nothing else.
   Fix: cut it.

---

## doc-D: "21. Reading a Machine: The Counters That Say Which Part Is Full"

Scores
- argument 8: the first sentence is a claim with a purchase attached (read which part is full before paying for more of it), the 400-slot example works it in paragraph 2, and the strongest lines carry consequences ("A card whose shares sum to 100% has passed no test"; "Compare shares only between cores of the same width"). It loses points because its own worked diagnosis stops at level 1 and ends on "in our reading", and the page holds evidence for the verdict that it never connects.
- depth 9: formulas from the shipped metric file, recomputed from raw counts to four figures with a width check, a known-answer test, width by vendor, the flush correction per core, PMU support by EC2 size and the metal-only PMUs, nvidia-smi against DCGM worked on 100 SMs, and a simt kernel name read correctly. Gaps: the PyTorch setting the GPU example points at, and counter multiplexing.
- clarity 7: micro-operations, slots, front end, back end, retirement, speculation and flush are built in order before they are used; the density of event names and the V2 correction sentence will lose some level 100 to 200 readers, and the four-way sort is explained twice.
- sentences 7: precise and mostly consequential; bookkeeping clauses, a garbled sentence about Jetson and Spark, a rounding the reader cannot redo, and the 1.6-point caveat stated three times.
- parity 8: publishable beside the best file here; a careful reader would not set it apart by quality.

Findings, most damaging first

1. Quote: "The kernel's name, cutlass_80_simt_sgemm_128x128_8x4_nn_align1, carries simt, the general floating-point path: the float32 multiply did not go through the tensor pipeline, so this busy kernel says nothing about the tensor cores, and which precision or PyTorch setting would have sent it there is outside what the run recorded."
   What is wrong: the measured example points straight at a configuration choice, and the sentence withholds it behind bookkeeping. PyTorch documents a float32 matmul precision setting that decides whether a float32 matmul may use the tensor cores; that is first-party documentation, not something the run needed to record.
   Fix: name the documented setting and its default with a citation, say that this run used the default, and tell the reader to check the kernel name for simt after changing it.

2. Quote: "The evidence points at the execution units: in our reading a faster core is the likelier help, and a level-2 count is what would rule out faster memory."
   What is wrong: the section's worked diagnosis ends on a hedge with bookkeeping, under a heading that states the verdict ("The physics-step card points at the execution units"). The page already holds a second line of evidence it never connects: on the same Spark, with the same DRAM, the X925 ran 57,240 steps a second and the A725 28,662.
   Fix: put the same-chip comparison in the fourth question as a second line of evidence (with one clause on what differs between the two cores' caches), state the verdict plainly, and keep the level-2 count as what would close it.

3. Quote: "Its memory-stall and instructions-per-cycle figures come from the second execution of the program, and a ratio that mixes them with the slot shares compares two executions." and the ending: "count the six: cpu_cycles, stall_slot, stall_slot_frontend, stall_slot_backend, op_spec and op_retired. Where the core's file defines them, add STALL_FRONTEND_FLUSH and the level-2 events".
   What is wrong: the reader is never told why the program ran twice. The likely reason is that a core has a fixed number of programmable counters, and asking for more events than that makes perf time-share and scale them, which would break the exact width check the section relies on. The ending then asks for more events without warning of this failure mode, and gives no command line.
   Fix: one sentence on the counter limit and multiplexing (how to see it in perf's output, and that it is why the events were split into two executions); give the full perf stat command for the six events.

4. Quote: "Whether a faster core, faster memory or different code would speed a job up can be read before you pay for any of them" with the bucket list: "Front-end bound points at the code itself: a body of instructions too large, or jumping too often, for the core to fetch and decode fast enough." / "Bad speculation points at branches the core cannot predict, such as decisions that depend on the data."
   What is wrong: the first sentence promises "different code" as an outcome, but only back-end bound is turned into a decision; front-end bound and bad speculation stop at a cause. The list reads at equal weight, as reference.
   Fix: give each bucket the change it calls for (front end: code layout or size, for example profile-guided builds; bad speculation: fewer data-dependent branches) in one clause each.

5. Quote: "A 4096 x 4096 float32 matrix multiply in PyTorch ran as one kernel in 8.35 ms, which is 2 x 4096 x 4096 x 4096 / 8.35 ms = about 16,460 GFLOP/s".
   What is wrong: a computed throughput with nothing to set it against. The next sentence explains that the 70.49% is not a share of peak, so the reader cannot tell whether 16,460 GFLOP/s is good, and the figure is never used again.
   Fix: give the GPU's published float32 peak for the general path (and the tensor path), and say what fraction this kernel reached; or drop the GFLOP/s.

6. Quotes: "by about 1.6 points if the Neoverse V1's constant is borrowed"; "79,584,976 x 4 / 19,922,115,591 = 1.6 points"; "one run cannot show whether a difference of 1.6 points is above the noise". The flush block runs four paragraphs, a per-core list and a formula.
   What is wrong: the correction is worked in full, then restated in the card's first question and again in the ending. On the section's own sample it changes nothing ("The back end stays the largest loss either way"); its practical rule (compare front-end shares only under the same formula and tool version) is one sentence.
   Fix: keep the mechanism, the branchy-code example where the ranking flips, and the comparison rule in the body; put the V1/V2 per-core details and the physics-step estimate in an expandable; state 1.6 once.

7. Quotes: the opening's "Each chance is a slot ... Sorted four ways" and the block "A slot gives every lost chance a cause" ("Slots say why ... Two questions therefore sort every slot of every cycle into exactly one bucket"); "Which half to read first is a question for a timeline of the whole job" and later "so the first reading of a GPU job is a timeline".
   What is wrong: the slot, the four-way sort and the timeline are each explained twice because the opening previews what the body then builds.
   Fix: in the body, start from what the opening did not give (counters, IPC's blind spot, the pipeline) and refer back to the slot instead of redefining it; state the timeline point once, in the GPU block.

8. Quotes: header "(Arm and Intel metric files, Linux perf v7.3, AWS and NVIDIA documentation, read 2026-11-20)"; "In one run of ours"; "We ran it once on each of three core types"; "The card prints these to one decimal: 12.2%, 36.5%, 45.7% and 5.6%."; "it began in a 2014 Intel paper".
   What is wrong: provenance and housekeeping in the prose and in the header description.
   Fix: drop the header source list; say once that the figures are single runs; cut the decimal sentence and the paper's year.

9. Quote: "Since 19 November 2026, EC2 Detailed Monitoring can publish one-minute GPU metrics with no agent inside the instance. Until you have confirmed that they include SM activity, take that figure from DCGM."
   What is wrong: a news item at the weight of a block, under a "for reference" heading, that hands the reader a check the writer could have made.
   Fix: say which metrics the feature publishes, from its documentation, and whether SM activity is among them; or cut the block.

10. Quote: "so a full profile costs run time, and on a Jetson, as in our pass on a DGX Spark, it must run as root."
   What is wrong: a claim about the Jetson supported by a pass on a different machine; the sentence reads as if the Spark run proved the Jetson behaviour.
   Fix: "it must run as root (or with the counter permission granted), as it did in our pass on the Spark", and cite the Jetson requirement separately.

11. Quote: "moves 13.2 points between them, to about 24.5% and about 25.1%".
   What is wrong: 37.6 - 13.2 = 24.4, so the reader redoing the arithmetic gets a different figure.
   Fix: print the unrounded inputs, or write 24.4%.

12. Quote: "When a GPU does the work, the question moves to the GPU readings: tensor activity, memory activity, or the kernel's place on the roofline."
   What is wrong: a one-sentence paragraph inside the CPU card's conclusion that repeats the GPU block.
   Fix: cut it.

13. Quote (title): "Reading a Machine: The Counters That Say Which Part Is Full".
   What is wrong: "Reading a Machine" is a label; the subtitle describes the tools rather than the claim the section proves (shares mislead across widths, utilisation counts time, the instance size decides what you can count).
   Fix: a title carrying one of those claims.

---

## Batch answer

Yes. A careful reader would separate these four files by quality alone, into three groups.

Group 1, doc-C and doc-D. Each opens on a claim and works a number by paragraph 2 (600 decisions become 6; 400 slots sorted into 54/6/15/25). Each builds every term before using it: micro-operations, slots and flush in doc-D; the objective's subscript, the bound and the reused symbols in doc-C. Each puts the formula after the intuition and decomposes it, then checks it against a toy or a measurement (the recomputed card and its width check; the toy episode redone for chunks). Both reach the configuration layer: defaults set against papers, metric files set against cookbooks, settings by name. Both carry the same small faults, provenance in the sentence and some repetition, and doc-C has fewer. doc-C sets the bar.

Group 2, doc-B. Its argument and depth are those of group 1: an opening tool worked to 84%, the wrong-scale error, GiB against GB, the 64% idle inference, the coincidence argument. The editing is not. Definitions and figures are restated within a few lines (vCPU, 24 per GPU, EFA, 16 GB, 149 ms), "our reading" and "single runs" recur in the prose, the shape table contradicts itself on interruptibility and leaves one purchase option blank, and a 15 x 11 grid with six tag types does work the prose should do. The gap is editing, not thinking, and a careful reader would still see it.

Group 3, doc-A. Its sentences are clean, but it is the thinnest file. The opening premise is wrong: FlashAttention cuts the score-matrix traffic of prefill, not the KV reads that dominate decode. The headline 300x mixes FP4 with attention design. Query and attention arrive after keys and values have been used. The FlashAttention mechanism omits the running softmax. PagedAttention gets a "near zero" where a figure was available. The second half drifts into per-model facts and generation lists and ends on two pointers. It has no formula decomposition beyond the first block and no failure modes.

What separates the groups: whether each block turns its facts into a decision with a worked number (1 and 2 do, 3 mostly does not), and whether the page reads as edited once through (1 does, 2 does not).


## Key (appended by the orchestrator after the review)

doc-A silicon dive KV cache and FlashAttention; doc-B this dive section 20 (r2); doc-C this dive section 4 (published pilot, bar); doc-D this dive section 21 (r2)
