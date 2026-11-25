# Adversarial review, round 4 (blind, seven files)

| File | Subject (as titled on the page) | argument | depth | clarity | sentences | parity | verdict |
|---|---|---|---|---|---|---|---|
| doc-A | Roofline and Arithmetic Intensity | 9 | 9 | 6 | 8 | 8 | sets the bar |
| doc-B | 2. Getting Started: What Changes When the Model Drives a Robot | 8 | 8 | 9 | 8 | 8 | not distinguishable by quality from the best files |
| doc-C | 10. What RL Does to a Model | 8 | 9 | 7 | 7 | 7 | not distinguishable by quality from the best files (lower edge) |
| doc-D | 3. The Robot as a Computer: Inputs, Outputs and a Deadline | 8 | 9 | 9 | 8 | 8 | not distinguishable by quality from the best files |
| doc-E | KV Cache and FlashAttention | 7 | 9 | 6 | 7 | 7 | distinguishable: weaker (second half only) |
| doc-F | 1. One Arm, Fifteen Workloads: What Each One Runs On | 9 | 8 | 8 | 8 | 8 | not distinguishable by quality from the best files |
| doc-G | 9. RLVR & GRPO | 9 | 9 | 7 | 8 | 9 | sets the bar |

Scores are strict: 8 means publishable beside the best here with no embarrassment. No file reaches 10 on any axis.

---

## doc-A: Roofline and Arithmetic Intensity

Scores
- argument 9: the header states a claim ("your precision choice moves the ridge further than a chip generation does"), the table and the paragraph under it prove it with 206 to 412 and 182 to 1,591, and the section closes on the same claim turned into an instruction.
- depth 9: ridge arithmetic per chip and precision, the Rubin and Trainium3 cases where the rule breaks, the three conflicting Rubin bandwidths, the 69 tokens/s ceiling.
- clarity 6: written for someone who already has prefill, decode, KV cache, FLOP and "dense". The level 100 to 200 reader is lost in the first figure.
- sentences 8: tight, consequential, almost no filler. A few list sentences and pointer sentences.
- parity 8.

Findings, most damaging first
1. "Decode at batch 1 sits about 200 times below the ridge at either precision." and, in the same paragraph, "Prefill on a long prompt reuses each weight across thousands of tokens and runs on the compute ceiling." Decode and prefill are placed on the figure and argued about one full block before the page says what either is ("Prefill processes the whole prompt in parallel...", "Decode generates one token per sequence per step..."). Term used before it is built; the first figure is unreadable to the stated reader. Fix: one clause each at first use, or swap the two blocks.
2. "Arithmetic intensity is FLOP per byte of DRAM (dynamic random-access memory) traffic, a property of the workload and its implementation." FLOP is never expanded or explained anywhere in the file, while DRAM is. The unit the whole section turns on is the one left undefined.
3. "Workload intensities count weight bytes only, at 2 FLOP per weight per sequence in the batch." and later "A dense model does about 2 FLOP per parameter per token". The 2 is asserted twice and never explained (one multiply and one add per weight). It is the number every intensity on the page is derived from.
4. "Three quantities." A verbless announcement, followed by four defined things (intensity, peak FLOPS, peak bandwidth, ridge point). Listy opener of the kind the owner objects to; the paragraph would lose nothing without it.
5. "Second, GQA (grouped-query attention), KV-cache quantization, FlashAttention-class fusion and speculative decoding speed up decode by cutting the bytes moved per useful FLOP." Four techniques in one list, none explained, and the common cause claimed for them is not shown for any (speculative decoding in particular is not obviously a bytes-per-FLOP saving). A list standing in for an argument.
6. "On Rubin, BF16 to FP8 goes from 4 to 17.5 PFLOPS, so a decode batch that was compute-bound at BF16 can land back on the bandwidth slope at FP8, faster but bandwidth-limited again." A leap. The reader has to supply a batch size and redo the ridge arithmetic to see it (for example a batch near 200: intensity about 200 against a 182 ridge at BF16, about 400 against 795 at FP8). The page works a number everywhere else and skips it for its most surprising claim.
7. "First, the spec sheet gives a ceiling on batch-1 decode speed: HBM bandwidth divided by the bytes read per token, the active parameter bytes plus the KV-cache bytes. A 70-billion-parameter dense model in FP8 reads about 70 GB per token, so one H200 tops out near 69 tokens per second." The formula includes KV bytes and the worked number silently drops them. "Active parameter bytes" is also unexplained (it only matters for mixture-of-experts models, which are not mentioned).
8. "NVIDIA H200 SXM: dense Tensor Core peaks of 989.5 TFLOPS in BF16..." "Dense" is used from the first caption on and only acquires a meaning in the last expandable panel ("Sparse rates apply only to weights pruned to the 2:4 structured pattern").
9. "That is why vLLM (including vLLM Neuron on Trainium), TensorRT-LLM and SGLang spend so much code on continuous batching." Continuous batching is not explained, and "spend so much code" is a loose aside in an otherwise exact page.
10. "One kernel for several operators keeps intermediate tensors in SMEM (shared memory), TMEM (Tensor Memory) or SBUF (State Buffer) instead of HBM." Three expanded acronyms and no statement of what they are (on-chip memory of which chips). Expansion is not explanation.
11. "Cerebras Wafer-Scale, Groq, SambaNova and Dataflow and Compute-in-Memory cover each." and the last sentence of the page, "Quantization and Precision covers the full ladder and the numerics that make FP8 and FP4 usable at model scale." Pointer sentences; the section ends on a cross-reference, one sentence after its real ending ("Before you pick a precision, read your chip's row in the ridge table...").
12. Sub-heading "The roofline, placed" is a label that says little; its description ("Where decode and prefill land on an H200, and what one precision step does to the chip and to the workload") does the work.

