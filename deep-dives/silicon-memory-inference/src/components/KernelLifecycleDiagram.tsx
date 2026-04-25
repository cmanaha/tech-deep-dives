import React from 'react';

// Horizontal timeline of a single kernel invocation. Seven stages, each annotated
// with the silicon component responsible and the memory tier touched.

interface Stage {
  num: number;
  name: string;
  who: string;
  tier: string;
  scale: string;
  fill: string;
  border: string;
}

const stages: Stage[] = [
  {
    num: 1,
    name: 'Host issue',
    who: 'Python / PyTorch / framework',
    tier: 'Host DRAM, host L1/L2/L3',
    scale: '~µs',
    fill: '#f2f8fd',
    border: '#0972d3',
  },
  {
    num: 2,
    name: 'Driver submit',
    who: 'CUDA / Neuron / oneDNN driver',
    tier: 'Pinned host memory, PCIe',
    scale: '~µs',
    fill: '#f2f8fd',
    border: '#0972d3',
  },
  {
    num: 3,
    name: 'Device dispatch',
    who: 'GPU front-end / NeuronCore',
    tier: 'On-device queue (SRAM)',
    scale: '~10s of ns',
    fill: '#fdf3ec',
    border: '#ec7211',
  },
  {
    num: 4,
    name: 'SM / core scheduling',
    who: 'Warp scheduler / wave launcher',
    tier: 'Register file (tier 1)',
    scale: '~ns',
    fill: '#fdf3ec',
    border: '#ec7211',
  },
  {
    num: 5,
    name: 'Operand staging',
    who: 'Async copy, TMA, DMA, SBUF load',
    tier: 'SMEM / TMEM / SBUF (tier 2)',
    scale: '~10s of ns',
    fill: '#ecf7ec',
    border: '#037f0c',
  },
  {
    num: 6,
    name: 'Functional unit fires',
    who: 'Tensor core / systolic array / AMX',
    tier: 'Register tier — operand pulled in',
    scale: '~ns per op',
    fill: '#ecf7ec',
    border: '#037f0c',
  },
  {
    num: 7,
    name: 'Retire & return',
    who: 'Write-back, completion event',
    tier: 'SMEM → HBM → host (on demand)',
    scale: '~10s of ns to µs',
    fill: '#fce7e7',
    border: '#d91515',
  },
];

export function KernelLifecycleDiagram() {
  const width = 1240;
  const height = 360;
  const margin = { top: 50, left: 30, right: 30, bottom: 30 };
  const lane = (width - margin.left - margin.right) / stages.length;
  const laneInset = 8;
  const boxW = lane - laneInset * 2;
  const boxH = 230;
  const yBox = margin.top + 20;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Kernel execution lifecycle: seven stages from host issue through driver submit, device dispatch, SM scheduling, operand staging, functional unit firing, and retire/return"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={margin.left} y={20} fontSize={13} fontWeight={700} fill="#16191f">
          Kernel execution lifecycle — host issue → tensor core retire
        </text>
        <text x={margin.left} y={36} fontSize={11} fill="#687078">
          Time progresses left to right. Each stage shows the silicon component and the memory tier it touches.
        </text>

        {stages.map((s, i) => {
          const x = margin.left + i * lane + laneInset;
          return (
            <g key={s.num}>
              <rect
                x={x}
                y={yBox}
                width={boxW}
                height={boxH}
                rx={6}
                fill={s.fill}
                stroke={s.border}
                strokeWidth={2}
              />
              <circle cx={x + 14} cy={yBox + 16} r={11} fill={s.border} />
              <text
                x={x + 14}
                y={yBox + 20}
                fontSize={11}
                fontWeight={700}
                fill="#ffffff"
                textAnchor="middle"
              >
                {s.num}
              </text>
              <text x={x + 32} y={yBox + 20} fontSize={12} fontWeight={700} fill="#16191f">
                {s.name}
              </text>
              <text
                x={x + 8}
                y={yBox + 50}
                fontSize={10}
                fontWeight={600}
                fill="#16191f"
              >
                Who:
              </text>
              <text x={x + 8} y={yBox + 64} fontSize={10} fill="#16191f">
                {s.who}
              </text>
              <text
                x={x + 8}
                y={yBox + 100}
                fontSize={10}
                fontWeight={600}
                fill="#16191f"
              >
                Memory tier:
              </text>
              <text x={x + 8} y={yBox + 114} fontSize={10} fill="#16191f">
                {s.tier}
              </text>
              <text
                x={x + 8}
                y={yBox + 150}
                fontSize={10}
                fontWeight={600}
                fill="#16191f"
              >
                Scale:
              </text>
              <text x={x + 8} y={yBox + 164} fontSize={11} fontWeight={700} fill={s.border}>
                {s.scale}
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
              <polygon
                points={`${x2},${y} ${x2 - 5},${y - 4} ${x2 - 5},${y + 4}`}
                fill="#16191f"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
