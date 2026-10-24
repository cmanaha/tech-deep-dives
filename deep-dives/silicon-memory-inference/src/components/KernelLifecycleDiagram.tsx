import React from 'react';

// One kernel launch on an NVIDIA GPU, as seven numbered stages in three bands:
// the host CPU (1, 2), the GPU-wide block scheduler (3), and the inside of one
// SM (4 to 7), with the device-wide L2 and HBM underneath. The two scheduler
// stages share a colour so the two levels read as one idea. Every figure drawn
// here is cited in the caption the section renders under the diagram.

interface StageBox {
  num: number;
  x: number;
  title: string;
  lines: string[];
  kind: 'host' | 'sched' | 'data' | 'math';
}

const smStages: StageBox[] = [
  {
    num: 4,
    x: 94,
    title: 'Warp scheduling',
    lines: ['Scheduler 2 of 2: each', 'issue cycle, it picks a', 'warp that is ready'],
    kind: 'sched',
  },
  {
    num: 5,
    x: 285,
    title: 'Operand staging',
    lines: ['TMA or async copy pulls', 'tiles from HBM into', 'SMEM as warps compute'],
    kind: 'data',
  },
  {
    num: 6,
    x: 476,
    title: 'Tensor Core',
    lines: ['The only stage doing', 'math: wgmma (Hopper),', 'tcgen05.mma (Blackwell)'],
    kind: 'math',
  },
  {
    num: 7,
    x: 667,
    title: 'Write back',
    lines: ['Result goes to SMEM,', 'to HBM, or across the', 'host link to the CPU'],
    kind: 'data',
  },
];

const SM_BOX_W = 171;
const SM_BOX_Y = 266;
const SM_BOX_H = 96;

function Badge({ cx, cy, n, kind }: { cx: number; cy: number; n: number; kind: StageBox['kind'] }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} className={`kl-dot-${kind}`} />
      <text x={cx} y={cy + 4} className="kl-num">
        {n}
      </text>
    </g>
  );
}

