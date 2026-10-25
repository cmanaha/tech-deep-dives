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

const NIXL = 'vllm/distributed/kv_transfer/kv_connector/v1/nixl';
const USAGE_DOC = 'docs/features/nixl_connector_usage.md';
const TREE = 'https://github.com/vllm-project/vllm/tree/v0.31.0';
const AWS_NIXL_GUIDE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nixl.html';
const AWS_NIXL_NEWS = 'https://aws.amazon.com/about-aws/whats-new/2026/03/aws-support-nixl-with-efa/';
const EC2_AC_SPECS = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const EC2_P6_PAGE = 'https://aws.amazon.com/ec2/instance-types/p6/';
const P6E_GB300_NEWS =
  'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/';
const EFA_CHANGELOG = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html';
const EFA_TYPES = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html';
const EKS_EFA = 'https://docs.aws.amazon.com/eks/latest/userguide/node-efa.html';
const DLC_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/';
const LLMD_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/';
const DLC_ECR = 'https://gallery.ecr.aws/deep-learning-containers/vllm';

interface InstanceRow {
  family: string;
  gpu: string;
  net: string;
  use: string;
}

const instanceRows: InstanceRow[] = [
  {
    family: 'P5 (p5.48xlarge)',
    gpu: '8x NVIDIA H100, 80 GiB each',
    net: '3,200 Gbps across 32 network cards',
    use: 'Single-node TP; multi-node TP and pipeline parallelism (PP), and disaggregated prefill/decode over EFA',
  },
  {
    family: 'P5e (p5e.48xlarge)',
    gpu: '8x NVIDIA H200, 141 GiB each',
    net: '3,200 Gbps across 32 network cards',
    use: 'P5 networking with more memory per GPU (141 vs 80 GiB) for KV cache',
  },
  {
    family: 'P5en (p5en.48xlarge)',
    gpu: '8x NVIDIA H200, 141 GiB each',
    net: '3,200 Gbps across 16 network cards',
    use: 'P5e GPUs and the same 3,200 Gbps, on 16 network cards rather than 32',
  },
  {
    family: 'P6-B200 (p6-b200.48xlarge)',
    gpu: '8x NVIDIA B200, 179 GiB each',
    net: '3,200 Gbps across 8 network cards',
    use: 'Blackwell; the llm-d disaggregation benchmark below ran on ml.p6-b200.48xlarge',
  },
  {
    family: 'P6-B300 (p6-b300.48xlarge)',
    gpu: '8x NVIDIA B300, 268 GiB each',
    net: '6,400 Gbps across 17 network cards',
    use: '6,400 Gbps against the 3,200 of P6-B200 for KV transfer',
  },
  {
    family: 'P6e-GB200 (p6e-gb200.36xlarge, UltraServers only)',
    gpu: '4x NVIDIA B200 per instance, 185 GiB each; an UltraServer puts up to 72 Blackwell GPUs in one NVLink domain',
    net: '3,200 Gbps across 17 network cards',
    use: 'NVLink reaches across the instances of an UltraServer, so the domain that bounds TP is larger than one instance',
  },
  {
    family: 'P6e-GB300 (UltraServers)',
    gpu: 'NVIDIA GB300 NVL72; AWS announces 1.5x the GPU memory and 1.5x the FP4 (4-bit floating point) compute (without sparsity) of P6e-GB200',
    net: 'Not listed in the EC2 instance-type specifications on 2026-10-16',
    use: 'Generally available since Dec 2, 2025, through your AWS sales representative',
  },
  {
    family: 'G6e (g6e.*)',
    gpu: '1x to 8x NVIDIA L40S, 44 GiB each',
    net: 'EFA on g6e.8xlarge and larger (25 to 400 Gbps); none on g6e.xlarge, 2xlarge or 4xlarge',
    use: 'Cost-efficient single-node serving of small and mid-size models; small multi-node clusters',
  },
];

function KvDataPathDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 480"
        role="img"
        aria-labelledby="kvd-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="kvd-title">
          A prefiller EC2 node and a decoder EC2 node in one Availability Zone, each running a vLLM
          engine with NixlConnector and KV buffers in GPU memory: kv_role kv_producer on the
          prefiller, kv_consumer on the decoder. By default the decoder posts an RDMA READ through
          NIXL&apos;s LIBFABRIC backend over EFA, and the KV blocks move from prefiller GPU HBM to
          decoder GPU HBM by GPUDirect RDMA. With NixlPushConnector the prefiller posts an RDMA
          WRITE instead; in both modes the bytes travel prefiller to decoder.
        </title>
        <style>
          {`
            .kvd-bg { fill: #ffffff; }
            .kvd-az { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; stroke-dasharray: 7 5; }
            .kvd-azl { fill: #0972d3; font: 600 12px sans-serif; letter-spacing: 0.5px; }
            .kvd-node { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
            .kvd-hd { fill: #232f3e; }
            .kvd-ht { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
            .kvd-hbm { fill: #e8f5e9; stroke: #1d8102; stroke-width: 1.4; }
            .kvd-efa { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.4; }
            .kvd-bt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
            .kvd-bs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
            .kvd-side { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
            .kvd-cfg { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
            .kvd-cfgm { fill: #0972d3; font: 600 11px sans-serif; text-anchor: middle; }
            .kvd-iarr { stroke: #5f6b7a; stroke-width: 1.6; fill: none; marker-end: url(#kvd-ah); }
            .kvd-req { stroke: #414d5c; stroke-width: 1.6; stroke-dasharray: 6 4; fill: none; marker-end: url(#kvd-ahr); }
            .kvd-data { stroke: #0972d3; stroke-width: 3; fill: none; marker-end: url(#kvd-ahx); }
            .kvd-reqt { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
            .kvd-datat { fill: #0972d3; font: 600 11px sans-serif; text-anchor: middle; }
            .kvd-leg { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
            .kvd-legb { font-weight: 600; }
          `}
        </style>
        <defs>
          <marker id="kvd-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker id="kvd-ahr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#414d5c" />
          </marker>
          <marker id="kvd-ahx" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
        </defs>

        <rect className="kvd-bg" x={0} y={0} width={860} height={480} rx={8} />

        {/* Availability Zone boundary */}
        <rect className="kvd-az" x={16} y={16} width={828} height={450} rx={12} />
        <text className="kvd-azl" x={34} y={40}>ONE AVAILABILITY ZONE, IDEALLY ONE CLUSTER PLACEMENT GROUP</text>

        {/* ---- Prefiller node ---- */}
        <rect className="kvd-node" x={40} y={58} width={280} height={320} rx={8} />
        <rect className="kvd-hd" x={40} y={58} width={280} height={34} rx={8} />
        <text className="kvd-ht" x={180} y={80}>PREFILLER NODE (EC2)</text>

        <text className="kvd-bt" x={180} y={114}>e.g. p5.48xlarge</text>
        <text className="kvd-bs" x={180} y={134}>vLLM engine &middot; NixlConnector</text>
        <text className="kvd-cfgm" x={180} y={152}>kv_role = kv_producer</text>
        <text className="kvd-cfg" x={180} y={170}>kv_buffer_device = cuda</text>

        <rect className="kvd-hbm" x={80} y={188} width={200} height={48} rx={6} />
        <text className="kvd-bt" x={180} y={209}>GPU HBM</text>
        <text className="kvd-bs" x={180} y={226}>KV blocks from prefill</text>

        <line className="kvd-iarr" x1={180} y1={236} x2={180} y2={284} />
        <text className="kvd-side" x={190} y={264}>GPUDirect RDMA</text>

        <rect className="kvd-efa" x={80} y={290} width={200} height={62} rx={6} />
        <text className="kvd-bt" x={180} y={313}>EFA interface</text>
        <text className="kvd-bs" x={180} y={331}>NIXL LIBFABRIC backend</text>
        <text className="kvd-bs" x={180} y={347}>OS-bypass data path</text>

        {/* ---- Decoder node ---- */}
        <rect className="kvd-node" x={540} y={58} width={280} height={320} rx={8} />
        <rect className="kvd-hd" x={540} y={58} width={280} height={34} rx={8} />
        <text className="kvd-ht" x={680} y={80}>DECODER NODE (EC2)</text>

        <text className="kvd-bt" x={680} y={114}>e.g. p5.48xlarge</text>
        <text className="kvd-bs" x={680} y={134}>vLLM engine &middot; NixlConnector</text>
        <text className="kvd-cfgm" x={680} y={152}>kv_role = kv_consumer</text>
        <text className="kvd-cfg" x={680} y={170}>kv_buffer_device = cuda</text>

        <rect className="kvd-hbm" x={580} y={188} width={200} height={48} rx={6} />
        <text className="kvd-bt" x={680} y={209}>GPU HBM</text>
        <text className="kvd-bs" x={680} y={226}>KV blocks for decode</text>

        <line className="kvd-iarr" x1={680} y1={290} x2={680} y2={240} />
        <text className="kvd-side" x={690} y={268}>GPUDirect RDMA</text>

        <rect className="kvd-efa" x={580} y={290} width={200} height={62} rx={6} />
        <text className="kvd-bt" x={680} y={313}>EFA interface</text>
        <text className="kvd-bs" x={680} y={331}>NIXL LIBFABRIC backend</text>
        <text className="kvd-bs" x={680} y={347}>OS-bypass data path</text>

        {/* ---- Between the EFA interfaces ---- */}
        <text className="kvd-reqt" x={430} y={296}>1. RDMA READ, posted by the decoder</text>
        <line className="kvd-req" x1={578} y1={308} x2={284} y2={308} />
        <line className="kvd-data" x1={282} y1={336} x2={574} y2={336} />
        <text className="kvd-datat" x={430} y={358}>2. KV bytes, prefiller HBM to decoder HBM</text>

        {/* ---- Legend ---- */}
        <text className="kvd-leg" x={430} y={406}>
          <tspan className="kvd-legb">Pull (default, NixlConnector):</tspan> the decoder posts the RDMA READ (arrow 1).
        </text>
        <text className="kvd-leg" x={430} y={426}>
          <tspan className="kvd-legb">Push (NixlPushConnector):</tspan> the prefiller posts an RDMA WRITE into the decoder&apos;s blocks instead.
        </text>
        <text className="kvd-leg" x={430} y={446}>Both modes move the KV bytes prefiller to decoder (arrow 2).</text>
      </svg>
    </div>
  );
}

