# Leverage pass fc11-measure (sections 29, 30, 31), 2026-10-31

Standard: `deep-dives/efa/revamp/leverage-pass-standard.md`. Run after the fact check in
`reviews/factcheck/fc11-measure.md`; the before-scores are for the files as the fact check left them.

Status: complete. Accuracy holds at 5 on all three files; the leverage edits add no claim.

## Before-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| WhatToMeasure.tsx (29) | 5 | 5 | 5 | 5 | 3 |
| Telemetry.tsx (30) | 4 | 5 | 5 | 5 | 3 |
| BringUp.tsx (31) | 4 | 5 | 5 | 5 | 3 |

WhatToMeasure: three layers that explain each other's symptoms is a strong model and the alert set is
directly usable; economy is the weak axis, with field-ID reference detail (the v4.7.0 renames, the NVLink
counter numbers by GPU generation) inline in the hardware argument.
Telemetry: the stall-to-teardown timeline and the per-path map carry the section; the heartbeat-monitor
mechanism sits inline between the timeline and the guidance it leads to.
BringUp: the ladder gives the order and every rung ends on a check; about 2,850 words, with the evidence
behind the version commands and the one-node smoke run inline (the length item: prefer demotion).

## WhatToMeasure.tsx (section 29)

| block | 1. what it means to the reader | 2. mental model, visible? | 3. leverage | action |
|---|---|---|---|---|
| Intro | few signals, and which layer moved | yes | frames the section | kept |
| Three layers + diagram | each layer explains the others' symptoms | visible in the diagram | where to look first | kept |
| Job efficiency | 4,000 tokens/s on 8B is about 20% MFU; same FLOP count on both sides | MFU inherits its peak; counts differ by 20.2% | compare in tokens per second | kept; strongest number in h1, h2 and the closing paragraph |
| Data loading, per-rank time | 20% threshold; slowest rank sets the pace | synchronous step | two alerts | kept |
| Model health | gradient norm leads the loss | lagging and leading signals | spike score, rollback budget | kept; four-run evidence already demoted |
| Pre-clip norm, NaN stop | read the logged norm correctly; stop before the update | yes | avoids a false alarm | kept |
| Memory | two allocator peaks | headroom and fragmentation | one number per rank | kept |
| Hardware: utilization vs SM activity | GPU utilization only says a kernel ran | yes | 0.5 alert | kept |
| Field IDs (renames) and NVLink counters | reference detail for dashboard builders | no | needed only when wiring a dashboard | demoted into "Field IDs for dashboards: the v4.7.0 renames and the NVLink counters by GPU generation"; the EFA-dive pointer stays in the body |
| Xids, throttling | buckets decide whether the node stays; throttling raises no error | yes | the Xid rule and the slow-rank link | kept |
| Table and alerts | six alerts, ends on the reader's measured step | n/a | the next action | kept; ends on the action |

## Telemetry.tsx (section 30)

| block | 1. what it means to the reader | 2. mental model, visible? | 3. leverage | action |
|---|---|---|---|---|
| Hang: timeout and teardown | a stall becomes a crash with traces about 11 minutes later | timeline diagram | keep the default | kept |
| Heartbeat monitor | the slower path when the watchdog itself hangs | in the diagram's second bar | rarely acted on | demoted into "If the watchdog itself hangs: the heartbeat monitor", after the guidance it used to precede (reorder) |
| Leave the timeout alone | about 6% of Llama 3's interval; when to raise it; framework timeouts | yes | the one knob | kept |
| Flight recorder, buffer arithmetic | 2,000 entries is a few steps | yes, with the arithmetic demoted | set the buffer and path | kept |
| Dump location, tutorial conflict | put dumps on shared storage | n/a | the path variable | kept; conflict stays demoted |
| torchfrtrace, NCCL RAS | after the crash and while hung | yes | names the missing rank | kept |
| GPU counters | default file leaves alert counters out | n/a | copy and uncomment | kept |
| AWS map and per-path blocks | what is on and off per path | map | the switches | kept |
| A4 protocol | not yet run, labelled | n/a | n/a | kept, label intact |
| Slow runs, Trainium, ending | profiler and log levels; Neuron's 30 s timeout; the switch list | yes | ends on the checklist | kept |

## BringUp.tsx (section 31)

| block | 1. what it means to the reader | 2. mental model, visible? | 3. leverage | action |
|---|---|---|---|---|
| Intro and ladder | order checks so each failure appears at the smallest scale | ladder diagram | the order | kept |
| Rung 1 | quota 0 by default; reservation sets the date | n/a | file the request | kept |
| Rung 2 | screen every node and keep per-node history; 14% to 4% | repeat offenders | screening per path | kept; strongest number in h1 and h2 |
| Rung 3 | who supplies which layer; read versions in the container | yes | three commands, image digest | the sources for each command's output demoted into "Where each command's output is documented"; digest advice stays in the body |
| Rung 4 | hold busbw per instance against 400 GB/s | per-instance count | the pass bar | kept; sample already demoted |
| Rung 5 | fake mode, then a one-node run | what each can and cannot see | a script | the source trail for the one-node step demoted into "Where the one-node step comes from"; "our reading" stays in the body |
| Rungs 6, 7 | measured layout wins; same FLOP count | formulas pick candidates, implementation picks the winner | Calculator A update | kept |
| Rungs 8 to 10 | restart, scale, alert | 2(M-1)/M bound | pass conditions | kept |
| Checklist | ten checks, ends on rung 1 today | n/a | the next action | kept |

## Claim diff

`git diff` against HEAD for the three files: every added sentence is a Pass 1 correction with its Cite on the
page (listed in the fact-check report). The leverage edits only move blocks into `ExpandableSection`s and
reflow lines; each Cite moved with its sentence, and no hedge, label, venue or number changed.

## After-scores (1 to 5)

| file | mental model | practical leverage | rigor | accuracy | economy |
|---|---|---|---|---|---|
| WhatToMeasure.tsx (29) | 5 | 5 | 5 | 5 | 4 |
| Telemetry.tsx (30) | 4 | 5 | 5 | 5 | 3 |
| BringUp.tsx (31) | 4 | 5 | 5 | 5 | 3 |

Telemetry and BringUp stay at 3 on economy: the demotions lighten the reading path but the sections remain
long, and nothing else passed the deletion test without trading a sourced number or a hedge.
