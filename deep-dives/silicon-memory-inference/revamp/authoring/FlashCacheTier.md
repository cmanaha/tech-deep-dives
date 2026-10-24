# Change report: FlashCacheTier (nav id `flash-cache-tier`)

New section, written from `research/2026-10-refresh/flash-cache-tier.md` (all 160 rows and the UNKNOWN register read), with cross-register IDs resolved in `01-memory.md`, `02-nvidia.md`, `05-workloads.md` and `hbf.md`. Nothing committed.

Files (paths relative to the dive root):
- `src/sections/FlashCacheTier.tsx`: replaces the stub, export `FlashCacheTier` kept. 539 lines.
- `src/components/FlashTierLadder.tsx`, `FlashBreakEvenChart.tsx`, `FlashMemoryClock.tsx`, `FlashBlockIoDiagram.tsx`: four inline SVG diagrams, no new dependency.
- `src/sources/FlashCacheTier.ts`: 55 records.

## Shape

| Block | Payoff (h2 description, abridged) | Diagram |
| --- | --- | --- |
| h1 intro | What a flash cache tier is, why it matters (break-even 17 GB/s per node, about 2 per GPU; HBM about 105 s vs instance store about an hour), HBF contrast in one paragraph | Tier ladder |
| When reading KV beats recomputing it | One ratio and one number tell you whether a tier is fast enough | Break-even chart (log y, log x) |
| How long each tier remembers | Match the tier to the gap between turns or tool calls | Memory clock (log time) |
| The flash you already pay for on P5 and P6 | 30.4 TB per instance, what AWS rates it at, the one setting per stack | none (instance table, stack list) |
| Who moves the bytes | Page-first layouts make offload a GB/s problem; 512 B drives and GPU-initiated I/O are for KiB-wide reads | Block to I/O size |
| Sharing context across nodes | When sharing pays, FSx for Lustre at 150 GB/s per client, how to predict a vendor's 20x | none |
| Building the tier, in order | Host DRAM, then local flash with an admission filter, then shared flash; what to monitor | none |

The strongest number (break-even about 17 GB/s per 8x H100 node for a dense 70B, about 2 GB/s per GPU) lands in the h1, the first h2 description and body, the ladder diagram (dashed line), the chart callout, the P5/P6 block, and the last sentence of the section.

Length: 539 lines against a target of about 300 to 450. The stream brief requires every topic below (high-IOPS drives, GPU-initiated I/O, DPUs, CXL flash, five serving stacks, storage vendors, four AWS options, the mental model, the HBF contrast) and each diagram needs a citation caption. Cuts already made in the leverage pass: the "reading the ladder" paragraph (the diagram carries it), three vendor claims without test conditions (DDN, Pure, WEKA AMG), a stack table converted to a list, and citation lines merged. Further cuts would drop a required topic.

## Claims (new content), with source key, tier and kind

