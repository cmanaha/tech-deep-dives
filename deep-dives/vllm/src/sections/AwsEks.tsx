import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

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
      style={{ width: '100%', height: 'auto' }}
      viewBox="0 0 900 560"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="eks-reqprov-title">
        vLLM on Amazon EKS: the request path runs client to ALB/Gateway to LiteLLM to vLLM pods,
        which split into a single-replica path on Karpenter-provisioned GPU nodes and a multi-node
        LeaderWorkerSet path on an EFA-enabled managed node group inside a cluster placement group.
        The provisioning path streams model weights from S3 through a Karpenter NodePool that
        just-in-time provisions GPU nodes.
      </title>
      <defs>
        <marker id="eks-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={secondary} />
        </marker>
      </defs>

      {/* ---- Phase labels ---- */}
      <text x={250} y={26} textAnchor="middle" fontSize={12} fontWeight="bold" fill={secondary} fontFamily="sans-serif" letterSpacing="0.5">REQUEST PATH (left to right)</text>
      <text x={730} y={26} textAnchor="middle" fontSize={12} fontWeight="bold" fill={secondary} fontFamily="sans-serif" letterSpacing="0.5">PROVISIONING PATH (bottom up)</text>
      <line x1={500} y1={40} x2={500} y2={540} stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5 4" />

      {/* ================= REQUEST PATH (left column) ================= */}
      {/* client */}
      <rect x={30} y={50} width={130} height={48} rx={8} fill={blueFill} stroke={blue} strokeWidth={1.5} />
      <text x={95} y={79} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">client</text>

      {/* ALB / Gateway */}
      <rect x={30} y={130} width={420} height={56} rx={8} fill={blue} stroke={blueDark} strokeWidth={1.5} />
      <text x={240} y={154} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">ALB / Gateway</text>
      <text x={240} y={173} textAnchor="middle" fontSize={11} fill="#ffffff" fontFamily="sans-serif">L7 ingress / Gateway API Inference Extension</text>

      {/* LiteLLM */}
      <rect x={30} y={218} width={420} height={56} rx={8} fill={blue} stroke={blueDark} strokeWidth={1.5} />
      <text x={240} y={242} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">LiteLLM (API gateway)</text>
      <text x={240} y={261} textAnchor="middle" fontSize={11} fill="#ffffff" fontFamily="sans-serif">virtual keys / budgets / fallback &middot; OpenAI /v1</text>

      {/* arrows client -> ALB -> LiteLLM */}
      <line x1={95} y1={98} x2={95} y2={128} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <line x1={240} y1={186} x2={240} y2={216} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />

      {/* split label */}
      <text x={240} y={296} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">routes to vLLM pods</text>

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

      {/* arrows LiteLLM -> two pod boxes */}
      <line x1={125} y1={274} x2={125} y2={310} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <line x1={365} y1={274} x2={365} y2={310} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />

      {/* Karpenter GPU node (single) */}
      <rect x={20} y={430} width={210} height={70} rx={8} fill="#ffffff" stroke={border} strokeWidth={1.5} />
      <text x={125} y={456} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily="sans-serif">Karpenter GPU node</text>
      <text x={125} y={476} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">g6e / p-series</text>
      <text x={125} y={492} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">just-in-time</text>

      {/* EFA managed node group (multi) */}
      <rect x={250} y={430} width={230} height={70} rx={8} fill={tealFill} stroke={tealDark} strokeWidth={1.5} />
      <text x={365} y={454} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily="sans-serif">EFA managed node group</text>
      <text x={365} y={473} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">+ cluster placement group (&sect;23)</text>
      <text x={365} y={490} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">NIXL / NCCL over EFA (&sect;22)</text>

      {/* arrows pod -> node */}
      <line x1={125} y1={386} x2={125} y2={428} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <line x1={365} y1={386} x2={365} y2={428} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />

      {/* note: Karpenter does not create placement groups */}
      <text x={250} y={528} textAnchor="middle" fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">Karpenter autoscales single-replica nodes; the EFA group is pre-provisioned standing capacity</text>

      {/* ================= PROVISIONING PATH (right column) ================= */}
      {/* S3 weights */}
      <rect x={560} y={50} width={300} height={56} rx={8} fill={amberFill} stroke={amberStroke} strokeWidth={1.5} />
      <text x={710} y={74} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Amazon S3 (model weights)</text>
      <text x={710} y={93} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">Run:ai Model Streamer &middot; Mountpoint &middot; FSx-linked</text>

      {/* Karpenter NodePool */}
      <rect x={560} y={186} width={300} height={86} rx={8} fill={blueFill} stroke={blue} strokeWidth={1.5} />
      <text x={710} y={212} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Karpenter NodePool</text>
      <text x={710} y={232} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">instance-category g / p</text>
      <text x={710} y={250} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">taint nvidia.com/gpu:NoSchedule</text>

      {/* Karpenter GPU node(s) provisioned */}
      <rect x={560} y={352} width={300} height={70} rx={8} fill="#ffffff" stroke={border} strokeWidth={1.5} />
      <text x={710} y={382} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily="sans-serif">Karpenter GPU node(s)</text>
      <text x={710} y={402} textAnchor="middle" fontSize={11} fill={secondary} fontFamily="sans-serif">provisioned on demand</text>

      {/* arrows: S3 stream -> NodePool -> GPU nodes */}
      <line x1={710} y1={106} x2={710} y2={184} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={726} y={150} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">stream</text>
      <line x1={710} y1={272} x2={710} y2={350} stroke={secondary} strokeWidth={2} markerEnd="url(#eks-arr)" />
      <text x={726} y={316} fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">just-in-time</text>

      {/* note tying provisioned nodes back to the request-path single-replica node */}
      <text x={710} y={452} textAnchor="middle" fontSize={11} fontStyle="italic" fill={secondary} fontFamily="sans-serif">these are the GPU nodes the single-replica pods land on</text>
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
            description="The canonical EKS deployment story for vLLM, assembled from the parts the rest of this deep dive already built: DLCs, Karpenter, multi-node serving, a gateway, S3 weights, and observability."
          >
            24. vLLM on Amazon EKS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The framing in one sentence:</strong> running vLLM on Amazon EKS (Elastic
            Kubernetes Service) is not a new pattern. It is the conceptual stack from sections
            16 and 17 (the Kubernetes operator and router layers) landed onto the AWS data plane from
            sections 22 and 23 (GPUs, EFA, and placement groups), wired together with five EKS
            primitives: <strong>AWS vLLM Deep Learning Containers</strong> as the image,{' '}
            <strong>Karpenter</strong> (or EKS Auto Mode) for GPU node autoscaling,{' '}
            <strong>LeaderWorkerSet</strong> on EFA-enabled managed node groups for multi-node
            serving, a <strong>gateway</strong> out front, and <strong>Amazon S3</strong> for model
            weights. Everything in this section is an instantiation of a decision you have already
            seen made conceptually; the EKS-specific content is <em>which AWS knob implements which
            concept</em>.
          </Box>
          <Box variant="p">
            <strong>Why EKS rather than raw EC2 or SageMaker:</strong> you reach for EKS when you
            already run platform workloads on Kubernetes and want vLLM to live under the same
            scheduler, IAM, networking, and GitOps surface as everything else, not as a
            bespoke island. The trade is that you own the control plane assembly (device plugins,
            autoscaler, gateway, monitoring) instead of buying it. The two AWS-authored quickstarts
            below exist precisely to remove that assembly cost, and they disagree in instructive ways
            (Karpenter vs managed node groups; S3-stream vs FSx; ALB vs LeaderWorkerSet) that map
            cleanly onto the single-node vs multi-node split.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The request and provisioning path</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Read the diagram left-to-right as the request path, and bottom-up as the provisioning
            path. Single-replica inference rides Karpenter-provisioned GPU nodes (the EKS vLLM
            quickstart shape). Multi-node tensor/pipeline-parallel serving rides a separate
            EFA-enabled managed node group inside a cluster placement group, because{' '}
            <strong>Karpenter does not natively create EC2 placement groups</strong>, so the
            EFA-dependent path needs the locality guarantee from section 23.
          </Box>

          <EksRequestProvisioningDiagram />

          <Box variant="small">
            The single-replica path (ALB/Gateway &rarr; vLLM on a Karpenter GPU node, weights
            streamed from S3) is the shape of the EKS vLLM quickstart. The multi-node path
            (LeaderWorkerSet on an EFA managed node group in a placement group) is the shape of the
            DLC and llm-d blogs. <strong>[Tier-1: AWS EKS docs]</strong>{' '}
            <Link
              external
              href="https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html"
            >
              EKS User Guide: Load &amp; Serve Models (vLLM), accessed 2026-06-07
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The two AWS-authored reference deployments</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            There are two canonical AWS walkthroughs, and the cleanest way to understand EKS-for-vLLM
            is to see where they agree and where they diverge. They are not competing. They
            target the single-node and the multi-node ends of the same spectrum.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">EKS quickstart (single-replica) [Tier-1]</Box>
              <ul>
                <li>
                  <strong>Image:</strong> AWS vLLM DLC{' '}
                  <code>{'public.ecr.aws/deep-learning-containers/vllm:0.21.0-gpu-py312-cu130-ubuntu22.04-ec2-v1.0-soci'}</code>{' '}
                  (vLLM 0.21.0, CUDA 13.0, SOCI-enabled for fast pulls).
                </li>
                <li>
                  <strong>Compute:</strong> Karpenter NodePool <code>gpu-inf</code>, works on both
                  EKS Auto Mode and self-managed Karpenter; example node was a <code>g6e.4xlarge</code>.
                </li>
                <li>
                  <strong>Weights:</strong> downloaded from Hugging Face to S3, then streamed S3 &rarr;
                  GPU via Run:ai Model Streamer (<code>--load-format=runai_streamer</code>).
                </li>
                <li>
                  <strong>Front door / observability:</strong> Open WebUI on the OpenAI-compatible
                  API; kube-prometheus-stack + community vLLM Grafana dashboard.
                </li>
              </ul>
            </div>
            <div>
              <Box variant="h3">DLC blog (multi-node) [Tier-2]</Box>
              <ul>
                <li>
                  <strong>Image:</strong> vLLM AWS DLCs (image tag not pinned in the post).
                </li>
                <li>
                  <strong>Compute:</strong> <code>p4d.24xlarge</code> (8&times; NVIDIA A100) via{' '}
                  <strong>managed node groups</strong> (eksctl), not Karpenter.
                </li>
                <li>
                  <strong>Weights:</strong> FSx for Lustre file system, populated at pod init
                  (DeepSeek-R1-Distill-Qwen-32B).
                </li>
                <li>
                  <strong>Multi-node / front door:</strong> LeaderWorkerSet for distributed serving;
                  AWS Application Load Balancer via the AWS Load Balancer Controller. EFA cited for
                  reduced latency / higher throughput (qualitative, no numbers).
                </li>
              </ul>
            </div>
          </ColumnLayout>

          <Box variant="small">
            <strong>[Tier-1: AWS EKS docs]</strong>{' '}
            <Link
              external
              href="https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html"
            >
              EKS User Guide: Load &amp; Serve Models (vLLM), accessed 2026-06-07
            </Link>
            . <strong>[Tier-2: AWS ML blog]</strong>{' '}
            <Link
              external
              href="https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/"
            >
              Deploy LLMs on Amazon EKS using vLLM Deep Learning Containers, accessed 2026-06-07
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Concern &rarr; EKS mechanism</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            This is the section to keep open while you build. Each row is a production concern, the
            EKS primitive that addresses it, and where in this deep dive the underlying concept is
            developed.
          </Box>
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
                    AWS vLLM Deep Learning Containers from{' '}
                    <code>public.ecr.aws/deep-learning-containers/vllm</code>: pinned vLLM +
                    CUDA, security-patched, SOCI-enabled for fast image pull.
                  </span>
                ),
                tier: 'Tier-1 / Tier-2',
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
                tier: 'Tier-1',
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
                tier: 'Tier-1',
              },
              {
                concern: 'GPU driver + device plugin',
                mech: (
                  <span>
                    Bottlerocket Accelerated AMI ships the NVIDIA driver and Kubernetes device plugin
                    pre-installed (no extra config); AL2023 installs the device plugin separately via
                    DaemonSet (eksctl automates it for GPU instance types).
                  </span>
                ),
                tier: 'Tier-1',
              },
              {
                concern: 'Multi-node tensor/pipeline parallel',
                mech: (
                  <span>
                    LeaderWorkerSet groups a leader + worker pods into one logical replica spanning
                    nodes. The emerging DisaggregatedSet extends this for separate prefill/decode
                    groups, concepts from <strong>section 16</strong> /{' '}
                    <strong>section 17</strong>.
                  </span>
                ),
                tier: 'Tier-2',
              },
              {
                concern: 'Multi-node interconnect',
                mech: (
                  <span>
                    EFA-enabled managed node group inside a cluster placement group; NIXL/NCCL ride
                    EFA for KV and collective transfer, covered in{' '}
                    <strong>section 22 (GPUs, EFA &amp; NIXL)</strong> and{' '}
                    <strong>section 23 (topology &amp; placement groups)</strong>.
                  </span>
                ),
                tier: 'Tier-2',
              },
              {
                concern: 'Gateway / front door',
                mech: (
                  <span>
                    ALB (AWS Load Balancer Controller) for ingress; LiteLLM as the API gateway for
                    keys/budgets/fallback (see <strong>section 19</strong>); the inference-aware path
                    is the Gateway API Inference Extension / llm-d in{' '}
                    <strong>section 17</strong>.
                  </span>
                ),
                tier: 'Tier-1 / Tier-2',
              },
              {
                concern: 'Model weights',
                mech: (
                  <span>
                    S3 with Run:ai Model Streamer (stream straight to GPU) or Mountpoint for Amazon
                    S3; FSx for Lustre for repeated multi-node reads of large checkpoints.
                  </span>
                ),
                tier: 'Tier-1 / Tier-2',
              },
              {
                concern: 'Observability',
                mech: (
                  <span>
                    vLLM exposes Prometheus metrics; scrape with a ServiceMonitor into
                    kube-prometheus-stack and render the community vLLM Grafana dashboard (gnetId
                    25263), covered in <strong>section 20 (Observability &amp; Benchmarking)</strong>.
                  </span>
                ),
                tier: 'Tier-1',
              },
              {
                concern: 'Capacity assurance',
                mech: (
                  <span>
                    ML Capacity Blocks or On-Demand Capacity Reservations for scarce GPU types;
                    Karpenter honors them via <code>capacityReservationSelectorTerms</code>. Managed
                    node groups for steady-state reserved capacity.
                  </span>
                ),
                tier: 'Tier-1',
              },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Alert type="warning" header="The placement-group gap: why multi-node EFA is NOT a Karpenter job">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>[Tier-1 mechanism]</strong> Karpenter is the right tool for autoscaling
            single-node GPU inference replicas: it provisions a node, the pod lands, done. But
            EFA-dependent multi-node serving needs all participating instances inside one{' '}
            <strong>EC2 cluster placement group</strong> so the low-latency fabric assumptions from
            section 23 hold. <strong>Karpenter does not natively create cluster placement groups.</strong>{' '}
            The practical pattern is therefore a split data plane: Karpenter for elastic single-node
            replicas, and a pre-provisioned <strong>EFA-enabled managed node group with a cluster
            placement group</strong> for the LeaderWorkerSet replicas that need cross-node EFA. Treat
            the multi-node tier as standing capacity (managed node group + ODCR / Capacity Block),
            not as something you spin up on demand.
          </Box>
          <Box variant="small">
            EFA-on-EKS node requirements (placement group, security group, hugepages, device plugin)
            are the same ones detailed in this deep dive&apos;s sibling EFA entry and in{' '}
            <strong>section 22</strong>. Confirm the current managed-node-group EFA story against the
            EKS best-practices guidance below before committing an architecture.
          </Box>
        </SpaceBetween>
      </Alert>

      <Container header={<Header variant="h2">Karpenter NodePool for GPU vLLM</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The single-node autoscaling path. The NodePool diversifies across G- and P-series so a
            scale-up is less likely to hit insufficient-capacity errors, taints the nodes so only
            GPU-requesting pods schedule there, and (optionally) constrains GPU memory so small
            models do not land on the most expensive accelerators.
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
    consolidationPolicy: WhenEmpty                     # avoid evicting active inference
    consolidateAfter: 300s

# vLLM Deployment pod targets the pool, tolerates the taint, requests a GPU:
#   nodeSelector:    karpenter.sh/nodepool: gpu-inf
#   tolerations:     key=nvidia.com/gpu, effect=NoSchedule
#   resources.limits: nvidia.com/gpu: 1`}</pre>
          </Box>
          <Box variant="small">
            The selector labels (<code>instance-category</code>, <code>instance-generation</code>,{' '}
            <code>instance-gpu-memory</code>), the GPU taint, the Bottlerocket-accelerated-AMI
            pre-installed device plugin, and the <code>consolidationPolicy</code> guidance for
            interruption-sensitive workloads are all from the AWS best-practices guide.{' '}
            <strong>[Tier-1: AWS EKS docs]</strong>{' '}
            <Link external href="https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html">
              EKS Best Practices: AI/ML Compute, accessed 2026-06-07
            </Link>
            . The matching pod fields (<code>nodeSelector: karpenter.sh/nodepool: gpu-inf</code>, the
            GPU toleration, <code>nvidia.com/gpu: 1</code>, and{' '}
            <code>--load-format=runai_streamer</code>) are from the vLLM quickstart manifest above.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Multi-node serving: LeaderWorkerSet and DisaggregatedSet</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            When a model does not fit one node&apos;s GPUs (tensor parallel beyond a single box, or
            pipeline parallel across boxes), one Kubernetes Deployment per replica is the wrong
            primitive: you need a group of pods that scale, schedule, and fail as one unit.
            That is the <strong>LeaderWorkerSet (LWS)</strong>: a leader pod plus N worker pods form a
            single logical replica spanning nodes, which is exactly how the DLC blog runs
            DeepSeek-R1-Distill-Qwen-32B across <code>p4d.24xlarge</code> nodes.
          </Box>
          <Box variant="p">
            The <strong>disaggregated</strong> evolution, separating prefill (compute-bound)
            from decode (memory-bound) pod groups (the concept from section 10 and section 17),
            is what AWS&apos;s llm-d blog deploys on EKS. Prefill and decode become distinct sets,
            KV cache moves between them over NIXL on EFA, and the inference-aware Gateway API
            Inference Extension routes requests across the split.
          </Box>
          <ExpandableSection headerText="LeaderWorkerSet vs DisaggregatedSet: what changes on EKS">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>LeaderWorkerSet (LWS):</strong> one replica = one leader + workers, co-scheduled
                so tensor/pipeline parallel ranks land together. On EKS this replica must sit on the
                EFA managed node group inside the placement group, because the ranks talk over NCCL/EFA.
                Scaling out adds whole leader+worker groups, not individual pods.
              </Box>
              <Box variant="p">
                <strong>DisaggregatedSet (emerging):</strong> the prefill tier and decode tier become
                separately scalable groups. The win AWS reports comes from sizing each tier to its
                bottleneck independently rather than provisioning one homogeneous fleet for both
                phases. KV transfer between tiers rides NIXL over EFA (section 22).
              </Box>
              <Box variant="p">
                <strong>[Tier-2: AWS ML blog, project-claimed]</strong> AWS&apos;s llm-d post states
                that "<em>llm-d&apos;s prefill/decode disaggregation path increases tokens per
                second by up to 70%</em>" under its own test conditions (1024 input tokens, 1024
                output tokens, concurrency up to 128, on <code>ml.p6-b200.48xlarge</code> /{' '}
                <code>p5.48xlarge</code> with 32 EFA interfaces). Treat the 70% as a project-claimed
                benchmark under a specific workload, not a guarantee for your traffic shape. See{' '}
                <strong>section 20</strong> for how to benchmark your own.
              </Box>
              <Box variant="small">
                <strong>[Tier-2: AWS ML blog]</strong>{' '}
                <Link
                  external
                  href="https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/"
                >
                  Introducing disaggregated inference on AWS powered by llm-d, accessed 2026-06-07
                </Link>
                . LeaderWorkerSet usage:{' '}
                <Link
                  external
                  href="https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/"
                >
                  Deploy LLMs on Amazon EKS using vLLM DLCs, accessed 2026-06-07
                </Link>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The front door: ALB, LiteLLM, and the inference-aware path</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            EKS gives you three composable layers in front of the vLLM pods, and which you reach for
            depends on how routing-aware you need to be. They stack, so you can run all three.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">ALB (ingress) [Tier-2]</Box>
              <Box variant="p">
                The AWS Load Balancer Controller provisions an Application Load Balancer for L7
                ingress, the DLC blog&apos;s front door. Gets traffic into the cluster; it is
                not LLM-aware (round-robin / least-outstanding, no KV-cache or queue awareness).
              </Box>
            </div>
            <div>
              <Box variant="h3">LiteLLM (API gateway) [Tier-2]</Box>
              <Box variant="p">
                The AWS reference architecture uses LiteLLM as the API gateway: virtual keys,
                per-team budgets, retries/fallbacks, and a single OpenAI-shaped URL fronting many
                vLLM endpoints. Control-plane concerns, decoupled from the engine. The full
                argument is in <strong>section 19</strong>.
              </Box>
            </div>
            <div>
              <Box variant="h3">Inference-aware (GAIE / llm-d) [Tier-2]</Box>
              <Box variant="p">
                The Gateway API Inference Extension turns an Envoy gateway into an inference gateway
                with metric-aware routing (queue depth, prefix-cache residency, LoRA placement). This
                is the operator path of <strong>section 17</strong>, deployed on EKS by the llm-d
                blog.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Pick by need, not by novelty: ALB alone is fine for one model behind one service; add
            LiteLLM the moment you have multiple teams, keys, or budgets; graduate to the GAIE/llm-d
            inference gateway only when round-robin is demonstrably leaving throughput on the table
            (cache-locality misses, hot/cold replica skew). The decision criteria live in
            sections 16, 17, and 19.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Model weights from S3: stream, mount, or stage</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Cold-start time on GPU nodes is dominated by two things: pulling the (large) container
            image and loading the (larger) model weights. EKS gives you distinct mechanisms for each,
            and the right pick depends on how often nodes churn and how many nodes read the same
            weights.
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
                    <code>--load-format=runai_streamer</code> with an{' '}
                    <code>--model=s3://&hellip;</code> URI.
                  </span>
                ),
                when: 'Single-replica / Karpenter churn where you want sub-10s weight load without a shared filesystem. The quickstart default.',
              },
              {
                opt: 'Mountpoint for Amazon S3',
                how: 'Exposes an S3 bucket as a POSIX-like mount (CSI driver), so vLLM reads weights as files.',
                when: 'You want file-path semantics and S3 durability/cost without managing a filesystem; good for read-mostly weight access.',
              },
              {
                opt: 'FSx for Lustre',
                how: 'High-throughput parallel filesystem (often S3-linked) mounted across pods; weights staged once, read by many.',
                when: 'Multi-node serving where many pods/nodes repeatedly read the same large checkpoint and need aggregate read bandwidth. The DLC blog uses this.',
              },
            ]}
          />
          <Box variant="small">
            <strong>[Tier-1: AWS EKS docs]</strong> Run:ai Model Streamer + S3, SOCI fast image pull,
            and the "Model loading took &hellip; ~5 seconds" behavior are from the EKS vLLM
            quickstart:{' '}
            <Link
              external
              href="https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html"
            >
              EKS User Guide: Load &amp; Serve Models (vLLM), accessed 2026-06-07
            </Link>
            . <strong>[Tier-2: AWS ML blog]</strong> FSx for Lustre for weights:{' '}
            <Link
              external
              href="https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/"
            >
              Deploy LLMs on Amazon EKS using vLLM DLCs, accessed 2026-06-07
            </Link>
            . Confirm Mountpoint-for-S3 and FSx-for-Lustre CSI specifics against their own current
            docs before relying on them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Observability: ServiceMonitor &rarr; Prometheus &rarr; Grafana</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM exposes Prometheus metrics on <code>/metrics</code> out of the box: request
            rate, token throughput, end-to-end latency percentiles, and GPU KV-cache utilization. On
            EKS you wire that into the standard stack with a ServiceMonitor, and the AWS quickstart
            pre-provisions a community vLLM Grafana dashboard so there is nothing to build.
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
# provisioned by the kube-prometheus-stack values file, no manual import.`}</pre>
          </Box>
          <Box variant="small">
            <strong>[Tier-1: AWS EKS docs]</strong> ServiceMonitor, kube-prometheus-stack, the
            built-in vLLM metrics (<code>vllm:prompt_tokens_total</code>,{' '}
            <code>vllm:generation_tokens_total</code>, throughput gauges), and the pre-provisioned
            Grafana dashboard (gnetId 25263) are all from the quickstart:{' '}
            <Link
              external
              href="https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html"
            >
              EKS User Guide: Load &amp; Serve Models (vLLM), accessed 2026-06-07
            </Link>
            . The metric meanings and how to benchmark are developed in{' '}
            <strong>section 20 (Observability &amp; Benchmarking)</strong>.
          </Box>
        </SpaceBetween>
      </Container>

      <ExpandableSection headerText="Putting it together: a pragmatic EKS-for-vLLM decision sequence">
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. Does the model fit one node&apos;s GPUs?</strong> If yes, you are on the
            single-replica path: AWS vLLM DLC image, Karpenter NodePool (g/p, GPU taint), weights
            streamed from S3 via Run:ai Model Streamer, ALB + LiteLLM in front, kube-prometheus-stack
            for metrics. This is the quickstart end-to-end.
          </Box>
          <Box variant="p">
            <strong>2. If not, you need multi-node.</strong> Provision an EFA-enabled managed node
            group inside a cluster placement group (section 23), not Karpenter, because of the
            placement-group gap, and run the replica as a LeaderWorkerSet. KV/collective
            traffic rides NIXL/NCCL over EFA (section 22).
          </Box>
          <Box variant="p">
            <strong>3. Are prefill and decode profiles diverging enough to size separately?</strong>{' '}
            Then move to disaggregated serving (DisaggregatedSet + Gateway API Inference Extension,
            sections 10 and 17). Validate the gain on your own traffic; the AWS-reported{' '}
            <strong>[Tier-2, project-claimed]</strong> figure is up to 70% more tokens/sec under a
            specific benchmark, not a promise.
          </Box>
          <Box variant="p">
            <strong>4. Throughout:</strong> reserve scarce GPU capacity (ML Capacity Blocks / ODCRs,
            referenced by Karpenter <code>capacityReservationSelectorTerms</code> or pinned to the
            managed node group), keep budgets/keys in the gateway not the engine (section 19), and
            encode any failure you hit as a deterministic check rather than tribal knowledge.
          </Box>
        </SpaceBetween>
      </ExpandableSection>

      <Container header={<Header variant="h2">Sources</Header>}>
        <SpaceBetween size="s">
          <Box variant="h3">Tier-1: AWS documentation</Box>
          <ul>
            <li>
              <Link
                external
                href="https://docs.aws.amazon.com/eks/latest/userguide/ml-realtime-inference-llm-inference-vllm.html"
              >
                Amazon EKS User Guide: Load &amp; Serve Models on Amazon EKS (vLLM
                quickstart), accessed 2026-06-07
              </Link>
              . Covers AWS vLLM DLC image, Karpenter/EKS Auto Mode, S3 + Run:ai Model Streamer, SOCI,
              ServiceMonitor + kube-prometheus-stack + Grafana dashboard (gnetId 25263), Open WebUI.
            </li>
            <li>
              <Link
                external
                href="https://docs.aws.amazon.com/eks/latest/best-practices/aiml-compute.html"
              >
                Amazon EKS Best Practices: AI/ML Compute, accessed 2026-06-07
              </Link>
              . Covers Karpenter selectors (instance-category g/p, instance-generation,
              instance-gpu-memory), GPU taints, Bottlerocket accelerated AMI device plugin, ML
              Capacity Blocks / ODCRs, managed-node-group vs Karpenter guidance.
            </li>
          </ul>
          <Box variant="h3">Tier-2: AWS blogs</Box>
          <ul>
            <li>
              <Link
                external
                href="https://aws.amazon.com/blogs/machine-learning/deploy-llms-on-amazon-eks-using-vllm-deep-learning-containers/"
              >
                Deploy LLMs on Amazon EKS using vLLM Deep Learning Containers, accessed 2026-06-07
              </Link>
              . Covers p4d.24xlarge managed node groups, FSx for Lustre weights, LeaderWorkerSet, ALB
              via AWS Load Balancer Controller. (EFA benefits stated qualitatively; no throughput
              numbers.)
            </li>
            <li>
              <Link
                external
                href="https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/"
              >
                Introducing disaggregated inference on AWS powered by llm-d, accessed 2026-06-07
              </Link>
              . Covers disaggregated prefill/decode on EKS, Gateway API Inference Extension, NIXL over
              EFA on p5/p6-B200; <em>project-claimed</em> up to 70% more tokens/sec under a stated
              benchmark.
            </li>
          </ul>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
