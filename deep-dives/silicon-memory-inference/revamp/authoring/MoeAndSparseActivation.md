# Change report: MoeAndSparseActivation (nav id `moe`)

Status: DONE, not committed.

Register: `research/2026-10-refresh/05-workloads.md` "Section 23" (23.1 to 23.62 and
Recommended edits) and "Cross-section findings" items 2 to 4. Neuron, Trainium2 and
Trainium3 from `03-aws-cpus.md` sections 0 and 1 (Neuron 2.32.0 current). Cerebras,
Groq, LPX and SambaNova from `04-other-arch.md` sections 0 to 2. NVIDIA from
`02-nvidia.md`. P3 audit `docs/verification/2026-08-01/P3-silicon-numbers.md`.

Files: `src/sections/MoeAndSparseActivation.tsx`, `src/components/MoeRoutingDiagram.tsx`,
`src/components/MoeParamsChart.tsx`, `src/sources/MoeAndSparseActivation.ts` (new, 53
records). Every citation goes through `<Cite>`; no inline `<Link>` citations remain
(one `<Link>` is the Wide-EP example the reader should open, and it also carries a Cite).

Word count (`/tmp/kl-tools/wc.mjs`, built dist, 1440, every disclosure open, Cite badges,
SVG text and code excluded): before 1,717, after 2,129 (+24%). The growth is the chart's
sources table (about 85 words of model names and figures), the new Trn3 and LPX rows, and
the roofline block that states the corrected mental model. Cut to pay for it: the
"What the section covers" and "Why this section exists" narration, the CIM row, the
precision column, the Cerebras benchmark, and duplicated Trainium prose.

## Spine: the four backwards sentences

| Row | Before | After | Source key | Tier | Kind |
|---|---|---|---|---|---|
| 23.5 | Bytes per token drop "by roughly the top-k / N ratio" | Bytes per token fall to about active over total (37/671 = 5.5%), larger than k/N (8/256 = 3.1%), because attention, dense layers and the shared expert are always read. Shown in the routing diagram's note box. | deepseekV3Readme, deepseekV3Config | 1 | spec + derived |
| 23.6 | MoE "moves decode workloads measurably to the right on the roofline" | MoE cuts bytes and FLOPs per token together, so decode moves down the bandwidth axis and keeps its roofline position. Each expert sees about B x k/N tokens, so per-expert intensity is 1/32 of dense for DeepSeek-V3; 206 tokens per step reach the H200 FP8 ridge for dense, about 6,600 in flight for DeepSeek-V3. DeepSeek's EP320 decode quote ("usually within 256 tokens ... memory access rather than computation") backs it. | h200Page (derived), deepseekV3Report | 2 | derived, quote |
| 23.60 | "It does not help compute-bound prefill" | Prefill FLOPs per token fall by the same ratio: about 2 x 37B against 2 x 671B. | deepseekV3Readme | 1 | derived |
| 23.61 | "At batch 1 the all-to-all overhead is unhidden", MoE "does not help latency-sensitive workloads" | At batch 1 one device reads 37 GB per token, not 671 GB; the all-to-all applies only once experts span devices. What MoE does not cut is the memory to hold every expert. | deepseekV3Readme | 1 | derived |

The 206 / 6,600 wording matches `QuantizationAndPrecision.tsx` (lines 360 to 385).

## Other claims changed

