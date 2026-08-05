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
 * libfabric and the EFA provider: the only supported way an application
 * reaches the EFA device, and the settings that change what it does.
 *
 * Sourcing (revamp/source-authority-standard.md): AWS statements are
 * 'documented'; anything read out of libfabric or the NCCL plugin is
 * 'code-derived' and pinned to a release tag. Where two files in the same
 * repository disagree the claim is 'doc-code-conflict', with both sides named.
 */

const ACCESSED = '2026-08-01';
const READ = '2026-08-01';

const LIBFABRIC_TAG = 'v2.6.0';
const PLUGIN_TAG = 'v1.20.0';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });

/** Pinned code reference builders. Ref is always a release tag, never a branch. */
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

const docs = {
  efa: doc('EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads', `${EC2_DOC}efa.html`, 1),
  changelog: doc('EC2 User Guide: Elastic Fabric Adapter release notes', `${EC2_DOC}efa-changelog.html`, 1),
  nixl: doc('EC2 User Guide: Get started with EFA and NIXL', `${EC2_DOC}efa-start-nixl.html`, 1),
};

const code = {
  man: lfab('man/fi_efa.7.md'),
  manOverview: lfab('man/fi_efa.7.md', 'L12-L26'),
  manEndpoints: lfab('man/fi_efa.7.md', 'L33-L57'),
  manMrModes: lfab('man/fi_efa.7.md', 'L81-L85'),
  manGda: lfab('man/fi_efa.7.md', 'L285-L305'),
  manDeviceRdma: lfab('man/fi_efa.7.md', 'L676-L681'),
  manLogging: lfab('man/fabric.7.md', 'L172-L195'),
  manLogProv: lfab('man/fabric.7.md', 'L211-L221'),
  manFiInfo: lfab('man/fi_info.1.md', 'L72-L90'),
  logDefault: lfab('src/log.c', 'L179-L181'),
  provOrder: lfab('prov/efa/src/efa_prov.c', 'L93-L176'),
  getUserInfo: lfab('prov/efa/src/efa_user_info.c', 'L626-L668'),
  fabricNames: lfab('prov/efa/src/efa.h', 'L62-L63'),
  thresholdConsts: lfab('prov/efa/src/efa.h', 'L89-L92'),
  selectRtm: lfab('prov/efa/src/rdm/efa_rdm_msg.c', 'L46-L102'),
  msgSizeDbg: lfab('prov/efa/src/rdm/efa_rdm_msg.c', 'L209-L212'),
  hmemThresholds: lfab('prov/efa/src/efa_hmem.c', 'L40-L116'),
  envDefine: lfab('prov/efa/src/efa_env.c', 'L170-L262'),
  envDefaults: lfab('prov/efa/src/efa_env.c', 'L11-L46'),
  envAbort: lfab('prov/efa/src/efa_env.c', 'L79-L96'),
  trackMr: lfab('prov/efa/src/efa_env.c', 'L257-L261'),
  cacheOpen: lfab('prov/efa/src/efa_domain.c', 'L114-L127'),
  cacheInit: lfab('prov/efa/src/rdm/efa_rdm_mr.c', 'L64-L169'),
  cacheMonitorLog: lfab('prov/efa/src/rdm/efa_rdm_mr.c', 'L111-L124'),
  cacheEnabledLog: lfab('prov/efa/src/rdm/efa_rdm_mr.c', 'L166-L167'),
  cacheParams: lfab('prov/util/src/util_mem_monitor.c', 'L244-L270'),
  cacheDefaults: lfab('prov/util/src/util_mr_cache.c', 'L48-L54'),
  forkInit: lfab('prov/efa/src/efa_fork_support.c', 'L12-L62'),
  forkAbort: lfab('prov/efa/src/efa_fork_support.c', 'L157-L192'),
  reorderConst: lfab('prov/efa/src/rdm/efa_rdm_peer.h', 'L12'),
  gdaTable: lfab('prov/efa/src/efa_domain.c', 'L868-L897'),
  ginOpen: plugin('src/rdma/gin/nccl_ofi_gin_gdaki.cpp', 'L112-L174'),
  ginSwitch: plugin('src/rdma/gin/nccl_ofi_gin_api.cpp', 'L90-L118'),
  platformEnv: plugin('src/platform-aws.cpp', 'L129-L167'),
  envManager: plugin('include/nccl_ofi_environ.h', 'L47-L58'),
  scheduler: plugin('src/nccl_ofi_scheduler.cpp', 'L77-L133'),
  schedParams: plugin('include/nccl_ofi_param.h', 'L157-L166'),
  envCheatsheet: plugin('doc/efa-env-var.md'),
};

/**
 * Diagram 1. Who calls libfabric, what the provider splits into, and where
 * rdma-core still sits. Idiom A (class-name prefix "ls-").
 */
