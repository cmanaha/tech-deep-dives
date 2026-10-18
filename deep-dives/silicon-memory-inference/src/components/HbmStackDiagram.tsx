import React from 'react';

// Cross-section of a 12-high HBM stack beside the accelerator die on a silicon
// interposer, with per-stack bandwidth by generation (data width x pin rate)
// and the data width of one stack against one DDR5 channel. Every figure is
// cited in the caption under the diagram in HbmAndBandwidthWall.tsx.

const VB_W = 880;
const VB_H = 466;

interface GenCell {
  name: string;
  formula: string;
  result: string;
  basis: string;
  hbm4: boolean;
}

const gens: GenCell[] = [
  { name: 'HBM3', formula: '1,024 bits x 6.4 Gb/s', result: '= 819 GB/s per stack', basis: 'JEDEC standard', hbm4: false },
  { name: 'HBM3e', formula: '1,024 bits x up to 9.6 Gb/s', result: '= 1.2 TB/s per stack', basis: 'vendor maximum rating', hbm4: false },
  { name: 'HBM4', formula: '2,048 bits x 8 Gb/s', result: '= 2 TB/s per stack', basis: 'JEDEC standard', hbm4: true },
  { name: 'HBM4, shipping parts', formula: '2,048 bits x 11 to 13 Gb/s', result: '= 2.8 to 3.3 TB/s per stack', basis: 'vendor claims', hbm4: true },
];

const widths = [
  { label: 'DDR5 channel', bits: 64, value: '64 bits' },
  { label: 'HBM3 / HBM3e', bits: 1024, value: '1,024 bits' },
  { label: 'HBM4', bits: 2048, value: '2,048 bits' },
];

const NUM_DIES = 12;
const STACK_X = 430;
const STACK_W = 180;
const BASE_Y = 372; // top of the base logic die
const BASE_H = 26;
const DIE_H = 16;
const DIE_GAP = 3;
const dieY = (k: number) => BASE_Y - DIE_GAP - DIE_H - (k - 1) * (DIE_H + DIE_GAP);
const TOP_DIE_Y = dieY(NUM_DIES);

const BAR_X = 150;
const BAR_MAX = 240;

