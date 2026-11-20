import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite } from '../components/Cite';
import { Figure } from '../components/Figure';
import { LoopOnAws } from '../components/LoopOnAws';
import { Placeholder, Snippet } from '../components/Blocks';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const CPU_FILL = '#e8f1fb';
const CPU_INK = '#1f5fa8';
const MEM_FILL = '#efe9fb';
const MEM_INK = '#5b3fa8';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };
const STAGE_TD: CSSProperties = { padding: '8px 10px 4px', borderBottom: '1px solid #5f6b7a', background: '#f4f5f7', fontWeight: 700 };

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `The running example is the evaluation of one policy for the ${ARM} arm that must ${TASK_STORY}: 500 simulated episodes, each with its own random seed.`;

/* ------------------------------------------------------------------------ */
/* Configuration text, adapted from a pinned first-party page; the Snippet    */
/* under which it is printed says how.                                        */
/* ------------------------------------------------------------------------ */

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

const ORCH_TAGS = { batch: '#1f5fa8', pcs: '#a85a0a', hyperpod: '#1e7b3a', eks: '#5b3fa8' };

function LayerBand({ y, fill, ink, title, rows }: { y: number; fill: string; ink: string; title: string; rows: LayerRow[] }) {
  return (
    <g>
      <rect x={10} y={y} width={380} height={136} rx={6} fill={fill} stroke={ink} strokeWidth={1.2} />
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
        viewBox="0 0 400 592"
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
          A stack of four bands. On top an optional workflow layer. Then the queue layer and the node provider layer, each
          listing what fills it for AWS Batch, AWS PCS, SageMaker HyperPod and Amazon EKS. At the bottom the capacity
          market layer with five ways of buying a machine.
        </desc>
        <rect x={0} y={0} width={400} height={592} fill="#fbfbfd" />

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
            { tag: 'AWS PCS', tagFill: ORCH_TAGS.pcs, text: 'a queue (a Slurm partition)' },
            { tag: 'HyperPod', tagFill: ORCH_TAGS.hyperpod, text: 'Slurm, or Kueue on Kubernetes' },
            { tag: 'Amazon EKS', tagFill: ORCH_TAGS.eks, text: 'Kueue or KAI Scheduler, added by you' },
          ]}
        />
        <DownArrow y={220} />
        <LayerBand
          y={242}
          fill={MEM_FILL}
          ink={MEM_INK}
          title="2. A node provider starts the machines"
          rows={[
            { tag: 'AWS Batch', tagFill: ORCH_TAGS.batch, text: 'a compute environment' },
            { tag: 'AWS PCS', tagFill: ORCH_TAGS.pcs, text: 'a compute node group' },
            { tag: 'HyperPod', tagFill: ORCH_TAGS.hyperpod, text: 'an instance group' },
            { tag: 'Amazon EKS', tagFill: ORCH_TAGS.eks, text: 'a Karpenter or Auto Mode node pool' },
          ]}
        />
        <DownArrow y={380} />

        <rect x={10} y={402} width={380} height={180} rx={6} fill={STORE_FILL} stroke={STORE_INK} strokeWidth={1.2} />
        <text x={22} y={426} fontSize={13} fontWeight={700} fill={STORE_INK}>
          3. A capacity market supplies them
        </text>
        {[
          { x: 22, y: 440, w: 174, label: 'On-Demand' },
          { x: 204, y: 440, w: 174, label: 'Spot' },
          { x: 22, y: 476, w: 356, label: 'On-Demand Capacity Reservation (ODCR)' },
          { x: 22, y: 512, w: 174, label: 'Capacity Block for ML' },
          { x: 204, y: 512, w: 174, label: 'SageMaker training plan' },
        ].map((c) => (
          <g key={c.label}>
            <rect x={c.x} y={c.y} width={c.w} height={28} rx={4} fill="#ffffff" stroke={STORE_INK} />
            <text x={c.x + c.w / 2} y={c.y + 18} fontSize={12} textAnchor="middle" fill={INK}>
              {c.label}
            </text>
          </g>
        ))}
        <text x={22} y={566} fontSize={12} fill={INK}>
          Savings Plans: a discount on the bill
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The fifteen workloads, in loop order (names as in section 20)              */
/* ------------------------------------------------------------------------ */

interface Placed {
  name: string;
  does: string;
  shape: string;
  runs: string;
  next: string;
  cites: ReactNode;
}

interface StageRows {
  stage: string;
  rows: Placed[];
}

const EDGE_SHAPE = 'On the device, at the edge';

