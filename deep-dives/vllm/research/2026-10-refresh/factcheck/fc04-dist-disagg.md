# fc04-dist-disagg: adversarial fact-check

Group: DistributedInference.tsx, DisaggregatedServing.tsx (section ids distributed, disagg).
Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read from `/tmp/vllm-new`
on 2026-10-17. `G/` below means `https://github.com/vllm-project/vllm/blob/v0.31.0/`. Line
numbers in the "file:line" column are for the file before the fixes in this pass.

No diagram SVG was changed in this pass. The edits are in table cells and prose, so the harness
was not run.

## DistributedInference.tsx

Claims checked: 80. CONFIRMED: 77. Non-CONFIRMED rows below.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| DI-1 | PP "introduces pipeline bubbles", "so the docs flag latency penalties" (axis table and TP vs PP prose) | :46, :569-571 | OVERREACH | vLLM keeps PP-size batches in flight "to fill the pipeline" `G/vllm/config/vllm.py#L592-L602`. The docs say only that raising PP "may cause latency penalties" `G/docs/configuration/optimization.md#L43` and give no bubble cause | Table: "Low volume, paid for in latency." Prose: "raising it "may cause latency penalties"", plus one sentence that vLLM keeps a batch in flight for every stage, citing vllm.py L592-L602 |
| DI-2 | EP "Where it lives": "the all-to-all is the dominant cost at scale" | :61 | UNSUPPORTED | No source says dominant. The DBO design doc's motivation is to overlap the all-to-all with compute `G/docs/design/dbo.md#L5` | "at scale the all-to-all is the cost dual-batch overlap exists to hide" |
| DI-3 | "Two names in the type are gone: naive and pplx" | :765 | prose (history voice) | Code warns "has been removed. Falling back" `G/vllm/config/parallel.py#L507-L513` | "Two names in the type map to the default: naive and pplx log a removal warning and run allgather_reducescatter" |

Hard checks requested by the orchestrator, all CONFIRMED against code:

- **Executor default.** With the flag unset and world size above 1, the code picks `mp`. On
  CUDA with `--nnodes` > 1 it is `mp` before any Ray check. A world larger than the local GPU
  count without `--nnodes` raises an error that names both fixes. `ray` is chosen only for
  `--data-parallel-backend ray`, a passed placement group, or an active Ray placement group.
  `uni` covers world size 1 `G/vllm/config/parallel.py#L989-L1034`. The guide's "Ray for
  multi-node" sentence is at `G/docs/serving/parallelism_scaling.md#L33`, so the doc-code
  conflict alert stands. This matches the cross-file fact.

