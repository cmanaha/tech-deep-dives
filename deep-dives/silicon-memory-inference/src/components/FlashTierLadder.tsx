import React from 'react';

// The KV tier ladder on an 8-GPU AWS instance, per GPU: read bandwidth on a log
// scale and capacity. Rows follow research/2026-10-refresh/flash-cache-tier.md
// table 6b (L1 to L6) plus one High Bandwidth Flash stack (H1, H2) drawn hollow
// because it is a roadmap part. The three FSx for Lustre rows are the documented
// per-client ceilings (research/2026-10-kv-tiers/03-fsx-lustre-kv-tier.md, F20):
// 1,200 Gb/s with EFA and GDS, 700 Gb/s over EFA without GDS, 100 Gb/s without
// EFA (an ENA client or a file system created without EFA), each divided by
// 8 bits and 8 GPUs. EFA can be enabled only when the file system is created, so
// the FSx rows show a create-time choice on either side of the break-even line.
// The peer DRAM row names the two pools reachable over EFA on AWS: Mooncake
// Store (02-mooncake-remote-tiers.md, M6, M17) and the pre-release Valkey BLOB
// module (01-valkey-large-object.md, V1, V37); its bar is the EFA line rate, a
// ceiling. The dashed line is the break-even bandwidth for a dense 70B on 8x
// H100 (row M1, 8K prefix). The section caption carries the citations.
//
// Layout: 9 rows of ROW_H 40 keep the viewBox at 472 units high. The longest
// left-column label is the peer DRAM sub-label, 39 chars at 11px (about 242
// units at 6.2 per char), which ends before BAR_X. A bar label sits inside its
// bar when the bar is wider than the label (about 7 units per char at 12px bold
// plus padding), otherwise just right of the bar end or the break-even line.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls.

const VB_W = 860;
const VB_H = 472;
const BAR_X = 270;
const PER_DECADE = 100; // 1 GB/s at BAR_X, 10,000 GB/s at BAR_X + 400
const ROW_TOP = 46;
const ROW_H = 40;

function xBw(gbps: number): number {
  return BAR_X + Math.log10(gbps) * PER_DECADE;
}

interface Row {
  name: string;
  sub: string;
  gbps: number;
  label: string;
  capacity: string;
  fill: string;
  stroke: string;
  hollow?: boolean;
}

const ROWS: Row[] = [
  { name: 'HBM3e', sub: 'H200 on p5en', gbps: 4800, label: '4,800 GB/s', capacity: '141 GB', fill: '#0972d3', stroke: '#065299' },
  {
    name: 'High Bandwidth Flash',
    sub: 'one stack on the package, roadmap',
    gbps: 1600,
    label: '1,600 GB/s per stack',
    capacity: '512 GiB per stack',
    fill: '#fbf3d5',
    stroke: '#8b6c00',
    hollow: true,
  },
  { name: 'Host DRAM', sub: 'PCIe Gen5 x16 line rate, p5en', gbps: 64, label: '64 GB/s', capacity: '256 GiB', fill: '#414d5c', stroke: '#414d5c' },
  { name: 'Peer DRAM over EFA', sub: 'Mooncake Store; pre-release Valkey BLOB', gbps: 50, label: '50 GB/s', capacity: 'pool size', fill: '#5f6b7a', stroke: '#5f6b7a' },
  { name: 'FSx for Lustre', sub: 'EFA + GDS, 1,200 Gb/s per client', gbps: 18.75, label: '18.75 GB/s', capacity: 'file system size', fill: '#037f0c', stroke: '#037f0c' },
  { name: 'FSx for Lustre', sub: 'EFA without GDS, 700 Gb/s per client', gbps: 700 / 64, label: '10.9 GB/s', capacity: 'file system size', fill: '#037f0c', stroke: '#037f0c' },
  { name: 'NVMe instance store', sub: '4 KiB IOPS floor, ceiling unpublished', gbps: 2.25, label: 'at least 2.25 GB/s', capacity: '3.8 TB', fill: '#037f0c', stroke: '#037f0c' },
  { name: 'FSx for Lustre', sub: 'without EFA, 100 Gb/s per client', gbps: 100 / 64, label: '1.56 GB/s', capacity: 'file system size', fill: '#ec7211', stroke: '#ec7211' },
  { name: 'EBS', sub: '12.5 GB/s per-instance cap / 8', gbps: 1.56, label: '1.56 GB/s', capacity: 'volume size', fill: '#ec7211', stroke: '#ec7211' },
];

