# Authoring log, G1 (instances and pricing), October 2026 refresh

STATUS: COMPLETE (all four files edited, all checks green)

Base: commit e6179ae. For these four files it is identical to b39b4d3, so the register line numbers apply.
Agent spot-check, 2026-10-23, WebFetch with its default User-Agent and no personal data: CB-UG (ec2-capacity-blocks.html), CB-PRICE (capacityblocks/pricing), SP-RIS (sp-ris.html) and CB-MONITOR (capacity-blocks-monitor.html). Every quote and rate used below matched the live page.

## Files done

- src/data/pricing.ts
- src/sections/Pricing.tsx
- src/data/instances.ts
- src/sections/InstanceSupport.tsx

Diagrams touched: none. GenerationMappingDiagram (InstanceSupport.tsx:22-93) does not show P6e-GB200, and none of its labels or numbers changed. Pricing.tsx has no diagram.

Length: Pricing.tsx reader prose is flat (approximate word count 1189 before, 1189 after). InstanceSupport.tsx is flat within a few words (+3 words of body prose, -4 words in the expandable header description). The data files gain one instance row (r9g) and lose two notes plus one table row.

## Checks (run from the repo root after the final edit)

| Check | Exit |
|---|---|
| pnpm --filter @tech-deep-dives/efa typecheck | 0 |
| pnpm --filter @tech-deep-dives/efa lint | 0 |
| pnpm --filter @tech-deep-dives/efa test | 0 (12 of 12) |
| scripts/gates/no-ai-tells.sh | 0 |
| scripts/gates/svg-a11y.sh | 0 |
| scripts/gates/pinned-refs.sh | 0 |
| scripts/gates/pre-overflow.sh | 0 |

No failures came from other agents' files during these runs.

## CLAIM DIFF

Tiers follow the dive standard: T1 is official docs or the price list, T2 is a product page. Line numbers are in the edited files.

### src/data/pricing.ts

| file:line | New text (short) | Source + tier | Register row |
|---|---|---|---|
| pricing.ts:7 | header comment: publication version 20261022231453 | PL-CUR https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv T1 | P-01 |
| pricing.ts:16,19 | PRICE_LIST_VIRGINIA "(version 20261022231453)", accessed 2026-10-23 | PL-CUR T1 | P-02 |
| pricing.ts:23,26 | PRICE_LIST_OHIO "(version 20261022231453)", accessed 2026-10-23 | PL-OHIO .../current/us-east-2/index.csv T1 | P-03 |
| pricing.ts:30,33 | PRICE_LIST_ARCHIVE "(123 archived monthly versions)", accessed 2026-10-23 | PL-IDX .../AmazonEC2/index.json T1 | P-04 |
| pricing.ts:40-96 | accessed 2026-10-23 on EFA_DOC, EFA_START_DOC, EFA_ACC_DOC, AC_DOC, HPC_DOC, CO_DOC, GP_DOC, CAPACITY_BLOCK_DOC, CAPACITY_BLOCK_PRICING_DOC | register section 0 read dates | 4b access-date row |
| pricing.ts:99-104 | new DocRef CAPACITY_BLOCK_UG_DOC | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html T1 | 4b; 03 C24 |
| pricing.ts:106-111 | new DocRef CAPACITY_BLOCK_MONITOR_DOC | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-monitor.html T1 | 03 C17 |
| pricing.ts:113-118 | new DocRef SAVINGS_PLANS_DOC | https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html T1 | X-13; 4b |
| (deleted) | WN_G7_DOC and WN_G7E_DOC, both mis-graded tier 1; no user remains after the bandwidthDoc move | n/a | P-07 |
| pricing.ts:152 | g7e.48xlarge bandwidthDoc AC_DOC; note "4 network cards. Highest EFA bandwidth outside the P and Trn families." ("GA January 2026" dropped) | AC https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html T1 (1600 Gigabit, 4 cards) | P-07 |
| pricing.ts:153 | g7.48xlarge bandwidthDoc AC_DOC; note "2 network cards. Nitro v6, so EFA v4." | AC T1 (700 Gigabit, 2 cards; G7 Nitro v6 per N-09); EFA-UG https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html T1 (Nitro v6 (EFA v4) table) | P-07, P-08 (re-expressed, see skipped list) |
| pricing.ts:199 | priceHistory row: 20261022231453, October 2026, $55.04, $21.957642 | PL-CUR T1 (SKUs 3D4V8UAYEMB38GU2, H7NGEAC6UEHNTKSJ) | P-12 |
| pricing.ts:210 | comment quote "scheduled to be updated next in January, 2027." | CB-PRICE https://aws.amazon.com/ec2/capacityblocks/pricing/ T2 | P-13 |
| pricing.ts:213 | NEW u-p6e-gb200x36 UltraServer (36 GPUs), US East (Dallas) Local Zone, $380.952 | CB-PRICE T2 (page: "u-p6e-gb200x36 (36 x B200)", $380.952, $10.582 per accelerator) | P-21 |
| pricing.ts:214 | p6-b300.48xlarge $129.168; regions us-east-1, us-west-2, Atlanta LZ, Seoul, Hyderabad, Jakarta, London; GovCloud (US-East) at $134.55 | CB-PRICE T2 | P-15 |
| pricing.ts:215 | p6-b200.48xlarge $113.666; regions us-east-1, us-east-2, us-west-2, Mumbai, Hyderabad, Stockholm, Paris; GovCloud (US-West, US-East) at $118.404 | CB-PRICE T2 | P-16 |
| pricing.ts:216 | p5en.48xlarge $63.158; "US, Europe and Asia Pacific regions, plus US East (Atlanta) Local Zone" | CB-PRICE T2 | P-17 |
| pricing.ts:217 | p5.48xlarge $47.757; "US, Europe, Asia Pacific and South America regions, plus US East (Atlanta) Local Zone" (the page lists Sydney as "Australia (Sydney)"; AWS files Sydney under Asia Pacific) | CB-PRICE T2 | P-18 |
| pricing.ts:218 | trn2.48xlarge regions "us-east-2, Hyderabad" (rate unchanged $35.7608) | CB-PRICE T2 | P-19 |
| pricing.ts:219 | trn1.32xlarge regions "us-east-1, us-east-2, us-west-2, Mumbai, Melbourne, Sydney, Stockholm" (rate unchanged $9.532) | CB-PRICE T2 | P-20 |