Confirmed highlights: every flag and short alias (`G/vllm/engine/arg_utils.py#L1108-L1260`).
Both CP defaults and the DCP/PCP constraints (`parallel.py#L131`, `#L359`, `#L564-L577`,
`#L899-L903`). The PCP V1-runner block (`vllm.py#L3108-L3110`). SP and DBO runner fallbacks
(`vllm.py#L718-L759`, `#L3059-L3063`, `#L3094-L3095`, `#L3235-L3246`). The FlashInfer-first
all-reduce chain (`envs.py#L1914-L1917`, `cuda_communicator.py#L335-L408`; NCCL symm-mem is off
by default, `envs.py#L2040`). The rank grid order (`parallel_state.py#L2045-L2060`). All four
DP modes, the API-server defaults and the dense-model rejection (`cli/serve.py#L77-L127`,
`arg_utils.py#L2341-L2420`). The multi-port supervisor and port 9256
(`dp_supervisor.py#L52-L134`, `launchers/cli_args.py#L284-L286`). The fault-tolerance gates and
the 120 s timeout. The 503 (`config/scheduler.py#L93-L109`). Every guide quote, verbatim, in
`parallelism_scaling.md`, `optimization.md#L42-L43,L110-L111`, `data_parallel_deployment.md#L7-L29`,
`expert_parallel_deployment.md#L5-L30,L138,L189,L211` and `context_parallel_deployment.md`. The
v0.27.0 (#44428) and v0.31.0 (#57075) release-note items. Section 15's title, and the EPLB and
elastic-EP cross-reference into the Distributed & KV Transfer tab.

**Section Shape.** Pre-revamp 579 lines, now about 1085. Every block passes at least one test,
so nothing was demoted. The axis table, the hardware layout diagram, TP vs PP, and the DCP
duplication argument build the mental model. The all-reduce backend line, the sequence-parallel
runner fallback, the DP mode table, the per-rank versus per-server limits, fault tolerance, the
executor default with its doc conflict, and the decision table are practical. The backend
catalogue and DBO already sit in an ExpandableSection, and so does the worked launch. The payoff
lands last (decision table, then the worked launch), and each h2 description names the reader's
moment. No duplicated EFA transport explanation: the page cross-links the EFA and Silicon dives.

Score: **9/10**. Every number and default traces to a pinned line or a versioned doc. Holds at 9
because the two-column TP vs PP block is dense for a mobile reader, and the TP "twice per
transformer block" all-reduce count rests on the Megatron design the guide names rather than a
vLLM line.

## DisaggregatedServing.tsx

Claims checked: 68. CONFIRMED: 61. Non-CONFIRMED rows below.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| DS-1 | "The matrix and the code agree, so plan for equal block sizes on P and D for a hybrid model"; compat row "Hybrid models need identical block sizes" | :95, :903-910 | WRONG (doc-code conflict missed) | Matrix footnote 6: HMA does not support different remote block sizes `G/docs/features/nixl_connector_compatibility.md#L72`. Code: pull computes a block-size ratio and maps it `G/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_worker.py#L424-L436`. The mapper splits attention blocks and passes Mamba state blocks 1:1 `.../nixl/base_worker.py#L3266-L3303`. Handshake limits are at `#L2527-L2548`, and the pinned tree tests the hybrid ratio path `G/tests/v1/kv_connector/unit/test_nixl_connector_hma.py#L1353-L1415`. Only push raises, "Attention-HMA push requires identical P/D block sizes" `base_worker.py#L2264-L2268`. The divisibility assert is at `G/vllm/distributed/kv_transfer/kv_connector/utils.py#L504-L510` | Row rewritten: P block smaller than D's and dividing it. The matrix limits this to non-HMA models, the pull code also maps hybrid blocks at the ratio, and push raises for hybrid attention. Added cites utils.py L504-L510 and base_worker L3266-L3303, and marked the matrix cite doc-code-conflict. Paragraph rewritten as the matrix vs release-notes conflict, with the code siding with the release notes on pull and push requiring equal sizes |
| DS-2 | Compat TP row: "MLA reads a single rank" | :86 | OVERREACH | Single read only "When P TP > D TP" `nixl_connector_compatibility.md#L68` | "MLA KV is replicated across TP workers, so there is no head split, and with P TP > D TP only a single read runs" |
| DS-3 | "These are the connectors for the cross-instance path at v0.31.0" (table is a subset) | :628 | OVERREACH | The docs list 9 connector types `G/docs/features/disagg_prefill.md#L20-L50`. The factory also registers LMCacheMPConnector, MooncakeStoreConnector, ExampleConnector and others `G/vllm/distributed/kv_transfer/kv_connector/factory.py#L153-L248` | "These are the main connectors..." |
| DS-4 | Operational notes: on a fast fabric "that tax is small relative to the prefill it isolates" | :983-985 | UNSUPPORTED | No measurement or source located for this research | "the tax can stay small next to the prefill it isolates" |
| DS-5 | Transport explained again in the "On AWS" alert (UCX default, LIBFABRIC must be selected) and in the operational-notes parenthetical (EFA through LIBFABRIC, NVLink-class links) | :819-821, :983-984 | scope (duplicated transport) | The Transport paragraph two blocks above already carries default UCX and `backends` selection with cites. The EFA data path is section 22 (`AwsGpuEfaNixl.tsx` cites it), and the fabric is the EFA dive | The alert now opens with the cross-link: "The EFA data path (GPUs, EFA and the NIXL LIBFABRIC plugin) is section 22...". The parenthetical became "(section 22 covers EFA on AWS)" |
| DS-6 | "LBHNC (head-major, formerly HND)", "LBNHC (token-major, formerly NHD)" | :109 | prose (history voice) | `VLLM_KV_CACHE_LAYOUT` accepts HND and NHD alongside LBHNC and LBNHC `G/vllm/envs.py#L1833-L1837` | "the HND layout", "the NHD layout" |
| DS-7 | "can no longer reach", "is no longer a prefix", "can no longer hold" | :492, :852, :1068 | prose (history-voice phrase) | n/a | "cannot reach", "stops being a prefix", "cannot hold" |

Hard checks requested by the orchestrator, all CONFIRMED against code:

- **NIXL pull default, push alternative.** `NixlConnector = NixlPullConnector`, under a
  "Backward compatibility" comment. The push class is a separate WRITE connector
  `G/vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py#L339-L408`. The push design
  doc says "The default NIXL connector is pull-based" `G/docs/design/nixl_kv_push_connector.md#L3-L7`.
  The factory registers all three names `factory.py#L177-L193`. Push rejects DCP > 1
  (`connector.py#L377-L380`) and bidirectional transfer (`push_scheduler.py#L72-L75`). The
  transfer mode is hashed at handshake (`metadata.py#L142-L199`). Push shipped in v0.24.0 (#35264).
- **`kv_both` deprecation.** The warning sits in `NixlBaseConnector.__init__`, so it covers pull
  and push alike `connector.py#L77`, `#L94-L100`. The usage guide marks it deprecated
  `nixl_connector_usage.md#L380-L388`. The type still allows it for other connectors
  `config/kv_transfer.py#L11-L13`. The disagg page example uses it `disagg_prefill.md#L27`.
- **P2pNcclConnector removal.** Not registered in `factory.py`. No string match anywhere under
  `vllm/` or `docs/`. Removed in v0.24.0 (#44854) per `/tmp/vllm-release-notes/v0.24.0.md#L36`.
  Neither file names it.

Confirmed highlights: the pull flow, verified line by line. That covers the toy proxy with
`max_tokens=1` and the forwarded `kv_transfer_params` (`toy_proxy_server.py#L157-L231`), the
NIXL registration at startup (`base_worker.py#L1812-L1824`), the remote-agent import
(`#L1141-L1149`) and the READ (`pull_worker.py#L552-L562`). The push flow, also line by line:
notif-only D handshake (`push_worker.py#L320-L338`), WRITE (`#L714-L722`), proxy coordinates
(`disagg_proxy_pushconnector_demo.py#L3-L14`, `#L227-L235`) and the completion then free
sequence (`nixl_kv_push_connector.md#L52-L64`). The default `["UCX"]` (`base_worker.py#L560-L562`).
The PP rejections (`base_worker.py#L786-L806`). The Mooncake bootstrap port 8998 on prefillers.
The MoRIIO and Mooncake library imports. The three EC connectors (`ec_connector/factory.py#L81-L97`).
`kv_role` required (`config/kv_transfer.py#L135-L139`). `kv_load_failure_policy` default
`"fail"` (`#L103-L106`). Every usage-guide quote and number: 64 tokens, 480 s not renewed,
CUDA device buffer only, and the reasoning-trace warning (`nixl_connector_usage.md#L135-L323`).
The v0.27.0 quote (#49612). Cross-references to sections 7, 22 and 23 resolve.

**Section Shape.** Pre-revamp 540 lines, now about 1105. Every block passes at least one test,
so nothing was demoted. The intro, the data path diagram, the phase table and the pull/push
sequence diagram build the mental model. The connector table, mode rules, roles, transport, the
compatibility table, the hybrid block-size conflict, the failure policy and the decision table
are practical. The E/P/D paragraph extends the same model one stage earlier and names the flag.
Bidirectional transfer and the operational notes already sit in ExpandableSections. The payoff
lands last ("Where to start"). Scope: the duplicated transport text (DS-5) was replaced with
cross-links. No EFA fabric mechanism (SRD, libfabric internals) is explained on this page.

Score: **8/10**. Accuracy and citation coverage are now high. It holds at 8 for two reasons. The
phase table's "How you tune it" cells ("keep batches latency-tight") are uncited guidance. The
page carries the same TTFT/ITL contrast three times (intro, diagram and phase table), which
makes it long for what it argues.

## Items for the orchestrator (files not owned by fc04)

- `App.tsx` nav title for section 23 reads "23. EC2 Topology & Placement Groups", while the
  section's own h1 (`Ec2TopologyPlacement.tsx:311`) reads "23. EC2 Topology, Placement Groups
  & KV Locality". DisaggregatedServing cross-references the h1 wording.

## Checks

```
pnpm --filter @tech-deep-dives/vllm typecheck   -> tsc --noEmit, exit 0
pnpm --filter @tech-deep-dives/vllm lint        -> eslint src --ext .ts,.tsx --max-warnings 0, exit 0
scripts/gates/no-ai-tells.sh                    -> [PASS] no AI tells in 2 opted-in deep dive(s)
scripts/gates/pinned-refs.sh                    -> [PASS] all GitHub references pinned
```
