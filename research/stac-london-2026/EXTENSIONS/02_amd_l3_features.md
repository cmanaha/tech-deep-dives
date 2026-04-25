# AMD EPYC Turin — L3 cache features and kernel integration
Access date: 2026-04-24

## Sources fetched [URL + tier]

**[AUTHORITATIVE — Tier 1, AMD first-party]**
- AMD Smart Data Cache Injection (SDCI) White Paper, publication #58725 — https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/white-papers/58725.pdf (PDF; direct fetch timed out, content recovered via search-engine excerpts that quote the paper verbatim and via AMD's PQOS White Paper #69127 which references it).
- AMD64 Architecture Programmer's Manual Volume 2: System Programming, Publication #24593 Rev. 3.41, §19.4.7 "L3 Smart Data Cache Injection Allocation Enforcement (SDCIAE)" — referenced normatively by SDCIAE patch series.
- AMD EPYC 9005 Processor Architecture Overview, publication #58462 — https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf (PDF fetch timed out; cited indirectly).
- AMD EPYC 9005-series product page — https://www.amd.com/en/products/processors/server/epyc/9005-series.html
- AMD PQOS White Paper for EPYC 9004 and 9005, publication #69127 — https://docs.amd.com/api/khub/documents/VuNrmUG_yfhPVgGYcFlkZg/content

**[UNOFFICIAL — Tier 2, AMD employees in non-formal venues]**
- Linux Plumbers Conference 2024, "Enabling PCIe TPH in Linux for Smart Data Cache Injection," Wei Huang (AMD) — https://lpc.events/event/18/contributions/1973/ (slides PDF returned 404; abstract-level quotes via LPC indico and patch cover letters).
- Babu Moger (AMD) Linux kernel patch series cover letters for SDCIAE — https://patchew.org/linux/cover.1752167718.git.babu.moger@amd.com/

**[SECONDARY — Tier 3, third-party press / forums]**
- Phoronix: "AMD Preparing Linux For Smart Data Cache Injection With 'Upcoming' CPUs" — https://www.phoronix.com/news/AMD-EPYC-SDCI-Cache-Injection (403 on direct fetch; content via WebSearch summaries).
- Phoronix: "PCIe TPH Coming With Linux 6.13 To Further Enhance 5th Gen AMD EPYC Performance" — https://www.phoronix.com/news/PCIe-TPH-For-Linux-6.13
- Phoronix: "AMD SDCIAE Working Its Way Into The Linux 6.19 Kernel" — https://www.phoronix.com/news/AMD-SDCIAE-Linux-6.19
- LWN: "Support L3 Smart Data Cache Injection Allocation Enforcement (SDCIAE)" — https://lwn.net/Articles/1007283/
- Chips and Cheese: "AMD's Turin: 5th Gen EPYC Launched" — https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched
- Chips and Cheese: "AMD's EPYC 9355P: Inside a 32 Core Zen 5 Server Chip" — https://chipsandcheese.com/p/amds-epyc-9355p-inside-a-32-core
- Chips and Cheese: "Evaluating Uniform Memory Access Mode on AMD's Turin" — https://chipsandcheese.com/p/evaluating-uniform-memory-access
- ServeTheHome: EPYC 9005 Turin launch coverage — https://www.servethehome.com/amd-epyc-9005-turin-turns-transcendent-performance-solidigm-broadcom/
- Tom's Hardware: "New Zen 5 128-core EPYC CPU wields 512MB of L3 cache" — https://www.tomshardware.com/pc-components/cpus/new-zen-5-128-core-epyc-cpu-weilds-512mb-of-l3-cache
- Wikipedia: Zen 5 — https://en.wikipedia.org/wiki/Zen_5

## Key findings

1. **[AUTHORITATIVE]** AMD's analog of Intel DDIO is named **Smart Data Cache Injection (SDCI)**. AMD White Paper #58725 defines it as "a mechanism that enables direct insertion of data from I/O devices into the L3 cache. By directly caching data from I/O devices rather than first storing the I/O data in DRAM, SDCI reduces demands on DRAM bandwidth and reduces latency to the processor consuming the I/O data." [AMD WP #58725, recovered via patchew cover letter quoting it verbatim and via LWN/Phoronix].