const TICKS = [
  { v: 1, label: '1' },
  { v: 10, label: '10' },
  { v: 100, label: '100' },
  { v: 1000, label: '1,000' },
  { v: 10000, label: '10,000 GB/s' },
];

export function FlashTierLadder() {
  const breakEvenX = xBw(2.1);
  const axisY = ROW_TOP + ROWS.length * ROW_H + 6;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="flash-ladder-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="flash-ladder-title">
          Per GPU on an 8-GPU AWS instance, read bandwidth falls from 4,800 GB/s in HBM to 64 GB/s
          over the host link, 50 GB/s from pooled peer DRAM over EFA and at least 2.25 GB/s from the
          NVMe instance store, while capacity grows from 141 GB to 256 GiB to 3.8 TB. FSx for Lustre
          clears the 2.1 GB/s per GPU break-even for a dense 70B on H100 only over EFA: 18.75 GB/s
          with GPUDirect Storage and 10.9 GB/s without it, against 1.56 GB/s without EFA, level with
          EBS. A High Bandwidth Flash stack, a roadmap part, sits near HBM in bandwidth.
        </title>
        <style>{`
          .ftl-h { fill: #16191f; font: 600 12px sans-serif; }
          .ftl-n { fill: #16191f; font: 600 13px sans-serif; }
          .ftl-s { fill: #5f6b7a; font: 11px sans-serif; }
          .ftl-in { fill: #ffffff; font: 600 12px sans-serif; }
          .ftl-in-dark { fill: #5c4800; font: 600 12px sans-serif; }
          .ftl-out { fill: #16191f; font: 600 12px sans-serif; }
          .ftl-cap { fill: #16191f; font: 13px sans-serif; }
          .ftl-tick { fill: #414d5c; font: 11px sans-serif; }
          .ftl-note { fill: #065299; font: 11px sans-serif; }
        `}</style>
        <rect x="0" y="0" width={VB_W} height={VB_H} rx="8" fill="#ffffff" stroke="#e9ebed" />

        <text className="ftl-h" x="16" y="28">
          Tier, per GPU
        </text>
        <text className="ftl-h" x={BAR_X} y="28">
          Read bandwidth per GPU (log scale)
        </text>
        <text className="ftl-h" x="700" y="28">
          Capacity per GPU
        </text>

        {ROWS.map((r, i) => {
          const top = ROW_TOP + i * ROW_H;
          const end = xBw(r.gbps);
          const inside = end - BAR_X > r.label.length * 7 + 16;
          return (
            <g key={`${r.name}-${r.sub}`}>
              {i % 2 === 0 && <rect x="8" y={top} width="844" height={ROW_H} fill="#f8f9fa" />}
              <text className="ftl-n" x="16" y={top + 17}>
                {r.name}
              </text>
              <text className="ftl-s" x="16" y={top + 32}>
                {r.sub}
              </text>
              <rect
                x={BAR_X}
                y={top + 8}
                width={end - BAR_X}
                height="24"
                rx="3"
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth={r.hollow ? 1.5 : 1}
                strokeDasharray={r.hollow ? '5 3' : undefined}
              />
              {inside ? (
                <text className={r.hollow ? 'ftl-in-dark' : 'ftl-in'} x={end - 8} y={top + 25} textAnchor="end">
                  {r.label}
                </text>
              ) : (
                <text className="ftl-out" x={Math.max(end, breakEvenX) + 10} y={top + 25}>
                  {r.label}
                </text>
              )}
              <text className="ftl-cap" x="700" y={top + 25}>
                {r.capacity}
              </text>
            </g>
          );
        })}

        <line
          x1={breakEvenX}
          y1={ROW_TOP - 4}
          x2={breakEvenX}
          y2={axisY}
          stroke="#065299"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        <line x1={BAR_X} y1={axisY} x2={BAR_X + 4 * PER_DECADE} y2={axisY} stroke="#414d5c" />
        {TICKS.map((t) => (
          <g key={t.v}>
            <line x1={xBw(t.v)} y1={axisY} x2={xBw(t.v)} y2={axisY + 5} stroke="#414d5c" />
            <text className="ftl-tick" x={xBw(t.v)} y={axisY + 18} textAnchor="middle">
              {t.label}
            </text>
          </g>
        ))}
        <line x1="16" y1={axisY + 36} x2="40" y2={axisY + 36} stroke="#065299" strokeWidth="1.5" strokeDasharray="4 3" />
        <text className="ftl-note" x="46" y={axisY + 40}>
          Break-even for a dense 70B on 8x H100 at an 8K prefix: about 2.1 GB/s per GPU. Hollow bar: a roadmap part.
        </text>
      </svg>
    </div>
  );
}
