import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

// AWS documentation is unversioned; every page below was read on 2026-10-16.
const EKS_QS = 'https://docs.aws.amazon.com/eks/latest/userguide/ml-inference-load-serve-model.html';
const EKS_BP = 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html';
const EKS_NODECLASS = 'https://docs.aws.amazon.com/eks/latest/userguide/create-node-class.html';
const DLC_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/';
const LLMD_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/';
const ECR_DLC = 'https://gallery.ecr.aws/deep-learning-containers/vllm';

// Karpenter, pinned to the v1.15.0 tag. Markdown pages use ?plain=1 so line anchors resolve.
const KARP_DOC =
  'https://github.com/aws/karpenter-provider-aws/blob/v1.15.0/website/content/en/docs/concepts/nodeclasses.md?plain=1';
const KARP_CRD =
  'https://github.com/aws/karpenter-provider-aws/blob/v1.15.0/pkg/apis/crds/karpenter.k8s.aws_ec2nodeclasses.yaml';
const KARP_1110 = 'https://github.com/aws/karpenter-provider-aws/releases/tag/v1.11.0';

// LeaderWorkerSet, pinned to the v1.0.0 tag.
const LWS_DS_DOC =
  'https://github.com/kubernetes-sigs/lws/blob/v1.0.0/site/content/en/docs/concepts/disaggregatedset/_index.md?plain=1';
const LWS_VLLM_EXAMPLE =
  'https://github.com/kubernetes-sigs/lws/blob/v1.0.0/docs/examples/leaderworkerset/basic/vllm.yaml';

const LOADERS = 'vllm/model_executor/model_loader/__init__.py';
const LOGGERS = 'vllm/v1/metrics/loggers.py';

