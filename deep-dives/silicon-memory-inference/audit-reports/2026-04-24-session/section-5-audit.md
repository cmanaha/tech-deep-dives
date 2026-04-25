# Section 5 Audit — HBM and the Bandwidth Wall

**File:** `src/sections/HbmAndBandwidthWall.tsx`
**Diagram:** `src/components/HbmStackDiagram.tsx`
**Auditor date:** 2026-04-24
**Access date in section:** 2026-04-23

---

## 1. Verdict

**Pass with minor corrections.** Section is on the EFA quality bar: flowing prose, an actual SVG cross-section, Tier 1 vendor table, explicit UNKNOWN flag for Blackwell. A handful of acronym expansions and a couple of uncited quantitative claims need small edits before it fully lands.

## 2. Depth vs EFA benchmark — 8/10

Justification. Opens with an outcome-first claim ("decode-phase inference throughput scales with HBM bandwidth per GPU"), then derives why — 2.5D packaging, pin-speed economics, interposer constraints (`HbmAndBandwidthWall.tsx:59-74`). Case-study framing (H100 vs H200, what stayed the same vs what changed, `:157-176`) mirrors the EFA section's "TCP vs EFA" data-path reasoning. Alternatives panel with SRAM / CIM / disaggregated serving (`:277-304`) matches EFA's comparative pattern. Loses two points against the EFA bar: (a) the "why HBM pin speed is hard" block stays qualitative where EFA quantifies (~100 us kernel overhead reduced to ~15 us) — no numeric anchor for the 150 W or the 8-9 Gb/s difficulty; (b) no inline numeric citation to HBM3 JEDEC spec for the 1,024-bit / 6.4 Gb/s figures, which are load-bearing.

## 3. Diagrams — HbmStackDiagram

- **Renders properly.** Valid SVG, fixed 720x380 viewBox, `overflow-x: auto` wrapper for mobile (`HbmStackDiagram.tsx:23-31`). Accessible `aria-label` describing the cross-section (`:29`).
- **Reinforces prose.** Shows exactly the layers referenced in the surrounding paragraph: DRAM die stack, base logic die, silicon interposer, package substrate, accelerator die, HBM PHY link (`:33-191`).
- **TSVs labeled.** Yes — red dashed verticals through the stack with leader line and "TSVs (through-silicon vias)" annotation at `:140-143`.
- **1,024-bit bus annotation present.** Yes — "1,024-bit bus per stack" annotation at `:144-146`, reinforced by "x1024 pins per stack → TB/s per stack" at `:189`.
- **One nit.** PHY pin-speed annotation says `~6.4 / 8-9 Gb/s per pin` (`:180`) without disambiguating HBM3 vs HBM3e inline. Prose does distinguish them; the diagram could too.

## 4. Citations and sources

- **Inline Tier 1 citations:** 3 distinct NVIDIA product-page links — H100 (`:27`), H200 (`:34`), HGX (`:41`) — plus the H200 product-page citation inside the success Alert (`:182-184`). All Tier 1 (nvidia.com official product pages).
- **Access dates present.** Yes — table has `All vendor-cited figures accessed 2026-04-23` (`:134`) and the Alert block carries `accessed 2026-04-23` (`:185`).
- **UNKNOWN flag for Blackwell.** Present. `warning` Alert at `:135-142` explicitly states per-GPU HBM for B200/B300 is UNKNOWN pending the Blackwell datasheet, and explains *why* (HGX page emphasizes NVLink aggregate numbers). This is exactly the tier-discipline pattern the project calls for.
- **Load-bearing numbers without a citation:**
  1. `1,024 bits per stack`, `sixteen 64-bit channels`, `6.4 Gb/s`, `8-9 Gb/s` (`:91-98`) — asserted without a JEDEC HBM3/HBM3e citation. These are the definitional numbers of the section and should link to the JEDEC HBM3 spec page.
  2. `HBM4 ... 2,048 bits per stack` (`:224-228`) — asserted without a JEDEC HBM4 link.
  3. `150 W or more` for HBM power (`:213`) — asserted without a source.
  4. `FP8: 3,958 TFLOPS, BF16: 1,979 TFLOPS` and `NVLink bandwidth (900 GB/s)` (`:163-165`) — these are H100 datasheet numbers, cited only transitively via the H100 row; the ColumnLayout block itself has no inline link.

