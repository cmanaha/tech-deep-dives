import type { CSSProperties } from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Snippet } from '../components/Blocks';
import { Cite, Toy } from '../components/Cite';
import { ClusterFigure } from '../components/Cluster';
import type { ClusterSpec, ClusterStep, JobToken } from '../components/Cluster';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/** The thread task, stated once for this section. */
const TASK = `the ${ARM} arm that must ${TASK_STORY}`;

const INK = '#16191f';
const MUTED = '#5f6b7a';
const LINE = '#8d99a8';

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };
const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };

/* ------------------------------------------------------------------------ */
/* The cluster figure: one queue, two compute node groups, one login group.  */
/* ------------------------------------------------------------------------ */

type Instances = ClusterStep['instances'];

/** The login node is a static group: it is up in every step. */
const LOGIN: Instances = { '2.0': 'running' };

const ARRAY_IDS = ['1', '2', '3', '4'];
const arrayAt = (at: (k: number) => JobToken['at'], tone?: JobToken['tone']): JobToken[] =>
  ARRAY_IDS.map((id, k) => ({ id: `a${id}`, label: id, at: at(k), tone }));
const trainRunning: JobToken[] = [
  { id: 'ta', label: 'T', at: { g: 0, i: 0 }, tone: 'running' },
  { id: 'tb', label: 'T', at: { g: 0, i: 1 }, tone: 'running' },
];

