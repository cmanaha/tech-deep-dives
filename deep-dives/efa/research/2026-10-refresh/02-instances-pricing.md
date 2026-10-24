# 2026-10 Refresh: Instances and Pricing (research 02)

Accessed dates: price-list facts were first read 2026-10-18 (version 20261015191316) and re-read 2026-10-23 (version 20261022231453, the version every rate in this document cites). All documentation, product-page and What's New facts were read 2026-10-23.
Scope: deep-dives/efa/src/data/instances.ts, src/data/pricing.ts, src/sections/InstanceSupport.tsx, src/sections/Pricing.tsx, and instance / bandwidth / price / region claims elsewhere in src/sections.
Baseline: research/2026-08-refresh/05-instances-pricing.md and V2-verify-pricing.md.
Method: AWS Price List bulk API (Tier 1), full strict filter, parsed with Python csv (not grep) so quoted commas cannot shift columns. Filter: TermType=OnDemand AND Operating System=Linux AND Tenancy=Shared AND CapacityStatus=Used AND MarketOption=OnDemand AND Pre Installed S/W=NA AND License Model=No License required.
Local extracts (re-usable): /tmp/efa-pricing/use1-1023-strict.tsv (version 20261022231453, 1,393 strict rows), /tmp/efa-pricing/use1-jul-strict.tsv (20260728175247, 1,367 strict rows), /tmp/efa-pricing/use2-1023-strict.tsv (Ohio 20261022231453, 1,248 strict rows), *-types-any.tsv (every instance type with every TermType/MarketOption/OS/Tenancy combination present).

## 0. Source inventory (provenance stamps)

| Ref | URL | Provenance stamp | Read |
| --- | --- | --- | --- |
| PL-CUR (us-east-1), governing | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv | `Last-Modified: Fri, 23 Oct 2026 00:00:59 GMT`; `Content-Length: 302879824`; `ETag "e51626de6e61c371e51f4e7ae156f5ed-37"`; in-file `Publication Date 2026-10-22T23:14:53Z`, `Version 20261022231453` | 2026-10-23 |
| PL-OHIO (us-east-2), governing | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-2/index.csv | `Last-Modified: Fri, 23 Oct 2026 00:00:59 GMT`; `Content-Length: 280758503`; `ETag "a0105514bf7e4cdd1f8a4d684f5cbfde-34"`; in-file `Publication Date 2026-10-22T23:14:53Z`, `Version 20261022231453` | 2026-10-23 |
| PL-CUR-1015 (us-east-1), superseded first pull | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv | `Last-Modified: Thu, 15 Oct 2026 20:11:29 GMT`; `Content-Length: 302869403`; `ETag "8b4008924586fb83acd446f7bb029cee-37"`; in-file `Publication Date 2026-10-15T19:13:16Z`, `Version 20261015191316` | 2026-10-18 |
| PL-OHIO-1015 (us-east-2), superseded first pull | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-2/index.csv | `Last-Modified: Thu, 15 Oct 2026 20:11:28 GMT`; `Content-Length: 280748342`; `ETag "d8319a101e83724a5596a15faa64a357-34"`; in-file `Publication Date 2026-10-15T19:13:16Z`, `Version 20261015191316` | 2026-10-18 |
| PL-IDX | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/index.json | Read 2026-10-18: 123 versions ending `20261015191316`. Re-read 2026-10-23: still 123 versions, `currentVersion 20261022231453`, which now occupies the October slot (effective 2026-10-01, no end date) in place of `20261015191316`. Versions since the August baseline: `20260831181331` (effective 2026-08-01 to 2026-09-01), `20260925174521` (2026-09-01 to 2026-10-01), `20261015191316` (2026-10-01, current, no end date) | 2026-10-18 |
| PL-JUL (archived us-east-1) | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20260728175247/us-east-1/index.csv | in-file `Publication Date 2026-07-28T17:52:47Z`, `Version 20260728175247`; 302,926,569 bytes. Used only to diff July against October | 2026-10-18 |

All are Tier 1 (first-party AWS machine-readable price data).

Document sources (HTML saved under /tmp/efa-docs/, parsed locally; all read 2026-10-23):

| Ref | URL | Tier (dive standard) |
| --- | --- | --- |
| EFA-UG | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html | 1 |
| EFA-ACC | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html | 1 |
| EFA-START | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html | 1 |
| AC / HPC / CO / GP / MO / SO | https://docs.aws.amazon.com/ec2/latest/instancetypes/{ac,hpc,co,gp,mo,so}.html | 1 |
| CB-HOW | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html | 1 |
| CB-UG | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html | 1 |
| CB-PURCHASE | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html | 1 |
| CB-PRICE | https://aws.amazon.com/ec2/capacityblocks/pricing/ | 2 (product pricing page) |
| SP-RIS | https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html | 1 |
| TOPO-PREREQ | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html | 1 |
| PREV-GEN | https://aws.amazon.com/ec2/previous-generation/ | 2 (product page) |
| US-PAGE | https://aws.amazon.com/ec2/ultraservers/ | 2 |
| P6-PAGE | https://aws.amazon.com/ec2/instance-types/p6/ | 2 |
| TRN2-PAGE | https://aws.amazon.com/ec2/instance-types/trn2/ | 2 |
| TRAINIUM-PAGE | https://aws.amazon.com/ai/machine-learning/trainium/ | 2 |
| WN-API | https://aws.amazon.com/api/dirs/items/search?item.directoryId=whats-new-v2&sort_by=item.additionalFields.postDateTime&sort_order=desc&size=100&item.locale=en_US&page=0..7 | 2 (first-party announcements) |
| WN-R9G | https://aws.amazon.com/about-aws/whats-new/2026/08/amazon-ec2-r9g-and-r9gd-memory-optimized-instances-are-now-available/ (posted 2026-08-31) | 2 |
| WN-G7-EU | https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-g7-european-regions/ (posted 2026-10-12) | 2 |
| WN-G7-ES | https://aws.amazon.com/about-aws/whats-new/2026/08/amazon-ec2-g7-available-spain (posted 2026-08-06) | 2 |
| WN-P6B300-JKT | https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-ec2-p6-b300-instances-available-asia-pacific-jakarta (posted 2026-09-03) | 2 |
| WN-P6B200-HYD | https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-ec2-p6-b200-instances-available-asia-pacific-hyderabad (posted 2026-09-03) | 2 |
| WN-HPC8A-SIN | https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-ec2-hpc8a-asia-pacific/ (posted 2026-10-05) | 2 |
| WN-TRN3 | https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/ (posted 2025-12-02) | 2 |

Documentation pages carry a build-time `Last-Modified` (all 2026-10-23 08:50-08:52 GMT), which says nothing about content changes, so no content-version stamp exists for them. Quotes below are what the page said on 2026-10-23.


**Version used for every rate below: `20261022231453`** (re-pulled 2026-10-23 after a HEAD request showed a newer Last-Modified than the 2026-10-18 pull). The first pull, `20261015191316`, gave byte-identical rates, SKUs and EffectiveDates for every row in this document, and the same July-to-October diff. The July archive `20260728175247` was re-downloaded 2026-10-23 for the diff, because the 2026-10-18 extracts in /tmp were cleared.

## 1. Price list findings (sub-task 3; first pass 2026-10-18 on 20261015191316, re-confirmed 2026-10-23 on 20261022231453)

### 1a. Every priced row in pricing.ts is unchanged under the full filter

Version 20261022231453 (and 20261015191316 before it) vs 20260728175247 (the version pricing.ts cites). Every `EffectiveDate` in the October files is `2026-10-01` (the file re-stamps effective dates each month; the rate itself did not move).

| Type | pricing.ts value | PL-CUR value (full filter) | SKU | EffectiveDate | Network Performance (PL) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| p6-b300.48xlarge | 142.416 | 142.4160000000 | G2B25BSJJUB6HQPQ | 2026-10-01 | 6400 Gigabit | CORRECT |
| p6-b200.48xlarge | 113.9328 | 113.9328000000 | JU8KS3Q3UCS3GM6X | 2026-10-01 | 3200 Gigabit | CORRECT |
| p5en.48xlarge | 63.296 | 63.2960000000 | XMKUY5HX43BTVY62 | 2026-10-01 | 3200 Gigabit | CORRECT |
| p5.48xlarge | 55.04 | 55.0400000000 | 3D4V8UAYEMB38GU2 | 2026-10-01 | 3200 Gigabit | CORRECT |
| g7e.48xlarge | 33.14432 | 33.1443200000 | 3CNEUV8M9RNTE79U | 2026-10-01 | 1600 Gigabit | CORRECT |
| g7.48xlarge | 28.51328 | 28.5132800000 | 5X88TQDY9YE96ARU | 2026-10-01 | 700 Gigabit | CORRECT |
| p4de.24xlarge | 27.44705 | 27.4470500000 | 9YGSXBKY3DFY79G8 | 2026-10-01 | 400 Gigabit | CORRECT |
| trn1n.32xlarge | 24.78 | 24.7800000000 | FWWRWCCZEUQKT3J4 | 2026-10-01 | 1600 Gigabit | CORRECT |
| p4d.24xlarge | 21.957642 | 21.9576420000 | H7NGEAC6UEHNTKSJ | 2026-10-01 | 400 Gigabit | CORRECT |
| trn1.32xlarge | 21.5 | 21.5000000000 | WVVQPJVCQU4SR8XF | 2026-10-01 | 800 Gigabit | CORRECT |
| m8gn.48xlarge | 13.968 | 13.9680000000 | DZ2NPYAU9FDACTPS | 2026-10-01 | 600 Gigabit | CORRECT |
| c8gn.48xlarge | 11.376 | 11.3760000000 | X2E4SEQZZMKMSA5F | 2026-10-01 | 600 Gigabit | CORRECT |
| c8i.48xlarge | 8.99616 | 8.9961600000 | B6MDD6HRUHGY2MPX | 2026-10-01 | 75000 Megabit | CORRECT |
| c6in.32xlarge | 7.2576 | 7.2576000000 | XHQ85JBN9F7DEQK9 | 2026-10-01 | 200000 Megabit | CORRECT |
| p5.4xlarge | 6.88 | 6.8800000000 | K9VKFEBARNNMVRXV | 2026-10-01 | 100 Gigabit | CORRECT |
| c7gn.16xlarge | 3.9936 | 3.9936000000 | UQ4QEQSFCCYH2E3N | 2026-10-01 | 200 Gigabit | CORRECT |
| c5n.18xlarge | 3.888 | 3.8880000000 | J89B5AAND568NGBY | 2026-10-01 | 100 Gigabit | CORRECT |
| hpc7g.16xlarge (us-east-1) | 1.6832 | 1.6832000000 | X8UVWNQSHBFZB3F2 | 2026-10-01 | 200 Gigabit | CORRECT |