---

## doc-B: 2. Getting Started: What Changes When the Model Drives a Robot

Scores
- argument 8: opens on a claim the reader can test ("experience with language models points the wrong way on each"), with 33.3 ms and 38,400x in the first paragraph. Each of four sub-sections has a heading that is itself a claim.
- depth 8: tail latency (12/1197 cycles, 48.1 ms worst, a 620 ms write stall), sync against async, 41.5 GB peak with frozen backbone, 22.9 against 149.0 against 357.9 ms, cosine check 0.999, nvidia-smi's definition of utilisation. It stops short of mechanism in places by design (pointers to later sections).
- clarity 9: every term is built before use; no leap found.
- sentences 8: mostly consequential. Some provenance clutter inside sentences and a few clumsy constructions.
- parity 8.

Findings, most damaging first
1. The ending is not the ending. The page reaches "Before you size anything for a robot, get four numbers: the control period (33.3 ms on this arm), the time of one call of your model on the robot's computer, the format of your recorded video, and the CPU cores per GPU of the instance you mean to train on." and then appends a navigation block: "Shorter routes for a single question" with "Three routes cut the 30 sections down to those one question needs: world models, which predict what the arm's actions will do before the motors move; the pipeline from a recorded attempt to many robots; and the choice of machines and a scheduler." That sentence is hard to parse ("those one question needs"), it is a tour of the site, and it introduces world models in a subordinate clause. Its caption, "The outlined cells are the selected route. A letter on a cell marks each route that passes through it.", is user-interface help. The strongest sentence on the page is buried under a site map.
2. "The model that drives it has a deadline the arm sets, 33.3 ms on this one, so it is sized in milliseconds per call and its throughput settles nothing." "Its throughput settles nothing" is vague where the rest of the paragraph is exact; "on this one" dangles.
3. "And a GPU that reads as busy can be waiting on CPU cores: Hugging Face reports that one setting, which moves image preparation off those cores, makes a small policy train 2.8 times faster on an H100." "One setting" is coy on the first screen; the setting has a name (backend=gpu) that appears only three sections later.
4. "The mean tick took 18.7 ms of the 33.3 ms budget and the mean policy call 5.18 ms in the sample timing report of LeRobot's inference guide, which runs at 30 ticks a second on hardware the guide does not name." Provenance carried in the sentence, after the numbers, so the reader learns what the figures are only at the end. The citation follows two lines later.
5. "A job uses the parts of a machine in some proportion, so one of them fills while the others sit partly idle, and a larger instance helps only if it has more of that one." "In some proportion" is the vaguest phrase on the page, and it opens the section that is supposed to be the sharpest tool. The heading above it, "A job runs as fast as the first part of the machine to run out", is also awkward.
6. "So the purchase this fact forces is CPU cores per GPU." Prose pointing at itself ("this fact") in a contorted word order. Plain version: so you buy CPU cores per GPU.
7. "The size that decides which GPU can do it is memory." Same contortion; "do it" has no clear referent.
8. "A public 50-episode pick-and-place dataset named for the SO-101 is 86.1 MB in all... The video is still about 230 times the rows (our arithmetic)." "Named for the SO-101" is a hedge about provenance the reader cannot use, and "(our arithmetic)" is bookkeeping on a division anyone can redo from the three figures given.
9. "If the figure holds, the H100 had been waiting on the workers for 1 - 1/2.8 = 64% of each step, and nothing on the GPU itself says so." The 64% assumes the whole speedup is removed waiting. Good use of a vendor number, but the assumption should be one clause, since the paragraph before says the source gives no dataset, camera count or batch size.
10. "Most eight-GPU instances give each GPU 24 vCPUs, which is 12 physical cores; g7.48xlarge gives each GPU 24 physical cores, the most among the eight-GPU x86 sizes." The fact that decides the purchase arrives as an unexplained instance name, with no word on what the instance is or what GPU it carries.