function EksRequestProvisioningDiagram() {
  const blue = '#0972d3';
  const blueDark = '#065299';
  const teal = '#2ea597';
  const tealDark = '#1f7a70';
  const secondary = '#5f6b7a';
  const text = '#16191f';
  const blueFill = '#f2f8fd';
  const tealFill = '#e6f4f2';
  const amberFill = '#fbf3e6';
  const amberStroke = '#8b6c00';
  const border = '#879596';

  return (
    <svg
      role="img"
      aria-labelledby="eks-reqprov-title"
      style={{ width: '100%', minWidth: 680, height: 'auto' }}
      viewBox="0 0 900 566"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="eks-reqprov-title">
        vLLM on Amazon EKS. The request path runs top down from the client through an ALB or
        gateway and LiteLLM to vLLM pods: a single-replica pod on a Karpenter GPU node, or a
        multi-node LeaderWorkerSet on EFA nodes inside one cluster placement group. Karpenter
        launches both node kinds. The gpu-inf NodePool launches GPU nodes anywhere; the EFA
        NodePool references its own EC2NodeClass, which selects one pre-created cluster placement
        group with placementGroupSelector and adds EFA interfaces. Model weights stream from
        Amazon S3 into each pod at start.
      </title>
      <defs>
        <marker id="eks-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={secondary} />
        </marker>
      </defs>

      {/* light ground so text never depends on the page colour */}
      <rect x={0} y={0} width={900} height={566} rx={8} fill="#ffffff" />

      {/* ---- Phase labels ---- */}
      <text x={250} y={26} textAnchor="middle" fontSize={12} fontWeight="bold" fill={secondary} fontFamily="sans-serif" letterSpacing="0.5">REQUEST PATH (top down)</text>
      <text x={705} y={26} textAnchor="middle" fontSize={12} fontWeight="bold" fill={secondary} fontFamily="sans-serif" letterSpacing="0.5">PROVISIONING PATH (top down)</text>
      <line x1={500} y1={40} x2={500} y2={552} stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5 4" />

      {/* ================= REQUEST PATH (left column) ================= */}
      <rect x={30} y={50} width={130} height={48} rx={8} fill={blueFill} stroke={blue} strokeWidth={1.5} />
      <text x={95} y={79} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">client</text>

      <rect x={30} y={130} width={420} height={56} rx={8} fill={blue} stroke={blueDark} strokeWidth={1.5} />
      <text x={240} y={154} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">ALB / Gateway</text>
      <text x={240} y={173} textAnchor="middle" fontSize={11} fill="#ffffff" fontFamily="sans-serif">L7 ingress / Gateway API Inference Extension</text>

      <rect x={30} y={218} width={420} height={56} rx={8} fill={blue} stroke={blueDark} strokeWidth={1.5} />
      <text x={240} y={242} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">LiteLLM (API gateway)</text>
      <text x={240} y={261} textAnchor="middle" fontSize={11} fill="#ffffff" fontFamily="sans-serif">virtual keys / budgets / fallback &middot; OpenAI /v1</text>

      <line x1={95} y1={98} x2={95} y2={128} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <line x1={240} y1={186} x2={240} y2={216} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />

      <text x={245} y={296} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">routes to vLLM pods</text>

      {/* single-replica vLLM */}
      <rect x={20} y={312} width={210} height={74} rx={8} fill={blueFill} stroke={blue} strokeWidth={1.5} />
      <text x={125} y={336} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">single-replica vLLM</text>
      <text x={125} y={356} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">1 GPU / TP=1</text>
      <text x={125} y={374} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">OpenAI /v1</text>

      {/* multi-node vLLM */}
      <rect x={250} y={312} width={230} height={74} rx={8} fill={tealFill} stroke={teal} strokeWidth={1.5} />
      <text x={365} y={336} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">multi-node vLLM</text>
      <text x={365} y={356} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">LeaderWorkerSet</text>
      <text x={365} y={374} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">TP &times; PP across nodes</text>

      <line x1={125} y1={274} x2={125} y2={310} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <line x1={365} y1={274} x2={365} y2={310} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />

      {/* node the single-replica pod lands on */}
      <rect x={20} y={430} width={210} height={88} rx={8} fill="#ffffff" stroke={border} strokeWidth={1.5} />
      <text x={125} y={462} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily="sans-serif">Karpenter GPU node</text>
      <text x={125} y={482} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">NodePool gpu-inf</text>
      <text x={125} y={499} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">g6e / p-series</text>

      {/* nodes the multi-node replica lands on */}
      <rect x={250} y={430} width={230} height={88} rx={8} fill={tealFill} stroke={tealDark} strokeWidth={1.5} />
      <text x={365} y={454} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily="sans-serif">EFA nodes in a cluster PG</text>
      <text x={365} y={473} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">Karpenter EFA pool</text>
      <text x={365} y={490} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">or a managed node group</text>
      <text x={365} y={507} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">NIXL / NCCL over EFA (&sect;22)</text>

      <line x1={125} y1={386} x2={125} y2={428} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <line x1={365} y1={386} x2={365} y2={428} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />

      <text x={250} y={546} textAnchor="middle" fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">Karpenter launches both pools; the EFA pool selects one placement group</text>

      {/* ================= PROVISIONING PATH (right column) ================= */}
      {/* NodePools */}
      <rect x={530} y={48} width={350} height={76} rx={8} fill={blueFill} stroke={blue} strokeWidth={1.5} />
      <text x={705} y={72} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Karpenter NodePools</text>
      <text x={705} y={92} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">gpu-inf: g / p series, GPU taint</text>
      <text x={705} y={110} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">efa: its own EC2NodeClass</text>

      {/* gpu-inf bypass straight to the nodes */}
      <line x1={548} y1={124} x2={548} y2={364} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={556} y={248} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">gpu-inf</text>

      {/* EFA pool chain */}
      <line x1={745} y1={124} x2={745} y2={156} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={757} y={145} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">efa pool</text>

      <rect x={610} y={158} width={270} height={76} rx={8} fill={tealFill} stroke={teal} strokeWidth={1.5} />
      <text x={745} y={181} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">EC2NodeClass, EFA pool</text>
      <text x={745} y={201} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">placementGroupSelector</text>
      <text x={745} y={219} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">networkInterfaces: efa-only</text>

      <line x1={745} y1={234} x2={745} y2={268} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={757} y={256} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">selects by name or id</text>

      <rect x={610} y={270} width={270} height={62} rx={8} fill={amberFill} stroke={amberStroke} strokeWidth={1.5} strokeDasharray="6 4" />
      <text x={745} y={294} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">cluster placement group</text>
      <text x={745} y={314} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">pre-created with IaC (&sect;23)</text>

      <line x1={745} y1={332} x2={745} y2={364} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={757} y={353} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">launch target</text>

      {/* launched nodes */}
      <rect x={530} y={366} width={350} height={62} rx={8} fill="#ffffff" stroke={border} strokeWidth={1.5} />
      <text x={705} y={390} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">GPU nodes, launched just-in-time</text>
      <text x={705} y={410} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">efa pool nodes sit inside the placement group</text>

      {/* weights */}
      <line x1={705} y1={466} x2={705} y2={430} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={717} y={451} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">streamed in at pod start</text>

      <rect x={530} y={466} width={350} height={60} rx={8} fill={amberFill} stroke={amberStroke} strokeWidth={1.5} />
      <text x={705} y={490} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Amazon S3 (model weights)</text>
      <text x={705} y={510} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">Run:ai Model Streamer &middot; Mountpoint &middot; FSx-linked</text>
    </svg>
  );
}

