# Fact check FC1: instances and pricing (October 2026 refresh)

STATUS: see last line

Scope: deep-dives/efa/src/data/instances.ts, deep-dives/efa/src/data/pricing.ts,
deep-dives/efa/src/sections/InstanceSupport.tsx, deep-dives/efa/src/sections/Pricing.tsx.
Diff under test: b39b4d3..HEAD. Checker: adversarial pass, 2026-10-23.

## Progress note (resume after stop)

No verdicts had been reached before the stop. Completed so far: read the four diffs
(b39b4d3..HEAD) and authoring-log-G1.md CLAIM DIFF. A fresh download of the us-east-1
price list was interrupted (exit 137). HEAD of
https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv
on 2026-10-23 16:35 UTC returned Last-Modified Fri, 23 Oct 2026 00:00:59 GMT,
Content-Length 302879824; the cached copy's header reads Version 20261022231453,
Publication Date 2026-10-22T23:14:53Z.

Note for the reader of this report: the InstanceSupport.tsx diff removes the "Status"
column (generation badge) and its filter field, which authoring-log-G1 says it kept.

## File 1: deep-dives/efa/src/data/pricing.ts

Price evidence: fresh download 2026-10-23 of
https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv
(302879824 bytes, header "Version","20261022231453", "Publication Date","2026-10-22T23:14:53Z")
and .../current/us-east-2/index.csv (280758503 bytes, same version). Strict filter applied:
TermType=OnDemand, Operating System=Linux, Tenancy=Shared, CapacityStatus=Used,
MarketOption=OnDemand, Pre Installed S/W=NA, License Model=No License required. The
CapacityBlock rows at 0.0000000000 exist for p4d, p5, p5.4xlarge, p5en (confirmed), so the
filter matters. Capacity Block page: https://aws.amazon.com/ec2/capacityblocks/pricing/ fetched
2026-10-23 with curl default User-Agent.

