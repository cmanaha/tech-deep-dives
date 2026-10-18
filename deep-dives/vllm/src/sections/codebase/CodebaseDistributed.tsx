import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../../components/Cite';

const TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';
const RELEASE_NOTES = 'https://github.com/vllm-project/vllm/releases/tag/';
const PS = 'vllm/distributed/parallel_state.py';
const CUDA_COMM = 'vllm/distributed/device_communicators/cuda_communicator.py';
const NIXL = 'vllm/distributed/kv_transfer/kv_connector/v1/nixl';
const KV_BASE = 'vllm/distributed/kv_transfer/kv_connector/v1/base.py';
const FACTORY = 'vllm/distributed/kv_transfer/kv_connector/factory.py';
const PARALLEL = 'vllm/config/parallel.py';

interface ConfigRow {
  field: string;
  type: string;
  detail: string;
}

const kvTransferConfigRows: ConfigRow[] = [
  {
    field: 'kv_connector',
    type: 'str | None',
    detail:
      'Registered connector name, for example "NixlConnector", "NixlPushConnector", "LMCacheConnectorV1" or "MultiConnector". Defaults to None, so no connector runs unless you set one.',
  },
  {
    field: 'kv_role',
    type: 'KVRole | None',
    detail:
      '"kv_producer" (prefill), "kv_consumer" (decode) or "kv_both". Required once kv_connector is set: __post_init__ raises without it. kv_both is deprecated for NIXL.',
  },
  {
    field: 'engine_id',
    type: 'str | None',
    detail: 'Identity used to address this engine during handshake. Defaults to a fresh uuid4 in __post_init__.',
  },
  {
    field: 'kv_buffer_device',
    type: 'str',
    detail: 'Device the connector buffers KV on: "cuda", "cpu", or "xpu". Defaults to the current platform device type.',
  },
  {
    field: 'kv_connector_extra_config',
    type: 'dict[str, Any]',
    detail:
      'Connector-specific knobs. NIXL reads backends (["UCX"]) and kv_lease_duration (30); with bidirectional_kv_xfer it also reads kv_recompute_threshold (64) and decoder_kv_blocks_ttl (480); push mode adds push_registration_timeout (defaults to decoder_kv_blocks_ttl).',
  },
  {
    field: 'kv_connector_module_path',
    type: 'str | None',
    detail: 'Python module to import an out-of-tree connector from. V1 only; takes priority over the internal registry.',
  },
  {
    field: 'kv_load_failure_policy',
    type: '"recompute" | "fail"',
    detail: 'What to do when a remote KV load fails. "fail" (default) finishes the request with an error reason.',
  },
];

interface AllReduceRow {
  order: string;
  backend: string;
  on: ReactNode;
  dflt: ReactNode;
}

const BATCH_INV = (
  <>
    On (off under <code>VLLM_BATCH_INVARIANT=1</code>)
  </>
);

const allReduceRows: AllReduceRow[] = [
  {
    order: '1',
    backend: 'NCCL symmetric memory (through PyNccl)',
    on: (
      <>
        <code>VLLM_USE_NCCL_SYMM_MEM=1</code>. Tried only when FlashInfer declines the tensor.
      </>
    ),
    dflt: 'Off',
  },
  {
    order: '2',
    backend: 'QuickAllReduce',
    on: 'ROCm, with custom all-reduce enabled.',
    dflt: 'ROCm only',
  },
  {
    order: '3',
    backend: 'FlashInfer PCIe-IPC',
    on: <code>VLLM_ALLREDUCE_USE_FLASHINFER_PCIE_IPC=1</code>,
    dflt: 'Off',
  },
  {
    order: '4',
    backend: 'FlashInfer',
    on: (
      <>
        <code>VLLM_ALLREDUCE_USE_FLASHINFER=1</code>. Accepts 2-D contiguous fp16, bf16 or fp32
        tensors that fit its workspace.
      </>
    ),
    dflt: BATCH_INV,
  },
  {
    order: '5',
    backend: 'AITER custom all-reduce',
    on: "ROCm with custom all-reduce from AITER (AMD's ROCm kernel library) enabled; it replaces CustomAllreduce there.",
    dflt: 'ROCm only',
  },
  {
    order: '6',
    backend: 'CustomAllreduce',
    on: (
      <>
        Unless <code>--disable-custom-all-reduce</code> is set or the platform lacks support.
      </>
    ),
    dflt: BATCH_INV,
  },
  {
    order: '7',
    backend: 'torch symmetric memory (SymmMemCommunicator)',
    on: (
      <>
        <code>VLLM_ALLREDUCE_USE_SYMM_MEM=1</code>, CUDA only.
      </>
    ),
    dflt: 'On',
  },
  {
    order: '8',
    backend: 'PyNccl',
    on: (
      <>
        Any group with more than one rank; <code>torch.distributed.all_reduce</code> covers a
        group without it.
      </>
    ),
    dflt: 'Always',
  },
];

interface ModeRow {
  q: string;
  pull: ReactNode;
  push: ReactNode;
}

const nixlModeRows: ModeRow[] = [
  {
    q: 'Who issues the RDMA',
    pull: "D's worker posts a NIXL READ of P's blocks.",
    push: "P's nixl-push-writer thread posts a NIXL WRITE into D's blocks.",
  },
  {
    q: 'Whose memory descriptors get imported',
    pull: "D imports P's, from the handshake payload.",
    push: "P imports D's in a reverse handshake. D connects to P for notifications only.",
  },
  {
    q: 'What the proxy forwards to D',
    pull: "P's kv_transfer_params, including remote_block_ids, once the prefill leg returns.",
    push: "P's engine id, host, port, TP and PP size and the shared request id, sent alongside the prefill leg. No block ids.",
  },
  {
    q: 'When D allocates its blocks',
    pull: 'When it schedules the decode leg, after P has finished.',
    push: 'Up front: the scheduler records the block ids at update_state_after_alloc and the worker sends them to P in a PUSH_REG notification.',
  },
  {
    q: 'Supported only in this mode',
    pull: 'Bidirectional KV transfer (bidirectional_kv_xfer) and decode context parallel > 1.',
    push: 'A pipeline-parallel prefiller with a hybrid attention KV cache (Mamba/SSM hybrids are rejected under PP in both modes). D also arms a registration watchdog (push_registration_timeout).',
  },
];

function ParallelGroupTopologyDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 660 282"
        role="img"
        aria-labelledby="pg-topo-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="pg-topo-title">
          Eight ranks laid out as DP=2 x PP=2 x TP=2: adjacent ranks form each tensor-parallel
          group, pipeline-stage edges join the two rows inside each replica, and each
          data-parallel replica holds a full copy of the model.
        </title>
        <style>
          {`
            .pgt-rk { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .pgt-rkt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
            .pgt-lbl { fill: #414d5c; font: 600 12px sans-serif; }
            .pgt-row { fill: #5f6b7a; font: 600 11px sans-serif; }
            .pgt-tp { fill: none; stroke: #037f0c; stroke-width: 2; }
            .pgt-pp { fill: none; stroke: #8b6c00; stroke-width: 2; stroke-dasharray: 5 4; }
            .pgt-dp { fill: none; stroke: #6f4cc4; stroke-width: 2; stroke-dasharray: 2 3; }
            .pgt-leg { font: 11px sans-serif; }
          `}
        </style>
        <defs>
          <marker id="pgt-ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#8b6c00" />
          </marker>
        </defs>
        <rect x={0} y={0} width={660} height={282} rx={8} fill="#ffffff" />

        {/* DP replica outlines */}
        <rect className="pgt-dp" x={60} y={28} width={260} height={192} rx={10} />
        <rect className="pgt-dp" x={380} y={28} width={260} height={192} rx={10} />
        <text className="pgt-lbl" x={80} y={50}>DP group 0 (replica)</text>
        <text className="pgt-lbl" x={400} y={50}>DP group 1 (replica)</text>

        {/* PP stage row labels */}
        <text className="pgt-row" x={14} y={99}>PP 0</text>
        <text className="pgt-row" x={14} y={179}>PP 1</text>

        {/* rank tiles: 2 (DP) x 2 (PP) x 2 (TP) = world size 8 */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((g) => {
          const col = g % 2; // TP index
          const ppRow = Math.floor(g / 2) % 2; // PP index
          const dpBlock = Math.floor(g / 4); // DP index
          const x = 80 + col * 130 + dpBlock * 320;
          const y = 70 + ppRow * 80;
          return (
            <g key={g}>
              <rect className="pgt-rk" x={x} y={y} width={90} height={50} rx={6} />
              <text className="pgt-rkt" x={x + 45} y={y + 30}>{`g${g}`}</text>
            </g>
          );
        })}

        {/* TP group boxes: [g0,g1] [g2,g3] [g4,g5] [g6,g7] */}
        <rect className="pgt-tp" x={72} y={62} width={236} height={66} rx={8} />
        <rect className="pgt-tp" x={72} y={142} width={236} height={66} rx={8} />
        <rect className="pgt-tp" x={392} y={62} width={236} height={66} rx={8} />
        <rect className="pgt-tp" x={392} y={142} width={236} height={66} rx={8} />

        {/* PP edges: g0->g2, g1->g3, g4->g6, g5->g7 */}
        <line className="pgt-pp" x1={125} y1={120} x2={125} y2={142} markerEnd="url(#pgt-ah)" />
        <line className="pgt-pp" x1={255} y1={120} x2={255} y2={142} markerEnd="url(#pgt-ah)" />
        <line className="pgt-pp" x1={445} y1={120} x2={445} y2={142} markerEnd="url(#pgt-ah)" />
        <line className="pgt-pp" x1={575} y1={120} x2={575} y2={142} markerEnd="url(#pgt-ah)" />

        {/* legend */}
        <rect className="pgt-tp" x={80} y={250} width={26} height={14} rx={3} />
        <text className="pgt-leg" x={112} y={261} fill="#037f0c">TP group (intra-layer all-reduce)</text>
        <line className="pgt-pp" x1={360} y1={257} x2={386} y2={257} />
        <text className="pgt-leg" x={392} y={261} fill="#8b6c00">PP stage edge</text>
        <line className="pgt-dp" x1={520} y1={257} x2={546} y2={257} />
        <text className="pgt-leg" x={552} y={261} fill="#6f4cc4">DP replica</text>
      </svg>
    </div>
  );
}

function NixlTransferFlowDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 440"
        role="img"
        aria-labelledby="nixl-flow-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="nixl-flow-title">
          NIXL pull and push modes compared. In pull mode the proxy runs the prefill leg first,
          hands the decoder the prefiller's block ids, and the decoder issues a NIXL READ after a
          ZMQ handshake while heartbeats renew the prefiller's lease. In push mode the proxy sends
          both legs at once, the decoder sends its pre-allocated block ids to the prefiller in a
          PUSH_REG notification, and the prefiller's writer thread issues a NIXL WRITE.
        </title>
        <style>
          {`
            .nxf-panel { fill: #fafbfc; stroke: #d1d5db; stroke-width: 1; }
            .nxf-hdr { fill: #0f1b2a; font: 600 13px sans-serif; }
            .nxf-node { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .nxf-prox { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
            .nxf-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
            .nxf-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .nxf-pl { fill: #6f4cc4; font: 11px sans-serif; text-anchor: middle; }
            .nxf-ctl { stroke: #0972d3; stroke-width: 1.5; fill: none; }
            .nxf-data { stroke: #037f0c; stroke-width: 3; fill: none; }
            .nxf-hb { stroke: #8b6c00; stroke-width: 1.5; fill: none; stroke-dasharray: 4 3; }
            .nxf-px { stroke: #6f4cc4; stroke-width: 1.5; fill: none; }
            .nxf-e { font: 11px sans-serif; text-anchor: middle; }
          `}
        </style>
        <defs>
          <marker id="nxf-a1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="#0972d3" />
          </marker>
          <marker id="nxf-a2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="#037f0c" />
          </marker>
          <marker id="nxf-a3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="#8b6c00" />
          </marker>
          <marker id="nxf-a4" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="#6f4cc4" />
          </marker>
        </defs>
        <rect x={0} y={0} width={760} height={440} rx={8} fill="#ffffff" />

        {/* ---------- Pull panel ---------- */}
        <g transform="translate(0,8)">
          <rect className="nxf-panel" x={8} y={0} width={744} height={205} rx={8} />
          <text className="nxf-hdr" x={22} y={24}>Pull: NixlConnector (alias of NixlPullConnector)</text>

          <rect className="nxf-prox" x={320} y={40} width={120} height={34} rx={6} />
          <text className="nxf-t" x={380} y={62}>Proxy</text>
          <path className="nxf-px" d="M320,57 L116,57 L116,94" markerStart="url(#nxf-a4)" markerEnd="url(#nxf-a4)" />
          <text className="nxf-pl" x={218} y={50}>1. prefill leg first</text>
          <text className="nxf-pl" x={218} y={74}>P returns kv_transfer_params</text>
          <path className="nxf-px" d="M440,57 L644,57 L644,94" markerEnd="url(#nxf-a4)" />
          <text className="nxf-pl" x={542} y={50}>2. then the decode leg,</text>
          <text className="nxf-pl" x={542} y={74}>carrying P's block ids</text>

          <rect className="nxf-node" x={24} y={96} width={184} height={96} rx={8} />
          <text className="nxf-t" x={116} y={120}>Prefiller (P)</text>
          <text className="nxf-s" x={116} y={140}>kv_role = kv_producer</text>
          <text className="nxf-s" x={116} y={158}>holds blocks under lease</text>
          <text className="nxf-s" x={116} y={176}>serves its descriptors</text>

          <rect className="nxf-node" x={552} y={96} width={184} height={96} rx={8} />
          <text className="nxf-t" x={644} y={120}>Decoder (D)</text>
          <text className="nxf-s" x={644} y={140}>kv_role = kv_consumer</text>
          <text className="nxf-s" x={644} y={158}>allocates after prefill</text>
          <text className="nxf-s" x={644} y={176}>imports P's descriptors</text>

          <path className="nxf-ctl" d="M552,118 L210,118" markerEnd="url(#nxf-a1)" />
          <text className="nxf-e" x={380} y={111} fill="#0972d3">ZMQ handshake: D fetches P's NIXL metadata</text>
          <path className="nxf-data" d="M208,148 L548,148" markerEnd="url(#nxf-a2)" />
          <text className="nxf-e" x={380} y={141} fill="#037f0c">NIXL READ, issued by D: KV blocks flow P to D</text>
          <path className="nxf-hb" d="M552,178 L210,178" markerEnd="url(#nxf-a3)" />
          <text className="nxf-e" x={380} y={171} fill="#8b6c00">heartbeats renew P's 30 s lease until D is done</text>
        </g>

        {/* ---------- Push panel ---------- */}
        <g transform="translate(0,227)">
          <rect className="nxf-panel" x={8} y={0} width={744} height={205} rx={8} />
          <text className="nxf-hdr" x={22} y={24}>Push: NixlPushConnector</text>

          <rect className="nxf-prox" x={320} y={40} width={120} height={34} rx={6} />
          <text className="nxf-t" x={380} y={62}>Proxy</text>
          <path className="nxf-px" d="M320,57 L116,57 L116,94" markerEnd="url(#nxf-a4)" />
          <text className="nxf-pl" x={218} y={50}>1. prefill leg</text>
          <text className="nxf-pl" x={218} y={74}>sent with the decode leg</text>
          <path className="nxf-px" d="M440,57 L644,57 L644,94" markerEnd="url(#nxf-a4)" />
          <text className="nxf-pl" x={542} y={50}>1. decode leg</text>
          <text className="nxf-pl" x={542} y={74}>P's address, no block ids</text>

          <rect className="nxf-node" x={24} y={96} width={184} height={96} rx={8} />
          <text className="nxf-t" x={116} y={120}>Prefiller (P)</text>
          <text className="nxf-s" x={116} y={140}>kv_role = kv_producer</text>
          <text className="nxf-s" x={116} y={158}>nixl-push-writer thread</text>
          <text className="nxf-s" x={116} y={176}>imports D's descriptors</text>

          <rect className="nxf-node" x={552} y={96} width={184} height={96} rx={8} />
          <text className="nxf-t" x={644} y={120}>Decoder (D)</text>
          <text className="nxf-s" x={644} y={140}>kv_role = kv_consumer</text>
          <text className="nxf-s" x={644} y={158}>allocates blocks up front</text>
          <text className="nxf-s" x={644} y={176}>registration watchdog</text>

          <path className="nxf-ctl" d="M552,118 L210,118" markerEnd="url(#nxf-a1)" />
          <text className="nxf-e" x={380} y={111} fill="#0972d3">PUSH_REG notification: D's allocated block ids</text>
          <path className="nxf-data" d="M208,148 L548,148" markerEnd="url(#nxf-a2)" />
          <text className="nxf-e" x={380} y={141} fill="#037f0c">NIXL WRITE, issued by P's writer thread</text>
          <path className="nxf-hb" d="M208,178 L550,178" markerEnd="url(#nxf-a3)" />
          <text className="nxf-e" x={380} y={171} fill="#8b6c00">completion notification; P frees its blocks</text>
        </g>
      </svg>
    </div>
  );
}

