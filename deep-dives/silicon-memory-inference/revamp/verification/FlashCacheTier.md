# Verification: Flash as a Cache Tier for Inference

Verified: 2026-10-23. Claims checked: 108 (sampled: 0; every quantitative claim was checked).
Confirmed 98, wrong 1, unsupported 5, mislabelled 4, unverifiable 0.

Every source was re-fetched on 2026-10-23 with curl's default User-Agent and no personal data in
any request: 15 pinned GitHub files at their tags or SHA (raw.githubusercontent), the NIXL plugin
tree, 3 pinned Hugging Face files plus the Llama API record, 11 AWS pages (including the EFS
performance page and the HyperPod setup page, which were not in the register), 8 NVIDIA pages and
PDFs, and the Micron, OCP, Sandisk, BaM, CMM-H, Mooncake (FAST, arXiv v4 and v5), Llama 3 and
Ma-Patterson PDFs (pdftotext). Two PCI-SIG pages returned 403 and were not needed. Every derived
number was recomputed in a script from the cited inputs. The one qualitative assumption not
checked is "LMCache, KVBM and Mooncake all pipeline layer by layer" (no number attached).

## Gate 3 score: 8/10

The arithmetic holds exactly: every break-even value, the worked example, the memory horizons and
the block and IOPS figures recompute to the printed digits, and KV per token is 327,680 B, the same
as *KV Cache and FlashAttention*. One figure was wrong as linked: the unversioned Mooncake URL now
serves v5, which revises the trace hit ratio. The other fixes moved five citations to the file
that holds the claim and corrected four kind labels. One of the moved citations also changes what
the reader is told to do, because AWS advises against the EFS mode llm-d recommends. Economy holds
the score at 8 rather than 9: at about 3,070 visible words this is one of the longest sections in
the dive, and Mooncake comes up in four blocks.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 98 of 108 confirmed as shipped. Exact: 17.08 / 2.135 GB/s, 18.21 / 14.09 / 8.29, 77.69 and 4.55x, 38.84, Qwen3 53.83, DeepSeek-V3 11.78, 0.157 / 0.314 s, 105 / 176 / 3,559 s, 18.02 / 10.44 / 7.05 GB/s, 711x, 65.6 GB / 2.65 s. One figure (the Mooncake trace, 30% to 50%) was contradicted by the page the URL now serves. Five cites pointed at a sibling file. None of these errors was load-bearing for the break-even number. |
| Mental model or practical value | 8 | Models: B* as one ratio, "a tier's memory is tokens held over fill rate", page-first vs layer-first I/O size, "HBF serves bytes read every step, a flash cache tier bytes read once per hit". Practical: the instance table, one setting per stack, `fio` / `nvme id-ctrl` / `gdscheck -p`, the admission filter, the metric pair. Weakest blocks: the CMM-H paragraph (prototype figures for a CPU-side device the reader cannot buy) and the Mooncake 115% / 107% vs 75% sentence, which compares two paper versions rather than giving the reader a figure to use. |
| Shape | 8 | It opens with "What a flash cache tier is" and "Why it matters" before the mechanism. Each h2 description names a payoff. The strongest number (about 17 GB/s per node, about 2 per GPU) appears in the h1, the first h2, the ladder, the chart callout, the P5/P6 block and the last sentence. Evidence sits in four ExpandableSections, and the section ends on "compare the tier's bandwidth with the break-even". The HBF contrast in the h1 dissects a second device before the first h2. |
| Writing | 8 | `no-ai-tells` passes and there are no "Section N" references. In-sentence attribution is load-bearing in every case found: silence ("AWS publishes no", "AWS lists no"), conflict (SageMaker docs vs What's New, llm-d vs AWS on EFS, code vs docs on the filter), strength ("Dynamo recommends"), and grading ("Sandisk claims", "BaM's authors measured", "AWS measured"). Some sentences carry many acronyms: the ladder caption, and the "On AWS" paragraph, which names FSx, EFA, GDS, S3, KVBM, NIXL and EFS. |
| Economy | 6 | About 3,070 visible words by my count (tags, code and Cite stripped), 539 lines against the brief's 300 to 450. My fixes add about 20 words, for the EFS conflict. Repeats: Mooncake appears in the worked example, the reuse block, the sharing block and the build list. The KVBM sizing settings appear in both the stack list and the build list. Cut candidates are in the Backlog. |
| Diagrams | 9 | Four inline SVGs, each with `role="img"`, `aria-labelledby` and a `<title>` that states the assertion. Probe: "4 SVG diagram(s), 0 React Flow, ok" at 1440 and at 390. Reading the 1440 PNGs, no text crosses a bar or line, and the ladder's outside labels start right of the dashed line. Close label pairs on the break-even chart (512 / 400, 18.0 / 12.5) stay clear. At 390 each SVG keeps its 640 px minimum inside the scroll wrapper. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Break-even about 17 GB/s per 8x H100 node, about 2 per GPU (dense 70B, 8K) | llama3Herd (derived) | CONFIRMED | Recomputed 327,680 x 7.916e15 / 151.84e9 = 17.08 GB/s; / 8 = 2.14 | |
| 2 | Prefill FLOPs per token at 8K = 151.8 G | llama3Herd, llama70bApi (derived) | CONFIRMED | 2 x 70,553,706,496 + 80 x 64 x 256 x 8,192 = 151.84e9 | |
| 3 | Llama 3.1 70B: 80 layers, 64 query heads, 8 KV heads, head dim 128 | llama3Herd | CONFIRMED | Table 3: "Layers 32 80 126 ... Attention Heads 32 64 128 ... Key/Value Heads 8 8 8"; Model Dimension 8192 / 64 = 128 | |
| 4 | 70.55 B parameters | llama70bApi | CONFIRMED | API: sha 349b2ddb..., `safetensors.total` 70553706496 | |
| 5 | KV 327,680 B per token | breakEvenNote | CONFIRMED | 2 x 80 x 8 x 128 x 2 = 327,680; KvCacheAndFlashAttention.tsx line 16 gives the same | |
| 6 | Dense peaks 989.5 TFLOPS BF16, 1,979 FP8 per H100/H200 | h100Page, h200Page | CONFIRMED | H100: "BFLOAT16 Tensor Core * 1,979 teraFLOPS", "FP8 Tensor Core * 3,958", "* With sparsity"; H200 same with "2 With sparsity." | |
| 7 | 4.5 PFLOPS FP8 dense per B200 | dgxB200 | CONFIRMED | "FP8 Tensor Core: 72 PFLOPS**"; "**Specification shown in sparse. Dense performance is ½ sparse spec shown." 72 / 2 / 8 = 4.5 | |
| 8 | Llama 70B on 8x H100: 18.2 / 17.1 / 14.1 / 8.3 GB/s | derived | CONFIRMED | 18.21 / 17.08 / 14.09 / 8.29 | |
| 9 | 8x B200 FP8: 82.8 / 77.7 / 64.1 / 37.7; 4.5x Hopper | derived | CONFIRMED | 82.81 / 77.69 / 64.09 / 37.70; 77.69 / 17.08 = 4.55 | |
| 10 | FP8 KV halves that to 38.8 | derived | CONFIRMED | 38.84 | |
| 11 | Hopper FP8 KV + FP8 compute leaves B* unchanged | derived | CONFIRMED | KV / 2 and G x 2 cancel: 17.08 | |
| 12 | Qwen3-235B-A22B: 66.9 / 53.8 / 32.3 / 12.4 | qwen3Config, qwen3Readme (derived) | CONFIRMED | config: `num_hidden_layers` 94, `num_attention_heads` 64, `num_key_value_heads` 4, `head_dim` 128; README "235B in total and 22B activated". Recomputed 66.87 / 53.83 / 32.26 / 12.40 | |
| 13 | DeepSeek-V3: 14.5 / 11.8 / 7.1 / 2.8 | deepseekV3Config, deepseekV3Report (derived) | CONFIRMED | config: `kv_lora_rank` 512, `qk_rope_head_dim` 64, 61 layers, 128 heads, `qk_nope_head_dim` 128, `v_head_dim` 128; report "671B total parameters with 37B activated". Recomputed 14.53 / 11.78 / 7.14 / 2.77 | |
| 14 | 4,645 / 8,751 / 1,899 KV bytes per billion active | qwen3Config (derived) | CONFIRMED | 327,680 / 70.55 = 4,644.6; 192,512 / 22 = 8,750.5; 70,272 / 37 = 1,899.2 | |
| 15 | DeepSeek-V4.1-Flash 890 B per token; 111 per billion of 8B prefill-active; about 40x | deepseekV41Flash | CONFIRMED | README: "reduce the global KV cache footprint to **890 bytes per token**"; "activate only **8B parameters per token during prefill**". 890 / 8 = 111.25; 4,645 / 111 = 41.8 | |
| 16 | At 50% MFU every line halves | derived | CONFIRMED | B* is proportional to G | |
| 17 | Worked example: 2.68 GB, 1.24 PFLOP, 0.157 s, 0.314 s | ec2AcceleratedSpecs (derived) | CONFIRMED | 2.684 GB; 1.2439 PFLOP; 0.1571 s; 0.3143 s | |
| 18 | Fetch 0.149 / 0.215 / 0.018 / 0.0067 / 0.0052 s | tierRateNote (derived) | CONFIRMED | 2.684 GB over 18.02 / 12.5 / 150 / 400 / 512 GB/s = 0.1489 / 0.2147 / 0.0179 / 0.00671 / 0.00524 | |
| 19 | Mooncake: 6 GB/s per 8x A800, 19 GB/s per 8x H800 (Llama3-70B, 8K) | mooncakeFast | MISLABELLED | FAST p.3: "assuming a prefix length of 8192, Equation 2 yields a minimum required B of 6 GB/s. The requirement for B will be enlarged to 19 GB/s for an 8×H800 machine." An analytical model, not a measurement | kind measured to simulated, with a note |
| 20 | `DYN_KVBM_NCCL_MLA_MODE` covers MLA broadcast | dynamoKvbmDocs | CONFIRMED | "Enable the NCCL broadcast optimization for Multi-head Latent Attention (MLA) models. When disabled, each GPU loads KV blocks independently." | |
| 21 | 26,000 tokens/s at 50% MFU; HBM 105 s, DRAM +176 s, instance store 3,560 s | clockNote (derived) | CONFIRMED | 0.5 x 7.916e15 / 151.84e9 = 26,066 tok/s; 2.747 M / 4.578 M / 92.77 M tokens give 105.4 / 175.6 / 3,559 s | |
| 22 | About 900 GB of usable HBM (8 x 141 GB x 0.92 minus 141 GB) | vllmCacheConfig | CONFIRMED | cache.py L103 `gpu_memory_utilization: float = Field(default=0.92, ...)`; 1,037.8 - 141.1 = 896.7 GB | |
| 23 | Ladder: HBM3e 4,800 GB/s, 141 GB (H200) | h200Page | CONFIRMED | "141 gigabytes (GB) of HBM3e memory at 4.8 terabytes per second (TB/s)" | |
| 24 | Ladder: host DRAM 256 GiB per GPU; 2,048 GiB on p5en and P6-B200 | ec2AcceleratedSpecs | CONFIRMED | Memory column: "p5en.48xlarge 2048.00", "p6-b200.48xlarge 2048.00" | |
| 25 | Host link 64 GB/s per GPU, 512 GB/s per node (cited to the Xeon 6 brief at 32 GT/s) | xeon6Brief | UNSUPPORTED | The brief prints 32 GT/s only for CXL: "Up to 64 lanes of CXL 2.0 with data transfer rates up to 32 GT/s per lane"; PCIe 5.0 lanes have no rate, and p5en's host is Sapphire Rapids. The H200 page gives "PCIe Gen5: 128GB/s" | Re-cited to h200Page; note now "128 GB/s per H200 across both directions = 64 GB/s per direction (line rate)"; xeon6Brief record removed |
| 26 | Ladder: peer DRAM over EFA 50 GB/s (3,200 Gb/s per p5en) | ec2AcceleratedSpecs | CONFIRMED | Network: "p5en.48xlarge 2 3200 Gigabit" | |
| 27 | Ladder: FSx 18.75 GB/s per GPU (1,200 Gb/s) | fsxPerformance | CONFIRMED | "EFA-enabled EFA with GDS 1200 Gbps" | |
| 28 | Ladder: instance store at least 2.25 GB/s, 3.8 TB per GPU; EBS 1.56 GB/s | ec2AcceleratedSpecs | CONFIRMED | "p5en.48xlarge 8 x 3800 GB NVMe SSD 4,400,000 / 2,200,000"; EBS "p5en.48xlarge 100000.00 12500.00 400000.00" | |
| 29 | HBF: 512 GiB per 16-high stack, 0.384 to 3.072 TB/s | ocpHbfSpec | CONFIRMED | Table 3 "Dies per cube 16 ... Total Cube Size 512 GiB"; Table 4 grades "0.384 / 1.536 / 3.072". Grade 1 allows at most an 8-high stack (see Backlog) | |
| 30 | Sandisk claims 1.6 TB/s for its first product; about 700x | sandiskHbf | CONFIRMED (vendor-claim, not shipping) | "The first-generation product delivers blazing-fast read bandwidth of 1.6 TB/s"; 1,600 / 2.25 = 711 | |
| 31 | Per-token KV "infeasible" on HBF | maPatterson | CONFIRMED | "Limited write endurance makes HBF infeasible for KV Cache data updated for every query or generation token" | |
| 32 | NVIDIA agentic analysis: 85% to 97%, 11.7 to 1, 2 to 30 s, about 40% reasoning tokens | dynamoAgenticBlog | CONFIRMED | "every subsequent call to the same worker hits 85-97% cache"; "An 11.7x read/write ratio"; "(2-30 seconds while the agent waits for an external API) might cause the agent's blocks to age out"; "~40% of generated tokens" | |
| 33 | Mooncake trace: 30% to 50% from 1,000 to 50,000 blocks of 512 tokens, then flat; over half never reused | mooncakeArxiv | WRONG as linked; CONFIRMED in v4 | The unversioned URL serves v5 (2026-10-08): "boosts the cache hit ratio from 34% to 55%". v4 p.7: "from 30% to 50%. Further capacity increases show minimal improvement"; "(with a block size of 512)"; "over 50% of cache blocks remaining unused" | URL pinned to `arxiv.org/abs/2407.00079v4`, accessed 2026-10-23 |
| 34 | DeepSeek clears unused disk cache "within a few hours to a few days" | deepseekCaching | CONFIRMED | "Once the cache is no longer in use, it will be automatically cleared, usually within a few hours to a few days." | |
| 35 | Cache-hit input 1/50 (deepseek-flash), 1/30 (deepseek-v4-pro) | deepseekPricing | CONFIRMED | Off-peak hit $0.003 / $0.022, miss $0.15 / $0.66 (peak $0.006 / $0.044 vs $0.3 / $1.32) | |
| 36 | 30.4 TB holds 34 billion tokens of V4.1-Flash KV | deepseekV41Flash (derived) | CONFIRMED | 30.4e12 / 890 = 34.2e9 | |
| 37 | 8 x 3,800 GB on p5, p5e, p5en, p6-b200, p6-b300; 30.4 TB; 4.4 M IOPS at 4 KiB | ec2AcceleratedSpecs | CONFIRMED | Five rows "8 x 3800 GB NVMe SSD 4,400,000 / 2,200,000"; "aggregated IOPS performance with 4,096 byte block size at queue depth saturation" | |
| 38 | Instance store included in the instance price | instanceStore | CONFIRMED | "Instance store volumes are included as part of the usage cost of the instance." | |
| 39 | Data does not survive stop, hibernation or termination | instanceStoreLifetime | CONFIRMED | "the data does not persist if the instance is stopped, hibernated, or terminated" | |
| 40 | p6e-gb200: 3 x 7,500 GB, 2.55 M IOPS, 5.6 TB per GPU, EBS 7,500 MB/s | ec2AcceleratedSpecs | CONFIRMED | "p6e-gb200.36xlarge 3 x 7500 GB NVMe SSD 2,550,000 / 2,400,000"; "4 x NVIDIA B200 GPU"; EBS "60000.00 7500.00"; 22,500 / 4 = 5,625 GB | |
| 41 | 405 TB per 72-GPU UltraServer | p6Page | CONFIRMED | "P6e UltraServers support up to 405 TB of local NVMe SSD storage"; table "u-p6e-gb200x72 ... 405" | |
| 42 | trn2.48xlarge: 4 x 1,900 GB, 1.72 M, 475 GB per chip, EBS 10,000 MB/s | ec2AcceleratedSpecs | CONFIRMED | "trn2.48xlarge 4 x 1900 GB NVMe SSD 1,720,000 / 720,000"; "16 x AWS Trainium2"; EBS "80000.00 10000.00" | |
| 43 | Floors 18.0 / 2.25, 10.4 / 2.6, 7.0 / 0.44 GB/s | floorNote (derived) | CONFIRMED | 18.02 / 2.253; 10.44 / 2.61; 7.05 / 0.440 | |
| 44 | EBS cap 10,000 (p5, p5e) and 12,500 MB/s (p5en, p6-b200, p6-b300) | ec2AcceleratedSpecs | CONFIRMED | "Baseline / Maximum throughput (MB/s, 128 KiB I/O)": p5/p5e "10000.00", p5en/p6-b200/p6-b300 "12500.00" | |
| 45 | AWS publishes no large-I/O GB/s for instance store | ec2AcceleratedSpecs | CONFIRMED (scope: spec page) | The instance store table has IOPS columns only | |
| 46 | No instance-store figure for Trn3 or P6e-GB300 on the spec page or the Trn3 page | ec2AcceleratedSpecs, trn3Page | CONFIRMED | No "trn3" or "gb300" row on the spec page; the Trn3 page gives HBM only ("144 GB of HBM3e") | |
| 47 | Dynamo docs: LMCache, FlexKV and HiCache are "alternatives, not cache layers to stack together" | dynamoKvbmDocs | UNSUPPORTED by the cited file | kvbm-configuration.mdx has no such sentence. overview.mdx at v1.5.1: "LMCache, FlexKV, and HiCache are alternatives, not cache layers to stack together." | New record dynamoOffloadOverview |
| 48 | KVBM G1 to G4; `DYN_KVBM_DISK_CACHE_GB` + `_DIR` enable G3; `DYN_KVBM_CPU_CACHE_GB` enables G2 | dynamoKvbmDocs | CONFIRMED | "GPU (G1) → host/CPU (G2) → disk (G3) → object storage (G4)"; "Size of the disk (G3) cache in GB. Setting this enables disk offload."; "Directory for disk cache files"; "Setting this enables CPU offload." | |
| 49 | HiCache L1 GPU, L2 private host DRAM, L3 backends file, mooncake, hf3fs, nixl, aibrix | sglangHicache | CONFIRMED | "L2 is node-local and instance-private."; "Storage backend (`file`, `mooncake`, `hf3fs`, `nixl`, `aibrix`, or a custom one)" | |
| 50 | vLLM OffloadingConnector: `secondary_tiers` entry with `type: fs` | llmd | UNSUPPORTED by the cited file | The guide README names only `TieringOffloadingSpec`. docs/well-lit-paths/foundations/tiered-prefix-cache.md at v0.10.0: "Configured with `TieringOffloadingSpec` and a `secondary_tiers` entry of `type: fs`" | New record llmdTieredDoc |
| 51 | LMCache: each GPU its own path on a dedicated drive | lmcache | CONFIRMED | "assign each GPU its own disk path so that each device writes to a dedicated drive." | |
| 52 | From CUDA 12.8, GDS uses upstream PCI P2PDMA for local NVMe; `"use_pci_p2pdma": true` in /etc/cufile.json | gdsOverview, gdsReleaseNotes | CONFIRMED | Overview: "As of CUDA 12.8, GDS supports additional peer-to-peer DMA for NVMe devices using upstream kernel PCI P2PDMA infrastructure"; release notes v1.19: `"block": { "nvme": { "use_pci_p2pdma": true }` in /etc/cufile.json | |
| 53 | No AWS document located says GDS P2P works on instance-store NVMe; FSx is the AWS GDS path | fsxEfa | CONFIRMED (scope hedge kept) | FSx EFA page: "To access your file system using GPUDirect Storage (GDS): Use an Amazon EC2 P5, P5e, P5en, P6-B200, or P6-B300 client instance." | |
| 54 | cuFile falls back to compatibility mode; `gdscheck -p` | gdsOverview | CONFIRMED | "A compatibility mode is available for unsupported configurations that maps IO operations to a fallback path."; "$ ./gdscheck -p" | |
| 55 | GDS: CPU control path through cuFile, DMA directly into GPU memory | gdsOverview | CONFIRMED | "a direct data path for direct memory access (DMA) transfers between GPU memory and storage"; "These drivers run on the CPU and implement the control path" | |
| 56 | GPU threads build commands, ring doorbells, poll (BaM); SCADA daemon sets up queues, off the hot path | bam, storageLender, nvidiaStorageBlog | CONFIRMED | BaM: "enable GPU threads to write to the queue doorbell registers"; storage-lender: "Clients submit commands, ring mapped doorbells, and poll completions directly; the daemon is not on that hot path."; blog: "A separate, privileged component configures protected access ... at setup". The storage-lender README does not name SCADA; the blog carries the SCADA link | |
| 57 | 16-token block 5.24 MB per node, 655 KB per GPU, 8 KiB per layer | blockNote (derived) | CONFIRMED | 5,242,880 / 655,360 / 8,192 B | |
| 58 | 2.2 M IOPS at 8 KiB, about 27,000 at 655 KB, to stream 18 GB/s | blockNote (derived) | CONFIRMED | 18e9 / 8,192 = 2.20 M; 18e9 / 655,360 = 27,466 (27,500 at 18.02 GB/s); 2.2 M is half of 4.4 M | |
| 59 | BaM: GDS fills Gen4 x16 only at 32 KiB+, 23.6% at 4 KiB; about 25 GB/s from four SSDs | bam | CONFIRMED | "GDS can only saturate the GPU's PCIe link at the large I/O granularity of 32KB and only reaches 23.6% of the PCIe bandwidth at 4KB"; "BaM easily achieves 25GBps using four SSDs" | |
| 60 | vLLM default block 16 tokens | vllmCacheConfig | CONFIRMED | L71 `DEFAULT_BLOCK_SIZE: ClassVar[int] = 16` | |
| 61 | KVBM page size 32 | dynamoKvbmCode | CONFIRMED | L93 `#[pyo3(signature = (worker_id, leader = None, page_size = 32, ...))]` | |
| 62 | A recommended 64 in HiCache | sglangHicache | UNSUPPORTED by the cited file | hicache_design.mdx has no 64. hicache_best_practices.mdx at v0.5.21, "Essential HiCache flags": `--page-size 64  # Page size for cache management` | New record sglangHicacheBp |
| 63 | 256-token chunks in LMCache example configs | lmcache | CONFIRMED | "export LMCACHE_CHUNK_SIZE=256"; "chunk_size: 256" | |
| 64 | Micron 9650: 28,000 MB/s, 5.5 M 4 KiB random reads, 60 µs at QD1 | micron9650 | CONFIRMED (vendor-claim) | "Sequential read 28,000 MB/s"; "Random read 5.5 MIOPS"; "Latency (TYP, µs) 60 (rd.)"; fn 14 "4KB transfers, queue depth = 1"; fn 13 "Random READ workloads measured using FIO with a queue depth of 512 (... based on 4K sector size" | |
| 65 | Gen5 predecessor reads 14,000 MB/s and 3.3 M | micron9650 | CONFIRMED (vendor-claim) | Table 1 "Prior generation 14,000 MB/s ... 3.3 MIOS"; fn 4 "the Micron 9550 SSD at 14GB/s" | |
| 66 | 22.5 GB/s of 28 at 4 KiB | micron9650 (derived) | CONFIRMED | 5.5e6 x 4,096 = 22.53 GB/s | |
| 67 | 512-byte drives for GPU-initiated reads under Storage-Next | kioxiaStorageNext | CONFIRMED | "KIOXIA Announces New SSD Model Optimized for AI GPU-Initiated Workloads"; "NVIDIA Storage-Next Architecture" | |
| 68 | Kioxia GP1: up to 10 M random reads at 512 B, up to 50 DWPD, samples by end of 2026, 100 M target | kioxiaGp1 (roadmap) | MISLABELLED | "Up to 10 million random read IOPS at a 512-byte block size"; "Up to 50 DWPD endurance"; "Evaluation samples will be available to select customers by the end of 2026"; "targeting up to 100 million IOPS". A vendor performance figure carried only the roadmap kind | Added kind vendor-claim beside roadmap |
| 69 | SK hynix AI-N P samples by end of 2026 | skhynixAin | CONFIRMED (roadmap) | "plans to release samples by the end of 2026" | |
| 70 | 10 M x 512 B = 5.1 GB/s | kioxiaGp1 (derived) | CONFIRMED | 5.12 GB/s | |
| 71 | CMM-H: FPGA, 16 GB DRAM over 1 TB TLC; 4.5 vs 219 GB/s; 99.99th about 450 ns, about 15 µs at 32 GB | cmmH (measured) | MISLABELLED (prototype) | "16 GB 8-way associative"; "TLC) with a capacity of 1 TB"; "maximal bandwidths (i.e., 4.5GB/s) ... (i.e., 219GB/s) on DDR5-L"; "99.99th ... ≈ 450 ns"; "≈ 15 µs ... when the region size rises up to 32 GB". The figures are for an FPGA prototype | Added kind roadmap with a note, beside measured |
| 72 | Mooncake: local DRAM reaches about half the theoretical hit rate | mooncakeFast | CONFIRMED | "the capacity of local DRAM supports only up to 50% of the theoretical cache hit rate" | |
| 73 | SGLang: cross-instance reuse is "the job of L3" | sglangHicache | CONFIRMED | "Cross-instance reuse is the job of L3" | |
| 74 | Dynamo router credits host 0.75, disk 0.25 by default | dynamoRouterCode | CONFIRMED | `default_host_cache_hit_weight() -> f64 { 0.75`; `default_disk_cache_hit_weight() -> f64 { 0.25` | |
| 75 | 115% (A800) and 107% (H800) in FAST; 75% in the later arXiv version | mooncakeFast, mooncakeArxiv | CONFIRMED | FAST: "handle 115% and 107% more requests on the A800 and H800 clusters"; v4 (and v5): "enables Kimi to handle 75% more requests" | |
| 76 | FSx per client 100 Gb/s without EFA, 700 with EFA, 1,200 with EFA + GDS | fsxPerformance | CONFIRMED | "Non EFA-enabled Any 100 Gbps*"; "EFA-enabled EFA 700 Gbps"; "EFA with GDS 1200 Gbps" | |
| 77 | GDS on P5 to P6-B300; Trn2 excluded as an EFA client | fsxEfa | CONFIRMED | "Use an Amazon EC2 P5, P5e, P5en, P6-B200, or P6-B300 client instance."; "excluding the trn2 instance family" | |
| 78 | PERSISTENT-1000 1,000 MB/s per TiB; about 150 TiB for one client | fsxSsd (derived) | CONFIRMED | "PERSISTENT-1000 2600 ‐ 27.3 1000 ‐" (disk throughput 1000 MBps per TiB); 150,000 / 1,000 = 150 | |
| 79 | EFA 3,200 Gb/s per p5en or p6-b200, 6,400 on p6-b300 | ec2AcceleratedSpecs | CONFIRMED | "p6-b200.48xlarge 2 3200 Gigabit"; "p6-b300.48xlarge 2 6400 Gigabit" | |
| 80 | S3 Express One Zone single-digit millisecond | s3Express | CONFIRMED | "purpose-built to deliver consistent, single-digit millisecond data access" | |
| 81 | KVBM G4 and NIXL `obj` target S3 | dynamoKvbmDocs, nixl | CONFIRMED | "The G4 tier stores blocks in an S3-compatible object store"; obj README "AWS S3 object storage using aws-sdk-cpp" | |
| 82 | llm-d's AWS guide uses EFS in Max I/O mode | llmd | UNSUPPORTED by the cited file; conflicts with AWS | The guide README has no EFS mode. backends/aws/README.md at v0.10.0: "Use **Max I/O** performance mode for higher throughput". AWS EFS performance page: "Max I/O mode is a previous generation performance type"; "Due to the higher per-operation latencies with Max I/O, we recommend using General Purpose performance mode for all file systems." | New records llmdAwsEfs and efsPerformance; the sentence now says llm-d recommends Max I/O and AWS recommends General Purpose |
| 83 | llm-d connector leaves eviction to the storage system | llmd | CONFIRMED | "The connector does not evict data from the shared tier. Capacity is managed by the storage system or by an external controller" | |
| 84 | NIXL reaches storage through its plugin architecture; libfabric maps GPUs to EFA | nixl | CONFIRMED | README "storage (e.g., file, block and object store) through a modular plug-in architecture"; libfabric README "Hardware-aware GPU-to-EFA and NUMA-to-EFA mapping" | |
| 85 | HyperPod: L1 local CPU memory, cluster-wide L2, `tieredstorage` (recommended) or `redis`, `kvCacheSpec.enableL2Cache` | hyperpodWhatsNew, hyperpodBlog | CONFIRMED | What's New: "local CPU memory (L1) with disaggregated cluster-wide storage (L2). AWS-native disaggregated tiered storage is the recommended backend"; blog YAML `kvCacheSpec:` `enableL2Cache: true` `l2CacheBackend: "tieredstorage" # can also be "redis"` | |
| 86 | Docs: "a pooled memory tier that spans cluster nodes"; only What's New mentions local SSD | hyperpodKvDocs, hyperpodWhatsNew | CONFIRMED | Docs: "HyperPod Tiered Storage, a pooled memory tier that spans cluster nodes"; What's New: "automatic tiering from CPU memory to local SSD"; no SSD or NVMe on the blog or the setup page | |
| 87 | AWS: Llama-3.1-70B, 7 p5.48xlarge replicas, 64K: median TTFT -94%, throughput +38% | hyperpodBlog | CONFIRMED (vendor-claim) | "7 replicas on p5.48xlarge"; "(64K tokens), achieving a 35% reduction in TTFT at P90, 94% reduction at P50, 38% throughput increase" | |
| 88 | VAST + CoreWeave: 405B, 127,188 tokens, 8x H100, 62 s vs 3 s, 2 x 100 Gb/s NFS, peak 198 Gb/s | vastBlog | CONFIRMED (vendor-claim) | "Prompt: 127,188 tokens"; "8x NVIDIA HGX H100"; "2x100Gbit/sec Ethernet"; "NFS (TCP, VAST NFS multipath"; "peaking at ~99% (198 Gbps)"; "TTFT with prefill compute: 62 seconds"; "TTFT with KV$ load from VAST: 3 seconds" | |
| 89 | 516,096 B per token, 65.6 GB, 2.65 s at 198 Gb/s; the 20x | llama3Herd (derived) | CONFIRMED | 2 x 126 x 8 x 128 x 2 = 516,096 (VAST: "approximately 504 KiB per token"); x 127,188 = 65.64 GB; / 24.75 GB/s = 2.652 s; "Effective speedup: 20×" | |
| 90 | Nebius + WEKA: one 8x B300 node, 8 h of production agentic coding traffic; 93% vs 40%; p95 3.82 vs 23.12 s; 3.7x tokens per GPU-hour | nebiusWeka | CONFIRMED (vendor-claim) | "one eight-GPU HGX B300 serving node at TP=8"; "eight-hour"; "replayed production traffic"; "93% against 40%"; "p95 at 3.82 s against 23.12 s"; "169,000 against 46,000, a 3.7× difference" | |
| 91 | CMX: BlueField-4 (800 Gb/s), G3.5 between G3 and G4 | dpuPage, cmxBlog | MISLABELLED (dpuPage) | DPU page: "The NVIDIA BlueField-4 DPU is an 800 Gb/s infrastructure platform"; CMX blog: "a new G3.5 layer, an Ethernet-attached flash tier optimized specifically for KV cache". CES release: BlueField-4 "will be available in the second half of 2026", so the 800 Gb/s is a roadmap figure | dpuPage cite kind roadmap |
| 92 | KV "transient, derived, and recomputable if lost" | cmxBlog | CONFIRMED | "it is transient, derived, and recomputable if lost" | |
| 93 | NVIDIA claims up to 5x tokens per second; BlueField-4 2H 2026 | cesRelease | CONFIRMED (vendor-claim, roadmap) | "boosting tokens per seconds by up to 5x"; "BlueField-4, which will be available in the second half of 2026" | |
| 94 | Dynamo: CPU cache at least 100 GB and larger than the device cache, or churn | dynamoKvbmDocs | CONFIRMED | "a good rule of thumb is `DYN_KVBM_CPU_CACHE_GB >= 100` and `DYN_KVBM_DISK_CACHE_GB >= DYN_KVBM_CPU_CACHE_GB`. If the CPU cache is smaller than the device cache, KVBM churns (offloading blocks after every forward pass)" | |
| 95 | Disk tier at least as large as the host tier | dynamoKvbmDocs | CONFIRMED | same line | |
| 96 | Filter writes on second sighting, counts decay every 600 s | dynamoKvbmCode | CONFIRMED | block_manager.rs: `FrequencyFilter::new(2, Duration::from_secs(600), 1_000_000, ...)`; filter.rs: "double the count on increment and decrement by 1 on each decay step", `.or_insert(1)`, `*entry >= self.min_offload_frequency` | Added the filter.rs record beside it, since the "second sighting" rule lives in that file |
| 97 | Docs say only that the filter can be disabled | dynamoKvbmDocs | CONFIRMED | "`DYN_KVBM_DISABLE_DISK_OFFLOAD_FILTER` ... Disable the disk offload filter" | |
| 98 | 1 DWPD 30.72 TB drive absorbs about 356 MB/s | micron9650 (derived) | CONFIRMED | "Read-intensive, one drive write per day", "30.72TB"; 30.72e12 / 86,400 = 355.6 MB/s | |
| 99 | `vllm:kv_offload_load_bytes`, `vllm:kv_offload_store_bytes` | vllmOffloadMetrics | CONFIRMED | `LOAD_BYTES = "vllm:kv_offload_load_bytes"`; `STORE_BYTES = "vllm:kv_offload_store_bytes"` | |
| 100 | Hit rate = `vllm:external_prefix_cache_hits_total` / `..._queries_total` | llmd | CONFIRMED | "Offload tier hit rate (`vllm:external_prefix_cache_hits_total` / `vllm:external_prefix_cache_queries_total`)" | |
| 101 | Chart band: host DRAM 512 GB/s | tierRateNote | CONFIRMED | 8 x 64 | |
| 102 | Chart band: EFA 400 GB/s | tierRateNote | CONFIRMED | 3,200 / 8 | |
| 103 | Chart band: FSx 150 GB/s | fsxPerformance | CONFIRMED | 1,200 / 8 | |
| 104 | Chart bands: instance store 18.0, EBS 12.5 | ec2AcceleratedSpecs | CONFIRMED | as rows 43 and 44 | |
| 105 | Clock: tool-call range 2 to 30 s; DeepSeek range placed at 3 h to 3 days | dynamoAgenticBlog, deepseekCaching | CONFIRMED | as rows 32 and 34; the component's header comment says why the range sits at 3 h to 3 days | |
| 106 | Block diagram: BaM measured on A100, PCIe Gen4 x16, ASPLOS 2023 | bam | CONFIRMED | A100 appears 10 times in the paper text; "PCIe ×16 Gen4"; record title ASPLOS 2023 | |
| 107 | Block diagram: "SGLang page_first, Dynamo batched writes" | sglangHicache, vastBlog | CONFIRMED | "Under the `page first` and `page first direct` layouts, all KV cache data belonging to the same page is placed in contiguous memory"; VAST: "Dynamo data persistence now relies on data batching for large asynchronous writes" | |
| 108 | Instance table: p5en, p6-b200, p6-b300 at 12,500 MB/s; p5, p5e at 10,000 | ec2AcceleratedSpecs | CONFIRMED | as row 44 | |

## ORCH-NOTES items

- **Flash as a Cache Tier (and Disaggregated): the Mooncake arXiv record's title says v4 but the
  unversioned abs URL now serves v5.** The page quotes v4's figures. v5 (2026-10-08) changes the
  trace analysis: average input 7,590 to 8,590 tokens, hit ratio "30% to 50%" to "34% to 55%",
  Table 1's 0.30-0.51 rows to 0.34-0.55, and the theoretical reuse "50%" to "55%". The 75% request
  figure is the same in both versions. Fixed: the URL is now `https://arxiv.org/abs/2407.00079v4`
  (accessed 2026-10-23), so it matches the title and the quoted 30% to 50% and "over 50% of cache
  blocks remaining unused". Disaggregated still uses the unversioned URL (see For the orchestrator).

### Items the brief asked for by name

- **Fetch-versus-recompute break-even B\*.** Confirmed. Every derived number reproduces from the
  cited inputs at the printed digits: 151.84 GFLOPs per token at 8K, 17.08 GB/s per node and 2.14
  per GPU, the four-point lines for all four model/GPU pairs, 77.69 (4.55x) and 38.84 for B200,
  2.684 GB and 1.2439 PFLOP, 0.1571 / 0.3143 s, the five fetch times, 26,066 tokens/s and
  105 / 176 / 3,559 s, 2.2 M and 27,466 IOPS. KV per token is 327,680 B, the same figure
  *KV Cache and FlashAttention* gives (its line 16). The FLOPS inputs are dense, half NVIDIA's
  sparse figures, as each page's footnote says.
- **AWS tiers.** Instance store 30.4 TB (8 x 3,800 GB) and 4,400,000 random-read IOPS at 4 KiB on
  all five 8-GPU types: confirmed. EBS 12,500 MB/s (p5en, p6-b200, p6-b300) and 10,000 (p5, p5e):
  confirmed. FSx for Lustre 1,200 Gb/s per client with EFA and GDS on P5 to P6-B300, with Trn2
  excluded: confirmed. EFS Max I/O: llm-d's AWS guide recommends it, and AWS's EFS performance page
  calls it "a previous generation performance type" and recommends General Purpose "for all file
  systems". The page now states both, citing each.
- **Mooncake.** Pinned to v4, whose figures the page quotes. See above.
- **Serving-stack settings.** Every config key and default appears in the source at the pinned tag.
  Five citations pointed at the wrong file in the same repository and tag, and were moved:
  Dynamo's "alternatives" sentence (overview.mdx), vLLM's `secondary_tiers` / `type: fs` (llm-d
  foundations doc), HiCache's `--page-size 64` (best-practices doc), the EFS Max I/O advice (llm-d
  AWS backend README), and the filter's doubling rule (filter.rs, added beside block_manager.rs).
  Confirmed in place: KVBM env vars, NCCL MLA mode, 100 GB sizing, page_size 32, router 0.75 / 0.25,
  vLLM block 16 and 0.92, the metric names, LMCache paths and the 256 example, HiCache tiers and
  backends, NIXL plugins.
