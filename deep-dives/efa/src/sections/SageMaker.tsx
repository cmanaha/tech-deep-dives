import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Table from '@cloudscape-design/components/table';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * EFA on Amazon SageMaker AI. Three surfaces, three different contracts.
 *
 * Sourcing rule (deep-dives/efa/revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef. 'documented' means AWS states it.
 * 'code-derived' means it was read out of an implementation at a pinned commit.
 * 'doc-code-conflict' means two authorities disagree and both are named.
 */

const ACCESSED = '2026-08-01';
const READ = '2026-08-01';

/** aws/sagemaker-python-sdk master HEAD at the time of reading. */
const SDK_SHA = '9ff3e5fa61b4b57f947957f26cc42964fe437dee';
/** The released SDK tag carrying the SMDDP instance list. */
const SDK_TAG = 'v2.257.0';
/** aws/deep-learning-containers main HEAD at the time of reading. */
const DLC_SHA = '4c921b9ecade7322bebb79224bea6f1c5c3d0591';

const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const SM_API = 'https://docs.aws.amazon.com/sagemaker/latest/APIReference/';
// Do not "fix" this to https://aws.amazon.com/new/. Only the bare index
// redirects there; the dated child paths below are served solely under
// /about-aws/whats-new/ and 404 under /new/. Changing the base on 2026-08-02
// broke five working citations, which the re-verification check caught.
const WHATS_NEW = 'https://aws.amazon.com/about-aws/whats-new/';
const ML_BLOG = 'https://aws.amazon.com/blogs/machine-learning/';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });

/** Pinned code reference builders. Ref is always a SHA or a release tag, never a branch. */
const sdk = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/sagemaker-python-sdk',
  ref: SDK_SHA,
  path,
  lines,
  read: READ,
});
const sdkTagged = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/sagemaker-python-sdk',
  ref: SDK_TAG,
  path,
  lines,
  read: READ,
});
const dlc = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/deep-learning-containers',
  ref: DLC_SHA,
  path,
  lines,
  read: READ,
});

const docs = {
  trainEfa: doc('SageMaker Developer Guide: Run Training with EFA', `${SM_DG}your-algorithms-training-efa.html`, 1),
  distStart: doc(
    'SageMaker Developer Guide: Get started with distributed training',
    `${SM_DG}distributed-training-get-started.html`,
    1
  ),
  capacity: doc(
    'SageMaker Developer Guide: Get compute capacity for SageMaker Training Jobs',
    `${SM_DG}train-get-capacity.html`,
    1
  ),
  encrypt: doc(
    'SageMaker Developer Guide: Protect communications between ML compute instances',
    `${SM_DG}train-encrypt.html`,
    1
  ),
  repair: doc('SageMaker Developer Guide: Cluster repairs for GPU errors', `${SM_DG}model-checkpoints-cluster-repair.html`, 1),
  resourceConfig: doc('SageMaker API Reference: ResourceConfig', `${SM_API}API_ResourceConfig.html`, 1),
  productionVariant: doc('SageMaker API Reference: ProductionVariant', `${SM_API}API_ProductionVariant.html`, 1),
  clusterNic: doc('SageMaker API Reference: ClusterNetworkInterface', `${SM_API}API_ClusterNetworkInterface.html`, 1),
  ddpSupport: doc(
    'SageMaker Developer Guide: SMDDP supported frameworks, Regions and instance types',
    `${SM_DG}distributed-data-parallel-support.html`,
    1
  ),
  ddpIntro: doc('SageMaker Developer Guide: Introduction to the SMDDP library', `${SM_DG}data-parallel-intro.html`, 1),
  ddpFaq: doc('SageMaker Developer Guide: SMDDP FAQ', `${SM_DG}data-parallel-faq.html`, 1),
  ddpRelease: doc('SageMaker Developer Guide: SMDDP release notes', `${SM_DG}data-parallel-release-notes.html`, 1),
  smpRelease: doc(
    'SageMaker Developer Guide: model parallelism library release notes',
    `${SM_DG}model-parallel-release-notes.html`,
    1
  ),
  smpSmddp: doc(
    'SageMaker Developer Guide: SMP v2 compatibility with the SMDDP library',
    `${SM_DG}model-parallel-core-features-v2-smddp-allgather.html`,
    1
  ),
  amiPolicy: doc('SageMaker Developer Guide: HyperPod AMI support policy', `${SM_DG}sagemaker-hyperpod-ami-support-policy.html`, 1),
  amiSlurm: doc('SageMaker Developer Guide: HyperPod AMI releases for Slurm', `${SM_DG}sagemaker-hyperpod-release-ami-slurm.html`, 1),
  amiBase: doc('SageMaker Developer Guide: Amazon SageMaker HyperPod AMI', `${SM_DG}sagemaker-hyperpod-release-ami.html`, 1),
  deepHealth: doc(
    'SageMaker Developer Guide: HyperPod deep health checks',
    `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`,
    1
  ),
  configTips: doc(
    'SageMaker Developer Guide: HyperPod suggested resilience configurations',
    `${SM_DG}sagemaker-hyperpod-eks-resiliency-config-tips.html`,
    1
  ),
  autoResume: doc(
    'SageMaker Developer Guide: HyperPod automatic node recovery and auto-resume',
    `${SM_DG}sagemaker-hyperpod-resiliency-slurm-auto-resume.html`,
    1
  ),
  topology: doc('SageMaker Developer Guide: topology-aware scheduling in HyperPod', `${SM_DG}sagemaker-hyperpod-topology.html`, 1),
  observability: doc('SageMaker Developer Guide: HyperPod cluster metrics', `${SM_DG}hyperpod-observability-cluster-metrics.html`, 1),
  eksPrereq: doc(
    'SageMaker Developer Guide: HyperPod on EKS prerequisites',
    `${SM_DG}sagemaker-hyperpod-eks-prerequisites.html`,
    1
  ),
  hpDeploy: doc('SageMaker Developer Guide: Deploying models on HyperPod', `${SM_DG}sagemaker-hyperpod-model-deployment.html`, 1),
  dpd: doc(
    'SageMaker Developer Guide: Disaggregated Prefill and Decode on HyperPod',
    `${SM_DG}sagemaker-hyperpod-model-deployment-dpd.html`,
    1
  ),
  realtime: doc('SageMaker Developer Guide: Deploy models for real-time inference', `${SM_DG}realtime-endpoints-deploy-models.html`, 1),
  mme: doc(
    'SageMaker Developer Guide: instance recommendations for multi-model endpoints',
    `${SM_DG}multi-model-endpoint-instance.html`,
    1
  ),
  eksEfa: doc('EKS User Guide: manage EFA devices on Amazon EKS', 'https://docs.aws.amazon.com/eks/latest/userguide/device-management-efa.html', 1),
  efaOnlyNews: doc(
    "AWS What's New: HyperPod supports EFA-only network interfaces (June 2026)",
    `${WHATS_NEW}2026/06/amazon-sagemaker-hyperpod-efa-only/`,
    1
  ),
  dpdNews: doc(
    "AWS What's New: HyperPod supports disaggregated prefill and decode (July 2026)",
    `${WHATS_NEW}2026/7/amazon-sagemaker-hyperpod-dpd/`,
    1
  ),
  topoNews: doc(
    "AWS What's New: HyperPod automatic Slurm topology management (April 2026)",
    `${WHATS_NEW}2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/`,
    1
  ),
  flexGroups: doc(
    "AWS What's New: HyperPod flexible instance groups (April 2026)",
    `${WHATS_NEW}2026/04/sagemaker-hyperpod-flexible-instance-groups/`,
    1
  ),
  instFallback: doc(
    "AWS What's New: SageMaker AI capacity-aware inference with automatic instance fallback (April 2026)",
    `${WHATS_NEW}2026/04/amazon-sagemaker-ai-inf-auto-inst/`,
    1
  ),
  llmBest: doc(
    'AWS ML Blog: Training large language models on Amazon SageMaker, best practices',
    `${ML_BLOG}training-large-language-models-on-amazon-sagemaker-best-practices/`,
    2
  ),
  dpdBlog: doc(
    'AWS ML Blog: Disaggregated prefill and decode for LLM inference on SageMaker HyperPod (July 10, 2026)',
    `${ML_BLOG}disaggregated-prefill-and-decode-for-llm-inference-on-sagemaker-hyperpod/`,
    2
  ),
  eksHpBlog: doc(
    'AWS ML Blog: Introducing Amazon EKS support in Amazon SageMaker HyperPod',
    `${ML_BLOG}introducing-amazon-eks-support-in-amazon-sagemaker-hyperpod/`,
    2
  ),
  mathstral: doc(
    "AWS ML Blog: Accelerate pre-training of Mistral's Mathstral model on SageMaker HyperPod",
    `${ML_BLOG}accelerate-pre-training-of-mistrals-mathstral-model-with-highly-resilient-clusters-on-amazon-sagemaker-hyperpod/`,
    2
  ),
  smpPerf: doc(
    'AWS ML Blog: New performance improvements in the SageMaker model parallel library',
    `${ML_BLOG}new-performance-improvements-in-amazon-sagemaker-model-parallel-library/`,
    2
  ),
  scaleFm: doc(
    'AWS ML Blog: Scale foundation model inference to hundreds of models with Amazon SageMaker, Part 1',
    `${ML_BLOG}scale-foundation-model-inference-to-hundreds-of-models-with-amazon-sagemaker-part-1/`,
    2
  ),
  rufus: doc(
    'AWS ML Blog: How Amazon scaled Rufus with multi-node inference on AWS Trainium and vLLM',
    `${ML_BLOG}how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/`,
    2
  ),
};

