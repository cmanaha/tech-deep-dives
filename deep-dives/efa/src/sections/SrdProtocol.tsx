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
 * SRD: The Transport Protocol.
 *
 * Source-authority rules that govern this file (see
 * revamp/source-authority-standard.md):
 *
 *  1. `kernel/linux/efa/SRD.txt` is NEVER cited as evidence. It is a 2019-era
 *     specification document that the code in its own repository contradicts.
 *     It appears on the page only as one side of a documentation-versus-code
 *     conflict, where the driver opcodes win.
 *  2. SRD does not sit "on top of ENA". SRD lives in the Nitro card. ENA (via
 *     ENA Express) and EFA are peer consumers of it. The decisive disproof is
 *     that an EFA-only interface materializes an EFA device with no ENA device
 *     and still carries SRD traffic.
 *  3. The SRD design paper is Shalev et al., IEEE Micro 2020. Not NSDI.
 */

const CODE_READ = '2026-08-01';
const DOC_ACCESSED = '2026-08-01';

/** amzn/amzn-drivers at the efa_linux_3.3.0 release tag. There is no bare
 *  r3.3.0 tag; the driver tags are named efa_linux_*. */
const DRIVERS = 'b99452b70756b1b394b1e7ff238d4efbdca44c5b';
/** ofiwg/libfabric at the v2.6.0 release tag. */
const LIBFABRIC = 'v2.6.0';

function driversRef(path: string, lines: string): CodeRef {
  return { repo: 'amzn/amzn-drivers', ref: DRIVERS, path, lines, read: CODE_READ };
}

function libfabricRef(path: string, lines: string): CodeRef {
  return { repo: 'ofiwg/libfabric', ref: LIBFABRIC, path, lines, read: CODE_READ };
}

const code = {
  qpType: driversRef('kernel/linux/efa/src/efa-abi.h', 'L89-L91'),
  txMeta: driversRef('kernel/linux/efa/src/efa_io_defs.h', 'L87-L151'),
  modifyQp: driversRef('kernel/linux/efa/src/efa_admin_cmds_defs.h', 'L215-L250'),
  netStats: driversRef('kernel/linux/efa/src/efa_admin_cmds_defs.h', 'L664-L674'),
  portStats: driversRef('kernel/linux/efa/src/efa_verbs.c', 'L74-L96'),
  compStatus: driversRef('kernel/linux/efa/src/efa_io_defs.h', 'L36-L70'),
  nodeType: driversRef('kernel/linux/efa/src/efa_main.c', 'L616'),
  enaSrdStats: driversRef('kernel/linux/common/ena_com/ena_admin_defs.h', 'L512-L536'),
  enaSrdFlags: driversRef('kernel/linux/common/ena_com/ena_admin_defs.h', 'L163-L170'),
  enaSrdGet: driversRef('kernel/linux/common/ena_com/ena_com.c', 'L2645-L2661'),
  maxAh: driversRef('kernel/linux/efa/src/efa_com_cmd.h', 'L127-L136'),
  // The provider's own error vocabulary, and where it prints it.
  compStatuses: libfabricRef('prov/efa/src/efa_errno.h', 'L58-L75'),
  provErrnos: libfabricRef('prov/efa/src/efa_errno.h', 'L109-L111'),
  showHelp: libfabricRef('prov/efa/src/efa_strerror.c', 'L63-L105'),
  errMsg: libfabricRef('prov/efa/src/rdm/efa_rdm_util.c', 'L111-L144'),
  opeErr: libfabricRef('prov/efa/src/rdm/efa_rdm_ope.c', 'L649-L655'),
  infoLevel: libfabricRef('prov/efa/src/efa_prov.h', 'L13'),
  logEnv: libfabricRef('man/fabric.7.md', 'L174-L221'),
  hostIdFile: libfabricRef('prov/efa/src/efa_env.c', 'L36'),
  msgOrder: libfabricRef('prov/efa/src/efa_prov_info.c', 'L26'),
  rdmOrder: libfabricRef('prov/efa/src/efa_prov_info.c', 'L633-L640'),
  rdmRxOrder: libfabricRef('prov/efa/src/efa_prov_info.c', 'L677-L680'),
  directRnr: libfabricRef('prov/efa/src/efa_prov_info.c', 'L102-L108'),
  robuf: libfabricRef('prov/efa/src/rdm/efa_rdm_peer.h', 'L95-L114'),
  robufDefault: libfabricRef('prov/efa/src/rdm/efa_rdm_peer.h', 'L12'),
  envRecvwin: libfabricRef('prov/efa/src/efa_env.c', 'L18'),
  envRecvwinHelp: libfabricRef('prov/efa/src/efa_env.c', 'L188-L189'),
  recvwinAlloc: libfabricRef('prov/efa/src/rdm/efa_rdm_peer.h', 'L46-L66'),
  recvwinUse: libfabricRef('prov/efa/src/rdm/efa_rdm_peer.c', 'L31'),
  recvwinModulo: libfabricRef('prov/efa/src/rdm/efa_rdm_peer.c', 'L320'),
  // The two tuning commits that left the help string behind.
  tune16kTo8k: {
    repo: 'ofiwg/libfabric',
    ref: '7232f8af12d0a7ad54cc571529e37c006cb3bc92',
    path: 'prov/efa/src/rdm/efa_rdm_peer.h',
    read: CODE_READ,
  } as CodeRef,
  tune8kTo16: {
    repo: 'ofiwg/libfabric',
    ref: 'bd987ab20e57',
    path: 'prov/efa/src/rdm/efa_rdm_peer.h',
    read: CODE_READ,
  } as CodeRef,
  envOoo: libfabricRef('prov/efa/src/efa_env.c', 'L208-L209'),
};

const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';

const doc = (title: string, url: string, tier: 1 | 2 | 3): DocRef => ({
  title,
  url,
  tier,
  accessed: DOC_ACCESSED,
});

