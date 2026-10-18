# fc09-k8s: fact-check of RayServeLLM.tsx, ProductionStack.tsx and LlmdKServe.tsx

Pin: vLLM v0.31.0 (db9527a46873454610df6dbedf79a36d6bf1a7f6), source at /tmp/vllm-new.
External pins, fetched at the tag from raw.githubusercontent.com into /tmp/fc09-src on 2026-10-18:
Ray `ray-2.59.0`; production-stack `vllm-stack-0.1.13` (the whole `src/vllm_router` tree plus
`helm/`; operator type files); Rust router `v0.1.16`; llm-d `v0.10.0` (README; release body via
`gh api`); llm-d Router `v1.0.0` (README, docs, the EPP files cited, the disagg profile handler);
GIE `v1.6.2`, `v1.6.0`, `v1.5.0` (README, CRD, release bodies); KServe `v0.21.0`; Dynamo `v1.5.1`
`pyproject.toml`. Docs fetched with curl and stripped to text: Ray `releases-2.59.0` Serve LLM
overview, vLLM-compatibility and fault-tolerance pages; the Anyscale Wide-EP blog; the vLLM Router
release blog; the llm-d KServe/Tesla blog.

Abbreviations: `RAY/` = `https://github.com/ray-project/ray/blob/ray-2.59.0/`,
`PS/` = `https://github.com/vllm-project/production-stack/blob/vllm-stack-0.1.13/`,
`LR/` = `https://github.com/llm-d/llm-d-router/blob/v1.0.0/`, `LD/` = `https://github.com/llm-d/llm-d/blob/v0.10.0/`,
`V/` = `https://github.com/vllm-project/vllm/blob/v0.31.0/`.

Harness: not run. No diagram was edited (no SVG geometry, label or `<title>` changed).

## Checks the orchestrator asked for

**vLLM version each orchestrator installs.** CONFIRMED. Ray 2.59.0: `vllm[audio]==0.27.0` at
`RAY/python/requirements/llm/llm-requirements.txt#L2` and `RAY/python/setup.py#L387`. Dynamo 1.5.1:
`vllm[flashinfer,runai,otel]==0.28.0` (`https://github.com/ai-dynamo/dynamo/blob/v1.5.1/pyproject.toml#L64`).
llm-d 0.10.0: component summary `vllm-project/vllm v0.30.0 Base image` and upstream image
`docker.io/vllm/vllm-openai v0.30.0`; the same table pins `vllm-tpu` at v0.29.0 and `vllm-omni` at
v0.28.0 (`https://github.com/llm-d/llm-d/releases/tag/v0.10.0`). One overreach fixed (L4 below).

**"Works with vLLM v0.31.0" through these stacks.** No sentence in the three files claims a feature
works with v0.31.0 through Ray, production-stack or llm-d. The "verified against vLLM v0.31.0" text
in each h1 description is the verification scope. Ray states the 0.27.0 pin three times and llm-d
the 0.30.0 pin twice. One Ray bullet ("keep using vLLM's engine features unchanged") overreached the
compatibility guide's "Most"; fixed (R4).

**Disaggregated serving is not llm-d-only.** CONFIRMED in all three. ProductionStack documents
`disaggregated_prefill` and `disaggregated_prefill_orchestrated` (code at
`PS/src/vllm_router/routers/routing_logic.py#L967-L1023`, flow in
`PS/src/vllm_router/services/request_service/request.py#L752-L916`) and the Rust router's P/D
support (`https://github.com/vllm-project/router/blob/v0.1.16/README.md#L13`). Ray documents
`build_pd_openai_app`. LlmdKServe never states exclusivity.

## Section Shape (the two files that grew)

Word counts against `145314b`: RayServeLLM 3125 to 4096 (+31%), LlmdKServe 2895 to 4936 (+70%),
ProductionStack 2853 to 3946 (+38%).

