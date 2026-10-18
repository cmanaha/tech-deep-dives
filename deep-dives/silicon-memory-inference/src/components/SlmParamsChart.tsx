import React from 'react';
import type { Source } from './Cite';
import { S } from '../sources/SmallLanguageModels';

export interface SlmModel {
  name: string;
  family: string;
  /** Parameters stored in the checkpoint (safetensors total at the pinned revision), billions. */
  storedB: number;
  /** Effective parameters computed per token, where the vendor publishes one, billions. */
  effectiveB?: number;
  context: string;
  sources: Source[];
}

/** Grouped by family, newest family first. Every figure is cited in the section's table. */
export const slmModels: SlmModel[] = [
  { name: 'Qwen3.5-0.8B', family: 'Qwen3.5', storedB: 0.873, context: '262K', sources: [S.qwen35_08b] },
  { name: 'Qwen3.5-2B', family: 'Qwen3.5', storedB: 2.274, context: '262K', sources: [S.qwen35_2b] },
  { name: 'Qwen3.5-4B', family: 'Qwen3.5', storedB: 4.66, context: '262K', sources: [S.qwen35_4b] },
  { name: 'Qwen3.5-9B', family: 'Qwen3.5', storedB: 9.653, context: '262K', sources: [S.qwen35_9b] },
  {
    name: 'Gemma 4 E2B',
    family: 'Gemma 4',
    storedB: 5.123,
    effectiveB: 2.3,
    context: '128K',
    sources: [S.gemma4E2b],
  },
  {
    name: 'Gemma 4 E4B',
    family: 'Gemma 4',
    storedB: 7.996,
    effectiveB: 4.5,
    context: '128K',
    sources: [S.gemma4E4b],
  },
  {
    name: 'Gemma 4 12B',
    family: 'Gemma 4',
    storedB: 11.96,
    context: '256K',
    sources: [S.gemma4_12b, S.gemma4E2b],
  },
  { name: 'Ministral 3 3B', family: 'Ministral 3', storedB: 3.849, context: '256K', sources: [S.ministral3_3b] },
  { name: 'Ministral 3 8B', family: 'Ministral 3', storedB: 8.918, context: '256K', sources: [S.ministral3_8b] },
  { name: 'Ministral 3 14B', family: 'Ministral 3', storedB: 13.945, context: '256K', sources: [S.ministral3_14b] },
  { name: 'SmolLM3-3B', family: 'SmolLM3', storedB: 3.075, context: '64K (128K extended)', sources: [S.smollm3] },
  { name: 'Phi-4-mini', family: 'Phi-4', storedB: 3.836, context: '128K', sources: [S.phi4Mini] },
  {
    name: 'Llama 3.2 1B',
    family: 'Llama 3.2',
    storedB: 1.236,
    context: '128K',
    sources: [S.llama32Card, S.llama32_1b],
  },
  {
    name: 'Llama 3.2 3B',
    family: 'Llama 3.2',
    storedB: 3.213,
    context: '128K',
    sources: [S.llama32Card, S.llama32_3b],
  },
];

/** Two significant figures: 0.87, 2.3, 12. */
export function fmtB(b: number): string {
  if (b < 1) return `${b.toFixed(2)}B`;
  if (b < 10) return `${b.toFixed(1)}B`;
  return `${b.toFixed(0)}B`;
}

export function valueLabel(m: SlmModel): string {
  return m.effectiveB
    ? `${fmtB(m.storedB)} stored, ${fmtB(m.effectiveB)} effective`
    : `${fmtB(m.storedB)} stored`;
}

// Layout in viewBox units. Wide: on a phone the wrapper scrolls and the svg keeps 640 px.
const W = 720;
const TOP = 72;
const ROW = 26;
const BAR_H = 16;
const NAME_X = 150;
const PX0 = 162;
const MAX_B = 16;
const PX1 = 522;
const CTX_X = 580;
const AXIS_Y = TOP + slmModels.length * ROW + 6;
const H = AXIS_Y + 30;

