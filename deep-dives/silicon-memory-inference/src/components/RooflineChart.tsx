import React from 'react';

// Two diagrams for Roofline and Arithmetic Intensity. Every number drawn here
// is cited in the section text or its tables (src/sources/RooflineAndArithmeticIntensity.ts).
//
// RooflineChart: an H200 SXM roofline on log-log axes with the dense BF16 and
// FP8 Tensor Core ceilings (989.5 and 1,979 TFLOPS) over one 4.8 TB/s HBM3e
// slope. Workload intensities count weight bytes only: 2 FLOP per weight per
// sequence in the batch, divided by bytes per weight.
//
// RidgeMapChart: dense ridge points (peak FLOPS / HBM bandwidth) per chip and
// precision on a log axis, from the ridge table in the section.

const blue = '#0972d3';
const purple = '#6f4cc4';
const orange = '#ec7211';
const green = '#037f0c';
const slate = '#414d5c';
const ink = '#16191f';
const muted = '#5f6b7a';
const grid = '#e9ebed';

const BW = 4.8; // H200 HBM3e, TB/s
const FP8_PEAK = 1979; // H200 dense FP8 TFLOPS
const BF16_PEAK = 989.5; // H200 dense BF16 TFLOPS
const FP8_RIDGE = FP8_PEAK / BW; // about 412
const BF16_RIDGE = BF16_PEAK / BW; // about 206

