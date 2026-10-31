import { useRef } from 'react';
import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  gh,
  ghTree,
  HYPERPOD_RECIPES_TAG,
  KUBEFLOW_TRAINER_SHA,
  KUEUE_SHA,
  SAGEMAKER_SDK_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { EKS_FEES, PCS_FEES, PRICES } from '../lib/presets';
import type { PricePath } from '../lib/presets';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register date for rows cited without re-opening their source. */
const R1 = '2026-10-30';

const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const SM_API = 'https://docs.aws.amazon.com/sagemaker/latest/APIReference/';

/* SageMaker training jobs */
const SM_CREATE_JOB = `${SM_API}API_CreateTrainingJob.html`;
const SM_TRAIN = `${SM_DG}how-it-works-training.html`;
const SM_DIST = `${SM_DG}distributed-training.html`;
const SM_REPAIR = `${SM_DG}model-checkpoints-cluster-repair.html`;
const SM_RETRY = `${SM_API}API_RetryStrategy.html`;
const SM_SPOT = `${SM_DG}model-managed-spot-training.html`;
const SM_WARM = `${SM_DG}train-warm-pools.html`;
const SM_PLANS = `${SM_DG}reserve-capacity-with-training-plans.html`;
const SM_PLAN_JOBS = `${SM_DG}training-plan-utilization-for-training-jobs.html`;
const SM_TRN_JOBS_TUTORIAL = `${SM_DG}sagemaker-hyperpod-trainium-sagemaker-training-jobs-pretrain-tutorial.html`;
const SMP_NOTES = `${SM_DG}model-parallel-release-notes.html`;
const SM_SDK = gh('aws/sagemaker-python-sdk', SAGEMAKER_SDK_TAG, 'README.rst');
const SM_PRICING_PAGE = 'https://aws.amazon.com/sagemaker/ai/pricing/';
const SM_PRICE =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv';
const EC2_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const BATCH_SERVICE_JOBS = 'https://docs.aws.amazon.com/batch/latest/userguide/service-jobs.html';

