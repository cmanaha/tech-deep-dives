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
 * reaches the EFA device, and the handful of settings that change what it
 * does.
 *
 * Sourcing rule (deep-dives/efa/revamp/source-authority-standard.md): AWS
 * statements are 'documented'. Anything read out of libfabric or the NCCL
 * plugin is 'code-derived' and pinned to a release tag, because upstream
 * libfabric is not an AWS document even though it is first-party for the EFA
 * provider. Where two files in the same repository disagree, the claim is
 * marked 'doc-code-conflict' and both sides are named.
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
  provOrder: lfab('prov/efa/src/efa_prov.c', 'L93-L176'),
  getUserInfo: lfab('prov/efa/src/efa_user_info.c', 'L626-L668'),
  fabricNames: lfab('prov/efa/src/efa.h', 'L62-L63'),
  selectRtm: lfab('prov/efa/src/rdm/efa_rdm_msg.c', 'L46-L102'),
  hmemThresholds: lfab('prov/efa/src/efa_hmem.c', 'L40-L116'),
  envDefine: lfab('prov/efa/src/efa_env.c', 'L170-L262'),
  envDefaults: lfab('prov/efa/src/efa_env.c', 'L11-L46'),
  envAbort: lfab('prov/efa/src/efa_env.c', 'L79-L96'),
  cacheOpen: lfab('prov/efa/src/efa_domain.c', 'L114-L127'),
  cacheInit: lfab('prov/efa/src/rdm/efa_rdm_mr.c', 'L64-L169'),
  cacheParams: lfab('prov/util/src/util_mem_monitor.c', 'L244-L270'),
  cacheDefaults: lfab('prov/util/src/util_mr_cache.c', 'L48-L54'),
  forkInit: lfab('prov/efa/src/efa_fork_support.c', 'L12-L62'),
  forkAbort: lfab('prov/efa/src/efa_fork_support.c', 'L157-L192'),
  reorderConst: lfab('prov/efa/src/rdm/efa_rdm_peer.h', 'L12'),
  gdaTable: lfab('prov/efa/src/efa_domain.c', 'L868-L897'),
  gdaHeader: lfab('prov/efa/src/fi_ext_efa.h', 'L11'),
  fabricComparison: lfab('prov/efa/docs/efa_fabric_comparison.md', 'L271'),
  ginOpen: plugin('src/rdma/gin/nccl_ofi_gin_gdaki.cpp', 'L112-L174'),
  ginSwitch: plugin('src/rdma/gin/nccl_ofi_gin_api.cpp', 'L90-L118'),
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
      viewBox="0 0 900 420"
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
      <rect x="0" y="0" width="900" height="420" rx="8" fill="#ffffff" />

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
        The provider sets the medium threshold to zero for these interfaces, which is what removes the band.
      </text>

      <rect x="40" y="330" width="810" height="72" rx="6" fill="#ffffff" stroke="#879596" strokeWidth="1.5" />
      <text className="pl-note" x="60" y="354">
        The read-based branch is checked first, not last. It is taken only when peer to peer is usable, the peer
      </text>
      <text className="pl-note" x="60" y="374">
        supports RDMA read, and either the application supplied a descriptor or the memory registration cache is
      </text>
      <text className="pl-note" x="60" y="394">
        available. Otherwise the size ladder above applies.
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
    gpu: 'forced to 0, and overriding it only produces a warning',
  },
  {
    name: 'FI_EFA_INTER_MIN_READ_MESSAGE_SIZE',
    host: '1048576',
    gpu: 'one byte past the largest eager message',
  },
  {
    name: 'FI_EFA_RUNT_SIZE',
    host: 'starts at 0, with the comment that runting is untested on system memory',
    gpu: 'a non-zero default, and a different one for Neuron',
  },
];

interface Tunable {
  id: string;
  name: string;
  effect: string;
  advice: string;
  status: 'set' | 'rare' | 'never';
}

