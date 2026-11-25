# Adversarial review, batch w4r1b (inX): doc-A, doc-B, doc-C, doc-D

Scores 1 to 10. Calibration as the brief gives it: 10 the best technical writing I know, 8 publishable beside the best files here, 6 competent and flat, 4 a draft.

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A | 8 | 7 | 7 | 7 | 8 | not distinguishable by quality from the best files |
| doc-B | 7 | 6 | 6 | 6 | 6 | distinguishable: weaker |
| doc-C | 7 | 9 | 6 | 7 | 7 | distinguishable: weaker (narrowly) |
| doc-D | 8 | 8 | 9 | 8 | 9 | sets the bar |

Reviewer's own arithmetic is marked where it carries a finding. Anything I state from memory rather than from the page is marked [SPECULATIVE].

---

## doc-A: "23. Price-Performance and Latency: One Unit of Work per Workload"

- **Argument 8.** The first sentence is a decision rule and paragraph 2 works it on a measured number. Every subsection gives the reader a tool (a unit, a like-for-like test, two formulas, a percentile). Two faults hold it at 8: the opening test is set on a one-core ratio against whole-machine price and watts, and the test is never closed.
- **Depth 7.** The percentile section reaches level 400 (0.99^60 = 0.55, misses per minute, the "half the chunk" rule). So do the Spot and whole-instance corrections and the AV1/P5 and RT-core cases. The price half has no real price. The joule half bounds one machine of two. The memory-bandwidth conclusion is proven for the Jetson only.
- **Clarity 7.** Most terms are built at first use: kernel, Region, Spot, TensorRT, EGL, p50/p99. tegrastats and the VDD_IN rail are not. The opening sentence carries four clauses and two "ratios" before the reader has a number.
- **Sentences 7.** Most sentences carry a consequence. A handful overclaim ("never stops", "no setting repairs"), one contradicts itself, and the placeholder wording talks about the build.
- **Parity 8.** It belongs with the strongest file here. It is a notch more compressed than doc-D, but it is the same kind of writing.

### Findings, most damaging first

1. **The opening test sets a one-core ratio against whole-machine price and watts.**
   Quote: "The Spark core does 1,968 / 390 = 5.0 times the work per second, so it wins per joule only if it draws less than 5.0 times the Jetson's watts, and per unit of price only if it costs less than 5.0 times as much."
   What is wrong: the numerator is one core of each machine. Price and watts belong to the whole machine, and the section itself later insists on "the price of the whole instance" and on "the whole board's watts" ("one core of six was busy and the GPU idle"). The two machines have different core counts and a GPU each, so the one-core 5.0 is the wrong figure to hold against either ratio. doc-C in this batch states the general point: "the ratio of single cores does not predict the ratio of whole machines".
   Fix: call the 5.0 the per-core speed ratio and say the price and watts test needs each machine's rate with all of its cores (or the part the job uses) loaded. Or keep the sentence and mark it as an illustration of the test, not an application of it.

2. **The headline ratio never goes through the section's own like-for-like test, and it would fail the software check.**
   Quotes: "Set two rates side by side ... only when unit, model and software release all match; one of our ratios passes and one fails" and, in the chart caption, "the NumPy version of the policy stand-in is not recorded in our report."
   What is wrong: the test is applied to the physics pair and never to the policy pair, which carries the opening. By the section's own rule, a ratio without a recorded software release cannot be shown to compare. So the number the first three paragraphs rest on is the one the section cannot certify.
   Fix: put the 5.0 through the three checks in "Same unit, same model, same software" and say plainly that the software check is open. Or lead the opening with the Spark-internal physics ratio, 2.0, which passes.

3. **"The 5.0 is a ratio of memory traffic" is true by construction and proves only half of what follows.**
   Quotes: "The 5.0 is a ratio of memory traffic." / "The X925 core pulls 49.5 GB/s through the same weights. Memory bandwidth is the part to weigh price and watts against for this program".
   What is wrong: every inference reads the same 25.2 MB, so any ratio of rates is a ratio of traffic. The sentence says nothing about what limits either machine. The paragraph shows the Jetson core near its ceiling (9.8 of 11.71 GB/s, 62.3% stalled) but gives the X925 no ceiling at all, so the conclusion is proven for one machine of two. doc-C reads the same figures the other way for the Spark: "memory bounds the Jetson's side of the division and not the X925's."
   Fix: "On the Jetson the stand-in asks 9.8 of the 11.71 GB/s one core can stream, and 62.3% of its cycles wait on memory: memory sets its rate. The X925 pulls 49.5 GB/s, past the 44.38 GB/s its own triad reached, so memory does not hold the Spark core back the same way." Then scope "the part to weigh price and watts against" to the Jetson side.

4. **The question the opening poses is never answered, even as a bound.**
   The first paragraph asks whether the faster machine is the better buy per unit of price and per joule. No price appears for either machine, which is acceptable because the placeholder covers it. But the joule section bounds only the Jetson ("at least 390 / 25 = 15.6 inferences per joule"), and it gives no published power figure for the Spark. The reader ends with the first paragraph's question still open on both axes.
   Fix: either close the joule half with the Spark's published power figure as a bound, or say in the opening, in one clause, that the section gives the test and the placeholders will supply the verdict.

5. **The third placeholder bundles two measurements and sits two subsections away from the first.**
   Quote: "What will land here: Power under load, in watts, for each workload on the Jetson and the Spark, which turns the rates in the chart into units per joule; and p50 and p99 latency per policy call on the device, next to the control period."
   What is wrong: power under load belongs to "Per joule", where the vendor-range floor stands in for it. The placeholder sits after "Per deadline", so the reader who wants the watts never meets the promise where the watts are discussed.
   Fix: split it in two. Put the power placeholder at the end of "Per joule" and the latency placeholder at the end of "Per deadline".

