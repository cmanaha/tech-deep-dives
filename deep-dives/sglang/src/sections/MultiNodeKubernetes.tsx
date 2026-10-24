import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Pinned sources                                                           */
/* ------------------------------------------------------------------------ */

const SRT = 'python/sglang/srt';
const PAR_FIELDS = `${SRT}/arg_groups/fields/parallel.py`;
const SERVING_FIELDS = `${SRT}/arg_groups/fields/serving.py`;
const OBS_FIELDS = `${SRT}/arg_groups/fields/observability.py`;
const DISAGG_FIELDS = `${SRT}/arg_groups/fields/disagg.py`;
const PAR_HOOK = `${SRT}/arg_groups/parallel_hook.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const COMMON = `${SRT}/utils/common.py`;
const TOKENIZER_MGR = `${SRT}/managers/tokenizer_manager.py`;
const DISAGG_SVC = `${SRT}/managers/disagg_service.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const KV_PUB = `${SRT}/managers/scheduler_components/kv_events_publisher.py`;
const KV_EVENTS = `${SRT}/disaggregation/kv_events.py`;
const CONN = `${SRT}/disaggregation/common/conn.py`;
const MEM_EVENTS = `${SRT}/mem_cache/events.py`;
const RAY_ENGINE = `${SRT}/ray/engine.py`;
const LAUNCH_SERVER = 'python/sglang/launch_server.py';

const GW = 'sgl-model-gateway/src';
const GW_PY = 'sgl-model-gateway/bindings/python/src';
const XR = 'experimental/sgl-router';

const DEPLOY_K8S = 'references/multi_node_deployment/deploy_on_k8s';
const MULTI_NODE = 'references/multi_node_deployment/multi_node';
const LWS_PD = 'references/multi_node_deployment/lws_pd/lws_pd_deploy';
const RBG_PD = 'references/multi_node_deployment/rbg_pd/deepseekv32_pd';
const GW_DOC = 'advanced_features/sgl_model_gateway';
const SGLANG_RELEASE = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';

const LLMD = 'https://github.com/llm-d/llm-d/blob/v1.0.0';
const LLMD_SGLANG_DOC = `${LLMD}/docs/architecture/model-servers/sglang.md`;
const LLMD_AWS = `${LLMD}/guides/pd-disaggregation/modelserver/gpu/sglang/aws`;
const LLMD_PD_BASE = `${LLMD}/guides/pd-disaggregation/modelserver/gpu/sglang/base/disaggregatedset.yaml`;
const LLMD_RELEASE = 'https://github.com/llm-d/llm-d/releases/tag/v1.0.0';
const DYNAMO = 'https://github.com/ai-dynamo/dynamo/blob/v1.6.0';
const DYNAMO_RELEASE = 'https://github.com/ai-dynamo/dynamo/releases/tag/v1.6.0';
const RAY = 'https://github.com/ray-project/ray/blob/ray-2.59.0';
const RAY_SGLANG_DOC = `${RAY}/doc/source/serve/llm/user-guides/sglang.md`;
const RAY_RELEASE = 'https://github.com/ray-project/ray/releases/tag/ray-2.59.0';
const KSERVE_TREE = 'https://github.com/kserve/kserve/tree/v0.21.0';
const KSERVE_RELEASE = 'https://github.com/kserve/kserve/releases/tag/v0.21.0';
const KSERVE_RUNTIME =
  'https://github.com/kserve/kserve/blob/14c1bff3fbeddfd057aef85bb9e3649b764d0429/config/runtimes/kserve-llm-sglang.yaml';
const RBG = 'https://github.com/sgl-project/rbg/blob/v0.8.0';
const RBG_RELEASE = 'https://github.com/sgl-project/rbg/releases/tag/v0.8.0';

const LWS_FLAGS = `# leaderTemplate and workerTemplate pass the same flags
- --tp
- "16"
- --dist-init-addr
- $(LWS_LEADER_ADDRESS):20000
- --nnodes
- $(LWS_GROUP_SIZE)
- --node-rank
- $(LWS_WORKER_INDEX)`;

/* ------------------------------------------------------------------------ */
/* Diagram: PD on Kubernetes, gateway plus two LeaderWorkerSet groups       */
/* ------------------------------------------------------------------------ */

function DeploymentTopologyDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 520"
        role="img"
        aria-labelledby="multinode-topo-title"
        aria-describedby="multinode-topo-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="multinode-topo-title">
          A PD (prefill/decode) deployment of SGLang v0.5.22 on Kubernetes: the SGLang gateway sends
          each request to a prefill pool and a decode pool at once, each pool is one LeaderWorkerSet
          group of two 8-GPU nodes, and only the leader pod on node 0 of each group serves HTTP.
        </title>
        <desc id="multinode-topo-desc">
          The gateway runs as a Deployment, or as the router role of an optional RoleBasedGroup
          that holds all three roles and starts the router last. Step 1: it sends a prefill leg
          and a decode leg together, both carrying one bootstrap room id, to the leader pods, which
          run the tokenizer and HTTP server on port 30000. Step 2: decode looks up the prefill ranks
          at the bootstrap registry on port 8998, which runs on the prefill leader, and sends the
          addresses of the KV pages it reserved. Step 3: the prefill ranks on both nodes write KV
          into those pages over RDMA. Step 4: decode streams tokens back through the gateway. Worker
          pods on node 1 run schedulers only and serve a stub whose health check always answers
          200. The gateway exposes its own metrics on port 29000.
        </desc>
        <style>{`
          .multinode-topo-t { fill: #16191f; font: 600 13px sans-serif; }
          .multinode-topo-s { fill: #5f6b7a; font: 11px sans-serif; }
          .multinode-topo-g { fill: #6f4cc4; font: 600 12px sans-serif; }
          .multinode-topo-r { fill: #414d5c; font: 600 11px sans-serif; }
          .multinode-topo-eb { fill: #0972d3; font: 600 11px sans-serif; }
          .multinode-topo-eg { fill: #037f0c; font: 600 11px sans-serif; }
          .multinode-topo-es { fill: #414d5c; font: 600 11px sans-serif; }
          .multinode-topo-pool { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; stroke-dasharray: 5 3; }
          .multinode-topo-lead { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .multinode-topo-work { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .multinode-topo-gw { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .multinode-topo-leg { stroke: #0972d3; stroke-width: 1.6; fill: none; marker-end: url(#multinode-topo-ah-blue); }
          .multinode-topo-boot { stroke: #0972d3; stroke-width: 1.6; stroke-dasharray: 6 4; fill: none; marker-end: url(#multinode-topo-ah-blue); }
          .multinode-topo-kv { stroke: #037f0c; stroke-width: 3; fill: none; marker-end: url(#multinode-topo-ah-green); }
          .multinode-topo-str { stroke: #5f6b7a; stroke-width: 1.6; fill: none; marker-end: url(#multinode-topo-ah-grey); }
        `}</style>
        <defs>
          <marker
            id="multinode-topo-ah-blue"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#0972d3" />
          </marker>
          <marker
            id="multinode-topo-ah-green"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#037f0c" />
          </marker>
          <marker
            id="multinode-topo-ah-grey"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={520} rx={8} fill="#ffffff" />

        {/* Optional RoleBasedGroup wrapper around the router and both pools */}
        <rect
          x={124}
          y={10}
          width={768}
          height={500}
          rx={10}
          fill="none"
          stroke="#414d5c"
          strokeWidth={1.2}
          strokeDasharray="6 4"
        />
        <text x={138} y={30} className="multinode-topo-r">
          RoleBasedGroup (optional): one object for router, prefill and decode; the router starts last
        </text>

        {/* Client */}
        <rect x={12} y={230} width={96} height={64} rx={6} className="multinode-topo-work" />
        <text x={60} y={254} textAnchor="middle" className="multinode-topo-t">
          Client
        </text>
        <text x={60} y={272} textAnchor="middle" className="multinode-topo-s">
          request out
        </text>
        <text x={60} y={287} textAnchor="middle" className="multinode-topo-s">
          stream in
        </text>
        <line x1={108} y1={248} x2={158} y2={248} className="multinode-topo-leg" />
        <line x1={160} y1={276} x2={110} y2={276} className="multinode-topo-str" />

        {/* Gateway */}
        <rect x={160} y={200} width={190} height={118} rx={8} className="multinode-topo-gw" />
        <text x={255} y={224} textAnchor="middle" className="multinode-topo-t">
          SGLang gateway
        </text>
        <text x={255} y={244} textAnchor="middle" className="multinode-topo-s">
          Deployment or RBG role
        </text>
        <text x={255} y={261} textAnchor="middle" className="multinode-topo-s">
          sends both legs at once
        </text>
        <text x={255} y={278} textAnchor="middle" className="multinode-topo-s">
          with one bootstrap_room
        </text>
        <text x={255} y={295} textAnchor="middle" className="multinode-topo-s">
          metrics :29000
        </text>

        {/* Prefill pool */}
        <rect x={400} y={44} width={482} height={154} rx={8} className="multinode-topo-pool" />
        <text x={412} y={64} className="multinode-topo-g">
          Prefill pool: one LWS group of size 2, TP 16 over both nodes
        </text>
        <rect x={412} y={76} width={220} height={110} rx={6} className="multinode-topo-lead" />
        <text x={424} y={98} className="multinode-topo-t">
          node 0: leader pod
        </text>
        <text x={424} y={117} className="multinode-topo-s">
          Service and gateway target
        </text>
        <text x={424} y={134} className="multinode-topo-s">
          HTTP :30000 and tokenizer
        </text>
        <text x={424} y={151} className="multinode-topo-s">
          bootstrap registry :8998
        </text>
        <text x={424} y={168} className="multinode-topo-s">
          TP ranks 0-7, 8 GPUs
        </text>
        <rect x={652} y={76} width={218} height={110} rx={6} className="multinode-topo-work" />
        <text x={664} y={98} className="multinode-topo-t">
          node 1: worker pod
        </text>
        <text x={664} y={117} className="multinode-topo-s">
          schedulers only, no tokenizer
        </text>
        <text x={664} y={134} className="multinode-topo-s">
          stub app on :30000
        </text>
        <text x={664} y={151} className="multinode-topo-s">
          /health always answers 200
        </text>
        <text x={664} y={168} className="multinode-topo-s">
          TP ranks 8-15, 8 GPUs
        </text>

        {/* Decode pool */}
        <rect x={400} y={326} width={482} height={160} rx={8} className="multinode-topo-pool" />
        <rect x={412} y={338} width={220} height={110} rx={6} className="multinode-topo-lead" />
        <text x={424} y={360} className="multinode-topo-t">
          node 0: leader pod
        </text>
        <text x={424} y={379} className="multinode-topo-s">
          Service and gateway target
        </text>
        <text x={424} y={396} className="multinode-topo-s">
          HTTP :30000 and tokenizer
        </text>
        <text x={424} y={413} className="multinode-topo-s">
          reserves pages, streams tokens
        </text>
        <text x={424} y={430} className="multinode-topo-s">
          TP ranks 0-7, 8 GPUs
        </text>
        <rect x={652} y={338} width={218} height={110} rx={6} className="multinode-topo-work" />
        <text x={664} y={360} className="multinode-topo-t">
          node 1: worker pod
        </text>
        <text x={664} y={379} className="multinode-topo-s">
          schedulers only, no tokenizer
        </text>
        <text x={664} y={396} className="multinode-topo-s">
          stub app on :30000
        </text>
        <text x={664} y={413} className="multinode-topo-s">
          /health always answers 200
        </text>
        <text x={664} y={430} className="multinode-topo-s">
          TP ranks 8-15, 8 GPUs
        </text>
        <text x={412} y={472} className="multinode-topo-g">
          Decode pool: one LWS group of size 2, TP 16 over both nodes
        </text>

        {/* Step 1: both legs, sent together */}
        <path d="M 260 200 V 130 H 410" className="multinode-topo-leg" />
        <text x={270} y={122} className="multinode-topo-eb">
          1. prefill leg
        </text>
        <path d="M 260 318 V 393 H 410" className="multinode-topo-leg" />
        <text x={270} y={385} className="multinode-topo-eb">
          1. decode leg
        </text>

        {/* Step 2: decode looks up prefill ranks at the bootstrap registry */}
        <line x1={444} y1={338} x2={444} y2={188} className="multinode-topo-boot" />
        <text x={454} y={250} className="multinode-topo-eb">
          2. look up ranks (:8998),
        </text>
        <text x={454} y={266} className="multinode-topo-eb">
          send page addresses
        </text>

        {/* Step 3: KV push from every prefill rank */}
        <line x1={620} y1={186} x2={620} y2={336} className="multinode-topo-kv" />
        <line x1={680} y1={186} x2={680} y2={336} className="multinode-topo-kv" />
        <text x={692} y={244} className="multinode-topo-eg">
          3. KV push: prefill ranks
        </text>
        <text x={692} y={260} className="multinode-topo-eg">
          write into decode pages
        </text>
        <text x={692} y={276} className="multinode-topo-eg">
          over RDMA
        </text>

        {/* Step 4: token stream back through the gateway */}
        <path d="M 412 430 H 200 V 320" className="multinode-topo-str" />
        <text x={212} y={446} className="multinode-topo-es">
          4. token stream
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

