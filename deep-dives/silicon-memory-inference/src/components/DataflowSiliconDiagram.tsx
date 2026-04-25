import React from 'react';

// Side-by-side schematic of Groq LPU (deterministic dataflow with all weights in SRAM)
// and SambaNova SN40L (three-tier SRAM/HBM/DDR with reconfigurable dataflow units).

export function DataflowSiliconDiagram() {
  const width = 880;
  const height = 380;
  const colW = (width - 40) / 2;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Groq LPU dataflow tile vs SambaNova SN40L three-tier memory architecture"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Two dataflow architectures, two different memory bets
        </text>

        {/* Groq panel */}
        <rect x={20} y={50} width={colW} height={310} rx={8} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={36} y={78} fontSize={13} fontWeight={700} fill="#0972d3">
          Groq LPU
        </text>
        <text x={36} y={96} fontSize={11} fill="#687078">
          Deterministic dataflow · all weights in SRAM
        </text>

        {/* Groq tile schematic */}
        <rect x={36} y={120} width={colW - 32} height={110} rx={6} fill="#e1f0fb" stroke="#0972d3" strokeWidth={1.5} />
        <text x={36 + (colW - 32) / 2} y={144} fontSize={12} fontWeight={700} fill="#0972d3" textAnchor="middle">
          Streaming Processor (SP) tile
        </text>
        {/* Functional units across the tile */}
        {['VXM', 'MXM', 'SXM', 'MEM'].map((name, i) => (
          <g key={name}>
            <rect x={50 + i * 92} y={156} width={84} height={56} rx={4} fill="#ffffff" stroke="#0972d3" strokeWidth={1} />
            <text x={92 + i * 92} y={176} fontSize={11} fontWeight={700} fill="#0972d3" textAnchor="middle">
              {name}
            </text>
            <text x={92 + i * 92} y={194} fontSize={9} fill="#16191f" textAnchor="middle">
              {name === 'MEM' ? '230 MB SRAM' : name === 'MXM' ? 'matmul' : name === 'VXM' ? 'vector' : 'switch'}
            </text>
          </g>
        ))}

        <text x={36} y={252} fontSize={12} fontWeight={600} fill="#16191f">
          Memory model
        </text>
        <text x={36} y={268} fontSize={11} fill="#16191f">
          230 MB SRAM per chip · 80 TB/s on-chip BW
        </text>
        <text x={36} y={284} fontSize={11} fill="#16191f">
          No HBM, no DRAM in the inference path
        </text>

        <text x={36} y={310} fontSize={12} fontWeight={600} fill="#16191f">
          Production
        </text>
        <text x={36} y={326} fontSize={11} fill="#16191f">
          INT8. Llama 4 Scout 460+ tokens/s reported.
        </text>
        <text x={36} y={342} fontSize={11} fontStyle="italic" fill="#0972d3">
          Bet: deterministic schedule + on-chip weights.
        </text>

        {/* SambaNova panel */}
        <rect x={20 + colW + 10} y={50} width={colW - 10} height={310} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={20 + colW + 26} y={78} fontSize={13} fontWeight={700} fill="#037f0c">
          SambaNova SN40L
        </text>
        <text x={20 + colW + 26} y={96} fontSize={11} fill="#687078">
          Three-tier memory · reconfigurable dataflow
        </text>

        {/* Tier stack */}
        {[
          { tier: 'On-chip SRAM', cap: '~520 MB', bw: 'TB/s class', y: 116, color: '#ffffff' },
          { tier: 'HBM3', cap: '64 GB', bw: '~3 TB/s', y: 158, color: '#ecf7ec' },
          { tier: 'DDR-attached', cap: 'up to 1.5 TB', bw: 'GB/s class', y: 200, color: '#fdf3ec' },
        ].map((t) => (
          <g key={t.tier}>
            <rect x={20 + colW + 26} y={t.y} width={colW - 42} height={36} rx={4} fill={t.color} stroke="#037f0c" strokeWidth={1.5} />
            <text x={20 + colW + 36} y={t.y + 22} fontSize={11} fontWeight={700} fill="#037f0c">
              {t.tier}
            </text>
            <text x={20 + colW + 200} y={t.y + 22} fontSize={11} fill="#16191f">
              {t.cap}
            </text>
            <text x={20 + colW + 320} y={t.y + 22} fontSize={11} fill="#687078">
              {t.bw}
            </text>
          </g>
        ))}

        <text x={20 + colW + 26} y={258} fontSize={12} fontWeight={600} fill="#16191f">
          Programming model
        </text>
        <text x={20 + colW + 26} y={274} fontSize={11} fill="#16191f">
          Reconfigurable dataflow units (RDUs);
        </text>
        <text x={20 + colW + 26} y={290} fontSize={11} fill="#16191f">
          compiler maps the model graph to the RDU mesh.
        </text>

        <text x={20 + colW + 26} y={316} fontSize={12} fontWeight={600} fill="#16191f">
          Samba-CoE
        </text>
        <text x={20 + colW + 26} y={332} fontSize={11} fill="#16191f">
          150 experts, 1T parameters, 3.7× DGX H100 (8 sockets)
        </text>
        <text x={20 + colW + 26} y={350} fontSize={11} fontStyle="italic" fill="#037f0c">
          Bet: tier the memory, host more experts.
        </text>
      </svg>
    </div>
  );
}