---

## doc-C: 10. What RL Does to a Model

Scores
- argument 8: a real thesis (RL mostly sharpens, a frozen model can buy part of that back per query) stated in paragraph two with a number (8.84x tokens). The first paragraph is a definition and a statement of purpose.
- depth 9: measured crossings, question-level counts, three boundary-moving settings with their scope, a three-way dispute about sparsity resolved to a practical instruction, priced inference-time routes.
- clarity 7: LoRA, rank-1, MCMC, low-curvature regions and "the words track" are used without being built here.
- sentences 7: the writer's own bookkeeping is in the prose again and again, and several sentences talk about the section.
- parity 7.

Findings, most damaging first
1. Bookkeeping, repeated. "Our reading of these studies: RL sharpens by default..."; "AIME on a Qwen2.5 base carries the model-family caveat of the trust check below (our reading)."; "Our reading: a model that samples nearly the same answer every time..."; "Our reading: the three disagree about sparsity..."; "Our reading of these studies turns the three checks into questions:"; "Our reading, from the definition of pass@k: the base model's pass@K is the ceiling..."; "Our reading: the contamination result in the trust check concerns the same model..."; "Our reading, which sets the choice: inference-time sharpening is paid on every query...". Eight times. The owner's rule is one plain clause, once. Several of these label things that are not readings at all: the best-of-K ceiling follows from the definition and needs no flag.
2. "This section answers the dive's first question: what RL does to a model." The section restating its own title as its purpose, as the last sentence of the opening paragraph.
3. "RL (reinforcement learning) with verifiable rewards, RLVR, trains a model on tasks where a program checks each answer and the check is the reward (section 9, RLVR & GRPO)." The first sentence is a definition with a back-reference. The argument starts in sentence three ("What it adds to the model is a separate question...").
4. "The term it turns on is the capability boundary: the set of problems a model solves in at least one of k samples when k is large." Prose about the section ("the term it turns on") wrapped around the key definition.
5. "The studies read tested four routes, and the base model's own pass@k curve sets their ceiling." Then the table is titled "Three ways to buy sharpening back per query". Four run-in blocks follow (the curve as a menu, the sampler, the prompt, the learned verifier) and the table has three rows. The count is wrong or unexplained either way, and "the studies read" is more bookkeeping.
6. "In Thinking Machines' runs (Llama-3.1-8B base; MATH, a competition-math benchmark, and grade-school math), rank-1 LoRA matched full fine-tuning for policy gradient, the RL update driven by the advantage (how much better an attempt scored than expected)." The sub-section opens on an attribution and a parenthesis; LoRA and rank-1 are never explained in this file (a later sentence says only "through a LoRA adapter, section 3"). The claim this paragraph exists for, that a reward carries about one bit, comes third.
7. "On their information argument, SFT (supervised fine-tuning, training on target answers token by token) arguably supplies information on every token of its target, while policy gradient supplies only O(1) bits per attempt". "On their information argument" and "arguably" are two hedges on one clause.
8. "On leg_counting, a task from the Reasoning Gym suite, ProRL, a model trained with prolonged RL, solved 28% of questions in one attempt against 4% for its base model". Four commas of apposition in a row; on first read "ProRL" looks like another gloss on the task. This is the one measured crossing the section relies on.
9. "The Qwen2.5-Math case shows why each of the three checks matters." Throat-clearing; the next paragraph shows it without being announced.
10. "The key reads the curves from left to right." and "Marker 4 in the diagram above is that ceiling." Prose narrating its own figure.
11. "No frontier lab has published, in the sources located for this research, a comparison of a base checkpoint with its RL checkpoint at large k." The scope hedge is right to keep, but it is wedged between verb and object.
12. "It uses MCMC (Markov chain Monte Carlo) to resample blocks of tokens according to their base-model likelihoods". Acronym expanded, mechanism not explained, in the paragraph that carries the section's headline number.
13. "A second paper reads that sparsity as the visible trace of an optimisation bias: for a given pretrained model, RL's updates land in the same low-curvature regions across runs, datasets and recipes". "Low-curvature regions" is beyond the stated reader and is not unpacked.
14. The heading "Does RL change only a few weights? Three positions" and its paragraphs "One study...", "A second paper...", "A third found..." are a literature tour organised by paper. The practical sentence ("A sparsity figure measured on your own checkpoints means something only with its storage precision and tolerance recorded beside it.") comes last.
15. The ending. "So measure before you train." starts a strong closing paragraph, which then finishes on "Section 23, Cost per Improvement, prices the per-query route against training, and the words track from section 14, A Text Loop Is RL on the Context, onward takes up what a loop can learn that RL mostly does not: instructions, procedures and facts." A double pointer, with "the words track", an internal label the page never explains.