export function RooflineChart() {
  const W = 760;
  const H = 414;
  const x0 = 76;
  const x1 = 736;
  const y0 = 30;
  const y1 = 360;
  const xMin = Math.log10(0.5);
  const xMax = Math.log10(20000);
  const yMin = Math.log10(2);
  const yMax = Math.log10(5000);
  const sx = (v: number) => x0 + ((Math.log10(v) - xMin) / (xMax - xMin)) * (x1 - x0);
  const sy = (v: number) => y1 - ((Math.log10(v) - yMin) / (yMax - yMin)) * (y1 - y0);
  const slopeAngle =
    (-Math.atan(((y1 - y0) / (yMax - yMin)) / ((x1 - x0) / (xMax - xMin))) * 180) / Math.PI;

  const xTicks = [
    { v: 1, l: '1' },
    { v: 10, l: '10' },
    { v: 100, l: '100' },
    { v: 1000, l: '1,000' },
    { v: 10000, l: '10,000' },
  ];
  const yTicks = [
    { v: 10, l: '10' },
    { v: 100, l: '100' },
    { v: 1000, l: '1,000' },
  ];

  const d1Bf16 = { x: sx(1), y: sy(BW * 1) };
  const d1Fp8 = { x: sx(2), y: sy(BW * 2) };
  const d64Fp8 = { x: sx(128), y: sy(BW * 128) };
  const prefill = { x: sx(8192), y: sy(FP8_PEAK) };
  const rFp8 = { x: sx(FP8_RIDGE), y: sy(FP8_PEAK) };
  const rBf16 = { x: sx(BF16_RIDGE), y: sy(BF16_PEAK) };
  const slopeLabel = { x: sx(5), y: sy(BW * 5) - 9 };

  return (
    <div style={{ overflowX: 'auto' }}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="roofline-h200-title" style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}>
      <title id="roofline-h200-title">
        H200 roofline on logarithmic axes. One 4.8 TB/s HBM3e bandwidth slope rises to two dense
        compute ceilings: BF16 at 989.5 TFLOPS with its ridge at 206 FLOP per byte, and FP8 at 1,979
        TFLOPS with its ridge at 412. Decode at batch 1 sits at about 1 FLOP per byte with BF16
        weights and 2 with FP8 weights, about 200 times below the matching ridge either way. Decode
        at batch 64 with FP8 weights reaches about 128, still on the bandwidth slope. Prefill on a
        4k-token prompt reaches thousands of FLOP per byte and runs on the compute ceiling.
      </title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#fafbfc" />

      {xTicks.map((t) => (
        <g key={`x${t.v}`}>
          <line x1={sx(t.v)} y1={y0} x2={sx(t.v)} y2={y1} stroke={grid} strokeWidth={1} />
          <text x={sx(t.v)} y={y1 + 17} fontSize={11} fontFamily="sans-serif" fill={muted} textAnchor="middle">
            {t.l}
          </text>
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`y${t.v}`}>
          <line x1={x0} y1={sy(t.v)} x2={x1} y2={sy(t.v)} stroke={grid} strokeWidth={1} />
          <text x={x0 - 8} y={sy(t.v) + 4} fontSize={11} fontFamily="sans-serif" fill={muted} textAnchor="end">
            {t.l}
          </text>
        </g>
      ))}

      {/* Bandwidth slope, then the two compute ceilings */}
      <line x1={sx(0.5)} y1={sy(BW * 0.5)} x2={rFp8.x} y2={rFp8.y} stroke={slate} strokeWidth={3} />
      <line x1={rBf16.x} y1={rBf16.y} x2={x1} y2={rBf16.y} stroke={purple} strokeWidth={3} />
      <line x1={rFp8.x} y1={rFp8.y} x2={x1} y2={rFp8.y} stroke={blue} strokeWidth={3} />
      <text
        x={slopeLabel.x}
        y={slopeLabel.y}
        fontSize={11}
        fontWeight={600}
        fontFamily="sans-serif"
        fill={slate}
        transform={`rotate(${slopeAngle} ${slopeLabel.x} ${slopeLabel.y})`}
      >
        HBM3e slope: 4.8 TB/s
      </text>
      <text x={rFp8.x + 12} y={rFp8.y + 19} fontSize={11} fontWeight={600} fontFamily="sans-serif" fill={blue}>
        FP8 dense: 1,979 TFLOPS
      </text>
      <text x={rFp8.x + 12} y={rBf16.y + 18} fontSize={11} fontWeight={600} fontFamily="sans-serif" fill={purple}>
        BF16 dense: 989.5 TFLOPS
      </text>

      {/* Ridge points */}
      <circle cx={rFp8.x} cy={rFp8.y} r={6} fill={ink} />
      <circle cx={rBf16.x} cy={rBf16.y} r={6} fill={ink} />
      <text x={rFp8.x - 12} y={rFp8.y - 8} fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={ink} textAnchor="end">
        FP8 ridge: 412 FLOP/byte
      </text>
      <text x={rBf16.x - 12} y={rBf16.y - 8} fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={ink} textAnchor="end">
        BF16 ridge: 206 FLOP/byte
      </text>

      {/* The precision-step reading */}
      <text x={x0 + 14} y={y0 + 112} fontSize={11} fontWeight={600} fontFamily="sans-serif" fill={ink}>
        <tspan x={x0 + 14}>One step, BF16 to FP8:</tspan>
        <tspan x={x0 + 14} dy={15} fontWeight={400}>the ridge moves 2x right,</tspan>
        <tspan x={x0 + 14} dy={15} fontWeight={400}>decode moves 2x right,</tspan>
        <tspan x={x0 + 14} dy={15} fontWeight={400}>so decode stays about</tspan>
        <tspan x={x0 + 14} dy={15} fontWeight={400}>200x below the ridge.</tspan>
      </text>

      {/* Workloads */}
      <circle cx={d1Bf16.x} cy={d1Bf16.y} r={6} fill="#ffffff" stroke={orange} strokeWidth={2.5} />
      <circle cx={d1Fp8.x} cy={d1Fp8.y} r={6} fill={orange} stroke="#ffffff" strokeWidth={1.5} />
      <circle cx={d64Fp8.x} cy={d64Fp8.y} r={6} fill={orange} stroke="#ffffff" strokeWidth={1.5} />
      <circle cx={prefill.x} cy={prefill.y} r={7} fill={green} stroke="#ffffff" strokeWidth={1.5} />

      <text x={d1Fp8.x + 14} y={d1Fp8.y + 16} fontSize={11} fontFamily="sans-serif" fill={ink}>
        <tspan fontWeight={600}>Decode, batch 1, FP8 weights:</tspan> about 2
      </text>
      <text x={d1Bf16.x + 14} y={d1Bf16.y + 22} fontSize={11} fontFamily="sans-serif" fill={ink}>
        <tspan fontWeight={600}>Decode, batch 1, BF16 weights:</tspan> about 1
      </text>
      <text x={d64Fp8.x + 14} y={d64Fp8.y + 22} fontSize={11} fontFamily="sans-serif" fill={ink}>
        <tspan x={d64Fp8.x + 14} fontWeight={600}>Decode, batch 64,</tspan>
        <tspan x={d64Fp8.x + 14} dy={14} fontWeight={600}>FP8 weights:</tspan>
        <tspan x={d64Fp8.x + 14} dy={14}>about 128</tspan>
      </text>
      <line x1={prefill.x} y1={prefill.y + 8} x2={prefill.x} y2={prefill.y + 98} stroke={green} strokeWidth={1.2} strokeDasharray="3 3" />
      <text x={x1 - 4} y={prefill.y + 112} fontSize={11} fontFamily="sans-serif" fill={ink} textAnchor="end">
        <tspan x={x1 - 4} fontWeight={600}>Prefill, 4k-token prompt:</tspan>
        <tspan x={x1 - 4} dy={14}>thousands of FLOP/byte</tspan>
      </text>

      <text x={sx(40)} y={sy(BW * 40) + 64} fontSize={11} fontStyle="italic" fontFamily="sans-serif" fill={muted}>
        memory-bound
      </text>
      <text x={sx(1500)} y={y1 - 34} fontSize={11} fontStyle="italic" fontFamily="sans-serif" fill={muted}>
        compute-bound
      </text>

      {/* Axes */}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={ink} strokeWidth={1.5} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={ink} strokeWidth={1.5} />
      <text x={(x0 + x1) / 2} y={H - 14} fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={ink} textAnchor="middle">
        Arithmetic intensity, FLOP per byte of HBM traffic (log scale)
      </text>
      <text
        x={20}
        y={(y0 + y1) / 2}
        fontSize={12}
        fontWeight={700}
        fontFamily="sans-serif"
        fill={ink}
        textAnchor="middle"
        transform={`rotate(-90 20 ${(y0 + y1) / 2})`}
      >
        Attainable TFLOPS (log scale)
      </text>
    </svg>
    </div>
  );
}

