import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * The Data Path section.
 *
 * Every code citation here is pinned to an immutable ref, per
 * revamp/source-authority-standard.md. Three facts on this page are easy to
 * get backwards and each is sourced from code rather than prose: EFA has two
 * kernel drivers that answer the kernel-verbs question differently, Data Path
 * Direct bypasses rdma-core on the data path only, and RDMA read and write are
 * device operations gated by device-reported capability bits.
 */

const AMZN = 'b99452b70756b1b394b1e7ff238d4efbdca44c5b';
const LINUX = '2d2338c93da79b3bfe4b6099a931d9468d539952';
const LF = 'v2.6.0';
const READ = '2026-08-01';

/** Pinned code citations. Never a branch: a ci.sh gate rejects /blob/main/. */
const amzn = (path: string, lines?: string): CodeRef => ({
  repo: 'amzn/amzn-drivers',
  ref: AMZN,
  path: `kernel/linux/efa/${path}`,
  lines,
  read: READ,
});
const lfab = (path: string, lines?: string): CodeRef => ({
  repo: 'ofiwg/libfabric',
  ref: LF,
  path: `prov/efa/${path}`,
  lines,
  read: READ,
});

const code = {
  // amzn-drivers, the out-of-tree module the EFA installer builds.
  kverbs: amzn('src/efa_data_verbs.c', 'L324-L756'),
  devOps: amzn('src/efa_main.c', 'L551-L559'),
  controlOps: amzn('src/efa_main.c', 'L474-L547'),
  kverbsOn: amzn('CMakeLists.txt', 'L36'),
  dkms: amzn('conf/configure-dkms.sh'),
  ioDefs: amzn('src/efa_io_defs.h', 'L23-L93'),
  deviceCaps: amzn('src/efa_admin_cmds_defs.h', 'L726-L746'),
  capMasks: amzn('src/efa_admin_cmds_defs.h', 'L1296-L1299'),
  mmapKinds: amzn('src/efa_verbs.c', 'L40-L42'),
  mmapQueue: amzn('src/efa_verbs.c', 'L879-L923'),
  mmapCq: amzn('src/efa_verbs.c', 'L1763-L1775'),
  mmapProt: amzn('src/efa_verbs.c', 'L3343-L3382'),
  uarn: amzn('src/efa.h', 'L89-L99'),
  uarnScope: amzn('src/efa_verbs.c', 'L1333'),
  p2p: amzn('src/efa_verbs.c', 'L2814'),
  dmabuf: amzn('src/efa_verbs.c', 'L2707-L2754'),

  // The driver that ships inside mainline Linux. A different driver.
  mainlineOps: {
    repo: 'torvalds/linux',
    ref: LINUX,
    path: 'drivers/infiniband/hw/efa/efa_main.c',
    lines: 'L365-L403',
    read: READ,
  },

  // libfabric EFA provider.
  dpdQp: lfab('src/efa_data_path_direct.c', 'L82-L100'),
  dpdCq: lfab('src/efa_data_path_direct.c', 'L186-L200'),
  dpdOwner: lfab('src/efa_data_path_direct.c', 'L130-L132'),
  dpdGate: lfab('configure.m4', 'L317-L322'),
  dpdHelp: lfab('src/efa_env.c', 'L244-L249'),
  dpdDefault: lfab('src/efa_env.c', 'L41'),
  dpdFallback: lfab('src/efa_data_path_ops.h', 'L216-L219'),
  dpdDoorbell: lfab('src/efa_data_path_direct_entry.h', 'L435-L445'),
  subCq: lfab('src/efa_device.c', 'L521-L526'),
  mrCacheOpen: lfab('src/efa_domain.c', 'L115-L127'),
  mrCacheDefault: lfab('src/rdm/efa_rdm_mr.c', 'L28-L38'),
  mrCacheHelp: lfab('src/efa_env.c', 'L194-L201'),
  memcpyThreshold: lfab('src/efa_env.c', 'L24'),
} satisfies Record<string, CodeRef>;

const docs = {
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: READ,
  },
  changelog: {
    title: 'EC2 User Guide: EFA software release notes',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-changelog.html',
    tier: 1,
    accessed: READ,
  },
  nccl: {
    title: 'EC2 User Guide: Get started with EFA and NCCL',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start-nccl.html',
    tier: 1,
    accessed: READ,
  },
} satisfies Record<string, DocRef>;