- **Vendor drive figures.** Micron 9650: vendor-claim, confirmed. The product page offers "Order
  samples", and production status was not verified (Backlog). Samsung CMM-H: Samsung-authored
  prototype measurements, now measured plus roadmap. Kioxia GP1: now vendor-claim plus roadmap.
  SK hynix AI-N P: roadmap. NVIDIA CMX and BlueField-4: the 5x is vendor-claim plus roadmap, and the
  800 Gb/s DPU figure is now roadmap. VAST and Nebius-WEKA: vendor-claim, confirmed, with
  attribution in the sentence.

## Fixes applied

- `src/sources/FlashCacheTier.ts`, `mooncakeArxiv`: url `https://arxiv.org/abs/2407.00079` to
  `https://arxiv.org/abs/2407.00079v4`, accessed 2026-10-17 to 2026-10-23.
- `src/sources/FlashCacheTier.ts`: new Tier 1 records accessed 2026-10-23. They are
  `efsPerformance` (AWS EFS performance page), `dynamoOffloadOverview` (Dynamo overview.mdx at
  v1.5.1) and `dynamoKvbmFilter` (Dynamo filter.rs at v1.5.1). Also `sglangHicacheBp` (SGLang
  hicache_best_practices.mdx at v0.5.21), `llmdTieredDoc` (llm-d foundations doc at v0.10.0) and
  `llmdAwsEfs` (llm-d AWS backend README at v0.10.0).