function LibfabricStackDiagram() {
  const consumers = [
    { title: 'NCCL and RCCL', sub: 'through the aws-ofi-nccl plugin' },
    { title: 'Open MPI, Intel MPI', sub: 'through the OFI MTL and BTL' },
    { title: 'NIXL', sub: 'disaggregated inference transfers' },
  ];

  return (
    <svg
      viewBox="0 0 900 470"
      role="img"
      aria-labelledby="libfabric-stack-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="libfabric-stack-title">
        Nothing talks to the EFA device directly. NCCL, MPI and NIXL all reach it through libfabric,
        whose EFA provider exposes two different fabrics on the same hardware: the efa fabric, which
        adds wire protocols the device does not implement, and the efa-direct fabric, which hands
        calls straight to the device. Both still use rdma-core to create queues and register memory.
      </title>
      <style>
        {`
          .ls-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .ls-wide { fill: #ffffff; stroke: #0972d3; stroke-width: 1.5; }
          .ls-grp { fill: #ffffff; stroke: #414d5c; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .ls-fast { fill: #e9f7ef; stroke: #037f51; stroke-width: 1.5; }
          .ls-slow { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .ls-dev { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .ls-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .ls-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .ls-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .ls-hd { fill: #5f6b7a; font: 600 11px sans-serif; letter-spacing: 0.5px; }
          .ls-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#ls-head); }
        `}
      </style>
      <defs>
        <marker id="ls-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="900" height="470" rx="8" fill="#ffffff" />

      <text className="ls-hd" x="40" y="34">
        APPLICATION AND MIDDLEWARE
      </text>

      {consumers.map((consumer, index) => {
        const x0 = 40 + index * 280;
        return (
          <g key={consumer.title}>
            <rect className="ls-box" x={x0} y="44" width="250" height="54" rx="6" />
            <text className="ls-t" x={x0 + 125} y="68">
              {consumer.title}
            </text>
            <text className="ls-s" x={x0 + 125} y="86">
              {consumer.sub}
            </text>
            <path className="ls-arr" d={`M${x0 + 125},98 L${x0 + 125},124`} />
          </g>
        );
      })}

      <rect className="ls-wide" x="40" y="126" width="810" height="48" rx="6" />
      <text className="ls-t" x="445" y="146">
        libfabric core: fi_getinfo, fi_fabric, fi_domain, fi_endpoint, fi_send, fi_cq_read
      </text>
      <text className="ls-s" x="445" y="164">
        one portable API, many providers. The provider is chosen from the fi_info list, not compiled in.
      </text>
      <path className="ls-arr" d="M445,174 L445,192" />

      <rect className="ls-grp" x="40" y="194" width="810" height="124" rx="8" />
      <text className="ls-t" x="445" y="214">
        EFA provider (prov/efa)
      </text>

      <rect className="ls-slow" x="64" y="226" width="370" height="80" rx="6" />
      <text className="ls-t" x="249" y="250">
        efa fabric
      </text>
      <text className="ls-s" x="249" y="270">
        adds wire protocols: ordering, unlimited
      </text>
      <text className="ls-s" x="249" y="288">
        message size, tagging, atomics
      </text>

      <rect className="ls-fast" x="456" y="226" width="370" height="80" rx="6" />
      <text className="ls-t" x="641" y="250">
        efa-direct fabric
      </text>
      <text className="ls-s" x="641" y="270">
        one work queue entry per libfabric call,
      </text>
      <text className="ls-s" x="641" y="288">
        device limits exposed as they are
      </text>

      <path className="ls-arr" d="M249,318 L249,340" />
      <path className="ls-arr" d="M641,318 L641,340" />

      <rect className="ls-wide" x="40" y="342" width="810" height="48" rx="6" />
      <text className="ls-t" x="445" y="362">
        rdma-core: libibverbs plus the efadv EFA extensions
      </text>
      <text className="ls-s" x="445" y="380">
        queue pair and completion queue creation, memory registration, queue attribute queries
      </text>
      <path className="ls-arr" d="M445,390 L445,408" />

      <rect className="ls-dev" x="40" y="410" width="810" height="44" rx="6" />
      <text className="ls-tw" x="445" y="437">
        EFA device
      </text>
    </svg>
  );
}

/**
 * Diagram 2. The size ladder that picks a two-sided protocol, and how it
 * collapses for accelerator memory. Idiom A (class-name prefix "pl-").
 */
function ProtocolLadderDiagram() {
  const hostBands = [
    { label: 'eager', range: 'fits in one request packet', w: 190, fill: '#e9f7ef', stroke: '#037f51' },
    { label: 'medium', range: 'under the medium threshold', w: 230, fill: '#f2f8fd', stroke: '#0972d3' },
    { label: 'longcts', range: 'under the min read threshold', w: 220, fill: '#fdf3ec', stroke: '#ec7211' },
    { label: 'longread', range: 'at or above min read size', w: 180, fill: '#efe7fb', stroke: '#6f4cc4' },
  ];
  const deviceBands = [
    { label: 'eager', range: 'fits in one request packet', w: 260, fill: '#e9f7ef', stroke: '#037f51' },
    { label: 'runting read', range: 'everything above it, medium is switched off', w: 560, fill: '#efe7fb', stroke: '#6f4cc4' },
  ];

  const renderBands = (
    bands: { label: string; range: string; w: number; fill: string; stroke: string }[],
    y: number
  ) => {
    let x = 40;
    return bands.map((band) => {
      const bx = x;
      x += band.w;
      return (
        <g key={`${y}-${band.label}`}>
          <rect x={bx} y={y} width={band.w} height="56" rx="6" fill={band.fill} stroke={band.stroke} strokeWidth="1.5" />
          <text className="pl-t" x={bx + band.w / 2} y={y + 24}>
            {band.label}
          </text>
          <text className="pl-s" x={bx + band.w / 2} y={y + 43}>
            {band.range}
          </text>
        </g>
      );
    });
  };

  return (
    <svg
      viewBox="0 0 900 400"
      role="img"
      aria-labelledby="efa-protocol-ladder-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-protocol-ladder-title">
        The efa fabric picks a two-sided protocol by message size, and the ladder is different for
        host memory and for accelerator memory. Host memory walks eager, then medium, then a
        credit-based long protocol, then a read-based one. For CUDA, ROCr and Neuron memory the
        medium band is switched off entirely, so anything past eager goes straight to the read-based
        runting protocol.
      </title>
      <style>
        {`
          .pl-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .pl-s { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .pl-hd { fill: #0f1b2a; font: 600 13px sans-serif; }
          .pl-hs { fill: #5f6b7a; font: 11px sans-serif; }
          .pl-ax { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#pl-head); }
          .pl-note { fill: #5f6b7a; font: 11px sans-serif; }
        `}
      </style>
      <defs>
        <marker id="pl-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="900" height="400" rx="8" fill="#ffffff" />

      <text className="pl-hd" x="40" y="42">
        Host memory
      </text>
      <text className="pl-hs" x="180" y="42">
        four protocols, three thresholds
      </text>
      {renderBands(hostBands, 56)}
      <path className="pl-ax" d="M40,128 L850,128" />
      <text className="pl-note" x="40" y="148">
        message size, increasing to the right. Band widths are illustrative, not to scale.
      </text>

      <text className="pl-hd" x="40" y="206">
        CUDA, ROCr and Neuron memory
      </text>
      <text className="pl-hs" x="290" y="206">
        two protocols, one threshold
      </text>
      {renderBands(deviceBands, 220)}
      <path className="pl-ax" d="M40,292 L850,292" />
      <text className="pl-note" x="40" y="312">
        The medium threshold is zero here, which removes the band. A striped NCCL payload lands in the right-hand band.
      </text>

      <rect x="40" y="330" width="810" height="52" rx="6" fill="#ffffff" stroke="#879596" strokeWidth="1.5" />
      <text className="pl-note" x="60" y="354">
        The read-based branch is checked first, not last, and it has three conditions besides size. When any of
      </text>
      <text className="pl-note" x="60" y="374">
        them fails, the size ladder above applies instead.
      </text>
    </svg>
  );
}

