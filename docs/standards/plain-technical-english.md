# Plain Technical English: Complex Content, Simple Sentences

Established 2026-11-27 by Carlos, while rewriting the opening of the Physical AI
dive's section 1 with him. It applies to every deep dive in this repository and
to any tool that writes or edits one. It governs how sentences, headings and
header lines are built. `docs/standards/explaining-concepts.md` governs what gets
explained, and `deep-dives/efa/revamp/section-shape-standard.md` governs what
earns a place on the page. Where an older rule asks for compression (short
declarative sentences, cut every clause that is not strictly needed), this
standard wins.

## Where this came from

A rewrite of the Physical AI dive followed a style contract built from bans and
compression rules: no self-reference, no bookkeeping, no lists, no counts in
titles, "a fact is followed by what it does to a decision", paragraphs under
about 110 words. It removed the old AI tells and produced a new one: a page of
maxims. Sentences such as "The part of the machine a job exhausts first picks
its instance" and headings such as "What a job loses with its machine picks the
scheduler and the market" passed every gate and every AI reviewer, at 8 or 9 out
of 10. A human technical reader would give the page about 2 out of 10 for "a
person wrote this".

## Carlos's words, 2026-11-27

Quoted, with only typing slips corrected.

- "the sentences look like haikus of stupid proportions that have no meaning or
  the meaning is completely hidden"
- "We do even with titles, so people will skip whole sections just because the
  meaning of what we intend is stupidly complex and really badly written."
- "It is not the technical aspect of what we hit but the write up. All the
  sentences must be written in technical English where the language uses simple
  constructions and terms to simplify the understanding. That doesn't mean we
  hide the technical complexity, but we keep the language complexity low,
  building sentences that all have full meaning by themselves."
- On the worked example, which uses a small test program in place of the real
  model: "It's ok the method was demonstrated on a toy, the text is honest, and
  is trying to bring concepts and mechanism that can be transferred to other
  type of problems that are much larger."
- On review: "we need just one review, a human technical review to it."

## The rules

**1. Every sentence carries its full meaning on its own.** A reader who reads
only that sentence understands what it says. No fragments, no labels standing in
for sentences, no sentence that needs the next one to make sense.

**2. Use the industry's standard terms.** Name things the way AWS, NVIDIA,
the open-source projects and practitioners name them: bottleneck, Spot
Instances, On-Demand, Savings Plans, Capacity Blocks, scheduler or orchestrator,
leader arm, the onboard computer. Do not coin a phrase for something that has a
name. When the dive needs a word of its own, choose a plain one ("workload
type"), define it once, and use it the same way everywhere.

**3. A person or a tool makes the decisions.** "You choose the instance type
from the job's bottleneck." Not "The bottleneck picks the instance." Abstract
nouns do not pick, settle, decide or cost.

**4. Show the reasoning with ordinary connecting words.** Because, so, after
that, based on that, on the other hand, when broken down. The clause that gives
the reason stays in the sentence.

**5. Say the purpose before the step.** "To find which instance a job needs,
first find its bottleneck." The reader knows why before they read how.

**6. One new idea per sentence; define a term in a sentence of its own.** "The
model that controls the arm is called a policy. It reads the camera images and
the joint angles and decides how the motors move next." Never a chain of
glosses after a name ("GR00T N1.7, its robot model, on a Jetson Orin, one of its
onboard computers for robots, with TensorRT, its inference compiler").

**7. Write like a practitioner, with judgment where it is true.** "Is usually
the better choice", "often under a power budget too", "up to fifteen". Do not
state an approximate count as exact, and do not strip a fair qualifier to make a
sentence punchier.

**8. One voice.** "You" for what the reader thinks and does. "We" only for what
the authors measured or built.

**9. Headings and header lines in plain words.** A heading names the topic the
way a reader would look for it ("Choosing the scheduler and the purchase
option"). A header line says, in one to three full sentences, what the reader
will be able to do. Neither is a compressed claim.

**10. Lists for parallel items, in full sentences.** Use a list when the reader
compares or looks up items (three job properties, four purchase options, five
workload types). Each item opens with its name in bold, then full sentences.

**11. Explain the options before asking the reader to choose.** If a section
says "pick a purchase option", it says what each option is, in a line each.

**12. Provenance stays in the citation.** Say once, in a plain sentence, that a
figure is our own measurement, a vendor's figure or an illustration ("We
measured it in a single run on..."; "NVIDIA reports..."; "The numbers below
describe the test program, not the real policy."). No access dates, "our
reading" or source counts in the prose, the headings or the header lines.

**13. Keep the depth.** Numbers, mechanisms, formulas and worked examples stay.
Simplify the language, never the content. A small example is fine when it is
labelled honestly and the method carries over to larger problems.

## What this replaces, with examples

Each pair is from section 1 of the Physical AI dive. The first is the text that
shipped; the second is the text agreed with Carlos.

Header line:
- Before: "Place any job in a robot's learning loop with two questions: which
  part of the machine it exhausts first, and what work is lost if its machine
  is taken away (sources read 2026-11-20)."
- After (Carlos): "Teaching a robot arm a single task involves up to fifteen
  different computing jobs. To find which instance and compute each job needs,
  you first need to understand which resource becomes its bottleneck. Based on
  that, you can select the instance type, the scheduler or orchestrator, and the
  purchase option: On-Demand, Savings Plans, Capacity Blocks or Spot."

A maxim with an abstract subject and coined terms:
- Before: "The part of the machine a job exhausts first picks its instance. The
  work lost when its machine is taken away picks its scheduler and its market."
- After: "Which resource does the job run out of first? That resource is the
  job's bottleneck, and it tells you which instance type to choose."

A sentence that only makes sense if you already know what it means:
- Before: "The same three terms size the arm's own policy on its GPU: what one
  call reads and computes, calls per second, and what that machine delivers."
- After: "The same method applies to the real policy on the robot's own
  computer. You need three numbers: how much data one call of the model reads
  and how much it computes, how many calls it makes per second, and how much
  memory bandwidth and compute that computer provides."

A list for cadence:
- Before: "Around it, one job compresses video on CPU cores, one traces rays on
  a GPU, one multiplies matrices for hours, and one has to answer inside a tick
  of the arm's clock."
- After (Carlos): "To run these jobs efficiently, you have to consider which
  hardware makes sense for each one. ... Deploying the model is different,
  because there latency matters."

A heading that is a compressed claim:
- Before: "What a job loses with its machine picks the scheduler and the market"
- After: "Choosing the scheduler and the purchase option"

Fragments as labels:
- Before: "Nodes that talk. A cluster on reserved capacity. Spot is closed."
- After: "**Multi-node training.** Training the large pretrained models that the
  arm's policy starts from runs across many machines for days, and the machines
  exchange data at every training step. If one machine is lost, the current step
  is lost on all of them."

The full agreed text of section 1's opening is in
`deep-dives/physical-ai/revamp/style/section-1-reference.md`.

## How a section is checked

One review: Carlos's read as a human technical reader. No rounds of AI reviewers
scoring style; their scores measured compliance with a rulebook, not whether a
person could follow the page. Accuracy checks against the claim registers still
run, because they test facts, not style.

Before handing a section over, the author reads it once, sentence by sentence,
and asks of each: would a senior engineer say this, in these words, to a
colleague? If not, rewrite it under the rules above.
