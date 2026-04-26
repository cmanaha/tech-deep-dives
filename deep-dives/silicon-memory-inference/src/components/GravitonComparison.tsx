import React from 'react';

// Side-by-side schematic comparison of Graviton4 (Neoverse V2 + CMN-700, 96 cores, 36 MB SLC)
// vs Graviton5 (Neoverse V3 + CMN-S3, 192 cores, 192 MB distributed L3).

export function GravitonComparison() {
  const width = 880;
  const height = 360;
  const colW = (width - 60) / 2;
  const colY = 60;
  const colH = 270;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Graviton4 vs Graviton5: 96 cores with 36 MB SLC on CMN-700 versus 192 cores with 192 MB distributed L3 on CMN-S3"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          Graviton4 → Graviton5: doubling cores while changing the cache philosophy
        </text>

        {/* Graviton4 panel */}
        <rect x={20} y={colY} width={colW} height={colH} rx={8} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={32} y={84} fontSize={13} fontWeight={700} fill="#0972d3">
          Graviton4 — Neoverse V2
        </text>
        <text x={32} y={102} fontSize={11} fill="#687078">
          ARMv9.0 · TSMC N4/N5 · 2.8 GHz
        </text>
        <text x={32} y={130} fontSize={12} fontWeight={600} fill="#16191f">
          Compute
        </text>
        <text x={32} y={146} fontSize={11} fill="#16191f">
          96 cores in a single socket
        </text>
        <text x={32} y={170} fontSize={12} fontWeight={600} fill="#16191f">
          Cache
        </text>
        <text x={32} y={186} fontSize={11} fill="#16191f">
          L1: 64+64 KB · L2: 2 MB / core · L3: 36 MB SLC (CMN-700)
        </text>
        <text x={32} y={202} fontSize={11} fill="#16191f">
          ~375 KB SLC per core
        </text>
        <text x={32} y={226} fontSize={12} fontWeight={600} fill="#16191f">
          DRAM
        </text>
        <text x={32} y={242} fontSize={11} fill="#16191f">
          12 × DDR5-5600 = 537.6 GB/s · 5.6 GB/s per core
        </text>
        <text x={32} y={266} fontSize={12} fontWeight={600} fill="#16191f">
          Inter-core latency
        </text>
        <text x={32} y={282} fontSize={11} fill="#16191f">
          30-60 ns (CMN-700 mesh) · 138 ns cross-socket
        </text>
        <text x={32} y={314} fontSize={11} fontStyle="italic" fill="#0972d3">
          The SLC is unified and modest; per-core cache footprint is small.
        </text>

        {/* Arrow */}
        <line x1={20 + colW + 10} y1={colY + colH / 2} x2={40 + colW + 30} y2={colY + colH / 2} stroke="#16191f" strokeWidth={2} />
        <polygon points={`${40 + colW + 30},${colY + colH / 2} ${40 + colW + 22},${colY + colH / 2 - 6} ${40 + colW + 22},${colY + colH / 2 + 6}`} fill="#16191f" />

        {/* Graviton5 panel */}
        <rect x={40 + colW + 40} y={colY} width={colW} height={colH} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={40 + colW + 52} y={84} fontSize={13} fontWeight={700} fill="#037f0c">
          Graviton5 — Neoverse V3
        </text>
        <text x={40 + colW + 52} y={102} fontSize={11} fill="#687078">
          ARMv9.2 · TSMC 3 nm · 3.1 GHz
        </text>
        <text x={40 + colW + 52} y={130} fontSize={12} fontWeight={600} fill="#16191f">
          Compute
        </text>
        <text x={40 + colW + 52} y={146} fontSize={11} fill="#16191f">
          192 cores in a single socket (2× Graviton4)
        </text>
        <text x={40 + colW + 52} y={170} fontSize={12} fontWeight={600} fill="#16191f">
          Cache
        </text>
        <text x={40 + colW + 52} y={186} fontSize={11} fill="#16191f">
          L1: 64+64 KB · L2: 2 MB / core · L3: 192 MB distributed (CMN-S3)
        </text>
        <text x={40 + colW + 52} y={202} fontSize={11} fontWeight={700} fill="#037f0c">
          1 MB L3 per core (2.67× G4)
        </text>
        <text x={40 + colW + 52} y={226} fontSize={12} fontWeight={600} fill="#16191f">
          DRAM
        </text>
        <text x={40 + colW + 52} y={242} fontSize={11} fill="#16191f">
          12 × DDR5-7200 = 691.2 GB/s · 3.6 GB/s per core (-36%)
        </text>
        <text x={40 + colW + 52} y={266} fontSize={12} fontWeight={600} fill="#16191f">
          Inter-core latency
        </text>
        <text x={40 + colW + 52} y={282} fontSize={11} fill="#16191f">
          ~33% lower vs G4 (AWS claim) · NUMA eliminated
        </text>
        <text x={40 + colW + 52} y={314} fontSize={11} fontStyle="italic" fill="#037f0c">
          L3 grows 5.3× to compensate for per-core DRAM bandwidth dropping.
        </text>
      </svg>
    </div>
  );
}
