import type { CSSProperties } from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Snippet } from '../components/Blocks';
import { Cite } from '../components/Cite';
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
/* The cluster figure: one ClusterQueue, a Spot NodePool, an On-Demand one.   */
/* ------------------------------------------------------------------------ */

type Instances = ClusterStep['instances'];

const T0 = 'g6e.xlarge';
const T1 = 'g5.2xlarge';
const T2 = 'g6.xlarge';
const T3 = 'g6e.2xlarge';

/** The four nodes of the sweep once they exist: three Spot types and one On-Demand. */
const FIRST_FOUR = (state: 'launching' | 'running'): Instances => ({
  '0.0': { state, type: T0 },
  '0.1': { state, type: T1 },
  '0.2': { state, type: T2 },
  '1.0': { state, type: T0 },
});

const jobB = (at: (k: number) => JobToken['at'], tone?: JobToken['tone']): JobToken[] => [
  { id: 'p5', label: '5', at: at(0), tone },
  { id: 'p6', label: '6', at: at(1), tone },
];
const B_WAITS = jobB((k) => ({ q: 0, pos: k }));

const SPEC: ClusterSpec = {
  title: 'An EKS cluster running an evaluation sweep on Spot GPU nodes that Karpenter launches and removes',
  desc: 'Jobs wait in a Kueue ClusterQueue. Admitted Jobs create pods, Karpenter launches one-GPU instances for pending pods in a Spot NodePool and an On-Demand NodePool, and pods write checkpoints to Amazon S3.',
  submit: { label: 'kubectl create: two Jobs', sub: 'label kueue.x-k8s.io/queue-name' },
  queues: [{ label: 'Kueue ClusterQueue: 4 GPUs', sub: 'Jobs wait here as Workloads' }],
  scheduler: { label: 'Karpenter + kube-scheduler', sub: 'launch nodes; bind pods to them' },
  done: { label: 'Completed pods' },
  groups: [
    {
      label: 'NodePool gpu-spot (higher weight)',
      sub: ['G family, sizes with one GPU, all zones', 'WhenEmpty; an empty node waits, then goes'],
      market: 'spot',
      gpus: 1,
      places: 4,
      type: T0,
    },
    {
      label: 'NodePool gpu-on-demand (lower weight)',
      sub: ['tried when the Spot NodePool cannot launch'],
      market: 'on-demand',
      gpus: 1,
      places: 1,
      type: T0,
    },
  ],
  stores: [{ label: 'Amazon S3', sub: 'checkpoints' }],
  network: 'One VPC, subnets in every Availability Zone',
  jobNoun: 'one pod',
  steps: [
    {
      caption: (
        <>
          Before any Job, both NodePools hold zero nodes: a NodePool is a set of rules, and Karpenter launches nothing
          until a pod is pending. Two Jobs are ready to submit. Job A will create pods 1 to 4 and Job B pods 5 and 6,
          each pod asking for one GPU.
        </>
      ),
      scheduler: ['no pending pods', 'both NodePools at 0 nodes'],
      instances: {},
      jobs: [
        { id: 'p1', label: '1', at: { submit: 0 } },
        { id: 'p2', label: '2', at: { submit: 1 } },
        { id: 'p3', label: '3', at: { submit: 2 } },
        { id: 'p4', label: '4', at: { submit: 3 } },
        ...jobB((k) => ({ submit: k + 5 })),
      ],
    },
    {
      caption: (
        <>
          Both Jobs carry the Kueue queue label, so Kueue holds them and records each as a Workload. No pod exists
          yet: the tokens in the queue box are the pods each Workload will create once it is admitted.
        </>
      ),
      scheduler: ['no pods exist yet', 'both NodePools at 0 nodes'],
      instances: {},
      jobs: [
        { id: 'p1', label: '1', at: { q: 0, pos: 0 } },
        { id: 'p2', label: '2', at: { q: 0, pos: 1 } },
        { id: 'p3', label: '3', at: { q: 0, pos: 2 } },
        { id: 'p4', label: '4', at: { q: 0, pos: 3 } },
        ...jobB((k) => ({ q: 0, pos: k + 5 })),
      ],
    },
    {
      caption: (
        <>
          Job A fits the quota of 4 GPUs, so Kueue admits it and the Job creates four pods, which are Pending. Job B
          waits. Karpenter&apos;s batch window closes after 1 second with no new pending pod (10 seconds at most); it
          creates four NodeClaims and passes every one-GPU G type the NodePool allows to EC2 Fleet (at most 60 types
          per request). A pending pod is drawn on the outline of the instance requested for it.
        </>
      ),
      scheduler: ['4 pods Pending, batch closed', 'one-GPU G types sent to EC2 Fleet'],
      instances: {
        '0.0': { state: 'launching', type: 'not chosen' },
        '0.1': { state: 'launching', type: 'not chosen' },
        '0.2': { state: 'launching', type: 'not chosen' },
        '0.3': { state: 'launching', type: 'not chosen' },
      },
      jobs: [
        { id: 'p1', label: '1', at: { g: 0, i: 0 } },
        { id: 'p2', label: '2', at: { g: 0, i: 1 } },
        { id: 'p3', label: '3', at: { g: 0, i: 2 } },
        { id: 'p4', label: '4', at: { g: 0, i: 3 } },
        ...B_WAITS,
      ],
    },
    {
      caption: (
        <>
          EC2 Fleet fills three requests with three different G types: the price-capacity-optimized strategy picks
          deep, low-priced pools, which need not be one type. For pod 4 this illustration has no Spot offering left.
          Karpenter caches that answer for 3 minutes and turns to the NodePool with the lower weight, which launches
          On-Demand.
        </>
      ),
      scheduler: ['3 Spot NodeClaims Launched', 'pod 4: no Spot left, On-Demand'],
      instances: FIRST_FOUR('launching'),
      jobs: [
        { id: 'p1', label: '1', at: { g: 0, i: 0 } },
        { id: 'p2', label: '2', at: { g: 0, i: 1 } },
        { id: 'p3', label: '3', at: { g: 0, i: 2 } },
        { id: 'p4', label: '4', at: { g: 1, i: 0 } },
        ...B_WAITS,
      ],
    },
    {
      caption: (
        <>
          Each node joins the cluster (Registered), the NVIDIA device plugin starts on it and advertises one{' '}
          <code>nvidia.com/gpu</code> (Initialized), and kube-scheduler binds a pod to it. The pods run with one GPU
          each. A node that has not registered within 15 minutes is deleted and requested again.
        </>
      ),
      scheduler: ['4 NodeClaims Initialized', 'pods 1 to 4 Running'],
      instances: FIRST_FOUR('running'),
      jobs: [
        { id: 'p1', label: '1', at: { g: 0, i: 0 }, tone: 'running' },
        { id: 'p2', label: '2', at: { g: 0, i: 1 }, tone: 'running' },
        { id: 'p3', label: '3', at: { g: 0, i: 2 }, tone: 'running' },
        { id: 'p4', label: '4', at: { g: 1, i: 0 }, tone: 'running' },
        ...B_WAITS,
      ],
      checkpoints: [{ id: 'ckA', at: { g: 0, i: 1 } }],
    },
    {
      caption: (
        <>
          Every pod writes a checkpoint on a timer to Amazon S3, mounted as a volume. The diamond is the latest
          checkpoint of pod 2. Nothing durable stays on the node, because a reclaimed instance takes its local disks
          with it.
        </>
      ),
      scheduler: ['pods 1 to 4 Running'],
      instances: FIRST_FOUR('running'),
      jobs: [
        { id: 'p1', label: '1', at: { g: 0, i: 0 }, tone: 'running' },
        { id: 'p2', label: '2', at: { g: 0, i: 1 }, tone: 'running' },
        { id: 'p3', label: '3', at: { g: 0, i: 2 }, tone: 'running' },
        { id: 'p4', label: '4', at: { g: 1, i: 0 }, tone: 'running' },
        ...B_WAITS,
      ],
      checkpoints: [{ id: 'ckA', at: { store: 0, pos: 0 } }],
    },
    {
      caption: (
        <>
          EC2 sends the Spot interruption warning for the node under pod 2, two minutes ahead. It reaches Karpenter
          through the interruption queue. Karpenter taints the node and at once does two things in parallel: it
          requests a replacement node and it starts draining the old one. Pod 2 receives SIGTERM and writes a last
          checkpoint.
        </>
      ),
      scheduler: ['Spot notice: node tainted', 'replacement NodeClaim created'],
      instances: { ...FIRST_FOUR('running'), '0.1': { state: 'notice', type: T1 }, '0.3': { state: 'launching', type: T3 } },
      jobs: [
        { id: 'p1', label: '1', at: { g: 0, i: 0 }, tone: 'running' },
        { id: 'p2', label: '2', at: { g: 0, i: 1 }, tone: 'requeued' },
        { id: 'p3', label: '3', at: { g: 0, i: 2 }, tone: 'running' },
        { id: 'p4', label: '4', at: { g: 1, i: 0 }, tone: 'running' },
        ...B_WAITS,
      ],
      checkpoints: [
        { id: 'ckA', at: { store: 0, pos: 0 } },
        { id: 'ckB', at: { g: 0, i: 1 } },
      ],
    },
    {
      caption: (
        <>
          Pod 2 has exited and its last checkpoint is in S3. The Job controller creates a new pod 2, which is Pending
          and drawn on the replacement still launching. EC2 terminates the old instance.
        </>
      ),
      scheduler: ['old node drained and reclaimed', 'new pod 2 Pending'],
      instances: { '0.0': { state: 'running', type: T0 }, '0.2': { state: 'running', type: T2 }, '1.0': { state: 'running', type: T0 }, '0.3': { state: 'launching', type: T3 } },
      jobs: [
        { id: 'p1', label: '1', at: { g: 0, i: 0 }, tone: 'running' },
        { id: 'p2', label: '2', at: { g: 0, i: 3 }, tone: 'requeued' },
        { id: 'p3', label: '3', at: { g: 0, i: 2 }, tone: 'running' },
        { id: 'p4', label: '4', at: { g: 1, i: 0 }, tone: 'running' },
        ...B_WAITS,
      ],
      checkpoints: [
        { id: 'ckA', at: { store: 0, pos: 0 } },
        { id: 'ckB', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          The replacement is Initialized. The new pod 2 starts from the top of its command, reads the checkpoint from
          S3 and continues: resuming is the program&apos;s work. Pods 1 and 3 complete, and the{' '}
          <code>consolidateAfter</code> timer starts on their two empty nodes.
        </>
      ),
      scheduler: ['pod 2 Running from checkpoint', '2 empty nodes: timer running'],
      instances: { '0.0': { state: 'running', type: T0 }, '0.2': { state: 'running', type: T2 }, '1.0': { state: 'running', type: T0 }, '0.3': { state: 'running', type: T3 } },
      jobs: [
        { id: 'p1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'p2', label: '2', at: { g: 0, i: 3 }, tone: 'running' },
        { id: 'p3', label: '3', at: { done: 1 }, tone: 'done' },
        { id: 'p4', label: '4', at: { g: 1, i: 0 }, tone: 'running' },
        ...B_WAITS,
      ],
      checkpoints: [
        { id: 'ckA', at: { store: 0, pos: 0 } },
        { id: 'ckB', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          Pods 2 and 4 complete, so Job A is complete and Kueue releases its quota. Job B is admitted and its two pods
          bind to nodes that are still up, with no launch: a non-zero <code>consolidateAfter</code> keeps an empty
          node for the next Job.
        </>
      ),
      scheduler: ['Job B admitted: pods 5, 6 bound', 'no launch needed'],
      instances: { '0.0': { state: 'running', type: T0 }, '0.2': { state: 'running', type: T2 }, '1.0': { state: 'running', type: T0 }, '0.3': { state: 'running', type: T3 } },
      jobs: [
        { id: 'p1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'p3', label: '3', at: { done: 1 }, tone: 'done' },
        { id: 'p2', label: '2', at: { done: 2 }, tone: 'done' },
        { id: 'p4', label: '4', at: { done: 3 }, tone: 'done' },
        ...jobB((k) => ({ g: 0, i: k * 2 }), 'running'),
      ],
      checkpoints: [
        { id: 'ckA', at: { store: 0, pos: 0 } },
        { id: 'ckB', at: { store: 0, pos: 1 } },
      ],
    },
    {
      caption: (
        <>
          Everything has completed. Each node has stayed empty for the whole <code>consolidateAfter</code> time, so
          WhenEmpty consolidation deletes the empty nodes in parallel. Both NodePools are back at zero nodes, and the
          checkpoints and results stay in S3.
        </>
      ),
      scheduler: ['all nodes empty: deleted', 'both NodePools at 0 nodes'],
      instances: {},
      jobs: [
        { id: 'p1', label: '1', at: { done: 0 }, tone: 'done' },
        { id: 'p3', label: '3', at: { done: 1 }, tone: 'done' },
        { id: 'p2', label: '2', at: { done: 2 }, tone: 'done' },
        { id: 'p4', label: '4', at: { done: 3 }, tone: 'done' },
        ...jobB((k) => ({ done: k + 4 }), 'done'),
      ],
      checkpoints: [
        { id: 'ckA', at: { store: 0, pos: 0 } },
        { id: 'ckB', at: { store: 0, pos: 1 } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Three ways to share one GPU between pods.                                 */
/* ------------------------------------------------------------------------ */

const SHARE_ROWS: { name: string; a: string; b: string; mode: 'turns' | 'together' | 'walls' }[] = [
  { name: 'Time-slicing', a: 'Pods take turns on the whole GPU.', b: 'No memory or compute isolation.', mode: 'turns' },
  { name: 'MPS', a: 'Processes run at the same moment.', b: 'More isolation than time-slicing.', mode: 'together' },
  { name: 'MIG', a: 'The hardware splits one GPU.', b: 'Own memory and compute per part.', mode: 'walls' },
];

function SharingDiagram() {
  const rowH = 84;
  const top = 12;
  const H = top + SHARE_ROWS.length * rowH + 4;
  return (
    <div style={NARROW}>
      <svg viewBox={`0 0 400 ${H}`} role="img" aria-labelledby="eks-sharing-title" style={{ width: '100%', height: 'auto' }}>
        <title id="eks-sharing-title">Three ways to share one GPU between pods: time-slicing, MPS and MIG</title>
        <desc>
          Three rows. Each shows one GPU as a rectangle holding four pods. In the first row one pod is active at a
          time, in the second all four are active, in the third walls divide the GPU into four parts.
        </desc>
        <rect x="0" y="0" width="400" height={H} fill="#fbfbfd" />
        {SHARE_ROWS.map((r, i) => {
          const y = top + i * rowH;
          return (
            <g key={r.name}>
              <text x="12" y={y + 20} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
                {r.name}
              </text>
              <text x="12" y={y + 39} fontFamily="sans-serif" fontSize="12" fill={MUTED}>
                {r.a}
              </text>
              <text x="12" y={y + 56} fontFamily="sans-serif" fontSize="12" fill={MUTED}>
                {r.b}
              </text>
              <rect x="244" y={y + 6} width="144" height="58" rx="6" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
              {[0, 1, 2, 3].map((k) => {
                const active = r.mode !== 'turns' || k === 1;
                return (
                  <rect
                    key={k}
                    x={254 + k * 34}
                    y={y + 22}
                    width="22"
                    height="26"
                    rx="3"
                    fill={active ? '#0972d3' : '#ffffff'}
                    stroke={active ? '#075aa8' : LINE}
                    strokeWidth="1.3"
                    strokeDasharray={active ? undefined : '4 3'}
                  />
                );
              })}
              {r.mode === 'walls' && [1, 2, 3].map((k) => <line key={k} x1={248 + k * 34} y1={y + 6} x2={248 + k * 34} y2={y + 64} stroke={INK} strokeWidth="2.4" />)}
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

const KUEUE_SETUP = `apiVersion: kueue.x-k8s.io/v1beta2
kind: ResourceFlavor
metadata:
  name: "gpu-spot"
spec:
  nodeLabels:
    karpenter.sh/capacity-type: spot
  tolerations:
  - key: "nvidia.com/gpu"
    operator: "Exists"
    effect: "NoSchedule"
---
apiVersion: kueue.x-k8s.io/v1beta2
kind: ClusterQueue
metadata:
  name: "arm-eval"
spec:
  namespaceSelector: {} # match all.
  resourceGroups:
  - coveredResources: ["nvidia.com/gpu"]
    flavors:
    - name: "gpu-spot"
      resources:
      - name: "nvidia.com/gpu"
        nominalQuota: 4
---
apiVersion: kueue.x-k8s.io/v1beta2
kind: LocalQueue
metadata:
  namespace: "arm"
  name: "arm-queue"
spec:
  clusterQueue: "arm-eval"`;

const EVAL_JOB = `apiVersion: batch/v1
kind: Job
metadata:
  generateName: arm-eval-
  namespace: arm
  labels:
    kueue.x-k8s.io/queue-name: arm-queue
spec:
  completionMode: Indexed
  parallelism: 4
  completions: 4
  template:
    spec:
      terminationGracePeriodSeconds: 110
      containers:
      - name: eval
        image: {{your-registry}}/arm-eval:{{tag}}
        command: [ "python", "evaluate.py" ]
        args: [ "--checkpoint-dir", "/ckpt" ]
        resources:
          limits:
            nvidia.com/gpu: "1"
      restartPolicy: Never`;

const TRAINJOB = `apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: my-trainjob
  namespace: my-namespace
spec:
  activeDeadlineSeconds: 3600 # terminate the TrainJob after 1 hour
  runtimeRef:
    name: torch-distributed
    kind: ClusterTrainingRuntime
    apiGroup: trainer.kubeflow.org
  trainer:
    image: docker.io/my-training-image:latest
    command:
      - torchrun
      - train.py`;

const SPOT_NODEPOOL = `apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: gpu-spot
spec:
  weight: 50
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot"]
        - key: karpenter.k8s.aws/instance-category
          operator: In
          values: ["g"]
        - key: karpenter.k8s.aws/instance-generation
          operator: Gt
          values: ["4"]
        - key: karpenter.k8s.aws/instance-gpu-memory
          operator: Gt
          values: ["20480"]
        - key: karpenter.k8s.aws/instance-gpu-count
          operator: In
          values: ["1"]
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]
      taints:
        - key: nvidia.com/gpu
          effect: NoSchedule
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: gpu
      expireAfter: 720h
      terminationGracePeriod: 2h
  limits:
    nvidia.com/gpu: 32
  disruption:
    consolidationPolicy: WhenEmpty
    consolidateAfter: 10m
    budgets:
      - nodes: "100%"
        reasons: ["Empty"]
      - nodes: "0"
        reasons: ["Drifted"]`;

/* ------------------------------------------------------------------------ */
/* The section                                                               */
/* ------------------------------------------------------------------------ */

export function Eks() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Kubernetes taken apart for GPU batch work, so you know what turns a pending pod into a GPU instance, what makes jobs wait their turn, and what happens in the two minutes after a Spot notice (Karpenter v1.15.3, Kueue v0.20.7 and AWS documentation, read 2026-11-20)."
          >
            28. Amazon EKS: Running GPU Jobs on Kubernetes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, placed the workloads. This section takes one scheduler apart:
            Amazon EKS (Elastic Kubernetes Service), the service in which AWS runs the Kubernetes control plane and you
            run pods. The running example is {TASK}: first a simulation and evaluation sweep on Spot, then a multi-node
            training job on capacity that is not taken back.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="After this block you can say in five sentences how a GPU job gets a GPU on Kubernetes, and tell whether your work belongs here."
          >
            What it is and the challenge it meets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Kubernetes was built to keep services running. Left alone it starts every pod it can place, has no notion
            of a job waiting its turn, and does not buy machines. Batch GPU work on EKS is therefore Kubernetes plus
            four pieces, and the whole section follows this chain:
          </Box>
          <ol style={LIST}>
            <li>
              <strong>A pod asks for a GPU as a resource.</strong> Beside CPU and memory, a container writes{' '}
              <code>nvidia.com/gpu: 1</code> in its resource limits. Kubernetes calls this an extended resource: a
              countable thing that a node advertises and a pod claims in whole units.
            </li>
            <li>
              <strong>Pending pods are what makes capacity appear.</strong> A pod that fits no node stays in the state
              Pending. On a GPU cluster that scales from zero, Pending is the request for a machine.
            </li>
            <li>
              <strong>Karpenter turns pending pods into instances.</strong> It is the open-source node autoscaler AWS
              builds: it watches pods the scheduler cannot place, launches EC2 instances that fit them, and removes
              instances no longer needed.
            </li>
            <li>
              <strong>Kueue makes jobs wait before pods exist.</strong> It holds a Job until a quota has room, then
              lets the Job create its pods.
            </li>
            <li>
              <strong>The NVIDIA device plugin makes a GPU visible to pods.</strong> It runs on every GPU node and
              advertises the node&apos;s GPUs under the name <code>nvidia.com/gpu</code>.
            </li>
          </ol>
          <Box variant="small" color="text-body-secondary">
            <Cite id="F10-410">Karpenter v1.15.3 docs, scheduling, Accelerators/GPU Resources</Cite>{' '}
            <Cite id="F10-411">Karpenter v1.15.3 docs, NodeClaims</Cite>{' '}
            <Cite id="F10-451">Kueue v0.20.7 docs, admission</Cite>
          </Box>
          <Box variant="p">
            <strong>Use it when</strong> your team already runs Kubernetes, when batch jobs and long-running services
            must share one pool of GPUs, when several pods should share one GPU, or when you want a Spot interruption
            handled by a documented sequence. The typical moment: two teams, one GPU budget, and an evaluation sweep
            for tonight&apos;s Spot capacity.
          </Box>
          <Box variant="p">
            <strong>Look elsewhere when</strong> you have no cluster and nobody to keep one. Nothing on EKS queues jobs
            until you install and configure Kueue or another scheduler. Section 25, AWS Batch, gives you queues as the
            service, and by our reading it is the shorter path for independent runs.{' '}
            <Cite id="F10-450">Kueue v0.20.7 docs, concepts</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every object you write or see on a GPU cluster, each with the fields that decide what happens to a running job, so a NodePool or a ClusterQueue reads as a short list of choices."
          >
            Its moving parts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">Karpenter: from a pending pod to an instance</Box>
          <Box variant="p">
            Karpenter does nothing until one NodePool exists. <strong>A NodePool says what may be launched.</strong>{' '}
            Its <code>requirements</code> list the allowed instance categories, generations, sizes, zones and capacity
            types. The capacity type is the purchase option: <code>spot</code> (spare capacity that EC2 can take
            back), <code>on-demand</code>, or <code>reserved</code>, which means capacity reservations. Its{' '}
            <code>taints</code> keep other pods off GPU nodes: a taint is a mark on a node that only pods with a
            matching toleration may ignore. Its <code>limits</code> cap what the pool may launch, for example in GPUs;
            with no limit, only the account&apos;s EC2 quota does. Its <code>disruption</code> block says when nodes
            may be removed. <Cite id="F10-401">Karpenter v1.15.3 docs, NodePools</Cite>{' '}
            <Cite id="F10-407">Karpenter v1.15.3 docs, NodePools, spec.limits</Cite>
          </Box>
          <Box variant="p">
            <strong>An EC2NodeClass says how.</strong> It holds the AWS settings a NodePool points at: the machine
            image (an AMI, Amazon Machine Image, the disk an instance boots from), the node&apos;s IAM role, subnets,
            security groups and disks. Three optional fields matter for GPU work.{' '}
            <code>instanceStorePolicy: RAID0</code> joins the instance&apos;s local NVMe disks into one scratch volume.{' '}
            <code>capacityReservationSelectorTerms</code> selects On-Demand Capacity Reservations (a hold on instances
            of one type) and Capacity Blocks for ML (GPU instances booked for a fixed window); Karpenter uses a
            reservation only when it is selected here and the NodePool allows <code>reserved</code>.{' '}
            <code>placementGroupSelector</code> and <code>efa-only</code> network interfaces serve multi-node
            training: EFA (Elastic Fabric Adapter) is the EC2 network device that lets training processes on
            different nodes exchange data without passing through the operating system&apos;s network stack.{' '}
            <Cite id="F10-422">Karpenter v1.15.3 docs, NodeClasses</Cite>{' '}
            <Cite id="F10-424">Karpenter v1.15.3 docs, instanceStorePolicy</Cite>{' '}
            <Cite id="F10-425">Karpenter v1.15.3 docs, capacity reservations</Cite>{' '}
            <Cite id="F10-426">Karpenter v1.15.3 docs, placement groups and network interfaces</Cite>
          </Box>
          <Box variant="p">
            <strong>How Karpenter chooses capacity.</strong> It collects pending pods for a short window (closed after
            1 second without a new pod, 10 seconds at most), packs them by CPU, memory and GPUs onto the smallest
            instance type that fits the batch, adds larger types up to a total of 60, and passes those options to EC2 Fleet, the EC2
            API that fills one request from many instance types. Fleet applies the price-capacity-optimized strategy:
            among the pools with the most spare capacity, take the lowest priced. The more types a NodePool allows,
            the more room EC2 has to keep you running. Each instance is tracked by a <strong>NodeClaim</strong>, which
            passes three stages: Launched, Registered (the node joined the cluster) and Initialized (its resources,
            the GPU included, are ready).{' '}
            <Cite id="F10-404">Karpenter v1.15.3 docs, settings, batching</Cite>{' '}
            <Cite id="F10-403">Karpenter v1.15.3 FAQ, instance type selection</Cite>{' '}
            <Cite id="F10-405">EKS Best Practices Guide, Karpenter</Cite>{' '}
            <Cite id="F10-411">Karpenter v1.15.3 docs, NodeClaims</Cite>
          </Box>
          <Box variant="p">
            <strong>Spot and On-Demand: one NodePool or two.</strong> One NodePool that allows several capacity types
            tries <code>reserved</code>, then <code>spot</code>, then <code>on-demand</code>. When EC2 reports no
            capacity for a type in a zone, Karpenter caches that answer for 3 minutes and falls back &quot;generally
            within milliseconds&quot;. The other form is two NodePools ordered by <code>weight</code>: the higher
            weight is tried first, though batching means the order is not guaranteed. There is no percentage field
            for a Spot share; the one documented method, which Karpenter calls &quot;crude&quot;, spreads pods over a
            label.{' '}
            <Cite id="F10-402">Karpenter v1.15.3 docs, Capacity Type</Cite>{' '}
            <Cite id="F10-408">Karpenter v1.15.3 docs, Weighted NodePools</Cite>{' '}
            <Cite id="F10-409">Karpenter v1.15.3 docs, On-Demand/Spot Ratio Split</Cite>
          </Box>

          <Box variant="h3">Disruption: when Karpenter takes a node away</Box>
          <Box variant="p">
            Karpenter removes nodes to save money (consolidation), because a node is old or its image changed (expiry
            and drift), and because EC2 is taking it back. Six settings decide which of these reach a running GPU job.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>What it does</th>
                  <th style={TH}>For a running GPU job</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>consolidationPolicy</code>
                  </td>
                  <td style={TD}>
                    Which nodes may go to cut cost. <code>WhenEmpty</code>: nodes with no workload pods.{' '}
                    <code>Balanced</code>: nodes where the saving outweighs the disruption.{' '}
                    <code>WhenEmptyOrUnderutilized</code>, the default: any node that can be removed or replaced.
                  </td>
                  <td style={TD}>
                    Only <code>WhenEmpty</code> leaves a running pod alone. By our reading the default can evict a
                    training pod to repack it. <Cite id="F10-412">Karpenter v1.15.3 docs, Consolidation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>consolidateAfter</code>
                  </td>
                  <td style={TD}>
                    A timer that restarts whenever a pod is added to or removed from the node. Default{' '}
                    <code>0s</code>; <code>Never</code> switches consolidation off.
                  </td>
                  <td style={TD}>
                    How long an empty GPU node waits for the next job, and how long you pay for it idle.{' '}
                    <Cite id="F10-412">Karpenter v1.15.3 docs, Consolidation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>budgets</code>
                  </td>
                  <td style={TD}>
                    A rate limit on voluntary disruption: 10% of nodes when unset, none of them with{' '}
                    <code>nodes: &quot;0&quot;</code>.
                  </td>
                  <td style={TD}>
                    Holds back consolidation and drift. It does not stop expiry, a Spot interruption or node repair.{' '}
                    <Cite id="F10-415">Karpenter v1.15.3 docs, Disruption Budgets</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>expireAfter</code>
                  </td>
                  <td style={TD}>
                    The node age at which draining starts, <code>720h</code> (30 days) by default. Budgets cannot slow
                    it.
                  </td>
                  <td style={TD}>
                    A run longer than the node&apos;s remaining life is cut. Our reading: set it above the longest job,
                    or to <code>Never</code> on a training NodePool. <Cite id="F10-416">Karpenter v1.15.3 docs, Expiration</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>terminationGracePeriod</code>
                  </td>
                  <td style={TD}>The bound on a drain. When it elapses, remaining pods are deleted and the instance is terminated.</td>
                  <td style={TD}>
                    The longest a draining node waits for your pod. A Spot reclaim does not wait for it.{' '}
                    <Cite id="F10-416">Karpenter v1.15.3 docs, TerminationGracePeriod</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>karpenter.sh/do-not-disrupt</code>
                  </td>
                  <td style={TD}>
                    A pod annotation, <code>&quot;true&quot;</code> or a duration such as <code>&quot;30m&quot;</code>,
                    that blocks voluntary disruption of the pod&apos;s node. A pod that carries it is also not evicted
                    when its node drains, so on a Spot warning it receives no SIGTERM. Use it on On-Demand and reserved
                    pools, never on a Spot pool whose pods checkpoint on SIGTERM.
                  </td>
                  <td style={TD}>
                    Stops consolidation under the pod. It does not stop expiry, a Spot interruption, node repair or a
                    manual delete. <Cite id="F10-420">Karpenter v1.15.3 docs, Pod-Level Controls</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            <strong>The interruption queue</strong> is how Karpenter hears from EC2: an Amazon SQS queue that Amazon
            EventBridge rules fill with EC2 events, named to the controller with <code>--interruption-queue</code>.
            Without that setting, interruption handling is off. With it, on a Spot interruption warning Karpenter
            starts a replacement node at once and drains the old node in parallel. EC2 can also send an earlier,
            softer signal, the rebalance recommendation, which says an instance is at elevated risk. Karpenter only
            records it as an event on the node, so a job on Karpenter gets the two minutes of the warning and no more.{' '}
            <Cite id="F10-417">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
            <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption, Spot</Cite>{' '}
            <Cite id="F10-419">Karpenter v1.15.3 docs, Spot Rebalance Recommendations</Cite>{' '}
            <Cite id="F10-523">EC2 User Guide, rebalance recommendations</Cite>
          </Box>

          <Box variant="h3">Kueue: jobs wait before pods exist</Box>
          <Box variant="p">
            Kueue (v0.20.7) decides when a Job may create its pods; it places nothing and launches nothing. A{' '}
            <strong>ResourceFlavor</strong> describes one kind of node, for example Spot against On-Demand, through
            node labels and tolerations. A <strong>ClusterQueue</strong> holds a quota per flavor, its{' '}
            <code>nominalQuota</code>. A <strong>LocalQueue</strong> is what a team submits to in its namespace; it
            points at one ClusterQueue. A <strong>Workload</strong> is the unit Kueue admits, one per Job. A Job
            joins with one label, <code>kueue.x-k8s.io/queue-name</code>. When the quota has room, Kueue admits the
            Workload and writes the flavor&apos;s node labels and tolerations into the pod template, so the pods can
            land only on that kind of node. <Cite id="F10-450">Kueue v0.20.7 docs, ResourceFlavor, LocalQueue, Workload</Cite>{' '}
            <Cite id="F10-451">Kueue v0.20.7 docs, admission</Cite>
          </Box>
          <Box variant="p">
            Two features share GPUs between teams. ClusterQueues that name the same <strong>cohort</strong> lend each
            other unused quota, within a <code>borrowingLimit</code> and a <code>lendingLimit</code>.{' '}
            <strong>Preemption</strong> is three fields per ClusterQueue, each <code>Never</code> by default: evict
            lower-priority work in the same queue, take back quota the cohort borrowed, or preempt in order to borrow.{' '}
            <Cite id="F09-55">Kueue v0.20.7 docs, ClusterQueue and Cohort</Cite>{' '}
            <Cite id="F10-452">Kueue v0.20.7 docs, ClusterQueue, Preemption</Cite>
          </Box>
          <Box variant="p">
            Kueue and Karpenter meet at the pending pod. Kueue admits on quota alone; the pods are created, stay
            Pending, and Karpenter launches nodes for them. A Job can therefore be admitted and then wait for Spot
            capacity that is not there. Kueue&apos;s capacity-aware admission check is written for the Kubernetes
            cluster-autoscaler, and no page read on 2026-11-20 states that Karpenter supports it.{' '}
            <Cite id="F10-453">Kueue v0.20.7 docs, ProvisioningRequest admission check</Cite>
          </Box>
          <Box variant="p">
            Three neighbours, one clause each. KAI Scheduler (v0.19.0) replaces kube-scheduler for the pods that name
            it and adds hierarchical queues, fractional GPUs and gang scheduling, in which all of a job&apos;s pods
            are scheduled together or none are. JobSet (v0.13.1) runs a group of Jobs as one unit and on a failure
            recreates them all. Kubeflow Trainer (v2.4.0) builds on JobSet and gives the user one object, a TrainJob,
            that points at an administrator&apos;s runtime template.{' '}
            <Cite id="F10-454">KAI Scheduler v0.19.0 docs, queues and batch</Cite>{' '}
            <Cite id="F10-456">JobSet v0.13.1 README</Cite>{' '}
            <Cite id="F10-457">Kubeflow Trainer v2.4.0 README and runtime guide</Cite>
          </Box>

          <Box variant="h3">The GPU on the node, whole or shared</Box>
          <Box variant="p">
            The EKS-optimised accelerated image carries the NVIDIA driver. The <strong>NVIDIA device plugin</strong>,
            a DaemonSet (one pod on every matching node), advertises the GPUs; Karpenter does not count a GPU node as
            initialized without it. The AL2023 (Amazon Linux) image leaves the plugin for you to install and the
            Bottlerocket NVIDIA image ships it. The <strong>NVIDIA GPU Operator</strong> (v26.7.3) is the larger
            package that installs driver, toolkit, plugin, node labelling and monitoring together; on EKS images its
            driver and toolkit installs must be switched off.{' '}
            <Cite id="F10-440">EKS User Guide, EKS-optimized accelerated AMIs</Cite>{' '}
            <Cite id="F10-410">Karpenter v1.15.3 docs, Accelerators/GPU Resources</Cite>{' '}
            <Cite id="F10-441">NVIDIA GPU Operator documentation, overview</Cite>
          </Box>
          <Box variant="p">
            By default one pod holds whole GPUs. Three mechanisms let several pods share one, which suits small models
            more than training.
          </Box>
          <Figure
            cites="F10-443 F10-444 F10-445"
            caption="Each rectangle is one GPU holding four pods; a filled square is a pod computing at this moment. Illustrative, not measured: four is a drawing choice."
          >
            <SharingDiagram />
          </Figure>
          <ul style={LIST}>
            <li>
              <strong>Time-slicing.</strong> The device plugin advertises several slots per GPU. The EKS guide says
              not to use it for training, and Karpenter still counts every <code>nvidia.com/gpu</code> request as a
              whole physical GPU. <Cite id="F10-443">EKS User Guide, time-slicing with NVIDIA GPUs</Cite>
            </li>
            <li>
              <strong>MPS</strong> (Multi-Process Service). One physical GPU uses either MPS or time-slicing.{' '}
              <Cite id="F10-445">EKS Best Practices Guide, MPS</Cite>
            </li>
            <li>
              <strong>MIG</strong> (Multi-Instance GPU). Among G families it exists on g7 and g7e and is absent on g5,
              g6 and g6e. Karpenter does not launch nodes for MIG claims, so scale from zero does not work for them.{' '}
              <Cite id="F10-444">EKS User Guide, MIG with NVIDIA GPUs</Cite>
            </li>
          </ul>
          <Box variant="p">
            <strong>DRA</strong> (Dynamic Resource Allocation) is the newer Kubernetes API for the device
            plugin&apos;s job: a driver publishes each device with its attributes and a pod claims one by description.
            The EKS guide recommends DRA drivers &quot;for new deployments with Kubernetes versions 1.34 and
            later&quot;. Karpenter supports it from v1.15 behind feature gates and Auto Mode from Kubernetes 1.36. A
            DRA driver and a device plugin for the same device type must never share a node, and GPU sharing through
            the NVIDIA DRA driver is still alpha.{' '}
            <Cite id="F10-442">EKS User Guide, Manage hardware devices on Amazon EKS</Cite>{' '}
            <Cite id="F10-445">EKS User Guide, NVIDIA DRA driver or device plugin</Cite>
          </Box>

          <Box variant="h3">EKS Auto Mode: the Karpenter path, managed</Box>
          <Box variant="p">
            In Auto Mode AWS runs the node layer. <strong>What it manages:</strong> in the guide&apos;s list,
            &quot;compute autoscaling, pod and service networking, application load balancing, cluster DNS, block
            storage, and GPU support&quot;. That covers a managed Karpenter, the node image and its patching, the GPU
            driver and device plugin, Spot interruption handling with no queue to set up, and node repair.{' '}
            <strong>What you still write:</strong> NodePools and a smaller NodeClass. The two built-in NodePools
            launch On-Demand C, M and R instances only, so a GPU pool or a Spot pool is a custom NodePool.{' '}
            <Cite id="F10-430">EKS User Guide, EKS Auto Mode</Cite>{' '}
            <Cite id="F10-431">EKS User Guide, built-in NodePools</Cite>{' '}
            <Cite id="F10-435">EKS User Guide, Create a Node Pool for EKS Auto Mode</Cite>
          </Box>
          <Box variant="p">
            <strong>What it does not let you set:</strong>
          </Box>
          <ul style={LIST}>
            <li>
              The image and node access. AWS chooses the image, and nodes accept neither SSH nor SSM sessions.{' '}
              <Cite id="F10-434">EKS User Guide, Auto Mode managed instances</Cite>
            </li>
            <li>
              The device plugin configuration, so no time-slicing and no MIG.{' '}
              <Cite id="F10-434">EKS User Guide, time-slicing page</Cite>
            </li>
            <li>
              A node lifetime above 21 days. The default is 336 hours (14 days); the 21-day ceiling can be lowered and
              not raised. <Cite id="F10-432">EKS User Guide, Create a Node Pool, Disruption</Cite>
            </li>
            <li>
              How repair behaves: it is always on and cannot be configured.{' '}
              <Cite id="F10-461">EKS User Guide, Automatically repair nodes</Cite>
            </li>
            <li>
              GPU families outside its list. The list read on 2026-11-20 has g4dn, g5, g6, g6e, gr6, g7e and the P
              families from p3 to p6-b300; G7 and the P6e UltraServers are not in it.{' '}
              <Cite id="F10-433">EKS User Guide, Auto Mode supported instance reference</Cite>
            </li>
          </ul>
          <Box variant="p">
            On combining the two: &quot;AWS suggests running either EKS Auto Mode or self-managed Karpenter&quot;.{' '}
            <Cite id="F10-439">EKS User Guide, Auto Mode managed instances</Cite>
          </Box>

          <Box variant="h3">Node health and storage</Box>
          <Box variant="p">
            <strong>Node auto repair.</strong> The EKS node monitoring agent reads node logs and sets conditions; the
            one for GPUs is <code>AcceleratedHardwareReady</code>. It acts on three GPU faults: a double bit memory
            error, an NVLink error (NVLink is NVIDIA&apos;s direct GPU-to-GPU connection) and a critical XID error,
            XID being the NVIDIA driver&apos;s numbered fault report. Thermal and power problems are only reported.
            Repair acts after a wait: 10 minutes for an unhealthy GPU condition on Auto Mode; on self-managed Karpenter
            v1.15.0 and later, 10 minutes when the reason matches an XID repair policy and 30 minutes otherwise. On
            Auto Mode pods are then deleted &quot;with a minimal grace period rather than performing a standard
            drain&quot;; Karpenter v1.15.0 and later gives the pods a grace period of 5 or 10 minutes.{' '}
            <Cite id="F10-460">EKS User Guide, node monitoring agent</Cite>{' '}
            <Cite id="F10-461">EKS User Guide, Automatically repair nodes</Cite>{' '}
            <Cite id="F10-462">EKS User Guide, repair behavior on Karpenter v1.15.0 and later</Cite>{' '}
            <Cite id="F10-467">EKS User Guide, repair wait by condition reason</Cite>
          </Box>
          <Box variant="p">
            <strong>Storage</strong> reaches pods through CSI (Container Storage Interface) drivers, the plug-ins that
            mount storage as volumes. The Mountpoint for Amazon S3 CSI driver (v2.9.2) presents a bucket as a volume,
            with static provisioning only and not every POSIX file operation; the best-practices guide names it as
            the place for checkpoints. The FSx for Lustre CSI driver (v1.12.0) mounts a managed parallel file system,
            standalone or as a cache linked to S3. A node&apos;s local NVMe is scratch space, lost when the instance
            is stopped or terminated. <Cite id="F10-463">EKS User Guide, S3 and FSx for Lustre CSI drivers</Cite>{' '}
            <Cite id="F10-525">EC2 User Guide, Behavior of Spot Instance interruptions</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Step through one evaluation sweep and see which piece acts at each moment, including the two minutes in which a Spot node is drained while its replacement boots."
          >
            The cluster, drawn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The picture has one Kueue ClusterQueue with a quota of 4 GPUs (an illustration), two NodePools and Amazon
            S3. Two Jobs are submitted; each token is one pod. The Spot NodePool is limited to sizes with one GPU, a
            choice with a reason: Karpenter packs a batch onto the smallest type that fits all of it, so four one-GPU
            pods arriving together could otherwise share one four-GPU instance and be interrupted together. To show
            the weighted fallback, the picture lets these pods run on either NodePool.{' '}
            <Cite id="F10-403">Karpenter v1.15.3 FAQ, instance type selection</Cite>{' '}
            <Cite id="F10-408">Karpenter v1.15.3 docs, Weighted NodePools</Cite>
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="an evaluation sweep on Spot with Kueue and Karpenter"
            cites="F10-401 F10-402 F10-403 F10-404 F10-408 F10-410 F10-411 F10-412 F10-413 F10-417 F10-418 F10-450 F10-451 F10-463 F10-520 F10-525 F10-535"
            caption={
              <>
                Press Play or Step. Tokens 1 to 4 are the pods of Job A, 5 and 6 those of Job B; diamonds are
                checkpoints. The instance types, the quota, the missing Spot offering for pod 4 and the order in which
                pods finish are this dive&apos;s illustration; the states, the sequence and the timings are the
                documented ones.
              </>
            }
          />
          <Box variant="p">
            Three consequences follow. First, everything a pod can do about an interruption fits in two minutes, and
            less in practice. On the warning the pod receives SIGTERM, the signal that asks a process to stop, and has
            its <code>terminationGracePeriodSeconds</code> to finish; the default is 30 seconds, and a pod that asks
            for longer than two minutes is cut off when the node goes. The warning itself is sent on a best-effort
            basis: the EC2 guide says an instance can be interrupted &quot;before the warnings can be made
            available&quot;. A checkpoint on SIGTERM is a bonus; the checkpoint on a timer is the one you rely on.{' '}
            <Cite id="F10-535">EKS Best Practices Guide, checkpointing for long running training jobs</Cite>{' '}
            <Cite id="F10-418">EKS Best Practices Guide, Spot considerations</Cite>{' '}
            <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>
          </Box>
          <Box variant="p">
            Second, the time from a pending GPU pod to a running one is not published. The Karpenter documentation
            says its average node startup means the replacement is &quot;generally&quot; ready before EC2 reclaims the
            old node, and gives no number. The one figure printed is sample output in the Auto Mode tutorial: a{' '}
            g6e.2xlarge On-Demand node Ready at an age of 76s, which is an illustration and not a service level.{' '}
            <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
            <Cite id="F10-438">EKS User Guide, Deploy an accelerated workload</Cite>
          </Box>
          <Box variant="p">
            Third, the fallback of pod 4 has a cost beyond its price. For workloads that cannot wait, the EC2 guide discourages
            &quot;attempting to fail over to On-Demand Instances to handle interruptions&quot;, because doing so &quot;can inadvertently drive
            interruptions for your other Spot Instances&quot;. The recommended configuration below therefore pins a
            sweep to Spot and lets it wait.{' '}
            <Cite id="F10-530">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one evaluation sweep from kubectl create to results in S3, with the state you would see at each step, then the same cluster running a training job that must not be moved."
          >
            One worked case for the arm, end to end
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Before a new policy touches the real arm it is tried in simulation: {TASK} is run many times, each time
            from a different random seed, and the successes are counted. The runs are independent, so each seed gets
            its own pod and its own GPU. An administrator sets up the queue once.
          </Box>
          <Snippet
            title="The queue: a Spot flavor, a GPU quota, a queue for the namespace"
            mode="adapted"
            source={<Cite id="F10-450">Kueue v0.20.7, examples/admin/single-clusterqueue-setup.yaml</Cite>}
            ours={
              <>
                the names, the namespace, the flavor&apos;s node label and its toleration for the NodePool&apos;s{' '}
                <code>nvidia.com/gpu</code> taint, and a quota of 4 on{' '}
                <code>nvidia.com/gpu</code> in place of the example&apos;s CPU and memory quotas.
              </>
            }
          >
            {KUEUE_SETUP}
          </Snippet>
          <Box variant="p">
            The flavor&apos;s node label is what pins the sweep to Spot: Kueue copies it into each pod&apos;s node
            selector, and Karpenter reads it as a requirement. Using a flavor this way is our reading of the two
            projects&apos; pages. The user then submits a Job with <code>kubectl create -f</code>: the Job below
            sets <code>generateName</code>, and <code>kubectl apply</code> refuses an object that has no fixed name.{' '}
            <Cite id="F10-451">Kueue v0.20.7 docs, ResourceFlavor and admission</Cite>
          </Box>
          <Snippet
            title="The sweep: four pods, one GPU each"
            mode="adapted"
            source={<Cite id="F10-451">Kueue v0.20.7, examples/jobs/sample-job.yaml</Cite>}
            ours={
              <>
                the names, four pods, the image and command, the GPU limit in place of CPU and memory requests,{' '}
                <code>completionMode: Indexed</code> and a grace period of 110 seconds.
              </>
            }
          >
            {EVAL_JOB}
          </Snippet>
          <Box variant="p">
            The Job runs in indexed mode, the standard Kubernetes form that hands each pod its own number, and the
            program uses that number as its seed. The path <code>/ckpt</code> would be a volume backed by S3 through
            the Mountpoint CSI driver; the volume is left out of the block for length. Then:
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Held, then admitted.</strong> Kueue keeps the Job from starting and records a Workload. When
              the ClusterQueue has 4 GPUs free in the Spot flavor it releases the Job, which creates four pods. They
              are Pending. <Cite id="F10-451">Kueue v0.20.7 docs, admission</Cite>
            </li>
            <li>
              <strong>Requested and launched.</strong> Karpenter batches the pods and calls EC2 Fleet with the
              price-capacity-optimized strategy across the G-family types the NodePool allows. Each NodeClaim goes
              Launched, Registered, Initialized, and the pods run with one GPU each.{' '}
              <Cite id="F10-403">Karpenter v1.15.3 FAQ, instance type selection</Cite>{' '}
              <Cite id="F10-411">Karpenter v1.15.3 docs, NodeClaims</Cite>
            </li>
            <li>
              <strong>Interrupted and checkpointed.</strong> A Spot interruption warning arrives through the
              interruption queue. Karpenter launches a replacement and drains the node in parallel. The pod receives
              SIGTERM and spends its grace period, raised from the default 30 seconds to just under the two minutes,
              writing a last checkpoint to S3. <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
              <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>
            </li>
            <li>
              <strong>Recreated.</strong> The Job controller creates a new pod with the same index, which waits for
              the replacement node, loads the checkpoint and continues. Give the Job a retry limit that tolerates
              several reclaims (our reading). <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption</Cite>
            </li>
            <li>
              <strong>Gone.</strong> The Job completes and Kueue releases the quota. Each node empties, its{' '}
              <code>consolidateAfter</code> timer runs out, and WhenEmpty consolidation deletes it. The results are in
              S3 and the NodePool is at zero. <Cite id="F10-413">Karpenter v1.15.3 docs, Consolidation</Cite>
            </li>
          </ol>
          <Box variant="p">
            <strong>The other mode: a job that must not be moved.</strong> Training a policy across several nodes is
            one program spread over many pods, so losing one node stops them all. It goes on a second NodePool with the
            capacity types <code>reserved</code> and <code>on-demand</code>, with <code>expireAfter</code> set so that
            no node expires under the run, and its pods carry <code>karpenter.sh/do-not-disrupt</code>. The nodes come
            from one EC2NodeClass with <code>efa-only</code> interfaces, and with a cluster placement group when the
            capacity is On-Demand or an On-Demand Capacity Reservation. A Capacity Block takes an EC2NodeClass without
            a placement group, because EC2 does not accept one there.{' '}
            <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite> The user submits one
            object:
          </Box>
          <Snippet
            title="A TrainJob, as the Kubeflow Trainer documentation prints it"
            mode="copied"
            source={<Cite id="F10-457">Kubeflow Trainer v2.4.0, docs/user-guides/trainjob-lifecycle.md</Cite>}
          >
            {TRAINJOB}
          </Snippet>
          <Box variant="p">
            Trainer turns it into a JobSet. If a pod is lost, the JobSet recreates all its Jobs and the trainer
            reloads its checkpoint, which is why one Spot notice would restart every node&apos;s work. The EKS
            best-practices guide calls Spot &quot;not recommended for production-scale training&quot;.{' '}
            <Cite id="F10-456">JobSet v0.13.1 README</Cite>{' '}
            <Cite id="F10-426">Karpenter v1.15.3 docs, placement groups and network interfaces</Cite>{' '}
            <Cite id="F10-534">EKS Best Practices Guide, Spot Instances for GPUs with Karpenter</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A GPU Spot fleet you can apply this week: which node layer, which NodePool settings, how often to checkpoint, and what to do before the first job, with AWS's advice in its own words."
          >
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">What AWS recommends for Spot, in its words:</Box>
          <ul style={LIST}>
            <li>
              The allocation strategy: &quot;We recommend using the <code>price-capacity-optimized</code> strategy
              because this strategy automatically provisions instances from the most-available Spot capacity pools that
              also have the lowest possible price.&quot; Karpenter already applies it.{' '}
              <Cite id="F10-528">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
            </li>
            <li>
              Flexibility: be flexible across &quot;at least 10 instance types for each workload&quot; and all
              Availability Zones. For G instances, &quot;being able to diverse across different instance types, sizes,
              and availability zones is key to being able to stay on Spot for longer.&quot;{' '}
              <Cite id="F10-529">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>{' '}
              <Cite id="F10-534">EKS Best Practices Guide, G instances</Cite>
            </li>
            <li>
              Failing over to On-Demand: discouraged as a way to handle interruptions, as quoted under the picture.{' '}
              <Cite id="F10-530">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
            </li>
            <li>
              Checkpoints: &quot;fast local every 5-30 minutes for transients, durable hourly for major
              failures&quot;, and &quot;Design workloads that can&apos;t be interrupted safely, such as long-running
              training jobs, to checkpoint and resume.&quot;{' '}
              <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>{' '}
              <Cite id="F10-462">EKS User Guide, Automatically repair nodes</Cite>
            </li>
          </ul>
          <Box variant="p">
            The table and the NodePool that follow are our reading: each value is this dive&apos;s choice, tied to the
            page that documents the setting.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Value</th>
                  <th style={TH}>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Node layer</td>
                  <td style={TD}>Auto Mode, unless you need what it does not let you set</td>
                  <td style={TD}>
                    It includes the driver, the device plugin, Spot handling and repair. Choose self-managed Karpenter
                    for GPU sharing, a custom image, G7, or a repair grace period.{' '}
                    <Cite id="F10-430">EKS Auto Mode</Cite> <Cite id="F10-434">Auto Mode managed instances</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Spot and On-Demand</td>
                  <td style={TD}>Two NodePools, chosen by the job through its Kueue flavor</td>
                  <td style={TD}>
                    A mixed pool falls back to On-Demand within milliseconds, which is the fail-over AWS discourages,
                    and it hides which jobs run at full price.{' '}
                    <Cite id="F10-402">Capacity Type</Cite> <Cite id="F10-530">Spot best practices</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>limits</code>
                  </td>
                  <td style={TD}>A GPU count per NodePool</td>
                  <td style={TD}>
                    Without it only the EC2 quota bounds the fleet. The check is eventually consistent, so a fast
                    scale-out can overrun it. <Cite id="F10-407">spec.limits</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>consolidationPolicy</code>
                  </td>
                  <td style={TD}>
                    <code>WhenEmpty</code>
                  </td>
                  <td style={TD}>
                    A running job is never moved to save money. The EKS guide gives the same value for
                    interruption-sensitive jobs, with <code>consolidateAfter: 60m</code>.{' '}
                    <Cite id="F10-428">EKS Best Practices Guide, AI/ML Compute</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>consolidateAfter</code>
                  </td>
                  <td style={TD}>Minutes, tuned to the gap between jobs</td>
                  <td style={TD}>
                    Long enough that the next Job of a sweep reuses a node that already holds the image. Tune it
                    against a node start time you measure. <Cite id="F10-412">Consolidation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Interruption queue</td>
                  <td style={TD}>On, with no Node Termination Handler beside it</td>
                  <td style={TD}>
                    Without the queue Karpenter does not react to the notice. The EKS guide advises against running the
                    two together. <Cite id="F10-417">Interruption</Cite> <Cite id="F10-419">EKS Best Practices Guide, Karpenter</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Checkpoints</td>
                  <td style={TD}>On a timer to S3 or FSx for Lustre, and again on SIGTERM</td>
                  <td style={TD}>
                    The interval is the work lost per reclaim. The warning can be missing, so the SIGTERM checkpoint is
                    never the only one. <Cite id="F10-535">checkpointing</Cite> <Cite id="F10-522">Prepare for Spot Instance interruptions</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Snippet
            title="A GPU Spot NodePool for sweeps (self-managed Karpenter)"
            mode="adapted"
            source={
              <>
                <Cite id="F10-428">EKS Best Practices Guide, GPU Spot NodePool</Cite>{' '}
                <Cite id="F10-470">Karpenter v1.15.3 docs, well-known labels</Cite>
              </>
            }
            ours={
              <>
                the name, the weight, the G category alone, generation above 4, the limit to sizes with one GPU, the
                EC2NodeClass name, the two-hour{' '}
                <code>terminationGracePeriod</code>, the limit of 32 GPUs, <code>WhenEmpty</code> with{' '}
                <code>consolidateAfter: 10m</code>, and the two budgets. Every field name is from the Karpenter pages;
                the combination is ours.
              </>
            }
          >
            {SPOT_NODEPOOL}
          </Snippet>
          <Box variant="p">
            The first budget lets every empty node go at once; the second stops drift from replacing a node under a
            running job. The guide&apos;s own block is written for real-time inference and consolidates underutilized
            nodes after 5 minutes, which suits a service and not a job. For Auto Mode the same NodePool changes in two places: the <code>nodeClassRef</code> names
            group <code>eks.amazonaws.com</code> and kind <code>NodeClass</code>, and instance labels take the{' '}
            <code>eks.amazonaws.com/</code> prefix. No Auto Mode page read on 2026-11-20 prints a GPU Spot NodePool.{' '}
            <Cite id="F10-415">Karpenter v1.15.3 docs, Disruption Budgets</Cite>{' '}
            <Cite id="F10-428">EKS Best Practices Guide, AI/ML Compute</Cite>{' '}
            <Cite id="F10-439">EKS User Guide, Migrate from Karpenter to EKS Auto Mode</Cite>{' '}
            <Cite id="F10-435">EKS User Guide, Cost optimization in EKS Auto Mode</Cite>
          </Box>
          <Box variant="p">
            <strong>Before the first GPU Spot job</strong>, four checks:
          </Box>
          <ol style={LIST}>
            <li>
              Raise the Spot quota. The quota &quot;All G and VT Spot Instance Requests&quot; is counted in vCPUs
              (virtual CPUs) and its printed default is 0, so a new account cannot launch one GPU Spot instance.{' '}
              <Cite id="F10-533">EC2 User Guide, Spot Instance quotas</Cite>
            </li>
            <li>
              Query the Spot placement score, a number from 1 to 10 for how likely a request is to succeed in a Region
              or zone, for the G types your job accepts.{' '}
              <Cite id="F10-532">EC2 User Guide, Spot placement score</Cite>
            </li>
            <li>
              Set no maximum Spot price: with one, instances are &quot;interrupted more frequently&quot;.{' '}
              <Cite id="F10-526">EC2 User Guide, Spot Instance interruptions</Cite>
            </li>
            <li>
              Test an interruption, including one with no warning, before you trust the handler.{' '}
              <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>
            </li>
          </ol>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The sharp edges, each paired with the habit that keeps you clear of it, and the questions the documentation read for this section leaves open."
          >
            What it does poorly
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>Plan for two minutes and no earlier signal.</strong> Karpenter does not act on the rebalance
              recommendation. Checkpoint on a timer. <Cite id="F10-419">Karpenter v1.15.3 docs, Interruption</Cite>
            </li>
            <li>
              <strong>Keep fractional GPUs visible to the autoscaler.</strong> A KAI fractional pod asks for its share
              in an annotation, which a node autoscaler cannot see. KAI&apos;s <code>node-scale-adjuster</code>, off by
              default, must be switched on, or such pods stay Pending on an empty NodePool.{' '}
              <Cite id="F10-455">KAI Scheduler v0.19.0 docs, GPU sharing and autoscaling</Cite>
            </li>
            <li>
              <strong>Treat a GPU fault like a Spot loss.</strong> Repair is forceful and{' '}
              <code>do-not-disrupt</code> does not exclude a node from it. The same checkpoint covers both.{' '}
              <Cite id="F10-462">EKS User Guide, Automatically repair nodes</Cite>
            </li>
            <li>
              <strong>Keep multi-node training off Spot.</strong> One reclaim restarts the whole JobSet. Use
              On-Demand or reserved capacity. <Cite id="F10-456">JobSet v0.13.1 README</Cite>
            </li>
            <li>
              <strong>Count the parts you own.</strong> On self-managed Karpenter you version Karpenter, the image, the
              device plugin or DRA driver, the CSI drivers, the scheduler and the monitoring agent. Auto Mode takes the
              node layer and with it the choices listed above.{' '}
              <Cite id="F10-440">EKS User Guide, accelerated AMIs</Cite>{' '}
              <Cite id="F10-434">EKS User Guide, Auto Mode managed instances</Cite>
            </li>
          </ul>
          <Box variant="p">
            <strong>Open after this research</strong>, each within the pages read on 2026-11-20: the seconds from a
            pending GPU pod to a running one; whether Karpenter supports Kueue&apos;s capacity-aware admission check;
            one checkpoint interval for GPU training on Spot (the pages give ranges); and how often an interruption
            arrives with no warning (the pages give no rate). Measure the first on your own NodePool.{' '}
            <Cite id="F10-438">EKS User Guide, Deploy an accelerated workload</Cite>{' '}
            <Cite id="F10-453">Kueue v0.20.7 docs, ProvisioningRequest</Cite>{' '}
            <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>{' '}
            <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which neighbour takes the work EKS is the wrong tool for, and the first two things to do if EKS is the right one."
          >
            Where it hands off
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>To section 25, AWS Batch,</strong> for independent runs when you want queues, retries and
              scaling as one service and no cluster to keep.
            </li>
            <li>
              <strong>To section 26, AWS Parallel Computing Service,</strong> when the training code arrives as Slurm
              scripts and needs several nodes that start together.
            </li>
            <li>
              <strong>To section 27, Amazon SageMaker HyperPod,</strong> for a held pool of GPU nodes with health
              checks and job resume managed for you; it can run on an EKS control plane.
            </li>
            <li>
              <strong>To section 24,</strong> for the capacity markets themselves, and to section 29, Choosing, for
              all four schedulers compared on one job. The{' '}
              <Link href="../llm-training-systems/">Training at Scale dive</Link> covers checkpointing inside the
              training loop.
            </li>
          </ul>
          <Box variant="p">
            <strong>NVIDIA OSMO on EKS.</strong> OSMO is NVIDIA&apos;s workflow orchestrator for physical AI: one
            pipeline whose tasks run on training, simulation and edge computers. On AWS its documented backend is an
            EKS cluster with PostgreSQL, Redis and S3, and its deploy script installs KAI Scheduler and the GPU
            Operator. Its newest release is 6.3.1. Reach for it when one workflow must chain simulation, training and
            a test on the robot&apos;s own computer.{' '}
            <Cite id="F09-62">NVIDIA OSMO 6.3.1 README</Cite> <Cite id="F09-65">NVIDIA OSMO release notes</Cite>{' '}
            <Cite id="F09-66">NVIDIA OSMO deployment guide for AWS</Cite>{' '}
            <Cite id="F10-458">NVIDIA OSMO release list</Cite>
          </Box>
          <Box variant="p">
            <strong>EKS Hybrid Nodes.</strong> Machines on your premises or at the edge join an EKS cluster as nodes
            while AWS runs the control plane. Two limits decide whether the computer beside the arm can be one: the
            service needs a reliable connection to AWS, and the Hybrid Nodes pages read on 2026-11-20 say nothing
            about GPUs. The Mountpoint for S3 CSI driver does not run on hybrid nodes.{' '}
            <Cite id="F10-466">EKS User Guide, Amazon EKS Hybrid Nodes overview</Cite>{' '}
            <Cite id="F09-119">EKS User Guide, Hybrid Nodes considerations</Cite>
          </Box>
          <Box variant="p">
            If EKS fits, start with two actions that cost nothing. Request an increase of the G Spot quota, whose
            default is 0, and write the checkpoint code so that a pod stopped with two minutes of warning, or none,
            loses only minutes. Then apply one Spot NodePool and one ClusterQueue, and submit the four-pod Job above
            with <code>kubectl create -f</code>, because a Job that uses <code>generateName</code> cannot be applied.{' '}
            <Cite id="F10-533">EC2 User Guide, Spot Instance quotas</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
