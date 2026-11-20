# Figure audit: Physical AI dive

Audited 2026-11-20 against a fresh build (`vite build`, then `revamp/tools/check-section.mjs --widths 1440 --all`).
Every figure was read as a PNG at 1440 px, animated figures at a middle step and the last step. Section 28 (Amazon
EKS) was no longer a stub at audit time and is included.

Score: 1 to 10 on "shows the thing itself and teaches what the prose cannot". Verdict: keep (7 or more), refine
(the idea is right, the drawing is thin), rebuild (the figure is a table or a flow of labelled boxes and has to be
re-thought).

**Totals: 62 figures, 22 of them animated. 35 score under 7. 27 score 7 or more.**

## Three findings that cut across the dive

1. **No section uses the MuJoCo captures.** `public/media/` holds eight stills and two clips of the SO-101 in
   MuJoCo 4.0.1 and `src/components/Capture.tsx` exists, yet no section file references either. Every arm in the
   dive is a brown stick figure. The single largest gain is to put the real captures in: nine redesigns below use
   them (`so101-contact.jpg` for the physics step, `so101-render-passes.jpg` for rendering,
   `so101-domain-randomisation.jpg` for augmentation and sim-to-real, `so101-eval-grid.jpg` for evaluation,
   `so101-policy-views` for the VLA inputs, `so101-episode-strip.jpg` for chunking, tubelets and the episode
   layout).
2. **Twenty-odd figures are tables drawn as boxes.** Rounded rectangles with a bold title and two lines of text,
   joined by down arrows. The test: if the boxes can be typed as a three-column table with no loss, the figure
   teaches nothing the prose cannot. Those are the rebuilds.
3. **The concept figures are 560 px wide phone-first columns.** That is why they look "too simple" on a desktop:
   the canvas is spent on one stack. The round 2 figures (`Cluster.tsx`, `LoopOnAws.tsx`) draw a 1240 px
   landscape canvas and reflow. The redesigns below take the same approach: a wide canvas with a real picture or a
   real axis on it, and a stacked variant at 390 px.

Shared iconography to adopt from round 2 (so the dive reads as one system): the GPU chip glyph and job tile from
`Cluster.tsx`, the six stage pictograms from `LoopOnAws.tsx`, the palette of `revamp/diagram-plan.md` section 1. Add
three glyphs used below: a **frame** (4:3 rectangle with a real capture inside, yellow stroke), a **latent** (a
row of 8 small squares in blues, value mapped to shade), an **action chunk** (a strip of cells, one per action,
with the joint curve drawn through it).

## Summary table, sorted by rebuild priority

