import React from 'react';

// Cerebras WSE-3 against an H100 die (areas to scale) and a schematic GPU package, plus the
// layer split that carries a model larger than one wafer. Numbers are cited in the section
// text and captions (src/sections/CerebrasWaferScale.tsx).

const blue = '#0972d3';
const blueDark = '#065299';
const blueTint = '#f2f8fd';
const blueCell = '#e1f0fb';
const ink = '#16191f';
const muted = '#5f6b7a';
const slate = '#414d5c';
const amber = '#8b6c00';
const amberFill = '#fbf3d5';
const green = '#037f0c';
const font = 'sans-serif';

const wideSvgStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 640,
  height: 'auto',
  display: 'block',
};

/**
 * WSE-3 side 280 units for 46,225 mm2 (215 mm a side). An H100 die of 814 mm2 at the same
 * scale is 280 * sqrt(814 / 46225), about 37 units a side.
 */
const WAFER_SIDE = 280;
const H100_SIDE = Math.round(WAFER_SIDE * Math.sqrt(814 / 46225));

export function CerebrasWaferDiagram() {
  const wx = 30;
  const wy = 76;
  const cells = 13;
  const pitch = WAFER_SIDE / cells;
  const dieX = 360;
  const dieY = wy + WAFER_SIDE - H100_SIDE;
  const label = { x: wx + 46, y: wy + 108, w: 188, h: 64 };

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox="0 0 860 420" role="img" aria-labelledby="cerebras-wafer-title" style={wideSvgStyle}>
        <title id="cerebras-wafer-title">
          A Cerebras WSE-3 is one 46,225 square millimetre die, about 57 times the area of an H100
          die drawn to the same scale, with 900,000 cores and 44 GB of SRAM on the same silicon. A
          GPU keeps its 80 to 288 GB of HBM in separate stacks beside the die, so every weight read
          crosses from a stack to the die.
        </title>
        <rect x={0} y={0} width={860} height={420} rx={8} fill="#ffffff" stroke="#e9ebed" />

        <text x={30} y={30} fontSize={13} fontWeight={600} fill={ink} fontFamily={font}>
          Cerebras WSE-3: the wafer is the chip
        </text>
        <text x={30} y={50} fontSize={11} fill={muted} fontFamily={font}>
          900,000 cores, 44 GB of on-wafer SRAM, 21 PB/s. The WSE-3T in CS-4 keeps the cores and
          SRAM at 43.2 PB/s.
        </text>

        {/* WSE-3 square with a core grid */}
        <rect x={wx} y={wy} width={WAFER_SIDE} height={WAFER_SIDE} fill={blueTint} stroke={blue} strokeWidth={2} />
        {Array.from({ length: cells }).map((_, r) =>
          Array.from({ length: cells }).map((__, c) => {
            const x = wx + c * pitch + 2;
            const y = wy + r * pitch + 2;
            const size = pitch - 4;
            const underLabel =
              x + size > label.x && x < label.x + label.w && y + size > label.y && y < label.y + label.h;
            if (underLabel) return null;
            return (
              <rect
                key={`pe-${r}-${c}`}
                x={x}
                y={y}
                width={size}
                height={size}
                fill={blueCell}
                stroke={blue}
                strokeWidth={0.5}
              />
            );
          })
        )}
        <rect x={label.x} y={label.y} width={label.w} height={label.h} rx={4} fill={blue} stroke={blueDark} />
        <text x={wx + 140} y={wy + 136} fontSize={13} fontWeight={600} fill="#ffffff" textAnchor="middle" fontFamily={font}>
          900,000 cores
        </text>
        <text x={wx + 140} y={wy + 156} fontSize={11} fill="#ffffff" textAnchor="middle" fontFamily={font}>
          48 kB of SRAM each
        </text>
        <text x={wx + 140} y={wy + WAFER_SIDE + 22} fontSize={12} fontWeight={600} fill={blue} textAnchor="middle" fontFamily={font}>
          WSE-3: 46,225 mm²
        </text>
        <text x={wx + 140} y={wy + WAFER_SIDE + 40} fontSize={11} fill={muted} textAnchor="middle" fontFamily={font}>
          weights stay here for inference
        </text>

        {/* H100 die at the same scale */}
        <rect x={dieX} y={dieY} width={H100_SIDE} height={H100_SIDE} fill="#232f3e" stroke={ink} />
        <text x={dieX + H100_SIDE / 2} y={wy + WAFER_SIDE + 22} fontSize={12} fontWeight={600} fill={ink} textAnchor="middle" fontFamily={font}>
          H100 die: 814 mm²
        </text>
        <text x={dieX + H100_SIDE / 2} y={wy + WAFER_SIDE + 40} fontSize={11} fill={muted} textAnchor="middle" fontFamily={font}>
          same scale
        </text>

        {/* GPU package, schematic */}
        <rect x={480} y={wy} width={350} height={WAFER_SIDE} rx={10} fill="#ffffff" stroke={slate} strokeWidth={1.5} />
        <text x={500} y={wy + 26} fontSize={13} fontWeight={600} fill={slate} fontFamily={font}>
          GPU package (schematic, not to scale)
        </text>
        <rect x={505} y={wy + 50} width={300} height={120} rx={6} fill="#f4f4f4" stroke="#879596" />
        <text x={515} y={wy + 66} fontSize={10} fill={muted} fontFamily={font}>
          silicon interposer
        </text>
        <rect x={605} y={wy + 78} width={100} height={76} rx={4} fill="#232f3e" stroke={ink} />
        <text x={655} y={wy + 120} fontSize={11} fontWeight={600} fill="#ffffff" textAnchor="middle" fontFamily={font}>
          GPU die
        </text>
        {[0, 1].map((i) => (
          <g key={`hbm-${i}`}>
            <rect x={525} y={wy + 78 + i * 42} width={60} height={34} rx={3} fill={amberFill} stroke={amber} />
            <text x={555} y={wy + 99 + i * 42} fontSize={11} fontWeight={600} fill={amber} textAnchor="middle" fontFamily={font}>
              HBM
            </text>
            <rect x={725} y={wy + 78 + i * 42} width={60} height={34} rx={3} fill={amberFill} stroke={amber} />
            <text x={755} y={wy + 99 + i * 42} fontSize={11} fontWeight={600} fill={amber} textAnchor="middle" fontFamily={font}>
              HBM
            </text>
          </g>
        ))}
        <text x={500} y={wy + 200} fontSize={11} fill={ink} fontFamily={font}>
          HBM stacks sit beside the die:
        </text>
        <text x={500} y={wy + 218} fontSize={11} fill={ink} fontFamily={font}>
          80 GB on an H100, 288 GB on a B300.
        </text>
        <text x={500} y={wy + 244} fontSize={11} fill={amber} fontFamily={font}>
          Every weight read crosses from stack to die.
        </text>
      </svg>
    </div>
  );
}

