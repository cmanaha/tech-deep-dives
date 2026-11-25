# Blind adversarial review, batch w3r3/inX

| file | argument | depth | clarity | sentences | parity | verdict |
|---|---|---|---|---|---|---|
| doc-A | 8 | 7 | 6 | 6 | 7 | distinguishable: weaker |
| doc-B | 9 | 9 | 7 | 8 | 9 | sets the bar |
| doc-C | 7 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |
| doc-D | 9 | 9 | 8 | 8 | 9 | sets the bar |

## doc-A.txt: "10. What RL Does to a Model"

Scores
- argument 8: the claim (RLVR mostly sharpens; a frozen model can buy part of it back at about 8.84 times the tokens) is on the first screen and the body proves it with question-level counts, a weighed debate and three named exceptions.
- depth 7: strong numbers and mechanism (information argument, entropy budget, contamination evidence), but the closing procedure that should turn them into a decision has no numbers in it, and one ceiling claim is stretched past its derivation.
- clarity 6: pass@k, LoRA, "rank-1", "low-curvature regions" and the "trust check" are used before they are built, and parenthetical stacks make several sentences hard to parse for a newcomer.
- sentences 6: "Our reading" eight times, a self-referential first paragraph, signpost sentences and list-only paragraphs; the individual claims are precise, the scaffolding around them is visible.
- parity 7: argument and evidence match the best files; the sentence texture does not.

Findings, most damaging first

1. Provenance refrain. "Our reading" opens or tags a sentence eight times: "Our reading of these studies: RL sharpens by default, ...", "AIME on a Qwen2.5 base carries the model-family caveat of the trust check below (our reading).", "Our reading: a model that samples nearly the same answer every time ...", "Our reading: the three disagree about sparsity ...", "Our reading of these studies turns the three checks into questions:", "The curve is a menu. Our reading, from the definition of pass@k: ...", "Our reading: the contamination result in the trust check concerns the same model and benchmark ...", "Our reading, which sets the choice: ...". Add "the studies read" (three times), "in the sources located for this research", "the authors scope the finding to current RLVR training", "On their information argument, SFT ... arguably supplies". This is exactly the bookkeeping the owner named: the writer's own derivation should be marked once, in one plain clause; after that the reader hears the hedge, not the argument. Fix: one clause where the synthesis starts ("The synthesis below is ours"), then state each conclusion declaratively.

2. The first paragraph talks about the page. "This section answers the dive's first question: what RL does to a model." and, next paragraph, "The term it turns on is the capability boundary". Later: "The key reads the curves from left to right.", "The Qwen2.5-Math case shows why each of the three checks matters.", and the caption "a schematic of the pattern described in this section". None carries a fact. Fix: cut them; paragraph 1 can end on "What it adds to the model is a separate question, and the answer decides what else could deliver the same gain and at what price."

3. Terms used before they are built, and one block out of order. "A pass@k curve shows which happened." comes a full paragraph before "pass@k is the share of problems where at least one of k sampled answers passes the checker". "AIME on a Qwen2.5 base carries the model-family caveat of the trust check below (our reading)." points two h2s ahead to a caveat the reader has not met, so the sentence cannot be understood where it stands; the trust check qualifies the debate's evidence and belongs before or inside it. The expandable "The study behind the main result checked chains of thought by hand" sits before the main result is stated. "rank-1 LoRA matched full fine-tuning for policy gradient" never says what LoRA or rank is in this file. "RL's updates land in the same low-curvature regions across runs, datasets and recipes" leaves "curvature" undefined. "the words track from section 14" is an internal label the reader has never seen.

4. A ceiling claimed for routes its derivation does not cover. "The studies read tested four routes, and the base model's own pass@k curve sets their ceiling." and "Neither reaches past the base model's own pass@K." The only argument given ("because the selection succeeds exactly when one of the K samples is right") holds for best-of-K selection. The power sampler and the trigger prompt select nothing among K samples and have no K; the sampler reweights the base distribution, so its honest ceiling is what the base can sample at all, not pass@K at a serving budget. Fix: scope the pass@K ceiling to selection and give the sampler its own bound.