| # | Section | Figure | Animated | Score | Verdict | One line |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 29 Choosing | The decision path from a workload to a machine family, an orchestrator and a capacity market | no | 3 | rebuild | A 1,500 px tall list of questions; the reader cannot see where any real workload lands |
| 2 | 6 World Models | The same frame and action through a pixel generator and a latent predictor | yes | 5 | rebuild | Two columns of boxes; the frame is a cartoon, the latent is 8 squares, nothing shows what the latent throws away |
| 3 | 12 Physics | One physics step, from the old state to the new state | yes | 5 | rebuild | Four text boxes light up in turn; the arm barely changes; no force, no contact, no integration is drawn |
| 4 | 13 Rendering | Rasterising a triangle and tracing a ray through a pixel | yes | 5 | rebuild | A 1-D "image" of ten cells and a side view; the idea is right but there is no picture being formed |
| 5 | 4 Demonstrations | A single-step policy drifts out of the demonstrated band; a chunked policy stays inside | yes | 6 | rebuild | Shows the outcome, hides the cause: why the error grows is not drawn, and the chunk is only bigger dots |
| 6 | 4 Demonstrations | Flow matching turns a chunk of noise into a smooth action chunk | yes | 6 | rebuild | Real axes, but one joint, one sample, no velocity field; "a different noise ends elsewhere" is caption only |
| 7 | 5 VLA | One vision-language-action model as blocks: pi0 with the SO-101's shapes | no | 5 | rebuild | Five boxes with the shapes written as prose; the 50 x 32 tensor is never drawn |
| 8 | 7 JEPA | A 16-frame clip becomes tubelets, then tokens, then one latent vector per token | no | 6 | rebuild | Right numbers, toy drawing: the tubelet is a 4 x 4 grid with one blue square |
| 9 | 7 JEPA | One JEPA training step: two encoders, a predictor, a loss between latents | yes | 6 | refine | Gradient path and stop-gradient are well done; the masking, the thing the model learns from, is 3 rows of grey cells |
| 10 | 8 Robot RL | Three places reinforcement learning runs for a robot, and what each one waits on | no | 4 | rebuild | A 3 x 3 table drawn as boxes |
| 11 | 16 Evaluation | The evaluation ladder, from open-loop error to trials on the real arm | no | 4 | rebuild | Four stacked text boxes; the r values belong on an axis |
| 12 | 11 Augmentation | One recorded episode fanning out into three kinds of extra training data | no | 4 | rebuild | Three text cards; no image is shown being changed |
| 13 | 10 Curating | The stages of a video curation pipeline, each coloured by the machine part it loads | no | 4 | rebuild | A list of stage boxes; the clips never appear, nothing is filtered out |
| 14 | 18 Fleet | Episodes travelling from the device disk to Amazon S3 and training, and a new policy returning | yes | 4 | rebuild | Five boxes in a chain with a blue dot; no fleet, no quantity, no time axis |
| 15 | 16 Evaluation | Open-loop scoring against closed-loop scoring of a policy | no | 5 | rebuild | Two box-and-arrow loops; the difference shows only in trajectories |
| 16 | 1 One Loop | The physical AI loop: eight stages in a ring around one arm | yes | 5 | rebuild | Superseded by the six-stage loop of sections 20 and 24, which has pictograms; the two loops also disagree (8 against 6 stages) |
| 17 | 3 Robot as Computer | Gripper travel against delay at 0.25 metres per second | no | 5 | rebuild | A straight line y = 0.25 x; the distance is not shown against the block it has to hit |
| 18 | 19 Agents | One station of an agent-run loop: what the agent may change and what is frozen | no | 5 | refine | Box flow; the frozen and the editable halves are the idea and deserve to be the layout |
| 19 | 17 On Robot | What runs on the Jetson: nucleus, components, policy container, hardware | no | 5 | refine | A stack of boxes; acceptable as an architecture stack, but nothing is to scale and no boundary is shown |
| 20 | 24 AWS Orchestration | The three layers: queue, node provider, capacity market | no | 5 | refine | Three boxes holding lists; it is a 4 x 2 table |
| 21 | 27 HyperPod | A HyperPod cluster under Amazon EKS orchestration and under Slurm orchestration | no | 5 | refine | Two text stacks; the cluster figure below it already draws one of them properly |
| 22 | 5 VLA | Two clocks: a slow system that updates a plan and a fast system that emits actions | yes | 6 | refine | The two bars are not on a time axis, so 10 against 120 per second is not visible |
| 23 | 7 JEPA | Predictor passes per decision for four planners, log axis | no | 6 | refine | Four products of three numbers as lollipops; the multiplication is in small print |
| 24 | 9 Collecting | One episode exploded into its rows, its video and its metadata | no | 6 | refine | File paths in boxes; no row, no frame is shown |
| 25 | 9 Collecting | Where the bytes of the example dataset are, and stored video against uncompressed frames | no | 6 | refine | The 257 to 1 ratio, the section's number, is a sliver with a caption |
| 26 | 10 Curating | How video decode on CPU cores can leave a training GPU waiting for data | yes | 6 | refine | Queue levels are drawn; rates are not, so "starved" has no number |
| 27 | 18 Fleet | A new policy version travelling through a staged rollout, with the abort case | yes | 6 | refine | The fleet tiles are good; the three boxes above them are text |
| 28 | 21 PMU Cards | Where a pipeline slot goes: two questions, four buckets | yes | 6 | refine | A decision tree with percentages; the 400 slots are never drawn |
| 29 | 23 Price-Performance | Units of work per second for three stand-in workloads on three core types | no | 6 | refine | Repeats section 22's throughput; a section named price-performance has no price axis |
| 30 | 13 Rendering | One GPU card drawn as separate engines that share one memory (`GpuEngines`) | no | 6 | refine | Six equal boxes; nothing says the engines are different silicon, or how much of each a card has |
| 31 | 20 Workloads | The same `GpuEngines` figure with a workload picker | no | 6 | refine | Same as 30; the picker helps |
| 32 | 25 AWS Batch | The states an AWS Batch job passes through | no | 6 | refine | A state list; the timeout bracket is the one thing it teaches |
| 33 | 25 AWS Batch | The vCPU gauge of a compute environment: floor, ceiling, needle | no | 6 | refine | Correct and tiny; no numbers on it |
| 34 | 26 AWS PCS | Job states in squeue beside node states in the PCS scaling log | no | 6 | refine | Two state lists side by side; time is the missing axis |
| 35 | 2 Getting Started | The sections of the dive in eight parts, with three reading routes | no | 6 | refine | A working selector; one label is clipped ("26 Parallel Computing Servic") and the gate reports the overlap |
| 36 | 3 Robot as Computer | The SO-101 follower arm as inputs and outputs | no | 7 | keep | Shows the arm and its six joints; put the real capture beside it |
| 37 | 3 Robot as Computer | Three loops at three rates: policy, host loop and servo loop | yes | 7 | keep | Chunk cells, ticks and a stepped goal against the measured angle |
| 38 | 4 Demonstrations | Two valid ways round an obstacle, and their average | no | 7 | keep | The picture is the argument |
| 39 | 5 VLA | Releases of five robot-model lines, January 2025 to November 2026 | no | 7 | keep | A real time axis; filled against hollow carries "can you download it" |
| 40 | 6 World Models | Published time to imagine one candidate future, log axis | no | 7 | keep | Real quantities, and the bracket marks the one like-for-like pair |
| 41 | 7 JEPA | A spread latent space against complete collapse and dimensional collapse | no | 7 | keep | Shows the thing; add the loss value under each panel |
| 42 | 7 JEPA | Planning with the cross-entropy method: sampled futures narrow onto the goal latent | yes | 8 | keep | The best concept figure in the dive: the sampling circle visibly shrinks and moves |
| 43 | 9 Collecting | Frames a decoder must decode to return one requested frame, at two keyframe spacings | no | 8 | keep | The cells are the frames; the bracket is the cost |
| 44 | 12 Physics | Physics steps per second on one core, a whole CPU and one GPU, log axis | no | 7 | keep | Real axis, own measurements marked apart from vendor figures |
| 45 | 13 Rendering | What one camera per environment costs in throughput and GPU memory | no | 7 | keep | Two honest bar pairs with the card's 96 GB drawn as a limit |
| 46 | 14 Sim-to-Real | Closing the gap between what the simulator produces and what the bench produces | yes | 7 | keep | Distributions that move and widen; pair it with the randomisation capture |
| 47 | 15 Training Scales | Published training runs on one log axis of GPU-hours, in three bands | no | 7 | keep | Five orders of magnitude on one axis |
| 48 | 16 Evaluation | 95% Wilson intervals for 40 of 50 and 45 of 50, overlapping | no | 8 | keep | The overlap band is the lesson |
| 49 | 17 On Robot | The latency budget from frame capture to motor command, in control periods | no | 7 | keep | Measured bars in the unit the robot cares about |
| 50 | 17 On Robot | Action chunks played against the control clock while the model computes the next chunk | yes | 7 | keep | The queue drains against a clock and the arm stops |
| 51 | 19 Agents | Robot and GPU utilisation, hours and tokens for 1, 4 and 8 agents | no | 7 | keep | Plain bars of real numbers |
| 52 | 20 Workloads | The robot's loop in six stages (`LoopOnAws`) | yes | 8 | keep | Pictograms, loads, service and hand-off per stage |
| 53 | 21 PMU Cards | A sample PMU card: the physics step on one Cortex-X925 core | no | 7 | keep | The artefact itself, annotated |
| 54 | 22 Measurements | Three cards for the physics step stand-in | no | 7 | keep | Own data; the stacked bars carry the comparison |
| 55 | 22 Measurements | Three cards for the policy inference stand-in | no | 7 | keep | Same |
| 56 | 22 Measurements | Three cards for the camera render stand-in | no | 7 | keep | Same |
| 57 | 24 AWS Orchestration | The loop on AWS (`LoopOnAws`) | yes | 8 | keep | Sets the bar for stage figures |
| 58 | 25 AWS Batch | The Batch cluster (`Cluster`): array job, two compute environments, Spot reclaim | yes | 9 | keep | Instances appear, a Spot notice lands, the checkpoint moves to S3, the cluster drains to zero |
| 59 | 26 AWS PCS | The PCS cluster (`Cluster`) | yes | 9 | keep | Same, with the always-on login node |
| 60 | 27 HyperPod | The HyperPod cluster (`Cluster`) | yes | 9 | keep | Eight GPUs per node drawn as eight chips |
| 61 | 28 EKS | Three ways to share one GPU between pods: time-slicing, MPS and MIG | no | 7 | keep | Small, and the picture is the definition |
| 62 | 28 EKS | The EKS cluster (`Cluster`) | yes | 9 | keep | Same |

Measurements also wraps one HTML table in a `Figure` (the GPU kernel table, `F08-71 F08-72`); it is a table and
is left out of the count.

---

## Redesigns: the six the owner or the brief named

### 1. Section 29 Choosing: the decision path (score 3, rebuild)

**What is wrong.** This is the figure the owner called "a decision graph". Six questions, nineteen answer boxes,
1,500 px tall. It does not show "what we should get out from this": the reader finishes it without seeing where
the fifteen workloads of section 20 land, or which choices are common and which are rare.

