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
          Before any job, the cluster is a managed controller and one login node. Both compute node groups have a
          minimum of 0, so they hold node names and no instances. On the login node sit a training script (T) and an
          array of four evaluation runs (1 to 4).
        </>
      ),
      scheduler: ['no jobs in the queue', 'both compute groups at 0'],
      instances: { ...LOGIN },
      jobs: [{ id: 'ta', label: 'T', at: { submit: 0 } }, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          <code>sbatch</code> puts T in the queue. Slurm allocates it two named nodes of the train group, and PCS
          launches an EC2 instance behind each name. The scaling log prints LAUNCHED with the reason
          SCHEDULER_REQUESTED, and <code>squeue</code> shows the job as CF, configuring.
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
          turned ACTIVE. T still shows CF: a job starts only when every node it asked for is available. A node that
          never registers is given about 30 minutes before Slurm marks it down.
        </>
      ),
      scheduler: ['T: CF, 1 of 2 nodes ACTIVE', 'waiting for the second node'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'launching' },
      jobs: [{ id: 'ta', label: 'T', at: { q: 0, pos: 0 } }, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          Both nodes are ACTIVE and T runs (state R). The job holds both nodes whole, so its token is drawn once on
          each. The two nodes exchange data over EFA inside a cluster placement group, both set in the launch
          template.
        </>
      ),
      scheduler: ['T: R on 2 nodes'],
      instances: { ...LOGIN, '0.0': 'running', '0.1': 'running' },
      jobs: [...trainRunning, ...arrayAt((k) => ({ submit: k + 2 }))],
    },
    {
      caption: (
        <>
          The user submits the array with <code>--requeue</code>. Slurm allocates four nodes of the Spot group and PCS
          launches them. Meanwhile T writes a checkpoint, drawn as a diamond.
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
          Four Spot nodes are ACTIVE and each runs one array task on its GPU. The checkpoint of T is a file on FSx for
          Lustre, which every node and the login node mount at the same path. Task 3 keeps a progress file there too,
          the second diamond.
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
          EC2 takes back the instance under task 3. PCS logs the node as TERMINATED with the reason
          EXTERNALLY_TERMINATED and releases it to be replaced, and task 3 returns to the queue. No drain step is drawn
          because PCS documents none for a Spot notice; the requeue is our reading of how PCS describes an expiring
          Capacity Block.
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
          On Slurm 25.11 or later a requeued job is eligible again after 5 seconds by default. At its next scaling pass PCS launches a
          replacement instance for the node. Tasks 1 and 2 finish, and the idle clock starts on their two nodes.
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
          Task 3 starts again from the top of its script, which reads its progress file from the shared file system
          and continues: resuming is the script&apos;s work. Task 4 finishes. The two nodes that sat idle for 600
          seconds are terminated, reason SCHEDULER_REQUESTED.
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
          T and task 3 finish. Nothing is pending, so the remaining nodes sit idle while{' '}
          <code>scaleDownIdleTimeInSeconds</code> counts: 600 seconds by default, with an override per compute node
          group (Slurm 25.11 or later).
        </>
      ),
      scheduler: ['all jobs finished', 'idle clocks running'],
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
          Both compute node groups are back at zero instances. The controller and the login node stay, and so do the
          checkpoints and results on the file system. This is the state the next <code>sbatch</code> starts from.
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
            description="Managed Slurm taken apart object by object, so you can submit one script for a multi-node training job and know what happens between sbatch and the checkpoint on disk (AWS PCS documentation, read 2026-11-20)."
          >
            26. AWS Parallel Computing Service
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, placed the workloads. This section
            takes one of them apart: AWS Parallel Computing Service (PCS), which is the Slurm scheduler with AWS running
            the part that schedules. The running example is {TASK}: first a world-model training job on two GPU nodes,
            then an array of evaluation runs on Spot.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="After this block you can say in two sentences what PCS is, and tell whether your work is the kind it was built for."
          >
            What it is and the challenge it meets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Slurm is the job scheduler of high-performance computing (HPC), the field that runs simulations and
            training across many machines at once. Its vocabulary is small, and the rest of this section uses it:
          </Box>
          <ul style={LIST}>
            <li>
              The <strong>controller</strong> is one process that holds the list of waiting jobs and decides which
              job gets which machines.
            </li>
            <li>
              A <strong>compute node</strong> is a machine that runs jobs. Each one runs a small daemon,{' '}
              <code>slurmd</code>, that takes orders from the controller.
            </li>
            <li>
              A <strong>partition</strong> is a named queue in front of a set of nodes. You submit to a partition,
              never to a machine.
            </li>
            <li>
              <code>sbatch</code> submits a shell script as a job and returns at once. Lines in the script that start
              with <code>#SBATCH</code> say what the job needs: how many nodes, how many GPUs. Inside the script,{' '}
              <code>srun</code> starts the program on every node the job was given.
            </li>
            <li>
              A <strong>job array</strong> is one submission that expands into many numbered copies of the same
              script, each scheduled as its own job.
            </li>
            <li>
              <strong>GRES</strong> (generic resources) is how Slurm counts things that are neither CPU cores nor
              memory. A GPU is a GRES, so a job asks for one with <code>--gres=gpu:1</code>.
            </li>
          </ul>
          <Box variant="p">
            Running Slurm yourself means keeping a controller machine alive and patched, and usually paying for nodes
            that wait between jobs. PCS splits the work. AWS runs the controller. You define three kinds of object: a
            cluster, queues, and compute node groups. Jobs go into queues and run on EC2 instances that the compute
            node groups describe, and the scheduler that places the jobs also launches the instances. <Cite id="F10-200">AWS PCS User Guide, Concepts in AWS PCS</Cite>
          </Box>
          <Box variant="p">
            <strong>Use it when</strong> your training code already arrives as <code>sbatch</code> scripts, or when a
            job needs several GPU nodes that must all start together, and you want the nodes to exist only while jobs
            do. A compute node group with a minimum of 0 scales from zero and back to zero.{' '}
            <Cite id="F10-208">AWS PCS User Guide, Creating a compute node group</Cite>
          </Box>
          <Box variant="p">
            <strong>Look elsewhere when</strong> your work is packaged as container images and you have no cluster to
            keep (section 25, AWS Batch), when you need a Spot interruption handled by a documented sequence (section
            28, Amazon EKS), or when the pipeline runs a few hours a week: the controller has its own hourly fee
            whether or not jobs run. <Cite id="F10-240">AWS PCS pricing page</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every object you create or see in a PCS cluster, with the few fields that decide how it behaves, so the console and the API read as a short list."
          >
            Its moving parts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The cluster</strong> is the managed controller plus its settings. You give it a name, a Slurm
            version, a size, one subnet and a security group. The size, the VPC (virtual private cloud, your private
            network in AWS) and the subnet are fixed at creation. PCS writes Slurm&apos;s configuration files from your
            objects, and you can set only the Slurm parameters on an allow-list. <Cite id="F10-201">AWS PCS API Reference, CreateCluster</Cite>{' '}
            <Cite id="F10-205">AWS PCS User Guide, Slurm configuration in AWS PCS</Cite>
          </Box>
          <Box variant="p">
            The size sets two ceilings: how many instances the controller manages and how many jobs it tracks. The job
            count includes running, pending and recently completed jobs.
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
            <strong>A queue</strong> is one Slurm partition. It points at one or more compute node groups, and one
            group can serve more than one queue. A queue also carries partition settings such as a time limit and a
            priority tier.{' '}
            <Cite id="F10-215">AWS PCS User Guide, AWS PCS queues and Creating a queue</Cite>{' '}
            <Cite id="F10-216">AWS PCS User Guide, Custom Slurm settings for queues</Cite>
          </Box>
          <Box variant="p">
            <strong>A compute node group</strong> is a set of rules for creating nodes: which EC2 instance types, a
            minimum and a maximum instance count, the subnets, the machine image, and one purchase option. Three rules
            shape every design. All instance types in a group must have the same processor architecture, the same
            number of vCPUs (virtual CPUs) and the same number of GPUs. The purchase option is a single field
            (<code>ONDEMAND</code>, the default; <code>SPOT</code>; <code>CAPACITY_BLOCK</code>;{' '}
            <code>INTERRUPTIBLE_CAPACITY_RESERVATION</code>), so a cluster mixes Spot and On-Demand by having several
            groups, which is our reading of that field. The minimum and maximum decide the scaling shape: equal for
            nodes that are always on, a minimum of 0 for a group that scales from zero.{' '}
            <Cite id="F10-206">AWS PCS API Reference, CreateComputeNodeGroup</Cite>{' '}
            <Cite id="F10-207">AWS PCS API Reference, purchaseOption</Cite>{' '}
            <Cite id="F10-208">AWS PCS User Guide, Creating a compute node group</Cite>
          </Box>
          <Box variant="p">
            <strong>The launch template and the image.</strong> What the group&apos;s own fields cannot express goes in
            an EC2 launch template: network interfaces for EFA (Elastic Fabric Adapter, the EC2 network device that
            lets training processes on different nodes exchange data without passing through the operating
            system&apos;s network stack), placement groups (an EC2 setting for where instances sit relative to each other), capacity
            reservations and user data, the script an instance
            runs at boot. The image is an AMI (Amazon Machine Image, the disk an instance boots from). AWS maintains
            a PCS-ready Deep Learning AMI with the PCS agent, Slurm, NVIDIA drivers and the Lustre client. It ships no
            PyTorch, so the training environment lives on shared storage or in an image you derive from it. <Cite id="F10-210">AWS PCS User Guide, launch template modes</Cite>{' '}
            <Cite id="F10-212">AWS PCS User Guide, Using PCS-ready DLAMI</Cite>
          </Box>
          <Box variant="p">
            <strong>A node</strong> is one EC2 instance in your account running <code>slurmd</code> and the PCS
            agent. Its GPUs appear to Slurm as GRES, detected automatically on Slurm 26.05. PCS switches simultaneous
            multithreading off on every node, so an x86 instance type that advertises 96 vCPUs offers 48 cores to your
            job. <Cite id="F10-236">AWS PCS User Guide, Slurm release notes and custom GRES settings</Cite>{' '}
            <Cite id="F10-213">AWS PCS User Guide, AWS PCS compute node groups</Cite>
          </Box>
          <Box variant="p">
            <strong>The login node</strong> is where people type <code>sbatch</code>. AWS&apos;s suggested form is one
            more compute node group: static, On-Demand, with the same image and file system mounts as the working
            groups. It is attached to no queue, so no job lands on it.{' '}
            <Cite id="F10-227">AWS PCS User Guide, AWS PCS login nodes</Cite>
          </Box>
          <Box variant="p">
            <strong>Shared storage</strong> is whatever each node mounts at boot; PCS has no storage object of its
            own. The AWS tutorial pairs Amazon EFS (Elastic File System, a managed NFS share) for home directories
            with Amazon FSx for Lustre (a managed parallel file system for many nodes reading and writing large files
            at once) for datasets and checkpoints. The mount is a few lines in the launch template&apos;s user data.{' '}
            <Cite id="F10-231">AWS PCS User Guide, Using network file systems with AWS PCS</Cite>
          </Box>
          <Box variant="p">
            <strong>Accounting</strong> is Slurm&apos;s record of who ran what. Switched on, PCS runs the accounting
            database for you and <code>sacct</code> on the login node queries it. <Cite id="F10-226">AWS PCS User Guide, Slurm accounting</Cite>
          </Box>
          <Box variant="p">
            Two sets of states describe a job on its way to a GPU. Slurm reports the job: PD while it waits, CF while
            its nodes are being brought up, R when it runs. PCS reports each node in its scaling log.
          </Box>
          <Figure
            cites="F10-218 F10-219 F10-221"
            caption="Read top to bottom. A dashed box means no instance exists. The job stays in CF until every one of its nodes is ACTIVE, and a node is terminated after it has been idle for the scale-down time, 600 seconds by default."
          >
            <StatesDiagram />
          </Figure>
          <ExpandableSection headerText="Reserved GPUs: capacity reservations, Capacity Blocks and UltraServers">
            <SpaceBetween size="s">
              <Box variant="p">
                Reserved capacity is attached to a group through its launch template. An On-Demand Capacity
                Reservation (ODCR), a hold on instances of one type, is targeted by its ID, which is strict, or
                through a reservation group, which lets PCS launch extra On-Demand instances when the reservation is
                used up.{' '}
                <Cite id="F10-235">AWS PCS User Guide, Using ODCRs with AWS PCS</Cite>
              </Box>
              <Box variant="p">
                A Capacity Block for ML, a block of GPU instances booked for a fixed window, takes a group of its own:
                one group, one block, and a maximum instance count no larger than the block. Until the block starts
                its nodes sit in a Slurm maintenance state. The block ends at 11:30 UTC on its last day, and EC2
                starts terminating its instances 30 minutes earlier, at 11:00 UTC, so a job saves its last checkpoint
                before then. EC2 sends a warning event 40 minutes before the end. Once the instances are gone,
                queued jobs stay pending.{' '}
                <Cite id="F10-234">AWS PCS User Guide, Using Capacity Blocks for ML with AWS PCS</Cite>{' '}
                <Cite id="F09-90">EC2 User Guide, Capacity Blocks for ML</Cite>
              </Box>
              <Box variant="p">
                UltraServers, the P6e-GB200 and P6e-GB300 machines that join many GPUs with NVLink, NVIDIA&apos;s direct
                GPU-to-GPU connection, are attached the same way, as Capacity Block groups. PCS reads the block,
                identifies the UltraServer type and sets up Slurm&apos;s topology plugin itself, so a job is placed
                inside one UltraServer. Two tasks stay with you: jobs must use <code>--exclusive</code>, and you
                supply the script that configures NVIDIA IMEX (Internode Memory Exchange, the service that lets GPUs
                in different nodes share memory) for each job. A P6e-GB200 UltraServer block also ends earlier for
                you: its instances must be terminated at least 60 minutes before the block&apos;s end time.{' '}
                <Cite id="F10-237">AWS PCS User Guide, Configure UltraServer instances</Cite>{' '}
                <Cite id="F09-109">AWS What&apos;s New, 18 June 2026</Cite>{' '}
                <Cite id="F10-341">EC2 User Guide, Capacity Blocks for ML, UltraServer considerations</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Step through one afternoon on the cluster and see which object acts at each moment, including the moment a Spot instance disappears."
          >
            The cluster, drawn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The picture has one queue served by two compute node groups, and a third group that is the login node.
            Because both working groups sit behind the same queue, a job names the group it wants with a Slurm
            feature: each group carries a label, and the job asks for it with <code>--constraint</code>. PCS scales
            by job: at regular intervals it reviews the waiting jobs, launches instances for the nodes Slurm allocated
            to them, and removes instances once they have been idle long enough.{' '}
            <Cite id="F10-217">AWS PCS User Guide, Job-level scaling</Cite>{' '}
            <Cite id="F10-225">AWS PCS User Guide, Custom Slurm settings for compute node groups</Cite>
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="a training job and a Spot job array on PCS"
            cites="F10-208 F10-215 F10-217 F10-218 F10-219 F10-220 F10-221 F10-222 F10-223 F10-225 F10-227 F10-231 F10-233 F10-244 F09-76 F08-45"
            caption={
              <>
                Press Play or Step. T is the training job, drawn once on each node it holds; 1 to 4 are the tasks of
                the job array. Diamonds are checkpoint files. The instance types, the group sizes and the queue name
                are this dive&apos;s choices; the states and timings are the documented ones. The Spot steps are our
                reading, assembled from documented parts.
              </>
            }
          />
          <Box variant="p">
            Three consequences follow. A multi-node job never starts on part of its nodes, so the slowest node to
            boot sets the start time. AWS publishes no nominal figure for that boot; the one documented bound is the
            roughly 30 minutes after which Slurm gives up on a node that has not registered. The idle time is a trade
            you tune per group: at the default of 600 seconds a node bridges a short gap between two jobs, and it
            also runs for 600 seconds after the last one. And storage must be mounted before <code>slurmd</code>{' '}
            starts, because from that moment the scheduler may hand the node a job.{' '}
            <Cite id="F10-221">AWS PCS User Guide, Run a single node job, and bootstrap troubleshooting</Cite>{' '}
            <Cite id="F10-218">AWS PCS API Reference, scaleDownIdleTimeInSeconds</Cite>{' '}
            <Cite id="F10-220">AWS PCS User Guide, node lifecycle actions, how execution works</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one sbatch script from the login node to a checkpoint on the shared file system, then an evaluation array on Spot, with each state you would see in squeue."
          >
            One worked case for the arm, end to end
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The job is world-model training for {TASK}: a model that learns to predict what the cameras will show
            next, trained here on two nodes so that eight GPUs share the work. The user logs in to the login node and
            writes one script.
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
            <code>--nodes=2</code> asks for two nodes and <code>--exclusive</code> for all of each, GPUs included.{' '}
            <code>--constraint=train</code> picks the group. <code>srun</code> starts one process per node. Then:
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
          <ol style={LIST}>
            <li>
              <strong>Pending, then configuring.</strong> The train group is at zero. Slurm allocates the job two
              node names in it and PCS launches an instance for each. <code>squeue</code> shows CF.{' '}
              <Cite id="F10-217">AWS PCS User Guide, Job-level scaling</Cite>
            </li>
            <li>
              <strong>Nodes arrive.</strong> Each instance boots, runs its user data (which mounts FSx for Lustre at{' '}
              <code>/shared</code>), registers through the PCS agent, and starts <code>slurmd</code>. The scaling log
              shows LAUNCHED, REGISTERED, ACTIVE for each. The job stays in CF until both are ACTIVE.{' '}
              <Cite id="F10-219">AWS PCS User Guide, Scaling logs in AWS PCS</Cite>
            </li>
            <li>
              <strong>Running.</strong> State R. Data comes from <code>/shared</code> and checkpoints go back to it,
              so they outlive the nodes. The two nodes reach each other over EFA.{' '}
              <Cite id="F10-233">AWS PCS User Guide, Using EFA with AWS PCS</Cite>
            </li>
            <li>
              <strong>Finished, then zero.</strong> The job ends, and after 600 idle seconds Slurm powers the nodes
              down and PCS terminates the instances. The group is back at zero. <Cite id="F10-218">AWS PCS API Reference, scaleDownIdleTimeInSeconds</Cite>
            </li>
          </ol>
          <Box variant="p">
            <strong>The evaluation array on Spot.</strong> The last line above submits an evaluation as a job array.
            As an illustration, take <Toy>500</Toy> simulated episodes cut into <Toy>50</Toy> array tasks of ten
            episodes each. The cut matters: by our reading each task counts toward the job limit, and a Small
            controller tracks up to 256, so one task per episode would not fit. Each task asks for one GPU on the Spot
            group, whose maximum caps how many run at once; the rest wait in PD.{' '}
            <Cite id="F10-202">AWS PCS User Guide, Cluster size in AWS PCS</Cite>
          </Box>
          <Box variant="p">
            <code>--requeue</code> tells Slurm that a task which loses its node may go back to the queue. PCS
            documents three things here. An instance terminated from outside is logged TERMINATED with the reason
            EXTERNALLY_TERMINATED, and its node is released to be replaced. When a Capacity Block expires, active jobs
            are requeued by default, though they &quot;might have errors or fail&quot;. And on Slurm 25.11 or
            later a requeued job is eligible again after 5 seconds by default (70 seconds on earlier versions), and{' '}
            <code>--requeue=expedite</code> puts it back at the highest priority.{' '}
            <Cite id="F10-222">AWS PCS User Guide, Capacity Blocks FAQ and Scaling logs</Cite>{' '}
            <Cite id="F10-223">AWS PCS User Guide, Slurm release notes</Cite>
          </Box>
          <Box variant="p">
            The PCS User Guide as read on 2026-11-20 has no page that walks through a Spot interruption. It does not
            say whether the two-minute Spot notice drains the node, whether the job receives a signal, or that the job
            is requeued. So treat the requeue of a reclaimed task as expected and unconfirmed, and write the task so
            that it needs no warning: save progress to <code>/shared</code> every few minutes, and at start look for
            a progress file first. A requeued task starts from the first line of its script.{' '}
            <Cite id="F10-244">assembled from the scaling, Spot, requeue and storage pages</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A cluster you can create this week for one arm: which groups, which market for each, which Slurm settings, and why each value."
          >
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            No PCS page read on 2026-11-20 prints a recommended Spot configuration, so the table is our reading:
            each row is our choice, tied to the page that documents the setting. AWS&apos;s own recommendations
            follow the table, in its words.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Value</th>
                  <th style={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Controller size</td>
                  <td style={TD}>Small</td>
                  <td style={TD}>
                    Enough until more than 32 instances or 256 jobs exist at once. It cannot be changed later. <Cite id="F10-202">Cluster size in AWS PCS</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Slurm version</td>
                  <td style={TD}>26.05 or 25.11</td>
                  <td style={TD}>
                    25.05 reaches end of life on 11/30/2026. A cluster can later be upgraded in place without
                    interrupting running jobs. <Cite id="F10-203">Slurm versions in AWS PCS</Cite>{' '}
                    <Cite id="F10-204">Update the scheduler version of a cluster</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Queues and groups</td>
                  <td style={TD}>One group per market and per instance shape; one queue per kind of work once there are several</td>
                  <td style={TD}>
                    A group has one purchase option and one shape. AWS&apos;s own example is an On-Demand queue for
                    high-priority jobs and a Spot queue for low-priority ones.{' '}
                    <Cite id="F10-207">AWS PCS queues</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Spot group</td>
                  <td style={TD}>
                    <code>minInstanceCount</code> 0, several subnets, allocation strategy left at its default
                  </td>
                  <td style={TD}>
                    The default is <code>price-capacity-optimized</code>. Independent tasks do not need EFA, so
                    several subnets only widen the pool.{' '}
                    <Cite id="F10-209">AWS PCS API Reference, SpotOptions</Cite>{' '}
                    <Cite id="F10-232">Creating a compute node group</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Training group</td>
                  <td style={TD}>
                    On-Demand or an ODCR: one subnet, EFA, cluster placement group. On a Capacity Block: one subnet,
                    EFA, no placement group
                  </td>
                  <td style={TD}>
                    A group with more than one subnet loses EFA between its nodes. EC2 does not accept a placement
                    group on an instance launched into a Capacity Block; the block already places its instances close
                    together. <Cite id="F10-232">Creating a compute node group</Cite>{' '}
                    <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>scaleDownIdleTimeInSeconds</code>
                  </td>
                  <td style={TD}>600 (the default) on Spot groups; higher on the training group if jobs follow each other</td>
                  <td style={TD}>
                    A value shorter than the gap between two jobs relaunches the nodes for each job.{' '}
                    <Cite id="F10-218">AWS PCS API Reference, ClusterSlurmConfigurationRequest</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Storage</td>
                  <td style={TD}>FSx for Lustre mounted in user data, same mounts on the login node</td>
                  <td style={TD}>
                    A failed or slow mount can keep instances from ever accepting jobs while they still cost money.{' '}
                    <Cite id="F10-231">Using network file systems with AWS PCS</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Accounting and scaling logs</td>
                  <td style={TD}>Both on</td>
                  <td style={TD}>
                    They are the first-party record of who ran what and of why a node did not arrive.{' '}
                    <Cite id="F10-226">Slurm accounting</Cite> <Cite id="F10-219">Scaling logs</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            In AWS&apos;s words: for the login node, &quot;Choose on-demand purchase option to avoid having your
            instance(s) reclaimed.&quot; <Cite id="F10-227">Using a compute node group to provide login nodes</Cite>{' '}
            For multi-node groups, &quot;We recommended you include a <strong>cluster</strong> placement group when you
            configure an AWS PCS compute node group to use Elastic Fabric Adapter (EFA).&quot;{' '}
            <Cite id="F10-233">Placement groups for EC2 instances in AWS PCS</Cite> And for capacity that can be taken
            back, written about interruptible capacity reservations: &quot;Implement checkpointing so jobs can save
            intermediate results and resume after interruption.&quot;{' '}
            <Cite id="F10-222">Using I-ODCRs with AWS PCS</Cite>
          </Box>
          <Snippet
            title="The cluster"
            mode="adapted"
            source={<Cite id="F10-218">AWS PCS User Guide, Creating a cluster in AWS PCS</Cite>}
            ours={
              <>
                the cluster name, Slurm 26.05, size SMALL, writing the default idle time of 600 out in full, and
                leaving out AWS&apos;s example custom setting.
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
                feature label. Every option name is from the PCS pages; the combination is ours.
              </>
            }
          >
            {CREATE_SPOT_GROUP}
          </Snippet>
          <Box variant="p">
            The command names no AMI and no security group, so the launch template must carry both, or PCS rejects
            the request. <Cite id="F10-342">AWS PCS User Guide, Creating a compute node group in AWS PCS</Cite>{' '}
            A Spot group also has one account prerequisite: the <code>AWSServiceRoleForEC2Spot</code> service-linked role must
            exist in the account before the group is created.{' '}
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
            The first command installs the Lustre client the Amazon Linux 2 way. On Amazon Linux 2023 the FSx for
            Lustre guide installs it with <code>dnf install -y lustre-client</code> instead.{' '}
            <Cite id="F10-345">FSx for Lustre User Guide, Installing the Lustre client</Cite> The PCS-ready Deep
            Learning AMI already carries the client, so on that image delete the line and keep the two mount lines
            (our reading of the two pages together). PCS also runs
            scripts for you at two stages of boot, called node lifecycle actions. If you mount with one, use{' '}
            <code>nodeBootstrapped</code>, the stage that runs before <code>slurmd</code> starts. <Cite id="F10-212">Using PCS-ready DLAMI with AWS PCS</Cite>{' '}
            <Cite id="F10-214">Run custom scripts with node lifecycle actions</Cite>
          </Box>
          <ExpandableSection headerText="The launch template for an EFA group, as AWS prints it">
            <SpaceBetween size="s">
              <Snippet
                title="EFA interfaces and a placement group"
                mode="copied"
                source={<Cite id="F10-233">AWS PCS User Guide, Create or update an EC2 launch template</Cite>}
              >
                {EFA_TEMPLATE}
              </Snippet>
              <Box variant="p">
                Read it as an illustration: the second interface, as the page prints it, lacks a comma after its{' '}
                <code>SubnetId</code> line, and it sits on network card 1, which exists only on instance types with
                more than one network card. The g6e.12xlarge in the figure has one network card, so for it keep the
                first interface only. Security groups are set on each interface, and the placement group goes
                in <code>Placement.GroupId</code>; leave that block out for a Capacity Block group. The{' '}
                <Link href="../efa/">EFA dive</Link> covers what the adapter does for multi-node training.{' '}
                <Cite id="F10-343">EC2 instance types, accelerated computing, network specifications</Cite>{' '}
                <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The sharp edges, each paired with the habit that keeps you clear of it, so none of them surprises you after the cluster exists."
          >
            What it does poorly
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>Design for a Spot loss with no warning.</strong> The pages read on 2026-11-20 document no
              drain, signal or requeue step for a Spot notice. Checkpoint on a timer and resume at start. <Cite id="F10-222">AWS PCS User Guide, pages on losing an instance</Cite>
            </li>
            <li>
              <strong>Plan Spot variety in whole groups.</strong> Every extra market or instance shape is another
              group, and a cluster holds 10 compute node groups and 10 queues by default. <Cite id="F10-239">AWS PCS User Guide, Endpoints and service quotas</Cite>
            </li>
            <li>
              <strong>Size the controller for arrays.</strong> The 256 jobs of a Small controller include pending
              jobs and those completed in the last 5 minutes. Cut large sweeps into fewer, longer tasks, or create
              the cluster one size up. <Cite id="F10-202">AWS PCS User Guide, Cluster size and MaxJobCount</Cite>
            </li>
            <li>
              <strong>Bring your software on an image or a shared directory.</strong> Jobs are processes on the AMI;
              the User Guide read on 2026-11-20 has no page on a container runtime. <Cite id="F10-245">assembled from the PCS User Guide</Cite>
            </li>
            <li>
              <strong>Count cores at half on x86.</strong> With multithreading off, CPU-heavy stages such as video
              decoding see half the advertised vCPUs. Graviton types are unaffected. <Cite id="F10-213">AWS PCS User Guide, AWS PCS compute node groups</Cite>
            </li>
            <li>
              <strong>Budget for the controller.</strong> Compute scales to zero; the controller does not, and it is
              billed by the hour at a rate set by its size. <Cite id="F10-240">AWS PCS pricing page</Cite>
            </li>
          </ul>
          <Box variant="p">
            For teams coming from AWS ParallelCluster, AWS&apos;s other route to a Slurm cluster: the one first-party
            comparison found on 2026-11-20 maps its boot hooks. <code>OnNodeStart</code> corresponds to{' '}
            <code>nodeBootstrapped</code>, <code>OnNodeConfigured</code> to <code>nodeReady</code>, and{' '}
            <code>OnNodeUpdated</code> has no PCS equivalent. ParallelCluster scripts run on every boot; PCS scripts
            run on first boot unless set to <code>EVERY_BOOT</code>. What PCS adds is on its own pages: AWS patches
            the controller, and the Slurm major version can be upgraded in place. No AWS page read that day says
            which of the two to choose. <Cite id="F10-243">AWS PCS User Guide, Node lifecycle action examples</Cite>{' '}
            <Cite id="F10-203">AWS PCS User Guide, Slurm versions in AWS PCS</Cite>{' '}
            <Cite id="F10-204">AWS PCS User Guide, Update the scheduler version</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which neighbour takes the work PCS is the wrong tool for, and the first thing to do if PCS is the right one."
          >
            Where it hands off
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>To section 25, AWS Batch,</strong> for array work packaged as containers with no cluster to
              keep and no controller billed between runs.
            </li>
            <li>
              <strong>To section 27, Amazon SageMaker HyperPod,</strong> for a pool of GPU nodes that is held, health
              checked and repaired for you, with jobs resumed after a node fault.
            </li>
            <li>
              <strong>To section 28, Amazon EKS,</strong> for long-running services, Kubernetes operators, GPUs
              shared between pods, and a documented Spot sequence.
            </li>
            <li>
              <strong>To section 24,</strong> for the capacity markets themselves and for the workflow layer that
              calls a scheduler. A pipeline can submit to PCS without a shell: the managed Slurm REST API accepts jobs
              over HTTP on port 6820, from inside the cluster&apos;s VPC only.{' '}
              <Cite id="F10-229">AWS PCS User Guide, Slurm REST API in AWS PCS</Cite>
            </li>
            <li>
              <strong>To section 29, Choosing,</strong> for the comparison of all four on one job.
            </li>
          </ul>
          <Box variant="p">
            If PCS fits, the next action is small: count the most jobs you will ever have pending at once and
            compare it with 256. That picks the controller size, the one choice you cannot change afterwards. Then
            create the cluster, a login group, and one compute node group with a minimum of 0, and submit the
            two-node script above.{' '}
            <Cite id="F10-202">AWS PCS User Guide, Cluster size in AWS PCS</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
