import React from 'react';

// Conventional path versus compute-in-memory, with the energy per multiply-accumulate by
// operand source (Samsung, Hot Chips 35, slide 3) and the in-stack versus host bandwidth of
// Samsung's HBM2-PIM (Hot Chips 33). Every figure is cited in the text of
// ComputeInMemory.tsx around the diagram and in its d-Matrix and SK hynix paragraphs.

const VB_W = 880;
const VB_H = 440;

const ink = '#16191f';
const sub = '#5f6b7a';
const amber = '#ec7211';
const amberFill = '#fdf3ec';
const green = '#037f0c';
const greenFill = '#ecf7ec';
const red = '#d91515';
const blueFill = '#f2f8fd';
const blue = '#0972d3';

// Energy per MAC by where the operand comes from, normalized to the MAC itself.
const energy = [
  { label: 'Register file', x: 1, value: '1x' },
  { label: 'On-chip buffer', x: 6, value: '6x' },
  { label: 'DRAM', x: 200, value: '200x' },
];
const BAR_X = 160;
const BAR_MAX = 210; // 200x

// Four banks inside the PIM stack box.
const BANK_X0 = 478;
const BANK_W = 81;
const BANK_GAP = 10;
const banks = [0, 1, 2, 3].map((i) => BANK_X0 + i * (BANK_W + BANK_GAP));