5. The comparison table contradicts the prose and itself. Prose: "The studies read tested four routes"; table title: "Three ways to buy sharpening back per query". In the column headed "Where it was shown", the best-of-K row reads "Capped by the base model's pass@K", a ceiling in a provenance column. The trigger-prompt row says "Helped Qwen2.5-Math and Qwen2.5-1.5B", a model the prose never mentions. A reader checking the table against the text finds three mismatches in four rows.

6. The ending tours the dive and leaves the decision vague. "Sample the base model several times per task, grade the samples, and read its pass@k at the K you could afford to serve. If that sits well above its pass@1 and you hold a verifier, selection can buy the gain per query." "Several" and "well above" are where the reader needs numbers: how many samples per task give a usable pass@k estimate, and what gap pays for K samples and K verifier calls on every query. The section has the 8.84 multiplier to work that but does not use it. The last sentence is then pure pointers: "Section 23, Cost per Improvement, prices the per-query route against training, and the words track from section 14, A Text Loop Is RL on the Context, onward takes up ...". Fix: end on one worked break-even, drop the pointer sentence or cut it to one clause.

7. A consequence left for the reader to compute. "their run on MATH with about 10,000 problems and 32 samples each had about 320,000 bits to absorb, against about 3M parameters in a rank-1 LoRA adapter on Llama-3.1-8B". The point (about ten parameters per bit of reward, so even rank 1 is not the bottleneck) is never said. Say it.

8. Mixed evidence under an RL heading. "found 68.5% to 96.0% of parameters unchanged after post-training with seven methods, four of them offline preference methods such as DPO". In a block titled "Does RL change only a few weights?", four of the seven methods are not RL and the RL-only range is not given. "SFT updates were dense, at 6% to 15% sparsity" uses "sparsity" without saying it means the share left unchanged.

9. Facts that carry no consequence. "\"Large k\" also differs between papers: 128 or 1,024 in the central study ..., up to 8,192 in the question-level count ..., and 64 in the tool-use study" lists three numbers and stops; the consequence (the tool-use "win" at k = 64 is measured below the k where crossings appear at 7B elsewhere) is the reason to say it. "Optimiser state was not analysed in any of the papers read." dangles: why the reader should care is never said.

10. Smaller faults.
   - "RL produced real pass@128 gains only when pretraining left headroom on the task" is the only one of the three exceptions with no magnitude, and "real" stands in for it.
   - "the base model solved about 9% more problems than the RL model at k = 128": percent or percentage points?
   - "Our reading of these studies turns the three checks into questions:" is followed by three statements, not questions.
   - "In one small study (Qwen2.5-7B-Instruct trained with GRPO through a LoRA adapter, section 3, on 200 problems, 100 test problems per category, k up to 64)" packs five facts into one parenthesis; "200 problems, 100 test problems per category" does not parse.
   - Header description: "Read an RL gain as a pass@k curve before you trust it, and know what a frozen model can buy back per query, and at what price" uses pass@k and "buy back" before the reader has either, with two chained "and"s.
   - "It uses MCMC (Markov chain Monte Carlo) to resample blocks of tokens": the expansion names the method; the rest of the sentence half-explains it, but what a Markov chain does here is not said.

## doc-B.txt: "17. Running on the Robot: Driving the Arm With a Policy Slower Than Its Clock"