export function KernelLifecycleDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 480"
        role="img"
        aria-labelledby="kernel-lifecycle-title"
        style={{ width: '100%', height: 'auto', minWidth: 680, display: 'block' }}
      >
        <title id="kernel-lifecycle-title">
          One kernel launch on an NVIDIA GPU passes through seven stages. On the host CPU the
          framework picks a kernel and the driver queues the launch. On the GPU, two schedulers
          decide where the work runs: the GigaThread engine spreads thread blocks across the
          SMs, and inside each SM a warp scheduler issues a ready warp at each issue cycle. TMA or async
          copy then stages operands from L2 and HBM into shared memory, the Tensor Core does the
          math, and the result is written back to shared memory, HBM or the host.
        </title>
        <style>{`
          .kl-band { fill: #f8f9fa; stroke: #d1d5db; stroke-width: 1; }
          .kl-band-label { fill: #414d5c; font: 600 11px sans-serif; }
          .kl-box-host { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .kl-box-sched { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .kl-box-data { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .kl-box-math { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .kl-box-mem { fill: #ffffff; stroke: #414d5c; stroke-width: 1.5; }
          .kl-sm { fill: #ffffff; stroke: #0972d3; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .kl-dot-host { fill: #0972d3; }
          .kl-dot-sched { fill: #6f4cc4; }
          .kl-dot-data { fill: #1f7a70; }
          .kl-dot-math { fill: #037f0c; }
          .kl-num { fill: #ffffff; font: 700 11px sans-serif; text-anchor: middle; }
          .kl-t { fill: #16191f; font: 600 13px sans-serif; }
          .kl-s { fill: #414d5c; font: 11px sans-serif; }
          .kl-sm-label { fill: #065299; font: 600 11px sans-serif; }
          .kl-edge { fill: #5f6b7a; font: 11px sans-serif; }
          .kl-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#kl-ah); }
        `}</style>
        <defs>
          <marker
            id="kl-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x="0" y="0" width="880" height="480" rx="8" fill="#ffffff" />

        {/* Band A: host CPU, stages 1 and 2 */}
        <rect x="12" y="12" width="856" height="92" rx="6" className="kl-band" />
        <text x="22" y="40" className="kl-band-label">
          HOST
        </text>
        <text x="22" y="54" className="kl-band-label">
          CPU
        </text>

        <rect x="80" y="24" width="372" height="68" rx="6" className="kl-box-host" />
        <Badge cx={98} cy={44} n={1} kind="host" />
        <text x="116" y="49" className="kl-t">
          Host issue
        </text>
        <text x="92" y="78" className="kl-s">
          The framework picks a kernel (cuBLAS, Triton)
        </text>

        <rect x="476" y="24" width="376" height="68" rx="6" className="kl-box-host" />
        <Badge cx={494} cy={44} n={2} kind="host" />
        <text x="512" y="49" className="kl-t">
          Driver submit
        </text>
        <text x="488" y="78" className="kl-s">
          The CUDA driver queues the launch for the GPU
        </text>

        <line x1="452" y1="58" x2="474" y2="58" className="kl-arr" />

        {/* Host link, between the bands */}
        <line x1="664" y1="92" x2="664" y2="148" className="kl-arr" />
        <text x="676" y="125" className="kl-edge">
          PCIe or NVLink-C2C
        </text>

        {/* Band B: the GPU */}
        <rect x="12" y="136" width="856" height="332" rx="6" className="kl-band" />
        <text x="22" y="164" className="kl-band-label">
          GPU
        </text>

        <rect x="80" y="150" width="772" height="62" rx="6" className="kl-box-sched" />
        <Badge cx={98} cy={170} n={3} kind="sched" />
        <text x="116" y="175" className="kl-t">
          Block dispatch: the GigaThread engine (scheduler 1 of 2)
        </text>
        <text x="92" y="200" className="kl-s">
          Spreads the grid&apos;s thread blocks across the SMs, in no guaranteed order; each
          block runs on one SM
        </text>

        <line x1="466" y1="212" x2="466" y2="236" className="kl-arr" />
        <text x="478" y="229" className="kl-edge">
          thread blocks
        </text>

        {/* One SM, stages 4 to 7 */}
        <rect x="80" y="238" width="772" height="136" rx="6" className="kl-sm" />
        <text x="94" y="256" className="kl-sm-label">
          INSIDE EACH SM (132 ON AN H100 SXM)
        </text>

        {smStages.map((s) => (
          <g key={s.num}>
            <rect
              x={s.x}
              y={SM_BOX_Y}
              width={SM_BOX_W}
              height={SM_BOX_H}
              rx="6"
              className={`kl-box-${s.kind}`}
            />
            <Badge cx={s.x + 17} cy={SM_BOX_Y + 20} n={s.num} kind={s.kind} />
            <text x={s.x + 34} y={SM_BOX_Y + 25} className="kl-t">
              {s.title}
            </text>
            {s.lines.map((line, i) => (
              <text key={line} x={s.x + 11} y={SM_BOX_Y + 50 + i * 16} className="kl-s">
                {line}
              </text>
            ))}
          </g>
        ))}

        {smStages.slice(0, -1).map((s) => (
          <line
            key={`arr-${s.num}`}
            x1={s.x + SM_BOX_W}
            y1={SM_BOX_Y + SM_BOX_H / 2}
            x2={s.x + SM_BOX_W + 19}
            y2={SM_BOX_Y + SM_BOX_H / 2}
            className="kl-arr"
          />
        ))}

        {/* Device-wide memory under the SM */}
        <line x1="370" y1="402" x2="370" y2="364" className="kl-arr" />
        <text x="380" y="392" className="kl-edge">
          operands in
        </text>
        <line x1="752" y1="362" x2="752" y2="400" className="kl-arr" />
        <text x="764" y="392" className="kl-edge">
          results out
        </text>

        <rect x="80" y="402" width="772" height="54" rx="6" className="kl-box-mem" />
        <text x="94" y="423" className="kl-t">
          L2 cache and HBM, shared by every SM
        </text>
        <text x="94" y="444" className="kl-s">
          Measured load latency on an H800 PCIe: L2 about 263 cycles, HBM about 479, against
          about 29 for SMEM
        </text>
      </svg>
    </div>
  );
}