const blue = '#0972d3';
const tint = '#d3e6fa';
const ink = '#16191f';
const muted = '#5f6b7a';
const grid = '#e9ebed';
const stripe = '#f8f9fa';
const font = 'sans-serif';

function x(b: number): number {
  return PX0 + (b / MAX_B) * (PX1 - PX0);
}

const ticks = [0, 4, 8, 12, 16];
const families = [...new Set(slmModels.map((m) => m.family))];

const TITLE =
  'Fourteen small language models from six families, drawn by the parameters stored in each checkpoint: from 0.87B (Qwen3.5-0.8B) to 14B (Ministral 3 14B), with context windows of 128K to 262K tokens except SmolLM3-3B, trained at 64K. Gemma 4 E2B and E4B store 5.1B and 8.0B parameters but compute like 2.3B and 4.5B, because their per-layer embedding tables are read by lookup.';

export function SlmParamsChart() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="slm-params-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="slm-params-title">{TITLE}</title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" stroke={grid} />

        {/* Legend, two lines */}
        <rect x={16} y={12} width={22} height={12} rx={2} fill={blue} />
        <text x={46} y={22} fontSize={11} fontFamily={font} fill={ink}>
          Bar length: parameters stored in the checkpoint (the memory to hold)
        </text>
        <rect x={16} y={32} width={22} height={12} rx={2} fill={tint} stroke={blue} />
        <text x={46} y={42} fontSize={11} fontFamily={font} fill={ink}>
          Light segment: stored but not in the effective count (Gemma 4 E2B and E4B)
        </text>

        {/* Column headers */}
        <text x={NAME_X} y={62} fontSize={10} fontWeight={600} fontFamily={font} fill={muted} textAnchor="end">
          Model
        </text>
        <text x={PX0} y={62} fontSize={10} fontWeight={600} fontFamily={font} fill={muted}>
          Parameters (billions, linear scale)
        </text>
        <text x={CTX_X} y={62} fontSize={10} fontWeight={600} fontFamily={font} fill={muted}>
          Context window
        </text>

        {/* One stripe per family, alternating */}
        {slmModels.map((m, i) => {
          const familyIndex = families.indexOf(m.family);
          return familyIndex % 2 === 0 ? (
            <rect key={`stripe-${m.name}`} x={8} y={TOP + i * ROW} width={W - 16} height={ROW} fill={stripe} />
          ) : null;
        })}

        {slmModels.map((m, i) => {
          const top = TOP + i * ROW;
          const cy = top + ROW / 2;
          const barY = cy - BAR_H / 2;
          const xEnd = x(m.storedB);
          const xEff = m.effectiveB ? x(m.effectiveB) : xEnd;
          return (
            <g key={m.name}>
              <title>{`${m.name}: ${valueLabel(m)}; context ${m.context}`}</title>
              <text x={NAME_X} y={cy + 4} fontSize={12} fontWeight={600} fontFamily={font} fill={ink} textAnchor="end">
                {m.name}
              </text>
              {m.effectiveB ? (
                <rect x={xEff} y={barY} width={xEnd - xEff} height={BAR_H} fill={tint} stroke={blue} strokeWidth={1} />
              ) : null}
              <rect x={PX0} y={barY} width={xEff - PX0} height={BAR_H} fill={blue} />
              <text x={xEnd + 6} y={cy + 4} fontSize={11} fontFamily={font} fill={ink}>
                {valueLabel(m)}
              </text>
              <text x={CTX_X} y={cy + 4} fontSize={11} fontFamily={font} fill={ink}>
                {m.context}
              </text>
            </g>
          );
        })}

        {/* Axis */}
        <line x1={PX0} y1={AXIS_Y} x2={PX1} y2={AXIS_Y} stroke={muted} strokeWidth={1} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={AXIS_Y} x2={x(t)} y2={AXIS_Y + 5} stroke={muted} strokeWidth={1} />
            <text x={x(t)} y={AXIS_Y + 18} fontSize={10} fontFamily={font} fill={muted} textAnchor="middle">
              {t === 0 ? '0' : `${t}B`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
