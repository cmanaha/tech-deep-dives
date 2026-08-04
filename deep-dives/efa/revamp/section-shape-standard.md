# Section Shape: Write For The Reader

Established 2026-08-02 by Carlos, after reading the SRD and EFA Device sections.
Revised the same day with his notes on all ten original rules.

This document follows its own rules. Where it defines something, it says what
that thing is rather than what it avoids being.

## Where this came from

The revamp corrected many wrong claims, and those corrections became the visible
spine of the pages. Callout headers read "Correction: PFC deadlock is more
nuanced than this site used to say" and "Why this page does not cite SRD.txt".
That is a changelog. Someone meeting the page for the first time wants the
current answer.

The deeper pattern: the research artifacts came along for the ride. Depth that
existed because it was interesting to establish stayed on the page even when it
changed nothing for the reader.

## The governing test: mental model, or practical value

Everything else in this document serves one question. Content earns its place on
the page when it does at least one of two things:

**It builds a mental model.** It gives the reader a way to think about how
something works. Theory is welcome here. An abstraction that lets someone reason
about a system they have never touched, and predict what it will do, is the most
valuable thing a deep dive produces. "SRD keeps reliability and gives up
ordering, and everything else follows from that trade" is a mental model. So is
"ENA and EFA are two devices on one card, and the difference is which side of
the kernel boundary writes the descriptor."

**It is practical to know.** It changes what the reader types, chooses, budgets
or checks. An instance that does or does not support a feature, a default that
differs from its documentation, an environment variable that quietly does
nothing on current versions. This is the knowledge that survives contact with a
real deployment.

Content doing neither comes out, however hard it was to establish. That includes
depth we were pleased to find. The question is never how much work a fact cost
us; it is whether it gives the reader a way to think, or something to do.

When a section is hard to shape, the usual cause is that it holds material that
passes neither test. Cut that first, and the structure tends to resolve itself.

## What the reader gets

**1. Write for a technical reader meeting the page for the first time.**
They have never seen a previous version, so page history has no place here. The
corrected fact stays and the story of how it got corrected goes. Every block
answers what is in it for the reader.

**2. Say which of the two things a piece of depth delivers.**
Before a technical detail ships, be able to name whether it builds the mental
model or whether it is practical to know. If it does both, it belongs near the
front. If naming it is difficult, that is the signal to leave it out. Apply this
to every code walkthrough in the dive.

Documentation-versus-code conflicts pass on the practical axis, so keep them and
say what the code does. Frame them around the reason the reader is here: they
are about to trust a documented value, and the running system disagrees. Code is
always the authority. Where a conflict is so deep that it changes nothing for
anyone reading and teaches no transferable idea, leaving it out is a legitimate
choice.

**3. Introduce a thing before dissecting it.**
Two or three sentences establishing what something is and why it earns a place
in the page, before the mechanism. A section on attachment modes says what an
attachment mode is and what turns on it. Without that opening the detail lands
on a reader who has no frame to put it in.

**4. Define things by what they are.**
"This is B, C and D, because X" carries meaning. "This is not A" carries almost
none, and the construction is one of the clearest AI tells in the current text.
State the thing, then the reason.

The same test applies inside a sentence. Every clause earns its place or comes
out. "Why more nodes make the fabric better, not worse" says everything in "Why
more nodes make the fabric better"; the trailing clause is there for rhythm.

Where something genuinely does have a limit or an absence, say what the limit is
and why it exists, rather than listing what the thing is not.

**5. Frame the subject as a challenge rather than a problem.**
A challenge can be met. Opening a section with "The problem:" sets a negative
tone before the reader reaches a single fact. Name the situation and what
resolves it.

**6. Cite evidence for authority or for conflict.**
A citation belongs where it establishes that a claim is authoritative, or where
documentation and implementation disagree. In both cases say where the evidence
comes from, so a reader can go check it. Citations attached to a claim nobody
would dispute add weight without adding trust.

## How the page reads

**7. Demote supporting evidence into a disclosure.**
Long code walkthroughs, field tables and the conflicts themselves sit behind an
ExpandableSection so the argument reads clean and a curious reader can open
them. Nothing is lost, and the eye processes less.

**8. Every h2 description states the payoff.**
Name the reader's moment or the result, rather than restating the topic.
"Device generations" becomes "Which generation you are on, and what branches on
it". "The reason SRD scales, expressed as arithmetic" tells a reader what they
get by reading on.

**9. Repeat the section's strongest number.**
Good technical writing hammers a single figure. "p99 down a factor of ten" and
"a p5.48xlarge reports 32, 33 and 32" each carry a whole section, and each is
worth landing more than once.

**10. Frame guidance as how to get it right.**
Say what to do and why it works. A pitfall worth naming gets named as something
to watch for, attached to the correct approach it protects. A section organised
around consequences of failure reads as a warning label rather than a guide.

**11. End on the reader's next action.**
The final block answers what to do with this. Reach it by ordering the blocks so
the payoff lands last, rather than appending a summary. A section closing on
sourcing methodology or a lookup table closes in the wrong place.

## What stays out

**12. Key-takeaways boxes.**
A summary box lets the body stay unfocused because the box will catch it. Make
the body land instead.

**13. Word count that grows.**
Reframing keeps every verified fact and every citation while holding length flat
or bringing it down. Growth means the pass turned into a rewrite.

**14. Universal claims built from local searches.**
"No AWS benchmark was located during this research" is honest. "No AWS benchmark
exists" is a claim about the world that the research cannot support. Preserve
the scope of every hedge.

## Style, gate-enforced

Straight quotes, plain hyphens in ranges, acronyms expanded on first use, every
diagram carrying a role and a title, every code citation pinned to a commit SHA
or a release tag, and every code block able to scroll. The em-dash, the en-dash
range and the banned vocabulary list all fail `scripts/ci.sh`.

## Consequence worth knowing before this is applied

Rules 4 and 5 reach further than the earlier pass did. Both the SRD and EFA
Device sections currently open with "The problem:", and negative-definition
constructions appear throughout the dive, including in text this standard's own
first version produced. Applying this fully is a second editorial pass, not a
touch-up.
