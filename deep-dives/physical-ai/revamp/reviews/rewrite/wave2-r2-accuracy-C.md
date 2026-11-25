# Accuracy review C, wave 2 round 2: sections 9 and 10

Reviewer scope: accuracy only. Text read from the section sources at HEAD (`da8cfe7`); the round 1 text is the
version at `e0539f1`; change read from `git diff e0539f1 HEAD`. Registers: `research/2026-11/05-data-pipeline.md`
(F05), `08-compute-shapes.md` (F08), `01-robot-basics.md` (F01), `src/data/registry.json`. Cross-references checked
against `revamp/tools/sections.json` and the other sections' sources. Diagrams in both files are unchanged since
`e0539f1` (the only hunks above the section bodies are the `Cite` imports); section 10's animated figure moved into the
h1 container with its steps unchanged; the curation funnel caption was checked against `CurFunnel.tsx`.

## Part 1. Section 9, Collecting Data

### Round 1 findings

| # | Sev. | Round 1 finding | Status | Reason |
|---|---|---|---|---|
| 1 | error | H2 "A person-hour at the bench buys at most half an hour of data" dropped "at the defaults" | RESOLVED | Now "At the recorder's defaults, a person-hour at the bench buys at most half an hour of data" (F05-2). |
| 2 | minor | H2 "387 MB per camera-hour, measured on one dataset" | RESOLVED | The h2 is gone. 387 MB now appears as "about 387 MB per camera" "at that ratio ... in this one dataset", with the F05-30 cite rendering as derived, and in the expandable as "387 MB in this dataset. That figure comes from one scene at one image size". No "measured". |
| 3 | minor | "... which is why the other ways to collect start by taking the robot out of the session" | RESOLVED | Clause removed; the sentence ends at "for at most 50 minutes of data". |
| 4 | minor | "CPU cores ... spent on the robot's clock ... for as long as the person is driving" (wrong for the default PNG path) | RESOLVED | The clock now sits on the streaming path only: "With --dataset.streaming_encoding=true ... the cores now encode video on the robot's clock, 30 ticks a second" (F05-44). |
| 5 | minor | "Those two ratings are as far as the published sizing goes." | RESOLVED | Now "In the sources read on 2026-11-20 the sizing stops at those two ratings, with no CPU-utilisation figure for the 640x480 row" (F05-105). |
| 6 | minor | "from here on the word means the video compressor" (later sections use encoder for a network) | RESOLVED | Now "from here to the end of section 11". Sections 10 and 11 use "encoder" only for video (ProcessingCurating.tsx line 628; none in Augmentation.tsx). |
| 7 | minor | "name it, because auto lets the recording host choose" | RESOLVED | Now "name it rather than setting auto, which lets the recording host choose" (F05-35, F05-42). |
| 8 | minor | "numbers that follower's servos take as they are" / "with no conversion" | RESOLVED | Now "numbers that follower takes with no kinematic model" and "joint targets this arm takes with no inverse kinematics"; the IK and kinematic-model cross-reference holds (RobotAsComputer.tsx line 665). |
| 9 | minor | "one decoded frame per camera" | RESOLVED | Now "a row and the decoded frames each camera contributes to it". |
| 10 | minor | "six Arm cores" with no quoted source | RESOLVED | Now "every frame it records is encoded in software on the CPU" (F05-57). |

**Round 1: 10 of 10 resolved.**

### New findings

1. **minor.** "At this dataset's rate one camera-hour is about 387 MB, two video files at the 200 MB target of v0.7.0,
   whether that hour holds a few long episodes or hundreds of short ones."
   - Registers: F05-19 code, `if latest_size_in_mb + ep_size_in_mb >= self._meta.video_files_size_in_mb:` starts a new
     file, otherwise the episode is concatenated: the writer never splits an episode. F05-20: 200 MB per video file.
     387 / 200 = 1.94.
   - Hundreds of short episodes pack into two files. A few long ones do not: one 60-minute episode is one 387 MB file,
     three 20-minute episodes (129 MB each) are three files.
   - Fix: "about two video files at the 200 MB target for an hour of short episodes; the writer never splits an
     episode, so a few long ones can make one to three".