Ohio (PL-OHIO, full filter):

| Type | pricing.ts value | PL-OHIO value | SKU | EffectiveDate | Network Performance | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| hpc8a.96xlarge | 7.92 | 7.9200000000 | DHE8AAH9UWSR4R5C | 2026-10-01 | 300 Gigabit | CORRECT |
| hpc7a.96xlarge | 7.2 | 7.2000000000 | NC8NEXNHACCYWEMQ | 2026-10-01 | 300 Gigabit | CORRECT |
| hpc7a.48xlarge | (note: "identical") | 7.2000000000 | CN3GYFP6WAMZAFSD | 2026-10-01 | 300 Gigabit | CORRECT |
| hpc7a.24xlarge | (note) | 7.2000000000 | N8MKK9PQX3NREQU9 | 2026-10-01 | 300 Gigabit | CORRECT |
| hpc7a.12xlarge | (note) | 7.2000000000 | EKH6BSNH5HYXKWMK | 2026-10-01 | 300 Gigabit | CORRECT |
| hpc6id.32xlarge | 5.7 | 5.7000000000 | SBZ8KRV7W8QGA6U6 | 2026-10-01 | 200 Gigabit | CORRECT |
| hpc6a.48xlarge | 2.88 | 2.8800000000 | WN977FJGFJ8J4XQ4 | 2026-10-01 | 100 Gigabit | CORRECT |

Other us-east-1 rates in the dive's orbit (not currently on the page, recorded for completeness): c8i.96xlarge 17.99232 (SKU 6FSG37CP4ETMXE67), m8i.48xlarge 10.16064 (8VFQZ7D686UN3Q2Z), m8i.96xlarge 20.32128 (F5FXK9H7RZYPUN8M), g6e.48xlarge 30.13118 (M9EE3CA99HPWQJDG), inf1.24xlarge 4.721 (S8JTWNNXNMNADCBB), c8in.96xlarge 26.12736 (J5C7AGV5S9RWCHQZ), m8in.96xlarge 32.07936 (7UPKHRTHT53YBGTB), r8in.96xlarge 40.1664 (JNQKKXPYRCW4TN4E), r9g.48xlarge 12.32832 (DKEB9JCAA92N7ZQW), r9gd.48xlarge 15.37728 (U32R4QJG6M7HWWVV). All EffectiveDate 2026-10-01.

### 1b. Whole-file July-to-October diff (us-east-1, full filter)

- Instance types present in October and absent in July (any term type): the `r9g` family (medium through 48xlarge plus metal-48xl), the `r9gd` family (same sizes), and `t8i.nano/micro/small/medium`. Nothing disappeared.
- Rate changes on types present in both: exactly two, neither on the page. `m8gb.metal-24xl` 13.968 -> 6.984; `r8gb.metal-24xl` 17.48928 -> 8.74464. Every other strict-filter rate is identical.
- `r9g.48xlarge` and `r9gd.48xlarge` carry `Network Performance = 100 Gigabit` in both us-east-1 and us-east-2 price lists. Whether they are EFA-capable is a documentation question (section 2), not a price-list one.

### 1c. Region presence checks (whole file, any term type)

- us-east-1 has zero rows of any term type for hpc8a, hpc7a, hpc6id, hpc6a, p5e, trn2 (all sizes), trn2u, p6e-gb200, trn3. hpc7g.4xlarge/8xlarge/16xlarge are present (all three at 1.6832). Confirms Pricing.tsx:200-202.
- us-east-2: `p5e.48xlarge` and `trn2.48xlarge` have rows only under `MarketOption=CapacityBlock` (OS Linux/RHEL/SUSE/Ubuntu Pro for p5e; Linux/SUSE for trn2). No `MarketOption=OnDemand` row exists, so there is no On-Demand rate for either in Ohio.

## 2. New or changed EFA instance families since 2026-08-01

### 2a. EFA User Guide, supported instance types (EFA-UG), read 2026-10-23

Source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html (Tier 1). Raw HTML saved at /tmp/efa-docs/AWSEC2_latest_UserGuide_efa.html, text at .txt.

Changes against what the dive quotes (August reading):

1. **The four headings no longer read "Using Nitro vN (EFA vM)".** They are now tab labels, verbatim from the HTML: `<dt>Nitro v6 (EFA v4)</dt>`, `<dt>Nitro v5 (EFA v3)</dt>`, `<dt>Nitro v4 (EFA v2)</dt>`, `<dt>Nitro v3 (EFA v1)</dt>`. The pairing is unchanged; the word "Using" is gone. Every place the dive says "titled verbatim: Using Nitro v6 (EFA v4) ..." now misquotes the page.
2. **p6e-gb200.36xlarge moved to the Nitro v6 (EFA v4) table**, under Accelerated Computing, row `| p6e-gb200.36xlarge | Yes | Yes | Yes | No |`. It is no longer in the Nitro v5 (EFA v3) table, which now lists only p5en.48xlarge, trn2.3xlarge, trn2.48xlarge, trn2u.48xlarge under Accelerated Computing.
3. **The accelerated computing instance-types page still says Nitro v5 for P6e-GB200** (AC family summary, read 2026-10-23: `| P6e-GB200 | Nitro v5 | NVIDIA Grace (arm64) | ✗ No | ✗ No | ✗ No | ✗ No | Linux |`). So the contradiction has moved: the EFA User Guide and the product pages now agree on EFA v4; the instance-types page alone still says Nitro v5. The dive's statement that "two independent Tier 1 technical documents agree on [Nitro v5]" is no longer true.
4. **Two new columns: Accelerator Data Transfer (ADT) and Accelerator Command Initiation (ACI).** Intro text, verbatim: "Accelerator Data Transfer (ADT) and Accelerator Command Initiation (ACI) are available on select Nitro v4 and later instances. ADT enables direct memory access between the EFA device and an accelerator — referred to as GPUDirect RDMA on NVIDIA GPU instances and Neuron Direct RDMA on AWS Trainium instances (via the AWS Neuron SDK). ACI enables the accelerator to initiate transfers directly — referred to as GPUDirect Async (GDA) on NVIDIA GPU instances — and is currently supported on select NVIDIA GPU instances." Per-row values for the dive's instances are in section 3.
5. **New EFA-capable family: Graviton5 memory-optimized R9g / R9gd.** Nitro v6 (EFA v4) table, Memory Optimized: `r9g.48xlarge`, `r9g.metal-48xl`, `r9gd.48xlarge`, `r9gd.metal-48xl`, all RDMA read Yes / write Yes / ADT No / ACI No. The r9g and r9gd families first appear in the us-east-1 price list between version 20260728175247 and 20261015191316 (section 1b).
6. Families in the Nitro v6 table that the dive's EFAv4 "examples" string omits (the dive's list is explicitly a sample, so these are not errors): m8id, m8idn, m8ib, m8idb, c8id, c8ib, r8gn, r8gb, r8i, r8id, r8idn, r8ib, r8idb, r8a, m9gd, c9gd, x8aedz, x8i, i8ge, r9g, r9gd. All but c8id and r9g/r9gd were already named in research/2026-08-refresh/05-instances-pricing.md.
7. Unchanged and still verbatim: "EFA supports RDMA (Remote Direct Memory Access) write on most supported instance types that have Nitro version 4 and later. RDMA read is supported on all instances with Nitro version 4 and later."; the RDMA exceptions (c7gn.16xlarge, c7gn.metal, hpc7g.4xlarge/8xlarge/16xlarge read Yes, write No); p4d/p4de read Yes write No on Nitro v3; the limitations list (AZ/VPC, Outposts, P4d/P4de/DL1 interop, c7g/m7g/r7g.16xlarge Dedicated); and the pricing sentence "EFA is available as an optional Amazon EC2 networking feature that you can enable on any supported instance at no additional cost."
8. No trn3 type of any size appears in any of the four tables (read 2026-10-23). No Inf2 size appears.


## 3. Claim register

Verdicts: CORRECT (matches a source read 2026-10-18/23), STALE (was right, the world or the version pin moved), WRONG (contradicted by a current Tier 1 source), NEW (fact the dive lacks), UNKNOWN (no source settles it; see section 6). Line numbers are from the worktree at commit b39b4d3.

### 3a. src/data/pricing.ts

