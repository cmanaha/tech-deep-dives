import React from 'react';

interface Tier {
  label: string;
  bandwidth: string;
  capacity: string;
  latency: string;
  color: string;
  border: string;
}

const tiers: Tier[] = [
  {
    label: '1. Register file',
    bandwidth: 'effectively free',
    capacity: 'KBs',
    latency: '< 1 cycle',
    color: '#f2f8fd',
    border: '#0972d3',
  },
  {
    label: '2. SRAM scratchpad  (SMEM, TMEM, SBUF, PSUM)',
    bandwidth: '10s of TB/s / engine',
    capacity: '100s of KB',
    latency: '~a few ns',
    color: '#ecf7ec',
    border: '#037f0c',
  },
  {
    label: '3. L1 cache',
    bandwidth: '~100s GB/s / core',
    capacity: '~48-64 KB',
    latency: '4-5 cycles',
    color: '#ecf7ec',
    border: '#037f0c',
  },
  {
    label: '4. L2 cache',
    bandwidth: 'TB/s aggregate',
    capacity: 'MB/core or chip-wide (GPU)',
    latency: '~12-20 cycles',
    color: '#ecf7ec',
    border: '#037f0c',
  },
  {
    label: '5. LLC / L3',
    bandwidth: '100s GB/s',
    capacity: '100-500 MB',
    latency: '~30-100 cycles',
    color: '#fdf3ec',
    border: '#ec7211',
  },
  {
    label: '6. HBM or main DRAM',
    bandwidth: '3-5 TB/s (HBM) / 400 GB/s-class (DDR)',
    capacity: '10s of GB (HBM) - TBs (DDR)',
    latency: '~200-400 cycles',
    color: '#fdf3ec',
    border: '#ec7211',
  },
  {
    label: '7. Disaggregated (CXL, NVLink-remote, NeuronCore neighbor)',
    bandwidth: '10s-100s GB/s',
    capacity: 'TBs',
    latency: '~1-3 μs',
    color: '#fce7e7',
    border: '#d91515',
  },
];

export function MemoryHierarchyTower() {
  const rowH = 52;
  const rowGap = 8;
  const width = 720;
  const height = tiers.length * (rowH + rowGap) + 30;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Seven-tier memory hierarchy from register file at the top to disaggregated memory at the bottom, with per-tier bandwidth, capacity, and latency"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        {tiers.map((t, i) => {
          const y = 15 + i * (rowH + rowGap);
          // Tier width shrinks as we go down — a pyramid sized by the relative speed
          const tierW = 660 - i * 60;
          const x = (width - tierW) / 2;
          return (
            <g key={t.label}>
              <rect
                x={x}
                y={y}
                width={tierW}
                height={rowH}
                rx={6}
                fill={t.color}
                stroke={t.border}
                strokeWidth={2}
              />
              <text
                x={x + 14}
                y={y + 20}
                fontSize={13}
                fontWeight={700}
                fill="#16191f"
              >
                {t.label}
              </text>
              <text
                x={x + 14}
                y={y + 38}
                fontSize={11}
                fill="#687078"
              >
                {`${t.bandwidth}  •  ${t.capacity}  •  ${t.latency}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
