# Adversarial review, batch w2r3 / inY

## Scores

| file | argument | depth | clarity | sentences | parity | verdict |
|---|---|---|---|---|---|---|
| doc-A.txt | 8 | 9 | 7 | 7 | 8 | sets the bar |
| doc-B.txt | 8 | 9 | 6 | 7 | 8 | not distinguishable by quality from the best files |
| doc-C.txt | 7 | 7 | 5 | 7 | 7 | distinguishable: weaker |

---

## doc-A.txt: "13. Rendering and Ray Tracing: Why Simulated Cameras Pick the GPU"

Scores
- argument 8: the claim is on the first screen (the renderer can rule out the GPU the training job wants), the camera's cost is worked by paragraph 3, every heading is a claim, and it ends on a sizing procedure. The middle section ("The RT-core rule follows the renderer") drifts.
- depth 9: BVH mechanism, the RT-core unit, ray counts from a formula, memory per environment across four orders of magnitude, the out-of-memory failure, a renderer-to-family map and a measurement recipe.
- clarity 7: ray tracing, RT cores, environments and the BVH are built from zero with a diagram. The reader is lost at the fixed-part ceiling/floor argument and at a few names never built (USD-Camera, PhysX, RTX as a brand).
- sentences 7: most sentences carry a consequence. A visible figure placeholder, research-process asides and some long subtraction chains pull it down.
- parity 8: the best file in this batch, with one embarrassing unfinished element.

