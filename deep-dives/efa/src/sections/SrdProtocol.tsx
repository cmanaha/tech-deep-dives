import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * SRD: The Transport Protocol.
 *
 * Source-authority rules that govern this file (see
 * revamp/source-authority-standard.md):
 *
 *  1. `kernel/linux/efa/SRD.txt` is NEVER cited as evidence. It is a 2019-era
 *     specification document that the code in its own repository contradicts,
 *     and it already put one false claim on this site. It appears here only as
 *     a named example of why an in-repo text file is not a source.
 *  2. SRD does not sit "on top of ENA". SRD lives in the Nitro card. ENA (via
 *     ENA Express) and EFA are peer consumers of it. The decisive disproof is
 *     that an EFA-only interface materializes an EFA device with no ENA device
 *     and still carries SRD traffic.
 *  3. The SRD design paper is Shalev et al., IEEE Micro 2020. Not NSDI.
 */

const CODE_READ = '2026-08-01';
const DOC_ACCESSED = '2026-08-01';

/** amzn/amzn-drivers at the r3.3.0 release tag commit. */
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
  efaPci: driversRef('kernel/linux/efa/src/efa_main.c', 'L24-L38'),
  enaPci: driversRef('kernel/linux/ena/ena_pci_id_tbl.h', 'L9-L43'),
  enaSrdStats: driversRef('kernel/linux/common/ena_com/ena_admin_defs.h', 'L512-L536'),
  enaSrdFlags: driversRef('kernel/linux/common/ena_com/ena_admin_defs.h', 'L163-L170'),
  enaStatsType: driversRef('kernel/linux/common/ena_com/ena_admin_defs.h', 'L137-L144'),
  enaSrdGet: driversRef('kernel/linux/common/ena_com/ena_com.c', 'L2645-L2661'),
  maxAh: driversRef('kernel/linux/efa/src/efa_com_cmd.h', 'L127-L136'),
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

const docs: Record<string, DocRef> = {
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: DOC_ACCESSED,
  },
  enaExpress: {
    title: 'EC2 User Guide: Improve network performance with ENA Express',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html',
    tier: 1,
    accessed: DOC_ACCESSED,
  },
  bandwidth: {
    title: 'EC2 User Guide: Amazon EC2 instance network bandwidth',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html',
    tier: 1,
    accessed: DOC_ACCESSED,
  },
  ebsIops: {
    title: 'Amazon EBS User Guide: Provisioned IOPS SSD volumes (io2 Block Express)',
    url: 'https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html',
    tier: 1,
    accessed: DOC_ACCESSED,
  },
  ibvModifyQp: {
    title: 'rdma-core man page: ibv_modify_qp(3)',
    url: 'https://man7.org/linux/man-pages/man3/ibv_modify_qp.3.html',
    tier: 1,
    accessed: DOC_ACCESSED,
  },
  hpcBlog: {
    title: 'AWS HPC Blog: In the search for performance, there is more than one way to build a network',
    url: 'https://aws.amazon.com/blogs/hpc/in-the-search-for-performance-theres-more-than-one-way-to-build-a-network/',
    tier: 2,
    accessed: DOC_ACCESSED,
  },
  storageBlog: {
    title: 'AWS Storage Blog: Storage for I/O intensive SQL Server using Amazon EBS io2 Block Express',
    url: 'https://aws.amazon.com/blogs/storage/storage-for-i-o-intensive-sql-server-using-amazon-ebs-io2-block-express/',
    tier: 2,
    accessed: DOC_ACCESSED,
  },
  ieeeMicro: {
    title:
      'Shalev, Ayoub, Bshara, Sabbag. A Cloud-Optimized Transport Protocol for Elastic and Scalable HPC. IEEE Micro 40(6), pp. 67-73, November 2020',
    url: 'https://doi.org/10.1109/MM.2020.3016891',
    tier: 3,
    accessed: DOC_ACCESSED,
  },
  dcqcn: {
    title:
      'Zhu et al. Congestion Control for Large-Scale RDMA Deployments. ACM SIGCOMM 2015 (Microsoft and Mellanox)',
    url: 'https://conferences.sigcomm.org/sigcomm/2015/pdf/papers/p523.pdf',
    tier: 3,
    accessed: DOC_ACCESSED,
  },
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
/* efa-d07  SrdLossRecoveryTimeline                                    */
/* ------------------------------------------------------------------ */

