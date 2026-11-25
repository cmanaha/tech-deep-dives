# Adversarial review, batch w2r1, input X

Reviewer reading: blind, each file judged on its page. Technical points marked [reviewer inference] are my own reasoning, not something the page or a source states.

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A | 8 | 9 | 7 | 7 | 8 | not distinguishable by quality from the best files |
| doc-B | 5 | 6 | 5 | 6 | 5 | distinguishable: weaker |
| doc-C | 8 | 8 | 8 | 7 | 8 | not distinguishable by quality from the best files |
| doc-D | 8 | 9 | 8 | 8 | 9 | sets the bar |
| doc-E | 7 | 8 | 7 | 7 | 7 | distinguishable: weaker |

---

## doc-A: "10. Processing and Curating: When Video Decode Sets the Training Speed"

- Argument 8: the claim (CPU cores, not the GPU, run out first) is in sentence one, a worked number lands in paragraph two, and a formula carries it. But the page's own measured run contradicts its central worked comparison (finding 1).
- Depth 9: a step-rate ceiling with defined symbols, measured per-row rates, instance arithmetic down to physical cores, the engine matrix by card, curation budgets, three diagnostics and an ordered list of fixes. This is level 400.
- Clarity 7: terms are built at first use (vCPU, SMT, codec, GOP, dataloader, NVDEC, embedding, K-Means, cosine similarity). A newcomer is lost by the three-source splice and by the conflation of AV1 engines with the stock loader.
- Sentences 7: mostly consequential, but several are broken, several keep provenance in the prose, and there is one unparsed fragment.
- Parity 8: as dense and as argued as the best file. It is harder going and less exact in its logic.

Findings, most damaging first:

1. The page's own measurement refutes its central comparison. "LeRobot's hardware guide timed Diffusion Policy, the denoising policy of section 4, on four H100s at a batch of 32: 0.167 s per update, which is 6 steps per second." It then concludes: "At that scaling the four workers supply 59 x 2.1 / 32 = 3.9 to 59 x 2.5 / 32 = 4.6 steps per second, under the 6 the GPUs can train, and the cores set the pace." Later, about the same guide: "its runs, which wait on the GPU, show 0.011 to 0.015 s of data loading against updates of 0.167 to 2.548 s." So the measured run with the 0.167 s update spent about 0.01 s on data loading and was GPU-bound, while the splice says the cores bind. The page never reconciles the two. The page also asks the reader to "take the comparison as an order of magnitude", yet 3.9 to 4.6 against 6 is less than a factor of two, which an order-of-magnitude comparison cannot decide. [reviewer inference] On four GPUs each rank normally runs its own dataloader workers, so "four workers" against "four H100s" may compare one rank's supply with four ranks' demand. The page does not say whose batch of 32 it is. Fix: say that the splice predicts a CPU bound the measured run did not show, and use that gap as the reason to measure r on the instance. Drop "and the cores set the pace".
2. The thesis sentence draws its conclusion from the wrong fact. "LeRobot records AV1 (AOMedia Video 1), an open codec, by default, and the H100 has no engine that decodes AV1. So a LeRobot run is limited by the cores beside its GPU..." The "So" derives the CPU limit from the H100's missing AV1 engine. The paragraph has just said the stock loader "calls none of them", so the limit holds just as much on a B200 that does decode AV1. "Is limited" is also categorical, where finding 1 shows GPU-bound runs. The ending repeats the conflation: "decoding AV1 for a card that may have no engine for it." Fix: "a LeRobot run decodes on the cores beside its GPU, whatever the card".
3. The page's largest lever is never described. It gives "16.98 ms per row before its change to the loader and 4.95 ms after, 3.43x apart", then says "The pull request's edit to the loader, which lifts the ceiling to 25, then does what no faster GPU could." The page never says what the edit is or whether it is merged, so the reader can neither apply it nor wait for it. Fix: one clause on what the change does, and its status.
4. The codec fallback is never shown to work. "When the row says no, the choice goes back to the bench. LeRobot can also record H.264 or HEVC..." The table has only an AV1 column. Nothing on the page says that the H100's and A100's NVDEC engines decode H.264 or HEVC, and that is the fact that makes re-recording a fix. Fix: add an H.264/HEVC decode column or one sentence.
5. A comparison is made with no number. "It decodes through NVIDIA's PyNvVideoCodec library, which its design notes call measurably faster." Give the measurement or cut the clause.
6. Numbers are quoted and then dropped. "the worst case for the same step is 16 x 250 = 4,000 decodes" is never turned into time, so the reader cannot tell whether 4,000 decodes cost 0.4 s or 4 s. "about 195 seconds per hour of video per GPU in streaming mode" is never turned into a budget either (1,000 hours would be about 54 GPU-hours), which is the only reason to quote it.
7. Bookkeeping in the prose (owner's fault 5). "(the EC2 family named beside each card here is our pairing of that matrix with the EC2 tables)". "has no row in the matrix as fetched on 2026-11-20". The header description ends on a source list: "(LeRobot v0.7.0, Cosmos Curator v2.10.0, NVIDIA's support matrix and the EC2 instance tables, read 2026-11-20)". "section 9 gives the price: by LeRobot's docs, software H.264 files are about 30-50% larger than AV1" stacks a section pointer on top of an attribution. [reviewer inference] The H200 is the H100's silicon with more memory, so the page could say "expect the H100 answer, then confirm" instead of logging what it fetched.
8. A word changes meaning without warning. "32 captioning replicas delivered 7.1 rows per second against a capacity near 43." Earlier the page defined a row as "one control tick of one episode". Here a row is a captioning request. The switch is not flagged.
9. The page refers to context it never supplies. "LeRobot, the library that drives this arm" is the first mention of any arm. "You watch the 50 episodes and delete the failed ones": the only 50-episode set on the page is the pull request's benchmark dataset.
10. Broken sentences. "That flag is the 2.8x Hugging Face reports for ACT on an H100" (a flag is not a speedup). "A curation pass is short independent units of work" (singular against plural).
11. A sub-heading description lists contents. "What each curation stage loads, how many CPU and GPU workers one instance holds, and the recorded run where a slow feed left the GPUs idle" names three things in the block instead of stating the payoff.