2. **minor.** "... and the motion it holds is 30 / 25 = 1.2 times faster than the one the person made. That faster
   motion is what a policy, the network that drives the arm, learns to copy when it is trained on the data." Also the
   table cell "discard a session whose rate is off before a policy learns its speed".
   - Register: F05-4, "a session that ran at 25 Hz still produces a dataset that _claims_ 30 - the recorded motion is
     simply faster than reality." 30 / 25 = 1.2 holds. No entry says what a trained policy does with it; the motion
     comes out 1.2 times faster when the policy is run at the nominal 30 Hz, which is our reading.
   - Fix: "A policy trained on it and run at the nominal 30 Hz moves 1.2 times faster than the person did (our
     reading)."

3. **minor.** "... which is 1,400 / 12 = 117 per person-hour, gathered in places no robot was carried to."
   - Registers: F05-8, "across 30 diverse physical locations, including homes, offices, restaurants, and outdoor";
     F05-7, UMI "took the robot out of data collection". Neither says no robot was ever brought to those places.
   - Fix: "gathered with no robot present".

4. **minor.** "Set the camera resolution knowing that two 1920x1080 cameras carry 124 / 18.4 = 6.75 times the pixels
   of two 640x480 ones"
   - Arithmetic: 124 / 18.4 = 6.74. The exact ratio is 124.416 / 18.432 = (1920 x 1080) / (640 x 480) = 6.75 (inputs
     from F05-45 Wave 2).
   - Fix: "(1920 x 1080) / (640 x 480) = 6.75 times the pixels".

5. **minor.** "... and weigh the episode's video: its bytes over its frames, set against the 921,600 bytes of a raw
   frame, give your own ratio in place of this dataset's 257 to 1."
   - Register: F05-30, 921,600 = 640 x 480 x 3, the raw frame at this dataset's image size. The paragraph before asks
     the reader to choose the camera resolution and names 1920x1080, whose raw frame is 6,220,800 bytes; against
     921,600 that reader's ratio comes out 6.75 times too low.
   - Fix: "set against a raw frame at your resolution (width x height x 3; 921,600 bytes at 640x480)".

6. **minor.** Caption of the episode strip: "Six frames of one episode in time order. Each shares its timestamp with
   one row of the table, and that timestamp is what finds it in the video. The frames are rendered from a simulated
   SO-101 in MuJoCo, ... and are not taken from the public dataset."
   - Provenance: `MUJOCO_SO101` (Capture.tsx line 116), "MuJoCo 4.0.1, offscreen renderer", "scripted motion, no
     learned policy". These frames were rendered, not recorded, so they have no table rows; the second sentence
     describes a recorded episode as if it were these frames.
   - Fix: "In a recorded episode, each frame shares its timestamp with one row of the table ...".

7. **minor.** "To put a number on the size side for your own scene, record one episode at g = 2 and one at a long GOP
   and compare the two files." followed by the cites F05-37 and F05-30.
   - Register: F05-30 is arithmetic on the example dataset's file sizes and says nothing about GOP. The entry that
     explains why no size figure can be given is F05-29: "its info.json does not record GOP size or CRF" (U1).
   - Fix: drop the F05-30 cite here, or cite F05-29 with "the example dataset does not record its GOP".

### Checked and holding

