import React from 'react';

// GB200 NVL72 — 72 Blackwell GPUs and 36 Grace CPUs in a single NVLink domain via NVSwitch fabric.
// Each GPU sees every other GPU at 1.8 TB/s; aggregate bandwidth ~130 TB/s.

export function Nvl72Diagram() {
  const width = 880;
  const height = 360;

  // 9 columns × 8 rows = 72 GPUs grid
  const cols = 9;
  const rows = 8;
  const gridStartX = 30;
  const gridStartY = 110;
  const cellW = 38;
  const cellH = 22;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="GB200 NVL72: 72 Blackwell GPUs and 36 Grace CPUs in one NVLink domain via NVSwitch, 1.8 TB/s GPU-to-GPU, 130 TB/s aggregate"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          GB200 NVL72 — 72 GPUs in a single NVLink domain
        </text>
        <text x={20} y={42} fontSize={11} fill="#687078">
          Every GPU reaches every other GPU at 1.8 TB/s. Aggregate NVLink bandwidth: 130 TB/s. Total GPU memory: 13.4 TB.
        </text>

        {/* GPU grid */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const x = gridStartX + c * (cellW + 6);
            const y = gridStartY + r * (cellH + 6);
            return (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y} width={cellW} height={cellH} rx={4} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.5} />
                <text x={x + cellW / 2} y={y + 15} fontSize={9} fontWeight={700} fill="#0972d3" textAnchor="middle">
                  B200
                </text>
              </g>
            );
          })
        )}

        {/* Bracket label for grid */}
        <text x={gridStartX} y={gridStartY - 8} fontSize={11} fontWeight={700} fill="#0972d3">
          72 × Blackwell B200 GPUs
        </text>

        {/* NVSwitch fabric */}
        <rect x={420} y={120} width={420} height={50} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={630} y={140} fontSize={13} fontWeight={700} fill="#037f0c" textAnchor="middle">
          NVSwitch fabric — full bisection bandwidth
        </text>
        <text x={630} y={158} fontSize={11} fill="#16191f" textAnchor="middle">
          1.8 TB/s GPU↔GPU · 130 TB/s aggregate
        </text>

        {/* Grace CPUs */}
        <rect x={420} y={186} width={420} height={70} rx={8} fill="#fdf3ec" stroke="#ec7211" strokeWidth={2} />
        <text x={630} y={206} fontSize={13} fontWeight={700} fill="#ec7211" textAnchor="middle">
          36 × Grace CPUs (LPDDR5X)
        </text>
        <text x={630} y={224} fontSize={11} fill="#16191f" textAnchor="middle">
          NVLink-C2C 900 GB/s coherent · 480 GB LPDDR5X / CPU at ~500 GB/s
        </text>
        <text x={630} y={244} fontSize={11} fill="#16191f" textAnchor="middle">
          Total NVL72 RAM: 13.4 TB HBM + 17.3 TB LPDDR5X
        </text>

        {/* MoE callout */}
        <rect x={420} y={272} width={420} height={68} rx={8} fill="#fce7e7" stroke="#d91515" strokeWidth={2} />
        <text x={630} y={292} fontSize={13} fontWeight={700} fill="#d91515" textAnchor="middle">
          The MoE-shaped fabric
        </text>
        <text x={630} y={310} fontSize={11} fill="#16191f" textAnchor="middle">
          EP=64 (DeepSeek-R1: 256 experts / 4 per GPU) fits inside one NVLink domain
        </text>
        <text x={630} y={328} fontSize={11} fill="#16191f" textAnchor="middle">
          MNNVL all-to-all avoids the InfiniBand cliff for inter-node experts
        </text>
      </svg>
    </div>
  );
}
