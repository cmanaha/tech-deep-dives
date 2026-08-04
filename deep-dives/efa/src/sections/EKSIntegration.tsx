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
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * EFA on Amazon EKS: the AMI, the device layer and the pod contract.
 *
 * Sourcing rule for this file (deep-dives/efa/revamp/source-authority-standard.md):
 * every load-bearing claim carries a SourceRef. 'documented' means AWS states it.
 * 'code-derived' means it was read out of an implementation at a pinned commit or
 * release tag and AWS documents nothing. 'doc-code-conflict' means the two
 * disagree and the code wins. Nothing is laundered between categories.
 *
 * Every code reference below is pinned to a commit SHA or a release tag. The
 * ci.sh pinned-refs gate rejects branch references.
 */

const ACCESSED = '2026-08-01';
const READ = '2026-08-01';

const EKS_DOC = 'https://docs.aws.amazon.com/eks/latest/userguide/';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';
const BATCH_DOC = 'https://docs.aws.amazon.com/batch/latest/userguide/';

/** Pinned refs. Read 2026-08-01. */
const AMI_SHA = 'ac5f340c56a9a6943808c9201da87adec9edb1da';
const DRANET_CHART_SHA = 'c043cef46c7e50a71094e50b43b8225322a750ff';
const EFA_CHART_SHA = 'bfe91c4b9257c80f754ad4b3d6a9a3c239b2b8ec';
const NVDP_NEW = 'v0.19.0';
const NVDP_OLD = 'v0.18.2';
const CTK_TAG = 'v1.19.1';
const K8S_TAG = 'v1.34.0';
const DRANET_SHIPPED = 'v1.2.0';
const DRANET_LATEST = 'v1.4.0';
const BR_KERNEL_TAG = 'v7.2.1';
const BR_CORE_TAG = 'v15.0.0';
const BOTOCORE_TAG = '1.43.62';
const CKPT_SHA = '08c4ff60ef06cfe2a659f4ea38c342c81fd86410';
const RECIPES_SHA = '20ea8f4551cd540b5b023b25d41ab414b16fe493';
const DO_EKS_SHA = '1542b55051b3ffc17fe91a796cf5700ed4d82c24';
const ADAI_SHA = 'cb99a28a85c8333ddbad004221230dac967ddbab';
const KARPENTER_SHA = '4b2a2049469190a8a379668794e053207464b740';
const EKSCTL_SHA = 'a5cb648e5bd6245a80e6b62b8817ce6fa1e6d7cd';
const AI_ON_EKS_SHA = '5e6282cb121f423e734caccb550a9f61c2935584';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });
const ref = (repo: string, r: string, path: string, lines?: string): CodeRef => ({
  repo,
  ref: r,
  path,
  lines,
  read: READ,
});

const docs = {
  eksDevice: doc(
    'EKS User Guide: Manage EFA devices on Amazon EKS',
    `${EKS_DOC}device-management-efa.html`,
    1
  ),
  eksNode: doc(
    'EKS User Guide: Run machine learning training on Amazon EKS with EFA',
    `${EKS_DOC}node-efa.html`,
    1
  ),
  eksAmi: doc(
    'EKS User Guide: Use EKS-optimized accelerated AMIs',
    `${EKS_DOC}ml-eks-optimized-ami.html`,
    1
  ),
  eksAmiBuild: doc(
    'EKS User Guide: Build a custom EKS-optimized Amazon Linux AMI',
    `${EKS_DOC}eks-ami-build-scripts.html`,
    1
  ),
  eksNodeClass: doc(
    'EKS User Guide: Create a Node Class (static network interface configuration)',
    `${EKS_DOC}create-node-class.html`,
    1
  ),
  eksNvidia: doc(
    'EKS User Guide: Manage NVIDIA GPU devices on Amazon EKS',
    `${EKS_DOC}device-management-nvidia.html`,
    1
  ),
  efaStart: doc('EC2 User Guide: Get started with EFA and MPI', `${EC2_DOC}efa-start.html`, 1),
  efaAcc: doc(
    'EC2 User Guide: Maximize network bandwidth on instances with multiple network cards',
    `${EC2_DOC}efa-acc-inst-types.html`,
    1
  ),
  batchMnp: doc('AWS Batch User Guide: Multi-node parallel jobs', `${BATCH_DOC}multi-node-parallel-jobs.html`, 1),
  batchMnpCe: doc(
    'AWS Batch User Guide: Compute environment considerations for multi-node parallel jobs',
    `${BATCH_DOC}mnp-ce.html`,
    1
  ),
  batchEks: doc('AWS Batch User Guide: Amazon EKS compute environments', `${BATCH_DOC}eks.html`, 1),
  amiRelease: doc(
    'awslabs/amazon-eks-ami release v20260728 (per-variant package tables)',
    'https://github.com/awslabs/amazon-eks-ami/releases/tag/v20260728',
    1
  ),
  installer: doc(
    'aws-efa-installer 1.49.0 tarball (efa_installer.sh, package_list.txt, env.sh)',
    'https://efa-installer.amazonaws.com/aws-efa-installer-1.49.0.tar.gz',
    1
  ),
  karpenterNodeClass: doc('Karpenter documentation: EC2NodeClass', 'https://karpenter.sh/docs/concepts/nodeclasses/', 1),
  aiOnEks: doc('AI on EKS blueprints', 'https://awslabs.github.io/ai-on-eks/', 1),
};

const code = {
  installEfa: ref('awslabs/amazon-eks-ami', AMI_SHA, 'templates/al2023/provisioners/install-efa.sh', 'L53'),
  installEfaGuard: ref('awslabs/amazon-eks-ami', AMI_SHA, 'templates/al2023/provisioners/install-efa.sh', 'L6-L8'),
  installEfaPeermem: ref(
    'awslabs/amazon-eks-ami',
    AMI_SHA,
    'templates/al2023/provisioners/install-efa.sh',
    'L63-L65'
  ),
  amiVars: ref('awslabs/amazon-eks-ami', AMI_SHA, 'templates/al2023/variables-default.json', 'L17'),
  brKmod: ref(
    'bottlerocket-os/bottlerocket-kernel-kit',
    BR_KERNEL_TAG,
    'packages/kmod-6.18-efa/kmod-6.18-efa.spec',
    'L1-L29'
  ),
  brRdma: ref('bottlerocket-os/bottlerocket-core-kit', BR_CORE_TAG, 'packages/rdma-core/rdma-core.spec', 'L109-L125'),
  efaChart: ref('aws/eks-charts', EFA_CHART_SHA, 'stable/aws-efa-k8s-device-plugin/Chart.yaml'),
  efaDs: ref('aws/eks-charts', EFA_CHART_SHA, 'stable/aws-efa-k8s-device-plugin/templates/daemonset.yaml', 'L60-L64'),
  efaValues: ref('aws/eks-charts', EFA_CHART_SHA, 'stable/aws-efa-k8s-device-plugin/values.yaml'),
  dranetChart: ref('aws/eks-charts', DRANET_CHART_SHA, 'stable/aws-dranet/Chart.yaml'),
  dranetValues: ref('aws/eks-charts', DRANET_CHART_SHA, 'stable/aws-dranet/values.yaml', 'L313-L328'),
  dranetDs: ref('aws/eks-charts', DRANET_CHART_SHA, 'stable/aws-dranet/templates/daemonset.yaml', 'L33-L66'),
  k8sAttr: ref(
    'kubernetes/kubernetes',
    K8S_TAG,
    'staging/src/k8s.io/dynamic-resource-allocation/deviceattribute/attribute.go',
    'L23-L33'
  ),
  dranetDb: ref('kubernetes-sigs/dranet', DRANET_SHIPPED, 'pkg/inventory/db.go', 'L290'),
  dranetBench: ref('kubernetes-sigs/dranet', DRANET_LATEST, 'site/content/docs/user/aws-eks-efa.md', 'L109-L118'),
  nvdpNew: ref('NVIDIA/k8s-device-plugin', NVDP_NEW, 'cmd/nvidia-device-plugin/main.go', 'L116-L121'),
  nvdpOld: ref('NVIDIA/k8s-device-plugin', NVDP_OLD, 'cmd/nvidia-device-plugin/main.go', 'L114-L118'),
  nvdpCdi: ref('NVIDIA/k8s-device-plugin', NVDP_NEW, 'internal/cdi/cdi.go', 'L154-L156'),
  mofed: ref('NVIDIA/nvidia-container-toolkit', CTK_TAG, 'internal/discover/mofed.go', 'L25-L36'),
  batchModel: ref('boto/botocore', BOTOCORE_TAG, 'botocore/data/batch/2016-08-10/service-2.json'),
  ckptJob: ref(
    'aws/sagemaker-hyperpod-checkpointless-training',
    CKPT_SHA,
    'examples/llama3/launch/pretrain_llama3_70b_p5.yaml',
    'L34-L59'
  ),
  recipes: ref(
    'aws/sagemaker-hyperpod-recipes',
    RECIPES_SHA,
    'launcher/nemo/k8s_templates/training/training.yaml',
    'L78-L81'
  ),
  doEks: ref(
    'aws-samples/aws-do-eks',
    DO_EKS_SHA,
    'Container-Root/eks/deployment/inference/agentic-ai/nemotron/ultra/agg/lws.yaml-template',
    'L30-L31'
  ),
  ncclTests: ref('awslabs/awsome-distributed-ai', ADAI_SHA, 'micro-benchmarks/nccl-tests/kubernetes/nccl-tests.yaml'),
  ncclGb200: ref(
    'awslabs/awsome-distributed-ai',
    ADAI_SHA,
    'micro-benchmarks/nccl-tests/kubernetes/nccl-tests-gb200.yaml'
  ),
  ncclDockerfile: ref('awslabs/awsome-distributed-ai', ADAI_SHA, 'micro-benchmarks/nccl-tests/nccl-tests.Dockerfile'),
  karpenterDesign: ref('aws/karpenter-provider-aws', KARPENTER_SHA, 'designs/efa-for-static-capacity.md'),
  eksctlDocs: ref('eksctl-io/eksctl', EKSCTL_SHA, 'userdocs/src/usage/nodegroup-managed.md'),
  aiOnEksTf: ref('awslabs/ai-on-eks', AI_ON_EKS_SHA, 'infra/base/terraform/eks.tf'),
};

