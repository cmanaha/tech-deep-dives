# V2 Adversarial Verification — EFA Instances & Pricing

**Verifier posture:** refute, not confirm. Every number below was re-derived independently from Tier 1 AWS sources. Nothing was carried over from `05-instances-pricing.md` on trust.
**Access date:** 2026-08-01 (US Pacific; HTTP `Date` headers read 2026-08-02 UTC).
**Method:** AWS Price List bulk API (`pricing.us-east-1.amazonaws.com`), including archived monthly versions for historical claims, plus the EC2 User Guide and EC2 instance-type reference pages. No third-party price aggregator was consulted at any point.

---

## 0. Source inventory (Tier 1 only)

| Ref | URL | Provenance stamp |
| --- | --- | --- |
| **PL-CUR** | `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv` | `Last-Modified: Tue, 28 Jul 2026 18:38:05 GMT`; in-file `Publication Date 2026-07-28T17:52:47Z`; `Version 20260728175247`; 302,926,569 bytes |
| **PL-OHIO** | `.../current/us-east-2/index.csv` | same publication version |
| **PL-IDX** | `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/index.json` | 120 archived versions, `20151209144527` .. `20260728175247` |
| **PL-ARCH** | `.../{version}/us-east-1/index.csv` | archived monthly snapshots, used for historical price claims |
| **EFA** | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html` | supported-instance tables + EFA pricing statement |
| **EFA-START** | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html` | cluster placement group language |
| **EFA-ACC** | `https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html` | multi-NIC EFA bandwidth per accelerated type |
| **AC** | `https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html` | accelerated computing specs |
| **HPC** | `https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html` | HPC specs |
| **CO** | `https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html` | compute optimized specs |
| **GP** | `https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html` | general purpose specs |
| **WN-G7E** | `https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/` | AWS first-party announcement |
| **WN-G7** | `https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/` | AWS first-party announcement |
| **WN-TRN3** | `https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/` | AWS first-party announcement |
| **US** | `https://aws.amazon.com/ec2/ultraservers/` | AWS first-party product page |

Price-list filter applied for every quoted rate, so that no Capacity Block or Reserved rate could leak in:
`TermType=OnDemand` AND `Operating System=Linux` AND `Tenancy=Shared` AND `CapacityStatus=Used` AND `MarketOption=OnDemand` AND `Pre Installed S/W=NA` AND `License Model=No License required`.
The `MarketOption` filter is load-bearing: the price list carries a parallel `MarketOption=CapacityBlock` row for the same SKU at `$0.0000000000`, which silently corrupts any naive grep.

---

## VERDICT TABLE

| # | Claim under attack | Verdict |
| --- | --- | --- |
| 1 | p5.48xlarge = $55.04, site's $98.32 is 79% too high | **CONFIRMED** (timeline framing REFUTED) |
| 2 | p4d.24xlarge = $21.957642 vs site $32.77 | **CONFIRMED** (genuine cut, June 2025) |
| 3 | EFA-generation ↔ Nitro mapping is off by one | **CONFIRMED** (verbatim) |
| 4 | 15 of 23 instance rows are wrong | **CONFIRMED** (14 hard + 1 disputed) |
| 5 | p6e-gb200 is Nitro v5; AWS contradicts itself on EFA v3/v4 | **CONFIRMED** (both sides quoted) |
| 6 | G7e / G7 / Trn3 existence and GA dates | **CONFIRMED** (all three, exact dates) |
| 7 | Cluster placement group is not required | **CONFIRMED** (verbatim) |

---

## CLAIM 1 — p5.48xlarge On-Demand

**VERDICT: CONFIRMED on the number. The *timeline* attached to it is REFUTED.**

Independently re-derived from **PL-CUR**:

```
p5.48xlarge   $55.0400000000   SKU=3D4V8UAYEMB38GU2
              EffectiveDate=2026-07-01  operation=RunInstances
              usageType=BoxUsage:p5.48xlarge
              Tenancy=Shared  OS=Linux  CapacityStatus=Used  MarketOption=OnDemand
```

Corroborating field in the same row: `Network Performance = 3200 Gigabit`, `vCPU = 192`, `Memory = 2048 GiB` — consistent with **AC**, so the row is genuinely p5.48xlarge and not a mis-join.

Arithmetic check on the research doc's own claims, all of which hold:
- $98.32 / $55.04 = 1.786 → site is **78.6%** too high. "79% too high" is fair.
- ($55.04 − $98.32) / $98.32 = **−44.0%**. Matches the stated "−44%".
- Delta −$43.28/hr. Matches.

