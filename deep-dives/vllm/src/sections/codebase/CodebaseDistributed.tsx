import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Badge from '@cloudscape-design/components/badge';

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
      'Name of the connector to load via KVConnectorFactory (e.g. "NixlConnector", "LMCacheConnectorV1", "MultiConnector").',
  },
  {
    field: 'kv_role',
    type: '"kv_producer" | "kv_consumer" | "kv_both"',
    detail:
      'Whether this instance produces (prefill), consumes (decode), or both. kv_both is deprecated for NIXL.',
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
      'Connector-specific knobs. NIXL reads kv_lease_duration (30), kv_recompute_threshold (64), backends (["UCX"]) from here.',
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

function ParallelGroupTopologyDiagram() {
  return (
    <svg
      viewBox="0 0 760 300"
      role="img"
      aria-labelledby="pg-topo-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="pg-topo-title">
        Parallel-group topology: 8 ranks decomposed into DP, PP, and TP groups
      </title>
      <style>
        {`
          .rk { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .rkt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .lbl { fill: #414d5c; font: 600 12px sans-serif; }
          .sub { fill: #5f6b7a; font: 11px sans-serif; }
          .tp { fill: none; stroke: #037f0c; stroke-width: 2; }
          .pp { fill: none; stroke: #8b6c00; stroke-width: 2; stroke-dasharray: 5 4; }
          .dp { fill: none; stroke: #6f4cc4; stroke-width: 2; stroke-dasharray: 2 3; }
          .leg { font: 11px sans-serif; }
        `}
      </style>

      {/* rank tiles: 2 (DP) x 2 (PP) x 2 (TP) = world size 8 */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((g) => {
        const col = g % 2; // TP index
        const ppRow = Math.floor(g / 2) % 2; // PP index
        const dpBlock = Math.floor(g / 4); // DP index
        const x = 80 + col * 130 + dpBlock * 320;
        const y = 70 + ppRow * 80;
        return (
          <g key={g}>
            <rect className="rk" x={x} y={y} width={90} height={50} rx={6} />
            <text className="rkt" x={x + 45} y={y + 30}>{`g${g}`}</text>
          </g>
        );
      })}

      {/* TP group boxes: [g0,g1] [g2,g3] [g4,g5] [g6,g7] */}
      <rect className="tp" x={72} y={62} width={236} height={66} rx={8} />
      <rect className="tp" x={72} y={142} width={236} height={66} rx={8} />
      <rect className="tp" x={392} y={62} width={236} height={66} rx={8} />
      <rect className="tp" x={392} y={142} width={236} height={66} rx={8} />

      {/* DP block labels */}
      <text className="lbl" x={80} y={48}>DP group 0 (replica)</text>
      <text className="lbl" x={400} y={48}>DP group 1 (replica)</text>

      {/* PP arrows within DP block 0: g0->g2, g1->g3 */}
      <line className="pp" x1={125} y1={120} x2={125} y2={142} markerEnd="url(#ah)" />
      <line className="pp" x1={255} y1={120} x2={255} y2={142} markerEnd="url(#ah)" />
      <line className="pp" x1={445} y1={120} x2={445} y2={142} markerEnd="url(#ah)" />
      <line className="pp" x1={575} y1={120} x2={575} y2={142} markerEnd="url(#ah)" />

      <defs>
        <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#8b6c00" />
        </marker>
      </defs>

      {/* legend */}
      <rect className="tp" x={80} y={250} width={26} height={14} rx={3} />
      <text className="leg" x={112} y={261} fill="#037f0c">TP group (intra-layer all-reduce)</text>
      <line className="pp" x1={360} y1={257} x2={386} y2={257} />
      <text className="leg" x={392} y={261} fill="#8b6c00">PP stage edge</text>
      <line className="dp" x1={520} y1={257} x2={546} y2={257} />
      <text className="leg" x={552} y={261} fill="#6f4cc4">DP replica</text>
    </svg>
  );
}

function NixlTransferFlowDiagram() {
  return (
    <svg
      viewBox="0 0 760 250"
      role="img"
      aria-labelledby="nixl-flow-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="nixl-flow-title">
        Disaggregated NIXL KV transfer: ZMQ handshake, RDMA read, lease and heartbeat
      </title>
      <style>
        {`
          .node { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .nodt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .nods { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .flow { stroke: #0972d3; stroke-width: 1.5; fill: none; }
          .rdma { stroke: #037f0c; stroke-width: 2.5; fill: none; }
          .hb { stroke: #8b6c00; stroke-width: 1.5; fill: none; stroke-dasharray: 4 3; }
          .ft { font: 11px sans-serif; }
        `}
      </style>

      {/* Prefiller (P) box */}
      <rect className="node" x={30} y={70} width={200} height={90} rx={8} />
      <text className="nodt" x={130} y={100}>Prefiller (P)</text>
      <text className="nods" x={130} y={122}>kv_role = kv_producer</text>
      <text className="nods" x={130} y={140}>holds KV blocks under lease</text>

      {/* Decoder (D) box */}
      <rect className="node" x={530} y={70} width={200} height={90} rx={8} />
      <text className="nodt" x={630} y={100}>Decoder (D)</text>
      <text className="nods" x={630} y={122}>kv_role = kv_consumer</text>
      <text className="nods" x={630} y={140}>issues RDMA read of blocks</text>

      {/* 1. ZMQ handshake (REQ -> REP), D queries P side-channel */}
      <path className="flow" d="M530,95 L230,95" markerEnd="url(#a1)" />
      <text className="ft" x={300} y={86} fill="#0972d3">
        1. ZMQ REQ/REP handshake (GET_META_MSG) over side channel
      </text>

      {/* 2. RDMA read of KV blocks P -> D */}
      <path className="rdma" d="M230,128 L530,128" markerEnd="url(#a2)" />
      <text className="ft" x={300} y={150} fill="#037f0c">
        2. NIXL/UCX async RDMA read: KV blocks P to D
      </text>

      {/* 3. lease + heartbeat */}
      <path className="hb" d="M530,160 C430,210 330,210 230,160" markerEnd="url(#a3)" />
      <text className="ft" x={300} y={205} fill="#8b6c00" textAnchor="middle">
        3. lease (~30s default) + heartbeat (lease / 6) keep P blocks alive
      </text>

      <defs>
        <marker id="a1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#0972d3" />
        </marker>
        <marker id="a2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#037f0c" />
        </marker>
        <marker id="a3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#8b6c00" />
        </marker>
      </defs>
    </svg>
  );
}

export function CodebaseDistributed() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How vLLM splits a model across ranks, picks an all-reduce backend, and streams KV cache between prefill and decode engines"
          >
            Distributed &amp; KV Transfer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What this layer does.</strong> Everything under{' '}
            <code>vllm/distributed/</code> answers two questions: how is one model
            laid out across many GPUs, and how does KV cache move between separate
            engines. The first is the parallel-group machinery ({' '}
            <code>GroupCoordinator</code> plus{' '}
            <code>initialize_model_parallel</code> in{' '}
            <code>vllm/distributed/parallel_state.py</code>) that builds the
            tensor / pipeline / data / expert process groups. The second is the KV
            connector framework under{' '}
            <code>vllm/distributed/kv_transfer/</code>, whose production member is
            the NIXL connector that powers disaggregated prefill / decode serving.
          </Box>
          <Box variant="p">
            <strong>Why it is two stories.</strong> Parallelism is{' '}
            <em>within</em> one engine: ranks of the same model cooperating on
            every forward pass over fast collectives. KV transfer is{' '}
            <em>between</em> engines: a prefiller fills the cache, a decoder reads
            it over the network, and the two never share a process group. On AWS
            both kinds of traffic ultimately ride EFA. The AWS sections of this
            deep dive cover that data path; here we stay in the vLLM source.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="GroupCoordinator and initialize_model_parallel build the TP / PP / DP / EP / PCP / DCP groups"
          >
            Parallel-group topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>initialize_model_parallel(...)</code> (parallel_state.py:1674)
            takes the world size and reshapes <code>torch.arange(world_size)</code>{' '}
            into a 5-D rank grid whose layout order is{' '}
            <strong>ExternalDP x DP x PP x PCP x TP</strong>. It then slices that
            grid along each axis to produce the group rank-lists and wraps each one
            in a <code>GroupCoordinator</code>. The docstring&apos;s worked example:
            8 GPUs with TP=2, PP=4 yields four TP groups{' '}
            <code>[g0,g1] [g2,g3] [g4,g5] [g6,g7]</code> and two PP groups{' '}
            <code>[g0,g2,g4,g6] [g1,g3,g5,g7]</code>. The diagram below shows a
            DP=2, PP=2, TP=2 decomposition of the same 8 ranks.
          </Box>
          <ParallelGroupTopologyDiagram />
          <Box variant="p">
            <strong>GroupCoordinator</strong> (parallel_state.py:351) is a wrapper
            around a PyTorch <code>ProcessGroup</code>. Each instance owns both a{' '}
            <code>device_group</code> (NCCL for GPU collectives) and a parallel{' '}
            <code>cpu_group</code> (Gloo) for direct CPU-side coordination, tracks
            its <code>rank_in_group</code> versus global <code>rank</code>, and
            lazily attaches a <code>device_communicator</code> chosen by the
            platform. The module keeps one global per axis ({' '}
            <code>_TP, _PP, _DP, _EP, _PCP, _DCP</code>), each with a{' '}
            <code>get_*_group()</code> accessor.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">TP / PP (_TP, _PP)</Box>
              <Box variant="p">
                Tensor parallel shards each layer across ranks (frequent
                per-layer all-reduce); pipeline parallel splits the layer stack
                into stages connected by point-to-point sends. Both are built
                unconditionally; <code>model_parallel_is_initialized()</code>{' '}
                checks <code>_TP</code> and <code>_PP</code> are set.
              </Box>
            </div>
            <div>
              <Box variant="h3">DP / EP (_DP, _EP)</Box>
              <Box variant="p">
                Data parallel replicates the model; expert parallel spreads MoE
                experts across ranks. When <code>enable_elastic_ep</code> is set,{' '}
                <code>_DP</code> and <code>_EP</code> are built as stateless
                groups so ranks can join and leave without rebuilding the world.
              </Box>
            </div>
            <div>
              <Box variant="h3">PCP / DCP (_PCP, _DCP)</Box>
              <Box variant="p">
                Prefill- and decode-context parallel split a single sequence&apos;s
                context across ranks. They are newer axes in the grid (PCP sits
                between PP and TP in the layout order) and default to size 1 when
                unused.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Device communicators under device_communicators/ choose the all-reduce backend per platform"
          >
            Device communicators and the all-reduce backend
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A <code>GroupCoordinator</code> does not call NCCL directly. It
            resolves a platform-specific{' '}
            <code>DeviceCommunicatorBase</code> subclass from{' '}
            <code>vllm/distributed/device_communicators/</code>:{' '}
            <code>CudaCommunicator</code>,{' '}
            <code>CpuCommunicator</code>,{' '}
            <code>XpuCommunicator</code>, or the Ray variant. On CUDA, the
            communicator constructs up to four specialized all-reduce paths and
            then dispatches each call to the first one whose size / topology
            heuristic accepts the tensor.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The CUDA dispatch order</Box>
              <Box variant="p">
                <code>CudaCommunicator.all_reduce</code> tries, in order: NCCL
                symmetric-memory all-reduce, <code>QuickAllReduce</code>,
                FlashInfer all-reduce, <code>CustomAllreduce</code> (one-shot /
                two-shot for small tensors), <code>SymmMemCommunicator</code>, and
                finally falls back to <code>PyNcclCommunicator</code> for anything
                the fast paths decline.
              </Box>
            </div>
            <div>
              <Box variant="h3">Why several backends</Box>
              <Box variant="p">
                Custom and quick all-reduce beat NCCL for the small, latency-bound
                all-reduce that dominates TP decode; NCCL wins for large
                bandwidth-bound reductions. The communicator keeps each one
                optional (<code>None</code> when disabled) and selects per call,
                so a single deployment uses different kernels at different message
                sizes.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="KVConnectorBase_V1 splits scheduler-side from worker-side; the factory registers the connector zoo"
          >
            The KV connector framework
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Experimental API: straight from the source">
            <code>KVConnectorBase_V1.__init__</code>{' '}
            (kv_transfer/kv_connector/v1/base.py:190) logs on every
            instantiation:{' '}
            <em>
              &quot;Initializing KVConnectorBase_V1. This API is experimental and
              subject to change in the future as we iterate the design.&quot;
            </em>{' '}
            Treat connector internals as a moving target.
          </Alert>
          <Box variant="p">
            <code>KVConnectorBase_V1</code> deliberately splits its surface into
            two role-tagged halves, enforced by{' '}
            <code>KVConnectorRole.SCHEDULER</code> versus{' '}
            <code>KVConnectorRole.WORKER</code>. The factory builds a separate
            instance per role so the two never share state.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Scheduler-side methods</Box>
              <Box variant="p">
                Run in the scheduler process and bind metadata:{' '}
                <code>get_num_new_matched_tokens()</code> (how many remote tokens
                already exist),{' '}
                <code>update_state_after_alloc()</code>,{' '}
                <code>build_connector_meta()</code>,{' '}
                <code>request_finished()</code> (returns whether the connector now
                owns freeing the blocks asynchronously), and{' '}
                <code>take_events()</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">Worker-side methods</Box>
              <Box variant="p">
                Run in each worker and move bytes:{' '}
                <code>start_load_kv()</code> /{' '}
                <code>wait_for_layer_load()</code> for async loads,{' '}
                <code>save_kv_layer()</code> /{' '}
                <code>wait_for_save()</code> for saves,{' '}
                <code>register_kv_caches()</code> (pre-register buffers for NIXL),
                and <code>get_finished()</code> reporting which async sends /
                recvs completed.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>The connector zoo.</strong>{' '}
            <code>KVConnectorFactory</code> (factory.py) registers connectors by
            name with a lazy loader, so only the chosen module is imported. The
            registered V1 production / integration connectors:
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'name', header: 'Registered name', cell: (r) => <code>{r.field}</code>, minWidth: 200 },
              { id: 'detail', header: 'What it is', cell: (r) => r.detail },
            ]}
            items={[
              { field: 'NixlConnector', type: '', detail: 'Production prefill/decode connector: ZMQ handshake + NIXL/UCX RDMA read. Default for disaggregation.' },
              { field: 'P2pNcclConnector', type: '', detail: 'Point-to-point KV transfer over NCCL; expects kv_parallel_size = 2.' },
              { field: 'LMCacheConnectorV1', type: '', detail: 'Integration with LMCache for tiered KV caching and offload (also LMCacheMPConnector).' },
              { field: 'MooncakeConnector', type: '', detail: 'Mooncake transfer engine / store (also MooncakeStoreConnector).' },
              { field: 'OffloadingConnector', type: '', detail: 'Async CPU / host offload of KV; uses handle_preemptions for evicted blocks.' },
              { field: 'MultiConnector', type: '', detail: 'Composes several child connectors; HMA support depends on every child supporting it.' },
            ]}
          />
          <Box variant="small">
            Other registered names in factory.py include ExampleConnector,
            MoRIIOConnector, FlexKVConnectorV1, SimpleCPUOffloadConnector,
            HF3FSKVConnector, and DecodeBenchConnector.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The production prefill/decode connector: side-channel handshake, async RDMA read, block lease + heartbeat"
          >
            NixlConnector: the disaggregation data path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>NixlConnector</code>{' '}
            (kv_transfer/kv_connector/v1/nixl/) is split across{' '}
            <code>connector.py</code> (the role dispatcher),{' '}
            <code>scheduler.py</code> (lease / heartbeat bookkeeping), and a
            ~2,500-line <code>worker.py</code> (the actual transfers). The decoder
            pulls KV from the prefiller; the prefiller never pushes.
          </Box>
          <NixlTransferFlowDiagram />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">1. Handshake (ZMQ side channel)</Box>
              <Box variant="p">
                The decoder worker opens a <code>zmq.REQ</code> socket to the
                prefiller&apos;s side-channel host/port and sends{' '}
                <code>(GET_META_MSG, remote_rank)</code> (worker.py:504). The
                prefiller replies with a <code>NixlHandshakePayload</code>:
                agent metadata plus a compatibility hash. A 5-second recv timeout
                guards against a dead peer.
              </Box>
            </div>
            <div>
              <Box variant="h3">2. RDMA read (NIXL / UCX)</Box>
              <Box variant="p">
                The worker calls{' '}
                <code>nixl_wrapper.make_prepped_xfer(&quot;READ&quot;, ...)</code>{' '}
                then <code>transfer(handle)</code> (worker.py:2220) for a
                non-blocking RDMA read of the remote KV blocks. The NIXL backend
                defaults to <code>[&quot;UCX&quot;]</code>; UCX in turn drives
                RDMA over the underlying fabric (libfabric / EFA on AWS).
                Completion is polled in a later <code>step()</code>.
              </Box>
            </div>
            <div>
              <Box variant="h3">3. Lease + heartbeat</Box>
              <Box variant="p">
                Prefiller blocks are held under a lease:{' '}
                <code>kv_lease_duration</code> defaults to{' '}
                <strong>30s</strong> (scheduler.py:70). The decoder sends periodic
                heartbeats at <code>kv_lease_duration // 6</code> to renew it; if
                they stop, the prefiller frees the blocks and increments{' '}
                <code>vllm:nixl_num_kv_expired_reqs</code>.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>TP-heterogeneous transfer.</strong> Prefill and decode need
            not run the same tensor-parallel degree.{' '}
            <code>compute_tp_mapping()</code> (nixl/tp_mapping.py) builds a{' '}
            <code>TPMapping</code> once per remote engine during handshake: when
            D-TP &gt; P-TP, several decoder ranks each read a different KV-head
            slice from one prefiller rank; when P-TP &gt; D-TP, one decoder rank
            reads from several prefiller ranks, with a GQA dedup (via{' '}
            <code>np.unique</code>) so it does not issue redundant reads for ranks
            that hold the same KV head. MLA caches are duplicated, so a single
            remote rank suffices.
          </Box>
          <Alert type="info" header="A READ-side staging caveat, verbatim from worker.py">
            A <code>NOTE(rob)</code> at worker.py:2153 records a real design
            constraint:{' '}
            <em>
              &quot;having the staging blocks be on the READER side is not going
              to work well ... If we want to make &apos;READ&apos; happen cleanly,
              then we will need to have the staging blocks on the remote side.&quot;
            </em>{' '}
            Per the same comment, NVIDIA&apos;s guidance is that staging blocks
            exist to saturate the fabric under heterogeneous TP sizes.
          </Alert>
          <Alert type="warning" header="kv_role=&quot;kv_both&quot; is deprecated for NIXL">
            <code>NixlConnector.__init__</code> (connector.py:98) warns that{' '}
            <code>kv_role=&quot;kv_both&quot;</code> is deprecated and will be
            removed: set <code>kv_role=&quot;kv_producer&quot;</code> on prefill
            instances and <code>kv_role=&quot;kv_consumer&quot;</code> on decode
            instances instead.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="KVTransferConfig is the single dataclass that wires a connector into an engine"
          >
            KVTransferConfig fields
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One dataclass ({' '}
            <code>KVTransferConfig</code> in{' '}
            <code>vllm/config/kv_transfer.py</code>) carries everything the
            factory and connectors need. Per-connector knobs live inside the
            free-form <code>kv_connector_extra_config</code> dict and are read via{' '}
            <code>get_from_extra_config(key, default)</code>.
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
            description="MultiprocExecutor and the Ray executors orchestrate the worker ranks"
          >
            Executor backends
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>Executor.get_class()</code>{' '}
            (vllm/v1/executor/abstract.py:47) maps the{' '}
            <code>distributed_executor_backend</code> string to a concrete class.
            When the config leaves it unset and the world fits on one node, the
            default is <strong>&quot;mp&quot; (MultiprocExecutor)</strong>; it
            becomes <code>&quot;ray&quot;</code> when a Ray placement group is
            present, and <code>&quot;uni&quot;</code> for single-GPU.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">MultiprocExecutor (&quot;mp&quot;)</Box>
              <Box variant="p">
                Spawns one worker process per rank on the local node. It
                broadcasts each scheduler step to all workers through a shared-
                memory <code>MessageQueue</code> (<code>rpc_broadcast_mq</code>,
                multiproc_executor.py:151) and collects results over per-worker
                response queues. No external orchestrator, ideal for
                single-node TP / PP.
              </Box>
            </div>
            <div>
              <Box variant="h3">Ray executors (&quot;ray&quot;)</Box>
              <Box variant="p">
                For multi-node, <code>&quot;ray&quot;</code> resolves to{' '}
                <code>RayExecutorV2</code> by default and to{' '}
                <code>RayDistributedExecutor</code> only when{' '}
                <code>VLLM_USE_RAY_V2_EXECUTOR_BACKEND</code> is explicitly 0.
                The field annotation in <code>envs.py</code> reads{' '}
                <code>False</code>, but the runtime resolver is{' '}
                <code>bool(int(os.getenv(&quot;VLLM_USE_RAY_V2_EXECUTOR_BACKEND&quot;, &quot;1&quot;)))</code>,{' '}
                so V2 is the effective default.{' '}
                <code>RayExecutorV2</code> subclasses{' '}
                <code>MultiprocExecutor</code> and reuses its MessageQueue path
                while placing workers across the Ray cluster.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="EPLB and elastic-EP keep MoE expert placement balanced and resizable"
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
                The Expert Parallelism Load Balancer (eplb_state.py) tracks
                per-expert load and rebalances expert-to-rank placement so hot
                experts do not pile up on one GPU. Gated by{' '}
                <code>enable_eplb</code> (default <code>False</code>) in the
                parallel config, with pluggable policies under{' '}
                <code>eplb/policy</code> and an async rebalance executor.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Elastic EP <Badge color="blue">vllm/distributed/elastic_ep</Badge>
              </Box>
              <Box variant="p">
                Elastic expert parallelism (elastic_state.py) lets the EP world
                scale up and down at runtime by reconfiguring distributed groups
                and pre-creating standby groups. It requires{' '}
                <code>enable_eplb=True</code> (the config raises if{' '}
                <code>enable_elastic_ep</code> is set without it) and is what
                drives the stateless <code>_DP</code> / <code>_EP</code> group
                path in <code>initialize_model_parallel</code>.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="How this maps onto AWS networking (cross-reference)">
        <SpaceBetween size="s">
          <Box variant="p">
            Two distinct traffic classes leave this layer. <strong>Collectives</strong>{' '}
            (TP all-reduce, PP sends, DP/EP all-to-all) flow through the device
            communicators over NCCL; <strong>KV transfer</strong> flows through
            the NIXL connector over NIXL/UCX. On AWS both ride EFA (Elastic Fabric
            Adapter): NCCL via the aws-ofi-nccl plugin and libfabric, and NIXL via
            UCX over libfabric. The AWS GPU / EFA / NIXL section of this deep dive
            covers the EFA data path, SRD transport, and topology-aware placement
            that make these transfers fast. This section stays inside the vLLM
            source that issues them.
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
