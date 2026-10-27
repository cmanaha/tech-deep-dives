# Fact check fc09-k8s-sm: sections 18 (Multi-Node and Kubernetes Orchestrators) and 19 (SGLang on SageMaker AI and HyperPod)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
External repos read at the refs the page cites through `gh api`. AWS pages fetched 2026-10-24.
Status: COMPLETE. No diagram was touched in either file, so the harness was not run.
Checks after the fixes: typecheck exit 0, lint exit 0 (`--max-warnings 0`), no-ai-tells PASS,
pinned-refs PASS, svg-a11y PASS.

## MultiNodeKubernetes.tsx (section 18, Multi-Node and Kubernetes Orchestrators)

92 claims checked: 85 CONFIRMED, 1 WRONG, 4 UNSUPPORTED (cited range lacks the evidence), 2
OVERREACH, plus 1 prose-rule fix (EP not expanded).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1 | `python -m sglang_router.launch_router` binds the gateway metrics to 127.0.0.1 unless `--prometheus-host 0.0.0.0` is passed | MultiNodeKubernetes.tsx:1290-1303 | WRONG | The launcher's argparse default is `--prometheus-host 0.0.0.0` (`sgl-model-gateway/bindings/python/src/sglang_router/router_args.py#L486-L490`); `launch_router.py` builds `RouterArgs.from_cli_args(parser.parse_args(...))`, and `router.py` `from_args` passes `prometheus_host` to the Rust `_Router` (not in `fields_to_remove`). The `lib.rs#L1000-L1006` fallback to 127.0.0.1 applies only when `prometheus_host` is `None`, i.e. a `Router`/`RouterArgs` built in Python code (`RouterArgs.prometheus_host = None`, `router_args.py#L85`; `lib.rs#L702`). Also overrides the register 06 authoring erratum and the build-log row 18 note. | Rewrote item 5: both launchers bind 0.0.0.0 (main.rs L269-L275, router_args.py L480-L490); a router built in Python code without `prometheus_host` binds 127.0.0.1 (lib.rs L1000-L1006, code). |
| 2 | 4,000 page-1 hashes "merged into one `BlockStored` message" | :706-716 | UNSUPPORTED | Cited `mem_cache/events.py#L161-L217` emits one `BlockStored` per page; the merge is `enqueue` coalescing a compatible tail (`events.py#L95-L124`). | Added cite `events.py L95-L124`. |
| 3 | HiCache: "a demotion arrives as a GPU removal plus a store on the host medium" | :723-738 | UNSUPPORTED | Cited `disaggregation/kv_events.py#L261-L267` is only the `StorageMedium` enum. Code: the host store is recorded when the write-through backup is acked (`mem_cache/unified_cache/unified_tree_core.py#L2758-L2767`), the GPU removal at device eviction (`#L2050`), so the two do not arrive together as one demotion. | Reworded: every event names its medium, a finished host backup sends a host store and a device eviction sends a GPU removal; added both unified_tree_core.py cites. |
| 4 | Dynamo "turns KV routing on when `--kv-events-config` names a publisher other than null" | :1113-1121 | OVERREACH | Dynamo `components/src/dynamo/sglang/args.py#L913-L936` (v1.6.0) sets `use_kv_events`, which makes the worker republish KV events to Dynamo's router (`publisher.py#L628-L632`); routing mode is `DYN_ROUTER_MODE=kv` on the frontend (`examples/backends/sglang/deploy/agg_router.yaml#L14-L16`), as the table row says. | "relays the worker's KV events to its router when ..."; added publisher.py L628-L632 cite. |
| 5 | Experimental `sgl-router` "hashes each prompt page by page the way the worker does" | :1186-1198 | UNSUPPORTED | Cited `experimental/sgl-router/src/state/kv_events/subscriber.rs#L1-L25` covers the per-worker subscription only; the page hashing mirror is `src/state/kv_events/hash.rs#L1-L17`. | Added cite `hash.rs L1-L17`. |
| 6 | A new replica copies the index from a warm sibling "before it reports ready" | :1200-1209 | UNSUPPORTED | Cited `src/server/routes/cache.rs#L107-L160` is the producer handler only; the doc comment is at `#L90-L97` and the readiness gate is `src/state/kv_events/bootstrap/tracker.rs#L274-L282` (`admit_ready`). | Cite widened to cache.rs L90-L160 and tracker.rs L274-L282 added. |
| 7 | "KServe's default-branch runtime is eight releases behind" | :786-787 | OVERREACH | Runtime pins `lmsysorg/sglang:v0.5.14` (kserve commit 14c1bff `config/runtimes/kserve-llm-sglang.yaml#L12`); GitHub lists nine SGLang releases after v0.5.14 up to v0.5.22 (v0.5.15.post1 included), eight version numbers. | "pins v0.5.14, eight versions behind". |
| 8 | EP used without expansion (first in the section 22 title reference, then "wide-EP") | :1063, :1087 | prose rule | Acronym Standard. | "wide-EP (expert parallelism) line". Section-title mention left as a proper name. |