export function AwsEks() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Map each production concern to the EKS mechanism that implements it, and let Karpenter autoscale both single-node replicas and multi-node EFA replicas inside a cluster placement group (verified against vLLM v0.31.0, commit db9527a4, Karpenter v1.15.0 and LeaderWorkerSet v1.0.0, 2026-10-16)"
          >
            24. vLLM on Amazon EKS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The framing in one sentence:</strong> running vLLM on Amazon EKS (Elastic
            Kubernetes Service) is the conceptual stack from sections 16 and 17 (the Kubernetes
            operator and router layers) landed onto the AWS data plane from sections 22 and 23
            (GPUs, EFA (Elastic Fabric Adapter) and placement groups), wired together with five
            EKS primitives: <strong>AWS vLLM Deep Learning Containers (DLCs)</strong> as the image,{' '}
            <strong>Karpenter</strong> (or EKS Auto Mode) for GPU node autoscaling,{' '}
            <strong>LeaderWorkerSet</strong> on EFA nodes inside a cluster placement group for
            multi-node serving, a <strong>gateway</strong> out front, and{' '}
            <strong>Amazon S3</strong> for model weights. The EKS-specific content is{' '}
            <em>which AWS knob implements which concept</em>.
          </Box>
          <Box variant="p">
            <strong>Why EKS rather than raw EC2 or SageMaker:</strong> you reach for EKS when you
            already run platform workloads on Kubernetes and want vLLM under the same scheduler,
            IAM (Identity and Access Management), networking and GitOps surface as everything else.
            The trade is that you assemble the platform layer (device plugins, autoscaler, gateway,
            monitoring) instead of buying it; the two AWS walkthroughs below remove most of that
            assembly cost.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where a request goes, and where the node under each vLLM pod comes from, for one-node and multi-node replicas"
          >
            The request and provisioning path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read both columns top down. On the left, a request passes the ALB (Application Load
            Balancer) or gateway and LiteLLM to a single-replica pod or to a multi-node
            LeaderWorkerSet split by TP (tensor parallel) and PP (pipeline parallel), on EFA nodes
            that carry NCCL (NVIDIA Collective Communications Library) and NIXL (NVIDIA Inference
            Xfer Library) traffic. On the right,
            Karpenter launches the nodes under both. The multi-node pool gets its own EC2NodeClass,
            whose <code>placementGroupSelector</code> names one cluster placement group you created
            beforehand and whose <code>networkInterfaces</code> add the EFA interfaces{' '}
            <Cite tier={1} href={`${KARP_DOC}#L989-L1021`}>
              Karpenter v1.15.0 docs: EC2NodeClass placementGroupSelector
            </Cite>
            . Karpenter selects the placement group (PG) by name or id; creating it stays with
            your IaC (infrastructure as code). The field is available from Karpenter v1.11.0{' '}
            <Cite tier={1} href={KARP_1110}>
              Karpenter v1.11.0 release notes: Placement Group Support
            </Cite>
            . EKS Auto Mode&apos;s NodeClass carries the same two fields,{' '}
            <code>placementGroupSelector</code> and <code>networkInterfaces</code> with{' '}
            <code>efa-only</code>{' '}
            <Cite tier={1} href={EKS_NODECLASS} accessed="2026-10-18">
              EKS User Guide: Create a Node Class
            </Cite>
            .
          </Box>

          <div style={{ overflowX: 'auto' }}>
            <EksRequestProvisioningDiagram />
          </div>

          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured. The single-replica path (ALB, vLLM on a
            Karpenter GPU node, weights streamed from S3) is the EKS vLLM quickstart&apos;s shape{' '}
            <Cite tier={1} href={EKS_QS}>
              EKS User Guide: Load &amp; Serve Models on Amazon EKS
            </Cite>
            . The multi-node path (LeaderWorkerSet on EFA nodes) is the DLC blog&apos;s shape{' '}
            <Cite tier={2} href={DLC_BLOG}>
              AWS ML blog: Deploy LLMs on Amazon EKS using vLLM DLCs
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each AWS walkthrough hands you to copy, one for a single replica and one for a multi-node replica"
          >
            The two AWS-authored reference deployments
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The two walkthroughs target the single-node and multi-node ends of the same spectrum,
            and where they differ (Karpenter or a managed node group, S3 streaming or FSx for
            Lustre, one pod or a LeaderWorkerSet) maps onto that split.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">EKS quickstart (single replica)</Box>
              <ul>
                <li>
                  <strong>Image:</strong> AWS vLLM DLC{' '}
                  <code>{'public.ecr.aws/deep-learning-containers/vllm:0.21.0-gpu-py312-cu130-ubuntu22.04-ec2-v1.0-soci'}</code>{' '}
                  (vLLM 0.21.0, CUDA 13.0, SOCI (Seekable OCI) enabled for fast pulls). The newest
                  EC2 vLLM DLC on public ECR (Elastic Container Registry) carries vLLM 0.31.0:{' '}
                  <code>{'0.31.0-gpu-py312-cu130-ubuntu24.04-ec2-v1.2-soci'}</code>, pushed
                  2026-10-15{' '}
                  <Cite tier={1} href={ECR_DLC}>
                    Amazon ECR Public: deep-learning-containers/vllm
                  </Cite>
                  .
                </li>
                <li>
                  <strong>Compute:</strong> Karpenter NodePool <code>gpu-inf</code>, written for
                  both EKS Auto Mode and self-managed Karpenter; the example node is a{' '}
                  <code>g6e.4xlarge</code>.
                </li>
                <li>
                  <strong>Weights:</strong> downloaded from Hugging Face to S3, then streamed S3
                  &rarr; GPU by Run:ai Model Streamer (<code>--load-format=runai_streamer</code>).
                </li>
                <li>
                  <strong>Front door / observability:</strong> Open WebUI on the OpenAI-compatible
                  API; kube-prometheus-stack plus the community vLLM Grafana dashboard.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">DLC blog (multi-node)</Box>
              <ul>
                <li>
                  <strong>Image:</strong> vLLM AWS DLCs (the post pins no image tag).
                </li>
                <li>
                  <strong>Compute:</strong> <code>p4d.24xlarge</code> (8&times; NVIDIA A100) in an
                  eksctl <strong>managed node group</strong>.
                </li>
                <li>
                  <strong>Weights:</strong> an FSx for Lustre file system, filled when the pod
                  first starts (DeepSeek-R1-Distill-Qwen-32B).
                </li>
                <li>
                  <strong>Multi-node / front door:</strong> LeaderWorkerSet for distributed serving;
                  an ALB through the AWS Load Balancer Controller. EFA is cited for lower latency
                  and higher throughput, with no numbers.
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Box variant="small">
            <Cite tier={1} href={EKS_QS}>
              EKS User Guide: Load &amp; Serve Models on Amazon EKS
            </Cite>
            ;{' '}
            <Cite tier={2} href={DLC_BLOG}>
              AWS ML blog: Deploy LLMs on Amazon EKS using vLLM Deep Learning Containers
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The table to keep open while you build: each production concern, the EKS primitive that implements it, and the section that explains the concept"
          >
            Concern &rarr; EKS mechanism
          </Header>
        }
      >
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'concern', header: 'Concern', cell: (i) => <strong>{i.concern}</strong> },
            { id: 'mech', header: 'EKS mechanism', cell: (i) => i.mech },
            { id: 'tier', header: 'Source', cell: (i) => i.tier },
          ]}
          items={[
            {
              concern: 'Container image',
              mech: (
                <span>
                  AWS vLLM DLCs from <code>public.ecr.aws/deep-learning-containers/vllm</code>:
                  pinned vLLM and CUDA, security-patched, SOCI-enabled for fast image pull.
                </span>
              ),
              tier: 'Tier 1: EKS quickstart, ECR Public',
            },
            {
              concern: 'GPU node autoscaling',
              mech: (
                <span>
                  Karpenter NodePool with{' '}
                  <code>karpenter.k8s.aws/instance-category In [&quot;g&quot;,&quot;p&quot;]</code>{' '}
                  and a <code>nvidia.com/gpu:NoSchedule</code> taint so only GPU pods land on GPU
                  nodes. Just-in-time provisioning instead of idle GPU capacity.
                </span>
              ),
              tier: 'Tier 1: EKS best practices',
            },
            {
              concern: 'Spot capacity',
              mech: (
                <span>
                  A NodePool with <code>karpenter.sh/capacity-type: spot</code> and Karpenter&apos;s{' '}
                  <code>settings.interruptionQueue</code> set. AWS lists Spot at up to a 90%
                  discount against On-Demand, reclaimable on two minutes&apos; notice, and recommends
                  it for real-time inference that is spot-friendly: requests under two minutes,
                  tolerance of interruption, several usable instance types. AWS calls Spot
                  unsuitable for work tightly coupled between nodes, so keep LeaderWorkerSet
                  replicas on On-Demand or reserved capacity.
                </span>
              ),
              tier: 'Tier 1: EKS best practices',
            },
            {
              concern: 'Neuron node autoscaling',
              mech: (
                <span>
                  Same Karpenter pattern with Inferentia/Trainium selectors and the Neuron device
                  plugin (<code>aws.amazon.com/neuron</code> resource), covered in{' '}
                  <strong>section 21 (vLLM on AWS Neuron)</strong>.
                </span>
              ),
              tier: 'Tier 1',
            },
            {
              concern: 'GPU driver + device plugin',
              mech: (
                <span>
                  The Bottlerocket accelerated AMI (Amazon Machine Image) ships the NVIDIA driver and
                  Kubernetes device plugin pre-installed; AL2023 (Amazon Linux 2023) installs the
                  device plugin separately as a DaemonSet, which eksctl automates for GPU instance
                  types.
                </span>
              ),
              tier: 'Tier 1: EKS best practices',
            },
            {
              concern: 'Multi-node tensor/pipeline parallel',
              mech: (
                <span>
                  LeaderWorkerSet (LWS) groups a leader and worker pods into one logical replica spanning
                  nodes; vLLM&apos;s default <code>mp</code> executor spans them with{' '}
                  <code>--nnodes</code> (<strong>section 9 (Distributed Inference)</strong>).
                  DisaggregatedSet (LWS v1.0.0) runs one LeaderWorkerSet per role for separate
                  prefill and decode groups (<strong>sections 10 and 17</strong>).
                </span>
              ),
              tier: 'Tier 1: LWS v1.0.0',
            },
            {
              concern: 'Multi-node interconnect',
              mech: (
                <span>
                  EFA nodes inside one cluster placement group: a Karpenter EC2NodeClass with{' '}
                  <code>placementGroupSelector</code> autoscales them, a managed node group is the
                  static option. NIXL and NCCL ride EFA for KV (key-value) cache and collective
                  transfer:{' '}
                  <strong>section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong> and{' '}
                  <strong>section 23 (EC2 Topology &amp; Placement Groups)</strong>.
                </span>
              ),
              tier: 'Tier 1: Karpenter v1.15.0, EKS best practices',
            },
            {
              concern: 'Gateway / front door',
              mech: (
                <span>
                  ALB (AWS Load Balancer Controller) for ingress; LiteLLM as the API gateway for
                  keys, budgets and fallback (<strong>section 19 (Gateways &amp; Application
                  Layer)</strong>); the inference-aware path is the Gateway API Inference Extension
                  and llm-d in <strong>section 17</strong>.
                </span>
              ),
              tier: 'Tier 1 / Tier 2',
            },
            {
              concern: 'Model weights',
              mech: (
                <span>
                  S3 with Run:ai Model Streamer (stream straight to GPU) or Mountpoint for Amazon S3;
                  FSx for Lustre for repeated multi-node reads of large checkpoints; a{' '}
                  <code>vllm preload</code> weight cache for engines that restart on the same node.
                </span>
              ),
              tier: 'Tier 1 / Tier 2',
            },
            {
              concern: 'Observability',
              mech: (
                <span>
                  vLLM exposes Prometheus metrics; scrape them with a ServiceMonitor into
                  kube-prometheus-stack and render the community vLLM Grafana dashboard (gnetId
                  25263), covered in <strong>section 20 (Observability &amp; Benchmarking)</strong>.
                </span>
              ),
              tier: 'Tier 1: EKS quickstart',
            },
            {
              concern: 'Capacity assurance',
              mech: (
                <span>
                  ML Capacity Blocks or ODCRs (On-Demand Capacity Reservations) for scarce GPU
                  types; Karpenter uses them first through{' '}
                  <code>capacityReservationSelectorTerms</code>. Managed node groups for
                  steady-state reserved capacity.
                </span>
              ),
              tier: 'Tier 1: EKS best practices, Karpenter v1.15.0',
            },
          ]}
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two node pools cover both replica shapes: one for single-node replicas, and one per cluster placement group for multi-node EFA replicas"
          >
            Karpenter: a GPU pool and an EFA pool
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The single-node pool diversifies across G- and P-series so a scale-up is less likely to
            hit insufficient-capacity errors, taints the nodes so only GPU-requesting pods schedule
            there, and constrains GPU memory so small models do not land on the most expensive
            accelerators.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Karpenter NodePool: GPU inference (illustrative; verify against your Karpenter version)
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-inf
spec:
  template:
    spec:
      requirements:
        - key: karpenter.k8s.aws/instance-category   # diversify G + P series
          operator: In
          values: ["g", "p"]
        - key: karpenter.k8s.aws/instance-generation # newer generations only
          operator: Gt
          values: ["3"]
        - key: karpenter.k8s.aws/instance-gpu-memory # >20 GiB GPU memory
          operator: Gt
          values: ["20480"]
      taints:
        - key: nvidia.com/gpu                          # keep non-GPU pods off
          effect: NoSchedule
  disruption:
    consolidationPolicy: WhenEmpty                     # consolidate only empty nodes
    consolidateAfter: 60m                              # keep empty nodes through a traffic dip