2. **[AUTHORITATIVE]** SDCI rides on the PCIe-standard **TLP Processing Hints (TPH)** feature: endpoint devices embed **Steering Tags (STs)** in TLP headers; the Root Complex uses the ST to choose where the inbound DMA write lands in the cache hierarchy. Linux kernel support for the underlying PCIe TPH plumbing landed in **Linux 6.13** (late 2024). Kernel commit 48d0fd2b903e3 ("PCI/TPH: Add TPH documentation") is the reference.

3. **[AUTHORITATIVE]** **L3 SDCI Allocation Enforcement (SDCIAE)** is a Platform-QoS Extension defined in AMD64 APM Vol. 2 §19.4.7. AMD: SDCIAE "allows system software to control the portion of the L3 cache used for SDCI devices. When enabled, SDCIAE forces all SDCI lines to be placed into the L3 cache partitions identified by the highest-supported `L3_MASK_n` register, where n is the maximum supported CLOSID." This is cache partitioning specifically for injected I/O lines, layered on top of existing PQOS/CAT machinery.

4. **[UNOFFICIAL/SECONDARY]** The Linux 6.19 merge window targets the **resctrl `io_alloc`** interface for SDCIAE: `/sys/fs/resctrl/info/L3/io_alloc` (enable/disable) and `/sys/fs/resctrl/info/L3/io_alloc_cbm` (per-device Capacity Bit Masks). Initial driver consumers are network drivers (Broadcom BNXT was the bring-up driver demonstrated by AMD).

5. **[UNOFFICIAL]** There is a documented **L2-vs-L3 placement nuance**. The LPC 2024 abstract states: "New AMD hardware, by leveraging TPH, will support smart data cache injection where DMA data will be prefetched into **L2 cache of target CCXs** rather than DRAM." [LPC 2024, Huang]. The AMD SDCI White Paper #58725 and the SDCIAE architectural definition consistently say **L3**. Reading the two together: the steering decision picks the target CCX, the line is delivered into the CCX's caches, and SDCIAE specifically enforces the L3 portion. Treat L2-vs-L3 wording as cache-hierarchy-of-the-target-CCX rather than two separate features. [SPECULATIVE on the reconciliation; the L3 framing is the architectural one.]

6. **[AUTHORITATIVE]** **L3 hierarchy on Turin (Zen 5)**: 32 MB L3 per CCD shared across the CCD's cores. Zen 5 CCD = 8 cores × 32 MB. Zen 5c CCD = 16 cores × 32 MB (denser cores, same L3 slice). Top SKU EPYC 9755 = 16 × Zen 5 CCDs = **512 MB total L3** (128 cores). Top Turin Dense SKU EPYC 9965 = 12 × Zen 5c CCDs = **384 MB total L3** (192 cores). [AMD product page; corroborated by Wikipedia citing AMD Tech Day, Tom's Hardware, Chips and Cheese.]

7. **[SECONDARY]** Chips and Cheese measures "L3 latency reduced by ~3.5 cycles" vs Zen 4, L2 unchanged at 1 MB but raised from 8-way to 16-way associativity, L1d up from 32 KB to 48 KB, L1i unchanged at 32 KB. CCD-to-IOD link is "GMI-Wide" 64 B/cycle each direction; GMI write width doubled to 32 B per link on server (vs 16 B on desktop Zen 5). No new L3-specific prefetcher type was announced for Zen 5 distinct from Zen 4 in the materials reviewed. [Chips and Cheese, Wikipedia citing AMD Tech Day.]

8. **[AUTHORITATIVE/SECONDARY]** Workload rationale for the very large L3: AMD positions Turin's "up to 5x the L3 cache/core" advantage over 5th Gen Xeon for cache-resident working sets. Documented beneficiaries include in-memory analytics, KV/key-value caches (LLM inference KV cache, Redis-class workloads), graph databases, recommender systems, and SPEC integer workloads with large reuse footprints (Chips and Cheese's NPS-mode analysis shows EPYC 9575F's high clock pays off when the workload stays L3-resident). [AMD 9005 product page; Chips and Cheese Turin pieces.]

9. **[AUTHORITATIVE]** No CXL Type 1/2/3 → L3 path is announced. Turin supports CXL 2.0 Type-3 memory-expansion devices over PCIe Gen5; cache-coherent device path (Type 1/2) is not advertised as a feature for SP5 Turin. SDCI/TPH covers the PCIe DMA-write path only.

