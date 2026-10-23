# 2026-10 Refresh: Instances and Pricing (research 02)

STATUS: IN PROGRESS

Accessed dates: price-list facts were read 2026-10-18. Documentation facts carry the date they were read (2026-10-18 or 2026-10-23), stated per source.
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

(Sections 2 onward in progress.)

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

| ID | Claim (as on page, short) | Location (file:line) | Verdict | Evidence (URL + tier) | Replacement fact |
| --- | --- | --- | --- | --- | --- |

(pending)

## 4. Ready-to-apply edit table (instances.ts, pricing.ts)

(pending)

## 5. Regional availability

(pending)

## 6. UNKNOWN list

(pending)

## 7. Personal data sent in requests

None so far. Every request used curl's default User-Agent with no added headers, query strings or bodies.