---

## doc-D: 3. The Robot as a Computer: Inputs, Outputs and a Deadline

Scores
- argument 8: the first screen makes a claim and works it ("Lateness on a robot is a distance", 25 mm at 100 ms), and the last section cashes it. The middle (observation, action) is a guided description that leans on naming.
- depth 9: units and normalisation modes, the register interface, PID with the actual gains and the consequence of I = 0, the loop's pacing rule, the timestamp fault in recordings, a latency budget worked to 143.4 ms and 35.9 mm with its omissions named.
- clarity 9: every term built before use, formulas preceded by intuition and followed by decomposition.
- sentences 8: strong where there is a consequence; a glossary cadence and a scatter of disclaimers elsewhere.
- parity 8.

Findings, most damaging first
1. "Capture slot, dated 2026-11-20" and "What will be shown here: Camera footage of the real leader and follower at the bench." A visible placeholder on a published page. Nothing else in the batch is unfinished in this way.
2. The glossary cadence. "Driving a robot by hand like this is teleoperation."; "A recording made this way is a demonstration."; "Everything the robot knows at one instant is called an observation."; "A robot's sense of its own body is called proprioception, and on this arm proprioception is those six angles."; "That model is called a policy."; "The controller is tuned by numbers called gains." Six "is called" sentences. Each is correct and placed, but together they give the middle of the page a primer's register, and proprioception is named and then never used again.
3. Disclaimers in the prose. "(Both angles are made up.)"; "a modest working pace chosen for the arithmetic; no one measured it."; "(a made-up tolerance)"; "(the split into four is ours)"; "Control-latency budget (our accounting)"; "By our arithmetic, one joint swinging the fully stretched arm..."; "and it has not been measured." Seven. One "illustrative" at the 0.25 m/s figure covers most of them.
4. "Take the longest value of the two waits, NVIDIA's median for the call, and the model on the Thor beside the arm, so no network: 33.3 + 76.8 + 0 + 33.3 = 143.4 ms". The sentence that sets up the page's main worked number is a three-item list whose third item is not parallel with the first two. "The two waits" has to be decoded as frame age and the wait for the next write.
5. The encoder arithmetic does not agree with itself and the page does not say why. "4096 per full turn on this arm" and "One encoder step is 0.088 degrees" (360/4096), against the formula "degrees=(raw−mid)× 360/4095" and "1024 x 360 / 4095 = 90.02 degrees". A reader redoing the arithmetic, which the page invites, hits 4095 against 4096 with no clause explaining that the code divides by the maximum reading.
6. "The last control rates Figure published are for its Helix 02 humanoid model, on 2026-01-27, and they describe three layers... Its newer Helix 2.5, posted 2026-09-17, states none." A second example that adds no idea beyond the table above it, opening on source bookkeeping and closing on what a source does not say. It neither builds the model further nor changes a choice.
7. "Servo limits, for reference: gripper caps and firmware cut-outs". The heading itself says reference material. Four trigger thresholds at equal weight, none tied to anything the reader does. It is in a collapsed panel, which is the right place if it stays.
8. "The table lists them from the fastest loop to the slowest." and "Step through from the bottom lane up." Prose and caption giving reading instructions.
9. "Five of the joints place and orient the gripper (shoulder pan, shoulder lift, elbow flex, wrist flex, wrist roll) and the sixth servo opens and closes it." A list of names the figure already carries. The consequence comes two sentences later ("five joints cannot reach every position at every angle").
10. "The sum is not the whole chain. It takes the longest value of the two waits, which overstates a typical tick, and NVIDIA's median call, which understates a slow one." Honest and worth keeping, but it audits the method one paragraph after using it, and "the sources read on 2026-11-20 give a figure for none of them" is a date-stamped research note in running prose.
11. "The policy is the model-serving job that is sized by a deadline; the training-side jobs are sized by throughput." "The training-side jobs" appears from nowhere in a section about the arm; a contrast borrowed from another section.