export function HbmStackDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="hbm-stack-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="hbm-stack-title">
          An HBM stack is DRAM dies, twelve in this one, on a base logic die, wired by through-silicon vias and
          placed beside the accelerator die on a silicon interposer. Its bandwidth is data width
          times pin rate: HBM3 and HBM3e drive 1,024 bits per stack, sixteen times a DDR5 channel,
          and HBM4 doubles that to 2,048 bits.
        </title>
        <style>{`
          .hbm-bg { fill: #ffffff; }
          .hbm-t { fill: #16191f; font: 600 12px sans-serif; }
          .hbm-th { fill: #16191f; font: 600 13px sans-serif; }
          .hbm-s { fill: #16191f; font: 11px sans-serif; }
          .hbm-g { fill: #5f6b7a; font: 11px sans-serif; }
          .hbm-n { fill: #5f6b7a; font: 10px sans-serif; }
          .hbm-w { fill: #ffffff; font: 600 11px sans-serif; }
          .hbm-wl { fill: #d5dbdb; font: 11px sans-serif; }
          .hbm-wt { fill: #ffffff; font: 600 13px sans-serif; }
          .hbm-die { stroke: #0972d3; stroke-width: 1; }
          .hbm-dl { fill: #0972d3; font: 600 10px sans-serif; }
          .hbm-tsv { stroke: #d91515; stroke-width: 1; stroke-dasharray: 2 2; }
          .hbm-tsvl { fill: #d91515; font: 600 11px sans-serif; }
          .hbm-call { stroke: #5f6b7a; stroke-width: 1; }
          .hbm-phy { stroke: #037f0c; stroke-width: 3; }
          .hbm-phyl { fill: #037f0c; font: 600 11px sans-serif; }
        `}</style>
        <rect className="hbm-bg" x={0} y={0} width={VB_W} height={VB_H} rx={8} />

        {/* Per-stack bandwidth by generation */}
        {gens.map((g, i) => {
          const x = 16 + i * 214;
          const y = 14;
          return (
            <g key={g.name}>
              <rect
                x={x}
                y={y}
                width={202}
                height={80}
                rx={6}
                fill={g.hbm4 ? '#ecf7ec' : '#f2f8fd'}
                stroke={g.hbm4 ? '#037f0c' : '#0972d3'}
                strokeWidth={1.2}
              />
              <text className="hbm-t" x={x + 10} y={y + 20}>
                {g.name}
              </text>
              <text className="hbm-s" x={x + 10} y={y + 38}>
                {g.formula}
              </text>
              <text className="hbm-s" x={x + 10} y={y + 54}>
                {g.result}
              </text>
              <text className="hbm-n" x={x + 10} y={y + 70}>
                {g.basis}
              </text>
            </g>
          );
        })}

        {/* Data width: one stack against one DDR5 channel */}
        <text className="hbm-t" x={40} y={126}>
          Data bits per stack, against one DDR5 channel
        </text>
        {widths.map((w, i) => {
          const y = 138 + i * 30;
          const len = Math.max(4, (w.bits / 2048) * BAR_MAX);
          const inside = len > 80;
          return (
            <g key={w.label}>
              <text className="hbm-s" x={40} y={y + 14}>
                {w.label}
              </text>
              <rect x={BAR_X} y={y} width={len} height={20} rx={3} fill={i === 2 ? '#037f0c' : i === 1 ? '#0972d3' : '#879596'} />
              <text
                className={inside ? 'hbm-w' : 'hbm-s'}
                x={inside ? BAR_X + 8 : BAR_X + len + 8}
                y={y + 14}
              >
                {w.value}
              </text>
            </g>
          );
        })}

        {/* Package substrate and silicon interposer */}
        <rect x={24} y={424} width={616} height={28} rx={4} fill="#414d5c" />
        <text className="hbm-w" x={332} y={442} textAnchor="middle">
          Package substrate
        </text>
        <rect x={40} y={398} width={580} height={26} fill="#687078" stroke="#414d5c" strokeWidth={1} />
        <text className="hbm-w" x={330} y={415} textAnchor="middle">
          Silicon interposer: an HBM4 stack&apos;s 2,048 data wires cross it
        </text>

        {/* Accelerator die */}
        <rect x={60} y={300} width={240} height={98} rx={4} fill="#232f3e" stroke="#16191f" strokeWidth={1.5} />
        <text className="hbm-wt" x={180} y={344} textAnchor="middle">
          Accelerator die
        </text>
        <text className="hbm-wl" x={180} y={362} textAnchor="middle">
          GPU, TPU or Trainium compute
        </text>

        {/* HBM stack header */}
        <text className="hbm-th" x={STACK_X + STACK_W / 2} y={TOP_DIE_Y - 12} textAnchor="middle">
          HBM stack, 12-high
        </text>

        {/* DRAM dies */}
        {Array.from({ length: NUM_DIES }, (_, idx) => {
          const k = idx + 1;
          const y = dieY(k);
          return (
            <g key={k}>
              <rect
                className="hbm-die"
                x={STACK_X}
                y={y}
                width={STACK_W}
                height={DIE_H}
                fill={k % 2 === 0 ? '#f2f8fd' : '#e1f0fb'}
              />
              {(k === 1 || k === NUM_DIES) && (
                <text className="hbm-dl" x={STACK_X + 8} y={y + 12}>
                  {`DRAM die ${k}`}
                </text>
              )}
            </g>
          );
        })}

        {/* Base logic die */}
        <rect x={STACK_X} y={BASE_Y} width={STACK_W} height={BASE_H} fill="#414d5c" stroke="#16191f" strokeWidth={1} />
        <text className="hbm-w" x={STACK_X + 8} y={BASE_Y + 17}>
          Base logic die
        </text>

        {/* Through-silicon vias */}
        {Array.from({ length: 7 }, (_, i) => {
          const x = STACK_X + 92 + i * 13;
          return <line key={`tsv-${i}`} className="hbm-tsv" x1={x} y1={TOP_DIE_Y} x2={x} y2={BASE_Y + BASE_H} />;
        })}

        {/* PHY link between accelerator and base die */}
        <line className="hbm-phy" x1={300} y1={386} x2={STACK_X} y2={386} />
        <text className="hbm-phyl" x={365} y={376} textAnchor="middle">
          HBM PHY link
        </text>

        {/* Right-hand annotations */}
        <text className="hbm-s" x={632} y={172}>
          12 DRAM dies on a base logic die
        </text>
        <text className="hbm-g" x={632} y={188}>
          HBM4 volume part: up to 36 GB
        </text>

        <line className="hbm-call" x1={STACK_X + STACK_W - 6} y1={252} x2={626} y2={252} />
        <text className="hbm-tsvl" x={632} y={248}>
          TSVs (through-silicon vias)
        </text>
        <text className="hbm-g" x={632} y={264}>
          vertical wires through every die
        </text>

        <line className="hbm-call" x1={STACK_X + STACK_W} y1={385} x2={626} y2={372} />
        <text className="hbm-t" x={632} y={360}>
          Base logic die: holds the PHY
        </text>
        <text className="hbm-g" x={632} y={376}>
          (physical layer) driving the wires
        </text>
      </svg>
    </div>
  );
}