Settled open items (build-log row 18):

- **Prefill Service exposes only 30000, decode contacts it on 8998.** Holds at the pin, kept as
  "our reading of the code, not run". `lws_pd_deploy.mdx#L650-L663` lists only port 30000 on a
  ClusterIP Service (no `clusterIP: None`; the pods run `hostNetwork: true`, `#L153-L155`, which
  does not change what a ClusterIP Service forwards). The gateway takes the bootstrap host from
  the URL (`sgl-model-gateway/src/core/worker_builder.rs#L136`, `core/worker.rs#L42-L57`), sends a
  null port when none is given (`routers/http/pd_router.rs#L282-L292`), the decode scheduler
  substitutes its own 8998 (`managers/scheduler.py#L2847-L2848`), and decode fetches
  `http://{host}:{port}/route` (`disaggregation/decode.py#L141-L143`,
  `disaggregation/common/conn.py#L2380-L2390`).
- **LWS, RBG, llm-d, Dynamo, Ray claims at the cited versions.** All confirmed apart from rows 4
  to 6: LWS manifest and `LWS_WORKER_INDEX` from v0.6.0 (`deploy_on_k8s.mdx#L20`, `#L76-L125`,
  `#L208-L220`); RBG `dependencies`, `pd_role` on the leader template, `--policy random`,
  `--disable-radix-cache` (`deepseekv32_pd.mdx#L26-L45`, `#L61`, `#L479-L502`); RBG v0.8.0
  README deprecates `v1alpha1` and LeaderWorkerSet workloads (`README.md#L83-L102`), its PD
  example uses `v1alpha2` `leaderWorkerPattern` and names `v0.5.9-cu124` "(or later)"; llm-d
  v1.0.0 pins `lmsysorg/sglang:v0.5.22`, the AWS overlay pins DLC 0.5.20 with the EFA comment,
  8 EFA devices on p5en and `SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC`; Dynamo v1.6.0 pins
  `sglang[diffusion]==0.5.21` and runtime `v0.5.21-cu130-runtime`; Ray 2.59.0 pins vLLM 0.27.0
  and no SGLang, marks the integration early development, needs one bundle per node; KServe
  v0.21.0 tree has no `sglang` path (recursive tree, not truncated). Release dates checked on
  the release pages (llm-d 2026-10-20, Dynamo 2026-10-22, SGLang v0.5.22 2026-10-19, RBG
  2026-08-31, Ray 2026-10-02, KServe 2026-09-25).
- **llm-d's `--enable-ep-moe`.** `grep -rn enable-ep-moe python docs` at the tag returns nothing
  (one code comment in `models/deepseek_v2.py#L712` says `enable_ep_moe`, not a flag). The page
  keeps the scoped hedge "was not found ... during this research". `--enable-kv-cache-events`
  likewise absent; `--enable-dp-attention` is deprecated into `--attn-dp-size`
  (`arg_groups/parallel_hook.py#L39-L61`).

Score: **8/10.** Accurate at the pin after the fixes, with dense pinned citations and a clear
cache-signal mental model; the closing checklist lands the action. Held at 8 by the long
orchestrator walk-through, where several claims rested on cited ranges that missed the evidence.

## AwsManagedPaths.tsx (section 19, SGLang on SageMaker AI and HyperPod)

