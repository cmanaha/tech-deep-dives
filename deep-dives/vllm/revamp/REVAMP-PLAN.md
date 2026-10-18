# vLLM Deep Dive Revamp: v0.31.0 (October 2026)

Stream `vllm`, branch `revamp/2026-10-vllm`. Research date 2026-10-16.
Process model: `deep-dives/efa/revamp/REVAMP-PLAN.md` (research refresh, plan, wave authoring,
adversarial check, Gate 3 scoring, leverage pass).

## Pin

| | Ref | Commit | Date |
| --- | --- | --- | --- |
| Old | `15652a6b` (untagged main) | `15652a6b703f059767d75e5a511c4a5accf969ad` | 2026-06-07 |
| New | **`v0.31.0`** | `db9527a46873454610df6dbedf79a36d6bf1a7f6` | 2026-10-02 (released 2026-10-05) |

4,773 commits and eleven releases (v0.23.0 to v0.31.0) apart. `vllm/` grew from 674,655 to
1,009,607 Python lines (+49.6%), `rust/` doubled (63,183 to 126,169 lines). Evidence:
`research/2026-10-refresh/00-pin-and-diff.md`.

## Artifact index

Research (claim registers, one per file group):

| File | Covers |
| --- | --- |
| `00-pin-and-diff.md` | Pin selection, repo scale, per-subsystem diff, release-note digest |
| `01-codebase-arch-config-rust.md` | CodebaseArchitecture, CodebaseConfig, CodebaseRust |
| `02-codebase-scheduler-exec-model.md` | CodebaseScheduler, CodebaseExecution, CodebaseModelLayer |
| `03-codebase-distributed-advanced.md` | CodebaseDistributed, CodebaseAdvanced (+ KV connector registry) |
| `04-core-engine.md` | V1Architecture, SchedulerBatching, PagedAttentionKV, PrefixCaching, KVOffloadingLMCache, Quantization |
| `05-ecosystem.md` | ProductionStack, LlmdKServe, NvidiaDynamo, RayServeLLM, GatewaysAppLayer, ObservabilityBench, WhenNotVllm (+ external pins) |
| `06-core-features.md` | SpeculativeDecoding, LoRAServing, OpenAICompatServer, DistributedInference, DisaggregatedServing, InsideCodebase |
| `07-aws.md` | AwsEks, AwsGpuEfaNixl, AwsNeuron, AwsSageMakerBedrock, Ec2TopologyPlacement |
| `08-framing-ops-decision.md` | ThesisAndFraming, InferenceWorkload, OperationsFailureModes, DecisionGuide, GlossaryAndSources, App.tsx |

Process: `revamp/research-brief.md`, `revamp/authoring-brief.md`, this file.

## Verdict counts

CORRECT / STALE / WRONG / NEW / UNKNOWN per file.

