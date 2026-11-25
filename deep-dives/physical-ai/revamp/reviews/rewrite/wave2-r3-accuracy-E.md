# Accuracy review E, wave 2 round 3: sections 9 and 10 (changes since round 2), sections 13 and 14 (confirm only)

Reviewer scope: accuracy only. Committed text only (HEAD `07ae2f9`); the uncommitted working-tree drafts of other
sections were not read. Change for sections 9 and 10 read from `git diff 799f574 HEAD` on `CollectingData.tsx`,
`ProcessingCurating.tsx` and `research/2026-11/05-data-pipeline.md` (commits `e382f67`, `78080d4`, `9e659b5`). Round 2
findings from `revamp/reviews/rewrite/wave2-r2-accuracy-C.md` (sections 9, 10) and `wave2-r2-accuracy-D.md` (sections
13, 14). Registers: `research/2026-11/05-data-pipeline.md`, `01-robot-basics.md`, `06-simulation-and-sim-to-real.md`;
`src/data/registry.json`, `revamp/tools/sections.json` and `src/lib/sections.ts` read at HEAD.

## Part 1. Section 9, Collecting Data (`src/sections/CollectingData.tsx`)

### Round 2 findings

| # | Sev. | Round 2 finding | Status | Reason |
|---|---|---|---|---|
| 1 | minor | "two video files ... whether that hour holds a few long episodes or hundreds of short ones" | RESOLVED | Now "about two video files at the 200 MB target of v0.7.0 when the hour is many short episodes. The writer never splits an episode, so a single hour-long episode is one 387 MB file, and, for illustration, three 20-minute episodes of 129 MB each make three." F05-19 code: `latest + ep >= target` starts a new file, else concatenate, so an episode is never split. 387 / 200 = 1.94; 387 / 3 = 129; 129 + 129 = 258 >= 200, so three files. 20 is `<Toy>`, 129 is `<Derived>`. |
| 2 | minor | "That faster motion is what a policy ... learns to copy"; table "before a policy learns its speed" | RESOLVED | The policy sentence is gone; the paragraph ends at "30 / 25 = 1.2 times faster than the one the person made" (F05-4). The table cell now reads "discard a session whose rate is off before you train on it". |
| 3 | minor | "gathered in places no robot was carried to" | RESOLVED | Now "gathered with no robot present" (F05-7, F05-8). |
| 4 | minor | "124 / 18.4 = 6.75" | RESOLVED | Now "(1920 x 1080) / (640 x 480) = 6.75", the whole expression inside `<Derived>`. 2,073,600 / 307,200 = 6.75. |
| 5 | minor | "set against the 921,600 bytes of a raw frame" after advising 1920x1080 | RESOLVED | Now "set against a raw frame at your resolution (width x height x 3 bytes; 921,600 at 640x480)" (F05-30). |
| 6 | minor | Strip caption describes rendered frames as if they had table rows | RESOLVED | Now "In a recorded episode, each frame shares its timestamp with one row of the table"; the MuJoCo provenance sentence is unchanged. |
| 7 | minor | F05-30 cited for the GOP size side | RESOLVED | Now "The example dataset does not record its GOP, so to put a number on the size side ..." with F05-29 cited (F05-29: "its `info.json` does not record GOP size or CRF", U1). |

**Round 2: 7 of 7 resolved.**

### New findings

1. **minor (regression of round 1 finding 6).** "(From here on, encoder means the video compressor, not the angle
   sensor on a joint of section 3.)"
   - Round 1 finding 6 (wave2-r1-accuracy-A.md) flagged "from here on" because later sections use "encoder" for a
     neural network; round 2 marked it resolved on "from here to the end of section 11". The round 3 edit, following
     the adversarial note X-12, removed that scope. At HEAD, section 15 (`TrainingScales.tsx` line 243, "with the
     encoder frozen"; line 471, "its largest encoder") and section 20 (`Workloads.tsx` line 133, "a vision encoder
     over clips"; line 759, "A vision encoder is matrix arithmetic on tensor cores") use the word for a network.
     Sections 10 to 14 use it only for video, or not at all.
   - Fix: "(In this section and the next two, encoder means the video compressor, not the angle sensor on a joint of
     section 3.)"