New or changed sentences, in reading order. Episode as rows one per tick of the 30 Hz clock plus compressed video one
stream per camera (F05-17, F05-2); ARM and TASK_STORY constants. 11,939 frames from each of two cameras in 85,666,122
bytes; 85,666,122 / 23,878 = 3,587.7, "3,588 bytes a frame"; 640 x 480 x 3 = 921,600; 921,600 / 3,588 = 256.9, "about
257 to 1 in this one dataset" (F05-30 renders as derived, registry `t: -1`); 387 MB per camera, 775 MB per pair, 199 GB
raw; "at one bench" scope. Teleoperation cross-reference to section 3; codec defined; "LeRobot v0.7.0 ... a whole frame
every second frame" (F05-35); "the software its docs rate as the most CPU-intensive" (F05-43). 100 minutes for at most
50 (F05-2). Expandable: dataset name, hub, 11,939 frames, 30 fps, two 640x480 cameras, 6.6 minutes; so100_follower
names a config that drives both arms and the files do not prove which arm recorded (F05-23, F01-9, F05-29 Wave 3);
seven of nine files; table sizes (F05-29); 31 bytes per row, 3.3 MB per robot-hour; info.json records no compression
settings (F05-29, U1). Camera columns of type video, pixels in the MP4s (F05-23); action and observation.state 6 x
float32; five bookkeeping columns with timestamp and frame_index (F05-22). Version 2 one file per episode; millions of
episodes as the design target (F05-19 docs quote). Toy seek arithmetic and "the addition costs nothing" moved, no
number changed. 30 / 25 = 1.2 (F05-4). MuJoCo caption cross-reference to section 12, Physics Simulation; second
caption "simulated episode". Size targets 100 MB, 200 MB, 1,000 files then next directory, the dataset's 500 MB
(F05-20, F05-21). "The data loader asks for a few frames at random places" (F05-64). GOP 250 as illustration, worst
250, average 125, and 250 / 2 = 125 times the worst case of GOP 2 (F05-37); "more keyframes buy that cheaper read with
a larger file" (F05-37 docstring). LeRobot decodes on CPU (F05-39); the pull request: open, about 5 ms per random
sample, two cameras, 50 episodes, median, one process, warm cache, hardware unstated (F05-62); cross-reference to
section 10, title prefix "Processing and Curating" matches sections.json, and section 10 does turn that time into a
worker count. "Two set the read, and the third sets quality against size" (F05-35). Hardware encoder definition, six
listed, all H.264 or HEVC; auto behaviour (F05-42). 2024 benchmark at GOP 2, CRF 30, three codecs, 480x640 real-world
dataset; 5.59%, 2.14%, 1.38%; 0.48, the best of 11.80 / 7.92 / 0.71 / 0.85 / 0.48; "considering these results"
(F05-63). "Smallest", "the best training performance" (F05-43); directory gone at v0.7.0. Section 10 lists AV1
decode by GPU (lookup table). Default encoder in software, no model, no GPU (F05-105). PNG path, streaming path,
near-instant save, encode on the 30-tick clock (F05-44); tutorial command sets streaming (F05-1). 18.4 million, 55M,
"Low", 124 million, 373M, "High", the quote (F05-45 with its Wave 2 line); the dated sizing scope (F05-105). Orin Nano
encodes in software (F05-57). Heading with "At the recorder's defaults" (F05-2). 50 x (60 + 60) s = 100 minutes, half
resets. 7.96 s average (F05-30); 50 x (7.96 + 60) s = 3,398 s = 56.6 minutes; 6.63 / 56.63 = 11.7%, "about 12%";
`reset_time_s` is a setting (F05-2). Fifty as advice with no measured threshold (F05-5 note). UMI: 3 people, 1,400,
12 person-hours, 30 locations, 117 per person-hour, owner kept, "more than 3 times" with "the authors put" (F05-8).
Leader arm with no kinematic model; IK and kinematic model in section 3. HiFi-UMI-2K July 2026, two hands, six
cameras, more than 20,000 hours, 2,000-hour curated subset, 16.0 TB, LeRobot format (F05-10); 16.0 TB / 2,000 h = 8
GB/h; / 6 = 1.33 GB per camera-hour (F05-10 derived line); 1,333 / 387 = 3.4, "more than three times"; "at thousands
of hours the difference is terabytes" (0.95 GB per camera-hour x 1,000 camera-hours is about 1 TB). Codec named rather
than auto (F05-35, F05-42); encode load follows the pixels (F05-45); g at 2. One-line digest (F05-4); video.codec av1
(F05-23).

**Section 9: 89 claims checked, 7 new findings (0 error, 7 minor).**

## Part 2. Section 10, Processing and Curating

### Round 1 findings