**RayServeLLM: no block fails both tests.** Mental model: the division table, the topology diagram,
"two hats", the docs-versus-code alert. Practical: the builder table, the 0.27.0 warning, "When to
choose" (last, so the payoff lands last). Weakest block: the KubeRay three-column grid of docs
quotes. It passes on the practical axis (it says what KubeRay adds over manual scripts, which is the
choice the closing alert asks the reader to make). PD and Wide-EP plus cross-links are already in
ExpandableSections. Nothing demoted.

**LlmdKServe: no block fails both tests.** Mental model: request path and diagram, components table,
filters/scorers/picker, decode-first disaggregation, engine-level versus cluster-level. Practical:
approximate versus precise prefix scoring (`--kv-events-config`), metric names per router, the
KServe `kvCacheOffloading` field, the version set and the v0.30.0 image. Weakest blocks: the "Past
these six" scorer inventory (passes: it names the plugins a reader can weight in
`EndpointPickerConfig`, including the multimodal-cache scorer) and the "Where the EPP code lives"
alert (passes: older guides name `llm-d-inference-scheduler`, and the pin depends on which repo
holds the EPP). The project-history material is already in the "Deep dives" ExpandableSections.
Nothing demoted. The growth itself is the main Section Shape cost (rule 13).

## RayServeLLM.tsx

Claims checked: 57. CONFIRMED: 51. WRONG: 1. UNSUPPORTED: 1. OVERREACH: 1. Prose fixes: 3.

CONFIRMED (summary): `server_cls` names `LLMServer, SGLangServer` and `llm_engine` defaults to vLLM
(`RAY/python/ray/llm/_internal/serve/core/configs/llm_config.py#L152-L228`); both compatibility-guide
quotes and the multimodal/structured-output/reasoning quote (releases-2.59.0 vllm-compatibility
page); "Engine-agnostic backends such as vLLM and SGLang" and "Multi-LoRA serving" (overview page);
the controller "health-checks each Serve deployment replica and restarts it on failure"
(fault-tolerance page); GPU replicas forced to `distributed_executor_backend="ray"` with any other
value rejected, CPU uses `mp` (`.../engines/vllm/vllm_models.py#L147-L162`); placement group handed
to vLLM (`.../engines/vllm/vllm_engine.py#L634`); `build_openai_app(llm_serving_args)` and the
two-LLMConfig autoscaling example (`RAY/python/ray/serve/llm/__init__.py#L149-L196`), `__all__`
(`#L397-L409`), `build_pd_openai_app` (`#L254`), `build_dp_openai_app` (`#L379`); `LLMServingArgs`
fields (`.../core/ingress/builder.py#L146-L158`); `OpenAiIngress` stable with its endpoint list
(`RAY/python/ray/serve/llm/ingress.py#L8-L20`, `.../core/ingress/ingress.py#L119-L133`);
`PrefixCacheAffinityRouter` stable, `KVAwareRouter` alpha "via a KV router actor"
(`RAY/python/ray/serve/llm/request_router.py#L10-L52`), imbalance check and power-of-two fallback
(`.../prefix_aware/prefix_aware_router.py#L253-L258`, `#L350-L356`); `request_router_config` is a
supported `deployment_config` field (`llm_config.py#L211-L223`); executor selection, the
nnodes>1 `mp` branch, the error naming both fixes, Ray only for `data_parallel_backend == "ray"` or
inside a placement group (`V/vllm/config/parallel.py#L989-L1031`), `--node-rank`
(`V/vllm/engine/arg_utils.py#L1120`); the docs quote at `V/docs/serving/parallelism_scaling.md#L33`;
ray[llm] 0.27.0, Dynamo 0.28.0, llm-d v0.30.0 (above); all five KubeRay quotes
(`V/docs/deployment/integrations/kuberay.md#L3-L13`); both Anyscale quotes and the Wide-EP
coordination paraphrase (Anyscale blog text); section numbers 9, 10, 16, 17, 18, 25 (App.tsx);
acronym first uses.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| R1 | KubeRay row "blue/green upgrades (Sections 16-17)" | RayServeLLM.tsx:70 | WRONG | `grep -l KubeRay src/sections/*.tsx` returns only RayServeLLM and GlossaryAndSources; sections 16-17 never mention KubeRay | Cross-ref now "(KubeRay, below)" |
| R2 | Decode server sends `max_tokens=1` + `kv_transfer_params`, decodes with the returned params | RayServeLLM.tsx:719-736 | UNSUPPORTED (citation) | Cited lines are module and mixin docstrings (`.../prefill_decode/pd_server.py#L1-L4`, `#L99-L106`), which the authority standard treats as orientation. The code that does it: `RAY/python/ray/llm/_internal/serve/engines/vllm/kv_transfer/base.py#L213-L252` (deep copy, `do_remote_decode`, `clamp_request_to_single_token`, decode forwards `prefill_response.kv_transfer_params`) | Added the `kv_transfer/base.py L213-L252` code citation |
| R3 | "replicas are no longer independent" | RayServeLLM.tsx:712 | prose (history voice) | COMMON rule 4 lists "no longer" | "optimal serving couples engine replicas to each other" |
| R4 | "keep using vLLM's engine features unchanged, since the engine_kwargs ... carry straight over" | RayServeLLM.tsx:836-839 | OVERREACH | Compatibility guide says "Most of the engine_kwargs"; ray[llm] pins 0.27.0 | "at the vLLM version Ray pins, since most engine_kwargs and the OpenAI API carry straight over" |
| R5 | "A dead replica is replaced, not a dead endpoint." | RayServeLLM.tsx:65 | prose (negative definition) | Section Shape rule 4 | "A dead replica is replaced while the endpoint keeps serving." |
| R6 | "Work backward from the team and the topology, not from the framework." | RayServeLLM.tsx:813 | prose (rhythm clause) | Section Shape rule 4 | Trailing clause dropped |