### src/sections/Pricing.tsx

| file:line | New text (short) | Source + tier | Register row |
|---|---|---|---|
| (deleted, was :38) | cost row "EFA data transfer: Free ... billed at nothing per GB either way" removed | cut: no T1 page sources a per-GB EFA figure; the "no additional cost" row above stays | X-15 / U-6 |
| Pricing.tsx:79 | "publication version 20261022231453" | PL-CUR T1 | X-02 |
| Pricing.tsx:125 | h2 description "Price list version 20261022231453." | PL-CUR T1 | X-03 |
| Pricing.tsx:286-287 | "Every On-Demand rate on this page is pinned to version 20261022231453." Scope narrowed from "Every rate", because the Capacity Block rates come from a T2 page and not the price list | PL-CUR T1 | X-06 |
| Pricing.tsx:351 | h2 description "The final-day clock a job has to fit, and what an hour costs against On-Demand" | editorial | rule 8 |
| Pricing.tsx:365-366 | "up to 256 across blocks, counted across every account in the AWS Organization on any one date" | CB-UG T1: "The total number of instances that can be reserved in Capacity Blocks across all accounts in your AWS Organization can't exceed 256 instances on a particular date." | 03 C19 |
| Pricing.tsx:368 | "One UltraServer equals one Capacity Block, reserved as a unit." Re-expressed from "You reserve the UltraServer, not the instances inside it" to drop a negative definition | CAPACITY_BLOCK_DOC (CB-HOW) T1, unchanged fact | style rule 4 |
| Pricing.tsx:369 | "A block cannot be cancelled, moved or split once reserved." | CB-UG T1: "Capacity Block cancellations aren't allowed." / "Capacity Block can't be moved or split." | X-09, 03 C11 |
| Pricing.tsx:377-379 | Every block ends 11:30 UTC on its final day; instance-type blocks start terminating at 11:00 UTC. CB-UG states the 11:00 start without a type qualifier; scoped to instance-type blocks so it agrees with CB-HOW's 60-minute UltraServer rule (a weakening) | CB-UG T1: "Capacity Blocks end at 11:30AM Coordinated Universal Time (UTC)." / "The termination process ... begins at 11:00AM ... on the final day of the reservation." | X-09, 03 C11 |
| Pricing.tsx:379-381 | UltraServer blocks start terminating 60 minutes before the end, EventBridge event 10 minutes before termination begins (fact unchanged, re-expressed; the old "that event is what a drain hook subscribes to" is gone) | CB-HOW https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html T1 | X-08 (CORRECT), 03 C17 |
| Pricing.tsx:384-387 | P6e-GB200 UltraServer block: instances terminated at least 60 minutes before the end [T1], "which is 10:30 UTC" [DERIVED badge: 11:30 minus 60 minutes] | CB-UG T1: "For P6e-GB200 UltraServer Capacity Blocks, you must terminate your instances at least 60 minutes before the Capacity Block end time." | 03 C17 |
| Pricing.tsx:387-391 | Monitoring page times the warning at 40 minutes before the end with no UltraServer case, so the two pages disagree for UltraServers; schedule checkpoint and drain from the clock | CB-MONITOR T1: "Forty minutes before your Capacity Block reservation ends, you receive another EventBridge event that tells you that any instances running in the reservation will begin to terminate in 10 minutes." | 03 C17 |
| (deleted, was :373-386) | "Three things the documentation leaves open" column (January 2026 15% rise, UTC end time, no cancellation) and the June 2025 rebuttal paragraph | end time and cancellation are now in the documented list; the January 2026 rise was dropped because nothing on the page needs it | X-09, 03 C11, U-3 |
| Pricing.tsx:403-405 | "These rates come from the ... pricing page, a Tier 2 source; every On-Demand rate above comes from the Price List bulk API." Quote "scheduled to be updated next in January, 2027." | CB-PRICE T2 | X-10 |
| Pricing.tsx:413-415 | DERIVED: "a block hour costs 99.8% of On-Demand on p6-b200 and p5en, 90.7% on p6-b300 and 86.8% on p5", labelled as our arithmetic of a T2 rate over a T1 rate, with the derived badge. Inputs: 113.666/113.9328 = 99.77%; 63.158/63.296 = 99.78%; 129.168/142.416 = 90.70%; 47.757/55.04 = 86.77% | CB-PRICE T2 over PL-CUR T1 | P-23 |
| Pricing.tsx:478 | "An On-Demand Capacity Reservation (ODCR)", acronym expanded | n/a | 04 acronym row ODCR |
| Pricing.tsx:485-487 | "A Capacity Block is the fixed-window path. It takes no placement group, and places its instances close together inside EC2 UltraClusters itself" | CB-UG T1: "Capacity Blocks do not support placement groups. You can't specify a placement group when you launch instances into a Capacity Block..." and intro "Instances that run inside a Capacity Block are automatically placed close together inside Amazon EC2 UltraClusters" | X-14, 03 C12 |
| Pricing.tsx:487-489 | "A Savings Plan lowers the rate and reserves no capacity, so pair one with an ODCR to get both" | SP-RIS T1: "Savings Plans doesn't provide capacity reservations, but you can allocate On-Demand Capacity Reservation (ODCR) for your needs and your Savings Plans will apply." | X-13 |
| (deleted, was :476-478) | "Savings Plans and an account-team capacity commitment sit alongside them" (as capacity paths) | Savings Plans fixed above; the account-team item had no source | X-13, U-8 |

