import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl } from '../components/Cite';

/** Dynamo v1.5.1 (commit 2093662a4d4e5fd318732935213dde08dc7be818), the newest stable release. */
const DY = 'https://github.com/ai-dynamo/dynamo/blob/v1.5.1';
const DY_README = `${DY}/README.md`;
const DY_ARGS = `${DY}/components/src/dynamo/vllm/args.py`;
const DY_VLLM_DOC = `${DY}/docs/fern/pages/reference/backends/vllm-configuration.mdx`;
const BLOG_INTRO =
  'https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/';
const BLOG_LLMD =
  'https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/';
const LLMD_RELEASE = 'https://github.com/llm-d/llm-d/releases/tag/v0.10.0';
const NIXL_DIR = 'vllm/distributed/kv_transfer/kv_connector';

interface CapabilityRow {
  capability: string;
  engineHas: ReactNode;
  dynamoAdds: ReactNode;
}

const capabilityRows: CapabilityRow[] = [
  {
    capability: 'Disaggregated prefill / decode',
    engineHas:
      'A vLLM instance runs as a prefiller or a decoder and moves KV over a connector (section 10). Running the two pools as one service is left to the layer above.',
    dynamoAdds: (
      <>
        Disaggregated Prefill/Decode: it "separates prefill and decode into independently
        scalable GPU pools"{' '}
        <Cite tier={1} href={`${DY_README}#L100`}>
          Dynamo README L100
        </Cite>
        .
      </>
    ),
  },
  {
    capability: 'Request routing',
    engineHas:
      'One engine schedules its own continuous batches. Choosing a replica is left to whatever sits in front (Production-Stack router, a Gateway API gateway, llm-d).',
    dynamoAdds: (
      <>
        The KV-Aware Router "routes requests based on worker load and KV cache overlap"{' '}
        <Cite tier={1} href={`${DY_README}#L101`}>
          Dynamo README L101
        </Cite>
        . When workers publish them, it learns what each worker holds from vLLM&apos;s KV-cache
        events, sent over ZMQ{' '}
        <Cite tier={1} href={`${DY_ARGS}#L347-L354`} kind="code">
          dynamo args.py L347-L354
        </Cite>{' '}
        <Cite tier={1} href={vllmUrl('vllm/config/kv_events.py', 'L10-L25')}>
          kv_events.py L10-L25
        </Cite>
        .
      </>
    ),
  },
  {
    capability: 'KV cache below GPU memory',
    engineHas: (
      <>
        Per-engine paged KV cache, plus vLLM&apos;s own tiered OffloadingConnector (CPU, then
        disk, object store or peer tiers) or LMCache (sections 5 and 7){' '}
        <Cite tier={1} href={vllmUrl('vllm/v1/kv_offload/tiering/factory.py', 'L146-L174')}>
          tiering/factory.py L146-L174
        </Cite>
        .
      </>
    ),
    dynamoAdds: (
      <>
        KVBM (KV Block Manager) offloads KV from GPU to CPU, SSD and remote storage{' '}
        <Cite tier={1} href={`${DY_README}#L102`}>
          Dynamo README L102
        </Cite>
        . It attaches to vLLM as a KV connector, <code>DynamoConnector</code>, a{' '}
        <code>KVConnectorBase_V1</code> subclass{' '}
        <Cite
          tier={1}
          href={`${DY}/lib/bindings/kvbm/python/kvbm/vllm_integration/connector/dynamo_connector.py#L44`}
          kind="code"
        >
          kvbm dynamo_connector.py L44
        </Cite>
        .
      </>
    ),
  },
  {
    capability: 'GPU allocation and autoscaling',
    engineHas: 'None at fleet level: one engine sees only its own GPUs and its own queue.',
    dynamoAdds: (
      <>
        The SLA Planner, an "SLA-driven autoscaler that profiles workloads and right-sizes
        pools"{' '}
        <Cite tier={1} href={`${DY_README}#L104`}>
          Dynamo README L104
        </Cite>
        .
      </>
    ),
  },
  {
    capability: 'KV transport',
    engineHas:
      'NixlConnector moves KV between a prefiller and a decoder over NIXL, in pull or push mode (section 10).',
    dynamoAdds: (
      <>
        The same NIXL library across the fleet: <code>ai-dynamo[vllm]</code> 1.5.1 installs{' '}
        <code>nixl[cu13]</code> 1.3.2{' '}
        <Cite tier={1} href={`${DY}/pyproject.toml#L61-L64`}>
          dynamo pyproject.toml L61-L64
        </Cite>
        .
      </>
    ),
  },
];