/** efa-d01. The headline visual: what the EFA path deletes. */
function OsBypassPathDiagram() {
  const kernelPath = [
    { title: 'Application', sub: 'sendmsg on a socket', kind: 'app' },
    { title: 'System call', sub: 'transition into the kernel', kind: 'slow' },
    { title: 'Socket buffer copy', sub: 'payload copied out of your buffer', kind: 'slow' },
    { title: 'TCP protocol stack', sub: 'segmentation, checksums, congestion state', kind: 'slow' },
    { title: 'ENA driver', sub: 'descriptor build and doorbell', kind: 'slow' },
    { title: 'Nitro card, ENA device', sub: 'serialise onto the link', kind: 'hw' },
  ];
  const bypassPath = [
    { title: 'Application', sub: 'ncclSend', kind: 'app' },
    { title: 'libfabric EFA provider', sub: 'builds the work queue entry', kind: 'fast' },
    { title: 'Mapped queue memory', sub: 'send queue, completion queue, doorbells', kind: 'fast' },
    { title: 'Nitro card, EFA device', sub: 'serialise onto the link', kind: 'hw' },
  ];

  const tone: Record<string, { fill: string; stroke: string; white: boolean }> = {
    app: { fill: '#f2f8fd', stroke: '#879596', white: false },
    slow: { fill: '#fdf3ec', stroke: '#ec7211', white: false },
    fast: { fill: '#ecf7ec', stroke: '#037f0c', white: false },
    hw: { fill: '#414d5c', stroke: '#414d5c', white: true },
  };

  const column = (
    steps: { title: string; sub: string; kind: string }[],
    x: number,
    width: number,
    stride: number,
    arrow: string
  ) =>
    steps.map((step, index) => {
      const y = 76 + index * stride;
      const cx = x + width / 2;
      const t = tone[step.kind];
      return (
        <g key={`${x}-${step.title}`}>
          <rect
            x={x}
            y={y}
            width={width}
            height="44"
            rx="6"
            fill={t.fill}
            stroke={t.stroke}
            strokeWidth="1.5"
          />
          <text className={t.white ? 'obp-tw' : 'obp-t'} x={cx} y={y + 20}>
            {step.title}
          </text>
          <text className={t.white ? 'obp-sw' : 'obp-s'} x={cx} y={y + 36}>
            {step.sub}
          </text>
          {index < steps.length - 1 && (
            <path className={arrow} d={`M${cx},${y + 44} L${cx},${y + stride - 4}`} />
          )}
        </g>
      );
    });

  return (
    <svg
      viewBox="0 0 880 468"
      role="img"
      aria-labelledby="efa-d01-osbypass-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d01-osbypass-title">
        A message sent over TCP crosses a system call, a socket buffer copy, the TCP protocol
        stack and the ENA driver before it reaches the Nitro card. The same message sent over EFA
        goes from the application through libfabric into queue memory already mapped into the
        process, and from there to the card. Those four kernel layers belong to the TCP path
        alone.
      </title>
      <style>
        {`
          .obp-h { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .obp-hs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .obp-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .obp-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .obp-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .obp-sw { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .obp-n { fill: #8b6c00; font: 600 10px sans-serif; text-anchor: middle; }
          .obp-a { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#obp-ah); }
          .obp-g { stroke: #037f0c; stroke-width: 2; fill: none; marker-end: url(#obp-gh); }
          .obp-br { stroke: #8b6c00; stroke-width: 1.5; fill: none; }
        `}
      </style>
      <defs>
        <marker id="obp-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
        <marker id="obp-gh" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#037f0c" />
        </marker>
      </defs>
      <rect x="0" y="0" width="880" height="468" rx="8" fill="#ffffff" />

      <text className="obp-h" x="205" y="34">TCP over the ENA path</text>
      <text className="obp-hs" x="205" y="54">every send crosses into the kernel</text>
      <text className="obp-h" x="675" y="34">EFA OS-bypass path</text>
      <text className="obp-hs" x="675" y="54">the send stays in userspace</text>

      {column(kernelPath, 40, 330, 60, 'obp-a')}
      {column(bypassPath, 500, 350, 100, 'obp-g')}

      <path className="obp-br" d="M400,136 L392,136 L392,360 L400,360" />
      <text className="obp-n" x="448" y="244">these layers</text>
      <text className="obp-n" x="448" y="258">are gone</text>

      <path className="obp-a" d="M205,420 L205,442" />
      <path className="obp-g" d="M675,420 L675,442" />
      <path d="M40,446 L850,446" stroke="#414d5c" strokeWidth="2" fill="none" />
      <text className="obp-hs" x="440" y="462">the wire</text>
    </svg>
  );
}

