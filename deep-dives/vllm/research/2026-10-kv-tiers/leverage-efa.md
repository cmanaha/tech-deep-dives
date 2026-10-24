# Leverage pass: EFA dive, StorageDataPaths, "KV cache over the fabric" (2026-10-24)

Scope: the "KV cache over the fabric" container in `deep-dives/efa/src/sections/StorageDataPaths.tsx`
(after the edit: L1645-L1804), its `KvOverFabricDiagram` (L875-L1007), the caption and the
ExpandableSections. No other container was touched. The section still ends on "Choosing a path",
with "The boundary of this section" directly before it. Facts were settled by `factcheck-efa.md`
(including its "## Applied" section); this pass used only delete, reorder, demote and re-express,
and fetched no new source.

Standards applied: `deep-dives/efa/revamp/leverage-pass-standard.md`,
`deep-dives/efa/revamp/section-shape-standard.md`, repo `CLAUDE.md` writing rules.

## Before

### Scores (as a reader, 1-5)

| Axis | Score | Reason |
|---|---|---|
| Mental model | 4 | "Who posts the RDMA operation, and where loaded KV lands" sorts three unlike systems, and the diagram carries it. In prose it was diluted: the Mooncake paragraph packed the model sentence together with NIC placement, a wheel name and a doc-code conflict. |
| Practical leverage | 4 | Things to type or choose were all present (cuFile connector, `-efa` wheel, `MC_EFA_NIC_SELECTION`, the shm setting, the RDM-endpoint check). But the check was the tail clause of a long paragraph, followed by a disclosure and then cross-links, so the container ended on navigation. No monitoring hook is named. |
| Rigor | 4 | Every claim cited at pinned tags, inference labelled, hedges scoped, doc-code conflicts typed. Residual from the fact check: "for a GPU buffer" leaves out the single-chunk edge case. |
| Accuracy | 5 | All fact-check corrections (C1 to C6, C8 to C13) applied. |
| Economy | 3 | One paragraph carried six facts and ten citations (Mooncake); the Valkey paragraph carried thirteen badges, four of them on the maturity sentence. |

### Word count

Counter: `/tmp/kvlev-scripts/split.py` (outside the repo). It strips SourceRef and ProjectRef badges and
JSX tags, and counts tokens containing a letter or digit. Diagram text is not counted.

| Measure | Before |
|---|---|
| Visible prose (h2 title and description, body, disclosure header lines; disclosure bodies excluded) | 612 |
| Body visible (paragraphs, caption, h3s) | 552 |
| Disclosure bodies | 35 |
| Fact-check method (body plus disclosure bodies; the "about 592" figure) | 587 |
| Everything reader-facing | 647 |

## Per-block answers

| Block | 1. What it means to the reader | 2. Model, and is it visible | 3. How the reader uses it (incl. check or monitor) |
|---|---|---|---|
| h2 description | Says what the container pays off. | Named the check but not the sorting question. | Tells the reader whether to read on before planning a KV tier. |
| Intro paragraph | Why remote KV exists (reuse a prefix instead of recomputing) and which two kinds reach EFA. | Two tier kinds; visible in the diagram. | Orientation only: it frames the practical blocks. |
| Diagram | The whole container in one picture. | Who drives the transfer, what crosses EFA, where KV lands; RC stacks do not run. Visible. The check itself (look for a libfabric efa endpoint) was missing from the picture. | A reader can place a fourth system in the grid. |
| Caption | Which diagram cells are AWS maximums and which are our reading of code. | Scope label, not a model. | Tells the reader how hard to lean on each cell. Hedge scope: must stay. |
| Cross-links | Where per-engine config and the recompute break-even live. | None. | Navigation; it was the last block, so the container ended on "go elsewhere". |
| FSx P1 | LNet on EFA, 700 vs 1,200 Gbps; GDS client types and driver. | Two rates, one gated on GDS. | Sizing (the strongest number). The GDS client list is a check, and it is already in this section's scope table and "GDS is narrower than EFA" block. |
| FSx P2 | Which connectors reach the 1,200 Gbps path. | "The GDS figure needs a cuFile connector; POSIX connectors go through host memory." Visible in the h3 and the diagram. | Choose a connector. Scope "creates GDS_MT" must stay visible. |
| Mooncake paragraph | Mooncake Store's engine side posts one-sided RMA, and can land KV in GPU memory. | Engine-side poster, GPU landing. Visible in the diagram lane. | Wheel to install; NIC knob; shm setting conflict. The knobs are configuration detail and buried the model. |
| Valkey paragraph | The module's server posts the RMA; located clients land KV in host memory; unreleased. | Server-side poster, host landing. Visible in the diagram lane. | Tells the reader where KV lands today; maturity decides whether it is deployable. `FI_DELIVERY_COMPLETE` is line-level mechanism. |
| RC paragraph | Why some RDMA KV stores cannot move to EFA. | UD and SRD only, so RC stacks do not run; Mooncake rdma and core Valkey RDMA are RC. Visible in the band. | Rules a store in or out before planning. |
| Payoff sentence | The first thing to check in a KV store's transport. | Libfabric RDM endpoint on efa, the same userspace path as the section's EFA lane. Not in the diagram. | The check. It belongs last. |
| RC disclosure | Where each codebase sets the queue-pair type. | Evidence. | Lets a reader verify the verdict at pinned tags. |