const splitWafers = [
  { x: 20, name: 'Wafer 1', layers: 'Layers 1 to k' },
  { x: 320, name: 'Wafer 2', layers: 'Layers k+1 to m' },
  { x: 620, name: 'Wafer 3', layers: 'Layers m+1 to n' },
];

export function CerebrasLayerSplitDiagram() {
  const boxW = 220;
  const top = 56;
  const boxH = 176;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox="0 0 860 284" role="img" aria-labelledby="cerebras-split-title" style={wideSvgStyle}>
        <title id="cerebras-split-title">
          A model larger than one wafer is split at layer boundaries. Each wafer holds whole layers,
          including the router and every expert of a mixture-of-experts layer, so expert routing
          stays on one wafer. Only activations cross the wafer-to-wafer links, which take at least
          2 microseconds on CS-4.
        </title>
        <defs>
          <marker id="cerebras-split-ah" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={green} />
          </marker>
        </defs>
        <rect x={0} y={0} width={860} height={284} rx={8} fill="#ffffff" stroke="#e9ebed" />
        <text x={20} y={30} fontSize={13} fontWeight={600} fill={ink} fontFamily={font}>
          A model larger than one wafer, split at layer boundaries
        </text>

        {splitWafers.map((w) => (
          <g key={w.name}>
            <rect x={w.x} y={top} width={boxW} height={boxH} rx={8} fill={blueTint} stroke={blue} strokeWidth={1.5} />
            <text x={w.x + 14} y={top + 24} fontSize={13} fontWeight={600} fill={ink} fontFamily={font}>
              {w.name}
            </text>
            <text x={w.x + 14} y={top + 42} fontSize={11} fill={muted} fontFamily={font}>
              {w.layers}
            </text>
            <rect x={w.x + 14} y={top + 54} width={boxW - 28} height={64} rx={4} fill="#ffffff" stroke={blue} />
            <text x={w.x + 24} y={top + 72} fontSize={11} fontWeight={600} fill={blueDark} fontFamily={font}>
              MoE layer: router + every expert
            </text>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={`${w.name}-e${i}`}
                x={w.x + 24 + i * 22}
                y={top + 84}
                width={16}
                height={22}
                rx={2}
                fill={blueCell}
                stroke={blue}
                strokeWidth={0.75}
              />
            ))}
            <text x={w.x + 14} y={top + 140} fontSize={11} fill={ink} fontFamily={font}>
              Weights in on-wafer SRAM
            </text>
            <text x={w.x + 14} y={top + 158} fontSize={11} fill={ink} fontFamily={font}>
              Expert routing stays on this wafer
            </text>
          </g>
        ))}

        {[0, 1].map((i) => {
          const x1 = splitWafers[i].x + boxW + 6;
          const x2 = splitWafers[i + 1].x - 6;
          const mid = (x1 + x2) / 2;
          return (
            <g key={`link-${i}`}>
              <line x1={x1} y1={top + 92} x2={x2} y2={top + 92} stroke={green} strokeWidth={2} markerEnd="url(#cerebras-split-ah)" />
              <text x={mid} y={top + 80} fontSize={10} fontWeight={600} fill={green} textAnchor="middle" fontFamily={font}>
                activations
              </text>
              <text x={mid} y={top + 112} fontSize={10} fill={green} textAnchor="middle" fontFamily={font}>
                2 µs or more
              </text>
            </g>
          );
        })}

        <rect x={20} y={top + boxH + 12} width={820} height={1} fill="#d1d5db" />
        <text x={20} y={top + boxH + 30} fontSize={11} fill={muted} fontFamily={font}>
          Each wafer holds whole layers. The constraint moves from HBM to the wafer-to-wafer link.
        </text>
      </svg>
    </div>
  );
}