**Redesign: a placement map, the workloads plotted on the axes that decide.** One figure, three linked panels on
a 1240 px canvas. The fifteen workloads of section 20 are fifteen dots, each with its `LoopOnAws` stage pictogram
and its palette colour for the part it loads. The same fifteen dots appear in all three panels; hovering or
tapping one highlights it in all three and prints its row under the figure.

- **Panel A, machine family.** A matrix. Columns (x): the part that fills first, in the palette order: CPU cores,
  ray-tracing cores, tensor cores on one GPU, tensor cores on many GPUs. Rows (y): deadline per unit, two rows,
  "the robot's clock" on top and "no deadline" below. Each cell is tinted and titled with its answer (Graviton
  CPU, G family, one-GPU G size, P family with EFA, "runs on the robot"). The dots sit in their cells. The reader
  sees at once that the top row holds two workloads and the P-family cell holds two or three.
- **Panel B, orchestrator.** Two real axes. x: units per submission, log scale, 1 to 10,000 (the array job limit
  of 10,000 children is the right edge, `F10-23`). y: nodes that must start together, log scale, 1 to 64. The
  plane is cut into four labelled regions with soft fills: bottom right "array job: Batch, or EKS Jobs", top left
  "gang-scheduled: HyperPod, PCS, EKS with Kueue", bottom left "one container: Training Job or Batch", and a
  hatched band "all day, several teams: a held cluster with quotas". The dots land where their numbers put them
  (evaluation: 500 seeds x 1 node; VLA pretraining: 1 submission x many nodes).
- **Panel C, capacity market.** x: work lost if the machine goes, in minutes, log scale from 1 minute to 4 days,
  with a vertical line at 30 minutes (the threshold already in the figure). y: three bands, "any date", "fixed
  dates on a G type", "fixed dates on a P type". Regions: Spot with a retry (left of 30 minutes), On-Demand with a
  type list or Spot with checkpoints (middle), reserve or On-Demand (right), Capacity Block or training plan (top
  band, P type).

**Under the figure:** the selected workload's row as one sentence, "Evaluation: one-GPU G size, array job on
Batch, Spot with a retry", built from the three cells.

**Numbers.** Entries the figure already cites: `F09-11 F09-91 F09-35 F09-81 F06-60 F08-78 F10-200 F10-208`. The
positions of the dots come from section 20's table of fifteen workloads; any dot whose units or duration has no
register entry is drawn in its region with a hollow marker and the legend line "placed by shape, no published
count".

**390 px.** The three panels stack. Panel A becomes a 4-row list of cells with the dots inline. Panels B and C
keep their axes at 360 px wide with pictograms only (no dot labels); the selected workload's sentence carries the
names. The six questions survive as the axis titles, which is where they belong.

**Keep from the old figure:** the six questions, as an `ExpandableSection` checklist under the map.

### 2. Section 6 World Models: pixel generator against latent predictor (score 5, rebuild)

**What is wrong.** Two columns of boxes ("VAE encoder", "Transformer", "Predictor"). The frame is a stick cartoon,
the latent is eight blue squares, and the right column ends in an empty dashed box saying "nothing to watch". The
section's argument (a pixel model must predict the glint on the cup and the table texture; a latent model may
drop them) is not in the picture at all.

**Redesign: "what each family has to get right", on a real frame.** Landscape canvas, three bands.

- **Top band, shared input.** A real capture: frame 3 of `so101-episode-strip.jpg` (gripper over the block) as
  "camera frame now", beside the action drawn as six small bars (the six joint targets, the `ActionChunk` glyph
  with one column). An arrow splits to the two families.
- **Left, pixel family.** The frame is cut into its compressed grid drawn to count (a visible grid over the image,
  one cell per latent position). The denoiser is drawn as a filmstrip of the output frame at four noise levels,
  left to right, noise resolving into frame 4 of the episode strip (apply an SVG `feTurbulence` plus blend filter
  over the real still, strength stepping down; no generated image is claimed). Under it a pass counter: one tick
  per denoising pass. Then the output: the next frame, every pixel. An overlay on that output marks three regions
  with outlines and labels: "block position: needed", "glint on the cup: predicted anyway", "table texture:
  predicted anyway".