const docs: Record<string, DocRef> = {
  efa: doc('EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads', `${EC2_DOC}efa.html`, 1),
  enaExpress: doc('EC2 User Guide: Improve network performance with ENA Express', `${EC2_DOC}ena-express.html`, 1),
  monitor: doc('EC2 User Guide: Monitor an Elastic Fabric Adapter on Amazon EC2', `${EC2_DOC}efa-working-monitor.html`, 1),
  bandwidth: doc('EC2 User Guide: Amazon EC2 instance network bandwidth', `${EC2_DOC}ec2-instance-network-bandwidth.html`, 1),
  ebsIops: doc(
    'Amazon EBS User Guide: Provisioned IOPS SSD volumes (io2 Block Express)',
    'https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html',
    1,
  ),
  ibvModifyQp: doc(
    'rdma-core man page: ibv_modify_qp(3)',
    'https://man7.org/linux/man-pages/man3/ibv_modify_qp.3.html',
    1,
  ),
  hpcBlog: doc(
    'AWS HPC Blog: In the search for performance, there is more than one way to build a network',
    'https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/',
    2,
  ),
  storageBlog: doc(
    'AWS Storage Blog: Storage for I/O intensive SQL Server using Amazon EBS io2 Block Express',
    'https://aws.amazon.com/blogs/storage/storage-for-i-o-intensive-sql-server-using-amazon-ebs-io2-block-express/',
    2,
  ),
  ieeeMicro: doc(
    'Shalev, Ayoub, Bshara, Sabbag. A Cloud-Optimized Transport Protocol for Elastic and Scalable HPC. IEEE Micro 40(6), pp. 67-73, November 2020',
    'https://doi.org/10.1109/MM.2020.3016891',
    3,
  ),
  dcqcn: doc(
    'Zhu et al. Congestion Control for Large-Scale RDMA Deployments. ACM SIGCOMM 2015 (Microsoft and Mellanox)',
    'https://conferences.sigcomm.org/sigcomm/2015/pdf/papers/p523.pdf',
    3,
  ),
};

/* ------------------------------------------------------------------ */
/* efa-d05  SrdVsRoceDiagram                                           */
/* ------------------------------------------------------------------ */

/**
 * Three transports against the same four questions. Read across a row.
 * Idiom A (class-name block), prefix `svr-`.
 */
