# Change report: DisaggregatedServingAndSpeculative (nav id `disaggregated`)

Register: `research/2026-10-refresh/05-workloads.md` section 26 (26.1 to 26.30) and its
Recommended edits, plus "Cross-section findings for the integrator" item 4. NVIDIA facts from
`02-nvidia.md`, LPX from `04-other-arch.md` (GS5, CS6, SL7), EFA and Neuron from `03-aws-cpus.md`.
P3 audit `docs/verification/2026-08-01/P3-silicon-numbers.md` section 5 and must-label #15
(resolved: per-instance vs per-GPU EFA, NVLink one-way rate, every transfer time `derived`).

Files: `src/sections/DisaggregatedServingAndSpeculative.tsx` (rewritten),
`src/components/DisaggregatedServingDiagram.tsx` (React Flow replaced by inline SVG),
`src/sources/DisaggregatedServingAndSpeculative.ts` (new, 33 records), this report.

## Word count

Rendered `main` at 1440, every disclosure open; nav, Cite badges, SVG text and code excluded
(`/tmp/kl-tools/wc.mjs`): **760 before, 1,236 after (+63%)**. The first full draft measured 1,703;
two cut passes removed the Rubin CPX sentence, the 128K table column, the diagram caption, the
Trainium clause in the flow paragraph, the long speedups list (folded into one expandable
paragraph), and trimmed every paragraph. Growth by added block:
- KV-per-token paragraph and transfer table (about 140 words, most of them table numbers):
  register 26.8 NEW and 26.9 to 26.11 (P3 must-label #15). The table replaces one alert sentence
  that conflated per-instance and per-GPU EFA.
- "Compare the handoff with the prefill it follows" (about 75): the register calls KV per token
  "the practical number that decides whether disaggregation pays"; this paragraph is where the
  reader makes that decision.
- "Selecting the EFA path" (about 70): code-confirmed defaults that change what an AWS reader
  types (vLLM and SGLang both default NIXL to UCX). Replaces the cut NIXL/SM sentence (26.12).
- "The split reaches silicon" (about 55): register 26.1, 26.3, 26.27 and cross-section item 4.
- Pool sizing paragraph (about 50): two published layouts; turns DistServe's TTFT/TPOT split into
  a sizing decision.
- llm-d card (about 45): register 26.29 NEW.
- Leviathan formula and worked example (about 55): register 26.20 WRONG fix.
- Acceptance figures and the vLLM metric (about 65): register 26.22 WRONG fix plus a monitoring
  hook.
- Speedups in the expandable (about 45): register 26.26 NEW.
Cut to offset: the "How these compose" stacking paragraph, "not a metaphor" framing, the
"most flexible OSS path" opinion, the Llama 3.2 1B pairing, CC-Cores and "customer deployments"
claims, the "kx" and "60-90%" claims, and the SGLang docs link sentence.

## Verification fetched during authoring (2026-10-17)

Primary sources re-read for the load-bearing wording (records carry 2026-10-17):
- Dynamo v1.5.1 disaggregated-serving concept doc: "Dynamo leverages NIXL to transfer KV cache
  directly from the VRAM of the prefill engine to the VRAM of the decode engine. The KV transfer
  is non-blocking, allowing GPU forward passes to continue serving other requests".
- Dynamo v1.5.1 DeepSeek-R1 GB200 recipe `deploy.yaml`: prefill `tensor_parallel_size: 4`,
  `moe_expert_parallel_size: 4`; decode 32 and 32; `numNodes: 9`.
- Dynamo v1.5.1 GLM-5 EFA recipe (README and `deploy.yaml`): 5 x p6e-gb200.36xlarge; decode
  4 nodes x 4 GPUs with EAGLE; prefill 1 x 4; `--disaggregation-transfer-backend nixl`;
  `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC` "without this, SGLang defaults to UCX, which
  silently falls back to TCP on kernel >= 6.8".
- SGLang v0.5.21: `environ.py:711` `SGLANG_DISAGGREGATION_NIXL_BACKEND = EnvStr("UCX")`;
  `fields/disagg.py:55-65` `disaggregation_mode` and transfer backend default `"mooncake"`;
  `choices.py:120-127` mooncake, nixl, ascend, fake, mori, mooncake_tcp; `fields/spec.py:30-33`
  speculative builtins.
- vLLM v0.31.0: `nixl/base_worker.py:559-561` default backends `["UCX"]`;
  `docs/features/disagg_prefill.md` "This feature is experimental and subject to change";
  `config/speculative.py` method literals; `v1/spec_decode/metrics.py` docstring (acceptance
  rate and mean acceptance length = 1 + accepted / drafts).
- AWS ML blog "Introducing Disaggregated Inference on AWS powered by llm-d" (2026-03-16):
  llm-d-aws container with EFA and libfabric; `"backends": ["LIBFABRIC"]`; "p5.48xlarge ... 32
  Elastic Fabric Adapter interfaces, so you should configure each replica to have 4 EFA
  interfaces per GPU"; up to 70% more tokens/s at 1024/1024 up to concurrency 128; 4 prefill
  pods TP1 vs 1 decode pod TP4 on ml.p6-b200.48xlarge.
- llm-d README at v0.10.0 (the register's quote lives in the README, not the release page).
- Neuron 2.32.0 disaggregated-inference page: "[BETA]", "relevant for: Inf2, Trn1, Trn2", zero-copy
  EFA transfer, "Automatic Prefix Caching is not supported with DI".
- NxD Inference feature guide 2.32.0: draft model, Medusa, "EAGLE v1 with a flat draft
  structure", fused speculation (no EAGLE-3 on this page; the register's 2.28.0 note had no URL).
- EC2 instance spec: p5.48xlarge and p6-b200 3200 Gigabit, p6-b300.48xlarge 6400, p6e-gb200.36xlarge
  3200. P6 page: "400 GB ps per GPU of EFAv4".
- Leviathan et al. PDF: Eq. 1, Theorem 3.8 (walltime factor (1 - a^(g+1)) / ((1 - a)(g c + 1))),
  "c was always less than 0.05", memory accesses shrink by Eq. 1's factor, alpha 0.5 to 0.9.
- DeepSeek-V3 report PDF: "acceptance rate of the second token prediction ranges between 85% and
  90%", "1.8 times TPS".
- arXiv abstracts: DistServe (7.4x, 12.6x, interference and coupled parallelism), EAGLE-3 (6.5x,
  1.38x at batch 64), Medusa (2.2x, 2.3-3.6x, tree attention), DFlash (over 6x, 2.5x over EAGLE-3).
- LPX blog: AFD quotes, "LPX is well-suited to act as the draft-generation engine",
  "Rubin GPUs verify and finalize tokens", Dynamo orchestrates the decode loop.
- DeepSeek-V4.1-Flash README: CSA2 sparse attention plus FP4 main KV, "global KV cache footprint
  to 890 bytes per token".

## Claims changed

| Register | Before | After | Source key (tier, kind) |
| --- | --- | --- | --- |
| 26.1 | "two distinct workloads ... ideally want different silicon" (uncited) | prefill above / decode below the ridge; sharing GPUs causes interference and one parallelism plan | distServe (T3) |
| 26.3 | "move only the KV cache between them" | pools move the KV cache; on Vera Rubin activations also cross GPU and LPU every token | distServe (T3), lpxBlog (T2) |
| 26.4 | drafts from "a small model" | small models, EAGLE and Medusa heads, or MTP modules shipped in the checkpoint (DeepSeek-V3) | leviathan, eagle3, medusa (T3), deepseekV3Report (T2) |
| 26.6 | KV over NVLink or EFA (uncited) | NIXL moves it VRAM to VRAM over NVLink or EFA, non-blocking | dynamoDisaggDoc (T1), nixl (T1), nixlReadme (T1) |
| 26.7/26.8 | "hundreds of MB to several GB per request" | 327,680 B/token for Llama 3.1 70B BF16 (2.7 GB at 8K, 42 GB at 128K) vs 890 B/token for DeepSeek-V4.1-Flash, about 370x less | llama3Herd (T2, derived), deepseekV41Flash (T1; derived for the ratio) |
| 26.9 | "EFA at 3,200 Gbps on P5" | 3,200 Gbps per p5.48xlarge; 400 Gbps per P5 GPU; 800 per P6-B300 GPU; P6e-GB200 per GPU as the 400 vs 800 pair | ec2AcceleratedSpecs (T1; derived per GPU), p6Page (T2) |
| 26.10 | "takes milliseconds" | table: per GB 2.5 / 20 / 10 ms; 8K prompt 6.7 / 54 / 27 ms | ec2AcceleratedSpecs (T1, derived) |
| 26.11 | NVLink "sub-millisecond" | 900 GB/s each way (1.8 TB/s bidirectional in the note): 1.1 ms per GB, 3.0 ms for 8K | blackwellUltraBlog (T2), derived |
| 26.13 | Dynamo "Pairs with TensorRT-LLM" | disaggregates SGLang, TensorRT-LLM and vLLM backends; orchestrates the Rubin-plus-LPX decode loop | dynamoReadme (T1), lpxBlog (T2) |
| 26.14 | DeepSeek-R1 on GB200 NVL72 uses Dynamo (unsourced) | recipe on 36 GB200 GPUs: decode eight nodes, prefill one | dynamoR1Recipe (T1) |
| 26.15 | vLLM experimental flags, NixlConnector (unsourced) | marked experimental; connectors NixlConnector, MooncakeConnector, LMCache | vllmDisaggDoc (T1) |
| 26.17/26.18 | SGLang "most explicit" support, docs.sglang.ai link | `--disaggregation-mode` prefill or decode; backends mooncake, nixl, ascend, mori; Mooncake is the default | sglangDisagg, sglangChoices (T1), mooncakeArxiv (T3) |
| 26.19 | Trainium "early production", CC-Cores, customers shipping | NxD Inference disaggregated inference in Beta on Inf2, Trn1, Trn2; KV over EFA device to device, no copy through host memory; no automatic prefix caching | neuronDisagg (T1) |
| 26.20 | "speedup is roughly kx" | E = (1 - a^(g+1)) / (1 - a); speedup E / (1 + g c); worked: a 0.8, g 4, c 0.05 gives 3.4 tokens and 2.8x; a 0.5 gives 1.9 and 1.6x | leviathan (T3; derived for the example) |
| 26.21 | reading weights once "essentially free" | memory traffic per token falls by E, provided spare compute covers the extra evaluations | leviathan (T3) |
| 26.22 | "typically 60-90%" | a 0.5 to 0.9 for drafters a couple of orders of magnitude smaller; DeepSeek-V3 MTP 85-90%, 1.8x TPS | leviathan (T3, measured), deepseekV3Report (T2, measured) |
| 26.23 | vLLM, SGLang, TRT-LLM ship it | vLLM and SGLang ship EAGLE-3, MTP (NEXTN) and DFlash; TRT-LLM supports it | vllmSpecConfig, sglangSpec, trtllmSpecDoc (T1) |
| 26.24 | Trainium "NKI-authored draft kernels" | NxD Inference: draft model, Medusa, EAGLE v1, fused speculation | neuronFeatureGuide (T1) |
| 26.25 | tree-based speculation | kept: Medusa-2 verifies a tree of candidates per pass | medusa (T3) |
| 26.30 | diagram "NIXL / NCCL over NVLink / EFA", FLOP-rich / bandwidth-rich | "NIXL over NVLink, or libfabric over EFA"; Trainium "Neuron runtime over EFA, zero copy"; pools labelled compute-bound / memory-bound with their latency target | as 26.6, 26.19 |
| (xref) | "Section 3", "Sections 25 and 22" | Roofline and Arithmetic Intensity by name; the batching cross-reference left with the cut compose paragraph | - |

CORRECT claims kept and re-cited: 26.1, 26.5 (as names), 26.6, 26.7, 26.9, 26.14, 26.15, 26.17,
26.21, 26.23, 26.25, 26.28 (as the pool split and the Rubin example), 26.30.

## Claims removed

- 26.12 NIXL "without activating any SMs" / NCCL consumes SMs: UNKNOWN (no primary source); the
  NCCL half is stale (v2.28.3 CE collectives). Replaced by the sourced non-blocking transfer.
- 26.16 "The most flexible OSS path for AWS-resident deployments": CUT candidate, opinion. The AWS
  path is now the sourced llm-d-aws container and the Dynamo EFA recipe.
- 26.19 "via CC-Cores", "customer deployments are starting to ship", "reference architectures
  ... emerging": UNKNOWN.
- 26.20 "kx", 26.22 "60-90%", 26.24 "NKI-authored draft kernels": WRONG, replaced.
- 26.25 "Llama 3.2 1B drafting Llama 3.3 70B": illustrative; 04-other-arch SL7 marks it stale as
  the representative pattern. Cut for length; the drafter-types sentence carries the point.
- 26.2 Rubin CPX: NEW but optional per the orchestrator ("if mentioned at all"). Drafted as
  "announced, not shipping" (roadmap, nvidianews 2025-09-09), then cut for length. If the
  integrator wants it back, the record is in the register.
- "How these compose" stacking paragraph ("not alternatives", "the 2026 inference economy is
  built on stacking these layers"): unsourced rhetoric with a "not X but Y" tic. Composition
  survives as the sourced GLM-5 recipe (disaggregation plus EAGLE over EFA).
- DistServe's "12.6x tighter SLO": cut for length; 7.4x kept.
- 26.26 per-method speedups trimmed to one expandable paragraph (Medusa-1 2.2x and
  EAGLE-3's 1.4x over EAGLE-2 dropped).

## UNKNOWNs

- 26.12 (SM use): dropped; nothing on the page depends on it.
- 26.16: cut.
- 26.19 CC-Cores and deployment status: dropped.
- EFA direction: no AWS figure carries a direction label; the table note says the times read
  them as per-direction line rates (same convention as Grace-Blackwell and UltraServer).

## NEW content and sources

- Rubin GPUs run prefill and decode attention; Groq 3 LPX runs decode FFN/MoE and can draft;
  activations cross every token: lpxBlog (T2).
- KV bytes per token range and transfer table: llama3Herd (T2, derived), deepseekV41Flash (T1),
  ec2AcceleratedSpecs (T1, derived), p6Page (T2), blackwellUltraBlog (T2).
- Handoff vs prefill: 8K prefill of the 70B on 8x H100 about 0.16 s at dense BF16 peak (reusing
  Flash as a Cache Tier's 1.24 PFLOP), handoff 4% (instance) or 34% (one GPU): h100Page (T2,
  derived).
- One-GPU worker gets 4 of 32 EFA interfaces on p5.48xlarge: awsLlmdBlog (T2).
- EFA backend selection: vllmNixlWorker, sglangDisagg, sglangEnviron (T1 code);
  `"backends": ["LIBFABRIC"]`: awsLlmdBlog (T2); SGLang flags and the UCX-to-TCP warning:
  dynamoGlm5EfaRecipe (T1, attributed as the recipe's warning).
- Pool sizing: distServe (T3) for TTFT/TPOT; dynamoR1Recipe (T1); awsLlmdBlog (T2) layout.
- llm-d (26.29): llmdReadme (T1); AWS container and 70% figure: awsLlmdBlog (T2, vendor-claim,
  attributed "AWS reports", scope "at 1,024 tokens in and out" kept).
- Mooncake one line (26.29): mooncakeArxiv (T3).
- Speculative formula, measured figures, EAGLE-3 batch-64 throughput: leviathan, eagle3 (T3,
  measured), deepseekV3Report (T2, measured).
- vLLM acceptance metrics: vllmSpecMetrics (T1 code).
- Speedups (26.26): leviathan, medusa, eagle3, dflash (T3, measured).
- Combining: GLM-5 recipe on five p6e-gb200.36xlarge (dynamoGlm5EfaRecipe, T1).

## Diagram

`DisaggregatedServingDiagram.tsx` rebuilt from React Flow to inline SVG (no new dependency).
Reason: at 390 the React Flow version's fitView pushed the request and response nodes off both
edges (seen in the baseline PNG), and the probe cannot measure React Flow labels. New:
`viewBox="0 0 860 400"`, `role="img"`, `aria-labelledby="disagg-flow-title"` with an asserting
`<title>`, full-bleed white rect, Idiom A classes prefixed `dsd-`, fonts 10 to 13px sans-serif,
wrapped in `<div style={{ overflowX: 'auto' }}>` with `minWidth: 640` (the dive's convention).
Content: Client and Router; prompt to a Prefill pool (compute-bound, sized for TTFT); a green KV
cache handoff column (once per request, prompt tokens x KV bytes per token; GPU: NIXL over NVLink
or libfabric over EFA; Trainium: Neuron runtime over EFA, zero copy); a Decode pool (memory-bound,
sized for TPOT) with a dashed inset for Vera Rubin with Groq 3 LPX (Attention on Rubin GPUs,
FFN/MoE on LPUs, activations every token); tokens back to the router. No figures drawn; every
assertion is cited in the surrounding text.

Rendered check (`scripts/shoot.mjs`): "1 SVG diagram(s), 0 React Flow, ok" at 1440 and 390; no
page-level horizontal overflow (scrollWidth 390). PNGs read at both widths: no text crossing
lines, no labels on arrows ("prompt" and "tokens" sit beside their segments), inset arrow clear
of both boxes. At 390 the SVG scrolls inside its wrapper at full label size; the transfer table
scrolls inside its own container; long code tokens wrap mid-identifier.

## Leverage pass: claim-set diff

Assertions in the after that were not in the before, with their source:
1. Shared GPUs cause interference and force one parallelism plan: distServe.
2. Vera Rubin split (attention on GPUs, FFN/MoE and drafting on LPX, activations every token):
   lpxBlog.
3. NIXL is a point-to-point library; Dynamo's transfer is VRAM to VRAM and non-blocking:
   nixlReadme, dynamoDisaggDoc, nixl.
4. DistServe 7.4x more requests within latency targets: distServe (measured).
5. Size prefill for TTFT, decode for TPOT: distServe. Two published layouts: dynamoR1Recipe,
   awsLlmdBlog.
6. 327,680 and 890 B/token, 2.7 / 42 GB, 370x: llama3Herd (derived), deepseekV41Flash.
7. Every table rate and time: blackwellUltraBlog, ec2AcceleratedSpecs, p6Page (derived).
8. 0.16 s prefill, 4% and 34%: h100Page (derived, from Flash as a Cache Tier's arithmetic).
9. 4 of 32 EFA interfaces per GPU: awsLlmdBlog.
10. "Keep a large-KV model's handoff on NVLink or spread over every interface; a compressed-KV
    model crosses EFA from one GPU in milliseconds": our reading of rows 6 to 8, stated as
    guidance, no new fact.
11. NIXL libfabric/UCX/storage plugins; UCX defaults in vLLM and SGLang; Mooncake default;
    LIBFABRIC settings; UCX-to-TCP warning: nixl, vllmNixlWorker, sglangDisagg, sglangEnviron,
    awsLlmdBlog, dynamoGlm5EfaRecipe.
12. Serving-stack card facts: dynamoReadme, lpxBlog, dynamoR1Recipe, dynamoGlm5EfaRecipe,
    vllmDisaggDoc, sglangDisagg, sglangChoices, mooncakeArxiv, llmdReadme, awsLlmdBlog,
    neuronDisagg.
13. Speculative mechanism, formula, memory-traffic factor, spare-compute assumption:
    leviathan. "Small-batch decode has that compute; a large batch uses it up" is our reading
    tied to Roofline and Arithmetic Intensity, followed by EAGLE-3's measured 6.5x vs 1.38x at
    batch 64 (eagle3).
14. Acceptance figures: leviathan, deepseekV3Report (measured). vLLM metric: vllmSpecMetrics.
15. Methods and speedups: vllmSpecConfig, sglangSpec, trtllmSpecDoc, neuronFeatureGuide,
    leviathan, medusa, eagle3, dflash.
16. GLM-5 recipe composition: dynamoGlm5EfaRecipe.

## Checks

- `tsc --noEmit`: no errors in my files. `eslint` on the three files: clean, 0 warnings.
- `vitest run src/__tests__/sections.test.tsx -t DisaggregatedServingAndSpeculative`: passed.
- `no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh`: no hits in my files.
- Tier and title consistency: all 33 URLs match their records in other source files (script
  check; `sources.test.ts` "same tier" passes).

## For the orchestrator

- `sources.md` needs regenerating (new records). New URLs not cited elsewhere: dynamoDisaggDoc,
  dynamoR1Recipe, dynamoGlm5EfaRecipe, nixlReadme, vllmDisaggDoc, vllmNixlWorker, sglangDisagg,
  sglangChoices, sglangEnviron, llmdReadme, awsLlmdBlog, neuronDisagg, leviathan, eagle3,
  medusa, dflash, vllmSpecConfig, vllmSpecMetrics, sglangSpec, trtllmSpecDoc,
  neuronFeatureGuide.
- Glossary acronyms introduced or used here: KV, LPU, FFN, MoE, NIXL, EFA, UCX, TTFT, TPOT,
  BF16, GQA, FP4, EKS, NxD Inference (NeuronX Distributed Inference), EAGLE (Extrapolation
  Algorithm for Greater Language-model Efficiency), MTP (multi-token prediction).
- The brief's table calls the vLLM section "KV Offloading and LMCache"; the vLLM nav title is
  "KV-Cache Offloading & LMCache" (as the orchestrator prompt and Flash as a Cache Tier use).
  This section uses the nav title. It also names the vLLM section "vLLM on AWS GPUs, EFA & NIXL".
- Candidate cross-section note for REVAMP-PLAN: vLLM's NixlConnector and SGLang both default NIXL
  to UCX (code at v0.31.0 and v0.5.21); on EFA select `LIBFABRIC`. Communication and Scale-Out
  should not imply NIXL uses EFA by default. KV per token for Llama 3.1 70B BF16 is 327,680 B
  here and in Flash as a Cache Tier.
- Rubin CPX (26.2) is not on the page; see Claims removed.
