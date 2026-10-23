import React from 'react';

// GB200 NVL72: 36 superchips (one Grace CPU and two Blackwell GPUs each) behind one
// NVLink Switch fabric, the superchip in detail, and the domain boundary beyond which
// traffic moves to EFA. Every figure drawn here is cited in the caption the section
// renders below the SVG.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways, so
// 11-unit labels stay legible instead of shrinking to 4 px.

const COLS = 6;
const ROWS = 6;
const GRID_X = 32;
const GRID_Y = 108;
const TILE_W = 48;
const TILE_H = 28;
const GAP = 6;

export function Nvl72Diagram() {
  const tiles: React.ReactNode[] = [];
  const stubs: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r += 1) {
    const y = GRID_Y + r * (TILE_H + GAP);
    for (let c = 0; c < COLS; c += 1) {
      const x = GRID_X + c * (TILE_W + GAP);
      tiles.push(
        <g key={`t-${r}-${c}`}>
          <rect className="nvl-tile" x={x} y={y} width={TILE_W} height={TILE_H} rx={3} />
          <rect className="nvl-gpu" x={x + 4} y={y + 3} width={18} height={13} rx={2} />
          <rect className="nvl-gpu" x={x + 26} y={y + 3} width={18} height={13} rx={2} />
          <rect className="nvl-cpu" x={x + 4} y={y + 19} width={40} height={6} rx={2} />
        </g>
      );
    }
    stubs.push(
      <line
        key={`s-${r}`}
        className="nvl-stub"
        x1={GRID_X + COLS * (TILE_W + GAP) - GAP}
        y1={y + TILE_H / 2}
        x2={380}
        y2={y + TILE_H / 2}
      />
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 430"
        role="img"
        aria-labelledby="nvl72-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="nvl72-title">
          A GB200 NVL72 rack is one NVLink domain: 36 superchips, each one Grace CPU joined to
          two Blackwell GPUs over NVLink-C2C at 900 GB/s bidirectional, all attached to a
          non-blocking NVLink Switch fabric that gives every GPU 1.8 TB/s bidirectional to any
          other GPU. NVIDIA&apos;s DeepSeek-R1 decode layout needs 64 GPUs, which fits inside
          the 72-GPU domain; experts placed beyond the domain talk over EFA.
        </title>
        <style>{`
          .nvl-bg { fill: #ffffff; stroke: #e9ebed; }
          .nvl-dom { fill: #fafbfc; stroke: #414d5c; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .nvl-tile { fill: #ffffff; stroke: #879596; stroke-width: 1; }
          .nvl-gpu { fill: #0972d3; }
          .nvl-cpu { fill: #ec7211; }
          .nvl-stub { stroke: #037f0c; stroke-width: 2; }
          .nvl-sw { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
          .nvl-panel { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .nvl-grace { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .nvl-bw { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .nvl-c2c { stroke: #037f0c; stroke-width: 3; }
          .nvl-moe { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .nvl-efa { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .nvl-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#nvl-ah); }
          .nvl-h { fill: #16191f; font: 600 13px sans-serif; }
          .nvl-s { fill: #414d5c; font: 11px sans-serif; }
          .nvl-l { fill: #414d5c; font: 600 11px sans-serif; }
          .nvl-hc { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .nvl-gc { fill: #037f0c; font: 600 13px sans-serif; text-anchor: middle; }
          .nvl-sc { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .nvl-bc { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .nvl-mh { fill: #6f4cc4; font: 600 13px sans-serif; }
          .nvl-eh { fill: #8b6c00; font: 600 13px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="nvl-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect className="nvl-bg" x="0" y="0" width="880" height="430" rx="8" />

        <text className="nvl-h" x="24" y="28">
          GB200 NVL72: 72 Blackwell GPUs and 36 Grace CPUs in one NVLink domain
        </text>
        <text className="nvl-s" x="24" y="46">
          13.4 TB of HBM3e and 17 TB of LPDDR5X across the rack
        </text>

        {/* The NVLink domain */}
        <rect className="nvl-dom" x="16" y="60" width="848" height="258" rx="10" />
        <text className="nvl-l" x="32" y="80">
          One NVLink domain
        </text>

        {/* Legend */}
        <rect className="nvl-gpu" x="160" y="70" width="14" height="12" rx="2" />
        <text className="nvl-s" x="180" y="80">
          Blackwell GPU (72)
        </text>
        <rect className="nvl-cpu" x="316" y="73" width="22" height="6" rx="2" />
        <text className="nvl-s" x="344" y="80">
          Grace CPU (36)
        </text>

        <text className="nvl-s" x="32" y="100">
          36 superchips, two GPUs and one CPU each
        </text>
        {tiles}
        {stubs}

        {/* NVLink Switch fabric */}
        <rect className="nvl-sw" x="380" y="108" width="170" height="198" rx="8" />
        <text className="nvl-gc" x="465" y="170">
          NVLink Switch
        </text>
        <text className="nvl-sc" x="465" y="188">
          non-blocking fabric
        </text>
        <text className="nvl-bc" x="465" y="214">
          1.8 TB/s per GPU
        </text>
        <text className="nvl-sc" x="465" y="230">
          bidirectional
        </text>
        <text className="nvl-sc" x="465" y="246">
          (900 GB/s each way)
        </text>
        <text className="nvl-bc" x="465" y="272">
          130 TB/s aggregate
        </text>
        <text className="nvl-sc" x="465" y="288">
          bidirectional
        </text>

        {/* One superchip in detail */}
        <rect className="nvl-panel" x="566" y="94" width="282" height="212" rx="8" />
        <text className="nvl-h" x="582" y="116">
          One superchip
        </text>
        <rect className="nvl-grace" x="582" y="128" width="250" height="54" rx="6" />
        <text className="nvl-bc" x="707" y="150">
          Grace CPU, 72 Neoverse V2 cores
        </text>
        <text className="nvl-sc" x="707" y="168">
          480 GB LPDDR5X on the module
        </text>
        <line className="nvl-c2c" x1="610" y1="182" x2="610" y2="236" />
        <line className="nvl-c2c" x1="804" y1="182" x2="804" y2="236" />
        <text className="nvl-bc" x="707" y="205">
          NVLink-C2C, 900 GB/s
        </text>
        <text className="nvl-sc" x="707" y="221">
          bidirectional, coherent
        </text>
        <rect className="nvl-bw" x="582" y="236" width="116" height="54" rx="6" />
        <text className="nvl-bc" x="640" y="258">
          Blackwell GPU
        </text>
        <text className="nvl-sc" x="640" y="276">
          186 GB HBM3e
        </text>
        <rect className="nvl-bw" x="716" y="236" width="116" height="54" rx="6" />
        <text className="nvl-bc" x="774" y="258">
          Blackwell GPU
        </text>
        <text className="nvl-sc" x="774" y="276">
          186 GB HBM3e
        </text>

        {/* MoE fit */}
        <rect className="nvl-moe" x="16" y="346" width="516" height="68" rx="8" />
        <text className="nvl-mh" x="32" y="368">
          NVIDIA&apos;s DeepSeek-R1 decode layout
        </text>
        <text className="nvl-s" x="32" y="386">
          256 routed experts at about 4 per GPU needs 64 GPUs
        </text>
        <text className="nvl-s" x="32" y="404">
          One 72-GPU domain holds it with 8 GPUs to spare
        </text>

        {/* Beyond the domain */}
        <line className="nvl-arr" x1="710" y1="318" x2="710" y2="344" />
        <rect className="nvl-efa" x="556" y="346" width="308" height="68" rx="8" />
        <text className="nvl-eh" x="572" y="368">
          Beyond the domain: EFA
        </text>
        <text className="nvl-s" x="572" y="386">
          Scale-out between UltraServers
        </text>
        <text className="nvl-s" x="572" y="404">
          Experts outside the domain talk over EFA
        </text>
      </svg>
    </div>
  );
}