6. **Placeholder wording talks about how the page was produced.**
   Quotes: "No price was collected for this build." / "A dated price pass in a second round of this dive. This build ships without prices." / "No EC2 instance has been measured for this dive."
   What is wrong: "this build", "a second round of this dive" and "for this dive" are page history. The reader needs what will land and where it comes from.
   Fix: "Where it will come from: AWS's published price for each instance type, Region and purchase option, read on a stated date; not yet collected." And: "No EC2 instance has been measured yet."

7. **The rule for choosing an instance is first shown on something that is not an instance.**
   Quote: "For the policy stand-in that part is memory bandwidth, 9.8 of the 11.71 GB/s one Jetson core can stream."
   What is wrong: the rule is about which rented instance to price a job on. The example is a Jetson core, which nobody rents, and no instance built around memory bandwidth is named. The AV1/P5 paragraph that follows is the real demonstration.
   Fix: cut the sentence and let "The arm's recordings show the rule deciding a real choice" open the demonstration. Or name the instance family the stand-in would be priced on, and why.

8. **One sentence contradicts itself.**
   Quote: "They load a core the way the arm's workloads do without being them: the physics model is a humanoid where the arm is an SO-101, and the policy runs on a CPU where real policies run convolutions and attention on a GPU."
   What is wrong: the second half says the policy stand-in does not load a core the way the real policy does, because the real one runs on a GPU.
   Fix: "Each loads the same part of a core as the work it replaces: the physics step the core's arithmetic and branches, the policy stand-in the memory. None of them is that work: ..."

9. **Two overclaims in the deadline subsection.**
   Quotes: "With asynchronous calls the arm keeps playing while the next call runs, so it never stops to wait." / "If it outlasts what is left of the chunk, the arm runs out of actions, and no setting repairs a call that is too long."
   What is wrong: "never" contradicts the run-out case two paragraphs later. Chunk length is a setting, and a longer chunk widens the room a call has.
   Fix: "so it need not stop while the call runs" and "the arm runs out of actions and stops until the call returns; only a faster call or a longer chunk widens the room."

10. **Tools are named but never built.**
    Quotes: "about 4.8 W for the whole Jetson board from tegrastats" / "on a Jetson the VDD_IN rail in tegrastats covers the whole board".
    What is wrong: a level 100 to 200 reader knows neither tegrastats nor what a power rail is. The second quote is the section's most practical line on power, and it rests on both terms.
    Fix: at first use, "tegrastats, the Jetson's built-in monitor that prints the power drawn on each supply line (rail) of the board; VDD_IN is the rail that feeds the whole board".

11. **A subsection description sentence that does not parse.**
    Quote: "Work out how much room a chunk leaves a call, and pick the latency percentile from the misses the arm can afford; a 60-call median more often than not holds no call from that tail".
    What is wrong: "that tail" has no antecedent in the description. A median holds no calls; the sample of 60 does.
    Fix: "...; a median of 60 timed calls usually contains no call from the slowest one percent".

12. **"Single run" bookkeeping is repeated.**
    Quotes: header "(our measurements are single runs on two edge machines; vendor documentation read 2026-11-20)"; "each a single run"; "Each figure is a single run on one core of each core type"; caption "Every bar is a single run of ours".
    What is wrong: provenance belongs in the citation and, for the writer's own data, in one plain clause, once. The header description should state the payoff and stop.
    Fix: keep "Each figure is a single run on one core of each core type" in the stand-ins paragraph and drop the other three.

13. **One sentence and the next disagree.**
    Quote: "Neither the mean nor the median sees a rare slow call. As an illustration, if ninety-nine calls in a hundred take the typical time and one takes ten times as long, the mean rises by 9%".
    What is wrong: by the next sentence the mean does register the slow call, diluted.
    Fix: "Neither the mean nor the median shows a rare slow call for what it is."

