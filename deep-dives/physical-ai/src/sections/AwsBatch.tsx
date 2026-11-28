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
const TASK_SENTENCE = `The second workload runs after every fine-tune and tests the new policy in simulation before the policy may drive the real arm. The policy controls a simulated ${ARM} arm that tries to ${TASK_STORY} 500 times, each time from a different random seed. One attempt at the task is called an episode, and the 500 episodes together are called the evaluation sweep. Based on the success rate over the 500 episodes, you decide whether the policy goes to the real arm.`;

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
  desc: 'The control side holds a submit box, a job queue, the scheduler and a tray of finished jobs. The capacity side holds two compute environments with one-GPU instances, Amazon S3 and the image registry, all in one network.',
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
          You call <code>SubmitJob</code> once with an array size of 500. The figure follows the first eight children,
          which enter the queue in the <code>SUBMITTED</code> state. Both compute environments have{' '}
          <code>minvCpus</code> set to 0, so no instance exists yet.
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
          <code>desiredvCpus</code> in compute environment 1 and uses the allocation strategy to choose instance types
          from the list. The children stay in <code>RUNNABLE</code> for the few minutes that a new EC2 instance takes to
          start.
        </>
      ),
      scheduler: ['8 RUNNABLE', 'raises desiredvCpus in 1'],
      instances: { '0.0': 'launching', '0.1': 'launching', '0.2': 'launching', '0.3': 'launching' },
      jobs: CHILDREN.map((id, k) => job(id, { q: 0, pos: k })),
    },
    {
      caption: (
        <>
          The instances join the ECS cluster, and Batch places four children on them. These children are in{' '}
          <code>STARTING</code> while their image is pulled from the registry. Compute environment 1 is now at its{' '}
          <code>maxvCpus</code>, which is the documented condition for scaling up the next environment. So Batch
          launches On-Demand Instances for the children that are still waiting.
        </>
      ),
      scheduler: ['4 STARTING, 4 RUNNABLE', 'environment 1 full: scales up 2'],
      instances: { '0.0': 'running', '0.1': 'running', '0.2': 'running', '0.3': 'running', '1.0': 'launching', '1.1': 'launching' },
      jobs: [...CHILDREN.slice(0, 4).map((id, k) => job(id, { g: 0, i: k })), ...CHILDREN.slice(4).map((id, k) => job(id, { q: 0, pos: k }))],
    },
    {
      caption: (
        <>
          Six children are <code>RUNNING</code>, each on one whole GPU, and the timeout of each one has started.
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
          EC2 sends a Spot interruption notice to the instance that runs child 1. The notice comes two minutes ahead, on
          a best-effort basis. Batch sets that instance to <code>DRAINING</code>, so no new job is placed on it.
          Draining does not stop the container, and as of November 2026 the documentation does not say that Batch
          signals the container.
        </>
      ),
      scheduler: ['instance of child 1: DRAINING', 'child 1 still RUNNING'],
      instances: { '0.0': 'running', '0.1': 'notice', '0.2': 'running', '0.3': 'running', '1.0': 'running', '1.1': 'running' },
      jobs: [...sixRunning(), job('6', { q: 0, pos: 0 }), job('7', { q: 0, pos: 1 })],
    },
    {
      caption: (
        <>
          Child 1 saves its own progress to Amazon S3. It can do this because its script polls the instance metadata
          for the notice, or saves on a timer. Your own code performs this step, and Batch has no part in it.
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
          EC2 terminates the instance. The attempt fails with a status reason that begins with <code>Host EC2</code>,
          and the retry rule matches it. Batch returns child 1 to <code>RUNNABLE</code> at the front of the queue, ahead
          of children 6 and 7.
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
          Compute environment 1 is below its ceiling again, so Batch launches a replacement instance there. This time,
          following the allocation strategy, Batch chose the other instance type on the list.
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
          Child 1 starts its second attempt on the new instance. <code>AWS_BATCH_JOB_ATTEMPT</code> is now 2, so the
          script loads its saved progress from Amazon S3 and continues from there.
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
          Five children exit with code 0 and reach <code>SUCCEEDED</code>. Batch places children 6 and 7 on the GPUs
          that they free in compute environment 1, which comes first in the queue&apos;s order. No job is waiting any more, so Batch removes the
          idle instances, and compute environment 2 returns to its floor of zero.
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
          Every child has succeeded, and every result is in Amazon S3. With nothing left to run, Batch brings{' '}
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
            description="AWS Batch can run two jobs of the arm's learning loop, the fine-tune of the policy and the evaluation sweep that tests each new policy in simulation, without a cluster that stays up between runs. You will learn when Batch is the right choice, how to set it up with Spot Instances for the sweep and On-Demand Instances for the fine-tune, and what fails and how you notice it."
          >
            25. AWS Batch: A Managed Queue for Independent Jobs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, matched each workload of the arm&apos;s learning loop to an AWS
            scheduler and explained the purchase options. AWS Batch is one of those schedulers, and it keeps no cluster
            running between jobs.
          </Box>
          <Box variant="p">
            Two of the loop&apos;s workloads run on Batch. The first is the per-task fine-tune, which adapts a pretrained
            policy to the {TASK_NAME} task on one GPU for a few hours. Its workload type is Long single-machine runs,
            because it is one long job that must finish. {TASK_SENTENCE}{' '}
            The workload type of the sweep is Independent tasks, because it consists of 500 short jobs that do not
            depend on each other. Batch runs both workloads, each on its own queue.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Batch fits work that splits into many independent jobs, or that keeps one GPU busy for minutes to hours, as long as the work can wait a few minutes for an instance. You will be able to tell when another service fits better, and you will see the recommended setup for the arm's two workloads."
          >
            When to use AWS Batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Batch is a managed job queue for container jobs. You describe a job once and submit it to a queue.
            Batch then starts EC2 (Elastic Compute Cloud) instances for the job, places the container on a GPU, retries
            the job if its instance is lost, and removes the instances when the queue is empty. This suits a team that
            has 500 independent simulation runs to do, has no cluster, and does not want to keep one running.
          </Box>
          <Box variant="p">
            Batch launches instances with one of two purchase options. On-Demand Instances are billed by the second
            with no commitment, and AWS does not reclaim them. Spot Instances are spare EC2 capacity that AWS can
            reclaim after a two-minute warning. <Cite id="F10-54">EC2 User Guide, Spot Instance interruption notices</Cite>
          </Box>
          <Box variant="p">
            Batch is built from ordinary AWS services. Amazon ECS (Elastic Container Service) is the AWS service that
            starts containers on instances. Batch calls its pool of capacity a compute environment. A compute
            environment consists of resources that Batch creates in your own account: an EC2 Auto Scaling group or a
            Spot Fleet that launches the instances, and an ECS cluster that the instances join. Batch takes full control
            of these resources, so you should not run anything else on them.{' '}
            <Cite id="F10-1">AWS Batch User Guide, Managed compute environments</Cite>
          </Box>
          <Box variant="p">Use Batch when the work matches one of these cases.</Box>
          <ul style={LIST}>
            <li>
              <strong>Independent tasks.</strong> The work splits into many jobs that do not depend on each other, such
              as an evaluation sweep, a batch of simulation runs or synthetic video generated overnight. AWS&apos;s
              post on running NVIDIA Cosmos video models puts this offline work on Batch, because Batch &quot;provisions
              GPU compute resources only when inference jobs execute, then terminates instances upon completion&quot;.{' '}
              <Cite id="F10-69">AWS HPC Blog, Running NVIDIA Cosmos world foundation models on AWS</Cite>
            </li>
            <li>
              <strong>Long single-machine runs.</strong> One GPU job runs for minutes to hours, a few times a week. The
              per-task fine-tune is an example.
            </li>
            <li>
              <strong>Work that can lose its instance.</strong> A job that is short enough to rerun, or that saves
              checkpoints, can run on Spot Instances.
            </li>
          </ul>
          <Box variant="p">Use another service when one of these is true.</Box>
          <ul style={LIST}>
            <li>
              <strong>Jobs last seconds or must start at once.</strong> For such jobs, the Batch guide warns that
              &quot;the overhead to schedule the batch job might take longer than the runtime of the job itself&quot;.{' '}
              <Cite id="F10-42">AWS Batch User Guide, When to use AWS Batch</Cite>
            </li>
            <li>
              <strong>Teams need preemption.</strong> Preemption means that a scheduler stops a running job to give its
              GPUs to another job. Batch does not stop a running container job to make room for another one.{' '}
              <Cite id="F10-34">AWS Batch User Guide, Preemption and Quota management</Cite>
            </li>
            <li>
              <strong>A job needs a fraction of a GPU.</strong> Batch reserves whole physical GPUs for each job.{' '}
              <Cite id="F10-44">AWS Batch User Guide, job definition parameters and EKS GPU job definitions</Cite>
            </li>
            <li>
              <strong>Multi-node training.</strong> Batch can run one job across several instances, but only on
              On-Demand Instances, and it does not replace an instance that fails. That makes it a poor fit for a
              training run that spans many instances for days.{' '}
              <Cite id="F09-8">AWS Batch User Guide, compute environment considerations for multi-node jobs</Cite>{' '}
              <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>
            </li>
          </ul>
          <Box variant="p">For the arm&apos;s two workloads, the recommended setup has four parts.</Box>
          <ul style={LIST}>
            <li>
              <strong>The evaluation sweep runs on Spot Instances.</strong> You submit the sweep once, and Batch splits it
              into many short child jobs. They run on a Spot compute environment, and an On-Demand compute environment
              is the second choice in the same queue. Batch&apos;s guidance is to use Spot Instances when &quot;The
              runtime for your jobs is typically 30 minutes or less&quot;.{' '}
              <Cite id="F10-11">AWS Batch User Guide, On-Demand or Spot</Cite>
            </li>
            <li>
              <strong>The fine-tune runs on On-Demand Instances.</strong> The same guidance recommends On-Demand
              Instances for a job that runs &quot;more than an hour&quot; and &quot;can&apos;t tolerate
              interruptions&quot;. A fine-tune can run on Spot Instances only if it saves checkpoints often and resumes
              from them.{' '}
              <Cite id="F10-11">AWS Batch User Guide, On-Demand or Spot</Cite>
            </li>
            <li>
              <strong>A job is retried only when its instance was lost.</strong> When an attempt fails, Batch records
              a status reason. A retry rule matches a status reason that begins with <code>Host EC2</code>, which
              means that AWS reclaimed the instance. Any other failure ends the job at once.{' '}
              <Cite id="F09-10">AWS Batch User Guide, Spot best practices and automated job retries</Cite>
            </li>
            <li>
              <strong>Each workload has its own queue.</strong> The sweep and the fine-tune wait in separate queues, and
              the fine-tune&apos;s queue has the higher priority.{' '}
              <Cite id="F10-20">AWS Batch API Reference, CreateJobQueue, priority</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="To configure Batch, you need to know four kinds of objects: job definitions, jobs, job queues and compute environments. You will also see the states a job passes through and the settings that control how many instances run and which instance types Batch launches."
          >
            The parts of a Batch setup
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A Batch setup has four kinds of objects. You create three of them once, and you submit the fourth each time
            you run work.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Job definition.</strong> A job definition is the template of a job. It names the container image
              and the command, and it states what one run needs in a block called <code>resourceRequirements</code>:
              vCPUs (virtual CPUs), memory and GPUs. The GPU value is a whole number of physical GPUs that Batch
              reserves for the container. <Cite id="F10-44">AWS Batch User Guide, resourceRequirements</Cite>
            </li>
            <li>
              <strong>Job.</strong> A job is one submission of a job definition to a queue. An array job is one
              submission that creates many child jobs from the same definition. Each child reads its index, starting at
              0, from the environment variable <code>AWS_BATCH_JOB_ARRAY_INDEX</code>, and the evaluation uses that
              index to choose its random seed. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
            </li>
            <li>
              <strong>Job queue.</strong> A job queue is where jobs wait. It sends its jobs to up to three compute
              environments, which it tries in order. <Cite id="F10-21">AWS Batch API Reference, computeEnvironmentOrder</Cite>
            </li>
            <li>
              <strong>Compute environment.</strong> A compute environment is the pool of instances behind a queue. It
              lists the instance types that Batch may launch, and it sets the smallest and the largest number of vCPUs
              that may run. <Cite id="F10-3">AWS Batch API Reference, ComputeResource, the three vCPU members</Cite>
            </li>
          </ul>
          <Box variant="p">
            Two blocks of the job definition control what happens when a job goes wrong: <code>retryStrategy</code>{' '}
            and <code>timeout</code>. By default, a job gets one attempt with no retry, and it has no timeout unless you
            set <code>attemptDurationSeconds</code>. So change both defaults before you run the first GPU job.{' '}
            <Cite id="F10-46">AWS Batch User Guide, Job timeouts</Cite>{' '}
            <Cite id="F10-52">AWS Batch User Guide, Automated job retries</Cite>
          </Box>

          <Box variant="h3">The states a job passes through</Box>
          <Box variant="p">
            Batch reports the progress of each job as a state. A job that succeeds passes through up to six states.
            The seventh state, <code>FAILED</code>, is the other possible end.
          </Box>
          <Figure
            cites="F10-23 F10-24 F10-25 F10-46 F10-52"
            caption="Read the diagram from the top down. PENDING has a dashed border because a job with no dependency skips it. The notes on the right mark the three points that matter when you configure a job."
          >
            <div style={NARROW}>
              <JobStatesDiagram />
            </div>
          </Figure>
          <Box variant="p">Two of these states change how you configure a job.</Box>
          <ul style={LIST}>
            <li>
              <strong>
                A job can wait in <code>RUNNABLE</code> indefinitely.
              </strong>{' '}
              While an instance launches for it, a job is in the <code>RUNNABLE</code> state. If no capacity is
              available, the job can stay in that state indefinitely. The recommended configuration below adds a queue
              setting that ends this wait. <Cite id="F10-23">AWS Batch User Guide, Job states</Cite>
            </li>
            <li>
              <strong>The image pull does not count toward the timeout.</strong> Batch pulls the container image while
              the job is in <code>STARTING</code>, and the timeout starts only at <code>RUNNING</code>. So the minutes
              that a large simulator image takes to pull do not count against the job&apos;s time limit.{' '}
              <Cite id="F10-24">AWS Batch User Guide, Job states, STARTING and RUNNING</Cite>
            </li>
          </ul>
          <Box variant="p">
            When the timeout expires, Batch sends the container SIGTERM, the Unix signal that asks a process to stop.
            Batch sends SIGKILL 30 seconds later, and the process cannot refuse that signal. A job that is stopped by
            its timeout is not retried. <Cite id="F10-46">AWS Batch User Guide, Job timeouts</Cite>
          </Box>

          <Box variant="h3">How many instances a compute environment runs</Box>
          <Box variant="p">
            Each compute environment has a <code>type</code>, which sets the purchase option. The type is{' '}
            <code>EC2</code> for On-Demand Instances or <code>SPOT</code> for Spot Instances. The other types are{' '}
            <code>ECS_MANAGED_INSTANCES</code>, described further down, and two types for AWS Fargate, which cannot run
            GPU jobs.{' '}
            <Cite id="F10-2">AWS Batch API Reference, ComputeResource, type</Cite>{' '}
            <Cite id="F09-1">AWS Batch User Guide, When to use Fargate</Cite>
          </Box>
          <Box variant="p">
            Batch sizes a compute environment in vCPUs, even when the resource that your jobs run short of is GPUs.
            Three numbers set the size.
          </Box>
          <Figure
            cites="F10-3 F10-4"
            caption="The diagram draws the three numbers as one gauge. You set the two ends, and Batch moves the marker between them as jobs arrive and finish. The drawing is an illustration, not a measurement."
          >
            <div style={NARROW}>
              <VcpuGaugeDiagram />
            </div>
          </Figure>
          <ul style={LIST}>
            <li>
              <strong>
                <code>minvCpus</code>
              </strong>{' '}
              is the number of vCPUs that the environment keeps running when it has no jobs. A value of 0 lets the
              environment scale to zero. A value above 0 keeps a warm pool: instances that stay running and ready for
              the next job.{' '}
              <Cite id="F10-3">AWS Batch API Reference, ComputeResource, the three vCPU members</Cite>{' '}
              <Cite id="F10-38">AWS Batch User Guide, minvCpus in practice</Cite>
            </li>
            <li>
              <strong>
                <code>maxvCpus</code>
              </strong>{' '}
              is the ceiling: the largest number of vCPUs that the environment may run. Batch may go above it by at
              most one instance.{' '}
              <Cite id="F09-4">AWS Batch User Guide, allocation strategies, maxvCpus</Cite>
            </li>
            <li>
              <strong>
                <code>desiredvCpus</code>
              </strong>{' '}
              is the current target number of vCPUs, which Batch raises and lowers with queue demand. The guide
              recommends that you do not set it, and Batch refuses a request to lower it.{' '}
              <Cite id="F10-4">AWS Batch User Guide, Perform scaling updates</Cite>
            </li>
          </ul>
          <Box variant="p">
            To keep instances ready for the next burst of jobs, set <code>minScaleDownDelayMinutes</code>. Batch then
            keeps each instance for that long after its last job, so the next job does not wait for an instance to
            launch. You can set the delay from 20 minutes to 1 week. You pay for the idle instances that the delay
            keeps. The delay never keeps a Spot Instance that AWS has reclaimed.{' '}
            <Cite id="F10-40">AWS Batch API Reference, ComputeScalingPolicy</Cite>{' '}
            <Cite id="F09-13">AWS What&apos;s New, configurable scale down delay</Cite>
          </Box>

          <Box variant="h3">Which instance types Batch launches</Box>
          <Box variant="p">
            Batch chooses the instances it launches from the environment&apos;s <code>instanceTypes</code> list. The
            allocation strategy is the rule that Batch follows when its first choice of type is not available. The default
            strategy is <code>BEST_FIT</code>. It picks the lowest-cost type that fits the job, waits for that type, and
            blocks later infrastructure updates. To avoid these limits, set the strategy yourself on every GPU
            environment.{' '}
            <Cite id="F10-8">AWS Batch API Reference, ComputeResource, allocationStrategy</Cite>{' '}
            <Cite id="F09-3">AWS Batch User Guide, Instance type allocation strategies</Cite>
          </Box>
          <Box variant="p">
            The ready-made lists (<code>optimal</code>, <code>default_x86_64</code> and <code>default_arm64</code>)
            contain no GPU family, so name the GPU families or sizes in the list yourself as well. If the list of a GPU
            environment also contains families without GPUs, a GPU job can get stuck in <code>RUNNABLE</code>.{' '}
            <Cite id="F10-5">AWS Batch API Reference, ComputeResource, instanceTypes</Cite>{' '}
            <Cite id="F10-6">AWS Batch User Guide, Run GPU jobs</Cite>
          </Box>

          <Box variant="h3">How a queue chooses a compute environment</Box>
          <Box variant="p">
            A queue tries its compute environments in ascending order of their <code>order</code> value. All the
            compute environments of one queue must use the same CPU architecture. With this ordered list, called{' '}
            <code>computeEnvironmentOrder</code>, one queue can use Spot Instances first and On-Demand Instances
            second. <Cite id="F10-21">AWS Batch API Reference, computeEnvironmentOrder</Cite>
          </Box>
          <Box variant="p">
            Batch moves down the list only in two documented cases. It scales up a later compute environment only when
            the earlier ones &quot;have reached their maxvCpus&quot;, or when no instance type in them can satisfy the
            job at the front of the queue.{' '}
            <Cite id="F10-22">AWS Batch API Reference, ComputeEnvironmentOrder</Cite>
          </Box>
          <Box variant="p">
            A queue with no scheduling policy is FIFO (first in, first out). The job at the front goes next, and if
            Batch cannot place it, it blocks the jobs behind it. A queue also has a <code>priority</code>. The priority
            matters only between queues that share a compute environment, and Batch evaluates the queue with the higher
            number first. <Cite id="F09-14">AWS Batch User Guide, job scheduling and fair share</Cite>{' '}
            <Cite id="F10-26">AWS Batch User Guide, Jobs stuck in a RUNNABLE status</Cite>{' '}
            <Cite id="F10-20">AWS Batch API Reference, CreateJobQueue</Cite>
          </Box>

          <ExpandableSection headerText="Fair-share scheduling, for a queue that several teams share">
            <SpaceBetween size="s">
              <Box variant="p">
                A queue that several people or agents share can use fair-share scheduling instead of FIFO. To turn it
                on, you attach a scheduling policy to the queue. Every job then carries a <code>shareIdentifier</code>, a
                label that says whose work it is. The jobs with the same identifier form one share. The scheduler takes
                the next job from the share that has used the least compute recently.{' '}
                <Cite id="F09-14">AWS Batch User Guide, job scheduling and fair share</Cite>{' '}
                <Cite id="F10-31">AWS Batch User Guide, share identifiers, and API Reference, FairsharePolicy</Cite>
              </Box>
              <Box variant="p">
                The scheduler measures the usage of a share as <code>T * weightFactor</code>. T is the vCPU usage of
                the share over a look-back window. The weight factor is 1.0 by default and scales that usage, so a lower
                weight makes the usage look smaller and gives the share more compute. Decide on fair share before you
                create the queue, because a FIFO queue cannot have a policy added later.{' '}
                <Cite id="F10-31">AWS Batch User Guide, share identifiers, and API Reference, FairsharePolicy</Cite>{' '}
                <Cite id="F10-30">AWS Batch API Reference, CreateJobQueue, schedulingPolicyArn</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Multi-node parallel jobs">
            <SpaceBetween size="s">
              <Box variant="p">
                A multi-node parallel job is one job that spans several instances, for training that needs more GPUs
                than one instance has. Its <code>nodeProperties</code> block sets the number of nodes and names a main
                node. The main node starts first, and the other nodes start once it is <code>RUNNING</code>.{' '}
                <Cite id="F10-49">AWS Batch User Guide, Node groups</Cite>{' '}
                <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>
              </Box>
              <Box variant="p">
                Three limits apply. A job can have up to 1,000 nodes by default, which is the ECS cluster instance limit
                and can be raised. The whole job uses one instance type. The job runs on On-Demand Instances only.{' '}
                <Cite id="F10-49">AWS Batch User Guide, Node groups</Cite>{' '}
                <Cite id="F09-8">AWS Batch User Guide, compute environment considerations for multi-node jobs</Cite>
              </Box>
              <Box variant="p">
                If a node other than the main node fails, Batch takes no action on the other nodes in the job. So your
                training code has to notice the failure and end the job.{' '}
                <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Two other kinds of compute environment">
            <ul style={LIST}>
              <li>
                <strong>ECS Managed Instances.</strong> AWS manages the machine image, the patching and the instance
                lifecycle, including for GPU instances. In exchange, you give up multi-node jobs, custom machine images,
                the choice of allocation strategy and the warm pool. ECS drains every instance 14 days after launch. In a
                queue, On-Demand environments of this kind must come before Spot ones.{' '}
                <Cite id="F09-2">AWS Batch User Guide, When to use Amazon ECS Managed Instances</Cite>{' '}
                <Cite id="F10-18">AWS Batch User Guide, ECS Managed Instances draining and job queues</Cite>
              </li>
              <li>
                <strong>Unmanaged.</strong> Batch schedules jobs into an empty ECS cluster, and you launch and scale the
                instances yourself. <Cite id="F10-19">AWS Batch User Guide, Unmanaged compute environments</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <ExpandableSection headerText="Limits and defaults, for lookup">
            <ul style={LIST}>
              <li>
                <strong>Job definition size and overrides.</strong> A job definition can be at most 24 KiB. A
                submission can override its retry strategy, timeout, resources and parameters.{' '}
                <Cite id="F10-43">AWS Batch User Guide, job definition parameters and service quotas</Cite>
              </li>
              <li>
                <strong>Shortest timeout.</strong> The smallest value of <code>attemptDurationSeconds</code> is 60
                seconds. <Cite id="F10-46">AWS Batch User Guide, Job timeouts</Cite>
              </li>
              <li>
                <strong>Array size.</strong> An array job has 2 to 10,000 child jobs. The timeout applies to each child,
                and the parent job stays in <code>PENDING</code> while its children run.{' '}
                <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>{' '}
                <Cite id="F10-23">AWS Batch User Guide, Job states</Cite>
              </li>
              <li>
                <strong>Job history.</strong> Batch keeps the state of finished jobs for at least 7 days. It may not keep
                it longer, so keep the record of each experiment in your own storage.{' '}
                <Cite id="F10-25">AWS Batch User Guide, Job states, SUCCEEDED and FAILED</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You will be able to adapt two compute environments, two queues and a job definition for the sweep and the fine-tune. For each example value, you also see the AWS advice or the documented behaviour behind it."
          >
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">This setup follows four pieces of AWS advice.</Box>
          <ul style={LIST}>
            <li>
              <strong>Spot allocation strategy.</strong> Two pages of the Batch guide disagree. The page on allocation
              strategies says: &quot;We recommend that you use SPOT_PRICE_CAPACITY_OPTIMIZED rather than
              SPOT_CAPACITY_OPTIMIZED in most instances.&quot; The page on Spot best practices says: &quot;Choose the
              SPOT_CAPACITY_OPTIMIZED allocation strategy&quot;, and adds &quot;If you&apos;re concerned about
              interruptions, this is a suitable choice.&quot; Both pages say &quot;Diversify instance types&quot;. This
              setup uses <code>SPOT_PRICE_CAPACITY_OPTIMIZED</code> and follows the shared advice with a list of
              several instance types.{' '}
              <Cite id="F10-10">AWS Batch User Guide, allocation strategies and Spot best practices</Cite>
            </li>
            <li>
              <strong>Spot price cap.</strong> The field <code>bidPercentage</code> caps the Spot price as a percentage
              of the On-Demand price. The API reference says: &quot;For most use cases, we recommend leaving this field
              empty.&quot;{' '}
              <Cite id="F10-9">AWS Batch API Reference, ComputeResource, bidPercentage</Cite>
            </li>
            <li>
              <strong>Retries.</strong> The Spot best-practices page says: &quot;we recommend that you set at least 1-3
              automated retries.&quot; <Cite id="F10-53">AWS Batch User Guide, Spot best practices</Cite>
            </li>
            <li>
              <strong>Job length on Spot Instances.</strong> The same guide says: &quot;We advise against running jobs
              that take an hour or more when using Amazon EC2 Spot instances&quot;.{' '}
              <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
            </li>
          </ul>
          <Box variant="p">
            The setup below follows that advice. It has two compute environments, <code>gpu-spot</code> and{' '}
            <code>gpu-ondemand</code>, behind two queues: <code>sim-eval</code> for the sweep and <code>train</code> for
            the fine-tune. AWS documents every field in the table. The values are example choices for the arm&apos;s
            workloads, not AWS defaults.
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
                    With this strategy set, the environment needs neither <code>bidPercentage</code> nor a Spot Fleet
                    role. <Cite id="F10-9">AWS Batch API Reference, ComputeResource</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-spot</code>: instance types
                  </td>
                  <td style={TD}>Several one-GPU sizes from G instance families whose GPU memory fits the job</td>
                  <td style={TD}>
                    More instance types give Batch more pools of Spot capacity to draw from. An AWS post that runs GPU
                    jobs on Batch with Spot Instances lists g6.xlarge, g6.2xlarge and g5.xlarge.{' '}
                    <Cite id="F10-59">AWS Machine Learning Blog, transcription at scale on AWS Batch</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    Both environments: <code>minvCpus</code>
                  </td>
                  <td style={TD}>0</td>
                  <td style={TD}>
                    The environment scales to zero, so no instance runs while the queue is empty.{' '}
                    <Cite id="F10-38">AWS Batch User Guide, minvCpus in practice</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-spot</code>: <code>maxvCpus</code>
                  </td>
                  <td style={TD}>Enough vCPUs for the part of the sweep that you want on Spot Instances</td>
                  <td style={TD}>
                    Batch scales up the next environment in the queue when this one reaches its ceiling. The ceiling
                    counts vCPUs, so an instance type with more vCPUs per GPU gives you fewer GPUs under the same
                    ceiling.{' '}
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
                    This avoids the default <code>BEST_FIT</code>, which waits for one type and blocks updates.{' '}
                    <Cite id="F10-8">AWS Batch API Reference, allocationStrategy</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>gpu-ondemand</code>: <code>minScaleDownDelayMinutes</code>
                  </td>
                  <td style={TD}>20, when fine-tunes and sweeps arrive in waves</td>
                  <td style={TD}>
                    This is the minimum value. With it, a job that arrives within 20 minutes of the last one finds an
                    instance that is already running.{' '}
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
                    The default is 30. With the default, an update of the machine image would terminate a running
                    fine-tune after 30 minutes. <Cite id="F10-16">AWS Batch API Reference, UpdatePolicy</Cite>
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
                    This action cancels a job that has waited in <code>RUNNABLE</code> at the front of the queue for a
                    set time. Without it, one job that cannot get its instance type would hold up a FIFO queue. You can
                    set the wait from 600 to 86,400 seconds.{' '}
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
                    With these rules, a lost instance leads to a retry, and an error in your own code ends the job after
                    one attempt. If no rule matches a failure, Batch retries the job, so the last rule exits on every
                    other reason.{' '}
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
            ours="the name, the SPOT type, the strategy, the two instance types, the ceiling of 16 vCPUs (four instances, the size of the figure further down), the GPU image type and the placeholders. The launch template, tags and desiredvCpus of AWS's template are left out."
          >
            {COMPUTE_ENVIRONMENT}
          </Snippet>
          <Snippet
            title="The evaluation queue: Spot first, On-Demand second"
            mode="adapted"
            source={<Cite id="F10-27">AWS Batch User Guide, job queue template, and API Reference, JobStateTimeLimitAction</Cite>}
            ours="the names, the priority, the two entries of the order and the reason. The wait of 14400 seconds is the value in AWS's own example. Where this block shows a compute environment's name, the API takes its ARN (Amazon Resource Name), which is its full identifier."
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
            You choose the vCPU and memory requests from the instance list. Both instance types have 4 vCPUs and one
            GPU, and the smaller one has 16 GiB of memory, so the memory request stays below that. A larger request
            would leave only one of the two types able to run the job. You would then lose the benefit of two instance
            types, and probably no error would tell you.{' '}
            <Cite id="F10-7">AWS Batch User Guide, Run GPU jobs, instance table</Cite>
          </Box>
          <Box variant="p">
            Size each child job so that the scheduling overhead stays small. Batch&apos;s guidance is to group short
            tasks so that each job runs for 3 to 5 minutes. If one episode takes only seconds, give each child several
            seeds and make the array smaller to match. On Spot Instances, keep each child under the 30 minutes that the
            Spot guidance names. <Cite id="F10-42">AWS Batch User Guide, When to use AWS Batch</Cite>{' '}
            <Cite id="F09-11">AWS Batch User Guide, Spot best practices</Cite>
          </Box>

          <Box variant="h3">
            Running the fine-tune on On-Demand Instances, or on Spot Instances with frequent checkpoints
          </Box>
          <Box variant="p">
            The per-task fine-tune is one job that runs for hours. Batch&apos;s guidance recommends On-Demand Instances
            for a job whose runtime is &quot;more than an hour&quot; and that &quot;can&apos;t tolerate
            interruptions&quot;. So you submit the fine-tune to a second queue, <code>train</code>, whose only compute
            environment is <code>gpu-ondemand</code>. The <code>train</code> queue has a higher <code>priority</code>{' '}
            than <code>sim-eval</code>, so Batch evaluates the fine-tune first on the capacity that the two queues
            share. The priority only sets the order of the jobs that are waiting. It never stops an evaluation child
            that is already running. <Cite id="F10-11">AWS Batch User Guide, On-Demand or Spot</Cite>{' '}
            <Cite id="F10-20">AWS Batch API Reference, CreateJobQueue, priority</Cite>{' '}
            <Cite id="F10-34">AWS Batch User Guide, Preemption</Cite>
          </Box>
          <Box variant="p">
            The job definition of the fine-tune differs from that of an evaluation child in three places.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>A checkpoint volume that outlives the instance.</strong> This can be an S3 Files volume (
              <code>s3filesVolumeConfiguration</code>), which presents an S3 bucket as a file system inside the
              container. It can also be a volume on Amazon EFS (Elastic File System), a shared network file system.{' '}
              <Cite id="F10-62">AWS Batch User Guide, Amazon S3 Files volumes and Amazon EFS volumes</Cite>
            </li>
            <li>
              <strong>Shared memory for the data loader.</strong> <code>sharedMemorySize</code> sets the size of{' '}
              <code>/dev/shm</code>. A training job usually needs it, because data-loader workers pass batches to the
              training process through shared memory. <Cite id="F10-45">AWS Batch User Guide, linuxParameters</Cite>
            </li>
            <li>
              <strong>A timeout sized in hours.</strong> The fine-tune passes through the same states as an evaluation
              child, but it spends hours in <code>RUNNING</code>.
            </li>
          </ul>
          <Box variant="p">
            For a sense of scale, the first post of AWS&apos;s blog series on embodied AI fine-tunes NVIDIA&apos;s
            GR00T robot model on Batch. The post reports that 6000 training steps usually take up to 2 hours on a
            g6e.4xlarge instance.{' '}
            <Cite id="F09-114">AWS Physical AI Blog, embodied AI series, part 1</Cite>
          </Box>
          <Box variant="p">
            If you put a fine-tune on Spot Instances, it must save checkpoints on a timer and resume from the last one
            whenever <code>AWS_BATCH_JOB_ATTEMPT</code> is above 1.{' '}
            <Cite id="F09-10">AWS Batch User Guide, automated job retries</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Watch eight evaluation jobs pass through a queue with Spot Instances first and On-Demand Instances behind. You will see which steps Batch performs when AWS reclaims a Spot Instance, and which step your own code must perform."
          >
            How the sweep runs, and what happens when AWS reclaims a Spot Instance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Last night&apos;s fine-tune left a policy checkpoint in Amazon S3. You start the sweep that tests it with
            one request.
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
            With the <code>arrayProperties</code> field, Batch creates 500 child jobs, and the parent job waits in{' '}
            <code>PENDING</code> while they run. <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
          <Box variant="p">
            The figure shows the recommended setup running the sweep. The control side holds the submission, the job
            queue, the scheduler and a tray of finished jobs. The capacity side, in your account, holds the two compute
            environments behind the queue, with Spot first and On-Demand second. Every instance has one GPU, and a job
            token sits on the GPU that its job reserved.
          </Box>
          <Box variant="p">
            Below the instances are the two stores that every instance can reach. Amazon S3 holds results and
            checkpoints. Amazon ECR (Elastic Container Registry) holds the job&apos;s container image. Everything runs
            in your VPC (Virtual Private Cloud), which is your private network on AWS.
          </Box>
          <Box variant="p">
            Both compute environments start with no instances. To keep the picture small, compute environment 1 has a
            ceiling of 16 vCPUs, which is four instances of 4 vCPUs each, and compute environment 2 has a ceiling of 8.
            The step to watch is the Spot interruption notice: the warning that EC2 sends two minutes before it reclaims
            a Spot Instance. <Cite id="F10-7">AWS Batch User Guide, Run GPU jobs, instance table</Cite>{' '}
            <Cite id="F10-54">EC2 User Guide, Spot Instance interruption notices</Cite>
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="an evaluation sweep on Spot with On-Demand behind"
            cites="F09-1 F09-5 F09-10 F09-13 F09-130 F09-131 F10-1 F10-3 F10-7 F10-8 F10-21 F10-22 F10-23 F10-24 F10-25 F10-37 F10-38 F10-44 F10-46 F10-52 F10-53 F10-54 F10-55 F10-56 F10-57 F10-537"
            caption={
              <>
                Press Play or Step to follow the run. A white token is waiting or starting, a blue token is running, an
                orange token has been sent back to the queue, and a green token has finished. The yellow diamond is a
                checkpoint, here the progress that child 1 saved. The instance counts and ceilings are sized to fit the
                picture, and the order of events follows the documentation. In step 6, the job&apos;s own code acts,
                not Batch. The Batch best-practices page for Spot says that a retried job goes to the front of the
                queue, while the job states page says only that the job returns to <code>RUNNABLE</code>.{' '}
                <Cite id="F10-537">AWS Batch User Guide, Spot best practices</Cite> The figure is an illustration, not a
                measurement.
              </>
            }
          />
          <Box variant="p">
            <strong>
              On Spot Instances, your job has to save its own progress, because Batch does not save it when the notice
              arrives.
            </strong>{' '}
            The notice gives two minutes of warning. Batch drains the instance, and as far as the documentation shows,
            the container keeps running untouched until the instance is gone. The ECS guide says that standalone tasks
            on a draining instance are &quot;unaffected&quot;. We infer that a Batch job runs as such a task, but the
            Batch guide does not state this. The only signals that the Batch guide documents are the ones that the
            timeout sends.{' '}
            <Cite id="F10-56">ECS Developer Guide, Draining container instances, and the ECS agent settings</Cite>
          </Box>
          <Box variant="p">
            A job on Spot Instances can save its progress in two ways. It can save on a timer, so that at most one
            interval of work is lost. It can also poll the instance metadata for the notice, which EC2 recommends
            checking every 5 seconds. As of November 2026, the Batch and ECS documentation does not say whether the
            container gets a signal when the instance is terminated. So do not build the job around such a signal. Do
            not count on the full two minutes either, because EC2 sends notices on a best-effort basis.{' '}
            <Cite id="F10-54">EC2 User Guide, Spot Instance interruption notices</Cite>{' '}
            <Cite id="F10-56">ECS Developer Guide, Draining container instances, and the ECS agent settings</Cite>
          </Box>
          <Box variant="p">
            Batch turns Spot Instance draining on by default for Spot compute environments that were created or updated
            from 9 October 2026. The ECS agent, the ECS software on each instance, still has draining off by default.
            So an environment that nobody has changed since before that date may not drain.{' '}
            <Cite id="F10-55">AWS Batch User Guide, Spot best practices, and the ECS agent settings table</Cite>
          </Box>
          <Box variant="p">
            <strong>In step 3, work moved to On-Demand Instances because compute environment 1 was full.</strong> A full
            environment is one of the two documented conditions for scaling up the next environment. A Spot environment
            that is below its ceiling but cannot get Spot capacity matches neither condition. The two API reference
            pages that describe the ordered list do not say whether Batch then scales up the On-Demand environment, and
            we have not tested it. Until AWS
            documents that case, treat the ceiling of the Spot environment as the one setting that you can rely on to
            move work to On-Demand Instances.{' '}
            <Cite id="F10-22">AWS Batch API Reference, ComputeEnvironmentOrder</Cite>
          </Box>
          <Box variant="p">
            To handle a shortage of Spot capacity, the Batch guide describes a pattern with two queues. A rule in Amazon
            EventBridge, the AWS event bus, catches the interrupted job. An AWS Lambda function or an AWS Step Functions
            workflow then resubmits the job to a queue on On-Demand Instances.{' '}
            <Cite id="F10-12">AWS Batch User Guide, On-Demand or Spot</Cite>
          </Box>
          <ExpandableSection headerText="One child of the sweep as text, state by state">
            <SpaceBetween size="s">
              <Box variant="p">
                The list follows child 7 of the sweep from submission to result, through one Spot interruption. The
                index of child 7 is also its random seed.
              </Box>
              <ol style={LIST}>
                <li>
                  <strong>
                    <code>SUBMITTED</code>.
                  </strong>{' '}
                  The child is in the queue, and the scheduler has not looked at it yet.{' '}
                  <Cite id="F10-23">AWS Batch User Guide, Job states</Cite>
                </li>
                <li>
                  <strong>
                    <code>RUNNABLE</code>.
                  </strong>{' '}
                  The child depends on no other job, so it skips <code>PENDING</code>. The Spot environment has no
                  instances, so Batch raises its <code>desiredvCpus</code>. An instance launches, runs its start-up
                  script and joins the ECS cluster. The guide says that a new EC2 instance takes a few minutes and gives no more precise
                  figure. <Cite id="F10-37">AWS Batch API Reference, desiredvCpus</Cite>{' '}
                  <Cite id="F10-39">AWS Batch User Guide, causes of jobs stuck in RUNNABLE</Cite>
                </li>
                <li>
                  <strong>
                    <code>STARTING</code>.
                  </strong>{' '}
                  Batch has placed the child on the instance, and the simulator image is pulled from Amazon ECR. This
                  time does not count toward the timeout.{' '}
                  <Cite id="F10-24">AWS Batch User Guide, Job states, STARTING</Cite>
                </li>
                <li>
                  <strong>
                    <code>RUNNING</code>, attempt 1.
                  </strong>{' '}
                  The script reads index 7 from the environment, loads the policy and runs the episode on its GPU. It
                  writes the work it finishes to Amazon S3. The timeout counts from here.{' '}
                  <Cite id="F10-24">AWS Batch User Guide, Job states, RUNNING</Cite>
                </li>
                <li>
                  <strong>
                    Still <code>RUNNING</code>, two minutes left.
                  </strong>{' '}
                  EC2 sends the Spot interruption notice, and Batch drains the instance. Assume nothing tells the container.
                  The script polls the instance metadata, sees the notice and saves its progress.{' '}
                  <Cite id="F10-55">AWS Batch User Guide, Spot best practices</Cite>{' '}
                  <Cite id="F10-56">ECS Developer Guide, Draining container instances</Cite>
                </li>
                <li>
                  <strong>
                    Back to <code>RUNNABLE</code>.
                  </strong>{' '}
                  EC2 terminates the instance, and the attempt fails with a status reason that begins with{' '}
                  <code>Host EC2</code>. The retry rule matches, so child 7 returns to the front of the queue. If the
                  script had crashed instead, the failure would match the catch-all rule, and the child would go to{' '}
                  <code>FAILED</code> at once. <Cite id="F10-57">synthesis of the retry, state and scale-down entries</Cite>{' '}
                  <Cite id="F10-537">AWS Batch User Guide, Spot best practices, front of the job queue</Cite>{' '}
                  <Cite id="F09-10">AWS Batch User Guide, Spot best practices and automated job retries</Cite>
                </li>
                <li>
                  <strong>
                    <code>STARTING</code>, then <code>RUNNING</code>, attempt 2.
                  </strong>{' '}
                  On a replacement instance, the script finds <code>AWS_BATCH_JOB_ATTEMPT</code> set to 2 and resumes
                  from what it saved. <Cite id="F10-52">AWS Batch User Guide, Automated job retries</Cite>
                </li>
                <li>
                  <strong>
                    <code>SUCCEEDED</code>.
                  </strong>{' '}
                  The child exits with code 0. The outcome of the episode is one object in Amazon S3, and the log is in
                  Amazon CloudWatch Logs under <code>/aws/batch/job</code>.{' '}
                  <Cite id="F10-25">AWS Batch User Guide, Job states, SUCCEEDED and FAILED</Cite>
                </li>
              </ol>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Several failures on Batch produce no error at first: a job waits without end, or a container loses its instance without being told. For each one, you learn what you see and how to set things up so that it does not cost you a night of GPU time."
          >
            What fails, and how you notice it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>
                A job waits in <code>RUNNABLE</code> and blocks the queue.
              </strong>{' '}
              When Batch cannot place the job at the front of a FIFO queue, every job behind it waits too. You notice
              it because Batch sends a &quot;Job queue blocked&quot; event and writes the cause into the job&apos;s{' '}
              <code>statusReason</code>, for example <code>CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY</code>. To keep the
              queue moving, set the time-limit action from the recommended configuration, and treat the cancellation as
              the signal to resubmit the job elsewhere.{' '}
              <Cite id="F10-26">AWS Batch User Guide, Jobs stuck in a RUNNABLE status</Cite>
            </li>
            <li>
              <strong>AWS reclaims a Spot Instance before the job saves its work.</strong> No AWS documentation we found
              says that Batch passes the Spot notice on to the container, so assume the job is not told. You notice it afterwards,
              when the attempt fails with a status reason that begins with <code>Host EC2</code>. To lose as little
              work as possible, make every Spot job save its own progress and resume on a later attempt.{' '}
              <Cite id="F10-56">ECS Developer Guide, Draining container instances</Cite>{' '}
              <Cite id="F09-10">AWS Batch User Guide, Spot best practices and automated job retries</Cite>
            </li>
            <li>
              <strong>A job runs past its timeout.</strong> Batch sends SIGTERM, then SIGKILL 30 seconds later, and the
              job is not retried. So set the timeout above the longest normal run: minutes for an evaluation child,
              hours for the fine-tune. <Cite id="F10-46">AWS Batch User Guide, Job timeouts</Cite>
            </li>
            <li>
              <strong>An infrastructure update stops a running fine-tune.</strong> When you update a compute
              environment&apos;s infrastructure, for example its machine image, a running job gets 30 minutes by default
              and is then terminated. To protect the fine-tune, set <code>jobExecutionTimeoutMinutes</code> in{' '}
              <code>updatePolicy</code> above the longest fine-tune.{' '}
              <Cite id="F10-16">AWS Batch API Reference, UpdatePolicy</Cite>
            </li>
            <li>
              <strong>One failed child fails the whole sweep.</strong> The parent array job succeeds only if every child
              succeeds. So when the arm fails the task in an episode, the evaluation script should record that outcome
              as a result in Amazon S3 and exit with code 0. Keep non-zero exit codes for real errors.{' '}
              <Cite id="F10-25">AWS Batch User Guide, Job states, SUCCEEDED and FAILED</Cite>{' '}
              <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
            </li>
            <li>
              <strong>The cold start takes longer than you planned.</strong> Three waits add up before a job runs on an
              environment that is at zero: the instance launch, the instance&apos;s start-up script and the image pull.
              Since October 2026, Amazon CloudWatch has two metrics per queue that measure them.{' '}
              <code>JobAttemptRunnableToStartingDuration</code> measures the wait for capacity, and{' '}
              <code>JobAttemptStartingToRunningDuration</code> measures the image pull and the container start.{' '}
              <Cite id="F10-39">AWS Batch User Guide, Using CloudWatch Metrics with AWS Batch</Cite>
            </li>
          </ul>

          <Box variant="h3">Limits to design around</Box>
          <ul style={LIST}>
            <li>
              <strong>Batch never preempts a container job.</strong> Priority and fair share only set the order of the
              jobs that are waiting. The Batch guide says that &quot;Quota management is the only AWS Batch scheduling
              algorithm to incorporate preemption&quot;, and quota management exists only for queues of SageMaker
              Training jobs. To keep a sweep from occupying the GPUs that a fine-tune needs, use separate queues and a
              ceiling on each compute environment.{' '}
              <Cite id="F10-34">AWS Batch User Guide, Preemption and Quota management</Cite>
            </li>
            <li>
              <strong>Batch hands out whole GPUs.</strong> A stage that needs a quarter of a GPU gets a whole one. To
              share one GPU, run several models inside one container, or move that stage to Kubernetes.{' '}
              <Cite id="F10-44">AWS Batch User Guide, resourceRequirements</Cite>
            </li>
          </ul>
          <ExpandableSection headerText="Three more limits: multi-node jobs, machine images and reserved capacity">
            <ul style={LIST}>
              <li>
                <strong>A multi-node job restarts as a whole.</strong> Batch does not replace a failed node. So the
                training launcher must treat a lost node as fatal and restart the job from a checkpoint.{' '}
                <Cite id="F10-50">AWS Batch User Guide, Job lifecycle for multi-node parallel jobs</Cite>
              </li>
              <li>
                <strong>You keep the machine image current.</strong> Batch does not upgrade the machine image of a
                compute environment after it creates the environment. Since 25 March 2026,{' '}
                <code>batchImageStatus</code> reports whether an update is available.{' '}
                <Cite id="F10-14">AWS Batch User Guide, Managed compute environments, and What&apos;s New</Cite>
              </li>
              <li>
                <strong>Reserved GPU capacity through Batch is unclear.</strong> A Capacity Block is a GPU reservation
                for a fixed window, bought in advance. An AWS post of April 2025 uses one from Batch by setting a
                market-type field in the launch template. As of November 2026, however, the Batch user guide lists
                instance market options among the launch template fields that Batch ignores. So treat this method as
                described in the 2025 post but not confirmed by the current guide.{' '}
                <Cite id="F09-17">AWS HPC Blog, How to use Capacity Blocks for ML with AWS Batch</Cite>{' '}
                <Cite id="F10-65">AWS Batch User Guide, Use Amazon EC2 launch templates with AWS Batch</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="VAMS is an open-source AWS solution that already runs Isaac Lab training, GR00T fine-tuning, Cosmos models and Gaussian splatting as Batch jobs. You will see how it runs them and how its defaults compare with the setup in this section, so that you can decide whether to start from it."
          >
            Running robot-learning jobs on Batch with VAMS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Visual Asset Management System (VAMS) is an open-source solution from AWS. It stores robot models,
            simulation scenes, datasets, videos and other files in Amazon S3 as versioned assets, and it runs
            processing pipelines on them. You deploy it into your own AWS account with the AWS CDK (Cloud Development
            Kit), which defines AWS resources in code. After that, you update and secure it yourself, as with any other
            code in your account. Its README calls it &quot;near-production-grade at its default&quot; and asks you to
            check with your security team before you use it in production.{' '}
            <Cite id="F09-135">VAMS v2.6.7, README</Cite>
          </Box>
          <Box variant="p">
            VAMS keeps the assets and runs the workflows, and other AWS services supply the compute. For the GPU
            pipelines, that compute is AWS Batch. Each pipeline runs inside a workflow in AWS Step Functions. The
            workflow submits a Batch job and then waits until the job reports that it has finished. VAMS then
            registers the output as new files or new versions of the asset that the job read. So a trained policy
            appears as a new version of the robot asset that it was trained from, and you can trace it back to that
            asset.{' '}
            <Cite id="F09-142">AWS Physical AI Blog, VAMS 2.6 release</Cite>{' '}
            <Cite id="F09-136">VAMS v2.6.7, pipelines overview</Cite>{' '}
            <Cite id="F09-141">AWS Physical AI Blog, Isaac Lab in VAMS</Cite>
          </Box>
          <Box variant="p">
            Four of its pipelines cover jobs of the arm&apos;s learning loop, and all four run on Batch with GPU
            instances. <Cite id="F09-136">VAMS v2.6.7, pipelines overview</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Isaac Lab training and evaluation.</strong> In release 2.6.7, each run is one Batch job on one
              instance with one GPU, from the G6, G6e or G5 families. A training run gets 8 hours, including the wait
              for an instance and the image pull, and an evaluation run gets 2 hours. Checkpoints go to Amazon EFS. An
              AWS post from January 2026 describes multi-node training for this pipeline, but the job definition in
              release 2.6.7 runs on a single node.{' '}
              <Cite id="F09-137">VAMS v2.6.7, Isaac Lab pipeline docs and CDK code</Cite>{' '}
              <Cite id="F09-141">AWS Physical AI Blog, Isaac Lab in VAMS</Cite>
            </li>
            <li>
              <strong>GR00T fine-tuning.</strong> The pipeline fine-tunes GR00T-N1.5-3B on a dataset in LeRobot v2.1
              format, as one Batch job on one GPU. Its default settings train the action head without LoRA and keep the
              backbone frozen. VAMS estimates 60 to 120 minutes for 6000 training steps on a g6e.4xlarge, which agrees
              with the up to 2 hours in the AWS post cited earlier in this section. This default fine-tune needs a GPU
              with more than 24 GB of memory. So take the g5.12xlarge out of the instance list of release 2.6.7,
              because VAMS found that its 24 GB GPUs run out of memory at the first step.{' '}
              <Cite id="F09-144">VAMS v2.6.7, GR00T container and job definition code</Cite>{' '}
              <Cite id="F09-138">VAMS v2.6.7, GR00T fine-tuning pipeline docs</Cite>{' '}
              <Cite id="F09-114">AWS Physical AI Blog, embodied AI series, part 1</Cite>{' '}
              <Cite id="F09-145">VAMS development branch, GR00T fine-tuning pipeline docs</Cite>{' '}
              The container builds NVIDIA&apos;s Isaac-GR00T code at a commit of September 2025, and it loads the model
              with that code&apos;s N1.5 class. So before the pipeline can fine-tune GR00T N1.7 on the LeRobot v3.0
              datasets that this dive uses, you would rebuild the container with newer training code and test it.{' '}
              <Cite id="F09-144">VAMS v2.6.7, GR00T container and job definition code</Cite>{' '}
              <Cite id="F09-138">VAMS v2.6.7, GR00T fine-tuning pipeline docs</Cite>
            </li>
            <li>
              <strong>Cosmos world models.</strong> The Cosmos 3 pipeline runs Cosmos3-Nano split across the four L40S
              GPUs of a g6e.12xlarge, and Cosmos3-Super on instances with eight 80 GB GPUs. Section 11, Augmentation
              and Synthetic Data, explains why Nano does not fit on one 48 GB card.{' '}
              <Cite id="F09-139">VAMS v2.6.7, Cosmos 3 pipeline docs</Cite>
            </li>
            <li>
              <strong>Gaussian splatting.</strong> The pipeline builds a splat model of a scene from a set of photos or
              a video, in one Batch job with one GPU and a 12-hour timeout. Section 14, Sim-to-Real and Real-to-Sim,
              explains what the splats are used for.{' '}
              <Cite id="F09-140">VAMS v2.6.7, Gaussian splatting pipeline docs</Cite>
            </li>
          </ul>
          <ExpandableSection headerText="Where the GR00T documentation of release 2.6.7 differs from its code">
            <Box variant="p">
              The documentation of release 2.6.7 calls LoRA the default, and it gives 20 to 40 minutes for 6000 steps
              on the four GPUs of a g6e.12xlarge. The code of the same release sets the default LoRA rank to 0, which
              means no LoRA. Its job definition reserves one GPU, whatever number of training processes you set.
              VAMS&apos;s newer documentation, on a branch that is not yet released, agrees with the code. An open VAMS
              issue also reports that GR00T jobs on a multi-GPU instance can all run on the host&apos;s first GPU. So
              plan on the one-GPU time, even on a g6e.12xlarge.{' '}
              <Cite id="F09-138">VAMS v2.6.7, GR00T fine-tuning pipeline docs</Cite>{' '}
              <Cite id="F09-144">VAMS v2.6.7, GR00T container and job definition code</Cite>{' '}
              <Cite id="F09-145">VAMS development branch, GR00T fine-tuning pipeline docs</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">The defaults of VAMS differ from the setup in this section in two ways.</Box>
          <ul style={LIST}>
            <li>
              <strong>On-Demand Instances only.</strong> None of the GPU compute environments in release 2.6.7
              requests Spot capacity, so the jobs run on On-Demand Instances. That matches the On-Demand option for a
              fine-tune described earlier in this section. To run an evaluation sweep on Spot Instances, you would add
              a Spot compute environment to the CDK code, and give the job definition the retry rule for a reclaimed
              instance that this section describes.{' '}
              <Cite id="F09-143">VAMS v2.6.7, CDK code of the compute environments</Cite>
            </li>
            <li>
              <strong>A cold start for the first job.</strong> By default, the Isaac Lab and GR00T compute environments
              scale to zero. So a job that finds no running instance first waits for one to launch, and then for its container image
              to be pulled. The GR00T documentation gives 5 to 10 minutes for the launch and 5 to 8 minutes for the
              pull, and the Isaac Lab image is about 10 GB. The Isaac Lab and GR00T pipelines each have an option that
              keeps GPU instances running to skip this wait, and you pay for those instances while they are idle.{' '}
              <Cite id="F09-138">VAMS v2.6.7, GR00T fine-tuning pipeline docs</Cite>{' '}
              <Cite id="F09-137">VAMS v2.6.7, Isaac Lab pipeline docs and CDK code</Cite>{' '}
              <Cite id="F09-141">AWS Physical AI Blog, Isaac Lab in VAMS</Cite>
            </li>
          </ul>
          <Box variant="p">
            VAMS fits a team that wants its robot models, datasets and trained policies in one versioned store with a
            web interface, and whose models match the pipelines that VAMS ships. If you need newer model versions, an
            evaluation sweep on Spot Instances or multi-node training, you either change the VAMS code or build the
            setup that this section describes.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Some work fits another AWS service better than Batch. You will know which service takes which job, and what to build first on Batch."
          >
            Where Batch hands off to other services
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Two options keep the Batch queue but change what runs behind it.</Box>
          <ul style={LIST}>
            <li>
              <strong>Batch on Amazon EKS.</strong> Amazon EKS (Elastic Kubernetes Service) is managed Kubernetes.
              Batch turns each job into a pod and runs it on nodes that it launches into your EKS cluster. Batch
              installs nothing in the cluster. It marks its nodes with a taint, which is a Kubernetes mark that keeps
              other pods off a node. So Batch jobs and the cluster&apos;s other work share a control plane but never a
              node. GPUs are still allocated whole.{' '}
              <Cite id="F09-19">AWS Batch User Guide, Amazon EKS compute environments</Cite>{' '}
              <Cite id="F10-61">AWS Batch User Guide, Batch-managed EKS nodes</Cite>
            </li>
            <li>
              <strong>Batch queues for SageMaker Training jobs.</strong> A service environment puts a Batch queue in
              front of training jobs that Amazon SageMaker runs. Batch owns no instances here: it queues the jobs,
              orders them and submits them. Such a job has one extra state, <code>SCHEDULED</code>, while SageMaker
              acquires capacity. This is the one place where Batch preempts jobs. A queue can have up to 20 quota
              shares, which are virtual queues nested inside it. A quota share can lend its idle capacity to other
              shares and take it back when it needs it.{' '}
              <Cite id="F09-16">AWS Batch User Guide, Service environments</Cite>{' '}
              <Cite id="F10-60">AWS Batch User Guide, service job status</Cite>{' '}
              <Cite id="F10-35">AWS Batch User Guide, Quota shares and Preemption</Cite>
            </li>
          </ul>
          <Box variant="p">For the following kinds of work, use another service instead of Batch.</Box>
          <ul style={LIST}>
            <li>
              <strong>Tightly coupled jobs and existing Slurm scripts.</strong> A tightly coupled job is one whose nodes
              exchange data while they run. Slurm is the scheduler that high-performance computing clusters commonly
              use. For such a job, or for a team that already has Slurm scripts, see section 26, AWS Parallel Computing
              Service.
            </li>
            <li>
              <strong>Multi-node training that runs for days.</strong> For training that needs failed nodes replaced
              and capacity reserved, see section 27, Amazon SageMaker HyperPod.
            </li>
            <li>
              <strong>Fractions of a GPU, preemption between teams and always-on services.</strong> For these, see
              section 28, Amazon EKS.
            </li>
          </ul>
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, covers the purchase options and the services that submit jobs
            when new data arrives. Section 29, Choosing, compares the four schedulers side by side.
          </Box>
          <Box variant="p">
            To get started, build a small version of the setup first. Create one Spot compute environment with{' '}
            <code>minvCpus</code> set to 0, one queue, and the evaluation job definition with its{' '}
            <code>Host EC2*</code> retry rule and its timeout. Submit an array of 2
            child jobs, the smallest array that Batch accepts, and watch both children pass through the states. Then
            read the two duration metrics to measure your own cold start before you size the sweep of 500.{' '}
            <Cite id="F09-5">AWS Batch User Guide, Array jobs</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
