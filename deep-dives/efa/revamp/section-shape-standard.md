# Section Shape: Write For The Reader, Not The Reviewer

Established 2026-08-02 by Carlos, after reading the SRD and EFA Device sections.

## The diagnosis

The revamp corrected a lot of wrong claims, and those corrections became the
visible spine of the pages. Callout headers read "Correction: PFC deadlock is
more nuanced than this site used to say", "The correct phrasing", "Why this page
does not cite SRD.txt". That is our changelog. A reader arriving for the first
time has never seen the old version and does not care that we used to be wrong.

Both sections also open well and then abandon the promise. SRD opens on tail
latency deciding how fast a training step runs, lands "p99 fell by around a
factor of ten", and never returns to it. Both end on their weakest block: SRD on
sourcing methodology, EFA Device on a reference table. The last thing on screen
is about us, or about lookup, never about the reader.

## The rules

**1. Write as if the page is being read for the first time.**
Delete every trace of the changelog: "this site used to say", "Correction:",
"previously stated", "the old version claimed", "we were wrong about". The
corrected fact stays. The story of the correction goes.

**2. Keep documentation-versus-code conflicts. Do not add more.**
Where AWS documentation and the implementation disagree, that is real reader
value: someone will hit the discrepancy and need to know which to trust. Keep
those, framed for the reader who is confused right now, not as our confession:

  Good: "The help text states a default of 16384. The compiled default is 16.
         Code wins; treat the window as 16 messages."
  Bad:  "This site used to claim 16384. We were wrong."

Code is always the authority. That rule does not change. But this pass adds no
new conflicts, it only reframes the ones already published.

**3. This is a reframing pass, not a re-research pass.**
Every verified fact and every citation stays. Do not add claims. Do not remove a
sourced number. Net word count should go down or stay flat, never up.

**4. Demote evidence into ExpandableSection.**
Supporting detail, long code walkthroughs and the conflicts themselves belong
behind a disclosure, so the spine reads clean and the curious reader can open
them. Nothing is deleted. This reduces what the eye must process, which is the
point.

**5. End on the reader.**
The final block answers "so what do I do with this?" Achieve it by REORDERING
blocks that already exist, not by appending a summary. A section that currently
ends on methodology or on a lookup table is ending in the wrong place.

**6. Every h2 carries a claim-shaped description.**
Not a flat noun. Compare:

  Flat:  "Device generations"
  Claim: "Why more nodes make the fabric better, not worse"
  Claim: "The reason SRD scales, expressed as arithmetic"

The description should name the reader's moment or state the payoff, not restate
the topic.

**7. Repeat the section's one strongest number.**
Good technical writing hammers a single figure. "p99 down a factor of ten" and
"a p5.48xlarge reports 32, 33, 32 and something else" are strong enough to
organise a whole section around. Each is currently used once and dropped.

**8. At most one "what breaks if you get this wrong" line per section.**
Built from facts already on the page, not new research. Example, from content
already in EFA Device: get the counts wrong and you request the wrong number of
EFA devices in your pod spec.

**9. No key-takeaways boxes.**
This is the reflex and it is wrong. It adds bulk and lets the body stay
unfocused because the summary will catch it. Make the body land instead.

**10. The existing style rules still apply and are gate-enforced.**
No em-dashes, no en-dash ranges, straight quotes only, no banned vocabulary,
acronyms expanded on first use, every diagram accessible, every code citation
pinned to a commit SHA or release tag.