/**
 * A drop on one path, recovered on another, with the application lane
 * showing that nothing upstream stalled.
 * Idiom A (class-name block), prefix `slr-`.
 */
function SrdLossRecoveryTimeline() {
  const laneY = [77, 125, 173];
  const pktW = 26;
  const pktH = 18;
  const lanes = [
    { label: 'Path A', blue: [170, 208, 246, 284, 322, 360, 398], amber: [] as number[] },
    { label: 'Path B', blue: [170, 208], amber: [] as number[] },
    { label: 'Path C', blue: [170, 208, 246, 284, 470, 508], amber: [430] },
  ];

  return (
    <svg
      viewBox="0 0 900 312"
      role="img"
      aria-labelledby="efa-d07-loss-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="efa-d07-loss-title">
        When SRD loses a packet, the EFA device retransmits it on a different fabric path, and the
        application never stops making forward progress. Recovery is a device level event: the
        driver only reads the counters afterwards, it does not perform the retransmission.
      </title>
      <style>
        {`
          .slr-bg   { fill: #ffffff; }
          .slr-trk  { stroke: #d1d5db; stroke-width: 1; }
          .slr-pkt  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .slr-pka  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .slr-pkd  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .slr-x    { stroke: #d13212; stroke-width: 2; }
          .slr-lab  { fill: #0f1b2a; font: 600 11px sans-serif; }
          .slr-grp  { fill: #5f6b7a; font: 600 10px sans-serif; letter-spacing: 1px; }
          .slr-note { fill: #8b6c00; font: 11px sans-serif; text-anchor: middle; }
          .slr-time { fill: #5f6b7a; font: 600 10px sans-serif; letter-spacing: 1px; }
          .slr-axis { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#slr-head); }
          .slr-rtx  { stroke: #ec7211; stroke-width: 2; fill: none; stroke-dasharray: 5 4; marker-end: url(#slr-ah2); }
          .slr-app  { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .slr-appt { fill: #0f1b2a; font: 11px sans-serif; text-anchor: middle; }
          .slr-div  { stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 5 4; }
        `}
      </style>
      <defs>
        <marker id="slr-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
        <marker id="slr-ah2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#ec7211" />
        </marker>
      </defs>

      <rect className="slr-bg" x="0" y="0" width="900" height="312" rx="8" />

      <text className="slr-time" x="140" y="26">
        TIME
      </text>
      <path className="slr-axis" d="M140,40 L856,40" />

      <text className="slr-grp" x="16" y="62">
        FABRIC PATHS
      </text>

      {lanes.map((lane, i) => (
        <g key={lane.label}>
          <text className="slr-lab" x="16" y={laneY[i] + 13}>
            {lane.label}
          </text>
          <path className="slr-trk" d={`M140,${laneY[i] + 9} L856,${laneY[i] + 9}`} />
          {lane.blue.map((x) => (
            <rect
              key={`b-${x}`}
              className="slr-pkt"
              x={x}
              y={laneY[i]}
              width={pktW}
              height={pktH}
              rx="3"
            />
          ))}
          {lane.amber.map((x) => (
            <rect
              key={`a-${x}`}
              className="slr-pka"
              x={x}
              y={laneY[i]}
              width={pktW}
              height={pktH}
              rx="3"
            />
          ))}
        </g>
      ))}

      <rect className="slr-pkd" x="246" y="125" width={pktW} height={pktH} rx="3" />
      <path className="slr-x" d="M249,128 L269,140" />
      <path className="slr-x" d="M269,128 L249,140" />
      <text className="slr-note" x="259" y="114">
        packet dropped
      </text>

      <path className="slr-rtx" d="M274,134 C330,150 372,176 422,182" />
      <text className="slr-note" x="352" y="210">
        retransmitted on a different path
      </text>

      <path className="slr-div" d="M140,224 L856,224" />

      <text className="slr-grp" x="16" y="262">
        APPLICATION
      </text>
      <rect className="slr-app" x="140" y="242" width="716" height="32" rx="6" />
      <text className="slr-appt" x="498" y="262">
        The application never blocks. It keeps posting work and polling completions while the device
        recovers the packet.
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

const scalingRows = [
  {
    unit: 'Per process',
    connected: 'N x p, one per peer process',
    srd: '1',
    why: 'A connected queue pair is bound to exactly one remote queue pair.',
  },
  {
    unit: 'Per instance',
    connected: 'N x p x p',
    srd: 'p',
    why: 'Multiply the per-process figure by the p processes running on the node.',
  },
  {
    unit: 'Whole cluster',
    connected: 'N x N x p x p',
    srd: 'N x p',
    why: 'Multiply the per-instance figure by the N instances in the cluster.',
  },
];

export function SrdProtocol() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What does SRD actually do differently, and what do I give up to get it?"
          >
            SRD: The Transport Protocol
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem:</strong> a collective operation finishes when its slowest
            participant finishes. That makes tail latency, not median latency, the number that
            decides how fast a distributed training step runs. Every conventional reliable transport
            makes tail latency worse in the same way: it delivers packets in order, so one lost
            packet holds up every packet queued behind it. AWS names this directly, calling the
            in-order model a conga line where a single lost packet messes up the on-time arrival of
            all the packets behind it, an effect called head of line blocking{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />.
          </Box>
          <Box variant="p">
            <strong>The answer:</strong> SRD (Scalable Reliable Datagram) keeps reliability and
            throws ordering away. AWS states it plainly: SRD relaxed the requirement for in-order
            packet delivery in the belief that if it is necessary it can be reasserted in the higher
            layers of the stack, and the p99 tail latency then fell by around a factor of ten{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />. Everything else in this
            section follows from that single trade.
          </Box>
          <Box variant="p">
            The design is published as Shalev, Ayoub, Bshara and Sabbag,{' '}
            <em>A Cloud-Optimized Transport Protocol for Elastic and Scalable HPC</em>, IEEE Micro
            volume 40 issue 6, November 2020{' '}
            <SourceRef provenance="documented" doc={docs.ieeeMicro} />. It is frequently miscited as
            an NSDI paper. It is not. Both the AWS HPC blog and the libfabric EFA (Elastic Fabric
            Adapter) provider documentation link to the same IEEE Micro record. The paper is
            paywalled and was not read for this page, so nothing here is attributed to it.
          </Box>

          <ExpandableSection
            headerText="Why an in-repo specification file is not a source"
            headerDescription="A 2019 text file in an official AWS repository, contradicted by the driver beside it"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The <code>amzn/amzn-drivers</code> repository ships a text file describing the SRD
                queue pair type. It dates from 2019 and states that only the Send operation is
                currently supported. The driver code in that same repository defines{' '}
                <code>EFA_IO_RDMA_READ</code> and <code>EFA_IO_RDMA_WRITE</code> as device opcodes,
                and the device reports both operations as capability bits in its admin-queue
                attributes. The file was never revised.
              </Box>
              <Box variant="p">
                A stale specification file inside an official AWS repository reads like a primary
                source and is not one. The rule this page follows: code at a pinned commit is the
                authority, official documentation is a secondary check, and an in-repo README,
                comment or specification file is a way to find your way around the code, never proof
                of behaviour.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="How to check any claim on this page yourself"
            headerDescription="Every code citation resolves to an immutable ref"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                Every code badge below links to a file at a pinned reference, never a branch. The
                two references used here are <code>amzn/amzn-drivers</code> at commit{' '}
                <code>b99452b70756b1b394b1e7ff238d4efbdca44c5b</code>, which is the r3.3.0 release
                point, and <code>ofiwg/libfabric</code> at tag <code>v2.6.0</code>. Both were read on
                2026-08-01.
              </Box>
              <Box variant="code">
                <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`git clone https://github.com/amzn/amzn-drivers.git
cd amzn-drivers
git checkout b99452b70756b1b394b1e7ff238d4efbdca44c5b

# SRD is the only driver queue-pair type
grep -n "EFA_QP_DRIVER_TYPE" kernel/linux/efa/src/efa-abi.h

# Every transmit descriptor carries its own destination
sed -n '87,151p' kernel/linux/efa/src/efa_io_defs.h

# The modify-QP command has no destination field
sed -n '215,250p' kernel/linux/efa/src/efa_admin_cmds_defs.h

# The device counts its own retransmissions
sed -n '664,674p' kernel/linux/efa/src/efa_admin_cmds_defs.h

# The ENA driver knows SRD only as a read-only stats blob
grep -rn "ena_srd" kernel/linux/common/ena_com/ena_com.c`}</pre>
              </Box>
              <Box variant="p">
                The last command returns a single getter and no setter. That absence is the whole
                argument that SRD is not layered on ENA.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The single most common misconception about EFA, settled from code"
          >
            SRD does not run on top of ENA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SRD lives in the Nitro card. AWS says so for the storage case in its own words: to
            minimize jitter and to ensure the fastest response to network congestion fluctuations,
            SRD is implemented in the AWS custom Nitro networking card{' '}
            <SourceRef provenance="documented" doc={docs.storageBlog} />. The EBS (Elastic Block
            Store) documentation repeats it for io2 Block Express, which communicates with
            Nitro-based instances using SRD through an interface implemented in the Nitro card
            dedicated to the EBS I/O function <SourceRef provenance="documented" doc={docs.ebsIops} />
            . EFA and ENA (Elastic Network Adapter, through ENA Express) are two peer consumers of
            that one transport. Neither is built on the other.
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">
                An EFA-only interface has no ENA device{' '}
                <Badge color="green">decisive</Badge>
              </Box>
              <Box variant="p">
                AWS documents two attachment shapes: a traditional EFA interface, also called EFA
                with ENA, which creates both an EFA device and an ENA device, and an EFA-only
                interface, which creates just the EFA device{' '}
                <SourceRef provenance="documented" doc={docs.efa} />. An EFA-only interface carries
                SRD traffic with no ENA device present anywhere on it. If SRD were layered on ENA,
                EFA-only could not work at all.
              </Box>
            </div>
            <div>
              <Box variant="h3">The ENA driver contains no SRD implementation</Box>
              <Box variant="p">
                Everything the ENA driver knows about SRD is a read-only statistics structure,{' '}
                <code>struct ena_admin_ena_srd_stats</code>{' '}
                <SourceRef provenance="code-derived" code={code.enaSrdStats} />, fetched through the
                statistics admin command as{' '}
                <code>ENA_ADMIN_GET_STATS_TYPE_ENA_SRD</code>{' '}
                <SourceRef provenance="code-derived" code={code.enaStatsType} />. The only accessor
                is <code>ena_com_get_ena_srd_info()</code>{' '}
                <SourceRef provenance="code-derived" code={code.enaSrdGet} />. There is no matching
                set function anywhere in the tree. No retransmission logic, no reordering, no path
                selection. The driver reads counters that the card maintains.
              </Box>
            </div>
            <div>
              <Box variant="h3">Two devices, two drivers, disjoint identities</Box>
              <Box variant="p">
                ENA claims PCI device IDs 0x0051, 0x0ec2, 0x1ec2, 0xec20 and 0xec21{' '}
                <SourceRef provenance="code-derived" code={code.enaPci} />. EFA claims 0xefa0
                through 0xefa4{' '}
                <SourceRef provenance="code-derived" code={code.efaPci} />. The sets do not
                intersect, and each driver registers its own <code>pci_driver</code> with its own
                probe function. EFA is a separate PCI function, not a mode of the ENA device.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="ENA Express and EFA are both customers of SRD, not layers on each other">
            <SpaceBetween size="xs">
              <Box variant="p">
                Accurate: ENA Express uses SRD. EFA uses SRD. SRD is implemented in the Nitro card.
              </Box>
              <Box variant="p">
                Wrong: SRD is built on top of ENA. EFA is built on top of ENA. EFA is a mode of ENA.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="What ENA Express exposes, and what it does not"
            headerDescription="Three configuration bits and four counters, all read-only from inside the instance"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The SRD configuration bitmap the ENA device reports has exactly three bits:{' '}
                <code>ENA_ADMIN_ENA_SRD_ENABLED</code>,{' '}
                <code>ENA_ADMIN_ENA_SRD_UDP_ENABLED</code> and{' '}
                <code>ENA_ADMIN_ENA_SRD_UDP_ORDERING_BYPASS_ENABLED</code>{' '}
                <SourceRef provenance="code-derived" code={code.enaSrdFlags} />. That third bit is
                the interesting one. It decides whether the card restores UDP (User Datagram
                Protocol) receive ordering or hands packets up out of order, which is exactly the
                ordering trade this whole section is about, offered as a per-attachment switch.
              </Box>
              <Box variant="p">
                Because there is a get path and no set path{' '}
                <SourceRef provenance="code-derived" code={code.enaSrdGet} />, ENA Express cannot be
                turned on from inside the instance. It is configured on the network interface
                attachment through the EC2 control plane, and the driver only observes the result.
                Any guide showing an in-instance command to enable ENA Express is describing tuning,
                not enablement.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What each transport assumes about the network, and what breaks when the assumption fails"
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
                unfairness{' '}
                <SourceRef provenance="documented" doc={docs.dcqcn} />. The mechanism is the reason:
                PAUSE operates per port and priority class, not per flow, so pausing one congested
                flow pauses everything sharing that port. The same paper reports congestion
                spreading as the practical consequence at scale.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="What PFC costs you is head of line blocking, not deadlock">
            Deadlock is the charge you will hear levelled at PFC in large fabrics, and the primary
            literature is more careful than that. Zhu et al. describe routing deadlock as a commonly
            expressed concern, note that deadlock formation requires a set of flows whose buffer
            dependencies form a cycle, and argue that in a clos-structured network where servers
            connect only to top of rack switches such a cycle cannot arise without malfunctioning or
            misconfigured equipment{' '}
            <SourceRef provenance="documented" doc={docs.dcqcn} />. The sound criticism of PFC is
            head of line blocking, unfairness and congestion spreading, not deadlock as a routine
            outcome.
          </Alert>

          <Box variant="p">
            AWS makes the comparison itself, in first-party words: SRD differs from protocols like
            TCP, InfiniBand or RoCE, and instead of preserving packet order it sends packets over as
            many network paths as possible while avoiding overloaded paths, leaving message order
            restoration to the upper layer because that layer has a better understanding of the
            required ordering semantics{' '}
            <SourceRef provenance="documented" doc={docs.storageBlog} />. The EFA driver refuses to
            claim membership of either family: it registers its InfiniBand device with{' '}
            <code>node_type = RDMA_NODE_UNSPECIFIED</code>{' '}
            <SourceRef provenance="code-derived" code={code.nodeType} />, rather than declaring
            itself InfiniBand or RoCE.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why more nodes make the fabric better, not worse">
            Packet spraying across many paths
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
            The contrast with a conventional flow is the point. A single TCP or UDP flow is a unique
            5-tuple, and AWS caps single-flow traffic at 5 Gbps outside a cluster placement group
            and 10 Gbps inside one{' '}
            <SourceRef provenance="documented" doc={docs.bandwidth} />. Part of that ceiling is
            policy and part is physics: a hashed flow follows one path, so its throughput is bounded
            by the most congested link on that one path. Spraying removes the second constraint
            outright.
          </Box>

          <Box variant="p">
            Spraying also scales the right way. AWS states that as a customer job grows to consume
            more nodes on the network, SRD consequently has more paths to choose from, because the
            perimeter of that network gets bigger{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />. Most fabric properties degrade
            with cluster size. Path diversity improves with it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Retransmission happens in the card, and the driver can only count it"
          >
            Loss recovery and congestion control
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The evidence:</strong> the EFA device reports a network statistics block
            containing <code>retrans_bytes</code>, <code>retrans_pkts</code>,{' '}
            <code>retrans_timeout_events</code>, <code>unresponsive_remote_events</code> and{' '}
            <code>impaired_remote_conn_events</code>{' '}
            <SourceRef provenance="code-derived" code={code.netStats} />, and the driver surfaces
            those five as RDMA (Remote Direct Memory Access) hardware counters alongside the byte
            and packet counts{' '}
            <SourceRef provenance="code-derived" code={code.portStats} />. Reporting a
            retransmission count is only possible for a party that performs retransmissions. The
            host does not: no retransmission logic exists anywhere in the EFA driver, only the code
            that copies these values out of an admin-queue response.
          </Box>

          <SrdLossRecoveryTimeline />

          <Box variant="small" color="text-body-secondary">
            Diagram efa-d07. Schematic. Packet counts and spacing are illustrative; the counters
            named above are the observable evidence that recovery is a device-level event.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Failures the device distinguishes</Box>
              <Box variant="p">
                The completion status enum separates local from remote faults and, more usefully,
                separates a peer that stopped answering from one that never answered:{' '}
                <code>LOCAL_ERROR_UNRESP_REMOTE</code> is commented as an unresponsive remote that
                was previously responsive, while{' '}
                <code>LOCAL_ERROR_UNREACH_REMOTE</code> is an unreachable remote that never returned
                a response{' '}
                <SourceRef provenance="code-derived" code={code.compStatus} />. That distinction is
                a transport-level judgement, made in hardware.
              </Box>
            </div>
            <div>
              <Box variant="h3">RNR retry is an SRD-only property</Box>
              <Box variant="p">
                The admin modify-queue-pair command carries an <code>rnr_retry</code> field
                commented as the number of RNR (Receiver Not Ready) retries, valid only for SRD
                queue pairs{' '}
                <SourceRef provenance="code-derived" code={code.modifyQp} />. Above it, libfabric
                sets <code>resource_mgmt</code> to enabled on the efa-direct path with the comment
                that the direct path retries indefinitely when receiver not ready{' '}
                <SourceRef provenance="code-derived" code={code.directRnr} />.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            Congestion control is the part with the least public detail. AWS states that the EFA
            device provides capabilities like built-in OS-bypass and congestion control through the
            SRD protocol <SourceRef provenance="documented" doc={docs.efa} />, and that ENA Express
            detects and avoids congested network paths and handles some tasks directly in the
            network layer, such as packet reordering on the receiving end and most retransmits that
            are needed <SourceRef provenance="documented" doc={docs.enaExpress} />. Beyond that,
            AWS publishes no algorithm. This page does not name one. Claims that SRD congestion
            control resembles any specific published algorithm are inference, and none is asserted
            here.
          </Box>

          <Alert type="info" header="How to see recovery happening on a live instance">
            The five network counters above are readable per device through the RDMA hardware
            counter interface{' '}
            <SourceRef provenance="code-derived" code={code.portStats} />. On the ENA side, ENA
            Express exposes its own set through <code>ethtool -S</code>, and the ratio of{' '}
            <code>ena_srd_tx_pkts</code> to <code>ena_srd_eligible_tx_pkts</code> is what reveals
            whether traffic is actually riding SRD or silently falling back{' '}
            <SourceRef provenance="code-derived" code={code.enaSrdStats} />.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The device delivers with no ordering guarantee at all. Ordering is bought in software, per peer."
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
            buffer{' '}
            <SourceRef provenance="code-derived" code={code.rdmOrder} />, and the receive attributes
            get the same override a few lines later{' '}
            <SourceRef provenance="code-derived" code={code.rdmRxOrder} />.
          </Box>

          <Box variant="p">
            The buffer is per peer, not per endpoint. Each <code>efa_rdm_peer</code> carries a{' '}
            <code>robuf</code> documented as a reorder buffer that temporarily holds packets that
            are out of order, whose message identifier is larger than the one the endpoint expects
            from that peer, plus an <code>overflow_pke_list</code> for out-of-order packets that do
            not fit the current window{' '}
            <SourceRef provenance="code-derived" code={code.robuf} />. Out-of-order arrivals are
            copied out of the pre-posted receive buffers into a separate bounce-buffer pool, which
            is on by default{' '}
            <SourceRef provenance="code-derived" code={code.envOoo} />.
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
                <strong>The unit is messages, not bytes.</strong> This is worth stating because a
                jump from 16384 to 16 looks like a units error, and it is not. The value is passed
                to the allocator unscaled{' '}
                <SourceRef provenance="code-derived" code={code.recvwinUse} />, which sizes the
                pending queue as <code>sizeof(struct efa_rdm_pke*) * size</code>: one pointer slot
                per held message, with a power-of-two assertion on the count{' '}
                <SourceRef provenance="code-derived" code={code.recvwinAlloc} />. The window index
                is then taken modulo that same value against the message id{' '}
                <SourceRef provenance="code-derived" code={code.recvwinModulo} />. Nothing anywhere
                multiplies it by a page, a packet size or a kilobyte. Both numbers count messages,
                so the two really do disagree.
              </Box>
              <Box variant="p">
                <strong>What the window is for.</strong> SRD delivers out of order by design, so the
                provider keeps a per-peer buffer of messages that arrived early and cannot be handed
                up yet. The window is how many such messages a single peer may hold pending before
                the excess spills to an overflow list. A window of 16 is a bet that reordering
                depth stays shallow, which is the normal case on a healthy fabric.
              </Box>
              <Box variant="p">
                <strong>The help text is two tuning rounds stale, not one.</strong> The default was
                16384. In October 2025 it went to 8192 while the peer reorder buffer pool dropped
                from 1024 to 16{' '}
                <SourceRef provenance="code-derived" code={code.tune16kTo8k} label="commit" />. In
                November 2025 the window itself was cut to 16 to match the pool, on the reasoning
                that a differently sized pool and buffer make no sense when every peer needs one
                buffer{' '}
                <SourceRef provenance="code-derived" code={code.tune8kTo16} label="commit" />. Both
                changes were made to hold performance without the memory overhead. The help string
                was updated in neither.
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

          <Box variant="p">
            This is the honest price of SRD. Ordering is not free, it is just moved. Relaxing it is
            what dropped p99 tail latency by around a factor of ten{' '}
            <SourceRef provenance="documented" doc={docs.hpcBlog} />, and this is where the bill for
            it arrives. If the application asks for ordered delivery, it pays for a per-peer window,
            a bounce-buffer copy for every out-of-order arrival, and an overflow list when
            reordering exceeds the window. If the application does not need ordering, it pays none
            of that and takes the fabric at its native speed. Collectives and message passing are in
            the second group, which is why they are the workloads EFA targets.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The reason SRD scales, expressed as arithmetic and proved from the descriptor layout"
          >
            Queue-pair scaling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mechanism, in one line:</strong> an SRD queue pair is not bound to a peer.
            Every transmit descriptor carries its own destination. The transmit metadata descriptor
            has <code>dest_qp_num</code>, an address handle index <code>ah</code>, and a{' '}
            <code>qkey</code>, all inside the per-work-request descriptor{' '}
            <SourceRef provenance="code-derived" code={code.txMeta} />. One send queue can therefore
            address every peer in the cluster. The device reports <code>max_ah</code> as a separate
            limit from <code>max_qp</code>{' '}
            <SourceRef provenance="code-derived" code={code.maxAh} />, which is the same fact from
            the resource-accounting side: peers are cheap, queue pairs are not.
          </Box>

          <Box variant="p">
            The negative proof is stronger. The EFA admin modify-queue-pair command has fields for
            state, current state, queue key, send queue packet sequence number, drain notification
            and RNR retry count, and no field for a destination at all{' '}
            <SourceRef provenance="code-derived" code={code.modifyQp} />. There is nowhere to bind a
            remote queue pair, because SRD never does.{' '}
            <code>EFA_QP_DRIVER_TYPE_SRD</code> is the only driver queue-pair type the user ABI
            defines <SourceRef provenance="code-derived" code={code.qpType} />.
          </Box>

          <Box variant="p">
            Compare the InfiniBand Reliable Connected service. In libibverbs, the{' '}
            <code>dest_qp_num</code> and <code>ah_attr</code> fields are documented as valid only
            for RC and UC queue pairs, and moving an RC queue pair to ready-to-receive requires{' '}
            <code>IBV_QP_AV</code> and <code>IBV_QP_DEST_QPN</code> among its mandatory attributes{' '}
            <SourceRef provenance="documented" doc={docs.ibvModifyQp} />. The destination is part of
            the queue pair, so full connectivity needs one queue pair per process pair.
          </Box>

          <Table
            variant="embedded"
            header={
              <Header
                variant="h3"
                description="N instances, p processes per instance, full all-to-all process connectivity"
              >
                Queue pairs needed for full connectivity
              </Header>
            }
            columnDefinitions={[
              { id: 'unit', header: 'Counted', cell: (item) => <strong>{item.unit}</strong> },
              {
                id: 'connected',
                header: 'Connected transport (InfiniBand RC)',
                cell: (item) => <Badge color="severity-medium">{item.connected}</Badge>,
              },
              {
                id: 'srd',
                header: 'SRD',
                cell: (item) => <Badge color="green">{item.srd}</Badge>,
              },
              { id: 'why', header: 'Why', cell: (item) => item.why },
            ]}
            items={scalingRows}
          />

          <Alert type="warning" header="The commonly quoted form of this argument mixes units">
            <SpaceBetween size="xs">
              <Box variant="p">
                The version repeated everywhere is that a cluster needs N x p queue pairs with SRD
                against N x p x p with a connected transport. Those two figures are not counted the
                same way. N x p is a cluster total. N x p x p is a per-instance figure. Comparing
                them understates the connected-transport cost by a factor of N.
              </Box>
              <Box variant="p">
                Counted consistently, the table above holds. At 512 instances running 8 processes
                each, SRD needs 4,096 queue pairs cluster-wide, and a connected transport needs
                16,777,216. That is the difference between a resource you can allocate and one you
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
            description="The factor of ten in p99 is not free everywhere. Where the trade lands badly, and what to reach for instead."
          >
            What SRD costs you
          </Header>
        }
      >
        <SpaceBetween size="m">
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
              <Box variant="h3">No socket API</Box>
              <Box variant="p">
                EFA registers an InfiniBand device, not a network device, so there is no interface,
                no IP address and no socket to bind. AWS states the consequence directly: EFA-only
                interfaces cannot be assigned IPv4 or IPv6 addresses and cannot be the primary
                network interface{' '}
                <SourceRef provenance="documented" doc={docs.efa} />. Reaching SRD means adopting
                libfabric, or something built on it.
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
            nothing at the transport layer, but demands a different programming model.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