| ID | Claim (as on page, short) | Location | Verdict | Evidence (URL + tier) | Replacement fact |
| --- | --- | --- | --- | --- | --- |
| P-01 | "publication version 20260728175247" (header comment) | pricing.ts:6-7 | STALE | PL-CUR, Tier 1 | Version 20261022231453. Every rate below is identical in it. |
| P-02 | PRICE_LIST_VIRGINIA title "(version 20260728175247)", accessed 2026-08-01 | pricing.ts:16,19 | STALE | PL-CUR, Tier 1 | "(version 20261022231453)", accessed 2026-10-23 |
| P-03 | PRICE_LIST_OHIO title "(version 20260728175247)", accessed 2026-08-01 | pricing.ts:23,26 | STALE | PL-OHIO, Tier 1 | "(version 20261022231453)", accessed 2026-10-23 |
| P-04 | "version index (120 archived monthly versions)" | pricing.ts:30 | STALE | PL-IDX, Tier 1 (123 versions on 2026-10-23) | "(123 archived monthly versions)" |
| P-05 | 17 instanceCosts On-Demand rates (p6-b300 142.416 ... c5n 3.888) | pricing.ts:141-157 | CORRECT | PL-CUR 20261022231453, full filter; SKU and EffectiveDate per row in section 1a | No change |
| P-06 | 17 instanceCosts efaGbps values | pricing.ts:141-157 | CORRECT | AC, CO, GP, EFA-ACC, Tier 1 | No change |
| P-07 | WN_G7_DOC and WN_G7E_DOC graded tier 1 | pricing.ts:102,109 | WRONG | Dive standard (CLAUDE.md: AWS announcements are Tier 2); instances.ts:76,82 grades the same URLs tier 2 | tier: 2. Also point the g7e/g7 bandwidthDoc at AC_DOC, which is Tier 1 and states 1600 Gigabit / 4 cards and 700 Gigabit / 2 cards |
| P-08 | g7 note: "The GA announcement names us-east-2 and us-west-2, yet the us-east-1 price list already carries a rate." | pricing.ts:146 | STALE | WN-G7-ES (2026-08-06) and WN-G7-EU (2026-10-12), Tier 2 | AWS now names US East (N. Virginia) for G7. Regions per the 2026-10-12 post: US West (Oregon), US East (N. Virginia, Ohio), Europe (Spain, Frankfurt, Stockholm) |
| P-09 | c8gn.48xlarge "The cheapest route to 600 Gbps of EFA." | pricing.ts:152 | CORRECT | PL-CUR: c8gn.48xlarge and c8gn.metal-48xl both 11.376; next 600 Gbps type m8gn.48xlarge 13.968; r8gn.48xlarge 17.4893 | No change |
| P-10 | m8gn.48xlarge "Highest EFA bandwidth available without an accelerator." | pricing.ts:151 | CORRECT | CO, GP, MO: 600 Gigabit is the non-accelerated maximum (c8gn, m8gn, r8gn .48xlarge; c8in, m8in, r8in .96xlarge) | No change |
| P-11 | hpcCosts rates and regions (hpc8a 7.92, hpc7a 7.2, hpc6id 5.7, hpc6a 2.88 in us-east-2; hpc7g 1.6832 in us-east-1) | pricing.ts:171-175 | CORRECT | PL-OHIO and PL-CUR 20261022231453 | No change |
| P-12 | priceHistory ends at July 2026 | pricing.ts:187-191 | NEW | PL-CUR 20261022231453: p5.48xlarge 55.04, p4d.24xlarge 21.957642 | Add row: version 20261022231453, October 2026, $55.04, $21.957642 |
| P-13 | "The current prices are scheduled to be updated next in October, 2026." | pricing.ts:200-202 | STALE | CB-PRICE, Tier 2 | "The current prices are scheduled to be updated next in January, 2027." |
| P-14 | u-p6e-gb200x72, US East (Dallas) Local Zone, $761.904 | pricing.ts:204 | CORRECT | CB-PRICE, Tier 2 | No change |
| P-15 | p6-b300.48xlarge CB $112.32; regions us-east-1, us-west-2, Atlanta LZ | pricing.ts:205 | STALE | CB-PRICE, Tier 2 | $129.168. Regions: US West (Oregon), US East (N. Virginia), US East (Atlanta) Local Zone, Asia Pacific (Seoul, Hyderabad, Jakarta), Europe (London) at $129.168; AWS GovCloud (US-East) at $134.55 |
| P-16 | p6-b200.48xlarge CB $98.84; regions US East, us-west-2, ap-south-1 | pricing.ts:206 | STALE | CB-PRICE, Tier 2 | $113.666. Regions: US East (Ohio, N. Virginia), US West (Oregon), Asia Pacific (Mumbai, Hyderabad), Europe (Stockholm, Paris) at $113.666; AWS GovCloud (US-West, US-East) at $118.404 |
| P-17 | p5en.48xlarge CB $54.920; "US regions" | pricing.ts:207 | STALE | CB-PRICE, Tier 2 | $63.158. Regions: US East (Ohio, N. Virginia), US West (N. California, Oregon), Europe (Stockholm, London, Spain), Asia Pacific (Jakarta, Mumbai, Tokyo, Seoul), US East (Atlanta) Local Zone |
| P-18 | p5.48xlarge CB $41.528; "US regions" | pricing.ts:208 | STALE | CB-PRICE, Tier 2 | $47.757. Regions: US East (Atlanta) LZ, US East (N. Virginia, Ohio), US West (Oregon, N. California), Asia Pacific (Tokyo, Jakarta, Mumbai), Australia (Sydney), Europe (London, Stockholm), South America (Sao Paulo) |
| P-19 | trn2.48xlarge CB $35.7608; regions "as listed on the pricing page" | pricing.ts:209 | CORRECT (rate) | CB-PRICE, Tier 2 | Rate unchanged. Regions can now be stated: US East (Ohio), Asia Pacific (Hyderabad) |
| P-20 | trn1.32xlarge CB $9.532; regions "as listed on the pricing page" | pricing.ts:210 | CORRECT (rate) | CB-PRICE, Tier 2 | Rate unchanged. Regions: US East (N. Virginia, Ohio), US West (Oregon), Asia Pacific (Mumbai), Australia (Melbourne, Sydney), Europe (Stockholm) |
| P-21 | (absent) u-p6e-gb200x36 | pricing.ts:203-211 | NEW | CB-PRICE, Tier 2 | u-p6e-gb200x36, US East (Dallas) Local Zone, $380.952 ($10.582 per accelerator, same per-accelerator rate as x72) |
| P-22 | [DERIVED, new] October CB update raised four rates by exactly 15.0% | (would sit beside pricing.ts:203) | NEW | Our arithmetic: 129.168/112.32, 113.666/98.84, 63.158/54.920, 47.757/41.528 all = 1.150 | If shipped, label DERIVED and do not use it to confirm the unverified January 2026 claim |
| P-23 | [DERIVED, new] CB rate as a share of the us-east-1 On-Demand rate after the October update | (Pricing.tsx CB section) | NEW | Our arithmetic from CB-PRICE (Tier 2) and PL-CUR (Tier 1): p6-b200 113.666/113.9328 = 99.8%; p5en 63.158/63.296 = 99.8%; p6-b300 129.168/142.416 = 90.7%; p5 47.757/55.04 = 86.8% | Practical: for p6-b200 and p5en a Capacity Block now costs within 0.3% of On-Demand per hour. Label DERIVED; the two inputs carry different tiers |

### 3b. src/data/instances.ts

