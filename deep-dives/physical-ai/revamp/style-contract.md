# Style contract: Physical AI prose rewrite (2026-11-24)

Every author and reviewer of the rewrite works to this file. It adds to `revamp/authoring-brief.md` (mechanics:
`Cite`, figures, the check tool, the gates) and overrides it wherever the two disagree about prose. It was derived
from reading the rendered text of the reference sections: `silicon-memory-inference` (Thesis and Framing, Roofline
and Arithmetic Intensity, Memory Hierarchy Primer, KV Cache and FlashAttention, Graviton Deep Dive) and
`rl-agentic-loops` (One Loop, Getting Started, What RL Does to a Model, RLVR & GRPO, Cost per Improvement,
Fine-Tuning & Learning Loops on AWS). Quotes below are from those pages.

## 1. Why this rewrite exists

The owner compared this dive with the two reference dives on 2026-11-24 and found the writing "not of the same
quality": "The current style is sloppy." "I think that this did not have a proper read." His examples, from
section 1: the title "One Robot, One Loop" ("What does that mean?"); the header description "See the whole loop on
one arm before any part is explained, and find the section that answers your question"; the first sentence
"Physical AI is the work of getting a model to act in the world." They are examples of a general fault. Every
title, description, lead sentence, h2, caption and paragraph is suspect in the same way.

Depth does not go down. His words: "we want first of all to increase the depth at the 400 level, but bringing
people there." The reader starts at level 100 to 200 (IT or software; knows models, training, GPUs, containers; no
robotics) and leaves each section at level 400: the mechanism, the numbers, the failure modes, the configuration
choices and why. This is a rewrite of the argument and the sentences, with depth added where a section stops at a
description. It is neither a cut nor a simplification.

## 2. The thesis

**Chosen (framing A, two questions):**

> A robot's learning loop is about fifteen workloads that share an arm and almost nothing else, and each can be
> placed before it is benchmarked by asking two things of it. Which part of the machine does it fill first, which
> picks the instance; and what is its shape (how long one unit of work runs, whether its pieces must exchange data
> while they run, whether it survives losing its machine), which picks the scheduler and the way the capacity is
> bought.

Rejected (framing B, two clocks): every workload answers either to the robot's clock or to a throughput target.
Why A: B separates one workload (the policy on the arm) from the other fourteen and then has nothing to say about
which instance or scheduler any of them needs. A gives the reader the same kind of tool the silicon dive gives
("a way to predict how an inference workload will run on a chip before you benchmark it") and uses what the dive
already built: the machine parts and the five shapes.

Every section argues one piece of it. Concept sections (3 to 8, 12 to 14, 16) teach the model or mechanism to
level 400 and close by saying what that mechanism asks of a machine: which part it fills and what shape of job it
makes. Systems sections (9 to 11, 15, 17 to 29) open on that.

## 3. What each section argues

Titles: the name the reader searches for, then what they get. A cross-reference uses the number and the short
name, the part before the colon: "section 10, Processing and Curating". Ids and numbers do not change.