interface RidgeChip {
  chip: string;
  bf16?: number;
  fp8?: number;
  fp4?: number;
}

const ridgeChips: RidgeChip[] = [
  { chip: 'H100 SXM', bf16: 295, fp8: 591 },
  { chip: 'H200 SXM', bf16: 206, fp8: 412 },
  { chip: 'B200', bf16: 281, fp8: 562, fp4: 1125 },
  { chip: 'B300 (HGX)', bf16: 281, fp8: 562, fp4: 1688 },
  { chip: 'Rubin', bf16: 182, fp8: 795, fp4: 1591 },
  { chip: 'AMD MI355X', fp8: 625, fp4: 1262 },
  { chip: 'AWS Trainium2', bf16: 230, fp8: 448 },
  { chip: 'AWS Trainium3', bf16: 137, fp8: 514, fp4: 514 },
];

export function RidgeMapChart() {
  const W = 760;
  const rowTop = 72;
  const rowStep = 36;
  const plotBottom = rowTop + rowStep * (ridgeChips.length - 1) + 22;
  const H = plotBottom + 52;
  const x0 = 170;
  const x1 = 736;
  const lo = Math.log10(100);
  const hi = Math.log10(2000);
  const sx = (v: number) => x0 + ((Math.log10(v) - lo) / (hi - lo)) * (x1 - x0);
  const fmt = (v: number) => v.toLocaleString('en-US');
  const ticks = [100, 200, 500, 1000, 2000];
  const bandTop = 46;
  const pad = 16;
  const bands = [
    { from: 137, to: 295, fill: '#f2f8fd' },
    { from: 412, to: 795, fill: '#fdf3ec' },
    { from: 1125, to: 1688, fill: '#ecf7ec' },
  ];

  const diamond = (cx: number, cy: number, r: number) =>
    `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

  return (
    <div style={{ overflowX: 'auto' }}>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="ridge-map-title" style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}>
      <title id="ridge-map-title">
        Dense ridge points group by precision more than by chip. BF16 ridges fall between 137 and 295
        FLOP per byte on every chip shown, FP8 ridges between 412 and 795, and NVFP4 and MXFP4 ridges
        between 1,125 and 1,688, while one chip&apos;s ridge moves 2 to 9 times across its precisions.
        Trainium3 rates MXFP4 at its MXFP8 rate, so its FP4 ridge stays at 514.
      </title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

      {bands.map((b) => (
        <rect
          key={b.from}
          x={sx(b.from) - pad}
          y={bandTop}
          width={sx(b.to) - sx(b.from) + 2 * pad}
          height={plotBottom - bandTop}
          fill={b.fill}
        />
      ))}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={bandTop} x2={sx(t)} y2={plotBottom} stroke={grid} strokeWidth={1} />
          <text x={sx(t)} y={plotBottom + 17} fontSize={11} fontFamily="sans-serif" fill={muted} textAnchor="middle">
            {fmt(t)}
          </text>
        </g>
      ))}
      <line x1={x0} y1={plotBottom} x2={x1} y2={plotBottom} stroke={ink} strokeWidth={1.5} />
      <text x={(x0 + x1) / 2} y={H - 12} fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={ink} textAnchor="middle">
        Dense ridge point, FLOP per byte (log scale)
      </text>

      {/* Legend */}
      <circle cx={x0 + 6} cy={22} r={6} fill={blue} />
      <text x={x0 + 18} y={26} fontSize={12} fontWeight={600} fontFamily="sans-serif" fill={ink}>
        BF16
      </text>
      <rect x={x0 + 80} y={16} width={12} height={12} fill={orange} />
      <text x={x0 + 98} y={26} fontSize={12} fontWeight={600} fontFamily="sans-serif" fill={ink}>
        FP8 (OCP FP8, MXFP8)
      </text>
      <polygon points={diamond(x0 + 282, 22, 7)} fill={green} />
      <text x={x0 + 296} y={26} fontSize={12} fontWeight={600} fontFamily="sans-serif" fill={ink}>
        FP4 (NVFP4, MXFP4)
      </text>

      {ridgeChips.map((c, i) => {
        const y = rowTop + i * rowStep;
        const same = c.fp8 !== undefined && c.fp8 === c.fp4;
        return (
          <g key={c.chip}>
            <text x={16} y={y + 4} fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={ink}>
              {c.chip}
            </text>
            <line x1={x0} y1={y} x2={x1} y2={y} stroke="#d1d5db" strokeWidth={1} strokeDasharray="2 4" />
            {c.bf16 !== undefined && (
              <>
                <circle cx={sx(c.bf16)} cy={y} r={6} fill={blue} />
                <text x={sx(c.bf16)} y={y - 10} fontSize={11} fontFamily="sans-serif" fill={ink} textAnchor="middle">
                  {fmt(c.bf16)}
                </text>
              </>
            )}
            {c.fp8 !== undefined && (
              <>
                <rect x={sx(c.fp8) - 6 - (same ? 6 : 0)} y={y - 6} width={12} height={12} fill={orange} />
                <text x={sx(c.fp8)} y={y - 10} fontSize={11} fontFamily="sans-serif" fill={ink} textAnchor="middle">
                  {fmt(c.fp8)}
                </text>
              </>
            )}
            {c.fp4 !== undefined && (
              <>
                <polygon points={diamond(sx(c.fp4) + (same ? 6 : 0), y, 7)} fill={green} />
                {!same && (
                  <text x={sx(c.fp4)} y={y - 10} fontSize={11} fontFamily="sans-serif" fill={ink} textAnchor="middle">
                    {fmt(c.fp4)}
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
    </div>
  );
}
