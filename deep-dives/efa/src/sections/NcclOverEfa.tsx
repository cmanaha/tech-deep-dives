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
 * NCCL over EFA: the aws-ofi-nccl plugin.
 *
 * This section replaces the NCCL material that used to live in the
 * Architecture and AI/ML Training sections. Several claims in that material
 * were wrong and are corrected here, each with the code that settles it.
 *
 * Sourcing rule for this file (deep-dives/efa/revamp/source-authority-standard.md):
 * every load-bearing claim carries a SourceRef. 'documented' means AWS states
 * it in its own documentation. 'code-derived' means it was read out of an
 * implementation at a pinned commit or release tag and AWS documents nothing.
 * 'doc-code-conflict' means a document and the code disagree, and the code wins.
 */

const ACCESSED = '2026-08-02';
const READ = '2026-08-02';

/** Pinned refs. Never a branch: a branch citation cannot be re-verified. */
const PLUGIN_TAG = 'v1.20.0';
const NCCL_TAG = 'v2.30.4-1';
const NCCL_221 = 'v2.21.5-1';
const NCCL_222 = 'v2.22.3-1';
const LIBFABRIC_TAG = 'v2.6.0';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });

const plugin = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/aws-ofi-nccl',
  ref: PLUGIN_TAG,
  path,
  lines,
  read: READ,
});
const pluginCommit = (sha: string, path: string, lines?: string): CodeRef => ({
  repo: 'aws/aws-ofi-nccl',
  ref: sha,
  path,
  lines,
  read: READ,
});
const nccl = (path: string, lines?: string, ref: string = NCCL_TAG): CodeRef => ({
  repo: 'NVIDIA/nccl',
  ref,
  path,
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

const docs = {
  efa: doc('EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads', `${EC2_DOC}efa.html`, 1),
  efaStart: doc('EC2 User Guide: Get started with EFA and MPI', `${EC2_DOC}efa-start.html`, 1),
  efaNccl: doc('EC2 User Guide: Get started with EFA and NCCL', `${EC2_DOC}efa-start-nccl.html`, 1),
};

const code = {
  // Where the plugin sits.
  netSymbols: plugin('src/nccl_ofi_interface_nvidia.cpp', 'L661-L830'),
  neuronSymbols: plugin('src/nccl_ofi_interface_neuron.cpp', 'L323-L390'),
  nameFixup: plugin('src/nccl_ofi_interface_nvidia.cpp', 'L830-L858'),
  tunerPackaging: plugin('src/Makefile.am', 'L160-L190'),
  xmlDir: plugin('src/Makefile.am', 'L11'),
  banner: plugin('src/nccl_ofi_net.cpp', 'L188-L195'),
  libfabricGate: plugin('src/nccl_ofi_net.cpp', 'L644-L654'),
  pciPath: plugin('src/nccl_ofi_net.cpp', 'L622-L625'),
  protoSimple: plugin('src/nccl_ofi_net.cpp', 'L963-L969'),
  gdrForce: plugin('src/nccl_ofi_net.cpp', 'L405-L412'),
  // Provider selection and platform detection.
  providerFilter: plugin('src/platform-aws.cpp', 'L584-L597'),
  platformTable: plugin('src/platform-aws.cpp', 'L81-L250'),
  platformOrder: plugin('src/platform-aws.cpp', 'L43-L48'),
  productName: plugin('src/nccl_ofi_system.cpp', 'L110-L140'),
  productNameFile: plugin('src/nccl_ofi_system.cpp', 'L23-L24'),
  latency: plugin('src/platform-aws.cpp', 'L694-L709'),
  // Topology.
  topoEnv: plugin('src/platform-aws.cpp', 'L661-L687'),
  writeTopoFile: plugin('src/nccl_ofi_rdma.cpp', 'L234-L303'),
  writeTopoGate: plugin('src/nccl_ofi_rdma.cpp', 'L7396-L7407'),
  topoGroup: plugin('src/nccl_ofi_topo.cpp', 'L1149-L1172'),
  nicGroupLog: plugin('src/nccl_ofi_topo.cpp', 'L1128-L1145'),
  sortRailsCall: plugin('src/nccl_ofi_topo.cpp', 'L998-L1005'),
  sortRails: plugin('src/platform-aws.cpp', 'L959-L991'),
  railContract: plugin('include/nccl_ofi_platform.h', 'L75-L97'),
  topoXml: plugin('topology/p4d-24xl-topo.xml', 'L1-L26'),
  // Environment handling.
  envManager: plugin('include/nccl_ofi_environ.h', 'L36-L58'),
  envSkipLog: plugin('include/nccl_ofi_environ.h', 'L101-L110'),
  envFreeze: plugin('src/nccl_ofi_net.cpp', 'L412'),
  paramPrefix: plugin('src/nccl_ofi_param.cpp', 'L10-L20'),
  paramTuner: plugin('include/nccl_ofi_param.h', 'L266-L305'),
  paramGin: plugin('include/nccl_ofi_param.h', 'L374-L390'),
  // The tuner.
  tunerV2: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L138-L156'),
  tunerV3: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L182-L186'),
  tunerV6: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L188-L227'),
  tunerV2Symbol: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L254-L258'),
  tunerInit: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L47-L72'),
  shouldUse: plugin('include/tuner/nccl_ofi_tuner_process_config.h', 'L66-L79'),
  fallbackLog: plugin('include/tuner/nccl_ofi_tuner_process_config.h', 'L85-L111'),
  tunerPlatform: plugin('include/tuner/nccl_ofi_tuner_process_config.h', 'L30-L53'),
  regionSkip: plugin('src/tuner/nccl_ofi_regions.cpp', 'L2094-L2117'),
  segfaultFix: pluginCommit(
    'd204003337ff4e66d28bc7463d9570b18bd1ad49',
    'src/tuner/nccl_ofi_tuner.cpp'
  ),
  v2Guard: pluginCommit('faf2e8f2ef9bcbac3ff1fb2f626e96e7a98bc60d', 'src/tuner/nccl_ofi_tuner.cpp'),
  v6HeadersImport: pluginCommit(
    '3c2e20cfb73dc22e29eb2996d260f9b91108b8e8',
    'src/tuner/nccl_ofi_tuner.cpp'
  ),
  // NCCL side of the tuner contract.
  ncclIgnore: nccl('src/include/plugin/nccl_tuner.h', 'L43'),
  ncclSymbol: nccl('src/include/plugin/nccl_tuner.h', 'L25'),
  ncclSymbol221: nccl('src/include/nccl_tuner.h', 'L58', NCCL_221),
  ncclSymbol222: nccl('src/include/nccl_tuner.h', 'L60', NCCL_222),
  ncclInitTable: nccl('src/enqueue.cc', 'L1893-L1899'),
  ncclUpdateTable: nccl('src/enqueue.cc', 'L1903-L1938'),
  ncclCallOrder: nccl('src/enqueue.cc', 'L2052-L2066'),
  ncclPickMin: nccl('src/enqueue.cc', 'L1940-L1960'),
  ncclEnvParse: nccl('src/graph/tuning.cc', 'L416-L435'),
  ncclZeroBw: nccl('src/graph/tuning.cc', 'L486-L506'),
  ncclAlgoTime: nccl('src/graph/tuning.cc', 'L593-L599'),
  ncclCmpScore: nccl('src/graph/search.cc', 'L181-L202'),
  ncclSearchSort: nccl('src/graph/search.cc', 'L241-L280'),
  ncclBuffsize: nccl('src/init.cc', 'L781-L786'),
  // GPUDirect Async.
  ginOpen: plugin('src/rdma/gin/nccl_ofi_gin_gdaki.cpp', 'L145-L175'),
  ginSwitch: plugin('src/rdma/gin/nccl_ofi_gin_api.cpp', 'L90-L118'),
  ginExport: plugin('include/rdma/gin/nccl_ofi_gin_gdaki.h', 'L15'),
  gdaOps: lfab('prov/efa/src/fi_ext_efa.h', 'L11'),
  // Version compatibility.
  releaseNotes: plugin('RELEASENOTES.md', 'L10-L16'),
  envCheatsheet: plugin('doc/efa-env-var.md', 'L28-L69'),
};

/**
 * Diagram 1. The stack, and which layer owns what.
 * Idiom A (class-name prefix "st-"). Painted light ground so it survives
 * Cloudscape dark mode.
 */
function PluginStackDiagram() {
  const layers = [
    {
      title: 'Training framework',
      sub: 'PyTorch, JAX, a custom trainer',
      owns: 'Calls ncclAllReduce and friends. Knows nothing about EFA.',
      knobs: 'No EFA-specific knobs at this layer.',
    },
    {
      title: 'NCCL',
      sub: 'libnccl.so, from NVIDIA',
      owns: 'Builds rings and trees, picks algorithm, protocol and channel count, dlopens two plugins.',
      knobs: 'NCCL_* variables. NCCL_DEBUG=INFO is where every line below shows up.',
    },
    {
      title: 'aws-ofi-nccl',
      sub: 'libnccl-net-ofi.so plus libnccl-ofi-tuner.so',
      owns: 'Implements the NCCL network interface on top of libfabric, and supplies the tuner.',
      knobs: 'OFI_NCCL_* variables. It also injects NCCL_* defaults for the platform it detects.',
    },
    {
      title: 'libfabric EFA provider',
      sub: 'libfabric.so, prov/efa',
      owns: 'Turns fi_send, fi_write and fi_read into work queue entries. Chooses eager, medium or read protocol.',
      knobs: 'FI_EFA_* and core FI_* variables.',
    },
    {
      title: 'EFA device and SRD',
      sub: 'Nitro hardware',
      owns: 'Moves the bytes. Multi-path spraying, hardware retransmit, out-of-order delivery.',
      knobs: 'Nothing to set. What you get is decided by the instance type.',
    },
  ];

  return (
    <svg
      viewBox="0 0 900 500"
      role="img"
      aria-labelledby="nccl-stack-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="nccl-stack-title">
        NCCL never talks to EFA directly. It loads aws-ofi-nccl as a network plugin, the plugin calls
        libfabric, and libfabric drives the EFA device. Each layer owns a different family of
        environment variables, which is why advice copied from one layer rarely does what the reader
        expects at another.
      </title>
      <style>
        {`
          .st-box { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .st-hi { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.8; }
          .st-t { fill: #0f1b2a; font: 600 14px sans-serif; }
          .st-s { fill: #5f6b7a; font: 11px sans-serif; }
          .st-o { fill: #0f1b2a; font: 11px sans-serif; }
          .st-k { fill: #065299; font: 600 11px sans-serif; }
          .st-arr { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-end: url(#st-head); }
          .st-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="st-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="900" height="500" rx="8" fill="#ffffff" />

      {layers.map((layer, index) => {
        const y = 30 + index * 88;
        const highlight = index === 2;
        return (
          <g key={layer.title}>
            <rect className={highlight ? 'st-hi' : 'st-box'} x="30" y={y} width="300" height="70" rx="6" />
            <text className="st-t" x="48" y={y + 28}>
              {layer.title}
            </text>
            <text className="st-s" x="48" y={y + 48}>
              {layer.sub}
            </text>

            <rect className="st-box" x="350" y={y} width="520" height="70" rx="6" />
            <text className="st-o" x="368" y={y + 26}>
              {layer.owns}
            </text>
            <text className="st-k" x="368" y={y + 50}>
              {layer.knobs}
            </text>

            {index < layers.length - 1 && <path className="st-arr" d={`M180,${y + 70} L180,${y + 88}`} />}
          </g>
        );
      })}

      <text className="st-cap" x="450" y="486">
        Layer boundaries and variable prefixes read from aws-ofi-nccl v1.20.0 and NCCL v2.30.4-1.
      </text>
    </svg>
  );
}

interface Knob {
  name: string;
  status: 'set' | 'evidence' | 'never';
}

interface KnobLayer {
  layer: string;
  sub: string;
  knobs: Knob[];
}

const knobLayers: KnobLayer[] = [
  {
    layer: 'NCCL',
    sub: 'read by libnccl.so',
    knobs: [
      { name: 'NCCL_DEBUG', status: 'set' },
      { name: 'NCCL_DEBUG_SUBSYS', status: 'set' },
      { name: 'NCCL_ALGO', status: 'evidence' },
      { name: 'NCCL_PROTO', status: 'evidence' },
      { name: 'NCCL_TOPO_FILE', status: 'never' },
      { name: 'NCCL_BUFFSIZE', status: 'never' },
      { name: 'NCCL_MIN_CHANNELS', status: 'never' },
      { name: 'NCCL_TUNER_PLUGIN', status: 'never' },
      { name: 'NCCL_SOCKET_NTHREADS', status: 'never' },
      { name: 'NCCL_NSOCKS_PERTHREAD', status: 'never' },
    ],
  },
  {
    layer: 'aws-ofi-nccl',
    sub: 'read by the plugin',
    knobs: [
      { name: 'OFI_NCCL_PROTOCOL', status: 'evidence' },
      { name: 'OFI_NCCL_TUNER_TYPE', status: 'evidence' },
      { name: 'OFI_NCCL_FORCE_NUM_RAILS', status: 'evidence' },
      { name: 'OFI_NCCL_GIN_TYPE', status: 'evidence' },
      { name: 'OFI_NCCL_EAGER_MAX_SIZE', status: 'evidence' },
      { name: 'OFI_NCCL_FORCE_PRODUCT_NAME', status: 'evidence' },
    ],
  },
  {
    layer: 'libfabric',
    sub: 'read by the EFA provider',
    knobs: [
      { name: 'FI_LOG_LEVEL', status: 'set' },
      { name: 'FI_EFA_USE_HUGE_PAGE', status: 'evidence' },
      { name: 'FI_EFA_INTER_MIN_READ_MESSAGE_SIZE', status: 'evidence' },
      { name: 'FI_EFA_RUNT_SIZE', status: 'evidence' },
      { name: 'FI_PROVIDER', status: 'never' },
      { name: 'FI_EFA_USE_DEVICE_RDMA', status: 'never' },
      { name: 'FI_EFA_ENABLE_SHM_TRANSFER', status: 'never' },
    ],
  },
  {
    layer: 'rdma-core',
    sub: 'below libfabric',
    knobs: [
      { name: 'RDMAV_FORK_SAFE', status: 'never' },
      { name: 'RDMAV_HUGEPAGES_SAFE', status: 'never' },
    ],
  },
];

const knobFill: Record<Knob['status'], string> = {
  set: '#e8f5e9',
  evidence: '#f2f8fd',
  never: '#fdf3f1',
};
const knobStroke: Record<Knob['status'], string> = {
  set: '#037f0c',
  evidence: '#0972d3',
  never: '#d13212',
};

/**
 * Diagram 2. Which knob acts at which layer.
 * Idiom A (class-name prefix "kb-"). Chips are packed by measured width so
 * nothing can overlap regardless of how many names a row carries.
 */
function KnobLayersDiagram() {
  const CONTENT_X = 250;
  const CONTENT_W = 620;
  const CHIP_H = 24;
  const CHIP_GAP = 8;
  const LINE_H = 32;

  let cursor = 46;
  const rows = knobLayers.map((entry) => {
    const lines: { knob: Knob; x: number; w: number }[][] = [];
    let current: { knob: Knob; x: number; w: number }[] = [];
    let x = 0;
    entry.knobs.forEach((knob) => {
      const w = knob.name.length * 6.7 + 22;
      if (x + w > CONTENT_W && current.length > 0) {
        lines.push(current);
        current = [];
        x = 0;
      }
      current.push({ knob, x, w });
      x += w + CHIP_GAP;
    });
    if (current.length > 0) {
      lines.push(current);
    }
    const height = Math.max(64, lines.length * LINE_H + 20);
    const row = { entry, lines, y: cursor, height };
    cursor += height + 12;
    return row;
  });

  const total = cursor + 56;

  return (
    <svg
      viewBox={`0 0 900 ${total}`}
      role="img"
      aria-labelledby="nccl-knobs-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="nccl-knobs-title">
        Every tuning variable belongs to exactly one layer, and most of the ones circulating for EFA
        are either owned by the plugin already or scoped to plugin releases from 2023. Only the
        debug and logging variables are worth setting unconditionally.
      </title>
      <style>
        {`
          .kb-lbl { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .kb-lt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: end; }
          .kb-ls { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .kb-body { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .kb-chip { font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; text-anchor: middle; fill: #0f1b2a; }
          .kb-leg { fill: #5f6b7a; font: 11px sans-serif; }
        `}
      </style>
      <rect x="0" y="0" width="900" height={total} rx="8" fill="#ffffff" />

      {rows.map((row) => (
        <g key={row.entry.layer}>
          <rect className="kb-lbl" x="30" y={row.y} width="200" height={row.height} rx="6" />
          <text className="kb-lt" x="214" y={row.y + row.height / 2 - 2}>
            {row.entry.layer}
          </text>
          <text className="kb-ls" x="214" y={row.y + row.height / 2 + 16}>
            {row.entry.sub}
          </text>

          <rect className="kb-body" x={CONTENT_X} y={row.y} width={CONTENT_W + 20} height={row.height} rx="6" />
          {row.lines.map((line, lineIndex) =>
            line.map((cell) => {
              const cx = CONTENT_X + 12 + cell.x;
              const cy = row.y + 12 + lineIndex * LINE_H;
              return (
                <g key={cell.knob.name}>
                  <rect
                    x={cx}
                    y={cy}
                    width={cell.w}
                    height={CHIP_H}
                    rx="12"
                    fill={knobFill[cell.knob.status]}
                    stroke={knobStroke[cell.knob.status]}
                    strokeWidth="1.2"
                  />
                  <text className="kb-chip" x={cx + cell.w / 2} y={cy + 16}>
                    {cell.knob.name}
                  </text>
                </g>
              );
            })
          )}
        </g>
      ))}

      <g>
        <rect x="30" y={cursor + 4} width="14" height="14" rx="7" fill={knobFill.set} stroke={knobStroke.set} />
        <text className="kb-leg" x="52" y={cursor + 16}>
          set it
        </text>
        <rect
          x="120"
          y={cursor + 4}
          width="14"
          height="14"
          rx="7"
          fill={knobFill.evidence}
          stroke={knobStroke.evidence}
        />
        <text className="kb-leg" x="142" y={cursor + 16}>
          only with measurements in hand
        </text>
        <rect
          x="360"
          y={cursor + 4}
          width="14"
          height="14"
          rx="7"
          fill={knobFill.never}
          stroke={knobStroke.never}
        />
        <text className="kb-leg" x="382" y={cursor + 16}>
          leave it alone: stale advice, or the plugin already owns it
        </text>
      </g>
    </svg>
  );
}

interface TunerRow {
  iface: string;
  nccl: string;
  entry: string;
  bailout: string;
}

const tunerRows: TunerRow[] = [
  {
    iface: 'ncclTunerPlugin_v2',
    nccl: 'NCCL 2.21.x',
    entry: 'nccl_ofi_tuner_init_v2',
    bailout: 'Yes. Returns a null context when NCCL_ALGO or NCCL_PROTO is set.',
  },
  {
    iface: 'ncclTunerPlugin_v3',
    nccl: 'NCCL 2.22.3 and later',
    entry: 'nccl_ofi_tuner_init',
    bailout: 'No. It has never had one, back to plugin v1.13.0-aws.',
  },
  {
    iface: 'ncclTunerPlugin_v6',
    nccl: 'NCCL 2.30.3 and later',
    entry: 'nccl_ofi_tuner_init_v6',
    bailout: 'No. A bailout was added and removed before any release shipped it.',
  },
];

interface StaleRow {
  advice: string;
  verdict: string;
  why: string;
}

const staleRows: StaleRow[] = [
  {
    advice: 'FI_PROVIDER=efa',
    verdict: 'Do not set',
    why:
      'The plugin cheatsheet scopes it to aws-ofi-nccl 1.5.0 and older. On anything newer the plugin sets the provider filter itself when FI_PROVIDER is unset.',
  },
  {
    advice: 'FI_EFA_USE_DEVICE_RDMA=1',
    verdict: 'Do not set',
    why:
      'The cheatsheet says do not set it for libfabric 1.18.0 or newer with aws-ofi-nccl 1.7.0 or newer. It is harmless on p4 and p5 with current software, and pointless.',
  },
  {
    advice: 'NCCL_PROTO=simple',
    verdict: 'Do not set',
    why:
      'Also scoped to aws-ofi-nccl 1.5.0 and older. The plugin forces it itself, and only when it has a reason to: no GPUDirect RDMA support.',
  },
  {
    advice: 'NCCL_BUFFSIZE=8388608',
    verdict: 'Do not set',
    why:
      'The cheatsheet says leave it out. The plugin already inserts exactly this value on p4d, p4de, p5, p5e, p5en, p6 and g7e, and the value it inserts tracks the platform.',
  },
  {
    advice: 'NCCL_MIN_CHANNELS=4',
    verdict: 'Do not set',
    why:
      'The cheatsheet says leave it out and explains the failure mode: more channels than necessary makes each message smaller and starves EFA for data.',
  },
  {
    advice: 'NCCL_TUNER_PLUGIN=...libnccl-ofi-tuner.so',
    verdict: 'Not needed',
    why:
      'From NCCL 2.21 onward NCCL looks for the tuner interface inside the network plugin after checking NCCL_TUNER_PLUGIN. The tuner is compiled into the network plugin, so it loads by default.',
  },
  {
    advice: 'NCCL_SOCKET_NTHREADS, NCCL_NSOCKS_PERTHREAD',
    verdict: 'Not applicable',
    why: 'The cheatsheet marks both as not applicable for EFA. They tune the TCP socket transport, which is not in this path.',
  },
];

interface LogRow {
  line: string;
  meaning: string;
}

const logRows: LogRow[] = [
  {
    line: 'NET/OFI Initializing aws-ofi-nccl <version>',
    meaning:
      'The plugin loaded and this is the version that is actually running. This is the only trustworthy way to read the plugin version from inside the job.',
  },
  {
    line: 'NET/OFI Using Libfabric version <major>.<minor>',
    meaning: 'The libfabric the plugin linked against at run time, not the one on the build host.',
  },
  {
    line: 'NET/OFI Selected provider is efa, fabric is efa (found N nics)',
    meaning:
      'EFA is in the path and N devices were found. If the fabric reads efa-direct instead of efa, the plugin picked the direct fabric.',
  },
  {
    line: 'NET/OFI Configuring AWS-specific options',
    meaning: 'Platform detection ran and decided this is an EC2 instance. If this line is missing, none of the AWS defaults were applied.',
  },
  {
    line: 'NET/OFI Running on <type> platform, topology file <path>',
    meaning: 'A packaged topology XML matched this instance type and NCCL_TOPO_FILE now points at it.',
  },
  {
    line: 'NET/OFI Internode latency set at <n> us',
    meaning:
      'The per-platform latency hint the plugin fed to NCCL. 75 microseconds for p4d and p5, 35 for p5en and later, 75 as the fall-through for anything unrecognised.',
  },
  {
    line: 'NET/OFI NIC group <i> device #<j> <bdf>',
    meaning:
      'The GPU-to-EFA grouping the plugin computed, printed one line per device. This is where you check that each accelerator got the devices behind its own PCIe switch.',
  },
  {
    line: 'NET/OFI Skipping adding <VAR> to environment, already set',
    meaning:
      'You set a variable the plugin also wanted to set. Your value wins. This line is the fastest way to find out that your tuning override is the thing displacing the platform default.',
  },
  {
    line: 'NET/OFI Tuner selected platform: AWS',
    meaning: 'The tuner recognised the platform. If it prints anything else, the OFI tuner is not going to run.',
  },
  {
    line: 'NET/OFI Region Tuner choosing algo <a> proto <p> with cost 0.00000000',
    meaning:
      'The tuner found a region matching this message size and rank count, and zeroed that cell of the cost table. A cost of zero is the tuner voting, not a measurement.',
  },
  {
    line: "NET/OFI Falling back to NCCL's tuner for coll <c> size <n>",
    meaning:
      'No region matched. NCCL picks with its own model for this one call. Seeing this for some sizes and not others is normal.',
  },
];

export function NcclOverEfa() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="NCCL does not know EFA exists. Everything EFA-specific in a GPU training job happens inside one shared library, and most of the tuning advice written about it is out of date."
          >
            NCCL over EFA: the aws-ofi-nccl Plugin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> a distributed training job that uses EFA (Elastic Fabric
            Adapter) has four pieces of software between the framework and the wire, each with its
            own environment variables, its own version number, and its own idea of what a good
            default is. When throughput is wrong, the first question is which layer to look at, and
            the second is whether the variable you are about to set still means what a 2023 blog
            post said it meant. <strong>The answer:</strong> NCCL (NVIDIA Collective Communications
            Library) loads aws-ofi-nccl as a network plugin, and that plugin is where every
            EFA-specific decision is made. AWS documents the install path and nothing about the
            mechanism <SourceRef provenance="documented" doc={docs.efaNccl} />, so the rest of this
            section is read out of the plugin at release tag v1.20.0.
          </Box>
          <Alert type="info" header="What this section corrects">
            The earlier version of this material said that setting NCCL_ALGO or NCCL_PROTO disables
            the tuner, that the tuner filter runs after the tuner, that the plugin ships topology
            files for two instance types, and that GPUDirect Async is not wired into the plugin.
            None of those hold at v1.20.0. Each correction below carries the code that settles it.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One shared library, two exported plugin interfaces, and a hard boundary at libfabric."
          >
            What the plugin is and where it sits
          </Header>
        }
      >
        <SpaceBetween size="m">
          <PluginStackDiagram />

          <Box variant="p">
            NCCL loads network plugins by looking for versioned symbols in a shared library. The
            plugin exports the NVIDIA network interface at versions 6 through 12 in a single build,
            so one binary serves NCCL 2.17.1 through 2.30.x{' '}
            <SourceRef provenance="code-derived" code={code.netSymbols} />. A separate file exports
            the Neuron interface at versions 4 through 6 for Trainium and Inferentia
            <SourceRef provenance="code-derived" code={code.neuronSymbols} />. The library reports
            itself as OFI by default, and renames itself to AWS Libfabric only if you set NCCL_NET
            to that string, which the code comment describes as backwards compatibility for scripts
            written against plugin 1.11.0 and earlier{' '}
            <SourceRef provenance="code-derived" code={code.nameFixup} />.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">The network plugin</Box>
              <Box variant="p">
                This is the data path. It turns NCCL send and receive calls into libfabric
                operations, registers memory, and manages one endpoint per EFA device. It also
                reports each device's PCI path back to NCCL, which is what lets NCCL match a network
                device to the GPU behind the same switch{' '}
                <SourceRef provenance="code-derived" code={code.pciPath} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">The tuner plugin</Box>
              <Box variant="p">
                This is advisory. It never moves a byte. NCCL asks it, per collective call, which
                algorithm and protocol combination it prefers. The tuner code is compiled into the
                network plugin, and a standalone libnccl-ofi-tuner.so is also built for historical
                reasons <SourceRef provenance="code-derived" code={code.tunerPackaging} />.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="success" header="Why you do not need NCCL_TUNER_PLUGIN">
            The plugin build system spells out the version history in its own comment: NCCL 2.19
            through 2.20 loaded a tuner only when NCCL_TUNER_PLUGIN named a file, and from NCCL 2.21
            onward NCCL first checks NCCL_TUNER_PLUGIN and then looks for the tuner interface inside
            the network plugin. Bundling the tuner into the network plugin is a deliberate choice so
            that it loads by default on NCCL 2.21 or later{' '}
            <SourceRef provenance="code-derived" code={code.tunerPackaging} />. Pointing
            NCCL_TUNER_PLUGIN at a path is a 2024 workaround that current software does not need.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two decisions the plugin makes before a single collective runs: which provider, and which platform."
          >
            Provider selection and platform detection
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The provider decision is short. If FI_PROVIDER is unset, the plugin logs that it is
            setting the provider filter to efa and forces it. If FI_PROVIDER is set to efa, it
            proceeds. If FI_PROVIDER is set to anything else, the plugin does not force EFA, and the
            in-code comment states the intended outcome: on platforms without EFA this falls back to
            NCCL's internal TCP transport, and on Neuron it is a hard failure when there are no
            network interface cards <SourceRef provenance="code-derived" code={code.providerFilter} />.
            That is the whole reason FI_PROVIDER=efa is unnecessary today: the plugin already does
            it, and does it only when you have not.
          </Box>

          <Box variant="p">
            Once a provider is selected, the plugin refuses to run EFA on an old libfabric. If the
            selected provider name starts with efa and the libfabric version is below 1.22.0, it
            warns that the EFA provider requires at least libfabric 1.22.0 and returns a
            not-supported error <SourceRef provenance="code-derived" code={code.libfabricGate} />.
          </Box>

          <Box variant="h3">How the plugin decides which instance type it is on</Box>
          <Box variant="p">
            It reads the DMI product name out of sysfs, at
            /sys/devices/virtual/dmi/id/product_name, caches it, and matches it against an ordered
            table <SourceRef provenance="code-derived" code={code.productNameFile} />
            <SourceRef provenance="code-derived" code={code.productName} />. There is no call to the
            EC2 instance metadata service and no API call. That matters in a container: the sysfs
            path has to be visible, and OFI_NCCL_FORCE_PRODUCT_NAME is the documented override in
            the parameter list if it is not{' '}
            <SourceRef provenance="code-derived" code={code.productName} />.
          </Box>
          <Box variant="p">
            The table is ordered and the first regular-expression match wins, even if a more
            specific entry appears later{' '}
            <SourceRef provenance="code-derived" code={code.platformOrder} />. Each entry carries a
            topology file name, a default duplicate-connection count, an internode latency, whether
            GPUDirect RDMA is required, a default transport protocol, and a map of NCCL environment
            variables to inject <SourceRef provenance="code-derived" code={code.platformTable} />.
          </Box>

          <ExpandableSection
            headerText="What the platform table actually sets, per family"
            headerDescription="These are the defaults that make an unset variable the right variable"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                p4d.24xlarge and p4de.24xlarge get a topology XML, 75 microseconds of internode
                latency, GPUDirect RDMA required, the send-and-receive transport protocol, and two
                injected variables: NCCL_BUFFSIZE set to 8388608 and NCCL_P2P_NET_CHUNKSIZE set to
                524288 <SourceRef provenance="code-derived" code={code.platformTable} />.
              </Box>
              <Box variant="p">
                The p5 and p5e regular expression gets no topology file, 75 microseconds, the RDMA
                transport protocol, and five injected variables: the same buffer size and chunk
                size, plus NCCL_NVLSTREE_MAX_CHUNKSIZE and NCCL_NVLS_CHUNKSIZE at 524288 and
                NCCL_NET_FORCE_FLUSH at 0 <SourceRef provenance="code-derived" code={code.platformTable} />.
              </Box>
              <Box variant="p">
                p5en and p6-b200 share an entry that drops internode latency to 35 microseconds and
                adds NCCL_NETDEVS_POLICY set to max:1, with a comment saying that value was chosen
                empirically for platforms with two GPUs and two network devices per PCIe switch{' '}
                <SourceRef provenance="code-derived" code={code.platformTable} />.
              </Box>
              <Box variant="p">
                A catch-all p-series entry matches p5 and later families that the earlier rows did
                not claim, and the comment says it is expected to apply to P6e-GB200 and later{' '}
                <SourceRef provenance="code-derived" code={code.platformTable} />. Trainium and
                Inferentia have their own entries with no injected variables at all.
              </Box>
              <Box variant="p">
                If nothing matches, the latency fall-through is 75 microseconds, with a comment
                saying that value came from empirical testing on P5 and needs revisiting for newer
                EFA generations <SourceRef provenance="code-derived" code={code.latency} />. An
                unrecognised instance type does not fail. It runs with P5-era assumptions.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info" header="Injected defaults never overwrite you">
            The plugin does not call setenv directly. It stages every variable in an environment
            manager, then rewrites the process environment pointer once at the end of plugin
            creation <SourceRef provenance="code-derived" code={code.envManager} />
            <SourceRef provenance="code-derived" code={code.envFreeze} />. Platform defaults are
            staged with overwrite set to false, so a value you already set survives, and the plugin
            logs one line naming the variable it skipped{' '}
            <SourceRef provenance="code-derived" code={code.envSkipLog} />. Every getenv guard
            inside platform detection therefore sees your original environment, not the plugin's.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three static XML files, a runtime-generated one, and a sort function. They solve different problems."
          >
            Topology XML files versus sort_rails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The plugin ships three static NCCL topology XML files, not two: p4d-24xl-topo.xml,
            p4de-24xl-topo.xml and g5.48xl-topo.xml. They are the only entries in the platform table
            with a non-null topology field; every other platform, including all of p5, p5en, p6 and
            the Trainium family, has null there{' '}
            <SourceRef provenance="code-derived" code={code.platformTable} />. The files are
            installed under the plugin's data directory{' '}
            <SourceRef provenance="code-derived" code={code.xmlDir} />, and platform initialisation
            points NCCL_TOPO_FILE at the matching one, unless NCCL_TOPO_FILE is already set, in
            which case it logs the value you set and leaves it alone{' '}
            <SourceRef provenance="code-derived" code={code.topoEnv} />.
          </Box>
          <Box variant="p">
            What is in one of those files is a hand-written PCIe tree: a system element, a CPU
            element per NUMA node, a synthetic switch element per PCIe hierarchy, and under each
            switch the GPUs and the EFA device that sit behind it, each with a bus address, a class
            code, a vendor and device ID, a link speed and a link width. The p4d file's own header
            describes the shape as two groups of PCIe hierarchy under each socket, each group with
            two GPUs and one network device behind a switch{' '}
            <SourceRef provenance="code-derived" code={code.topoXml} />.
          </Box>

          <Alert type="warning" header="The absence of an XML file is not a gap">
            <SpaceBetween size="xs">
              <Box variant="p">
                On the RDMA transport path the plugin builds a topology at run time and writes it to
                an anonymous in-memory file, then sets NCCL_TOPO_FILE to the /proc/self/fd path of
                that descriptor. It does this only when the computed maximum group size is greater
                than one, and it skips the work entirely if NCCL_TOPO_FILE is already set{' '}
                <SourceRef provenance="code-derived" code={code.writeTopoFile} />
                <SourceRef provenance="code-derived" code={code.writeTopoGate} />.
              </Box>
              <Box variant="p">
                So the p5 family does get a topology file. It is generated from what the plugin
                discovered on the running instance rather than shipped as a static asset. The old
                advice to hunt for the right topology XML and set NCCL_TOPO_FILE by hand now does
                the opposite of what it promises: setting it suppresses both the packaged file and
                the generated one.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="h3">How the plugin maps GPUs to EFA devices</Box>
          <Box variant="p">
            The grouping runs in four passes over an hwloc topology. First it marks every topology
            node that has libfabric device information in its subtree. Then it walks up from each
            accelerator and increases a group count on the closest marked ancestor. Then it lifts
            device lists up to nodes with a non-zero group count. Then it splits each list into that
            many groups and prints the result{' '}
            <SourceRef provenance="code-derived" code={code.topoGroup} />. The print is the log line
            worth knowing: one line per device, giving the group index, the device index within the
            group and the PCI bus address{' '}
            <SourceRef provenance="code-derived" code={code.nicGroupLog} />.
          </Box>
          <Box variant="p">
            sort_rails runs inside that split, on the device list of a single group, with the group
            size passed in <SourceRef provenance="code-derived" code={code.sortRailsCall} />. The
            platform interface states the contract in its own comment: implementations should sort
            the list so that the Nth provider on this node is assumed to talk to the Nth provider on
            remote nodes <SourceRef provenance="code-derived" code={code.railContract} />. A rail is
            an agreed ordinal, not a piece of hardware.
          </Box>
          <Box variant="p">
            The AWS implementation says why the natural order is not enough. On P5 and P5e there are
            up to 32 EFA devices, each pair shares Nitro card resources, and there is a marginal
            gain if the 0th device of a pair only talks to 0th devices remotely. The hypervisor is
            not consistent in how it maps bus, device and function numbers across the two devices
            that share resources, so the code reorders the list to force the pairing{' '}
            <SourceRef provenance="code-derived" code={code.sortRails} />. It returns immediately
            when there is at most one device per group, with the comment that on P4d or Trainium the
            topology ordering is assumed sufficient{' '}
            <SourceRef provenance="code-derived" code={code.sortRails} />.
          </Box>
          <Box variant="p">
            The two mechanisms answer different questions. The XML tells NCCL which GPU is near which
            network device. sort_rails decides, among the devices already known to be near a GPU,
            which one is rail 0. The instance types with a static XML are exactly the ones where
            sort_rails does nothing, because they have one device per group.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The tuner writes into a cost matrix. It does not set NCCL_ALGO, and NCCL_ALGO does not switch it off."
          >
            The tuner: what it actually does
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NCCL's tuner interface hands the plugin a two-dimensional cost table indexed by
            algorithm and by protocol, and asks it to fill in preferences. The plugin's region tuner
            walks a list of regions for the collective type, finds the one containing the point
            defined by message size and rank count, and sets that cell to 0.0{' '}
            <SourceRef provenance="code-derived" code={code.regionSkip} />. It never sets NCCL_ALGO
            or NCCL_PROTO. NCCL then scans the table and picks the lowest non-ignored cost{' '}
            <SourceRef provenance="code-derived" code={code.ncclPickMin} />. A zero cost is a vote,
            not a measured time.
          </Box>

          <Alert type="error" header="Correction: the filter runs before the tuner, not after">
            <SpaceBetween size="xs">
              <Box variant="p">
                The previous text had the causality backwards. The real order is visible in one
                function in NCCL. It initialises every cell of the table to NCCL_ALGO_PROTO_IGNORE{' '}
                <SourceRef provenance="code-derived" code={code.ncclInitTable} />, fills in modelled
                times only for combinations the communicator allows{' '}
                <SourceRef provenance="code-derived" code={code.ncclUpdateTable} />, then calls the
                tuner, then picks the minimum{' '}
                <SourceRef provenance="code-derived" code={code.ncclCallOrder} />.
              </Box>
              <Box variant="p">
                The user's filter is applied earlier still. NCCL parses NCCL_ALGO and NCCL_PROTO
                into per-function enable arrays at tuning time{' '}
                <SourceRef provenance="code-derived" code={code.ncclEnvParse} />, and zeroes the
                modelled bandwidth for every disabled combination{' '}
                <SourceRef provenance="code-derived" code={code.ncclZeroBw} />. A zero bandwidth
                makes the time lookup return -1.0{' '}
                <SourceRef provenance="code-derived" code={code.ncclAlgoTime} />, which is the exact
                value of NCCL_ALGO_PROTO_IGNORE{' '}
                <SourceRef provenance="code-derived" code={code.ncclIgnore} />.
              </Box>
              <Box variant="p">
                So by the time the tuner is called, the cells you excluded are already marked, and
                the tuner skips any cell equal to NCCL_ALGO_PROTO_IGNORE rather than zeroing it{' '}
                <SourceRef provenance="code-derived" code={code.regionSkip} />. The tuner respects
                your filter. It does not fight it, and NCCL does not overrule the tuner afterwards.
              </Box>
            </SpaceBetween>
          </Alert>

          <Alert type="error" header="Correction: NCCL_ALGO and NCCL_PROTO do not disable the tuner">
            <SpaceBetween size="xs">
              <Box variant="p">
                There is exactly one environment-variable bailout in the plugin's tuner, and it is
                in the v2 entry point{' '}
                <SourceRef provenance="code-derived" code={code.tunerV2} />. The v3 entry point
                binds to the plain initialiser with no such check{' '}
                <SourceRef provenance="code-derived" code={code.tunerV3} />, and so does v6{' '}
                <SourceRef provenance="code-derived" code={code.tunerV6} />.
              </Box>
              <Box variant="p">
                Which entry point NCCL uses is decided by the symbol it looks for. NCCL 2.21.5
                defines the tuner plugin symbol as ncclTunerPlugin_v2{' '}
                <SourceRef provenance="code-derived" code={code.ncclSymbol221} />, NCCL 2.22.3
                moved it to v3 <SourceRef provenance="code-derived" code={code.ncclSymbol222} />,
                and NCCL 2.30.4 uses v6{' '}
                <SourceRef provenance="code-derived" code={code.ncclSymbol} />. The plugin exports
                all three, so the choice is made by the NCCL you are running, not by the plugin{' '}
                <SourceRef provenance="code-derived" code={code.tunerV2Symbol} />. Only a job pinned
                to NCCL 2.21.x hits the bailout.
              </Box>
              <Box variant="p">
                This is not a recent change. The v3 entry point has never carried the check, and the
                commit that introduced the guard says so in its own subject line: updating tuner
                v1/v2 to fall back on internal when algo or proto is set{' '}
                <SourceRef provenance="code-derived" code={code.v2Guard} />. The v1 tuner interface
                was removed entirely in v1.20.0{' '}
                <SourceRef provenance="code-derived" code={code.releaseNotes} />.
              </Box>
            </SpaceBetween>
          </Alert>

          <Table
            variant="embedded"
            header={<Header variant="h3">Which tuner interface your NCCL binds to</Header>}
            columnDefinitions={[
              { id: 'iface', header: 'Exported symbol', cell: (item) => <code>{item.iface}</code> },
              { id: 'nccl', header: 'NCCL versions', cell: (item) => item.nccl },
              { id: 'entry', header: 'Plugin entry point', cell: (item) => <code>{item.entry}</code> },
              { id: 'bailout', header: 'NCCL_ALGO / NCCL_PROTO bailout', cell: (item) => item.bailout },
            ]}
            items={tunerRows}
          />

          <ExpandableSection
            headerText="The segfault fix does not prove the tuner was running"
            headerDescription="A tempting inference from the v1.20.0 release notes, refuted by the commit"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The v1.20.0 release notes list a fix for a tuner segfault when NCCL_ALGO or
                NCCL_PROTO is explicitly set{' '}
                <SourceRef provenance="code-derived" code={code.releaseNotes} />. It is tempting to
                read that as evidence that the tuner was running despite those variables, since a
                crash needs code to be executing. That reading is wrong, and the commit says so.
              </Box>
              <Box variant="p">
                The crash was inside the bailout. The v2 initialiser logged an informational message
                on the early-return path before the log function pointer had been assigned, and the
                logging macro dereferenced a null pointer. The fix assigns the log function inside
                the early-return path before the log call{' '}
                <SourceRef provenance="code-derived" code={code.segfaultFix} />. The segfault
                happened precisely when the tuner was declining to run.
              </Box>
              <Box variant="p">
                The same commit removed an identical bailout from the v6 initialiser, with the
                commit message stating that NCCL 2.30 and later handle algorithm and protocol
                filtering internally and do not need the tuner to opt out{' '}
                <SourceRef provenance="code-derived" code={code.segfaultFix} />. That v6 block had
                arrived only two months earlier, when the v5 and v6 API headers were imported{' '}
                <SourceRef provenance="code-derived" code={code.v6HeadersImport} />, and both
                commits land only in v1.20.0. No shipped release ever had a v6 bailout.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Box variant="h3">What does turn the tuner off</Box>
          <Box variant="p">
            Three conditions, checked in one predicate that the shared initialiser calls before it
            does anything else, and none of them is NCCL_ALGO or NCCL_PROTO{' '}
            <SourceRef provenance="code-derived" code={code.tunerInit} />. The tuner runs only when
            a platform type was detected, the tuner type was not forced to Internal, and the
            rail-count override is unset{' '}
            <SourceRef provenance="code-derived" code={code.shouldUse} />. When it declines, it logs
            which of the three reasons applied{' '}
            <SourceRef provenance="code-derived" code={code.fallbackLog} />. The rail-count case has
            a comment explaining the logic: each AWS platform has a different device-per-GPU ratio,
            so a user setting the rail count is treated as a signal that the job is running on
            heterogeneous hardware, where per-process tuner answers could diverge{' '}
            <SourceRef provenance="code-derived" code={code.fallbackLog} />.
          </Box>
          <Box variant="p">
            The tuner also narrows itself by platform name. It maps the product name to one of five
            internal platform constants, covering p5 and p5e, p5en, p6-b200 and p6-b300, with
            everything else falling through to unknown{' '}
            <SourceRef provenance="code-derived" code={code.tunerPlatform} />. On an instance type
            outside that list the tuner loads, finds no region or model support, and NCCL's own
            model decides.
          </Box>

          <Alert
            type="warning"
            header="The fallback log line names a variable that does not exist"
          >
            When the tuner declines because the tuner type was forced to Internal, it prints a
            message naming NCCL_OFI_TUNER_TYPE. The parameter it actually read is
            OFI_NCCL_TUNER_TYPE: every plugin parameter is constructed by prefixing OFI_NCCL_ to the
            short name in the parameter table{' '}
            <SourceRef
              provenance="doc-code-conflict"
              code={code.paramPrefix}
              conflict="The tuner fallback log message in nccl_ofi_tuner_process_config.h prints NCCL_OFI_TUNER_TYPE. That string appears nowhere else in the repository, and no parameter of that name is defined."
            />
            . Copying the variable name out of the log will not switch the tuner off. The working
            names are OFI_NCCL_TUNER_TYPE and OFI_NCCL_FORCE_NUM_RAILS{' '}
            <SourceRef provenance="code-derived" code={code.paramTuner} />.
          </Alert>

          <ExpandableSection
            headerText="cmpScore is not algorithm selection"
            headerDescription="A second thing the earlier text conflated"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The old text attributed algorithm selection to cmpScore in NCCL's search.cc, listing
                its ordering as interBw, then interPciBw, then interNhops, then intraBw, then
                intraNhops. The ordering is right{' '}
                <SourceRef provenance="code-derived" code={code.ncclCmpScore} />. What it orders is
                not algorithms.
              </Box>
              <Box variant="p">
                cmpScore is the comparison function for a sort over candidate GPUs, used while NCCL
                searches for the next GPU to add to a ring or tree channel. The scores are filled in
                from path hop counts and bandwidths between GPUs and between a GPU and the network
                device, then sorted, and the comment above the structure says the sort exists so the
                search converges quickly even if it times out{' '}
                <SourceRef provenance="code-derived" code={code.ncclSearchSort} />. Algorithm and
                protocol selection is the cost-table path described above, in enqueue.cc.
              </Box>
              <Box variant="p">
                The path is also worth stating correctly: the file is src/graph/search.cc, and has
                been since at least NCCL 2.21.5. There has never been a src/search.cc.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Most tuning advice circulating for EFA is stale. The plugin's own cheatsheet says so, variable by variable."
          >
            Environment variables: which layer, and which era
          </Header>
        }
      >
        <SpaceBetween size="m">
          <KnobLayersDiagram />

          <Box variant="p">
            The single most useful document here is the plugin's own EFA cheatsheet, which is
            scoped by version rather than written as timeless advice{' '}
            <SourceRef provenance="code-derived" code={code.envCheatsheet} />. Read against it, the
            standard EFA environment block that circulates in tutorials is almost entirely obsolete.
            The libfabric side of these variables is covered in the libfabric section; what follows
            is the NCCL and plugin side.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">The standard block, line by line</Header>}
            columnDefinitions={[
              { id: 'advice', header: 'Commonly recommended', cell: (item) => <code>{item.advice}</code> },
              {
                id: 'verdict',
                header: 'Verdict',
                cell: (item) => (
                  <Badge color={item.verdict === 'Do not set' ? 'red' : 'blue'}>{item.verdict}</Badge>
                ),
              },
              { id: 'why', header: 'Why', cell: (item) => item.why },
            ]}
            items={staleRows}
          />

          <Alert
            type="warning"
            header="NCCL_BUFFSIZE: the default is not NCCL's default"
          >
            The cheatsheet's advice on NCCL_BUFFSIZE is to leave it out and use the default, which
            reads as leaving NCCL's own value in place{' '}
            <SourceRef
              provenance="doc-code-conflict"
              code={code.platformTable}
              conflict="doc/efa-env-var.md says of NCCL_BUFFSIZE: 'Recommend to leave it out to use the default.' The platform table in platform-aws.cpp injects NCCL_BUFFSIZE=8388608 on p4d, p4de, p5, p5e, p5en, p6-b200, the p-series catch-all, and g7e."
            />
            . NCCL's default is 4 MiB{' '}
            <SourceRef provenance="code-derived" code={code.ncclBuffsize} />. On every EFA GPU
            platform in the table the plugin injects 8388608, which is 8 MiB, so the effective
            default is twice what NCCL would have chosen and it tracks the platform. Setting 8 MiB
            by hand does not change the value, it changes who owns it: your value is now pinned and
            the plugin logs that it skipped its own{' '}
            <SourceRef provenance="code-derived" code={code.envSkipLog} />.
          </Alert>

          <ExpandableSection
            headerText="One case where the plugin sets NCCL_PROTO for you"
            headerDescription="And the interaction with the v2 tuner bailout that follows from it"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                If GPUDirect RDMA support is not present, the plugin logs that it needs to force the
                simple protocol because GDR is not supported, and stages NCCL_PROTO as simple with
                overwrite set to false{' '}
                <SourceRef provenance="code-derived" code={code.gdrForce} />
                <SourceRef provenance="code-derived" code={code.protoSimple} />. The reasoning in
                the surrounding comment is a correctness argument, not a performance one: without
                GDR the low-latency protocol polls host memory for completion flags and assumes
                8-byte update granularity, which providers without host-memory guarantees do not
                promise <SourceRef provenance="code-derived" code={code.gdrForce} />.
              </Box>
              <Box variant="p">
                That creates a case worth naming: on a non-GDR platform running NCCL 2.21.x, the
                variable that trips the v2 tuner bailout can be one the plugin set rather than one
                you set. We have not traced the load ordering between the network plugin's
                environment rewrite and NCCL's tuner load, so treat the consequence as inference
                rather than established behaviour{' '}
                <SourceRef provenance="code-derived" code={code.protoSimple} label="inference" />.
                The mechanism on each side is code-confirmed; the interaction between them is not.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four version numbers have to agree, and only one place tells you what is actually loaded."
          >
            Version compatibility, and how to tell what you are running
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The plugin's release notes state the tested matrix for each release rather than a
            compatibility promise. Release v1.20.0 was tested with NCCL v2.28.9-1, v2.29.7-1 and
            v2.30.4-1, and states backward compatibility with NCCL v2.17.1 and later. It was tested
            with an AWS build of libfabric 2.4.0, requires at least libfabric 1.11.0 to build, and
            requires at least libfabric 1.22.0 to compile AWS-specific support{' '}
            <SourceRef provenance="code-derived" code={code.releaseNotes} />. That last number
            matches the run-time gate: an EFA provider on a libfabric older than 1.22.0 is refused
            outright <SourceRef provenance="code-derived" code={code.libfabricGate} />.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What breaks when versions drift</Box>
              <Box variant="p">
                Too-new NCCL against a too-old plugin means NCCL looks for a network plugin symbol
                the plugin does not export, and falls back to its own transport. Too-old NCCL means
                the tuner binds to the v2 interface and the NCCL_ALGO bailout is live again. Too-old
                libfabric means the plugin refuses EFA at init. A platform name the table does not
                match means no injected defaults and a 75 microsecond latency hint{' '}
                <SourceRef provenance="code-derived" code={code.latency} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Where to read the truth</Box>
              <Box variant="p">
                Not from the package manager. The plugin, the NCCL in the process and the libfabric
                that was actually dynamically linked can all differ from what is installed on disk,
                especially inside a container that inherits libraries from the host. The init banner
                is the only source that reports what the running process loaded{' '}
                <SourceRef provenance="code-derived" code={code.banner} />.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="The two lines to grep for">
            Run with NCCL_DEBUG=INFO and look for the line beginning NET/OFI Initializing, which
            carries the plugin package name and version, and the line beginning NET/OFI Using
            Libfabric version, which carries the major and minor of the libfabric the process linked
            against <SourceRef provenance="code-derived" code={code.banner} />. NCCL prints its own
            version in its startup banner. Those three, plus the instance type, are the full
            compatibility picture.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="NCCL_DEBUG=INFO produces thousands of lines. These are the ones that answer a question."
          >
            Reading NCCL debug output that actually means something
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every line the plugin emits is prefixed with NET/OFI, because the plugin's logging macros
            prepend that string before handing the message to NCCL's logger. Filtering NCCL output on
            that prefix separates plugin statements from NCCL statements, which is the first thing
            worth doing in a large log{' '}
            <SourceRef provenance="code-derived" code={code.banner} />.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Lines worth recognising, in roughly the order they appear</Header>}
            columnDefinitions={[
              { id: 'line', header: 'Log line', cell: (item) => <code>{item.line}</code> },
              { id: 'meaning', header: 'What it tells you', cell: (item) => item.meaning },
            ]}
            items={logRows}
          />

          <Alert type="warning" header="Two strings that changed and are still quoted from memory">
            <SpaceBetween size="xs">
              <Box variant="p">
                The provider line is Selected provider is, lowercase, and it now also reports the
                fabric name and the device count in the same line{' '}
                <SourceRef provenance="code-derived" code={code.libfabricGate} />. Guides quoting
                Selected Provider with a capital P are matching a string this version does not
                print, and a grep for it comes back empty on a working job.
              </Box>
              <Box variant="p">
                GPU Direct RDMA Enabled is an NCCL-side string, not a plugin string. The plugin's
                own signal for the opposite condition is the forced-simple-protocol line, which
                names GDR as the missing capability{' '}
                <SourceRef provenance="code-derived" code={code.protoSimple} />. If you want to know
                whether the plugin thinks GDR is available, look for the absence of that line.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A GPU-initiated networking path exists in the plugin today, behind a build flag and an environment variable."
          >
            GPUDirect Async is wired in
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The plugin carries a GIN (GPU-Initiated Networking) subsystem: seven implementation
            files under src/rdma/gin and nine headers, with a GDAKI variant that consumes the
            libfabric EFA provider's GPUDirect Async operations{' '}
            <SourceRef provenance="code-derived" code={code.ginOpen} />. Any claim that the feature
            is exposed by libfabric but unused by the NCCL plugin is out of date.
          </Box>
          <Box variant="p">
            The sequence is explicit in the code. It reuses the libfabric domain the proxy plugin
            already opened, with an in-file comment stating that on libfabric 2.4 and later the
            proxy selects the efa-direct fabric and that domain is the one exposing the GPUDirect
            Async operations. It opens a libfabric endpoint on that domain, then opens
            FI_EFA_GDA_OPS on it and queries the send and receive work-queue attributes and the
            completion-queue attributes needed to populate GPU-resident queue-pair and
            completion-queue descriptors{' '}
            <SourceRef provenance="code-derived" code={code.ginOpen} />
            <SourceRef provenance="code-derived" code={code.gdaOps} />. If the open fails it throws
            with a message naming the two likely causes: libfabric too old, or the proxy selected a
            fabric other than efa-direct{' '}
            <SourceRef provenance="code-derived" code={code.ginOpen} />.
          </Box>
          <Box variant="p">
            The result is exported against NCCL's GPU-initiated networking interface at version 13{' '}
            <SourceRef provenance="code-derived" code={code.ginExport} />. It is opt-in twice over.
            The plugin must be built with the GDAKI option, and
            OFI_NCCL_GIN_TYPE must be set to GDAKI at run time, at which point it logs that GDAKI
            mode is enabled and overwrites the exported GIN plugin symbol with the GDAKI one. Asking
            for GDAKI on a plugin built without it fails init deliberately rather than falling back
            silently, on the stated grounds that GDAKI was an explicit opt-in{' '}
            <SourceRef provenance="code-derived" code={code.ginSwitch} />
            <SourceRef provenance="code-derived" code={code.paramGin} />. The default remains the
            proxy path.
          </Box>
          <Alert type="info" header="What the libfabric side actually exposes">
            The operations table behind FI_EFA_GDA_OPS is queries and extended opens, not a data
            path: remote addressing fields, work-queue and completion-queue buffers with their
            doorbells and entry sizes, and a memory-registration local key. The libfabric section
            covers that table and the efa-direct gate in detail. What matters here is that the
            plugin is a consumer of it today{' '}
            <SourceRef provenance="code-derived" code={code.gdaOps} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What to check, in order, when a job is slower than it should be.">
            Working checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Confirm the path is real</Box>
              <Box variant="p">
                With NCCL_DEBUG=INFO, confirm the plugin init banner appears, the libfabric version
                is 1.22.0 or later, the selected provider is efa, and the device count matches the
                EFA devices you attached{' '}
                <SourceRef provenance="code-derived" code={code.banner} />
                <SourceRef provenance="code-derived" code={code.libfabricGate} />. If the
                AWS-specific options line is missing, platform detection failed and no defaults were
                applied <SourceRef provenance="code-derived" code={code.providerFilter} />. Then read
                the NIC group lines: the group count should match the accelerator count, and devices
                inside a group should share a PCIe prefix{' '}
                <SourceRef provenance="code-derived" code={code.nicGroupLog} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Confirm nothing is being displaced</Box>
              <Box variant="p">
                Grep for the line about skipping a variable that is already set{' '}
                <SourceRef provenance="code-derived" code={code.envSkipLog} />. Every hit is a
                platform default you overrode, whether or not you meant to. Then check the tuner:
                the selected-platform line and the region-tuner choices say it ran{' '}
                <SourceRef provenance="code-derived" code={code.tunerPlatform} />, and the fallback
                message names which of the three conditions failed if it did not{' '}
                <SourceRef provenance="code-derived" code={code.fallbackLog} />. Jobs of two nodes or
                fewer are skipped by design, because the regions are not defined there{' '}
                <SourceRef provenance="code-derived" code={code.regionSkip} />.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="Where AWS documentation ends">
            AWS documents how to install the plugin and how to verify EFA is present{' '}
            <SourceRef provenance="documented" doc={docs.efaNccl} />
            <SourceRef provenance="documented" doc={docs.efaStart} />, and documents which instance
            types support EFA <SourceRef provenance="documented" doc={docs.efa} />. It documents
            none of the plugin behaviour on this page: the platform table, the tuner conditions, the
            topology generation and the environment injection are all read from the implementation
            at release tag v1.20.0. Treat them as our reading of the source, and re-check them
            against the tag you are running.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