2. **minor.** "The current docs rate `libsvtav1` "Smallest" and give the reason for AV1 as "the best training
   performance". Both can hold, because a CRF of 30 is a different quality in each codec, and either way the default
   was chosen for the read."
   - Registers: F05-43 holds both docs quotes; F05-63 holds the 2024 table, where the AV1 file was the largest of three
     (5.59% against 2.14% and 1.38%), and its Use line says the docs' "smallest" and that table disagree. The CRF
     argument reconciles the docs' "Smallest" with the benchmark's largest file. In the rewrite, "Both" points
     grammatically to the two docs quotes in the sentence before, which do not conflict, so the sentence no longer
     says which two claims it reconciles. The round 2 text named them ("so both sources can hold").
   - Fix: "The docs' "Smallest" and the benchmark's largest file can both hold, because a CRF of 30 is a different
     quality in each codec ..."

### Checked and holding (changed sentences, in reading order)

"Two settings are chosen at the bench ... every later reader of the data inherits them. One is the codec ... The other
is how often the video stores a whole frame" (same content as before; F05-35, F05-43; teleoperation cross-reference to
section 3 unchanged). Expandable: "Its metadata records the robot type as `so100_follower`, which LeRobot uses for both
the SO-100 and the SO-101, so the files do not prove an SO-101 recorded it" (F05-23 note, F01-9, F05-29 Wave 3; the
dataset name `lerobot/svla_so101_pickplace` is printed in the same sentence, so dropping "Its name says SO-101" loses
nothing); "Seven of the repository's nine files" removed, and the table still lists the seven data files with sizes
matching F05-29. "The file count therefore follows the bytes far more than the episodes" is borne out by the worked
cases that follow it, and "version 3 keeps the count at the bytes over the size target" stands in its context of
millions of (short) episodes (F05-19 docs quote). 1.2 = 30 / 25 (F05-4). GOP 250 as illustration, "a random read
decodes up to 250 frames", 250 / 2 = 125 (F05-37 derived line); the dropped "average about 125" leaves nothing
unsupported. The about-5 ms read: open pull request, two cameras, 50 episodes, median, one process, warm file cache,
hardware not stated (F05-62; section 10 gives 5.37 and 5.16 ms); cross-reference "Section 10, Processing and Curating"
matches the HEAD title prefix in `sections.json` and `src/lib/sections.ts`. Codec paragraph: "Smallest" and "the best
training performance" quotes (F05-43); "the default was chosen for the read" (F05-43 quote, F05-63 "Considering these
results" after the load-time table); "taken against its own images on another dataset" (F05-63). The dropped "in 2024"
and "its directory is gone from the repository at v0.7.0" were not restored by any finding, and the history scope
survives: the paragraph before opens "LeRobot's 2024 video benchmark" and the citation label reads "README at v0.4.0".
UMI: 1,400 / 12 = 116.7, "117", "with no robot present", owner kept (F05-8). Raw frame: 640 x 480 x 3 = 921,600
(F05-30). No changed sentence drops a qualifier that a round 1 or round 2 finding restored, except new finding 1.

**Section 9: 32 claims checked; round 2 7 of 7 resolved; 2 new findings (0 error, 2 minor).**

## Part 2. Section 10, Processing and Curating (`src/sections/ProcessingCurating.tsx`)

### Round 2 findings

