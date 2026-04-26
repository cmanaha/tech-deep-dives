import React from 'react';

// Schematic cross-section of an HBM stack next to the accelerator die, showing the
// TSVs, the base logic die, the DRAM dies, the silicon interposer, and the PHY link.

export function HbmStackDiagram() {
  const width = 880;
  const height = 380;

  const stackX = 460;
  const stackW = 180;
  const baseY = 290;
  const dieH = 22;
  const dieGap = 4;
  const numDies = 8;

  const accelX = 90;
  const accelW = 280;
  const accelH = 60;
  const accelY = baseY - accelH;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="HBM stack cross section: 8 DRAM dies stacked on a base logic die connected to the accelerator die via through-silicon vias and a silicon interposer"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        {/* Package substrate */}
        <rect x={40} y={320} width={640} height={30} rx={4} fill="#414d5c" />
        <text x={360} y={342} fontSize={12} fontWeight={700} fill="#ffffff" textAnchor="middle">
          Package substrate
        </text>

        {/* Silicon interposer */}
        <rect x={60} y={300} width={600} height={22} fill="#8f9ba8" stroke="#414d5c" strokeWidth={1.5} />
        <text x={360} y={316} fontSize={11} fontWeight={700} fill="#ffffff" textAnchor="middle">
          Silicon interposer (2.5D packaging, &gt;1000 signal wires)
        </text>

        {/* Accelerator die (GPU / Trainium) */}
        <rect
          x={accelX}
          y={accelY}
          width={accelW}
          height={accelH}
          rx={4}
          fill="#232f3e"
          stroke="#16191f"
          strokeWidth={1.5}
        />
        <text
          x={accelX + accelW / 2}
          y={accelY + accelH / 2 - 6}
          fontSize={13}
          fontWeight={700}
          fill="#ffffff"
          textAnchor="middle"
        >
          Accelerator die
        </text>
        <text
          x={accelX + accelW / 2}
          y={accelY + accelH / 2 + 12}
          fontSize={11}
          fill="#d5dbdb"
          textAnchor="middle"
        >
          (GPU SMs, Tensor Cores, or Trainium NeuronCores)
        </text>

        {/* HBM Stack: base logic die + stacked DRAM dies */}
        {/* DRAM dies */}
        {Array.from({ length: numDies }).map((_, i) => {
          const y = baseY - dieH - (i + 1) * (dieH + dieGap);
          return (
            <g key={i}>
              <rect
                x={stackX}
                y={y}
                width={stackW}
                height={dieH}
                fill={i % 2 === 0 ? '#f2f8fd' : '#e1f0fb'}
                stroke="#0972d3"
                strokeWidth={1}
              />
              <text
                x={stackX + 10}
                y={y + 15}
                fontSize={10}
                fontWeight={600}
                fill="#0972d3"
              >
                {`DRAM die ${numDies - i}`}
              </text>
            </g>
          );
        })}
        {/* Base logic die */}
        <rect
          x={stackX}
          y={baseY - dieH}
          width={stackW}
          height={dieH}
          fill="#414d5c"
          stroke="#16191f"
          strokeWidth={1}
        />
        <text
          x={stackX + 10}
          y={baseY - dieH + 15}
          fontSize={10}
          fontWeight={700}
          fill="#ffffff"
        >
          Base logic die
        </text>

        {/* TSVs — vertical lines running through the stack */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = stackX + 20 + i * 16;
          return (
            <line
              key={`tsv-${i}`}
              x1={x}
              y1={baseY - dieH - numDies * (dieH + dieGap)}
              x2={x}
              y2={baseY - dieH + dieH}
              stroke="#d91515"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          );
        })}

        {/* TSV annotation */}
        <line x1={stackX + stackW + 10} y1={baseY - 140} x2={stackX + stackW + 60} y2={baseY - 140} stroke="#d91515" strokeWidth={1.5} />
        <text x={stackX + stackW + 65} y={baseY - 136} fontSize={11} fontWeight={600} fill="#d91515">
          TSVs (through-silicon vias)
        </text>
        <text x={stackX + stackW + 65} y={baseY - 120} fontSize={10} fill="#687078">
          1,024-bit bus per stack
        </text>

        {/* Label group header */}
        <text x={stackX + stackW / 2} y={40} fontSize={13} fontWeight={700} fill="#16191f" textAnchor="middle">
          HBM stack
        </text>
        <text x={stackX + stackW / 2} y={58} fontSize={11} fill="#687078" textAnchor="middle">
          8 DRAM dies + base logic
        </text>

        <text x={accelX + accelW / 2} y={40} fontSize={13} fontWeight={700} fill="#16191f" textAnchor="middle">
          Accelerator
        </text>
        <text x={accelX + accelW / 2} y={58} fontSize={11} fill="#687078" textAnchor="middle">
          (GH100 / GB100 / Trainium)
        </text>

        {/* PHY link between accelerator and stack along the interposer */}
        <line
          x1={accelX + accelW}
          y1={accelY + accelH / 2}
          x2={stackX}
          y2={baseY - dieH / 2}
          stroke="#037f0c"
          strokeWidth={3}
        />
        <text
          x={(accelX + accelW + stackX) / 2}
          y={accelY + 10}
          fontSize={11}
          fontWeight={700}
          fill="#037f0c"
          textAnchor="middle"
        >
          HBM PHY — ~6.4 / 8-9 Gb/s per pin
        </text>
        <text
          x={(accelX + accelW + stackX) / 2}
          y={accelY + 26}
          fontSize={10}
          fill="#687078"
          textAnchor="middle"
        >
          ×1024 pins per stack → TB/s per stack
        </text>
      </svg>
    </div>
  );
}