export function CimDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="cim-diagram-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="cim-diagram-title">
          Compute-in-memory moves the arithmetic to the data. On the conventional path every
          operand crosses the bus, and fetching one from DRAM costs about 200 times the energy of
          the multiply-accumulate that uses it. With a unit beside each pair of DRAM banks, as on
          Samsung&apos;s HBM2-PIM, a GPU&apos;s four stacks read operands at 4.92 TB/s inside the
          memory against 1.23 TB/s over the host link, so the bandwidth wall moves out by 4x and
          does not disappear.
        </title>
        <defs>
          <marker
            id="cim-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ink} />
          </marker>
        </defs>
        <rect x={0} y={0} width={VB_W} height={VB_H} rx={8} fill="#ffffff" />

        <g fontFamily="sans-serif">
          <text x={20} y={30} fontSize={14} fontWeight={700} fill={ink}>
            Compute-in-memory: do the arithmetic where the bytes live
          </text>

          {/* Left: conventional path */}
          <rect x={20} y={48} width={410} height={376} rx={8} fill={amberFill} stroke={amber} strokeWidth={1.5} />
          <text x={36} y={74} fontSize={13} fontWeight={700} fill={ink}>
            Conventional path
          </text>
          <text x={36} y={92} fontSize={11} fill={sub}>
            Every operand crosses the bus, and the result crosses back
          </text>

          <rect x={36} y={108} width={104} height={56} rx={6} fill="#ffffff" stroke={amber} strokeWidth={1.5} />
          <text x={88} y={132} fontSize={12} fontWeight={600} fill={ink} textAnchor="middle">
            CPU / GPU
          </text>
          <text x={88} y={150} fontSize={11} fill={sub} textAnchor="middle">
            MAC units
          </text>

          <rect x={164} y={108} width={112} height={56} rx={6} fill="#ffffff" stroke={amber} strokeWidth={1.5} />
          <text x={220} y={132} fontSize={12} fontWeight={600} fill={ink} textAnchor="middle">
            DDR / HBM
          </text>
          <text x={220} y={150} fontSize={11} fill={sub} textAnchor="middle">
            bus
          </text>

          <rect x={300} y={108} width={114} height={56} rx={6} fill="#ffffff" stroke={amber} strokeWidth={1.5} />
          <text x={357} y={132} fontSize={12} fontWeight={600} fill={ink} textAnchor="middle">
            DRAM array
          </text>
          <text x={357} y={150} fontSize={11} fill={sub} textAnchor="middle">
            weights
          </text>

          {/* operands travel left, results travel right */}
          <line x1={162} y1={126} x2={143} y2={126} stroke={ink} strokeWidth={1.5} markerEnd="url(#cim-ah)" />
          <line x1={298} y1={126} x2={279} y2={126} stroke={ink} strokeWidth={1.5} markerEnd="url(#cim-ah)" />
          <line x1={142} y1={146} x2={161} y2={146} stroke={ink} strokeWidth={1.5} markerEnd="url(#cim-ah)" />
          <line x1={278} y1={146} x2={297} y2={146} stroke={ink} strokeWidth={1.5} markerEnd="url(#cim-ah)" />

          <text x={36} y={198} fontSize={12} fontWeight={600} fill={ink}>
            Energy per MAC, by where the operand comes from
          </text>
          {energy.map((e, i) => {
            const cy = 222 + i * 26;
            const w = Math.max(2, (e.x / 200) * BAR_MAX);
            const isDram = e.x === 200;
            return (
              <g key={e.label}>
                <text x={36} y={cy + 4} fontSize={11} fill={ink}>
                  {e.label}
                </text>
                <rect x={BAR_X} y={cy - 7} width={w} height={14} fill={isDram ? red : amber} />
                <text
                  x={BAR_X + w + 6}
                  y={cy + 4}
                  fontSize={isDram ? 12 : 11}
                  fontWeight={isDram ? 700 : 400}
                  fill={isDram ? red : ink}
                >
                  {e.value}
                </text>
              </g>
            );
          })}
          <text x={36} y={302} fontSize={10} fill={sub}>
            Bars to scale; the MAC itself is 1x
          </text>

          <text x={36} y={336} fontSize={12} fontWeight={700} fill={red}>
            A DRAM fetch costs about 200x the MAC that uses it
          </text>
          <text x={36} y={358} fontSize={11} fill={ink}>
            The energy of each operation is mostly the trip
          </text>
          <text x={36} y={384} fontSize={11} fill={ink}>
            Faster pins and wider buses move the bandwidth wall
          </text>
          <text x={36} y={400} fontSize={11} fill={ink}>
            out; they do not shorten the trip
          </text>

          {/* Right: compute-in-memory */}
          <rect x={450} y={48} width={410} height={376} rx={8} fill={greenFill} stroke={green} strokeWidth={1.5} />
          <text x={466} y={74} fontSize={13} fontWeight={700} fill={ink}>
            Compute-in-memory
          </text>
          <text x={466} y={92} fontSize={11} fill={sub}>
            One unit per two banks; only results leave the memory
          </text>

          <rect x={466} y={108} width={378} height={34} rx={6} fill="#ffffff" stroke={green} strokeWidth={1.5} />
          <text x={655} y={130} fontSize={11} fontWeight={600} fill={ink} textAnchor="middle">
            Host GPU or FPGA, unmodified HBM controller
          </text>

          <line
            x1={560}
            y1={145}
            x2={560}
            y2={165}
            stroke={ink}
            strokeWidth={1.5}
            markerStart="url(#cim-ah)"
            markerEnd="url(#cim-ah)"
          />
          <text x={574} y={159} fontSize={11} fontWeight={600} fill={ink}>
            host link: 1.23 TB/s
          </text>

          <rect x={466} y={168} width={378} height={96} rx={6} fill="#ffffff" stroke={green} strokeWidth={1.5} />
          <text x={655} y={186} fontSize={12} fontWeight={700} fill={green} textAnchor="middle">
            Aquabolt-XL HBM2-PIM, four stacks
          </text>
          {banks.map((x) => (
            <g key={x}>
              <rect x={x} y={196} width={BANK_W} height={26} fill={blueFill} stroke={blue} strokeWidth={1} />
              <text x={x + BANK_W / 2} y={213} fontSize={11} fill={ink} textAnchor="middle">
                2 banks
              </text>
              <rect x={x} y={228} width={BANK_W} height={26} fill={amberFill} stroke={amber} strokeWidth={1} />
              <text x={x + BANK_W / 2} y={245} fontSize={11} fontWeight={600} fill={ink} textAnchor="middle">
                PIM unit
              </text>
            </g>
          ))}

          <text x={466} y={288} fontSize={12} fontWeight={700} fill={green}>
            Bank-level units see 4.92 TB/s, 4x the host link
          </text>

          <text x={466} y={316} fontSize={12} fontWeight={600} fill={ink}>
            Built examples
          </text>
          <text x={466} y={336} fontSize={11} fill={ink}>
            Samsung HBM2-PIM (Aquabolt-XL): demonstrator
          </text>
          <text x={466} y={354} fontSize={11} fill={ink}>
            d-Matrix Corsair: 2 GB at 150 TB/s for compute,
          </text>
          <text x={478} y={370} fontSize={11} fill={ink}>
            up to 256 GB at 400 GB/s for capacity
          </text>
          <text x={466} y={388} fontSize={11} fill={ink}>
            SK hynix AiMX (GDDR6-AiM): prototype, CES 2026
          </text>
          <text x={466} y={412} fontSize={12} fontStyle="italic" fontWeight={600} fill={green}>
            Bet: cut the dominant cost, data movement
          </text>
        </g>
      </svg>
    </div>
  );
}
