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
        As of Nov 2026, Slurm docs list no Spot or autoscaling.
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
          The held group is up and billed, and two worldmodel pods run on its first node. Both g7e groups hold zero instances. Team arm
          has three post-training runs to submit, and team worldmodel has one more pod.
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
          Each job is applied in its team&apos;s namespace with a queue-name label. Kueue holds each job in that team&apos;s LocalQueue
          until it has checked the team&apos;s quota. No pod exists yet.
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
          Kueue admits all four jobs. P1 and P2 fit within team arm&apos;s own quota, and P3 is admitted on quota borrowed from team
          worldmodel, which is not using it. W3 starts at once on an idle GPU of the held group. The three pods of team arm are Pending,
          so Karpenter raises the Spot group from 0 to 3 instances.
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
          Each new node goes from Pending to Running and gets the health label Schedulable. The pods&apos; node selector requires that
          label, so Kubernetes places the pods only after the label appears. Team arm&apos;s three runs start, and together with W3,
          which started in the previous step, four new pods are now Running. Billing for each node began when its lifecycle script
          started.
        </>
      ),
      scheduler: ['4 new pods Running', 'nodes labelled Schedulable'],
      instances: { ...P5_UP, ...SPOT_UP },
      jobs: [...HELD, run('w3', 0, 1, 0), run('p1', 1, 0), run('p2', 1, 1), run('p3', 1, 2)],
    },
    {
      caption: (
        <>
          EC2 sends a Spot interruption notice for P2&apos;s node. HyperPod detects it, taints the node and evicts the pod, which gets its
          terminationGracePeriodSeconds to stop. The training script writes a checkpoint in that time.
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
          The Spot node is gone, and the checkpoint is on the shared file system. P2&apos;s pod is Pending again and is drawn back in its
          team&apos;s queue. In this illustration no Spot capacity is free, so Karpenter falls back to the On-Demand group in the same
          node class.
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
          The On-Demand node is Running. Kubernetes reschedules P2 on the new node, and the training script loads the checkpoint from FSx
          for Lustre.
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
          Next comes a different kind of failure. The health monitoring agent finds a GPU fault on the second held node, where W3 runs.
          With NodeRecovery set to Automatic, HyperPod reboots or replaces a faulty node without anyone asking it to.
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
          HyperPod replaces the node, and W3 restarts on an idle GPU of the healthy node. The replacement node is not usable yet, because
          deep health checks run on every new instance. The GPU diagnostics alone take about 45 to 90 minutes, and AWS plans for about a
          couple of hours.
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
          The three runs succeed. Their nodes are empty, so Karpenter removes them once the consolidateAfter time has passed, and both
          g7e groups return to zero. No node stays behind for the Karpenter controller. The held group stays up, checked and billed,
          whether or not it has work.
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
            description="Amazon SageMaker HyperPod keeps a GPU cluster running between jobs, checks its hardware and replaces nodes that fail. You will be able to decide when that is worth paying for in a physical AI pipeline, start from a recommended configuration, and know what happens to a training run when AWS reclaims a Spot Instance or a GPU fails."
          >
            27. Amazon SageMaker HyperPod: A Long-Running Cluster That Recovers From Node Failures
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 24, Orchestrating Physical AI on AWS, matched each workload type to an AWS service. This section covers one of those
            services, Amazon SageMaker HyperPod, in detail. HyperPod is a cluster of GPU instances that stays up between jobs and that AWS
            keeps healthy. HyperPod tests the hardware and replaces a node that fails. When you turn on its auto-resume feature, it also
            restarts the job that was running on that node. You keep a scheduler you already know, Slurm or Kubernetes, and HyperPod
            provides and repairs the machines underneath it.{' '}
            <Cite id="F10-300">SageMaker Developer Guide, HyperPod with Amazon EKS</Cite>{' '}
            <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>{' '}
            <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>
          </Box>
          <Box variant="p">
            The challenge HyperPod meets is keeping long training runs going on scarce GPU hardware. To {TASK}, you post-train a VLA
            (vision-language-action model). A VLA is a pretrained network that takes camera images and an instruction and outputs arm
            actions. Post-training means fine-tuning it on demonstrations recorded with your own robot. An AWS post reports that one
            20,000-step post-training run of NVIDIA&apos;s GR00T N1.7 model took 3.4 hours on a single ml.g7e.2xlarge instance, run as a
            SageMaker training job. <Cite id="F09-82">AWS Physical AI Blog, 19 November 2026</Cite>
          </Box>
          <Box variant="p">
            Over runs of hours or days, a GPU can fail or AWS can reclaim a Spot Instance. On HyperPod, either event costs you one
            restart from the last checkpoint, and no person has to step in.{' '}
            <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>{' '}
            <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="HyperPod pays off when GPUs are busy most of the day and shared between teams. You will be able to tell whether your work is one of those cases and, if it is, which of the two orchestrators to choose."
          >
            When to use HyperPod, and when to choose another service
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod is a good choice when your GPUs are busy most of the day and several teams share them. Typical cases are two teams
            that share one pool of reserved GPUs, training runs long enough for hardware faults to matter, and jobs that span several
            nodes. An AWS blog post lists the cases where HyperPod pays off as &quot;many concurrent jobs, continuous synthetic
            generation, reserved capacity, and the tens-of-nodes tail where failures are statistically frequent&quot;.{' '}
            <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>
          </Box>
          <Box variant="p">
            Each of the fifteen jobs in section 1, Fifteen Computing Jobs Behind One Robot Arm, falls into one of five workload
            types. Of these, HyperPod is built for Multi-node training, which needs a dedicated cluster on reserved capacity. It also
            suits Long single-machine runs, such as post-training the VLA, when there are enough of them to keep a shared pool of
            GPUs busy most of the day.
          </Box>
          <Box variant="p">
            HyperPod is the wrong choice when the work is occasional. In AWS&apos;s words, a HyperPod cluster &quot;bills for every
            running node whether or not a job is using it&quot;. <Cite id="F09-81">AWS Physical AI Blog, 19 November 2026</Cite> For
            occasional work, use one of these services instead:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>A SageMaker training job.</strong> If one arm needs one fine-tune a week, run it as a SageMaker training job.{' '}
              <Cite id="F09-112">AWS Machine Learning Blog, 4 September 2026</Cite>
            </li>
            <li>
              <strong>AWS Batch.</strong> If you have, say, <Toy>500</Toy> independent simulation runs and no cluster, submit them to AWS
              Batch. Section 25, AWS Batch, covers this service.
            </li>
            <li>
              <strong>AWS Parallel Computing Service.</strong> If you want Slurm and want its nodes to shut down when the queue is empty,
              use AWS Parallel Computing Service. Section 26, AWS Parallel Computing Service, covers this service.
            </li>
          </ul>

          <Box variant="h3">Choosing the orchestrator: Amazon EKS or Slurm</Box>
          <Box variant="p">
            When you create a HyperPod cluster, you choose one of two orchestrators: Slurm or Amazon EKS. Slurm is the batch scheduler
            of classic supercomputing. Users submit shell scripts to it with the <code>sbatch</code> command, and Slurm runs them on the
            nodes of a queue, which Slurm calls a partition. On the Slurm path, the Slurm controller, an optional login node and the compute
            nodes all run inside the HyperPod cluster.{' '}
            <Cite id="F10-302">SageMaker Developer Guide, getting started with Slurm</Cite>
          </Box>
          <Box variant="p">
            Amazon EKS (Elastic Kubernetes Service) is AWS&apos;s managed Kubernetes service, which runs the Kubernetes control plane for
            you. On the EKS path, the HyperPod cluster holds only the worker nodes. It is mapped one to one to an EKS cluster, and jobs
            run as containers. <Cite id="F10-300">SageMaker Developer Guide, HyperPod with Amazon EKS</Cite>
          </Box>
          <Box variant="p">
            This section follows the EKS path as the main one, because Spot Instances, autoscaling from zero and quotas per team are
            documented for EKS. The Slurm path has the same instance groups, health monitoring, node replacement, auto-resume and
            training plans. As of November 2026, no page of the HyperPod Slurm documentation describes Spot Instances or autoscaling, so
            treat both as features of the EKS path only. Based on that, choose EKS if you need Spot Instances, nodes that scale
            from zero or a quota for each team. Choose Slurm if your team already submits <code>sbatch</code> scripts and the pool of
            nodes can stay at a fixed size.{' '}
            <Cite id="F10-309">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
            <Cite id="F10-313">SageMaker Developer Guide, Slurm cluster operations</Cite>
          </Box>
          <div style={NARROW}>
            <Figure
              cites="F10-300 F10-302 F10-309 F10-313 F10-329"
              caption={
                <>
                  Read each panel from the top. On the EKS path, the control plane sits outside the HyperPod cluster. On the Slurm path,
                  every role is an instance group inside it. Each part named here is explained further down.
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
            description="You will be able to sketch a HyperPod cluster for a physical AI team: which capacity to hold, which capacity to start at zero, and which settings to leave at their defaults."
          >
            The recommended configuration, in brief
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            We recommend the set-up below, based on AWS&apos;s documentation and its stated advice. The rest of the section uses it as the
            example cluster. Section 24, Orchestrating Physical AI on AWS, compares the purchase options it refers to.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Keep only the expensive, long-lived capacity up all the time.</strong> An instance group is HyperPod&apos;s unit of capacity: a
              named set of instances with a count. Put the multi-GPU P-class instances that one team uses for weeks in their own instance
              group, and attach that group to a training plan. A training plan is a prepaid SageMaker GPU reservation with a start and an
              end date. The rest of the section calls this group the held group.{' '}
              <Cite id="F10-325">SageMaker Developer Guide, training plans in HyperPod</Cite>
            </li>
            <li>
              <strong>Run deep health checks on the held group only.</strong> Deep health checks are stress tests that HyperPod runs on
              each new or replaced instance before work lands on it. The GPU diagnostics alone take about 45 to 90 minutes. That wait
              suits an eight-GPU node held for weeks, and it is too long for a node that exists for one job.{' '}
              <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>
            </li>
            <li>
              <strong>Start everything else at zero, on Spot Instances with an On-Demand fallback.</strong> For one-GPU post-training
              runs, create a Spot group and an On-Demand group, both with an instance count of 0. Karpenter is an open-source
              Kubernetes node autoscaler. It launches nodes for pods that cannot be scheduled and removes nodes that are empty. On the
              EKS path, HyperPod runs Karpenter for you, and Karpenter uses the Spot group first and falls back to the On-Demand group. Test this
              fallback on a small cluster first, because two AWS pages disagree on whether HyperPod&apos;s Karpenter supports Spot
              groups.{' '}
              <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
              <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
            </li>
            <li>
              <strong>Leave node recovery on Automatic.</strong> With this setting, which is the default, HyperPod reboots or replaces a
              node when it finds a fault. AWS recommends it, and Karpenter autoscaling requires it.{' '}
              <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>{' '}
              <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
            </li>
            <li>
              <strong>Save checkpoints to a shared file system, on a timer and when the job is told to stop.</strong> Checkpoints have
              to outlive the node that wrote them, so write them to Amazon FSx for Lustre. FSx for Lustre is a managed parallel file
              system that every node mounts. Write them periodically as well as on the stop signal, because the Spot warning is best effort and does not
              always arrive. <Cite id="F10-326">SageMaker Developer Guide, HyperPod storage</Cite>{' '}
              <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
            </li>
            <li>
              <strong>Give each team a quota.</strong> Task governance is a HyperPod add-on for the EKS path that shares one cluster
              between teams. It gives each team a quota, called a compute allocation, and lets a team borrow quota that another team is
              not using. By default, the team that lent the quota takes it back when it needs the compute again.{' '}
              <Cite id="F10-320">SageMaker Developer Guide, task governance setup</Cite>{' '}
              <Cite id="F10-322">SageMaker Developer Guide, task governance policies</Cite>
            </li>
          </ul>
          <Box variant="p">
            The configuration files for this set-up are near the end of the section, after the parts they use are explained.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You will know each object you create or meet in a HyperPod cluster, what it does, and the one or two settings that matter for it. You can look up the limits and defaults that rarely matter in a list at the end."
          >
            How a HyperPod cluster is built
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">The cluster and its capacity</Box>
          <Box variant="p">
            <strong>The cluster.</strong> One <code>CreateCluster</code> request defines the whole HyperPod cluster. It holds the
            instance groups, the <code>Orchestrator</code> (<code>Eks</code> or <code>Slurm</code>), <code>NodeRecovery</code>,{' '}
            <code>NodeProvisioningMode</code>, <code>AutoScaling</code> and the network settings. On the EKS path, you create the EKS
            cluster first and pass its identifier in the request.{' '}
            <Cite id="F10-301">SageMaker API Reference, CreateCluster</Cite>
          </Box>
          <Box variant="p">
            <strong>The Helm chart.</strong> Helm is a package manager for Kubernetes, and a Helm chart is one package. Before you
            create the HyperPod cluster, you install HyperPod&apos;s Helm chart on the EKS cluster. The chart installs the health
            monitoring agent, the Kubeflow Training Operator, the Kubeflow MPI operator and the device plug-ins that make NVIDIA GPUs,
            AWS Neuron accelerators and EFA (Elastic Fabric Adapter) devices available to pods. The health monitoring agent is a
            HyperPod process on each node that watches for hardware faults and labels the node&apos;s health. The Kubeflow Training
            Operator is the controller that turns a training job description into pods. MPI (Message Passing Interface) is a standard
            library interface for sending messages between the processes of a parallel program. The Kubeflow MPI operator turns jobs
            that use MPI into pods. EFA is the network device through which the nodes of one multi-node job exchange data.{' '}
            <Cite id="F10-329">SageMaker Developer Guide, installing packages with Helm</Cite>
          </Box>
          <Box variant="p">
            <strong>Instance groups.</strong> Each instance group holds one <code>InstanceType</code>, or a flexible list of instance
            types in priority order that HyperPod works down when capacity is missing. The purchase option of a group is fixed for its
            whole life. A group is On-Demand by default. It becomes a Spot group when you set <code>CapacityRequirements</code>, and you
            cannot change that setting after the group is created. Setting <code>TrainingPlanArn</code> instead ties the group to a
            training plan. Instance type names carry an <code>ml.</code> prefix, and Kubernetes node selectors must use that form too.{' '}
            <Cite id="F10-308">SageMaker Developer Guide, flexible instance groups</Cite>{' '}
            <Cite id="F10-309">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
            <Cite id="F10-325">SageMaker Developer Guide, training plans in HyperPod</Cite>{' '}
            <Cite id="F10-304">SageMaker API Reference, ClusterInstanceGroupSpecification</Cite>
          </Box>
          <Box variant="p">
            <strong>Continuous provisioning.</strong> Continuous provisioning is the way HyperPod fills instance groups, and it is the
            default on the EKS path. HyperPod records the target count of each group, launches instances, retries failed launches in
            the background, and lets jobs start on the capacity that has already arrived. A lifecycle script is your set-up script,
            which HyperPod runs once on each new node. Billing for an instance starts when its lifecycle script begins.{' '}
            <Cite id="F10-306">SageMaker Developer Guide, continuous provisioning on EKS</Cite>
          </Box>
          <Box variant="p">
            For Slurm clusters, the documentation contradicts itself on this mode. The Slurm page calls continuous provisioning both
            optional and the default, and the API Reference says the mode is for EKS-orchestrated clusters only. So set{' '}
            <code>NodeProvisioningMode</code> explicitly and confirm the result on a test cluster.{' '}
            <Cite id="F10-306">SageMaker Developer Guide, continuous provisioning on EKS</Cite>
          </Box>

          <Box variant="h3">Health and recovery</Box>
          <Box variant="p">
            <strong>Deep health checks.</strong> DCGM (Data Center GPU Manager) is NVIDIA&apos;s GPU diagnostic tool. The{' '}
            <code>InstanceStress</code> check runs DCGM on the GPUs at its most thorough level. At that level it takes about 45 to 90
            minutes, depending on the number of GPUs. The Slurm pages give that figure, and the EKS pages give &quot;around 60-90
            minutes&quot; for a whole check. The <code>InstanceConnectivity</code> check tests the network between instances. On
            the EKS path, a third check, <code>MultiNodeTrainingValidation</code>, runs a short real training job. AWS&apos;s planning
            figure for the whole process is &quot;about a couple of hours&quot; per new instance.{' '}
            <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>{' '}
            <Cite id="F10-312">SageMaker Developer Guide, HyperpodNodeClass</Cite>
          </Box>
          <Box variant="p">
            <strong>Node recovery.</strong> <code>NodeRecovery</code> is one switch for the whole cluster. With <code>Automatic</code>,
            the default, HyperPod reboots or replaces a node when the health monitoring agent or a health check finds a fault. With{' '}
            <code>None</code>, the agent only labels the node, and HyperPod does not repair it.{' '}
            <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>
          </Box>
          <Box variant="p">
            <strong>Auto-resume.</strong> Replacing a node does not restart the job. A second mechanism, auto-resume, does that, and
            each orchestrator has its own. On the EKS path, auto-resume is two annotations on the job, plus{' '}
            <code>restartPolicy: OnFailure</code> and a node selector that keeps the pods on nodes labelled <code>Schedulable</code>. On
            the Slurm path, it is a flag on one job step, <code>srun --auto-resume=1</code>. With that flag, HyperPod always replaces
            the faulty node and never reboots it. Neither mechanism loads your checkpoint: your training script does that when it
            starts. <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>{' '}
            <Cite id="F10-315">SageMaker Developer Guide, Slurm auto-resume</Cite>
          </Box>

          <Box variant="h3">Scaling on the EKS path</Box>
          <Box variant="p">
            <strong>Karpenter autoscaling.</strong> Because HyperPod runs the Karpenter controller for you, a cluster can scale to zero
            nodes, with no node kept for the controller. You turn Karpenter on with <code>AutoScaling</code> and create instance groups
            with <code>InstanceCount</code> 0, and Karpenter raises the count when pods are waiting. Karpenter autoscaling requires
            continuous provisioning and automatic node recovery.{' '}
            <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
          </Box>
          <Box variant="p">
            <strong>HyperpodNodeClass and NodePool.</strong> Two objects tell Karpenter what it may do. A <code>HyperpodNodeClass</code>{' '}
            lists the instance groups that Karpenter may scale. A <code>NodePool</code> is Karpenter&apos;s own object. It points at the
            node class and holds the rules for removing nodes. One of these rules, <code>consolidateAfter</code>, sets how long
            Karpenter waits before it removes a node it no longer needs. When the node class lists both Spot and On-Demand groups,
            Karpenter uses the Spot groups first and the On-Demand groups as the fallback. A Spot placement score is EC2&apos;s rating
            of how likely a Spot request is to succeed in an Availability Zone. Karpenter orders the groups by the Spot placement
            score of the Availability Zone of each group&apos;s subnet. Two kinds of group cannot be listed in a node class: a group on a training
            plan, and a group with deep health checks, because pods would wait for the 60 to 90 minutes that a check takes.{' '}
            <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
            <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>
          </Box>

          <Box variant="h3">Sharing on the EKS path</Box>
          <Box variant="p">
            <strong>Task governance.</strong> The task governance add-on installs Kueue. Kueue is a Kubernetes controller that holds a
            job until quota is free and then admits it. On top of Kueue, task governance adds two objects of its own: one cluster
            policy, and one compute allocation per team. <Cite id="F10-320">SageMaker Developer Guide, task governance setup</Cite>
          </Box>
          <Box variant="p">
            <strong>Cluster policy.</strong> The cluster policy holds the priority classes, and each priority class is a name with a
            weight. The policy also says whether idle compute is shared by fair-share weight. A job that names a priority class
            missing from the policy fails at submission. A job that names no class is treated as low priority.{' '}
            <Cite id="F10-320">SageMaker API Reference, CreateClusterSchedulerConfig</Cite>{' '}
            <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>
          </Box>
          <Box variant="p">
            <strong>Compute allocation.</strong> A compute allocation is one team&apos;s quota. It lists the team&apos;s resources, as
            an instance type with a count or as numbers of accelerators, vCPUs and memory. It also sets a sharing{' '}
            <code>Strategy</code> (<code>Lend</code>, <code>DontLend</code> or <code>LendAndBorrow</code>), a <code>BorrowLimit</code>{' '}
            in percent of the allocation, and a preemption rule, <code>PreemptTeamTasks</code>. Creating the allocation for a team
            named arm also creates the namespace <code>hyperpod-ns-arm</code> and a LocalQueue named{' '}
            <code>hyperpod-ns-arm-localqueue</code>. A LocalQueue is Kueue&apos;s queue for one namespace, and the team&apos;s jobs
            name it in a label. <Cite id="F10-320">SageMaker API Reference, CreateComputeQuota</Cite>{' '}
            <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>
          </Box>
          <Box variant="p">
            <strong>Lending, borrowing and preemption.</strong> Preemption means stopping a running task so that another task can use
            its compute. Quota that one team is not using can run another team&apos;s jobs, but a task on borrowed quota &quot;may be
            preempted by another task of higher priority&quot;. By default, the team that lent the compute preempts the borrowers when
            it needs the compute again. <Cite id="F10-322">SageMaker Developer Guide, task governance policies</Cite>
          </Box>

          <Box variant="h3">Jobs and storage</Box>
          <Box variant="p">
            <strong>Job objects.</strong> On the EKS path, a training run is either a <code>PyTorchJob</code> or a{' '}
            <code>HyperPodPyTorchJob</code>. A <code>PyTorchJob</code> is the Kubeflow Training Operator&apos;s object for one PyTorch
            training run. A <code>HyperPodPyTorchJob</code> is the equivalent object of the HyperPod training operator, and its{' '}
            <code>runPolicy</code> adds a retry count and log rules that detect a hung job. On the Slurm path, a job is an{' '}
            <code>sbatch</code> script. <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator</Cite>
          </Box>
          <Box variant="p">
            <strong>Shared storage.</strong> The documented shared file system for checkpoints is Amazon FSx for Lustre. On the Slurm
            path, you declare it for each instance group in <code>InstanceStorageConfigs</code>. On the EKS path, you set it up as
            Kubernetes storage. <Cite id="F10-326">SageMaker Developer Guide, HyperPod storage</Cite>
          </Box>
          <ExpandableSection headerText="Limits, defaults and supported versions, for lookup">
            <ul style={LIST}>
              <li>
                HyperPod on the EKS path supports Kubernetes versions 1.30 to 1.35.{' '}
                <Cite id="F10-329">SageMaker Developer Guide, installing packages with Helm</Cite>
              </li>
              <li>
                The HyperPod training operator supports Kubernetes 1.28 to 1.33, a narrower range than HyperPod itself.{' '}
                <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator</Cite>
              </li>
              <li>
                A flexible instance group lists up to 20 instance types in priority order.{' '}
                <Cite id="F10-308">SageMaker Developer Guide, flexible instance groups</Cite>
              </li>
              <li>
                A <code>HyperpodNodeClass</code> lists at most 10 instance groups.{' '}
                <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>
              </li>
              <li>
                Version v1.6.1-eksbuild.1 of the task governance add-on installs Kueue v0.19.2.{' '}
                <Cite id="F10-320">SageMaker Developer Guide, task governance setup</Cite>
              </li>
              <li>
                A cluster policy holds at most 10 priority classes, each with a weight from 0 (lowest) to 100.{' '}
                <Cite id="F10-320">SageMaker API Reference, CreateClusterSchedulerConfig</Cite>
              </li>
              <li>
                A compute allocation lists up to 15 resources. <code>BorrowLimit</code> defaults to 50 percent of the allocation, with a
                range of 0 to 10000. <code>PreemptTeamTasks</code> defaults to <code>LowerPriority</code>.{' '}
                <Cite id="F10-320">SageMaker API Reference, CreateComputeQuota</Cite>
              </li>
              <li>
                Since 16 March 2026, teams can also borrow capacity that no team owns.{' '}
                <Cite id="F10-322">SageMaker Developer Guide, task governance policies</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <ExpandableSection headerText="Three training features for multi-node runs: checkpointless training, managed tiered checkpointing and elastic training">
            <SpaceBetween size="s">
              <Box variant="p">
                All three features run on the EKS path. Checkpointless training recovers a failed node&apos;s training state from
                healthy peers. AWS reports over 80% less downtime in internal studies on 16 to over 2,000 GPUs, and the recipes for
                it were verified on ml.p5 instances. Managed tiered checkpointing writes checkpoints to CPU memory on the nodes, copies
                them to adjacent nodes and saves them periodically to storage such as Amazon S3. Elastic training grows and shrinks a
                job by saving a checkpoint and resuming with a different number of workers. Some combinations are not allowed:
                checkpointless training cannot be combined with tiered checkpointing or elastic training, and elastic training does
                not support Spot Instances. For the arm, these features are worth considering only for multi-node pretraining.{' '}
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
            description="You will be able to follow one pod from kubectl apply to a GPU, through a Spot interruption and a failed node, and say which component acts at each step."
          >
            What happens during a Spot interruption and a node failure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The figure shows one cluster on the EKS path, shared by two teams. Team arm post-trains the arm&apos;s VLA, with one GPU
            per run. Team worldmodel runs longer jobs on a held group of two eight-GPU instances on a training plan. Two more groups
            start at zero instances, one Spot and one On-Demand, and both are listed in one node class.
          </Box>
          <Box variant="p">
            As an illustration, each team&apos;s allocation holds <Toy>2</Toy> g7e instances, and team worldmodel&apos;s allocation also
            holds the two held p5 instances that its pods W1 to W3 run on. With the default borrow limit of 50 percent, a team may
            borrow <Derived>1</Derived> more g7e instance (50 percent of 2).{' '}
            <Cite id="F10-320">SageMaker API Reference, ResourceSharingConfig</Cite>
          </Box>
          <Box variant="p">
            Two events change the cluster&apos;s capacity during the sequence. The first is a Spot interruption. When EC2 is about to reclaim a Spot
            Instance, it sends a notice that usually comes two minutes ahead. HyperPod handles the notice in five documented steps:
          </Box>
          <ol style={LIST}>
            <li>HyperPod detects the interruption signal.</li>
            <li>It taints the node. A taint is a Kubernetes mark on a node that stops new pods from being scheduled there.</li>
            <li>
              It evicts the pods and gives each pod its <code>terminationGracePeriodSeconds</code> to stop. This is the time Kubernetes
              allows a pod after telling it to stop, and the training script can write a last checkpoint during that time.
            </li>
            <li>
              It provisions replacement capacity. Without autoscaling, the replacement comes from the same group. With autoscaling, it
              comes through Karpenter&apos;s fallback to another group.
            </li>
            <li>
              Kubernetes reschedules the evicted pods. <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
            </li>
          </ol>
          <Box variant="p">
            The second event is a hardware fault on a held node, which node recovery handles. Step through both events in the figure.
          </Box>
          <ClusterFigure
            spec={SPEC}
            name="post-training pods on a shared HyperPod cluster"
            cites="F10-300 F10-306 F10-309 F10-310 F10-311 F10-312 F10-314 F10-316 F10-318 F10-320 F10-321 F10-322 F10-325 F10-326 F10-333"
            caption={
              <>
                The left side shows where jobs are submitted, one LocalQueue per team, and the two controllers that act on the jobs. The
                right side shows three instance groups, with each GPU drawn as a chip. Tokens P1 to P3 are team arm&apos;s runs, and W1
                to W3 are team worldmodel&apos;s pods. The small marker is a checkpoint. Instance types are shown without their ml.
                prefix. The quota sizes and the lack of Spot capacity in step 6 are illustrations. We assembled the sequence from steps
                that AWS documents separately.
              </>
            }
          />
          <Box variant="p">
            Two AWS pages disagree about the Spot steps. The NodeClass page says &quot;Only on-demand capacity is supported at this
            time&quot;. The Spot page shows Spot instance groups inside a <code>HyperpodNodeClass</code> and states that Karpenter
            prioritizes them over On-Demand. This section follows the Spot page, because it is the more specific of the two. Confirm
            the behaviour on a small cluster before you depend on it.{' '}
            <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>{' '}
            <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You will be able to write the job for one post-training run and know each state it passes through, from the manifest you apply to the final weights on the shared file system."
          >
            One post-training run, from submission to the final weights
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Follow run P2 from the figure. Team arm applies one <code>PyTorchJob</code> for it. The labels put the job in the
            team&apos;s queue, the annotations turn on auto-resume, and the node selector keeps the job on healthy nodes.
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
            The container name is fixed: the Kubeflow Training Operator rejects a <code>PyTorchJob</code> that has no container named{' '}
            <code>pytorch</code>. <Cite id="F10-340">Kubeflow Training Operator v1.8.1, PyTorchJob validating webhook</Cite>
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Held.</strong> Kueue keeps the job in <code>hyperpod-ns-arm-localqueue</code> and creates no pod yet.{' '}
              <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>
            </li>
            <li>
              <strong>Admitted.</strong> The team&apos;s allocation has room for the instance type, so Kueue admits the job. If the
              allocation were full, Kueue could still admit the job on borrowed idle quota.{' '}
              <Cite id="F10-322">SageMaker Developer Guide, task governance policies</Cite>
            </li>
            <li>
              <strong>Pending.</strong> The pod exists, but no node fits it yet. Karpenter raises a Spot group listed in the node class
              from zero. <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
            </li>
            <li>
              <strong>Running.</strong> The node reports <code>Running</code> and carries the <code>Schedulable</code> label, so the pod
              starts. As it trains, the pod writes checkpoints to the shared file system. An AWS example for a larger VLA mounts FSx for
              Lustre at <code>/fsx</code> for this purpose.{' '}
              <Cite id="F10-306">SageMaker Developer Guide, continuous provisioning on EKS</Cite>{' '}
              <Cite id="F09-83">AWS Physical AI Blog, 10 September 2026</Cite>
            </li>
            <li>
              <strong>Evicted.</strong> A Spot interruption notice arrives, and HyperPod taints the node and evicts the pod. The training
              script catches the stop signal and writes one more checkpoint within its grace period. Writing that signal handler is your
              part of the work. <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
            </li>
            <li>
              <strong>Resumed.</strong> Replacement capacity arrives, from the On-Demand group if no Spot group can supply it. The
              job&apos;s <code>restartPolicy: OnFailure</code> recreates the pod, Kubernetes schedules it onto the new node, and the
              training script loads the newest checkpoint. The auto-resume pages document the annotations for node faults. As of
              November 2026, they do not say whether a Spot eviction counts against the retry count.{' '}
              <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>{' '}
              <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>
            </li>
            <li>
              <strong>Succeeded.</strong> The final weights are on the shared file system. The node is now empty, so Karpenter removes it
              and the group returns to zero. <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
            </li>
          </ol>
          <Box variant="h3">The same run on the Slurm path</Box>
          <Box variant="p">
            On a Slurm-orchestrated cluster, the run is a script that you submit with <code>sbatch</code> from the login node. Inside an
            exclusive allocation, the script launches the training step with <code>srun --auto-resume=1</code>. AWS&apos;s example asks
            for two nodes, and the arm&apos;s one-GPU run would ask for one.
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
            The run passes through fewer states on Slurm. The job waits in its partition until nodes of the compute group are idle.
            Nothing scales up for it, because capacity changes only when someone calls <code>UpdateCluster</code>. There is no Spot
            notice to handle. When the health monitoring agent finds a hardware fault, HyperPod replaces the node and restarts the step,
            and the script reloads its checkpoint. Put all environment set-up inside the one <code>srun</code> script, so that the
            script also works on a fresh node. A job without the auto-resume flag exits after a fault and must be resubmitted.{' '}
            <Cite id="F10-315">SageMaker Developer Guide, Slurm auto-resume</Cite>{' '}
            <Cite id="F10-313">SageMaker Developer Guide, Slurm cluster operations</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You will know the failures a HyperPod cluster meets in practice, the signal each one gives, what HyperPod does about it and what is left for you to do."
          >
            What fails, and how you notice it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>A GPU or another part of a node fails.</strong> The health monitoring agent detects the fault and changes the
              node&apos;s <code>sagemaker.amazonaws.com/node-health-status</code> label, so the node no longer counts as{' '}
              <code>Schedulable</code>. With <code>NodeRecovery</code> set to <code>Automatic</code>,
              HyperPod reboots or replaces the node. With <code>None</code>, the label is the only signal, and you have to act on it.
              The job comes back only if you turned on auto-resume for it.{' '}
              <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>{' '}
              <Cite id="F10-316">SageMaker Developer Guide, running jobs with kubectl</Cite>
            </li>
            <li>
              <strong>AWS reclaims a Spot Instance.</strong> The signal is the interruption notice. HyperPod turns it into a taint and
              an eviction, so your training script receives a stop signal. The notice is best effort: EC2 may end a Spot Instance with
              no warning, and HyperPod then replaces the node without a graceful eviction. A run that writes checkpoints only on the stop
              signal loses everything since its last periodic checkpoint, so write periodic checkpoints as well.{' '}
              <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
            </li>
            <li>
              <strong>A replacement node takes hours to become usable.</strong> In a group with deep health checks, every new or
              replaced node first runs about 45 to 90 minutes of GPU diagnostics, and AWS plans for &quot;about a couple of hours&quot;.
              Keep a spare node in any group that must not shrink.{' '}
              <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>
            </li>
            <li>
              <strong>Pods in a group that starts at zero wait for a new node.</strong> Held capacity starts work at once, as W3 did on an idle
              GPU in the figure. Pods for a group that starts at zero wait until Karpenter adds a node. As of November 2026, the
              HyperPod autoscaling pages give no figure for the time from a pending pod to a running node. Measure it in your account
              before you promise anyone a start time.{' '}
              <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
            </li>
            <li>
              <strong>A job hangs without exiting.</strong> The log rules of a <code>HyperPodPyTorchJob</code> catch this case. They
              declare the job hung when, for example, no new batch line appears in the log within 300 seconds.{' '}
              <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator</Cite>
            </li>
            <li>
              <strong>An instance group does not reach its minimum size.</strong> Some multi-node groups are useless below a certain
              size. For them, <code>MinInstanceCount</code> sets how many instances must arrive before the group starts work. It is a
              check at start-up only. If the count is not reached within 3 hours, HyperPod rolls the group back.{' '}
              <Cite id="F10-307">SageMaker Developer Guide, minimum capacity requirements</Cite>
            </li>
            <li>
              <strong>A job is rejected when you submit it.</strong> A job that names a priority class missing from the cluster policy
              fails at submission. The Kubeflow Training Operator also rejects a <code>PyTorchJob</code> that has no container named{' '}
              <code>pytorch</code>. <Cite id="F10-321">SageMaker Developer Guide, task governance CLI examples</Cite>{' '}
              <Cite id="F10-340">Kubeflow Training Operator v1.8.1, PyTorchJob validating webhook</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You will have a cluster definition, a node class, a node pool and the two task governance objects to adapt, and a table that shows which settings follow AWS's advice and which are our choice."
          >
            The configuration files
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            These files implement the recommended configuration from earlier in the section. The cluster has one held group with deep
            health checks and two groups that start at zero, Spot first with an On-Demand fallback.
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
            The node class below is AWS&apos;s own example, unchanged. It lists Spot groups in three Availability Zones and one
            On-Demand group. Replace the group names with your own.
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
            <code>WhenEmptyOrUnderutilized</code> is the value AWS prints. It removes empty nodes, and it also lets Karpenter move a
            running pod so that an underused node can be removed. That is another reason for a run on this pool to save checkpoints on
            a timer. Section 28, Amazon EKS, uses <code>WhenEmpty</code>, the value that leaves running pods alone, for the same kind of
            job on self-managed Karpenter. The HyperPod autoscaling pages print only <code>WhenEmptyOrUnderutilized</code> and do not
            say whether the managed Karpenter accepts <code>WhenEmpty</code>.{' '}
            <Cite id="F10-344">SageMaker Developer Guide, HyperPod autoscaling with Karpenter</Cite>{' '}
            <Cite id="F10-412">Karpenter v1.15.3 docs, consolidation policies</Cite>
          </Box>
          <Box variant="p">
            Task governance takes two API inputs: one cluster policy for the cluster, then one compute allocation per team.
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
                  <th style={TH}>Recommended value</th>
                  <th style={TH}>Reason, and whose advice it is</th>
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
                    AWS advises: &quot;We recommend setting the <code>Automatic</code> option.&quot; Karpenter autoscaling also
                    requires it. <Cite id="F10-314">SageMaker Developer Guide, automatic node recovery</Cite>{' '}
                    <Cite id="F10-312">SageMaker Developer Guide, autoscaling on HyperPod EKS</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Deep health checks</td>
                  <td style={TD}>On for the held P-class group, and off for the groups that Karpenter scales</td>
                  <td style={TD}>
                    The GPU diagnostics alone take about 45 to 90 minutes. For a small cluster with no spare nodes, AWS advises:
                    &quot;Recommendation: disable the deep health check config throughout the cluster life cycle.&quot;{' '}
                    <Cite id="F10-318">SageMaker Developer Guide, suggested resilience configurations</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Spot and On-Demand mix</td>
                  <td style={TD}>One Spot group per Availability Zone at count 0, one On-Demand group, and one node class that lists them</td>
                  <td style={TD}>
                    Karpenter prefers the Spot groups and falls back to On-Demand. A group&apos;s purchase option cannot be changed
                    later, so the fallback has to be a second group.{' '}
                    <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>{' '}
                    <Cite id="F10-309">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>consolidateAfter</code>
                  </td>
                  <td style={TD}>Greater than zero. We use one to two minutes.</td>
                  <td style={TD}>
                    AWS advises: &quot;Set it to non zero upto 2 min to allow graceful pod eviction for any checkpointing needs.&quot;{' '}
                    <Cite id="F10-311">SageMaker Developer Guide, Spot instances in HyperPod</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>terminationGracePeriodSeconds</code>
                  </td>
                  <td style={TD}>Below 120 seconds, with a checkpoint written on the stop signal and periodically</td>
                  <td style={TD}>
                    This is our reasoning, not AWS advice. The Spot notice comes at most two minutes ahead and is best effort, so a
                    longer grace period cannot be honoured.{' '}
                    <Cite id="F10-310">SageMaker Developer Guide, managing node interruption</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Reserved capacity</td>
                  <td style={TD}>A training plan on the P-class training group only</td>
                  <td style={TD}>
                    AWS advises: &quot;we do not recommend using a training plan for the primary instance group of a cluster&quot;. A
                    group on a training plan cannot be scaled by Karpenter.{' '}
                    <Cite id="F10-325">SageMaker Developer Guide, training plans in HyperPod</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Storage and network</td>
                  <td style={TD}>FSx for Lustre for checkpoints, and one Availability Zone for a multi-node group</td>
                  <td style={TD}>
                    A cluster deploys in a single Availability Zone by default. AWS calls FSx optional for creating a cluster and
                    recommended for production. <Cite id="F10-326">SageMaker Developer Guide, HyperPod storage</Cite>{' '}
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
          <Header
            variant="h2"
            description="You will know the HyperPod limits that are easy to miss when you plan a cluster, and how to plan around each one."
          >
            Where HyperPod is weaker, and how to plan around it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>Its distinctive features target P-class nodes.</strong> Deep health checks, checkpointless training, placement by
              network topology and training plans are built for multi-GPU P instances. As of November 2026, no G-family instance type
              is on the training plan list. For a fleet of one-GPU G instances, HyperPod is in effect a managed node pool with
              Karpenter, so weigh it against section 25, AWS Batch, and section 28, Amazon EKS.{' '}
              <Cite id="F10-334">synthesis of the HyperPod entries</Cite>{' '}
              <Cite id="F09-35">SageMaker Developer Guide, training plans</Cite>
            </li>
            <li>
              <strong>Some features exclude each other.</strong> A group cannot combine Karpenter scaling with deep health checks or
              with a training plan. Decide for each group, as the figure does.{' '}
              <Cite id="F10-312">SageMaker Developer Guide, create a NodeClass</Cite>
            </li>
            <li>
              <strong>The Slurm path is a fixed pool.</strong> Capacity changes only when someone calls <code>UpdateCluster</code> or{' '}
              <code>BatchDeleteClusterNodes</code>, and the controller is an instance that you size and pay for. As of November 2026,
              no page of the HyperPod Slurm documentation describes Spot Instances or autoscaling. Choose Slurm for a held pool, and
              size the pool for the steady load. <Cite id="F10-313">SageMaker Developer Guide, Slurm cluster operations</Cite>
            </li>
            <li>
              <strong>A held node bills whether or not it has work.</strong> Only Karpenter-scaled groups on the EKS path can scale to
              zero. Put only steady work on held groups.{' '}
              <Cite id="F09-33">Amazon SageMaker AI pricing page, HyperPod note</Cite>
            </li>
            <li>
              <strong>Check versions and IP addresses before you build.</strong> The training operator supports Kubernetes 1.28 to
              1.33, which is a narrower range than HyperPod itself supports. Under EKS, each P5 instance can take 81 IP addresses, so
              size the subnet for the number of nodes you plan.{' '}
              <Cite id="F10-317">SageMaker Developer Guide, HyperPod training operator</Cite>{' '}
              <Cite id="F10-327">SageMaker Developer Guide, HyperPod prerequisites</Cite>
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="You will know which service takes the work that HyperPod is wrong for, and how to start if HyperPod is right."
          >
            Where to go next
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ul style={LIST}>
            <li>
              <strong>AWS Batch.</strong> Section 25, AWS Batch, covers independent array jobs that need no standing cluster, such as
              simulation runs, evaluation rollouts and data curation.
            </li>
            <li>
              <strong>AWS Parallel Computing Service.</strong> Section 26, AWS Parallel Computing Service, covers Slurm with node groups
              that scale to zero.
            </li>
            <li>
              <strong>Amazon EKS.</strong> Section 28, Amazon EKS, covers clusters where you want EC2 instance names without the{' '}
              <code>ml.</code> prefix, a scheduler that hands out fractions of a GPU, or services that run next to the training jobs.
            </li>
            <li>
              <strong>Comparing the services.</strong> Section 24, Orchestrating Physical AI on AWS, covers the purchase options and
              how the schedulers connect to each other. Section 29, Choosing, covers the decision across all four services.
            </li>
          </ul>
          <Box variant="p">
            If HyperPod fits, start small on the EKS path. Create one Spot group and one On-Demand group at count 0, one node class and
            one compute allocation, and run one short job with the auto-resume annotations. Remove the job&apos;s node and check that
            the job comes back from its checkpoint. Add the held group and its deep health checks, which take about 45 to 90 minutes per
            new node, only when a reservation justifies them.{' '}
            <Cite id="F10-318">SageMaker Developer Guide, deep health checks</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
