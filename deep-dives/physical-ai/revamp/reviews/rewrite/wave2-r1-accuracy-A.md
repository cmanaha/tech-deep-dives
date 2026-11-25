# Accuracy review A, wave 2 round 1: sections 9, 10 and 11

Reviewer scope: accuracy only. Page text read from `/tmp/pai-rw/w2-r1a/*.txt` and the section sources; before text from
`/tmp/pai-text-before/`; change from `git diff 9957515`. Registers: `research/2026-11/05-data-pipeline.md` (F05),
`08-compute-shapes.md` (F08), `01-robot-basics.md` (F01), `src/data/registry.json`. Figure label changes checked:
`Capture.tsx` (provenance string), `AugThreeWays.tsx` (two labels, section 11).

## Part 1. Section 9, Collecting Data

### Findings

1. **error.** H2 title: "A person-hour at the bench buys at most half an hour of data"
   - Register: F05-2. The half comes from two settings, `episode_time_s = 60` and `reset_time_s = 60`; the entry's
     derivation is "At the defaults one session is 50 x (60 + 60) s = 100 minutes ... for at most 50 minutes".
   - The heading states the ratio as a general limit and drops the "at the defaults" qualifier that the body keeps
     ("One session at those defaults is ..."). A shorter reset changes it.
   - Fix: "At the recorder's defaults, a person-hour at the bench buys at most half an hour of data".

2. **minor.** H2 title: "387 MB per camera-hour, measured on one dataset"
   - Register: F05-30 is `[derived]` ("arithmetic on F05-29"). 387 MB is half of the two-camera 775 MB, an average
     of two files of different size (45.5 MB and 40.1 MB give 412 and 363 MB per camera-hour).
   - Fix: "387 MB per camera-hour, computed from one dataset's file sizes".

3. **minor.** "At the recorder's defaults a 50-episode session takes 100 minutes of a person's time for at most 50
   minutes of data, which is why the other ways to collect start by taking the robot out of the session."
   - Register: F05-2 supports the arithmetic; F05-7 and F05-8 give no motive tied to reset time, and F05-6 (the
     human-in-the-loop mode, presented later on the page as another way) keeps the robot at the bench.
   - Fix: "... data. A hand-held rig, the other way to collect, takes the robot out of the session."

4. **minor.** "CPU cores are the one part of the host to watch, and they are spent on the robot's clock, 30 ticks a
   second, for as long as the person is driving."
   - Register: F05-44. "By default the recorder writes each frame as a PNG and encodes the episode to MP4 after it
     ends"; only streaming encoding "puts the encode load on the CPU during the control loop". The next paragraph
     says so, which makes this sentence wrong for the default path.
   - Fix: "... and with streaming encoding on they are spent on the robot's clock ...".

5. **minor.** "Those two ratings are as far as the published sizing goes."
   - Register: F05-105 scopes the gap to what was located: "No published CPU-utilisation figure for that row was
     located". F05-45 quotes two rows of the docs table and does not say the table has only two.
   - The sentence is an unhedged claim about all published sizing; the next sentence carries the correct scope.
   - Fix: "In the sources read on 2026-11-20 the sizing stops at those two ratings."