export function CodebaseDistributed() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How vLLM lays one model across ranks, which all-reduce kernel each call takes, and how key-value (KV) cache moves between prefill and decode engines (vLLM v0.31.0, commit db9527a4, accessed 2026-10-16)"
          >
            Distributed &amp; KV Transfer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What this layer does.</strong> Everything under{' '}
            <code>vllm/distributed/</code> answers two questions: how one model is laid out across
            many GPUs, and how KV cache moves between separate engines. The first is
            the parallel-group machinery (<code>GroupCoordinator</code> and{' '}
            <code>initialize_model_parallel</code> in <code>parallel_state.py</code>), which builds
            the tensor, pipeline, data and expert process groups and picks an all-reduce kernel
            for each call. The second is the KV connector framework under{' '}
            <code>vllm/distributed/kv_transfer/</code>, whose NIXL (NVIDIA Inference Xfer Library)
            connector carries KV from a prefill engine to a decode engine in disaggregated
            serving.
          </Box>
          <Box variant="p">
            <strong>Why it is two stories.</strong> Parallelism happens <em>within</em> one
            engine: ranks of the same model cooperate on every forward pass over fast
            collectives. KV transfer happens <em>between</em> engines: a prefiller fills the
            cache, a decoder receives it over the network, and the two never share a process
            group.
          </Box>
          <Box variant="small">
            Verified against{' '}
            <Cite tier={1} href={TREE}>
              vllm-project/vllm @ v0.31.0 (commit db9527a4)
            </Cite>
            : <code>vllm/distributed/</code>, <code>vllm/config/parallel.py</code>,{' '}
            <code>vllm/config/kv_transfer.py</code>, <code>vllm/v1/executor/</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which process group each collective runs on, which groups exist for your model, and how global ranks map to them"
          >
            Parallel-group topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>initialize_model_parallel(...)</code>{' '}
            <Cite tier={1} href={vllmUrl(PS, 'L1975-L1981')}>
              parallel_state.py L1975
            </Cite>{' '}
            reshapes <code>torch.arange(world_size)</code> into a 5-D rank grid whose layout
            order is <strong>ExternalDP x DP x PP x PCP x TP</strong> (external data, data,
            pipeline, prefill context and tensor parallelism){' '}
            <Cite tier={1} href={vllmUrl(PS, 'L2045-L2060')}>
              parallel_state.py L2045-L2060
            </Cite>
            . It slices that grid along each axis into group rank-lists and wraps each list in a{' '}
            <code>GroupCoordinator</code>. The docstring&apos;s worked example: 8 GPUs with TP=2,
            PP=4 yield four TP groups <code>[g0,g1] [g2,g3] [g4,g5] [g6,g7]</code> and two PP
            groups <code>[g0,g2,g4,g6] [g1,g3,g5,g7]</code>{' '}
            <Cite tier={1} href={vllmUrl(PS, 'L1996-L2004')}>
              parallel_state.py L1996-L2004
            </Cite>
            . The diagram shows a DP=2, PP=2, TP=2 decomposition of the same 8 ranks.
          </Box>
          <ParallelGroupTopologyDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative layout, rank = dp x 4 + pp x 2 + tp. For an MoE (mixture of experts) model
            the EP (expert parallel) group spans DP x PCP x TP inside one pipeline stage, here{' '}
            {'{g0, g1, g4, g5}'} and {'{g2, g3, g6, g7}'}. DCP (decode context parallel) adds no
            tiles: it regroups ranks the TP groups already hold.
          </Box>
          <Box variant="p">
            <strong>GroupCoordinator</strong>{' '}
            <Cite tier={1} href={vllmUrl(PS, 'L424-L449')}>
              parallel_state.py L424
            </Cite>{' '}
            wraps a PyTorch <code>ProcessGroup</code>. Each instance owns a{' '}
            <code>device_group</code> (NCCL, the NVIDIA Collective Communications Library, for GPU
            collectives) and a <code>cpu_group</code> (Gloo) for CPU-side coordination, and tracks
            its <code>rank_in_group</code> alongside the global <code>rank</code>. Its constructor
            builds the platform&apos;s <code>device_communicator</code> whenever the group has
            more than one rank{' '}
            <Cite tier={1} href={vllmUrl(PS, 'L544-L556')}>
              parallel_state.py L544-L556
            </Cite>
            . The module keeps one global per group (<code>_WORLD</code>, <code>_TP</code>,{' '}
            <code>_PP</code>, <code>_DP</code>, <code>_EP</code>, <code>_EPLB</code>,{' '}
            <code>_PCP</code>, <code>_DCP</code>, plus <code>_INNER_DP_WORLD</code> and two groups for
            DeepSeek V4.1&apos;s Engram layers, <code>_ETP</code> and <code>_ENGRAM_DP</code>), each
            with a <code>get_*_group()</code> accessor{' '}
            <Cite tier={1} href={vllmUrl(PS, 'L1446-L1641')}>
              parallel_state.py L1446-L1641
            </Cite>
            .
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">TP / PP (_TP, _PP)</Box>
              <Box variant="p">
                Tensor parallel shards each layer across ranks (frequent per-layer all-reduce);
                pipeline parallel splits the layer stack into stages connected by point-to-point
                sends. Both are always built; <code>model_parallel_is_initialized()</code> checks
                that <code>_TP</code> and <code>_PP</code> are set{' '}
                <Cite tier={1} href={vllmUrl(PS, 'L2351-L2353')}>
                  parallel_state.py L2351
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">DP / EP (_DP, _EP, _EPLB)</Box>
              <Box variant="p">
                Data parallel replicates the model. Expert parallel spreads MoE experts over DP x
                PCP x TP ranks, and the EP group exists only for MoE models: a dense model leaves{' '}
                <code>_EP</code> unset and{' '}
                <code>get_ep_group()</code> asserts{' '}
                <Cite tier={1} href={vllmUrl(PS, 'L2208-L2241')}>
                  parallel_state.py L2208-L2241
                </Cite>
                . With EPLB (expert parallelism load balancing) on, <code>_EPLB</code> repeats the
                EP ranks in a separate group so weight moves cannot deadlock MoE collectives. Under{' '}
                <code>enable_elastic_ep</code>, <code>_DP</code>, <code>_EP</code> and{' '}
                <code>_EPLB</code> are stateless groups that ranks can join and leave{' '}
                <Cite tier={1} href={vllmUrl(PS, 'L2190-L2266')}>
                  parallel_state.py L2190-L2266
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">PCP / DCP (_PCP, _DCP)</Box>
              <Box variant="p">
                Prefill and decode context parallel split one sequence&apos;s context across
                ranks. PCP is a grid axis between PP and TP. DCP is a regrouping: it slices the
                existing TP ranks (TP x PCP when PCP is on) into groups of{' '}
                <code>decode_context_parallel_size</code>{' '}
                <Cite tier={1} href={vllmUrl(PS, 'L2135-L2151')}>
                  parallel_state.py L2135-L2151
                </Cite>
                , and the world size stays PP x TP x PCP{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L899-L903')}>
                  config/parallel.py L899-L903
                </Cite>
                . Both default to size 1.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which all-reduce kernel a TP group runs for a given tensor, the environment variable behind each one, and the startup line that confirms the set"
          >
            Device communicators and the all-reduce backend
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A <code>GroupCoordinator</code> calls collectives through a platform-specific{' '}
            <code>DeviceCommunicatorBase</code> subclass from{' '}
            <code>vllm/distributed/device_communicators/</code>: <code>CudaCommunicator</code> on
            CUDA and on ROCm{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/rocm.py', 'L1071-L1074')}>
              platforms/rocm.py L1071-L1074
            </Cite>
            , <code>CpuCommunicator</code> and <code>XpuCommunicator</code>. Ray adds a different
            kind of object: <code>RayPPCommunicator</code> implements Ray&apos;s compiled-graph{' '}
            <code>Communicator</code> interface around vLLM&apos;s PP group, and serves only
            pipeline parallelism under Ray Compiled Graph{' '}
            <Cite tier={1} href={vllmUrl('vllm/distributed/device_communicators/ray_communicator.py', 'L9-L25')}>
              ray_communicator.py L9-L25
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>A chain of gates.</strong> On CUDA the communicator always builds PyNccl, and
            up to six optional fast paths beside it. Each one is <code>None</code> when disabled
            and carries its own size, dtype or topology check, so every call walks the chain and
            runs on the first backend that accepts the tensor{' '}
            <Cite tier={1} href={vllmUrl(CUDA_COMM, 'L335-L408')}>
              cuda_communicator.py L335-L408
            </Cite>
            . Rows 2 to 7 exist only on the TP group: the constructor switches them off for any
            other group name, so all-reduces on the PP, DP and EP groups go through NCCL{' '}
            <Cite tier={1} href={vllmUrl(CUDA_COMM, 'L50-L77')}>
              cuda_communicator.py L50-L77
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'order', header: 'Order', cell: (r) => r.order, minWidth: 60 },
              { id: 'backend', header: 'Backend', cell: (r) => r.backend, minWidth: 170 },
              { id: 'on', header: 'Built and tried when', cell: (r) => r.on },
              { id: 'dflt', header: 'Default', cell: (r) => r.dflt, minWidth: 120 },
            ]}
            items={allReduceRows}
          />
          <Box variant="small" color="text-body-secondary">
            Defaults:{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1911-L1923')} kind="code">
              envs.py L1911-L1923
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L2040-L2042')} kind="code">
              envs.py L2040-L2042
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(CUDA_COMM, 'L97-L179')}>
              cuda_communicator.py L97-L179
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L220-L221')} kind="code">
              config/parallel.py L220-L221
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L1083-L1085')} kind="code">
              L1083-L1085
            </Cite>
            ; FlashInfer tensor check{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/device_communicators/flashinfer_all_reduce.py', 'L432-L462')}
            >
              flashinfer_all_reduce.py L432-L462
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>FlashInfer is on by default.</strong> Its kernel comes from{' '}
            <code>VLLM_FLASHINFER_ALLREDUCE_BACKEND</code>: <code>auto</code> picks{' '}
            <code>mnnvl</code> (multi-node NVLink), which needs NVSwitch multicast, and falls back
            to <code>trtllm</code> on a single node without it{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/device_communicators/flashinfer_all_reduce.py', 'L143-L169')}
            >
              flashinfer_all_reduce.py L143-L169
            </Cite>
            . The two symmetric-memory rows are separate switches: NCCL&apos;s (row 1) stays off
            unless you set <code>VLLM_USE_NCCL_SYMM_MEM=1</code>{' '}
            <Cite
              tier={1}
              href={vllmUrl('vllm/distributed/device_communicators/pynccl_allocator.py', 'L49-L51')}
            >
              pynccl_allocator.py L49-L51
            </Cite>
            , and PyTorch&apos;s (row 7) is on.
          </Box>
          <Box variant="p">
            <strong>Check what your deployment runs.</strong> At startup every multi-rank group
            logs a line that starts <code>Using [...] all-reduce backends</code>, names the group
            (<code>&apos;tp&apos;</code> is the one that matters) and lists the backends that
            survived construction{' '}
            <Cite tier={1} href={vllmUrl(CUDA_COMM, 'L259-L333')}>
              cuda_communicator.py L259-L333
            </Cite>
            . To compare kernels, change one variable from the table and re-read that line before
            you benchmark.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The two halves every connector implements, and the registered names you can put in --kv-transfer-config"
          >
            The KV connector framework
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Experimental API: straight from the source">
            <code>KVConnectorBase_V1.__init__</code>{' '}
            <Cite tier={1} href={vllmUrl(KV_BASE, 'L203-L212')}>
              kv_connector/v1/base.py L203-L212
            </Cite>{' '}
            logs on every instantiation:{' '}
            <em>
              &quot;Initializing KVConnectorBase_V1. This API is experimental and subject to
              change in the future as we iterate the design.&quot;
            </em>{' '}
            Treat connector internals as a moving target.
          </Alert>
          <Box variant="p">
            <code>KVConnectorBase_V1</code> splits its surface into two role-tagged halves,{' '}
            <code>KVConnectorRole.SCHEDULER</code> and <code>KVConnectorRole.WORKER</code>{' '}
            <Cite tier={1} href={vllmUrl(KV_BASE, 'L137-L142')}>
              base.py L137-L142
            </Cite>
            . The factory builds a separate instance per role so the two never share state.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Scheduler-side methods</Box>
              <Box variant="p">
                Run in the scheduler process and bind metadata:{' '}
                <code>get_num_new_matched_tokens()</code> (how many remote tokens already exist),{' '}
                <code>update_state_after_alloc()</code>, <code>build_connector_meta()</code>,{' '}
                <code>request_finished()</code> (returns whether the connector takes over freeing
                the blocks asynchronously, plus the <code>kv_transfer_params</code> a proxy
                forwards), and <code>take_events()</code>{' '}
                <Cite tier={1} href={vllmUrl(KV_BASE, 'L486-L620')}>
                  base.py L486-L620
                </Cite>
                . <code>has_pending_push_work()</code> keeps the engine loop stepping while a push
                write is in flight{' '}
                <Cite tier={1} href={vllmUrl(KV_BASE, 'L626-L636')}>
                  base.py L626-L636
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Worker-side methods</Box>
              <Box variant="p">
                Run in each worker and move bytes: <code>start_load_kv()</code> /{' '}
                <code>wait_for_layer_load()</code> for async loads, <code>save_kv_layer()</code> /{' '}
                <code>wait_for_save()</code> for saves, <code>register_kv_caches()</code>{' '}
                (registers the KV buffers, with NIXL for the NIXL connectors), and{' '}
                <code>get_finished()</code> reporting which async sends and receives completed{' '}
                <Cite tier={1} href={vllmUrl(KV_BASE, 'L281-L395')}>
                  base.py L281-L395
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>The registered connectors.</strong> <code>KVConnectorFactory</code> registers
            17 names, each with a lazy loader, so only the chosen module is imported{' '}
            <Cite tier={1} href={vllmUrl(FACTORY, 'L153-L248')}>
              factory.py L153-L248
            </Cite>
            . <code>kv_connector</code> has no default: an engine started without{' '}
            <code>--kv-transfer-config</code> runs no connector{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L60')}>
              config/kv_transfer.py L60
            </Cite>
            . The production and integration connectors:
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'name', header: 'Registered name', cell: (r) => <code>{r.field}</code>, minWidth: 200 },
              { id: 'detail', header: 'What it is', cell: (r) => r.detail },
            ]}
            items={[
              { field: 'NixlConnector', detail: 'NIXL pull mode: the decoder reads the prefiller\'s blocks with NIXL READ. Alias of NixlPullConnector, which is also registered.' },
              { field: 'NixlPushConnector', detail: 'NIXL push mode: the prefiller writes into blocks the decoder allocated, with NIXL WRITE.' },
              { field: 'LMCacheConnectorV1', detail: 'Integration with LMCache for tiered KV caching and offload (also LMCacheMPConnector).' },
              { field: 'MooncakeConnector', detail: 'Mooncake transfer engine / store (also MooncakeStoreConnector).' },
              { field: 'OffloadingConnector', detail: 'vLLM\'s native KV offload; uses handle_preemptions for evicted blocks. Its tiers are covered in section 7.' },
              { field: 'HiSparseConnector', detail: 'Host-memory KV tier for DeepSeek Sparse Attention decode; experimental, requires Model Runner V2. Covered in section 7.' },
              { field: 'MultiConnector', detail: 'Composes several child connectors; HMA (hybrid memory allocator) support depends on every child supporting it.' },
            ]}
          />
          <Box variant="small">
            The other registered names: ExampleConnector, ExampleHiddenStatesConnector,
            MoRIIOConnector, FlexKVConnectorV1, SimpleCPUOffloadConnector, HF3FSKVConnector and
            DecodeBenchConnector.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Who starts the transfer, whose memory each side imports and what the proxy forwards in each of the two modes, so you can pick the connector name and the roles"
          >
            NIXL connector: pull and push
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The NIXL connector moves KV from a prefiller (P, <code>kv_producer</code>) to a decoder
            (D, <code>kv_consumer</code>) over RDMA (remote direct memory access). Both
            sides register their KV cache with NIXL at startup{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L1812-L1824')}>
              nixl/base_worker.py L1812-L1824
            </Cite>
            ; the connector name decides which side issues the transfer.{' '}
            <code>NixlConnector</code> is an alias of <code>NixlPullConnector</code>, where D
            reads; <code>NixlPushConnector</code>, available from v0.24.0, has P write into blocks
            D already allocated{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L339-L408')}>
              nixl/connector.py L339-L408
            </Cite>{' '}
            <Cite tier={1} href={`${RELEASE_NOTES}v0.24.0`}>
              vLLM v0.24.0 release notes
            </Cite>
            . The two share the handshake over a ZeroMQ (ZMQ) side channel, memory registration
            and the lease logic in <code>base_worker.py</code> (3,750 lines) and{' '}
            <code>base_scheduler.py</code>, with the mode-specific halves in <code>pull_*</code>{' '}
            and <code>push_*</code>;{' '}
            <code>worker.py</code> and <code>scheduler.py</code> are 13- and 12-line re-exports of
            the pull classes{' '}
            <Cite tier={1} href={`${TREE}/${NIXL}`}>
              nixl/ package
            </Cite>
            .
          </Box>
          <NixlTransferFlowDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured. The 30 s lease is the{' '}
            <code>kv_lease_duration</code> default cited below.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'q', header: '', cell: (r) => <strong>{r.q}</strong>, minWidth: 150 },
              { id: 'pull', header: 'Pull: NixlConnector, NixlPullConnector', cell: (r) => r.pull },
              { id: 'push', header: 'Push: NixlPushConnector', cell: (r) => r.push },
            ]}
            items={nixlModeRows}
          />
          <Box variant="small" color="text-body-secondary">
            Read from{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/pull_worker.py`, 'L552-L562')} kind="code">
              pull_worker.py L552-L562
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L714-L722')} kind="code">
              push_worker.py L714-L722
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L320-L338')} kind="code">
              push_worker.py L320-L338
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_scheduler.py`, 'L1-L23')} kind="code">
              push_scheduler.py L1-L23
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L377-L380')} kind="code">
              connector.py L377-L380
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L784-L805')} kind="code">
              base_worker.py L784-L805
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('examples/disaggregated/disaggregated_serving/disagg_proxy_pushconnector_demo.py', 'L1-L14')}
            >
              disagg_proxy_pushconnector_demo.py L1-L14
            </Cite>{' '}
            <Cite
              tier={1}
              href={vllmUrl('examples/disaggregated/disaggregated_serving/disagg_proxy_pushconnector_demo.py', 'L227-L235')}
            >
              L227-L235
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_scheduler.py`, 'L72-L75')} kind="code">
              push_scheduler.py L72-L75
            </Cite>{' '}
            <Cite tier={1} href={vllmDocsUrl('design/nixl_kv_push_connector/')}>
              vLLM docs: NIXL push-mode KV transfer
            </Cite>{' '}
            <Cite tier={1} href={vllmDocsUrl('features/nixl_connector_compatibility/')}>
              vLLM docs: NixlConnector compatibility matrix
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Run both sides in the same mode.</strong> The handshake compares a
            compatibility hash that includes the transfer mode, so a push prefiller and a pull
            decoder refuse to pair{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/metadata.py`, 'L142-L199')}>
              nixl/metadata.py L142-L199
            </Cite>
            . Set the same <code>kv_connector</code> value on every P and D instance.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Handshake (ZMQ side channel)</Box>
              <Box variant="p">
                The connecting worker opens a ZMQ <code>REQ</code> socket to the remote
                side-channel host and port and sends{' '}
                <code>(GET_META_MSG, remote_pp_rank, remote_rank)</code>. The reply is a{' '}
                <code>NixlHandshakePayload</code>: agent metadata plus the compatibility hash. A
                5-second receive timeout guards against a dead peer{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L1049-L1087')}>
                  base_worker.py L1049-L1087
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Transport backend</Box>
              <Box variant="p">
                NIXL moves the bytes through a transport backend. vLLM passes the backend list in{' '}
                <code>kv_connector_extra_config.backends</code>, and the default is{' '}
                <code>[&quot;UCX&quot;]</code> (Unified Communication X){' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L560-L562')}>
                  base_worker.py L560-L562
                </Cite>
                ; other NIXL backends are selected in the same key. Completion is polled in a
                later engine step.
              </Box>
            </div>
            <div>
              <Box variant="h3">Lease and heartbeat</Box>
              <Box variant="p">
                P holds finished blocks under a lease: <code>kv_lease_duration</code> defaults to{' '}
                <strong>30 s</strong>, and D renews it with heartbeats every{' '}
                <code>kv_lease_duration // 6</code> while the request waits in D&apos;s queue{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_scheduler.py`, 'L81-L87')}>
                  base_scheduler.py L81-L87
                </Cite>
                . When a lease lapses, P frees the blocks, logs &quot;Releasing expired KV
                blocks&quot; and increments <code>vllm:nixl_num_kv_expired_reqs</code> on the P
                instance{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L3060-L3076')}>
                  base_worker.py L3060-L3076
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/stats.py`, 'L255-L258')}>
                  stats.py L255-L258
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection headerText="When prefill and decode run different TP sizes">
            <Box variant="p">
              <code>compute_tp_mapping()</code> builds a <code>TPMapping</code> once per remote
              engine during handshake{' '}
              <Cite tier={1} href={vllmUrl(`${NIXL}/tp_mapping.py`, 'L41-L161')}>
                nixl/tp_mapping.py L41-L161
              </Cite>
              . When D-TP &gt; P-TP, several decoder ranks each read a different KV-head slice
              from one prefiller rank. When P-TP &gt; D-TP, one decoder rank reads from several
              prefiller ranks, with a GQA (grouped-query attention) dedup through{' '}
              <code>np.unique</code> so it skips ranks that hold the same KV head. MLA
              (multi-head latent attention) caches are duplicated across TP ranks, so a single
              remote rank suffices. When the remote side runs DCP &gt; 1 the sequence is sharded,
              and a decoder rank reads from every remote rank whose DCP slice overlaps its own{' '}
              <Cite tier={1} href={vllmUrl('vllm/distributed/kv_transfer/kv_connector/utils.py', 'L534-L552')}>
                kv_connector/utils.py L534-L552
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Alert type="warning" header="Set kv_producer on prefillers and kv_consumer on decoders">
            <code>NixlBaseConnector.__init__</code> warns that{' '}
            <code>kv_role=&quot;kv_both&quot;</code> is deprecated for NIXL and will be removed,
            in both modes{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L94-L100')}>
              nixl/connector.py L94-L100
            </Cite>
            . Other connectors still accept <code>kv_both</code>. A prefiller that runs prefill
            context parallel &gt; 1 must be a <code>kv_producer</code>; the constructor raises
            otherwise{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L102-L110')}>
              nixl/connector.py L102-L110
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The fields you set in --kv-transfer-config, and the NIXL knobs that live in its extra-config dict"
          >
            KVTransferConfig fields
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One dataclass, <code>KVTransferConfig</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/kv_transfer.py', 'L55-L139')}>
              config/kv_transfer.py L55-L139
            </Cite>
            , carries everything the factory and connectors need. Per-connector knobs live in the
            free-form <code>kv_connector_extra_config</code> dict and are read with{' '}
            <code>get_from_extra_config(key, default)</code>; the NIXL defaults below come from{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_scheduler.py`, 'L160-L182')}>
              nixl/base_scheduler.py L160-L182
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_scheduler.py`, 'L96-L101')}>
              nixl/push_scheduler.py L96-L101
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'field', header: 'Field', cell: (r) => <code>{r.field}</code>, minWidth: 220 },
              { id: 'type', header: 'Type', cell: (r) => <code>{r.type}</code>, minWidth: 160 },
              { id: 'detail', header: 'Meaning', cell: (r) => r.detail },
            ]}
            items={kvTransferConfigRows}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which executor runs your workers on one node and on several, and how to run multi-node without Ray"
          >
            Executor backends
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>Executor.get_class()</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/executor/abstract.py', 'L51-L96')}>
              v1/executor/abstract.py L51-L96
            </Cite>{' '}
            maps <code>distributed_executor_backend</code> to a class: <code>mp</code>,{' '}
            <code>ray</code>, <code>uni</code>, <code>external_launcher</code>, an{' '}
            <code>Executor</code> subclass or its import path. When the field is unset, the config
            fills it in{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L989-L1034')} kind="code">
              config/parallel.py L989-L1034
            </Cite>
            : <strong>&quot;mp&quot; (MultiprocExecutor)</strong> by default, including a CUDA
            run that spans nodes with <code>--nnodes</code>; <code>&quot;ray&quot;</code> only
            when <code>data_parallel_backend</code> is <code>ray</code> or the process already sits
            in a Ray placement group; <code>&quot;uni&quot;</code> for a single GPU. A world
            larger than the node&apos;s GPU count without <code>--nnodes</code> stops at startup,
            and the error names both fixes: <code>--nnodes</code> for <code>mp</code>, or{' '}
            <code>--distributed-executor-backend ray</code>.
          </Box>
          <Alert type="info" header="The parallelism guide and the code disagree on the multi-node default">
            vLLM&apos;s parallelism guide says Ray is the default runtime for multi-node inference{' '}
            <Cite
              tier={1}
              href={vllmUrl('docs/serving/parallelism_scaling.md', 'L33')}
              kind="doc-code-conflict"
            >
              vLLM docs, Parallelism and Scaling: parallelism_scaling.md L33
            </Cite>
            . The selection code picks <code>mp</code> for a CUDA run with{' '}
            <code>--nnodes</code> &gt; 1 and never auto-selects Ray for a world that outgrows one
            node{' '}
            <Cite tier={1} href={vllmUrl(PARALLEL, 'L999-L1012')} kind="code">
              config/parallel.py L999-L1012
            </Cite>
            . The code is what runs: Ray is an explicit choice.
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">MultiprocExecutor (&quot;mp&quot;)</Box>
              <Box variant="p">
                Spawns one worker process per local rank. Across nodes, start{' '}
                <code>vllm serve</code> on each node with the same <code>--nnodes</code> and{' '}
                <code>--master-addr</code>, a distinct <code>--node-rank</code>, and{' '}
                <code>--headless</code> on the non-head nodes{' '}
                <Cite tier={1} href={vllmUrl('docs/serving/parallelism_scaling.md', 'L141-L160')}>
                  parallelism_scaling.md L141-L160
                </Cite>
                . Each scheduler step goes to the workers through a shared-memory{' '}
                <code>MessageQueue</code> (<code>rpc_broadcast_mq</code>){' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/multiproc_executor.py', 'L164-L169')}>
                  multiproc_executor.py L164-L169
                </Cite>
                , which opens a ZMQ <code>XPUB</code> socket for readers on other nodes{' '}
                <Cite tier={1} href={vllmUrl('vllm/distributed/device_communicators/shm_broadcast.py', 'L530-L548')}>
                  shm_broadcast.py L530-L548
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Ray executors (&quot;ray&quot;)</Box>
              <Box variant="p">
                <code>&quot;ray&quot;</code> resolves to <code>RayExecutorV2</code> unless{' '}
                <code>VLLM_USE_RAY_V2_EXECUTOR_BACKEND=0</code>, which selects{' '}
                <code>RayDistributedExecutor</code>. The field annotation in{' '}
                <code>envs.py</code> reads <code>False</code>, but the runtime resolver is{' '}
                <code>bool(int(os.getenv(&quot;VLLM_USE_RAY_V2_EXECUTOR_BACKEND&quot;, &quot;1&quot;)))</code>
                , so V2 is the effective default{' '}
                <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L938-L940')} kind="code">
                  envs.py L938-L940
                </Cite>
                . <code>RayExecutorV2</code> subclasses <code>MultiprocExecutor</code> and keeps
                its MessageQueue path while Ray places the workers{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/executor/ray_executor_v2.py', 'L239')}>
                  ray_executor_v2.py L239
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What turns on expert rebalancing and elastic EP, and the configurations each one refuses at startup"
          >
            MoE: expert load balancing and elastic EP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                EPLB <Badge color="blue">vllm/distributed/eplb</Badge>
              </Box>
              <Box variant="p">
                EPLB records per-expert load and rearranges
                expert-to-rank placement so hot experts do not pile up on one GPU. It is off by
                default (<code>enable_eplb=False</code>) and needs{' '}
                <code>enable_expert_parallel=True</code> plus TP, PCP or DP &gt; 1 on CUDA, ROCm
                or XPU{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L533-L555')}>
                  config/parallel.py L533-L555
                </Cite>
                . Rebalancing is asynchronous by default (<code>use_async=True</code>); async
                accepts only the <code>default</code> policy (the only one defined) and refuses the{' '}
                <code>torch_nccl</code> and <code>pynccl</code> communicators. Left unset, the
                communicator is <code>torch_xccl</code> on XPU; elsewhere it is NIXL when the package
                is installed, else <code>torch_gloo</code> (<code>pynccl</code> under elastic EP). Other
                defaults: <code>window_size</code> 1000, <code>step_interval</code> 3000,{' '}
                <code>num_redundant_experts</code> 0{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L62-L120')}>
                  config/parallel.py L62-L120
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L1050-L1069')}>
                  config/parallel.py L1050-L1069
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Elastic EP <Badge color="blue">vllm/distributed/elastic_ep</Badge>
              </Box>
              <Box variant="p">
                Elastic expert parallelism lets the EP world scale up and down at runtime by
                reconfiguring the stateless DP, EP and EPLB groups; standby copies of the world,
                DP, EP and EPLB groups are created before the switch{' '}
                <Cite tier={1} href={vllmUrl('vllm/distributed/elastic_ep/standby_state.py', 'L16-L39')}>
                  elastic_ep/standby_state.py L16-L39
                </Cite>
                . It requires <code>enable_eplb=True</code>, rejects PP &gt; 1 and external or
                hybrid DP load balancing, and with async EPLB needs NIXL installed{' '}
                <Cite tier={1} href={vllmUrl(PARALLEL, 'L909-L931')}>
                  config/parallel.py L909-L931
                </Cite>
                . <code>vllm serve</code> caps <code>api_server_count</code> to 1 when it is on{' '}
                <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/serve.py', 'L136-L143')}>
                  cli/serve.py L136-L143
                </Cite>
                , and it runs on the V1 model runner, because Model Runner V2 lists it as
                unsupported{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L3051-L3098')}>
                  config/vllm.py L3051-L3098
                </Cite>{' '}
                (Execution &amp; Attention tab).
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Box variant="p">
        <strong>Where to go next.</strong> Choosing TP, PP, DP and EP sizes for a model is section
        9; deciding whether to split prefill and decode at all is section 10. How NCCL and NIXL
        reach EFA (Elastic Fabric Adapter) on AWS, and which NIXL backend to configure there, is
        section 22 and the{' '}
        <Link external href="../efa/">
          EFA deep dive
        </Link>
        .
      </Box>
    </SpaceBetween>
  );
}
