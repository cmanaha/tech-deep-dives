# fc12-aws-b: fact-check of AwsEks.tsx and AwsSageMakerBedrock.tsx

Status: IN PROGRESS (checks done, fixes being applied).

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new.
External pins: Karpenter `v1.15.0` (and the `v1.11.0` release); LeaderWorkerSet `v1.0.0`;
djl-serving branch heads `0.38.0-lmi30-dlc` = 8a99e6e56562bcdff4ef230e2a81b201cb61fe09,
`0.38.0-lmi29-dlc` = 9c75526391d8e858bf4bd4172929cbf11a4ae84d, `0.36.0-lmi28-dlc` =
42d8a9db76ee036d48010208536faffa18e4a7e4, `0.36.0-lmi27-dlc` = 53cc6a51c5e575385e691abd80daa3be979fab91;
model-hosting-container-standards `v0.1.16`. AWS docs are unversioned, read 2026-10-18 with curl
(HTTP 200) and grepped as text. ECR Public tags read through the gallery `describeImageTags` API
(1,869 tags, paginated) on 2026-10-18.

DJL = https://github.com/deepjavalibrary/djl-serving/blob/8a99e6e56562bcdff4ef230e2a81b201cb61fe09

## AwsEks.tsx

Claims checked: 64. CONFIRMED 60. WRONG 1, UNSUPPORTED 1, OVERREACH 2.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| E1 | "These fields belong to self-managed Karpenter's EC2NodeClass; no EKS Auto Mode equivalent was located during this research" | AwsEks.tsx:240-241 | WRONG | EKS User Guide "Create a Node Class": Auto Mode NodeClass example carries `networkInterfaces` with `interfaceType: efa-only` and `placementGroupSelector` (`name` or `id`), plus a "Placement group strategy restrictions" list. https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html | pending |
| E2 | NodePool YAML comment `consolidationPolicy: WhenEmpty # never evict a busy node` | AwsEks.tsx:542 | OVERREACH | `WhenEmpty` limits consolidation to empty nodes; drift and expiry still replace nodes (Auto Mode page: "drift always uses replace-then-delete regardless of consolidation policy"). EKS BP guide frames it as retaining nodes during spikes. https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html | pending |
| E3 | LWS example: workers add `--headless`, cited at `vllm.yaml#L37-L42` | AwsEks.tsx:671-673 | UNSUPPORTED (line range) | `--headless` is at L85 (worker template); L37-L42 is the leader's `--nnodes/--node-rank/--master-addr`. https://github.com/kubernetes-sigs/lws/blob/v1.0.0/docs/examples/leaderworkerset/basic/vllm.yaml#L37-L85 | pending |
| E4 | DLC blog weights: "an FSx for Lustre file system, populated at pod init" | AwsEks.tsx:322 | OVERREACH (wording) | Blog: "After the container starts, it will take additional time (10-15 minutes) to download and load the DeepSeek model"; "After the initial download, model loading is much faster". No init container in the post. https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/ | pending |