---

## doc-E: KV Cache and FlashAttention

Scores
- argument 7: the first half argues (KV bytes per token decide context per GPU, and attention design moves it more than parameter count), with 327,680 bytes, 2.68 GB and the 156.5 GB against 113.5 GB fit by the fourth paragraph. The second half (FlashAttention generations, the silicon stack) is a set of facts under headings.
- depth 9: the sizing formula worked to a fit decision, variants with real configs, the softmax bottleneck on Blackwell, paging waste figures, named settings.
- clarity 6: the stated reader has no query, key, value, head or decode, and the page builds none of them.
- sentences 7: exact in the first half, catalogue-like in the second, with repeated facts and unexplained jargon.
- parity 7.

Findings, most damaging first
1. "What it stores. Each layer's attention produces a key (K) and a value (V) vector per KV head for every token, and each new token attends to all the earlier ones." This is the only explanation of what a key and a value are, and it explains them with "attention", "KV head" and "attends", none of which the page builds. Queries arrive later still, as "the queries (Q) times K transposed". The stated reader cannot derive why the cache exists from this.
2. "Decode sits far below the ridge point (Roofline and Arithmetic Intensity): every generated token rereads the weights and the keys and values of every earlier token." The first sentence depends on another section for decode and ridge point, in a parenthesis.
3. "Across current models it spans more than 300x, from 327,680 bytes for Llama 3.1 70B to 890 bytes of global cache for DeepSeek-V4.1-Flash." The section's headline number compares a full cache with part of one. The qualification comes much later, inside a collapsed panel: "DeepSeek-V4.1-Flash's 890 bytes cover its global cache; a separate sliding-window cache sits outside that figure." The number is then repeated as "the same HBM holds 368 times as many tokens of global cache" without the missing half ever being sized.
4. "Pick the generation by GPU. FlashAttention-2 supports Ampere, Ada and Hopper GPUs. FlashAttention-3 is a beta built for Hopper (H100); it overlaps asynchronous data movement and Hopper's warpgroup matrix multiplies (wgmma) with the softmax. FlashAttention-4 is written in CuTe DSL (NVIDIA Compilers and Kernel Tooling), targets Hopper and Blackwell (H100, B200) and installs with pip install flash-attn-4. It ships as betas; fa4-v4.0.0.beta35 came out on 2026-10-14." Reference-manual prose: a support matrix, an install command and a beta build number at equal weight, with "warpgroup matrix multiplies" and "CuTe DSL" unexplained. The decision the lead-in promises (which one do I run) is never stated as a rule.
5. "FlashAttention-4 answers with software-emulated exponentials and conditional softmax rescaling: a fused kernel runs at the pace of its slowest unit." Two unexplained techniques, then an aphorism after a colon that does not follow from them. The actual point (compute grew 2.3x while exponential throughput went from 4.5 to 5) is clear one sentence earlier and is blurred here.
6. Repetition without gain. "FP8 and NVFP4 (NVIDIA's 4-bit floating point format) KV caches are both supported in TensorRT-LLM" and, two blocks later, "In TensorRT-LLM, KvCacheConfig(dtype='fp8') stores the cache in FP8, and NVFP4 KV is also listed." Likewise "vLLM and TensorRT-LLM both page the KV cache." restates the PagedAttention block. The call-out "In the forward pass, FlashAttention performs the same FLOPs as unfused attention. It changes the bytes..." restates its own heading and the sub-heading description above it.
7. "Every technique on this page raises that cap: fewer KV heads (GQA), a compressed latent (MLA), sliding windows and linear-attention layers, fewer bits per entry, and paging." A recap list, self-referential ("on this page"), inside a panel whose title, "Why KV-cache management is the second lever after batching", promises an argument.
8. "How this maps to the silicon stack" is a heading that says nothing, and the block under it is two short vendor paragraphs. "The NKI (Neuron Kernel Interface) library ships an attention CTE (context encoding) kernel for prefill on Trn2 and Trn3." stacks two expanded but unexplained acronyms and two unexpanded chip names.
9. "Qwen3-Next-80B-A3B keeps a KV cache in 12 of its 48 layers and uses linear attention in the rest." and "Kimi K2 keeps the same 512-wide latent." Model trivia with no consequence drawn; linear attention is not explained.
10. "Read the table as the formula at work." A reading instruction where the next sentence ("Mixtral 8x7B... stores the same 128 KiB per token as Mistral 7B, because its layers and KV heads have the same shape.") already does the job.
11. The run-in labels "What it stores.", "How big it gets.", "What fits on one GPU.", "Which one dominates depends on the deployment." give the first block a question-and-answer cadence; the fourth is a sentence and the first three are labels.
12. The ending is a pair of pointers: "Flash as a Cache Tier for Inference sizes host DRAM and local NVMe for that tier and weighs fetching a cached prefix against recomputing it, and the KV Offloading and LMCache section of the vLLM Inference Engine dive covers the software that moves it." The page's real instruction ("Before sizing a deployment, read the model's config.json: num_key_value_heads, head_dim, kv_lora_rank, layer_types, sliding_window and full_attention_interval set the KV budget.") sits in the middle, inside a collapsed panel.

