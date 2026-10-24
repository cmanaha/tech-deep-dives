import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const DISAGG_FIELDS = `${SRT}/arg_groups/fields/disagg.py`;
const CHOICES = `${SRT}/arg_groups/choices.py`;
const PD_HOOK = `${SRT}/arg_groups/pd_disaggregation_hook.py`;
const PIPELINE = `${SRT}/arg_groups/pipeline.py`;
const PARALLEL_HOOK = `${SRT}/arg_groups/parallel_hook.py`;
const SERVING_HOOK = `${SRT}/arg_groups/serving_hook.py`;
const SERVING = `${SRT}/arg_groups/fields/serving.py`;
const OBSERVABILITY = `${SRT}/arg_groups/fields/observability.py`;
const ATTN_DEFAULTS = `${SRT}/arg_groups/model_override_base.py`;
const SERVER_ARGS = `${SRT}/server_args.py`;
const ENVIRON = `${SRT}/environ.py`;
const DISAGG_SVC = `${SRT}/managers/disagg_service.py`;
const DP_CTRL = `${SRT}/managers/data_parallel_controller.py`;
const COMMON_CONN = `${SRT}/disaggregation/common/conn.py`;
const BASE_CONN = `${SRT}/disaggregation/base/conn.py`;
const PREFILL = `${SRT}/disaggregation/prefill.py`;
const DECODE = `${SRT}/disaggregation/decode.py`;
const DECODE_BATCH = `${SRT}/disaggregation/decode_schedule_batch_mixin.py`;
const DISAGG_UTILS = `${SRT}/disaggregation/utils.py`;
const MOONCAKE_CONN = `${SRT}/disaggregation/mooncake/conn.py`;
const MOONCAKE_TE = `${SRT}/distributed/device_communicators/mooncake_transfer_engine.py`;
const NIXL_CONN = `${SRT}/disaggregation/nixl/conn.py`;
const KV_BUILDER = `${SRT}/mem_cache/kv_cache_builder.py`;
const METRICS = `${SRT}/observability/metrics_collector.py`;
const GW = 'sgl-model-gateway/src';
const PD_DOC = 'advanced_features/pd_disaggregation';
const EPD_DOC = 'advanced_features/epd_disaggregation';
const EP_DOC = 'advanced_features/expert_parallelism';
const REL_0522 = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';
const PR_40703 = 'https://github.com/sgl-project/sglang/pull/40703';
const VLLM_ENVS = 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/envs.py#L237';

