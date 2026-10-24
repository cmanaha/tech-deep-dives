import React from 'react';

/**
 * The precision ladder: bits per value for each format, split into sign,
 * exponent and mantissa, with the amortized block scale for the MX formats
 * and NVFP4. Drawn at one scale (6 viewBox units per bit), so the bar length
 * is the bytes a memory-bound decode step reads per value.
 *
 * Every figure here is cited in the caption the section renders under it:
 * bit layouts from LLVM APFloat semantics and the Neuron data-type table,
 * FP8 and FP4 maxima and the MX block of 32 from the OCP MX v1.0 spec,
 * NVFP4's block of 16 and 4.5 bits from NVIDIA's NVFP4 blog. FP64, FP32,
 * TF32, BF16 and FP16 maxima are derived from the APFloat exponent and
 * precision fields.
 */

interface Rung {
  name: string;
  sign: number;
  exp: number;
  man: number;
  /** Block-scale bits amortized per value: 8 bits / block size. */
  scale: number;
  /** Bits the format occupies in memory when wider than the bits it uses. */
  stored?: number;
  layout: string;
  bytes: string;
  max: string;
}

const rungs: Rung[] = [
  { name: 'FP64', sign: 1, exp: 11, man: 52, scale: 0, layout: '1 + 11 + 52', bytes: '8', max: '1.8e308' },
  { name: 'FP32', sign: 1, exp: 8, man: 23, scale: 0, layout: '1 + 8 + 23', bytes: '4', max: '3.4e38' },
  { name: 'TF32', sign: 1, exp: 8, man: 10, scale: 0, stored: 32, layout: '1 + 8 + 10', bytes: '4 stored', max: '3.4e38' },
  { name: 'BF16', sign: 1, exp: 8, man: 7, scale: 0, layout: '1 + 8 + 7', bytes: '2', max: '3.4e38' },
  { name: 'FP16', sign: 1, exp: 5, man: 10, scale: 0, layout: '1 + 5 + 10', bytes: '2', max: '65,504' },
  { name: 'FP8 E5M2', sign: 1, exp: 5, man: 2, scale: 0, layout: '1 + 5 + 2', bytes: '1', max: '57,344' },
  { name: 'FP8 E4M3', sign: 1, exp: 4, man: 3, scale: 0, layout: '1 + 4 + 3', bytes: '1', max: '448' },
  { name: 'MXFP8', sign: 1, exp: 4, man: 3, scale: 8 / 32, layout: 'E4M3 + E8M0 per 32', bytes: '1.03', max: '448 x scale' },
  { name: 'NVFP4', sign: 1, exp: 2, man: 1, scale: 8 / 16, layout: 'E2M1 + E4M3 per 16', bytes: '0.56', max: '6 x scale' },
  { name: 'MXFP4', sign: 1, exp: 2, man: 1, scale: 8 / 32, layout: 'E2M1 + E8M0 per 32', bytes: '0.53', max: '6 x scale' },
];

const VB_W = 880;
const UNIT = 6; // viewBox units per bit
const BAR_X = 148;
const ROW_Y0 = 74;
const PITCH = 36;
const BAR_H = 20;
const COL_LAYOUT = 552;
const COL_BYTES = 700;
const COL_MAX = 764;
const LEGEND_Y = ROW_Y0 + rungs.length * PITCH + 18;
const VB_H = LEGEND_Y + 30;