---

## doc-F: 1. One Arm, Fifteen Workloads: What Each One Runs On

Scores
- argument 9: title, header and first paragraph hand over two questions and say what each one decides. A count is worked to a prediction (465 passes a second), tested (390, 84%) and then explained with a counter (62.3% of cycles stalled). The page closes on the same two questions.
- depth 8: the bottleneck count, Spot mechanics, three GPU facts that change a purchase (AV1 decode on H100, no RT cores on A100 and H100, cores per GPU), a sample-size figure. The fifteen-row table asserts a part per row with no figure behind any; the page says so and points elsewhere.
- clarity 8: terms built before use. The table's numbering and its "Vendor scale" stage are confusing.
- sentences 8: several of the best sentences in the batch, alongside a lot of counting.
- parity 8.

Findings, most damaging first
1. The page counts its own contents. Fifteen jobs, two questions, "the same three terms", three properties, five shapes, eight stages, "four different GPU units", "one stage and three workloads", "Five of the fifteen", "the same three parts". "Split every stage that way and the eight stages become the fifteen workloads of the table, grouped by shape and labelled with their stage." is a sentence about how the table was assembled. The reader needs the two questions and the five expensive mistakes; the rest of the numerals describe the page's structure.
2. "Five of the fifteen are the easiest to buy wrong, and they are in bold: recording, decoding, the dataloader, the simulated cameras and on-robot inference." Prose describing its own formatting. The fact that matters ("The first three all land on CPU cores, for one reason.") is the next sentence.
3. The table reads out of order and has a category the text never sets up. Rows run 2, 3, 5, 6, 7, 10, 11, 13, 4, 8, 9, 14, 15, 1, 12, numbered by stage but sorted by shape, and three rows give "Vendor scale" as their stage although the figure has eight stages and none has that name. Fifteen rows sit at equal weight with only bold to rank them.
4. "Duration is how long one unit of work runs, coupling is whether the pieces must exchange data while they run, and interruptibility is whether the job can stop and resume having lost no more than one unit. Together they are a job's shape, and the shape settles the kind of scheduler and whether Spot is open." The three properties are named after two paragraphs of examples that used them unnamed, and the thesis of the section arrives as a taxonomy in its seventh paragraph. The heading ("What a job loses with its machine picks the scheduler and the market") says it better.
5. "Two of the stages need a word." Prose about itself.
6. "The six-matrix program shows the method, and its figures are not that policy's." A disclaimer as the last sentence of the opening argument. Necessary content, placed where the payoff should land.
7. "Always on. A stream with no end, handled item by item: video that arrives all day is decoded as it comes, on a tier of machines that is kept running where the other shapes queue jobs, and a taken machine costs one item." "Where the other shapes queue jobs" is a hard clause to parse, and this is the one shape for which no scheduler is named.
8. "How many evaluation episodes are enough? More than a few dozen. 40 successes in 50 and 45 in 50 cannot be told apart, and the standard sample-size approximation for comparing two proportions asks for about 199 trials per policy to tell a true 80% from a true 90%, at 80% power (four chances in five of detecting the gap) and the 5% level (one chance in twenty of a false alarm; section 16, Evaluation)." A good fact that belongs to neither of the page's two questions, in one sentence carrying two glosses and a cross-reference. It also sits oddly beside the 500-episode job the page used earlier.
9. "Two numbers, 25.2 MB per pass and 11.71 GB/s from the core, gave the six-matrix program its ceiling before it ran, and the run reached 84% of it (section 20, Fifteen Workloads, Five Shapes, names the part for every row with the figure behind it, and section 21, Reading a Machine, shows how to confirm a part on the processor's counters)." A 37-word parenthetical tour of two other sections hung on the sentence that repeats the page's strongest number.
10. Figure caption: "Each stage is tagged with the parts its commonest workloads exhaust first or next (in our reading)." "First or next" is loose and "(in our reading)" is bookkeeping in a caption.
11. "On AWS that is one array job in AWS Batch, a single submission that spawns 500 children, each reading its index to pick its seed." Fine as mechanism, but AWS Batch itself gets no gloss, where Spot, Greengrass and TensorRT each get one.

