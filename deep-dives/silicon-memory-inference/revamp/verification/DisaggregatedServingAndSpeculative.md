# Verification: Disaggregated Serving and Speculative Decoding

Verified: 2026-10-18. Claims checked: 62 (sampled: 0; every claim was checked). Confirmed 56,
wrong 0, unsupported 4, mislabelled 2, unverifiable 0.

Every source was re-fetched on 2026-10-18 as raw text, using curl with its default User-Agent
and no personal data. That covers 14 pinned GitHub and Hugging Face files (raw.githubusercontent
at the cited tags, the HF README at 314113f), two GitHub directory listings, the EC2
accelerated-computing specification, the P6 page, the Blackwell Ultra and LPX blogs, the H100
page, the AWS llm-d blog, two Neuron 2.32.0 pages, six arXiv abstracts, and the Leviathan,
DeepSeek-V3, Llama 3 and DistServe PDFs (pdftotext).

## Gate 3 score: 7/10

Every number on the page checks out. The KV sizes, all ten transfer times and the
speculative-decoding examples recompute exactly, and the six fixes are about scope and labels,
not figures. Economy is what holds the section at 7. It grew 63%, the most in the dive, and the
GLM-5 recipe, the R1 recipe, the llm-d container and the LPX split each come up in two or three
blocks. The decision paragraph's "34%" puts the EFA share of one GPU against a prefill on eight
GPUs. Two things would lift the section to 8, both in the Backlog because they are cuts and a
reframe, not corrections: the cuts listed there (about 150 words) and a like-for-like handoff
comparison.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 56 of 62 confirmed as shipped. Exact: 327,680 B, 2.68 / 41.9 GB, 890 B and 368x, 900 GB/s one way, 3,200 / 6,400 Gbps, every per-GB and 8K time, 0.157 s, 4% / 34%, E = 3.36 and 2.8x, E = 1.94 and 1.6x, 6.5x / 1.38x, 85-90% / 1.8x, 70%. No figure was wrong. Four claims were unsupported as worded and two were mislabelled (LPX verb and placement, DistServe "up to", Neuron DI on Inf2, diagram title, NVLink one-way not marked derived, DeepSeek MTP not vendor-claim). |
| Mental model or practical value | 7 | Model builders: the transfer table, Leviathan's E and the "memory traffic falls by E while spare compute lasts" argument. Things the reader acts on: the UCX defaults with the LIBFABRIC settings, the vLLM acceptance-length PromQL, and the Neuron prefix-caching limit. The handoff comparison sets one GPU's EFA share (54 ms) against an eight-GPU prefill (0.157 s). Per-GPU EFA and per-GPU FLOPS scale together, so the like-for-like ratio is about 4% at any width, and the 34% only arises when the receiving side is narrower than the sender. The SGLang card's Mooncake-origin sentence passes neither test. |
| Shape | 8 | It introduces both techniques before dissecting them. Every h2 description states a payoff. 327,680 vs 890 lands twice (the handoff block and the close), and the speedups are demoted into an ExpandableSection. It ends on "measure two numbers". Some supporting evidence stays inline: the 4-of-32 EFA interfaces and both pool layouts. |
| Writing | 8 | no-ai-tells passes and there are no "Section N" references. Sentence attribution stays only where it is load-bearing: "AWS reports" and "DeepSeek reports" (vendor claims), the recipe's TCP warning, "the two AWS pages disagree" (a conflict), and "Authors measured" (grading). The intro packs LPU, FFN, MoE and NVL72 into two sentences, and the EFA paragraph carries five code tokens. |
| Economy | 5 | 760 to 1,236 words (+63%, the author's count); my fixes add about 20 more (my estimate). Repeats: the GLM-5 recipe appears in the EFA path, the Dynamo card and Combining. The R1 recipe appears in pool sizing and the Dynamo card. The llm-d container appears in its card and in Combining. The LPX split appears in the intro, the diagram inset and the Dynamo card. Cut candidates are under Backlog. |
| Diagrams | 9 | Inline SVG with `role="img"`, `aria-labelledby` and a `<title>`. Probe: "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390. Reading the PNGs: no text crosses a box or line, and "prompt" and "tokens" sit beside their segments. At 390 the SVG keeps 640 px inside its scroll wrapper. |

## Claims

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Sharing GPUs makes the phases interfere and forces one parallelism plan | distServe | CONFIRMED | Abstract: "not only leads to strong prefill-decoding interferences but also couples the resource allocation and parallelism plans for both phases" | |
| 2 | "Rubin GPUs run prefill and decode attention while the Groq 3 LPX, a rack of LPUs, runs decode's FFN and MoE layers and can draft" | lpxBlog | UNSUPPORTED as worded | "Deployed alongside Vera Rubin NVL72, LPX accelerates the latency-sensitive portions of the decode loop, including FFN and MoE expert execution, while Rubin GPUs continue to handle prefill and decode attention"; "LPX is well-suited to act as the draft-generation engine" | Rewritten to NVIDIA's wording: "its own rack of LPUs ... deployed alongside Vera Rubin NVL72, accelerates the latency-sensitive portions of the decode loop, including FFN ... and MoE ... expert execution, while Rubin GPUs handle prefill and decode attention. LPX can also draft" |
| 3 | Activations cross between GPUs and LPUs every token | lpxBlog | CONFIRMED | "Decode is a repeated per-token loop"; "intermediate activations are handed off to LPUs for FFN/MoE execution, and outputs return to the GPUs" | |
| 4 | NIXL is a point-to-point transfer library | nixlReadme | CONFIRMED | "targeted for accelerating point to point communications in AI inference frameworks" | |
| 5 | NIXL moves the cache GPU memory to GPU memory over NVLink or EFA, without blocking other forward passes | dynamoDisaggDoc, nixl | CONFIRMED | Doc: "transfer KV cache directly from the VRAM of the prefill engine to the VRAM of the decode engine. The KV transfer is non-blocking"; plugins dir at v1.5.0 lists `libfabric`, `ucx` | |
| 6 | "DistServe served 7.4x more requests within latency targets" | distServe | UNSUPPORTED (scope dropped) | PDF §1: "DistServe can serve up to 7.4× more requests or 12.6× tighter SLO"; §6: "up to 7.4× higher rates" | Now "up to 7.4x" |
| 7 | Size prefill for TTFT, decode for TPOT | distServe | CONFIRMED | "time to first token (TTFT) for the prefill phase and time per output token (TPOT) ... for the decoding phase" | |
| 8 | Dynamo R1 recipe on 36 GB200 GPUs: decode eight nodes, prefill one | dynamoR1Recipe | CONFIRMED | deploy.yaml: `numNodes: 9`; prefill "uses 1 node", `gpu: "4"`; decode `nodeCount: 8`, `gpu: "4"`; TP 4 and 32 | |
| 9 | AWS llm-d test of GPT-OSS on one P6-B200: four one-GPU prefill pods, one four-GPU decode pod | awsLlmdBlog | CONFIRMED | "4 prefill pods each with a tensor parallel degree of 1 and 1 decode pods with a tensor parallel degree of 4" on "an ml.p6-b200.48xlarge" | |
| 10 | Llama 3.1 70B BF16: 327,680 B per token (derived) | llama3Herd | CONFIRMED | Table 3, 70B: Layers 80, Model Dimension 8192, Attention Heads 64, Key/Value Heads 8 (head dim 128). 2 x 80 x 8 x 128 x 2 = 327,680 | |
| 11 | "2.7 GB at 8K tokens, 42 GB at 128K"; table header "8K, 2.7 GB" | llama3Herd (derived) | CONFIRMED (rounded) | 8,192 x 327,680 = 2.684 GB; 128,000 x 327,680 = 41.94 GB. KV Cache and FlashAttention shows 2.68 GB and "128,000-token ... 41.9 GB". "128K" read as 131,072 would give 42.9 GB | Changed to 2.68 GB and 41.9 GB at 128,000, header "8K, 2.68 GB", matching KV Cache and FlashAttention and Flash as a Cache Tier |
| 12 | DeepSeek-V4.1-Flash: sparse attention and FP4 entries, 890 bytes per token of global KV | deepseekV41Flash | CONFIRMED | README: "Compressed Sparse Attention 2 (CSA2) ... Combined with FP4 main KV caching ... reduce the global KV cache footprint to 890 bytes per token" | |
| 13 | About 370 times less (derived) | deepseekV41Flash | CONFIRMED | 327,680 / 890 = 368.2 | |
| 14 | NVLink 5: 900 GB/s each way | blackwellUltraBlog | MISLABELLED (kind) | "Per-GPU Bandwidth: 1.8 TB/s bidirectional (18 links x 100 GB/s)". The one-way figure is our halving | `kind="derived"`, note "1.8 TB/s bidirectional per GPU / 2." |
| 15 | p5.48xlarge 3,200 Gbps per instance, 8 GPUs | ec2AcceleratedSpecs | CONFIRMED | Network table: "p5.48xlarge ... 3200 Gigabit"; accelerators "8 x NVIDIA H100 GPU" | |
| 16 | One P5 GPU 400 Gbps (derived) | ec2AcceleratedSpecs | CONFIRMED | 3,200 / 8 = 400 | |
| 17 | One P6-B300 GPU 800 Gbps (derived) | ec2AcceleratedSpecs | CONFIRMED | "p6-b300.48xlarge ... 6400 Gigabit", "8 x NVIDIA B300 GPU"; 6,400 / 8 = 800 | |
| 18 | One P6e-GB200 GPU: 400 Gbps or 800 Gbps | p6Page, ec2AcceleratedSpecs | CONFIRMED (both); conflict not stated in the visible row | P6 page: "400 GB ps per GPU of EFAv4 networking for a total of 28.8 Tbps per P6e-GB200 UltraServer". Spec: "p6e-gb200.36xlarge ... 3200 Gigabit", "4 x NVIDIA B200 GPU" | Row now reads "EFA, one P6e-GB200 GPU; the two AWS pages disagree" |
| 19 | Per GB: 1.1 / 2.5 / 20 / 10 / 20 or 10 ms (derived) | as rows | CONFIRMED | 1/900 = 1.11 ms; 1/400 = 2.5; 1/50 = 20; 1/100 = 10 | |
| 20 | 8K, 2.68 GB: 3.0 / 6.7 / 54 / 27 / 54 or 27 ms (derived) | as rows | CONFIRMED | 2.684 / 900 = 2.98 ms; / 400 = 6.71; / 50 = 53.7; / 100 = 26.8 | |
| 21 | Per-direction reading stated | transferNote | CONFIRMED | Note: "NVLink 5 is 1.8 TB/s bidirectional, used here at 900 GB/s one way. EFA figures carry no direction label; the times read them as per-direction line rates." Neither AWS page labels a direction | |
| 22 | 8K prefill of the 70B on 8x H100 about 0.16 s at dense BF16 peak (derived) | h100Page | CONFIRMED | H100 SXM "BFLOAT16 Tensor Core* 1,979 teraFLOPS", "* With sparsity", so 989.5 dense. 1.2435 PFLOP (Flash as a Cache Tier: 151.8 GFLOP/token x 8,192) / (8 x 989.5 T) = 0.157 s | |
| 23 | Handoff 4% (instance) and 34% (one GPU) of that prefill (derived) | h100Page | CONFIRMED (arithmetic) | 6.71 / 157 = 4.3%; 53.7 / 157 = 34.2%. The framing caveat is under Backlog | |
| 24 | A one-GPU worker gets 4 of a p5.48xlarge's 32 EFA interfaces | awsLlmdBlog | CONFIRMED | "a p5.48xlarge instance has 8 H100 GPUs with 32 Elastic Fabric Adapter interfaces, so you should configure each replica to have 4 EFA interfaces per GPU" | |
| 25 | NIXL reaches EFA through its libfabric plugin, alongside UCX and storage plugins | nixl | CONFIRMED | v1.5.0 `src/plugins`: libfabric, ucx, posix, cuda_gds, obj, hf3fs, azure_blob, gusli, infinia, mooncake, uccl, gpunetio | |
| 26 | vLLM NixlConnector defaults to UCX | vllmNixlWorker | CONFIRMED | base_worker.py L560-561: `get_from_extra_config("backends", ["UCX"])` | |
| 27 | Set `"backends": ["LIBFABRIC"]` in `kv_connector_extra_config` | awsLlmdBlog | CONFIRMED | `'{"kv_connector":"NixlConnector", ..."kv_connector_extra_config": {"backends": ["LIBFABRIC"]}}'` | |
| 28 | SGLang defaults to Mooncake, and to UCX under NIXL | sglangDisagg, sglangEnviron | CONFIRMED | disagg.py: `help="... Default is mooncake."`, `= "mooncake"`; environ.py L711: `SGLANG_DISAGGREGATION_NIXL_BACKEND = EnvStr("UCX")` | |
| 29 | `--disaggregation-transfer-backend nixl` with `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC` | dynamoGlm5EfaRecipe | CONFIRMED | deploy.yaml: `--disaggregation-transfer-backend nixl`; README: "Sets `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC`" | |
| 30 | The recipe warns UCX otherwise falls back to TCP on kernel 6.8 and later | dynamoGlm5EfaRecipe | CONFIRMED | "without this, SGLang defaults to UCX, which silently falls back to TCP on kernel ≥ 6.8" | |
| 31 | Dynamo disaggregates SGLang, TensorRT-LLM and vLLM backends | dynamoReadme | CONFIRMED | "it doesn't replace SGLang, TensorRT-LLM, or vLLM"; feature table "Disaggregated Serving ✅ ✅ ✅" | |
| 32 | Dynamo orchestrates the Rubin-plus-LPX decode loop | lpxBlog | CONFIRMED | "NVIDIA Dynamo orchestrates the disaggregated decode loop by routing work across GPU and LPU backends" | |
| 33 | Pinned recipes cover DeepSeek-R1 on GB200 and GLM-5 on GB200 over EFA | dynamoR1Recipe, dynamoGlm5EfaRecipe | CONFIRMED | Paths `recipes/deepseek-r1/trtllm/disagg/wide_ep/gb200` and `recipes/glm-5-nvfp4/sglang/disagg/efa` at v1.5.1 | |
| 34 | vLLM P/D disaggregation is experimental; connectors NixlConnector, MooncakeConnector, LMCache | vllmDisaggDoc | CONFIRMED | "This feature is experimental and subject to change"; "NixlConnector", "MooncakeConnector", "LMCacheConnectorV1" | |
| 35 | `--disaggregation-mode` makes a server prefill or decode | sglangDisagg | CONFIRMED | `Literal["null", "prefill", "decode"]`, '"prefill" for prefill-only server, and "decode" for decode-only server' | |
| 36 | Transfer backends include mooncake, nixl, ascend and mori | sglangChoices | CONFIRMED | `DISAGG_TRANSFER_BACKEND_CHOICES = ["mooncake", "nixl", "ascend", "fake", "mori", "mooncake_tcp"]` | |
| 37 | Mooncake: KV-centric architecture separating prefill and decode clusters | mooncakeArxiv | CONFIRMED | v5 abstract: "a KVCache-centric disaggregated architecture that separates the prefill and decoding clusters" (record title says v4; see For the orchestrator) | |
| 38 | llm-d: a Kubernetes stack on vLLM with P/D disaggregation and wide expert parallelism | llmdReadme | CONFIRMED | "distributed inference serving stack optimized for production deployments on Kubernetes"; "prefill/decode disaggregation and wide expert-parallelism"; "integrating ... vLLM and Kubernetes" | |
| 39 | AWS llm-d container with EFA support for EKS and SageMaker HyperPod | awsLlmdBlog | CONFIRMED | "a new container ghcr.io/llm-d/llm-d-aws that includes libraries that are specific to AWS, such as Elastic Fabric Adapter (EFA) and libfabric"; "Access to a SageMaker HyperPod or EKS cluster" | |
| 40 | AWS reports up to 70% more tokens/s than plain vLLM, GPT-OSS, 1,024 in and out (vendor-claim) | awsLlmdBlog | CONFIRMED | "increases tokens per second by up to 70% as concurrency increases compared to using a standard vLLM deployment ... 1024 input tokens and receiving 1024 output tokens up to a concurrency of 128" | |
| 41 | NxD Inference DI in Beta "on Inf2, Trn1 and Trn2", moving KV over EFA | neuronDisagg | UNSUPPORTED (Inf2) | The page's only instance scope is the tag "This document is relevant for: Inf2, Trn1, Trn2". Its mechanism: "transfer the KV cache through EFA from Neuron device to Neuron device". EC2 spec, EFA column: inf2.xlarge, 8xlarge, 24xlarge and 48xlarge "✗ No"; trn1.32xlarge, trn1n.32xlarge, trn2.3xlarge and trn2.48xlarge "✓ Yes"; trn1.2xlarge "✗ No" | Now "in Beta on Trn1 and Trn2 instances with EFA", with a derived ec2AcceleratedSpecs cite whose note gives the EFA rows. Card heading "Trainium and Inferentia" changed to "Trainium" |
| 42 | KV device to device, no copy through host; automatic prefix caching not supported | neuronDisagg | CONFIRMED | "This is a zero copy transfer, meaning that we do not copy the KV cache from a Neuron device to CPU"; "Automatic Prefix Caching is not supported with DI." | |
| 43 | Drafter proposes γ; one target pass emits 1 to γ+1 tokens, distribution unchanged | leviathan | CONFIRMED | "geometric variable, with success probability 1 − α and cap γ + 1"; abstract "without changing the distribution" | |
| 44 | Drafters: small models, EAGLE and Medusa heads, MTP modules in the checkpoint (DeepSeek-V3) | eagle3, medusa, deepseekV3Report | CONFIRMED | Medusa: "adding extra decoding heads"; EAGLE-3: draft model reusing target features; DeepSeek-V3 §5.4.3: "predicts the next 2 tokens through the MTP technique. Combined with the framework of speculative decoding" | |
| 45 | E = (1 - α^(γ+1)) / (1 - α) | leviathan | CONFIRMED | §3.1, Equation (1): "E(# generated tokens) = (1 − α^(γ+1)) / (1 − α)" | |
| 46 | Speedup E / (1 + γc), c = drafter step time over target's | leviathan | CONFIRMED | Theorem 3.8: "(1−α^(γ+1)) / ((1−α)(γc+1))"; Definition 3.7: "the ratio between the time for a single run of Mq and the time for a single run of Mp" | |
| 47 | α 0.8, γ 4, c 0.05: E 3.4, 2.8x; α 0.5: 1.9, 1.6x (derived) | leviathan | CONFIRMED | 0.67232 / 0.2 = 3.36, / 1.2 = 2.80; 0.96875 / 0.5 = 1.94, / 1.2 = 1.61. "c was always less than 0.05" (§3.3) | |
| 48 | Memory traffic per token falls by E, provided spare compute covers the extra evaluations | leviathan | CONFIRMED | "the target model's weights and KV cache can be read once per execution of Algorithm 1, so the number of memory accesses ... shrinks by a factor of (1−α^(γ+1))/(1−α)"; §3.5 "assuming enough compute resources" | |
| 49 | EAGLE-3 up to 6.5x, 1.38x throughput in SGLang at batch 64 | eagle3 | CONFIRMED | "speedup ratio up to 6.5x ... In the SGLang framework, EAGLE-3 achieves a 1.38x throughput improvement at a batch size of 64" | |
| 50 | Drafters a couple of orders of magnitude smaller reached α 0.5 to 0.9 | leviathan | CONFIRMED | §4.2: "approximation models that are a couple of orders of magnitude smaller than the target model tend to produce α values between 0.5 and 0.9" | |
| 51 | DeepSeek-V3 MTP second token accepted 85-90%, 1.8x TPS (`measured`) | deepseekV3Report | MISLABELLED (kind) | §5.4.3: "the acceptance rate of the second token prediction ranges between 85% and 90% ... delivering 1.8 times TPS". A vendor's figure for its own model in a Tier 2 vendor report | `kind="vendor-claim"`; sentence now "DeepSeek reports its V3 MTP module's second token accepted ..." |
| 52 | Mean acceptance length = 1 + accepted_tokens_total / drafts_total | vllmSpecMetrics | CONFIRMED | "The mean acceptance length (conventionally including bonus tokens) can be calculated using: 1 + (rate(vllm:spec_decode_num_accepted_tokens_total) / rate(vllm:spec_decode_num_drafts_total))" | |
| 53 | vLLM and SGLang ship EAGLE-3, MTP (NEXTN) and DFlash | vllmSpecConfig, sglangSpec | CONFIRMED | vLLM: `EagleModelTypes = Literal["eagle", "eagle3", ..., MTPModelTypes, DFlashModelTypes]`; SGLang: "Builtins: EAGLE, EAGLE3, NEXTN, STANDALONE, NGRAM, DFLASH, ..." | |
| 54 | TensorRT-LLM supports speculative decoding | trtllmSpecDoc | CONFIRMED | "There are two flavors of speculative decoding currently supported in the PyTorch backend" | |
| 55 | NxD Inference: draft model, Medusa, EAGLE v1, fused speculation | neuronFeatureGuide | CONFIRMED | "Speculative decoding with a draft model", "Medusa speculative decoding", "NxD Inference supports EAGLE v1 with a flat draft structure", heading "Fused Speculation" | |
| 56 | 2x to 3x for the original method on T5-XXL | leviathan | CONFIRMED | Abstract: "on T5-XXL and show a 2X-3X acceleration" | |
| 57 | Medusa-2 2.3x to 3.6x, tree of candidates per pass | medusa | CONFIRMED | "Using a tree-based attention mechanism, Medusa constructs multiple candidate continuations and verifies them simultaneously"; "Medusa-2 further improves the speedup to 2.3-3.6x" | |
| 58 | DFlash over 6x, block-diffusion drafter | dflash | CONFIRMED | "employs a lightweight block diffusion model for parallel drafting ... achieves over 6x lossless acceleration" | |
| 59 | GLM-5 recipe: SGLang across five p6e-gb200.36xlarge, decode 16 GPUs with EAGLE, prefill 4, KV on NIXL libfabric over EFA | dynamoGlm5EfaRecipe | CONFIRMED | README: "5 × p6e-gb200.36xlarge"; table Decode 4 nodes x 4 = 16, Prefill 1 x 4 = 4; deploy.yaml `--speculative-algorithm EAGLE`; "KV cache transfer over AWS Elastic Fabric Adapter (EFA) RDMA via NIXL's LIBFABRIC backend" | |
| 60 | Close: 327,680 vs 890 B/token | llama3Herd, deepseekV41Flash | CONFIRMED | As 10 and 12 | |
| 61 | Diagram boxes: prefill compute-bound, TTFT; decode memory-bound, TPOT; KV once per request; GPU "NIXL over NVLink, or libfabric over EFA"; Trainium "Neuron runtime over EFA, zero copy"; inset Attention on Rubin GPUs, FFN/MoE on LPUs, activations every token | distServe, dynamoDisaggDoc, nixl, neuronDisagg, lpxBlog | CONFIRMED | As 5, 7, 25, 42; LPX: "GPUs run attention over the accumulated KV cache, intermediate activations are handed off to LPUs for FFN/MoE execution" | |
| 62 | Diagram `<title>`: "On Vera Rubin with Groq 3 LPX ... FFN and MoE layers run on LPUs" | lpxBlog | UNSUPPORTED as worded | As 2 | Title now: "With a Groq 3 LPX rack deployed alongside Vera Rubin NVL72, decode splits again: attention stays on Rubin GPUs, LPUs accelerate latency-sensitive work such as FFN and MoE expert execution, and activations cross between them every token." Rendered labels unchanged |

Pinning: every GitHub URL is at a tag (v1.5.1, v1.5.0, v0.31.0, v0.5.21, v0.10.0, v1.2.1), and the
Hugging Face URL is at a commit SHA. Line anchors match the cited code, except vllmNixlWorker's
`#L559-L561`, which starts one line early (the call sits on L560-561); the content is still in
range. Tiers match the brief: papers are Tier 3 and `measured`, the Llama 3 and DeepSeek reports
are Tier 2, and code and docs are Tier 1.

## ORCH-NOTES items

- **KV handoff sizing: CONFIRMED, now matching.** 327,680 B per token, 2.68 GB at 8,192 tokens
  and 41.9 GB at 128,000 tokens all recompute. The prose and the table header rounded to 2.7 GB
  and "42 GB at 128K"; both now read 2.68 / 41.9 at 128,000, as KV Cache and FlashAttention and
  Flash as a Cache Tier do. All ten transfer times recompute with NVLink 5 at 900 GB/s one way and
  EFA at 50 GB/s per P5 GPU, 400 GB/s per p5.48xlarge and 100 GB/s per P6-B300 GPU. The
  per-direction reading is stated in the table note. The 900 GB/s cite was not marked as derived
  from "1.8 TB/s bidirectional"; it now is.
- **EFA per GPU on P6e-GB200: both figures CONFIRMED, conflict now stated.** The row showed
  "400 Gbps or 800 Gbps" and explained the conflict only in the note. The row label now says "the
  two AWS pages disagree", matching Communication and Scale-Out. The P6 page also conflicts with
  itself (see For the orchestrator).
- **LPX placement: fixed.** The intro said LPX "runs decode's FFN and MoE layers" and gave no
  placement. It now uses NVIDIA's wording: "its own rack of LPUs ... deployed alongside Vera Rubin
  NVL72, accelerates the latency-sensitive portions of the decode loop, including FFN ... and
  MoE ... expert execution". The diagram title was scoped the same way. The inset labels stay: the
  blog's AFD description ("activations are handed off to LPUs for FFN/MoE execution") supports
  them.
- **Speculative decoding: CONFIRMED, with one label fix.** Leviathan's Equation (1), Theorem 3.8,
  c < 0.05 and α 0.5 to 0.9 all match. The worked examples recompute: 3.36 tokens and 2.80x, 1.94
  tokens and 1.61x. The paper figures for EAGLE-3 (6.5x, 1.38x at batch 64), Medusa-2 (2.3-3.6x),
  DFlash (over 6x) and T5-XXL (2-3x) are all `measured` with "Authors measured". DeepSeek-V3's MTP
  85-90% and 1.8x is a vendor's figure for its own model; it is now `vendor-claim` with "DeepSeek
  reports". The EAGLE-3 and MTP availability claims check against code pinned at vLLM v0.31.0
  (`eagle3`, MTP types, `dflash`) and SGLang v0.5.21 (`EAGLE3`, `NEXTN`, `DFLASH`). AWS's 70% is
  marked `vendor-claim` and says "AWS reports".
- **Length +63%: Economy 5.** One block repeats another on the same page: the GLM-5 recipe in the
  Dynamo card, the EFA path and Combining. Each mention serves a different purpose (recipe
  pointer, TCP warning, composition example), so none is pure padding and nothing was cut. Cut
  candidates are under Backlog.

## Fixes applied

- `src/sections/DisaggregatedServingAndSpeculative.tsx:41`: `<Cite s={S.blackwellUltraBlog} />`
  became `<Cite s={S.blackwellUltraBlog} kind="derived" note="1.8 TB/s bidirectional per GPU / 2." />`.
- `:81`: path `'EFA, one P6e-GB200 GPU'` became `'EFA, one P6e-GB200 GPU; the two AWS pages disagree'`.
- `:124-129`: "Rubin GPUs run prefill and decode attention while the Groq 3 LPX, a rack of LPUs
  (...), runs decode's FFN (...) and MoE (...) layers and can draft for speculative decoding.
  Activations then cross between the two chips every token." became "the Groq 3 LPX, its own
  rack of LPUs (...) deployed alongside Vera Rubin NVL72, accelerates the latency-sensitive
  portions of the decode loop, including FFN (...) and MoE (...) expert execution, while Rubin
  GPUs handle prefill and decode attention. LPX can also draft for speculative decoding.
  Activations cross between GPUs and LPUs every token."
- `:154`: "DistServe served 7.4x more requests" became "DistServe served up to 7.4x more requests".
- `:172`: "2.7 GB at 8K tokens, 42 GB at 128K." became "2.68 GB at 8K tokens, 41.9 GB at 128,000."
- `:193`: table header `'8K, 2.7 GB'` became `'8K, 2.68 GB'`.
- `:279-289`: heading "Trainium and Inferentia" became "Trainium". "runs disaggregated inference
  in Beta on Inf2, Trn1 and Trn2, moving the KV cache ..." became "runs disaggregated inference in
  Beta on Trn1 and Trn2 instances with EFA[ec2AcceleratedSpecs, derived: EFA rows], moving the KV
  cache ...".
- `:338-340`: "DeepSeek-V3's MTP module had its second token accepted ... [measured]" became
  "DeepSeek reports its V3 MTP module's second token accepted ... [vendor-claim]".
- `src/components/DisaggregatedServingDiagram.tsx:28-31`: in the `<title>`, "On Vera Rubin with
  Groq 3 LPX, decode splits again: attention stays on Rubin GPUs, FFN and MoE layers run on LPUs"
  became "With a Groq 3 LPX rack deployed alongside Vera Rubin NVL72, decode splits again:
  attention stays on Rubin GPUs, LPUs accelerate latency-sensitive work such as FFN and MoE expert
  execution".
- Sources file unchanged.

## Checks

- `pnpm exec tsc --noEmit | grep DisaggregatedServing`: no type errors in my files.
- `pnpm exec eslint <section> <sources> <diagram> --max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t DisaggregatedServingAndSpeculative`:
  exit 0 (1 passed, 34 skipped).
- `pnpm exec vitest run src/__tests__/sources.test.ts`: exit 0 (831 passed).
- Gates from the repo root: no-ai-tells exit 0, svg-a11y exit 0, pinned-refs exit 0,
  pre-overflow exit 0. None of them reports a hit in my files.
- `pnpm exec vite build --outDir /tmp/vf-DisaggregatedServingAndSpeculative-dist`: exit 0.
- `node scripts/shoot.mjs --sections disaggregated --widths 1440,390`: exit 0. "1 SVG diagram(s),
  0 React Flow, ok" at both widths. PNGs read: the diagram is clean at 1440. At 390 it scrolls
  inside its wrapper, and the transfer table scrolls inside its container with the P6e-GB200 row
  label wrapping cleanly.

## For the orchestrator

- **Mooncake record title is stale.** The title says "arXiv:2407.00079v4", and so does
  FlashCacheTier.ts, but the unversioned abs URL now serves v5 (2026-10-08). The cited sentence is
  still in the v5 abstract. Update the title in both files, or pin the URL to `v4`.
- **The P6 page conflicts with itself.** Its prose says "400 GB ps per GPU of EFAv4 ... 28.8 Tbps
  per P6e-GB200 UltraServer", and its UltraServer table gives 28,800 Gbps for 72 GPUs. Its
  instance table lists "Network bandwidth (Tbps) 3.2" for the 4-GPU p6e-gb200.36xlarge, which is
  800 per GPU, matching the EC2 specification. Communication and Scale-Out and Grace-Blackwell and
  UltraServer may want to say so.
- **Neuron DI scope.** The Neuron DI page's "relevant for: Inf2" is a documentation tag, and no
  Inf2 size has EFA. No other section claims DI on Inf2 (grep), so nothing else to change.
- sources.md needs regenerating for the new derived cite on ec2AcceleratedSpecs (same record, no
  new URL).

## Backlog

Cut candidates (my estimates; together about 150 words, enough to lift Economy to 7 and the
section to 8):
- Dynamo card, "Pinned recipes cover DeepSeek-R1 on GB200 and GLM-5 on GB200 over EFA" (about 15
  words). The R1 recipe is in the pool-sizing paragraph and GLM-5 is in the EFA path and Combining.
- Combining, first paragraph, "Start from a pinned recipe like it, or from AWS's llm-d container"
  plus the recipe description (about 40 words). Both repeat the cards. Fold the composition point
  into one sentence ending on the action.
- SGLang card, the Mooncake-origin sentence (about 12 words). It gives neither a model nor an
  action.
- llm-d card, the AWS container sentence (about 35 words). Keep the 70% vendor claim and move the
  container mention to Combining only, or the reverse.
- "Compare the handoff" paragraph, the 4-of-32 interfaces sentence (about 15 words). Demote it
  into the table note.
- EFA path, the closing pointer to the vLLM dive (about 12 words). Keep either the pointer or the
  inline settings, not both.
- Intro LPX paragraph (about 60 words after the fix). The diagram inset and the Dynamo card
  carry the same split. Consider moving it into the diagram caption.

Enhancements:
- **Reframe the handoff comparison like for like.** EFA per GPU and dense FLOPS per GPU scale
  together, so the handoff costs about 4% of an 8K prefill on P5 at any width (53.7 ms / 1.257 s
  for one GPU, 6.7 ms / 0.157 s for eight). It grows only when the receiving pool is narrower than
  the sender: a TP2 decode pool receiving from a TP8 prefill takes 27 ms, 17% (my arithmetic). A
  70B BF16 worker on one H100 cannot exist (141 GB of weights against 80 GB), so the current
  one-GPU row reads as hypothetical for this model.
- The llm-d vendor claim could keep its "up to a concurrency of 128" scope. The blog also leaves
  the baseline's GPU count unstated (vLLM at TP4 against an eight-GPU P/D layout).
- Rubin CPX (register 26.2) is still off the page, as the author decided.
