import React from 'react';

// Break-even tier bandwidth per 8-GPU node: above a line, fetching a prefix's KV
// from the tier is faster than recomputing it. Every value is our arithmetic
// (research/2026-10-refresh/flash-cache-tier.md, rows M1 to M5) on cited model
// shapes and dense peaks; the dashed lines are AWS per-instance tier rates (A10,
// A11, A14, L2, L3). The section caption carries the citations. Both axes are
// logarithmic and computed here, no charting dependency.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls.

const VB_W = 860;
const VB_H = 460;
const PLOT = { left: 70, right: 580, top: 64, bottom: 404 };
const Y_MIN = 2;
const Y_MAX = 600;

function yOf(v: number): number {
  const span = Math.log10(Y_MAX) - Math.log10(Y_MIN);
  return PLOT.bottom - ((Math.log10(v) - Math.log10(Y_MIN)) / span) * (PLOT.bottom - PLOT.top);
}

// Prefix lengths 1K, 8K, 32K, 128K sit at log2(p / 1K) = 0, 3, 5, 7.
const PREFIXES = [
  { label: '1K', k: 0 },
  { label: '8K', k: 3 },
  { label: '32K', k: 5 },
  { label: '128K', k: 7 },
];
function xOf(k: number): number {
  return PLOT.left + 25 + (k / 7) * (PLOT.right - PLOT.left - 45);
}

interface Series {
  label: string;
  color: string;
  width: number;
  values: [number, number, number, number];
}

const SERIES: Series[] = [
  { label: 'Llama 3.1 70B, 8x H100, BF16', color: '#0972d3', width: 3, values: [18.2, 17.1, 14.1, 8.3] },
  {
    label: 'Llama 3.1 70B, 8x B200, FP8 compute, BF16 KV',
    color: '#6f4cc4',
    width: 2,
    values: [82.8, 77.7, 64.1, 37.7],
  },
  { label: 'Qwen3-235B-A22B (MoE), 8x H200, FP8', color: '#ec7211', width: 2, values: [66.9, 53.8, 32.3, 12.4] },
  { label: 'DeepSeek-V3 (MLA), 8x H200, FP8', color: '#1f7a70', width: 2, values: [14.5, 11.8, 7.1, 2.8] },
];

const BANDS = [
  { label: 'Host DRAM, 8 x PCIe Gen5 x16: 512', v: 512, dy: 0 },
  { label: 'EFA, 3,200 Gb/s per instance: 400', v: 400, dy: 7 },
  { label: 'FSx for Lustre, EFA + GDS: 150', v: 150, dy: 4 },
  { label: 'Instance store, 4 KiB floor: 18.0', v: 18.0, dy: 4 },
  { label: 'EBS per-instance cap: 12.5', v: 12.5, dy: 4 },
];

const TICKS = [2, 5, 10, 20, 50, 100, 200, 500];

export function FlashBreakEvenChart() {
  const legend = [
    { s: SERIES[0], x: 20, y: 24 },
    { s: SERIES[1], x: 440, y: 24 },
    { s: SERIES[2], x: 20, y: 44 },
    { s: SERIES[3], x: 440, y: 44 },
  ];
  const hit = { x: xOf(3), y: yOf(17.1) };
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="flash-breakeven-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="flash-breakeven-title">
          Break-even tier bandwidth per 8-GPU node, above which reading a prefix&apos;s KV cache
          beats recomputing it. A dense Llama 3.1 70B on 8x H100 at BF16 peak needs 17.1 GB/s at
          an 8K prefix, level with the instance store&apos;s 18 GB/s floor; the same model on 8x
          B200 at FP8 needs 77.7 GB/s, and every line falls as the prefix grows.
        </title>
        <style>{`
          .fbe-tick { fill: #414d5c; font: 12px sans-serif; }
          .fbe-axis { fill: #16191f; font: 600 12px sans-serif; }
          .fbe-leg { fill: #16191f; font: 12px sans-serif; }
          .fbe-band { fill: #414d5c; font: 11px sans-serif; }
          .fbe-note { fill: #5f6b7a; font: 11px sans-serif; }
          .fbe-call { fill: #065299; font: 600 12px sans-serif; }
          .fbe-call2 { fill: #065299; font: 12px sans-serif; }
        `}</style>
        <rect x="0" y="0" width={VB_W} height={VB_H} rx="8" fill="#ffffff" stroke="#e9ebed" />

        {legend.map(({ s, x, y }) => (
          <g key={s.label}>
            <line x1={x} y1={y - 4} x2={x + 24} y2={y - 4} stroke={s.color} strokeWidth={s.width + 1} />
            <text className="fbe-leg" x={x + 30} y={y}>
              {s.label}
            </text>
          </g>
        ))}

        <rect
          x={PLOT.left}
          y={PLOT.top}
          width={PLOT.right - PLOT.left}
          height={PLOT.bottom - PLOT.top}
          fill="#fafbfc"
          stroke="#d1d5db"
        />
        <text className="fbe-axis" x="8" y="58">
          GB/s per node
        </text>
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={PLOT.left} y1={yOf(t)} x2={PLOT.right} y2={yOf(t)} stroke="#e9ebed" />
            <text className="fbe-tick" x={PLOT.left - 8} y={yOf(t) + 4} textAnchor="end">
              {t}
            </text>
          </g>
        ))}

        {BANDS.map((b) => (
          <g key={b.label}>
            <line
              x1={PLOT.left}
              y1={yOf(b.v)}
              x2={PLOT.right + 4}
              y2={yOf(b.v)}
              stroke="#5f6b7a"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text className="fbe-band" x={PLOT.right + 10} y={yOf(b.v) + b.dy}>
              {b.label}
            </text>
          </g>
        ))}

        {SERIES.map((s) => (
          <g key={s.label}>
            <polyline
              points={s.values.map((v, i) => `${xOf(PREFIXES[i].k)},${yOf(v)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width}
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={xOf(PREFIXES[i].k)} cy={yOf(v)} r="3.5" fill={s.color} />
            ))}
          </g>
        ))}

        <circle cx={hit.x} cy={hit.y} r="8" fill="none" stroke="#065299" strokeWidth="1.5" />
        <text className="fbe-call" x={hit.x - 10} y={240} textAnchor="end">
          Dense 70B on 8x H100:
        </text>
        <text className="fbe-call2" x={hit.x - 10} y={256} textAnchor="end">
          17.1 GB/s at 8K, 2.1 per GPU
        </text>

        <line x1={PLOT.left} y1={PLOT.bottom} x2={PLOT.right} y2={PLOT.bottom} stroke="#414d5c" />
        {PREFIXES.map((p) => (
          <g key={p.label}>
            <line x1={xOf(p.k)} y1={PLOT.bottom} x2={xOf(p.k)} y2={PLOT.bottom + 5} stroke="#414d5c" />
            <text className="fbe-tick" x={xOf(p.k)} y={PLOT.bottom + 20} textAnchor="middle">
              {p.label}
            </text>
          </g>
        ))}
        <text className="fbe-axis" x={(PLOT.left + PLOT.right) / 2} y={PLOT.bottom + 44} textAnchor="middle">
          Prefix length in tokens (log scale)
        </text>

        <text className="fbe-note" x={PLOT.right + 10} y="350">
          Lines assume 100% of dense peak.
        </text>
        <text className="fbe-note" x={PLOT.right + 10} y="366">
          At 50% MFU every line halves.
        </text>
        <text className="fbe-note" x={PLOT.right + 10} y="382">
          Divide by 8 for GB/s per GPU.
        </text>
      </svg>
    </div>
  );
}