# vLLM Deployment pod targets the pool, tolerates the taint, requests a GPU:
#   nodeSelector:    karpenter.sh/nodepool: gpu-inf
#   tolerations:     key=nvidia.com/gpu, effect=NoSchedule
#   resources.limits: nvidia.com/gpu: 1`}</pre>
          </Box>
          <Box variant="small">
            The selectors and GPU taint come from the best-practices guide&apos;s real-time
            inference NodePool (a Spot pool that consolidates{' '}
            <code>WhenEmptyOrUnderutilized</code> after 5 minutes); <code>WhenEmpty</code> after{' '}
            <code>60m</code> is the guide&apos;s setting for interruption-sensitive work such as
            real-time online inference{' '}
            <Cite tier={1} href={EKS_BP}>
              EKS Best Practices: AI/ML Compute
            </Cite>
            . The pod fields (<code>nodeSelector: karpenter.sh/nodepool: gpu-inf</code>, the GPU
            toleration, <code>nvidia.com/gpu: 1</code>) are from the quickstart manifest{' '}
            <Cite tier={1} href={EKS_QS}>
              EKS User Guide: Load &amp; Serve Models on Amazon EKS
            </Cite>
            .
          </Box>

          <Box variant="p">
            The multi-node pool autoscales LeaderWorkerSet replicas into a cluster placement group.
            Each EC2NodeClass maps to exactly one placement group, selected by name or id, and
            Karpenter supports the cluster, partition and spread strategies{' '}
            <Cite tier={1} href={`${KARP_DOC}#L989-L1021`}>
              Karpenter v1.15.0 docs: placementGroupSelector
            </Cite>
            . Three steps get it right:
          </Box>
          <ol>
            <li>
              <strong>Create the placement group first</strong>, in Terraform, the AWS CDK (Cloud
              Development Kit) or the CLI, and give the EFA pool its own EC2NodeClass and NodePool. Karpenter&apos;s IAM role needs{' '}
              <code>ec2:DescribePlacementGroups</code> to find it. A cluster placement group sits in
              a single Availability Zone, so keep this EC2NodeClass&apos;s subnets in that zone.
            </li>
            <li>
              <strong>Add the EFA interfaces</strong> with <code>networkInterfaces</code> entries of{' '}
              <code>interfaceType: efa-only</code>, which attach an EFA device without consuming an
              IP address{' '}
              <Cite tier={1} href={`${KARP_DOC}#L1175-L1196`}>
                Karpenter v1.15.0 docs: networkInterfaces
              </Cite>
              , at most one per network card{' '}
              <Cite tier={1} href={`${KARP_CRD}#L515-L535`}>
                Karpenter v1.15.0 EC2NodeClass CRD (Custom Resource Definition)
              </Cite>
              . The pods request the <code>vpc.amazonaws.com/efa</code> resource{' '}
              <Cite tier={1} href={`${KARP_DOC}#L1687-L1688`}>
                Karpenter v1.15.0 docs: EFA resource requests
              </Cite>
              .
            </li>
            <li>
              <strong>Reserve the capacity</strong>, because a cluster placement group can run short
              at scale-up: an ODCR created inside the placement group, or a Capacity Block, which
              AWS places close together (<strong>section 23</strong> compares the two). Karpenter
              uses reserved capacity before On-Demand and Spot through{' '}
              <code>capacityReservationSelectorTerms</code>, a Beta feature in v1.15.0{' '}
              <Cite tier={1} href={`${KARP_DOC}#L912-L923`}>
                Karpenter v1.15.0 docs: capacityReservationSelectorTerms
              </Cite>
              .
            </li>
          </ol>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# EC2NodeClass for the multi-node EFA pool (illustrative; fields from Karpenter v1.15.0)