| # | Sev. | Round 1 finding | Status | Reason |
|---|---|---|---|---|
| 1 | error | "by default they also augment it" (transforms are off by default) | RESOLVED | Sentence gone. Now "once its image augmentation ... moved from the CPU workers to the GPU" for the ACT run, and "Augmentation, once switched on, lowers r further, because by default it runs per sample in the same workers", with F05-84 cited. |
| 2 | error | "... and the cores set the pace" from a hypothetical, against F01-91's measured GPU-bound run | RESOLVED | The hypothetical is now labelled "for illustration" and ends at a worker count (32 / (59 x 0.167) = 3.2) with the condition "only if together they return at least 3.2 times the rows of one". F01-91's run is stated the right way: "spent 0.015 s per step loading data, so there the GPUs set the pace", and "the two figures measure different things". |
| 3 | error | "For AV1 the matrix says no on the cards bought for large training runs" | RESOLVED | Now "on the H100 of P5, the A100 of P4d and the T4 of G4dn" (F05-47, F05-46, F05-53). |
| 4 | error | "The nearest published rate is NVIDIA's" (located scope dropped) | RESOLVED | Now "the nearest published rate we located is NVIDIA's" (F05-78, U9). |
| 5 | minor | "So a LeRobot run is limited by the cores beside its GPU" | RESOLVED | Now "so a LeRobot run decodes on the cores beside its GPU whatever the card" (F05-39). |
| 6 | minor | 5.16 ms is the PR branch; access, not decode alone | RESOLVED | Now "times dataset access, fetching one row with its frames ... 5.37 ms ... on LeRobot's main branch and 5.16 ms with the pull request's change", and the arithmetic uses 5.37 (186 rows/s). |
| 7 | minor | "five past frames" | RESOLVED | Now "each reading a five-frame history window". |
| 8 | minor | "one of them unstated"; 2.1 to 2.5x cited to the Tier 1 docs | RESOLVED | Now "Neither the pull request nor the release post names the machine behind its figure"; the blog (Tier 2) is now cited. It is reached through entry F05-59, which does not hold the figure: new finding 2. |
| 9 | minor | g7.48xlarge "twice the physical cores per GPU of every other" | RESOLVED | Now "twice the 12 of the other eight-GPU x86 sizes and four times p4d's 6" (F08-57). |
| 10 | minor | "The CPU stages are there to keep the GPU stages busy" | RESOLVED | Now "One CPU stage exists only to keep a GPU stage busy ... which can spawn many CPU workers" (F05-70). |
| 11 | minor | dedup rule stated as fact | RESOLVED | Now "orders each cluster by cosine similarity to its centre ... and, by our reading of its options, drops the clips that sit too close to another" (F05-73). |
| 12 | minor | "the newer recipes need no video model at all" (scope is deduplication) | NOT RESOLVED | Only "at all" was dropped: "For robot episodes the newer recipes need no video model: ...". F05-75 scopes it to deduplication; the robot captioning recipe of F05-76, described two paragraphs earlier, runs captioning models on the clips. Fix: "the newer recipes deduplicate with no video model". |
| 13 | minor | utilisation figures framed as nvidia-smi readings | RESOLVED | Now "the guide reports about 80 to 95% for its runs, and the curation note about 17%". |
| 14 | minor | MIG caveat dropped | RESOLVED | Restored: "On a GPU split with MIG ... none of these figures can be queried" (F08-31). |
| 15 | minor | Spot pointed at section 20, which never mentions it | RESOLVED | Now "(section 24, Orchestrating Physical AI on AWS, places it there)"; section 24 lists curation's decode-and-filter stage as "An AWS Batch array job on Spot" (AwsOrchestration.tsx line 227). |

**Round 1: 14 of 15 resolved.**

### New findings

1. **minor.** "Hugging Face reports a run where the cores did set the pace."
   - Register: F05-59 quote, "ACT trains 2.8x faster on an H100 and 3.3x faster on an A100". That the cores set the
     pace is ours: F05-59's Use line, "means the GPU had been idle for most of each step [our reading]". The next
     sentence derives it in view (1 / 2.8 = 36%, holds), but the opening sentence puts the reading under Hugging Face's
     name.
   - Fix: "Hugging Face reports a run that, by the arithmetic below, the cores paced."

2. **minor.** "For LeRobot's streaming reader, the mode that trains without downloading the dataset first, Hugging
   Face's release post reports 2.1 to 2.5 times more samples per second from four workers." with the cites F05-60
   ("training_dataset_streaming.mdx") and F05-59 ("LeRobot v0.7.0 release blog, Disk-less streaming").
   - Registers: F05-59's claim, location ("Augment on the GPU") and quote are the 2.8x / 3.3x figure. The 2.1 to 2.5x
     quote is under F05-60, whose registry row renders the Tier 1 docs URL. The new F05-59 cite reaches the right
     document (the blog, Tier 2) through an entry that does not hold the figure, and the F05-60 cite still shows Tier 1
     for a number only the blog gives.
   - Fix: give the blog's streaming quote its own entry (or add the blog URL to F05-60's registry row at Tier 2) and
     cite that alone for the 2.1 to 2.5x.