| Before | After | Source key | Tier | Kind |
|---|---|---|---|---|
| Router is "a linear projection followed by a softmax" (text and diagram) | Score is a sigmoid in DeepSeek-V3 and Kimi K2, sqrtsoftplus in DeepSeek-V4; diagram says "scores every expert, keeps the top k" | deepseekV3Config, kimiK2Config, deepseekV4ProConfig | 1 | spec |
| Router "typically < 1% of layer FLOPs" | About 0.5% of the layer's expert multiply-adds for DeepSeek-V3, on the critical path | deepseekV3Config | 1 | derived |
| "18x less per-token bytes than naively scaling" | 18x fewer bytes than a dense model of its size; 37 GB vs 671 GB vs about 70 GB for dense 70B at 8-bit | deepseekV3Readme, deepseekV3Config | 1 | derived |
| "DeepSeek-V3 at 18:1 and Kimi K2 at 31:1 are the most aggressive" | DeepSeek-V4-Pro 33:1 and Kimi K2 31:1 are the sparsest; Kimi K3, Qwen3.8, Qwen3-Next 25 to 27:1; DeepSeek-V3 18:1; Mixtral 3.6:1. DeepSeek-V3 to Kimi K3: total 4.2x, active 2.8x | model cards below | 1 | derived |
| Lineup of 8 incl. DBRX, Mixtral 8x22B, sourced by inline links dated 2026-04-24 | Lineup of 11, each row Cite'd (see NEW) | | | |
| "Wide-EP (EP > 8) shipped in TensorRT-LLM v0.21.0" | "Large-scale EP in TensorRT-LLM from v0.21.0" | trtllmV021 | 1 | spec |
| "NVFP4 cubins for mid-high concurrency in v1.0" | NVFP4 MoE kernels "for mid-high concurrency" from v1.0.0 | trtllmV100 | 1 | spec |
| wide_ep link at `tree/main` | `tree/v1.2.1` (example and README) | wideEpExample, wideEpReadme | 1 | spec |
| "MNNVL at 1.8 TB/s per GPU; 130 TB/s aggregate" | 1.8 TB/s per GPU bidirectional (900 GB/s each way); 130 TB/s per rack | blackwellUltraBlog; gb200Nvl72 | 2 | spec |
| "NVL72 was sized so that EP=64 ... fits inside one NVLink domain"; "an MoE choice, not a generic FLOPs choice" | NVIDIA's DeepSeek-R1 decode layout puts about four experts per GPU, EP 64 inside one GB200 NVL72 domain; NVIDIA's internode quote kept | moeBlog | 2 | vendor layout, quote |
| TRT-LLM `--moe_tp_size` / `--moe_ep_size`, `moe_tp_size x moe_ep_size = tp_size` | LLM API `moe_expert_parallel_size`, `moe_tensor_parallel_size`, `moe_cluster_parallel_size`; product must equal the MoE world size | trtllmLlmArgs, trtllmMapping | 1 | spec |
| DeepEP "153 GB/s NVLink intranode and 51 GB/s RDMA at 64-EP on H800/CX7", repo unpinned | Pinned v1.2.1; V1 kernels, EP8 over NVLink 153 GB/s, EP64 over RDMA 51 GB/s, H800 with 400 Gb/s ConnectX-7, near each link's max of about 160 and 50 GB/s | deepEpReadme | 1 | measured |
| vLLM kernels "CUTLASS / TRT-LLM-Gen / CuTeDSL" | MoEBackend values `cutlass`, `flashinfer_trtllm`, `flashinfer_cutlass`, `flashinfer_cutedsl` at v0.31.0 | vllmKernelConfig, vllmArgUtils | 1 | spec |
| SGLang `--moe-a2a-backend` list incl. `ascend_fuseep`, unpinned docs | 12 values at v0.5.21, among them `deepep`, `deepep_v2`, `flashinfer`, `mooncake`, `nixl`, `mori`, `pplx` | sglangExecArgs | 1 | spec |
| Trainium: MoE NKI kernels in Neuron 2.27.0 (Dec 2025); EP uses All-Gather; All-to-All-v on the roadmap | NKI Library MoE kernels from 2.28.0 (February 2026), MXFP8 Blockwise MM Forward from 2.32.0; AllToAllV in the Runtime on Trn2 and Trn3 from 2.32.0, NKI `all_to_all_v` from 2.29.0; vLLM Neuron ships Wide-EP and MXFP4; NxDI in maintenance mode still documents EP over All-Gather | nkiLibNotes, neuronWhatsNew, nxdiMoe | 1 | spec |
| Trn2 "1.28 TB/s per chip intra-node, 256 GB/s inter-instance; 64-chip 3D Torus" | 1,024 GB/s inside the instance plus 256 GB/s across, 1.28 TB/s total; 4x4 2D torus per instance, rings across four | trn2Arch, trainium2Arch | 1 | spec |
| Trn2 "six terabytes of aggregate HBM" | 6,144 GiB across 64 chips | trn2Arch | 1 | spec |
| B300 "288 GB HBM3e+" | 288 GB of HBM3e | blackwellUltraBlog | 2 | spec |
| B200 "180 GB" (uncited) | 180 GB, from DGX B200 1,440 GB across 8 GPUs | dgxB200 | 2 | derived |
| GB300 NVL72 "20 TB" (uncited) | 20 TB | gb300Nvl72 | 2 | spec |
| NVFP4 415 GB vs 690 GB, "1.7x", cited to the InferenceMAX blog | 690 GB FP8 files, 415 GB NVFP4 files, "about 1.66x"; NVFP4 = 4-bit with an FP8 scale per 16-value block | deepseekV32Files, deepseekV32Nvfp4Files, deepseekV32Nvfp4Card (reused from Quantization), nvfp4Blog | 1, 2 | spec |
| Cerebras: "no HBM in steady state", "entire model resident in on-wafer SRAM" | 44 GB SRAM per wafer; a model larger than one wafer splits at layer boundaries across systems, so each layer's experts stay on one wafer | cerebrasInferenceBlog | 2 | vendor |
| Cerebras catalog: Llama 4 Scout/Maverick, Qwen3-235B, GPT-OSS-120B, GLM-4.7 | Shared inference serves gpt-oss-120b at about 3,000 tokens/s (vendor claim); other models are dedicated deployments | cerebrasModels | 2 | vendor-claim |
| Groq: Mixtral and Llama 4 Scout on GroqCloud | Production MoE models are gpt-oss-120b and gpt-oss-20b; architecture licensed to NVIDIA non-exclusively and ships in LPX | groqModels, groqNvidiaLicense | 2 | spec |
| SambaNova: "current product is SN50" | SN50 to ship in the second half of 2026 (roadmap); CoE routes per request, not per token; 520 MiB SRAM, 64 GiB HBM, up to 1.5 TiB DDR per socket; 3.7x DGX H100 on 8 sockets | sn50Blog; sn40lPaper | 2; 3 | roadmap; measured |
| Disaggregation: "prefill activates more experts due to batch dimension"; "Several production stacks (Dynamo, SGLang, DeepSeek-V3)"; "Section 26" | Prefill sends many tokens per expert, decode few; DeepSeek EP32 prefill on 32 GPUs, EP320 decode on 320; Dynamo disaggregates for SGLang, TensorRT-LLM, vLLM; LPX AFD splits attention and FFN inside decode; cross-link by section title | deepseekV3Report, dynamoReadme, lpxBlog | 2, 1, 2 | quote, spec |

