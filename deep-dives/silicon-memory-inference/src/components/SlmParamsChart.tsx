import React from 'react';

interface SlmRow {
  name: string;
  paramsB: number;
  context: string;
  vendor: string;
}

const slms: SlmRow[] = [
  { name: 'SmolLM2 135M', paramsB: 0.135, context: '8K', vendor: 'Hugging Face' },
  { name: 'SmolLM2 360M', paramsB: 0.36, context: '8K', vendor: 'Hugging Face' },
  { name: 'Qwen 2.5 0.5B', paramsB: 0.5, context: '32K', vendor: 'Alibaba' },
  { name: 'Gemma 3 1B', paramsB: 1, context: '32K', vendor: 'Google' },
  { name: 'Llama 3.2 1B', paramsB: 1.23, context: '128K', vendor: 'Meta' },
  { name: 'Qwen 2.5 1.5B', paramsB: 1.5, context: '32K', vendor: 'Alibaba' },
  { name: 'SmolLM2 1.7B', paramsB: 1.7, context: '8K', vendor: 'Hugging Face' },
  { name: 'Gemma 2 2B', paramsB: 2, context: '8K', vendor: 'Google' },
  { name: 'Llama 3.2 3B', paramsB: 3.21, context: '128K', vendor: 'Meta' },
  { name: 'Phi-3-mini 3.8B', paramsB: 3.8, context: '4K / 128K', vendor: 'Microsoft' },
  { name: 'Gemma 3 4B', paramsB: 4, context: '128K', vendor: 'Google' },
  { name: 'Mistral 7B', paramsB: 7.3, context: '32K (sliding window)', vendor: 'Mistral' },
  { name: 'Qwen 2.5 7B', paramsB: 7, context: '128K', vendor: 'Alibaba' },
  { name: 'Phi-4 14B', paramsB: 14, context: '16K', vendor: 'Microsoft' },
];

export function SlmParamsChart() {
  const width = 880;
  const rowH = 28;
  const rowGap = 4;
  const margin = { top: 50, left: 170, right: 220, bottom: 30 };
  const height = margin.top + slms.length * (rowH + rowGap) + 30;
  const plotW = width - margin.left - margin.right;
  const maxParams = 16;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Small Language Model lineup with parameter counts in billions, context windows, and vendor"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={margin.left} y={20} fontSize={13} fontWeight={700} fill="#16191f">
          The SLM lineup — from 135M to 14B parameters
        </text>
        <text x={margin.left} y={36} fontSize={11} fill="#687078">
          All figures from each model&apos;s Hugging Face card or vendor blog
        </text>

        {slms.map((m, i) => {
          const y = margin.top + i * (rowH + rowGap);
          const w = (plotW * m.paramsB) / maxParams;
          return (
            <g key={m.name}>
              <text x={margin.left - 10} y={y + rowH / 2 + 4} fontSize={11} fontWeight={600} fill="#16191f" textAnchor="end">
                {m.name}
              </text>
              <rect x={margin.left} y={y} width={w} height={rowH} rx={3} fill="#0972d3" stroke="#0972d3" strokeWidth={1} />
              <text x={margin.left + w + 6} y={y + rowH / 2 + 4} fontSize={11} fontWeight={700} fill="#0972d3">
                {`${m.paramsB}B`}
              </text>
              <text x={margin.left + plotW + 12} y={y + rowH / 2 + 4} fontSize={10} fill="#687078">
                {`${m.context} · ${m.vendor}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
