# Explaining Concepts: Basics, First-Use Definitions, Intuition Before Formula

Established 2026-11-02 by Carlos. It applies to every deep dive in this
repository and to any tool that writes or edits one, whether or not that tool
has access to Carlos's notes elsewhere. The rules live here, in the project.

## Where this came from

A newcomer-reader exercise on the RL and silicon dives scored the RL dive's
first four sections 6, 6, 4 and 4 out of 10. The reader was an IT professional
with no machine-learning background. Carlos read the same pages and judged the
research good and the writing poor: concepts arrive as names, acronyms, papers
and formulas, without the basics, without the intuition, and without saying how
the pieces fit together.

The section-shape standard
(`deep-dives/efa/revamp/section-shape-standard.md`) already gave the pages a
structure. What was missing was the explanation inside that structure.

## Carlos's words, 2026-11-02

These are the source of every rule below. Quoted, not paraphrased.

- "The basics are never laid down."
- Terms are used in sections "before they are explained or provided how they
  fit within what you have."
- On KL (Kullback-Leibler) divergence: "I'm expecting for you to explain this is
  a metric. This is an asymmetric metric of how different [one distribution] is
  compared with some other ... from information theory, how far two
  [distributions] are in logarithmic terms ... when something is very close to
  zero, you got very little difference ... [large] means that things are not
  very similar ... And the asymmetry means ... at least you can explain a bit
  why is the metric, why it's being picked up, and why is it being used for that
  particular thing."
- "The same thing goes with the PPO or the GRPO. It is not clear. Like when we
  are talking about policy, what is a policy? We are talking that the policy is
  a model, and then you're talking in policy and out of policy. A bunch of
  things that need a much better explanation."
- "For any acronym, the first time that we use the acronym, we must spell the
  acronym. And we must spell, especially if it's a technique, what that
  technique is about."
- "We need to provide the intuition. We can provide the intuition, then the
  formula, and then describe how the formula fits within that intuition. How we
  can decompose that formula within that intuition. Think how people explain
  this type of stuff."
- "The more complex it gets, the more that we need."
- On length: "I don't want to grow the word count if we are not providing the
  right information. I'm happy to create sections that have the right
  information and guide through the structured approach. I think that the
  structured approach was there, but the part that is missing is everything
  that we've been talking about."
- On form: "we don't need a section to start with a question and an answer",
  and "we can use an intuition" (in place of an analogy by default).
- On where the rules live: "the rules for what we want are not in Open Brain,
  they will be in the project. So any new project, regardless of if it has Open
  Brain or not, will actually just go through it."

## Who the reader is: the right depth and the right ramp-up

Carlos, 2026-11-03 (voice transcription, verbatim): "this is for a technical
audience, but even for a technical audience that is coming from IT, when you get
them to such deep concepts, you see that it is hard to understand some of those
things. So we need something in between. ... the moment that you get them into
[tech], TypeScript, Python, into concepts, it needs to build up those concepts,
which is exactly what we've done. So I know that we may need to adjust a bit,
and we need to adjust in a way that we don't oversimplify either, that we
basically just get the right depth and that we do the right ramp up. Like the
right depth and the right ramp up is the part that we are after. So we can
basically get people relatively fast from ramping up even if they don't have
the concept."

The reader is technical, for example from IT or software: they read TypeScript
or Python, run infrastructure, and know general computing (servers, networks,
files, APIs, a percentage, an average, a probability). They do not yet have the
topic's concepts. The page builds those concepts up fast and then takes the
reader to the real depth.

The ramp-up goes in front of the mechanisms, the formulas, the numbers and the
practical detail. It does not replace them. For the RL dive that means saying
what a model's weights are before saying that training changes them, and then
still showing the update rule and its symbols. For a networking dive it means
saying what a queue pair is before saying how many the device supports, and then
still giving the count.

Check every explanation against two failure modes:

- **Too steep.** The reader meets a concept before it is built: a term used
  before it is explained, a formula before its intuition, a symbol defined after
  the line that uses it.
- **Too flat.** The explanation drops the mechanism, the formula or the number,
  or talks down to the reader. A reader who knows the field should find nothing
  wrong or missing, and a newcomer should reach the same depth, only with the
  steps laid out.

## The rules

**1. Lay down the basics a section relies on before building on them.**
Before a section uses an idea as a building block, the page has already said
what that idea is. "Training changes the weights" needs the weights first: the
billions of numbers in the model file that decide what it writes. The basics go
where the reader first needs them, usually early in the first sections, and a
later section that depends on them can point back.

**2. Explain every term where it is first used in reading order, and place it.**
Placing a term means saying how it fits with what came before: which part of the
picture it belongs to, and what it adds. A term the reader meets in a diagram
label, a table cell, a caption or a header description counts as used. If that
label cannot change, the prose before it carries the explanation.

When a familiar word takes a second meaning, say so where the switch happens.
In the RL dive, "the weights" are the model's parameters, and "the weight on a
sample" is a multiplier on its update. A reader who is not told reads one as the
other.

A term is explained once, at its first use. Later uses are plain. A reader who
arrives out of order has the glossary.

