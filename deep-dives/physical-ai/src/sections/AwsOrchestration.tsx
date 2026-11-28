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
const TASK_SENTENCE = `The example used throughout is the evaluation of one policy for the ${ARM} arm, whose task is to ${TASK_STORY}. The evaluation runs 500 simulated episodes, each with its own random seed.`;

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
          Three layers that you choose separately: a queue decides which job runs next, a node provisioner starts the
          machines, and a purchase option supplies them
        </title>
        <desc>
          A stack of four bands. The top band is an optional workflow layer. Below it are the queue layer and the node
          provisioner layer, and each of them lists what plays that role in AWS Batch, AWS PCS, SageMaker HyperPod and
          Amazon EKS. The bottom band is the purchase option layer, with five ways of buying a machine and Savings Plans
          as a discount on the bill.
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
          title="1. A queue decides which job runs next"
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
          title="2. A node provisioner starts the machines"
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
          3. A purchase option supplies the machines
        </text>
        {[
          { x: 22, y: 440, w: 174, label: 'On-Demand' },
          { x: 204, y: 440, w: 174, label: 'Spot Instances' },
          { x: 22, y: 476, w: 356, label: 'On-Demand Capacity Reservations (ODCRs)' },
          { x: 22, y: 512, w: 174, label: 'Capacity Blocks for ML' },
          { x: 204, y: 512, w: 174, label: 'SageMaker training plans' },
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
  workloadType: string;
  runs: string;
  next: string;
  cites: ReactNode;
}

interface StageRows {
  stage: string;
  rows: Placed[];
}

const ROBOT_TYPE = 'Real-time on the robot';

const PLACED: StageRows[] = [
  {
    stage: 'Collect',
    rows: [
      {
        name: 'Record and encode',
        does: 'Records the cameras and the joint angles while a person guides the arm, and compresses the video.',
        workloadType: ROBOT_TYPE,
        runs: 'No cloud scheduler: it runs on the computer next to the robot. The upload of each recording to Amazon S3 is the event that starts the cloud part of the loop.',
        next: 'Section 9, Collecting Data',
        cites: (
          <>
            <Cite id="F08-76">workload table, section 20</Cite> <Cite id="F09-102">S3 User Guide, Using EventBridge</Cite>
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
        workloadType: 'Independent tasks, one per shard of episodes',
        runs: 'An AWS Batch array job on Spot Instances',
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
        workloadType: 'Independent tasks, each on one whole GPU',
        runs: 'An AWS Batch array job on Spot Instances',
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
        does: 'Steps one simulated arm per CPU core to produce simulated episodes.',
        workloadType: 'Independent tasks on CPU cores only',
        runs: 'An AWS Batch array job on Spot Instances, or a Slurm job array on AWS PCS',
        next: 'Section 25, AWS Batch; section 26, AWS Parallel Computing Service',
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
        workloadType:
          'Independent tasks, or a Long single-machine run when it is part of reinforcement learning. It uses one GPU for minutes to hours and can restart from a checkpoint.',
        runs: 'An AWS Batch job on G-family Spot Instances',
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
        workloadType: 'Independent tasks that can restart, each on one GPU with ray-tracing cores',
        runs: 'AWS Batch or Amazon EKS on G-family Spot Instances, with the instance list narrowed to G families of generation 4 or later',
        next: 'Section 25, AWS Batch; section 28, Amazon EKS',
        cites: (
          <>
            <Cite id="F09-78">AWS Guidance for Physical AI for Robotics</Cite>{' '}
            <Cite id="F10-534">EKS Best Practices Guide, Spot for GPUs</Cite>
          </>
        ),
      },
      {
        name: 'Generative augmentation',
        does: 'A world model re-renders recorded clips or generates new ones.',
        workloadType: 'Independent tasks: many GPU jobs that can restart, and each needs a lot of GPU memory',
        runs: 'AWS Batch on Spot Instances, or SageMaker HyperPod when the generator shares a GPU pool with training',
        next: 'Section 25, AWS Batch; section 27, Amazon SageMaker HyperPod',
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
        workloadType: 'Part of the training job: it runs on the CPU cores of the training machine',
        runs: 'There is no scheduler to choose. You choose the instance size, which sets the number of CPU cores per GPU.',
        next: 'The section that covers its training job',
        cites: <Cite id="F08-76">workload table, section 20</Cite>,
      },
      {
        name: 'Policy fine-tune',
        does: "Fits a policy to the arm's own episodes.",
        workloadType: 'Long single-machine runs: one GPU for hours',
        runs: 'One AWS Batch job, or a SageMaker Training Job',
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
        workloadType: 'Long single-machine runs: one GPU for hours',
        runs: 'The same as the policy fine-tune',
        next: 'Section 25, AWS Batch',
        cites: <Cite id="F08-76">workload table, section 20</Cite>,
      },
      {
        name: 'Robot foundation-model pretraining',
        does: 'Trains the base model that every fine-tune starts from.',
        workloadType: 'Multi-node training: many nodes for days, as one job',
        runs: 'SageMaker HyperPod or AWS PCS, on reserved capacity',
        next: 'Section 27, Amazon SageMaker HyperPod; section 26, AWS Parallel Computing Service',
        cites: (
          <>
            <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
            <Cite id="F10-234">AWS PCS User Guide, Capacity Blocks</Cite>
          </>
        ),
      },
      {
        name: 'World-model pretraining',
        does: 'Trains the base world model that world-model training and generative augmentation start from.',
        workloadType: 'Multi-node training: many nodes for days, as one job',
        runs: 'SageMaker HyperPod or AWS PCS, on reserved capacity',
        next: 'Section 27, Amazon SageMaker HyperPod; section 26, AWS Parallel Computing Service',
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
        workloadType: 'Independent tasks, one per seed',
        runs: 'An AWS Batch array job on Spot Instances',
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
        workloadType: "Independent tasks that run for minutes on the robot's own computer",
        runs: 'No cloud scheduler: the build runs on the target device. Only the export of the model before the build is a small cloud job.',
        next: 'Section 17, Running on the Robot',
        cites: <Cite id="F08-76">workload table, section 20</Cite>,
      },
      {
        name: 'On-robot inference',
        does: "Runs the policy inside the arm's control loop.",
        workloadType: ROBOT_TYPE,
        runs: "No cloud scheduler: AWS IoT Greengrass delivers the policy, and the robot's computer runs it.",
        next: 'Section 17, Running on the Robot; section 18, The Fleet',
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
    batch: 'A container job, sent to a job queue',
    pcs: 'A script, submitted with sbatch from a login node',
    hyperpod: 'An sbatch script, or a Kubernetes job',
    eks: 'A Kubernetes Job, labelled with the name of its queue',
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
    batch: 'A job queue, first in first out or fair share',
    pcs: 'A queue, which is a Slurm partition',
    hyperpod: 'A Slurm partition, or a Kueue queue for each team',
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
    batch: 'Batch, based on the jobs waiting in the queue',
    pcs: 'PCS, for the nodes that Slurm has allocated to waiting jobs',
    hyperpod: 'You set the instance count. On a HyperPod cluster that uses EKS, managed Karpenter can add nodes for pending pods.',
    eks: 'Karpenter or EKS Auto Mode, for pods that fit on no existing node',
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
    batch: 'Yes. With a minimum of 0 vCPUs, no instance keeps running when the queue is empty.',
    pcs: 'Yes, for each node group. The Slurm controller keeps running and has its own hourly fee.',
    hyperpod: 'Only on a cluster that uses EKS, with managed Karpenter. Under Slurm, the number of instances is fixed.',
    eks: 'Yes for the nodes. The control plane keeps running.',
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
    row: 'Spot Instances',
    batch: 'Yes, with a retry rule for jobs whose instance is reclaimed',
    pcs: 'Yes, with one purchase option per node group. As of November 2026, the PCS User Guide does not describe step by step what happens when a Spot Instance is reclaimed.',
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
    batch: 'On-Demand only, with one instance type. A lost worker node is not replaced.',
    pcs: 'Yes. A job starts only when all of its nodes are up.',
    hyperpod: 'This is what it is built for: it replaces a faulty node, and the job resumes.',
    eks: 'Yes, with JobSet, which restarts all workers together as one unit',
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
    batch: 'The container image, and updates to the machine image',
    pcs: 'The machine image, the launch templates and the storage mounts',
    hyperpod: 'The instance counts and, under Slurm, a controller instance whose size you choose',
    eks: 'The queueing layer, and the node software unless Auto Mode runs it',
    cites: (
      <>
        <Cite id="F10-14">AWS Batch User Guide, image updates</Cite> <Cite id="F10-245">AWS PCS User Guide, what you operate</Cite>{' '}
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
            description="Each of the five workload types in the robot's loop has an AWS service that fits it. For each of the fifteen workloads, you can find where it runs, which purchase option it should use and how to set up its queue and machines. You can also find which of the next four sections covers your workload."
          >
            24. Orchestrating Physical AI on AWS: Which Service Runs Each Workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 20, The Fifteen Workloads, sorted the jobs of the robot&apos;s loop into five workload types. It
            used three properties of each job: how long it runs, whether its parts exchange data while they run, and
            whether it can survive an interruption. Here, you match each workload type to an AWS service and a
            purchase option.
          </Box>
          <Box variant="p">
            An <em>orchestrator</em> is the service that holds the waiting jobs, starts machines for them and removes
            the machines when the work is done. AWS has four orchestrators for GPU work: AWS Batch, AWS Parallel
            Computing Service (PCS), Amazon SageMaker HyperPod and Amazon Elastic Kubernetes Service (Amazon EKS). Each
            of them has its own section after this one. The <em>purchase option</em> is the way you buy the machines.
            Some purchase options let AWS reclaim a machine in the middle of a job, and others do not. The options are On-Demand, Spot
            Instances, Savings Plans, Capacity Blocks for ML and On-Demand Capacity Reservations, and each one is
            explained further down.
          </Box>
          <Box variant="p">{TASK_SENTENCE}</Box>
          <Box variant="p">Here is where each workload type runs on AWS, and how to set it up:</Box>
          <ul style={LIST}>
            <li>
              <strong>Independent tasks.</strong> The work splits into many short pieces that do not depend on each
              other, such as decoding each shard of recorded episodes, stepping the CPU physics or running the 500
              evaluation episodes. Run this work as an AWS Batch array job. An array job is one submission that creates
              a child job for each piece. In AWS Batch, you submit jobs to a job queue, and the compute environment
              behind the queue starts the instances. Give the queue a compute environment that runs on Spot Instances,
              allows at least 10 instance types and has a minimum of 0 vCPUs. With that minimum, no instance keeps
              running when the queue is empty. If AWS reclaims an instance, only the pieces running on it are lost, and
              a retry rule on the job runs them again. Slurm is a job scheduler that comes from supercomputing, and AWS
              PCS runs it as a managed service. A team that already uses Slurm can run the same work as a Slurm job
              array on AWS PCS. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>{' '}
              <Cite id="F10-38">AWS Batch User Guide, minvCpus</Cite>{' '}
              <Cite id="F10-529">EC2 User Guide, Spot best practices</Cite>{' '}
              <Cite id="F09-10">AWS Batch User Guide, Spot best practices</Cite>{' '}
              <Cite id="F10-228">AWS PCS User Guide, submitting jobs</Cite>
            </li>
            <li>
              <strong>Long single-machine runs.</strong> Fine-tuning a policy or training a small world model keeps
              one GPU busy for hours. Run each one as a single AWS Batch job or as a SageMaker Training Job. A
              SageMaker Training Job runs one training container, bills for the duration of the job and then shuts its
              instances down. A checkpoint is the saved weights of the model at one point in training, and the job can
              resume from it. If you run these jobs on Spot Instances, write checkpoints on a timer, because the job
              loses all the work done since the last checkpoint when AWS reclaims its instance. The AWS Batch guide
              advises splitting Spot work into parts of 30 minutes or less.{' '}
              <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite>{' '}
              <Cite id="F10-535">AWS Batch User Guide and EKS Best Practices Guide, checkpointing</Cite>
            </li>
            <li>
              <strong>Multi-node training.</strong> Pretraining a robot foundation model or a world model runs across
              many nodes for days as one job. Run it on SageMaker HyperPod. HyperPod is a persistent GPU cluster that
              replaces a failed node and resumes the job. AWS PCS also fits, because it starts a job only when all of
              its nodes are up. On either service, run the job on reserved capacity, such as Capacity Blocks for ML. A
              Capacity Block reserves GPU instances for a fixed period that you book in advance. On AWS PCS, the
              instances come from compute node groups, and each node group has exactly one purchase option and takes
              one Capacity Block. So put the Capacity Block in a compute node group of its own. Spot Instances are not
              an option, because AWS strongly discourages Spot for work that is tightly coupled
              between nodes. AWS Batch can run multi-node jobs, but only on On-Demand instances of one instance type,
              and it does not replace a lost worker node.{' '}
              <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
              <Cite id="F10-314">SageMaker Developer Guide, node recovery</Cite>{' '}
              <Cite id="F10-217">AWS PCS User Guide, job-level scaling</Cite>{' '}
              <Cite id="F10-234">AWS PCS User Guide, Capacity Blocks</Cite>{' '}
              <Cite id="F10-207">AWS PCS User Guide, purchase options</Cite>{' '}
              <Cite id="F10-530">EC2 User Guide, Spot best practices</Cite>{' '}
              <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>
            </li>
            <li>
              <strong>Always-on streams.</strong> This work runs all the time at a steady rate. For one arm, none of
              the fifteen workloads is a service that has to stay up, and video decoding becomes an always-on
              stream only when a fleet sends video all day (section 20, The Fifteen Workloads). A team needs machines that stay up in two cases:
              when it serves a model, as the AWS and NVIDIA architecture for the Cosmos 3 world model does on Amazon
              EKS, and when several teams share one permanent pool of GPUs. Amazon EKS fits when services and batch jobs
              must share the same machines. SageMaker HyperPod fits when several teams share the pool under quotas.{' '}
              <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>{' '}
              <Cite id="F10-320">SageMaker Developer Guide, task governance</Cite>
            </li>
            <li>
              <strong>Real-time on the robot.</strong> Recording the arm and running its policy happen on the computer
              next to the arm, so no cloud orchestrator is involved. New versions of the policy reach that computer
              through AWS IoT Greengrass. Greengrass is software on the device that receives software packages, called
              components, from the cloud. The computer next to the arm then runs the policy itself.{' '}
              <Cite id="F07-84">AWS IoT Greengrass v2 documentation</Cite>
            </li>
          </ul>
          <Box variant="p">For one arm, most of the loop therefore runs on AWS Batch.</Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one episode from the robot to the cloud and back, and see which AWS service runs each stage of the loop."
          >
            Which AWS service runs each stage of the loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The arm&apos;s loop has six stages: collect, curate, simulate, train, evaluate and deploy. Each stage hands
            its result to the next one. Collecting produces recorded episodes, curating produces a clean dataset,
            simulating produces synthetic episodes, training produces a checkpoint, evaluating produces a success rate,
            and deploying puts the policy on the arm. The figure walks through the stages in order, and the &quot;Runs
            on&quot; row of each card names the AWS service for that stage.
          </Box>
          <LoopOnAws
            emphasis="service"
            cites="F08-76 F09-5 F09-73 F09-78 F09-81 F09-84 F09-100 F09-102 F09-110 F09-112 F07-84 F10-69"
            caption="Press Play or Step. Each card is one stage of the loop. It shows what happens to the arm's data, the stage's bottleneck (section 20, The Fifteen Workloads), the AWS service the stage runs on, and what the stage hands to the next one. The service placements are this dive's recommendation, based on AWS's reference architectures and documentation. The figure is an illustration, not a measurement."
          />
          <Box variant="p">
            Collecting happens on the computer next to the robot. The cloud&apos;s work starts when an episode file
            arrives in Amazon S3. Curating and evaluating are both Independent tasks: they split into many small pieces
            that do not depend on each other, so if a machine is lost in the
            middle, only one piece is lost. AWS Batch runs
            this kind of work as an array job. One array job creates between 2 and 10,000 child jobs, and each child
            reads its own index number to pick a shard of data or a random seed. The 500 evaluation episodes become one
            array job with 500 children. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Box variant="p">
            Two published reference architectures also assign one AWS service to each stage. In AWS&apos;s
            Guidance for Physical AI for Robotics, simulation runs on AWS Batch on GPU instances that scale with demand,
            training runs on Amazon SageMaker, and AWS IoT Greengrass deploys the policy to the robot and sends sensor
            data back. In the AWS and NVIDIA architecture for the Cosmos 3 world model, curation runs on AWS Batch,
            post-training runs on SageMaker HyperPod and serving runs on Amazon EKS.{' '}
            <Cite id="F09-78">AWS Guidance for Physical AI for Robotics</Cite>{' '}
            <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>
          </Box>
          <Box variant="p">
            For training, you choose the service by the size of the run. A fine-tune on one GPU does not need a
            cluster. A run across many nodes for days needs a cluster that stays up and repairs itself when a node
            fails. An AWS post on training robot policies with the {ARM} arm gives a simple rule for choosing between
            two SageMaker options. Use SageMaker Training Jobs if you want a fully managed service. Use SageMaker HyperPod if your team
            already runs Kubernetes or Slurm and wants a persistent cluster. Of these two, only HyperPod is one of the
            four orchestrators. <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find your workload in the table to see its workload type, the AWS service it runs on and the section that covers that service."
          >
            Where each of the fifteen workloads runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The table lists the fifteen workloads of section 20, The Fifteen Workloads, in the order of the loop. Each
            row says what the workload does for the robot, its workload type and where it runs. Each placement is
            this dive&apos;s recommendation, based on the sources cited in its row. A search of the AWS
            documentation in November 2026 found no AWS page that compares AWS Batch, SageMaker HyperPod and Amazon EKS
            side by side for training or simulation.{' '}
            <Cite id="F09-110">search of the AWS documentation, and the AWS generative AI decision guide</Cite>
          </Box>
          <Box variant="p">
            Two GPU instance families appear in the rows. The G family has GPUs with ray-tracing cores, which simulated
            cameras need (section 13, Rendering and Ray Tracing). The P family has GPUs sized for training throughput.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={TH}>Workload</th>
                  <th style={TH}>What it does in the loop</th>
                  <th style={TH}>Workload type</th>
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
                      <td style={TD}>{r.workloadType}</td>
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
            Most of the workloads run on AWS Batch, because most of the loop is either Independent tasks or a Long
            single-machine run on one GPU. Only the two pretraining workloads need many nodes as one job, and only labs
            that build base models run them. Three workloads never reach a cloud scheduler, because they run on the
            computer next to the robot. None of the fifteen is a service that has to stay up. You need a service like
            that when a team serves a model, as the Cosmos 3 architecture does on Amazon EKS, or when several teams
            share one permanent pool of GPUs. <Cite id="F09-84">AWS and NVIDIA post on Cosmos 3, reference architecture</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The four orchestrators differ in which of three layers they manage for you: the queue, the machines and the purchase option. For each orchestrator, you learn what it is and when to choose it. Each of the next four sections then covers one of them in detail."
          >
            The four orchestrators and when to use each one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Running a job on rented GPUs involves three layers. The <em>queue</em> holds the waiting jobs and decides
            which one runs next. The <em>node provisioner</em> starts a machine when a job is waiting and removes it
            when no job is waiting. The purchase option is how the machine is bought. The four orchestrators
            differ in which of these layers they manage for you and in what they call each layer.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>AWS Batch</strong> is a managed job queue for containers. You describe a job once and submit it.
              Batch starts EC2 (Amazon Elastic Compute Cloud) instances for the job, runs it, retries it if it fails
              and removes the instances when the queue is empty. Choose it for Independent tasks and Long
              single-machine runs when you have no cluster: 500 evaluation seeds, a night of synthetic data, or a
              fine-tune a few times a week. It is the wrong choice when teams must take GPUs back from each other,
              because Batch does not preempt a running container job. It is also the wrong choice for a job that spans
              many nodes on Spot Instances. Section 25, AWS Batch, covers it in detail.{' '}
              <Cite id="F10-38">AWS Batch User Guide, minvCpus</Cite>{' '}
              <Cite id="F10-34">AWS Batch User Guide, quota management and preemption</Cite>{' '}
              <Cite id="F09-8">AWS Batch User Guide, multi-node parallel jobs</Cite>{' '}
              <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
            </li>
            <li>
              <strong>AWS Parallel Computing Service (PCS)</strong> is managed Slurm. You submit work to Slurm with
              commands such as <code>sbatch</code>. AWS runs the Slurm controller, and your compute node groups launch
              EC2 instances for waiting jobs and scale back to zero when there are none. Choose PCS when your team
              already works with Slurm, or when you need multi-node jobs without keeping machines running between
              them. It is a poor fit for container-first work, because a PCS job is a process on a machine image. It is
              also a poor fit when you need documentation of what happens, step by step, when AWS reclaims a Spot
              Instance. Section 26,
              AWS Parallel Computing Service, covers it in detail.{' '}
              <Cite id="F10-200">AWS PCS User Guide, what PCS is</Cite>{' '}
              <Cite id="F10-208">AWS PCS User Guide, scaling configuration</Cite>{' '}
              <Cite id="F10-245">AWS PCS User Guide, strengths and gaps</Cite>{' '}
              <Cite id="F10-222">AWS PCS User Guide, losing a node</Cite>
            </li>
            <li>
              <strong>Amazon SageMaker HyperPod</strong> is a persistent cluster of GPU instances that AWS keeps
              healthy. When a node fails, HyperPod replaces it and can resume the job that was running on it. You
              schedule work on it with Slurm or with Kubernetes. Choose it for Multi-node training that runs for days.
              An AWS post describes this case as &quot;the tens-of-nodes tail where failures are statistically
              frequent&quot;. Choose it also when several teams share one pool of GPUs under quotas. It is a poor fit
              for a single fine-tune on one GPU or for a simulation fleet on G-family instances. The reason is that,
              as far as the documentation shows, its distinguishing features are built for multi-GPU P-family nodes,
              and a persistent cluster bills for every provisioned instance whether or not jobs are running. Section 27,
              Amazon SageMaker HyperPod, covers it in detail.{' '}
              <Cite id="F10-300">SageMaker Developer Guide, HyperPod orchestrators</Cite>{' '}
              <Cite id="F10-314">SageMaker Developer Guide, node recovery</Cite>{' '}
              <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>{' '}
              <Cite id="F10-334">HyperPod documentation, strengths and gaps</Cite>
            </li>
            <li>
              <strong>Amazon EKS</strong> is managed Kubernetes. AWS runs the Kubernetes control plane, and you add the
              parts that start nodes and queue jobs. Karpenter is an open-source node provisioner: it starts nodes for
              pods that fit on no existing node. EKS Auto Mode is a managed form of
              this scaling, in which AWS also runs the node software. Kueue is an add-on that holds each job until its
              team&apos;s quota has room, and decides whose job goes first. Nothing queues jobs on EKS until you install
              Kueue or another scheduler with queues, such as KAI Scheduler. Choose EKS when your team already works in
              Kubernetes, or when services and batch jobs must share one pool of machines. It is a poor fit when you
              want the queue and the scaling as one service with nothing to assemble. Section 28, Amazon EKS, covers it
              in detail. <Cite id="F10-401">Karpenter v1.15.3 documentation, NodePools</Cite>{' '}
              <Cite id="F10-430">EKS User Guide, what Auto Mode manages</Cite>{' '}
              <Cite id="F10-450">Kueue v0.20.7 documentation, concepts</Cite>
            </li>
          </ul>
          <Figure
            cites="F10-21 F10-215 F10-206 F10-300 F10-320 F10-401 F10-450"
            caption="Read the figure from the top down. A job enters a queue, the queue asks a node provisioner for a machine, and the node provisioner gets the machine through a purchase option. Each band lists what plays that role in each of the four AWS orchestrators. An optional workflow layer on top orders the steps of a pipeline. The split into three layers is this dive's interpretation of the documentation. The figure is an illustration, not a measurement."
          >
            <ThreeLayersDiagram />
          </Figure>
          <Box variant="p">
            The table compares the four orchestrators row by row. Each of the next four sections covers one column in
            detail.
          </Box>
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
            Multi-node training needs two more things on any of the four orchestrators. The first is a placement
            group. A placement group keeps the nodes physically close together. The second is EFA (Elastic Fabric
            Adapter). EFA is the EC2 network device that lets the nodes of one job exchange data without going
            through the operating system&apos;s network stack. With Capacity Blocks for ML, you skip the placement
            group. You cannot launch instances from a Capacity Block into a placement group. Instead, EC2
            places the instances of a block close together automatically. The{' '}
            <Link href="../efa/">EFA dive</Link> covers that network in detail.{' '}
            <Cite id="F10-233">AWS PCS User Guide, EFA and placement groups</Cite>{' '}
            <Cite id="F10-426">Karpenter v1.15.3 documentation, EC2NodeClass</Cite>{' '}
            <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which purchase options you can use depends on the GPU family your job needs. Learn what each option offers and what a job must do to run safely on Spot Instances."
          >
            Choosing the purchase option
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Which purchase options you can use depends first on the GPU family, and only then on the orchestrator.
            Training uses the P family, and a simulator that renders cameras needs the G family. AWS sells the two
            families through different purchase options, so one cluster may buy its training nodes and its simulation
            nodes in different ways.
          </Box>
          <Box variant="p">AWS offers these purchase options for GPU instances:</Box>
          <ul style={LIST}>
            <li>
              <strong>On-Demand.</strong> You buy an instance with no commitment. AWS makes no promise that an instance is
              available when you ask for one.
            </li>
            <li>
              <strong>Spot Instances.</strong> Spot Instances are spare EC2 capacity sold at a discount. EC2 can reclaim
              a Spot Instance in the middle of a job, with the warning described below.
            </li>
            <li>
              <strong>Savings Plans.</strong> Savings Plans are a discount on the bill for the instances you run.
            </li>
            <li>
              <strong>Capacity Blocks for ML.</strong> A Capacity Block reserves GPU instances for a fixed period that
              you book in advance, and you pay the whole fee up front. A Capacity Block cannot be cancelled, moved or
              split. <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>
            </li>
            <li>
              <strong>SageMaker training plans.</strong> A training plan is the same kind of reservation, made through
              SageMaker for a HyperPod cluster or a training job.{' '}
              <Cite id="F09-34">SageMaker Developer Guide, training plans</Cite>
            </li>
            <li>
              <strong>On-Demand Capacity Reservations (ODCRs).</strong> An ODCR holds capacity for one instance type in
              one Availability Zone for as long as you keep it. You pay the On-Demand rate whether or not an instance
              runs in it. <Cite id="F09-94">EC2 User Guide, On-Demand Capacity Reservations</Cite>
            </li>
          </ul>
          <Box variant="p">
            <strong>
              As of November 2026, the lists of instance types for Capacity Blocks for ML and for SageMaker training
              plans include no G-family type.
            </strong>{' '}
            Both lists contain P-family types and Trainium types. Trainium is AWS&apos;s own training chip, sold as the
            trn instance types. The training plans page adds that the availability of instance types &quot;may change
            over time&quot;. So, as of that date, the only reservation that the documentation describes for a G-family
            simulation fleet is an On-Demand Capacity Reservation.{' '}
            <Cite id="F09-91">EC2 User Guide, Capacity Blocks, supported instance types</Cite>{' '}
            <Cite id="F09-35">SageMaker Developer Guide, training plans, supported instance types</Cite>{' '}
            <Cite id="F09-40">EKS Best Practices Guide, capacity reservations</Cite>
          </Box>
          <ExpandableSection headerText="Capacity Blocks for ML: booking window, size limits and end time">
            <Box variant="p">
              You can book a Capacity Block up to eight weeks ahead. One block holds up to 64 instances and lasts up to
              six months. A block ends at 11:30 UTC on its last day, and EC2 starts terminating its instances at 11:00
              UTC that day. <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            A <em>Spot interruption</em> is the event in which EC2 reclaims a Spot Instance. EC2 announces it with a
            notice two minutes before. The notice arrives as an event on Amazon EventBridge and as an item in the
            instance&apos;s metadata. EventBridge is the AWS event bus, which routes events to the targets you
            choose. The notice is best
            effort, so an instance can be interrupted before the warning is available. EC2 also sends a second signal,
            the <em>rebalance recommendation</em>, when an instance is at elevated risk of interruption. The
            rebalance recommendation can arrive before the two-minute notice or together with it.{' '}
            <Cite id="F10-520">EC2 User Guide, Spot Instance interruption notices</Cite>{' '}
            <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>{' '}
            <Cite id="F10-523">EC2 User Guide, rebalance recommendations</Cite>
          </Box>
          <Box variant="p">
            Because the notice gives a job only two minutes, AWS gives the same advice for Spot Instances under all
            four orchestrators:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Use many instance types.</strong> AWS&apos;s rule of thumb is &quot;at least 10 instance types
              for each workload&quot;. For GPUs, the EKS Best Practices Guide narrows this to G families of generation
              4 or later, across sizes and Availability Zones.{' '}
              <Cite id="F10-529">EC2 User Guide, Spot best practices</Cite>{' '}
              <Cite id="F10-534">EKS Best Practices Guide, Spot for GPUs</Cite>
            </li>
            <li>
              <strong>Let an allocation strategy choose the instances.</strong> AWS recommends the{' '}
              <code>price-capacity-optimized</code> allocation strategy, which takes instances &quot;from the most-available Spot
              capacity pools that also have the lowest possible price&quot;. Karpenter applies this strategy
              automatically, and AWS Batch has its own names for it.{' '}
              <Cite id="F10-528">EC2 User Guide, Spot allocation strategies</Cite>{' '}
              <Cite id="F10-403">Karpenter v1.15.3 documentation, scheduling</Cite>
            </li>
            <li>
              <strong>Write checkpoints on a timer, and do not rely on the notice alone.</strong> The AWS Batch guide
              advises splitting Spot work into parts &quot;of 30 minutes or less&quot;. The EKS Best Practices Guide
              describes two tiers of checkpoints, and the faster tier saves every 5 to 30 minutes.{' '}
              <Cite id="F10-535">AWS Batch User Guide and EKS Best Practices Guide, checkpointing</Cite>
            </li>
            <li>
              <strong>Keep tightly coupled work off Spot Instances, and be careful with fallbacks.</strong> AWS
              strongly discourages Spot for work that is tightly coupled between nodes, such as Multi-node training.
              The same page also discourages failing over to On-Demand to handle interruptions. Keep that caveat in
              mind for every pattern in the next four sections that falls back from Spot to On-Demand.{' '}
              <Cite id="F10-530">EC2 User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Raise the Spot quota before the first run.</strong> The EC2 documentation lists a default Spot
              quota of 0 for G instances and for P instances. So a new account cannot launch a single GPU Spot Instance
              until the quota is raised. <Cite id="F10-533">EC2 User Guide, Spot Instance quotas</Cite>
            </li>
          </ul>
          <ExpandableSection headerText="Spot interruption rates, Capacity Blocks and training plans by instance family">
            <SpaceBetween size="m">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 860 }}>
                  <caption style={{ captionSide: 'top', textAlign: 'left', paddingBottom: 6 }}>
                    <Box variant="small" color="text-body-secondary">
                      The Spot column comes from AWS&apos;s Spot Instance Advisor data file, last modified on 20 March
                      2026. Each bucket is the share of running instances that were interrupted in the trailing month.
                      The Capacity Blocks and training plans columns show the AWS lists as of November 2026.
                    </Box>
                  </caption>
                  <thead>
                    <tr>
                      <th style={TH}>Family</th>
                      <th style={TH}>Spot interruption rate (Spot Instance Advisor)</th>
                      <th style={TH}>Capacity Blocks for ML</th>
                      <th style={TH}>SageMaker training plans</th>
                      <th style={TH}>Sources</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={TD}>G5</td>
                      <td style={TD}>US East (N. Virginia): 7 of 8 sizes in the &quot;&gt;20%&quot; bucket</td>
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>
                        <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                        <Cite id="F09-35">training plans list</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>G6e</td>
                      <td style={TD}>US East (N. Virginia): 5 of 8 sizes in the &quot;&gt;20%&quot; bucket</td>
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>Not on the list</td>
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
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>
                        <Cite id="F09-96">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                        <Cite id="F09-35">training plans list</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>G7</td>
                      <td style={TD}>Sold as Spot Instances. The file has no rows for G7, because it is older than the family.</td>
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>Not on the list</td>
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
                      <td style={TD}>The file has no rows for them</td>
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
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>Not on the list</td>
                      <td style={TD}>
                        <Cite id="F09-97">Spot Instance Advisor data file</Cite> <Cite id="F09-91">Capacity Blocks list</Cite>{' '}
                        <Cite id="F09-34">training plans list</Cite>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Box variant="p">
                Each Spot cell describes one Region over one month. In US East (N. Virginia), many of the G sizes that a
                simulation fleet would use are often reclaimed. That is why retries, checkpoints on a timer and a list
                of several instance types matter most for simulation. The file records how often running instances are
                interrupted. It does not show how often a Spot request for a GPU type is filled in the first place.{' '}
                <Cite id="F09-96">Spot Instance Advisor data file</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can connect the services into one pipeline that starts when an episode arrives in Amazon S3 and ends with a new policy on the arm. Then you can choose the section to read next."
          >
            Connecting the pipeline and the robot
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>Starting the pipeline and ordering its steps.</strong> Amazon S3 can send every object event in a
              bucket to Amazon EventBridge. When a new episode file arrives in the bucket, that event starts the
              pipeline. AWS Step Functions is the AWS workflow service. It runs a workflow as a series of steps,
              which Step Functions calls states. One task state can submit an AWS Batch job and wait for it to finish, so a pipeline of
              curating, training and evaluating needs only a few states. The Distributed Map state runs each item of a
              list as a child workflow. If you do not set its concurrency, it runs as many as 10,000 child workflows at
              the same time, so always set the concurrency yourself. NVIDIA OSMO is an open-source alternative for this
              workflow layer. It is a workflow orchestrator for physical AI pipelines, and it runs on Kubernetes
              clusters. <Cite id="F09-102">S3 User Guide, Amazon EventBridge</Cite>{' '}
              <Cite id="F09-100">Step Functions Developer Guide, AWS Batch integration</Cite>{' '}
              <Cite id="F09-101">Step Functions Developer Guide, Distributed Map</Cite>{' '}
              <Cite id="F09-62">NVIDIA OSMO 6.3.1, README</Cite>
            </li>
            <li>
              <strong>Tracking models.</strong> SageMaker offers MLflow as a managed service. MLflow is an
              experiment tracking server that also registers models. A SageMaker training job, a HyperPod pod and an
              AWS Batch job can all write to the same server, because the MLflow client only needs the server&apos;s
              address.{' '}
              <Cite id="F09-103">SageMaker Developer Guide, managed MLflow</Cite>
            </li>
            <li>
              <strong>Storing data and checkpoints.</strong> Mountpoint for Amazon S3 presents a bucket as a local file
              system. It can read files and create new ones, but it cannot modify existing files. That fits a dataset
              that is written once. For checkpoints that are rewritten in place, the S3 guide points to FSx for Lustre
              instead. FSx for Lustre is a managed shared file system. <Cite id="F09-106">S3 User Guide, Mountpoint for Amazon S3</Cite>
            </li>
            <li>
              <strong>Interactive workstations.</strong> A simulation workstation that a person uses interactively
              needs no orchestrator, because the person holds the instance while working on it. Amazon DCV is the
              remote-desktop protocol for such a workstation. <Cite id="F09-104">Amazon DCV product page</Cite>
            </li>
          </ul>
          <Box variant="p">
            <strong>The robot.</strong> Section 18, The Fleet, covers how a policy reaches the robot: the Greengrass
            component that runs the policy container, the deployment document and the staged rollout. The return path
            sends recorded episodes from the robot back into the pipeline, and it is also a Greengrass component. A
            component is described by a recipe: a file that names the component&apos;s dependencies and the commands
            that install and run it.
          </Box>
          <Snippet
            title="A Greengrass component recipe that calls an AWS service with the device's temporary credentials"
            mode="adapted"
            source={<Cite id="F09-133">Greengrass developer guide, Interact with AWS services</Cite>}
          >
            {GREENGRASS_AWS_RECIPE}
          </Snippet>
          <Box variant="p">
            The recipe above is the example from the Greengrass developer guide, without its second manifest, which
            is for Windows. The important line is the dependency on <code>aws.greengrass.TokenExchangeService</code>. This
            dependency gives the component an environment variable, and an AWS SDK client reads that variable to fetch
            temporary credentials. So no access key is stored on the robot. By default, the credentials expire after
            one hour. The example in the guide lists S3 buckets. To upload episodes instead, you replace the script,
            and the device&apos;s role needs permission to write to S3, as section 18, The Fleet, describes.{' '}
            <Cite id="F09-133">Greengrass developer guide, Interact with AWS services</Cite>
          </Box>
          <Box variant="p">
            The Kubernetes alternative to Greengrass is EKS Hybrid Nodes. It is the EKS feature that attaches a machine
            outside AWS to an EKS cluster as a node. For a Jetson on or next to a robot, we recommend Greengrass. Two
            limits of Hybrid Nodes matter for a robot. The Hybrid Nodes documentation describes the feature as unfit
            for machines whose network link drops. Also, as of November 2026, Jetson Linux is not in the Hybrid Nodes
            table of validated operating systems. A desk machine such as a DGX Spark is worth adding as a hybrid node
            only when the lab already runs its training and evaluation on EKS. <Cite id="F09-119">EKS User Guide, Hybrid Nodes overview</Cite>{' '}
            <Cite id="F09-52">EKS User Guide, Hybrid Nodes operating systems</Cite>{' '}
            <Cite id="F09-127">Hybrid Nodes and Greengrass pages, compared</Cite>
          </Box>
          <ExpandableSection headerText="EKS Hybrid Nodes: network requirements and billing">
            <ul style={LIST}>
              <li>
                <strong>Network.</strong> The network guidance for a hybrid node is at least 100 Mbps of bandwidth and
                at most 200 ms of round-trip time to AWS. Section 18, The Fleet, lists the other requirements.{' '}
                <Cite id="F09-120">EKS User Guide, Hybrid Nodes prerequisites</Cite>
              </li>
              <li>
                <strong>Billing.</strong> Since 18 November 2026, AWS bills each hybrid node for at most 32 vCPUs.{' '}
                <Cite id="F09-116">AWS What&apos;s New, 18 November 2026, Hybrid Nodes billing cap</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <Placeholder
            what={
              <>
                a measurement of connecting our Jetson and our DGX Spark to AWS IoT: deploying a policy component to each
                device and uploading one recorded episode to S3, timed end to end.
              </>
            }
            source={<>our own setup of the two machines, which we have not done yet.</>}
          />
          <Box variant="p">
            <strong>What to do next.</strong> Find your workload in the table of fifteen workloads and note its
            orchestrator. For one arm, that is almost always AWS Batch, so go to section 25, AWS Batch, and keep the
            two-minute Spot notice in mind. If your team already submits jobs with Slurm, go to section 26, AWS
            Parallel Computing Service. If a second team will share the machines with yours, read section 27, Amazon
            SageMaker HyperPod, or the queueing options in section 28, Amazon EKS. Then go to section 29, Choosing,
            with the GPU family, the orchestrator and the purchase option you have picked.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
