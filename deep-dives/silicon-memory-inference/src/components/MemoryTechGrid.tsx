import React from 'react';

interface Tech {
  name: string;
  bw: string;
  capacity: string;
  latency: string;
  useCase: string;
  fill: string;
  border: string;
}

const techs: Tech[] = [
  {
    name: 'DDR5 RDIMM',
    bw: '~50 GB/s per channel @ DDR5-6400',
    capacity: 'Up to 6 TB per socket',
    latency: '~80-130 ns local',
    useCase: 'General server workloads, host memory',
    fill: '#f2f8fd',
    border: '#0972d3',
  },
  {
    name: 'MRDIMM (DDR5-8800)',
    bw: '~70 GB/s per channel — 1.37× DDR5-6400',
    capacity: 'Up to 3 TB per socket (Xeon 6 6900P)',
    latency: '~80-110 ns local',
    useCase: 'Bandwidth-hungry server (Xeon 6 only)',
    fill: '#ecf7ec',
    border: '#037f0c',
  },
  {
    name: 'LPDDR5X',
    bw: '~500 GB/s per package (NVIDIA Grace)',
    capacity: '480 GB per Grace CPU',
    latency: '~150-200 ns',
    useCase: 'Mobile / power-constrained / Grace-class',
    fill: '#fdf3ec',
    border: '#ec7211',
  },
  {
    name: 'CXL 2.0 / 3.0',
    bw: '~64 GB/s per x16 link (PCIe 5.0)',
    capacity: 'TBs via pooled / shared memory',
    latency: '~200-400 ns over the link',
    useCase: 'Capacity expansion, memory pooling',
    fill: '#fce7e7',
    border: '#d91515',
  },
];

export function MemoryTechGrid() {
  const width = 880;
  const colW = (width - 40) / 4;
  const boxH = 220;
  const height = boxH + 50;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Memory technology comparison: DDR5, MRDIMM, LPDDR5X, CXL with bandwidth, capacity, latency, and use case"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          Main-memory technologies side-by-side — tier 6 (DRAM) and tier 7 (CXL)
        </text>
        {techs.map((t, i) => {
          const x = 20 + i * colW;
          return (
            <g key={t.name}>
              <rect
                x={x + 6}
                y={42}
                width={colW - 12}
                height={boxH}
                rx={6}
                fill={t.fill}
                stroke={t.border}
                strokeWidth={2}
              />
              <text x={x + 16} y={66} fontSize={13} fontWeight={700} fill="#16191f">
                {t.name}
              </text>
              <text x={x + 16} y={94} fontSize={10} fontWeight={600} fill="#687078">
                Peak bandwidth
              </text>
              <text x={x + 16} y={108} fontSize={11} fill="#16191f">
                {t.bw}
              </text>
              <text x={x + 16} y={134} fontSize={10} fontWeight={600} fill="#687078">
                Capacity
              </text>
              <text x={x + 16} y={148} fontSize={11} fill="#16191f">
                {t.capacity}
              </text>
              <text x={x + 16} y={174} fontSize={10} fontWeight={600} fill="#687078">
                Latency
              </text>
              <text x={x + 16} y={188} fontSize={11} fill="#16191f">
                {t.latency}
              </text>
              <text x={x + 16} y={214} fontSize={10} fontWeight={600} fill="#687078">
                Use case
              </text>
              <text x={x + 16} y={228} fontSize={11} fill={t.border}>
                {t.useCase}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