| File | C | S | W | N | U | Treatment |
| --- | --- | --- | --- | --- | --- | --- |
| CodebaseArchitecture | 23 | 9 | 9 | 3 | 1 | EDIT (substantial) |
| CodebaseConfig | 26 | 9 | 11 | 12 | 0 | EDIT (knob table rebuilt) |
| CodebaseRust | 21 | 16 | 2 | 7 | 1 | REWRITE |
| CodebaseScheduler | 31 | 10 | 2 | 5 | 0 | EDIT |
| CodebaseExecution | 19 | 16 | 4 | 10 | 0 | REWRITE |
| CodebaseModelLayer | 17 | 9 | 2 | 6 | 1 | EDIT |
| CodebaseDistributed | 24 | 18 | 5 | 3 | 3 | EDIT (heavy) |
| CodebaseAdvanced | 25 | 14 | 4 | 9 | 2 | REWRITE spec decode, EDIT rest |
| V1Architecture | 16 | 1 | 2 | 3 | 0 | EDIT |
| SchedulerBatching | 15 | 1 | 4 | 7 | 0 | EDIT |
| PagedAttentionKV | 14 | 4 | 1 | 5 | 0 | EDIT |
| PrefixCaching | 14 | 4 | 0 | 3 | 0 | EDIT |
| KVOffloadingLMCache | 15 | 6 | 4 | 7 | 0 | REWRITE |
| Quantization | 16 | 9 | 1 | 4 | 0 | EDIT |
| ProductionStack | 15 | 3 | 6 | 1 | 2 | EDIT (heavy) |
| LlmdKServe | 18 | 9 | 3 | 4 | 1 | EDIT (heavy) |
| NvidiaDynamo | 16 | 4 | 1 | 2 | 2 | EDIT |
| RayServeLLM | 14 | 4 | 2 | 4 | 2 | EDIT (one conceptual fix) |
| GatewaysAppLayer | 14 | 1 | 0 | 0 | 2 | KEEP + small EDIT |
| ObservabilityBench | 17 | 4 | 1 | 10 | 1 | EDIT |
| WhenNotVllm | 9 | 3 | 3 | 4 | 4 | EDIT (heavy) |
| SpeculativeDecoding | 16 | 4 | 1 | 5 | 1 | EDIT (heavy) |
| LoRAServing | 14 | 0 | 1 | 6 | 1 | EDIT (medium) |
| OpenAICompatServer | 22 | 5 | 3 | 4 | 1 | EDIT (heavy) |
| DistributedInference | 15 | 1 | 2 | 4 | 0 | EDIT |
| DisaggregatedServing | 10 | 5 | 1 | 5 | 0 | EDIT (heavy; connector subsection rewrite) |
| InsideCodebase | 3 | 1 | 0 | 0 | 0 | KEEP (pin bump, orchestrator) |
| ThesisAndFraming | 16 | 5 | 0 | 1 | 0 | EDIT |
| InferenceWorkload | 10 | 2 | 0 | 0 | 0 | KEEP + small EDIT |
| OperationsFailureModes | 15 | 6 | 1 | 8 | 0 | EDIT (heavy; cold-start block) |
| DecisionGuide | 15 | 6 | 1 | 2 | 2 | EDIT (tree branch fixes) |
| GlossaryAndSources (sources) | 2 | 14 | 1 | 1 | 0 | EDIT (orchestrator; 2 dead links) |
| GlossaryAndSources (glossary) | 7 | 2 | 1 | 16 | 1 | EDIT (orchestrator) |
| App.tsx (nav, subtitle) | 6 | 2 | 0 | 0 | 0 | KEEP + small EDIT (orchestrator) |
| AwsEks | 12 | 2 | 10 | 2 | 0 | EDIT (heavy; Karpenter placement groups) |
| AwsGpuEfaNixl | 18 | 4 | 4 | 3 | 0 | EDIT |
| AwsNeuron | 10 | 13 | 1 | 3 | 2 | REWRITE (vllm-neuron 1.x, NxD Inference maintenance) |
| AwsSageMakerBedrock | 28 | 11 | 9 | 3 | 4 | EDIT (heavy; LMI V30, observability, 25 MB) |
| Ec2TopologyPlacement | 23 | 1 | 2 | 4 | 0 | EDIT (light) |

## The headline: the execution layer was replaced underneath the dive