### Was $98.32 ever correct? Yes.

Pulled archived price-list versions from **PL-IDX** and re-ran the identical strict filter:

| Price list version | Effective | p5.48xlarge |
| --- | --- | --- |
| `20240205184227` | 2024-01 | **$98.3200000000** |
| `20250203145209` | 2025-01 | **$98.3200000000** |
| `20250226220217` | 2025-02 | **$98.3200000000** |
| `20250331133428` | 2025-03 | **$98.3200000000** |
| `20250429030412` | 2025-04 | **$98.3200000000** |
| `20250529210942` | 2025-05 | **$98.3200000000** |
| `20250703204906` | 2025-06 | **$55.0400000000** |
| `20260129082055` | 2026-01 | **$55.0400000000** |
| `20260326154455` | 2026-03 | **$55.0400000000** |
| `20260728175247` | 2026-07 | **$55.0400000000** |

$98.32 was the correct us-east-1 Linux On-Demand rate from at least January 2024 through the May 2025 price list. **The cut landed in the June 2025 file.** The site's number is stale, not fabricated. Say so in the deep dive rather than implying it was ever wrong.

### The refutation

`05-instances-pricing.md` §6 states: *"Pricing movement since the March 2026 vintage: P5 and P4d On-Demand fell sharply (p5.48xlarge $98.32 → $55.04...)"*.

**This is false.** The March 2026 price list (`20260326154455`) already carried $55.04. The price had been $55.04 for roughly nine months before the March 2026 content pass. This was never a "price moved since we last looked" event — it is a figure that was **already stale when the March 2026 content shipped** and was carried forward unchecked. Do not publish the "prices moved since March 2026" narrative; it misattributes an authoring miss to an AWS price change and would recur.

---

## CLAIM 2 — p4d.24xlarge On-Demand

**VERDICT: CONFIRMED. Genuine price reduction, same June 2025 event as P5.**

From **PL-CUR**:

```
p4d.24xlarge  $21.9576420000  SKU=H7NGEAC6UEHNTKSJ
              EffectiveDate=2026-07-01  usageType=BoxUsage:p4d.24xlarge
              Network Performance=400 Gigabit  vCPU=96  Memory=1152 GiB
```

Archived versions, identical filter:

| Version | Effective | p4d.24xlarge |
| --- | --- | --- |
| `20240205184227` | 2024-01 | **$32.7726000000** |
| `20250203145209` | 2025-01 | **$32.7726000000** |
| `20250529210942` | 2025-05 | **$32.7726000000** |
| `20250703204906` | 2025-06 | **$21.9576420000** |
| `20260326154455` | 2026-03 | **$21.9576420000** |
| `20260728175247` | 2026-07 | **$21.9576420000** |

So: **$32.77 is a correctly-rounded historical price** (true value $32.7726), valid through the May 2025 list, and the current $21.957642 reflects a **genuine reduction that took effect in the June 2025 price list** — the same cut that moved P5. Both figures fell by the same proportion (−44.0% for p5, −33.0% for p4d), consistent with a coordinated GPU price action rather than a data error.

Arithmetic in the research doc checks out: $32.7726 / $21.957642 = 1.4925 → **49.2% too high** ("49%" stated); delta −$10.81/hr, −33.0%.

### Full current us-east-1 On-Demand set, independently re-derived

Every value below came out of **PL-CUR** under the strict filter. These all match `05-instances-pricing.md`:

| Instance type | $/hr | Price-list `Network Performance` |
| --- | --- | --- |
| p6-b300.48xlarge | 142.4160 | 6400 Gigabit |
| p6-b200.48xlarge | 113.9328 | 3200 Gigabit |
| p5en.48xlarge | 63.2960 | 3200 Gigabit |
| p5.48xlarge | 55.0400 | 3200 Gigabit |
| g7e.48xlarge | 33.1443200 | 1600 Gigabit |
| g6e.48xlarge | 30.1311800 | 400 Gigabit |
| g7.48xlarge | 28.5132800 | 700 Gigabit |
| p4de.24xlarge | 27.4470500 | 400 Gigabit |
| trn1n.32xlarge | 24.7800 | 1600 Gigabit |
| p4d.24xlarge | 21.9576420 | 400 Gigabit |
| trn1.32xlarge | 21.5000 | 800 Gigabit |
| m8i.96xlarge | 20.3212800 | 100000 Megabit |
| c8i.96xlarge | 17.9923200 | 100000 Megabit |
| m8gn.48xlarge | 13.9680 | 600 Gigabit |
| c8gn.48xlarge | 11.3760 | 600 Gigabit |
| m8i.48xlarge | 10.1606400 | 75000 Megabit |
| c8i.48xlarge | 8.9961600 | 75000 Megabit |
| c6in.32xlarge | 7.2576 | 200000 Megabit |
| p5.4xlarge | 6.8800 | 100 Gigabit |
| inf1.24xlarge | 4.7210 | 100 Gigabit |
| c7gn.16xlarge | 3.9936 | 200 Gigabit |
| c5n.18xlarge | 3.8880 | 100 Gigabit |
| hpc7g.16xlarge | 1.6832 | 200 Gigabit |