- **Right, latent family.** The same frame goes into the encoder and comes out as the `Latent` glyph: a short
  strip of cells. From it, one arrow through the predictor (one tick on the pass counter) to the predicted next
  latent. Beside it, the *real* next frame goes through the same encoder to give the target latent, and the two
  strips are laid one above the other with the difference per cell drawn as small bars: "the planner's score is
  this distance". No image comes out; in its place, the same three region labels with "block position: kept",
  "glint: dropped", "texture: dropped" drawn as a faded ghost of the frame where only the arm, block and cup
  silhouettes remain (use the segmentation pane of `so101-render-passes.jpg` as that ghost, labelled "an
  illustration of what a latent may keep, not a decoded latent").
- **Bottom band, the number.** One horizontal time bar per family on a shared axis, seconds per planned action on
  one RTX 4090: 4 minutes for the video model, 16 seconds in latent space (the section's number, from the V-JEPA
  2 paper section 4.2; the author confirms the entry ID in `revamp/claims/world-models.md`, the chart below cites
  `F03-74` for the same paper).

**Animation, 6 steps.** (1) The frame and the action. (2) Left: the grid appears on the frame. (3) Left: the
filmstrip resolves, the pass counter fills. (4) Left: output frame, three outlines appear. (5) Right: encoder,
one predictor pass, predicted and target strips, difference bars. (6) Bottom: the two time bars grow at the same
rate, the latent bar stops at 16 s while the pixel bar runs on to 240 s.

**Numbers.** `F03-96 F03-106 F03-109` (already cited) for the two pipelines; the 16 s and 4 min pair from the
V-JEPA 2 entry.

**390 px.** Stack: input, pixel family, latent family, time bars. The filmstrip shows 3 frames in place of 4. The
region labels move under the frame as a three-row legend keyed by outline colour.

### 3. Section 7 JEPA: clip to tubelets to tokens to latents (score 6, rebuild)

**What is wrong.** The numbers are right (16 frames, 256 x 256, 2 x 16 x 16 tubelets, 2,048 tokens, 1408 numbers
each). The drawing is five yellow squares, a 4 x 4 grid with one blue cell, and fourteen little rectangles. The
reader cannot see a tubelet.

**Redesign: an exploded clip in isometric view.** One landscape picture, read left to right.

- **The clip as a block.** Sixteen frames drawn as a stack in 2.5-D (each frame a parallelogram, offset back and
  up), with real captures on the faces: use six frames of `so101-episode-strip.jpg` repeated to fill sixteen, or
  better, sixteen frames sampled from `so101-pick-place.mp4` at 4 frames per second (4 s of the 8.2 s clip). Three
  dimension lines with ticks: 256 px, 256 px, 16 frames (4 s at 4 frames per second).
- **One tubelet pulled out.** A 16 x 16 pixel square two frames deep is highlighted in the stack in emphasis blue
  and drawn again, enlarged, lifted out along a leader line: a small slab showing two frames' worth of real
  pixels (crop the capture; at 16 x 16 it is a blur of yellow arm and grey table, which is the point). Label:
  "one tubelet: 2 frames x 16 x 16 pixels = 512 pixels x 3 colours".
- **The count, drawn.** The stack re-drawn as a lattice of tubelets: 16 by 16 on the face, 8 deep, with the
  arithmetic on the dimension lines themselves: 256 / 16 = 16, 256 / 16 = 16, 16 / 2 = 8, and 8 x 16 x 16 = 2,048.
- **Tokens to latents.** The lattice unrolls into a ribbon (first 12 cells drawn, then an ellipsis, then "2,048").
  Through the encoder (one green slab, "ViT-g, 1B parameters, 40 layers"). Out: the same ribbon, each cell now a
  tall thin column standing for 1,408 numbers, with one column enlarged as the `Latent` glyph. The highlighted
  tubelet keeps its blue outline all the way through, so the reader follows one piece of the picture from pixels
  to vector.
- **A scale bar at the bottom:** pixels in (16 x 256 x 256 x 3 = 3.1 million numbers) against numbers out (2,048
  x 1,408 = 2.9 million numbers), labelled as our arithmetic. It makes a point the prose can use: the encoder does
  not shrink the clip, it re-describes it.

**Numbers.** `F03-3 F03-4 F03-11` (already cited). The two products are derived values; mark them as such.

**390 px.** Vertical: stack on top, pulled-out tubelet to its right, lattice below, ribbon below that. Dimension
labels stay at 12 units.

**Static or animated.** Static, with one optional interaction: tap a tubelet position to move the blue highlight.

### 4. Section 7 JEPA: one training step (score 6, refine)

**Keep:** the two-branch layout, the blue gradient path, the stop-gradient bar, the EMA arrow with 0.075%.

**Change.** The masked clip is the heart of the method and is drawn as three rows of grey cells. Replace the
"clip tokens" strip with the tubelet lattice from figure 3 at small size, real capture on the face, with a
contiguous block masked out (grey, hatched). The context encoder receives the lattice with the hole; the target
encoder receives the full lattice. The four "predicted latents" and four "target latents" become `Latent` glyphs
positioned where the masked tubelets were, so the reader sees the predictor filling the hole in latent space.
Under the loss box draw the L1 distance as it is computed: two strips, the absolute difference per cell as bars,
their mean as one number (toy values, labelled as an illustration). In the EMA step, draw theta-bar as a dot
chasing theta along a line and moving 0.075% of the gap (exaggerate the step and say so).

**Numbers.** `F03-2 F03-8`. **390 px:** unchanged stack; the lattice is 120 units wide.

### 5. Section 7 JEPA: planning with the cross-entropy method (score 8, keep, one addition)

The latent-space panel is right. Add a second, narrower panel on the right, synchronised with it: the *action*
distribution the planner is fitting. x: the sideways move in cm, y: density. Step by step it shows the bell at
mean 0, spread 5; eight sample ticks; the three elites kept; the refit bell at mean -7, spread 1. That is the toy
example of the paragraph above the figure, drawn (the values are already labelled as toy values there). Print the
real settings as the footer of the panel: 800 samples, 10 iterations, top 10 kept, horizon 1 (`F03-23 F03-113
F03-24`). At 390 px the action panel goes under the latent panel.

### 6. Section 7 JEPA: predictor passes per decision (score 6, refine)

Each bar is a product of three numbers that the figure prints as small text. Draw the product: each planner is a
block of `samples x iterations x horizon` on three log dimensions, flattened to a row of three proportional
segments (samples in blue, iterations in green, horizon in purple, each segment length log-scaled and labelled),
ending at the total on the same log axis as now. The reader sees that RoboJEPA's 204,800 is all samples (4,096)
and V-JEPA 2.1's 36,000 is horizon. Then add a right-hand axis the reader cares about: seconds per decision at
the published time per pass, where a like-for-like figure exists in the register; leave it blank with "no
published time" where it does not. Entry: `F03-115`. At 390 px the segments stack under each label.

### 7. Section 4 Demonstrations: single-step drift against chunks (score 6, rebuild)

**What is wrong.** A yellow band, a grey path that leaves it, a blue path that stays. The outcome is shown; the
mechanism is not. Why does the error grow? Because the policy leaves the band and has never seen what the world
looks like from there. And a chunk is drawn only as a bigger dot.

**Redesign: two linked panels, the workspace on top and the error below, on the section's own numbers.**

- **Top panel: the workspace, top-down.** Use the overhead camera view as a faint backdrop (the colour pane of
  `so101-render-passes.jpg`, at 25% opacity) so the band is a place and not an abstraction. Draw the 50
  demonstrations as 50 thin brown paths from start to block (generate them as one spline plus smooth noise; label
  "50 demonstrated paths, illustrative"). Their envelope is the band; their density shades it, darker in the
  middle. Outside the band the backdrop is hatched and labelled "no demonstration ever went here: the policy has
  no data for what it sees".
- **The single-step run.** A grey path of decisions. Each decision is a dot with a short arrow (the action). At
  each dot, draw a faint cone ahead of it: the spread of where the next step may land. Inside the band the cone
  is narrow; from the first dot outside the band the cone doubles at every step. That widening cone is the
  quadratic term.
- **The chunked run.** A blue path where each decision emits a visible *segment*: an `ActionChunk` strip bent
  along the path, 50 cells long, so one decision covers a stretch of the path. Four segments reach the block,
  against twelve dots for the grey run (keep the current counts) or, better, the section's real ratio.
- **Bottom panel: the bound.** x: decisions made, linear, 0 to 600. y: mistakes allowed by the ceiling, 0 to 360.
  Two curves from the paragraph above the figure: the straight line `T x epsilon` reaching 0.6 at T = 600 and the
  parabola `T^2 x epsilon` reaching 360, with epsilon = 0.001 (toy value, labelled). A vertical marker at T = 600
  "one action per decision" and one at T = 12 "one chunk of 50 per decision" (600 / 50 = 12, ceiling 144 x 0.001
  = 0.144). The two markers are tied to the two runs above by colour.

**Animation, 7 steps.** (1) The 50 paths draw in and the band fills. (2) Grey run, three decisions inside the
band, narrow cones. (3) One small error; the dot touches the edge. (4) The dot is outside; cone doubles; the
bottom panel's marker climbs the parabola. (5) Grey run ends away from the block. (6) Blue run: four segments,
each laid down whole. (7) Bottom panel: the T = 12 marker sits at 0.144, the T = 600 marker at 360.

**Numbers.** `F02-67` (already cited) for the chunk of 50; the 600, 0.001, 0.6 and 360 are the toy and derived
values of the paragraph above (keep their Toy and Derived styling in the labels).

**390 px.** Panels stack; the bottom panel uses a log y axis so 0.144 and 360 are both readable, and says "log
scale".

**A capture that helps:** put `so101-episode-strip.jpg` directly above this figure as "one demonstration, six
moments", so the band is tied to an arm the reader has seen.

### 8. Section 4 Demonstrations: flow matching, noise to chunk (score 6, rebuild)

**What is wrong.** Fifty dots settle onto one curve. It shows that noise becomes a curve; it does not show what
the network computes (a direction for every point), nor the claim in the caption that a different noise draw ends
on a different valid chunk, which is the reason the head exists (it is the answer to the obstacle figure just
above).

**Redesign: three linked views of the same 10 steps.**

- **Left, the chunk as a curve** (the current view, kept): x is robot time, the 50 actions of one chunk (0 to
  1.67 s at 30 per second, `F02-67`); y is the target angle of one joint in radians. Add the velocity arrows: at
  every dot a short arrow showing the direction the network outputs at this step. Arrows are long at step 0 and
  shrink to nothing at step 10.
- **Middle, two samples.** Draw two noise draws at once, blue and purple. They start interleaved and end on two
  different smooth curves: one the "far side" way, one the "near side" way, with the average of the two drawn as
  a dashed grey curve that neither sample lands on. This closes the loop with the obstacle figure: same two
  modes, same forbidden average.
- **Right, the chunk as the tensor it is.** A 50 x 6 heat map (rows: the six SO-101 joints, columns: the 50
  actions), value mapped to a blue-white-brown scale. At step 0 it is static; by step 10 each row is a smooth
  gradient. A caption line: "the model's tensor is 50 x 32; columns 7 to 32 are padding" (`F02-23`, cited by the
  VLA figure). The row plotted on the left is outlined.
- **Under all three, the integration clock:** a bar from t = 0 to t = 1 in ten ticks, the current tick marked,
  and the toy arithmetic of the paragraph above as a live readout for one highlighted dot: 0.80, 0.74, 0.68, ...
  0.20 (toy values, labelled).

**Animation: 6 steps** (noise; steps 2, 4, 6, 8; step 10), as now, with the arrows shown before each move.

**Numbers.** `F02-18 F02-20`. The curves stay hand-drawn and say so. **390 px:** stack the three views; the heat
map keeps 50 columns at 6.5 px each with no cell text.

**A companion for the diffusion policy sentence** ("10 steps where Diffusion Policy trains with 100 iterations",
`F02-16`): a two-row strip under the figure, one tick per network pass, 10 ticks against 100, on one axis. It is
the practical point and costs 40 px.

### 9. Section 5 VLA: pi0 as blocks (score 5, rebuild)

**What is wrong.** A box-and-arrow diagram whose content is the text inside the boxes. The shapes (640 x 480, 6
padded to 32, 50 x 32) are written and never drawn.

**Redesign: a token-flow picture where every tensor is drawn to its shape.**

- **Inputs as the things themselves.** Two real camera images side by side from `so101-policy-views-poster.jpg`
  (overhead and wrist), each with a patch grid drawn over it and "640 x 480" on a dimension line. The instruction
  as a literal sentence in a speech-box, split into word chips ("put", "the", "block", "in", "the", "cup"). The
  state as six bars (the six joint angles), followed by 26 hollow cells: "zero-padded from 6 to 32".
- **The prefix.** The patches fall into a horizontal token ribbon (yellow cells), the word chips into the same
  ribbon (white cells): one sequence. The ribbon runs through the backbone, drawn as a wide green slab scaled by
  parameter count. Its exit is marked "computed once per call, then cached" with a lock glyph.
- **The action head, to scale.** A second green slab whose *area* is one tenth of the backbone's (300M against
  3B). Inside it, the `ActionChunk` tensor as a 50 x 32 grid (cells 6 px), shown three times left to right: pure
  noise, half resolved, resolved, with "10 steps" on the arrow and a thin line from the cached prefix ribbon into
  each of the three (the head re-reads the prefix at each step; the backbone does not run again).