interface SignalRow {
  who: ReactNode;
  signal: ReactNode;
  turnOn: ReactNode;
}

const signalRows: SignalRow[] = [
  {
    who: 'SGLang gateway, documented LWS PD (prefill/decode) recipe',
    signal: (
      <>
        Approximate tree (default <code>cache_aware</code>)
      </>
    ),
    turnOn: (
      <>
        Nothing on the gateway; remove the recipe&apos;s <code>--disable-radix-cache</code> on
        prefill to get prefix reuse{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(LWS_PD, 'L68')}>
          lws_pd_deploy.mdx L68
        </Cite>
      </>
    ),
  },
  {
    who: 'SGLang gateway, documented RBG recipe',
    signal: (
      <>
        None as written: the router runs <code>--policy random</code>
      </>
    ),
    turnOn: (
      <>
        Drop <code>--policy random</code> for the default <code>cache_aware</code>, and remove{' '}
        <code>--disable-radix-cache</code> on prefill{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L479-L502')}>
          deepseekv32_pd.mdx L479-L502
        </Cite>{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L61')}>
          L61
        </Cite>
      </>
    ),
  },
  {
    who: 'llm-d v1.0.0',
    signal: (
      <>
        Remembered prompt blocks in its approximate mode, KV events in its precise mode; load from
        SGLang&apos;s Prometheus gauges{' '}
        <Cite tier={1} href={`${LLMD}/docs/architecture/kv-management/prefix-cache-aware-routing.md#L10-L50`}>
          llm-d prefix-cache-aware-routing.md L10-L50
        </Cite>
      </>
    ),
    turnOn: (
      <>
        <code>--enable-metrics</code>, the pod label <code>llm-d.ai/engine-type: sglang</code>, and{' '}
        <code>--kv-events-config</code>{' '}
        <Cite tier={1} href={`${LLMD_SGLANG_DOC}#L7-L36`}>
          llm-d sglang.md L7-L36
        </Cite>
      </>
    ),
  },
  {
    who: 'NVIDIA Dynamo v1.6.0',
    signal: "KV events, read by Dynamo's router, which replaces the SGLang gateway",
    turnOn: (
      <>
        <code>--kv-events-config</code> with a <code>zmq</code> publisher on each worker,{' '}
        <code>DYN_ROUTER_MODE=kv</code> on the frontend{' '}
        <Cite tier={1} href={`${DYNAMO}/examples/backends/sglang/deploy/agg_router.yaml#L14-L36`}>
          Dynamo agg_router.yaml L14-L36
        </Cite>
      </>
    ),
  },
  {
    who: 'Ray Serve LLM, Ray 2.59.0',
    signal: 'Not established by this research for SGLang replicas',
    turnOn: 'See the Ray Serve LLM block below',
  },
  {
    who: 'KServe v0.21.0',
    signal: 'No SGLang runtime in the release',
    turnOn: 'Not applicable',
  },
  {
    who: (
      <>
        Experimental <code>sgl-router</code> (SGLang repository)
      </>
    ),
    signal: 'KV events',
    turnOn: (
      <>
        Build from source; pass <code>--policy cache_aware</code>, since the default is{' '}
        <code>round_robin</code>{' '}
        <Cite tier={1} href={sglangUrl(`${XR}/src/config/cli.rs`, 'L224-L240')}>
          cli.rs L224-L240
        </Cite>
      </>
    ),
  },
];

interface VersionRow {
  who: ReactNode;
  released: ReactNode;
  installs: ReactNode;
  source: ReactNode;
}

const versionRows: VersionRow[] = [
  {
    who: 'llm-d v1.0.0, released 2026-10-20',
    released: (
      <Cite tier={1} href={LLMD_RELEASE}>
        release page
      </Cite>
    ),
    installs: (
      <>
        <code>lmsysorg/sglang:v0.5.22</code>; the AWS PD overlay uses the AWS DLC (Deep Learning
        Container){' '}
        <code>sglang:0.5.20-gpu-py312-cu130-ubuntu24.04-ec2</code>
      </>
    ),
    source: (
      <>
        <Cite
          tier={1}
          href={`${LLMD}/guides/recipes/modelserver/components/images/gpu-sglang/release/kustomization.yaml#L4-L6`}
        >
          gpu-sglang release L4-L6
        </Cite>{' '}
        <Cite tier={1} href={`${LLMD_AWS}/kustomization.yaml#L6-L11`}>
          aws kustomization.yaml L6-L11
        </Cite>
      </>
    ),
  },
  {
    who: 'NVIDIA Dynamo v1.6.0, released 2026-10-22',
    released: (
      <Cite tier={1} href={DYNAMO_RELEASE}>
        release page
      </Cite>
    ),
    installs: (
      <>
        <code>sglang[diffusion]==0.5.21</code>; runtime image{' '}
        <code>lmsysorg/sglang:v0.5.21-cu130-runtime</code>
      </>
    ),
    source: (
      <>
        <Cite tier={1} href={`${DYNAMO}/pyproject.toml#L76-L78`}>
          pyproject.toml L76-L78
        </Cite>{' '}
        <Cite tier={1} href={`${DYNAMO}/container/context.yaml#L134-L139`}>
          context.yaml L134-L139
        </Cite>
      </>
    ),
  },
  {
    who: 'RBG v0.8.0, released 2026-08-31',
    released: (
      <Cite tier={1} href={RBG_RELEASE}>
        release page
      </Cite>
    ),
    installs: (
      <>
        Its PD example names <code>lmsysorg/sglang:v0.5.9-cu124</code> &quot;(or later)&quot; and
        the router image <code>lmsysorg/sglang-router:v0.2.4</code>
      </>
    ),
    source: (
      <Cite tier={1} href={`${RBG}/examples/inference/pd-disagg-leader-worker.yaml#L23-L49`}>
        pd-disagg-leader-worker.yaml L23-L49
      </Cite>
    ),
  },
  {
    who: 'Ray Serve LLM, Ray 2.59.0, released 2026-10-02',
    released: (
      <Cite tier={1} href={RAY_RELEASE}>
        release page
      </Cite>
    ),
    installs: (
      <>
        No SGLang version: <code>pip install &quot;ray[llm]&quot; &quot;sglang[all,ray]&quot;</code>
      </>
    ),
    source: (
      <Cite tier={1} href={`${RAY_SGLANG_DOC}#L27`}>
        Ray sglang.md L27
      </Cite>
    ),
  },
  {
    who: 'KServe v0.21.0, released 2026-09-25',
    released: (
      <Cite tier={1} href={KSERVE_RELEASE}>
        release page
      </Cite>
    ),
    installs: (
      <>
        No SGLang runtime. One added after the release, on the default branch, pins{' '}
        <code>lmsysorg/sglang:v0.5.14</code>
      </>
    ),
    source: (
      <Cite tier={1} href={`${KSERVE_RUNTIME}#L1-L12`}>
        kserve-llm-sglang.yaml L1-L12 (commit 14c1bff)
      </Cite>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function MultiNodeKubernetes() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick an orchestrator by where its cache signal comes from, then check the SGLang version it installs (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            18. Multi-Node and Kubernetes Orchestrators
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On Kubernetes SGLang runs as LeaderWorkerSet (LWS) groups, the Kubernetes API that starts
            a leader pod and its workers as one unit{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DEPLOY_K8S, 'L76-L125')}>
              SGLang docs: Deploy On Kubernetes L76-L125
            </Cite>
            , or as a RoleBasedGroup (RBG), which holds the router, prefill and decode roles in one
            object{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L26-L40')}>
              SGLang docs: RBG PD deploy L26-L40
            </Cite>
            . Past one node a deployment has two layers: one model instance spread over several
            machines, and a router in front that picks an instance for each request.
          </Box>
          <Box variant="p">
            The challenge is the layer above. llm-d, NVIDIA Dynamo and Ray Serve LLM run SGLang,
            and KServe has an SGLang runtime on its default branch only. They differ on two things
            you can check before installing: where the
            router learns which worker already holds a prompt&apos;s prefix, and which SGLang release
            the manifests pull. The fact to carry through this section:{' '}
            <strong>llm-d is the one orchestrator in the table that installs v0.5.22</strong>, the
            release this dive describes{' '}
            <Cite
              tier={1}
              href={`${LLMD}/guides/recipes/modelserver/components/images/gpu-sglang/release/kustomization.yaml#L4-L6`}
            >
              llm-d v1.0.0 gpu-sglang release L4-L6
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict whether repeated prefixes reach the worker that already holds them, and what each orchestrator needs switched on"
          >
            An orchestrator is chosen by where its cache signal comes from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cache-aware router answers one question per request: which worker holds this
            prompt&apos;s prefix in its KV (key-value) cache. Every router in this section answers it
            one of three ways.
          </Box>
          <Box variant="p">
            <strong>It reads the engine&apos;s KV events.</strong> Started with{' '}
            <code>--kv-events-config</code>, a worker records an event for every page its radix tree
            caches or evicts{' '}
            <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L144-L147')}>
              observability.py L144-L147
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L577-L585')}>
              scheduler.py L577-L585
            </Cite>{' '}
            and publishes them over ZMQ (ZeroMQ){' '}
            <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L388-L450')}>
              kv_events.py L388-L450
            </Cite>
            . A subscriber knows what each worker holds. llm-d&apos;s precise prefix routing,
            Dynamo&apos;s KV router and SGLang&apos;s experimental <code>sgl-router</code> work this
            way.
          </Box>
          <Box variant="p">
            <strong>It remembers where it sent text.</strong> The SGLang gateway keeps an
            approximate tree of the prompt text it has sent to each worker and sends a well-matched
            prompt back to the same worker{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/policies/cache_aware.rs`, 'L405-L470')}>
              cache_aware.rs L405-L470
            </Cite>
            ; section 17, The Model Gateway, gives the thresholds. No KV-event consumer was found in
            its source tree at v0.5.22{' '}
            <Cite tier={1} href={sglangTreeUrl(GW)} kind="code">
              sgl-model-gateway/src (search scoped to this tree)
            </Cite>
            , so its picture is its own request history, blind to evictions inside the worker. The
            documented LWS and RBG recipes put this gateway in front, and llm-d&apos;s approximate
            mode works the same way.
          </Box>
          <Box variant="p">
            <strong>It routes with no cache signal.</strong> Round-robin, random or load-only
            placement. Each worker still reuses its own prefixes, but a repeated prompt lands on the
            worker that holds it only by chance.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">Cache signal by orchestrator, at the releases below</Header>}
            columnDefinitions={[
              { id: 'who', header: 'Router or orchestrator', cell: (r: SignalRow) => r.who },
              { id: 'signal', header: 'Cache signal', cell: (r: SignalRow) => r.signal },
              { id: 'on', header: 'What to turn on', cell: (r: SignalRow) => r.turnOn },
            ]}
            items={signalRows}
          />
          <Box variant="p">
            Both documented recipes also start prefill with <code>--disable-radix-cache</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_PD, 'L68')}>
              lws_pd_deploy.mdx L68
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L61')}>
              deepseekv32_pd.mdx L61
            </Cite>
            , and a decode server runs with the radix cache off by default{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L85-L88')}>
              disagg.py L85-L88
            </Cite>{' '}
            (section 15, PD Disaggregation). As written, neither recipe reuses a prefix whatever the router
            decides, so remove that flag before you judge a cache signal.
          </Box>
          <ExpandableSection headerText="What the KV-event stream carries, and what it costs">
            <SpaceBetween size="s">
              <Box variant="p">
                Publishing needs a named publisher:{' '}
                <code>{`--kv-events-config '{"publisher":"zmq","endpoint":"tcp://*:5557"}'`}</code>.
                The publisher defaults to <code>null</code>, so a config without{' '}
                <code>&quot;publisher&quot;:&quot;zmq&quot;</code> records events and sends nothing{' '}
                <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L684-L732')}>
                  kv_events.py L684-L732
                </Cite>
                . Each DP (data parallelism) rank publishes on the endpoint port plus its rank{' '}
                <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L44-L63')}>
                  kv_events.py L44-L63
                </Cite>
                , so open 5557 + rank from every worker to the router. Adding{' '}
                <code>{`"replay_endpoint":"tcp://*:5558"`}</code> lets a router re-fetch batches it
                missed from the last 10,000{' '}
                <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L684-L732')}>
                  kv_events.py L684-L732
                </Cite>
                .
              </Box>
              <Box variant="p">
                Events are per page. At page size 1, the Hopper default (section 6, KV Memory and the Defaults Your GPU Picks), a
                4,000-token prompt yields 4,000 block hashes, merged into one{' '}
                <code>BlockStored</code> message, so event volume and the router&apos;s index grow
                with tokens divided by page size{' '}
                <Cite tier={1} href={sglangUrl(MEM_EVENTS, 'L161-L217')}>
                  events.py L161-L217
                </Cite>
                . Dynamo&apos;s example SGLang worker runs with <code>--page-size 16</code>{' '}
                <Cite tier={1} href={`${DYNAMO}/examples/backends/sglang/deploy/agg_router.yaml#L30-L31`}>
                  agg_router.yaml L30-L31
                </Cite>
                . The scheduler drains events into one batch per scheduling step, so a
                router&apos;s view trails the engine by about one batch{' '}
                <Cite tier={1} href={sglangUrl(KV_PUB, 'L98-L105')}>
                  kv_events_publisher.py L98-L105
                </Cite>
                . With HiCache (section 7), a demotion arrives as a GPU removal plus a store on the
                host medium, so a router can tell an evicted prefix from one a tier down{' '}
                <Cite tier={1} href={sglangUrl(KV_EVENTS, 'L261-L267')}>
                  kv_events.py L261-L267
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check the release an orchestrator's manifests pull before you copy them, because one of the five tracks v0.5.22"
          >
            Which SGLang each orchestrator installs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">SGLang version by orchestrator release, as of 2026-10-24</Header>}
            columnDefinitions={[
              { id: 'who', header: 'Orchestrator release', cell: (r: VersionRow) => r.who },
              { id: 'inst', header: 'SGLang it installs', cell: (r: VersionRow) => r.installs },
              {
                id: 'src',
                header: 'Source',
                cell: (r: VersionRow) => (
                  <>
                    {r.source} {r.released}
                  </>
                ),
              },
            ]}
            items={versionRows}
          />
          <Box variant="p">
            <strong>llm-d is the one orchestrator in the table that installs v0.5.22.</strong> Its
            AWS PD overlay swaps in the AWS DLC at 0.5.20 because the
            upstream image lacks EFA (Elastic Fabric Adapter) support, and its own comment asks to
            keep that tag in step with the release recipe{' '}
            <Cite tier={1} href={`${LLMD_AWS}/kustomization.yaml#L6-L11`}>
              llm-d aws kustomization.yaml L6-L11
            </Cite>
            . Dynamo v1.6.0 shipped three days after SGLang v0.5.22{' '}
            <Cite tier={1} href={SGLANG_RELEASE}>
              SGLang v0.5.22 release
            </Cite>{' '}
            and trails it by one release. KServe&apos;s default-branch runtime is eight releases
            behind. Section 24, Ecosystem and Production Users, runs the same check for RL
            (reinforcement learning) frameworks and vendor containers.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Launch one instance over several nodes, then point every Service, probe and router at the node that serves HTTP"
          >
            One instance across nodes: same command, HTTP on node 0
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A multi-node instance is the same <code>sglang serve</code> command on every node, with
            the same <code>{'--dist-init-addr <node0-ip>:<port>'}</code> and{' '}
            <code>--nnodes N</code>, and its own <code>--node-rank</code>{' '}
            <Cite tier={1} href={sglangUrl(PAR_FIELDS, 'L32-L44')}>
              parallel.py L32-L44
            </Cite>
            . <code>--tp</code> counts GPUs across all nodes: the documented Llama 3.1 405B launch is{' '}
            <code>--tp 16 --nnodes 2</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(MULTI_NODE, 'L7-L26')}>
              SGLang docs: Multi-Node Deployment L7-L26
            </Cite>
            , 16 GPUs with eight TP (tensor parallelism) ranks on each node{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L2014-L2046')}>
              engine.py L2014-L2046
            </Cite>
            . Section 14, Parallelism, gives the counting rule.
          </Box>
          <Box variant="p">
            Only node 0 runs the tokenizer and the HTTP server. Nodes 1 and up run schedulers only{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1228-L1240')}>
              engine.py L1228-L1240
            </Cite>{' '}
            and serve a stub app on <code>--port</code> whose <code>/health</code> always answers
            200{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L3678-L3702')}>
              common.py L3678-L3702
            </Cite>
            . Routers and Services therefore point at node 0, and a health probe on a worker pod
            says nothing about the model. On a PD prefill server the bootstrap registry starts with
            the tokenizer process{' '}
            <Cite tier={1} href={sglangUrl(TOKENIZER_MGR, 'L786-L792')}>
              tokenizer_manager.py L786-L792
            </Cite>
            , so by our reading of the code it runs on node 0 too.
          </Box>
          <Box variant="p">
            LWS maps onto the three flags one to one. It injects the leader address, the group size
            and the worker index, and the documented manifest passes them straight through;{' '}
            <code>restartPolicy: RecreateGroupOnPodRestart</code> restarts the whole group when any
            pod fails, and the Service selects only the pod labelled <code>role: leader</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DEPLOY_K8S, 'L76-L125')}>
              deploy_on_k8s.mdx L76-L125
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DEPLOY_K8S, 'L208-L220')}>
              L208-L220
            </Cite>
            . <code>LWS_WORKER_INDEX</code> is native from LWS v0.6.0; older versions need the
            Downward API{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DEPLOY_K8S, 'L20')}>
              L20
            </Cite>
            .
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{LWS_FLAGS}</pre>
          <Box variant="p">
            The example runs privileged pods with host networking for RDMA (remote direct memory
            access), and the page lists both among its remaining issues{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(DEPLOY_K8S, 'L333-L336')}>
              deploy_on_k8s.mdx L333-L336
            </Cite>
            . Section 20, SGLang on EKS and EC2, covers Amazon EKS (Elastic Kubernetes Service) with
            the EFA device plugin in place of host networking, a combination this research did not
            test.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Lay out prefill, decode and the gateway so the bootstrap lookup and the KV push reach the pods that hold them"
          >
            PD on Kubernetes: two groups, one gateway, three ports
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DeploymentTopologyDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Both pools use the documented LWS PD layout, TP 16 over two
            8-GPU nodes. Ports 30000, 8998 and 29000 are the v0.5.22 defaults for the worker HTTP
            server, the bootstrap registry and the gateway&apos;s metrics. Steps follow section 15
            under the default <code>early</code> policy: prefill pushes once decode has reserved its
            pages.
          </Box>
          <Box variant="p">
            The documented PD layout is two LeaderWorkerSets, one per role, a Service per role that
            selects the group&apos;s leader on port 30000, and a gateway Deployment given the two
            Service URLs:{' '}
            <code>{'--pd-disaggregation --prefill http://<prefill-svc>:30000 --decode http://<decode-svc>:30000'}</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_PD, 'L646-L727')}>
              lws_pd_deploy.mdx L646-L727
            </Cite>
            . The prefill URL carries no bootstrap port. That works while every server keeps the
            default <code>--disaggregation-bootstrap-port</code> of 8998{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L78-L80')}>
              disagg.py L78-L80
            </Cite>
            , because the gateway then sends a null port and each decode server substitutes its own{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/routers/http/pd_router.rs`, 'L282-L292')}>
              pd_router.rs L282-L292
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2847-L2848')}>
              scheduler.py L2847-L2848
            </Cite>
            . The rendezvous itself is section 15, PD Disaggregation; the gateway&apos;s PD flags and
            per-role policies are section 17, The Model Gateway.
          </Box>
          <Box variant="p">
            The gateway takes the bootstrap host from the prefill URL{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/core/worker_builder.rs`, 'L136')} kind="code">
              worker_builder.rs L136
            </Cite>
            , and decode fetches the prefill ranks from{' '}
            <code>{'http://<bootstrap host>:<port>/route'}</code>{' '}
            <Cite tier={1} href={sglangUrl(CONN, 'L2380-L2390')}>
              conn.py L2380-L2390
            </Cite>
            . With a Service URL that host is the Service, and the documented prefill Service lists
            only port 30000{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(LWS_PD, 'L650-L663')}>
              lws_pd_deploy.mdx L650-L663
            </Cite>
            . Our reading of the code, not run: add port 8998 to the prefill Service, and keep one
            LWS group behind each Service. A Service over several groups shows the gateway one
            worker, and it can route the bootstrap lookup to a different leader than the prefill
            request.
          </Box>
          <Box variant="p">
            RBG wraps the same pieces in one object: prefill and decode roles that run as
            LeaderWorkerSets, and a router role with{' '}
            <code>{'dependencies: [ "decode", "prefill" ]'}</code>, so it starts after both pools{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L26-L40')}>
              deepseekv32_pd.mdx L26-L40
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L479-L502')}>
              L479-L502
            </Cite>
            . Its router finds pods by label instead of fixed URLs:{' '}
            <code>
              --service-discovery --service-discovery-port 30000 --prefill-selector pd_role=prefill
              --decode-selector pd_role=decode
            </code>
            , with <code>pd_role</code> set on the leader template only{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(RBG_PD, 'L41-L45')}>
              L41-L45
            </Cite>
            . The gateway then addresses leader pods by IP, which avoids the Service question above
            and never reaches a worker pod&apos;s stub. The SGLang page uses RBG&apos;s{' '}
            <code>v1alpha1</code> API with LeaderWorkerSet roles, which RBG v0.8.0 marks deprecated
            in favour of <code>v1alpha2</code> for new installations{' '}
            <Cite tier={1} href={`${RBG}/README.md#L83-L102`}>
              RBG README L83-L102
            </Cite>
            ; RBG&apos;s own PD example uses <code>v1alpha2</code> with{' '}
            <code>leaderWorkerPattern</code> roles{' '}
            <Cite tier={1} href={`${RBG}/examples/inference/pd-disagg-leader-worker.yaml#L27-L77`}>
              pd-disagg-leader-worker.yaml L27-L77
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Service discovery.</strong> With <code>--service-discovery</code> the gateway
            watches pods, cluster-wide unless <code>--service-discovery-namespace</code> is set, and
            adds each pod that matches the selector and is Ready and Running as{' '}
            <code>{'http://<pod IP>:<port>'}</code>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/service_discovery.rs`, 'L103-L226')}>
              service_discovery.rs L103-L226
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/service_discovery.rs`, 'L299-L302')}>
              L299-L302
            </Cite>
            . <strong>The port defaults to 80</strong> in both the binary and the Python launcher,
            while <code>sglang serve</code> listens on 30000{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L235-L241')}>
              main.rs L235-L241
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${GW_PY}/sglang_router/router_args.py`, 'L77')}>
              router_args.py L77
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L66')}>
              serving.py L66
            </Cite>
            , so pass <code>--service-discovery-port 30000</code> as the RBG recipe does. A prefill
            pod&apos;s bootstrap port comes from its <code>sglang.ai/bootstrap-port</code>{' '}
            annotation{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/service_discovery.rs`, 'L167-L180')}>
              service_discovery.rs L167-L180
            </Cite>
            , and the gateway&apos;s service account needs get, list and watch on pods{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(GW_DOC, 'L1398-L1419')}>
              SGLang docs: gateway service discovery L1398-L1419
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what each orchestrator replaces in SGLang's own stack, and the flag or label it expects"
          >
            The orchestrators one at a time
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>llm-d.</strong> llm-d v1.0.0 deploys <code>lmsysorg/sglang:v0.5.22</code>.
            Routing is done by the Gateway API Inference Extension EPP (endpoint picker), which
            scrapes <code>sglang:num_queue_reqs</code>, <code>sglang:num_running_reqs</code> and{' '}
            <code>sglang:token_usage</code> from each worker{' '}
            <Cite tier={1} href={`${LLMD_SGLANG_DOC}#L20-L28`}>
              llm-d sglang.md L20-L28
            </Cite>
            . SGLang serves those gauges only with <code>--enable-metrics</code>, which is off by
            default{' '}
            <Cite tier={1} href={sglangUrl(OBS_FIELDS, 'L70')}>
              observability.py L70
            </Cite>
            . Label the pods <code>llm-d.ai/engine-type: sglang</code>, or the EPP looks for vLLM
            metric names{' '}
            <Cite tier={1} href={`${LLMD_SGLANG_DOC}#L7-L16`}>
              L7-L16
            </Cite>
            . Its prefix scoring has two modes: an approximate one that remembers which prompt
            blocks (64 tokens by default, estimated from characters) went to which pod, and a precise
            one built from the engines&apos;
            KV events{' '}
            <Cite tier={1} href={`${LLMD}/docs/architecture/kv-management/prefix-cache-aware-routing.md#L10-L50`}>
              prefix-cache-aware-routing.md L10-L50
            </Cite>
            . Its SGLang PD guide runs <code>--page-size=64</code> to match those blocks{' '}
            <Cite tier={1} href={`${LLMD_PD_BASE}#L50-L55`}>
              base disaggregatedset.yaml L50-L55
            </Cite>
            . For PD, llm-d&apos;s routing sidecar (<code>--kv-connector=sglang</code>) does the
            gateway&apos;s job of generating the room id and stamping the bootstrap fields on both
            legs, and because an SGLang decode server cannot prefill locally, llm-d routes SGLang
            with its <code>always-disagg-pd-decider</code>{' '}
            <Cite tier={1} href={`${LLMD_SGLANG_DOC}#L49-L55`}>
              L49-L55
            </Cite>
            . Its PD guide moves KV with NIXL (NVIDIA Inference Xfer Library){' '}
            <Cite tier={1} href={`${LLMD_PD_BASE}#L51`}>
              L51
            </Cite>
            , and its AWS overlay requests 8 EFA devices per pod on p5en and sets NIXL&apos;s
            libfabric backend{' '}
            <Cite tier={1} href={`${LLMD_AWS}/kustomization.yaml#L19-L56`}>
              aws kustomization.yaml L19-L56
            </Cite>{' '}
            <Cite tier={1} href={`${LLMD_AWS}/patch-prefill.yaml#L40-L42`}>
              patch-prefill.yaml L40-L42
            </Cite>
            ; section 22, PD and Wide EP over EFA, explains that stack (
            <Link href="../vllm/">
              vLLM dive, section 17: Kubernetes: llm-d, KServe &amp; Gateway API
            </Link>
            ).
          </Box>
          <ExpandableSection headerText="Three flags on llm-d's SGLang page that v0.5.22 does not take as written">
            <SpaceBetween size="s">
              <Box variant="p">
                llm-d&apos;s SGLang page turns KV events on &quot;when started with{' '}
                <code>--enable-kv-cache-events</code> and <code>--kv-events-config</code>&quot;{' '}
                <Cite tier={1} href={`${LLMD_SGLANG_DOC}#L36`} kind="doc-code-conflict">
                  llm-d sglang.md L36
                </Cite>
                . No <code>--enable-kv-cache-events</code> flag was found in v0.5.22&apos;s{' '}
                <code>python/</code> or <code>docs/</code> trees: the internal field of that name is
                set from <code>--kv-events-config</code> alone{' '}
                <Cite tier={1} href={sglangUrl(KV_PUB, 'L53-L62')}>
                  kv_events_publisher.py L53-L62
                </Cite>
                . Pass only <code>--kv-events-config</code>; an unknown flag would be expected to
                fail argument parsing (not run).
              </Box>
              <Box variant="p">
                The page&apos;s wide-EP line names <code>--enable-dp-attention</code> and{' '}
                <code>--enable-ep-moe</code>{' '}
                <Cite tier={1} href={`${LLMD_SGLANG_DOC}#L61`} kind="doc-code-conflict">
                  llm-d sglang.md L61
                </Cite>
                . v0.5.22 deprecates the first in favour of <code>--attn-dp-size</code>{' '}
                <Cite tier={1} href={sglangUrl(PAR_HOOK, 'L39-L61')}>
                  parallel_hook.py L39-L61
                </Cite>{' '}
                (section 14, Parallelism), and the second was not found in its <code>python/</code>{' '}
                or <code>docs/</code> trees during this research.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>NVIDIA Dynamo.</strong> Dynamo replaces SGLang&apos;s HTTP server and gateway.{' '}
            <code>python -m dynamo.sglang</code> runs the engine in-process as{' '}
            <code>sgl.Engine</code>{' '}
            <Cite tier={1} href={`${DYNAMO}/components/src/dynamo/sglang/init_llm.py#L88`}>
              init_llm.py L88
            </Cite>
            , keeps SGLang&apos;s own PD transfer and reserves a bootstrap port itself when none is
            given{' '}
            <Cite tier={1} href={`${DYNAMO}/components/src/dynamo/sglang/args.py#L645-L650`}>
              args.py L645-L650
            </Cite>
            , and turns KV routing on when <code>--kv-events-config</code> names a publisher other
            than <code>null</code>{' '}
            <Cite tier={1} href={`${DYNAMO}/components/src/dynamo/sglang/args.py#L913-L936`}>
              args.py L913-L936
            </Cite>
            . Dynamo v1.6.0 pins SGLang 0.5.21{' '}
            <Cite tier={1} href={`${DYNAMO}/pyproject.toml#L76-L78`}>
              pyproject.toml L76-L78
            </Cite>
            , so a Dynamo deployment runs the release before the one this dive describes (
            <Link href="../vllm/">vLLM dive, section 18: NVIDIA Dynamo &amp; the Ecosystem</Link>).
          </Box>
          <Box variant="p">
            <strong>Ray Serve LLM.</strong> Ray Serve LLM runs SGLang through{' '}
            <code>server_cls=SGLangServer</code> on <code>LLMConfig</code>, which wraps SGLang&apos;s
            in-process engine{' '}
            <Cite tier={1} href={`${RAY_SGLANG_DOC}#L10-L12`}>
              Ray sglang.md L10-L12
            </Cite>
            , the <code>RayEngine</code> that lives in the SGLang repository{' '}
            <Cite tier={1} href={`${RAY}/python/ray/llm/_internal/serve/engines/sglang/sglang_engine.py#L100`}>
              Ray sglang_engine.py L100
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RAY_ENGINE, 'L228')}>
              ray/engine.py L228
            </Cite>
            . Ray marks the integration as early development{' '}
            <Cite tier={1} href={`${RAY_SGLANG_DOC}#L20-L22`}>
              L20-L22
            </Cite>{' '}
            and pins no SGLang version. A multi-node deployment needs{' '}
            <code>placement_group_config</code> with one bundle per node, holding that node&apos;s
            GPUs{' '}
            <Cite tier={1} href={`${RAY_SGLANG_DOC}#L100-L102`}>
              L100-L102
            </Cite>
            . SGLang also has its own <code>--use-ray</code> launch mode{' '}
            <Cite tier={1} href={sglangUrl(LAUNCH_SERVER, 'L52-L62')}>
              launch_server.py L52-L62
            </Cite>
            . Ray&apos;s prefix-aware routers are covered for vLLM in the vLLM dive; this research
            did not establish whether they route SGLang replicas by prefix (
            <Link href="../vllm/">vLLM dive, section 15: Orchestration: Ray &amp; Ray Serve LLM</Link>
            ).
          </Box>
          <Box variant="p">
            <strong>KServe.</strong> The v0.21.0 release tree has no path containing{' '}
            <code>sglang</code>{' '}
            <Cite tier={1} href={KSERVE_TREE} kind="code">
              kserve tree at v0.21.0
            </Cite>
            . A <code>ClusterServingRuntime</code> named <code>kserve-llm-sglang</code> was added on
            the default branch after that release and pins <code>lmsysorg/sglang:v0.5.14</code>{' '}
            <Cite tier={1} href={`${KSERVE_RUNTIME}#L1-L12`}>
              kserve-llm-sglang.yaml L1-L12
            </Cite>
            . SGLang&apos;s v0.5.22 docs and README do not mention KServe (
            <Link href="../vllm/">
              vLLM dive, section 17: Kubernetes: llm-d, KServe &amp; Gateway API
            </Link>
            ).
          </Box>
          <Box variant="p">
            <strong>SGLang&apos;s experimental router.</strong> <code>experimental/sgl-router</code>{' '}
            is a second Rust router in the SGLang repository: version 0.1.0, unpublished, built from
            source{' '}
            <Cite tier={1} href={sglangUrl(`${XR}/Cargo.toml`, 'L1-L20')}>
              Cargo.toml L1-L20
            </Cite>
            , and called experimental in the release notes{' '}
            <Cite tier={1} href={SGLANG_RELEASE}>
              SGLang v0.5.22 release notes
            </Cite>
            . It subscribes to every worker&apos;s KV events and hashes each prompt page by page the
            way the worker does{' '}
            <Cite tier={1} href={sglangUrl(`${XR}/src/state/kv_events/subscriber.rs`, 'L1-L25')}>
              subscriber.rs L1-L25
            </Cite>
            , so it follows the actual cache. On Kubernetes it reads a Service&apos;s
            EndpointSlices, readiness applied and port taken from the slice (30000 when absent){' '}
            <Cite tier={1} href={sglangUrl(`${XR}/src/discovery/k8s.rs`, 'L86-L120')}>
              k8s.rs L86-L120
            </Cite>
            , and a new replica can copy the index from a warm sibling before it reports ready{' '}
            <Cite tier={1} href={sglangUrl(`${XR}/src/server/routes/cache.rs`, 'L107-L160')}>
              cache.rs L107-L160
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> both ecosystems find a cached prefix the same two ways.
            A router remembers where it sent text, as the SGLang gateway and production-stack&apos;s{' '}
            <code>prefixaware</code> policy do, or it subscribes to the engine&apos;s KV events, as
            llm-d and Dynamo do for both engines (
            <Link href="../vllm/">vLLM dive, section 16: Kubernetes: Production-Stack &amp; Router</Link>
            ). The version picture differs: llm-d v1.0.0 and Dynamo v1.6.0 both pin vLLM v0.31.0,
            the release the vLLM dive covers{' '}
            <Cite
              tier={1}
              href={`${LLMD}/guides/recipes/modelserver/components/images/gpu-vllm/release/kustomization.yaml#L4-L6`}
            >
              llm-d gpu-vllm release L4-L6
            </Cite>{' '}
            <Cite tier={1} href={`${DYNAMO}/pyproject.toml#L62-L65`}>
              Dynamo pyproject.toml L62-L65
            </Cite>
            , while Ray 2.59.0 pins vLLM 0.27.0 and no SGLang version{' '}
            <Cite tier={1} href={`${RAY}/python/requirements/llm/llm-requirements.txt#L2`}>
              llm-requirements.txt L2
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set the binds, ports, probes and metrics that defaults get wrong on Kubernetes, then choose the orchestrator"
          >
            Before the first request: the deployment checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>1. Bind.</strong> Pass <code>--host 0.0.0.0</code> (or the pod IP) to every
            server: <code>sglang serve</code> binds 127.0.0.1 by default{' '}
            <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L65')}>
              serving.py L65
            </Cite>
            , and the prefill bootstrap registry binds the same host{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_SVC, 'L42-L48')}>
              disagg_service.py L42-L48
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(CONN, 'L2886-L2903')}>
              conn.py L2886-L2903
            </Cite>
            . Set the keys from section 12, Talking to SGLang, at the same time, since the admin
            plane shares that port.
          </Box>
          <Box variant="p">
            <strong>2. Bootstrap ports.</strong> Set <code>--disaggregation-bootstrap-port</code>{' '}
            explicitly on each prefill server, and give the gateway the same number: after the
            prefill URL (<code>{'--prefill http://<prefill>:30000 8998'}</code>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L24-L52')}>
              main.rs L24-L52
            </Cite>
            ) or in the pod&apos;s <code>sglang.ai/bootstrap-port</code> annotation under service
            discovery. Expose it on any Service that fronts prefill.
          </Box>
          <Box variant="p">
            <strong>3. Discovery.</strong> <code>--service-discovery-port 30000</code>, because the
            default is 80; selectors that match leader pods only; get, list and watch on pods for the
            gateway&apos;s service account.
          </Box>
          <Box variant="p">
            <strong>4. Health.</strong> The gateway probes each worker&apos;s <code>/health</code>{' '}
            every 60 s with a 5 s timeout and marks it unhealthy after 3 failures{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L403-L425')}>
              main.rs L403-L425
            </Cite>
            , so a dead worker can take minutes to drop out; lower{' '}
            <code>--health-check-interval-secs</code> if that is too slow. Point Kubernetes readiness
            probes at node 0, since a worker pod&apos;s stub always answers 200.
          </Box>
          <Box variant="p">
            <strong>5. Metrics.</strong> The gateway serves its <code>smg_*</code> metrics on port
            29000, bound to 0.0.0.0 by the standalone binary{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L269-L275')}>
              main.rs L269-L275
            </Cite>
            . <code>python -m sglang_router.launch_router</code>, which both documented recipes use,
            binds 127.0.0.1 unless you pass <code>--prometheus-host 0.0.0.0</code>{' '}
            <Cite tier={1} href={sglangUrl(`${GW_PY}/lib.rs`, 'L1000-L1006')} kind="code">
              lib.rs L1000-L1006
            </Cite>{' '}
            (not run), and Prometheus in another pod cannot reach a loopback bind.
            Workers expose <code>sglang:*</code> gauges only with <code>--enable-metrics</code>.
          </Box>
          <Box variant="p">
            <strong>6. KV events</strong>, if your router reads them:{' '}
            <code>--kv-events-config</code> with <code>&quot;publisher&quot;:&quot;zmq&quot;</code>,
            and ports 5557 + DP rank open from every worker to the router.
          </Box>
          <Box variant="p">
            <strong>7. Version.</strong> Read the image tag or pin in the orchestrator&apos;s
            manifests before you copy them. <strong>llm-d is the one orchestrator in the table that
            installs v0.5.22</strong>; Dynamo runs 0.5.21, and Ray installs whatever pip resolves.
          </Box>
          <Box variant="p">
            Then choose: an orchestrator whose cache signal matches how often your prompts repeat,
            at the SGLang release you tested. Section 20, SGLang on EKS and EC2, carries the EKS
            probes, devices and images, and section 22, PD and Wide EP over EFA, brings up the
            transport under the KV push.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