/** efa-d03. Where the kernel is, and is not. */
function KernelUserspaceSplitDiagram() {
  return (
    <svg
      viewBox="0 0 880 344"
      role="img"
      aria-labelledby="efa-d03-kernelsplit-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d03-kernelsplit-title">
        The EFA kernel driver is on the control plane only. It creates queue pairs, protection
        domains, memory regions and address handles, and maps the device registers into the
        process. Once that mapping exists, the application writes work queue entries and reads
        completions straight from that memory to the Nitro card, and the kernel is called again
        only at teardown.
      </title>
      <style>
        {`
          .kus-tag { fill: #5f6b7a; font: 600 10px sans-serif; letter-spacing: 0.6px; }
          .kus-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .kus-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .kus-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .kus-sw { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .kus-l { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .kus-g { fill: #037f0c; font: 600 10px sans-serif; text-anchor: middle; }
          .kus-n { fill: #5f6b7a; font: 600 10px sans-serif; }
          .kus-a { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#kus-ah); }
          .kus-fat { stroke: #037f0c; stroke-width: 3.5; fill: none; marker-end: url(#kus-gh); }
          .kus-dash { stroke: #5f6b7a; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#kus-ah); }
        `}
      </style>
      <defs>
        <marker id="kus-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
        <marker id="kus-gh" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#037f0c" />
        </marker>
      </defs>
      <rect x="0" y="0" width="880" height="344" rx="8" fill="#ffffff" />

      <text className="kus-tag" x="24" y="26">USERSPACE</text>

      <rect x="24" y="36" width="230" height="48" rx="6" fill="#f2f8fd" stroke="#0972d3" strokeWidth="1.5" />
      <text className="kus-t" x="139" y="60">Application</text>
      <text className="kus-s" x="139" y="76">ncclSend or MPI_Send</text>

      <rect x="24" y="92" width="230" height="48" rx="6" fill="#f2f8fd" stroke="#0972d3" strokeWidth="1.5" />
      <text className="kus-t" x="139" y="116">aws-ofi-nccl</text>
      <text className="kus-s" x="139" y="132">NCCL network plugin</text>

      <rect x="24" y="148" width="230" height="48" rx="6" fill="#f2f8fd" stroke="#0972d3" strokeWidth="1.5" />
      <text className="kus-t" x="139" y="172">libfabric EFA provider</text>
      <text className="kus-s" x="139" y="188">builds and posts the WQE</text>

      <rect x="290" y="36" width="290" height="160" rx="6" fill="#ecf7ec" stroke="#037f0c" strokeWidth="1.5" />
      <text className="kus-t" x="435" y="60">Mapped queue memory</text>
      <text className="kus-l" x="435" y="88">send queue: write-combined</text>
      <text className="kus-l" x="435" y="108">receive and completion queues</text>
      <text className="kus-l" x="435" y="128">doorbell pages: uncached</text>
      <text className="kus-l" x="435" y="160">inside this process, no copy</text>

      <path className="kus-a" d="M256,172 L286,172" />

      <path d="M24,226 L640,226" stroke="#d1d5db" strokeWidth="1.5" fill="none" strokeDasharray="5 4" />
      <text className="kus-tag" x="24" y="244">KERNEL</text>
      <path className="kus-a" d="M139,196 L139,258" />
      <text className="kus-n" x="152" y="248">control plane only</text>

      <rect x="24" y="262" width="230" height="54" rx="6" fill="#f2f8fd" stroke="#879596" strokeWidth="1.5" />
      <text className="kus-t" x="139" y="286">ib_uverbs</text>
      <text className="kus-s" x="139" y="304">one call per setup step</text>

      <rect x="290" y="262" width="290" height="54" rx="6" fill="#f2f8fd" stroke="#879596" strokeWidth="1.5" />
      <text className="kus-t" x="435" y="286">efa kernel driver</text>
      <text className="kus-s" x="435" y="304">creates QP, PD, MR, AH; maps the BARs</text>

      <path className="kus-a" d="M256,289 L286,289" />

      <rect x="680" y="36" width="176" height="280" rx="6" fill="#414d5c" stroke="#414d5c" strokeWidth="1.5" />
      <text className="kus-tw" x="768" y="166">Nitro card</text>
      <text className="kus-sw" x="768" y="186">EFA device</text>

      <text className="kus-g" x="628" y="88">data plane</text>
      <text className="kus-g" x="628" y="102">no system call</text>
      <path className="kus-fat" d="M582,116 L674,116" />

      <text className="kus-n" x="592" y="276">admin queue</text>
      <path className="kus-dash" d="M582,289 L674,289" />
    </svg>
  );
}

