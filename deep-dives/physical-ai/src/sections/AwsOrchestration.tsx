import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { AnimatedFigure, Figure } from '../components/Figure';
import { Placeholder, Snippet } from '../components/Blocks';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const MEM_FILL = '#efe9fb';
const MEM_INK = '#5b3fa8';
const TENSOR_FILL = '#e6f6ea';
const TENSOR_INK = '#1e7b3a';
const RT_FILL = '#fdeedd';
const RT_INK = '#a85a0a';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `The running example is the evaluation of one policy for the ${ARM} arm that must ${TASK_STORY}: 500 simulated episodes, each with its own random seed.`;

/* ------------------------------------------------------------------------ */
/* Configuration text. Each constant is copied or adapted from a pinned       */
/* first-party page; the Snippet under which it is printed says which.        */
/* ------------------------------------------------------------------------ */

const BATCH_JOB_DEFINITION = `{
    "jobDefinitionName": "sim-eval-episode",
    "type": "container",
    "containerProperties": {
        "image": "account-id.dkr.ecr.region.amazonaws.com/sim-eval:tag",
        "resourceRequirements": [
            {
                "type": "GPU",
                "value": "1"
            },
            {
                "type": "MEMORY",
                "value": "32000"
            },
            {
                "type": "VCPU",
                "value": "8"
            }
        ],
        "command": [
            "sh",
            "-c",
            "python evaluate.py --seed $AWS_BATCH_JOB_ARRAY_INDEX"
        ]
    },
    "retryStrategy": {
        "attempts": 5,
        "evaluateOnExit":
        [{
            "onStatusReason" :"Host EC2*",
            "action": "RETRY"
        },{
            "onReason" : "*",
            "action": "EXIT"
        }]
    },
    "timeout": {
        "attemptDurationSeconds": 1800
    }
}`;

const BATCH_SUBMIT = `{
  "jobName": "eval-policy-candidate",
  "jobQueue": "sim-spot",
  "jobDefinition": "sim-eval-episode",
  "arrayProperties": {
    "size": 500
  }
}`;

const BATCH_COMPUTE_ENVIRONMENT = `{
    "computeEnvironmentName": "sim-spot-g",
    "type": "MANAGED",
    "state": "ENABLED",
    "computeResources": {
        "type": "SPOT",
        "allocationStrategy": "SPOT_PRICE_CAPACITY_OPTIMIZED",
        "minvCpus": 0,
        "maxvCpus": 16,
        "desiredvCpus": 0,
        "instanceTypes": [
            "g6e",
            "g7e"
        ],
        "subnets": [
            "subnet-a1b2c3d4"
        ],
        "securityGroupIds": [
            "sg-a1b2c3d4"
        ],
        "instanceRole": "arn:aws:iam::123456789012:instance-profile/ecsInstanceRole",
        "ec2Configuration": [
            {
                "imageType": "ECS_AL2023_NVIDIA"
            }
        ]
    },
    "serviceRole": ""
}`;

const AUTO_MODE_NODEPOOL = `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu
spec:
  disruption:
    budgets:
    - nodes: 10%
    consolidateAfter: 1h
    consolidationPolicy: WhenEmpty
  template:
    metadata: {}
    spec:
      nodeClassRef:
        group: eks.amazonaws.com
        kind: NodeClass
        name: default
      requirements:
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["on-demand"]
        - key: "kubernetes.io/arch"
          operator: In
          values: ["amd64"]
        - key: "eks.amazonaws.com/instance-family"
          operator: In
          values:
          - g6e
          - g6
      terminationGracePeriod: 24h0m0s`;

const OSMO_WORKFLOW = `# Your entire physical AI pipeline in a YAML file
workflow:
  tasks:
  - name: simulation
    image: nvcr.io/nvidia/isaac-sim
    platform: rtx-pro-6000          # Runs on NVIDIA RTX PRO 6000 GPUs

  - name: train-policy
    image: nvcr.io/nvidia/pytorch
    platform: gb200                 # Runs on NVIDIA GB200 GPUs
    resources:
      gpu: 8
    inputs:                         # Feed the output of simulation task into training
    - task: simulation

  - name: evaluate-thor
    image: my-ros-app
    platform: jetson-agx-thor       # Runs on NVIDIA Jetson AGX Thor
    inputs:
    - task: train-policy            # Feed the output of the training task into eval
    outputs:
    - dataset:
        name: thor-benchmark        # Save the output benchmark into a dataset`;

const GREENGRASS_AWS_RECIPE = `---
RecipeFormatVersion: '2020-01-25'
ComponentName: com.example.ListS3Buckets
ComponentVersion: '1.0.0'
ComponentDescription: A component that uses the token exchange service to list S3 buckets.
ComponentPublisher: Amazon
ComponentDependencies:
  aws.greengrass.TokenExchangeService:
    VersionRequirement: '^2.0.0'
    DependencyType: HARD
Manifests:
  - Platform:
      os: linux
    Lifecycle:
      install:
        pip3 install --user boto3
      Run: |-
        python3 -u {artifacts:path}/list_s3_buckets.py`;

/* ------------------------------------------------------------------------ */
/* Diagram 24.2: three layers, chosen separately (static)                     */
/* ------------------------------------------------------------------------ */

interface LayerRow {
  tag: string;
  tagFill: string;
  text: string;
}

const ORCH_TAGS = { batch: '#1f5fa8', hyperpod: '#1e7b3a', eks: '#5b3fa8' };

function LayerBand({
  y,
  fill,
  ink,
  title,
  rows,
}: {
  y: number;
  fill: string;
  ink: string;
  title: string;
  rows: LayerRow[];
}) {
  return (
    <g>
      <rect x={10} y={y} width={380} height={112} rx={6} fill={fill} stroke={ink} strokeWidth={1.2} />
      <text x={22} y={y + 24} fontSize={13} fontWeight={700} fill={ink}>
        {title}
      </text>
      {rows.map((r, i) => (
        <g key={r.tag}>
          <rect x={22} y={y + 38 + i * 24} width={10} height={10} fill={r.tagFill} />
          <text x={40} y={y + 48 + i * 24} fontSize={12} fill={INK}>
            <tspan fontWeight={700}>{r.tag}:</tspan> {r.text}
          </text>
        </g>
      ))}
    </g>
  );
}

function DownArrow({ y }: { y: number }) {
  return (
    <g>
      <line x1={200} y1={y} x2={200} y2={y + 12} stroke={NEUTRAL_INK} strokeWidth={1.5} />
      <path d={`M 195 ${y + 10} L 200 ${y + 18} L 205 ${y + 10} Z`} fill={NEUTRAL_INK} />
    </g>
  );
}