interface ThresholdRow {
  name: string;
  host: string;
  gpu: string;
}

const thresholdRows: ThresholdRow[] = [
  {
    name: 'FI_EFA_INTER_MAX_MEDIUM_MESSAGE_SIZE',
    host: '65536',
    gpu: '0, which removes the medium band. Overriding it only produces a warning',
  },
  {
    name: 'FI_EFA_INTER_MIN_READ_MESSAGE_SIZE',
    host: '1048576',
    gpu: 'one byte past the largest eager message, so almost everything is read-based',
  },
  {
    name: 'FI_EFA_RUNT_SIZE',
    host: '0, with the comment that runting is untested on system memory',
    gpu: '307200 for CUDA and ROCr, 131072 for Neuron',
  },
];

interface Tunable {
  id: string;
  name: string;
  effect: string;
  advice: string;
  status: 'set' | 'rare' | 'never';
}

/** advice is prefixed with its own source: Cheatsheet, Provider code, Core code or Our reading. */
const tunables: Tunable[] = [
  {
    id: 'provider',
    name: 'FI_PROVIDER=efa',
    effect: 'Restricts libfabric to the EFA provider.',
    advice: 'Cheatsheet: applies only to aws-ofi-nccl 1.5.0 and older, scoped that way explicitly.',
    status: 'never',
  },
  {
    id: 'devrdma',
    name: 'FI_EFA_USE_DEVICE_RDMA',
    effect: 'Forces device RDMA on, or forces libfabric to emulate every fi_rma operation.',
    advice:
      'Cheatsheet: do not set for libfabric 1.18.0 or newer with aws-ofi-nccl 1.7.0 or newer. Setting it to 1 on hardware without RDMA aborts the application.',
    status: 'never',
  },
  {
    id: 'forksafe',
    name: 'FI_EFA_FORK_SAFE',
    effect: 'Turns on rdma-core fork support and turns off internal use of huge pages.',
    advice:
      'Cheatsheet: not needed anymore, and the plugin has set it for supported libfabric versions since at least v1.2. Only relevant on an old kernel with an old rdma-core.',
    status: 'rare',
  },
  {
    id: 'rdmav',
    name: 'RDMAV_FORK_SAFE and every other RDMAV variable',
    effect: 'The rdma-core equivalent, applied below libfabric.',
    advice:
      'Cheatsheet, bluntly: do not use. The two look the same but behave very differently, and on newer kernels this one can break things.',
    status: 'never',
  },
  {
    id: 'hugepage',
    name: 'FI_EFA_USE_HUGE_PAGE',
    effect: 'Controls whether internal buffers come from huge pages.',
    advice:
      'Cheatsheet: set to 0 when fork calls fail with out-of-memory, and it names the symptom, multi-process data loaders hitting a cannot-allocate-memory error.',
    status: 'rare',
  },
  {
    id: 'minread',
    name: 'FI_EFA_INTER_MIN_READ_MESSAGE_SIZE',
    effect: 'The size at or above which two-sided sends switch to the read-based protocol.',
    advice:
      'Provider code: 1048576 on host memory, already one byte past eager on CUDA, ROCr and Neuron, so raising it there pushes traffic back onto the credit-based long protocol. Our reading: a host-memory knob, and one to baseline first.',
    status: 'set',
  },
  {
    id: 'runt',
    name: 'FI_EFA_RUNT_SIZE',
    effect: 'How many bytes the read-based protocol sends eagerly before the receiver reads the rest.',
    advice:
      'Provider code: the help text quotes 307200, the constant applied to CUDA and ROCr. Host memory starts at 0, Neuron at 131072. Our reading: leave it where the initialiser puts it without a measured accelerator-memory profile.',
    status: 'set',
  },
  {
    id: 'mrcache',
    name: 'FI_EFA_MR_CACHE_ENABLE',
    effect: 'Turns the provider memory registration cache on or off.',
    advice:
      'Our reading: leave it on. Turning it off does more than slow registration down, it changes which send protocol the provider may pick.',
    status: 'set',
  },
  {
    id: 'mrcount',
    name: 'FI_MR_CACHE_MAX_COUNT and FI_MR_CACHE_MAX_SIZE',
    effect: 'Core libfabric caps on the shared registration cache, in entries and in bytes.',
    advice:
      'Core code: count zero disables caching outright. Our reading: reach for these only when the cache is provably the problem, and read the live caps off the info log first.',
    status: 'rare',
  },
  {
    id: 'monitor',
    name: 'FI_MR_CACHE_MONITOR',
    effect: 'How libfabric learns a cached registration is stale: userfaultfd, memhooks, kdreg2 or disabled.',
    advice:
      'Our reading: the one FI_MR setting worth knowing by name, because a wrong monitor is a correctness problem rather than a performance one.',
    status: 'rare',
  },
  {
    id: 'nccl',
    name: 'NCCL_BUFFSIZE, NCCL_MIN_CHANNELS, NCCL_SOCKET_NTHREADS, NCCL_NSOCKS_PERTHREAD',
    effect: 'NCCL-side transport tuning.',
    advice:
      'Cheatsheet: the first two are documented as leave out to use the default, the last two as not applicable for EFA. The plugin already pins NCCL_BUFFSIZE per platform.',
    status: 'never',
  },
];

