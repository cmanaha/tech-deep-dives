import React from 'react';

// Cerebras WSE-3 — schematic of the wafer-scale die showing the PE grid, on-wafer SRAM,
// no HBM. Compared to a typical GPU package for size context.

export function CerebrasWaferDiagram() {
  const width = 880;
  const height = 380;
  const waferCx = 230;
  const waferCy = 200;
  const waferR = 150;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Cerebras WSE-3 wafer with 900,000 cores and 44 GB on-wafer SRAM versus a typical GPU package with 4-8 HBM stacks"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Cerebras WSE-3 — the wafer is the chip
        </text>
        <text x={20} y={42} fontSize={11} fill="#687078">
          900,000 cores · 44 GB on-wafer SRAM · 21 PB/s memory bandwidth · no HBM in the steady state
        </text>

        {/* Wafer outline */}
        <circle cx={waferCx} cy={waferCy} r={waferR} fill="#f2f8fd" stroke="#0972d3" strokeWidth={3} />

        {/* PE grid pattern */}
        {Array.from({ length: 14 }).map((_, r) =>
          Array.from({ length: 14 }).map((__, c) => {
            const x = waferCx - 120 + c * 18;
            const y = waferCy - 120 + r * 18;
            const distFromCenter = Math.sqrt(
              Math.pow(x - waferCx, 2) + Math.pow(y - waferCy, 2)
            );
            if (distFromCenter > waferR - 15) return null;
            return (
              <rect
                key={`pe-${r}-${c}`}
                x={x}
                y={y}
                width={14}
                height={14}
                fill="#e1f0fb"
                stroke="#0972d3"
                strokeWidth={0.5}
              />
            );
          })
        )}

        {/* Center label */}
        <rect x={waferCx - 70} y={waferCy - 14} width={140} height={28} rx={4} fill="#0972d3" />
        <text x={waferCx} y={waferCy + 6} fontSize={12} fontWeight={700} fill="#ffffff" textAnchor="middle">
          900,000 PEs
        </text>

        {/* Wafer caption */}
        <text x={waferCx} y={waferCy + waferR + 24} fontSize={11} fontWeight={700} fill="#0972d3" textAnchor="middle">
          WSE-3 — 46,225 mm² silicon
        </text>

        {/* GPU package (right side, for scale) */}
        <rect x={500} y={70} width={350} height={240} rx={10} fill="#ffffff" stroke="#414d5c" strokeWidth={2} />
        <text x={520} y={94} fontSize={13} fontWeight={700} fill="#414d5c">
          For scale: a typical GPU package
        </text>

        {/* Accelerator die center */}
        <rect x={620} y={150} width={100} height={70} rx={4} fill="#232f3e" stroke="#16191f" strokeWidth={1.5} />
        <text x={670} y={180} fontSize={10} fontWeight={700} fill="#ffffff" textAnchor="middle">GPU die</text>
        <text x={670} y={196} fontSize={9} fill="#d5dbdb" textAnchor="middle">(reticle-sized)</text>

        {/* HBM stacks left of GPU */}
        {[0, 1].map((i) => (
          <g key={`hbm-l-${i}`}>
            <rect x={550} y={150 + i * 36} width={50} height={28} rx={3} fill="#fce7e7" stroke="#d91515" strokeWidth={1} />
            <text x={575} y={168 + i * 36} fontSize={9} fontWeight={700} fill="#d91515" textAnchor="middle">HBM</text>
          </g>
        ))}
        {/* HBM stacks right */}
        {[0, 1].map((i) => (
          <g key={`hbm-r-${i}`}>
            <rect x={740} y={150 + i * 36} width={50} height={28} rx={3} fill="#fce7e7" stroke="#d91515" strokeWidth={1} />
            <text x={765} y={168 + i * 36} fontSize={9} fontWeight={700} fill="#d91515" textAnchor="middle">HBM</text>
          </g>
        ))}

        <text x={520} y={250} fontSize={11} fill="#16191f">
          GPU die: ~800 mm². HBM stacks: 80-288 GB total.
        </text>
        <text x={520} y={268} fontSize={11} fill="#16191f">
          The accelerator and the memory are separate packages.
        </text>
        <text x={520} y={290} fontSize={11} fontStyle="italic" fill="#0972d3">
          Cerebras WSE-3 silicon area is ~57× a flagship GPU die,
        </text>
        <text x={520} y={306} fontSize={11} fontStyle="italic" fill="#0972d3">
          and there is no off-package memory to traverse.
        </text>
      </svg>
    </div>
  );
}