const SPEC: ClusterSpec = {
  title: 'An AWS PCS cluster running a two-node training job and a job array on Spot nodes',
  desc: 'Jobs go from the login node into one Slurm partition. The managed controller allocates nodes in two compute node groups, PCS launches the instances, and every node mounts the same file system.',
  submit: { label: 'Login node: sbatch', sub: 'scripts live on the shared file system' },
  queues: [{ label: 'Queue arm (a Slurm partition)', sub: 'jobs wait here: PD, then CF' }],
  scheduler: { label: 'Managed Slurm controller (Small)', sub: 'allocates nodes; PCS launches them' },
  done: { label: 'Finished (listed by sacct)' },
  groups: [
    {
      label: 'Compute node group: train',
      sub: ['min 0, max 2; one subnet, EFA, placement group', 'jobs pick it with --constraint=train'],
      market: 'on-demand',
      gpus: 4,
      places: 2,
      type: 'g6e.12xlarge',
    },
    {
      label: 'Compute node group: eval-spot',
      sub: ['min 0, max 4; price-capacity-optimized', 'jobs pick it with --constraint=spot'],
      market: 'spot',
      gpus: 1,
      places: 4,
      type: 'g6e.xlarge',
    },
    {
      label: 'Compute node group: login',
      sub: ['min 1, max 1; attached to no queue'],
      market: 'static',
      gpus: 0,
      places: 1,
      type: 't3.large',
    },
  ],
  stores: [
    { label: 'FSx for Lustre', sub: '/shared' },
    { label: 'Amazon EFS', sub: '/home' },
  ],
  network: 'One VPC; EFA between the two train nodes',
  jobNoun: 'one job; T holds 2 nodes',
  steps: [
    {
      caption: (
        <>
          Before any job is submitted, the cluster consists of the managed controller and one login node. Both
          compute node groups have a minimum of 0, so they hold node names but no instances. The login node holds a
          training script (T) and an array of four evaluation runs (1 to 4).
        </>
      ),
      scheduler: ['no jobs in the queue', 'both compute groups at 0'],
      instances: { ...LOGIN },
      jobs: [{ id: 'ta', label: 'T', at: { submit: 0 } }, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          <code>sbatch</code> puts T in the queue. Slurm allocates two named nodes of the train group to T, and PCS
          launches an EC2 instance for each name. The scaling log prints LAUNCHED with the reason
          SCHEDULER_REQUESTED, and <code>squeue</code> shows the job as CF (configuring).
        </>
      ),
      scheduler: ['T: CF (configuring)', '2 nodes LAUNCHED'],
      instances: { ...LOGIN, '0.0': 'launching', '0.1': 'launching' },
      jobs: [{ id: 'ta', label: 'T', at: { q: 0, pos: 0 } }, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          One node has booted, mounted the shared file system from its launch template&apos;s user data, registered and
          turned ACTIVE. T still shows CF, because a job starts only when every node it asked for is available. If a
          node never registers, Slurm marks it down after about 30 minutes.
        </>
      ),
      scheduler: ['T: CF, 1 of 2 nodes ACTIVE', 'waiting for the second node'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'launching' },
      jobs: [{ id: 'ta', label: 'T', at: { q: 0, pos: 0 } }, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          Both nodes are ACTIVE and T runs (state R). The job holds both nodes completely, so its token is drawn once
          on each node. The two nodes exchange data over EFA inside a cluster placement group, and the launch
          template sets both.
        </>
      ),
      scheduler: ['T: R on 2 nodes'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running' },
      jobs: [...trainRunning, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          You submit the array with <code>--requeue</code>. Slurm allocates four nodes of the Spot group, and
          PCS launches them. Meanwhile, T writes a checkpoint, drawn as a diamond.
        </>
      ),
      scheduler: ['T: R', 'array 1-4: CF, 4 nodes LAUNCHED'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running', '1.0': 'launching', '1.1': 'launching', '1.2': 'launching', '1.3': 'launching' },
      jobs: [...trainRunning, ...arrayAt((k) => ({ q: 0, pos: k }))],
      checkpoints: [{ id: 'ckT', at: { g: 0, i: 0 } }],
    },
    {
      caption: (
        <>
          The four Spot nodes are ACTIVE, and each one runs one array task on its GPU. The checkpoint of T is a file on
          FSx for Lustre, which every node and the login node mount at the same path. Task 3 also keeps a progress
          file there, drawn as the second diamond.
        </>
      ),
      scheduler: ['T: R', 'array 1-4: R'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running', '1.0': 'running', '1.1': 'running', '1.2': 'running', '1.3': 'running' },
      jobs: [...trainRunning, ...arrayAt((k) => ({ g: 1, i: k }), 'running')],
      checkpoints: [
        { id: 'ckT', at: { store: 0, pos: 0 } },
        { id: 'ck3', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          EC2 reclaims the Spot instance under task 3. PCS logs the node as TERMINATED with the reason
          EXTERNALLY_TERMINATED and releases it to be replaced, and task 3 returns to the queue. No drain step is
          drawn, because PCS documents none for a Spot interruption notice. The requeue is an inference from how PCS
          describes an expiring Capacity Block.
        </>
      ),
      scheduler: ['3: requeued, pending', 'node EXTERNALLY_TERMINATED'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running', '1.0': 'running', '1.1': 'running', '1.3': 'running' },
      jobs: [
        ...trainRunning,
        { id: 'a1', label: '1', at: { g: 1, i: 0 }, tone: 'running' },
        { id: 'a2', label: '2', at: { g: 1, i: 1 }, tone: 'running' },
        { id: 'a3', label: '3', at: { q: 0, pos: 0 }, tone: 'requeued' },
        { id: 'a4', label: '4', at: { g: 1, i: 3 }, tone: 'running' },
      ],
      checkpoints: [
        { id: 'ckT', at: { store: 0, pos: 0 } },
        { id: 'ck3', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          On Slurm 25.11 or later, a requeued job becomes eligible to run again after 5 seconds by default. At its
          next scaling pass, PCS launches a replacement instance for the node. Tasks 1 and 2 finish, and the idle
          timer starts on their two nodes.
        </>
      ),
      scheduler: ['3: CF, 1 node LAUNCHED', '1 and 2 finished'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running', '1.0': 'running', '1.1': 'running', '1.2': 'launching', '1.3': 'running' },
      jobs: [
        ...trainRunning,
        { id: 'a1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'a2', label: '2', at: { done: 1 }, tone: 'done' },
        { id: 'a3', label: '3', at: { q: 0, pos: 0 }, tone: 'requeued' },
        { id: 'a4', label: '4', at: { g: 1, i: 3 }, tone: 'running' },
      ],
      checkpoints: [
        { id: 'ckT', at: { store: 0, pos: 0 } },
        { id: 'ck3', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          Task 3 starts again from the top of its script. The script reads its progress file from the shared file
          system and continues, so resuming is the script&apos;s work. Task 4 finishes. The two nodes that sat idle
          for 600 seconds are terminated, with the reason SCHEDULER_REQUESTED.
        </>
      ),
      scheduler: ['3: R, resumed from /shared', '2 idle nodes TERMINATED'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running', '1.2': 'running', '1.3': 'running' },
      jobs: [
        ...trainRunning,
        { id: 'a1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'a2', label: '2', at: { done: 1 }, tone: 'done' },
        { id: 'a3', label: '3', at: { g: 1, i: 2 }, tone: 'running' },
        { id: 'a4', label: '4', at: { done: 2 }, tone: 'done' },
      ],
      checkpoints: [
        { id: 'ckT', at: { store: 0, pos: 0 } },
        { id: 'ck3', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          T and task 3 finish. No job is pending, so the remaining nodes sit idle while{' '}
          <code>scaleDownIdleTimeInSeconds</code> counts down. It is 600 seconds by default, and on Slurm 25.11 or
          later you can override it for each compute node group.
        </>
      ),
      scheduler: ['all jobs finished', 'idle timers running'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running', '1.2': 'running' },
      jobs: [
        { id: 'a1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'a2', label: '2', at: { done: 1 }, tone: 'done' },
        { id: 'a4', label: '4', at: { done: 2 }, tone: 'done' },
        { id: 'a3', label: '3', at: { done: 3 }, tone: 'done' },
        { id: 'ta', label: 'T', at: { done: 4 }, tone: 'done' },
      ],
      checkpoints: [
        { id: 'ckT', at: { store: 0, pos: 0 } },
        { id: 'ck3', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          Both compute node groups are back at zero instances. The controller and the login node remain, and so do
          the checkpoints and results on the file system. The next <code>sbatch</code> starts from this state.
        </>
      ),
      scheduler: ['no jobs in the queue', 'both compute groups at 0'],
      instances: { ...LOGIN },
      jobs: [
        { id: 'a1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'a2', label: '2', at: { done: 1 }, tone: 'done' },
        { id: 'a4', label: '4', at: { done: 2 }, tone: 'done' },
        { id: 'a3', label: '3', at: { done: 3 }, tone: 'done' },
        { id: 'ta', label: 'T', at: { done: 4 }, tone: 'done' },
      ],
      checkpoints: [
        { id: 'ckT', at: { store: 0, pos: 0 } },
        { id: 'ck3', at: { store: 0, pos: 1 } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Two sets of states, side by side: the job in squeue, the node in the log. */
/* ------------------------------------------------------------------------ */

const STATE_ROWS: { job: string; jobNote: string; node: string; nodeNote: string; live: boolean }[] = [
  { job: 'PD', jobNote: 'pending', node: 'no instance yet', nodeNote: 'the node is only a name', live: false },
  { job: 'CF', jobNote: 'configuring', node: 'LAUNCHED', nodeNote: 'PCS asked EC2 for the instance', live: true },
  { job: 'CF', jobNote: 'configuring', node: 'REGISTERED', nodeNote: 'the PCS agent joined the cluster', live: true },
  { job: 'R', jobNote: 'running', node: 'ACTIVE', nodeNote: 'slurmd is up and accepts jobs', live: true },
  { job: 'ended', jobNote: 'node now idle', node: 'TERMINATED', nodeNote: 'after 600 idle seconds', live: false },
];

function StatesDiagram() {
  const rowH = 58;
  const top = 44;
  const H = top + STATE_ROWS.length * rowH + 8;
  return (
    <div style={NARROW}>
      <svg viewBox={`0 0 400 ${H}`} role="img" aria-labelledby="aws-pcs-states-title" style={{ width: '100%', height: 'auto' }}>
        <title id="aws-pcs-states-title">Job states in squeue beside node states in the PCS scaling log</title>
        <desc>
          Five rows from top to bottom in time order. Left: the state of the job. Right: the state of one of its
          nodes.
        </desc>
        <rect x="0" y="0" width="400" height={H} fill="#fbfbfd" />
        <text x="14" y="20" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
          The job
        </text>
        <text x="14" y="36" fontFamily="sans-serif" fontSize="12" fill={MUTED}>
          in squeue
        </text>
        <text x="150" y="20" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
          One of its nodes
        </text>
        <text x="150" y="36" fontFamily="sans-serif" fontSize="12" fill={MUTED}>
          in the PCS scaling log
        </text>
        {STATE_ROWS.map((r, i) => {
          const y = top + i * rowH;
          return (
            <g key={r.node}>
              {i > 0 && <line x1="68" y1={y - 10} x2="68" y2={y} stroke={LINE} strokeWidth="1.6" />}
              {i > 0 && <line x1="268" y1={y - 10} x2="268" y2={y} stroke={LINE} strokeWidth="1.6" />}
              <rect x="10" y={y} width="116" height={rowH - 10} rx="6" fill={r.job === 'R' ? '#e8f1fb' : '#ffffff'} stroke={r.job === 'R' ? '#1f5fa8' : LINE} strokeWidth="1.3" />
              <text x="20" y={y + 20} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
                {r.job}
              </text>
              <text x="20" y={y + 37} fontFamily="sans-serif" fontSize="12" fill={MUTED}>
                {r.jobNote}
              </text>
              <rect
                x="146"
                y={y}
                width="244"
                height={rowH - 10}
                rx="6"
                fill={r.node === 'ACTIVE' ? '#f3faf5' : '#ffffff'}
                stroke={r.node === 'ACTIVE' ? '#1e7b3a' : LINE}
                strokeWidth="1.3"
                strokeDasharray={r.live ? undefined : '5 4'}
              />
              <text x="156" y={y + 20} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
                {r.node}
              </text>
              <text x="156" y={y + 37} fontFamily="sans-serif" fontSize="12" fill={MUTED}>
                {r.nodeNote}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Snippets                                                                  */
/* ------------------------------------------------------------------------ */

const TRAIN_SCRIPT = `#!/bin/bash
#SBATCH -J wm-train
#SBATCH -o /shared/logs/wm-train.%j.out
#SBATCH --exclusive
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=1
#SBATCH --constraint=train
#SBATCH --requeue

srun python train_world_model.py --checkpoint-dir /shared/ckpt/wm --resume`;

const SUBMIT_LINES = `sbatch -p arm train.sh
squeue --job <id>

sbatch -p arm --array=1-50 --gres=gpu:1 --constraint=spot --requeue eval.sh`;

const CREATE_CLUSTER = `aws pcs create-cluster --region {{region}} \\
    --cluster-name arm-lab \\
    --scheduler type=SLURM,version=26.05 \\
    --size SMALL \\
    --networking subnetIds={{subnet-ExampleId1}},securityGroupIds={{sg-ExampleId1}} \\
    --slurm-configuration scaleDownIdleTimeInSeconds=600,accounting='{mode=STANDARD}'`;

const CREATE_SPOT_GROUP = `aws pcs create-compute-node-group --region {{region}} \\
    --cluster-identifier arm-lab \\
    --compute-node-group-name eval-spot \\
    --subnet-ids {{subnet-ExampleID1}} \\
    --custom-launch-template id={{lt-ExampleID1}},version='{{launch-template-version}}' \\
    --iam-instance-profile-arn {{arn:InstanceProfile}} \\
    --purchase-option SPOT \\
    --scaling-configuration minInstanceCount=0,maxInstanceCount=4 \\
    --instance-configs instanceType=g6e.xlarge \\
    --slurm-configuration 'slurmCustomSettings=[{parameterName=Features,parameterValue=spot}]'`;

const LUSTRE_USER_DATA = `MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/cloud-config; charset="us-ascii"

runcmd:
- amazon-linux-extras install -y lustre={{latest}}
- mkdir -p /{{mount-point-directory}}
- mount -t lustre {{filesystem-id}}.fsx.{{region-code}}.amazonaws.com@tcp:/{{mount-name}} /{{mount-point-directory}}

--==MYBOUNDARY==--`;

const EFA_TEMPLATE = `{
    "Placement": {
        "GroupId": "pg-{{PlacementGroupId1}}"
    },
    "NetworkInterfaces": [
        {
            "DeviceIndex": 0,
            "InterfaceType": "efa",
            "NetworkCardIndex": 0,
            "SubnetId": "subnet-{{SubnetId1}}",
            "Groups": [
                "sg-{{SecurityGroupId1}}",
                "sg-{{EfaSecGroupId}}"
            ]
        },
        {
            "DeviceIndex": 1,
            "InterfaceType": "efa",
            "NetworkCardIndex": 1,
            "SubnetId": "subnet-{{SubnetId1}}"
            "Groups": ["sg-{{EfaSecGroupId}}"]
        }
    ]
}`;

/* ------------------------------------------------------------------------ */
/* The section                                                               */
/* ------------------------------------------------------------------------ */

export function AwsPcs() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="AWS Parallel Computing Service (PCS) runs the Slurm job scheduler for you, and it can keep EC2 instances running only while jobs need them. You will be able to decide when PCS is the right service for a physical AI workload, set up its compute node groups, queues and purchase options, and notice when a node or a job fails."
          >
            26. AWS Parallel Computing Service: Managed Slurm for Multi-Node Jobs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Slurm is a job scheduler that is widely used in high-performance computing (HPC). HPC is the field that
            runs simulations and model training across many machines at once. You write a job as a shell script and
            submit it with the <code>sbatch</code> command. Slurm then decides when the job runs and on which
            machines. The Slurm process that makes this decision is called the controller, and it holds the list of
            waiting jobs. Each machine that runs jobs is called a compute node.
          </Box>
          <Box variant="p">
            Running Slurm yourself means keeping the controller machine running and patched, and usually paying for
            compute nodes that wait between jobs. AWS Parallel Computing Service (PCS) splits this work between AWS
            and you. AWS runs the controller. You define three kinds of object: a cluster, its queues and its compute
            node groups. A compute node group describes the EC2 instances that run the jobs. Jobs wait in a queue, and
            the scheduler that places them also launches the instances they run on.{' '}
            <Cite id="F10-200">AWS PCS User Guide, Concepts in AWS PCS</Cite>
          </Box>
          <Box variant="p">
            The example used throughout is a pair of jobs for {TASK}. The first job trains a world model on two GPU
            nodes. A world model is a model that learns to predict what the arm&apos;s cameras will show next. The
            second job is a set of evaluation runs on Spot Instances.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="PCS fits jobs that need several GPU nodes at the same time, and teams whose training code already runs as Slurm scripts. You can check whether your workload fits PCS and, if it does not, which AWS service to use instead."
          >
            When to choose PCS for a physical AI workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Choose PCS</strong> when your training code already runs as <code>sbatch</code> scripts, or when
            a job needs several GPU nodes that must all start together. A job of the second kind belongs to the
            Multi-node training workload type from section 24, Orchestrating Physical AI on AWS. PCS also suits you
            when you want those nodes to exist only while jobs run. A compute node group with a minimum of 0
            instances scales up from zero when jobs arrive, and back down to zero after they finish.{' '}
            <Cite id="F10-208">AWS PCS User Guide, Creating a compute node group</Cite>
          </Box>
          <Box variant="p">
            <strong>Choose another service</strong> in these cases:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Your work is packaged as container images, and you do not want a cluster to maintain.</strong>{' '}
              AWS Batch runs this kind of work, and no controller is billed between runs. See section 25, AWS Batch.
            </li>
            <li>
              <strong>You want a pool of GPU nodes that is held, health-checked and repaired for you.</strong> Amazon
              SageMaker HyperPod does this, and it resumes jobs after a node fault. See section 27, Amazon SageMaker
              HyperPod.
            </li>
            <li>
              <strong>You run long-running services or Kubernetes operators, or you share GPUs between pods.</strong>{' '}
              Amazon EKS fits this work, and it also has a documented sequence for handling a Spot interruption. See
              section 28, Amazon EKS.
            </li>
            <li>
              <strong>Your pipeline runs only a few hours a week.</strong> The PCS controller has its own hourly fee,
              and you pay it whether or not jobs run. <Cite id="F10-240">AWS PCS pricing page</Cite>
            </li>
          </ul>
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, explains the purchase options and the workflow tools that
            submit jobs to a scheduler. Section 29, Choosing, compares all four services on the same job.
          </Box>
          <Box variant="p">
            A workflow tool can also submit jobs to PCS without a shell session, through the managed Slurm REST API.
            The API accepts jobs over HTTP on port 6820, but only from inside the cluster&apos;s VPC. A VPC (virtual
            private cloud) is your private network in AWS.{' '}
            <Cite id="F10-229">AWS PCS User Guide, Slurm REST API in AWS PCS</Cite>
          </Box>
          <ExpandableSection headerText="Coming from AWS ParallelCluster: how its boot scripts map to PCS">
            <SpaceBetween size="s">
              <Box variant="p">
                AWS ParallelCluster is AWS&apos;s other way to build a Slurm cluster. Both services can run your own
                scripts while a node boots. PCS calls these scripts node lifecycle actions and runs each one at a
                named stage of the boot. The <code>OnNodeStart</code> hook of ParallelCluster corresponds to the{' '}
                <code>nodeBootstrapped</code> stage in PCS, and <code>OnNodeConfigured</code> corresponds to{' '}
                <code>nodeReady</code>. <code>OnNodeUpdated</code> has no equivalent in PCS. ParallelCluster runs these
                scripts at every boot, while PCS runs them only at a node&apos;s first boot unless you set them to{' '}
                <code>EVERY_BOOT</code>. <Cite id="F10-243">AWS PCS User Guide, Node lifecycle action examples</Cite>
              </Box>
              <Box variant="p">
                Compared with ParallelCluster, PCS adds two things: AWS patches the controller for you, and you can
                upgrade the cluster&apos;s Slurm major version in place. As of November 2026, we found no AWS page
                that says which of the two services to choose.{' '}
                <Cite id="F10-203">AWS PCS User Guide, Slurm versions in AWS PCS</Cite>{' '}
                <Cite id="F10-204">AWS PCS User Guide, Update the scheduler version</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A PCS cluster combines a few Slurm concepts with a few AWS objects. Once you know what each one does, you can follow every setting in the recommended configuration and the worked example."
          >
            How a PCS cluster is built
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Besides the controller and the compute nodes, Slurm has a few more terms that you need for PCS:</Box>
          <ul style={LIST}>
            <li>
              <strong>slurmd</strong> is a small daemon that runs on each compute node and takes orders from the
              controller.
            </li>
            <li>
              <strong>A partition</strong> is a named queue in front of a set of compute nodes. You submit a job to a
              partition, never to a particular machine.
            </li>
            <li>
              <strong>sbatch</strong> submits a shell script as a job and returns at once. Lines in the script that
              start with <code>#SBATCH</code> say what the job needs, such as how many nodes and how many GPUs. Inside
              the script, <code>srun</code> starts the program on every node that the job was given.
            </li>
            <li>
              <strong>A job array</strong> is one submission that expands into many numbered copies of the same
              script. Slurm schedules each copy as its own job.
            </li>
            <li>
              <strong>GRES</strong> (generic resources) is how Slurm counts resources that are neither CPU cores nor
              memory. A GPU is a GRES, so a job asks for one GPU with <code>--gres=gpu:1</code>.
            </li>
            <li>
              <strong>A feature</strong> is a label on a group of nodes, and a job asks for nodes with that label
              through the <code>--constraint</code> option. When several groups of nodes serve the same partition, a
              job uses a feature to choose between them.{' '}
              <Cite id="F10-225">AWS PCS User Guide, Custom Slurm settings for compute node groups</Cite>
            </li>
          </ul>
          <Box variant="p">PCS adds its own objects around these Slurm terms:</Box>
          <ul style={LIST}>
            <li>
              <strong>The cluster</strong> is the managed controller and its settings. You give it a name, a Slurm
              version, a size, one subnet and a security group. The size sets how many instances the controller
              manages and how many jobs it tracks. You cannot change the size, the VPC or the subnet after you create
              the cluster. PCS writes Slurm&apos;s configuration files from your objects, and you can set only the
              Slurm parameters that are on an allow-list.{' '}
              <Cite id="F10-201">AWS PCS API Reference, CreateCluster</Cite>{' '}
              <Cite id="F10-205">AWS PCS User Guide, Slurm configuration in AWS PCS</Cite>
            </li>
            <li>
              <strong>A queue</strong> is one Slurm partition. It points at one or more compute node groups, and one
              group can serve more than one queue. A queue also carries partition settings, such as a time limit and
              a priority tier. <Cite id="F10-215">AWS PCS User Guide, AWS PCS queues and Creating a queue</Cite>{' '}
              <Cite id="F10-216">AWS PCS User Guide, Custom Slurm settings for queues</Cite>
            </li>
            <li>
              <strong>A compute node group</strong> is a set of rules for creating nodes. It names the EC2 instance
              types, a minimum and a maximum instance count, the subnets, the machine image and one purchase option.
              Three of its rules affect every cluster design. First, all instance types in a group must have the same
              processor architecture, the same number of vCPUs (virtual CPUs) and the same number of GPUs. Second, the
              purchase option is a single field, with the values <code>ONDEMAND</code> (the default),{' '}
              <code>SPOT</code>, <code>CAPACITY_BLOCK</code> and <code>INTERRUPTIBLE_CAPACITY_RESERVATION</code>.
              The field takes one value, so a cluster that mixes Spot and On-Demand instances needs a separate group
              for each. Third, the minimum and the maximum set how the group scales. Set them equal for nodes that are
              always on, or set the minimum to 0 for a group that scales from zero.{' '}
              <Cite id="F10-206">AWS PCS API Reference, CreateComputeNodeGroup</Cite>{' '}
              <Cite id="F10-207">AWS PCS API Reference, purchaseOption</Cite>{' '}
              <Cite id="F10-208">AWS PCS User Guide, Creating a compute node group</Cite>
            </li>
            <li>
              <strong>The launch template</strong> is an EC2 object that holds the instance settings a compute node
              group cannot express itself. These settings include network interfaces for EFA, placement groups,
              capacity reservations and user data. EFA (Elastic Fabric Adapter) is the EC2 network device that lets
              training processes on different nodes exchange data without passing through the operating system&apos;s
              network stack. A placement group is an EC2 setting that controls where instances sit relative to each
              other. User data is the script that an instance runs when it boots.{' '}
              <Cite id="F10-210">AWS PCS User Guide, launch template modes</Cite>
            </li>
            <li>
              <strong>Shared storage</strong> is the file system that every node mounts when it boots. PCS has no
              storage object of its own, so you choose the file system and mount it yourself. The AWS tutorial uses
              Amazon EFS (Elastic File System) for home directories. EFS is a managed NFS share. For datasets and
              checkpoints, the tutorial uses Amazon FSx for Lustre, a managed parallel file system built for many
              nodes that read and write large files at the same time. The mount takes a few lines in the launch
              template&apos;s user data.{' '}
              <Cite id="F10-231">AWS PCS User Guide, Using network file systems with AWS PCS</Cite>
            </li>
            <li>
              <strong>The image</strong> is the disk that each instance boots from, called an AMI (Amazon Machine
              Image). AWS maintains a PCS-ready Deep Learning AMI that includes the PCS agent, Slurm, the NVIDIA drivers and
              the Lustre client. It does not include PyTorch, so you install the training environment on shared
              storage or in an image that you build from this one.{' '}
              <Cite id="F10-212">AWS PCS User Guide, Using PCS-ready DLAMI</Cite>
            </li>
            <li>
              <strong>A node</strong> is one EC2 instance in your account that runs <code>slurmd</code> and the PCS
              agent. Slurm sees the node&apos;s GPUs as GRES, and on Slurm 26.05 it detects them automatically. PCS
              turns off simultaneous multithreading on every node, so an x86 instance type that advertises 96 vCPUs
              offers 48 cores to your job.{' '}
              <Cite id="F10-236">AWS PCS User Guide, Slurm release notes and custom GRES settings</Cite>{' '}
              <Cite id="F10-213">AWS PCS User Guide, AWS PCS compute node groups</Cite>
            </li>
            <li>
              <strong>The login node</strong> is the machine where people type <code>sbatch</code> and the other
              Slurm commands. AWS suggests creating it as one more compute node group, with a static scaling
              configuration so that its instance is always on. The group uses On-Demand Instances, and it has the
              same image and file system mounts as the groups that run jobs. It is attached to no queue, so no job
              runs on it. <Cite id="F10-227">AWS PCS User Guide, AWS PCS login nodes</Cite>
            </li>
            <li>
              <strong>Accounting</strong> is Slurm&apos;s record of who ran which job. When you turn it on, PCS runs
              the accounting database for you, and the <code>sacct</code> command on the login node queries it.{' '}
              <Cite id="F10-226">AWS PCS User Guide, Slurm accounting</Cite>
            </li>
          </ul>
          <Box variant="p">
            PCS scales the compute node groups job by job. At regular intervals, it reviews the waiting jobs, launches
            instances for the nodes that Slurm has allocated to them, and removes instances that have been idle for
            long enough. <Cite id="F10-217">AWS PCS User Guide, Job-level scaling</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can create this cluster for one arm this week. It lists the compute node groups and queues to create, the purchase option for each group, and the settings to change from their defaults."
          >
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            As of November 2026, we found no PCS page that recommends a configuration for Spot Instances. The table
            below is therefore this dive&apos;s own recommendation, built from settings that the PCS documentation
            describes. The three recommendations that AWS makes itself follow the table, in AWS&apos;s words.
          </Box>
          <Box variant="p">
            For the arm, the cluster has one queue and three compute node groups. A training group runs the two-node
            world-model job. An evaluation group runs the evaluation array. A login group holds the login node and
            serves no queue.
          </Box>
          <Box variant="p">
            You choose each group&apos;s purchase option from the workload type of its jobs. The evaluation runs are
            Independent tasks: the array tasks do not depend on each other, and a task that loses its node can be
            run again. So the evaluation group uses Spot Instances. The world-model job is Multi-node training, so
            its group uses On-Demand Instances or reserved capacity. The table below names two kinds of reserved
            capacity. An On-Demand Capacity Reservation (ODCR) holds EC2 instances of one type for you. A Capacity
            Block for ML is a block of GPU instances booked in advance for a fixed period. The login group uses
            On-Demand Instances.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Recommended value</th>
                  <th style={TH}>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Controller size</td>
                  <td style={TD}>Small</td>
                  <td style={TD}>
                    Small is enough until the cluster has more than 32 instances or 256 jobs at the same time. You
                    cannot change the size later. <Cite id="F10-202">Cluster size in AWS PCS</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Slurm version</td>
                  <td style={TD}>26.05 or 25.11</td>
                  <td style={TD}>
                    Slurm 25.05 reaches end of life on 11/30/2026. You can later upgrade a cluster&apos;s Slurm version
                    in place without interrupting running jobs. <Cite id="F10-203">Slurm versions in AWS PCS</Cite>{' '}
                    <Cite id="F10-204">Update the scheduler version of a cluster</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Queues and groups</td>
                  <td style={TD}>
                    One group for each purchase option and each combination of architecture, vCPU count and GPU count;
                    one queue for each kind of work once there are several kinds
                  </td>
                  <td style={TD}>
                    Each group has one purchase option, and all its instance types share one architecture, one vCPU
                    count and one GPU count. AWS&apos;s own example uses an On-Demand queue for high-priority jobs and a
                    Spot queue for low-priority jobs. <Cite id="F10-207">AWS PCS queues</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Spot group</td>
                  <td style={TD}>
                    <code>minInstanceCount</code> 0, several subnets, and the allocation strategy left at its default
                  </td>
                  <td style={TD}>
                    The default allocation strategy is <code>price-capacity-optimized</code>. Independent tasks do not
                    need EFA, so spreading the group over several subnets costs them nothing and gives the group a
                    larger pool of Spot capacity to draw from. <Cite id="F10-209">AWS PCS API Reference, SpotOptions</Cite>{' '}
                    <Cite id="F10-232">Creating a compute node group</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Training group</td>
                  <td style={TD}>
                    With On-Demand Instances or an ODCR: one subnet, EFA and a cluster placement group. With a
                    Capacity Block: one subnet and EFA, with no placement group
                  </td>
                  <td style={TD}>
                    A group that spans more than one subnet loses EFA between its nodes. EC2 does not accept a placement
                    group for an instance launched into a Capacity Block, and the block already places its instances
                    close together. <Cite id="F10-232">Creating a compute node group</Cite>{' '}
                    <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>scaleDownIdleTimeInSeconds</code>
                  </td>
                  <td style={TD}>
                    600 (the default) on Spot groups; a higher value on the training group if its jobs follow each other
                    closely
                  </td>
                  <td style={TD}>
                    If the value is shorter than the gap between two jobs, PCS terminates the nodes after each job and
                    launches new ones for the next.{' '}
                    <Cite id="F10-218">AWS PCS API Reference, ClusterSlurmConfigurationRequest</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Storage</td>
                  <td style={TD}>FSx for Lustre mounted in user data, with the same mounts on the login node</td>
                  <td style={TD}>
                    If the mount fails or is slow, the instances may never accept jobs, and you still pay for them.{' '}
                    <Cite id="F10-231">Using network file systems with AWS PCS</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Accounting and scaling logs</td>
                  <td style={TD}>Both turned on</td>
                  <td style={TD}>
                    Accounting records who ran which job. The scaling logs record each change in a node&apos;s state with
                    a reason, so they tell you why a node did not arrive.{' '}
                    <Cite id="F10-226">Slurm accounting</Cite> <Cite id="F10-219">Scaling logs</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">AWS makes three recommendations of its own:</Box>
          <ul style={LIST}>
            <li>
              <strong>For the login node:</strong> &quot;Choose on-demand purchase option to avoid having your
              instance(s) reclaimed.&quot;{' '}
              <Cite id="F10-227">Using a compute node group to provide login nodes</Cite>
            </li>
            <li>
              <strong>For groups that use EFA:</strong> &quot;We recommended you include a <strong>cluster</strong>{' '}
              placement group when you configure an AWS PCS compute node group to use Elastic Fabric Adapter
              (EFA).&quot; <Cite id="F10-233">Placement groups for EC2 instances in AWS PCS</Cite>
            </li>
            <li>
              <strong>For capacity that AWS can reclaim,</strong> on the page about interruptible capacity
              reservations: &quot;Implement checkpointing so jobs can save intermediate results and resume after
              interruption.&quot; <Cite id="F10-222">Using I-ODCRs with AWS PCS</Cite>
            </li>
          </ul>
          <Snippet
            title="The cluster"
            mode="adapted"
            source={<Cite id="F10-218">AWS PCS User Guide, Creating a cluster in AWS PCS</Cite>}
            ours={
              <>
                the cluster name, Slurm 26.05, the size SMALL, the default idle time of 600 written out in full, and the
                removal of AWS&apos;s example custom setting.
              </>
            }
          >
            {CREATE_CLUSTER}
          </Snippet>
          <Snippet
            title="The Spot compute node group"
            mode="adapted"
            source={<Cite id="F10-210">AWS PCS User Guide, Creating a compute node group in AWS PCS</Cite>}
            ours={
              <>
                the names, the Spot purchase option, 0 to 4 instances, the instance type and the <code>spot</code>{' '}
                feature label. Every option name comes from the PCS documentation, and the combination of options is
                ours.
              </>
            }
          >
            {CREATE_SPOT_GROUP}
          </Snippet>
          <Box variant="p">
            The command names no AMI and no security group, so the launch template must specify both, or PCS rejects
            the request. <Cite id="F10-342">AWS PCS User Guide, Creating a compute node group in AWS PCS</Cite> A
            Spot group also needs one thing in the account first: the <code>AWSServiceRoleForEC2Spot</code>{' '}
            service-linked role must exist before you create the group.{' '}
            <Cite id="F10-209">AWS PCS User Guide, Spot service-linked role</Cite>
          </Box>
          <Snippet
            title="Launch template user data that mounts FSx for Lustre"
            mode="copied"
            source={<Cite id="F10-231">AWS PCS User Guide, Using network file systems with AWS PCS</Cite>}
          >
            {LUSTRE_USER_DATA}
          </Snippet>
          <Box variant="p">
            The first command installs the Lustre client with the Amazon Linux 2 method. On Amazon Linux 2023, the
            FSx for Lustre guide installs it with <code>dnf install -y lustre-client</code> instead.{' '}
            <Cite id="F10-345">FSx for Lustre User Guide, Installing the Lustre client</Cite> The PCS-ready Deep
            Learning AMI already includes the Lustre client, so on that image you can delete the install line and keep
            the two mount lines. <Cite id="F10-212">Using PCS-ready DLAMI with AWS PCS</Cite> You can also mount the
            file system from a node lifecycle action instead of user data. A node lifecycle action is a script that
            PCS runs at one of two stages of a node&apos;s boot. If you mount the file system this way, use the{' '}
            <code>nodeBootstrapped</code> stage, which runs before <code>slurmd</code> starts.{' '}
            <Cite id="F10-214">Run custom scripts with node lifecycle actions</Cite>
          </Box>
          <ExpandableSection headerText="Launch template for an EFA group: AWS's example and how to adapt it">
            <SpaceBetween size="s">
              <Snippet
                title="EFA interfaces and a placement group"
                mode="copied"
                source={<Cite id="F10-233">AWS PCS User Guide, Create or update an EC2 launch template</Cite>}
              >
                {EFA_TEMPLATE}
              </Snippet>
              <Box variant="p">
                Treat this template as an illustration rather than a file to copy. As AWS prints it, the second
                interface is missing a comma after its <code>SubnetId</code> line. That interface also sits on network
                card 1, which exists only on instance types with more than one network card. The g6e.12xlarge that
                this section uses for training has one network card, so for that type keep only the first interface.
                Security groups are set on each interface, and the placement group goes in{' '}
                <code>Placement.GroupId</code>. For a Capacity Block group, leave out the whole{' '}
                <code>Placement</code> block, because EC2 does not accept a placement group there. The{' '}
                <Link href="../efa/">EFA dive</Link> covers what the adapter does for multi-node training.{' '}
                <Cite id="F10-343">EC2 instance types, accelerated computing, network specifications</Cite>{' '}
                <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Reserved GPU capacity: ODCRs, Capacity Blocks and UltraServers">
            <SpaceBetween size="s">
              <Box variant="p">
                You attach reserved capacity to a group through its launch template. The launch template can target
                an ODCR in two ways. If it targets the ODCR by its ID, the group launches only the instances that the
                reservation holds. If it targets a reservation group instead, PCS can also launch extra On-Demand
                instances when the reservation is used up.{' '}
                <Cite id="F10-235">AWS PCS User Guide, Using ODCRs with AWS PCS</Cite>
              </Box>
              <Box variant="p">
                A Capacity Block needs a group of its own: one group for each block, with a maximum instance count no
                larger than the block. Until the block starts, its nodes stay in a Slurm maintenance state.{' '}
                <Cite id="F10-234">AWS PCS User Guide, Using Capacity Blocks for ML with AWS PCS</Cite>
              </Box>
              <Box variant="p">
                UltraServers are the P6e-GB200 and P6e-GB300 machines, which join many GPUs with NVLink. NVLink is
                NVIDIA&apos;s direct connection between GPUs. You attach UltraServers in the same way, as Capacity Block
                groups. PCS reads the block, identifies the UltraServer type and configures Slurm&apos;s topology
                plugin itself, so that Slurm places each job inside one UltraServer. Two tasks remain your
                responsibility. Your jobs must use <code>--exclusive</code>, and you supply the script that configures
                NVIDIA IMEX for each job. IMEX (Internode Memory Exchange) is the NVIDIA service that lets GPUs in
                different nodes share memory. A
                P6e-GB200 UltraServer block also ends earlier for you, because its instances must be terminated at
                least 60 minutes before the block&apos;s end time.{' '}
                <Cite id="F10-237">AWS PCS User Guide, Configure UltraServer instances</Cite>{' '}
                <Cite id="F09-109">AWS What&apos;s New, 18 June 2026</Cite>{' '}
                <Cite id="F10-341">EC2 User Guide, Capacity Blocks for ML, UltraServer considerations</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Limits and defaults for lookup: controller sizes, group quotas and requeue timing">
            <SpaceBetween size="s">
              <Box variant="p">
                The controller size sets how many instances the controller manages and how many jobs it tracks. The
                job count includes running jobs, pending jobs and jobs that completed in the last 5 minutes.{' '}
                <Cite id="F10-202">AWS PCS User Guide, Cluster size and MaxJobCount</Cite>
              </Box>
              <div data-cites="F10-202" style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={TH}>Controller size</th>
                      <th style={TH}>Instances it manages</th>
                      <th style={TH}>Jobs it tracks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={TD}>Small</td>
                      <td style={TD}>up to 32</td>
                      <td style={TD}>up to 256</td>
                    </tr>
                    <tr>
                      <td style={TD}>Medium</td>
                      <td style={TD}>up to 512</td>
                      <td style={TD}>up to 8192</td>
                    </tr>
                    <tr>
                      <td style={TD}>Large</td>
                      <td style={TD}>up to 2048</td>
                      <td style={TD}>up to 16384</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Box variant="small" color="text-body-secondary">
                <Cite id="F10-202">AWS PCS User Guide, Cluster size in AWS PCS</Cite>
              </Box>
              <Box variant="p">
                By default, the service quota allows 10 compute node groups and 10 queues in a cluster. Your design
                needs one group for each purchase option and each combination of architecture, vCPU count and GPU
                count, so check this quota before you plan several Spot groups. <Cite id="F10-239">AWS PCS User Guide, Endpoints and service quotas</Cite>
              </Box>
              <Box variant="p">
                On Slurm 25.11 or later, a requeued job becomes eligible to run again after 5 seconds by default. On
                earlier versions, the delay is 70 seconds. The option <code>--requeue=expedite</code> puts a requeued
                job back at the highest priority. <Cite id="F10-223">AWS PCS User Guide, Slurm release notes</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow a two-node training job from the login node to a checkpoint on the shared file system, and then an evaluation array on Spot Instances. At each step, you see which state squeue and the PCS scaling log show."
          >
            A training job and a Spot evaluation array, step by step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The training job trains the world model on two nodes, so that eight GPUs share the work. To start it, you
            log in to the login node and write one script.
          </Box>
          <Snippet
            title="train.sh, the whole job in one script"
            mode="adapted"
            source={<Cite id="F10-228">AWS PCS User Guide, Run a multi-node MPI job with Slurm</Cite>}
            ours={
              <>
                the job name, two nodes in place of four, the <code>train</code> constraint, <code>--requeue</code>,
                the paths under <code>/shared</code> and the training command.
              </>
            }
          >
            {TRAIN_SCRIPT}
          </Snippet>
          <Box variant="p">
            In this script, <code>--nodes=2</code> asks for two nodes, and <code>--exclusive</code> asks for the whole
            of each node, GPUs included. <code>--constraint=train</code> selects the training group, and{' '}
            <code>srun</code> starts one process on each node. You then submit the script, and later the evaluation
            array, with these commands:
          </Box>
          <Snippet
            title="Submitting, on the login node"
            mode="adapted"
            source={<Cite id="F10-228">AWS PCS User Guide, Run a single node job in AWS PCS</Cite>}
            ours={
              <>
                the queue name <code>arm</code>, the script names, and every option on the array line (the array
                range, the GPU request, the constraint and <code>--requeue</code>).
              </>
            }
          >
            {SUBMIT_LINES}
          </Snippet>
          <Box variant="p">
            From the moment you submit a job until it runs on its GPUs, you can follow it through two sets of
            states. Slurm reports the state of the job: the <code>squeue</code> command shows PD (pending) while the
            job waits, CF (configuring) while its nodes are being brought up, and R (running) when it runs. PCS
            reports the state of each node in its scaling log.
          </Box>
          <Figure
            cites="F10-218 F10-219 F10-221"
            caption="Read the diagram from top to bottom. A dashed box means that no instance exists. The job stays in CF until every one of its nodes is ACTIVE, and PCS terminates a node after it has been idle for the scale-down time, 600 seconds by default."
          >
            <StatesDiagram />
          </Figure>
          <ol style={LIST}>
            <li>
              <strong>Pending, then configuring.</strong> The training group starts at zero instances. Slurm
              allocates two node names in that group to the job, and PCS launches an instance for each name.{' '}
              <code>squeue</code> shows the job as CF. <Cite id="F10-217">AWS PCS User Guide, Job-level scaling</Cite>
            </li>
            <li>
              <strong>The nodes arrive.</strong> Each instance boots and runs its user data, which mounts FSx for
              Lustre at <code>/shared</code>. The instance then registers through the PCS agent and starts{' '}
              <code>slurmd</code>. For each node, the scaling log shows LAUNCHED, then REGISTERED, then ACTIVE. The job
              stays in CF until both nodes are ACTIVE.{' '}
              <Cite id="F10-219">AWS PCS User Guide, Scaling logs in AWS PCS</Cite>
            </li>
            <li>
              <strong>Running.</strong> <code>squeue</code> shows the job as R. The job reads its data from{' '}
              <code>/shared</code> and writes its checkpoints back there, so the checkpoints outlive the nodes. The two
              nodes reach each other over EFA. <Cite id="F10-233">AWS PCS User Guide, Using EFA with AWS PCS</Cite>
            </li>
            <li>
              <strong>Finished, then back to zero.</strong> When the job ends, its nodes sit idle. After 600 idle
              seconds, Slurm powers the nodes down and PCS terminates the instances, so the group is back at zero.{' '}
              <Cite id="F10-218">AWS PCS API Reference, scaleDownIdleTimeInSeconds</Cite>
            </li>
          </ol>
          <Box variant="p">
            The figure below shows the same cluster through one afternoon, with the evaluation array added. Both
            groups that run jobs sit behind the one queue, and each job selects its group with{' '}
            <code>--constraint</code>.
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="a training job and a Spot job array on PCS"
            cites="F10-208 F10-215 F10-217 F10-218 F10-219 F10-220 F10-221 F10-222 F10-223 F10-225 F10-227 F10-231 F10-233 F10-244 F09-76 F08-45"
            caption={
              <>
                Press Play or Step to move through the steps. T is the training job, drawn once on each node it holds.
                The numbers 1 to 4 are the tasks of the job array, and diamonds are checkpoint files. The instance
                types, the group sizes and the queue name are this dive&apos;s choices. The states and timings are the
                ones PCS documents. PCS documents each Spot step on a separate page, and as of November 2026 we found
                no PCS page that describes them as one sequence. The Spot steps in the figure are therefore an
                inference from those separate pages.
              </>
            }
          />
          <Box variant="p">Three behaviours in the figure matter when you plan a job:</Box>
          <ul style={LIST}>
            <li>
              <strong>A multi-node job never starts on only some of its nodes.</strong> The job starts when the
              slowest node has finished booting. AWS publishes no figure for how long a node takes to boot. The only
              documented bound is about 30 minutes, after which Slurm gives up on a node that has not registered.{' '}
              <Cite id="F10-221">AWS PCS User Guide, Run a single node job, and bootstrap troubleshooting</Cite>
            </li>
            <li>
              <strong>You tune the idle time for each group.</strong> At the default of 600 seconds, a node stays up
              through a short gap between two jobs, and it also keeps running for 600 seconds after the last job.{' '}
              <Cite id="F10-218">AWS PCS API Reference, scaleDownIdleTimeInSeconds</Cite>
            </li>
            <li>
              <strong>Storage must be mounted before slurmd starts.</strong> From the moment <code>slurmd</code>{' '}
              starts, Slurm can send the node a job.{' '}
              <Cite id="F10-220">AWS PCS User Guide, node lifecycle actions, how execution works</Cite>
            </li>
          </ul>
          <Box variant="p">
            <strong>The evaluation array on Spot.</strong> The last line of the submit snippet starts an evaluation as
            a job array. As an illustration, take <Toy>500</Toy> simulated episodes. A Small controller tracks up to
            256 jobs. If each array task counts as one job toward that limit, as this dive assumes, one task per
            episode would not fit. So the array has <Toy>50</Toy> tasks of ten episodes each. Each task asks for one
            GPU in the Spot group. The group&apos;s maximum instance count limits how many tasks run at once, and the
            other tasks wait in PD. <Cite id="F10-202">AWS PCS User Guide, Cluster size in AWS PCS</Cite>
          </Box>
          <Box variant="p">
            The <code>--requeue</code> option tells Slurm that a task that loses its node may go back to the queue.
            PCS documents two related behaviours. An instance that is terminated from outside PCS is logged as
            TERMINATED with the reason EXTERNALLY_TERMINATED, and its node is released to be replaced. When a Capacity
            Block expires, active jobs are requeued by default, although they &quot;might have errors or fail&quot;.{' '}
            <Cite id="F10-222">AWS PCS User Guide, Capacity Blocks FAQ and Scaling logs</Cite>
          </Box>
          <Box variant="p">
            As of November 2026, the PCS User Guide has no page that walks through a Spot interruption. It does not
            say whether the two-minute Spot notice drains the node, whether the job receives a signal, or whether the
            job is requeued. So a requeue of the reclaimed task is likely but not confirmed. Because no warning is
            documented, write each task so that it needs none: have it save progress to <code>/shared</code> every
            few minutes. A requeued task starts again from the first line of its script, so have the task look for a
            progress file first when it starts.{' '}
            <Cite id="F10-244">assembled from the scaling, Spot, requeue and storage pages</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Most problems on a PCS cluster show up as a job that stays in PD or CF, or as a node state and a reason in the scaling log. For each common failure, you can learn the sign to look for, where one exists, and the habit that prevents it."
          >
            What fails and how you notice it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>A Spot instance is reclaimed.</strong> The scaling log shows the node as TERMINATED with the
              reason EXTERNALLY_TERMINATED. If the task was submitted with <code>--requeue</code>, it should return to
              the queue. As of November 2026, the PCS documentation describes no drain, signal or requeue step for a
              Spot interruption notice. To lose little work, save a checkpoint on a timer and resume from it when the
              task starts. <Cite id="F10-222">AWS PCS User Guide, pages on losing an instance</Cite>
            </li>
            <li>
              <strong>A node never joins the cluster.</strong> The job stays in CF, and in the scaling log the node
              never reaches ACTIVE. After about 30 minutes, Slurm marks a node that has not registered as down. One
              thing to check is the file system mount: if it fails or is slow, the instance may never accept jobs,
              and you still pay for it. Keep the scaling logs turned on, because they record why a node did not
              arrive.{' '}
              <Cite id="F10-221">AWS PCS User Guide, Run a single node job, and bootstrap troubleshooting</Cite>{' '}
              <Cite id="F10-231">Using network file systems with AWS PCS</Cite>{' '}
              <Cite id="F10-219">Scaling logs</Cite>
            </li>
            <li>
              <strong>A Capacity Block ends.</strong> The block ends at 11:30 UTC on its last day, and EC2 starts
              terminating its instances 30 minutes earlier, at 11:00 UTC. EC2 sends a warning event 40 minutes before
              the end. Once the instances are gone, queued jobs stay pending. Make the job save its last checkpoint
              before 11:00 UTC on the last day.{' '}
              <Cite id="F10-234">AWS PCS User Guide, Using Capacity Blocks for ML with AWS PCS</Cite>{' '}
              <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>
            </li>
            <li>
              <strong>The controller reaches its job limit.</strong> A Small controller tracks up to 256 jobs, and
              that count includes pending jobs and jobs that completed in the last 5 minutes. A sweep that submits one
              array task per item can reach this limit. Split large sweeps into fewer, longer tasks, or create the
              cluster one size up, because you cannot change the size later.{' '}
              <Cite id="F10-202">AWS PCS User Guide, Cluster size and MaxJobCount</Cite>
            </li>
            <li>
              <strong>CPU-heavy stages get half the cores you expect.</strong> PCS turns off simultaneous
              multithreading on every node. On an x86 instance type, a CPU-heavy stage such as video decoding therefore
              gets half as many cores as the instance type advertises vCPUs. Graviton instance types are not affected.
              Size these stages by cores, not by vCPUs. <Cite id="F10-213">AWS PCS User Guide, AWS PCS compute node groups</Cite>
            </li>
            <li>
              <strong>Your software is missing on the node.</strong> Jobs run as processes on the AMI, and as of
              November 2026 the PCS User Guide has no page on a container runtime. Install your software in an image
              that you build, or on a shared directory that every node mounts.{' '}
              <Cite id="F10-245">assembled from the PCS User Guide</Cite>
            </li>
            <li>
              <strong>The bill does not drop to zero.</strong> The compute node groups scale to zero, but the
              controller does not. AWS bills the controller by the hour, at a rate set by its size, so budget for it
              even in weeks with no jobs. <Cite id="F10-240">AWS PCS pricing page</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose the controller size first, because you cannot change it later. After that, a small cluster and the two-node training script are enough to test the whole path from sbatch to a checkpoint."
          >
            Where to start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            If PCS fits your workload, the first step is small. Count the most jobs you expect to have pending at the
            same time, and compare that number with 256, the job limit of a Small controller. Use that comparison to
            choose the controller size, because you cannot change the size after you create the cluster. Then create
            the cluster, a login group and one compute node group with a minimum of 0, and submit the two-node
            training script from this section.{' '}
            <Cite id="F10-202">AWS PCS User Guide, Cluster size in AWS PCS</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