Count: 32 claims changed (4 spine + 28 above).

## Claims removed and why

1. CIM row (Samsung HBM-PIM, HyperCIM): register 23.44 CUT; the cited link was a blog index supporting nothing.
2. DBRX and Mixtral 8x22B: replaced by the 2025-2026 lineup; DBRX was the brief's explicit drop.
3. Cerebras Llama 4 Maverick 2,522 tokens/s (Artificial Analysis, May 2025): third-party, stale, and the model is no longer on Cerebras's shared catalog. Replaced by the vendor gpt-oss-120b figure labeled as a vendor claim.
4. Precision column: Cerebras "FP16 / BF16 published" (23.39 UNKNOWN), Groq "INT8 production" (23.40 UNKNOWN), Trainium "BF16, FP8", SambaNova "BF16": none re-verifiable; the column is gone. Precision now appears only where sourced (NVFP4 kernels, MXFP8 and MXFP4 on Neuron, FP4/MXFP4 expert weights in model configs).
5. `torch.all_to_all_vdev_2d` as the planned primitive (23.48 UNKNOWN), superseded by shipped AllToAllV.
6. "The gap vs NVIDIA NCCL is real and worth flagging in customer conversations": unsourced and superseded by AllToAllV and vLLM Neuron Wide-EP.
7. "3D Torus" and "64-chip coherent domain" for Trn2: wrong (2D torus per instance, rings across); "coherent" unsourced.
8. "Cerebras gains ...; NVL72 was sized in part for MoE" ranking paragraph: unsourced and built on the backwards roofline claim.
9. "The single largest lever pulled in inference architecture between 2023 and 2026" and "dense-decoder mental model ... wrong by an order of magnitude": unsourced superlatives.
10. "Throughput per HBM byte rises by the same factor": wrong once per-expert batching is accounted for.
11. "What the section covers" and "Why this section exists" narration: page-history voice.
12. "Groq published optimization blog (May 2025); cluster interconnect undocumented": stale; replaced by the LPX row.
13. "Reach for MoE when the bandwidth-vs-capacity ratio is favorable ...; not otherwise": replaced by the sizing order as the closing action.
14. Inline "accessed 2026-04-24" link captions and the per-table "All vendor-cited rows accessed" line: replaced by Cite records.