export function AwsGpuEfaNixl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Move KV (key-value) cache between EC2 GPU instances fast enough that the network never gates decode: the instance to pick, the kv-transfer-config that puts NIXL (NVIDIA Inference Xfer Library) on EFA (Elastic Fabric Adapter), and the checks to pass before vLLM starts (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            22. vLLM on AWS GPUs, EFA &amp; NIXL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The architecture question:</strong> vLLM gives you a fast single-GPU and
            single-node engine. The moment a model no longer fits in one node&apos;s high-bandwidth
            memory (HBM), or you split a request across a <strong>prefiller</strong> and a{' '}
            <strong>decoder</strong> (section 10, Disaggregated Prefill / Decode), you are moving
            tensors between EC2 instances over the network. The outcome you want:{' '}
            <em>
              move KV cache blocks between nodes fast enough that the network never
              gates the GPUs.
            </em>{' '}
            On AWS that means <strong>EFA</strong> for the wire and <strong>NIXL</strong> for the
            inference-shaped transfer API on top of it.
          </Box>
          <Box variant="p">
            NIXL over EFA is an AWS-supported path, announced on March 19, 2026 for{' '}
            <em>&quot;all EFA-enabled EC2 instance types in all AWS regions at no additional cost&quot;</em>{' '}
            and integrating natively with frameworks including NVIDIA Dynamo, SGLang and vLLM{' '}
            <Cite tier={1} href={AWS_NIXL_NEWS}>
              AWS What&apos;s New: NIXL with EFA, Mar 19, 2026
            </Cite>
            . SGLang&apos;s two EFA routes, Mooncake and NIXL, are covered in the{' '}
            <Link external href="../sglang/">
              SGLang dive, section 22: PD and Wide EP over EFA
            </Link>
            . In vLLM the transfer is a KV connector. The default <code>NixlConnector</code> is the
            pull connector: the decoder issues RDMA (remote direct memory access) READs that copy
            the prefiller&apos;s KV blocks, over EFA when NIXL&apos;s <code>LIBFABRIC</code> backend
            is selected{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L339-L408')} kind="code">
              nixl/connector.py L339-L408
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/pull_worker.py`, 'L552-L565')} kind="code">
              pull_worker.py L552-L565
            </Cite>
            . <code>NixlPushConnector</code>, available from v0.24.0, reverses the initiator: the
            prefiller issues RDMA WRITEs into blocks the decoder allocated{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L714-L722')} kind="code">
              push_worker.py L714-L722
            </Cite>
            . Section 10 covers when to pick which; this section covers running either on AWS.
          </Box>
          <Box variant="p">
            The fabric itself (OS-bypass, SRD (Scalable Reliable Datagram), the libfabric EFA
            provider) is the subject of the{' '}
            <Link external href="../efa/">
              EFA deep dive
            </Link>
            . Here the subject is how vLLM uses it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which node posts the RDMA operation in each NIXL mode and the GPU-to-GPU path the KV bytes take, so you know which side issues and tracks each transfer"
          >
            The data path: who moves the KV blocks
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Disaggregated serving splits a request: the prefiller runs the compute-bound prompt
            pass and produces the KV cache; the decoder consumes it and runs the memory-bound
            token-by-token generation. Decode for a request cannot start until its KV blocks
            arrive, so the transfer sits on the latency-critical path. With{' '}
            <code>kv_buffer_device: cuda</code> the NIXL buffers are GPU memory{' '}
            <Cite tier={1} href={AWS_NIXL_GUIDE}>
              AWS EC2 User Guide: EFA and NIXL
            </Cite>
            . On the P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200 sizes in the table below,
            EFA moves the blocks by <strong>GPUDirect RDMA</strong>: GPU HBM to GPU HBM, without
            staging through host memory and without the kernel on the data path. G6e has EFA
            but no GPUDirect RDMA{' '}
            <Cite tier={1} href={EFA_TYPES}>
              AWS EC2 User Guide: EFA supported instance types
            </Cite>
            .
          </Box>

          <KvDataPathDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, illustrative, not measured. The full message sequence for both modes, with
            what the proxy forwards and who imports whose memory descriptors, is the NIXL pull and
            push diagram in section 10.
          </Box>

          <Box variant="p">
            <strong>The side that issues the operation tracks it.</strong> In pull mode the
            decoder&apos;s worker posts the NIXL <code>READ</code>, keeps the handle and collects
            finished and failed transfers in later engine steps{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/pull_worker.py`, 'L552-L565')} kind="code">
              pull_worker.py L552-L565
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L2903-L2905')} kind="code">
              base_worker.py L2903-L2905
            </Cite>
            . In push mode a <code>nixl-push-writer</code> thread on the prefiller posts the{' '}
            <code>WRITE</code>, tracks the handle so the prefiller can free its blocks once the
            writes finish, and logs <code>nixl-push-writer error; continuing</code> when its loop
            fails{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L146-L152')} kind="code">
              push_worker.py L146-L152
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L285-L286')} kind="code">
              L285-L286
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/push_worker.py`, 'L714-L724')} kind="code">
              L714-L724
            </Cite>
            . The connector code is walked through in{' '}
            <strong>Inside the Codebase &rarr; Distributed &amp; KV Transfer</strong> (section 14).
          </Box>

          <ExpandableSection headerText="The software stack under NixlConnector">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>NIXL</strong> is an inference-shaped transfer library: it abstracts
                &quot;move these KV blocks from here to there&quot; across memory types and across
                pluggable transport backends. Each vLLM engine registers its KV cache with NIXL
                once, at startup, for the configured backends{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L1812-L1824')} kind="code">
                  base_worker.py L1812-L1824
                </Cite>
                , so memory registration happens once per engine rather than once per transfer.
              </Box>
              <Box variant="p">
                <strong>libfabric and the EFA provider:</strong> NIXL&apos;s <code>LIBFABRIC</code>{' '}
                backend lowers transfers onto libfabric, which the EFA installer places under{' '}
                <code>/opt/amazon/efa</code>{' '}
                <Cite tier={1} href={AWS_NIXL_GUIDE}>
                  AWS EC2 User Guide: EFA and NIXL
                </Cite>
                . It is the same libfabric layer NCCL reaches through the aws-ofi-nccl plugin; the
                EFA deep dive covers both in &quot;libfabric and the EFA Provider&quot; and
                &quot;NCCL over EFA&quot;.
              </Box>
              <Box variant="p">
                <strong>EFA and SRD:</strong> the wire, covered in the EFA deep dive&apos;s
                &quot;SRD: The Transport Protocol&quot;.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info" header="Keep the prefiller and decoder close">
            Place prefill and decode nodes in the same Availability Zone (AZ), ideally the same
            cluster placement group. Section 23 (EC2 Topology &amp; Placement Groups) covers
            placement, and the{' '}
            <Link external href="../efa/">
              EFA deep dive
            </Link>{' '}
            covers the subnet and AZ rules EFA traffic follows.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size prefill and decode nodes by the three numbers that matter to vLLM: GPU memory for KV cache, how far NVLink reaches for tensor parallelism, and network bandwidth for KV transfer"
          >
            Pick the instance: GPU memory, NVLink reach, network bandwidth
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NIXL over EFA runs on every EFA-enabled instance type{' '}
            <Cite tier={1} href={AWS_NIXL_NEWS}>
              AWS What&apos;s New: NIXL with EFA
            </Cite>
            , so the choice comes down to GPU memory (KV-cache capacity, section 5), how far
            NVLink reaches (the bound on tensor parallelism (TP), section 9), and the network
            bandwidth that carries KV between nodes. GPU, memory and network figures come from{' '}
            <Cite tier={1} href={EC2_AC_SPECS}>
              EC2 accelerated computing instance specifications
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'family', header: 'Instance', cell: (r: InstanceRow) => r.family, minWidth: 160 },
              { id: 'gpu', header: 'GPUs and memory per GPU', cell: (r: InstanceRow) => r.gpu },
              { id: 'net', header: 'Network', cell: (r: InstanceRow) => r.net },
              { id: 'use', header: 'vLLM use', cell: (r: InstanceRow) => r.use },
            ]}
            items={instanceRows}
            sortingDisabled
          />
          <Box variant="small" color="text-body-secondary">
            P6e-GB200 UltraServer facts (UltraServer-only, 72 GPUs in one NVLink domain):{' '}
            <Cite tier={2} href={EC2_P6_PAGE} accessed="2026-10-17">
              EC2 P6 product page
            </Cite>
            . P6e-GB300:{' '}
            <Cite tier={1} href={P6E_GB300_NEWS}>
              AWS What&apos;s New: P6e-GB300 UltraServers, Dec 2, 2025
            </Cite>
            ; its 1.5x figures are AWS&apos;s announcement, not a measurement. Per-GPU HBM across
            these generations is compared in the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference deep dive
            </Link>
            .
          </Box>
          <Box variant="p">
            <strong>On GB-series UltraServers, KV can cross nodes over NVLink.</strong> vLLM&apos;s
            NIXL guide says GB-series GPUs support multi-node NVLink, that NIXL needs the KV cache
            registered through CUDA virtual memory management (VMM) to use it (set{' '}
            <code>--enable-cumem-allocator</code> or <code>--enable-sleep-mode</code>) plus{' '}
            <code>UCX_CUDA_IPC_ENABLE_MNNVL=y</code>, and that without them NIXL uses RDMA or TCP
            for cross-node KV{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L399-L401')}>
              nixl_connector_usage.md L399-L401
            </Cite>
            . Our reading: the variable is a UCX (Unified Communication X) setting, so this path
            assumes NIXL&apos;s default UCX backend rather than <code>LIBFABRIC</code>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The two serve commands that put a prefiller and a decoder on EFA, with the roles vLLM expects and the side-channel host each node must advertise"
          >
            Wiring NIXL into vLLM: the kv-transfer-config
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM selects the transport through <code>--kv-transfer-config</code>. The AWS
            guide&apos;s configuration names <code>NixlConnector</code>, keeps the buffer in GPU
            memory (<code>kv_buffer_device: cuda</code>) and sets the NIXL backend to{' '}
            <code>LIBFABRIC</code>, <em>&quot;which enables NIXL traffic to go over EFA&quot;</em>{' '}
            <Cite tier={1} href={AWS_NIXL_GUIDE}>
              AWS EC2 User Guide: EFA and NIXL
            </Cite>
            . These are its producer and consumer commands with the roles vLLM asks for and the
            side-channel host set. A proxy in front routes each request to a prefiller and a
            decoder (section 10).
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
{`# Prefiller (P), on its own host
VLLM_NIXL_SIDE_CHANNEL_HOST=<this host's IP> \\
vllm serve <your-model> \\
  --port 8200 \\
  --enforce-eager \\
  --kv-transfer-config '{"kv_connector":"NixlConnector",
                         "kv_role":"kv_producer",
                         "kv_buffer_device":"cuda",
                         "kv_connector_extra_config":{"backends":["LIBFABRIC"]}}'