3. **minor.** The "our pairing" qualifier on the EC2 family column was dropped. The reviewed text read "... NVIDIA
   publishes both in one support matrix (the EC2 family named beside each card here is our pairing of that matrix with
   the EC2 tables)"; it now ends at "support matrix", and the lookup table's EC2 family column and "in the G families
   from the L4 of G6 upward" carry no marker.
   - Registers: F05-66, "The NVIDIA matrix row 'NVIDIA RTX PRO 4500 Blackwell Server Edition' ... that this is the G7
     card is [our reading] of the name"; F05-67 is `[derived]`, join ours. The A10 / A10G caveat is kept in prose and
     table; the G7 pairing is now unmarked except for the F05-67 cite label.
   - Fix: restore "(the EC2 family beside each card is our pairing of the matrix with the EC2 tables)".

4. **minor.** "For the GPU side, the nearest published rate we located is NVIDIA's, ... about 195 seconds per hour of
   video per GPU in streaming mode, or 3,600 / 195 = 18.5 hours of video per GPU-hour. At that rate an illustrative
   1,000 hours of video take about 54 GPU-hours, a dated order of magnitude to check against a short run of your own."
   - Register: F05-78. The 195 s is the whole streaming pipeline's rate (CPU and GPU stages) per GPU, not a GPU-stage
     rate. Its Use line asks for the figure with "its age and product name stated: 20 months old, a predecessor
     product, 720p"; the page states the age and product, not 720p, and the new 54 GPU-hours (1,000 x 195 s = 54.2 h,
     holds) carries the figure into a sizing without it.
   - Fix: "For sizing the GPUs, the nearest published end-to-end rate we located ... for 720p video: ...".

5. **minor.** "Two runs on 32 GPUs show how far apart a fed and a starved pipeline sit."
   - Registers: F05-78 quote, "GPU stage workers are kept busy over 99.5% of the time" (worker busy time, NeMo Video
     Curator, 2025); F05-76 quote, "Aggregate GPU utilization was about 17%" (GPU utilisation, a 2026 robot captioning
     recipe on H100s). The next two paragraphs state each figure correctly with its own metric, but the opener puts
     two different measures from two pipelines on one scale.
   - Fix: "Two runs on 32 GPUs, measured differently, show a fed and a starved pipeline:".

### Checked and holding

