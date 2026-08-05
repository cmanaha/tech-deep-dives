# The Leverage Pass

Established 2026-08-05 by Carlos. The last pass over a dive, run after research,
verification and editorial shaping are done.

## Why it exists

Rigor is what makes the research trustworthy. It is not what makes the dive
worth reading. This project traded the outcome for the rigor: a meticulously
sourced artifact that a reader admires and cannot act on. This pass buys the
outcome back, and it spends some rigor to do it.

The rigor stays in the research. It does not all need to reach the page.

## The two modes, and why oscillating between them is correct

Deep dives get written in two directions, and both are legitimate:

**Backward.** Here is a technology. How does it work, where does it fit, what
would I use it for. This is how the research runs, and it produces mechanism.

**Forward.** Here is what I am trying to do. What do I need, and what decisions
does it force. This is how a reader arrives, and it produces consequence.

The research must run backward, because you cannot reason about a system you
have not taken apart. The page must read forward, because that is the direction
the reader is travelling. Most of the weakness in a finished section is
backward-mode material left in backward-mode order.

Corollary for how standards get written: defining what you do NOT want is the
right tool while exploring, because it preserves the surface you have not
decided about yet. Defining what you DO want is the right tool at consolidation,
because it forces the outcome. Using the positive form too early narrows the
search; using the negative form too late leaves the reader to infer the point.

## The pass

For every substantial block, answer three questions in order. Blocks that
answer none come out, however hard they were to establish.

**1. What does this mean to the reader and to the document?**
Say why the block is here, in one sentence, in terms of the reader rather than
the subject. A block that can only be justified by "it is true and it was hard
to find" has failed.

**2. What mental model does it build, and is that model visible?**
Name the model in one line. Then ask whether a diagram or a visualization would
carry it better than the prose does. A mental model that only exists as
paragraphs is usually a mental model the reader will not retain. This is where
new diagrams get commissioned, and it is a legitimate reason to add rather than
cut.

**3. How would the reader leverage this?**
The hardest question and the one most often skipped. Concretely: what does it
let them decide, configure, size, choose between, or monitor. Monitoring is the
underrated answer. A mechanism that explains a counter, a log line, a failure
signature or a knob has an obvious practical hook, and mechanism sections
frequently have one that was never stated.

If a block builds a strong model but has no leverage, keep it and say plainly
what it is for: understanding the system, so that the practical sections make
sense. That is an honest and sufficient answer. What is not sufficient is
leaving the reader to work out which kind of block they are reading.

## What this pass is allowed to trade

Rigor for reach, deliberately and visibly:

- Citations on claims nobody disputes can go. The claim stays.
- Evidence that exists to prove we did the work, rather than to help the reader
  check ours, can go behind a disclosure or out entirely.
- Depth established during research that answers no reader question comes out,
  and the research file keeps it.

What this pass never trades: a sourced number, a documentation-versus-code
conflict, a hedge scope, or an UNKNOWN.

## The four verbs, and the one this pass does not have

The pass may **delete**, **reorder**, **demote** and **re-express**. It may not
**assert**.

Every sentence it produces must trace to something already published in the
section, or to a source it fetched and cited during the pass itself. Making a
block leverageable means connecting facts that are already there to an action a
reader would take. It does not mean adding facts that make the action sound
better founded.

This rule exists because the first run of this pass broke it. Told to raise
practical leverage on the SRD section, the pass produced "no retransmission
logic exists anywhere in the EFA driver", cited to a twenty-three line function
that copies statistics out of an admin-queue response, and "no matching set
function anywhere in the tree", cited to the getter itself. It also wrote
"reporting a retransmission count is only possible for a party that performs
retransmissions", which is an inference used as evidence, and an unsound one.
Rigor on that section fell from five to three while every other axis held or
improved. An agent asked to make something actionable reaches for stronger
phrasing, because stronger phrasing feels more useful.

**Three checks, applied to every sentence the pass writes:**

1. **Scope may weaken, never strengthen.** If the page said "was found" or "was
   located during this research", it may not become "exists" or "does not
   exist". If it named a tree that was searched, the new sentence may not drop
   the tree. Weakening a claim is always permitted; strengthening never is.

2. **A citation must be able to bear its claim.** A function that reports a
   value cannot evidence the absence of logic elsewhere in the tree. A getter
   cannot evidence the absence of a setter. Before attaching a reference, state
   what that specific artifact can prove, and check the sentence asks no more of
   it. This is the same misattribution rule the source-authority standard
   applies to research; the pass does not get an exemption because it is only
   editing.

3. **Reasoning from design is inference, not evidence.** "Only a party that does
   X would report Y" is an argument, and arguments belong in prose that is
   labelled as our reading. They may not sit between a claim and a citation as
   though they were part of the evidence.

## Self-check before the pass reports done

Diff the claim set, not just the text. List every assertion in the after that is
not in the before. Each one must name the source it came from, or it comes out.
A pass that cannot produce that list has not finished.

## How it is measured

The pass is evaluated, not assumed. Before and after, each section is scored as
a reader would, one to five on each axis:

- **Mental model.** Does it give a way to think about the system and predict
  what it will do?
- **Practical leverage.** Does it change what the reader decides, configures,
  sizes or monitors?
- **Rigor.** Is every claim sourced, scoped and correctly attributed?
- **Accuracy.** Is it right?
- **Economy.** Is the value dense, or diluted by material serving neither model
  nor practice?

A successful pass raises model and leverage, holds accuracy at five, holds or
improves economy, and may spend a point of rigor. Losing accuracy fails the
pass regardless of the other scores.