### src/data/instances.ts

| file:line | New text (short) | Source + tier | Register row |
|---|---|---|---|
| instances.ts:7-16 | header comment quotes headings without "Using"; page-history paragraph deleted | EFA-UG T1 | N-01 |
| instances.ts:18 | ACCESSED = '2026-10-23' (applies to every docs entry) | register section 0 read dates | N-02 |
| instances.ts:63-68 | new docs.mo, "EC2 instance types: Memory optimized" | https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html T1 | 4a |
| instances.ts:99-104 | new docs.p6, "AWS product page: Amazon EC2 P6 instances" | https://aws.amazon.com/ec2/instance-types/p6/ T2 (register P6-PAGE, read 2026-10-23) | I-08 |
| instances.ts:152,161,170,179 | generation headings 'Nitro v3 (EFA v1)' ... 'Nitro v6 (EFA v4)' | EFA-UG T1 | N-03 |
| instances.ts:174 | EFAv3 examples without p6e-gb200 | EFA-UG T1, Nitro v5 table | N-04 |
| instances.ts:183 | EFAv4 examples add p6e-gb200 and r9g | EFA-UG T1, Nitro v6 table | N-05 |
| instances.ts:229 | p6e-gb200.36xlarge efaVersion 'EFAv4' | EFA-UG T1 (Nitro v6 (EFA v4) table); US-PAGE, P6-PAGE T2 | N-06 |
| instances.ts:230 | p6e-gb200.36xlarge nitroVersion 'v6' (follows the User Guide heading) | EFA-UG T1; AC T1 disagrees (Nitro v5) | N-07 |
| instances.ts:236 | note appends "and gives the hypervisor as Nitro v5" (the instance-types page) | AC T1 family summary "P6e-GB200 Nitro v5" | N-08 |
| instances.ts:237 | provenance 'documented' (was 'doc-code-conflict'); conflict field removed. Reason: the 'doc-code-conflict' popover tells the reader "the code is authoritative here", and no code is involved. The doc-versus-doc disagreement is on the hypervisor only, and it stays visible in the row note and in the InstanceSupport passage, with both pages cited | EFA-UG T1 | N-07, N-08 (decision) |
| p4d.24xlarge, p4de.24xlarge, inf1.24xlarge, hpc6a.48xlarge, c5n.18xlarge rows | generation 'Current' (was 'Previous'). The field renders as the "Status" column with AWS's own Current/Previous vocabulary, and its values never tracked "older" consistently (trn1, p5 and g6e were Current), so the value was corrected and the field kept its name | PL-CUR / PL-OHIO T1 "Current Generation = Yes"; EFA-UG T1 files only p3dn under Previous Generation | N-11 |
| instances.ts:556 | hpc6a note "One network card at 100 Gbps." | HPC https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html T1 | N-12 |
| instances.ts:626-637 | r8in.96xlarge note deleted (hedge plus page history); doc docs.mo | MO T1: r8in.96xlarge 600 Gigabit, 2 cards, EFA Yes | N-13 |
| instances.ts:639-654 | NEW row r9g.48xlarge: family R9g; accelerator 'None (AWS Graviton5)'; 1 EFA interface; 100 Gbps; EFAv4; Nitro v6; read + write; useCase 'Memory optimized Graviton5'; Current; category general; documented; doc docs.mo | MO T1 (Graviton5, 1 network card, 100 Gigabit, EFA Yes, family R9g Nitro v6); EFA-UG T1 (Nitro v6 (EFA v4) table, RDMA read Yes write Yes); PL-CUR T1 (Current Generation = Yes, SKU DKEB9JCAA92N7ZQW) | N-17, 4a |
| instances.ts:720 | c7gn.16xlarge accelerator 'None (AWS Graviton3E)' | CO https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html T1 "AWS Graviton3E Processor" | N-14 |