Not changed: "SLAs" sits inside a verbatim Anyscale quote and is not expanded.

**Score: 8/10.** Accurate at the pin, every load-bearing claim pinned to Ray 2.59.0 or vLLM v0.31.0
code, the 0.27.0 pairing stated where it matters, payoff lands last. Held at 8 by length (+31%) and
a thin KubeRay quote grid.

## ProductionStack.tsx

Claims checked: 50. CONFIRMED: 46. WRONG: 2. UNSUPPORTED: 1. OVERREACH: 1.

CONFIRMED (summary): README L22 quote; engine and router enabled by default, observability
dependencies gated and off (`PS/helm/values.yaml#L5-L7`, `#L455-L457`, `#L1029-L1056`,
`PS/helm/Chart.yaml#L23-L31`); ServiceMonitor label and ConfigMap dashboards (`values.yaml#L1028-L1048`);
optional Go operator, kinds `VLLMRuntime`, `VLLMRouter`, `CacheServer`, `LoraAdapter`
(`PS/operator/api/v1alpha1/*_types.go`), and no `.go` file under `src/`; eight `--routing-logic`
choices (`PS/src/vllm_router/parsers/parser.py#L229-L241`) and the enum (`routing_logic.py#L54-L62`);
each row's mechanism: round-robin over sorted URLs (`#L171-L228`), session hash ring with lowest-QPS
fallback (`#L230-L282`), prefix HashTrie with the "no eviction" assumption (`#L759-L851`), kvaware
tokenize plus embedded LMCache controller plus threshold fallback (`#L284-L479`), loadaware score and
beta 1.0 (`#L481-L497`, `#L65-L69`), priority header/body, threshold, least-loaded by request stats
and the `--scheduling-policy priority` warning (`#L853-L966`), vLLM `policy = "fcfs"`
(`V/vllm/config/scheduler.py#L160-L166`), disaggregated_prefill `max_tokens == 1` and first engine
(`#L967-L1007`); README WIP and roadmap lines (`PS/README.md#L119-L122`, `#L55`); schema enum of six
(`PS/helm/values.schema.json#L885-L896`); `extraArgs` after `--routing-logic`
(`PS/helm/templates/deployment-router.yaml#L117-L140`); router and model images `latest`
(`values.yaml#L44-L47`, `#L459-L463`); Rust router policies, P/D, SGLang fork
(`https://github.com/vllm-project/router/blob/v0.1.16/README.md#L8-L16`, `#L228-L238`, `#L339`); every
router-blog quote and both benchmark lines (blog text, 2025-12-13); scraper names
(`PS/src/vllm_router/stats/engine_stats.py#L56-L76`), republished gauges
(`.../services/metrics_service/__init__.py#L16-L25`), dashboard expressions (`vllm-dashboard.json#L372`,
`#L442`, `#L548`, `#L640`, `#L733`, `#L826`); routing logics never dereference `engine_stats`
(grep of `routing_logic.py`), so placement is unaffected; vLLM v0.31.0 emits none of the
`gpu_`-prefixed names (`grep -rn gpu_cache_usage_perc /tmp/vllm-new/vllm` empty); section numbers.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| P1 | Quickstart is `helm repo add` plus `helm install ... -f tutorials/assets/values-01-minimal-example.yaml` | ProductionStack.tsx:680-703 | WRONG (incomplete) | The `-f` path is relative to a clone; the README runs `git clone` and `cd production-stack/` first (`PS/README.md#L70-L75`). The two commands alone fail on a missing file | Code block now carries the four README lines; sentence and citation say so (README L70-L75); h2 description no longer says "two commands" |
| P2 | Rebuild the hit rate "from `vllm:prefix_cache_hits` over `vllm:prefix_cache_queries`" | ProductionStack.tsx:613-646 | WRONG (practical) | Both are prometheus_client Counters (`V/vllm/v1/metrics/loggers.py#L599-L611`), scraped as `..._total`; vLLM's own test reads `vllm:prefix_cache_queries_total`, `vllm:prefix_cache_hits_total` (`V/tests/v1/core/prefix_cache/test_hybrid_prefix_cache_hit_rate.py#L67`). The alert compares against the router's `_total` sample names, so the family names misled | Alert names the scraped `_total` series and cites the test; the rebuild instruction uses the rate of the two `_total` counters |
| P3 | Orchestrated P/D: prefill with `kv_transfer_params`, returned metadata to decode, stream back | ProductionStack.tsx:262-276 | UNSUPPORTED (citation) | Cited `routing_logic.py#L1010-L1023` is the class docstring; the flow is code at `PS/src/vllm_router/services/request_service/request.py#L805-L916` | Added the `request.py L805-L916` code citation |
| P4 | llm-d routing row: "called by a Gateway API gateway" | ProductionStack.tsx:744 | OVERREACH (cross-file) | llm-d Router also runs in Standalone Mode with a self-managed Envoy and no Gateway API objects (`LR/README.md#L15`, `#L37-L41`); LlmdKServe says so | "called by a Gateway API gateway or by llm-d Router's standalone Envoy" |

