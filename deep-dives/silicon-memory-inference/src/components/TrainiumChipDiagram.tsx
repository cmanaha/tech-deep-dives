import React from 'react';

// Trainium2 chip layout: NeuronCore-v3 array, SBUF + PSUM scratchpads, CC-Cores for collectives,
// HBM stacks, NeuronLink-v3 fabric. Diagram is schematic, not to scale.

export function TrainiumChipDiagram() {
  const width = 880;
  const height = 380;
  const chipX = 110;
  const chipY = 60;
  const chipW = 660;
  const chipH = 280;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Trainium2 chip layout: 8 NeuronCore-v3 with SBUF and PSUM scratchpads, 16 CC-Cores for collectives, HBM stacks, NeuronLink-v3 fabric"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Trainium2 chip — schematic layout
        </text>
        <text x={20} y={42} fontSize={11} fill="#687078">
          8 NeuronCore-v3 · 16 CC-Cores · 96 GiB HBM at 2.9 TB/s · NeuronLink-v3 fabric
        </text>

        {/* HBM stacks left and right */}
        {[chipX - 80, chipX + chipW + 10].map((x, i) => (
          <g key={`hbm-${i}`}>
            <rect x={x} y={chipY + 30} width={70} height={220} rx={6} fill="#fce7e7" stroke="#d91515" strokeWidth={2} />
            <text x={x + 35} y={chipY + 60} fontSize={11} fontWeight={700} fill="#d91515" textAnchor="middle">HBM stack</text>
            <text x={x + 35} y={chipY + 78} fontSize={10} fill="#16191f" textAnchor="middle">96 GiB total</text>
            <text x={x + 35} y={chipY + 94} fontSize={10} fill="#16191f" textAnchor="middle">across stacks</text>
            <text x={x + 35} y={chipY + 132} fontSize={10} fill="#16191f" textAnchor="middle">2.9 TB/s</text>
            <text x={x + 35} y={chipY + 148} fontSize={10} fill="#16191f" textAnchor="middle">aggregate</text>
          </g>
        ))}

        {/* Trainium2 die outline */}
        <rect x={chipX} y={chipY} width={chipW} height={chipH} rx={10} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={chipX + 16} y={chipY + 22} fontSize={13} fontWeight={700} fill="#0972d3">Trainium2 die</text>

        {/* NeuronCores grid (2 rows × 4) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const r = Math.floor(i / 4);
          const c = i % 4;
          const ncW = 130;
          const ncH = 80;
          const ncX = chipX + 16 + c * (ncW + 12);
          const ncY = chipY + 40 + r * (ncH + 12);
          return (
            <g key={i}>
              <rect x={ncX} y={ncY} width={ncW} height={ncH} rx={6} fill="#ecf7ec" stroke="#037f0c" strokeWidth={1.5} />
              <text x={ncX + ncW / 2} y={ncY + 18} fontSize={11} fontWeight={700} fill="#037f0c" textAnchor="middle">
                NeuronCore-v3 #{i + 1}
              </text>
              <text x={ncX + ncW / 2} y={ncY + 36} fontSize={10} fill="#16191f" textAnchor="middle">
                Systolic array
              </text>
              <text x={ncX + ncW / 2} y={ncY + 52} fontSize={10} fill="#16191f" textAnchor="middle">
                SBUF 28 MiB
              </text>
              <text x={ncX + ncW / 2} y={ncY + 68} fontSize={10} fill="#16191f" textAnchor="middle">
                PSUM 2 MiB
              </text>
            </g>
          );
        })}

        {/* CC-Core row */}
        <rect x={chipX + 16} y={chipY + 224} width={chipW - 32} height={42} rx={6} fill="#fdf3ec" stroke="#ec7211" strokeWidth={1.5} />
        <text x={chipX + chipW / 2} y={chipY + 244} fontSize={12} fontWeight={700} fill="#ec7211" textAnchor="middle">
          16 × CC-Cores — Collective Communication
        </text>
        <text x={chipX + chipW / 2} y={chipY + 260} fontSize={10} fill="#16191f" textAnchor="middle">
          Carries on-chip, on-host, and cross-host collectives — including future All-to-All-v for MoE
        </text>

        {/* NeuronLink fabric label */}
        <text x={width / 2} y={height - 10} fontSize={11} fill="#687078" textAnchor="middle">
          NeuronLink-v3 — 1.28 TB/s per chip intra-node · 256 GB/s per chip inter-instance · Trn2 UltraServer = 64 chips in a 3D Torus
        </text>
      </svg>
    </div>
  );
}
