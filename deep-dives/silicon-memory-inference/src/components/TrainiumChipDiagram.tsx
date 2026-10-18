import React from 'react';

// Two diagrams for AWS Trainium, Inferentia and Neuron. Every figure drawn here is
// cited in the caption the section renders below each SVG.
//
// TrainiumChipDiagram: a Trainium2 chip. Eight NeuronCore-v3 cores with their SBUF and
// PSUM, 16 CC-Cores, HBM, and the NeuronLink-v3 split between links inside the
// instance and links to the other instances of a Trn2 UltraServer. Schematic, not to
// scale; the number of HBM stacks is not drawn to any source.
//
// TrainiumFabricDiagram: the contrast the section's MoE argument rests on. Trn2 links
// each chip to its torus neighbours, so traffic to a far chip is routed through chips
// in between; Trn3 links each chip to PCIe switches inside its server and across its
// rack. Three servers of a Trn3 rack are drawn; the source does not give a rack size.
//
// Both are wide: on a phone the SVG keeps a 640 px minimum width and the wrapper
// scrolls sideways, so labels keep their size instead of shrinking.

const NC_W = 138;
const NC_H = 72;
const NC_GAP_X = 16;
const NC_GAP_Y = 14;
const DIE_X = 124;
const DIE_Y = 64;

export function TrainiumChipDiagram() {
  const cores: React.ReactNode[] = [];
  for (let i = 0; i < 8; i += 1) {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const x = DIE_X + 16 + c * (NC_W + NC_GAP_X);
    const y = DIE_Y + 36 + r * (NC_H + NC_GAP_Y);
    cores.push(
      <g key={`nc-${i}`}>
        <rect className="trn-nc" x={x} y={y} width={NC_W} height={NC_H} rx={6} />
        <text className="trn-nct" x={x + NC_W / 2} y={y + 21}>
          NeuronCore-v3
        </text>
        <text className="trn-s" x={x + NC_W / 2} y={y + 41}>
          SBUF 28 MiB
        </text>
        <text className="trn-s" x={x + NC_W / 2} y={y + 59}>
          PSUM 2 MiB
        </text>
      </g>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 400"
        role="img"
        aria-labelledby="trn2-chip-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="trn2-chip-title">
          A Trainium2 chip holds eight NeuronCore-v3 cores, each with its own 28 MiB SBUF and
          2 MiB PSUM, beside 16 CC-Cores that orchestrate collectives. HBM supplies 96 GiB at
          2.9 TB/s, and NeuronLink-v3 gives each chip 1,024 GB/s to the chips in its instance
          plus 256 GB/s to the other instances of a Trn2 UltraServer.
        </title>
        <style>{`
          .trn-bg   { fill: #ffffff; }
          .trn-h    { fill: #16191f; font: 600 13px sans-serif; }
          .trn-sub  { fill: #5f6b7a; font: 11px sans-serif; }
          .trn-hbm  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .trn-hbmt { fill: #8a4b08; font: 600 13px sans-serif; text-anchor: middle; }
          .trn-die  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .trn-diet { fill: #0972d3; font: 600 13px sans-serif; }
          .trn-nc   { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .trn-nct  { fill: #037f0c; font: 600 12px sans-serif; text-anchor: middle; }
          .trn-s    { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .trn-cc   { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .trn-cct  { fill: #4b2e99; font: 600 12px sans-serif; text-anchor: middle; }
          .trn-nl   { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .trn-nlt  { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .trn-ln   { stroke: #879596; stroke-width: 2; }
        `}</style>
        <rect className="trn-bg" x={0} y={0} width={880} height={400} rx={8} />
        <text className="trn-h" x={24} y={28}>
          Trainium2 chip, schematic
        </text>
        <text className="trn-sub" x={24} y={46}>
          8 NeuronCore-v3, 16 CC-Cores, 96 GiB of HBM at 2.9 TB/s per chip
        </text>

        {/* HBM, left and right of the die */}
        {[24, 776].map((x) => (
          <g key={`hbm-${x}`}>
            <rect className="trn-hbm" x={x} y={84} width={80} height={212} rx={6} />
            <text className="trn-hbmt" x={x + 40} y={195}>
              HBM
            </text>
          </g>
        ))}
        {[130, 190, 250].map((y) => (
          <g key={`hl-${y}`}>
            <line className="trn-ln" x1={104} y1={y} x2={DIE_X} y2={y} />
            <line className="trn-ln" x1={756} y1={y} x2={776} y2={y} />
          </g>
        ))}

        {/* Die */}
        <rect className="trn-die" x={DIE_X} y={DIE_Y} width={632} height={252} rx={10} />
        <text className="trn-diet" x={DIE_X + 16} y={DIE_Y + 24}>
          Trainium2 die
        </text>
        {cores}

        {/* CC-Cores */}
        <rect className="trn-cc" x={DIE_X + 16} y={268} width={600} height={36} rx={6} />
        <text className="trn-cct" x={DIE_X + 316} y={291}>
          16 CC-Cores orchestrate collectives among chips, within and across instances
        </text>

        {/* NeuronLink-v3 */}
        {[260, 440, 620].map((x) => (
          <line key={`nl-${x}`} className="trn-ln" x1={x} y1={316} x2={x} y2={332} />
        ))}
        <rect className="trn-nl" x={24} y={332} width={832} height={56} rx={6} />
        <text className="trn-nlt" x={440} y={354}>
          NeuronLink-v3 to other Trainium2 chips
        </text>
        <text className="trn-s" x={440} y={374}>
          1,024 GB/s per chip inside the instance, plus 256 GB/s per chip to the other
          instances of a Trn2 UltraServer
        </text>
      </svg>
    </div>
  );
}

// Fabric diagram geometry
const T_COL = [44, 106, 168, 230];
const T_ROW = [86, 132, 178, 224];
const T_W = 40;
const T_H = 26;
const SENDER = { r: 1, c: 1 };
const NEIGHBOURS = [
  { r: 0, c: 1 },
  { r: 2, c: 1 },
  { r: 1, c: 0 },
  { r: 1, c: 2 },
];
const FAR = { r: 3, c: 3 };
// One shortest torus route from the sender to the far chip, through chip centres.
const TORUS_ROUTE = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 3],
];