Absent from us-east-1 entirely (zero rows of any term type, confirming the "no On-Demand SKU" claim for that region): **p5e.48xlarge, p6e-gb200.36xlarge, trn2.48xlarge, trn2u.48xlarge, trn2.3xlarge, hpc6a.48xlarge, hpc6id.32xlarge, hpc7a.\*, hpc8a.96xlarge**.

From **PL-OHIO** (us-east-2), strict filter:

| Instance type | $/hr |
| --- | --- |
| hpc8a.96xlarge | 7.9200 |
| hpc7a.96xlarge / 48xl / 24xl / 12xl | 7.2000 (identical across all four sizes) |
| hpc6id.32xlarge | 5.7000 |
| hpc6a.48xlarge | 2.8800 |

All match the research doc.

> **Scope caveat:** the research doc asserts p5e/trn2 have no On-Demand SKU in **us-east-1, us-east-2, or us-west-2**. I independently verified the us-east-1 absence (whole-file grep, zero rows). I did **not** re-pull us-west-2, and my us-east-2 pull was filtered to HPC types. The us-east-2 and us-west-2 halves of that claim are **carried, not verified**. Soften the wording to "no On-Demand SKU in the us-east-1 price list" unless someone re-checks the other two.

---

## CLAIM 3 — EFA generation ↔ Nitro version mapping

**VERDICT: CONFIRMED, verbatim.**

**EFA**, section "Supported instance types", contains exactly four subsection headings, quoted literally:

- `Using Nitro v6 (EFA v4)`
- `Using Nitro v5 (EFA v3)`
- `Using Nitro v4 (EFA v2)`
- `Using Nitro v3 (EFA v1)`

The site's `InstanceSupport.tsx` mapping (Nitro v6 → EFAv3, and EFAv4 → "P6e-GB200 UltraServers only") is off by one against this. The research doc's correction is right.

Also confirmed verbatim from **EFA** prose:

> "EFA supports RDMA (Remote Direct Memory Access) write on most supported instance types that have Nitro version 4 and later. RDMA read is supported on all instances with Nitro version 4 and later."

RDMA exceptions confirmed in the tables: `c7gn.16xlarge`, `c7gn.metal`, `hpc7g.4xlarge`, `hpc7g.8xlarge`, `hpc7g.16xlarge` are read=Yes / **write=No** despite being Nitro v5. On Nitro v3, only `p4d.24xlarge` and `p4de.24xlarge` show read=Yes; all others are No/No.

And the EFA pricing sentence, verbatim:

> "EFA is available as an optional Amazon EC2 networking feature that you can enable on any supported instance at no additional cost."

---

## CLAIM 4 — "15 of 23 instance rows are wrong"

**VERDICT: CONFIRMED — 14 unambiguously wrong, 1 disputed. The count of 15 stands, but one row should be reclassified.**

I read the site's actual 23 rows out of `deep-dives/efa/src/sections/InstanceSupport.tsx` rather than trusting the research doc's transcription, then checked each against **EFA** / **AC** / **HPC** / **CO** / **GP**.

### Spot-checks demanded by the brief

**hpc6a.48xlarge — research claims 1 card / 100 Gbps / EFAv2. CONFIRMED, all three fields.**
**HPC** network specifications table, literal row:

```
| hpc6a.48xlarge | 100 Gigabit | ✓ Yes | ✓ Yes | ✗ No | 1 | 2 | 50 | ✓ Yes |
```

(columns: bandwidth, EFA, ENA, ENA Express, **Network cards = 1**, max NICs, IPs, IPv6). **HPC** family summary gives Hpc6a hypervisor = **Nitro v4**, and **EFA** lists `hpc6a.48xlarge` under `Using Nitro v4 (EFA v2)`. The site's `2 interfaces / 200 Gbps / EFAv1` is wrong on all three. This is correctly identified as the worst row.