- **Output.** The resolved 50 x 32 grid with columns 1 to 6 in the robot colour and columns 7 to 32 hatched
  ("padding, dropped"). The six live columns peel off to the right and become six small joint curves over 50
  ticks, ending at a clock label "played at 30 per second: 1.67 s of motion".
- **A cost strip along the bottom:** backbone, 1 pass; action head, 10 passes. Two tick rows on one line. It
  prepares section 17's latency budget.

**Numbers.** `F02-18 F02-20 F02-23 F02-29 F02-32 F02-67` (already cited). The token counts per image are not in
the cited entries: draw the patch grid without a count unless the register has one.

**390 px.** Vertical flow: images, ribbon, backbone slab, head slab with the three grids stacked, output curves.
The 50 x 32 grid rotates to 32 wide by 50 tall at 9 px cells so it fits 360 px.

### 10. Section 5 VLA: two clocks (score 6, refine)

Put both systems on one shared time axis of one second. Top lane: 10 plan blocks, each 100 ms wide. Bottom lane:
120 action ticks. Vertical hairlines drop from each plan boundary so the reader counts 12 actions under each
plan. Animate a playhead; when a new plan arrives mid-way the actions switch colour at that tick (the current A
and B colouring, kept). Add the staleness the two-rate design creates: a small bracket "this action was computed
from a plan up to 100 ms old". Entry `F02-33`. At 390 px show 500 ms in place of one second.

### 11. Section 12 Physics: one physics step (score 5, rebuild)

**What is wrong.** Four text boxes highlight in turn while a stick arm changes by 0.005 rad and a "State" panel
changes three numbers. The brief wanted the step itself. None of the four stage groups is drawn: no kinematics,
no contact, no force, no integration.