**3. Spelling out an acronym is not an explanation.**
At first use, give the full form, then say in plain words what the thing is or
does. For a technique, also say what challenge it meets and when it is used.
"PPO (Proximal Policy Optimization)" is a name. "PPO (Proximal Policy
Optimization), the RL algorithm that limits how far each update can move the
model from the one that produced its training samples, which keeps training
stable when a batch is reused" is an explanation. Where a later section covers
the technique in depth, give the intuition at first use and point to that
section.

**4. Intuition, then formula, then the formula decomposed against the intuition.**
Start with what is going on and why anyone would want it. Then show the formula.
Then walk through it term by term and say which part of the intuition each term
carries. Every symbol is defined before the formula or at it, never after it.
A formula with no intuition before it and no decomposition after it teaches
only the people who already knew it.

**5. The more complex the idea, the more explanation it gets.**
A plain definition is enough for "rollout". A gradient, a value function or a
divergence needs the intuition, the formula and the decomposition, and often a
worked example.

**6. A worked example with small numbers bridges intuition and formula.**
Two tokens, four samples, a pass rate of 30%: numbers the reader can redo in
their head. Label toy numbers as illustrations, and keep the arithmetic exact so
a reader who checks it gets the same answer.

**7. A citation marker does not split a definition.**
Put the marker after the sentence that defines the thing. A reader who meets a
source label halfway through a definition loses the thread.

**8. Use an intuition about what is going on, in place of a fixed opening or a default analogy.**
A section does not have to open with a question and its answer. An analogy is
allowed when it is the clearest way in, but it is not the default. The default
is the intuition: what the thing does, and why it is needed here.

The No AI Tells rules in `CLAUDE.md` still apply to every sentence these rules
add.

## The model of depth: KL divergence

This is the depth Carlos asked for, written for the RL dive. It is a model of
how much explanation a central idea gets, not text to paste.

**Intuition.** When you fine-tune a model you want it to get better at the task
without forgetting how to write normal text. So you need a number for how far
the new model has drifted from the original. KL divergence (Kullback-Leibler
divergence, named after the two people who defined it) is that number. It comes
from information theory and compares two probability distributions: lists of
probabilities that add up to 1. Here each list is the probabilities a model
gives to every possible next token.

**Reading the values.** It is never negative. Zero means the two models agree
exactly. Small means little drift. Large means the new model now prefers very
different tokens.

**Formula.** `KL(P || Q) = sum over x of P(x) * log(P(x) / Q(x))`, where P is
the new model's next-token distribution, Q the original's, and x ranges over the
possible next tokens.

**Decomposition.** `P(x) / Q(x)` is how many times more likely the new model
finds token x than the original does. The log turns that ratio into a score that
is 0 when the two agree, positive when the new model likes x more, and negative
when it likes x less. Weighting by `P(x)` and summing averages that score over
what the new model actually generates. That is the "logarithmic terms" part.

**Asymmetry.** Swapping P and Q weights the average by the other model's
preferences, so the answer changes. Two tokens, P = (0.9, 0.1), Q = (0.5, 0.5),
natural log: KL(P || Q) = 0.9 log 1.8 + 0.1 log 0.2 = 0.37, and
KL(Q || P) = 0.5 log(0.5 / 0.9) + 0.5 log 5 = 0.51. The direction with the new
model first blows up when the new model puts probability on a token the
original thought nearly impossible.

**Why RL fine-tuning uses it.** The trainer already has both models'
probabilities for each token, and the samples come from the new model. So the
per-token term, log P minus log Q, costs almost nothing to compute on every
generated token. Used as a penalty, it keeps the model near the original, so the
model cannot chase the reward with text the original would never write.

## How this relates to the section-shape standard

The section-shape standard decides what earns a place on the page (a mental
model or practical value) and how the page is shaped: introduce before
dissecting, a payoff in every h2 description, supporting evidence in a
disclosure, the reader's next action last. All of that stays.

This standard adds the explanation that was missing inside that shape. Laying
down a basic, defining a term at first use and decomposing a formula all pass
the mental-model test by definition: they are how the reader builds the model.
They are never the content that the section-shape standard cuts.

## Length

Length grows only when the added words carry something that was missing: a
basic, a definition at first use, an intuition, or the decomposition of a
formula. It never grows for padding, restatement or rhythm. A section that
explains more is longer for that reason and no other, and material that passes
neither the mental-model nor the practical test still comes out. This replaces
the earlier reading of the section-shape standard's rule 13 as a hard cap on
word count.

## The check an author runs before calling a section done

1. List every term, acronym, symbol and named technique the section uses,
   including diagram labels, table cells, captions and header descriptions.
   For each one, find where it is explained: at or before its first use in
   reading order, here or in an earlier section.
2. Every acronym has its full form and a plain statement of what it is or does.
   Every technique also has the challenge it meets and when it is used, or an
   intuition plus a pointer to the section that covers it.
3. Every formula has an intuition before it, every symbol defined at or before
   it, and a term-by-term decomposition after it.
4. Every word used in two senses is flagged where the sense changes.
5. Toy numbers are labelled as illustrations, and the arithmetic checks out.
6. No citation marker sits inside a definition.
7. Read the section as a technical reader new to the topic. Find the first
   sentence where that reader stops following, and fix the explanation there,
   not just the wording. Then read it as someone who knows the field: nothing
   should be wrong, missing or talked down. Too steep and too flat are both
   failures.
8. Every sentence added in the pass carries a basic, a definition, an intuition
   or a decomposition.
9. The No AI Tells rules hold.