const SRV_X = [512, 658, 804];
const SRV_Y = 124;
const SRV_W = 124;
const SRV_H = 102;
const CHIP = 22;
const CHIP_PITCH = 30;
const CHIP_Y = 134;

function torusClass(r: number, c: number): string {
  if (r === SENDER.r && c === SENDER.c) return 'tfab-send';
  if (r === FAR.r && c === FAR.c) return 'tfab-far';
  if (NEIGHBOURS.some((n) => n.r === r && n.c === c)) return 'tfab-nb';
  return 'tfab-chip';
}

export function TrainiumFabricDiagram() {
  const links: React.ReactNode[] = [];
  const stubs: React.ReactNode[] = [];
  const chips: React.ReactNode[] = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const x = T_COL[c];
      const y = T_ROW[r];
      if (c < 3) {
        links.push(
          <line key={`h-${r}-${c}`} className="tfab-link" x1={x + T_W} y1={y + T_H / 2} x2={T_COL[c + 1]} y2={y + T_H / 2} />
        );
      }
      if (r < 3) {
        links.push(
          <line key={`v-${r}-${c}`} className="tfab-link" x1={x + T_W / 2} y1={y + T_H} x2={x + T_W / 2} y2={T_ROW[r + 1]} />
        );
      }
      chips.push(
        <rect key={`t-${r}-${c}`} className={torusClass(r, c)} x={x} y={y} width={T_W} height={T_H} rx={4} />
      );
    }
    // Wrap-around links leave every edge chip toward the chip at the opposite edge.
    stubs.push(
      <line key={`wl-${r}`} className="tfab-wrap" x1={T_COL[0]} y1={T_ROW[r] + T_H / 2} x2={T_COL[0] - 14} y2={T_ROW[r] + T_H / 2} />,
      <line key={`wr-${r}`} className="tfab-wrap" x1={T_COL[3] + T_W} y1={T_ROW[r] + T_H / 2} x2={T_COL[3] + T_W + 14} y2={T_ROW[r] + T_H / 2} />
    );
  }
  for (let c = 0; c < 4; c += 1) {
    stubs.push(
      <line key={`wt-${c}`} className="tfab-wrap" x1={T_COL[c] + T_W / 2} y1={T_ROW[0]} x2={T_COL[c] + T_W / 2} y2={T_ROW[0] - 12} />,
      <line key={`wb-${c}`} className="tfab-wrap" x1={T_COL[c] + T_W / 2} y1={T_ROW[3] + T_H} x2={T_COL[c] + T_W / 2} y2={T_ROW[3] + T_H + 12} />
    );
  }
  const torusRoute = TORUS_ROUTE.map(([r, c]) => `${T_COL[c] + T_W / 2},${T_ROW[r] + T_H / 2}`).join(' ');

  const servers: React.ReactNode[] = [];
  const up: React.ReactNode[] = [];
  SRV_X.forEach((sx, s) => {
    const chipEls: React.ReactNode[] = [];
    for (let k = 0; k < 4; k += 1) {
      const cx = sx + 6 + k * CHIP_PITCH;
      let cls = 'tfab-chip';
      if (s === 0 && k === 0) cls = 'tfab-send';
      if (s === 2 && k === 3) cls = 'tfab-far';
      up.push(
        <line key={`up-${s}-${k}`} className="tfab-link" x1={cx + CHIP / 2} y1={CHIP_Y} x2={cx + CHIP / 2} y2={98} />
      );
      chipEls.push(
        <g key={`c-${s}-${k}`}>
          <line className="tfab-link" x1={cx + CHIP / 2} y1={CHIP_Y + CHIP} x2={cx + CHIP / 2} y2={180} />
          <rect className={cls} x={cx} y={CHIP_Y} width={CHIP} height={CHIP} rx={3} />
        </g>
      );
    }
    servers.push(
      <g key={`srv-${s}`}>
        <rect className="tfab-srv" x={sx} y={SRV_Y} width={SRV_W} height={SRV_H} rx={6} />
        {chipEls}
        <rect className="tfab-sw" x={sx + 6} y={180} width={112} height={22} rx={4} />
        <text className="tfab-swt" x={sx + SRV_W / 2} y={195}>
          Switch: 256 GB/s
        </text>
        <text className="tfab-s" x={sx + SRV_W / 2} y={218}>
          Server
        </text>
      </g>
    );
  });
  const sendX = SRV_X[0] + 6 + CHIP / 2;
  const farX = SRV_X[2] + 6 + 3 * CHIP_PITCH + CHIP / 2;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 960 360"
        role="img"
        aria-labelledby="trn-fabric-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="trn-fabric-title">
          On Trn2 each chip links directly only to its torus neighbours: four inside a
          16-chip instance and two more across a Trn2 UltraServer, six of the other 63 chips,
          so traffic to any other chip is routed through chips in between. On Trn3 each chip
          links to a PCIe switch inside its server and to switches that join the servers of
          its rack, so traffic between chips in a rack goes through switches.
        </title>
        <style>{`
          .tfab-bg    { fill: #ffffff; }
          .tfab-panel { fill: #fafbfc; stroke: #d1d5db; stroke-width: 1; }
          .tfab-h     { fill: #16191f; font: 600 13px sans-serif; }
          .tfab-sub   { fill: #5f6b7a; font: 11px sans-serif; }
          .tfab-s     { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .tfab-l     { fill: #16191f; font: 11px sans-serif; }
          .tfab-chip  { fill: #f4f4f4; stroke: #879596; stroke-width: 1.2; }
          .tfab-send  { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .tfab-nb    { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .tfab-far   { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 2; }
          .tfab-link  { stroke: #879596; stroke-width: 1.5; }
          .tfab-wrap  { stroke: #879596; stroke-width: 1.5; stroke-dasharray: 3 3; }
          .tfab-route { stroke: #ec7211; stroke-width: 4; fill: none; stroke-linejoin: round; }
          .tfab-bar   { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .tfab-bart  { fill: #0f4f48; font: 600 12px sans-serif; text-anchor: middle; }
          .tfab-srv   { fill: #ffffff; stroke: #414d5c; stroke-width: 1.2; }
          .tfab-sw    { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.2; }
          .tfab-swt   { fill: #0f4f48; font: 11px sans-serif; text-anchor: middle; }
        `}</style>
        <rect className="tfab-bg" x={0} y={0} width={960} height={360} rx={8} />

        {/* Trn2: torus */}
        <rect className="tfab-panel" x={12} y={12} width={456} height={336} rx={8} />
        <text className="tfab-h" x={32} y={40}>
          Trn2: each chip links to its neighbours
        </text>
        <text className="tfab-sub" x={32} y={58}>
          trn2.48xlarge: 16 chips in a 4x4 2D torus
        </text>
        {links}
        {stubs}
        <polyline className="tfab-route" points={torusRoute} />
        {chips}
        <rect className="tfab-send" x={304} y={86} width={14} height={14} rx={2} />
        <text className="tfab-l" x={326} y={97}>
          Sending chip
        </text>
        <rect className="tfab-nb" x={304} y={112} width={14} height={14} rx={2} />
        <text className="tfab-l" x={326} y={123}>
          Its 4 neighbours
        </text>
        <rect className="tfab-far" x={304} y={138} width={14} height={14} rx={2} />
        <text className="tfab-l" x={326} y={149}>
          A far chip
        </text>
        <line className="tfab-route" x1={302} y1={171} x2={320} y2={171} />
        <text className="tfab-l" x={326} y={175}>
          Route to it
        </text>
        <line className="tfab-wrap" x1={302} y1={197} x2={320} y2={197} />
        <text className="tfab-l" x={326} y={201}>
          Wrap-around link
        </text>
        <text className="tfab-l" x={32} y={296}>
          Trn2 UltraServer: four instances, with same-position
        </text>
        <text className="tfab-l" x={32} y={312}>
          chips in a ring: 6 of the other 63 chips are neighbours
        </text>
        <text className="tfab-l" x={32} y={334}>
          NeuronLink-v3 per chip: 1,024 GB/s inside, 256 GB/s across
        </text>

        {/* Trn3: switches */}
        <rect className="tfab-panel" x={492} y={12} width={456} height={336} rx={8} />
        <text className="tfab-h" x={512} y={40}>
          Trn3: each chip links to switches
        </text>
        <text className="tfab-sub" x={512} y={58}>
          Four chips per server (Gen2); switches join a rack&apos;s servers
        </text>
        {up}
        <rect className="tfab-bar" x={512} y={72} width={416} height={26} rx={4} />
        <text className="tfab-bart" x={720} y={89}>
          Inter-server switches (rack): 320 GB/s per chip
        </text>
        <polyline
          className="tfab-route"
          points={`${sendX},${CHIP_Y} ${sendX},${104} ${farX},${104} ${farX},${CHIP_Y}`}
        />
        {servers}
        <text className="tfab-l" x={512} y={252}>
          Across racks: a direct link to the chip in the same
        </text>
        <text className="tfab-l" x={512} y={268}>
          position in another rack, 128 GB/s per chip
        </text>
        <text className="tfab-l" x={512} y={296}>
          Gen1: 64 chips, four servers of 16
        </text>
        <text className="tfab-l" x={512} y={312}>
          Gen2: 144 chips, 36 servers of 4
        </text>
        <text className="tfab-l" x={512} y={334}>
          Trn3 bandwidths are bidirectional, per chip
        </text>
      </svg>
    </div>
  );
}
