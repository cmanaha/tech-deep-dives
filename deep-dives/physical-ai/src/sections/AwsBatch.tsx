import type { CSSProperties } from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Snippet } from '../components/Blocks';
import { Cite } from '../components/Cite';
import { ClusterFigure } from '../components/Cluster';
import type { ClusterSpec, JobToken } from '../components/Cluster';
import { Figure } from '../components/Figure';
import { ARM, TASK_NAME, TASK_STORY } from '../lib/task';

const INK = '#16191f';
const MUTED = '#5f6b7a';
const LINE = '#8d99a8';
const RETRY = '#c2410c';
const BLUE = '#1f5fa8';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `After every fine-tune a new policy has to prove itself: it drives a simulated ${ARM} arm that must ${TASK_STORY}, 500 times, each run (an episode) with its own random seed, and the success rate decides whether the policy goes to the real arm.`;

/* ------------------------------------------------------------------------ */
/* Configuration text. Every field name is documented in a register entry;    */
/* every name and value is this dive's choice, as each Snippet says.          */
/* ------------------------------------------------------------------------ */

const SUBMIT_SWEEP = `{
  "jobName": "eval-block-in-cup",
  "jobQueue": "sim-eval",
  "jobDefinition": "arm-eval",
  "arrayProperties": { "size": 500 },
  "parameters": { "checkpoint": "s3://<bucket>/policies/<run>/last" }
}`;

const COMPUTE_ENVIRONMENT = `{
  "computeEnvironmentName": "gpu-spot",
  "type": "MANAGED",
  "state": "ENABLED",
  "computeResources": {
    "type": "SPOT",
    "allocationStrategy": "SPOT_PRICE_CAPACITY_OPTIMIZED",
    "minvCpus": 0,
    "maxvCpus": 16,
    "instanceTypes": ["g6e.xlarge", "g6.xlarge"],
    "subnets": ["<subnet-a>", "<subnet-b>", "<subnet-c>"],
    "securityGroupIds": ["<security-group>"],
    "instanceRole": "ecsInstanceRole",
    "ec2Configuration": [{ "imageType": "ECS_AL2023_NVIDIA" }]
  }
}`;

const JOB_QUEUE = `{
  "jobQueueName": "sim-eval",
  "state": "ENABLED",
  "priority": 1,
  "computeEnvironmentOrder": [
    { "order": 1, "computeEnvironment": "gpu-spot" },
    { "order": 2, "computeEnvironment": "gpu-ondemand" }
  ],
  "jobStateTimeLimitActions": [
    {
      "state": "RUNNABLE",
      "action": "CANCEL",
      "maxTimeSeconds": 14400,
      "reason": "CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY"
    }
  ]
}`;

const JOB_DEFINITION = `{
  "jobDefinitionName": "arm-eval",
  "type": "container",
  "containerProperties": {
    "image": "<account>.dkr.ecr.<region>.amazonaws.com/<simulator-image>:<tag>",
    "command": ["python", "evaluate.py", "--checkpoint", "Ref::checkpoint"],
    "resourceRequirements": [
      { "type": "VCPU", "value": "4" },
      { "type": "MEMORY", "value": "14000" },
      { "type": "GPU", "value": "1" }
    ]
  },
  "retryStrategy": {
    "attempts": 3,
    "evaluateOnExit": [
      { "onStatusReason": "Host EC2*", "action": "RETRY" },
      { "onReason": "*", "action": "EXIT" }
    ]
  },
  "timeout": { "attemptDurationSeconds": 1800 }
}`;

/* ------------------------------------------------------------------------ */
/* The cluster figure: eight children of the evaluation array, one queue,     */
/* Spot first and On-Demand second, one-GPU instances, Amazon S3 for progress. */
/* ------------------------------------------------------------------------ */

type At = JobToken['at'];
type Tone = NonNullable<JobToken['tone']>;
const job = (id: string, at: At, tone: Tone = 'waiting'): JobToken => ({ id, label: id, at, tone });
const CHILDREN = ['0', '1', '2', '3', '4', '5', '6', '7'];
const OTHER = { state: 'running' as const, type: 'g6.xlarge' };
const SAVED = [{ id: 'progress', at: { store: 0, pos: 0 } }];

/** Children 0 to 5 on their GPUs: four on Spot, two on On-Demand. */
const sixRunning = (): JobToken[] => [
  ...CHILDREN.slice(0, 4).map((id, k) => job(id, { g: 0, i: k }, 'running')),
  job('4', { g: 1, i: 0 }, 'running'),
  job('5', { g: 1, i: 1 }, 'running'),
];

