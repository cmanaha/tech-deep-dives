import type { CSSProperties } from 'react';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Snippet } from '../components/Blocks';
import { Cite, Derived, Toy } from '../components/Cite';
import { ClusterFigure } from '../components/Cluster';
import type { ClusterSpec, JobToken } from '../components/Cluster';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';

/** The thread task, stated once for this section. */
const TASK = `make the ${ARM} arm ${TASK_STORY}`;

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

const INK = '#16191f';
const MUTED = '#5f6b7a';

/* ------------------------------------------------------------------------ */
/* Figure: the two orchestrators, object for object                           */
/* ------------------------------------------------------------------------ */

function PathsDiagram() {
  const line = (y: number, text: string, bold?: boolean, fill?: string) => (
    <text x={26} y={y} fontFamily="sans-serif" fontSize="12" fontWeight={bold ? 'bold' : 'normal'} fill={fill ?? INK}>
      {text}
    </text>
  );
  return (
    <svg viewBox="0 0 420 476" role="img" aria-labelledby="hyperpod-paths-title" style={{ width: '100%', height: 'auto' }}>
      <title id="hyperpod-paths-title">A HyperPod cluster under Amazon EKS orchestration and under Slurm orchestration</title>
      <desc>
        Top: an Amazon EKS cluster holds the control plane and maps one to one to a HyperPod cluster that holds the worker nodes.
        Bottom: under Slurm, the controller, login and compute roles are all instance groups inside the HyperPod cluster.
      </desc>
      <rect x="0" y="0" width="420" height="476" fill="#fbfbfd" />
      <text x={14} y={22} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
        Amazon EKS orchestration: the main path here
      </text>
      <rect x="14" y="32" width="392" height="70" rx="6" fill="#e8f1fb" stroke="#1f5fa8" strokeWidth="1.2" />
      {line(50, 'Amazon EKS cluster: the control plane', true)}
      {line(68, 'Helm chart: health agent, device plug-ins, operators')}
      {line(86, 'Add-ons: task governance (Kueue), training operator')}
      <line x1="210" y1="102" x2="210" y2="130" stroke={MUTED} strokeWidth="1.6" />
      <text x={222} y={121} fontFamily="sans-serif" fontSize="12" fill={MUTED}>
        mapped 1-to-1
      </text>
      <rect x="14" y="130" width="392" height="88" rx="6" fill="#e6f6ea" stroke="#1e7b3a" strokeWidth="1.2" />
      {line(148, 'HyperPod cluster: the worker nodes', true)}
      {line(166, 'Instance groups: On-Demand, Spot or a training plan')}
      {line(184, 'Karpenter, run by HyperPod: groups scale from zero')}
      {line(202, 'Node health: agent, deep checks, replacement')}

      <text x={14} y={250} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
        Slurm orchestration: the second path
      </text>
      <rect x="14" y="260" width="392" height="144" rx="6" fill="#f2f5f9" stroke={MUTED} strokeWidth="1.2" />
      {line(278, 'HyperPod cluster: each Slurm role is a group', true)}
      <rect x="22" y="288" width="376" height="30" rx="4" fill="#ffffff" stroke={MUTED} strokeWidth="1" />
      {line(307, 'Controller group: exactly one, sized by you')}
      <rect x="22" y="326" width="376" height="30" rx="4" fill="#ffffff" stroke={MUTED} strokeWidth="1" />
      {line(345, 'Login group: optional, where users run sbatch')}
      <rect x="22" y="364" width="376" height="30" rx="4" fill="#ffffff" stroke={MUTED} strokeWidth="1" />
      {line(383, 'Compute groups: one Slurm partition each')}
      <text x={14} y={426} fontFamily="sans-serif" fontSize="12" fill={INK}>
        Same on both: instance groups, health monitoring, node
      </text>
      <text x={14} y={442} fontFamily="sans-serif" fontSize="12" fill={INK}>
        replacement, auto-resume, training plans.
      </text>
      <text x={14} y={462} fontFamily="sans-serif" fontSize="12" fill="#8a2c05">
        Slurm pages read 2026-11-20: no Spot, no autoscaler.
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* The cluster figure: two teams, one held group, two groups that start at 0  */
/* ------------------------------------------------------------------------ */

const run = (id: string, g: number, i: number, gpu = 0): JobToken => ({ id, label: id.toUpperCase(), at: { g, i, gpu }, tone: 'running' });
const HELD: JobToken[] = [run('w1', 0, 0, 0), run('w2', 0, 0, 1)];
const P5_UP = { '0.0': 'running', '0.1': 'running' } as const;
const SPOT_UP = { '1.0': 'running', '1.1': 'running', '1.2': 'running' } as const;

const SPEC: ClusterSpec = {
  title: 'A HyperPod cluster with Amazon EKS orchestration, shared by two teams, running post-training pods',
  desc: 'Pods wait in one LocalQueue per team, Kueue admits them against quota, Karpenter raises Spot and On-Demand instance groups from zero, and a held group on a training plan stays up.',
  submit: { label: 'kubectl apply, team namespace', sub: 'one PyTorchJob per run, two labels' },
  queues: [
    { label: 'LocalQueue, team arm', sub: 'hyperpod-ns-arm-localqueue' },
    { label: 'LocalQueue, team worldmodel', sub: 'hyperpod-ns-worldmodel-localqueue' },
  ],
  scheduler: { label: 'Kueue admission, then Karpenter', sub: 'quota first, nodes second' },
  done: { label: 'Succeeded' },
  groups: [
    {
      label: 'Instance group held-p5',
      sub: ['2 instances on a training plan, always up', 'deep health checks on, outside Karpenter'],
      market: 'reserved',
      gpus: 8,
      places: 2,
      type: 'p5.48xlarge',
    },
    {
      label: 'Instance group spot-g7e-az1',
      sub: ['InstanceCount 0, raised by Karpenter', 'Spot for the life of the group'],
      market: 'spot',
      gpus: 1,
      places: 4,
      type: 'g7e.2xlarge',
    },
    {
      label: 'Instance group od-g7e-az1',
      sub: ['InstanceCount 0, the On-Demand fallback'],
      market: 'on-demand',
      gpus: 1,
      places: 2,
      type: 'g7e.2xlarge',
    },
  ],
  stores: [
    { label: 'FSx for Lustre', sub: 'checkpoints, data' },
    { label: 'Container registry', sub: 'the training image' },
  ],
  network: 'One VPC, one Availability Zone by default',
  jobNoun: 'one pod, one GPU',
  steps: [
    {
      caption: (
        <>
          The held group is up and billed: two worldmodel pods run on its first node. Both g7e groups hold zero instances. Team arm has
          three post-training runs to submit, team worldmodel one more pod.
        </>
      ),
      scheduler: ['nothing pending', 'g7e groups at 0 nodes'],
      instances: { ...P5_UP },
      jobs: [
        ...HELD,
        { id: 'p1', label: 'P1', at: { submit: 0 } },
        { id: 'p2', label: 'P2', at: { submit: 1 } },
        { id: 'p3', label: 'P3', at: { submit: 2 } },
        { id: 'w3', label: 'W3', at: { submit: 3 } },
      ],
    },
    {
      caption: (
        <>
          Each job is applied in its team&apos;s namespace with a queue-name label. Kueue holds it in that team&apos;s LocalQueue until it
          has checked the team&apos;s quota. No pod exists yet.
        </>
      ),
      scheduler: ['4 workloads held in LocalQueues'],
      instances: { ...P5_UP },
      jobs: [
        ...HELD,
        { id: 'p1', label: 'P1', at: { q: 0, pos: 0 } },
        { id: 'p2', label: 'P2', at: { q: 0, pos: 1 } },
        { id: 'p3', label: 'P3', at: { q: 0, pos: 2 } },
        { id: 'w3', label: 'W3', at: { q: 1, pos: 0 } },
      ],
    },
    {
      caption: (
        <>
          Kueue admits all four. P1 and P2 fit team arm&apos;s own quota; P3 is admitted by borrowing quota team worldmodel is not using. W3
          starts at once on an idle GPU of the held group. The three arm-team pods are Pending, so Karpenter raises the Spot group from 0 to 3.
        </>
      ),
      scheduler: ['all 4 admitted, 3 pods Pending', 'Karpenter: spot-g7e-az1 0 to 3'],
      instances: { ...P5_UP, '1.0': 'launching', '1.1': 'launching', '1.2': 'launching' },
      jobs: [
        ...HELD,
        run('w3', 0, 1, 0),
        { id: 'p1', label: 'P1', at: { q: 0, pos: 0 } },
        { id: 'p2', label: 'P2', at: { q: 0, pos: 1 } },
        { id: 'p3', label: 'P3', at: { q: 0, pos: 2 } },
      ],
    },
    {
      caption: (
        <>
          Each new node goes from Pending to Running and carries the health label Schedulable; the pods&apos; node selector waits for that
          label. The three runs start. Billing for a node began when its lifecycle script started.
        </>
      ),
      scheduler: ['4 new pods Running', 'nodes labelled Schedulable'],
      instances: { ...P5_UP, ...SPOT_UP },
      jobs: [...HELD, run('w3', 0, 1, 0), run('p1', 1, 0), run('p2', 1, 1), run('p3', 1, 2)],
    },
    {
      caption: (
        <>
          EC2 sends a Spot notice for P2&apos;s node. HyperPod detects it, taints the node and evicts the pod, which gets its
          terminationGracePeriodSeconds to stop. The training script writes a checkpoint in that window.
        </>
      ),
      scheduler: ['Spot notice: node tainted', 'pod evicted, grace period runs'],
      instances: { ...P5_UP, '1.0': 'running', '1.1': 'notice', '1.2': 'running' },
      jobs: [...HELD, run('w3', 0, 1, 0), run('p1', 1, 0), run('p2', 1, 1), run('p3', 1, 2)],
      checkpoints: [{ id: 'c2', at: { g: 1, i: 1 } }],
    },
    {
      caption: (
        <>
          The Spot node is gone and the checkpoint is on the shared file system. P2&apos;s pod is Pending again (drawn back in its
          team&apos;s tray). In this illustration no Spot capacity is free, so Karpenter falls back to the On-Demand group in the same
          NodeClass.
        </>
      ),
      scheduler: ['P2 Pending again', 'no Spot: falls back to On-Demand'],
      instances: { ...P5_UP, '1.0': 'running', '1.2': 'running', '2.0': 'launching' },
      jobs: [...HELD, run('w3', 0, 1, 0), run('p1', 1, 0), { id: 'p2', label: 'P2', at: { q: 0, pos: 0 }, tone: 'requeued' }, run('p3', 1, 2)],
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
    {
      caption: (
        <>
          The On-Demand node is Running. Kubernetes reschedules P2 on the new node, and the script loads the checkpoint from FSx for
          Lustre.
        </>
      ),
      scheduler: ['P2 rescheduled', 'resumes from its checkpoint'],
      instances: { ...P5_UP, '1.0': 'running', '1.2': 'running', '2.0': 'running' },
      jobs: [...HELD, run('w3', 0, 1, 0), run('p1', 1, 0), run('p2', 2, 0), run('p3', 1, 2)],
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
    {
      caption: (
        <>
          A different event: the health monitoring agent finds a GPU fault on the second held node. With NodeRecovery set to Automatic,
          HyperPod reboots or replaces a faulty node without being asked. W3 is on that node.
        </>
      ),
      scheduler: ['health agent: fault on a p5 node', 'node no longer Schedulable'],
      instances: { '0.0': 'running', '0.1': 'faulty', '1.0': 'running', '1.2': 'running', '2.0': 'running' },
      jobs: [...HELD, { id: 'w3', label: 'W3', at: { g: 0, i: 1, gpu: 0 }, tone: 'requeued' }, run('p1', 1, 0), run('p2', 2, 0), run('p3', 1, 2)],
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
    {
      caption: (
        <>
          HyperPod replaces the node. W3 restarts on an idle GPU of the healthy node. The replacement is not usable yet: deep health checks
          run on every new instance, about 45 to 90 minutes for the GPU diagnostics alone, and AWS plans for about a couple of hours.
        </>
      ),
      scheduler: ['faulty node replaced', 'new node: deep health checks'],
      instances: { '0.0': 'running', '0.1': 'launching', '1.0': 'running', '1.2': 'running', '2.0': 'running' },
      jobs: [...HELD, run('w3', 0, 0, 2), run('p1', 1, 0), run('p2', 2, 0), run('p3', 1, 2)],
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
    {
      caption: (
        <>
          The three runs succeed. Their nodes are empty, so Karpenter consolidates them after consolidateAfter and both g7e groups return
          to zero; no node stays behind for the Karpenter controller. The held group stays up, checked and billed, with or without work.
        </>
      ),
      scheduler: ['g7e groups back to 0 nodes', 'held-p5 stays up'],
      instances: { ...P5_UP },
      jobs: [
        ...HELD,
        run('w3', 0, 0, 2),
        { id: 'p1', label: 'P1', at: { done: 0 }, tone: 'done' },
        { id: 'p2', label: 'P2', at: { done: 1 }, tone: 'done' },
        { id: 'p3', label: 'P3', at: { done: 2 }, tone: 'done' },
      ],
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
  ],
};

/* ------------------------------------------------------------------------ */
/* Section                                                                    */
/* ------------------------------------------------------------------------ */

export function HyperPod() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know every object in a HyperPod cluster, watch one post-training run survive a Spot notice and a failed node, and leave with a configuration to adapt (AWS documentation read 2026-11-20)."
          >
            27. Amazon SageMaker HyperPod
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, placed the workloads; this section takes one scheduler apart. Amazon SageMaker
            HyperPod is a cluster of GPU machines that stays up between jobs and that AWS keeps healthy: it tests the hardware, replaces a
            node that fails, and restarts the job that was running on it. You keep the scheduler you already know, Slurm or Kubernetes, and
            HyperPod supplies and repairs the machines underneath it.{' '}
            <Cite id="F10-300">SageMaker Developer Guide, HyperPod with Amazon EKS</Cite>{' '}
            <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>
          </Box>
          <Box variant="p">
            The challenge it meets is the long run on scarce hardware. To {TASK}, you post-train a VLA (vision-language-action model, a
            pretrained network that takes camera images and an instruction and outputs arm actions; post-training is fine-tuning it on your
            own robot&apos;s demonstrations). An AWS post reports 3.4 hours for one 20,000-step run of the GR00T N1.7 model on a single
            ml.g7e.2xlarge, measured as a SageMaker training job. Over hours or days a GPU fails or a Spot machine is taken back. HyperPod makes that cost one restart from the last checkpoint, with no
            person involved. <Cite id="F09-82">AWS Physical AI Blog, 19 November 2026</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="You can say in two sentences what HyperPod is, and tell whether your situation calls for it.">
            What it is, and when a standing cluster pays
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Use it when GPUs are busy most of the day and shared: two teams on one pool of reserved GPUs, runs long enough for hardware
            faults to matter, or jobs that span several nodes. AWS names the case as &quot;many concurrent jobs,
            continuous synthetic generation, reserved capacity, and the tens-of-nodes tail where failures are statistically
            frequent&quot;. <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>
          </Box>
          <Box variant="p">
            Leave it when the work is occasional. A HyperPod cluster, in AWS&apos;s words, &quot;bills for every running node whether or
            not a job is using it&quot;. One arm and one fine-tune a week is a SageMaker training job. If you have, say, <Toy>500</Toy>{' '}
            independent simulation runs and no cluster, that is AWS Batch (section 25). If you want Slurm whose nodes disappear when the queue is
            empty, that is AWS Parallel Computing Service (section 26). <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite>
          </Box>
          <Box variant="p">
            HyperPod has two orchestrators, chosen when the cluster is created. Slurm is the batch scheduler of classic supercomputing:
            users hand it shell scripts with the <code>sbatch</code> command and it runs them on the nodes of a queue it calls a
            partition. With Slurm, the controller, an optional login node and the compute nodes all live inside the HyperPod cluster. With
            Amazon EKS (Elastic Kubernetes Service, the managed Kubernetes control plane), the HyperPod cluster is only the worker
            nodes, mapped 1-to-1 to one EKS cluster, and jobs are containers.{' '}
            <Cite id="F10-300">SageMaker Developer Guide, HyperPod with Amazon EKS</Cite>{' '}
            <Cite id="F10-302">SageMaker Developer Guide, getting started with Slurm</Cite>
          </Box>
          <Box variant="p">
            This section teaches the EKS path as the main one, because Spot Instances, autoscaling from zero and per-team quotas are
            documented there. The Slurm path shares instance groups, health monitoring, node replacement, auto-resume and training plans.
            No Slurm-orchestration page read on 2026-11-20 documents Spot or autoscaling, so those two are marked as EKS-only wherever they
            appear. <Cite id="F10-309">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
            <Cite id="F10-313">SageMaker Developer Guide, Slurm cluster operations</Cite>
          </Box>
          <div style={NARROW}>
            <Figure
              cites="F10-300 F10-302 F10-309 F10-313 F10-329"
              caption={
                <>
                  Read each panel from the top. Under EKS the control plane sits outside the HyperPod cluster; under Slurm every role is
                  an instance group inside it. The parts named here are explained in the next block.
                </>
              }
            >
              <PathsDiagram />
            </Figure>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Every object you create or see, with the two or three fields that matter, its default and its limit."
          >
            Its moving parts
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">The cluster and its capacity</Box>
          <Box variant="p">
            <strong>HyperPod cluster.</strong> One <code>CreateCluster</code> request holds all of it: the instance groups, the{' '}
            <code>Orchestrator</code> (<code>Eks</code> or <code>Slurm</code>), <code>NodeRecovery</code>,{' '}
            <code>NodeProvisioningMode</code>, <code>AutoScaling</code> and the network. On the EKS path you create the EKS cluster first
            and pass its identifier. <Cite id="F10-301">SageMaker API Reference, CreateCluster</Cite>
          </Box>
          <Box variant="p">
            <strong>The Helm chart.</strong> Helm is the package format of Kubernetes. Before creating the HyperPod cluster you install
            HyperPod&apos;s chart on the EKS cluster. It brings the health monitoring agent, the Kubeflow Training Operator (the
            controller that turns a training job description into pods), the Kubeflow MPI operator, and the device plug-ins that expose
            NVIDIA GPUs, AWS Neuron accelerators and EFA (Elastic Fabric Adapter, the network device the nodes of one multi-node job talk
            through) to pods. Supported Kubernetes versions are 1.30 to 1.35.{' '}
            <Cite id="F10-329">SageMaker Developer Guide, installing packages with Helm</Cite>
          </Box>
          <Box variant="p">
            <strong>Instance group.</strong> The unit of capacity: a named set of identical instances with a count. It holds one{' '}
            <code>InstanceType</code>, or a flexible list of up to 20 types in priority order that HyperPod walks down when capacity is
            missing. Its market is fixed for life: On-Demand (paid by use, no reservation) by default, or Spot (spare capacity that EC2
            can take back on a two-minute notice) with <code>CapacityRequirements</code>, which cannot be changed after creation. A third
            choice is a <code>TrainingPlanArn</code>, which ties the group to a SageMaker training plan, a prepaid GPU reservation with a
            start and an end. Type names carry an <code>ml.</code> prefix, in Kubernetes node selectors too.{' '}
            <Cite id="F10-308">SageMaker Developer Guide, flexible instance groups</Cite>{' '}
            <Cite id="F10-309">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
            <Cite id="F10-325">SageMaker Developer Guide, training plans in HyperPod</Cite>{' '}
            <Cite id="F10-304">SageMaker API Reference, ClusterInstanceGroupSpecification</Cite>
          </Box>
          <Box variant="p">
            <strong>Continuous provisioning.</strong> The default way groups are filled on the EKS path. For Slurm the pages disagree:
            the Slurm page calls it both optional and the default, and the API Reference says the mode is for EKS-orchestrated clusters
            only, so set <code>NodeProvisioningMode</code> explicitly and confirm it on a test cluster. HyperPod records the
            target count of each group, launches instances, retries failed launches in the background, and lets jobs start on the capacity
            that has arrived. Billing for an instance starts when its
            lifecycle script (your set-up script, run once on a new node) begins. For a multi-node group that is useless below a certain size, <code>MinInstanceCount</code> is a start-up gate: if it
            is not reached within 3 hours the group rolls back.{' '}
            <Cite id="F10-306">SageMaker Developer Guide, continuous provisioning on EKS</Cite>{' '}
            <Cite id="F10-307">SageMaker Developer Guide, minimum capacity requirements</Cite>
          </Box>

          <Box variant="h3">Health and recovery</Box>
          <Box variant="p">
            <strong>Deep health checks.</strong> Optional stress tests that run on every new or replaced instance before work lands on
            it. <code>InstanceStress</code> exercises the GPUs with NVIDIA DCGM (Data Center GPU Manager, NVIDIA&apos;s diagnostic tool)
            at its most thorough level, which takes about 45 to 90 minutes depending on GPU count (the figure printed for Slurm clusters; the EKS pages give
            &quot;around 60-90 minutes&quot; for a whole check). <code>InstanceConnectivity</code>{' '}
            tests the network between instances. On EKS a third type, <code>MultiNodeTrainingValidation</code>, runs a short real
            training job. AWS&apos;s planning figure for the whole process is &quot;about a couple of hours&quot; per new instance. That wait suits an eight-GPU node held for weeks and is too long for a node that exists for one job.{' '}
            <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>{' '}
            <Cite id="F10-312">SageMaker Developer Guide, HyperpodNodeClass</Cite>
          </Box>
          <Box variant="p">
            <strong>Node recovery.</strong> One cluster-level switch, <code>NodeRecovery</code>. With <code>Automatic</code>, the
            default, HyperPod reboots or replaces a node when the health monitoring agent or a health check finds a fault. With{' '}
            <code>None</code> the agent only labels the node. <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>
          </Box>
          <Box variant="p">
            <strong>Auto-resume.</strong> Replacing a node does not restart the job; a second mechanism does, and each orchestrator has
            its own. On EKS it is two annotations on the job plus <code>restartPolicy: OnFailure</code> and a node selector that keeps
            pods on nodes labelled <code>Schedulable</code>. On Slurm it is a flag on one job step, <code>srun --auto-resume=1</code>;
            with it the faulty node is always replaced, never rebooted. Neither loads your checkpoint: the training script does that when it starts. <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>{' '}
            <Cite id="F10-315">SageMaker Developer Guide, Slurm auto-resume</Cite>
          </Box>

          <Box variant="h3">Scaling, on the EKS path</Box>
          <Box variant="p">
            <strong>Karpenter autoscaling.</strong> Karpenter is an open-source node autoscaler: it launches nodes for pods that cannot
            be scheduled and removes nodes that are empty. HyperPod runs the Karpenter controller for you, so a cluster can scale to zero
            nodes with none kept for the controller. You switch it on with <code>AutoScaling</code>, create instance groups with{' '}
            <code>InstanceCount</code> 0, and Karpenter raises the count. It requires continuous provisioning and automatic node
            recovery. <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
          </Box>
          <Box variant="p">
            <strong>HyperpodNodeClass and NodePool.</strong> A <code>HyperpodNodeClass</code> lists the instance groups Karpenter may
            raise, at most 10. A <code>NodePool</code> is Karpenter&apos;s own object: it points at the node class and carries the rules
            for removing nodes. When the list mixes markets, Karpenter picks Spot groups first and uses On-Demand as the fallback, ordered
            by the Spot placement score of each group&apos;s Availability Zone. Two kinds of group cannot be listed: one on a training
            plan, and one with deep health checks, because pods would sit pending for the 60-90 minutes a check takes.{' '}
            <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
            <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>
          </Box>

          <Box variant="h3">Sharing, on the EKS path</Box>
          <Box variant="p">
            <strong>Task governance.</strong> An EKS add-on that installs Kueue, a Kubernetes controller that holds a job until quota is
            free and then admits it. Add-on v1.6.1-eksbuild.1 installs Kueue v0.19.2. It has two objects of its own.{' '}
            <Cite id="F10-320">SageMaker Developer Guide, task governance setup</Cite>
          </Box>
          <Box variant="p">
            <strong>Cluster policy.</strong> One per cluster. It holds the priority classes, at most 10, each a name and a weight from 0
            (lowest) to 100, and whether idle compute is shared by fair-share weight. A job that names a class missing from the policy
            fails at submission; a job that names none is treated as low priority.{' '}
            <Cite id="F10-320">SageMaker API Reference, CreateClusterSchedulerConfig</Cite>{' '}
            <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>
          </Box>
          <Box variant="p">
            <strong>Compute allocation.</strong> One per team: the team&apos;s quota. It lists up to 15 resources (an instance type with
            a count, or accelerators, vCPUs and memory), a sharing <code>Strategy</code> (<code>Lend</code>, <code>DontLend</code> or{' '}
            <code>LendAndBorrow</code>), a <code>BorrowLimit</code> in percent of the allocation (default 50, range 0 to 10000), and{' '}
            <code>PreemptTeamTasks</code> (default <code>LowerPriority</code>). Creating it for a team named arm creates the
            namespace <code>hyperpod-ns-arm</code> and a LocalQueue, Kueue&apos;s per-namespace queue, named{' '}
            <code>hyperpod-ns-arm-localqueue</code>. <Cite id="F10-320">SageMaker API Reference, CreateComputeQuota</Cite>{' '}
            <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>
          </Box>
          <Box variant="p">
            <strong>Lending, borrowing, preemption.</strong> Quota a team is not using can run another team&apos;s job. The price of
            borrowing is that such a task &quot;may be preempted by another task of higher priority&quot;, and by default the team that
            lent the compute preempts the borrowers when it returns. Since 16 March 2026 capacity that no team owns can be borrowed too.{' '}
            <Cite id="F10-322">SageMaker Developer Guide, task governance policies</Cite>
          </Box>

          <Box variant="h3">Jobs and storage</Box>
          <Box variant="p">
            <strong>Job objects.</strong> On EKS a training run is a <code>PyTorchJob</code> (the Kubeflow Training Operator&apos;s
            object) or a <code>HyperPodPyTorchJob</code> (the HyperPod training operator&apos;s). The second carries a{' '}
            <code>runPolicy</code> with a retry count and log rules that declare a job hung, for example when no new batch line appears
            within 300 seconds. The operator supports Kubernetes 1.28 to 1.33, a narrower range than
            HyperPod itself. On Slurm a job is an <code>sbatch</code> script.{' '}
            <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator</Cite>
          </Box>
          <Box variant="p">
            <strong>Shared storage.</strong> Checkpoints must outlive the node that wrote them. The documented shared file system is
            Amazon FSx for Lustre, a parallel file system every node mounts: per instance group in{' '}
            <code>InstanceStorageConfigs</code> under Slurm, as Kubernetes storage under EKS.{' '}
            <Cite id="F10-326">SageMaker Developer Guide, HyperPod storage</Cite>
          </Box>
          <ExpandableSection headerText="Three training features for multi-node runs: checkpointless, tiered checkpointing, elastic">
            <SpaceBetween size="s">
              <Box variant="p">
                All three sit on the EKS path. Checkpointless training recovers a failed node&apos;s state from healthy peers; AWS
                reports over 80% less downtime in internal studies on 16 to over 2,000 GPUs, and its recipes were verified on ml.p5
                instances. Managed tiered checkpointing writes checkpoints to CPU memory on the nodes, copies them to adjacent nodes and
                persists them periodically to storage such as Amazon S3. Elastic training grows and shrinks a job by checkpointing and
                resuming with a different number of workers. They exclude each other in places: checkpointless training cannot be combined with tiered checkpointing or elastic
                training, and elastic training does not support Spot Instances. Our reading: for the arm they matter only for
                multi-node pretraining.{' '}
                <Cite id="F10-319">SageMaker Developer Guide, checkpointless training considerations</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You can follow one pod from kubectl apply to a GPU, through a Spot notice and a failed node, and say who acts at each step."
          >
            The cluster, drawn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The picture shows one cluster on the EKS path, shared by two teams. Team arm post-trains the arm&apos;s VLA, one GPU per
            run. Team worldmodel runs longer jobs on a held group of two eight-GPU instances on a training plan. Two more groups start at
            zero instances, one Spot and one On-Demand, both listed in one node class. As an illustration, each team&apos;s allocation
            holds <Toy>2</Toy> g7e instances, and team worldmodel&apos;s also holds the two held p5 instances that its
            pods W1 to W3 run on. With the default borrow limit of 50 percent a team may borrow{' '}
            <Derived>1</Derived> more g7e instance (50 percent of 2). <Cite id="F10-320">SageMaker API Reference, ResourceSharingConfig</Cite>
          </Box>
          <Box variant="p">
            Two things happen to capacity in the sequence. The first is a Spot interruption, which HyperPod handles in five documented
            steps:
          </Box>
          <ol style={LIST}>
            <li>It detects the interruption signal.</li>
            <li>It taints the node, a Kubernetes mark that stops new pods landing there.</li>
            <li>
              It evicts the pods, giving each its <code>terminationGracePeriodSeconds</code> to stop.
            </li>
            <li>It provisions replacement capacity: in the same group without autoscaling, through Karpenter&apos;s fallback with it.</li>
            <li>
              Kubernetes reschedules the evicted pods. <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
            </li>
          </ol>
          <Box variant="p">
            The second is a hardware fault on a held node, which node recovery handles. Step through both.
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="post-training pods on a shared HyperPod cluster"
            cites="F10-300 F10-306 F10-309 F10-310 F10-311 F10-312 F10-314 F10-316 F10-318 F10-320 F10-321 F10-322 F10-325 F10-326 F10-333"
            caption={
              <>
                Left: where jobs are submitted, one LocalQueue per team, the two controllers that act on them. Right: three instance
                groups, with each GPU drawn as a chip. Tokens P1 to P3 are team arm&apos;s runs, W1 to W3 team worldmodel&apos;s
                pods; the small marker is a checkpoint. Instance types are painted without their ml. prefix. Quota sizes and the lack
                of Spot capacity in step 6 are illustrative; the sequence is our assembly of separately documented steps.
              </>
            }
          />
          <Box variant="p">
            Two consequences follow. First, held and scaled capacity behave differently at the start: W3 ran at once on an idle GPU,
            while team arm&apos;s runs waited for nodes. AWS prints no figure for the time from a pending pod to a running node on the pages
            read on 2026-11-20, so measure it in your account before promising a start time.{' '}
            <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
          </Box>
          <Box variant="p">
            Second, the two-minute notice is best effort. EC2 may end a Spot instance with no warning, and then the node is replaced
            with no graceful eviction. A run that checkpoints only on the signal loses everything since its last periodic checkpoint, so
            write periodic checkpoints as well. <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
          </Box>
          
          <Box variant="p">
            One caution on the Spot steps: two AWS pages disagree. The NodeClass page says &quot;Only on-demand capacity is supported at
            this time&quot;. The Spot page shows Spot instance groups inside a <code>HyperpodNodeClass</code> and states that Karpenter
            prioritizes them over On-Demand. This section follows the Spot page because it is the more specific of the two; confirm the
            behaviour on a small cluster before you depend on it.{' '}
            <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>{' '}
            <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="From the manifest you apply to the weights on the shared file system, with each state the job passes through."
          >
            One post-training run, end to end
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Follow run P2 from the figure. Team arm applies one <code>PyTorchJob</code> for it. The labels put it in the team&apos;s
            queue, the annotations switch on auto-resume, and the node selector keeps it on healthy nodes.
          </Box>
          <Snippet
            title="The job team arm applies (EKS path)"
            mode="adapted"
            source={
              <>
                <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>{' '}
                <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>{' '}
                <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator usage</Cite>
              </>
            }
            ours="the job and team names, one replica, the instance type, the image placeholder and the 90-second grace period are ours; every field name is AWS's."
          >{`apiVersion: "kubeflow.org/v1"
kind: PyTorchJob
metadata:
  name: vla-posttrain-seed2
  namespace: hyperpod-ns-arm
  labels:
    kueue.x-k8s.io/queue-name: hyperpod-ns-arm-localqueue
    kueue.x-k8s.io/priority-class: training-priority
  annotations:
    sagemaker.amazonaws.com/enable-job-auto-resume: "true"
    sagemaker.amazonaws.com/job-max-retry-count: "2"
spec:
  pytorchReplicaSpecs:
    Worker:
      replicas: 1
      restartPolicy: OnFailure
      template:
        spec:
          terminationGracePeriodSeconds: 90
          nodeSelector:
            sagemaker.amazonaws.com/node-health-status: Schedulable
            beta.kubernetes.io/instance-type: ml.g7e.2xlarge
          containers:
            - name: pytorch
              image: <your training image>
              resources:
                limits:
                  nvidia.com/gpu: 1`}</Snippet>
          <Box variant="p">
            The container name is fixed. The Kubeflow Training Operator rejects a PyTorchJob that has no container named{' '}
            <code>pytorch</code>. <Cite id="F10-340">Kubeflow Training Operator v1.8.1, PyTorchJob validating webhook</Cite>
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Held.</strong> Kueue keeps the job in <code>hyperpod-ns-arm-localqueue</code> and creates no pod.{' '}
              <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>
            </li>
            <li>
              <strong>Admitted.</strong> The team&apos;s allocation has room for the instance type, so Kueue admits the job. With a full allocation it could still be admitted by borrowing idle quota.{' '}
              <Cite id="F10-322">SageMaker Developer Guide, task governance policies</Cite>
            </li>
            <li>
              <strong>Pending.</strong> The pod exists and no node fits it. Karpenter raises a Spot group from the node class from zero.{' '}
              <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
            </li>
            <li>
              <strong>Running.</strong> The node reports <code>Running</code> and carries the <code>Schedulable</code> label; the pod
              starts and writes checkpoints to the shared file system as it trains. An AWS example for a larger VLA mounts FSx for Lustre
              at <code>/fsx</code> for this. <Cite id="F10-306">SageMaker Developer Guide, continuous provisioning on EKS</Cite>{' '}
              <Cite id="F09-83">AWS Physical AI Blog, 10 September 2026</Cite>
            </li>
            <li>
              <strong>Evicted.</strong> A Spot notice arrives. HyperPod taints the node and evicts the pod; the script catches the
              stop signal and writes one more checkpoint inside its grace period. Writing that handler is your part.{' '}
              <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
            </li>
            <li>
              <strong>Resumed.</strong> Replacement capacity arrives, from the On-Demand group if no Spot group can supply it. Kubernetes
              reschedules the evicted pod onto it (the job&apos;s <code>restartPolicy: OnFailure</code> recreates the pod), and the
              script loads the newest checkpoint. The auto-resume annotations are documented for node faults; no page read says
              whether a Spot eviction counts against their retry count.{' '}
              <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>{' '}
              <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>
            </li>
            <li>
              <strong>Succeeded.</strong> The final weights are on the shared file system. The node is empty, Karpenter removes it,
              and the group returns to zero. <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
            </li>
          </ol>
          <Box variant="h3">The same run on the Slurm path</Box>
          <Box variant="p">
            On a Slurm-orchestrated cluster the run is a script submitted with <code>sbatch</code> from the login node. The training
            step is launched with <code>srun --auto-resume=1</code> inside an exclusive allocation. AWS&apos;s example asks for two
            nodes; the arm&apos;s one-GPU run would ask for one.
          </Box>
          <Snippet
            title="The sbatch script (Slurm path)"
            mode="copied"
            source={<Cite id="F10-315">SageMaker Developer Guide, Slurm auto-resume</Cite>}
          >{`#!/bin/bash
#SBATCH --nodes 2
#SBATCH --exclusive
srun --auto-resume=1 {{train_auto_resume.sh}}`}</Snippet>
          <Box variant="p">
            The states are fewer. The job waits in its partition until nodes of the compute group are idle; nothing scales up for it,
            because capacity changes only when someone calls <code>UpdateCluster</code>. There is no Spot notice to handle. When the
            health monitoring agent finds a hardware fault, HyperPod replaces the node and restarts the step, and the script reloads its
            checkpoint. Put all environment set-up inside the one <code>srun</code> script so it works on a fresh node; a job without the flag exits and
            must be resubmitted.{' '}
            <Cite id="F10-315">SageMaker Developer Guide, Slurm auto-resume</Cite>{' '}
            <Cite id="F10-313">SageMaker Developer Guide, Slurm cluster operations</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A cluster definition, a node class, a node pool and two governance objects you can adapt, with AWS's own advice quoted beside our choices."
          >
            The recommended configuration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Our reading of the documentation, for the cluster in the figure: hold the expensive, long-lived capacity and check it
            deeply; let everything else start at zero on Spot with an On-Demand fallback. Section 24
            covers the three capacity markets themselves.
          </Box>
          <Snippet
            title="create-cluster input: one held group, two groups that start at zero"
            mode="adapted"
            source={
              <>
                <Cite id="F10-301">SageMaker API Reference, CreateCluster</Cite>{' '}
                <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
                <Cite id="F10-325">SageMaker Developer Guide, training plans in HyperPod</Cite>
              </>
            }
            ours="group names, instance types and counts are ours; angle-bracket values are yours to fill; ExecutionRole, LifeCycleConfig and VpcConfig are left out for length."
          >{`{
  "ClusterName": "arm-shared",
  "ClusterRole": "<your autoscaling role ARN>",
  "Orchestrator": { "Eks": { "ClusterArn": "<your EKS cluster ARN>" } },
  "NodeProvisioningMode": "Continuous",
  "NodeRecovery": "Automatic",
  "AutoScaling": { "Mode": "Enable", "AutoScalerType": "Karpenter" },
  "InstanceGroups": [
    { "InstanceGroupName": "held-p5",
      "InstanceType": "ml.p5.48xlarge", "InstanceCount": 2,
      "TrainingPlanArn": "<your training plan ARN>",
      "OnStartDeepHealthChecks": ["InstanceStress", "InstanceConnectivity"] },
    { "InstanceGroupName": "spot-g7e-az1",
      "InstanceType": "ml.g7e.2xlarge", "InstanceCount": 0,
      "CapacityRequirements": { "Spot": {} },
      "OverrideVpcConfig": { "SecurityGroupIds": ["<sg>"], "Subnets": ["<subnet in zone 1>"] } },
    { "InstanceGroupName": "od-g7e-az1",
      "InstanceType": "ml.g7e.2xlarge", "InstanceCount": 0,
      "OverrideVpcConfig": { "SecurityGroupIds": ["<sg>"], "Subnets": ["<subnet in zone 1>"] } }
  ]
}`}</Snippet>
          <Box variant="p">
            The node class is AWS&apos;s own example, unchanged: Spot groups in three Availability Zones and one On-Demand group. Put
            your group names in their place.
          </Box>
          <Snippet
            title="HyperpodNodeClass: Spot groups and their On-Demand fallback"
            mode="copied"
            source={<Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>}
          >{`apiVersion: karpenter.sagemaker.amazonaws.com/v1
kind: HyperpodNodeClass
metadata:
  name: multiazg6
spec:
  instanceGroups:
    # name of InstanceGroup in HyperPod cluster. InstanceGroup needs to pre-created
    # before this step can be completed.
    # MaxItems: 10
    - auto-spot-c5-2x-az1
    - auto-spot-c5-2x-az2
    - auto-spot-c5-x-az3
    - auto-ondemand-c5-2x-az1`}</Snippet>
          <Snippet
            title="NodePool: consolidate nodes, but not instantly"
            mode="adapted"
            source={<Cite id="F10-312">SageMaker Developer Guide, create a NodePool</Cite>}
            ours="the pool name and consolidateAfter of 60s (AWS's printed example shows 0s) are ours."
          >{`apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: g7e-pool
spec:
  disruption:
    budgets:
    - nodes: 90%
    consolidateAfter: 60s
    consolidationPolicy: WhenEmptyOrUnderutilized
  template:
    spec:
      expireAfter: 720h
      nodeClassRef:
        group: karpenter.sagemaker.amazonaws.com
        kind: HyperpodNodeClass
        name: multiazg6
      requirements:
      - key: node.kubernetes.io/instance-type
        operator: Exists`}</Snippet>
          <Box variant="p">
            <code>WhenEmptyOrUnderutilized</code> is the value AWS prints. It removes empty nodes, and it also lets Karpenter
            move a running pod so that an underused node can go. A run on this pool therefore saves checkpoints on a timer for
            that reason too. Section 28, Amazon EKS, uses <code>WhenEmpty</code>, the value that leaves a running pod alone, for
            the same kind of job on self-managed Karpenter. The HyperPod autoscaling pages print only{' '}
            <code>WhenEmptyOrUnderutilized</code> and do not say whether the managed Karpenter accepts <code>WhenEmpty</code>.{' '}
            <Cite id="F10-344">SageMaker Developer Guide, HyperPod autoscaling with Karpenter</Cite>{' '}
            <Cite id="F10-412">Karpenter v1.15.3 docs, consolidation policies</Cite>
          </Box>
          <Box variant="p">
            Governance is two API inputs: one cluster policy, then one compute allocation per team.
          </Box>
          <Snippet
            title="Task governance: the cluster policy, and team arm's compute allocation"
            mode="adapted"
            source={
              <>
                <Cite id="F10-320">SageMaker API Reference, CreateClusterSchedulerConfig and CreateComputeQuota</Cite>
              </>
            }
            ours="object and team names, the two priority classes with weights 90 and 10, and the quota of 2 instances are ours; BorrowLimit 50 and LowerPriority are the API defaults written out."
          >{`// CreateClusterSchedulerConfig
{
  "Name": "arm-shared-policy",
  "ClusterArn": "<your HyperPod cluster ARN>",
  "SchedulerConfig": {
    "FairShare": "Enabled",
    "PriorityClasses": [
      { "Name": "training", "Weight": 90 },
      { "Name": "evaluation", "Weight": 10 }
    ]
  }
}

// CreateComputeQuota
{
  "Name": "arm-quota",
  "ClusterArn": "<your HyperPod cluster ARN>",
  "ComputeQuotaConfig": {
    "ComputeQuotaResources": [ { "InstanceType": "ml.g7e.2xlarge", "Count": 2 } ],
    "PreemptTeamTasks": "LowerPriority",
    "ResourceSharingConfig": { "Strategy": "LendAndBorrow", "BorrowLimit": 50 }
  },
  "ComputeQuotaTarget": { "TeamName": "arm" }
}`}</Snippet>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Value</th>
                  <th style={TH}>Why, and whose advice it is</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td style={TD}>
                    <code>NodeRecovery</code>
                  </td>
                  <td style={TD}>
                    <code>Automatic</code>
                  </td>
                  <td style={TD}>
                    AWS: &quot;We recommend setting the <code>Automatic</code> option.&quot; It is also a prerequisite of Karpenter
                    autoscaling. <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Deep health checks</td>
                  <td style={TD}>On for the held P-class group, off for the groups Karpenter scales</td>
                  <td style={TD}>
                    A check takes about 45 to 90 minutes for the GPU diagnostics alone. For a small cluster with no spare nodes AWS
                    says: &quot;Recommendation: disable the deep health check config throughout the cluster life cycle.&quot;{' '}
                    <Cite id="F10-318">SageMaker Developer Guide, suggested resilience configurations</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Spot and On-Demand mix</td>
                  <td style={TD}>One Spot group per Availability Zone at count 0, one On-Demand group, one node class</td>
                  <td style={TD}>
                    Karpenter prefers the Spot groups and falls back to On-Demand. The market of a group cannot be changed later, so
                    the fallback is a second group. <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>consolidateAfter</code>
                  </td>
                  <td style={TD}>Above zero; one to two minutes is our choice</td>
                  <td style={TD}>
                    AWS: &quot;Set it to non zero upto 2 min to allow graceful pod eviction for any checkpointing needs.&quot;{' '}
                    <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>terminationGracePeriodSeconds</code>
                  </td>
                  <td style={TD}>Below 120 seconds, with a checkpoint written on the stop signal and periodically</td>
                  <td style={TD}>
                    Our reading: the Spot notice is at most two minutes and best effort, so a longer grace period cannot be honoured.{' '}
                    <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
                  </td>
                </tr>
                
                <tr>
                  <td style={TD}>Reserved capacity</td>
                  <td style={TD}>A training plan on the P-class training group only</td>
                  <td style={TD}>
                    AWS: &quot;we do not recommend using a training plan for the primary instance group of a cluster&quot;. A group
                    on a plan cannot be scaled by Karpenter. <Cite id="F10-325">SageMaker Developer Guide, training plans in HyperPod</Cite>
                  </td>
                </tr>
                
                <tr>
                  <td style={TD}>Storage and network</td>
                  <td style={TD}>FSx for Lustre for checkpoints; one Availability Zone for a multi-node group</td>
                  <td style={TD}>
                    A cluster deploys in a single Availability Zone by default; AWS calls FSx optional for creation and recommended for
                    production. <Cite id="F10-326">SageMaker Developer Guide, HyperPod storage</Cite>{' '}
                    <Cite id="F10-327">SageMaker Developer Guide, HyperPod prerequisites</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The limits you will meet, each with the way around it, before they cost you a week.">
            What it does poorly, and how to get it right
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>Its best features are built for P-class nodes.</strong> Deep health checks, checkpointless training, network
              topology placement and training plans target multi-GPU P instances; no G-family type is on the training plan list. For a fleet of one-GPU G instances it is a managed node pool with Karpenter: weigh it against sections 25 and 28.{' '}
              <Cite id="F10-334">synthesis of the HyperPod entries</Cite>{' '}
              <Cite id="F09-35">SageMaker Developer Guide, training plans</Cite>
            </li>
            <li>
              <strong>Features exclude each other.</strong> A group cannot have Karpenter scaling together with deep health checks or
              a training plan. Decide per group, as the figure does.{' '}
              <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>
            </li>
            <li>
              <strong>The Slurm path is a fixed pool.</strong> Capacity changes when someone calls <code>UpdateCluster</code> or{' '}
              <code>BatchDeleteClusterNodes</code>, the controller is an instance you size and pay for, and no Slurm page read on
              2026-11-20 documents Spot or autoscaling. Choose it for a held pool, and size it for the steady load.{' '}
              <Cite id="F10-313">SageMaker Developer Guide, Slurm cluster operations</Cite>
            </li>
            <li>
              <strong>A new or replaced checked node is slow to arrive.</strong> About 45 to 90 minutes of GPU diagnostics, &quot;about
              a couple of hours&quot; in AWS&apos;s planning. Keep a spare node in a group that must not shrink. <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>
            </li>
            <li>
              <strong>A held node bills with or without work.</strong> Scale to zero exists only for Karpenter-scaled groups on the EKS
              path. Put only steady work on held groups. <Cite id="F09-33">Amazon SageMaker AI pricing page, HyperPod note</Cite>
            </li>
            <li>
              <strong>Versions and addresses need a check up front.</strong> The training operator supports Kubernetes 1.28 to 1.33.
              Under EKS each P5 instance can take 81 IP addresses, so size the subnet for the node count you plan.{' '}
              <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator</Cite>{' '}
              <Cite id="F10-327">SageMaker Developer Guide, HyperPod prerequisites</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which neighbour takes the work HyperPod is wrong for, and what to do first if it is right.">
            Where it hands off
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>To AWS Batch (section 25)</strong> for independent array work with no standing cluster: simulation runs,
              evaluation rollouts, curation.
            </li>
            <li>
              <strong>To AWS Parallel Computing Service (section 26)</strong> for Slurm whose node groups scale to zero.
            </li>
            <li>
              <strong>To Amazon EKS (section 28)</strong> when you want EC2 instance names without the <code>ml.</code> prefix, a
              fractional-GPU scheduler, or services beside the training jobs.
            </li>
            <li>
              <strong>To section 24</strong> for the capacity markets and the glue between schedulers, and to section 29, Choosing,
              for the decision across all four.
            </li>
          </ul>
          <Box variant="p">
            If HyperPod fits, start small on the EKS path: one Spot group and one On-Demand group at count 0, one node class, one compute
            allocation, and one short job with the auto-resume annotations. Remove its node and watch the job come back from its checkpoint. Add the held group and its deep health checks, about 45 to 90 minutes per new node, only when
            a reservation justifies them. <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