function ThreeLayersDiagram() {
  return (
    <div style={NARROW}>
      <svg
        viewBox="0 0 400 510"
        role="img"
        aria-labelledby="aws-orchestration-layers-title"
        style={{ width: '100%', height: 'auto' }}
        fontFamily="sans-serif"
      >
        <title id="aws-orchestration-layers-title">
          Three layers chosen separately: a queue decides what runs next, a node provider starts the machines, a capacity
          market supplies them
        </title>
        <desc>
          A stack of four bands. On top an optional workflow layer. Then the queue layer, the node provider layer and the
          capacity market layer, each listing the choice for AWS Batch, SageMaker HyperPod and Amazon EKS.
        </desc>
        <rect x={0} y={0} width={400} height={510} fill="#fbfbfd" />

        <rect x={10} y={8} width={380} height={50} rx={6} fill="#ffffff" stroke={NEUTRAL_INK} strokeDasharray="5 4" />
        <text x={22} y={28} fontSize={13} fontWeight={700} fill={NEUTRAL_INK}>
          Optional: a workflow layer orders the steps
        </text>
        <text x={22} y={46} fontSize={12} fill={INK}>
          AWS Step Functions, or NVIDIA OSMO
        </text>
        <DownArrow y={60} />

        <LayerBand
          y={82}
          fill={CPU_FILL}
          ink={CPU_INK}
          title="1. A queue decides what runs next"
          rows={[
            { tag: 'AWS Batch', tagFill: ORCH_TAGS.batch, text: 'a job queue' },
            { tag: 'HyperPod', tagFill: ORCH_TAGS.hyperpod, text: 'Slurm, or Kueue on Kubernetes' },
            { tag: 'Amazon EKS', tagFill: ORCH_TAGS.eks, text: 'Kueue, KAI Scheduler or Volcano' },
          ]}
        />
        <DownArrow y={196} />
        <LayerBand
          y={218}
          fill={MEM_FILL}
          ink={MEM_INK}
          title="2. A node provider starts the machines"
          rows={[
            { tag: 'AWS Batch', tagFill: ORCH_TAGS.batch, text: 'a compute environment' },
            { tag: 'HyperPod', tagFill: ORCH_TAGS.hyperpod, text: 'an instance group' },
            { tag: 'Amazon EKS', tagFill: ORCH_TAGS.eks, text: 'a Karpenter or Auto Mode node pool' },
          ]}
        />
        <DownArrow y={332} />

        <rect x={10} y={354} width={380} height={146} rx={6} fill={STORE_FILL} stroke={STORE_INK} strokeWidth={1.2} />
        <text x={22} y={378} fontSize={13} fontWeight={700} fill={STORE_INK}>
          3. A capacity market supplies them
        </text>
        {[
          { x: 22, y: 392, label: 'On-Demand' },
          { x: 204, y: 392, label: 'Spot' },
          { x: 22, y: 428, label: 'Capacity Block for ML' },
          { x: 204, y: 428, label: 'SageMaker training plan' },
        ].map((c) => (
          <g key={c.label}>
            <rect x={c.x} y={c.y} width={174} height={28} rx={4} fill="#ffffff" stroke={STORE_INK} />
            <text x={c.x + 87} y={c.y + 18} fontSize={12} textAnchor="middle" fill={INK}>
              {c.label}
            </text>
          </g>
        ))}
        <text x={22} y={482} fontSize={12} fill={INK}>
          Savings Plans: a discount on the bill
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 24.1: five shapes leave one queue (animated)                       */
/* ------------------------------------------------------------------------ */

interface Token {
  letter: string;
  fill: string;
  ink: string;
  /** Position while waiting in the queue. */
  qx: number;
  /** Position after landing. */
  dx: number;
  dy: number;
  /** Step at which it lands. */
  at: number;
  /** True when the job finishes, so the token is gone in the last frame. */
  finishes: boolean;
}

const QUEUE_Y = 52;
const LAND_Y = [150, 264, 378, 492];
const LAST_STEP = 6;

const TOKENS: Token[] = [
  { letter: 'A', fill: RT_FILL, ink: RT_INK, qx: 60, dx: 318, dy: LAND_Y[0], at: 1, finishes: true },
  { letter: 'B', fill: TENSOR_FILL, ink: TENSOR_INK, qx: 130, dx: 354, dy: LAND_Y[0], at: 1, finishes: true },
  { letter: 'C', fill: TENSOR_FILL, ink: TENSOR_INK, qx: 200, dx: 354, dy: LAND_Y[1], at: 2, finishes: true },
  { letter: 'D', fill: CPU_FILL, ink: CPU_INK, qx: 270, dx: 354, dy: LAND_Y[2], at: 3, finishes: false },
  { letter: 'E', fill: ROBOT_FILL, ink: ROBOT_INK, qx: 340, dx: 354, dy: LAND_Y[3], at: 4, finishes: false },
];

interface Landing {
  y: number;
  title: string;
  sub: string;
  market: string;
  end: string;
  fill: string;
  ink: string;
  /** Step at which its work arrives. */
  at: number;
  /** True when its machines are gone in the last frame. */
  empties: boolean;
  /** False for the robot, which has no cloud instances to draw. */
  nodes: boolean;
}

const LANDINGS: Landing[] = [
  {
    y: 130,
    title: 'AWS Batch',
    sub: 'A as an array job, B as one job that checkpoints',
    market: 'Market: Spot with retry, On-Demand as fallback',
    end: 'Queue empty: 0 instances held',
    fill: '#ffffff',
    ink: CPU_INK,
    at: 1,
    empties: true,
    nodes: true,
  },
  {
    y: 244,
    title: 'SageMaker HyperPod',
    sub: 'Nodes start together; faulty ones are replaced',
    market: 'Market: Capacity Block or training plan',
    end: 'Run finished: the reservation has ended',
    fill: '#ffffff',
    ink: TENSOR_INK,
    at: 2,
    empties: true,
    nodes: true,
  },
  {
    y: 358,
    title: 'Amazon EKS with Kueue',
    sub: 'Node pools, with quotas shared between teams',
    market: 'Market: On-Demand, discounted by Savings Plans',
    end: 'The standing tier keeps its nodes',
    fill: '#ffffff',
    ink: MEM_INK,
    at: 3,
    empties: false,
    nodes: true,
  },
  {
    y: 472,
    title: 'The robot (no cloud queue)',
    sub: 'Greengrass delivers the policy; the arm runs it',
    market: 'Market: none, the hardware is on the desk',
    end: 'Still running on its own clock',
    fill: ROBOT_FILL,
    ink: ROBOT_INK,
    at: 4,
    empties: false,
    nodes: false,
  },
];

function fade(show: boolean, reduced: boolean): CSSProperties {
  return { opacity: show ? 1 : 0, transition: reduced ? 'none' : 'opacity 400ms ease' };
}

function LandingBox({ box, step, reduced }: { box: Landing; step: number; reduced: boolean }) {
  const arrived = step >= box.at;
  const last = step === LAST_STEP;
  const running = box.nodes && arrived && !(last && box.empties);
  const showEnd = last;
  return (
    <g>
      <rect
        x={10}
        y={box.y}
        width={380}
        height={104}
        rx={6}
        fill={box.fill}
        stroke={step === box.at ? EMPHASIS : box.ink}
        strokeWidth={step === box.at ? 2.5 : 1.2}
      />
      <text x={22} y={box.y + 24} fontSize={13} fontWeight={700} fill={box.ink}>
        {box.title}
      </text>
      <text x={22} y={box.y + 45} fontSize={12} fill={INK}>
        {box.sub}
      </text>
      <g style={fade(running && !showEnd, reduced)}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={22 + i * 20} y={box.y + 56} width={14} height={14} rx={2} fill={STORE_FILL} stroke={STORE_INK} />
        ))}
        <text x={88} y={box.y + 68} fontSize={12} fill={NEUTRAL_INK}>
          instances running
        </text>
      </g>
      <text x={22} y={box.y + 68} fontSize={12} fontWeight={700} fill={box.ink} style={fade(showEnd, reduced)}>
        {box.end}
      </text>
      <text x={22} y={box.y + 92} fontSize={12} fill={INK} style={fade(step >= 5, reduced)}>
        {box.market}
      </text>
    </g>
  );
}

function JobsLandingDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  return (
    <div style={NARROW}>
      <svg
        viewBox="0 0 400 586"
        role="img"
        aria-labelledby="aws-orchestration-landing-title"
        style={{ width: '100%', height: 'auto' }}
        fontFamily="sans-serif"
      >
        <title id="aws-orchestration-landing-title">
          Jobs of five shapes leave one queue and land on AWS Batch, SageMaker HyperPod, Amazon EKS and the robot
        </title>
        <desc>
          A queue at the top holds five tokens lettered A to E. Step by step they move to four boxes below. Each box then
          shows the capacity market under it, and in the last frame the machines that scaled to zero are gone.
        </desc>
        <rect x={0} y={0} width={400} height={586} fill="#fbfbfd" />

        <rect x={10} y={8} width={380} height={110} rx={6} fill={STORE_FILL} stroke={step === 0 ? EMPHASIS : STORE_INK} strokeWidth={step === 0 ? 2.5 : 1.2} />
        <text x={22} y={27} fontSize={13} fontWeight={700} fill={STORE_INK}>
          Work waiting, by shape
        </text>
        <text x={200} y={57} fontSize={12} textAnchor="middle" fill={NEUTRAL_INK} style={fade(step >= 4, reduced)}>
          nothing waiting
        </text>
        <text x={22} y={92} fontSize={12} fill={INK}>
          A fan-out, B one node for hours, C many nodes as one,
        </text>
        <text x={22} y={109} fontSize={12} fill={INK}>
          D always on, E on the robot&apos;s clock
        </text>

        {LANDINGS.map((b) => (
          <LandingBox key={b.title} box={b} step={step} reduced={reduced} />
        ))}

        {TOKENS.map((t) => {
          const landed = step >= t.at;
          const gone = step === LAST_STEP && t.finishes;
          return (
            <g
              key={t.letter}
              style={{
                transform: `translate(${landed ? t.dx : t.qx}px, ${landed ? t.dy : QUEUE_Y}px)`,
                opacity: gone ? 0 : 1,
                transition: reduced ? 'none' : 'transform 700ms ease, opacity 400ms ease',
              }}
            >
              <circle cx={0} cy={0} r={14} fill={t.fill} stroke={t.ink} strokeWidth={1.5} />
              <text x={0} y={4.5} fontSize={13} fontWeight={700} textAnchor="middle" fill={t.ink}>
                {t.letter}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const LANDING_STEPS = [
  <>
    One backlog holds work of all five shapes from section 20: A fan-out, B one node for hours, C many nodes as one, D
    always on, E on the robot&apos;s clock.
  </>,
  <>
    Shapes A and B go to AWS Batch. A becomes an array job, one submission that spawns 2 to 10,000 child jobs, one per
    episode or scene. B is a single job that saves checkpoints.
  </>,
  <>
    Shape C, a multi-day training run across many nodes, goes to a SageMaker HyperPod cluster, which starts every node
    of the job together and replaces a faulty one.
  </>,
  <>
    Shape D, a standing tier that several teams share, goes to Amazon EKS, with Kueue holding each team&apos;s quota.
  </>,
  <>
    Shape E never enters a cloud queue. AWS IoT Greengrass delivers the policy, and the computer beside the arm runs it
    on the robot&apos;s clock.
  </>,
  <>
    Each landing sits on a capacity market. Fan-out takes Spot because losing a machine costs one child. The multi-node
    run takes a reservation. The standing tier pays for On-Demand machines at a discount.
  </>,
  <>
    The backlog is empty. Batch holds 0 instances because its compute environment sets <code>minvCpus</code> to 0, and
    the reserved cluster ended with its reservation. The standing tier and the robot keep running.
  </>,
];

/* ------------------------------------------------------------------------ */
/* Section                                                                    */
/* ------------------------------------------------------------------------ */

export function AwsOrchestration() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what each scheduler is good at and which capacity market each instance family can use, with configuration to adapt (AWS documentation, Karpenter v1.15.2, Kueue v0.20.7 and OSMO 6.3.1, read 2026-11-20)."
          >
            24. Orchestrating It on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section builds on section 20, Fifteen Workloads, Five Shapes, which sorted the loop&apos;s jobs by
            duration, coupling and interruptibility, and on section 13, Rendering and Ray Tracing, which showed why a
            simulator that renders cameras needs a G-family GPU. It answers the next question: once you know the
            machine, what starts it, what puts your job on it, and what takes it away when the job ends.
          </Box>
          <Box variant="p">
            That is orchestration. It matters because a GPU that waits costs the same as a GPU that works, and the
            three AWS services that schedule GPU jobs are good at different shapes. AWS Batch is a managed queue
            that starts machines for a job and removes them afterwards. Amazon SageMaker HyperPod is a managed,
            long-lived cluster that AWS keeps healthy. Amazon EKS (Elastic Kubernetes Service) is managed Kubernetes,
            where you assemble the queue and the node supply yourself. {TASK_SENTENCE}
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="After this block you can take any orchestration product apart into the same three decisions, and see that changing one leaves the other two in place."
          >
            Three layers, chosen separately
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every way of running a job on rented GPUs answers three questions, and each question has its own layer.
          </Box>
          <Figure
            caption="Read from the top down. A job enters a queue, the queue asks a node provider for a machine, and the node provider draws the machine from a capacity market. Each band lists what fills that layer for the three AWS orchestrators. Illustrative, not measured."
          >
            <ThreeLayersDiagram />
          </Figure>
          <Box variant="p">
            <strong>Layer 1, the queue.</strong> A scheduler holds the jobs that are waiting and decides which one runs
            next and where. In AWS Batch it is called a <em>job queue</em>. On Kubernetes the default scheduler places
            one pod at a time, so batch work adds a queueing layer on top: Kueue, KAI Scheduler or Volcano, covered
            below. Four words describe what a queue can do. A <em>quota</em> is the share of the machines a team is
            entitled to. <em>Borrowing</em> lets a team run past its quota on machines another team is leaving idle.{' '}
            <em>Preemption</em> is the scheduler stopping a running job to give its machine to a job with a stronger
            claim, for example the lender asking for its machines back. <em>Gang scheduling</em> means all the pods or
            nodes of one job start together or none do, which a training run spread over several nodes needs because
            half of it cannot make progress alone.
          </Box>
          <Box variant="p">
            <strong>Layer 2, the node provider.</strong> Something has to start a virtual machine when a job is waiting
            and remove it when nothing is. In Batch that is a <em>compute environment</em>: a list of allowed instance
            types with a floor and a ceiling on the vCPUs (virtual CPUs) it may run. On EKS it is a <em>node pool</em>,
            the same idea expressed as Kubernetes configuration and filled by Karpenter or by EKS Auto Mode. In HyperPod
            it is an <em>instance group</em>. A node provider also does <em>bin packing</em>: fitting the waiting jobs
            onto as few machines as it can, and emptying a machine that is mostly idle so it can be handed back.
          </Box>
          <Box variant="p">
            <strong>Layer 3, the capacity market.</strong> The machine itself is bought in one of four ways.{' '}
            <em>On-Demand</em> is a machine by the second with no commitment and no promise that one is free.{' '}
            <em>Spot</em> is spare capacity that AWS can take back; the taking back is a <em>Spot interruption</em>, and
            it comes with two minutes of warning on a best-effort basis. A <em>Capacity Block for ML</em> reserves GPU
            instances for a fixed window that you book ahead and pay for up front. A <em>SageMaker training plan</em> is
            the same kind of reservation made through SageMaker, for a HyperPod cluster or a training job. Savings Plans
            sit beside these as a billing construct: a discount on what you run, applied to the bill.{' '}
            <Cite id="F09-95">EC2 User Guide, Spot interruption notices and best practices</Cite>{' '}
            <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>{' '}
            <Cite id="F09-34">SageMaker Developer Guide, training plans</Cite>{' '}
            <Cite id="F09-94">EC2 User Guide, On-Demand Capacity Reservations</Cite>
          </Box>
          <Box variant="p">
            The three orchestrators differ in how many layers they own. Batch owns the queue and the node provider.
            HyperPod owns the health of the nodes and leaves the queue to Slurm or to Kueue. On EKS the two are separate
            products. A workflow layer above them orders the steps and still needs one of the three underneath. This
            decomposition is our reading of the documentation.{' '}
            <Cite id="F09-13">AWS Batch User Guide, Amazon EKS compute environments, and the scale-down delay post</Cite>{' '}
            <Cite id="F09-22">SageMaker Developer Guide, Amazon SageMaker HyperPod</Cite>{' '}
            <Cite id="F09-54">Kueue v0.20.7 documentation, overview</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Watch one backlog split by shape, so that for your own job you can name the orchestrator and the market before you open a console."
          >
            Where the five shapes land
          </Header>
        }
      >
        <SpaceBetween size="m">
          <AnimatedFigure
            name="five job shapes leaving one queue"
            steps={LANDING_STEPS}
            intervalMs={2200}
            cites="F09-5 F09-13 F09-22 F09-24 F09-26 F09-90 F09-34 F07-84"
            caption="Press Play or Step. The lettered tokens are the five shapes of section 20. Each box is an orchestrator; the last line in a box is the capacity market under it. The mapping is this dive's reading. Illustrative, not measured."
          >
            {(step, reduced) => <JobsLandingDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The table states the same mapping with the reason for each row. It is our reading: no AWS page that compares
            Batch, HyperPod and EKS side by side for training or simulation was located in this research.{' '}
            <Cite id="F09-110">searches of AWS documentation run on 2026-11-20</Cite> Section 25, Choosing, gives
            the full table with one row per workload.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={TH}>Shape</th>
                  <th style={TH}>Lands on</th>
                  <th style={TH}>Capacity market</th>
                  <th style={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <strong>A.</strong> Fan-out
                  </td>
                  <td style={TD}>An AWS Batch array job</td>
                  <td style={TD}>Spot, with On-Demand as the fallback</td>
                  <td style={TD}>
                    A reclaimed machine costs one child, and Batch retries it.{' '}
                    <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>{' '}
                    <Cite id="F09-10">AWS Batch User Guide, Spot best practices</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>B.</strong> One node for hours
                  </td>
                  <td style={TD}>One Batch job, or a SageMaker training job</td>
                  <td style={TD}>On-Demand with several instance types listed; Spot only with checkpoints</td>
                  <td style={TD}>
                    No cluster to keep. AWS&apos;s toolchain sample offers both, and picks Batch when runs come back to
                    back.{' '}
                    <Cite id="F09-73">AWS Physical AI Toolchain sample, GR00T and Isaac Lab guides</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>C.</strong> Many nodes as one
                  </td>
                  <td style={TD}>SageMaker HyperPod</td>
                  <td style={TD}>A Capacity Block or a training plan</td>
                  <td style={TD}>
                    Long, coupled and failure-prone by node count: the case an AWS post gives for a persistent cluster.{' '}
                    <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>D.</strong> Always on
                  </td>
                  <td style={TD}>Amazon EKS node pools with a queueing layer</td>
                  <td style={TD}>On-Demand under Savings Plans; Spot for the work that borrows</td>
                  <td style={TD}>
                    A steady tier that several teams share needs quotas and borrowing, which is what Kueue adds.{' '}
                    <Cite id="F09-55">Kueue v0.20.7 documentation, ClusterQueue and Cohort</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <strong>E.</strong> On the robot&apos;s clock
                  </td>
                  <td style={TD}>No cloud scheduler: AWS IoT Greengrass delivers it</td>
                  <td style={TD}>None</td>
                  <td style={TD}>
                    The work belongs to the device, so the cloud side is a deployment service.{' '}
                    <Cite id="F07-84">AWS IoT Greengrass v2 documentation</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You leave with a job definition, a submission and a compute environment for a GPU fan-out that survives Spot reclaims and holds no machine when idle."
          >
            AWS Batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Batch is a managed job queue. You describe a container job once, submit it to a queue, and Batch starts
            EC2 (Elastic Compute Cloud) instances for it, runs it, retries it and removes the instances when the queue
            is empty. It is the right first choice for shape A and for a shape B job that runs a few times a week,
            because nothing persists between runs. Use something else when several teams need to lend each other idle GPUs: the two Batch pages on
            scheduling describe no preemption of a running container job.{' '}
            <Cite id="F09-14">AWS Batch User Guide, job scheduling and fair share</Cite>
          </Box>
          <Box variant="p">
            The primitive that fits simulation and evaluation is the <em>array job</em>: one submission that spawns 2 to
            10,000 child jobs sharing one job definition. Each child reads its own index from the environment variable{' '}
            <code>AWS_BATCH_JOB_ARRAY_INDEX</code>, starting at 0, and uses it to pick its seed, its scene or its
            checkpoint. The 500 evaluation episodes of the arm are one array of 500 children.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Snippet
            title="A job definition for one GPU episode, with the Spot retry and a timeout"
            mode="adapted"
            source={
              <>
                <Cite id="F09-129">AWS Batch User Guide, Test GPU functionality, and API Reference, RegisterJobDefinition</Cite>{' '}
                <Cite id="F09-128">AWS Batch User Guide, Run GPU jobs, and API Reference, ResourceRequirement</Cite>{' '}
                <Cite id="F09-10">AWS Batch User Guide, Spot best practices</Cite>
              </>
            }
          >
            {BATCH_JOB_DEFINITION}
          </Snippet>
          <Box variant="p">
            The structure is the documentation&apos;s own GPU test job definition, and the vCPU and memory values (8 and
            32000 MiB) are that example&apos;s. Changed: the name, the image and the command. Added: the{' '}
            <code>GPU</code> requirement, which pins one physical GPU to the container so no other job on the instance
            can use it; the <code>retryStrategy</code> block, copied as printed on the Spot best-practices page; and the{' '}
            <code>timeout</code>. <Cite id="F09-128">AWS Batch User Guide, Run GPU jobs</Cite>{' '}
            <Cite id="F09-129">AWS Batch API Reference, RegisterJobDefinition</Cite>
          </Box>
          <Box variant="p">
            Read the retry block as a filter. A status reason that starts with <code>Host EC2</code> means the machine
            was reclaimed, so the child is retried, here up to 5 times (Batch allows 1 to 10 attempts), and a retried
            job goes to the front of its queue. Any other failure exits at once, so a bug in your code does not burn
            five machines. <Cite id="F09-10">AWS Batch User Guide, Spot best practices and automated job retries</Cite>
          </Box>
          <Box variant="p">
            The timeout is per child, and Batch has none unless you set one. The value here,{' '}
            <Derived>1800</Derived> seconds, is our arithmetic: 30 minutes times 60, the 30 minutes being the part
            length Batch&apos;s Spot guidance names when it advises against Spot jobs of an hour or more. A job ended by
            its timeout is not retried. <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
          </Box>
          <Snippet
            title="Submitting the 500 episodes as one array job"
            mode="adapted"
            source={<Cite id="F09-130">AWS Batch API Reference, SubmitJob, sample request and request syntax</Cite>}
          >
            {BATCH_SUBMIT}
          </Snippet>
          <Box variant="p">
            This is the API reference&apos;s three-field sample request with our names in it, plus the{' '}
            <code>arrayProperties</code> block from the same page&apos;s request syntax, with a size of 500. That one
            field turns a job into an array job. The parent fails if any child fails, so by our advice the script
            reports a failed episode as a result and keeps a failing exit code for real errors. <Cite id="F09-130">AWS Batch API Reference, SubmitJob</Cite>{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Snippet
            title="A Spot compute environment on two G families that scales to zero"
            mode="adapted"
            source={
              <Cite id="F09-131">AWS Batch User Guide, Compute environment template, and API Reference, ComputeResource</Cite>
            }
          >
            {BATCH_COMPUTE_ENVIRONMENT}
          </Snippet>
          <Box variant="p">
            This is the documentation&apos;s skeleton for a managed EC2 compute environment. Changed: the name, the
            resource type from <code>EC2</code> to <code>SPOT</code>, the allocation strategy, the instance types,
            which now name two G families with ray-tracing cores, and the image type, which names the GPU image so
            the instances come up with the NVIDIA driver. Removed: the launch template and the tags. Everything
            else, including the placeholder subnet, security group and role, is as printed. The API reference asks for
            a Spot Fleet role in <code>spotIamFleetRole</code> only with the <code>BEST_FIT</code> allocation strategy
            or with none set; this snippet sets its own strategy and needs none.{' '}
            <Cite id="F09-131">AWS Batch User Guide, Compute environment template</Cite>
          </Box>
          <Box variant="p">
            Three lines carry the behaviour. <code>minvCpus</code> 0 is scale to zero: when the queue is empty the
            environment holds no instances, and the first job of the next wave waits the few minutes a new EC2 instance
            takes. <code>maxvCpus</code> is the budget cap, and 16 is the skeleton&apos;s value, enough for two jobs of
            8 vCPUs at a time, so raise it to what you are willing to run at once; Batch may exceed it by at most one
            instance. <code>SPOT_PRICE_CAPACITY_OPTIMIZED</code> is the strategy the documentation recommends for most
            Spot use: it picks the pools least likely to be interrupted at the lowest price.{' '}
            <Cite id="F09-13">AWS Batch User Guide, Amazon EKS compute environments</Cite>{' '}
            <Cite id="F09-1">AWS Batch User Guide, When to use Fargate</Cite>{' '}
            <Cite id="F09-131">AWS Batch User Guide, Compute environment template</Cite>{' '}
            <Cite id="F09-4">AWS Batch User Guide, allocation strategies, maxvCpus</Cite>{' '}
            <Cite id="F09-3">AWS Batch User Guide, allocation strategies</Cite>
          </Box>
          <ExpandableSection headerText="Limits and 2026 changes worth knowing before you rely on Batch">
            <ul style={LIST}>
              <li>
                Batch can run one job across several instances, a multi-node parallel job, which its guide also calls
                gang scheduling. Such jobs do not run on Spot compute environments, and only a failure of the main node
                triggers a retry. <Cite id="F09-7">AWS Batch User Guide, Multi-node parallel jobs</Cite>{' '}
                <Cite id="F09-8">AWS Batch User Guide, compute environment considerations for multi-node jobs</Cite>
              </li>
              <li>
                Since 2 March 2026 the parameter <code>minScaleDownDelayMinutes</code> keeps an instance for 20 minutes
                to 1 week after its last job, so the next job of a burst skips the instance launch.{' '}
                <Cite id="F09-13">AWS What&apos;s New, configurable scale down delay</Cite>
              </li>
              <li>
                For Spot compute environments created or updated from 9 October 2026, Batch drains an instance on the
                two-minute notice: running jobs continue and no new job lands on it.{' '}
                <Cite id="F09-12">AWS Batch User Guide, Spot best practices</Cite>
              </li>
              <li>
                A queue is first-in, first-out unless a scheduling policy turns on fair-share scheduling. Quota shares
                with preemption arrived on 25 March 2026 and only for SageMaker Training jobs submitted through Batch,
                with up to 20 quota shares per job queue.{' '}
                <Cite id="F09-14">AWS Batch User Guide, job scheduling</Cite>{' '}
                <Cite id="F09-15">AWS Batch User Guide, Quota management</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can tell when a persistent cluster earns its cost, and what reserving its GPUs commits you to."
          >
            SageMaker HyperPod
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod is a managed cluster of ML instances that stays up between jobs. You schedule it with Slurm, the
            job scheduler of classic supercomputing, or with Kubernetes, in which case one HyperPod cluster provides the
            worker nodes of one EKS control plane. Where Batch starts machines for a job and removes them, HyperPod
            keeps the machines and repairs them: it tests GPUs before work lands on them and replaces a faulty node
            automatically. <Cite id="F09-22">SageMaker Developer Guide, Amazon SageMaker HyperPod</Cite>{' '}
            <Cite id="F09-23">SageMaker Developer Guide, Deep health checks</Cite>{' '}
            <Cite id="F09-24">SageMaker Developer Guide, automatic node recovery</Cite>
          </Box>
          <Box variant="p">
            It is good at shape C, and at any pool that many jobs share all day. An AWS post states when the persistent
            cluster pays: a one-shot small fine-tune is served by an ephemeral training job, and HyperPod suits
            &quot;many concurrent jobs, continuous synthetic generation, reserved capacity, and the tens-of-nodes tail
            where failures are statistically frequent&quot;. AWS&apos;s own rule from its newest post on training robot
            policies is one sentence: training jobs for a fully managed service, HyperPod for a team that already runs
            Kubernetes or Slurm and wants a persistent cluster. For one arm and one-GPU fine-tunes, that rule points away from HyperPod. <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
            <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite>
          </Box>
          <Box variant="p">
            Sharing is where the queue layer shows. HyperPod&apos;s multi-team feature, task governance, is built on
            Kueue: the add-on at version v1.6.1-eksbuild.1 installs Kueue v0.19.2. An administrator gives each team a
            compute allocation; a team can borrow up to 10,000% of its allocation from idle compute, and by default the
            team that lent the compute preempts the borrowers when it returns. Training holds
            guaranteed quota; simulation and evaluation borrow idle GPUs.{' '}
            <Cite id="F09-25">SageMaker Developer Guide, task governance setup</Cite>{' '}
            <Cite id="F09-26">SageMaker Developer Guide, task governance policies</Cite>
          </Box>
          <Box variant="p">
            The node layer is less fixed than it was. With managed Karpenter, node groups can scale to zero. Since the
            16 April 2026 release note, one instance group can list up to 20 instance types in priority order. Since 18
            November 2026 HyperPod supports higher pod density per node on EKS-orchestrated clusters, which AWS ties to
            using every slice of a GPU that has been partitioned with MIG (Multi-Instance GPU, NVIDIA&apos;s hardware
            split of one GPU into isolated parts). <Cite id="F09-27">SageMaker Developer Guide, autoscaling on HyperPod</Cite>{' '}
            <Cite id="F09-29">SageMaker HyperPod release notes, 16 April 2026</Cite>{' '}
            <Cite id="F09-115">AWS What&apos;s New, 18 November 2026</Cite>
          </Box>
          <Box variant="p">
            The capacity under a HyperPod cluster is usually reserved with a SageMaker training plan: 1 to 182 days in
            1-day steps, in quantities of 1, 2, 4, 8, 16, 32 or 64 instances, bookable up to 8 weeks ahead, ending at
            11:30 AM UTC on the last day. A reservation fixes the shape of the job, so plan the last checkpoint before
            that hour. A cluster sits in a single Availability Zone by default, because the traffic of EFA (Elastic
            Fabric Adapter, the EC2 network device that lets the nodes of one job exchange data without going through
            the kernel) cannot cross zones. The <Link href="../efa/">EFA dive</Link> covers that network, and the{' '}
            <Link href="../llm-training-systems/">Training at Scale dive</Link> covers distributed training itself.{' '}
            <Cite id="F09-34">SageMaker Developer Guide, training plans</Cite>{' '}
            <Cite id="F09-36">SageMaker Developer Guide, HyperPod prerequisites</Cite>
          </Box>
          <ExpandableSection headerText="Checkpointless training, and why it is not yet a robotics feature">
            <Box variant="p">
              Checkpointless training recovers a failed node&apos;s training state from healthy peers instead of
              restarting the job from a saved checkpoint. AWS reports over 80% less downtime in internal studies on 16
              to over 2,000 GPUs. The documented recipes are language models on 2 or 16 p5.48xlarge nodes, and no
              first-party example on a robot policy or a world model was located in this research.{' '}
              <Cite id="F09-30">AWS News Blog, 3 December 2025, and SageMaker Developer Guide</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You get a node pool for a simulation fleet, and the dated limits that decide whether Auto Mode can host it."
          >
            Amazon EKS: Karpenter and Auto Mode
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On EKS the node provider is a separate choice. Karpenter is the open-source node provisioner AWS builds for
            Kubernetes: it watches pods that cannot be placed and launches EC2 instances that fit them, from a{' '}
            <code>NodePool</code> that states the constraints and a node class that holds the AWS settings. The AWS
            provider is at v1.15.2, released 12 November 2026. EKS Auto Mode is the managed form: AWS runs
            Karpenter-based scaling, the machine image, patching and the GPU drivers for you. Choose EKS when the team
            already lives in Kubernetes, or when shape D work and batch work must share one pool. <Cite id="F09-38">Karpenter provider for AWS, release v1.15.2</Cite>{' '}
            <Cite id="F09-48">EKS User Guide, Auto Mode and accelerated workloads</Cite>
          </Box>
          <Snippet
            title="An Auto Mode NodePool for NVIDIA GPUs on the G6e and G6 families"
            mode="copied"
            source={<Cite id="F09-132">EKS User Guide, Deploy an accelerated workload, Create an NVIDIA NodePool</Cite>}
          >
            {AUTO_MODE_NODEPOOL}
          </Snippet>
          <Box variant="p">
            The <code>requirements</code> list is the node pool&apos;s filter: On-Demand capacity, x86 machines, and
            only the two G families, both of which have the ray-tracing cores a camera-rendering simulator needs. The{' '}
            <code>disruption</code> block is the bin-packing policy: a node is removed only when it is empty and has
            been empty for 1 hour, a value the guide chose because it &quot;supports spiky workloads and reduces node
            churn&quot;, and at most 10% of nodes are disrupted at once. With no pods the pool holds no nodes.{' '}
            <Cite id="F09-132">EKS User Guide, Create an NVIDIA NodePool</Cite>{' '}
            <Cite id="F09-48">EKS User Guide, Auto Mode accelerated workloads</Cite>{' '}
            <Cite id="F06-60">AWS post of 2026-06-09 on RTX rendering and instance families</Cite>
          </Box>
          <Box variant="p">
            Two edits make it a fan-out pool. The EKS best-practices guide&apos;s pattern for interruptible work sets
            the capacity type to Spot and consolidates under-used nodes after 5 minutes; for training it keeps{' '}
            <code>WhenEmpty</code> with a long wait, because the aggressive policy &quot;may terminate nodes
            prematurely&quot;. <Cite id="F09-39">EKS Best Practices Guide, compute and autoscaling for AI/ML</Cite>
          </Box>
          <Box variant="p">
            Three dated limits decide whether Auto Mode fits a GPU fleet. First, families: G7e is supported, and in the
            guide&apos;s words &quot;As of November 2026, G7 is not supported&quot;; for G7 the guide points to
            self-managed Karpenter or a managed node group. Second, lifetime: an Auto Mode node lives at most 21 days,
            so a longer run must checkpoint and resume across a node replacement. Third, reservations: a Capacity Block
            is used only when a node class selects it, paired with a static node pool, and Auto Mode starts draining
            those nodes 10 minutes before EC2 begins terminating them, which is 30 minutes before the block ends.{' '}
            <Cite id="F09-49">EKS Best Practices Guide, migrating to G7 and G7e</Cite>{' '}
            <Cite id="F09-48">EKS User Guide, Auto Mode</Cite>{' '}
            <Cite id="F09-50">EKS User Guide, static NodePool from a Capacity Block</Cite>
          </Box>
          <ExpandableSection headerText="Two November 2026 additions to EKS, with their status and what they do for GPU work">
            <ul style={LIST}>
              <li>
                <strong>EKS Auto Mode resource optimization is in preview</strong> since 17 November 2026. It resizes
                the CPU and memory requests of running pods from their observed usage. It covers Deployments and
                StatefulSets only, in seven Regions, needs about 12 hours of usage history first, and &quot;doesn&apos;t
                size GPUs&quot;. By our reading it helps the loop&apos;s long-running services and leaves its batch jobs,
                which are Kubernetes Jobs short of GPUs, as they are. <Cite id="F09-46">AWS What&apos;s New, 17 November 2026, and EKS User Guide, resource optimization</Cite>
              </li>
              <li>
                <strong>AWS Nitro Sandboxes</strong>, announced 9 November 2026 as generally available on Kubernetes
                1.36 or later, run a pod inside its own hardware-isolated microVM (a small virtual machine with its own
                Linux kernel). As announced, a sandbox cannot use a GPU: on accelerated instances it &quot;runs CPU
                workloads only&quot;. Up to 5 sandboxes fit per parent vCPU and 896 per instance, at least 256 MiB each.
                Section 19 uses it as the fence around code an agent writes.{' '}
                <Cite id="F09-43">AWS What&apos;s New and EKS User Guide, Nitro Sandboxes</Cite>{' '}
                <Cite id="F09-45">EC2 User Guide, Nitro Sandboxes, considerations and limitations</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can pick the queueing layer for a shared cluster by what it controls: admission, placement or both."
          >
            Queueing on Kubernetes: Kueue, KAI Scheduler, Volcano
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Karpenter and Auto Mode provide nodes. They do not decide whose job goes first when GPUs are short. Three
            open-source projects fill that layer, and they split into two kinds.
          </Box>
          <Box variant="p">
            <strong>Kueue</strong> is an admission layer. In its own words it &quot;manages quotas and how jobs consume
            them&quot;: it decides when a job waits, when it is admitted so its pods may be created, and when it is
            preempted. It does not place pods on nodes; that stays with the default scheduler. Its unit is the{' '}
            <code>ClusterQueue</code>, a pool of quota with three numbers per kind of node: <code>nominalQuota</code> is
            what the queue owns, <code>borrowingLimit</code> caps what it may take from the unused quota of others, and{' '}
            <code>lendingLimit</code> caps what it gives. Queues that name the same cohort share unused quota. Kueue is
            at v0.20.7, released 19 November 2026, and it is what HyperPod task governance installs, so its concepts
            carry between the two. <Cite id="F09-54">Kueue v0.20.7 documentation, overview</Cite>{' '}
            <Cite id="F09-55">Kueue v0.20.7 documentation, ClusterQueue, Cohort and preemption</Cite>
          </Box>
          <Box variant="p">
            <strong>KAI Scheduler</strong> and <strong>Volcano</strong> are full schedulers: they replace the default
            scheduler for the pods that ask for them, so they can do gang scheduling. KAI Scheduler, at v0.19.0 of 11
            November 2026, adds hierarchical queues with quotas, preemption and fractional GPUs. Its default fraction
            mode has no memory isolation at run time: &quot;Containers may see and use more GPU memory than
            requested.&quot; Volcano, at v1.16.0 of 14 October 2026, offers job queues and gang scheduling with
            integrations for common training frameworks. <Cite id="F09-57">KAI Scheduler v0.19.0, README</Cite>{' '}
            <Cite id="F09-58">KAI Scheduler v0.19.0, GPU sharing documentation</Cite>{' '}
            <Cite id="F09-59">Volcano v1.16.0, README</Cite>
          </Box>
          <Box variant="p">
            AWS&apos;s own use is a guide: HyperPod installs Kueue, the EKS best-practices guide names KAI Scheduler for
            fractional GPUs, and no AWS documentation page read in this research names Volcano.{' '}
            <Cite id="F09-60">register synthesis over the AWS and OSMO pages read</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can read an OSMO workflow, and you know which parts of AWS's sample are built and which are planned."
          >
            NVIDIA OSMO and the AWS Physical AI Toolchain sample
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            OSMO is NVIDIA&apos;s open-source workflow orchestrator for physical AI. It is the optional top band of the
            first diagram: it orders the steps of a pipeline and hands each to a Kubernetes cluster. A workflow is a
            DAG (directed acyclic graph, steps joined by one-way dependencies) of tasks, a task is a container with
            commands, and each task names a <em>platform</em>, the kind of hardware it needs. The newest release is
            6.3.1, of 22 June 2026. <Cite id="F09-62">NVIDIA OSMO 6.3.1, README</Cite>{' '}
            <Cite id="F09-61">NVIDIA OSMO, release 6.3.1</Cite>
          </Box>
          <Snippet
            title="An OSMO workflow that chains simulation, training and evaluation on three kinds of machine"
            mode="copied"
            source={<Cite id="F09-63">NVIDIA OSMO at tag 6.3.1, README and workflow documentation</Cite>}
          >
            {OSMO_WORKFLOW}
          </Snippet>
          <Box variant="p">
            Three tasks, three platforms. The <code>inputs</code> lines are the edges of the graph: training waits for
            the simulation&apos;s output, and evaluation waits for training. Only <code>train-policy</code> asks for
            GPUs by count, 8 of them. The platform names belong to whoever set up the cluster; on AWS, by our reading,
            the first maps to G7e and the last is a Jetson outside the cloud.{' '}
            <Cite id="F09-63">NVIDIA OSMO at tag 6.3.1, README</Cite>
          </Box>
          <Box variant="p">
            Underneath, OSMO schedules with KAI Scheduler. A pool is a set of machines shared between users with a GPU
            quota. A workflow at <code>HIGH</code> or <code>NORMAL</code>{' '}
            priority counts against the quota and is not preempted; a <code>LOW</code> workflow does not count, may
            borrow idle GPUs from other pools, and can be preempted and rescheduled.{' '}
            <Cite id="F09-65">NVIDIA OSMO, release notes 6.2.8 and 6.3.0</Cite>{' '}
            <Cite id="F09-64">NVIDIA OSMO 6.3.1, resource pools and scheduling</Cite>
          </Box>
          <Box variant="p">
            AWS packages OSMO in the AWS Physical AI Toolchain, a sample repository created 9 July 2026 and announced 7
            October 2026. It has no tagged releases, so the only stable reference is a commit. Its components are
            independent Terraform modules: an Isaac Lab component that runs 4096 parallel environments on SageMaker and
            Batch, fine-tuning on SageMaker and Batch, an Isaac Sim workstation, and OSMO on EKS. Edge deployment to a
            Jetson is listed as planned. <Cite id="F09-69">AWS Physical AI Toolchain sample, README</Cite>{' '}
            <Cite id="F09-70">AWS Physical AI Toolchain sample, components table</Cite>
          </Box>
          <Box variant="p">
            The sample says when to use OSMO: for a new pipeline built from nothing, or for one control plane across
            cloud, lab and edge. A team that already runs a workflow system is told to keep it and take the individual
            components. Its OSMO module installs no node autoscaler, so as shipped the GPU nodes stay until someone
            changes the node group size.{' '}
            <Cite id="F09-72">AWS Physical AI Toolchain sample, OSMO guidance</Cite>{' '}
            <Cite id="F09-74">AWS Physical AI Toolchain sample, OSMO on AWS README</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can say, for the instance family your job needs, which ways of buying it exist, before you design around a reservation that is not offered."
          >
            Capacity markets by instance family
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The GPU family decides the market before the orchestrator does. Training wants the P family&apos;s tensor
            throughput; a simulator that renders cameras needs the G family&apos;s ray-tracing cores. The two are bought
            differently, even inside one cluster.
          </Box>
          <Box variant="p">
            A Capacity Block for ML has a start time up to eight weeks ahead, with some offerings starting in as little
            as 30 minutes. It holds up to 64 instances per block and 256 across blocks, for up to six months, and it
            ends at 11:30 UTC. It cannot be cancelled, moved or split.{' '}
            <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>
          </Box>
          <Box variant="p">
            <strong>
              The Capacity Blocks list and the SageMaker training plans list, as read on 2026-11-20, name no G-family
              type.
            </strong>{' '}
            Both lists hold P and Trainium types, and the training plans page says availability &quot;may change over
            time&quot;. For a G-family fleet the reservation the documentation does describe is an On-Demand Capacity
            Reservation: capacity held for a named instance type in one Availability Zone for any duration, charged at
            the On-Demand rate whether or not an instance runs in it.{' '}
            <Cite id="F09-91">EC2 User Guide, Capacity Blocks, supported instance types</Cite>{' '}
            <Cite id="F09-35">SageMaker Developer Guide, training plans, supported instance types</Cite>{' '}
            <Cite id="F09-40">EKS Best Practices Guide, capacity reservations</Cite>{' '}
            <Cite id="F09-94">EC2 User Guide, On-Demand Capacity Reservations</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
              <caption style={{ captionSide: 'top', textAlign: 'left', paddingBottom: 6 }}>
                <Box variant="small" color="text-body-secondary">
                  Spot columns come from AWS&apos;s Spot Instance Advisor data file, last modified 20 March 2026. A
                  bucket is the share of running instances interrupted in the trailing month.
                </Box>
              </caption>
              <thead>
                <tr>
                  <th style={TH}>Family</th>
                  <th style={TH}>Spot, by the advisor file</th>
                  <th style={TH}>Capacity Block for ML</th>
                  <th style={TH}>SageMaker training plan</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>G5</td>
                  <td style={TD}>US East (N. Virginia): 7 of 8 sizes in the &quot;&gt;20%&quot; bucket</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>
                    <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-35">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>G6e</td>
                  <td style={TD}>US East (N. Virginia): 5 of 8 sizes in the &quot;&gt;20%&quot; bucket</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>
                    <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-35">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>G7e</td>
                  <td style={TD}>
                    US East (N. Virginia): 3 of 6 sizes above 20%. US East (Ohio): 4 of 6 sizes in &quot;&lt;5%&quot;
                  </td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>
                    <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-35">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>G7</td>
                  <td style={TD}>Sold on Spot; no rows in the file, which is older than the family</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>
                    <Cite id="F09-98">G7 and G7e launch posts</Cite> <Cite id="F09-96">Spot Instance Advisor data file</Cite>{' '}
                    <Cite id="F09-91">Capacity Blocks list</Cite> <Cite id="F09-35">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>P5, P5en</td>
                  <td style={TD}>
                    US East (N. Virginia): p5.48xlarge, p5.4xlarge and p5en.48xlarge in the &quot;&lt;5%&quot; bucket
                  </td>
                  <td style={TD}>On the list</td>
                  <td style={TD}>On the list</td>
                  <td style={TD}>
                    <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-34">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>P6-B200, P6-B300</td>
                  <td style={TD}>US East (N. Virginia): p6-b200.48xlarge in &quot;10-15%&quot;</td>
                  <td style={TD}>On the list</td>
                  <td style={TD}>On the list</td>
                  <td style={TD}>
                    <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-34">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>P6e-GB200 UltraServers</td>
                  <td style={TD}>No rows in the file</td>
                  <td style={TD}>UltraServer blocks, in the US East (Dallas) Local Zone only</td>
                  <td style={TD}>Through an account manager</td>
                  <td style={TD}>
                    <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-34">training plans list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Graviton C8g, M8g (CPU)</td>
                  <td style={TD}>
                    US West (Oregon): 7 of 12 C8g sizes and 8 of 12 M8g sizes in the &quot;&lt;5%&quot; bucket
                  </td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>Not on the list read</td>
                  <td style={TD}>
                    <Cite id="F09-97">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                    <Cite id="F09-34">training plans list</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Read the Spot column as one Region in one month. In the busiest Region the G sizes a simulation fleet wants
            are often reclaimed, which is why the Batch retry block and a list of several instance types matter most
            for simulation. The EC2 guide
            gives the general rule: be flexible across at least 10 instance types per workload, and keep Spot away from
            work that is tightly coupled between nodes. The file records interruptions of running instances; how often
            a Spot request for a GPU type is filled at all is not in it.{' '}
            <Cite id="F09-95">EC2 User Guide, Spot best practices</Cite>{' '}
            <Cite id="F09-96">Spot Instance Advisor data file</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can wire the pieces into one pipeline that starts when an episode lands in S3 and ends with a policy on the arm, and you know your first step."
          >
            Glue and the edge
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>AWS Step Functions</strong> is the AWS-native workflow layer. One task state submits a Batch job
            and waits for it to finish, so a pipeline of curate, train, evaluate is a few states. Its Distributed Map
            state runs each item of a list as a child workflow, and with no concurrency set it runs 10,000 of them in
            parallel, the same number as the ceiling of a Batch array job. Use the array when every child is the same
            container on the same queue and the map when children branch, and always set the map&apos;s concurrency:
            that guidance is our reading. S3 can send every object event in a bucket to Amazon EventBridge, which is the trigger for
            &quot;a new episode landed, start the pipeline&quot;.{' '}
            <Cite id="F09-100">Step Functions Developer Guide, AWS Batch integration</Cite>{' '}
            <Cite id="F09-101">Step Functions Developer Guide, Distributed Map</Cite>{' '}
            <Cite id="F09-102">S3 User Guide, Amazon EventBridge</Cite>
          </Box>
          <Box variant="p">
            Two announcements of 18 November 2026 add GPU routes outside the three orchestrators. AWS Lambda now
            supports GPU-accelerated Event Functions on Lambda Managed Instances using EC2 G-series instances; its
            limits were not read for this dive. AWS Deadline Cloud, the managed render farm, now supports EC2 G7 instances in
            service-managed fleets, from g7.2xlarge to g7.48xlarge, On-Demand or Spot, a managed home for the
            family EKS Auto Mode does not offer.{' '}
            <Cite id="F09-118">AWS What&apos;s New, 18 November 2026, Lambda GPU functions</Cite>{' '}
            <Cite id="F09-117">AWS What&apos;s New, 18 November 2026, Deadline Cloud G7</Cite>
          </Box>
          <Box variant="p">
            <strong>The edge</strong> is shape E, and section 18, The Fleet, owns it: the Greengrass component that runs
            the policy container, the deployment document and the staged rollout are printed there. The piece that
            belongs to this section is the return path, the component that sends episodes back into the pipeline above.
          </Box>
          <Snippet
            title="A Greengrass component recipe that calls an AWS service with the device's temporary credentials"
            mode="adapted"
            source={<Cite id="F09-133">Greengrass developer guide, Interact with AWS services</Cite>}
          >
            {GREENGRASS_AWS_RECIPE}
          </Snippet>
          <Box variant="p">
            One change from the page: its second manifest, for Windows, is left out. The line that matters is the
            dependency on <code>aws.greengrass.TokenExchangeService</code>. It gives the component an environment
            variable that an AWS SDK client reads to fetch credentials, so no access key is stored on the robot; the
            credentials expire after an hour by default. The documented example lists S3 buckets. An uploader replaces
            the script and needs S3 write permission on the device role, as section 18 describes.{' '}
            <Cite id="F09-133">Greengrass developer guide, Interact with AWS services</Cite>
          </Box>
          <Box variant="p">
            The Kubernetes alternative is EKS Hybrid Nodes, which attaches a machine outside AWS to an EKS cluster as a
            node. Section 18 lists its requirements; three limits decide the choice. It is documented as unfit for
            machines whose link drops. The network guidance is at least 100 Mbps and at most 200 ms round trip. Jetson
            Linux is absent from the table of validated operating systems. Since 18 November 2026 the billed vCPUs are capped at 32 per node.
            Our reading: a Jetson beside a robot is a Greengrass core device, and a desk machine such as a DGX Spark is
            a hybrid node only when the lab already runs its training and evaluation on EKS.{' '}
            <Cite id="F09-119">EKS User Guide, Hybrid Nodes overview</Cite>{' '}
            <Cite id="F09-120">EKS User Guide, Hybrid Nodes prerequisites</Cite>{' '}
            <Cite id="F09-52">EKS User Guide, Hybrid Nodes operating systems</Cite>{' '}
            <Cite id="F09-116">AWS What&apos;s New, 18 November 2026, Hybrid Nodes billing cap</Cite>{' '}
            <Cite id="F09-127">our reading of the Hybrid Nodes and Greengrass pages</Cite>
          </Box>
          <Placeholder
            what={
              <>
                the measured hook-up of the owner&apos;s Jetson and DGX Spark to AWS IoT: the deployment of a policy
                component to each device and the upload of one recorded episode to S3, timed end to end.
              </>
            }
            source={<>the owner&apos;s own hook-up of the two machines, which has not been done yet.</>}
          />
          <Box variant="p">
            <strong>What to do next.</strong> Name the shape of your next job from section 20. If it is shape A, adapt
            the three Batch snippets above: put your image in the job definition, list at least two G families in the
            compute environment, keep <code>minvCpus</code> at 0, and submit one array of 2 to 10,000 children. If it is
            a one-GPU fine-tune, submit it as a single job to the same queue. Reach for HyperPod or a queueing layer on
            EKS when you can name the second team that will share the machines. Then take the family, the orchestrator
            and the market to section 25, Choosing. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