/**
 * Diagram 1. The layer cake. The single idea the whole section hangs on:
 * the host owns the hardware plane, the container image owns the fabric stack.
 * Idiom A (class-name prefix "lc-"), painted light ground so it survives dark mode.
 */
function LayerCakeDiagram() {
  const bands = [
    {
      label: 'Container image',
      sub: 'your Dockerfile',
      lines: [
        'libfabric, Open MPI, aws-ofi-nccl, NCCL, then PyTorch or SGLang on top.',
        'This is the only layer on the whole node that has libfabric on it.',
      ],
      owner: 'You',
      tone: 'you',
    },
    {
      label: 'Pod spec',
      sub: 'your manifest',
      lines: [
        'resources.requests and resources.limits carry vpc.amazonaws.com/efa: N,',
        'plus hugepages-2Mi where the instance pre-allocates huge pages.',
      ],
      owner: 'You',
      tone: 'you',
    },
    {
      label: 'Cluster add-on',
      sub: 'one helm install',
      lines: [
        'EFA device plugin DaemonSet, or the aws-dranet DaemonSet. Reads',
        '/dev/infiniband on the host and publishes what it finds to the scheduler.',
      ],
      owner: 'You, once per cluster',
      tone: 'addon',
    },
    {
      label: 'Node operating system',
      sub: 'EKS-optimized AMI',
      lines: [
        'efa kernel driver, efa-config, efa-nv-peermem, full rdma-core userspace.',
        'libfabric, MPI, aws-ofi-nccl and the /opt/amazon/efa wiring all come from row 1.',
      ],
      owner: 'The AMI build',
      tone: 'ami',
    },
    {
      label: 'Launch configuration',
      sub: 'how the NICs attach',
      lines: [
        'One ENA interface on network card 0, efa-only interfaces on the rest.',
        'Written by eksctl, a launch template, an EC2NodeClass or a NodeClass.',
      ],
      owner: 'You, at node creation',
      tone: 'you',
    },
    {
      label: 'EC2 instance',
      sub: 'the hardware',
      lines: [
        'A Nitro card and N network cards. Every EFA interface you attached shows',
        'up as one more /dev/infiniband/uverbs device node on the host.',
      ],
      owner: 'AWS',
      tone: 'aws',
    },
  ];

  return (
    <svg viewBox="0 0 900 524" role="img" aria-labelledby="eks-layer-cake-title" style={{ width: '100%', height: 'auto' }}>
      <title id="eks-layer-cake-title">
        The EKS node image supplies only the EFA kernel driver and the rdma-core userspace, so libfabric,
        Open MPI, aws-ofi-nccl and NCCL exist nowhere on the host and must come from the container image
        instead. The device plugin or DRA driver sits between those two halves and does nothing except
        count device nodes and hand them to a pod.
      </title>
      <style>
        {`
          .lc-hd { fill: #5f6b7a; font: 600 11px sans-serif; }
          .lc-lbl { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .lc-body { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .lc-lt { fill: #0f1b2a; font: 600 13px sans-serif; }
          .lc-ls { fill: #5f6b7a; font: 10px sans-serif; }
          .lc-txt { fill: #0f1b2a; font: 11px sans-serif; }
          .lc-own { font: 10px sans-serif; text-anchor: middle; }
          .lc-you { fill: #fff8f0; stroke: #b25c00; stroke-width: 1.5; }
          .lc-yout { fill: #7d3f00; }
          .lc-addon { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .lc-addont { fill: #065299; }
          .lc-ami { fill: #f2f8f5; stroke: #037f0c; stroke-width: 1.5; }
          .lc-amit { fill: #025c08; }
          .lc-aws { fill: #f4f4f4; stroke: #5f6b7a; stroke-width: 1.5; }
          .lc-awst { fill: #414d5c; }
          .lc-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="900" height="524" rx="8" fill="#ffffff" />

      <text className="lc-hd" x="25" y="30">
        Layer
      </text>
      <text className="lc-hd" x="222" y="30">
        What is actually in it
      </text>
      <text className="lc-hd" x="704" y="30">
        Who puts it there
      </text>

      {bands.map((band, index) => {
        const y = 48 + index * 72;
        return (
          <g key={band.label}>
            <rect className="lc-lbl" x="25" y={y} width="185" height="64" rx="6" />
            <text className="lc-lt" x="39" y={y + 28}>
              {band.label}
            </text>
            <text className="lc-ls" x="39" y={y + 46}>
              {band.sub}
            </text>

            <rect className="lc-body" x="222" y={y} width="470" height="64" rx="6" />
            {band.lines.map((line, lineIndex) => (
              <text className="lc-txt" key={line} x="238" y={y + 27 + lineIndex * 19}>
                {line}
              </text>
            ))}

            <rect className={`lc-${band.tone}`} x="704" y={y} width="172" height="64" rx="6" />
            <text className={`lc-own lc-${band.tone}t`} x="790" y={y + 37}>
              {band.owner}
            </text>
          </g>
        );
      })}

      <text className="lc-cap" x="450" y="496">
        Row 4 and row 1 both get called the EFA stack. Row 4 holds the kernel driver and rdma-core only.
      </text>
      <text className="lc-cap" x="450" y="514">
        The AMI build runs efa_installer.sh with the --minimal flag, which is why the split falls exactly there.
      </text>
    </svg>
  );
}

/**
 * Diagram 2. What the --minimal flag actually withholds. Four package families,
 * not the two the AWS documentation names.
 * Idiom A (class-name prefix "mn-").
 */
function MinimalFlagDiagram() {
  const rows = [
    { name: 'efa kernel driver (efa-3.1.0-1.amzn2023)', kept: true },
    { name: 'efa-config', kept: true },
    { name: 'efa-nv-peermem', kept: true },
    { name: 'rdma-core suite (ibv_devinfo, pyverbs, devel, diags)', kept: true },
    { name: 'libfabric-aws into /opt/amazon/efa', kept: false },
    { name: 'openmpi40-aws and openmpi50-aws', kept: false },
    { name: 'libnccl-ofi, the aws-ofi-nccl plugin', kept: false },
    { name: 'efa-profile (profile.d and ld.so.conf entries)', kept: false },
  ];

  return (
    <svg viewBox="0 0 900 520" role="img" aria-labelledby="eks-minimal-title" style={{ width: '100%', height: 'auto' }}>
      <title id="eks-minimal-title">
        The minimal flag on the EFA installer withholds four package families rather than the two that
        AWS documentation names, so an EKS node ends up with the EFA kernel driver and a complete
        rdma-core userspace but no libfabric, no MPI, no aws-ofi-nccl plugin and no profile wiring.
      </title>
      <style>
        {`
          .mn-col { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .mn-ct { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .mn-cs { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .mn-keep { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .mn-drop { fill: #f7f7f7; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .mn-kt { fill: #0f1b2a; font: 11px sans-serif; }
          .mn-dt { fill: #8d99a8; font: 11px sans-serif; }
          .mn-note { fill: #fff8f0; stroke: #b25c00; stroke-width: 1.5; }
          .mn-nt { fill: #7d3f00; font: 11px sans-serif; }
          .mn-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="900" height="520" rx="8" fill="#ffffff" />

      <rect className="mn-col" x="30" y="42" width="400" height="44" rx="6" />
      <text className="mn-ct" x="230" y="64">
        efa_installer.sh -y
      </text>
      <text className="mn-cs" x="230" y="79">
        the full install, what a container image usually runs
      </text>

      <rect className="mn-col" x="470" y="42" width="400" height="44" rx="6" />
      <text className="mn-ct" x="670" y="64">
        efa_installer.sh --minimal -y
      </text>
      <text className="mn-cs" x="670" y="79">
        what the EKS AL2023 AMI build runs
      </text>

      {rows.map((row, index) => {
        const y = 100 + index * 38;
        return (
          <g key={row.name}>
            <rect className="mn-keep" x="30" y={y} width="400" height="32" rx="5" />
            <text className="mn-kt" x="44" y={y + 21}>
              {row.name}
            </text>

            <rect className={row.kept ? 'mn-keep' : 'mn-drop'} x="470" y={y} width="400" height="32" rx="5" />
            <text className={row.kept ? 'mn-kt' : 'mn-dt'} x="484" y={y + 21}>
              {row.name}
            </text>
          </g>
        );
      })}

      <rect className="mn-note" x="30" y="418" width="840" height="52" rx="6" />
      <text className="mn-nt" x="46" y="441">
        The four dashed rows are the exact exclusion list in the installer: libfabric, openmpi, libnccl-ofi and efa-profile.
      </text>
      <text className="mn-nt" x="46" y="459">
        Your container image has to supply all four. AWS documentation for the flag names only the first two.
      </text>

      <text className="mn-cap" x="450" y="492">
        NCCL sits outside the installer in both modes, so its absence from the node has a different cause.
      </text>
      <text className="mn-cap" x="450" y="510">
        Package names and versions read from aws-efa-installer 1.49.0.
      </text>
    </svg>
  );
}

/**
 * Diagram 3. Four ways to get EFA interfaces onto a node, converging on the
 * one thing the scheduler eventually sees.
 * Idiom A (class-name prefix "nl-").
 */
function NodeLanesDiagram() {
  const lanes = [
    {
      title: 'eksctl',
      key1: 'managedNodeGroups[]',
      key2: '.efaEnabled: true',
      chip: ['Attaches every interface as', 'type EFA, and installs the', 'device plugin for you.'],
    },
    {
      title: 'Managed node group',
      key1: 'Launch template',
      key2: 'NetworkInterfaces[]',
      chip: ['Full control of the mix.', 'Do not put SubnetId in the', 'launch template.'],
    },
    {
      title: 'Karpenter',
      key1: 'EC2NodeClass.spec',
      key2: '.networkInterfaces',
      chip: ['Added in v1.11. Editing it', 'drifts existing nodes. AWS', 'says no DRA driver here.'],
    },
    {
      title: 'EKS Auto Mode',
      key1: 'NodeClass.spec',
      key2: '.advancedNetworking',
      chip: ['No extra ENIs after launch.', 'No IPv6. AWS says no DRA', 'driver here either.'],
    },
  ];

  const stages = [
    [
      'EC2 attaches the interfaces at launch. Each EFA interface becomes a /dev/infiniband/uverbs device.',
      'The AMI already carries the efa kernel driver and rdma-core, so those device nodes work.',
    ],
    [
      'The EFA device plugin DaemonSet or the aws-dranet DaemonSet reads /dev/infiniband.',
      'Only one of the two may run on any given node.',
    ],
    [
      'Device plugin path: node Allocatable shows vpc.amazonaws.com/efa: N.',
      'DRA path: a ResourceSlice for driver dra.net under DeviceClass efa.networking.k8s.aws.',
    ],
  ];

  return (
    <svg viewBox="0 0 900 486" role="img" aria-labelledby="eks-node-lanes-title" style={{ width: '100%', height: 'auto' }}>
      <title id="eks-node-lanes-title">
        Four different node provisioning mechanisms write the same EC2 network interface configuration
        in four different places, and all four converge on one node level result, so the choice between
        them is about which limitations you accept rather than about what the pod eventually sees.
      </title>
      <style>
        {`
          .nl-lane { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .nl-lt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .nl-key { fill: #0972d3; font: 10px sans-serif; text-anchor: middle; }
          .nl-chip { fill: #f7f7f7; stroke: #879596; stroke-width: 1; }
          .nl-ct { fill: #414d5c; font: 9.5px sans-serif; }
          .nl-stage { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .nl-st { fill: #0f1b2a; font: 11px sans-serif; text-anchor: middle; }
          .nl-line { stroke: #5f6b7a; stroke-width: 2; fill: none; }
          .nl-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#nl-head); }
          .nl-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="nl-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="900" height="486" rx="8" fill="#ffffff" />

      {lanes.map((lane, index) => {
        const x = 20 + index * 220;
        const cx = x + 100;
        return (
          <g key={lane.title}>
            <rect className="nl-lane" x={x} y="20" width="200" height="150" rx="6" />
            <text className="nl-lt" x={cx} y="42">
              {lane.title}
            </text>
            <text className="nl-key" x={cx} y="62">
              {lane.key1}
            </text>
            <text className="nl-key" x={cx} y="76">
              {lane.key2}
            </text>
            <rect className="nl-chip" x={x + 10} y="86" width="180" height="72" rx="5" />
            {lane.chip.map((line, lineIndex) => (
              <text className="nl-ct" key={line} x={x + 20} y={104 + lineIndex * 16}>
                {line}
              </text>
            ))}
            <path className="nl-line" d={`M${cx},170 L${cx},194`} />
          </g>
        );
      })}

      <path className="nl-line" d="M120,194 L780,194" />
      <path className="nl-arr" d="M450,194 L450,218" />

      {stages.map((stage, index) => {
        const y = 218 + index * 78;
        return (
          <g key={stage[0]}>
            <rect className="nl-stage" x="150" y={y} width="600" height="54" rx="6" />
            {stage.map((line, lineIndex) => (
              <text className="nl-st" key={line} x="450" y={y + 23 + lineIndex * 18}>
                {line}
              </text>
            ))}
            {index < stages.length - 1 && <path className="nl-arr" d={`M450,${y + 54} L450,${y + 78}`} />}
          </g>
        );
      })}

      <text className="nl-cap" x="450" y="470">
        The Karpenter and Auto Mode exclusions are AWS support statements. Only the Auto Mode one is enforced by the charts.
      </text>
    </svg>
  );
}

interface ContractRow {
  item: string;
  status: string;
  detail: string;
}

const contractRows: ContractRow[] = [
  {
    item: 'vpc.amazonaws.com/efa in requests and limits',
    status: 'Required',
    detail:
      'It is a Kubernetes extended resource, so the request and the limit have to be equal. AWS sets both to the same number in every example it publishes.',
  },
  {
    item: 'hugepages-2Mi',
    status: 'Usually required',
    detail:
      'Required where the instance pre-allocates huge pages. AWS states that EC2 instances with the EFA driver installed pre-allocate 5128 2MiB huge pages. The GB200 reference manifest requests none at all, which is why the status reads usually.',
  },
  {
    item: 'libfabric, aws-ofi-nccl and NCCL in the image',
    status: 'Required',
    detail:
      'The split again: the node stops at rdma-core, so the image supplies these three. A missing aws-ofi-nccl shows up as NCCL silently falling back to sockets, so the job succeeds and runs slow.',
  },
  {
    item: 'hostNetwork: true',
    status: 'Device layer only',
    detail:
      'The EFA device plugin and aws-dranet DaemonSets set it. Workload pods reach EFA through injected device nodes on the pod network. Some AWS samples set it on workloads anyway; see the note below.',
  },
  {
    item: 'privileged: true',
    status: 'Skip it',
    detail:
      'AWS annotates this in its own inference sample: the device plugin injects the devices when the pod requests vpc.amazonaws.com/efa.',
  },
  {
    item: 'IPC_LOCK capability',
    status: 'Undocumented',
    detail:
      'Present in several AWS sample manifests, stated as a requirement by no AWS documentation. Memory pinning for RDMA registration is the obvious motive. Nobody at AWS has written that down.',
  },
  {
    item: 'NCCL_TOPO_FILE',
    status: 'Delete it',
    detail:
      'Topology alignment on EKS comes from the AL2023 AMI automatically, or from a DRA matchAttribute constraint. No AWS documentation and no AWS-authored EFA manifest sets this variable.',
  },
];

interface MechanismRow {
  feature: string;
  dra: string;
  plugin: string;
}

const mechanismRows: MechanismRow[] = [
  { feature: 'Minimum Kubernetes version', dra: '1.34', plugin: 'All EKS-supported versions' },
  {
    feature: 'EKS compute',
    dra: 'Managed node groups, self-managed nodes',
    plugin: 'EKS Auto Mode, Karpenter, managed node groups, self-managed nodes',
  },
  {
    feature: 'Accelerator affinity',
    dra: 'Native, through matchAttribute constraints',
    plugin: 'Automatic, and only on EKS-optimized AL2023 AMIs',
  },
  {
    feature: 'Device sharing between pods',
    dra: 'Supported through a shared ResourceClaim',
    plugin: 'Each device goes to exactly one pod.',
  },
];

export function EKSIntegration() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What you change on the node, in the image and in the pod spec, and which copied lines to drop."
          >
            EFA on EKS: the AMI, the device layer and the pod contract
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One split explains almost everything surprising about EFA (Elastic Fabric Adapter) on Amazon EKS
            (Elastic Kubernetes Service). <strong>The node image supplies the hardware plane: the EFA kernel
            driver and the rdma-core userspace, and it stops there. Your container image supplies the fabric
            stack: libfabric, aws-ofi-nccl, NCCL (NVIDIA Collective Communications Library) and MPI (Message
            Passing Interface).</strong> Everything below is a consequence: why fi_info fails on the host, why
            Bottlerocket and AL2023 land on different driver versions, and why a job that ran at a few GB/s was
            missing a library rather than a tuning flag.
          </Box>
          <Box variant="p">
            Two mechanisms expose EFA devices to Kubernetes. AWS states it plainly: Amazon EKS supports two
            mechanisms for managing EFA devices in EKS clusters, the EFA Dynamic Resource Allocation (DRA) driver,
            also called DRANET, and the EFA device plugin{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />. Your Kubernetes version and your node
            provisioning method decide which one is available to you.
          </Box>
          <Alert type="info" header="The shortest path that works, if you do nothing else">
            <SpaceBetween size="xs">
              <Box variant="p">
                Create a single-Availability-Zone managed node group with an EFA-capable instance type and
                efaEnabled: true, install one chart, then request the resource in your pod. When efaEnabled is set
                to true in the node group configuration, all interfaces are configured with interface type EFA, an
                EFA-specific security group is created, and the EFA device plugin is installed on the cluster{' '}
                <SourceRef provenance="documented" doc={docs.eksDevice} />. That is the whole device layer. The
                container image is the other half of the split, and it is the half people forget.
              </Box>
              <Box variant="code">
                {`# eksctl 0.215.0 or later is required for efaEnabled node groups.
managedNodeGroups:
  - name: my-efa-ng
    instanceType: p5.48xlarge
    availabilityZones: ["us-west-2a"]   # single AZ: this is the hard constraint
    privateNetworking: true
    efaEnabled: true

# Then, in the pod, request the resource. Nothing else about the pod is special.
resources:
  requests: { vpc.amazonaws.com/efa: 32, hugepages-2Mi: 5120Mi }
  limits:   { vpc.amazonaws.com/efa: 32, hugepages-2Mi: 5120Mi }`}
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The host owns the hardware plane. Your container image owns the fabric stack. Every real bug lives in the gap."
          >
            The layer cake: which layer the host owns and which the image owns
          </Header>
        }
      >
        <SpaceBetween size="m">
          <LayerCakeDiagram />

          <Box variant="p">
            Read the diagram bottom to top. EC2 attaches network interfaces at launch. The node image makes those
            interfaces into working device nodes by supplying the EFA kernel driver and the rdma-core userspace. A
            DaemonSet counts the device nodes and advertises them. A pod asks for some. And then, only inside the
            container, libfabric opens them and aws-ofi-nccl maps NCCL channels onto them.
          </Box>
          <Box variant="p">
            The split has a diagnostic consequence on day one. <code>ibv_devinfo</code> is the tool that works over
            SSH on an EKS node, because the full rdma-core suite, including libibverbs-utils, infiniband-diags and
            python3-pyverbs, lands on the node{' '}
            <SourceRef provenance="code-derived" doc={docs.installer} />. <code>fi_info -p efa</code> belongs to
            libfabric, which lives in your image, so run that one inside the workload container.
          </Box>
          <Alert type="info" header="The two device layers are cluster add-ons, on every AMI">
            AWS states that the EFA DRA driver and the EFA device plugin must be installed separately on your
            cluster before deploying workloads, on the EKS AL2023 and Bottlerocket AMIs (Amazon Machine Images)
            alike <SourceRef provenance="documented" doc={docs.eksDevice} />. The NVIDIA layer splits by AMI:
            Bottlerocket NVIDIA carries the NVIDIA device plugin in the image, and on the EKS-optimized AL2023
            NVIDIA AMIs you install the NVIDIA Kubernetes device plugin and the NVIDIA DRA driver yourself{' '}
            <SourceRef provenance="documented" doc={docs.eksAmi} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The one build-script line that fixes where the split falls, and the four package families it moves into your image."
          >
            The EKS AMI runs efa_installer.sh --minimal
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The AL2023 EKS AMI build runs the standard AWS EFA installer with one flag. The literal line is{' '}
            <code>sudo ./efa_installer.sh --minimal -y</code>, at line 53 of the Packer provisioner{' '}
            <SourceRef provenance="code-derived" code={code.installEfa} />. The script is gated only on the
            ENABLE_EFA variable{' '}
            <SourceRef provenance="code-derived" code={code.installEfaGuard} />, and the default template sets
            enable_efa to true with no per-Kubernetes-version override{' '}
            <SourceRef provenance="code-derived" code={code.amiVars} />. Release v20260728 confirms the artifact:
            the efa package row reads 3.1.0-1.amzn2023 across all five AL2023 variants, standard ones included{' '}
            <SourceRef provenance="documented" doc={docs.amiRelease} />.
          </Box>

          <MinimalFlagDiagram />

          <Alert type="warning" header="The flag withholds four package families where the documentation names two">
            <SpaceBetween size="xs">
              <Box variant="p">
                The EC2 documentation describes the flag as installing the EFA software without Libfabric and Open
                MPI <SourceRef provenance="documented" doc={docs.efaStart} />. The installer is more thorough than
                its own documentation. Its usage text reads: only install kernel module and rdma-core, do not
                install libfabric, mpi, or the NCCL plugin. The enforcing condition skips any package whose name
                matches libfabric, openmpi, libnccl-ofi or efa-profile{' '}
                <SourceRef provenance="code-derived" doc={docs.installer} />.
              </Box>
              <Box variant="p">
                The efa-profile omission is the one nobody expects. That package owns the profile.d and ld.so.conf
                entries for /opt/amazon/efa, so a libfabric hand-installed on the host later sits outside the
                default library and executable search paths and nothing finds it. The same flag also disables the
                installer self-test, which is the direct reason fi_info cannot work on an EKS node{' '}
                <SourceRef provenance="code-derived" doc={docs.installer} />.
              </Box>
              <Box variant="p">
                NCCL sits outside this list entirely. The EFA installer package manifest carries no NCCL in any
                mode, so its absence from the node traces to a different cause than the four families the flag
                excludes. What the flag excludes is the aws-ofi-nccl plugin, shipped as libnccl-ofi-1.20.0{' '}
                <SourceRef provenance="code-derived" doc={docs.installer} />.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="p">
            The rdma-core half of the split is generous. Only an explicit --skip-rdma-core flag drops it, so
            --minimal leaves the complete suite on the node: ibacm, infiniband-diags, libibumad, libibverbs,
            libibverbs-utils, librdmacm, librdmacm-utils, python3-pyverbs, rdma-core and rdma-core-devel{' '}
            <SourceRef provenance="code-derived" doc={docs.installer} />. efa-config and efa-nv-peermem survive too.
            The build proves the latter by explicitly removing efa-nv-peermem again on non-NVIDIA AMIs, which it
            would have no reason to do if --minimal had not installed it{' '}
            <SourceRef provenance="code-derived" code={code.installEfaPeermem} />.
          </Box>

          <Alert
            type="error"
            header="Bottlerocket compiles its own EFA kernel module, and the documentation reads otherwise"
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS writes that the EKS-optimized AL2023 accelerated AMIs and all Bottlerocket AMIs include the
                host-level components required to use EFA, specifically the components installed by the
                aws-efa-installer{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.eksDevice}
                  code={code.brKmod}
                  conflict="EKS User Guide: Bottlerocket ships the components installed by the aws-efa-installer."
                />
                . The Bottlerocket build treats that installer as a source archive instead. It downloads a pinned
                1.47.0 tarball, extracts the driver sources out of the RPM inside it, and compiles its own kernel
                module against its own kernel{' '}
                <SourceRef provenance="code-derived" code={code.brKmod} />.
              </Box>
              <Box variant="p">
                Two consequences the documentation hides. First, the versions differ: AL2023 pulls the latest
                installer at build time and lands EFA driver 3.1.0, while the Bottlerocket kernel module spec pins
                installer 1.47.0 and builds version 3.0.0{' '}
                <SourceRef provenance="code-derived" code={code.brKmod} />. Second, the host debugging tools differ.
                Bottlerocket builds its own rdma-core and strips every provider except libefa{' '}
                <SourceRef provenance="code-derived" code={code.brRdma} />, where AL2023 gets the stock suite with
                pyverbs, diags and headers. The end states are similar. The build paths are independent, and so are
                the versions.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="Inspecting and rebuilding the AMI yourself"
            headerDescription="dnf list installed, the per-release package tables, and the make invocation"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                On a running node, AWS points at the package database directly: you can find the list of installed
                packages and their versions on a running EC2 instance with the dnf list installed command{' '}
                <SourceRef provenance="documented" doc={docs.eksAmi} />. Off the node, each AMI release publishes a
                package version table per AMI type{' '}
                <SourceRef provenance="documented" doc={docs.amiRelease} />.
              </Box>
              <Box variant="code">
                {`# Rebuild the same AMI from the published build scripts.
make k8s=1.36 os_distro=al2023 \\
  enable_accelerator=nvidia \\
  nvidia_driver_major_version=580 \\
  enable_efa=true`}
              </Box>
              <Box variant="p">
                Two AWS rules go with that <SourceRef provenance="documented" doc={docs.eksAmiBuild} />. When
                building custom AMIs on top of the EKS-optimized ones, AWS states that running an operating system
                upgrade or upgrading any of the Kubernetes or GPU packages is neither recommended nor supported,
                because it risks breaking component compatibility. And for GPU instances, AWS recommends building
                separate custom AMIs per instance type generation and family, because the accelerated AMIs install
                drivers and packages selectively at runtime based on the underlying instance type{' '}
                <SourceRef provenance="documented" doc={docs.eksAmi} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="An integer or a set of attributes: pick the one your Kubernetes version and node provisioner allow."
          >
            Two ways to expose EFA devices to Kubernetes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both are DaemonSets that read /dev/infiniband on the host and publish what they find. They differ in
            what they publish. <strong>The EFA device plugin publishes one integer</strong>, the device count on
            the node, as a Kubernetes extended resource named vpc.amazonaws.com/efa.{' '}
            <strong>The EFA DRA driver, packaged as aws-dranet, publishes each device as its own object</strong>{' '}
            carrying attributes: device type, topology and PCIe (Peripheral Component Interconnect Express)
            locality <SourceRef provenance="documented" doc={docs.eksDevice} />. You count against an integer and
            you match against attributes, which is what makes topology-aware scheduling expressible. Every row
            below follows from that.
          </Box>
          <Box variant="p">
            AWS recommends the DRA driver for new deployments on clusters running Kubernetes 1.34 or later with EKS
            managed node groups or self-managed node groups, and in the same paragraph sends Karpenter and EKS Auto
            Mode clusters to the EFA device plugin, since the EFA DRA driver is not supported with either{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />. There is also a hard rule against running
            both: do not install the EFA DRA driver on nodes where the EFA device plugin is running, because the two
            mechanisms cannot coexist on the same node{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">How the two mechanisms differ</Header>}
            columnDefinitions={[
              { id: 'feature', header: 'Feature', cell: (item) => <strong>{item.feature}</strong> },
              { id: 'dra', header: 'EFA DRA driver (DRANET)', cell: (item) => item.dra },
              { id: 'plugin', header: 'EFA device plugin', cell: (item) => item.plugin },
            ]}
            items={mechanismRows}
          />
          <Box variant="small" color="text-body-secondary">
            Rows condensed from the comparison table AWS publishes{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />.
          </Box>

          <Alert type="warning" header="The Auto Mode half is enforced by the charts. The Karpenter half is a support statement.">
            Both charts carry the same node affinity clause excluding EKS Auto Mode nodes, keyed on
            eks.amazonaws.com/compute-type NotIn auto{' '}
            <SourceRef provenance="code-derived" code={code.dranetDs} />. The Karpenter case has no such clause: a
            Karpenter node whose instance type appears in the chart allowlist schedules the aws-dranet DaemonSet
            quite happily. Enforce that half yourself, in the NodePool or in review.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How many devices you get, and the two affinity rules that decide whether the DaemonSet lands."
          >
            The device plugin in detail
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            That extended resource goes in both container resource requests and limits{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />. As of the pinned chart commit the plugin is
            at version v0.5.30 with app version v0.5.20{' '}
            <SourceRef provenance="code-derived" code={code.efaChart} />.
          </Box>
          <Box variant="code">
            {`helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install efa eks/aws-efa-k8s-device-plugin -n kube-system

# What good looks like on the nodes:
kubectl get nodes "-o=custom-columns=NAME:.metadata.name,EFA:.status.allocatable.vpc\\.amazonaws\\.com/efa"
# NAME                                           EFA
# ip-192-168-11-225.us-west-2.compute.internal   4`}
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">How many devices you get</Box>
              <Box variant="p">
                The advertised count is the number of EFA interfaces attached at launch. The instance type only
                sets the ceiling, and AWS states that rule: you can assign up to one EFA per network card, and an
                EFA counts as a network interface{' '}
                <SourceRef provenance="documented" doc={docs.eksNode} />.
              </Box>
              <Box variant="p">
                So the number is per instance type and per launch configuration. A p5.48xlarge configured for
                maximum fabric bandwidth yields 32. A p6-b200.48xlarge has 8 network cards and yields 8. A
                p6-b300.48xlarge has 17 cards but the primary one is ENA-only, so 16{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />. The AWS GB200 reference manifest requests
                only 4 <SourceRef provenance="code-derived" code={code.ncclGb200} />. Any manifest that hardcodes 32
                is a p5 manifest, whatever its filename says.
              </Box>
            </div>
            <div>
              <Box variant="h3">Two affinity rules that keep it off your nodes</Box>
              <Box variant="p">
                First, the chart carries an explicit allowlist of roughly 300 instance types under
                supportedInstanceLabels.values, matched on node.kubernetes.io/instance-type{' '}
                <SourceRef provenance="code-derived" code={code.efaValues} />. A brand new instance family works
                once that list is bumped. Until then the DaemonSet reports healthy with zero pods on the nodes you
                care about, so check pod count per node rather than DaemonSet status.
              </Box>
              <Box variant="p">
                Second, the same affinity block excludes EKS Auto Mode nodes with compute-type NotIn auto, and the
                pod spec itself sets hostNetwork: true{' '}
                <SourceRef provenance="code-derived" code={code.efaDs} />, which is the line people copy into their
                workloads by mistake.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="Version floors that bite">
            EFA device plugin v0.5.6 or later is needed for P6-B200 instances. Amazon VPC (Virtual Private Cloud)
            CNI (Container Network Interface) 1.7.10 or later is needed before launching nodes with multiple EFAs
            such as p4d or p5, and 1.18.5 or later for efa-only interfaces. eksctl 0.215.0 or later is needed for
            efaEnabled node groups. Bottlerocket 1.28.0 or later includes official EFA support{' '}
            <SourceRef provenance="documented" doc={docs.eksNode} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How to pin each EFA device to the GPU it shares a PCIe root with, and what the packaging costs you."
          >
            The EFA DRA driver
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The objects the driver publishes are ResourceSlices, under the driver name dra.net and the DeviceClass
            name efa.networking.k8s.aws, from a DaemonSet that discovers devices automatically{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />. The chart confirms both names, along with a
            Common Expression Language filter that keeps only devices whose dra.net/pciDevice attribute equals
            Elastic Fabric Adapter (EFA){' '}
            <SourceRef provenance="code-derived" code={code.dranetValues} />. It runs unprivileged, with a read-only
            root filesystem and all capabilities dropped, which is a tighter posture than the device plugin{' '}
            <SourceRef provenance="code-derived" code={code.dranetValues} />.
          </Box>

          <Alert type="warning" header="The recommended path is one commit old and two upstream minors behind">
            The aws-dranet chart has exactly one commit in its history, dated 2026-04-30, and is still at chart
            version 1.0.0 pinning image v1.2.0-eksbuild.2{' '}
            <SourceRef provenance="code-derived" code={code.dranetChart} />. Upstream kubernetes-sigs/dranet has
            since released v1.3.0 and v1.4.0. AWS recommends this path for new deployments, and the packaging of it
            has not been touched since the day it landed. Budget for pinning the image yourself if you need an
            upstream fix.
          </Alert>

          <Box variant="code">
            {`helm install aws-dranet eks/aws-dranet --namespace kube-system

kubectl get deviceclass                                       # efa.networking.k8s.aws
kubectl get resourceslices --field-selector spec.driver=dra.net`}
          </Box>

          <Box variant="h3">Pinning EFA devices to the GPU they share a PCIe root with</Box>
          <Box variant="p">
            The DRA driver supports topology-aware allocation pairing EFA interfaces with GPUs or Neuron devices on
            the same PCIe root, expressed with a matchAttribute constraint{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />. The attribute comes from upstream
            Kubernetes: it is the standard device attribute constant, the prefix resource.kubernetes.io/
            concatenated with pcieRoot, documented in-tree as a string in the format pci-domain colon bus{' '}
            <SourceRef provenance="code-derived" code={code.k8sAttr} />. DRANET reuses that constant rather than
            defining its own{' '}
            <SourceRef provenance="code-derived" code={code.dranetDb} />, which is precisely why the NVIDIA GPU DRA
            driver and DRANET can be constrained against each other.
          </Box>

          <Box variant="code">
            {`devices:
  requests:
  - name: 1-gpu
    exactly: { deviceClassName: gpu.nvidia.com, count: 1 }
  - name: aligned-efa
    exactly:
      deviceClassName: efa.networking.k8s.aws
      allocationMode: All      # take every EFA on that PCIe root, however many there are
  constraints:
  - requests: ["1-gpu", "aligned-efa"]
    matchAttribute: "resource.kubernetes.io/pcieRoot"`}
          </Box>

          <Box variant="p">
            allocationMode exists so you do not have to know the group size. AWS gives the motivating case: on
            p5.48xlarge instances there are four EFA devices that share the same PCIe root with one GPU, and to
            allocate those groups alongside aligned GPUs even without knowing the exact mapping and count, you
            configure the ResourceClaimTemplate with allocationMode: All{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />. ExactCount is the default.
          </Box>

          <Alert type="warning" header="The 8 times 4 equals 32 arithmetic is our inference, and it is doing real work">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states a local ratio and only that: four EFA devices sharing one PCIe root with one GPU. It
                never enumerates how many such groups a p5.48xlarge has. Multiplying that ratio by the known 8 GPUs
                to reach eight groups and 32 devices is arithmetic we performed{' '}
                <SourceRef provenance="code-derived" doc={docs.eksDevice} code={code.k8sAttr} label="inference" />.
              </Box>
              <Box variant="p">
                Flag it because of what it is used for. AWS documentation contains a genuine internal contradiction
                on this instance: the NCCL walkthrough narrates each worker requesting four EFAs while the YAML
                immediately below requests 32{' '}
                <SourceRef provenance="documented" doc={docs.eksNode} />. The 8 times 4 reading reconciles those two
                numbers neatly, which is exactly the situation where an inference must not be dressed up as a
                citation. Note also that the two fours are different quantities. One is a per-worker-pod request
                count, and it is the wrong one. The other is a per-PCIe-root topology fact. They coincide by
                accident.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="What misalignment costs, measured"
            headerDescription="Published by the upstream DRANET project, not by AWS"
          >
            <Box variant="p">
              The upstream project publishes a two-node all_reduce_perf comparison on a p4d-class node with one GPU
              per worker. The aligned template, GPU and EFA both on PCIe root pci0000:10, reports roughly 11.35 GB/s
              bus bandwidth with GPUDirect RDMA (Remote Direct Memory Access) active. The unaligned template, same
              GPU against an EFA on pci0000:a0, reports roughly 6.04 GB/s with GPUDirect RDMA off, which the project
              summarises as degrading performance by roughly 1.9 times at the same GPU and EFA count{' '}
              <SourceRef provenance="code-derived" code={code.dranetBench} />. These figures come from an upstream
              repository rather than from AWS, and this dive treats an in-repo document as orientation rather than
              proof. Treat the shape as sound and the numbers as someone else's benchmark.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The fields a working EFA pod carries, the two you can drop, and two that no AWS documentation explains."
          >
            The pod contract
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'item', header: 'Field', cell: (item) => <strong>{item.item}</strong> },
              {
                id: 'status',
                header: 'Status',
                cell: (item) => (
                  <Badge
                    color={
                      item.status === 'Required'
                        ? 'green'
                        : item.status === 'Delete it' || item.status === 'Skip it'
                          ? 'red'
                          : item.status === 'Usually required'
                            ? 'blue'
                            : 'grey'
                    }
                  >
                    {item.status}
                  </Badge>
                ),
              },
              { id: 'detail', header: 'Why', cell: (item) => item.detail },
            ]}
            items={contractRows}
          />

          <Alert type="warning" header="What hostNetwork is for, and why AWS samples still set it on workloads">
            <SpaceBetween size="xs">
              <Box variant="p">
                hostNetwork belongs to the device layer. Both the EFA device plugin DaemonSet{' '}
                <SourceRef provenance="code-derived" code={code.efaDs} /> and the aws-dranet DaemonSet{' '}
                <SourceRef provenance="code-derived" code={code.dranetDs} /> set it, because they inspect the host.
                A workload pod reaches EFA through injected /dev/infiniband device nodes, whatever its network
                namespace, and AWS multi-node inference samples run EFA on the pod network with NCCL_SOCKET_IFNAME
                set to eth0. The word hostNetwork appears nowhere on the AWS EFA device management page, including
                in its own workload pod example, and nowhere on the EKS machine learning training page{' '}
                <SourceRef provenance="documented" doc={docs.eksDevice} />. The comment{' '}
                <code>hostNetwork: true # Required for EFA</code> that travels with copied manifests has no source
                behind it.
              </Box>
              <Box variant="p">
                AWS does set it on workloads, in three places. The HyperPod checkpointless training example
                hard-codes hostNetwork: True on a p5 pretraining job that requests 32 EFA devices{' '}
                <SourceRef provenance="code-derived" code={code.ckptJob} />. The HyperPod recipes expose it as a
                first-class user-settable knob on EFA training jobs{' '}
                <SourceRef provenance="code-derived" code={code.recipes} />. And an aws-do-eks multi-node inference
                template pairs it with dnsPolicy: ClusterFirstWithHostNet{' '}
                <SourceRef provenance="code-derived" code={code.doEks} />.
              </Box>
              <Box variant="p">
                No AWS source states a reason for those three. The plausible one is rendezvous and launcher
                addressing rather than the EFA data path, but nobody has written that down, so treat it as our
                reading. Start on the pod network, and reach for hostNetwork when a launcher needs a stable address.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="A worker pod spec you can copy"
            headerDescription="Only the fields the sources support, with the p5-specific numbers marked"
            defaultExpanded
          >
            <Box variant="code">
              {`apiVersion: v1
kind: Pod
metadata:
  name: efa-training-worker
spec:
  # Pod network, default dnsPolicy, unprivileged. All three are deliberate.
  containers:
  - name: training
    image: your-training-image:latest   # must carry libfabric + aws-ofi-nccl + NCCL
    resources:
      requests:
        nvidia.com/gpu: 8
        vpc.amazonaws.com/efa: 32       # 32 is a p5.48xlarge number, not a universal one
        hugepages-2Mi: 5120Mi
        memory: 32000Mi
      limits:                           # extended resources: limits must equal requests
        nvidia.com/gpu: 8
        vpc.amazonaws.com/efa: 32
        hugepages-2Mi: 5120Mi
    env:
    - name: FI_PROVIDER
      value: "efa"
    - name: FI_EFA_FORK_SAFE
      value: "1"
    - name: NCCL_DEBUG
      value: "INFO"
    volumeMounts:
    - name: shmem
      mountPath: /dev/shm
  volumes:
  - name: shmem
    hostPath:
      path: /dev/shm                    # what AWS ships; an emptyDir Memory volume
                                        # works too but counts against the pod memory limit`}
            </Box>
          </ExpandableSection>

          <Box variant="p">
            On huge pages, hold two numbers apart. AWS states that EC2 instances with the EFA driver installed
            pre-allocate 5128 2MiB huge pages, requestable as a resource in your job specifications{' '}
            <SourceRef provenance="documented" doc={docs.eksNode} />. The AWS manifests then request 5120Mi, which
            is 2,560 pages, roughly half of what was pre-allocated. The two figures are different quantities and are
            easy to confuse. Bottlerocket pre-allocates nothing, so you set vm.nr_hugepages by sysctl in node user
            data instead <SourceRef provenance="documented" doc={docs.eksNode} />.
          </Box>
          <Box variant="p">
            Training operators need nothing special. EFA works because the worker pod template carries the resource
            request, so MPIJob, PyTorchJob, LeaderWorkerSet and RayJob all behave identically and no operator CRD
            (Custom Resource Definition) has an EFA-specific field. AWS uses the Kubeflow MPI Operator for its NCCL
            test walkthrough <SourceRef provenance="documented" doc={docs.eksNode} /> and LeaderWorkerSet for its
            multi-node inference samples.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four mechanisms, four sets of limitations, one node-level result."
          >
            Getting EFA interfaces onto the nodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <NodeLanesDiagram />

          <Alert type="warning" header="Two networking rules bind here, and the placement group is neither of them">
            <SpaceBetween size="xs">
              <Box variant="p">
                The Availability Zone is the first rule, because EFA traffic cannot cross one. The security group
                is the second: it must allow all inbound and outbound traffic to and from itself to enable EFA
                OS-bypass <SourceRef provenance="documented" doc={docs.eksDevice} />, and when it is missing, EFA
                traffic fails without a useful error.
              </Box>
              <Box variant="p">
                A cluster placement group is how AWS recommends satisfying the zone rule and shortening the physical
                distance, and it writes the status verbatim: it is not an absolute requirement to launch your
                EFA-enabled instances into a cluster placement group. However, AWS does recommend running
                EFA-enabled instances in a cluster placement group, as it launches the instances into a low-latency
                group in a single Availability Zone{' '}
                <SourceRef provenance="documented" doc={docs.efaStart} />. A checklist that lists it as a flat setup
                requirement is stating a recommendation as a rule.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="eksctl and managed node groups"
            headerDescription="The efa-only gap and the SubnetId trap"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                eksctl remains the shortest path, and a launch template is where you go for efa-only interfaces.
                AWS states both: you cannot use eksctl to create nodes and node groups that use EFA-only
                interfaces, and if you need to customize the per-device EFA configuration when using eksctl, it is
                recommended to use the eksctl support for launch templates{' '}
                <SourceRef provenance="documented" doc={docs.eksDevice} />. eksctl also accepts an explicit
                placement group name alongside efaEnabled{' '}
                <SourceRef provenance="code-derived" code={code.eksctlDocs} />.
              </Box>
              <Box variant="p">
                For managed node groups with a hand-written launch template, one line will cost you an afternoon.
                AWS states it as an Important callout: do not specify SubnetId in the launch template when using EKS
                managed node groups, because EKS requires all subnets to be specified through the CreateNodegroup
                API and rejects launch templates that include subnet configuration{' '}
                <SourceRef provenance="documented" doc={docs.eksDevice} />. Note also that you cannot make network
                card 0 an efa-only interface, since it is the primary interface{' '}
                <SourceRef provenance="documented" doc={docs.eksNode} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Karpenter: dynamic and static, and what changes when you go static"
            headerDescription="EC2NodeClass.spec.networkInterfaces, added in v1.11"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                Two modes. Without networkInterfaces in the NodeClass, instances created for pods requesting
                vpc.amazonaws.com/efa have all interfaces configured with interface type EFA. With networkInterfaces
                configured, instances launched by the referencing NodePool use that configuration whether or not
                pods request EFA at all{' '}
                <SourceRef provenance="documented" doc={docs.eksDevice} />.
              </Box>
              <Box variant="p">
                The Karpenter design document records what static mode gives up{' '}
                <SourceRef provenance="code-derived" code={code.karpenterDesign} />. The EFA resource is not
                injected into the NodeClaim as a resource requirement, so nodes initialize even if the plugin has
                not registered the extended resource yet, where dynamic provisioning waits. The max pods
                calculation changes, because the ENI count is computed only for network card 0 and an efa-only
                interface there reduces it by one. efa-only interfaces cannot carry an IP prefix count, so Karpenter
                does not set prefix counts on them. And changing networkInterfaces drifts every existing node. The
                design also confirms only ENA and efa-only types are supported, with no use case identified for the
                combined EFA interface type. EC2NodeClass separately offers placementGroupSelector{' '}
                <SourceRef provenance="documented" doc={docs.karpenterNodeClass} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="EKS Auto Mode: static interfaces and placement group edge cases"
            headerDescription="advancedNetworking.networkInterfaces, and the four placement group behaviours to plan around"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                In Auto Mode you configure EFA interfaces through advancedNetworking.networkInterfaces on the
                NodeClass <SourceRef provenance="documented" doc={docs.eksDevice} />. The constraints are strict:
                the primary interface must be interface type interface; secondary IP and prefix counts are only
                supported on network card 0 and never on efa-only interfaces; when networkInterfaces is configured
                Auto Mode attaches no additional IPs, prefixes or ENIs after launch, so pod density has to be
                planned at launch; IPv6 is unsupported with static interfaces; and public IP association is
                incompatible with more than one interface{' '}
                <SourceRef provenance="documented" doc={docs.eksNodeClass} />.
              </Box>
              <Box variant="p">
                The placement group behaviour is the part that is hard to find and easy to hit{' '}
                <SourceRef provenance="documented" doc={docs.eksNodeClass} />. Once the first instance launches into
                a cluster placement group, the group pins to that Availability Zone, so parallel launches during
                initial scale-up can race, one winning and the rest failing on capacity. Pin the zone in the
                NodePool requirements. A spread placement group caps at 7 instances per zone, and there is no
                fallback outside the group, so a replacement launch fails and the drifted node stays running.
                Consolidation can move pods out of a placement group unless they carry a nodeSelector on
                eks.amazonaws.com/placement-group-id. And if a referenced placement group is deleted, running nodes
                are marked drifted and remain indefinitely.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set mofedEnabled=false, and here is the upstream default that makes it necessary."
          >
            The NVIDIA MOFED collision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS documents the symptom: starting with NVIDIA k8s-device-plugin v0.19.0, the --mofed-enabled flag
            defaults to true, which causes the NVIDIA device plugin to mount all /dev/infiniband/uverbs* devices
            into containers requesting GPUs, conflicting with the EFA device plugin, which should be the component
            managing EFA device allocation at /dev/infiniband{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />.
          </Box>
          <Box variant="p">
            The code confirms it and adds a device the documentation misses. In v0.19.0 the mofed-enabled boolean
            flag carries an explicit default of true{' '}
            <SourceRef provenance="code-confirmed" doc={docs.eksDevice} code={code.nvdpNew} />. In v0.18.2 the same
            flag has no Value field at all, so it took the Go zero value of false{' '}
            <SourceRef provenance="code-derived" code={code.nvdpOld} />. One added line is the entire change.
            Enabling it appends the mofed mode to the container device interface generator{' '}
            <SourceRef provenance="code-derived" code={code.nvdpCdi} />, whose discoverer injects two glob patterns
            into any GPU-requesting container: /dev/infiniband/uverbs* and also /dev/infiniband/rdma_cm{' '}
            <SourceRef provenance="code-derived" code={code.mofed} />. AWS names only the first.
          </Box>
          <Box variant="p">
            The reason this breaks partial allocations is in that glob. The discoverer has no notion of which EFA
            devices the pod was allocated, so a workload asking for fewer than all the EFA devices on a node still
            receives all of them, colliding with the exclusive allocation model of the EFA device plugin. AWS
            confirms EKS Auto Mode does not enable MOFED by default and is unaffected{' '}
            <SourceRef provenance="documented" doc={docs.eksNvidia} />.
          </Box>
          <Box variant="code">
            {`# Device plugin chart:
helm upgrade --install nvdp nvdp/nvidia-device-plugin \\
    --namespace nvidia --create-namespace \\
    --set gfd.enabled=true \\
    --set mofedEnabled=false

# GPU Operator:
helm upgrade --install gpu-operator nvidia/gpu-operator \\
    --namespace gpu-operator \\
    --set 'devicePlugin.env[0].name=MOFED_ENABLED' \\
    --set 'devicePlugin.env[0].value=false'`}
          </Box>
          <Alert type="info" header="One more GPU Operator rule on EKS accelerated AMIs">
            When using the NVIDIA GPU Operator with the EKS-optimized AL2023 NVIDIA AMIs, you must disable the
            operator installation of the driver and the toolkit, because both are already in the AMI{' '}
            <SourceRef provenance="documented" doc={docs.eksAmi} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Thirty-two interfaces on one instance, one shared bandwidth budget, and a subnet you can exhaust."
          >
            Multi-NIC reality on p5
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS states the headline numbers: p5.48xlarge and p5e.48xlarge support 32 network cards with a total
            network bandwidth capacity of 3,200 Gbps, of which up to 800 Gbps can be used for IP network traffic,
            and because EFA and IP traffic share the same underlying resources, bandwidth used by one reduces what
            is available to the other{' '}
            <SourceRef provenance="documented" doc={docs.efaAcc} />. The two figures are not additive. Use 400 Gbps
            for IP and you have up to 2,800 Gbps of EFA left.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                Layout one: conserve addresses <Badge color="blue">default choice on EKS</Badge>
              </Box>
              <Box variant="p">
                One ENA interface on network card 0 device index 0, one efa-only on network card 0 device index 1,
                and one efa-only on each of cards 1 through 31. AWS quotes the result as up to 3,200 Gbps of EFA
                bandwidth and up to 100 Gbps of IP bandwidth with one private IP address{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />. That is 32 EFA devices from 32 cards, with
                somewhere left to put the IP stack.
              </Box>
            </div>
            <div>
              <Box variant="h3">Layout two: keep the IP bandwidth</Box>
              <Box variant="p">
                Spread eight ENA interfaces across the card range and you reach up to 3,200 Gbps of EFA bandwidth
                and up to 800 Gbps of IP bandwidth with 8 private IP addresses, at the cost of being unable to
                auto-assign public IP addresses{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} />. On EKS this is usually the wrong trade,
                because those addresses come out of the same subnet your pods use.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="warning" header="Budget the subnet addresses before you launch">
            AWS spells out the mechanism: on instances such as p5.48xlarge and p6-b200.48xlarge the VPC CNI
            allocates IP addresses across all IP-enabled attached ENIs (Elastic Network Interfaces) by default,
            which can consume a large number of subnet addresses even when pods are not using them, and on instances
            with dozens of interfaces this can quickly exhaust the subnet. The two fixes AWS gives are using
            efa-only for every interface except the primary, and tuning WARM_IP_TARGET and WARM_ENI_TARGET on the
            aws-node DaemonSet. The caveat on the second one matters: those settings are cluster-wide and apply to
            every node the VPC CNI manages, with no way to set them per node group or instance type{' '}
            <SourceRef provenance="documented" doc={docs.eksDevice} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The two repositories to clone, the one to stop cloning, and an AWS API that reads as if it supports EFA on EKS.">
            Where to start from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Code that runs</Box>
              <Box variant="p">
                awslabs/ai-on-eks is the current blueprint home. Its Terraform declares the EFA instance type list
                and generates per-instance-type network interface blocks through an
                efa-networkinterfaces-generator module with a bandwidth-optimized against IP-optimized policy
                switch{' '}
                <SourceRef provenance="code-derived" code={code.aiOnEksTf} />. That policy split is the same one the
                Karpenter design document considered and did not ship{' '}
                <SourceRef provenance="code-derived" code={code.karpenterDesign} />. Start here rather than from a
                blank launch template <SourceRef provenance="documented" doc={docs.aiOnEks} />.
              </Box>
              <Box variant="p">
                awslabs/awsome-distributed-ai is actively maintained and holds the NCCL test manifests and the
                reference Dockerfile{' '}
                <SourceRef provenance="code-derived" code={code.ncclTests} />. It was transferred and renamed, so
                older links resolve to it.
              </Box>
            </div>
            <div>
              <Box variant="h3">One link still in circulation</Box>
              <Box variant="p">
                aws-samples/aws-efa-eks is archived. Its last push was 2024-10-15, and the GitHub API reports no
                archive date, so treat the archive date itself as unknown rather than assuming it matches the push.
                AWS documentation still links there for the device plugin. Use the eks-charts Helm chart instead.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection
            headerText="AWS Batch multi-node parallel jobs are ECS-only, whatever the SDK model suggests"
            headerDescription="A generated SDK field implies support the API cannot express. Read the shape documentation."
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                The Batch API model states it affirmatively rather than by omission. The NodeProperties shape
                documentation reads: an object that represents the node properties of a multi-node parallel job,
                with the note that node properties cannot be specified for Amazon EKS based job definitions{' '}
                <SourceRef provenance="code-derived" code={code.batchModel} />. Since a multi-node parallel job is
                defined by the presence of nodeProperties, and nodeProperties is mutually exclusive with
                eksProperties, the combination is not expressible in the API at all. The Batch documentation agrees:
                multi-node parallel jobs use the Amazon ECS (Elastic Container Service) awsvpc network mode{' '}
                <SourceRef provenance="documented" doc={docs.batchMnpCe} />, and neither multi-node parallel page
                mentions EFA, EKS or Kubernetes{' '}
                <SourceRef provenance="documented" doc={docs.batchMnp} />.
              </Box>
              <Box variant="p">
                Here is the trap. The same API model does carry an eksProperties member on the NodeRangeProperty
                shape, with documentation so generic it says nothing{' '}
                <SourceRef provenance="code-derived" code={code.batchModel} />. Anyone reading the SDK model or the
                generated SDK types, rather than the prose documentation, would reasonably conclude that multi-node
                parallel on EKS is supported. The shape documentation is the contract. Batch on EKS is real, it
                just runs single-node jobs through an overlay model{' '}
                <SourceRef provenance="documented" doc={docs.batchEks} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The two-node all_reduce to run first, and the output line that settles whether EFA carried the traffic.">
            Proving it works
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS recommends the Kubeflow MPI Operator for NCCL tests, since it makes allreduce-style distributed
            training straightforward on Kubernetes{' '}
            <SourceRef provenance="documented" doc={docs.eksNode} />. The reference manifest is one launcher pod
            plus N worker pods, slotsPerWorker: 8, and mpirun -np 16 -N 8 across two p5.48xlarge nodes running
            all_reduce_perf from 8 bytes to 16 GB{' '}
            <SourceRef provenance="code-derived" code={code.ncclTests} />.
          </Box>
          <Box variant="code">
            {`/opt/nccl-tests/build/all_reduce_perf -b 8 -e 16G -f 2 -g 1 -c 1 -n 100

# Environment the AWS reference job actually exports:
#   FI_PROVIDER=efa
#   FI_EFA_FORK_SAFE=1
#   NCCL_DEBUG=INFO
#   PATH=$PATH:/opt/amazon/efa/bin:/usr/bin
#   LD_LIBRARY_PATH=/opt/amazon/openmpi/lib:/opt/nccl/build/lib:/opt/amazon/efa/lib:/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu`}
          </Box>
          <Box variant="p">
            The container stack in the AWS reference image is worth copying rather than inventing: a CUDA devel
            base, GDRCopy, a full EFA installer run inside the image, NCCL, and nccl-tests{' '}
            <SourceRef provenance="code-derived" code={code.ncclDockerfile} />. The full installer run is what puts
            the aws-ofi-nccl plugin in the image, since the plugin is bundled with the installer, which is the same
            bundling the --minimal flag removes on the node. One Dockerfile closes the top half of the split.
          </Box>
          <Box variant="p">
            Then read NCCL_DEBUG=INFO output for the transport line before the bandwidth number. NCCL falls back to
            sockets when the plugin fails to load, and the job still completes, just slowly. A run finishing at a
            few GB/s on a p5 has fallen back, and the transport line says so in the first hundred lines.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