## Edits (verb, location after the edit)

1. **Re-express**, h2 description (L1649): "Who drives each KV transfer over EFA, where loaded KV lands, and
   the first check to run before planning a KV store onto the fabric." Lands the sorting question
   (taken from the diagram heading) and keeps the check. "Where an EFA cluster can keep KV cache
   beyond one instance" is dropped because the intro paragraph says it.
2. **Reorder**, cross-link paragraph: moved from the end of the container to directly after the
   caption (L1666-L1677), so the container no longer ends on navigation. Text unchanged.
3. **Demote**, FSx GDS client requirement ("GDS needs a P5, P5e, P5en, P6-B200 or P6-B300 client with
   NVIDIA GDS driver 2.24.2 or later", `docs.fsxClients`) into a new disclosure "GDS client
   requirements" (L1697-L1702). Text and citation unchanged.
4. **Demote**, Mooncake NIC placement sentence (`MC_EFA_NIC_SELECTION=local`, four citations) into a new
   disclosure "Mooncake NIC and shm settings, and Valkey release status" (L1734-L1767). Subject
   "Buffers" re-expressed as "Mooncake buffers" because the disclosure has no surrounding context.
5. **Demote**, Mooncake shm doc-code conflict sentence, verbatim with its `doc-code-conflict`
   SourceRef, into the same disclosure.
6. **Demote**, the `FI_DELIVERY_COMPLETE` clause: the visible Valkey sentence now reads "the server
   posts fi_writemsg for a GET or fi_read for a SET", with both citations kept. The disclosure
   carries "The Valkey server posts a GET with FI_DELIVERY_COMPLETE, so the reply cannot overtake
   the payload", with the same two citations (`vloServerPosts`, `vdmaRmaPost`).
7. **Demote**, Valkey maturity sentence (unreleased as of 2026-10-24, experimental API until 1.0,
   client support in open pull requests, four ProjectRefs) into the same disclosure. "the module"
   is re-expressed as "the Valkey module".
8. **Reorder**, the payoff: split out of the RC paragraph into its own final paragraph after the RC
   disclosure (L1793-L1801), so the container ends on the check.
9. **Reorder and re-express**, "Install an EFA wheel such as mooncake-transfer-engine-efa, since the
   default build omits the transport" moved from the Mooncake paragraph into the payoff as "For
   Mooncake, install an EFA wheel ..., since the default build omits its efa transport". The
   referent is made explicit. Same two citations.
10. **Re-express**, payoff sentence: "That endpoint, the userspace path of this section's EFA and SRD
    lane, is the first thing to look for in a KV store's transport before planning it onto EFA."
    "First thing to look for" scope kept.
11. **Delete**, the RC disclosure's `headerDescription` ("Where each codebase sets or checks the
    queue-pair type, at pinned tags"). The body names both tags (rdma-core v65.0, Valkey 9.1.2).
12. **Re-express into the diagram**, band line 4 (L1001-L1003): "Mooncake and the Valkey module open a
    libfabric RDM endpoint on efa: look for one first." It restates the payoff paragraph. Matching
    sentence added to the SVG `<title>` (L922-L923). Geometry: band height 68 to 88, viewBox and
    background height 456 to 476, new line at y=450 in `kvf-band-t` (600 12px). Checked with the
    authoring log's Chromium getBBox method (`/tmp/kvlev-geom/measure.mjs`, the authoring script with
    the current strings): every label is inside its box vertically, there are no text overlaps, and
    the new line has 252 units of right margin.
13. Code comment on `KvOverFabricDiagram` points to this pass for the band change (not reader-facing).

Strongest idea, where it now lands: h2 description; diagram heading; h3 "Pooled DRAM: who posts the
RDMA operation"; band lines 1 and 4 and the SVG title; the RC paragraph; the payoff paragraph (twice:
"Both pools above open a libfabric RDM endpoint on the efa provider" and "That endpoint ... is the
first thing to look for"). Strongest number: 700 vs 1,200 Gbps stays visible in FSx P1, the diagram
and the h3.

## After

### Scores

| Axis | Score | Reason |
|---|---|---|
| Mental model | 5 | Each pool paragraph now holds only its model sentences (who posts, where KV lands), and the diagram carries the check as well as the verdict. A reader can put a fourth KV store through three questions: who posts, where it lands, RC verbs or a libfabric efa endpoint. |
| Practical leverage | 4 | The container ends on the check plus the one install step. The knobs are one click away, in a disclosure whose header names them. Held at 4 because no monitoring hook exists in the settled facts (fact-check backlog B1, B3); adding one would be an assertion. |
| Rigor | 4 | Every citation kept (43 badges before, 45 after; the two extra repeat existing refs on the demoted GET sentence). Hedges and both doc-code conflicts intact. Same residual as before. |
| Accuracy | 5 | No new fact; see claim-set diff. |
| Economy | 4 | Visible prose down 19%. The Mooncake paragraph carries 4 citations instead of 10, the Valkey paragraph 8 instead of 13. The FSx connector paragraph is still dense (7 citations), because its "creates GDS_MT" scope has to stay visible. |