14. **A rounding slip.**
    Quote: "A worst call up to about 20 / 4.5 = 4.4 times that median still fits."
    What is wrong: 20 periods is 666.7 ms, and 666.7 / 149.0 = 4.47. The 4.4 comes from dividing by the already-rounded 4.5. (Reviewer's arithmetic.)
    Fix: "666.7 / 149.0 = 4.5 times".

15. **The writer's sourcing vocabulary appears in reader prose.**
    Quote: "That price is a dated first-party figure for one Region".
    What is wrong: "first-party" is the writer's source-tier vocabulary, not something the reader needs.
    Fix: "That price is AWS's published figure on a given date, for one Region..."

---

## doc-B: "23. Cost per Improvement"

- **Argument 7.** The opening is a clean claim (two places to buy an improvement; the volume served decides) and a number by paragraph 2. But the headline number comes from a cross-model pair the section disowns three times, the one same-model pair it holds goes unpriced, and the title's "per improvement" is never measured.
- **Depth 6.** The breakeven formula is basic. The idle-GPU point ("a cost per query measured at full load is a floor") and the 69 days of continuous load are real level-400 moves. The training-cost subsection lists quantities without saying what drives them, and the section misses the two results its own numbers contain (finding 2 and finding 10).
- **Clarity 6.** ReTool, verl, LoRA, ACE and on-policy distillation are used without being built. GRPO is glossed after three of its variants have already appeared. The "four numbers" the heading promises are never listed.
- **Sentences 6.** About eight bookkeeping clauses ("by our arithmetic", "(our arithmetic)", "that record is the verl team's run, not the DAPO authors'", "on the pricing page"), the thesis labelled "Our reading of these figures:", prose that operates the calculator, and one sentence repeated almost word for word.
- **Parity 6.** A careful reader would put it below the other three: its middle reads as a catalogue with provenance tags.

### Findings, most damaging first

1. **The section is titled "Cost per Improvement" and never measures an improvement.**
   Quotes: "Learning cost about $18 of API tokens and lifted the frozen 671B DeepSeek-V3.1-Terminus to 82.7 on AIME 2024" / "Replicating ReTool's RL training on Qwen2.5-32B-Instruct, which reached 67.0" / calculator: "The per-query option also scores 15.7 points higher."
   What is wrong: "lifted ... to 82.7" gives no starting point, and neither does 67.0. The 15.7 points are 82.7 minus 67.0, mostly the gap between a 671B and a 32B base model, so the one quality figure is not the improvement either method bought. The dollars therefore have nothing to be divided by.
   Fix: give each base model's score before its improvement, as the paper reports it, and compute dollars per point gained for each side. The cross-model caveat then qualifies a real number.

2. **The breakeven depends on the assumed GPU-hour rate more than on the methods, and the section quotes the rate that erases it.**
   Quotes: "DeepSeek-R1's post-training took 147K H800 GPU-hours, which its authors price at $294K under an assumed $2 per GPU-hour" / "about $10,000 at the authors' assumed $0.5 per GPU-hour. At serving, the RL model on four GPUs at the same rate handles about 400 problems an hour, $0.005 per problem".
   What is wrong (reviewer's arithmetic): at $2 per GPU-hour the RL side serves at 4 x $2 / 400 = $0.02 per problem, the same as the text loop's $0.02, so the two lines never cross and the text loop is cheaper at every volume. At $1 the breakeven is (20,000 - 18) / (0.02 - 0.01) = about 2.0 million problems. The 665,467 is mostly a property of the $0.5 assumption. That is the most useful thing this section could tell a reader about reusing the published breakeven, and it is missing.
   Fix: add one paragraph to "One priced pair, across two models" that works the $2 case, using the rate the section already cites, and say that the breakeven runs to infinity as the RL serving cost per problem approaches the text loop's.

3. **The same-model pair goes unpriced while the cross-model pair, which the section disowns, carries the headline and the calculator default.**
   Quotes: "The calculator's one same-model pair of training budgets is GEPA (Genetic-Pareto) ... against GRPO with LoRA (Low-Rank Adaptation) on Qwen3 8B." / "The calculator opens on the Training-Free GRPO pair above, a cross-model example." / ending: "To redo the paper's comparison on one base model, keep a weight update in the first column and put a text loop ... on the same model in the second".
   What is wrong: the section says the reader needs a same-model comparison, has one (1,839 to 7,051 rollouts against 24,000), and never turns it into dollars or a breakeven. It ends by asking the reader to do what it did not do.
   Fix: price GEPA against GRPO at a stated tokens-per-rollout, labelled as an illustration, and open the calculator on that pair. Or say in one sentence which figure is missing to price it.

4. **"Model size alone does not set the bill", followed by a catalogue that never says what does.**
   Quote: "The published runs collected here range from a few hundred GPU-hours to well over a hundred thousand, and model size alone does not set the bill." The subsection then lists Dr. GRPO, ProRL, DeepSeek-R1, DeepSWE, verl's DAPO run, GEPA, Qwen3 distillation and Bedrock RFT, each with its figure.
   What is wrong: this is the reference-manual shape. Facts sit at equal weight, and the claim that would let the reader estimate a run they have not seen (steps x rollouts per step x tokens per rollout, and the GPU generation) never appears. ProRL's "more than 2,000 steps" is the one cost driver mentioned, and it is not drawn out.
   Fix: open with the drivers, prove each with one or two runs (ProRL's step count against the 7B recipe; DAPO's dynamic sampling, see finding 15), and demote the rest into the expandable.

5. **Bookkeeping clauses recur throughout.**
   Quotes: "our arithmetic from the paper's figures"; "216 GPU-hours by our arithmetic"; "on a newer GPU (our arithmetic)"; "about 20,400 GPU-hours by our arithmetic; that record is the verl team's run, not the DAPO authors'"; "2.8 and 4.9 times by our arithmetic"; "about 665,000 served problems (our arithmetic)"; "about 69 days of continuous load (our arithmetic)"; "The inputs are the paper's; the breakeven and the server time are ours."; "gpt-oss-20b and Qwen3 32B on the pricing page, Nova 2 Lite in the AWS Price List".
   What is wrong: this is exactly the owner's fault 5. Provenance belongs in the citation, and the writer's own derivation in one plain clause, once.
   Fix: one clause early ("conversions to GPU-hours and the breakeven are derived from the cited inputs"), then strip every other tag. Write "charges $80.00 per training hour for each of its three base models (gpt-oss-20b, Qwen3 32B, Nova 2 Lite)" and let the three citations say where each price was found.

6. **The thesis is buried mid-section, labelled, and ambiguous.**
   Quote: "Our reading of these figures: a text loop is cheap to train, and it pays at serving mostly when it rides on a larger model than the RL alternative."
   What is wrong: this is the section's sharpest claim, and it arrives at the end of the third subsection behind a bookkeeping label. "Pays at serving" can mean "costs" or "is worth it".
   Fix: move it to the opening as a plain claim: "In the published comparison most of the text loop's serving premium is the larger model it runs on; on one model the premium is the extra tokens, and caching cuts most of the input side."

7. **"The third option" contradicts the two-option frame, and the sampler is never explained.**
   Quote: "The third option trains nothing. Section 10, What RL Does to a Model, covers a training-free sampler that sharpens a frozen model's answers at about 8.84 times the tokens of standard inference".
   What is wrong: the opening grouped the sampler with the text loop as the pay-per-query side, so there is no third option. "Sharpens" is not explained, the method is not named, and the sentence's subject is another section.
   Fix: "On the pay-per-query line, the cheapest entry to train is a sampler that trains nothing: [name], which [one clause of mechanism], spends about 8.84 times the tokens of plain inference on MATH-500 (section 10)."

8. **Terms are used without being built, and GRPO's gloss comes late.**
   Quotes: "Replicating ReTool's RL training"; "verl's public reproduction"; "GRPO with LoRA (Low-Rank Adaptation)"; "ACE's (Agentic Context Engineering) input tokens"; "on-policy distillation of an 8B model"; and, in the GEPA paragraph, "GRPO is the RL method that samples a group of answers per prompt and reinforces those that beat the group's average."
   What is wrong: an expansion is a name, not an explanation (ReTool and verl get neither). GRPO is glossed only after Training-Free GRPO, Dr. GRPO and DAPO have each been introduced in terms of it.
   Fix: move the GRPO gloss to its first use in paragraph 2, and give one clause to each of the others: ReTool, an RL recipe that trains a model to call a code interpreter; verl, an open-source RL training library; LoRA, training small added matrices in place of the full weights; ACE, a loop that writes and revises a playbook in the prompt.

9. **"The four numbers" are promised and never named.**
   Quotes: heading description "Know the four numbers the decision turns on, and which of them only you can supply" / "Three of the four inputs are yours alone."
   What is wrong: the formula above has four cost terms plus a volume, and the paragraph below mentions quantities, rates, volume and quality gap. The reader cannot tell which four are meant.
   Fix: "The decision turns on four numbers: training cost, cost per query, the queries served over the artifact's life, and the quality gap. Only the first comes from published runs, and only as a quantity."

10. **The caching figures are not worked, and the hosted-model analogy blurs the mechanism.**
    Quotes: "91.8% of ACE's (Agentic Context Engineering) input tokens came from cache at the evaluation stage, cutting billed input cost by 82.6% against counting raw context tokens" / "For a model you host the same saving comes from prefix caching".
    What is wrong: the reader is not told why caching cuts the bill (cached input is billed at a discount). The two numbers show the size of that discount: 82.6 / 91.8 = 0.90, so cached tokens cost about a tenth of full input (reviewer's arithmetic). "Against counting raw context tokens" is unclear. On a hosted model the saving is skipped prefill compute, which raises queries per server-hour; it is not "the same saving".
    Fix: "...cutting billed input cost by 82.6%: 82.6 / 91.8 = 0.90 of each cached token's price was saved, so a cached token cost about a tenth of a fresh one. On a model you host, prefix caching skips recomputing the playbook, so each server-hour serves more queries."

11. **One run is left in raw units, and one sentence has no clear antecedent.**
    Quotes: "Two 32B runs sit between them." / "DeepSWE's RL run on Qwen3-32B took 64 H100s for six days".
    What is wrong: every other run is converted to GPU-hours, but this one is not (64 x 144 = 9,216 GPU-hours, reviewer's arithmetic). "Between them" points back past an expandable heading.
    Fix: "Two 32B runs sit between the 7B recipe's 216 GPU-hours and R1's 147K: DeepSWE's ... about 9,200 GPU-hours".

12. **The managed price is never set against the runs.**
    Quote: "Bedrock RFT (reinforcement fine-tuning) charges $80.00 per training hour ... The hours are the unknown."
    What is wrong: the reader cannot place $80 an hour beside GPU-hours.
    Fix: one clause: "the paper's $10,000 RL bill buys 125 such hours".

13. **Prose operates the calculator.**
    Quotes: "The calculator at the end of this section redoes it with your rates, your volume and the quality gap you measure." / "The calculator takes your hours as an input." / "so the calculator takes it as an editable input on the per-query side." / "Choose "Your own numbers" in a column to clear it. A preset fills only the values its source reports, each with its citation under the field, and any field you edit becomes yours."
    What is wrong: this is prose talking about the page (the owner's fault 4). Widget instructions belong in the widget.
    Fix: cut the three trailing "the calculator takes..." sentences, and move the preset and clearing instructions into the calculator's own help text.

14. **A pointer with no content, and a repeated sentence.**
    Quotes: "Section 16, Memories, Playbooks & Skill Libraries, compares the two methods on 32B-class models." / "At its prices the text loop stays cheaper until about 665,000 served problems" (opening) and "At those prices the text loop stays cheaper until about 665,000 served problems (our arithmetic)." / "The Training-Free GRPO paper prices both sides." after "prices both sides of one such choice."
    What is wrong: the pointer withholds the result it points at. Repeating the strongest number is right; repeating the sentence that carries it is not.
    Fix: state what section 16 found in one clause, or cut the pointer. In "One priced pair", restate the number in a new sentence that adds the condition ("665,467 problems, about 69 days of a fully busy server").

15. **Definitions carry mechanism that does not bear on cost and leave out the part that does.**
    Quotes: "Dr. GRPO (GRPO Done Right), the GRPO variant of section 9 that drops the division by each answer's length and by the group's standard deviation" / "DAPO ... raises the upper clip bound, keeps only prompts whose group of answers is neither all right nor all wrong, and averages the loss over every token in the batch."
    What is wrong: in a cost section, the one property that changes the bill is DAPO's filtering. It discards whole groups, so it generates more rollouts per prompt that it keeps. That is not drawn out, and the rest is training detail the section does not use.
    Fix: "DAPO, a GRPO variant that throws away any group whose answers are all right or all wrong, so it samples more rollouts for every prompt it trains on". Leave the rest to section 9.

---

## doc-C: "22. Our Measurements: Three Stand-Ins on Two Edge Machines"

- **Argument 7.** The header and paragraph 1 make a real claim with three numbers, the subsection headings are mostly claims, and the ending hands over a method. But the method the section teaches fails on its own cleanest pair without comment, and one rule is stated and then broken a paragraph later.
- **Depth 9.** The deepest file in the batch: top-down slots, the flush-recovery bias in the generic formula, the slot-width self check, IPC and clock decomposition, the per-core versus whole-machine bandwidth gap, and the Nsight "highest counter" caveat.
- **Clarity 6.** The load on the level 100 to 200 reader is heavy. "Arithmetic" is used as a headline ratio for half the section before it is defined. Speculation is not built, and three paragraphs of method (two passes, two builds, eight detail events, 14 microbenchmarks) sit at the same weight as the findings.
- **Sentences 7.** Precise and consequential at their best ("take the method and leave the ranking"). Lab-notebook clauses ("That is how the A78AE's 6 was found", "which we read as", "the figures here are from the second pass") and a few flat lines ("That is one ratio of several.") pull it down.
- **Parity 7.** Its sentences are of the same standard as doc-A and doc-D. A careful reader would still feel it as heavier and more of a lab report: the title and some headings count instead of claiming, four placeholders are stacked after a prose list of the same four, and an expandable audits the writer's own arithmetic.

### Findings, most damaging first

1. **The section's method fails on its own cleanest pair, and the section does not notice.**
   Quotes: header "learn to read a workload's gap from the part it fills, and carry the method to your own job" / "For one scene of CPU physics, then, buy speed per core and not memory bandwidth: on the Spark the X925 stepped 57,240 / 28,662 = 2.0 times as fast as the A725 from the same memory."
   What is wrong: the physics step is core-limited on all three cores, so the method sends the reader to the core's ratio, and the only core figure in the table is arithmetic. On it the X925 is 22.242 / 5.595 = 4.0 times the A725 and 6.5 times the A78AE (reviewer's arithmetic for the first). Physics shows 2.0 and 3.9. The pair that passes every one of the section's tests comes in at half the "arithmetic" gap. The section explains the 2.0 from instructions per cycle and clock, but never says that its headline arithmetic ratio does not predict the one workload limited by the core. A reader who carries the method to a core-bound job of their own will predict wrong.
   Fix: say that the multiply-add loop measures the core's peak for independent scalar multiply-adds, which a branchy physics step never approaches. For a core-limited program, the predictor is its own instructions per cycle times clock, read from its card. Either drop 6.5 from the header or tie it to a program that follows it.

2. **"Arithmetic" is a headline number before it is a defined quantity.**
   Quotes: header "6.5 times apart on arithmetic"; paragraph 1 "the gap is 6.5 times on arithmetic"; defined only in the fourth subsection, "Arithmetic is the rate of fused multiply-adds ... the chains are scalar, so the figure leaves out the vector units".
   What is wrong: the reader carries an undefined number through three subsections. The definition, once it arrives, narrows the number sharply (scalar only, no NEON or SVE), and that matters for every workload the reader might map onto it.
   Fix: at first use, "6.5 times on scalar multiply-add arithmetic", with the vector-unit exclusion in the same clause.

3. **A rule is stated as general and broken a paragraph later.**
   Quote: "For a dense model run on a CPU core, compare machines by the GB/s one core can stream; more arithmetic would buy nothing."
   What is wrong: the next paragraph has the X925 drawing 49.5 GB/s, past its own 44.38 GB/s triad. The A725 and X925 have near-equal triad figures (43.95 and 44.38), yet the X925 runs the policy 1.4 times faster, a ratio the section later matches to the two cores' clocks. On the Spark the stated rule predicts a tie and gets 1.4.
   Fix: scope the rule: "Where a core's demand sits near its triad figure and most of its cycles wait on memory, as on the Jetson, compare machines by the GB/s one core can stream. On the Spark neither holds, and the X925's 1.4 over the A725 follows its clock."

4. **The explanation for the X925 exceeding its own triad misses the likely mechanism.** [SPECULATIVE, reviewer's reasoning]
   Quote: "The X925's figure also shows that a measured rate is a lower bound on what a core can draw: one triad run understates it".
   What is wrong: the policy's weight stream is read-only. Triad mixes two reads with a write, and STREAM-style reporting usually does not count the extra read a write causes in a write-back cache, so on the same core a read-only stream can show more counted GB/s than triad. Run-to-run noise is offered instead, and it is the weaker explanation for an 11% excess.
   Fix: say that the stand-in only reads and the triad reads and writes, and name the read-only microbenchmark that would settle it. The section's own memory-read loop was front-end bound, so it cannot.

5. **Four placeholders are stacked at the end, after a prose paragraph that lists the same four.**
   Quotes: "Four additions turn these cards into a sizing tool. The arm's real workloads replace the stand-ins ... Repeats give every figure a spread ..." followed by four consecutive blocks, each ending "not yet run".
   What is wrong: the reader meets the owed work twice and then a wall of placeholders before the ending. Each placeholder is cut off from the block it extends. Wording slips: "today's cards" is time-relative, and "the Jetson Orin Nano" names a different board from the "Jetson Orin Nano Super" used everywhere else.
   Fix: move each placeholder beside its block. The GPU-counters one goes under "One GPU kernel per machine". The repeats and flush-correction one goes under "A split you can trust" (or after the flush paragraph). The real-workloads one goes after the stand-ins table, and the EC2 one after "Every ratio here is one core against one core". Cut the "Four additions" paragraph down to the Graviton PMU-support facts, the only practical content it adds. Write "the Jetson Orin Nano Super" and "the current cards".

6. **The triad is trusted as the memory ruler after its own counters disowned it, with no reason given.**
   Quotes: "9.8 GB/s, 84% of the 11.71 GB/s the same core streams on the triad" / "at 11.71 GB/s with 78.1% front-end bound, 7.9% back-end bound and 2.6% of cycles stalled on memory in pass 2, which is not what a loop limited by memory looks like ... take those loops' throughput and leave their split".
   What is wrong: the Jetson's memory-limit verdict uses the triad as the ceiling. The pass that produced the 11.71 reads the triad as front-end bound, which is a loop held back by its own instructions. That is the same failure the section names for the memory-read loop. The instruction to keep the throughput and drop the split needs its reason.
   Fix: one sentence: "Two builds with opposite splits ran at the same 11.7 GB/s, so the rate is set outside the core's split, by memory. The policy's memory verdict also stands on its own 62.3% memory stall, not on the triad alone."

7. **Process bookkeeping and self-audit sit in the reader's path.**
   Quotes: "The whole set ran in two passes from two builds of the benchmark; the figures here are from the second pass, one execution each." / "That is how the A78AE's 6 was found, at exactly 6.000 on three programs, since neither its kernel nor Arm's telemetry files give a figure for that core." / "The Spark's kernel is a simt kernel, which we read as the GPU's general path" / expandable "Two checks that confirm the arithmetic rather than the split" with "Recomputed from the raw counter files, every share on the cards matches."
   What is wrong: this is the owner's fault 5. The width self-check is a practical method phrased as the writer's history. The recomputation is the writer checking their own work, which gives the reader no model and nothing to do.
   Fix: "Where no document gives a core's width, compute it: stall_slot plus op_spec over cpu_cycles. On the A78AE it comes to 6.000 on three programs." Drop "which we read as", since the kernel name says simt. Retitle the expandable "Compute a share from raw counts", keep the worked 36.54%, and drop the self-audit sentence and the "add to 100% by construction" point, or keep only the warning that summing to 100% proves nothing.

8. **Speculation is not built for the reader.**
   Quote: "Retiring is the share that did work the program kept, and bad speculation the share thrown away after a wrong guess."
   What is wrong: a level 100 to 200 reader does not know that a core runs ahead on a guess. "A wrong guess" of what?
   Fix: "A core does not wait to learn which way a branch goes: it guesses and starts the instructions beyond it. Bad speculation is the share of slots spent on guesses that turned out wrong and were thrown away."

9. **The title and one heading count instead of claiming.**
   Quotes: "22. Our Measurements: Three Stand-Ins on Two Edge Machines" / "Three stand-ins, three parts of the machine".
   What is wrong: this is the "One Robot, One Loop" family. The title names the writer's activity and two counts, and "stand-ins" is jargon until paragraph 3. The header description has the thesis; the title does not.
   Fix: a title that states the payoff, for example "Which Part Runs Out First: Reading One Core's Counters on a Jetson and a DGX Spark". For the heading, "Each stand-in loads one part of the machine".

10. **The GPU subsection stops one step short of its own lesson.**
    Quotes: "but the Jetson's SM clock was 306 MHz during its profile against the Spark's 2.13 GHz, and on a Jetson the GPU clock moves with load. Record the clock with every GPU profile on a Jetson, or pin it" / "The Spark's kernel is a simt kernel ... so this float32 run leaves the tensor cores unmeasured."
    What is wrong: the clock point has no size attached. [SPECULATIVE: if the Orin Nano Super's GPU has 1,024 CUDA cores with a top clock near 1 GHz, its FP32 peak at 306 MHz is about 1,024 x 2 x 0.306 = 627 billion operations a second, so the measured 406 is about 65% of the peak at the clock it ran, and the run was at roughly a third of top clock.] "Pin it" is not shown. The Jetson's kernel, ampere_sgemm, is by its name also an FP32 SIMT kernel, so the tensor cores went unmeasured on both machines, not only the Spark.
    Fix: give the vendor's top GPU clock and the scaled duration, name the command that pins Jetson clocks, and write "both kernels are FP32 SIMT kernels, so the tensor cores went unmeasured on both machines".

11. **A decomposition is promised and abandoned.**
    Quotes: "Its 3.9 also shows how to take a ratio apart." / "so the other 3.9 / 1.76 = 2.2 is clock rate and instructions per step together. The cycles were counted over the whole program, start-up included, while the rate was timed over the loop alone, so the cycle counts do not give the clock."
    What is wrong: the take-apart ends in two unknowns, so the sentence overpromises.
    Fix: split the 2.2 with the vendors' published maximum clocks, labelled nominal. Or say "shows how far counters alone take a ratio apart".

12. **Flat or loose sentences.**
    Quotes: "That is one ratio of several." / description "Read each program's counters on three cores, see which part limits it, and take what that changes in the machine you pick" / header "the part it fills" against the body's "uses up first" and "runs out of".
    What is wrong: the first is filler, the second does not parse cleanly, and the third switches the verb for the section's central idea.
    Fix: cut the first. Write "...and what that limit means for the machine you pick". Use "runs out of first" throughout.

13. **A measured share is left without a consequence.**
    Quote: "the A78AE loses 31.0% to the front end."
    What is wrong: a reader buying a machine cannot use the figure. It sits beside the X925 observation, which does get a meaning ("points at its execution units").
    Fix: one clause on what front-end bound means for this core (instruction supply runs short, which neither more memory bandwidth nor a wider back end would fix), or cut it.

14. **Captions repeat the stand-in caveat instead of saying something new.**
    Quotes: "The humanoid stands in for the arm." / "Six dense layers on the CPU stand in for a policy."
    What is wrong: the table and the body have already said it twice. Caption space is better spent on the consequence of the card.
    Fix: cut both sentences. The camera-render caption ("a large back-end share here can be time spent waiting on the GPU") shows the right use.

---

## doc-D: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

- **Argument 8.** Paragraph 1 states a thesis the reader can use ("Lateness on a robot is a distance") and works a number in it. Every subsection ends in a consequence or an action. Held at 8 because the budget the section builds treats all travel during a delay as error, which collides with the chunked policies it describes two subsections later.
- **Depth 8.** It reaches the register table, the PD gains and their steady-state consequence, the timestamp-from-index flaw that corrupts recordings, the busy-wait on macOS and Windows, use_degrees, encoder and backlash at the gripper, and a four-term latency budget with sizes. RTC is given only its asynchronous half.
- **Clarity 9.** It builds every term in reading order (servo, encoder, DoF, observation, action, joint and end-effector space, absolute, relative and delta, PID, tick, chunk), gives intuition before each formula and decomposes after it. A level 100 to 200 reader can follow every step.
- **Sentences 8.** Short, concrete, consequential ("a latency figure for a robot is half a number until a speed stands beside it"). A few bookkeeping parentheses, a "for reference" block and two self-references remain.
- **Parity 9.** The best file in the batch.

### Findings, most damaging first

1. **Travel during a delay is treated as error, and the budget built on that collides with the chunked policies the section describes.**
   Quotes: "Say the block must arrive within 10 mm of the centre of the cup. At 0.25 m/s the budget is 0.010 m / 0.25 m/s = 0.040 s, or 40 ms: barely more than one tick." / "Against the 40 ms budget that is more than three times over, and inference is the largest term." / "What remains is the distance: the arm has travelled for the whole of the delay by the time the first action of a new chunk is played."
   What is wrong: a gripper moving on stale orders is off target only by as much as those orders were wrong. If nothing in the scene changed, an action from a correct plan lands where a prompt one would. The section's own default policies play a 50-action chunk, 1.67 s, without looking again, far beyond 40 ms, and the task gets done that way. A reader told the Thor setup is "more than three times over" budget cannot square that with a policy that works, and the section never squares it.
   Fix: present d = v x tau as a worst case: how far the gripper can go wrong before the arm reacts to something it did not expect, such as a block that slips or a cup that is moved. Call the 40 ms a reaction budget. Add one sentence on why chunked policies succeed with a long delay: for a scene that holds still the plan stays right, and the delay costs only reaction to change. That also supplies the third move missing from "A chain slower than its budget leaves two moves: slow the arm, or shorten the chain." (plan ahead, as chunking does).

2. **One model's chunk length is mixed with another model's call time.**
   Quotes: "A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." / later "NVIDIA's benchmark of one complete call to it, returning 40 actions".
   What is wrong: 50 actions is the SmolVLA and pi0.5 default. GR00T N1.7's benchmarked call returns 40, so the worked example pairs one model's chunk with another's latency.
   Fix: "A 40-action GR00T N1.7 chunk at 30 Hz lasts 1,333 ms, and its 149 ms call on a Jetson Orin uses 4.5 ticks of it." Or keep 50 actions and use a SmolVLA call time.

3. **Bookkeeping of exactly the owner's kind.**
   Quotes: "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." / table header "Unitree G1 with GR00T 2, as NVIDIA reports it" / "Each term has a cited size on this arm." / "By their names and the mounts the hardware repository ships, one rides on the arm and sees what is between the fingers" / "Its newer Helix 2.5, posted 2026-09-17, states none."
   What is wrong: the first is a near-copy of the owner's "Counting them as five is our grouping". The others put provenance, or the writer's inference, into the prose where the citation already carries it.
   Fix: drop "(the split into four is ours)". Write "Unitree G1 with GR00T 2" (the vendor-claim citation grades it). Cut "Each term has a cited size on this arm." Write "One camera rides on the arm and sees what is between the fingers; the other is fixed over the scene." Cut the Helix 2.5 sentence, or fold it into the date clause.

4. **A reference block that lists limits without consequences.**
   Quotes: heading "Servo limits, for reference: gripper caps and firmware cut-outs" / "The datasheet lists four triggers for it: 2 s blocked at more than 80% of stall torque, 2 s drawing more than 2 A, a supply outside 4 V to 7.4 V, and a temperature over 70 degrees C."
   What is wrong: this is the owner's fault 6. Four triggers and three gripper caps sit at equal weight, and the reader is not told what any of them does to a run. "For reference" in the heading concedes the point.
   Fix: say what a trip does to the joint mid-task (from the datasheet), and which policy behaviour trips it: a gripper squeezing a block, or an arm pressing into the table for 2 s, crosses the first trigger. Say what the 50% gripper cap means for what the arm can hold. Otherwise cut the block.

5. **RTC gets only its asynchronous half at first use.**
   Quote: "RTC (real-time chunking), the technique for a model too slow for the tick, computes the following chunk in a background thread on the host while the loop plays the current one."
   What is wrong: this describes asynchronous inference in general. The idea that makes it real-time chunking, a new chunk computed to agree with the actions already committed so the seam does not jerk, is left entirely to section 17. The standard asks for the intuition at first use plus a pointer.
   Fix: add one clause: "...and computes it to agree with the actions the arm will already have played by the time it lands, so the hand-over is smooth (section 17)."

6. **Self-references to the page.**
   Quotes: "(6 + 6) x 4 bytes x 30 exchanges is the 1,440 bytes per second of the opening." / "so the middle line, a tenth of a second at this pace, spends most of that margin."
   What is wrong: "of the opening" and "the middle line" point at the layout of the page instead of the quantity.
   Fix: "...is 1,440 bytes per second." and "so 100 ms of delay at this pace spends most of that margin."

7. **The company name reads as a page element.**
   Quote: "Figure's last published rates, for its Helix 02 humanoid model on 2026-01-27, have the same shape".
   What is wrong: on a page full of figures, "Figure's" reads first as a diagram.
   Fix: "Figure AI, the humanoid maker, last published rates for its Helix 02 model on 2026-01-27: ..."

8. **Detail with no consequence.**
   Quotes: "The code divides by 4095, the encoder resolution minus one, where the datasheet gives the step as 360 / 4096." / caption "The clip runs 8.2 s."
   What is wrong: the 4095 against 4096 difference is 0.02 degrees at 90 degrees, and the reader is not told it is negligible. The clip length tells the reader nothing.
   Fix: "...a difference of 0.02 degrees at 90, too small to matter" or cut it. Cut the clip length.

9. **The timing-report numbers do not add up as printed.**
   Quote: "reading the joints and the cameras takes a mean of 13.65 ms, 74.4% of the loop's work; reading the leader takes 1.80 ms, sending the action 0.90 ms and writing the frame 1.70 ms. The work has a mean of 18.4 ms".
   What is wrong (reviewer's arithmetic): the four parts sum to 18.05 ms, and 13.65 / 18.4 = 74.2%. A reader who adds them up finds a gap and starts to doubt the rest.
   Fix: name the remainder ("and about 0.35 ms of other steps"), or write "about three quarters of the loop's work".

10. **The title is a three-item topic list.**
    Quote: "3. The Robot as a Computer: Inputs, Outputs and a Deadline".
    What is wrong: the header description carries the payoff ("turn any delay into millimetres on the table"), and the title carries only a list of nouns.
    Fix: put the thesis in the title, for example "The Robot as a Computer: Twelve Numbers, Two Cameras and a Delay Measured in Millimetres".

11. **Near-repetition.**
    Quotes: "The policy's computer is sized by the deadline." and, three sentences later, "The policy on the arm is sized by a deadline, where the jobs that train it are sized by throughput."
    Fix: keep the second, which adds the contrast, and open the paragraph with the GR00T N1.7 figures.

12. **The PID terms are explained out of order.**
    Quotes: "The first term is the error now ... The last term is the change in error since the previous pass ... The middle term is the sum of every error so far".
    What is wrong: the reader has to map first, last, middle back onto P, I, D.
    Fix: take them in formula order (P, I, D), and end on I = 0 as the payoff, which the paragraph already does.

---

## Batch answer (step 4)

**Groups by quality alone**

- **Group 1: doc-D (sets the bar) and doc-A.** Both open on a claim the reader can use and work a number in the first two paragraphs. Each subsection hands the reader a tool, and nearly every sentence carries a consequence. doc-D is cleaner: it builds every term in reading order, and its imagery (milliseconds into millimetres) does the arguing. doc-A is more compressed and has a few overclaims and an unclosed opening test, but a careful reader would not put it in a lower class.
- **Group 2: doc-C.** The sentences are of the same standard as group 1 and the material is the deepest in the batch. It still reads as a lab report. The title and one heading count instead of claiming, the method paragraphs sit at the same weight as the findings, and the writer's process shows ("That is how the A78AE's 6 was found", "which we read as", an expandable that audits the writer's own arithmetic). Four placeholders are stacked after a prose list of the same four. The reader at level 100 to 200 carries "arithmetic" and "speculation" undefined.
- **Group 3: doc-B.** The frame is clear, but the middle is a catalogue of runs at equal weight. Bookkeeping clauses recur about eight times ("by our arithmetic", "that record is the verl team's run, not the DAPO authors'", "on the pricing page"). The thesis appears mid-section behind "Our reading of these figures:", and prose operates the calculator. The section also misses the two level-400 results its own numbers contain: at the $2 per GPU-hour rate it quotes, the breakeven disappears, and no improvement is ever measured in a section titled "Cost per Improvement".

**Would a careful reader tell them apart by quality alone?** Yes, for two of the four.
- doc-B is distinguishable within a page or two. The catalogue paragraphs and the repeated provenance tags are visible on first read, independent of topic.
- doc-C is distinguishable from doc-A and doc-D, but narrowly, and not by sentence craft: by density, by lab-notebook residue, and by the shape of its ending.
- doc-A and doc-D are not reliably separable by quality. doc-D reads cleaner, but both are argument-first with worked numbers and consequences.

**Verdicts**
- doc-A: not distinguishable by quality from the best files. Argument-first with a worked number by paragraph 2, consequential throughout. Its faults (a one-core ratio set against whole-machine price, an untested headline ratio, placeholder wording about "this build") are fixable within its shape.
- doc-B: distinguishable: weaker. A catalogue middle, recurring bookkeeping, a buried and labelled thesis, and depth that stops short of what its own figures show.
- doc-C: distinguishable: weaker (narrowly). Same sentence standard and the greatest depth, but heavier for the target reader, process-laden, and its central method fails on its own cleanest pair without comment.
- doc-D: sets the bar. Builds every concept in order, turns each fact into a consequence, and ends on the reader's next action. Its main flaw (travel during a delay counted as error) is an argument fix, not a style one.


## Key (appended by the orchestrator after the review)

doc-A this dive section 23 (r1); doc-B rl dive cost per improvement; doc-C this dive section 22 (r1); doc-D this dive section 3 (published pilot, bar)
