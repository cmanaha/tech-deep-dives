import React from "react";

// What each platform fixes for you, what you pin, and the batch rule both share.
// Every control drawn here is cited where the section explains it.

const W = 860;
const H = 404;
const COL_W = 400;
const COL_Y = 50;
const COL_H = 236;
const LEFT_X = 20;
const RIGHT_X = 440;
const BAND_Y = 310;
const BAND_H = 76;

/** One bullet line: plain runs and monospace runs, drawn in order. */
type Item = Array<{ t: string; code?: boolean }>;

interface Column {
  x: number;
  name: string;
  tagline: string;
  fixedLabel: string;
  fixed: Item[];
  pinned: Item[];
  boxClass: string;
}

const columns: Column[] = [
  {
    x: LEFT_X,
    name: "Trainium",
    tagline: "The NEFF fixes the schedule; you pin the rest",
    fixedLabel: "Fixed at compile time",
    fixed: [
      [{ t: "Instruction order and memory allocation, in the NEFF" }],
      [{ t: "No warp scheduler; on-chip SRAM is software-managed" }],
    ],
    pinned: [
      [{ t: "The archived NEFF file, never a recompile" }],
      [
        { t: "NEURON_RT_STOCHASTIC_ROUNDING_SEED", code: true },
        { t: " fixed" },
      ],
      [{ t: "The bucket, chosen per step from the live batch" }],
      [{ t: "Neuron SDK version and instance type" }],
    ],
    boxClass: "det-trn",
  },
  {
    x: RIGHT_X,
    name: "NVIDIA GPU",
    tagline: "Libraries repeat per configuration; you set the rest",
    fixedLabel: "Fixed by the libraries",
    fixed: [
      [{ t: "cuBLAS: same bits per toolkit, architecture, SM count" }],
      [{ t: "cuDNN: most routines repeat on one architecture" }],
    ],
    pinned: [
      [{ t: "torch.use_deterministic_algorithms(True)", code: true }],
      [{ t: "torch.backends.cudnn.benchmark = False", code: true }],
      [
        { t: "CUBLAS_WORKSPACE_CONFIG=:4096:8", code: true },
        { t: " (several streams)" },
      ],
      [
        { t: "Seeds: " },
        { t: "torch.manual_seed", code: true },
        { t: ", per-request seed" },
      ],
    ],
    boxClass: "det-gpu",
  },
];

function ItemText({ x, y, item }: { x: number; y: number; item: Item }) {
  return (
    <text x={x} y={y} className="det-item">
      {"\u2022 "}
      {item.map((run, i) =>
        run.code ? (
          <tspan key={i} className="det-code">
            {run.t}
          </tspan>
        ) : (
          <tspan key={i}>{run.t}</tspan>
        ),
      )}
    </text>
  );
}

export function DeterminismDiagram() {
  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="determinism-paths-title"
        style={{
          width: "100%",
          minWidth: 640,
          height: "auto",
          display: "block",
        }}
      >
        <title id="determinism-paths-title">
          Trainium fixes instruction order and memory allocation in the NEFF at
          compile time, and a caller pins the archived NEFF, the rounding seed,
          the bucket and the SDK version. On NVIDIA GPUs the libraries repeat on
          one configuration, and a caller sets deterministic algorithms, turns
          off cuDNN benchmarking, sets the cuBLAS workspace for several streams
          and fixes seeds. On both, rely on a served model giving the same
          answer to the same request only with batch-invariant kernels or a
          fixed batch shape.
        </title>
        <style>{`
          .det-bg   { fill: #ffffff; }
          .det-trn  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 2; }
          .det-gpu  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .det-band { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
          .det-h    { fill: #16191f; font: 600 15px sans-serif; }
          .det-tag  { fill: #5f6b7a; font: 12px sans-serif; }
          .det-lab  { fill: #16191f; font: 600 12px sans-serif; }
          .det-item { fill: #16191f; font: 11px sans-serif; }
          .det-code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 11px; }
          .det-bh   { fill: #16191f; font: 600 13px sans-serif; }
          .det-arr  { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#det-ah); }
        `}</style>
        <defs>
          <marker
            id="det-ah"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect className="det-bg" x={0} y={0} width={W} height={H} rx={8} />
        <text x={20} y={30} className="det-bh">
          What makes a call repeat, per platform
        </text>

        {columns.map((c) => {
          const px = c.x + 18;
          return (
            <g key={c.name}>
              <rect
                className={c.boxClass}
                x={c.x}
                y={COL_Y}
                width={COL_W}
                height={COL_H}
                rx={10}
              />
              <text x={px} y={COL_Y + 28} className="det-h">
                {c.name}
              </text>
              <text x={px} y={COL_Y + 47} className="det-tag">
                {c.tagline}
              </text>
              <text x={px} y={COL_Y + 76} className="det-lab">
                {c.fixedLabel}
              </text>
              {c.fixed.map((it, i) => (
                <ItemText
                  key={`f${i}`}
                  x={px}
                  y={COL_Y + 95 + i * 18}
                  item={it}
                />
              ))}
              <text x={px} y={COL_Y + 148} className="det-lab">
                You pin
              </text>
              {c.pinned.map((it, i) => (
                <ItemText
                  key={`p${i}`}
                  x={px}
                  y={COL_Y + 167 + i * 18}
                  item={it}
                />
              ))}
            </g>
          );
        })}

        <line
          className="det-arr"
          x1={LEFT_X + COL_W / 2}
          y1={COL_Y + COL_H}
          x2={LEFT_X + COL_W / 2}
          y2={BAND_Y - 2}
        />
        <line
          className="det-arr"
          x1={RIGHT_X + COL_W / 2}
          y1={COL_Y + COL_H}
          x2={RIGHT_X + COL_W / 2}
          y2={BAND_Y - 2}
        />

        <rect
          className="det-band"
          x={LEFT_X}
          y={BAND_Y}
          width={W - 40}
          height={BAND_H}
          rx={10}
        />
        <text x={38} y={BAND_Y + 24} className="det-bh">
          In serving, on both: the batch decides
        </text>
        <text x={38} y={BAND_Y + 44} className="det-item">
          Rely on the same answer to the same request only with batch-invariant
          kernels or a fixed batch shape.
        </text>
        <text x={38} y={BAND_Y + 63} className="det-item">
          {"GPU: "}
          <tspan className="det-code">VLLM_BATCH_INVARIANT=1</tspan>
          {" (vLLM) or "}
          <tspan className="det-code">--enable-deterministic-inference</tspan>
          {" (SGLang). Trainium: a fixed bucket configuration."}
        </text>
      </svg>
    </div>
  );
}