**c8i.48xlarge and m8i.48xlarge — research claims 1 card / 75 Gbps / EFAv4. The surprising 75 Gbps is CONFIRMED by two independent Tier 1 sources.**

Source A, **CO** and **GP** network specifications, literal rows:

```
| c8i.48xlarge | 75 Gigabit  | ✓ Yes | ✓ Yes | ✓ Yes | 1 | 24 | 64 | ✓ Yes |
| c8i.96xlarge | 100 Gigabit | ✓ Yes | ✓ Yes | ✓ Yes | 1 | 24 | 64 | ✓ Yes |
| m8i.48xlarge | 75 Gigabit  | ✓ Yes | ✓ Yes | ✓ Yes | 1 | 24 | 64 | ✓ Yes |
| m8i.96xlarge | 100 Gigabit | ✓ Yes | ✓ Yes | ✓ Yes | 1 | 24 | 64 | ✓ Yes |
```

Source B, an entirely separate system — the **PL-CUR** `Network Performance` column for the same instance types reads `75000 Megabit` for both `c8i.48xlarge` and `m8i.48xlarge`, and `100000 Megabit` for both `.96xlarge`. Two unrelated AWS pipelines agree. **75 Gbps is real.**

The shape is also internally coherent rather than anomalous: within C8i, EFA support switches on only at 48xlarge, and the family ladder runs 32xlarge = 50 Gbps → 48xlarge = 75 Gbps → 96xlarge = 100 Gbps. `c8a.48xlarge` and `c8a.metal-48xl` are likewise 75 Gigabit / 1 card. The site's `2 interfaces / 200 Gbps` for c8i and m8i has no basis in any Tier 1 source.

Four further spot-checks, all confirming the research doc:
- **hpc8a.96xlarge** — **HPC** family summary: Nitro **v6** → EFA **v4** (site says EFAv3). Performance table: **192 vCPUs / 192 cores / AMD EPYC 9R45** (site says "96 AMD EPYC 9005").
- **hpc7g.16xlarge** — **HPC**: Nitro **v5**, 200 Gigabit, **1** network card; **EFA** lists it under EFA v3 with RDMA write = **No** (site says EFAv2 / Nitro v4).
- **c7gn.16xlarge** — **EFA** lists it under `Using Nitro v5 (EFA v3)`, RDMA write = **No** (site says EFAv2 / Nitro v4).
- **trn1.32xlarge / trn1n.32xlarge** — **EFA** lists both under `Using Nitro v4 (EFA v2)`; **AC** confirms Nitro v4, 8 and 16 network cards, 8x100 and 16x100 Gigabit (site says EFAv1).

### Full 23-row audit

| # | Row | My verdict | Basis |
| --- | --- | --- | --- |
| 1 | p6-b300.48xlarge | **WRONG** | EFAv3→**v4**; 17 cards but NCI 0 is ENA-only, so **16** EFA-capable |
| 2 | p6-b200.48xlarge | **WRONG** | EFAv3→**v4**; rest correct |
| 3 | p6e-gb200.36xlarge | **WRONG** | Nitro v6→**v5** (two T1 docs); see Claim 5 |
| 4 | p5.48xlarge | correct | 32 cards / 3200 / EFAv2 / v4 all match **AC**+**EFA** |
| 5 | p5e.48xlarge | correct | 32 / 3200 / v4 match |
| 6 | p5en.48xlarge | correct | 16 / 3200 / EFAv3 / v5 match |
| 7 | p4d.24xlarge | correct | 4 / 400 / EFAv1 / v3 match |
| 8 | p4de.24xlarge | correct | 4 / 400 / EFAv1 / v3 match ("SXM4e" is cosmetic) |
| 9 | trn2.48xlarge | **DISPUTED — reclassify** | see below |
| 10 | trn2.3xlarge | correct | 1 / 200 / EFAv3 / v5 match |
| 11 | trn1n.32xlarge | **WRONG** | EFAv1→**EFAv2** |
| 12 | trn1.32xlarge | **WRONG** | EFAv1→**EFAv2** |
| 13 | inf1.24xlarge | correct | 1 / 100 / EFAv1 / v3 match |
| 14 | hpc8a.96xlarge | **WRONG** | EFAv3→**v4**; vCPU 96→**192** |
| 15 | hpc7a.96xlarge | **WRONG (text field only)** | all EFA specs correct; only "96 AMD EPYC 9004"→**192 / EPYC 9R14** |
| 16 | hpc7g.16xlarge | **WRONG** | EFAv2→**v3**; Nitro v4→**v5**; RDMA write No |
| 17 | hpc6a.48xlarge | **WRONG (worst)** | 2→**1** card; 200→**100** Gbps; EFAv1→**v2** |
| 18 | hpc6id.32xlarge | **WRONG** | EFAv1→**EFAv2** |
| 19 | c8i.48xlarge | **WRONG** | 2→**1**; 200→**75**; EFAv3→**v4** |
| 20 | m8i.48xlarge | **WRONG** | 2→**1**; 200→**75**; EFAv3→**v4** |
| 21 | c6in.32xlarge | **WRONG** | EFAv1→**EFAv2** |
| 22 | c7gn.16xlarge | **WRONG** | EFAv2→**v3**; Nitro v4→**v5**; RDMA write No |
| 23 | c5n.18xlarge | correct | 1 / 100 / EFAv1 / v3 match |

