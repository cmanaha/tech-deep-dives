import React, { useEffect, useRef, useState } from 'react';

// Six places to keep bytes near compute, in two rows: host memory on the
// CPU's own channels, and the tiers beyond local DRAM. Every figure here is
// cited in the caption under the grid in MainMemoryAndCxl.tsx; the High
// Bandwidth Flash and NVMe flash figures match MemoryHierarchyTower,
// HighBandwidthFlash and FlashCacheTier. At desktop widths the grid is 3 x 2;
// below NARROW_PX of container width it re-lays as one column so the labels
// keep their size on a phone.

type PillTone = 'host' | 'accel' | 'roadmap';

interface Metric {
  label: string;
  value: string;
  note: string;
}

interface Cell {
  name: string;
  pills: { text: string; tone: PillTone }[];
  metrics: [Metric, Metric, Metric];
  where: string;
  fill: string;
  stroke: string;
  dashed?: boolean;
}

interface Row {
  heading: string;
  sub: string;
  cells: Cell[];
}

const rows: Row[] = [
  {
    heading: 'Host memory',
    sub: "on the CPU's own memory channels",
    cells: [
      {
        name: 'DDR5 DIMM',
        pills: [
          { text: 'Host', tone: 'host' },
          { text: 'Socketed DIMM', tone: 'host' },
        ],
        metrics: [
          { label: 'Bandwidth', value: '614-845 GB/s per socket', note: '12 channels, DDR5-6400 to DDR5-8800' },
          { label: 'Capacity', value: 'Up to 6 TB per socket', note: 'EPYC 9005, 12 channels' },
          { label: 'Latency', value: '~144 ns idle', note: "local DRAM, Samsung's test platform" },
        ],
        where: 'On Graviton, EPYC 9005, Xeon 6',
        fill: '#f2f8fd',
        stroke: '#0972d3',
      },
      {
        name: 'MRDIMM',
        pills: [
          { text: 'Host', tone: 'host' },
          { text: 'Socketed DIMM', tone: 'host' },
        ],
        metrics: [
          { label: 'Bandwidth', value: '845-1,638 GB/s per socket', note: '12 ch at 8,800; 16 ch at 12,800 MT/s' },
          { label: 'Capacity', value: 'Up to 3 TB per socket', note: 'Xeon 6 6900P' },
          { label: 'Latency', value: 'No figure located', note: 'no vendor figure in this research' },
        ],
        where: 'On Xeon 6 6900P; EPYC 9006 in production',
        fill: '#ecf7ec',
        stroke: '#037f0c',
      },
      {
        name: 'LPDDR5X and SOCAMM2',
        pills: [
          { text: 'Host', tone: 'host' },
          { text: 'On module or SOCAMM2', tone: 'host' },
        ],
        metrics: [
          { label: 'Bandwidth', value: 'Grace: 384-500 GB/s', note: 'Vera: up to 1.2 TB/s per CPU' },
          { label: 'Capacity', value: 'Grace: up to 480 GB', note: 'Vera: 1.5 TB (NVIDIA) or 2 TB (Micron)' },
          { label: 'Latency', value: 'No figure located', note: 'no vendor figure in this research' },
        ],
        where: 'On Grace; Vera uses SOCAMM2 modules',
        fill: '#e6f4f2',
        stroke: '#1f7a70',
      },
    ],
  },
  {
    heading: 'Beyond local DRAM',
    sub: 'over a link, on flash, or on the accelerator package',
    cells: [
      {
        name: 'CXL memory',
        pills: [
          { text: 'Host', tone: 'host' },
          { text: 'Over PCIe lanes', tone: 'host' },
        ],
        metrics: [
          { label: 'Bandwidth', value: '64 GB/s per x16 link', note: 'per direction at CXL 2.0; 256 at CXL 4.0' },
          { label: 'Capacity', value: 'Sized by the device or pool', note: 'not by the DIMM slots' },
          { label: 'Latency', value: '~254 ns idle', note: '+110 ns over local DRAM, Samsung' },
        ],
        where: 'CXL 2.0 CPUs; none found on EC2',
        fill: '#fbf3d5',
        stroke: '#8b6c00',
      },
      {
        name: 'NVMe flash (KV-cache tier)',
        pills: [
          { text: 'Host', tone: 'host' },
          { text: 'PCIe or network', tone: 'host' },
        ],
        metrics: [
          { label: 'Bandwidth', value: '1.56-18.75 GB/s per GPU', note: 'EBS to FSx with GDS; store at least 2.25' },
          { label: 'Capacity', value: '30.4 TB per instance', note: '8 x 3,800 GB on an 8-GPU P5en or P6' },
          { label: 'Latency', value: 'No figure located', note: 'AWS rates 4.4 M IOPS at 4 KiB' },
        ],
        where: 'On P5, P5e, P5en, P6-B200, P6-B300',
        fill: '#f2f3f3',
        stroke: '#414d5c',
      },
      {
        name: 'High Bandwidth Flash',
        pills: [
          { text: 'Accelerator package', tone: 'accel' },
          { text: 'Roadmap', tone: 'roadmap' },
        ],
        metrics: [
          { label: 'Bandwidth', value: '0.384-3.072 TB/s per stack', note: 'OCP spec grades; Sandisk Gen 1: 1.6 TB/s' },
          { label: 'Capacity', value: '512 GiB per stack', note: '16-high stack, beside HBM' },
          { label: 'Latency', value: 'Not published', note: 'studies assume 1-20 µs reads' },
        ],
        where: 'No product; samples targeted for 2027',
        fill: '#efe7fb',
        stroke: '#6f4cc4',
        dashed: true,
      },
    ],
  },
];