### src/sections/InstanceSupport.tsx

| file:line | New text (short) | Source + tier | Register row |
|---|---|---|---|
| InstanceSupport.tsx:324-325 | "Roughly 300 instance types are EFA-capable" plus a SourceRef (none before) | EFA-UG T1: 305 unique types across the four tables, 2026-10-23 | I-03 |
| InstanceSupport.tsx:354-356 | headings quoted verbatim without "Using" | EFA-UG T1 | I-06 |
| InstanceSupport.tsx:393-394 | expandable header "P6e-GB200: EFA v4, on Nitro v5 or Nitro v6?"; description "EFA v4 on three first-party statements; the hypervisor is contested" | as below | I-08 |
| InstanceSupport.tsx:398-399 | User Guide lists p6e-gb200.36xlarge under Nitro v6 (EFA v4) | EFA-UG T1 | I-08 |
| InstanceSupport.tsx:399-401 | UltraServers product page gives P6e-GB200 UltraServers up to 28.8 Tbps of EFAv4 networking (vendor figure, kept attributed) | US-PAGE https://aws.amazon.com/ec2/ultraservers/ T2 | I-08 (fact unchanged; register O-06 CORRECT) |
| InstanceSupport.tsx:401-402 | P6 product page also says EFAv4 (now carries its own SourceRef) | P6-PAGE T2 | I-08 |
| InstanceSupport.tsx:402-406 | accelerated computing page gives the hypervisor as Nitro v5, which the mapping would pair with EFA v3; "three first-party statements give EFA v4, and the hypervisor version is the contested part" | AC T1 | I-08 |
| InstanceSupport.tsx:409-413 | matrix shows Nitro v6 per the User Guide heading; the User Guide gives this type RDMA read and write; ask the account team if the hypervisor matters. "Trust Nitro v5" deleted | EFA-UG T1 (row: RDMA read Yes, write Yes) | I-08 |
| (deleted, was :408-413) | 'doc-code-conflict' SourceRef with the stale conflict string | n/a | I-09 |
| InstanceSupport.tsx:456 | Trn3 absence "as of 2026-10-23" | EFA-UG, AC, PL-CUR T1 | I-13 |

