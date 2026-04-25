import React from 'react';

interface Format {
  name: string;
  bits: number;
  bytes: number;
  range: string;
  fill: string;
  border: string;
  notes: string;
}

const formats: Format[] = [
  { name: 'FP64', bits: 64, bytes: 8, range: '~10^308 dynamic range', fill: '#fce7e7', border: '#d91515', notes: 'HPC, scientific' },
  { name: 'FP32', bits: 32, bytes: 4, range: '~10^38 dynamic range', fill: '#fdf3ec', border: '#ec7211', notes: 'Master weights' },
  { name: 'TF32', bits: 19, bytes: 4, range: 'FP32 storage, FP19 mantissa', fill: '#fdf3ec', border: '#ec7211', notes: 'Ampere internal' },
  { name: 'BF16', bits: 16, bytes: 2, range: 'FP32 dynamic range, 7-bit mantissa', fill: '#f2f8fd', border: '#0972d3', notes: 'Training default' },
  { name: 'FP16', bits: 16, bytes: 2, range: '~10^4 dynamic range', fill: '#f2f8fd', border: '#0972d3', notes: 'Inference legacy' },
  { name: 'FP8 E4M3', bits: 8, bytes: 1, range: '~10^4 — forward', fill: '#ecf7ec', border: '#037f0c', notes: 'Forward pass' },
  { name: 'FP8 E5M2', bits: 8, bytes: 1, range: '~10^15 — backward', fill: '#ecf7ec', border: '#037f0c', notes: 'Gradients' },
  { name: 'NVFP4 (E2M1)', bits: 4, bytes: 0.5, range: '~ -6 to 6', fill: '#e1f0fb', border: '#0972d3', notes: 'Blackwell — block-16, dual-level scale' },
  { name: 'MXFP4', bits: 4, bytes: 0.5, range: 'similar — block-32', fill: '#e1f0fb', border: '#0972d3', notes: 'OCP standard' },
];

export function PrecisionLadder() {
  const width = 880;
  const rowH = 40;
  const rowGap = 6;
  const margin = { top: 40, left: 130, right: 30 };
  const height = margin.top + formats.length * (rowH + rowGap) + 30;
  const plotW = width - margin.left - margin.right;
  const maxBytes = 8;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Precision ladder from FP64 down to FP4 with bytes per value, dynamic range, and use case"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          Precision ladder — bytes per value drives bandwidth-per-token directly
        </text>
        {formats.map((f, i) => {
          const y = margin.top + i * (rowH + rowGap);
          const bw = (plotW * f.bytes) / maxBytes;
          return (
            <g key={f.name}>
              <text x={margin.left - 10} y={y + 24} fontSize={12} fontWeight={700} fill="#16191f" textAnchor="end">
                {f.name}
              </text>
              <rect x={margin.left} y={y} width={bw} height={rowH} rx={4} fill={f.fill} stroke={f.border} strokeWidth={2} />
              <text x={margin.left + 8} y={y + 17} fontSize={11} fontWeight={700} fill={f.border}>
                {`${f.bytes} bytes`}
              </text>
              <text x={margin.left + 8} y={y + 33} fontSize={10} fill="#16191f">
                {f.range}
              </text>
              <text x={margin.left + bw + 12} y={y + 24} fontSize={11} fill="#687078">
                {f.notes}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
