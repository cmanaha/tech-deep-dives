import React from 'react';

// Tick-to-trade pipeline drawn as two lanes: the network stack owns the way in
// (stages 1 and 2) and the way out (stages 6 and 7); the silicon and memory
// this dive covers own the middle (stages 3 to 5). No latency budgets are
// drawn: no per-stage measurement was sourced for this page.

interface Stage {
  num: number;
  title: string;
  lines: string[];
  x: number;
  y: number;
  w: number;
  fill: string;
  stroke: string;
}

const VB_W = 760;
const VB_H = 320;
const TOP_Y = 42;
const BOTTOM_Y = 188;
const BOX_H = 88;
const TOP_W = 164;
const BOTTOM_W = 200;

const NET_FILL = '#f2f8fd';
const NET_STROKE = '#0972d3';
const MEM_FILL = '#fdf3ec';
const MEM_STROKE = '#ec7211';
const DECIDE_FILL = '#ecf7ec';
const DECIDE_STROKE = '#037f0c';

const stages: Stage[] = [
  {
    num: 1,
    title: 'Tick arrives',
    lines: ['Multicast UDP feed', 'from the exchange'],
    x: 16,
    y: TOP_Y,
    w: TOP_W,
    fill: NET_FILL,
    stroke: NET_STROKE,
  },
  {
    num: 2,
    title: 'OS-bypass receive',
    lines: ['Onload, ef_vi or DPDK', 'hands it to user space'],
    x: 196,
    y: TOP_Y,
    w: TOP_W,
    fill: NET_FILL,
    stroke: NET_STROKE,
  },
  {
    num: 3,
    title: 'Decode and book update',
    lines: ['Book state updated in', 'place; keep it in cache'],
    x: 56,
    y: BOTTOM_Y,
    w: BOTTOM_W,
    fill: MEM_FILL,
    stroke: MEM_STROKE,
  },
  {
    num: 4,
    title: 'Strategy or inference',
    lines: ['Decision logic on the', 'CPU, its matrix units', 'or an accelerator'],
    x: 280,
    y: BOTTOM_Y,
    w: BOTTOM_W,
    fill: DECIDE_FILL,
    stroke: DECIDE_STROKE,
  },
  {
    num: 5,
    title: 'Order and risk check',
    lines: ['Build the outgoing', 'message and run the', 'pre-trade risk check'],
    x: 504,
    y: BOTTOM_Y,
    w: BOTTOM_W,
    fill: MEM_FILL,
    stroke: MEM_STROKE,
  },
  {
    num: 6,
    title: 'OS-bypass send',
    lines: ['Write straight to the', 'NIC transmit ring'],
    x: 400,
    y: TOP_Y,
    w: TOP_W,
    fill: NET_FILL,
    stroke: NET_STROKE,
  },
  {
    num: 7,
    title: 'Order on the wire',
    lines: ['Through the colo', 'switch to the exchange'],
    x: 580,
    y: TOP_Y,
    w: TOP_W,
    fill: NET_FILL,
    stroke: NET_STROKE,
  },
];

const byNum = (n: number) => stages.find((s) => s.num === n) as Stage;
const cx = (s: Stage) => s.x + s.w / 2;

// Corridor between the two lanes, used by the elbow connectors.
const CORRIDOR_Y = 159;

export function TickToTradeDiagram() {
  const s2 = byNum(2);
  const s3 = byNum(3);
  const s5 = byNum(5);
  const s6 = byNum(6);
  const straight: Array<[number, number]> = [
    [1, 2],
    [3, 4],
    [4, 5],
    [6, 7],
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="tick-to-trade-title"
        style={{
          width: '100%',
          minWidth: 640,
          height: 'auto',
          display: 'block',
        }}
      >
        <title id="tick-to-trade-title">
          Tick-to-trade runs through seven stages. The network stack owns the way in and the way
          out: the tick arrives as a multicast UDP feed, a kernel-bypass library such as Onload,
          ef_vi or DPDK hands it to user space, and the order leaves through the NIC transmit ring.
          The three middle stages, updating the order book, running the strategy or model, and
          building the order with its risk check, run on the CPU, caches and memory this deep dive
          covers.
        </title>
        <defs>
          <marker
            id="ttt-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#414d5c" />
          </marker>
        </defs>
        <style>{`
          .ttt-band-net { fill: #f7fafd; stroke: #b6cfe8; stroke-width: 1; stroke-dasharray: 5 4; }
          .ttt-band-mem { fill: #fffaf5; stroke: #f2c9a6; stroke-width: 1; stroke-dasharray: 5 4; }
          .ttt-lane { font: 600 11px sans-serif; }
          .ttt-num { fill: #ffffff; font: 700 11px sans-serif; text-anchor: middle; }
          .ttt-title { fill: #16191f; font: 600 12px sans-serif; }
          .ttt-line { fill: #414d5c; font: 11px sans-serif; }
          .ttt-arrow { stroke: #414d5c; stroke-width: 1.5; fill: none; marker-end: url(#ttt-ah); }
        `}</style>

        <rect x={0} y={0} width={VB_W} height={VB_H} rx={8} fill="#ffffff" stroke="#e9ebed" />

        <rect className="ttt-band-net" x={8} y={10} width={VB_W - 16} height={132} rx={8} />
        <text className="ttt-lane" x={20} y={30} fill="#065299">
          NETWORK STACK: stages 1, 2, 6 and 7
        </text>

        <rect className="ttt-band-mem" x={8} y={176} width={VB_W - 16} height={136} rx={8} />
        <text className="ttt-lane" x={20} y={300} fill="#8a4b0f">
          SILICON AND MEMORY: stages 3, 4 and 5, the subject of this deep dive
        </text>

        {stages.map((s) => (
          <g key={s.num}>
            <rect
              x={s.x}
              y={s.y}
              width={s.w}
              height={BOX_H}
              rx={6}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={1.5}
            />
            <circle cx={s.x + 16} cy={s.y + 18} r={10} fill={s.stroke} />
            <text className="ttt-num" x={s.x + 16} y={s.y + 22}>
              {s.num}
            </text>
            <text className="ttt-title" x={s.x + 32} y={s.y + 22}>
              {s.title}
            </text>
            {s.lines.map((line, i) => (
              <text key={line} className="ttt-line" x={s.x + 12} y={s.y + 46 + i * 16}>
                {line}
              </text>
            ))}
          </g>
        ))}

        {straight.map(([a, b]) => {
          const from = byNum(a);
          const to = byNum(b);
          const y = from.y + BOX_H / 2;
          return (
            <line
              key={`${a}-${b}`}
              className="ttt-arrow"
              x1={from.x + from.w}
              y1={y}
              x2={to.x - 1}
              y2={y}
            />
          );
        })}

        <path
          className="ttt-arrow"
          d={`M ${cx(s2)} ${s2.y + BOX_H} V ${CORRIDOR_Y} H ${cx(s3)} V ${s3.y - 1}`}
        />
        <path
          className="ttt-arrow"
          d={`M ${cx(s5)} ${s5.y} V ${CORRIDOR_Y} H ${cx(s6)} V ${s6.y + BOX_H + 1}`}
        />
      </svg>
    </div>
  );
}
