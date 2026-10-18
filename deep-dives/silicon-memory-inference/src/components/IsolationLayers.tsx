import React from 'react';

// Three isolation boundaries compared: NIE on Graviton5 hosts, MIG on NVIDIA GPUs, and
// the Neuron runtime's NeuronCore reservation on Trainium. Each column answers the same
// five questions. Every figure drawn here is cited in the caption the section renders
// below the SVG (NIE white paper and blog, MIG user guide, NVIDIA confidential-computing
// white paper, Neuron runtime configuration guide).
//
// Wide: on a phone the svg keeps a 640 px minimum width and the wrapper scrolls
// sideways, so labels keep their size instead of shrinking.

interface Column {
  title: string;
  subtitle: string;
  stroke: string;
  fill: string;
  rows: [string, string[]][];
}

const columns: Column[] = [
  {
    title: 'Host: NIE',
    subtitle: 'Nitro Isolation Engine',
    stroke: '#0972d3',
    fill: '#f2f8fd',
    rows: [
      ['Separates', ['Virtual machines on one host']],
      ['Enforced by', ['NIE alone at the highest', 'privilege level; policy below it']],
      ['Where', ['Every Graviton5 instance;', 'generally available June 2026']],
      ['Evidence', ['Isabelle/HOL proof, about', '330,000 lines']],
      ['Outside it', ['Micro-architectural side', 'channels; scheduling']],
    ],
  },
  {
    title: 'GPU: MIG',
    subtitle: 'Multi-Instance GPU on NVIDIA',
    stroke: '#037f0c',
    fill: '#ecf7ec',
    rows: [
      ['Separates', ['GPU instances on one GPU']],
      ['Enforced by', ['Hardware partition of compute,', 'cache, memory and bandwidth']],
      ['Where', ['Up to 7 per GPU; 4 or 2 on', 'RTX PRO Blackwell']],
      ['Evidence', ['The MIG layout configured', 'on the GPU']],
      ['Outside it', ['Encryption: confidential', 'computing takes whole GPUs']],
    ],
  },
  {
    title: 'Trainium: NeuronCores',
    subtitle: 'Neuron runtime reservation',
    stroke: '#ec7211',
    fill: '#fdf3ec',
    rows: [
      ['Separates', ['Processes, per NeuronCore']],
      ['Enforced by', ['Runtime gives each core to one', 'process; the compiler places data']],
      ['Where', ['Cores chosen per process with', 'NEURON_RT_VISIBLE_CORES']],
      ['Evidence', ['The core assignment of each', 'process']],
      ['Outside it', ['Chip memory bandwidth: no', 'per-core split found']],
    ],
  },
];

const VB_W = 880;
const VB_H = 412;
const COL_W = 266;
const GAP = 21;
const X0 = 20;
const TOP = 16;
const ROW0 = 96;
const ROW_H = 62;

export function IsolationLayers() {
  const font = 'sans-serif';
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="isolation-layers-title"
        style={{
          width: '100%',
          minWidth: 640,
          height: 'auto',
          display: 'block',
        }}
      >
        <title id="isolation-layers-title">
          Three isolation boundaries compared. NIE separates virtual machines on Graviton5 hosts and
          carries an Isabelle/HOL proof that leaves micro-architectural side channels and scheduling
          outside it. MIG splits one NVIDIA GPU into up to seven hardware partitions with their own
          compute, memory and bandwidth; encryption comes from confidential computing, which takes
          whole GPUs. On Trainium the Neuron runtime reserves each NeuronCore for one process, while
          the chip&apos;s memory bandwidth has no published per-core split.
        </title>
        <rect x={0} y={0} width={VB_W} height={VB_H} rx={8} fill="#ffffff" />
        {columns.map((col, ci) => {
          const x = X0 + ci * (COL_W + GAP);
          const tx = x + 16;
          return (
            <g key={col.title}>
              <rect
                x={x}
                y={TOP}
                width={COL_W}
                height={VB_H - TOP - 16}
                rx={10}
                fill={col.fill}
                stroke={col.stroke}
                strokeWidth={2}
              />
              <text
                x={tx}
                y={TOP + 26}
                fontSize={14}
                fontWeight={700}
                fill={col.stroke}
                fontFamily={font}
              >
                {col.title}
              </text>
              <text x={tx} y={TOP + 45} fontSize={11} fill="#5f6b7a" fontFamily={font}>
                {col.subtitle}
              </text>
              <line
                x1={x + 12}
                y1={TOP + 60}
                x2={x + COL_W - 12}
                y2={TOP + 60}
                stroke={col.stroke}
                strokeOpacity={0.4}
              />
              {col.rows.map(([label, lines], ri) => {
                const y = ROW0 + ri * ROW_H;
                const outside = label === 'Outside it';
                return (
                  <g key={label}>
                    <text
                      x={tx}
                      y={y}
                      fontSize={11}
                      fontWeight={700}
                      fill={outside ? '#8b6c00' : '#414d5c'}
                      fontFamily={font}
                    >
                      {label}
                    </text>
                    {lines.map((line, li) => (
                      <text
                        key={line}
                        x={tx}
                        y={y + 17 + li * 16}
                        fontSize={11}
                        fill="#16191f"
                        fontFamily={font}
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