**Score: 8/10.** Code-backed throughout, doc-code conflicts stated with both sides, practical
defaults (images, schema, opt-in observability) land before the closing choice. Held at 8 by length
(+38%) and an eight-row table that carries most of Part 2.

## LlmdKServe.tsx

Claims checked: 57. CONFIRMED: 53. WRONG: 1 (two locations). UNSUPPORTED: 1. OVERREACH: 1.

CONFIRMED (summary): llm-d README quotes, themes, founders and supporters, CNCF sandbox
(`LD/README.md#L18-L30`, `#L38`, `#L57`); release-body component summary, deprecations and the
`OffloadingConnector` quote (`https://github.com/llm-d/llm-d/releases/tag/v0.10.0`); llm-d Router
README: rename, consolidation, standalone and Gateway modes, sidecar, InferenceObjective,
InferenceModelRewrite, "brain" quote (`LR/README.md#L10-L46`); filters, weighted scorers, picker
(`LR/pkg/epp/scheduling/scheduler_profile.go#L132-L149`, `#L243-L259`), weight default 1.0 and
`max-score-picker` default (`LR/docs/architecture.md#L247-L258`); vLLM metric mappings and engine
default (`LR/pkg/epp/framework/plugins/datalayer/extractor/metrics/factories.go#L84-L108`); pool
metrics `llm_d_epp_*` (`LR/pkg/epp/metrics/llm_d_router_metrics.go#L181-L224`, subsystem `llm_d_epp`);
vLLM `vllm:kv_cache_usage_perc` and `vllm:lora_requests_info` (`V/vllm/v1/metrics/loggers.py#L577`,
`#L993`); approximate and precise prefix producers (their READMEs), `KVEventsConfig`
(`V/vllm/config/kv_events.py#L10-L52`); scorer directory listing (18 scorers at v1.0.0) and the
multimodal and topology scorers (READMEs, `topologyaffinity/scorer.go#L37-L50`); decode-first P/D,
decider, header, sidecar `max_tokens=1`, `nixlv2` = `NixlConnector`, E/P/D proof of concept
(`LR/docs/disaggregation.md#L5-L19`, `#L82-L91`, `#L128-L148`, `#L604-L618`), decode-first is the
code default (`.../profilehandler/disagg/disagg_profile_handler.go#L59-L72`); GIE quotes and the move
notice (`kubernetes-sigs/gateway-api-inference-extension` README at v1.6.2 L8-L44, L79; present from
v1.6.0; v1.5.0 L31), InferencePool v1 CRD, v1.0.0 "marks the v1" (2025-09-09), v1.6.2 (2026-09-17);
KServe `llmisvc` short name, storage version, `LLMInferenceServiceConfig`, prefill, router,
scheduler, baseRefs, `kvCacheOffloading` tiers, v1alpha1 conversion
(`https://github.com/kserve/kserve/blob/v0.21.0/pkg/apis/serving/v1alpha2/llm_inference_service_types.go`);
vLLM KServe page quotes (`V/docs/deployment/integrations/kserve.md#L3-L5`); blog quote, benchmark,
model and hardware, authors and date (blog text, 2026-04-21); the production-stack metric contrast;
section numbers.