Count: 14 removed.

## UNKNOWNs and how the page handles each

- 23.39 Cerebras precision and 23.40 GroqCloud INT8: dropped with the precision column; no precision stated for either.
- 23.48 `torch.all_to_all_vdev_2d`: dropped; the page states only shipped Neuron primitives.
- 23.26 GLM-5.3 (active count not on its card), Mistral-Large-3 and MiniMax-M3: not added; the lineup keeps models whose total, active, k and N are all on a pinned card or config.
- Llama 4 Maverick routing (1 of 128 + 1 shared) is from Meta's announcement; the `llama4Blog` record's title was not re-fetched this session (see orchestrator notes).

## NEW content and sources

- Lineup rows: Qwen3-Next-80B-A3B 80B/3B, 10 of 512 + 1 (qwen3NextReadme); DeepSeek-V4-Flash 284B/13B, 6 of 256 + 1 (deepseekV41Flash, deepseekV4FlashConfig); DeepSeek-V4-Pro 1.6T/49B, 6 of 384 + 1 (deepseekV41Flash, deepseekV4ProConfig); Qwen3.8-2.4T-A95B 2.4T/95B, 10 of 512 + 1 (qwen38Readme); Kimi K3 2.8T/104B, 16 of 896 + 2 (kimiK3Readme). All Tier 1, pinned SHAs. Existing rows re-sourced to pinned cards and configs.
- Trn3 UltraServer row: 64 (Gen1) or 144 (Gen2) chips on NeuronSwitch-v1, a switched fabric replacing the torus (trn3Arch, T1); AWS positions it for MoE (trn3Page, T2 vendor-claim); Gen2 holds 20,736 GiB (trn3Arch).
- Vera Rubin NVL72 with Groq 3 LPX row: in full production (lpxProduction); LPX runs FFN and MoE experts in decode, GPUs keep attention, Dynamo orchestrates, AFD; 500 MB SRAM per LPU, up to 512 GB DRAM per tray (lpxBlog). Never described as SRAM-only.
- DeepSeek's EP32 prefill and EP320 decode quotes (deepseekV3Report section 3.4).
- 4-bit experts from training: DeepSeek-V4-Pro `expert_dtype` fp4, Kimi K3 MXFP4, gpt-oss-120b MXFP4 MoE weights.
- Closing action: size memory for total parameters, keep the expert group inside one scale-up domain, then put about 6,600 tokens in flight for DeepSeek-V3 on H200 FP8.

## Diagram changes and rendered check

- `MoeRoutingDiagram`: React Flow replaced by inline SVG (role="img", `<title id="moe-routing-title">`, white full-bleed background, `moer-` classes, fonts at least 10 px). Wide layout 760 x 390: token, router, eight experts (two picked) plus a shared expert, weighted sum, and a note box carrying the 23.5 fix ("DeepSeek-V3: 37B of 671B parameters (5.5%), while k / N alone is 8 of 256 (3.1%)"). Narrow layout 400 x 456 as a vertical stack for phones.
- `MoeParamsChart`: linear bars replaced by a log-scale dumbbell (filled = active, open = total) for 11 models, with ratio and "k of N +shared" columns, a per-row `<title>` tooltip, and a narrow 400-wide layout. Every figure is in a Cite'd table under the chart.
- Phone handling: both components switch to the narrow vertical layout below a 560 px container (ResizeObserver; the wide layout renders when ResizeObserver is absent, as in jsdom). The brief allows a vertical stack legible at 390 instead of the `overflowX` wrapper; the wrapper was tried first and hid half of each diagram at 390.
- `shoot.mjs --sections moe --widths 1440,390`: "2 SVG diagram(s), 0 React Flow, ok" at both widths, after the last edit. PNGs read at both widths: no text collisions, no labels on arrows, no clipping, labels (10 px minimum) legible at 390. The chart's sources table and the silicon table scroll sideways at 390 with readable column headers (Total and Active columns widened to 96 px after "Active" wrapped mid-word).

## Leverage pass: claim-set diff (assertions new in the after)