function DynamoDiagram() {
  return (
    <svg
      viewBox="0 0 860 480"
      role="img"
      aria-labelledby="dynamo-title"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
    >
      <title id="dynamo-title">
        NVIDIA Dynamo v1.5.1 over a fleet of vLLM workers. The Dynamo layer holds the KV-Aware
        Router, the SLA Planner and KVBM, the KV Block Manager, and routes requests to a pool of
        prefill workers and a pool of decode workers. Prefill workers publish KV-cache events over
        ZeroMQ back to the router, and KV blocks move from prefill to decode workers over NIXL.
        Each worker&apos;s phase comes from --disaggregation-mode and its KV role from the
        --kv-transfer-config you pass.
      </title>
      <style>
        {`
          .dyn-bg { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .dyn-layer { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .dyn-comp { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .dyn-pre { fill: #f2f8fd; stroke: #065299; stroke-width: 1.5; }
          .dyn-dec { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .dyn-eng { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .dyn-nixl { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .dyn-tt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .dyn-ts { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .dyn-bt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .dyn-bs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .dyn-pt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .dyn-ps { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dyn-et { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .dyn-lbl { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .dyn-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dyn-al { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
          .dyn-evl { fill: #1f7a70; font: 600 11px sans-serif; text-anchor: start; }
          .dyn-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#dyn-ah); }
          .dyn-ev { stroke: #1f7a70; stroke-width: 2; fill: none; stroke-dasharray: 5 4; marker-end: url(#dyn-ah-ev); }
          .dyn-nx { stroke: #8b6c00; stroke-width: 2; fill: none; marker-end: url(#dyn-ah-nx); }
        `}
      </style>
      <defs>
        <marker id="dyn-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="dyn-ah-ev" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#1f7a70" />
        </marker>
        <marker id="dyn-ah-nx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
        </marker>
      </defs>

      <rect className="dyn-bg" x={0.5} y={0.5} width={859} height={479} rx={8} />

      <text className="dyn-lbl" x={430} y={24}>Requests in, tokens out</text>
      <path className="dyn-arr" d="M430,32 L430,54" />

      {/* Dynamo layer */}
      <rect className="dyn-layer" x={30} y={58} width={800} height={142} rx={10} />
      <text className="dyn-tt" x={430} y={82}>NVIDIA Dynamo v1.5.1</text>
      <rect className="dyn-comp" x={50} y={94} width={240} height={62} rx={6} />
      <text className="dyn-bt" x={170} y={119}>KV-Aware Router</text>
      <text className="dyn-bs" x={170} y={139}>routes by load and KV overlap</text>
      <rect className="dyn-comp" x={310} y={94} width={240} height={62} rx={6} />
      <text className="dyn-bt" x={430} y={119}>SLA Planner</text>
      <text className="dyn-bs" x={430} y={139}>sizes prefill and decode pools</text>
      <rect className="dyn-comp" x={570} y={94} width={240} height={62} rx={6} />
      <text className="dyn-bt" x={690} y={119}>KVBM (KV Block Manager)</text>
      <text className="dyn-bs" x={690} y={139}>GPU, CPU, SSD, remote storage</text>
      <text className="dyn-ts" x={430} y={182}>
        Also in the stack: ModelExpress (weights over NIXL) and Grove (Kubernetes gang scheduling)
      </text>

      {/* Corridor: routing down, KV events up */}
      <path className="dyn-arr" d="M110,202 L110,246" />
      <text className="dyn-al" x={122} y={229}>route</text>
      <path className="dyn-ev" d="M250,248 L250,204" />
      <text className="dyn-evl" x={262} y={229}>KV events (ZMQ)</text>
      <path className="dyn-arr" d="M675,202 L675,246" />
      <text className="dyn-al" x={687} y={229}>route</text>

      {/* Prefill pool */}
      <rect className="dyn-pre" x={30} y={250} width={310} height={168} rx={8} />
      <text className="dyn-pt" x={185} y={274}>Prefill workers</text>
      <text className="dyn-ps" x={185} y={293}>--disaggregation-mode prefill</text>
      <text className="dyn-ps" x={185} y={310}>kv_role: kv_producer</text>
      <rect className="dyn-eng" x={50} y={324} width={125} height={78} rx={6} />
      <text className="dyn-et" x={112.5} y={358}>vLLM engine</text>
      <text className="dyn-ps" x={112.5} y={376}>paged KV cache</text>
      <rect className="dyn-eng" x={195} y={324} width={125} height={78} rx={6} />
      <text className="dyn-et" x={257.5} y={358}>vLLM engine</text>
      <text className="dyn-ps" x={257.5} y={376}>paged KV cache</text>

      {/* Decode pool */}
      <rect className="dyn-dec" x={520} y={250} width={310} height={168} rx={8} />
      <text className="dyn-pt" x={675} y={274}>Decode workers</text>
      <text className="dyn-ps" x={675} y={293}>--disaggregation-mode decode</text>
      <text className="dyn-ps" x={675} y={310}>kv_role: kv_consumer</text>
      <rect className="dyn-eng" x={540} y={324} width={125} height={78} rx={6} />
      <text className="dyn-et" x={602.5} y={358}>vLLM engine</text>
      <text className="dyn-ps" x={602.5} y={376}>paged KV cache</text>
      <rect className="dyn-eng" x={685} y={324} width={125} height={78} rx={6} />
      <text className="dyn-et" x={747.5} y={358}>vLLM engine</text>
      <text className="dyn-ps" x={747.5} y={376}>paged KV cache</text>

      {/* NIXL between the pools */}
      <rect className="dyn-nixl" x={370} y={322} width={120} height={80} rx={8} />
      <text className="dyn-pt" x={430} y={350}>NIXL</text>
      <text className="dyn-ps" x={430} y={368}>KV blocks</text>
      <text className="dyn-ps" x={430} y={385}>UCX by default</text>
      <path className="dyn-nx" d="M322,362 L368,362" />
      <path className="dyn-nx" d="M490,362 L538,362" />

      <text className="dyn-lbl" x={430} y={448}>
        vLLM stays the engine. Dynamo routes, plans and tiers KV across the fleet
      </text>
      <text className="dyn-sub" x={430} y={468}>
        Phase from --disaggregation-mode, KV role from the --kv-transfer-config you pass
      </text>
    </svg>
  );
}

