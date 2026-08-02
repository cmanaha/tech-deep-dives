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
 * Sourcing rule for this file (deep-dives/efa/revamp/source-authority-standard.md):
 * every load-bearing claim carries a SourceRef. 'documented' means AWS states it.
 * 'code-derived' means it was read out of an implementation at a pinned commit and
 * AWS documents nothing. 'doc-code-conflict' means two authorities disagree and both
 * are named. Nothing is laundered between the categories.
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
  faqSlurm: doc('SageMaker Developer Guide: HyperPod FAQs for Slurm', `${SM_DG}sagemaker-hyperpod-faq-slurm.html`, 1),
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
 * The inference lane is deliberately one empty band, because that is the
 * negative result rendered as a picture.
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
        every stage, while managed real-time inference endpoints answer none of them: the API has no
        EFA field, the managed inference image list names no EFA stack, and no cross-instance
        collective path is documented.
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
          .tc-none { fill: #5f6b7a; font: 600 13px sans-serif; text-anchor: middle; }
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
        No documented control at any of the four stages
      </text>
      <text className="tc-nsub" x="562" y="340">
        ProductionVariant has no EFA field, and InferenceAmiVersion names no EFA, libfabric or aws-ofi-nccl stack.
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
        A SageMaker training job only runs NCCL over EFA after passing four gates: an EFA-capable
        instance type, a container carrying libfabric and aws-ofi-nccl, an SDK allowlist entry that
        sets the EFA environment variables, and a runtime log that names the EFA provider. The third
        gate skips several current instance types without raising an error, so the fourth gate is the
        only one that produces evidence.
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

/**
 * Diagram 3. SMDDP scope. The red band across the top exists so nobody reads
 * the streaming-multiprocessor figures as a claim about P5 or later.
 */
function SmddpScopeDiagram() {
  const grid = (originX: number, originY: number, shaded: number, cls: string) =>
    Array.from({ length: 108 }, (_, i) => {
      const col = i % 12;
      const row = Math.floor(i / 12);
      return (
        <rect
          key={i}
          className={i < shaded ? cls : 'sd-idle'}
          x={originX + col * 15}
          y={originY + row * 15}
          width="13"
          height="13"
          rx="2"
        />
      );
    });

  const supported = [
    ['ml.p3dn.24xlarge', 'AllReduce only. No further development support.'],
    ['ml.p4d.24xlarge', 'AllReduce and AllGather.'],
    ['ml.p4de.24xlarge', 'AllReduce and AllGather.'],
  ];

  return (
    <svg viewBox="0 0 960 400" role="img" aria-labelledby="sm-smddp-title" style={{ width: '100%', height: 'auto' }}>
      <title id="sm-smddp-title">
        SMDDP supports only three instance types, all of them P3dn or P4 generation, and its
        optimized AllGather is P4 only. The streaming-multiprocessor saving AWS publishes, 24 down to
        fewer than 9 out of 108 on an A100, was measured on those P4 instances and does not describe
        any newer instance family.
      </title>
      <style>
        {`
          .sd-band { fill: #fdf3f1; stroke: #d13212; stroke-width: 1.8; }
          .sd-bandt { fill: #d13212; font: 600 13px sans-serif; text-anchor: middle; }
          .sd-panel { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .sd-h { fill: #0f1b2a; font: 600 13px sans-serif; }
          .sd-hc { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .sd-mono { fill: #0f1b2a; font: 11px monospace; }
          .sd-txt { fill: #5f6b7a; font: 11px sans-serif; }
          .sd-no { fill: #d13212; font: 11px sans-serif; }
          .sd-idle { fill: #eaeded; }
          .sd-nccl { fill: #d13212; }
          .sd-smddp { fill: #037f0c; }
          .sd-lbl { fill: #0f1b2a; font: 600 11px sans-serif; text-anchor: middle; }
          .sd-sub { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .sd-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="960" height="400" rx="8" fill="#ffffff" />

      <rect className="sd-band" x="20" y="16" width="920" height="38" rx="6" />
      <text className="sd-bandt" x="480" y="40">
        SMDDP supports P3dn, P4d and P4de only. AllGather is P4 only. Nothing newer is supported.
      </text>

      <rect className="sd-panel" x="20" y="70" width="470" height="280" rx="6" />
      <text className="sd-h" x="40" y="100">
        Supported
      </text>
      {supported.map(([type, note], index) => (
        <g key={type}>
          <text className="sd-mono" x="40" y={124 + index * 22}>
            {type}
          </text>
          <text className="sd-txt" x="185" y={124 + index * 22}>
            {note}
          </text>
        </g>
      ))}
      <text className="sd-h" x="40" y="212">
        Not supported
      </text>
      <text className="sd-no" x="40" y="236">
        P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200
      </text>
      <text className="sd-no" x="40" y="256">
        Trn1, Trn1n, Trn2
      </text>
      <text className="sd-no" x="40" y="276">
        G5, G6, G6e, G7e
      </text>
      <text className="sd-txt" x="40" y="310">
        Last release: v2.5.0, October 17, 2024.
      </text>
      <text className="sd-txt" x="40" y="330">
        No release since. TensorFlow support already discontinued.
      </text>

      <rect className="sd-panel" x="505" y="70" width="435" height="280" rx="6" />
      <text className="sd-hc" x="722" y="100">
        One NVIDIA A100: 108 streaming multiprocessors
      </text>
      {grid(530, 118, 24, 'sd-nccl')}
      {grid(740, 118, 9, 'sd-smddp')}
      <text className="sd-lbl" x="620" y="278">
        NCCL: up to 24
      </text>
      <text className="sd-sub" x="620" y="294">
        collectives
      </text>
      <text className="sd-lbl" x="830" y="278">
        SMDDP: fewer than 9
      </text>
      <text className="sd-sub" x="830" y="294">
        collectives
      </text>
      <text className="sd-cap" x="722" y="326">
        Measured by AWS on P4d and P4de. Not a claim about any other GPU.
      </text>

      <text className="sd-cap" x="480" y="382">
        Read the top band before the numbers. On P5 and later the answer is plain NCCL over aws-ofi-nccl over EFA.
      </text>
    </svg>
  );
}

/** Diagram 4. The four-layer KV cache transport HyperPod composes for DPD. */
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
  accepted: string;
  nccl: string;
  rdma: string;
}

/** Instance types the training API accepts, against what the SDK driver actually sets. */
const allowRows: AllowRow[] = [
  { type: 'ml.p4d.24xlarge', accepted: 'yes', nccl: 'yes', rdma: 'yes' },
  { type: 'ml.p4de.24xlarge', accepted: 'yes', nccl: 'yes', rdma: 'yes' },
  { type: 'ml.p5.48xlarge', accepted: 'yes', nccl: 'yes', rdma: 'no' },
  { type: 'ml.p5e.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.p5en.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.p6-b200.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.p6-b300.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.p6e-gb200.36xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.trn1.32xlarge', accepted: 'yes', nccl: 'yes', rdma: 'yes' },
  { type: 'ml.trn2.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.g6e.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
  { type: 'ml.g7e.48xlarge', accepted: 'yes', nccl: 'no', rdma: 'no' },
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
    dimension: 'Fabric health checking',
    trainingJob: 'A pre-job NCCL check on P and G types. No published EFA benchmark.',
    hyperpod: 'Deep health checks run an EFA latency and bandwidth benchmark plus a cluster NCCL test.',
  },
  {
    dimension: 'Fabric observability',
    trainingJob: 'CloudWatch job logs. Grep for the NCCL provider lines yourself.',
    hyperpod: 'Cluster metrics include an EFA Exporter category, which is not enabled by default.',
  },
  {
    dimension: 'Topology control',
    trainingJob: 'None exposed. InstancePlacementConfig applies only to UltraServer capacity.',
    hyperpod: 'Automatic Slurm topology plugin selection, plus sbatch switch and segment controls.',
  },
  {
    dimension: 'Failure handling',
    trainingJob: 'Cluster repair, up to 10 attempts, restarting from your last checkpoint.',
    hyperpod: 'Automatic node recovery plus job auto-resume. Slurm 25.11 has a published defect here.',
  },
  {
    dimension: 'Reuse for inference',
    trainingJob: 'None. Training jobs are training jobs.',
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
            <strong>The problem:</strong> people say SageMaker handles EFA (Elastic Fabric Adapter)
            for you. That sentence is true on one surface, partly true on a second, and describes
            nothing at all on the third. <strong>The answer:</strong> treat SageMaker as three
            products. Training jobs get EFA implicitly from the instance type, with a software layer
            that is gated by a stale allowlist. HyperPod treats EFA as a managed, versioned,
            health-checked component you configure by name. Managed real-time inference endpoints
            expose no EFA control at all.
          </Box>

          <ThreeContractsDiagram />

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">
                Training jobs <Badge color="blue">implicit</Badge>
              </Box>
              <Box variant="p">
                The CreateTrainingJob API has no EFA parameter. Whether NCCL (NVIDIA Collective
                Communications Library) rides EFA depends on the container and on a hardcoded
                instance-type list inside the SageMaker Python SDK{' '}
                <SourceRef provenance="documented" doc={docs.resourceConfig} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                HyperPod <Badge color="green">explicit</Badge>
              </Box>
              <Box variant="p">
                You pick efa or efa-only on the cluster network interface, the AMI (Amazon Machine
                Image) pins the EFA installer version, and deep health checks benchmark the device
                before work lands on it{' '}
                <SourceRef provenance="documented" doc={docs.clusterNic} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Managed endpoints <Badge color="grey">not exposed</Badge>
              </Box>
              <Box variant="p">
                No EFA field on ProductionVariant, no EFA stack named in the managed inference image
                list, and no documented cross-instance collective path{' '}
                <SourceRef provenance="documented" doc={docs.productionVariant} />.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="There is no enable-EFA flag. There is an instance type, a container, an allowlist and a log line."
          >
            Training jobs: EFA is implicit, not optional
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">The API has no EFA knob</Box>
          <Box variant="p">
            ResourceConfig is the compute block of CreateTrainingJob. Its members are InstanceCount,
            InstanceGroups, InstancePlacementConfig, InstanceType, KeepAlivePeriodInSeconds,
            TrainingPlanArn, VolumeKmsKeyId and VolumeSizeInGB{' '}
            <SourceRef provenance="documented" doc={docs.resourceConfig} />. There is no EFA field.
            There is no fabric field. The instance type is the whole request.
          </Box>
          <Box variant="p">
            InstancePlacementConfig looks like a placement control and is not a general one. AWS
            documents it as configuration for how training job instances are placed and allocated
            within UltraServers, and states that it is only applicable for UltraServer capacity{' '}
            <SourceRef provenance="documented" doc={docs.resourceConfig} />.
          </Box>

          <Alert type="warning" header="Correction: SageMaker training jobs and EC2 placement groups">
            <SpaceBetween size="xs">
              <Box variant="p">
                An earlier version of this dive said SageMaker Training automatically configures EFA,
                placement groups and NCCL. The placement-group half of that is unverified. No AWS
                source found states that training jobs use EC2 cluster placement groups.
              </Box>
              <Box variant="p">
                The claim AWS does make is weaker and more specific. SageMaker AI launches all
                instances for a given job within a single subnet, which is a single Availability
                Zone, to keep them physically close and minimize inter-node latency, and additional
                subnets only broaden the options SageMaker can choose from rather than spreading one
                job across Availability Zones{' '}
                <SourceRef provenance="documented" doc={docs.capacity} />. That is the sentence to
                repeat. Single subnet, therefore single Availability Zone, which is exactly the
                boundary EFA traffic cannot cross anyway.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="h3">What actually turns EFA on</Box>
          <FourGatesDiagram />

          <Box variant="p">
            Gate 2 is the one AWS documents at length, and it is written entirely from the
            perspective of adding EFA to a container you bring. AWS states that you can add EFA
            integration to an existing Docker container that you bring to SageMaker AI, that your
            container must download and install the EFA software, and that any tools like MPI
            (Message Passing Interface) and NCCL must be installed and managed inside the container{' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />.
          </Box>
          <Box variant="p">
            Two details from that page are worth carrying into your own image. The EFA device is
            mounted to the container as /dev/infiniband/uverbs0, and on P4d instances the container
            has access to four EFA devices, uverbs0 through uverbs3. Your container handles regular
            TCP traffic among peers through the default Elastic Network Interfaces, while handling
            kernel-bypass traffic through the EFA device{' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />. The same page states the
            version rule that catches most people: when using PyTorch with EFA, the NCCL version of
            your container should match the NCCL version of your PyTorch installation, which you
            check with torch.cuda.nccl.version(){' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />.
          </Box>

          <Alert type="info" header="The bring-your-own-container page has stale version pins">
            The documented example Dockerfile still pins NCCL 2.7.8, EFA installer 1.30.0 and
            aws-ofi-nccl 1.1.1{' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />. Those are roughly 2023 pins.
            Use the structure of that Dockerfile and take the versions from the Deep Learning
            Container configuration in the next section instead.
          </Alert>

          <Box variant="h3">The allowlist gotcha</Box>
          <Box variant="p">
            This is the most important finding in this section. The SageMaker Python SDK ships
            container-side driver scripts that set the EFA environment variables when a job starts.
            They compare the instance type against a hardcoded list. They do not query the instance
            for an EFA device.
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

          <Box variant="code">
            <pre style={preStyle}>{String.raw`def setup_env():
    """Setup the environment variables for PyTorch distributed training"""
    instance_type = os.environ["SM_CURRENT_INSTANCE_TYPE"]
    network_interface_name = os.environ.get("SM_NETWORK_INTERFACE_NAME", "eth0")
    if instance_type in SM_EFA_NCCL_INSTANCES:
        # Enable EFA use
        os.environ["FI_PROVIDER"] = "efa"
    if instance_type in SM_EFA_RDMA_INSTANCES:
        # Use EFA's RDMA functionality for one-sided and two-sided transfer
        os.environ["FI_EFA_USE_DEVICE_RDMA"] = "1"
        os.environ["RDMAV_FORK_SAFE"] = "1"
    os.environ["NCCL_SOCKET_IFNAME"] = str(network_interface_name)
    os.environ["NCCL_PROTO"] = "simple"`}</pre>
          </Box>

          <Table
            variant="embedded"
            header={
              <Header variant="h3" description="Accepted by the API, against what the SDK driver sets at launch">
                Instance type versus allowlist coverage
              </Header>
            }
            columnDefinitions={[
              { id: 'type', header: 'Instance type', cell: (item) => <Box variant="code">{item.type}</Box> },
              { id: 'accepted', header: 'Accepted by ResourceConfig', cell: (item) => yesNo(item.accepted) },
              { id: 'nccl', header: 'In SM_EFA_NCCL_INSTANCES', cell: (item) => yesNo(item.nccl) },
              { id: 'rdma', header: 'In SM_EFA_RDMA_INSTANCES', cell: (item) => yesNo(item.rdma) },
            ]}
            items={allowRows}
          />

          <Alert type="warning" header="Two AWS-owned repositories disagree about P5">
            <SpaceBetween size="xs">
              <Box variant="p">
                The SageMaker Python SDK does not list ml.p5.48xlarge in SM_EFA_RDMA_INSTANCES, so a
                P5 training job launched through the SDK drivers never gets
                FI_EFA_USE_DEVICE_RDMA=1 or RDMAV_FORK_SAFE=1{' '}
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
                . Both were read on the same day, at pinned commits, in repositories AWS owns. We do
                not know which one is intended. Publish the disagreement, read the code for the path
                you are on, and set the variable yourself if you need it.
              </Box>
            </SpaceBetween>
          </Alert>

          <Alert type="info" header="What the allowlist gap does and does not prove">
            It proves that on ml.p5e.48xlarge, ml.p5en.48xlarge, ml.p6-b200.48xlarge,
            ml.p6-b300.48xlarge, ml.p6e-gb200.36xlarge, ml.trn2.48xlarge, ml.g6e and ml.g7e types,
            the SDK driver does not apply the settings AWS itself recommends{' '}
            <SourceRef provenance="code-derived" code={code.allowlist} />. It does not prove that
            those jobs fall back to TCP. libfabric selects a provider on its own, and normally picks
            efa when the device and aws-ofi-nccl are both present. Treat silent TCP fallback as an
            open question and settle it from the job log, not from the launcher.
          </Alert>

          <ExpandableSection
            headerText="The environment variables AWS recommends, and the two the SDK never sets"
            headerDescription="A documented contradiction between an AWS blog and AWS code"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The AWS best-practices blog for training large language models lists five settings
                for your own container: FI_PROVIDER set to efa, NCCL_PROTO=simple, because the EFA
                provider does not support low-latency protocols and enabling them could lead to data
                corruption, FI_EFA_USE_DEVICE_RDMA=1, NCCL_LAUNCH_MODE set to PARALLEL, and
                NCCL_NET_SHARED_COMMS set to 0{' '}
                <SourceRef provenance="documented" doc={docs.llmBest} />. The same post states
                plainly that in their experience, using EFA is a requirement to get satisfactory
                multi-node LLM training performance{' '}
                <SourceRef provenance="documented" doc={docs.llmBest} />.
              </Box>
              <Box variant="p">
                The SDK driver code sets FI_PROVIDER, FI_EFA_USE_DEVICE_RDMA, RDMAV_FORK_SAFE,
                NCCL_SOCKET_IFNAME and NCCL_PROTO. It sets neither NCCL_LAUNCH_MODE nor
                NCCL_NET_SHARED_COMMS{' '}
                <SourceRef provenance="code-derived" code={code.torchrun} />. If you want the blog's
                full set, pass them yourself.
              </Box>
              <Box variant="p">
                NCCL_PROTO=simple is the one setting to treat as mandatory rather than tuning. The
                stated reason is data corruption, not throughput.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Resiliency around a training job, and what it does not tell you about the fabric"
            headerDescription="Cluster repair is documented. EFA-specific coverage is not."
          >
            <SpaceBetween size="s">
              <Box variant="p">
                AWS states that SageMaker AI will attempt to repair the cluster up to 10 times, that
                a successful repair automatically restarts the training job from the previous
                checkpoint, that you are not billed for the cluster repair process, and that repairs
                do not initiate unless your training job fails{' '}
                <SourceRef provenance="documented" doc={docs.repair} />. The status string you will
                see is a message about repairing the training cluster due to hardware failure.
              </Box>
              <Box variant="p">
                Before a job starts, AWS describes GPU health checks that verify NCCL communication
                on GPU instances and replace faulty instances, enabled for P and G GPU-based
                instance types{' '}
                <SourceRef provenance="documented" doc={docs.llmBest} />. No source found states
                whether that pre-flight check exercises the EFA path specifically, or whether it
                would pass over TCP. Do not assume either way.
              </Box>
              <Box variant="p">
                One more setting interacts with all of this and has no published answer. Enabling
                inter-container traffic encryption can increase training time, especially with
                distributed deep learning algorithms, and for affected algorithms it also increases
                cost{' '}
                <SourceRef provenance="documented" doc={docs.encrypt} />. What that flag does to
                EFA traffic specifically, whether it tunnels it, excludes it, or conflicts with it,
                is not addressed by any AWS source found.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Concrete versions, the three install-script footguns, and the library search path that makes it work."
          >
            What the Deep Learning Containers ship
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When you create a ModelTrainer object, SageMaker sets up the distributed training
            infrastructure, calls CreateTrainingJob in the background, and pulls one of the pre-built
            AWS deep learning containers prepackaged with deep learning frameworks, distributed
            training frameworks and the EFA driver{' '}
            <SourceRef provenance="documented" doc={docs.distStart} />. That is the documented
            promise. Here is what the image actually contains.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The base image</Box>
              <Box variant="p">
                The CUDA 13.2 base pins NCCL 2.29.7-1, EFA installer 1.49.0 and GDRCopy 2.6, and
                carries the single most useful comment in the repository: EFA installer 1.49.0 vends
                libfabric 2.4.0amzn5.0 and aws-ofi-nccl 1.20.0{' '}
                <SourceRef provenance="code-derived" code={code.dlcBase} />. That maps an installer
                version to its components, which no documentation page does.
              </Box>
            </div>
            <div>
              <Box variant="h3">The PyTorch 2.13 SageMaker image</Box>
              <Box variant="p">
                CUDA 13.3.0, torch 2.13.0, NCCL 2.30.7-1, EFA installer 1.49.0, GDRCopy 2.6,
                DeepSpeed 0.19.2, Transformer Engine 2.17.0{' '}
                <SourceRef provenance="code-derived" code={code.dlcPytorch} />. The EC2 variant of
                the same image carries identical NCCL, EFA and GDRCopy pins. Only the build target
                and the entrypoint differ.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Three footguns in the EFA install script, all of them silent">
            <SpaceBetween size="xs">
              <Box variant="p">
                <strong>1. The container does not install the kernel module.</strong> The script runs
                the installer with --skip-kmod, --skip-limit-conf and --no-verify{' '}
                <SourceRef provenance="code-derived" code={code.dlcInstall} />. That is what makes
                the image portable and also what couples it to the host. An EFA container on a host
                without the EFA kernel driver has a userspace stack and no device.
              </Box>
              <Box variant="p">
                <strong>2. The plugin path and filename changed at EFA installer 1.44.0.</strong> The
                script branches on the version: at 1.44.0 and later the plugin lives at
                /opt/amazon/ofi-nccl/lib64/libnccl-net-ofi.so, and before that at
                /opt/amazon/ofi-nccl/lib/ARCH-linux-gnu/libnccl-net.so{' '}
                <SourceRef provenance="code-derived" code={code.dlcPluginPath} />. Both the directory
                and the file name moved. Anything with a hardcoded plugin path breaks on upgrade.
              </Box>
              <Box variant="p">
                <strong>3. EFA installer 1.48 and later skips the NCCL plugin on NGC-derived bases.</strong>{' '}
                The script passes --disable-ngc for those versions, with a comment explaining that
                1.48 and later auto-detect NGC containers through
                /opt/nvidia/nvidia_entrypoint.sh, which is present in the nvidia/cuda amzn2023 base
                images, and then skip the AL2023 libnccl-ofi package{' '}
                <SourceRef provenance="code-derived" code={code.dlcNgc} />. If you build your own EFA
                image on an NGC base and do not pass that flag, you get an EFA install with no NCCL
                plugin.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="What else the image sets up: NCCL defaults, search paths and a bundled benchmark"
            headerDescription="Useful because it tells you which settings are already applied before your job runs"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The install script writes container-wide NCCL defaults into /etc/nccl.conf:
                NCCL_DEBUG=INFO and NCCL_SOCKET_IFNAME excluding docker0 and lo{' '}
                <SourceRef provenance="code-derived" code={code.dlcNcclConf} />. It does not write
                FI_PROVIDER. That is set at launch by the SDK driver, which is why the container
                layer and the launcher layer can disagree with each other.
              </Box>
              <Box variant="p">
                The runtime search path puts the EFA stack ahead of everything else, with
                /opt/amazon/ofi-nccl/lib64, /opt/amazon/openmpi/lib, /opt/amazon/efa/lib and
                /opt/amazon/efa/lib64 all on LD_LIBRARY_PATH{' '}
                <SourceRef provenance="code-derived" code={code.dlcLdPath} />.
              </Box>
              <Box variant="p">
                The image also builds all_reduce_perf from NVIDIA nccl-tests into /usr/local/bin,
                described in the Dockerfile as used by CI EFA tests and available to customers for
                verifying EFA and NCCL connectivity before training{' '}
                <SourceRef provenance="code-derived" code={code.dlcNcclTests} />. You do not need to
                install a benchmark. It is already there.
              </Box>
              <Box variant="p">
                One repair the Dockerfile performs is worth knowing if you build your own image. The
                CUDA runtime base ships a versioned libcudart but not the unversioned symlink, and
                the NCCL OFI plugin opens libcudart.so by name and fails without it, so the
                Dockerfile creates the link explicitly{' '}
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
            description="EFA does not announce itself. The launcher can skip it without erroring. The log is the only evidence."
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
            This is the check that settles the question, and AWS wrote it. The Deep Learning
            Containers repository gates its own EFA test on four log signatures, plus two more on
            P4d and P5{' '}
            <SourceRef provenance="code-derived" code={code.dlcValidate} />.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{VALIDATE_SNIPPET}</pre>
          </Box>
          <Box variant="p">
            Grep your CloudWatch job log for the same four strings: aws-ofi-nccl anywhere at all,
            then NET/OFI Selected provider is efa, then Using network Libfabric or Using network AWS
            Libfabric, then NET/Libfabric/0/GDRDMA or NET/AWS Libfabric/0/GDRDMA. The fourth is the
            GPUDirect RDMA (Remote Direct Memory Access) confirmation, and the AWS script only checks
            it on P4d and P5. Missing the fourth while having the first three means EFA is carrying
            traffic without GPUDirect.
          </Box>

          <Alert type="info" header="The DLC performance floor is a CI floor, not a target">
            The same script asserts that in-place algorithm bandwidth at the 1 GiB message size is at
            least 3 GB/s across two nodes{' '}
            <SourceRef provenance="code-derived" code={code.dlcThreshold} />. That test runs on two
            p4d.24xlarge instances and verifies that EFA transport is used rather than sockets{' '}
            <SourceRef provenance="code-derived" code={code.dlcEfaTest} />. Three GB/s is the number
            below which AWS fails its own build. It is not a number to size a cluster against.
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
            description="A P4-era library that has not shipped since October 2024. Check the instance list before you write any code."
          >
            SMDDP: read this before you reach for it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <SmddpScopeDiagram />

          <Box variant="p">
            SMDDP is the SageMaker Distributed Data Parallel library. AWS states its instance
            requirement three times in three places. The support page lists ml.p3dn.24xlarge,
            ml.p4d.24xlarge and ml.p4de.24xlarge, adds that support for optimizing collective
            communication on P3 has been discontinued, and states that the optimized AllGather
            collective is only available for P4 instances{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />. The FAQ says the library
            only supports GPU instances, specifically P4d and P4de with NVIDIA A100 GPUs and EFA{' '}
            <SourceRef provenance="documented" doc={docs.ddpFaq} />. The SDK source agrees{' '}
            <SourceRef provenance="code-confirmed" doc={docs.ddpSupport} code={code.smddpTypes} />.
          </Box>
          <Box variant="p">
            The release cadence tells the rest. The latest SMDDP release is v2.5.0, dated October 17,
            2024{' '}
            <SourceRef provenance="documented" doc={docs.ddpRelease} />, and the latest model
            parallelism library release is v2.6.0, dated the same day{' '}
            <SourceRef provenance="documented" doc={docs.smpRelease} />. TensorFlow support is
            already gone: the library is no longer available in Deep Learning Containers for
            TensorFlow later than 2.11.0{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />.
          </Box>

          <Alert type="error" header="Correction: the SM saving does not apply to P5 or Trn2">
            <SpaceBetween size="xs">
              <Box variant="p">
                An earlier version of this dive placed the SMDDP streaming-multiprocessor claim
                inside a paragraph about scaling to 10 or more nodes on P5 and Trn2. SMDDP supports
                neither. On every instance type AWS currently markets for frontier training, SMDDP is
                not an option.
              </Box>
              <Box variant="p">
                The underlying number is correct within its scope. P4d and P4de carry NVIDIA A100
                GPUs with 108 streaming multiprocessors each, NCCL takes up to 24 of them to run
                collective operations, and SMDDP uses fewer than 9{' '}
                <SourceRef provenance="documented" doc={docs.ddpIntro} />. That is an A100
                measurement. Quote it with the instance family attached or do not quote it.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="p">
            AWS is blunt about why the library exists. Its model parallel blog says NCCL is a general
            purpose collective communications library not designed for AWS infrastructure, which
            leads to sub-optimal performance even with EFA enabled{' '}
            <SourceRef provenance="documented" doc={docs.smpPerf} />. That framing is worth keeping
            in mind while also noting that the answer AWS shipped for it stopped at P4de.
          </Box>

          <ExpandableSection
            headerText="How SMDDP relates to EFA: it bypasses NCCL, not EFA"
            headerDescription="Mesh topology, GDRCopy pipelining, and a smaller SM budget"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                SMDDP still rides EFA. It replaces the collective library above it. AWS describes the
                AllGather mechanism in three parts. It transfers data between instances through EFA
                with a mesh topology, and compared to the NCCL ring or tree topology that involves
                multiple packet hops, it avoids accumulating latency from multiple hops because it
                only needs one hop, with a network rate control algorithm balancing the workload to
                each peer{' '}
                <SourceRef provenance="documented" doc={docs.ddpIntro} />.
              </Box>
              <Box variant="p">
                It adopts a low-latency GPU memory copy library based on NVIDIA GPUDirect RDMA
                technology, called GDRCopy, to coordinate local NVLink and EFA network traffic, which
                lets it pipeline intra-node and inter-node data movement{' '}
                <SourceRef provenance="documented" doc={docs.ddpIntro} />. And it reduces streaming
                multiprocessor usage, which is the 24 down to fewer than 9 figure above.
              </Box>
              <Box variant="p">
                The AllReduce path is a different trade. AWS states that the library uses CPUs to
                AllReduce gradients, offloading that task from the GPUs, so the cluster's GPUs focus
                on computing gradients{' '}
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
                Two operational notes. SMDDP requires the same self-referencing security group EFA
                does: you should enable traffic between the instances by setting up the security
                group of your VPC to allow all inbound and outbound traffic to and from the security
                group itself{' '}
                <SourceRef provenance="documented" doc={docs.ddpSupport} />. And there is a published
                known issue, a gradual CPU memory increase while training with SMDDP AllReduce in DDP
                mode{' '}
                <SourceRef provenance="documented" doc={docs.ddpRelease} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info" header="Do not call SMDDP deprecated">
            No AWS deprecation notice was found. What the evidence supports is narrower and still
            decisive: no release since October 2024, and no supported instance type newer than P4de{' '}
            <SourceRef provenance="documented" doc={docs.ddpRelease} />. State those two facts and
            let the reader draw the conclusion.
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
          <Box variant="h3">efa or efa-only, chosen on the cluster</Box>
          <Box variant="p">
            ClusterNetworkInterface takes an InterfaceType of efa or efa-only. AWS defines efa as an
            EFA with ENA interface, providing both the EFA device for low-latency, high-throughput
            communication and the ENA device for IP networking, and efa-only as an EFA-only
            interface, providing only the EFA device capabilities without the ENA device for
            traditional IP networking. The field is not required{' '}
            <SourceRef provenance="documented" doc={docs.clusterNic} />.
          </Box>
          <Box variant="p">
            The reason to pick efa-only is address pressure. AWS states it directly in the June 2026
            launch: with EFA-only, users can maximize the number of EFA interfaces dedicated to
            low-latency, high-throughput inter-node communication without encountering IP exhaustion,
            and to enable it you specify efa-only in the ClusterNetworkInterface configuration when
            creating or updating the cluster{' '}
            <SourceRef provenance="documented" doc={docs.efaOnlyNews} />.
          </Box>
          <Alert type="info" header="EC2 shipped this capability roughly 20 months before HyperPod exposed it">
            The EFA-only interface type was introduced at the EC2 layer in October 2024. HyperPod
            surfaced it on CreateCluster and UpdateCluster in June 2026{' '}
            <SourceRef provenance="documented" doc={docs.efaOnlyNews} />. The device-level difference
            between the two interface types is covered in the EFA device section of this dive. What
            HyperPod adds is the ability to choose per instance group.
          </Alert>
          <Box variant="p">
            The security group rule is the same one every EFA cluster needs, and HyperPod restates
            it: to create a HyperPod cluster with EFA-enabled instances, set up a security group to
            allow all inbound and outbound traffic to and from the security group itself{' '}
            <SourceRef provenance="documented" doc={docs.faqSlurm} />.
          </Box>

          <Box variant="h3">The AMI contract</Box>
          <Box variant="p">
            This is what makes HyperPod different from every other SageMaker surface. EFA is one of
            five components covered by a published AMI support policy, alongside the NVIDIA driver,
            NCCL through aws-ofi-nccl, CUDA and the OS kernel. AWS states that major AMI releases
            involve upgrading those core components to new major versions and may introduce breaking
            changes that require workload validation, and it publishes the support windows: 12 months
            for a major version, 6 months for a minor version, and until the next patch for a patch
            version{' '}
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
          <Alert type="warning" header="The support policy does not cover custom AMIs">
            AWS answers the question directly on the policy page: does this policy apply to custom
            AMIs, no{' '}
            <SourceRef provenance="documented" doc={docs.amiPolicy} />. If you build a custom AMI you
            own the EFA installer version, the NCCL build and the driver, and you own keeping them
            consistent with the cluster software.
          </Alert>

          <ExpandableSection
            headerText="Three AWS pages disagree about the HyperPod base operating system"
            headerDescription="Presented rather than silently resolved, per the source-authority standard"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The AMI overview page says the enhancements are built on the AWS Deep Learning Base
                GPU AMI on Ubuntu 20.04 for Slurm, and an Amazon Linux 2 or Amazon Linux 2023 AMI for
                EKS{' '}
                <SourceRef provenance="documented" doc={docs.amiBase} />. The Slurm release notes say
                the AMIs are built on the AWS Deep Learning Base GPU AMI on Ubuntu 22.04, and
                document a migration from 20.04 to 22.04 on May 13, 2025{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />.
              </Box>
              <Box variant="p">
                The release notes are the more current of the two, because they carry the dated
                migration entry. Use them. The overview page is stale on this point.
              </Box>
              <Box variant="p">
                An older Slurm release note is still useful for a different reason: it documents the
                compiled NCCL version per CUDA directory, for example NCCL 2.27.5 built against CUDA
                12.8{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />. That mapping is what you
                check against torch.cuda.nccl.version() when a container and a host disagree.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="h3">Deep health checks reach the fabric</Box>
          <Box variant="p">
            HyperPod publishes an inventory of what its deep health checks run. Instance-level checks
            cover GPU and NVLink counts, DCGM (Data Center GPU Manager) diagnostics at level 4
            including additional memory tests, Neuron sysfs counters and a Neuron hardware check on
            Trainium, and one network check: EFA, on both GPU and Trainium instances, which runs
            latency and bandwidth benchmarking on the attached EFA device. Cluster-level checks run
            an NCCL test across multiple GPUs, and an NCCOM test across multiple Trainium nodes{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />.
          </Box>
          <Box variant="p">
            That is the strongest evidence anywhere in SageMaker that EFA is a first-class managed
            concern. AWS benchmarks the device before your work lands on it, and it publishes what
            both outcomes look like.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{HEALTH_LOG_SNIPPET}</pre>
          </Box>
          <Box variant="p">
            Both log samples are quoted from the deep health checks page{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />. The failure is a fabric
            bandwidth threshold failure, not a GPU failure: expected minimum 80, NCCL test output 30.
            Cluster-level results land in CloudWatch under the cluster log group, and instance-level
            results in /var/log/aws/clusters/sagemaker-deep-health-check.log on each node. You can
            also trigger a run on demand with the StartClusterHealthCheck API{' '}
            <SourceRef provenance="documented" doc={docs.deepHealth} />.
          </Box>
          <Alert type="warning" header="The check costs about two hours per new instance">
            AWS states that a new instance goes through the deep health check process, which is
            instance-level stress testing, for about a couple of hours, and recommends disabling deep
            health checks after cluster creation when you have no spare capacity, because that delay
            slows node replacement{' '}
            <SourceRef provenance="documented" doc={docs.configTips} />. That is a real trade: you
            are choosing between verified fabric health and faster recovery.
          </Alert>
          <Alert type="info" header="Two more scoping rules on the checks">
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
            the system inspects all instance groups and their associated instance types, identifies
            the GPU communication characteristics of each, and configures Slurm with the appropriate
            topology plugin, automatically and without configuration{' '}
            <SourceRef provenance="documented" doc={docs.topology} />. The topology-aware scheduling
            launch says the same: enabled by default, requires no configuration{' '}
            <SourceRef provenance="documented" doc={docs.topoNews} />.
          </Box>
          <Box variant="p">
            The plugin choice follows the hardware. The tree plugin covers hierarchical interconnects
            including ml.p5.48xlarge, ml.p5e.48xlarge and ml.p5en.48xlarge, and the block plugin
            covers UltraServer types such as ml.p6e-gb200.36xlarge. The file format follows the Slurm
            version: topology.yaml on Slurm 25.11 and later, topology.conf on Slurm 24.x{' '}
            <SourceRef provenance="documented" doc={docs.topology} />. The full topology material,
            including the generated file formats and the EC2 network node identifiers behind them, is
            in the topology section of this dive.
          </Box>
          <Alert type="warning" header="One non-topology instance group demotes the whole cluster">
            AWS states the resolution rule plainly: if any non-topology compute group is present,
            flat is the default{' '}
            <SourceRef provenance="documented" doc={docs.topology} />. A single instance group of a
            type without network topology support silently removes topology-aware placement from the
            cluster default. Nothing fails. Jobs just stop being placed with fabric locality in mind.
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
            On Slurm the mechanism is a SageMaker plugin built on the SPANK framework, which inspects
            cluster health when a job fails, removes a faulty node, replaces it and restarts the job{' '}
            <SourceRef provenance="documented" doc={docs.eksHpBlog} />. On EKS it is a job auto-resume
            capability built on the Kubeflow Training Operator for PyTorch, where the extension makes
            the job wait and restart after the node is replaced{' '}
            <SourceRef provenance="documented" doc={docs.eksHpBlog} />. The Slurm idiom AWS publishes
            in its own batch scripts is short.
          </Box>
          <Box variant="code">
            <pre style={preStyle}>{AUTO_RESUME_SNIPPET}</pre>
          </Box>
          <Box variant="p">
            Quoted from an AWS pre-training walkthrough{' '}
            <SourceRef provenance="documented" doc={docs.mathstral} />.
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
                This matters for the fabric specifically. A requeue instead of an in-place resume
                means placement is recomputed, so the job can land on a different set of nodes with
                different fabric locality. A long run that quietly requeues twice can end up with
                worse collective performance than it started with, for reasons that have nothing to
                do with your code.
              </Box>
            </SpaceBetween>
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
                EFA reaches pods through one of two models. The EFA device plugin advertises an
                integer count of vpc.amazonaws.com/efa extended resources, works on all EKS-supported
                versions, and allocates each EFA device exclusively to one pod with no sharing. The
                EFA DRA (Dynamic Resource Allocation) driver requires Kubernetes 1.34, advertises
                rich attributes through a ResourceSlice including device type, topology and PCIe
                locality, and does allow multiple pods to share a device through a shared
                ResourceClaim{' '}
                <SourceRef provenance="documented" doc={docs.eksEfa} />.
              </Box>
              <Box variant="p">
                The DRA model is the one that lets you pin an EFA device to the same PCIe root as the
                GPU it serves, using a matchAttribute constraint on resource.kubernetes.io/pcieRoot{' '}
                <SourceRef provenance="documented" doc={docs.eksEfa} />. The EKS integration section
                of this dive covers both models in more detail.
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

          <Alert type="warning" header="EFA metrics on HyperPod are opt-in">
            HyperPod cluster metrics include a Network category sourced from an EFA Exporter that is
            not enabled by default and belongs to the advanced observability mode{' '}
            <SourceRef provenance="documented" doc={docs.observability} />. Teams debugging a fabric
            problem frequently discover mid-incident that the exporter was never running. Turn it on
            before you need it.
          </Alert>
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
            ml.p6-b300.48xlarge. Other instance types are not supported{' '}
            <SourceRef provenance="documented" doc={docs.dpd} />. The worker image must include vLLM,
            LMCache, NVIDIA NIXL and the EFA libfabric provider, and the feature needs HyperPod
            Inference Operator version 3.2 or later{' '}
            <SourceRef provenance="documented" doc={docs.dpd} />.
          </Box>
          <Box variant="p">
            The launch note adds the orchestrator constraint: the feature is enabled by adding a
            pdSpec section to the existing InferenceEndpointConfig custom resource, and is available
            for HyperPod clusters using the EKS orchestrator on EFA-capable instance types{' '}
            <SourceRef provenance="documented" doc={docs.dpdNews} />. HyperPod inference generally
            supports both single-node and multi-node inference architectures, with a two-tier key
            value cache: an L1 cache in CPU memory for local reuse and an L2 cache in Redis for
            node-level sharing{' '}
            <SourceRef provenance="documented" doc={docs.hpDeploy} />.
          </Box>
          <Box variant="p">
            The AWS blog describes the transport as a four-layer stack that HyperPod composes end to
            end, LMCache PD then NIXL then libfabric then EFA, where NIXL provides a unified memory
            abstraction across GPU, CPU and remote peers and selects the right RDMA operation, and the
            libfabric provider exposes EFA as kernel-bypass GPUDirect RDMA, keeping the host CPU off
            the data path{' '}
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
                <SourceRef provenance="documented" doc={docs.dpdBlog} />. That is the same
                Availability Zone boundary EFA has everywhere else, arriving in an inference
                deployment where people do not expect it.
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

          <Alert type="info" header="Below the routing threshold, EFA is the wrong answer">
            The blog states the trade directly: below the routing threshold, the fixed cost of
            transferring the key value cache over EFA RDMA outweighs the benefit of isolating decode,
            so the router sends those requests straight to a decoder{' '}
            <SourceRef provenance="documented" doc={docs.dpdBlog} />. Available routing strategies are
            prefixaware, kvaware, session and roundrobin. The system is designed to not use the
            fabric when the transfer is too small to pay for itself.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Negative results, stated at the strength the evidence supports and no stronger."
          >
            Where EFA is not used
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            These are the most useful findings in this section, because they are the ones you cannot
            get by reading a feature page. Each is stated as documented absence of control, which is
            what the evidence supports, rather than as an AWS statement of non-support, which no
            source provides.
          </Box>

          <Box variant="p">
            <StatusIndicator type="error">
              Managed real-time inference endpoints: no EFA control exists in the API.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            ProductionVariant, the compute block of CreateEndpointConfig, has these members:
            VariantName, AcceleratorType which is deprecated, CapacityReservationConfig,
            ContainerStartupHealthCheckTimeoutInSeconds, CoreDumpConfig, EnableSSMAccess,
            InferenceAmiVersion, InitialInstanceCount, InitialVariantWeight, InstancePools,
            InstanceType, plus routing and scaling fields. There is no EFA field, and no field for
            sharding one model across instances{' '}
            <SourceRef provenance="documented" doc={docs.productionVariant} />. InferenceAmiVersion
            enumerates the managed inference images by NVIDIA driver, CUDA and container toolkit
            version only. No EFA, libfabric or aws-ofi-nccl stack appears in any of those image
            descriptions{' '}
            <SourceRef provenance="documented" doc={docs.productionVariant} />.
          </Box>
          <Box variant="p">
            InstancePools looks like multi-node until you read the definition. AWS documents it as a
            list of instance pools, each specifying an instance type and its priority for
            provisioning, used to configure heterogeneous endpoints that deploy models across
            multiple instance types, capped at five entries{' '}
            <SourceRef provenance="documented" doc={docs.productionVariant} />. The launch note makes
            the intent unambiguous: when preferred instance types have insufficient capacity,
            SageMaker AI automatically provisions from the next available option in the list{' '}
            <SourceRef provenance="documented" doc={docs.instFallback} />. It is capacity fallback,
            not model sharding.
          </Box>
          <Box variant="p">
            Inference components allocate accelerators inside one instance.
            ComputeResourceRequirements takes MinMemoryRequiredInMb, NumberOfCpuCoresRequired and
            NumberOfAcceleratorDevicesRequired, and scaling happens by copies, which are independent
            replicas rather than shards of one model{' '}
            <SourceRef provenance="documented" doc={docs.realtime} />. The AWS guidance for large
            foundation models on endpoints is explicitly within-instance: it is suitable for models
            that cannot fit into a single accelerator's memory and therefore need multiple
            accelerators in an instance{' '}
            <SourceRef provenance="documented" doc={docs.scaleFm} />.
          </Box>

          <Alert type="info" header="The honest limit on this negative result">
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
            <StatusIndicator type="warning">
              Multi-model endpoints: restricted to CPU and single-GPU instance types.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            AWS states that multi-model endpoints are currently supported for all CPU instance types
            and on single-GPU instance types{' '}
            <SourceRef provenance="documented" doc={docs.mme} />. A single-GPU instance has no
            multi-GPU collective to run, so the question of EFA does not arise.
          </Box>

          <Box variant="p">
            <StatusIndicator type="warning">
              SMDDP on modern instances: not an option at all.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            Covered above. P3dn, P4d and P4de only, with AllGather limited to P4{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />.
          </Box>

          <Box variant="p">
            <StatusIndicator type="info">
              SageMaker model parallelism for inference: no AWS source describes it.
            </StatusIndicator>
          </Box>
          <Box variant="p">
            SMP v2 is a training library. Its relationship to EFA is mediated by SMDDP or by NCCL
            over aws-ofi-nccl. The compatibility page that connects the two is a training page, and
            it repeats the instance restriction: the SMDDP library supports P4 and P4de instances{' '}
            <SourceRef provenance="documented" doc={docs.smpSmddp} />. Treat SMP for inference as
            undocumented rather than unsupported.
          </Box>

          <ExpandableSection
            headerText="A useful contrast: Amazon runs multi-node EFA inference, just not behind a SageMaker endpoint"
            headerDescription="The Rufus deployment, on Amazon ECS with Trainium"
          >
            <Box variant="p">
              AWS describes Rufus running multi-node inference on Trainium where cross-node
              collectives such as all gather and all reduce are managed by the Neuron Distributed
              Inference library, which uses EFA to deliver high-bandwidth, low-latency inter-node
              communication, with model inputs broadcast separately on CPU over standard TCP
              connections using the Gloo backend{' '}
              <SourceRef provenance="documented" doc={docs.rufus} />. That deployment runs on Amazon
              ECS, not on SageMaker endpoints. The pattern exists at Amazon scale. The managed
              endpoint product does not expose it.
            </Box>
          </ExpandableSection>
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
            FI_PROVIDER to be set and FI_EFA_USE_DEVICE_RDMA not to be. On anything newer, expect to
            set both yourself.
          </Box>
          <Box variant="p">
            <strong>Step 2. Use an AWS Deep Learning Container rather than your own image.</strong>{' '}
            The DLC already contains libfabric, aws-ofi-nccl, a matching NCCL, OpenMPI, the
            /etc/nccl.conf defaults and a compiled all_reduce_perf{' '}
            <SourceRef provenance="code-derived" code={code.dlcNcclTests} />. Building your own image
            means owning three footguns described above, and the version-match rule against
            torch.cuda.nccl.version(){' '}
            <SourceRef provenance="documented" doc={docs.trainEfa} />.
          </Box>
          <Box variant="p">
            <strong>Step 3. Get the network right before you submit.</strong> Two rules. The
            security group must allow all inbound and outbound traffic to and from itself{' '}
            <SourceRef provenance="documented" doc={docs.ddpSupport} />. And keep instances, subnet
            and data in the same Region and Availability Zone to reduce communication overhead{' '}
            <SourceRef provenance="documented" doc={docs.distStart} />. You do not choose the
            placement: SageMaker puts one job's instances in a single subnet, therefore a single
            Availability Zone{' '}
            <SourceRef provenance="documented" doc={docs.capacity} />.
          </Box>
          <Box variant="p">
            <strong>Step 4. Submit with at least two instances, then read the log.</strong> One
            instance proves nothing about a fabric. Set NCCL_DEBUG to INFO, which the DLC already
            does through /etc/nccl.conf{' '}
            <SourceRef provenance="code-derived" code={code.dlcNcclConf} />, and grep the CloudWatch
            log for the four signatures from the verification section. If aws-ofi-nccl appears but
            NET/OFI Selected provider is efa does not, the plugin loaded and the provider did not get
            chosen. That is the failure the allowlist causes.
          </Box>
          <Box variant="p">
            <strong>Step 5. Decide whether you needed a training job at all.</strong> If the answer
            to the next section is HyperPod, the earlier you move the cheaper it is, because the job
            script, the container and the verification steps carry over while the cluster lifecycle
            does not.
          </Box>

          <Alert type="warning" header="Documentation staleness signal worth knowing about">
            As of August 1, 2026, the SageMaker distributed training getting-started page still says
            that to achieve the most performant distributed training job in SageMaker AI, AWS
            recommends P4d and P4de instances equipped with NVIDIA A100 GPUs{' '}
            <SourceRef provenance="documented" doc={docs.distStart} />. That recommendation is two or
            more GPU generations behind the instance types the same API accepts{' '}
            <SourceRef provenance="documented" doc={docs.resourceConfig} />. It lines up with the
            SDK allowlist stopping at P5 and with SMDDP stopping at P4de. The SageMaker distributed
            training documentation set has a P4-era center of gravity. Read the API reference and the
            code for anything newer.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The choice is about who owns the fabric and how long the cluster lives, not about performance."
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
                repair with automatic restart from your last checkpoint, and you pay nothing for the
                repair itself{' '}
                <SourceRef provenance="documented" doc={docs.repair} />. You give up topology control
                and any published fabric benchmark.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Pick HyperPod <Badge color="green">long runs, large clusters</Badge>
              </Box>
              <Box variant="p">
                Runs measured in days or weeks, node counts where a single bad EFA device costs real
                money, and teams that want the fabric benchmarked before work lands on it{' '}
                <SourceRef provenance="documented" doc={docs.deepHealth} />. You accept a standing
                cluster, roughly two hours of deep health checks per new node{' '}
                <SourceRef provenance="documented" doc={docs.configTips} />, and the Slurm 25.11
                auto-resume defect if you are on that version{' '}
                <SourceRef provenance="documented" doc={docs.amiSlurm} />.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="The tie-breaker nobody weighs early enough">
            If you will later serve the model with multi-node inference, HyperPod on the EKS
            orchestrator is the only SageMaker surface where that exists, through the Inference
            Operator's disaggregated prefill and decode feature{' '}
            <SourceRef provenance="documented" doc={docs.dpdNews} />. Choosing a training job today
            is also choosing to move platforms before you serve. That is a bigger decision than the
            training comparison above.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