6. **minor.** "(In section 3 an encoder was the angle sensor on a joint; from here on the word means the video
   compressor.)"
   - Cross-reference: later sections use "encoder" for a neural network (section 15, `TrainingScales.tsx` lines 243
     and 471, "encoder frozen", "its largest encoder"; section 20, `Workloads.tsx` lines 133 and 759, "a vision
     encoder"). The before text scoped it: "In this section and the next two".
   - Fix: restore "in this section and the next two the word means the video compressor".

7. **minor.** "Choose the codec for the machine that will train on the data and name it, because auto lets the
   recording host choose."
   - Register: F05-35, `vcodec: str = "libsvtav1"`; F05-42, `auto` applies only when set. The sentence reads as if an
     unnamed codec falls to `auto`.
   - Fix: "... and name it rather than setting auto, which lets the recording host choose."

8. **minor.** "A leader arm stores joint targets for the one follower it is paired with, numbers that follower's
   servos take as they are." and, in the closing paragraph, "its recordings are joint targets this arm takes with
   no conversion".
   - Register: F05-7 and F05-23 are the cited entries; neither says the servos take the stored numbers unchanged.
     Section 3 (F01-18, "From encoder steps to degrees: calibration and the conversion") says the stored values are
     degrees converted from servo steps, so a conversion does happen. What the joint-target recording avoids is
     inverse kinematics.
   - Fix: "numbers that follower takes with no kinematic model" / "with no inverse kinematics".

9. **minor.** "... the row holds none, so one training sample is assembled from a row and one decoded frame per
   camera."
   - Register: F05-23 supports "the row holds none"; the "one frame per camera" clause has no entry and is narrower
     than F05-62 (rows "that each read a window of five past frames") and F05-64 ("request a few timestamps").
   - Fix: "... from a row and the decoded frames each camera contributes to it".

10. **minor.** "... has no hardware video encoder, so every encoded frame costs CPU time on its six Arm cores."
    - Register: F05-57's quote supports "no NVENC engine"; "six Arm cores" appears only in its "Use in dive" line,
      and no evidence quote in F05, F07 or F08 gives the Orin Nano's core count.
    - Fix: drop "six", or cite an entry that quotes the count.

### Checked and holding

Every byte count and size in the table and in the figure (F05-29: 45,541,633; 40,124,489; 369,943; 72,560; 5,914;
3,401; 2,246; nine files; 86.1 MB; 11,939 frames; 30 fps; two 640x480 cameras; robot_type so100_follower, Wave 3
line). Every derivation in F05-30, redone: 85,666,122 video bytes; 11,939 / 30 = 397.97 s = 6.6 min;
85,666,122 / 23,878 = 3,588 bytes per frame; 640 x 480 x 3 = 921,600; 921,600 / 3,588 = 256.9, about 257;
774.9 MB/h, 387 MB per camera-hour; 199.07 GB/h raw; 369,943 / 11,939 = 31.0 bytes per row, 3.3 MB/h; 11,939 / 50
= 238.8 frames = 7.96 s; everything other than video is under 0.5 MB (at most 483,878 bytes even at the top of the
86.1 MB rounding). The episode-on-disk diagram labels (F05-17, F05-18, F05-22, F05-23, F05-24). The v3.0 format
(F05-16); five bookkeeping columns and dtypes (F05-22); action and observation.state as 6 x float32 (F05-23);
append-until-target (F05-19 code); the metadata row contents (F05-24); "scales to millions of episodes" and "v2 used
one file per episode" (F05-19 docs quote); seek time = timestamp + from_timestamp (F05-25); toy numbers 45 / 30 =
1.5, 55.7 + 1.5 = 57.2 (labelled invented); timestamp from index, 25 Hz claiming 30, per-episode digest (F05-4);
100 MB / 200 MB / 1,000 files and the 500 MB of the public dataset (F05-20); chunk rollover (F05-21); v2.1 refusal
and convert_dataset_v21_to_v30 (F05-28); keyframe mechanism (F05-37); GOP definition (F05-36); random access vs a
film (F05-64); GOP 2 at most 2, GOP 250 worst 250 and average about 125, labelled illustration (F05-37); the three
defaults libsvtav1, g = 2, crf = 30 and "lower means better quality and larger files" (F05-35); the docs' two quotes
and the encoder table rows High / Smallest, Medium / "~30-50% larger", Very low / Largest (F05-43); six hardware
encoders, none AV1, `auto` falls back to libsvtav1 (F05-42); 2024 benchmark 5.59%, 2.14%, 1.38%, 0.48, six
consecutive frames, 480x640, GOP 2, CRF 30, directory gone at v0.7.0 (F05-63); "our reading" kept on the
chosen-for-decode inference; PNG path and streaming path (F05-44); tutorial command sets streaming encoding on
(F05-1); 2 x 640 x 480 x 30 = 18,432,000 and 2 x 1920 x 1080 x 30 = 124,416,000, the docs' 55M and 373M with their
label, "Low", "High", "Requires powerful high-end CPU", dropped frames, about 5% (F05-45 with its Wave 2 line); Orin
Nano has no NVENC (F05-57); Thor encodes H.264 and HEVC and not AV1 (F05-55); finalize() and the upload order
(F05-3); recorder defaults with push_to_hub on, 50 x 120 s = 100 min (F05-2); 50 episodes, 10 per location, cameras
fixed, object visible, advice not threshold, the camera rule of thumb (F05-5); UMI definition, 2024, 3D-printed
gripper and action camera (F05-7); "UMI's authors report" 3 people, 1,400, 12 person-hours, 30 locations, more than
3x, 1,400 / 12 = 116.7, about 117 (F05-8); HiFi-UMI-2K July 2026, two hands, six cameras, more than 20,000 hours,
2,000-hour curated subset, 16.0 TB, owner "its dataset card" kept (F05-10); human-in-the-loop corrections (F05-6);
section 3 teleoperation and end-effector action (RobotAsComputer.tsx lines 465 to 484 and 654 to 669); section 4
"no recovery to copy" (LearningFromDemonstrations.tsx line 215); section 10 contents as promised (decode on CPU
cores, NVDEC per card, steps per second, curation pipeline); video.codec av1 (F05-23). Capture provenance change
("made for this dive on a Mac" removed) changes no claim.

**Section 9: 96 claims checked, 10 findings (1 error, 9 minor).**

## Part 2. Section 10, Processing and Curating

### Findings

1. **error.** "The cores do two jobs for every frame: they decode it, and by default they also augment it, applying
   the random per-image changes of section 11."
   - Register: F05-84, `enable: bool = False`: "LeRobot's image transforms are off by default." F05-58 and F05-87
     say where the transforms run by default once enabled (the dataloader workers), not that they are on. Section
     11 says LeRobot "ships with the transforms switched off", so the two sections now contradict each other. The
     before text said only that augmentation "runs per sample in the workers by default".
   - Fix: "they decode it, and when augmentation is switched on they also augment it, by default in the same
     workers". The same holds for "Augmentation lowers r further, since it runs per sample in the same workers by
     default": add "once enabled".

2. **error.** "At that scaling the four workers supply 59 x 2.1 / 32 = 3.9 to 59 x 2.5 / 32 = 4.6 steps per second,
   under the 6 the GPUs can train, and the cores set the pace. The pull request's edit to the loader, which lifts the
   ceiling to 25, then does what no faster GPU could."
   - Registers: F01-91 is the cited run of that same policy, GPU set and batch, and it measured
     `dataloading_s` = 0.015 s against `update_s` = 0.167 s with GPU utilisation about 90%: the GPU set the pace.
     Register 08, section 5.1 (teaching material, "Training" bullet), reads the same F01-91 and F05-62 pair the
     other way: "about one CPU core busy feeding four GPUs. Here the GPUs are the full part." The page itself calls
     these runs ones "which wait on the GPU" in its last h2.
   - The arithmetic is right (3.87, 4.61). The conclusion belongs to a hypothetical: rows as heavy as the PR's
     five-frame-window rows, on the PR's unstated hardware, scaled by the streaming reader's figure, set against
     the guide's GPU time. Stated as "the cores set the pace", our derivation contradicts the measurement it cites.
   - Fix: "If every row were as heavy as the pull request's five-frame rows, four workers at that scaling would
     supply 3.9 to 4.6 steps per second, under the 6 the GPUs can train. The guide's own run of Diffusion Policy
     measured 0.015 s of data loading per step, so on its rows the GPU set the pace."

3. **error.** "For AV1 the matrix says no on the cards bought for large training runs."
   - Register: F05-48, the HGX B200, HGX B300 and GB200 (P6-B200, P6-B300, P6e-GB200) "have ... 7 NVDEC engines that
     decode AV1". These are cards bought for large training runs, and the next paragraph says they decode AV1. The
     before text scoped the "no" to "the A100 and the H100".
   - Fix: "For AV1 the matrix says no on the A100 and the H100, the cards most training runs rent today."

4. **error.** "The nearest published rate is NVIDIA's, from March 2025, for a predecessor it called NeMo Video
   Curator on its DGX Cloud service ..."
   - Register: F05-78, "no figure for Cosmos Curator v2.x was located (U9)". The before text kept the scope: "Cosmos
     Curator v2.10.0 publishes no throughput figure that this research located". The rewrite drops "located" and
     makes a claim about every published figure.
   - Fix: "The nearest published rate this research located is NVIDIA's, ...".

5. **minor.** "So a LeRobot run is limited by the cores beside its GPU, and the codec chosen at the bench decides
   ..."
   - Register: F05-39 and F05-41 support "decode stays on the CPU". As written, the sentence says every LeRobot run
     is CPU-bound, which F01-91's runs (data loading 0.011 to 0.015 s against updates of 0.167 to 2.548 s) contradict.
   - Fix: "So a LeRobot run decodes only on the cores beside its GPU, ...".

6. **minor.** "An open pull request in LeRobot's repository reports 5.16 ms per row for random single-row reads ...
   With the defaults of 4 workers and a batch of 8, the ceiling is 4 x 194 / 8 = 97 steps per second from decode
   alone."
   - Register: F05-62 evidence, single-item table "| random | 5.37 | 5.16 |", columns `main` vs this PR. 5.16 ms is
     the PR branch; the stock code measured 5.37 ms (186 rows per second, 4 x 186 / 8 = 93 steps per second). The PR
     times dataset access, Parquet read plus decode, not decode alone.
   - Fix: "5.37 ms per row on main and 5.16 ms with its change"; "from dataset access alone". The 97 can stay if the
     sentence names it as the PR branch.

7. **minor.** "The same pull request times batches of 32 rows that each read a window of five past frames"
   - Register: F05-62, "a five-frame history window". "Five past frames" can be read as five plus the current one.
   - Fix: "a five-frame history window".

8. **minor.** "The three sources ran on different machines, one of them unstated, ..."
   - Registers: F05-62 states no hardware; F05-60's blog quote for 2.1 to 2.5x states none either. Only F01-91 names
     hardware. Separately, the 2.1 to 2.5x figure is the Tier 2 blog's (F05-60 evidence, "Blog (Tier 2 ...)"), but
     the cite renders F05-60's Tier 1 docs URL and "Tier 1 vendor claim".
   - Fix: "two of them unstated"; cite the release blog (Tier 2) for the 2.1 to 2.5x.

9. **minor.** "g7.48xlarge runs 1 thread per core, so its 24 vCPUs per GPU are 24 physical cores, twice the physical
   cores per GPU of every other eight-GPU x86 size."
   - Register: F08-57, "p4d.24xlarge: 96 / 8 = 12 vCPUs, 6 cores". 24 is four times p4d's 6. Carried from the
     before text.
   - Fix: "twice the 12 of the other eight-GPU x86 sizes and four times p4d's 6".

10. **minor.** "The CPU stages are there to keep the GPU stages busy. Preparing the captioning model's inputs is CPU
    work ..., and runs many CPU workers for each GPU worker."
    - Register: F05-70 gives that purpose for the captioning-input stage only, and says it "can scale independently
      and spawn many parallel CPU workers". Decode and transcode are stages because the work is needed.
    - Fix: "The captioning-input stage is there to keep a GPU stage busy ... so that it can run many CPU workers".

11. **minor.** "It clusters them with K-Means ... and inside each cluster drops clips that sit too close to another
    by cosine similarity ..."
    - Register: F05-73, "'Drops clips that sit too close to another' is [our reading] of the epsilon option; the
      exact rule was not read in code (U8)". The docs give cosine as the metric "for ordering within a cluster
      w.r.t. the centroid".
    - Fix: "and, by our reading of its options, drops clips inside each cluster that sit too close to another".

12. **minor.** "For robot episodes the toolkit's newer recipes need no video model at all: a clip is embedded by
    ..."
    - Register: F05-75 scopes it: "In that robot recipe, deduplication does not use a video model." The newer
      robot captioning recipe of F05-76 runs captioning models on the clips.
    - Fix: "For robot episodes the newer recipes deduplicate with no video model: ...".

13. **minor.** "... so a GPU that waits for batches reads low: the guide's runs read about 80 to 95%, and the starved
    curation run read about 17%."
    - Registers: F01-91 gives a "GPU util" column and F05-76 an "Aggregate GPU utilization"; neither says it is the
      `nvidia-smi` figure that F08-30 defines.
    - Fix: "the guide reports about 80 to 95% for its runs, and the curation note about 17%".

14. **minor.** "nvidia-smi also says who is decoding ... If that figure reads zero while the job trains on video,
    the decode engine is unused and the decoding is on the CPU."
    - Register: F08-31, "On MIG-enabled GPUs, querying the utilization of encoder, decoder, jpeg, ofa, gpu, and memory
      is not currently supported." The before text kept this caveat; the rewrite drops it.
    - Fix: add "On a GPU split with MIG none of these figures can be queried."

15. **minor.** "A curation pass is short independent units of work, so it can run on Spot, the capacity AWS may take
    back, at the cost of the clips a lost machine held (section 20, Fifteen Workloads, Five Shapes)."
    - Cross-reference and register: section 20 puts curation in shape A (fan-out, interruptible), but never mentions
      Spot (no "Spot" in `Workloads.tsx`), and F08-78 has none. Spot is covered in sections 24 to 29.
    - Fix: keep section 20 for the shape and point the Spot clause at section 29, Choosing (or 24).

### Checked and holding

F05-39 (torchcodec on the CPU, "Currently supports torchcodec on cpu and pyav"); F05-41 (CUDA in a worker leads to
initialisation errors); F08-77 (stock loader decodes on CPU on every card); F05-65 with its Wave 3 line (192 vCPUs,
24 per GPU, 12 physical cores, the nine families named; p4d 96 vCPUs; g7.48xlarge one thread per core); F08-57 and
F05-66 (g6.xlarge 4, g6.16xlarge 64, p5.4xlarge 16 vCPUs, 16 < 24); F05-59 (2.8x H100, 3.3x A100, the flag, no
dataset, camera count, batch size or CPU, owner "Hugging Face's report" kept); 1 / 2.8 = 0.357, 36%, "at most"
valid because the moved work adds GPU time; F05-35 (AV1 default, GOP 2); F05-47 (H100 0 NVENC, 7 NVDEC, no AV1);
F05-37 and F05-64 (keyframe cost, random access); F05-61 (batch 8, 4 workers); 8 x 2 = 16, 16 x 2 = 32,
16 x 250 = 4,000, GOP 250 labelled illustration; 1,000 / 5.16 = 193.8; 4 x 194 / 8 = 97; 16.98 / 4.95 = 3.43;
1,000 / 16.98 = 58.9; 1,000 / 4.95 = 202.0; 4 x 59 / 32 = 7.375; 4 x 202 / 32 = 25.25; 1 / 0.167 = 5.99; owner kept
for the PR ("reports", "author reported") and the guide; F05-60 (2.1 to 2.5x from four workers, "Hugging Face
reports"); F05-58 (quote and the backend=gpu behaviour); every engine count and AV1 answer in the lookup table and in
prose (F05-46, F05-47, F05-48, F05-49, F05-50, F05-51, F05-52, F05-53, F05-54, F08-44); the H200 gap dated
2026-11-20 (F05-49); the A10 / A10G pairing marked as ours by the "our pairing" parenthesis and the F05-67 cite;
F05-43 ("~30-50% larger"); F05-77 (ffmpeg_gpu removed, PyNvVideoCodec "measurably faster", CPU default encoder for
A100 and H100); F05-67 (no P-family encoder); F05-81 (lerobot-edit-dataset, delete by index, recompute stats);
F05-68 (v2.10.0, 2026-11-10, Ray); F05-69 (stages, H.264 transcode); F05-71 (3 CPUs decode, 5 transcode, 0.25 GPU
for three of five models, 0.5 motion, 48 GB target); F08-45 with its Rewrite check (L40S sold as 48 GB, no "usable");
24 / 3 = 8, 24 / 5 = 4.8, four workers with 4 vCPUs left, 4 x 0.25 = 1; F05-76 with its Wave 2 line (32 H100s, 4 x 8,
7.1 rows/s, about 43, about 17%, 10 replicas idle, fetch-bound, cancelled, one run, known weakness); F05-73 (K-Means,
cosine); F05-75 (instruction text, first frame, wrist motion; all three match); F08-78 (shape A); F05-78 (March
2025, NeMo Video Curator, DGX Cloud, about 195 s per video-hour per GPU streaming, no version); F01-91 (column names
dataloading_s and update_s, 0.011 to 0.015 s, 0.167 to 2.548 s, 80 to 95%); F08-30 (definition); F08-31 (decoder
utilisation reported separately); the animated figure's five steps and labels; the curation funnel labels
(unchanged). Cross-references: section 4 (ACT and the diffusion policy, LearningFromDemonstrations.tsx lines 112 to
127), section 9 (GOP and keyframes, codec table), section 11 (image transforms), section 15 (one-GPU adaptation
scale, TrainingScales.tsx lines 48 and 189).

**Section 10: 108 claims checked, 15 findings (4 error, 11 minor).**

## Part 3. Section 11, Augmentation and Synthetic Data

### Findings

1. **error.** Figure caption: "Each row applies one method to the same frame: three image transforms at illustrative
   strengths, then three simulated scenes with the block ringed in a new place (these scenes also vary colour and
   light)."
   - Source of the figure: `AugThreeWays.tsx` header, "Row 2 shows three randomised MuJoCo scenes with the block in a
     new place each time", drawn from a different capture (`so101-domain-randomisation.jpg`), not from the recorded
     frame; row 3 is empty. The before caption said the middle row uses "this dive's randomised scenes ... to stand
     in for simulator replays". The stand-in qualifier is gone, and the caption now says each row is the method
     applied to the same frame.
   - Fix: "... then three randomised MuJoCo scenes that stand in for simulated replays (they also vary colour and
     light); the third row is empty because no clip was generated."

2. **error.** "The same clip at 480p takes 59.83 s on the H100, which is 59.83 / 7.875 = 7.6 GPU-seconds per second
   of video, or 7.6 GPU-hours for an hour of it."
   - Register: F05-98 is a `[vendor claim]`. The paragraph before this one is about the Cosmos 3 paper's grid, so
     NVIDIA is not named for this figure; the before text kept the owner ("by our arithmetic from NVIDIA's figure").
     The arithmetic holds (7.597).
   - Fix: "NVIDIA lists the same clip at 480p at 59.83 s on the H100, which by our arithmetic is ...".

3. **error.** Expandable, "The framework FAQ": "16 billion parameters at 2 bytes each is 32 GB, so the figure is the
   weights alone: plan with the NIM floors."
   - Register: F03-123 marks this `[our reading]` and records that the FAQ itself labels the models "8B" and "32B"
     against the model cards' 16B and 64B. The before text kept both ("by our reading", and the 8B / 32B note). The
     rewrite states our inference as fact and drops the contradiction that weakens it.
   - Fix: "By our reading the figure is the weights alone: at the model cards' 16 billion parameters (the FAQ labels
     Nano 8B), 2 bytes each is 32 GB."