function statusBadge(status: Tunable['status']) {
  if (status === 'set') return <Badge color="green">worth knowing</Badge>;
  if (status === 'rare') return <Badge color="blue">only with evidence</Badge>;
  return <Badge color="red">do not set</Badge>;
}

export function Libfabric() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="How an application reaches the EFA device, and which of libfabric's several hundred settings change what it does."
          >
            libfabric and the EFA Provider
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              libfabric is the API to the EFA (Elastic Fabric Adapter) device.
            </strong>{' '}
            It is a portable fabric API with a provider per transport, and the EFA provider is how
            an application reaches this one. AWS states the shape directly: EFA integrates with
            Libfabric, and it supports NCCL (NVIDIA Collective Communications Library) and NIXL
            (NVIDIA Inference Xfer Library) for AI and ML applications, and Open MPI (Message
            Passing Interface) 4.1 and later and Intel MPI 2019 Update 5 and later for HPC
            applications{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. AWS also states what that buys:
            those libraries interface directly with the Libfabric API, and the Libfabric API
            bypasses the operating system kernel and communicates directly with the EFA device to
            put packets on the network{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. The bypass is a property of the
            provider, so it is reached by going through libfabric.
          </Box>
          <Box variant="p">
            Every EFA question eventually becomes a libfabric question: which fabric was selected,
            which endpoint type, which protocol the provider chose for a message size, whether a
            registration came out of the cache. This section answers those four in order, then the
            two that decide whether the answers apply to your host: which version you are running,
            and which settings are worth touching.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One device, two fabrics, three consumers, and a provider chosen at runtime from a list."
          >
            The stack: one API, two fabrics, one device
          </Header>
        }
      >
        <SpaceBetween size="m">
          <LibfabricStackDiagram />

          <Box variant="p">
            libfabric's own EFA man page frames the split. The efa fabric implements a set of wire
            protocols to support more capabilities and features beyond the EFA device capabilities.
            The efa-direct fabric offloads all libfabric data plane calls to the device directly
            without wire protocols, providing a fast path to hand off application requests to the
            device{' '}
            <SourceRef provenance="code-derived" code={code.manOverview} />. The two names are
            string constants in the provider header{' '}
            <SourceRef provenance="code-derived" code={code.fabricNames} />, and you select between
            them with the name field in the fabric attributes. That is the whole switch. Same
            device, same driver, two different amounts of software between your call and the wire.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why efa-direct comes back first, four commands that show what your host actually offers, and the switch that makes the provider explain itself."
          >
            fi_info and provider selection
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An application calls fi_getinfo with hints and gets back a linked list of matching
            options, and the fi_info command line tool prints that same list. Selection happens
            there, so the order of the list is a design decision. The provider builds it in three
            passes and puts efa-direct first on purpose, saying so in its own comment: the EFA
            direct provider is more performant if the application can use it, therefore the
            efa-direct info objects should be returned before efa rdm or dgram, so we populate the
            efa-direct info objects first{' '}
            <SourceRef provenance="code-derived" code={code.provOrder} />. After that pass it
            appends one reliable-datagram entry per device on the efa fabric, then one datagram
            entry per device{' '}
            <SourceRef provenance="code-derived" code={code.provOrder} />. Three entries per device,
            so 96 on a 32-device instance before any hint trims them, and an application that takes
            the first one gets efa-direct on the first device. The NCCL plugin relies on exactly
            that: its GPU-initiated path comments that on libfabric 2.4 and newer the proxy plugin
            selects the efa-direct fabric by matching against the first entry{' '}
            <SourceRef provenance="code-derived" code={code.ginOpen} />.
          </Box>
          <Box variant="p">
            Filtering happens in one loop: each candidate is checked against the hints, then against
            source address, fabric name, domain name and PCI (Peripheral Component Interconnect) bus
            id in turn, and anything failing a check is skipped{' '}
            <SourceRef provenance="code-derived" code={code.getUserInfo} />. Those are the fields to
            put in hints when you want one specific device.
          </Box>

          <Box variant="p">
            The provider also says what it decided at startup, which monitor it chose, what cache
            caps it computed, which settings it is ignoring. It says none of it by default, because
            the core log level ships at warn{' '}
            <SourceRef provenance="code-derived" code={code.logDefault} />. FI_LOG_LEVEL takes warn,
            trace, info or debug, FI_LOG_PROV filters to named providers, FI_LOG_SUBSYS filters to a
            subsystem, and FI_LOG_LOCATION sends the stream to a file or a directory instead of
            standard error{' '}
            <SourceRef provenance="code-derived" code={code.manLogging} />{' '}
            <SourceRef provenance="code-derived" code={code.manLogProv} />.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# 1. Every EFA endpoint libfabric can offer. One block per combination
#    of fabric name, domain and endpoint type.
fi_info -p efa

# 2. Just the fast fabric. If this prints nothing, efa-direct is not
#    available here and every "use efa-direct" instruction is moot.
fi_info -p efa -f efa-direct -t FI_EP_RDM

# 3. Count the devices libfabric sees on that fabric. Compare it with
#    the EFA interface count you attached at launch. They should match.
fi_info -p efa -f efa-direct -t FI_EP_RDM | grep -c 'domain:'

# 4. Every FI_EFA setting the installed provider understands, with the
#    help text and default compiled into your build.
fi_info -g FI_EFA

# 5. Startup decisions, EFA provider only. A directory gives one
#    ofi_<pid>.log per process. Info level is where the provider reports
#    the monitor it picked and the cache caps it computed; warn shows neither.
mkdir -p /tmp/ofi-logs
FI_LOG_LEVEL=info FI_LOG_PROV=efa FI_LOG_LOCATION=/tmp/ofi-logs ./your_job

# 6. Per-send sizes, which is how you learn what your workload really posts.
#    Debug output exists only in a build compiled with debugging enabled,
#    so an empty file here means your build, not your job.
FI_LOG_LEVEL=debug FI_LOG_PROV=efa FI_LOG_SUBSYS=ep_data ./your_job`}</pre>
          </Box>

          <Alert type="info" header="Trust the binary in front of you, and log one run per cluster image">
            Command 4 prints the help text compiled into the provider you installed. Because AWS
            ships a fork of libfabric rather than upstream tags, that is the only defaults list
            guaranteed to describe your host, and it is still a help string: for two settings the
            provider compiles in a different value, and both are named at the end of this section.
            Commands 5 and 6 apply the same idea to behaviour. Info is cheap enough for a first job
            and detailed enough to answer most of what follows, so keep one logged run per image as
            the baseline. Debug is the opposite, marked in the man page as high traffic likely to
            affect application performance and available only in a build compiled with debugging
            enabled{' '}
            <SourceRef provenance="code-derived" code={code.manLogging} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which endpoint your collectives run on, and what asking for efa-direct puts on your side of the line."
          >
            Endpoint types
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An endpoint is the libfabric object you post sends and receives to. The type you ask
            for in your hints decides which operations exist, how large a message can be, and what
            ordering you get. The EFA provider offers two, and the choice is effectively made for
            you by what your middleware needs.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                FI_EP_RDM <Badge color="green">what collectives use</Badge>
              </Box>
              <Box variant="p">
                The man page describes FI_EP_RDM as running on a new Scalable (unordered) Reliable
                Datagram protocol (SRD) with more complete error handling than typically seen with
                other Reliable Datagram implementations. On the efa fabric it supports FI_MSG,
                FI_TAGGED, FI_SEND, FI_RECV, FI_RMA, FI_WRITE, FI_READ, FI_ATOMIC, FI_DIRECTED_RECV,
                FI_MULTI_RECV and FI_SOURCE, gives send-after-send ordering, and has no maximum
                message size for any operation{' '}
                <SourceRef provenance="code-derived" code={code.manEndpoints} />. That last property
                is what a collectives library needs: it hands over a multi-megabyte buffer and the
                provider deals with it.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                FI_EP_DGRAM <Badge color="grey">single-packet messages</Badge>
              </Box>
              <Box variant="p">
                The datagram endpoint supports only FI_MSG, caps messages at the hardware maximum
                transmission unit of approximately 8 KiB, requires FI_MSG_PREFIX mode, and has no
                wait objects{' '}
                <SourceRef provenance="code-derived" code={code.manEndpoints} />. Every collective
                algorithm needs tagging, RMA (remote memory access), messages longer than one packet
                or a blocking completion read, so NCCL, MPI and NIXL all sit on RDM. This one serves
                applications that want a raw unreliable datagram, and it is the single place the
                word unreliable applies to EFA.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="Same endpoint type, a different contract on efa-direct">
            On efa-direct an RDM endpoint supports FI_MSG, FI_SEND, FI_RECV, FI_RMA, FI_WRITE,
            FI_READ and FI_SOURCE, leaves send-after-send ordering to the application, caps
            messages at the device
            transmission unit and remote memory operations at the device maximum RDMA (Remote
            Direct Memory Access) size, and requires the FI_CONTEXT2 mode{' '}
            <SourceRef provenance="code-derived" code={code.manEndpoints} />. It also supports
            FI_MR_LOCAL only, so the application registers its own buffers, where the efa fabric
            accepts unregistered buffers for send and receive{' '}
            <SourceRef provenance="code-derived" code={code.manMrModes} />. Asking for efa-direct is
            asking to take that work on.
          </Alert>

          <Box variant="p">
            What you get back for that work, beyond the shorter path, is GPUDirect Async. It is a
            handover rather than an offload: an application asks for FI_EFA_GDA_OPS in the name
            parameter of a domain ops open, libfabric supplies the address handle, the queue buffers
            and the doorbells, and GPU-side code builds and rings the work queue entries itself{' '}
            <SourceRef provenance="code-derived" code={code.manGda} />, with the handler returning a
            not-supported error on any other fabric{' '}
            <SourceRef provenance="code-derived" code={code.gdaTable} />. Calling that table is work
            for whoever writes the plugin. What reaches an operator is one failure signature:
            aws-ofi-nccl v1.20.0 is opt-in twice over, a build that includes GDAKI support and
            OFI_NCCL_GIN_TYPE set to GDAKI at run time, and a binary built without that support
            fails initialisation loudly instead of falling back{' '}
            <SourceRef provenance="code-derived" code={code.ginSwitch} />. A job that dies at plugin
            initialisation right after someone added OFI_NCCL_GIN_TYPE has a build problem, not a
            fabric one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which wire protocol your sends actually use, why a GPU job only ever sees two of them, and which knobs are worth touching."
          >
            Eager, medium and rendezvous
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the efa fabric the provider picks a wire protocol for every two-sided send, from the
            message length and the kind of memory the buffer lives in. Knowing the ladder is how
            you predict which one a given send takes, and which setting would move it.
          </Box>

          <ProtocolLadderDiagram />

          <Box variant="p">
            The selection function's own comment names the options: four types of protocol can be
            used, eager, medium, longcts and longread, each with a tagged and non-tagged version and
            some with a delivery-complete version{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />. It checks the read-based
            branch first, and that branch turns on four conditions at once with size only one of
            them. It fires when peer to peer is usable, the message length is at or above the
            minimum read message size for this memory type, the peer supports RDMA read, and either
            the application passed a memory descriptor or the registration cache is available.
            Everything else lands on the size ladder: eager if the message fits in one request
            packet, medium if it fits under the medium threshold, longcts above that{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />. That last condition is
            the one people trip over, and it is why the registration cache appears twice in this
            section.
          </Box>

          <Box variant="h3">Where the thresholds are actually set</Box>
          <Box variant="p">
            They live outside the selection function, one set per memory interface, initialised once
            with values that differ by interface: host memory reads all four from the environment,
            while the accelerator branches hard-code the first two{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />. A medium threshold
            of zero is what removes the medium band, and the provider says so when you override it,
            warning that the environment variable was set but only eager and runting read protocols
            are supported for that interface over EFA{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">The three thresholds that move the ladder</Header>}
            columnDefinitions={[
              { id: 'name', header: 'Setting', cell: (item) => <strong>{item.name}</strong> },
              { id: 'host', header: 'Host memory default', cell: (item) => item.host },
              { id: 'gpu', header: 'CUDA, ROCr and Neuron', cell: (item) => item.gpu },
            ]}
            items={thresholdRows}
          />
          <Box variant="small" color="text-body-secondary">
            Host defaults are the ones the provider registers with its own parameter definitions{' '}
            <SourceRef provenance="code-derived" code={code.envDefine} />, and the three constants
            behind them are declared together in one header{' '}
            <SourceRef provenance="code-derived" code={code.thresholdConsts} />. The accelerator
            column is the branch structure of the threshold initialiser{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />. The 307200 that
            fi_info prints for FI_EFA_RUNT_SIZE is that CUDA and ROCr constant, which is why the
            printed default and the host-memory value differ.
          </Box>

          <Box variant="h3">Which band your traffic lands in</Box>
          <Box variant="p">
            The ladder is walked with the size libfabric is handed, and under NCCL that is not the
            size of the collective. Two steps sit in between and the plugin sets both. The first is
            the NCCL-side buffer: on p5, p5e, p5en, p6-b200 and the later p-series entries the
            plugin inserts NCCL_BUFFSIZE=8388608 and NCCL_P2P_NET_CHUNKSIZE=524288 from a
            per-platform table{' '}
            <SourceRef provenance="code-derived" code={code.platformEnv} />, and it inserts them
            without the overwrite flag{' '}
            <SourceRef provenance="code-derived" code={code.envManager} />. On a launch that does
            not set them itself, those sizes come from the instance family rather than from your
            script.
          </Box>
          <Box variant="p">
            The second is the plugin's scheduler, which decides how one message reaches the rails.
            Below the small-message threshold, 64 bytes by default, it goes whole to a single rail,
            round robin. At or above it the message is striped: the stripe count is the size divided
            by a minimum stripe size defaulting to 131072 bytes, capped at the rail count and then
            reduced to the largest factor of the rail count that does not exceed it, with each
            stripe rounded up to the alignment the caller passes, given in the comment as 128 bytes{' '}
            <SourceRef provenance="code-derived" code={code.scheduler} />{' '}
            <SourceRef provenance="code-derived" code={code.schedParams} />. Put the two together
            and the number that meets the ladder is a per-rail stripe on the order of the minimum
            stripe size, rising towards the message size divided by the rail count once the message
            is large enough to use every rail, rather than the multi-megabyte buffer the collective
            started with. That composition is our reading rather than a stated rule: the code gives
            the two mechanisms separately, and the arithmetic for a specific job is yours.
          </Box>

          <Alert type="success" header="A GPU training job uses two of the four protocols">
            Those stripes come out of GPU memory, where the medium band is zero and the minimum read
            size is one byte past eager, so anything under roughly one packet is eager and
            everything else is runting read, provided peer to peer is usable, the peer supports RDMA
            read, and either a descriptor or the registration cache is available. The four-rung
            host-memory ladder above describes traffic a collectives job does not generate. That is
            why FI_EFA_INTER_MAX_MEDIUM_MESSAGE_SIZE is the most commonly copied EFA setting that
            does nothing, and FI_EFA_RUNT_SIZE is the one that shapes the path.
          </Alert>

          <Box variant="h3">What you would see, and what to do about it</Box>
          <Box variant="p">
            Most ways to land on the wrong rung announce themselves: an inapplicable threshold gets
            a warning naming the variable, a monitor the host cannot give you fails domain creation,
            and a deprecated name aborts the process. The silent one is the registration cache. Turn
            it off on a send with no application-supplied descriptor and the read-based branch stops
            being eligible, with no log line at any level, and the send falls to the credit-based
            long protocol{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />.
          </Box>
          <Box variant="p">
            No AWS or upstream source located during this research states what a healthy protocol
            mix looks like for a workload, so there is no number here to compare against. Baseline
            it instead: capture one run at debug level with FI_LOG_SUBSYS set to ep_data, where the
            provider prints the peer, the size and the message id of every send it starts{' '}
            <SourceRef provenance="code-derived" code={code.msgSizeDbg} />, keep that size
            distribution as the reference for the cluster image, and compare after a plugin upgrade,
            an instance family change, or any edit to the settings above. An empty log means the
            build has debugging compiled out, and the fallback is the info-level startup record in
            the next container.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why leaving the cache on changes which wire protocol you get, how to read the caps it chose, and the three messages that end a job outright."
          >
            The memory registration cache and fork safety
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">Why the cache exists</Box>
          <Box variant="p">
            Registering memory is a kernel round trip that pins pages and programs the device, and a
            collectives library reuses the same buffers thousands of times, so the provider keeps
            registrations alive. It opens the cache only when the application did not ask for
            FI_MR_LOCAL and the cache is enabled, with the stated reason that explicit registrations
            from an external application should never go in the cache{' '}
            <SourceRef provenance="code-derived" code={code.cacheOpen} />. Register your own buffers
            and the provider stays out of the way.
          </Box>
          <Box variant="p">
            Its caps come from the device: with neither limit set, the provider computes them from
            the device reported maximum registration count and size{' '}
            <SourceRef provenance="code-derived" code={code.cacheInit} />. Above those sit the core
            libfabric caps, FI_MR_CACHE_MAX_COUNT and FI_MR_CACHE_MAX_SIZE, shipping at 1024
            entries{' '}
            <SourceRef provenance="code-derived" code={code.cacheDefaults} />, where setting the
            count to zero disables memory registration caching outright{' '}
            <SourceRef provenance="code-derived" code={code.cacheParams} />. You do not have to
            derive the numbers it settled on: at info level the provider prints the caps as it opens
            the cache{' '}
            <SourceRef provenance="code-derived" code={code.cacheEnabledLog} />, and a run with no
            such line opened no cache at all. A narrower knob covers a registration that seems to
            outlive its buffer: FI_EFA_TRACK_MR detects whether any outstanding operation still
            references a memory region when it is closed, and describes itself as being for
            debugging memory registration issues, off by default{' '}
            <SourceRef provenance="code-derived" code={code.trackMr} />. That one is a reproduction
            tool, not something to carry into a production launch script.
          </Box>

          <Box variant="h3">The monitor, and the Open MPI collision</Box>
          <Box variant="p">
            A registration cache is only correct if it notices when the application frees or remaps
            the memory underneath an entry. That is the monitor's job. libfabric offers
            userfaultfd, memhooks and kdreg2, plus disabled, selected with FI_MR_CACHE_MONITOR{' '}
            <SourceRef provenance="code-derived" code={code.cacheParams} />.
          </Box>
          <Box variant="p">
            The EFA provider carries a long comment about why this is delicate. Both Open MPI and
            libfabric use the same live binary patching to enable memory monitoring, and the
            patching technique only allows a single winning patch, so the libfabric memhooks monitor
            will not overwrite a previous patch and instead returns an already-in-use error{' '}
            <SourceRef provenance="code-derived" code={code.cacheInit} />. When it detects that, it
            logs a potential memhooks monitor conflict and switches to userfaultfd, unless you asked
            for memhooks explicitly, in which case it fails domain creation rather than run with a
            broken configuration{' '}
            <SourceRef provenance="code-derived" code={code.cacheInit} />. Each of those outcomes
            is distinguishable from an info-level log, where libfabric wraps every message with the
            provider, subsystem, function and level and leaves the message body as the stable part
            to search for{' '}
            <SourceRef provenance="code-derived" code={code.cacheMonitorLog} />.
          </Box>
          <Alert type="warning" header="Leave FI_MR_CACHE_MONITOR unset under Open MPI">
            The automatic switch to userfaultfd exists because the conflict is real and version
            dependent. Pinning the monitor to memhooks removes that fallback and puts the outcome
            on you. This is the one FI_MR setting where a wrong value is a correctness problem
            rather than a slow one.
          </Alert>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`cd /tmp/ofi-logs

# Cache opened, with the caps the provider computed. Info level only.
# Absent means no cache: FI_EFA_MR_CACHE_ENABLE off, or the application
# asked for FI_MR_LOCAL. Both change protocol selection.
grep 'EFA MR cache enabled' ofi_*.log

# Open MPI won the memhooks race. Info level, and benign: the provider
# has already fallen back to userfaultfd on its own.
grep 'Detected potential memhooks monitor conflict' ofi_*.log

# FI_MR_CACHE_MONITOR=memhooks was pinned and lost that race. Warn
# level, and fi_domain fails, so the job dies at initialisation.
grep 'Memhooks monitor requested via FI_MR_CACHE_MONITOR' ofi_*.log`}</pre>
          </Box>

          <Box variant="h3">Fork safety</Box>
          <Box variant="p">
            Registered pages and fork interact badly: on older kernels a child process could see
            pages the device still owns. The provider resolves this at startup: if rdma-core
            reports that
            fork support is not needed, it stops there, otherwise it checks FI_EFA_FORK_SAFE,
            RDMAV_FORK_SAFE and IBV_FORK_SAFE and turns fork support on if any of them is set{' '}
            <SourceRef provenance="code-derived" code={code.forkInit} />.
          </Box>
          <Box variant="p">
            Turning it on has a cost the code states plainly: rdma-core fork support does not work
            for huge pages, and while huge page fork support can be activated it is extremely
            expensive and would defeat the purpose of using huge pages, so the provider simply
            disables huge page usage when fork support is enabled{' '}
            <SourceRef provenance="code-derived" code={code.forkInit} />. Ask for both explicitly
            and the process aborts, saying the combination will cause memory corruption{' '}
            <SourceRef provenance="code-derived" code={code.forkInit} />. A second abort path covers
            the application forking while unsafe: an installed handler prints a message naming the
            two supported fixes, FI_EFA_FORK_SAFE=1 with rdma-core v31.1 or later, or Linux kernel
            5.13 and later with rdma-core v35.0 and later{' '}
            <SourceRef provenance="code-derived" code={code.forkAbort} />. On any recent kernel the
            second condition is already met, which is why the plugin cheatsheet says the variable is
            not needed anymore{' '}
            <SourceRef provenance="code-derived" code={code.envCheatsheet} />.
          </Box>

          <Alert type="info" header="Three abort messages that each mean one specific thing">
            <SpaceBetween size="xs">
              <Box variant="p">
                Those two aborts and the deprecated-name abort{' '}
                <SourceRef provenance="code-derived" code={code.envAbort} /> go to standard error
                with fprintf rather than through the logger, so they appear whatever FI_LOG_LEVEL is
                set to and they survive in a job scheduler's captured output. Each wording is
                distinct, which makes the tail of a dead job enough to name the cause.
              </Box>
              <Box variant="code">
                <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`"Your application will now abort!"
    FI_EFA_USE_HUGE_PAGE and a fork-safe variable were both set.
    Drop one. The provider will not run both.
"Your job will now abort."
    The application called fork() while the stack was not fork-safe.
    Fix the kernel and rdma-core versions, or set FI_EFA_FORK_SAFE=1.
"env variable detected! The use of this variable has been deprecated"
    A retired FI_EFA_* name is still set. The line names it; the last
    container in this section lists the three that abort.`}</pre>
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which version number to quote, the command that settles it, and a ten-second check that dates any EFA guide you read."
          >
            Version skew and the symbol rename
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Version selection is a libfabric question before it is anything else: the installer, the
            provider and the plugin all move on their own schedules, and only one of them is on your
            host. <Badge color="grey">upstream</Badge> The ofiwg project has released v2.6.0, and
            every code citation in this section is pinned to that tag{' '}
            <SourceRef provenance="code-derived" code={code.man} />. That is the tree to read when
            you want to know what the EFA provider does.{' '}
            <Badge color="green">shipped</Badge> EFA installer 1.49.0, released June 27, 2026,
            upgrades to libfabric 2.4.0amzn5.0, along with EFA driver 3.1.0, rdma-core 63.0 and AWS
            OFI NCCL Plugin 1.20.0{' '}
            <SourceRef provenance="documented" doc={docs.changelog} />. The amzn suffix marks an AWS
            fork carrying backports, not upstream v2.4.0.
          </Box>

          <Alert type="warning" header="Name the channel whenever you quote a libfabric version">
            2.4.0amzn5.0 and 2.6.0 are different code, and the version strings are comparable only
            within a channel. A backport can put a v2.6 feature into an amzn5 build, and a v2.5
            feature can be absent from it. So a comparison across channels settles nothing, and
            neither does the installer release note on its own: the only answer that binds is the
            binary in front of you.
          </Alert>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# The channel and the build, straight off the host. Expect an amzn
# suffix here; a bare upstream number means this host was not built
# by the EFA installer, which changes what backports you can assume.
fi_info --version

# Which providers that build actually carries.
fi_info -l`}</pre>
          </Box>
          <Box variant="small" color="text-body-secondary">
            The fi_info man page defines both flags, --version for versioning information and -l for
            the list of available providers{' '}
            <SourceRef provenance="code-derived" code={code.manFiInfo} />.
          </Box>

          <Box variant="h3">The rxr to efa_rdm rename</Box>
          <Box variant="p">
            The EFA provider's reliable-datagram implementation used to live under an rxr_ prefix.
            It now sits in a dedicated directory under an efa_rdm_ prefix, which is where the
            protocol selection cited earlier lives{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />. That rename dates any
            piece of writing instantly. Symbols such as rxr_pkt_post_ctrl appear in a great deal of
            EFA material and libfabric today has none of them, so a citation to one of those names
            is a citation to a tree nobody is running. Use it: when you read an EFA tuning guide,
            grep the pinned source for the first symbol it names. If the symbol is gone, the rest of
            the guidance is from the same era and deserves the same suspicion. The check takes ten
            seconds.
          </Box>

          <ExpandableSection
            headerText="Two more version-scoped behaviours worth carrying"
            headerDescription="Both verifiable at the pinned tag, and both explain a row in the settings table"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The direct data path is on by default and is disabled with
                FI_EFA_USE_DATA_PATH_DIRECT set to 0. The parameter help text describes it as
                bypassing rdma-core on the data path, including completion queue polling and
                transmit and receive submissions{' '}
                <SourceRef provenance="code-derived" code={code.envDefine} />. Note the scope in
                that sentence: on the data path, not everywhere.
              </Box>
              <Box variant="p">
                Device RDMA defaults changed with the API version rather than with a release. For
                API version 1.18 and later RDMA is enabled by default on any hardware which supports
                it, and for earlier API versions only on certain newer hardware revisions{' '}
                <SourceRef provenance="code-derived" code={code.manDeviceRdma} />. That is the real
                reason FI_EFA_USE_DEVICE_RDMA stopped being useful: the behaviour follows the API
                version the application requests, alongside the hardware revision. NIXL, the newest
                consumer of all this, is documented as integrating with Libfabric 1.21.0 and later,
                where NCCL and MPI integrate with 1.7.0 and later{' '}
                <SourceRef provenance="documented" doc={docs.efa} />, on its own getting-started
                path{' '}
                <SourceRef provenance="documented" doc={docs.nixl} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The handful worth setting, the ones to leave alone, and where the printed default is the wrong number."
          >
            The settings that matter
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The EFA provider registers dozens of FI_EFA parameters and libfabric core adds its own.
            A short list changes behaviour you would notice, and the plugin's own cheatsheet marks
            several of the popular ones as obsolete. The badges below are that split.
          </Box>

          <Table
            variant="embedded"
            columnDefinitions={[
              {
                id: 'name',
                header: 'Setting',
                cell: (item) => (
                  <SpaceBetween size="xxxs">
                    <strong>{item.name}</strong>
                    {statusBadge(item.status)}
                  </SpaceBetween>
                ),
              },
              { id: 'effect', header: 'What it changes', cell: (item) => item.effect },
              { id: 'advice', header: 'Guidance', cell: (item) => item.advice },
            ]}
            items={tunables}
          />
          <Box variant="small" color="text-body-secondary">
            Every guidance cell names its own source. Cheatsheet is the plugin's EFA environment
            variable document{' '}
            <SourceRef provenance="code-derived" code={code.envCheatsheet} />, provider code is the
            parameter definitions{' '}
            <SourceRef provenance="code-derived" code={code.envDefine} />, core code is the shared
            cache parameters{' '}
            <SourceRef provenance="code-derived" code={code.cacheParams} />, and our reading is
            editorial judgement built on those.
          </Box>

          <ExpandableSection
            headerText="Two settings where the compiled default differs from the printed help text"
            headerDescription="Which number to believe when the help text and the initialiser disagree"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The receive-window help string calls the default 16384{' '}
                <SourceRef provenance="code-derived" code={code.envDefine} />, while the initialiser
                in the same file sets it from a named constant{' '}
                <SourceRef provenance="code-derived" code={code.envDefaults} /> whose value is 16{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.reorderConst}
                  conflict="The FI_EFA_RECVWIN_SIZE help text compiled into the provider says the default is 16384. The initialiser reads a constant whose value is 16."
                  label="doc vs code"
                />
                . Code wins. Treat the receive window as 16. Same file, second case: the
                shared-memory address vector size is initialised to 256 while its help string says
                128{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.envDefaults}
                  conflict="The FI_EFA_SHM_AV_SIZE help text says the default is 128. The initialiser in the same file sets 256."
                  label="doc vs code"
                />
                . Code wins again. Treat it as 256. The rule behind both: a default printed by
                fi_info is a documentation string, and the initialiser is the running value. When a
                default is load-bearing for a decision, read the initialiser at the version you have
                installed.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning" header="Audit an inherited environment file before you reuse it">
            The provider keeps a list of deprecated names and calls abort if any of them is present
            in the environment: FI_EFA_MTU_SIZE, FI_EFA_TX_IOV_LIMIT and FI_EFA_RX_IOV_LIMIT{' '}
            <SourceRef provenance="code-derived" code={code.envAbort} />. A second list, including
            FI_EFA_SET_CUDA_SYNC_MEMOPS and FI_EFA_ZCPY_RX_SEED, only logs{' '}
            <SourceRef provenance="code-derived" code={code.envAbort} />. Those three names are the
            ones to grep an old launch script for: they end an EFA job before it opens a single
            endpoint.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