apiVersion: karpenter.k8s.aws/v1
kind: EC2NodeClass
metadata:
  name: gpu-efa
spec:
  placementGroupSelector:
    name: vllm-efa-cluster-pg      # created by your IaC; Karpenter only selects it
  networkInterfaces:
    - networkCardIndex: 0
      deviceIndex: 0
      interfaceType: interface     # primary ENA interface
    - networkCardIndex: 0
      deviceIndex: 1
      interfaceType: efa-only      # repeat per network card you want EFA on
  # role, amiSelectorTerms, subnetSelectorTerms (the placement group's AZ) and
  # securityGroupSelectorTerms as for any EC2NodeClass
# The EFA NodePool points at it with nodeClassRef: {group: karpenter.k8s.aws, kind: EC2NodeClass, name: gpu-efa}`}</pre>
          </Box>
          <Box variant="small">
            A managed node group with a cluster placement group stays a valid static option: the
            best-practices guide&apos;s eksctl managed node group example sets{' '}
            <code>efaEnabled: true</code> and a{' '}
            <code>placementGroup</code> with <code>strategy: cluster</code>{' '}
            <Cite tier={1} href={EKS_BP}>
              EKS Best Practices: AI/ML Compute
            </Cite>
            . Placement mechanics are in <strong>section 23</strong>; how the fabric behaves is in
            the{' '}
            <Link external href="../efa/">
              EFA (Elastic Fabric Adapter)
            </Link>{' '}
            deep dive.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run a model that outgrows one node as one schedulable unit, then split prefill and decode into groups that scale on their own"
          >
            Multi-node serving: LeaderWorkerSet and DisaggregatedSet
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When a model does not fit one node&apos;s GPUs (tensor parallel beyond a single box, or
            pipeline parallel across boxes), you need a group of pods that schedule, scale and fail
            as one unit. That is the <strong>LeaderWorkerSet (LWS)</strong>: a leader pod plus N
            worker pods form a single logical replica spanning nodes, which is how the DLC blog runs
            DeepSeek-R1-Distill-Qwen-32B across <code>p4d.24xlarge</code> nodes. The LWS
            project&apos;s own vLLM example needs no Ray: every pod runs <code>vllm serve</code>{' '}
            with <code>--nnodes $(LWS_GROUP_SIZE)</code>,{' '}
            <code>--node-rank $(LWS_WORKER_INDEX)</code> and{' '}
            <code>--master-addr $(LWS_LEADER_ADDRESS)</code>, and the workers add{' '}
            <code>--headless</code>{' '}
            <Cite tier={1} href={`${LWS_VLLM_EXAMPLE}#L37-L85`}>
              LWS v1.0.0 example: leaderworkerset/basic/vllm.yaml
            </Cite>
            . That is vLLM&apos;s default <code>mp</code> executor, described in{' '}
            <strong>section 9 (Distributed Inference)</strong>.
          </Box>
          <Box variant="p">
            The <strong>disaggregated</strong> step separates prefill (compute-bound) from decode
            (memory-bound) pod groups, the concept from{' '}
            <strong>section 10 (Disaggregated Prefill / Decode)</strong> and section 17. AWS&apos;s
            llm-d blog deploys it on EKS: prefill and decode become distinct pod sets, KV cache
            moves between them over NIXL on EFA, and the inference gateway routes requests across
            the split.
          </Box>
          <ExpandableSection headerText="LeaderWorkerSet vs DisaggregatedSet: what changes on EKS">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>LeaderWorkerSet:</strong> one replica is one leader plus workers,
                co-scheduled so the tensor and pipeline parallel ranks land together. On EKS the
                replica sits on nodes inside one cluster placement group (the Karpenter EFA pool or
                a managed node group), because the ranks talk over NCCL on EFA. Scaling out adds
                whole leader-plus-worker groups.
              </Box>
              <Box variant="p">
                <strong>DisaggregatedSet (LWS v1.0.0):</strong> a CRD that orchestrates one
                LeaderWorkerSet per role (prefill, decode, optional encode), each scaled
                independently, and coordinates rollouts across roles to preserve the
                prefill-to-decode ratio{' '}
                <Cite tier={1} href={`${LWS_DS_DOC}#L9-L53`}>
                  LWS v1.0.0 docs: DisaggregatedSet
                </Cite>
                . Each role keeps LWS features such as exclusive placement; on AWS, the KV transfer
                between roles rides NIXL over EFA (section 22).
              </Box>
              <Box variant="p">
                AWS&apos;s llm-d post reports that &quot;
                <em>
                  llm-d&apos;s prefill/decode disaggregation path increases tokens per second by up
                  to 70%
                </em>
                &quot; against a standard vLLM deployment, with 1024 input and 1024 output tokens
                at concurrency up to 128, running GPT-OSS on one{' '}
                <code>ml.p6-b200.48xlarge</code>{' '}
                <Cite tier={2} href={LLMD_BLOG}>
                  AWS ML blog: Introducing disaggregated inference on AWS powered by llm-d (vendor
                  claim)
                </Cite>
                . Count the GPUs before you compare: the disaggregated side is four prefill pods at
                TP 1 plus one decode pod at TP 4, the baseline is vLLM at TP 4, and the post gives
                no per-GPU figure. The post uses neither DisaggregatedSet nor LeaderWorkerSet.
                Treat the 70% as a vendor benchmark under one workload, and measure your own with{' '}
                <strong>section 20</strong>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which of three stackable layers to put in front of the vLLM pods, and when each earns its place"
          >
            The front door: ALB, LiteLLM, and the inference-aware path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EKS gives you three composable layers in front of the vLLM pods, and which you reach for
            depends on how routing-aware you need to be. They stack, so you can run all three: the
            llm-d post has the AWS Load Balancer Controller provision load balancers in front of
            the inference gateway{' '}
            <Cite tier={2} href={LLMD_BLOG}>
              AWS ML blog: llm-d on AWS
            </Cite>
            .
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">ALB (ingress)</Box>
              <Box variant="p">
                The AWS Load Balancer Controller provisions an Application Load Balancer for L7
                ingress, the DLC blog&apos;s front door. It gets traffic into the cluster and
                balances by round-robin or least-outstanding requests, with no view of KV cache or
                queue depth.
              </Box>
            </div>
            <div>
              <Box variant="h3">LiteLLM (API gateway)</Box>
              <Box variant="p">
                LiteLLM as the API gateway: virtual keys, per-team budgets, retries and fallbacks,
                and a single OpenAI-shaped URL fronting many vLLM endpoints. These are control-plane
                concerns, decoupled from the engine. The full argument is in{' '}
                <strong>section 19</strong>.
              </Box>
            </div>
            <div>
              <Box variant="h3">Inference-aware (GAIE / llm-d)</Box>
              <Box variant="p">
                The Gateway API Inference Extension (GAIE) turns an Envoy gateway into an inference
                gateway with metric-aware routing (queue depth, prefix-cache residency, LoRA
                (low-rank adaptation) adapter placement). This is the operator path of{' '}
                <strong>section 17</strong>, deployed on EKS by the llm-d blog.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Pick by need: ALB alone is fine for one model behind one service; add LiteLLM the moment
            you have multiple teams, keys or budgets; move to the GAIE / llm-d inference gateway when
            round-robin is measurably leaving throughput on the table (cache-locality misses,
            hot/cold replica skew). The decision criteria live in sections 16, 17 and 19.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the weight path by how often nodes churn, how many nodes read the same checkpoint, and whether engines restart in place"
          >
            Model weights from S3: stream, mount, stage, or cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Cold-start time on GPU nodes is dominated by two things: pulling the (large) container
            image and loading the (larger) model weights. SOCI-enabled DLC images speed up the
            first; the table covers the second. The quickstart&apos;s log shows Run:ai Model Streamer
            loading 10.4 GB of weights from S3 into GPU memory in about 5 seconds on a{' '}
            <code>g6e.4xlarge</code>{' '}
            <Cite tier={1} href={EKS_QS}>
              EKS User Guide: Load &amp; Serve Models on Amazon EKS
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'opt', header: 'Mechanism', cell: (i) => <strong>{i.opt}</strong> },
              { id: 'how', header: 'How it loads weights', cell: (i) => i.how },
              { id: 'when', header: 'Reach for it when', cell: (i) => i.when },
            ]}
            items={[
              {
                opt: 'Run:ai Model Streamer',
                how: (
                  <span>
                    Streams weights straight from S3 into GPU memory; vLLM flag{' '}
                    <code>--load-format=runai_streamer</code> with a{' '}
                    <code>--model=s3://&hellip;</code> URI{' '}
                    <Cite tier={1} href={vllmUrl(LOADERS, 'L44-L61')} kind="code">
                      model_loader/__init__.py L44-L61
                    </Cite>
                    .
                  </span>
                ),
                when: 'Single replicas and Karpenter node churn, where a load of about 5 seconds needs no shared filesystem. The quickstart default.',
              },
              {
                opt: 'Mountpoint for Amazon S3',
                how: 'Exposes an S3 bucket as a POSIX-like mount through a CSI (Container Storage Interface) driver, so vLLM reads weights as files.',
                when: 'You want file-path semantics and S3 durability and cost without managing a filesystem; good for read-mostly weight access.',
              },
              {
                opt: 'FSx for Lustre',
                how: 'High-throughput parallel filesystem (often S3-linked) mounted across pods; weights staged once, read by many.',
                when: 'Multi-node serving where many pods and nodes repeatedly read the same large checkpoint and need aggregate read bandwidth. The DLC blog uses this.',
              },
              {
                opt: 'Weight cache daemon (vllm preload)',
                how: (
                  <span>
                    <code>vllm preload</code> starts one daemon per GPU holding that rank&apos;s
                    post-quantization, tensor-parallel-sharded weights in GPU memory; an engine
                    started with <code>--load-format ipc_cache</code> maps them over CUDA IPC
                    (inter-process communication) instead of reading storage{' '}
                    <Cite tier={1} href={vllmUrl('vllm/entrypoints/cli/preload.py', 'L3-L19')} kind="code">
                      cli/preload.py L3-L19
                    </Cite>
                    .
                  </span>
                ),
                when: (
                  <span>
                    Engines restart on a node that stays: daemon and engine on the same node as the
                    same user, with the same vLLM version, model and parallel layout, or the engine
                    falls back to a disk load; the daemon rejects pipeline parallelism{' '}
                    <Cite tier={1} href={vllmDocsUrl('features/preload/')}>
                      vLLM docs: Preload
                    </Cite>
                    . <strong>Section 27 (Operations &amp; Failure Modes)</strong> ranks it against
                    the other restart paths.
                  </span>
                ),
              },
            ]}
          />
          <Box variant="small">
            FSx for Lustre for weights is from the DLC blog{' '}
            <Cite tier={2} href={DLC_BLOG}>
              AWS ML blog: Deploy LLMs on Amazon EKS using vLLM DLCs
            </Cite>
            . Confirm Mountpoint-for-S3 and FSx-for-Lustre CSI specifics against their own current
            docs before relying on them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Scrape vLLM into the standard Kubernetes metrics stack with one ServiceMonitor, and read throughput from the right metric"
          >
            Observability: ServiceMonitor &rarr; Prometheus &rarr; Grafana
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM exposes Prometheus metrics on <code>/metrics</code> out of the box: request
            counts, token counters, end-to-end latency, and GPU KV-cache usage. On EKS you wire that
            into the standard stack with a ServiceMonitor, and the AWS quickstart pre-provisions a
            community vLLM Grafana dashboard so there is nothing to build.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Tell Prometheus to scrape vLLM (kube-prometheus-stack)
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: vllm-inference-app
  labels:
    release: kube-prometheus-stack