const NARROW_PX = 560;
const CELL_H = 246;
const HEAD_H = 40;
const font = 'sans-serif';
const ink = '#16191f';
const muted = '#5f6b7a';

const pillStyle: Record<PillTone, { fill: string; stroke: string; text: string }> = {
  host: { fill: '#ffffff', stroke: '#879596', text: '#414d5c' },
  accel: { fill: '#6f4cc4', stroke: '#6f4cc4', text: '#ffffff' },
  roadmap: { fill: '#fbf3d5', stroke: '#8b6c00', text: '#8b6c00' },
};

function pillWidth(text: string) {
  return Math.round(text.length * 6.4 + 18);
}

function CellView({ cell, x, y, w }: { cell: Cell; x: number; y: number; w: number }) {
  const left = x + 14;
  let px = left;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={CELL_H}
        rx={8}
        fill={cell.fill}
        stroke={cell.stroke}
        strokeWidth={cell.dashed ? 2 : 1.5}
        strokeDasharray={cell.dashed ? '7 4' : undefined}
      />
      <text x={left} y={y + 25} fontFamily={font} fontSize={13.5} fontWeight={700} fill={ink}>
        {cell.name}
      </text>
      {cell.pills.map((p) => {
        const pw = pillWidth(p.text);
        const st = pillStyle[p.tone];
        const node = (
          <g key={p.text}>
            <rect x={px} y={y + 35} width={pw} height={19} rx={9.5} fill={st.fill} stroke={st.stroke} strokeWidth={1} />
            <text
              x={px + pw / 2}
              y={y + 48.5}
              fontFamily={font}
              fontSize={10.5}
              fontWeight={600}
              fill={st.text}
              textAnchor="middle"
            >
              {p.text}
            </text>
          </g>
        );
        px += pw + 6;
        return node;
      })}
      {cell.metrics.map((m, i) => {
        const base = y + 76 + i * 50;
        return (
          <g key={m.label}>
            <text x={left} y={base} fontFamily={font} fontSize={10} fontWeight={600} fill={muted}>
              {m.label.toUpperCase()}
            </text>
            <text x={left} y={base + 16} fontFamily={font} fontSize={12.5} fontWeight={600} fill={ink}>
              {m.value}
            </text>
            <text x={left} y={base + 30} fontFamily={font} fontSize={10.5} fill={muted}>
              {m.note}
            </text>
          </g>
        );
      })}
      <line x1={left} y1={y + 216} x2={x + w - 14} y2={y + 216} stroke={cell.stroke} strokeOpacity={0.35} />
      <text x={left} y={y + 234} fontFamily={font} fontSize={11} fontWeight={600} fill={cell.stroke}>
        {cell.where}
      </text>
    </g>
  );
}

function useNarrow(ref: React.RefObject<HTMLDivElement>) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setNarrow(width < NARROW_PX);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return narrow;
}

export function MemoryTechGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);
  const cols = narrow ? 1 : 3;
  const pad = narrow ? 10 : 16;
  const gap = narrow ? 12 : 18;
  const width = narrow ? 320 : 900;
  const cellW = (width - 2 * pad - (cols - 1) * gap) / cols;

  const parts: React.ReactNode[] = [];
  let y = pad;
  rows.forEach((row) => {
    parts.push(
      <g key={row.heading}>
        <text x={pad} y={y + 15} fontFamily={font} fontSize={13} fontWeight={700} fill={ink}>
          {row.heading}
        </text>
        <text x={pad} y={y + 31} fontFamily={font} fontSize={11} fill={muted}>
          {row.sub}
        </text>
      </g>
    );
    y += HEAD_H;
    row.cells.forEach((cell, i) => {
      const col = i % cols;
      const line = Math.floor(i / cols);
      parts.push(
        <CellView
          key={cell.name}
          cell={cell}
          x={pad + col * (cellW + gap)}
          y={y + line * (CELL_H + gap)}
          w={cellW}
        />
      );
    });
    const lines = Math.ceil(row.cells.length / cols);
    y += lines * CELL_H + (lines - 1) * gap + 22;
  });
  const height = y - 22 + pad;

  return (
    <div ref={ref} style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="memory-tech-grid-title"
        style={{ width: '100%', minWidth: narrow ? 0 : 640, height: 'auto', display: 'block' }}
      >
        <title id="memory-tech-grid-title">
          Six places to keep bytes near compute. On the host&apos;s own memory channels: DDR5
          DIMMs at 614 to 845 GB/s per socket, MRDIMMs at 845 to 1,638 GB/s per socket, and
          LPDDR5X at up to 500 GB/s on Grace and 1.2 TB/s on Vera. Beyond local DRAM: CXL memory at
          64 GB/s per x16 link and about 110 ns more per load than local DRAM, NVMe flash at 1.56 to
          18.75 GB/s per GPU with 30.4 TB per instance, and High Bandwidth Flash, a roadmap tier on
          the accelerator package beside HBM rather than on the host, at up to 3.072 TB/s and 512
          GiB per stack.
        </title>
        <rect x={0} y={0} width={width} height={height} rx={8} fill="#ffffff" />
        {parts}
      </svg>
    </div>
  );
}