New or changed sentences, in reading order. Title and h1 description (conditional "When"; sections.json title
matches the h1). Decode on CPU in the dataloader workers (F05-39); dataloader defined; "most eight-GPU sizes carry 24
vCPUs" per GPU (F05-65). ACT 2.8x on an H100 with augmentation moved off the CPU workers; no dataset, camera count,
batch size or CPU; owner kept; 1 / 2.8 = 0.357, "at most 36%" (F05-59). Diffusion Policy on four H100s, batch 32,
0.167 s update, 0.015 s loading, GPUs set the pace (F01-91); section 4 cross-references for ACT and Diffusion Policy.
The flag `--dataset.image_transforms.backend=gpu` (F05-59); NVDEC a fixed circuit apart from the tensor cores (F05
group D note); the stock loader decodes on CPU whatever the card (F05-39, F05-67 Use line). AV1 default (F05-35); H100
no AV1 decode (F05-47). Batch 8 default (F05-61); 8 x 2 = 16, 16 x 2 = 32, 16 x 250 = 4,000, 4,000 / 32 = 125; GOP 250
labelled illustration; GOP set at encode, trading decode time against size (F05-37); lerobot-edit-dataset re-encodes
videos (F05-81). CUDA in workers and "which is why decode stays on the cores" (F05-41 Use line). W >= B / (r x u)
derived from W x r / B >= 1 / u, holds. PR: open, dataset access, two cameras, 50 episodes, torchcodec, 5.37 main and
5.16 PR, medians, one process, warm cache, hardware unstated (F05-62); 1,000 / 5.37 = 186.2; 8 / 186 = 43 ms; 43 / 4 =
10.7, "about 11 ms", with the four-times condition. Batches of 32 at random with a five-frame history window, 16.98 ms
on main; 1,000 / 16.98 = 58.9; 32 / 59 = 0.54 s; "the two figures measure different things" (F01-91: dataloading_s is
the loop's per-step figure); 32 / (59 x 0.167) = 3.25, "3.2"; still open on 2026-11-20; 4.95 ms, 3.43x; 3.25 / 3.43 =
0.95, "about one". Neither source names its machine (F05-62, F05-60 blog quote). Augmentation off by default
(F05-84); per sample in the workers, the docs' quote, backend=gpu leaves the workers decoding only (F05-58); 2.8x
H100, 3.3x A100 (F05-59). Eight-GPU family list without G7, 192 vCPUs, 24 per GPU, 12 physical cores (F05-65 Wave 3);
p4d 12 vCPUs and 6 cores per GPU; g7.48xlarge 24 cores, twice 12, four times 6 (F08-57); g6.xlarge 4, g6.16xlarge 64,
p5.4xlarge 16 (F08-57, F05-66). NVENC and NVDEC apart from the tensor cores; H100 7 NVDEC; H200 no row "when read on
2026-11-20" (F05-49); Blackwell P6 parts decode AV1 (F05-48); G6 upward (F05-50, F05-51, F05-52, F08-44); G5 on the
A10 row with the A10G note and a decode test (F05-54). LeRobot can record H.264 or HEVC (F05-42); "about 30-50%
larger", "best training performance", "may affect training time", owner kept as "its docs state" (F05-43). Curator
dropped ffmpeg_gpu for performing like ffmpeg_cpu and decodes on the GPU through PyNvVideoCodec (F05-77). Bench
curation: 50 episodes by default (F05-2), delete by index, recompute statistics (F05-81). G6e L40S sold as 48 GB
(F08-45 Rewrite check); 4 x 0.25 = 1, 24 / 3 = 8, 4 x 5 = 20 (F05-71); P-family transcoding on the cores, A100 and
H100 by name, no P-family NVENC (F05-77, F05-67). March 2025, NeMo Video Curator, version unnamed, DGX Cloud, about
195 s per video-hour per GPU streaming (F05-78); 3,600 / 195 = 18.46, "18.5"; Toy 1,000 h labelled "illustrative";
1,000 x 195 / 3,600 = 54.2 GPU-hours. Funnel caption against CurFunnel.tsx (decode 3 CPUs, transcode 5 CPUs, prepare
inputs 3 CPUs, model stages 0.25 / 0.5 of a GPU, captioning a GPU). Captioning-input stage, 3 CPUs, many CPU workers
(F05-70, F05-71). Controller measuring throughput and resizing every three minutes, over-provisioning CPU stages
(F05-79); NVIDIA reports over 99.5% after warm-up, 32 GPUs, four nodes, owner kept (F05-78 quote). Design note,
incubating recipe, 32 H100s (4 x 8), 32 replicas, 7.1 rows of the input table per second, near 43, about 17%, 10
replicas idle, fetch-bound, one run, cancelled, known weakness (F05-76 with its Wave 2 line). Dedup reads the
embeddings (F05-73); K-Means, cosine ordering against the centroid, our reading kept (F05-73); instruction text, first
frame, wrist motion, fused and clustered (F05-75). Spot cross-reference to section 24 (checked above); interruptible
short units (F08-78). dataloading_s and update_s with preprocessing in the first; 0.011 to 0.015 s against 0.167 to
2.548 s; 0.015 / 0.167 = 0.09, "under a tenth" in every run; GPUs set the pace in all three (F01-91). nvidia-smi
utilisation definition and "says nothing about how much of the GPU each kernel used" (F08-30); decoder utilisation
separate, MIG (F08-31). Worker count toward B / (r x u) within the physical cores; g7.48xlarge; one-GPU sizes (F05-61,
F05-58, F05-37, F08-57). GPU-decoding software: AV1 rules out P5 and P4d (F05-67); 12 (24 vCPUs), 6 on p4d.24xlarge,
24 on g7.48xlarge (F08-57).

**Section 10: 83 claims checked, 5 new findings (0 error, 5 minor).**

## Totals

Section 9: round 1, 10 of 10 resolved; new: 0 error, 7 minor. Section 10: round 1, 14 of 15 resolved (number 12, the
"no video model" scope, not resolved); new: 0 error, 5 minor.
