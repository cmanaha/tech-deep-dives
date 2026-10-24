import React from 'react';

// Three shared-memory machines side by side: DGX Spark (GB10), Jetson AGX Thor
// (T5000) and Jetson Orin Nano Super. Each panel shows how the GPU reaches the
// one LPDDR pool and which direction coherence runs. Every figure drawn here is
// cited in the spec table that follows the diagram in EdgeSharedMemorySilicon.

interface Panel {
  x: number;
  title: string;
  subtitle: string;
  accent: string;
  tint: string;
  bus: string;
  memory: string;
  bandwidth: string;
}

const W = 920;
const H = 372;
const PANEL_W = 280;
const PANEL_Y = 46;
const PANEL_H = 310;
const MEM_Y = 290;

const panels: Panel[] = [
  {
    x: 20,
    title: 'DGX Spark (GB10)',
    subtitle: 'Desk unit, 240 W supply',
    accent: '#0972d3',
    tint: '#f2f8fd',
    bus: '256-bit',
    memory: '128 GB LPDDR5X (or 64 GB)',
    bandwidth: '273 GB/s',
  },
  {
    x: 320,
    title: 'Jetson AGX Thor (T5000)',
    subtitle: 'Robot module, 40 to 130 W',
    accent: '#1f7a70',
    tint: '#e6f4f2',
    bus: '256-bit',
    memory: '128 GB LPDDR5X',
    bandwidth: '273 GB/s',
  },
  {
    x: 620,
    title: 'Jetson Orin Nano Super',
    subtitle: 'Edge module, 7 to 25 W',
    accent: '#037f0c',
    tint: '#ecf7ec',
    bus: '128-bit',
    memory: '8 GB LPDDR5',
    bandwidth: '102 GB/s',
  },
];

function PanelFrame({ p }: { p: Panel }) {
  const cx = p.x + PANEL_W / 2;
  return (
    <g>
      <rect x={p.x} y={PANEL_Y} width={PANEL_W} height={PANEL_H} rx={8} fill={p.tint} stroke={p.accent} strokeWidth={2} />
      <text className="esc-ptitle" x={cx} y={PANEL_Y + 24} fill={p.accent}>
        {p.title}
      </text>
      <text className="esc-s" x={cx} y={PANEL_Y + 42}>
        {p.subtitle}
      </text>
      {/* memory channel and the LPDDR pool */}
      <line className="esc-link" x1={cx} y1={256} x2={cx} y2={MEM_Y} />
      <text className="esc-sl" x={cx + 10} y={277}>
        {p.bus}
      </text>
      <rect className="esc-mem" x={p.x + 16} y={MEM_Y} width={PANEL_W - 32} height={52} rx={6} />
      <text className="esc-t" x={cx} y={MEM_Y + 21}>
        {p.memory}
      </text>
      <text className="esc-bw" x={cx} y={MEM_Y + 41}>
        {p.bandwidth}
      </text>
    </g>
  );
}