export function NvidiaDynamo() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Dynamo operates a fleet of vLLM engines as one disaggregated, KV-aware service: what it adds above the engine, the three settings each vLLM worker needs, and the vLLM version you get with it (verified against vLLM v0.31.0, commit db9527a4, and Dynamo v1.5.1, 2026-10-16)"
          >
            18. NVIDIA Dynamo &amp; the Ecosystem
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="The one thing to get right: the engine runs the model, Dynamo runs the fleet">
            Dynamo is a serving framework one layer above the engine. It operates many engines as
            one service, and vLLM is one of its three backends, next to SGLang and TensorRT-LLM.
            The project calls itself <em>&quot;the open-source, datacenter-scale inference
            stack&quot;</em> and <em>&quot;the orchestration layer above inference engines&quot;</em>{' '}
            that <em>&quot;doesn&apos;t replace SGLang, TensorRT-LLM, or vLLM, it turns them into a
            coordinated multi-node inference system&quot;</em>{' '}
            <Cite tier={1} href={`${DY_README}#L36`}>
              Dynamo README L36
            </Cite>
            , under the Apache-2.0 license{' '}
            <Cite tier={1} href={`${DY_README}#L20`}>
              README L20
            </Cite>
            . If you already run vLLM, adopting Dynamo keeps vLLM as the engine and changes how the
            fleet around it is run.
          </Alert>
          <Box variant="p">
            Sections 9 and 10 leave you with a fleet of vLLM engines and three questions a single
            engine cannot answer. <em>Which</em> replica should serve this request, so it lands
            where the prompt&apos;s KV already lives? When you disaggregate, <em>what</em> runs the
            prefill and decode pools as one service and sizes each pool to load? And where do{' '}
            <em>cold</em> KV blocks go when GPU memory fills across the cluster? These are
            serving-framework questions, and Dynamo answers each with a named component.
          </Box>
          <Box variant="p">
            NVIDIA launched Dynamo at GTC (GPU Technology Conference) 2025 as{' '}
            <em>
              &quot;a high-throughput, low-latency open-source inference serving framework for
              deploying generative AI and reasoning models in large-scale distributed
              environments&quot;
            </em>{' '}
            <Cite tier={2} href={BLOG_INTRO}>
              NVIDIA blog: Introducing NVIDIA Dynamo
            </Cite>
            . At v1.5.1 its core capabilities include <strong>Disaggregated Prefill/Decode</strong>,{' '}
            <strong>KV-Aware Routing</strong>, <strong>KVBM</strong> (KV Block Manager),{' '}
            <strong>ModelExpress</strong>, the <strong>SLA Planner</strong> (SLA:
            service-level agreement) and <strong>Grove</strong>{' '}
            <Cite tier={1} href={`${DY_README}#L100-L105`}>
              Dynamo README L100-L105
            </Cite>
            . Between vLLM workers, KV moves over <strong>NIXL</strong> (NVIDIA Inference Transfer
            Library) through vLLM&apos;s own <code>NixlConnector</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read it top-down to see which parts are Dynamo, which are ordinary vLLM engines, and which wires between them you configure yourself"
          >
            The shape: Dynamo over a fleet of vLLM workers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Requests reach the <strong>Dynamo layer</strong>. Its <strong>KV-Aware Router</strong>{' '}
            picks a worker by load and KV-cache overlap, the <strong>SLA Planner</strong> sizes the
            pools, and <strong>KVBM</strong> manages KV below GPU memory. Underneath sit two pools
            of <em>ordinary vLLM engines</em>, the disaggregated topology of section 10. A prefill
            worker&apos;s KV reaches a decode worker over <strong>NIXL</strong>, on its UCX
            (Unified Communication X) backend by default, and prefill workers publish KV-cache
            events over ZeroMQ (ZMQ) back to the router so it knows which worker holds which
            prefix.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <DynamoDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The labels on the worker pools and the dashed KV-events
            path are settings you pass to each vLLM worker: a worker publishes KV events only when
            you enable them, and Dynamo assigns no KV role. See &quot;Wiring vLLM workers into
            Dynamo&quot; at the end of this section.
          </Box>
          <Alert type="info">
            The transport between the pools is vLLM&apos;s own. <code>NixlConnector</code>, its
            pull and push modes, and the <code>KVConnectorBase_V1</code> contract are covered in{' '}
            <strong>section 10 (Disaggregated Prefill / Decode)</strong> and{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>. Dynamo runs
            that same transport across the fleet.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For each fleet-level concern, what one vLLM engine already gives you and what Dynamo adds, so you can tell which gap you are actually paying to close"
          >
            What Dynamo provides on top of the engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Take each serving concern, ask what one vLLM engine already does, then ask what Dynamo
            adds across the fleet. Dynamo never owns the forward pass: vLLM keeps its paged KV
            cache, continuous batching, prefix caching, quantization and LoRA (low-rank adaptation)
            adapters exactly as the earlier
            sections describe. That is why the same components also run over SGLang and
            TensorRT-LLM, with KVBM still marked in progress for SGLang{' '}
            <Cite tier={1} href={`${DY_README}#L64-L69`}>
              Dynamo README L64-L69
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'capability',
                header: 'Capability',
                cell: (r) => <strong>{r.capability}</strong>,
                minWidth: 160,
              },
              {
                id: 'engineHas',
                header: 'What the engine (vLLM) already does',
                cell: (r) => r.engineHas,
                minWidth: 280,
              },
              {
                id: 'dynamoAdds',
                header: 'What Dynamo adds on top',
                cell: (r) => r.dynamoAdds,
                minWidth: 300,
              },
            ]}
            items={capabilityRows}
          />
          <Box variant="p">
            Two more components sit outside the request path. <strong>ModelExpress</strong>{' '}
            streams model weights GPU-to-GPU over NIXL or NVLink to start new replicas, and{' '}
            <strong>Grove</strong> is a Kubernetes operator for topology-aware gang scheduling{' '}
            <Cite tier={1} href={`${DY_README}#L103-L105`}>
              Dynamo README L103-L105
            </Cite>
            . vLLM&apos;s own cold-start options are in section 27.
          </Box>
          <ExpandableSection headerText="The 2025 names you will meet in NVIDIA's launch material">
            <Box variant="p">
              NVIDIA&apos;s launch blog names three of these components differently: the{' '}
              <strong>Smart Router</strong> (now the KV-Aware Router) &quot;tracks KV cache across
              large fleets of GPUs in multinode and disaggregated deployments, and efficiently routes
              incoming requests&quot;; the <strong>Distributed KV Cache Manager</strong> (now KVBM)
              offloads &quot;older or less frequently accessed KV cache blocks to more cost-effective
              memory and storage solutions&quot;; and the <strong>Planner</strong>{' '}
              &quot;continuously monitors key GPU capacity metrics&quot; to allocate GPUs between
              prefill and decode. Disaggregated Serving &quot;separates the prefill and decode
              phases onto different GPUs or nodes&quot;{' '}
              <Cite tier={2} href={BLOG_INTRO}>
                NVIDIA blog: Introducing NVIDIA Dynamo
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One transfer library at three scopes, so disaggregation you set up at the engine carries over when you add a fleet layer"
          >
            NIXL: the shared substrate
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NIXL is shared across this whole layer. NVIDIA describes it as{' '}
            <em>
              &quot;a high-throughput, low-latency point-to-point communication library that provides
              a consistent data movement API to move data rapidly and asynchronously across different
              tiers of memory and storage&quot;
            </em>{' '}
            <Cite tier={2} href={BLOG_INTRO}>
              NVIDIA blog: Introducing NVIDIA Dynamo
            </Cite>
            . It is the library vLLM&apos;s <code>NixlConnector</code> uses for disaggregated KV
            transfer, so the same transport shows up at three scopes.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">In vLLM (the engine)</Box>
              <Box variant="p">
                <code>NixlConnector</code> is an alias of <code>NixlPullConnector</code>, with{' '}
                <code>NixlPushConnector</code> registered alongside{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL_DIR}/v1/nixl/connector.py`, 'L407-L408')} kind="code">
                  nixl/connector.py L407-L408
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL_DIR}/factory.py`, 'L176-L192')}>
                  factory.py L176-L192
                </Cite>
                . In pull mode the decoder reads KV from the prefiller{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL_DIR}/v1/nixl/pull_worker.py`, 'L552-L559')} kind="code">
                  pull_worker.py L552-L559
                </Cite>
                ; in push mode the prefiller writes it{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL_DIR}/v1/nixl/push_worker.py`, 'L714-L721')} kind="code">
                  push_worker.py L714-L721
                </Cite>
                . UCX is the default NIXL backend; others, such as LIBFABRIC for EFA
                (Elastic Fabric Adapter) on AWS, are set in{' '}
                <code>kv_connector_extra_config.backends</code>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL_DIR}/v1/nixl/base_worker.py`, 'L559-L561')} kind="code">
                  nixl/base_worker.py L559-L561
                </Cite>
                . Section 10 walks both modes.
              </Box>
            </div>
            <div>
              <Box variant="h3">In Dynamo (the fleet)</Box>
              <Box variant="p">
                NIXL carries KV between Dynamo&apos;s prefill and decode workers through the vLLM
                connector you configure, and ModelExpress streams weights over it{' '}
                <Cite tier={1} href={`${DY_README}#L103`}>
                  Dynamo README L103
                </Cite>
                . <code>ai-dynamo[vllm]</code> 1.5.1 installs <code>nixl[cu13]</code> 1.3.2{' '}
                <Cite tier={1} href={`${DY}/pyproject.toml#L61-L64`}>
                  pyproject.toml L61-L64
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">In llm-d (the ecosystem)</Box>
              <Box variant="p">
                <em>
                  &quot;llm-d relies on NIXL to accelerate the KV cache data transfer between
                  prefill and decode in disaggregated serving setups&quot;
                </em>{' '}
                <Cite tier={2} href={BLOG_LLMD}>
                  NVIDIA blog: Dynamo accelerates llm-d
                </Cite>
                , with KV moved over the vLLM NIXL connector{' '}
                <Cite tier={1} href={vllmUrl('docs/deployment/integrations/llm-d.md', 'L13')}>
                  vLLM docs: llm-d L13
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="success" header="Why this matters for an architecture decision">
            Because NIXL is shared, disaggregation you set up at the engine level (section 10)
            carries over when you adopt Dynamo or llm-d for the fleet: the connector, the KV-block
            registration and the producer and consumer roles stay in each worker&apos;s{' '}
            <code>--kv-transfer-config</code>. You are choosing an <em>orchestration</em> layer
            above a stable transport.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Dynamo and llm-d both sit above vLLM, share NIXL and meet at the Kubernetes Gateway API, so on a Gateway API cluster the choice is partly which endpoint picker the gateway calls"
          >
            Relationship to llm-d
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>llm-d</strong> (section 17: Kubernetes, llm-d, KServe &amp; Gateway API) sits
            beside Dynamo above vLLM. NVIDIA describes it as{' '}
            <em>
              &quot;Built on top of vLLM and Inference Gateway, llm-d extends the capabilities of
              vLLM with Kubernetes-native architecture for large-scale inference deployments&quot;
            </em>{' '}
            <Cite tier={2} href={BLOG_LLMD}>
              NVIDIA blog: Dynamo accelerates llm-d
            </Cite>
            .
          </Box>
          <Box variant="p">
            The two meet at the gateway. In Dynamo&apos;s Gateway API topology, a Kubernetes
            Gateway API Inference Extension (GAIE) gateway{' '}
            <em>
              &quot;calls the Dynamo Endpoint Picker Plugin (EPP) before forwarding to the selected
              worker&apos;s Frontend sidecar in <code>--router-mode direct</code>&quot;
            </em>
            , so a request travels client, gateway, EPP, Frontend sidecar, workers{' '}
            <Cite tier={1} href={`${DY_README}#L126-L129`}>
              Dynamo README L126-L129
            </Cite>
            . llm-d&apos;s gateway calls an EPP too (section 17). On a cluster that standardizes on
            the Gateway API, picking Dynamo or llm-d is partly picking which EPP makes the routing
            decision behind the same gateway.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Planner into llm-d (planned, May 2025)</Box>
              <Box variant="p">
                NVIDIA planned to bring{' '}
                <em>&quot;the benefits of NVIDIA Dynamo Planner to the llm-d Variant Autoscaler
                component&quot;</em>{' '}
                <Cite tier={2} href={BLOG_LLMD}>
                  NVIDIA blog: Dynamo accelerates llm-d
                </Cite>
                . llm-d v0.10.0 renamed that project <code>llm-d-autoscaling</code> and marks its
                WVA (Workload Variant Autoscaler) guides deprecated{' '}
                <Cite tier={1} href={LLMD_RELEASE}>
                  llm-d v0.10.0 release notes
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">KV Cache Manager into llm-d (planned, May 2025)</Box>
              <Box variant="p">
                NVIDIA also planned to bring{' '}
                <em>&quot;the benefits of the NVIDIA Dynamo KV Cache Manager to the llm-d KV Cache
                subsystem&quot;</em>{' '}
                <Cite tier={2} href={BLOG_LLMD}>
                  NVIDIA blog: Dynamo accelerates llm-d
                </Cite>
                . llm-d v0.10.0 moved <code>llm-d-kv-cache</code> into <code>llm-d-router</code>{' '}
                <Cite tier={1} href={LLMD_RELEASE}>
                  llm-d v0.10.0 release notes
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            This research could not confirm that either planned contribution was delivered: the
            llm-d v0.10.0 release notes do not mention Dynamo. Treat the split of responsibilities
            between the two projects as a moving target.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where Dynamo fits among the orchestration layers, the signals that say you need it, and the hardware it is written for"
          >
            When Dynamo is the right layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Keep the altitudes straight when comparing options. Choosing SGLang or TensorRT-LLM
            instead of vLLM is an <strong>engine</strong> choice, the subject of{' '}
            <strong>section 26 (When Not vLLM)</strong> and, for SGLang, of the{' '}
            <Link external href="../sglang/">
              SGLang dive, section 23: SGLang and vLLM Compared
            </Link>
            . Dynamo is an <em>orchestration</em>{' '}
            choice, a way to operate a fleet of whichever engine you picked. Its real alternatives
            are the Production-Stack router (section 16), llm-d (section 17) and Ray Serve (section
            15): the things that turn a set of engines into a service.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Reach for Dynamo when</Box>
              <ul>
                <li>
                  You run disaggregated prefill/decode at fleet scale and want one system to
                  orchestrate the pools, route on KV overlap, and size GPUs per phase.
                </li>
                <li>
                  You want KV tiering below GPU memory run by the same system that routes and
                  scales, instead of configured engine by engine (section 7 covers vLLM&apos;s own
                  tiers).
                </li>
                <li>
                  You are standardizing on NVIDIA GPUs and want NIXL as the common data plane across
                  vLLM, SGLang and TensorRT-LLM.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Look elsewhere when</Box>
              <ul>
                <li>
                  One vLLM engine, or a thin router over a few replicas, already meets your SLOs
                  (service-level objectives).
                  Dynamo&apos;s own README says that for a single model on a single GPU,{' '}
                  <em>&quot;your inference engine alone is probably sufficient&quot;</em>{' '}
                  <Cite tier={1} href={`${DY_README}#L60`}>
                    Dynamo README L60
                  </Cite>
                  .
                </li>
                <li>
                  You depend on a vLLM feature newer than <strong>0.28.0</strong>, the version{' '}
                  <code>ai-dynamo[vllm]</code> 1.5.1 installs, and do not want to run an untested
                  pairing.
                </li>
                <li>
                  You want the KServe ecosystem, where llm-d (section 17) may be the more idiomatic
                  fit.
                </li>
                <li>
                  You are on an accelerator Dynamo does not target, such as AWS Neuron; see the
                  hardware caveat below.
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Hardware caveat: the default install targets NVIDIA GPUs">
            Dynamo is an NVIDIA project (<code>ai-dynamo/dynamo</code>), and its pip install
            targets NVIDIA GPUs: its vLLM extra installs the CUDA 13 build of NIXL,{' '}
            <code>nixl[cu13]</code>{' '}
            <Cite tier={1} href={`${DY}/pyproject.toml#L61-L64`}>
              dynamo pyproject.toml L61-L64
            </Cite>{' '}
            <Cite tier={1} href="https://pypi.org/project/nixl/1.3.2/">
              PyPI: nixl 1.3.2
            </Cite>
            . For Intel XPU, v1.5.1 ships vLLM deployment templates (aggregated, disaggregated,
            KV router, planner) that need a custom-built XPU runtime image{' '}
            <Cite tier={1} href={`${DY}/examples/backends/vllm/deploy/xpu/README.md#L6-L33`}>
              Dynamo XPU deployment examples L6-L33
            </Cite>
            . On AWS it documents EFA on Amazon EKS (Elastic Kubernetes Service) for GPU-direct
            RDMA (remote direct memory access)
            between disaggregated workers on P5 and P6 GPU instances{' '}
            <Cite
              tier={1}
              href={`${DY}/docs/fern/pages/kubernetes/installation/rdma-setup/efa-on-aws.mdx`}
            >
              Dynamo docs: EFA on AWS
            </Cite>
            ; section 22 covers the vLLM side of that path. On AWS Neuron (Trainium and
            Inferentia, section 21) the engine and transport story is different, so read this
            section as NVIDIA-GPU-scoped.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The three settings on each vLLM worker that Dynamo leaves to you, and the vLLM version you actually run under it"
          >
            Wiring vLLM workers into Dynamo
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Dynamo starts each vLLM worker with <code>python -m dynamo.vllm</code>, which takes
            vLLM&apos;s engine arguments plus Dynamo&apos;s own{' '}
            <Cite tier={1} href={`${DY_VLLM_DOC}#L56-L68`}>
              Dynamo docs: vLLM configuration L56-L68
            </Cite>
            . Three settings decide whether the fleet behaves like the diagram above.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">1. Phase: Dynamo&apos;s flag</Box>
              <Box variant="p">
                <code>--disaggregation-mode prefill</code> or <code>decode</code> makes a worker a
                prefill-only or decode-only worker; the default is aggregated{' '}
                <Cite tier={1} href={`${DY}/components/src/dynamo/vllm/backend_args.py#L120-L128`} kind="code">
                  dynamo backend_args.py L120-L128
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">2. KV role: your <code>--kv-transfer-config</code></Box>
              <Box variant="p">
                Dynamo assigns no role. A prefill worker started without a{' '}
                <code>--kv-transfer-config</code> raises a <code>ValueError</code> and never starts{' '}
                <Cite tier={1} href={`${DY_ARGS}#L249-L264`} kind="code">
                  dynamo args.py L249-L264
                </Cite>
                . Dynamo&apos;s examples pass <code>kv_both</code>{' '}
                <Cite tier={1} href={`${DY}/examples/backends/vllm/launch/disagg.sh#L32-L51`}>
                  dynamo disagg.sh L32-L51
                </Cite>
                , which vLLM has deprecated for <code>NixlConnector</code> since v0.23.0{' '}
                <Cite tier={1} href="https://github.com/vllm-project/vllm/pull/43874">
                  vLLM PR #43874
                </Cite>
                . Set <code>kv_producer</code> on prefill workers and <code>kv_consumer</code> on
                decode workers, as vLLM&apos;s start-up warning asks{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL_DIR}/v1/nixl/connector.py`, 'L94-L100')} kind="code">
                  nixl/connector.py L94-L100
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">3. KV events: off until you enable them</Box>
              <Box variant="p">
                <code>--router-mode kv</code> on the frontend does not turn on publishing. Pass{' '}
                <code>--enable-prefix-caching</code> and a <code>--kv-events-config</code> with{' '}
                <code>enable_kv_cache_events</code> true on every aggregated or prefill worker the
                router should track{' '}
                <Cite tier={1} href={`${DY_VLLM_DOC}#L56-L73`}>
                  Dynamo docs: vLLM configuration L56-L73
                </Cite>{' '}
                <Cite tier={1} href={`${DY_ARGS}#L465-L484`} kind="code">
                  dynamo args.py L465-L484
                </Cite>
                ; vLLM defaults it to false{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/kv_events.py', 'L14')}>
                  kv_events.py L14
                </Cite>
                . Without events, start the frontend with <code>--no-router-kv-events</code> for
                prediction-based routing or <code>--load-aware</code> for load-only routing.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# decode worker
python -m dynamo.vllm --model <model> \
  --disaggregation-mode decode \
  --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_consumer"}'

# prefill worker: also publishes KV events for the KV-Aware Router
python -m dynamo.vllm --model <model> \
  --disaggregation-mode prefill \
  --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_producer"}' \
  --enable-prefix-caching \
  --kv-events-config '{"enable_kv_cache_events":true,"publisher":"zmq","topic":"kv-events","endpoint":"tcp://*:5557"}'`}</pre>
          </Box>
          <Box variant="small" color="text-body-secondary">
            Adapted from Dynamo&apos;s <code>disagg.sh</code> and its vLLM configuration page, with
            the explicit roles vLLM asks for. Not run for this dive.
          </Box>
          <Alert type="warning" header="Check the vLLM version: ai-dynamo[vllm] 1.5.1 installs vLLM 0.28.0">
            <code>pip install &quot;ai-dynamo[vllm]&quot;</code> at 1.5.1 pins{' '}
            <code>vllm[flashinfer,runai,otel]==0.28.0</code>{' '}
            <Cite tier={1} href={`${DY}/pyproject.toml#L61-L64`}>
              dynamo pyproject.toml L61-L64
            </Cite>
            , three minor releases behind the v0.31.0 this dive describes, so a flag or default that
            arrived after 0.28.0 is absent from that install. One matters for KV-aware routing: the
            deterministic prefix-hash seed for the default <code>sha256</code> arrived in v0.29.0{' '}
            <Cite tier={1} href="https://github.com/vllm-project/vllm/pull/51875">
              vLLM PR #51875
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L131-L144')} kind="code">
              kv_cache_utils.py L131-L144
            </Cite>
            . On 0.28.0, set <code>PYTHONHASHSEED=0</code> on every vLLM process, as Dynamo&apos;s
            KV routing guide asks, so cache-block hashes match across workers{' '}
            <Cite tier={1} href={`${DY}/docs/fern/pages/cli/kv-aware-routing/overview.mdx#L117`}>
              Dynamo docs: KV-aware routing L117
            </Cite>
            . The other orchestrators lag too: Ray 2.59.0 pins vLLM 0.27.0{' '}
            <Cite
              tier={1}
              href="https://github.com/ray-project/ray/blob/ray-2.59.0/python/requirements/llm/llm-requirements.txt#L2"
            >
              ray llm-requirements.txt L2
            </Cite>{' '}
            and llm-d 0.10.0 ships the v0.30.0 image{' '}
            <Cite tier={1} href={LLMD_RELEASE}>
              llm-d v0.10.0 release notes
            </Cite>
            . None pins v0.31.0, so validate the flags your deployment depends on against vLLM
            0.28.0 before you roll Dynamo out.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