84 claims checked: 76 CONFIRMED, 2 WRONG, 3 UNSUPPORTED, 3 OVERREACH, plus 1 cross-section
consistency edit (section 12 key story made explicit).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1 | "`/invocations` skips that check, so ... clients on `InvokeEndpoint` need not [send `Content-Type: application/json`]"; next-step item 6 asked for the header on the OpenAI path only | AwsManagedPaths.tsx:567-582, :1169-1170 | WRONG | The SGLang check skip holds (`entrypoints/http_server.py#L2129-L2137` has no `validate_json_request`), but FastAPI parses a body as JSON only when the content type is JSON, and from 0.132.0 refuses a missing header by default (`strict_content_type`), keeping the raw bytes, which then fail `ChatCompletionRequest` validation: https://github.com/fastapi/fastapi/blob/0.162.0/fastapi/routing.py#L458-L475 and https://github.com/fastapi/fastapi/releases/tag/0.132.0. SGLang leaves the default (`grep strict_content_type python/` empty) and pins `fastapi` unversioned (`python/pyproject.toml#L40`). SGLang's own boto3 example sends `ContentType="application/json"` (`docs/docs/basic_usage/aws_sagemaker.mdx#L105-L113`). Read from code, not run. | Rewritten: send the header on both paths, with the FastAPI code and release cites and the docs example; item 6 now says "on both paths". |
| 2 | "AWS offers four places to run an open-weight model", then names Bedrock, SageMaker AI, HyperPod, EKS and EC2 and splits them two and two after Bedrock | :428-434 | WRONG | Internal count: five named (the h2 "Four AWS paths" counts the four that run SGLang, which stays right). | "five places". |
| 3 | The example deploy script "still names `al2-ami-sagemaker-inference-gpu-3-1`, NVIDIA driver 550 and CUDA 12.4" | :749-756 | UNSUPPORTED | `examples/sagemaker/deploy_and_serve_endpoint.py#L32-L38` names only the AMI; driver 550 and CUDA 12.4 come from https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_ProductionVariant.html (InferenceAmiVersion list). "still" was page-history voice. | Driver and CUDA now cite ProductionVariant; "still" dropped. |
| 4 | "SGLang's SageMaker page requires `InferenceAmiVersion=al2023-ami-sagemaker-inference-gpu-4-1`" | :733-741 | OVERREACH | `aws_sagemaker.mdx#L137-L140` requires an `inference_ami_version` (any valid value) because the default AMI's drivers do not fit CUDA 13; gpu-4-1 is the value its examples set (`#L57`, `#L98`). | Split: page requires an `InferenceAmiVersion`; its examples set gpu-4-1 (added L98 cite). |
| 5 | Ubuntu DLC tag `0.5.22-gpu-py312-cu130-ubuntu24.04-sagemaker` | :646-656 | UNSUPPORTED | Neither cited file carries the tag (`docker/sglang/Dockerfile#L1-L6` is the base, `.github/config/image/sglang/sagemaker-ubuntu.yml#L1-L20` gives `prod_image: sglang:0.5-gpu-py312`). The tag is in https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/docs/src/data/sglang/0.5.22-gpu-sagemaker.yml#L10-L14; ECR Public lists it, pushed 2026-10-23 (gallery `describeImageTags` API). | Added the data-file cite. |
| 6 | Cite `Dockerfile.amzn2023 L530-L542` | :352-353 | UNSUPPORTED | File has 541 lines at the DLC SHA; the SageMaker stage that installs `sagemaker_entrypoint.sh` is L529-L541. | Range set to L529-L541. |
| 7 | "The Neuron SDK documentation's one SGLang reference credits SGLang's jump-forward decoding as the model for vLLM Neuron's version" | :1032-1038 | OVERREACH | The Neuron 2.33.0 page credits SGLang only for disabling logprobs: "Taking inspiration from the original jump-forward implementation in SGLang, we disable proper logprobs for JF decoding" (https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/vllm-neuron/docs/design/vllm/additional-config.html). "One reference" is a docs-search result (register 09 E4), stated as a fact about the whole documentation. | Narrowed to the search result and the quoted logprobs sentence. |
| 8 | "SageMaker's health check sends no token" | :777-783 | OVERREACH | AWS documents periodic `GET /ping` and names no way to attach a token (https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html); section 12 (ApiSurfaces.tsx:499-505) words it that way. | Reworded to "AWS names no way to attach a token to SageMaker's health check", with the cite. |
| 9 | Key story vs section 12 | :789-797, :1155-1157 | consistency | Section 12 row `sagemaker` (ApiSurfaces.tsx:488-520): `--admin-api-key` only via `SM_SGLANG_ADMIN_API_KEY`; `/ping` and `/invocations` stay unkeyed (our reading); AWS advises keeping sensitive data out of `Environment`. Section 19 agreed only by reference. | Made explicit: set only the admin key as `SM_SGLANG_ADMIN_API_KEY`, `/ping` and `/invocations` unkeyed behind IAM (our reading); next-step item 3 names the variable. The ContainerDefinition "Don't include any sensitive data in your environment variables" note was already present. |