CONFIRMED (60), main evidence: quickstart DLC tag and gloss, `gpu-inf`, Auto Mode and
self-managed Karpenter, `g6e.4xlarge`, `runai_streamer`, Open WebUI, gnetId 25263, ServiceMonitor
YAML, "Model loading took 9.81 GiB memory and 5.023344 seconds" / 10.4 GB, the
`avg_*_throughput_toks_per_s` grep (quickstart L270-L271) [EKS QS]; ECR Public tags
`0.21.0-...-ec2-v1.0-soci` (2026-05-16), `0.31.0-gpu-py312-cu130-ubuntu24.04-ec2-v1.2-soci` (pushed
2026-10-15T00:12Z), no tag newer than 0.31.0; BP guide selectors, `20480`, taint, Spot "up to a 90%
discount", "two-minute notice", "less than two minutes", "tightly coupled between instance nodes",
`settings.interruptionQueue`, `WhenEmptyOrUnderutilized`/`5m`, `WhenEmpty`/`60m` "such as real-time
online inference", Bottlerocket vs AL2023 device plugin, eksctl managed node group with
`efaEnabled: true` and `placementGroup.strategy: cluster`, `capacityReservationSelectorTerms`,
static node groups [EKS BP]; Karpenter v1.15.0 nodeclasses.md L912-L923 (Beta, reservations before
On-Demand and Spot), L989-L1021 (one PG per EC2NodeClass, name or id, cluster/partition/spread,
`ec2:DescribePlacementGroups`), L1175-L1196 (`efa-only` "without consuming an IP address"),
L1687-L1688 (`vpc.amazonaws.com/efa`); CRD L516-L517 "at most one efa device per network card";
v1.11.0 release (2026-04-06) "Placement Group Support (#9030)", field absent from the v1.10.0 CRD;
LWS v1.0.0 leader args L37-L42; DisaggregatedSet doc L9-L53; DLC blog p4d.24xlarge managed node
group, FSx, LWS, AWS Load Balancer Controller, EFA benefits with no numbers, no image tag; llm-d blog
"increases tokens per second by up to 70%", 1024/1024, concurrency 128, ml.p6-b200.48xlarge, 4x TP1
prefill + 1x TP4 decode vs TP4, no DisaggregatedSet/LeaderWorkerSet, Load Balancer Controller in
front of the Inference Gateway; vLLM code: `model_loader/__init__.py#L44-L61` (`runai_streamer`,
`ipc_cache`), `loggers.py#L686,#L720` counters, `#L275-L276` stats-log averages, no
`avg_*_throughput_toks_per_s` anywhere in `/tmp/vllm-new/vllm`; `docs/design/metrics.md:458`
deprecation and removal; `docs/features/preload.md` (same node, same user, same version, fallback,
pipeline parallelism rejected); section numbers against App.tsx L107-L135.

Score: pending.

## AwsSageMakerBedrock.tsx