1. **Model Runner V2 is the default runner for every model** (v0.29.0, #53183). The V1 runner
   (`gpu_model_runner.py`) is deprecated with removal targeted for v0.32, and runs only for
   features V2 lacks. Some features require V2 (DSpark, prefill context parallel, HiSparse). The
   Execution tab framed V2 as opt-in; that frame is inverted. Naming hazard the dive must defuse:
   the "V1 engine" (process architecture) and "Model Runner V2" (the GPU execution layer) are
   different axes. (02 E-rows, 04 V20.)
2. **The PagedAttention kernels were deleted** (v0.25.0, #47361). Paged KV memory management
   (block pool, block tables, hash-chained prefix blocks) is unchanged and is still the core
   memory model. Two diagrams were wrong at both pins: block sharing across logical indexes
   (PagedAttentionKV) and the free-queue LRU end (CodebaseScheduler, open P0 from 2026-08-01).
3. **The `vllm serve` scheduler defaults are tiered by usage context and GPU memory**: 16384
   batched tokens / 1024 sequences on GPUs with at least 160 GiB, 8192 / 1024 on H100-class,
   2048 / 256 elsewhere (`arg_utils.py` `get_batch_defaults()`). The dive's 2048 / 128 are class
   fallbacks. Wrong at both pins. (01 C15-C16, 04 SB-N1.)
4. **Prefix-cache root hash is deterministic by default for sha256** (v0.29.0, #51875); the advice
   to pin `PYTHONHASHSEED` is inverted for the default and still applies to xxhash variants.
5. **KV offloading writes completed blocks down as they are produced**, it does not move blocks on
   eviction (wrong at both pins), and vLLM now ships its own multi-tier stack behind
   `--kv-offloading-size` (CPU, filesystem, object store, P2P, KVCR, back-pressure, per-request
   controls), with LMCache as one of two backends.
6. **Ray is not vLLM's multi-node default.** On CUDA vLLM uses the multiprocessing executor and
   picks Ray only inside a Ray placement group or when asked. RayServeLLM says the opposite in five
   places; wrong at both pins. (05.)
7. **The Rust frontend's production guardrail is inverted**: TLS, API keys, CORS and dynamic LoRA
   now work; the hard-error inventory is 58 + 9 no-op (was 63 + 6); it gained a gRPC control plane
   and runs per DP rank under the DP supervisor. Python also calls a Rust tool parser in process.
8. **NIXL has a push mode** (`NixlPushConnector`, v0.24.0), the NixlConnector monolith is split
   into pull/push scheduler and worker files, and the P2P NCCL connector is gone.
9. **New scheduling controls**: API-server admission control (`--max-num-queued-reqs`,
   `--max-num-queued-tokens`), `--max-num-active-seqs`, adaptive `--long-prefill-token-threshold`,
   KV watermark, KV-holding waiting queue.
10. **Server surface**: tool `strict` is honoured (`--tool-strict-level`); `--api-key` guards only
    `/v1`, `/v2`, `/inference` and `/cohere`; admission control returns HTTP 503; per-request
    `mm_processor_kwargs` need `--trust-request-mm-kwargs`; `rejection_sample_method` values are
    `standard`, `synthetic`, `block`. Six speculative methods (ngram, ngram_gpu, suffix, medusa,
    mlp_speculator, custom_class) run on the deprecated V1 runner. (06.)
11. **AWS drift**: Karpenter launches into placement groups via `placementGroupSelector`
    (v1.11.0+), which inverts the EKS managed-node-group-only recommendation; the vllm-neuron 1.x
    plugin has no NxD Inference dependency (NxD Inference is in maintenance mode); SageMaker LMI
    V30 bundles vLLM 0.31.0 and SageMaker's 2026-06-18 observability exposes vLLM metrics; the
    real-time payload limit is 25 MB. All 12 open P2 findings are still open in the text. (07.)
12. **Ecosystem drift**: TGI's repository is archived; TensorRT-LLM's default backend is PyTorch
    (no compile step); llm-d's Endpoint Picker moved into llm-d Router v1.0.0; no orchestrator pins
    v0.31.0 (Dynamo 1.5.1 pins vLLM 0.28.0, Ray 2.59.0 pins 0.27.0, llm-d 0.10.0 ships 0.30.0).

## New section decision

**No new section.** Every capability added between the pins has a natural home in an existing
section, and a standalone section would either duplicate that home or read thin:

| Capability | Home |
| --- | --- |
| Model Runner V2 default, V1 fallback list | CodebaseExecution (rewrite), one paragraph in V1Architecture |
| Native multi-tier KV offload, HiSparse | KVOffloadingLMCache (rewrite) |
| Admission control, active-seq cap, watermark, adaptive long-prefill threshold | SchedulerBatching, CodebaseConfig, OperationsFailureModes |
| Fast restart (`vllm preload`, `ipc_cache`, `vllm snapshot`), startup KV-capacity log | OperationsFailureModes (new block + restart-ladder diagram), DecisionGuide sizing note |
| NIXL push mode, E/P/D | DisaggregatedServing, CodebaseDistributed |
| New spec-decode family, runner split by method | SpeculativeDecoding, CodebaseAdvanced |
| Rust gRPC control plane, DP supervisor | CodebaseRust (rewrite) |
| Watermarking, diffusion LLMs | WhenNotVllm (one line each); no section (neither changes a serving decision for most readers) |

Navigation titles that change with the new scope (orchestrator, App.tsx): section 5 becomes
"Paged KV Cache & Block Tables" (the kernel is gone, the memory model stays) and section 7
"KV-Cache Offloading & Tiers" (LMCache is one backend of a native stack).

## Cross-file facts every author uses the same way

Read this block whatever file you own. Wording and numbers here are settled by the registers;
do not re-derive them differently in one section.

- **Naming.** "V1 engine" = the process architecture (frontend, EngineCore, workers). "Model
  Runner V2" (MRv2) = the GPU execution layer inside each worker, default for every model since
  v0.29.0; the older runner is "the V1 model runner", deprecated, removal targeted for v0.32.
  Never write "V2 engine". (02 E-rows.)
- **Paged KV.** Use "paged KV cache" for the memory model (block pool, block tables, hash-chained
  prefix blocks), which is unchanged. The CUDA PagedAttention kernels were deleted in v0.25.0
  (#47361); attention backends (FlashAttention, FlashInfer, Triton, MLA backends) read the paged
  KV cache. Do not describe a current vLLM component as "PagedAttention kernels". (04 PA-rows.)
- **`vllm serve` scheduler defaults** depend on usage context and GPU memory: 16384 batched
  tokens / 1024 sequences on GPUs with at least 160 GiB, 8192 / 1024 on H100-class, 2048 / 256
  otherwise; 2048 / 128 are class fallbacks. Cite `vllm/engine/arg_utils.py` per 01 C15-C16.
- **Multi-node executor.** On CUDA the default executor is multiprocessing (`mp`, multi-node with
  `--nnodes`); vLLM picks Ray only inside a Ray placement group or with
  `--distributed-executor-backend ray`. vLLM's own docs say otherwise; code wins, state the
  conflict once where it matters (RayServeLLM). (05, 06 D-17.)
- **Admission control** rejects with HTTP **503** (`--max-num-queued-reqs`,
  `--max-num-queued-tokens`, v0.29.0). No 429 is produced in the vLLM tree. (06 O33, 08.)
- **Preemption** is recompute-only in V1. Signals: the "Preemptions:" field in the stats log and
  `vllm:num_preemptions`; the `PreemptionMode.RECOMPUTE` warning is a V0 message. (04 SB13, 08 O1.)
- **Prefix-cache hash seed** is deterministic for the default sha256 since v0.29.0 (#51875);
  xxhash variants still need `PYTHONHASHSEED`. (04 PC16-PC18.)
- **KV offload** stores completed blocks down as they are produced and loads on a prefix hit.
- **NIXL** has pull (`NixlConnector`) and push (`NixlPushConnector`) modes; `kv_both` is
  deprecated for NIXL; `P2pNcclConnector` was removed in v0.24.0. (03, 06 X-rows.)
- **Orchestrator pins**: Dynamo 1.5.1 pins vLLM 0.28.0, Ray 2.59.0 pins 0.27.0, llm-d 0.10.0 ships
  the v0.30.0 image. TGI's repository is archived. TensorRT-LLM's default backend is PyTorch. (05.)
- **Section numbers** in cross-references stay as they are: no section is added or removed.

## Diagram inventory

Every changed or new diagram is verified with `/tmp/vllm-shoot.mjs` (rendered text-box collision
and clipping check at 1440 and 390, plus PNG review) before its wave commits.

| Section | Diagram | Action | Source rows |
| --- | --- | --- | --- |
| CodebaseArchitecture | `RepoMapDiagram` | Relabel: counts, `models/`, `renderers/`, `vllm/engine/` = EngineArgs + shims, csrc contents, Rust is a separate process | 01 A1-A5, A42-A45 |
| CodebaseArchitecture | `ThreeProcessDiagram` | Relabel: MRv2 worker, wire labels (msgpack; shm pickle), add renderer | 01 A13, A15, A26 |
| CodebaseConfig | `ConfigFlowDiagram` | Sub-label tweaks; optional FrontendArgs branch | 01 C15, C21, C58 |
| CodebaseRust | `RequestPathDiagram` | Relabel engine box and wire label; Rust column capabilities | 01 R2, R6 |
| CodebaseRust | `CrateStackDiagram` | **Redraw** as a layered crate DAG | 01 R14, R16, R18 |
| CodebaseScheduler | `BlockPoolDiagram` | Fix LRU end (head), sub-block CoW, block tables no longer purely append-only | 02 S7, S15, S25 |
| CodebaseScheduler | `SchedulerStateDiagram` | Small: preemption label | 02 |
| CodebaseExecution | `ForwardPipelineDiagram` | **Redraw** for MRv2 (GPU-side input prep, KV write in `do_kv_cache_update`, grammar bitmask overlap) | 02 E-rows |
| CodebaseExecution | `RunnerSelectionDiagram` | **NEW**: `use_v2_model_runner` decision flow with V1-only and V2-only feature panels | 02 E7-E9 |
| CodebaseExecution | `BackendSelectionDiagram` | Update MLA list | 02 |
| CodebaseModelLayer | `RegistryDiagram` | Counts, two homes for model code, `--model-impl` | 02 M3, M30 |
| CodebaseModelLayer | `QuantDispatchDiagram` | Check; targeted online quantization | 02 |
| CodebaseDistributed | `NixlTransferFlowDiagram` | Add push-mode panel | 03 D30-D40 |
| CodebaseDistributed | `ParallelGroupTopologyDiagram` | Keep; optional EP/DCP caption | 03 D2-D3 |
| CodebaseAdvanced | `SpecDecodeLoopDiagram` | Relabel for the two speculator families | 03 B-rows |
| CodebaseAdvanced | `GuidedDecodeDiagram` | Relabel MRv2 Triton bitmask path | 03 B31 |
| CodebaseAdvanced | `TorchCompilePipelineDiagram` | Count 147, clone elimination, `FULL_AND_PIECEWISE` | 03 B41-B49 |
| V1Architecture | inline process-split SVG | Check labels; title/aria pattern | 04 |
| SchedulerBatching | `ContinuousBatchingTimeline` | Fix FCFS order and R4 timing | 04 SB2 |
| PagedAttentionKV | `BlockTableMappingDiagram` | **Redraw** sharing at the same logical index | 04 PA7 |
| PrefixCaching | `PrefixReuseDiagram` | Keep | 04 PC4 |
| KVOffloadingLMCache | `KVMemoryHierarchyDiagram` | **Redraw**: write-down on completion, native tiers, connector spine | 04 KO5, KO-N2 |
| Quantization | `DecisionDiagram` | Update leaves (Blackwell, Volta, plugins) | 04 Q24 |
| ProductionStack | `DeploymentShapeDiagram` | Relabel eight routing logics | 05 |
| LlmdKServe | `GatewayRoutingDiagram` | EPP in llm-d Router; decode-first sidecar | 05 |
| NvidiaDynamo | `DynamoDiagram` | Current component names | 05 |
| RayServeLLM | inline SVG | Engine box; footer (Ray inside placement group) | 05 |
| WhenNotVllm | `DecisionTreeDiagram` | TensorRT-LLM branch, TGI archived | 05 |
| ObservabilityBench | `MetricsPipelineDiagram` | Load-generator labels | 05 |
| SpeculativeDecoding | `ProposeVerifyAcceptDiagram` | Keep (standard rejection sampling); methods table gains a "Runs on" column | 06 S4, S27 |
| LoRAServing | `MixedBatchDiagram` | Note `--max-loras 3` in the picture (default is 1) | 06 L9 |
| OpenAICompatServer | `EndpointSurfaceDiagram` | Add Responses retrieve/cancel, batch and scale-out routes; `--api-key` scope | 06 O7, O10, O3 |
| DistributedInference | inline TP x PP SVG | Keep; title/aria pattern | 06 |
| DisaggregatedServing | `DisaggDiagram` | Drop P2pNccl, transport label | 06 X5, X6 |
| DisaggregatedServing | `NixlPullPushDiagram` | **NEW**: pull vs push sequence (who registers, who initiates, what the proxy forwards) | 06 X9, X15, X17 |
| ThesisAndFraming | `StackDiagram` (flex boxes) | Optional "Python or Rust frontend" sub-label | 08 |
| InferenceWorkload | `PrefillDecodeTimeline` | Fix the ITL label collision | 08 W-rows |
| OperationsFailureModes | `RestartLadderDiagram` | **NEW**: cold boot, compile-cache reuse, `--kv-cache-memory-bytes`, `vllm preload` + `ipc_cache`, `vllm snapshot`: what each rung skips | 08 O8, O9, O20, O21 |
| DecisionGuide | `StartHereTree` | Fix the Ray branch (`vllm serve --nnodes` runs multi-node without Ray), disaggregation not llm-d-only, two geometry defects | 08 D1, D5, D6 |
| AwsEks | `EksRequestProvisioningDiagram` | Karpenter `placementGroupSelector` path replaces the managed-node-group-only branch | 07 D1, E1 |
| AwsGpuEfaNixl | `KvDataPathDiagram` | Roles `kv_producer` / `kv_consumer`; pull by default (decoder issues RDMA READs) | 07 D2, G9 |
| AwsNeuron | `NeuronStackDiagram` | Delete the NxD Inference layer for the vllm-neuron 1.x plugin | 07 D3, N2, N3 |
| AwsSageMakerBedrock | `SageMakerPathsDiagram` | Path A card: LMI async mode, vLLM 0.31.0 in LMI V30 | 07 D4, S4 |
| AwsSageMakerBedrock | `BedrockVsSelfHostDiagram` | Insert the Custom Model Import branch | 07 D5, S46 |
| AwsSageMakerBedrock | `SageMakerHostingSurfaceDiagram` | HyperPod box labels | 07 D7, S32 |
| AwsSageMakerBedrock | `LmiConfigToEngineDiagram` | Keep | 07 D6 |
| Ec2TopologyPlacement | `ControlVsObserveDiagram` | Add the node-label / EPP topology-scorer consumer boxes | 07 D8, T27, T28 |
| Ec2TopologyPlacement | `NetworkNodesDiagram` | Caption: P6-B200 / P6-B300 report four layers | 07 D9 |

## Authoring waves

Three agents per wave (the stream's concurrency cap), one section file per agent, each with its
register, this plan and `revamp/authoring-brief.md`. After every wave: package typecheck, lint,
test, build, the five static gates, rendered-diagram audit of every changed diagram, commit.

| Wave | Files | Why this order |
| --- | --- | --- |
| 1 | CodebaseExecution (REWRITE), KVOffloadingLMCache (REWRITE), CodebaseRust (REWRITE) | The three inverted frames; other sections link to them |
| 2 | CodebaseAdvanced, CodebaseConfig, CodebaseScheduler | Codebase tabs with defaults other sections quote |
| 3 | CodebaseArchitecture, CodebaseDistributed, CodebaseModelLayer | Remaining codebase tabs |
| 4 | V1Architecture, SchedulerBatching, PagedAttentionKV | Core engine concepts |
| 5 | PrefixCaching, Quantization, SpeculativeDecoding | Core engine features |
| 6 | OpenAICompatServer, DisaggregatedServing, DistributedInference | Serving surface and scale-out |
| 7 | LoRAServing, RayServeLLM, WhenNotVllm | Ray default fix and alternatives |
| 8 | ProductionStack, LlmdKServe, NvidiaDynamo | Kubernetes and orchestrators |
| 9 | OperationsFailureModes, ObservabilityBench, GatewaysAppLayer | Operations |
| 10 | AwsEks, AwsSageMakerBedrock, AwsGpuEfaNixl | AWS (needs register 07) |
| 11 | AwsNeuron, Ec2TopologyPlacement, DecisionGuide | AWS; DecisionGuide last of the guides because it summarises the rest |
| 12 | ThesisAndFraming, InferenceWorkload | Framing reads the finished dive |
| Orchestrator | InsideCodebase, App.tsx, GlossaryAndSources, sources.md, README.md, .gates.json | Shared files, single writer |

## Shared files (orchestrator only)

`App.tsx` (nav titles, subtitle, any new or unrouted section), `InsideCodebase.tsx` (tab container
copy), `GlossaryAndSources.tsx`, `sources.md` (new), `README.md` (replace the template README),
`.gates.json` (new: no-ai-tells, svg-a11y, pinned-refs, pinned-refs-research, required-files,
pre-overflow).

Gate debt measured before authoring (dive opted in temporarily, 2026-10-17): no-ai-tells 78 hits
(68 curly-quote entities, 2 em-dashes, 8 banned words), svg-a11y 8 errors (six use a two-id
`aria-labelledby` the gate cannot resolve, two have no accessible name), pinned-refs 10 branch
links, required-files: `sources.md` missing. pre-overflow passes.