| # | Title | The question a reader brings | The claim the section proves | The number or scene that proves it |
|---|---|---|---|---|
| 1 | One Arm, Fifteen Workloads: What Each One Runs On | What is physical AI as a computing problem, and what must I know to size it? | The loop around one arm is about fifteen workloads; the part each fills first picks the instance and its shape picks the scheduler and the market, so a job can be placed before it is benchmarked. | A stand-in policy asks one Jetson core for 9.8 GB/s where the core streams 11.71 GB/s (our single runs), so more arithmetic buys nothing; scoring a policy is 500 independent simulated episodes, so a reclaimed machine costs one of them. |
| 2 | Getting Started: What Changes When the Model Drives a Robot | What must I hold in my head, and which sections answer my question? | Four ideas are enough to open any section out of order, and three routes cover the reasons people come. | The four ideas, each with its one-line consequence, and each route's section list. |
| 3 | The Robot as a Computer: Inputs, Outputs and a Deadline | What is the arm to the software that runs it? | The arm is a handful of numbers in and out plus camera frames, on a 30-tick-per-second clock, and lateness is a distance: the joints cost bytes, the cameras cost megabytes, and the deadline sizes the computer beside the arm. | d = v x tau: at an illustrative 0.25 m/s, 100 ms of delay is 25 mm of travel on stale orders. |
| 4 | Learning From Demonstrations: Why Copying Drifts and What Fixed It | Why can a network not simply copy the person? | Copying fails because each small error moves the arm to a state the demonstrations never showed, and the two fixes (predict a chunk of actions; sample one of several valid motions) are the parts every current policy is built from, and they set what a policy costs to train and to run. | Fifty episodes; the chunk length and the number of decisions it removes; the denoising steps a diffusion or flow head pays per chunk. |
| 5 | Vision-Language-Action Models: A Backbone, an Action Head and Two Clocks | How do I read a robot-model announcement, and which model can I fine-tune? | A VLA is a vision-language backbone with an action head, run at two rates; that split says which part is slow, which part must keep the control clock, and which models one GPU can adapt today. | The slow and fast rates of a named model, and the parameter split between backbone and head. |
| 6 | World Models: Predict Pixels or Predict a Summary | What is a world model for, and why are there two kinds? | What the model is asked to predict (the next frames, or a compact summary of them) sets the cost of every imagined future, and so which uses each family can serve. | Planning one action: 16 seconds predicting summaries against 4 minutes generating video, same RTX 4090, as the V-JEPA 2 authors report it. The scene one tick before the push stays. |
| 7 | JEPA: Predicting in Latent Space | How does a JEPA train without learning nothing, and what does planning with one cost? | A JEPA's loss lives between two encodings, which makes a constant output a perfect answer; the design is the set of measures that block that shortcut, and planning with the result is a predictor-call count you can work out. | 800 x 10 x 1 = 8,000 predictor calls for one action, 16 seconds on one RTX 4090 (authors' report). |
| 8 | Reinforcement Learning for Robots: Where the Attempts Come From | Where does RL fit when the learner is a physical arm? | Robot RL is decided by its supply of attempts: a simulator supplies them by the hundred million and waits on throughput, a pretrained policy needs few, and the real arm waits on the robot, the reset and a person. | About 197 million control steps in one simulator recipe, with a camera taking about half of the run. |
| 9 | Collecting Data: What an Episode Weighs and What It Costs to Record | What is an episode on disk, and what does recording one commit me to? | An episode is table rows plus video and the video is nearly all of it, so the compression chosen at the bench is a cost every later reader of the data pays. | 86.1 MB for 50 episodes in a public dataset, about 257 to 1 against the raw frames. |
| 10 | Processing and Curating: When Video Decode Sets the Training Speed | Why is my GPU idle during training? | The first part to fill in a training run is often the CPU cores decoding video, and the codec recorded at the bench decides which instances can move that work to a GPU video engine. | 24 vCPUs per GPU on most eight-GPU EC2 sizes, against the frames per second the GPU consumes. |
| 11 | Augmentation and Synthetic Data: Three Ways to More Episodes | How do I get more data than I recorded? | The three ways to multiply data load three different parts of the machine, so the choice is made by what is scarce: CPU cores in the dataloader, a simulator's GPU, or a video generator's tensor cores and memory. | The multiplication factor and the per-sample cost of each of the three. |
| 12 | Physics Simulation: One Scene on a Core, Thousands on a GPU | What does a simulator compute, and when does it need a GPU? | One physics step is small, sequential and full of branches, so one scene belongs on one CPU core and a GPU pays only when thousands of scenes step together. | 57,240 steps per second on one Cortex-X925 core (our single run, a humanoid stand-in), set against the GPU batch figure. |
| 13 | Rendering and Ray Tracing: Why Simulated Cameras Pick the GPU | Why does a simulator with cameras need a different GPU from a trainer? | A simulator that feeds cameras is a renderer; ray-traced rendering runs on RT cores, which the training-class GPUs lack, so camera simulation lands on a different instance family. The rule holds for named software and no further. | What one camera adds to a simulation step, and the list of software the ray-tracing rule covers. |
| 14 | Sim-to-Real and Real-to-Sim: Widen the Simulator or Measure the Arm | Why does a policy that works in simulation fail on the bench? | A simulator is a set of typed-in parameters; a policy survives the move either because training varied them until the real arm fell inside the range, or because someone measured the arm and corrected them. | A shipped script fits 24 servo parameters from one teleoperated episode. |
| 15 | Training at Three Scales: One GPU, One Node, Many Nodes | Which size is my training job, and what does it ask of a cluster? | Robot-model training comes in three sizes, and the size, more than the model, sets the cluster: a reader with an arm is in the one-GPU size. | 20,000 steps of GR00T N1.7 on 75 SO-101 episodes in 3.4 hours on one GPU, as an AWS post reports. |
| 16 | Evaluation: Counting Successes, and How Many Trials It Takes | How do I know which checkpoint is better? | Loss cannot rank checkpoints, success rate can, and a success rate from a few dozen trials cannot separate two good policies; that is what turns evaluation into hundreds of independent simulated episodes. | 40 of 50 against 45 of 50: the two Wilson intervals overlap. |
| 17 | Running on the Robot: Fitting a Policy Inside the Control Period | Can the model I trained drive the arm in time? | A large policy misses the control period several times over, and chunked actions, asynchronous inference and a compiled, quantised model are what let it drive the arm anyway. | 149.0 ms per call of GR00T N1.7 on a Jetson Orin (NVIDIA's figure) against a 33.3 ms period: 4.5 periods. |
| 18 | The Fleet: Policies Out, Episodes Back | How does a new policy reach many robots, and how does their data return? | A fleet is a two-way delivery problem with hard edges: the policy is larger than the artifact a component may carry, and a rollout can be stopped but is never rolled back for you. | A policy of about 6 GB against a 2 GB artifact limit per component. |
| 19 | Agents Running the Loop: What the Agent May Touch and Who Grades It | What changes when a coding agent runs the experiments? | An agent can run the improvement loop only if the reset, the success check and the safety limits sit outside its reach, and its headline score measures recovery within a rollout, a different quantity from one-shot success. | 99% pass@8, as the ENPIRE authors report it, read for what it counts. |
| 20 | Fifteen Workloads, Five Shapes | Which part of a machine does each workload fill, and how is it scheduled? | A part is full when demand meets supply, which is arithmetic you can do before a benchmark; three properties of a job then sort the fifteen into five shapes, and a scheduler acts on the shape. | 390 inferences x 25.2 MB = 9.8 GB/s asked against 11.71 GB/s supplied, with 62.3% of cycles stalled on memory (our single runs). |
| 21 | Reading a Machine: PMU Cards | How would I check which part is full? | Four percentages from a core's counters, and three GPU tools, say where a machine's capacity went; four questions read any card. | The worked sort of a small run into the four top-down categories. |
| 22 | Our Measurements: Three Stand-Ins on Two Edge Machines | What has been measured, and how far can I trust it? | The cards so far are single runs of stand-in programs on two edge machines: enough to show the method and the size of the gap between the machines, too little to size an EC2 instance. | 14,507 against 57,240 physics steps per second on one core of each machine (single runs, different MuJoCo versions). |
| 23 | Price-Performance and Latency: One Unit of Work per Workload | How do I compare two machines for one of these workloads? | Two machines compare only on a unit of work both did; with one unit per workload, a measured rate becomes work per price, per watt, or per deadline. | 390 inferences per second on one Jetson core (single run); no price is printed. |
| 24 | Orchestrating Physical AI on AWS: Fifteen Workloads, Four Schedulers | Where on AWS does each workload run? | The shape of a job picks among four schedulers, and the GPU family picks the capacity market before the scheduler does. | The evaluation of one policy: 500 simulated episodes, one seed each, on capacity that can be taken back with two minutes of notice. |
| 25 | AWS Batch: A Queue for Work That Comes and Goes | When is a managed queue the right scheduler? | Batch wins when the work is independent units or single-node runs and nothing should exist between them; it loses when nodes must start together or when a job must start soon, and its typical failure is a job that waits in RUNNABLE with no error. | A 500-episode sweep as one array job on Spot: a reclaimed machine costs the episodes it was running. |
| 26 | AWS Parallel Computing Service: Managed Slurm for Jobs That Span Nodes | When does a team want Slurm on AWS? | PCS wins when one script must hold several nodes at once and the team already works in Slurm; it loses on Spot, where the pages read document no warning step, and on variety, where every market and instance shape is another node group. | A two-node world-model training job from sbatch to the checkpoint; 10 node groups and 10 queues by default. |
| 27 | Amazon SageMaker HyperPod: A Standing Cluster That Repairs Itself | When does a cluster that stays up pay for itself? | HyperPod wins when GPUs are busy most of the day, shared, and run long enough for hardware to fail under them; it turns a failed node into one restart from the last checkpoint, and it bills for every node whether or not a job runs. | One post-training run surviving a Spot notice and a failed node. |
| 28 | Amazon EKS: GPU Batch Work on Kubernetes | What does it take to run GPU jobs on Kubernetes? | EKS wins when the platform team already runs Kubernetes and the loop's services and jobs should share it; the price is that queueing, node provisioning and Spot handling are parts you assemble, and a Spot notice gives two minutes and nothing earlier. | A pending pod becoming a GPU node, and the two minutes after a notice. |
| 29 | Choosing: From a Workload to an Instance, a Scheduler and a Market | I have a workload. What do I pick? | Four questions asked in order (which part fills first; is there a deadline; do the pieces talk and how often does it run; what is lost if the machine goes) fix the instance family, the place, the scheduler and the market. | The closing table of the fifteen workloads, and the arm's own answers. |
| 30 | Glossary and Sources | Where is a term defined and a claim sourced? | (reference section) | (none) |

An author who finds that the registers do not support a row's claim or anchor says so in the report and proposes
the nearest claim they do support. A row may sharpen; it may not turn back into a topic.

## 4. How a section opens

The first screen (h1 description plus the first two paragraphs) carries three things, in this order: the claim;
why it matters to someone sizing or running this work; the anchor number or scene.

Reference: "This deep dive gives you a way to predict how an inference workload will run on a chip before you
benchmark it." By paragraph three the number is worked: "Dividing gives the ridge point ... about 412 FLOP per
byte ... Doubling peak FLOPS does nothing for it; doubling bandwidth roughly doubles tokens per second".
Reference: "An improvement can be bought in two places ... Which one costs less depends on how many queries the
improvement serves before it is retrained or retired."

- The h1 description names what the reader can do afterwards, with the claim's content in it, then the provenance
  in brackets (keep the software versions and the read date exactly as they are now). Reference: "Size the
  key-value cache from a model's config before you size the batch". Not: "See the whole loop on one arm before any
  part is explained".
- The first sentence is about the subject and already says something a reader could be wrong about. Never a
  dictionary definition ("X is the work of ..."), never a description of the section ("This section builds ...").
- Concept sections keep their scene on the arm, but the scene comes after a two or three sentence opening that
  states the claim, and the scene must set up the claim, as the world-models scene does.
- An h2 title names the thing or the claim; its description states the payoff as a result ("Turn milliseconds into
  millimetres, and find how much delay your task can absorb"). Never "After this block you can say in two
  sentences".

## 5. How a sentence earns its place

**Consequences.** A fact is followed by what it does to a decision. Reference: "A miss upstream becomes a pipeline
stall or a slip in the compiled schedule." "Below the ridge a workload is memory-bound and extra FLOPS do nothing
for it". If a sentence only describes, add the consequence or cut the sentence.

**Numbers.** A number is delivered as: what it measures, whose it is, what follows. Reference: "a training-free
sampler nearly matched the single-shot score of GRPO ... at about 8.84 times the tokens per answer". The section's
anchor number lands at least twice, once in the opening and once where it is used. A number with no consequence
goes into an expandable block or out.

**Terms.** A robotics term is built once, in the sentence that first needs it, by what it is or does, and is then
used the way an expert uses it, with no further gloss in that section. Reference: "The score is called the
reward." "Both carry the word policy, which is RL's name for whatever chooses the actions". Do not stack three
definitions in one sentence; do not define a term the section never uses again.

**Arguments where lists were.** Where the old text enumerates (eight stages, five uses, four objects, nine
rules), ask what the list is evidence for and write that sentence first. Keep a list only when the reader will
come back to look something up, and then say what to do with it. A count is never the point: "The loop has eight
stages" tells nobody anything; "each stage hands the next one thing, and the hand-offs are where the machine
changes" does.

**Rank by consequence.** In the systems and AWS sections one fact per block decides a configuration; it gets the
paragraph. Limits that never bite, defaults nobody changes and API field inventories go into an
`ExpandableSection` titled for lookup ("Limits and defaults, for reference") or are dropped. Reference, the AWS
section of the feedback dive, closes on rank: "Write the grader first; the service follows from which of these
components you are ready to own."

**Voice.** An engineer explaining to a peer from another field. Direct, specific, dry. Second person where the
reader acts. No primer filler ("A person does it without thinking"), no reassurance, no narration of difficulty.

## 6. Provenance

- The citation carries the source. The sentence states the fact.
- A vendor's or an author's own performance figure keeps its owner in the sentence, in three or four words:
  "NVIDIA reports 149.0 ms", "as the V-JEPA 2 authors report it". Never "as the authors of the faster model report
  it", never a bare declarative.
- Our measurements keep machine, software version and "single run" every time, as short as they will go.
- A claim that is the dive's own derivation says so once, in one plain clause, where the claim is first made:
  "(the split into fifteen is ours; section 20 shows it)". After that it is stated plainly. Never "Counting them
  as five is our grouping", "Fifteen is our reading", "The sources read for this dive name four uses".
- Hedges keep their scope and date word for word in meaning: "the pages read on 2026-11-20 document no ...", "the
  lists read on 2026-11-20 name no G-family type". A rewrite never widens one.
- Two sources that disagree are shown disagreeing, with both cited.

## 7. Ban list, with replacements

| Banned | Examples from this dive | Write instead |
|---|---|---|
| Self-reference to the page, section or dive as the subject | "This page shows the loop once", "This section depends on section 24", "The dive answers nine questions", "This section builds that picture" | The content itself. A dependency becomes a term used with a pointer: "the control period (33.3 ms, section 3)". |
| Signposting | "The next two blocks explain why", "Look at the tags again", "The number to carry out of this section", "as we will see", "Two figures frame the answer" | Say the thing. Put the number in the sentence that uses it. |
| Bookkeeping | "Counting them as five is our grouping", "Fifteen is our reading", "Terms in brackets are names you will meet in the section titles" | One clause, once (section 6 above), or nothing. |
| Primer filler | "A person does it without thinking", "Two small arms are clamped to a table" with nothing riding on it | Cut, or make the detail carry the claim. |
| Template scaffolding in headings | "What it is and the challenge it meets", "Its moving parts", "The cluster, drawn", "What it does poorly", "Where it hands off" repeated across 25 to 28; "The scene:", "The idea:", "Worked example:", "What it costs" as h2 prefixes | A heading that names this section's content: "A job can wait in RUNNABLE forever", "Two queues: one for Spot sweeps, one for the fine-tune". |
| Lists where an argument is owed | "The loop has eight stages", "There are three sizes", "Nine rules" as openings | The sentence the list proves, then the list if it is looked up. |
| Facts at equal weight | a 24 KiB definition limit beside "a job can sit in RUNNABLE indefinitely" | Rank; demote or drop the rest. |
| Describing the reader's progress | "After this block you can say", "This section gets you to the point where" | The payoff as a result: "Tell from a job's shape whether it belongs in a queue". |
| Negative definition and flourish | "not X, but Y", "It is a different question" | Say what it is. |
| Repo gates | em-dash, en-dash, curly quotes, the LLM vocabulary list, triads for cadence | As `CLAUDE.md` says. |

Cross-references are allowed and useful, as a trailing clause or in brackets, a few per section: "(section 13,
Rendering and Ray Tracing)". The reference dives use them the same way: "Section 25 adds what the model scores on
your grader today."

## 8. The climb from 100 to 400 inside a section

Four steps, each short, none skipped:

1. **Level 100, one or two sentences.** What the thing is, in the reader's own vocabulary, attached to the arm.
2. **Level 200, the mechanism in plain words.** What goes in, what comes out, what is repeated. Each new term
   built in the sentence that needs it.
3. **Level 300, the numbers.** One worked example a reader can redo by hand, on the thread task, then the formula
   with its symbols defined before it and its terms mapped back to the intuition.
4. **Level 400, what an expert knows.** The failure mode and how it shows up; the configuration choices and which
   way each pushes; where the published figures stop; what it asks of the machine (part and shape).

A section that ends at step 2 is a primer. A section that starts at step 3 loses the reader. Most of the old text
has steps 1 to 3 and thins out at step 4: the registers (`research/2026-11/`) hold the material; add it.

**Worked before and after** (section 1, the passage that carries the thesis).

Before:

> Look at the tags again. One stage decodes video on CPU cores. One traces rays. One multiplies tensors on many
> machines for days. One waits on a robot that moves at the speed of a robot. These jobs serve the same arm, and
> they have almost nothing else in common. That is why the dive counts workloads and not stages. [...] Two
> properties of a workload then decide what it runs on. The part it fills first picks the machine: an instance sold
> for its GPU is the wrong buy for a job waiting on CPU cores. Its shape picks how the machine is bought and
> scheduled.

After (the shape to aim for; every figure must be checked against its register entry before it ships):

> Take two of the jobs this arm needs. Running its policy means reading every weight once per decision. On one
> core of a Jetson Orin Nano Super, a stand-in policy with 25.2 MB of weights ran 390 inferences per second, so it
> asked memory for 390 x 25.2 MB = 9.8 GB/s, and the same core streams 11.71 GB/s at most (our measurements, single
> runs). That core has run out of memory bandwidth: a chip with twice the arithmetic and the same memory would run
> the policy no faster. Scoring a new policy is 500 simulated episodes that never exchange a byte. Nothing in it
> waits on bandwidth and no episode needs another, so it can run on machines AWS may take back at two minutes'
> notice, and a machine taken back costs the episodes it was running. One arm, two jobs, and they want different
> hardware bought in different ways. Asked of all fifteen, the same two questions fill the table this dive ends on.

What changed: the reader gets the tool by using it; the numbers arrive with their owner and their consequence;
the taxonomy ("two properties", "five shapes") appears as the result of a worked case; nothing refers to the page.

## 9. How a section ends

On the reader's next action, with the anchor number or claim in it, reached by ordering the blocks. Reference:
"Before you pay for a run, sample a group of answers from the starting model for each training prompt ... and
count the prompts that pass every time or never." "To place your own workload, work out its FLOP per byte the way
the anchor number does". No summary, no key takeaways, no "Where it hands off" block whose content is a list of
pointers: a pointer belongs in the sentence that creates the need for it.

Concept sections end on what the mechanism asks of a machine (the part it fills, the shape of job it makes) and
the one check the reader can run. Systems sections end on what to configure or measure first.

## 10. What a rewrite may and may not change

May: every word of prose, titles (as in the table), h1 and h2 text and descriptions, captions, panel headers, the
order of blocks, what sits in an `ExpandableSection`, splitting and merging blocks, cutting text that earns
nothing, adding depth the registers support, small changes to a figure's labels or caption, removing a figure that
only decorates.

May not: change a fact or a number; change which entry a citation points to; drop or widen a scope or date
qualifier; turn a vendor's or author's figure into a plain fact; change a placeholder's meaning; change section
ids or the section count; change a formula's content, a media capture, or a configuration snippet's content;
rebuild a figure; add a claim with no register entry. New factual content needs a register entry with a pinned
first-party source, fetched now, appended in the registers' format, and is kept small.

Kept from earlier decisions: one dive; GR00T 2 taught as current with its honest label; the measurement and
price-performance sections stay open with their placeholders; the Greengrass hook-up placeholder; no dollar
figures; Batch, PCS, HyperPod and EKS each in its own section; the talk's session code never appears; the
reservation claim keeps its scope and date.

## 11. Self-check before an author reports

1. Read the first screen alone. Does it state a claim someone could disagree with, say why it matters to a person
   sizing or running the work, and land a number or scene? If it could open a Wikipedia article, rewrite it.
2. Search the file for: "this section", "this page", "this dive", "the dive", "below", "above", "the next",
   "as we", "to carry", "look at", "our reading" and "our grouping" used as bookkeeping, "it is worth", "simply".
   Each hit is rewritten or justified.
3. For every h2: is the title specific to this section, and does the description state a result?
4. For every list and table: what sentence does it prove, and is that sentence written before it?
5. For every number: owner, meaning, consequence. For every hedge: scope and date intact.
6. Level 400 check: name the failure mode, the configuration choice and the limit of the evidence this section
   teaches. If one is missing and the registers hold it, add it.
7. Read once as the level 100 reader (is any term used before it is built?) and once as an expert (is anything
   padded, soft or wrong?).
8. The mechanical checks in `revamp/authoring-brief.md` section 9 and the check tool, at 1440 and 390.

## 12. What the pilot taught (sections 1 to 4, three review rounds, 2026-11-24)

Each rule below was learned from a blind adversarial review that quoted the offending sentences. The reviews are
in `revamp/reviews/rewrite/`. Section 4 passed in round 1 and was named the best file in a batch that included
the reference dives; its source is the bar for every later section.

1. **The provenance tic.** The first drafts hedged about once every fifteen sentences. Before (section 3): "in
   our reading of general kinematics a five-joint arm cannot reach every position at every angle"; "In our reading
   of the defaults, played to its end at 30 Hz it lasts 1.67 s". After: the fact, stated. Rule: "in our reading",
   "is ours", "our arithmetic" at most once per section each, and only on a claim that really is this dive's own
   inference. Never on a textbook fact, never on arithmetic the reader can see. An inference that no entry
   supports and that is not obvious from the cited text is cut, not labelled.
2. **Do not disown your evidence.** Before (section 1): "The figures stay with the stand-in" and, later, "too
   little to size an EC2 instance", under a description that promised to place any job. After: the measurement is
   introduced once as what it is ("A program small enough to count by hand shows the method"), and the
   description promises what the section delivers. One honest clause; no second apology.
3. **A worked number must close.** Before: "demand sits between" a 9.25 GB/s and an 11.71 GB/s limit, which left
   the reader asking how demand can exceed a limit. Rule: use the figures the argument needs and no others; if two
   figures bound something, say which one binds and why, in a sentence.
4. **Counts are not structure.** Before: "Eight stages make fifteen workloads, and three properties sort them
   into five shapes"; "the route of eight, thirteen or twelve sections". After: the reader sees the fifteen in one
   table and the prose argues from the rows where the answer is surprising. A title, a description or a heading
   never rests on a count.
5. **Coined words are terms too.** "Part", "fills first", "full", "shape", "market" were used for a thousand
   words before they were built. Each gets one plain sentence at first use, before any table whose cells use it.
6. **Paragraph length.** Paragraphs of 200 to 300 words cost a point of clarity on their own. Keep a paragraph
   under about 110 words; one job per paragraph; the thesis by the third sentence of the page.
7. **Rank inside a block.** Before (section 3): the fact that decides whether a reader's recordings fit a model
   (the action space and its units) arrived in the eighth paragraph, after firmware cut-outs. After: it leads, and
   the cut-outs sit in one expandable block for lookup.
8. **Land a number twice, not five times.** "100 ms is 25 mm" appeared five times and one byte count was derived
   three times. Twice: the opening, and where it is used. A closing block that restates the opening at three
   times the length is cut to what is new.
9. **Research gaps are not content.** "Neither of the two documents read states how often the servo runs it" is
   kept only where the reader would otherwise assume a number exists and act on it; then once, with scope and
   date.
10. **Navigation is a figure, not prose.** A getting-started section lost on argument and depth while 60% of it
    was the section list in four shapes. One map; the body is ideas argued to a number, a configuration choice
    and a failure. A section never ends on a list of pointers.
11. **Label fragments and signposts.** "The first question, worked.", "Put toy numbers in.", "The usual check
    misleads here.", "What a missed period does depends on a setting." Replace each with the sentence that carries
    the content.
12. **Do not overclaim in the opening.** "every current policy is built from both" was contradicted by the same
    section's closing evidence, and the accuracy review found it unsupported. Scope the opening to what the
    section proves.
13. **Captions are for readers.** "made for this dive on a Mac" and four sentences on how to operate a widget are
    build notes. A caption says how to read the figure, in one or two sentences.
14. **Accuracy beats style.** Where a style instruction and an accuracy finding conflict, accuracy wins: a vendor
    figure keeps its conditions ("a median of 149.0 ms with TensorRT"), a symptom with no entry is cut, our
    arithmetic is kept apart from an author's report.