const PLACED: StageRows[] = [
  {
    stage: 'Collect',
    rows: [
      {
        name: 'Record and encode',
        does: 'Records the cameras and joint angles while a person guides the arm, and compresses the video.',
        shape: EDGE_SHAPE,
        runs: 'No scheduler: the computer beside the robot. The upload to Amazon S3 is the event that starts the cloud side.',
        next: 'Section 9, Collecting Data',
        cites: (
          <>
            <Cite id="F08-76">our workload table</Cite> <Cite id="F09-102">S3 User Guide, Using EventBridge</Cite>
          </>
        ),
      },
    ],
  },
  {
    stage: 'Curate',
    rows: [
      {
        name: 'Decode and filter',
        does: 'Turns the video back into frames and drops the bad episodes.',
        shape: 'Many small independent jobs, one per shard of episodes',
        runs: 'An AWS Batch array job on Spot',
        next: 'Section 25, AWS Batch',
        cites: (
          <>
            <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </>
        ),
      },
      {
        name: 'Embed and deduplicate',
        does: 'Runs a vision model over the clips and drops the near-duplicates.',
        shape: 'Many small independent jobs, one whole GPU each',
        runs: 'An AWS Batch array job on Spot',
        next: 'Section 25, AWS Batch',
        cites: (
          <>
            <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>{' '}
            <Cite id="F10-44">AWS Batch User Guide, GPU resource requirements</Cite>
          </>
        ),
      },
    ],
  },
  {
    stage: 'Simulate',
    rows: [
      {
        name: 'CPU physics step',
        does: 'Steps one simulated arm per CPU core to produce rollouts.',
        shape: 'Many small independent jobs, CPU only',
        runs: 'A Batch array job on Spot, or a Slurm job array on AWS PCS',
        next: 'Sections 25 and 26',
        cites: (
          <>
            <Cite id="F10-5">AWS Batch API Reference, instance types</Cite>{' '}
            <Cite id="F10-228">AWS PCS User Guide, submitting jobs</Cite>
          </>
        ),
      },
      {
        name: 'GPU-parallel physics',
        does: 'Steps thousands of copies of the arm together on one GPU.',
        shape: 'One GPU for minutes to hours, restartable from a checkpoint',
        runs: 'A Batch job on G-family Spot',
        next: 'Section 25, AWS Batch',
        cites: (
          <>
            <Cite id="F09-78">AWS Guidance for Physical AI for Robotics</Cite>{' '}
            <Cite id="F10-68">AWS HPC Blog, Isaac Lab on AWS Batch</Cite>
          </>
        ),
      },
      {
        name: 'Simulated cameras',
        does: 'Renders what each simulated camera sees at every step.',
        shape: 'One GPU with ray-tracing cores, restartable',
        runs: 'Batch or Amazon EKS on G-family Spot, with a short list of instance types',
        next: 'Sections 25 and 28',
        cites: (
          <>
            <Cite id="F09-78">AWS Guidance for Physical AI for Robotics</Cite>{' '}
            <Cite id="F10-534">EKS Best Practices Guide, Spot for GPUs</Cite>
          </>
        ),
      },
      {
        name: 'Generative augmentation',
        does: 'A world model re-renders recorded clips or invents new ones.',
        shape: 'Many restartable GPU jobs that need a large GPU memory',
        runs: 'Batch on Spot; HyperPod when the generator shares a GPU pool with training',
        next: 'Sections 25 and 27',
        cites: (
          <>
            <Cite id="F10-69">AWS HPC Blog, Cosmos world models on AWS Batch</Cite>{' '}
            <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>
          </>
        ),
      },
    ],
  },
  {
    stage: 'Train',
    rows: [
      {
        name: 'Dataloader decode and augment',
        does: 'Decodes a few frames and transforms the images for every training sample.',
        shape: 'Part of the training job: it runs on the CPU cores of the training machine',
        runs: 'No scheduler decision. The lever is the instance size: CPU cores per GPU.',
        next: 'The section of the training job it rides in',
        cites: <Cite id="F08-76">our workload table</Cite>,
      },
      {
        name: 'Policy fine-tune',
        does: "Fits a policy to the arm's own episodes.",
        shape: 'One GPU for hours',
        runs: 'One Batch job, or a SageMaker Training Job',
        next: 'Section 25, AWS Batch',
        cites: (
          <>
            <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite>{' '}
            <Cite id="F09-73">AWS Physical AI Toolchain sample, GR00T and Isaac Lab guides</Cite>
          </>
        ),
      },
      {
        name: 'World-model training',
        does: 'Teaches a small model to predict what the cameras will see next.',
        shape: 'One GPU for hours',
        runs: 'The same as the fine-tune',
        next: 'Section 25, AWS Batch',
        cites: <Cite id="F08-76">our workload table</Cite>,
      },
      {
        name: 'Robot foundation-model pretraining',
        does: 'Trains the base model that every fine-tune starts from.',
        shape: 'Many nodes for days, as one job',
        runs: 'SageMaker HyperPod or AWS PCS, on reserved capacity',
        next: 'Sections 27 and 26',
        cites: (
          <>
            <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
            <Cite id="F10-234">AWS PCS User Guide, Capacity Blocks</Cite>
          </>
        ),
      },
      {
        name: 'World-model pretraining',
        does: 'Trains the base world model that the two world-model rows start from.',
        shape: 'Many nodes for days, as one job',
        runs: 'SageMaker HyperPod or AWS PCS, on reserved capacity',
        next: 'Sections 27 and 26',
        cites: (
          <>
            <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>{' '}
            <Cite id="F09-109">AWS What&apos;s New, 18 June 2026, PCS and UltraServers</Cite>
          </>
        ),
      },
    ],
  },
  {
    stage: 'Evaluate',
    rows: [
      {
        name: 'Closed-loop evaluation',
        does: 'Lets each checkpoint attempt the task many times in simulation and counts the successes.',
        shape: 'Many small independent jobs, one per seed',
        runs: 'An AWS Batch array job on Spot',
        next: 'Section 25, AWS Batch',
        cites: <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>,
      },
    ],
  },
  {
    stage: 'Deploy',
    rows: [
      {
        name: 'Engine build',
        does: 'Compiles the chosen policy for the chip on the robot.',
        shape: `${EDGE_SHAPE}, for minutes`,
        runs: 'No scheduler: the build runs on the target device. Only the export before it is a small cloud job.',
        next: 'Section 17, Running on the Robot',
        cites: <Cite id="F08-76">our workload table</Cite>,
      },
      {
        name: 'On-robot inference',
        does: "Runs the policy inside the arm's control loop.",
        shape: EDGE_SHAPE,
        runs: 'No scheduler: AWS IoT Greengrass delivers the policy and the arm runs it.',
        next: 'Sections 17 and 18',
        cites: <Cite id="F07-84">AWS IoT Greengrass v2 documentation</Cite>,
      },
    ],
  },
];