Claims checked: 131. CONFIRMED 108. WRONG 7, UNSUPPORTED 7, OVERREACH 9.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| S1 | Pass-through keys: "a typo in one fails at container startup, when vLLM rejects the argument" (also the LmiConfigToEngineDiagram `<title>`) | :255-260, :633-637 | WRONG (doc vs code) | LMI forwards only extras whose name is an `EngineArgs` field: `get_additional_vllm_engine_args` keeps `k in EngineArgs.__annotations__` (DJL `/engines/python/setup/djl_python/properties_manager/vllm_rb_properties.py#L267-L272`; the class comment at #L88-L92 says the pass-through "would drop" an undeclared property). A misspelled key is dropped with no error; a valid key with a bad value fails in `parser.parse_args` at engine start (#L247-L265), called from `vllm_async_service.py#L136`. | pending |
| S2 | Config table defaults `OPTION_TENSOR_PARALLEL_DEGREE` 1, `OPTION_MAX_ROLLING_BATCH_SIZE` 256, `OPTION_DTYPE` fp16, `OPTION_MODEL_LOADING_TIMEOUT` 1800 s (and the alert's "1800 s by default") | :657-666, :820-821 | WRONG (doc vs code) | configurations.md L91-L96 documents these, but the V30 code differs. `LmiConfigRecommender.java#L88-L107`: unset TP reads `TENSOR_PARALLEL_DEGREE`, default `"max"` = all GPUs / PP. `#L46-L79`: with `SERVING_FEATURES=vllm` (`serving/docker/lmi.Dockerfile#L56`) rolling batch is `disable` and `option.async_mode=true`; `#L117-L136` then sets `max_rolling_batch_size` 32 (256 only for `rolling_batch=vllm` or trtllm), mapped to `max_num_seqs` (`vllm_rb_properties.py#L223`). `vllm_rb_properties.py#L70` `dtype = "auto"`. `lmi.Dockerfile#L33` `MODEL_LOADING_TIMEOUT=1200`, read by `PyEnv.java#L510-L515` when no `option.model_loading_timeout` is set. | pending |
| S3 | Real-time "25 MB payload", "The payload ceiling is 25 MB for a real-time endpoint, streaming or not" | :783, :800-802 | OVERREACH (two Tier 1 sources disagree; one cited as the other) | Hosting FAQ and inference-options page: 25 MB. The feature matrix the box cites for endpoint types lists real-time "< 6 MB"; InvokeEndpoint and InvokeEndpointWithResponseStream API reference: Body "Maximum length of 6291456". https://docs.aws.amazon.com/sagemaker/latest/dg/model-deploy-feature-matrix.html , https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_runtime_InvokeEndpoint.html | pending |
| S4 | "hard-caps at 60 seconds (non-adjustable)" | :796-797 | UNSUPPORTED ("non-adjustable") | FAQ and InvokeEndpoint ("must respond to requests within 60 seconds") give the cap; no page opened calls it non-adjustable. | pending |
| S5 | `VolumeSizeInGB`: "raise it for models over 30 GB" | :810-811 | OVERREACH (dropped qualifier) | "If the size of the model is larger than 30 GB and you are using an instance without a local disk". https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference-hosting.html | pending |
| S6 | Too-short startup health check "trips the /ping health check into a restart loop" | :821-822 | UNSUPPORTED | Large-model page: raise the quota "if ... the CloudWatch logs indicate a health check timeout"; configurations.md L96: set it to at least the model loading timeout. No restart-loop statement. | pending |
| S7 | "Scale-to-zero is an Inference-Component feature only." | :896 | OVERREACH (scope) | Feature matrix: Scale to zero ✓ for asynchronous and serverless inference; the zero-instances page scopes the IC-only rule to real-time endpoints ("An endpoint can scale to and from zero instances only if it hosts inference components"). The section's own table says async supports it. | pending |
| S8 | ICs carry "their own `MinCopyCount`/`MaxCopyCount`" | :886-887 | WRONG (field names) | No such fields. IC `RuntimeConfig.CopyCount` (API_InferenceComponentRuntimeConfig); scaling registers `sagemaker:inference-component:DesiredCopyCount` with `--min-capacity` / `--max-capacity` (zero-instances page L35-L50). | pending |
| S9 | `SageMakerVariantInvocationsPerInstance` "Legacy" | :915 | OVERREACH | AWS calls it a standard metric that emits "once every minute", usable "in tandem" with the concurrency metrics. https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-add-code-define.html | pending |
| S10 | "AWS reports up to 6x faster scale-out" | :919 | OVERREACH (vendor claim widened) | Blog title and body: "up-to 6x faster scale-up detection", "detect the need for scaling model copies up-to 6x faster". https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/ | pending |
| S11 | HyperPod inference "EKS only (the Slurm flavor of HyperPod is training-only)" | :946-947 | UNSUPPORTED (Slurm half) | Setup page prerequisite: "An existing HyperPod cluster with Amazon EKS orchestration". No page opened says Slurm is training-only. https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-setup.html | pending |
| S12 | Inference Operator "manages the model download, the pods, an ALB, TLS and metrics", cited to the overview | :951-952 | UNSUPPORTED (cited page) | Overview carries single/multi-node, tiered KV cache and the four routing strategies only. Download: deploy-ftm "the operator uses an init container to download the model" (`prefetchEnabled`). ALB, TLS, metrics appear only on the DPD, autoscaling and gateway pages. | pending |
| S13 | "NIXL (NVIDIA Inference Transfer Library)" | :965-966 | WRONG (name) | "NVIDIA Inference Xfer Library (NIXL)" (llm-d AWS blog; AwsEks.tsx:444). | pending |
| S14 | Chat schema alert: streaming via `/invocations-response-stream`; "In async mode the schemas follow upstream vLLM's OpenAI API", cited to the DJL chat schema page | :745-752 | UNSUPPORTED (cited page) | The chat schema page (master and V30 branch) carries `/invocations`, `messages`, `"stream": true`, jsonlines; it never names `/invocations-response-stream` or async mode. Path: InvokeEndpointWithResponseStream "POST /endpoints/EndpointName/invocations-response-stream". Parity: `vllm_user_guide.md#L79-L80`. | pending |
| S15 | Rolling batch quote "will become the default, and only supported mode" cited at L99-L120 | :507-510 | UNSUPPORTED (line range) | Quote is at `vllm_user_guide.md#L81`; L99-L120 is the rolling-batch config. | pending |
| S16 | ml-container-creator "is an AWS-owned repository, not a supported product" | :577 | UNSUPPORTED | README at bb89cf9d has no support statement (grep `support` = 1, the "Supported Configurations" heading). | pending |
| S17 | "Paths B and C. The `vllm-sagemaker` entrypoint puts vLLM's API server ... on port 8080" | :1059-1061 | OVERREACH | Path B is the AWS DLC with its own entrypoint ("serves on port 8080", https://aws.github.io/deep-learning-containers/vllm/deployment/sagemaker/); the `vllm-sagemaker` target is Path C. | pending |
| S18 | Vendor-number conditions: fused_moe_lora "on a single NVIDIA H200 (input 1600, output 600, concurrency 16)"; P-EAGLE "with GPT-OSS 20B and 120B and Qwen3-Coder 30B"; 454% "across the optimization arc" | :1254-1256, :1283-1285 | OVERREACH | fused_moe_lora blog: H200 / concurrency 16 belong to the first 26 OTPS run (L167); the 454%/87% figure is "vLLM 0.15.0 vs vLLM 0.11.1rc3" with "1600 input tokens and 600 output tokens with LoRA rank 32 and 8 adapters", no GPU named. P-EAGLE blog: every speedup is GPT-OSS 20B on B200 ("one NVIDIA B200 card"); 120B and Qwen3-Coder are checkpoint names only. | pending |
| S19 | "SageMaker (Path A or B) and Bedrock add service-side tuning" | :1293-1294 | UNSUPPORTED ("Path A or B") | Blog: "host your LoRA customized models on Amazon SageMaker AI or Amazon Bedrock"; no container or path named. | pending |
| S20 | "every API server `vllm serve` builds registers /ping ... and /invocations" | :560-561 | OVERREACH | True for the Python FastAPI server (`launchers/api_server/routers.py#L28-L32`, unconditional). The opt-in Rust frontend (`VLLM_USE_RUST_FRONTEND`, `cli/serve.py#L63-L65`) registers `/ping` (`rust/src/server/src/routes/render.rs#L32`) and no `/invocations`. | pending |
| S21 | JumpStart: "Check which image, and which vLLM version, it selects" | :987-988 | OVERREACH (presumes vLLM) | No Tier 1 page opened states that JumpStart always deploys on LMI or vLLM; the diagram title is already neutral. | pending |
| S22 | Worked deploy uses `sagemaker.Model(...)` with no SDK major named | :716-736 | WRONG (by omission) | The AWS DLC page splits examples into "SageMaker Python SDK v2" (`sagemaker.model.Model`) and "v3" (`sagemaker.core.resources.Model`); the OpenAI-compatible page imports `sagemaker.core.token_generator` (v3). The snippet is v2 API. | pending |
| S23 | LMI V27 row "0.23.0" | :693 | CONFIRMED (note) | release_notes.md: "Based on OSS vLLM `0.23.0`, with additional performance optimization patches"; the V27 branch requirements pin a patched `vllm-0.23.1.dev4+gcd87ce883.gemma426blora` wheel. Row cites the release notes and matches them. | none |

CONFIRMED (108), main evidence: LMI requirements `#L12` at 8a99e6e5 `vllm==0.31.0`, 9c755263
`vllm-0.28.0` wheel, 42d8a9db `vllm-0.26.0` wheel; branch heads verified with `gh api
.../branches`; AWS DLC releases `v1.0-djl-0.38.0-inf-lmi-30.0.0-cu130` 2026-10-15,
`...-29.0.0` 2026-09-21, `...-28.0.0` 2026-08-06, `...-27.0.0` 2026-07-15/16; V30 tag
`0.38.0-lmi30.0.0-cu130-v1.0` in account 763104351884; vLLM v0.31.0 published 2026-10-05 (ten
days); release_notes.md on master tops out at V27; vllm_user_guide.md L78-L81, L93-L97, L99-L120,
L157-L158, L190-L246 (both metrics paths, port 8080, `SERVING_ENGINE_METRICS=true`,
`served_model_name`, queue time excluded, `vllm:tool_call_parser_invocations_total` absent and
registered in `vllm/parser/metrics.py:15`), L229-L231; configurations.md L13-L14; DJL index quotes;
DLC SageMaker page (port 8080, `SM_VLLM_MODEL`); ECR `0.31.0-...-sagemaker-v1.2` pushed
2026-10-15T02:00Z; OpenAI-compatible page (`/openai/v1/chat/completions`, local SigV4 signing,
vLLM DLC "Supported", base URL); hosting FAQ `/invocations` and `/ping` on 8080, 60 s / 8 min,
async 1 GB / 60 min, serverless 4 MB; vLLM `api_router.py#L91-L113`, `#L107-L109`,
`launchers/app.py#L45`, `docker/Dockerfile#L1377-L1381`, `sagemaker-entrypoint.sh#L1-L24`,
`instrumentator/metrics.py#L76-L81`, `requirements/common.txt#L54`, `fused_moe_lora_op.py#L122`
(plus `fused_moe_lora_fp8_op.py`), `config/speculative.py#L479-L482`; MHCS v0.1.16 sticky-session
doc (`SAGEMAKER_ENABLE_STATEFUL_SESSIONS` default false, `NEW_SESSION`, header, 1200 s),
`sessions/manager.py#L17-L53`, notebooks' `SM_VLLM_*` variables; prefix-aware routing blog (P50 TTFT
71-77%, 7x ml.p5.48xlarge, vLLM, `PrefixLength` bytes on Invoke, `ConcurrencyThreshold` overflow,
`RoutingConfig` in the production variant); zero-instances page (`MinInstanceCount` 0,
`NoCapacityInvocationFailures`, "takes several minutes", errors meanwhile; no uncited cold-start
number in the file); large-model page 40 GB / 1800 / 1800; CloudWatch metric names; enhanced
metrics dimensions; detailed observability page and getting-started page (June 17 2026 default,
`update-endpoint`, frequencies, default 60, `start-otel-enrichment` charge, `ContainerMetricsConfig`,
port 8080, `/metrics`); CloudWatch Logs stdout/stderr (logging-cloudwatch page); HyperPod deploy-ftm
(`vllm-openai`, S3/FSx/HF), overview (tiered KV, L2 Redis or tiered storage, four strategies),
autoscaling (KEDA, `minReplicaCount` 0, `JumpStartModel`, `SageMakerPublicHub`), DPD (pdSpec,
LMCache + NIXL, EFA GPUDirect RDMA, five instance types), Inference Gateway (EPP signals, default
`llm-d`); feature-matrix footnote 3 does not describe cross-instance sharding (hedge holds);
pricing page HyperPod Spot "up to 90%", "batch inference"; `API_ProductionVariant` has no Spot field;
bidirectional streaming What's New 2025-11-25; decision guide quotes, 0 vLLM mentions; CMI
architecture list and GPT-OSS us-east-1 only; Bedrock pricing bills CMI per model-copy minute (the
file does not claim per-token billing for CMI); fused_moe_lora and P-EAGLE quotes verbatim;
locust notebook at 72854d74; ml-container-creator frameworks and endpoint types.

Score: pending.