- `src/sources/FlashCacheTier.ts`: removed `xeon6Brief`, no longer cited by this section. The header
  comment now notes the records added during verification.
- `src/sections/FlashCacheTier.tsx:23` (tierRateNote): "PCIe 5.0 at 32 GT/s x 16 lanes = 64 GB/s per
  direction before encoding" changed to "PCIe Gen5 at 128 GB/s per H200 across both directions = 64
  GB/s per direction (line rate)".
- `:91` ladder caption: "PCIe 5.0 lane rate`<Cite xeon6Brief/>`" changed to "PCIe Gen5 host
  link`<Cite h200Page/>`".
- `:136` chart caption: `<Cite xeon6Brief/>` changed to `<Cite h200Page/>`.
- `:171` Mooncake 6 / 19 GB/s: `kind="measured"` changed to `kind="simulated"`, with the note
  "Mooncake's analytical model (its Equation 2), not a hardware measurement."
- `:277` "alternatives, not cache layers" quote: `dynamoKvbmDocs` changed to `dynamoOffloadOverview`.
- `:296` vLLM `secondary_tiers`: `llmd` changed to `llmdTieredDoc`.
- `:362` HiCache 64: `sglangHicache` changed to `sglangHicacheBp`.
- `:383` Kioxia GP1: added `<Cite kioxiaGp1 kind="vendor-claim"/>` before the roadmap cite.
- `:394` CMM-H: added `<Cite cmmH kind="roadmap" note="An FPGA prototype, not a shipping product."/>`.
- `:436-440` EFS sentence. Before: "llm-d's AWS guide uses Amazon EFS (Elastic File System) in Max
  I/O mode for its shared filesystem tier, and its connector leaves eviction to the storage system."
  After: "llm-d's AWS guide puts its shared filesystem tier on Amazon EFS (Elastic File System) and
  recommends Max I/O mode`<Cite llmdAwsEfs/>`, which AWS calls a previous-generation mode with higher
  per-operation latency, recommending General Purpose for all file systems.`<Cite efsPerformance/>`
  The llm-d connector leaves eviction to the storage system.`<Cite llmd/>`" The added words are a
  correction. As written, the page told the reader to pick a mode that AWS advises against, and the
  two sources disagree, which is one of the four cases where attribution belongs in the sentence.
