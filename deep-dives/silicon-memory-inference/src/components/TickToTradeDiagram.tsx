import React from 'react';

// Tick-to-trade latency budget diagram. Shows the path from market tick arrival
// at the NIC through OS-bypass receive, strategy / inference, order generation,
// and out the wire — with rough latency budgets at each stage.

interface Stage {
  num: number;
  name: string;
  detail: string;
  budget: string;
  fill: string;
  border: string;
}

const stages: Stage[] = [
  { num: 1, name: 'Tick arrives at NIC', detail: 'Multicast UDP from exchange feed handler', budget: '~hundreds of ns', fill: '#f2f8fd', border: '#0972d3' },
  { num: 2, name: 'OS-bypass receive', detail: 'Solarflare / EFA / DPDK lifts directly to user space', budget: '~hundreds of ns', fill: '#f2f8fd', border: '#0972d3' },
  { num: 3, name: 'Decode + book update', detail: 'Order book state updated; cache-resident', budget: '~µs', fill: '#fdf3ec', border: '#ec7211' },
  { num: 4, name: 'Strategy / inference', detail: 'Decision logic; may include AMX or accelerator inference', budget: '~µs to 10s of µs', fill: '#ecf7ec', border: '#037f0c' },
  { num: 5, name: 'Order generation', detail: 'Build outgoing message; risk check', budget: '~hundreds of ns', fill: '#fdf3ec', border: '#ec7211' },
  { num: 6, name: 'OS-bypass send', detail: 'Write directly to NIC TX ring', budget: '~hundreds of ns', fill: '#f2f8fd', border: '#0972d3' },
  { num: 7, name: 'Order on the wire', detail: 'Out to colo switch and exchange', budget: '~hundreds of ns', fill: '#f2f8fd', border: '#0972d3' },
];

export function TickToTradeDiagram() {
  const width = 920;
  const height = 360;
  const margin = { top: 50, left: 30, right: 30, bottom: 30 };
  const lane = (width - margin.left - margin.right) / stages.length;
  const laneInset = 8;
  const boxW = lane - laneInset * 2;
  const boxH = 240;
  const yBox = margin.top + 20;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Tick-to-trade latency pipeline: market tick arrives at NIC, OS-bypass receive, decode and book update, strategy or inference, order generation, OS-bypass send, order on the wire"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={margin.left} y={20} fontSize={13} fontWeight={700} fill="#16191f">
          Tick-to-trade pipeline — where every nanosecond is fought for
        </text>
        <text x={margin.left} y={36} fontSize={11} fill="#687078">
          The full HFT round trip is in the low microseconds. Memory-architecture choices land squarely on stages 3 and 4.
        </text>

        {stages.map((s, i) => {
          const x = margin.left + i * lane + laneInset;
          return (
            <g key={s.num}>
              <rect x={x} y={yBox} width={boxW} height={boxH} rx={6} fill={s.fill} stroke={s.border} strokeWidth={2} />
              <circle cx={x + 14} cy={yBox + 16} r={11} fill={s.border} />
              <text x={x + 14} y={yBox + 20} fontSize={11} fontWeight={700} fill="#ffffff" textAnchor="middle">
                {s.num}
              </text>
              <text x={x + 32} y={yBox + 20} fontSize={11} fontWeight={700} fill="#16191f">
                {s.name}
              </text>
              <text x={x + 8} y={yBox + 56} fontSize={10} fontWeight={600} fill="#16191f">
                What happens
              </text>
              <text x={x + 8} y={yBox + 72} fontSize={10} fill="#16191f">
                {s.detail.split('\n').map((line, idx) => (
                  <tspan key={idx} x={x + 8} dy={idx === 0 ? 0 : 12}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text x={x + 8} y={yBox + 130} fontSize={10} fontWeight={600} fill="#16191f">
                Latency budget
              </text>
              <text x={x + 8} y={yBox + 148} fontSize={11} fontWeight={700} fill={s.border}>
                {s.budget}
              </text>
            </g>
          );
        })}

        {/* Arrows between stages */}
        {stages.slice(0, -1).map((_, i) => {
          const x1 = margin.left + (i + 1) * lane - laneInset;
          const x2 = margin.left + (i + 1) * lane + laneInset;
          const y = yBox + boxH / 2;
          return (
            <g key={`arrow-${i}`}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="#16191f" strokeWidth={1.5} />
              <polygon points={`${x2},${y} ${x2 - 5},${y - 4} ${x2 - 5},${y + 4}`} fill="#16191f" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