## 5. Numeric accuracy

- H100 SXM 80 GB HBM3 / 3.35 TB/s — present (`:23-27`). Matches NVIDIA H100 datasheet. **OK.**
- H200 SXM 141 GB HBM3e / 4.8 TB/s — present (`:29-34`). Matches NVIDIA H200 product page. **OK.**
- B200 / B300 UNKNOWN with warning Alert — present (`:37-42`, `:135-142`). **OK.**
- 1,024 bits per stack, 16 channels of 64 bits — present (`:91-93`). Matches JEDEC HBM3. **OK (uncited, see 4).**
- HBM3 pin speed ~6.4 Gb/s, HBM3e ~8-9 Gb/s — present (`:96-98`). Matches published HBM3/HBM3e ranges. **OK (uncited, see 4).**
- HBM4 target 2,048-bit-per-stack bus — present (`:224-225`). Matches the JEDEC HBM4 standards direction. **OK (uncited, see 4).**
- H200 vs H100: 1.4x bandwidth — present (`:172`). Matches NVIDIA messaging.
- Up to 1.9x Llama2 70B inference, 1.6x GPT-3 175B — present in the success Alert (`:178-180`) with inline H200 product-page citation. **OK.**

No fabricated numbers detected. All numeric claims are either in-range with vendor reporting or correctly labeled UNKNOWN.

## 6. Clean-copy discipline checklist

| Check                                  | Absent? |
| -------------------------------------- | ------- |
| TLDR block                             | Yes — absent |
| Status badge (StatusIndicator, etc.)   | Yes — absent |
| "Panelist map" container               | Yes — absent |
| "Evaluation lens" container            | Yes — absent |
| SectionShell wrapper                   | Yes — absent (uses `SpaceBetween` + `Container` directly, matching EFA) |

Clean on all five.

## 7. Acronym expansion

Walking the section in reading order:

- **HBM** — first appears in the H1 header ("HBM and the bandwidth wall", `:54`) and repeatedly in prose *before* it is expanded. **Never expanded in the section.** This is the defining acronym and must expand on first use per project rules.
- **DRAM** — used at `:69` and `:92` without expansion. Must expand on first occurrence.
- **TSV** — "through-silicon vias" expanded inline at `:69` ("DRAM dies stacked vertically with through-silicon vias"). **OK.** The later reference to "TSVs" at `:94` is fine.
- **JEDEC** — not mentioned in prose. Acceptable, but if citations to the JEDEC spec are added (see 4), expand on first use.
- **PHY** — not used in prose; appears only in the diagram as "HBM PHY" (`:180`). Technically acceptable, but since the diagram is part of the reading surface, consider expanding in the caption or in prose ("PHY = physical-layer interface").
- **SXM** — used at `:23, :29` (column headers) without expansion. Niche NVIDIA form-factor acronym; should expand on first use.
- **DIMM** — used at `:92, :98` without expansion ("DDR5 DIMM"). Niche memory-module acronym; should expand on first use.
- **SM** — "GH100 die / Same SM count" at `:163`. Niche NVIDIA acronym (Streaming Multiprocessor); should expand.
- **FP8, BF16** — used at `:163` without gloss. Accept as industry standard for the technical-lead audience, but a single parenthetical on first use would match the EFA acronym discipline.

Acronym hygiene is the weakest area of the section.

## 8. Content philosophy

- **Outcome-first.** Yes. Opens with the business-level claim about decode throughput then works backward to the physics (`:59-74`). Classic backward-from-outcome framing.
- **Technical-lead depth.** Yes. Assumes familiarity with arithmetic intensity, roofline, NVLink, tensor cores. Does not re-explain basics.
- **Comparative framing.** Yes. "Where HBM bandwidth does not help" (`:238-265`) and "Alternatives to the HBM bandwidth wall" (`:267-305`) both enumerate the non-happy paths, exactly the EFA "Why not TCP / Why not RDMA/RoCE" pattern.