/* ------------------------------------------------------------------------ */
/* The four orchestrators on the same rows                                    */
/* ------------------------------------------------------------------------ */

interface CompareRow {
  row: string;
  batch: string;
  pcs: string;
  hyperpod: string;
  eks: string;
  cites: ReactNode;
}

const COMPARE: CompareRow[] = [
  {
    row: 'What you submit',
    batch: 'A container job, to a job queue',
    pcs: 'A script, with sbatch, from a login node',
    hyperpod: 'An sbatch script, or a Kubernetes job',
    eks: 'A Kubernetes Job, labelled with its queue',
    cites: (
      <>
        <Cite id="F09-130">AWS Batch API Reference, SubmitJob</Cite> <Cite id="F10-228">AWS PCS User Guide, submitting jobs</Cite>{' '}
        <Cite id="F10-300">SageMaker Developer Guide, HyperPod orchestrators</Cite>{' '}
        <Cite id="F10-451">Kueue v0.20.7 documentation, admission</Cite>
      </>
    ),
  },
  {
    row: 'Where work waits',
    batch: 'A job queue: first in, first out, or fair share',
    pcs: 'A queue, which is a Slurm partition',
    hyperpod: 'A Slurm partition, or a per-team Kueue queue',
    eks: 'Nowhere, until you install Kueue or KAI Scheduler',
    cites: (
      <>
        <Cite id="F09-14">AWS Batch User Guide, job scheduling</Cite> <Cite id="F10-215">AWS PCS User Guide, queues</Cite>{' '}
        <Cite id="F10-320">SageMaker Developer Guide, task governance</Cite>{' '}
        <Cite id="F10-450">Kueue v0.20.7 documentation, concepts</Cite>
      </>
    ),
  },
  {
    row: 'Who starts instances',
    batch: 'Batch, from the demand in the queue',
    pcs: 'PCS, for the nodes Slurm has allocated to waiting jobs',
    hyperpod: 'You set a count; on EKS, managed Karpenter can add nodes for pending pods',
    eks: 'Karpenter or EKS Auto Mode, for pods that fit no node',
    cites: (
      <>
        <Cite id="F10-37">AWS Batch User Guide, scaling</Cite> <Cite id="F10-217">AWS PCS User Guide, job-level scaling</Cite>{' '}
        <Cite id="F10-313">SageMaker Developer Guide, scaling a Slurm cluster</Cite>{' '}
        <Cite id="F10-312">SageMaker Developer Guide, Karpenter on HyperPod</Cite>{' '}
        <Cite id="F10-401">Karpenter v1.15.3 documentation, NodePools</Cite>
      </>
    ),
  },
  {
    row: 'Scale to zero',
    batch: 'Yes: with a floor of 0 vCPUs, an empty queue holds no instance',
    pcs: 'Yes, per node group. The controller stays, with its own hourly fee.',
    hyperpod: 'Only on EKS with managed Karpenter. Under Slurm the pool is fixed.',
    eks: 'Yes for the nodes. The control plane stays.',
    cites: (
      <>
        <Cite id="F10-38">AWS Batch User Guide, minvCpus</Cite> <Cite id="F10-208">AWS PCS User Guide, scaling configuration</Cite>{' '}
        <Cite id="F10-240">AWS PCS pricing page, dimensions</Cite>{' '}
        <Cite id="F10-312">SageMaker Developer Guide, Karpenter on HyperPod</Cite>{' '}
        <Cite id="F10-313">SageMaker Developer Guide, scaling a Slurm cluster</Cite>{' '}
        <Cite id="F09-48">EKS User Guide, Auto Mode</Cite>
      </>
    ),
  },
  {
    row: 'Spot',
    batch: 'Yes, with a retry rule for reclaimed hosts',
    pcs: 'Yes, one market per node group. No page read describes an interruption step by step.',
    hyperpod: 'Documented for EKS-orchestrated clusters only',
    eks: 'Yes, as a capacity type on the node pool',
    cites: (
      <>
        <Cite id="F09-10">AWS Batch User Guide, Spot best practices</Cite>{' '}
        <Cite id="F10-207">AWS PCS User Guide, purchase options</Cite> <Cite id="F10-222">AWS PCS User Guide, losing a node</Cite>{' '}
        <Cite id="F10-309">SageMaker Developer Guide, Spot on HyperPod</Cite>{' '}
        <Cite id="F10-402">Karpenter v1.15.3 documentation, capacity types</Cite>
      </>
    ),
  },
  {
    row: 'Multi-node training',
    batch: 'On-Demand only, one instance type; a lost worker node is not replaced',
    pcs: 'Yes: a job starts only when all of its nodes are up',
    hyperpod: 'Its purpose: a faulty node is replaced and the job resumes',
    eks: 'Yes, with JobSet, which restarts all workers as one unit',
    cites: (
      <>
        <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite> <Cite id="F10-49">AWS Batch API Reference, node properties</Cite>{' '}
        <Cite id="F10-50">AWS Batch User Guide, job lifecycle for multi-node jobs</Cite>{' '}
        <Cite id="F10-217">AWS PCS User Guide, job-level scaling</Cite>{' '}
        <Cite id="F10-314">SageMaker Developer Guide, node recovery</Cite>{' '}
        <Cite id="F10-456">JobSet v0.13.1 documentation</Cite>
      </>
    ),
  },
  {
    row: 'What you operate yourself',
    batch: 'The container image, and machine image updates',
    pcs: 'The machine image, launch templates, storage mounts',
    hyperpod: 'Instance counts; under Slurm, a controller instance you size',
    eks: 'The queueing layer, and the node software unless Auto Mode runs it',
    cites: (
      <>
        <Cite id="F10-14">AWS Batch User Guide, image updates</Cite> <Cite id="F10-245">our reading of the AWS PCS User Guide</Cite>{' '}
        <Cite id="F10-300">SageMaker Developer Guide, HyperPod orchestrators</Cite>{' '}
        <Cite id="F10-430">EKS User Guide, what Auto Mode manages</Cite>
      </>
    ),
  },
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
            description="See each of the loop's fifteen workloads placed on an AWS scheduler and a capacity market, so you know which of the next four sections is yours (AWS documentation and first-party posts, read 2026-11-20)."
          >
            24. Orchestrating Physical AI on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section is the map from the robot&apos;s loop to AWS. It builds on section 20, Fifteen Workloads, Five
            Shapes, which named the jobs the loop is made of and sorted them by how long they run, how tightly their
            parts depend on each other and whether they survive an interruption. Here each of those jobs gets a place
            to run.
          </Box>
          <Box variant="p">
            A place has two parts. An <em>orchestrator</em> is the service that holds the waiting jobs, starts machines
            for them and removes the machines afterwards. AWS has four that schedule GPU work, and each has its own
            section after this one. A <em>capacity market</em> is the way the machine is bought, and it decides whether
            the machine can be taken back in the middle of a job. {TASK_SENTENCE}
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one episode from the bench to the cloud and back, and see which service carries each stage, before any service is taken apart."
          >
            The loop on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm&apos;s loop has six stages, and each hands something to the next: recorded episodes, a clean
            dataset, synthetic episodes, a checkpoint (the saved weights of a policy), a success rate, and a policy
            running on the arm. The figure walks them in order. Read the &quot;Runs on&quot; row of each card: it is
            where this dive places the stage.
          </Box>
          <LoopOnAws
            emphasis="service"
            cites="F08-76 F09-5 F09-73 F09-78 F09-81 F09-84 F09-100 F09-102 F09-110 F09-112 F07-84 F10-69"
            caption="Press Play or Step. Each card is one stage of the loop: what happens to the arm's data, the part of the machine the stage loads (section 20), the AWS service it runs on, and what it hands on. The placements are this dive's reading of AWS's reference architectures and documentation. Illustrative, not measured."
          />
          <Box variant="p">
            Collecting happens on the computer beside the robot, and the cloud&apos;s part starts when an episode file
            lands in Amazon S3. Curating and evaluating are the same kind of job: many small pieces that do not depend
            on each other, so a machine lost in the middle costs one piece. AWS Batch has a primitive for that, the{' '}
            <em>array job</em>: one submission that spawns 2 to 10,000 child jobs, each of which reads its own index
            and uses it to pick a shard or a seed. The 500 evaluation episodes are one array of 500 children.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Box variant="p">
            AWS&apos;s reference architecture for robotics puts the simulation workloads on AWS Batch across GPU
            instances that scale with demand, trains on Amazon SageMaker, and deploys to the robot with AWS IoT
            Greengrass, which also sends sensor data back. The AWS and NVIDIA architecture for the Cosmos 3 world model
            assigns a service per stage in the same way: curation on Batch, post-training on SageMaker HyperPod,
            serving on Amazon EKS.{' '}
            <Cite id="F09-78">AWS Guidance for Physical AI for Robotics</Cite>{' '}
            <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>
          </Box>
          <Box variant="p">
            Training splits by size. A fine-tune on one GPU needs no cluster. A run across many nodes for days needs a
            cluster that stays up and repairs itself. AWS&apos;s newest post on training robot policies, which uses
            the {ARM}, gives the rule in one sentence: Training Jobs for a fully managed service, HyperPod for a team
            that already runs Kubernetes or Slurm (the job scheduler of classic supercomputing, taken apart in section 26) and wants a persistent cluster. A <em>SageMaker Training Job</em> is
            the one name in that rule that is not an orchestrator: it runs one training container, bills for the
            duration of the job and shuts the instances down. Deployment is a delivery: Greengrass is software on the
            robot&apos;s computer that receives components from the cloud, and the arm runs the policy itself. <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite>{' '}
            <Cite id="F07-84">AWS IoT Greengrass v2 documentation</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find your job in the table and leave with its shape, its scheduler and the section that takes that scheduler apart."
          >
            The fifteen workloads placed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The table lists the fifteen workloads of section 20 in loop order. Each row says what the workload does for
            the robot, the shape of the job in plain words, and where it runs. The placement is our reading of the
            sources in each row: no AWS page that compares Batch, HyperPod and EKS side by side for training or
            simulation was located in this research.{' '}
            <Cite id="F09-110">searches of AWS documentation run on 2026-11-20</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={TH}>Workload</th>
                  <th style={TH}>What it does in the loop</th>
                  <th style={TH}>Job shape</th>
                  <th style={TH}>Runs on</th>
                  <th style={TH}>Read next</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              {PLACED.map((group) => (
                <tbody key={group.stage}>
                  <tr>
                    <th colSpan={6} scope="rowgroup" style={{ ...STAGE_TD, textAlign: 'left' }}>
                      {group.stage}
                    </th>
                  </tr>
                  {group.rows.map((r) => (
                    <tr key={r.name}>
                      <td style={TD}>
                        <strong>{r.name}</strong>
                      </td>
                      <td style={TD}>{r.does}</td>
                      <td style={TD}>{r.shape}</td>
                      <td style={TD}>{r.runs}</td>
                      <td style={TD}>{r.next}</td>
                      <td style={TD}>{r.cites}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <Box variant="p">
            Most rows land on AWS Batch, because most of the loop is either many small independent jobs or one GPU for
            hours. The two pretraining rows are the only ones that need many nodes as one job, and they belong to labs
            that build base models. Three rows never reach a cloud scheduler: they run at the edge. None of the fifteen
            is a service that stays up. That shape appears when a team serves a model, as the Cosmos architecture does
            on EKS, or when several teams share one standing pool of GPUs.{' '}
            <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Say in two sentences what each service is and name the situation that calls for it, so the next four sections read as one family."
          >
            Four orchestrators on three layers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every way of running a job on rented GPUs answers three questions, and each question has its own layer. A{' '}
            <em>queue</em> holds the waiting jobs and decides which runs next. A <em>node provider</em> starts a
            machine when a job is waiting and removes it when nothing is. A <em>capacity market</em> is how the machine
            is bought. The four services differ in how many layers they own and in what they call them.
          </Box>
          <Figure
            cites="F10-21 F10-215 F10-206 F10-300 F10-320 F10-401 F10-450"
            caption="Read from the top down. A job enters a queue, the queue asks a node provider for a machine, and the node provider draws the machine from a capacity market. Each band lists what fills that layer for the four AWS orchestrators. The decomposition is our reading of the documentation. Illustrative, not measured."
          >
            <ThreeLayersDiagram />
          </Figure>
          <Box variant="p">
            <strong>AWS Batch</strong> is a managed job queue for containers. You describe a job once and submit it;
            Batch starts EC2 (Elastic Compute Cloud) instances for it, runs it, retries it and removes the instances
            when the queue is empty. Reach for it when you have independent runs and no cluster: 500 evaluation seeds,
            a night of synthetic data, a fine-tune a few times a week. Look elsewhere when teams must take GPUs back
            from each other, because Batch does not preempt a running container job, or when one job spans many nodes
            on Spot. Section 25, AWS Batch, takes it apart.{' '}
            <Cite id="F10-38">AWS Batch User Guide, minvCpus</Cite>{' '}
            <Cite id="F10-34">AWS Batch User Guide, quota management and preemption</Cite>{' '}
            <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Box variant="p">
            <strong>AWS Parallel Computing Service (PCS)</strong> is managed Slurm. Slurm is
            driven by commands such as <code>sbatch</code>; AWS runs its controller, and your
            compute node groups launch EC2 instances for waiting jobs and scale back to zero. Reach for it when the
            team already thinks in Slurm, or needs multi-node jobs without machines held between them. Look elsewhere
            when the work is container-first, since a PCS job is a process on a machine image, or when you need a
            documented Spot interruption sequence. Section 26, AWS Parallel Computing Service, takes it apart.{' '}
            <Cite id="F10-200">AWS PCS User Guide, what PCS is</Cite>{' '}
            <Cite id="F10-208">AWS PCS User Guide, scaling configuration</Cite>{' '}
            <Cite id="F10-245">our reading of the AWS PCS User Guide</Cite>{' '}
            <Cite id="F10-222">AWS PCS User Guide, losing a node</Cite>
          </Box>
          <Box variant="p">
            <strong>Amazon SageMaker HyperPod</strong> is a persistent cluster of GPU instances that AWS keeps healthy:
            it replaces a faulty node and can resume the job that was on it. You schedule it with Slurm or with
            Kubernetes. Reach for it when training runs across many nodes for days, the regime an AWS post describes
            as &quot;the tens-of-nodes tail where failures are statistically frequent&quot;, or when several teams
            share a held pool under quotas. Look elsewhere for a single one-GPU fine-tune or a G-family simulation
            fleet: by our reading its distinguishing features are built for multi-GPU P-family nodes, and a held
            cluster bills per provisioned instance whether or not jobs run. Section 27, Amazon SageMaker HyperPod,
            takes it apart. <Cite id="F10-300">SageMaker Developer Guide, HyperPod orchestrators</Cite>{' '}
            <Cite id="F10-314">SageMaker Developer Guide, node recovery</Cite>{' '}
            <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
            <Cite id="F10-334">our reading of the HyperPod documentation</Cite>
          </Box>
          <Box variant="p">
            <strong>Amazon EKS (Elastic Kubernetes Service)</strong> is managed Kubernetes: AWS runs the control plane
            and you assemble the rest. Karpenter, the open-source node provisioner, or EKS Auto Mode, its managed
            form, starts nodes for pods that fit nowhere. Kueue, an add-on that holds jobs against per-team quotas,
            decides whose job goes first, and nothing queues jobs until you install it or a scheduler like it. Reach
            for EKS when the team already lives in Kubernetes, or when services and batch jobs must share one pool.
            Look elsewhere when you want the queue and the scaling as one service with nothing to assemble. Section
            28, Amazon EKS, takes it apart. <Cite id="F10-401">Karpenter v1.15.3 documentation, NodePools</Cite>{' '}
            <Cite id="F10-430">EKS User Guide, what Auto Mode manages</Cite>{' '}
            <Cite id="F10-450">Kueue v0.20.7 documentation, concepts</Cite>
          </Box>
          <Box variant="p">The table puts the four on the same rows. Each of the next four sections expands one column.</Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 980 }}>
              <thead>
                <tr>
                  <th style={TH}> </th>
                  <th style={TH}>AWS Batch</th>
                  <th style={TH}>AWS PCS</th>
                  <th style={TH}>SageMaker HyperPod</th>
                  <th style={TH}>Amazon EKS</th>
                  <th style={TH}>Sources</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((c) => (
                  <tr key={c.row}>
                    <th scope="row" style={{ ...TD, textAlign: 'left' }}>
                      {c.row}
                    </th>
                    <td style={TD}>{c.batch}</td>
                    <td style={TD}>{c.pcs}</td>
                    <td style={TD}>{c.hyperpod}</td>
                    <td style={TD}>{c.eks}</td>
                    <td style={TD}>{c.cites}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Multi-node training on any of the four adds the same two things: a placement group that keeps the nodes
            close together, and EFA (Elastic Fabric Adapter), the EC2 network device that lets the nodes of one job
            exchange data without going through the operating system&apos;s network stack. The{' '}
            <Link href="../efa/">EFA dive</Link> covers that network.{' '}
            <Cite id="F10-233">AWS PCS User Guide, EFA and placement groups</Cite>{' '}
            <Cite id="F10-426">Karpenter v1.15.3 documentation, EC2NodeClass</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know, for the instance family your job needs, which ways of buying it exist, and what a two-minute Spot notice asks of your job."
          >
            The capacity markets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The GPU family decides the market before the orchestrator does. Training wants the P family, whose GPUs
            are sized for training throughput. A simulator that renders cameras needs the G family, whose GPUs carry
            ray-tracing cores (section 13, Rendering and Ray Tracing). The two are bought differently, even inside one
            cluster.
          </Box>
          <Box variant="p">
            <em>On-Demand</em> is a machine with no commitment and no promise that one is free. An{' '}
            <em>On-Demand Capacity Reservation (ODCR)</em> holds capacity for a named instance type in one
            Availability Zone for any duration, charged at the On-Demand rate whether or not an instance runs in it.
            A <em>Capacity Block for ML</em> reserves GPU instances for a fixed window, booked up to eight weeks ahead
            and paid up front: up to 64 instances per block, for up to six months, ending at 11:30 UTC, and it cannot
            be cancelled, moved or split. A <em>SageMaker training plan</em> is the same kind of reservation made
            through SageMaker, for a HyperPod cluster or a training job. Savings Plans sit beside these as a discount
            on the bill. <Cite id="F09-94">EC2 User Guide, On-Demand Capacity Reservations</Cite>{' '}
            <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>{' '}
            <Cite id="F09-34">SageMaker Developer Guide, training plans</Cite>
          </Box>
          <Box variant="p">
            <em>Spot</em> is spare capacity sold at a discount that EC2 can take back. The taking back is a{' '}
            <em>Spot interruption</em>, and it is announced by a notice issued two minutes before, as an event on
            Amazon EventBridge and as an item in the instance&apos;s metadata. The notice is best effort: an instance
            can be interrupted before the warning is available. A second signal, the{' '}
            <em>rebalance recommendation</em>, flags an instance at elevated risk; it can arrive sooner than the
            two-minute notice or together with it.{' '}
            <Cite id="F10-520">EC2 User Guide, Spot Instance interruption notices</Cite>{' '}
            <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>{' '}
            <Cite id="F10-523">EC2 User Guide, rebalance recommendations</Cite>
          </Box>
          <Box variant="p">AWS&apos;s advice follows from those two minutes, and it is the same under all four orchestrators.</Box>
          <ul style={LIST}>
            <li>
              <strong>Be flexible.</strong> The rule of thumb is &quot;at least 10 instance types for each
              workload&quot;. For GPUs the EKS guide narrows it to G families of generation 4 or higher, across sizes
              and Availability Zones. <Cite id="F10-529">EC2 User Guide, Spot best practices</Cite>{' '}
              <Cite id="F10-534">EKS Best Practices Guide, Spot for GPUs</Cite>
            </li>
            <li>
              <strong>Let the allocation strategy choose.</strong> AWS recommends{' '}
              <code>price-capacity-optimized</code>, which takes instances &quot;from the most-available Spot capacity
              pools that also have the lowest possible price&quot;. Karpenter applies it by itself, and Batch has its
              own names for it. <Cite id="F10-528">EC2 User Guide, Spot allocation strategies</Cite>{' '}
              <Cite id="F10-403">Karpenter v1.15.3 documentation, scheduling</Cite>
            </li>
            <li>
              <strong>Checkpoint on a timer, never only on the notice.</strong> Two first-party figures exist: the
              Batch guide advises parts &quot;of 30 minutes or less&quot; on Spot, and the EKS guide&apos;s fast tier
              saves every 5 to 30 minutes. <Cite id="F10-535">AWS Batch User Guide and EKS Best Practices Guide, checkpointing</Cite>
            </li>
            <li>
              <strong>Keep coupled work off Spot, and read fallbacks with care.</strong> AWS strongly discourages Spot
              for work that is tightly coupled between nodes. The same page discourages failing over to On-Demand to
              handle interruptions, a caveat that sits beside every Spot-then-On-Demand pattern in the next four
              sections. <Cite id="F10-530">EC2 User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Raise the quota first.</strong> The page prints a default Spot quota of 0 for G instances and
              for P instances, so a new account cannot launch one GPU Spot instance until it is raised.{' '}
              <Cite id="F10-533">EC2 User Guide, Spot Instance quotas</Cite>
            </li>
          </ul>
          <Box variant="p">
            <strong>
              The Capacity Blocks list and the SageMaker training plans list, as read on 2026-11-20, name no G-family
              type.
            </strong>{' '}
            Both lists hold P types and Trainium types (Trainium is AWS&apos;s own training chip, sold as the trn
            instance types), and the training plans page says availability &quot;may change over time&quot;. For a
            G-family fleet the reservation the documentation does describe is the ODCR.{' '}
            <Cite id="F09-91">EC2 User Guide, Capacity Blocks, supported instance types</Cite>{' '}
            <Cite id="F09-35">SageMaker Developer Guide, training plans, supported instance types</Cite>{' '}
            <Cite id="F09-40">EKS Best Practices Guide, capacity reservations</Cite>
          </Box>
          <ExpandableSection headerText="Family by family: Spot interruption bands, Capacity Blocks and training plans">
            <SpaceBetween size="m">
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
                are often reclaimed, which is why retries, timer checkpoints and a list of several instance types matter
                most for simulation. The file records interruptions of running instances; how often a Spot request for a
                GPU type is filled at all is not in it. <Cite id="F09-96">Spot Instance Advisor data file</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
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
            <strong>The trigger and the workflow.</strong> S3 can send every object event in a bucket to Amazon
            EventBridge, the AWS event bus, which is the trigger for &quot;a new episode landed, start the
            pipeline&quot;. AWS Step Functions is the AWS-native workflow layer: one task state submits a Batch job and
            waits for it to finish, so a pipeline of curate, train, evaluate is a few states. Its Distributed Map state
            runs each item of a list as a child workflow, and with no concurrency set it runs 10,000 of them in
            parallel, so always set the concurrency. NVIDIA OSMO is the open-source alternative for this layer, a
            workflow orchestrator for physical AI whose backends are Kubernetes clusters.{' '}
            <Cite id="F09-102">S3 User Guide, Amazon EventBridge</Cite>{' '}
            <Cite id="F09-100">Step Functions Developer Guide, AWS Batch integration</Cite>{' '}
            <Cite id="F09-101">Step Functions Developer Guide, Distributed Map</Cite>{' '}
            <Cite id="F09-62">NVIDIA OSMO 6.3.1, README</Cite>
          </Box>
          <Box variant="p">
            <strong>The registry, the storage and the desk.</strong> SageMaker&apos;s managed MLflow is a tracking
            server that registers models, and the same record works from a training job, a HyperPod pod or a Batch
            job, because the client only needs the server&apos;s address. Mountpoint for Amazon S3 presents a bucket as
            a local file system that reads files and creates new ones and cannot modify existing ones. That fits a
            dataset written once; for checkpoints rewritten in place the S3 guide points to FSx for Lustre, a shared
            file system. An interactive simulation workstation has no orchestrator, because a person holds the
            instance, and Amazon DCV is the remote-desktop protocol for it.{' '}
            <Cite id="F09-103">SageMaker Developer Guide, managed MLflow</Cite>{' '}
            <Cite id="F09-106">S3 User Guide, Mountpoint for Amazon S3</Cite>{' '}
            <Cite id="F09-104">Amazon DCV product page</Cite>
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
                the measured hook-up of our Jetson and DGX Spark to AWS IoT: the deployment of a policy
                component to each device and the upload of one recorded episode to S3, timed end to end.
              </>
            }
            source={<>our own hook-up of the two machines, which has not been done yet.</>}
          />
          <Box variant="p">
            <strong>What to do next.</strong> Find your workload&apos;s row in the table of fifteen and name its
            scheduler. For one arm that is almost always AWS Batch: go to section 25, AWS Batch, with the two-minute
            Spot notice in mind. Go to section 26, AWS Parallel Computing Service, if your team already submits with
            Slurm. Reach for section 27, Amazon SageMaker HyperPod, or a queueing layer in section 28, Amazon EKS,
            when you can name the second team that will share the machines. Then take the family, the scheduler and
            the market to section 29, Choosing.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
