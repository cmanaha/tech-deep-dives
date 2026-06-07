import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

interface CapabilityRow {
  capability: string;
  engineHas: string;
  dynamoAdds: string;
}

const capabilityRows: CapabilityRow[] = [
  {
    capability: 'Disaggregated prefill / decode',
    engineHas:
      'vLLM can run as a prefiller or decoder and ships KV over a connector (section 10), but does not orchestrate the two pools as a fleet.',
    dynamoAdds:
      'Fleet-level orchestration that "separates the prefill and decode phases onto different GPUs or nodes" and coordinates the pools as one service.',
  },
  {
    capability: 'Request routing',
    engineHas:
      'A single vLLM engine schedules its own continuous batches; cross-replica routing is left to whatever sits in front (Production-Stack router, Gateway, llm-d).',
    dynamoAdds:
      'A "Smart Router" that "tracks KV cache across large fleets of GPUs in multinode and disaggregated deployments, and efficiently routes incoming requests" — KV-aware placement, not round-robin.',
  },
  {
    capability: 'Multi-tier KV cache management',
    engineHas:
      'Per-engine paged KV plus optional offload to a connector backend (LMCache, etc.) within one engine (sections 5 and 7).',
    dynamoAdds:
      'A fleet-wide "Distributed KV Cache Manager" that offloads "older or less frequently accessed KV cache blocks to more cost-effective memory and storage solutions" across the cluster.',
  },
  {
    capability: 'GPU resource / autoscaling planning',
    engineHas:
      'No notion of the fleet — one engine sees only its own GPUs and its own queue.',
    dynamoAdds:
      'A "Planner" that "continuously monitors key GPU capacity metrics" and decides how to allocate GPUs between the prefill and decode phases.',
  },
  {
    capability: 'KV / data transport',
    engineHas:
      'vLLM’s NixlConnector already moves KV over NIXL (UCX / libfabric backends) — see the codebase tab.',
    dynamoAdds:
      'The same NIXL library, used fleet-wide: "a high-throughput, low-latency point-to-point communication library" that moves data "across different tiers of memory and storage".',
  },
];

