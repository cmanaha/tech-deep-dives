import React, { useEffect, useRef, useState } from 'react';
import type { Source } from './Cite';
import { S } from '../sources/MoeAndSparseActivation';

export interface MoeModel {
  name: string;
  /** Total (DeepSeek-V4: backbone) parameters, billions. */
  totalB: number;
  /** Active parameters per token, billions. */
  activeB: number;
  /** Routed experts picked per token. */
  k: number;
  /** Routed experts per MoE layer. */
  n: number;
  /** Shared experts every token runs. */
  shared: number;
  /** Sources for the parameter counts, then for the routing. */
  sources: Source[];
}

/** Sorted by total parameters. Every figure is cited in the section's table. */
export const moeModels: MoeModel[] = [
  {
    name: 'Mixtral 8x7B',
    totalB: 46.7,
    activeB: 12.9,
    k: 2,
    n: 8,
    shared: 0,
    sources: [S.mixtralBlog, S.mixtralConfig],
  },
  {
    name: 'Qwen3-Next-80B-A3B',
    totalB: 80,
    activeB: 3,
    k: 10,
    n: 512,
    shared: 1,
    sources: [S.qwen3NextReadme],
  },
  {
    name: 'gpt-oss-120b',
    totalB: 117,
    activeB: 5.1,
    k: 4,
    n: 128,
    shared: 0,
    sources: [S.gptOss120bReadme, S.gptOss120bConfig],
  },
  {
    name: 'Qwen3-235B-A22B',
    totalB: 235,
    activeB: 22,
    k: 8,
    n: 128,
    shared: 0,
    sources: [S.qwen3Readme],
  },
  {
    name: 'DeepSeek-V4-Flash',
    totalB: 284,
    activeB: 13,
    k: 6,
    n: 256,
    shared: 1,
    sources: [S.deepseekV41Flash, S.deepseekV4FlashConfig],
  },
  {
    name: 'Llama 4 Maverick',
    totalB: 400,
    activeB: 17,
    k: 1,
    n: 128,
    shared: 1,
    sources: [S.llama4Blog],
  },
  {
    name: 'DeepSeek-V3',
    totalB: 671,
    activeB: 37,
    k: 8,
    n: 256,
    shared: 1,
    sources: [S.deepseekV3Readme, S.deepseekV3Config],
  },
  {
    name: 'Kimi K2',
    totalB: 1000,
    activeB: 32,
    k: 8,
    n: 384,
    shared: 1,
    sources: [S.kimiK2Readme],
  },
  {
    name: 'DeepSeek-V4-Pro',
    totalB: 1600,
    activeB: 49,
    k: 6,
    n: 384,
    shared: 1,
    sources: [S.deepseekV41Flash, S.deepseekV4ProConfig],
  },
  {
    name: 'Qwen3.8-2.4T-A95B',
    totalB: 2400,
    activeB: 95,
    k: 10,
    n: 512,
    shared: 1,
    sources: [S.qwen38Readme],
  },
  {
    name: 'Kimi K3',
    totalB: 2800,
    activeB: 104,
    k: 16,
    n: 896,
    shared: 2,
    sources: [S.kimiK3Readme],
  },
];

export function fmtParams(b: number): string {
  return b >= 1000 ? `${b / 1000}T` : `${b}B`;
}

export function fmtRatio(m: MoeModel): string {
  const r = m.totalB / m.activeB;
  return r < 10 ? `${r.toFixed(1)}:1` : `${Math.round(r)}:1`;
}

export function fmtRouting(m: MoeModel): string {
  return m.shared > 0 ? `${m.k} of ${m.n} +${m.shared}` : `${m.k} of ${m.n}`;
}

// Wide layout in viewBox units: one row per model, routing column on the right.
const W = 760;
const TOP = 62;
const ROW = 32;
const NAME_X = 172;
const PX0 = 196;
const PX1 = 548;
const RATIO_X = 596;
const ROUTE_X = 648;
const H = TOP + moeModels.length * ROW + 56;

// Narrow layout for phones: name and ratio on one line, the dumbbell below it.
const NW = 400;
const NTOP = 60;
const NROW = 46;
const NPX0 = 44;
const NPX1 = 356;
const NH = NTOP + moeModels.length * NROW + 50;

const LOG_MAX = Math.log10(4000);
const NARROW_BELOW = 560;

const blue = '#0972d3';
const ink = '#16191f';
const muted = '#5f6b7a';
const grid = '#e9ebed';
const font = 'sans-serif';

function scale(b: number, x0: number, x1: number): number {
  return x0 + (Math.log10(b) / LOG_MAX) * (x1 - x0);
}

const ticks = [1, 10, 100, 1000];

function rowTitle(m: MoeModel): string {
  const shared = m.shared ? ` plus ${m.shared} shared` : '';
  return `${m.name}: ${fmtParams(m.totalB)} total, ${fmtParams(m.activeB)} active, ${fmtRatio(m)}; ${m.k} of ${m.n} routed experts per token${shared}`;
}

const TITLE =
  'Eleven MoE models on a log scale of parameters. For each, a filled dot marks the parameters a token activates and an open dot the total parameters held in memory; the line between them is the sparsity ratio. Totals rise from 46.7B (Mixtral 8x7B) to 2.8T (Kimi K3) while active counts stay between 3B and 104B, and the sparsest models, DeepSeek-V4-Pro at 33:1 and Kimi K2 at 31:1, read about 3% of their weights per token.';