/* SageMaker HyperPod */
const HP_SLURM = `${SM_DG}sagemaker-hyperpod-slurm.html`;
const HP_EKS = `${SM_DG}sagemaker-hyperpod-eks.html`;
const HP_HMA = `${SM_DG}sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html`;
const HP_SLURM_HEALTH = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html`;
const HP_SLURM_DEEP = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`;
const HP_EKS_DEEP = `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`;
const HP_AUTO_RESUME = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-auto-resume.html`;
const HP_EKS_RECOVERY = `${SM_DG}sagemaker-hyperpod-eks-resiliency-node-recovery.html`;
const HP_FAQ_SLURM = `${SM_DG}sagemaker-hyperpod-faq-slurm.html`;
const HP_OPERATOR = `${SM_DG}sagemaker-eks-operator.html`;
const HP_OPERATOR_USAGE = `${SM_DG}sagemaker-eks-operator-usage.html`;
const HP_GOVERNANCE = `${SM_DG}sagemaker-hyperpod-eks-operate-console-ui-governance.html`;
const HP_SPOT = `${SM_DG}sagemaker-hyperpod-spot.html`;
const HP_RELEASE = `${SM_DG}sagemaker-hyperpod-release-notes.html`;
const HP_AMI_SLURM = `${SM_DG}sagemaker-hyperpod-release-ami-slurm.html`;
const HP_AMI_EKS = `${SM_DG}sagemaker-hyperpod-release-ami-eks.html`;
const HP_TRN_SLURM_TUTORIAL = `${SM_DG}hyperpod-trainium-slurm-cluster-pretrain-tutorial.html`;
const HP_RECIPES_TREE = ghTree('aws/sagemaker-hyperpod-recipes', HYPERPOD_RECIPES_TAG);
const WN_HP_CUSTOM_AMI = 'https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/';

/* AWS PCS */
const PCS_UG = 'https://docs.aws.amazon.com/pcs/latest/userguide/';
const PCS_VERSIONS = `${PCS_UG}slurm-versions.html`;
const PCS_CUSTOM_AMI = `${PCS_UG}working-with_ami_custom.html`;
const PCS_DLAMI = `${PCS_UG}working-with_ami_pcs-ready-dlami.html`;
const PCS_SIZE = `${PCS_UG}working-with_clusters_size.html`;
const PCS_CB = `${PCS_UG}capacity-blocks.html`;
const PCS_TOC = `${PCS_UG}toc-contents.json`;
const PCS_EFA = `${PCS_UG}working-with_networking_efa.html`;
const PCS_AMI_NOTES = `${PCS_UG}ami-release-notes.html`;
const PCS_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json';
const PCS_PRICING = 'https://aws.amazon.com/pcs/pricing/';

/* Self-managed Slurm on EC2 */
const PC_WHATIS = 'https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html';
const PC_SUPPORT = 'https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html';
const DLAMI_BASE = 'https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html';
const SLURM_SBATCH = 'https://slurm.schedmd.com/sbatch.html';
const EC2_CB = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';

/* Self-managed EKS */
const EKS_UG = 'https://docs.aws.amazon.com/eks/latest/userguide/';
const EKS_COMPUTE = `${EKS_UG}ml-compute-management.html`;
const EKS_NODE_GROUPS = `${EKS_UG}ml-node-groups.html`;
const EKS_REPAIR = `${EKS_UG}ml-validate-gpu-node-repair.html`;
const EKS_TOPOLOGY = `${EKS_UG}ml-workload-topology.html`;
const EKS_NEURON = `${EKS_UG}device-management-neuron.html`;
const EKS_AMI = `${EKS_UG}ml-eks-optimized-ami.html`;
const EKS_VERSIONS = `${EKS_UG}kubernetes-versions.html`;
const EKS_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEKS/20261027191639/us-east-1/index.json';
const KUEUE = gh('kubernetes-sigs/kueue', KUEUE_SHA, 'README.md');
const KF_TRAINER = gh('kubeflow/trainer', KUBEFLOW_TRAINER_SHA, 'README.md');

/* AWS Batch on EKS */
const BATCH_UG = 'https://docs.aws.amazon.com/batch/latest/userguide/';
const BATCH_EKS = `${BATCH_UG}eks.html`;
const BATCH_SHARED = `${BATCH_UG}eks-ce-shared-responsibility.html`;
const BATCH_MNP = `${BATCH_UG}mnp-eks-jobs.html`;
const BATCH_MNP_RUN = `${BATCH_UG}mnp-eks-running-mnp-jobs.html`;
const BATCH_EFA = `${BATCH_UG}efa.html`;
const BATCH_RETRIES = `${BATCH_UG}job_retries.html`;
const BATCH_PRICING = 'https://aws.amazon.com/batch/pricing/';

/* ------------------------------------------------------------------------ */
/* Numbers                                                                  */
/* ------------------------------------------------------------------------ */

/**
 * p5.48xlarge rates in us-east-1, per instance-hour, taken from the calculators' price table so the page
 * and the calculators cannot disagree (SageMaker offer 20261029165009, EC2 offer 20261029175634; T05-23, W5-1).
 */
function p5Rate(path: PricePath): number {
  const row = PRICES.find((p) => p.instance === 'p5.48xlarge' && p.path === path && p.region === 'US East (N. Virginia)');
  if (!row) throw new RangeError(`AwsOwnership: no us-east-1 p5.48xlarge price row for path ${path}`);
  return row.usdPerUnitHour.value;
}
const EC2_P5 = p5Rate('ec2OnDemand');
const SM_TRAIN_P5 = p5Rate('sagemakerTraining');
const HP_CLUSTER_P5 = p5Rate('hyperpod');
const SM_RATIO = (SM_TRAIN_P5 / EC2_P5).toFixed(2);
const HP_RATIO = (HP_CLUSTER_P5 / EC2_P5).toFixed(2);
/** Our arithmetic: a 32-instance p5.48xlarge HyperPod cluster for one day. */
const HP_DAY_32 = HP_CLUSTER_P5 * 32 * 24;

const PCS_SMALL = PCS_FEES.controllerUsdPerHour.small.value;
const PCS_MEDIUM = PCS_FEES.controllerUsdPerHour.medium.value;
const PCS_LARGE = PCS_FEES.controllerUsdPerHour.large.value;
const PCS_NODE = PCS_FEES.advancedNodeUsdPerInstanceHour.value;
const EKS_CLUSTER = EKS_FEES.clusterUsdPerHour.value;
const EKS_EXTENDED = EKS_FEES.extendedSupportExtraUsdPerHour.value;
const autoModeP5 = EKS_FEES.autoModeUsdPerInstanceHour['p5.48xlarge'];
if (!autoModeP5) throw new RangeError('AwsOwnership: no EKS Auto Mode fee for p5.48xlarge');
const EKS_AUTO_P5 = autoModeP5.value;

const usd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
const usd2 = (v: number) => `$${v.toFixed(2)}`;

/* ------------------------------------------------------------------------ */
/* The matrix: seven paths, three shapes, ten concerns                      */
/* ------------------------------------------------------------------------ */

type Own = 'aws' | 'you' | 'gap' | 'fact';
type ShapeId = 'job' | 'slurm' | 'k8s';
type PathId = 'jobs' | 'ec2' | 'pcs' | 'hps' | 'eks' | 'batch' | 'hpe';
type ConcernId =
  | 'sched'
  | 'health'
  | 'replace'
  | 'restart'
  | 'capacity'
  | 'image'
  | 'fabric'
  | 'trainium'
  | 'cost'
  | 'status';

interface Shape {
  id: ShapeId;
  label: string;
  /** The wide grid's group bar is one column wide for a one-path shape, so it takes a shorter label. */
  barLabel: string;
}

interface PathDef {
  id: PathId;
  shape: ShapeId;
  head: string[];
  title: string;
}

interface Concern {
  id: ConcernId;
  label: string;
  lines: string[];
}

interface Cell {
  own: Own;
  /** At most two lines of at most 15 characters, so a cell fits both layouts. */
  short: string[];
  detail: ReactNode;
}

const SHAPES: Shape[] = [
  { id: 'job', label: 'Cluster per job', barLabel: 'Per job' },
  { id: 'slurm', label: 'Long-lived Slurm cluster', barLabel: 'Long-lived Slurm cluster' },
  { id: 'k8s', label: 'Long-lived Kubernetes cluster', barLabel: 'Long-lived Kubernetes cluster' },
];

const PATHS: PathDef[] = [
  { id: 'jobs', shape: 'job', head: ['SageMaker', 'training jobs'], title: 'SageMaker training jobs' },
  { id: 'ec2', shape: 'slurm', head: ['Your own', 'Slurm on EC2'], title: 'Your own Slurm on EC2 (by hand or with AWS ParallelCluster)' },
  { id: 'pcs', shape: 'slurm', head: ['AWS PCS'], title: 'AWS PCS' },
  { id: 'hps', shape: 'slurm', head: ['HyperPod', 'Slurm'], title: 'SageMaker HyperPod with Slurm' },
  { id: 'eks', shape: 'k8s', head: ['Self-managed', 'EKS'], title: 'Self-managed EKS' },
  { id: 'batch', shape: 'k8s', head: ['AWS Batch', 'on EKS'], title: 'AWS Batch on EKS' },
  { id: 'hpe', shape: 'k8s', head: ['HyperPod', 'EKS'], title: 'SageMaker HyperPod with EKS' },
];

const CONCERNS: Concern[] = [
  { id: 'sched', label: 'Scheduler and gang admission', lines: ['Scheduler and', 'gang admission'] },
  { id: 'health', label: 'Node health checks', lines: ['Node health', 'checks'] },
  { id: 'replace', label: 'Node replacement', lines: ['Node', 'replacement'] },
  { id: 'restart', label: 'Job restart after a failure', lines: ['Job restart'] },
  { id: 'capacity', label: 'Capacity', lines: ['Capacity'] },
  { id: 'image', label: 'Node image', lines: ['Node image'] },
  { id: 'fabric', label: 'Fabric (EFA) setup', lines: ['Fabric (EFA)', 'setup'] },
  { id: 'trainium', label: 'Trainium', lines: ['Trainium'] },
  { id: 'cost', label: 'Cost beyond the instance', lines: ['Cost beyond', 'the instance'] },
  { id: 'status', label: 'Status and limits to check', lines: ['Status and', 'limits'] },
];

const OWN_WORD: Record<Own, string> = {
  aws: 'AWS.',
  you: 'Yours.',
  gap: 'Not documented in the pages read.',
  fact: '',
};

const EFA_SAGEMAKER_LINK = <Link href="../efa/">EFA dive, section 16: EFA on SageMaker and HyperPod</Link>;
const EFA_EKS_LINK = <Link href="../efa/">EFA dive, section 15: EFA on Amazon EKS</Link>;

const MATRIX: Record<PathId, Record<ConcernId, Cell>> = {
  jobs: {
    sched: {
      own: 'aws',
      short: ['One job,', 'one cluster'],
      detail: (
        <>
          Each job names the compute instances to deploy for it{' '}
          <Cite tier={1} href={SM_CREATE_JOB}>
            SageMaker API reference, CreateTrainingJob, ResourceConfig
          </Cite>
          . Team queues, priorities and fair share come from AWS Batch service jobs: Batch holds the queue and SageMaker
          runs the job{' '}
          <Cite tier={1} href={BATCH_SERVICE_JOBS} accessed={R1}>
            AWS Batch User Guide, service jobs
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'aws',
      short: ['GPU check after', 'a job fails'],
      detail: (
        <>
          A job that fails on a GPU gets a GPU health check. Repair starts only after the job fails, and the page describes
          no screening of nodes before the job starts{' '}
          <Cite tier={1} href={SM_REPAIR}>
            SageMaker Developer Guide, cluster repairs for GPU errors
          </Cite>
          .
        </>
      ),
    },
    replace: {
      own: 'aws',
      short: ['Reboot/replace,', 'up to 10 tries'],
      detail: (
        <>
          A recoverable GPU error reboots the instance; otherwise SageMaker replaces it. Up to 10 repair attempts, and the
          repair is not billed{' '}
          <Cite tier={1} href={SM_REPAIR}>
            SageMaker Developer Guide, cluster repairs for GPU errors
          </Cite>
          .
        </>
      ),
    },
    restart: {
      own: 'aws',
      short: ['Restart from', 'your checkpoint'],
      detail: (
        <>
          After a successful repair, the job restarts from the previous checkpoint{' '}
          <Cite tier={1} href={SM_REPAIR}>
            SageMaker Developer Guide, cluster repairs for GPU errors
          </Cite>
          ; managed Spot copies checkpoints between a local path and S3 (Amazon Simple Storage Service) and resumes from
          them{' '}
          <Cite tier={1} href={SM_SPOT}>
            SageMaker Developer Guide, managed Spot training
          </Cite>
          ; a retry strategy reruns a job that fails with an internal server error, 1 to 30 times{' '}
          <Cite tier={1} href={SM_RETRY}>
            SageMaker API reference, RetryStrategy
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['On-Demand, Spot', 'or a plan'],
      detail: (
        <>
          On-Demand; managed Spot, which never falls back to On-Demand{' '}
          <Cite tier={1} href={SM_SPOT}>
            SageMaker Developer Guide, managed Spot training
          </Cite>
          ; or a training plan bought for training jobs, which cannot be interchanged between targets{' '}
          <Cite tier={1} href={SM_PLANS}>
            SageMaker Developer Guide, training plans
          </Cite>
          .
        </>
      ),
    },
    image: {
      own: 'aws',
      short: ['AWS hosts,', 'your container'],
      detail: (
        <>
          Training runs in a Docker image, an AWS one or your own, on instances SageMaker deploys for the job{' '}
          <Cite tier={1} href={SM_TRAIN}>
            SageMaker Developer Guide, train a model
          </Cite>
          ; inside it any launcher works, <code>torchrun</code> and <code>mpirun</code> included{' '}
          <Cite tier={1} href={SM_DIST} accessed={R1}>
            SageMaker Developer Guide, distributed training
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'aws',
      short: ['Follows the', 'instance type'],
      detail: (
        <>
          EFA follows from the instance type and an allowlist in the SageMaker Python SDK (software development kit), with
          no EFA field on CreateTrainingJob; the {EFA_SAGEMAKER_LINK} shows how to confirm NCCL (NVIDIA Collective
          Communications Library) actually runs over it.
        </>
      ),
    },
    trainium: {
      own: 'gap',
      short: ['Repair page', 'names GPUs only'],
      detail: (
        <>
          The cluster repair page names GPU errors only{' '}
          <Cite tier={1} href={SM_REPAIR}>
            SageMaker Developer Guide, cluster repairs for GPU errors
          </Cite>
          , and the Trainium training-job tutorial sets a recipe path{' '}
          <Cite tier={1} href={SM_TRN_JOBS_TUTORIAL}>
            SageMaker Developer Guide, Trainium training-job tutorial
          </Cite>{' '}
          that the recipes repository no longer ships at release 2.0.11{' '}
          <Cite tier={1} href={HP_RECIPES_TREE} accessed={R1} kind="code">
            sagemaker-hyperpod-recipes tree at 2.0.11
          </Cite>
          .
        </>
      ),
    },
    cost: {
      own: 'fact',
      short: [`${SM_RATIO}x EC2, for`, 'the job only'],
      detail: (
        <>
          The SageMaker training rate, billed for the job&apos;s duration: {SM_RATIO} times EC2 On-Demand on the four P5 and
          P6 types read in us-east-1, ${SM_TRAIN_P5} against ${EC2_P5} per p5.48xlarge-hour{' '}
          <Cite tier={1} href={SM_PRICE}>
            SageMaker Price List, us-east-1, version 20261029165009
          </Cite>{' '}
          <Cite tier={1} href={EC2_PRICE}>
            EC2 Price List, us-east-1, version 20261029175634
          </Cite>
          . A warm pool is billed while it is kept{' '}
          <Cite tier={1} href={SM_WARM}>
            SageMaker Developer Guide, managed warm pools
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['v3 ModelTrainer,', 'not Estimator'],
      detail: (
        <>
          SDK v3 replaces <code>Estimator</code> with <code>ModelTrainer</code>{' '}
          <Cite tier={1} href={SM_SDK} accessed={R1}>
            sagemaker-python-sdk README.rst at v3.28.0
          </Cite>
          ; SMP (the SageMaker model parallelism library) v2 last released v2.8.0 on 2025-04-01{' '}
          <Cite tier={1} href={SMP_NOTES}>
            SMP release notes
          </Cite>
          .
        </>
      ),
    },
  },
  ec2: {
    sched: {
      own: 'you',
      short: ['Your Slurm', 'controller'],
      detail: (
        <>
          You run the Slurm controller. AWS ParallelCluster can deploy it and charges nothing itself: you pay for the
          controller instance and the other resources it creates{' '}
          <Cite tier={1} href={PC_WHATIS}>
            AWS ParallelCluster User Guide
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'you',
      short: ['You build', 'the checks'],
      detail: <>Yours to build with Slurm&apos;s own mechanisms; no AWS health agent comes with this path, our reading.</>,
    },
    replace: {
      own: 'you',
      short: ['You replace', 'nodes'],
      detail: <>Yours, our reading: nothing on this path replaces a node for you.</>,
    },
    restart: {
      own: 'you',
      short: ['Slurm requeue', 'or torchrun'],
      detail: (
        <>
          Yours. With <code>--requeue</code>, Slurm can requeue a job after a node failure, and the batch script starts
          again from its beginning{' '}
          <Cite tier={1} href={SLURM_SBATCH}>
            Slurm sbatch documentation
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['Any EC2 option,', 'Capacity Blocks'],
      detail: (
        <>
          Any EC2 purchase option, Capacity Blocks included{' '}
          <Cite tier={1} href={EC2_CB}>
            EC2 User Guide, Capacity Blocks
          </Cite>
          ; section 22 compares them.
        </>
      ),
    },
    image: {
      own: 'you',
      short: ['Your AMI;', 'DLAMI as base'],
      detail: (
        <>
          Your AMI. A DLAMI, the Deep Learning Base GPU AMI for Ubuntu 24.04 release 20261027, is a
          starting point with the NVIDIA driver, EFA installer 1.51.0 and aws-ofi-nccl 1.22.0{' '}
          <Cite tier={1} href={DLAMI_BASE} accessed={R1}>
            DLAMI Developer Guide, Base GPU AMI release 20261027
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'you',
      short: ['You set up', 'EFA'],
      detail: (
        <>
          Yours: the DLAMI carries the EFA installer{' '}
          <Cite tier={1} href={DLAMI_BASE} accessed={R1}>
            DLAMI Developer Guide, Base GPU AMI release 20261027
          </Cite>
          , and the interfaces, security group and placement are set at launch, our reading.
        </>
      ),
    },
    trainium: {
      own: 'you',
      short: ['You build the', 'Neuron stack'],
      detail: <>You build the Neuron software stack, our reading; section 27, Trainium: The Neuron Path, covers it.</>,
    },
    cost: {
      own: 'fact',
      short: ['None; you run', 'the controller'],
      detail: (
        <>
          No ParallelCluster fee; you pay for the resources it creates{' '}
          <Cite tier={1} href={PC_WHATIS}>
            AWS ParallelCluster User Guide
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['AWS recommends', 'PCS instead'],
      detail: (
        <>
          ParallelCluster 3.16.x is supported to 2028-02-20{' '}
          <Cite tier={1} href={PC_SUPPORT} accessed={R1}>
            AWS ParallelCluster support policy
          </Cite>
          , and every page of its user guide opens with a banner recommending AWS PCS instead{' '}
          <Cite tier={1} href={PC_WHATIS}>
            AWS ParallelCluster User Guide
          </Cite>
          .
        </>
      ),
    },
  },
  pcs: {
    sched: {
      own: 'aws',
      short: ['AWS runs the', 'controller'],
      detail: (
        <>
          AWS runs the Slurm controller and updates it with patch versions{' '}
          <Cite tier={1} href={PCS_VERSIONS}>
            AWS PCS User Guide, Slurm versions
          </Cite>
          . Cluster size is fixed at creation: Small up to 32 instances, Medium 512, Large 2,048{' '}
          <Cite tier={1} href={PCS_SIZE} accessed={R1}>
            AWS PCS User Guide, cluster size
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'you',
      short: ['You build them', '(none in guide)'],
      detail: (
        <>
          Yours: the PCS user guide&apos;s table of contents has no entry containing &quot;health&quot;, and its AMI pages
          name no health agent{' '}
          <Cite tier={1} href={PCS_TOC}>
            AWS PCS User Guide, table of contents
          </Cite>
          .
        </>
      ),
    },
    replace: {
      own: 'you',
      short: ['You replace', 'nodes'],
      detail: <>Yours, our reading of the same guide.</>,
    },
    restart: {
      own: 'you',
      short: ['Slurm requeue,', 'yours'],
      detail: (
        <>
          Yours, through Slurm&apos;s <code>--requeue</code>, which restarts the batch script from its beginning{' '}
          <Cite tier={1} href={SLURM_SBATCH}>
            Slurm sbatch documentation
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['One Block per', 'node group'],
      detail: (
        <>
          Capacity comes through each compute node group&apos;s launch template, with one Capacity Block per node group at
          a time; at the block&apos;s end its instances are terminated and queued jobs stay pending{' '}
          <Cite tier={1} href={PCS_CB} accessed={R1}>
            AWS PCS User Guide, Capacity Blocks
          </Cite>
          .
        </>
      ),
    },
    image: {
      own: 'you',
      short: ['Your AMI with', 'the PCS agent'],
      detail: (
        <>
          Your AMI, carrying the PCS agent and a compatible Slurm{' '}
          <Cite tier={1} href={PCS_CUSTOM_AMI} accessed={R1}>
            AWS PCS User Guide, custom AMIs
          </Cite>
          ; a PCS-ready DLAMI exists for GPU nodes and includes no machine learning framework such as PyTorch{' '}
          <Cite tier={1} href={PCS_DLAMI}>
            AWS PCS User Guide, PCS-ready DLAMI
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'you',
      short: ['EFA in your', 'launch template'],
      detail: (
        <>
          Yours: the node group&apos;s AMI must have the EFA driver installed and loaded, and you set up the security
          group, launch template and node group for EFA{' '}
          <Cite tier={1} href={PCS_EFA}>
            AWS PCS User Guide, using EFA
          </Cite>
          .
        </>
      ),
    },
    trainium: {
      own: 'you',
      short: ['No Neuron AMI', 'located'],
      detail: (
        <>
          No PCS AMI with the Neuron stack was located on the PCS sample-AMI and PCS-ready DLAMI pages{' '}
          <Cite tier={1} href={PCS_AMI_NOTES}>
            AWS PCS User Guide, AMI release notes
          </Cite>
          , so a Trainium node group runs an AMI you build, our reading. Trn instances bill at the advanced
          node-management tier{' '}
          <Cite tier={1} href={PCS_PRICING} accessed={R1}>
            AWS PCS pricing
          </Cite>
          .
        </>
      ),
    },
    cost: {
      own: 'fact',
      short: [`$${PCS_NODE}/inst-hour`, '+ controller'],
      detail: (
        <>
          Controller ${PCS_SMALL}, ${PCS_MEDIUM} or ${PCS_LARGE} per hour (Small, Medium, Large), plus ${PCS_NODE} per P or Trn
          instance-hour, us-east-1{' '}
          <Cite tier={1} href={PCS_PRICE}>
            AWS PCS Price List, us-east-1, version 20261027150327
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['Slurm 25.05', 'ends 2026-11-30'],
      detail: (
        <>
          Slurm 25.05 reaches end of life on PCS on 2026-11-30. SchedMD ships a major version every six months and PCS
          supports each for about 18 months from SchedMD&apos;s release, so a cluster takes a major upgrade about once a
          year{' '}
          <Cite tier={1} href={PCS_VERSIONS}>
            AWS PCS User Guide, Slurm versions
          </Cite>
          .
        </>
      ),
    },
  },
  hps: {
    sched: {
      own: 'aws',
      short: ['HyperPod-built', 'Slurm cluster'],
      detail: (
        <>
          Slurm on controller, login and worker nodes that HyperPod provisions; you shape the environment with lifecycle
          scripts{' '}
          <Cite tier={1} href={HP_SLURM}>
            SageMaker Developer Guide, HyperPod with Slurm
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'aws',
      short: ['Agent, deep', 'checks (GPU)'],
      detail: (
        <>
          A health-monitoring agent checks every node continuously, with the same checks as on EKS{' '}
          <Cite tier={1} href={HP_SLURM_HEALTH} accessed={R1}>
            SageMaker Developer Guide, HyperPod Slurm cluster health checks
          </Cite>{' '}
          <Cite tier={1} href={HP_HMA}>
            SageMaker Developer Guide, HyperPod health monitoring
          </Cite>
          ; deep health checks run when nodes join or on demand, and list GPU instances only{' '}
          <Cite tier={1} href={HP_SLURM_DEEP}>
            SageMaker Developer Guide, HyperPod Slurm deep health checks
          </Cite>
          .
        </>
      ),
    },
    replace: {
      own: 'aws',
      short: ['Automatic,', 'default on'],
      detail: (
        <>
          Automatic node recovery is the default and reboots or replaces faulty nodes; under auto-resume, nodes are always
          replaced{' '}
          <Cite tier={1} href={HP_AUTO_RESUME}>
            SageMaker Developer Guide, HyperPod Slurm auto-resume
          </Cite>
          .
        </>
      ),
    },
    restart: {
      own: 'aws',
      short: ['srun', '--auto-resume=1'],
      detail: (
        <>
          A job step launched with <code>srun --auto-resume=1</code> resumes from the last checkpoint once the faulty
          nodes are replaced; jobs without it exit and wait for resubmission{' '}
          <Cite tier={1} href={HP_AUTO_RESUME}>
            SageMaker Developer Guide, HyperPod Slurm auto-resume
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['On-Demand or', 'a HyperPod plan'],
      detail: (
        <>
          On-Demand instances or a training plan bought for HyperPod{' '}
          <Cite tier={1} href={SM_PLANS}>
            SageMaker Developer Guide, training plans
          </Cite>
          .
        </>
      ),
    },
    image: {
      own: 'aws',
      short: ['HyperPod DLAMI', 'or custom AMI'],
      detail: (
        <>
          The HyperPod DLAMI, shaped by lifecycle scripts{' '}
          <Cite tier={1} href={HP_SLURM}>
            SageMaker Developer Guide, HyperPod with Slurm
          </Cite>
          , or since 2026-07-13 a custom AMI built on HyperPod&apos;s base AMI{' '}
          <Cite tier={2} href={WN_HP_CUSTOM_AMI}>
            AWS What&apos;s New, custom AMIs for HyperPod Slurm clusters
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'aws',
      short: ['In the', 'HyperPod AMI'],
      detail: (
        <>
          HyperPod manages it: the October 2026 HyperPod Slurm AMI lists EFA installer 1.50.0{' '}
          <Cite tier={1} href={HP_AMI_SLURM}>
            HyperPod Slurm AMI release notes
          </Cite>
          ; the {EFA_SAGEMAKER_LINK} covers the managed component.
        </>
      ),
    },
    trainium: {
      own: 'aws',
      short: ['Neuron agent;', 'deep checks GPU'],
      detail: (
        <>
          The agent runs Neuron checks{' '}
          <Cite tier={1} href={HP_HMA}>
            SageMaker Developer Guide, HyperPod health monitoring
          </Cite>
          , but the Slurm deep health checks list GPU instances only{' '}
          <Cite tier={1} href={HP_SLURM_DEEP}>
            HyperPod Slurm deep health checks
          </Cite>
          ; the recipes repository has no Trainium recipe at 2.0.11{' '}
          <Cite tier={1} href={HP_RECIPES_TREE} accessed={R1} kind="code">
            sagemaker-hyperpod-recipes tree at 2.0.11
          </Cite>
          , and the Trainium Slurm tutorial launches a script it no longer ships{' '}
          <Cite tier={1} href={HP_TRN_SLURM_TUTORIAL} accessed={R1} kind="doc-code-conflict">
            HyperPod Trainium Slurm tutorial
          </Cite>
          .
        </>
      ),
    },
    cost: {
      own: 'fact',
      short: [`${HP_RATIO}x EC2,`, 'idle included'],
      detail: (
        <>
          The HyperPod cluster rate, {HP_RATIO} times EC2 On-Demand on the four P5 and P6 types read in us-east-1,
          ${HP_CLUSTER_P5} per p5.48xlarge-hour{' '}
          <Cite tier={1} href={SM_PRICE}>
            SageMaker Price List, us-east-1, version 20261029165009
          </Cite>
          , billed per instance-hour for as long as the cluster exists, plus storage{' '}
          <Cite tier={1} href={SM_PRICING_PAGE} accessed={R1}>
            SageMaker AI pricing, pricing example 16
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['Agent needs', 'an AMI update'],
      detail: (
        <>
          Slurm clusters gained the health-monitoring agent on 2025-09-11; an older cluster gets it by updating to the
          latest AMI{' '}
          <Cite tier={1} href={HP_AUTO_RESUME}>
            SageMaker Developer Guide, HyperPod Slurm auto-resume
          </Cite>
          .
        </>
      ),
    },
  },
  eks: {
    sched: {
      own: 'you',
      short: ['You add Kueue', 'or Volcano'],
      detail: (
        <>
          Yours: the default scheduler places pods one at a time and gives no all-or-nothing admission{' '}
          <Cite tier={1} href={EKS_TOPOLOGY} accessed={R1}>
            EKS User Guide, network topology
          </Cite>
          , so you add a gang scheduler; Kueue starts no pod until there is quota for all of them{' '}
          <Cite tier={1} href={KUEUE}>
            Kueue README at v0.20.4
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'aws',
      short: ['Node monitoring', 'agent'],
      detail: (
        <>
          The EKS node monitoring agent reads Xid errors (the NVIDIA driver&apos;s numbered GPU error reports) from DCGM
          (NVIDIA Data Center GPU Manager) and sets the node&apos;s{' '}
          <code>AcceleratedHardwareReady</code> condition; on by default in Auto Mode, an add-on plus a Karpenter feature
          gate otherwise{' '}
          <Cite tier={1} href={EKS_REPAIR}>
            EKS User Guide, GPU node repair
          </Cite>
          .
        </>
      ),
    },
    replace: {
      own: 'aws',
      short: ['Auto repair;', 'on in Auto Mode'],
      detail: (
        <>
          Automatic node repair replaces or reboots the node, and stops acting when too many nodes in a NodePool are
          unhealthy{' '}
          <Cite tier={1} href={EKS_REPAIR}>
            EKS User Guide, GPU node repair
          </Cite>
          .
        </>
      ),
    },
    restart: {
      own: 'you',
      short: ['Your job', 'controller'],
      detail: (
        <>
          Yours, through a job controller, and the API is mid-migration: Kueue deprecates PyTorchJob in favour of TrainJob
          or JobSet{' '}
          <Cite tier={1} href={KUEUE}>
            Kueue README at v0.20.4
          </Cite>
          , and Kubeflow calls TrainJob alpha{' '}
          <Cite tier={1} href={KF_TRAINER}>
            Kubeflow Trainer README at v2.3.0
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['Blocks through', 'launch template'],
      detail: (
        <>
          Node groups, Karpenter or Auto Mode, with reserved capacity used first{' '}
          <Cite tier={1} href={EKS_COMPUTE}>
            EKS User Guide, accelerated compute
          </Cite>
          ; a Capacity Block needs a launch template that targets it, in the block&apos;s Availability Zone{' '}
          <Cite tier={1} href={EKS_NODE_GROUPS} accessed={R1}>
            EKS User Guide, node groups
          </Cite>
          .
        </>
      ),
    },
    image: {
      own: 'aws',
      short: ['EKS GPU AMI or', 'Auto Mode'],
      detail: (
        <>
          EKS-optimized accelerated AMIs carry the GPU driver and the EFA kernel module, without the NVIDIA or EFA device
          plugins{' '}
          <Cite tier={1} href={EKS_AMI}>
            EKS User Guide, accelerated AMIs
          </Cite>
          ; Auto Mode provisions and patches nodes with drivers and device plugins included{' '}
          <Cite tier={1} href={EKS_COMPUTE}>
            EKS User Guide, accelerated compute
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'you',
      short: ['You add the EFA', 'device plugin'],
      detail: (
        <>
          Yours: the EFA device plugin is installed separately on the EKS-optimized AMIs{' '}
          <Cite tier={1} href={EKS_AMI}>
            EKS User Guide, accelerated AMIs
          </Cite>
          ; the {EFA_EKS_LINK} covers it.
        </>
      ),
    },
    trainium: {
      own: 'you',
      short: ['You install the', 'Neuron plugin'],
      detail: (
        <>
          You install the Neuron device plugin, or the Neuron DRA (dynamic resource allocation) driver on Kubernetes 1.34
          and later outside Auto Mode{' '}
          <Cite tier={1} href={EKS_NEURON}>
            EKS User Guide, Neuron devices
          </Cite>
          .
        </>
      ),
    },
    cost: {
      own: 'fact',
      short: [`${usd2(EKS_CLUSTER)} per`, 'cluster-hour'],
      detail: (
        <>
          {usd2(EKS_CLUSTER)} per cluster-hour on standard support, {usd2(EKS_EXTENDED)} more on extended support; Auto Mode adds
          ${EKS_AUTO_P5} per p5.48xlarge-hour, us-east-1{' '}
          <Cite tier={1} href={EKS_PRICE}>
            Amazon EKS Price List, us-east-1, version 20261027191639
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['Job APIs:', 'TrainJob alpha'],
      detail: (
        <>
          Kubernetes 1.34 to 1.37 are on standard support and 1.31 to 1.33 on extended support{' '}
          <Cite tier={1} href={EKS_VERSIONS} accessed={R1}>
            EKS User Guide, Kubernetes versions
          </Cite>
          ; the job API is mid-migration, as the job restart cell says.
        </>
      ),
    },
  },
  batch: {
    sched: {
      own: 'aws',
      short: ['Batch queues,', 'gang-schedules'],
      detail: (
        <>
          Batch schedules from outside the cluster, onto nodes it creates and labels{' '}
          <Cite tier={1} href={BATCH_EKS} accessed={R1}>
            AWS Batch User Guide, EKS compute environments
          </Cite>
          ; its multi-node parallel jobs are gang scheduling{' '}
          <Cite tier={1} href={BATCH_MNP} accessed={R1}>
            AWS Batch User Guide, multi-node parallel jobs on EKS
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'gap',
      short: ['Not in the', 'pages read'],
      detail: (
        <>
          No Batch page read describes GPU node health handling for multi-node jobs on EKS{' '}
          <Cite tier={1} href={BATCH_MNP_RUN}>
            AWS Batch User Guide, running multi-node parallel jobs
          </Cite>
          .
        </>
      ),
    },
    replace: {
      own: 'gap',
      short: ['Own nodes;', 'health not read'],
      detail: (
        <>
          Batch creates and deletes its own nodes and scales them to zero by default when the queue is empty{' '}
          <Cite tier={1} href={BATCH_EKS} accessed={R1}>
            AWS Batch User Guide, EKS compute environments
          </Cite>
          ; replacement driven by node health is not described in the pages read.
        </>
      ),
    },
    restart: {
      own: 'gap',
      short: ['Retries; EKS', 'not stated'],
      detail: (
        <>
          Batch documents a retry strategy of 1 to 10 attempts that covers EC2 instance failure; the page does not name
          EKS jobs{' '}
          <Cite tier={1} href={BATCH_RETRIES}>
            AWS Batch User Guide, automated job retries
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['On-Demand', 'and Spot'],
      detail: (
        <>
          EC2 On-Demand and Spot{' '}
          <Cite tier={1} href={BATCH_EKS} accessed={R1}>
            AWS Batch User Guide, EKS compute environments
          </Cite>
          .
        </>
      ),
    },
    image: {
      own: 'you',
      short: ['You update', 'the AMI'],
      detail: (
        <>
          Yours to update: Batch does not update the compute environment&apos;s AMI or its Kubernetes version{' '}
          <Cite tier={1} href={BATCH_SHARED} accessed={R1}>
            AWS Batch User Guide, shared responsibility for EKS nodes
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'gap',
      short: ['EKS EFA setup', 'not read'],
      detail: (
        <>
          Batch&apos;s EFA page requires the EFA driver in the AMI and one cluster placement group for all EFA instances,
          and its examples use Batch&apos;s container jobs, our reading{' '}
          <Cite tier={1} href={BATCH_EFA}>
            AWS Batch User Guide, EFA
          </Cite>
          ; EFA setup for multi-node jobs on EKS was not located in the pages read.
        </>
      ),
    },
    trainium: {
      own: 'gap',
      short: ['Not read'],
      detail: <>Not read in this research.</>,
    },
    cost: {
      own: 'fact',
      short: ['None; EKS', 'fee applies'],
      detail: (
        <>
          No Batch charge; you pay for the resources{' '}
          <Cite tier={1} href={BATCH_PRICING} accessed={R1}>
            AWS Batch pricing
          </Cite>
          , and the EKS cluster fee applies{' '}
          <Cite tier={1} href={EKS_PRICE}>
            Amazon EKS Price List, us-east-1
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['1,000 instances', 'per job, 1 type'],
      detail: (
        <>
          Up to 1,000 instances in one multi-node job, one instance type per job, one pod per node{' '}
          <Cite tier={1} href={BATCH_MNP_RUN}>
            AWS Batch User Guide, running multi-node parallel jobs
          </Cite>
          .
        </>
      ),
    },
  },
  hpe: {
    sched: {
      own: 'aws',
      short: ['Task governance', '(Kueue add-on)'],
      detail: (
        <>
          Your EKS control plane over HyperPod worker nodes, one EKS cluster per HyperPod cluster{' '}
          <Cite tier={1} href={HP_EKS} accessed={R1}>
            SageMaker Developer Guide, HyperPod with EKS
          </Cite>
          ; task governance installs and configures Kueue for team allocations, priorities, borrowing and preemption{' '}
          <Cite tier={1} href={HP_GOVERNANCE} accessed={R1}>
            SageMaker Developer Guide, HyperPod task governance
          </Cite>
          .
        </>
      ),
    },
    health: {
      own: 'aws',
      short: ['Agent, deep', 'checks, taints'],
      detail: (
        <>
          The same health-monitoring agent as on Slurm, plus deep health checks; a fault becomes node labels, a{' '}
          <code>NoSchedule</code> taint and a node condition{' '}
          <Cite tier={1} href={HP_HMA}>
            SageMaker Developer Guide, HyperPod health monitoring
          </Cite>
          .
        </>
      ),
    },
    replace: {
      own: 'aws',
      short: ['Automatic,', 'default on'],
      detail: (
        <>
          Automatic node recovery, the recommended setting, reboots or replaces faulty nodes{' '}
          <Cite tier={1} href={HP_EKS_RECOVERY} accessed={R1}>
            SageMaker Developer Guide, HyperPod EKS node recovery
          </Cite>
          .
        </>
      ),
    },
    restart: {
      own: 'aws',
      short: ['Operator:', 'process restart'],
      detail: (
        <>
          The HyperPod training operator restarts failed processes in place and detects hung jobs{' '}
          <Cite tier={1} href={HP_OPERATOR}>
            SageMaker Developer Guide, HyperPod training operator
          </Cite>
          , escalating to a full job restart after a set number of process restarts{' '}
          <Cite tier={1} href={HP_OPERATOR_USAGE} accessed={R1}>
            SageMaker Developer Guide, running jobs with the training operator
          </Cite>
          .
        </>
      ),
    },
    capacity: {
      own: 'fact',
      short: ['On-Demand, Spot', 'or a plan'],
      detail: (
        <>
          On-Demand, a training plan bought for HyperPod{' '}
          <Cite tier={1} href={SM_PLANS}>
            SageMaker Developer Guide, training plans
          </Cite>
          , Spot{' '}
          <Cite tier={1} href={HP_SPOT} accessed={R1}>
            SageMaker Developer Guide, HyperPod Spot
          </Cite>
          , and instance groups of up to 20 instance types in priority order{' '}
          <Cite tier={1} href={HP_RELEASE} accessed={R1}>
            HyperPod release notes, 2026-04-16
          </Cite>
          .
        </>
      ),
    },
    image: {
      own: 'aws',
      short: ['HyperPod AMI,', 'your containers'],
      detail: (
        <>
          The HyperPod AMI for EKS, released for EKS 1.31 to 1.36 in October 2026, running your containers{' '}
          <Cite tier={1} href={HP_AMI_EKS}>
            HyperPod EKS AMI release notes
          </Cite>
          .
        </>
      ),
    },
    fabric: {
      own: 'aws',
      short: ['In the', 'HyperPod AMI'],
      detail: (
        <>
          HyperPod manages it: the October 2026 HyperPod EKS AMI lists EFA installer 1.50.0{' '}
          <Cite tier={1} href={HP_AMI_EKS}>
            HyperPod EKS AMI release notes
          </Cite>
          ; the {EFA_SAGEMAKER_LINK} covers the managed component.
        </>
      ),
    },
    trainium: {
      own: 'aws',
      short: ['Neuron agent,', 'deep checks'],
      detail: (
        <>
          Neuron checks in the agent{' '}
          <Cite tier={1} href={HP_HMA}>
            SageMaker Developer Guide, HyperPod health monitoring
          </Cite>
          , and Trainium deep health checks: Neuron sysfs, a Neuron hardware check that runs a training workload, and
          collective-communication tests on one node and across nodes{' '}
          <Cite tier={1} href={HP_EKS_DEEP}>
            SageMaker Developer Guide, HyperPod EKS deep health checks
          </Cite>
          .
        </>
      ),
    },
    cost: {
      own: 'fact',
      short: [`${HP_RATIO}x EC2`, '+ EKS fee'],
      detail: (
        <>
          The HyperPod cluster rate, {HP_RATIO} times EC2 On-Demand on P5 and P6{' '}
          <Cite tier={1} href={SM_PRICE}>
            SageMaker Price List, us-east-1, version 20261029165009
          </Cite>
          , with EKS charged separately{' '}
          <Cite tier={1} href={SM_PRICING_PAGE} accessed={R1}>
            SageMaker AI pricing
          </Cite>{' '}
          at {usd2(EKS_CLUSTER)} per cluster-hour{' '}
          <Cite tier={1} href={EKS_PRICE}>
            Amazon EKS Price List, us-east-1
          </Cite>
          .
        </>
      ),
    },
    status: {
      own: 'fact',
      short: ['Operator table', 'lags the AMIs'],
      detail: (
        <>
          The training operator&apos;s documented matrix lists Kubernetes 1.28 to 1.33 and Kueue v0.12.2 and v0.12.3{' '}
          <Cite tier={1} href={HP_OPERATOR}>
            SageMaker Developer Guide, HyperPod training operator
          </Cite>
          , while HyperPod ships EKS AMIs for 1.31 to 1.36{' '}
          <Cite tier={1} href={HP_AMI_EKS}>
            HyperPod EKS AMI release notes
          </Cite>
          ; check the versions on a test cluster first, our reading.
        </>
      ),
    },
  },
};

/* ------------------------------------------------------------------------ */
/* Diagram: the matrix as a grid, wide and narrow layouts from one dataset  */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const SLATE = '#414d5c';

const OWN_STYLE: Record<Own, { fill: string; stroke: string; dash?: string; text: string }> = {
  aws: { fill: '#d6e9fb', stroke: '#0972d3', text: INK },
  you: { fill: '#fbf3d5', stroke: '#8b6c00', text: INK },
  gap: { fill: '#f4f4f4', stroke: '#879596', dash: '4 3', text: MUTED },
  fact: { fill: '#ffffff', stroke: '#d1d5db', text: MUTED },
};

const LEGEND: { own: Own; wide: string; narrow: string }[] = [
  { own: 'aws', wide: 'AWS runs or ships it', narrow: 'AWS runs or ships it' },
  { own: 'you', wide: 'Your team builds or runs it', narrow: 'Your team runs it' },
  { own: 'gap', wide: 'Not documented in the pages read', narrow: 'Not in pages read' },
  { own: 'fact', wide: 'A fact to check on that path', narrow: 'A fact to check' },
];

const MATRIX_TITLE =
  'Ownership matrix for seven AWS training paths in three cluster shapes: a cluster per job (SageMaker training jobs), ' +
  'a long-lived Slurm cluster (your own Slurm on EC2, AWS PCS, HyperPod Slurm) and a long-lived Kubernetes cluster ' +
  '(self-managed EKS, AWS Batch on EKS, HyperPod EKS). AWS runs node health checks and node replacement on training ' +
  'jobs, both HyperPod paths and self-managed EKS; your team runs them on your own Slurm and on PCS; AWS Batch on EKS ' +
  'documents neither in the pages read. Job restart is AWS-run on training jobs and both HyperPod paths and yours on ' +
  'the other Slurm paths and self-managed EKS. Capacity, cost and status rows hold facts to check.';

function CellShape({
  x,
  y,
  w,
  h,
  cell,
  fontSize,
  lineGap,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  cell: Cell;
  fontSize: number;
  lineGap: number;
}) {
  const s = OWN_STYLE[cell.own];
  const mid = y + h / 2;
  const first = cell.short.length === 1 ? mid + fontSize * 0.36 : mid - lineGap / 2 + fontSize * 0.36;
  return (
    <g className="aws-ownership-cell">
      <rect x={x} y={y} width={w} height={h} rx={4} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} strokeDasharray={s.dash} />
      {cell.short.map((line, i) => (
        <text
          key={line}
          x={x + w / 2}
          y={first + i * lineGap}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={fontSize}
          fill={s.text}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Swatch({ x, y, own, size }: { x: number; y: number; own: Own; size: number }) {
  const s = OWN_STYLE[own];
  return <rect x={x} y={y} width={size} height={size} rx={3} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} strokeDasharray={s.dash} />;
}

function RowLabel({ x, y, h, lines, fontSize, lineGap }: { x: number; y: number; h: number; lines: string[]; fontSize: number; lineGap: number }) {
  const mid = y + h / 2;
  const first = lines.length === 1 ? mid + fontSize * 0.36 : mid - lineGap / 2 + fontSize * 0.36;
  return (
    <>
      {lines.map((line, i) => (
        <text key={line} x={x} y={first + i * lineGap} fontFamily={FONT} fontSize={fontSize} fontWeight={600} fill={INK}>
          {line}
        </text>
      ))}
    </>
  );
}

function WideMatrix() {
  const W = 900;
  const x0 = 152;
  const colW = 103;
  const groupGap = 8;
  const rowTop = 144;
  const rowH = 38;
  const H = rowTop + CONCERNS.length * rowH + 12;

  const colX: number[] = [];
  let x = x0;
  PATHS.forEach((p, i) => {
    if (i > 0 && PATHS[i - 1].shape !== p.shape) x += groupGap;
    colX.push(x);
    x += colW;
  });

  let lx = 14;
  const legend = LEGEND.map((item) => {
    const at = lx;
    lx += 14 + 6 + Math.ceil(item.wide.length * 6.1) + 22;
    return { ...item, x: at };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="aws-ownership-matrix-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <title id="aws-ownership-matrix-title">{MATRIX_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <text x={14} y={24} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
        Who owns each concern, path by path
      </text>
      <text x={14} y={42} fontFamily={FONT} fontSize={11} fill={MUTED}>
        Columns grouped by cluster shape; the colour says who runs that concern on that path
      </text>
      {legend.map((item) => (
        <g key={item.own}>
          <Swatch x={item.x} y={52} own={item.own} size={14} />
          <text x={item.x + 20} y={63} fontFamily={FONT} fontSize={11} fill={INK}>
            {item.wide}
          </text>
        </g>
      ))}

      {SHAPES.map((shape) => {
        const idx = PATHS.map((p, i) => (p.shape === shape.id ? i : -1)).filter((i) => i >= 0);
        const gx = colX[idx[0]] + 2;
        const gw = colX[idx[idx.length - 1]] + colW - 2 - gx;
        return (
          <g key={shape.id}>
            <rect x={gx} y={80} width={gw} height={20} rx={4} fill={SLATE} />
            <text x={gx + gw / 2} y={94} textAnchor="middle" fontFamily={FONT} fontSize={11} fontWeight={600} fill="#ffffff">
              {shape.barLabel}
            </text>
          </g>
        );
      })}

      {PATHS.map((p, i) => (
        <g key={p.id}>
          {p.head.map((line, j) => (
            <text
              key={line}
              x={colX[i] + colW / 2}
              y={(p.head.length === 1 ? 126 : 119) + j * 14}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={11}
              fontWeight={600}
              fill={INK}
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {CONCERNS.map((c, r) => {
        const y = rowTop + r * rowH;
        return (
          <g key={c.id}>
            <RowLabel x={14} y={y} h={rowH} lines={c.lines} fontSize={11} lineGap={14} />
            {PATHS.map((p, i) => (
              <CellShape key={p.id} x={colX[i] + 2} y={y + 2} w={colW - 4} h={rowH - 4} cell={MATRIX[p.id][c.id]} fontSize={11} lineGap={14} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Narrow layout: the three shapes stacked. A one-path shape keeps its row labels on the left; a three-path
 * shape puts each concern's label above its row, so the three cells get the full width and 12px text.
 */
function NarrowMatrix() {
  const W = 400;
  const left = 8;
  const right = 392;
  const parts: ReactNode[] = [];

  parts.push(
    <text key="t" x={10} y={20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
      Who owns what, by cluster shape
    </text>,
    <text key="s" x={10} y={38} fontFamily={FONT} fontSize={11} fill={MUTED}>
      The colour says who runs that concern on that path
    </text>,
  );
  LEGEND.forEach((item, i) => {
    const lx = 10 + (i % 2) * 192;
    const ly = 50 + Math.floor(i / 2) * 20;
    parts.push(
      <g key={`lg-${item.own}`}>
        <Swatch x={lx} y={ly} own={item.own} size={13} />
        <text x={lx + 19} y={ly + 11} fontFamily={FONT} fontSize={11} fill={INK}>
          {item.narrow}
        </text>
      </g>,
    );
  });

  let y = 100;
  SHAPES.forEach((shape) => {
    const paths = PATHS.filter((p) => p.shape === shape.id);
    const single = paths.length === 1;
    parts.push(
      <g key={`g-${shape.id}`}>
        <rect x={left} y={y} width={right - left} height={22} rx={4} fill={SLATE} />
        <text x={W / 2} y={y + 15} textAnchor="middle" fontFamily={FONT} fontSize={12} fontWeight={600} fill="#ffffff">
          {shape.label}
        </text>
      </g>,
    );
    y += 26;

    if (single) {
      const p = paths[0];
      const cx = 150;
      const rowH = 36;
      parts.push(
        <text key={`h-${p.id}`} x={(cx + right) / 2} y={y + 13} textAnchor="middle" fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK}>
          {p.title}
        </text>,
      );
      y += 20;
      CONCERNS.forEach((c) => {
        parts.push(<RowLabel key={`l-${p.id}-${c.id}`} x={10} y={y} h={rowH} lines={c.lines} fontSize={11} lineGap={13} />);
        parts.push(
          <CellShape key={`c-${p.id}-${c.id}`} x={cx + 2} y={y + 2} w={right - cx - 4} h={rowH - 4} cell={MATRIX[p.id][c.id]} fontSize={12} lineGap={13} />,
        );
        y += rowH;
      });
    } else {
      const colW = (right - left) / paths.length;
      paths.forEach((p, i) => {
        p.head.forEach((line, j) => {
          parts.push(
            <text
              key={`h-${p.id}-${j}`}
              x={left + i * colW + colW / 2}
              y={y + (p.head.length === 1 ? 19 : 12 + j * 14)}
              textAnchor="middle"
              fontFamily={FONT}
              fontSize={11}
              fontWeight={600}
              fill={INK}
            >
              {line}
            </text>,
          );
        });
      });
      y += 32;
      CONCERNS.forEach((c) => {
        parts.push(
          <text key={`l-${shape.id}-${c.id}`} x={10} y={y + 11} fontFamily={FONT} fontSize={11} fontWeight={600} fill={INK}>
            {c.label}
          </text>,
        );
        paths.forEach((p, i) => {
          parts.push(
            <CellShape
              key={`c-${p.id}-${c.id}`}
              x={left + i * colW + 2}
              y={y + 16}
              w={colW - 4}
              h={32}
              cell={MATRIX[p.id][c.id]}
              fontSize={12}
              lineGap={13}
            />,
          );
        });
        y += 53;
      });
    }
    y += 14;
  });
  const H = y - 6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="aws-ownership-matrix-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <title id="aws-ownership-matrix-title">{MATRIX_TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      {parts}
    </svg>
  );
}

function OwnershipMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 760);
  return (
    <SpaceBetween size="xs">
      <div ref={ref}>{narrow ? <NarrowMatrix /> : <WideMatrix />}</div>
      <Box variant="small" color="text-body-secondary">
        Compiled from AWS documentation and price lists, not measured. Each cell&apos;s source is in the lists below the
        matrix. A grey dashed cell marks a gap in the pages read for this dive; the feature may still exist.
        The colouring of each cell is our reading of its sources.
      </Box>
    </SpaceBetween>
  );
}

/** Every cell of one shape's paths, with its source. */
function CellList({ shape }: { shape: ShapeId }) {
  return (
    <SpaceBetween size="l">
      {PATHS.filter((p) => p.shape === shape).map((p) => (
        <SpaceBetween size="s" key={p.id}>
          <Box variant="h4">{p.title}</Box>
          <KeyValuePairs
            columns={2}
            minColumnWidth={260}
            items={CONCERNS.map((c) => {
              const cell = MATRIX[p.id][c.id];
              const word = OWN_WORD[cell.own];
              return {
                label: c.label,
                value: (
                  <>
                    {word && <strong>{word} </strong>}
                    {cell.detail}
                  </>
                ),
              };
            })}
          />
        </SpaceBetween>
      ))}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function AwsOwnership() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know which parts of the cluster around the training step AWS runs on each of seven paths, and the three things your training script owns on all of them, starting with a save that finishes before a Capacity Block starts terminating your instances 30 minutes before its end (sources read 2026-10-31)"
          >
            20. Who Owns What on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every AWS path runs the same training step: the same model code and the same collectives (the exchanges every
            training process must join) over EFA (Elastic Fabric Adapter). What changes from path to path is the cluster around the step: who schedules the job onto
            nodes, who checks a node and replaces it when it fails, who restarts the job, and who pays while the cluster
            waits for work. The challenge is to know, before you choose a service, which of those jobs AWS takes on and
            which stay with your team.
          </Box>
          <Box variant="p">
            This section is the map for the AWS half of the dive. It places seven paths in three cluster shapes, sets out
            who owns ten concerns on each, and ends on the three things your training script owns whichever you choose.
            The fabric side of the same managed contracts is the {EFA_SAGEMAKER_LINK}; sections 21 to 28 then take the
            hardware, capacity, storage and each family in turn.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place any AWS training path in one of three shapes, and the shape tells you how the cluster bills and how a job gets its nodes"
          >
            Three shapes of training cluster
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each path is either an AWS product or a way of running open-source schedulers on EC2 (Amazon Elastic Compute
            Cloud) or EKS (Amazon Elastic Kubernetes Service). Grouped by the cluster they leave you with, they fall into
            three shapes.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <SpaceBetween size="xs">
              <Box variant="h4">A cluster per job</Box>
              <Box variant="p">
                SageMaker training jobs. Each job names the instances to deploy for it{' '}
                <Cite tier={1} href={SM_CREATE_JOB}>
                  CreateTrainingJob, ResourceConfig
                </Cite>{' '}
                and runs its code in a Docker image on them{' '}
                <Cite tier={1} href={SM_TRAIN}>
                  SageMaker Developer Guide, train a model
                </Cite>
                . A warm pool exists to keep those instances after the job completes{' '}
                <Cite tier={1} href={SM_WARM}>
                  SageMaker Developer Guide, managed warm pools
                </Cite>
                , so by default they end with the job, our reading.
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="h4">A long-lived Slurm cluster</Box>
              <Box variant="p">
                A standing cluster run by Slurm, the batch scheduler many training teams already know, three ways: your
                own Slurm on EC2, by hand or deployed with AWS ParallelCluster{' '}
                <Cite tier={1} href={PC_WHATIS}>
                  AWS ParallelCluster User Guide
                </Cite>
                ; PCS (AWS Parallel Computing Service), where AWS runs the controller and you bring the AMI (Amazon Machine
                Image) the nodes boot{' '}
                <Cite tier={1} href={PCS_CUSTOM_AMI} accessed={R1}>
                  AWS PCS User Guide, custom AMIs
                </Cite>
                ; and SageMaker HyperPod with Slurm, where AWS provisions controller, login and worker nodes on its own
                HyperPod DLAMI (Deep Learning AMI){' '}
                <Cite tier={1} href={HP_SLURM}>
                  SageMaker Developer Guide, HyperPod with Slurm
                </Cite>
                .
              </Box>
            </SpaceBetween>
            <SpaceBetween size="xs">
              <Box variant="h4">A long-lived Kubernetes cluster</Box>
              <Box variant="p">
                A standing EKS cluster, three ways: self-managed EKS, where you add the training pieces; AWS Batch on EKS,
                which schedules jobs from outside the cluster onto nodes it creates and scales to zero by default when its
                queue is empty{' '}
                <Cite tier={1} href={BATCH_EKS} accessed={R1}>
                  AWS Batch User Guide, EKS compute environments
                </Cite>
                ; and HyperPod with EKS, which keeps your EKS control plane and owns the worker nodes, one EKS cluster per
                HyperPod cluster{' '}
                <Cite tier={1} href={HP_EKS} accessed={R1}>
                  SageMaker Developer Guide, HyperPod with EKS
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ColumnLayout>
          <Box variant="p">
            The shape answers two questions before any service detail. Billing follows the cluster&apos;s life: a cluster
            per job stops billing with the job, and a standing cluster bills for every instance it holds. Admission follows
            the scheduler: Slurm starts a job when all of its nodes are free, and Kubernetes needs a gang scheduler added
            before it can do the same. Both come back below, after the matrix.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See, for each of seven paths, which of ten concerns AWS runs and which stay with your team, with every cell traced to the page that documents it"
          >
            The ownership matrix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read the matrix by row. Each row is a concern a training cluster has to answer, and each column a path,
            grouped by shape. Blue means AWS runs it, or ships it ready to run, on that path; amber means your team builds
            or runs it; a grey dashed cell is one the AWS pages read for this dive do not document. The capacity, cost and
            status rows hold facts to check, in white. The capacity row names Capacity Blocks
            (accelerators reserved for a fixed date window; section 22, Capacity &amp; Cost) and training plans,
            SageMaker&apos;s reservations, each bought for one target such as training jobs or a HyperPod cluster.
          </Box>
          <OwnershipMatrix />
          <Box variant="p">
            Inside each family, AWS takes on more as you move toward HyperPod. Your own Slurm leaves every ownership row to you; PCS
            takes the controller; HyperPod Slurm takes the controller, node health, node replacement and the job restart.
            On Kubernetes, self-managed EKS now repairs GPU nodes itself{' '}
            <Cite tier={1} href={EKS_REPAIR}>
              EKS User Guide, GPU node repair
            </Cite>
            , and HyperPod EKS adds deep health checks, Trainium checks and a training operator that restarts processes{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              HyperPod training operator
            </Cite>
            . The Trainium row stays mostly amber: on every path the Neuron software stack is the team&apos;s to build,
            our reading, and section 27, Trainium: The Neuron Path, starts it.
          </Box>
          <Box variant="p">
            The job restart row never stands alone. Every restart in it, from SageMaker&apos;s repair to HyperPod&apos;s
            auto-resume to Slurm&apos;s requeue, starts the job again from a checkpoint (the saved weights and optimizer
            state; section 18, Checkpointing) that the job itself wrote{' '}
            <Cite tier={1} href={SM_REPAIR}>
              SageMaker cluster repairs
            </Cite>{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm sbatch documentation
            </Cite>
            .
          </Box>
          <Box variant="p">
            The capacity row differs by product, and one clock runs under all of it. EC2 begins terminating the instances
            in a Capacity Block at 11:00 UTC (Coordinated Universal Time) on its final day, 30 minutes before the block
            ends at 11:30{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            , and every path that runs on a block or a training plan inherits that deadline or an earlier one. The last
            block of this section turns it into a rule for the script.
          </Box>
          <ExpandableSection headerText="Cluster per job: every cell for SageMaker training jobs, with its source">
            <CellList shape="job" />
          </ExpandableSection>
          <ExpandableSection headerText="Long-lived Slurm: every cell for your own Slurm, PCS and HyperPod Slurm, with its source">
            <CellList shape="slurm" />
          </ExpandableSection>
          <ExpandableSection headerText="Long-lived Kubernetes: every cell for self-managed EKS, AWS Batch on EKS and HyperPod EKS, with its source">
            <CellList shape="k8s" />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check that your path recovers the job as well as the node, because a replaced node alone leaves training stopped"
          >
            Two recoveries: the node, then the job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A failed GPU stops a synchronous job: every rank (one training process per accelerator) waits at the next
            collective, the exchange every rank must join, for the one that died. Two recoveries are then needed. Node
            recovery finds the bad node and replaces it. Job recovery starts the training processes again and reloads the
            last checkpoint. The paths differ most in which of the two they own.
          </Box>
          <Box variant="p">
            Node recovery is now on most managed paths. HyperPod runs a health-monitoring agent on every node under both
            orchestrators, watching DCGM (NVIDIA Data Center GPU Manager) policy violations, nvidia-smi errors and the GPU
            count{' '}
            <Cite tier={1} href={HP_HMA}>
              SageMaker Developer Guide, HyperPod health monitoring
            </Cite>
            , and its automatic node recovery, the default, reboots or replaces a faulty node{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>{' '}
            <Cite tier={1} href={HP_EKS_RECOVERY} accessed={R1}>
              HyperPod EKS node recovery
            </Cite>
            . Self-managed EKS gets the same pattern from the EKS node monitoring agent, which reads Xid errors (the NVIDIA
            driver&apos;s numbered GPU error reports) from DCGM, and from automatic node repair, which replaces or reboots
            the node; restarting the job is left to you, our reading{' '}
            <Cite tier={1} href={EKS_REPAIR}>
              EKS User Guide, GPU node repair
            </Cite>
            . A SageMaker training job that fails on a GPU gets a GPU health check, then a reboot or a replacement, up to 10
            repair attempts that are not billed{' '}
            <Cite tier={1} href={SM_REPAIR}>
              SageMaker cluster repairs
            </Cite>
            .
          </Box>
          <Box variant="p">
            What still differs is when the checking happens. SageMaker&apos;s repair starts only after the job fails{' '}
            <Cite tier={1} href={SM_REPAIR}>
              SageMaker cluster repairs
            </Cite>
            . HyperPod also screens nodes before they join, or on demand, with deep health checks: stress tests, DCGM
            diagnostics at level 4, typically about 45 to 90 minutes depending on GPU count, and a multi-node NCCL (NVIDIA
            Collective Communications Library) test{' '}
            <Cite tier={1} href={HP_SLURM_DEEP}>
              HyperPod Slurm deep health checks
            </Cite>
            . On HyperPod EKS the deep checks cover Trainium too, with a Neuron hardware check that runs a training
            workload and collective tests on one node and across nodes{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>
            ; the HyperPod Slurm deep checks list GPU instances only. Section 17, Failure Is the Steady State, gives the
            failure rates to weigh that screening time against.
          </Box>
          <Box variant="p">
            Job recovery is narrower, and it always ends at your checkpoint. On HyperPod Slurm, a job step launched with{' '}
            <code>srun --auto-resume=1</code> resumes from the last checkpoint once the faulty nodes are replaced, and jobs
            without it exit and wait for someone to resubmit them{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>
            . On HyperPod EKS the training operator restarts failed processes in place before it restarts the whole job{' '}
            <Cite tier={1} href={HP_OPERATOR}>
              HyperPod training operator
            </Cite>
            . A SageMaker training job restarts from the previous checkpoint after a successful repair. On your own Slurm or
            on PCS, <code>--requeue</code> makes a job eligible to be requeued after a node failure, and the batch script
            then starts again from its beginning{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm sbatch documentation
            </Cite>
            . On self-managed EKS a job controller restarts the pods, and section 25, The Kubernetes Family, picks one.
          </Box>
          <ExpandableSection headerText="What decides whether HyperPod Slurm auto-resume actually resumes">
            <SpaceBetween size="s">
              <Box variant="p">
                Run the job inside an exclusive allocation and put all setup in a single <code>srun</code> command, because
                auto-resume on one <code>srun</code> does not apply to other <code>srun</code> commands in the same
                allocation. Derive the node list from <code>scontrol</code>, because <code>$SLURM_JOB_NODELIST</code> may
                be outdated after a resume. On nodes configured with Slurm generic resources, auto-resume instead requeues a
                faulty job and restarts it from the beginning{' '}
                <Cite tier={1} href={HP_AUTO_RESUME}>
                  SageMaker Developer Guide, HyperPod Slurm auto-resume
                </Cite>
                .
              </Box>
              <Box variant="p">
                The HyperPod Slurm overview ties resuming after replacement to clusters of more than 16 nodes{' '}
                <Cite tier={1} href={HP_SLURM}>
                  SageMaker Developer Guide, HyperPod with Slurm
                </Cite>
                ; the auto-resume page and the Slurm FAQ state no such limit{' '}
                <Cite tier={1} href={HP_FAQ_SLURM}>
                  HyperPod Slurm FAQ
                </Cite>
                . Section 24, The Slurm Family, covers the rest of the auto-resume contract.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Make sure your scheduler starts every rank of a synchronous job together or none of them, because one missing rank stalls the rest"
          >
            All-or-nothing admission
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Synchronous training needs all of its ranks before it can take a step, so a scheduler that starts some of them
            leaves the rest holding accelerators at the first collective, waiting for ranks that are still queued. The
            scheduler has to admit the whole job or none of it, which is called gang scheduling.
          </Box>
          <Box variant="p">
            Slurm does it by construction. A job asks for a node count, and a single number is both the minimum and the
            maximum; the batch script may sit in the queue until its required resources become available, and it runs once
            the allocation is granted{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm sbatch documentation
            </Cite>
            . That holds on all three Slurm paths, whoever runs the controller.
          </Box>
          <Box variant="p">
            Kubernetes needs it added. The default scheduler places pods one at a time, and the EKS guide tells training
            users to add a batch scheduler or queueing system that supports gang scheduling{' '}
            <Cite tier={1} href={EKS_TOPOLOGY} accessed={R1}>
              EKS User Guide, network topology
            </Cite>
            . Kueue, by default, starts no pod until there is quota for all of them, and adds topology-aware placement and
            fair sharing across teams{' '}
            <Cite tier={1} href={KUEUE}>
              Kueue README at v0.20.4
            </Cite>
            . On self-managed EKS you install Kueue or Volcano. AWS Batch on EKS offers multi-node parallel jobs, its name
            for gang scheduling{' '}
            <Cite tier={1} href={BATCH_MNP} accessed={R1}>
              AWS Batch User Guide, multi-node parallel jobs on EKS
            </Cite>
            . HyperPod EKS installs Kueue for you through task governance{' '}
            <Cite tier={1} href={HP_GOVERNANCE} accessed={R1}>
              HyperPod task governance
            </Cite>
            . Before the first multi-node run on Kubernetes, submit a job larger than the free capacity and confirm that
            none of its pods start.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Price idle time before you choose: a cluster per job stops billing with the job, a standing cluster bills for every instance it holds"
          >
            A cluster per job or a cluster per team
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training job bills SageMaker&apos;s training rate for the job&apos;s duration. In us-east-1 that rate is {SM_RATIO}
            times EC2 On-Demand on the four P5 and P6 types read: ${SM_TRAIN_P5} against ${EC2_P5} per p5.48xlarge-hour, on
            the Price List offers still current on 2026-10-31{' '}
            <Cite tier={1} href={SM_PRICE}>
              SageMaker Price List, us-east-1, version 20261029165009
            </Cite>{' '}
            <Cite tier={1} href={EC2_PRICE}>
              EC2 Price List, us-east-1, version 20261029175634
            </Cite>
            . What a cluster per job costs instead is the start: each job cold-starts its cluster with typical startup
            times, and a warm pool keeps the instances for up to 3,600 seconds for the next matching job, billed while kept,
            for at most 28 days of consecutive jobs{' '}
            <Cite tier={1} href={SM_WARM}>
              SageMaker Developer Guide, managed warm pools
            </Cite>
            .
          </Box>
          <Box variant="p">
            A standing cluster bills for what it holds, busy or idle. A HyperPod cluster is billed per instance-hour for as
            long as it exists, plus storage, with EKS, Amazon FSx for Lustre and S3 (Amazon Simple Storage Service) charged
            separately{' '}
            <Cite tier={1} href={SM_PRICING_PAGE} accessed={R1}>
              SageMaker AI pricing
            </Cite>
            , and its cluster rate is {HP_RATIO} times EC2 On-Demand on the same four types in us-east-1, ${HP_CLUSTER_P5}
            per p5.48xlarge-hour{' '}
            <Cite tier={1} href={SM_PRICE}>
              SageMaker Price List, us-east-1
            </Cite>
            . At that rate a 32-instance p5.48xlarge HyperPod cluster costs about {usd(HP_DAY_32)} for every day it
            exists, whether or not a job runs (<code>{HP_CLUSTER_P5} x 32 x 24</code>, our arithmetic). PCS bills its controller by
            the hour, ${PCS_SMALL} for a Small cluster, plus ${PCS_NODE} per P or Trn instance-hour{' '}
            <Cite tier={1} href={PCS_PRICE}>
              AWS PCS Price List, us-east-1
            </Cite>
            ; EKS bills {usd2(EKS_CLUSTER)} per cluster-hour{' '}
            <Cite tier={1} href={EKS_PRICE}>
              Amazon EKS Price List, us-east-1
            </Cite>
            . AWS Batch on EKS scales the nodes it manages down to a minimum, zero by default, when its queue is empty{' '}
            <Cite tier={1} href={BATCH_EKS} accessed={R1}>
              AWS Batch User Guide, EKS compute environments
            </Cite>
            .
          </Box>
          <Box variant="p">
            Which shape costs less depends on how full you keep it, our reading of these rates: a team that keeps a
            HyperPod cluster busy pays {HP_RATIO} times EC2 for its working hours and the same rate for every idle one, while
            a team running occasional jobs pays {SM_RATIO} times only while each job runs, plus a cold start per job. Section 22, Capacity &amp; Cost, prices a run on
            each path, and section 28, Choosing Your Path, turns the comparison into a decision.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Build three things into the training script before the first multi-node run, because none of the seven paths does them for you"
          >
            What your training script owns on every path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Whatever the path, three things stay in the training script. They are what make the restart, reservation and
            hang-detection cells of the matrix work at all.
          </Box>
          <Box variant="p">
            <strong>1. Write checkpoints, and reload the newest one at start-up.</strong> Every restart in the matrix
            resumes from the last checkpoint the job saved: HyperPod auto-resume{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>
            , SageMaker&apos;s restart after a repair{' '}
            <Cite tier={1} href={SM_REPAIR}>
              SageMaker cluster repairs
            </Cite>
            , and managed Spot, which copies checkpoints between a local path and S3{' '}
            <Cite tier={1} href={SM_SPOT}>
              SageMaker managed Spot training
            </Cite>
            . Slurm&apos;s requeue runs the batch script again from its beginning{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm sbatch documentation
            </Cite>
            , so the script itself must find and load the newest checkpoint. Section 18 sizes the interval, and section 19,
            Resuming Correctly, makes the restart continue the same run.
          </Box>
          <Box variant="p">
            <strong>2. Finish a save before the reservation closes.</strong> EC2 begins terminating a Capacity
            Block&apos;s instances at 11:00 UTC on the final day, 30 minutes before the 11:30 end; on a P6e-GB200
            UltraServer block you must terminate the instances at least 60 minutes before its end{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            . A SageMaker training plan starts terminating 30 minutes before its end for training jobs and one hour before
            for a HyperPod cluster{' '}
            <Cite tier={1} href={SM_PLANS}>
              SageMaker Developer Guide, training plans
            </Cite>
            , and a training job on a plan can read <code>SAGEMAKER_CURRENT_CAPACITY_BLOCK_EXPIRATION_TIMESTAMP</code> to
            checkpoint first{' '}
            <Cite tier={1} href={SM_PLAN_JOBS} accessed={R1}>
              SageMaker Developer Guide, training plans for training jobs
            </Cite>
            . On EKS node groups, schedule scale-to-zero more than 30 minutes before the end{' '}
            <Cite tier={1} href={EKS_NODE_GROUPS} accessed={R1}>
              EKS User Guide, node groups
            </Cite>
            ; on PCS the node group&apos;s instances are terminated at expiry, and queued jobs stay pending until another
            node group or a new block is attached{' '}
            <Cite tier={1} href={PCS_CB} accessed={R1}>
              AWS PCS User Guide, Capacity Blocks
            </Cite>
            . Read the end time at start-up and schedule the last save before the earliest edge that applies; section 22
            gives every edge.
          </Box>
          <Box variant="p">
            <strong>3. Log progress every step.</strong> The HyperPod training operator&apos;s hang detection is a
            watchdog on the job&apos;s standard output: each rule matches a regular expression against the log, with a
            maximum gap allowed between matches, AWS&apos;s sample treats five minutes without a new batch line as a hang,
            and the log must go to <code>sys.stdout</code>{' '}
            <Cite tier={1} href={HP_OPERATOR_USAGE} accessed={R1}>
              SageMaker Developer Guide, running jobs with the training operator
            </Cite>
            . A step that prints nothing gives such a watchdog nothing to match. Section 29, What to Measure in a Run,
            lists what each line should carry.
          </Box>
          <Box variant="p">
            Then choose. Read section 21, Training Hardware on AWS, and section 22, Capacity &amp; Cost, for the instance
            and the reservation, then the family whose shape fits your team: section 24, The Slurm Family; section 25, The
            Kubernetes Family; or section 26, SageMaker Training Jobs, with section 27, Trainium: The Neuron Path, for
            Trainium on any of them. Section 28, Choosing Your Path, assembles the decision from this matrix.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