function DynamoDiagram() {
  return (
    <svg
      viewBox="0 0 860 440"
      role="img"
      aria-labelledby="dynamo-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="dynamo-title">
        NVIDIA Dynamo as a serving layer over a fleet of vLLM workers: a Smart Router and a
        distributed KV Cache Manager sit above prefill and decode worker pools, and KV cache moves
        between the pools over the NIXL transfer library
      </title>
      <style>
        {`
          .lyr { stroke-width: 1.5; }
          .dynamo { fill: #0972d3; stroke: #065299; }
          .router { fill: #2ea597; stroke: #1f7a70; }
          .prefill { fill: #f2f8fd; stroke: #065299; stroke-width: 1.5; }
          .decode { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .nixl { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .wt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .ws { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .tt { fill: #ffffff; font: 600 14px sans-serif; text-anchor: middle; }
          .ts { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .lbl { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#dah); }
          .arr2 { stroke: #8b6c00; stroke-width: 2; fill: none; marker-end: url(#dah2); }
        `}
      </style>
      <defs>
        <marker id="dah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="dah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
        </marker>
      </defs>

      <text className="lbl" x={430} y={22}>Requests in, tokens out</text>
      <path className="arr" d="M430,30 L430,58" />

      {/* Dynamo serving layer */}
      <rect className="lyr dynamo" x={70} y={64} width={720} height={96} rx={10} />
      <text className="tt" x={430} y={88}>NVIDIA Dynamo serving layer</text>
      <rect className="lyr router" x={96} y={100} width={300} height={48} rx={6} />
      <text className="ts" x={246} y={120}>Smart Router (KV-aware)</text>
      <text className="ts" x={246} y={137}>+ Planner (GPU allocation)</text>
      <rect className="lyr router" x={464} y={100} width={300} height={48} rx={6} />
      <text className="ts" x={614} y={120}>Distributed KV Cache Manager</text>
      <text className="ts" x={614} y={137}>(multi-tier offload)</text>

      {/* routing arrows down to pools */}
      <path className="arr" d="M240,160 L200,210" />
      <path className="arr" d="M620,160 L660,210" />

      {/* Prefill worker pool */}
      <rect className="lyr prefill" x={60} y={214} width={310} height={150} rx={8} />
      <text className="wt" x={215} y={238}>Prefill worker pool</text>
      <text className="ws" x={215} y={257}>vLLM engines (kv_producer)</text>
      <rect className="lyr prefill" x={84} y={272} width={120} height={74} rx={6} />
      <rect className="lyr prefill" x={224} y={272} width={120} height={74} rx={6} />
      <text className="ws" x={144} y={304}>vLLM</text>
      <text className="ws" x={144} y={320}>prefill</text>
      <text className="ws" x={284} y={304}>vLLM</text>
      <text className="ws" x={284} y={320}>prefill</text>

      {/* Decode worker pool */}
      <rect className="lyr decode" x={490} y={214} width={310} height={150} rx={8} />
      <text className="wt" x={645} y={238}>Decode worker pool</text>
      <text className="ws" x={645} y={257}>vLLM engines (kv_consumer)</text>
      <rect className="lyr decode" x={514} y={272} width={120} height={74} rx={6} />
      <rect className="lyr decode" x={654} y={272} width={120} height={74} rx={6} />
      <text className="ws" x={574} y={304}>vLLM</text>
      <text className="ws" x={574} y={320}>decode</text>
      <text className="ws" x={714} y={304}>vLLM</text>
      <text className="ws" x={714} y={320}>decode</text>

      {/* NIXL transfer bar between pools */}
      <rect className="lyr nixl" x={370} y={278} width={120} height={62} rx={8} />
      <text className="wt" x={430} y={304}>NIXL</text>
      <text className="sub" x={430} y={322}>KV transfer</text>
      <path className="arr2" d="M344,310 L370,310" />
      <path className="arr2" d="M490,310 L514,310" />

      <text className="lbl" x={430} y={398}>
        Dynamo wraps the engines — vLLM stays the engine; Dynamo adds routing, planning, and
        fleet-wide KV management
      </text>
      <text className="sub" x={430} y={420}>
        Same NIXL library that vLLM&apos;s NixlConnector uses (Inside the Codebase &rarr; Distributed
        &amp; KV Transfer)
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
            description="A datacenter-scale serving framework that wraps inference engines (vLLM, SGLang, TensorRT-LLM) — it does not replace vLLM; vLLM is a first-class backend"
          >
            18. NVIDIA Dynamo &amp; the Ecosystem
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="The one thing to get right: Dynamo wraps engines, it does not replace them">
            The common misread is that Dynamo is a competitor to vLLM in the way SGLang or
            TensorRT-LLM are — another engine to choose <em>instead of</em> vLLM. It is not. Dynamo
            sits a layer up: it is a <strong>serving framework</strong> that orchestrates a{' '}
            <em>fleet</em> of engines, and vLLM is one of its first-class backends. The GitHub repo
            describes it as{' '}
            <em>&quot;the open-source, datacenter-scale inference stack&quot;</em> and lists{' '}
            <strong>SGLang, TensorRT-LLM, and vLLM</strong> as supported backends, Apache-2.0
            licensed{' '}
            <Link external href="https://github.com/ai-dynamo/dynamo">
              [Tier-2: NVIDIA ai-dynamo/dynamo GitHub README, accessed 2026-06-07]
            </Link>
            . If you already run vLLM, Dynamo is a way to operate many vLLM workers as one
            disaggregated, KV-aware service — not a migration off vLLM.
          </Alert>
          <Box variant="p">
            <strong>The problem Dynamo solves:</strong> sections 9 and 10 leave you with a fleet of
            vLLM engines and a set of hard fleet-level questions a single engine cannot answer.{' '}
            <em>Which</em> replica should serve this request so it lands where the prompt&apos;s KV
            already lives? When you disaggregate, <em>who</em> orchestrates the prefiller and decoder
            pools as one service, carries the KV handle between them, and sizes each pool to load?
            And where do <em>cold</em> KV blocks go when GPU memory is full across the cluster, not
            just within one engine? These are serving-framework concerns, deliberately out of scope
            for the engine itself.
          </Box>
          <Box variant="p">
            <strong>What Dynamo adds on top of the engine:</strong> NVIDIA&apos;s introduction blog
            describes Dynamo as{' '}
            <em>
              &quot;a high-throughput, low-latency open-source inference serving framework for
              deploying generative AI and reasoning models in large-scale distributed
              environments&quot;
            </em>{' '}
            compatible with <strong>PyTorch, SGLang, NVIDIA TensorRT-LLM, and vLLM</strong>{' '}
            <Link external href="https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/">
              [Tier-2: NVIDIA Dynamo introduction blog, accessed 2026-06-07]
            </Link>
            . Concretely it contributes four fleet-level pieces — disaggregated prefill/decode
            orchestration, a <strong>Smart Router</strong>, a distributed <strong>KV Cache
            Manager</strong>, and a <strong>Planner</strong> — all wired together over{' '}
            <strong>NIXL</strong>, the same transfer library vLLM&apos;s own{' '}
            <code>NixlConnector</code> uses.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A router and KV manager over a fleet of vLLM prefill and decode workers, with KV moving over NIXL"
          >
            The shape: Dynamo over a fleet of vLLM workers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read the diagram top-down. Requests hit the <strong>Dynamo serving layer</strong>; its{' '}
            <strong>Smart Router</strong> places each one onto a worker with KV-affinity in mind, and
            the <strong>Planner</strong> decides how the GPUs split between phases. Underneath sit two
            pools of <em>ordinary vLLM engines</em> — prefillers and decoders — exactly the disaggregated
            topology from section 10. The KV cache produced by a prefiller is shipped to a decoder over{' '}
            <strong>NIXL</strong>, and the <strong>distributed KV Cache Manager</strong> decides which
            blocks stay resident and which spill to cheaper memory tiers across the whole fleet.
          </Box>
          <DynamoDiagram />
          <Alert type="info">
            The wire between the pools is the link back to the engine. vLLM&apos;s{' '}
            <code>NixlConnector</code> — its send/receive state machine, KV-block registration for
            RDMA, and the <code>KVConnectorBase_V1</code> contract — is walked in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>, and the
            architecture of disaggregated prefill/decode is <strong>section 10 (Disaggregated Prefill
            / Decode)</strong>. Dynamo does not reinvent that transport; it uses the same{' '}
            <strong>NIXL (NVIDIA Inference Transfer Library)</strong> at fleet scale. This section
            stays at the &quot;what does Dynamo add above the engine&quot; altitude and does not
            duplicate either of those.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="For each fleet-level concern: what one vLLM engine already gives you vs. what Dynamo layers on top"
          >
            What Dynamo provides on top of the engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The clean way to reason about Dynamo is per-capability: take a serving concern, ask what a
            single vLLM engine already does, then ask what Dynamo adds at the fleet level. The
            right-hand column is the value proposition — and every row is something vLLM hands off
            rather than something Dynamo takes away.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'capability',
                header: 'Capability',
                cell: (r) => <strong>{r.capability}</strong>,
                minWidth: 180,
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
          <Box variant="small">
            Component names and descriptions in the right column are quoted from NVIDIA&apos;s Dynamo
            introduction blog{' '}
            <Link external href="https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/">
              [Tier-2: NVIDIA Dynamo introduction blog, accessed 2026-06-07]
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="NIXL is the shared transport that links vLLM, Dynamo, and llm-d — the same library, used at different scopes"
          >
            NIXL: the shared substrate
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The detail that ties this whole layer together is that <strong>NIXL is not a
            Dynamo-only thing</strong>. NVIDIA describes it as{' '}
            <em>
              &quot;a high-throughput, low-latency point-to-point communication library that provides
              a consistent data movement API to move data rapidly and asynchronously across different
              tiers of memory and storage&quot;
            </em>{' '}
            <Link external href="https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/">
              [Tier-2: NVIDIA Dynamo introduction blog, accessed 2026-06-07]
            </Link>
            . That is precisely the library vLLM&apos;s <code>NixlConnector</code> uses for
            disaggregated KV transfer (section 10) — so the same transport shows up at three
            scopes: inside a single vLLM disaggregated deployment, across a Dynamo-orchestrated fleet,
            and inside the llm-d project.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">In vLLM (the engine)</Box>
              <Box variant="p">
                <code>NixlConnector</code> moves KV blocks between a prefiller and a decoder over
                NIXL (UCX / libfabric backends). This is the bottom of the stack — covered in{' '}
                <strong>section 10</strong> and the{' '}
                <strong>Distributed &amp; KV Transfer</strong> codebase tab.
              </Box>
            </div>
            <div>
              <Box variant="h3">In Dynamo (the fleet)</Box>
              <Box variant="p">
                NIXL is the data plane for fleet-wide disaggregation and KV offload — moving cache
                across pools and across memory/storage tiers, coordinated by the Smart Router and KV
                Cache Manager{' '}
                <Link external href="https://github.com/ai-dynamo/dynamo">
                  [Tier-2: ai-dynamo/dynamo GitHub, accessed 2026-06-07]
                </Link>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">In llm-d (the ecosystem)</Box>
              <Box variant="p">
                NVIDIA states that{' '}
                <em>
                  &quot;llm-d relies on NIXL to accelerate the KV cache data transfer between prefill
                  and decode in disaggregated serving setups&quot;
                </em>{' '}
                <Link external href="https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/">
                  [Tier-2: NVIDIA &quot;Dynamo accelerates llm-d&quot; blog, accessed 2026-06-07]
                </Link>
                .
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="success" header="Why this matters for an architecture decision">
            Because NIXL is shared, the disaggregation work you do at the engine level (section 10)
            is not wasted if you later adopt Dynamo or llm-d for the fleet layer — the transport,
            the KV-block registration model, and the producer/consumer roles carry over. You are
            choosing an <em>orchestration</em> layer above a stable transport, not swapping
            transports.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Dynamo and llm-d are not competitors — Dynamo is contributing components into the llm-d ecosystem"
          >
            Relationship to llm-d
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Dynamo and <strong>llm-d</strong> (covered in <strong>section 17: Kubernetes — llm-d,
            KServe &amp; Gateway API</strong>) are easy to mistake for rivals; they are collaborators.
            NVIDIA describes llm-d as{' '}
            <em>
              &quot;built on top of vLLM and Inference Gateway, llm-d extends the capabilities of
              vLLM with Kubernetes-native architecture for large-scale inference deployments&quot;
            </em>{' '}
            <Link external href="https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/">
              [Tier-2: NVIDIA &quot;Dynamo accelerates llm-d&quot; blog, accessed 2026-06-07]
            </Link>
            . Both sit above vLLM; Dynamo is feeding components <em>into</em> the llm-d community.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">NIXL</Box>
              <Box variant="p">
                Already the shared transport — llm-d{' '}
                <em>&quot;relies on NIXL&quot;</em> for KV transfer between prefill and decode in
                disaggregated setups.
              </Box>
            </div>
            <div>
              <Box variant="h3">Dynamo Planner</Box>
              <Box variant="p">
                NVIDIA plans to bring{' '}
                <em>&quot;the benefits of NVIDIA Dynamo Planner to the llm-d Variant Autoscaler
                component&quot;</em> for dynamic GPU resource planning.
              </Box>
            </div>
            <div>
              <Box variant="h3">KV Cache Manager</Box>
              <Box variant="p">
                NVIDIA will work to bring{' '}
                <em>&quot;the benefits of the NVIDIA Dynamo KV Cache Manager to the llm-d KV Cache
                subsystem&quot;</em>.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="small">
            All three contribution statements and the llm-d description are quoted from NVIDIA&apos;s
            collaboration blog{' '}
            <Link external href="https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/">
              [Tier-2: NVIDIA &quot;Dynamo accelerates llm-d&quot; blog, accessed 2026-06-07]
            </Link>
            . These integrations are described by NVIDIA as planned/collaborative; treat the
            split-of-responsibilities between the two projects as a moving target.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where Dynamo fits among the engine and orchestration alternatives — and the hardware caveat"
          >
            When Dynamo is the right layer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Keep the altitudes straight when comparing options. The{' '}
            <strong>engine</strong> alternatives — choosing SGLang or TensorRT-LLM <em>instead of</em>{' '}
            vLLM — are the subject of <strong>section 26 (When Not vLLM)</strong>; that is a question
            of which engine runs a model on a GPU. Dynamo is an <em>orchestration</em> alternative: a
            way to operate a fleet of whichever engine you picked. So &quot;Dynamo vs vLLM&quot; is a
            category error, but &quot;Dynamo vs Production-Stack router (section 16) vs llm-d (section
            17) vs Ray Serve (section 15)&quot; is a real comparison — these are the things that turn a
            set of engines into a service.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Reach for Dynamo when</Box>
              <ul>
                <li>
                  You are running disaggregated prefill/decode at fleet scale and want one system to
                  orchestrate the pools, route KV-aware, and plan GPU allocation across phases.
                </li>
                <li>
                  Your KV working set exceeds aggregate GPU memory and you need fleet-wide,
                  multi-tier KV offload — not just per-engine offload (section 7).
                </li>
                <li>
                  You are standardizing on NVIDIA GPUs and want NIXL-based transport as the common
                  data plane across engines.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Look elsewhere when</Box>
              <ul>
                <li>
                  A single vLLM engine, or a thin router (Production-Stack, Gateway API) over a few
                  replicas, already meets your SLOs — Dynamo&apos;s fleet machinery is overhead you
                  do not yet need.
                </li>
                <li>
                  You are Kubernetes-native and want the Gateway-API / KServe ecosystem — llm-d
                  (section 17) may be the more idiomatic fit, and it shares NIXL anyway.
                </li>
                <li>
                  You are on non-NVIDIA accelerators — see the hardware caveat below.
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Hardware caveat: Dynamo is most relevant on NVIDIA GPUs">
            Dynamo is an NVIDIA project (<code>ai-dynamo/dynamo</code>), and its value props — NIXL
            transport, NVLink/NVSwitch-class KV movement, GPU-capacity planning — are written for and
            tuned to NVIDIA hardware{' '}
            <Link external href="https://github.com/ai-dynamo/dynamo">
              [Tier-2: ai-dynamo/dynamo GitHub, accessed 2026-06-07]
            </Link>
            . On AWS Neuron (Trainium / Inferentia, section 21) the engine and transport story is
            different; this section&apos;s claims should be read as NVIDIA-GPU-scoped. As always with
            a vendor framework, the tone here is descriptive, not an endorsement — validate the fit
            against your own fleet and accelerators.
          </Alert>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Operational notes & the precise scoping (deep dive)">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Dynamo is built in Rust and Python.</strong> The repo states it is{' '}
            <em>&quot;built in Rust for performance, Python for extensibility&quot;</em> and is
            Apache-2.0 licensed{' '}
            <Link external href="https://github.com/ai-dynamo/dynamo">
              [Tier-2: ai-dynamo/dynamo GitHub README, accessed 2026-06-07]
            </Link>
            . That mirrors vLLM&apos;s own trajectory toward a Rust frontend (the{' '}
            <strong>Rust Frontend</strong> codebase tab) — the performance-critical serving plumbing
            is increasingly Rust in both projects.
          </Box>
          <Box variant="p">
            <strong>The four named components, precisely.</strong> Per the introduction blog: the{' '}
            <strong>Planner</strong> &quot;continuously monitors key GPU capacity metrics&quot; and
            allocates GPUs between prefill and decode; the <strong>Smart Router</strong> &quot;tracks
            KV cache across large fleets of GPUs in multinode and disaggregated deployments, and
            efficiently routes incoming requests&quot;; the <strong>Distributed KV Cache
            Manager</strong> offloads &quot;older or less frequently accessed KV cache blocks to more
            cost-effective memory and storage solutions&quot;; and <strong>Disaggregated
            Serving</strong> &quot;separates the prefill and decode phases onto different GPUs or
            nodes&quot;{' '}
            <Link external href="https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/">
              [Tier-2: NVIDIA Dynamo introduction blog, accessed 2026-06-07]
            </Link>
            . The GitHub README lists the same surface compactly as{' '}
            <em>&quot;Disaggregated Prefill/Decode&quot;</em>, <em>&quot;KV-Aware Routing&quot;</em>,
            and a <em>&quot;KV Block Manager (KVBM)&quot;</em>{' '}
            <Link external href="https://github.com/ai-dynamo/dynamo">
              [Tier-2: ai-dynamo/dynamo GitHub, accessed 2026-06-07]
            </Link>
            .
          </Box>
          <Box variant="p">
            <strong>Why &quot;wraps, not replaces&quot; is the load-bearing framing.</strong> Every
            capability above is engine-agnostic by design — Dynamo lists vLLM, SGLang, and
            TensorRT-LLM as interchangeable backends. That is only possible because Dynamo never owns
            the forward pass; the engine does. vLLM keeps doing PagedAttention, continuous batching,
            prefix caching, quantization, and LoRA exactly as the earlier sections describe — Dynamo
            adds the layer that decides which engine instance sees a request and where its KV lives.
            If you remember one sentence: <em>the engine runs the model; Dynamo runs the fleet</em>.
          </Box>
          <Box variant="p">
            <strong>Roles map cleanly onto vLLM&apos;s connector vocabulary.</strong> A Dynamo prefill
            worker is a vLLM engine in the <code>kv_producer</code> role and a decode worker is a{' '}
            <code>kv_consumer</code> — the same <code>kv_role</code> wiring section 10 describes for
            standalone disaggregation. Dynamo is the orchestrator that assigns those roles across the
            fleet and routes between them, rather than you wiring a fixed prefiller/decoder pair by
            hand.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Box variant="small">
        Sources — <strong>Tier-2 (NVIDIA vendor blogs &amp; repo):</strong>{' '}
        <Link external href="https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/">
          Introducing NVIDIA Dynamo
        </Link>{' '}
        (the &quot;inference serving framework&quot; definition, the PyTorch/SGLang/TensorRT-LLM/vLLM
        backend list, and the Planner / Smart Router / Distributed KV Cache Manager / Disaggregated
        Serving / NIXL descriptions),{' '}
        <Link external href="https://developer.nvidia.com/blog/nvidia-dynamo-accelerates-llm-d-community-initiatives-for-advancing-large-scale-distributed-inference/">
          NVIDIA Dynamo accelerates llm-d
        </Link>{' '}
        (the llm-d description, the &quot;llm-d relies on NIXL&quot; statement, and the planned
        Planner / KV Cache Manager contributions), and the{' '}
        <Link external href="https://github.com/ai-dynamo/dynamo">
          ai-dynamo/dynamo GitHub repository
        </Link>{' '}
        (the &quot;open-source, datacenter-scale inference stack&quot; tagline, backend list,
        Apache-2.0 license, Rust+Python implementation, and the KV-Aware Routing / KVBM feature
        names) — all accessed 2026-06-07. Cross-references: disaggregated architecture is{' '}
        <strong>section 10</strong>; the <code>NixlConnector</code> call paths are{' '}
        <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong>; llm-d is{' '}
        <strong>section 17</strong>; and the engine-vs-engine alternatives (SGLang, TensorRT-LLM)
        are <strong>section 26 (When Not vLLM)</strong>. NVIDIA-sourced claims are vendor (Tier-2)
        and Dynamo is most relevant on NVIDIA hardware; treat the planned llm-d integrations as a
        moving target.
      </Box>
    </SpaceBetween>
  );
}