## 9. Issues found

1. `HbmAndBandwidthWall.tsx:54, :59, :67` — **HBM never expanded on first use** (High Bandwidth Memory). The section's title acronym is the biggest gap.
2. `HbmAndBandwidthWall.tsx:69, :92` — **DRAM never expanded** on first use (Dynamic Random-Access Memory).
3. `HbmAndBandwidthWall.tsx:23, :29` — **SXM never expanded** in the table rows (Server PCIe Module / NVIDIA's server GPU form factor).
4. `HbmAndBandwidthWall.tsx:92, :98` — **DIMM never expanded** (Dual In-line Memory Module).
5. `HbmAndBandwidthWall.tsx:163` — **SM never expanded** (Streaming Multiprocessor) in the H100-vs-H200 ColumnLayout.
6. `HbmAndBandwidthWall.tsx:91-98` — Load-bearing HBM structural numbers (1,024 bits/stack, sixteen 64-bit channels, 6.4 Gb/s, 8-9 Gb/s) **asserted without a Tier 1 inline citation**. Needs a JEDEC HBM3/HBM3e link.
7. `HbmAndBandwidthWall.tsx:224-228` — HBM4 "2,048 bits per stack" **asserted without citation**. Needs the JEDEC HBM4 standards reference.
8. `HbmAndBandwidthWall.tsx:213` — "150 W or more" per-accelerator HBM power number **uncited**. Either cite or soften to qualitative phrasing.
9. `HbmAndBandwidthWall.tsx:163-165` — FP8 3,958 TFLOPS, BF16 1,979 TFLOPS, NVLink 900 GB/s have no inline link in the ColumnLayout; reader has to infer from the earlier table. Add a parenthetical H100 product-page link.
10. `HbmStackDiagram.tsx:180` — PHY pin-speed annotation bundles HBM3 and HBM3e as `~6.4 / 8-9 Gb/s` without tagging which is which; small clarity loss vs the prose.

## 10. Recommended corrections (minimal fixes only)

1. Expand HBM on first use in the H1 or the opening paragraph: "HBM (High Bandwidth Memory) and the bandwidth wall" / "On modern accelerators, HBM (High Bandwidth Memory) decode throughput...".
2. Expand DRAM, SXM, DIMM, SM at their respective first occurrences. One parenthetical each. No other prose changes.
3. Add a JEDEC HBM3 citation link (Tier 1) next to the "1,024 bits of data per stack... sixteen 64-bit channels... 6.4 Gb/s range" sentence (`:91-98`). Same citation can cover the HBM3e 8-9 Gb/s range.
4. Add a JEDEC HBM4 citation next to the "2,048 bits per stack" claim (`:224-228`). If JEDEC HBM4 is not yet public as Tier 1, flag as UNKNOWN matching the Blackwell pattern.
5. Either cite the "150 W or more" figure to a Tier 1 vendor or analyst source, or rewrite to: "the HBM tier can reach the order of a hundred watts or more on a single accelerator" and mark as SPECULATIVE in a visible aside.
6. Add an inline `Link` to the NVIDIA H100 product page inside the "What stayed the same" ColumnLayout so the FLOPs and NVLink numbers carry a citation locally (`:163-165`).
7. In `HbmStackDiagram.tsx:180`, split the PHY annotation into two tspans: "HBM3 ~6.4 Gb/s per pin" and "HBM3e ~8-9 Gb/s per pin".

No rewrites. No new sections. All fixes are single-line or single-paragraph edits.

## 11. One-line summary

Section is structurally on the EFA bar and numerically honest (including a clean UNKNOWN for Blackwell), but needs acronym expansions on first use and Tier 1 JEDEC citations behind the load-bearing HBM structural numbers before it fully passes the project's sourcing rule.