| ID | file:line | claim (short) | verdict | evidence fetched | exact fix |
|---|---|---|---|---|---|
| P1 | pricing.ts:7 | header comment pins version 20261022231453 | HOLDS | us-east-1 CSV header "Version","20261022231453" | none |
| P2 | pricing.ts:16,19 | PRICE_LIST_VIRGINIA version 20261022231453, accessed 2026-10-23 | HOLDS | same CSV header | none |
| P3 | pricing.ts:23,26 | PRICE_LIST_OHIO version 20261022231453 | HOLDS | us-east-2 CSV header "Version","20261022231453"; hpc8a.96xlarge 7.92 (DHE8AAH9UWSR4R5C), hpc7a 12/24/48/96xlarge all 7.20, hpc6id.32xlarge 5.70, hpc6a.48xlarge 2.88 (WN977FJGFJ8J4XQ4) | none |
| P4 | pricing.ts:30 | "(123 archived monthly versions)" | PARTIAL | .../AmazonEC2/index.json: 123 entries under "versions", oldest 20151209144527, newest 20261022231453 (the current version is counted). They span 100 distinct months; months such as 201703, 201710, 201802 carry two versions, so the set is not one per month | "(123 archived versions)" |
| P5 | pricing.ts:148-164 | all 17 us-east-1 On-Demand rates now attributed to 20261022231453 | HOLDS | strict rows: p6-b300 142.416 (G2B25BSJJUB6HQPQ), p6-b200 113.9328 (JU8KS3Q3UCS3GM6X), p5en 63.296, p5.48xlarge 55.04 (3D4V8UAYEMB38GU2), g7e.48xlarge 33.14432, g7.48xlarge 28.51328, p4de 27.44705, trn1n 24.78, p4d 21.957642 (H7NGEAC6UEHNTKSJ), trn1 21.5, m8gn 13.968, c8gn 11.376, c8i 8.99616, c6in 7.2576, p5.4xlarge 6.88, c7gn.16xlarge 3.9936, c5n.18xlarge 3.888, hpc7g.16xlarge 1.6832; all match | none |
| P6 | pricing.ts:152 | g7e note "4 network cards. Highest EFA bandwidth outside the P and Trn families", bandwidthDoc AC_DOC | HOLDS (bandwidth) / see I-series for AC page | price list Network Performance: only p6-b300 (6400), p5en, p6-b200, p5.48xlarge (3200), g7e.48xlarge and trn1n.32xlarge (1600) reach 1600 or above in us-east-1, so no non-P, non-Trn type exceeds g7e | none, but note a single-page citation (AC) cannot by itself carry a cross-family superlative |
| P7 | pricing.ts:153 | g7 note "2 network cards. Nitro v6, so EFA v4." | checked in File 3 (AC page and EFA UG table) | see I-series | see I-series |
| P8 | pricing.ts:199 | priceHistory row 20261022231453, October 2026, $55.04, $21.957642 | HOLDS | p5.48xlarge 55.0400000000, p4d.24xlarge 21.9576420000 in that version | none |
| P9 | pricing.ts:210 | quote "scheduled to be updated next in January, 2027." | HOLDS | pricing page: "The current prices are scheduled to be updated next in January, 2027." | none |
| P10 | pricing.ts:212-213 | u-p6e-gb200x72 $761.904 and NEW u-p6e-gb200x36 $380.952, Dallas Local Zone | HOLDS | page: "u-p6e-gb200x72 US East (Dallas) Local Zone $761.904 ($10.582 USD) 72 x B200"; "u-p6e-gb200x36 ... $380.952 ($10.582 USD) 36 x B200" | none |
| P11 | pricing.ts:214 | p6-b300 $129.168; us-east-1, us-west-2, Atlanta LZ, Seoul, Hyderabad, Jakarta, London; GovCloud (US-East) $134.55 | HOLDS | page lists exactly those 8 locations; GovCloud (US-East) "$134.55 USD" | none |
| P12 | pricing.ts:215 | p6-b200 $113.666; us-east-1, us-east-2, us-west-2, Mumbai, Hyderabad, Stockholm, Paris; GovCloud (US-West, US-East) $118.404 | HOLDS | page lists exactly those 9 locations at those rates | none |
| P13 | pricing.ts:216 | p5en $63.158; "US, Europe and Asia Pacific regions, plus US East (Atlanta) Local Zone" | PARTIAL | rate holds. Page lists 11 Regions (Ohio, N. Virginia, N. California, Oregon, Stockholm, London, Spain, Jakarta, Mumbai, Tokyo, Seoul) plus Atlanta LZ. "US, Europe and Asia Pacific regions" reads as every Region in those geographies; Frankfurt, Ireland, Singapore and others are absent | regions: "11 Regions in the US, Europe and Asia Pacific, plus US East (Atlanta) Local Zone" |
| P14 | pricing.ts:217 | p5 $47.757; "US, Europe, Asia Pacific and South America regions, plus US East (Atlanta) Local Zone" | PARTIAL | rate holds. Page lists 11 Regions (N. Virginia, Ohio, Oregon, N. California, Tokyo, Jakarta, Mumbai, Australia (Sydney), London, Stockholm, Sao Paulo) plus Atlanta LZ. Same over-wide scope as P13 | regions: "11 Regions in the US, Europe, Asia Pacific and South America, plus US East (Atlanta) Local Zone" |
| P15 | pricing.ts:218 | trn2.48xlarge us-east-2, Hyderabad, $35.7608 | HOLDS | page: trn2.48xlarge US East (Ohio) and Asia Pacific (Hyderabad), "$35.7608 USD" | none |
| P16 | pricing.ts:219 | trn1.32xlarge us-east-1, us-east-2, us-west-2, Mumbai, Melbourne, Sydney, Stockholm, $9.532 | HOLDS | page lists exactly those 7 at "$9.532 USD" | none |
| P17 | pricing.ts:99-118 | new DocRefs CAPACITY_BLOCK_UG_DOC, CAPACITY_BLOCK_MONITOR_DOC, SAVINGS_PLANS_DOC, tier 1 | HOLDS | all three URLs return the AWS documentation pages titled "Capacity Blocks for ML", "Monitor Capacity Blocks using EventBridge", "Compute Savings Plans and Reserved Instances" | none |