### Word count

| Measure | Before | After |
|---|---|---|
| Visible prose (target at most 500) | 612 | 494 |
| Body visible | 552 | 445 |
| Disclosure bodies | 35 | 152 |
| Fact-check method (body plus disclosure bodies) | 587 | 597 |
| Everything reader-facing | 647 | 646 |

The fact-check-method figure rose by 10 because header text was cut (h2 description, RC disclosure
description) while body text grew. The growth came from referents made explicit for text moved into
disclosures ("Mooncake buffers", "the Valkey module", "its efa transport") and from the split GET
sentence. Total reader-facing text is flat.

## Claim-set diff (assertions in the after that are not in the before)

None is a new fact. Re-expressed sentences whose wording differs, each with the source it rests on:

| After | Rests on |
|---|---|
| h2: "Who drives each KV transfer over EFA, where loaded KV lands" | Diagram heading and column heads in the before ("who drives each transfer, and where loaded KV lands"). |
| Band line 4 and SVG title: Mooncake and the Valkey module open a libfabric RDM endpoint on the efa provider, and that endpoint is the first thing to look for in a KV store's transport | Before prose L1750-L1754, `code.mcRdmEndpoint` (efa_context.cpp L75-L103) and `code.vdmaRdm` (endpoint.rs L95-L120); fact check rows 34-35. "First" scope kept ("look for one first"). |
| "since the default build omits its efa transport" | Before: "omits the transport"; `code.mcEfaOff` (common.cmake L100, `option(USE_EFA "option for using AWS EFA transport" OFF)`), fact check row 20. |
| "Mooncake buffers go on every EFA device ..." | Before "Buffers go on ..." in the Mooncake paragraph; `code.mcAllNics`, fact check rows 18-19. |
| "The Valkey server posts a GET with FI_DELIVERY_COMPLETE, so the reply cannot overtake the payload" | Split from the before sentence; `code.vloServerPosts`, `code.vdmaRmaPost`, fact check row 23. |
| "As of 2026-10-24 the Valkey module is unreleased ..." | Before "the module"; same four ProjectRefs, fact check rows 27-29. |
| Disclosure labels "GDS client requirements", "Mooncake NIC and shm settings, and Valkey release status" | Labels only; each names content already in its body. |

Removed from visible view but kept in the container (demoted): GDS client list and driver 2.24.2;
`MC_EFA_NIC_SELECTION=local`; the shm doc-code conflict; `FI_DELIVERY_COMPLETE`; the maturity
sentence. Deleted outright: the RC disclosure description (no claim), and from the h2 description
"Where an EFA cluster can keep KV cache beyond one instance" (the intro states it) and "in GPU or
host memory" (now "where loaded KV lands", weaker or equal).

Never-trade items, checked: sourced numbers 700 and 1,200 Gbps stay visible; 2.24.2, 2026-10-24 and
1.0 are demoted, not dropped. Both doc-code conflicts are kept: README vs glide visible, Mooncake guide
vs `FI_HMEM` in the disclosure. Hedge scopes kept visible: "by our reading of the connector code",
"whose NIXL agent creates GDS_MT", "by our reading of both codebases ... no AWS or Valkey document
stating so was located during this research", "Located clients ... today", the caption, "first thing
to look for". There is no UNKNOWN in this container.

## Verification (worktree root, 2026-10-24)

| Command | Exit |
|---|---|
| `pnpm --filter @tech-deep-dives/efa typecheck` | 0 |
| `pnpm --filter @tech-deep-dives/efa lint` | 0 |
| `pnpm --filter @tech-deep-dives/efa test` | 0 (12 passed) |
| `bash scripts/gates/no-ai-tells.sh` | 0 |
| `bash scripts/gates/svg-a11y.sh` | 0 |
| `bash scripts/gates/pinned-refs.sh` | 0 |
| `bash scripts/gates/pre-overflow.sh` | 0 |

A first no-ai-tells run failed (exit 1) on the code comment, which named this log's filename
(banned-vocabulary match). The comment was reworded, and the rerun exited 0. No Playwright render of
the built page was run: the diagram check is the standalone Chromium getBBox measurement above, and
fact-check backlog B12 stays open.

Note for the orchestrator: during this pass, `deep-dives/silicon-memory-inference/src/sections/FlashCacheTier.tsx`
and `deep-dives/vllm/research/2026-10-kv-tiers/factcheck-vllm.md` changed in the worktree. They are
not from this pass and were not touched.
