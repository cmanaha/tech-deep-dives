import React from 'react';

// One EPYC 9005 (Turin) socket in its 16-CCD Zen 5 form: 8 CCDs above and 8
// below one IO die, one GMI link per CCD, 12 DDR5 channels in four groups of
// three. The IO die is split into the four NPS4 quadrants AMD describes (three
// memory controllers and up to four Zen 5 CCDs each). CCD 1 is outlined green
// for the within-CCD case; the orange path from CCD 1 to CCD 2 shows that even
// adjacent CCDs exchange data through the IO die. The latency figures in
// the legend are Chips and Cheese measurements on an EPYC 9575F and are cited
// in the caption below the diagram in AmdEpycTurin.tsx.

const VB_W = 800;
const VB_H = 480;

const IOD_X = 106;
const IOD_Y = 148;
const IOD_W = 588;
const IOD_H = 156;
const MID_X = IOD_X + IOD_W / 2;
const MID_Y = IOD_Y + IOD_H / 2;

const CCD_W = 65;
const CCD_H = 62;
const CCD_GAP = 8;
const GROUP_GAP = 20;
const TOP_Y = 40;
const BOTTOM_Y = 352;

// Left group of four, then right group of four, spanning the IO die width.
const colX = Array.from({ length: 8 }, (_, i) =>
  i < 4
    ? IOD_X + i * (CCD_W + CCD_GAP)
    : IOD_X + 4 * CCD_W + 3 * CCD_GAP + GROUP_GAP + (i - 4) * (CCD_W + CCD_GAP)
);

interface Ccd {
  n: number;
  x: number;
  y: number;
}

const ccds: Ccd[] = [
  ...colX.map((x, i) => ({ n: i + 1, x, y: TOP_Y })),
  ...colX.map((x, i) => ({ n: i + 9, x, y: BOTTOM_Y })),
];

const DDR_W = 78;
const DDR_H = 52;
const ddrBlocks = [
  { x: 14, y: 160 },
  { x: 14, y: 240 },
  { x: VB_W - 14 - DDR_W, y: 160 },
  { x: VB_W - 14 - DDR_W, y: 240 },
];

const quadrantLabels = [
  { x: (IOD_X + MID_X) / 2, y: 184 },
  { x: (MID_X + IOD_X + IOD_W) / 2, y: 184 },
  { x: (IOD_X + MID_X) / 2, y: 260 },
  { x: (MID_X + IOD_X + IOD_W) / 2, y: 260 },
];

const ccdCx = (c: Ccd) => c.x + CCD_W / 2;