## File 2: deep-dives/efa/src/sections/Pricing.tsx

Sources fetched 2026-10-23 (curl default User-Agent):
CB-UG https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html,
CB-HOW https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html,
CB-MONITOR https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-monitor.html,
SP-RIS https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html.

| ID | file:line | claim (short) | verdict | evidence fetched | exact fix |
|---|---|---|---|---|---|
| R1 | Pricing.tsx:79, 125, 286-287 | version 20261022231453; "Every On-Demand rate on this page is pinned" to it | HOLDS | see P1-P5, P8 (every us-east-1 and us-east-2 rate re-derived) | none |
| R2 | Pricing.tsx:365-366 | up to 64 per block, 256 across blocks, counted across every account in the Organization on any one date | HOLDS | CB-UG: "The total number of instances that can be reserved in Capacity Blocks across all accounts in your AWS Organization can't exceed 256 instances on a particular date." | none |
| R3 | Pricing.tsx:368 | one UltraServer equals one Capacity Block, reserved as a unit | HOLDS | CB-HOW: "For Amazon EC2 UltraServers, each UltraServer corresponds to one Capacity Block." | none |
| R4 | Pricing.tsx:369 | cannot be cancelled, moved or split once reserved | HOLDS | CB-UG: "Capacity Block cancellations aren't allowed." "Capacity Block can't be moved or split." | none |
| R5 | Pricing.tsx:377-379 | every block ends 11:30 UTC; instance-type blocks start terminating at 11:00 UTC | HOLDS | CB-UG: "Capacity Blocks end at 11:30AM Coordinated Universal Time (UTC)." "The termination process ... begins at 11:00AM ... on the final day of the reservation." (the "instance-type" scoping is a narrowing, consistent with CB-HOW's 30 minutes) | none |
| R6 | Pricing.tsx:379-381 | "UltraServer blocks start 60 minutes before the end, with an EventBridge event 10 minutes before termination begins" | PARTIAL | CB-HOW: "With 30 minutes (for instance types) or 60 minutes (for UltraServer types) left ... instances ... begin terminating." "An event is emitted through EventBridge 10 minutes before the termination process begins." Fact holds, but the sentence as written says the block "starts" 60 minutes before the end, which misstates it | "UltraServer blocks start terminating 60 minutes before the end, with an EventBridge event 10 minutes before termination begins" |
| R7 | Pricing.tsx:384-387 | P6e-GB200 UltraServer: terminate at least 60 minutes before the end; "which is 10:30 UTC" with DerivedBadge | HOLDS | CB-UG: "For P6e-GB200 UltraServer Capacity Blocks, you must terminate your instances at least 60 minutes before the Capacity Block end time." 11:30 minus 60 minutes = 10:30, labelled derived | none |
| R8 | Pricing.tsx:387-391 | monitoring page times the warning at 40 minutes before the end, no UltraServer case; pages disagree for UltraServers | HOLDS | CB-MONITOR: "Forty minutes before your Capacity Block reservation ends, you receive another EventBridge event that tells you that any instances running in the reservation will begin to terminate in 10 minutes." The only "UltraServer" string on the page is the navigation link "Create UltraServer group". CB-HOW implies 70 minutes for UltraServers, so the disagreement is real | none |
| R9 | Pricing.tsx:403-405 | rates from a Tier 2 pricing page; quote "January, 2027" | HOLDS | see P9 | none |
| R10 | Pricing.tsx:413-415 | our arithmetic: 99.8% (p6-b200, p5en), 90.7% (p6-b300), 86.8% (p5) | HOLDS | 113.666/113.9328 = 99.766%; 63.158/63.296 = 99.782%; 129.168/142.416 = 90.698%; 47.757/55.04 = 86.768%. All four block rates are listed for US East (N. Virginia), so the like-for-like region holds. Labelled as ours with DerivedBadge | none |
| R11 | Pricing.tsx:478 | ODCR expansion | HOLDS | SP-RIS uses "On-Demand Capacity Reservation (ODCR)" | none |
| R12 | Pricing.tsx:485-487 | a Capacity Block takes no placement group and places instances close together inside EC2 UltraClusters | HOLDS | CB-UG: "Capacity Blocks do not support placement groups." and "Instances that run inside a Capacity Block are automatically placed close together inside Amazon EC2 UltraClusters" | none |
| R13 | Pricing.tsx:487-489 | a Savings Plan lowers the rate and reserves no capacity; pair with an ODCR | HOLDS | SP-RIS: "Savings Plans doesn't provide capacity reservations, but you can allocate On-Demand Capacity Reservation (ODCR) for your needs and your Savings Plans will apply." | none |
| R14 | (deleted row) | "EFA data transfer: Free" removed | HOLDS (removal) | no claim left to test | none |

Pricing style findings (changed lines only): no em-dash, en-dash or curly quote found in the
changed text by visual review; scan by script follows at the end of the report. No
changelog voice in the changed lines of either pricing file.

## File 3: deep-dives/efa/src/data/instances.ts

Sources fetched 2026-10-23 (curl default User-Agent):
EFA-UG https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html (tables parsed by script:
305 unique types; Nitro v6 (EFA v4) 135, Nitro v4 (EFA v2) 96, Nitro v5 (EFA v3) 41,
Nitro v3 (EFA v1) 33; p3dn.24xlarge is the only type under "Previous Generation"),
AC https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html,
MO https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html,
CO https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html,
HPC https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html, and the two price lists above.

| ID | file:line | claim (short) | verdict | evidence fetched | exact fix |
|---|---|---|---|---|---|
| N1 | instances.ts:10-13, 152, 161, 170, 179 | headings verbatim "Nitro v6 (EFA v4)", "Nitro v5 (EFA v3)", "Nitro v4 (EFA v2)", "Nitro v3 (EFA v1)" | HOLDS | EFA-UG text lines read exactly "Nitro v6 (EFA v4)" ... "Nitro v3 (EFA v1)", no "Using" prefix | none |
| N2 | instances.ts:174 | EFAv3 examples p5en, trn2, trn2u, hpc7g, c7gn, c8g, m8g, r8g, x8g, i7ie, i8g | HOLDS | every family appears only in the Nitro v5 (EFA v3) table; p6e-gb200 is not in it | none |
| N3 | instances.ts:183 | EFAv4 examples add p6e-gb200 and r9g (20 families) | HOLDS | all 20 families appear only in the Nitro v6 (EFA v4) table | none |
| N4 | instances.ts:229-230 | p6e-gb200.36xlarge EFAv4, Nitro v6 | HOLDS (EFA v4) / contested (Nitro) | EFA-UG: p6e-gb200.36xlarge in the Nitro v6 (EFA v4) table, RDMA read Yes, write Yes. AC family summary: "P6e-GB200 Nitro v5 NVIDIA Grace (arm64)". The Nitro v6 value follows one Tier 1 page against another | none; the note at :236 discloses the disagreement |
| N5 | instances.ts:236 | note appends "gives the hypervisor as Nitro v5"; "3,200 Gbps of total network capacity" | HOLDS | AC network row: "p6e-gb200.36xlarge ... 3200 Gigabit ... 17" network cards; family summary Nitro v5 | none |
| N6 | instances.ts:237 | provenance 'documented', conflict field removed | HOLDS (with caveat) | shared/src/components/SourceRef.tsx offers no doc-versus-doc value; 'doc-code-conflict' is defined as "Documentation and code disagree. Code is authoritative.", which does not fit. The row note keeps the AC disagreement visible | none |
| N7 | instances.ts p4d (:303), p4de (:318), inf1 (:463), hpc6a (:546), c5n (:750) | generation 'Current' | HOLDS (not rendered) | us-east-1 strict rows: p4d, p4de, inf1.24xlarge (S8JTWNNXNMNADCBB), c5n "Current Generation" = Yes; us-east-2 hpc6a.48xlarge = Yes; EFA-UG files none of them under Previous Generation. The field is no longer rendered: the Status column and its filter were removed from InstanceSupport.tsx and no other file reads it | none |
| N8 | instances.ts:556 | hpc6a "One network card at 100 Gbps." | HOLDS | HPC network row: "hpc6a.48xlarge 1 100 Gigabit ✓ Yes ... 1" network card | none |
| N9 | instances.ts:626-637 | r8in.96xlarge: 2 EFA interfaces, 600 Gbps, EFAv4, Nitro v6, read + write; doc moved to docs.mo | HOLDS | MO network row: "r8in.96xlarge 600 Gigabit ✓ Yes ... 2" network cards; family summary "R8in Nitro v6"; EFA-UG Nitro v6 (EFA v4) table, read Yes, write Yes | none |
| N10 | instances.ts:639-654 | NEW r9g.48xlarge: Graviton5, 1 EFA interface, 100 Gbps, EFAv4, Nitro v6, read + write, Current | HOLDS | MO: "r9g.48xlarge 1536.00 AWS Graviton5 192 192 1"; network row "r9g.48xlarge 100 Gigabit ✓ Yes ... 1" network card; family summary "R9g Nitro v6"; EFA-UG Nitro v6 (EFA v4), read Yes, write Yes; us-east-1 price list DKEB9JCAA92N7ZQW Current Generation Yes | none |
| N11 | instances.ts:720 | c7gn.16xlarge 'None (AWS Graviton3E)' | HOLDS | CO: "c7gn.16xlarge 128.00 AWS Graviton3E Processor". The us-east-1 price list labels the same SKU "AWS Graviton3 Processor"; the CO page is the specification source | none |
| N12 | instances.ts:63-68 | new docs.mo, tier 1 | HOLDS | URL resolves to the EC2 memory optimized specifications page | none |
| N13 | instances.ts:99-104 | new docs.p6, AWS product page, tier 2 | checked in File 4 (I5) | see I5 | see I5 |
| N14 | instances.ts:18 | ACCESSED 2026-10-23 for every docs entry | HOLDS for the entries re-fetched here (efa, ac, mo, co, hpc) | fetched today | none |

## File 4: deep-dives/efa/src/sections/InstanceSupport.tsx

Extra sources fetched 2026-10-23 (curl default User-Agent):
P6-PAGE https://aws.amazon.com/ec2/instance-types/p6/ (tier 2),
US-PAGE https://aws.amazon.com/ec2/ultraservers/ (tier 2),
NEURON-TRN3 https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html
(title "Amazon EC2 Trn3 Architecture", AWS Neuron Documentation, AWS-authored).

| ID | file:line | claim (short) | verdict | evidence fetched | exact fix |
|---|---|---|---|---|---|
| I1 | InstanceSupport.tsx:316-317 | "Roughly 300 instance types are EFA-capable" with EFA-UG ref | HOLDS | EFA-UG tables: 305 unique instance types (p3dn.24xlarge listed twice) | none |
| I2 | InstanceSupport.tsx:346-348 | four headings quoted verbatim without "Using" | HOLDS | see N1 | none |
| I3 | InstanceSupport.tsx:385-386 | header "P6e-GB200: EFA v4, on Nitro v5 or Nitro v6?"; "EFA v4 on three first-party statements; the hypervisor is contested" | HOLDS | EFA-UG (Nitro v6 (EFA v4) table), US-PAGE and P6-PAGE all say EFA v4; AC says Nitro v5 | none |
| I4 | InstanceSupport.tsx:390 | User Guide lists p6e-gb200.36xlarge under Nitro v6 (EFA v4) | HOLDS | see N4 | none |
| I5 | InstanceSupport.tsx:391-393 | UltraServers page: up to 28.8 Tbps of EFAv4 networking; P6 page also says EFAv4 | HOLDS | US-PAGE: "up to 28.8 terabits per second of Elastic Fabric Adapter (EFAv4) networking". P6-PAGE: "up to 28.8 terabits per second of total Elastic Fabric Adapter networking (EFAv4)" and "P6e UltraServers and P6 instances use fourth- generation Elastic Fabric Adapter networking (EFAv4)". The 28.8 Tbps figure is attributed to the product page, not stated as a measurement; both refs are graded tier 2 | none |
| I6 | InstanceSupport.tsx:393-398 | AC gives P6e-GB200 hypervisor as Nitro v5, which the mapping pairs with EFA v3; "three first-party statements give EFA v4" | HOLDS | AC family summary "P6e-GB200 Nitro v5"; the three EFA v4 statements are one tier 1 (EFA-UG) and two tier 2 (US-PAGE, P6-PAGE), all AWS-authored, so "first-party" is accurate | none |
| I7 | InstanceSupport.tsx:401-403 | matrix shows Nitro v6 per the User Guide; User Guide gives RDMA read and write | HOLDS | EFA-UG p6e-gb200.36xlarge: RDMA read "Yes", RDMA write "Yes" | none |
| I8 | InstanceSupport.tsx:446-450 | no trn3 type in EFA-UG tables, AC page or us-east-1 price list as of 2026-10-23; so no EFA device count or per-instance EFA bandwidth "can be stated from any Tier 1 source today" | PARTIAL | First sentence HOLDS: EFA-UG has no trn3 type, AC page has 0 "trn3" strings, the us-east-1 CSV has 0 "trn3" rows. The second sentence is wider than what was checked. NEURON-TRN3, official AWS documentation (Tier 1 under this dive's grading), publishes "EFA bandwidth (Gbps) 12,800" for the Trn3 Gen1 UltraServer and "28,800" for Gen2. It gives no per-instance figure or device count, so the narrow claim survives, but "any Tier 1 source" overstates the search and hides a Tier 1 Trn3 EFA figure | replace the closing clause with: "That is why there is no Trn3 row above. The AWS Neuron Trn3 architecture page gives EFA bandwidth only per UltraServer, 12,800 Gbps for Gen1 and 28,800 Gbps for Gen2, and no per-instance figure or EFA device count." and add a DocRef for NEURON-TRN3 |
| I9 | InstanceSupport.tsx:117, 244 (removed) | Status column and generation filter removed | n/a (UI removal) | authoring-log-G1 says the column was kept; the diff removes it. The log does not match the shipped file | none to the page; correct the log if it is kept as a record |

## Style findings (all four files, added lines only)

Mechanical scan of the 158 added lines of the b39b4d3..HEAD diff:
- Em-dash, en-dash, `&mdash;`, `&ndash;`, curly quotes: none found.
- Changelog voice ("now", "previously", "no longer", "updated", "Correction", "earlier version", "used to"): two hits, both inside the verbatim AWS quote "scheduled to be updated next in January, 2027" (pricing.ts:210, Pricing.tsx:405). Quoted source text, exempt. The deleted page-history paragraph in instances.ts and the deleted hpc6a and r8in history notes remove the earlier changelog voice.
- Banned vocabulary (delve, seamless, robust, leverage, and the rest of the list): none.
- Pricing.tsx:379-380 "UltraServer blocks start 60 minutes before the end" drops the verb object and reads as the block starting, not terminating (see R6 for the fix).
- InstanceSupport.tsx:450 "today" is relative time in reader text; with the date already stated at :448 the word adds nothing and will age. Delete it (covered by the I8 replacement).

## Counts

| Verdict | Count | IDs |
|---|---|---|
| HOLDS | 46 | P1-P3, P5, P6, P8-P12, P15-P17, R1-R5, R7-R14, N1-N12, N14, I1-I7 |
| PARTIAL | 5 | P4, P13, P14, R6, I8 |
| FAILS | 0 | none |
| UNVERIFIABLE | 0 | none |
| Deferred or n/a | 3 | P7 (answered by AC: g7.48xlarge 2 network cards, family Nitro v6, EFA-UG Nitro v6 (EFA v4), so HOLDS in substance), N13 (answered by I5), I9 (UI removal) |

Personal data sent in any request: none. All fetches used curl with its default User-Agent and
no headers, query strings or bodies carrying user data.

STATUS: COMPLETE