---

## doc-B: "KV Cache and FlashAttention"

- Argument 5: paragraph one has an argument (KV memory caps the batch, and the batch sets decode's intensity), but it is compressed and borrowed from another section. The page then tours five topics and restates its thesis near the end as a recap list.
- Depth 6: the KV sizing arithmetic is exact and practical (config fields, FP8 KV, host_cache_size). FlashAttention, paging and quantisation get names and claims without mechanism, numbers or failure modes.
- Clarity 5: ridge point, decode, prefill, attention, query/key/value, linear attention, RoPE and softmax rescaling are all used without being built for the level 100 to 200 reader.
- Sentences 6: compact and numerate, but organised by run-in labels and list sentences, with one broken sentence and one wrong-looking expansion.
- Parity 5: next to the best files it reads as a reference sheet, not an argument.

Findings, most damaging first:

1. The headline number does not compare like with like. "Across current models it spans more than 300x, from 327,680 bytes for Llama 3.1 70B [...] to 890 bytes of global cache for DeepSeek-V4.1-Flash." Later: "DeepSeek-V4.1-Flash's 890 bytes cover its global cache; a separate sliding-window cache sits outside that figure." The table lists that model's KV as "FP4 ... main KV", while its note says "KV bytes assume BF16 entries unless noted". So the 368x compares a full BF16 cache with part of an FP4 cache, and the size of the part left out is never given. This is the section's strongest number, and it is inflated on two counts. Fix: give total per-token bytes including the window cache at a stated context length, or compare at equal precision.
2. The opening rests on concepts the page never builds. "Decode sits far below the ridge point (Roofline and Arithmetic Intensity): every generated token rereads the weights and the keys and values of every earlier token." "FlashAttention works on the other half of the ratio". Ridge point, decode and "the ratio" (FLOPs per byte) are undefined here, so the target reader is lost in sentence one. "Each layer's attention produces a key (K) and a value (V) vector per KV head for every token, and each new token attends to all the earlier ones" gives names with no intuition: it never says what keys and values are for, or why queries are not cached. Later terms arrive bare: "uses linear attention in the rest", "a 64-wide rotary position embedding (RoPE) key", "for prefill on Trn2".
3. FlashAttention is framed against decode, where its saving is small. The opening ties FlashAttention to decode's byte problem. The mechanism the page gives, "writes the score matrix to HBM between them because it is too large to keep on chip", is a prefill and training cost. [reviewer inference] In decode there is one query row per step, so the score matrix is tiny and the bytes are the KV reads, which fusion does not reduce. The page never says which phase FlashAttention pays in.
4. The FlashAttention block has no core mechanism and no number. It omits the running-softmax rescaling that lets a tiled kernel work without the full row, so "FlashAttention-4 answers with software-emulated exponentials and conditional softmax rescaling" is opaque. It gives no score-matrix size and no speedup. "Pick the generation by GPU." lists three generations that all support Hopper and then picks none.
5. The page is built like a reference manual (owner's faults 2, 3 and 6). Run-in labels organise it: "What it stores.", "How big it gets.", "What fits on one GPU.", "What FlashAttention does.". It defines the attention variants one after another. Trivia sits at the same weight as the sizing rule: "Kimi K2 keeps the same 512-wide latent." "It ships as betas; fa4-v4.0.0.beta35 came out on 2026-10-14." The thesis surfaces late as a recap: "Every technique on this page raises that cap: fewer KV heads (GQA), a compressed latent (MLA), sliding windows and linear-attention layers, fewer bits per entry, and paging."
6. The prose talks about the page, and the page ends on pointers. "Read the table as the formula at work." "every lever on this page raises the batch it can hold". "Disaggregated Serving and Speculative Decoding covers moving these blocks from prefill to decode." The last sentence is a reading list: "Flash as a Cache Tier for Inference sizes host DRAM ... and the KV Offloading and LMCache section of the vLLM Inference Engine dive covers the software that moves it." It does not end on the reader's next action.
7. One data point becomes "usually", against the page's own numbers. "On a single GPU, the weights usually take most of the HBM: serving a 13B model on a 40 GB A100, the vLLM authors measured about 65%..." The previous paragraph showed a single H200 where the batch's 85.9 GB of KV exceeds the 70.6 GB of FP8 weights. "Across an eight-GPU node the balance flips" stops before the decision: about 1,057 GB holds roughly 390 BF16 8K requests [reviewer arithmetic].
8. Failure modes are missing. The page never says what FP8 or FP4 KV costs in quality, or what a paged server does when the block pool runs out. "which brings the waste near zero" gives no figure.
9. Some sentences are broken or vague. "fewer cross HBM per FLOP" is missing a noun. "FlashAttention-4 is written in CuTe DSL (NVIDIA Compilers and Kernel Tooling)" reads as an expansion of CuTe DSL and is not one. "and NVFP4 KV is also listed" does not say listed where, or how to switch it on. "kv_lora_rank" in the config list is never tied to the 512-wide latent.
10. The title "KV Cache and FlashAttention" is a topic label. The callout "FlashAttention keeps the FLOPs and cuts the bytes" repeats the h2 description ("Same FLOPs, fewer HBM bytes") as a takeaway box.

---

## doc-C: "9. Collecting Data: What an Episode Weighs and What It Costs to Record"

- Argument 8: by paragraph two it argues that compression is paid for twice, once at the bench and on every read, with a worked ratio, and it carries that argument to the record command.
- Depth 8: file layout, the seek arithmetic, defaults with their reasons, two conflicting sources reconciled, a pixel-rate load, and a failure table with a check for each failure. The core trade is priced on one side only.
- Clarity 8: terms are built in reading order, and the encoder's second meaning is flagged at the switch. MuJoCo and Parquet get little explanation.
- Sentences 7: sentences are clean and specific, but numbers repeat and bookkeeping clauses remain.
- Parity 8: it argues and quantifies as well as the best file. It carries more padding.

Findings, most damaging first:

1. The page pads by repeating the cheap side. The 775 MB against 199 GB comparison appears in paragraph two, in the figure caption, and again in "Scaled to an hour, the video is about 387 MB per camera-hour, 775 MB for the two cameras, where the raw frames would be 199 GB." The 3,588 bytes per frame is derived twice ("Divided over 11,939 x 2 camera frames, that is the 3,588 bytes per stored frame behind the 257 to 1."). The non-constraint is concluded four times: "storage will not limit a bench", "The disk takes under 1 GB per hour", "Storage needs no plan at this scale" and the final paragraph. A whole sub-section proves the side the page itself calls cheap. Fix: fold the storage block into the opening and keep one figure.
2. The trade the section is about is priced on one side only. "More keyframes make a larger file and a cheaper random read. With disk the cheap side of a bench, a small g spends bytes to save the trainer's cores." The page gives no file-size ratio between GOP 2 and a long GOP, and no decode time per frame. "Leave g at 2" therefore rests on an unquantified trade.
3. Bookkeeping in the prose (owner's fault 5). "about 257 to 1, by our arithmetic from the file sizes" (a citation marker then says the same thing). "(our reading of its tables)". "No CPU-utilisation figure for the 640x480 row was located in the sources read on 2026-11-20". "The repository is nine files, and the table lists the seven under videos/, data/ and meta/." The header description ends "(LeRobot v0.7.0 and one public dataset, read 2026-11-20)".
4. Trivia sits at full weight. "Its name says SO-101 and its metadata records the robot type as so100_follower; LeRobot drives both arms with one follower class." The "for reference" block includes "when a directory holds its 1,000th file, the file number returns to 0 and the chunk number goes up by one". The v2.1 refusal message in the same block is practical. The chunk rollover is not.
5. Attribution stands in for a reason. "The number of files therefore follows the bytes and ignores the episode count, which is how LeRobot's docs say the format scales to millions of episodes." The page never says why few large files scale better than many small ones.
6. A failure mode stops before the model. "A recording loop that really ran at 25 Hz therefore still produces a dataset that claims 30, and its motion plays back faster than it happened." The page never says what this does to a policy trained on the data, and the failure table repeats only the symptom.
7. Prose points at the next section instead of ending. "Section 10, Processing and Curating, starts from that answer: which CPU cores and which GPU video engines decode each codec, and how many frames a second a training job needs from them." closes a sub-section on a preview. Also "(section 10 counts that bill)".
8. A caption is garbled. "One episode as a video file holds it: frames in time order, six of them shown." The sentence does not parse. The stills are simulator renders, but the caption says only "Capture: MuJoCo 4.0.1, offscreen renderer". MuJoCo is never explained, so a reader can take the stills for frames of the public dataset.
9. Numbers that would test the page's own warning are left unworked. "occupies 16.0 TB" for a 2,000-hour release is about 8 GB per hour, roughly ten times the 775 MB two-camera figure [reviewer arithmetic]. Working it would show that 387 MB per camera-hour does not transfer, which is exactly the page's caution. UMI's "117 per person-hour" is never set against the bench's 30 per person-hour (50 episodes in 100 minutes).
10. A heading overclaims. "387 MB per camera-hour, measured on one dataset": the figure is derived from file sizes, not measured.
11. A connective fails. In "So after the first episode, read the achieved rate and look for missing frames." the "So" follows a sentence about storage, which it does not follow from. The two closing paragraphs partly recap.

---

## doc-D: "3. The Robot as a Computer: Inputs, Outputs and a Deadline"

- Argument 8: a claim and a number arrive in paragraph one ("Lateness on a robot is a distance"), are carried to a budget, and end on the reader's action. But the budget's core assumption is never stated, and the page's own chunking section contradicts it (finding 1).
- Depth 9: servo internals, PID gains and what I = 0 does, the encoder step and gear backlash expressed at the gripper, a real loop timing report, the macOS/Windows busy-wait, the rate ladder, and sourced inference latencies. Level 400 throughout.
- Clarity 8: intuition comes before every formula, symbols are defined before use, and worked numbers are redoable. VLA is defined late, and "Figure" (the company) is ambiguous.
- Sentences 8: the best sentences in the batch ("a latency figure for a robot is half a number until a speed stands beside it"). One section collects most of the bookkeeping clauses.
- Parity 9: the strongest file here.

Findings, most damaging first:

1. The central model overreaches, and the page's own chunk playback contradicts it. "Lateness on a robot is a distance: at an illustrative 0.25 m/s, 100 ms of delay is 25 mm of travel on stale orders". "Say the block must arrive within 10 mm of the centre of the cup. At 0.25 m/s the budget is ... 40 ms". "Against the 40 ms budget that is more than three times over". These treat every millimetre travelled during the delay as placement error. [reviewer inference] That holds only when something moved, or when the action is relative to the current pose. With a static block and absolute targets, a late target arrives late, not wrong. The page's own rate ladder plays a 50-action chunk open loop for "50 / 30 = 1.67 s". Under d = v x tau that would be about 417 mm of stale travel, yet the page says chunking works. The deadline section ends in the same muddle: "What remains is the distance: the arm has travelled for the whole of the delay by the time the first action of a new chunk is played." Fix: say the budget is the reaction time to a change (a slip, or a moved block), and reconcile it with chunk playback in one paragraph.
2. A placeholder is left on the page. "Capture slot, dated 2026-11-20" and "What will be shown here: Camera footage of the real leader and follower at the bench." This is an unfinished artefact in front of the reader, which is exactly the owner's "did not have a proper read".
3. Bookkeeping, nearly the owner's own example of fault 5. "The chain that has to fit in that budget is a sum of four waits (the split into four is ours)." "Each term has a cited size on this arm." The table cell reads "rate not stated in the documents read". Others: "the sources read on 2026-11-20 give a figure for none of them", "an example on hardware the page does not state", and "By their names and the mounts the hardware repository ships, one rides on the arm". The header description ends on a source list with a read date.
4. The chunk check pairs figures from different models. "A 50-action chunk at 30 Hz lasts 1,667 ms, and a 149 ms call, NVIDIA's Jetson Orin figure for GR00T N1.7, uses 4.5 ticks of it." Yet "NVIDIA's benchmark of one complete call to it, returning 40 actions". The 50-action chunk belongs to SmolVLA and pi0.5, while the latency is GR00T's, whose call returns 40 actions (1.33 s).
5. Terms are used before they are built. GR00T N1.7 carries the opening and the latency budget ("its GR00T N1.7 robot model"), but "GR00T N1.7 is a vision-language-action model (VLA)" arrives only in the last section. "Figure's last published rates, for its Helix 02 humanoid model" never introduces Figure the company, and on a page full of figures the possessive reads as a self-reference. SmolVLA and pi0.5 are named without a gloss. "Robotics calls the first a planner" is followed by a table whose "Planner" rung means something narrower.
6. The list of moves misses one the page itself describes. "A chain slower than its budget leaves two moves: slow the arm, or shorten the chain." Two paragraphs later RTC computes the next chunk while the current one plays, a third move (hide the delay).
7. A reference block lists facts without consequences. "The datasheet lists four triggers for it: 2 s blocked at more than 80% of stall torque, 2 s drawing more than 2 A, a supply outside 4 V to 7.4 V, and a temperature over 70 degrees C." The page never says what the servo does when a trigger fires, or what a policy pressing on the table for 2 s will see. The gripper's 50% torque cap is never tied to grip force.
8. A doc-versus-code conflict is raised with no consequence. "The code divides by 4095, the encoder resolution minus one, where the datasheet gives the step as 360 / 4096." The difference is 0.02%. Say it does not matter, or drop it.
9. Trivia. "Its newer Helix 2.5, posted 2026-09-17, states none."
10. The prose points at itself. "is the 1,440 bytes per second of the opening". "so the middle line, a tenth of a second at this pace, spends most of that margin". "Section 17, Running on the Robot, covers how a new chunk is joined to the one being played."
11. Small logic and practice gaps. "The other, the follower, makes the same move a moment later, so it is the follower that has to pick up a block": the "so" does not follow. "Check which scale a downloaded SO-101 dataset or checkpoint uses before mixing it with your own recordings" does not say which file or field to read.

---

## doc-E: "11. Augmentation and Synthetic Data: What Each Method Adds and the Machine It Needs"

- Argument 7: the claim is in sentence one ("Extra training data helps a policy only when it carries the variety the policy lacks") and the page ends on a decision ladder. But its organising idea is a three-way taxonomy that its own numbers leak (findings 1 and 2), and the title is phrased as a taxonomy.
- Depth 8: yield arithmetic, cameras as a multiplier, the latent-grid cell count, NIM memory floors set against measured peaks, and memory sources graded. The page lacks which GPUs render, the sim-to-real risk, and the knobs on generation time.
- Clarity 7: terms are mostly built at first use. Some referents are ambiguous ("both", "the page"), and the jump from real recordings to sim-recorded demos goes unstated.
- Sentences 7: many sentences are specific and consequential. Bookkeeping, a list of eight names and some awkward arithmetic phrasing pull it down.
- Parity 7: same voice and toolkit as the best files, one step down in rigour and shape.

Findings, most damaging first:

1. The page's own evidence contradicts its organising claim. "No part of the machine appears twice in the third column, so capacity left over from one method buys nothing for the next." Yet the page also reports "786.37 s on an RTX PRO 6000 Blackwell, the card that ran the simulated replays": the same card does both jobs, at 3.8x the H100's time, a gap the page never explains. Transforms on the GPU backend run on the training GPU. The figure caption concedes "(these scenes also vary colour and light)", which means simulation also varies the look. "If it fails when the room looks different, budget minutes of an 80 GB class GPU per clip" therefore skips the cheaper path the page's own figure shows.
2. The ends of the cost ladder use numbers the page itself rules out. Low end: "about 1 to 36 GPU-seconds for a simulated episode", repeated in the ending as "at about 1 to 36 GPU-seconds per demonstration". The 1.1 s comes from the humanoid run, which the page implies saved no camera images. The page's own rule says "Data saved without images cannot train a policy that reads cameras, so the hour is the figure for a policy like this arm's", and also "a figure from another task cannot size yours". High end: "about 20 GPU-minutes for an episode invented by a video model" is DreamGen on L40s. The page's own current Cosmos3-Nano figures are 207.78 s per clip at 720p and 59.83 s at 480p on an H100. The ladder also mixes units: "milliseconds of CPU for a transformed image" is per image, the others per episode.
3. An estimate is given with no basis and a hedge wider than the research. "milliseconds of CPU for a transformed image (an estimate; no figure is published)". "No figure is published" is a claim about the world. The research can support only "no figure was found". No derivation of "milliseconds" appears, and the same page reports that moving transforms off the CPU made ACT training 2.8x faster.
4. The page promises "the machine it needs" and defers the answer where it matters most. "Section 13, Rendering and Ray Tracing, says which cards render." "Simulated replay needs a GPU that simulates, and with cameras on one that renders". The blueprint quote "due to differing hardware requirements" stands in for the reason. A reader choosing a card for camera-rendered replay cannot decide from this page.
5. The baseline alternative is missing. The opening scenario has "a handful of block positions". The first fix for a policy that fails at new positions, recording more real episodes there, never appears in the ladder. The ladder sends the reader to build a simulator scene and then cross sim-to-real instead.
6. The method's main risk gets a pointer while a detail gets a paragraph. "What comes out is simulated images and simulated contact, and a policy trained on them still has to cross to the real arm (section 14, Sim-to-Real and Real-to-Sim)." That is one clause on the sim-to-real gap, against a full paragraph on SkillGen memory per environment. "You record a few demonstrations by driving the arm inside the simulator" passes without its consequence: the reader's real recordings cannot seed Mimic.
7. Bookkeeping (owner's fault 5). "The last two are our arithmetic from totals published by NVIDIA and by the authors of the DreamGen recipe." "No published generation time for the SO-101 task was located in this research." The header description ends on a source list with a read date.
8. References point at the layout or at nothing. "No part of the machine appears twice in the third column" points at the layout. In "Leave room above those floors: the page says to treat them as minimums", "the page" means NVIDIA's matrix but reads as this page. In "The second method, demonstration multiplication, needs both." "both" has no clear referent. The heading "Only the simulator checks what it makes" does not match its description, which is about diagnosing missing variety.
9. A configuration lever is missing. The page says "each pass of the model covers all of them" but never gives the number of passes per clip, so the reader cannot tell whether generation time is a setting.
10. The closing table acts as a summary box. "The failure picks the method, and the method picks the machine" restates the method-by-attribute grid already given in paragraph two and in the opening figure.
11. Listing and primer register. "Version 0.7.0 adds eight that imitate what real robot cameras do: Gaussian noise, motion blur, JPEG compression, a bright patch, a random shadow, dropped rectangles, a gamma change and a shift in colour temperature." This gives eight names and no guidance on when to enable which. "With a factor of 1.1 (an illustrative draw) the overhead frame ... arrives a tenth brighter on one pass" is toy arithmetic that adds nothing. "81,000 / 240,000 of an hour is about 20 GPU-minutes per trajectory" is clumsily phrased.

---

## Batch answer

Groups by quality alone:

- Group 1: D, A, C. All three argue from the first sentence, work a number by paragraph two, go down to mechanism and configuration, and end on the reader's next action. D leads on sentence quality and the density of consequence. A matches D's depth but is harder going and contradicts itself in its central comparison. C is as clear as D but pads the cheap side of its own trade.
- Group 2: E. It has the same voice and toolkit, but the page is built as a three-way taxonomy (method, variety, machine) that its own numbers leak, it defers the hardware answer it promises, and it closes on a summary grid.
- Group 3: B. A compact, numerically exact reference sheet: a topic title, run-in labels, variants and kernel generations defined one after another, concepts borrowed from other sections and never built, a headline ratio that is not like for like, and an ending on pointers.

Would a careful reader tell them apart by quality alone? Yes. B separates clearly from the rest by register and ramp: it tours and assumes, where the others argue and build. E separates from A, C and D more narrowly, by its taxonomy shape and the contradictions in its organising claim. A, C and D cannot be ranked apart by quality: their faults are of the same size and kind.

A careful reader would also spot one family of tics in A, C, D and E that B lacks:
- Every header description ends on a source list with "read 2026-11-20".
- Provenance clauses sit inside sentences ("(the split into four is ours)", "by our arithmetic", "was located in this research").
- Section pointers carry the prose forward.

This is the owner's fault 5, and it is the clearest remaining mark of weaker writing in the otherwise stronger files. Two notes at dive level, not scored per page: A and E share a near-verbatim sentence on the 2.8x claim, and A and C both re-explain keyframes with the same GOP-250 illustration.

Verdicts:
- doc-A: not distinguishable by quality from the best files. It has D's depth and argument; it is held back by one internal contradiction and harder going.
- doc-B: distinguishable: weaker. It is a reference sheet that tours, its opening assumes concepts it never builds, and its headline number is not like for like.
- doc-C: not distinguishable by quality from the best files. It is argued and clear, and its faults are padding and bookkeeping, not structure.
- doc-D: sets the bar. It has the strongest sentences and the deepest mechanism, and every number is worked to a consequence. Its gaps are an unstated assumption in the latency budget and a leftover placeholder.
- doc-E: distinguishable: weaker. It is a taxonomy with leaks, its ladder ends use numbers the page itself rules out, and it defers the hardware answer it promises.


Key to the blind file names: doc-A this dive section 10; doc-B silicon dive KV cache; doc-C this dive section 9; doc-D this dive section 3 (published pilot); doc-E this dive section 11