- `:480` BlueField-4 800 Gb/s: `<Cite dpuPage/>` changed to `<Cite dpuPage kind="roadmap"/>`.
- `:516` admission filter: added `<Cite dynamoKvbmFilter/>` beside `dynamoKvbmCode`.

No diagram was changed. Visible words went from about 3,071 to about 3,089 (my rough count).

## Checks

- `pnpm exec tsc --noEmit 2>&1 | grep -E "FlashCacheTier|FlashTierLadder|FlashBreakEvenChart|FlashMemoryClock|FlashBlockIoDiagram|sources/FlashCacheTier"`: "no type errors in my files".
- `pnpm exec eslint src/sections/FlashCacheTier.tsx src/sources/FlashCacheTier.ts src/components/Flash{TierLadder,BreakEvenChart,MemoryClock,BlockIoDiagram}.tsx --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t FlashCacheTier`: exit 0, 1 passed, 34 skipped.
- `pnpm exec vitest run src/__tests__/sources.test.ts`: 837 passed, 1 failed. The failure is the
  `sources.md` snapshot, which differs only by this section's new records, the v4 Mooncake URL and
  the dropped Xeon 6 citation. The tier-consistency and pinned-record tests pass.
- Gates from the repo root: `no-ai-tells` exit=0, `svg-a11y` exit=0, `pinned-refs` exit=0,
  `pre-overflow` exit=0, with no hits in my files.