| # | Sev. | Round 2 finding | Status | Reason |
|---|---|---|---|---|
| R1-12 | minor | "For robot episodes the newer recipes need no video model" (scope is deduplication) | RESOLVED | Sentence removed with its F05-75 cite; the dedup paragraph now ends on the classic pipeline's K-Means and cosine ordering, "by our reading of its options" kept (F05-73). F05-75 is cited nowhere in `src/` at HEAD, and nothing later in the section refers to the cut recipe. |
| 1 | minor | "Hugging Face reports a run where the cores did set the pace" | RESOLVED | Opening sentence removed. The owner now sits on the figure only: "trained 2.8x faster on an H100, Hugging Face reports, once its image augmentation ... moved from the CPU workers to the GPU" (F05-59); the pacing reading is our arithmetic in view, 1 / 2.8 = 36% `<Derived>`. |
| 2 | minor | 2.1 to 2.5x reached through F05-60 (Tier 1 docs URL) and F05-59 (wrong quote) | RESOLVED | New entry F05-109 (blog, "Disk-less streaming", quote "2.1-2.5x more samples per second when using four workers", SPLIT from F05-60); registry row `t: 2`, blog URL, `vendor-claim`. The sentence cites F05-109 alone, plus F05-62 for the pull request's unnamed machine. F05-60 carries a Rewrite check line restricting it to the two-core statement. |
| 3 | minor | "our pairing" qualifier dropped from the EC2 family column | RESOLVED | Prose restored: "(the EC2 family beside each card is our pairing of the matrix with the EC2 tables)"; lookup-table header now "EC2 family (our pairing)". The G6-upward sentence in the next paragraph falls under the same parenthetical. |
| 4 | minor | 195 s presented as a GPU-stage rate; 720p missing | RESOLVED | "For sizing the GPUs, NVIDIA published in March 2025 an end-to-end rate for 720p video: about 195 seconds per hour of video per GPU in streaming mode, for the whole pipeline". F05-78 Use line asks for "20 months old, a predecessor product, 720p"; all three are now stated, with "the nearest published rate we located" kept. |
| 5 | minor | Two different metrics put on one scale | RESOLVED | "Two runs on 32 GPUs, measured differently, show a fed and a starved pipeline." The next two paragraphs keep each metric with its owner (F05-78 worker busy time, F05-76 GPU utilisation). |

**Round 2: 6 of 6 resolved (5 new findings of round 2 plus round 1 finding 12, carried as not resolved).**

### New findings

1. **minor.** "The encoding partner, NVENC (NVIDIA Encoder), also sits apart from the tensor cores, so a card can train
   at full load while both engines sit unused."
   - Registers: F05-47, the H100 has "0 NVENC, 7 NVDEC"; F05-46, the A100 has "0 NVENC, 5 NVDEC". The restructured
     paragraph now places this sentence right after the H100 of P5, the A100 of P4d and the T4 of G4dn, so "both
     engines" reads as true of the cards just named, and two of the three have no NVENC. The round 2 text said "while
     its decoder sits unused". The section states the A100 and H100 lack an encoder engine only later (line 625).
   - Fix: "... so a card can train at full load while its video engines sit unused (the H100 and A100 carry no NVENC
     at all)", or return to "while its decoder sits unused".

### Checked and holding (changed sentences, in reading order)

