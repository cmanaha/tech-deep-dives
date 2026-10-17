import React from 'react';

// Placement map for inference data on HBF: reads per write (left to right) decides
// whether flash endurance can carry an object; the share of the stored set that one
// decode step reads (bottom to top) decides whether the sweep rate caps its speed.
// Positions are qualitative and follow the placement evidence cited in the section.
//
// On a phone the SVG keeps a 600 px minimum width and the wrapper scrolls sideways.

type Fit = 'keep' | 'maybe' | 'fit';

interface Point {
  x: number;
  y: number;
  name: string;
  note: string;
  fit: Fit;
}

const POINTS: Point[] = [
  { x: 140, y: 90, name: 'Activations', note: 'rewritten every layer', fit: 'keep' },
  { x: 180, y: 160, name: 'Per-request decode KV', note: 'writes outnumber reads', fit: 'keep' },
  { x: 400, y: 196, name: 'Session KV', note: 'depends on reuse and wear', fit: 'maybe' },
  { x: 400, y: 296, name: 'Sparse long-context KV', note: 'read in page-sized pieces', fit: 'maybe' },
  { x: 610, y: 90, name: 'Dense weights', note: 'token rate capped by sweeps', fit: 'fit' },
  { x: 610, y: 170, name: 'Shared prefixes, context', note: 'written once, read often', fit: 'fit' },
  { x: 610, y: 250, name: 'Resident models', note: 'no reload to switch model', fit: 'fit' },
  { x: 640, y: 322, name: 'MoE expert pools', note: 'strongest fit', fit: 'fit' },
];

const dotClass: Record<Fit, string> = {
  keep: 'hbfm-dk',
  maybe: 'hbfm-dm',
  fit: 'hbfm-df',
};

export function HbfPlacementMap() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 416"
        role="img"
        aria-labelledby="hbf-placement-title"
        style={{ width: '100%', minWidth: 600, height: 'auto', display: 'block' }}
      >
        <title id="hbf-placement-title">
          Two questions place inference data on HBF. Data written every token or layer, such
          as activations and per-request decode KV cache, stays in HBM or SRAM. Data written
          once and read for hours, such as model weights, resident models and shared context,
          fits on HBF, and MoE expert pools fit best because each step reads a small share of
          them; dense weights fit, but their token rate is capped by the sweep rate. Session
          KV and sparse long-context KV are conditional.
        </title>
        <style>{`
          .hbfm-rk { fill: #fdf3ec; }
          .hbfm-rm { fill: #f4f4f4; }
          .hbfm-rf { fill: #ecf7ec; }
          .hbfm-axis { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#hbfm-ah); }
          .hbfm-dk { fill: #ec7211; stroke: #ffffff; stroke-width: 1.5; }
          .hbfm-dm { fill: #5f6b7a; stroke: #ffffff; stroke-width: 1.5; }
          .hbfm-df { fill: #037f0c; stroke: #ffffff; stroke-width: 1.5; }
          .hbfm-h { fill: #16191f; font: 600 13px sans-serif; }
          .hbfm-hk { fill: #8b4a00; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfm-hm { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfm-hf { fill: #037f0c; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfm-n { fill: #16191f; font: 600 12px sans-serif; }
          .hbfm-s { fill: #414d5c; font: 11px sans-serif; }
          .hbfm-ax { fill: #5f6b7a; font: 11px sans-serif; }
          .hbfm-axe { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .hbfm-at { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="hbfm-ah"
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

        <rect x="0" y="0" width="860" height="416" rx="8" fill="#ffffff" stroke="#e9ebed" />

        <text className="hbfm-h" x="20" y="28">
          Where inference data belongs: reads per write against share read per step
        </text>

        {/* Regions */}
        <rect className="hbfm-rk" x="110" y="44" width="240" height="316" />
        <rect className="hbfm-rm" x="350" y="44" width="240" height="316" />
        <rect className="hbfm-rf" x="590" y="44" width="240" height="316" />
        <text className="hbfm-hk" x="230" y="64">
          Keep in HBM or SRAM
        </text>
        <text className="hbfm-hm" x="470" y="64">
          Conditional
        </text>
        <text className="hbfm-hf" x="710" y="64">
          Put on HBF
        </text>

        {/* Axes */}
        <line className="hbfm-axis" x1="110" y1="360" x2="836" y2="360" />
        <line className="hbfm-axis" x1="110" y1="360" x2="110" y2="40" />
        <text className="hbfm-ax" x="110" y="378">
          rewritten every token or layer
        </text>
        <text className="hbfm-axe" x="830" y="378">
          written once, read for hours
        </text>
        <text className="hbfm-at" x="470" y="400">
          reads per write
        </text>
        <text className="hbfm-axe" x="102" y="62">
          all of it
        </text>
        <text className="hbfm-axe" x="102" y="76">
          every step
        </text>
        <text className="hbfm-axe" x="102" y="338">
          a few %
        </text>
        <text className="hbfm-axe" x="102" y="352">
          per step
        </text>
        <text className="hbfm-at" x="44" y="205" transform="rotate(-90 44 205)">
          share read per step
        </text>

        {/* Points */}
        {POINTS.map((p) => (
          <g key={p.name}>
            <circle className={dotClass[p.fit]} cx={p.x} cy={p.y} r="7" />
            <text className="hbfm-n" x={p.x + 13} y={p.y + 4}>
              {p.name}
            </text>
            <text className="hbfm-s" x={p.x + 13} y={p.y + 20}>
              {p.note}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