const VLLM_PD_LINK = (
  <Link href="../vllm/">vLLM dive, section 10: Disaggregated Prefill / Decode</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: one PD request, rendezvous then reserve then push                */
/* ------------------------------------------------------------------------ */

function PdSequenceDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 500"
        role="img"
        aria-labelledby="pd-seq-title"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="pd-seq-title">
          One PD request at SGLang v0.5.22 under the default early policy. At startup every
          prefill rank registers with the bootstrap registry that runs on the prefill server, port
          8998. The gateway sends the same request to a prefill server and a decode server at the
          same time, both tagged with one random bootstrap room id. Decode asks the registry which
          prefill rank holds its slice of the KV, reserves KV pages and sends their addresses to
          prefill, while the prefill request waits in its bootstrap queue. Prefill then computes
          chunk by chunk and writes each chunk&apos;s KV straight into decode&apos;s pages, with
          the first token, its logprobs and any hybrid-model state on the last chunk. Decode
          installs the KV in a prebuilt batch that skips the forward pass and streams tokens from
          the second one onward back through the gateway.
        </title>
        <style>{`
          .pd-seq-gw { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .pd-seq-srv { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .pd-seq-reg { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .pd-seq-wait { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .pd-seq-act { fill: #ffffff; stroke: #0972d3; stroke-width: 1.5; }
          .pd-seq-done { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .pd-seq-life { stroke: #879596; stroke-width: 1; stroke-dasharray: 5 4; }
          .pd-seq-head { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .pd-seq-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .pd-seq-lbl { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .pd-seq-note { fill: #5f6b7a; font: italic 11px sans-serif; text-anchor: middle; }
          .pd-seq-bt { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .pd-seq-bs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .pd-seq-wt { fill: #5c4700; font: 600 12px sans-serif; text-anchor: middle; }
          .pd-seq-ws { fill: #5c4700; font: 11px sans-serif; text-anchor: middle; }
          .pd-seq-pl { fill: #024a07; font: 11px sans-serif; text-anchor: middle; }
          .pd-seq-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .pd-seq-rep { stroke: #5f6b7a; stroke-width: 1.5; fill: none; stroke-dasharray: 6 4; }
          .pd-seq-push { stroke: #037f0c; stroke-width: 2; fill: none; }
        `}</style>
        <defs>
          <marker
            id="pd-seq-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="pd-seq-ah-g"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#037f0c" />
          </marker>
        </defs>

        <rect x={0} y={0} width={880} height={500} rx={8} fill="#ffffff" />

        {/* Lifelines */}
        <line x1={80} y1={60} x2={80} y2={490} className="pd-seq-life" />
        <line x1={290} y1={60} x2={290} y2={490} className="pd-seq-life" />
        <line x1={520} y1={60} x2={520} y2={490} className="pd-seq-life" />
        <line x1={770} y1={60} x2={770} y2={490} className="pd-seq-life" />

        {/* Lane headers */}
        <rect x={15} y={10} width={130} height={50} rx={6} className="pd-seq-gw" />
        <text x={80} y={31} className="pd-seq-head">
          Gateway
        </text>
        <text x={80} y={48} className="pd-seq-sub">
          PD mode
        </text>
        <rect x={200} y={10} width={180} height={50} rx={6} className="pd-seq-srv" />
        <text x={290} y={31} className="pd-seq-head">
          Prefill server
        </text>
        <text x={290} y={48} className="pd-seq-sub">
          scheduler and sender
        </text>
        <rect x={435} y={10} width={170} height={50} rx={6} className="pd-seq-reg" />
        <text x={520} y={31} className="pd-seq-head">
          Bootstrap registry
        </text>
        <text x={520} y={48} className="pd-seq-sub">
          on prefill, port 8998
        </text>
        <rect x={680} y={10} width={180} height={50} rx={6} className="pd-seq-srv" />
        <text x={770} y={31} className="pd-seq-head">
          Decode server
        </text>
        <text x={770} y={48} className="pd-seq-sub">
          scheduler and receiver
        </text>

        {/* Step 0: registration at startup */}
        <text x={405} y={79} className="pd-seq-lbl">
          0. at startup, ranks PUT /route
        </text>
        <path d="M290,87 L518,87" className="pd-seq-arr" markerEnd="url(#pd-seq-ah)" />

        {/* Step 1: both legs at once */}
        <text x={185} y={112} className="pd-seq-lbl">
          1. request + room R
        </text>
        <path d="M80,120 L288,120" className="pd-seq-arr" markerEnd="url(#pd-seq-ah)" />
        <text x={185} y={138} className="pd-seq-note">
          sent at the same time
        </text>
        <text x={645} y={139} className="pd-seq-lbl">
          1. same request, same room R
        </text>
        <path d="M80,147 L768,147" className="pd-seq-arr" markerEnd="url(#pd-seq-ah)" />

        {/* Prefill waits in its bootstrap queue */}
        <rect x={215} y={160} width={150} height={102} rx={6} className="pd-seq-wait" />
        <text x={290} y={186} className="pd-seq-wt">
          bootstrap queue
        </text>
        <text x={290} y={205} className="pd-seq-ws">
          waits for step 4
        </text>
        <text x={290} y={221} className="pd-seq-ws">
          under the default
        </text>
        <text x={290} y={237} className="pd-seq-ws">
          early policy
        </text>

        {/* Step 2: lookup */}
        <text x={645} y={173} className="pd-seq-lbl">
          2. GET /route: which prefill rank?
        </text>
        <path d="M770,181 L522,181" className="pd-seq-arr" markerEnd="url(#pd-seq-ah)" />
        <text x={645} y={200} className="pd-seq-lbl">
          rank address
        </text>
        <path d="M520,208 L768,208" className="pd-seq-rep" markerEnd="url(#pd-seq-ah)" />

        {/* Step 3: reserve */}
        <rect x={690} y={220} width={160} height={46} rx={6} className="pd-seq-act" />
        <text x={770} y={240} className="pd-seq-bt">
          3. reserve KV pages
        </text>
        <text x={770} y={257} className="pd-seq-bs">
          prealloc queue
        </text>

        {/* Step 4: destination addresses */}
        <text x={645} y={283} className="pd-seq-lbl">
          4. destination page addresses
        </text>
        <path d="M770,291 L292,291" className="pd-seq-arr" markerEnd="url(#pd-seq-ah)" />

        {/* Step 5: compute and push, chunk by chunk */}
        <rect x={225} y={304} width={130} height={26} rx={5} className="pd-seq-act" />
        <text x={290} y={321} className="pd-seq-bt">
          prefill chunk 1
        </text>
        <rect x={225} y={338} width={130} height={26} rx={5} className="pd-seq-act" />
        <text x={290} y={355} className="pd-seq-bt">
          prefill chunk 2
        </text>
        <rect x={225} y={372} width={130} height={26} rx={5} className="pd-seq-act" />
        <text x={290} y={389} className="pd-seq-bt">
          last chunk
        </text>

        <text x={437} y={311} className="pd-seq-pl">
          5. write chunk 1 KV
        </text>
        <path d="M355,318 L768,318" className="pd-seq-push" markerEnd="url(#pd-seq-ah-g)" />
        <text x={437} y={345} className="pd-seq-pl">
          write chunk 2 KV
        </text>
        <path d="M355,352 L768,352" className="pd-seq-push" markerEnd="url(#pd-seq-ah-g)" />
        <text x={437} y={379} className="pd-seq-pl">
          write last chunk KV
        </text>
        <text x={645} y={379} className="pd-seq-pl">
          + first token, logprobs, hybrid state
        </text>
        <path d="M355,386 L768,386" className="pd-seq-push" markerEnd="url(#pd-seq-ah-g)" />

        {/* Step 6: install without a forward pass */}
        <rect x={675} y={404} width={190} height={46} rx={6} className="pd-seq-done" />
        <text x={770} y={424} className="pd-seq-bt">
          6. transfer done
        </text>
        <text x={770} y={441} className="pd-seq-bs">
          prebuilt batch, no forward
        </text>

        {/* Step 7: tokens back */}
        <text x={185} y={468} className="pd-seq-lbl">
          7. tokens stream back
        </text>
        <text x={645} y={468} className="pd-seq-lbl">
          decode steps, from the second token
        </text>
        <path d="M770,476 L82,476" className="pd-seq-arr" markerEnd="url(#pd-seq-ah)" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Transfer backends                                                        */
/* ------------------------------------------------------------------------ */

interface BackendRow {
  id: string;
  name: ReactNode;
  what: ReactNode;
}

const BACKEND_ROWS: BackendRow[] = [
  {
    id: 'mooncake',
    name: (
      <>
        <code>mooncake</code> (default)
      </>
    ),
    what: (
      <>
        The Mooncake transfer engine over RDMA (remote direct memory access). The route over EFA
        (Elastic Fabric Adapter) on AWS is section 22, PD and Wide EP over EFA.
      </>
    ),
  },
  {
    id: 'mooncake_tcp',
    name: <code>mooncake_tcp</code>,
    what: (
      <>
        The same Mooncake code with TCP forced (<code>MC_FORCE_TCP=1</code>) and no RDMA device
        selection. Use it to check a PD topology before the RDMA fabric is ready{' '}
        <Cite tier={1} href={sglangUrl(PD_HOOK, 'L27-L45')}>
          pd_disaggregation_hook.py L27-L45
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'nixl',
    name: <code>nixl</code>,
    what: (
      <>
        NIXL (NVIDIA Inference Xfer Library). The NIXL plugin comes from{' '}
        <code>SGLANG_DISAGGREGATION_NIXL_BACKEND</code>, default <code>UCX</code>{' '}
        <Cite tier={1} href={sglangUrl(ENVIRON, 'L713-L714')}>
          environ.py L713-L714
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'mori',
    name: <code>mori</code>,
    what: (
      <>
        AMD&apos;s MORI library, for AMD GPUs on the ROCm stack{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(EP_DOC, 'L50-L53')}>
          expert_parallelism.mdx L50-L53
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'ascend',
    name: <code>ascend</code>,
    what: <>Ascend NPUs (neural processing units).</>,
  },
  {
    id: 'fake',
    name: <code>fake</code>,
    what: (
      <>
        Moves no KV. For decode-side benchmarking only; a prefill server refuses it{' '}
        <Cite tier={1} href={sglangUrl(PD_HOOK, 'L152-L155')}>
          pd_disaggregation_hook.py L152-L155
        </Cite>
        .
      </>
    ),
  },
];

const LAUNCH_LINES = `# Prefill pool: one server per GPU group
sglang serve --model-path <model> --disaggregation-mode prefill \\
  --host <prefill-ip> --port 30000 --disaggregation-ib-device <rdma-nic>

# Decode pool
sglang serve --model-path <model> --disaggregation-mode decode \\
  --host <decode-ip> --port 30001 --disaggregation-ib-device <rdma-nic>

# Gateway in PD mode (section 17)
python -m sglang_router.launch_router --pd-disaggregation \\
  --prefill http://<prefill-ip>:30000 --decode http://<decode-ip>:30001 \\
  --host 0.0.0.0 --port 8000`;

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function PdDisaggregation() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Bring up separate prefill and decode pools, know which side throttles which, and read the queue gauges that show it (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            15. PD Disaggregation: rendezvous, reserve, push
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            PD (prefill/decode) disaggregation runs the prompt phase and the token-generation
            phase of each request on different servers. Prefill is compute-bound and decode is
            bound by memory bandwidth, and in one engine an arriving prefill batch interrupts the
            decode batches already running{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L8-L14')}>
              SGLang docs: PD Disaggregation L8-L14
            </Cite>
            . The challenge is the handoff: before decode can emit a token, the KV (key-value)
            cache that prefill built has to be in decode&apos;s GPU memory.
          </Box>
          <Box variant="p">
            In SGLang, PD is a mode of the same <code>sglang serve</code> binary,{' '}
            <code>--disaggregation-mode prefill</code> or <code>decode</code> (default{' '}
            <code>null</code>){' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L55-L58')}>
              disagg.py L55-L58
            </Cite>
            , with a gateway in front that pairs one server of each kind per request. Both servers
            get the request at once, so decode reserves pages and finishes its handshake before
            prefill has finished the prompt, and the KV transfer overlaps the prefill chunks. The
            price is that decode capacity gates prefill admission under the default{' '}
            <code>early</code> policy, and in our reading that coupling is the rule to size the
            two pools by.
          </Box>
          <Box variant="p">
            The same documentation names a second motivation: under DP (data parallelism)
            attention, one DP worker prefilling while another decodes raises decode latency{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L15')}>
              SGLang docs: PD Disaggregation L15
            </Cite>
            . Section 16, Wide Expert Parallelism, builds on that one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one request through both servers, and see what each side waits for before the first token"
          >
            PD is a rendezvous on a room id, then a push
          </Header>
        }
      >
        <SpaceBetween size="m">
          <PdSequenceDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: the order of events for one request at v0.5.22 under the
            default <code>early</code> policy, with the Mooncake or NIXL backend. Step 0 runs once,
            when the prefill server starts; 8998 is the default bootstrap port.
          </Box>
          <Box variant="p">
            The gateway turns one client request into two HTTP requests and sends them at the same
            time, one to a prefill server and one to a decode server. Both carry the prefill
            server&apos;s bootstrap host and port and one random 63-bit <code>bootstrap_room</code>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/routers/http/pd_types.rs`, 'L40-L63')}>
              pd_types.rs L40-L63
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/routers/http/pd_router.rs`, 'L701-L730')}>
              pd_router.rs L701-L730
            </Cite>
            . The room id is the rendezvous key: the gateway passes it on, and the KV moves
            directly between the two servers. How the gateway picks the pair, and its PD-mode
            flags, are in section 17, The Model Gateway.
          </Box>
          <Box variant="p">
            Each prefill server runs a small HTTP registry, the bootstrap server, on{' '}
            <code>--disaggregation-bootstrap-port</code>, default 8998{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L78-L80')}>
              disagg.py L78-L80
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_SVC, 'L21-L50')}>
              disagg_service.py L21-L50
            </Cite>
            . Every prefill rank registers its transfer endpoint there at startup, and the registry
            answers 503 until all <code>dp_size x attn_cp_size x attn_tp_size x pp_size</code>{' '}
            ranks are in, so a decode server cannot pair with a half-started prefill server{' '}
            <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2650-L2664')}>
              conn.py L2650-L2664
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2776-L2800')}>
              conn.py L2776-L2800
            </Cite>
            . The registry binds the same address as the HTTP server{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_SVC, 'L41-L48')} kind="code">
              disagg_service.py L41-L48
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2903')} kind="code">
              conn.py L2903
            </Cite>
            , whose default is 127.0.0.1{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65')}>
              serving.py L65
            </Cite>
            . Across nodes, launch each prefill server with a <code>--host</code> the decode servers
            can reach; section 12, Talking to SGLang, covers what else that bind exposes.
          </Box>
          <Box variant="p">
            Decode then asks that registry for the prefill rank holding its slice of the KV{' '}
            <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L2381-L2392')}>
              conn.py L2381-L2392
            </Cite>
            , reserves pages for the request and sends their addresses to prefill. Under the
            default <code>early</code> policy, a prefill request leaves its bootstrap queue and
            starts computing only once those destination indices have arrived{' '}
            <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')}>
              prefill.py L462-L537
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MOONCAKE_CONN, 'L2885-L2962')}>
              mooncake/conn.py L2885-L2962
            </Cite>
            . That wait is the reserve step, and the reason decode capacity can throttle prefill.
          </Box>
          <Box variant="p">
            Prefill writes the KV into those pages chunk by chunk, so a long prompt&apos;s
            transfer runs behind its remaining prefill compute{' '}
            <Cite tier={1} href={sglangUrl(PREFILL, 'L1369-L1404')}>
              prefill.py L1369-L1404
            </Cite>
            . Both the Mooncake and NIXL backends write from prefill into decode memory, Mooncake
            through <code>batch_transfer_sync_write</code> and NIXL through a <code>WRITE</code>{' '}
            transfer{' '}
            <Cite tier={1} href={sglangUrl(MOONCAKE_TE, 'L246-L260')}>
              mooncake_transfer_engine.py L246-L260
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(NIXL_CONN, 'L1910-L1915')}>
              nixl/conn.py L1910-L1915
            </Cite>
            . On decode, the request moves from a preallocation queue to a transfer queue, then
            into a prebuilt batch that installs the received KV and first token without running
            the model, and then joins ordinary decode steps{' '}
            <Cite tier={1} href={sglangUrl(DECODE, 'L1-L19')}>
              decode.py L1-L19
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DECODE_BATCH, 'L21-L27')}>
              decode_schedule_batch_mixin.py L21-L27
            </Cite>
            .
          </Box>
          <Box variant="p">
            With DP on a prefill server, the in-process controller routes by room id,{' '}
            <code>bootstrap_room % dp_size</code>, because <code>--load-balance-method auto</code>{' '}
            resolves to <code>follow_bootstrap_room</code> on a PD prefill server{' '}
            <Cite tier={1} href={sglangUrl(SERVING_HOOK, 'L208-L227')}>
              serving_hook.py L208-L227
            </Cite>
            . Decode can then work out which prefill DP rank holds the KV. A request that reaches
            that controller without a room id fails an assertion whose message says to send it to
            the router instead{' '}
            <Cite tier={1} href={sglangUrl(DP_CTRL, 'L823-L832')}>
              data_parallel_controller.py L823-L832
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The queues and poll states behind the diagram, in code">
            <SpaceBetween size="s">
              <Box variant="p">
                The prefill server keeps three queues: bootstrap (handshake not finished), waiting
                (ordinary prefill scheduling) and inflight (transfer still running){' '}
                <Cite tier={1} href={sglangUrl(PREFILL, 'L1-L19')}>
                  prefill.py L1-L19
                </Cite>
                . Each request&apos;s sender reports one of five states, <code>Failed</code>,{' '}
                <code>Bootstrapping</code>, <code>WaitingForInput</code>,{' '}
                <code>Transferring</code> and <code>Success</code>{' '}
                <Cite tier={1} href={sglangUrl(BASE_CONN, 'L118-L123')}>
                  base/conn.py L118-L123
                </Cite>
                ; <code>WaitingForInput</code> is the state a Mooncake sender reaches when every
                decode rank for the room has sent its destination indices{' '}
                <Cite tier={1} href={sglangUrl(MOONCAKE_CONN, 'L2945-L2962')}>
                  mooncake/conn.py L2945-L2962
                </Cite>
                .
              </Box>
              <Box variant="p">
                A request still in <code>Bootstrapping</code> leaves the bootstrap queue only as an
                optimistic attempt, and <code>--optimistic-prefill-attempts</code> defaults to 0{' '}
                <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L122-L124')}>
                  disagg.py L122-L124
                </Cite>
                . Raised above 0, it lets prefill compute before decode has reserved; an optimistic
                chunked request then yields to waiting requests that have finished their
                handshake{' '}
                <Cite tier={1} href={sglangUrl(PREFILL, 'L1379-L1392')}>
                  prefill.py L1379-L1392
                </Cite>
                .
              </Box>
              <Box variant="p">
                Engines plug in underneath one interface of manager, sender, receiver and bootstrap
                server classes, one directory per backend{' '}
                <Cite tier={1} href={sglangTreeUrl(`${SRT}/disaggregation`)}>
                  disaggregation/ at v0.5.22
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
            description="Launch prefill and decode so they pair on the first request, with the backend and the settings both roles must share"
          >
            Bring up the two pools
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The documentation says SGLang supports Mooncake and NIXL as transfer engines{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L21')} kind="doc-code-conflict">
              SGLang docs: PD Disaggregation L21
            </Cite>
            ; v0.5.22&apos;s code accepts six values for{' '}
            <code>--disaggregation-transfer-backend</code>, with <code>mooncake</code> the default{' '}
            <Cite tier={1} href={sglangUrl(CHOICES, 'L122-L129')}>
              choices.py L122-L129
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L65-L71')}>
              disagg.py L65-L71
            </Cite>
            , so choose from this list.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={BACKEND_ROWS}
            columnDefinitions={[
              { id: 'name', header: 'Backend', cell: (r) => r.name, minWidth: 150 },
              { id: 'what', header: 'What it is and when to pick it', cell: (r) => r.what, minWidth: 300 },
            ]}
          />
          <Box variant="p">
            A minimal pairing, adapted to <code>sglang serve</code> from the documentation&apos;s
            single-node example{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L157-L171')}>
              SGLang docs: PD Disaggregation L157-L171
            </Cite>
            :
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{LAUNCH_LINES}</code>
          </pre>
          <Box variant="p">
            Each <code>--prefill</code> URL may be followed by that server&apos;s bootstrap port{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/main.rs`, 'L24-L52')}>
              main.rs L24-L52
            </Cite>
            ; section 17, The Model Gateway, covers that form and the routing policy for each role.
          </Box>
          <Box variant="p">
            Three things cross the wire per request: the KV pages, addressed by page index; a small
            metadata record with the first output token, which prefill has already sampled, its
            logprobs and, for speculative decoding, the draft&apos;s hidden states; and, for the
            hybrid models defined in section 8, Attention Backends and Kernels, per-request state
            that is not paged KV, such as Mamba state or a sliding-window ring{' '}
            <Cite tier={1} href={sglangUrl(BASE_CONN, 'L17-L37')}>
              base/conn.py L17-L37
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_UTILS, 'L366-L440')}>
              disaggregation/utils.py L366-L440
            </Cite>
            . Prefill runs each request with <code>max_new_tokens = 1</code>{' '}
            <Cite tier={1} href={sglangUrl(PREFILL, 'L455-L459')}>
              prefill.py L455-L459
            </Cite>
            , so decode generates from the second token on.
          </Box>
          <Box variant="p">
            Some settings must match across the roles. The decode server refuses a prefill server
            whose page size or KV cache dtype differs, and the error asks for the same{' '}
            <code>--page-size</code> and <code>--kv-cache-dtype</code> on both{' '}
            <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L1183-L1199')} kind="code">
              conn.py L1183-L1199
            </Cite>
            . The attention backend sets the page size (section 8): by our reading of the default
            chain, a dense Llama-style model gets 1-token pages on H100 and 64-token pages on B200{' '}
            <Cite tier={1} href={sglangUrl(ATTN_DEFAULTS, 'L268-L324')} kind="code">
              model_override_base.py L268-L324
            </Cite>
            , so pools on those two generations fail this check unless both roles get the same
            explicit <code>--page-size</code>. Set the reservation policy on both roles too{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L59-L64')}>
              disagg.py L59-L64
            </Cite>
            , and the same speculative flags (section 11, Speculative Decoding).
          </Box>
          <Box variant="p">
            The TP (tensor parallelism) layout may differ, for example TP 4 on prefill and DP
            attention at TP 1 on decode. For GQA and MHA (grouped-query and multi-head attention)
            models, <code>SGLANG_DISAGG_STAGING_BUFFER=1</code> gathers head slices into one bulk
            transfer, which the documentation credits with 2 to 5x the throughput of per-token
            slices at high concurrency (project claim); MLA (multi-head latent attention) models
            leave it off{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L342-L350')}>
              SGLang docs: PD Disaggregation L342-L350
            </Cite>
            . It requires Mooncake or NIXL{' '}
            <Cite tier={1} href={sglangUrl(PD_HOOK, 'L159-L168')}>
              pd_disaggregation_hook.py L159-L168
            </Cite>
            .
          </Box>
          <Box variant="p">
            A decode server runs with the radix cache off and logs{' '}
            <code>Radix cache is disabled for decode server</code>, so prefix reuse happens on the
            prefill side{' '}
            <Cite tier={1} href={sglangUrl(PD_HOOK, 'L98-L134')}>
              pd_disaggregation_hook.py L98-L134
            </Cite>
            . <code>--disaggregation-decode-enable-radix-cache</code> (default False,
            experimental) turns it on to avoid re-sending prefixes decode already holds; it refuses
            HiSparse, the <code>fake</code> backend and most speculative decoding{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L85-L88')}>
              disagg.py L85-L88
            </Cite>
            . When decode runs short of KV and retracts a request (retraction is SGLang&apos;s name
            for preemption), it keeps that request&apos;s KV in host memory by default, in a
            reserved host pool or in per-request CPU tensors chosen from the decode KV pool, so the
            request resumes without re-running prefill;{' '}
            <code>--disaggregation-decode-retraction-backup none</code> aborts it with 503 for the
            client to retry{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L92-L105')}>
              disagg.py L92-L105
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(KV_BUILDER, 'L167-L223')} kind="code">
              kv_cache_builder.py L167-L223
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the decode pool for the default policy, and know what the opt-in policy buys and what it costs"
          >
            Decode capacity gates prefill: the reservation policy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Under the default <code>early</code> policy, decode reserves a request&apos;s pages
            before prefill finishes, which is what lets the transfer overlap the chunks. A long
            prompt holds those pages for its whole prefill, and a new prefill request does not
            start until decode has reserved room for it{' '}
            <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')}>
              prefill.py L462-L537
            </Cite>
            . Decode capacity therefore throttles prefill admission. In our reading this is the
            pool-sizing rule: a decode pool without free pages for the prompts in flight leaves
            prefill GPUs waiting, which is what the bootstrap-queue gauge at the end of this
            section shows.
          </Box>
          <Box variant="p">
            <code>--disaggregation-decode-allocation-policy prefill_complete</code> reserves decode
            pages only after prefill has its final result. It frees decode capacity that long
            prompts would otherwise hold, keeps the KV on prefill longer and gives up the
            chunk-by-chunk overlap{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L23-L42')}>
              SGLang docs: PD Disaggregation L23-L42
            </Cite>
            . It is opt-in and narrow: it requires Mooncake (RDMA or TCP) and pipeline, context and
            attention-TP sizes of one, and it rejects staging buffers, role switching, HiSparse,
            decode radix cache or HiCache and the Rust bootstrap registry{' '}
            <Cite tier={1} href={sglangUrl(PD_HOOK, 'L205-L252')}>
              pd_disaggregation_hook.py L205-L252
            </Cite>
            . On prefill it raises <code>--optimistic-prefill-attempts</code> from 0 to 1{' '}
            <Cite tier={1} href={sglangUrl(PD_HOOK, 'L47-L54')}>
              pd_disaggregation_hook.py L47-L54
            </Cite>
            .
          </Box>
          <Box variant="p">
            The v0.5.22 release notes claim up to 27% more throughput and half the p95 TTFT (time
            to first token) for PD on long-prompt workloads{' '}
            <Cite tier={1} href={REL_0522}>
              SGLang v0.5.22 release notes (project claim)
            </Cite>
            ; the benchmark behind it ran the opt-in <code>prefill_complete</code> policy against{' '}
            <code>early</code> on 12 Rubin GPUs serving GLM-5.2-NVFP4 with MTP (multi-token
            prediction) speculative decoding, with decode KV deliberately capped at 163,840 tokens
            per rank and a mix of 131,072-token and 4,096-token prompts, two runs per policy, and in
            those runs ITL (inter-token latency) p99 was 93% worse{' '}
            <Cite tier={2} href={PR_40703}>
              PR #40703 benchmark (project claim)
            </Cite>
            . The same pull request reports differences of about 1%, within run variation, on
            Qwen3-8B, and the documentation asks you to compare both policies on your own
            workload{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L39-L42')}>
              SGLang docs: PD Disaggregation L39-L42
            </Cite>
            .
          </Box>
          <Box variant="p">
            Treat <code>prefill_complete</code> as a remedy for one shape of load: decode KV full
            while long prompts compute. Measure your own prompt mix, the ITL tail included, before
            switching.
          </Box>
          <ExpandableSection headerText="prefill_complete with DP attention: the documentation and v0.5.22's validator disagree">
            <SpaceBetween size="s">
              <Box variant="p">
                The documentation allows attention DP with <code>prefill_complete</code> when each
                DP rank has attention TP size one{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L44-L46')} kind="doc-code-conflict">
                  SGLang docs: PD Disaggregation L44-L46
                </Cite>
                . v0.5.22&apos;s validator computes the attention DP width from{' '}
                <code>enable_dp_attention</code>{' '}
                <Cite tier={1} href={sglangUrl(PD_HOOK, 'L214-L216')} kind="code">
                  pd_disaggregation_hook.py L214-L216
                </Cite>
                , a flag the deprecation hook has already cleared, moving the width to{' '}
                <code>attn_dp_size</code>, by the time the PD hook runs{' '}
                <Cite tier={1} href={sglangUrl(PIPELINE, 'L45')} kind="code">
                  pipeline.py L45
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(PIPELINE, 'L138')} kind="code">
                  pipeline.py L138
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(PARALLEL_HOOK, 'L39-L61')} kind="code">
                  parallel_hook.py L39-L61
                </Cite>
                . Read from source, not run: with either spelling,{' '}
                <code>--tp N --attn-dp-size N</code> with N above 1 looks to be rejected at
                startup with <code>attention tensor parallelism greater than one</code>.
              </Box>
              <Box variant="p">
                The pull request&apos;s benchmark ran TP 4, DP 4 and EP (expert parallelism) 4 with
                DP attention enabled, on a candidate that predates its final rebases{' '}
                <Cite tier={2} href={PR_40703}>
                  PR #40703 benchmark protocol
                </Cite>
                . Test the combination on v0.5.22 before you plan around that figure.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know how long a lost prefill node or a stuck handshake holds a request, and what the client sees"
          >
            When one side fails
          </Header>
        }
      >
        <Box variant="p">
          Decode sends a heartbeat to each prefill bootstrap server every 5 seconds (
          <code>SGLANG_DISAGGREGATION_HEARTBEAT_INTERVAL</code>, floor 2) and, after 2 failures in
          a row (<code>SGLANG_DISAGGREGATION_HEARTBEAT_MAX_FAILURE</code>), marks every unfinished
          room from that prefill as failed with <code>Lost connection with prefill instance</code>{' '}
          <Cite tier={1} href={sglangUrl(ENVIRON, 'L708-L709')}>
            environ.py L708-L709
          </Cite>{' '}
          <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L1817-L1858')}>
            conn.py L1817-L1858
          </Cite>{' '}
          <Cite tier={1} href={sglangUrl(COMMON_CONN, 'L1873-L1913')}>
            conn.py L1873-L1913
          </Cite>
          , some 10 seconds at the defaults. Prefill waits up to 300 seconds for destination
          indices (<code>SGLANG_DISAGGREGATION_BOOTSTRAP_TIMEOUT</code>) and decode up to 300
          seconds for the KV (<code>SGLANG_DISAGGREGATION_WAITING_TIMEOUT</code>){' '}
          <Cite tier={1} href={sglangUrl(ENVIRON, 'L706-L710')}>
            environ.py L706-L710
          </Cite>
          . A failed transfer aborts the request on decode with HTTP 500{' '}
          <Cite tier={1} href={sglangUrl(DECODE, 'L2760-L2786')}>
            decode.py L2760-L2786
          </Cite>
          . When the prefill leg fails, the gateway drops the paired decode request instead of
          leaving it to wait out that timeout{' '}
          <Cite tier={1} href={sglangUrl(`${GW}/routers/http/pd_router.rs`, 'L732-L745')} kind="code">
            pd_router.rs L732-L745
          </Cite>
          ; the gateway&apos;s other reliability features are in section 17.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Split the vision or audio encoder off the language servers when image load and token load grow at different rates"
          >
            EPD: a third tier for multimodal encoders
          </Header>
        }
      >
        <Box variant="p">
          EPD (encoder-prefill-decode disaggregation) puts a tier of encoder servers in front of
          the language servers. An <code>--encoder-only</code> server runs the vision or audio
          encoder; a <code>--language-only</code> server loads only the language model and takes
          embeddings from the encoders listed in <code>--encoder-urls</code> or registered with its
          encoder bootstrap server (<code>--encoder-bootstrap-port</code>, default 8997){' '}
          <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L129-L165')}>
            disagg.py L129-L165
          </Cite>
          . An encoder-only server cannot also take a <code>--disaggregation-mode</code>, while a
          language-only server can be a PD prefill server, which gives the three tiers{' '}
          <Cite tier={1} href={sglangUrl(PD_HOOK, 'L289-L305')}>
            pd_disaggregation_hook.py L289-L305
          </Cite>{' '}
          <Cite tier={1} href={sglangDocsSrcUrl(EPD_DOC, 'L12-L13')}>
            SGLang docs: EPD Disaggregation L12-L13
          </Cite>
          . Embeddings travel over ZMQ (ZeroMQ) by default: <code>--encoder-transfer-backend</code>{' '}
          defaults to <code>auto</code>, which resolves to <code>zmq_to_scheduler</code> for every
          model except Kimi K3 at TP above 1, and <code>mooncake</code> moves them over RDMA{' '}
          <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L144-L150')}>
            disagg.py L144-L150
          </Cite>{' '}
          <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L557-L564')}>
            server_args.py L557-L564
          </Cite>
          . EPD accepts 16 architectures at v0.5.22, among them the Qwen2-VL, Qwen2.5-VL, Qwen3-VL
          and Qwen3.5 families, Kimi-VL, Kimi K2.5 and K3, MiMo V2 and GLM5-Next; any other model
          fails at startup with <code>not supported for encoder disaggregation</code>{' '}
          <Cite tier={1} href={sglangUrl(PD_HOOK, 'L343-L365')}>
            pd_disaggregation_hook.py L343-L365
          </Cite>
          . Check that list before planning an encoder tier.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn the PD gauges into a diagnosis, decode capacity or the fabric, before you change the policy"
          >
            Read the four queues to find which side throttles
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            With <code>--enable-metrics</code>, off by default{' '}
            <Cite tier={1} href={sglangUrl(OBSERVABILITY, 'L70')}>
              observability.py L70
            </Cite>
            , each server exports its PD queues on <code>/metrics</code>:{' '}
            <code>sglang:num_prefill_bootstrap_queue_reqs</code> and{' '}
            <code>sglang:num_prefill_inflight_queue_reqs</code> on prefill,{' '}
            <code>sglang:num_decode_prealloc_queue_reqs</code> and{' '}
            <code>sglang:num_decode_transfer_queue_reqs</code> on decode, plus{' '}
            <code>sglang:kv_transfer_latency_ms</code>, <code>sglang:kv_transfer_speed_gb_s</code>{' '}
            and the failure counters <code>sglang:num_bootstrap_failed_reqs_total</code> and{' '}
            <code>sglang:num_transfer_failed_reqs_total</code>{' '}
            <Cite tier={1} href={sglangUrl(METRICS, 'L574-L676')}>
              metrics_collector.py L574-L676
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of the queue design gives two signatures. A prefill bootstrap queue that
            keeps growing while prefill GPUs sit idle points at decode capacity, because under{' '}
            <code>early</code> a request waits there until decode reserves its pages: add decode
            capacity, or test <code>prefill_complete</code> if long prompts are what hold the
            pages. A decode transfer queue that keeps growing points at the fabric, or at prefill
            compute, since pages are reserved and the request stays there until its last chunk
            lands: compare <code>sglang:kv_transfer_speed_gb_s</code> with the link first, and see
            section 22 for EFA.
          </Box>
          <Box variant="p">
            <strong>Before tuning:</strong> launch both roles with the same page size, KV cache
            dtype and reservation policy, put the gateway in PD mode in front, and watch those
            four gauges under your real prompt mix. Switch to <code>prefill_complete</code> only
            when the bootstrap queue is the one growing and your own measurement shows a gain; the
            up-to-27% throughput and half-p95-TTFT figure is a project claim for that policy on
            Rubin GPUs with decode KV deliberately capped, with ITL p99 93% worse in the same runs{' '}
            <Cite tier={2} href={PR_40703}>
              PR #40703 benchmark (project claim)
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> SGLang always pushes KV into pages decode preallocated,
            and both legs start at once, so the handshake is done before prefill finishes. In
            vLLM, PD is a KV connector chosen
            by <code>--kv-transfer-config</code>: the reference <code>NixlConnector</code> pulls,
            vLLM&apos;s reference pull proxy runs prefill first, and <code>NixlPushConnector</code>{' '}
            pushes. The bootstrap-server idea and its port 8998 are shared: vLLM&apos;s Mooncake
            connector runs one on <code>VLLM_MOONCAKE_BOOTSTRAP_PORT</code>, default 8998{' '}
            <Cite tier={1} href={VLLM_ENVS}>
              vLLM envs.py L237
            </Cite>{' '}
            ({VLLM_PD_LINK}).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