spec:
  selector:
    matchLabels:
      app: vllm-inference-app
  endpoints:
    - port: http
      path: /metrics
      interval: 15s

# Dashboard: community "vLLM Metrics" (Grafana gnetId 25263),
# provisioned by the kube-prometheus-stack values file, no manual import.

# Token throughput is a rate over a counter:
#   rate(vllm:generation_tokens_total[1m])`}</pre>
          </Box>
          <Box variant="p">
            The token metrics are Prometheus counters, <code>vllm:prompt_tokens</code> and{' '}
            <code>vllm:generation_tokens</code>, exported as <code>vllm:prompt_tokens_total</code>{' '}
            and <code>vllm:generation_tokens_total</code>{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L685-L723')} kind="code">
              v1/metrics/loggers.py L685-L723
            </Cite>
            , so throughput is a <code>rate()</code> over them. The quickstart&apos;s check also
            greps for <code>avg_generation_throughput_toks_per_s</code> and{' '}
            <code>avg_prompt_throughput_toks_per_s</code>{' '}
            <Cite tier={1} href={EKS_QS} kind="doc-code-conflict">
              EKS User Guide: Load &amp; Serve Models on Amazon EKS
            </Cite>
            . vLLM deprecated and then removed{' '}
            <code>vllm:avg_prompt_throughput_toks_per_s</code>{' '}
            <Cite tier={1} href={vllmDocsUrl('design/metrics/')}>
              vLLM docs: Metrics design, How To Deprecate
            </Cite>
            . Neither name is registered anywhere in the v0.31.0 source, so those two patterns
            match nothing; the averages appear only in the periodic stats log line{' '}
            <Cite tier={1} href={vllmUrl(LOGGERS, 'L274-L276')} kind="code">
              loggers.py L274-L276
            </Cite>
            . Metric meanings and benchmarking are in{' '}
            <strong>section 20 (Observability &amp; Benchmarking)</strong>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The order to build an EKS deployment in, from the first single-GPU replica to disaggregated serving"
          >
            Putting it together: the build sequence
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. Does the model fit one node&apos;s GPUs?</strong> If yes, you are on the
            single-replica path: AWS vLLM DLC image, Karpenter NodePool (g/p, GPU taint,{' '}
            <code>WhenEmpty</code> after <code>60m</code>), weights streamed from S3 by Run:ai Model
            Streamer, ALB and LiteLLM in front, kube-prometheus-stack for metrics. This is the
            quickstart end to end, with the image tag moved to the vLLM release you run.
          </Box>
          <Box variant="p">
            <strong>2. If not, you need multi-node.</strong> Run the replica as a LeaderWorkerSet on
            nodes inside one cluster placement group: a Karpenter NodePool whose EC2NodeClass sets{' '}
            <code>placementGroupSelector</code> and EFA interfaces, or a managed node group with a
            placement group (section 23). vLLM spans the nodes with its default <code>mp</code>{' '}
            executor (section 9); KV and collective traffic ride NIXL and NCCL over EFA (section 22).
          </Box>
          <Box variant="p">
            <strong>3. Are prefill and decode profiles diverging enough to size separately?</strong>{' '}
            Then move to disaggregated serving (DisaggregatedSet or llm-d, with the Gateway API
            Inference Extension; sections 10 and 17). The AWS-reported figure is up to 70% more
            tokens per second under one benchmark; validate the gain on your own traffic.
          </Box>
          <Box variant="p">
            <strong>4. Throughout:</strong> put interruption-tolerant single replicas on Spot and
            keep multi-node replicas off it, reserve scarce GPU capacity through{' '}
            <code>capacityReservationSelectorTerms</code> or the managed node group, and keep
            budgets and keys in the gateway (section 19). Start with the quickstart manifest on the
            current DLC tag, and add the EFA EC2NodeClass when the model outgrows one node.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
