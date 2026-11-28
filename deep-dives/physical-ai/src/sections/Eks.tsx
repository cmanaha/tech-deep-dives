import type { CSSProperties } from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
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
      sub: ['G family, sizes with one GPU, all zones', 'WhenEmpty: empty nodes go after a wait'],
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
          Before any Job is submitted, both NodePools hold zero nodes. A NodePool is a set of rules, and Karpenter
          launches nothing until a pod is pending. Two Jobs are ready to submit. Job A will create pods 1 to 4 and Job
          B will create pods 5 and 6, and each pod asks for one GPU.
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
          Both Jobs carry the Kueue queue label, so Kueue holds them and records each one as a Workload. No pod
          exists yet. The tokens in the queue box stand for the pods that each Workload will create once Kueue admits
          it.
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
          Job A fits the quota of 4 GPUs, so Kueue admits it, and the Job creates four pods, which are Pending. Job B
          waits. Karpenter&apos;s batch window closes after 1 second with no new pending pod, or after 10 seconds at
          most. Karpenter then creates four NodeClaims and passes every one-GPU G-family type that the NodePool allows
          to EC2 Fleet, up to 60 types per request. Each pending pod is drawn on the outline of the instance requested
          for it.
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
          EC2 Fleet fills three requests with three different G-family types. Under the price-capacity-optimized
          strategy, EC2 Fleet picks low-priced Spot pools with plenty of spare capacity, and those pools can be of
          different types. In this illustration, no Spot capacity is left for pod 4. Karpenter caches that answer for
          3 minutes and launches an On-Demand Instance from the NodePool with the lower weight.
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
          Each node joins the cluster, and its NodeClaim becomes Registered. The NVIDIA device plugin starts on the
          node and advertises one <code>nvidia.com/gpu</code>, and the NodeClaim becomes Initialized. kube-scheduler
          then binds a pod to the node, and the pods run with one GPU each. A node that has not registered within 15
          minutes is deleted and requested again.
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
          Every pod writes a checkpoint on a timer to Amazon S3, which is mounted in the pod as a volume. The diamond
          is the latest checkpoint of pod 2. Nothing that must survive stays on the node, because the local disks of
          an instance are lost when AWS reclaims it.
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
          EC2 sends the Spot interruption warning for the node that runs pod 2, two minutes before it reclaims the
          instance. The warning reaches
          Karpenter through the interruption queue. Karpenter taints the node and at once does two things in
          parallel: it requests a replacement node, and it starts draining the old one. Pod 2 receives SIGTERM and
          writes a last checkpoint.
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
          Pod 2 has exited, and its last checkpoint is in S3. The Job controller creates a new pod 2, which is Pending
          and is drawn on the replacement node that is still launching. EC2 terminates the old instance.
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
          The replacement node is Initialized. The new pod 2 runs its command from the beginning, reads the
          checkpoint from S3 and continues. Your program has to do the resuming, because Kubernetes only starts the
          pod again. Pods 1 and 3 complete, and the <code>consolidateAfter</code> timer starts on their two empty
          nodes.
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
          Pods 2 and 4 complete, so Job A is complete and Kueue releases its quota. Kueue admits Job B, and its two
          pods bind to nodes that are still running, so no new instance is launched. A <code>consolidateAfter</code>{' '}
          above zero keeps an empty node available for the next Job.
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
          All the pods have completed. Each node has stayed empty for the whole <code>consolidateAfter</code> time,
          so WhenEmpty consolidation deletes the empty nodes in parallel. Both NodePools are back at zero nodes, and
          the checkpoints and results stay in S3.
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
            description="Amazon EKS can run the GPU jobs of a robot learning pipeline once you add a job queue, a node autoscaler and the NVIDIA device plugin to Kubernetes. You will be able to decide when EKS is the right choice, configure it for Spot and reserved GPU capacity, and predict what happens to a running job when AWS reclaims a Spot Instance."
          >
            28. Amazon EKS: Running GPU Jobs on Kubernetes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, matched each workload type to an AWS service. This section
            covers one of those services in depth: Amazon EKS (Elastic Kubernetes Service). In EKS, AWS runs the
            Kubernetes control plane, and you run your pods on nodes in your own account.
          </Box>
          <Box variant="p">
            The running example is {TASK}. In this section, two of the arm&apos;s jobs run on EKS. The first is an
            evaluation sweep in simulation on Spot Instances. The second is a multi-node training job on On-Demand or
            reserved capacity, which AWS does not reclaim. Two add-ons to Kubernetes do most of the work: Karpenter
            launches and removes nodes, and Kueue queues jobs. Everything described here applies to Karpenter v1.15.3
            and Kueue v0.20.7.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="EKS is a good fit for GPU jobs when your team already runs Kubernetes. Use this part to decide which of your workload types to run on EKS and when another AWS service is the better choice."
          >
            When EKS is the right choice
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Kubernetes was built to keep services running. On its own, it starts every pod that it can place, it has
            no way to make a job wait for its turn, and it does not launch new machines. To run batch GPU jobs on EKS,
            you add a job queue, a node autoscaler and a plugin that makes GPUs visible to Kubernetes. The next part
            explains how these pieces work together.
          </Box>
          <Box variant="p">EKS is a good choice for GPU jobs in four situations:</Box>
          <ul style={LIST}>
            <li>
              <strong>Your team already runs Kubernetes.</strong> You add GPU jobs to a platform that the team already
              operates.
            </li>
            <li>
              <strong>Batch jobs and long-running services must share one pool of GPUs.</strong> Kubernetes runs both
              kinds of work on the same nodes.
            </li>
            <li>
              <strong>Several pods should share one GPU.</strong> Three ways to do this on EKS are explained
              further down.
            </li>
            <li>
              <strong>You want Spot interruptions handled in a documented sequence.</strong> When AWS reclaims a Spot
              Instance, Karpenter starts a replacement node while it drains the old node, and the documentation
              describes each step.
            </li>
          </ul>
          <Box variant="p">
            A typical case is two teams that share one GPU budget and want to run an evaluation sweep on Spot
            Instances overnight.
          </Box>
          <Box variant="p">
            Use another service when nobody on your team can run a Kubernetes cluster. EKS does not queue jobs until
            you install and configure a job scheduler such as Kueue.{' '}
            <Cite id="F10-450">Kueue v0.20.7 docs, concepts</Cite>
          </Box>
          <Box variant="p">Three of the five workload types come up in this section:</Box>
          <ul style={LIST}>
            <li>
              <strong>Independent tasks.</strong> In an evaluation sweep, each random seed runs in its own pod and
              does not depend on the others. EKS fits this work well if you already run a cluster, because a job queue
              holds the sweep until GPU quota is free and the pods can run on Spot Instances. If you do not run a
              cluster, section 25, AWS Batch, is usually the simpler choice. It provides queues, retries and scaling
              as one managed service, with no cluster to run.
            </li>
            <li>
              <strong>Multi-node training.</strong> EKS can run it on a separate group of nodes on reserved or
              On-Demand capacity. Spot is not an option, because losing one node restarts the work of every node, and
              the EKS best-practices guide calls Spot &quot;not recommended for production-scale training&quot;.{' '}
              <Cite id="F10-456">JobSet v0.13.1 README</Cite>{' '}
              <Cite id="F10-534">EKS Best Practices Guide, Spot Instances for GPUs with Karpenter</Cite> Two other
              services may fit better. Section 26, AWS Parallel Computing Service, is the closer fit when the training
              code arrives as Slurm scripts and needs several nodes that start together. Section 27, Amazon SageMaker
              HyperPod, gives you a persistent pool of GPU nodes, with health checks and job resume managed for you,
              and it can run on an EKS control plane.
            </li>
            <li>
              <strong>Real-time on the robot.</strong> The policy runs on the onboard computer next to the arm. EKS
              Hybrid Nodes is the EKS feature that joins machines on your premises or at the edge to an EKS cluster as
              nodes, while AWS runs the control plane. If you want the onboard computer to be a hybrid node, three
              facts matter. Hybrid Nodes needs a reliable connection to AWS. As of November 2026, the Hybrid
              Nodes overview and add-ons pages say nothing about GPUs. And the Mountpoint for Amazon S3 CSI (Container
              Storage Interface) driver, which presents an S3 bucket as a volume in a pod, does not run on hybrid
              nodes.{' '}
              <Cite id="F10-466">EKS User Guide, Amazon EKS Hybrid Nodes overview</Cite>{' '}
              <Cite id="F09-119">EKS User Guide, Hybrid Nodes considerations</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Kueue, Karpenter and the NVIDIA device plugin add to Kubernetes what it lacks for GPU batch jobs. Follow a GPU job through five steps, from submission to a running pod on a new GPU instance."
          >
            How a GPU job gets a GPU on EKS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">A GPU job on EKS goes through five steps, in this order:</Box>
          <ol style={LIST}>
            <li>
              <strong>Kueue holds the job until a quota has room.</strong> Kueue is a Kubernetes add-on that queues
              jobs. It keeps a Job from creating its pods until the GPU quota has room, and then lets the Job create
              them.
            </li>
            <li>
              <strong>Each pod asks for a GPU as a resource.</strong> In addition to CPU and memory, the container
              sets <code>nvidia.com/gpu: 1</code> in its resource limits. Kubernetes calls this an extended resource.
              An extended resource is a countable resource beyond CPU and memory that a node advertises and a pod
              claims in whole units.
            </li>
            <li>
              <strong>A pod that fits no node stays Pending.</strong> Pending is the state of a pod that no node can
              hold yet. On a GPU cluster that scales from zero, a pending pod is in effect the request for a new
              machine.
            </li>
            <li>
              <strong>Karpenter launches an instance for the pending pod.</strong> Karpenter is the open-source node
              autoscaler that AWS builds. It watches for pods that the scheduler cannot place, launches EC2 instances
              that fit them, and removes instances that are no longer needed.
            </li>
            <li>
              <strong>The NVIDIA device plugin makes the GPU visible.</strong> The plugin runs on every GPU node and
              advertises the node&apos;s GPUs to Kubernetes under the name <code>nvidia.com/gpu</code>. kube-scheduler,
              the standard Kubernetes scheduler, then binds the pod to the new node, and the pod starts.
            </li>
          </ol>
          <Box variant="small" color="text-body-secondary">
            <Cite id="F10-410">Karpenter v1.15.3 docs, scheduling, Accelerators/GPU Resources</Cite>{' '}
            <Cite id="F10-411">Karpenter v1.15.3 docs, NodeClaims</Cite>{' '}
            <Cite id="F10-451">Kueue v0.20.7 docs, admission</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="These settings let an evaluation sweep run on Spot Instances and lose only the work since its last checkpoint when AWS reclaims an instance. They cover the node layer, the NodePools and the queue, interruption handling, checkpoints and the checks to run before the first job."
          >
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            We chose the values below for GPU batch jobs such as the evaluation sweep, based on the documentation of
            each setting. The objects named here are explained in more detail in the next part.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Node layer: EKS Auto Mode, unless you need a setting that it does not offer.</strong> EKS
              Auto Mode is the EKS option in which AWS runs the node layer for you: the nodes and the software that
              launches, patches and repairs them. It includes the GPU driver, the device plugin, Spot interruption
              handling and node repair. Choose self-managed Karpenter instead if you need GPU sharing, a custom image,
              G7 instances or a grace period for pods during node repair.{' '}
              <Cite id="F10-430">EKS Auto Mode</Cite> <Cite id="F10-434">Auto Mode managed instances</Cite>
            </li>
            <li>
              <strong>Spot and On-Demand: two separate NodePools.</strong> A NodePool is the Karpenter object that
              says which instances Karpenter may launch, how many, and when it may remove them. Create one NodePool for
              Spot Instances and one for On-Demand Instances. You then send each job to one of them through a Kueue
              ResourceFlavor. A ResourceFlavor is the Kueue object that describes one kind of node, such as Spot nodes.
              Avoid a single NodePool that allows both, because when Spot capacity runs out it falls back to On-Demand
              &quot;generally within milliseconds&quot;. That is the fail-over to On-Demand that AWS discourages, and
              it also hides which jobs run at the On-Demand price.{' '}
              <Cite id="F10-402">Capacity Type</Cite> <Cite id="F10-530">Spot best practices</Cite>
            </li>
            <li>
              <strong>A GPU limit on every NodePool.</strong> Set the NodePool&apos;s <code>limits</code> to a number
              of GPUs. Without a limit, only your account&apos;s EC2 quota bounds how many instances the NodePool
              launches. Karpenter checks the limit with eventual consistency, so a fast scale-out can go past it.{' '}
              <Cite id="F10-407">spec.limits</Cite>
            </li>
            <li>
              <strong>
                Consolidation: <code>WhenEmpty</code>.
              </strong>{' '}
              Consolidation is Karpenter removing or replacing nodes to cut cost. With{' '}
              <code>consolidationPolicy: WhenEmpty</code>, Karpenter removes only nodes that run no workload pods, so
              it never moves a running job to save money. The EKS guide gives the same policy for jobs that are
              sensitive to interruption, together with <code>consolidateAfter: 60m</code>. With these two settings,
              Karpenter removes a node once it has been empty for 60 minutes.{' '}
              <Cite id="F10-428">EKS Best Practices Guide, AI/ML Compute</Cite>
            </li>
            <li>
              <strong>
                <code>consolidateAfter</code>: minutes, tuned to the gap between jobs.
              </strong>{' '}
              With <code>WhenEmpty</code>, this setting is how long a node must stay empty before Karpenter removes it.
              Make it long enough that the next Job of a sweep can reuse a node that already holds the container image. Tune it against a node start
              time that you measure on your own NodePool. <Cite id="F10-412">Consolidation</Cite>
            </li>
            <li>
              <strong>Interruption handling: the interruption queue on self-managed Karpenter.</strong> The
              interruption queue is the Amazon SQS queue through which Karpenter receives EC2 events, including the
              Spot interruption warning. Without it, Karpenter does not react to the warning. The AWS Node Termination
              Handler is a separate tool that also reacts to these EC2 events. Do not install it as well, because the
              EKS best-practices guide advises against running it alongside Karpenter&apos;s interruption handling.
              Auto Mode handles Spot interruptions with no queue to set up. <Cite id="F10-417">Interruption</Cite> <Cite id="F10-419">EKS Best Practices Guide, Karpenter</Cite>{' '}
              <Cite id="F10-430">EKS Auto Mode</Cite>
            </li>
            <li>
              <strong>Checkpoints: on a timer to S3 or FSx for Lustre, and again on SIGTERM.</strong> FSx for Lustre
              is a managed parallel file system. When a pod is evicted from a draining node, it receives SIGTERM, the
              signal that asks a process to stop, and it has a grace period in which it can write a last checkpoint.
              The interruption warning can be missing, so the checkpoint written on SIGTERM must never be the only one.
              With checkpoints on a timer, you lose at most the work done since the last checkpoint when AWS reclaims
              an instance. The EKS guide suggests &quot;fast local every 5-30 minutes for transients, durable hourly
              for major failures&quot;. <Cite id="F10-535">checkpointing</Cite>{' '}
              <Cite id="F10-522">Prepare for Spot Instance interruptions</Cite>{' '}
              <Cite id="F10-462">EKS User Guide, Automatically repair nodes</Cite>
            </li>
          </ul>
          <ExpandableSection headerText="Spot Instance advice from AWS, quoted">
            <ul style={LIST}>
              <li>
                On the allocation strategy: &quot;We recommend using the <code>price-capacity-optimized</code>{' '}
                strategy because this strategy automatically provisions instances from the most-available Spot capacity
                pools that also have the lowest possible price.&quot; Karpenter already applies this strategy.{' '}
                <Cite id="F10-528">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
              </li>
              <li>
                On flexibility: be flexible across &quot;at least 10 instance types for each workload&quot; and across
                all Availability Zones. For G instances, &quot;being able to diverse across different instance types,
                sizes, and availability zones is key to being able to stay on Spot for longer.&quot;{' '}
                <Cite id="F10-529">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>{' '}
                <Cite id="F10-534">EKS Best Practices Guide, G instances</Cite>
              </li>
              <li>
                On failing over to On-Demand: AWS discourages it as a way to handle interruptions, because it can drive
                interruptions for your other Spot Instances.{' '}
                <Cite id="F10-530">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
              </li>
              <li>
                On checkpoints: &quot;fast local every 5-30 minutes for transients, durable hourly for major
                failures&quot;, and &quot;Design workloads that can&apos;t be interrupted safely, such as long-running
                training jobs, to checkpoint and resume.&quot;{' '}
                <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>{' '}
                <Cite id="F10-462">EKS User Guide, Automatically repair nodes</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            The NodePool below combines these settings for an evaluation sweep on self-managed Karpenter. The G family
            is the group of EC2 GPU instance families whose names start with g, such as g5, g6, g6e and g7e. The
            NodePool allows only G-family instances with one GPU.
          </Box>
          <Snippet
            title="A GPU Spot NodePool for evaluation sweeps on self-managed Karpenter"
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
                EC2NodeClass name, the two-hour <code>terminationGracePeriod</code>, the limit of 32 GPUs,{' '}
                <code>WhenEmpty</code> with <code>consolidateAfter: 10m</code>, and the two budgets. Every field name
                comes from the Karpenter documentation, and the combination is ours.
              </>
            }
          >
            {SPOT_NODEPOOL}
          </Snippet>
          <Box variant="p">
            The first budget lets Karpenter remove every empty node at once. A node has drifted when it no longer
            matches its NodePool or its image, and Karpenter replaces drifted nodes. The second budget stops Karpenter
            from replacing a drifted node under a running job. The GPU Spot NodePool in the EKS guide is written for
            real-time inference. It consolidates underutilized nodes after 5 minutes, which suits a service but not a
            batch job.{' '}
            <Cite id="F10-415">Karpenter v1.15.3 docs, Disruption Budgets</Cite>{' '}
            <Cite id="F10-428">EKS Best Practices Guide, AI/ML Compute</Cite>
          </Box>
          <Box variant="p">
            On EKS Auto Mode, the same NodePool changes in two places. The <code>nodeClassRef</code> names the group{' '}
            <code>eks.amazonaws.com</code> and the kind <code>NodeClass</code>, and the instance labels take the{' '}
            <code>eks.amazonaws.com/</code> prefix. As of November 2026, the Auto Mode documentation has no example of
            a GPU Spot NodePool.{' '}
            <Cite id="F10-439">EKS User Guide, Migrate from Karpenter to EKS Auto Mode</Cite>{' '}
            <Cite id="F10-435">EKS User Guide, Cost optimization in EKS Auto Mode</Cite>
          </Box>
          <Box variant="p">Before the first GPU job on Spot Instances, make four checks:</Box>
          <ol style={LIST}>
            <li>
              Raise the Spot quota. The quota &quot;All G and VT Spot Instance Requests&quot; is counted in vCPUs
              (virtual CPUs), the unit in which EC2 counts processor capacity. Its documented default is 0, so a new
              account cannot launch even one GPU Spot Instance.{' '}
              <Cite id="F10-533">EC2 User Guide, Spot Instance quotas</Cite>
            </li>
            <li>
              To see where your Spot requests are likely to succeed, query the Spot placement score for the G-family
              types that your job accepts. The score is a number from 1 to 10 that says how likely a Spot request is
              to succeed in a Region or an Availability Zone.{' '}
              <Cite id="F10-532">EC2 User Guide, Spot placement score</Cite>
            </li>
            <li>
              Set no maximum Spot price. With a maximum price, instances are &quot;interrupted more frequently&quot;.{' '}
              <Cite id="F10-526">EC2 User Guide, Spot Instance interruptions</Cite>
            </li>
            <li>
              Test an interruption, including one that arrives with no warning, before you rely on your interruption
              handling.{' '}
              <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>
            </li>
          </ol>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Use this part to read a NodePool, an EC2NodeClass or a ClusterQueue field by field. It explains each object you write or see on a GPU cluster and says which of its fields can stop a running job."
          >
            How each part works
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">Karpenter: from a pending pod to a running instance</Box>
          <Box variant="p">
            Karpenter launches nothing until at least one NodePool exists. A NodePool has four parts that matter for
            GPU jobs:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>requirements</code>
              </strong>{' '}
              list the instance categories, generations, sizes, zones and capacity types that Karpenter may launch.
              The capacity type is the purchase option: <code>spot</code> for Spot Instances, <code>on-demand</code>{' '}
              for On-Demand Instances, or <code>reserved</code> for capacity reservations.{' '}
              <Cite id="F10-401">Karpenter v1.15.3 docs, NodePools</Cite>
            </li>
            <li>
              <strong>
                <code>taints</code>
              </strong>{' '}
              keep other pods off the GPU nodes. A taint is a mark on a node, and only pods that declare a matching
              toleration can be scheduled on a node that carries it.{' '}
              <Cite id="F10-401">Karpenter v1.15.3 docs, NodePools</Cite>
            </li>
            <li>
              <strong>
                <code>limits</code>
              </strong>{' '}
              cap what the NodePool may launch, for example as a number of GPUs. With no limit, only the
              account&apos;s EC2 quota caps it. <Cite id="F10-407">Karpenter v1.15.3 docs, NodePools, spec.limits</Cite>
            </li>
            <li>
              <strong>
                <code>disruption</code>
              </strong>{' '}
              says when Karpenter may remove nodes. The settings in this block are described under Disruption below.{' '}
              <Cite id="F10-401">Karpenter v1.15.3 docs, NodePools</Cite>
            </li>
          </ul>
          <Box variant="p">
            Each NodePool points at an EC2NodeClass, which holds the AWS settings for its nodes: the machine image,
            the node&apos;s IAM role, the subnets, the security groups and the disks.{' '}
            <Cite id="F10-422">Karpenter v1.15.3 docs, NodeClasses</Cite> The machine image is an AMI (Amazon Machine
            Image), the disk image that an instance boots from. Three optional fields of the EC2NodeClass matter for
            GPU jobs:
          </Box>
          <ul style={LIST}>
            <li>
              <code>instanceStorePolicy: RAID0</code> joins the instance&apos;s local NVMe disks into one scratch
              volume. <Cite id="F10-424">Karpenter v1.15.3 docs, instanceStorePolicy</Cite>
            </li>
            <li>
              <code>capacityReservationSelectorTerms</code> selects On-Demand Capacity Reservations and Capacity
              Blocks for ML. An On-Demand Capacity Reservation (ODCR) holds EC2 instances of one type for you. A
              Capacity Block for ML is a set of GPU instances booked for a fixed window. Karpenter uses a reservation
              only when the reservation is selected here and the NodePool allows the <code>reserved</code> capacity
              type. <Cite id="F10-425">Karpenter v1.15.3 docs, capacity reservations</Cite>
            </li>
            <li>
              <code>placementGroupSelector</code> and <code>efa-only</code> network interfaces are for multi-node
              training. EFA (Elastic Fabric Adapter) is the EC2 network device that lets training processes on
              different nodes exchange data without going through the operating system&apos;s network stack.{' '}
              <Cite id="F10-426">Karpenter v1.15.3 docs, placement groups and network interfaces</Cite>
            </li>
          </ul>
          <Box variant="p">
            To choose capacity, Karpenter first collects pending pods for a short time. The batch window closes after
            1 second in which no new pod arrives, or after 10 seconds at most. Karpenter then packs the batch by CPU,
            memory and GPUs onto the smallest instance type that fits all of it. It adds larger instance types to the
            list, up to 60 types in total, and passes the list to EC2 Fleet, the EC2 API that fills one capacity
            request from many instance types. EC2 Fleet applies the price-capacity-optimized allocation strategy:
            among the Spot pools with the most spare capacity, it takes the lowest-priced ones. So the more instance
            types a NodePool allows, the more room EC2 has to keep your jobs running.{' '}
            <Cite id="F10-404">Karpenter v1.15.3 docs, settings, batching</Cite>{' '}
            <Cite id="F10-403">Karpenter v1.15.3 FAQ, instance type selection</Cite>{' '}
            <Cite id="F10-405">EKS Best Practices Guide, Karpenter</Cite>
          </Box>
          <Box variant="p">
            Karpenter tracks each instance with a NodeClaim. A NodeClaim is Karpenter&apos;s record of one instance
            on its way to becoming a node, and it passes through three stages. It is Launched when EC2 has launched the instance, Registered
            when the node has joined the cluster, and Initialized when the node&apos;s resources, including the GPU,
            are ready. <Cite id="F10-411">Karpenter v1.15.3 docs, NodeClaims</Cite>
          </Box>
          <Box variant="p">
            You can offer Karpenter both Spot and On-Demand capacity in two ways. The first is one NodePool that
            allows several capacity types. Karpenter then tries <code>reserved</code> first, then <code>spot</code>,
            then <code>on-demand</code>. When EC2 reports that it has no capacity for an instance type in a zone,
            Karpenter caches that answer for 3 minutes and falls back to the next capacity type &quot;generally within
            milliseconds&quot;. The second way is two NodePools ordered by <code>weight</code>. Karpenter tries the
            NodePool with the higher weight first, but because it batches pods, the order is not guaranteed. Karpenter
            has no field that sets a percentage of Spot capacity. Its documentation describes one method, which it
            calls &quot;crude&quot;: you give the nodes of each NodePool different values of a label and spread the
            pods evenly across those values. <Cite id="F10-402">Karpenter v1.15.3 docs, Capacity Type</Cite>{' '}
            <Cite id="F10-408">Karpenter v1.15.3 docs, Weighted NodePools</Cite>{' '}
            <Cite id="F10-409">Karpenter v1.15.3 docs, On-Demand/Spot Ratio Split</Cite>
          </Box>

          <Box variant="h3">Disruption: when Karpenter removes a node</Box>
          <Box variant="p">
            Karpenter removes a node for one of three reasons. The first is consolidation, which removes a node to
            save money. The second is expiry or drift: the node has reached its maximum age, or it no longer matches
            its configuration. The third is a Spot interruption, when EC2 reclaims the instance. Six settings control
            which of these can stop a running GPU job. The NodePool in the recommended configuration sets five of
            them, and the panel below lists all six with their defaults and their effect on a running job.
          </Box>
          <ExpandableSection headerText="Karpenter disruption settings: what each one does and its default">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 680 }}>
                <thead>
                  <tr>
                    <th style={TH}>Setting</th>
                    <th style={TH}>What it does</th>
                    <th style={TH}>Effect on a running GPU job</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={TD}>
                      <code>consolidationPolicy</code>
                    </td>
                    <td style={TD}>
                      It sets which nodes Karpenter may remove to cut cost. <code>WhenEmpty</code> allows only nodes
                      with no workload pods. <code>Balanced</code> allows nodes where the saving outweighs the
                      disruption. <code>WhenEmptyOrUnderutilized</code>, the default, allows any node that can be
                      removed or replaced.
                    </td>
                    <td style={TD}>
                      Only <code>WhenEmpty</code> leaves running pods alone. So the default can evict a training pod
                      in order to remove or replace its node. <Cite id="F10-412">Karpenter v1.15.3 docs, Consolidation</Cite>
                    </td>
                  </tr>
                  <tr>
                    <td style={TD}>
                      <code>consolidateAfter</code>
                    </td>
                    <td style={TD}>
                      It is a timer that restarts whenever a pod is added to or removed from the node. The default is{' '}
                      <code>0s</code>, and <code>Never</code> turns consolidation off.
                    </td>
                    <td style={TD}>
                      It sets how long an empty GPU node waits for the next job, which is also how long you pay for
                      the node while it is idle. <Cite id="F10-412">Karpenter v1.15.3 docs, Consolidation</Cite>
                    </td>
                  </tr>
                  <tr>
                    <td style={TD}>
                      <code>budgets</code>
                    </td>
                    <td style={TD}>
                      They limit the rate of voluntary disruption. When they are unset, Karpenter disrupts up to 10% of
                      the nodes at a time, and <code>nodes: &quot;0&quot;</code> allows none.
                    </td>
                    <td style={TD}>
                      They hold back consolidation and drift. They do not stop expiry, a Spot interruption or node
                      repair. <Cite id="F10-415">Karpenter v1.15.3 docs, Disruption Budgets</Cite>
                    </td>
                  </tr>
                  <tr>
                    <td style={TD}>
                      <code>expireAfter</code>
                    </td>
                    <td style={TD}>
                      It is the node age at which Karpenter starts draining the node. The default is{' '}
                      <code>720h</code> (30 days), and budgets cannot slow it.
                    </td>
                    <td style={TD}>
                      A run that lasts longer than the node&apos;s remaining life is cut off. Set it above your longest
                      job, or to <code>Never</code> on a training NodePool.{' '}
                      <Cite id="F10-416">Karpenter v1.15.3 docs, Expiration</Cite>
                    </td>
                  </tr>
                  <tr>
                    <td style={TD}>
                      <code>terminationGracePeriod</code>
                    </td>
                    <td style={TD}>
                      It is the longest a drain may take. When it runs out, the remaining pods are deleted and the
                      instance is terminated.
                    </td>
                    <td style={TD}>
                      It is the longest a draining node waits for your pod. A Spot reclaim does not wait for it.{' '}
                      <Cite id="F10-416">Karpenter v1.15.3 docs, TerminationGracePeriod</Cite>
                    </td>
                  </tr>
                  <tr>
                    <td style={TD}>
                      <code>karpenter.sh/do-not-disrupt</code>
                    </td>
                    <td style={TD}>
                      It is a pod annotation, set to <code>&quot;true&quot;</code> or to a duration such as{' '}
                      <code>&quot;30m&quot;</code>, that blocks voluntary disruption of the pod&apos;s node. A pod
                      that carries it is also not evicted when its node drains, so on a Spot warning it receives no
                      SIGTERM. Use it on On-Demand and reserved NodePools, and never on a Spot NodePool whose pods
                      write a checkpoint on SIGTERM.
                    </td>
                    <td style={TD}>
                      It stops consolidation under the pod. It does not stop expiry, a Spot interruption, node repair
                      or a manual delete. <Cite id="F10-420">Karpenter v1.15.3 docs, Pod-Level Controls</Cite>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ExpandableSection>
          <Box variant="p">
            Karpenter receives Spot interruption warnings through the interruption queue. Amazon EventBridge rules fill this
            SQS queue with EC2 events, and you pass its name to the Karpenter controller with{' '}
            <code>--interruption-queue</code>. Without that setting, interruption handling is off. With it, when a Spot
            interruption warning arrives, Karpenter starts a replacement node at once and drains the old node in
            parallel. EC2 can also send an earlier signal, called the rebalance recommendation. It says that an instance
            is at elevated risk of interruption. Karpenter only records the rebalance recommendation as an event on the
            node. So a job on a node that Karpenter manages gets the two minutes of the interruption warning and no
            more.{' '}
            <Cite id="F10-417">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
            <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption, Spot</Cite>{' '}
            <Cite id="F10-419">Karpenter v1.15.3 docs, Spot Rebalance Recommendations</Cite>{' '}
            <Cite id="F10-523">EC2 User Guide, rebalance recommendations</Cite>
          </Box>

          <Box variant="h3">Kueue: holding jobs until GPU quota is free</Box>
          <Box variant="p">
            Kueue decides when a Job may create its pods. It does not place pods and it does not launch nodes. You
            work with four Kueue objects:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>ResourceFlavor.</strong> It describes one kind of node, for example Spot nodes or On-Demand
              nodes, through node labels and tolerations.
            </li>
            <li>
              <strong>ClusterQueue.</strong> It holds a quota for each flavor, in its field <code>nominalQuota</code>.
            </li>
            <li>
              <strong>LocalQueue.</strong> It is the queue that a team submits to in its own namespace, and it points
              at one ClusterQueue.
            </li>
            <li>
              <strong>Workload.</strong> It is the unit that Kueue admits, and Kueue creates one for each Job.
            </li>
          </ul>
          <Box variant="p">
            A Job joins a queue with one label, <code>kueue.x-k8s.io/queue-name</code>. When the quota has room, Kueue
            admits the Workload and writes the flavor&apos;s node labels and tolerations into the pod template, so the
            pods can run only on that kind of node.{' '}
            <Cite id="F10-450">Kueue v0.20.7 docs, ResourceFlavor, LocalQueue, Workload</Cite>{' '}
            <Cite id="F10-451">Kueue v0.20.7 docs, admission</Cite>
          </Box>
          <Box variant="p">
            Two Kueue features let teams share GPUs. The first is the cohort, a group of ClusterQueues that lend each
            other unused quota. A ClusterQueue joins a cohort by naming it, and its <code>borrowingLimit</code> and{' '}
            <code>lendingLimit</code> cap how much it borrows and lends. The second is preemption, in which Kueue evicts
            admitted work to make room. Three fields on each ClusterQueue control it, and each one is{' '}
            <code>Never</code> by default. They let Kueue evict lower-priority work in the same queue, reclaim quota
            that other ClusterQueues in the cohort have borrowed, or preempt work in order to borrow quota. <Cite id="F09-55">Kueue v0.20.7 docs, ClusterQueue and Cohort</Cite>{' '}
            <Cite id="F10-452">Kueue v0.20.7 docs, ClusterQueue, Preemption</Cite>
          </Box>
          <Box variant="p">
            Kueue and Karpenter work at different stages: Kueue decides when pods are created, and Karpenter launches
            nodes for pods that are Pending. Kueue admits a Job on quota alone. After admission, the pods are created
            and stay Pending until Karpenter launches nodes for them. So a Job can be admitted and then wait for Spot
            capacity that is not there. Kueue also has an admission check that waits for capacity, called
            ProvisioningRequest, but it is written for the Kubernetes cluster-autoscaler. As of November 2026, no
            Kueue or Karpenter page states that Karpenter supports it. <Cite id="F10-453">Kueue v0.20.7 docs, ProvisioningRequest admission check</Cite>
          </Box>
          <Box variant="p">Three related projects schedule or group GPU jobs on Kubernetes:</Box>
          <ul style={LIST}>
            <li>
              <strong>KAI Scheduler (v0.19.0)</strong> replaces kube-scheduler for the pods that name it. It adds
              hierarchical queues, fractional GPUs and gang scheduling. Gang scheduling means that all of a job&apos;s
              pods are scheduled together, or none of them are.{' '}
              <Cite id="F10-454">KAI Scheduler v0.19.0 docs, queues and batch</Cite>
            </li>
            <li>
              <strong>JobSet (v0.13.1)</strong> runs a group of Jobs as one unit. When one of them fails, it recreates
              them all. <Cite id="F10-456">JobSet v0.13.1 README</Cite>
            </li>
            <li>
              <strong>Kubeflow Trainer (v2.4.0)</strong> builds on JobSet. It gives the user one object to submit, a
              TrainJob, which points at a runtime template that an administrator provides.{' '}
              <Cite id="F10-457">Kubeflow Trainer v2.4.0 README and runtime guide</Cite>
            </li>
          </ul>

          <Box variant="h3">The GPU on the node: whole or shared</Box>
          <Box variant="p">
            The EKS-optimized accelerated AMI includes the NVIDIA driver. The NVIDIA device plugin advertises the
            node&apos;s GPUs. It runs as a DaemonSet, which is a Kubernetes object that runs one pod on every matching
            node. Karpenter does not count a GPU node as initialized without the plugin. The Amazon Linux image (AL2023)
            image leaves the plugin for you to install, and the Bottlerocket NVIDIA image includes it. The NVIDIA
            GPU Operator (v26.7.3) is a larger package that installs the driver, the toolkit, the device plugin, node
            labelling and monitoring together. On EKS images, you must switch off its driver and toolkit installs.{' '}
            <Cite id="F10-440">EKS User Guide, EKS-optimized accelerated AMIs</Cite>{' '}
            <Cite id="F10-410">Karpenter v1.15.3 docs, Accelerators/GPU Resources</Cite>{' '}
            <Cite id="F10-441">NVIDIA GPU Operator documentation, overview</Cite>
          </Box>
          <Box variant="p">
            By default, each pod holds whole GPUs. Three mechanisms let several pods share one GPU, and they suit small
            models better than training jobs.
          </Box>
          <Figure
            cites="F10-443 F10-444 F10-445"
            caption="Each rectangle is one GPU that holds four pods, and a filled square is a pod that is computing at this moment. The drawing is an illustration, not a measurement, and the number of pods was chosen only for the drawing."
          >
            <SharingDiagram />
          </Figure>
          <ul style={LIST}>
            <li>
              <strong>Time-slicing.</strong> The device plugin advertises several slots for each GPU, and the pods
              take turns on the whole GPU with no memory or compute isolation. The EKS guide says not to use it for
              training. Karpenter still counts every <code>nvidia.com/gpu</code> request as a whole physical GPU.{' '}
              <Cite id="F10-443">EKS User Guide, time-slicing with NVIDIA GPUs</Cite>
            </li>
            <li>
              <strong>MPS (Multi-Process Service).</strong> MPS is an NVIDIA feature that runs several processes on
              one GPU at the same moment. One physical GPU uses either MPS or time-slicing, not both.{' '}
              <Cite id="F10-445">EKS Best Practices Guide, MPS</Cite>
            </li>
            <li>
              <strong>MIG (Multi-Instance GPU).</strong> MIG is a hardware feature that splits one GPU into isolated
              instances, each with its own memory and compute. Among the G families, g7 and g7e have it, and g5, g6
              and g6e do not. Karpenter does not launch nodes for pods that claim MIG instances, so
              scaling from zero does not work for them. <Cite id="F10-444">EKS User Guide, MIG with NVIDIA GPUs</Cite>
            </li>
          </ul>
          <Box variant="p">
            DRA (Dynamic Resource Allocation) is a newer Kubernetes API that does the device plugin&apos;s job in a
            different way. In DRA, a driver publishes each device with its attributes, and a pod claims a device by
            describing what it needs. <Cite id="F10-442">EKS User Guide, Manage hardware devices on Amazon EKS</Cite>
          </Box>
          <ExpandableSection headerText="DRA support on EKS, Karpenter and Auto Mode">
            <Box variant="p">
              The EKS guide recommends DRA drivers &quot;for new deployments with Kubernetes versions 1.34 and
              later&quot;. Karpenter supports DRA from v1.15 behind feature gates, and Auto Mode supports it from
              Kubernetes 1.36. A DRA driver and a device plugin for the same device type must never run on the same
              node. GPU sharing through the NVIDIA DRA driver is still in alpha.{' '}
              <Cite id="F10-442">EKS User Guide, Manage hardware devices on Amazon EKS</Cite>{' '}
              <Cite id="F10-445">EKS User Guide, NVIDIA DRA driver or device plugin</Cite>
            </Box>
          </ExpandableSection>

          <Box variant="h3">Node health and storage</Box>
          <Box variant="p">
            The EKS node monitoring agent reads node logs and sets node conditions. The condition for GPUs is{' '}
            <code>AcceleratedHardwareReady</code>. Node auto repair is the EKS feature that acts on unhealthy node
            conditions. For GPUs, it acts on three faults: a double-bit memory error, an NVLink error and a critical
            XID error. NVLink is NVIDIA&apos;s direct GPU-to-GPU connection. An XID is the NVIDIA driver&apos;s
            numbered report of a GPU fault. Thermal and power problems are only reported, not repaired. <Cite id="F10-460">EKS User Guide, node monitoring agent</Cite>{' '}
            <Cite id="F10-461">EKS User Guide, Automatically repair nodes</Cite>
          </Box>
          <ExpandableSection headerText="Node repair: how long it waits and how it treats pods">
            <Box variant="p">
              Node repair waits before it acts. On Auto Mode, it waits 10 minutes for an unhealthy GPU condition. On
              self-managed Karpenter v1.15.0 and later, it waits 10 minutes when the reason matches an XID repair
              policy, and 30 minutes otherwise. After the wait, Auto Mode deletes the pods &quot;with a minimal grace
              period rather than performing a standard drain&quot;. Karpenter v1.15.0 and later gives the pods a grace
              period of 5 or 10 minutes. <Cite id="F10-460">EKS User Guide, node monitoring agent</Cite>{' '}
              <Cite id="F10-461">EKS User Guide, Automatically repair nodes</Cite>{' '}
              <Cite id="F10-462">EKS User Guide, repair behavior on Karpenter v1.15.0 and later</Cite>{' '}
              <Cite id="F10-467">EKS User Guide, repair wait by condition reason</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Storage reaches pods through CSI drivers. A CSI driver is a plug-in that mounts a storage system into
            pods as volumes. The Mountpoint for Amazon S3 CSI driver (v2.9.2) presents an S3 bucket as a volume. It
            supports only static provisioning, which means that you write the volume definition for each existing
            bucket yourself. It also does not support every POSIX file operation. The EKS best-practices guide names
            it as the place for checkpoints. The FSx for Lustre CSI driver (v1.12.0) mounts an FSx for Lustre file
            system, either standalone or linked to S3 as a cache. A node&apos;s local NVMe disk is scratch space, and
            its data is lost when the instance is stopped or terminated.{' '}
            <Cite id="F10-463">EKS User Guide, S3 and FSx for Lustre CSI drivers</Cite>{' '}
            <Cite id="F10-525">EC2 User Guide, Behavior of Spot Instance interruptions</Cite>
          </Box>

          <Box variant="h3">EKS Auto Mode: what AWS manages and what you cannot change</Box>
          <Box variant="p">
            In Auto Mode, AWS manages &quot;compute autoscaling, pod and service networking, application load
            balancing, cluster DNS, block storage, and GPU support&quot;. For GPU jobs, that covers a managed
            Karpenter, the node image and its patching, the GPU driver and the device plugin, Spot interruption
            handling with no queue to set up, and node repair. You still write NodePools, and a NodeClass that has
            fewer fields than an EC2NodeClass. The
            two built-in NodePools launch only On-Demand C, M and R instances, so a GPU NodePool or a Spot NodePool is
            always a custom NodePool that you write. <Cite id="F10-430">EKS User Guide, EKS Auto Mode</Cite>{' '}
            <Cite id="F10-431">EKS User Guide, built-in NodePools</Cite>{' '}
            <Cite id="F10-435">EKS User Guide, Create a Node Pool for EKS Auto Mode</Cite>
          </Box>
          <Box variant="p">Auto Mode does not let you set five things:</Box>
          <ul style={LIST}>
            <li>
              <strong>The image and node access.</strong> AWS chooses the image, and the nodes accept neither SSH nor
              SSM (AWS Systems Manager) sessions. Systems Manager sessions give shell access to an instance without
              SSH.{' '}
              <Cite id="F10-434">EKS User Guide, Auto Mode managed instances</Cite>
            </li>
            <li>
              <strong>The device plugin configuration.</strong> You cannot configure the device plugin, so
              time-slicing and MIG are not available. <Cite id="F10-434">EKS User Guide, time-slicing page</Cite>
            </li>
            <li>
              <strong>A node lifetime above 21 days.</strong> The default lifetime is 336 hours (14 days). You can
              lower the 21-day maximum, but you cannot raise it.{' '}
              <Cite id="F10-432">EKS User Guide, Create a Node Pool, Disruption</Cite>
            </li>
            <li>
              <strong>How repair behaves.</strong> Node repair is always on and cannot be configured.{' '}
              <Cite id="F10-461">EKS User Guide, Automatically repair nodes</Cite>
            </li>
            <li>
              <strong>GPU families outside its list.</strong> As of November 2026, the list contains g4dn, g5, g6,
              g6e, gr6, g7e and the P families from p3 to p6-b300. G7 and the P6e UltraServers are not in it. An
              UltraServer is a P6e machine that joins many GPUs with NVLink.{' '}
              <Cite id="F10-433">EKS User Guide, Auto Mode supported instance reference</Cite>
            </li>
          </ul>
          <Box variant="p">
            AWS advises choosing one of the two node layers: &quot;AWS suggests running either EKS Auto Mode or
            self-managed Karpenter&quot;. <Cite id="F10-439">EKS User Guide, Auto Mode managed instances</Cite>
          </Box>
          <Box variant="p">
            On self-managed Karpenter, you choose and update the versions of every part yourself: Karpenter, the node
            image, the device plugin or DRA driver, the CSI drivers, the job scheduler and the node monitoring agent.
            Auto Mode takes over the node layer, and with it the choices listed above.{' '}
            <Cite id="F10-440">EKS User Guide, accelerated AMIs</Cite>{' '}
            <Cite id="F10-434">EKS User Guide, Auto Mode managed instances</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Step through the figure to see which component acts at each moment of an evaluation sweep. It includes the two minutes in which Karpenter drains a Spot node while the replacement node starts."
          >
            One evaluation sweep on the cluster, step by step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The figure shows one Kueue ClusterQueue, two NodePools and Amazon S3. The ClusterQueue has a quota of 4
            GPUs, a value chosen for the illustration. Two Jobs are submitted, and each token in the figure is one
            pod. The Spot NodePool allows only instance sizes with one GPU, because Karpenter packs a batch onto the
            smallest instance type that fits all of it. Without that limit, four one-GPU pods that arrive together
            could share one four-GPU instance and all be interrupted together. To show the fallback between weighted
            NodePools, the figure lets these pods run on either NodePool. <Cite id="F10-403">Karpenter v1.15.3 FAQ, instance type selection</Cite>{' '}
            <Cite id="F10-408">Karpenter v1.15.3 docs, Weighted NodePools</Cite>
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="an evaluation sweep on Spot with Kueue and Karpenter"
            cites="F10-401 F10-402 F10-403 F10-404 F10-408 F10-410 F10-411 F10-412 F10-413 F10-417 F10-418 F10-450 F10-451 F10-463 F10-520 F10-525 F10-535"
            caption={
              <>
                Press Play or Step. Tokens 1 to 4 are the pods of Job A, and tokens 5 and 6 are the pods of Job B.
                Diamonds are checkpoints. The instance types, the quota, the missing Spot capacity for pod 4 and the
                order in which the pods finish are illustrations chosen for this figure. The states, the sequence and
                the timings follow the documentation.
              </>
            }
          />
          <Box variant="p">
            The sweep shows three things. First, everything a pod does in response to an interruption has to fit into
            the two minutes of warning, and in practice into less. When the warning arrives, the pod receives SIGTERM
            and has its{' '}
            <code>terminationGracePeriodSeconds</code> to finish. The default is 30 seconds, and a pod that asks for
            more than two minutes is cut off when the node goes away. EC2 sends the warning itself on a best-effort
            basis, and the EC2 guide says an instance can be interrupted &quot;before the warnings can be made
            available&quot;. So treat the checkpoint written on SIGTERM as an extra, and rely on the checkpoint written
            on a timer. <Cite id="F10-535">EKS Best Practices Guide, checkpointing for long running training jobs</Cite>{' '}
            <Cite id="F10-418">EKS Best Practices Guide, Spot considerations</Cite>{' '}
            <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>
          </Box>
          <Box variant="p">
            Second, as of November 2026, the documentation gives no figure for the time from a pending GPU pod to a
            running one. The Karpenter documentation says that, given its average node startup time, the replacement
            node is &quot;generally&quot; ready before EC2 reclaims the old node, but it gives no number. The only
            figure in the documentation is sample output in the Auto Mode tutorial: a g6e.2xlarge On-Demand node that
            is Ready at an age of 76s. That is an example, not a service level.{' '}
            <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
            <Cite id="F10-438">EKS User Guide, Deploy an accelerated workload</Cite>
          </Box>
          <Box variant="p">
            Third, the fallback of pod 4 to On-Demand has a cost beyond the higher price. For workloads that cannot
            wait, the EC2 guide discourages &quot;attempting to fail over to On-Demand Instances to handle
            interruptions&quot;, because doing so &quot;can inadvertently drive interruptions for your other Spot
            Instances&quot;. A sweep can wait, so the recommended configuration keeps it on Spot Instances and lets it
            wait for capacity instead of failing over.{' '}
            <Cite id="F10-530">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Follow one evaluation sweep from kubectl create to results in S3, with the state you would see at each stage. Then see how the same cluster runs a multi-node training job that must not be interrupted."
          >
            Worked example: the sweep&apos;s configuration and a multi-node training job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">The evaluation sweep</Box>
          <Box variant="p">
            Before a new policy controls the real arm, you test it in simulation. The job runs a simulated copy of{' '}
            {TASK}. The simulated arm attempts the task many times, each time from a different random seed, and the
            job counts the successes. The attempts are independent, so each seed gets its own pod and its own GPU. An
            administrator sets up the queue once.
          </Box>
          <Snippet
            title="The queue: a Spot flavor, a GPU quota and a LocalQueue for the team's namespace"
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
            The flavor&apos;s node label is what keeps the sweep on Spot Instances. Kueue copies the label into each
            pod&apos;s node selector, and Karpenter reads it as a requirement when it launches a node. We derived this
            use of a flavor from the documentation of the two projects. You then submit the Job with{' '}
            <code>kubectl create -f</code> and not with <code>kubectl apply</code>. The Job below sets{' '}
            <code>generateName</code> instead of a fixed name, and <code>kubectl apply</code> refuses an object that
            has no fixed name.{' '}
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
            The Job runs in indexed mode, a standard Kubernetes mode that gives each pod its own index number. The
            program uses that number as its random seed. In a real setup, the path <code>/ckpt</code> is a volume
            backed by S3 through the Mountpoint CSI driver. The snippet leaves out the volume definition to keep it
            short. The sweep then goes through five stages:
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Kueue holds the Job, then admits it.</strong> Kueue keeps the Job from starting and records a
              Workload for it. When the ClusterQueue has 4 GPUs free in the Spot flavor, Kueue releases the Job, which
              creates four pods. The pods are Pending. <Cite id="F10-451">Kueue v0.20.7 docs, admission</Cite>
            </li>
            <li>
              <strong>Karpenter launches the nodes.</strong> Karpenter batches the pending pods and calls EC2 Fleet
              with the price-capacity-optimized strategy across the G-family types that the NodePool allows. Each
              NodeClaim goes through Launched, Registered and Initialized, and then the pods run with one GPU each.{' '}
              <Cite id="F10-403">Karpenter v1.15.3 FAQ, instance type selection</Cite>{' '}
              <Cite id="F10-411">Karpenter v1.15.3 docs, NodeClaims</Cite>
            </li>
            <li>
              <strong>A Spot interruption arrives, and the pod writes a checkpoint.</strong> A Spot interruption
              warning reaches Karpenter through the interruption queue. Karpenter launches a replacement node and
              drains the old one in parallel. The pod receives SIGTERM. It spends its grace period, which the Job
              raises from the default 30 seconds to just under two minutes, writing a last checkpoint to S3.{' '}
              <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
              <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>
            </li>
            <li>
              <strong>The Job controller recreates the pod.</strong> The Job controller creates a new pod with the same
              index. The new pod waits for the replacement node, loads the checkpoint and continues. Give the Job a
              retry limit that allows for several reclaims.{' '}
              <Cite id="F10-418">Karpenter v1.15.3 docs, Interruption</Cite>
            </li>
            <li>
              <strong>Karpenter removes the empty nodes.</strong> The Job completes and Kueue releases the quota. Each
              node becomes empty, its <code>consolidateAfter</code> timer runs out, and WhenEmpty consolidation deletes
              it. The results are in S3, and the NodePool is back at zero nodes.{' '}
              <Cite id="F10-413">Karpenter v1.15.3 docs, Consolidation</Cite>
            </li>
          </ol>

          <Box variant="h3">A multi-node training job on the same cluster</Box>
          <Box variant="p">
            Training a policy across several nodes runs one program spread over many pods, so losing one node stops
            all of them. Run this job on a second NodePool that allows only the capacity types <code>reserved</code>{' '}
            and <code>on-demand</code>. Set its <code>expireAfter</code> so that no node expires during the run, and
            give its pods the <code>karpenter.sh/do-not-disrupt</code> annotation. The nodes come from one
            EC2NodeClass with <code>efa-only</code> network interfaces. When the capacity is On-Demand or an
            On-Demand Capacity Reservation, that EC2NodeClass also selects a cluster placement group. A Capacity Block
            needs an EC2NodeClass without a placement group, because EC2 does not accept a placement group for a
            Capacity Block. <Cite id="F09-92">EC2 User Guide, Capacity Blocks for ML, considerations</Cite> You then
            submit a single object, a TrainJob:
          </Box>
          <Snippet
            title="A TrainJob, as the Kubeflow Trainer documentation prints it"
            mode="copied"
            source={<Cite id="F10-457">Kubeflow Trainer v2.4.0, docs/user-guides/trainjob-lifecycle.md</Cite>}
          >
            {TRAINJOB}
          </Snippet>
          <Box variant="p">
            Kubeflow Trainer turns the TrainJob into a JobSet. If a pod is lost, the JobSet recreates all of its Jobs
            and the trainer reloads its checkpoint. That is why one Spot interruption would restart the work of every
            node. The EKS best-practices guide calls Spot &quot;not recommended for production-scale training&quot;.{' '}
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
            description="For each failure below, you see the sign that shows it on the cluster and the setting or habit that prevents it. At the end are the questions that the documentation leaves open."
          >
            What fails, and how you notice it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>Less warning than you planned for.</strong> Karpenter does not act on the rebalance
              recommendation, and the only sign of it on the cluster is an event on the node. So a job gets at most
              the two-minute interruption warning, and the warning can also be missing. Write checkpoints on a timer,
              so that you lose at most one checkpoint interval of work when AWS reclaims an instance.{' '}
              <Cite id="F10-419">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
              <Cite id="F10-522">EC2 User Guide, Prepare for Spot Instance interruptions</Cite>
            </li>
            <li>
              <strong>Pods that stay Pending after Kueue admits their Job.</strong> Kueue admits a Job on quota alone,
              so when no Spot capacity is available, the Job&apos;s pods are created and stay Pending. The sign is a
              Job that Kueue has admitted while its pods are still Pending. Kueue&apos;s ProvisioningRequest
              admission check is written for the Kubernetes cluster-autoscaler, and as of November 2026 the
              documentation does not state that Karpenter supports it. To make Spot capacity easier to find, let the NodePool accept
              more instance types and all Availability Zones, as AWS advises for Spot.{' '}
              <Cite id="F10-453">Kueue v0.20.7 docs, ProvisioningRequest</Cite>{' '}
              <Cite id="F10-529">EC2 User Guide, Best practices for Amazon EC2 Spot</Cite>
            </li>
            <li>
              <strong>A running job removed by consolidation or by expiry.</strong> With the default{' '}
              <code>consolidationPolicy</code>, <code>WhenEmptyOrUnderutilized</code>, Karpenter can evict a training
              pod in order to remove or replace its node. With the default <code>expireAfter</code> of <code>720h</code> (30 days),
              Karpenter starts draining a node at that age even under a running job, and disruption budgets cannot
              slow it. The sign is a pod that was replaced although no Spot interruption occurred. Set{' '}
              <code>consolidationPolicy: WhenEmpty</code>, and set <code>expireAfter</code> above your longest job or
              to <code>Never</code> on a training NodePool.{' '}
              <Cite id="F10-412">Karpenter v1.15.3 docs, Consolidation</Cite>{' '}
              <Cite id="F10-416">Karpenter v1.15.3 docs, Expiration</Cite>
            </li>
            <li>
              <strong>A pod that receives no SIGTERM, or runs out of time.</strong> A pod that carries{' '}
              <code>karpenter.sh/do-not-disrupt</code> is not evicted when its node drains. So on a Spot warning it
              receives no SIGTERM and cannot write a last checkpoint. A pod whose{' '}
              <code>terminationGracePeriodSeconds</code> is longer than two minutes is cut off when the Spot node goes
              away. Use the annotation only on On-Demand and reserved NodePools, and keep the grace period under two
              minutes on Spot. <Cite id="F10-420">Karpenter v1.15.3 docs, Pod-Level Controls</Cite>{' '}
              <Cite id="F10-418">EKS Best Practices Guide, Spot considerations</Cite>{' '}
              <Cite id="F10-535">EKS Best Practices Guide, checkpointing</Cite>
            </li>
            <li>
              <strong>No reaction to interruptions on self-managed Karpenter.</strong> Without the{' '}
              <code>--interruption-queue</code> setting, interruption handling is off. Karpenter then neither starts a
              replacement node early nor drains the old node when the warning arrives. Set the interruption queue on
              self-managed Karpenter. Auto Mode handles Spot interruptions with no queue to set up.{' '}
              <Cite id="F10-417">Karpenter v1.15.3 docs, Interruption</Cite>{' '}
              <Cite id="F10-430">EKS User Guide, EKS Auto Mode</Cite>
            </li>
            <li>
              <strong>Fractional GPU pods that never get a node.</strong> A KAI Scheduler pod that asks for a fraction
              of a GPU states its share in an annotation, which a node autoscaler cannot see. Such pods stay Pending on
              an empty NodePool unless you switch on KAI&apos;s <code>node-scale-adjuster</code>, which is off by
              default. <Cite id="F10-455">KAI Scheduler v0.19.0 docs, GPU sharing and autoscaling</Cite>
            </li>
            <li>
              <strong>A GPU fault.</strong> Node repair handles a GPU fault forcefully, and{' '}
              <code>do-not-disrupt</code> does not protect a node from it. The node monitoring agent reports GPU
              health in the node condition <code>AcceleratedHardwareReady</code>, so that condition is where you see
              the fault. Treat a GPU fault like the loss of a Spot Instance: the same timer checkpoint covers both.{' '}
              <Cite id="F10-462">EKS User Guide, Automatically repair nodes</Cite>{' '}
              <Cite id="F10-460">EKS User Guide, node monitoring agent</Cite>
            </li>
            <li>
              <strong>Multi-node training on Spot Instances.</strong> One reclaim restarts the whole JobSet, so every
              node goes back to the last checkpoint. Run multi-node training on On-Demand or reserved capacity.{' '}
              <Cite id="F10-456">JobSet v0.13.1 README</Cite>
            </li>
          </ul>
          <Box variant="p">
            As of November 2026, the documentation leaves four questions open. It gives no time in seconds from a
            pending GPU pod to a running one. It does not say whether Karpenter supports Kueue&apos;s
            ProvisioningRequest admission check. For the checkpoint interval of GPU training on Spot, it gives ranges
            and not one value.
            And it gives no rate for interruptions that arrive with no warning. You can measure the first one on your
            own NodePool. <Cite id="F10-438">EKS User Guide, Deploy an accelerated workload</Cite>{' '}
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
            description="See when NVIDIA OSMO on EKS is worth adding and where to read further. If EKS fits your jobs, start with the two actions at the end, which cost nothing."
          >
            Related tools and first steps
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA OSMO is NVIDIA&apos;s workflow orchestrator for physical AI. In OSMO, one pipeline can run its tasks
            on training, simulation and edge computers. On AWS, its documented backend is an EKS cluster with
            PostgreSQL, Redis and S3, and its deploy script installs KAI Scheduler and the GPU Operator. As of
            November 2026, its newest release is 6.3.1. Use it when one workflow has to chain simulation, training and
            a test on the robot&apos;s onboard computer. <Cite id="F09-62">NVIDIA OSMO 6.3.1 README</Cite>{' '}
            <Cite id="F09-65">NVIDIA OSMO release notes</Cite>{' '}
            <Cite id="F09-66">NVIDIA OSMO deployment guide for AWS</Cite>{' '}
            <Cite id="F10-458">NVIDIA OSMO release list</Cite>
          </Box>
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, explains the purchase options themselves. Section 29,
            Choosing, compares all four schedulers on one job. The{' '}
            <Link href="../llm-training-systems/">Training at Scale dive</Link> covers checkpointing inside the
            training loop.
          </Box>
          <Box variant="p">
            If EKS fits your jobs, start with two actions that cost nothing. First, request an increase to the G Spot
            quota, whose default is 0. Second, write the checkpoint code so that a pod stopped with two minutes of
            warning, or with none, loses only minutes of work. Then apply one Spot NodePool and one ClusterQueue, and
            submit the four-pod Job above with <code>kubectl create -f</code>, because a Job that uses{' '}
            <code>generateName</code> cannot be applied.{' '}
            <Cite id="F10-533">EC2 User Guide, Spot Instance quotas</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
