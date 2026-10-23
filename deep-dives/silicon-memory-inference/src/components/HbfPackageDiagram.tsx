import React from 'react';

// Four accelerator packages seen from above: the three Sandisk examples (eight HBM,
// eight HBF, six HBF plus two HBM) and the OCP specification's example (two HBF plus
// four HBM). Stack positions are schematic. Every figure drawn here is cited in the
// caption the section renders below the SVG.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways.

type Kind = 'hbf' | 'hbm';

interface Panel {
  title: string;
  origin: string;
  left: Kind[];
  right: Kind[];
  capacity: string;
  lines: string[];
}

const PANELS: Panel[] = [
  {
    title: '8 HBM stacks',
    origin: 'Sandisk example (2025)',
    left: ['hbm', 'hbm', 'hbm', 'hbm'],
    right: ['hbm', 'hbm', 'hbm', 'hbm'],
    capacity: '192 GB',
    lines: ['8 x 24 GB HBM'],
  },
  {
    title: '8 HBF stacks',
    origin: 'Sandisk example (2025)',
    left: ['hbf', 'hbf', 'hbf', 'hbf'],
    right: ['hbf', 'hbf', 'hbf', 'hbf'],
    capacity: '4,096 GB',
    lines: ['8 x 512 GB HBF', '12.8 TB/s at Gen 1 speed'],
  },
  {
    title: '6 HBF + 2 HBM',
    origin: 'Sandisk example (2025)',
    left: ['hbm', 'hbf', 'hbf', 'hbf'],
    right: ['hbm', 'hbf', 'hbf', 'hbf'],
    capacity: '3,120 GB',
    lines: ['6 x 512 GB + 2 x 24 GB'],
  },
  {
    title: '2 HBF + 4 HBM',
    origin: 'OCP specification example',
    left: ['hbm', 'hbf', 'hbm'],
    right: ['hbm', 'hbf', 'hbm'],
    capacity: '1,168 GiB',
    lines: ['2 x 512 GiB + 4 x 36 GiB', 'two separate address spaces'],
  },
];

const PANEL_X = [20, 230, 440, 650];

function siteRows(count: number): number[] {
  const step = 30;
  const height = count * 24 + (count - 1) * 6;
  const start = 171 - height / 2;
  return Array.from({ length: count }, (_, i) => start + i * step);
}

function Site({ x, y, kind }: { x: number; y: number; kind: Kind }) {
  return (
    <g>
      <rect className={kind === 'hbf' ? 'hbfp-hbf' : 'hbfp-hbm'} x={x} y={y} width="34" height="24" rx="3" />
      <text className="hbfp-st" x={x + 17} y={y + 16}>
        {kind === 'hbf' ? 'HBF' : 'HBM'}
      </text>
    </g>
  );
}

export function HbfPackageDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 392"
        role="img"
        aria-labelledby="hbf-package-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="hbf-package-title">
          The same package sites filled four ways. Sandisk&apos;s examples give 192 GB with
          eight HBM stacks, 4,096 GB with eight HBF stacks and 3,120 GB with six HBF and two
          HBM stacks; the OCP specification&apos;s example of two HBF and four HBM stacks
          gives 1,168 GiB in two separately managed address spaces. Eight first-generation
          HBF stacks read at 12.8 TB/s, against 22 TB/s for a Rubin GPU&apos;s 288 GB of HBM4.
        </title>
        <style>{`
          .hbfp-panel { fill: #fafbfc; stroke: #d1d5db; stroke-width: 1.5; }
          .hbfp-sub { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .hbfp-xpu { fill: #e9ebed; stroke: #414d5c; stroke-width: 1.5; }
          .hbfp-hbf { fill: #0972d3; stroke: #065299; stroke-width: 1; }
          .hbfp-hbm { fill: #6f4cc4; stroke: #4b2f99; stroke-width: 1; }
          .hbfp-h { fill: #16191f; font: 600 13px sans-serif; }
          .hbfp-lg { fill: #414d5c; font: 11px sans-serif; }
          .hbfp-pt { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfp-po { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .hbfp-x { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfp-st { fill: #ffffff; font: 600 10px sans-serif; text-anchor: middle; }
          .hbfp-cap { fill: #16191f; font: 600 15px sans-serif; text-anchor: middle; }
          .hbfp-ln { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .hbfp-foot { fill: #414d5c; font: 11px sans-serif; }
        `}</style>

        <rect x="0" y="0" width="860" height="392" rx="8" fill="#ffffff" stroke="#e9ebed" />

        <text className="hbfp-h" x="20" y="28">
          The same package sites, filled four ways
        </text>
        <rect className="hbfp-hbf" x="590" y="18" width="12" height="12" />
        <text className="hbfp-lg" x="608" y="28">
          HBF stack (NAND)
        </text>
        <rect className="hbfp-hbm" x="722" y="18" width="12" height="12" />
        <text className="hbfp-lg" x="740" y="28">
          HBM stack (DRAM)
        </text>

        {PANELS.map((p, i) => {
          const px = PANEL_X[i];
          const cx = px + 95;
          return (
            <g key={p.title}>
              <rect className="hbfp-panel" x={px} y="46" width="190" height="284" rx="8" />
              <text className="hbfp-pt" x={cx} y="70">
                {p.title}
              </text>
              <text className="hbfp-po" x={cx} y="86">
                {p.origin}
              </text>
              <rect className="hbfp-sub" x={px + 12} y="98" width="166" height="152" rx="4" />
              <rect className="hbfp-xpu" x={px + 62} y="112" width="66" height="124" rx="4" />
              <text className="hbfp-x" x={cx} y="178">
                xPU
              </text>
              {siteRows(p.left.length).map((y, r) => (
                <Site key={`l${r}`} x={px + 20} y={y} kind={p.left[r]} />
              ))}
              {siteRows(p.right.length).map((y, r) => (
                <Site key={`r${r}`} x={px + 136} y={y} kind={p.right[r]} />
              ))}
              <text className="hbfp-cap" x={cx} y="278">
                {p.capacity}
              </text>
              {p.lines.map((line, k) => (
                <text key={line} className="hbfp-ln" x={cx} y={298 + k * 16}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        <text className="hbfp-foot" x="20" y="362">
          For scale: one Rubin GPU carries 288 GB of HBM4 at 22 TB/s. Stack positions are
          schematic.
        </text>
      </svg>
    </div>
  );
}