10. **[SECONDARY]** "Memguard"-style L3 partitioning on AMD is delivered through **PQOS/L3 CAT** (Cache Allocation Technology) — not branded "Memguard" by AMD. SDCIAE is the Turin-era extension that lets the same masks govern I/O-injected lines.

## What is Carlos likely remembering?

**Smart Data Cache Injection (SDCI), formalized at L3 by SDCIAE, riding on PCIe TPH Steering Tags.** This is the AMD-branded analog of Intel DDIO. It is the kernel-relevant feature where "the kernel can pick up data and route it directly to L3" — except more precisely: the **NIC/storage device** writes a steering-tagged TLP, the **Root Complex** routes the DMA write into the L3 of the target CCX, and the **kernel** (via `resctrl/io_alloc`) controls which L3 ways are eligible. The kernel doesn't move bytes; it configures the hardware policy.

Citation: AMD White Paper #58725 "Smart Data Cache Injection (SDCI)"; AMD64 APM Vol. 2 #24593 §19.4.7 SDCIAE; PCIe TPH support upstreamed in Linux 6.13; SDCIAE/`io_alloc` targeted for Linux 6.19.

Of the eight candidates Carlos listed: candidate **#1 (DDIO analog)** and **#3 (cache stashing via PCIe DMA)** are the same feature under AMD's name (SDCI). Candidate **#7 (Linux L3 cache injection support on AMD)** is the kernel surface (`resctrl/io_alloc`). Candidates #2, #4, #5, #6, #8 are distinct topics with no equivalent Turin-specific announcement in the sources reviewed.

## UNKNOWN

- The exact SKU floor for SDCI support on Turin. Patches say "upcoming AMD hardware"; SDCI was originally announced for Genoa(X)/Bergamo. AMD has not published a clear SKU support matrix in the sources reviewed.
- Whether SDCI on Turin can target L2 directly under any configuration (LPC abstract says L2; AMD WP #58725 and SDCIAE say L3). Architectural document is the higher tier; treat L3 as canonical until WP #58725 is read in full.
- Verbatim text inside AMD WP #58725 PDF and Architecture Overview #58462 PDF — direct fetch timed out repeatedly. Quotes above are recovered from AMD-authored kernel patch cover letters that cite the WP, and from the PQOS WP #69127 cross-reference. Carlos should re-fetch the PDFs from a stable network before quoting in Section 10.
- Whether Zen 5 introduces any **new** L3-targeted hardware prefetcher type vs Zen 4. AMD references "increased data prefetching" in Tech Day materials but no specific new L3 prefetcher is named in the sources reviewed.
- Confirmed Linux 6.19 release date and whether SDCIAE landed without rework.

## Direct quotes worth using verbatim

> "Smart Data Cache Injection (SDCI) is a mechanism that enables direct insertion of data from I/O devices into the L3 cache. By directly caching data from I/O devices rather than first storing the I/O data in DRAM, SDCI reduces demands on DRAM bandwidth and reduces latency to the processor consuming the I/O data."
> — AMD Smart Data Cache Injection White Paper, publication #58725 [AUTHORITATIVE]

> "SDCIAE forces all SDCI lines to be placed into the L3 cache partitions identified by the highest-supported `L3_MASK_n` register, where n is the maximum supported CLOSID."
> — AMD64 APM Vol. 2 #24593 §19.4.7, quoted in SDCIAE Linux patch cover letter [AUTHORITATIVE]

> "TPH (TLP Processing Hints) is a PCIe feature that allows endpoint devices to provide optimization hints for requests that target memory space. These hints, in a format called Steering Tags (STs), are embedded in the requester's TLP headers, enabling the system hardware, such as the Root Complex, to better manage platform resources for these requests."
> — AMD Linux kernel TPH patch series, Wei Huang [UNOFFICIAL — AMD employee, kernel mailing list]

> "New AMD hardware, by leveraging TPH, will support smart data cache injection where DMA data will be prefetched into L2 cache of target CCXs rather than DRAM."
> — Linux Plumbers Conference 2024, "Enabling PCIe TPH in Linux for Smart Data Cache Injection" [UNOFFICIAL]

> "Smart Data Cache Injection (SDCI) which allows direct insertion of data from I/O devices into L3 cache could be a huge gain for low latency network IO workloads. It's similar to Intel's Data Direct I/O (DDIO)."
> — ServeTheHome, EPYC 9005 Turin launch coverage [SECONDARY]