export function PrecisionLadder() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="precision-ladder-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="precision-ladder-title">
          Each step down the ladder from FP64 to 4-bit formats cuts the bits a decode step reads
          for every value. Exponent bits set the range and mantissa bits set the resolution. The
          block-scaled formats MXFP8, NVFP4 and MXFP4 add one shared scale per block of 32 or 16
          values, which costs a quarter or half a bit per value and gives back the range a small
          element lacks.
        </title>
        <style>{`
          .pl-head { fill: #16191f; font: 600 13px sans-serif; }
          .pl-col { fill: #414d5c; font: 600 11px sans-serif; }
          .pl-name { fill: #16191f; font: 600 13px sans-serif; text-anchor: end; }
          .pl-val { fill: #16191f; font: 12px sans-serif; }
          .pl-sub { fill: #5f6b7a; font: 11px sans-serif; }
          .pl-in { fill: #ffffff; font: 600 11px sans-serif; }
          .pl-leg { fill: #414d5c; font: 11px sans-serif; }
          .pl-rule { stroke: #e9ebed; stroke-width: 1; }
        `}</style>
        <rect x={0} y={0} width={VB_W} height={VB_H} rx={8} fill="#ffffff" />

        <text className="pl-head" x={16} y={26}>
          Bits per value, split into sign, exponent (range) and mantissa (resolution)
        </text>
        <text className="pl-col" x={136} y={56} textAnchor="end">
          Format
        </text>
        <text className="pl-col" x={BAR_X} y={56}>
          Bits per value, one scale for every row
        </text>
        <text className="pl-col" x={COL_LAYOUT} y={56}>
          Layout (s + e + m)
        </text>
        <text className="pl-col" x={COL_BYTES} y={56}>
          Bytes
        </text>
        <text className="pl-col" x={COL_MAX} y={56}>
          Max magnitude
        </text>
        <line className="pl-rule" x1={16} x2={VB_W - 16} y1={64} y2={64} />

        {rungs.map((r, i) => {
          const y = ROW_Y0 + i * PITCH;
          const xs = BAR_X;
          const xe = xs + r.sign * UNIT;
          const xm = xe + r.exp * UNIT;
          const xc = xm + r.man * UNIT;
          const used = r.sign + r.exp + r.man;
          const scaleW = r.scale * UNIT;
          const textY = y + BAR_H / 2 + 4;
          return (
            <g key={r.name}>
              <text className="pl-name" x={136} y={textY}>
                {r.name}
              </text>
              {r.stored ? (
                <rect
                  x={xs}
                  y={y}
                  width={r.stored * UNIT}
                  height={BAR_H}
                  fill="#f2f3f3"
                  stroke="#879596"
                  strokeDasharray="4 3"
                />
              ) : null}
              <rect x={xs} y={y} width={r.sign * UNIT} height={BAR_H} fill="#414d5c" />
              <rect x={xe} y={y} width={r.exp * UNIT} height={BAR_H} fill="#0972d3" />
              <rect x={xm} y={y} width={r.man * UNIT} height={BAR_H} fill="#037f0c" />
              {scaleW > 0 ? (
                <rect x={xc} y={y} width={Math.max(scaleW, 2)} height={BAR_H} fill="#ec7211" />
              ) : null}
              {r.stored ? (
                <text className="pl-sub" x={xs + r.stored * UNIT + 8} y={textY}>
                  {`${used} bits used of ${r.stored} stored`}
                </text>
              ) : xc + 70 > COL_LAYOUT ? (
                // The FP64 bar reaches the layout column, so its label sits inside the bar.
                <text className="pl-in" x={xc - 8} y={textY} textAnchor="end">
                  {`${used} bits`}
                </text>
              ) : (
                <text className="pl-sub" x={xc + scaleW + 8} y={textY}>
                  {r.scale > 0 ? `${used + r.scale} bits` : `${used} bits`}
                </text>
              )}
              <text className="pl-val" x={COL_LAYOUT} y={textY}>
                {r.layout}
              </text>
              <text className="pl-val" x={COL_BYTES} y={textY}>
                {r.bytes}
              </text>
              <text className="pl-val" x={COL_MAX} y={textY}>
                {r.max}
              </text>
            </g>
          );
        })}

        <line
          className="pl-rule"
          x1={16}
          x2={VB_W - 16}
          y1={LEGEND_Y - 16}
          y2={LEGEND_Y - 16}
        />
        <rect x={16} y={LEGEND_Y - 9} width={12} height={12} fill="#414d5c" />
        <text className="pl-leg" x={34} y={LEGEND_Y + 1}>
          sign
        </text>
        <rect x={80} y={LEGEND_Y - 9} width={12} height={12} fill="#0972d3" />
        <text className="pl-leg" x={98} y={LEGEND_Y + 1}>
          exponent: range
        </text>
        <rect x={210} y={LEGEND_Y - 9} width={12} height={12} fill="#037f0c" />
        <text className="pl-leg" x={228} y={LEGEND_Y + 1}>
          mantissa: resolution
        </text>
        <rect x={364} y={LEGEND_Y - 9} width={12} height={12} fill="#ec7211" />
        <text className="pl-leg" x={382} y={LEGEND_Y + 1}>
          shared block scale, per value
        </text>
        <rect
          x={570}
          y={LEGEND_Y - 9}
          width={12}
          height={12}
          fill="#f2f3f3"
          stroke="#879596"
          strokeDasharray="3 2"
        />
        <text className="pl-leg" x={588} y={LEGEND_Y + 1}>
          stored but unused by the math (TF32)
        </text>
      </svg>
    </div>
  );
}