# Decoder (D), on a second host: same command, consumer role
VLLM_NIXL_SIDE_CHANNEL_HOST=<this host's IP> \\
vllm serve <your-model> \\
  --port 8200 \\
  --enforce-eager \\
  --kv-transfer-config '{"kv_connector":"NixlConnector",
                         "kv_role":"kv_consumer",
                         "kv_buffer_device":"cuda",
                         "kv_connector_extra_config":{"backends":["LIBFABRIC"]}}'`}
            </pre>
          </Box>
          <Box variant="small" color="text-body-secondary">
            Adapted from the AWS guide&apos;s producer and consumer configurations, which set{' '}
            <code>kv_role</code> to <code>kv_both</code> on both nodes and set no side-channel
            host. Not run for this dive.
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">kv_connector</Box>
              <Box variant="p">
                <code>NixlConnector</code> (pull, an alias of <code>NixlPullConnector</code>) or{' '}
                <code>NixlPushConnector</code> (push). Set the same value on every prefiller and
                decoder: the handshake hashes the transfer mode and refuses to pair different modes{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/metadata.py`, 'L142-L199')} kind="code">
                  nixl/metadata.py L142-L199
                </Cite>
                . Both live in the <code>nixl/</code> package, a shared base plus pull and push
                scheduler and worker files{' '}
                <Cite tier={1} href={`${TREE}/${NIXL}`}>
                  nixl/ package
                </Cite>
                , walked through in section 14.
              </Box>
            </div>
            <div>
              <Box variant="h3">kv_role</Box>
              <Box variant="p">
                <code>kv_producer</code> on prefillers, <code>kv_consumer</code> on decoders. The
                AWS guide sets <code>kv_both</code>, which it describes as{' '}
                <em>
                  &quot;symmetric functionality where the connector can act as both producer and
                  consumer&quot;
                </em>{' '}
                <Cite tier={1} href={AWS_NIXL_GUIDE} kind="doc-code-conflict">
                  AWS EC2 User Guide: EFA and NIXL
                </Cite>
                . vLLM deprecates <code>kv_both</code> for NIXL and logs that it{' '}
                <em>&quot;will be removed in a future release&quot;</em>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/connector.py`, 'L94-L100')} kind="code">
                  nixl/connector.py L94-L100
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">backends</Box>
              <Box variant="p">
                NIXL&apos;s default backend in vLLM is <code>[&quot;UCX&quot;]</code>{' '}
                <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L560-L562')} kind="code">
                  base_worker.py L560-L562
                </Cite>
                . <code>LIBFABRIC</code> is selected in{' '}
                <code>kv_connector_extra_config.backends</code>, as the AWS guide&apos;s
                configuration does{' '}
                <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L39-L52')}>
                  nixl_connector_usage.md L39-L52
                </Cite>
                . With <code>kv_buffer_device: cuda</code> the transfer runs GPU to GPU over EFA
                on the instance types with GPUDirect RDMA (the data path above).
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="Set the side-channel host on every node">
            Before the first transfer, the two engines exchange NIXL metadata over a ZeroMQ (ZMQ)
            side channel{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_worker.py`, 'L1049-L1068')} kind="code">
              base_worker.py L1049-L1068
            </Cite>
            . Each instance advertises <code>VLLM_NIXL_SIDE_CHANNEL_HOST</code>, default{' '}
            <code>localhost</code>, on <code>VLLM_NIXL_SIDE_CHANNEL_PORT</code>, default 5600 plus
            the data-parallel (DP) index{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1700-L1707')} kind="code">
              envs.py L1700-L1707
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/base_scheduler.py`, 'L75-L78')} kind="code">
              base_scheduler.py L75-L78
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(`${NIXL}/pull_scheduler.py`, 'L284-L285')} kind="code">
              pull_scheduler.py L284-L285
            </Cite>
            . vLLM&apos;s guide says to set the host when prefiller and decoder are on different
            machines{' '}
            <Cite tier={1} href={vllmUrl(USAGE_DOC, 'L113-L123')}>
              nixl_connector_usage.md L113-L123
            </Cite>
            . On Kubernetes, the llm-d blog&apos;s values set it from the pod&apos;s{' '}
            <code>status.podIP</code> and expose container port 5600{' '}
            <Cite tier={2} href={LLMD_BLOG}>
              AWS ML Blog: disaggregated inference with llm-d
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What a published prefill/decode deployment on P6-B200 claims, under which test conditions, and the configuration it ran, labeled as an AWS blog result"
          >
            Result: llm-d disaggregation on AWS GPUs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS&apos;s disaggregated-inference blog (powered by <strong>llm-d</strong>) runs NIXL
            over EFA between vLLM prefill and decode pods. It configures vLLM with{' '}
            <code>NixlConnector</code> and the <code>LIBFABRIC</code> backend, and{' '}
            <em>
              &quot;the transfer is coordinated using a sidecar running alongside decode
              instances&quot;
            </em>{' '}
            <Cite tier={2} href={LLMD_BLOG}>
              AWS ML Blog: disaggregated inference with llm-d
            </Cite>
            .
          </Box>
          <Alert type="success" header="Blog-claimed headline (AWS blog result, not our measurement)">
            llm-d&apos;s prefill/decode disaggregation path{' '}
            <em>
              &quot;increases tokens per second by up to 70% as concurrency increases compared to
              using a standard vLLM deployment&quot;
            </em>
            , load-tested with 1024 input and 1024 output tokens up to a concurrency of 128{' '}
            <Cite tier={2} href={LLMD_BLOG}>
              AWS ML Blog: disaggregated inference with llm-d
            </Cite>
            .
          </Alert>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Benchmark hardware</Box>
              <Box variant="p">
                OpenAI&apos;s GPT-OSS on an <code>ml.p6-b200.48xlarge</code> (NVIDIA Blackwell
                B200); the baseline is vLLM at tensor-parallel degree 4{' '}
                <Cite tier={2} href={LLMD_BLOG}>
                  AWS ML Blog
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Topology tested</Box>
              <Box variant="p">
                4 prefill pods (tensor-parallel degree 1) and 1 decode pod (tensor-parallel degree
                4), connected using NIXL with libfabric over EFA{' '}
                <Cite tier={2} href={LLMD_BLOG}>
                  AWS ML Blog
                </Cite>
                . The asymmetry follows the phase profiles in section 10: prefill is
                compute-bound and spreads across replicas, decode is memory-bound and gains from
                wider TP.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            The blog&apos;s values set <code>kv_role</code> to <code>kv_both</code>, the value vLLM
            deprecates for NIXL, so give prefill pods <code>kv_producer</code> and decode pods{' '}
            <code>kv_consumer</code> when you adapt it. The Kubernetes and llm-d control plane is
            section 17 (Kubernetes: llm-d, KServe &amp; Gateway API).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run one vLLM model across several Amazon EKS (Elastic Kubernetes Service) nodes with AWS's vLLM Deep Learning Containers (DLCs) and a LeaderWorkerSet, and give the pods EFA"
          >
            Multi-node on EKS: DLCs and LeaderWorkerSet
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For Kubernetes, AWS publishes <strong>vLLM DLCs</strong>,{' '}
            <em>
              &quot;specifically optimized for high-performance inference, with built-in support
              for tensor parallelism and pipeline parallelism across multiple GPUs and nodes&quot;
            </em>
            . The multi-node pattern is <strong>LeaderWorkerSet (LWS)</strong>, a custom
            Kubernetes resource that deploys vLLM in a distributed leader-and-workers
            configuration so one model&apos;s shards span several nodes{' '}
            <Cite tier={2} href={DLC_BLOG}>
              AWS ML Blog: vLLM DLCs on EKS
            </Cite>
            .
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Why LeaderWorkerSet</Box>
              <Box variant="p">
                A vLLM model that needs N GPUs across M nodes is not a stateless Deployment: the
                ranks must come up together and address each other. LWS models the group as one
                unit (one leader, K workers), which maps onto vLLM&apos;s multi-node TP and PP
                launch.
              </Box>
            </div>
            <div>
              <Box variant="h3">EFA on EKS</Box>
              <Box variant="p">
                The blog places its EFA node group in a private subnet&apos;s Availability Zone to
                support{' '}
                <em>
                  &quot;the high-throughput, low-latency communication essential for distributed
                  training and inference with LLMs&quot;
                </em>{' '}
                <Cite tier={2} href={DLC_BLOG}>
                  AWS ML Blog
                </Cite>
                . EFA-only secondary interfaces on Amazon EKS need VPC
                CNI (Virtual Private Cloud Container Network Interface) version 1.18.5 or later{' '}
                <Cite tier={1} href={EKS_EFA}>
                  Amazon EKS User Guide: EFA
                </Cite>
                . Provisioning EFA nodes is section 24 (vLLM on Amazon EKS).
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="Pick the image tag yourself">
            The blog&apos;s worked example uses <code>P4d.24xlarge</code> nodes (8x NVIDIA A100
            each) in a managed node group and names no image URI in its text{' '}
            <Cite tier={2} href={DLC_BLOG}>
              AWS ML Blog
            </Cite>
            . On 2026-10-16 the newest EC2 vLLM DLC in Amazon ECR (Elastic Container Registry)
            Public was <code>vllm:0.31.0-gpu-py312-cu130-ubuntu24.04-ec2-v1.2-soci</code>, the
            vLLM release this dive describes{' '}
            <Cite tier={1} href={DLC_ECR}>
              ECR Public: deep-learning-containers/vllm
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The bring-up order the AWS guide walks, the version floors to meet, and the two-host test to pass before the first vLLM transfer"
          >
            Bring-up: from security group to the first transfer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Version floors</Box>
              <Box variant="p">
                AWS supports <em>&quot;NIXL version 1.0.0 or higher with EFA installer version
                1.47.0 or higher&quot;</em>, at no additional cost{' '}
                <Cite tier={1} href={AWS_NIXL_NEWS}>
                  AWS What&apos;s New: NIXL with EFA
                </Cite>
                , and the guide adds <em>&quot;EFA supports only NIXL 1.0.0 and later&quot;</em>{' '}
                <Cite tier={1} href={AWS_NIXL_GUIDE}>
                  AWS EC2 User Guide: EFA and NIXL
                </Cite>
                . The guide downloads the latest stable EFA installer; the libfabric and
                aws-ofi-nccl versions each release bundles are in the{' '}
                <Cite tier={1} href={EFA_CHANGELOG}>
                  EFA installer changelog
                </Cite>
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Base image</Box>
              <Box variant="p">
                Supported base AMIs (Amazon Machine Images): Amazon Linux 2023, Ubuntu 24.04 and
                Ubuntu 22.04. On Amazon Linux 2023 the guide installs NIXL with{' '}
                <code>pip3.11</code>, and NIXL&apos;s libraries land in <code>lib64</code>, so the
                library paths differ from Ubuntu&apos;s{' '}
                <Cite tier={1} href={AWS_NIXL_GUIDE}>
                  AWS EC2 User Guide: EFA and NIXL
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="h3">In order</Box>
          <ol>
            <li>
              <strong>A security group that references itself.</strong> Its self-referencing
              inbound and outbound rules <em>&quot;are mandatory for EFA to function. Without these
              rules, EFA traffic between instances will be blocked&quot;</em>{' '}
              <Cite tier={1} href={AWS_NIXL_GUIDE}>
                AWS EC2 User Guide: EFA and NIXL
              </Cite>
              .
            </li>
            <li>
              <strong>Extra disk for the CUDA toolkit.</strong> Provision an additional 10 to 20
              GiB, or the NVIDIA driver and CUDA install fails with{' '}
              <code>insufficient disk space</code>{' '}
              <Cite tier={1} href={AWS_NIXL_GUIDE}>
                AWS EC2 User Guide: EFA and NIXL
              </Cite>
              .
            </li>
            <li>
              <strong>Drivers, GDRCopy, the EFA installer, then NIXL</strong> from PyPI or source;
              a source build points at libfabric with <code>-Dlibfabric_path=/opt/amazon/efa</code>{' '}
              <Cite tier={1} href={AWS_NIXL_GUIDE}>
                AWS EC2 User Guide: EFA and NIXL
              </Cite>
              .
            </li>
            <li>
              <strong>Validate the fabric before vLLM.</strong> Run{' '}
              <code>nixlbench --backend LIBFABRIC --initiator_seg_type VRAM</code> on two hosts,
              with an etcd server on the first host coordinating them{' '}
              <Cite tier={1} href={AWS_NIXL_GUIDE}>
                AWS EC2 User Guide: EFA and NIXL
              </Cite>
              . If that cross-host transfer from GPU memory does not run clean,{' '}
              <code>NixlConnector</code> will not either.
            </li>
            <li>
              <strong>Start the prefiller and the decoder</strong> with the two commands above, in
              the same Availability Zone, each with its own side-channel host.
            </li>
          </ol>
          <Box variant="p">
            <strong>Where to go next.</strong> Choosing pull or push and running the proxy is
            section 10; the connector code is section 14 (Inside the Codebase &rarr; Distributed
            &amp; KV Transfer); placement groups are section 23; EKS provisioning is section 24;
            SRD, the libfabric EFA provider and the AZ rules are the{' '}
            <Link external href="../efa/">
              EFA deep dive
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