const DRIVERS = 'sagemaker-train/src/sagemaker/train/container_drivers';

const code = {
  allowlist: sdk(`${DRIVERS}/common/utils.py`, 'L45-L60'),
  torchrun: sdk(`${DRIVERS}/distributed_drivers/torchrun_driver.py`, 'L51-L63'),
  mpi: sdk(`${DRIVERS}/distributed_drivers/mpi_utils.py`, 'L283-L290'),
  smddpTypes: sdkTagged('src/sagemaker/fw_utils.py', 'L85-L91'),
  dlcBase: dlc('docker/base/cu132/Dockerfile', 'L106-L108'),
  dlcPytorch: dlc('.github/config/image/pytorch/2.13-sagemaker-cuda.yml', 'L20-L29'),
  dlcInstall: dlc('scripts/docker/common/install_efa_amzn2023.sh', 'L44-L48'),
  dlcPluginPath: dlc('scripts/docker/common/install_efa_amzn2023.sh', 'L7-L12'),
  dlcNcclConf: dlc('scripts/docker/common/install_efa_amzn2023.sh', 'L59-L60'),
  dlcNgc: dlc('scripts/docker/common/install_efa_amzn2023.sh', 'L37-L45'),
  dlcLdPath: dlc('docker/pytorch/Dockerfile.cuda', 'L287-L289'),
  dlcNcclTests: dlc('docker/pytorch/Dockerfile.cuda', 'L171-L182'),
  dlcCudart: dlc('docker/pytorch/Dockerfile.cuda', 'L161-L164'),
  dlcValidate: dlc('test/efa/scripts/nccl_allreduce.sh', 'L28-L36'),
  dlcRdmaArg: dlc('test/efa/scripts/nccl_allreduce.sh', 'L23-L26'),
  dlcThreshold: dlc('test/efa/scripts/nccl_allreduce.sh', 'L46-L47'),
  dlcEfaTest: dlc('test/efa/test_efa.py', 'L1-L10'),
};

/** Bash snippets carry shell variable syntax, so they are built as plain strings. */
const VALIDATE_SNIPPET = [
  'validate_all_reduce_performance_logs(){',
  '    grep "aws-ofi-nccl" ${TRAINING_LOG} || { echo "aws-ofi-nccl is not working"; exit 1; }',
  '    grep -i "NET/OFI Selected provider is efa" ${TRAINING_LOG} || { echo "EFA provider not selected"; exit 1; }',
  '    grep -E "Using network (AWS )?Libfabric" ${TRAINING_LOG} || { echo "Libfabric not active"; exit 1; }',
  '    if [[ ${INSTANCE_TYPE} == p4d* || ${INSTANCE_TYPE} == p5* ]]; then',
  '        grep "NCCL_TOPO_FILE set by environment to" ${TRAINING_LOG}',
  '        grep -E "NET/(AWS )?Libfabric/0/GDRDMA" ${TRAINING_LOG}',
  '    fi',
  '}',
].join('\n');

const AUTO_RESUME_SNIPPET = [
  'AUTO_RESUME=""',
  'if [ -d "/opt/sagemaker_cluster" ]; then',
  '  echo "Detected Hyperpod cluster.. enabling --auto-resume=1"',
  '  AUTO_RESUME="--auto-resume=1"',
  'fi',
  'srun ${AUTO_RESUME} -l ${TORCHRUN} "${TORCHRUN_ARGS[@]}" $TRAIN_SCRIPT "${TRAINING_ARGS[@]}"',
].join('\n');

const HEALTH_LOG_SNIPPET = [
  '# Instance-level pass, from the deep health check log',
  '2024-08-20T22:26:28Z    info    EFA Loopback check passed for device: rdmap0s29 .',
  'Output summary is MaxBw: 58.590000, AvgBw: 32.420000, MaxTypicalLat: 30.870000,',
  'MinTypicalLat: 20.080000, AvgLat: 21.630000',
  '',
  '# Cluster-level failure, from the same documentation page',
  '{',
  '    "level": "error",',
  '    "ts": "2024-06-18T21:15:22Z",',
  '    "msg": "Encountered FaultyInstance. Replace the Instance. Region: us-west-2,',
  '            InstanceType: p4d.24xlarge. ERROR:Bandwidth has less than threshold:',
  '            Expected minimum threshold :80,NCCL Test output Bw: 30"',
  '}',
].join('\n');

const preStyle: React.CSSProperties = { margin: 0, whiteSpace: 'pre', overflowX: 'auto' };

/**
 * Diagram 1. The three SageMaker surfaces compared on the same four questions.
 * The inference lane is one band because the documented control surface there
 * stops before any of the four questions is answered.
 */
