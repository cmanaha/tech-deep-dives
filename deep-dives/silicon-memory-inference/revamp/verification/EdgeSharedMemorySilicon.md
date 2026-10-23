# Verification: Edge Shared-Memory Silicon (DGX Spark and Jetson)

Verified: 2026-10-23. Claims checked: 72 (sampled: 0; every new or changed claim, every diagram
figure and the Tier 0 capture were checked against the source). Confirmed 64, wrong 3,
unsupported 4, mislabelled 1, unverifiable 0.

Every source was fetched today with curl's default User-Agent or WebFetch. No request carried a
name, email address or account detail. No site refused, so no archived copy was needed.

## Gate 3 score: 8/10

The section gives the reader a working model: one LPDDR pool, capacity decides what fits,
273 GB/s decides decode speed, and the CPU-GPU link and the direction of coherence decide what
sharing costs. It also gives concrete checks: size against 122 GB, check the Orin power mode,
read FLOPS as sparse, re-measure on the current build. After fixes nothing load-bearing is wrong.
The wrong items were a T4000 bandwidth "gap" that NVIDIA's own table fills, a rounding slip, and
a capture date that disagreed with the image's own stamp. Economy holds the score at 8: the same
128 GB / 273 GB/s pair appears in the intro, the four-scales paragraph, the diagram, the table
and the lens, and the four-scales block carries three peripheral products.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 64 of 72 confirmed. The 8 fixes: T4000 bandwidth listed as unpublished (it is 273 GB/s), "near 25" for 25.5, caption date, 130 TB/s without a direction, "coherent memory" not on the GB200 page, an unscoped "no dense figure published", the 31 TFLOPS FP32 attributed to all three sources, and the MAXN_SUPER name cited to a page that never uses it. None changes a sizing decision |
| Mental model or practical value | 9 | Every block earns its place. The decode table plus the roofline check let a reader predict tokens/s from GB/s. The coherence blocks explain why Orin still pays for cache maintenance and Spark and Thor do not. The lspci note stops a false "NIC missing" diagnosis |
| Shape | 8 | Introduces both machines before dissecting them. 273 GB/s lands repeatedly. Clustering and open items are demoted into ExpandableSections. Ends on the evaluation lens. One h2 description, "The rack-scale coherent-memory idea at desk and robot scale, and the sections that explain its parts", names the topic rather than the payoff |
| Writing | 8 | no-ai-tells exits 0. Attribution in sentences is load-bearing: vendor claims ("NVIDIA reports 55.37"), the porting-guide conflict, and the silences ("NVIDIA publishes no CPU clock in ..."). The "Background:" paragraph is a list of cross-references |
| Economy | 7 | +16% words (2,138 to 2,482, author's count), within the brief. The 128 GB / 273 GB/s pair repeats beyond the one deliberate repeat. RTX Spark, T4000 and Orin Nano 2 add three sentences to a block whose point is the scale ladder |
| Diagrams | 9 | Both are SVG with `role="img"` and a titled `aria-labelledby`. The probe reports "2 SVG diagram(s), 0 React Flow, ok" at 1440 and 390. At 1440 the three panels are clean, with no text on lines. At 390 both scroll sideways (640 px and 1000 px minimum widths) and stay legible |

## Claims

Source keys refer to `src/sources/EdgeSharedMemorySilicon.ts`. "HC p.N" is the page in the Hot
Chips 2025 GB10 PDF (14 pages).

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Spark CPU: 20 Arm cores, 10 Cortex-X925 and 10 Cortex-A725 | sparkHardware | CONFIRMED | "20-core Arm processor (10 Cortex-X925 + 10 Cortex-A725)" | |
| 2 | Spark GPU: Blackwell, 6,144 CUDA cores (table, diagram) | sparkHardware | CONFIRMED | "CUDA Cores: 6,144" | |
| 3 | Spark up to 1 PFLOP FP4, sparse (table, warning Alert) | sparkHardware, sparkProductPage | CONFIRMED | "up to 1 PFLOP (petaFLOP) at FP4 precision with sparsity"; the product page footnote reads "Theoretical FP4 TOPS using the sparsity feature." | |
| 4 | Table cell: "no dense figure published" | sparkHardware, gb10HotChips | UNSUPPORTED (hedge scope) | None of the three sources gives a dense figure. That supports "not in these sources", not "not published" | Scoped: "no dense figure in NVIDIA's spec pages or Hot Chips slides" |
| 5 | Cite note: Hot Chips gives "AI: 1000 TOPS NVFP4" and "CUDA: 31 TFLOPS FP32", no dense FP4 | gb10HotChips | CONFIRMED | "CUDA: 31 TFLOPS (fp32)", "AI: 1000 TOPS NVFP4" (HC p.7) | |
| 6 | Spark memory: 128 GB LPDDR5X, or 64 GB from OEM partners only; 256-bit | sparkProductPage, sparkHardware | CONFIRMED | "Available in 64 GB* or 128 GB"; "*64 GB memory configuration is available exclusively through participating OEM partners"; "256-bit interface" | |
| 7 | Spark 273 GB/s (intro, table, diagram, lens) | sparkHardware | CONFIRMED | "Memory Bandwidth: 273 GB/s"; "16 channels (256 bit) LPDDR5X 8533" | |
| 8 | Spark power: 240 W supply, 140 W SoC TDP, 100 W for the rest of the system | sparkHardware | CONFIRMED | "240W external power supply (included) GB10 SOC Thermal Design Power (TDP) is 140W 100W is available for other system components (ConnectX-7, Wi-Fi, SSD, USB-C, etc.)" | |
| 9 | Spark $4,699 Founders Edition, MSRP as of 23 February 2026 | sparkPriceChange | CONFIRMED | Post titled "2/23/2026 Price Change Announcement" (NVIDIA staff, 2026-02-25): "The MSRP for DGX Spark (Founders Edition) has been adjusted from $3,999 to $4,699" | |
| 10 | 64 GB OEM units from $4,999, on sale from 23 October 2026 | spark64Gb | CONFIRMED | "DGX Spark 64GB is available from Acer, ASUS, Dell, Gigabyte, HP and MSI on Friday, Oct. 23, starting at $4,999." | |
| 11 | 64 GB Spark rated up to 100B; two 64 GB units up to 1.7x of one (Qwen 3.8 27B) | spark64Gb | CONFIRMED | "It supports up to 100-billion-parameter models"; "In NVIDIA's Qwen 3.8 27B test, two clustered 64 GB systems delivered up to 1.7x performance compared with a single system" | |
| 12 | ConnectX-7 at 200 Gbps links up to four Sparks | sparkProductPage | CONFIRMED | "ConnectX-7 NIC @ 200 Gbps"; "Up to 4 DGX Spark systems can be connected using NVIDIA ConnectX-7 networking." | |
| 13 | Two units (256 GB) up to 400B, four (512 GB) up to 700B | sparkProductPage | CONFIRMED | "2x 128 GB DGX Spark 256 GB Up to 400B parameters 4x DGX Spark 512 GB Up to 700B parameters" | |
| 14 | Hardware overview gives 405B for dual Spark | sparkHardware | CONFIRMED | "Support for AI models up to 200 billion parameters (or 405B for dual-Spark configuration)" | |
| 15 | Product page lists both memory options and one bandwidth, 273 GB/s | sparkProductPage | CONFIRMED | "System Memory 64 GB LPDDR5X* or 128 GB LPDDR5x ... Memory Bandwidth 273 GB/s" | |
| 16 | Playbook: the pair's link at 189.85 Gbps of RoCE traffic | twoSparksPlaybook | CONFIRMED | "Total throughput = 92.57 + 97.28 = 189.85 Gbps" (ib_write_bw over two interfaces) | |
| 17 | Playbook lists RoCE interfaces once cabled | twoSparksPlaybook | CONFIRMED | "rocep1s0f0 port 1 ==> enp1s0f0np0 (Up)" ... "roceP2p1s0f0 port 1 ==> enP2p1s0f0np0 (Up)" | |
| 18 | GB10 is two dielets in TSMC 3 nm on 2.5D packaging; S-dielet = CPU + memory subsystem, G-dielet = GPU (text, diagram) | gb10HotChips | CONFIRMED | "S-dielet (CPU, memory subsystem, etc.) + G-dielet (GPU core)", "Advanced 2.5D packaging", "Both S-dielet and G-dielet in TSMC 3nm" (HC p.7) | |
| 19 | NVLink-C2C "about 600 GB/s aggregate" (table :134, text, diagram :105 and :159, lens) | gb10HotChips | CONFIRMED | "GPU has access to entire system bandwidth over the C2C interface • ~600GB/s of aggregate bandwidth" (HC p.9). This is NVIDIA's own interface figure on its slides (Tier 2), with no per-direction split. It is a vendor spec, not a benchmark, so `spec` is the right kind | |
| 20 | 5x the bandwidth of PCIe Gen 5 | gb10Newsroom | CONFIRMED | "a CPU+GPU-coherent memory model with 5x the bandwidth of fifth-generation PCIe" | |
| 21 | Two-way coherence in hardware removes cache maintenance overhead (Spark) | gb10HotChips | CONFIRMED | "Hardware-enabled bidirectional coherency between CPU and GPU ... Removes the performance overhead of Cache Management Operations (CMOs)" (HC p.9) | |
| 22 | Hot Chips gives 16 MB L3 per cluster | gb10HotChips | CONFIRMED | "16MB L3 cache per cluster" (HC p.7) | |
| 23 | Porting guide: five high-performance and five high-efficiency cores per cluster | sparkPortingGuide | CONFIRMED | "Each cluster has 5 high-performance cores (ARM v9.2, Cortex-X925) with 2MB L2 cache each, and 5 high-efficiency cores (ARM v9.2, Cortex-A725) with 512KB L2 cache each." | |
| 24 | Porting guide: 16 MB to a "high-performance cluster", 8 MB to a "high-efficiency cluster" | sparkPortingGuide | CONFIRMED | "The high-performance cluster features 16MB L3 cache, while the high-efficiency cluster is equipped with an 8MB L3 cache." The URL now redirects to `.../latest/overview.html` | |
| 25 | NVIDIA publishes no CPU clock in the hardware overview, product page or Hot Chips slides (text, open item 2) | sparkHardware, sparkProductPage, gb10HotChips | CONFIRMED | No "GHz" in any of the three (the hardware overview's only clock is the memory's "4266 MHz") | |
| 26 | Thor: 14 Arm Neoverse-V3AE cores, Blackwell (table, diagram) | thorBlog | CONFIRMED | Table 1: "14-core Arm Neoverse-V3AE 64-bit CPU"; "NVIDIA Blackwell architecture GPU" | |
| 27 | Thor up to 2,070 TFLOPS FP4, sparse | thorBlog | CONFIRMED | Table 1: "2070 TFLOPS (Sparse FP4)" | |
| 28 | Thor 128 GB LPDDR5X, 256-bit, 273 GB/s | thorBlog | CONFIRMED | "128 GB 256-bit LPDDR5X, 273 GB/s" | |
| 29 | Thor 40 to 130 W | thorBlog | CONFIRMED | "Power 40 W – 130 W" | |
| 30 | Thor developer kit $5,499, as of October 2026 | jetsonFaq | CONFIRMED | "Jetson AGX Thor Developer Kit $5499". The 2025-08-25 Thor blog gave "$3,499" at launch; the page uses the current FAQ price and dates it | |
| 31 | Orin Nano Super developer kit $399 | jetsonFaq | CONFIRMED | "Jetson Orin Nano Super Developer Kit $399" | |
| 32 | Orin: 6 Cortex-A78AE cores (table, diagram) | orinNanoDatasheet | CONFIRMED | "six cores of Arm Cortex-A78AE"; also the product page: "6-core Arm Cortex-A78AE" | |
| 33 | Orin: Ampere, 1,024 CUDA cores, 32 Tensor Cores | orinNanoDatasheet | CONFIRMED | "Jetson Orin Nano 8GB 1024 NVIDIA CUDA cores \| 32 Tensor cores" | |
| 34 | Orin 67 TOPS INT8 sparse, 33 dense (table, warning Alert) | orinNanoDatasheet | CONFIRMED | "Sparse ... 67 INT8 TOPs (MAXN_SUPER) Dense ... 33 INT8 TOPs (MAXN_SUPER)" | |
| 35 | Orin 8 GB LPDDR5, 128-bit | orinNanoDatasheet | CONFIRMED | "Jetson Orin Nano 8GB 128-bit LPDDR5 DRAM" | |
| 36 | Orin 102 GB/s in MAXN_SUPER mode, 68 GB/s before it | orinNanoSuperPage | UNSUPPORTED (mode name) | Page: "Memory Bandwidth 102 GB/s² ... 2 Up from 68 GB/s." The page never names MAXN_SUPER. The datasheet does: "Peak Memory Bandwidth: 68 GB/s \| 102 GB/s (MAXN_SUPER)" | Added the datasheet cite with that note |
| 37 | Orin modes 7 to 25 W (table, text, diagram) | orinNanoDatasheet | CONFIRMED | "Jetson Orin Nano 8GB Modes: 7W \| 15W \| 25W (MAXN_SUPER)" | |
| 38 | MAXN_SUPER raises CPU 1.5 to 1.7 GHz, bandwidth 68 to 102 GB/s, sparse INT8 40 to 67 TOPS | orinNanoSuperPage | CONFIRMED | "67 TOPS¹ ... 102 GB/s² ... 1.7 GHz² 1 Up from 40 TOPS. \| 2 Up from 68 GB/s. \| 3 Up from 1.5GHz." The sparse label and mode name come from the datasheet ("40 (Sparse) INT8 TOPs"; "If MAXN_SUPER is enabled ... up to 67 (Sparse)"), which is cited in the same sentence | |
| 39 | Same hardware; earlier kits gain the mode with a JetPack upgrade | orinSuperBoostBlog | CONFIRMED | "With the same hardware architecture ... All previous Jetson Orin Nano Developer Kits can use the new power mode by upgrading to the latest version of JetPack." | |
| 40 | Tegra: "both the CPU (Host) and the iGPU share SoC DRAM memory" | tegraAppNote | CONFIRMED | Verbatim, section 3 "Memory Management" (v13.4) | |
| 41 | Orin coherency one-way (I/O): GPU still runs cache maintenance at launch and sync | tegraAppNote | CONFIRMED | 3.1: "I/O coherency (also known as one-way coherency) ... The GPU cache management operations still need to be performed because the coherency is one way ... supported on Tegra devices starting with Xavier SOC"; 4.3.1: "cache maintenance operations at kernel launch, synchronization, and prefetching hint calls". Orin's placement follows from "starting with Xavier" and "starting with Thor" | |
| 42 | App note examples use `cudaStreamAttachMemAsync` | tegraAppNote | CONFIRMED | "the cudaStreamAttachMemAsync() function can be used"; example "cudaStreamAttachMemAsync ( NULL , h_a , 0 , cudaMemAttachGlobal )" | |
| 43 | Thor is the first Jetson with full two-way coherency, which removes CPU and GPU cache maintenance (text, table, diagram) | tegraAppNote | CONFIRMED | 3.2: "Sysmem Full Coherency (also known as Full Coherency or two-way coherency) ... removes the need to perform both CPU and GPU cache management operations ... supported on Tegra devices starting with Thor SoC." | |
| 44 | Intro: Thor 128 GB at 273 GB/s up to 130 W; Orin Nano Super 8 GB at 102 GB/s within 25 W | thorBlog, orinNanoSuperPage, orinNanoDatasheet | CONFIRMED | As rows 28, 29, 35 to 37 | |
| 45 | GB200 NVL72 "about 30 TB of coherent memory" | gb200Nvl72 | UNSUPPORTED ("coherent") | The page gives "13.4 TB HBM3E" and "17 TB LPDDR5X" and never says "coherent" or "fast memory". The Hot Chips deck calls GB300 NVL72 "in a coherent domain" (HC p.3), a different rack | "coherent" dropped: "about 30 TB of memory" |
| 46 | 13.4 TB HBM3e plus 17 TB LPDDR5X, per rack | gb200Nvl72 | CONFIRMED | GB200 NVL72 column: "GPU Memory \| Bandwidth 13.4 TB HBM3E \| 576 TB/s"; "CPU Memory \| Bandwidth 17 TB LPDDR5X \| 14 TB/s" (the superchip column is 372 GB / 480 GB) | Note now says "per-rack figures" |
| 47 | 13.4 + 17 = 30.4, "about 30 TB" | gb200Nvl72 (derived) | CONFIRMED | Arithmetic holds; the page gives no total | |
| 48 | "one NVLink domain with 130 TB/s of aggregate bandwidth" (:359) | gb200Nvl72 | MISLABELLED (direction) | GB200 page: "NVLink Bandwidth 130 TB/s" and "130 terabytes per second (TB/s) of low-latency GPU communications". Blackwell Ultra blog: "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)" and "72-GPU NVL72 configurations with 130 TB/s aggregate bandwidth". 72 x 1.8 = 129.6. Neither page labels the aggregate's direction | "130 TB/s of aggregate bidirectional bandwidth", plus a `derived` blackwellUltraBlog cite stating the sum and that neither page labels it (as in Grace-Blackwell) |
| 49 | T4000: 64 GB, 40 to 70 W, up to 1,200 FP4 TFLOPS sparse | t4000Blog | CONFIRMED | Table 1: "1,200 FP4 Sparse TFLOPs"; "64 GB 256-bit LPDDR5x \| 273 GBps"; "Power 40W-70W" | Added "at 273 GB/s" (see row 69) |
| 50 | RTX Spark: 20-core Grace CPU, Blackwell GPU, up to 128 GB unified, October 2026; no bandwidth, no chip name; roadmap | rtxSpark | CONFIRMED | "With a powerful 1 Petaflop RTX Blackwell GPU, up to 128GB of unified memory and a highly efficient 20-core Grace CPU"; "NVIDIA RTX Spark Windows PCs Arrive October 2026". No "GB/s" and no chip name ("This superchip"). The 1 petaflop has no sparse or dense label | |
| 51 | Orin Nano 2: first half of 2027, 8 GB, 78 TOPS, 2x Orin Nano Super via improved Tensor Cores and higher memory bandwidth, no bandwidth figure; roadmap | orinNano2 | CONFIRMED | "78 trillion operations per second of AI compute, 8GB of memory"; "2x the inference performance of Jetson Orin Nano Super through improved Tensor Cores and higher memory bandwidth"; "expected to be available in the first half of 2027" (2026-08-25). The release gives no GB/s and no sparse or dense label | |
| 52 | 8 GB Orin Nano rated up to nearly 4B (Qwen2.5-VL-3B, Gemma-3/4B) | jetsonEdgeAiBlog | CONFIRMED | "Jetson Orin Nano 8GB is suitable for VLMs and LLMs up to nearly 4B parameters, such as Qwen2.5-VL-3B, VILA 1.5–3B, or Gemma-3/4B." | |
| 53 | Decode: Spark Llama 3.1 8B NVFP4 TensorRT-LLM 38.65 | sparkPerfBlog | CONFIRMED | Table 4: "Llama 3.1 8B NVFP4 TRT-LLM 10256.9 38.65" | |
| 54 | Decode: gpt-oss-20b MXFP4 llama.cpp 82.74; gpt-oss-120b 55.37 (table, text) | sparkPerfBlog | CONFIRMED | "GPT-OSS-20B MXFP4 llama.cpp 3670.42 82.74 GPT-OSS-120B MXFP4 llama.cpp 1725.47 55.37" | |
| 55 | Decode: 2x Spark Qwen3 235B NVFP4 TensorRT-LLM 11.73 (table, clustering) | sparkPerfBlog | CONFIRMED | "Qwen3 235B (on dual DGX Spark) NVFP4 TRT-LLM 23477.03 11.73" | |
| 56 | Cite note: "The Llama 3.1 8B row is listed at input length 2048, output length 128, batch size 1" | sparkPerfBlog | CONFIRMED (scope narrower than source) | The table header covers every row: "Inference (ISL\|OSL= 2048\|128, BS=1)" | Note now says every row runs at that configuration, which makes the 55.37 vs 2.7 comparison a batch-1 one |
| 57 | Prefill 10,256.9 tokens/s, Llama 3.1 8B, NVFP4, TensorRT-LLM, 2,048 input tokens | sparkPerfBlog | CONFIRMED | As row 53, with ISL 2048 | |
| 58 | Decode: Llama 3.1 70B FP8 SGLang 2.7; 803 prefill; no batch size stated | lmsysSpark | CONFIRMED | "the Spark successfully ran Llama 3.1 70B (FP8) at 803 tps prefill / 2.7 tps decode"; framework table "SGLang 1–32 ... Llama 3.1 70B (FP8)"; no batch size given for this result | |
| 59 | Decode: Orin Nano Super Llama 3.2 3B 43.07, Llama 3.1 8B 19.14, Gemma 2 9B 9.21 (INT4, MLC) | jetsonAiLab | CONFIRMED | "Llama 3.1 8B 14 19.14 1.37 Llama 3.2 3B 27.7 43.07 ... Gemma 2 9B 7.2 9.21"; "run the models with MLC and INT4 quantization" | |
| 60 | January 2026: llama.cpp MoE uplift 35% on average; NVFP4 plus speculative decoding up to 2.6x vs FP8 on two Sparks | sparkSoftwareBlog | CONFIRMED | "Llama.cpp updates deliver an average 35% performance uplift when running mixture-of-experts (MoE) models on DGX Spark"; "up to a 2.6x performance increase compared with FP8 execution on the same dual DGX Spark configuration" (2026-01-05) | |
| 61 | gpt-oss-120b 117B total, 5.1B active | gptOss120bReadme | CONFIRMED | "(117B parameters with 5.1B active parameters)" (revision b5c939d) | |
| 62 | Roofline: 70 GB per token, 273 / 70 = 3.9, 2.7 / 3.9 = 69% ("about 70") | lmsysSpark (derived) | CONFIRMED | Arithmetic holds | h2 description now says "about 70 and 75%", as the body does |
| 63 | Roofline: 4 GB per token, 102 GB/s "gives a ceiling near 25 tokens/s"; 19.14 / 25.5 = 75% | jetsonAiLab (derived) | WRONG (rounding) | 102 / 4 = 25.5, as the cite note says. "25" changes the digits, and 19.14 / 25 = 77%, not 75% | "near 25.5 tokens/s" |
| 64 | lstopo: each ten-core cluster mixes five X925 (2 MB L2) with five A725 (512 KB L2) | sparkLstopo (T0) | CONFIRMED | lstopo.txt: under "L3 L#0 (8192KB)", "L2 L#0 (512KB)" to "L2 L#4 (512KB)" and "L2 L#5 (2048KB)" to "L2 L#9 (2048KB)"; under "L3 L#1 (16MB)" the same pattern for L#10 to L#19. lstopo gives L2 sizes only; the core names come from the porting guide's L2 mapping (row 23) | |
| 65 | lscpu: max 3.9 GHz on X925, 2.8 GHz on A725 | sparkLscpu (T0) | CONFIRMED | "Model name: Cortex-X925 ... CPU max MHz: 3900.0000"; "Model name: Cortex-A725 ... CPU max MHz: 2808.0000" | |
| 66 | lstopo: L3 8 MB on one cluster, 16 MB on the other | sparkLstopo (T0) | CONFIRMED | "L3 L#0 (8192KB)"; "L3 L#1 (16MB)"; lscpu "L3 cache: 24 MiB (2 instances)" | |
| 67 | One NUMA node: 20 cores, 122 GB; GPU CPU affinity 0 to 19 | sparkLstopo, sparkNotes (T0) | CONFIRMED | lstopo.txt: "Machine (122GB total)", "NUMANode L#0 (P#0 122GB)"; nvidia-topo.txt: "GPU0 X 0-19 0"; lscpu "NUMA node0 CPU(s): 0-19". hwloc's GB is binary: meminfo "MemTotal: 127600524 kB" = 121.7 GiB; free "121Gi" | |
| 68 | nvidia-smi Memory-Usage "Not Supported"; python at 2,772 MiB; idle about 10 W at 39 C | sparkNvidiaSmi (T0) | CONFIRMED | nvidia-smi.txt: "N/A 39C P0 10W / N/A \| Not Supported"; "143600 C python 2772MiB"; nvidia-smi-q.txt "Average Power Draw : 10.25 W" | |
| 69 | Open item 3: bandwidth for RTX Spark, Orin Nano 2 and T4000 "not given in the NVIDIA announcements read for this section" | t4000Blog, thorBlog | WRONG (T4000) | T4000 blog Table 1: "Memory 64 GB 256-bit LPDDR5x \| 273 GBps"; the Thor blog's Table 1 (read for this section) also gives "64 GB 256-bit LPDDR5X, 273 GB/s" for T4000. RTX Spark and Orin Nano 2 hold | T4000 dropped from the item; "at 273 GB/s" added to the T4000 sentence |
| 70 | Open item 1: "... the Hot Chips slides, which give 31 TFLOPS FP32 only" | gb10HotChips | UNSUPPORTED (attribution) | Only the slides give 31 TFLOPS FP32. The hardware overview and product page give no FP32 figure | "...the Hot Chips slides; the slides add 31 TFLOPS FP32" |
| 71 | lspci: no ConnectX-7 on the uncabled unit; two NVIDIA PCI bridges with nothing behind them (text, open item 4) | sparkNotes (T0) | CONFIRMED (against the log) | NOTES.md: "No Mellanox/ConnectX device enumerates in `lspci -nn` on this unit ... PCI domains 0000 and 0002 expose NVIDIA bridges (10de:22ce) with no endpoint behind them". The raw `lspci` output was never saved to research/dgx-spark/ (no lspci.txt). lstopo.txt agrees: its only PCI endpoints are 0004 (NVMe), 0007 (Ethernet), 0009 (Wi-Fi) and 000f (GPU). The playbook's cabled interface names (enp1s0f0np0, enP2p1s0f0np0) sit in domains 0000 and 0002, which fits the log's reading | |
| 72 | SparkTopologyCapture caption "18 July 2026"; title and caption figures (000f:01:00.0, 48 compute units, 121 GB, 122 GB, L2/L3 mix) | sparkTopologySvg (T0) | WRONG (date as displayed); figures CONFIRMED | The capture's own stamp reads "Date: Fri 17 Jul 2026 10:45:13 PM PDT" (18 July is the UTC date in NOTES.md). SVG text: "PCI 000f:01:00.0", "CoProc opencl0d0", "48 compute units", "121 GB", "NUMANode L#0 P#0 (122GB)", "L3 (8192KB)", "L3 (16MB)", 10x "L2 (512KB)", 10x "L2 (2048KB)". nvidia-smi: "NVIDIA GB10 ... 0000000F:01:00.0". The asset differs from research/dgx-spark/spark-topology.svg only in the root svg tag (diffed), and the raw file matches commit d65693b | Caption: "17 July 2026 (US Pacific time)" |

Not re-verified (unchanged scope, not quantitative): open item 5 (Whisper-class ASR on Orin Nano).

## ORCH-NOTES items

- **NVLink direction labels.** WRONG as written, now fixed. `EdgeSharedMemorySilicon.tsx:359`
  said "130 TB/s of aggregate bandwidth" with no direction. NVIDIA does not label the aggregate
  on either page (GB200 page: "NVLink Bandwidth 130 TB/s"; Blackwell Ultra blog: "130 TB/s
  aggregate bandwidth"). It is 72 x 1.8 TB/s bidirectional = 129.6. The text now reads "130 TB/s
  of aggregate bidirectional bandwidth", with a `derived` note saying neither page labels it.
  This matches the Grace-Blackwell ruling. The section quotes no 1.8 TB/s, 900 GB/s or "each
  way" figure.
- **GB10 NVLink-C2C "about 600 GB/s aggregate"** (`:134`, `EdgeSocComparisonDiagram.tsx:105`
  and `:159`, text, lens). CONFIRMED. "aggregate" is verbatim from NVIDIA's Hot Chips 2025 slide
  (p.9): "~600GB/s of aggregate bandwidth". It is NVIDIA's own interface figure (Tier 2 slides),
  a spec rather than a benchmark, and NVIDIA gives no per-direction split. Neither the slides
  nor the newsroom release ("5x the bandwidth of fifth-generation PCIe") says whether 600 is the
  sum of both directions. The page claims no direction, so no change.
- **DGX Spark (GB10) figures.**
  - CONFIRMED: 128 GB LPDDR5X (64 GB OEM-only); 273 GB/s.
  - FP4: up to 1 PFLOP, sparse (the hardware overview "with sparsity"; the product page
    footnote "Theoretical FP4 TOPS using the sparsity feature"). It is a vendor spec and
    labelled sparse everywhere. NVIDIA gives no dense figure in the three sources; the table
    hedge is now scoped to them.
  - CPU: 10 Cortex-X925 plus 10 Cortex-A725 (hardware overview; lscpu agrees).
  - ConnectX-7 at 200 Gbps (product page; the FAQ says "Each port provides up to 200
    Gigabits per second"), up to four units.
  - Price: $4,699 Founders Edition MSRP from 2026-02-23; 64 GB OEM from $4,999.
  - Ship date: the page states none for the 128 GB unit. The 64 GB OEM units go on sale on
    "Friday, Oct. 23" (2026).
- **Tier 0 lstopo capture.** CONFIRMED figure by figure (rows 64 to 68, 71, 72), with one fix.
  The caption gave 18 July while the image's own stamp reads "Fri 17 Jul 2026 10:45:13 PM PDT",
  so the caption now says "17 July 2026 (US Pacific time)". Matching lines:
  - lscpu: "CPU max MHz: 3900.0000" (X925) and "2808.0000" (A725); "L3 cache: 24 MiB (2
    instances)"; "NUMA node0 CPU(s): 0-19".
  - lstopo: "Machine (122GB total)", "L3 L#0 (8192KB)", "L3 L#1 (16MB)", and per cluster five
    "(512KB)" plus five "(2048KB)" L2s; "PCI 000f:01:00.0 (VGA)", "CoProc(OpenCL) "opencl0d0"".
  - nvidia-smi: "NVIDIA GB10 ... 0000000F:01:00.0", "39C P0 10W / N/A \| Not Supported",
    "python 2772MiB".

  There is no raw lspci file in research/dgx-spark/. The lspci claims rest on NOTES.md, and
  lstopo.txt is consistent with them.
- **Jetson AGX Thor and Orin figures.**
  - Thor (T5000): 128 GB LPDDR5X 256-bit at 273 GB/s; 2,070 TFLOPS sparse FP4; 40 to 130 W.
    Thor GA is not stated on the page; the Thor blog says the kit and T5000 modules "are
    available now" (2025-08-25).
  - Orin Nano Super: 8 GB LPDDR5 128-bit at 102 GB/s (68 GB/s outside MAXN_SUPER); 67 sparse
    and 33 dense INT8 TOPS (datasheet); 7 to 25 W. GA is not stated on the page.
  - Non-shipping parts are marked `roadmap`: Orin Nano 2 ("first half of 2027") and RTX Spark
    ("Arrive October 2026"; whether it shipped by today is not confirmed).
  - T4000 is shipping ("Jetson T4000 modules are available") and is correctly not roadmap.
- **GB300 NVL72 "17 TB of LPDDR5X".** The section names GB200 NVL72, not GB300, and its figures
  match the GB200 NVL72 page (https://www.nvidia.com/en-us/data-center/gb200-nvl72/), rack
  column: "13.4 TB HBM3E \| 576 TB/s" and "17 TB LPDDR5X \| 14 TB/s". Both are per rack; the
  superchip column gives 372 GB and 480 GB. The GB300 NVL72 page also gives 17 TB LPDDR5X, but
  with 20 TB of HBM and "Fast Memory 37 TB", so the section's 13.4 TB is right only for GB200,
  which is what it says. The "30 TB" total is our sum (marked `derived`). The page's
  "coherent memory" was unsupported and was dropped.

## Fixes applied

- `src/sections/EdgeSharedMemorySilicon.tsx:69`: "no dense figure published" became "no dense
  figure in NVIDIA's spec pages or Hot Chips slides".
- `:127`: added `<Cite s={S.orinNanoDatasheet} note="Peak Memory Bandwidth: 68 GB/s | 102 GB/s
  (MAXN_SUPER)." />` to the Orin bandwidth cell.
- `:205` (`nvidiaOct2025Note`): "NVIDIA table of October 2025. The Llama 3.1 8B row is listed at
  input length 2048, output length 128, batch size 1." became "NVIDIA Table 4 of October 2025:
  every row runs at input length 2048, output length 128, batch size 1."
- `:359-370`: "about 30 TB of coherent memory ... with 130 TB/s of aggregate bandwidth." became
  "about 30 TB of memory ... with 130 TB/s of aggregate bidirectional bandwidth." The
  gb200Nvl72 note now says "per-rack figures". Added a `derived` blackwellUltraBlog cite: "72
  GPUs x 1.8 TB/s bidirectional = 129.6 TB/s, which NVIDIA gives as 130 TB/s aggregate;
  neither page labels the aggregate's direction."
- `:374`: "the Jetson T4000 module, 64 GB in a 40 to 70 W envelope" became "64 GB at 273 GB/s
  in a 40 to 70 W envelope".
- `:679` (h2 description): "land at 70 and 75%" became "land at about 70 and 75%".
- `:693`: "a ceiling near 25 tokens/s" became "near 25.5 tokens/s".
- `:717-719` (open item 1): "..., which give 31 TFLOPS FP32 only." became "...; the slides add
  31 TFLOPS FP32."
- `:726-727` (open item 3): "RTX Spark, Jetson Orin Nano 2 and Jetson T4000" became "RTX Spark
  and Jetson Orin Nano 2".
- `src/components/SparkTopologyCapture.tsx:50`: "18 July 2026." became "17 July 2026 (US Pacific
  time)."
- `src/sources/EdgeSharedMemorySilicon.ts`:
  - Added `blackwellUltraBlog`. It reuses the URL, title, publisher and Tier 2 used in
    GraceBlackwellUltraServer.ts and 14 other files; accessed 2026-10-23.
  - `orinNanoDatasheet`: re-fetched today, so the title loses "read 2026-07-18, not re-fetched
    in October" and `accessed` becomes 2026-10-23.
  - The header comment lists the new shared record.

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "EdgeSharedMemorySilicon|EdgeSocComparisonDiagram|SparkTopologyCapture|sources/EdgeSharedMemorySilicon"`:
  no match ("no type errors in my files").
- `pnpm exec eslint src/sections/EdgeSharedMemorySilicon.tsx src/sources/EdgeSharedMemorySilicon.ts src/components/EdgeSocComparisonDiagram.tsx src/components/SparkTopologyCapture.tsx --max-warnings 0`:
  exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t EdgeSharedMemorySilicon`: exit 0 (1
  passed, 34 skipped).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0,
  pre-overflow exit 0. No hits for EdgeSharedMemorySilicon, EdgeSocComparisonDiagram or
  SparkTopologyCapture in any output.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 847 passed, 1 failed. The only failure
  is the sources.md sync snapshot (expected): the datasheet row changes, and the Blackwell Ultra
  row gains EdgeSharedMemorySilicon with accessed 2026-10-23.
- `pnpm exec vite build --outDir /tmp/vf-EdgeSharedMemorySilicon-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections edge-shared-memory --widths 1440,390 --out /tmp/vf-EdgeSharedMemorySilicon-shots --dist /tmp/vf-EdgeSharedMemorySilicon-dist`:
  "edge-shared-memory @1440: 2 SVG diagram(s), 0 React Flow, ok" and the same at 390; exit 0.
  PNGs read:
  - 1440: the comparison diagram's three panels are clean, and the NVLink-C2C labels sit
    beside the arrow.
  - 390: the lstopo capture scrolls sideways at 1000 px with legible 10 px text. Its date stamp
    reads "Fri 17 Jul 2026 10:45:13 PM PDT", which the corrected caption now matches.

## For the orchestrator

- Regenerate `sources.md` (`vitest -u` on `src/__tests__/sources.test.ts`). Changed rows: the
  Orin Nano datasheet (title and accessed), and Blackwell Ultra (EdgeSharedMemorySilicon added,
  accessed now 2026-10-23).
- ORCH-NOTES calls this item "GB300 NVL72 '17 TB of LPDDR5X'", but this section cites GB200
  NVL72 and matches the GB200 page. No other section needs to change for it.
- Cross-section fact for anyone quoting Jetson T4000: NVIDIA's T4000 and Thor blogs both give
  "64 GB 256-bit LPDDR5x | 273 GBps". The bandwidth is published.
- `sparkPortingGuide` (https://docs.nvidia.com/dgx/dgx-spark-porting-guide/overview.html) now
  redirects to `.../dgx-spark-porting-guide/latest/overview.html`. It still resolves; if
  another section adopts it, use the canonical URL.
- Tier 0 bundle gap: NOTES.md cites `lspci -nn` output that was never saved to
  research/dgx-spark/. The lspci claims rest on the log alone. Save the raw output on the next
  hardware session.
- Jetson AGX Thor developer kit price: the launch blog (2025-08-25) says $3,499, and the
  current Jetson FAQ says $5,499. This section uses the FAQ with its date. Any section quoting
  the launch price should date it.

## Backlog

- Acronym order: C2C and TOPS appear first in the diagram or spec table, before their
  expansions (C2C in the "Spark: two dielets" paragraph, TOPS in the Jetson power paragraph).
  Expanding them in the diagram title or table would need a layout pass.
- Economy: trim the 128 GB / 273 GB/s restatements in the intro and the "One idea at four
  scales" paragraph. Consider moving the RTX Spark and Orin Nano 2 sentences into the open-items
  container or an ExpandableSection.
- The h2 description for "One idea at four scales" names the topic. A payoff form would be
  something like "Where a 128 GB desk unit sits between a 30 TB rack and an 8 GB module, and
  what that means for model choice".
- The "Background:" cross-reference paragraph reads as a link list. Fold the two or three
  references into the sentences that need them.
- An optional Tier 0 STREAM-class bandwidth run on the Spark would turn the 273 GB/s spec into
  a measurement (NOTES.md UNKNOWN 4).