**Tally: 15 wrong / 8 correct — the headline count is confirmed.** Two refinements the research doc should absorb:

- **Row 9 (trn2.48xlarge) is disputed, not wrong.** The research doc says the site's "512GB HBM3" *"matches neither source"*. That is inaccurate. **AC** gives `trn2.48xlarge | ... | 16 x AWS Trainium2 accelerators | 8192 GiB (16 x 512 GiB)` — i.e. **512 GiB per chip**, which is exactly what the site's "16x Trainium v2 (512GB HBM3)" reads as. The site is consistent with **AC**. The real problem is that **AC**'s 512 GiB/chip conflicts with the AWS Trn2 product page's 1.5 TB total (≈96 GB/chip), and 96 GB/chip is the publicly known Trainium2 figure — so **AC** is the likely-erroneous source here. Report this as an AWS documentation contradiction, and do not "correct" the site to 8,192 GiB.
- **Row 15 (hpc7a.96xlarge) is wrong only in a free-text label**, not in any EFA-relevant field. Every spec the table actually keys on (2 cards, 300 Gbps, EFAv2, Nitro v4) is right. Grouping it with genuine spec errors overstates the severity. If you count only rows with a wrong EFA/Nitro/card/bandwidth value, the number is **14**.

Additional Tier 1 corroboration gathered along the way, all matching the research doc: g7e.48xlarge 4 cards/1600 Gbps; g7.48xlarge 2 cards/700 Gbps; g6e.48xlarge 4/400; c8gn.48xlarge and m8gn.48xlarge 2/600; c8in.96xlarge / m8in.96xlarge 2/600; c8gb.48xlarge / m8gb.48xlarge 2/400; c9g.48xlarge / m9g.48xlarge 1/100; c8g.48xlarge 1/50; hpc6id 2/200; hpc7a 2/300.

**One prose claim I must flag as overstated.** The research doc's §5b replacement text says the lower bound is "**25 Gbps** (g6.8xlarge, g6.16xlarge, gr6.8xlarge)". **AC** shows `vt1.24xlarge` is also EFA-capable at **25 Gigabit**, and `g6e.8xlarge` at 25 Gigabit. More importantly the doc's line *"g4dn.8xl/12xl/16xl/metal, g5.8xl-48xl, p3dn.24xlarge, vt1.24xlarge ... 100 Gbps class"* is wrong: per **AC** those run 50 Gbps (g4dn.8/12/16xl), 25-50 Gbps (g5.8xl=25, g5.12xl=40, g5.16xl=25, g5.24xl=50), and 25 Gbps (vt1.24xlarge). Only `g4dn.metal` and `g5.48xlarge` reach 100 Gbps. Do not ship "100 Gbps class" for that group.

---

## CLAIM 5 — P6e-GB200 Nitro version and the EFA v3/v4 contradiction

**VERDICT: CONFIRMED on both halves. The contradiction is real, and both sides are AWS first-party.**

**Side A — Nitro v5 / EFA v3.** Two independent Tier 1 docs:

1. **EFA** lists `p6e-gb200.36xlarge` in the table headed literally `Using Nitro v5 (EFA v3)`, under "Accelerated Computing", alongside `p5en.48xlarge`, `trn2.3xlarge`, `trn2.48xlarge`, `trn2u.48xlarge`.
2. **AC** instance family summary, literal row:
   `| P6e-GB200 | Nitro v5 | NVIDIA Grace (arm64) | ✗ No | ✗ No | ✗ No | ✗ No | Linux |`
   (Nitro **v5**; Spot support **No** — the research doc's no-Spot claim is also confirmed here, as is Trn2u = Nitro v5 / Spot No.)

**Side B — EFA v4.** **US** (`aws.amazon.com/ec2/ultraservers/`), verbatim:

> "Accelerated by NVIDIA GB200 NVL72, P6e-GB200 instances in an UltraServer configuration allow you to access up to 72 Blackwell GPUs within one NVLink domain to leverage 360 petaflops of FP8 compute (without sparsity), 13.4 TB of total high bandwidth memory (HBM3e), and up to 28.8 terabits per second of Elastic Fabric Adapter (**EFAv4**) networking."

Both are AWS-authored and they cannot both be right under the mapping in Claim 3. **Recommendation stands:** state **Nitro v5** (two independent Tier 1 technical docs), and surface the EFAv4 marketing claim explicitly as a noted discrepancy rather than silently resolving it.

**Side finding — a second, separate P6e-GB200 tension the research doc did not flag.** **AC**'s network specifications table lists `p6e-gb200.36xlarge` at **3200 Gigabit** with 17 network cards, whereas **EFA-ACC** caps *EFA* bandwidth at 1,600 Gbps. These reconcile (3,200 Gbps is total physical NIC capacity across 8 shared NICs; the EFA ceiling is imposed by the GPU-sharing topology), but anyone spot-checking the site against **AC** alone will read 3,200 and think the page is wrong. Say "1,600 Gbps EFA (3,200 Gbps total network capacity)".

The research doc's 1,600 Gbps EFA figure is **CONFIRMED verbatim** from **EFA-ACC**:

> "Each GPU supports up to 400 Gbps of EFA bandwidth. ... Therefore, to achieve maximum EFA performance, we recommend that you do **one of the following** to achieve a total of 1,600 Gbps EFA bandwidth: Add an EFA-only network interface to only one NCI in each group to achieve 400 Gbps per network interface (*4 EFA network interfaces x 400 Gbps*). Add an EFA-only network interface to each NCI in each group to achieve 200 Gbps per network interface (*8 EFA network interfaces x 200 Gbps*)."

The NCI pairing detail is also confirmed verbatim: physical-NIC groups `[1,2] [3,4] [5,6] [7,8] [9,10] [11,12] [13,14] [15,16]` each capped at 400 Gbps, and GPU-sharing pairs `[1,3] [5,7] [9,11] [13,15]`. The existing site alert on this is correct.

**P6-B300 network card nuance — CONFIRMED verbatim** from **EFA-ACC**:

> "P6-B300 instances have a total network bandwidth capacity of up to 6400 Gbps for EFA traffic, and up to 3870 Gbps for ENA traffic. They have 8 GPUs and 17 network cards, where the primary network card supports only an ENA network interface with up to 350 Gbps of bandwidth. The secondary network cards support up to 400 Gbps EFA and up to 220 Gbps of ENA bandwidth."

So **16** EFA-capable cards, not 17. Confirmed.

> **Unresolved discrepancy worth noting:** **US** says "P6e-GB200 instances are only available in UltraServers ranging from **8 GPUs to 72 GPUs**", which does not sit cleanly with the research doc's claim (sourced to the EKS and ParallelCluster docs) that exactly two sizes exist, `u-p6e-gb200x36` (36 GPUs) and `u-p6e-gb200x72` (72 GPUs). I did not resolve this. Do not publish "two UltraServer sizes exist" as a flat fact without re-checking.

---

## CLAIM 6 — G7e, G7, Trn3 existence and dates

**VERDICT: CONFIRMED on every existence claim and every date.**

**G7e — GA January 2026, 1,600 Gbps EFA. Confirmed.**
**WN-G7E**, "Posted on: **Jan 20, 2026**", verbatim:

> "Today, Amazon announces the general availability of Amazon Elastic Compute Cloud (Amazon EC2) G7e instances, accelerated by NVIDIA RTX PRO 6000 Blackwell Server Edition GPUs. ... G7e instances feature up to 8 NVIDIA RTX PRO 6000 Blackwell Server Edition GPUs, with 96 GB of memory per GPU, and 5th Generation Intel Xeon processors. They support up to 192 virtual CPUs (vCPUs) and up to **1600 Gbps of Elastic Fabric Adapter networking bandwidth**. G7e instances support NVIDIA GPUDirect Peer to Peer (P2P) ... Multi-GPU G7e instances also support NVIDIA GPUDirect Remote Direct Memory Access (RDMA) with **EFAv4** in EC2 UltraClusters"

Cross-checked: **AC** lists `g7e.48xlarge` at 1600 Gigabit / 4 network cards / EFA Yes, family hypervisor **Nitro v6**; **EFA** lists g7e.8/12/24/48xlarge under `Using Nitro v6 (EFA v4)`; **PL-CUR** carries `g7e.48xlarge` at $33.14432 with `Network Performance = 1600 Gigabit`. Four independent confirmations. Launch regions per the announcement are us-east-1 and us-east-2.

**G7 — GA June 2026, 700 Gbps EFA. Confirmed.**
**WN-G7**, "Posted on: **Jun 18, 2026**", verbatim:

> "G7 instances feature up to 8 NVIDIA RTX PRO 4500 Blackwell Server Edition GPUs with 32 GB of memory per GPU, custom Intel Xeon 6 processors, and up to **700 Gbps of Elastic Fabric Adapter (EFA) networking bandwidth**."

Cross-checked: **AC** gives `g7.48xlarge` 700 Gigabit / 2 network cards, family Nitro v6; **EFA** lists g7.8/12/24/48xlarge under EFA v4; **PL-CUR** shows $28.51328 with `Network Performance = 700 Gigabit`. Announcement regions: us-east-2 and us-west-2 (note: **not** us-east-1, despite the price list carrying a us-east-1 rate).

**Trn3 UltraServers — GA December 2025, and no `trn3.*` in the EFA table. Both confirmed.**
**WN-TRN3**, "Posted on: **Dec 2, 2025**", verbatim:

> "AWS announces the general availability of Amazon Elastic Compute Cloud (Amazon EC2) Trn3 UltraServers powered by our fourth-generation AI chip Trainium3 ... Each AWS Trainium3 chip provides 2.52 petaflops (PFLOPs) of FP8 compute, increases the memory capacity by 1.5x and bandwidth by 1.7x over Trainium2 to 144 GB of HBM3e memory, and 4.9 TB/s of memory bandwidth. ... Trn3 UltraServers can scale up to 144 Trainium3 chips (362 FP8 PFLOPs total) and are available in EC2 UltraClusters 3.0 ... A fully configured Trn3 UltraServer delivers up to 20.7 TB of HBM3e and 706 TB/s of aggregate memory bandwidth. The next-generation Trn3 UltraServer, feature the NeuronSwitch-v1, an all-to-all fabric that doubles interchip interconnect bandwidth over Trn2 UltraServer."

And the negative claim holds: I read the **complete** supported-instance list in **EFA** (all four Nitro tables) and there is **no `trn3.*` entry of any size**. **AC**'s instance-families table likewise contains no Trn3 family (it runs DL1, DL2q, F2, G4ad, G4dn, G5, G5g, G6, G6e, G6f, Gr6, Gr6f, G7, G7e, Inf1, Inf2, P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200, Trn1, Trn1n, Trn2, Trn2u, VT1). **PL-CUR** has no `trn3` rows. Treat Trn3 exactly as the research doc recommends: announced and GA as an UltraServer, with **no EC2 instance type name and no EFA device count assertable**.

Minor corrections to the research doc's Trn3 numbers:
- It writes "362 **MXFP8** PFLOPs"; **WN-TRN3** says "362 **FP8** PFLOPs total". Use FP8.
- **I could not confirm the "Up to 28.8 Tbps of aggregate scale-out bandwidth per UltraServer" figure for Trn3.** It does not appear in **WN-TRN3**. The research doc attributes it to the Trainium product page, which I did not fetch. Given that 28.8 Tbps is also the P6e-GB200 UltraServer EFA figure, this is a plausible transcription collision. **Do not ship it without a direct citation.**

---

## CLAIM 7 — "EFA requires a cluster placement group"

**VERDICT: CONFIRMED. The site's claim is wrong, and AWS says so in as many words.**

**EFA-START**, Step 10 ("Launch EFA-enabled instances into a cluster placement group"), Note block, verbatim:

> "**It is not an absolute requirement to launch your EFA-enabled instances into a cluster placement group.** However, we do recommend running your EFA-enabled instances in a cluster placement group as it launches the instances into a low-latency group in a single Availability Zone."

The same note continues, which also refutes the site's "only guaranteed capacity path" framing:

> "To ensure that capacity is available as you scale your cluster's instances, you can create a Capacity Reservation for your cluster placement group."

The genuinely hard constraint is same-AZ, from **EFA** limitations, verbatim: *"EFA traffic can't cross Availability Zones or VPCs."* Also confirmed there: *"EFA is not supported on AWS Outposts"* and *"EFA traffic between P4d/P4de/DL1 instances and other instance types is currently not supported."*

The site's `Pricing.tsx` line 110 currently reads "EFA requires a cluster placement group = **all instances in the same AZ**". Replace with: cluster placement group is recommended, not required; same-AZ is required.

---

## Figures that FAILED independent confirmation — these must not ship

| Figure | Where it appears | Status |
| --- | --- | --- |
| Spot prices: "~$39 (60% savings)", "~$13 (60% savings)", "~$8.60", "~$9.90" | site `Pricing.tsx` 34-37 | **FABRICATED.** Spot rates are not in the EC2 price list or any credential-free Tier 1 endpoint. A uniform "60% savings" across four families is a tell. Remove the column or replace with Spot *eligibility*, which is sourceable from **AC**/**HPC**. |
| hpc7a.96xlarge = **$3.60** | site `Pricing.tsx` 38 | **UNVERIFIABLE — never correct.** hpc7a has no us-east-1 SKU at all. In us-east-2 it is $7.20 today, and archived lists show **$7.20 in Jan 2024 and Jan 2025** too. $3.60 matches no region, no OS, no year I checked. |
| "Prices increased ~15% in January 2026" (Capacity Blocks) | site `Pricing.tsx` 132 | **UNVERIFIABLE.** No Tier 1 source. Note the adjacent claim "while On-Demand prices decreased" is also misleading: the On-Demand cut was **June 2025**, not January 2026. |
| "End times fixed at 11:30 AM UTC" | site `Pricing.tsx` 133 | **UNVERIFIABLE.** Not in the Capacity Blocks documentation. |
| "No cancellation" | site `Pricing.tsx` 133 | **UNVERIFIABLE.** Not stated in the sources fetched. |
| `costPerGbps` column ($0.031 / $0.082 / $0.027 / $0.015 / $0.012) | site `Pricing.tsx` 34-38 | **DERIVED, presented as sourced, and stale.** Recomputed from verified prices: p5.48xlarge $55.04/3200 = **$0.0172**; p4d.24xlarge $21.957642/400 = **$0.0549**; trn1.32xlarge $21.50/800 = **$0.0269**; trn1n.32xlarge $24.78/1600 = **$0.0155**. The research doc's recomputations are arithmetically correct. Label DERIVED and show inputs, or drop. |
| Trn3 "28.8 Tbps aggregate scale-out bandwidth per UltraServer" | research doc §3 | **NOT CONFIRMED.** Absent from **WN-TRN3**; possible collision with the P6e-GB200 figure. |
| "P5 and P4d fell **since the March 2026 vintage**" | research doc §6 | **REFUTED.** March 2026 price list already read $55.04 / $21.957642. The cut was June 2025. |
| trn2.48xlarge "512GB HBM3 matches neither source" | research doc §5a row 9 | **REFUTED.** It matches **AC**'s 512 GiB-per-chip figure exactly. The real issue is an AWS-internal contradiction (**AC** 512 GiB/chip vs product page ~96 GB/chip). |
| "g4dn / g5 / p3dn / vt1 ... 100 Gbps class" | research doc §2a | **REFUTED.** Per **AC** these are 25-50 Gbps; only g4dn.metal and g5.48xlarge reach 100 Gbps. |
| p5e / trn2 "no On-Demand SKU in us-east-1, **us-east-2, or us-west-2**" | research doc §4 | **PARTLY VERIFIED.** us-east-1 absence confirmed directly. us-east-2 and us-west-2 not re-checked. Narrow the claim. |
| "Two UltraServer sizes exist (x36 / x72)" | research doc §3 | **CONTESTED.** **US** says "ranging from 8 GPUs to 72 GPUs". Unresolved. |

---

## Net assessment

The two headline price corrections — **p5.48xlarge $98.32 → $55.04** and **p4d.24xlarge $32.77 → $21.957642** — are **correct, independently reproducible from the AWS bulk price list, and safe to ship**, with one framing change: these are **June 2025** price cuts that the March 2026 content pass already missed, not changes that happened since. The Nitro/EFA off-by-one, the hpc6a row, the c8i/m8i 75 Gbps figure, the P6e-GB200 Nitro v5 finding, the three GA dates, and the placement-group refutation all survive adversarial checking against Tier 1 sources.

What does not survive: every Spot number, the hpc7a $3.60, the three Capacity Block operational claims, the Trn3 28.8 Tbps figure, and two of the research doc's own corrections (the trn2 memory verdict and the "100 Gbps class" grouping).