| New assertion | Source |
|---|---|
| Recent open-weight releases DeepSeek-V4-Pro, Qwen3.8, Kimi K3 are MoE at 1.6T to 2.8T | deepseekV41Flash, qwen38Readme, kimiK3Readme |
| Memory follows total, bytes and FLOPs follow active, per-expert work follows routed tokens (1/32) | deepseekV3Readme, deepseekV3Config (derived) |
| Router score functions: sigmoid (V3, K2), sqrtsoftplus (V4) | deepseekV3Config, kimiK2Config, deepseekV4ProConfig |
| Router cost about 0.5% of expert multiply-adds | deepseekV3Config (derived) |
| Dense 70B at 8-bit reads about 70 GB per token | deepseekV3Readme (derived, arithmetic) |
| Sparsity ratios and 4.2x total / 2.8x active growth | model cards (derived) |
| Per-expert intensity 1/32; 206 tokens; about 6,600 tokens in flight | h200Page (derived) |
| DeepSeek EP320 decode memory-bound, EP32 prefill | deepseekV3Report |
| Dispatch and combine, all-to-all twice per MoE layer | deepEpReadme |
| 1.8 TB/s bidirectional = 900 GB/s each way | blackwellUltraBlog |
| LLM API MoE parallel-size names and the world-size constraint | trtllmLlmArgs, trtllmMapping |
| DeepEP numbers are close to link maximum | deepEpReadme |
| 16 CC-Cores per chip orchestrate collectives | trainium2Arch |
| Trn3 switches connect every chip to every other | trn3Arch |
| vLLM Neuron ships Wide-EP and MXFP4; AllToAllV in Runtime 2.32.0; NKI `all_to_all_v` 2.29.0; NxDI maintenance mode | neuronWhatsNew, nxdiMoe |
| NKI Library MoE kernels from 2.28.0, MXFP8 Blockwise MM from 2.32.0 | nkiLibNotes |
| Cerebras 44 GB SRAM per wafer, layer-boundary split | cerebrasInferenceBlog |
| Trn3 Gen2 20,736 GiB | trn3Arch |
| Fewer GPUs after quantization lower EP degree and all-to-all traffic | follows from the cited 1.66x (no new number) |
| Dynamo disaggregates for SGLang, TensorRT-LLM, vLLM | dynamoReadme |
| LPX AFD, 500 MB SRAM, 512 GB DRAM per tray, full production | lpxBlog, lpxProduction |
| Groq licensing to NVIDIA | groqNvidiaLicense |
| SN50 ships second half of 2026 | sn50Blog (roadmap) |

No assertion in the after is unsourced.

## Register corrections found by fetch

- 05 row 23.10 says DeepSeek-V4 uses a sigmoid router; the V4-Pro config at 72e1d32 says `scoring_func: sqrtsoftplus`. The page follows the config.
- 02 row B33 (UNKNOWN) and P3 ("UNSOURCEABLE") for the TensorRT-LLM NVFP4 MoE cubins are superseded: the v1.0.0 release notes contain "Add TRTLLM MoE nvfp4 cubins for mid-high concurrency".

## Orchestrator notes (shared files)

- Regenerate `sources.md`: `sources.test.ts > keeps sources.md in sync with the registry` fails only because this section's records are new. The "same tier per URL" test passes.
- New records other sections may want: trn3Arch, neuronWhatsNew, nxdiMoe (v2.32.0), trtllmLlmArgs, dynamoReadme (v1.5.1), deepEpReadme (v1.2.1), sglangExecArgs (v0.5.21), vllmKernelConfig and vllmArgUtils (v0.31.0).
- `llama4Blog` title "The Llama 4 herd (Llama 4 Scout and Maverick announcement)" was not re-fetched; confirm against Meta's page.
- Glossary acronyms used here: MoE, FFN, EP, MNNVL, RDMA, EFA, NKI, NxD Inference (NxDI), CC-Core, LPU, LPX, AFD, CoE, KV, HBM, DDR, FP8, NVFP4, MXFP8, MXFP4, SRAM, DRAM.
- Cross-links by section title: Roofline and Arithmetic Intensity; Grace-Blackwell and UltraServer; Quantization and Precision; Disaggregated Serving and Speculative Decoding.
- React Flow is no longer used by this section, so no flow PNGs are produced for `moe`.