const SPEC: ClusterSpec = {
  title: 'An AWS Batch setup running an evaluation array job on Spot GPU instances with On-Demand behind',
  desc: 'On the control side, a submit box, a job queue, the scheduler and a tray of finished jobs. On the capacity side, two compute environments with one-GPU instances, Amazon S3 and the image registry, in one network.',
  submit: { label: 'SubmitJob, array size 500', sub: 'first 8 children shown, one seed each' },
  queues: [{ label: 'Job queue: sim-eval', sub: 'FIFO; order 1 Spot, 2 On-Demand' }],
  scheduler: { label: 'AWS Batch scheduler', sub: 'places jobs, scales the environments' },
  done: { label: 'SUCCEEDED (exit code 0)' },
  groups: [
    {
      label: 'Compute environment 1: gpu-spot',
      sub: ['g6e.xlarge or g6.xlarge, minvCpus 0, maxvCpus 16', 'SPOT_PRICE_CAPACITY_OPTIMIZED'],
      market: 'spot',
      gpus: 1,
      places: 4,
      type: 'g6e.xlarge',
    },
    {
      label: 'Compute environment 2: gpu-ondemand',
      sub: ['g6e.xlarge, minvCpus 0, maxvCpus 8', 'scaled up when environment 1 is at its maxvCpus'],
      market: 'on-demand',
      gpus: 1,
      places: 2,
      type: 'g6e.xlarge',
    },
  ],
  stores: [
    { label: 'Amazon S3', sub: 'progress, results' },
    { label: 'Amazon ECR', sub: 'the job image' },
  ],
  network: 'Your VPC: subnets in three Availability Zones',
  jobNoun: 'one child job',
  steps: [
    {
      caption: (
        <>
          You call <code>SubmitJob</code> once with an array size of 500; the figure follows the first eight children,
          which enter the queue as <code>SUBMITTED</code>. Both compute environments have <code>minvCpus</code> 0, so no
          instance exists yet.
        </>
      ),
      scheduler: ['queue empty', 'both environments at 0 vCPUs'],
      instances: {},
      jobs: CHILDREN.map((id, k) => job(id, { submit: k })),
    },
    {
      caption: (
        <>
          The scheduler finds no dependencies and moves each child to <code>RUNNABLE</code>. Batch raises{' '}
          <code>desiredvCpus</code> in compute environment 1 and the allocation strategy picks from the list. The
          children stay <code>RUNNABLE</code> for the few minutes a new EC2 instance takes.
        </>
      ),
      scheduler: ['8 RUNNABLE', 'raises desiredvCpus in 1'],
      instances: { '0.0': 'launching', '0.1': 'launching', '0.2': 'launching', '0.3': 'launching' },
      jobs: CHILDREN.map((id, k) => job(id, { q: 0, pos: k })),
    },
    {
      caption: (
        <>
          The instances join the ECS cluster and Batch places four children. They are <code>STARTING</code>: the image
          is being pulled from the registry. Compute environment 1 is now at its <code>maxvCpus</code>, the documented
          condition for scaling up the next one, so Batch launches On-Demand instances for the children still waiting.
        </>
      ),
      scheduler: ['4 STARTING, 4 RUNNABLE', 'environment 1 full: scales up 2'],
      instances: { '0.0': 'running', '0.1': 'running', '0.2': 'running', '0.3': 'running', '1.0': 'launching', '1.1': 'launching' },
      jobs: [...CHILDREN.slice(0, 4).map((id, k) => job(id, { g: 0, i: k })), ...CHILDREN.slice(4).map((id, k) => job(id, { q: 0, pos: k }))],
    },
    {
      caption: (
        <>
          Six children are <code>RUNNING</code>, each holding one whole GPU, and the timeout clock of each has started.
          Children 6 and 7 wait in <code>RUNNABLE</code>, because both environments are at their ceilings.
        </>
      ),
      scheduler: ['6 RUNNING, 2 RUNNABLE', 'both environments at maxvCpus'],
      instances: { '0.0': 'running', '0.1': 'running', '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [...sixRunning(), job('6', { q: 0, pos: 0 }), job('7', { q: 0, pos: 1 })],
    },
    {
      caption: (
        <>
          EC2 sends a Spot interruption notice to the instance under child 1: two minutes, on a best-effort basis. Batch
          sets that instance to <code>DRAINING</code>, so no new job lands on it. The drain does not stop the container,
          and no page read for this dive says Batch signals it.
        </>
      ),
      scheduler: ['instance of child 1: DRAINING', 'child 1 still RUNNING'],
      instances: { '0.0': 'running', '0.1': 'notice', '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [...sixRunning(), job('6', { q: 0, pos: 0 }), job('7', { q: 0, pos: 1 })],
    },
    {
      caption: (
        <>
          Child 1 saves its own progress to Amazon S3, because its script polls the instance metadata for the notice or
          saves on a timer. This step is your code. Batch has no part in it.
        </>
      ),
      scheduler: ['child 1 still RUNNING', 'no signal from Batch'],
      instances: { '0.0': 'running', '0.1': 'notice', '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [...sixRunning(), job('6', { q: 0, pos: 0 }), job('7', { q: 0, pos: 1 })],
      checkpoints: [{ id: 'progress', at: { g: 0, i: 1 } }],
    },
    {
      caption: (
        <>
          EC2 terminates the instance. The attempt fails with a status reason that begins <code>Host EC2</code>, the
          retry rule matches it, and Batch returns child 1 to <code>RUNNABLE</code> at the front of the queue, ahead of
          children 6 and 7.
        </>
      ),
      scheduler: ['child 1: attempt 1 failed', 'RUNNABLE again, front of queue'],
      instances: { '0.0': 'running', '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [
        ...sixRunning().filter((j) => j.id !== '1'),
        job('1', { q: 0, pos: 0 }, 'requeued'),
        job('6', { q: 0, pos: 1 }),
        job('7', { q: 0, pos: 2 }),
      ],
      checkpoints: SAVED,
    },
    {
      caption: (
        <>
          Compute environment 1 is below its ceiling again, so Batch launches a replacement there. This time the
          allocation strategy chose the other type on the list.
        </>
      ),
      scheduler: ['replacement launching in 1', '3 RUNNABLE'],
      instances: { '0.0': 'running', '0.1': { state: 'launching', type: 'g6.xlarge' }, '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [
        ...sixRunning().filter((j) => j.id !== '1'),
        job('1', { q: 0, pos: 0 }, 'requeued'),
        job('6', { q: 0, pos: 1 }),
        job('7', { q: 0, pos: 2 }),
      ],
      checkpoints: SAVED,
    },
    {
      caption: (
        <>
          Child 1 runs its second attempt on the new instance. <code>AWS_BATCH_JOB_ATTEMPT</code> is now 2, which tells
          the script to load its saved progress from Amazon S3 and continue from there.
        </>
      ),
      scheduler: ['child 1 RUNNING, attempt 2', '2 RUNNABLE'],
      instances: { '0.0': 'running', '0.1': OTHER, '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [...sixRunning(), job('6', { q: 0, pos: 0 }), job('7', { q: 0, pos: 1 })],
      checkpoints: SAVED,
    },
    {
      caption: (
        <>
          Five children exit with code 0 and are <code>SUCCEEDED</code>. Freed GPUs in compute environment 1, the first
          in the order, take children 6 and 7. The queue is empty, so the idle instances go and compute environment 2
          returns to its floor of zero.
        </>
      ),
      scheduler: ['5 SUCCEEDED, 3 RUNNING', 'environment 2 back to 0 vCPUs'],
      instances: { '0.0': 'running', '0.1': OTHER, '0.2': 'running' },
      jobs: [
        job('0', { done: 0 }, 'done'),
        job('2', { done: 1 }, 'done'),
        job('3', { done: 2 }, 'done'),
        job('4', { done: 3 }, 'done'),
        job('5', { done: 4 }, 'done'),
        job('6', { g: 0, i: 0 }, 'running'),
        job('1', { g: 0, i: 1 }, 'running'),
        job('7', { g: 0, i: 2 }, 'running'),
      ],
      checkpoints: SAVED,
    },
    {
      caption: (
        <>
          Every child has succeeded and its result is in Amazon S3. With nothing left to run, Batch brings{' '}
          <code>desiredvCpus</code> back to <code>minvCpus</code>, which is 0, and no instance remains.
        </>
      ),
      scheduler: ['8 SUCCEEDED, queue empty', 'desiredvCpus back to minvCpus'],
      instances: {},
      jobs: ['0', '2', '3', '4', '5', '6', '1', '7'].map((id, k) => job(id, { done: k }, 'done')),
      checkpoints: SAVED,
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Two small diagrams                                                         */
/* ------------------------------------------------------------------------ */

const STATES = [
  { name: 'SUBMITTED', note: 'in the queue, not yet evaluated' },
  { name: 'PENDING', note: 'only with a dependency' },
  { name: 'RUNNABLE', note: 'ready, waiting for an instance' },
  { name: 'STARTING', note: 'placed; the image is pulled' },
  { name: 'RUNNING', note: 'the container runs on its GPU' },
];

function SvgText({ x, y, bold, fill, anchor, children }: { x: number; y: number; bold?: boolean; fill?: string; anchor?: 'start' | 'middle' | 'end'; children: string }) {
  return (
    <text x={x} y={y} fontFamily="sans-serif" fontSize="12" fontWeight={bold ? 'bold' : 'normal'} fill={fill ?? INK} textAnchor={anchor ?? 'start'}>
      {children}
    </text>
  );
}

function DownArrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 5} stroke={LINE} strokeWidth="1.6" />
      <polygon points={`${x},${y2} ${x - 4},${y2 - 6} ${x + 4},${y2 - 6}`} fill={LINE} />
    </g>
  );
}

function JobStatesDiagram() {
  const X = 30;
  const W = 226;
  const yOf = (i: number) => 12 + i * 54;
  const endY = 296;
  return (
    <svg viewBox="0 0 400 388" role="img" aria-labelledby="aws-batch-states-title" style={{ width: '100%', height: 'auto' }}>
      <title id="aws-batch-states-title">The states an AWS Batch job passes through, from SUBMITTED to SUCCEEDED or FAILED</title>
      <desc>
        Five boxes in a column, SUBMITTED, PENDING, RUNNABLE, STARTING and RUNNING, lead to two end boxes, SUCCEEDED and
        FAILED. Notes on the right mark where the instance launches, that the image pull is outside the timeout and
        that the timeout counts from RUNNING. An arrow on the left returns a failed attempt to RUNNABLE.
      </desc>
      <rect x="0" y="0" width="400" height="388" fill="#fbfbfd" />
      {STATES.map((s, i) => {
        const y = yOf(i);
        const running = s.name === 'RUNNING';
        return (
          <g key={s.name}>
            <rect x={X} y={y} width={W} height="42" rx="6" fill={running ? '#eaf2fc' : '#ffffff'} stroke={running ? BLUE : INK} strokeWidth="1.4" strokeDasharray={s.name === 'PENDING' ? '5 4' : undefined} />
            <SvgText x={X + 10} y={y + 17} bold>
              {s.name}
            </SvgText>
            <SvgText x={X + 10} y={y + 33} fill={MUTED}>
              {s.note}
            </SvgText>
            {i < STATES.length - 1 && <DownArrow x={X + 40} y1={y + 42} y2={yOf(i + 1)} />}
          </g>
        );
      })}
      {/* side notes */}
      <line x1="262" y1={yOf(2) + 4} x2="262" y2={yOf(2) + 38} stroke={LINE} strokeWidth="2" />
      <SvgText x={270} y={yOf(2) + 17} fill={MUTED}>
        the instance
      </SvgText>
      <SvgText x={270} y={yOf(2) + 33} fill={MUTED}>
        launches here
      </SvgText>
      <line x1="262" y1={yOf(3) + 4} x2="262" y2={yOf(3) + 38} stroke={LINE} strokeWidth="2" strokeDasharray="4 3" />
      <SvgText x={270} y={yOf(3) + 17} fill={MUTED}>
        outside the
      </SvgText>
      <SvgText x={270} y={yOf(3) + 33} fill={MUTED}>
        timeout
      </SvgText>
      <line x1="262" y1={yOf(4) + 4} x2="262" y2={yOf(4) + 38} stroke={BLUE} strokeWidth="3" />
      <SvgText x={270} y={yOf(4) + 17} fill={BLUE} bold>
        the timeout
      </SvgText>
      <SvgText x={270} y={yOf(4) + 33} fill={BLUE} bold>
        counts here
      </SvgText>
      {/* retry: RUNNING back to RUNNABLE */}
      <path d={`M ${X} ${yOf(4) + 21} H 12 V ${yOf(2) + 21} H ${X - 7}`} fill="none" stroke={RETRY} strokeWidth="1.8" />
      <polygon points={`${X},${yOf(2) + 21} ${X - 7},${yOf(2) + 17} ${X - 7},${yOf(2) + 25}`} fill={RETRY} />
      {/* ends */}
      <DownArrow x={X + 54} y1={yOf(4) + 42} y2={endY} />
      <DownArrow x={X + 171} y1={yOf(4) + 42} y2={endY} />
      <rect x={X} y={endY} width="109" height="42" rx="6" fill="#e6f6ea" stroke="#1e7b3a" strokeWidth="1.4" />
      <SvgText x={X + 10} y={endY + 17} bold>
        SUCCEEDED
      </SvgText>
      <SvgText x={X + 10} y={endY + 33} fill={MUTED}>
        exit code 0
      </SvgText>
      <rect x={X + 117} y={endY} width="109" height="42" rx="6" fill="#fdecea" stroke="#b42318" strokeWidth="1.4" />
      <SvgText x={X + 127} y={endY + 17} bold>
        FAILED
      </SvgText>
      <SvgText x={X + 127} y={endY + 33} fill={MUTED}>
        out of attempts
      </SvgText>
      <SvgText x={X} y={endY + 62} fill={RETRY}>
        Orange arrow: a failed attempt with attempts
      </SvgText>
      <SvgText x={X} y={endY + 78} fill={RETRY}>
        left returns the job to RUNNABLE.
      </SvgText>
    </svg>
  );
}

function VcpuGaugeDiagram() {
  const needle = 190;
  return (
    <svg viewBox="0 0 400 136" role="img" aria-labelledby="aws-batch-gauge-title" style={{ width: '100%', height: 'auto' }}>
      <title id="aws-batch-gauge-title">The vCPU gauge of a compute environment: a floor, a ceiling and a needle that Batch moves</title>
      <desc>
        A horizontal bar. Its left end is minvCpus, the floor. Its right end is maxvCpus, the ceiling. A marker between
        them is desiredvCpus, which Batch moves with queue demand; the bar is filled from the floor to the marker.
      </desc>
      <rect x="0" y="0" width="400" height="136" fill="#fbfbfd" />
      <SvgText x={30} y={20} bold>
        minvCpus
      </SvgText>
      <SvgText x={30} y={36} fill={MUTED}>
        the floor, set by you
      </SvgText>
      <SvgText x={370} y={20} bold anchor="end">
        maxvCpus
      </SvgText>
      <SvgText x={370} y={36} fill={MUTED} anchor="end">
        the ceiling, set by you
      </SvgText>
      <path d="M 30 56 H 370 V 76 H 30 Z" fill="#ffffff" stroke={LINE} strokeWidth="1.2" />
      <path d={`M 30 56 H ${needle} V 76 H 30 Z`} fill="#cfe1f7" stroke={BLUE} strokeWidth="1.2" />
      <line x1="30" y1="48" x2="30" y2="84" stroke={INK} strokeWidth="2.4" />
      <line x1="370" y1="48" x2="370" y2="84" stroke={INK} strokeWidth="2.4" />
      <line x1={needle} y1="50" x2={needle} y2="84" stroke={BLUE} strokeWidth="2.4" />
      <polygon points={`${needle},84 ${needle - 6},94 ${needle + 6},94`} fill={BLUE} />
      <SvgText x={needle} y={110} bold fill={BLUE} anchor="middle">
        desiredvCpus
      </SvgText>
      <SvgText x={needle} y={126} fill={MUTED} anchor="middle">
        the needle, moved by Batch
      </SvgText>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                    */
/* ------------------------------------------------------------------------ */

export function AwsBatch() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Take one managed queue apart: every object you create, every state a job passes through, and a Spot setup in which a reclaimed machine costs minutes of work (AWS Batch User Guide and API Reference, read 2026-11-20)."
          >
            25. AWS Batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section depends on section 24, Orchestrating Physical AI on AWS, which placed the loop&apos;s workloads
            on the AWS schedulers and owns the capacity markets. Here one scheduler is taken apart: AWS Batch, the one
            that keeps no cluster between runs.
          </Box>
          <Box variant="p">
            Two pieces of the arm&apos;s loop land on it. {TASK_SENTENCE} Before that comes the fine-tune itself: one
            GPU for a few hours, adapting a pretrained policy to the {TASK_NAME} task. The first is 500 small jobs that
            do not depend on each other. The second is one long job that must finish. Batch runs both, on two different
            queues.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You can say in two sentences what Batch does for you, and tell from the shape of a job whether it belongs here.">
            What Batch is, and when to pick it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Batch is a managed job queue. You describe a container job once, submit it to a queue, and Batch starts
            EC2 (Elastic Compute Cloud) instances for it, places the container on a GPU, retries it if the machine is
            lost and removes the instances when the queue is empty. The challenge it meets: you have 500 independent
            simulation runs and no cluster, and you do not want to keep one.
          </Box>
          <Box variant="p">
            Underneath are ordinary AWS parts. A compute environment, Batch&apos;s name for a pool of capacity, wraps
            resources that Batch creates in your own account: an EC2 Auto Scaling group or Spot Fleet that launches
            the instances, and a cluster of Amazon ECS (Elastic Container Service), the AWS service that starts
            containers on instances. Batch takes full control of them, so nothing else belongs there.{' '}
            <Cite id="F10-1">AWS Batch User Guide, Managed compute environments</Cite>
          </Box>
          <Box variant="p">
            <strong>Use it when</strong> the work has one of these shapes.
          </Box>
          <ul style={LIST}>
            <li>
              Many jobs that do not depend on each other: an evaluation sweep, simulation rollouts, synthetic video
              generated overnight. AWS&apos;s post on NVIDIA Cosmos video models gives Batch the offline side because
              it &quot;provisions GPU compute resources only when inference jobs execute, then terminates instances
              upon completion&quot;.{' '}
              <Cite id="F10-69">AWS HPC Blog, Running NVIDIA Cosmos world foundation models on AWS</Cite>
            </li>
            <li>
              One GPU job of minutes to hours that runs a few times a week, such as the per-task fine-tune.
            </li>
            <li>
              Work that can lose its machine, because it is short enough to rerun or saves checkpoints. It can run on
              Spot, the spare capacity AWS can take back.
            </li>
          </ul>
          <Box variant="p">
            <strong>Use something else when</strong> one of these is true.
          </Box>
          <ul style={LIST}>
            <li>
              A job lasts seconds or must start at once: &quot;the overhead to schedule the batch job might take
              longer than the runtime of the job itself&quot;.{' '}
              <Cite id="F10-42">AWS Batch User Guide, When to use AWS Batch</Cite>
            </li>
            <li>
              Teams must be able to take GPUs back from each other. Batch does not stop a running container job to
              make room for another.{' '}
              <Cite id="F10-34">AWS Batch User Guide, Preemption and Quota management</Cite>
            </li>
            <li>
              A job needs a fraction of a GPU. Batch reserves whole physical GPUs.{' '}
              <Cite id="F10-44">AWS Batch User Guide, job definition parameters and EKS GPU job definitions</Cite>
            </li>
            <li>
              A training run spans many machines for days. Batch can run one job across instances, but only on
              On-Demand capacity (machines by the second, no commitment) and without replacing a machine that fails.{' '}
              <Cite id="F09-8">AWS Batch User Guide, compute environment considerations for multi-node jobs</Cite>{' '}
              <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You can name every object in a Batch setup, say what each holds, and know which defaults to change before the first GPU job.">
            Its moving parts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A Batch setup is four objects you create and one you submit and watch: a job definition, the job itself, a
            job queue, an optional scheduling policy, and one to three compute environments.
          </Box>

          <Box variant="h3">Job definition</Box>
          <Box variant="p">
            The template of a job: the container image, the command, and what one run needs.{' '}
            <code>resourceRequirements</code> states the needs as vCPUs (virtual CPUs), memory and GPUs, and the GPU
            value is a whole number of physical GPUs reserved for the container. Two more blocks decide how a job ends
            badly, <code>retryStrategy</code> and <code>timeout</code>, and their defaults are the ones to change: a job
            gets one attempt with no retry, and no timeout at all unless you set <code>attemptDurationSeconds</code>{' '}
            (minimum 60 seconds). A definition can be at most 24 KiB, and a submission may override its retry strategy,
            timeout, resources and parameters.{' '}
            <Cite id="F10-43">AWS Batch User Guide, job definition parameters and service quotas</Cite>{' '}
            <Cite id="F10-44">AWS Batch User Guide, resourceRequirements</Cite>{' '}
            <Cite id="F10-46">AWS Batch User Guide, Job timeouts</Cite>{' '}
            <Cite id="F10-52">AWS Batch User Guide, Automated job retries</Cite>
          </Box>

          <Box variant="h3">Job, and the states it passes through</Box>
          <Box variant="p">
            A job is one submission of a definition to a queue. Batch reports where it is with a state. A job that
            succeeds passes through up to six of them, and the seventh, <code>FAILED</code>, is the other ending.
          </Box>
          <Figure
            cites="F10-23 F10-24 F10-25 F10-46 F10-52"
            caption="Read from the top down. PENDING is dashed because a job with no dependency skips it. The notes on the right mark the three places that matter for configuration."
          >
            <div style={NARROW}>
              <JobStatesDiagram />
            </div>
          </Figure>
          <Box variant="p">
            Two facts on this track change how you configure a job. While an instance is launching for it, the job
            shows <code>RUNNABLE</code>, and it can stay there indefinitely when no capacity is available. And{' '}
            <code>STARTING</code>, the state in which the container image is pulled, sits outside the timeout: the
            duration starts at <code>RUNNING</code>, so the minutes a large simulator image takes to pull do not
            count.{' '}
            <Cite id="F10-23">AWS Batch User Guide, Job states</Cite>{' '}
            <Cite id="F10-24">AWS Batch User Guide, Job states, STARTING and RUNNING</Cite>
          </Box>
          <Box variant="p">
            When the time is up the container receives SIGTERM, the Unix signal that asks a process to stop, and 30
            seconds later SIGKILL, which cannot be refused. A job ended by its timeout is not retried. Batch keeps
            finished jobs for at least 7 days, so the record of an experiment lives somewhere else.{' '}
            <Cite id="F10-46">AWS Batch User Guide, Job timeouts</Cite>{' '}
            <Cite id="F10-25">AWS Batch User Guide, Job states, SUCCEEDED and FAILED</Cite>
          </Box>

          <Box variant="h3">Array job</Box>
          <Box variant="p">
            One submission that spawns 2 to 10,000 child jobs sharing a definition. Each child reads its index, starting
            at 0, from the environment variable <code>AWS_BATCH_JOB_ARRAY_INDEX</code> and uses it to pick its seed.
            The timeout applies per child. The parent sits in <code>PENDING</code> while its children run, and one
            failed child fails the parent.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>{' '}
            <Cite id="F10-23">AWS Batch User Guide, Job states</Cite>
          </Box>

          <Box variant="h3">Multi-node parallel job</Box>
          <Box variant="p">
            One job that spans several instances, for training that needs more GPUs than one machine has. Its{' '}
            <code>nodeProperties</code> give the number of nodes and name a main node, which starts first; the others
            start once it is <code>RUNNING</code>. Three limits shape its use: up to 1,000 nodes by default (the ECS cluster instance limit, which can be raised), one instance type for
            the whole job, and On-Demand only. If a child node dies, Batch takes no action on the other nodes, so your
            launcher has to notice and end the job.{' '}
            <Cite id="F10-49">AWS Batch User Guide, Node groups</Cite>{' '}
            <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>{' '}
            <Cite id="F09-8">AWS Batch User Guide, compute environment considerations for multi-node jobs</Cite>
          </Box>

          <Box variant="h3">Job queue</Box>
          <Box variant="p">
            Where jobs wait. A queue has a <code>priority</code>, which matters only between queues that share a compute
            environment (the higher integer is evaluated first), and a <code>computeEnvironmentOrder</code>: up to
            three compute environments, tried in ascending order, all of one CPU architecture. That list is how one
            queue reaches Spot first and On-Demand second. The documented condition for moving down it is narrow: a
            later environment is scaled up when the earlier ones &quot;have reached their maxvCpus&quot;, or when no
            instance type in them can satisfy the job at the front.{' '}
            <Cite id="F10-20">AWS Batch API Reference, CreateJobQueue</Cite>{' '}
            <Cite id="F10-21">AWS Batch API Reference, computeEnvironmentOrder</Cite>{' '}
            <Cite id="F10-22">AWS Batch API Reference, ComputeEnvironmentOrder</Cite>
          </Box>

          <Box variant="h3">Scheduling policy: first in, first out, or fair share</Box>
          <Box variant="p">
            A queue with no scheduling policy is FIFO (first in, first out): the job at the front goes next, and if it
            cannot be placed it blocks the ones behind it. Attaching a policy turns on fair-share scheduling, for a
            queue that several people or agents share. Every job then carries a <code>shareIdentifier</code>, a label
            for whose work it is, and the scheduler takes the next job from the share that has used the least lately.
            The measure is <code>T * weightFactor</code>. T is the vCPU usage of that share over a look-back window.
            The weight factor, 1.0 by default, scales it, so a lower weight makes the usage look smaller and earns the
            share more compute. The choice is fixed when the queue is created: a FIFO queue cannot have a policy added
            later.{' '}
            <Cite id="F09-14">AWS Batch User Guide, job scheduling and fair share</Cite>{' '}
            <Cite id="F10-26">AWS Batch User Guide, Jobs stuck in a RUNNABLE status</Cite>{' '}
            <Cite id="F10-30">AWS Batch API Reference, CreateJobQueue, schedulingPolicyArn</Cite>{' '}
            <Cite id="F10-31">AWS Batch User Guide, share identifiers, and API Reference, FairsharePolicy</Cite>
          </Box>

          <Box variant="h3">Compute environment</Box>
          <Box variant="p">
            The pool of capacity behind a queue. A managed compute environment has a <code>type</code>, a list of{' '}
            <code>instanceTypes</code>, an <code>allocationStrategy</code>, and three numbers that size it in vCPUs,
            even when the scarce thing is GPUs. The type is <code>EC2</code> for On-Demand, <code>SPOT</code>, two
            Fargate types that cannot run GPU jobs, or <code>ECS_MANAGED_INSTANCES</code>.{' '}
            <Cite id="F10-2">AWS Batch API Reference, ComputeResource, type</Cite>{' '}
            <Cite id="F09-1">AWS Batch User Guide, When to use Fargate</Cite>
          </Box>
          <Figure
            cites="F10-3 F10-4"
            caption="The three numbers as one gauge. You set the two ends; Batch moves the marker between them as jobs arrive and finish. Illustrative, not measured."
          >
            <div style={NARROW}>
              <VcpuGaugeDiagram />
            </div>
          </Figure>
          <Box variant="p">
            <code>minvCpus</code> is what the environment keeps running with no jobs: 0 means scale to zero, and a
            value above 0 is a warm pool. <code>maxvCpus</code> is the cap, which Batch may exceed by at most one
            instance. <code>desiredvCpus</code> is Batch&apos;s own dial, moved with queue demand: the guide recommends
            not setting it, and a request to lower it is refused.{' '}
            <Cite id="F10-3">AWS Batch API Reference, ComputeResource, the three vCPU members</Cite>{' '}
            <Cite id="F10-38">AWS Batch User Guide, minvCpus in practice</Cite>{' '}
            <Cite id="F09-4">AWS Batch User Guide, allocation strategies, maxvCpus</Cite>{' '}
            <Cite id="F10-4">AWS Batch User Guide, Perform scaling updates</Cite>
          </Box>
          <Box variant="p">
            The allocation strategy decides which type from the list Batch launches when its first choice is not
            available. The default is <code>BEST_FIT</code>, which picks the lowest-cost fitting type, waits for it,
            and blocks later infrastructure updates, so name a strategy on every GPU environment. Name the GPU
            families or sizes yourself as well: the ready-made lists (<code>optimal</code>,{' '}
            <code>default_x86_64</code>, <code>default_arm64</code>) contain no GPU family, and a GPU job in an
            environment that mixes in other families can sit in <code>RUNNABLE</code>.{' '}
            <Cite id="F10-8">AWS Batch API Reference, ComputeResource, allocationStrategy</Cite>{' '}
            <Cite id="F09-3">AWS Batch User Guide, Instance type allocation strategies</Cite>{' '}
            <Cite id="F10-5">AWS Batch API Reference, ComputeResource, instanceTypes</Cite>{' '}
            <Cite id="F10-6">AWS Batch User Guide, Run GPU jobs</Cite>
          </Box>
          <Box variant="p">
            On the way down, <code>minScaleDownDelayMinutes</code> keeps each instance for a set time after its last
            job, from 20 minutes to 1 week, so the next job of a burst skips the instance launch. Idle instances held
            this way are billed, and the delay never holds a Spot instance that has been reclaimed.{' '}
            <Cite id="F10-40">AWS Batch API Reference, ComputeScalingPolicy</Cite>{' '}
            <Cite id="F09-13">AWS What&apos;s New, configurable scale down delay</Cite>
          </Box>
          <ExpandableSection headerText="Two other kinds of compute environment">
            <ul style={LIST}>
              <li>
                <strong>ECS Managed Instances.</strong> AWS manages the machine image, patching and instance
                lifecycle, GPUs included. You give up multi-node jobs, custom images, the choice of allocation strategy
                and the warm pool. Every instance is drained 14 days after launch, and in a queue On-Demand
                environments must come before Spot ones.{' '}
                <Cite id="F09-2">AWS Batch User Guide, When to use Amazon ECS Managed Instances</Cite>{' '}
                <Cite id="F10-18">AWS Batch User Guide, ECS Managed Instances draining and job queues</Cite>
              </li>
              <li>
                <strong>Unmanaged.</strong> Batch schedules into an empty ECS cluster; you launch and scale the
                instances.{' '}
                <Cite id="F10-19">AWS Batch User Guide, Unmanaged compute environments</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Watch eight evaluation jobs cross a queue with Spot in front and On-Demand behind, and see who does what when a Spot instance is taken.">
            The cluster, drawn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The figure draws one Batch setup for the evaluation sweep. On the control side are the submission, the job
            queue, the scheduler and the tray of finished jobs. On the capacity side, in your account, are two compute
            environments behind the queue, Spot first and On-Demand second. Every instance has one GPU, and a job token
            sits on the GPU it reserved. Under them are the two stores every instance reaches: Amazon S3 for results
            and checkpoints, and Amazon ECR (Elastic Container Registry), which holds the job&apos;s container image.
            All of it sits in your VPC (Virtual Private Cloud, your private network on AWS).
          </Box>
          <Box variant="p">
            Both environments start at zero. To keep the picture small, compute environment 1 has a ceiling of 16
            vCPUs, which is four instances of 4 vCPUs each, and compute environment 2 a ceiling of 8. The moment to
            watch is the Spot interruption notice, the warning EC2 sends two minutes before it takes a Spot instance
            back. <Cite id="F10-7">AWS Batch User Guide, Run GPU jobs, instance table</Cite>{' '}
            <Cite id="F10-54">EC2 User Guide, Spot Instance interruption notices</Cite>
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="an evaluation sweep on Spot with On-Demand behind"
            cites="F09-1 F09-5 F09-10 F09-13 F09-130 F09-131 F10-1 F10-3 F10-7 F10-8 F10-21 F10-22 F10-23 F10-24 F10-25 F10-37 F10-38 F10-44 F10-46 F10-52 F10-53 F10-54 F10-55 F10-56 F10-57 F10-537"
            caption={
              <>
                Press Play or Step. A white token is waiting or starting, blue is running, orange has been sent back to
                the queue, green has finished; the yellow diamond is a checkpoint, here the child&apos;s saved
                progress. Instance counts and ceilings are sized to fit the picture. The order of events is the
                documented one, and step 6 is the job&apos;s own code. The retried child&apos;s place at the front
                of the queue is what the Batch best-practices page for Spot says; the job states page says only that
                the job returns to <code>RUNNABLE</code>.{' '}
                <Cite id="F10-537">AWS Batch User Guide, Spot best practices</Cite> Illustrative, not measured.
              </>
            }
          />
          <Box variant="p">
            <strong>The step Batch does not perform decides whether Spot works for you.</strong> The notice gives two
            minutes. Batch drains the instance, and the container keeps running untouched until the machine is gone: on
            the ECS side a standalone task on a draining instance is &quot;unaffected&quot; (that a Batch job is such a
            task is our reading), and the only signals the Batch guide documents belong to the timeout. So a job on Spot saves its progress by itself: on a timer, so that at most
            one interval is lost, or by polling the instance metadata, which EC2 recommends checking every 5 seconds.
            The pages read for this dive do not say whether the container gets a signal when the instance is
            terminated, so do not design on one, nor on the full two minutes: notices are best effort.{' '}
            <Cite id="F10-54">EC2 User Guide, Spot Instance interruption notices</Cite>{' '}
            <Cite id="F10-56">ECS Developer Guide, Draining container instances, and the ECS agent settings</Cite>
          </Box>
          <Box variant="p">
            The drain is a default Batch sets for Spot compute environments created or updated from 9 October 2026.
            The ECS agent&apos;s own default is still off, so an environment untouched since before that date may not
            drain.{' '}
            <Cite id="F10-55">AWS Batch User Guide, Spot best practices, and the ECS agent settings table</Cite>
          </Box>
          <Box variant="p">
            <strong>The move to On-Demand in step 3 happened because compute environment 1 was full.</strong> That is
            one of the two documented triggers. A Spot environment that is under its ceiling but cannot obtain Spot
            capacity matches neither. Whether Batch then scales up the On-Demand environment is an open question: the
            two API reference pages that describe the ordered list do not say, and this dive has not tested it. Our
            reading is to treat the Spot ceiling as the dial that sends work to On-Demand. For a Spot shortage the
            guide documents a pattern with two queues: a rule in Amazon EventBridge, the AWS event bus, catches the
            interrupted job, and an AWS Lambda function or an AWS Step Functions workflow resubmits it to a queue on
            On-Demand. <Cite id="F10-22">AWS Batch API Reference, ComputeEnvironmentOrder</Cite>{' '}
            <Cite id="F10-12">AWS Batch User Guide, On-Demand or Spot</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Follow one child job from the submit call to its result in Amazon S3, state by state, then see why the fine-tune takes the other queue.">
            One evaluation sweep and one fine-tune, end to end
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Last night&apos;s fine-tune left a policy checkpoint in Amazon S3. The sweep that tests it is one request.
          </Box>
          <Snippet
            title="Submitting the 500 evaluation episodes as one array job"
            mode="adapted"
            source={
              <>
                <Cite id="F09-130">AWS Batch API Reference, SubmitJob, sample request and request syntax</Cite>{' '}
                <Cite id="F10-63">AWS Batch User Guide, parameter substitution</Cite>
              </>
            }
            ours="the job, queue and definition names, the array size of 500 and the checkpoint parameter with its placeholder path."
          >
            {SUBMIT_SWEEP}
          </Snippet>
          <Box variant="p">
            The <code>arrayProperties</code> field makes 500 children, and the parent waits in <code>PENDING</code>{' '}
            while they run. Follow child 7, whose index is also its seed.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <ol style={LIST}>
            <li>
              <code>SUBMITTED</code>. In the queue; the scheduler has not looked at it yet.{' '}
              <Cite id="F10-23">AWS Batch User Guide, Job states</Cite>
            </li>
            <li>
              <code>RUNNABLE</code>. It depends on no other job, so it skips <code>PENDING</code>. The Spot environment
              is at zero, so Batch raises its <code>desiredvCpus</code>; an instance launches, runs its start-up script
              and joins the ECS cluster. The guide puts a new EC2 instance at a few minutes and gives no finer figure.{' '}
              <Cite id="F10-37">AWS Batch API Reference, desiredvCpus</Cite>{' '}
              <Cite id="F10-39">AWS Batch User Guide, causes of jobs stuck in RUNNABLE</Cite>
            </li>
            <li>
              <code>STARTING</code>. Placed on the instance; the simulator image is pulled from Amazon ECR, outside the
              timeout. <Cite id="F10-24">AWS Batch User Guide, Job states, STARTING</Cite>
            </li>
            <li>
              <code>RUNNING</code>, attempt 1. The script reads index 7 from the environment, loads the policy and runs
              the episode on its GPU, writing what it finishes to Amazon S3. The timeout clock runs from here.{' '}
              <Cite id="F10-24">AWS Batch User Guide, Job states, RUNNING</Cite>
            </li>
            <li>
              Still <code>RUNNING</code>, two minutes left. EC2 sends the Spot notice and Batch drains the instance.
              Nothing tells the container; the script, which polls the instance metadata, saves its progress.{' '}
              <Cite id="F10-55">AWS Batch User Guide, Spot best practices</Cite>{' '}
              <Cite id="F10-56">ECS Developer Guide, Draining container instances</Cite>
            </li>
            <li>
              Back to <code>RUNNABLE</code>. The instance is terminated and the attempt fails with a status reason that
              begins <code>Host EC2</code>. The retry rule matches, so child 7 returns to the front of the queue. A
              crash in the script would match the catch-all rule and go to <code>FAILED</code> at once.{' '}
              <Cite id="F10-57">synthesis of the retry, state and scale-down entries</Cite>{' '}
              <Cite id="F10-537">AWS Batch User Guide, Spot best practices, front of the job queue</Cite>{' '}
              <Cite id="F09-10">AWS Batch User Guide, Spot best practices and automated job retries</Cite>
            </li>
            <li>
              <code>STARTING</code>, then <code>RUNNING</code>, attempt 2. On a replacement instance the script finds{' '}
              <code>AWS_BATCH_JOB_ATTEMPT</code> at 2 and resumes from what it saved.{' '}
              <Cite id="F10-52">AWS Batch User Guide, Automated job retries</Cite>
            </li>
            <li>
              <code>SUCCEEDED</code>. Exit code 0; the outcome of the episode is one object in Amazon S3, and the log
              is in Amazon CloudWatch Logs under <code>/aws/batch/job</code>. The parent succeeds only if every child
              did, so by our advice the script reports a failed pick as a result and keeps failing exit codes for real
              errors. <Cite id="F10-25">AWS Batch User Guide, Job states, SUCCEEDED and FAILED</Cite>{' '}
              <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
            </li>
          </ol>
          <Box variant="p">
            One caution on size. Batch&apos;s guidance is to group short tasks so that each job runs 3 to 5 minutes. If
            one episode takes seconds, give each child several seeds and shrink the array to match. On Spot, keep a
            child under the 30 minutes the Spot guidance names.{' '}
            <Cite id="F10-42">AWS Batch User Guide, When to use AWS Batch</Cite>{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
          </Box>

          <Box variant="h3">The fine-tune takes the other queue</Box>
          <Box variant="p">
            The per-task fine-tune is one job that runs for hours. Batch&apos;s guidance sends that shape to On-Demand:
            a runtime of &quot;more than an hour&quot; that &quot;can&apos;t tolerate interruptions&quot;. So it goes to
            a second queue, <code>train</code>, whose only compute environment is the On-Demand one, with a higher{' '}
            <code>priority</code> than <code>sim-eval</code>. On the capacity the two queues share, the fine-tune is
            evaluated first. Priority orders the waiting; it never stops an evaluation child that is already running.{' '}
            <Cite id="F10-11">AWS Batch User Guide, On-Demand or Spot</Cite>{' '}
            <Cite id="F10-20">AWS Batch API Reference, CreateJobQueue, priority</Cite>{' '}
            <Cite id="F10-34">AWS Batch User Guide, Preemption</Cite>
          </Box>
          <Box variant="p">
            Its job definition differs from the evaluation child&apos;s in three places. It mounts a checkpoint volume
            that outlives the instance: an S3 Files volume (<code>s3filesVolumeConfiguration</code>), which presents an
            S3 bucket as a file system inside the container, or a volume on Amazon EFS (Elastic File System, a shared
            network file system). It sets <code>sharedMemorySize</code>, the size of <code>/dev/shm</code>, which by
            our reading a training job needs because data-loader workers pass batches through shared memory. And its
            timeout is sized in hours. The states are the same, with hours spent in <code>RUNNING</code>.{' '}
            <Cite id="F10-62">AWS Batch User Guide, Amazon S3 Files volumes and Amazon EFS volumes</Cite>{' '}
            <Cite id="F10-45">AWS Batch User Guide, linuxParameters</Cite>
          </Box>
          <Box variant="p">
            For scale, AWS&apos;s embodied AI series fine-tunes NVIDIA&apos;s GR00T robot model on Batch and reports
            that 6000 steps usually take up to 2 hours on a g6e.4xlarge instance. A fine-tune put on Spot must save
            checkpoints on a timer and resume whenever <code>AWS_BATCH_JOB_ATTEMPT</code> is above 1.{' '}
            <Cite id="F09-114">AWS Physical AI Blog, embodied AI series, part 1</Cite>{' '}
            <Cite id="F09-10">AWS Batch User Guide, automated job retries</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You leave with two queues and two compute environments to adapt, and you know which lines are AWS's advice and which are this dive's reading.">
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">First, what AWS recommends, in its own words.</Box>
          <ul style={LIST}>
            <li>
              On the Spot allocation strategy, two pages of the same guide disagree. The page on allocation strategies
              says: &quot;We recommend that you use SPOT_PRICE_CAPACITY_OPTIMIZED rather than SPOT_CAPACITY_OPTIMIZED
              in most instances.&quot; The page on Spot best practices says: &quot;Choose the SPOT_CAPACITY_OPTIMIZED
              allocation strategy&quot;, and adds &quot;If you&apos;re concerned about interruptions, this is a suitable
              choice.&quot; Both say &quot;Diversify instance types&quot;. Our reading: use the first, and spend the
              effort on the instance list.{' '}
              <Cite id="F10-10">AWS Batch User Guide, allocation strategies and Spot best practices</Cite>
            </li>
            <li>
              On the Spot price cap <code>bidPercentage</code>: &quot;For most use cases, we recommend leaving this
              field empty.&quot; <Cite id="F10-9">AWS Batch API Reference, ComputeResource, bidPercentage</Cite>
            </li>
            <li>
              On retries: &quot;we recommend that you set at least 1-3 automated retries.&quot;{' '}
              <Cite id="F10-53">AWS Batch User Guide, Spot best practices</Cite>
            </li>
            <li>
              On job length: &quot;We advise against running jobs that take an hour or more when using Amazon EC2 Spot
              instances&quot;. <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
            </li>
          </ul>
          <Box variant="p">
            The layout below is our reading: two compute environments, <code>gpu-spot</code> and{' '}
            <code>gpu-ondemand</code>, behind two queues, <code>sim-eval</code> and <code>train</code>. Every field is
            documented; every value is this dive&apos;s choice.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Value</th>
                  <th style={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>gpu-spot</code>: type and strategy
                  </td>
                  <td style={TD}>
                    <code>SPOT</code>, <code>SPOT_PRICE_CAPACITY_OPTIMIZED</code>
                  </td>
                  <td style={TD}>
                    With a strategy named, the environment needs neither <code>bidPercentage</code> nor a Spot Fleet
                    role. <Cite id="F10-9">AWS Batch API Reference, ComputeResource</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-spot</code>: instance types
                  </td>
                  <td style={TD}>Several one-GPU sizes from G families whose GPU memory fits the job</td>
                  <td style={TD}>
                    More pools to draw from. An AWS post that runs GPU jobs on Batch Spot lists g6.xlarge, g6.2xlarge
                    and g5.xlarge. <Cite id="F10-59">AWS Machine Learning Blog, transcription at scale on AWS Batch</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    Both environments: <code>minvCpus</code>
                  </td>
                  <td style={TD}>0</td>
                  <td style={TD}>
                    Scale to zero: with an empty queue no instance is held.{' '}
                    <Cite id="F10-38">AWS Batch User Guide, minvCpus in practice</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-spot</code>: <code>maxvCpus</code>
                  </td>
                  <td style={TD}>The share of the sweep you want on Spot</td>
                  <td style={TD}>
                    A full environment is the documented trigger for the next one. The ceiling counts vCPUs: a type
                    with more vCPUs per GPU buys fewer GPUs under the same number.{' '}
                    <Cite id="F10-22">AWS Batch API Reference, ComputeEnvironmentOrder</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-ondemand</code>: strategy
                  </td>
                  <td style={TD}>
                    <code>BEST_FIT_PROGRESSIVE</code>
                  </td>
                  <td style={TD}>
                    Never the default <code>BEST_FIT</code>, which waits for one type and blocks updates.{' '}
                    <Cite id="F10-8">AWS Batch API Reference, allocationStrategy</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-ondemand</code>: <code>minScaleDownDelayMinutes</code>
                  </td>
                  <td style={TD}>20, when fine-tunes and sweeps arrive in waves</td>
                  <td style={TD}>
                    The minimum. The next job finds a running instance.{' '}
                    <Cite id="F10-40">AWS Batch API Reference, ComputeScalingPolicy</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-ondemand</code>: <code>updatePolicy</code>
                  </td>
                  <td style={TD}>
                    <code>jobExecutionTimeoutMinutes</code> above the longest fine-tune
                  </td>
                  <td style={TD}>
                    The default is 30: an image update would otherwise terminate a running fine-tune after 30 minutes.{' '}
                    <Cite id="F10-16">AWS Batch API Reference, UpdatePolicy</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    Both queues: <code>jobStateTimeLimitActions</code>
                  </td>
                  <td style={TD}>
                    Cancel on <code>CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY</code>
                  </td>
                  <td style={TD}>
                    One job that cannot get its instance type would otherwise hold a FIFO queue. The wait can be set
                    from 600 to 86,400 seconds.{' '}
                    <Cite id="F10-27">AWS Batch API Reference, JobStateTimeLimitAction</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    Evaluation child: <code>retryStrategy</code>
                  </td>
                  <td style={TD}>
                    Retry on <code>Host EC2*</code>, exit on anything else
                  </td>
                  <td style={TD}>
                    A lost machine is retried; a bug fails once. When no rule matches Batch retries, hence the
                    catch-all exit.{' '}
                    <Cite id="F09-10">AWS Batch User Guide, Spot best practices</Cite>{' '}
                    <Cite id="F10-52">AWS Batch User Guide, Automated job retries</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Snippet
            title="The Spot compute environment"
            mode="adapted"
            source={
              <>
                <Cite id="F09-131">AWS Batch User Guide, Compute environment template</Cite>{' '}
                <Cite id="F10-13">AWS Batch API Reference, Ec2Configuration</Cite>
              </>
            }
            ours="the name, the SPOT type, the strategy, the two instance types, the ceiling of 16 vCPUs (four instances, the size of the figure), the GPU image type and the placeholders. The launch template, tags and desiredvCpus of the template are left out."
          >
            {COMPUTE_ENVIRONMENT}
          </Snippet>
          <Snippet
            title="The evaluation queue: Spot first, On-Demand second"
            mode="adapted"
            source={<Cite id="F10-27">AWS Batch User Guide, job queue template, and API Reference, JobStateTimeLimitAction</Cite>}
            ours="the names, the priority, the two entries of the order and the reason. The wait of 14400 seconds is the value in AWS's own example. The API takes the compute environment's ARN (Amazon Resource Name, its full identifier) where this block shows a name."
          >
            {JOB_QUEUE}
          </Snippet>
          <Snippet
            title="The job definition of one evaluation child"
            mode="adapted"
            source={
              <>
                <Cite id="F09-129">AWS Batch User Guide, Test GPU functionality, and API Reference, RegisterJobDefinition</Cite>{' '}
                <Cite id="F09-10">AWS Batch User Guide, Spot best practices, retry block</Cite>{' '}
                <Cite id="F10-63">AWS Batch User Guide, parameter substitution</Cite>
              </>
            }
            ours="the name, image, command, the vCPU and memory values, the one GPU, the 3 attempts and the timeout of 1800 seconds (30 minutes). The two retry rules are as AWS prints them."
          >
            {JOB_DEFINITION}
          </Snippet>
          <Box variant="p">
            The vCPU and memory requests follow from the instance list: both types have 4 vCPUs and one GPU, and the
            smaller has 16 GiB of memory, so the request stays under that. By our reading a larger request would
            leave one type able to run the job, and the diversification would be lost without any error.{' '}
            <Cite id="F10-7">AWS Batch User Guide, Run GPU jobs, instance table</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You know the sharp edges before one costs you a night of GPU time, each with the way to get it right.">
            What it does poorly
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>It does not pass the Spot notice on.</strong> The two minutes go by with the job unaware. Get it
              right by making every Spot job save its own progress and resume on a later attempt.{' '}
              <Cite id="F10-56">ECS Developer Guide, Draining container instances</Cite>
            </li>
            <li>
              <strong>It never preempts a container job.</strong> Priority and fair share order the jobs that are
              waiting. &quot;Quota management is the only AWS Batch scheduling algorithm to incorporate
              preemption&quot;, and it exists only for queues of SageMaker Training jobs. Get it right with separate
              queues and a ceiling per environment, so a sweep cannot occupy the GPUs a fine-tune needs.{' '}
              <Cite id="F10-34">AWS Batch User Guide, Preemption and Quota management</Cite>
            </li>
            <li>
              <strong>It hands out whole GPUs.</strong> A stage that needs a quarter of a GPU gets a whole one. Get it
              right by running several models inside one container, or by moving that stage to Kubernetes.{' '}
              <Cite id="F10-44">AWS Batch User Guide, resourceRequirements</Cite>
            </li>
            <li>
              <strong>A FIFO queue stops behind one job.</strong> When the job at the front cannot be placed, Batch
              sends a &quot;Job queue blocked&quot; event and writes the cause into the job&apos;s{' '}
              <code>statusReason</code>. Get it right with the time-limit action from the table, and treat the
              cancellation as the cue to resubmit elsewhere.{' '}
              <Cite id="F10-26">AWS Batch User Guide, Jobs stuck in a RUNNABLE status</Cite>
            </li>
            <li>
              <strong>The cold start is yours to measure.</strong> Three waits stack up before a job runs from zero:
              the instance launch, the instance&apos;s start-up script and the image pull. Since October 2026 two
              Amazon CloudWatch metrics per queue measure them: <code>JobAttemptRunnableToStartingDuration</code> for
              the wait for capacity and <code>JobAttemptStartingToRunningDuration</code> for the image pull and
              container start.{' '}
              <Cite id="F10-39">AWS Batch User Guide, Using CloudWatch Metrics with AWS Batch</Cite>
            </li>
          </ul>
          <ExpandableSection headerText="Three more edges, for multi-node jobs, images and reserved capacity">
            <ul style={LIST}>
              <li>
                <strong>Multi-node jobs restart whole.</strong> A dead node is not replaced: the launcher must treat a
                lost worker as fatal and restart from a checkpoint.{' '}
                <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>
              </li>
              <li>
                <strong>The machine image is yours to keep current.</strong> Batch does not upgrade the image of a
                compute environment after creating it; since 25 March 2026 <code>batchImageStatus</code> reports
                whether an update is available.{' '}
                <Cite id="F10-14">AWS Batch User Guide, Managed compute environments, and What&apos;s New</Cite>
              </li>
              <li>
                <strong>Reserved GPU capacity is unclear.</strong> A Capacity Block is a GPU reservation for a fixed
                window, bought ahead. An AWS post of April 2025 reaches one from Batch through a market-type field in
                the launch template. The user guide read for this dive lists instance market options among the launch
                template parameters Batch ignores. Treat that path as described by the 2025 post and not confirmed by
                the current guide.{' '}
                <Cite id="F09-17">AWS HPC Blog, How to use Capacity Blocks for ML with AWS Batch</Cite>{' '}
                <Cite id="F10-65">AWS Batch User Guide, Use Amazon EC2 launch templates with AWS Batch</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You know which neighbour takes the job Batch should not run, and what to build first.">
            Where it hands off
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Two hand-offs keep the Batch queue and change what runs behind it.</Box>
          <ul style={LIST}>
            <li>
              <strong>Batch on EKS.</strong> Amazon EKS (Elastic Kubernetes Service) is managed Kubernetes. Batch
              turns each job into a pod on nodes that it launches into your EKS cluster. It installs nothing in the cluster and marks its nodes with a taint, the Kubernetes mark that
              keeps other pods off, so Batch jobs and the cluster&apos;s other work share a control plane and never a
              node. GPUs are still whole. <Cite id="F09-19">AWS Batch User Guide, Amazon EKS compute environments</Cite>{' '}
              <Cite id="F10-61">AWS Batch User Guide, Batch-managed EKS nodes</Cite>
            </li>
            <li>
              <strong>Batch queues for SageMaker Training jobs.</strong> A service environment puts a Batch queue in
              front of training jobs that Amazon SageMaker runs. Batch owns no instances here; it queues, orders and
              submits. Such a job has one extra state, <code>SCHEDULED</code>, while SageMaker acquires capacity. This
              is the one place Batch preempts: up to 20 quota shares per queue lend idle capacity and take it back.{' '}
              <Cite id="F09-16">AWS Batch User Guide, Service environments</Cite>{' '}
              <Cite id="F10-60">AWS Batch User Guide, service job status</Cite>{' '}
              <Cite id="F10-35">AWS Batch User Guide, Quota shares and Preemption</Cite>
            </li>
          </ul>
          <Box variant="p">
            The other hand-offs leave Batch. A tightly coupled job over several nodes, or a team that already has
            scripts for Slurm, the scheduler of high-performance computing clusters, goes to section 26, AWS Parallel
            Computing Service. Many nodes for days, with failed nodes replaced and capacity reserved, go to section 27,
            Amazon SageMaker HyperPod. Fractions of a GPU, preemption between teams and always-on services go to
            section 28, Amazon EKS. Section 24 holds the capacity markets and the glue that submits jobs when data
            arrives, and section 29, Choosing, puts the four side by side.
          </Box>
          <Box variant="p">
            Your next action is small. Create one Spot compute environment with <code>minvCpus</code> 0, one queue, and
            the evaluation job definition with its <code>Host EC2*</code> retry and its timeout. Submit an array of 2,
            the smallest Batch accepts, and watch both children cross the states. Then read the two duration metrics
            for your own cold start before you size the 500.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
