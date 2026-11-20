# Task: audit every figure of the dive and write the redesigns

Work in this git worktree, dive directory `deep-dives/physical-ai/`. You write ONE file:
`revamp/figure-audit.md`. Edit nothing else. No git write commands. Never put personal data (names, email
addresses, account ids, hostnames, home-directory paths) in any request, header, User-Agent, URL or query string.

The owner read the published dive and said of its figures: "we can refine and make them so much better. Like they
are too simple and I'm not entirely sure that they're great at the moment." Of one of them: "That's a super crappy
graph, that's a decision graph", it does not illustrate "what we should get out from this." He wants "super cool
representations".

The bar: a figure must teach something the paragraph next to it cannot. It shows the thing itself (the arm, the
tensor, the frames, the rays, the cluster, real quantities on real axes) and not only boxes with labels joined by
arrows. Depth through layering, consistent iconography, legible at 390 px, no overlaps.

Screenshots of every figure at 1440 px are in `/tmp/pai-shots-audit/` (`<section-id>-1440-svg<N>.png` for a
figure, `<section-id>-1440-anim<N>-step<K>.png` for each step of an animated one, `<section-id>-1440.png` for the
whole section). If the folder is missing or incomplete, regenerate it:
`npx vite build --outDir /tmp/pai-dist-audit --emptyOutDir && node revamp/tools/check-section.mjs --dist /tmp/pai-dist-audit --port 4490 --out /tmp/pai-shots-audit --widths 1440 --all`.
The new figures of round 2 (the cluster figures in sections 25 to 28, the loop figure in 20 and 24) set the
current bar: look at `/tmp/pai-shots-audit/` for them after regenerating, or read `src/components/Cluster.tsx`
and `src/components/LoopOnAws.tsx`.

For every figure in every section (`revamp/tools/sections.json` lists the sections; the figure's code is the
module-private function above the export in `src/sections/<Comp>.tsx`):

1. Look at the screenshot (Read tool) and read the two paragraphs around the figure in the section.
2. Score it 1 to 10 on "shows the thing itself and teaches what the prose cannot". One line of reason.
3. For every figure under 7: the redesign, concretely enough that another author can build it without asking:
   what objects are drawn and how, what is on each axis with units, what moves in each animation step, which
   register entries supply the numbers (name the entry IDs already cited by the figure), the layout at 390 px.
   Where a real capture would do the job better than a drawing, say so: stills and clips of the SO-101 in MuJoCo
   exist in `public/media/` (see `public/media/PROVENANCE.md`).

Start with these, which the owner or the brief named, and treat them in the most detail: world models and JEPA
(sections 6 and 7), action chunking (section 4), diffusion policies (sections 4 and 5), the physics step
(section 12), ray tracing (section 13). Then the rest.

File layout: a summary table first (section, figure title, animated or not, score, verdict: keep / refine /
rebuild), sorted by rebuild priority; then one block per figure under 7 with the redesign. Write the file early and
keep appending.

Return at most 200 words: how many figures, how many under 7, the ten worst in priority order with one line each.
