import React from 'react';

// Schematic of compute-in-memory: arithmetic units placed inside DRAM banks (Samsung HBM-PIM)
// or memory arrays (HyperCIM-class). Contrasts with conventional von Neumann path.

export function CimDiagram() {
  const width = 880;
  const height = 380;
  const colW = (width - 60) / 2;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Conventional von Neumann path versus compute-in-memory path; arithmetic units inside the DRAM bank or memory array eliminate bus traversal"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Compute-in-Memory — moving compute to where the data lives
        </text>

        {/* Left: conventional path. Panel spans x=20..(20+colW). All inner shapes
            sized to fit inside that panel — DRAM box stays well within the panel
            right edge so it does not clip into the right (CIM) panel. */}
        <rect x={20} y={50} width={colW} height={310} rx={8} fill="#fce7e7" stroke="#d91515" strokeWidth={2} />
        <text x={36} y={78} fontSize={13} fontWeight={700} fill="#d91515">
          Conventional von Neumann
        </text>
        <text x={36} y={96} fontSize={11} fill="#687078">
          Compute and memory are separated by the bus
        </text>

        {/* Compute box */}
        <rect x={36} y={120} width={120} height={60} rx={6} fill="#ffffff" stroke="#d91515" strokeWidth={1.5} />
        <text x={96} y={144} fontSize={12} fontWeight={700} fill="#d91515" textAnchor="middle">CPU / GPU</text>
        <text x={96} y={162} fontSize={10} fill="#16191f" textAnchor="middle">Functional units</text>

        {/* Bus */}
        <rect x={170} y={138} width={80} height={28} rx={4} fill="#fdf3ec" stroke="#ec7211" strokeWidth={1.5} />
        <text x={210} y={156} fontSize={11} fontWeight={700} fill="#ec7211" textAnchor="middle">DDR / HBM bus</text>

        {/* Memory box — fits within the left panel (right edge at x=384 vs panel right edge ~430) */}
        <rect x={264} y={120} width={120} height={60} rx={6} fill="#ffffff" stroke="#d91515" strokeWidth={1.5} />
        <text x={324} y={144} fontSize={12} fontWeight={700} fill="#d91515" textAnchor="middle">DRAM array</text>
        <text x={324} y={162} fontSize={10} fill="#16191f" textAnchor="middle">Bytes</text>

        {/* Arrows — recoordinated to match the new shape positions */}
        <line x1={156} y1={150} x2={169} y2={150} stroke="#16191f" strokeWidth={2} markerEnd="url(#arrowR1)" />
        <line x1={250} y1={150} x2={263} y2={150} stroke="#16191f" strokeWidth={2} markerEnd="url(#arrowR1)" />
        <line x1={263} y1={170} x2={251} y2={170} stroke="#16191f" strokeWidth={2} markerEnd="url(#arrowL1)" />
        <line x1={169} y1={170} x2={157} y2={170} stroke="#16191f" strokeWidth={2} markerEnd="url(#arrowL1)" />

        <text x={36} y={210} fontSize={12} fontWeight={600} fill="#16191f">
          Energy cost
        </text>
        <text x={36} y={226} fontSize={11} fill="#16191f">
          Moving a byte across the bus: dominant per-op cost
        </text>
        <text x={36} y={242} fontSize={11} fill="#16191f">
          Per-op energy is mostly transport, not arithmetic
        </text>

        <text x={36} y={272} fontSize={12} fontWeight={600} fill="#16191f">
          What we live with
        </text>
        <text x={36} y={288} fontSize={11} fill="#16191f">
          The bandwidth wall (Section 6) is a transport limit
        </text>
        <text x={36} y={304} fontSize={11} fill="#16191f">
          Every architecture so far has been some flavor of this
        </text>

        {/* Right: CIM */}
        <rect x={40 + colW} y={50} width={colW} height={310} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={56 + colW} y={78} fontSize={13} fontWeight={700} fill="#037f0c">
          Compute-in-Memory
        </text>
        <text x={56 + colW} y={96} fontSize={11} fill="#687078">
          Arithmetic units inside the memory array
        </text>

        {/* Memory array with embedded compute */}
        <rect x={56 + colW} y={120} width={colW - 32} height={110} rx={6} fill="#ffffff" stroke="#037f0c" strokeWidth={1.5} />
        <text x={56 + colW + (colW - 32) / 2} y={140} fontSize={12} fontWeight={700} fill="#037f0c" textAnchor="middle">
          DRAM bank (or SRAM array)
        </text>
        {/* Bank cells with embedded compute units */}
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={`bank-${i}`}>
            <rect
              x={70 + colW + i * (colW - 60) / 4}
              y={154}
              width={(colW - 60) / 4 - 4}
              height={32}
              fill="#e1f0fb"
              stroke="#037f0c"
              strokeWidth={1}
            />
            <text
              x={70 + colW + i * (colW - 60) / 4 + ((colW - 60) / 4 - 4) / 2}
              y={174}
              fontSize={10}
              fontWeight={700}
              fill="#037f0c"
              textAnchor="middle"
            >
              cells
            </text>
            {/* embedded compute unit indicator */}
            <rect
              x={70 + colW + i * (colW - 60) / 4 + 6}
              y={194}
              width={(colW - 60) / 4 - 16}
              height={20}
              fill="#fdf3ec"
              stroke="#ec7211"
              strokeWidth={1}
            />
            <text
              x={70 + colW + i * (colW - 60) / 4 + ((colW - 60) / 4 - 4) / 2}
              y={208}
              fontSize={9}
              fontWeight={700}
              fill="#ec7211"
              textAnchor="middle"
            >
              ALU
            </text>
          </g>
        ))}

        <text x={56 + colW} y={252} fontSize={12} fontWeight={600} fill="#16191f">
          Production examples
        </text>
        <text x={56 + colW} y={268} fontSize={11} fill="#16191f">
          Samsung HBM-PIM — Aquabolt-XL: GEMV 8.9× speedup
        </text>
        <text x={56 + colW} y={284} fontSize={11} fill="#16191f">
          HyperCIM — multi-database / data-fabric LPU
        </text>

        <text x={56 + colW} y={310} fontSize={12} fontWeight={600} fill="#16191f">
          Trade-off
        </text>
        <text x={56 + colW} y={326} fontSize={11} fill="#16191f">
          Constrained operator set; analog or digital cells
        </text>
        <text x={56 + colW} y={342} fontSize={11} fontStyle="italic" fill="#037f0c">
          Bet: eliminate the dominant cost (data movement)
        </text>

        <defs>
          <marker id="arrowR1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16191f" />
          </marker>
          <marker id="arrowL1" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#16191f" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