Findings, most damaging first
1. "Capture slot, dated 2026-11-20" / "What will be shown here: The same SO-101 scene ray traced by Isaac Sim, captured on our own machines." An unfinished promise printed on the page. It also guts the figure above it: the rasterised capture ("colour, depth and segmentation") exists to be set against a ray-traced one, and without the second half the reader gets depth and segmentation images the prose never uses. This is the single thing that reads as "did not have a proper read". Fill the slot or remove both the slot and the depth/segmentation framing.
2. "Dividing the card by the average per environment charges the fixed part in proportion to the count. Where the card holds less than the run used, as with Cartpole's 57.3 GB, that charges too little of the fixed part and the estimate is a ceiling. Where it holds more, as with the Kuka task's 13.6 GB, it charges too much and the estimate is a floor." The reasoning is correct, but it is abstract algebra in words; a level 100 to 200 reader cannot check it. It also follows "G7's GPU, sold as 32 GB, holds about 32 GB / 7.0 MB = 4,600 Cartpole environments and 32 GB / 1.7 MB = 19,000 of the Kuka task", so the reader is handed two numbers and then told they are a ceiling and a floor. Either show a toy case (fixed part F, cost c per environment) or drop the division and go straight to the two-run method the ending already gives.
3. The section "The RT-core rule follows the renderer" runs nine blocks at equal weight: the Isaac Sim exception, the Isaac Lab install guide, three renderers, physics pairings, domain randomisation, a 12-of-12 Franka result, renderer speed ordering, the P-family test run, then an expandable. "What that fidelity is worth depends on how the policy is meant to cross to real cameras" opens a sim-to-real detour inside a section whose job is the hardware rule. The fact that decides a configuration (Newton plus Newton Warp leaves P open; Isaac Sim never does) is buried among facts that do not.
4. "The small-camera range is too wide to size a card from, and the pixels do not account for it." The paragraph then spends six sentences of subtraction (12 KB, 7.2 GB, 6.4 GB, 0.78 MB, 2.25 times, 56.4 GB, 9 times) to land on "so where the rest of the megabytes sit is not published." A long proof that ends in an unknown. Keep the one fact that matters (the camera adds about 60 times the frame's bytes per environment, so pixels do not predict memory) and cut the rest.
5. "it records a render time of 756 per world per frame. Taking that as nanoseconds, the unit its physics rows imply, one batch of images takes 8192 x 756 ns = 6.2 ms." The section heading promises to "put a time on them from a published benchmark", and the only time rests on a guessed unit; the 465 ms that follows is an extrapolation of the guess. Honest, but weak ground for the section's headline time. Find the unit or say plainly the time is an estimate before giving it.
6. Bookkeeping in the prose: "By our reading of the renderers' documentation, the renderers of Isaac Sim, Isaac Lab and MuJoCo fall into three groups by where the BVH walk runs." (process aside plus a taxonomy opener; "Where the BVH walk runs sorts the renderers into three groups" says the same); "No vendor sentence naming the A100, H100 or B200 as supported for a Warp renderer was located in this research" (narrates the research; "No vendor document names..." keeps the hedge); the table column "EC2 family (our mapping)".
7. Names used and never built: "the USD-Camera, their highest-fidelity camera type" (USD never expanded or explained, and the reader cannot tell why it costs 2 GB); "OvPhysX (PhysX as a standalone library) or with Isaac Sim's PhysX" (PhysX never said to be a physics engine); "a card with RTX in its name running a renderer that is not an RTX renderer" depends on RTX being NVIDIA's name for its RT-core line, which the page never says.
8. The GPU-units diagram carries "Video encode engines (NVENC)" and "Video decode engines (NVDEC)", both "not used by this workload", and the prose never mentions either. Two of five rows are noise on this page.
9. Header description: "Tell from the renderer a simulator uses whether its cameras can run on a training GPU ... (Isaac Sim 6.2.0, Isaac Lab 3.0 and MuJoCo 4.0.1, sources read 2026-11-20)". "A training GPU" is vague (the section means a P-family data-centre GPU without RT cores), and the version and date parenthetical is provenance in the payoff line.
10. "The documented rule reaches as far as Isaac Sim and RTX rendering" is vague; it means the rule applies only there. Say "applies only to".
11. "Count the rays a training step sends from four settings": "four settings" means nothing until the formula two blocks later. Name them (environments, cameras, width, height).

---

## doc-B.txt: "11. Augmentation and Synthetic Data: Match the Method to the Failure and the GPU to the Method"

Scores
- argument 8: the thesis is the first sentence ("how the policy fails picks the method, and the method picks the part of the machine that runs out first"), the decisive G7e finding is in paragraph 2, every heading is a claim, and it ends on an ordered spend plan.
- depth 9: the mechanism of each method, flags and defaults, yield economics worked to GPU-seconds, why attention makes resolution cost more than its pixel count, NIM memory floors, a share-or-split rule.
- clarity 6: nearly every term gets a clause at first use, but "replay" is used before it is explained, and the generation-cost blocks run eight benchmark timings past the reader, one of them never introduced. Several referents are ambiguous.
- sentences 7: many sharp consequence sentences ("a generator writes that clip to disk like any other"); several convoluted ones and some bookkeeping.
- parity 8: same class as A, harder going.

Findings, most damaging first
1. "A policy that misses the block in a new place needs new positions, and replay in a simulator makes them on a GPU that renders" and "Replay whose cameras are drawn in Isaac Sim, NVIDIA's simulator, needs RT cores". Replay is the second method and the subject of the opening argument, but the reader does not learn what is replayed or how until "Isaac Lab Mimic is the replay tool" several blocks later. One clause at first use fixes it: a recorded demonstration re-run in a simulator with the block moved, kept only if physics says it succeeded.
2. "Repainting the illustrative 50 clips takes 50 x 489.90 s = 6.8 GPU-hours on it against 2.1 on the H100". 489.90 s (the RTX PRO 6000's 480p transfer time) appears here for the first time, inside a multiplication. The surrounding blocks ask the reader to hold 59.83, 180.81, 207.78, 786.37, 148.65, 489.90, 217.90 and 132.06 s across text-to-video and transfer, PyTorch and Diffusers. Put the four transfer times that drive the decision in one small table and argue from it.
3. "or 3.6 / 0.4 = 9 per kept one if the 1,000 count tries at 40% yield, which NVIDIA's command (--generation_num_trials 1000) leaves open." The reader cannot tell which number to carry (3.6 or 9), and the flag name half-answers the question the sentence leaves open. State the two readings and say which one to budget with.
4. "Past it, a second card is needed, and the per-clip times set which. ... whenever its hourly price is under 3.3 times the single-GPU G7e's, or 1.65 times on the Diffusers rows; charge each whole instance for the hours it runs, at dated prices for your Region and purchase option." The section's decision is left as an inequality with no price, so the reader does not learn which side of 3.3x today's p5.4xlarge and g7e.8xlarge prices fall. Below 400 at the exact point the section was building to. One dated On-Demand price pair would close it.
5. "Time grows with the grid the model fills in and with the number of passes over it: 35 in the model card's examples, a figure to confirm on the card (section 6, World Models)." "Card" means GPU everywhere else on the page; here it means model card, inside a sentence about GPU time. "A figure to confirm" is hedge bookkeeping.
6. "With 10 and 13 real demonstrations per task plus 40 and 50 generated ones, its authors report average success on two SO-100 tasks rising from 21% to 45.5%." A "respectively" construction without the word; the reader must pair 10 with 40 and 13 with 50 and then learn the 21% to 45.5% is an average over both. Split it or give one task.
7. Diagram and caption: "an estimate, not a published figure: milliseconds per image" (whose estimate, from what? it sits on a log chart of published figures with no derivation on the page) and "row 3 has none because no clip was generated" / "Outlines only: no clip was generated." The caption narrates what the authors did not do.
8. The RT-core rule is explained twice: paragraph 2 ("Replay whose cameras are drawn in Isaac Sim ... needs RT cores") and again in full ("Rendering also limits which GPUs qualify. Isaac Sim draws its cameras with a ray tracer, which follows a ray from each pixel into the scene; the RT cores do the costliest step"), followed by "On AWS that puts replay in Isaac Sim on a G-family instance", the table row and the closing section. Repeating the strongest number is a virtue; re-explaining the mechanism is padding.
9. "for a nut-pouring task with cameras, about 10 hours per 1,000 on the same card." The previous clause contrasted the RTX 6000 Ada with the RTX PRO 6000 Blackwell; "the same card" could be either, and the 33x range that follows depends on it.
10. "One 720p clip of under 8 seconds occupies a data-centre GPU for minutes." is a strong topic sentence, but its paragraph then lists model sizes ("comes in 4, 16 and 64 billion parameters (Edge, Nano and Super)"). The proof arrives in the next block. Move the size line after the timing.
11. "By our reading the gain comes from freeing the workers, so expect it when GPU utilisation in nvidia-smi ... sits well below full" is a process aside; the inference can be stated plainly once.
12. "Nothing is written to disk: the dataset keeps the raw frames" then "the same dataloader workers that decode the video". Raw frames and decoded video read as two different storage formats; the reader is not told the frames are stored as video.
13. "Enabled, each frame gets up to 3 transforms drawn from six, all mild by default: brightness and contrast (factors of 0.8 to 1.2), saturation and sharpness (0.5 to 1.5), hue ... and a small move ..." A parameter list at equal weight; only the 5-degree rotation limit is used later. Reference-manual register in an otherwise argued section.
14. Title and header: "Match the Method to the Failure and the GPU to the Method" is a slogan's chiasmus, and the header description repeats it ("Match the method to how the policy fails, and the method sets the GPU") before the useful G7e fact, then closes on a version and date parenthetical.
15. "The engine moves that gap." "Engine" has meant physics engine in this dive; here it means inference library, introduced one clause later. Say "The inference library moves that gap."

---

## doc-C.txt: "Roofline and Arithmetic Intensity"

Scores
- argument 7: a real thesis (precision moves the ridge more than a chip generation does), proved by a table, but the prose opens on provenance and a glossary, and the thesis sentence arrives after the ridge table, about two-thirds down.
- depth 7: ridge arithmetic across eight chips, a usable batch-1 decode ceiling (69 tokens/s), the Rubin regime change and the Trainium3 FP4 quirk. The fusion lever has no number and the model's own failure modes are absent.
- clarity 5: decode, prefill and batch are used before they are built, the roof formula itself is never stated, and the serving and fusion blocks are runs of name-only acronyms and techniques. The level 100 to 200 reader needs outside knowledge of LLM inference.
- sentences 7: crisp, confident and short; but name-drop lists, four section-pointer sentences, and it ends on a pointer.
- parity 7: competent, a notch below A and B for this reader.

Findings, most damaging first
1. "Decode at batch 1 sits about 200 times below the ridge at either precision." (and the figure labels "Decode, batch 1, FP8 weights", "Prefill, 4k-token prompt"). Decode, prefill and batch are used on the first screen; the section that says what they are comes next. A term used before it is built, at the point the page first applies its tool.
2. The roofline is never stated. "The ridge point is peak FLOPS divided by peak bandwidth. Below the ridge a workload is memory-bound and extra FLOPS do nothing for it" gives the ridge, but not the roof: attainable FLOPS = min(peak FLOPS, intensity x bandwidth). The figure's "Attainable TFLOPS" axis and "HBM3e slope: 4.8 TB/s" are left for the reader to decode, and a reader new to log-log plots will not know why bandwidth is a slope. Intuition, formula, decomposition is missing for the central model of the page.
3. "Second, GQA (grouped-query attention), KV-cache quantization, FlashAttention-class fusion and speculative decoding speed up decode by cutting the bytes moved per useful FLOP." Four techniques named in one sentence, none explained; the KV cache itself was only expanded ("to fill the KV (key-value) cache"), never said to be the stored attention state that grows with context. Same pattern: "BF16 (bfloat16)", "H200 SXM", "Tensor Core", "continuous batching", "the 2:4 structured pattern". Expansion as a name, not an explanation.
4. The fusion lever: "One kernel for several operators keeps intermediate tensors in SMEM (shared memory), TMEM (Tensor Memory) or SBUF (State Buffer) instead of HBM." then "The current kernels are FlashAttention-3 on Hopper ... and FlashAttention-4, in beta, on Blackwell." then "CUTLASS, CuTe and Triton on NVIDIA and NKI (Neuron Kernel Interface) on Trainium emit fused kernels". Three sentences of names and version trivia and no number: the reader never learns how far fusion moves intensity, which is the lever's whole point. Reference-manual weight next to the batching lever, which does get a number (ridge near 200 sequences).
5. Pointer prose, ending included: "Cerebras Wafer-Scale, Groq, SambaNova and Dataflow and Compute-in-Memory cover each." (a run of section titles that parses as a garbled list), "KV Cache and FlashAttention walks that trade-off, and Flash as a Cache Tier for Inference covers a KV cache that outgrows HBM.", "NVIDIA Compilers and Kernel Tooling and AWS Compilers and Kernel Tooling cover them.", and the last sentence of the page, "Quantization and Precision covers the full ladder and the numerics that make FP8 and FP4 usable at model scale." The page talks about other pages and closes on a pointer rather than on the reader's action, which sits one sentence earlier.
6. "dense" carries two meanings with no signal at the switch: "dense Tensor Core peaks" (the non-sparse rate, explained only in an expandable at the end) and "A dense model does about 2 FLOP per parameter per token" (all parameters active, as opposed to mixture-of-experts, which the page never mentions; "active parameter bytes" hints at it).
7. Opening: "The roofline model, published by Williams, Waterman and Patterson in Communications of the ACM in April 2009, ... It still works seventeen years on because it reduces that question to a ratio of two figures every vendor publishes." then "Three quantities." Provenance first, then a fragment introducing a glossary paragraph. The header carries the argument; the body opens on a definition, the owner's fault 1.
8. "Tokens per second tracks HBM bandwidth almost linearly until another limit binds." Which limit? Compute at large batch, KV-cache capacity, communication across GPUs, kernel-launch overhead: the model's failure modes are the level 400 content and the sentence waves at them.
9. "A precision step on one chip moves it 2x on H200 (206 to 412) and almost 9x on Rubin (182 at BF16 to 1,591 at NVFP4)." The 9x is two precision steps set against the claim about one step; one step on Rubin is 4.4x (182 to 795), which still proves the thesis. The inflation is unnecessary and a careful reader will catch it.
10. "Faster HBM pulls the ridge left." A bald claim with the number on the page unused (H100 to H200 at BF16, 295 to 206), followed by a list of architectures.
11. "That is why vLLM (including vLLM Neuron on Trainium), TensorRT-LLM and SGLang spend so much code on continuous batching." A name-drop that explains nothing; what continuous batching does is never said.
12. Title: "Roofline and Arithmetic Intensity" is a topic label. The header description carries the claim the title could.
13. In the expandable, "The tables use the individual-GPU figures because FLOPS and bandwidth there come from one table." is method bookkeeping; acceptable where it is demoted, but the useful instruction ("Compute the ridge from the system you are buying") could stand alone.

---

## Batch answer

Groups by quality alone
- Group 1: doc-A and doc-B. Both argue from the first sentence and land a worked number by paragraph 2 or 3; every heading is a claim; nearly every term gets a plain clause at first use; each lever is worked to a number (rays per step, MB per environment, GPU-seconds per kept demonstration, GPU-hours per 50 clips); failure modes are named (out-of-memory camera type, simulator parameters that are wrong, generated clips nothing checks); both end on a procedure the reader can run. Their shared faults are weight, not sloppiness: long arithmetic chains, hedges and "our reading" asides, version parentheticals in the header descriptions. B is the harder read (replay used before it is built, eight timings to track, ambiguous "card" and "same card"); A has the one visibly unfinished element (the "What will be shown here" capture slot).
- Group 2: doc-C. Tighter, more fluent and more confident than either, and its core table-plus-thesis is as strong as anything in A or B. It falls below them on the reader in the brief: decode and prefill are used before they are built, the roof formula is never written, the serving and fusion blocks are runs of named techniques and acronyms with no mechanism and no number, and it talks about other pages four times, ending on a pointer. It also opens on provenance and a glossary rather than on its argument.

Would a careful reader tell them apart by quality alone? Yes, but the gap is about one point, not a class gap, and it runs one way: doc-C is the file that stands apart, because the level 100 to 200 reader gets lost in it and its depth tapers in the last third. doc-A and doc-B are not separable from each other by quality; they read as one standard.

Verdicts
- doc-A: sets the bar. Argued opening, concepts built before use, mechanism to measurement, ends on a sizing method. Fix the capture placeholder and the ceiling/floor paragraph.
- doc-B: not distinguishable by quality from the best files. Same argument and depth as A; clarity a point lower from number overload and ambiguous referents.
- doc-C: distinguishable: weaker. Clear thesis and clean prose, but it assumes LLM-inference knowledge the reader lacks, omits the central formula, and replaces its last lever with name lists and section pointers.


Key to the blind file names: doc-A this dive section 13 (passed round 2, bar); doc-B this dive section 11 (round 3); doc-C silicon dive Roofline