Settled open items (build-log row 19, and the task brief):

- **AWS facts against the cited pages (fetched 2026-10-24).** Confirmed: 8 minutes and 2 s
  `/ping` timeout, launch situations, static-200 advice, POST on `/ping` and `/invocations`
  (custom inference code page); `ContainerStartupHealthCheckTimeoutInSeconds` and
  `ModelDataDownloadTimeoutInSeconds` 60 to 3600, gpu-4-1 driver 580 / CUDA 13.0 (ProductionVariant);
  100 entries, 1,024 bytes, 32 KB, minimum value length 0, sensitive-data advice
  (ContainerDefinition); `/openai/v1/chat/completions`, `/v1/chat/completions` requirement, SGLang
  DLC "Supported", `sagemaker:InvokeEndpoint` (OpenAI-compatible page); 1800 in the LMI hosting
  example; native SGLang metrics listed with no flag (detailed observability); SGLang among the
  runtimes that download natively, vLLM-only examples (HyperPod deploy); `engineType` vllm or
  sglang, default vllm, start SGLang with `--enable-metrics` (HyperPod gateway); DPD images carry
  LMCache 0.4.3, vLLM 0.19.0, NIXL 1.0.0 (HyperPod DPD); Bedrock CMI pages name no engine. DLC at
  23970abd: entrypoint boolean handling, Ubuntu base `lmsysorg/sglang:v0.5.22`, AL2023 line at
  0.5.19, configuration doc L35-L38. ECR Public: `server-sagemaker-cuda-v1.0` pushed 2026-06-18.
- **Vendor figures stay attributed.** The section ships no AWS performance number; the MoE RL
  post's 40 percent claim is deferred to section 22. Blog dates checked on the posts.
- **LMI hedge.** "SGLang appears on neither the LMI container page nor the deployment-options
  page read for this research" stays scoped; `grep -ci sglang` on the LMI container docs, LMI
  hosting and deployment-options pages returns 0.
- **Trainium plugin hedge.** Re-ran the three GitHub repository searches: they return
  `yottalabsai/mini-sglang-neuron` (mini-sglang), `foxl-ai/kiln` (a separate Trainium engine) and
  `aws-solutions-library-samples/global-capacity-orchestrator-on-aws`; none is an SGLang
  `sglang.srt.platforms` plugin, so the scoped hedge holds.

Score: **8/10.** Accurate at the pin after the fixes, AWS claims tied to the pages they come
from, and the section ends on a concrete endpoint checklist with a boto3 block. Held at 8 by two
reader-facing errors the fixes had to remove (the content-type advice and the path count).

## Items for the orchestrator (files fc09 does not own)

- `research/2026-10/06-router-multinode.md` authoring erratum and build-log row 18 say
  `launch_router` binds metrics to 127.0.0.1. Wrong for the CLI: `router_args.py#L486-L490`
  defaults `--prometheus-host` to 0.0.0.0; only a `Router` built in Python code without
  `prometheus_host` falls back to 127.0.0.1 (`lib.rs#L1000-L1006`). Section 18 is corrected.
- Not added (corrections only): `docker/serve#L33` and the DLC `sagemaker_entrypoint.sh#L49` both
  echo the full launch command, so `SM_SGLANG_ADMIN_API_KEY` reaches container stdout and
  CloudWatch Logs (already listed in the build log's decisions block).
- Acronym for the glossary: EP (expert parallelism) now expanded in section 18.
