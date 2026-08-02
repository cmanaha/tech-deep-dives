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
 * Operations, observability and failure modes for EFA.
 *
 * Sourcing rule for this file (deep-dives/efa/revamp/source-authority-standard.md):
 * every load-bearing claim carries a SourceRef. 'documented' means AWS states
 * it. 'code-derived' means it was read out of an implementation at a pinned
 * commit and AWS documents nothing. 'doc-code-conflict' means the two disagree
 * and the code wins. Nothing is laundered between the categories.
 *
 * Where a latency or threshold number could not be sourced, this file says
 * UNKNOWN. An earlier version of this dive carried unsourced microsecond
 * figures and they were removed for exactly that reason.
 */

const ACCESSED = '2026-08-02';
const READ = '2026-08-02';

/** amzn-drivers master HEAD at the time of reading: driver r3.3.0. */
const DRIVER_SHA = 'b99452b70756b1b394b1e7ff238d4efbdca44c5b';
const PLUGIN_TAG = 'v1.20.0';
const LIBFABRIC_TAG = 'v2.6.0';
/** One of the three NCCL releases aws-ofi-nccl v1.20.0 states it was tested against. */
const NCCL_TAG = 'v2.28.9-1';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';
const EKS_DOC = 'https://docs.aws.amazon.com/eks/latest/userguide/';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });

/** Pinned code reference builders. Ref is always a SHA or a release tag, never a branch. */
const drv = (path: string, lines?: string): CodeRef => ({
  repo: 'amzn/amzn-drivers',
  ref: DRIVER_SHA,
  path: `kernel/linux/efa/${path}`,
  lines,
  read: READ,
});
const ena = (path: string, lines?: string): CodeRef => ({
  repo: 'amzn/amzn-drivers',
  ref: DRIVER_SHA,
  path: `kernel/linux/ena/${path}`,
  lines,
  read: READ,
});
const lfab = (path: string, lines?: string): CodeRef => ({
  repo: 'ofiwg/libfabric',
  ref: LIBFABRIC_TAG,
  path,
  lines,
  read: READ,
});
const plugin = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/aws-ofi-nccl',
  ref: PLUGIN_TAG,
  path,
  lines,
  read: READ,
});
const nccl = (path: string, lines?: string): CodeRef => ({
  repo: 'NVIDIA/nccl',
  ref: NCCL_TAG,
  path,
  lines,
  read: READ,
});

const docs = {
  efa: doc('EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads', `${EC2_DOC}efa.html`, 1),
  monitor: doc('EC2 User Guide: Monitor an Elastic Fabric Adapter on Amazon EC2', `${EC2_DOC}efa-working-monitor.html`, 1),
  start: doc('EC2 User Guide: Get started with EFA and MPI', `${EC2_DOC}efa-start.html`, 1),
  startNccl: doc('EC2 User Guide: Get started with EFA and NCCL', `${EC2_DOC}efa-start-nccl.html`, 1),
  changelog: doc('EC2 User Guide: Elastic Fabric Adapter release notes', `${EC2_DOC}efa-changelog.html`, 1),
  installerCheck: doc('EC2 User Guide: Verify the EFA installer using a checksum', `${EC2_DOC}efa-verify.html`, 1),
  detach: doc('EC2 User Guide: Detach and delete an EFA from an Amazon EC2 instance', `${EC2_DOC}detach-efa.html`, 1),
  eksDevice: doc('EKS User Guide: EFA device management with Dynamic Resource Allocation', `${EKS_DOC}device-management-efa.html`, 1),
  eksNode: doc('EKS User Guide: Machine learning training on Amazon EKS with EFA', `${EKS_DOC}node-efa.html`, 1),
};

const code = {
  /** The whole driver source tree, for the one claim that is about an absence. */
  driverSrc: drv('src'),
  portStats: drv('src/efa_verbs.c', 'L74-L96'),
  deviceStats: drv('src/efa_verbs.c', 'L54-L66'),
  kverbsStats: drv('src/efa_verbs.c', 'L68-L72'),
  fillPort: drv('src/efa_verbs.c', 'L3652-L3656'),
  getHwStats: drv('src/efa_verbs.c', 'L3708-L3715'),
  netStatsStruct: drv('src/efa_admin_cmds_defs.h', 'L664-L674'),
  basicStatsStruct: drv('src/efa_admin_cmds_defs.h', 'L620-L632'),
  statsTypes: drv('src/efa_admin_cmds_defs.h', 'L70-L76'),
  modVersion: drv('src/efa_main.c', 'L42-L53'),
  pciIds: drv('src/efa_main.c', 'L27-L38'),
  sysfsP2p: drv('src/efa_sysfs.c', 'L34-L51'),
  nvP2pString: drv('src/efa_nvmem_impl.h', 'L294-L306'),
  neuronP2pString: drv('src/efa_neuronmem.c', 'L157-L166'),
  dkms: drv('conf/dkms.conf'),
  releaseNotes: drv('RELEASENOTES.md'),
  enaEthtool: ena('ena_ethtool.c', 'L113-L119'),
  fabricNames: lfab('prov/efa/src/efa.h', 'L62-L63'),
  fabricAssign: lfab('prov/efa/src/efa_prov.c', 'L106-L133'),
  linkAddr: lfab('prov/efa/src/efa_prov_info.c', 'L346-L356'),
  mrCacheLimits: lfab('prov/efa/src/rdm/efa_rdm_mr.c', 'L141-L152'),
  mrCacheMonitor: lfab('prov/efa/src/rdm/efa_rdm_mr.c', 'L111-L126'),
  forkAbort: lfab('prov/efa/src/efa_fork_support.c', 'L30-L60'),
  pingpong: lfab('man/fi_pingpong.1.md'),
  mrCacheEnv: lfab('man/fi_mr.3.md', 'L1054-L1080'),
  selectedProvider: plugin('src/nccl_ofi_net.cpp', 'L643-L646'),
  pluginName: plugin('src/nccl_ofi_interface_nvidia.cpp', 'L802-L803'),
  topoMemfd: plugin('src/nccl_ofi_rdma.cpp', 'L239-L299'),
  topoDefer: plugin('src/platform-aws.cpp', 'L665-L687'),
  envVarDoc: plugin('doc/efa-env-var.md'),
  usingNetwork: nccl('src/init.cc', 'L428'),
  internalPlugins: nccl('src/plugin/net.cc', 'L322-L337'),
  pluginFailed: nccl('src/plugin/net.cc', 'L225'),
  socketName: nccl('src/transport/net_socket.cc', 'L720-L721'),
};

