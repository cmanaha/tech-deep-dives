import React from 'react';

// The memory hierarchy from register file to NVMe flash, one fixed-width row
// per tier, grouped by where the tier sits: on the chip, on the accelerator
// package, off the package, or in storage. Numbers follow
// research/2026-10-refresh/01-memory.md section 1, hbf.md row 6.6 and
// flash-cache-tier.md table 6b; the section's "Sources for every figure on
// the map" block carries the citations. High Bandwidth Flash is drawn dashed
// and unfilled because no product ships.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls.

const VB_W = 900;
const ROW_X = 108;
const ROW_W = 784;
const ROW_H = 40;
const ROW_GAP = 5;
const GROUP_GAP = 10;
const TOP = 34;

const COL_NAME = 120;
const COL_CAP = 362;
const COL_BW = 542;
const COL_LAT = 732;

interface Cell {
  value: string;
  note?: string;
}

interface Tier {
  name: string;
  sub: string;
  capacity: Cell;
  bandwidth: Cell;
  latency: Cell;
  roadmap?: boolean;
}

interface Group {
  label: [string, string?];
  fill: string;
  stroke: string;
  tiers: Tier[];
}

const none: Cell = { value: '-' };

const GROUPS: Group[] = [
  {
    label: ['On the', 'chip'],
    fill: '#ecf7ec',
    stroke: '#037f0c',
    tiers: [
      {
        name: 'Register file',
        sub: 'per thread, allocated by the compiler',
        capacity: { value: '256 KB', note: 'per GPU SM' },
        bandwidth: none,
        latency: none,
      },
      {
        name: 'SRAM scratchpad',
        sub: 'SMEM, TMEM, SBUF, PSUM',
        capacity: { value: '228 KB to 32 MiB', note: 'SMEM per SM, SBUF per core' },
        bandwidth: none,
        latency: { value: '~29 cycles', note: 'SMEM, H800, measured' },
      },
      {
        name: 'L1 cache',
        sub: 'hardware-managed, per core or SM',
        capacity: { value: '48-64 KB', note: 'data, per CPU core' },
        bandwidth: none,
        latency: { value: '~41 cycles', note: 'GPU L1, H800, measured' },
      },
      {
        name: 'L2 cache',
        sub: 'per CPU core; shared on a GPU',
        capacity: { value: '2 MB per CPU core', note: '50-126 MB per GPU' },
        bandwidth: none,
        latency: { value: '~263 cycles', note: 'H800, measured' },
      },
      {
        name: 'LLC (L3)',
        sub: 'shared by the cores of a CPU',
        capacity: { value: '36-504 MB', note: 'Graviton4 to Xeon 6' },
        bandwidth: none,
        latency: { value: '~33 ns', note: 'local hit, Xeon 6 on r8i' },
      },
    ],
  },
  {
    label: ['On the', 'package'],
    fill: '#f2f8fd',
    stroke: '#0972d3',
    tiers: [
      {
        name: 'HBM',
        sub: 'stacked DRAM beside the die',
        capacity: { value: '80-288 GB', note: 'per GPU, H100 to Rubin' },
        bandwidth: { value: '3.35-22 TB/s', note: 'per GPU, H100 to Rubin' },
        latency: { value: '~479 cycles', note: 'H800, measured' },
      },
      {
        name: 'High Bandwidth Flash',
        sub: 'flash dies beside HBM; roadmap',
        capacity: { value: '512 GiB', note: 'per 16-high stack' },
        bandwidth: { value: '0.384-3.072 TB/s', note: 'per stack, spec grades' },
        latency: { value: 'not published', note: 'studies assume 1-20 µs' },
        roadmap: true,
      },
    ],
  },
  {
    label: ['Off the', 'package'],
    fill: '#fdf3ec',
    stroke: '#ec7211',
    tiers: [
      {
        name: 'Host DRAM',
        sub: "on the CPU's memory channels",
        capacity: { value: 'up to 6 TB', note: 'per socket' },
        bandwidth: { value: '614-845 GB/s', note: 'per socket, 12 channels' },
        latency: { value: '~144 ns', note: 'idle, Samsung platform' },
      },
      {
        name: 'CXL and remote HBM',
        sub: 'over a link: CXL, NVLink, NeuronLink',
        capacity: { value: '13.4 TB', note: 'HBM in one GB200 NVL72' },
        bandwidth: { value: '64-900 GB/s', note: 'per direction, CXL to NVLink' },
        latency: { value: '~254 ns', note: 'idle, Samsung CXL module' },
      },
    ],
  },
  {
    label: ['Storage'],
    fill: '#f2f3f3',
    stroke: '#5f6b7a',
    tiers: [
      {
        name: 'NVMe flash',
        sub: 'instance store, FSx, EBS',
        capacity: { value: '30.4 TB', note: 'per 8-GPU P5en or P6' },
        bandwidth: { value: '1.56-18.75 GB/s', note: 'per GPU, EBS to FSx + GDS' },
        latency: none,
      },
    ],
  },
];

