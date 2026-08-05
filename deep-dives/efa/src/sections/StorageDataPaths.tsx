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
 * Storage next to an EFA cluster. Two services, one fabric, and one choice
 * that cannot be taken back.
 *
 * Scope discipline for this file: this is one section of an EFA dive, not a
 * storage dive. It covers the fabric-facing story (which FSx for Lustre
 * configuration reaches the fabric, and where S3 throughput comes from) and
 * the resulting comparison. The Common Runtime's internal mechanics are named
 * where they change a fabric decision and deferred everywhere else, with the
 * boundary stated in the container before the comparison.
 *
 * Sourcing rule (deep-dives/efa/revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef. FSx material is 'documented',
 * because no open-source artifact exists for the service side. S3 client
 * material is 'code-derived' at pinned commits. The two are never blended.
 */

const ACCESSED = '2026-08-01';
/** The C repositories were cloned and read on this date. */
const READ_C = '2026-08-01';
/** The language bindings were read on this date, to settle the open caveat below. */
const READ_BINDINGS = '2026-08-02';

const S3_SHA = '469cbd020db52c329631a614e3b8401f3fda7717';
const IO_SHA = 'fbac3c30fd8c50c05168f41486403a69d91f7600';
const HTTP_SHA = 'e543240bbd28ce39423bbc470785f2f38ff28ecb';
const PY_TAG = 'v0.36.1';
const JAVA_TAG = 'v0.48.3';
const XFER_TAG = '0.15.0';

const FSX_DOC = 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/';
const S3_DOC = 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/';

const doc = (title: string, url: string, tier: 1 | 2): DocRef => ({ title, url, tier, accessed: ACCESSED });

/** Pinned code reference builders. Ref is always a SHA or a release tag, never a branch. */
const s3c = (path: string, lines?: string): CodeRef => ({
  repo: 'awslabs/aws-c-s3',
  ref: S3_SHA,
  path,
  lines,
  read: READ_C,
});
const ioc = (path: string, lines?: string): CodeRef => ({
  repo: 'awslabs/aws-c-io',
  ref: IO_SHA,
  path,
  lines,
  read: READ_C,
});
const httpc = (path: string, lines?: string): CodeRef => ({
  repo: 'awslabs/aws-c-http',
  ref: HTTP_SHA,
  path,
  lines,
  read: READ_C,
});
const pyc = (path: string, lines?: string): CodeRef => ({
  repo: 'awslabs/aws-crt-python',
  ref: PY_TAG,
  path,
  lines,
  read: READ_BINDINGS,
});
const javac = (path: string, lines?: string): CodeRef => ({
  repo: 'awslabs/aws-crt-java',
  ref: JAVA_TAG,
  path,
  lines,
  read: READ_BINDINGS,
});
const xferc = (path: string, lines?: string): CodeRef => ({
  repo: 'boto/s3transfer',
  ref: XFER_TAG,
  path,
  lines,
  read: READ_BINDINGS,
});

const docs = {
  fsxEfa: doc('FSx for Lustre User Guide: EFA-enabled file systems', `${FSX_DOC}efa-file-systems.html`, 1),
  fsxClients: doc('FSx for Lustre User Guide: Configuring EFA clients', `${FSX_DOC}configure-efa-clients.html`, 1),
  fsxPerf: doc('FSx for Lustre User Guide: Amazon FSx for Lustre performance', `${FSX_DOC}performance.html`, 1),
  fsxSecGroups: doc(
    'FSx for Lustre User Guide: Controlling access with Amazon VPC security groups',
    `${FSX_DOC}limit-access-security-groups.html`,
    1
  ),
  fsxRepos: doc('FSx for Lustre User Guide: Linking your file system to an S3 bucket', `${FSX_DOC}fsx-data-repositories.html`, 1),
  fsxDra: doc('FSx for Lustre User Guide: Creating a data repository association', `${FSX_DOC}create-dra-linked-data-repo.html`, 1),
  fsxImport: doc('FSx for Lustre User Guide: Importing files from your data repository', `${FSX_DOC}importing-files-dra.html`, 1),
  fsxUsing: doc('FSx for Lustre User Guide: Deployment options for FSx for Lustre', `${FSX_DOC}using-fsx-lustre.html`, 1),
  fsxStart: doc('FSx for Lustre User Guide: Getting started with Amazon FSx for Lustre', `${FSX_DOC}getting-started.html`, 1),
  fsxHistory: doc('FSx for Lustre User Guide: Document history', `${FSX_DOC}doc-history.html`, 1),
  s3Perf: doc('S3 User Guide: Best practices design patterns, optimizing S3 performance', `${S3_DOC}optimizing-performance.html`, 1),
  // Re-pinned 2026-08-02: the s3-optimizing-performance-best-practices
  // whitepaper path now redirects to the S3 User Guide index, which the
  // citation re-verification check flags as rot. The horizontal-scaling and
  // request-parallelization guidance now lives in the User Guide itself.
  s3Paper: doc(
    'S3 User Guide: Performance design patterns, horizontal scaling and request parallelization',
    'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html',
    1
  ),
  cliConfig: doc('AWS CLI Reference: S3 configuration topic', 'https://docs.aws.amazon.com/cli/latest/topic/s3-config.html', 1),
  repost: doc(
    're:Post Knowledge Center: Troubleshoot uploading large files to Amazon S3',
    'https://repost.aws/knowledge-center/s3-upload-large-files',
    1
  ),
  crtBlog: doc(
    'AWS Storage Blog: Improving Amazon S3 throughput for the AWS CLI and Boto3 with the AWS Common Runtime',
    'https://aws.amazon.com/blogs/storage/improving-amazon-s3-throughput-for-the-aws-cli-and-boto3-with-the-aws-common-runtime/',
    2
  ),
};

const code = {
  perConnection: s3c('source/s3_client.c', 'L59-L77'),
  idealCount: s3c('source/s3_client.c', 'L163-L169'),
  idealApplied: s3c('source/s3_client.c', 'L422-L423'),
  memLadder: s3c('source/s3_client.c', 'L383-L411'),
  inFlight: s3c('source/s3_client.c', 'L210-L213'),
  retryMap: s3c('source/s3_client.c', 'L2681-L2691'),
  defaultTarget: s3c('source/s3_util.c', 'L65-L68'),
  rangeSize: s3c('source/s3_util.c', 'L828-L877'),
  nicOption: s3c('include/aws/s3/s3_client.h', 'L676-L688'),
  platformNic: s3c('source/s3_platform_info.c', 'L80-L90'),
  platformP5: s3c('source/s3_platform_info.c', 'L65-L72'),
  platformP6: s3c('source/s3_platform_info.c', 'L126-L140'),
  idealConst: s3c('include/aws/s3/private/s3_client_impl.h', 'L276'),
  endpointSocket: s3c('source/s3_endpoint.c', 'L154-L188'),
  roundRobin: httpc('source/connection_manager.c', 'L1102-L1119'),
  bindToDevice: ioc('source/posix/socket.c', 'L1376-L1392'),
  tokenBucket: ioc('source/standard_retry_strategy.c', 'L314-L330'),
  pyRecommend: pyc('awscrt/s3.py', 'L939-L953'),
  pyNative: pyc('source/s3_client.c', 'L46-L53'),
  pyDefault: pyc('awscrt/s3.py', 'L353-L354'),
  javaOptions: javac('src/main/java/software/amazon/awssdk/crt/s3/S3ClientOptions.java'),
  xferTarget: xferc('s3transfer/crt.py', 'L169-L184'),
};

/**
 * Diagram 1. The three data paths a GPU instance can take, with the per-client
 * ceiling on each. This is the artifact the section exists to produce.
 * Class prefix "sdp-".
 */
function ThreeDataPathsDiagram() {
  const lanes = [
    {
      path: 'EFA and SRD',
      sub: 'inter-node collectives',
      fabric: true,
      traverses: [
        'Userspace libfabric writes work queue entries straight to',
        'the EFA device, bypassing the kernel network stack.',
        'GPUDirect RDMA moves buffers without a host copy.',
      ],
      endpoint: ['Another instance in the', 'same Availability Zone'],
      ceiling: 'Line rate',
      unit: 'up to 6,400 Gbps on p6-b300',
    },
    {
      path: 'FSx for Lustre',
      sub: 'Persistent 2, EFA enabled',
      fabric: true,
      traverses: [
        'LNet runs over the EFA device. The Lustre client kernel',
        'module still handles metadata. GPUDirect Storage moves',
        'file data into GPU memory on P5, P5e, P5en, P6-B200.',
      ],
      endpoint: ['FSx for Lustre object', 'storage servers'],
      ceiling: '700 Gbps',
      unit: '1,200 Gbps with GDS',
    },
    {
      path: 'FSx for Lustre',
      sub: 'without EFA, TCP over ENA',
      fabric: false,
      traverses: [
        'LNet runs over TCP on the ENA device. Same service, same',
        'POSIX semantics, ENA speed. Traffic to any one object',
        'storage server caps at 5 Gbps, so fan-out has to be wide.',
      ],
      endpoint: ['FSx for Lustre object', 'storage servers'],
      ceiling: '100 Gbps',
      unit: 'ENA ceiling per client',
    },
    {
      path: 'S3 and the CRT',
      sub: 'object semantics',
      fabric: false,
      traverses: [
        'Full userspace TCP, TLS and HTTP over ENA, spread across',
        'many parallel connections. A TCP socket is the only',
        'transport that appears in the client source.',
      ],
      endpoint: ['Many S3 front-end IP', 'addresses'],
      ceiling: 'About 400 Gbps',
      unit: 'CPU-bound, p5.48xlarge',
    },
  ];

  return (
    <svg
      viewBox="0 0 920 580"
      role="img"
      aria-labelledby="sdp-three-paths-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="sdp-three-paths-title">
        A single GPU instance has four data paths available to it here, and only two of them touch
        the fabric. EFA with SRD reaches line rate by bypassing the kernel entirely. An EFA-enabled
        Persistent 2 FSx for Lustre file system reaches 700 Gbps per client, or 1,200 Gbps with
        GPUDirect Storage. The same service without EFA is capped at 100 Gbps because it runs over
        ENA, and S3 through the Common Runtime is capped by what userspace TCP can pull through the
        CPU, which the runtime's own instance table records as about 400 Gbps on a p5.48xlarge.
      </title>
      <style>
        {`
          .sdp-hd { fill: #0f1b2a; font: 600 13px sans-serif; }
          .sdp-col { fill: #5f6b7a; font: 600 11px sans-serif; }
          .sdp-row-on { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .sdp-row-off { fill: #ffffff; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .sdp-path { fill: #0f1b2a; font: 600 13px sans-serif; }
          .sdp-sub { fill: #5f6b7a; font: 11px sans-serif; }
          .sdp-txt { fill: #0f1b2a; font: 11px sans-serif; }
          .sdp-end { fill: #0f1b2a; font: 11px sans-serif; }
          .sdp-num { fill: #0972d3; font: 600 19px sans-serif; text-anchor: middle; }
          .sdp-num-off { fill: #5f6b7a; font: 600 19px sans-serif; text-anchor: middle; }
          .sdp-unit { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .sdp-tag { fill: #ffffff; font: 600 10px sans-serif; text-anchor: middle; }
          .sdp-tag-on { fill: #0972d3; }
          .sdp-tag-off { fill: #879596; }
          .sdp-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="920" height="580" rx="8" fill="#ffffff" />

      <text className="sdp-hd" x="24" y="28">
        One client instance, four configurations, four different ceilings
      </text>
      <text className="sdp-col" x="24" y="58">
        Path
      </text>
      <text className="sdp-col" x="212" y="58">
        What the bytes traverse
      </text>
      <text className="sdp-col" x="554" y="58">
        Endpoint
      </text>
      <text className="sdp-col" x="736" y="58">
        Ceiling per client
      </text>

      {lanes.map((lane, index) => {
        const y = 72 + index * 116;
        return (
          <g key={`${lane.path}-${lane.sub}`}>
            <rect className={lane.fabric ? 'sdp-row-on' : 'sdp-row-off'} x="24" y={y} width="872" height="100" rx="6" />

            <text className="sdp-path" x="44" y={y + 30}>
              {lane.path}
            </text>
            <text className="sdp-sub" x="44" y={y + 48}>
              {lane.sub}
            </text>
            <rect className={lane.fabric ? 'sdp-tag-on' : 'sdp-tag-off'} x="44" y={y + 62} width="104" height="20" rx="10" />
            <text className="sdp-tag" x="96" y={y + 76}>
              {lane.fabric ? 'on the fabric' : 'ENA only'}
            </text>

            <line x1="204" y1={y + 12} x2="204" y2={y + 88} stroke="#d5dbdb" strokeWidth="1" />
            {lane.traverses.map((line, lineIndex) => (
              <text className="sdp-txt" key={line} x="220" y={y + 34 + lineIndex * 18}>
                {line}
              </text>
            ))}

            <line x1="546" y1={y + 12} x2="546" y2={y + 88} stroke="#d5dbdb" strokeWidth="1" />
            {lane.endpoint.map((line, lineIndex) => (
              <text className="sdp-end" key={line} x="562" y={y + 44 + lineIndex * 18}>
                {line}
              </text>
            ))}

            <line x1="728" y1={y + 12} x2="728" y2={y + 88} stroke="#d5dbdb" strokeWidth="1" />
            <text className={lane.fabric ? 'sdp-num' : 'sdp-num-off'} x="812" y={y + 50}>
              {lane.ceiling}
            </text>
            <text className="sdp-unit" x="812" y={y + 70}>
              {lane.unit}
            </text>
          </g>
        );
      })}

      <text className="sdp-cap" x="460" y="562">
        FSx for Lustre ceilings come from one AWS table. The S3 figure comes from the Common
        Runtime's own instance table in source.
      </text>
    </svg>
  );
}

/**
 * Diagram 2. The FSx for Lustre create-time decision, drawn as one-way doors.
 * Class prefix "fod-".
 */
function CreateTimeDoorsDiagram() {
  const columns = [
    {
      title: 'Scratch 2',
      note: 'or Scratch 1, Persistent 1, HDD',
      fabric: false,
      lines: [
        'Cheapest per TiB, ephemeral, unreplicated.',
        'EFA: documented only on Persistent 2.',
        'S3 data repository association: yes,',
        'except on Scratch 1.',
      ],
      ceiling: '100 Gbps',
    },
    {
      title: 'Persistent 2, SSD',
      note: 'EfaEnabled true, metadata configuration set',
      fabric: true,
      lines: [
        'Replicated, provisioned per TiB.',
        'EFA: yes. GPUDirect Storage: yes, on',
        'P5, P5e, P5en and P6-B200 clients.',
        'S3 data repository association: yes.',
      ],
      ceiling: '700 / 1,200 Gbps',
    },
    {
      title: 'Persistent 2, Intelligent-Tiering',
      note: 'EfaEnabled true, 4,000 MBps increments',
      fabric: true,
      lines: [
        'Throughput is independent of storage.',
        'EFA: yes. GPUDirect Storage: yes.',
        'S3 data repository association: no, so',
        'no lazy loading from S3.',
      ],
      ceiling: '700 / 1,200 Gbps',
    },
  ];

  return (
    <svg
      viewBox="0 0 920 540"
      role="img"
      aria-labelledby="fod-doors-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="fod-doors-title">
        Deployment type and EFA enablement are set in the create-file-system call and cannot be
        changed afterwards, so the choice between Scratch 2, EFA-enabled Persistent 2 on SSD and
        EFA-enabled Persistent 2 on Intelligent-Tiering is a one-way door. Only the SSD column
        delivers EFA, GPUDirect Storage and an S3 data repository association at the same time.
      </title>
      <style>
        {`
          .fod-root { fill: #0f1b2a; stroke: #0f1b2a; }
          .fod-root-t { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .fod-root-s { fill: #d5dbdb; font: 11px sans-serif; text-anchor: middle; }
          .fod-edge { stroke: #5f6b7a; stroke-width: 2; fill: none; }
          .fod-col-on { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .fod-col-off { fill: #ffffff; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .fod-title { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .fod-note { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .fod-line { fill: #0f1b2a; font: 11px sans-serif; }
          .fod-num { fill: #0972d3; font: 600 18px sans-serif; text-anchor: middle; }
          .fod-num-off { fill: #5f6b7a; font: 600 18px sans-serif; text-anchor: middle; }
          .fod-band { fill: #fff7f0; stroke: #f89256; stroke-width: 1.5; }
          .fod-band-t { fill: #0f1b2a; font: 600 12px sans-serif; }
          .fod-band-s { fill: #414d5c; font: 11px sans-serif; }
          .fod-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <rect x="0" y="0" width="920" height="540" rx="8" fill="#ffffff" />

      <rect className="fod-root" x="250" y="20" width="420" height="66" rx="8" />
      <text className="fod-root-t" x="460" y="46">
        aws fsx create-file-system
      </text>
      <text className="fod-root-s" x="460" y="66">
        DeploymentType and EfaEnabled are fixed here. Neither can be changed later.
      </text>

      <path className="fod-edge" d="M460,86 L460,110" />
      <path className="fod-edge" d="M160,110 L760,110" />
      <path className="fod-edge" d="M160,110 L160,142" />
      <path className="fod-edge" d="M460,110 L460,142" />
      <path className="fod-edge" d="M760,110 L760,142" />

      {columns.map((column, index) => {
        const x0 = 24 + index * 300;
        return (
          <g key={column.title}>
            <rect className={column.fabric ? 'fod-col-on' : 'fod-col-off'} x={x0} y="142" width="272" height="240" rx="8" />
            <text className="fod-title" x={x0 + 136} y="172">
              {column.title}
            </text>
            <text className="fod-note" x={x0 + 136} y="192">
              {column.note}
            </text>
            {column.lines.map((line, lineIndex) => (
              <text className="fod-line" key={line} x={x0 + 18} y={222 + lineIndex * 20}>
                {line}
              </text>
            ))}
            <text className={column.fabric ? 'fod-num' : 'fod-num-off'} x={x0 + 136} y="342">
              {column.ceiling}
            </text>
            <text className="fod-note" x={x0 + 136} y="362">
              maximum throughput per client
            </text>
          </g>
        );
      })}

      <rect className="fod-band" x="24" y="406" width="872" height="82" rx="8" />
      <text className="fod-band-t" x="44" y="434">
        The corner that decides most real designs
      </text>
      <text className="fod-band-s" x="44" y="456">
        Intelligent-Tiering file systems cannot link to an S3 data repository. If you want EFA,
        GPUDirect Storage and lazy loading
      </text>
      <text className="fod-band-s" x="44" y="474">
        from S3 on the same file system, Persistent 2 on SSD is the only configuration that gives
        you all three.
      </text>

      <text className="fod-cap" x="460" y="518">
        Every claim in this diagram comes from AWS documentation.
      </text>
    </svg>
  );
}

/**
 * Diagram 3. The single S3 client knob that a fabric reader still has to
 * understand, and the inversion it hides. Class prefix "tfo-".
 */
function TargetFanOutDiagram() {
  const outputs = [
    { label: 'Connections', formula: 'ceil(target / 0.4), clamped to 10 and 10,000' },
    { label: 'Memory ceiling', formula: 'a fixed ladder: 2, 4, 8, 16 or 24 GiB' },
    { label: 'Range request size', formula: 'memory / connections / 3, with an 8 MiB floor' },
    { label: 'Requests in flight', formula: 'connections multiplied by 4' },
  ];

  const rows = [
    ['10 (default)', '25', '27.31 MiB'],
    ['100', '250', '21.84 MiB'],
    ['400', '1,000', '8.19 MiB'],
    ['800', '2,000', '8 MiB floor'],
  ];

  return (
    <svg
      viewBox="0 0 920 400"
      role="img"
      aria-labelledby="tfo-fanout-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="tfo-fanout-title">
        The throughput target passed to the Common Runtime S3 client is a divisor. One number picks
        the connection count, the process memory ceiling, the size of each range request and the
        in-flight request cap, and because the memory ceiling is divided
        by a growing connection count, raising the target makes every range request smaller until
        it hits an 8 mebibyte floor.
      </title>
      <style>
        {`
          .tfo-in { fill: #0f1b2a; stroke: #0f1b2a; }
          .tfo-in-t { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .tfo-in-s { fill: #d5dbdb; font: 10px sans-serif; text-anchor: middle; }
          .tfo-out { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .tfo-lbl { fill: #0f1b2a; font: 600 12px sans-serif; }
          .tfo-frm { fill: #5f6b7a; font: 11px sans-serif; }
          .tfo-edge { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#tfo-head); }
          .tfo-panel { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tfo-th { fill: #5f6b7a; font: 600 10px sans-serif; }
          .tfo-td { fill: #0f1b2a; font: 11px sans-serif; }
          .tfo-note { fill: #0972d3; font: 600 11px sans-serif; }
          .tfo-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="tfo-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect x="0" y="0" width="920" height="400" rx="8" fill="#ffffff" />

      <rect className="tfo-in" x="24" y="152" width="176" height="86" rx="8" />
      <text className="tfo-in-t" x="112" y="184">
        throughput
      </text>
      <text className="tfo-in-t" x="112" y="202">
        target, in Gbps
      </text>
      <text className="tfo-in-s" x="112" y="222">
        default 10.0
      </text>

      {outputs.map((output, index) => {
        const y = 30 + index * 84;
        return (
          <g key={output.label}>
            <path className="tfo-edge" d={`M200,195 C240,195 240,${y + 30} 268,${y + 30}`} />
            <rect className="tfo-out" x="272" y={y} width="292" height="60" rx="6" />
            <text className="tfo-lbl" x="290" y={y + 26}>
              {output.label}
            </text>
            <text className="tfo-frm" x="290" y={y + 45}>
              {output.formula}
            </text>
          </g>
        );
      })}

      <rect className="tfo-panel" x="596" y="30" width="300" height="282" rx="8" />
      <text className="tfo-th" x="616" y="58">
        TARGET
      </text>
      <text className="tfo-th" x="726" y="58">
        CONNECTIONS
      </text>
      <text className="tfo-th" x="826" y="58">
        RANGE SIZE
      </text>
      <line x1="614" y1="68" x2="878" y2="68" stroke="#0972d3" strokeWidth="1" />
      {rows.map((row, index) => (
        <g key={row[0]}>
          <text className="tfo-td" x="616" y={92 + index * 26}>
            {row[0]}
          </text>
          <text className="tfo-td" x="726" y={92 + index * 26}>
            {row[1]}
          </text>
          <text className="tfo-td" x="826" y={92 + index * 26}>
            {row[2]}
          </text>
        </g>
      ))}
      <line x1="614" y1="212" x2="878" y2="212" stroke="#0972d3" strokeWidth="1" />
      <text className="tfo-note" x="616" y="238">
        Connections go up. Range size goes down.
      </text>
      <text className="tfo-frm" x="616" y="260">
        The memory ceiling is fixed by the same
      </text>
      <text className="tfo-frm" x="616" y="278">
        number, then divided by a growing
      </text>
      <text className="tfo-frm" x="616" y="296">
        connection count, so each range shrinks.
      </text>

      <text className="tfo-cap" x="460" y="380">
        Every value here is read from the client source at a pinned commit.
      </text>
    </svg>
  );
}

interface ScopeRow {
  dimension: string;
  requirement: string;
}

const efaScope: ScopeRow[] = [
  {
    dimension: 'Deployment type',
    requirement:
      'Persistent 2, with a metadata configuration specified. That is the only deployment type AWS names in connection with EFA. HDD is a storage class on Persistent 1 rather than a deployment type.',
  },
  {
    dimension: 'Storage class',
    requirement:
      'SSD or Intelligent-Tiering. On Intelligent-Tiering, EFA is supported only at a throughput capacity of 4,000 MBps or increments of 4,000 MBps.',
  },
  {
    dimension: 'Client instances',
    requirement:
      'Nitro v4 or higher EC2 instances that support EFA, excluding the trn2 instance family.',
  },
  {
    dimension: 'Client operating system',
    requirement:
      'Amazon Linux 2023, Red Hat Enterprise Linux 9.5 or newer, or Ubuntu 22.04 or newer with kernel version 6.8 or higher.',
  },
  {
    dimension: 'GPUDirect Storage clients',
    requirement:
      'P5, P5e, P5en or P6-B200 only, with CUDA, the open source NVIDIA driver, and NVIDIA GDS driver 2.24.2 or higher.',
  },
  {
    dimension: 'Fleet-wide limit',
    requirement: 'A maximum of 1,024 EFA connections across all client instances of one file system.',
  },
  {
    dimension: 'Placement',
    requirement:
      'Same Availability Zone and same /16 CIDR as the EFA-enabled client instances, inside one VPC.',
  },
  {
    dimension: 'Mutability',
    requirement:
      'EFA cannot be enabled or disabled on an existing file system. Storage capacity can be scaled; the throughput tier cannot be changed.',
  },
  {
    dimension: 'Availability',
    requirement: 'EFA and GPUDirect Storage support for FSx for Lustre shipped on 2024-11-27.',
  },
];

interface CompareRow {
  axis: string;
  efa: string;
  fsx: string;
  s3: string;
}

const comparison: CompareRow[] = [
  {
    axis: 'Semantics',
    efa: 'Message passing. Tag-matched send and receive plus RDMA read and write through libfabric.',
    fsx: 'POSIX filesystem. Byte ranges, open and seek, hard links, permissions, partial overwrite in place.',
    s3: 'Objects. Whole-key PUT and GET, ranged GET, multipart upload. No partial in-place update, no rename.',
  },
  {
    axis: 'Throughput ceiling per client',
    efa: 'EFA line rate for the instance type, up to 6,400 Gbps of EFA bandwidth on p6-b300.48xlarge.',
    fsx: '700 Gbps on EFA, 1,200 Gbps with GPUDirect Storage, 100 Gbps on ENA. The ENA path is also capped at 5 Gbps to any single object storage server.',
    s3: 'Whatever userspace TCP can pull through the CPU. The client source records about 400 Gbps for p5.48xlarge and notes the advertised link rate is not reachable from userspace.',
  },
  {
    axis: 'Latency',
    efa: 'Single-digit microsecond class. SRD tolerates out-of-order delivery and reorders in the transport.',
    fsx: 'Sub-millisecond for data already on the file system. A file backed by an S3 data repository pays a load penalty on first access.',
    s3: 'First-byte latency in the 100 to 200 millisecond range, which is why every fast S3 client is a concurrency engine.',
  },
  {
    axis: 'CPU cost',
    efa: 'Lowest. The kernel and the host CPU are off the data path, and GPUDirect RDMA removes the host copy.',
    fsx: 'Low on the GPUDirect Storage path, since the CPU is bypassed for data movement. The Lustre client kernel module is otherwise in the path.',
    s3: 'Highest. TLS, HTTP parsing and checksums in userspace across up to 10,000 sockets, plus a buffer pool the client sizes between 2 and 24 GiB.',
  },
  {
    axis: 'Cost model',
    efa: 'No charge for the adapter. You pay for the instances and for keeping them in one Availability Zone.',
    fsx: 'Provisioned per TiB-month. EFA-enabled Persistent 2 buys capacity in 4.8, 9.6, 19.2 or 38.4 TiB steps, so the smallest useful increment is large.',
    s3: 'Per GB-month plus per-request charges. High concurrency with small ranges multiplies the request count, so the request line grows faster than the storage line.',
  },
  {
    axis: 'What actually binds first',
    efa: 'Placement and instance availability.',
    fsx: 'The create-time choice. EFA cannot be turned on later.',
    s3: 'Prefix design and host CPU.',
  },
];

interface BlogClaimRow {
  claim: string;
  reality: string;
}

const blogClaims: BlogClaimRow[] = [
  {
    claim: 'Tunes to the number and layout of ENA interfaces',
    reality:
      'No interface enumeration exists. getifaddrs and if_nameindex appear nowhere in aws-c-io, and the S3 client source states that clients default to a single interface unless the caller names them.',
  },
  {
    claim: 'Tunes to CPU topology',
    reality:
      'Absent. The connection count is a pure function of the throughput target, computed once at construction.',
  },
  {
    claim: 'Tunes to the amount of memory',
    reality:
      'Inverted. Host memory is never read; the memory ceiling is an output of the throughput target.',
  },
  {
    claim: 'Chooses the number of requests per S3 IP address',
    reality:
      'Absent as a decision. Spreading across S3 addresses falls out of the resolver cache in aws-c-io, which vends a different cached address each time.',
  },
];

export function StorageDataPaths() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Two storage services sit next to an EFA cluster. One of them can be put on the fabric, and that choice is made in the create call, before a byte is written."
          >
            Storage Data Paths: FSx for Lustre, S3 and the CRT
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="Start here: the file system configuration that reaches the fabric">
            <Box variant="p">
              AWS scopes EFA (Elastic Fabric Adapter) support for FSx for Lustre positively: EFA
              is supported on Persistent 2 file systems with a metadata configuration specified,
              including file systems using the Intelligent-Tiering storage class{' '}
              <SourceRef provenance="documented" doc={docs.fsxEfa} />. That is the file system to
              create if the cluster will ever want the fabric, and it is the thing to get right
              first, because EFA cannot be enabled on an existing file system{' '}
              <SourceRef provenance="documented" doc={docs.fsxEfa} />.
            </Box>
          </Alert>

          <Box variant="p">
            One AWS table puts numbers on all four options. For the same file system, maximum
            throughput per client instance is 100 Gbps over ENA, 100 Gbps over ENA Express, 700 Gbps
            over EFA, and 1,200 Gbps over EFA with GPUDirect Storage{' '}
            <SourceRef provenance="documented" doc={docs.fsxPerf} />. That is 7 times for the fabric
            and 12 times with the GPU path added. The ENA rows carry a footnote that explains why
            they need wide fan-out to reach even 100 Gbps: traffic between an individual client
            instance and an individual FSx for Lustre object storage server is limited to 5 Gbps{' '}
            <SourceRef provenance="documented" doc={docs.fsxPerf} />.
          </Box>

          <Box variant="p">
            The second half of this section answers what a reader of an EFA dive asks next: what the
            S3 path is made of, and where its ceiling comes from. That answer is settled in the
            client source at pinned commits.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Four configurations, four ceilings, side by side so the gap is something you can see."
          >
            Where the bytes actually go
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A GPU instance in a cluster has four ways to move bytes, and they differ in what the
            bytes traverse before they leave the host. Two of them reach the fabric.
          </Box>
          <ThreeDataPathsDiagram />
          <Box variant="p">
            Two rows in that diagram are the same AWS service. The only difference between them is a
            field in the create-file-system call, and the gap it produces is 7 times per client.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What AWS requires before a file system will speak to the fabric, and the two traps that show up as support cases."
          >
            Putting FSx for Lustre on the fabric
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Putting a file system on the fabric is a create-time flag plus a client-side install.
            The file system is created as Persistent 2 with EfaEnabled set, and each client gets the
            Lustre client, the EFA driver and, for GPUDirect Storage, the NVIDIA GDS driver. LNet,
            the Lustre network layer, then runs over the EFA device. The supported scope is narrower
            than EFA support on EC2 generally, so check your clients against it before you provision
            anything.
          </Box>
          <Table
            variant="embedded"
            header={
              <Header variant="h3" description="Every row traces to an AWS documentation page, cited below the table.">
                EFA support scope for FSx for Lustre
              </Header>
            }
            columnDefinitions={[
              { id: 'dimension', header: 'Dimension', cell: (item) => <strong>{item.dimension}</strong> },
              { id: 'requirement', header: 'What AWS requires', cell: (item) => item.requirement },
            ]}
            items={efaScope}
          />
          <Box variant="small" color="text-body-secondary">
            Sources for the table above: deployment type, storage class, GDS instance list,
            mutability and placement{' '}
            <SourceRef provenance="documented" doc={docs.fsxEfa} />; client instance family, client
            operating system, GDS driver version and the 1,024-connection limit{' '}
            <SourceRef provenance="documented" doc={docs.fsxClients} />; availability date{' '}
            <SourceRef provenance="documented" doc={docs.fsxHistory} />.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">
                GDS is narrower than EFA <Badge color="blue">four instance types</Badge>
              </Box>
              <Box variant="p">
                GPUDirect Storage builds on EFA, so an EFA-enabled Persistent 2 file system is the
                prerequisite. AWS describes it as enabling direct data transfer between the file
                system and the GPU memory, bypassing the CPU, and it names the client instances
                exhaustively: P5, P5e, P5en or P6-B200{' '}
                <SourceRef provenance="documented" doc={docs.fsxEfa} />.
              </Box>
              <Box variant="p">
                The list being closed matters for anyone reading the instance matrix elsewhere in
                this dive: it is four instance types out of the many that are EFA-capable. P4d, P4de
                and the Trainium families are absent, and trn2 is excluded from FSx EFA support
                outright.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                Client setup is a documented script <Badge color="grey">installer provided</Badge>
              </Box>
              <Box variant="p">
                AWS ships an installer invoked as install-fsx-lustre-client.sh with the
                install-lustre and install-efa flags, plus a setup.sh that imports the Lustre
                modules, configures the TCP and EFA interfaces, and installs a systemd unit. The GDS
                variant is setup.sh with the optimized-for-gds flag{' '}
                <SourceRef provenance="documented" doc={docs.fsxClients} />.
              </Box>
              <Box variant="p">
                Manual LNet configuration exists for cases the script does not cover, using lnetctl
                to add an EFA network with a peer-credits value{' '}
                <SourceRef provenance="documented" doc={docs.fsxClients} />. The Deep Learning AMIs
                pre-install the Lustre client, the EFA driver and the GDS driver, which removes most
                of this step.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Write the security group rules by group ID, on both sides">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS states the requirement flatly. For EFA-enabled FSx for Lustre file systems, the
                file system and client security groups must allow all traffic to and from each
                other, and the file system security group must also allow all traffic to and from
                itself. You must explicitly specify a security group ID as the source or destination
                for all EFA traffic rules. CIDR-based rules, including 0.0.0.0/0, do not satisfy EFA
                requirements even if they allow all traffic on all ports{' '}
                <SourceRef provenance="documented" doc={docs.fsxSecGroups} />.
              </Box>
              <Box variant="p">
                This is the same self-referencing security group requirement EFA already has for
                instance-to-instance traffic, described in the device section of this dive. Get it
                wrong and the file system still works: created with EfaEnabled true, mounted
                successfully, running at ENA speed, with nothing in the console indicating anything
                is wrong. A rule that looks maximally permissive is the one that silently keeps you
                off the fabric.
              </Box>
            </SpaceBetween>
          </Alert>

          <CreateTimeDoorsDiagram />

          <Box variant="h3">The corner that decides most designs</Box>
          <Box variant="p">
            Two AWS statements interact, and no single page puts them together. First, a data
            repository association gives an FSx for Lustre file system a one-to-one mapping between
            file system paths and S3 object keys, with metadata loaded up front and file contents
            loaded on first access{' '}
            <SourceRef provenance="documented" doc={docs.fsxImport} />. Second,
            Intelligent-Tiering file systems do not support linking to Amazon S3 data repositories{' '}
            <SourceRef provenance="documented" doc={docs.fsxRepos} />.
          </Box>
          <Box variant="p">
            Put those next to the EFA scope statement and the result is a constraint that decides a
            lot of architectures. If you want EFA, GPUDirect Storage and lazy loading from S3 on the
            same file system, Persistent 2 on SSD is the only configuration that gives all three.
            Intelligent-Tiering gives the fabric and elastic capacity but no S3 link. Scratch gives
            the S3 link and no fabric. This combination is our reading across three AWS pages rather
            than a single AWS statement{' '}
            <SourceRef
              provenance="documented"
              doc={docs.fsxRepos}
              label="doc, combined"
            />
            .
          </Box>

          <ExpandableSection
            headerText="Capacity increments change once EFA is enabled"
            headerDescription="Enabling the fabric changes the storage-per-server ratio, so the smallest useful file system gets bigger"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                For an EFA-enabled, Persistent, SSD deployment type, AWS states that storage capacity
                is set in increments of 4.8 TiB, 9.6 TiB, 19.2 TiB and 38.4 TiB for the 1000, 500,
                250 and 125 MBps per TiB throughput tiers respectively{' '}
                <SourceRef provenance="documented" doc={docs.fsxStart} />. Non-EFA Persistent SSD
                uses much smaller steps, and the SSD minimum is 1.2 TiB{' '}
                <SourceRef provenance="documented" doc={docs.fsxUsing} />.
              </Box>
              <Box variant="p">
                The reason is the storage-per-server ratio. Enabling EFA moves a Persistent 2 SSD
                file system from 2.4 TiB per object storage server to between 4.8 and 38.4 TiB per
                server depending on tier{' '}
                <SourceRef provenance="documented" doc={docs.fsxUsing} />. Fewer, larger servers is
                how the per-client ceiling rises. The cost consequence is that the smallest
                EFA-enabled file system you can provision starts at one of those increments.
              </Box>
              <Box variant="p">
                AWS also gives a threshold for when to bother: if you are creating a file system with
                over 10 GBps of throughput capacity, AWS recommends enabling EFA to optimize
                throughput per client instance{' '}
                <SourceRef provenance="documented" doc={docs.fsxPerf} />. Below that, the ENA path is
                the documented answer.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The client's only transport is a TCP socket over ENA, and its ceiling is the host CPU. Both are readable in the source at three pinned commits."
          >
            What the S3 path is made of
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The AWS Common Runtime (CRT) S3 client is the fast path for S3 from EC2, and it is a
            userspace TCP client. It is what the AWS CLI and boto3 use when the CRT transfer manager
            is enabled. It creates a socket with an explicit socket options structure and hands it
            to the operating system to route, which on EC2 means ENA{' '}
            <SourceRef provenance="code-derived" code={code.endpointSocket} />. That socket is the
            whole transport story: a case-insensitive search for efa, libfabric, rdma, ibverbs,
            GPUDirect and nvidia across the whole of aws-c-s3, aws-c-io and aws-c-http at the pinned
            commits returns zero hits{' '}
            <SourceRef provenance="code-derived" code={code.endpointSocket} label="code, zero hits" />
            .
          </Box>
          <Box variant="p">
            S3 throughput is therefore bought with parallelism. The client opens many connections,
            splits every large object into many range requests, and spreads those across many S3
            front-end addresses. That is the right design for an object store with 100 to 200
            millisecond first-byte latency{' '}
            <SourceRef provenance="documented" doc={docs.s3Perf} />, and it puts the ceiling on the
            host CPU.
          </Box>

          <Alert type="info" header="The client's own source puts the reachable ceiling near 400 Gbps on p5">
            <SpaceBetween size="xs">
              <Box variant="p">
                The CRT carries a per-instance table of throughput targets. Next to the p5 entry its
                authors wrote that while the specs have 3.2 TB/s for the network bandwidth, not all
                of that is accessible from the CPU, and from the CPU they expect to get around 400
                Gbps. The same comment observes that as far as this client is concerned there are two
                interfaces per node, with the rest reserved for other things on the machine{' '}
                <SourceRef provenance="code-derived" code={code.platformP5} />.
              </Box>
              <Box variant="p">
                The pattern repeats on later entries, with comments noting that not all of the
                advertised 1600 Gbps and 800 Gbps bandwidth can be hit from the CPU in userspace{' '}
                <SourceRef provenance="code-derived" code={code.platformP6} />. These are code
                comments, so they are evidence of the authors' intent rather than proof of behaviour.
                They are quoted here because they are the clearest available statement of the CPU
                ceiling that separates an object path from a fabric path, and they come from the
                people who wrote the client.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="h3">Multiple network interfaces: real, manual, and marked experimental</Box>
          <Box variant="p">
            The client spreads connections across several network interfaces when the caller names
            them, and naming them is the caller&apos;s job. The public option is an array of
            interface names plus a count, and its header comment opens with the words THIS IS AN
            EXPERIMENTAL AND UNSTABLE API. The same comment records the platform limits: supported
            on Linux, macOS and platforms that have
            either SO_BINDTODEVICE or IP_BOUND_IF, not supported on Windows, and on Linux
            SO_BINDTODEVICE requires kernel version 5.7 or newer, or root privileges{' '}
            <SourceRef provenance="code-derived" code={code.nicOption} />.
          </Box>
          <Box variant="p">
            The chain from that option to the kernel is short and complete. The connection manager
            keeps an array of interface names and an index, advances the index once per new
            connection, and copies the selected name into the socket options{' '}
            <SourceRef provenance="code-derived" code={code.roundRobin} />. The socket layer then
            calls setsockopt with SOL_SOCKET and SO_BINDTODEVICE on Linux, falling back to
            if_nametoindex followed by IP_BOUND_IF on BSD-derived systems, and raising a
            platform-not-supported error everywhere else{' '}
            <SourceRef provenance="code-derived" code={code.bindToDevice} />. The distribution
            strategy is round-robin and nothing else.
          </Box>

          <Alert type="warning" header="Name the interfaces yourself: the client's own TODO calls auto-detection future work">
            <SpaceBetween size="xs">
              <Box variant="p">
                Next to the per-instance throughput table, the source reads: for all instances from
                p5e.48xlarge to p6-b300.48xlarge, the max_throughput_gbps values configured are
                based on the maximum bandwidth offered from
                a single NIC (network interface card) in these instances. CRT clients default to
                using a single NIC unless configured to use multiple NICs by identifying the number
                of NICs and providing the names in an array. The comment ends with a TODO: once we
                are able to auto-detect NICs and add them, default values should be updated with
                maximum ENA network bandwidth allowed by these instances{' '}
                <SourceRef provenance="code-derived" code={code.platformNic} />.
              </Box>
              <Box variant="p">
                Absence corroborates it. Neither getifaddrs nor if_nameindex appears anywhere in
                aws-c-io. There is no interface enumeration primitive in the I/O layer at all, and
                if_nametoindex is used only to resolve a name the caller already supplied{' '}
                <SourceRef provenance="code-derived" code={code.bindToDevice} label="code, absence" />
                . The gap between the table's single-interface figure and an instance's aggregate ENA
                bandwidth is exactly what manual configuration recovers.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One knob, four effects, and a relationship that runs the opposite way to intuition."
          >
            What the throughput target actually sets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A reader coming from the fabric side needs one thing from the S3 client: the throughput
            target is a divisor. It feeds a division that picks a connection count and a lookup that
            picks a memory budget. The constant is 100 divided by 250 Gbps per connection, which is
            0.4 Gbps, and its own comment describes it as a magic value chosen
            to match the results of the previous algorithm{' '}
            <SourceRef provenance="code-derived" code={code.perConnection} />. The connection count is
            the target divided by that constant, rounded up{' '}
            <SourceRef provenance="code-derived" code={code.idealCount} />, clamped between 10 and
            10,000 and written once at construction{' '}
            <SourceRef provenance="code-derived" code={code.idealApplied} />. The default target when
            the caller sets nothing is 10.0{' '}
            <SourceRef provenance="code-derived" code={code.defaultTarget} />.
          </Box>

          <TargetFanOutDiagram />

          <Box variant="p">
            The same number silently selects a memory ceiling from a fixed ladder of 2, 4, 8, 16 and
            24 GiB{' '}
            <SourceRef provenance="code-derived" code={code.memLadder} />, and the per-request range
            size is that ceiling divided by the connection count divided by three, with an 8 MiB
            floor{' '}
            <SourceRef provenance="code-derived" code={code.rangeSize} />. The in-flight request cap
            is the connection count multiplied by four{' '}
            <SourceRef provenance="code-derived" code={code.inFlight} />.
          </Box>
          <Box variant="p">
            The consequence runs against intuition. Raising the target raises the connection count,
            which divides a fixed memory ceiling into smaller pieces, which makes every range request
            smaller. Past roughly 400 Gbps the 8 MiB floor binds, and the client is issuing the
            smallest range it will ever issue at its highest concurrency. Nothing warns about this,
            and the memory commitment is real: a target of 400 commits the process to a 24 GiB buffer
            pool ceiling, which is an out-of-memory event waiting to happen inside a container with a
            lower limit. The escape hatch is an environment variable that AWS does document{' '}
            <SourceRef provenance="documented" doc={docs.cliConfig} />.
          </Box>

          <Alert type="warning" header="Spread the keys before you raise the target: the client holds its socket count through a 503">
            <SpaceBetween size="xs">
              <Box variant="p">
                The connection count field is declared const and written exactly once, through a
                const-stripping cast during client construction{' '}
                <SourceRef provenance="code-derived" code={code.idealConst} />. It is never
                recomputed. When S3 returns 503, the client classifies it as a throttling error{' '}
                <SourceRef provenance="code-derived" code={code.retryMap} />, retries that individual
                request with exponential backoff, and debits a process-wide token bucket. When the
                bucket is empty the retry is refused outright rather than delayed{' '}
                <SourceRef provenance="code-derived" code={code.tokenBucket} />.
              </Box>
              <Box variant="p">
                So under sustained throttling the client holds the same number of sockets against the
                hot prefix, drains its bucket, and then starts failing requests, without ever
                converging on a sustainable rate. AWS documents five mitigations for 503 responses,
                including distributing requests across multiple prefixes and reacting to 5xx rates{' '}
                <SourceRef provenance="documented" doc={docs.s3Perf} />. The client implements the
                two that are purely local. Key layout is the caller's job, so prefix design is the
                binding constraint at high targets.
              </Box>
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="An AWS blog describes auto-tuning that the code performs differently. Read this before you trust a documented default."
          >
            Where the documentation and the code disagree
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The AWS Storage Blog states that the CRT defaults automatically configure the client based
            on the specifics of the instance type it is running on, including CPU topology, amount of
            memory, and the number and layout of Elastic Network Adapter interfaces, and that based on
            these details the CRT chooses a parallelization strategy including the number of parallel
            connections, the size of each request, and the number of requests per S3 IP address{' '}
            <SourceRef provenance="documented" doc={docs.crtBlog} />.
          </Box>

          <Table
            variant="embedded"
            header={
              <Header
                variant="h3"
                description="Checked against aws-c-s3, aws-c-io and aws-c-http at the pinned commits, and against the Python and Java bindings above them."
              >
                Four claims, four readings of the source
              </Header>
            }
            columnDefinitions={[
              { id: 'claim', header: 'What the blog says', cell: (item) => <strong>{item.claim}</strong> },
              { id: 'reality', header: 'What the source shows', cell: (item) => item.reality },
            ]}
            items={blogClaims}
          />
          <Box variant="small" color="text-body-secondary">
            Interface enumeration and the single-interface default{' '}
            <SourceRef provenance="doc-code-conflict" code={code.platformNic} doc={docs.crtBlog} conflict="the CRT tunes to the number and layout of ENA interfaces" />
            ; connection count as a pure function of the target{' '}
            <SourceRef provenance="code-derived" code={code.idealApplied} />; memory as an output
            rather than an input{' '}
            <SourceRef provenance="code-derived" code={code.memLadder} />.
          </Box>

          <Alert type="info" header="The layers above the C client were read too, and the gap stays open">
            <SpaceBetween size="xs">
              <Box variant="p">
                A conflict claim is only safe once you have checked whether the discovery happens
                somewhere else. The C client exposes its instance table only as a standalone query
                API and never consults it internally, so a binding could plausibly call that API and
                pass the result down. One of them does. The Python binding exposes a recommended
                throughput function whose entire body reads the platform info and returns the
                recorded maximum
                for the detected instance type{' '}
                <SourceRef provenance="code-derived" code={code.pyNative} />, and boto3's CRT
                transfer layer calls it, logs the result, and falls back to 10.0 when it comes back
                empty{' '}
                <SourceRef provenance="code-derived" code={code.xferTarget} />. That matches the
                debug output AWS publishes in its own troubleshooting article, where the recommended
                target is reported as None and the used target as 10.0{' '}
                <SourceRef provenance="documented" doc={docs.repost} />.
              </Box>
              <Box variant="p">
                That lookup is a per-instance-type constant, not discovery. It reads no interfaces,
                no CPU topology and no host memory, and the Python binding says as much in its own
                comment: eventually the CRT will make a full calculation based on NIC and CPU
                configuration, but until then handle 0{' '}
                <SourceRef provenance="code-derived" code={code.pyRecommend} />. The Python client
                also does not apply the recommendation by itself. A caller who passes nothing gets 0,
                which lands on the C client default{' '}
                <SourceRef provenance="code-derived" code={code.pyDefault} />. The Java binding is
                further behind: it exposes a plain throughput target field, no platform lookup, and no
                interface names option at all{' '}
                <SourceRef provenance="code-derived" code={code.javaOptions} label="code, absence" />.
              </Box>
              <Box variant="p">
                Scope of this finding, stated plainly. It holds for the C client at the pinned
                commits, for aws-crt-python {PY_TAG}, for aws-crt-java {JAVA_TAG}, and for s3transfer{' '}
                {XFER_TAG}. The C++ and Rust bindings and the Java SDK transfer manager were not read.
                Within that scope, no layer performs the interface, CPU or memory discovery the blog
                describes, and the runtime's own comments treat that discovery as future work.
              </Box>
            </SpaceBetween>
          </Alert>

          <ExpandableSection
            headerText="A second, smaller disagreement worth knowing before you size anything"
            headerDescription="The AWS whitepaper and the client assume different per-connection throughput"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The AWS performance whitepaper suggests making concurrent requests for byte ranges at
                a granularity of 8 to 16 MB, one concurrent request for each 85 to 90 MB/s of desired
                network throughput, and about 15 concurrent requests to saturate a 10 Gb/s network
                interface card{' '}
                <SourceRef provenance="documented" doc={docs.s3Paper} />.
              </Box>
              <Box variant="p">
                The client provisions for 50 MB/s per connection, so it opens 25 connections for that
                same 10 Gb/s target where the whitepaper predicts 15{' '}
                <SourceRef provenance="code-derived" code={code.perConnection} />. These are two
                safety margins: the whitepaper describes what a connection can do under good
                conditions, and the client provisions for what one reliably does. Anyone who sizes
                from the whitepaper and then counts sockets on a running host is looking at a
                healthy client.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What this section covers, and where to go for the Common Runtime mechanics it leaves alone."
          >
            The boundary of this section
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Everything above earns its place by changing with the fabric: FSx deployment type,
            GPUDirect Storage scope, per-client ceilings and interface binding. The Common Runtime's
            other mechanics appear in the one form that changes a fabric decision. The memory ladder
            is here because it makes range requests shrink as the target rises, the ETag parse
            because it is the second irreversible decision, and the token bucket because it explains
            why a throttled client fails instead of converging. Part size resolution, backoff jitter
            modes, prefix partitioning and data repository task mechanics belong to a storage dive,
            and the pinned commits above are where to start reading.
          </Box>
          <Box variant="p">
            One provenance note before the comparison. FSx for Lustre here is documentation-sourced,
            because the service side has no open-source artifact to read. The S3 client is
            code-sourced at pinned commits. Both are strong, they are not the same class of evidence,
            and the badge on each claim says which one you are looking at.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick by access semantics first, then by whether your per-client target clears 100 Gbps."
          >
            Choosing a path
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            columnDefinitions={[
              { id: 'axis', header: 'Axis', cell: (item) => <strong>{item.axis}</strong> },
              { id: 'efa', header: 'EFA and SRD', cell: (item) => item.efa },
              { id: 'fsx', header: 'FSx for Lustre', cell: (item) => item.fsx },
              { id: 's3', header: 'S3 and the CRT over ENA', cell: (item) => item.s3 },
            ]}
            items={comparison}
          />
          <Box variant="small" color="text-body-secondary">
            FSx per-client ceilings, capacity increments and the object storage server cap{' '}
            <SourceRef provenance="documented" doc={docs.fsxPerf} />; S3 first-byte latency{' '}
            <SourceRef provenance="documented" doc={docs.s3Perf} />; the S3 client's CPU ceiling,
            socket count and memory ladder{' '}
            <SourceRef provenance="code-derived" code={code.platformP5} />.
          </Box>

          <Box variant="p">
            The one-sentence version. EFA buys latency and CPU bypass on a fabric. FSx for Lustre buys
            POSIX semantics, and on Persistent 2 with EFA enabled at create time it puts that
            filesystem on the same fabric, worth 7 times per client over ENA and 12 times with
            GPUDirect Storage{' '}
            <SourceRef provenance="documented" doc={docs.fsxPerf} />. S3 with the CRT buys durability
            and object semantics, and pays for throughput in connections, CPU cycles, memory and
            request charges.
          </Box>

          <Alert type="info" header="Two decisions to get right before any data is written">
            <SpaceBetween size="xs">
              <Box variant="p">
                First, the FSx deployment type. Create the file system as Persistent 2 with EFA
                enabled and the throughput tier you intend to live with, because EFA cannot be
                enabled or disabled on an existing file system and the tier cannot be changed{' '}
                <SourceRef provenance="documented" doc={docs.fsxEfa} />. Picking scratch for cost
                gives up the fabric permanently for that file system.
              </Box>
              <Box variant="p">
                Second, S3 object layout. Choose the multipart part size at upload time for the read
                pattern you want later: the client parses the part count out of an object's ETag and
                uses the resulting stored part size to bound its range requests{' '}
                <SourceRef provenance="code-derived" code={code.rangeSize} />, so the part size
                chosen at upload time constrains download parallelism afterwards, short of rewriting
                the object. How an object was written decides how fast it can be read.
              </Box>
              <Box variant="p">
                Everything else in this section is runtime tuning that a configuration edit can undo.
                These two are set once.
              </Box>
            </SpaceBetween>
          </Alert>

          <Box variant="h3">A short path for a reader arriving from the fabric material</Box>
          <Box variant="p">
            Answer the questions in this order and most of the design falls out. What are my access
            semantics, objects or POSIX files? Is my per-client throughput target above 100 Gbps? If
            it is, an EFA-enabled Persistent 2 file system is the one option that clears it{' '}
            <SourceRef provenance="documented" doc={docs.fsxPerf} />. Can I commit to Persistent 2 at
            create time, including the 4.8 to 38.4 TiB capacity steps{' '}
            <SourceRef provenance="documented" doc={docs.fsxStart} />? Do I need lazy loading from
            S3? That points at SSD, since Intelligent-Tiering file systems link no data repository{' '}
            <SourceRef provenance="documented" doc={docs.fsxRepos} />. Only after those does it make
            sense to tune a throughput target, a prefix layout or a list of interface names.
          </Box>
        </SpaceBetween>
      </Container>

    </SpaceBetween>
  );
}