/** efa-d04. One send, six steps, and which of them touch the kernel. */
function PostSendDoorbellSequence() {
  const steps = [
    { n: '1', title: 'Build the WQE', sub: 'opcode, key, len', lane: 0 },
    { n: '2', title: 'Write to the SQ', sub: 'write-combined', lane: 1 },
    { n: '3', title: 'Ring doorbell', sub: 'one MMIO write', lane: 1 },
    { n: '4', title: 'Device sends', sub: 'reads the payload', lane: 2 },
    { n: '5', title: 'CQE written', sub: 'phase bit flips', lane: 1 },
    { n: '6', title: 'Poll and reap', sub: 'no system call', lane: 0 },
  ];
  const laneTop = [58, 160, 262];
  const bandTop = [50, 152, 254];
  const laneNames = [
    'APPLICATION THREAD',
    'MAPPED QUEUE MEMORY, THIS PROCESS',
    'EFA DEVICE ON THE NITRO CARD',
  ];
  const laneFill = ['#f2f8fd', '#ecf7ec', '#eef0f2'];
  const boxStroke = ['#0972d3', '#037f0c', '#414d5c'];
  const links = [
    'M90,114 L230,156',
    'M292,188 L305,188',
    'M370,216 L510,258',
    'M574,290 L650,220',
    'M714,188 L790,118',
  ];

  return (
    <svg
      viewBox="0 0 880 366"
      role="img"
      aria-labelledby="efa-d04-doorbell-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d04-doorbell-title">
        Sending one message costs six steps and no system calls. The application builds a work
        queue entry, writes it into the mapped send queue, and rings the doorbell with a single
        memory-mapped write. The device reads the payload straight out of the registered buffer,
        writes a completion entry back into mapped memory with its phase bit flipped, and the
        application reaps it by reading that bit.
      </title>
      <style>
        {`
          .dbs-lane { fill: #5f6b7a; font: 600 10px sans-serif; letter-spacing: 0.6px; }
          .dbs-n { fill: #5f6b7a; font: 600 10px sans-serif; }
          .dbs-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .dbs-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dbs-f { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dbs-a { stroke: #0972d3; stroke-width: 2; fill: none; marker-end: url(#dbs-ah); }
        `}
      </style>
      <defs>
        <marker id="dbs-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#0972d3" />
        </marker>
      </defs>
      <rect x="0" y="0" width="880" height="366" rx="8" fill="#ffffff" />

      {bandTop.map((top, index) => (
        <g key={laneNames[index]}>
          <text className="dbs-lane" x="20" y={top - 8}>
            {laneNames[index]}
          </text>
          <rect x="16" y={top} width="848" height="72" rx="6" fill={laneFill[index]} />
        </g>
      ))}

      {links.map((d) => (
        <path key={d} className="dbs-a" d={d} />
      ))}

      {steps.map((step, index) => {
        const x = 26 + index * 140;
        const y = laneTop[step.lane];
        return (
          <g key={step.n}>
            <rect
              x={x}
              y={y}
              width="128"
              height="56"
              rx="6"
              fill="#ffffff"
              stroke={boxStroke[step.lane]}
              strokeWidth="1.5"
            />
            <text className="dbs-n" x={x + 10} y={y + 18}>
              {step.n}
            </text>
            <text className="dbs-t" x={x + 64} y={y + 36}>
              {step.title}
            </text>
            <text className="dbs-s" x={x + 64} y={y + 50}>
              {step.sub}
            </text>
          </g>
        );
      })}

      <text className="dbs-f" x="440" y="350">
        Steps 1, 2, 3, 5 and 6 run entirely in userspace. None of them calls the kernel.
      </text>
    </svg>
  );
}

interface VerbsObject {
  name: string;
  what: string;
  hot: string;
}