Mental model and arithmetic (all `derived`, inputs cited, assumptions in the Cite notes and the "Assumptions" ExpandableSection):
- Break-even B* = KV bytes/token x node dense FLOPS / prefill FLOPs per token; Llama 3.1 70B, 8x H100 BF16: 18.2 / 17.1 / 14.1 / 8.3 GB/s at 1K / 8K / 32K / 128K; 2.1 per GPU at 8K (M1). `llama3Herd` (T2), `llama70bApi` (T1), `h100Page` (T2, sparse to dense note). Re-computed here: all M1 to M5 values reproduce.
- Same model on 8x B200 FP8: 77.7 GB/s at 8K, 4.5x; FP8 KV 38.8 (M3). `dgxB200` (T2).
- FP8 KV plus FP8 compute leaves B* unchanged on Hopper (M2). `h100Page`.
- Qwen3-235B-A22B 66.9 / 53.8 / 32.3 / 12.4; DeepSeek-V3 14.5 / 11.8 / 7.1 / 2.8 (chart only; M4, M5). `qwen3Config`, `qwen3Readme` (T1), `deepseekV3Config` (T1), `deepseekV3Report` (T2).
- KV bytes per token per billion active parameters: 4,645 / 8,751 / 1,899 / 111, V4.1-Flash about 40x below a dense 70B (M6; the 40x ratio is new arithmetic, 4,645 / 111 = 42). `qwen3Config`, `deepseekV41Flash` (T1).
- Worked example M7 (2.68 GB, 1.24 PFLOP, 0.157 s / 0.314 s; fetch 0.149 / 0.215 / 0.018 / 0.0067 / 0.0052 s). `ec2AcceleratedSpecs` (T1) with the tier-rate note.
- Mooncake cross-check: 6 GB/s (8x A800), 19 GB/s (8x H800), `mooncakeFast` (T1, measured). The register's own 5.4 GB/s A800 figure was not used: its 312 TFLOPS A800 input has no source in the register.
- Memory horizons R1, R2: 105 s / +176 s / about 3,560 s at 26,000 tokens/s (assumptions printed in the SVG and the note). `ec2AcceleratedSpecs`, `vllmCacheConfig` (T1, 0.92 default).
- 30.4 TB holds 34 billion tokens of V4.1-Flash KV (R7). `deepseekV41Flash`.
- Instance-store floor 18.0 GB/s, 2.25 per GPU; P6e-GB200 10.4 / 2.6; trn2 7.0 / 0.44 (A10). `ec2AcceleratedSpecs`.
- Block arithmetic B2, B4, B5: 5.24 MB per node, 655 KB per GPU, 8 KiB per layer; 2.2 M IOPS at 8 KiB vs 27,000 at 655 KB. `llama3Herd` (shape).
- 10 M x 512 B = 5.1 GB/s (D22); Micron 9650 4 KiB = 22.5 GB/s of 28 (D21). `kioxiaGp1`, `micron9650`.
- FSx: 150 TiB of PERSISTENT-1000 to feed one client (A18). `fsxSsd` (T1).
- 1 DWPD 30.72 TB drive absorbs about 356 MB/s (D23; the register's "over 5 years" dropped, no warranty term cited). `micron9650`.
- VAST cross-check V7: 516,096 B/token, 65.6 GB, 2.65 s at 198 Gb/s, FP16 KV assumed. `llama3Herd` (shape, fetched; resolves U14).
- HBF stack at 1.6 TB/s is about 700x the instance-store per-GPU floor (H5). `sandiskHbf`.

Specs and measurements:
- Instance store 8 x 3,800 GB, 4.4 M / 4 KiB IOPS on P5 to P6-B300; P6e-GB200 3 x 7,500 GB, 2.55 M; trn2 4 x 1,900 GB, 1.72 M; EBS caps 10,000 / 12,500 / 7,500 MB/s; host memory 2,048 GiB on p5en and P6-B200; network 3,200 / 6,400 Gb/s (A1 to A6, A11, A12, L2). `ec2AcceleratedSpecs` (T1, spec). P6e UltraServer 405 TB: `p6Page` (T2).
- Instance store is included in the instance price; data does not survive stop, hibernation or termination. `instanceStore`, `instanceStoreLifetime` (T1, fetched 2026-10-17; new sources, the register asserted "wiped at stop" against the spec page, which does not carry it).
- FSx for Lustre per-client 100 / 700 / 1,200 Gb/s; GDS clients; Trn2 EFA exclusion; PERSISTENT-1000 1,000 MB/s per TiB (A14 to A17). `fsxPerformance`, `fsxEfa`, `fsxSsd` (T1).
- S3 Express One Zone single-digit ms (A19). `s3Express` (T1).
- KVBM tiers and knobs, sizing guidance, NCCL MLA mode, "alternatives, not cache layers to stack" (S1 to S3, S7, M5). `dynamoKvbmDocs` (T1; sizing guidance is vendor guidance, written with "recommends").
- KVBM disk filter: written on second sighting, 600 s decay, code-derived and labelled "read from the code at v1.5.1 ... the docs say only that the filter can be disabled" (S5, source-authority category C). `dynamoKvbmCode` (T1). KVBM `page_size = 32` (B1), same file.
- Dynamo router weights 0.75 / 0.25, labelled "read from the code" (S6). `dynamoRouterCode` (T1).
- NIXL plugins (obj, libfabric EFA mapping) (S8, S10). `nixl` (T1).
- HiCache tiers, L3 backends, "the job of L3", page_first, page size 64 (S11, S14, B1). `sglangHicache` (T1).
- vLLM `secondary_tiers` `type: fs` (S17), llm-d EFS Max I/O and no eviction (S18, S19), hit-rate recipe (S16). `llmd` (T1).
- vLLM offload metrics (S16), `DEFAULT_BLOCK_SIZE` 16 (B1). `vllmOffloadMetrics`, `vllmCacheConfig` (T1).
- LMCache per-GPU disk path, 256-token chunks in example configs (S21). `lmcache` (T1). Fetched the local-storage doc at tag v0.5.6: it says "assign each GPU its own disk path" and shows 256 only in example configs, so the page says "example configurations" rather than "default".
- GDS definition, compatibility mode, P2PDMA from CUDA 12.8 with `use_pci_p2pdma` (P1 to P3, A28). `gdsOverview`, `gdsReleaseNotes` (T1).
- BaM: GDS fills Gen4 x16 at 32 KiB+, 23.6% at 4 KiB; about 25 GB/s from four SSDs at 4 KiB (P9). `bam` (T1, measured).
- SCADA control path split (P13, P15). `storageLender` (T1), `nvidiaStorageBlog` (T2, vendor-claim).
- Micron 9650 / 9550 figures (D1 to D3, D6). `micron9650` (T1 brief, vendor-claim).
- Kioxia GP1 10 M IOPS at 512 B, 50 DWPD, samples end 2026, 100 M target; Storage-Next; SK hynix AI-N P samples end 2026 (D11, D12, D14, D19). `kioxiaGp1` (roadmap), `kioxiaStorageNext`, `skhynixAin` (T2, roadmap).
- Samsung CMM-H prototype: 4.5 GB/s vs 219 GB/s DDR5; 99.99th about 450 ns in cache, about 15 µs at 32 GB regions (P27, P28). `cmmH` (T1, measured).
- CMX G3.5, BlueField-4 800 Gb/s, KV "transient, derived, and recomputable if lost", up to 5x, 2H 2026 (P19, P20, P22, P23, P25). `cmxBlog`, `dpuPage`, `cesRelease` (T2; vendor-claim and roadmap).
- Agentic reuse: 85% to 97%, 11.7x, 2 to 30 s, reasoning about 40% (S29, R3). `dynamoAgenticBlog` (T2, measured by NVIDIA authors; attribution kept in the sentence).
- Mooncake: local DRAM about 50% of theoretical hit rate; 115% / 107% (FAST) vs 75% (arXiv v4), both versions named; trace 30% to 50%, over half the blocks never reused (S23 to S25). `mooncakeFast`, `mooncakeArxiv` (T1, measured).
- DeepSeek disk cache "within a few hours to a few days"; hit priced at 1/50 to 1/30 of miss (S27, S28). `deepseekCaching`, `deepseekPricing` (T1).
- HyperPod managed tiered KV cache: L1/L2, `tieredstorage` recommended or `redis`, `kvCacheSpec.enableL2Cache`; docs "a pooled memory tier that spans cluster nodes" (re-fetched and confirmed on `hyperpodKvDocs` 2026-10-17) vs What's New "automatic tiering from CPU memory to local SSD", both sources named because they disagree; 64K context TTFT P50 -94%, throughput +38% (A21 to A23, A25). `hyperpodKvDocs` (T1), `hyperpodWhatsNew`, `hyperpodBlog` (T2, vendor-claim).
- VAST + CoreWeave 62 s vs 3 s, 2 x 100 Gb/s NFS, 198 Gb/s peak (V5); page-first batching (V6). `vastBlog` (T2, vendor-claim).
- Nebius + WEKA: 93% vs 40% hit rate, p95 3.82 s vs 23.12 s, 3.7x (V3, V4). `nebiusWeka` (T2, vendor-claim).
- HBF: 512 GiB per 16-high stack, 0.384 to 3.072 TB/s (H1) `ocpHbfSpec` (T1); 1.6 TB/s (H2) `sandiskHbf` (T2, vendor-claim, noted not shipping); per-token KV "infeasible" (H4) `maPatterson` (T1). Records reuse the URL, title, publisher and tier from `HighBandwidthFlash.ts`.

Tier choices to note: `llama3Herd` (Meta, arXiv:2407.21783, fetched) is Tier 2, matching the dive's precedent for a model maker's own technical report (`DeepSeek-V3 Technical Report` is Tier 2 in 01-memory.md and `HighBandwidthFlash.ts`). Every other record reuses its register tier; the tier-consistency test passes.

## Register rows not used, and why

- D7 to D10, D16 to D18, D20 (Samsung PM1763, Solidigm, Kioxia CM9, XL-FLASH die latency, SK hynix Tier 3 IOPS targets): one Gen5/Gen6 drive pair (Micron) carries the device model; the rest add numbers without a new idea, and D9 and D20 are Tier 3.
- P4 (GDS "at least twice"), P5, P7, P10 to P12, P14, P16 to P18 (BaM 45.8 M IOPS, cuFile open source, SCADA Server SDK, Micron 230 M IOPS): mechanism history or roadmap software that changes nothing the reader does today; P17 and U13 (cuFile code not yet published) stay in the register.
- P26 (BlueField-4 CPU): Tier 3 and UNKNOWN at Tier 1 and 2.
- P29 (CMM-D latency): owned by "DDR5, MRDIMM, LPDDR5X and CXL".
- S4, S9, S12, S13, S15, S20, S26 (O_DIRECT knob, NIXL CRT client, HiCache prefetch and write policies, HiCache blog multipliers, llm-d Mooncake sizing, 3FS 40 GiB/s): internals or configuration detail beyond the one-line "which setting turns it on" level; they belong to the vLLM dive's offload section.
- V2, V8, V10 (WEKA AMG, DDN Infinia, Pure KVA): written, then cut in the leverage pass; they repeat the "vendor number against a recompute baseline" pattern without the four numbers the page asks for. V9 (Tier 3), V11 and V12 (Hammerspace checkpoint, not KV), V13 (folded into CMX), V14 (NetApp, UNKNOWN).
- A7 (p5.4xlarge), A13 (P5en "up to 4x" claim), A24, A26 (HyperPod Ray Serve LMCache URL, Curvine blog): secondary to the managed and self-managed paths shown.
- A20 LMCache S3 backend: the cited LMCache docs (local storage, GDS, HyperPod) do not show an S3 backend, so the S3 sentence names only KVBM G4 and NIXL `obj`.
- L1 to L7 ladder: B300 HBM and P6 capacities omitted; the ladder is drawn for p5en.
- H3 (HBF sample dates) and H6 (retention): the HBF status is the HBF section's to state; the HBF register and its sources include later reports moving dates, so this section says only "roadmap part".
- The register's ladder summary "gains one to two orders in capacity" is wrong for HBM to host DRAM (141 GB to 256 GiB is about 2x); the page used the computed 2x and 14x and then cut the paragraph, leaving the diagram to carry it.

## UNKNOWNs and how the page handles each

- U1 (instance-store large-I/O GB/s): "AWS publishes no large-I/O GB/s for instance store"; the floor is labelled "IOPS-implied", the ladder says "ceiling unpublished", and the ExpandableSection gives the `fio` measurement.
- U2 (drive model): `nvme id-ctrl` and `lspci -vv` in the same list.
- U3 (GDS P2P on Nitro NVMe): "No AWS document located in this research says this works on instance-store NVMe"; compatibility mode and `gdscheck -p` given.
- U4 (Trn3, P6e-GB300 instance store): "AWS lists no instance-store figure for Trn3 or P6e-GB300 on the EC2 specification page or the Trn3 product page."
- U5 (HyperPod SSD tiering): docs vs What's New both quoted; "treat flash inside it as undocumented".
- U6 (CMX on AWS): "No AWS offering of it was located in this research."
- U7 (independent vendor measurement): "No independent measurement of any of these products was located in this research."
- U8 (512 B drives on KV): "No primary source located in this research measures them on a KV workload."
- U9 (prefill MFU): every break-even line at 100% of dense peak, stated in the chart, caption and text; "at 50% MFU every line halves".
- U14 (Llama 3.1 405B config): resolved by fetching the Llama 3 paper, Table 3 (126 layers, 128 heads, 8 KV heads, dimension 16,384; the 70B column confirms 80 layers, 64 heads, 8 KV heads).
- U15 (bytes written per day in production): the page gives only the endurance budget and tells the reader to watch store bytes.
- U16 (effective host-to-GPU bandwidth): the ladder and notes say "PCIe Gen5 x16 line rate" and "before encoding".
- U10, U11, U12, U13: their rows are not used.

## Diagrams and the rendered check

All four: `role="img"`, `aria-labelledby` with a unique `<title>` id stating the assertion, `viewBox` only, `width: 100%`, `height: auto`, full-bleed white background rect, fonts 11 to 14 px sans-serif, diagram-unique class prefixes (`ftl-`, `fbe-`, `fmc-`, `fbi-`). Aspect ratios: ladder 860 x 420 (2.05), break-even 860 x 460 (1.87), clock 860 x 392 (2.19), block I/O 860 x 420 (2.05). Log axes computed in the component with `Math.log10`; no D3 or other dependency. Each keeps the dive's 640 px minimum width inside an `overflowX: auto` wrapper (the Hopper and Blackwell pattern), so at 390 px the text renders near 8 px and the diagram scrolls sideways.

`scripts/shoot.mjs --sections flash-cache-tier --widths 1440,390`: "4 diagram(s), ok" at both widths on the final build (no overlapping text, no text out of its box, no viewBox clipping, no page-level horizontal overflow). PNGs read at both widths:
- Ladder: bars, inside labels and capacity column clear; the dashed break-even line meets the end of the instance-store bar, as intended; outside labels start right of the line.
- Break-even chart: legend, tick labels and the five right-margin band labels clear, including the close pairs (host DRAM 512 / EFA 400, instance store 18 / EBS 12.5); the 8K callout sits in clear space above the Hopper line.
- Memory clock: tier rows, the two reuse ranges and the axis labels clear; the DeepSeek range is drawn at 3 hours to 3 days to place the quoted words on the axis (the header comment says so).
- Block I/O: three panels and the bottom IOPS band clear; panel text fits its boxes.
- At 390 the tables scroll inside their containers and prose wraps; nothing overflows the page.

## Leverage pass: assertions added beyond the register, each with its source

- Instance store included in the instance price: `instanceStore` (fetched 2026-10-17).
- Instance-store data does not survive stop, hibernation or termination: `instanceStoreLifetime` (fetched 2026-10-17).
- Llama 3.1 70B and 405B layer and head counts: `llama3Herd` Table 3 (fetched 2026-10-17).
- LMCache 256-token chunks appear in example configurations: `lmcache` local-storage doc (fetched 2026-10-17).
- HyperPod docs quote "a pooled memory tier that spans cluster nodes" sits on the managed tiered KV cache page: `hyperpodKvDocs` (re-fetched 2026-10-17).
- V4.1-Flash bar about 40x below a dense 70B: derived from M6 (4,645 / 111).
- "Our reading" sentences (HBF serves bytes read every step, a flash cache tier bytes read once per hit; the tier-to-gap mapping): the register's own derivations (section 7, R6), labelled as our reading or written as guidance.
- "If the hit rate climbs and TTFT does not fall, compare the tier's bandwidth with the break-even": guidance that connects S16 to M1; no new fact.
No other assertion is outside the register.

## For the orchestrator (shared files)

- `sources.md` needs regenerating: the snapshot test fails only because it was generated from an earlier draft of `FlashCacheTier.ts` that still held DDN, Pure, WEKA AMG and the Sandisk and SK hynix MOU records, now removed. The tier-consistency test passes.
- Cross-link names used: KV Cache and FlashAttention; High Bandwidth Flash; DDR5, MRDIMM, LPDDR5X and CXL; Disaggregated Serving and Speculative Decoding; the EFA dive (`../efa/`); the vLLM dive (`../vllm/`) section named by its h1, "KV-Cache Offloading & LMCache" (the brief's table calls it "KV Offloading and LMCache").
- Glossary acronyms expanded in this section:
  - NVMe: Non-Volatile Memory Express
  - HBM: High Bandwidth Memory
  - KV: key-value (cache)
  - HBF: High Bandwidth Flash
  - OCP: Open Compute Project
  - EFA: Elastic Fabric Adapter
  - EBS: Elastic Block Store
  - IOPS: I/O operations per second
  - GDS: GPUDirect Storage
  - MFU: Model FLOPs Utilization
  - BF16: bfloat16
  - MoE: Mixture of Experts
  - MLA: Multi-head Latent Attention
  - KVBM: KV Block Manager (NVIDIA Dynamo)
  - P2PDMA: (PCI) peer-to-peer DMA
  - DMA: direct memory access
  - SCADA: scaled, accelerated data access (NVIDIA)
  - TLC: triple-level cell
  - DWPD: drive writes per day
  - CXL: Compute Express Link
  - TTFT: time to first token
  - NIXL: NVIDIA Inference Xfer Library
  - EFS: Elastic File System
  - NFS: Network File System
  - CMX: (NVIDIA) context memory storage
  - DPU: data processing unit