4. **error.** "No part of the machine appears twice in the third column, so capacity left over from one method buys
   nothing for the next."
   - Check against the page: the column reads "CPU cores in the dataloader workers, or the training GPU", "A
     simulator's GPU: memory per parallel environment, plus rendering ..." and "GPU tensor cores and large GPU
     memory". GPU memory is in two rows and a GPU in all three. The page also names the RTX PRO 6000 Blackwell as
     the card of the cube-stacking replays (F05-90) and as a card listed for Cosmos3-Nano (F05-95).
   - Register: F05-108 (`[our reading]`) supports "a different part for each kind"; no entry supports "capacity left
     over ... buys nothing".
   - Fix: "Each method fills a different part of the machine first (our reading)." and drop the second clause.

5. **minor.** "milliseconds of CPU for a transformed image (an estimate; no figure is published)"
   - Register: F05-108 gives "milliseconds of CPU" as our derivation; no entry establishes that no figure exists.
     The figure label "No published figure" is carried from before.
   - Fix: "(our estimate; no published figure was located)".

6. **minor.** "The idea comes from MimicGen in 2023, whose authors report over 50,000 demonstrations across 18 tasks
   from about 200 human ones, or 250 for each one a person gave."
   - Register: F05-88, 250 is `[derived]` (50,000 / 200). Inside "whose authors report", it reads as their figure.
   - Fix: "..., about 250 for each one a person gave by our arithmetic".

