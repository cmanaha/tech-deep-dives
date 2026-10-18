import React from 'react';

// AWS's Xeon 6 6985P-C as Chips and Cheese measured it on an r8i: three Intel 3 compute
// tiles and two IO dies joined by EMIB, run in SNC3 so each compute tile is one NUMA node
// with its own L3 slice pool and its own four memory controllers. Memory hangs off the
// compute tiles, not the IO dies. Per-tile cores and CHAs are the chip totals divided by
// three. Every figure drawn here is cited in the caption the section renders below the SVG.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways.

const TILE_Y = 68;
const TILE_W = 182;
const TILE_H = 192;
const IO_W = 96;
const STRIP_Y = 278;
const STRIP_H = 28;

const IO_DIES = [21, 763];
const TILES = [
  { x: 145, label: 'Compute tile 1' },
  { x: 349, label: 'Compute tile 2' },
  { x: 553, label: 'Compute tile 3' },
];
// Die boundaries, left edge to right edge of each gap.
const GAPS = [
  [117, 145],
  [327, 349],
  [531, 553],
  [735, 763],
];

export function Xeon6Topology() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 384"
        role="img"
        aria-labelledby="xeon6-topology-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="xeon6-topology-title">
          AWS&apos;s Xeon 6 6985P-C, as measured on an r8i, is three compute tiles and two IO dies
          joined by EMIB bridges. AWS runs it in SNC3, so each compute tile is one NUMA node with
          about 32 cores, 160 MB of L3 and four memory controllers driving DDR5-7200. The memory
          hangs off the compute tiles, and the IO dies carry PCIe, UPI, CXL and the accelerators.
        </title>
        <style>{`
          .x6-bg { fill: #ffffff; stroke: #e9ebed; }
          .x6-tile { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .x6-io { fill: #fdf3ec; stroke: #ec7211; stroke-width: 2; }
          .x6-mem { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .x6-emib { fill: #037f0c; }
          .x6-link { stroke: #1f7a70; stroke-width: 2; }
          .x6-h { fill: #16191f; font: 600 13px sans-serif; }
          .x6-sub { fill: #5f6b7a; font: 11px sans-serif; }
          .x6-th { fill: #0972d3; font: 600 13px sans-serif; text-anchor: middle; }
          .x6-node { fill: #0972d3; font: italic 11px sans-serif; text-anchor: middle; }
          .x6-t { fill: #16191f; font: 11px sans-serif; }
          .x6-ioh { fill: #ec7211; font: 600 13px sans-serif; text-anchor: middle; }
          .x6-iot { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .x6-memt { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .x6-emibt { fill: #ffffff; font: 600 10px sans-serif; text-anchor: middle; }
          .x6-foot { fill: #414d5c; font: 11px sans-serif; }
        `}</style>

        <rect className="x6-bg" x="0" y="0" width="880" height="384" rx="8" />
        <text className="x6-h" x="21" y="26">
          AWS&apos;s Xeon 6 6985P-C (r8i): three compute tiles and two IO dies, joined by EMIB
        </text>
        <text className="x6-sub" x="21" y="46">
          AWS runs it in SNC3: each compute tile is one NUMA node with its own L3 and its own memory
        </text>

        {GAPS.map(([left, right]) => {
          const cx = (left + right) / 2;
          const cy = TILE_Y + 120;
          return (
            <g key={left}>
              <rect className="x6-emib" x={left} y={TILE_Y + 92} width={right - left} height={56} rx={3} />
              <text className="x6-emibt" x={cx} y={cy + 4} transform={`rotate(-90 ${cx} ${cy})`}>
                EMIB
              </text>
            </g>
          );
        })}

        {IO_DIES.map((x) => {
          const cx = x + IO_W / 2;
          return (
            <g key={x}>
              <rect className="x6-io" x={x} y={TILE_Y} width={IO_W} height={TILE_H} rx={8} />
              <text className="x6-ioh" x={cx} y={TILE_Y + 24}>
                IO die
              </text>
              <text className="x6-iot" x={cx} y={TILE_Y + 56}>
                PCIe 5.0
              </text>
              <text className="x6-iot" x={cx} y={TILE_Y + 74}>
                UPI 2.0
              </text>
              <text className="x6-iot" x={cx} y={TILE_Y + 92}>
                CXL 2.0
              </text>
              <text className="x6-iot" x={cx} y={TILE_Y + 116}>
                Accelerators
              </text>
            </g>
          );
        })}

        {TILES.map((t) => {
          const cx = t.x + TILE_W / 2;
          const tx = t.x + 12;
          return (
            <g key={t.x}>
              <rect className="x6-tile" x={t.x} y={TILE_Y} width={TILE_W} height={TILE_H} rx={8} />
              <text className="x6-th" x={cx} y={TILE_Y + 24}>
                {t.label}
              </text>
              <text className="x6-node" x={cx} y={TILE_Y + 42}>
                one SNC3 NUMA node
              </text>
              <text className="x6-t" x={tx} y={TILE_Y + 68}>
                ~32 Redwood Cove cores
              </text>
              <text className="x6-t" x={tx} y={TILE_Y + 84}>
                Intel 3 process
              </text>
              <text className="x6-t" x={tx} y={TILE_Y + 106}>
                2 MB L2 per core
              </text>
              <text className="x6-t" x={tx} y={TILE_Y + 128}>
                160 MB L3 on this tile
              </text>
              <text className="x6-t" x={tx} y={TILE_Y + 144}>
                40 CHAs at 2.2 GHz
              </text>
              <text className="x6-t" x={tx} y={TILE_Y + 172}>
                4 memory controllers
              </text>
              <line className="x6-link" x1={cx} y1={TILE_Y + TILE_H} x2={cx} y2={STRIP_Y} />
              <rect className="x6-mem" x={t.x} y={STRIP_Y} width={TILE_W} height={STRIP_H} rx={4} />
              <text className="x6-memt" x={cx} y={STRIP_Y + 18}>
                4 channels of DDR5-7200
              </text>
            </g>
          );
        })}

        <text className="x6-foot" x="21" y="338">
          Whole chip: 96 cores, 120 CHAs at 2.2 GHz, 480 MB of L3, 80 MDF stops at 2.5 GHz at the die
          boundaries.
        </text>
        <text className="x6-foot" x="21" y="358">
          Per-tile cores and CHAs are the chip totals divided by three. Measured by Chips and Cheese
          on r8i (Tier 3).
        </text>
      </svg>
    </div>
  );
}