export function EpycTurinTopology() {
  const c1 = ccds[0];
  const c2 = ccds[1];
  const pathY = IOD_Y + 16;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="epyc-turin-topology-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="epyc-turin-topology-title">
          An EPYC Turin socket with 16 Zen 5 compute dies (CCDs), each holding 8 cores that share a
          32 MB L3, wired by one GMI link each to a central IO die that holds all 12 DDR5 memory
          controllers. Cores on one CCD exchange data in about 45 ns; data moving between two CCDs,
          even adjacent ones, crosses the IO die and takes about 150 ns, as measured on an EPYC 9575F.
          In NPS4 mode each quadrant of the IO die, with three memory controllers and four CCDs,
          becomes its own NUMA node.
        </title>
        <defs>
          <marker
            id="ept-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#ec7211" />
          </marker>
        </defs>
        <style>{`
          .ept-head { fill: #16191f; font: 600 12px sans-serif; }
          .ept-ccd { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .ept-ccd-hot { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2.5; }
          .ept-ccd-t { fill: #065299; font: 600 12px sans-serif; text-anchor: middle; }
          .ept-ccd-t-hot { fill: #037f0c; font: 600 12px sans-serif; text-anchor: middle; }
          .ept-ccd-s { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .ept-iod { fill: #f4f5f6; stroke: #414d5c; stroke-width: 2; }
          .ept-div { stroke: #879596; stroke-width: 1; stroke-dasharray: 5 4; }
          .ept-pill { fill: #ffffff; stroke: #414d5c; stroke-width: 1.5; }
          .ept-pill-t { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .ept-q-t { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .ept-q-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .ept-gmi { stroke: #879596; stroke-width: 1.5; }
          .ept-ddr { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .ept-ddr-t { fill: #1f7a70; font: 600 12px sans-serif; text-anchor: middle; }
          .ept-ddr-s { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .ept-ddr-l { stroke: #1f7a70; stroke-width: 2; }
          .ept-hop { stroke: #ec7211; stroke-width: 3; fill: none; marker-start: url(#ept-ah); marker-end: url(#ept-ah); }
          .ept-leg { fill: #16191f; font: 11px sans-serif; }
          .ept-note { fill: #5f6b7a; font: 11px sans-serif; }
        `}</style>

        <rect x={0} y={0} width={VB_W} height={VB_H} rx={8} fill="#ffffff" stroke="#e9ebed" />

        <text className="ept-head" x={16} y={24}>
          One socket: 16 Zen 5 CCDs of 8 cores around one IO die (Zen 5c parts: 12 CCDs of 16)
        </text>

        {/* GMI links, one per CCD in this 16-CCD form */}
        {ccds.map((c) => {
          const x = ccdCx(c);
          const top = c.y === TOP_Y;
          return (
            <line
              key={`gmi-${c.n}`}
              className="ept-gmi"
              x1={x}
              y1={top ? c.y + CCD_H : IOD_Y + IOD_H}
              x2={x}
              y2={top ? IOD_Y : c.y}
            />
          );
        })}

        {/* IO die with the four NPS4 quadrants */}
        <rect className="ept-iod" x={IOD_X} y={IOD_Y} width={IOD_W} height={IOD_H} rx={8} />
        <line className="ept-div" x1={MID_X} y1={IOD_Y} x2={MID_X} y2={MID_Y - 13} />
        <line className="ept-div" x1={MID_X} y1={MID_Y + 13} x2={MID_X} y2={IOD_Y + IOD_H} />
        <line className="ept-div" x1={IOD_X} y1={MID_Y} x2={MID_X - 60} y2={MID_Y} />
        <line className="ept-div" x1={MID_X + 60} y1={MID_Y} x2={IOD_X + IOD_W} y2={MID_Y} />
        <rect className="ept-pill" x={MID_X - 60} y={MID_Y - 13} width={120} height={26} rx={13} />
        <text className="ept-pill-t" x={MID_X} y={MID_Y + 4}>
          IO die, 6 nm
        </text>
        {quadrantLabels.map((q) => (
          <g key={`q-${q.x}-${q.y}`}>
            <text className="ept-q-t" x={q.x} y={q.y}>
              NPS4 quadrant
            </text>
            <text className="ept-q-s" x={q.x} y={q.y + 16}>
              3 memory controllers, 4 CCDs
            </text>
          </g>
        ))}

        {/* DDR5 channels, three per quadrant */}
        {ddrBlocks.map((d) => {
          const left = d.x < MID_X;
          const cy = d.y + DDR_H / 2;
          return (
            <g key={`ddr-${d.x}-${d.y}`}>
              <rect className="ept-ddr" x={d.x} y={d.y} width={DDR_W} height={DDR_H} rx={6} />
              <text className="ept-ddr-t" x={d.x + DDR_W / 2} y={cy - 3}>
                3 x DDR5
              </text>
              <text className="ept-ddr-s" x={d.x + DDR_W / 2} y={cy + 13}>
                channels
              </text>
              <line
                className="ept-ddr-l"
                x1={left ? d.x + DDR_W : IOD_X + IOD_W}
                y1={cy}
                x2={left ? IOD_X : d.x}
                y2={cy}
              />
            </g>
          );
        })}

        {/* CCDs */}
        {ccds.map((c) => {
          const hot = c.n === 1;
          const x = ccdCx(c);
          return (
            <g key={`ccd-${c.n}`}>
              <rect
                className={hot ? 'ept-ccd-hot' : 'ept-ccd'}
                x={c.x}
                y={c.y}
                width={CCD_W}
                height={CCD_H}
                rx={6}
              />
              <text className={hot ? 'ept-ccd-t-hot' : 'ept-ccd-t'} x={x} y={c.y + 19}>
                {`CCD ${c.n}`}
              </text>
              <text className="ept-ccd-s" x={x} y={c.y + 36}>
                8 cores
              </text>
              <text className="ept-ccd-s" x={x} y={c.y + 51}>
                32 MB L3
              </text>
            </g>
          );
        })}

        {/* CCD 1 to CCD 2 goes through the IO die */}
        <path
          className="ept-hop"
          d={`M ${ccdCx(c1)} ${c1.y + CCD_H + 2} V ${pathY} H ${ccdCx(c2)} V ${c2.y + CCD_H + 2}`}
        />

        {/* Legend */}
        <rect x={16} y={430} width={16} height={13} rx={3} className="ept-ccd-hot" />
        <text className="ept-leg" x={40} y={441}>
          Same CCD, shared 32 MB L3: about 45 ns core to core
        </text>
        <line x1={392} y1={437} x2={420} y2={437} stroke="#ec7211" strokeWidth={3} />
        <text className="ept-leg" x={428} y={441}>
          CCD to CCD, through the IO die: about 150 ns
        </text>
        <text className="ept-note" x={16} y={464}>
          Core-to-core latency measured on an EPYC 9575F by Chips and Cheese. Another socket: about
          260 ns.
        </text>
      </svg>
    </div>
  );
}