## Register rows deliberately not applied, with reason

- P-22 (15% October rise): skipped per the orchestrator's decision (changelog voice).
- P-08 replacement text (G7 region list "as of October 2026" from WN-G7-EU): not used. The us-east-1 tension the old note described is gone. The region list would need a T2 What's New ref the table row does not carry, and a us-east-1 price table does not need it. Note re-expressed to "2 network cards. Nitro v6, so EFA v4." WN_G7_REGIONS_DOC not added.
- P-07 tier fix: moot. WN_G7_DOC and WN_G7E_DOC were deleted, because moving bandwidthDoc to AC_DOC left them with no user. instances.ts docs.g7 and docs.g7e were already tier 2 and are unchanged.
- pricing.ts r9g.48xlarge instanceCosts row (4b, optional): skipped. It is optional and would grow the page.
- r9g.48xlarge note "Generally available 2026-08-31.": omitted. Its source (WN-R9G, T2) would not be attached to the row, which cites docs.mo, and the date changes no reader decision.
- I-04 (add r9g to the shortlist sentence): not needed, because r9g has its own row. The sentence still names c9g and m9g as left out, which stays true.
- I-19 (ADT and ACI columns): backlog, per the plan.
- N-10 (p5.4xlarge doc to docs.efa): optional, skipped. docs.ac still supports the row.
- N-15 (trn2u.48xlarge doc): UNKNOWN, left as is. The row's docs.ac also carries the Spot "No" fact in its note, and switching to docs.efa would leave that fact uncited.
- X-15: cut (row deleted) rather than sourced. There is no T1 page for a per-GB EFA figure, and the EC2 on-demand pricing page is a JavaScript shell and a T2 product page in any case.
- 04 acronym AZ (Pricing.tsx "cross-AZ"): the register puts the fix at SrdProtocol.tsx:796 (G2), so it is not touched here.

## Requests to the orchestrator (files I do not own)

1. **O-04, Sources.tsx glossary EFAv4** (about :199): replace with "Fourth EFA generation, on Nitro v6 instances such as P6-B200, P6-B300, G7, G7e and Hpc8a. The EC2 User Guide also lists P6e-GB200 under it, while the accelerated computing page gives that family's hypervisor as Nitro v5." The sentence "The EC2 User Guide places the same instance under Nitro v5, which maps to EFAv3" is wrong now.
2. **Sources appendix and sources.md**: the sections now cite four refs that may be missing from the appendix: capacity-blocks-monitor.html (T1), savingsplans sp-ris.html (T1), instancetypes/mo.html (T1), and the P6 product page https://aws.amazon.com/ec2/instance-types/p6/ (T2, which may already be there next to source 95, per O-06). ec2-capacity-blocks.html is source 30; O-05 moves its accessDate to 2026-10-23.
3. **sources.md / Sources.tsx claims rows** that quote Capacity Block rates or the "three things the documentation leaves open" (end time, cancellation, January 2026 rise): sync them to the page. The end time and no-cancellation rule are documented (CB-UG), and the January 2026 rise has left the page.
4. **Glossary**: UTC is expanded inline at Pricing.tsx:377, and ODCR at Pricing.tsx:478. Add glossary entries if the appendix lacks them.
5. **Status column** (InstanceSupport, the `generation` field): every row is now 'Current', so the column carries no information. I kept it rather than remove UI. Dropping it is your call. Orchestrator decision (2026-10-23): column and filter field dropped, since a column with one value carries no information.
6. **For G6 or the backlog (not applied, no G1 row)**: the Capacity Block pricing page also lists p5e.48xlarge $54.924, p5.4xlarge $5.970, p4d.24xlarge $13.57, p4de.24xlarge $20.369 and trn2.3xlarge $2.235. They are not in the dive's table and no register row covers them. 03 C20 ("Savings Plans and Reserved Instance discounts don't apply to Capacity Blocks", CB-BILL) would also fit the Savings Plans sentence at Pricing.tsx:487. I did not add it because C20 is assigned to DecisionGuide (G6) and I did not read CB-BILL myself.

STATUS: COMPLETE
