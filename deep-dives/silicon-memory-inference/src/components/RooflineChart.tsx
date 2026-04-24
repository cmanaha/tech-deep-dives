import React from 'react';

// Ridge-point coordinates plotted on a log-log-ish axis. The x-axis is FLOPs/byte
// (arithmetic intensity), y-axis is TFLOPS. We use a schematic projection rather than
// real log math because the purpose is to orient the reader, not to replace a profiler.

interface RooflinePoint {
  x: number; // horizontal position (0-100 schematic units)
  label: string;
  color: string;
  description: string;
}

const points: RooflinePoint[] = [
  { x: 6, label: 'Decode (batch 1)', color: '#d91515', description: '~2 FLOPs/byte' },
  { x: 20, label: 'Decode (batch 64)', color: '#ec7211', description: '~128 FLOPs/byte' },
  { x: 55, label: 'Prefill (long prompt)', color: '#037f0c', description: 'near ridge' },
  { x: 78, label: 'Dense GEMM (large tiles)', color: '#0972d3', description: 'compute-bound' },
];

export function RooflineChart() {
  const width = 680;
  const height = 340;
  const margin = { top: 20, right: 20, bottom: 50, left: 70 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  // Ridge-point x position on the schematic x-axis (roughly 65/100 for H200 BF16 ~412 FLOPs/byte)
  const ridgeX = 65;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Roofline model schematic: memory-bound slope on the left, compute-bound ceiling on the right, with example workloads placed along the arithmetic-intensity axis"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        {/* Plot area background */}
        <rect
          x={margin.left}
          y={margin.top}
          width={plotW}
          height={plotH}
          fill="#fafbfc"
        />

        {/* Memory-bound slope (diagonal line from bottom-left to ridge) */}
        <line
          x1={margin.left}
          y1={margin.top + plotH}
          x2={margin.left + (plotW * ridgeX) / 100}
          y2={margin.top + plotH * 0.2}
          stroke="#d91515"
          strokeWidth={3}
        />

        {/* Compute-bound ceiling (horizontal from ridge to right) */}
        <line
          x1={margin.left + (plotW * ridgeX) / 100}
          y1={margin.top + plotH * 0.2}
          x2={margin.left + plotW}
          y2={margin.top + plotH * 0.2}
          stroke="#0972d3"
          strokeWidth={3}
        />

        {/* Ridge-point marker */}
        <circle
          cx={margin.left + (plotW * ridgeX) / 100}
          cy={margin.top + plotH * 0.2}
          r={6}
          fill="#232f3e"
        />
        <text
          x={margin.left + (plotW * ridgeX) / 100 + 12}
          y={margin.top + plotH * 0.2 + 4}
          fontSize={12}
          fontWeight={700}
          fill="#232f3e"
        >
          Ridge point
        </text>

        {/* Labels on the slopes */}
        <text
          x={margin.left + plotW * 0.2}
          y={margin.top + plotH * 0.55}
          fontSize={12}
          fontWeight={600}
          fill="#d91515"
          transform={`rotate(-28 ${margin.left + plotW * 0.2},${margin.top + plotH * 0.55})`}
        >
          memory-bound slope = peak bandwidth × intensity
        </text>
        <text
          x={margin.left + plotW * 0.78}
          y={margin.top + plotH * 0.15}
          fontSize={12}
          fontWeight={600}
          fill="#0972d3"
          textAnchor="middle"
        >
          compute-bound ceiling = peak FLOPs
        </text>

        {/* Workload markers */}
        {points.map((p) => {
          const cx = margin.left + (plotW * p.x) / 100;
          // y follows the relevant roofline curve
          const isBelow = p.x < ridgeX;
          const cy = isBelow
            ? margin.top + plotH - (plotH * 0.8 * p.x) / ridgeX
            : margin.top + plotH * 0.2;
          return (
            <g key={p.label}>
              <circle cx={cx} cy={cy} r={7} fill={p.color} stroke="#ffffff" strokeWidth={2} />
              <text
                x={cx}
                y={cy - 12}
                fontSize={11}
                fontWeight={600}
                fill="#16191f"
                textAnchor="middle"
              >
                {p.label}
              </text>
              <text
                x={cx}
                y={cy + 22}
                fontSize={10}
                fill="#687078"
                textAnchor="middle"
              >
                {p.description}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top + plotH}
          x2={margin.left + plotW}
          y2={margin.top + plotH}
          stroke="#16191f"
          strokeWidth={1.5}
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + plotH}
          stroke="#16191f"
          strokeWidth={1.5}
        />

        {/* Axis labels */}
        <text
          x={margin.left + plotW / 2}
          y={height - 15}
          fontSize={13}
          fontWeight={700}
          fill="#16191f"
          textAnchor="middle"
        >
          Arithmetic intensity (FLOPs per byte of DRAM traffic) →
        </text>
        <text
          x={-height / 2}
          y={18}
          fontSize={13}
          fontWeight={700}
          fill="#16191f"
          textAnchor="middle"
          transform={`rotate(-90 18,${-height / 2})`}
        >
          Achievable TFLOPS →
        </text>
      </svg>
    </div>
  );
}
