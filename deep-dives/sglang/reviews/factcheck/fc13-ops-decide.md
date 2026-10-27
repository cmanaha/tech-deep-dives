# fc13-ops-decide: fact check of section 25 (Operations: metrics, warm-up, keys and failure signatures) and section 26 (Decision Guide)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d (`/tmp/sglang-src`). vLLM v0.31.0 read through
`gh api repos/vllm-project/vllm/contents/<path>?ref=v0.31.0`. AWS DLC at 23970abd, awsome-distributed-ai at 24a8d720,
Ray at ray-2.59.0, all through `gh api`. Kubernetes probes page, the nine GitHub advisories (`gh api /advisories/<GHSA>`,
plus the `ecosystem=pip&affects=sglang` list), the NVD API for all nine CVEs, the GitHub security pages and the v0.5.22
release notes fetched 2026-10-24 with no identifying headers. Checked 2026-10-24.
Paths below are relative to `python/sglang/srt/` unless they start with another top-level directory.

Status: COMPLETE (findings below; checks at the end).

## Operations.tsx (section 25)

95 claims checked (the 79 original `Cite`s, the 18 symptom rows and four key-gap rows, the nine advisory rows field by
field, the advisory counts, the vLLM `/metrics` mount and the section cross-references). 79 CONFIRMED.
WRONG 2, OVERREACH 7, UNSUPPORTED 6, prose 1.

