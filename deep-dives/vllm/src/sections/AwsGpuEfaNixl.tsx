import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

interface InstanceRow {
  family: string;
  gpu: string;
  efa: string;
  use: string;
}

const instanceRows: InstanceRow[] = [
  {
    family: 'P5 (p5.48xlarge)',
    gpu: '8x NVIDIA H100',
    efa: '32 network cards = up to 32 EFA interfaces; 3,200 Gbps aggregate',
    use: 'Single-node TP for large models; multi-node TP+PP and disaggregated prefill/decode over EFA',
  },
  {
    family: 'P5en (p5en.48xlarge)',
    gpu: '8x NVIDIA H200',
    efa: '16 network cards = up to 16 EFA; 3,200 Gbps aggregate (faster per-interface)',
    use: 'Larger HBM per GPU (H200) for bigger KV cache; same multi-node story as P5',
  },
  {
    family: 'P6 (P6-B200 / P6-B300)',
    gpu: 'NVIDIA Blackwell (B200 / B300)',
    efa: 'Up to 6,400 Gbps aggregate on P6-B300 (per EFA sibling deep dive)',
    use: 'Highest inter-node bandwidth; the llm-d disaggregation benchmark ran on p6-b200',
  },
  {
    family: 'G6e (g6e.*)',
    gpu: 'NVIDIA L40S',
    efa: 'EFA available on larger G6e sizes — confirm per-size in the EC2 docs',
    use: 'Cost-efficient single-node and small mid-size model serving; smaller multi-node clusters',
  },
];