function ThreeContractsDiagram() {
  const stages = [
    ['Who provisions', 'the EFA interface'],
    ['Who installs libfabric', 'and aws-ofi-nccl'],
    ['Who sets', 'FI_PROVIDER=efa'],
    ['Who verifies', 'the fabric'],
  ];

  const lanes = [
    {
      title: 'Training jobs',
      sub: 'CreateTrainingJob',
      cells: [
        ['SageMaker, implicit by the', 'instance type. The API has', 'no EFA field at all.'],
        ['The AWS Deep Learning', 'Container, or you, if you', 'bring your own image.'],
        ['The SDK container driver,', 'gated by a hardcoded', 'instance-type allowlist.'],
        ['A pre-job NCCL check on P', 'and G types. Whether it', 'reaches EFA is unstated.'],
      ],
      amber: [false, false, true, false],
    },
    {
      title: 'HyperPod',
      sub: 'CreateCluster',
      cells: [
        ['You, via Cluster-', 'NetworkInterface:', 'efa or efa-only.'],
        ['The HyperPod AMI. EFA is', 'a versioned component of', 'the support policy.'],
        ['Your job script. Slurm', 'sbatch, or the operator', 'on the EKS side.'],
        ['Deep health checks: EFA', 'latency and bandwidth,', 'then a cluster NCCL test.'],
      ],
      amber: [false, false, false, false],
    },
  ];

  const colX = [180, 375, 570, 765];

  return (
    <svg viewBox="0 0 960 400" role="img" aria-labelledby="sm-contracts-title" style={{ width: '100%', height: 'auto' }}>
      <title id="sm-contracts-title">
        Training jobs and HyperPod answer all four EFA ownership questions, with different owners at
        every stage. Managed real-time inference endpoints expose instance type, image version,
        capacity, routing and scale, and no EFA control appears within that surface.
      </title>
      <style>
        {`
          .tc-hd { fill: #0f1b2a; font: 600 11px sans-serif; text-anchor: middle; }
          .tc-lane { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tc-lt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .tc-ls { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .tc-cell { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .tc-amber { fill: #fff7e6; stroke: #8d6605; stroke-width: 1.5; }
          .tc-empty { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .tc-txt { fill: #0f1b2a; font: 10px sans-serif; }
          .tc-flag { fill: #8d6605; font: 600 9px sans-serif; }
          .tc-none { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .tc-nsub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .tc-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="960" height="400" rx="8" fill="#ffffff" />

      {stages.map((stage, i) => (
        <g key={stage[0]}>
          <text className="tc-hd" x={colX[i] + 90} y="28">
            {stage[0]}
          </text>
          <text className="tc-hd" x={colX[i] + 90} y="44">
            {stage[1]}
          </text>
        </g>
      ))}

      {lanes.map((lane, laneIndex) => {
        const y = 60 + laneIndex * 112;
        return (
          <g key={lane.title}>
            <rect className="tc-lane" x="20" y={y} width="150" height="100" rx="6" />
            <text className="tc-lt" x="95" y={y + 46}>
              {lane.title}
            </text>
            <text className="tc-ls" x="95" y={y + 64}>
              {lane.sub}
            </text>

            {lane.cells.map((cell, cellIndex) => (
              <g key={cell[0]}>
                <rect
                  className={lane.amber[cellIndex] ? 'tc-amber' : 'tc-cell'}
                  x={colX[cellIndex]}
                  y={y}
                  width="180"
                  height="100"
                  rx="6"
                />
                {cell.map((line, lineIndex) => (
                  <text className="tc-txt" key={line} x={colX[cellIndex] + 12} y={y + 26 + lineIndex * 15}>
                    {line}
                  </text>
                ))}
                {lane.amber[cellIndex] && (
                  <text className="tc-flag" x={colX[cellIndex] + 12} y={y + 88}>
                    silent failure surface
                  </text>
                )}
              </g>
            ))}
          </g>
        );
      })}

      <rect className="tc-lane" x="20" y="284" width="150" height="76" rx="6" />
      <text className="tc-lt" x="95" y="316">
        Managed
      </text>
      <text className="tc-lt" x="95" y="332">
        endpoints
      </text>
      <text className="tc-ls" x="95" y="350">
        CreateEndpointConfig
      </text>

      <rect className="tc-empty" x="180" y="284" width="765" height="76" rx="6" />
      <text className="tc-none" x="562" y="316">
        Control surface: instance type, image version, capacity, routing and scale
      </text>
      <text className="tc-nsub" x="562" y="340">
        ProductionVariant has no EFA field, and InferenceAmiVersion names driver, CUDA and toolkit versions only.
      </text>

      <text className="tc-cap" x="480" y="384">
        The third lane is empty because AWS publishes no control there, not because AWS states that EFA is unsupported.
      </text>
    </svg>
  );
}

/**
 * Diagram 2. The four gates a training job passes before NCCL rides EFA.
 * Gate 4 carries the literal grep strings so the diagram doubles as a runbook.
 */
function FourGatesDiagram() {
  const gates = [
    {
      x: 40,
      w: 500,
      title: 'Gate 1. Instance type',
      lines: [
        'ResourceConfig accepts p3dn, p4d, p4de, p5, p5e, p5en, p6-b200,',
        'p6-b300, p6e-gb200, trn1, trn1n, trn2, g5, g6, g6e, g7e, c5n.18xlarge.',
        'There is no EFA parameter anywhere on CreateTrainingJob.',
      ],
      note: 'Falls out here:',
      noteLines: ['An instance type with no EFA device.', 'Nothing downstream can recover it.'],
      amber: false,
    },
    {
      x: 60,
      w: 460,
      title: 'Gate 2. Container',
      lines: [
        'The image must carry libfabric, aws-ofi-nccl and a matching NCCL.',
        'The DLC installs EFA with --skip-kmod, so the host owns the',
        'kernel module. Container NCCL must match the PyTorch build.',
      ],
      note: 'Falls out here:',
      noteLines: ['A bring-your-own container with no', 'libfabric, or a NCCL version that', 'disagrees with PyTorch.'],
      amber: false,
    },
    {
      x: 80,
      w: 420,
      title: 'Gate 3. Environment variables',
      lines: [
        'SM_EFA_NCCL_INSTANCES sets FI_PROVIDER=efa, NCCL_PROTO=simple.',
        'SM_EFA_RDMA_INSTANCES sets FI_EFA_USE_DEVICE_RDMA=1 and',
        'RDMAV_FORK_SAFE=1. Both are hardcoded lists, not queries.',
      ],
      note: 'Silently skipped for:',
      noteLines: ['P5e, P5en, P6-B200, P6-B300,', 'P6e-GB200, Trn2, G6e and G7e.', 'P5 misses the RDMA list only.'],
      amber: true,
    },
    {
      x: 100,
      w: 380,
      title: 'Gate 4. Runtime proof',
      lines: [
        'grep the job log for: aws-ofi-nccl',
        'NET/OFI Selected provider is efa',
        'Using network Libfabric   NET/Libfabric/0/GDRDMA',
      ],
      note: 'The only gate with evidence:',
      noteLines: ['Gate 3 produces no error when it', 'skips your instance type. This is', 'where you find out.'],
      amber: false,
    },
  ];

  return (
    <svg viewBox="0 0 960 520" role="img" aria-labelledby="sm-gates-title" style={{ width: '100%', height: 'auto' }}>
      <title id="sm-gates-title">
        A SageMaker training job runs NCCL over EFA after passing four gates: an EFA-capable instance
        type, a container carrying libfabric and aws-ofi-nccl, an SDK allowlist entry that sets the
        EFA environment variables, and a runtime log that names the EFA provider. The third gate
        skips several current instance types without raising an error, so the fourth gate is the only
        one that produces evidence.
      </title>
      <style>
        {`
          .fg-box { fill: #ffffff; stroke: #0972d3; stroke-width: 1.8; }
          .fg-amber { fill: #fff7e6; stroke: #8d6605; stroke-width: 1.8; }
          .fg-t { fill: #0f1b2a; font: 600 13px sans-serif; }
          .fg-l { fill: #0f1b2a; font: 11px sans-serif; }
          .fg-nt { fill: #5f6b7a; font: 600 10px sans-serif; }
          .fg-nl { fill: #5f6b7a; font: 10px sans-serif; }
          .fg-ntw { fill: #8d6605; font: 600 10px sans-serif; }
          .fg-nlw { fill: #8d6605; font: 10px sans-serif; }
          .fg-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#fg-head); }
          .fg-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="fg-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="960" height="520" rx="8" fill="#ffffff" />

      {gates.map((gate, index) => {
        const y = 60 + index * 110;
        return (
          <g key={gate.title}>
            <rect className={gate.amber ? 'fg-amber' : 'fg-box'} x={gate.x} y={y} width={gate.w} height="90" rx="6" />
            <text className="fg-t" x={gate.x + 16} y={y + 24}>
              {gate.title}
            </text>
            {gate.lines.map((line, lineIndex) => (
              <text className="fg-l" key={line} x={gate.x + 16} y={y + 44 + lineIndex * 16}>
                {line}
              </text>
            ))}

            <text className={gate.amber ? 'fg-ntw' : 'fg-nt'} x="580" y={y + 24}>
              {gate.note}
            </text>
            {gate.noteLines.map((line, lineIndex) => (
              <text className={gate.amber ? 'fg-nlw' : 'fg-nl'} key={line} x="580" y={y + 42 + lineIndex * 15}>
                {line}
              </text>
            ))}

            {index < gates.length - 1 && <path className="fg-arr" d={`M290,${y + 90} L290,${y + 108}`} />}
          </g>
        );
      })}

      <text className="fg-cap" x="480" y="504">
        Gates 1 and 2 fail loudly. Gate 3 fails quietly. That is why gate 4 is the only one worth trusting.
      </text>
    </svg>
  );
}

/** Diagram 3. The four-layer KV cache transport HyperPod composes for DPD. */
function DpdStackDiagram() {
  const bands = [
    ['LMCache PD', 'splits prefill from decode'],
    ['NIXL', 'unified memory abstraction, picks the RDMA operation'],
    ['libfabric', 'EFA provider, kernel bypass'],
    ['EFA', 'GPUDirect RDMA on the wire'],
  ];

  return (
    <svg viewBox="0 0 960 340" role="img" aria-labelledby="sm-dpd-title" style={{ width: '100%', height: 'auto' }}>
      <title id="sm-dpd-title">
        HyperPod disaggregated prefill and decode moves the key-value cache from a prefiller pod to a
        decoder pod on a different instance through four stacked layers, LMCache PD then NIXL then
        libfabric then EFA, which is the only documented SageMaker path where EFA carries inference
        traffic.
      </title>
      <style>
        {`
          .dp-node { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.8; }
          .dp-router { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .dp-band { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .dp-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .dp-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dp-bn { fill: #0f1b2a; font: 600 12px sans-serif; }
          .dp-bd { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .dp-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#dp-head); }
          .dp-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="dp-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="960" height="340" rx="8" fill="#ffffff" />

      <rect className="dp-router" x="310" y="14" width="340" height="44" rx="6" />
      <text className="dp-t" x="480" y="34">
        DPD router
      </text>
      <text className="dp-s" x="480" y="50">
        prefixaware, kvaware, session or roundrobin
      </text>
      <path className="dp-arr" d="M400,58 L200,88" />
      <path className="dp-arr" d="M560,58 L760,88" />

      <rect className="dp-node" x="30" y="92" width="230" height="190" rx="6" />
      <text className="dp-t" x="145" y="120">
        Prefiller pod
      </text>
      <text className="dp-s" x="145" y="144">
        ml.p5.48xlarge
      </text>
      <text className="dp-s" x="145" y="164">
        vLLM 0.19.0, LMCache 0.4.3
      </text>
      <text className="dp-s" x="145" y="184">
        NIXL 1.0.0, EFA libfabric
      </text>
      <text className="dp-s" x="145" y="212">
        Builds the KV cache
      </text>

      <rect className="dp-node" x="700" y="92" width="230" height="190" rx="6" />
      <text className="dp-t" x="815" y="120">
        Decoder pod
      </text>
      <text className="dp-s" x="815" y="144">
        separate instance
      </text>
      <text className="dp-s" x="815" y="164">
        same Availability Zone
      </text>
      <text className="dp-s" x="815" y="184">
        same worker image
      </text>
      <text className="dp-s" x="815" y="212">
        Generates the tokens
      </text>

      {bands.map(([name, desc], index) => {
        const y = 110 + index * 42;
        return (
          <g key={name}>
            <rect className="dp-band" x="285" y={y} width="390" height="34" rx="5" />
            <text className="dp-bn" x="299" y={y + 22}>
              {name}
            </text>
            <text className="dp-bd" x="661" y={y + 22}>
              {desc}
            </text>
          </g>
        );
      })}

      <text className="dp-cap" x="480" y="302">
        Five supported instance types, all EFA-capable with GPUDirect RDMA. Same Availability Zone required.
      </text>
      <text className="dp-cap" x="480" y="322">
        AWS reports an 8,000-token transfer for Llama 3.3 70B in single-digit milliseconds on ml.p5.48xlarge.
      </text>
    </svg>
  );
}

interface AllowRow {
  type: string;
  nccl: string;
  rdma: string;
}

/** Types the training API accepts, against what the SDK driver actually sets. */
const allowRows: AllowRow[] = [
  { type: 'ml.p4d.24xlarge', nccl: 'yes', rdma: 'yes' },
  { type: 'ml.p4de.24xlarge', nccl: 'yes', rdma: 'yes' },
  { type: 'ml.p5.48xlarge', nccl: 'yes', rdma: 'no' },
  { type: 'ml.p5e.48xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.p5en.48xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.p6-b200.48xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.p6-b300.48xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.p6e-gb200.36xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.trn1.32xlarge', nccl: 'yes', rdma: 'yes' },
  { type: 'ml.trn2.48xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.g6e.48xlarge', nccl: 'no', rdma: 'no' },
  { type: 'ml.g7e.48xlarge', nccl: 'no', rdma: 'no' },
];

const yesNo = (value: string) =>
  value === 'yes' ? (
    <StatusIndicator type="success">yes</StatusIndicator>
  ) : (
    <StatusIndicator type="warning">no</StatusIndicator>
  );

interface DecisionRow {
  dimension: string;
  trainingJob: string;
  hyperpod: string;
}

const decisionRows: DecisionRow[] = [
  {
    dimension: 'Who owns the EFA stack',
    trainingJob: 'AWS, if you use a Deep Learning Container. You, if you bring your own image.',
    hyperpod: 'The HyperPod AMI, as a versioned component under a published support policy.',
  },
  {
    dimension: 'Turning EFA on',
    trainingJob: 'Nothing to set. It follows from the instance type, then from an SDK allowlist.',
    hyperpod: 'An explicit choice: ClusterNetworkInterface set to efa or efa-only.',
  },
  {
    dimension: 'Fabric observability',
    trainingJob: 'CloudWatch job logs. Grep for the NCCL provider lines yourself.',
    hyperpod: 'Cluster metrics include an EFA Exporter category, off by default.',
  },
  {
    dimension: 'Topology control',
    trainingJob: 'InstancePlacementConfig applies only to UltraServer capacity.',
    hyperpod: 'Automatic Slurm topology plugin selection, plus sbatch switch and segment controls.',
  },
  {
    dimension: 'Failure handling',
    trainingJob: 'Cluster repair, up to 10 attempts, restarting from your last checkpoint.',
    hyperpod: 'Automatic node recovery plus job auto-resume. Slurm 25.11 has a published defect here.',
  },
  {
    dimension: 'Reuse for inference',
    trainingJob: "The job's cluster ends with the job.",
    hyperpod: 'The EKS orchestrator runs the Inference Operator, including EFA-backed DPD.',
  },
  {
    dimension: 'Cost shape',
    trainingJob: 'Per job. The cluster exists only while the job runs.',
    hyperpod: 'A standing cluster. New nodes spend roughly two hours in deep health checks.',
  },
];

export function SageMaker() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Three surfaces, three contracts. Which one you are on decides who owns the fabric, who turns it on, and how you find out whether it worked."
          >
            EFA on SageMaker AI and HyperPod
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            People say SageMaker AI handles EFA (Elastic Fabric Adapter) for you. Treat SageMaker AI
            as three products and that resolves into three different answers. Training jobs get EFA
            implicitly from the instance type, through a software layer gated by a hardcoded
            allowlist that stopped growing at P5. HyperPod treats EFA as a managed, versioned,
            health-checked component you configure by name. Managed real-time inference endpoints
            expose instance type, image version, capacity, routing and scale, and no EFA control
            appears within that surface{' '}
            <SourceRef provenance="documented" doc={docs.productionVariant} />.
          </Box>

          <ThreeContractsDiagram />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The four gates a job passes before the fabric carries traffic, and the one gate that leaves evidence."
          >
            Training jobs: EFA follows from the instance type
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A training job is one API call: you name an instance type and a count, SageMaker AI
            builds the cluster, runs your container and tears it down. Whether NCCL (NVIDIA
            Collective Communications Library) rides EFA on that cluster depends on four things
            lining up, and CreateTrainingJob asks you about exactly one of them.
          </Box>

          <Box variant="h3">What ResourceConfig controls</Box>
          <Box variant="p">
            ResourceConfig is the compute block of CreateTrainingJob. Its members cover instance
            count, instance groups, instance placement, instance type, keep-alive period, training
            plan and volume settings{' '}
            <SourceRef provenance="documented" doc={docs.resourceConfig} />. The instance type is the
            whole fabric request: there is no EFA field and no fabric field anywhere on the API. The
            placement member, InstancePlacementConfig, configures allocation within UltraServers and
            AWS states that it is only applicable for UltraServer capacity{' '}
            <SourceRef provenance="documented" doc={docs.resourceConfig} />.
          </Box>

          <Alert type="info" header="One job lands in one subnet, therefore one Availability Zone">
            SageMaker AI launches all instances for a given job within a single subnet, which is a
            single Availability Zone, to keep them physically close and minimize inter-node latency.
            Additional subnets broaden the options SageMaker can choose from rather than spreading
            one job across Availability Zones{' '}
            <SourceRef provenance="documented" doc={docs.capacity} />. Single subnet, therefore
            single Availability Zone, which is exactly the boundary EFA traffic cannot cross. No AWS
            source found states that training jobs use EC2 cluster placement groups, so plan on the
            subnet rule alone.
          </Alert>

          <Box variant="h3">The four gates</Box>
          <FourGatesDiagram />

          <Box variant="p">
            Gate 2 is the one AWS documents at length, written for a container you bring. That
            container must download and install the EFA software, with MPI (Message Passing
            Interface) and NCCL installed and managed inside it. The EFA device is mounted as
            /dev/infiniband/uverbs0, and on P4d instances the container has four of them, uverbs0
            through uverbs3. And the NCCL version of your container should match the NCCL version of
            your PyTorch installation, which you check with torch.cuda.nccl.version(){' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />.
          </Box>

          <Alert type="info" header="Take the structure of the documented Dockerfile and the versions from somewhere else">
            The example Dockerfile on that page still pins NCCL 2.7.8, EFA installer 1.30.0 and
            aws-ofi-nccl 1.1.1{' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />, which are roughly 2023 pins.
            The Deep Learning Container configuration in the next section carries current ones.
          </Alert>

          <Box variant="h3">Gate 3: the SDK allowlist that decides who gets the EFA variables</Box>
          <Box variant="p">
            The SageMaker Python SDK ships container-side driver scripts that set the EFA
            environment variables at job start. They compare the instance type against two hardcoded
            lists rather than querying the instance for an EFA device.
          </Box>

          <Box variant="code">
            <pre style={preStyle}>{String.raw`SM_EFA_NCCL_INSTANCES = [
    "ml.g4dn.8xlarge",
    "ml.g4dn.12xlarge",
    "ml.g5.48xlarge",
    "ml.p3dn.24xlarge",
    "ml.p4d.24xlarge",
    "ml.p4de.24xlarge",
    "ml.p5.48xlarge",
    "ml.trn1.32xlarge",
]

SM_EFA_RDMA_INSTANCES = [
    "ml.p4d.24xlarge",
    "ml.p4de.24xlarge",
    "ml.trn1.32xlarge",
]`}</pre>
          </Box>
          <Box variant="p">
            Read at the pinned commit{' '}
            <SourceRef provenance="code-derived" code={code.allowlist} />. The torchrun driver
            consumes both lists directly: it sets FI_PROVIDER to efa when the type is in the first
            list, sets FI_EFA_USE_DEVICE_RDMA and RDMAV_FORK_SAFE when the type is in the second, and
            always sets NCCL_SOCKET_IFNAME and NCCL_PROTO{' '}
            <SourceRef provenance="code-derived" code={code.torchrun} />. The mpirun path builds the
            same settings as -x flags{' '}
            <SourceRef provenance="code-derived" code={code.mpi} />.
          </Box>

          <Table
            variant="embedded"
            header={
              <Header
                variant="h3"
                description="ResourceConfig accepts every type below. These two columns are what the SDK driver sets at launch."
              >
                Allowlist coverage by instance type
              </Header>
            }
            columnDefinitions={[
              { id: 'type', header: 'Instance type', cell: (item) => <Box variant="code">{item.type}</Box> },
              { id: 'nccl', header: 'In SM_EFA_NCCL_INSTANCES', cell: (item) => yesNo(item.nccl) },
              { id: 'rdma', header: 'In SM_EFA_RDMA_INSTANCES', cell: (item) => yesNo(item.rdma) },
            ]}
            items={allowRows}
          />

          <Alert type="info" header="What the allowlist gap establishes">
            On ml.p5e.48xlarge, ml.p5en.48xlarge, ml.p6-b200.48xlarge, ml.p6-b300.48xlarge,
            ml.p6e-gb200.36xlarge, ml.trn2.48xlarge, ml.g6e and ml.g7e types, the SDK driver leaves
            the settings AWS itself recommends unset{' '}
            <SourceRef provenance="code-derived" code={code.allowlist} />. libfabric still selects a
            provider on its own, and normally picks efa when the device and aws-ofi-nccl are both
            present, so whether those jobs fall back to TCP is an open question. Settle it from the
            job log rather than from the launcher.
          </Alert>

          <ExpandableSection
            headerText="On P5, two AWS-owned repositories disagree about FI_EFA_USE_DEVICE_RDMA"
            headerDescription="Read the code for the path you are on, and set the variable yourself if you need it"
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                The SageMaker Python SDK lists ml.p4d.24xlarge, ml.p4de.24xlarge and
                ml.trn1.32xlarge in SM_EFA_RDMA_INSTANCES, so a P5 training job launched through the
                SDK drivers gets neither FI_EFA_USE_DEVICE_RDMA=1 nor RDMAV_FORK_SAFE=1{' '}
                <SourceRef provenance="code-derived" code={code.allowlist} />.
              </Box>
              <Box variant="p">
                The Deep Learning Containers repository, in its own EFA test, sets
                FI_EFA_USE_DEVICE_RDMA=1 for p4d.24xlarge, p4de.24xlarge and p5.48xlarge{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.dlcRdmaArg}
                  conflict="aws/sagemaker-python-sdk omits ml.p5.48xlarge from SM_EFA_RDMA_INSTANCES at the same read date."
                  label="repo vs repo"
                />
                . Both were read on the same day, at pinned commits, in repositories AWS owns, and
                which behaviour is intended is unknown. The code on your path governs: an
                SDK-launched P5 job gets what the SDK sets, so set FI_EFA_USE_DEVICE_RDMA yourself if
                you want it.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="The five environment variables AWS recommends, and the three the SDK sets"
            headerDescription="A documented contradiction between an AWS blog and AWS code"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The AWS best-practices blog for training large language models lists five settings
                for your own container: FI_PROVIDER set to efa, NCCL_PROTO=simple, because the EFA
                provider does not support low-latency protocols and enabling them could lead to data
                corruption, FI_EFA_USE_DEVICE_RDMA=1, NCCL_LAUNCH_MODE set to PARALLEL, and
                NCCL_NET_SHARED_COMMS set to 0. The same post states plainly that in their
                experience, using EFA is a requirement to get satisfactory multi-node LLM training
                performance{' '}
                <SourceRef provenance="documented" doc={docs.llmBest} />. The SDK driver sets
                FI_PROVIDER, FI_EFA_USE_DEVICE_RDMA, RDMAV_FORK_SAFE, NCCL_SOCKET_IFNAME and
                NCCL_PROTO, and leaves NCCL_LAUNCH_MODE and NCCL_NET_SHARED_COMMS to you{' '}
                <SourceRef provenance="code-derived" code={code.torchrun} />. Pass those two yourself
                for the blog's full set, and treat NCCL_PROTO=simple as mandatory: the stated reason
                is data corruption.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Resiliency around a training job, and how far it reaches"
            headerDescription="AWS documents the repair limit, the billing and the checkpoint restart, and the sources stop at the fabric."
          >
            <SpaceBetween size="s">
              <Box variant="p">
                AWS states that SageMaker AI will attempt to repair the cluster up to 10 times, that
                a successful repair automatically restarts the training job from the previous
                checkpoint, that you are not billed for the cluster repair process, and that repairs
                do not initiate unless your training job fails{' '}
                <SourceRef provenance="documented" doc={docs.repair} />. Before a job starts, AWS
                describes GPU health checks that verify NCCL communication on GPU instances and
                replace faulty instances, enabled for P and G GPU-based instance types{' '}
                <SourceRef provenance="documented" doc={docs.llmBest} />. No source found states
                whether that pre-flight check exercises the EFA path specifically, or whether it
                would pass over TCP. Do not assume either way.
              </Box>
              <Box variant="p">
                One setting interacts with all of this and has no published answer. Enabling
                inter-container traffic encryption can increase training time, especially with
                distributed deep learning algorithms, and for affected algorithms it also increases
                cost{' '}
                <SourceRef provenance="documented" doc={docs.encrypt} />. What it does to EFA traffic
                specifically, whether it tunnels it, excludes it, or conflicts with it, is not
                addressed by any AWS source found.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Current versions to pin against, and the three install-script behaviours your own image has to match."
          >
            What the Deep Learning Containers ship
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A ModelTrainer object pulls one of the pre-built AWS deep learning containers,
            prepackaged with deep learning frameworks, distributed training frameworks and the EFA
            driver{' '}
            <SourceRef provenance="documented" doc={docs.distStart} />. Here is what they contain.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The base image</Box>
              <Box variant="p">
                The CUDA 13.2 base pins NCCL 2.29.7-1, EFA installer 1.49.0 and GDRCopy 2.6, and
                carries the single most useful comment in the repository: EFA installer 1.49.0 vends
                libfabric 2.4.0amzn5.0 and aws-ofi-nccl 1.20.0{' '}
                <SourceRef provenance="code-derived" code={code.dlcBase} />. No documentation page
                maps an installer version to its components.
              </Box>
            </div>
            <div>
              <Box variant="h3">The PyTorch 2.13 SageMaker image</Box>
              <Box variant="p">
                CUDA 13.3.0, torch 2.13.0, NCCL 2.30.7-1, EFA installer 1.49.0, GDRCopy 2.6,
                DeepSpeed 0.19.2, Transformer Engine 2.17.0{' '}
                <SourceRef provenance="code-derived" code={code.dlcPytorch} />. The EC2 variant of
                the same image carries identical NCCL, EFA and GDRCopy pins.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Three install-script behaviours to match if you build your own image">
            <SpaceBetween size="xs">
              <Box variant="p">
                <strong>1. The host owns the kernel module.</strong> The script runs the installer
                with --skip-kmod, --skip-limit-conf and --no-verify{' '}
                <SourceRef provenance="code-derived" code={code.dlcInstall} />. That makes the
                image portable and couples it to the host: an EFA container on a host without the EFA
                kernel driver has a userspace stack and no device.
              </Box>
              <Box variant="p">
                <strong>2. Resolve the plugin path at runtime, not at build time.</strong> The script
                branches on the version: at EFA installer 1.44.0 and later the plugin lives at
                /opt/amazon/ofi-nccl/lib64/libnccl-net-ofi.so, and before that at
                /opt/amazon/ofi-nccl/lib/ARCH-linux-gnu/libnccl-net.so{' '}
                <SourceRef provenance="code-derived" code={code.dlcPluginPath} />. Both the directory
                and the file name moved, so anything with a hardcoded plugin path breaks on upgrade.
              </Box>
              <Box variant="p">
                <strong>3. Pass --disable-ngc on an NGC-derived base.</strong> The script gates the
                flag on EFA installer 1.48.0 and later, and its own comment gives the reason: EFA
                1.48+ auto-detects NGC containers through /opt/nvidia/nvidia_entrypoint.sh, present
                in the nvidia/cuda amzn2023 base images, and then skips the AL2023 libnccl-ofi
                package{' '}
                <SourceRef provenance="code-derived" code={code.dlcNgc} />. Without the flag you get
                an EFA install with no NCCL plugin.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="What else the image sets up: NCCL defaults, search paths and a bundled benchmark"
            headerDescription="Which settings are already applied before your job runs"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The install script writes container-wide NCCL defaults into /etc/nccl.conf:
                NCCL_DEBUG=INFO and NCCL_SOCKET_IFNAME excluding docker0 and lo{' '}
                <SourceRef provenance="code-derived" code={code.dlcNcclConf} />. FI_PROVIDER comes
                from the launcher instead, at job start, which is why the container layer and the
                launcher layer can disagree with each other. The runtime search path puts the EFA
                stack first on LD_LIBRARY_PATH{' '}
                <SourceRef provenance="code-derived" code={code.dlcLdPath} />, and the image builds
                all_reduce_perf from NVIDIA nccl-tests into /usr/local/bin, described in the
                Dockerfile as used by CI EFA tests and available to customers for verifying EFA and
                NCCL connectivity before training{' '}
                <SourceRef provenance="code-derived" code={code.dlcNcclTests} />. The benchmark is
                already in the image, which is what the next section verifies with.
              </Box>
              <Box variant="p">
                One repair the Dockerfile performs is worth copying. The CUDA runtime base ships a
                versioned libcudart but not the unversioned symlink, and the NCCL OFI plugin opens
                libcudart.so by name and fails without it, so the Dockerfile creates the link
                explicitly{' '}
                <SourceRef provenance="code-derived" code={code.dlcCudart} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two checks that settle it, built from the four log lines AWS greps for in its own EFA test."
          >
            Verifying EFA is genuinely in use
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">Step 1: is the device visible in the container</Box>
          <Box variant="p">
            AWS documents the check{' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />. Expected output includes
            provider efa, domain efa_0-rdm, endpoint type FI_EP_RDM and protocol FI_PROTO_EFA.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{String.raw`/opt/amazon/efa/bin/fi_info -p efa`}</pre>
          </Box>

          <Box variant="h3">Step 2: does the NCCL log say the transport is EFA</Box>
          <Box variant="p">
            AWS wrote this check. The Deep Learning Containers repository gates its own EFA test on
            four log signatures, plus two more on P4d and P5{' '}
            <SourceRef provenance="code-derived" code={code.dlcValidate} />.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{VALIDATE_SNIPPET}</pre>
          </Box>
          <Box variant="p">
            Run those same greps against your CloudWatch job log. The GDRDMA line is the GPUDirect
            RDMA (Remote Direct Memory Access) confirmation, and the AWS script only checks it on P4d
            and P5. The first three signatures without the fourth mean EFA is carrying traffic
            through host memory.
          </Box>

          <Alert type="info" header="Three GB/s is the number below which AWS fails its own build">
            The same script asserts that in-place algorithm bandwidth at the 1 GiB message size is at
            least 3 GB/s across two nodes{' '}
            <SourceRef provenance="code-derived" code={code.dlcThreshold} />. That test runs on two
            p4d.24xlarge instances and verifies that EFA transport is used rather than sockets{' '}
            <SourceRef provenance="code-derived" code={code.dlcEfaTest} />. It is a CI floor. Size
            a cluster against your own measurement.
          </Alert>

          <ExpandableSection
            headerText="The diagnostics the AWS script collects when the check fails"
            headerDescription="A ready-made troubleshooting checklist, copied from AWS's own EFA test"
          >
            <Box variant="p">
              The script collects nvidia-smi -L, ldconfig -p filtered for libnccl, ldd against the
              all_reduce_perf binary, fi_info -p efa, a listing of
              /opt/amazon/ofi-nccl/lib*/libnccl-net*.so, and the contents of /etc/ld.so.conf.d{' '}
              <SourceRef provenance="code-derived" code={code.dlcValidate} />. Those six commands
              cover the three failure classes: no device, no plugin, or a plugin the loader cannot
              find.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check the three supported instance types before you write any code against it."
          >
            SMDDP: a P4-era library, frozen since October 2024
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SMDDP, the SageMaker Distributed Data Parallel library, replaces NCCL as the collective
            backend for data-parallel training while still riding EFA underneath. The support page
            lists ml.p3dn.24xlarge, ml.p4d.24xlarge and ml.p4de.24xlarge, adds that support for
            optimizing collective communication on P3 has been discontinued, and states that the
            optimized AllGather collective is only available for P4 instances{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />. The FAQ says the library
            only supports GPU instances, specifically P4d and P4de with NVIDIA A100 GPUs and EFA{' '}
            <SourceRef provenance="documented" doc={docs.ddpFaq} />, and the SDK source agrees{' '}
            <SourceRef provenance="code-confirmed" doc={docs.ddpSupport} code={code.smddpTypes} />.
            That list is the whole scope, so P5, P6, Trn2 and the G family run plain NCCL over
            aws-ofi-nccl over EFA instead.
          </Box>

          <Box variant="p">
            The release cadence tells the rest. The latest SMDDP release is v2.5.0, dated October 17,
            2024{' '}
            <SourceRef provenance="documented" doc={docs.ddpRelease} />, and the latest model
            parallelism library release is v2.6.0, dated the same day{' '}
            <SourceRef provenance="documented" doc={docs.smpRelease} />. TensorFlow support has
            already ended: the library is no longer available in Deep Learning Containers for
            TensorFlow later than 2.11.0{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />. No AWS deprecation notice
            was found, so treat SMDDP as frozen: still documented, still scoped to those three
            instance types, unchanged since October 2024.
          </Box>

          <Alert type="error" header="Quote the streaming multiprocessor saving with its instance family attached">
            P4d and P4de carry NVIDIA A100 GPUs with 108 streaming multiprocessors each, NCCL takes
            up to 24 of them to run collective operations, and SMDDP uses fewer than 9{' '}
            <SourceRef provenance="documented" doc={docs.ddpIntro} />. It is an A100 number, and it
            gets quoted at people planning P5 and Trn2 clusters, where SMDDP runs on none of the
            instance types AWS currently markets for frontier training.
          </Alert>

          <ExpandableSection
            headerText="Why AWS built it, and how it relates to EFA"
            headerDescription="It replaces the collective library above EFA: mesh topology, GDRCopy pipelining, a smaller SM budget"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                AWS is blunt about the motivation. Its model parallel blog says NCCL is a general
                purpose collective communications library not designed for AWS infrastructure, which
                leads to sub-optimal performance even with EFA enabled{' '}
                <SourceRef provenance="documented" doc={docs.smpPerf} />. The answer AWS shipped for
                that stopped at P4de.
              </Box>
              <Box variant="p">
                SMDDP still rides EFA, and AWS describes its AllGather in three parts. It transfers
                data between instances through EFA with a mesh topology, and compared to the NCCL
                ring or tree topology that involves multiple packet hops, it avoids accumulating
                latency because it only needs one hop, with a network rate control algorithm
                balancing the workload to each peer. It adopts a low-latency GPU memory copy library
                based on NVIDIA GPUDirect RDMA technology, called GDRCopy, to coordinate local NVLink
                and EFA network traffic, which lets it pipeline intra-node and inter-node data
                movement. And it reduces streaming multiprocessor usage, which is the 24 down to
                fewer than 9 figure above. The AllReduce path is a different trade: the library uses
                CPUs to AllReduce gradients, offloading that task from the GPUs, so the cluster's
                GPUs focus on computing gradients{' '}
                <SourceRef provenance="documented" doc={docs.ddpIntro} />.
              </Box>
              <Box variant="p">
                Activation is a process-group swap, and it composes with SMP v2, PyTorch FSDP and
                DeepSpeed{' '}
                <SourceRef provenance="documented" doc={docs.smpSmddp} />. Note the order rule on
                that page: initialize PyTorch Distributed with the SMDDP backend first, then run the
                SMP initialization.
              </Box>
              <Box variant="code">
                <pre style={preStyle}>{String.raw`import torch.distributed as dist
import smdistributed.dataparallel.torch.torch_smddp

dist.init_process_group(backend="smddp")  # Replacing "nccl"`}</pre>
              </Box>
              <Box variant="p">
                SMDDP needs the same self-referencing security group EFA does, allowing all inbound
                and outbound traffic to and from the security group itself{' '}
                <SourceRef provenance="documented" doc={docs.ddpSupport} />. One published known
                issue is live: a gradual CPU memory increase while training with SMDDP AllReduce in
                DDP mode{' '}
                <SourceRef provenance="documented" doc={docs.ddpRelease} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning" header="The distributed training documentation set has a P4-era centre of gravity">
            As of August 1, 2026, the SageMaker distributed training getting-started page still says
            that to achieve the most performant distributed training job in SageMaker AI, AWS
            recommends P4d and P4de instances equipped with NVIDIA A100 GPUs{' '}
            <SourceRef provenance="documented" doc={docs.distStart} />. That recommendation is two or
            more GPU generations behind the instance types the same API accepts{' '}
            <SourceRef provenance="documented" doc={docs.resourceConfig} />. It lines up with the SDK
            allowlist stopping at P5 and with SMDDP stopping at P4de. Read the API reference and the
            code for anything newer.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The one SageMaker surface where EFA is named, versioned, benchmarked and recovered."
          >
            HyperPod: EFA as a managed, versioned component
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A HyperPod cluster is standing infrastructure. CreateCluster provisions instance groups
            that stay up across jobs, you reach the nodes directly, and you pick the orchestrator,
            Slurm or Amazon EKS. A training job rents a cluster for one run; a HyperPod cluster is
            yours until you delete it. That difference turns EFA from an implicit property of the
            instance type into a component you name, version, benchmark and repair.
          </Box>

          <Box variant="h3">efa or efa-only, chosen per instance group</Box>
          <Box variant="p">
            ClusterNetworkInterface takes an optional InterfaceType of efa, which is an EFA with an
            ENA device for IP networking alongside it, or efa-only, which is the EFA device without
            the ENA device{' '}
            <SourceRef provenance="documented" doc={docs.clusterNic} />. The device-level difference
            is in the EFA device section of this dive. EC2 introduced the interface type in October
            2024; what HyperPod adds is the choice, per instance group, on CreateCluster and
            UpdateCluster since June 2026, and AWS gives the reason to take efa-only directly in that
            launch: it maximizes the number of EFA interfaces dedicated to inter-node communication
            without encountering IP exhaustion{' '}
            <SourceRef provenance="documented" doc={docs.efaOnlyNews} />.
          </Box>
          <Box variant="h3">The AMI (Amazon Machine Image) contract</Box>
          <Box variant="p">
            EFA is one of five components covered by a published AMI support policy, alongside the
            NVIDIA driver, NCCL through aws-ofi-nccl, CUDA and the OS kernel. AWS states that major
            AMI releases involve upgrading those core components to new major versions and may
            introduce breaking changes that require workload validation, and it publishes the support
            windows: 12 months for a major version, 6 months for a minor version, and until the next
            patch for a patch version{' '}
            <SourceRef provenance="documented" doc={docs.amiPolicy} />.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">EKS AMI line</Box>
              <Box variant="p">
                Versions 1.0.x through 1.3.x all carry EFA installer 1.47.0, with NVIDIA driver
                580.126.09 through 580.167.08, CUDA 12.8 and kernel 6.1.x, supporting Kubernetes 1.30
                through 1.35, first released between January 25 and June 29, 2026. The 1.x line is
                supported until January 2027{' '}
                <SourceRef provenance="documented" doc={docs.amiPolicy} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Slurm AMI line</Box>
              <Box variant="p">
                The July 9, 2026 release carries EFA installer 1.47.0, rdma-core 61.0-1, NVIDIA
                driver 580.159.04, Slurm 25.11.4 and kernel 6.8.0-1057-aws. The March 30, 2026
                release was still on EFA installer 1.45.1 with rdma-core 60.0-1, so the bump landed
                between March 30 and April 23, 2026{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="A custom AMI puts the EFA installer version back in your hands">
            AWS answers the question directly on the policy page: does this policy apply to custom
            AMIs, no{' '}
            <SourceRef provenance="documented" doc={docs.amiPolicy} />. Build one and you own the
            EFA installer version, the NCCL build, the driver, and keeping all three consistent with
            the cluster software.
          </Alert>

          <ExpandableSection
            headerText="Three AWS pages disagree about the HyperPod base operating system"
            headerDescription="Which page to trust, and the NCCL-per-CUDA mapping worth taking from the third"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The AMI overview page says the enhancements are built on the AWS Deep Learning Base
                GPU AMI on Ubuntu 20.04 for Slurm, and an Amazon Linux 2 or Amazon Linux 2023 AMI for
                EKS{' '}
                <SourceRef provenance="documented" doc={docs.amiBase} />. The Slurm release notes say
                Ubuntu 22.04, and document a migration from 20.04 to 22.04 on May 13, 2025{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />. Use the release notes:
                they carry the dated migration entry. They also document the compiled NCCL version
                per CUDA directory, for example NCCL 2.27.5 built against CUDA 12.8, which is what
                you check against torch.cuda.nccl.version() when a container and a host disagree.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="h3">Deep health checks reach the fabric</Box>
          <Box variant="p">
            HyperPod publishes an inventory of what its deep health checks run. Alongside GPU and
            NVLink counts, DCGM (Data Center GPU Manager) diagnostics at level 4 and the Neuron
            checks, one
            instance-level check is EFA, on both GPU and Trainium instances, running latency and
            bandwidth benchmarking on the attached device; at cluster level an NCCL test runs across
            multiple GPUs and an NCCOM test across multiple Trainium nodes{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />. AWS benchmarks the device
            before your work lands on it, and publishes what both outcomes look like.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{HEALTH_LOG_SNIPPET}</pre>
          </Box>
          <Box variant="p">
            Both log samples are quoted from the deep health checks page{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />. The failure is a fabric
            bandwidth threshold failure rather than a GPU failure: expected minimum 80, NCCL test
            output 30. Cluster-level results land in CloudWatch under the cluster log group, and
            instance-level results in /var/log/aws/clusters/sagemaker-deep-health-check.log on each
            node. You can also trigger a run on demand with the StartClusterHealthCheck API{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />.
          </Box>
          <Alert type="warning" header="The check costs about two hours per new instance">
            AWS states that a new instance goes through the deep health check process, which is
            instance-level stress testing, for about a couple of hours, and recommends disabling deep
            health checks after cluster creation when you have no spare capacity, because that delay
            slows node replacement{' '}
            <SourceRef provenance="documented" doc={docs.configTips} />. The trade is verified
            fabric health against faster recovery.
          </Alert>
          <Alert type="info" header="Two scoping rules on the checks">
            Instance-level deep health checks run only on eligible GPU instance types, and CPU
            instance types inside a flexible instance group are skipped. Cluster-level connectivity
            tests such as NCCL AllReduce run only between instances of the same type within the
            instance group{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />. Passing nodes are labelled
            Schedulable on the EKS side; failing nodes are terminated and replaced.
          </Alert>

          <Box variant="h3">Topology awareness, and the flat default</Box>
          <Box variant="p">
            HyperPod configures Slurm topology without being asked. When you create a Slurm cluster,
            the system inspects all instance groups and their instance types, identifies the GPU
            communication characteristics of each, and configures Slurm with the appropriate topology
            plugin. The tree plugin covers hierarchical interconnects including ml.p5.48xlarge,
            ml.p5e.48xlarge and ml.p5en.48xlarge; the block plugin covers UltraServer types such as
            ml.p6e-gb200.36xlarge; and the file format follows the Slurm version, topology.yaml on
            25.11 and later, topology.conf on 24.x{' '}
            <SourceRef provenance="documented" doc={docs.topology} />. The launch says the same:
            enabled by default, requires no configuration{' '}
            <SourceRef provenance="documented" doc={docs.topoNews} />. The generated file formats
            and the EC2 network node identifiers behind them are in the topology section.
          </Box>
          <Alert type="warning" header="One non-topology instance group demotes the whole cluster">
            AWS states the resolution rule plainly: if any non-topology compute group is present,
            flat is the default{' '}
            <SourceRef provenance="documented" doc={docs.topology} />. One instance group of a type
            without network topology support silently removes topology-aware placement from the
            cluster default. Nothing fails. Jobs stop being placed with fabric locality in mind.
          </Alert>

          <Box variant="h3">Auto-resume on fabric failure</Box>
          <Box variant="p">
            At cluster creation or update you choose a node recovery option of Automatic, which AWS
            recommends, or None. With Automatic, HyperPod reboots or replaces faulty nodes, and that
            recovery runs on issues found by the health-monitoring agent, the basic health checks and
            the deep health checks{' '}
            <SourceRef provenance="documented" doc={docs.autoResume} />. Since the deep health checks
            include the EFA benchmark, a bad fabric device is inside the recovery loop.
          </Box>
          <Box variant="p">
            On Slurm it is a SageMaker plugin on the SPANK framework that inspects cluster health
            when a job fails, removes a faulty node, replaces it and restarts the job; on EKS it is
            an extension to the Kubeflow Training Operator for PyTorch that makes the job wait and
            restart after the node is replaced{' '}
            <SourceRef provenance="documented" doc={docs.eksHpBlog} />. The Slurm idiom AWS publishes
            in its own batch scripts is short: it tests for a directory and only adds the flag when
            the test succeeds{' '}
            <SourceRef provenance="documented" doc={docs.mathstral} />.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{AUTO_RESUME_SNIPPET}</pre>
          </Box>

          <Alert type="error" header="Live known issue: auto-resume on Slurm 25.11">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS publishes this, dated May 27, 2026 and still live on the release notes page as of
                August 1, 2026: auto-resume has known issues on HyperPod clusters running Slurm
                25.11, jobs submitted with auto-resume enabled are not guaranteed to resume on the
                node that is replaced after a node fault, the affected jobs are requeued instead, and
                a fix is under investigation{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />.
              </Box>
              <Box variant="p">
                A requeue recomputes placement, so the job can land on a different set of nodes
                with different fabric locality. A long run that quietly requeues twice can end up
                with worse collective performance than it started with, for reasons that have
                nothing to do with your code.
              </Box>
            </SpaceBetween>
          </Alert>

          <Alert type="warning" header="Turn the EFA metrics exporter on before you need it">
            HyperPod cluster metrics include a Network category sourced from an EFA Exporter that is
            off by default and belongs to the advanced observability mode{' '}
            <SourceRef provenance="documented" doc={docs.observability} />. Teams debugging a
            fabric problem discover mid-incident that the exporter was never running.
          </Alert>

          <ExpandableSection
            headerText="The EKS side: device plugin, DRA driver, and the networking prerequisites"
            headerDescription="What HyperPod inherits from EKS when you pick the Kubernetes orchestrator"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                HyperPod on EKS requires the Amazon VPC (Virtual Private Cloud) CNI (Container
                Network Interface) plug-in version 1.18.3 or later, states that the AWS VPC CNI is
                the only CNI supported, and requires the subnets in your VPC to be private. Supported
                Kubernetes versions run 1.30 through 1.35{' '}
                <SourceRef provenance="documented" doc={docs.eksPrereq} />.
              </Box>
              <Box variant="p">
                EFA reaches pods through one of two models: the EFA device plugin, which advertises
                an integer count of vpc.amazonaws.com/efa extended resources and allocates each
                device exclusively to one pod, or the EFA DRA (Dynamic Resource Allocation) driver,
                which requires Kubernetes 1.34 and can pin an EFA device to the same PCIe root as the
                GPU it serves{' '}
                <SourceRef provenance="documented" doc={docs.eksEfa} />. Check that requirement
                against the supported Kubernetes range above before you plan on the DRA model. The
                EKS integration section covers both in detail.
              </Box>
              <Box variant="p">
                Flexible instance groups, added April 2026, let you define an ordered list of
                instance types through InstanceRequirements and provide multiple subnets across
                Availability Zones, with training benefiting from multi-subnet distribution within an
                Availability Zone to avoid subnet exhaustion. The feature is EKS orchestrator only{' '}
                <SourceRef provenance="documented" doc={docs.flexGroups} />. Note the phrasing:
                within an Availability Zone. The EFA boundary is unchanged.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Disaggregated prefill and decode, on the EKS orchestrator, is the one documented path where EFA moves inference traffic."
          >
            HyperPod inference: the only place EFA carries inference traffic
          </Header>
        }
      >
        <SpaceBetween size="m">
          <DpdStackDiagram />

          <Box variant="p">
            AWS states the hardware requirement without hedging: disaggregated prefill and decode
            requires EFA-capable instances with GPUDirect RDMA support, and the supported instance
            types are ml.p5.48xlarge, ml.p5e.48xlarge, ml.p5en.48xlarge, ml.p6-b200.48xlarge and
            ml.p6-b300.48xlarge. Other instance types are not supported. The worker image must
            include vLLM, LMCache, NVIDIA NIXL and the EFA libfabric provider, and the feature needs
            HyperPod Inference Operator version 3.2 or later{' '}
            <SourceRef provenance="documented" doc={docs.dpd} />. You enable it by adding a pdSpec
            section to the existing InferenceEndpointConfig custom resource, on HyperPod clusters
            using the EKS orchestrator{' '}
            <SourceRef provenance="documented" doc={docs.dpdNews} />. HyperPod inference otherwise
            supports single-node and multi-node architectures with a two-tier key value cache, an L1
            cache in CPU memory for local reuse and an L2 cache in Redis for node-level sharing{' '}
            <SourceRef provenance="documented" doc={docs.hpDeploy} />.
          </Box>
          <Box variant="p">
            The four bands in the diagram are the AWS blog's own description of the transport, with
            NIXL selecting the RDMA operation and the libfabric provider exposing EFA as kernel-bypass
            GPUDirect RDMA that keeps the host CPU off the data path{' '}
            <SourceRef provenance="documented" doc={docs.dpdBlog} />. Same post, the quantified
            claim: on ml.p5.48xlarge with 3,200 Gbps of EFA, an 8,000-token transfer for Llama 3.3
            70B takes single-digit milliseconds{' '}
            <SourceRef provenance="documented" doc={docs.dpdBlog} />.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Placement is a hard constraint</Box>
              <Box variant="p">
                Instances are required to be located within the same Availability Zone for EFA
                high-bandwidth communication{' '}
                <SourceRef provenance="documented" doc={docs.dpdBlog} />. It is the same
                Availability Zone boundary EFA has everywhere else, arriving where people do not
                expect it.
              </Box>
            </div>
            <div>
              <Box variant="h3">The G family caveat</Box>
              <Box variant="p">
                AWS is explicit that although G6, G6e and G7e do support EFA with RDMA read and write,
                performance on those multi-GPU instances is bottlenecked by GPU-to-GPU communication
                over PCIe{' '}
                <SourceRef provenance="documented" doc={docs.dpdBlog} />. EFA capability alone does
                not make an instance a candidate here.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="The router sends small requests straight to a decoder">
            The blog states the trade directly: below the routing threshold, the fixed cost of
            transferring the key value cache over EFA RDMA outweighs the benefit of isolating decode,
            so the router sends those requests straight to a decoder{' '}
            <SourceRef provenance="documented" doc={docs.dpdBlog} />. Routing strategies are
            prefixaware, kvaware, session and roundrobin. The fabric is used only when the transfer
            is large enough to pay for itself.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The fields an endpoint gives you, where the documented control stops, and how far that finding reaches."
          >
            Managed inference endpoints: what the control surface covers
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            ProductionVariant is the compute block of CreateEndpointConfig. Its members cover the
            variant name and weight, instance type and count, capacity reservation, container startup
            health check timeout, core dumps, SSM access, InferenceAmiVersion, InstancePools, and
            routing and scaling fields. InferenceAmiVersion enumerates the managed inference images by
            NVIDIA driver, CUDA and container toolkit version, and those three components are the
            whole image specification{' '}
            <SourceRef provenance="documented" doc={docs.productionVariant} />. That is the surface:
            instance type, image version, capacity, routing and scale. No EFA field appears within
            it, no field for sharding one model across instances, and no EFA, libfabric or
            aws-ofi-nccl stack in any image description. InstancePools is a capacity fallback list,
            each entry naming an instance type and its provisioning priority, capped at five{' '}
            <SourceRef provenance="documented" doc={docs.productionVariant} />, from which SageMaker
            AI provisions the next available option when preferred instance types have insufficient
            capacity{' '}
            <SourceRef provenance="documented" doc={docs.instFallback} />.
          </Box>
          <Box variant="p">
            Scale happens within one instance or by whole replicas of it. Inference components
            allocate accelerators inside an instance through ComputeResourceRequirements, and scaling
            happens by copies, which are independent replicas of the whole model{' '}
            <SourceRef provenance="documented" doc={docs.realtime} />. The AWS guidance for large
            foundation models says the same: it is suitable for models that cannot fit into a single
            accelerator's memory and therefore need multiple accelerators in an instance{' '}
            <SourceRef provenance="documented" doc={docs.scaleFm} />.
          </Box>

          <Alert type="info" header="How far this finding reaches">
            Absence of documentation is not the same as documented absence. No AWS page found says
            EFA is not available on real-time endpoints. What can be asserted with confidence is
            narrower and still decisive: the API has no EFA control, the managed inference image
            specification lists no EFA stack, and every AWS scaling recommendation for endpoints is
            either intra-instance or replica-based. Multi-node EFA inference on SageMaker exists on
            HyperPod EKS, through the Inference Operator's disaggregated prefill and decode feature,
            on five instance types, in a single Availability Zone{' '}
            <SourceRef provenance="documented" doc={docs.dpd} />.
          </Alert>

          <Box variant="p">
            Two adjacent surfaces resolve the same way. Multi-model endpoints are currently supported
            for all CPU instance types and on single-GPU instance types{' '}
            <SourceRef provenance="documented" doc={docs.mme} />. A single-GPU instance has no
            multi-GPU collective to run, so the EFA question does not arise. SMP v2 is a training
            library, and the compatibility page that connects it to EFA is a training page repeating
            the same instance restriction: the SMDDP library supports P4 and P4de instances{' '}
            <SourceRef provenance="documented" doc={docs.smpSmddp} />. Treat SMP for inference as
            undocumented rather than unsupported.
          </Box>

          <ExpandableSection
            headerText="Amazon runs multi-node EFA inference on Trainium, on Amazon ECS"
            headerDescription="The pattern exists at Amazon scale, outside the managed endpoint product"
          >
            <Box variant="p">
              AWS describes Rufus running multi-node inference on Trainium where cross-node
              collectives such as all gather and all reduce are managed by the Neuron Distributed
              Inference library, which uses EFA to deliver high-bandwidth, low-latency inter-node
              communication, with model inputs broadcast separately on CPU over standard TCP
              connections using the Gloo backend{' '}
              <SourceRef provenance="documented" doc={docs.rufus} />. That deployment runs on
              Amazon ECS, outside the managed endpoint product.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the contract on who owns the fabric and how long the cluster lives."
          >
            Decision: training job or HyperPod
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'dimension', header: 'Dimension', cell: (item) => <strong>{item.dimension}</strong> },
              { id: 'trainingJob', header: 'Training job', cell: (item) => item.trainingJob },
              { id: 'hyperpod', header: 'HyperPod', cell: (item) => item.hyperpod },
            ]}
            items={decisionRows}
          />

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                Pick a training job <Badge color="blue">shorter runs</Badge>
              </Box>
              <Box variant="p">
                Runs that finish inside the checkpoint interval you are willing to lose, on a small
                node count, on an instance type that sits on the SDK allowlist. You get cluster
                repair with automatic restart from your last checkpoint, unbilled{' '}
                <SourceRef provenance="documented" doc={docs.repair} />, and you give up topology
                control and any published fabric benchmark.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Pick HyperPod <Badge color="green">long runs, large clusters</Badge>
              </Box>
              <Box variant="p">
                Runs measured in days or weeks, node counts where a single bad EFA device costs
                real money, and teams that want the fabric benchmarked before work lands on it{' '}
                <SourceRef provenance="documented" doc={docs.deepHealth} />. You accept a standing
                cluster, roughly two hours of deep health checks per new node{' '}
                <SourceRef provenance="documented" doc={docs.configTips} />, and the Slurm 25.11
                auto-resume defect on that version{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="The tie-breaker nobody weighs early enough">
            If you will later serve the model with multi-node inference, HyperPod on the EKS
            orchestrator is the only SageMaker surface where that exists, through the Inference
            Operator's disaggregated prefill and decode feature{' '}
            <SourceRef provenance="documented" doc={docs.dpdNews} />. Choosing a training job today
            is also choosing to move platforms before you serve, which is a bigger decision than the
            comparison above.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Five steps from nothing to a job you have proven is using the fabric."
          >
            Getting started: your first EFA-backed SageMaker job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Step 1. Pick an instance type that is on both lists.</strong> The API accepts far
            more types than the SDK driver configures. For a first run where you want the documented
            path to work without intervention, choose ml.p4d.24xlarge or ml.p4de.24xlarge: they are
            in SM_EFA_NCCL_INSTANCES and SM_EFA_RDMA_INSTANCES{' '}
            <SourceRef provenance="code-derived" code={code.allowlist} />, and p4d.24xlarge is the
            type AWS runs its own EFA test on{' '}
            <SourceRef provenance="code-derived" code={code.dlcEfaTest} />. On ml.p5.48xlarge expect
            FI_PROVIDER to be set and FI_EFA_USE_DEVICE_RDMA to be left to you. On anything newer,
            expect to set both yourself.
          </Box>
          <Box variant="p">
            <strong>Step 2. Use an AWS Deep Learning Container rather than your own image.</strong>{' '}
            The DLC already contains libfabric, aws-ofi-nccl, a matching NCCL, OpenMPI, the
            /etc/nccl.conf defaults and a compiled all_reduce_perf{' '}
            <SourceRef provenance="code-derived" code={code.dlcNcclTests} />. Your own image means
            owning the three install-script behaviours above and the version-match rule against
            torch.cuda.nccl.version(){' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />.
          </Box>
          <Box variant="p">
            <strong>Step 3. Get the network right before you submit.</strong> The security group
            must allow all inbound and outbound traffic to and from itself{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />. Placement is not yours to
            set: SageMaker puts one job's instances in a single subnet, therefore a single
            Availability Zone{' '}
            <SourceRef provenance="documented" doc={docs.capacity} />, so keep the data in that same
            Region and Availability Zone{' '}
            <SourceRef provenance="documented" doc={docs.distStart} />.
          </Box>
          <Box variant="p">
            <strong>Step 4. Submit with at least two instances, then read the log.</strong> A fabric
            takes two nodes to exercise. Set NCCL_DEBUG to INFO, which the DLC already does through
            /etc/nccl.conf{' '}
            <SourceRef provenance="code-derived" code={code.dlcNcclConf} />, and grep the CloudWatch
            log for the four signatures above. If aws-ofi-nccl appears but NET/OFI Selected provider
            is efa does not, the plugin loaded and the provider was never chosen. That is the failure
            the allowlist causes.
          </Box>
          <Box variant="p">
            <strong>Step 5. Move to HyperPod early if the decision above pointed there.</strong> The
            job script, the container and the four log signatures all carry over. The cluster
            lifecycle does not, and it is the expensive part to change once a run is underway.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