| # | claim (short) | file:line | verdict | evidence | fix applied |
|---|---|---|---|---|---|
| L1 | "Operators (KServe and llm-d) turn a declarative custom resource into the fleet"; "KServe and llm-d ... reconcile the custom resource into the Deployments, the InferencePool, the EPP" | LlmdKServe.tsx:279-281, 312-316 | WRONG (cross-file) | llm-d ships "benchmarked recipes and Helm charts" (`LD/README.md#L32`); the llm-d org has no operator repository (`gh api orgs/llm-d/repos`); the custom resource is KServe's `LLMInferenceService`. ProductionStack's comparison row and register 05 row 25 already say "Helm guides plus the Gateway API inference CRDs" | Control plane described as KServe's operator reconciling one custom resource, and llm-d's Helm guides installing the same pieces; neither in the request path |
| L2 | "the operator owns the boilerplate (Deployments, Services, InferencePool, autoscaling)" inside the Red Hat/Tesla blog attribution | LlmdKServe.tsx:804-815 | UNSUPPORTED | The blog's "Deep Customization" paragraph has no such clause; it says the objects expose "the standard Kubernetes API, allowing us to override the spec precisely where needed" and that this control "is crucial for tailoring vLLM to specialized hardware or quickly implementing flag changes" | Unsupported clause removed; the second blog sentence quoted instead; the kind-name note reworded to stand alone |
| L3 | "That makes the vLLM inside an llm-d v0.10.0 pod v0.30.0" | LlmdKServe.tsx:941-943 | OVERREACH | Release body pins `vllm-tpu` v0.29.0 and `vllm-omni` v0.28.0 beside `vllm-openai` v0.30.0 | "inside an llm-d v0.10.0 pod on that image ... (the release pins its TPU image at v0.29.0)" |