const tunables: Tunable[] = [
  {
    id: 'provider',
    name: 'FI_PROVIDER=efa',
    effect: 'Restricts libfabric to the EFA provider.',
    advice:
      'Applies only to aws-ofi-nccl 1.5.0 and older. The plugin cheatsheet scopes it that way explicitly. On a current plugin it does nothing useful.',
    status: 'never',
  },
  {
    id: 'devrdma',
    name: 'FI_EFA_USE_DEVICE_RDMA',
    effect:
      'Forces device RDMA on, or forces libfabric to emulate every fi_rma operation instead of offloading it.',
    advice:
      'Do not set for libfabric 1.18.0 or newer with aws-ofi-nccl 1.7.0 or newer. Setting it to 1 on hardware without RDMA aborts the application.',
    status: 'never',
  },
  {
    id: 'forksafe',
    name: 'FI_EFA_FORK_SAFE',
    effect: 'Turns on rdma-core fork support and turns off the provider internal use of huge pages.',
    advice:
      'The plugin cheatsheet says it is not needed anymore, and that the plugin has set it for supported libfabric versions since at least v1.2. Only relevant on an old kernel with an old rdma-core.',
    status: 'rare',
  },
  {
    id: 'rdmav',
    name: 'RDMAV_FORK_SAFE and every other RDMAV variable',
    effect: 'The rdma-core equivalent, applied below libfabric.',
    advice:
      'The cheatsheet is blunt: do not use. It says the two look the same but behave very differently, and that on newer kernels this one can break things.',
    status: 'never',
  },
  {
    id: 'hugepage',
    name: 'FI_EFA_USE_HUGE_PAGE',
    effect: 'Controls whether the provider allocates its internal buffers from huge pages.',
    advice:
      'Set to 0 when fork calls start failing with out-of-memory. The cheatsheet names the exact symptom: multi-process data loaders hitting a cannot-allocate-memory error.',
    status: 'rare',
  },
  {
    id: 'minread',
    name: 'FI_EFA_INTER_MIN_READ_MESSAGE_SIZE',
    effect: 'The size at or above which two-sided sends switch to the read-based protocol.',
    advice: 'The real rendezvous threshold. Default 1048576 for host memory. Measure before moving it.',
    status: 'set',
  },
  {
    id: 'runt',
    name: 'FI_EFA_RUNT_SIZE',
    effect: 'How many bytes the read-based protocol sends eagerly before the receiver reads the rest.',
    advice:
      'The parameter definition gives 307200. It shapes the accelerator-memory path, where medium does not exist. On host memory the initialiser starts it at zero.',
    status: 'set',
  },
  {
    id: 'mrcache',
    name: 'FI_EFA_MR_CACHE_ENABLE',
    effect: 'Turns the provider memory registration cache on or off.',
    advice:
      'Leave it on. Turning it off does more than slow registration down: it changes which send protocol the provider is allowed to pick.',
    status: 'set',
  },
  {
    id: 'mrcount',
    name: 'FI_MR_CACHE_MAX_COUNT and FI_MR_CACHE_MAX_SIZE',
    effect: 'Core libfabric caps on the shared registration cache, in entries and in bytes.',
    advice:
      'Setting the count to zero disables memory registration caching outright. Reach for these only when the cache is provably the problem.',
    status: 'rare',
  },
  {
    id: 'monitor',
    name: 'FI_MR_CACHE_MONITOR',
    effect:
      'Selects how libfabric learns that a cached registration is stale. Options are userfaultfd, memhooks, kdreg2 and disabled.',
    advice:
      'The one FI_MR setting worth knowing by name, because the wrong monitor is a correctness problem rather than a performance one.',
    status: 'rare',
  },
  {
    id: 'nccl',
    name: 'NCCL_BUFFSIZE, NCCL_MIN_CHANNELS, NCCL_SOCKET_NTHREADS, NCCL_NSOCKS_PERTHREAD',
    effect: 'NCCL-side transport tuning.',
    advice:
      'The first two are documented as leave it out to use the default. The last two are documented as not applicable for EFA.',
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
            description="Why does everything go through libfabric, and which of its several hundred settings actually change what EFA does?"
          >
            libfabric and the EFA Provider
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> the EFA (Elastic Fabric Adapter) device has no public
            native API. There is no libefa you can call, no AWS SDK for posting a work request.{' '}
            <strong>The answer:</strong> libfabric is the API. AWS states the shape directly: EFA
            integrates with Libfabric, and it supports NCCL (NVIDIA Collective Communications
            Library) and NIXL (NVIDIA Inference Xfer Library) for AI and ML applications, and Open
            MPI (Message Passing Interface) 4.1 and later and Intel MPI 2019 Update 5 and later for
            HPC applications{' '}
            <SourceRef provenance="documented" doc={docs.efa} />.
          </Box>
          <Box variant="p">
            AWS also states what that buys: applications interface with NCCL, NIXL or MPI, which
            interface directly with the Libfabric API, and the Libfabric API bypasses the operating
            system kernel and communicates directly with the EFA device to put packets on the
            network{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. The bypass is a property of the
            libfabric provider, not of something you can reach around it.
          </Box>
          <Box variant="p">
            The practical consequence is that every EFA question eventually becomes a libfabric
            question. Which fabric was selected, which endpoint type, which protocol the provider
            chose for a given message size, whether a registration came out of the cache. The rest
            of this section is those four questions.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One device, two fabrics, three consumers. The provider is picked at runtime from a list, not compiled in."
          >
            The stack, and why it is not a native API
          </Header>
        }
      >
        <SpaceBetween size="m">
          <LibfabricStackDiagram />

          <Box variant="p">
            libfabric's own EFA man page frames the split. For the reliable datagram endpoint type
            it supports two fabric names, efa and efa-direct. The efa fabric implements a set of
            wire protocols to support more capabilities and features beyond the EFA device
            capabilities. The efa-direct fabric, on the contrary, offloads all libfabric data plane
            calls to the device directly without wire protocols, and compared to the efa fabric it
            supports fewer capabilities and has more mode requirements for applications, but it
            provides a fast path to hand off application requests to the device{' '}
            <SourceRef provenance="code-derived" code={code.manOverview} />.
          </Box>
          <Box variant="p">
            The two names are string constants in the provider header, efa and efa-direct{' '}
            <SourceRef provenance="code-derived" code={code.fabricNames} />, and you select between
            them by setting the name field in the fabric attributes. That is the whole switch. Same
            device, same driver, two different amounts of software between your call and the wire.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="fi_info is not a diagnostic. It is the mechanism, and the order of its output is deliberate."
          >
            fi_info and provider selection
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An application calls fi_getinfo with hints and gets back a linked list of matching
            options. The EFA provider builds that list in three passes, and it puts efa-direct
            first on purpose. Its own comment says so: the EFA direct provider is more performant if
            the application can use it, therefore the efa-direct info objects should be returned
            before efa rdm or dgram, so we populate the efa-direct info objects first{' '}
            <SourceRef provenance="code-derived" code={code.provOrder} />.
          </Box>
          <Box variant="p">
            After the efa-direct pass it appends one reliable-datagram entry per device on the efa
            fabric, then one datagram entry per device{' '}
            <SourceRef provenance="code-derived" code={code.provOrder} />. Three entries per
            device, so 96 on a 32-device instance before any hint trims them, and an application
            that takes the first one gets efa-direct on the first device. That is what the NCCL
            plugin relies on: its
            GPU-initiated path comments that on libfabric 2.4 and newer the proxy plugin selects the
            efa-direct fabric by matching against the first entry{' '}
            <SourceRef provenance="code-derived" code={code.ginOpen} />.
          </Box>
          <Box variant="p">
            The filtering happens in one loop. Each candidate is checked against the hints, then
            against source address, fabric name, domain name and PCI (Peripheral Component
            Interconnect) bus id in turn, and anything that fails a check is skipped{' '}
            <SourceRef provenance="code-derived" code={code.getUserInfo} />. Those are the fields
            worth putting in hints when you want a specific device rather than whatever comes first.
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
fi_info -g FI_EFA`}</pre>
          </Box>

          <Alert type="info" header="Read the defaults off the binary you have, not off a table">
            Command 4 prints the help text compiled into the provider you installed. Because AWS
            ships a fork of libfabric rather than upstream tags, that output is the only defaults
            list that is guaranteed to describe your host. The caveat below on the recvwin default
            is a reminder that even it can be wrong.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Reliable datagram versus datagram, and why collectives are never on the datagram one."
          >
            Endpoint types
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                FI_EP_RDM <Badge color="green">what collectives use</Badge>
              </Box>
              <Box variant="p">
                The man page describes the provider as supporting endpoint type FI_EP_DGRAM, and
                FI_EP_RDM on a new Scalable (unordered) Reliable Datagram protocol (SRD), and says
                SRD provides support for reliable datagrams and more complete error handling than
                typically seen with other Reliable Datagram implementations{' '}
                <SourceRef provenance="code-derived" code={code.manEndpoints} />.
              </Box>
              <Box variant="p">
                On the efa fabric an RDM endpoint supports FI_MSG, FI_TAGGED, FI_SEND, FI_RECV,
                FI_RMA, FI_WRITE, FI_READ, FI_ATOMIC, FI_DIRECTED_RECV, FI_MULTI_RECV and FI_SOURCE,
                gives send-after-send ordering, and has no maximum message size for any operation{' '}
                <SourceRef provenance="code-derived" code={code.manEndpoints} />. That last property
                is what a collectives library needs: it hands over a multi-megabyte buffer and the
                provider deals with it.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                FI_EP_DGRAM <Badge color="grey">not for collectives</Badge>
              </Box>
              <Box variant="p">
                The datagram endpoint supports only FI_MSG, with a maximum message size of the
                maximum transmission unit of the underlying hardware, approximately 8 KiB{' '}
                <SourceRef provenance="code-derived" code={code.manEndpoints} />. It also requires
                the FI_MSG_PREFIX mode and does not support wait objects{' '}
                <SourceRef provenance="code-derived" code={code.manEndpoints} />.
              </Box>
              <Box variant="p">
                No tagging, no RMA (remote memory access), no message longer than one packet, and no
                blocking completion read. Every collective algorithm needs at least one of those, so
                NCCL, MPI and NIXL all sit on RDM. The datagram endpoint exists for applications
                that genuinely want a raw unreliable datagram, and it is the only place the phrase
                unreliable is accurate for EFA.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="Reliable datagram on efa-direct is a narrower object than on efa">
            Same endpoint type, different contract. On efa-direct an RDM endpoint supports FI_MSG,
            FI_SEND, FI_RECV, FI_RMA, FI_WRITE, FI_READ and FI_SOURCE, gives no send-after-send
            guarantee, caps messages at the device transmission unit and remote memory operations at
            the device maximum RDMA (Remote Direct Memory Access) size, and requires the FI_CONTEXT2
            mode{' '}
            <SourceRef provenance="code-derived" code={code.manEndpoints} />. It also only supports
            FI_MR_LOCAL, which means the application registers its own buffers, while the efa fabric
            does not require registration for send and receive at all{' '}
            <SourceRef provenance="code-derived" code={code.manMrModes} />. Asking for efa-direct is
            asking to take that work on.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four protocols on the efa fabric, chosen per send. The thresholds are per memory type, and one of them is zero."
          >
            Eager, medium and rendezvous
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ProtocolLadderDiagram />

          <Box variant="p">
            The selection function is small enough to read in one sitting. Its own comment names the
            options: four types of protocol can be used, eager, medium, longcts and longread, each
            with a tagged and non-tagged version and some with a delivery-complete version{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />. The body then does four
            things in order.
          </Box>
          <Box variant="p">
            First it tests the read-based branch, and that test is not about size alone. It fires
            only when peer to peer is usable, the message length is at or above the minimum read
            message size for this memory type, the peer supports RDMA read, and either the
            application passed a memory descriptor or the registration cache is available{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />. If that fails it falls
            through to a plain size ladder: eager if the message fits in one request packet, medium
            if it fits under the medium threshold, longcts otherwise{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />.
          </Box>
          <Box variant="p">
            That last condition in the read branch is the one people trip over. Disabling the
            memory registration cache does not just make registration slower. On a send with no
            application-supplied descriptor it makes the read-based rendezvous protocol ineligible,
            and the provider silently drops to the credit-based long protocol instead.
          </Box>

          <Box variant="h3">Where the thresholds are actually set</Box>
          <Box variant="p">
            Not in the selection function. They are per memory interface, initialised once, and the
            values differ by interface{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />. For host memory all
            four are read from the environment with documented defaults. For CUDA and ROCr memory
            the medium threshold is set to zero and the minimum read size is set to one byte past
            the largest eager message, and the same is done for Neuron memory with a different runt
            size{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />.
          </Box>
          <Box variant="p">
            Setting the medium threshold to zero is what removes the medium band. The provider says
            as much when you try to override it, warning that the environment variable was set but
            only eager and runting read protocols are supported for that interface over EFA{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />. If your traffic
            originates in GPU memory, tuning the medium threshold is a no-op with a warning.
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
            <SourceRef provenance="code-derived" code={code.envDefine} />. The accelerator column is
            the branch structure of the threshold initialiser{' '}
            <SourceRef provenance="code-derived" code={code.hmemThresholds} />.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Registration is the expensive part of an RDMA transfer. The cache exists so you pay it once, and fork is what breaks it."
          >
            The memory registration cache and fork safety
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="h3">Why the cache exists</Box>
          <Box variant="p">
            Registering memory is a kernel round trip that pins pages and programs the device. A
            collectives library reuses the same buffers thousands of times, so the provider keeps
            registrations alive and reuses them. The provider opens the cache only when the
            application did not ask for FI_MR_LOCAL and the cache is enabled, with the stated reason
            that explicit memory registrations from an external application should never go in the
            cache{' '}
            <SourceRef provenance="code-derived" code={code.cacheOpen} />. If you register your own
            buffers, the provider stays out of the way.
          </Box>
          <Box variant="p">
            The caps are derived from the device rather than fixed. When neither limit is set the
            provider computes them from the device reported maximum registration count and maximum
            registration size, multiplied by a fixed factor{' '}
            <SourceRef provenance="code-derived" code={code.cacheInit} />. Above that sit the core
            libfabric caps, FI_MR_CACHE_MAX_COUNT and FI_MR_CACHE_MAX_SIZE, where setting the count
            to zero disables memory registration caching outright{' '}
            <SourceRef provenance="code-derived" code={code.cacheParams} />, with a shipped default
            of 1024 entries{' '}
            <SourceRef provenance="code-derived" code={code.cacheDefaults} />.
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
            <SourceRef provenance="code-derived" code={code.cacheInit} />.
          </Box>
          <Alert type="warning" header="If you pin FI_MR_CACHE_MONITOR to memhooks under Open MPI, you own the outcome">
            The fallback exists because the conflict is real and version dependent. Forcing the
            monitor removes the fallback. This is the one FI_MR setting where a wrong value is a
            correctness problem, not a slow one.
          </Alert>

          <Box variant="h3">Fork safety</Box>
          <Box variant="p">
            Registered pages and fork do not mix. On older kernels a child process could see pages
            the device still owns. The provider resolves this at startup: if rdma-core reports that
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
            and the process aborts with a message saying the combination will cause memory
            corruption{' '}
            <SourceRef provenance="code-derived" code={code.forkInit} />.
          </Box>
          <Box variant="p">
            There is a second abort path. If the application forks while unsafe, an installed fork
            handler prints a message and aborts, and that message names the two supported fixes:
            set FI_EFA_FORK_SAFE=1 with rdma-core v31.1 or later, or use Linux kernel 5.13 and later
            with rdma-core v35.0 and later{' '}
            <SourceRef provenance="code-derived" code={code.forkAbort} />. On any recent kernel the
            second condition is already met, which is why the plugin cheatsheet says the variable is
            not needed anymore{' '}
            <SourceRef provenance="code-derived" code={code.envCheatsheet} />.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A short list worth knowing, and a shorter list the plugin documentation tells you to leave alone."
          >
            The settings that matter
          </Header>
        }
      >
        <SpaceBetween size="m">
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
            The plugin-side guidance rows come from the plugin's own EFA cheatsheet{' '}
            <SourceRef provenance="code-derived" code={code.envCheatsheet} />. The provider-side
            effects and defaults are the parameter definitions in the provider{' '}
            <SourceRef provenance="code-derived" code={code.envDefine} /> and the core cache
            parameters{' '}
            <SourceRef provenance="code-derived" code={code.cacheParams} />.
          </Box>

          <Alert type="warning" header="Three FI_EFA variables abort the process on sight">
            The provider keeps a list of deprecated names and calls abort if any of them is present
            in the environment: FI_EFA_MTU_SIZE, FI_EFA_TX_IOV_LIMIT and FI_EFA_RX_IOV_LIMIT{' '}
            <SourceRef provenance="code-derived" code={code.envAbort} />. A second list, including
            FI_EFA_SET_CUDA_SYNC_MEMOPS and FI_EFA_ZCPY_RX_SEED, only logs{' '}
            <SourceRef provenance="code-derived" code={code.envAbort} />. Copying an old environment
            file forward is therefore not a harmless act. It is one of the few ways to make an EFA
            job fail before it opens a single endpoint.
          </Alert>

          <ExpandableSection
            headerText="Caution: the provider's own help text contradicts its own defaults"
            headerDescription="Two settings where the printed default and the compiled default disagree"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The receive-window setting is described in the help string as the size of the
                sliding receive window with a default of 16384{' '}
                <SourceRef provenance="code-derived" code={code.envDefine} />. The initialiser in
                the same file sets it from a named constant{' '}
                <SourceRef provenance="code-derived" code={code.envDefaults} />, and that constant
                is defined as 16{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.reorderConst}
                  conflict="The FI_EFA_RECVWIN_SIZE help text compiled into the provider says the default is 16384. The initialiser reads a constant whose value is 16."
                  label="doc vs code"
                />
                . Those cannot both be true, and the help text is what fi_info prints at you.
              </Box>
              <Box variant="p">
                The same file has a second instance. The shared-memory address vector size is
                initialised to 256 while its help string says the default is 128{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.envDefaults}
                  conflict="The FI_EFA_SHM_AV_SIZE help text says the default is 128. The initialiser in the same file sets 256."
                  label="doc vs code"
                />
                .
              </Box>
              <Box variant="p">
                Neither is a serious bug on its own. Both matter for how you work: a default printed
                by fi_info is a documentation string, not a reading of the running value. When a
                default is load-bearing for a decision, read the initialiser at the version you have
                installed.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Supported, on one fabric, and consumed by the NCCL plugin. An earlier version of this page said otherwise."
          >
            GPUDirect Async
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            libfabric exposes GPUDirect Async, which lets the GPU interact directly with the network
            device, by requesting FI_EFA_GDA_OPS in the name parameter of a domain ops open on the
            efa-direct fabric{' '}
            <SourceRef provenance="code-derived" code={code.manGda} />. The name is a string
            constant in the provider extension header{' '}
            <SourceRef provenance="code-derived" code={code.gdaHeader} />, and the request returns a
            populated function table with query_addr, query_qp_wqs, query_cq, cq_open_ext,
            get_mr_lkey and cntr_open_ext{' '}
            <SourceRef provenance="code-derived" code={code.gdaTable} />.
          </Box>
          <Box variant="p">
            The fabric restriction is enforced in code, not just described. The domain ops handler
            checks the info type and returns a not-supported error with the log line stating that
            only efa direct supports FI_EFA_GDA_OPS{' '}
            <SourceRef provenance="code-derived" code={code.gdaTable} />. The provider's own feature
            comparison agrees, listing the GPU Direct Async domain ops extension as unsupported on
            efa and supported on efa-direct{' '}
            <SourceRef provenance="code-derived" code={code.fabricComparison} />.
          </Box>
          <Box variant="p">
            Read what that table actually gives you. Every entry is a query or an extended open, not
            a data-path call. libfabric does not perform GPU-initiated posting itself. It hands a
            GPU-side consumer the raw handles needed to build and ring work queue entries from
            device code: the address handle number, remote queue pair number and remote key, the
            send and receive queue buffers and doorbells, the completion queue buffer and doorbell,
            and the local registration key{' '}
            <SourceRef provenance="code-derived" code={code.manGda} />.
          </Box>

          <Alert type="info" header="Correction: this dive previously said GDA was not wired into the NCCL plugin">
            <SpaceBetween size="xs">
              <Box variant="p">
                That claim came from a repository search that missed a subdirectory, and it is
                refuted. aws-ofi-nccl v1.20.0 carries a GPU-initiated networking subsystem that
                opens FI_EFA_GDA_OPS on the domain the proxy plugin already selected, then calls
                query_qp_wqs and query_cq to populate GPU-resident queue pair and completion queue
                descriptors{' '}
                <SourceRef provenance="code-derived" code={code.ginOpen} />. Its own step comments
                spell out the dependency on the efa-direct fabric and on libfabric 2.4 and newer{' '}
                <SourceRef provenance="code-derived" code={code.ginOpen} />.
              </Box>
              <Box variant="p">
                It is opt-in twice over. The plugin switches to the GDAKI implementation only when
                OFI_NCCL_GIN_TYPE is set to GDAKI, logging that GDAKI mode is enabled, and if the
                binary was built without that support it fails initialisation rather than falling
                back silently, on the stated grounds that GDAKI was an explicit opt-in{' '}
                <SourceRef provenance="code-derived" code={code.ginSwitch} />.
              </Box>
              <Box variant="p">
                So the accurate statement is narrow and positive: GPUDirect Async is supported on
                EFA, through efa-direct, and the NCCL plugin can consume it behind an environment
                variable and a build flag. It is not on by default and it is not available on the
                efa fabric.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two version numbers, two namespaces. Both trip up anyone reading older material, including older versions of this page."
          >
            Version skew and the symbol rename
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                Upstream <Badge color="grey">ofiwg/libfabric</Badge>
              </Box>
              <Box variant="p">
                The upstream project has released v2.6.0, and every code citation in this section is
                pinned to that tag{' '}
                <SourceRef provenance="code-derived" code={code.man} />. This is the tree to read
                when you want to know what the EFA provider does.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Shipped <Badge color="green">what installs on your host</Badge>
              </Box>
              <Box variant="p">
                EFA installer 1.49.0, released June 27, 2026, upgrades to libfabric 2.4.0amzn5.0,
                along with EFA driver 3.1.0, rdma-core 63.0 and AWS OFI NCCL Plugin 1.20.0{' '}
                <SourceRef provenance="documented" doc={docs.changelog} />. The amzn suffix marks an
                AWS fork carrying backports, not upstream v2.4.0.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="There is no single current libfabric version. Name the channel.">
            2.4.0amzn5.0 and 2.6.0 are different code, and the version strings are not comparable
            across the two channels. A backport can put a v2.6 feature into an amzn5 build, and a
            v2.5 feature can be absent from it. When a claim depends on a version, say whether you
            mean the installer channel or the upstream tag, and prefer checking the installed binary
            with fi_info over either.
          </Alert>

          <Box variant="h3">The rxr to efa_rdm rename</Box>
          <Box variant="p">
            The EFA provider's reliable-datagram implementation used to live under an rxr_ prefix.
            It does not anymore. The reliable-datagram sources are now under a dedicated directory
            with an efa_rdm_ prefix, which is where the protocol selection cited earlier lives{' '}
            <SourceRef provenance="code-derived" code={code.selectRtm} />.
          </Box>
          <Box variant="p">
            This matters because it dates any piece of writing instantly. Symbols such as
            rxr_pkt_post_ctrl appear in a great deal of EFA material, including an earlier version
            of this dive, and none of them exist in libfabric today. A citation to one of those
            names is a citation to a tree nobody is running. The same applies to efa_rdm_ep.c, which
            was split into a header plus two implementation files.
          </Box>
          <Box variant="p">
            The practical rule that follows: when you read an EFA tuning guide, grep the pinned
            source for the first symbol it names. If the symbol is gone, the rest of the guidance is
            from the same era and deserves the same suspicion. That check takes ten seconds and it
            is how several of the corrections on this page were found.
          </Box>

          <ExpandableSection
            headerText="What else changed names or defaults in the 2.x line"
            headerDescription="Short list, all verifiable at the pinned tag"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                FI_AV_MAP was deprecated. Applications can still ask for it, but the EFA provider
                prints a warning and switches to FI_AV_TABLE{' '}
                <SourceRef provenance="code-derived" code={code.man} />.
              </Box>
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
                reason FI_EFA_USE_DEVICE_RDMA stopped being useful, and it depends on the API
                version the application requests, not on the libfabric build alone.
              </Box>
              <Box variant="p">
                NIXL is the newest consumer of all this. AWS documents it as integrating with
                Libfabric 1.21.0 and later, alongside NCCL and MPI which integrate with Libfabric
                1.7.0 and later{' '}
                <SourceRef provenance="documented" doc={docs.efa} />, and publishes a separate
                getting-started path for it{' '}
                <SourceRef provenance="documented" doc={docs.nixl} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