| ID | Claim (as on page, short) | Location | Verdict | Evidence (URL + tier) | Replacement fact |
| --- | --- | --- | --- | --- | --- |
| N-01 | Comment quotes headings as "Using Nitro v6 (EFA v4)" etc., plus a paragraph of page history | instances.ts:7-18 | STALE | EFA-UG, Tier 1: tab labels `<dt>Nitro v6 (EFA v4)</dt>` etc., no "Using" | "Nitro v6 (EFA v4)", "Nitro v5 (EFA v3)", "Nitro v4 (EFA v2)", "Nitro v3 (EFA v1)". Drop the "An earlier version of this page..." paragraph (CLAUDE.md: no page history) |
| N-02 | ACCESSED = '2026-08-01' | instances.ts:21 | STALE | All docs re-read 2026-10-23 | '2026-10-23' |
| N-03 | generations[].heading 'Using Nitro vN (EFA vM)' (4 entries) | instances.ts:143,152,161,170 | STALE | EFA-UG, Tier 1 | Drop "Using " from each |
| N-04 | EFAv3 examples include p6e-gb200 | instances.ts:165 | WRONG | EFA-UG, Tier 1: Nitro v5 table Accelerated Computing = p5en.48xlarge, trn2.3xlarge, trn2.48xlarge, trn2u.48xlarge only | 'p5en, trn2, trn2u, hpc7g, c7gn, c8g, m8g, r8g, x8g, i7ie, i8g' |
| N-05 | EFAv4 examples omit p6e-gb200 and r9g | instances.ts:174 | STALE | EFA-UG, Tier 1: Nitro v6 table lists p6e-gb200.36xlarge and r9g.48xlarge, r9g.metal-48xl, r9gd.48xlarge, r9gd.metal-48xl | Append p6e-gb200 and r9g to the list |
| N-06 | p6e-gb200.36xlarge efaVersion 'EFAv3' | instances.ts:220 | WRONG | EFA-UG, Tier 1: row in the Nitro v6 (EFA v4) table, RDMA read Yes, write Yes, ADT Yes, ACI No. P6-PAGE and US-PAGE (Tier 2) say EFAv4 | 'EFAv4' |
| N-07 | p6e-gb200.36xlarge nitroVersion 'v5' | instances.ts:221 | WRONG under the dive's own rule ("read the heading, do not infer the pairing", instances.ts:17-18); contested between sources | EFA-UG heading Nitro v6 (Tier 1) vs AC family summary `P6e-GB200 Nitro v5` (Tier 1) | 'v6', keep provenance 'doc-code-conflict', rewrite conflict (N-08) |
| N-08 | conflict: "The P6 and UltraServers product pages call this EFAv4. The EC2 User Guide lists the type under the heading Using Nitro v5 (EFA v3)..." | instances.ts:230-231 | WRONG | EFA-UG, AC, Tier 1 | "The EC2 User Guide lists this type under Nitro v6 (EFA v4), and the P6 and UltraServers product pages call it EFAv4. The accelerated computing instance-types page still gives the P6e-GB200 hypervisor as Nitro v5." |
| N-09 | Every other row's efaInterfaces, bandwidthGbps, efaVersion, nitroVersion, rdma (31 rows) | instances.ts:182-742 | CORRECT | EFA-UG, EFA-ACC, AC, HPC, CO, GP, MO, Tier 1 (detail in section 8, sub-task 2) | No change |
| N-10 | p5.4xlarge note "GPUDirect RDMA is not supported on this size" | instances.ts:290 | CORRECT | EFA-UG, Tier 1: ADT column (GPUDirect RDMA) No for p5.4xlarge, Yes for p5.48xlarge | Optionally switch doc to docs.efa, which now states it directly |
| N-11 | generation 'Previous' on p4d, p4de, inf1.24xlarge, hpc6a, c5n | instances.ts:304,319,463,547,738 | WRONG | PL-CUR/PL-OHIO field `Current Generation = Yes` for all five (Tier 1); EFA-UG files only p3dn.24xlarge under "Previous Generation"; PREV-GEN (Tier 2) lists none of these families | 'Current'. If the column means "older" rather than AWS's previous-generation class, rename it instead |
| N-12 | hpc6a note "One network card and 100 Gbps, not two cards and 200 Gbps. This row was wrong on all three..." | instances.ts:549 | CORRECT facts, page history | HPC, Tier 1 | "One network card at 100 Gbps." (CLAUDE.md: no page history) |
| N-13 | r8in.96xlarge note: "600 Gbps ... carried across to r8in. Confirm with the CLI..."; doc docs.efa | instances.ts:629-632 | STALE | MO, Tier 1: r8in.96xlarge 600 Gigabit, 2 network cards, EFA Yes; family R8in Nitro v6 | Drop the hedge (or "2 network cards at 600 Gbps."); doc: new docs.mo |
| N-14 | c7gn.16xlarge accelerator 'None (AWS Graviton3)' | instances.ts:700 | WRONG | CO performance row, Tier 1: "AWS Graviton3E Processor" | 'None (AWS Graviton3E)' |
| N-15 | trn2u.48xlarge accelerator '16x AWS Trainium2 (UltraServer member)', doc docs.ac | instances.ts:396,407 | UNKNOWN | AC performance row lists Accelerators and Accelerator memory as "No" for trn2u.48xlarge, which looks like an AWS doc defect | Leave text; cite TRN2-PAGE or EFA-UG instead of AC for the row, or flag |
| N-16 | trn2.48xlarge note: AC 8,192 GiB vs product page 1.5 TB | instances.ts:389 | CORRECT | AC (8192 GiB, 16 x 512 GiB) Tier 1; TRN2-PAGE "Trn2 instances deliver 1.5 TB of accelerator memory" Tier 2 | No change |
| N-17 | (absent) R9g, Graviton5 memory optimized, EFA v4 | instances.ts general block | NEW | WN-R9G (GA 2026-08-31, Tier 2); EFA-UG, MO (Tier 1) | Row spec in section 4. The dive's shortlist text already omits c9g/m9g on purpose; adding r9g to that sentence (I-04) is the lighter edit |

### 3c. src/sections/InstanceSupport.tsx

| ID | Claim (as on page, short) | Location | Verdict | Evidence (URL + tier) | Replacement fact |
| --- | --- | --- | --- | --- | --- |
| I-01 | EFA types run from 25 Gbps (g6.8xlarge, gr6.8xlarge, vt1.24xlarge) to 6,400 Gbps on p6-b300.48xlarge | 152-155 | CORRECT | AC, EFA-ACC, Tier 1 (also 25 Gbps: g5.8xlarge, g5.16xlarge, g6.16xlarge, g6e.8xlarge) | No change |
| I-02 | Diagram and title: Nitro v6/EFA v4 6,400; v5/v3 3,200; v4/v2 3,200; v3/v1 400 | 24-27, 38-40 | CORRECT | EFA-UG, EFA-ACC, AC, Tier 1 | No change |
| I-03 | "Roughly 200 instance types are EFA-capable." | 324 | WRONG | EFA-UG, Tier 1: 305 unique instance types across the four tables on 2026-10-23 (303 EFA = Yes rows on AC/CO/GP/MO/SO/HPC) | "Roughly 300 instance types are EFA-capable." |
| I-04 | Shortlist omits "the Graviton5 c9g and m9g at 100 Gbps on EFA v4" | 327 | STALE | EFA-UG, MO, Tier 1 | "the Graviton5 c9g, m9g and r9g at 100 Gbps on EFA v4" |
| I-05 | g4dn.8-16xlarge 50 Gbps, g5 25 to 50, vt1 25, only g4dn.metal and g5.48xlarge reach 100 | 329-332 | CORRECT | AC, Tier 1 | No change |
| I-06 | "All four ... tables are titled verbatim: Using Nitro v6 (EFA v4), Using Nitro v5 (EFA v3)..." | 352-355 | STALE | EFA-UG, Tier 1 | Tab labels read verbatim "Nitro v6 (EFA v4)", "Nitro v5 (EFA v3)", "Nitro v4 (EFA v2)", "Nitro v3 (EFA v1)". EfaDevice.tsx:760-761 already quotes them this way |
| I-07 | RDMA write on most Nitro v4+, read on all Nitro v4+ | 356-359 | CORRECT | EFA-UG, Tier 1, verbatim | No change |
| I-08 | P6e-GB200: "The EC2 User Guide lists p6e-gb200.36xlarge in the table headed Using Nitro v5 (EFA v3) ... Trust Nitro v5: two independent Tier 1 technical documents agree on it." | 392-416 | WRONG | EFA-UG (Nitro v6 (EFA v4) table), AC (Nitro v5), Tier 1; P6-PAGE, US-PAGE (EFAv4), Tier 2 | The EC2 User Guide now lists p6e-gb200.36xlarge under Nitro v6 (EFA v4), agreeing with the P6 and UltraServers pages. Only the accelerated computing page still says Nitro v5. Three first-party statements give EFA v4; the hypervisor version stays contested. Header could become "P6e-GB200: EFA v4, on Nitro v5 or v6?" |
| I-09 | conflict string on the SourceRef | 411 | WRONG | as I-08 | Same text as N-08 |
| I-10 | AC lists p6e-gb200.36xlarge at 3,200 Gbps with 17 cards; EFA ceiling 1,600 | 417-425 | CORRECT | AC, EFA-ACC, Tier 1 | No change |
| I-11 | P6-B300: 17 cards, primary ENA-only 350 Gbps, 16 x 400 EFA | 433-440 | CORRECT | EFA-ACC, Tier 1 | No change |
| I-12 | Trn3 GA 2025-12-02; 2.52 PF FP8, 144 GB HBM3e, 4.9 TB/s per chip, 144 chips, NeuronSwitch-v1 | 449-453 | CORRECT | WN-TRN3, Tier 2 | No change |
| I-13 | No trn3 in EFA tables, AC page or us-east-1 price list "as of 2026-08-01" | 456-458 | STALE (date only) | EFA-UG, AC, PL-CUR 20261022231453: still no trn3 | "as of 2026-10-23" |
| I-14 | 28.8 Tbps for Trn3 lacks a direct citation | 462-467 | CORRECT | WN-TRN3 and TRAINIUM-PAGE (Tier 2) carry no EFA figure for Trn3 | No change |
| I-15 | Spot: P6e-GB200, Trn2u and all HPC No; P4d...G7e Yes | 475-482 | CORRECT | AC, HPC family tables, Tier 1 | No change |
| I-16 | No Inf2 in any EFA table; inf1.24xlarge 100 Gbps, no RDMA | 496-500 | CORRECT | EFA-UG, AC, Tier 1 | No change |
| I-17 | P6e-GB200 NCI pairs and GPU pairs | 503-510 | CORRECT | EFA-ACC, Tier 1 | No change |
| I-18 | Placement group recommended not required; AZ/VPC rule; Outposts; P4d/P4de/DL1 | 513-530 | CORRECT | EFA-START, EFA-UG, Tier 1 | No change |
| I-19 | (absent) ADT and ACI columns | (new content) | NEW | EFA-UG, Tier 1: ADT = GPUDirect RDMA / Neuron Direct RDMA, ACI = GPUDirect Async. Yes/Yes on p5en, p6-b200, p6-b300, g7 (all four sizes), g7e.12/24/48xlarge; ADT only on p5.48xlarge, p5e, p6e-gb200, trn1, trn1n, trn2, trn2u; neither on p5.4xlarge, g7e.8xlarge, g6/g6e, every CPU type | Practical: the per-type answer to "does this size get GPUDirect RDMA" is now a Tier 1 column. Candidate for an `adt`/`aci` field (enhancement, backlog under ADR-003) |

### 3d. src/sections/Pricing.tsx