Not changed (minor, diagram text): the `GatewayRoutingDiagram` legend says "decoder reads the KV over
NIXL" before the caption expands NIXL; the diagram's "KServe + llm-d / reconciles" box reads
correctly as KServe driving llm-d, so it was left untouched.

**Score: 7/10.** Facts now hold at every pin and the version set is stated where the reader acts on
it. Held at 7 by length (+70% words) and density in the scorer section, where three citation-heavy
paragraphs follow the six signal boxes.

## Results

```
pnpm --filter @tech-deep-dives/vllm typecheck  ->  tsc --noEmit, exit 0
pnpm --filter @tech-deep-dives/vllm lint       ->  eslint src --ext .ts,.tsx --max-warnings 0, exit 0
bash scripts/gates/no-ai-tells.sh              ->  [PASS] no-ai-tells: no AI tells in 2 opted-in deep dive(s)
```

## Leverage pass: LlmdKServe.tsx (2026-10-18)

Verbs used: demote, reorder, delete (repetition only), re-express. No claim, scope or citation
changed; 72 Cites before, 71 after (the one removed went with a deleted duplicate, below).
Prose words (body text, table cells, headers; Cite labels and the SVG excluded): 2779 to 2694.
Visible prose outside ExpandableSections: 2282 to 2026 (-11%). `wc -w` on the file: 4970 to 4878.
Diagram not moved; harness run anyway: 2 diagrams, 0 overlaps/clipping, 0 console errors.

**Moved.**
- Scoring section: the "Past these six" scorer inventory is now an ExpandableSection ("Other
  scorers in llm-d Router v1.0.0") right after the six signal boxes, so the section ends on the
  approximate-versus-precise prefix paragraph and its `--kv-events-config` knob.
- "Where the EPP code lives" alert moved out of the scoring section into the GIE deep-dive
  expandable (header and the Deep dives h2 description now name it), as a paragraph with
  unchanged text and citations.
- Composition section: the engine-level versus cluster-level grid moved from last to first (model
  before mechanism); the topology-affinity scorer and E/P/D proof of concept demoted into an
  ExpandableSection; the KServe `kvCacheOffloading` paragraph now lands last. Title is now "How the
  engine optimizations compose with routing", since the prefix-routing sentence it named was cut.
- Closing block reordered so it ends on "go to section 24".

**Cut as repetition.**
- Intro: KServe-operator/Helm-guides detail (kept in the request path, with "without an
  operator") and the "section 24 runs this stack on AWS" clause (kept in the closing block).
- Request path: "the gateway forwards there" (the paragraph's first sentence says it).
- Components table: GIE "Current release v1.6.2" (kept in the GIE expandable with its release
  citation, and in the pin block) and the EPP row's scorer list (intro and the six boxes carry it).
- Scoring intro: the llm-d Router "brain" quote and its README L27 Cite (KV-cache locality, load
  and priority are stated by the intro, the boxes and the InferenceObjective row).
- Composition: "Prefix-cache-aware routing is the cluster-scale version of automatic prefix
  caching" (said in the prefix-hit box and the grid); the second naming of section 10's title.
- Comparison: the paragraph's "Pick by how much Kubernetes machinery ..." sentence (folded into
  the h2 description, which already said half of it).
- Session-affinity box: the trailing "an expensive routing mistake for chat workloads".
- Closing: "Read this section for the shape of the operator path" (meta).

h2 descriptions rewritten to state the payoff (request path, components, scoring, composition,
pin block); each new phrase re-expresses text already in its section.

**Score: 8/10.** Each section now reads model first and ends on something the reader sets or
checks (`--kv-events-config`, `kvCacheOffloading`, the metric-name alert, the v0.30.0 pin).
Still not 9: total prose is about 2694 words against 1868 at `145314b`, because no verified fact was cut.
