import React from 'react';

interface ModelRow {
  name: string;
  totalB: number;
  activeB: number;
  topk: string;
  experts: string;
}

const models: ModelRow[] = [
  { name: 'Mixtral 8x7B', totalB: 46.7, activeB: 12.9, topk: 'top-2', experts: '8' },
  { name: 'Mixtral 8x22B', totalB: 141, activeB: 39, topk: 'top-2', experts: '8' },
  { name: 'GPT-OSS 120B', totalB: 117, activeB: 5.1, topk: 'top-4', experts: '128' },
  { name: 'DBRX', totalB: 132, activeB: 36, topk: 'top-4', experts: '16' },
  { name: 'Qwen3-235B-A22B', totalB: 235, activeB: 22, topk: 'top-8', experts: '128' },
  { name: 'Llama 4 Maverick', totalB: 400, activeB: 17, topk: 'top-1', experts: '128 + 1 shared' },
  { name: 'DeepSeek-V3 / R1', totalB: 671, activeB: 37, topk: 'top-8', experts: '256 + 1 shared' },
  { name: 'Kimi K2', totalB: 1000, activeB: 32, topk: 'top-8', experts: '384 + 1 shared' },
];

export function MoeParamsChart() {
  const width = 760;
  const rowH = 38;
  const rowGap = 6;
  const margin = { top: 50, left: 200, right: 240, bottom: 30 };
  const height = margin.top + margin.bottom + models.length * (rowH + rowGap);
  const plotW = width - margin.left - margin.right;
  const maxTotal = Math.max(...models.map((m) => m.totalB));

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Bar chart comparing total parameters versus active parameters per token across major MoE models, with top-k routing and expert count"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={margin.left} y={20} fontSize={13} fontWeight={700} fill="#16191f">
          Total parameters vs active parameters per token (billions)
        </text>
        <text x={margin.left} y={36} fontSize={11} fill="#687078">
          Active params drive HBM bandwidth in decode; total params drive memory capacity
        </text>

        {/* Legend */}
        <rect x={width - 220} y={10} width={14} height={14} fill="#e1f0fb" stroke="#0972d3" />
        <text x={width - 200} y={22} fontSize={11} fill="#16191f">
          Total params
        </text>
        <rect x={width - 220} y={30} width={14} height={14} fill="#0972d3" />
        <text x={width - 200} y={42} fontSize={11} fill="#16191f">
          Active params per token
        </text>

        {models.map((m, i) => {
          const y = margin.top + i * (rowH + rowGap);
          const totalW = (plotW * m.totalB) / maxTotal;
          const activeW = (plotW * m.activeB) / maxTotal;
          return (
            <g key={m.name}>
              <text
                x={margin.left - 10}
                y={y + rowH / 2 + 4}
                fontSize={12}
                fontWeight={600}
                fill="#16191f"
                textAnchor="end"
              >
                {m.name}
              </text>
              {/* Total bar (light) */}
              <rect
                x={margin.left}
                y={y}
                width={totalW}
                height={rowH}
                fill="#e1f0fb"
                stroke="#0972d3"
                strokeWidth={1}
              />
              {/* Active bar (overlaid) */}
              <rect
                x={margin.left}
                y={y}
                width={activeW}
                height={rowH}
                fill="#0972d3"
              />
              {/* Total label inside */}
              <text
                x={margin.left + totalW - 6}
                y={y + 16}
                fontSize={11}
                fontWeight={700}
                fill="#0972d3"
                textAnchor="end"
              >
                {`${m.totalB}B total`}
              </text>
              {/* Active label inside */}
              <text
                x={margin.left + 8}
                y={y + 32}
                fontSize={11}
                fontWeight={700}
                fill="#ffffff"
              >
                {`${m.activeB}B active`}
              </text>
              {/* Routing meta to the right */}
              <text
                x={margin.left + plotW + 10}
                y={y + 16}
                fontSize={11}
                fontWeight={600}
                fill="#16191f"
              >
                {m.topk}
              </text>
              <text
                x={margin.left + plotW + 10}
                y={y + 30}
                fontSize={10}
                fill="#687078"
              >
                {`${m.experts} experts`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