| ID | Claim (as on page, short) | Location | Verdict | Evidence (URL + tier) | Replacement fact |
| --- | --- | --- | --- | --- | --- |
| X-01 | EFA "available ... at no additional cost" | 65-67 | CORRECT | EFA-UG, Tier 1, verbatim | No change |
| X-02 | "publication version 20260728175247" | 76-78 | STALE | PL-CUR, Tier 1 | 20261022231453 |
| X-03 | Table description "Price list version 20260728175247." | 123 | STALE | PL-CUR | 20261022231453 |
| X-04 | hpc8a, hpc7a, hpc6id, hpc6a have zero us-east-1 rows; hpc7g has a rate | 200-202 | CORRECT | PL-CUR 20261022231453 whole-file check | No change |
| X-05 | $98.32 / $32.77 until May 2025, cut in June 2025, "have not moved since" | 262-266 | CORRECT | PL-CUR 20261022231453 (55.04, 21.957642); archive rows from August unchanged | No change |
| X-06 | "Every rate on this page is pinned to version 20260728175247." | 285 | STALE | PL-CUR | 20261022231453 |
| X-07 | Spot eligibility lists | 316-331 | CORRECT | AC, HPC, Tier 1 | No change |
| X-08 | CB mechanics (8 weeks; 1-14 days or x7 to 182; 64/256; UltraServer = 1 block; 30/60 min; EventBridge 10 min) | 360-369 | CORRECT | CB-HOW, Tier 1 | No change |
| X-09 | "Three things the documentation leaves open ... a block end time fixed at a set clock time in UTC, and an inability to cancel a block. None of the three appears in the Capacity Blocks documentation" | 374-381 | WRONG | CB-UG and CB-PURCHASE, Tier 1: "Capacity Blocks end at 11:30AM Coordinated Universal Time (UTC)."; "Capacity Block cancellations aren't allowed."; "Capacity Blocks can't be canceled after you reserve them." | Move the end time (11:30 UTC, termination starts 11:00 UTC on the final day) and no-cancellation (also: can't be moved or split) into the documented list. Only the January 2026 15% rise stays unverified |
| X-10 | Quote: "The current prices are scheduled to be updated next in October, 2026." | 397-401 | STALE | CB-PRICE, Tier 2 | "...updated next in January, 2027." |
| X-11 | EFA limitations quotes (AZ/VPC, Outposts, P4d/P4de/DL1) | 448-453 | CORRECT | EFA-UG, Tier 1 | No change |
| X-12 | Placement group quote and Capacity Reservation quote | 456-462, 468-473 | CORRECT | EFA-START, Tier 1, verbatim | No change |
| X-13 | "On-Demand Capacity Reservations, Savings Plans and an account-team capacity commitment sit alongside them" (as ways to secure capacity) | 476-478 | WRONG | SP-RIS, Tier 1: "Savings Plans doesn't provide capacity reservations, but you can allocate On-Demand Capacity Reservation (ODCR) for your needs and your Savings Plans will apply." | Savings Plans lower the rate and reserve nothing. Pair a Savings Plan with an ODCR to get both. The "account-team capacity commitment" item has no source in this pass |
| X-14 | (absent) Capacity Blocks and placement groups | 433-483 section | NEW | CB-UG, Tier 1: "Capacity Blocks do not support placement groups. You can't specify a placement group when you launch instances into a Capacity Block..." | Practical: the section recommends a cluster placement group and offers Capacity Blocks as a capacity path; a cluster bought as a Capacity Block cannot use one. Same-AZ placement comes from the block itself (the offering names one Availability Zone, CB-HOW) |
| X-15 | "EFA data transfer: Free ... billed at nothing per GB either way" | 38 | UNKNOWN | EFA-UG says EFA is free; the per-GB statement needs the EC2 data-transfer pricing page, which did not render with curl | See section 6 |

### 3e. Other sections

| ID | Claim (as on page, short) | Location | Verdict | Evidence (URL + tier) | Replacement fact |
| --- | --- | --- | --- | --- | --- |
| O-01 | Source 40/41 titles "(version 20260728175247)", accessDate 2026-08-01 | Sources.tsx:26-27 | STALE | PL-CUR, PL-OHIO | version 20261022231453, 2026-10-23 |
| O-02 | p5.48xlarge $55.04 and p4d.24xlarge $21.957642 "price list 20260728175247" | Sources.tsx:129-130 | STALE (version label only) | PL-CUR | Values correct; label 20261022231453 |
| O-03 | trn1 $21.50, trn1n $24.78, hpc7a $7.20 us-east-2 with no us-east-1 SKU | Sources.tsx:131-133 | CORRECT | PL-CUR, PL-OHIO | No change |
| O-04 | Glossary EFAv4: "The EC2 User Guide places the same instance under Nitro v5, which maps to EFAv3." | Sources.tsx:199 | WRONG | EFA-UG, Tier 1 | "Fourth EFA generation, on Nitro v6 instances such as P6-B200, P6-B300, G7, G7e and Hpc8a. The EC2 User Guide also lists P6e-GB200 under it, while the accelerated computing page gives that family's hypervisor as Nitro v5." |
| O-05 | Source 30 (ec2-capacity-blocks.html) accessDate 2026-03-22 | Sources.tsx:20 | STALE | CB-UG read 2026-10-23 | accessDate 2026-10-23 |
| O-06 | 28.8 Tbps per P6e-GB200 UltraServer, page also says EFAv4 | Sources.tsx:95 | CORRECT | US-PAGE, P6-PAGE, Tier 2 | No change |
| O-07 | Hpc7a 192 cores EPYC 9R14, 300 Gbps, 150 Gbps per card; Hpc7g 64 cores, 200 Gbps, one card, read only; Hpc6id 64 cores Ice Lake, 200 Gbps, 4 x 3800 GB; Hpc8a 192 cores EPYC 9R45, 768 GiB, 300 Gbps, Nitro v6 = EFA v4; +40% / +25% / +42% vs Hpc7a | HPC.tsx:233-266 | CORRECT | HPC, EFA-UG (Tier 1); WN-HPC8A-SIN repeats 40/25/42 (Tier 2) | No change |
| O-08 | Trn1n 16 x 1,600 vs Trn1 8 x 800; Trn2 16 x 200 = 3.2 Tbps EFAv3; "30 to 40% better price performance" (product-page figure); UltraServer 64 chips, 12.8 Tbps EFAv3 | AIMLTraining.tsx:240-252 | CORRECT | EFA-UG, AC (Tier 1); TRN2-PAGE (Tier 2, vendor claim, already labelled as such) | No change |
| O-09 | P5 layout up to 3,200 Gbps EFA | Overview.tsx:111 | CORRECT | EFA-ACC, Tier 1 | No change |
| O-10 | p5/p5e 32 cards, 3,200 total, 800 IP; use cases 1 and 2; p6-b200 8 cards; p6-b300 17 cards, 16 EFA | EKSIntegration.tsx:972-995, 1108-1109 | CORRECT | EFA-ACC, AC, Tier 1 | No change |
| O-11 | P5/P5e 32 cards 3,200/800; P6-B300 6400 EFA / 3870 ENA / 350 primary / 400+220 secondary; headings quoted without "Using" | EfaDevice.tsx:499-501, 593-602, 760-761 | CORRECT | EFA-ACC, EFA-UG, Tier 1 | No change |
| O-12 | Up to 6,400 Gbps per instance on P6-B300 | NetworkComparison.tsx:166 | CORRECT | EFA-ACC | No change |
| O-13 | Capacity Reservation Topology API not supported in Israel (Tel Aviv) or GovCloud (US-West) | TopologyApi.tsx:1018-1022 | CORRECT | TOPO-PREREQ, Tier 1: "The DescribeCapacityReservationTopology API is not supported in Israel (Tel Aviv) and AWS GovCloud (US-West)." | No change |
| O-14 | HPC families, p6e-gb200 and trn2u Spot-ineligible; "There is no p5.xlarge" | DecisionGuide.tsx:426-431, 509-510 | CORRECT | HPC, AC (P5 sizes: p5.4xlarge, p5.48xlarge), Tier 1 | No change |
| O-15 | p4d/p4de Nitro v3 with RDMA read; c7gn and hpc7g Nitro v5 read only | DataPath.tsx:835-836 | CORRECT | EFA-UG, Tier 1 | No change |

### 3f. Verdict counts

89 register entries: CORRECT 42, STALE 25, WRONG 13, NEW 7, UNKNOWN 2. Entries are claims, not rows: N-09 covers 31 instances.ts rows, and P-05 and P-06 cover the 17 priced rows each. Of the 13 WRONG, the load-bearing ones are the P6e-GB200 EFA generation (N-06/N-07/N-08, I-08/I-09, O-04), the two Capacity Block items now documented (X-09), Savings Plans as a capacity path (X-13), the EFA-type count (I-03), and the five 'Previous' status labels (N-11).

## 4. Ready-to-apply edit table (instances.ts, pricing.ts)

Every new value carries its source. Values I could not source are omitted and flagged.

### 4a. src/data/instances.ts

| Row key | Field | Old value | New value | Source |
| --- | --- | --- | --- | --- |
| (module) | ACCESSED | '2026-08-01' | '2026-10-23' | read date of every doc in section 0 |
| (comment, lines 7-18) | heading quotes | `Using Nitro v6 (EFA v4)` ... `Using Nitro v3 (EFA v1)` | `Nitro v6 (EFA v4)` ... `Nitro v3 (EFA v1)`; delete the "An earlier version of this page..." paragraph | EFA-UG |
| docs | mo (new key) | (absent) | `{ title: 'EC2 instance types: Memory optimized', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html', tier: 1, accessed: ACCESSED }` | MO |
| generations[EFAv1] | heading | 'Using Nitro v3 (EFA v1)' | 'Nitro v3 (EFA v1)' | EFA-UG |
| generations[EFAv2] | heading | 'Using Nitro v4 (EFA v2)' | 'Nitro v4 (EFA v2)' | EFA-UG |
| generations[EFAv3] | heading | 'Using Nitro v5 (EFA v3)' | 'Nitro v5 (EFA v3)' | EFA-UG |
| generations[EFAv3] | examples | 'p5en, p6e-gb200, trn2, trn2u, hpc7g, c7gn, c8g, m8g, r8g, x8g, i7ie, i8g' | 'p5en, trn2, trn2u, hpc7g, c7gn, c8g, m8g, r8g, x8g, i7ie, i8g' | EFA-UG Nitro v5 table |
| generations[EFAv4] | heading | 'Using Nitro v6 (EFA v4)' | 'Nitro v6 (EFA v4)' | EFA-UG |
| generations[EFAv4] | examples | '..., c9g, m9g' | 'p6-b200, p6-b300, p6e-gb200, g7, g7e, hpc8a, c8i, m8i, c8gn, m8gn, c8in, m8in, r8in, c8gb, m8gb, c8a, m8a, c9g, m9g, r9g' | EFA-UG Nitro v6 table |
| p6e-gb200.36xlarge | efaVersion | 'EFAv3' | 'EFAv4' | EFA-UG (Nitro v6 (EFA v4) table); P6-PAGE, US-PAGE |
| p6e-gb200.36xlarge | nitroVersion | 'v5' | 'v6' | EFA-UG heading; AC disagrees (Nitro v5), carried in `conflict` |
| p6e-gb200.36xlarge | conflict | 'The P6 and UltraServers product pages call this EFAv4. The EC2 User Guide lists the type under the heading Using Nitro v5 (EFA v3), and the accelerated computing page gives the family hypervisor as Nitro v5.' | 'The EC2 User Guide lists this type under Nitro v6 (EFA v4), and the P6 and UltraServers product pages call it EFAv4. The accelerated computing instance-types page still gives the P6e-GB200 hypervisor as Nitro v5.' | EFA-UG, AC, P6-PAGE, US-PAGE |
| p6e-gb200.36xlarge | provenance | 'doc-code-conflict' | unchanged | (conflict persists) |
| p5.4xlarge | doc | docs.ac | docs.efa (optional) | EFA-UG ADT column |
| p4d.24xlarge | generation | 'Previous' | 'Current' | PL-CUR `Current Generation = Yes`; EFA-UG |
| p4de.24xlarge | generation | 'Previous' | 'Current' | PL-CUR; EFA-UG |
| inf1.24xlarge | generation | 'Previous' | 'Current' | PL-CUR; EFA-UG |
| hpc6a.48xlarge | generation | 'Previous' | 'Current' | PL-OHIO `Current Generation = Yes`; EFA-UG |
| c5n.18xlarge | generation | 'Previous' | 'Current' | PL-CUR; EFA-UG |
| hpc6a.48xlarge | note | 'One network card and 100 Gbps, not two cards and 200 Gbps. This row was wrong on all three of card count, bandwidth and EFA generation.' | 'One network card at 100 Gbps.' | HPC (`hpc6a.48xlarge 100 Gigabit`, Network cards 1) |
| r8in.96xlarge | note | 'The EFA v4 listing is documented. The 600 Gbps figure was re-verified directly for the c8in and m8in siblings, and carried across to r8in. Confirm with the CLI before you size on it.' | delete (or '2 network cards at 600 Gbps.') | MO |
| r8in.96xlarge | doc | docs.efa | docs.mo | MO |
| c7gn.16xlarge | accelerator | 'None (AWS Graviton3)' | 'None (AWS Graviton3E)' | CO performance row |
| trn2u.48xlarge | doc | docs.ac | FLAG, no change made: AC's performance row shows no accelerators for this type. Candidate: docs.efa (lists trn2u.48xlarge, Nitro v5 table) for the EFA fields | AC, EFA-UG |

NEW row (optional; the lighter alternative is I-04, a mention in the shortlist sentence):

| Row key | Field | New value | Source |
| --- | --- | --- | --- |
| r9g.48xlarge | family | 'R9g' | MO family table |
| r9g.48xlarge | type | 'r9g.48xlarge' | MO, EFA-UG |
| r9g.48xlarge | accelerator | 'None (AWS Graviton5)' | MO performance row: `r9g.48xlarge, 1536.00, AWS Graviton5, 192 vCPUs` |
| r9g.48xlarge | efaInterfaces | 1 | MO network row: Network cards 1 |
| r9g.48xlarge | bandwidthGbps | 100 | MO network row: 100 Gigabit; PL-CUR Network Performance 100 Gigabit |
| r9g.48xlarge | efaVersion | 'EFAv4' | EFA-UG Nitro v6 (EFA v4) table |
| r9g.48xlarge | nitroVersion | 'v6' | EFA-UG heading; MO family summary `R9g Nitro v6` |
| r9g.48xlarge | rdma | 'read + write' | EFA-UG: RDMA read Yes, write Yes |
| r9g.48xlarge | useCase | 'Memory optimized Graviton5' | editorial label, describes the MO category; no number in it |
| r9g.48xlarge | generation | 'Current' | PL-CUR `Current Generation = Yes` |
| r9g.48xlarge | category | 'general' | dive convention (R8in sits in 'general') |
| r9g.48xlarge | note | 'Generally available 2026-08-31.' | WN-R9G |
| r9g.48xlarge | provenance | 'documented' | EFA-UG, MO |
| r9g.48xlarge | doc | docs.mo (new key above) | MO |

### 4b. src/data/pricing.ts

| Row key | Field | Old value | New value | Source |
| --- | --- | --- | --- | --- |
| (header comment, line 7) | version | 20260728175247 | 20261022231453 | PL-CUR |
| PRICE_LIST_VIRGINIA | title | '... us-east-1 (version 20260728175247)' | '... us-east-1 (version 20261022231453)' | PL-CUR |
| PRICE_LIST_VIRGINIA | accessed | '2026-08-01' | '2026-10-23' | PL-CUR |
| PRICE_LIST_OHIO | title | '... us-east-2 (version 20260728175247)' | '... us-east-2 (version 20261022231453)' | PL-OHIO |
| PRICE_LIST_OHIO | accessed | '2026-08-01' | '2026-10-23' | PL-OHIO |
| PRICE_LIST_ARCHIVE | title | '... (120 archived monthly versions)' | '... (123 archived monthly versions)' | PL-IDX |
| PRICE_LIST_ARCHIVE | accessed | '2026-08-01' | '2026-10-23' | PL-IDX |
| EFA_DOC, EFA_START_DOC, EFA_ACC_DOC, AC_DOC, HPC_DOC, CO_DOC, GP_DOC, CAPACITY_BLOCK_DOC, CAPACITY_BLOCK_PRICING_DOC | accessed | '2026-08-01' | '2026-10-23' | re-read 2026-10-23 |
| WN_G7_DOC | tier | 1 | 2 | dive tier standard |
| WN_G7E_DOC | tier | 1 | 2 | dive tier standard |
| (new) MO_DOC | DocRef | (absent) | `{ title: 'Amazon EC2 instance types: memory optimized specifications', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/mo.html', tier: 1, accessed: '2026-10-23' }` | MO |
| (new) CAPACITY_BLOCK_UG_DOC | DocRef | (absent) | `{ title: 'Amazon EC2 User Guide: Capacity Blocks for ML (considerations)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html', tier: 1, accessed: '2026-10-23' }` | CB-UG |
| (new) SAVINGS_PLANS_DOC | DocRef | (absent) | `{ title: 'Savings Plans User Guide: Compute Savings Plans and Reserved Instances', url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html', tier: 1, accessed: '2026-10-23' }` | SP-RIS |
| (new) WN_G7_REGIONS_DOC | DocRef | (absent) | `{ title: "AWS What's New: Amazon EC2 G7 instances now available in Europe (Frankfurt) and Europe (Stockholm) Regions (Oct 12, 2026)", url: 'https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-g7-european-regions/', tier: 2, accessed: '2026-10-23' }` | WN-G7-EU |
| instanceCosts g7e.48xlarge | bandwidthDoc | WN_G7E_DOC | AC_DOC | AC: 1600 Gigabit, 4 cards |
| instanceCosts g7.48xlarge | bandwidthDoc | WN_G7_DOC | AC_DOC | AC: 700 Gigabit, 2 cards |
| instanceCosts g7.48xlarge | notes | 'The GA announcement names us-east-2 and us-west-2, yet the us-east-1 price list already carries a rate.' | '2 network cards. Sold in us-east-1, us-east-2, us-west-2 and Europe (Spain, Frankfurt, Stockholm) as of October 2026.' | AC; WN-G7-EU |
| instanceCosts (all 17) | onDemandUsd | unchanged | unchanged | PL-CUR 20261022231453 (section 1a) |
| hpcCosts (all 5) | onDemandUsd, region | unchanged | unchanged | PL-OHIO, PL-CUR |
| priceHistory | (new last row) | (absent) | `{ version: '20261022231453', effective: 'October 2026', p5: '$55.04', p4d: '$21.957642' }` | PL-CUR |
| (comment above capacityBlockRates) | quote | 'scheduled to be updated next in October, 2026.' | 'scheduled to be updated next in January, 2027.' | CB-PRICE |
| capacityBlockRates p6-b300.48xlarge | hourly | '$112.32' | '$129.168' | CB-PRICE |
| capacityBlockRates p6-b300.48xlarge | regions | 'us-east-1, us-west-2, US East (Atlanta) Local Zone' | 'us-east-1, us-west-2, US East (Atlanta) Local Zone, Seoul, Hyderabad, Jakarta, London; GovCloud (US-East) at $134.55' | CB-PRICE |
| capacityBlockRates p6-b200.48xlarge | hourly | '$98.84' | '$113.666' | CB-PRICE |
| capacityBlockRates p6-b200.48xlarge | regions | 'US East regions, us-west-2, ap-south-1' | 'us-east-1, us-east-2, us-west-2, Mumbai, Hyderabad, Stockholm, Paris; GovCloud (US-West, US-East) at $118.404' | CB-PRICE |
| capacityBlockRates p5en.48xlarge | hourly | '$54.920' | '$63.158' | CB-PRICE |
| capacityBlockRates p5en.48xlarge | regions | 'US regions' | 'US, Europe and Asia Pacific regions, plus US East (Atlanta) Local Zone' | CB-PRICE |
| capacityBlockRates p5.48xlarge | hourly | '$41.528' | '$47.757' | CB-PRICE |
| capacityBlockRates p5.48xlarge | regions | 'US regions' | 'US, Europe, Asia Pacific and South America regions, plus US East (Atlanta) Local Zone' | CB-PRICE |
| capacityBlockRates trn2.48xlarge | regions | 'as listed on the pricing page' | 'us-east-2, Hyderabad' | CB-PRICE |
| capacityBlockRates trn1.32xlarge | regions | 'as listed on the pricing page' | 'us-east-1, us-east-2, us-west-2, Mumbai, Melbourne, Sydney, Stockholm' | CB-PRICE |
| capacityBlockRates (new row) | item, regions, hourly | (absent) | 'u-p6e-gb200x36 UltraServer (36 GPUs)', 'US East (Dallas) Local Zone', '$380.952' | CB-PRICE |
| instanceCosts (new, optional) | r9g.48xlarge | (absent) | `{ type: 'r9g.48xlarge', onDemandUsd: 12.32832, efaGbps: 100, bandwidthDoc: MO_DOC, notes: '1 network card. Graviton5 on Nitro v6, so EFA v4. Generally available 2026-08-31.' }` | PL-CUR (SKU DKEB9JCAA92N7ZQW, EffectiveDate 2026-10-01); MO; EFA-UG; WN-R9G |

## 5. Regional availability

| Claim / family | Where in dive | Verdict | Source (tier) | Fact |
| --- | --- | --- | --- | --- |
| hpc8a/hpc7a/hpc6id/hpc6a not sold in us-east-1; priced in us-east-2 | Pricing.tsx:192-202; pricing.ts:171-174 | CORRECT | PL-CUR, PL-OHIO 20261022231453 (Tier 1) | Zero rows of any term type in us-east-1; Ohio rates as in section 1a. Hpc8a also launched in Asia Pacific (Singapore) on 2026-10-05 (WN-HPC8A-SIN, Tier 2) |
| hpc7g has a us-east-1 rate | Pricing.tsx:202; pricing.ts:175 | CORRECT | PL-CUR | hpc7g.4xlarge/8xlarge/16xlarge all 1.6832 |
| G7 regions | pricing.ts:146 | STALE | WN-G7-ES, WN-G7-EU (Tier 2); PL-CUR (Tier 1) | us-west-2, us-east-1, us-east-2, Europe (Spain, Frankfurt, Stockholm) |
| Capacity Block regions per type | pricing.ts:204-210 | STALE (4 rows) | CB-PRICE (Tier 2) | See P-15 to P-20 |
| P6e-GB200 UltraServer CBs in US East (Dallas) Local Zone | pricing.ts:204 | CORRECT | CB-PRICE (Tier 2); CB-UG (Tier 1): UltraServer Capacity Blocks for P6e-GB200 in "US East (Dallas) us-east-1-dfw-2a", Trn2 UltraServer in us-east-2 | No change |
| p5e.48xlarge and trn2.48xlarge in us-east-2 | (not on page; context) | n/a | PL-OHIO (Tier 1) | Only `MarketOption=CapacityBlock` rows exist in us-east-2 for both; no On-Demand rate there. Neither type has any row in us-east-1 |
| Capacity Reservation Topology API not in Tel Aviv or GovCloud (US-West) | TopologyApi.tsx:1018-1022 | CORRECT | TOPO-PREREQ (Tier 1) | No change |
| "A type can be EFA-capable in us-east-1 and absent from another region entirely" | InstanceSupport.tsx:314-316 | CORRECT | EFA-UG (Tier 1): "The available instance types vary by Region." | No change |
| R9g / R9gd (new) | (not on page) | NEW | WN-R9G (Tier 2); PL-CUR, PL-OHIO (Tier 1) | us-east-1, us-east-2, us-west-2, eu-central-1 (Frankfurt) per the launch post; priced in us-east-1 and us-east-2 |
| P6-B300 / P6-B200 instance regions (context for CB table) | (not on page) | n/a | WN-P6B300-JKT, WN-P6B200-HYD (Tier 2) | P6-B300: Oregon, GovCloud (US-East), N. Virginia, Hyderabad, Jakarta, Seoul, Sao Paulo. P6-B200: Oregon, N. Virginia, Ohio, GovCloud (US-West, US-East), Hyderabad, Mumbai |

## 6. UNKNOWN list

| # | Item | What I tried | Status |
| --- | --- | --- | --- |
| U-1 | Hypervisor generation of P6e-GB200 (Nitro v5 or v6) | EFA-UG (heading Nitro v6), AC family table (Nitro v5), P6-PAGE and US-PAGE (state EFAv4, no Nitro version). No source code covers the hypervisor. | Contested between two Tier 1 docs. Edit table follows the dive's own "read the heading" rule and keeps the conflict flag |
| U-2 | Whether CB-UG's "end at 11:30AM UTC" and "cancellations aren't allowed" sentences existed on 2026-08-01 | Read current CB-UG and CB-PURCHASE. No archived copy fetched. | Unknown when they appeared. Irrelevant to the fix: they are documented now |
| U-3 | "Roughly 15 percent Capacity Block price rise in January 2026" | CB-PRICE, CB-UG, CB-HOW, CB-PURCHASE, CB pricing/billing page, What's New Jul-Oct 2026 | Still unverified. A 15.0% rise in the October 2026 update is derivable (P-22); that does not confirm a January event |
| U-4 | trn2u.48xlarge accelerator field | AC performance row shows "No" for accelerators and accelerator memory | Looks like an AWS doc defect; dive text left, citation flagged (N-15) |
| U-5 | Trn3 EFA device count or per-instance EFA bandwidth | EFA-UG, AC, PL-CUR (no trn3 rows), TRAINIUM-PAGE, WN-TRN3 | No Tier 1 or Tier 2 figure. No change to the dive's hedge |
| U-6 | "EFA data transfer ... billed at nothing per GB" (Pricing.tsx:38) | curl of https://aws.amazon.com/ec2/pricing/on-demand/ returns a JavaScript shell (9 KB of text, no data-transfer table) | Not verified this pass |
| U-7 | Whether "Roughly 200" EFA types was ever right | Only the current EFA-UG was read (305 unique types) | Current fact is about 300 |
| U-8 | "an account-team capacity commitment" as a capacity path (Pricing.tsx:477) | No AWS page searched names it | Unsourced; suggest dropping it with the Savings Plans fix |
| U-9 | Spot rates | Not in the bulk price list or any credential-free first-party endpoint | Unchanged from August; the dive already says so |
| U-10 | P6-B300 ENA ceiling on the primary card: 350 Gbps (EFA-ACC, Tier 1) vs "300 Gbps dedicated ENA throughput" (WN-P6B300-JKT, Tier 2) | Both read 2026-10-23 | The dive uses the Tier 1 figure. Recorded as a first-party inconsistency, no edit |
| U-11 | Sources.tsx:196-198 EFAv2 "75% faster collectives", EFAv3 "35% lower latency" | Not checked; outside instances/pricing | Left for the owning researcher |

## 7. Personal data sent in requests

None. Every request was an unauthenticated curl GET with curl's default User-Agent and no added headers, cookies, query parameters or bodies beyond the public URLs listed in section 0. No email, name or account detail was sent anywhere.

## 8. Evidence notes by sub-task


Sub-task 2 (row-by-row check of instances.ts), read 2026-10-23 against EFA-UG, EFA-ACC (efa-acc-inst-types.html), AC, HPC, CO, GP, MO (all Tier 1):
- CORRECT, all fields: p6-b300 (AC 17 cards / 6400 Gigabit / Nitro v6; EFA-ACC primary card ENA-only 350 Gbps, secondary 400 Gbps EFA), p6-b200 (8 / 3200), p5en (16 / 3200 / Nitro v5), p5e (32 / 3200 / v4), p5.48xlarge (32 / 3200 / v4), p5.4xlarge (1 / 100), p4d, p4de (4 x 100, Nitro v3, read Yes write No), g7e.48xlarge (4 / 1600 / v6), g7.48xlarge (2 / 700 / v6), g6e.48xlarge (4 / 400 / v4, 357 GiB), trn2.48xlarge (16 x 200 / v5), trn2u.48xlarge (16 x 200 / v5, Spot No), trn2.3xlarge (1 / 200), trn1n (16 x 100 / v4), trn1 (8 x 100 / v4), inf1.24xlarge (1 / 100 / v3, RDMA No/No), hpc8a (2 / 300 / v6 / 192 vCPU EPYC 9R45), hpc7a (2 / 300 / v4 / 150 Gbps per ENI), hpc7g.16xlarge (1 / 200 / v5 / read only / Graviton3E 64 vCPU), hpc6id (2 / 200 / v4 / 170 Gbps per ENI / 4 x 3800 GB NVMe), hpc6a (1 / 100 / v4 / 96 vCPU EPYC 7R13), c8gn/m8gn.48xlarge (2 / 600 / v6), c8in/m8in.96xlarge (2 / 600 / v6), c8i/m8i.96xlarge (1 / 100), c8i/m8i.48xlarge (1 / 75; .32xlarge 50 Gigabit with EFA No), c6in.32xlarge (2 / 200 / v4), c5n.18xlarge (1 / 100 / v3).
- p6e-gb200.36xlarge: efaVersion EFAv3 -> EFAv4 (EFA-UG now lists it under Nitro v6 (EFA v4)); nitroVersion contested (EFA-UG heading Nitro v6 vs AC family summary Nitro v5).
- r8in.96xlarge: 600 Gigabit / 2 cards now read directly on MO (`| r8in.96xlarge | 600 Gigabit | ✓ Yes | ✓ Yes | ✓ Yes | 32 / 128 | 2 | 24 | 64 | ✓ Yes |`), family R8in Nitro v6. The "carried across" hedge in the note can go.
- c7gn.16xlarge accelerator text 'None (AWS Graviton3)': CO performance row says `AWS Graviton3E Processor`.
- p5.4xlarge note (no GPUDirect RDMA) is now directly backed by the EFA-UG ADT column: `| p5.4xlarge | Yes | Yes | No | No |` vs `| p5.48xlarge | Yes | Yes | Yes | No |`.
- trn2u.48xlarge: AC performance row reads `| trn2u.48xlarge | 2048.00 | Intel Xeon Sapphire Rapids | 192 | 96 | 2 | ✗ No | ✗ No |` (Accelerators and Accelerator memory both "No"), which does not back the dive's "16x AWS Trainium2" text cited to docs.ac. Looks like an AWS doc defect; not changed here.
- New candidate row: r9g.48xlarge (MO: Graviton5, 192 vCPU, 1536 GiB, 100 Gigabit, 1 network card, EFA Yes; family R9g Nitro v6; EFA-UG Nitro v6 (EFA v4) table read/write Yes).

Sub-task 1 (What's New, 2026-07-25 to 2026-10-22), read 2026-10-23 via the What's New directory API (https://aws.amazon.com/api/dirs/items/search?item.directoryId=whats-new-v2&sort_by=item.additionalFields.postDateTime&sort_order=desc&size=100&item.locale=en_US&page=N, pages 0-7, 800 posts back to 2026-07-07). Post bodies saved at /tmp/efa-pricing/wn-bodies-2026-10-23.txt. All AWS What's New posts are first-party announcements; the dive grades them Tier 2.
- Only one new EFA-capable family launched in the window: **R9g / R9gd (Graviton5), GA 2026-08-31.** https://aws.amazon.com/about-aws/whats-new/2026/08/amazon-ec2-r9g-and-r9gd-memory-optimized-instances-are-now-available/ : "R9g and R9gd instances are available in US East (N. Virginia, Ohio), US West (Oregon), and EU (Frankfurt) regions." and "built on the sixth generation AWS Nitro System". The post does not mention EFA; EFA support comes from EFA-UG (Nitro v6 (EFA v4) table) and MO (r9g.48xlarge 100 Gigabit, 1 card, EFA Yes).
- Also new in the window but not EFA-capable: T8i (2026-09-17; t8i sizes absent from every EFA-UG table).
- No new P, G, Trn, Inf or Hpc family; no trn3 instance type; no Capacity Blocks pricing or Savings Plans post naming an EFA family. One adjacent capacity post: Capacity Reservation Resource Groups now accept Capacity Blocks (2026-08-25).
- Regional expansions touching rows in the dive:
  - G7: 2026-08-06 post "You can start using Amazon EC2 G7 instances today in four AWS Regions: US East (N. Virginia and Ohio), US West (Oregon), and Europe (Spain)." 2026-10-12 post: "US West (Oregon), US East (N. Virginia, Ohio) and Europe (Spain, Frankfurt, Stockholm)." AWS now names us-east-1 for G7, which retires the tension in pricing.ts:146.
  - P6-B300: 2026-09-03 post: "US West (Oregon), AWS GovCloud (US-East), US East (N. Virginia), Asia Pacific (Hyderabad, Jakarta, Seoul), and South America (Sao Paulo) Regions." (Seoul added 2026-08-20; Hyderabad and Sao Paulo 2026-08-28; Jakarta 2026-09-03.)
  - P6-B200: 2026-09-03 post: "US West (Oregon), US East (N. Virginia, Ohio), AWS GovCloud (US-West, US-East), and Asia Pacific (Hyderabad, Mumbai) Regions."
  - Hpc8a: Asia Pacific (Singapore) added 2026-10-05. Region list for the rest of Hpc8a not stated in that post.
  - Others in the window (EFA-capable families shown only as non-row examples): C8gn Paris, C8gb, C9g/C9gd/M9g/M9gd, C8gd/M8gd/R8gd, C8id/M8id/R8id, X8i, U7i, R8a, R8i, M8i, C8i expansions.
- Observation, not a dive error: the P6-B300 posts say "300 Gbps dedicated ENA throughput"; EFA-ACC says the primary card is "ENA network interface with up to 350 Gbps of bandwidth". The dive cites EFA-ACC (350), which is the Tier 1 figure.

Sub-task 5 (Capacity Blocks, Savings Plans, placement), read 2026-10-23:
- CB-PRICE https://aws.amazon.com/ec2/capacityblocks/pricing/ (Tier 2 product page; extract at /tmp/efa-pricing/cb-pricing-page-2026-10-23.txt). The page now reads: "The current prices are scheduled to be updated next in January, 2027." The October 2026 update has happened. Rates (Effective Hourly Rate PER INSTANCE):
  - u-p6e-gb200x72, US East (Dallas) Local Zone: $761.904 (unchanged). u-p6e-gb200x36, same Local Zone: $380.952 (row not in pricing.ts).
  - p6-b300.48xlarge: $129.168 (pricing.ts $112.32). Regions listed: US West (Oregon), US East (N. Virginia), AWS GovCloud (US-East) at $134.55, US East (Atlanta) Local Zone, Asia Pacific (Seoul), Asia Pacific (Hyderabad), Asia Pacific (Jakarta), Europe (London).
  - p6-b200.48xlarge: $113.666 (pricing.ts $98.84). Regions: US East (Ohio), US East (N. Virginia), US West (Oregon), AWS GovCloud (US-West, US-East) at $118.404, Asia Pacific (Mumbai), Asia Pacific (Hyderabad), Europe (Stockholm), Europe (Paris).
  - p5en.48xlarge: $63.158 (pricing.ts $54.920). Regions: US East (Ohio, N. Virginia), US West (N. California, Oregon), Europe (Stockholm, London, Spain), Asia Pacific (Jakarta, Mumbai, Tokyo, Seoul), US East (Atlanta) Local Zone. "US regions" is no longer the scope.
  - p5.48xlarge: $47.757 (pricing.ts $41.528). Regions: Atlanta LZ, N. Virginia, Ohio, Oregon, N. California, Tokyo, Jakarta, Mumbai, Sydney, London, Stockholm, Sao Paulo. "US regions" is no longer the scope.
  - trn2.48xlarge: $35.7608 (unchanged). Regions: US East (Ohio), Asia Pacific (Hyderabad).
  - trn1.32xlarge: $9.532 (unchanged). Regions: N. Virginia, Ohio, Oregon, Mumbai, Melbourne, Sydney, Stockholm.
  - [DERIVED] The four changed rates each rose by exactly 15.0% (129.168/112.32, 113.666/98.84, 63.158/54.920, 47.757/41.528 all = 1.150). This is our arithmetic across two readings of a Tier 2 page (2026-08-01 values as recorded in pricing.ts, 2026-10-23 values above). It is a different event from the unverified "January 2026" 15% rise the dive mentions, and should not be used to confirm it.
- CB-HOW https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html (Tier 1): every bullet in Pricing.tsx:360-369 is still verbatim-supported (8 weeks; 1-14 days or multiples of 7 up to 182; 64 per block, 256 across blocks; one UltraServer = one Capacity Block; termination starts 30 min (instance) / 60 min (UltraServer) before end; EventBridge event 10 minutes before termination begins).
- CB-UG https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html (Tier 1), Considerations, verbatim: "Capacity Blocks end at 11:30AM Coordinated Universal Time (UTC)." / "The termination process for instances running in a Capacity Block begins at 11:00AM Coordinated Universal Time (UTC) on the final day of the reservation." / "Capacity Block cancellations aren't allowed." / "Capacity Block can't be moved or split." / "Capacity Blocks do not support placement groups. You can't specify a placement group when you launch instances into a Capacity Block, whether you target the Capacity Block by its reservation ID or through a Capacity Reservation Resource Group." CB-PURCHASE https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html: "All Capacity Blocks end at 11:30AM UTC" and "Capacity Blocks can't be canceled after you reserve them." So two of the "three things the documentation leaves open" (Pricing.tsx:374-381) are documented. Only the January 2026 rise stays unverified. (Whether these sentences existed on 2026-08-01 is UNKNOWN; they exist now.)
- CB-UG supported-region table (Tier 1) lists Instance Capacity Blocks for p6-b300, p6-b200, p5.4xlarge, p5.48xlarge, p5e, p5en, p4d, p4de, trn1, trn2.3xlarge, trn2.48xlarge, and UltraServer Capacity Blocks for Trn2 (us-east-2) and P6e-GB200 (US East (Dallas) us-east-1-dfw-2a).
- EFA-START https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html (Tier 1): placement-group note and Capacity Reservation sentence still verbatim (Pricing.tsx:456-462, 470-472; InstanceSupport.tsx:516-519). CORRECT.
- SP-RIS https://docs.aws.amazon.com/savingsplans/latest/userguide/sp-ris.html (Tier 1), verbatim: "Savings Plans doesn't provide capacity reservations, but you can allocate On-Demand Capacity Reservation (ODCR) for your needs and your Savings Plans will apply." Pricing.tsx:476-478 lists Savings Plans among ways to secure capacity: WRONG.

STATUS: COMPLETE