function SrdVsRoceDiagram() {
  const rows = [
    {
      label: ['Delivery', 'order'],
      ib: ['In order, end to end.', 'One drop stalls every', 'packet queued behind it.'],
      roce: ['In order, end to end.', 'Same head of line', 'blocking on a drop.'],
      srd: ['No ordering guarantee.', 'A late packet stalls', 'nothing behind it.'],
    },
    {
      label: ['Loss', 'recovery'],
      ib: ['Meant to be rare: the', 'link layer is not', 'allowed to drop.'],
      roce: ['Meant to be rare: PAUSE', 'stops the sender before', 'a buffer overflows.'],
      srd: ['Expected. The Nitro card', 'retransmits, and does it', 'on a different path.'],
    },
    {
      label: ['Path', 'selection'],
      ib: ['One path per', 'connection.'],
      roce: ['One path per flow, set', 'by a 5-tuple hash.'],
      srd: ['Up to 64 paths at a', 'time, per message.'],
    },
    {
      label: ['What it asks of', 'the fabric'],
      ib: ['Hop by hop credit flow', 'control on a custom', 'link layer.'],
      roce: ['Lossless Ethernet, built', 'from Priority Flow', 'Control PAUSE frames.'],
      srd: ['Nothing special.', 'Ordinary lossy Ethernet', 'is enough.'],
    },
  ];

  const colX = [160, 422, 684];
  const colW = 242;
  const heads = [
    { title: 'InfiniBand RC', sub: 'reliable connected' },
    { title: 'RoCEv2 with PFC', sub: 'priority flow control' },
    { title: 'SRD', sub: 'the EFA transport' },
  ];
  const headY = 40;
  const headH = 46;
  const rowY = [110, 186, 262, 338];
  const rowH = 68;

  return (
    <svg
      viewBox="0 0 940 448"
      role="img"
      aria-labelledby="efa-d05-srdroce-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d05-srdroce-title">
        SRD and RoCEv2 make opposite bets about the network. InfiniBand Reliable Connected and
        RoCEv2 both deliver packets in order along a single path and depend on a fabric that does
        not drop, InfiniBand through hop by hop credit flow control and RoCEv2 through Priority
        Flow Control PAUSE frames. SRD gives up ordering, sprays one message across up to 64 paths
        at a time, retransmits from the Nitro card onto a different path, and asks nothing of the
        fabric beyond ordinary lossy Ethernet.
      </title>
      <style>
        {`
          .svr-bg   { fill: #ffffff; }
          .svr-hd   { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .svr-hdx  { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .svr-hdt  { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .svr-hdtx { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .svr-hds  { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .svr-hdsx { fill: #eaf3fb; font: 11px sans-serif; text-anchor: middle; }
          .svr-cell { fill: #ffffff; stroke: #879596; stroke-width: 1; }
          .svr-cx   { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .svr-warn { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .svr-good { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .svr-t    { fill: #16191f; font: 11px sans-serif; }
          .svr-lab  { fill: #414d5c; font: 600 11px sans-serif; }
          .svr-cap  { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>

      <rect className="svr-bg" x="0" y="0" width="940" height="448" rx="8" />

      {heads.map((head, i) => {
        const accent = i === 2;
        return (
          <g key={head.title}>
            <rect
              className={accent ? 'svr-hdx' : 'svr-hd'}
              x={colX[i]}
              y={headY}
              width={colW}
              height={headH}
              rx="5"
            />
            <text
              className={accent ? 'svr-hdtx' : 'svr-hdt'}
              x={colX[i] + colW / 2}
              y={headY + 20}
            >
              {head.title}
            </text>
            <text
              className={accent ? 'svr-hdsx' : 'svr-hds'}
              x={colX[i] + colW / 2}
              y={headY + 36}
            >
              {head.sub}
            </text>
          </g>
        );
      })}

      {rows.map((row, i) => {
        const y = rowY[i];
        const last = i === rows.length - 1;
        return (
          <g key={row.label.join(' ')}>
            {row.label.map((line, j) => (
              <text key={line} className="svr-lab" x="14" y={y + 26 + j * 15}>
                {line}
              </text>
            ))}

            <rect
              className={last ? 'svr-warn' : 'svr-cell'}
              x={colX[0]}
              y={y}
              width={colW}
              height={rowH}
              rx="5"
            />
            {row.ib.map((line, j) => (
              <text key={line} className="svr-t" x={colX[0] + 12} y={y + 22 + j * 15}>
                {line}
              </text>
            ))}

            <rect
              className={last ? 'svr-warn' : 'svr-cell'}
              x={colX[1]}
              y={y}
              width={colW}
              height={rowH}
              rx="5"
            />
            {row.roce.map((line, j) => (
              <text key={line} className="svr-t" x={colX[1] + 12} y={y + 22 + j * 15}>
                {line}
              </text>
            ))}

            <rect
              className={last ? 'svr-good' : 'svr-cx'}
              x={colX[2]}
              y={y}
              width={colW}
              height={rowH}
              rx="5"
            />
            {row.srd.map((line, j) => (
              <text key={line} className="svr-t" x={colX[2] + 12} y={y + 22 + j * 15}>
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <text className="svr-cap" x="470" y="430">
        The bottom row is the trade. Two transports buy simplicity by requiring a fabric that never
        drops. SRD pays for drops instead.
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* efa-d06  MultipathSprayDiagram                                      */
/* ------------------------------------------------------------------ */

/**
 * One message, many paths, reassembled at the far end.
 * Idiom A (class-name block), prefix `sps-`.
 */
function MultipathSprayDiagram() {
  const spineY = [48, 108, 168, 228];
  const spineX = 396;
  const spineW = 110;
  const spineH = 34;
  const senderRight = 184;
  const receiverLeft = 688;
  const hubY = 190;
  const highlighted = 1;

  return (
    <svg
      viewBox="0 0 900 356"
      role="img"
      aria-labelledby="efa-d06-spray-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d06-spray-title">
        SRD splits a single message across many fabric paths at the same time and puts it back
        together at the receiver. AWS states that it uses 64 paths at a time out of the hundreds or
        thousands available. A conventional TCP flow is hashed onto exactly one of those paths and
        is bounded by whatever congestion happens to sit on it.
      </title>
      <style>
        {`
          .sps-bg   { fill: #ffffff; }
          .sps-box  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .sps-grp  { fill: #ffffff; stroke: #414d5c; stroke-width: 1.5; }
          .sps-sub  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .sps-spn  { fill: #eef0f2; stroke: #879596; stroke-width: 1.5; }
          .sps-h    { fill: #0f1b2a; font: 600 13px sans-serif; }
          .sps-hc   { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .sps-s    { fill: #5f6b7a; font: 11px sans-serif; }
          .sps-sc   { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .sps-band { fill: #5f6b7a; font: 600 10px sans-serif; text-anchor: middle; letter-spacing: 1px; }
          .sps-p    { stroke: #0972d3; stroke-width: 1.2; fill: none; }
          .sps-ph   { stroke: #ec7211; stroke-width: 3.5; fill: none; stroke-dasharray: 7 5; }
          .sps-arr  { stroke: #0972d3; stroke-width: 1.5; fill: none; marker-end: url(#sps-head); }
        `}
      </style>
      <defs>
        <marker id="sps-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#0972d3" />
        </marker>
      </defs>

      <rect className="sps-bg" x="0" y="0" width="900" height="356" rx="8" />

      <text className="sps-band" x="451" y="24">
        AWS FABRIC
      </text>

      {spineY.map((y) => (
        <g key={y}>
          <path className="sps-p" d={`M${senderRight},${hubY} L${spineX},${y + spineH / 2}`} />
          <path
            className="sps-p"
            d={`M${spineX + spineW},${y + spineH / 2} L${receiverLeft},${hubY}`}
          />
        </g>
      ))}

      <path
        className="sps-ph"
        d={`M${senderRight},${hubY} L${spineX},${spineY[highlighted] + spineH / 2}`}
      />
      <path
        className="sps-ph"
        d={`M${spineX + spineW},${spineY[highlighted] + spineH / 2} L${receiverLeft},${hubY}`}
      />

      {spineY.map((y) => (
        <g key={`n-${y}`}>
          <rect className="sps-spn" x={spineX} y={y} width={spineW} height={spineH} rx="5" />
          <text className="sps-sc" x={spineX + spineW / 2} y={y + 22}>
            fabric path
          </text>
        </g>
      ))}

      <rect className="sps-box" x="14" y="146" width="170" height="92" rx="6" />
      <text className="sps-h" x="28" y="174">
        EFA device
      </text>
      <text className="sps-s" x="28" y="194">
        One message. All of its
      </text>
      <text className="sps-s" x="28" y="209">
        packets leave at once,
      </text>
      <text className="sps-s" x="28" y="224">
        spread over many paths.
      </text>

      <rect className="sps-grp" x="688" y="98" width="198" height="182" rx="6" />
      <text className="sps-hc" x="787" y="122">
        Receiving instance
      </text>

      <rect className="sps-sub" x="700" y="136" width="174" height="58" rx="5" />
      <text className="sps-h" x="712" y="158">
        EFA device
      </text>
      <text className="sps-s" x="712" y="177">
        Reliable, any order
      </text>

      <path className="sps-arr" d="M787,194 L787,214" />

      <rect className="sps-sub" x="700" y="218" width="174" height="58" rx="5" />
      <text className="sps-h" x="712" y="240">
        libfabric
      </text>
      <text className="sps-s" x="712" y="259">
        Reorder buffer
      </text>

      <path className="sps-p" d="M232,302 L268,302" />
      <text className="sps-s" x="276" y="306">
        each of these stands for one of the 64 paths SRD sprays across at once
      </text>
      <path className="sps-ph" d="M232,328 L268,328" />
      <text className="sps-s" x="276" y="332">
        a single 5-tuple TCP flow is hashed onto just one of them, and stays there
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* efa-d31  ReorderWindowDiagram                                       */
/* ------------------------------------------------------------------ */

/**
 * The per-peer reorder window as a bounded resource: sixteen slots, the
 * expected message id at slot zero, early arrivals parked, the overflow list
 * underneath. Idiom A (class-name block), prefix `row-`.
 */
function ReorderWindowDiagram() {
  const slot0 = 128;
  const pitch = 46;
  const slotW = 42;
  const slotY = 96;
  const slotH = 40;
  /** Message ids parked in the window while the expected one is still missing. */
  const held: Record<number, string> = { 1: '101', 2: '102', 5: '105' };

  return (
    <svg
      viewBox="0 0 900 268"
      role="img"
      aria-labelledby="efa-d31-reorder-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d31-reorder-title">
        The libfabric reliable datagram endpoint keeps one reorder window per peer, sixteen message
        slots by default. The first slot holds the message id the endpoint expects next. While that
        message is missing, later messages from the same peer are parked in the slots behind it and
        are not handed to the application. Arrivals further ahead than the window is deep spill into
        an overflow list. The window bounds how far ahead one peer may run, and because it is per
        peer, a gap in one peer's stream stalls no other peer.
      </title>
      <style>
        {`
          .row-bg   { fill: #ffffff; }
          .row-slot { fill: #ffffff; stroke: #879596; stroke-width: 1; }
          .row-fill { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .row-wait { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .row-ovf  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .row-h    { fill: #0f1b2a; font: 600 13px sans-serif; }
          .row-hc   { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .row-s    { fill: #5f6b7a; font: 11px sans-serif; }
          .row-sc   { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .row-id   { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .row-note { fill: #8b6c00; font: 11px sans-serif; }
          .row-dash { stroke: #ec7211; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; }
          .row-cap  { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>

      <rect className="row-bg" x="0" y="0" width="900" height="268" rx="8" />

      <text className="row-hc" x="450" y="34">
        One reorder window per peer, 16 message slots
      </text>
      <text className="row-s" x="128" y="56">
        In from the device: reliable, any order. Out to the application: in order, per peer.
      </text>
      <text className="row-note" x="128" y="84">
        waiting for message 100
      </text>

      {Array.from({ length: 16 }, (_, i) => i).map((i) => {
        const x = slot0 + i * pitch;
        const cls = i === 0 ? 'row-wait' : held[i] ? 'row-fill' : 'row-slot';
        return (
          <g key={i}>
            <rect className={cls} x={x} y={slotY} width={slotW} height={slotH} rx="4" />
            {held[i] ? (
              <text className="row-id" x={x + slotW / 2} y={slotY + 25}>
                {held[i]}
              </text>
            ) : null}
            <text className="row-sc" x={x + slotW / 2} y={slotY + slotH + 15}>
              {i === 0 ? 'next' : `+${i}`}
            </text>
          </g>
        );
      })}

      <path className="row-dash" d="M860,140 C888,162 880,186 788,198" />
      <rect className="row-ovf" x="128" y="176" width="652" height="44" rx="6" />
      <text className="row-h" x="144" y="196">
        overflow_pke_list
      </text>
      <text className="row-s" x="144" y="212">
        Anything more than 16 messages ahead of 100 waits here instead
      </text>

      <text className="row-cap" x="450" y="250">
        Nothing behind a gap reaches the application until the gap fills, and only this peer waits.
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Section data                                                        */
/* ------------------------------------------------------------------ */

/**
 * Completion errors the reader will actually see, in the provider's own
 * words, with the check each one points at. Text column is verbatim from
 * efa_errno.h; the next-step column is ours except where marked.
 */
const triageRows = [
  {
    id: 'unreach',
    codeName: 'LOCAL_ERROR_UNREACH_REMOTE (15)',
    text: 'Unreachable remote - never received a response',
    means: 'Nothing was ever established with this peer. Detected locally.',
    next:
      'Configuration, not hardware. The provider prints its own long-form hint for this code, naming inbound and outbound security group rules first. Check the self-referencing security group, then that both instances are in one Availability Zone.',
  },
  {
    id: 'unresp',
    codeName: 'LOCAL_ERROR_UNRESP_REMOTE (13)',
    text: 'Unresponsive remote (was previously responsive)',
    means: 'It worked and then stopped. A node or a peer process died mid-job.',
    next:
      'Read the peer host id out of the error string and go straight to that instance. Expect unresponsive_remote_events on this node to have moved at the same time.',
  },
  {
    id: 'estab',
    codeName: 'FI_EFA_ERR_ESTABLISHED_RECV_UNRESP (4124)',
    text: 'Unresponsive receiver (connection previously established)',
    means:
      'The handshake had completed earlier. The provider reads this as likely hardware failure on the remote peer, or the peer process no longer being present.',
    next: 'Treat the named instance as a node to drain and replace, not a setting to change.',
  },
  {
    id: 'unestab',
    codeName: 'FI_EFA_ERR_UNESTABLISHED_RECV_UNRESP (4126)',
    text: 'Unresponsive receiver (reachable by EFA device but handshake failed)',
    means:
      'The device can reach the peer, so the network is fine. libfabric could not finish a handshake. The provider reads this as the peer process no longer being present.',
    next:
      'Look at the peer rank, not the fabric. A rank that exited early, was never launched, or crashed during startup produces this.',
  },
  {
    id: 'rnr',
    codeName: 'REMOTE_ERROR_RNR (10)',
    text: 'Destination resource not ready (no work queue entries posted on receive queue)',
    means: 'The message arrived and the receiver had no buffer posted for it.',
    next:
      'Occasional RNR under load is the receiver being outrun, not a fault. Sustained RNR points at a receiving process that is not posting receives fast enough, so profile the receiver rather than the fabric.',
  },
];

/**
 * The five network counters, read as shapes rather than thresholds. The
 * description column is AWS's wording; the shape and action columns are ours.
 */
const counterRows = [
  {
    id: 'retrans',
    counter: 'retrans_pkts, retrans_bytes',
    aws: 'The number of EFA SRD packets, and bytes, retransmitted.',
    healthy:
      'Rises smoothly with traffic and is not expected to be zero on a busy fabric. Retransmission is how this transport works, so the absolute number carries almost no information.',
    action:
      'Compare the ratio against tx_pkts, node by node, over the same window. One node whose ratio sits well above its peers is the signal. The number on its own is not.',
  },
  {
    id: 'timeout',
    counter: 'retrans_timeout_events',
    aws: 'The number of times EFA SRD traffic timed out and resulted in a network path change.',
    healthy:
      'Flat or nearly flat, moving in occasional single steps. Each step is recovery working and evidence that a path went bad.',
    action:
      'Watch for steps that cluster in time or on one instance. Line the steps up against the slow rank in the collective: a repeatedly re-pathing node is a node to drain.',
  },
  {
    id: 'unresp',
    counter: 'unresponsive_remote_events',
    aws: 'The number of times an EFA SRD remote connection was unresponsive.',
    healthy: 'Flat for the whole run. Any movement means a peer stopped answering.',
    action:
      'This is the counter half of LOCAL_ERROR_UNRESP_REMOTE. When it moves, go looking for a dead rank or a failed instance rather than tuning anything.',
  },
  {
    id: 'impaired',
    counter: 'impaired_remote_conn_events',
    aws:
      'The number of times EFA SRD connections entered an impaired state, resulting in a reduced throughput rate limit.',
    healthy: 'Flat for the whole run.',
    action:
      'This is the one that explains a job which got slower and never errored, because AWS states the impaired state carries a reduced throughput rate limit. Movement here plus stable error counters means degraded, not broken.',
  },
];

export function SrdProtocol() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="One transport trade, and the three places it reaches you: tail latency, counters, error codes."
          >
            SRD: The Transport Protocol
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A collective operation finishes when its slowest participant finishes, which makes tail
            latency the number that decides how fast a distributed training step runs. Every
            conventional reliable transport works against that number in the same way: it delivers
            packets in order, so one lost packet holds up every packet queued behind it. AWS names
            this directly, calling the in-order model a conga line where a single lost packet messes
            up the on-time arrival of all the packets behind it, an effect called head of line
            blocking <SourceRef provenance="documented" doc={docs.hpcBlog} />.
          </Box>
          <Box variant="p">
            <strong>The trade SRD makes:</strong> SRD (Scalable Reliable Datagram) keeps reliability
            and throws ordering away. AWS states it plainly: SRD relaxed the requirement for
            in-order packet delivery in the belief that if it is necessary it can be reasserted in
            the higher layers of the stack, and the p99 tail latency then fell by around a factor of
            ten <SourceRef provenance="documented" doc={docs.hpcBlog} />. Everything else in this
            section follows from that single trade.
          </Box>
          <Box variant="p">
            The trade stops being abstract the moment a cluster is running. It decides which error
            code you get when a rank goes quiet, why a retransmission counter climbing through a
            healthy run is normal here and an incident on an InfiniBand fabric, and what ordered
            delivery costs per peer. Those readings come first below. The mechanism that produces
            them follows.
          </Box>
          <Box variant="p">
            The design is published as Shalev, Ayoub, Bshara and Sabbag,{' '}
            <em>A Cloud-Optimized Transport Protocol for Elastic and Scalable HPC</em>, IEEE Micro
            volume 40 issue 6, November 2020{' '}
            <SourceRef provenance="documented" doc={docs.ieeeMicro} />. Both the AWS HPC blog and
            the libfabric EFA (Elastic Fabric Adapter) provider documentation link to that IEEE
            Micro record. The paper is paywalled and was not read for this page, so nothing here is
            attributed to it.
          </Box>

          <ExpandableSection
            headerText="Documentation contradicts the code: the driver defines read and write opcodes for SRD"
            headerDescription="A 2019 specification file in the driver repository still says Send only"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The driver defines <code>EFA_IO_RDMA_READ</code> and <code>EFA_IO_RDMA_WRITE</code>{' '}
                as device opcodes, and the device reports both operations as capability bits in its
                admin-queue attributes. A text file shipped in the same{' '}
                <code>amzn/amzn-drivers</code> repository describes the SRD queue pair type and
                states that only the Send operation is currently supported. It dates from 2019 and
                was never revised.
              </Box>
              <Box variant="p">
                Code wins. On this page code at a pinned commit is the authority, official
                documentation is a secondary check, and an in-repo README, comment or specification
                file is a way to find your way around the code.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The error code and the counter shape that say whether the transport is your problem, and what to check next."
          >
            Reading SRD on a running cluster
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SRD runs in the Nitro card, which is why everything you see of it is a report rather
            than a knob. AWS states it for the storage case in its own words: to minimize jitter and
            to ensure the fastest response to network congestion fluctuations, SRD is implemented in
            the AWS custom Nitro networking card{' '}
            <SourceRef provenance="documented" doc={docs.storageBlog} />, and the EBS (Elastic Block
            Store) documentation repeats it for io2 Block Express{' '}
            <SourceRef provenance="documented" doc={docs.ebsIops} />. EFA and ENA (Elastic Network
            Adapter, through ENA Express) are peer consumers of that one transport. It reaches you
            in two forms: completion errors libfabric surfaces, and five counters the device keeps.
          </Box>

          <Box variant="h3">Completion errors, and what each one sends you to check</Box>
          <Box variant="p">
            The device separates a peer that stopped answering from one that never answered, and
            libfabric carries that distinction up with a printable string per code. The difference
            is worth knowing at three in the morning: one of them is a dead node, the other is
            almost always a security group.
          </Box>

          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'code', header: 'Code', cell: (item) => <Box variant="code">{item.codeName}</Box> },
              { id: 'text', header: 'What the provider prints', cell: (item) => <em>{item.text}</em> },
              { id: 'means', header: 'What it means', cell: (item) => item.means },
              { id: 'next', header: 'What to check next', cell: (item) => <strong>{item.next}</strong> },
            ]}
            items={triageRows}
          />

          <Box variant="small" color="text-body-secondary">
            Codes 10 to 15 are device completion statuses{' '}
            <SourceRef provenance="code-derived" code={code.compStatus} />, and the printed strings
            are the provider's table for them{' '}
            <SourceRef provenance="code-derived" code={code.compStatuses} />. Codes 4124 and 4126
            are libfabric's own, defined to tell an unresponsive receiver that completed a handshake
            from one that never did{' '}
            <SourceRef provenance="code-derived" code={code.provErrnos} />. Readings attributed to
            the provider are quoted from its help text{' '}
            <SourceRef provenance="code-derived" code={code.showHelp} />; the check column is ours.
          </Box>

          <Box variant="p">
            <strong>Where you see it, and why the useful half is usually hidden.</strong> On failure
            the provider builds one error string per completion, carrying the message above plus
            both endpoints, and hands it to the application as error data{' '}
            <SourceRef provenance="code-derived" code={code.errMsg} />. Both host id fields come
            from the board asset tag, which on an EC2 instance is its instance id{' '}
            <SourceRef provenance="code-derived" code={code.hostIdFile} />, so the error names the
            machine to go and look at. The long-form help, including the security group hint, is an
            info-level message{' '}
            <SourceRef provenance="code-derived" code={code.showHelp} />{' '}
            <SourceRef provenance="code-derived" code={code.opeErr} />{' '}
            <SourceRef provenance="code-derived" code={code.infoLevel} />, so it appears only on a
            run that asked for info logging. A run that did not gets the code without the
            diagnosis.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# The error string the provider builds per failed completion, addresses elided.
# Peer host id reads N/A until a handshake with that peer has completed.

Unreachable remote - never received a response My EFA addr: <raw addr> \
My host id: i-0123456789abcdef0 Peer EFA addr: <raw addr> \
Peer host id: i-0abcdef1234567890

# Its own diagnosis of that code is info level, and info is high traffic.
# Turn it on for the failing run, not for the fleet.

FI_LOG_LEVEL=info FI_LOG_PROV=efa <your launch command>

# What it then prints, verbatim:

This error is detected locally. The peer is not reachable by the EFA device.
This typically indicates one or more misconfigured EC2 instances; most often
due to incorrect inbound/outbound security group rules and/or instances placed
in different subnets. Refer to the public AWS documentation for EFA for
up-to-date configuration requirements. This error can also be encountered when
a peer process is no longer present.`}</pre>
          </Box>

          <Box variant="small" color="text-body-secondary">
            Error string format{' '}
            <SourceRef provenance="code-derived" code={code.errMsg} />, help text{' '}
            <SourceRef provenance="code-derived" code={code.showHelp} />, logging variables and the
            statement that info is high traffic{' '}
            <SourceRef provenance="code-derived" code={code.logEnv} />. The hint names subnets,
            while AWS documents the Availability Zone as the boundary EFA traffic does not cross{' '}
            <SourceRef provenance="documented" doc={docs.efa} />, so check the security group first
            and the Availability Zone second.
          </Box>

          <Box variant="h3">The five counters, read as shapes</Box>
          <Box variant="p">
            The device reports a network statistics block with <code>retrans_bytes</code>,{' '}
            <code>retrans_pkts</code>, <code>retrans_timeout_events</code>,{' '}
            <code>unresponsive_remote_events</code> and <code>impaired_remote_conn_events</code>{' '}
            <SourceRef provenance="code-derived" code={code.netStats} />, and the driver publishes
            them as RDMA (Remote Direct Memory Access) hardware counters{' '}
            <SourceRef provenance="code-derived" code={code.portStats} />. AWS documents the same
            five, states they are available on Nitro v4 and later instance types only, and states
            they are cumulative since instance launch or the last driver reset{' '}
            <SourceRef provenance="documented" doc={docs.monitor} />, so only the rate of change
            means anything. The operations section covers how to read them off a node. On the ENA
            Express side the equivalent ground truth is the ratio of <code>ena_srd_tx_pkts</code> to{' '}
            <code>ena_srd_eligible_tx_pkts</code> under <code>ethtool -S</code>, which reveals
            whether traffic is riding SRD or silently falling back{' '}
            <SourceRef provenance="code-derived" code={code.enaSrdStats} />.
          </Box>

          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'counter', header: 'Counter', cell: (item) => <Box variant="code">{item.counter}</Box> },
              { id: 'aws', header: 'What AWS says it counts', cell: (item) => item.aws },
              { id: 'healthy', header: 'Healthy shape', cell: (item) => item.healthy },
              { id: 'action', header: 'When it is not', cell: (item) => <strong>{item.action}</strong> },
            ]}
            items={counterRows}
          />

          <Alert type="info" header="Baseline these on your own cluster">
            No AWS source stating a numeric threshold for any of these counters was located during
            this research. Take a healthy run on your own instance type and job shape as the
            baseline, alert on deviation from it, and say so when you hand the runbook over. A
            number invented here would be worse than none, because you would size an alert to it.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a retransmission counter that moves is routine here and an incident on an InfiniBand or RoCEv2 fabric."
          >
            SRD against InfiniBand Reliable Connected and RoCEv2
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The framing:</strong> InfiniBand and RoCEv2 (RDMA over Converged Ethernet
            version 2) both push the hard problem down into the fabric. They deliver in order along
            one path and require the fabric not to drop, so the transport itself can stay small and
            fast. SRD pushes the hard problem into the Nitro card instead, and asks nothing of the
            fabric.
          </Box>

          <SrdVsRoceDiagram />

          <Box variant="small" color="text-body-secondary">
            Diagram efa-d05. The 64-path figure is AWS stated{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />. The InfiniBand and RoCEv2 rows
            are sourced below and are not claims about any AWS product.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What InfiniBand assumes</Box>
              <Box variant="p">
                The InfiniBand link layer uses hop by hop credit-based flow control to prevent
                packet drops from buffer overflow, and that lossless link layer is what lets the
                InfiniBand transport stay simple and highly efficient{' '}
                <SourceRef provenance="documented" doc={docs.dcqcn} />. The cost is a custom
                networking stack on purpose-built hardware. AWS makes the ordering half of the same
                point from the other side: fabrics like InfiniBand and protocols like TCP send
                packets in order, and one lost packet holds up everything queued behind it{' '}
                <SourceRef provenance="documented" doc={docs.hpcBlog} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">What RoCEv2 assumes</Box>
              <Box variant="p">
                RoCEv2 needs PFC (Priority Flow Control) to build a drop-free Ethernet fabric, and
                PFC can lead to poor application performance because of head of line blocking and
                unfairness <SourceRef provenance="documented" doc={docs.dcqcn} />. The mechanism is
                the reason: PAUSE operates per port and priority class, not per flow, so pausing one
                congested flow pauses everything sharing that port. The same paper reports
                congestion spreading as the practical consequence at scale.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="What PFC costs you is head of line blocking">
            Deadlock is the charge you will hear levelled at PFC in large fabrics, and the primary
            literature is more careful than that. Zhu et al. describe routing deadlock as a commonly
            expressed concern, note that deadlock formation requires a set of flows whose buffer
            dependencies form a cycle, and argue that in a clos-structured network where servers
            connect only to top of rack switches such a cycle cannot arise without malfunctioning or
            misconfigured equipment <SourceRef provenance="documented" doc={docs.dcqcn} />. The
            sound criticism of PFC is head of line blocking, unfairness and congestion spreading,
            not deadlock as a routine outcome.
          </Alert>

          <Box variant="p">
            AWS makes the comparison itself, in first-party words: SRD differs from protocols like
            TCP, InfiniBand or RoCE, and instead of preserving packet order it sends packets over as
            many network paths as possible while avoiding overloaded paths, leaving message order
            restoration to the upper layer because that layer has a better understanding of the
            required ordering semantics{' '}
            <SourceRef provenance="documented" doc={docs.storageBlog} />. The EFA driver registers
            its InfiniBand device with <code>node_type = RDMA_NODE_UNSPECIFIED</code>{' '}
            <SourceRef provenance="code-derived" code={code.nodeType} />, a value that claims
            membership of neither family.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Spray across 64 paths, recover the losses in the card, and the host gets counters instead of a retry policy."
          >
            Spraying, and where recovery happens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mechanism:</strong> without the in-order constraint, SRD can push all the
            packets making up a block of data all at once, over all the possible pathways in the
            fabric, and AWS states that for memory reasons it chooses 64 paths at a time from the
            hundreds or even thousands available{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />.
          </Box>

          <MultipathSprayDiagram />

          <Box variant="small" color="text-body-secondary">
            Diagram efa-d06. Schematic. Four fabric paths are drawn to stand for the 64 SRD uses at
            a time; the real path count and the real fabric depth are not drawn to scale.
          </Box>

          <Box variant="p">
            The contrast with a conventional flow is the point. A single TCP or UDP (User Datagram
            Protocol) flow is a unique 5-tuple, and AWS caps single-flow traffic at 5 Gbps outside a
            cluster placement group and 10 Gbps inside one{' '}
            <SourceRef provenance="documented" doc={docs.bandwidth} />. Part of that ceiling is
            policy and part is physics: a hashed flow follows one path, so its throughput is bounded
            by the most congested link on that path. Spraying removes the second constraint, which
            is why a single-socket benchmark will never show you what this fabric does. Scale helps
            as well: AWS states that as a job grows to consume more nodes, SRD has more paths to
            choose from, because the perimeter of that network gets bigger{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />. Most fabric properties degrade
            with cluster size. Path diversity improves with it.
          </Box>

          <Box variant="p">
            Because drops are expected, recovery is routine, and the card is what performs it. The
            device reports the five network counters above{' '}
            <SourceRef provenance="code-derived" code={code.netStats} />. The driver code that
            surfaces them copies the values out of an admin-queue response rather than computing
            them{' '}
            <SourceRef provenance="code-derived" code={code.portStats} />. A search of the driver
            tree for retransmission logic during this research found none, which is consistent with
            the device doing the work, though an absence found by searching is weaker evidence than
            the presence of the stats path. There is no host-side
            retry policy, which is why the counters are a monitoring surface and not a control
            surface. The application never blocks for it either: it keeps posting work and polling
            completions while the card resends the packet on a different path.
          </Box>

          <Box variant="p">
            One retry behaviour does reach the queue pair. The admin modify-queue-pair command
            carries an <code>rnr_retry</code> field commented as the number of RNR (Receiver Not
            Ready) retries, valid only for SRD queue pairs{' '}
            <SourceRef provenance="code-derived" code={code.modifyQp} />. On the libfabric side,{' '}
            <code>resource_mgmt</code> is set to enabled on the efa-direct path with the comment
            that the direct path retries indefinitely when receiver not ready{' '}
            <SourceRef provenance="code-derived" code={code.directRnr} />. That is what stands
            behind the RNR row in the triage table: a receiver that stops posting does not fail
            fast, it stalls.
          </Box>

          <Box variant="p">
            Congestion control is the part with the least public detail. AWS states that the EFA
            device provides capabilities like built-in OS-bypass and congestion control through the
            SRD protocol <SourceRef provenance="documented" doc={docs.efa} />, and that ENA Express
            detects and avoids congested network paths and handles some tasks directly in the
            network layer, such as packet reordering on the receiving end and most retransmits that
            are needed <SourceRef provenance="documented" doc={docs.enaExpress} />. Beyond that, AWS
            publishes no algorithm, and this page names none. There is nothing to configure: watch
            the response through <code>retrans_timeout_events</code> rather than trying to steer it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What ordered delivery costs per peer, and the one setting an old tuning script gets wrong."
          >
            Who restores order, and what it costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The code settles this.</strong> The libfabric EFA provider defines{' '}
            <code>EFA_MSG_ORDER</code> as literally zero{' '}
            <SourceRef provenance="code-derived" code={code.msgOrder} />, and that is the value the
            base provider info advertises for both transmit and receive. The efa-direct fabric
            therefore promises no message ordering whatsoever. Only when the provider builds the
            separate RDM (reliable datagram) info does it override the value to{' '}
            <code>FI_ORDER_SAS</code>, with a comment stating why: the EFA RDM endpoint supports
            ordered two-sided and atomic operations by putting messages through a software reorder
            buffer <SourceRef provenance="code-derived" code={code.rdmOrder} />, and the receive
            attributes get the same override a few lines later{' '}
            <SourceRef provenance="code-derived" code={code.rdmRxOrder} />.
          </Box>

          <Box variant="p">
            The buffer is per peer, not per endpoint. Each <code>efa_rdm_peer</code> carries a{' '}
            <code>robuf</code> documented as a reorder buffer that temporarily holds packets that
            are out of order, whose message identifier is larger than the one the endpoint expects
            from that peer, plus an <code>overflow_pke_list</code> for out-of-order packets that do
            not fit the current window <SourceRef provenance="code-derived" code={code.robuf} />.
            The slot is the message id modulo the window size{' '}
            <SourceRef provenance="code-derived" code={code.recvwinModulo} />, and out-of-order
            arrivals are copied out of the pre-posted receive buffers into a separate bounce-buffer
            pool, which is on by default{' '}
            <SourceRef provenance="code-derived" code={code.envOoo} />.
          </Box>

          <ReorderWindowDiagram />

          <Box variant="small" color="text-body-secondary">
            Diagram efa-d31. Schematic. The window is 16 message slots by default{' '}
            <SourceRef provenance="code-derived" code={code.robufDefault} />, one per peer. Head of
            line blocking did not disappear with the ordering guarantee. It moved out of the fabric
            and into one peer's buffer, where it stalls that peer and nothing else.
          </Box>

          <ExpandableSection
            headerText="Documentation contradicts the code: the reorder window default is 16, not 16384"
            headerDescription="The help text says 16384, the compiled default is 16, and both numbers count messages"
          >
            <SpaceBetween size="xs">
              <Box variant="p">
                The libfabric help text for <code>FI_EFA_RECVWIN_SIZE</code> describes the size of
                the sliding receive window and states a default of 16384. The compiled default is{' '}
                <code>EFA_RDM_PEER_DEFAULT_REORDER_BUFFER_SIZE</code>, defined as 16, and that
                constant is what the environment structure is initialised with.
              </Box>
              <Box variant="p">
                <strong>The unit is messages, not bytes.</strong> A jump from 16384 to 16 looks like
                a units error, and it is not. The value is passed to the allocator unscaled{' '}
                <SourceRef provenance="code-derived" code={code.recvwinUse} />, which sizes the
                pending queue as <code>sizeof(struct efa_rdm_pke*) * size</code>: one pointer slot
                per held message, with a power-of-two assertion on the count{' '}
                <SourceRef provenance="code-derived" code={code.recvwinAlloc} />. Nothing anywhere
                multiplies it by a page, a packet size or a kilobyte, so the two numbers really do
                disagree.
              </Box>
              <Box variant="p">
                <strong>The help text is two tuning rounds stale, not one.</strong> The default was
                16384. In October 2025 it went to 8192 while the peer reorder buffer pool dropped
                from 1024 to 16{' '}
                <SourceRef provenance="code-derived" code={code.tune16kTo8k} label="commit" />. In
                November 2025 the window itself was cut to 16 to match the pool, on the reasoning
                that a differently sized pool and buffer make no sense when every peer needs one
                buffer <SourceRef provenance="code-derived" code={code.tune8kTo16} label="commit" />
                . Both changes were made to hold performance without the memory overhead. The help
                string was updated in neither.
              </Box>
              <Box variant="p">
                Code wins. Treat the per-peer reorder window as 16 outstanding messages unless you
                set the variable yourself{' '}
                <SourceRef
                  provenance="doc-code-conflict"
                  code={code.robufDefault}
                  conflict="prov/efa/src/efa_env.c line 188 defines FI_EFA_RECVWIN_SIZE with the help text 'Defines the size of sliding receive window. (Default: 16384)'. The initialiser at line 18 of the same file sets recvwin_size to EFA_RDM_PEER_DEFAULT_REORDER_BUFFER_SIZE, which prov/efa/src/rdm/efa_rdm_peer.h line 12 defines as 16. Both values count messages, not bytes: the count is passed to efa_recvwin_buf_alloc unscaled and sizes a pointer array. The default went 16384 to 8192 in commit 7232f8af (2025-10-16), then 8192 to 16 in commit bd987ab2 (2025-11-18). The help string was not updated by either."
                  label="doc vs code"
                />
                . The two citations are eight lines apart in the same file{' '}
                <SourceRef provenance="code-derived" code={code.envRecvwin} />{' '}
                <SourceRef provenance="code-derived" code={code.envRecvwinHelp} />, which is a
                useful reminder that a help string is documentation, not behaviour.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning" header="Grep your launch scripts for FI_EFA_RECVWIN_SIZE">
            A script that copied 16384 out of the help text asks for a 16,384-slot pointer array for
            every peer the process talks to, which is the memory the two tuning commits were
            removing. Unset is the supported answer on current libfabric. If a run genuinely needs a
            deeper window, the evidence for it is arrivals spilling to{' '}
            <code>overflow_pke_list</code>, not a number carried over from an older guide.
          </Alert>

          <Box variant="p">
            This is the honest price of SRD. Relaxing ordering is what dropped p99 tail latency by
            around a factor of ten <SourceRef provenance="documented" doc={docs.hpcBlog} />, and
            software is where the bill arrives. An application that asks for ordered delivery pays
            for a per-peer window, a bounce-buffer copy on every out-of-order arrival, and an
            overflow list when reordering exceeds the window. An application that does not need
            ordering pays none of it and takes the fabric at its native speed. Collectives and
            message passing are in the second group, which is why they are the workloads EFA
            targets.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why nobody sizes a queue pair on EFA, and what that is worth at 512 nodes."
          >
            Queue-pair scaling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="This block is model, not a knob">
            Nothing here is configurable. It is the reason peer count stops being a resource
            question on EFA, which is what makes the address-vector behaviour and the flat scaling
            in the practical sections make sense.
          </Alert>

          <Box variant="p">
            <strong>The mechanism, in one line:</strong> an SRD queue pair carries its destination in
            every descriptor. The transmit metadata descriptor has <code>dest_qp_num</code>, an
            address handle index <code>ah</code> and a <code>qkey</code>, all inside the
            per-work-request descriptor{' '}
            <SourceRef provenance="code-derived" code={code.txMeta} />, so one send queue can
            address every peer in the cluster. The device reports <code>max_ah</code> as a limit
            separate from <code>max_qp</code>{' '}
            <SourceRef provenance="code-derived" code={code.maxAh} />, which is the same fact from
            the resource-accounting side: peers are cheap, queue pairs are not.
          </Box>

          <Box variant="p">
            The absent field settles it. The EFA admin modify-queue-pair command has fields for
            state, current state, queue key, send queue packet sequence number, drain notification
            and RNR retry count, and no field for a destination at all{' '}
            <SourceRef provenance="code-derived" code={code.modifyQp} />. There is nowhere to bind a
            remote queue pair, because SRD never does, and{' '}
            <code>EFA_QP_DRIVER_TYPE_SRD</code> is the only driver queue-pair type the user ABI
            defines <SourceRef provenance="code-derived" code={code.qpType} />. On InfiniBand
            Reliable Connected the opposite holds: <code>dest_qp_num</code> and{' '}
            <code>ah_attr</code> are valid only for RC and UC queue pairs, and moving an RC queue
            pair to ready-to-receive requires <code>IBV_QP_AV</code> and{' '}
            <code>IBV_QP_DEST_QPN</code> among its mandatory attributes{' '}
            <SourceRef provenance="documented" doc={docs.ibvModifyQp} />. The destination is part of
            the queue pair, so full connectivity needs one queue pair per process pair.
          </Box>

          <Alert type="warning" header="The commonly quoted form of this argument mixes units">
            <SpaceBetween size="xs">
              <Box variant="p">
                The version repeated everywhere is that a cluster needs N x p queue pairs with SRD
                against N x p x p with a connected transport. Those two figures are not counted the
                same way. N x p is a cluster total. N x p x p is a per-instance figure. Comparing
                them understates the connected-transport cost by a factor of N.
              </Box>
              <Box variant="p">
                Counted consistently, for N instances running p processes each: per process, 1
                against N x p. Per instance, p against N x p x p. Cluster-wide, N x p against N x N
                x p x p. At 512 instances of 8 processes that is 4,096 queue pairs against
                16,777,216, which is the difference between a resource you can allocate and one you
                cannot.
              </Box>
              <Box variant="p">
                The arithmetic here is derived, not quoted. The EFA half rests on the descriptor
                layout and the absent destination field cited above{' '}
                <SourceRef provenance="code-derived" code={code.txMeta} />; the connected half rests
                on the libibverbs state-transition requirements{' '}
                <SourceRef provenance="documented" doc={docs.ibvModifyQp} />. The multiplication is
                ours.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the factor of ten costs, and how to choose between ENA Express and EFA."
          >
            What SRD costs you
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three bills come attached to that factor of ten: a programming model, an API, and a
            small latency charge while the fabric is quiet.
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Out-of-order completion</Box>
              <Box variant="p">
                The device promises delivery, not sequence{' '}
                <SourceRef provenance="code-derived" code={code.msgOrder} />. An application, or the
                middleware under it, has to be written for that. Collectives and message passing
                already are: NCCL (NVIDIA Collective Communications Library) and MPI (Message
                Passing Interface) both express work as tagged messages with explicit completion,
                not as a byte stream that must arrive in sequence.
              </Box>
            </div>
            <div>
              <Box variant="h3">libfabric is the only way in</Box>
              <Box variant="p">
                EFA registers an InfiniBand device, not a network device, so there is no interface,
                no IP address and no socket to bind. AWS states the consequence directly: EFA-only
                interfaces cannot be assigned IPv4 or IPv6 addresses and cannot be the primary
                network interface <SourceRef provenance="documented" doc={docs.efa} />. Reaching SRD
                means adopting libfabric, or something built on it.
              </Box>
            </div>
            <div>
              <Box variant="h3">A latency tax when nothing is congested</Box>
              <Box variant="p">
                SRD is tuned for the bad case. AWS documents the good-case cost on the ENA Express
                path: when network traffic is light you might notice a slight increase in median
                packet latency, of tens of microseconds, when the packet uses ENA Express{' '}
                <SourceRef provenance="documented" doc={docs.enaExpress} />. AWS adds that
                applications with high packets-per-second requirements that need to optimize for
                latency during uncongested periods may be better served by standard enhanced
                networking.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            ENA Express is the middle option worth knowing about. It puts ordinary TCP and UDP
            traffic onto SRD without any application change, raising the single-flow ceiling from 5
            Gbps to up to 25 Gbps within the same Region, up to the aggregate instance limit, and
            reducing tail latency between instances during periods of high network load{' '}
            <SourceRef provenance="documented" doc={docs.enaExpress} />. You keep sockets and pay
            the uncongested median tax. EFA removes the kernel from the data path entirely and pays
            nothing at the transport layer, in exchange for a different programming model. Reach for
            ENA Express when the application has to keep its sockets, and for EFA when the library
            underneath it already speaks libfabric.
          </Box>

          <Alert type="info" header="ENA Express is switched on outside the instance">
            <SpaceBetween size="xs">
              <Box variant="p">
                Everything the ENA driver holds for SRD is read-only. The only accessor is{' '}
                <code>ena_com_get_ena_srd_info()</code>, a getter{' '}
                <SourceRef provenance="code-derived" code={code.enaSrdGet} />. No matching set
                function was found in the tree during this research. ENA Express
                is configured on the network interface attachment through the EC2 control plane, and
                the driver only observes the result. Any guide showing an in-instance command to
                enable it is describing tuning, not enablement.
              </Box>
              <Box variant="p">
                What the attachment carries is three bits:{' '}
                <code>ENA_ADMIN_ENA_SRD_ENABLED</code>,{' '}
                <code>ENA_ADMIN_ENA_SRD_UDP_ENABLED</code> and{' '}
                <code>ENA_ADMIN_ENA_SRD_UDP_ORDERING_BYPASS_ENABLED</code>{' '}
                <SourceRef provenance="code-derived" code={code.enaSrdFlags} />. The third decides
                whether the card restores UDP receive ordering or hands packets up out of order,
                which is this section's whole trade offered as a per-attachment switch. Turn it on
                only for a receiver written to tolerate reordering.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