**Redesign: one scene, four overlays, one ledger.** A landscape canvas with the scene on the left (60%) and the
state ledger on the right (40%); a four-segment progress rail under both (Position, Velocity, Force and
acceleration, Integrate: MuJoCo's four groups of the 26 stages, `F06-9`).

- **The scene.** Start from the real capture: `so101-contact.jpg` is the grasp close-up with transparent bodies,
  contact points and contact force arrows as MuJoCo draws them. Use it as the base image of the scene panel, with
  an SVG overlay on top for what each stage adds. (If the base image must be a drawing for the overlay to
  register, trace the two fingers and the cube from the capture and keep the capture as a thumbnail labelled "the
  same moment in MuJoCo".)
- **Step 1, Position.** Overlay: the kinematic chain as a skeleton of frames (a small axis triad at each of the
  six joints, computed outward from the base, appearing one by one). Then the collision pass: the two fingertip
  boxes and the cube get bounding outlines; where they overlap, a contact point appears with its normal. Ledger:
  "6 joint angles in, 13 body poses out, 2 contacts found" (use the counts the capture shows; label them as this
  scene's).
- **Step 2, Velocity.** Overlay: a curved velocity arrow at each moving joint, length proportional to speed, and a
  smaller opposing arrow: the damping torque. Ledger: elbow speed 1.000 rad/s, damping torque with its sign.
- **Step 3, Force and acceleration.** Overlay: the motor torque as a thick curved arrow at each actuated joint;
  gravity as a down arrow on the cube; then the constraint solve, drawn as iteration: the contact force arrows
  start at zero and grow over three sub-frames until the cube's net acceleration arrow shrinks to zero (it is
  held). Friction cone drawn at one contact as a small cone with the force arrow inside it. Ledger: a solver
  residual bar that falls; "contact forces: the unknowns of the step".
- **Step 4, Integrate.** The picture changes to a **phase plot** inset for the elbow: x is angle (rad), y is speed
  (rad/s). One dot at (0.50000, 1.000). An arrow up by acceleration x 0.005, then an arrow right by new speed x
  0.005, landing on (0.50505, 1.010). The two arrows are the two lines of semi-implicit Euler; the inset says
  which is which. Ledger: the two formula lines with the numbers substituted.
- **Step 5, the clock.** A strip under the rail: 200 physics ticks in one simulated second with 10 policy ticks
  above them (20 substeps per policy step, the paragraph's arithmetic). The one step just watched is one tick of
  200, highlighted.
- **Step 6, the batch.** The scene panel shrinks into one tile of a grid of identical tiles (8 x 8 drawn,
  labelled "x 4,096 worlds on one GPU" with the entry the section uses for the batch size), handing over to the
  throughput chart below.

**Numbers.** `F06-9 F06-105` (already cited) for the stage groups and the integrator; the 5 ms, 200, 20 and 10
are the section's own derivations. The state values stay "illustrative values, one joint of many".

**390 px.** Scene on top at full width, ledger below as a three-row strip, rail below that. The phase plot
replaces the scene in step 4 at full width.

### 12. Section 13 Rendering: rasterising and ray tracing (score 5, rebuild)

**What is wrong.** A side view with a one-dimensional "image" of ten cells. The reader never sees an image form,
and never sees the difference the two methods make in the picture (the shadow). The last step's "every pixel,
every camera, every environment" is a row of orange squares.

**Redesign: a split view, the scene in 3-D on the left and the image being formed on the right.**

- **Left: the scene in a 2.5-D oblique view.** Table plane, the block drawn as a cube of 12 visible triangles
  (mesh lines shown), the cup as a faceted cylinder, a light as a small sun above right, the camera as a frustum:
  the eye point plus an image plane drawn as an 8 x 8 grid floating in front of it. This is the real thing a
  renderer holds.
- **Right: the image, large.** The same 8 x 8 pixel grid drawn at 280 px square, empty at the start. Beside it, as
  ground truth, the colour pane of `so101-render-passes.jpg` at thumbnail size: "what the finished image looks
  like at 640 x 480".
- **Raster half (steps 1 to 3).** (1) One triangle of the block lights up; three dashed lines project its
  corners onto the image plane; on the right the three projected corners appear as points on the pixel grid. (2)
  The pixels whose centres fall inside the projected triangle fill: on the right the triangle's coverage is
  drawn with the pixel centres as dots, covered ones filled. (3) Repeat for every triangle; a depth value per
  pixel settles which one wins (show the depth pane of `so101-render-passes.jpg` as the thumbnail for this step:
  it is the real depth buffer of the same frame). The image is complete and flat-lit: no shadow of the cup on
  the block.
- **Ray half (steps 4 to 6).** (4) One ray leaves the eye through one pixel centre and travels until it hits the
  block; the hit point is marked. To find that hit the ray is tested against boxes, then triangles: draw the
  bounding boxes around the block and the cup, and light only the boxes the ray enters (this is what the RT cores
  of the `GpuEngines` figure do, and the caption says so). (5) From the hit point a shadow ray goes to the light
  and is stopped by the cup: the pixel on the right is painted dark. A second pixel's shadow ray reaches the
  light: painted lit. (6) All 64 pixels: 64 primary rays fan out, the image fills with the cup's shadow in it.
  The two finished 8 x 8 images sit side by side: same scene, one with the shadow.
- **Step 7, the multiplication, drawn.** A small ledger with real factors on a log bar: 64 x 64 pixels per image
  (the wrist camera of the shipped task) x rays per pixel x environments, ending at rays per policy step; then the
  measured consequence as the two bars already in the chart below (152,124 against 1,023,698 frames per second,
  57.3 GB against 0.93 GB).

**Numbers.** The animated figure currently has no `cites` attribute for its counts: give it the 64 x 64 entry
used in the prose (MuJoCo Playground SO-101 task) and `F06-47 F06-48 F06-58` for the closing ledger. The 8 x 8
grid is labelled "drawn at 8 x 8; the task renders 64 x 64".

**390 px.** Scene above, image below, each 360 px wide. The frustum's image plane keeps its 8 x 8 grid at 9 px
cells.

**Also place, as a `Capture` directly under this figure:** `so101-render-passes.jpg` at full width with the
caption "one overhead frame as colour, depth and per-body segmentation": the three outputs a simulator's camera
hands the trainer. It is the real thing and the section does not show it.

### 13. Sections 13 and 20: `GpuEngines`, one GPU card as engines (score 6, refine)

The six equal boxes say "a card has parts" and no more. Redraw as a card: a board outline with a die in the
middle, and on the die six regions whose *relative sizes are explicitly schematic* (say so on the figure): a
large tensor and general compute field drawn as a grid of small SM cells, RT units drawn as their own tiles (place them only as a first-party source in the
register describes; `[SPECULATIVE]` if drawn inside the SM cells without one), and the NVENC and NVDEC engines as separate small
blocks at the die edge with their count printed where the register has one for the card in question. GPU memory
is drawn off the die as the memory chips around it, with capacity in GB. The workload picker then lights regions
and draws a utilisation fill in each (full, part, none) plus a fill bar on the memory. Entries: `F08-36 F08-42
F08-43` plus the picked workload's. At 390 px the card is 360 px wide, the legend goes below.

---

## Redesigns: the rest under 7

### 14. Section 8 Robot RL: three lanes (score 4, rebuild)

A 3 x 3 table (plentiful, scarce, waits on) drawn as boxes. **Redesign: one time axis, three lanes, attempts as
marks.** x: wall-clock time, one shared log axis from 1 second to 1 day. Lane 1, simulator: a dense field of
ticks, 4,096 arms stepping together, with the 197 million control steps written as the total at the lane's end
(`F04-58`). Lane 2, pretrained policy: 64 to 320 copies on 8 GPUs, each tick wider because each step runs a
large model (`F04-69 F04-70`). Lane 3, real arm: one long block per attempt, 20 s of motion then 5 s of reset
drawn as a hatched gap, with a person glyph on the reset (`F04-77 F04-76`). Above each lane, a small pictogram
row: 4,096 tiny arms (a dot grid), 8 GPU chips, one arm plus one person. The bottleneck of each lane is the
thing that visibly takes the width: the step, the model call, the reset. Right margin: attempts per hour per
lane, computed and labelled as derived. At 390 px each lane is a card with its own 340 px strip on the same
axis.

### 15. Section 16 Evaluation: the ladder (score 4, rebuild)

Four stacked text boxes holding correlation values. **Redesign: put the rungs on the axis they are measured on.**
x: correlation with real-arm success, r from 0 to 1. y: four rows (open-loop error, closed loop in simulation,
world-model scoring, real-arm trials). Open-loop: one dot at 0.308. Simulation: dots at 0.9 and 0.924. World
model: a range bar 0.78 to 0.989 with "as reported by each tool's author" on the bar. Real arm: the reference
line at 1.0. A second, narrow column on the right gives cost per evaluation as a relative bar where the register
has it, blank otherwise. Then beside the chart, as the thing itself: `so101-eval-grid.jpg` (twelve replays, 8 of
12 in the cup, green and red borders) captioned as what "closed loop in simulation" looks like, tied to its row
by a leader line. Entries `F06-81 F06-83 F06-89 F06-90`. At 390 px: chart, then the capture under it.

### 16. Section 16 Evaluation: open loop against closed loop (score 5, rebuild)

Box-and-arrow twice. **Redesign: the same policy on the same episode, two trajectory plots.** Shared axes: x time
in control steps, y one joint's angle. Top plot, open loop: the recorded trajectory as a brown line; at every
step the policy's predicted action as a short blue stub starting *on the recorded line* (it is always reset to
the recording); the stubs' small errors are shaded and summed to "action error: small". Bottom plot, closed
loop: the blue line starts on the brown one and is fed its own output; it peels away, and at the end a marker
"block in the cup: no". The visual point: identical per-step error, different outcome, and the top plot cannot
see it. Label as an illustration. Place `so101-eval-grid.jpg` here if not used in the ladder. At 390 px the two
plots stack.

### 17. Section 11 Augmentation: one episode, three kinds of data (score 4, rebuild)

Three text cards. **Redesign: show the image being changed.** A row of real frames. Left: one overhead frame,
"the recorded episode". Then three branches, each a strip of three frames: (1) image transforms: the same frame
with brightness, crop and colour shifts applied in SVG filters, arm pose identical, outlined "motion untouched";
(2) replay in a simulator: three panes of `so101-domain-randomisation.jpg` (block moved, light moved, floor
changed), with the block's start positions overlaid as dots, "physics checks it, successes are kept"; (3) world
model: a frame slot with a dashed border and the label "generated; no physics check", using no capture (the dive
has no generated clip of its own; say so, and leave the slot for the owner's recording). Under each branch one
real quantity on a bar: milliseconds per image and 2.4 GB at batch 160; 15 minutes and 1 hour per 1,000
demonstrations; 207.78 s per 720p clip (`F05-87 F05-90 F03-98 F05-108`). The three bars share a log time axis
"time to make one new sample", derived where needed and labelled. At 390 px each branch is a full-width row.

### 18. Section 10 Curating: the pipeline (score 4, rebuild)

A list of stages. **Redesign: a funnel of clips.** Draw 24 clip thumbnails entering at the left (small frame
glyphs; use the six panes of `so101-episode-strip.jpg` as their content). Each stage is a column they pass
through, and the clips change visibly: cut at shot changes (a clip splits in two), transcoded (border changes),
motion filter (a still clip drops out, greyed, falling below the line), aesthetic filter (a dark clip drops
out), embedded (a `Latent` glyph attaches to each survivor), captioned (a short text chip attaches), deduplicated
(two clips with matching latents merge). Under each column, the machine part as a palette bar with the per-worker
figure already in the figure (CPU 3, GPU 0.25, CPU 5, GPU 0.5, GPU 0.25, GPU 0.25, CPU 3), drawn as a stacked
resource bar per worker so the columns can be compared. The count of surviving clips is printed under each
column and labelled illustrative unless the register has a pass rate. Entries `F05-69 F05-70 F05-71 F05-73
F05-77`. At 390 px: the funnel turns vertical, 6 clips wide.

### 19. Section 18 Fleet: episodes to S3 and back (score 4, rebuild)

Five boxes and a return arrow. **Redesign: merge it into the rollout figure as one fleet picture with a time
axis.** A row of 20 arm tiles (the tiles the rollout figure already has) at the bottom; S3 as the cylinder glyph
from `Cluster.tsx`; a training block drawn with GPU chips. Episodes are small file glyphs (a row strip plus a
film strip) that rise from individual arms at their episode boundaries. A horizontal time ruler across the top
carries the two published medians as measured spans: 41 s arm to learner, 38 s back to a robot (`F07-102 F07-108
F07-109 F07-172`), with "one fleet, median" on each span. Animation: episodes leave three arms, land in S3, the
training block lights, a policy tile (version chip) travels down through the canary group first. The return leg
*is* the staged rollout figure, so end on its first frame and point to it. At 390 px: 10 tiles per row, ruler on
top.

### 20. Section 18 Fleet: staged rollout (score 6, refine)

Keep the tiles and the abort. Replace the three text boxes above them with drawn objects: the image as a tile
with its digest chip, the rate as a small step chart (devices per minute over time, with the configured rate as
the slope), the abort rule as a threshold line on a failure-count gauge that the two red tiles push over. Entries
`F07-90 F07-93 F07-95 F07-129 F07-162 F07-164 F07-165`.

### 21. Section 1 One Loop: the eight-stage ring (score 5, rebuild)

It is the first figure of the dive and the weakest loop in it; `LoopOnAws` now draws the same idea better.
**Redesign:** reuse the `LoopOnAws` card grammar (pictogram, one sentence, "loads" chip) without the AWS row, and
put a real picture in the centre: `so101-scene.jpg`, or the pick-and-place clip (`so101-pick-place.webm`) playing
muted in the ring's centre under reduced-motion rules. Reconcile the stage count with sections 20 and 24: either
eight everywhere or six everywhere with "augment" and "world model" as sub-stages; the reader meets a ring of 8
in section 1 and a loop of 6 in section 20 and has to wonder which is right. Entries `F08-50 F08-75 F08-76
F01-26`. At 390 px the ring becomes the vertical list `LoopOnAws` already uses.

### 22. Section 3 Robot as Computer: delay to distance (score 5, rebuild)

A straight line through three points. **Redesign: draw the distance where it matters.** A to-scale side view of
the gripper approaching the 2.5 cm block (the cube in the captures is 2.5 cm, per `PROVENANCE.md`): the gripper
at "where the camera saw it" and three ghost grippers at +8.3 mm, +25 mm and +62.5 mm for delays of 33.3, 100 and
250 ms at 0.25 m/s, on a millimetre ruler. The 3.6 mm gear backlash is a shaded band at the fingertip. The reader
sees that at 100 ms the gripper has moved one block width, and at 250 ms two and a half. Keep the line chart as
a 120 px inset. Entries `F01-83 F01-84`. A slider for the speed is a cheap, real interaction. At 390 px the
ruler runs 0 to 70 mm across 340 px.

### 23. Section 19 Agents: one station (score 5, refine)

Make the frozen and editable halves the layout: a vertical wall down the middle, "the agent may change" on the
left (code files as file glyphs, the Git branch as a branch line shared across stations), "frozen" on the right
with a lock (grader, reset, safety limits, emergency stop as drawn objects: a pass/fail lamp, the scene with a
reset arrow, a limit box around the arm from `so101-scene.jpg`). The loop (edit, train, run, grade) crosses the
wall in exactly two places, and those crossings are the three calls (start, restart, home) and the grade.
Entries `F04-3 F04-6 F04-7 F04-8 F04-12`.

### 24. Section 17 On Robot: what runs on the Jetson (score 5, refine)

Draw the boundaries the prose is about: the device as a board outline, the container as a box with a visibly
thick wall, and the three hardware paths (GPU, USB camera, servo bus) as wires that pierce the container wall
only through labelled ports ("flags the recipe author writes"); the single outbound connection as one wire
leaving the board upward with an arrowhead on the device side only. Entries `F07-44 F07-120 F07-122 F07-148
F07-153 F07-156`.

### 25. Section 24 AWS Orchestration: three layers (score 5, refine)

Turn the two lists into a 4-column alignment: four vertical lanes (Batch, PCS, HyperPod, EKS, each in its legend
colour), three horizontal bands (queue, node provider, market). Each cell holds the service's own name for that
layer, drawn with the matching `Cluster.tsx` glyph (queue box, instance group box). The market band is shared
across all four lanes with a mark where a market is unavailable to a lane (for example the Slurm-on-HyperPod
Spot note of the HyperPod figure). The reader then reads down a lane to learn one service, across a band to
translate vocabulary. Entries `F10-21 F10-215 F10-206 F10-300 F10-320 F10-401 F10-450`.

### 26. Section 27 HyperPod: two orchestrations (score 5, refine)

Reuse `Cluster.tsx` at thumbnail scale twice, side by side: the EKS-orchestrated cluster (control plane outside
the box, worker groups inside) and the Slurm one (controller group, login group, compute groups all inside). The
difference (where the control plane lives; what scales) is then visible in the same grammar as the figure below
it. Entries `F10-300 F10-302 F10-309 F10-313 F10-329`.

### 27. Section 9 Collecting: one episode exploded (score 6, refine)

Show a row and a frame. In the Parquet block, draw three real rows as a small table with values (6 floats for
action, 6 for state, a timestamp); use `so101-pick-place-joints.json` from the capture experiment for the
values and say so. In the video block, replace the empty cells with the six frames of `so101-episode-strip.jpg`
on a film strip, and draw a hairline from row t to frame t: "row and frame share an index, the rows hold no
pixels". Entries `F05-17 F05-18 F05-22 F05-23 F05-24 F05-29`.

### 28. Section 9 Collecting: where the bytes are (score 6, refine)

Make 257 to 1 an area. One square of 199 GB at full size; inside its corner, the 775 MB square to true area
scale (side ratio 16 to 1, so it is visible). Same treatment for the dataset: the 85.6 MB of video as a
rectangle and the 0.37 MB of rows as a true-scale speck with a magnifier callout. Entries `F05-29 F05-30`.

### 29. Section 10 Curating: decode starving the GPU (score 6, refine)

Add the rates. Each stage gets a "frames per second" readout and the queue between them a level gauge with a
slope arrow; when decode supply is under GPU demand the batch queue drains and the GPU cells go hollow (idle).
Draw GPU utilisation as a small time strip at the bottom that shows the gaps. Use only rates in `F05-39 F05-58
F05-65 F05-67`; where the figure needs a rate the register lacks, use labelled toy values.

### 30. Section 21 PMU Cards: where a slot goes (score 6, refine)

Draw the 400 slots. A 100 x 4 grid (100 cycles wide, 4 slots tall), every cell coloured by its bucket; the
animation sorts the cells into the four buckets, which then become the stacked bar used on every card in
sections 21 to 23 (54, 6, 15, 25%). The tree stays as the legend of the sort. Entries `F08-2 F08-3`.

### 31. Section 23 Price-Performance: units of work per second (score 6, refine)

The section's title promises price and the figure has none. Add the second axis where the register has a price
for the machine: work per dollar, or cost per million units, per core type, as a scatter with throughput on x and
cost on y (both log), one dot per machine per workload. Where no price entry exists, say so on the plot and do
not draw the dot. Entries `F08-61 F08-62 F08-64 F08-73`.

### 32. Sections 25 and 26: job state lists and the vCPU gauge (score 6 each, refine)

Three small figures, one fix: time. Lay the Batch states along a horizontal time axis as a Gantt row for one
child job (RUNNABLE while the instance launches, STARTING while the image pulls, RUNNING under the timeout
bracket), with the retry as a second row. For PCS, two aligned Gantt rows (the job in squeue, its node in the
scaling log) sharing the axis, the 600 idle seconds drawn to scale at the end. For the gauge, print the numbers of
the cluster figure above it (0, 16, and the needle at 4 instances' worth) and animate the needle with the
cluster animation's step. Entries `F10-23 F10-24 F10-25 F10-46 F10-52`, `F10-3 F10-4`, `F10-218 F10-219
F10-221`.

### 33. Section 2 Getting Started: the map (score 6, refine)

Fix the clipped label ("26 Parallel Computing Service" overlaps its route badge; the gate reports it): shorten
to "26 AWS PCS" or widen the cell. Give each part its `LoopOnAws` pictogram so the map shares the dive's
iconography, and draw the chosen route as a connecting line through the cells in reading order so it reads as a
route.

---

## Where a real capture goes (summary)

| Capture in `public/media/` | Goes in | Role |
| --- | --- | --- |
| `so101-scene.jpg`, `so101-pick-place` clip | 1 One Loop (centre of the ring), 3 Robot as Computer (beside the arm drawing) | The arm the dive is about, seen once for real |
| `so101-episode-strip.jpg` | 4 Demonstrations, 7 JEPA (clip stack), 9 Collecting (film strip), 10 Curating (clip thumbnails) | Frames as frames |
| `so101-policy-views` clip and poster | 5 VLA (the two camera inputs) | The two image streams a policy receives |
| `so101-contact.jpg` | 12 Physics (base of the step figure) | Contacts and contact forces as MuJoCo draws them |
| `so101-render-passes.jpg` | 13 Rendering (colour and depth thumbnails; full-width capture under the figure), 6 World Models (segmentation pane as "what a latent may keep") | The renderer's real outputs |
| `so101-domain-randomisation.jpg` | 11 Augmentation (replay branch), 14 Sim-to-Real (beside the distribution figure) | Randomisation as six real scenes |
| `so101-eval-grid.jpg` | 16 Evaluation (ladder and closed loop) | Twelve closed-loop trials, 8 of 12 succeed |

Every use keeps the provenance line: scripted motion, not a learned policy, MuJoCo 4.0.1.