7. **minor.** "The share of candidates that pass the success check is the yield, and it multiplies the bill, because
   a rejected candidate was simulated in full."
   - Register: F05-89 says each candidate is run and checked by "a boolean success criteria"; it does not say a
     failed candidate runs to the end.
   - Fix: "because a rejected candidate was simulated before it was rejected".

8. **minor.** "For the block-in-cup task the scene does not exist yet."
   - Register: F05-93 is the Isaac Lab v3.0.0 repository tree (file presence only). It supports "Isaac Lab ships an
     SO-101 stack task", not a claim that no block-in-cup scene exists anywhere.
   - Fix: "Isaac Lab v3.0.0 ships no block-in-cup scene."

9. **minor.** SkillGen expandable: "Its time for 1,000 demonstrations with one environment on an RTX 6000 Ada is 90
   to 120 minutes."
   - Register: F05-92 `[vendor claim]`. The owner is in the previous sentence only; the before text had "NVIDIA gives
     90 to 120 minutes".
   - Fix: "NVIDIA gives 90 to 120 minutes for 1,000 demonstrations ...".

10. **minor.** "with the weights stored in 8 bits each instead of 16 it is 44 GiB. Nano at full precision is
    therefore a job for a card of the 80 GB class, and a 48 GB card needs the 8-bit weights or weights offloaded to
    host memory."
    - Register: F03-121, FP8 resident: "44 GiB" generation, "50 GiB" transfer. A 48 GB card is 44.7 GiB (F08-45
      Rewrite check), so transfer, the use this section leads with, still needs offload in FP8.
    - Fix: "44 GiB for generation (50 GiB for transfer)"; "a 48 GB card needs the 8-bit weights for generation, and
      offload as well for transfer".