| # | claim (short) | file:line (before fix) | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| O1 | "With no key set, the admin routes accept any client that can reach the port" (intro), no exception | Operations.tsx:864-875 | OVERREACH | `entrypoints/http_server.py#L1106-L1173`: the three HiCache storage routes return an error when no admin key is set; fc01 T5 made the same correction in section 1; section 12's matrix carries it | Added "the three HiCache storage routes excepted, which refuse to run without an admin key" with the http_server.py cite (first statement only; the two later repeats stay as the section's strongest line) |
| O2 | Retract row: `sglang:new_token_ratio` "jumping at each one" | :119-120 | OVERREACH | Gauge set only when a prefill batch is logged (`managers/scheduler_components/metrics_reporter.py#L720-L722`); fc02 S3 found "every jump lines up with one retraction" wrong; section 4 now says "jumps after a retraction" | "jumping after them" |
| O3 | `/ping` with `--api-key`: "SageMaker sends none" | :243-248 | OVERREACH | AWS documents a periodic `GET /ping` and names no way to attach a token (https://docs.aws.amazon.com/sagemaker/latest/dg/your-algorithms-inference-code.html); fc06 #14 and fc09 #8 narrowed the same wording in sections 12 and 19 | "and AWS names no way to attach a token to the health check" with the AWS cite; the code-reading label stays on the exemption half |
| O4 | Follower stub answers 200 "whatever the model's state", every node after node 0 | :356-365 | OVERREACH | `entrypoints/engine.py#L1228-L1281`: the stub starts only after `wait_for_ready()` and only when no node-local Rust listener owns the port; fc01 R7 scoped section 3 the same way | "On the Python frontend, every node after node 0 waits for its schedulers to load, then serves a stub app ... always answer 200"; matches RuntimeProcesses.tsx L759-L768 |
| O5 | LoRA row: "The OpenAI handlers" split `model` at the first colon and do not check the name | :414-419 | OVERREACH | `entrypoints/openai/serving_base.py#L40-L71` is used by chat and completions; `serving_responses.py#L272-L290` validates names (fc06 #11) | "The chat and completions handlers" |
| O6 | Heartbeat failure fails every unfinished request, cite conn.py L1817-L1858 | :497 | UNSUPPORTED (range) | Request failure and the `Lost connection with prefill instance` log are in `disaggregation/common/conn.py#L1873-L1916` | Range widened to L1817-L1916 |
| O7 | `/server_info` row: route, level and response cited, redaction not cited; http range stops at L848 | :617-633 | UNSUPPORTED (range) | Handler builds the response at `entrypoints/http_server.py#L847-L874`; only `watermark_key`, `watermark_key_b`, `watermark_config` redacted (`sampling/watermarking/core.py#L26-L104`); section 12 cites both | http cite widened to L837-L874; added "with only watermark secrets redacted" + watermarking/core.py L26-L104 cite (kind code). "Read from source, not run" kept |
| O8 | Rust frontend no auth layer, cite app.rs L77-L89 | :702 | UNSUPPORTED (range, minor) | The optional HTTP layer hook is at `rust/sglang-server/src/api_server/http/app.rs#L90-L92` (fc01 R12) | Cite widened to L77-L92 |
| O9 | `SM_SGLANG_ENABLE_METRICS=true` on the DLC, no cite | :109-110 | UNSUPPORTED | DLC `scripts/docker/sglang/sagemaker_entrypoint.sh#L17-L32` at 23970abd turns `true` into a bare flag (SGLang's own `docker/serve#L9-L16` would pass `--enable-metrics true`) | Added the DLC entrypoint cite |
| O10 | v0.5.22 release notes "list ... under 'Require admin auth'" | :1087-1088 | WRONG (form) | Release body line 793: an item, "[Fix] Require admin auth for /load_lora_adapter_from_tensors and /set_trace_level: #41322", not a heading (`gh api repos/sgl-project/sglang/releases/tags/v0.5.22`) | "carry the fix 'Require admin auth for ... and ...'"; doc-code-conflict label and the code reading (ADMIN_OPTIONAL at `http_server.py#L1208-L1209`, `#L1628-L1629`) kept |
| O11 | "On SM90 or newer, block-quantized FP8 linear layers run on DeepGEMM", cite compile_utils.py L59-L113 | :996-1001 | OVERREACH + UNSUPPORTED | `layers/deep_gemm_wrapper/configurer.py#L32-L56` (SM120/121 need the SM120 APIs, package must import, env switch); `layers/quantization/fp8_utils.py#L1025-L1053` (auto picks DeepGEMM first); L59-L113 is the token-count list only; fc04 K12 | "run on DeepGEMM by default wherever the installed DeepGEMM build supports the GPU" with configurer.py and fp8_utils.py cites; compile cite widened to L42-L113 as in section 8 |
| O12 | JIT kernel cache does not follow `SGLANG_CACHE_DIR`, no cite | :1014-1016 | UNSUPPORTED | `python/sglang/kernels/jit/utils/compile/cache.py#L302` defaults to the literal `~/.cache/sglang/jit`; `environ.py#L1261` | Added the cache.py L302 cite (kind code) |
| O13 | "the diffusion scheduler's socket no longer follows a wildcard --host" | :1138-1139 | prose (history voice) | Section Shape rule 1 | "stays on loopback when --host is a wildcard" (fact unchanged: `multimodal_gen/runtime/server_args/server_args.py#L3289-L3312`; v0.5.21 pins only `localhost`; release notes #36854 and #17270) |
| O14 | "SGLang publishes no security policy or private disclosure channel on GitHub" | :1180-1181 | WRONG | `gh api repos/sgl-project/sglang/private-vulnerability-reporting` returns `{"enabled":true}`; https://github.com/sgl-project/sglang/security/policy shows "No security policy detected" and a "Report a vulnerability" button; `security-advisories` returns 0 | "publishes no security policy file and no repository security advisories on GitHub, and its security page offers GitHub's private vulnerability reporting" |
| O15 | CVEs "filed by outside reporters", no source | :1186 | UNSUPPORTED | NVD API: source CERT/CC (`cret@cert.org`) for CVE-2026-3059, -3060, -3989, -7301, -7302, -7304; VulDB for -7669, -10300, -10775; GitHub entries carry no repository advisory | Added "the NVD records name the CERT Coordination Center or VulDB as their source" with NVD cites for CVE-2026-3059 and CVE-2026-7669 |
| O16 | Advisory table column "Severity" | :1172 | OVERREACH (label) | GitHub rates CVE-2026-10775 low; NVD's own primary score is 5.3 MEDIUM (NVD API). The other eight agree | Header "Severity (GitHub)" |

Confirmed highlights: metrics off by default and served on the API port (`arg_groups/fields/observability.py#L70`,
`entrypoints/http_server.py#L301-L304`); `/health`, `/ready`, `/metrics` prefixes exempt (`utils/auth.py#L101-L106`);
vLLM v0.31.0 registers its metrics router unconditionally (`vllm/entrypoints/serve/__init__.py#L19-L22`,
`serve/instrumentator/__init__.py`); hit-rate PromQL is `sum(rate)/sum(rate)` (fc02); tuning guide 0.3 / 1.3 / one
retraction a minute (`docs/.../hyperparameter_tuning.mdx#L22-L31`); token usage counts evictable cache as free
(`pool_stats_observer.py#L235-L245`); DeepGEMM warning "typically 10-20 mins", no hardware stated
(`compile_utils.py#L166-L185`); `/health` 503 while Starting and the 20 s window (`http_server.py#L205-L207`,
`#L715-L783`, `SGLANG_ENABLE_HEALTH_ENDPOINT_GENERATION` default True at `environ.py#L341`); pause holds the check
(`tokenizer_manager.py#L939-L940`); `/ready` answers without generating (`http_server.py#L698-L702`); grammar 10,000
polls x 5 ms = 50 s and cached failure (`environ.py#L399-L400`, `grammar_manager.py#L177-L189`, `#L312-L322`); PD
heartbeat 5 s x 2 (`environ.py#L708-L709`), 500 on transfer failure (`disaggregation/decode.py#L2760-L2786`), gateway
drops the paired decode (`pd_router.rs#L732-L745`); gateway health 60 s / 5 s / 3, breaker 10 consecutive failures,
metrics port 29000 (`main.rs#L270`, `#L380-L425`, `circuit_breaker.rs#L104-L252`); AWS sample figures (14 GB/s vs
400 GB/s, 3-5x TTFT, Mooncake TCP fallback, 0.5.13.post1 base, 1,800 s with NVMe-staged weights); multi-tokenizer
and Rust-frontend key gaps (`http_server.py#L240-L250`, `#L2656-L2690`); gateway `/server_info` in the public group
(`server.rs#L593-L605`, `router.rs#L92-L131`); 127.0.0.1 bind and the SageMaker entrypoint's 0.0.0.0
(`serving.py#L65-L66`, `docker/serve#L23-L26`); DLC EKS page requires `--host 0.0.0.0`; custom logit processor off
and loaded with `dill` (`exec_.py#L68-L71`, `custom_logit_processor.py#L15-L21`).

Advisories, each checked against its GitHub advisory (`gh api /advisories/<GHSA>`) and the NVD API: all nine IDs,
GHSA pairings, GitHub severities, affected ranges and patched versions match the table; GitHub lists exactly nine
`sglang` advisories published in 2026 (2026-03-12 to 2026-06-04; the tenth, CVE-2025-10164, is from 2025); five
critical, six with no patched version. The critical five are pickle or dill loads or an upload-filename path traversal,
in the diffusion runtime (3), EPD (1) and behind `--enable-custom-logit-processor` (1). The advisory text for
CVE-2026-7304 places the flag in the multimodal runtime, but the flag exists only under `srt/` at the tag
(`grep` of `multimodal_gen/` empty); the page names the flag, which holds. v0.5.22 is the first release with both
hardenings (v0.5.21 `server_args.py` pins only `localhost`; no `sanitize_upload_filename` at v0.5.21; release notes
#36854, #17270); the pickle sink stays (`multimodal_gen/runtime/managers/scheduler.py#L1329`).

Section 25's five code findings, all kept "read from source, not run" with each step cited at v0.5.22:
1. `/server_info` key exposure: no `@auth_level` (`http_server.py#L837-L848`), NORMAL rule (`auth.py#L145-L151`),
   response is `resolved_dict()` plus `launch_command` (`server_args.py#L315-L330`, `utils/common.py#L3640-L3650`),
   watermark-only redaction (now cited). Agrees with section 12 (ApiSurfaces.tsx L1290-L1330) and fc06 step 4.
2. `/health` one-second wait against the Kubernetes default: the handler sleeps 1 s before its first look
   (`http_server.py#L762-L769`); the Kubernetes probes page says `timeoutSeconds` "Defaults to 1 second. Minimum value
   is 1." (https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/, fetched 2026-10-24);
   SGLang's sample sets 10 (`docker/k8s-sglang-service.yaml#L76-L92`). CONFIRMED; agrees with section 20.
3. Follower-node `/health` stub: CONFIRMED with the two conditions now in the row (O4); agrees with section 3.
4. Multi-tokenizer mode never installs the key middleware: CONFIRMED (`http_server.py#L2656-L2690`, assert at
   `#L246-L249`); agrees with sections 3 and 12.
5. Rust frontend has no auth layer and no `/metrics`: CONFIRMED (`app.rs#L77-L92`, TODO(auth) comment; no `/metrics`
   route under `rust/`); agrees with sections 3 and 12.

Cross-section items from the brief: hit-rate PromQL sums each counter (holds); `/metrics` on the API port, off unless
`--enable-metrics` (holds); the section makes no `launch_router` metrics-bind claim, only the port 29000 (holds);
the section makes no InvokeEndpoint content-type claim; no B200 or handshake-timing statement beyond "under the
default `early` policy a request waits there until decode reserves its pages", which matches the Cross-section block;
no mesh claim.

**Score: 8/10.** The symptom-to-cause tables are practical and every row keeps its owner's conditions, the key-gap
table now matches sections 3 and 12 step for step, and the admin-plane line lands three times with the action last.
Held at 8 by four dense tables whose cause cells carry three or more citations each, which make the middle slow to read.

## DecisionGuide.tsx (section 26)

72 claims checked (the 60 `Cite`s, the diagram's 17 text labels against the table, the five cost levers, the six
first-week steps and the section 23 checklist description). 65 CONFIRMED. WRONG 1, OVERREACH 3, UNSUPPORTED 1,
cross-section wording 2.

| # | claim (short) | file:line (before fix) | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| D1 | P6 64-token pages "when speculative decoding is off or on with an explicit `--speculative-eagle-topk 1` and `--speculative-num-steps`" (prefix row) | DecisionGuide.tsx:308-311 | cross-section wording | Build-log Cross-section block: "speculation off, or on with explicit topk 1 and num-steps set"; `arg_groups/speculative_hook.py#L1068-L1072` | "... and `--speculative-num-steps` set" |
| D2 | Same condition in the "64-token pages on P6" cost row | :548-550 | cross-section wording | Same | Same fix; the row already carries fc04's explicit-page refinement (`utils/common.py#L4014-L4020`) |
| D3 | "vLLM caches prefixes by default too", no cite | :337 | UNSUPPORTED | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L142 (`enable_prefix_caching: bool = True`) | Added the vLLM cite |
| D4 | vLLM "shards experts over TP x DP" | :399-401 | WRONG (minor) | https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/parallel.py#L134-L136: "the product of the tensor, prefill-context, and data parallel sizes"; fc07 P3 corrected section 14 the same way | "TP x PCP (prefill context parallelism) x DP (data parallelism)" |
| D5 | "SGLang registers [weight sync] on every server behind an optional key" | :472-473 | OVERREACH | Rust frontend mounts no admin route (`rust/sglang-server/src/api_server/http/app.rs#L77-L92`); fc01 T5 narrowed section 1 to every Python HTTP server | "SGLang's Python frontend registers it on every server" |
| D6 | "Ray 2.59.0 installs whatever pip resolves" | :271 | OVERREACH (minor) | https://github.com/ray-project/ray/blob/ray-2.59.0/doc/source/serve/llm/user-guides/sglang.md#L27: the guide's `pip install "ray[llm]" "sglang[all,ray]"`; Ray itself pins no SGLang (fc09) | "Ray 2.59.0's guide installs whatever pip resolves" |
| D7 | Diagram leaf: "HyperPod's native PD runs vLLM only" | :84 | OVERREACH (hedge widened) | https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-dpd.html documents vLLM worker images only; the table row and section 19 say "documented with vLLM worker images only" | Leaf now "documents vLLM only"; harness re-run |

Confirmed highlights: README L58 lists AWS Trainium under integrations in progress and the tag's tree has no Neuron
platform (`srt/platforms/` lists cpu, cuda, mps, musa, npu, rocm, xpu); ROCm images build gfx942 and gfx950
(`.github/workflows/release-docker-amd.yml#L33`); llm-d v1.0.0 pins v0.5.22, Dynamo v1.6.0 0.5.21, KServe v0.21.0
has no SGLang runtime, Bedrock CMI names no engine, HyperPod gateway `engineType: sglang` plus `--enable-metrics`
(fc09); five eviction policies (`arg_groups/fields/memory.py#L25-L42`, lru, lfu, slru, priority, tlru); default
`fcfs` (`schedule.py#L82-L98`); gateway default `cache_aware` (`main.rs#L150`); vLLM 16-token default
(`vllm/config/cache.py#L333-L334`, fc04); XGrammar default (`arg_groups/serving_hook.py#L232-L237`), jump-forward
interface with no caller (fc05), XGrammar pre-check 400 (`constrained/json_schema_validation.py#L167-L201`),
llguidance a choice (`arg_groups/choices.py#L131`), top-level `regex`/`ebnf` (`entrypoints/openai/protocol.py#L1161-L1189`);
vLLM elastic EP on every generate server and dev-mode weight routes (`launchers/api_server/routers.py#L34-L50`);
Ollama `/api/chat` and `/generate` SGLang-only, Cohere vLLM-only (agrees with section 23); PD `early` policy gates
prefill admission (`disaggregation/prefill.py#L462-L537`, Cross-section block, default `optimistic_prefill_attempts`
0 at `arg_groups/fields/disagg.py#L122-L124`); the 48 reset and its four algorithm names, wording identical to
section 11 (`speculative_hook.py#L995-L1003`); 2048 to 4096 otherwise (`kv_cache_configurator.py#L2800-L2851`);
partial-page recompute (`docs/.../attention_backend.mdx#L322`, `radix_cache.py#L147-L151`); HiCache ratio 2.0 in the
default `cache` mode outside PD decode, auto-shrunk under fraction 0.8 (`hicache_hook.py#L81-L107`,
`hicache_auto_size.py#L82-L125`, `memory.py#L99-L117`); `--enable-hierarchical-cache` off (`memory.py#L98`); LPM
falls back to FCFS above 128 waiting (`schedule_policy.py#L133`, `#L300-L311`); prefill log `#new-token` /
`#cached-token` (`metrics_reporter.py#L730-L760`); adaptive speculation's default config drafts zero steps at batch
64 (`speculative/adaptive_spec_params.py#L27-L52`); DLC entrypoint boolean handling (L17-L32); section 23's checklist
covers exactly the seven items listed and ends on benchmarking both engines.

Recommendations against owners: every branch and lever carries the owning section's condition (B200 page condition,
`early`-policy handshake wording, no mesh tree-sharing claim, project figures attributed: LMSYS 96-H100 as a project
claim, DeepGEMM 10 to 20 minutes as a project estimate). No branch recommends beyond its owner.

**Score: 8/10.** The tree and the branch table give a usable shortlist, the 48 cap lands three times, and the page ends
on the first-week order with step 1 as the next action. Held at 8 by the branch table's long, cite-dense cells, which
carry most of the argument the diagram only summarises.

## Harness and checks

Diagram touched: `DecisionTreeDiagram` leaf text only (section 26, D7). `npx vite build --outDir /tmp/sglang-dist-fc13`
then `shoot.mjs --port 4483 --sections ops,decision`: `decision @1440: 1 SVG diagram(s), 0 React Flow, ok`,
`decision @390: 1 SVG diagram(s), 0 React Flow, ok`, `ops` 0 diagrams, ok at both widths. Both PNGs read: the new
"documents vLLM only" line sits inside its box with no overlap or clipping; at 390 the tree scrolls horizontally
inside its container, as authored (minWidth 680).

- `pnpm --filter @tech-deep-dives/sglang typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/sglang lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output.
- `scripts/gates/no-ai-tells.sh`: PASS. `scripts/gates/pinned-refs.sh`: PASS. `scripts/gates/svg-a11y.sh`: PASS.

## For the orchestrator (files fc13 does not own)

- Build log "decisions for Carlos", top item: GitHub private vulnerability reporting is enabled on
  `sgl-project/sglang` (`gh api repos/sgl-project/sglang/private-vulnerability-reporting` returns `enabled: true`; the
  security page shows "Report a vulnerability"), so the suggested private advisory route exists even without a
  SECURITY.md.
- Glossary: section 25 now names the CERT Coordination Center and VulDB (spelled out, no acronym); section 26 adds
  PCP (prefill context parallelism).
- SGLang's own `docker/serve` (L9-L16) passes `SM_SGLANG_ENABLE_METRICS=true` as `--enable-metrics true`, which a
  store-true flag would likely reject (our reading, not run); the DLC entrypoint handles booleans. Sections 19 and 25
  cite the DLC behaviour; worth a check if any section tells readers to use the upstream image with that variable.