Scores
- argument 9: sentence 1 states the claim ("can answer four or five control periods late and still keep the SO-101 supplied"), paragraph 1 works the number (149.0 / 33.3 = 4.5), and every later h2 extends the same call-against-chunk arithmetic.
- depth 9: named settings with defaults and valid ranges, a code-versus-documentation disagreement resolved for the reader ("The code is what runs, so pass the schedule explicitly"), engine portability by compute capability, a symptom-cause-fix table.
- clarity 7: each term is placed at first use, but the newcomer meets about fifty of them (backbone, action head, denoising steps, inpainting, guidance, ONNX, engine, compute capability, MIG, nucleus, component, recipe, TES ...), and two load-bearing ambiguities (which Orin; whether LeRobot's RTC runs GR00T) are left open.
- sentences 8: specific and consequential throughout; a few bookkeeping clauses, two references to an on-page animation, one redundant sentence.
- parity 9: one of the two strongest files here.

Findings, most damaging first

1. The one runnable artifact gives the policy one camera. "docker run --rm --runtime nvidia --network host \ --device /dev/video0 --device /dev/ttyACM0 \". The section's own benchmark conditions are "two 256x256 camera images", and the arm it budgets has a wrist and a top camera. Copied as printed, the container sees one. The caption says "Our choices: the two --device paths; the line has not been run on a device", which discloses the line is untested but not that it is short a camera. Fix: pass both video devices; enumeration-order names such as /dev/video0 and /dev/ttyACM0 can swap when the leader arm or a second camera is plugged in, so stable paths (by-id or a udev rule) are the safer choice.

2. RTC settings worked for a pairing the section never confirms runs. "LeRobot, though it wraps GR00T N1.7, gives its RTC settings for three other vision-language-action policies of section 5, SmolVLA, pi0 and pi0.5." Yet inference_delay is "passed with every call because it varies at run time: 4 for the Orin median, or 5 if you round its 4.47 ticks up", and execution_horizon is bounded "For a chunk of 40 at the compiled Orin median that is 4 to 36". The trained mode "needs a pi0.5 checkpoint". The reader cannot tell whether LeRobot v0.7.0 runs RTC on GR00T N1.7 at all; only max_guidance_weight is hedged. Fix: one sentence stating whether the pairing is supported; if not, label the worked values as the arithmetic for any policy with GR00T's call time.

3. The anchor number's board is unresolved where it matters. The opening: "Take GR00T N1.7, NVIDIA's robot policy, on a Jetson Orin, a small computer built to ride on a robot." Two h2s later: "NVIDIA's table says \"Jetson Orin\" without naming the module". The ratio then treats it as an AGX Orin: "and NVIDIA's own table gives 1.94 times for its Orin", set beside AGX Orin figures. A reader who owns the Orin Nano the placeholder names will read 149.0 ms as their number for the whole first half of the section. Fix: say in the opening paragraph that the module is unnamed and which row the later ratio assumes.

4. A conflict handed to the reader without a resolution. "NVIDIA timed GR00T N1.7 on its own TensorRT path, which on an Orin needs JetPack 7.2 ..., while LeRobot's Jetson container targets JetPack 6.2" and later "Pick the JetPack release before you flash anything, by the software you will run. ... NVIDIA's GR00T guide no longer supports JetPack 6; LeRobot's Jetson Dockerfile targets JetPack 6.2 and is community-maintained." The setup the section builds (LeRobot's async client driving a TensorRT GR00T engine on a Jetson) needs both, so "by the software you will run" decides nothing. Fix: name the path for this setup (JetPack 7.2 with LeRobot built outside its container, or remote inference with GR00T on its own machine) or say the combination is untested.

5. The knob is shown to matter most, then its direction is left to a hedged quote. "Compiling takes the call's part off every action, the 52 mm between the compiled and the PyTorch call; the refill setting governs the larger part. LeRobot's note on refill_seconds gives the trade: \"Higher usually requests earlier; lower allows more of the plan to execute.\"" The paragraph proves refill sets most of the 250 mm of action age, then does not say: raise refill_seconds to cut action age, and pay in more calls and more discarded actions. One worked alternative would land it (refill 1.0 s asks with 30 actions left, at action 10; with the 5-tick call the last action played is about action 15, 0.5 s and 125 mm).

6. The board-sizing bound switches policy and ignores the advice just given. "pi0.5, the policy of NVIDIA's Thor tutorial, needs about 6 GB or more for its weights alone ... at that size and 102 GB/s it takes at least 6 / 102 = 59 ms". The section's policy is GR00T N1.7, whose weight size is never stated, and 6 GB is the BF16 figure one h2 after the reader was told to compile and quantise (FP8 roughly halves the bound). Fix: give GR00T N1.7's size, or the bound at the precision the reader will deploy.

7. Bookkeeping clauses. "(our mapping of its symbols)"; "The camera and the servo bus can be passed with Docker's --device flag, which no AWS page read shows."; "One is a documented floor and the other a measurement on another board, neither beside a policy on a Jetson."; "the samples give no flags for a DGX Spark". The first two are the owner's named fault; the third is a whole sentence of source-grading where one word ("documented minimum") on the first figure would do.

8. Argument anchored to an on-page widget. "15 ticks, half a second, in the animation's fast case" and "In the animation's fast case the next request goes out with 15 actions left". State the case instead ("with the 0.5 s default and a 5-tick call"); the prose should not depend on the reader having stepped the animation.

9. Redundant sentence. "In this table compiling paid most where the call was longest: on the Orin it saves 208.9 ms, the largest saving in the table." follows "In NVIDIA's table, compiling cut one call from 357.9 ms to 149.0 ms on the Jetson Orin, ...". "In this table" and "the largest saving in the table" restate each other and the preceding sentence.

10. Primer register where the level-400 detail is missing. "Four bits make only 2 x 2 x 2 x 2 = 16 patterns" spells out 2 to the 4th for a reader who writes code; meanwhile "NVFP4 is that FP4 with a scale factor per block of numbers" omits the block size, which is what decides how well the handful of values fits.

11. A result with no metric. "RTC showed \"no degradation\" as the delay was added, while synchronous inference \"degrades linearly\" with it." Degradation of what: success, throughput, task time? The reader cannot carry the result anywhere.

12. Placeholder wording (presence required; placement at the end of the Greengrass h2, after the nucleus choice it would settle, is right). "once both are hooked to AWS IoT" and "our own hook-up of the two machines to AWS IoT" are informal and imprecise (the act is registering each machine as a Greengrass core device), and the second line repeats the first's condition. "Nothing in this block was run on a device." The block holds no results, so the sentence either says nothing or means the docker line and footprint figures above it, which it should name.

13. Smaller faults.
   - "Two things make a call that long usable. ... A third thing shortens the call itself": count-led enumeration in the opening paragraphs.
   - "about 2 to 5 minutes a build": per engine or per set of seven?
   - The Greengrass h2 adds a dozen deployment terms (nucleus, component, recipe, lifecycle, Docker application manager, artifact, TES, X.509, IAM, nucleus lite) to a latency section, and the copied YAML recipe in its expandable adds little beyond the two sentences before it.
   - The only tail-latency example ("inference averaged 5.18 ms and its worst call took 40.00 ms") comes from an unnamed small policy on unnamed hardware; the sentence "leaves room for a worst call about four times longer" is headroom arithmetic, not evidence about GR00T's tail. The text does say to measure; it could say plainly that no tail figure exists for this policy.

## doc-C.txt: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

Scores
- argument 7: the first paragraph hands the reader a tool (delay is distance) and works it (100 ms is 25 mm); but the tool is stated without the condition under which travel on old information becomes a miss, and the section's own later paragraph says the same call is fine, so the headline budget is never reconciled with the rest.
- depth 8: right depth for a foundations section: encoder steps to degrees with the 4095 detail, PID gains as written by the driver and what I = 0 does, backlash versus encoder resolution at the gripper, timestamps derived from frame index, busy-wait cost on macOS and Windows.
- clarity 8: concepts are built in order and the formulas follow intuition-formula-decomposition; a handful of names arrive unplaced (Figure, the real-time chunking paper, SmolVLA, pi0.5, pi0.7), and VLA is defined only in the last h2.
- sentences 8: plain, short and consequential ("The arm is a peripheral.", "a latency figure for a robot is half a number until a speed stands beside it"); one exact instance of the owner's bookkeeping fault and a few self-references.
- parity 8: reads at the level of the best files; its main fault is in the reasoning, not the prose.

Findings, most damaging first

1. The central conversion lacks its condition, and the section contradicts its own budget. "Lateness on a robot is a distance: at an illustrative 0.25 m/s, 100 ms of delay is 25 mm of travel on stale orders, most of the width of a cup's mouth." Then: "Say the block must arrive within 10 mm of the centre of the cup. At 0.25 m/s the budget is 0.010 m / 0.25 m/s = 0.040 s, or 40 ms: barely more than one tick." and "Against the 40 ms budget that is more than three times over". Distance travelled on old information becomes placement error only if what the action aims at changed during the delay: the cup or block moved, or the action is an offset from a pose the arm has since left (the relative form this section itself describes). With absolute joint targets, LeRobot's default, and a still cup, a late target still points at the cup; and at release the gripper is slowing, not cruising at 0.25 m/s. As written, the budget predicts that every policy call in the section misses the cup, yet near the end: "In this example the buffer is not what runs out. What remains is the distance". The reader is left holding "three times over budget" and "fine" with nothing that joins them, and the closing instruction ("Multiply that delay by the speed of your gripper, and hold the millimetres against the width of your cup.") carries the unconditioned version forward. Fix: state in the opening paragraph that the millimetres are the error when the scene or the needed correction changes during the delay, and size the budget against how fast that happens, with cruise speed as the worst case.

2. The worked example mixes a policy with another policy's chunk. "A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." The same section says GR00T's benchmark call returns 40: "NVIDIA's benchmark of one complete call to it, returning 40 actions". Fifty is the SmolVLA and pi0.5 default. Use 40 actions (1.33 s) or a policy that emits 50.

3. The owner's named bookkeeping fault, verbatim in kind. "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." Compare "Counting them as five is our grouping". Others of the family: "Each term has a cited size on this arm."; "and the sources read on 2026-11-20 give a figure for none of them"; "By their names and the mounts the hardware repository ships, one rides on the arm"; "Its newer Helix 2.5, posted 2026-09-17, states none."

4. "Figure's last published rates, for its Helix 02 humanoid model on 2026-01-27, have the same shape". Figure, the company, is never introduced; on a page full of figures the reader parses "Figure's last published rates" as a diagram. The paragraph also adds a third robot to a two-robot comparison and ends on a dated non-result. Either introduce the company in a clause or cut the paragraph.

5. Names used before they are placed. "A local network added 10 to 20 ms in the setup of the real-time chunking paper." comes about thirty lines before RTC is defined. "Take a 50-action chunk, the default length for the SmolVLA and pi0.5 policies in LeRobot." and "The authors of Physical Intelligence's pi0.7 model went the other way" name policies and a company the page never places. GR00T N1.7 is used from paragraph 2, but "GR00T N1.7 is a vision-language-action model (VLA), a policy built on a network that takes camera images and a text instruction" waits for the last h2. "the load figure is the duty cycle of the motor drive" leaves duty cycle unexplained.

6. RTC is defined by a property it shares with plain asynchronous inference. "RTC (real-time chunking), the technique for a model too slow for the tick, computes the following chunk in a background thread on the host while the loop plays the current one." Computing the next chunk in the background is asynchronous inference; what makes real-time chunking a distinct technique (the new chunk is made to continue the motion already under way) is missing, so the reader leaves this section with a wrong mental model of the term.

7. Three loops or four. The h2 is "The rate ladder: a policy over a 30 Hz loop over a servo" and the text says "The host loop is the middle one of three", then "NVIDIA's research page for its GR00T 2 model describes four on a Unitree G1, ... and each has a counterpart on the SO-101", and the table gives the SO-101 a fourth rung ("Optional language model that picks the next instruction, off the control path") the prose never introduced.

8. Reference-manual material at equal weight. The expandable is titled "Servo limits, for reference: gripper caps and firmware cut-outs", which admits it. Its four firmware triggers carry no consequence for the reader (what a 2 s stall cut-out does to a rollout or a recording is the useful fact). In the calibration expandable, "The code divides by 4095, the encoder resolution minus one, where the datasheet gives the step as 360 / 4096." spends a sentence on a 0.02% difference without saying it does not matter.

9. Prose that points at the page. "(6 + 6) x 4 bytes x 30 exchanges is the 1,440 bytes per second of the opening"; "so the middle line, a tenth of a second at this pace, spends most of that margin" (refers to the bullet layout, not the 100 ms case).

10. Smaller faults.
   - h2 description "Recognise each failure by what the log and the arm do, and know which setting moves it": the h2 names causes and backends, but no setting moves the log-warning case or the recording-rate case beyond "read that report".
   - Caption: "so the motion is cleaner than a person or a trained model would make it.Capture: MuJoCo 4.0.1" (missing space); "The clip runs 8.2 s." carries nothing.
   - Capture slot: "What will be shown here: Camera footage of the real leader and follower at the bench." says what, not what the footage will show that the simulation cannot, and has no line on where it will come from.
   - "reading the leader takes 1.80 ms, sending the action 0.90 ms and writing the frame 1.70 ms" lists stage times at equal weight; only the 74.4% share and the 45.1 ms overrun carry a consequence.
   - "It is compressed to be stored (section 9, Collecting Data), decompressed to be trained on (section 10, Processing and Curating), and pushed through a vision network every time the policy is called." is a three-stop tour with pointers.

## doc-D.txt: "19. Agents Running the Loop: What the Agent May Touch and Who Grades It"

Scores
- argument 9: sentence 1 is the rule ("only if three things sit outside its reach"), sentence 4 says why ("The rate cannot tell either from a better policy"), and the 44%-to-99% calculation lands by paragraph 4; "A fence made of a process boundary holds whatever the agent writes, where a fence made of a sentence holds only while the agent follows it" is the thesis proved.
- depth 9: precision versus false-pass rate under a moving base rate, interval on a difference, Wilson lower bound for n of n, seed-fixed episodes that still flip, token accounting with cached input, and concrete AWS settings (attemptDurationSeconds and its SIGTERM-to-SIGKILL window, maxvCpus, Karpenter limits that are only eventually enforced, consumable resources with a count of one).
- clarity 8: terms are built at first use and the toy numbers are redoable; the structure makes the reader meet pass@8 twice and the title's "Loop" is ambiguous in a dive where "loop" already means the 30 Hz control loop.
- sentences 8: specific and consequential; a few bookkeeping clauses, a caption that narrates the layout, two vague pointers ("the smaller figure", "the most notable gain").
- parity 9: one of the two strongest files here.

Findings, most damaging first

1. Structure: the pass@8 argument is made twice, and a pace-and-cost section sits inside a reach-and-grading section. The opening already proves the point ("If the eight attempts were independent, a policy that succeeds on 44% of first tries would already reach 99%"); the h2 "99% pass@8 counts first tries and retries together" re-derives it with the formula, after "How an agent's score parts from the robot's skill", which is where its new material (the hardest-phase reset, the 50-episode goal) belongs. The h2 "Eight robots bought less than four times the speed, because the agents set the pace" plus the pairing timings ("first success came after 54.41 minutes with Codex driving GPT-5.5, ...") and camera-mode timings run well over a thousand words on fleet pace and token cost, a subject the title does not promise, and rest on single runs the section has just taught the reader not to rank ("Each figure is one run on one simplified task, so treat the gaps as indicative"). Fix: fold the pass@8 h2 into the score h2; cut the pairing and camera timings to one sentence with the ASPIRE 14.8% to 99.2% spread as the point.

2. The one reach the agent keeps is left undesigned. "So the agent's sandbox keeps a network, and where that network may reach is a limit to design separately." The agent runs with "unrestricted internet access", and the section's thesis is reach. Which endpoints the sandbox may reach (the model endpoint, the Git remote, the submit service, nothing that can write the grader) is the configuration the reader needs for a first unattended night, and the section stops at naming it. Similarly "raise that default for an agent that waits on jobs" does not name the AgentCore setting, where Batch's gets named (attemptDurationSeconds).

3. A claim and the section's own chart pull against each other, joined by an assertion. "because on hardware the budget of real attempts, not compute, is the loop's scarcest input" versus "With eight agents a robot stood idle the other 70% of the time." The join is "That cap binds even while robot hours go unused." Why an operator would cap real attempts while robots sit idle (wear, supervision, reset failures, risk) is never said, so "scarcest" reads as contradicted rather than explained.

4. The rule's count drifts. Opening: "only if three things sit outside its reach: the reset ..., the success check ..., and the safety limits". Paragraph 5 adds compute ("Anything the agent's grade, test or spend depends on belongs outside its reach."). The ending lists "the success check, the judge, the reset, the evaluation start states and the safety limits" plus a timeout on every job. Paragraph 5's sentence is the real rule; open on it and let the three be its first instances.

5. Checklist paragraph. "The person also states the check's recall, the share of true successes it passes, and its latency, because it runs after every attempt: on a task that fastens a zip tie, it reads two camera views within a 150 ms budget. The paper does not report the precision and recall its checks achieved. Last, the person keeps a test the agent cannot train on" lists duties at equal weight; the held-out test, the one that protects the grade, arrives last behind a latency figure from another task.

6. The section's best derived point withholds the name the reader will meet elsewhere. "The figure that stays put is the share of failures the check passes, one in ten in both cases." This is the false-positive rate; naming it once lets the reader find it in any evaluation tool and connects the advice ("state the share of failures the check may pass") to a number they can compute.

7. Caption narrating the page. "One pass runs down the middle arrows, and the arrow up the right side carries the grade back to the agent for its next idea. Illustrative layout, not measured." Directions on the page are not content, and "not measured" is boilerplate on a box diagram.

8. Bookkeeping. "By our reading, SEAR's caution about practice and test applies to the 99% as well."; "No SO-101 adapter appears in the ENPIRE repository's file list at the pinned commit"; "and the project page's data for the 86 ideas gives each one's time, its agent and whether it raised the best rate, with no episode count" (three fields listed where "gives no episode count per idea" does it); "and the fair-share page names no GPU-hour cap". By contrast, "in the repository files read at the pinned commit the line is only text" is load-bearing (it scopes a hedge about enforcement) and should stay.

9. Title. "Agents Running the Loop" depends on knowing which loop. In this file "loop" also means the policy's 30 Hz host loop ("the same rate as the SO-101's host loop (section 3)") and the paragraph says "The agent's loop is counted in minutes per idea, the arm's in milliseconds per action." The subtitle carries the meaning; the main title is of the "One Robot, One Loop" family.

10. Smaller faults.
   - "It found \"a systematic bias toward predicting success under ambiguous evidence\"." gives no size for the bias, though the paragraph's claim is that the agent is paid for those false passes; the only number is the 0.60 ceiling on contact tasks.
   - "The prompt's objective gives the smaller figure." Which figure? (the speed-up, 2.25 against 3.7).
   - "the most notable gain came from a mix": notable by what measure? Say "the largest".
   - "So with w the half-width of the 95% interval on the difference between two success rates": "So" links a rule to an example it does not follow from.
   - "Station hardware, for reference" and "The station server's three calls" are reference expandables; the second repeats the diagram's "through three calls: start, restart, home".

## Batch answer

Groups, by quality alone

- Group 1, B and D. Each opens on a rule with a worked number in the first paragraph (B: 149.0 / 33.3 = 4.5 periods; D: 0.56^8, so 44% first tries already make 99% within eight), carries that one argument through configuration-level detail (named settings, defaults, valid ranges, documentation-versus-code disagreements resolved for the reader) and ends on the reader's next measurement. Their faults are local: a docker line one camera short and two unresolved applicability questions in B; a repeated pass@8 derivation, a pace-and-cost detour and an undesigned network limit in D.
- Group 2, C. The prose is as clean as Group 1's, often plainer, and the concept-building (intuition, formula, decomposition for the encoder and PID) is the best in the batch. It sits a step below on argument because its central tool (delay times speed equals a miss) is stated without its condition and contradicts the section's own later conclusion, and it mixes GR00T's call with a 50-action chunk. That is a reasoning fault, not a quality-of-writing one.
- Group 3, A. Argument and evidence match Group 1, but the scaffolding shows: "Our reading" eight times, a first paragraph that announces what the section answers, pass@k and the trust check used before they are built, parenthetical stacks, a summary table whose title, column and model list disagree with the prose, and an ending of pointers instead of a worked decision.

Would a careful reader tell them apart by quality alone? Yes for A: the provenance refrain, the self-talk and the definition-before-use slips are visible on a first read regardless of topic. No reliable separation among B, C and D: a careful reader might rank C a notch below on the strength of its central claim, not on its writing.

Verdicts
- doc-A: distinguishable: weaker. Same strength of claim and evidence as the best files, carried in sentences that keep marking their own provenance and pointing at the page.
- doc-B: sets the bar. Claim and number in sentence 1, level-400 configuration throughout; heaviest term load in the batch.
- doc-C: not distinguishable by quality from the best files. Prose and ramp-up at the bar; one unconditioned central claim and one mixed example.
- doc-D: sets the bar. The clearest argument-to-action line in the batch; would gain from cutting its second pass@8 derivation and the single-run timing detour.


## Key (appended by the orchestrator after the review)

doc-A rl dive what RL does to a model; doc-B this dive section 17 (r3); doc-C this dive section 3 (published pilot, bar); doc-D this dive section 19 (r3)