11. **minor.** "One generated clip of under 8 seconds occupies a data-centre GPU for minutes." (and the H2 "for
    minutes per clip")
    - Register: F05-98 and F03-98. True at 720p (207.78 s on the H100, 114.85 s on the B200); at 480p the H100 row is
      59.83 s and the B200 row 33.20 s, which the page then recommends.
    - Fix: "One 720p clip of under 8 seconds ...".

12. **minor.** "... and 786.37 s on an RTX PRO 6000 Blackwell, the card that ran the simulated replays."
    - Register: F05-90 (Franka cube stacking) ran on the RTX PRO 6000 Blackwell; the humanoid and SkillGen figures
      quoted on the page ran on an RTX 6000 Ada (F05-91, F05-92).
    - Fix: "the card of NVIDIA's cube-stacking replays".

13. **minor.** "In the DreamGen recipe ... the actions are recovered afterwards by an inverse-dynamics model ..."
    - Register: F05-101 quote, "extract pseudo-actions using either a latent action model ... or an inverse dynamics
      model (IDM)". Carried from the before text.
    - Fix: "by an inverse-dynamics model or a latent-action model".

14. **minor.** "The low end. NVIDIA ships an adapter ... and reports all 21 of its test cases completing on an RTX
    5070 ... at an unquantified cost in speed."
    - Register: F03-125, "With the FP8 checkpoint it completed all 21" ("Native FP8 generation completed all 21
      modality/resolution cases"), and the speed cost is one "the README does not quantify in the lines read". The
      FP8 omission is carried from the before text; "unquantified" widens "the page does not quantify".
    - Fix: "... completing with the FP8 checkpoint on an RTX 5070 ... at a speed cost the README does not quantify".

### Checked and holding

F05-108 (three kinds by machine part; the ladder milliseconds / about 1 to 36 GPU-seconds / about 20 GPU-minutes,
labelled our arithmetic); 19 min / 1,000 = 1.14 s; 10 h / 1,000 = 36 s; 36 / 1.14 = 31.6, the "30-fold" of F05-91;
F05-103 (240,000 trajectories, 54 h, 1,500 L40s, "author reported" kept; 54 x 1,500 = 81,000; 81,000 / 240,000 =
0.3375 h = 20.25 min); F05-84 (off by default; up to 3 of six; brightness and contrast 0.8 to 1.2, saturation and
sharpness 0.5 to 1.5, hue 0.05, rotation 5 degrees, translation 5%); toy factor 1.1 labelled; F05-86 (the eight
camera transforms, none in the default set); F05-85 (training time only, raw frames kept); F05-87 (default backend in
the workers, gpu backend per batch, chunk of 32, 15 to 30 s compile, 2.4 GB against 6.3 GB at 480x640, two frames,
batch 160); F05-107 (24 vCPUs per GPU); F05-59 (2.8x H100, 3.3x A100, no dataset, camera count, batch size or CPU,
"Hugging Face reports" kept); F05-89 (Mimic mechanism, yield about 70% to under 1%); 1 / 0.40 = 2.5, 1 / 0.01 = 100;
F05-90 (Franka cube stacking, RTX PRO 6000 Blackwell, about 15 min and about 1 h, 1,000 and 300 environments, about
40%, 60 / 15 = 4); figure labels 0.9 s and 3.6 s (15 min and 60 min over 1,000, marked our division); F05-91 (65 to
80%, 18 to 40 min, 19 min at 80% on an RTX 6000 Ada, about 10 h for nut pouring with cameras); F05-93 (SO-101 asset
and stack task, no published generation time located in this research); F05-92 (about 9.5 GB and 22 GB, 24 GB and
48 GB, gain not significant past one environment); F05-96 (transfer inputs and outputs; Sim-Transfer up to 600 frames,
30 fps, 480p); F05-100 (quote "while preserving the original motion and actions"; Transfer1 pinned, two generations
behind); F05-101 (DreamGen steps, pseudo-actions); F05-102 (SO-100, 10 and 13 real plus 40 and 50 generated, 21% to
45.5%, "its authors report" kept); F05-95 (Cosmos 3 family, Nano 16B and Super 64B, card lists); F03-98 (189 frames,
24 fps, 207.78 / 114.85 / 786.37 s, owner "NVIDIA's benchmark" kept; 189 / 24 = 7.875; 207.78 / 7.875 = 26.39);
F03-96 (4x in time, 32 x 32 in space; 47.25 x 22.5 x 40 = 42,525, "on the order of 42,000"); F05-97 (148.65 s and
527.89 s, edge control, H100, no frame count; toy 50 x 148.65 s = 7,432.5 s = 2.06 h); F03-121 (58 GiB, 64 GiB, 31 GiB
layer offload, Super 150 GiB, floors checked at startup, "treat the floors as minimums", no resolution or frame
count); F03-124 with its Rewrite check (33.8 GiB for one 1280 x 720 image; 50,623 to 52,147 MiB printed in MiB;
notes file for coding agents; no full-video PyTorch peak); F03-126 (Nano one GPU at 720p, Super's primary PyTorch
rows eight, measured setups); F05-94 (2025 blueprint, 48 GB RTX card, separate 80 GB H100-or-better node, quote).
Cross-references: section 4 (ACT), section 6 (compress, denoise, decode: WorldModels.tsx line 322), section 10
(dataloader workers), section 12 (parallel copies of a scene: PhysicsSimulation.tsx lines 194 and 571), section 13
(which cards render: Rendering.tsx lines 193 to 201), section 14 (sim-to-real). AugThreeWays label changes ("a
MuJoCo still, scripted motion"; "No generated clip is shown: none was produced for this page") change no claim.

**Section 11: 94 claims checked, 14 findings (4 error, 10 minor).**

## Totals

Section 9: 1 error, 9 minor. Section 10: 4 error, 11 minor. Section 11: 4 error, 10 minor.