export function EdgeSocComparisonDiagram() {
  const spark = panels[0];
  const thor = panels[1];
  const orin = panels[2];
  const sCx = spark.x + PANEL_W / 2;
  const tCx = thor.x + PANEL_W / 2;
  const oCx = orin.x + PANEL_W / 2;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="edge-soc-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="edge-soc-title">
          DGX Spark, Jetson AGX Thor and Jetson Orin Nano Super each give the CPU and GPU one
          LPDDR memory pool. On DGX Spark the GPU dielet reaches the 273 GB/s LPDDR5X through the
          CPU dielet over NVLink-C2C at about 600 GB/s aggregate, coherent in both directions.
          Jetson AGX Thor puts the same 128 GB at 273 GB/s behind one SoC with two-way hardware
          coherence. Jetson Orin Nano Super shares 8 GB at 102 GB/s inside one SoC with one-way
          coherence, so the GPU still runs cache maintenance.
        </title>
        <style>{`
          .esc-h { fill: #16191f; font: 600 13px sans-serif; }
          .esc-ptitle { font: 600 13px sans-serif; text-anchor: middle; }
          .esc-t { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .esc-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .esc-sl { fill: #5f6b7a; font: 11px sans-serif; }
          .esc-l { fill: #16191f; font: 600 11px sans-serif; }
          .esc-box { fill: #ffffff; stroke-width: 1.5; }
          .esc-soc { fill: #ffffff; stroke-width: 1.5; }
          .esc-sub { fill: #f9fafa; stroke: #879596; stroke-width: 1; }
          .esc-mem { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .esc-bw { fill: #8b6c00; font: 700 13px sans-serif; text-anchor: middle; }
          .esc-link { stroke: #5f6b7a; stroke-width: 2; fill: none; marker-start: url(#esc-ah); marker-end: url(#esc-ah); }
          .esc-c2c { stroke: #0972d3; stroke-width: 3; fill: none; marker-start: url(#esc-ah-blue); marker-end: url(#esc-ah-blue); }
          .esc-two { fill: #037f0c; font: 600 11px sans-serif; text-anchor: middle; }
          .esc-twol { fill: #037f0c; font: 600 11px sans-serif; }
          .esc-one { fill: #8b6c00; font: 600 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker id="esc-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker id="esc-ah-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#0972d3" />
          </marker>
        </defs>

        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
        <text className="esc-h" x={20} y={30}>
          One memory pool per machine: how the GPU reaches it, and which way coherence runs
        </text>

        {panels.map((p) => (
          <PanelFrame key={p.title} p={p} />
        ))}

        {/* DGX Spark: two dielets joined by NVLink-C2C; memory hangs off the S-dielet */}
        <rect className="esc-box" x={spark.x + 16} y={102} width={PANEL_W - 32} height={48} rx={6} stroke={spark.accent} />
        <text className="esc-t" x={sCx} y={122}>
          G-dielet: Blackwell GPU
        </text>
        <text className="esc-s" x={sCx} y={140}>
          6,144 CUDA cores
        </text>
        <line className="esc-c2c" x1={spark.x + 56} y1={152} x2={spark.x + 56} y2={206} />
        <text className="esc-l" x={spark.x + 74} y={169}>
          NVLink-C2C
        </text>
        <text className="esc-sl" x={spark.x + 74} y={184}>
          about 600 GB/s aggregate
        </text>
        <text className="esc-twol" x={spark.x + 74} y={199}>
          two-way coherent
        </text>
        <rect className="esc-box" x={spark.x + 16} y={208} width={PANEL_W - 32} height={48} rx={6} stroke={spark.accent} />
        <text className="esc-t" x={sCx} y={228}>
          S-dielet: 20 Arm CPU cores
        </text>
        <text className="esc-s" x={sCx} y={246}>
          plus the memory subsystem
        </text>

        {/* Jetson AGX Thor: one SoC, two-way coherence */}
        <rect className="esc-soc" x={thor.x + 16} y={102} width={PANEL_W - 32} height={154} rx={6} stroke={thor.accent} />
        <text className="esc-t" x={tCx} y={122}>
          Thor SoC
        </text>
        <rect className="esc-sub" x={thor.x + 32} y={132} width={PANEL_W - 64} height={30} rx={4} />
        <text className="esc-s" x={tCx} y={151}>
          14 Neoverse-V3AE CPU cores
        </text>
        <rect className="esc-sub" x={thor.x + 32} y={170} width={PANEL_W - 64} height={30} rx={4} />
        <text className="esc-s" x={tCx} y={189}>
          Blackwell GPU
        </text>
        <text className="esc-two" x={tCx} y={224}>
          two-way coherent in hardware
        </text>
        <text className="esc-s" x={tCx} y={240}>
          the first Jetson with full coherency
        </text>

        {/* Jetson Orin Nano Super: one SoC, one-way coherence */}
        <rect className="esc-soc" x={orin.x + 16} y={102} width={PANEL_W - 32} height={154} rx={6} stroke={orin.accent} />
        <text className="esc-t" x={oCx} y={122}>
          Orin SoC
        </text>
        <rect className="esc-sub" x={orin.x + 32} y={132} width={PANEL_W - 64} height={30} rx={4} />
        <text className="esc-s" x={oCx} y={151}>
          6 Cortex-A78AE CPU cores
        </text>
        <rect className="esc-sub" x={orin.x + 32} y={170} width={PANEL_W - 64} height={30} rx={4} />
        <text className="esc-s" x={oCx} y={189}>
          Ampere GPU, 1,024 CUDA cores
        </text>
        <text className="esc-one" x={oCx} y={224}>
          one-way (I/O) coherent
        </text>
        <text className="esc-s" x={oCx} y={240}>
          the GPU still runs cache maintenance
        </text>
      </svg>
    </div>
  );
}