function Dumbbell({ m, cy, x0, x1 }: { m: MoeModel; cy: number; x0: number; x1: number }) {
  const xa = scale(m.activeB, x0, x1);
  const xt = scale(m.totalB, x0, x1);
  return (
    <>
      <line x1={xa} y1={cy} x2={xt} y2={cy} stroke={blue} strokeWidth={2} />
      <circle cx={xa} cy={cy} r={5} fill={blue} stroke="#ffffff" strokeWidth={2} />
      <circle cx={xt} cy={cy} r={5} fill="#ffffff" stroke={blue} strokeWidth={2} />
      <text x={xa - 10} y={cy + 4} fontSize={11} fontFamily={font} fill={ink} textAnchor="end">
        {fmtParams(m.activeB)}
      </text>
      <text x={xt + 10} y={cy + 4} fontSize={11} fontFamily={font} fill={ink}>
        {fmtParams(m.totalB)}
      </text>
    </>
  );
}

function Legend({ x, y, stacked }: { x: number; y: number; stacked: boolean }) {
  const x2 = stacked ? x : x + 190;
  const y2 = stacked ? y + 18 : y;
  return (
    <>
      <circle cx={x + 6} cy={y - 4} r={5} fill={blue} />
      <text x={x + 18} y={y} fontSize={11} fontFamily={font} fill={ink}>
        Active per token: bytes read
      </text>
      <circle cx={x2 + 6} cy={y2 - 4} r={5} fill="#ffffff" stroke={blue} strokeWidth={2} />
      <text x={x2 + 18} y={y2} fontSize={11} fontFamily={font} fill={ink}>
        Total: memory to hold
      </text>
    </>
  );
}

function Axis({ x0, x1, top, axisY }: { x0: number; x1: number; top: number; axisY: number }) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={scale(t, x0, x1)}
            y1={top - 4}
            x2={scale(t, x0, x1)}
            y2={axisY}
            stroke={grid}
            strokeWidth={1}
          />
          <text
            x={scale(t, x0, x1)}
            y={axisY + 16}
            fontSize={11}
            fontFamily={font}
            fill={muted}
            textAnchor="middle"
          >
            {fmtParams(t)}
          </text>
        </g>
      ))}
      <text
        x={(x0 + x1) / 2}
        y={axisY + 34}
        fontSize={11}
        fontFamily={font}
        fill={muted}
        textAnchor="middle"
      >
        Parameters (log scale)
      </text>
    </>
  );
}

function WideChart() {
  const axisY = TOP + moeModels.length * ROW + 4;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="moe-params-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="moe-params-title">{TITLE}</title>
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" stroke={grid} />
      <Legend x={PX0} y={26} stacked={false} />
      <text x={RATIO_X} y={50} fontSize={10} fontWeight={600} fontFamily={font} fill={muted}>
        Ratio
      </text>
      <text x={ROUTE_X} y={50} fontSize={10} fontWeight={600} fontFamily={font} fill={muted}>
        k of N +shared
      </text>
      {moeModels.map((m, i) =>
        i % 2 === 0 ? (
          <rect key={m.name} x={8} y={TOP + i * ROW} width={W - 16} height={ROW} fill="#f8f9fa" />
        ) : null,
      )}
      <Axis x0={PX0} x1={PX1} top={TOP} axisY={axisY} />
      {moeModels.map((m, i) => {
        const cy = TOP + i * ROW + ROW / 2;
        return (
          <g key={m.name}>
            <title>{rowTitle(m)}</title>
            <text
              x={NAME_X}
              y={cy + 4}
              fontSize={12}
              fontWeight={600}
              fontFamily={font}
              fill={ink}
              textAnchor="end"
            >
              {m.name}
            </text>
            <Dumbbell m={m} cy={cy} x0={PX0} x1={PX1} />
            <text
              x={RATIO_X}
              y={cy + 4}
              fontSize={12}
              fontWeight={600}
              fontFamily={font}
              fill={ink}
            >
              {fmtRatio(m)}
            </text>
            <text x={ROUTE_X} y={cy + 4} fontSize={11} fontFamily={font} fill={muted}>
              {fmtRouting(m)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function NarrowChart() {
  const axisY = NTOP + moeModels.length * NROW;
  return (
    <svg
      viewBox={`0 0 ${NW} ${NH}`}
      role="img"
      aria-labelledby="moe-params-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="moe-params-title">{TITLE}</title>
      <rect x={0} y={0} width={NW} height={NH} rx={8} fill="#ffffff" stroke={grid} />
      <Legend x={16} y={22} stacked />
      <text
        x={NW - 16}
        y={40}
        fontSize={10}
        fontWeight={600}
        fontFamily={font}
        fill={muted}
        textAnchor="end"
      >
        Ratio
      </text>
      {moeModels.map((m, i) =>
        i % 2 === 0 ? (
          <rect
            key={m.name}
            x={6}
            y={NTOP + i * NROW}
            width={NW - 12}
            height={NROW}
            fill="#f8f9fa"
          />
        ) : null,
      )}
      <Axis x0={NPX0} x1={NPX1} top={NTOP} axisY={axisY} />
      {moeModels.map((m, i) => {
        const top = NTOP + i * NROW;
        return (
          <g key={m.name}>
            <title>{rowTitle(m)}</title>
            <text x={16} y={top + 17} fontSize={12} fontWeight={600} fontFamily={font} fill={ink}>
              {m.name}
            </text>
            <text
              x={NW - 16}
              y={top + 17}
              fontSize={12}
              fontWeight={600}
              fontFamily={font}
              fill={ink}
              textAnchor="end"
            >
              {fmtRatio(m)}
            </text>
            <Dumbbell m={m} cy={top + 33} x0={NPX0} x1={NPX1} />
          </g>
        );
      })}
    </svg>
  );
}

/** Picks the phone layout when the container is narrower than NARROW_BELOW px. */
export function MoeParamsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setNarrow(el.clientWidth < NARROW_BELOW));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref}>{narrow ? <NarrowChart /> : <WideChart />}</div>;
}