const verbsObjects: VerbsObject[] = [
  {
    name: 'Protection domain (PD)',
    what: 'The isolation boundary. Every queue pair and every memory region belongs to one.',
    hot: 'Never touched',
  },
  {
    name: 'Memory region (MR)',
    what: 'A pinned, device-addressable range of your memory, with a local key and a remote key.',
    hot: 'Its local key is copied into every work queue entry',
  },
  {
    name: 'Queue pair (QP)',
    what: 'A send queue and a receive queue. The send queue is the ring the application writes into.',
    hot: 'Written directly, through the mapping',
  },
  {
    name: 'Completion queue (CQ)',
    what: 'The ring the device writes completion entries into, with a phase bit the reader watches.',
    hot: 'Read directly, through the mapping',
  },
  {
    name: 'Address handle (AH)',
    what: 'The resolved destination. SRD carries one on every send instead of holding a connection.',
    hot: 'Its handle number is copied into the descriptor',
  },
];

export function DataPath() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="I call ncclSend. What actually happens between that call and the wire, and where is the kernel in it?"
          >
            The Data Path: OS-Bypass End to End
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One collective operation in NCCL (NVIDIA Collective Communications Library) or MPI
            (Message Passing Interface) is millions of small messages. On a TCP (Transmission
            Control Protocol) socket, each one pays for a system call, a copy out of your buffer
            into a socket buffer, protocol processing, and a driver hand-off. That cost is fixed
            per message and stays fixed as the cluster grows, so at high message rates the
            software path is what sets the ceiling.
          </Box>
          <Box variant="p">
            <strong>EFA (Elastic Fabric Adapter)</strong> maps the device queues into the process
            once, at setup, and then stays out of the way. To send, the application writes a WQE
            (Work Queue Entry) into memory it already owns and rings a doorbell with a single
            write to a mapped device register. To reap the result it reads a CQE (Completion Queue
            Entry) out of another mapped ring. Both are ordinary memory accesses inside the
            process.
          </Box>
          <OsBypassPathDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative. The diagram shows which layers each path traverses, not measured
            latency. ENA is the Elastic Network Adapter, the ordinary Internet Protocol network
            device that shares the same interface as the EFA device.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which work costs a system call, and which work never does">
            What the kernel is still on the path for
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The split is by lifetime. Work that happens once per resource goes through the kernel,
            and work that happens once per message stays in userspace.
          </Box>
          <KernelUserspaceSplitDiagram />
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Kernel, once per resource</Box>
              <Box variant="p">
                Allocating a protection domain, creating a queue pair and a completion queue,
                registering memory, creating an address handle, and mapping the device registers
                into the process. Each of these is a real transition into the kernel{' '}
                <SourceRef provenance="code-derived" code={code.controlOps} />, and teardown runs
                the same way in reverse.
              </Box>
            </div>
            <div>
              <Box variant="h3">Userspace, once per message</Box>
              <Box variant="p">
                Building the descriptor, writing it into the send queue, ringing the doorbell,
                reading completions. The mapping created at setup is the whole mechanism: once it
                exists, the queues are ordinary memory in the process and the doorbell is an
                ordinary store instruction.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="OS bypass is a property of the data plane">
            Setup is expensive by design: registering a large buffer pins pages and programs the
            device page tables. Paying that once per resource is what leaves the per-message path
            as a handful of stores, which is also why registration is the one setup cost worth
            engineering around. The registration container below is where that gets done.
          </Alert>
          <ExpandableSection
            headerText="Which EFA kernel driver you are running changes the answer"
            headerDescription="Nothing here changes what a libfabric application does. Open it before quoting EFA driver source, because two different drivers answer this differently."
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The EFA installer builds an out-of-tree module, mainline Linux carries a driver of its
                own, and the two answer this question differently. The module AWS ships carries a dedicated
                data-path source file implementing post send (<code>post_send</code>), post receive
                (<code>post_recv</code>), poll completion queue (<code>poll_cq</code>) and request
                notify, and has done since driver r2.12.0{' '}
                <SourceRef provenance="code-derived" code={code.kverbs} />, and registers all four in
                the device operations table behind a kernel-verbs build guard{' '}
                <SourceRef provenance="code-derived" code={code.devOps} />. That guard is on by
                default: the build sets the kernel-verbs option to ON in its own cache{' '}
                <SourceRef provenance="code-derived" code={code.kverbsOn} />, and the DKMS (Dynamic
                Kernel Module Support) configure script that the EFA installer actually runs leaves it
                at that default <SourceRef provenance="code-derived" code={code.dkms} />. So on any host
                that installed the driver the normal way, those operations are live.
              </Box>
              <Box variant="p">
                The driver inside mainline Linux is a separate driver. Its device operations table
                stops at the control plane, and the tree carries no EFA data-path source file{' '}
                <SourceRef provenance="code-derived" code={code.mainlineOps} />. Any sentence about
                the EFA kernel driver has to say which one it means.
              </Box>
              <Box variant="p">
                Both answers leave OS bypass intact. These are the in-kernel verbs entry points,
                reachable only by other kernel modules, and a libfabric application reaches the device
                through the mapping instead.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Five objects, created once, used on every send">
            The verbs objects behind one ncclSend
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Verbs is the RDMA (Remote Direct Memory Access) object model EFA is programmed
            through, and five of its objects stand behind every send. All five are created through
            the kernel, once per resource. None of them is a setting you tune: this table is the
            vocabulary the registration, mapping and completion material below is written in, and
            its last column is the lifetime split made concrete.
          </Box>
          <Table
            columnDefinitions={[
              {
                id: 'name',
                header: 'Object',
                cell: (item) => <strong>{item.name}</strong>,
              },
              { id: 'what', header: 'What it is', cell: (item) => item.what },
              { id: 'hot', header: 'On the send path', cell: (item) => item.hot },
            ]}
            items={verbsObjects}
            variant="embedded"
            empty={<Box variant="p">No entries.</Box>}
          />
          <Box variant="p">
            SRD (Scalable Reliable Datagram) is why the address handle matters more here than it
            would on a connected transport. There is no per-peer connection state to hold, so the
            destination travels with each descriptor. That is what keeps queue-pair count linear
            in the number of peers, where a connected transport goes quadratic.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Six steps, five of them in userspace">
            One ncclSend, step by step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <PostSendDoorbellSequence />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Steps 1 to 3: post</Box>
              <Box variant="p">
                libfabric builds the descriptor in a local variable, copies it into the send-queue
                ring in mapped memory, and rings the doorbell. When several sends are queued back
                to back the doorbell is deferred to the end of the batch, and a write barrier is
                issued before the first descriptor of each batch so the write-combined stores are
                flushed in the right order{' '}
                <SourceRef provenance="code-derived" code={code.dpdDoorbell} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Step 4: the device</Box>
              <Box variant="p">
                The card reads the descriptor, then reads the payload out of the registered buffer
                by DMA (Direct Memory Access) using the local key in the descriptor to find it.
                For small messages the payload rides inline in the descriptor, which is what the
                low-latency queue exists for.
              </Box>
            </div>
            <div>
              <Box variant="h3">Steps 5 and 6: reap</Box>
              <Box variant="p">
                The device writes a completion entry into the completion-queue ring with a phase
                bit set to the current generation. The reader compares that bit against the phase
                it expects. A match means a new completion, and in the common case that comparison
                is the whole reap: a load and a compare in userspace, with no lock, interrupt or
                system call.
              </Box>
            </div>
          </ColumnLayout>
          <ExpandableSection
            headerText="Who builds the descriptor: libfabric, or the userspace verbs library?"
            headerDescription="Data Path Direct is on by default, and it still needs rdma-core for everything except the data path"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                When Data Path Direct is active, libfabric builds the work queue entry and parses
                completion entries itself, in the same descriptor formats the kernel driver uses,
                instead of calling the userspace verbs library. The fallback is one branch
                away in the same header, and still calls the verbs library when the feature is off{' '}
                <SourceRef provenance="code-derived" code={code.dpdFallback} />. It is on by default{' '}
                <SourceRef provenance="code-derived" code={code.dpdDefault} />.
              </Box>
              <Box variant="p">
                rdma-core still owns setup. The queue-pair initialiser calls the rdma-core
                device-specific query that returns the send-queue and receive-queue buffers,
                doorbells, entry sizes and depths{' '}
                <SourceRef provenance="code-derived" code={code.dpdQp} />, the completion-queue
                initialiser calls the matching query for the completion ring{' '}
                <SourceRef provenance="code-derived" code={code.dpdCq} />, and rdma-core owns and
                unmaps those buffers{' '}
                <SourceRef provenance="code-derived" code={code.dpdOwner} />. The build gate makes
                the dependency explicit: the feature is compiled in only when rdma-core provides
                both of those queries{' '}
                <SourceRef provenance="code-derived" code={code.dpdGate} />.
              </Box>
              <Alert type="error" header="Two libfabric documents disagree about how far the bypass goes">
                The parameter help text says the careful thing, describing the feature as bypassing
                rdma-core on the data path, including completion polling and transmit and receive
                submission <SourceRef provenance="code-derived" code={code.dpdHelp} />. The provider
                comparison document in the same repository drops the qualifier and says it
                implements the work-queue post and completion poll directly in libfabric without
                the rdma-core interface, full stop. The code wins{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.dpdQp}
                  conflict="prov/efa/docs/efa_fabric_comparison.md lines 281 to 282 state that Data Path Direct implements the WQE post and CQ poll directly in Libfabric without rdma-core API, with no qualifier. The implementation calls efadv_query_qp_wqs and efadv_query_cq, both rdma-core, and the build gate requires them."
                  label="doc vs code"
                />
                .
              </Alert>
              <Box variant="p">
                Two gates decide whether it is live on a given host, and neither is a switch you
                throw. The feature turns itself off on first-generation devices, which the provider
                detects by vendor part identifier{' '}
                <SourceRef provenance="code-derived" code={code.subCq} />, and it declines
                completion queues that carry a wait object when the installed rdma-core lacks a
                doorbell field in its completion-queue attributes. So which of the two descriptor
                paths a job runs on follows from the device generation and from the rdma-core in
                the image, and it changes when either of those changes.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why steps 2 and 3 are as cheap as they are, and what is fixed rather than tunable">
            Doorbells, the low-latency queue, and write-combining
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Steps 2 and 3 are cheap because the regions the driver maps into the process do not all
            carry the same memory attributes. The driver hands userspace three kinds of mapping{' '}
            <SourceRef provenance="code-derived" code={code.mmapKinds} />, and which kind a region
            gets is a correctness decision, fixed by the driver per region when it creates the queue
            pair <SourceRef provenance="code-derived" code={code.mmapQueue} />. There is nothing to
            configure here, so this container is model rather than knobs: it is what makes the
            registration and completion behaviour further down predictable.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Doorbells: uncached</Box>
              <Box variant="p">
                The send-queue and receive-queue doorbells come from the doorbell BAR (Base Address
                Register) and are mapped uncached; the memory BAR is the write-combining case in
                the same switch statement{' '}
                <SourceRef provenance="code-derived" code={code.mmapProt} />. That is what a
                doorbell needs: an uncached mapping makes it reach the device as a single,
                immediate, ordered write.
              </Box>
            </div>
            <div>
              <Box variant="h3">LLQ descriptors: write-combined</Box>
              <Box variant="p">
                The send-queue descriptor ring lives in the memory BAR and is the region that is
                mapped write-combined{' '}
                <SourceRef provenance="code-derived" code={code.mmapQueue} />. This is the LLQ
                (Low-Latency Queue): the descriptor, and for small messages the payload with it,
                is pushed to the device by MMIO (Memory-Mapped I/O) instead of waiting for the
                device to DMA it back.
              </Box>
            </div>
            <div>
              <Box variant="h3">Completion rings: coherent DMA</Box>
              <Box variant="p">
                Receive-queue and completion-queue buffers are ordinary DMA-coherent pages
                inserted into the process address space{' '}
                <SourceRef provenance="code-derived" code={code.mmapCq} />. The device writes
                completions there and the application reads them with plain loads.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            The kernel is off the data path, and the device is what keeps one process out of
            another&apos;s queues. Each user context is allocated a UARN (User Access Region Number)
            that the driver records on the context and on every queue pair{' '}
            <SourceRef provenance="code-derived" code={code.uarn} /> and passes to the device when
            it creates the queue pair{' '}
            <SourceRef provenance="code-derived" code={code.uarnScope} />. A process can only ring
            doorbells inside its own region.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The one expensive thing on the setup path, and how libfabric avoids repeating it">
            Memory registration and the MR cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The device reads exactly the memory that has been registered with it. Registration pins
            the buffer and returns a local key and a remote key that the hardware validates on
            every access. It is a kernel call and an expensive one, so the shape that works is to
            register buffers once and reuse them; registering inside the send loop gives back
            everything OS bypass earned.
          </Box>
          <Box variant="p">
            libfabric does that reuse for you with a registration cache on the domain. It opens the
            cache when the application has not asked to manage registrations itself{' '}
            <SourceRef provenance="code-derived" code={code.mrCacheOpen} />, and the cache is on
            by default outside of address-sanitizer builds{' '}
            <SourceRef provenance="code-derived" code={code.mrCacheDefault} />. The provider
            describes the trade in its own parameter help text: the cache plus inline registration
            replaces a bounce buffer for scatter-gather entries larger than a threshold, and with
            the cache off the provider only ever uses a bounce buffer{' '}
            <SourceRef provenance="code-derived" code={code.mrCacheHelp} />. That threshold
            defaults to 4096 bytes{' '}
            <SourceRef provenance="code-derived" code={code.memcpyThreshold} />, so it is the size
            to compare your scatter-gather entries against before turning the cache off.
          </Box>
          <Alert type="warning" header="Keeping the cache honest">
            A cached registration is keyed on an address range, so the provider hooks memory
            monitors and flushes the cache across a fork to keep those keys pointing at pages the
            process still owns. Watch for allocators that free and remap a range behind libfabric,
            which is the case those hooks exist to catch. Bound the cache through the maximum
            cached count and maximum cached size parameters{' '}
            <SourceRef provenance="code-derived" code={code.mrCacheHelp} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Taking host memory out of the copy path as well">
            GPUDirect RDMA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            OS bypass takes the kernel off the send path. GPUDirect RDMA takes host memory off it.
            The registered buffer is GPU memory, the device reads it over the peer-to-peer path,
            and the payload travels from GPU memory to the wire. The driver carries the
            peer-to-peer plumbing for this and takes it whenever the
            registered range resolves to accelerator memory{' '}
            <SourceRef provenance="code-derived" code={code.p2p} />. A second, more modern route
            registers the buffer from a shared file descriptor{' '}
            <SourceRef provenance="code-derived" code={code.dmabuf} />.
          </Box>
          <Alert type="info" header="Which RDMA operations you get is an instance-type question">
            Most supported instance types with Nitro version 4 and later have RDMA write, and all
            instances with Nitro version 4 and later have RDMA read{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. Two documented exceptions cut
            both ways: p4d.24xlarge and p4de.24xlarge are Nitro v3 and still have RDMA read, and
            c7gn and hpc7g are Nitro v5 and are read only. Those exceptions are why the instance
            type is the thing to check, rather than the Nitro version alone, and it is worth
            checking before designing around RDMA write.
          </Alert>
          <ExpandableSection
            headerText="Why the answer is per device: the capability bits it reports"
            headerDescription="The code evidence that these are operations of the device, reported over the admin queue"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The descriptor format shared between driver and device defines RDMA read as opcode
                1 and RDMA write as opcode 2, in the four-bit operation-type field of the transmit
                descriptor <SourceRef provenance="code-derived" code={code.ioDefs} />. On its own
                that proves less than it looks: an enumeration in a header is a software namespace.
                The decisive evidence is that the device reports these as capabilities of itself.
                The device attribute descriptor returned over the admin queue carries a capability
                word whose bit 0 means RDMA read is supported on transmit queues and whose bit 3
                means RDMA write is, alongside a maximum RDMA transfer size{' '}
                <SourceRef provenance="code-derived" code={code.deviceCaps} />, with the driver
                masks for both bits defined further down the same header{' '}
                <SourceRef provenance="code-derived" code={code.capMasks} />.
              </Box>
              <Alert type="error" header="A file in the same repository still says only Send is supported">
                That file is a specification document written in 2019 and never revised. It sits
                next to the driver that contradicts it, inside an official AWS repository, which is
                exactly why it reads like a primary source. It is not one, and the code wins{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.deviceCaps}
                  conflict="kernel/linux/efa/SRD.txt in the same repository still reads: Currently only Send operation is supported, but nothing precludes RDMA operations support in future (with weak memory consistency). It is a 2019 specification document that has not been revised. The driver in the same repository defines RDMA read and write opcodes and reads device capability bits for both."
                  label="doc vs code"
                />
                .
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
          <Alert type="info" header="GPUDirect RDMA is on by default; GDRCopy is a separate install">
            AWS made the installer flag that used to enable it a no-op in 2021, because the
            driver enables the support by default{' '}
            <SourceRef provenance="documented" doc={docs.changelog} />. GDRCopy is its own
            component, installed as its own step in the AWS NCCL getting-started guide{' '}
            <SourceRef provenance="documented" doc={docs.nccl} />, and it gives the host processor
            a low-latency mapping into GPU memory. Peer-to-peer support is what decides whether
            payloads leave GPU memory, so that is the one to confirm on a new instance; a build
            without GDRCopy still sends straight from GPU memory.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