function KvDataPathDiagram() {
  return (
    <svg
      viewBox="0 0 860 440"
      role="img"
      aria-labelledby="kv-datapath-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="kv-datapath-title">
        A prefiller EC2 node and a decoder EC2 node, both inside one Availability Zone. The
        prefiller&apos;s vLLM engine (kv_role producer, NixlConnector) holds KV blocks in GPU HBM and
        hands them to its EFA NIXL/LIBFABRIC interface; the KV cache is transferred by GPUDirect RDMA
        over EFA (SRD, OS-bypass) to the decoder&apos;s EFA interface, into decoder GPU HBM, where the
        vLLM engine (kv_role consumer) generates tokens.
      </title>
      <style>
        {`
          .az { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; stroke-dasharray: 7 5; }
          .azlbl { fill: #0972d3; font: 600 12px sans-serif; letter-spacing: 0.5px; }
          .node { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .nodehd { fill: #232f3e; }
          .ht { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .hs { fill: #d5dbdb; font: 11px sans-serif; text-anchor: middle; }
          .hbm { fill: #e8f5e9; stroke: #1d8102; stroke-width: 1.4; }
          .efa { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.4; }
          .bt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .bs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .cfg { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .cfgm { fill: #0972d3; font: 600 11px sans-serif; text-anchor: middle; }
          .iarr { stroke: #5f6b7a; stroke-width: 1.6; fill: none; marker-end: url(#kvdown); }
          .xarr { stroke: #0972d3; stroke-width: 2.5; fill: none; marker-end: url(#kvx); }
          .xt { fill: #0972d3; font: 600 12px sans-serif; text-anchor: middle; }
          .xs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="kvdown" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="kvx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
        </marker>
      </defs>

      {/* Availability Zone boundary */}
      <rect className="az" x={16} y={16} width={828} height={408} rx={12} />
      <text className="azlbl" x={34} y={40}>ONE AVAILABILITY ZONE (EFA cannot cross AZ / VPC)</text>

      {/* ---- Prefiller node ---- */}
      <rect className="node" x={44} y={58} width={310} height={320} rx={8} />
      <rect className="nodehd" x={44} y={58} width={310} height={34} rx={8} />
      <text className="ht" x={199} y={80}>PREFILLER NODE (EC2)</text>

      <text className="bt" x={199} y={114}>e.g. p5.48xlarge</text>
      <text className="bs" x={199} y={134}>vLLM engine &middot; NixlConnector</text>
      <text className="cfgm" x={199} y={152}>kv_role = producer</text>
      <text className="cfg" x={199} y={170}>kv_buffer_device = cuda</text>

      {/* prefiller GPU HBM */}
      <rect className="hbm" x={104} y={188} width={190} height={48} rx={6} />
      <text className="bt" x={199} y={209}>GPU HBM</text>
      <text className="bs" x={199} y={226}>KV blocks</text>

      {/* internal arrow HBM -> EFA */}
      <line className="iarr" x1={199} y1={236} x2={199} y2={284} />
      <text className="bs" x={199} y={262}>GPUDirect RDMA</text>

      {/* prefiller EFA */}
      <rect className="efa" x={104} y={290} width={190} height={62} rx={6} />
      <text className="bt" x={199} y={313}>EFA interface</text>
      <text className="bs" x={199} y={331}>NIXL / LIBFABRIC</text>
      <text className="bs" x={199} y={347}>OS-bypass</text>

      {/* ---- Decoder node ---- */}
      <rect className="node" x={506} y={58} width={310} height={320} rx={8} />
      <rect className="nodehd" x={506} y={58} width={310} height={34} rx={8} />
      <text className="ht" x={661} y={80}>DECODER NODE (EC2)</text>

      <text className="bt" x={661} y={114}>e.g. p5.48xlarge</text>
      <text className="bs" x={661} y={134}>vLLM engine &middot; NixlConnector</text>
      <text className="cfgm" x={661} y={152}>kv_role = consumer</text>
      <text className="cfg" x={661} y={170}>kv_buffer_device = cuda</text>

      {/* decoder EFA (top, receives) */}
      <rect className="efa" x={566} y={290} width={190} height={62} rx={6} />
      <text className="bt" x={661} y={313}>EFA interface</text>
      <text className="bs" x={661} y={331}>NIXL / LIBFABRIC</text>
      <text className="bs" x={661} y={347}>OS-bypass</text>

      {/* decoder GPU HBM */}
      <rect className="hbm" x={566} y={188} width={190} height={48} rx={6} />
      <text className="bt" x={661} y={209}>GPU HBM</text>
      <text className="bs" x={661} y={226}>KV blocks in</text>

      {/* internal arrow EFA -> HBM (upward) */}
      <line className="iarr" x1={661} y1={290} x2={661} y2={240} />
      <text className="bs" x={661} y={272}>GPUDirect RDMA</text>

      {/* ---- KV transfer between EFA interfaces ---- */}
      <line className="xarr" x1={294} y1={321} x2={566} y2={321} />
      <text className="xt" x={430} y={306}>KV cache transfer</text>
      <text className="xs" x={430} y={343}>SRD over EFA &middot; packet-spraying</text>
    </svg>
  );
}

export function AwsGpuEfaNixl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Running vLLM on AWS GPU instances, and why EFA + NIXL is the transport that makes multi-node and disaggregated serving fast"
          >
            22. vLLM on AWS GPUs, EFA &amp; NIXL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The architecture question:</strong> vLLM gives you a fast single-GPU and
            single-node engine. The moment a model no longer fits in one node&apos;s HBM, or you
            split a request across a <strong>prefiller</strong> and a <strong>decoder</strong> (section
            10, Disaggregated Prefill / Decode), you are moving tensors between EC2 instances over
            the network. On a TCP path that movement becomes the bottleneck — the GPUs starve waiting
            for KV cache. The outcome you want is: <em>move KV blocks between nodes fast enough that
            the network never gates the GPUs.</em> On AWS the answer is{' '}
            <strong>Elastic Fabric Adapter (EFA)</strong> for the wire and{' '}
            <strong>NIXL (NVIDIA Inference Xfer Library)</strong> for the inference-shaped transfer
            API on top of it.
          </Box>
          <Box variant="p">
            <strong>What changed in March 2026:</strong> AWS shipped first-party support for NIXL
            over EFA. <span>[Tier-2: AWS What&apos;s New, Mar 19, 2026]</span>{' '}
            &quot;AWS announces support for NVIDIA Inference Xfer Library (NIXL) with Elastic Fabric
            Adapter (EFA) to accelerate disaggregated large language model (LLM) inference on Amazon
            EC2&quot; — available &quot;on all EFA-enabled EC2 instance types&quot; and{' '}
            &quot;at no additional cost,&quot; integrating natively with frameworks including NVIDIA
            Dynamo, SGLang, and vLLM. This is what lets vLLM&apos;s <code>NixlConnector</code> push
            KV cache from prefiller to decoder over EFA via the <code>LIBFABRIC</code> backend.{' '}
            <Link
              external
              href="https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/"
            >
              AWS What&apos;s New: NIXL with EFA (accessed 2026-06-07)
            </Link>
          </Box>
          <Alert type="info">
            This section assumes the EFA mechanics — OS-bypass, SRD (Scalable Reliable Datagram),
            packet spraying across up to 64 paths, libfabric — are covered in depth by the sibling{' '}
            <strong>Elastic Fabric Adapter (EFA)</strong> deep dive (<code>../efa/</code>). Here we
            focus on how vLLM <em>uses</em> that fabric for inference, not how the fabric itself
            works.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The data path: prefiller → EFA/NIXL → decoder</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Disaggregated serving splits a request: the <strong>prefiller</strong> runs the
            compute-bound prompt pass and produces the KV cache; the <strong>decoder</strong>{' '}
            consumes that KV cache and runs the memory-bound token-by-token generation. The KV
            blocks must travel from prefiller GPU memory to decoder GPU memory. NIXL over EFA makes
            that a <strong>GPUDirect RDMA</strong> transfer — GPU HBM to GPU HBM, OS-bypass, no
            staging through host memory and no kernel on the data path.
          </Box>

          <KvDataPathDiagram />

          <Alert type="info">
            <strong>Keep the two nodes physically close.</strong> EFA cannot cross Availability
            Zone or VPC boundaries, and KV-transfer latency is on the request critical path. Place
            prefill and decode nodes in the same AZ and ideally the same cluster placement group —
            covered in <strong>section 23 (EC2 Topology &amp; Placement Groups)</strong> and the EFA
            sibling deep dive&apos;s topology material.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Wiring NIXL into vLLM: the kv-transfer-config</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM exposes the transport through <code>--kv-transfer-config</code>. The
            AWS-documented configuration selects <code>NixlConnector</code>, keeps the buffer on the
            GPU (<code>kv_buffer_device: cuda</code>), and forces NIXL traffic over EFA by naming the{' '}
            <code>LIBFABRIC</code> backend. The following is the producer/consumer pair from the
            Tier-1 EC2 guide (verbatim). <span>[Tier-1: AWS EC2 User Guide]</span>
          </Box>

          <Box variant="div">
            <pre
              style={{
                fontFamily: 'Monaco, Consolas, monospace',
                fontSize: '12px',
                lineHeight: 1.5,
                overflowX: 'auto',
                margin: 0,
              }}
            >
{`# Producer (prefiller)  +  Consumer (decoder)
# Both shown with kv_role: kv_both (symmetric) per the AWS guide
vllm serve <your-model> \\
  --port 8200 \\
  --enforce-eager \\
  --kv-transfer-config '{"kv_connector":"NixlConnector",
                         "kv_role":"kv_both",
                         "kv_buffer_device":"cuda",
                         "kv_connector_extra_config":{"backends":["LIBFABRIC"]}}'`}
            </pre>
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">kv_connector</Box>
              <Box variant="p">
                <code>NixlConnector</code> — vLLM&apos;s KV-transfer connector that delegates the
                actual block movement to NIXL. Its implementation lives in the vLLM source under{' '}
                <strong>&quot;Inside the Codebase → Distributed &amp; KV Transfer&quot;</strong>{' '}
                (section 14).
              </Box>
            </div>
            <div>
              <Box variant="h3">kv_role</Box>
              <Box variant="p">
                <code>kv_producer</code> on the prefiller, <code>kv_consumer</code> on the decoder.
                The AWS sample uses <code>kv_both</code> — symmetric, where a node can act as either,
                which is convenient for experiments where the role is not predetermined.{' '}
                <span>[Tier-1: AWS EC2 User Guide]</span>
              </Box>
            </div>
            <div>
              <Box variant="h3">backends</Box>
              <Box variant="p">
                <code>["LIBFABRIC"]</code> is the load-bearing flag: it routes NIXL traffic through
                libfabric&apos;s EFA provider rather than the default TCP/UCX path. With{' '}
                <code>kv_buffer_device: cuda</code> the transfer is GPU-to-GPU over EFA.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info">
            The same <code>LIBFABRIC</code> backend name is what the NIXL benchmark
            (<code>nixlbench --backend LIBFABRIC</code>) uses to validate the EFA path before you
            ever start vLLM — a useful pre-flight to confirm the fabric works end-to-end.{' '}
            <span>[Tier-1: AWS EC2 User Guide]</span>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Prerequisites &amp; versions</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            NIXL-over-EFA has hard version floors. Get these wrong and the{' '}
            <code>LIBFABRIC</code> backend simply will not initialize.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Announced minimums (Mar 2026)</Box>
              <ul>
                <li>
                  NIXL <strong>version 1.0.0 or higher</strong>{' '}
                  <span>[Tier-2: AWS What&apos;s New]</span>
                </li>
                <li>
                  EFA installer <strong>version 1.47.0 or higher</strong>{' '}
                  <span>[Tier-2: AWS What&apos;s New]</span>
                </li>
                <li>
                  No additional cost on EFA-enabled instances{' '}
                  <span>[Tier-2: AWS What&apos;s New]</span>
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">From the step-by-step EC2 guide</Box>
              <ul>
                <li>
                  Only <strong>Ubuntu 24.04 and Ubuntu 22.04</strong> base AMIs are supported{' '}
                  <span>[Tier-1: AWS EC2 User Guide]</span>
                </li>
                <li>
                  EFA supports <strong>NIXL 1.0.0 and later</strong>; the guide currently installs
                  the EFA installer at <code>1.48.0</code> (a superset of the 1.47.0 floor){' '}
                  <span>[Tier-1: AWS EC2 User Guide]</span>
                </li>
                <li>
                  libfabric installs to <code>/opt/amazon/efa</code>; build NIXL with{' '}
                  <code>-Dlibfabric_path=/opt/amazon/efa</code>{' '}
                  <span>[Tier-1: AWS EC2 User Guide]</span>
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            Full walkthrough — security group, GDRCopy, EFA installer, NIXL via PyPI or source, the
            nixlbench validation, and the vLLM serve step:{' '}
            <Link
              external
              href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html"
            >
              EFA and NIXL for inference on EC2 (accessed 2026-06-07)
            </Link>
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">GPU instance families for vLLM</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            EFA and NIXL-over-EFA are available on <strong>all EFA-enabled EC2 instance types</strong>{' '}
            <span>[Tier-2: AWS What&apos;s New]</span>, so the selection question is really
            about GPU memory (KV-cache capacity), intra-node NVLink bandwidth, and inter-node EFA
            bandwidth. The bandwidth figures below for P-family aggregate EFA are framed in the{' '}
            <strong>EFA sibling deep dive</strong>; confirm exact per-size EFA availability and GPU
            specs against the current EC2 documentation before quoting them in a design.
          </Box>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'family', header: 'Instance family', cell: (r: InstanceRow) => r.family },
              { id: 'gpu', header: 'GPU', cell: (r: InstanceRow) => r.gpu },
              { id: 'efa', header: 'EFA generation / bandwidth', cell: (r: InstanceRow) => r.efa },
              { id: 'use', header: 'vLLM use', cell: (r: InstanceRow) => r.use },
            ]}
            items={instanceRows}
            sortingDisabled
            header={<Header variant="h3">Family → EFA → vLLM use</Header>}
          />
          <Alert type="warning">
            Bandwidth and GPU-count values here are general guidance carried from the EFA sibling
            deep dive and public family descriptions — they are not all re-verified per-size in this
            section. Treat the EC2 instance-type documentation as the authoritative source for any
            number that lands in a capacity plan or a customer-facing doc.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What multi-node vLLM looks like on EKS with the AWS Deep Learning Containers"
          >
            Multi-node on EKS: DLCs + LeaderWorkerSet
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For Kubernetes, AWS publishes <strong>vLLM AWS Deep Learning Containers (DLCs)</strong> —
            optimized images with built-in support for tensor parallelism and pipeline parallelism
            across multiple GPUs and nodes. The recommended multi-node pattern is{' '}
            <strong>LeaderWorkerSet (LWS)</strong>, a custom Kubernetes resource that deploys vLLM in
            a distributed leader+workers configuration so a single model shard set spans several
            nodes. <span>[Tier-2: AWS ML Blog — vLLM DLCs on EKS]</span>
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Why LeaderWorkerSet</Box>
              <Box variant="p">
                A vLLM model that needs N GPUs across M nodes is not a stateless Deployment — the
                ranks must come up together and address each other. LWS models the group as one unit
                (one leader, K workers), which maps cleanly onto vLLM&apos;s multi-node TP/PP launch.{' '}
                <span>[Tier-2: AWS ML Blog]</span>
              </Box>
            </div>
            <div>
              <Box variant="h3">EFA on EKS</Box>
              <Box variant="p">
                The blog calls EFA &quot;essential for distributed workloads&quot; — the same wire
                NIXL uses. EFA-only secondary interfaces on EKS require a recent VPC CNI (Container
                Network Interface); see the EFA sibling deep dive for the EKS attachment specifics.{' '}
                <span>[Tier-2: AWS ML Blog]</span>
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            The blog&apos;s worked example uses <code>P4d.24xlarge</code> nodes (8x NVIDIA A100 each)
            in a managed node group. <span>[Tier-2: AWS ML Blog]</span> It does not publish a
            concrete ECR Public image URI in-text — pull the current DLC tag from the AWS Deep
            Learning Containers reference rather than hardcoding one here.
          </Alert>
          <Box variant="p">
            <Link
              external
              href="https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/"
            >
              Deploy LLMs on Amazon EKS using vLLM Deep Learning Containers (accessed 2026-06-07)
            </Link>{' '}
            — <span>[Tier-2: AWS ML Blog]</span>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The headline disaggregation result on AWS GPUs — labeled as blog-claimed"
          >
            Result: llm-d disaggregation on P5/P6
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS&apos;s disaggregated-inference blog (powered by <strong>llm-d</strong>) is the
            clearest end-to-end demonstration of NIXL-over-EFA carrying vLLM KV cache between
            prefill and decode pods. The architecture configures vLLM with{' '}
            <code>&quot;kv_connector&quot;:&quot;NixlConnector&quot;</code> and libfabric backends,
            performing point-to-point KV-cache transfers coordinated by a sidecar running alongside
            the decode instances. <span>[Tier-2: AWS ML Blog — llm-d]</span>
          </Box>
          <Alert type="success">
            <strong>Blog-claimed headline (project/blog result, not our measurement):</strong>{' '}
            llm-d&apos;s prefill/decode disaggregation path &quot;increases tokens per second by up
            to 70% as concurrency increases compared to using a standard vLLM deployment.&quot;{' '}
            <span>[Tier-2: AWS ML Blog — llm-d; attribute to the AWS blog]</span>
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Benchmark hardware</Box>
              <Box variant="p">
                The disaggregated-inference benchmark ran on an{' '}
                <code>ml.p6-b200.48xlarge</code> instance (NVIDIA Blackwell B200).{' '}
                <span>[Tier-2: AWS ML Blog]</span>
              </Box>
            </div>
            <div>
              <Box variant="h3">Topology tested</Box>
              <Box variant="p">
                4 prefill pods (tensor-parallel degree 1) and 1 decode pod (tensor-parallel degree
                4), connected via NIXL over EFA. <span>[Tier-2: AWS ML Blog]</span> The asymmetry
                reflects that prefill is compute-bound and parallelizes across replicas, while
                decode benefits from larger TP for the memory-bound generation phase (section 10).
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <Link
              external
              href="https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/"
            >
              Introducing disaggregated inference on AWS powered by llm-d (accessed 2026-06-07)
            </Link>{' '}
            — <span>[Tier-2: AWS ML Blog]</span>. The Kubernetes/llm-d control-plane side
            of this is covered in <strong>section 17 (llm-d, KServe &amp; Gateway API)</strong>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Why OS-bypass / GPUDirect RDMA matters here</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The reason NIXL-over-EFA is worth the setup cost is the same reason EFA exists for
            training: <strong>OS-bypass</strong>. The KV-transfer data path skips the kernel — the
            application talks to the EFA hardware directly through libfabric — and with{' '}
            <code>kv_buffer_device: cuda</code> plus GPUDirect RDMA the NIC reads and writes GPU HBM
            without bouncing through host memory. For disaggregation that is decisive: every token of
            output depends on the prefiller&apos;s KV cache arriving, so the transfer sits squarely
            on the latency-critical path.
          </Box>
          <ExpandableSection headerText="The full stack: NIXL → libfabric → EFA (deep dive)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>NIXL (NVIDIA Inference Xfer Library):</strong> an inference-shaped transfer
                library — it abstracts &quot;move these KV blocks from here to there&quot; across
                heterogeneous memory (GPU HBM, host DRAM, storage) and across multiple backends. vLLM
                calls it via <code>NixlConnector</code>.
              </Box>
              <Box variant="p">
                <strong>libfabric / the EFA provider:</strong> NIXL&apos;s <code>LIBFABRIC</code>{' '}
                backend lowers transfers onto libfabric, whose EFA provider speaks to the NIC. This is
                the same libfabric layer NCCL uses for training (via the aws-ofi-nccl plugin) — the
                EFA sibling deep dive walks the provider internals, including how SRD reliability and
                packet spraying are implemented.
              </Box>
              <Box variant="p">
                <strong>EFA + SRD:</strong> the wire. SRD (Scalable Reliable Datagram) sprays packets
                across many paths and reassembles out-of-order at the receiver, eliminating
                head-of-line blocking and taming tail latency — the property that makes
                collective-style and point-to-point transfers predictable at scale. Full treatment:
                the <strong>Elastic Fabric Adapter (EFA)</strong> sibling deep dive
                (<code>../efa/</code>), &quot;Architecture &amp; SRD Protocol.&quot;
              </Box>
              <Box variant="p">
                <strong>Control vs data path:</strong> as with all OS-bypass, only the data path
                bypasses the kernel. Setting up queue pairs and registering memory regions still goes
                through the kernel driver — a one-time cost at connection establishment, not on every
                KV block.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Operational gotchas (deep dive)">
            <SpaceBetween size="s">
              <Alert type="error">
                <strong>Self-referencing security group is mandatory.</strong> Every EFA instance
                must sit in a security group with a self-referencing rule allowing all traffic to and
                from itself, or EFA traffic fails silently. The Tier-1 NIXL guide builds exactly this
                in Step 1. <span>[Tier-1: AWS EC2 User Guide]</span>
              </Alert>
              <Alert type="warning">
                <strong>Same AZ only.</strong> EFA does not cross Availability Zone or VPC
                boundaries. Prefill and decode nodes must be co-located — see section 23 for
                placement groups and the EFA sibling deep dive for cross-subnet rules.
              </Alert>
              <Alert type="warning">
                <strong>Provision extra disk for the CUDA toolkit.</strong> The guide warns to add
                10–20 GiB or the NVIDIA driver / CUDA install fails with{' '}
                <code>insufficient disk space</code>. <span>[Tier-1: AWS EC2 User Guide]</span>
              </Alert>
              <Alert type="info">
                <strong>Validate the fabric before vLLM.</strong> Run{' '}
                <code>nixlbench --backend LIBFABRIC --initiator_seg_type VRAM</code> across two hosts
                first. If that GPU-to-GPU transfer does not run clean, vLLM&apos;s NixlConnector will
                not either. <span>[Tier-1: AWS EC2 User Guide]</span>
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Sources</Header>}>
        <SpaceBetween size="s">
          <Box variant="h3">Tier-1 — AWS / vLLM authoritative</Box>
          <ul>
            <li>
              <Link
                external
                href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html"
              >
                Get started with EFA and NIXL for inference workloads on Amazon EC2
              </Link>{' '}
              — Amazon EC2 User Guide (accessed 2026-06-07)
            </li>
            <li>
              <Link
                external
                href="https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/"
              >
                AWS announces support for NIXL with EFA
              </Link>{' '}
              — AWS What&apos;s New, posted Mar 19, 2026 (accessed 2026-06-07)
            </li>
            <li>
              <Link external href="https://docs.vllm.ai/en/stable/features/nixl_connector_usage/">
                vLLM NixlConnector usage guide
              </Link>{' '}
              — vLLM docs (accessed 2026-06-07)
            </li>
          </ul>
          <Box variant="h3">Tier-2 — AWS blogs</Box>
          <ul>
            <li>
              <Link
                external
                href="https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/"
              >
                Deploy LLMs on Amazon EKS using vLLM Deep Learning Containers
              </Link>{' '}
              — AWS ML Blog (accessed 2026-06-07)
            </li>
            <li>
              <Link
                external
                href="https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/"
              >
                Introducing disaggregated inference on AWS powered by llm-d
              </Link>{' '}
              — AWS ML Blog (accessed 2026-06-07)
            </li>
          </ul>
          <Box variant="p">
            Related sections in this deep dive: <strong>10 (Disaggregated Prefill / Decode)</strong>,{' '}
            <strong>14 (Inside the Codebase → Distributed &amp; KV Transfer, NixlConnector)</strong>,{' '}
            <strong>17 (llm-d, KServe &amp; Gateway API)</strong>,{' '}
            <strong>23 (EC2 Topology &amp; Placement Groups)</strong>, and the sibling{' '}
            <strong>Elastic Fabric Adapter (EFA)</strong> deep dive (<code>../efa/</code>) for SRD,
            packet-spraying, and the libfabric EFA provider.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