- `pnpm exec vite build --outDir /tmp/vf-FlashCacheTier-dist --emptyOutDir`: exit 0.
  `node scripts/shoot.mjs --sections flash-cache-tier --widths 1440,390`: "4 SVG diagram(s), 0
  React Flow, ok" at both widths. PNGs read at 1440 (all four) and at 390 (the chart, inside its
  640 px scroll wrapper).

## For the orchestrator

- **`sources.md` needs regenerating** for the six new FlashCacheTier records, the Mooncake URL now
  pinned to v4, and the Xeon 6 brief no longer listing FlashCacheTier.
- **Disaggregated Serving and Speculative Decoding, `mooncakeArxiv`:** it still uses the unversioned
  `https://arxiv.org/abs/2407.00079` with a v4 title. Its quoted abstract sentence is the same in v4
  and v5, so pinning to either works. Pin to `...v4` to match this section. Any section that quotes
  the Mooncake trace (7,590 tokens, 30% to 50%, 50% reuse) must pin v4, because v5 revises all three.
- **Intel Xeon 6 Product Brief record** (title "PCIe 5.0 at 32 GT/s per lane") in MainMemoryAndCxl,
  MemoryHierarchyPrimer and CapitalMarketsLens: the brief prints 32 GT/s only for CXL ("Up to 64
  lanes of CXL 2.0 with data transfer rates up to 32 GT/s per lane"), and lists PCIe 5.0 lanes
  without a rate. If those sections cite it for the PCIe 5.0 lane rate, the title overstates what the
  page says.
- No new acronyms from my fixes (EFS was already expanded in the section). The author's glossary list
  stands.

## Backlog

- **Economy cuts** (about 130 words), if the Gate 3 average needs them:
  - the Mooncake 115% / 107% vs 75% sentence (about 30 words), which compares versions and gives
    the reader no figure to use;
  - the CMM-H paragraph (about 60 words), prototype figures that *DDR5, MRDIMM, LPDDR5X and CXL*
    can carry;
  - the "NIXL reaches storage through the same plugin architecture" sentence, which could become a
    cross-link only (about 35 words).
- **GDS P2PDMA and RAID0.** The GDS overview says "RAID0, NVMe Multipathing are currently not
  enabled with PCI P2PDMA in the upstream kernel". Readers who stripe the eight instance-store drives
  with mdadm lose the P2P path. This is a practical line for the "Three things AWS does not publish"
  list, and it is an enhancement, not a correction.
- **HBF grades and stack height.** OCP Table 4 limits grade 1 (0.384 TB/s) to an 8-high stack. "512
  GiB per 16-high stack and 0.384 to 3.072 TB/s per stack" mixes heights, so a 512 GiB stack starts
  at 1.536 TB/s. The *High Bandwidth Flash* section owns the figure, so the wording should follow it.
- **Availability re-checks.** BlueField-4 was "available in the second half of 2026" as of the CES
  release, and today is in that window, so check whether it shipped and drop the roadmap kind if so.
  The Micron 9650 product page offers "Order samples" and its production status was not verified.
- **Tier 0 experiments still open** (register U1 to U3): `fio` large-I/O reads across eight drives,
  `nvme id-ctrl` / `lspci -vv`, and `gdscheck -p` on p5en.