Title "How Many CPU Cores Keep a Training GPU Fed": matches `sections.json` and `src/lib/sections.ts` at HEAD; every
cross-reference into section 10 from other sections (sections 1, 3, 4, 9, 15, 20) uses the unchanged prefix
"Processing and Curating" or the bare number, and the section still covers decode, filter, embed and deduplicate as
section 20's list says. ACT 2.8x on an H100 with augmentation moved to the GPU, owner kept, "no dataset, camera
count, batch size or CPU" (F05-59). "a different measurement from the guide's 0.015 s of loading per training step on
its own dataset" (F01-91: `dataloading_s` 0.015 for Diffusion Policy, per step, on a roughly 50-episode dataset). The
streaming reader as "the mode that trains without downloading the dataset first" (F05-109 location "Disk-less
streaming"). NVDEC paragraph: H100 of P5, 7 NVDEC, no AV1 (F05-47); the matrix lists engines and codec support per card
(F05-46, F05-47, F05-53); A100 of P4d and T4 of G4dn, AV1 decode NO (F05-46, F05-53); H200 of P5e and P5en, no row when
read on 2026-11-20 (F05-49); NVENC apart from the tensor cores, with "also" pointing back to the NVDEC definition at
line 346 ("separate from the tensor cores"). "Cosmos Curator, NVIDIA's video curation pipeline" (F05-68, "a toolkit
for curating physical AI training data"); this is its first mention in the body, before the version line at 611.
NVIDIA rate: March 2025, NeMo Video Curator, version unnamed, DGX Cloud, about 195 s per video-hour per GPU in
streaming, whole pipeline (F05-78 quote "the streaming pipeline requires ~195 seconds to process one hour of video per
GPU"); 720p from F05-78's "~1M hours of 720p video" with the register's own consistency check (2,000 x 24 x 18.5 =
886,000); 3,600 / 195 = 18.46, "18.5"; Toy 1,000 h, 1,000 x 195 / 3,600 = 54.2, "about 54". Funnel caption (wording
only). Diagnostic: "If steps per second rise when you add workers, the workers were setting the pace; if they stay
flat, the limit is elsewhere: set the loading time beside the update time to tell the GPU from a slow read" is method
on F01-91's `dataloading_s` / `update_s` pair, and it is more accurate than the round 2 "the GPU was", which ignored a
read-bound run (F05-76's fetch-bound case); the worker ceiling at the physical cores is stated in the closing
paragraph. "When the workers set the pace" (wording only). No changed sentence drops a qualifier that a round 1 or
round 2 finding restored: "we located", "version unnamed", "for illustration", "still open on 2026-11-20", "by our
reading of its options", "our pairing" and the MIG caveat are all present at HEAD.

**Section 10: 27 claims checked; round 2 6 of 6 resolved; 1 new finding (0 error, 1 minor).**

## Part 3. Sections 13 and 14, confirm only (commit `07ae2f9`)

| Section | # | Sev. | Round 2 finding | Status | New problem in the fixing sentence? |
|---|---|---|---|---|---|
| 13 | 1 | minor | OvPhysX folded into "the physics engine inside Isaac Sim"; "only the pairing with Newton" | RESOLVED: "Newton Warp pairs with Newton, with OvPhysX (PhysX as a standalone library) or with Isaac Sim's PhysX. Paired with Newton, with no Isaac Sim underneath, it leaves the job with no documented RT-core requirement. Every pairing gives up reflections and indirect light." | None. F06-50 quote "Pairs with Newton, OvPhysX, or Isaac Sim PhysX"; F06-45 "`OVPhysX` for PhysX ... as standalone libraries"; "only" is gone, so the OvPhysX pairing is no longer excluded. "Every pairing" follows from the renderer itself computing "direct lighting" only (F06-50), whatever the physics engine. |
| 13 | 2 | minor | "more than four orders of magnitude" | RESOLVED: "about four orders of magnitude" | None. F06-102 "spanning four orders of magnitude"; 57 KB to the about-2 GB ceiling is about 4.5 orders, so "about four" holds whichever end is taken. |
| 14 | 1 | minor | "no vendor sentence names the A100 or H100 as supported for it" stated as a fact about the world | RESOLVED: "though no vendor sentence naming the A100 or H100 as supported for it was located in this research (section 13, Rendering and Ray Tracing)" | None. Matches F06-62 (U8) and section 13's own wording at `Rendering.tsx` line 480 ("... was located in this research"); the section 13 title matches `sections.json`. |

**Sections 13 and 14: 3 of 3 resolved; 6 claims checked in the fixing sentences; 0 new findings.**

## Totals

| Section | Round 2 resolved | New errors | New minor |
|---|---|---|---|
| 9 | 7 of 7 | 0 | 2 |
| 10 | 6 of 6 (including round 1 finding 12) | 0 | 1 |
| 13 | 2 of 2 | 0 | 0 |
| 14 | 1 of 1 | 0 | 0 |
