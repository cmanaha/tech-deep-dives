import React from 'react';

// Sweeps per second (bandwidth divided by capacity) for HBF stacks, HBM4 stacks and
// one CPU memory system, on a log axis computed here without a charting library.
// Every value drawn is cited in the caption the section renders below the SVG.
//
// On a phone the SVG keeps a 600 px minimum width and the wrapper scrolls sideways.

type Group = 'cpu' | 'hbf' | 'hbm' | 'hbmRoadmap';

interface Bar {
  name: string;
  detail: string;
  low: number;
  high?: number;
  label: string;
  group: Group;
  top: number;
}

const BARS: Bar[] = [
  { name: 'Vera CPU, LPDDR5X', detail: '1.2 TB/s over 1.5 TB', low: 0.8, label: '0.8', group: 'cpu', top: 62 },
  { name: 'HBF grade 1, 8-high', detail: '0.384 TB/s over 256 GiB', low: 1.397, label: '1.4', group: 'hbf', top: 106 },
  { name: 'HBF grade 2, 16-high', detail: '1.536 TB/s over 512 GiB', low: 2.794, label: '2.8', group: 'hbf', top: 142 },
  { name: 'Sandisk HBF Gen 1', detail: '1.6 TB/s over 512 GB', low: 3.125, label: '3.1', group: 'hbf', top: 178 },
  { name: 'HBF grade 3, 16-high', detail: '3.072 TB/s over 512 GiB', low: 5.588, label: '5.6', group: 'hbf', top: 214 },
  { name: 'HBM4, JEDEC 8 Gb/s bin', detail: '2.05 TB/s over 36 GB', low: 56.9, label: '57', group: 'hbm', top: 258 },
  {
    name: 'HBM4 shipping, 12-high',
    detail: '2.8 to 3.3 TB/s over 36 GB',
    low: 77.8,
    high: 91.7,
    label: '78 to 92',
    group: 'hbm',
    top: 294,
  },
  { name: 'HBM4E samples, 12-high', detail: '4.1 TB/s over 48 GB', low: 85.3, label: '85', group: 'hbmRoadmap', top: 330 },
];

const X0 = 300;
const W = 480;
const LO = 0.5;
const HI = 100;
const x = (v: number) => X0 + (W * Math.log10(v / LO)) / Math.log10(HI / LO);

const TICKS = [0.5, 1, 2, 5, 10, 20, 50, 100];
const MAJOR = new Set([1, 10, 100]);

const barClass: Record<Group, string> = {
  cpu: 'hbfw-cpu',
  hbf: 'hbfw-hbf',
  hbm: 'hbfw-hbm',
  hbmRoadmap: 'hbfw-hbm4e',
};

export function HbfSweepsChart() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 424"
        role="img"
        aria-labelledby="hbf-sweeps-title"
        style={{ width: '100%', minWidth: 600, height: 'auto', display: 'block' }}
      >
        <title id="hbf-sweeps-title">
          Bandwidth divided by capacity gives how many times a second a memory device can be
          read end to end. An HBF stack manages 1.4 to 5.6 sweeps a second depending on its
          grade, and Sandisk&apos;s first product about 3.1, while a shipping HBM4 stack
          manages 78 to 92 and a Vera CPU&apos;s LPDDR5X about 0.8: HBF sits about 25 to 30
          times below HBM4 on this measure.
        </title>
        <style>{`
          .hbfw-grid { stroke: #e9ebed; stroke-width: 1; }
          .hbfw-major { stroke: #d1d5db; stroke-width: 1; }
          .hbfw-axis { stroke: #5f6b7a; stroke-width: 1.5; }
          .hbfw-cpu { fill: #879596; }
          .hbfw-hbf { fill: #0972d3; }
          .hbfw-hbm { fill: #6f4cc4; }
          .hbfw-hbm-range { fill: #c9b8ef; }
          .hbfw-hbm4e { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; stroke-dasharray: 5 3; }
          .hbfw-note { fill: #ffffff; stroke: #d1d5db; stroke-width: 1.5; }
          .hbfw-h { fill: #16191f; font: 600 13px sans-serif; }
          .hbfw-s { fill: #5f6b7a; font: 11px sans-serif; }
          .hbfw-n { fill: #16191f; font: 600 12px sans-serif; text-anchor: end; }
          .hbfw-d { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .hbfw-v { fill: #16191f; font: 600 12px sans-serif; }
          .hbfw-t { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .hbfw-ax { fill: #5f6b7a; font: 11px sans-serif; text-anchor: end; }
          .hbfw-c { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .hbfw-cb { fill: #0972d3; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfw-l { fill: #414d5c; font: 11px sans-serif; }
        `}</style>

        <rect x="0" y="0" width="860" height="424" rx="8" fill="#ffffff" stroke="#e9ebed" />

        <text className="hbfw-h" x="20" y="28">
          Sweeps per second: bandwidth divided by capacity
        </text>
        <text className="hbfw-s" x="20" y="46">
          How many times a second the whole device can be read end to end
        </text>

        {TICKS.map((t) => (
          <line
            key={t}
            className={MAJOR.has(t) ? 'hbfw-major' : 'hbfw-grid'}
            x1={x(t)}
            y1="58"
            x2={x(t)}
            y2="370"
          />
        ))}

        {BARS.map((b) => {
          const end = x(b.high ?? b.low);
          return (
            <g key={b.name}>
              <text className="hbfw-n" x="288" y={b.top + 15}>
                {b.name}
              </text>
              <text className="hbfw-d" x="288" y={b.top + 30}>
                {b.detail}
              </text>
              <rect
                className={barClass[b.group]}
                x={X0}
                y={b.top + 8}
                width={x(b.low) - X0}
                height="20"
              />
              {b.high && (
                <rect
                  className="hbfw-hbm-range"
                  x={x(b.low)}
                  y={b.top + 8}
                  width={x(b.high) - x(b.low)}
                  height="20"
                />
              )}
              <text className="hbfw-v" x={end + 8} y={b.top + 23}>
                {b.label}
              </text>
            </g>
          );
        })}

        <line className="hbfw-axis" x1={X0} y1="370" x2={X0 + W} y2="370" />
        {TICKS.map((t) => (
          <text key={`t${t}`} className="hbfw-t" x={x(t)} y="386">
            {t}
          </text>
        ))}

        <rect className="hbfw-note" x="568" y="112" width="208" height="64" rx="6" />
        <text className="hbfw-cb" x="672" y="132">
          HBF stack: about 3 a second
        </text>
        <text className="hbfw-c" x="672" y="150">
          HBM4 stack: about 80
        </text>
        <text className="hbfw-c" x="672" y="167">
          25 to 30 times fewer sweeps
        </text>

        <rect className="hbfw-hbf" x="20" y="400" width="12" height="12" />
        <text className="hbfw-l" x="38" y="410">
          HBF stack (not shipping)
        </text>
        <rect className="hbfw-hbm" x="200" y="400" width="12" height="12" />
        <text className="hbfw-l" x="218" y="410">
          HBM4 stack
        </text>
        <rect className="hbfw-cpu" x="300" y="400" width="12" height="12" />
        <text className="hbfw-l" x="318" y="410">
          CPU memory
        </text>
        <text className="hbfw-ax" x="780" y="410">
          sweeps per second, log scale
        </text>
      </svg>
    </div>
  );
}