function MetricCell({ x, y, cell }: { x: number; y: number; cell: Cell }) {
  if (cell.value === '-') {
    return (
      <text className="mht-none" x={x} y={y + 25}>
        -
      </text>
    );
  }
  return (
    <>
      <text className="mht-v" x={x} y={y + 17}>
        {cell.value}
      </text>
      {cell.note && (
        <text className="mht-n" x={x} y={y + 33}>
          {cell.note}
        </text>
      )}
    </>
  );
}

export function MemoryHierarchyTower() {
  let rowIndex = 0;
  const laidOut = GROUPS.map((g, gi) => {
    const rows = g.tiers.map((t) => {
      const y = TOP + rowIndex * (ROW_H + ROW_GAP) + gi * GROUP_GAP;
      rowIndex += 1;
      return { t, y };
    });
    return { g, rows };
  });
  const last = laidOut[laidOut.length - 1].rows;
  const VB_H = last[last.length - 1].y + ROW_H + 12;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="memory-hierarchy-tower-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="memory-hierarchy-tower-title">
          Moving down the memory hierarchy, capacity grows from a 256 KB register file per GPU SM to
          30.4 TB of NVMe flash per instance, bandwidth falls from up to 22 TB/s of HBM per GPU to
          under 20 GB/s of flash per GPU, and latency rises from tens of cycles to hundreds of
          nanoseconds. High Bandwidth Flash, a roadmap tier with 512 GiB per stack, sits beside HBM
          on the accelerator package rather than behind the CPU.
        </title>
        <style>{`
          .mht-h { fill: #5f6b7a; font: 600 11px sans-serif; }
          .mht-g { font: 600 11px sans-serif; text-anchor: middle; }
          .mht-t { fill: #16191f; font: 600 13px sans-serif; }
          .mht-s { fill: #5f6b7a; font: 11px sans-serif; }
          .mht-v { fill: #16191f; font: 600 12px sans-serif; }
          .mht-n { fill: #5f6b7a; font: 11px sans-serif; }
          .mht-none { fill: #879596; font: 12px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={VB_W} height={VB_H} rx={8} fill="#ffffff" stroke="#e9ebed" />

        <text className="mht-h" x={COL_NAME} y={22}>
          Tier
        </text>
        <text className="mht-h" x={COL_CAP} y={22}>
          Capacity
        </text>
        <text className="mht-h" x={COL_BW} y={22}>
          Bandwidth
        </text>
        <text className="mht-h" x={COL_LAT} y={22}>
          Latency
        </text>

        {laidOut.map(({ g, rows }) => {
          const top = rows[0].y;
          const bottom = rows[rows.length - 1].y + ROW_H;
          const mid = (top + bottom) / 2;
          const [l1, l2] = g.label;
          return (
            <g key={g.label.join(' ')}>
              <line x1={100} y1={top + 2} x2={100} y2={bottom - 2} stroke={g.stroke} strokeWidth={2} />
              <line x1={96} y1={top + 2} x2={100} y2={top + 2} stroke={g.stroke} strokeWidth={2} />
              <line x1={96} y1={bottom - 2} x2={100} y2={bottom - 2} stroke={g.stroke} strokeWidth={2} />
              {l2 ? (
                <>
                  <text className="mht-g" x={50} y={mid - 3} fill={g.stroke}>
                    {l1}
                  </text>
                  <text className="mht-g" x={50} y={mid + 11} fill={g.stroke}>
                    {l2}
                  </text>
                </>
              ) : (
                <text className="mht-g" x={50} y={mid + 4} fill={g.stroke}>
                  {l1}
                </text>
              )}
              {rows.map(({ t, y }) => (
                <g key={t.name}>
                  <rect
                    x={ROW_X}
                    y={y}
                    width={ROW_W}
                    height={ROW_H}
                    rx={6}
                    fill={t.roadmap ? '#ffffff' : g.fill}
                    stroke={g.stroke}
                    strokeWidth={t.roadmap ? 1.5 : 1.25}
                    strokeDasharray={t.roadmap ? '6 4' : undefined}
                  />
                  <text className="mht-t" x={COL_NAME} y={y + 17}>
                    {t.name}
                  </text>
                  <text className="mht-s" x={COL_NAME} y={y + 33}>
                    {t.sub}
                  </text>
                  <MetricCell x={COL_CAP} y={y} cell={t.capacity} />
                  <MetricCell x={COL_BW} y={y} cell={t.bandwidth} />
                  <MetricCell x={COL_LAT} y={y} cell={t.latency} />
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