/**
 * Diagram 1. The troubleshooting decision tree for a job that produces correct
 * results slowly. Idiom A (class-name prefix "tt-"). Painted light ground so it
 * survives Cloudscape dark mode. Left column asks, right column answers.
 */
function TriageTreeDiagram() {
  const steps = [
    {
      q: ['fi_info -p efa -t FI_EP_RDM lists', 'at least one device?'],
      no: [
        'The libfabric EFA provider cannot see a device. Either the EFA',
        'stack is not installed or no EFA interface is attached at all.',
        'Nothing above this layer can use EFA.',
      ],
    },
    {
      q: ['NCCL prints Using network Libfabric', 'at communicator init?'],
      no: [
        'NCCL fell through its plugin list to an internal transport.',
        'Using network Socket means every byte is going over TCP.',
        'Grep the same log for Failed to initialize NET plugin.',
      ],
    },
    {
      q: ['The plugin prints Selected provider', 'is efa?'],
      no: [
        'The plugin loaded but libfabric handed it a different provider,',
        'such as tcp or shm. Check FI_PROVIDER and the LD_LIBRARY_PATH',
        'that decides which libfabric is loaded.',
      ],
    },
    {
      q: ['tx_pkts and rx_pkts move while', 'the job runs?'],
      no: [
        'The device is claimed but no traffic crosses it. Suspect the',
        'security group rule, ranks split across Availability Zones,',
        'or a container that was given the wrong uverbs device.',
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 940 610"
      role="img"
      aria-labelledby="efa-ops-triage-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-ops-triage-title">
        A job that returns correct results slowly should be triaged from the bottom of the stack
        upward: first confirm libfabric sees an EFA device, then that NCCL selected the Libfabric
        network, then that libfabric selected the efa provider, then that the device counters move
        while the job runs. Only after all four pass is the transport actually EFA, and only then is
        it worth looking at retransmission counters, collectives and topology.
      </title>
      <style>
        {`
          .tt-entry { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tt-q { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .tt-no { fill: #fff7f7; stroke: #d91515; stroke-width: 1.5; }
          .tt-ok { fill: #f2fcf3; stroke: #037f0c; stroke-width: 1.5; }
          .tt-hd { fill: #0f1b2a; font: 600 13px sans-serif; }
          .tt-txt { fill: #0f1b2a; font: 11px sans-serif; }
          .tt-lbl { fill: #5f6b7a; font: 600 10px sans-serif; }
          .tt-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#tt-head); }
          .tt-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="tt-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="940" height="610" rx="8" fill="#ffffff" />

      <rect className="tt-entry" x="40" y="26" width="400" height="48" rx="6" />
      <text className="tt-hd" x="60" y="47">
        Job finishes, results are correct, throughput is low
      </text>
      <text className="tt-txt" x="60" y="64">
        Start at the bottom of the stack. Do not assume the transport.
      </text>
      <path className="tt-arr" d="M240,74 L240,96" />

      {steps.map((step, index) => {
        const y = 96 + index * 106;
        return (
          <g key={step.q[0]}>
            <rect className="tt-q" x="40" y={y} width="400" height="80" rx="6" />
            {step.q.map((line, lineIndex) => (
              <text className="tt-hd" key={line} x="60" y={y + 32 + lineIndex * 20}>
                {line}
              </text>
            ))}

            <rect className="tt-no" x="510" y={y} width="400" height="80" rx="6" />
            {step.no.map((line, lineIndex) => (
              <text className="tt-txt" key={line} x="528" y={y + 28 + lineIndex * 18}>
                {line}
              </text>
            ))}

            <path className="tt-arr" d={`M440,${y + 40} L506,${y + 40}`} />
            <text className="tt-lbl" x="458" y={y + 33}>
              no
            </text>

            <path className="tt-arr" d={`M240,${y + 80} L240,${y + 102}`} />
            <text className="tt-lbl" x="250" y={y + 95}>
              yes
            </text>
          </g>
        );
      })}

      <rect className="tt-ok" x="40" y="520" width="400" height="56" rx="6" />
      <text className="tt-hd" x="60" y="545">
        EFA is carrying the traffic
      </text>
      <text className="tt-txt" x="60" y="563">
        Now read the retransmission and impaired-connection counters.
      </text>

      <text className="tt-cap" x="470" y="596">
        Each question is one command. The order matters: a lower layer that fails makes every answer
        above it meaningless.
      </text>
    </svg>
  );
}

/**
 * Diagram 2. Which layer each failure mode lives at, and whether it is loud
 * (the job stops) or silent (the job runs and is slow or oversubscribed).
 * Idiom A (class-name prefix "fm-").
 */
function FailureLayerMapDiagram() {
  const bands = [
    {
      layer: 'AWS control plane',
      sub: 'placement and access',
      chips: [
        { t: ['Security group rule', 'missing or narrowed'], silent: true },
        { t: ['Ranks in different', 'Availability Zones'], silent: true },
        { t: ['Spot reclaim removes', 'several ranks at once'], silent: false },
      ],
    },
    {
      layer: 'Host and kernel',
      sub: 'driver, memory, paths',
      chips: [
        { t: ['Driver absent or', 'version skew'], silent: false },
        { t: ['Huge page', 'starvation'], silent: false },
        { t: ['lib versus lib64', 'install path'], silent: false },
      ],
    },
    {
      layer: 'Container and scheduler',
      sub: 'device admission',
      chips: [
        { t: ['NVIDIA plugin mofed', 'claims the uverbs nodes'], silent: true },
        { t: ['Pod never requested', 'vpc.amazonaws.com/efa'], silent: false },
      ],
    },
    {
      layer: 'libfabric',
      sub: 'provider and registration',
      chips: [
        { t: ['Provider selection', 'falls back to tcp'], silent: true },
        { t: ['Registration cache', 'thrash'], silent: true },
      ],
    },
    {
      layer: 'Collectives library',
      sub: 'NCCL and its plugin',
      chips: [
        { t: ['NCCL falls through to', 'the internal Socket net'], silent: true },
        { t: ['NCCL_TOPO_FILE set', 'by hand, plugin defers'], silent: true },
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 940 540"
      role="img"
      aria-labelledby="efa-ops-layers-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-ops-layers-title">
        EFA failure modes sit at five different layers, and the ones that stop a job outright are
        concentrated in the host and kernel layer. Most of the failures at the control plane,
        libfabric and collectives layers are silent: the job runs to completion with correct results
        while the transport is not the one you paid for.
      </title>
      <style>
        {`
          .fm-lbl { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .fm-body { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .fm-lt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: end; }
          .fm-ls { fill: #5f6b7a; font: 10px sans-serif; text-anchor: end; }
          .fm-silent { fill: #fff7ec; stroke: #a8580a; stroke-width: 1.5; }
          .fm-loud { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .fm-ct { fill: #0f1b2a; font: 10px sans-serif; text-anchor: middle; }
          .fm-key { fill: #5f6b7a; font: 11px sans-serif; }
          .fm-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="940" height="540" rx="8" fill="#ffffff" />

      {bands.map((band, index) => {
        const y = 40 + index * 88;
        return (
          <g key={band.layer}>
            <rect className="fm-lbl" x="24" y={y} width="204" height="70" rx="6" />
            <text className="fm-lt" x="214" y={y + 32}>
              {band.layer}
            </text>
            <text className="fm-ls" x="214" y={y + 50}>
              {band.sub}
            </text>

            <rect className="fm-body" x="244" y={y} width="672" height="70" rx="6" />
            {band.chips.map((chip, chipIndex) => {
              const cx = 262 + chipIndex * 218;
              return (
                <g key={chip.t[0]}>
                  <rect
                    className={chip.silent ? 'fm-silent' : 'fm-loud'}
                    x={cx}
                    y={y + 13}
                    width="200"
                    height="44"
                    rx="5"
                  />
                  <text className="fm-ct" x={cx + 100} y={y + 31}>
                    {chip.t[0]}
                  </text>
                  <text className="fm-ct" x={cx + 100} y={y + 47}>
                    {chip.t[1]}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      <rect className="fm-silent" x="244" y="486" width="26" height="16" rx="4" />
      <text className="fm-key" x="278" y="499">
        silent: the job runs and returns correct results
      </text>
      <rect className="fm-loud" x="604" y="486" width="26" height="16" rx="4" />
      <text className="fm-key" x="638" y="499">
        loud: the job stops or never starts
      </text>

      <text className="fm-cap" x="470" y="524">
        Layer assignment is ours. The individual failure modes are sourced separately in the table
        below.
      </text>
    </svg>
  );
}

interface CounterRow {
  group: string;
  counters: string;
  meaning: string;
  problem: string;
}

/** Port-scope counters, grouped the way the driver groups them by admin-queue stats type. */
const counterRows: CounterRow[] = [
  {
    group: 'Basic',
    counters: 'tx_bytes, tx_pkts, rx_bytes, rx_pkts, rx_drops',
    meaning:
      'Raw volume across the device since instance launch or the last driver reset. AWS describes rx_drops as packets that were received and then dropped.',
    problem:
      'Only rx_drops. The other four are the liveness check during bring-up: if they do not move while the job runs, the transport is not EFA.',
  },
  {
    group: 'Messages',
    counters: 'send_bytes, send_wrs, recv_bytes, recv_wrs',
    meaning: 'Two-sided send and receive work requests and the bytes they carried.',
    problem: 'No. These are volume, not health. Useful for splitting two-sided from one-sided traffic.',
  },
  {
    group: 'RDMA read',
    counters: 'rdma_read_wrs, rdma_read_bytes, rdma_read_wr_err, rdma_read_resp_bytes',
    meaning:
      'Completed one-sided read operations, bytes read, bytes sent in response, and reads that had a local or remote error.',
    problem: 'rdma_read_wr_err. Any sustained increase is a real fault, not tuning.',
  },
  {
    group: 'RDMA write',
    counters: 'rdma_write_wrs, rdma_write_bytes, rdma_write_wr_err, rdma_write_recv_bytes',
    meaning: 'The same four quantities for one-sided writes. Present only where the device reports RDMA write.',
    problem: 'rdma_write_wr_err, for the same reason.',
  },
  {
    group: 'Network (SRD)',
    counters:
      'retrans_bytes, retrans_pkts, retrans_timeout_events, unresponsive_remote_events, impaired_remote_conn_events',
    meaning:
      'AWS states these are Nitro v4 and later only. retrans_timeout_events counts times SRD traffic timed out and resulted in a network path change. impaired_remote_conn_events counts times a connection entered an impaired state, resulting in a reduced throughput rate limit.',
    problem:
      'Yes, this is the group that matters. Alert on the rate of change of the three event counters, not on the two byte and packet counters.',
  },
];

interface FailureRow {
  id: string;
  mode: string;
  symptom: string;
  detect: string;
  fix: string;
  /** Provenance for the detection claim. Rendered inline in the Detection column. */
  src: React.ReactNode;
}

const failureRows: FailureRow[] = [
  {
    id: 'tcp',
    mode: 'Silent fallback to TCP',
    symptom: 'The job completes with correct results and low throughput. No error anywhere.',
    detect:
      'NCCL prints Using network Socket instead of Using network Libfabric. The plugin line Selected provider is efa is absent. EFA tx_pkts stays flat during the run.',
    fix: 'Fix whatever made the plugin fail to load or fail to init, then re-check all three signals. Do not declare it fixed on one.',
    src: <SourceRef provenance="code-derived" code={code.usingNetwork} />,
  },
  {
    id: 'mrcache',
    mode: 'Memory registration cache thrash',
    symptom:
      'Throughput drops as the job progresses, or after a change to the allocator or to batch shape. CPU time rises in registration paths.',
    detect:
      'Cache limits are derived from the device, not fixed: the provider defaults the maximum cached count and size to 0.9 times the device reported max_mr and max_mr_size. Set FI_EFA_MR_MAX_CACHED_COUNT and FI_EFA_MR_MAX_CACHED_SIZE explicitly and compare.',
    fix: 'Stop the allocator returning memory to the kernel, so the cache monitor stops invalidating entries. Failing that, raise the cache limits or disable caching to confirm the diagnosis.',
    src: <SourceRef provenance="code-derived" code={code.mrCacheLimits} />,
  },
  {
    id: 'topo',
    mode: 'Wrong or missing topology file',
    symptom: 'Correct results, uneven rail usage, worse scaling than an identical cluster.',
    detect:
      'The plugin logs NCCL_TOPO_FILE environment variable is already set to and then defers to your file. If you see that line and you did not intend to set the variable, the plugin generated topology is being ignored.',
    fix: 'Unset NCCL_TOPO_FILE on P5 and later and let the plugin write its own into a memfd. The static XML files that ship with the plugin cover p4d, p4de and g5.48xl only.',
    src: <SourceRef provenance="code-derived" code={code.topoDefer} />,
  },
  {
    id: 'huge',
    mode: 'Huge page starvation',
    symptom: 'Init fails, or a pod is admitted and then dies inside libfabric init.',
    detect:
      'AWS states EC2 instances with the EFA driver installed pre-allocate 5128 huge pages of 2 MiB each. On Kubernetes they are a schedulable resource the pod must request.',
    fix: 'Request hugepages-2Mi in the pod spec. Watch fork-heavy data loaders. Note that setting FI_EFA_USE_HUGE_PAGE together with fork safety is an abort, not a warning.',
    src: <SourceRef provenance="documented" doc={docs.eksNode} />,
  },
  {
    id: 'sg',
    mode: 'Security group rule missing or too narrow',
    symptom: 'The cluster hangs at the first collective rather than failing at launch.',
    detect:
      'AWS states an EFA requires a security group that allows all inbound and outbound traffic to and from the security group itself. Any rule scoped to a port or a CIDR range is too narrow.',
    fix: 'Self-reference the group with protocol all, both directions. Scope the blast radius by group membership, not by narrowing the rule, and keep administrative access in a separate group.',
    src: <SourceRef provenance="documented" doc={docs.start} />,
  },
  {
    id: 'az',
    mode: 'Instances in different Availability Zones',
    symptom: 'Some rank pairs never connect. Partial hang that looks like a slow node.',
    detect:
      'AWS states EFA traffic cannot cross Availability Zones or VPCs and is not routable. There is no documented subnet restriction, so this is an Availability Zone check, not a subnet check.',
    fix: 'Pin the fleet to one Availability Zone. A cluster placement group is the documented way to get that, and AWS is explicit that it is a recommendation rather than a requirement.',
    src: <SourceRef provenance="documented" doc={docs.efa} />,
  },
  {
    id: 'spot',
    mode: 'Cascading Spot interruption',
    symptom: 'One reclamation event takes several ranks, and the tightly coupled job dies entirely.',
    detect:
      'The same Availability Zone and placement group constraint that makes EFA fast makes interruptions correlated rather than independent. This is a design consequence, not a metric you can poll.',
    fix: 'Checkpoint on a cadence you can afford to lose. Prefer Capacity Blocks or a capacity reservation for the coupled phase, and keep Spot for work that can lose a rank.',
    src: <SourceRef provenance="code-derived" doc={docs.efa} label="inference" />,
  },
  {
    id: 'skew',
    mode: 'Version skew across the four components',
    symptom: 'Works on one AMI and not another. A feature described in release notes does nothing.',
    detect:
      'Read what is installed, not what you think you installed: dkms status for the driver, the installer changelog entry for the bundle, fi_info --version for libfabric, and the plugin version in the NCCL log.',
    fix: 'Pin the whole set to one installer version across the fleet and re-verify after every AMI rebuild.',
    src: <SourceRef provenance="documented" doc={docs.changelog} />,
  },
  {
    id: 'libpath',
    mode: 'lib versus lib64 install path',
    symptom: 'A script that works on Amazon Linux fails to find libfabric on Ubuntu, or the reverse.',
    detect:
      'AWS documents both paths in the same walkthrough: /opt/amazon/efa/lib64 for Amazon Linux 2023 and /opt/amazon/efa/lib for Ubuntu 24.04 and 22.04.',
    fix: 'Resolve the path at runtime instead of hard coding it. This is the trap that survives longest because both halves of the script look correct in isolation.',
    src: <SourceRef provenance="documented" doc={docs.startNccl} />,
  },
  {
    id: 'mofed',
    mode: 'NVIDIA device plugin mofed default in containers',
    symptom: 'A pod that asked for a subset of the EFA devices gets the wrong ones, or gets all of them.',
    detect:
      'AWS states that from NVIDIA k8s-device-plugin v0.19.0 the mofed-enabled flag defaults to true, which mounts all /dev/infiniband/uverbs devices into containers requesting GPUs, conflicting with the EFA device plugin.',
    fix: 'Set mofedEnabled to false on the NVIDIA device plugin chart, or MOFED_ENABLED to false on the GPU operator. AWS states EKS Auto Mode does not enable it by default.',
    src: <SourceRef provenance="documented" doc={docs.eksDevice} />,
  },
];

export function Operations() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The cluster came up and the job is running. How do you prove the traffic is actually on EFA, and what breaks it quietly?"
          >
            Operations, Observability and Failure Modes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> almost every EFA (Elastic Fabric Adapter) failure that
            costs real money is silent. The stack is designed to degrade rather than stop. NCCL
            (NVIDIA Collective Communications Library) has an internal transport list it falls
            through, libfabric has other providers it can pick, and a job that never touches the EFA
            device still produces exactly the right numbers. It just takes longer and costs more.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> verify from the bottom of the stack upward, once, at
            bring-up, and then watch a small number of counters that only move when something is
            wrong. Everything below is a command you can run and an output shape you can compare
            against.
          </Box>
          <Alert type="info" header="Numbers this page does not give you">
            AWS publishes no numeric threshold for any EFA counter, and no latency figure for the
            device. Where a threshold would be useful, this page says UNKNOWN and tells you to
            baseline it yourself. That is deliberate: an earlier version of this dive carried
            microsecond figures with no source behind them.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four checks, bottom up. Device, driver, provider, round trip. Each one has an output shape you can compare against."
          >
            Bring-up verification
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">1. The device is present, and which one it is</Box>
          <Box variant="p">
            The EFA device shows up as an InfiniBand-class device, not as a network interface, so the
            tool is ibv_devinfo rather than ip or ethtool. Read vendor_part_id and compare it against
            the five PCI (Peripheral Component Interconnect) device identifiers the driver registers,
            0xefa0 through 0xefa4, which are 61344 through 61348 in decimal{' '}
            <SourceRef provenance="code-derived" code={code.pciIds} />.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# One line per EFA device. AWS's own monitoring examples use names of this shape.
ibv_devices

    device                 node GUID
    ------              ----------------
    rdmap0s31           0000000000000000

# vendor_part_id tells you which silicon generation you are on.
ibv_devinfo -d rdmap0s31 | grep -E 'vendor_part_id|phys_state|state'

    state:                  PORT_ACTIVE (4)
    phys_state:             LINK_UP (5)
    vendor_part_id:         61346`}</pre>
          </Box>
          <Alert type="warning" header="A device id is not a generation label">
            The driver registers five device identifiers and AWS documents four EFA versions, and no
            AWS source and no line of driver source maps one to the other{' '}
            <SourceRef provenance="code-derived" code={code.pciIds} />. Use vendor_part_id to predict
            software behaviour, and the EC2 User Guide instance table heading to name the generation{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.
          </Alert>

          <Box variant="h3">2. The driver and the installer agree</Box>
          <Box variant="p">
            The module version string is assembled in the driver from three constants plus a literal
            g suffix, unless the build defines DRV_MODULE_VERSION itself{' '}
            <SourceRef provenance="code-derived" code={code.modVersion} />. The installer builds the
            module through DKMS (Dynamic Kernel Module Support), and the package version lives in the
            DKMS configuration{' '}
            <SourceRef provenance="code-derived" code={code.dkms} />, so dkms status and modinfo are
            two views of the same build.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`modinfo efa | grep -E '^(version|filename)'
cat /sys/module/efa/version
dkms status | grep -i efa

    version:        2.17.3g
    efa/2.17.3, 6.1.0-1030-aws, x86_64: installed

# Undocumented, and the fastest accelerator peer-to-peer check there is.
# Empty means no P2P provider is loaded, which is not the same as broken.
cat /sys/class/infiniband/rdmap0s31/device/p2p

    NVIDIA`}</pre>
          </Box>
          <Box variant="p">
            That last file is worth knowing about. The driver creates a single sysfs attribute named
            p2p on the PCI device{' '}
            <SourceRef provenance="code-derived" code={code.sysfsP2p} />, and it returns the first
            available peer-to-peer provider string: NVIDIA peermem or NVIDIA{' '}
            <SourceRef provenance="code-derived" code={code.nvP2pString} />, or NEURON{' '}
            <SourceRef provenance="code-derived" code={code.neuronP2pString} />, or an empty line
            when none is loaded. AWS documents none of this, and it answers in one command a question
            that otherwise takes a full NCCL run to answer.
          </Box>

          <Box variant="h3">3. libfabric sees the provider</Box>
          <Box variant="p">
            This is the check AWS documents, in both the MPI (Message Passing Interface) and the NCCL
            getting-started walkthroughs. The command is fi_info with the provider and endpoint type
            pinned, and the documented output shows one block per EFA device{' '}
            <SourceRef provenance="documented" doc={docs.start} />.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`fi_info -p efa -t FI_EP_RDM

    provider: efa
    fabric: efa
    domain: efa_0-rdm
    version: 2.0
    type: FI_EP_RDM
    protocol: FI_PROTO_EFA

# One block per device. On a 32-card instance you expect 32 domains,
# efa_0-rdm through efa_31-rdm. Fewer means fewer attached interfaces.
fi_info -p efa -t FI_EP_RDM | grep -c '^provider: efa'`}</pre>
          </Box>
          <Alert
            type="warning"
            header="The fabric line in the AWS sample no longer matches current libfabric"
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS's documented sample output shows the fabric as EFA- followed by a link-local
                address{' '}
                <SourceRef provenance="documented" doc={docs.startNccl} />. In libfabric the fabric
                name is set to the literal string efa or efa-direct{' '}
                <SourceRef provenance="code-derived" code={code.fabricNames} />, assigned when the
                provider builds its info list{' '}
                <SourceRef provenance="code-derived" code={code.fabricAssign} />, and the EFA- form is
                built as the link attribute address instead{' '}
                <SourceRef provenance="code-derived" code={code.linkAddr} />. That change landed in
                libfabric v2.1.0, which is older than anything the current installer ships{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.startNccl}
                  code={code.fabricNames}
                  conflict="fabric: EFA-fe80::94:3dff:fe89:1b70"
                />
                .
              </Box>
              <Box variant="p">
                Do not treat the mismatch as a failure. The two lines that decide the check are
                provider: efa and type: FI_EP_RDM. The fabric line now tells you something more
                useful: which of the two fabrics you got.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="h3">4. A two-node round trip</Box>
          <Box variant="p">
            Everything above runs on one host and proves nothing about the network between two of
            them. fi_pingpong is the smallest thing that does: two copies of the same binary, one
            started as the server, one pointed at it{' '}
            <SourceRef provenance="code-derived" code={code.pingpong} />. Pass the endpoint type
            explicitly, because the default is datagram rather than the reliable datagram endpoint
            the EFA stack actually uses{' '}
            <SourceRef provenance="code-derived" code={code.pingpong} />.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# On node A
fi_pingpong -p efa -e rdm -I 1000 -S all

# On node B, pointed at node A's ENA address (the EFA device has no IP)
fi_pingpong -p efa -e rdm -I 1000 -S all 10.0.1.42

    bytes   #sent   #ack     total       time      MB/sec    usec/xfer   Mxfers/sec
    64      1k      1k       128k        0.10s       1.29       49.44       0.02
    ...

# Failure looks like this, and it is almost always the security group.
    fi_getinfo(): -61 (No data available)`}</pre>
          </Box>
          <Box variant="p">
            The reported columns are fixed: bytes, messages sent, replies received, total exchanged,
            elapsed time, throughput, average microseconds per outbound transfer, and transfers per
            second{' '}
            <SourceRef provenance="code-derived" code={code.pingpong} />. What counts as a good
            number for any of them is UNKNOWN. No AWS source publishes an expected fi_pingpong result
            for any instance type, so treat the first successful run as your baseline and compare
            later runs against it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A job that runs, returns correct results, and quietly uses TCP. This is the single most valuable thing on this page."
          >
            The silent failure that matters most
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NCCL does not fail when the EFA plugin is unusable. It falls through. After any external
            network plugins, NCCL appends two internal plugins to its own list, the InfiniBand one
            and the socket one, and it will use them{' '}
            <SourceRef provenance="code-derived" code={code.internalPlugins} />. The socket transport
            names itself Socket{' '}
            <SourceRef provenance="code-derived" code={code.socketName} />. The result is a training
            run that is correct, slow, and has no error in it anywhere.
          </Box>

          <TriageTreeDiagram />

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Signal 1: which network NCCL chose</Box>
              <Box variant="p">
                NCCL logs the name of the network it settled on once per communicator{' '}
                <SourceRef provenance="code-derived" code={code.usingNetwork} />, and the aws-ofi-nccl
                plugin registers itself as Libfabric{' '}
                <SourceRef provenance="code-derived" code={code.pluginName} />. Using network
                Libfabric is the pass, Using network Socket is the failure. The reason is usually a
                few lines earlier, where NCCL logs Failed to initialize NET plugin{' '}
                <SourceRef provenance="code-derived" code={code.pluginFailed} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Signal 2: which provider libfabric chose</Box>
              <Box variant="p">
                The plugin can load and still be handed the wrong provider. It logs its own choice:
                Selected provider is, followed by the provider name, the fabric name and the number
                of network interfaces it found{' '}
                <SourceRef provenance="code-derived" code={code.selectedProvider} />. AWS documents
                the same check, quoting the line as confirmation that EFA is active as the underlying
                provider for NCCL{' '}
                <SourceRef provenance="documented" doc={docs.startNccl} />. Grep case-insensitively:
                the AWS page quotes an older capitalised form of the string{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  doc={docs.startNccl}
                  code={code.selectedProvider}
                  conflict="NCCL INFO NET/OFI Selected Provider is efa"
                />
                .
              </Box>
            </div>
            <div>
              <Box variant="h3">Signal 3: the counters actually move</Box>
              <Box variant="p">
                Logs record intent. Counters record traffic. Sample the device counters before and
                after a short run and confirm tx_pkts and rx_pkts increased{' '}
                <SourceRef provenance="documented" doc={docs.monitor} />. This is the only signal of
                the three that a misconfigured stack cannot satisfy by merely believing it is using
                EFA. Do all three: each catches a different failure.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Signals 1 and 2, from one run.
NCCL_DEBUG=INFO mpirun ... all_reduce_perf -b 8 -e 1G -f 2 -g 1 2>&1 \
  | grep -iE 'Using network|Selected provider|Failed to initialize NET plugin'

    NCCL INFO NET/OFI Selected provider is efa, fabric is efa (found 32 nics)
    NCCL INFO Using network Libfabric

# Signal 3. Diff the counters across the run rather than reading them once.
rdma -p statistic show > /tmp/before
mpirun ... all_reduce_perf -b 1G -e 1G -f 2 -g 1
rdma -p statistic show > /tmp/after
diff /tmp/before /tmp/after`}</pre>
          </Box>

          <Alert type="info" header="The same check exists for Intel MPI, and AWS documents it">
            Setting I_MPI_DEBUG to 1 or higher prints the libfabric version and the libfabric
            provider. AWS states plainly what the values mean: if it is using EFA the value is efa,
            and if it is using TCP/IP the value is tcp;ofi_rxm{' '}
            <SourceRef provenance="documented" doc={docs.start} />. Same failure, same shape, a
            different log line.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Twenty-two port counters, a dozen device counters AWS does not document, and one tool that does not reach either."
          >
            EFA counters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The driver asks the device for statistics over the admin queue in five separate types:
            basic, messages, RDMA (Remote Direct Memory Access) read, RDMA write and network{' '}
            <SourceRef provenance="code-derived" code={code.statsTypes} />. Those five responses are
            flattened into a single list of twenty-two port-scope counters{' '}
            <SourceRef provenance="code-derived" code={code.portStats} />. AWS documents that list,
            with a description and a unit for each one, and states that the five network counters are
            available on Nitro v4 and later instance types only{' '}
            <SourceRef provenance="documented" doc={docs.monitor} />.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">The five counter groups, and which one indicates a problem</Header>}
            columnDefinitions={[
              { id: 'group', header: 'Group', cell: (item) => <strong>{item.group}</strong> },
              { id: 'counters', header: 'Counters', cell: (item) => <Box variant="code">{item.counters}</Box> },
              { id: 'meaning', header: 'What it measures', cell: (item) => item.meaning },
              { id: 'problem', header: 'Does it indicate a problem?', cell: (item) => item.problem },
            ]}
            items={counterRows}
          />

          <Box variant="h3">The network stats struct</Box>
          <Box variant="p">
            The five counters that matter arrive in one structure shared between the device and the
            driver. Reading it is the fastest way to see that these are device-reported quantities,
            not something the driver computes{' '}
            <SourceRef provenance="code-derived" code={code.netStatsStruct} />.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`struct efa_admin_network_stats {
	u64 retrans_bytes;

	u64 retrans_pkts;

	u64 retrans_timeout_events;

	u64 unresponsive_remote_events;

	u64 impaired_remote_conn_events;
};`}</pre>
          </Box>

          <Box variant="h3">How to read them</Box>
          <Box variant="p">
            AWS documents two ways. The first is the rdma command line tool, which prints every
            counter for every EFA link on the instance. The second is sysfs, one file per counter{' '}
            <SourceRef provenance="documented" doc={docs.monitor} />.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`rdma -p statistic show

    link rdmap0s31/1
        tx_bytes 0
        tx_pkts 0
        rx_bytes 0
        rx_pkts 0
        rx_drops 0
        ...
        retrans_timeout_events 0
        unresponsive_remote_events 0
        impaired_remote_conn_events 0

more /sys/class/infiniband/rdmap0s31/ports/1/hw_counters/* | cat`}</pre>
          </Box>

          <ExpandableSection
            headerText="The device-scope counters AWS does not document"
            headerDescription="Twelve more counters, and the two that fire when registration or queue creation fails"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                There is a second set. The driver defines twelve device-scope counters:
                submitted_cmds, completed_cmds, cmds_err, no_completion_cmds, keep_alive_rcvd,
                alloc_pd_err, create_qp_err, create_cq_err, reg_mr_err, alloc_ucontext_err,
                create_ah_err and mmap_err{' '}
                <SourceRef provenance="code-derived" code={code.deviceStats} />. Two more,
                alloc_mr_err and get_dma_mr_err, appear when the kernel verbs path is compiled in,
                which is the default for anything the installer builds{' '}
                <SourceRef provenance="code-derived" code={code.kverbsStats} />.
              </Box>
              <Box variant="p">
                The split is a single branch: a request for port zero returns the device counters,
                anything else returns the port counters{' '}
                <SourceRef provenance="code-derived" code={code.getHwStats} />. In sysfs terms that is
                the hw_counters directory directly under the device rather than the one under ports/1.
                These are all error counters, and none of them appears in the AWS monitoring table{' '}
                <SourceRef provenance="documented" doc={docs.monitor} />. reg_mr_err and create_qp_err
                are worth collecting: they move when memory registration or queue pair creation is
                failing, which is the shape of a huge page or registration limit problem rather than a
                network problem.
              </Box>
              <Box variant="p">
                One counter the device reports is never surfaced at all. The basic statistics
                structure carries six fields, the last being qkey_viol{' '}
                <SourceRef provenance="code-derived" code={code.basicStatsStruct} />, and the driver
                copies only the first five into the exposed counter set{' '}
                <SourceRef provenance="code-derived" code={code.fillPort} />. Queue key violations are
                counted by hardware and then dropped on the floor before they reach you.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning" header="ethtool cannot show you EFA counters">
            <SpaceBetween size="xs">
              <Box variant="p">
                The EFA driver registers an InfiniBand device and nothing else. A search of the whole
                driver source at the pinned commit for net_device, register_netdev or ethtool returns
                no matches{' '}
                <SourceRef provenance="code-derived" code={code.driverSrc} label="grep" />. There is no
                network interface for ethtool to attach to, which is why every documented retrieval
                path goes through the RDMA subsystem instead{' '}
                <SourceRef provenance="documented" doc={docs.monitor} />.
              </Box>
              <Box variant="p">
                What ethtool -S does show on an EFA with ENA (Elastic Network Adapter) interface is
                the ENA side: bw_in_allowance_exceeded, bw_out_allowance_exceeded,
                pps_allowance_exceeded, conntrack_allowance_exceeded and linklocal_allowance_exceeded{' '}
                <SourceRef provenance="code-derived" code={code.enaEthtool} />. Those are real and
                worth watching, and they are ENA allowances, not EFA. Confusing the two sends you
                looking for a fabric problem that is actually an instance networking allowance.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Ten modes, each with what you see, what you measure, and what you change. Sorted by how quiet they are."
          >
            Failure modes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <FailureLayerMapDiagram />

          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'mode', header: 'Failure mode', cell: (item) => <strong>{item.mode}</strong> },
              { id: 'symptom', header: 'Symptom', cell: (item) => item.symptom },
              {
                id: 'detect',
                header: 'Detection',
                cell: (item) => (
                  <>
                    {item.detect} {item.src}
                  </>
                ),
              },
              { id: 'fix', header: 'Remediation', cell: (item) => item.fix },
            ]}
            items={failureRows}
          />

          <ExpandableSection
            headerText="Registration cache thrash, and why the allocator decides it"
            headerDescription="The limits are device-derived, and the invalidation is driven by whatever unmaps memory"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The EFA provider caches memory registrations so that a buffer used repeatedly is
                registered once. The limits are not constants. When neither is set explicitly, the
                provider derives the maximum cached count from the device reported max_mr and the
                maximum cached size from the device reported max_mr_size, each multiplied by 0.9{' '}
                <SourceRef provenance="code-derived" code={code.mrCacheLimits} />. Two instance types
                with different registration budgets therefore get different cache sizes for the same
                code.
              </Box>
              <Box variant="p">
                The interaction that bites is with the allocator. A registration cache needs a memory
                monitor to learn when the mapping under a cached virtual address changed, and
                libfabric offers userfaultfd, memhooks and kdreg2 as the options{' '}
                <SourceRef provenance="code-derived" code={code.mrCacheEnv} />. Any allocator that
                returns pages to the kernel, rather than holding them, produces exactly the event the
                monitor is watching for, and every such event invalidates cache entries that then
                have to be registered again.
              </Box>
              <Box variant="p">
                The EFA provider has a documented conflict here worth knowing about. If the default
                monitor is memhooks and something else already installed those patches, the provider
                switches to userfaultfd on its own and logs that it did; if you asked for memhooks
                explicitly and it cannot be installed, the provider fails rather than silently
                choosing something else{' '}
                <SourceRef provenance="code-derived" code={code.mrCacheMonitor} />.
              </Box>
              <Box variant="p">
                UNKNOWN: no AWS or libfabric source gives a cache hit rate, a registration cost, or a
                threshold at which thrash becomes measurable. Diagnose it by changing one variable at
                a time. Raise FI_EFA_MR_MAX_CACHED_COUNT, or hold memory in the allocator, and see
                whether throughput moves.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Two more that are worth the code, not just the table row"
            headerDescription="The fork and huge page combination is a hard abort, and NCCL_TOPO_FILE switches the plugin off"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Huge pages and fork safety.</strong> AWS states that EC2 instances with the
                EFA driver installed pre-allocate 5128 huge pages of 2 MiB each, and that on
                Kubernetes these are a resource a job requests{' '}
                <SourceRef provenance="documented" doc={docs.eksNode} />. Asking for huge pages and
                fork safety together is not a warning. If fork support is requested through
                FI_EFA_FORK_SAFE, RDMAV_FORK_SAFE or IBV_FORK_SAFE while FI_EFA_USE_HUGE_PAGE is on,
                the provider prints a multi-line explanation ending in Your application will now abort
                and calls abort; if huge pages were not explicitly requested, it silently turns them
                off instead{' '}
                <SourceRef provenance="code-derived" code={code.forkAbort} />. The plugin's own
                environment variable guide says none of the fork variables are needed on current
                stacks and warns against RDMAV_FORK_SAFE on newer kernels{' '}
                <SourceRef provenance="code-derived" code={code.envVarDoc} />.
              </Box>
              <Box variant="p">
                <strong>Topology.</strong> On current instance types the plugin does not read a static
                file. It writes a NCCL topology into an anonymous in-memory file, points
                NCCL_TOPO_FILE at the resulting /proc/self/fd path, and skips all of that if the
                variable is already set{' '}
                <SourceRef provenance="code-derived" code={code.topoMemfd} />. The platform layer
                defers the same way, logging that the variable is already set rather than pointing at
                a topology file of its own{' '}
                <SourceRef provenance="code-derived" code={code.topoDefer} />. Copying an
                NCCL_TOPO_FILE line out of an older runbook is an instruction to ignore everything the
                plugin knows about this instance. UNKNOWN: what that costs. No AWS or plugin source
                quantifies the difference.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info" header="Two placement constraints that are not failures, but shape the ones above">
            EFA interfaces cannot be detached from a running instance. AWS states you must first stop
            the instance, and that you cannot detach an EFA from an instance in the running state{' '}
            <SourceRef provenance="documented" doc={docs.detach} />. And instance types that support
            multiple network cards can be configured with one EFA per network card, while all other
            supported types support one EFA per instance{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. Both of these turn a
            misconfiguration into a relaunch rather than a repair, which is why the bring-up checklist
            is worth running before the fleet scales.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="There is no single current EFA version. There are channels, and they disagree by two releases right now."
          >
            Version and channel discipline
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                What the installer ships <Badge color="green">shipping</Badge>
              </Box>
              <Box variant="p">
                EFA installer 1.49.0, released June 27, 2026, upgrades to libfabric 2.4.0amzn5.0, EFA
                driver 3.1.0, rdma-core 63.0 and AWS OFI NCCL Plugin 1.20.0{' '}
                <SourceRef provenance="documented" doc={docs.changelog} />. That is what a host built
                today from efa_installer.sh carries.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                What the repository carries <Badge color="grey">unreleased</Badge>
              </Box>
              <Box variant="p">
                The amzn-drivers tree is at driver r3.3.0, recorded in the DKMS configuration{' '}
                <SourceRef provenance="code-derived" code={code.dkms} />, with release notes adding
                the 0xefa4 device id, 800 and 1600 Gbps link-speed reporting, completion counters and
                memory region page sizes above 4 GB{' '}
                <SourceRef provenance="code-derived" code={code.releaseNotes} />. None of that is in
                the installer.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Never state a current version without naming the channel">
            Installer 1.49.0 ships driver 3.1.0 while the repository is at r3.3.0. Those are two
            correct answers to the same question, and the gap is functional rather than cosmetic: a
            host built from 1.49.0 does not carry the 0xefa4 device id, because that landed in r3.3.0{' '}
            <SourceRef provenance="code-derived" code={code.releaseNotes} />. The same rule applies to
            userspace: 2.4.0amzn5.0 is an AWS fork with backports and is not comparable to an upstream
            ofiwg version string{' '}
            <SourceRef provenance="documented" doc={docs.changelog} />.
          </Alert>

          <Box variant="h3">Determining what is actually installed</Box>
          <Box variant="p">
            Every one of the four components reports itself, and none of them reports the installer
            version that put it there. Read all four, then map them back to a single installer release
            using the changelog{' '}
            <SourceRef provenance="documented" doc={docs.changelog} />. If they do not map to one
            release, the host was patched piecemeal.
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# 1. Kernel driver. Two views of the same DKMS build.
modinfo efa | grep ^version
dkms status | grep -i efa

# 2. libfabric. Note WHICH libfabric: LD_LIBRARY_PATH decides.
fi_info --version
ldd $(which fi_info) | grep libfabric

# 3. aws-ofi-nccl. The plugin logs its own version at init.
NCCL_DEBUG=INFO ... 2>&1 | grep -i 'NET/OFI.*version'

# 4. The tarball you think you used. AWS publishes checksums per release.
sha256sum aws-efa-installer-1.49.0.tar.gz`}</pre>
          </Box>
          <Alert type="info" header="The libfabric on the path is not always the one you installed">
            AWS publishes an MD5 and a SHA256 for every installer release and states that if the
            checksums do not match you should not run the installation script{' '}
            <SourceRef provenance="documented" doc={docs.installerCheck} />, which makes step 4 the
            only check that identifies the installer rather than its output. Step 2 matters for the
            same reason: Intel MPI ships its own libfabric, and AWS documents the tell, since at debug
            level 1 and above the printed libfabric version is suffixed with impi when the internal
            one is in use{' '}
            <SourceRef provenance="documented" doc={docs.start} />. Container images that carry a
            second libfabric fail the same way. Resolve it with ldd, not with assumptions about the
            install path.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Five counters carry nearly all the signal, and on EKS they are exactly the ones the managed path does not collect."
          >
            What to alert on, and what is noise
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Alert on these</Box>
              <ul>
                <li>
                  retrans_timeout_events, which AWS describes as times SRD (Scalable Reliable
                  Datagram) traffic timed out and resulted in a network path change
                </li>
                <li>
                  impaired_remote_conn_events, times a connection entered an impaired state resulting
                  in a reduced throughput rate limit
                </li>
                <li>unresponsive_remote_events, times a remote connection was unresponsive</li>
                <li>rdma_read_wr_err and rdma_write_wr_err, operations with a local or remote error</li>
                <li>rx_drops, packets received and then dropped</li>
                <li>
                  On the ENA side of the same interface, the allowance counters, which explain slowdowns
                  that have nothing to do with the fabric
                </li>
              </ul>
              <Box variant="p">
                All descriptions above are AWS's own{' '}
                <SourceRef provenance="documented" doc={docs.monitor} />, except the ENA allowance
                counters, which come from the driver's ethtool table{' '}
                <SourceRef provenance="code-derived" code={code.enaEthtool} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">These are noise as alerts</Box>
              <ul>
                <li>
                  tx_bytes, rx_bytes, tx_pkts, rx_pkts, send_wrs, recv_wrs and the RDMA byte counters.
                  They are volume. A threshold on volume alerts on the workload, not on a fault
                </li>
                <li>
                  retrans_bytes and retrans_pkts on their own. Retransmission is how a multi-path
                  transport handles a lossy fabric, so a nonzero value is not by itself a fault. The
                  event counters are the sharper signal
                </li>
                <li>
                  Any absolute value. All of these are cumulative since instance launch or the last
                  driver reset{' '}
                  <SourceRef provenance="documented" doc={docs.monitor} />, so only the rate of change
                  means anything
                </li>
              </ul>
              <Box variant="p">
                UNKNOWN: the threshold. No AWS source publishes a numeric level at which any of these
                counters indicates a problem. Baseline a healthy run on your own instance type and
                alert on deviation from it, and say so when you hand the runbook over.
              </Box>
            </div>
          </ColumnLayout>

          <Alert
            type="error"
            header="On EKS, the managed metrics path drops exactly the counters worth alerting on"
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states that CloudWatch Container Insights supports all of the EFA driver metrics
                except retrans_bytes, retrans_pkts, retrans_timeout_events, unresponsive_remote_events
                and impaired_remote_conn_events{' '}
                <SourceRef provenance="documented" doc={docs.monitor} />. That exclusion list is the
                network stats group, which is the group that indicates a problem.
              </Box>
              <Box variant="p">
                The practical consequence for anyone running EFA on EKS (Elastic Kubernetes Service):
                Container Insights gives you volume dashboards and no fault signal. Collect the five
                network counters yourself from the node, out of the sysfs hw_counters directory{' '}
                <SourceRef provenance="documented" doc={docs.monitor} />, or you have observability
                that looks complete and cannot see the failure.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="p">
            One more path worth knowing about and not over-trusting. You can create a VPC (Virtual
            Private Cloud) Flow Log for an EFA, and AWS states that in the flow log entries EFA
            traffic is identified by a source and destination address that are both formatted as MAC
            addresses{' '}
            <SourceRef provenance="documented" doc={docs.monitor} />. The documented example shows the
            port and protocol fields empty, which follows from EFA traffic not being IP traffic. Flow
            logs will tell you that two instances exchanged EFA packets. They will not tell you
            anything about retransmission, impairment, or whether the run was fast.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