---

## doc-G: 9. RLVR & GRPO

Scores
- argument 9: paragraph two states the claim ("The challenge is to spend each step on prompts that can teach the model something") and gives the mechanism and a measured result (zero loss on 9 and 10 of 20 steps). The last section predicts that measurement from one formula and ends on a test the reader can run before paying.
- depth 9: an advantage worked by hand, each successor tied to the term it changes, defaults read from tagged source in two frameworks, a documentation recipe that leaves a divisor on, the silent-token divisor effect, p^G + (1 - p)^G checked against the logs.
- clarity 7: leans on sections 6 and 7 for the baseline, the clip and the KL term; rollout, gae, overlong filtering and Routing Replay are used unexplained.
- sentences 8: dense and consequential; some narration of the page's own blocks and some source bookkeeping.
- parity 9.

Findings, most damaging first
1. The title, "9. RLVR & GRPO", is two unexpanded acronyms. It is the kind of title the owner asked "What does that mean?" about, and it undersells a page with a clear thesis. The header description also uses GRPO before it is expanded.
2. "RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the reward: a rule that compares a boxed final answer with the reference, or a compiler that runs the code against predefined test cases". The first sentence is a definition with a nested gloss. The claim that drives the page waits for paragraph two.
3. "The paper's first arXiv version reported 71.0%; the second arXiv version and the Nature paper report 77.9%". Version history of a source. It gives the reader nothing to think with or do.
4. Prose that narrates the page. "The minimal recipe of Dr. GRPO (GRPO Done Right), a variant the next blocks return to..."; "Those two divisors, the answer's length and the group's standard deviation, are the first terms the successors in the next block change."; "Read prompt A first."; "The table maps each term onto its setting in both frameworks."; "The page gives the identifiers; the right-hand column is our mapping onto the terms above."
5. "GRPO is the sampled-baseline route of section 6, Policy Gradient." The mechanism section opens on a classification that only a reader of section 6 can use. The next two sentences explain GRPO without it.
6. Bookkeeping, though lighter than in doc-C: "in our reading of the code" (twice), "(REINFORCE++, in our reading of the identifier)", "(our arithmetic)" (three times, twice inside table cells), "Our arithmetic: share of groups with no gradient..." as a table title.
7. "naive GRPO 30, then 36 with overlong filtering, 38 with Clip-Higher, 41 with a soft penalty for overlong answers, 42 with the token-level loss and 50 with dynamic sampling". Overlong filtering and the soft penalty are never explained, though each is worth as many points as the changes the table covers. Likewise "GRPO needed a training strategy called Routing Replay to converge" names a thing and stops, and "adv_estimator: gae" is never glossed.
8. "AWS suggests importance_sampling for a team new to multi-turn RL, and calls PPO with clip thresholds of 0.8 and 1.2 the safe baseline for any first run". Two recommendations for a first run that point at different settings, reported side by side. The reader is left to guess which to pick.
9. "The job request carries the group size as trainingSamplePerPrompt, next to batch size, epochs, learning rate, length limits and reasoning effort; the documented request sets 4 samples per prompt, as an example value rather than a default". A parameter list at equal weight, in a section ("The same knobs on a managed job") that is otherwise a mapping table with little argument.
10. "On the E0 figures, a 4% base rate left 9 and 10 of 20 steps with no gradient at all" and "(our arithmetic on the E0 figures)". "E0" is an internal experiment label that the prose never introduces; it appears otherwise only in citation markers.
11. "a group whose answers all score the same gives every answer an advantage, its score relative to the group, of 0, and the step spends its rollouts on that prompt for no gradient". "Rollouts" is used here, in the thesis paragraph, and never defined; the gloss of advantage interrupts the phrase "an advantage of 0".
12. The ending. The closing paragraph is the best in the batch up to "Drop or replace those prompts, or filter them during training.", and then adds "Section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, turns the same measurement into its second decision question: what the model scores on your signal today.", a pointer whose payload ("its second decision question") means nothing on this page.

---

## Across the batch

### Groups by quality alone

Group 1, the top: doc-G and doc-A. Both make one claim, prove it with arithmetic the reader can redo, and reach a result the reader would not have guessed (a documented recipe that leaves a divisor on; a precision step that moves the ridge 9x where three chip generations move it less than 2x). Both also assume a reader above level 200 and pay for it on clarity.

Group 2, level with the top on a different balance: doc-F, doc-D, doc-B. They are a notch less dense and clearly more followable. Each opens on a claim with a number on the first screen, carries a worked count through to a decision, and ends on an action (doc-B's ending is then buried by a navigation block). Their faults are of one kind: self-counting in doc-F, "is called" definitions and disclaimers in doc-D, a few contorted sentences in doc-B, and a visible placeholder in doc-D.

Group 3, slightly behind: doc-C. The same depth as doc-G, the same subject area, a real thesis, but eight "our reading" flags, a first paragraph that states its own purpose, a route count that disagrees with its table, and a literature tour in the weights section.

Group 4, weaker in its second half: doc-E. The first half (sizing formula, what fits on one H200, the variants table) is as good as doc-A. From "FlashAttention: keep the attention tile on chip" onward it turns into a reference page: version and beta numbers, an install command, facts stated twice, a contentless heading, and an ending made of pointers. Its headline 300x also compares a whole cache with part of one.

### What separates the groups

Not the depth axis: all seven reach mechanism, numbers and configuration choices. The separation is on three things.
- Whether every block argues. Groups 1 and 2 keep a claim alive in each block. doc-E stops arguing halfway and doc-C's weights section lists positions.
- How much the writer's bookkeeping shows. doc-C is the worst, then doc-D and doc-G, then doc-F.
- Who the page was written for. doc-A, doc-E and (less so) doc-G and doc-C assume the topic's concepts; doc-B, doc-D and doc-F build them. On the stated reader the second set is better; on density the first set is.

### Can a careful reader tell some files apart from the others by quality alone?

Only at the edges, and not along the line of any one dive.

- doc-E can be told apart as weaker, by its second half alone.
- doc-C can be told apart from doc-G, which shares its subject, by its bookkeeping and its opening. The gap is small.
- doc-B, doc-D and doc-F cannot be told apart from the best files by quality. They can be told apart by register: shorter sentences, each term named and glossed at first use, the same arm and the same handful of figures (33.3 ms, 149.0 ms, 38,400x) on each page, and line-level citations. A reader would recognise them as coming from one dive, and as being written for a less expert reader, but would not rank them lower. On argument and clarity they sit at or above doc-A and doc-E. None of the three shows the faults the owner named: no title that needs decoding, no header description that tours the page, no first sentence that defines the field.
- What still marks those three, if a reader went looking: the placeholder panel in doc-D ("Capture slot... What will be shown here"), the route map appended to doc-B, the self-counting and "they are in bold" in doc-F, and the "is called" run in doc-D. These are finishing faults. They are no worse than doc-C's bookkeeping or doc-E's catalogue half.

### Verdict per file

- doc-A: sets the bar. Best claim-to-proof ratio in the batch; loses only on assumed vocabulary.
- doc-G: sets the bar. Thesis, hand-worked mechanism, source-level configuration, own measurement predicted by a formula, an ending the reader can act on. The title is its weakest element.
- doc-F: not distinguishable by quality from the best files. The strongest opening argument in the batch; held back by self-counting and an awkwardly ordered table.
- doc-D: not distinguishable by quality from the best files. Deepest of the accessible files and the clearest formulas; held back by a placeholder panel, a glossary cadence and scattered disclaimers.
- doc-B: not distinguishable by quality from the best files. Clean and consequential; its ending is buried under a navigation block.
- doc-C: not distinguishable by quality from the best files, at the lower edge. Heavy "our reading" bookkeeping and a self-describing opening are the only things that would let a reader place it below doc-G.
- doc-E: distinguishable: weaker. The first half is at the bar; the second half is a reference page, and the lead number is not like for like.


Key to the blind file names: doc-A silicon dive Roofline; doc-B this dive section 2; doc-C feedback dive What RL Does to a Model; doc-D this dive section 3; doc-E silicon dive KV Cache and FlashAttention; doc-F this dive section 1; doc-G feedback dive RLVR and GRPO.
